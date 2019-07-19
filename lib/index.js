'use strict';

const Assert = require('assert');
const Joi = require('@hapi/joi');
const Request = require('@hapi/shot/lib/request');
const Response = require('@hapi/shot/lib/response');

const schema = Joi.object().keys({
  url: Joi.alternatives([
    Joi.string(),
    Joi.object().keys({
      protocol: Joi.string(),
      hostname: Joi.string(),
      port: Joi.any(),
      pathname: Joi.string().required(),
      query: Joi.any()
    })
  ]).required(),
  headers: Joi.object(),
  payload: Joi.any(),
  simulate: {
    end: Joi.boolean(),
    split: Joi.boolean(),
    error: Joi.boolean(),
    close: Joi.boolean()
  },
  authority: Joi.string(),
  remoteAddress: Joi.string(),
  method: Joi.string(),
  validate: Joi.boolean()
});


function inject (dispatchFunc, options, callback) {
  options = (typeof options === 'string' ? { url: options } : options);
  Assert(typeof dispatchFunc === 'function', 'Invalid dispatch function');
  Joi.assert(options, schema);

  const req = new Request(options);
  const res = new Response(req, callback);

  // Bind the req and res methods, as Express sets the prototype internally.
  req._read = Request.prototype._read.bind(req);
  req.destroy = Request.prototype.destroy.bind(req);
  res.writeHead = Response.prototype.writeHead.bind(res);
  res.write = Response.prototype.write.bind(res);
  res.end = Response.prototype.end.bind(res);
  res.destroy = Response.prototype.destroy.bind(res);
  res.addTrailers = Response.prototype.addTrailers.bind(res);

  return req.prepare(() => { dispatchFunc(req, res); });
}


function attach (app, method) {
  if (method === undefined) {
    method = 'inject';
  }

  app[method] = function _inject (options, callback) {
    const dispatch = app.handle.bind(app);

    inject(dispatch, options, callback);
  };

  return app;
}


module.exports = attach;
