'use strict';

const Hapi = require('@hapi/hapi');
const assert = require('assert');

async function run() {
    const tasks = [];
    const server = Hapi.server();

    function createTask(name) {
        return function task() {
            tasks.push(name);
        }
    }

    server.ext('onPreStart', createTask('onPreStart'));
    server.ext('onPostStart', createTask('onPostStart'));
    server.ext('onPreStop', createTask('onPreStop'));
    server.ext('onPostStop', createTask('onPostStop'));

    await server.initialize();
    await server.stop();

    assert.deepStrictEqual(tasks, ['onPreStart', 'onPostStart', 'onPreStop', 'onPostStop']);
}

run()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });