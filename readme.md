# Websocket multiplexer

Websocket multiplexer, emulates virtual channels over web socket or SockJS.

Its different to the [SockJS multiplexer](https://github.com/sockjs/websocket-multiplex) in some ways:

- Client / Server agnostic.
- Anonymous channels.
- Open new channels at any time. No need to specify them ahead.
- CommonJS, use it with component, browserify or as node.js module.


## Installation

```bash
component install manuelstofer/websocket-multiplexer
```

```bash
npm install websocket-multiplexer
```

```Javascript
var Multiplexer = require('websocket-multiplexer');
```


### API

With named channels:

```Javascript
var multiplexer = new Multiplexer({ socket: websocket }),
    example = multiplexer.channel('example');

example.addEventListener('message', function (evt) {
    console.log(evt.data);
});

example.addEventListener('close', function (evt) {

});
```


Create anonymous channels:

```Javascript
var multiplexer = new Multiplexer({ socket: websocket }),
    channel = multiplexer.channel();

channel.send('hello');
```


Listen for anonymous channels:

```Javascript
var multiplexer = new Multiplexer({ socket: websocket });

multiplexer.addEventListener('channel', function (evt) {
    var channel = evt.channel;

    channel.addEventListener('message', function (evt) {
        console.log(evt.data);
    });
});
```

There are also some examples for node.js + [ws](https://github.com/einaros/ws) in examples/ws


### Multiplexer

```webidl
interface Multiplexer {
  attribute Function onchannel;

  // create a channel
  void channel(optional String channel_id);
  void close();
};
Multiplexer implements EventTarget;
```

### Channel

```webidl
interface Channel {
  attribute String name;
  attribute Function onmessage;
  attribute Function onclose;
  void send(in DOMString data);
  void close();
};
Channel implements EventTarget;
```
