'use strict';
const Express = require('express');
const Lab = require('lab');
const Artificial = require('../lib');

const lab = exports.lab = Lab.script();
const expect = Lab.expect;
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
  it('makes a fake request and receives a fake response', (done) => {
    const app = getServer();

    expect(app.inject).to.not.exist();

    const expectedPayload = JSON.stringify({ success: 'success!' });
    const result = Artificial(app);

    expect(result).to.shallow.equal(app);
    expect(app.inject).to.be.a.function();

    app.inject({ method: 'GET', url: '/' }, (res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.payload).to.equal(expectedPayload);
      expect(res.rawPayload).to.equal(Buffer.from(expectedPayload));
      done();
    });
  });

  it('passes a string as options', (done) => {
    const app = getServer();
    const expectedPayload = JSON.stringify({ success: 'success!' });

    Artificial(app);

    app.inject('/', (res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.payload).to.equal(expectedPayload);
      expect(res.rawPayload).to.equal(Buffer.from(expectedPayload));
      done();
    });
  });

  it('attaches a custom named function', (done) => {
    const app = getServer();

    expect(app.foobar).to.not.exist();
    expect(app.inject).to.not.exist();

    const expectedPayload = JSON.stringify({ success: 'success!' });
    const result = Artificial(app, 'foobar');

    expect(result).to.shallow.equal(app);
    expect(app.foobar).to.be.a.function();
    expect(app.inject).to.not.exist();

    app.foobar({ method: 'GET', url: '/' }, (res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.payload).to.equal(expectedPayload);
      expect(res.rawPayload).to.equal(Buffer.from(expectedPayload));
      done();
    });
  });
});
