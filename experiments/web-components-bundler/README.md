Experimental dynamic bundling of Web Components code
----

This is an experimental dynamic bundler for Web Components code.

Use at your own risk, in its current state it's clearly not
meant for production.

The goal is to serve dynamically created JavaScript code bundles,
built to include specific sets of Web Components defined by the
bundle URL.

Note that I'm no expert in JS code bundling and tree shaking, so
bundling code improvements are certainly possible, for now this
is just a proof of concept.

For production this would need to be configured with a CDN cache
in front, as bundling takes some time, about 400 msec on an M1
laptop.

The initial demo uses [UI5 Web Components](https://sap.github.io/ui5-webcomponents/),
as I was not familiar with that library it looked like a good starting point.
And bundling required no special code besides just importing the required
modules. A small number of them currently fail, for details run this and
see the test homepage.

The same technique should work with other Web Components libraries,
or any other code for that matter, if dynamic bundling (using
[rollup.js](https://rollupjs.org/) in the current) works.

## Usage Scenario

- Client requests the code for a set of Web Components, something like

    `https://bundler.example.com/ui5/Card,CardHeader,Icon,List,StandardListItem.js`

- This service generates a JavaScript source file that imports these components and uses the <a href="https://rollupjs.org/javascript-api/">Rollup JavaScript API</a> to bundle, optimize and tree shake it.
- Result is cached, as it might take a few seconds to generate.
- Client receives an optimized JavaScript source file that provides much better page loading performance than a naive individual loading of the requested components

See below for how to run this module, the test homepage has a few test links.

## Findings

As of the initial Web Platform Zoo commit:

- The naive.html page makes 183 HTTP requests and loads a total of 698kB, 283kB compressed.
- The bundled.html page, which shows the same content, makes 4 http requests and loads a total of 595kB, 135kB compressed.
- Page load time is 168 msec for the bundled page, once the generated JavaScript is in the server cache, compared to 450 msec for the naive loading - the **bundled page loads three times faster** overall in my initial tests.
- In the first bundled.html request, the bundled JavaScript code request takes about 400 msec, that's the "cold start" time for creating that bundle.
- There's still no build step, as the code bundling and optimization happens on demand in this service.

It might be possible to further reduce the size of the bundled JavaScript code, by optimizing the rollup settings.

Note that the _very_ basic caching mechanism can lead to high resource usage, for real
use we'd disable it and use an HTTP cache in front.

## How to run this

    npm install 
    npm run dev

And then open http://localhost:3000/