const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const { check, body, validationResult } = require("express-validator");

const validateSignup = [
  check("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 50 })
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
  check("confirm_pass")
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
  const { username, first_name, last_name, password } = req.body;

  try {
    // Use bcrypt.hash with async/await for better readability
    const hashPass = await bcrypt.hash(password, 10);

    // Insert user data into the database
    await db.addUserData(username, first_name, last_name, hashPass);

    res.redirect("login");
  } catch (err) {
    // Handle any errors (e.g., hashing or database errors)
    next(err);
  }
}

async function renderSecret(req, res) {
  res.render("joinclub");
}

async function changeMembershipStatus(req, res, next) {
  try {
    // you need to add querie that updates the user if they enter the secret
    const password = req.body.club_pass;
    if (req.user) {
      await db.changeMembershipStatus(req.user.id, password);
      res.send("check membership status in db");
    } else {
      res.redirect("login");
    }
  } catch (err) {
    next(err);
  }
}

async function renderMessage(req, res) {
  // console.log("does it show the user object:", req.user);
  const test_data = await db.showMessages();
  console.log("this shows the messages", test_data);
  res.render("message", { user: req.user });
}

async function insertMessages(req, res, next) {
  const { title, message } = req.body;
  const userId = req.user.id;
  try {
    await db.addMessageData(userId, title, message);
    res.redirect("showMessage");
  } catch (err) {
    next(err);
  }
}

//first create a query that gets all of the messages data, then render it by sending in the object ; after this do membership status
async function showMessages(req, res, next) {
  try {
    if (req.user) {
      let membershipStatus = req.user.membership_status;
      let adminStatus = req.user.admin_status;
      console.log(membershipStatus);
      const messages = await db.showMessages(membershipStatus);
      if (adminStatus) {
        res.render("showMessage", {
          messages: messages,
          membershipStatus: membershipStatus,
          adminStatus: adminStatus,
        });
      } else {
        res.render("showMessage", {
          messages: messages,
          membershipStatus: membershipStatus,
          adminStatus: false,
        });
      }
    } else {
      let membershipStatus = false;
      const messages = await db.showMessages(membershipStatus);
      res.render("showMessage", {
        messages: messages,
        membershipStatus: membershipStatus,
      });
    }
  } catch (err) {
    next(err);
  }
}

async function deleteMessage(req, res, next) {
  try {
    if (req.user) {
      if (req.user.admin_status) {
        //write query msg
        const message_id = req.body.message_id;
        await db.deleteMessage(message_id);
        res.redirect("showMessage");
      }
    } else {
      res.redirect("login");
    }
  } catch (err) {
    next(err);
  }
}
module.exports = {
  getForm,
  addUserData,
  validateSignup,
  renderSecret,
  changeMembershipStatus,
  renderMessage,
  insertMessages,
  showMessages,
  deleteMessage,
};
