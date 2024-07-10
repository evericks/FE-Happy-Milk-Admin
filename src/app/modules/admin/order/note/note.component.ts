import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { OrderService } from '../order.service';
import { MatButtonModule } from '@angular/material/button';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
    selector: 'note',
    standalone: true,
    templateUrl: 'note.component.html',
    imports: [CommonModule, MatInputModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatButtonModule]
})

export class NoteComponent implements OnInit {

    cancelOrderForm: UntypedFormGroup;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public _dialog: MatDialogRef<NoteComponent>,
        private _orderService: OrderService,
        private _formBuilder: UntypedFormBuilder,
        private _fuseConfirmationService: FuseConfirmationService
    ) { }

    ngOnInit() {
        this.initCancelForm();
    }

    initCancelForm() {
        this.cancelOrderForm = this._formBuilder.group({
            note: [null, [Validators.required]]
        });
    }

    cancelOrder() {
        if (this.cancelOrderForm.valid) {
            this._fuseConfirmationService.open({
                title: 'Warning'
            }).afterClosed().subscribe(result => {
                if (result === 'confirmed') {
                    this._orderService.cancelOrder(this.data, this.cancelOrderForm.value).subscribe(() => {
                        this._dialog.close();
                    });
                }
            })
        }
    }
}