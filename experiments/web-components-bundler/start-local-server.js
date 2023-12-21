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

// Run the Express app locally
import app from './src/server/express-app.js'
const port = 3000;
const server = app.listen({ port }, () => 
  console.log(`Listening on port: ${port}`)
);

// * @see {https://jira.corp.adobe.com/browse/EON-6340}
// * @see {https://nodejs.org/docs/latest-v10.x/api/http.html#http_server_keepalivetimeout}
// * @see {https://github.com/envoyproxy/envoy/issues/1979}
server.keepAliveTimeout = 0;