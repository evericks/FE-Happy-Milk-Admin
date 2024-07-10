import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer } from 'app/types/customer.type';
import { Pagination } from 'app/types/pagination.type';
import { BehaviorSubject, Observable, map, switchMap, take, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CustomerService {

    private _customer: BehaviorSubject<Customer | null> = new BehaviorSubject(null);
    private _customers: BehaviorSubject<Customer[] | null> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<Pagination | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) { }

    /**
 * Getter for customer
 */
    get customer$(): Observable<Customer> {
        return this._customer.asObservable();
    }

    /**
     * Getter for customers
     */
    get customers$(): Observable<Customer[]> {
        return this._customers.asObservable();
    }

    /**
 * Getter for pagination
 */
    get pagination$(): Observable<Pagination> {
        return this._pagination.asObservable();
    }

    getCustomers(filter: any = {}):
        Observable<{ pagination: Pagination; data: Customer[] }> {
        return this._httpClient.post<{ pagination: Pagination; data: Customer[] }>('/api/customers/filter', filter).pipe(
            tap((response) => {
                this._pagination.next(response.pagination);
                this._customers.next(response.data);
            }),
        );
    }

    /**
     * Get customer by id
     */
    getCustomerById(id: string): Observable<Customer> {
        return this.customers$.pipe(
            take(1),
            switchMap(() => this._httpClient.get<Customer>('/api/customers/' + id).pipe(
                map((customer) => {

                    // Set value for current customer
                    this._customer.next(customer);

                    // Return the new contact
                    return customer;
                })
            ))
        );
    }

    /**
* Create customer
*/
    createCustomer(data) {
        return this.customers$.pipe(
            take(1),
            switchMap((customers) => this._httpClient.post<Customer>('/api/customers', data).pipe(
                map((newCustomer) => {

                    // Update customer list with current page size
                    this._customers.next([newCustomer, ...customers].slice(0, this._pagination.value.pageSize));

                    return newCustomer;
                })
            ))
        )
    }

    /**
    * Update customer
    */
    updateCustomer(id: string, data) {
        return this.customers$.pipe(
            take(1),
            switchMap((customers) => this._httpClient.put<Customer>('/api/customers/' + id, data).pipe(
                map((updatedCustomer) => {

                    // Find and replace updated customer
                    const index = customers.findIndex(item => item.id === id);
                    customers[index] = updatedCustomer;
                    this._customers.next(customers);

                    // Update customer
                    this._customer.next(updatedCustomer);

                    return updatedCustomer;
                })
            ))
        )
    }

    /**
* Activate customer
*/
    activateCustomer(id: string) {
        return this.customers$.pipe(
            take(1),
            switchMap((customers) => this._httpClient.put<Customer>(`/api/customers/${id}/activate`, null).pipe(
                map((updatedCustomer) => {

                    // Find and replace updated customer
                    const index = customers.findIndex(item => item.id === id);
                    customers[index] = updatedCustomer;
                    this._customers.next(customers);

                    // Update customer
                    this._customer.next(updatedCustomer);

                    return updatedCustomer;
                })
            ))
        )
    }

    /**
* Deactivate customer
*/
    deactivateCustomer(id: string) {
        return this.customers$.pipe(
            take(1),
            switchMap((customers) => this._httpClient.put<Customer>(`/api/customers/${id}/deactivate`, null).pipe(
                map((updatedCustomer) => {

                    // Find and replace updated customer
                    const index = customers.findIndex(item => item.id === id);
                    customers[index] = updatedCustomer;
                    this._customers.next(customers);

                    // Update customer
                    this._customer.next(updatedCustomer);

                    return updatedCustomer;
                })
            ))
        )
    }
}