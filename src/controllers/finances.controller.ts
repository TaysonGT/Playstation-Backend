import {Response, Request} from "express"
import { myDataSource } from "../app-data-source";
import { User } from '../entity/user.entity'
import { Order } from '../entity/order.entity'
import { Receipt } from "../entity/reciept.entity";
import { TimeOrder } from "../entity/time-order.entity";
import { Product } from "../entity/product.entity";

const userRepo = myDataSource.getRepository(User)
const orderRepo = myDataSource.getRepository(Order)
const receiptRepo = myDataSource.getRepository(Receipt)
const productRepo = myDataSource.getRepository(Product)
const timeOrderRepo = myDataSource.getRepository(TimeOrder)

const getDaysList = (date: Date)=>{
    const year = date.getFullYear()
    const month = date.getMonth()
    const currentDate = new Date(year, month, 1)
    const days:string[] = []

    
    while (currentDate.getMonth() === month) {
        if(currentDate>new Date()){
            break;
        }

        days.push(currentDate.toISOString())
        currentDate.setDate(currentDate.getDate()+1)
    }

    return days;
}

const getMonthsList = (date: Date)=>{
    const year = date.getFullYear()
    const currentDate = new Date(year, 0, 1)
    const months:string[] = []

    while (currentDate.getFullYear() === year) {
        if(currentDate>new Date()){
            break;
        }
        months.push(currentDate.toISOString())
        currentDate.setMonth(currentDate.getMonth()+1)
    }

    return months;
}

const getMonthDays = (month: number, year: number)=>{
    if(new Date(year,month+1,0)>new Date()){
        return new Date().getDate()
    }
    return new Date(year,month+1,0).getDate()
}

const getYearMonths = (year: number)=>{
    if(new Date(year+1,1,0)>new Date()){
        return new Date().getMonth()+1
    }
    return new Date(year+1,1,0).getMonth()+1
}

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
    // let lastWeekDeduction = 0;
    let currentMonthDeduction = 0;
    let lastMonthDeduction = 0;
    let currentYearDeduction = 0;
    // let lastYearDeduction = 0;

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
            // if(r.type === 'deduction') todayDeduction+=r.total
        }
        
        if(isYesterday(r.created_at)){
            yesterday += r.total
            // if(r.type === 'deduction') yesterdayDeduction+=r.total
        }
        
        if(isIncurrentWeek(r.created_at)){
            currentWeek+=r.total
            // if(r.type === 'deduction') currentWeekDeduction+=r.total
        }

        if(isInLastWeek(r.created_at)){
            lastWeek+=r.total
            // if(r.type === 'deduction') lastWeekDeduction+=r.total
        }

        if(isInCurrentMonth(r.created_at)){
            currentMonth+=r.total
            // if(r.type === 'deduction') currentMonthDeduction+=r.total
        }

        if(isInLastMonth(r.created_at)){
            lastMonth+=r.total
            // if(r.type === 'deduction') lastMonthDeduction+=r.total
        }

        if(isIncurrentYear(r.created_at)){
            currentYear+=r.total
            // if(r.type === 'deduction') currentYearDeduction+=r.total
        }

        if(isInLastYear(r.created_at)){
            lastYear+=r.total
            // if(r.type === 'deduction') lastYearDeduction+=r.total
        }

    })
    
    todayGrowthLoss = Math.round(((today - yesterday) / yesterday) * 100);
    currentWeekGrowthLoss = Math.round(((currentWeek - lastWeek) / lastWeek) * 100);
    currentMonthGrowthLoss = Math.round(((currentMonth - lastMonth) / lastMonth) * 100);
    currentYearGrowthLoss = Math.round(((currentYear - lastYear) / lastYear) * 100);
    todayDeductionGrowthLoss = Math.round(((todayDeduction - yesterdayDeduction) / yesterdayDeduction) * 100);
    currentMonthDeductionGrowthLoss = Math.round(((currentMonthDeduction - lastMonthDeduction) / lastMonthDeduction) * 100);
    

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
            userFinance.todayFinances += finance.total;
        }
        if (new Date(addTime) < firstDayofNextMonth
          && new Date(addTime) >= firstDayOfCurrentMonth) {
            userFinance.currentMonthFinances += finance.total;
        }
      });
      userFinancesArr.push(userFinance);
    });
    res.json({ usersFinances: userFinancesArr });
  }
}

