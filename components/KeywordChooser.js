import React, { useState } from 'react';

const KeywordAdder = ({ keywords, setKeywords }) => {
  const [input, setInput] = useState('');

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const addKeyword = () => {
    if (input.trim() !== '') {
      setKeywords([...keywords, input.trim()]);
      setInput('');
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

  const handleKeywordRemove = (index) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col">
      <div className='flex flex-wrap justify-start items-center'>
              {keywords.map((keyword, index) => (
          <div key={index} className="bg-blue-200 text-blue-700 rounded p-2 m-1 items-center">
            <span>{keyword}</span>
            <button onClick={() => handleKeywordRemove(index)} className="text-red-500 hover:text-red-700 cursor-pointer pl-1">
              x
            </button>
          </div>
        ))}
      </div>
      {keywords.length < 10 ? (
        <div className="flex space-x-2 mx-auto pt-1">
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Add a keyword and press Enter"
        className="border rounded p-2 w-96 focus:border-blue-500"
        maxLength={20}
      />
      <button onClick={addKeyword} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Add
      </button>
      </div>
      ) : (
        <p className="text-red-500 text-center">You can only have up to 10 keywords</p>
      )}
    </div>
  );
};

export default KeywordAdder;
