const axios = require("axios");
const express = require("express");
const router = express.Router();
const mediaController = require("../controllers/mediaController");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

router.post("/media", upload.single("file"), mediaController.uploadMedia);  