import { render } from './renderer.mjs';
import express from 'express';
import fs from 'fs';

const app = express();
app.use(express.static('public'))

const components = [
  'pull-quote',
  'links-list'
].map(name => fs.readFileSync(`./src/components/${name}.js`, 'utf8'));

app.get("/", async (_req, res, _next) => {
  const input = fs.readFileSync(`./input/index.html`, 'utf8');
  const html = await render(input, components);
  res.send(html);
});

const port = 3000;
const server = app.listen({ port }, () => 
  console.log(`Listening on port: ${port}`)
);

// * @see {https://jira.corp.adobe.com/browse/EON-6340}
// * @see {https://nodejs.org/docs/latest-v10.x/api/http.html#http_server_keepalivetimeout}
// * @see {https://github.com/envoyproxy/envoy/issues/1979}

server.keepAliveTimeout = 0;