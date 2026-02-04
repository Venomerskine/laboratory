const db = require("../db/queries")

async function getHomepage(req, res) {
    const departments = await db.getAllDepartments();
    res.render("./layouts/homePage", { departments });
    console.log(departments);
}

module.exports = {
    getHomepage,
};