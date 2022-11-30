# Web Platform Zoo

> ** WORK IN PROGRESS **

This content is published to https://opensource.adobe.com/web-platform-zoo/ as 
a collection of code examples meant to promote and explain the Web Platform to developers.

It also provides automated tests, here's how to run them:

    npm install             # once only, as usual
    npx playwright test

## How to test the website locally

There are many ways to do this, including

    docker run -p 4000:4000 -v $(pwd):/site bretfisher/jekyll-serve

## TODO

* Flesh out the minimal template tests, including no-JS variant
* Publish only if the Playwright tests succeed
