import {Response, Request} from "express"
import { myDataSource } from "../app-data-source";
import { addDeviceDto } from "../dto/add-device.dto";
import { Device } from '../entity/device.entity';
import { Session } from "../entity/session.entity";
import { DeviceType } from "../entity/device-type.entity";

const deviceRepo = myDataSource.getRepository(Device)
const sessionRepo = myDataSource.getRepository(Session)
const devTypeRepo = myDataSource.getRepository(DeviceType)


const findDevice = async (req:Request, res:Response)=>{
    const {id} = req.params
    const device = await deviceRepo.findOne({where: {id}})

    if(device) {
        const session = await sessionRepo.find({where: {device_id: id}})
        res.json({device, session}) 
    }else res.json({message: "هذا الجهاز غير موجود"})
}

const allDevices = async (req:Request, res:Response)=>{
    const devices = await deviceRepo.find()
    res.json({devices: devices? devices.sort((a,b)=>a.name.localeCompare(b.name)): []})
}

const addDevice = async(req: Request, res: Response)=>{
    const { name, type }= req.body;
    const checkExists = await deviceRepo.findOne({where: {name}})
    if(name && type){
        if(!checkExists){
            const device_type = await devTypeRepo.findOne({where: {id: type}}) 
            if(device_type){
                const deviceData:addDeviceDto = deviceRepo.create({name, type: device_type.id , status:false})
                const device = await deviceRepo.save(deviceData)
                res.json({device,  message: "تمت إضافة جهاز بنجاح", success: true})
            }else res.json({message: "برجاء اعادة ادخال البيانات", success: false})
        }else res.json({success: false, message: "هذا الجهاز موجود بالفعل"})
    }else res.json({message:"برجاء ادخال كل البيانات", success: false})
}

const updateDevice = async (req: Request, res:Response) =>{
    const {id} = req.params
    const {name, type} = req.body;
    let status = false
    
    let deviceData:addDeviceDto = {name, type, status}
    const device = await deviceRepo.findOne({where: {id}})

    if(device){
        const updatedDevice = Object.assign(device, deviceData)
        const updated = await deviceRepo.save(updatedDevice)
        res.json({updated, message: "تم تحديث الجهاز بنجاح"})
    }else {
        res.json({message: "هذا الجهاز غير موجود"})
    }
}

const deleteDevice = async (req:Request, res:Response) =>{
    const {id} = req.params
    const device = await deviceRepo.findOne({where: {id}})
    if(device){
        if(device.status == false){
            const deleted = await deviceRepo.remove(device)
            res.json({deleted, message: "تمت إزالة الجهاز بنجاح", success:true})
        }else res.json({message: "هذا الجهاز مشغول حاليا برجاء اغلاقه أولا", success: false})
    } else{
        res.json({message: "حدث خطأ", success: false})
    }
}

const addDeviceType = async (req:Request, res:Response) =>{
    const {name, single_price, multi_price} = req.body
    const typeData = devTypeRepo.create({name,single_price, multi_price})
    const savedType = await devTypeRepo.save(typeData)
    if(savedType){
        res.json({message: "تم إضافة نوع جهاز جديد", success: true})
    } else res.json({message: "حدث خطأ", success: false})
}

const updateDeviceType = async (req:Request, res:Response) =>{
    const {id} = req.params
    const {singlePrice, multiPrice} = req.body
    const deviceType = await devTypeRepo.findOne({where: {id}})
    let currentSinglePrice = null
    let currentMultiPrice = null
    if(deviceType){
        singlePrice ? currentSinglePrice = singlePrice : currentSinglePrice = deviceType.single_price
        multiPrice ? currentMultiPrice = multiPrice : currentMultiPrice = deviceType.multi_price
        const savedDeviceType = await devTypeRepo.save(Object.assign(deviceType, {single_price: currentSinglePrice, multi_price: currentMultiPrice}))
        singlePrice||multiPrice? res.json({success: true, savedDeviceType, message: "تم حفظ التعديلات بنجاح"}) : res.json({success: false, message: "لم يتم إدخال أي بيانات"})
    }else res.json({succes:false, message: "حدث خطأ"})
}

const allDeviceTypes = async (req:Request, res:Response) =>{
    const deviceTypes = await devTypeRepo.find()
    deviceTypes.length>0 ? res.json({deviceTypes}) : res.json({message: "برجاء اضافة نوع جهاز من صفحة الاعدادات", success: false})
}

const findDeviceType = async (req:Request, res:Response) =>{
    const {id} = req.params
    const deviceType = await devTypeRepo.findOne({where:{id}})
    if(deviceType){
        res.json({deviceType})
    }else res.json({message: "حدث خطأ"})
}


export {
    findDevice,
    allDeviceTypes,
    addDeviceType,
    updateDeviceType,
    findDeviceType,
    allDevices,
    addDevice,
    updateDevice,
    deleteDevice,
}