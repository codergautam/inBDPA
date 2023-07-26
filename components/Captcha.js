import { useEffect, useState } from "react";
import ErrorComponent from "pages/auth/ErrorComponent.js";


export default function Captcha({ setSolved, solvedyesno, setShowModal }) {
  const [captchaCode, setCaptchaCode] = useState("");
  const [solved, setSolvedState] = useState(solvedyesno);
  const [userInput, setUserInput] = useState("");
  const [validationStatus, setValidationStatus] = useState("");
  const [error, setError] = useState("");


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
      setValidationStatus("");
    } else {
      return;
    }
  }

  function validateCaptcha() {
    if (userInput === captchaCode) {
      setSolved(true);
      setSolvedState(true);
      setValidationStatus("valid");
    } else {
      createCaptcha();
      setValidationStatus("invalid");
    }
  }

  return (
    <>
      {!solved && (
        <>
          <canvas className="rounded mx-auto mb-4" id="captchaCanvas"></canvas>
          <div>
            <input
              type="text"
              placeholder="Enter Captcha"
              id="captchaTextBox"
              name="captchaTextBox"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="mb-4 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <a
              onClick={() => setShowModal(false)}
              class="w-1/2 text-red-600 bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
            >
              ← Back
            </a>
            <button
              type="submit"
              onClick={validateCaptcha}
              class="w-1/2 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Submit →
            </button>
          </div>
          {validationStatus === "invalid" && (
              <ErrorComponent
                errorInComponent={"Invalid Captcha, try again"}
                side="bottom"
                color="red"
                blocked={false}
                setError={setError}
                attempterror={false}
              />
          )}
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
