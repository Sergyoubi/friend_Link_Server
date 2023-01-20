import jwt from "jsonwebtoken";
// to protect routes from unverified users requests
export const verifyToken = async (req, res, next) => {
  try {
    // "Authorization" is set from the frontend's req.header
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).send("Access Denied");
    }
    // Bearer is set after each frontend's requests
    //token is placed after "Bearer" (Bearer aADQ$fxu4787d4b...) and we want to get everithing after Bearer
    if (token.startsWith("Bearer ")) {
      // trim() method removes whitespace from both sides of a string
      token = token.slice(7, token.length).trimLeft();
    }
    const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verifiedUser;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
