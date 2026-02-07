const express = require("express")
const router = express.Router()
const labController = require("../controllers/labController")

router.get("/", labController.getHomepage)
router.get("/departments/:id", labController.getDepartment)
router.get("/stock", labController.getStock);
router.get("/transactions", labController.getTransaction)
router.get("/stock/:id", labController.getBatchDetails)
router.post('/transactions', labController.postTransaction)

router.get("/test", (req, res) => {
    res.send("test route")
})

module.exports = router;