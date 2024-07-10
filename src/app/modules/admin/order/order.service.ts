import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from 'app/types/order.type';
import { Pagination } from 'app/types/pagination.type';
import { BehaviorSubject, Observable, map, switchMap, take, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrderService {

    private _order: BehaviorSubject<Order | null> = new BehaviorSubject(null);
    private _orders: BehaviorSubject<Order[] | null> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<Pagination | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) { }

    /**
 * Getter for order
 */
    get order$(): Observable<Order> {
        return this._order.asObservable();
    }

    /**
     * Getter for orders
     */
    get orders$(): Observable<Order[]> {
        return this._orders.asObservable();
    }

    /**
 * Getter for pagination
 */
    get pagination$(): Observable<Pagination> {
        return this._pagination.asObservable();
    }

    getOrders(filter: any = {}):
        Observable<{ pagination: Pagination; data: Order[] }> {
        return this._httpClient.post<{ pagination: Pagination; data: Order[] }>('/api/orders/filter', filter).pipe(
            tap((response) => {
                this._pagination.next(response.pagination);
                this._orders.next(response.data);
            }),
        );
    }

    /**
     * Get order
     */
    getOrder(id: string): Observable<Order> {
        return this.orders$.pipe(
            take(1),
            switchMap(() => this._httpClient.get<Order>('/api/orders/' + id).pipe(
                map((order) => {

                    // Set value for current order
                    this._order.next(order);

                    // Return the new contact
                    return order;
                })
            ))
        );
    }

    /**
* Cancle order
*/
    cancelOrder(id: string, data: any = null) {
        return this.orders$.pipe(
            take(1),
            switchMap(() => this._httpClient.put<Order>(`/api/orders/${id}/cancel`, data).pipe(
                map((updatedOrder) => {

                    // Update order
                    this._order.next(updatedOrder);

                    return updatedOrder;
                })
            ))
        )
    }

    /**
* Confirm order
*/
    confirmOrder(id: string) {
        return this.orders$.pipe(
            take(1),
            switchMap(() => this._httpClient.put<Order>(`/api/orders/${id}/confirm`, null).pipe(
                map((updatedOrder) => {

                    // Update order
                    this._order.next(updatedOrder);

                    return updatedOrder;
                })
            ))
        )
    }

    /**
* Deliver order
*/
    deliverOrder(id: string) {
        return this.orders$.pipe(
            take(1),
            switchMap(() => this._httpClient.put<Order>(`/api/orders/${id}/deliver`, null).pipe(
                map((updatedOrder) => {

                    // Update order
                    this._order.next(updatedOrder);

                    return updatedOrder;
                })
            ))
        )
    }
}