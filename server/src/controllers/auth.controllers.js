import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendMail } from "../utils/sendMail.js";

const authController = {
  register: asyncHandler(async (req, res) => {
    const { name, email, username, password, phonenumber, role } = req.body;
    if (!name || !email || !username || !password || !phonenumber) {
      throw new ApiError(400, "Al fields are required");
    }
    const existUser = await User.findOne({
      $or: [{ username }, { email }, { phonenumber }],
    });
    if (existUser) {
      throw new ApiError(
        409,
        "User already exists with given email/username/phone"
      );
    }
    const user = await new User({
      name,
      email,
      username,
      password,
      phonenumber,
      role: role || "user",
    });
    await user.save();

    if (!user) {
      throw new ApiError(500, "Failed to register user");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, user, "User register succesfully"));
  }),
  login: asyncHandler(async (req, res) => {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      throw new ApiError(
        400,
        "Please provide identifier (username/email/phone) and password"
      );
    }

    const user = await User.findOne({
      $or: [
        { email: identifier },
        { username: identifier },
        { phone: identifier },
      ],
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      throw new ApiError(400, "Worng password ");
    }

    if (user.isBlocked) {
      throw new ApiError(
        403,
        "Your account has been blocked please contact admin"
      );
    }
    const accessToken = await user.genarateAccessToken();

    const option = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, option)
      .json(
        new ApiResponse(200, { user, accessToken }, "User loging succesfully")
      );
  }),
  logout: asyncHandler(async (req, res) => {
    const option = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .clearCookie("accessToken", option)
      .json(new ApiResponse(200, "User Logged Out SuccesFully"));
  }),
  sendResetPassOTP: asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
      throw new ApiError(400, "Email is required");
    }
    const isUserExist = await User.findOne({ email });
    if (!isUserExist) {
      throw new ApiError(404, "User not found with this email");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    isUserExist.reSetPassOtp = otp;
    await isUserExist.save();

    await sendMail({
      name: isUserExist.name,
      email: isUserExist.email,
      message: `Your password reset OTP is ${otp}`,
    });

    setTimeout(async () => {
      isUserExist.reSetPassOtp = null;
      await isUserExist.save();
    }, 15 * 60 * 1000);

    return res
      .status(200)
      .json(new ApiResponse(200, "OTP sent to your email address"));
  }),
  resetPassword: asyncHandler(async (req, res) => {
    const { otp, newPassword } = req.body;

    if (!otp || !newPassword) {
      throw new ApiError(400, "OTP and new password are required");
    }
    const user = await User.findOne({ reSetPassOtp: otp });
    if (!user) {
      throw new ApiError(400, "Invalid OTP");
    }
    user.password = newPassword;
    user.reSetPassOtp = null;
    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, "Password reset successfully"));
  }),
};

export { authController };
