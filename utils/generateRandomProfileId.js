export default function generateRandomId() {
  var min = 1000000; // Minimum 7-digit number
  var max = 9999999; // Maximum 7-digit number
  var randomId = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomId.toString();
}
