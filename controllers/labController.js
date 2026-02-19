const db = require("../db/queries")

async function getHomepage(req, res) {
    const [departments, itemCategories, items] = await Promise.all([
        db.getAllDepartments(),
        db.getAllItemCategories(),
        db.getAllItems()
    ]);
    console.log("Homepage departments number", departments.length);
    console.log("Homepage item categories number", itemCategories.length);
    console.log("HomePage items number", items.length)
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

    console.log(department)

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
    // const itemBatchTransaction = await db.getItemBatchAndTransaction()
    const [departments, batches, items] = await Promise.all([
        db.getAllDepartments(),
        db.getAllBatches(),
        db.getAllItems()
    ])
    const transactions =  await db.gettransactionHistory()
    console.log("Departments: ", departments)
    console.log("Batches: ", batches)
    console.log("Items: ", items)
    res.render("layouts/transactions/index", {departments, batches, items, transactions})

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
    const[departments, categories, items] = await Promise.all([
        db.getAllDepartments(),
        db.getAllItemCategories(),
        db.getAllItems()

    ])
    res.render("layouts/admin/admin", {departments, categories, items})
}

async function editDepartment(req, res){
    const id = req.params.id;
    const department = await db.getDepartmentById(id);
    res.render("layouts/admin/departmentEdit", {department})
}

async function postDepartmentEdit(req, res){
    // console.log("req params",req.params)
    // console.log("req body", req.body)
    try {
        const {id} = req.params;
        const result = await db.insertDepartmentEdit({
            ...req.body,
            id
        })
        // console.log(result)

        if(result.rowCount === 0) {
            return res.status(404).send("Department not found")
        }

        res.redirect("/admin")

    } catch (err) {
        console.error(err)

        if(err.code === "23505") {
            return res.status(400).send("Name or cod ealready exists")
        }
        res.status(500).send("Server error")
    }

}

async function editCategory(req, res){
    const id = req.params.id
    const categoryResult = await db.getCategoryById(id)
    const category = categoryResult[0]

    res.render("layouts/admin/categoryEdit", {category})
}

async function postCategoryEdit(req, res) {
    try {
        const { id } = req.params;

        const data = {
            category_name: req.body.category_name?.trim(),
            category_description: req.body.category_description?.trim(),
            is_consumable: !!req.body.is_consumable,
            is_batch_tracked: !!req.body.is_batch_tracked,
            is_expiry_tracked: !!req.body.is_expiry_tracked,
            is_active: !!req.body.is_active,
            id
        };

        const result = await db.updateCategory(data);

        if (result.rowCount === 0) {
            return res.status(404).send("Category not found");
        }

        res.redirect("/admin");

    } catch (err) {
        console.error(err);

        if (err.code === "23505") {
            return res.status(400).send("Name or code already exist");
        }

        res.status(500).send("Server error");
    }
}

async function editItem(req, res) {
    const id = req.params.id
    const item = await db.getItemDetails(id)
    
    console.log("Item details :",item)

    res.render("layouts/admin/itemEdit", {item})
}

async function postItemEdit(req, res){
    try {
        const { id } = req.params;

        const data = {
            item_name: req.body.item_name?.trim(),
            unit_of_measure: req.body.item_unit_of_measure?.trim(),
            storage_condition: req.body.item_storage_condition?.trim(),
            minimum_stock: parseInt(req.body.minimum_stock, 10) || 0,
            is_active: !!req.body.item_is_active,
            id
        };

        console.log("req body :", req.body)

        console.log("dat to upload: ", data)
        const result = await db.updateItem(data);
        if (result.rowCount === 0) {
            return res.status(404).send("Item not found");
        }
        res.redirect("/admin");
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to update item");
    }
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
    postDepartmentEdit,
    editCategory,
    postCategoryEdit,
    editItem,
    postItemEdit
};