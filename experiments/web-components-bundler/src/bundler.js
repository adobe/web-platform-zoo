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

// Generate optimized code using rollup, see https://rollupjs.org/javascript-api/

import { rollup } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import virtual from '@rollup/plugin-virtual';
import generators from './generators.js';

export default async function bundle(generatorName, classes) {

  // Generate code to bundle
  const generator = generators[generatorName];
  if (!generator) {
    throw new Error(`generator not found: ${generatorName}`);
  }
  const code = generator(classes);

  const inputOptions = {
    input: 'src/bundler-input.js',
    plugins: [
      nodeResolve({ rootDir: process.cwd() }),
      virtual({ 'VIRTUAL-BUNDLER-INPUT.js': code }),
    ],
    treeshake: 'smallest'
  };
  const outputOptions = {};

  const bundle = await rollup(inputOptions);
  const output = await bundle.generate(outputOptions);

  const result = {
    contentType: 'text/javascript',
    content: output?.output[0]?.code,
    cacheTTLSeconds: 60
  }

  if (bundle) {
    await bundle.close();
  }

  return result;
}