
export default function captcha() { 
  
  var code;
  function createCaptcha() {
    var charsArray =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@!#$%^&*";
    var lengthOtp = 6;
    var captcha = [];
    for (var i = 0; i < lengthOtp; i++) {
     
      var index = Math.floor(Math.random() * charsArray.length + 1); 
      if (captcha.indexOf(charsArray[index]) == -1)
        captcha.push(charsArray[index]);
      else i--;
    }
    var canv = document.createElement("canvas");
    canv.id = "captcha";
    canv.width = 100;
    canv.height = 50;
    var ctx = canv.getContext("2d");
    ctx.font = "25px Georgia";
    ctx.strokeText(captcha.join(""), 0, 30);
    
    code = captcha.join("");
    document.getElementById("captcha").appendChild(canv);
  }
  function validateCaptcha() {
    event.preventDefault();
    debugger
    if (document.getElementById("cpatchaTextBox").value == code) {
      alert("Valid Captcha")
    }else{
      alert("Invalid Captcha. try Again");
      createCaptcha();
    }
  }
  
  return ( 

<>

<body onload="createCaptcha()">
  <form onsubmit="validateCaptcha()">
    <div id="captcha">
    </div>
    <input type="text" placeholder="Captcha" id="cpatchaTextBox"/>
    <button type="submit">Submit</button>
  </form>
</body>

</>

    
    )};