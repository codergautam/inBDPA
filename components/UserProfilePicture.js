// components/UserProfilePicture.js
// This file contains the code for the UserProfilePicture component. The component is responsible for displaying a user's profile picture and allowing the user to edit or change it. The component uses the react-easy-crop library for cropping images.
//
// - The component uses state hooks to manage various variables such as the crop position, zoom level, and file input.
// - The component uses the hashedEmail prop to generate a gravatar URL if the user does not have a profile picture.
// - The handleSave function is responsible for saving the changes made to the profile picture. It makes a POST request to the '/api/setPfp' endpoint, sending the selected file, crop position, and zoom level.
// - The handleImageChange function is triggered when a user selects a file from the file input. It reads the file using the FileReader API and sets the selectedFile and previewSrc state values.
// - The handleOptionChange function is triggered when a user selects the "Use Gravatar" or "Upload Image" option. It sets the isGravatar state value and updates the previewSrc accordingly.
// - The handleClose function is responsible for resetting the component's state values when the modal is closed.
// - The component renders an image element which displays the profile picture. When clicked, it opens a modal where the user can edit or change the profile picture.
// - The modal allows the user to choose between using their Gravatar or uploading a custom image. If the user chooses to upload an image, they can select a file from their device and see a preview of the selected image.
// - When the user saves their changes, the appropriate action is taken based on the chosen option. If the user chooses to use their Gravatar, a request is made to the server to set the profile picture as the user's Gravatar. If the user chooses to upload an image, the file is sent to the server along with the crop position and zoom level.
// - The component also handles error states and displays any errors that occur during the image upload process.
import React, { useState } from "react";
import Cropper from "react-easy-crop";

