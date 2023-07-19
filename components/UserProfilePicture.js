import React, { useState } from 'react';
import md5 from 'blueimp-md5';

const UserProfilePicture = ({ editable, email, pfp }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGravatar, setIsGravatar] = useState(!pfp || pfp === 'gravatar');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(
    (!pfp || pfp==='gravatar') ? `https://www.gravatar.com/avatar/${md5(email.trim().toLowerCase())}?d=identicon` : `/api/public/pfps/${pfp}`
  );
  const [previewSrc, setPreviewSrc] = useState(imageSrc);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleClose = () => {
    setIsGravatar(!pfp || pfp === 'gravatar');
    setSelectedFile(null);
    setPreviewSrc(imageSrc);
    setIsOpen(false);
  };

  const handleSave = async () => {
    const formData = new FormData();
    console.log("Huh")
    if (isGravatar) {
      const response = await fetch('/api/setPfp', {
        method: 'POST',
      });

      if (response.ok) {
        const gravatarUrl = `https://www.gravatar.com/avatar/${md5(email.trim().toLowerCase())}?d=identicon`;
        setImageSrc(gravatarUrl);
        setPreviewSrc(gravatarUrl);
        setIsOpen(false);
      }
    } else if (selectedFile) {
      formData.append('file', selectedFile);
      const response = await fetch('/api/setPfp', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const uploadedUrl = URL.createObjectURL(selectedFile);
        setImageSrc(uploadedUrl);
        setPreviewSrc(uploadedUrl);
        setIsOpen(false);
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

      reader.readAsDataURL(file);
    }
  };

  const handleOptionChange = (e) => {
    setIsGravatar(e.target.value === 'gravatar');
    if (e.target.value === 'gravatar') {
      setSelectedFile(null);
      setPreviewSrc(`https://www.gravatar.com/avatar/${md5(email.trim().toLowerCase())}?d=identicon`);
    } else {
      setSelectedFile(null);
      setPreviewSrc(null);
    }
  };

  const renderProgressBar = () => {
    return (
      <div className="relative w-full h-2 bg-gray-200 rounded-md">
        <div
          className="absolute top-0 left-0 h-full bg-green-500 rounded-md"
          style={{ width: `${uploadProgress}%` }}
        ></div>
      </div>
    );
  };

  return (
    <div className='w-full pb-16'>
      <div className="flex relative justify-center items-center mb-4 cursor-pointer" onClick={() => setIsOpen(true)}>
        <img className="absolute p-2 bg-gray-800 rounded-full h-44 w-44 shadow-2xl shadow-black hover:-translate-y-2 duration-300 ease-in-out" src={imageSrc} alt="User Profile" />
      </div>

      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white dark:bg-gray-800 p-4 rounded-md max-w-lg mx-auto">
            <button className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-2 rounded-full" onClick={handleClose}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M13.414 10l4.293-4.293a1 1 0 0 0-1.414-1.414L12 8.586 7.707 4.293a1 1 0 0 0-1.414 1.414L10.586 10l-4.293 4.293a1 1 0 1 0 1.414 1.414L12 11.414l4.293 4.293a1 1 0 1 0 1.414-1.414L13.414 10z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <div className="flex flex-col h-full">
              {editable && (
                <div className="p-4 flex-shrink-0">
                  <div className="flex items-center mb-4">
                    <input type="radio" id="gravatar" name="image" value="gravatar" checked={isGravatar} onChange={handleOptionChange} className="mr-2" />
                    <label htmlFor="gravatar" className="text-lg">
                      Use Gravatar
                    </label>
                  </div>

                  <div className="flex items-center mb-4">
                    <input type="radio" id="upload" name="image" value="upload" checked={!isGravatar} onChange={handleOptionChange} className="mr-2" />
                    <label htmlFor="upload" className="text-lg">
                      Upload Image
                    </label>
                  </div>

                  {!isGravatar && (
                    <div className="flex items-center mb-4">
                      <input type="file" accept="image/*" onChange={handleImageChange} className="py-2 px-4 border border-gray-400 rounded-md cursor-pointer" />
                    </div>
                  )}
                </div>
              )}

              <div className="flex-grow">
                {uploadProgress > 0 && renderProgressBar()}

                    {previewSrc ? (
                <img className="w-full h-full object-contain mx-auto rounded-md" src={previewSrc} alt="User Profile" />
                    ) : null}
              </div>

              {editable && (
                <button
                  className="bg-blue-500/50 hover:bg-blue-700/50 duration-300 ease-in-out transition text-white font-bold py-2 px-4 rounded-md mt-4"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePicture;
