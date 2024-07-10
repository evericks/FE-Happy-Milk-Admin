import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { OrderComponent } from './order.component';
import { OrderService } from './order.service';
import { OrderDetailComponent } from './detail/order-detail.component';

export default [
    {
        path: '',
        component: OrderComponent,
        resolve: {
            orders: () => inject(OrderService).getOrders(),
        },
    },
    {
        path: ':id',
        component: OrderDetailComponent,
        resolve: {
            order: (route: ActivatedRouteSnapshot) => inject(OrderService).getOrder(route.params['id']),
        },
    },
] as Routes;