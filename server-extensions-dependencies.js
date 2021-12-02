'use strict';

const Hapi = require('@hapi/hapi');

async function run() {
    const server = Hapi.server();

    const PluginA = {
        name: 'plugin-a',
        register(srv) {
            srv.ext('onPreStart', async function task() {}, { before: 'unknown' });
        }
    };

    await server.register(PluginA);
    await server.initialize();
}

run()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });