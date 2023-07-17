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
    <div className="user-banner">
        {banner ? (

      <div style={{ width: '100%', height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
          <img src={'/banners/'+banner} alt="User Banner" style={{ width: '100%', height: 'auto' }} />
      </div>
        ) : null}

      {editable ? (
        <div style={{ marginTop: '10px' }}>
          <label
  htmlFor="banner-upload"
  className="button bg-blue-500 text-white py-2 px-4 rounded mx-auto dark:bg-blue-700 cursor-pointer"
>
  {banner ? 'Change Banner' : 'Add Banner'}
</label>
          <input type="file" id="banner-upload" accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
          {banner ? (
            <button className="button bg-red-500 text-white py-2 px-4 rounded" onClick={handleBannerRemove} disabled={uploading}>
            {uploading ? 'Processing...' : 'Remove Banner'}
          </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default UserBanner;
