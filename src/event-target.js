/**
 * Simplified EventTarget implementation: from SockJS (slightly adapted)
 */

'use strict';

var util = require('./util');

/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

/* Simplified implementation of DOM2 EventTarget.
 *   http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget
 */
module.exports = {

    addEventListener: function (eventType, listener) {
        if (!this._listeners) {
            this._listeners = {};
        }
        if (!(eventType in this._listeners)) {
            this._listeners[eventType] = [];
        }
        var arr = this._listeners[eventType];
        if (util.indexOf(arr, listener) === -1) {
            arr.push(listener);
        }
        return;
    },

    removeEventListener: function (eventType, listener) {
        if (!(this._listeners && eventType in this._listeners)) {
            return;
        }
        var arr = this._listeners[eventType];
        var idx = util.indexOf(arr, listener);
        if (idx !== -1) {
            if (arr.length > 1) {
                this._listeners[eventType] = arr.slice(0, idx).concat(arr.slice(idx + 1));
            } else {
                delete this._listeners[eventType];
            }
            return;
        }
        return;
    },

    dispatchEvent: function (event) {
        var t = event.type;
        var args = Array.prototype.slice.call(arguments, 0);
        if (this['on' + t]) {
            this['on' + t].apply(this, args);
        }
        if (this._listeners && t in this._listeners) {
            for (var i = 0; i < this._listeners[t].length; i++) {
                this._listeners[t][i].apply(this, args);
            }
        }
    }
};
