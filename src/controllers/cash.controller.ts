import { Response, Request } from "express"
import { myDataSource } from "../app-data-source";
import { User } from "../entity/user.entity";
import { Receipt } from "../entity/reciept.entity";
import { CashCollection } from "../entity/cash-collection.entity";

const collectionRepo = myDataSource.getRepository(CashCollection)
const receiptRepo = myDataSource.getRepository(Receipt)
const userRepo = myDataSource.getRepository(User)

export const makeCollection = async(req: Request, res: Response)=>{
    const cashier_id = req.headers.user_id?.toString().split(' ')[1];
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

    const cashier = await userRepo.findOne({ where: { id: cashier_id } })
    
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

    res.json({total, lastCollection: lastCollection?.timestamp, success: true})
}