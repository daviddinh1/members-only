const { Router } = require("express");

const appRouter = Router();
appRouter.get("/", (req, res) => {
  res.send("Hello world this is testing the route");
});

module.exports = appRouter;
