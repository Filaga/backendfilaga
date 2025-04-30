const itemRepository = require("../repositories/item.repository");
const storeRepository = require("../repositories/store.repository");
const baseResponse = require("../utils/baseResponse.util");
const FormData = require("form-data");
const stream = require("stream");
const axios = require("axios");

exports.createItem = async (req, res) => {
    if (!req.body.name || !req.body.price || !req.body.store_id) {
        return baseResponse(res, false, 400, "Name, price, and store_id are required");
    }

    const store = await storeRepository.getStore({ id: req.body.store_id });
    if (!store) {
        return baseResponse(res, false, 400, "Store doesn't exist");
    }

    try {
        const newItem = {
            name: req.body.name,
            price: req.body.price,
            store_id: req.body.store_id,
            image_url: req.imageUrl || "",
            stock: req.body.stock || 0,
        };

        const item = await itemRepository.createItem(newItem);

        return baseResponse(res, true, 201, "Item created", item);
    } catch (error) {
        return baseResponse(res, false, 500, "Server Error", error.message || error);
    }
};

exports.deleteItem = async (req, res) => {
    const { id } = req.params;
    
    try {
        const item = await itemRepository.deleteItem(id);
        
        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found",
                payload: null
            });
        }

        return res.status(200).json({
            success: true,
            message: "Item deleted",
            payload: item
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error deleting item",
            payload: null
        });
    }
};

exports.getAllItems = async (req, res) => {
    try {
        const items = await itemRepository.getAllItems();

        if (items.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No items found",
                payload: []
            });
        }

        return res.status(200).json({
            success: true,
            message: "Items found",
            payload: items
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error retrieving items",
            payload: null
        });
    }
};

exports.getItemById = async (req, res) => {
    const { id } = req.params;

    try {
        const item = await itemRepository.getItemById(id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found",
                payload: null
            });
        }

        return res.status(200).json({
            success: true,
            message: "Item found",
            payload: item
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error retrieving item",
            payload: null
        });
    }
};

exports.getItemsByStoreId = async (req, res) => {
    const { store_id } = req.params;

    try {
        const items = await itemRepository.getItemsByStoreId(store_id);

        if (!items || items.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Store doesn't exist",
                payload: null
            });
        }

        return res.status(200).json({
            success: true,
            message: "Items found",
            payload: items
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error retrieving items",
            payload: null
        });
    }
};

exports.updateItem = async (req, res) => {
    const store = await storeRepository.getStore({ id: req.body.store_id });
    if (!store) {
        return baseResponse(res, false, 400, "Store doesn't exist");
    }

    try {
        const newItem = {
            name: req.body.name,
            price: req.body.price,
            store_id: req.body.store_id,
            image_url: req.imageUrl || "",
            stock: req.body.stock || 0,
            id: req.body.id,
        };

        const item = await itemRepository.updateItem(newItem);

        return baseResponse(res, true, 200, "Item updated", item);
    } catch (error) {
        return baseResponse(res, false, 500, "Server Error", error.message || error);
    }
};