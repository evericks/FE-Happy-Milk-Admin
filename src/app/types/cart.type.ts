import { CartItem } from "./cart-item.type";

export interface Cart {
    id: string,
    cartItems: CartItem[]
}