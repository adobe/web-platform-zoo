Shopping Cart example using Web Components
---

TODO this is a rough draft for now

## How many components?

The initial prototype of this demo had the following components:

- Product list
- Product card
- Product quantity controller
- Cart status (status text with 'status' role, for accessibility)
- Mini cart, shows number of products and total cart cost

And after trying to make it as simple as possible we end up with:

- TODO

## No build step required

TODO explain

## Shadow DOM or not?

- Yes if you _really_ need CSS isolation
- Yes if the component's CSS is complicated or "precious" enough to warrant having it local to the component
- Yes if it makes your component's code much simpler, thanks to scoped element IDs for example
- Yes if it makes using the component simpler or more self-explaining