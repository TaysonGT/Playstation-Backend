import {Response, Request} from "express"
import { myDataSource } from "../app-data-source";

import { addDeviceDto } from "../dto/add-device.dto";
import { addFinanceDto } from "../dto/add-finances.dto";
import { timeDto } from "../dto/time-order.dto";

import { Device } from "../entity/device.entity";
import { Order } from "../entity/order.entity";
import { Finance } from '../entity/finances.entity';
import { TimeOrder } from "../entity/time-order.entity";
import { Session } from '../entity/session.entity';
import { DeviceType } from "../entity/device-type.entity";
import { TimeReceipt } from '../entity/time-receipt.entity';

const sessionRepo = myDataSource.getRepository(Session)
const deviceRepo = myDataSource.getRepository(Device)
const orderRepo = myDataSource.getRepository(Order)
const financeRepo = myDataSource.getRepository(Finance)
const timeOrderRepo = myDataSource.getRepository(TimeOrder)
const devTypeRepo = myDataSource.getRepository(DeviceType)
const TimeReceiptRepo = myDataSource.getRepository(TimeReceipt)


const findSession = async (req:Request, res:Response)=>{
    const {id} = req.params
    const session = await sessionRepo.find({where: {id}})
    session? res.json({success: true, session}) : res.json({success: false, message: "حدث خطا"})
}

const changeTime = async (req:Request, res:Response)=>{
    const {id} = req.params;
    const {play_type, time_type} = req.body

    const session = await sessionRepo.findOne({where: {id}})
    if(session){
        const device = await deviceRepo.findOne({where: {id: session.device_id}})
        let cost = 0;
        const start_at = Date.now()
        const deviceType = await devTypeRepo.findOne({where: {id: device?.type}})

        if(deviceType){
            if(session.play_type == "single"){
                const timePrice = deviceType.single_price / 12
                if(timePrice) cost = (Date.parse(session.end_at.toString()) - Date.parse(session.start_at)) / (1000 * 60 * 5) * timePrice 
            }else{
                const timePrice = deviceType.multi_price / 12
                if(timePrice) cost = (Date.parse(session.end_at.toString()) - Date.parse(session.start_at)) / (1000 * 60 * 5) * timePrice  
            }
        }

        const timeData:timeDto = {session_id: id, play_type, time_type, cost, start_at: session.start_at}
        const time_order = timeOrderRepo.create(timeData)
        const savedTimeOrder = await timeOrderRepo.save(time_order);

        const newSession = Object.assign(session, {...session, start_at, play_type, time_type})
        const updatedSession = await sessionRepo.save(newSession)

        savedTimeOrder && updatedSession? res.json({message: "تم التحديث", success: true})
        : res.json({message: "حدث خطأ", success: false})
    }
}

const allSessions = async (req:Request, res:Response)=>{
    const sessions = await sessionRepo.find()
    res.json({sessions})
}

const addSession = async(req: Request, res: Response)=>{
    const {play_type, time_type, end_time} = req.body;
    const {id} = req.params
    const device = await deviceRepo.findOne({where:{id}})
    const checkExists = await sessionRepo.findOne({where: {device_id: id}})
    if(!checkExists){
        if(device){
            if(play_type&&time_type){
                const updateDeviceData:addDeviceDto = Object.assign({...device,  status: true})
                const updated = await deviceRepo.save(updateDeviceData)
                const sessionData = {device_id: device.id, end_at: end_time, time_type, play_type}
                const session = sessionRepo.create(sessionData)
                const created = await sessionRepo.save(session)
                res.json({success: true, created, updated, message: "تم بدأ الجهاز بنجاح"})
            }else res.json({success: false, message: "حدث خطأ"})
        }else res.json({message: "هذا الجهاز غير موجود"})
    }else res.json({message: "هذه الجلسة بدأت بالفعل", succes: false, warning: true})
    
}

const endSession = async (req:Request, res:Response) =>{
    const username = req.cookies.username;
    const {id} = req.params
    
    let deviceStatus = false
    
    
    const session = await sessionRepo.findOne({where: {id}})
    if(session){
        
        const device = await deviceRepo.findOne({where: {id: session.device_id}})
        if(device){
            // UPDATE DEVICE STATE
            const deviceData:addDeviceDto = Object.assign({...device, name: device.name, type:device.type, status: deviceStatus})
            const updatedDevice = await deviceRepo.save(deviceData)
            let timeDiff = null; 

            // SENDING FINAL TIME ORDER BEFORE CALCULATING ALL TIME ORDERS
            if(session.time_type == "open"){ 
                timeDiff =  (new Date().getTime() - new Date(session.start_at).getTime()) /(1000 * 60 * 60 )
            }else {
                new Date(session.end_at).getTime() > Date.now()? 
                timeDiff = (Date.now() - new Date(session.start_at).getTime()) / (1000 * 60 * 60)
                : timeDiff = (new Date(session.end_at).getTime() - new Date(session.start_at).getTime()) / (1000 * 60 * 60)
            }
            let finalOrderCost = null
            let finalTimeOrder = null 
            
            const deviceType = await devTypeRepo.findOne({where: {id: device.type}})

            if(deviceType){
                if(session.time_type=="single"){
                    finalOrderCost = timeDiff * deviceType.single_price
                }else{
                    finalOrderCost = timeDiff * deviceType.multi_price 
                }
            }
            
            if(finalOrderCost){
                const createOrder = timeOrderRepo.create({session_id: session.id, start_at:session.start_at, play_type: session.play_type,cost: Math.floor(finalOrderCost)}) 
                finalTimeOrder = await timeOrderRepo.save(createOrder)
            }

            
            //  COUNTING ORDERS AND CALCULATING COSTS
            const orders = await orderRepo.find({where: {device_session_id: session.id}})
            const timeOrders = await timeOrderRepo.find({where:{session_id: session.id}})
            let total = 0;

            let ordersCount = 0
            if(orders.length>0){
                orders.map((order)=>{
                    total =+order.cost
                    ordersCount++
                })
            }

            if(timeOrders.length>0 && finalTimeOrder){
                timeOrders.map((timeOrder)=> total+= timeOrder.cost)
            }
            

            // FINANCES OPERATIONS
            let description = `${username} Ended Device: ${device.name}, With ${ordersCount} Orders, and with Total of ${total}`
            const financeData:addFinanceDto = {finances: total, type: "Device", description, username}
            const finance = financeRepo.create(financeData)
            const addedFinance = await financeRepo.save(finance)
            
            // TIME ORDERS RECEIPT
            const timeReceiptData = TimeReceiptRepo.create({orders: JSON.stringify(orders), time_orders: JSON.stringify(timeOrders), total, cashier:username, session_id:session.id})
            const timeReceipt = await TimeReceiptRepo.save(timeReceiptData);

            // SESSION DELETED
            const deletedSession = await sessionRepo.remove(session)
            
            // RESPONSE
            res.json({success: true, deletedSession, updatedDevice, addedFinance, timeReceipt, message: "تم ايقاف الجهاز بنجاح"})
            
        }else res.json({success: false, message: "حدث خطأ"})
    }else res.json({success: false, message: "حدث خطأ"})
}


export {
    findSession,
    changeTime,
    allSessions,
    addSession,
    endSession,
}