const UserProfilePicture = ({ editable, hashedEmail, pfp }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [zoom, setZoom] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [isGravatar, setIsGravatar] = useState(!pfp || pfp === "gravatar");
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(
    !pfp || pfp === "gravatar"
      ? `https://www.gravatar.com/avatar/${hashedEmail}?d=identicon`
      : `/api/public/pfps/${pfp}`
  );
  const [previewSrc, setPreviewSrc] = useState(imageSrc);
  const [fileSet, setFileSet] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleClose = () => {
    setIsGravatar(!pfp || pfp === "gravatar");
    setSelectedFile(null);
    setPreviewSrc(imageSrc);
    setIsOpen(false);
    setFileSet(false);
    setError(null);
    setZoom(1);
    setCropArea({ x: 0, y: 0, width: 0, height: 0 });
  };

  const handleSave = async () => {
    if (saving) return;
    setError(null);
    const formData = new FormData();
    if (isGravatar) {
      setSaving(true);

      const response = await fetch("/api/setPfp", {
        method: "POST",
      });
      setSaving(false);

      if (response.ok) {
        const gravatarUrl = `https://www.gravatar.com/avatar/${hashedEmail}?d=identicon`;
        setImageSrc(gravatarUrl);
        setPreviewSrc(gravatarUrl);
        setIsOpen(false);
      }
    } else if (selectedFile) {
      setSaving(true);

      formData.append("file", selectedFile);
      formData.append("crop", JSON.stringify(cropArea));
      formData.append("zoom", zoom);
      const response = await fetch("/api/setPfp", {
        method: "POST",
        body: formData,
      });
      setSaving(false);

      if (response.ok) {
        const { id } = await response.json();
        setImageSrc(`/api/public/pfps/${id}`);
        setPreviewSrc(`/api/public/pfps/${id}`);
        setIsOpen(false);
        setFileSet(false);
        setZoom(1);
        setCropArea({ x: 0, y: 0, width: 0, height: 0 });
      } else {
        try {
          const { error } = await response.json();
          setError(error ?? "Failed to upload image");
        } catch (e) {
          setError("Failed to upload image");
        }
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        setSelectedFile(file);
        setPreviewSrc(reader.result);
      };
      setFileSet(true);

      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleOptionChange = (e) => {
    setIsGravatar(e.target.value === "gravatar");
    if (e.target.value === "gravatar") {
      setSelectedFile(null);
      setPreviewSrc(
        `https://www.gravatar.com/avatar/${hashedEmail}?d=identicon`
      );
    } else {
      setSelectedFile(null);
    }
  };

  return (
    <div className="w-full pb-16">
      <div
        className="flex justify-center items-center mb-4 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <img
          className="absolute p-2 bg-white dark:bg-gray-800 rounded-full h-28 w-28 md:w-36 md:h-36 lg:h-48 lg:w-48 shadow-2xl shadow-gray-300 dark:shadow-black hover:-translate-y-2 duration-300 ease-in-out"
          src={imageSrc}
          alt="User Profile"
        />
      </div>

      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white dark:bg-gray-800 p-4 rounded-md max-w-lg mx-auto">
            <button
              className="absolute top-2 right-2"
              onClick={handleClose}
              style={{ zIndex: 10 }}
            >
              <svg
                className="fill-current text-red-500 hover:text-red-400 w-7 h-7 p-1 stroke-2 ml-auto rounded-full bg-white dark:bg-black"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    className="fill-current stroke-red-600"
                    d="M7 17L16.8995 7.10051"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>{" "}
                  <path
                    className="fill-current stroke-red-600"
                    d="M7 7.00001L16.8995 16.8995"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </g>
              </svg>
            </button>

            <div className="flex flex-col h-full">
              {editable && (
                <div className="p-4 flex-shrink-0">
                  <div className="flex items-center mb-4">
                    <input
                      type="radio"
                      id="gravatar"
                      name="image"
                      value="gravatar"
                      checked={isGravatar}
                      onChange={handleOptionChange}
                      className="mr-2"
                    />
                    <label
                      htmlFor="gravatar"
                      className="text-lg text-black dark:text-white"
                    >
                      Use Gravatar
                    </label>
                  </div>

                  <div className="flex items-center mb-4">
                    <input
                      type="radio"
                      id="upload"
                      name="image"
                      value="upload"
                      checked={!isGravatar}
                      onChange={handleOptionChange}
                      className="mr-2"
                    />
                    <label
                      htmlFor="upload"
                      className="text-lg text-black dark:text-white"
                    >
                      Upload Image
                    </label>
                  </div>

                  {!isGravatar && (
                    <div className="flex items-center mb-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="py-2 px-4 border border-gray-400 rounded-md cursor-pointer text-black dark:text-white"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="flex-grow">
                {previewSrc && fileSet ? (
                  <div className="w-96 h-48 max-h-48 relative">
                    <Cropper
                      cropSize={{ width: 200, height: 200 }}
                      image={previewSrc}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      onCropChange={setCrop}
                      onCropAreaChange={setCropArea}
                      onZoomChange={setZoom}
                    />
                  </div>
                ) : // <img className="w-full h-full object-contain mx-auto rounded-md" src={previewSrc} alt="User Profile" />

                null}
                {previewSrc && isGravatar && editable ? (
                  <div
                    className="flex justify-center items-center"
                    style={{ zIndex: 5 }}
                  >
                    <img
                      className="w-48 h-48 max-h-48 relative"
                      src={previewSrc}
                      alt="User Profile"
                    />
                  </div>
                ) : null}
                {!editable && (
                  <div
                    className="flex justify-center items-center"
                    style={{ zIndex: 5 }}
                  >
                    {/* preview image */}
                    <img
                      className="w-48 h-48 max-h-48 relative"
                      src={previewSrc}
                      alt="User Profile"
                    />
                  </div>
                )}
              </div>

              {editable && (
                <button
                  className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 rounded-md duration-200 ease-in-out transition mt-4"
                  onClick={handleSave}
                >
                  {saving ? "Saving Changes.." : "Save Changes"}
                </button>
              )}
              {error && (
                <span className="text-red-500 text-sm mt-2">{error}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePicture;
