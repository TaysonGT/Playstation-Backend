import { Response, Request } from "express";
declare const findProduct: (req: Request, res: Response) => Promise<void>;
declare const allProducts: (req: Request, res: Response) => Promise<void>;
declare const addProduct: (req: Request, res: Response) => Promise<void>;
declare const updateProduct: (req: Request, res: Response) => Promise<void>;
declare const deleteProduct: (req: Request, res: Response) => Promise<void>;
declare const oneProduct: (req: Request, res: Response) => Promise<void>;
export { findProduct, allProducts, addProduct, updateProduct, deleteProduct, oneProduct, };
