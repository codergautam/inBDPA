// utils/validation.js
// This file contains a function that validates an email address using a regular expression. The function takes an email as a parameter and uses the emailRegex variable, which is a regular expression pattern, to test if the email format is valid. The function returns true if the email is valid, false otherwise.
export const isEmailValid = (email) => {
    // Regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };