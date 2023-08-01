// utils/sanitizeRegex.js
// This code is written to create a utility function, sanitizeRegex, that sanitizes a regular expression by escaping all special characters. The function takes an input string and uses the replace() method along with a regular expression to find all special characters and escape them by adding a backslash before each one. The sanitized version of the regular expression is then returned as the output.
// 
export default function sanitizeRegex(input) {
  return input.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}