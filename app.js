const express = require("express");
const session = require("express-session");
const passport = require("passport");
const appRouter = require("./routes/appRouter");
const authRouter = require("./routes/authRouter");

// add all the extra stuff later
const app = express();

app.set("view engine", "ejs");
app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

app.use("/", appRouter);
app.use("/", authRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));
