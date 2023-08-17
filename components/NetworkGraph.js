// components/NetworkGraph.js
// The file contains an implementation of a React component called "NetworkGraphModal". The component displays a network graph in a modal. It uses the vis-network library to render the graph.
//
// The component has several states, such as modalIsOpen, data, isLoading, isFullMode, and isRendering, to manage its behavior and UI.
//
// The component includes two useEffect hooks. The first hook fetches the network data from an API endpoint when the modal is opened or the full mode checkbox is toggled. It sets the fetched data to the component's state.
//
// The second useEffect hook is responsible for rendering the network graph when the modal is open and data is available. It creates an array of nodes and edges based on the fetched data and renders them using the vis-network library. It also includes event listeners for node selection, zooming, panning, and node hover.
//
// The component also includes UI elements, such as a button to open the modal, a modal to display the network graph, and a checkbox to toggle between full and limited mode.
//
// While the code appears to be functioning correctly, it could benefit from some code cleanup and better separation of concerns.
import React, { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import { DataSet, Network } from "vis-network/standalone/umd/vis-network";

function NetworkGraphModal({ user }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullMode, setIsFullMode] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const visContainer = useRef(null);

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
    if (modalIsOpen && visContainer.current) {
      setIsRendering(true);
      // create an array with nodes
      var nodes = new DataSet(
        Object.keys(data.users).map((a, i) => {
          return {
            id: a,
            shape: "circularImage",
            image:
              (data.users[a].pfp === "gravatar"
                ? data.users[a].gravatarUrl
                : "/api/public/pfps/" + data.users[a].pfp) ??
              "/api/public/pfps/placeholder",
            label: data.users[a].username,
            link: "/profile/" + data.users[a].link,
            size: user == a ? 40 : 30,
          };
        })
      );

      // create an array with edges
      // Helper function to generate a unique key for each connection
      function generateKey(from, to) {
        return [from, to].sort().join("-");
      }

      // Create a set to keep track of unique connections
      let uniqueConnections = new Set();

      // Create an array with edges
      let links = data.links
        .map((a) => {
          return {
            from: a.source,
            to: a.target,
          };
        })
        .filter((a) => {
          // Generate a key for the current connection
          let key = generateKey(a.from, a.to);

          // If the key is already in the set, filter out the connection
          if (uniqueConnections.has(key)) {
            return false;
          }

          // Otherwise, add the key to the set and keep the connection
          uniqueConnections.add(key);
          return true;
        })
        .filter((a) => a.from !== a.to);

      var edges = new DataSet(links);

      // create a network
      var container = visContainer.current;
      var datanode = {
        nodes: nodes,
        edges: edges,
      };
      var options = {
        nodes: {
          borderWidth: 4,
          size: 30,
          color: {
            border: "#222222",
            background: "#666666",
          },
          font: {
            color: "#222222",
            size: 14,
            face: "arial",
            background: "white",
          },
        },
        interaction: {
          dragNodes: false,
          hover: true,
          zoomSpeed: 0.3,
        },
      };

      var network = new Network(container, datanode, options);
      network.on("afterDrawing", function () {
        setIsRendering(false);
      });
      let lastPosition = null;
      const max_zoom = 2;
      const min_zoom = 0.5;
      network.on("zoom", function (params) {
        if (params.scale < min_zoom || params.scale > max_zoom) {
          // adjust this value according to your requirement
          network.moveTo({
            position: lastPosition, // use the last position before zoom limit
            scale: params.scale > max_zoom ? max_zoom : min_zoom, // this scale prevents zooming out beyond the desired limit
          });
        } else {
          // store the current position as the last position before zoom limit
          lastPosition = network.getViewPosition();
        }
      });
      // on pan, store the current position
      network.on("dragEnd", function () {
        lastPosition = network.getViewPosition();
      });

      // Event listener for when a node is selected
      network.on("click", function (params) {
        if (params.nodes.length > 0) {
          // The user clicked on a node
          var nodeId = params.nodes[0]; // Get the ID of the first selected node

          // Get the node data from the DataSet
          var nodeData = nodes.get(nodeId);

          // Open the link in a new tab
          window.open(nodeData.link, "_blank");
        }
      });

      network.on("hoverNode", function () {
        visContainer.current.style.cursor = "pointer"; // Change cursor to pointer
      });
      network.on("blurNode", function () {
        visContainer.current.style.cursor = "default"; // Change cursor back to default
      });
    }
  }, [modalIsOpen, data]);

  return (
    <>
      <button
        className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md duration-200 ease-in-out transition"
        onClick={() => setModalIsOpen(true)}
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
            position: "relative",
          },
        }}
        contentLabel="Network Graph Modal"
      >
        <button
          onClick={() => setModalIsOpen(false)}
          style={{
            position: "absolute", // The button is positioned absolutely relative to the modal.
            right: 10,
            top: 10,
            background: "black",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: "2rem",
            height: "2rem",
            display: "flex", // Used to center the 'X' both vertically and horizontally.
            justifyContent: "center",
            alignItems: "center",
            fontSize: "1rem",
          }}
        >
          X
        </button>
        <input
          type="checkbox"
          id="full"
          className="accent-blue-600"
          checked={isFullMode}
          onChange={() => setIsFullMode(!isFullMode)}
        />
        <label htmlFor="full" className="text-black">
          Show up to 3rd degree connections
        </label>

        {isLoading ? (
          <div className="flex justify-center items-center flex-col">
            <h1 className="text-xl font-bold text-black">
              Crunching the latest data...
            </h1>
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            {isRendering ? (
              <div className="flex justify-center items-center flex-col">
                <h1 className="text-xl font-bold text-black">Rendering..</h1>
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : null}

            <div ref={visContainer} className="w-full h-full"></div>
          </>
        )}
      </Modal></>
  );
}

export default NetworkGraphModal;
