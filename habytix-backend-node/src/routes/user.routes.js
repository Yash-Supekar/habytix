const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/role/staff", userController.getStaff);
router.get("/role/tenant", userController.getTenants);
router.get("/:id", userController.getUserById);

module.exports = router;

