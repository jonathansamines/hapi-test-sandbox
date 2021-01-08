'use strict';

const Hapi = require('@hapi/hapi');
const assert = require('assert');

async function run() {
  const server = Hapi.server({
    port: 8080,
    host: 'localhost',
    info: {
      remote: true,
    },
  });

  server.route({
    method: 'GET',
    path: '/test',
    handler(request) {
      return request.info.remoteAddress;
    },
  });

  // inferred authority from settings

  const { result } = await server.inject({
    method: 'GET',
    url: '/test',
    remoteAddress: '192.168.200.125:8090',
  });

  assert.strictEqual(result, '192.168.200.125:8090');
}

run()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
