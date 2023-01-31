//@ts-ignore
const fs = require('fs');
const path = require('path');
const { generateApi } = require('swagger-typescript-api');

(async () => {
  await generateApi({
    name: 'swagger.api.ts',
    output: path.resolve(__dirname, './src/swagger/'),
    url: `http://localhost:8888/api-json`,
    httpClientType: 'axios',
    moduleNameFirstTag: true,
  }).then(() => {
    const endpoint = path.resolve(__dirname, './src/swagger/swagger.api.ts');
    let ts = fs.readFileSync(endpoint, 'utf-8');
    ts = `// @ts-nocheck\n${ts}`;
    fs.writeFileSync(endpoint, ts, 'utf-8');
  });
})();
