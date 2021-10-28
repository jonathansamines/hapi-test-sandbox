'use strict';

const Hapi = require('@hapi/hapi');
const assert = require('assert');

async function run() {
    const events = [];
    const serverA = Hapi.server();

    function createEventHandler(name) {
        return function handler() {
            events.push(name);
        }
    }

    serverA.events.once('start', createEventHandler('start'));
    serverA.events.once('stop', createEventHandler('stop'));

    await serverA.initialize();
    await serverA.stop();

    assert.deepStrictEqual(events, ['start', 'stop']);
}

run()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });