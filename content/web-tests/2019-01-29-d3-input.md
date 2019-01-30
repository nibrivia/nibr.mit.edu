---
title: Inputting data into D3...
author: Olivia Brode-Roger
date: '2019-01-29'
slug: d3-input
---
<script src="https://d3js.org/d3.v5.min.js"></script>

Here I'm just playing around with D3, hopefully getting some user input in.

# Chart (svg edition)

<label for="new_data">Next data point</label>
<input type="number" min="0" max="300" id="new_data">
<button type="button" id="button" onclick="updateData()">Submit</button>

<svg class="svg-chart"></svg>

<style>

.svg-chart rect {
  fill: steelblue;
}

.svg-chart rect:hover {
  fill: darkred;
}

.svg-chart text {
  fill: white;
  text-anchor: end;
  font: 10px sans-serif;
}

</style>

<script>
var width = 420,
    height = 420;

var data_og = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];


// Setup
var chart = d3.select(".svg-chart")
              .attr("height", height)
              .attr("width", width);


function addData(val) {
    data_og.push(val);
    if(data_og.length > 21) {
        data_og.shift();
    }
    drawData(data_og);
    drawData(data_og);
    console.log(data_og);
}

var barWidth = 20;

function drawData(data) {
    console.log(data);

    var data_scale = d3.scaleLinear()
                  .domain([0, d3.max(data)])
                  .range([height, 0]);

    var bars = chart.selectAll("g")
      .data(data);

    bars.exit().remove();

    var new_bars = bars.enter()
        .append("g")
            .attr("transform", function(d, i) {return "translate(" + i*barWidth + ", 0)"});

    new_bars.append("rect")
        .merge(bars.select("rect"))
            .attr("y", data_scale)
            .attr("height", function(d) { return height-data_scale(d);})
            .attr("width", barWidth - 1);

    new_bars.append("text")
        .merge(bars.select("text"))
        .attr("y", function(d) {return data_scale(d) + 3})
        .attr("x", barWidth / 2)
        .attr("dx", ".50em")
        .attr("dy", ".75em")
        .text(function(d) { return d; });
}

drawData(data_og);

function updateData() {
    console.log("hey!");
    var new_value = +d3.select("#new_data").node().value;
    console.log(new_value);
    addData(new_value);
};

</script>

### Notes

 * order of `text` and `rect` matter (text after rect)
 * nested updates are tricky, but okay once you get it
 * `select` and `selectAll` are different beasts, especially within `merge`

