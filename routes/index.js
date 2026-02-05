const express = require("express")
const router = express.Router()
const labController = require("../controllers/labController")

router.get("/", labController.getHomepage)
router.get("/departments/:id", labController.getDepartment)

router.get("/test", (req, res) => {
    res.send("test route")
})

module.exports = router;