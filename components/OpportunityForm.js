import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false, loading: () => <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div></div>  }
);

function OpportunityForm({ editingOpportunity, handleFormSubmit, title, setTitle, value, setValue, handleClose }) {
  const formTitle = editingOpportunity ? "Edit Opportunity" : "Create Opportunity";
  const buttonText = editingOpportunity ? "Complete Edits" : "Create Opportunity";
  const [mdEditorMode, setMdEditorMode] = useState('live');
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiError, setAiError] = useState(null);
  const [aiSubmitting,  setAiSubmitting] = useState(false);

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

  const handleAiSubmit = async () => {
    if(aiSubmitting) return;
    if(value && value.length > 4000) {
      setAiError("Your opportunity content is too long for the AI. Please shorten it.");
      return;
    }
    setAiSubmitting(true);
    try {
      const res = await axios.post('/api/askAi', { title, contents: value, prompt: aiPrompt });
      setAiSubmitting(false);
      if(res.data.error) {
        console.error(res.data.error);
        setAiError(res.data.error);
        return;
      }
      setValue(res.data.gptResponse.content);
      setTitle(res.data.gptResponse2.content);
      setAiPrompt('');

      setAiModalOpen(false);
    } catch (error) {
      console.error(error);
      setAiSubmitting(false);
      setAiError(error.message);
    }
  };

  useEffect(() => {
    if(value && value.length > 3000) {
      setValue(value.substring(0,3000))
    }
    if(title && title.length > 100) {
      setTitle(title.substring(0,100))
    }
  }, [value, title])

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
      { value && value.length > 0 && title && title.length > 0 && (
      <button
      onClick={() => setAiModalOpen(true)}
      className="
        bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2  absolute top-2 left-2

      "
    >
      Improve with AI
    </button>
      )}
    {aiModalOpen && (
  <div className="fixed z-10 inset-0 overflow-y-auto">
    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div className="fixed inset-0 transition-opacity" aria-hidden="true">
        <div className="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-900 dark:opacity-75"></div>
      </div>

      <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100" id="modal-title">
                How do you want to improve your opportunity?
              </h3>
          <div className="sm:flex sm:items-start">

              {aiError ? <p className="text-red-500">{aiError}</p> : null}

                <input
                  type="text"
                  maxLength={100}
                  className="shadow appearance-none mt-2 border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                />
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={handleAiSubmit}
          >
             {aiSubmitting ? (
              "Improving... ✨"
            ) : (
              "Improve with AI 🌟"
            )}
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={() => setAiModalOpen(false)}
          >
           Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}





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
          maxLength={100}
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
        textareaProps={{
          maxLength: 3000,
        }}
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
