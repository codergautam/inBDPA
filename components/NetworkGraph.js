import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import Modal from "react-modal";

function NetworkGraphModal() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [data, setData] = useState(null);
  const d3Container = useRef(null);

  useEffect(() => {
    fetch("/api/networkStats")
    .then((response) => response.json())
    .then((data) => setData(data));
  }, [modalIsOpen]);

  useEffect(() => {
    if (modalIsOpen && data && d3Container.current) {
      const svg = d3.select(d3Container.current);
      svg.selectAll("*").remove(); // Clear any previous content from SVG

      var width = svg.node().parentNode.clientWidth;
      var height = svg.node().parentNode.clientHeight;

      var g = svg.append("g");

      var zoom = d3.zoom()
          .scaleExtent([0.5, 10])
          .on("zoom", function() { g.attr("transform", d3.event.transform); });

      svg.call(zoom);

      var color = d3.scaleOrdinal(d3.schemeCategory10);

      var simulation = d3.forceSimulation()
          .force("link", d3.forceLink().id(function (d) { return d.id; }).distance(200).strength(1))
          .force("charge", d3.forceManyBody().strength(-1000))
          .force("center", d3.forceCenter(width / 2, height / 2))
          .force("collision", d3.forceCollide().radius(50));

      var rawData = data;
      var graph = processRawData(rawData);

      var link = g.append("g")
          .attr("class", "links")
          .selectAll("line")
          .data(graph.links)
          .enter().append("line")
          .attr("stroke-width", function (d) { return Math.sqrt(d.value); });

      var node = g.append("g")
          .attr("class", "nodes")
          .selectAll("g")
          .data(graph.nodes)
          .enter().append("g")

      var circles = node.append("circle")
          .attr("r", 30)
          .attr("fill", function (d) { return color(d.group); });

      var labels = node.append("text")
          .text(function(d) { return d.id; })
          .attr('x', 6)
          .attr('y', 3);

      node.append("title")
          .text(function (d) { return d.id; });

      simulation
          .nodes(graph.nodes)
          .on("tick", ticked);

      simulation.force("link")
          .links(graph.links);

      function ticked() {
          link
              .attr("x1", function (d) { return d.source.x; })
              .attr("y1", function (d) { return d.source.y; })
              .attr("x2", function (d) { return d.target.x; })
              .attr("y2", function (d) { return d.target.y; });

          node
              .attr("transform", function(d) {
                  return "translate(" + d.x + "," + d.y + ")";
              })
      }

      function processRawData(rawData) {
          var nodes = Object.values(rawData.users).map((user, i) => {
              return {id: user.username, group: i};
          });

          var links = rawData.links.map(link => {
              return {
                  source: rawData.users[link.source].username,
                  target: rawData.users[link.target].username,
                  value: 1
              }
          });

          return {nodes, links};
      }
    }
  }, [modalIsOpen, data]);

  return (
    <div className="p-5">
      <button
        onClick={() => setModalIsOpen(true)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Open Network Graph
      </button>

      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={() => {}}
        onRequestClose={() => setModalIsOpen(false)}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            height: "80%", // Set the desired height for the modal
          },
        }}
        contentLabel="Network Graph Modal"
      >
        <svg ref={d3Container} className="w-full h-full"></svg>
      </Modal>
    </div>
  );
}

export default NetworkGraphModal;
