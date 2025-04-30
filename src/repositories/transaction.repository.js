const db = require("../database/pg.database"); 

exports.createTransaction = async (transaction) => {
    try {
        const res = await db.query(
            `INSERT INTO transactions (user_id, item_id, quantity, total, status) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [transaction.user_id, transaction.item_id, transaction.quantity, transaction.total, transaction.status]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
        throw error;
    }
};

exports.updateTransactionStatus = async (transaction_id, status) => {
    try {
        const res = await db.query(
            "UPDATE transactions SET status = $1 WHERE id = $2 RETURNING *",
            [status, transaction_id]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error updating transaction status", error);
        throw error;
    }
};

exports.getTransactionById = async (id) => {
    try {
        const res = await db.query("SELECT * FROM transactions WHERE id = $1", [id]);
        return res.rows[0];
    } catch (error) {
        console.error("Error fetching transaction", error);
        throw error;
    }
};

exports.deleteTransaction = async (id) => {
    try {
        const res = await db.query("DELETE FROM transactions WHERE id = $1 RETURNING *", [id]);
        return res.rows[0];
    } catch (error) {
        console.error("Error deleting transactions", error);
    }
};

exports.getAllTransactions = async () => {
    try {
        const res = await db.query("SELECT * FROM transactions ORDER BY created_at ASC");
        return res.rows;
    } catch (error) {
        console.error("Error fetching all transactions", error);
        throw error;
    }
};
