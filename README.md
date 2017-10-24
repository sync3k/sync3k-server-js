Sync3k Server JS
===

`sync3k-server-js` is an in-memory Sync3k server for local testing and development of [Sync3k](https://github.com/google/sync3k-client). See [sync3k-server](https://github.com/google/sync3k-server) for Kafka-based server.

Install
---

You can use `npm` to install the server.

```bash
$ npm install --global sync3k-server-js
$ sync3k-server-js
Server listening on port 3000...
```

Usage
---

To make the server listen on different port, use `PORT` environment. On unix-like environment:

```bash
$ PORT=31337 sync3k-server-js
Server listening on port 31337...
```

You can also use `cross-env` to be cross-platform:

```bash
$ npm install -g cross-env
$ cross-env POST=31337 sync3k-server-js
Server listening on port 31337...
```
