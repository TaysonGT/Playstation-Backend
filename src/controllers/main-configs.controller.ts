import {Response, Request} from "express"
import { myDataSource } from "../app-data-source";
import { HeadConfig } from "../entity/head-config.entity";

const configRepo = myDataSource.getRepository(HeadConfig)

const saveConfigs = async (req: Request, res: Response)=>{
    const {name, phone, currency} = req.body

    const nameConfig = await configRepo.findOne({where:{key: "name"}})
    const phoneConfig = await configRepo.findOne({where:{key: "phone"}})
    const currencyConfig = await configRepo.findOne({where:{key: "currency"}})
    
    let savedName = null;
    let savedPhone = null;
    let savedCurrency = null;
    
    if(name){
        if(nameConfig){
            const currentName = Object.assign(nameConfig, {value: name}) 
            savedName = await configRepo.save(currentName)
        }else {
            const currentName = configRepo.create({key: "name", value: name})
            savedName = await configRepo.save(currentName)
        }
    }

    if(phone){
        if(phoneConfig){
            const currentPhone = Object.assign(phoneConfig, {value: phone}) 
            savedPhone = await configRepo.save(currentPhone);

        }else {
            const currentPhone = configRepo.create({key: "phone", value: phone})  
            savedPhone = await configRepo.save(currentPhone) 
        }
    }

    if(currency){
        if(currencyConfig){
            const currentCurrency = Object.assign(currencyConfig, {value: currency}) 
            savedCurrency = await configRepo.save(currentCurrency);

        }else {
            const currentCurrency = configRepo.create({key: "currency", value: phone})  
            savedCurrency = await configRepo.save(currentCurrency) 
        }
    }

    if(!phone && !name && !currency){
        res.json({message: "لم يتم إدخال أي بيانات", success:false})
        return
    }
    
    res.json({
        message: "تم حفظ البيانات بنجاح", 
        configs:{
            phone: savedPhone, 
            name: savedName, 
            currency: savedCurrency
        }, 
        success: true
    })
}

const getConfigs = async (req: Request, res: Response) => {
    const name = await configRepo.findOne({where: {key: "name"}})
    const phone = await configRepo.findOne({where: {key: "phone"}})
    const currency = await configRepo.findOne({where: {key: "currency"}})
    res.json({
        configs:{
            phone: phone?.value,
            name: name?.value,
            currency: currency?.value
        }, 
        success:true
    })
}


export {
    saveConfigs,
    getConfigs
}