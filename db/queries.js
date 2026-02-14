require("dotenv").config();
const pool = require("./pool");

async function getAllDepartments() {
    const result = await pool.query("select * from departments d where is_active = true order by name asc");
    return result.rows;
}

async function getDepartmentById(id) {
    const result = await pool.query("select * from departments where id = $1", [id]);
    return result.rows[0];
}

async function getAllItemCategories() {
    const result = await pool.query("select * from item_category ic ");
    return result.rows;
    
}

async function getAllItems() {
    const result = await pool.query("select * from item_table where is_active =  true ");
    return result.rows;
}

async function getItemDetails(id) {
    const result = await pool.query(`
            select
                name,
                it.unit_of_measure,
                it.storage_condition,
                it.minimum_stock,
                it.is_active,
                it.created_at,
                it.updated_at 
            from item_table it where id = $1
        `, [id])
    return result.rows[0]
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
    // console.log("stock results:",result.rows);
    return result.rows;
}

async function getTransactionTable() {
    const result = await pool.query("select * from stock_transaction ")
    return result.rows
}

async function getItemBatchAndTransaction() {
    const result = await pool.query(
        `
        select 
            d."name"  as department_name,
            it.name as item_name,
            ib.batch_number 
        from item_table it 
        join item_batches ib 
        on it.id = ib.item_id 
        join stock_transaction st 
        on st.item_batch_id = ib.id
        join departments d 
        on st.department_id = d.id
        `
    )
    return result.rows
}

async function insertStockTransaction(data) {
  const query = `
    INSERT INTO stock_transaction
      (item_batch_id, department_id, transaction_type, quantity, reason)
    SELECT
      ib.id,
      d.id,
      $1,
      $2,
      $3
    FROM item_batches ib
    JOIN departments d ON d.name = $4
    WHERE ib.batch_number = $5
  `;
  const values = [
    data.transaction_type,
    data.quantity,
    data.reason,
    data.department_name,
    data.batch_number,
  ];

  return pool.query(query, values);
}


async function getBatchInDetail(id) {
    const result = await pool.query(
        `
        select 
            it.name,
            it.storage_condition,
            ib.batch_number,
            ib.expiry_date,
            ib.quantity_remaining,
            ib.received_date,
            ib.is_active
        from item_table it 
        join item_batches ib 
        on ib.item_id = it.id
        where it.id = $1
        `,[id]
    )

    return result.rows;
}

async function getCategoryById(id){
    const categoryResult = await pool.query(`
        SELECT *
        FROM item_category
        WHERE id = $1;
        `, [id])

        // console.log("Categoy details :",categoryResult)
    return categoryResult.rows
}

async function getItemsByCategory(id){
        const itemResults = await pool.query(`
        SELECT *
        FROM item_table
        WHERE category_id = $1;
        `, [id])
        // console.log("items in category : ",itemResults)
        return itemResults.rows
}

async function gettransactionHistory(){
    const history = await pool.query(`
        
        select 
            d.name as department, 
            it.name as item,
            ib.batch_number,
            st.transaction_type,
            st.transaction_date,
            st.reason
        from stock_transaction st 
        join item_batches ib on st.item_batch_id = ib.id 
        join item_table it on ib.item_id = it.id
        join departments d on st.department_id = d.id
        order by transaction_date desc
        `)
        return history.rows
}

async function insertDepartmentEdit(data){
    const query = `
        UPDATE departments
        SET 
            name = $1,
            code_name = $2,
            description = $3,
            is_active = $4,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $5
        RETURNING *;
    `
    const values = [
        data.department_name,
        data.department_code_name,
        data.department_description || null,
        data.is_active === "true",
        data.id
        
    ]


    return await pool.query(query, values)
}

async function updateCategory(data){
    const query = `
        UPDATE item_category
            SET 
                name = $1,
                description = $2,
                is_consumable = $3,
                is_batch_tracked = $4,
                is_expiry_tracked = $5,
                is_active = $6,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $7
            RETURNING *;
    `
    const values = [
        data.category_name,
        data.category_description,
        data.is_consumable,
        data.is_batch_tracked,
        data.is_expiry_tracked,
        data.is_active,
        data.id
    ]

    return await pool.query(query, values)
}

module.exports = {
    getAllDepartments,
    getAllItemCategories,
    getAllItems,
    getDepartmentById,
    getStockItems,
    getTransactionTable,
    getItemBatchAndTransaction,
    insertStockTransaction,
    getBatchInDetail,
    getCategoryById,
    getItemsByCategory,
    gettransactionHistory,
    insertDepartmentEdit,
    updateCategory,
    getItemDetails
};
