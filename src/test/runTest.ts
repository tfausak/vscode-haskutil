import * as cp from 'child_process';
import * as path from 'path';
import { env } from 'process';

import {
  runTests,
  downloadAndUnzipVSCode,
  resolveCliPathFromVSCodeExecutablePath
} from '@vscode/test-electron';

async function main(): Promise<number> {
  try {
    // The folder containing the Extension Manifest package.json
    // Passed to `--extensionDevelopmentPath`
    const extensionDevelopmentPath = path.resolve(__dirname, '../../');

    // The path to the extension test runner script
    // Passed to --extensionTestsPath
    const extensionTestsPath = __dirname;
    const vscodeVersion = env['CODE_VERSION'];
    const vscodeExecutablePath = await downloadAndUnzipVSCode(vscodeVersion);
    const cliPath = resolveCliPathFromVSCodeExecutablePath(vscodeExecutablePath);

    // Install dependent extensions
    const dependencies = [
      'jcanero.hoogle-vscode',
      'dramforever.vscode-ghc-simple',
    ];

    const extensionsDir = path.resolve(path.dirname(cliPath), '..', 'extensions');
    const userDataDir = path.resolve(extensionsDir, '..', '..', 'udd');

    for(const extension of dependencies) {
      cp.spawnSync(cliPath, ['--extensions-dir', extensionsDir, '--install-extension', extension], {
        encoding: 'utf-8',
        stdio: 'inherit'
      });
    }

    // Download VS Code, unzip it and run the integration test
    return await runTests({
      vscodeExecutablePath,
      extensionDevelopmentPath,
      extensionTestsPath,
      launchArgs: [
        '--user-data-dir', userDataDir,
        '--extensions-dir', extensionsDir,
        '--new-window',
        '--disable-gpu',
        '--disable-updates',
        '--logExtensionHostCommunication',
        '--skip-getting-started',
        '--skip-welcome',
        '--skip-release-notes',
        '--disable-keytar',
        '--disable-restore-windows',
        '--disable-telemetry',
        '--disable-workspace-trust',
        '--wait',
      ]
    });
  } catch (err) {
    console.error(err);
    console.error('Failed to run tests');
    return 1;
  }
}

main();
