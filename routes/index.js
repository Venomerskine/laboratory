const express = require("express")
const router = express.Router()
const labController = require("../controllers/labController")

router.get("/", labController.getHomepage)
router.get("/departments/:id", labController.getDepartment)
router.get("/stock", labController.getStock);
router.get("/transactions", labController.getTransaction)
router.get("/stock/:id", labController.getBatchDetails)
router.get("/category/:id", labController.getCategoryDetails)
router.get("/admin", labController.getAdminPage)
router.get("/departmentsEdit/:id", labController.editDepartment)
router.get("/categoryEdit/:id", labController.editCategory)

router.post('/transactions', labController.postTransaction)
router.post("/departments/:id/edit", labController.postDepartmentEdit)

router.get("/test", (req, res) => {
    res.send("test route")
})

module.exports = router;