import IndividualTrainee from "../models/individualTrainee.js";
import Instructor from "../models/instructor.js";
import CorporateTrainee from "../models/corporateTrainee.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import Administrator from "../models/administrator.js";

//Make function to return if it is same password or not
async function checkPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

export const signin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log("BAckend is working", email, password);
  const individualTrainee = await IndividualTrainee.findOne({ email });
  console.log("THIS IS THE INDIVIDUAL TRAINNEE", individualTrainee);
  if (!individualTrainee) {
    const instructor = await Instructor.findOne({ email });
    if (!instructor) {
      const corporateTrainee = await CorporateTrainee.findOne({ email });
      if (!corporateTrainee) {
        const admin = await Administrator.findOne({ email });
        if (!admin) {
          return res.status(404).json({ message: "User doesn't exist" });
        }
        const isValidPassword = await checkPassword(password, admin.password);
        if (!isValidPassword) {
          return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = await admin.generateAuthToken();
        res.status(200).json({
          result: admin,
          type: "admin",
          token: token,
        });
      }
      const isValidPassword = checkPassword(
        password,
        corporateTrainee.password
      );
      if (!isValidPassword) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      const token = await corporateTrainee.generateAuthToken();
      res.status(200).json({
        result: corporateTrainee,
        type: "corporateTrainee",
        token: token,
      });
    }
    const isValidPassword = checkPassword(password, instructor.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = await instructor.generateAuthToken();
    res
      .status(200)
      .json({ result: instructor, type: "instructor", token: token });
  }
  const isValidPassword = await checkPassword(
    password,
    individualTrainee.password
  );
  console.log("isValidPassword", isValidPassword);
  if (!isValidPassword) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const token = await individualTrainee.generateAuthToken();
  res.status(200).json({
    result: individualTrainee,
    type: "individualTrainee",
    token: token,
  });
};

export const signup = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  const individualTrainee = await IndividualTrainee.findOne({ email });
  if (individualTrainee) {
    return res
      .status(400)
      .json({ message: "User with this email already exists" });
  }
  const hashPassword = await bcrypt.hash(password, 12);
  const newIndividualTrainee = await IndividualTrainee.create({
    email,
    password: hashPassword,
    firstName,
    lastName,
  });
  const token = await newIndividualTrainee.generateAuthToken();
  res.status(200).json({
    result: newIndividualTrainee,
    type: "individualTrainee",
    token: token,
  });
};

export const sendEmail = async (req, res) => {
  try {
    console.log("iam i nthe password Reset");
    const { email } = req.body;
    const individualTrainee = await IndividualTrainee.findOne({ email });
    if (!individualTrainee) {
      return res.status(404).json({ message: "User doesn't exist" });
    }
    let transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: 587,
      secure: false,
      service: "gmail", // true for 465, false for other ports
      auth: {
        user: "robyamama55@gmail.com", // generated ethereal user
        pass: "mjuzqpeqivvllzoz", // generated ethereal password
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    //create html for password reset
    let html = `<div>
    <h1>Reset Password</h1>
    <p>Click on the link below to reset your password</p>
    <a href="http://localhost:3000/users/confirmPassword/${individualTrainee._id}">Reset Password</a>
    </div>`;

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: "robyamama55@gmail.com", // sender address
      to: email, // list of receivers
      subject: "Reset Password", // Subject line
      text: "Hello world?", // plain text body
      html: html, // html body
    });
    console.log("INFO ", info);
    res
      .status(200)
      .send(`Click on the link sent to ${email} to reset password`);
  } catch (error) {
    console.log("the error part");
    res.status(400).json({ message: error.message });
  }
};
export const confirmPasswordReset = async (req, res) => {
  try {
    console.log("REQUEST BODY", req.body);
    const { password } = req.body;
    console.log("The new password ", password);
    const individualTrainee = await IndividualTrainee.findById(req.params.id);
    if (!individualTrainee) {
      return res.status(404).json({ message: "User doesn't exist" });
    }
    const hashPassword = await bcrypt.hash(password, 12);
    individualTrainee.password = hashPassword;
    await individualTrainee.save();
    //Return the user and a message to indictate
    res.status(200).json({ user: individualTrainee, message: null });
  } catch (error) {
    res.status(400).json({ user: null, message: error.message });
  }
};