Shopping Cart example using Web Components
---

This is a work in progress example, which implements a shopping cart using Web Components.

It is meant as a tutorial to demonstrate:

- How to design Web Components without using any libraries to demonstrate the basic principles
- How to (hopefully) find the right balance between reusability and simplicity
- When use Shadow DOM and how to benefit from CSS and DOM scoping
- Using Custom Events for commands and state propagation
- How to implement accessibility with Web Components

## Status

As of November 8th this is ready for code review.

Accessibility still needs to be tested and possibly improved.

This README needs to be fleshed out to explain the design decisions and recommendations.

## How many components?

The initial, naive prototype of this demo had the following components:

- Cart logic, a non-visual component (so not a Web Component) that simulates a shopping cart service
- Product list
- Product card
- Product quantity controller
- Cart status (status text with 'status' role, for accessibility)
- Mini cart, shows number of products and total cart cost

But after trying to make it as simple as possible we end up with:

- Cart logic, non-visual as above
- Product list, retrieves products from the cart logic and renders them
- Cart status, displays a summary of the cart contents
- Generic Increment/decrement input control

## HTML Microdata for templating

[HTML Microdata](https://developer.mozilla.org/en-US/docs/Web/HTML/Microdata)
is used in to inject data in the rendering templates. 

For example, the text content of

    <p itemprop="description" class="description"></p>

is replaced by the current product's _description_ field value.


## No build step required

TODO explain the greatness of this

## Staying close to the Web Platform

TODO what would a library like Lit bring?

## Shadow DOM or not?

- Yes if you _really_ need CSS isolation
- Yes if the component's CSS is complicated or "precious" enough to warrant having it local to the component
- Yes if it makes your component's code much simpler, thanks to scoped element IDs for example
- Yes if it makes using the component simpler or more self-explaining

TODO any downsides to using Shadow DOM?