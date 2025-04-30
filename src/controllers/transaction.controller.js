const transactionRepository = require("../repositories/transaction.repository")
const itemRepository = require("../repositories/item.repository");
const userRepository = require("../repositories/user.repository");
const baseResponse = require("../utils/baseResponse.util")

exports.createTransaction = async (req, res) => {
    const { item_id, quantity, user_id } = req.body;

    if (!item_id || !quantity || !user_id) {
        return baseResponse(res, false, 400, "Item ID, quantity, and user ID are required");
    }

    if (quantity <= 0) {
        return baseResponse(res, false, 400, "Quantity must be larger than 0", null);
    }

    try {
        const item = await itemRepository.getItemById(item_id);
        if (!item) {
            return baseResponse(res, false, 404, "Item not found", null);
        }

        if (item.stock < quantity) {
            return baseResponse(res, false, 400, "Not enough stock", null);
        }

        const total = item.price * quantity;

        const newTransaction = await transactionRepository.createTransaction({
            user_id,
            item_id,
            quantity,
            total,
            status: "pending",
        });

        return baseResponse(res, true, 201, "Transaction created", newTransaction);
    } catch (error) {
        return baseResponse(res, false, 500, "Server Error", error.message || error);
    }
};

exports.payTransaction = async (req, res) => {
    const { transaction_id } = req.params;

    try {
        const transaction = await transactionRepository.getTransactionById(transaction_id);
        if (!transaction) {
            return baseResponse(res, false, 404, "Transaction not found", null);
        }

        if (transaction.status === 'paid') {
            return baseResponse(res, false, 400, "Transaction already paid", null);
        }

        const user = await userRepository.getUserById(transaction.user_id);
        if (!user) {
            return baseResponse(res, false, 404, "User not found", null);
        }

        if (user.balance < transaction.total) {
            return baseResponse(res, false, 400, "Insufficient balance", null);
        }

        await transactionRepository.updateTransactionStatus(transaction_id, "paid");

        const updatedBalance = user.balance - transaction.total;
        await userRepository.updateUserBalance(user.id, updatedBalance);

        const item = await itemRepository.getItemById(transaction.item_id);
        if (!item || item.stock < transaction.quantity) {
            return baseResponse(res, false, 400, "Not enough stock", null);
        }
        const updatedStock = item.stock - transaction.quantity;
        await itemRepository.updateItemStock(transaction.item_id, updatedStock);

        const responsePayload = {
            id: transaction.id,
            user_id: transaction.user_id,
            item_id: transaction.item_id,
            quantity: transaction.quantity,
            total: transaction.total,
            status: "paid",
            created_at: transaction.created_at,
        };

        return baseResponse(res, true, 200, "Payment successful", responsePayload);
    } catch (error) {
        console.error(error);
        return baseResponse(res, false, 500, "Server Error", error.message || error);
    }
};

exports.deleteTransaction = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return baseResponse(res, false, 400, "Transaction ID is required");
    }

    try {
        const user = await transactionRepository.getTransactionById(id);
        if (!user) {
            return baseResponse(res, false, 404, "Transaction not found", null);
        }

        const deletedTransaction = await transactionRepository.deleteTransaction(id);

        return baseResponse(res, true, 200, "Transaction deleted", deletedTransaction);
    } catch (error) {
        return baseResponse(res, false, 500, error.message || "Server Error", error);
    }
};

exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await transactionRepository.getAllTransactions();

        const enrichedTransactions = await Promise.all(transactions.map(async (tx) => {
            const user = await userRepository.getUserById(tx.user_id);
            const item = await itemRepository.getItemById(tx.item_id);

            return {
                ...tx,
                user,
                item
            };
        }));

        return baseResponse(res, true, 200, "Transactions found", enrichedTransactions);
    } catch (error) {
        console.error(error);
        return baseResponse(res, false, 500, "Server Error", error.message || error);
    }
};