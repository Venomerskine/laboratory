require("dotenv").config();
const pool = require("./pool");

async function getAllDepartments() {
    const result = await pool.query("select * from departments d where is_active = true");
    return result.rows;
}

async function getDepartmentById(id) {
    const result = await pool.query("select * from departments where id = $1", [id]);
    return result.rows[0];
}

async function getAllItemCategories() {
    const result = await pool.query("select * from item_category ic where is_active = true");
    return result.rows;
}

async function getAllItems() {
    const result = await pool.query("select * from item_table where is_active =  true ");
    return result.rows;
}

module.exports = {
    getAllDepartments,
    getAllItemCategories,
    getAllItems,
    getDepartmentById
};