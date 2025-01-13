const { Router } = require("express");
const controller = require("../controllers/appController");

const appRouter = Router();
appRouter.get("/sign-up", controller.getForm);
appRouter.post("/sign-up", controller.validateSignup, controller.addUserData);

appRouter.get("/join-the-club", controller.renderSecret);
appRouter.post(
  "/join-the-club",
  controller.validateSecret,
  controller.changeMembershipStatus
);

appRouter.get("/message", controller.renderMessage);
appRouter.post("/message", controller.showMessages);

module.exports = appRouter;
