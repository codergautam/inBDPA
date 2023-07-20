import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false, loading: () => <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div></div>  }
);

function OpportunityForm({ editingOpportunity, handleFormSubmit, title, setTitle, value, setValue, handleClose }) {
  const formTitle = editingOpportunity ? "Edit Opportunity" : "Create Opportunity";
  const buttonText = editingOpportunity ? "Complete Edits" : "Create Opportunity";
  const [mdEditorMode, setMdEditorMode] = useState('live');
  function handleResize() {
    if (window.innerWidth > 768) {
      setMdEditorMode('live');
    } else {
      setMdEditorMode('edit');
    }
  }
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (
    <div
      className="
        flex flex-col items-center justify-center
        bg-white dark:bg-gray-800 w-full h-full p-6 pt-10
        relative
      "
      style={{
        marginBottom: "-20px",
        marginTop:"-20px",
        marginLeft:"-24px",
        marginRight:"-24px",
        width:"calc(100% + 48px)",
        height:"calc(100% + 48px)"
      }}
    >
      <button
        onClick={handleClose}
        className="
          absolute top-2 right-2
          bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded
        "
      >
        Close
      </button>

      <div className='mt-8 w-full max-w-xl'>
        <label
          htmlFor=""
          className="block text-3xl font-bold text-black dark:text-white mb-2"
        >
          Title:
        </label>

        <input
          onChange={e => setTitle(e.target.value)}
          value={title}
          type="text"
          className='
            mb-4 outline-none text-black border-b-2 w-full
            px-3 py-2
            focus:border-blue-500
          '
        />
      </div>

      <div className="md:hidden flex items-center bg-white dark:bg-gray-800 py-2 px-4 rounded">
        <label className="flex items-center mr-4">
          <input
            type="radio"
            value="edit"
            checked={mdEditorMode === 'edit'}
            onChange={() => setMdEditorMode('edit')}
            className="form-radio text-blue-500 dark:text-blue-300 h-4 w-4 text-xs mr-2"
          />
          <span className="text-black dark:text-white">Edit</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            value="preview"
            checked={mdEditorMode === 'preview'}
            onChange={() => setMdEditorMode('preview')}
            className="form-radio text-blue-500 dark:text-blue-300 h-4 w-4 text-xs mr-2"
          />
          <span className="text-black dark:text-white">Preview</span>
        </label>
      </div>

      <MDEditor
        className='mt-4 w-full'
        value={value}
        onChange={setValue}
        height={"70%"}
        preview={mdEditorMode}
      />

      <button
        onClick={handleFormSubmit}
        className="
          bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2
          self-end
        "
      >
        {buttonText}
      </button>
    </div>
  );
}

export default OpportunityForm;
