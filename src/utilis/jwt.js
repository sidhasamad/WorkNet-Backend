import jwt from "jsonwebtoken";

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};
export default generateTokens;
