/* eslint-disable no-restricted-syntax */

'use strict';

const Hapi = require('@hapi/hapi');
const assert = require('assert');

function scheme(server) {
  return {
    authenticate(request, h) {
      const credentials = {
        plugin: server.realm.plugin,
        parentPlugin: server.realm.parent.plugin,
      };

      return h.authenticated({ credentials });
    },
  };
}

async function run() {
  const server = Hapi.server();

  const Plugin = {
    name: 'plugin',
    async register(srv) {
      const Nested = {
        name: 'nested',
        register(srv2) {
          srv2.auth.scheme('scheme-nested', scheme);
        },
      };

      srv.auth.scheme('scheme-plugin', scheme);

      await srv.register(Nested);
    },
  };

  await server.register(Plugin);

  server.auth.scheme('scheme', scheme);
  server.auth.strategy('strategy', 'scheme');
  server.auth.strategy('strategy-plugin', 'scheme-plugin');
  server.auth.strategy('strategy-nested', 'scheme-nested');

  const routes = [['/test', 'strategy'], ['/test-plugin', 'strategy-plugin'], ['/test-nested', 'strategy-nested']];

  for (const [path, strategy] of routes) {
    server.route({
      method: 'GET',
      path,
      options: {
        auth: strategy,
        handler(request) {
          return request.auth.credentials;
        },
      },
    });
  }

  const { result } = await server.inject('/test');
  const { result: resultPlugin } = await server.inject('/test-plugin');
  const { result: resultNested } = await server.inject('/test-nested');

  assert.strictEqual(result.plugin, undefined);
  assert.strictEqual(resultPlugin.plugin, undefined);
  assert.strictEqual(resultNested.plugin, undefined);

  assert.strictEqual(result.parentPlugin, 'nested');
  assert.strictEqual(resultPlugin.parentPlugin, undefined);
  assert.strictEqual(resultNested.parentPlugin, undefined);
}

run()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
