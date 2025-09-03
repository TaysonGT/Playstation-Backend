import {Response, Request} from "express"
import { myDataSource } from "../app-data-source";
import { User } from '../entity/user.entity'
import { Order } from '../entity/order.entity'
import { Receipt } from "../entity/reciept.entity";

const userRepo = myDataSource.getRepository(User)
const orderRepo = myDataSource.getRepository(Order)
const receiptRepo = myDataSource.getRepository(Receipt)

const statisticFinances = async (req:Request, res:Response)=>{
    const { date, user } = req.params;
    let finances = [];
    user=="all"? 
        finances= await receiptRepo.find({relations: {cashier: true}}) 
        :finances = await receiptRepo.find({where:{cashier: {id: user}}, relations: {cashier: true}});    
    
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

    const timeOffset = new Date(date).getTimezoneOffset();

    const currentDay = new Date(date);
    // const startOfToday = currentDay.setHours(0+timeOffset,0,0,0);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0+timeOffset, 0, 0, 0);
    
    const currentDayFinances = finances.filter((finance) => new Date(finance.created_at).toDateString()===currentDay.toDateString()).reverse();

    const firstDayOfPreviousMonth = new Date(currentDay.getFullYear(), currentDay.getMonth() - 1, 1)
    const firstDayOfCurrentMonth = new Date(currentDay.getFullYear(), currentDay.getMonth(), 1);
    const firstDayofNextMonth = new Date(currentDay.getFullYear(), currentDay.getMonth() + 1, 1);
    let nextSunday = Math.abs(7 - currentDay.getDay());
    
    finances?.map((finance)=> {
        let addTime = new Date(new Date(finance.created_at).setHours(0+timeOffset,0,0,0))

        if (addTime.toLocaleTimeString(undefined, {year: '2-digit', month: '2-digit', day: '2-digit'})===currentDay.toLocaleTimeString(undefined, {year: '2-digit', month: '2-digit', day: '2-digit'})){
            if (finance.type == "deduction") {
                dailyFinances -= finance.total;
                dailyDeduction += finance.total;
            }
            else
                dailyFinances += finance.total;
        }
        if (addTime < new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate())
            && addTime > new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate() - 1)) {
            if (finance.type == "deduction") {
                lastDay -= finance.total;
                lastDayDeduction += finance.total;
            }
            else
                lastDay += finance.total;
        }
        if (new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate() + nextSunday) > addTime
            && new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate() - currentDay.getDay()) < addTime) {
            if (finance.type == "deduction") {
                weeklyFinances -= finance.total;
            }
            else
                weeklyFinances += finance.total;
        }
        if (currentDay.getMilliseconds() + (nextSunday * 24 * 60 * 60 * 1000) - (7 * 24 * 60 * 60 * 1000) > addTime.getMilliseconds()
            && currentDay.getMilliseconds() - (currentDay.getDay() * 24 * 60 * 60 * 1000) - (7 * 24 * 60 * 60 * 1000) < addTime.getMilliseconds()) {
            if (finance.type == "deduction") {
                lastWeek -= finance.total;
            }
            else
                lastWeek += finance.total;
        }
        if (new Date(addTime) < firstDayofNextMonth
            && new Date(addTime) >= firstDayOfCurrentMonth) {
            if (finance.type == "deduction") {
                monthlyFinances -= finance.total;
                monthlyDeduction += finance.total;
            }
            else
                monthlyFinances += finance.total;
        }
        if (new Date(addTime) < firstDayOfCurrentMonth
            && new Date(addTime) > firstDayOfPreviousMonth) {
            if (finance.type == "deduction") {
                lastMonth -= finance.total;
                lastMonthDeduction += finance.total;
            }
            else
                lastMonth += finance.total;
        }
        if (addTime.getFullYear() == currentDay.getFullYear()) {
            if (finance.type == "deduction") {
                yearlyFinances -= finance.total;
            }
            else
                yearlyFinances += finance.total;
        }
        if (addTime.getFullYear() == currentDay.getFullYear() - 1) {
            if (finance.type == "deduction") {
                lastYear -= finance.total;
            }
            else
                lastYear += finance.total;
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
    
    const orders = await orderRepo.find();
    if (orders) {
        let monthlyCost = 0;
        let lastMonthCost = 0;
        orders.map((order) => {
            let monthDiff = new Date(order.ordered_at).getMonth() === new Date().getMonth();
            let lastMonthDiff = new Date(order.ordered_at).getMonth() === new Date().getMonth() - 1;
            let yearDiff = new Date(order.ordered_at).getFullYear() === new Date().getFullYear();
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
    
    res.json(finances? {currentDay, tomorrow, finances, currentDayFinances, yearlyFinances, lastYear, lastWeek, lastDay, lastMonth, weeklyFinances, dailyFinances, monthlyFinances, dailyDeduction, lastDayDeduction, monthlyDeduction, lastMonthDeduction, dailyGrowthLoss, dailyGrowthLossSign, weeklyGrowthLoss, weeklyGrowthLossSign, monthlyGrowthLoss, monthlyGrowthLossSign, yearlyGrowthLoss, yearlyGrowthLossSign, dailyDeductionGrowthLoss, dailyDeductionGrowthLossSign, monthlyDeductionGrowthLoss, monthlyDeductionGrowthLossSign, productsRevenue, productsGrowthLoss, productsGrowthLossSign }
    : {message: "حدث خطأ", success: false})
}

const addDeduction = async (req:Request, res:Response)=>{
  const { description, finances } = req.body;
  const cashier_id = req.headers.user_id?.toString().split(' ')[1];
  if (description && finances) {
    const newFinance = receiptRepo.create({ 
        total: parseInt(finances), 
        description, 
        type: "deduction", 
        cashier: {id: cashier_id}
    });
    const finance = await receiptRepo.save(newFinance);
    finance && res.json({ message: "تمت إضافة خصم بنجاح", success: true });
  }
  else
      res.json({ message: "برجاء ملء كل البيانات", success: false });
}

const removeDeduction = async (req:Request, res:Response)=>{
  const { id } = req.params;
  const deduction = await receiptRepo.findOne({ where: { id } });
  if (deduction) {
      const deletedFinance = await receiptRepo.remove(deduction);
      deletedFinance && res.json({ message: "تم حذف الخصم بنجاح", success: true });
  }
  else
      res.json({ message: "حدث خطأ", success: false });
}

const getUsersFinances = async (req:Request, res:Response)=>{
  const users = await userRepo.find();
  const finances = await receiptRepo.find({relations: {cashier: true}});
  if (users && finances) {
    const userFinancesArr:{
        id: string;
        username: string;
        admin: boolean;
        dailyFinances: number;
        monthlyFinances: number;
    }[] = [];

    users.map((user) => {
        let userFinance = {
            id: user.id,
            username: user.username,
            admin: user.admin,
            dailyFinances: 0,
            monthlyFinances: 0,
        };
        
      finances.filter((finance) => finance.cashier.id === user.id).map((finance) => {
        const firstDayOfCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const firstDayofNextMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
        let addTime = new Date(new Date(finance.created_at).setHours(2, 0, 0, 0));
        if (addTime.getDate() == new Date().getDate() && new Date().getMilliseconds() - addTime.getMilliseconds() <= 24 * 60 * 60 * 1000) {
          if (finance.type == "deduction") {
              userFinance.dailyFinances -= finance.total;
          }
          else
            userFinance.dailyFinances += finance.total;
        }
        if (new Date(addTime) < firstDayofNextMonth
          && new Date(addTime) >= firstDayOfCurrentMonth) {
          if (finance.type == "deduction") {
            userFinance.monthlyFinances -= finance.total;
          }
          else
            userFinance.monthlyFinances += finance.total;
        }
      });
      userFinancesArr.push(userFinance);
    });
    res.json({ usersFinances: userFinancesArr });
  }
}

const allFinances = async (req:Request, res:Response)=>{
    const finances = await receiptRepo.find();
    res.json({ finances });
}

export {
    addDeduction,
    removeDeduction,
    allFinances,
    getUsersFinances,
    statisticFinances,
}