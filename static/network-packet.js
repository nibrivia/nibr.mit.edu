function Packet(container, from, to, label) {
    this.container = container;
    this.from = from;
    this.to   = to;
    this.label = "" + label;

    this.duration = 2000;

    this.send = sendPacket;
}

function sendPacket(drop_p) {
    if (drop_p == undefined) {
        drop_p = 0.2;
    }

    var drop = Math.random() < drop_p;

    var packet = this.container
        .append("g")
        .attr("transform", "translate(" + this.from.x + ", " + this.from.y + ")")
        .attr("class", "packet");

    packet.append("circle")
            .attr("r", 10)
            .attr("cx", 0)
            .attr("cy", 0);

    packet.append("text")
            .attr("dy", ".25em")
            .text(this.label);

    var dest_x = this.to.x;
    var dest_y = this.to.y;
    if (drop) {
        dest_x = (this.to.x + this.from.x) / 2;
        dest_y = (this.to.y + this.from.y) / 2;
    }

    packet.transition()
        .duration(this.duration)
        .attr("transform", "translate(" + dest_x + ", " + dest_y + ")")
        .remove();

    var to = this.to;
    var packet = this;

    if (!drop) {
        setTimeout(function() {to.receive(packet)}, this.duration+100);
    }
}
