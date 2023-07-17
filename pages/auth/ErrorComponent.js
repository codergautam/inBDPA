import { useState, useEffect } from 'react';

const ErrorComponent = ({ error, side }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
      if (error) {
        setVisible(true);
        const timer = setTimeout(() => {
          setVisible(false);
        }, 8000); // Change the duration as needed (in milliseconds)
    
        return () => clearTimeout(timer);
      }
    }, [error]);
  
    if (!visible) {
      return null;
    }
  return (
    <>
      {visible && (
        <div className={side === 'top' ? `bg-red-100 border-t-4 border-red-500 rounded-b text-red-900 px-4 py-2 shadow-md absolute inset-x-0 mx-auto sm:w-fit top-0` : `bg-red-100 border-t-4 border-red-500 rounded-b text-red-900 px-4 py-2 shadow-md absolute inset-x-0 mx-auto sm:w-fit bottom-0`}>
          <div className="flex w-fit items-center justify-center mx-auto">
            <div className="py-1">
              <svg
                className="fill-current h-6 w-6 text-red-500 mr-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-bold">Error:</p>
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ErrorComponent;