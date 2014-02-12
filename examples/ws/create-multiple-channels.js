'use strict';
/**
 * Example: Using websocket-multiplexer on node.js with the ws library
 */
var Multiplexer = require('../../'),
    WebSocket   = require('ws'),
    ws          = new WebSocket('ws://localhost:8080/'),
    wss         = new WebSocket.Server({ port: 8080 });

// Client
(function () {
    var client = new Multiplexer({ socket: ws });

    client.addEventListener('channel', function (evt) {
        console.log('-: Channel created');
        var channel = evt.channel;

        channel.addEventListener('message', function (evt) {
            console.log('-: Received message: "' + evt.data + '" -> send back echo')
            channel.send(evt.data);
        });

        channel.addEventListener('close', function () {
            console.log('-: Channel closed');
        });
    });
}());


// Server
wss.on('connection', function (ws) {

    var multiplex = new Multiplexer({ socket: ws });

    setInterval(function () {
        console.log('+: Create channel');
        var channel = multiplex.channel();
        channel.send('hello');
        channel.addEventListener('message', channel.close.bind(channel));
    }, 100);
});