'use strict';

var EventTarget = require('./event-target'),
    util        = require('./util');

module.exports = Channel;

/**
 * Channel
 *
 * @param options
 * @constructor
 */
function Channel (options) {
    util.mixin(this, options);
}

util.mixin(Channel.prototype, EventTarget);
