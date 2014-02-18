'use strict';
/**
 * When the underlying web socket closes all channels will get closed
 */
var Multiplexer = require('../../'),
    WebSocket   = require('ws'),
    ws          = new WebSocket('ws://localhost:8080/'),
    wss         = new WebSocket.Server({ port: 8080 });


// Client
ws.addEventListener('open', function () {
    var client = new Multiplexer({ socket: ws }),
        channel = client.channel();

    channel.send({ hello: 'echo' });
    ws.close();
});


// Server
wss.on('connection', function (ws) {

    console.log('+: Create named channel: "example"');
    var multiplex = new Multiplexer({ socket: ws });

    multiplex.addEventListener('channel', function (evt) {
        var channel = evt.channel;

        console.log('channel opened');

        channel.addEventListener('close', function () {
            console.log('channel closed');
            wss.close();
        });
    });
});