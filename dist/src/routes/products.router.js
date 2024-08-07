"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const products_controller_1 = require("../controllers/products.controller");
const user_auth_1 = require("../middleware/user.auth");
const express_1 = tslib_1.__importDefault(require("express"));
const productsRouter = express_1.default.Router();
productsRouter.get('/', products_controller_1.allProducts);
productsRouter.get('/:id', products_controller_1.oneProduct);
productsRouter.post('/', user_auth_1.isAdmin, products_controller_1.addProduct);
productsRouter.put('/:id', user_auth_1.isAdmin, products_controller_1.updateProduct);
productsRouter.delete('/:id', user_auth_1.isAdmin, products_controller_1.deleteProduct);
exports.default = productsRouter;
//# sourceMappingURL=products.router.js.map