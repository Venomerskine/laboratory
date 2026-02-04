const db = require("../db/queries")

async function getHomepage(req, res) {
    const [departments, itemCategories] = await Promise.all([
        db.getAllDepartments(),
        db.getAllItemCategories(),
    ]);
    console.log(departments);
}

module.exports = {
    getHomepage,
    itemCategories
};