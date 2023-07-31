// utils/ordinalSuffix.js
// This code is a utility function to add the proper ordinal suffix to a number. It takes an input number `i` and returns a string with the number followed by the appropriate suffix (e.g. 1st, 2nd, 3rd, etc.). 
// The code uses the modulus operator to determine the last digit of the input number `i`. It then checks for special cases where the suffix is different (e.g. for numbers ending in 1, the suffix is "st", for numbers ending in 2, the suffix is "nd", etc.). If no special case is found, it adds the default "th" suffix.
export default function addSuffix(i) {
  var j = i % 10,
      k = i % 100;
  if (j == 1 && k != 11) {
      return i + "st";
  }
  if (j == 2 && k != 12) {
      return i + "nd";
  }
  if (j == 3 && k != 13) {
      return i + "rd";
  }
  return i + "th";
}