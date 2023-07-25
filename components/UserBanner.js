import React, { useState } from 'react';

const UserBanner = ({ editable, banner }) => {
  const [selectedFile, setSelectedFile] = useState();
  const [uploading, setUploading] = useState(false);

  const handleBannerUpload = async (file) => {
    if (!file) {
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/setBanner', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      window.location.reload();
    } else {
      try {
      let data = await response.json();
      alert("Failed to upload banner: " + data.error || "Unknown error");
      } catch (e) {
        alert("Failed to upload banner");
      }
    }

    setUploading(false);
  };

  const handleBannerRemove = async () => {
    setUploading(true);

    const response = await fetch('/api/setBanner', {
      method: 'POST',
    });

    if (response.ok) {
      window.location.reload();
    } else {
      try {
      let data = await response.json();

      alert("Failed to remove banner: " + data.error || "Unknown error");
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
    <div className={`${banner ? "mb-0" : "mb-20" } user-banner my-2`}>

      {editable ? (
        <div className='mt-2 mx-auto text-center w-min min-w-max mb-4'>
          <label
  htmlFor="banner-upload"
  className="dark:text-white text-black py-2 px-4 hover:rounded mx-auto cursor-pointer hover:bg-gray-400 dark:hover:bg-blue-500/50 duration-300 transition"
>
  {banner ? 'Change Banner' : 'Add Banner'}
</label>
          <input type="file" id="banner-upload" accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
          {banner ? (
            <button className=" dark:text-white text-black py-2 px-4 rounded hover:bg-gray-400 dark:hover:bg-red-500/50 duration-300 transition" onClick={handleBannerRemove} disabled={uploading}>
            {uploading ? 'Processing...' : 'Remove Banner'}
          </button>
          ) : null}
        </div>
      ) : null}
      {banner ? (
        <img src={'/api/public/banners/'+banner} alt="User Banner" className="w-11/12 p-2 bg-white dark:p-0 dark:bg-none rounded mx-auto mt-4 h-64 object-cover object-center" />

    // <div style={{ width: '100%', height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
    //     <img src={'/banners/'+banner} alt="User Banner" className=" object-cover object-top" style={{ width: '100%', height: 'auto' }} />
    // </div>
      ) : null}
    </div>
  );
};

export default UserBanner;
