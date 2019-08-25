import { rgb } from 'd3-color'

class Annotation {
  constructor (config) {
    this.config = config
  }

  draw (element, diagramConfig) {
    this.element = element
    this.diagramConfig = diagramConfig

    this.shape = [1, -1]
    if (this.config.shape) {
      this.shape = this.config.shape
    }
    if (this.shape[0] === -1) {
      this.shape[0] = this.diagramConfig.numColumns
    }
    if (this.shape[1] === -1) {
      this.shape[1] = this.diagramConfig.numRows
    }
    this.annotation = this.element.append('rect')
    this.annotation.attr('x', 0)
      .attr('y', 0)
      .attr('rx', 2)
      .attr('ry', 2)
      .attr('width', this.diagramConfig.cellSize * this.shape[0])
      .attr('height', this.diagramConfig.paddedCellSize * this.shape[1])
      .style('fill', rgb(this.config['color']))
      .style('opacity', 0.5)
  }

  update (x, y, width, height, duration) {
    if (width === -1) width = this.shape[0]
    if (height === -1) height = this.shape[1]
    var transition = this.annotation.transition()
    transition.attr('x', this.diagramConfig.paddedCellSize * x)
      .attr('y', this.diagramConfig.paddedCellSize * y)
      .attr('width', this.diagramConfig.cellSize * width)
      .attr('height', this.diagramConfig.paddedCellSize * height)
      .duration(duration)
  }
}

class HintonDiagram {
  constructor (element, data, config) {
    this.element = element
    this.config = config
    if (!this.config) this.config = {}
    this.data = data

    this.config.numColumns = data.length
    this.config.numRows = data[0].length
    this.config.cellSize = 20
    this.config.cellPadding = 1
    this.config.paddedCellSize = this.config.cellSize + this.config.cellPadding
    this.config.width = this.config.numColumns * this.config.paddedCellSize
    this.config.height = this.config.numRows * this.config.paddedCellSize

    var widthMargin = 2
    var heightMargin = 2

    var svg = this.element.append('svg')
      .attr('width', this.config.paddedCellSize * this.config.numColumns + widthMargin)
      .attr('height', this.config.paddedCellSize * this.config.numRows + heightMargin)
      .attr('class', 'd3-hinton')

    this.container = svg.append('g')

    // Draw diagram background
    this.container.append('rect')
      .attr('class', 'd3-hinton-background')
      .attr('x', 0)
      .attr('y', 0)
      .attr('rx', 2)
      .attr('ry', 2)
      .attr('width', this.config.paddedCellSize * this.config.numColumns)
      .attr('height', this.config.paddedCellSize * this.config.numRows)

    // Draw gridlines
    if ('show_grid' in this.config) {
      this.drawGridLines(this.container)
    }

    this.annotationContainer = this.container.append('g')

    this.columns = []
    var row = this.container.append('g')

    // TODO: replace this with enter() and exit() code
    for (var x = 0; x < this.config.numColumns; x++) {
      var cellCoordinates = []
      this.columns.push(cellCoordinates)
      for (var y = 0; y < this.config.numRows; y++) {
        var cell = row.append('rect')
          .attr('class', 'd3-hinton-cell')
          .attr('x', x * this.config.paddedCellSize)
          .attr('y', y * this.config.paddedCellSize)
          .attr('width', this.config.cellSize * 0.5)
          .attr('height', this.config.cellSize * 0.5)
        // .on("mouseover", this.handleMouseOver)
        // .on("mouseout", this.handleMouseOut);
        cellCoordinates.push(cell)
      }
    }

    this.update(data, 0)
  }

  drawGridLines (container) {
    var x1 = 0
    var x2 = x1 + (this.config.paddedCellSize * (this.config.numColumns - 0))
    var y1 = x1
    var y2 = y1 + (this.config.paddedCellSize * (this.config.numRows - 0))
    for (var i = 0; i < this.config.numColumns; i++) {
      var x = (this.config.paddedCellSize / 2.0) + (i * this.config.paddedCellSize) - 0.5
      container.append('line')
        .attr('class', 'd3-hinton-gridline')
        .attr('x1', x)
        .attr('y1', y1)
        .attr('x2', x)
        .attr('y2', y2)
    }
    for (var j = 0; j < this.config.numRows; j++) {
      var y = (this.config.paddedCellSize / 2.0) + (j * this.config.paddedCellSize) - 0.5
      container.append('line')
        .attr('class', 'd3-hinton-gridline')
        .attr('x1', x1)
        .attr('y1', y)
        .attr('x2', x2)
        .attr('y2', y)
    }
  }

  annotation (config) {
    var annotation = new Annotation(config)
    annotation.draw(this.annotationContainer, this.config)
    return annotation
  }

  eachCell (callback) {
    for (var x = 0; x < this.config.numColumns; x++) {
      var column = this.columns[x]
      for (var y = 0; y < this.config.numRows; y++) {
        callback(x, y, column[y])
      }
    }
  }

  update (data, duration) {
    for (var i = 0; i < this.config.numColumns; i++) {
      var cellCoordinates = this.columns[i]
      for (var j = 0; j < this.config.numRows; j++) {
        var cell = cellCoordinates[j]
        cell.classed('negative', data[j][i] < 0.0)
        var v = Math.min(1.0, Math.abs(data[j][i]))

        var s = (this.config.cellSize * 0.8) * Math.sqrt(v)
        if (!s) s = 0.0
        var o = (this.config.cellSize - s) / 2.0
        var x = i * this.config.paddedCellSize
        var y = j * this.config.paddedCellSize
        var cellTransition = cell.transition()
        cellTransition.attr('x', x + o)
          .attr('y', y + o)
          .attr('width', s)
          .attr('height', s)
          .duration(duration)
      }
    }
  }
}

export default function (elementID, data, config) {
  return new HintonDiagram(elementID,
    data,
    config)
}
