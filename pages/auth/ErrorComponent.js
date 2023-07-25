import React, { useState, useEffect, useRef } from "react";

const ErrorComponent = ({
  error,
  side,
  color,
  blocked,
  setErrornew,
  loginerror,
  setLoginError,
}) => {
  const [visible, setVisible] = useState(false);
  // const [timerId, setTimerId] = useState(null);
  const timerId = useRef(null);

  useEffect(() => {
    setVisible(false);

    // Clear the previous timer whenever the error prop changes
    if (timerId.current) {
      clearTimeout(timerId.current);
    }

    if (error !== null) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 2000); // Changed the duration to 2000 milliseconds (2 seconds)
      // setTimerId(timer);
      timerId.current = timer;
    }

    // Clear the timeout when the component unmounts
    return () => {
      if (timerId.current) {
        clearTimeout(timerId.current);
      }
    };
  }, [error]);

  const handleCancelButtonClick = () => {
    if (loginerror) {
      setLoginError("");
    }
    setVisible(false);
    setErrornew(null);
  };

  return (
    <>
      {visible && (
        <div
          className={
            side === "top" && color === "green"
              ? `bg-emerald-100 border-t-4 border-emerald-500 rounded-b text-emerald-900 px-4 pr-3 py-2 shadow-md fixed inset-x-0 mx-auto sm:w-fit top-1`
              : side === "bottom" && color === "green"
              ? `bg-emerald-100 border-t-4 border-emerald-500 rounded-b text-emerald-900 px-4 pr-3 py-2 shadow-md fixed inset-x-0 mx-auto sm:w-fit bottom-1`
              : side === "top" && color === "red"
              ? `bg-red-100 border-t-4 border-red-500 rounded-b text-red-900 px-4 pr-3 py-2 shadow-md fixed inset-x-0 mx-auto sm:w-fit top-1`
              : `bg-red-100 border-t-4 border-red-500 rounded-b text-red-900 px-4 pr-3 py-2 shadow-md fixed inset-x-0 mx-auto sm:w-fit bottom-1`
          }
        >
          <div className="flex w-fit justify-center mx-auto">
            <div className="py-1 flex items-center">
              <svg
                className={
                  color === "red"
                    ? `fill-current h-6 w-6 text-red-500 mr-4`
                    : `fill-current h-6 w-6 text-emerald-500 mr-4`
                }
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
              </svg>
            </div>
            <div className="text-left flex-col items-center">
              <p className="font-bold">
                {color === "red" ? "Error:" : "Success"}
              </p>
              <div
                className={
                  color === "red"
                    ? `text-red-500 text-sm`
                    : `text-emerald-500 text-sm`
                }
              >
                {error}
              </div>
            </div>
            <div className="h-full">
              {!blocked && (
                <svg
                  className={
                    color === "red"
                      ? `fill-current text-red-500 hover:text-red-400 ml-3 w-6 h-6`
                      : `fill-current text-emerald-500 hover:text-emerald-400 ml-3 w-6 h-6`
                  }
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={() => {
                    handleCancelButtonClick();
                  }}
                >
                  <path
                    d="M16.3394 9.32245C16.7434 8.94589 16.7657 8.31312 16.3891 7.90911C16.0126 7.50509 15.3798 7.48283 14.9758 7.85938L12.0497 10.5866L9.32245 7.66048C8.94589 7.25647 8.31312 7.23421 7.90911 7.61076C7.50509 7.98731 7.48283 8.62008 7.85938 9.0241L10.5866 11.9502L7.66048 14.6775C7.25647 15.054 7.23421 15.6868 7.61076 16.0908C7.98731 16.4948 8.62008 16.5171 9.0241 16.1405L11.9502 13.4133L14.6775 16.3394C15.054 16.7434 15.6868 16.7657 16.0908 16.3891C16.4948 16.0126 16.5171 15.3798 16.1405 14.9758L13.4133 12.0497L16.3394 9.32245Z"
                    fill="currentColor"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ErrorComponent;