const revenueByPeriod = async (req:Request, res:Response)=>{
    const {period='monthly', date=new Date().toISOString()} = req.query

    const receipts = await receiptRepo.find()

    const previousReceipts = receipts.filter(t=>
        period==='monthly'?
            new Date(t.created_at) < new Date(new Date(date as string).getFullYear(), new Date(date as string).getMonth(), 1) &&
            new Date(t.created_at) >= new Date(new Date(date as string).getFullYear(), new Date(date as string).getMonth()-1, 1)
        :
            new Date(t.created_at) < new Date(new Date(date as string).getFullYear(), 0, 1) &&
            new Date(t.created_at) >= new Date(new Date(date as string).getFullYear()-1, 0, 1)
    )
    
    const currentReceipts = receipts.filter(t=>
        period==='monthly'?
            new Date(t.created_at).getMonth()===new Date(date as string).getMonth()&&
            new Date(t.created_at).getFullYear()===new Date(date as string).getFullYear()
        : new Date(t.created_at).getFullYear()===new Date(date as string).getFullYear()
    )
    
    const previousTotalSession = previousReceipts.filter(r=>r.type==='session').reduce((a,receipt)=>receipt.total+a,0)
    const previousTotalOuter = previousReceipts.filter(r=>r.type==='outer').reduce((a,receipt)=>receipt.total+a,0)
    const previousTotal = previousReceipts.reduce((a,receipt)=>receipt.total+a,0)

    const totalSession = currentReceipts.filter(r=>r.type==='session').reduce((a,receipt)=>receipt.total+a,0)
    const totalOuter = currentReceipts.filter(r=>r.type==='outer').reduce((a,receipt)=>receipt.total+a,0)
    const total = currentReceipts.reduce((a,receipt)=>receipt.total+a,0)

    const growthLoss = previousTotal? Math.round((total-previousTotal)*100/previousTotal) : 0
    const growthLossSession = previousTotalSession? Math.round((totalSession-previousTotalSession)*100/previousTotalSession) : 0
    const growthLossOuter = previousTotalOuter? Math.round((totalOuter-previousTotalOuter)*100/previousTotalOuter) : 0

    const datesList = period === 'monthly'?
        getDaysList(new Date(date as string))
        : getMonthsList(new Date(date as string))

    const data = datesList.map((date)=>{
        const sales = receipts.filter((receipt)=>
            period === 'monthly' ?
                new Date(receipt.created_at).getDate()===new Date(date).getDate()&&
                new Date(receipt.created_at).getMonth()===new Date(date).getMonth()&&
                new Date(receipt.created_at).getFullYear()===new Date(date).getFullYear()
            : 
                new Date(receipt.created_at).getMonth()===new Date(date).getMonth()&&
                new Date(receipt.created_at).getFullYear()===new Date(date).getFullYear()
            
        ).reduce((a,receipt)=>a+receipt.total,0)
        return {date, sales}
    })
    res.json({success:true, total, growthLoss, totalOuter, growthLossOuter, totalSession, growthLossSession, data})
}

const productsRevenue = async (req:Request, res:Response)=>{
    const {period='monthly', date=new Date().toISOString()} = req.query

    const products = await productRepo.createQueryBuilder('products')
    .innerJoinAndSelect('products.orders', 'orders')
    .innerJoinAndSelect('orders.receipt', 'receipt')
    .getMany()

    const ordersTotal = products.flatMap(product=>product.orders).filter(order=>
        period==='monthly'?
            new Date(order.receipt.created_at).getMonth()===new Date(date as string).getMonth()&&
            new Date(order.receipt.created_at).getFullYear()===new Date(date as string).getFullYear()
        : new Date(order.receipt.created_at).getFullYear()===new Date(date as string).getFullYear()
    ).reduce((total,order)=>total+order.cost,0) 

    const productsRevenue = products.map((product)=>{
        const sales = product.orders.filter(order=>
            period==='monthly'?
                new Date(order.receipt.created_at).getMonth()===new Date(date as string).getMonth()&&
                new Date(order.receipt.created_at).getFullYear()===new Date(date as string).getFullYear()
            : new Date(order.receipt.created_at).getFullYear()===new Date(date as string).getFullYear()
        ).reduce((total,order)=>total+order.cost,0)
        return {
            product: product.name, 
            sales,
            percent: parseFloat((sales*100/ordersTotal).toFixed(1))
        }
    }).filter(product=>product.sales>0).sort((a,b)=>b.sales-a.sales)

    const previousTotal = products.flatMap(p=>p.orders).filter(order=>
        period==='monthly'?
            new Date(order.receipt.created_at) < new Date(new Date(date as string).getFullYear(), new Date(date as string).getMonth(), 1) &&
            new Date(order.receipt.created_at) >= new Date(new Date(date as string).getFullYear(), new Date(date as string).getMonth()-1, 1)
            :
            new Date(order.receipt.created_at) < new Date(new Date(date as string).getFullYear(), 0, 1) &&
            new Date(order.receipt.created_at) >= new Date(new Date(date as string).getFullYear()-1, 0, 1)
    ).reduce((total,order)=>total+order.cost,0)

    const total = productsRevenue.reduce((total,product)=>total+product.sales,0)

    const growthLoss = previousTotal? Math.round((total-previousTotal)*100/(previousTotal)) : 0

    const datesList = period ==='monthly'? 
        getDaysList(new Date(date as string))
        : getMonthsList(new Date(date as string))

    const data = datesList.map((date)=>{
        const sales = products.flatMap(product=>product.orders).filter((order)=>
            period === 'monthly' ?
                new Date(order.receipt.created_at).getDate()===new Date(date).getDate()&&
                new Date(order.receipt.created_at).getMonth()===new Date(date).getMonth()&&
                new Date(order.receipt.created_at).getFullYear()===new Date(date).getFullYear()
            : 
                new Date(order.receipt.created_at).getMonth()===new Date(date).getMonth()&&
                new Date(order.receipt.created_at).getFullYear()===new Date(date).getFullYear()
        ).reduce((a,order)=>a+order.cost,0)
        return {date, sales}
    })
    res.json({success:true, total, growthLoss, data, productsList: productsRevenue})
}

const playingRevenue = async (req:Request, res:Response)=>{
    const {period='monthly', date=new Date().toISOString()} = req.query

    const time_orders = await timeOrderRepo.createQueryBuilder('timeOrders')
    .innerJoin('timeOrders.receipt', 'receipt')
    .getMany()
    
    const previousPlayingRevenue = time_orders.filter(t=>
        period==='monthly'?
        new Date(t.ended_at) < new Date(new Date(date as string).getFullYear(), new Date(date as string).getMonth(), 1) &&
        new Date(t.ended_at) >= new Date(new Date(date as string).getFullYear(), new Date(date as string).getMonth()-1, 1)
        :
        new Date(t.ended_at) < new Date(new Date(date as string).getFullYear(), 0, 1) &&
        new Date(t.ended_at) >= new Date(new Date(date as string).getFullYear()-1, 0, 1)
    ).reduce((total,order)=>order.cost+total,0)
    
    const currentTimeOrders = time_orders.filter(t=>
        period==='monthly'?
            new Date(t.ended_at).getMonth()===new Date(date as string).getMonth()&&
            new Date(t.ended_at).getFullYear()===new Date(date as string).getFullYear()
        : new Date(t.ended_at).getFullYear()===new Date(date as string).getFullYear()
    )
    
    const currentPlayingRevenue = currentTimeOrders.reduce((total,order)=>order.cost+total,0)
    const totalTime = currentTimeOrders.reduce((total,order)=>(new Date(order.ended_at).getTime() - new Date(order.started_at).getTime())+total,0)
    const hours = Math.round(totalTime / (1000 * 60 * 60))

    const growthLoss = previousPlayingRevenue? Math.round((currentPlayingRevenue-previousPlayingRevenue)*100/(previousPlayingRevenue)) : 0

    const datesList = period === 'monthly'? 
        getDaysList(new Date(date as string))
        :getMonthsList(new Date(date as string))

    const data = datesList.map((date)=>{
        const sales = currentTimeOrders.filter(t=>
            period === 'monthly'?
            new Date(t.ended_at).getDate()===new Date(date).getDate()&&
            new Date(t.ended_at).getMonth()===new Date(date).getMonth()&&
            new Date(t.ended_at).getFullYear()===new Date(date).getFullYear()
            : 
            new Date(t.ended_at).getMonth()===new Date(date).getMonth()&&
            new Date(t.ended_at).getFullYear()===new Date(date).getFullYear()
        ).reduce((total,order)=>order.cost+total,0)

        return {date, sales}
    })
    res.json({success:true, total: currentPlayingRevenue, hours, growthLoss, data})
}


