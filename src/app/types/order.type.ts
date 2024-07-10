import { User } from "app/core/user/user.types";
import { OrderDetail } from "./order-detail.type";

export interface Order {
    id: string,
    customer: User,
    amout: number,
    receiver: string,
    address: string,
    phone: string,
    paymentMethod: string,
    isPayment: boolean,
    status: string,
    createAt: string,
    note?: string,
    orderDetails: OrderDetail[]
}