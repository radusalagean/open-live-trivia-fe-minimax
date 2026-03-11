import { writeFileSync } from 'fs';
import { execSync } from 'child_process';

const now = new Date();
const buildTime = now.toISOString().replace('T', ' - ').slice(0, -5) + ' UTC';

let commitHash = process.env.COMMIT_SHA || 'unknown';
if (commitHash === 'unknown') {
  try {
    commitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
  } catch (e) {
    console.warn('Could not get git commit hash');
  }
}

writeFileSync(
  'src/build-info.ts',
  `export const BUILD_INFO = {\n  builtAt: '${buildTime}',\n  commitHash: '${commitHash}'\n};\n`
);

console.log(`Build info generated: ${buildTime} (${commitHash})`);
