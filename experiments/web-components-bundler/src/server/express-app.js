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

const app = express();
app.use(compression());
app.use(express.static('public'));
app.use('/node_modules', express.static('node_modules'));

// Use a crude cache for this prototype, in production we'd use a CDN in front
const cache = {};

const purgeCache = () => {
  const toPurge = [];
  for(const k of Object.keys(cache)) {
    if(cache[k].expires < Date.now()) {
      toPurge.push(k);
    }
  }
  toPurge.forEach(k => {
    console.log('*** clearing cache entry', k);
    delete cache[k];
  });
};

app.get('/info', async (req, resp) => {
  resp.send({
    version: 0.1,
    status: 'early prototype',
    src: 'https://github.com/adobe/web-platform-zoo/tree/main/experiments/web-components-bundler',
  });
});

app.get('/bundler/:template/:classes(*).js', async (req, resp) => {
  const { template, classes } = req.params;
  const cacheKey = `${template}/${classes}`
  var b;

  try {
    if(cache[cacheKey]) {
      b = cache[cacheKey];
    } else {
      b = await bundle(template, classes.split(','));
      b.expires = Date.now() + config.bundledCodeCacheTTLmsec;
      cache[cacheKey] = b;
    }
    resp.setHeader('Cache-Control', `public, stale-while-revalidate, max-age=${b.cacheTTLSeconds}`);
    resp.contentType(b.contentType).send(b.content).end();
  } catch(e) {
    resp.status(404).send(e + '');
  }
  purgeCache();
});

export default app;