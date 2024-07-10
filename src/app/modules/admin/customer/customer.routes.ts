import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { CustomerComponent } from 'app/modules/admin/customer/customer.component';
import { CustomerService } from './customer.service';

export default [
    {
        path: '',
        component: CustomerComponent,
        resolve: {
            customer: () => inject(CustomerService).getCustomers(),
        }
    },
] as Routes;
