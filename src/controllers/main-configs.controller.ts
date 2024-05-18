import {Response, Request} from "express"
import { myDataSource } from "../app-data-source";
import { HeadConfig } from "../entity/head-config.entity";

const configRepo = myDataSource.getRepository(HeadConfig)

const saveConfigs = async (req: Request, res: Response)=>{
    const {name, phone} = req.body

    const nameConfig = await configRepo.findOne({where:{key: "name"}})
    const phoneConfig = await configRepo.findOne({where:{key: "phone"}})

    let savedName = null;
    let savedPhone = null;

    if(name!= null && name != ""){
        if(nameConfig){
            const currentName = Object.assign(nameConfig, {value: name}) 
            savedName = await configRepo.save(currentName)
        }else {
            const currentName = configRepo.create({key: "name", value: name})
            savedName = await configRepo.save(currentName)
        }
    }

    if(phone!= null && phone != ""){
        if(phoneConfig){
            const currentPhone = Object.assign(phoneConfig, {value: phone}) 
            savedPhone = await configRepo.save(currentPhone);

        }else {
            const currentPhone = configRepo.create({key: "phone", value: phone})  
            savedPhone = await configRepo.save(currentPhone) 
        }
    }

    if((phone== null || phone == undefined)&&(name== null || name == undefined)){
        res.json({message: "لم يتم إدخال أي بيانات", success:false})
    }else{
        res.json({message: "تم حفظ البيانات بنجاح", savedPhone, savedName,success: true})
    }
}

const getConfigs = async (req: Request, res: Response) => {
    const nameConfig = await configRepo.findOne({where: {key: "name"}})
    const phoneConfig = await configRepo.findOne({where: {key: "phone"}})
    res.json({nameConfig, phoneConfig})
}


export {
    saveConfigs,
    getConfigs
}