const express = require("express")
const router = express.Router()
const labController = require("../controllers/labController")

router.get("/", labController.getHomepage)

module.exports = router;