import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuthMiddleware = async (req, res, next) => {
  const { accessToken } = req.body;
  console.log("access",accessToken );
  

  if (!accessToken) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: accessToken,
      audience: process.env.GOOGLE_CLIENT_ID, // Ensure that it matches the client ID
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(401).json({ error: "Invalid Google Token" });
    }

    req.googleUser = payload;  

    next();
  } catch (error) {
    console.error("Error in Google token verification", error.message);
    return res.status(401).json({ error: "Invalid Google Token" });
  }
};
