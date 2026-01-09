import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { errorHandler } from "../utils/error.js";
import bcrypt from "bcryptjs";

// Create User
const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return next(errorHandler(401, "All fields required."));
    }

    // Check existing user
    const userExits = await User.findOne({ email });
    if (userExits) {
      return next(errorHandler(409, "Email already exists."));
    }

    const photoLocalPath = req.file.path;

    const photo = await uploadOnCloudinary(photoLocalPath);

    const newUser = new User({
      username,
      email,
      password,
      photo: photo?.url || "",
    });
    await newUser.save();
    const token = newUser.generateToken();
    res
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
      })
      .status(201)
      .json({
        success: true,
        message: "User created successfully.",
        user: newUser,
      });
  } catch (error) {
    console.log("Signup Error:", error);
    next(error);
  }
};

// login User
const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({ message: "All fields required." });
    }

    const userExits = await User.findOne({ email });
    if (!userExits) {
      return res.status(401).json({ message: "User not found." });
    }

    const matchPassword = await userExits.isPasswordCorrect(password);
    if (!matchPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = userExits.generateToken();

    res
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
      })
      .status(200)
      .json(userExits);
  } catch (error) {
    console.log("Signin Error::", error);
    next(error);
  }
};

// login With Google
const google = async (req, res, next) => {
  try {
    if (!req.body.email || !req.body.name) {
      return res.status(400).json({ message: "Invalid Google data" });
    }

    let user = await User.findOne({ email: req.body.email });

    if (!user) {
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = bcrypt.hashSync(generatePassword, 10);

      user = await User.create({
        username:
          req.body.name.replace(/\s/g, "").toLowerCase() +
          Math.random().toString(36).slice(-6),
        email: req.body.email,
        password: hashedPassword,
        photo: req.body.photo,
      });
    }

    const token = await user.generateToken();

    const { password, ...rest } = user.toObject();

    res.cookie("accessToken", token, { httpOnly: true }).status(200).json(rest);
  } catch (error) {
    next(error);
    console.log(error);
  }
};

// logout User
const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out!");
  } catch (error) {
    next(error);
  }
};

// update User
const updatedUser = async (req, res, next) => {
  console.log(req.user._id, "red");
  console.log(req.params.id, "params");

  if (req.user._id !== req.params.id) {
    return next(errorHandler(403, "You can only update your own account!"));
  }

  try {
    if (!req.body) {
      return next(errorHandler(400, "Request body is missing!"));
    }
    // Hash password if provided
    let hashedPassword;
    if (req.body.password) {
      hashedPassword = bcrypt.hashSync(req.body.password, 10);
    }

    const photoLocalPath = req.file.path;

    const photo = await uploadOnCloudinary(photoLocalPath);

    const updateData = {
      username: req.body.username,
      email: req.body.email,
      photo: photo?.url,
    };

    if (hashedPassword) {
      updateData.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return next(errorHandler(404, "User not found!"));
    }

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// get User
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return next(errorHandler(404, "User not found!"));

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
// delete User
const deleteUser = async (req, res, next) => {
  if (req.user._id !== req.params.id)
    return next(errorHandler(401, "You can only delete your own account!"));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("accessToken");
    res.status(200).json("User has been deleted!");
  } catch (error) {
    next(error);
  }
};

export { signup, signin, google, signout, deleteUser, updatedUser, getUser };
