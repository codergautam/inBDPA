// components/UserBanner.js
// This code is a functional component called `UserBanner` that displays a user banner image and allows for editing and uploading of the image. It takes two props, `editable` which determines if the banner is editable or not, and `banner` which is the filename of the current banner image.
//
// The component uses the React `useState` hook to manage the state of `selectedFile`, `uploading`, and `noImage`. It also uses the `useEffect` hook to call `imageRefCb` when the component mounts.
//
// There are several functions defined within the component. `imageRefCb` is a callback function that sets the reference to the image element and checks if the image is complete. `handleBannerUpload` is an asynchronous function that uploads the selected file to the server. `handleBannerRemove` is an asynchronous function that removes the banner image from the server. `handleFileSelect` is a function that handles when a file is selected for upload.
//
// The component renders a div container with a conditional class based on if there is a banner or not. If `editable` is true, it renders buttons for changing or removing the banner. If `banner` exists, it renders the image element with the appropriate source and event listeners.
//
// Overall, this component is responsible for rendering and managing user banners, including the ability to edit and upload new banners.
import React, { useState, useEffect } from "react";
import Image from "next/image";

const UserBanner = ({ editable, banner }) => {
  const [selectedFile, setSelectedFile] = useState();
  const [uploading, setUploading] = useState(false);
  const [noImage, setNoImage] = useState(true);
  let imageEl = null;

  const imageRefCb = (image) => {
    if (image) {
      imageEl = image;
      if (image.complete) {
        setNoImage(false);
      }
    }
  };

  useEffect(() => {
    imageRefCb(imageEl);
  });

  const handleBannerUpload = async (file) => {
    if (!file) {
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/setBanner", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      window.location.reload();
    } else {
      try {
        let data = await response.json();
        alert("Failed to upload banner: " + (data.error || "Unknown error"));
      } catch (e) {
        alert("Failed to upload banner");
      }
    }

    setUploading(false);
  };

  const handleBannerRemove = async () => {
    setUploading(true);

    const response = await fetch("/api/setBanner", {
      method: "POST",
    });

    if (response.ok) {
      window.location.reload();
    } else {
      try {
        let data = await response.json();
        alert("Failed to remove banner: " + (data.error || "Unknown error"));
      } catch (e) {
        alert("Failed to remove banner.");
      }
    }

    setUploading(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    handleBannerUpload(file);
  };

  return (
    <div className={`${banner ? "mb-0" : "mb-20"} user-banner my-2`}>
      {editable ? (
        <div className="mt-2 mx-auto text-center w-min min-w-max mb-4 space-x-2">
          <label
            htmlFor="banner-upload"
            className="px-4 py-2 text-white cursor-pointer bg-blue-600 hover:bg-blue-700 rounded-md duration-200 ease-in-out transition"
          >
            {banner ? "Change Banner" : "Add Banner"}
          </label>
          <input
            type="file"
            id="banner-upload"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
          {banner ? (
            <button
              className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md duration-200 ease-in-out transition"
              onClick={handleBannerRemove}
              disabled={uploading}
            >
              {uploading ? "Processing..." : "Remove Banner"}
            </button>
          ) : null}
        </div>
      ) : null}

      {banner ? (
        <img
          src={"/api/public/banners/" + banner}
          alt="User Banner"
          className={`w-11/12 p-2 bg-white dark:p-0 dark:bg-none rounded mx-auto mt-4 h-64 object-cover object-center ${
            noImage ? "" : ""
          }`}
          ref={imageRefCb}
          onError={() => setNoImage(true)}
          onLoad={() => setNoImage(false)}
        />
      ) : null}
    </div>
  );
};

export default UserBanner;
