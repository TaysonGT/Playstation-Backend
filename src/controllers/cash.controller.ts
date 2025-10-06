import { Response, Request } from "express"
import { myDataSource } from "../app-data-source";
import { CashTransaction } from "../entity/cash-transaction.entity";
import { User } from "../entity/user.entity";
import { Receipt } from "../entity/reciept.entity";
import { CashCollection } from "../entity/cash-collection.entity";

const transactionRepo = myDataSource.getRepository(CashTransaction)
const collectionRepo = myDataSource.getRepository(CashCollection)
const receiptRepo = myDataSource.getRepository(Receipt)
const userRepo = myDataSource.getRepository(User)

export const makeCollection = async(req: Request, res: Response)=>{
    const cashier_id = req.headers.user_id?.toString().split(' ')[1];
    const {amount, description }= req.body;

    const lastCollection = await collectionRepo
    .createQueryBuilder('collection')
    .innerJoinAndSelect('collection.transaction', 'transaction')
    .orderBy('transaction.timestamp', 'DESC')
    .getOne();

    if(lastCollection){
        const currentTime = new Date();
        const timeDifference = currentTime.getTime() - new Date(lastCollection.transaction.timestamp).getTime();
        const minutesDifference = timeDifference / (1000 * 60);
        if(minutesDifference < 5){
            res.json({message: `لا يمكن اجراء عملية تحصيل الآن. برجاء الانتظار ${Math.ceil(5 - minutesDifference)} دقائق`, success: false})
            return;
        }       
    }
    
    if(amount <= 0){
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
    .where('receipts.created_at > :lastCollectionTime', { lastCollectionTime: lastCollection?.transaction.timestamp || new Date(0)})
    .getRawOne();

    const transactions = await transactionRepo
    .createQueryBuilder('transaction')
    .andWhere('transaction.timestamp > :lastCollectionTime', { lastCollectionTime: lastCollection?.transaction.timestamp || new Date(0)})
    .orderBy('transaction.timestamp', 'DESC')
    .getMany();

    const total = transactions.reduce((sum, t)=> sum + t.amount, 0) + (finances.total? parseFloat(finances.total): 0) + (lastCollection?.current_balance || 0);

    if(amount > total){
        res.json({message: "لا يمكن تحصيل مبلغ أكبر من إجمالي المبيعات منذ آخر تحصيل", success: false})
        return;
    }

    const transaction = transactionRepo.create({amount: -amount, type: 'collection', cashier, description})
    await transactionRepo.save(transaction)
    const collection = collectionRepo.create({transaction, current_balance: total-amount})
    await collectionRepo.save(collection)
    res.json({collection, message: "تمت عملية التحصيل بنجاح", success: true})
}

export const currentBalance = async(req: Request, res: Response)=>{
    const lastCollection = await collectionRepo
    .createQueryBuilder('collection')
    .innerJoinAndSelect('collection.transaction', 'transaction')
    .orderBy('transaction.timestamp', 'DESC')
    .getOne();

    const finances = await receiptRepo.createQueryBuilder('receipts')
    .select('SUM(receipts.total)', 'total')
    .where('receipts.created_at > :lastCollectionTime', { lastCollectionTime: lastCollection?.transaction.timestamp || new Date(0)})
    .getRawOne();

    const transactions = await transactionRepo
    .createQueryBuilder('transaction')
    .andWhere('transaction.timestamp > :lastCollectionTime', { lastCollectionTime: lastCollection?.transaction.timestamp || new Date(0)})
    .orderBy('transaction.timestamp', 'DESC')
    .getMany();

    const total = transactions.reduce((sum, t)=> sum + t.amount, 0) + (finances.total? parseFloat(finances.total): 0) + (lastCollection?.current_balance || 0);

    res.json({total, success: true})
}

export const allTransactions = async(req: Request, res: Response)=>{
    const transactions = await transactionRepo
    .createQueryBuilder('transaction')
    .leftJoinAndSelect('transaction.cashier', 'cashier')
    .leftJoinAndSelect('transaction.collection', 'collection')
    .orderBy('transaction.timestamp', 'DESC')
    .getMany()

    res.json({transactions, success: true})
}