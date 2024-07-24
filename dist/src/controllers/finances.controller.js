"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statisticFinances = exports.getUsersFinances = exports.allFinances = exports.removeDeduction = exports.addDeduction = void 0;
const tslib_1 = require("tslib");
const app_data_source_1 = require("../app-data-source");
const finances_entity_1 = require("../entity/finances.entity");
const user_entity_1 = require("../entity/user.entity");
const order_entity_1 = require("../entity/order.entity");
const financeRepo = app_data_source_1.myDataSource.getRepository(finances_entity_1.Finance);
const userRepo = app_data_source_1.myDataSource.getRepository(user_entity_1.User);
const orderRepo = app_data_source_1.myDataSource.getRepository(order_entity_1.Order);
const statisticFinances = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { date, user } = req.params;
    let finances = [];
    user == "all" ? finances = yield financeRepo.find() : finances = yield financeRepo.find({ where: { cashier_id: user } });
    let lastDay = 0;
    let dailyFinances = 0;
    let dailyGrowthLoss = 0;
    let dailyGrowthLossSign = false;
    let lastWeek = 0;
    let weeklyFinances = 0;
    let weeklyGrowthLoss = 0;
    let weeklyGrowthLossSign = false;
    let lastMonth = 0;
    let monthlyFinances = 0;
    let monthlyGrowthLoss = 0;
    let monthlyGrowthLossSign = false;
    let lastYear = 0;
    let yearlyFinances = 0;
    let yearlyGrowthLoss = 0;
    let yearlyGrowthLossSign = false;
    let dailyDeduction = 0;
    let lastDayDeduction = 0;
    let dailyDeductionGrowthLoss = 0;
    let dailyDeductionGrowthLossSign = true;
    let monthlyDeduction = 0;
    let lastMonthDeduction = 0;
    let monthlyDeductionGrowthLoss = 0;
    let monthlyDeductionGrowthLossSign = false;
    let productsRevenue = 0;
    let productsGrowthLoss = 0;
    let productsGrowthLossSign = false;
    const currentDay = new Date(new Date(new Date(date).toLocaleDateString()).setUTCHours(3, 0, 0, 0));
    const tomorrow = currentDay;
    tomorrow.setUTCDate(currentDay.getDate() + 1);
    const currentDayFinances = finances.filter((finance) => new Date(new Date(finance.added_at).setHours(2, 0, 0, 0)).getDate() == currentDay.getDate() && currentDay.getMilliseconds() - new Date(new Date(finance.added_at).setHours(2, 0, 0, 0)).getMilliseconds() <= 24 * 60 * 60 * 1000);
    const firstDayOfPreviousMonth = new Date(currentDay.getFullYear(), currentDay.getMonth() - 1, 1);
    const firstDayOfCurrentMonth = new Date(currentDay.getFullYear(), currentDay.getMonth(), 1);
    const firstDayofNextMonth = new Date(currentDay.getFullYear(), currentDay.getMonth() + 1, 1);
    let nextSunday = Math.abs(7 - currentDay.getDay());
    finances === null || finances === void 0 ? void 0 : finances.map((finance) => {
        let addTime = new Date(new Date(finance.added_at).setHours(2, 0, 0, 0));
        if (addTime.getDate() == currentDay.getDate() && currentDay.getMilliseconds() - addTime.getMilliseconds() <= 24 * 60 * 60 * 1000) {
            if (finance.type == "deduction") {
                dailyFinances -= finance.finances;
                dailyDeduction += finance.finances;
            }
            else
                dailyFinances += finance.finances;
        }
        if (addTime < new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate())
            && addTime > new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate() - 1)) {
            if (finance.type == "deduction") {
                lastDay -= finance.finances;
                lastDayDeduction += finance.finances;
            }
            else
                lastDay += finance.finances;
        }
        if (new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate() + nextSunday) > addTime
            && new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate() - currentDay.getDay()) < addTime) {
            if (finance.type == "deduction") {
                weeklyFinances -= finance.finances;
            }
            else
                weeklyFinances += finance.finances;
        }
        if (currentDay.getMilliseconds() + (nextSunday * 24 * 60 * 60 * 1000) - (7 * 24 * 60 * 60 * 1000) > addTime.getMilliseconds()
            && currentDay.getMilliseconds() - (currentDay.getDay() * 24 * 60 * 60 * 1000) - (7 * 24 * 60 * 60 * 1000) < addTime.getMilliseconds()) {
            if (finance.type == "deduction") {
                lastWeek -= finance.finances;
            }
            else
                lastWeek += finance.finances;
        }
        if (new Date(addTime) < firstDayofNextMonth
            && new Date(addTime) >= firstDayOfCurrentMonth) {
            if (finance.type == "deduction") {
                monthlyFinances -= finance.finances;
                monthlyDeduction += finance.finances;
            }
            else
                monthlyFinances += finance.finances;
        }
        if (new Date(addTime) < firstDayOfCurrentMonth
            && new Date(addTime) > firstDayOfPreviousMonth) {
            if (finance.type == "deduction") {
                lastMonth -= finance.finances;
                lastMonthDeduction += finance.finances;
            }
            else
                lastMonth += finance.finances;
        }
        if (addTime.getFullYear() == currentDay.getFullYear()) {
            if (finance.type == "deduction") {
                yearlyFinances -= finance.finances;
            }
            else
                yearlyFinances += finance.finances;
        }
        if (addTime.getFullYear() == currentDay.getFullYear() - 1) {
            if (finance.type == "deduction") {
                lastYear -= finance.finances;
            }
            else
                lastYear += finance.finances;
        }
    });
    dailyGrowthLoss = Math.floor((Math.abs(dailyFinances - lastDay) / lastDay) * 100);
    weeklyGrowthLoss = Math.floor((Math.abs(weeklyFinances - lastWeek) / lastWeek) * 100);
    monthlyGrowthLoss = Math.floor((Math.abs(monthlyFinances - lastMonth) / lastMonth) * 100);
    yearlyGrowthLoss = Math.floor((Math.abs(yearlyFinances - lastYear) / lastYear) * 100);
    dailyDeductionGrowthLoss = Math.floor((Math.abs(dailyDeduction - lastDayDeduction) / lastDayDeduction) * 100);
    monthlyDeductionGrowthLoss = Math.floor((Math.abs(monthlyDeduction - lastMonthDeduction) / lastMonthDeduction) * 100);
    if (dailyFinances - lastDay > 0)
        dailyGrowthLossSign = true;
    if (weeklyFinances - lastWeek > 0)
        weeklyGrowthLossSign = true;
    if (monthlyFinances - lastMonth > 0)
        monthlyGrowthLossSign = true;
    if (yearlyFinances - lastYear > 0)
        yearlyGrowthLossSign = true;
    if (dailyDeduction - lastDayDeduction > 0)
        dailyDeductionGrowthLossSign = false;
    if (monthlyDeduction - lastMonthDeduction > 0)
        monthlyDeductionGrowthLossSign = false;
    const orders = yield orderRepo.find();
    if (orders) {
        let monthlyCost = 0;
        let lastMonthCost = 0;
        orders.map((order) => {
            let monthDiff = new Date(order.time_ordered).getMonth() === new Date().getMonth();
            let lastMonthDiff = new Date(order.time_ordered).getMonth() === new Date().getMonth() - 1;
            let yearDiff = new Date(order.time_ordered).getFullYear() === new Date().getFullYear();
            if (monthDiff && yearDiff) {
                monthlyCost += order.cost;
            }
            else if (lastMonthDiff && yearDiff) {
                lastMonthCost += order.cost;
            }
        });
        productsRevenue = monthlyCost;
        productsGrowthLoss = Math.floor(Math.abs(monthlyCost - lastMonthCost) / lastMonthCost * 100);
        if (monthlyCost - lastMonthCost > 0)
            productsGrowthLossSign = true;
    }
    res.json(finances ? { currentDay, tomorrow, finances, currentDayFinances, yearlyFinances, lastYear, lastWeek, lastDay, lastMonth, weeklyFinances, dailyFinances, monthlyFinances, dailyDeduction, lastDayDeduction, monthlyDeduction, lastMonthDeduction, dailyGrowthLoss, dailyGrowthLossSign, weeklyGrowthLoss, weeklyGrowthLossSign, monthlyGrowthLoss, monthlyGrowthLossSign, yearlyGrowthLoss, yearlyGrowthLossSign, dailyDeductionGrowthLoss, dailyDeductionGrowthLossSign, monthlyDeductionGrowthLoss, monthlyDeductionGrowthLossSign, productsRevenue, productsGrowthLoss, productsGrowthLossSign }
        : { message: "حدث خطأ" });
});
exports.statisticFinances = statisticFinances;
const addDeduction = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { description, finances } = req.body;
    const cashier = (_a = req.headers.username) === null || _a === void 0 ? void 0 : _a.toString().split(' ')[1];
    const cashier_id = (_b = req.headers.user_id) === null || _b === void 0 ? void 0 : _b.toString().split(' ')[1];
    if (description && finances) {
        const newFinance = financeRepo.create({ finances: parseInt(finances), description, type: "deduction", cashier, cashier_id });
        const finance = yield financeRepo.save(newFinance);
        finance && res.json({ message: "تمت إضافة خصم بنجاح", success: true });
    }
    else
        res.json({ message: "برجاء ملء كل البيانات", success: false });
});
exports.addDeduction = addDeduction;
const removeDeduction = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deduction = yield financeRepo.findOne({ where: { id } });
    if (deduction) {
        const deletedFinance = yield financeRepo.remove(deduction);
        deletedFinance && res.json({ message: "تم حذف الخصم بنجاح", success: true });
    }
    else
        res.json({ message: "حدث خطأ", success: false });
});
exports.removeDeduction = removeDeduction;
const getUsersFinances = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const users = yield userRepo.find();
    const finances = yield financeRepo.find();
    if (users && finances) {
        const userFinancesArr = [];
        users.map((user) => {
            let userFinance = {
                id: user.id,
                username: user.username,
                admin: user.admin,
                dailyFinances: 0,
                monthlyFinances: 0,
            };
            finances.filter((finance) => finance.cashier_id === user.id).map((finance) => {
                const firstDayOfCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
                const firstDayofNextMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
                let addTime = new Date(new Date(finance.added_at).setHours(2, 0, 0, 0));
                if (addTime.getDate() == new Date().getDate() && new Date().getMilliseconds() - addTime.getMilliseconds() <= 24 * 60 * 60 * 1000) {
                    if (finance.type == "deduction") {
                        userFinance.dailyFinances -= finance.finances;
                    }
                    else
                        userFinance.dailyFinances += finance.finances;
                }
                if (new Date(addTime) < firstDayofNextMonth
                    && new Date(addTime) >= firstDayOfCurrentMonth) {
                    if (finance.type == "deduction") {
                        userFinance.monthlyFinances -= finance.finances;
                    }
                    else
                        userFinance.monthlyFinances += finance.finances;
                }
            });
            userFinancesArr.push(userFinance);
        });
        res.json({ usersFinances: userFinancesArr });
    }
});
exports.getUsersFinances = getUsersFinances;
const allFinances = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const finances = yield financeRepo.find();
    res.json({ finances });
});
exports.allFinances = allFinances;
//# sourceMappingURL=finances.controller.js.map