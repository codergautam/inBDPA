import { useEffect, useState } from "react";

export default function Captcha({ setSolved, solvedyesno }) {
  const [captchaCode, setCaptchaCode] = useState("");
  const [solved, setSolvedState] = useState(solvedyesno);
  const [userInput, setUserInput] = useState("");
  const [validationStatus, setValidationStatus] = useState("");

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

      canvas.width = 130;
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
      setValidationStatus("invalid");
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
    <div className="captcha flex justify-center items-center flex-col space-y-4">
      {!solved && (
        <>
          <canvas className="rounded" id="captchaCanvas"></canvas>
          <div className="justify-center items-center space-x-2">
            <input
              type="text"
              placeholder="Enter Captcha"
              id="captchaTextBox"
              name="captchaTextBox"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className={`border rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-black ${
                validationStatus === "invalid" && "border-red-500"
              }`}
            />
            <button
              type="submit"
              onClick={validateCaptcha}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 my-2 focus:ring-blue-500"
            >
              Submit
            </button>
          </div>
        </>
      )}
      {validationStatus === "invalid" ? (
        <p className="text-red-500">Invalid Captcha. Please try again.</p>
      ) : (
        <p className="text-red-500 hidden">
          Invalid Captcha. Please try again.
        </p>
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
    </div>
  );
}
