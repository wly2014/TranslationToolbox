const path = require('path');
const { runTests } = require('@vscode/test-electron');

async function main() {
    try {
        await runTests({
            extensionDevelopmentPath: path.resolve(__dirname, '..'),
            extensionTestsPath: path.resolve(__dirname, 'index.js')
        });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

main();
