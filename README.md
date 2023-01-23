# Web Platform Zoo

> ** WORK IN PROGRESS **

This content is published to https://opensource.adobe.com/web-platform-zoo/ as 
a collection of code examples meant to promote and explain the Web Platform to developers.

It also provides automated tests, here's how to run them:

    npm install             # once only, as usual
    npx playwright test

## How to test the website locally

For now the website is just a collection of static pages, running an HTTP server
in the root folder is sufficient to test it.

## Useful Playwright command examples

Examples used to generate & debug the `todomvc` tests:

 * npx playwright codegen http://localhost:8000
 * npx playwright test -g todomvc --project firefox
 * npx playwright test -g todomvc --project firefox --timeout 25000 --debug

## TODO

* Finish implementing the todomvc tests
* How to test closed shadow DOM with Playwright?
* Flesh out the minimal template tests, including no-JS variant
* Publish only if the Playwright tests succeed
