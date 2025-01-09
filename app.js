const express = require("express");
const appRouter = require("./routes/appRouter");
// add all the extra stuff later
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use("/", appRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));
