import User from '../models/User.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; 
import nodemailer from "nodemailer";

// Register

 export const handleRegister = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !password || !email)
    return res.status(400).send("Username and password are required.");

  // check for duplicate usernames in the db
  const duplEmail = await User.findOne({email}).exec();
  const duplUser = await User.findOne({username}).exec();
  if (duplEmail) return res.send("Email already exist"); 
  if (duplUser)  return res.send("Username already exist");

  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10);

    //create and store the new user
    const user = await User.create({
      username: username,
      email: email,
      password: hashedPwd,
    });

    res.status(201).send("User created sucessfully");
  } catch (err) {
    res.send(err.message);
  }
};

// Login

 export const handleLogin = async (req, res) => {

  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).send("Username and password are required.");

  const foundUser = await User.findOne({ username }).exec();
  if (!foundUser) return res.status(401).send("Invalid Username"); //Unauthorized
  // evaluate password
  const match = await bcrypt.compare(password, foundUser.password);

  if (match) {
    const token = jwt.sign(
      { 
        id: foundUser._id,
        name: foundUser.username,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d",}
    );
    // const { password, ...others } = foundUser._doc;

    res.status(200).send({message: "User logged in successfully",token});

  } else {
    res.send("Incorrect Password");
  }
};

// Forget Password

 export const handleForget = async (req, res) => {

  const { email } = req.body;
  if (!email) return res.status(400).send("Email required.");

  try {
    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) return res.send("Email not exist");

    const otp = Math.floor(100000 + Math.random() * 900000);
    foundUser.token = otp;
    const saveUser = await foundUser.save();
    console.log(saveUser);
    // create transport
    let transporter = nodemailer.createTransport({
      host: process.env.USER_HOST,
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.USER_ID, // generated ethereal user
        pass: process.env.USER_PASS, // generated ethereal password
      },
    });
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: `"test" <${process.env.USER_ID}>`, // sender address
      to: `${email}`, // list of receivers
      subject: "Regarding password reset", // Subject line
      text: "follow the given link to reset your account password", // plain text body
      html: `<b>Copy Otp to reset your password</b>
    <p>${otp}</p>`, // html body
    });
    res.send("Mail sent successfully");
  } catch (err) {
    console.log(err);
  }
};

// Reset Password

 export const handleReset = async (req, res) => {
  
  const { otp, newPassword } = req.body;

  if (!otp || !newPassword) return res.send("Otp and Password are required");
  console.log(otp, newPassword);
  try {
    const foundUser = await User.findOne({ token: otp }).exec();
    if (!foundUser) return res.send("Invalid otp");

    const hashedPwd = await bcrypt.hash(newPassword, 10);

    const saveUser = await User.findOneAndUpdate(
      { token: otp },
      { password: hashedPwd }
    );
    res.send("Password Reset successfully");
  } catch (error) {
    res.send(error.message);
  }
};