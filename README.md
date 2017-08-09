# artificial

[![Current Version](https://img.shields.io/npm/v/artificial.svg)](https://www.npmjs.org/package/artificial)
[![Build Status via Travis CI](https://travis-ci.org/continuationlabs/artificial.svg?branch=master)](https://travis-ci.org/continuationlabs/artificial)
![Dependencies](http://img.shields.io/david/continuationlabs/artificial.svg)

[![belly-button-style](https://cdn.rawgit.com/continuationlabs/belly-button/master/badge.svg)](https://github.com/continuationlabs/belly-button)

Inject fake HTTP request/response into an Express server. This is a port of hapi's [`shot`](https://github.com/hapijs/shot) module, adapted to work with Express. `artificial` allows fake responses to be injected into a server without first binding to a port. This simplifies testing.

## Basic Usage

```javascript
'use strict';
const Artificial = require('artificial');
const Express = require('express');
const app = Express();

Artificial(app);  // Create the app.inject() method.

app.get('/', (req, res, next) => {
  res.send({ success: 'success!' });
});

app.inject({ method: 'GET', url: '/' }, (res) => {
  // res contains the fake HTTP response.
});
```

## API

`artificial` exports a single function that is used to add a single injection method to an Express app.

### `Artificial(app [, method])`

  - Arguments
    - `app` (object) - An Express application.
    - `method` (string) - The name of the method to attach to `app`. Optional. Defaults to `'inject'`, meaning that `app.inject()` is created.
  - Returns
    - `app` (object) - The same Express application as `app`.

Defines an injection method on an Express server. By default, the method is `inject()`. The method's behavior is described in [hapi's `server.inject(options [, callback])` documentation](https://github.com/hapijs/hapi/blob/master/API.md#serverinjectoptions-callback).
