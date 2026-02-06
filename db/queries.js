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

async function getStockItems() {
    const result = await pool.query(

        `
        select  
            it.id as item_id,
            it.name as item_name,
            it.unit_of_measure  as unit,
            it.storage_condition  as item_storage_condition,
            it.is_active  as is_item_active,
            ic.id as category_id,
            ic.name as category,
            ic.description as catergory_description,
            ic.is_consumable  as is_category_consumable,
            ib.id as batch_id,
            ib.batch_number as batch_number,
            ib.expiry_date as batch_expiry,
            ib.quantity_remaining as batch_quantity_remainig,
            ib.received_date as batch_recived_date,
            ib.is_active as is_batch_active
            
            
        from item_table it 
        join item_category ic 
        on it.category_id = ic.id
        join item_batches ib 
        on it.id = ib.item_id 

        `

    );
    console.log("stock results:",result.rows);
    return result.rows;
}

async function getTransactionTable() {
    const result = await pool.query("select * from stock_transaction ")
}

module.exports = {
    getAllDepartments,
    getAllItemCategories,
    getAllItems,
    getDepartmentById,
    getStockItems,
    getTransactionTable
};