const allFinances = async (req:Request, res:Response)=>{
    const finances = await receiptRepo.find();
    res.json({ finances });
}

const receiptsRevenue = async (req:Request, res:Response)=>{
    const receipts = await receiptRepo.find()
    res.json({receipts})
}

const collectiveRevenue = async (req:Request, res:Response)=>{
    const {period='monthly', date=new Date().toISOString()} = req.query

    const receipts = await receiptRepo.find()

    const previousReceipts = receipts.filter(t=>
        period==='monthly'?
            new Date(t.created_at) < new Date(new Date(date as string).getFullYear(), new Date(date as string).getMonth(), 1) &&
            new Date(t.created_at) >= new Date(new Date(date as string).getFullYear(), new Date(date as string).getMonth()-1, 1)
        :
            new Date(t.created_at) < new Date(new Date(date as string).getFullYear(), 0, 1) &&
            new Date(t.created_at) >= new Date(new Date(date as string).getFullYear()-1, 0, 1)
    )
    
    const currentReceipts = receipts.filter(t=>
        period==='monthly'?
            new Date(t.created_at).getMonth()===new Date(date as string).getMonth()&&
            new Date(t.created_at).getFullYear()===new Date(date as string).getFullYear()
        : new Date(t.created_at).getFullYear()===new Date(date as string).getFullYear()
    )

    const products = await productRepo.createQueryBuilder('products')
    .innerJoinAndSelect('products.orders', 'orders')
    .innerJoinAndSelect('orders.receipt', 'receipt')
    .getMany()

    const productsRevenue = products.map((product)=>({
        product: product.name, 
        sales: product.orders.filter(t=>
            period==='monthly'?
                new Date(t.ordered_at).getMonth()===new Date(date as string).getMonth()&&
                new Date(t.ordered_at).getFullYear()===new Date(date as string).getFullYear()
            : new Date(t.ordered_at).getFullYear()===new Date(date as string).getFullYear()
        ).reduce((total,order)=>total+order.cost,0)
    })).sort((a,b)=>b.sales-a.sales)

    const time_orders = await timeOrderRepo
    .createQueryBuilder('timeOrders')
    .innerJoinAndSelect('timeOrders.receipt', 'receipt')
    .getMany()
    
    const previousPlaying = time_orders.filter(timeOrder=>
        period==='monthly'?
        new Date(timeOrder.receipt.created_at) < new Date(new Date(date as string).getFullYear(), new Date(date as string).getMonth(), 1) &&
        new Date(timeOrder.receipt.created_at) >= new Date(new Date(date as string).getFullYear(), new Date(date as string).getMonth()-1, 1)
        :
        new Date(timeOrder.receipt.created_at) < new Date(new Date(date as string).getFullYear(), 0, 1) &&
        new Date(timeOrder.receipt.created_at) >= new Date(new Date(date as string).getFullYear()-1, 0, 1)
    ).reduce((total,order)=>order.cost+total,0)
    
    const currentTimeOrders = time_orders.filter(timeOrder=>
        period==='monthly'?
            new Date(timeOrder.receipt.created_at).getMonth()===new Date(date as string).getMonth()&&
            new Date(timeOrder.receipt.created_at).getFullYear()===new Date(date as string).getFullYear()
        : new Date(timeOrder.receipt.created_at).getFullYear()===new Date(date as string).getFullYear()
    )
    
    const previousProductsTotal = products.flatMap(p=>p.orders).filter((order)=>
        period==='monthly'?
            new Date(order.receipt.created_at) < new Date(new Date(date as string).getFullYear(), new Date(date as string).getMonth(), 1) &&
            new Date(order.receipt.created_at) >= new Date(new Date(date as string).getFullYear(), new Date(date as string).getMonth()-1, 1)
            :
            new Date(order.receipt.created_at) < new Date(new Date(date as string).getFullYear(), 0, 1) &&
            new Date(order.receipt.created_at) >= new Date(new Date(date as string).getFullYear()-1, 0, 1)
    ).reduce((total,order)=>total+order.cost,0)

    const previousTotalSession = previousReceipts.filter(r=>r.type==='session').reduce((a,receipt)=>receipt.total+a,0)
    const previousTotalOuter = previousReceipts.filter(r=>r.type==='outer').reduce((a,receipt)=>receipt.total+a,0)
    const previousTotal = previousReceipts.reduce((a,receipt)=>receipt.total+a,0)
    
    const totalSession = currentReceipts.filter(r=>r.type==='session').reduce((a,receipt)=>receipt.total+a,0)
    const totalOuter = currentReceipts.filter(r=>r.type==='outer').reduce((a,receipt)=>receipt.total+a,0)
    const total = currentReceipts.reduce((total,receipt)=>receipt.total+total,0)
    const totalPlaying = currentTimeOrders.reduce((total,order)=>order.cost+total,0)
    const totalProducts = productsRevenue.reduce((total,product)=>total+product.sales,0)
    const totalTime = currentTimeOrders.reduce((total,order)=>(new Date(order.ended_at).getTime() - new Date(order.started_at).getTime())+total,0)
    const hours = Math.round(totalTime / (1000 * 60 * 60))

    let playingGrowthLoss = previousPlaying? Math.round((totalPlaying-previousPlaying)*100/(previousPlaying)) : 0
    let productsGrowthLoss = previousProductsTotal? Math.round((totalProducts-previousProductsTotal)*100/(previousProductsTotal)) : 0
    let totalGrowthLoss = previousTotal? Math.round((total-previousTotal)*100/previousTotal) : 0
    let sessionsGrowthLoss = previousTotalSession? Math.round((totalSession-previousTotalSession)*100/previousTotalSession) : 0
    let outerGrowthLoss = previousTotalOuter? Math.round((totalOuter-previousTotalOuter)*100/previousTotalOuter) : 0
    
    
    if(period==='monthly'){
        const previousMonthDays = getMonthDays(new Date(date as string).getMonth()-1, new Date(date as string).getFullYear())
        const thisMonthDays = getMonthDays(new Date(date as string).getMonth(), new Date(date as string).getFullYear())
        
        const playingDailyRatio = previousPlaying/previousMonthDays
        const productsDailyRatio = previousProductsTotal/previousMonthDays
        const totalDailyRatio = previousTotal/previousMonthDays
        const sessionsDailyRatio = previousTotalSession/previousMonthDays
        const outerDailyRatio = previousTotalOuter/previousMonthDays
        
        const estimatedPlaying = playingDailyRatio * thisMonthDays
        const estimatedProducts = productsDailyRatio * thisMonthDays
        const estimatedTotal = totalDailyRatio * thisMonthDays
        const estimatedSessions = sessionsDailyRatio * thisMonthDays
        const estimatedOuter = outerDailyRatio * thisMonthDays
        
        playingGrowthLoss = previousPlaying? Math.round((totalPlaying-estimatedPlaying)*100/estimatedPlaying) : 0
        productsGrowthLoss = previousProductsTotal? Math.round((totalProducts-estimatedProducts)*100/estimatedProducts) : 0
        totalGrowthLoss = previousTotal? Math.round((total-estimatedTotal)*100/estimatedTotal) : 0
        sessionsGrowthLoss = previousTotalSession? Math.round((totalSession-estimatedSessions)*100/estimatedSessions) : 0
        outerGrowthLoss = previousTotalOuter? Math.round((totalOuter-estimatedOuter)*100/estimatedOuter) : 0
    }else{
        const thisYearMonths = getYearMonths(new Date(date as string).getFullYear())

        const playingMonthlyRatio = previousPlaying/12
        const productsMonthlyRatio = previousProductsTotal/12
        const totalMonthlyRatio = previousTotal/12
        const sessionsMonthlyRatio = previousTotalSession/12
        const outerMonthlyRatio = previousTotalOuter/12

        const estimatedPlaying = playingMonthlyRatio * thisYearMonths
        const estimatedProducts = productsMonthlyRatio * thisYearMonths
        const estimatedTotal = totalMonthlyRatio * thisYearMonths
        const estimatedSessions = sessionsMonthlyRatio * thisYearMonths
        const estimatedOuter = outerMonthlyRatio * thisYearMonths
        
        playingGrowthLoss = previousPlaying? Math.round((totalPlaying-estimatedPlaying)*100/estimatedPlaying) : 0
        productsGrowthLoss = previousProductsTotal? Math.round((totalProducts-estimatedProducts)*100/estimatedProducts) : 0
        totalGrowthLoss = previousTotal? Math.round((total-estimatedTotal)*100/estimatedTotal) : 0
        sessionsGrowthLoss = previousTotalSession? Math.round((totalSession-estimatedSessions)*100/estimatedSessions) : 0
        outerGrowthLoss = previousTotalOuter? Math.round((totalOuter-estimatedOuter)*100/estimatedOuter) : 0
    }

    const datesList = period === 'monthly'?
        getDaysList(new Date(date as string))
        : getMonthsList(new Date(date as string))

    const data = datesList.map((date)=>{
        const total = receipts.filter((receipt)=>
            period === 'monthly' ?
                new Date(receipt.created_at).getDate()===new Date(date).getDate()&&
                new Date(receipt.created_at).getMonth()===new Date(date).getMonth()&&
                new Date(receipt.created_at).getFullYear()===new Date(date).getFullYear()
            : 
                new Date(receipt.created_at).getMonth()===new Date(date).getMonth()&&
                new Date(receipt.created_at).getFullYear()===new Date(date).getFullYear()
            
        ).reduce((total,receipt)=>total+receipt.total,0)

        const playing = currentTimeOrders.filter(t=>
            period === 'monthly'?
            new Date(t.receipt.created_at).getDate()===new Date(date).getDate()&&
            new Date(t.receipt.created_at).getMonth()===new Date(date).getMonth()&&
            new Date(t.receipt.created_at).getFullYear()===new Date(date).getFullYear()
            : 
            new Date(t.receipt.created_at).getMonth()===new Date(date).getMonth()&&
            new Date(t.receipt.created_at).getFullYear()===new Date(date).getFullYear()
        ).reduce((total,order)=>order.cost+total,0)

        const productsRevenue = products.flatMap(products=>products.orders).filter((order)=>
            period === 'monthly' ?
                new Date(order.receipt.created_at).getDate()===new Date(date).getDate()&&
                new Date(order.receipt.created_at).getMonth()===new Date(date).getMonth()&&
                new Date(order.receipt.created_at).getFullYear()===new Date(date).getFullYear()
            : 
                new Date(order.receipt.created_at).getMonth()===new Date(date).getMonth()&&
                new Date(order.receipt.created_at).getFullYear()===new Date(date).getFullYear()
        ).reduce((a,order)=>a+order.cost,0)

        return {date, total, playing, products: productsRevenue}
    })

    res.json({
        success:true, 
        total, 
        totalProducts, 
        totalPlaying, 
        totalOuter, 
        totalSession, 
        hours, 
        totalGrowthLoss, 
        outerGrowthLoss, 
        sessionsGrowthLoss, 
        productsGrowthLoss, 
        playingGrowthLoss, 
        data
    })
}

const employeesRevenue = async (req:Request, res:Response)=>{
    const {period='monthly', date=new Date().toISOString()} = req.query

    const cashiers = await userRepo.createQueryBuilder('cashiers')
    .leftJoinAndSelect('cashiers.receipts', 'receipts')
    .getMany()

    const total = cashiers.flatMap(cashier=> cashier.receipts).filter((receipt)=>
        period === 'monthly' ?
            new Date(receipt.created_at).getMonth()===new Date(date as string).getMonth()&&
            new Date(receipt.created_at).getFullYear()===new Date(date as string).getFullYear()
        : 
            new Date(receipt.created_at).getFullYear()===new Date(date as string).getFullYear()
    ).reduce((total, receipt)=> total+receipt.total,0)

    const usersRevenue = cashiers.map((cashier)=>{
        const revenue = cashier.receipts.filter((receipt)=>
            period === 'monthly' ?
                new Date(receipt.created_at).getMonth()===new Date(date as string).getMonth()&&
                new Date(receipt.created_at).getFullYear()===new Date(date as string).getFullYear()
            : 
                new Date(receipt.created_at).getFullYear()===new Date(date as string).getFullYear()
        ).reduce((total, receipt)=> total+receipt.total,0)

        const previousRevenue = cashier.receipts.filter((receipt)=>
            period==='monthly'?
            new Date(receipt.created_at) < new Date(new Date(date as string).getFullYear(), new Date(date as string).getMonth(), 1) &&
            new Date(receipt.created_at) >= new Date(new Date(date as string).getFullYear(), new Date(date as string).getMonth()-1, 1)
            :
            new Date(receipt.created_at) < new Date(new Date(date as string).getFullYear(), 0, 1) &&
            new Date(receipt.created_at) >= new Date(new Date(date as string).getFullYear()-1, 0, 1)
        ).reduce((total, receipt)=> total+receipt.total,0)
        
        let growthLoss = 0
        if(period==='monthly'){
            const thisMonthDays = getMonthDays(new Date(date as string).getMonth(), new Date(date as string).getFullYear())
            const previousMonthDays = getMonthDays(new Date(date as string).getMonth()-1, new Date(date as string).getFullYear())
            
            const dailyRatio = previousRevenue/previousMonthDays
            const estimatedRevenue = dailyRatio * thisMonthDays
            growthLoss = previousRevenue? Math.round((revenue-estimatedRevenue)*100/estimatedRevenue) : 0
        }else{
            const thisYearMonths = getYearMonths(new Date(date as string).getFullYear())
            const monthlyRatio = previousRevenue/12
            const estimatedRevenue = monthlyRatio * thisYearMonths
            growthLoss = previousRevenue? Math.round((revenue-estimatedRevenue)*100/estimatedRevenue) : 0
        }

        const percent = parseFloat((revenue*100/total).toFixed(1))
        
        return {
            cashier: cashier.username,
            revenue,
            growthLoss, 
            percent
        }
    }).sort((a,b)=>b.revenue-a.revenue)
    
    res.json({success: true, usersRevenue, employeesList: usersRevenue})
}

export {
    removeDeduction,
    collectiveRevenue,
    allFinances,
    getUsersFinances,
    statisticFinances,
    playingRevenue,
    productsRevenue,
    revenueByPeriod,
    receiptsRevenue,
    employeesRevenue
}