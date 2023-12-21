/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
import express from 'express';
import bundle from '../bundler.js';
import compression from 'compression';
import config from '../../config.js';
import { Cache } from 'file-system-cache';

const versionInfo = {
  version: 0.3,
  status: 'early prototype',
  src: 'https://github.com/adobe/web-platform-zoo/tree/main/experiments/web-components-bundler',
}

const app = express();
app.use(compression());
app.use(express.static('public'));
app.use('/node_modules', express.static('node_modules'));

const cache = new Cache({
  basePath: "/tmp/bundler-cache",
  ns: 'wcb',
  ttl: config.bundledCodeCacheTTLSeconds
});

app.get('/info', async (req, resp) => {
  resp.send(versionInfo);
});

app.get('/bundler/:template/:classes(*).js', async (req, resp) => {
  const { template, classes } = req.params;
  const cacheKey = `${template}/${classes}`
  var b;

  try {
    var b = await cache.get(cacheKey);
    if(!b) {
      b = await bundle(template, classes.split(','));
      await cache.set(cacheKey, b);
    }
    resp.setHeader('Cache-Control', `public, stale-while-revalidate, max-age=${b.cacheTTLSeconds}`);
    resp.contentType(b.contentType).send(b.content).end();
  } catch(e) {
    resp.status(404).send(e + '');
  }
});

export default app;