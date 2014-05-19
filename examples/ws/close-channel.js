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
    channel.close();
    setTimeout(function () {
        console.log({ client_channel: client.channels });
    }, 1000);
});


// Server
wss.on('connection', function (ws) {

    console.log('+: Client connected');
    var multiplex = new Multiplexer({ socket: ws });

    multiplex.addEventListener('channel', function (evt) {
        var channel = evt.channel;

        console.log('channel opened');

        channel.addEventListener('close', function () {
            console.log({ server_channel: multiplex.channels });
            wss.close();
        });
    });
});