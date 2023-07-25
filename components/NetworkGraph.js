import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import Modal from "react-modal";

function NetworkGraphModal() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullMode, setIsFullMode] = useState(false);
  const d3Container = useRef(null);

  useEffect(() => {
    setIsLoading(true);
    let queryParam = isFullMode ? "?full=true" : "";
    fetch(`/api/networkStats${queryParam}`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setIsLoading(false);
      });
  }, [modalIsOpen, isFullMode]);

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


    var defs = svg.append('defs'); // Create a <defs> element for definitions.

    var clipPath = defs.append('clipPath') // Create a <clipPath> element.
      .attr('id', 'clip-circle'); // Give the clipPath an ID.

    clipPath.append('circle') // Append a <circle> to the clipPath.
      .attr('r', 50);

    var node = g.append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(graph.nodes)
        .enter().append("g");

let circles = node.append("image")
        .attr("href", function (d) {
          return d.profilePicture;
        })
        .attr("x", -50)
        .attr("y", -50)
        .attr("width", 100)
        .attr("height", 100)
        .attr("class", "node-circle")
        .attr("clip-path", "url(#clip-circle)") // Apply the clipping path to the image.
        .each(function(d) { // Use the 'each' function to iterate over the selection
          var img = new Image();
          img.onerror = () => { // Bind the onerror event to img
            d3.select(this).attr("href", "https://static.vecteezy.com/system/resources/thumbnails/004/511/281/small/default-avatar-photo-placeholder-profile-picture-vector.jpg"); // Replace the src with the placeholder image
          }
          img.src = d.profilePicture; // Trigger the load/error event by setting the src
        });
     // Apply the clipping path to the image.
     var labelGroups = node.append("g");

     var rect = labelGroups.append("rect")
       .attr("fill", "white")
       .attr("opacity", 0.6);

     var labels = labelGroups.append("text")
       .text(function(d) { return d.id; })
       .attr("text-anchor", "middle")
       .attr("dominant-baseline", "middle")
       .style("font-size", "15px")
       .style("font-weight", "bold");

     // Compute the size of the rectangles based on the size of the text.
     labels.each(function(d) {
       var bbox = this.getBBox();
       d.bbox = bbox;
     });

     rect.attr("x", function(d) { return d.bbox.x; })
       .attr("y", function(d) { return d.bbox.y; })
       .attr("width", function(d) { return d.bbox.width; })
       .attr("height", function(d) { return d.bbox.height; });


       circles.on("click", function(d) {
        window.location.href = `/profile/${d.link}`;
      });
      labels.on("click", function(d) {
        window.location.href = `/profile/${d.link}`;
      });

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
         user.profilePictureURL = user.pfp == "gravatar" ? user.gravatarUrl : `/api/public/pfps/${user.pfp}`
            return {
            id: user.username,
            link: user.link,
            group: i,
            profilePicture: user.profilePictureURL, // Assuming profilePictureURL is the property containing the URL for the profile picture.
          };
        });

        var links = rawData.links.map(link => {
          return {
            source: rawData.users[link.source].username,
            target: rawData.users[link.target].username,
            value: 1,
          };
        });

        return { nodes, links };
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
            height: "80%",
            overflowY: "hidden",
            position: "relative"
          },
        }}
        contentLabel="Network Graph Modal"
      >
        <button
    onClick={() => setModalIsOpen(false)}
    style={{
      position: 'absolute', // The button is positioned absolutely relative to the modal.
      right: 10,
      top: 10,
      background: 'black',
      color: '#fff',
      border: 'none',
      borderRadius: '50%',
      width: '2rem',
      height: '2rem',
      display: 'flex', // Used to center the 'X' both vertically and horizontally.
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '1rem',
    }}
  >
    X
  </button>
        <input type="checkbox" id="full" checked={isFullMode} onChange={() => setIsFullMode(!isFullMode)} />
        <label htmlFor="full" className="text-black">Show up to 3rd degree connections</label>

        {isLoading ?<div className="flex justify-center items-center flex-col">
            <h1 className="text-xl font-bold text-black">Crunching the latest data...</h1>
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
          </div> : <svg ref={d3Container} className="w-full h-full"></svg>}

      </Modal>
    </div>
  );
}

export default NetworkGraphModal;
