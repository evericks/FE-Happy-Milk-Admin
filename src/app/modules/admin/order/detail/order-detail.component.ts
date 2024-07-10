import { Component, OnInit } from '@angular/core';
import { Order } from 'app/types/order.type';
import { Observable } from 'rxjs';
import { OrderService } from '../order.service';
import { CommonModule } from '@angular/common';
import { CustomPipesModule } from '@fuse/pipes/custom/custom-pipes.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { RouterModule } from '@angular/router';
import { FuseAlertComponent } from '@fuse/components/alert';
import { MatDialog } from '@angular/material/dialog';
import { NoteComponent } from '../note/note.component';

@Component({
    selector: 'order-detail',
    standalone: true,
    templateUrl: 'order-detail.component.html',
    imports: [CommonModule, CustomPipesModule, MatIconModule, MatButtonModule, RouterModule, FuseAlertComponent]
})

export class OrderDetailComponent implements OnInit {

    order$: Observable<Order>;
    isLoading: boolean = false;

    constructor(
        private _orderService: OrderService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _matDialog: MatDialog
    ) { }

    ngOnInit() {
        this.order$ = this._orderService.order$;
    }

    cancelOrder(id: string) {
        this._matDialog.open(NoteComponent, {
            width: '480px',
            data: id
        }).afterClosed().subscribe(() => {

        });
    }

    confirmOrder(id: string) {
        this._fuseConfirmationService.open({
            title: 'Warning',
        }).afterClosed().subscribe(result => {
            if (result === 'confirmed') {
                this._orderService.confirmOrder(id).subscribe();
            }
        })
    }

    deliverOrder(id: string) {
        this._fuseConfirmationService.open({
            title: 'Warning',
        }).afterClosed().subscribe(result => {
            if (result === 'confirmed') {
                this._orderService.deliverOrder(id).subscribe();
            }
        })
    }
}