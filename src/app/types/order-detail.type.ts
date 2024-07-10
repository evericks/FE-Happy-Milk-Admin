import { Product } from "./product.type";

export interface OrderDetail {
    id: string,
    product: Product,
    quantity: number,
    price: number,
    isReviewed: boolean
}