'use strict';
const Assert = require('assert');
const Barrier = require('cb-barrier');
const Express = require('express');
const Lab = require('@hapi/lab');
const Artificial = require('../lib');

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;


function getServer () {
  const app = Express();

  app.get('/', (req, res, next) => {
    res.send({ success: 'success!' });
  });

  return app;
}


describe('Artificial', () => {
  it('makes a fake request and receives a fake response', () => {
    const barrier = new Barrier();
    const app = getServer();

    Assert.strictEqual(app.inject, undefined);

    const expectedPayload = JSON.stringify({ success: 'success!' });
    const result = Artificial(app);

    Assert.strictEqual(result, app);
    Assert(typeof app.inject === 'function');

    app.inject({ method: 'GET', url: '/' }, (res) => {
      Assert.strictEqual(res.statusCode, 200);
      Assert.deepStrictEqual(res.payload, expectedPayload);
      Assert.deepStrictEqual(res.rawPayload, Buffer.from(expectedPayload));
      barrier.pass();
    });

    return barrier;
  });

  it('passes a string as options', () => {
    const barrier = new Barrier();
    const app = getServer();
    const expectedPayload = JSON.stringify({ success: 'success!' });

    Artificial(app);

    app.inject('/', (res) => {
      Assert.strictEqual(res.statusCode, 200);
      Assert.deepStrictEqual(res.payload, expectedPayload);
      Assert.deepStrictEqual(res.rawPayload, Buffer.from(expectedPayload));
      barrier.pass();
    });

    return barrier;
  });

  it('attaches a custom named function', () => {
    const barrier = new Barrier();
    const app = getServer();

    Assert.strictEqual(app.foobar, undefined);
    Assert.strictEqual(app.inject, undefined);

    const expectedPayload = JSON.stringify({ success: 'success!' });
    const result = Artificial(app, 'foobar');

    Assert.strictEqual(result, app);
    Assert(typeof app.foobar === 'function');
    Assert.strictEqual(app.inject, undefined);

    app.foobar({ method: 'GET', url: '/' }, (res) => {
      Assert.strictEqual(res.statusCode, 200);
      Assert.deepStrictEqual(res.payload, expectedPayload);
      Assert.deepStrictEqual(res.rawPayload, Buffer.from(expectedPayload));
      barrier.pass();
    });

    return barrier;
  });
});
