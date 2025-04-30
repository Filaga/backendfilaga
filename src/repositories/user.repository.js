const db = require("../database/pg.database"); 

exports.getUserByEmail = async (email) => {
    try {
        const res = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        return res.rows[0];
    } catch (error) {
        console.error("Error fetching user", error);
    }
};

exports.createUser = async (user) => {
    try {
        const res = await db.query(
            "INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING *",
            [user.email, user.password, user.name]
        );
        return res.rows[0];t
    } catch (error) {
        console.error("Error creating user", error);
    }
};

exports.getUserByEmail = async (email) => {
    try {
        const res = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        return res.rows[0];
    } catch (error) {
        console.error("Error fetching user", error);
    }
};

exports.getUserById = async (id) => {
    try {
        const res = await db.query("SELECT * FROM users WHERE id = $1", [id]);
        return res.rows[0];
    } catch (error) {
        console.error("Error fetching user", error);
    }
};

exports.updateUser = async (user) => {
    try {
        const res = await db.query(
            "UPDATE users SET email = $1, password = $2, name = $3 WHERE id = $4 RETURNING *",
            [user.email, user.password, user.name, user.id]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error updating user", error);
    }
};

exports.deleteUser = async (id) => {
    try {
        const res = await db.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
        return res.rows[0];
    } catch (error) {
        console.error("Error deleting user", error);
    }
};

exports.updateUserBalance = async (id, balance) => {
    try {
        const res = await db.query(
            "UPDATE users SET balance = $1 WHERE id = $2 RETURNING *",
            [balance, id]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error updating user balance", error);
    }
};