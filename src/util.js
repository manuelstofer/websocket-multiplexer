'use strict';

/**
 * Some utility functions
 */
module.exports = {

    /**
     * Array.prototype.indexOf fallback
     *
     * @param arr
     * @param obj
     * @returns {number}
     */
    indexOf: function (arr, obj) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === obj) {
                return i;
            }
        }
        return -1;
    },

    /**
     * Mixin
     *
     * @param to
     * @param from
     */
    mixin: function mixin (to, from) {
        for (var i in from) { to[i] = from[i]; }
    },

    /**
     * Generate a guid
     *
     * @returns {string}
     */
    guid: function () {
        return [rb2() + rb2(), rb2(), rb2(), rb2(), rb2() + rb2() + rb2()].join('-');
    }
};

/**
 * Two random bytes as hex string
 * @returns {string}
 */
function rb2 () {
    return Math.floor(Math.random() * 0x10000).toString(16).toUpperCase();
}
