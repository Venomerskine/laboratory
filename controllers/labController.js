const db = require("../db/queries")

async function getHomepage(req, res) {
    const [departments, itemCategories] = await Promise.all([
        db.getAllDepartments(),
        db.getAllItemCategories(),
    ]);
    res.render("./layouts/homePage", { departments, itemCategories });
}

module.exports = {
    getHomepage
};