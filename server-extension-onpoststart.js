'use strict';

const Hapi = require('@hapi/hapi');
const assert = require('assert');

async function run() {
    const tasks = [];
    const serverA = Hapi.server();

    function createTask(name) {
        return function task() {
            tasks.push(name);
        }
    }

    serverA.ext('onPreStart', createTask('onPreStart'));
    serverA.ext('onPostStart', createTask('onPostStart'));
    serverA.ext('onPreStop', createTask('onPreStop'));
    serverA.ext('onPostStop', createTask('onPostStop'));

    await serverA.initialize();
    await serverA.stop();

    assert.deepStrictEqual(tasks, ['onPreStart', 'onPostStart', 'onPreStop', 'onPostStop']);
}

run()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });