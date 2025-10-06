import {Response, Request} from "express"
import { myDataSource } from "../app-data-source";
import { User } from '../entity/user.entity'
import { Order } from '../entity/order.entity'
import { Receipt } from "../entity/reciept.entity";

const userRepo = myDataSource.getRepository(User)
const orderRepo = myDataSource.getRepository(Order)
const receiptRepo = myDataSource.getRepository(Receipt)

const statisticFinances = async (req:Request, res:Response)=>{
    const { user } = req.params;
    const { date } = req.query;

    if(!(date)) {
        res.json({success: false, message: 'No Date or Time Provided'})
        return;
    }
    
    const query = receiptRepo
    .createQueryBuilder('receipts')
    .leftJoinAndSelect('receipts.cashier', 'cashier')
    .leftJoinAndSelect('receipts.time_orders', 'time_orders')
    .leftJoinAndSelect('receipts.orders', 'orders')
    .leftJoinAndSelect('orders.product', 'product')
    
    user!=='all'&& query.where('cashier.id = :id', {id: user})

    const finances = await query.getMany()
    
    let yesterday = 0;
    let today = 0;
    let lastWeek = 0;
    let currentWeek = 0;
    let lastMonth = 0;
    let currentMonth = 0;
    let lastYear = 0;
    let currentYear = 0;

    let todayDeduction = 0;
    let yesterdayDeduction = 0;
    let currentWeekDeduction = 0;
    let lastWeekDeduction = 0;
    let currentMonthDeduction = 0;
    let lastMonthDeduction = 0;
    let currentYearDeduction = 0;
    let lastYearDeduction = 0;

    let todayGrowthLoss = 0;
    let currentWeekGrowthLoss = 0;
    let currentMonthGrowthLoss = 0;
    let currentYearGrowthLoss = 0;

    let currentMonthDeductionGrowthLoss = 0;
    let todayDeductionGrowthLoss = 0;

    let productsRevenue = 0;
    let productsGrowthLoss = 0;

    const todayStart = new Date(date as string)
    const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000)
    const tomorrowStart = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000)
    const currentWeekStart = new Date(new Date(todayStart).setDate(todayStart.getDate()-todayStart.getDay()))
    const lastWeekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000)
    const currentMonthStart = new Date(new Date(todayStart).setFullYear(todayStart.getFullYear(), todayStart.getMonth(), 1))
    const lastMonthStart = new Date(new Date(todayStart).setFullYear(todayStart.getFullYear(), todayStart.getMonth()-1, 1))
    const currentYearStart = new Date(new Date(todayStart).setFullYear(todayStart.getFullYear(), 0, 1))
    const lastYearStart = new Date(new Date(todayStart).setFullYear(todayStart.getFullYear()-1, 0, 1))

    
    const isToday = (dateString:string|Date)=>{
        const date = new Date(dateString)
        return date>=todayStart && date <tomorrowStart
    }

    const isYesterday = (dateString:string|Date)=>{
        const date = new Date(dateString)
        return date>=yesterdayStart && date<todayStart
    }

    const isIncurrentWeek = (dateString:string|Date)=>{
        const date = new Date(dateString)
        return date>=currentWeekStart
    }

    const isInLastWeek = (dateString:string|Date)=>{
        const date = new Date(dateString)
        return date<currentWeekStart && date>=lastWeekStart
    }

    const isInCurrentMonth = (dateString:string|Date)=>{
        const date = new Date(dateString)
        return date>=currentMonthStart
    }

    const isInLastMonth = (dateString:string|Date)=>{
        const date = new Date(dateString)
        return date>=lastMonthStart && date < currentMonthStart
    }

    const isIncurrentYear = (dateString:string|Date)=>{
        const date = new Date(dateString)
        return date>=currentYearStart
    }

    const isInLastYear = (dateString:string|Date)=>{
        const date = new Date(dateString)
        return date>=lastYearStart && date < currentYearStart
    }


    finances?.map(r=>{
        if(isToday(r.created_at)){
            today+=r.total
            if(r.type === 'deduction') todayDeduction+=r.total
        }
        
        if(isYesterday(r.created_at)){
            yesterday += r.total
            if(r.type === 'deduction') yesterdayDeduction+=r.total
        }
        
        if(isIncurrentWeek(r.created_at)){
            currentWeek+=r.total
            if(r.type === 'deduction') currentWeekDeduction+=r.total
        }

        if(isInLastWeek(r.created_at)){
            lastWeek+=r.total
            if(r.type === 'deduction') lastWeekDeduction+=r.total
        }

        if(isInCurrentMonth(r.created_at)){
            currentMonth+=r.total
            if(r.type === 'deduction') currentMonthDeduction+=r.total
        }

        if(isInLastMonth(r.created_at)){
            lastMonth+=r.total
            if(r.type === 'deduction') lastMonthDeduction+=r.total
        }

        if(isIncurrentYear(r.created_at)){
            currentYear+=r.total
            if(r.type === 'deduction') currentYearDeduction+=r.total
        }

        if(isInLastYear(r.created_at)){
            lastYear+=r.total
            if(r.type === 'deduction') lastYearDeduction+=r.total
        }

    })

    
    todayGrowthLoss = Math.round(((today - yesterday) / yesterday) * 100);
    currentWeekGrowthLoss = Math.round(((currentWeek - lastWeek) / lastWeek) * 100);
    currentMonthGrowthLoss = Math.round(((currentMonth - lastMonth) / lastMonth) * 100);
    currentYearGrowthLoss = Math.round(((currentYear - lastYear) / lastYear) * 100);
    todayDeductionGrowthLoss = Math.round(((todayDeduction - yesterdayDeduction) / yesterdayDeduction) * 100);
    currentMonthDeductionGrowthLoss = Math.round(((currentMonthDeduction - lastMonthDeduction) / lastMonthDeduction) * 100);
    
    console.log({yesterday, today, todayGrowthLoss, currentWeek, lastWeek, currentWeekGrowthLoss, currentMonth, lastMonth, currentMonthGrowthLoss, currentYear, currentYearGrowthLoss})
    console.log({calc: (today-yesterday)/yesterday})
    const orders = await orderRepo.find();
    if (orders) {
        let currentMonthCost = 0;
        let lastMonthCost = 0;
        orders.map((order) => {
            let monthDiff = new Date(order.ordered_at).getMonth() === new Date().getMonth();
            let lastMonthDiff = new Date(order.ordered_at).getMonth() === new Date().getMonth() - 1;
            let yearDiff = new Date(order.ordered_at).getFullYear() === new Date().getFullYear();
            if (monthDiff && yearDiff) {
                currentMonthCost += order.cost;
            }
            else if (lastMonthDiff && yearDiff) {
                lastMonthCost += order.cost;
            }
        });
        productsRevenue = currentMonthCost;
        productsGrowthLoss = Math.floor(Math.abs(currentMonthCost - lastMonthCost) / lastMonthCost * 100);
    }
    
    res.json(finances? {finances, today, currentWeek, currentMonth, currentYear, todayDeduction, currentWeekDeduction, currentMonthDeduction, currentYearDeduction, todayGrowthLoss, currentWeekGrowthLoss, currentMonthGrowthLoss, currentYearGrowthLoss, todayDeductionGrowthLoss, currentMonthDeductionGrowthLoss, productsRevenue, productsGrowthLoss}
    : {message: "حدث خطأ", success: false})
}

