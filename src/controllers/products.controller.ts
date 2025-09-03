import {Response, Request} from "express"
import { myDataSource } from "../app-data-source";
import { Product } from "../entity/product.entity";
import { addProductDto } from "../dto/add-product.dto";

const productRepo = myDataSource.getRepository(Product)


const findProduct = async (req:Request, res:Response)=>{
    const {id} = req.params
    const product = await productRepo.find({where: {id}})
    product? res.json({product}) : res.json({message: "هذا المنتج غير موجود"})
}

const allProducts = async (req:Request, res:Response)=>{
    const products = await productRepo.find()
    res.json({products})
}

const addProduct = async(req: Request, res: Response)=>{
    const {name, price, stock} = req.body;
    const product = productRepo.create({name, price, stock })
    
    if(!(name && price && stock)){ 
        res.json({succes: false, message: "برجاء ملء جميع البيانات"})
        return;
    }

    const isFound = await productRepo.createQueryBuilder("products")
        .where("LOWER(products.name) LIKE LOWER(:query)", { query: `%${name.toLowerCase()}%` })
        .getExists();

    if(isFound){
        res.json({success: false, message: "هذا المنتج موجود بالفعل", isFound})
        return
    }

    await productRepo.save(product)
    res.json({success: true, product, message: "تمت إضافة المنتج بنجاح"});
}

const updateProduct = async (req: Request, res:Response) =>{
    const {id} = req.params
    const product = await productRepo.findOne({where: {id}})

    const {name, price, stock} = req.body;

    
    if(product){
        let productData:addProductDto = {name, price, stock}
        const updatedProduct = Object.assign(product, productData)
        const updated = await productRepo.save(updatedProduct)
        res.json({success: true, updated, message: "تم تحديث المنتج بنجاح"})
         
    }else {
        res.json({success: false, message: "هذا المنتج غير موجود"})
    }
}

const deleteProduct = async (req:Request, res:Response) =>{
    const {id} = req.params
    const product = await productRepo.findOne({where: {id}})
    if(product){
        const deleted = await productRepo.remove(product)
        res.json({success: true, deleted, message: "تمت إزالة المنتج بنجاح"})
    } else{
        res.json({success: false, message: "حدث خطأ"})
    }
}

const oneProduct = async (req: Request, res: Response) =>{
    const {id} = req.params
    const product = await productRepo.findOne({where: {id}})
    if(product){
        res.json({product})
    }else{
        res.json({message: "حدث خطأ ما", success: false})
    }
}


export {
    findProduct,
    allProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    oneProduct,
}