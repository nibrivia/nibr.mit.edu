/** Node object
 *
 * Properties:
 *  .x: x coordinate
 *  .y: y coordinate
 *  .label: text
 *  .dom:   handle to DOM element
 */
function Node(coords, label, container) {
    // Fields
    // drawing
    this.x = coords.x;
    this.y = coords.y;
    this.label = label;
    this.container = container;

    this.drop = false;

    // tcp
    this.timeouts= {}; // in-flight packets
    this.queue   = [];  // packet queue
    this.w       = 2;
    this.timeout_duration = 5;
    this.seq_num = 0;


    // Methods
    this.drawNode = drawNode;
    this.explain  = explain;

    this.receive       = receive;
    this.queuePacketTo = queuePacketTo;
    this.timeout       = timeout;
    this.trySend       = trySend;

    // Draw
    this.dom = this.drawNode(container);
}

function explain(message) {
    console.log(this.label + ": " + message);
    this.explain_box.append("text")
        .attr("dy", 10*this.line + "px")
        .text(message);
    this.line++;
}

/** addNode(
 *      chart: div in which node should live
 *      name:  string name of the node
 *      x:     x coordinates for node
 *      y:     y coordinates for node
 *  )
 *
 *  draws circle at location specified by x, y in chart, with a text label of name
 *
 *  returns: node div
 */
function drawNode() {
    var node = this.container.append("g")
                          .attr("transform", "translate(" + this.x +", " + this.y + ")")
                          .attr("class", this.label);
    node.append("circle")
            .attr("r",  20);

    node.append("text")
            .attr("dy", ".35em")
            .text(this.label[0].toUpperCase());

    this.line = 0;
    this.explain_box = node.append("g")
        .attr("transform", "translate(0, " + 20 + ")")
        .attr("class", "explain");

    return node;
}

// internal
function trySend() {
    // Queue is empty, short circuit
    if (this.queue.length == 0) {
        return;
    }

    // We have room to send more, and we have stuff to send
    var in_flight_n = Object.keys(this.timeouts).length;

    if (this.w > in_flight_n) {
        var packet = this.queue.shift();
        packet.send();
        this.explain("Sent packet " + packet.label + "!");


        // Create timeout
        var sender = this;
        this.timeouts["ack-" + packet.label] = setTimeout(function() {sender.timeout(packet)}, this.timeout_duration * 1000);
    }
}

function queuePacketTo(to) {
    // label will be used in the rest of this function
    var label = this.seq_num;
    this.seq_num++;

    // Create packet
    var packet = new Packet(this.container, this, to, label);

    // Add to queue
    this.queue.push(packet);

    // Attempt to send
    this.trySend();
}

function timeout(packet) {
    // requeue packet. TODO Should be at front of queue
    this.explain("Packet " + packet.label + " timed out...");
    delete this.timeouts["ack-" + packet.label];
    this.queue.unshift(packet);
    this.trySend();
}

function receive(packet) {
    var label = packet.label;
    var from  = packet.from;


    if (!label.includes("ack")) {
        this.explain("Got data! " + label);
        // Data packet -> send ack
        var ack_packet = new Packet(this.container, this, from, "ack-" + label);

        // TODO ack immediately, or put in queue?
        ack_packet.send();

    } else {
        // Ack packet
        this.explain("Got an ack! " + label);

        // Disable timeout timer
        if (label in this.timeouts) {
            clearTimeout(this.timeouts[label]);
            delete this.timeouts[label];
        }

        // Try sending something new :)
        this.trySend();
    }
}
