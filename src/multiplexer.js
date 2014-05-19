'use strict';

var EventTarget = require('./event-target'),
    Channel     = require('./channel'),
    util        = require('./util');

module.exports = Multiplexer;


/**
 * Multiplexer for web socket connections
 *
 * @param options
 * @constructor
 */
function Multiplexer (options) {
    this.socket      = options.socket;
    this.serialize   = options.serialize   || JSON.stringify.bind(JSON);
    this.unserialize = options.unserialize || JSON.parse.bind(JSON);
    this.channels    = {};

    this.socket.addEventListener('message', this.process.bind(this));
    this.socket.addEventListener('close', this.close.bind(this));
}

util.mixin(Multiplexer.prototype, EventTarget);


/**
 * Create a new channel
 *
 * @param   name
 * @returns {Channel}
 */
Multiplexer.prototype.channel = function (name) {
    var channel_id = name || util.guid(),
        channel = new Channel({
            name:   channel_id,
            send:   this.send.bind(this, channel_id),
            close:  this.closeChannel.bind(this, channel_id, true)
        });
    this.channels[channel_id] = channel;
    return channel;
};

/**
 * Send a package over the websocket
 *
 * @param channel_id
 * @param data
 */
Multiplexer.prototype.send = function (channel_id, data) {
    var packet = {
        channel_id: channel_id,
        data:       data
    };
    this.socket.send(this.serialize(packet));
};

/**
 * Close a channel
 *
 * @param channel_id
 * @param send_close
 */
Multiplexer.prototype.closeChannel = function (channel_id, send_close) {
    if (send_close && this.socket.readyState === this.socket.OPEN) {
        var packet = {
            channel_id: channel_id,
            close:      true
        };
        this.socket.send(this.serialize(packet));
    }

    if (this.channels[channel_id]) {
        var channel = this.channels[channel_id];
        delete this.channels[channel_id];
        channel.dispatchEvent({ type: 'close' });
    }
};

/**
 * Close all channels
 */
Multiplexer.prototype.close = function () {
    for (var channel_id in this.channels) {
        this.closeChannel(channel_id);
    }
};

/**
 * Process a received package
 *
 * @param evt
 */
Multiplexer.prototype.process = function (evt) {
    var packet  = this.unserialize(evt.data);

    if (typeof packet === 'undefined' ||
        typeof packet.channel_id === 'undefined') { return; }

    var channel = this.channels[packet.channel_id];

    if (packet.close) {
        this.closeChannel(packet.channel_id, false);
        if (channel) {
            channel.dispatchEvent({ type: 'close' });
            delete this.channels[packet.channel_id];
        }
        return;
    }

    if (!channel) {
        channel = this.channel(packet.channel_id);
        this.dispatchEvent({ type: 'channel', channel: channel });
    }
    channel.dispatchEvent({ type: 'message', data: packet.data });
};
