"use strict";

var width  = 420,
    height = 420;

var tcp_send = [1, 1, 2, 3, 5, 8],
    lag = 1;


// Setup
var chart = d3.select(".waterfall")
              .attr("preserveAspectRatio", "xMinYMin meet")
              .attr("viewBox", "0 0 " + width + " " + height)

function addNode(chart, name, x, y) {
    var node = chart.append("g")
                          .attr("transform", "translate(" + x +", " + y + ")")
                          .attr("class", name);
    node.append("circle")
            .attr("r",  20);

    node.append("text")
            .attr("dy", ".35em")
            .attr("dx", ".25em")
            .text(name[0].toUpperCase());

    return node;

};

var channel = chart.append("g")
                    .attr("class", "channel")
                    .attr("transform", "translate(" + width/4 + ", " + 50 + ")");

var client_coords = {"x": 0,       "y": 10};
var server_coords = {"x": width/2, "y": 10};
var client = addNode(channel, "client", client_coords.x, client_coords.y);
var server = addNode(channel, "server", server_coords.x, server_coords.y);

function triggerSend() {
    sendPacket(channel, client_coords, server_coords, 1, "1");
}

function sendPacket(channel, from, to, duration, label) {
    var packet = channel.append("g")
                        .attr("class", "packet");

    channel.append("circle")
            .attr("r", 10)
            .attr("cx", from.x)
            .attr("cy", from.y)
            .style("fill", "red")
            .transition()
            .duration(duration*1000)
            .attr("cx", to.x)
            .attr("cy", to.y)
            .remove();

}


sendPacket(channel, client_coords, server_coords, 1, "1");

function drawData(data) {
    console.log(data);

    var data_scale = d3.scaleLinear()
                  .domain([0, d3.max(data)])
                  .range([height-20, 20]);

    var bars = chart.selectAll("g")
      .data(data);

    bars.exit().remove();

    var new_bars = bars.enter()
        .append("g")
            .attr("transform", function(d, i) {return "translate(" + i*barWidth + ", 0)"});

    new_bars.append("circle")
        .merge(bars.select("circle"))
            .attr("cy", data_scale)
            .attr("cx", 10)
            .attr("r", 10)

    new_bars.append("text")
        .merge(bars.select("text"))
        .attr("y", function(d) {return data_scale(d) + 3})
        .attr("x", barWidth / 2)
        .attr("dx", ".50em")
        .text(function(d) { return d; });
}


function updateData() {
    console.log("hey!");
    var new_value = +d3.select("#new_data").node().value;
    console.log(new_value);
    addData(new_value);
};

