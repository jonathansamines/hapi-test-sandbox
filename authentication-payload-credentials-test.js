'use strict';

const assert = require('assert');
const Hapi = require('@hapi/hapi');

async function run() {
  const server = Hapi.server();

  server.auth.scheme('scheme', () => ({
    authenticate() {
      throw new Error('authenticate error');
    },
    payload() {
      throw new Error('payload error');
    },
    options: {
      payload: true,
    },
  }));

  server.auth.strategy('default', 'scheme');

  server.route({
    method: 'POST',
    path: '/test',
    options: {
      auth: 'default',
      handler(request) {
        return request.auth.credentials;
      },
    },
  });

  const credentials = {
    hello: 'world',
  };

  const { result } = await server.inject({
    method: 'POST',
    url: '/test',
    auth: {
      strategy: 'default',
      credentials,
    },
  });

  assert.deepStrictEqual(result, credentials);
}

run()
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });