const { Router } = require("express");
const controller = require("../controllers/appController");

const appRouter = Router();
appRouter.get("/sign-up", controller.getForm);
appRouter.post("/sign-up", controller.validateSignup, controller.addUserData);

module.exports = appRouter;
