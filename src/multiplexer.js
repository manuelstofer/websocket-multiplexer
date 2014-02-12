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
            close:  this.close.bind(this, channel_id)
        });
    this.channels[channel_id] = channel;
    this.dispatchEvent({ type: 'channel', channel: channel });
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
 */
Multiplexer.prototype.close = function (channel_id) {
    var packet = {
        channel_id: channel_id,
        close:      true
    };
    this.socket.send(this.serialize(packet));
    this.channels[channel_id].dispatchEvent({ type: 'close' });
    delete this.channels[channel_id];
};

/**
 * Process a received package
 *
 * @param evt
 */
Multiplexer.prototype.process = function (evt) {
    var packet  = this.unserialize(evt.data),
        channel = this.channels[packet.channel_id];

    if (packet.close) {
        if (this.channels[packet.channel_id]) {
            this.channels[packet.channel_id].dispatchEvent({ type: 'close' });
            delete this.channels[packet.channel_id];
        }
        return;
    }

    if (!channel) {
        channel = this.channel(packet.channel_id);
    }
    channel.dispatchEvent({ type: 'message', data: packet.data });
};
