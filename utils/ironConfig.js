// utils/ironConfig.js
// This file contains the configuration for Iron, a library used for encrypting and decrypting cookies. It exports the cookie name and password for the Iron configuration. 
// 
// The `ironOptions` object contains the cookie name, password, and cookie options. The `secure` option is set to `false` for development purposes. 
// 
// The `getIronOptions` function returns the Iron options based on the specified `rememberMe` parameter. If `rememberMe` is true, the cookie will be remembered for 30 days. Otherwise, it will be remembered for 3 hours. The `secure` option is also set to `false` for development purposes.
export const cookieName = "doulai";
export const cookiePassword = "MvNMDTwaVbRT5cbPQL6HgnxCCNRQXR5w";

export const ironOptions = {
  cookieName: cookieName,
  password: cookiePassword,
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: false,
  },
};


export const getIronOptions = (rememberMe) => ({
  cookieName: cookieName,
  password: cookiePassword,
  cookieOptions: {
    secure: false, // Use true in production for HTTPS
    maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 3, // Remember for 30 days if rememberMe is true, otherwise remember for 3 hours
  },
});