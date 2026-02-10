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
    // console.log(req.params)
    // console.log("Department id is: ", id)

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

async function getStock(req, res) {
    const stockItems = await db.getStockItems();
    // console.log("Stock Items:", stockItems);
    if (!stockItems) {
        return res.status(404).send("No stock items found");
    } else {
        // console.log("Stock items retrieved successfully");
        res.render("layouts/stock/index", {stockItems});
        // res.send(stockItems.json)
    }
}

async function getTransaction(req, res) {
    const itemBatchTransaction = await db.getItemBatchAndTransaction()
    const transactions =  await db.gettransactionHistory()
    // console.log(itemBatchTransaction)
    res.render("layouts/transactions/index", {itemBatchTransaction, transactions})

}

async function postTransaction(req, res) {
  try {
    const {
      department_name,
      batch_number,
      transaction_type,
      quantity,
      reason,
    } = req.body;

    console.log(req.body);

    await db.insertStockTransaction({
      department_name,
      batch_number,
      transaction_type,
      quantity,
      reason,
    });

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to save transaction");
  }
}


async function getBatchDetails(req, res){
    const id = req.params.id
    const batch = await db.getBatchInDetail(id)
    res.render("layouts/stock/batch-detail", {batch})
}

async function getCategoryDetails(req, res){
    const id = req.params.id
    const [categoryResult, itemsResult] =  await Promise.all([
        db.getCategoryById(id),
        db.getItemsByCategory(id)
    ]);

    const category = categoryResult[0]
    const items = itemsResult
    res.render("layouts/stock/category", {category, items})
}

async function getAdminPage(req, res){
    const[departments] = await Promise.all([
        db.getAllDepartments()
    ])
    res.render("layouts/admin/admin", {departments})
}

async function editDepartment(req, res){
    const id = req.params.id;
    const department = await db.getDepartmentById(id);
    res.render("layouts/admin/departmentEdit", {department})
}

async function postDeaprtmentEdit(req, res){
    const {
        department_name,
        department_code_name,
        department_description,
        is_active,
    } = req.body

    await db.isertDepartmentEdit({
        department_name,
        department_code_name,
        department_description,
        is_active,
    })
}

module.exports = {
    getHomepage,
    getDepartment,
    getStock,
    getTransaction,
    postTransaction,
    getBatchDetails,
    getCategoryDetails,
    getAdminPage,
    editDepartment,
    postDeaprtmentEdit
};

