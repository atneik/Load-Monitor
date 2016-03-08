var Viz = (function () {

  var data, line, path, x, xAxis, y, width, height;
  var margin = {top: 20, right: 20, bottom: 40, left: 40};

  function LineChart(initData, divId) {
    d3.select("#viz svg").remove();
    
    width = 600 - margin.left - margin.right;
    height = 200 - margin.top - margin.bottom;

    data = initData.lastNLoad;

    x = d3.scale.linear()
      .domain([0, data.length - 1])
      .range([0, width]);
    
    y = d3.scale.linear()
      .domain([0, initData.cpu.length])
      .range([height, 0]);

    line = d3.svg.line()
      .x(function(d, i) { return x(i); })
      .y(function(d, i) { return y(d.data); });

    var svg = d3.select("#viz").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    svg.append("defs").append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", width)
      .attr("height", height + margin.bottom);
    svg.append("g")
      .attr("class", "y axis")
      .call(d3.svg.axis().scale(y).orient("left"));

    path = svg.append("g")
      .attr("clip-path", "url(#clip)")
      .append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);

    xAxis = svg.append("g")
      .attr("clip-path", "url(#clip)")
      .attr("class", "x-time axis")
      .append("g")
      .attr("transform", "translate(" + x(0) + "," + y(0) +")")
      .call(getXAxes());
  }

  function getXAxes() {
    var timeFormat = d3.time.format("%I:%M %p");
    var xExtent = d3.extent(data, function(d){return Date.parse(d.time)});
    var xScale = d3.time.scale()
        .range([0, width + x(1)])
        .domain(xExtent);
    return d3.svg.axis()
      .scale(xScale)
      .orient("bottom")
      .ticks(d3.time.seconds, 60)
      .tickFormat(timeFormat);
  }

  function update(){
    xAxis.transition()
      .ease("linear")
      .call(getXAxes());

    path.attr("d", line)
      .attr("transform", null)
      .transition()
      .ease("linear")
      .attr("transform", "translate(" + x(-1) + ",0)");
  }

  function addPoint(point) {
    data.push(point);
    update(); 
    data.shift();
  }

  LineChart.prototype = {
    constructor: LineChart,
    addPoint: addPoint
  };

  return {
    LineChart: LineChart
  };
}());