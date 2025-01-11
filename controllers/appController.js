const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const { check, body, validationResult } = require("express-validator");

const validateSignup = [
  check("usernames")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 and 20 characters")
    .escape(),
  check("first_name")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isAlpha()
    .withMessage("First name must only contain letters")
    .escape(),
  check("last_name")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isAlpha()
    .withMessage("Last name must only contain letters")
    .escape(),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .escape(),
  check("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true; // Indicates the validation was successful
    }),
];

async function getForm(req, res) {
  res.render("signup");
}

async function addUserData(req, res, next) {
  const validationErr = validationResult(req);
  if (!validationErr.isEmpty()) {
    return res.status(400).json({ validationErr: validationErr.array() });
  }
  const { usernames, first_name, last_name, password } = req.body;

  try {
    // Use bcrypt.hash with async/await for better readability
    const hashPass = await bcrypt.hash(password, 10);

    // Insert user data into the database
    await db.addUserData(usernames, first_name, last_name, hashPass);

    res.send("Sign up went through check db");
  } catch (err) {
    // Handle any errors (e.g., hashing or database errors)
    next(err);
  }
}

module.exports = {
  getForm,
  addUserData,
  validateSignup,
};
