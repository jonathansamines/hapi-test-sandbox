'use strict';

const Hapi = require('@hapi/hapi');
const assert = require('assert');

async function run() {
  const server = Hapi.server({
    port: 8080,
    host: 'localhost',
  });

  server.route({
    method: 'GET',
    path: '/test',
    handler(request) {
      return request.headers.host;
    },
  });

  // inferred authority from settings

  const { result } = await server.inject({
    method: 'GET',
    url: '/test',
  });

  assert.strictEqual(result, 'localhost:8080');

  // explicit authority

  const { result: result2 } = await server.inject({
    method: 'GET',
    url: '/test',
    authority: 'server.org:80',
  });

  assert.strictEqual(result2, 'server.org:80');

  // inferred authority from url

  const { result: result3 } = await server.inject({
    method: 'GET',
    url: 'http://server.org:80/test',
  });

  assert.strictEqual(result3, 'server.org:80');

  // inferred authority from url (wins over authority setting)

  const { result: result4 } = await server.inject({
    method: 'GET',
    url: 'http://server.org:80/test',
    authority: 'server.net:2020',
  });

  assert.strictEqual(result4, 'server.org:80');

  // inferred authority from host (wins over authority and url)

  const { result: result5 } = await server.inject({
    method: 'GET',
    url: 'http://server.org:80/test',
    authority: 'server.net:2020',
    headers: {
      host: 'server.io:8080',
    },
  });

  assert.strictEqual(result5, 'server.io:8080');

  // precendence: headers.host -> url -> authority -> server settings
}

run()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
