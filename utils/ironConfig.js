export const cookieName = "inbdpa";
export const cookiePassword = "MvNMDTwaVbRT5cbPQL6HgnxCCNRQXR5w";

export const ironOptions = {
  cookieName: cookieName,
  password: cookiePassword,
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: false,
  },
};
