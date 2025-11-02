import { Response, Request } from "express"
import { myDataSource } from "../app-data-source";
import { User } from "../entity/user.entity";
import { Receipt } from "../entity/reciept.entity";
import { CashCollection } from "../entity/cash-collection.entity";
import { AuthRequest } from "../middleware/auth.middleware";

const collectionRepo = myDataSource.getRepository(CashCollection)
const receiptRepo = myDataSource.getRepository(Receipt)
const userRepo = myDataSource.getRepository(User)

export const makeCollection = async(req: AuthRequest, res: Response)=>{
    const {amount_collected, notes, cash_counted }= req.body;

    const lastCollection = await collectionRepo
    .createQueryBuilder('collection')
    .orderBy('collection.timestamp', 'DESC')
    .getOne();

    if(lastCollection){
        const currentTime = new Date();
        const timeDifference = currentTime.getTime() - new Date(lastCollection.timestamp).getTime();
        const minutesDifference = timeDifference / (1000 * 60);
        if(minutesDifference < 5){
            res.json({message: `لا يمكن اجراء عملية تحصيل الآن. برجاء الانتظار ${Math.ceil(5 - minutesDifference)} دقائق`, success: false})
            return;
        }       
    }
    
    if(amount_collected <= 0){
        res.json({message: "برجاء ادخال كل البيانات بشكل صحيح", success: false})
        return;
    }

    const cashier = req.user
    
    if (!cashier) {
        res.json({ success: false, message: "مستخدم غير موجود" })
        return;
    }

    const finances = await receiptRepo.createQueryBuilder('receipts')
    .select('SUM(receipts.total)', 'total')
    .where('receipts.created_at > :lastCollectionTime', { lastCollectionTime: lastCollection?.timestamp || new Date(0)})
    .getRawOne();

    const expected_cash = (finances.total? parseFloat(finances.total): 0) + (lastCollection?.float_remaining || 0);

    const cash_over_short = cash_counted-expected_cash

    if(amount_collected > expected_cash+cash_over_short){
        res.json({message: "المبلغ المطلوب سحبه غير متوفر", success: false})
        return;
    }

    const collection = collectionRepo.create({
        starting_float_amount: lastCollection?.float_remaining || 0,
        notes,
        cash_counted,
        expected_cash,
        amount_collected,
        cash_over_short,
        float_remaining: cash_counted-amount_collected,
        collected_by: {id: cashier.id}
    })
    await collectionRepo.save(collection)
    res.json({collection, message: "تمت عملية التحصيل بنجاح", success: true})
}

export const currentBalance = async(req: Request, res: Response)=>{
    const lastCollection = await collectionRepo
    .createQueryBuilder('collection')
    .orderBy('collection.timestamp', 'DESC')
    .getOne();

    const finances = await receiptRepo.createQueryBuilder('receipts')
    .select('SUM(receipts.total)', 'total')
    .where('receipts.created_at > :lastCollectionTime', { lastCollectionTime: lastCollection?.timestamp || new Date(0)})
    .getRawOne();

    const total = (finances.total? parseFloat(finances.total): 0) + (lastCollection?.float_remaining || 0);

    res.json({total, lastCollection, success: true})
}

export const cashReport = async(req: Request, res: Response)=>{
    const lastCollection = await collectionRepo
    .createQueryBuilder('collection')
    .orderBy('collection.timestamp', 'DESC')
    .getOne();

    const finances = await receiptRepo.createQueryBuilder('receipts')
    .select('SUM(receipts.total)', 'total')
    .where('receipts.created_at > :lastCollectionTime', { lastCollectionTime: lastCollection?.timestamp || new Date(0)})
    .getRawOne();

    const total = (finances.total? parseFloat(finances.total): 0) + (lastCollection?.float_remaining || 0);

    const employeesRevenue = await userRepo.createQueryBuilder('user')
    .leftJoinAndSelect('user.receipts', 'receipts', 'receipts.created_at > :lastCollectionTime', { lastCollectionTime: lastCollection?.timestamp || new Date(0)})
    .select('user.id', 'id')
    .addSelect('user.username', 'username')
    .addSelect('MIN(receipts.created_at)', 'firstReceipt')
    .addSelect('SUM(receipts.total)', 'total')
    .groupBy('user.id')
    .orderBy('firstReceipt', 'ASC')
    .getRawMany();

    const resultWithISO = employeesRevenue.map(employee => ({
        ...employee,
        firstReceipt: employee.firstReceipt ? new Date(employee.firstReceipt+'Z').toISOString() : null
    }));

    res.json({total, lastCollection, employeesRevenue: resultWithISO, success: true})
}

export const collectionsList = async(req: Request, res: Response)=>{
    const {page=1, limit=10} = req.query;

    const [collections, total] = await collectionRepo
    .createQueryBuilder('collection')
    .leftJoinAndSelect('collection.collected_by', 'collected_by')
    .orderBy('collection.timestamp', 'DESC')
    .take((Number(page)-1)*Number(limit))
    .limit(Number(limit))
    .getManyAndCount();

    res.json({collections, total, success: true})
}