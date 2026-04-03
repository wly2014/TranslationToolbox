//
// Extension test runner (Mocha). Must export `run()` returning a Promise (VS Code 1.60+).
//

const path = require('path');
const Mocha = require('mocha');

module.exports = {
    run() {
        const mocha = new Mocha({ ui: 'tdd', color: true });
        const testsRoot = __dirname;
        mocha.addFile(path.join(testsRoot, 'extension.test.js'));

        return new Promise((resolve, reject) => {
            mocha.run((failures) => {
                if (failures > 0) {
                    reject(new Error(`${failures} test(s) failed.`));
                } else {
                    resolve();
                }
            });
        });
    }
};
