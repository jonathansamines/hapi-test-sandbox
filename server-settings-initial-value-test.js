'use strict';

const Hapi = require('@hapi/hapi');
const assert = require('assert');

const server = Hapi.server();
const serverWithInitialSettings = Hapi.server({ app: {} });

assert.deepStrictEqual(serverWithInitialSettings.settings.app, {});
assert.deepStrictEqual(server.settings.app, {}); 