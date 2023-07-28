import React, { useState } from 'react';
import md5 from 'blueimp-md5';
import Cropper from 'react-easy-crop'

const UserProfilePicture = ({ editable, email, pfp }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [cropArea, setCropArea] = useState({x: 0, y: 0, width: 0, height: 0})
  const [zoom, setZoom] = useState(1)
  const [isOpen, setIsOpen] = useState(false);
  const [isGravatar, setIsGravatar] = useState(!pfp || pfp === 'gravatar');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(
    (!pfp || pfp==='gravatar') ? `https://www.gravatar.com/avatar/${md5(email.trim().toLowerCase())}?d=identicon` : `/api/public/pfps/${pfp}`
  );
  const [previewSrc, setPreviewSrc] = useState(imageSrc);
  const [fileSet, setFileSet] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleClose = () => {
    setIsGravatar(!pfp || pfp === 'gravatar');
    setSelectedFile(null);
    setPreviewSrc(imageSrc);
    setIsOpen(false);
    setFileSet(false);
    setZoom(1);
    setCropArea({x: 0, y: 0, width: 0, height: 0})
  };

  const handleSave = async () => {
    if(saving) return;
    const formData = new FormData();
    if (isGravatar) {
    setSaving(true);

      const response = await fetch('/api/setPfp', {
        method: 'POST',
      });
      setSaving(false);

      if (response.ok) {
        const gravatarUrl = `https://www.gravatar.com/avatar/${md5(email.trim().toLowerCase())}?d=identicon`;
        setImageSrc(gravatarUrl);
        setPreviewSrc(gravatarUrl);
        setIsOpen(false);
      }
    } else if (selectedFile) {
    setSaving(true);

      formData.append('file', selectedFile);
      formData.append('crop', JSON.stringify(cropArea));
      formData.append('zoom', zoom);
      const response = await fetch('/api/setPfp', {
        method: 'POST',
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
        setCropArea({x: 0, y: 0, width: 0, height: 0})
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
    setIsGravatar(e.target.value === 'gravatar');
    if (e.target.value === 'gravatar') {
      setSelectedFile(null);
      setPreviewSrc(`https://www.gravatar.com/avatar/${md5(email.trim().toLowerCase())}?d=identicon`);
    } else {
      setSelectedFile(null);
    }
  };


  return (
    <div className='w-full pb-16'>
      <div className="flex justify-center items-center mb-4 cursor-pointer" onClick={() => setIsOpen(true)}>
        <img className="absolute p-2 bg-white dark:bg-gray-800 rounded-full h-auto w-auto sm:h-28 sm:w-28 md:w-36 md:h-36 lg:h-48 lg:w-48 shadow-2xl shadow-gray-300 dark:shadow-black hover:-translate-y-2 duration-300 ease-in-out" src={imageSrc} alt="User Profile" />
      </div>

      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white dark:bg-gray-800 p-4 rounded-md max-w-lg mx-auto">
            <button className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-2 justify-center rounded-full" onClick={handleClose} style={{zIndex: 10}}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" style={{zIndex: 50}}>
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

                    {previewSrc && fileSet ? (

                      <div className="w-96 h-48 max-h-48 relative">
<Cropper cropSize={{width: 200, height: 200}} image={previewSrc} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onCropAreaChange={setCropArea} onZoomChange={setZoom} />
                      </div>
                // <img className="w-full h-full object-contain mx-auto rounded-md" src={previewSrc} alt="User Profile" />

                    ) : null}
                    {previewSrc && isGravatar && editable ? (
                      <div className="flex justify-center items-center" style={{zIndex: 5}}>
                        <img className="w-48 h-48 max-h-48 relative" src={previewSrc} alt="User Profile"  />
                      </div>
                    ) : null}
                    {!editable && (
                      <div className="flex justify-center items-center" style={{zIndex: 5}}>

                        {/* preview image */}
                        <img className="w-48 h-48 max-h-48 relative" src={previewSrc} alt="User Profile" />
                      </div>

                    )}
              </div>

              {editable && (
                <button
                  className="bg-blue-500/50 hover:bg-blue-700/50 duration-300 ease-in-out transition text-white font-bold py-2 px-4 rounded-md mt-4"
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
