"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const app_data_source_1 = require("./app-data-source");
const cors_1 = tslib_1.__importDefault(require("cors"));
const users_controller_1 = require("./controllers/users.controller");
const user_auth_1 = require("./middleware/user.auth");
const devices_router_1 = tslib_1.__importDefault(require("./routes/devices.router"));
const orders_router_1 = tslib_1.__importDefault(require("./routes/orders.router"));
const cookie_parser_1 = tslib_1.__importDefault(require("cookie-parser"));
const body_parser_1 = tslib_1.__importDefault(require("body-parser"));
const users_router_1 = tslib_1.__importDefault(require("./routes/users.router"));
const session_router_1 = tslib_1.__importDefault(require("./routes/session.router"));
const finance_router_1 = tslib_1.__importDefault(require("./routes/finance.router"));
const products_router_1 = tslib_1.__importDefault(require("./routes/products.router"));
const device_types_router_1 = tslib_1.__importDefault(require("./routes/device-types.router"));
const main_configs_router_1 = tslib_1.__importDefault(require("./routes/main-configs.router"));
const receipts_router_1 = tslib_1.__importDefault(require("./routes/receipts.router"));
// Initializing App
const app = (0, express_1.default)();
// Middlewares 
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)({
    credentials: true,
    // origin: ["https://playstation-frotend.vercel.app"],
    // origin: ["https://playstation-frontend.onrender.com"],
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "DELETE", "PUT"]
}));
app.use(express_1.default.urlencoded({
    extended: true
}));
// Routes
app.post('/login', users_controller_1.userLogin);
app.post('/firstuser', users_controller_1.addUser);
app.get('/firstuser', users_controller_1.checkUsers);
app.use(user_auth_1.auth);
app.use('/users', users_router_1.default);
app.use('/orders', orders_router_1.default);
app.use('/devices', devices_router_1.default);
app.use('/sessions', session_router_1.default);
app.use('/device-types', device_types_router_1.default);
app.use('/finances', finance_router_1.default);
app.use('/products', products_router_1.default);
app.use('/config', main_configs_router_1.default);
app.use('/receipts', receipts_router_1.default);
// Server Running
const initializeDataSource = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        yield app_data_source_1.myDataSource
            .initialize()
            .then(() => {
            console.log("Data Source Has Been Initialized!");
        });
    }
    catch (error) {
        throw new Error("failed to initialize data source");
    }
});
const initializingTimeout = 5000;
const serverInitializationTimeout = setTimeout(() => {
    console.error("Server Initializing Timed out...");
    process.exit(1);
}, initializingTimeout);
initializeDataSource()
    .then(() => {
    app.listen(5000, () => {
        console.log(`Server running at http://localhost:5000`);
        clearTimeout(serverInitializationTimeout);
    });
})
    .catch(err => {
    console.error('Error initializing datasource:', err);
    clearTimeout(serverInitializationTimeout);
    process.exit(1);
});
//# sourceMappingURL=main.js.map