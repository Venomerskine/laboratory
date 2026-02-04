require("dotenv").config();
const pool = require("./pool");

async function getAllDepartments() {
    const result = await pool.query("SELECT * FROM departments;");
    return result.rows;
}

module.exports = {
    getAllDepartments,
};