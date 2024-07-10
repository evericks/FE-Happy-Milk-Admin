import { Product } from "./product.type";

export interface CartItem {
    id: string,
    product: Product,
    quantity: number
}