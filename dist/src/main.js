"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const app_data_source_1 = require("./app-data-source");
const cors_1 = tslib_1.__importDefault(require("cors"));
const users_controller_1 = require("./controllers/users.controller");
const user_auth_1 = require("./middleware/user.auth");
const users_router_1 = tslib_1.__importDefault(require("./routes/users.router"));
const cookie_parser_1 = tslib_1.__importDefault(require("cookie-parser"));
const body_parser_1 = tslib_1.__importDefault(require("body-parser"));
// Initializing App
const app = (0, express_1.default)();
//Database Initializer
app_data_source_1.myDataSource
    .initialize()
    .then(() => {
    console.log("Data Source Has Been Initialized!");
})
    .catch((err) => console.error("Error during data sourve initialization: ", err));
// Middlewares 
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)({
    credentials: true,
    origin: ["https://playstation-frontend-38qu60tjy-taysons-projects.vercel.app"],
    methods: ["POST", "GET"]
}));
app.use(express_1.default.urlencoded({
    extended: true
}));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://playstation-frontend-38qu60tjy-taysons-projects.vercel.app"); // "*"
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// Routes
app.get('/auth', user_auth_1.auth);
app.post('/login', users_controller_1.userLogin);
app.get('/logout', users_controller_1.userLogout);
app.use('/user', users_router_1.default);
// Server Running
app.listen(5000, () => {
    console.log("listening to requests on port 5000");
});
//# sourceMappingURL=main.js.map