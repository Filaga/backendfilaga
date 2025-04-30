const express = require("express");
const uploadController = require("../controllers/upload.controller");
const upload = require("../utils/upload.util");

const router = express.Router();

router.post("/upload", upload.single("image"), uploadController.uploadImage);

module.exports = router;