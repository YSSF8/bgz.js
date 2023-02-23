# bgz.js

This is a library of background effects that can be used to add some visual flair to a website. The effects can be easily added to any canvas element on the page using JavaScript.

## Installation

To use this library, simply include the `bgz.js` file in your HTML file:

```html
<script src="canvas-bg.js"></script>
```

## Usage

### Here are the available effects for canvas and their options:

* starryNight(element, options)
* rain(element, options)
* bubbles(element, options)
* confetti(element, options)
* bubbles(element, options)
* matrix(element, options)
* particleSystem(element, options)
* waves(element, options)
* leaves(element, options)
* bouncingBalls(element, options)
* clounds(element, options)
* fireworks(element, options)
* underwater(element, options)

### Here are the available effects for a normal element and their options:

* rain(element, options)
* bing(element)

#### Here are an example for using the rain effect

```javascript
elementBg.rain('.bg', {
  speed: {
      min: 90,
      max: 100
  },
  radius: 30,
  spacing: 50
});
```
