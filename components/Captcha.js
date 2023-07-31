// components/Captcha.js
// This component is responsible for rendering and validating a captcha code. It includes a canvas element to display the generated captcha code and an input field for the user to enter the code. 
// 
// The component receives the following props: 
// - setSolved: a function to set the solved state of the captcha
// - solvedyesno: the initial solved state of the captcha
// - setShowModal: a function to control the visibility of the modal dialog
// - submitForm: a function to submit the form
// 
// The component initializes the following state variables:
// - captchaCode: the generated captcha code
// - solved: the solved state of the captcha
// - userInput: the user's input for the captcha code
// - validationStatus: the status of the captcha validation (valid or invalid)
// - error: an error message
// 
// The component uses the useEffect hook to generate a captcha code when the component mounts. It calls the createCaptcha function, which generates a random captcha code and updates the canvas element to display the code. 
// 
// The component also provides a validateCaptcha function, which checks if the user's input matches the generated captcha code. If the input is correct, it sets the solved state to true and calls the submitForm function. If the input is incorrect, it calls the createCaptcha function again and sets the validationStatus to "invalid". 
// 
// The component renders different elements based on the solved state. If the captcha is not solved, it displays the canvas, input field, and buttons for submitting or going back. If the captcha is solved, it displays a success message and a check mark icon.
// 
// Finally, the component conditionally renders an ErrorComponent when the validationStatus is "invalid", displaying an error message.
import { useEffect, useRef, useState } from "react";
import ErrorComponent from "pages/auth/ErrorComponent.js";

export default function Captcha({
  setSolved,
  solvedyesno,
  setShowModal,
  submitForm,
}) {
  const [captchaCode, setCaptchaCode] = useState("");
  const [solved, setSolvedState] = useState(solvedyesno);
  const [userInput, setUserInput] = useState("");
  const [validationStatus, setValidationStatus] = useState("");
  const [error, setError] = useState("");
  const timeoutRef = useRef()

  useEffect(() => {
    // if (solved === false) {
    createCaptcha();
    // } else {
    // var canvas = document.getElementById("captchaCanvas");
    // var context = canvas.getContext("2d");
    // // context.clearRect(0, 0, canvas.width, canvas.height);
    // // context.fillStyle = "#FFFFFF"; // Set white background
    // // context.fillRect(0, 0, canvas.width, canvas.height);
    // // context.font = "25px Georgia";
    // // context.fillStyle = "#000000"; // Set black text color
    // context.fillText(userInput, 0, 30);
    // setSolvedState(true);
    // }
  }, []);

  function createCaptcha() {
    if (solved === false) {
      var charsArray = "abcdeghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      var lengthOtp = 6;
      var captcha = [];
      for (var i = 0; i < lengthOtp; i++) {
        var index = Math.floor(Math.random() * charsArray.length);
        if (captcha.indexOf(charsArray[index]) === -1) {
          captcha.push(charsArray[index]);
        } else {
          i--;
        }
      }
      setCaptchaCode(captcha.join(""));

      var canvas = document.getElementById("captchaCanvas");
      var context = canvas.getContext("2d");
      // context.clearRect(0, 0, canvas.width, canvas.height);
      // context.fillStyle = "#FFFFFF"; // Set white background
      // context.fillRect(0, 0, canvas.width, canvas.height);
      // context.font = "25px Georgia";
      // context.fillStyle = "#000000"; // Set black text color
      // context.fillText(captcha.join(""), 0, 30);

      canvas.width = 150;
      canvas.height = 40;

      context.textBaseline = "alphabetic";

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#FFFFFF"; // Set white background
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.font = "25px Calibri";
      context.fillStyle = "#000000"; // Set black text color
      const textWidth = context.measureText(captcha.join("")).width;
      const metrics = context.measureText(captcha.join(""));
      const actualHeight =
        metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
      context.fillText(
        captcha.join(""),
        canvas.width / 2 - textWidth / 2,
        canvas.height / 2 + Math.round(Math.round(actualHeight) / 2)
      );
      // -----------
      setSolved(false);
      setSolvedState(false);
      // setValidationStatus("invalid");
    } else {
      return;
    }
  }

  function validateCaptcha() {
    if (userInput === captchaCode) {
      setSolved(true);
      setSolvedState(true);
      setValidationStatus("valid");
      submitForm(null, true);
    } else {
      createCaptcha()
      setValidationStatus("invalid");
      timeoutRef.current = setTimeout(()=>{
        setValidationStatus("")
      }, 2500)
    }
  }

  return (
    <>
      {!solved && (
        <>
          <canvas className="rounded mx-auto mb-4" id="captchaCanvas"></canvas>
          <input
            type="text"
            placeholder="Enter Captcha"
            id="captchaTextBox"
            name="captchaTextBox"
            htmlFor="captchaButton"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="mb-4 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowModal(false)}
              className="w-1/2 text-red-600 bg-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
            >
              ← Back
            </button>
            <button
              type="button"
              htmlFor="captchaTextBox"
              id="captchaButton"
              name="captchaButton"
              onClick={validateCaptcha}
              className="w-1/2 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Submit →
            </button>
          </div>
          {validationStatus === "invalid" ? 
            <ErrorComponent
              error={"Invalid Captcha, try again"}
              side="bottom"
              color="red"
              blocked={false}
              setError={setError}
              attempterror={false}
            /> : <></>
          }
        </>
      )}
      {solved && (
        <>
          <p className="text-emerald-400 font-bold">solved</p>
          <svg
            width="50px"
            height="50px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="Interface / Check">
              <path
                id="Vector"
                d="M6 12L10.2426 16.2426L18.727 7.75732"
                stroke="rgb(52 211 153)"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
          </svg>
        </>
      )}
    </>
  );
}
