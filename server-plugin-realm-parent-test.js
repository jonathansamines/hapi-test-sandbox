/* eslint-disable no-restricted-syntax */

'use strict';

const Hapi = require('@hapi/hapi');
const assert = require('assert');

async function run() {
  const server = Hapi.server();

  const Plugin = {
    name: 'plugin',
    async register(srv) {
      srv.ext('onRequest', (request, h) => {
        request.plugins.plugin = {
          plugin: srv.realm.plugin,
          parentPlugin: srv.realm.parent.plugin,
        };

        return h.continue;
      });

      const Nested = {
        name: 'nested',
        register(srv2) {
          srv2.ext('onRequest', (request, h) => {
            request.plugins.nested = {
              plugin: srv2.realm.plugin,
              parentPlugin: srv2.realm.parent.plugin,
            };

            return h.continue;
          });
        },
      };

      return srv.register(Nested);
    },
  };

  server.ext('onRequest', (request, h) => {
    request.plugins.root = {
      plugin: server.realm.plugin,
      parentPlugin: server.realm?.parent?.plugin,
    };

    return h.continue;
  });

  await server.register(Plugin);

  server.route({
    method: 'GET',
    path: '/test',
    options: {
      handler(request) {
        return request.plugins;
      },
    },
  });

  const { result } = await server.inject('/test');

  assert.strictEqual(result.nested.plugin, 'nested');
  assert.strictEqual(result.nested.parentPlugin, 'plugin');

  assert.strictEqual(result.plugin.plugin, 'plugin');
  assert.strictEqual(result.plugin.parentPlugin, undefined);

  assert.strictEqual(result.root.plugin, undefined);
  assert.strictEqual(result.root.parentPlugin, undefined);
}

run()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
