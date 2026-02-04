require("dotenv").config();
const pool = require("./pool");

async function getAllDepartments() {
    const result = await pool.query("select * from departments d where is_active = true");
    return result.rows;
}

async function getAllItemCategories() {
    const result = await pool.query("select * from item_category ic where is_active = true");
    return result.rows;
}


module.exports = {
    getAllDepartments,
    getAllItemCategories,
};