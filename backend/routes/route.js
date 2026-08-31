const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller");
const authmiddleware = require("../middleware/authmiddleware");
router.post("/register",controller.register);
router.post("/login",controller.login);
router.get("/me",authmiddleware,controller.me);
router.get("/users",controller.getUsers);
module.exports = router;