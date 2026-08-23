const { User, GoogleOAuth } = require("../models/User");
const verifyGoogleToken = require("../OAuth/googleAuth");
const jwt = require("jsonwebtoken");

exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Google token is required",
      });
    }

    // Verify Google ID Token
    const payload = await verifyGoogleToken(token);

    const {
      sub,
      email,
      name,
      picture,
      email_verified,
    } = payload;

    if (!email_verified) {
      return res.status(400).json({
        message: "Google email is not verified",
      });
    }

    // CHECK EMAIL IN BOTH COLLECTIONS

    const normalUser = await User.findOne({ email });
    const googleUser = await GoogleOAuth.findOne({ email });

    // CASE 1:
    // Email already exists in GoogleOAuth

    if (googleUser) {
      // Make sure Google ID is still associated
      if (googleUser.googleId !== sub) {
        return res.status(400).json({
          message: "This email is already linked to another Google account",
        });
      }
      
      const jwtToken = jwt.sign(
        {
          id: googleUser._id,
          provider: "google",
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      res.cookie("token", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: "Google Login Successful",
        token: jwtToken,
        user: {
          id: googleUser._id,
          username: googleUser.username,
          email: googleUser.email,
          avatar: googleUser.avatar,
          provider: "google",
        },
      });
    }

    // CASE 2:
    // Email exists in normal User collection

    if (normalUser) {
      return res.status(409).json({
        success: false,
        message:
          "This email is already registered with a normal account. Please login using your email and password.",
      });
    }

    // CASE 3:
    // Email doesn't exist anywhere
    // Create GoogleOAuth account

    const newGoogleUser = await GoogleOAuth.create({
      googleId: sub,
      email,
      username: name,
      avatar: picture,
    });

    // CREATE JWT

    const jwtToken = jwt.sign(
      {
        id: newGoogleUser._id,
        provider: "google",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // SET COOKIE

    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // RESPONSE

    return res.status(201).json({
      success: true,
      message: "Google account created successfully",
      token: jwtToken,
      user: {
        id: newGoogleUser._id,
        username: newGoogleUser.username,
        email: newGoogleUser.email,
        avatar: newGoogleUser.avatar,
        provider: "google",
      },
    });

  } catch (err) {
    console.log("Google Login Error:", err);

    return res.status(500).json({
      success: false,
      message: "Google authentication failed",
    });
  }
};