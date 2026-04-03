/* global suite, test */

const assert = require('assert');
require('../src/extension');

suite('Extension Tests', function () {
    test('Something 1', function () {
        assert.strictEqual(-1, [1, 2, 3].indexOf(5));
        assert.strictEqual(-1, [1, 2, 3].indexOf(0));
    });
});
