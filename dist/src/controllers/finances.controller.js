"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allFinances = void 0;
const tslib_1 = require("tslib");
const app_data_source_1 = require("../app-data-source");
const finances_entity_1 = require("../entity/finances.entity");
const financeRepo = app_data_source_1.myDataSource.getRepository(finances_entity_1.Finance);
const allFinances = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { date } = req.params;
    const finances = yield financeRepo.find();
    let lastDay = 0;
    let dailyFinances = 0;
    let lastWeek = 0;
    let weeklyFinances = 0;
    let lastMonth = 0;
    let monthlyFinances = 0;
    let lastYear = 0;
    let yearlyFinances = 0;
    let monthlyDeduction = 0;
    let lastMonthDeduction = 0;
    const currentDay = new Date(new Date(new Date(date).toLocaleDateString()).setUTCHours(3, 0, 0, 0));
    const tomorrow = currentDay;
    tomorrow.setUTCDate(currentDay.getDate() + 1);
    const currentDayFinances = finances.filter((finance) => new Date(new Date(finance.added_at).setHours(2, 0, 0, 0)).getDate() == currentDay.getDate() && currentDay.getMilliseconds() - new Date(new Date(finance.added_at).setHours(2, 0, 0, 0)).getMilliseconds() <= 24 * 60 * 60 * 1000);
    finances === null || finances === void 0 ? void 0 : finances.map((finance) => {
        let addTime = new Date(new Date(finance.added_at).setHours(2, 0, 0, 0));
        let nextSunday = Math.abs(7 - currentDay.getDay());
        if (addTime.getDate() == currentDay.getDate() && currentDay.getMilliseconds() - addTime.getMilliseconds() <= 24 * 60 * 60 * 1000) {
            dailyFinances += finance.finances;
        }
        if (addTime < new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate())
            && addTime > new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate() - 1)) {
            lastDay += finance.finances;
        }
        if (new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate() + nextSunday) > addTime
            && new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate() - currentDay.getDay()) < addTime) {
            weeklyFinances += finance.finances;
        }
        if (currentDay.getMilliseconds() + (nextSunday * 24 * 60 * 60 * 1000) - (7 * 24 * 60 * 60 * 1000) > addTime.getMilliseconds()
            && currentDay.getMilliseconds() - (currentDay.getDay() * 24 * 60 * 60 * 1000) - (7 * 24 * 60 * 60 * 1000) < addTime.getMilliseconds()) {
            lastWeek += finance.finances;
        }
        const firstDayOfCurrentMonth = new Date(currentDay.getFullYear(), currentDay.getMonth(), 1);
        const firstDayOfPreviousMonth = new Date(currentDay.getFullYear(), currentDay.getMonth() - 1, 1);
        const firstDayofNextMonth = new Date(currentDay.getFullYear(), currentDay.getMonth() + 1, 1);
        if (new Date(addTime) < firstDayofNextMonth
            && new Date(addTime) >= firstDayOfCurrentMonth) {
            monthlyFinances += finance.finances;
        }
        if (new Date(addTime) < firstDayOfCurrentMonth
            && new Date(addTime) > firstDayOfPreviousMonth) {
            lastMonth += finance.finances;
        }
        if (new Date(addTime) < firstDayofNextMonth
            && new Date(addTime) > firstDayOfCurrentMonth && finance.type == "deduction") {
            monthlyDeduction += finance.finances;
        }
        if (new Date(addTime) < firstDayOfCurrentMonth
            && new Date(addTime) > firstDayOfPreviousMonth && finance.type == "deduction") {
            lastMonthDeduction += finance.finances;
        }
        if (addTime.getFullYear() == currentDay.getFullYear()) {
            yearlyFinances += finance.finances;
        }
        if (addTime.getFullYear() == currentDay.getFullYear() - 1) {
            lastYear += finance.finances;
        }
    });
    if (finances) {
        res.json({ currentDay, tomorrow, finances, currentDayFinances, yearlyFinances, lastYear, lastWeek, lastDay, lastMonth, weeklyFinances, dailyFinances, monthlyFinances, monthlyDeduction, lastMonthDeduction });
    }
    else
        res.json({ m: "حدث خطأ" });
});
exports.allFinances = allFinances;
//# sourceMappingURL=finances.controller.js.map