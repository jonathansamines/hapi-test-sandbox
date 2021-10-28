'use strict';

const Hapi = require('@hapi/hapi');
const assert = require('assert');

async function run() {
    const events = [];
    const server = Hapi.server();

    function createEventHandler(name) {
        return function handler() {
            events.push(name);
        }
    }

    server.events.once('start', createEventHandler('start'));
    server.events.once('stop', createEventHandler('stop'));

    await server.initialize();
    await server.stop();

    assert.deepStrictEqual(events, ['start', 'stop']);
}

run()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });