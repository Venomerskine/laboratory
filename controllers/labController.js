const db = require("../db/queries")

async function getHomepage(req, res) {
    const [departments, itemCategories, items] = await Promise.all([
        db.getAllDepartments(),
        db.getAllItemCategories(),
        db.getAllItems()
    ]);
    res.render("./layouts/homePage", { departments, itemCategories, items });
}

async function getDepartment(req, res) {

    const id = req.params.id;
    console.log(req.params)
    console.log("Department id is: ", id)

    const department = await db.getDepartmentById(id);
    if(!department) {
        return res.status(404).send("Department not found")
    }
    res.render("layouts/departments/department", {department})
    
    
    // res.send("Department reached")
    
    // const id = req.params.id;
    // const department = await db.getDepartmentById(id);
    // return res.json(department);
}

module.exports = {
    getHomepage,
    getDepartment
};