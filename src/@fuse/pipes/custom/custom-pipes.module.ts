import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderStatusPipe } from 'app/modules/admin/order/pipes/order-status.pipe';
import { RoundToThousandsPipe } from 'app/modules/admin/dashboard/pipes/round-to-thousands.pipe';

@NgModule({
    declarations: [OrderStatusPipe, RoundToThousandsPipe],
    imports: [CommonModule],
    exports: [OrderStatusPipe, RoundToThousandsPipe]
})
export class CustomPipesModule { }
