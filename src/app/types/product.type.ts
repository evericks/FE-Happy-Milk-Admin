import { ProductCategory } from "./product-category.type";

export interface Product {
    id: string,
    name: string,
    description: string,
    origin: string,
    thumbnailUrl: string,
    madeIn: string,
    brand: string,
    price: number,
    promotionPrice?: number,
    expireAt: string,
    quantity: number,
    sold: number,
    status: string,
    rating: number,
    productCategories: ProductCategory[]
}