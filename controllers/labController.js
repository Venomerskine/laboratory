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
    // console.log(itemBatchTransaction)
    res.render("layouts/transactions/index", {itemBatchTransaction})

}

async function postTransaction (req, res) {
    try {
        
        const {
            department_name,
            batch_number,
            transaction_type,
            qantity,
            reason,
        } = req.body

        console.log(req.body)

        await db.insertStockTransaction({
            department_name,
            batch_number,
            transaction_type,
            qantity,
            reason,
        })

        res.redirect("/");
    } catch (err) {
       console.error(err);
       res.status(500).send("Failed to save transaction") 
    }
}

async function getBatchDetails(){
    const batch = await db.getBatchInDetail()
    res.render("layout/stock/batch-detail", {batch})
}

module.exports = {
    getHomepage,
    getDepartment,
    getStock,
    getTransaction,
    postTransaction,
    getBatchDetails
};

