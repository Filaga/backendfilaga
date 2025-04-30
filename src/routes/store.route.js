const storeController = require("../controllers/store.controller"); 
const express = require('express'); 
const router = express.Router(); 

router.get('/getAll', storeController.getAllStores); 
router.post('/create', storeController.createStore); 
router.delete('/:id', storeController.deleteStore);
router.get('/:id', storeController.getStore);
router.put('/', storeController.updateStore);

module.exports = router;