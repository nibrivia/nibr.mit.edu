"use strict";

var width  = 420,
    height = 420;

// Setup
var chart = d3.select(".waterfall")
              .attr("preserveAspectRatio", "xMinYMin meet")
              .attr("viewBox", "0 0 " + width + " " + height); // virtual pixels, for scaling

var channel = chart.append("g")
                    .attr("class", "channel")
                    .attr("transform", "translate(" + width/8 + ", " + 50 + ")");

var client_coords = {"x": 0,       "y": 0};
var server_coords = {"x": width*6/8, "y": 0};
var client = new Node(client_coords, "client", channel);
var server = new Node(server_coords, "server", channel);

function triggerSend() {
    client.queuePacketTo(server, "0", 1);
}

/** sendPacket(
 *      channel:  box in which the channel lives
 *      from:     object with .x and .y about the start of the transmission
 *      to:       object with .x and .y about the destination of the transmission
 *      duration: how long the packet should take to do the trip, in ms
 *      label:    what the packet should say
 *
 */

triggerSend();

setTimeout(function() {triggerSend();triggerSend();triggerSend();}, 300);

