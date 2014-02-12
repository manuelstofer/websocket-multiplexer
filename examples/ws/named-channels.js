'use strict';
/**
 * Example: Using websocket-multiplexer on node.js with the ws library
 *
 * Demonstrates following scenario
 *
 * - Client connects to server
 * - Server creates a anonymous channel and sends 'hello'
 * - When the client receives the message the channel is created and the message received
 * - Client will send back hello
 * - Server will receive it and close the channel
 * - When the clients channel closes it will stop the server
 *
 */
var Multiplexer = require('../../'),
    WebSocket   = require('ws'),
    assert      = require('assert'),
    ws          = new WebSocket('ws://localhost:8080/'),
    wss         = new WebSocket.Server({ port: 8080 });


// Client
(function () {
    var client = new Multiplexer({ socket: ws }),
        channel = client.channel('example');

    assert(channel.name === 'example');

    channel.addEventListener('message', function (evt) {
        console.log('-: Received "' + evt.data + '"');
        assert(evt.data === 'hello');
        channel.close();
    });
}());


// Server
wss.on('connection', function (ws) {

    console.log('+: Create named channel: "example"');
    var multiplex = new Multiplexer({ socket: ws }),
        channel = multiplex.channel('example');

    console.log('+: Send message: hello');
    channel.send('hello');

    channel.addEventListener('close', function (evt) {
        console.log('+: Channel closed');
        wss.close();
    });
});