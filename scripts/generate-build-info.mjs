import { writeFileSync } from 'fs';

const now = new Date();
const buildTime = now.toISOString().replace('T', ' - ').slice(0, -5) + ' UTC';

writeFileSync(
  'src/build-info.ts',
  `export const BUILD_INFO = {\n  builtAt: '${buildTime}'\n};\n`
);

console.log(`Build info generated: ${buildTime}`);
