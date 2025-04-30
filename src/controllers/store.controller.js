const storeRepository = require("../repositories/store.repository")
const baseResponse = require("../utils/baseResponse.util")

exports.getAllStores = async (req, res) => { 
    try{ 
    const stores = await storeRepository.getAllStores(); 
    baseResponse(res, true, 200, "Stores retrieved successfully", stores) 
    }catch (error) { 
    baseResponse(res, false, 500, "Error retrieving stores", error) 
    } 
    };

exports.createStore = async (req, res) => { 
    if (!req.body.name || !req.body.address) { 
    return baseResponse(res, false, 400, "Name and address are required"); 
    }
    try { 
    const store = await storeRepository.createStore(req.body); 
    baseResponse(res, true, 201, "Store created successfully", store); 
    }catch (error) {
    baseResponse(res, false, 500, error.message || "Server Error", error); 
    }
};

exports.deleteStore = async (req, res) => {
    if (!req.params.id){
        return baseResponse(res, false, 400, "Id is required");
    }
    try{
        const store = await storeRepository.deleteStore(req.params);
        if (!store) {
            return baseResponse(res, false, 404, "Store not found", null);
        }
        baseResponse(res, true, 200, "Store deleted successfully", store);
    } catch (error) {
        baseResponse(res, false, 500, error.message || "Server Error", error); 
    }
};

exports.getStore = async (req, res) => {
    if (!req.params.id){
        return baseResponse(res, false, 400, "Id is required");
    }
    try{
        const store = await storeRepository.getStore(req.params);
        if (!store) {
            return baseResponse(res, false, 404, "Store not found", null);
        }
        baseResponse(res, true, 200, "Store retrieved successfully", store);
    } catch (error) {
        baseResponse(res, false, 500, error.message || "Server Error", error); 
    }
};

exports.updateStore = async (req, res) => { 
    if (!req.body.id || !req.body.name || !req.body.address) { 
    return baseResponse(res, false, 400, "Id, Name, and address are required"); 
    }
    try { 
    const store = await storeRepository.updateStore(req.body); 
    if (!store){
        return baseResponse(res, false, 404, "Store not found", null);
    }
    baseResponse(res, true, 200, "Store updated successfully", store); 
    }catch (error) {
    baseResponse(res, false, 500, error.message || "Server Error", error); 
    }
};