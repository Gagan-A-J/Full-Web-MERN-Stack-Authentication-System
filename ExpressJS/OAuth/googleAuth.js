const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GoogleOAuthClientID);

const verifyGoogleToken = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GoogleOAuthClientID,
  });

  return ticket.getPayload();
};

module.exports = verifyGoogleToken;
