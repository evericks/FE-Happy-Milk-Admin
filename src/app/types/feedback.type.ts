import { Customer } from "./customer.type";

export interface Feedback {
    id: string,
    star: number,
    message: string,
    customer: Customer,
    createAt: string
}