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
    maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 12, // Remember for 30 days if rememberMe is true, otherwise remember for 12 hours
  },
});