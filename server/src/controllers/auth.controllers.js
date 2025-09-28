import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const authController = {
  register: asyncHandler(async (req, res) => {
    const { name, email, username, password, phonenumber,role } = req.body;
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
      role : role || "user"
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
    const { username, email, phonenumber, password } = req.body;
    if ((!username && !email && !phonenumber) || !password) {
      throw new ApiError(
        400,
        "Please provide identifier (username/email/phone) and password"
      );
    }
    let user;
    if (username) {
      user = await User.findOne({ username });
    } else if (email) {
      user = await User.findOne({ email });
    } else if (phonenumber) {
      user = await User.findOne({ phonenumber });
    }
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      throw new ApiError(400, "Worng password ");
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
  // resetPassword: 
};

export { authController };