const addDeduction = async (req:Request, res:Response)=>{
  const { description, finances } = req.body;
  const cashier_id = req.headers.user_id?.toString().split(' ')[1];
  const cashier = await userRepo.findOne({ where: { id: cashier_id } })
  
  if(!cashier){
    res.json({success:false, message: 'User not found'})
    return
  }

  if (description && finances) {
    const finance = receiptRepo.create({ 
        total: -parseInt(finances), 
        description, 
        type: "deduction", 
        cashier
    });
    await receiptRepo.save(finance);
    res.json({ message: "تمت إضافة خصم بنجاح", success: true });
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
        role: 'admin'|'employee';
        todayFinances: number;
        currentMonthFinances: number;
    }[] = [];

    users.map((user) => {
        let userFinance = {
            id: user.id,
            username: user.username,
            role: user.role,
            todayFinances: 0,
            currentMonthFinances: 0,
        };
        
      finances.filter((finance) => finance.cashier.id === user.id).map((finance) => {
        const firstDayOfCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const firstDayofNextMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
        let addTime = new Date(new Date(finance.created_at).setHours(2, 0, 0, 0));
        if (addTime.getDate() == new Date().getDate() && new Date().getMilliseconds() - addTime.getMilliseconds() <= 24 * 60 * 60 * 1000) {
          if (finance.type == "deduction") {
              userFinance.todayFinances -= finance.total;
          }
          else
            userFinance.todayFinances += finance.total;
        }
        if (new Date(addTime) < firstDayofNextMonth
          && new Date(addTime) >= firstDayOfCurrentMonth) {
          if (finance.type == "deduction") {
            userFinance.currentMonthFinances -= finance.total;
          }
          else
            userFinance.currentMonthFinances += finance.total;
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