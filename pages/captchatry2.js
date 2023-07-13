import { useEffect, useState } from 'react';

export default function Captcha({ setSolved }) {
  const [captchaCode, setCaptchaCode] = useState('');
  const [solved, setSolvedState] = useState(false);

  useEffect(() => {
    createCaptcha();
  }, []);

  function createCaptcha() {
    var charsArray =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@!#$%^&*';
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
    setCaptchaCode(captcha.join(''));

    var canvas = document.getElementById('captchaCanvas');
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = '25px Georgia';
    context.strokeText(captcha.join(''), 0, 30);

    setSolvedState(false);
  }

  function validateCaptcha(event) {
    event.preventDefault();
    const userInput = event.target.captchaTextBox.value;
    if (userInput === captchaCode) {
      alert('Valid Captcha');
      setSolved(true);
      setSolvedState(true);
    } else {
      alert('Invalid Captcha. Try again.');
      createCaptcha();
    }
  }

  return (
    <div>
      <canvas id="captchaCanvas" width="100" height="50"></canvas>
      <form onSubmit={validateCaptcha}>
        <input type="text" placeholder="Captcha" id="captchaTextBox" name="captchaTextBox" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
