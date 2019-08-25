# d3-hinton

This is a D3 plugin that renders <a href="https://matplotlib.org/3.1.0/gallery/specialty_plots/hinton_demo.html">Hinton diagrams</a> as interactive SVG diagrams.

This is not an officially supported Google product.

## Installing

If you use NPM, `npm install d3-hinton`. Otherwise, download the [latest release](https://github.com/narphorium/d3-hinton/releases/latest).

## API Reference

The simplest form of diagram simply takes a element selector and a 2D array of values as input:

```
var diagram_1 = d3.hinton('#diagram_1', [
  [ 0.8,-0.3, 0.3, 0.1,-0.2],
  [-0.3, 0.8,-0.4,-0.2,-0.5],
  [-0.4,-0.8, 0.5, 0.2,-0.2],
  [-0.5,-0.3,-0.1, 0.8,-1.0],
  [-0.3,-1.0,-0.4,-0.5, 0.9]
])
```

This creates a `HintonDiagram` Object which can be updated with new data to animate it like this:

```
diagram.update([
  [ 0.8,-0.3, 0.3, 0.1,-0.2],
  [-0.3, 0.8,-0.4,-0.2,-0.5],
  [-0.4,-0.8, 0.5, 0.2,-0.2],
  [-0.5,-0.3,-0.1, 0.8,-1.0],
  [-0.3,-1.0,-0.4,-0.5, 0.9]
],
200)
```

The 2nd parameter is the animation transition time in milliseconds.
