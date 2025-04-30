const express = require("express");
const itemController = require("../controllers/item.controller");
const uploadController = require("../controllers/upload.controller");
const upload = require("../utils/upload.util");
const router = express.Router();

router.post("/create", upload.single("image"), uploadController.uploadImage, itemController.createItem);
router.delete("/:id", itemController.deleteItem);
router.get("/", itemController.getAllItems);
router.get("/byId/:id", itemController.getItemById);
router.get("/byStoreId/:store_id", itemController.getItemsByStoreId);
router.put("/", upload.single("image"), uploadController.uploadImage, itemController.updateItem);

module.exports = router;
