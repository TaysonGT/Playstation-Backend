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
    let consumed = 0;
    const product = productRepo.create({name, price, stock, consumed })
    
    if(name && price && stock){ 
        const isFound = await productRepo.createQueryBuilder("products")
            .where("LOWER(products.name) LIKE LOWER(:query)", { query: `%${name.toLowerCase()}%` })
            .getOne();
        if(!isFound){
            const created = await productRepo.save(product)
            res.json({success: true, created, message: "تمت إضافة المنتج بنجاح"});
        }else res.json({success: false, message: "هذا المنتج موجود بالفعل", isFound})
    }else res.json({succes: false, message: "برجاء ملء جميع البيانات"})
}

const updateProduct = async (req: Request, res:Response) =>{
    const {id} = req.params
    const product = await productRepo.findOne({where: {id}})

    const {name, price, stock} = req.body;

    
    if(product){
        let productData:addProductDto = {name, price, stock, consumed: product.consumed}
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