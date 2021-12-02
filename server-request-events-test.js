'use strict';

const Hapi = require('@hapi/hapi');
const assert = require('assert');

async function run() {
    const events = [];
    const server = Hapi.Server();

    server.events.on('request', (request, event, tags) => {
        events.push([event.channel, event.data].join('.'));
    });

    server.route({
        path: '/',
        method: 'GET',
        handler(request) {
            request.log(['test'], 'request.log');
            request.server.log(['test'], 'request.server.log');
            server.log(['test'], 'server.log');

            return 'ok';
        }
    });

    server.log(['test'], 'server.log');

    await server.inject('/');

    assert.deepStrictEqual(events, ['app.request.log', 'app.request.server.log', 'app.server.log', 'app.server.log']);
}

run()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });