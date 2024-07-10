import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-checkbox-list',
  standalone: true,
  templateUrl: './checkbox-list.component.html',
  imports: [MatCheckboxModule, FormsModule, ReactiveFormsModule, MatFormFieldModule]
})
export class CheckboxListComponent implements OnInit {
  @Input() list: { id: number, name: string }[] = [];
  @Input() formArrayName: string;
  @Input() form: FormGroup;
  @Output() valueChanged = new EventEmitter<string[]>();

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    const controlArray = this.list.map(() => new FormControl(false));
    const formArray = this.fb.array(controlArray);

    this.form.setControl(this.formArrayName, formArray);
    this.listenCategoriesChange();
  }

  get formControlArray() {
    return this.form.get(this.formArrayName) as FormArray;
  }

  listenCategoriesChange() {
    this.formControlArray.valueChanges.subscribe(values => {
      const selectedCheckboxIds = values
        .map((checked, index) => checked ? this.list[index].id : null)
        .filter(value => value !== null);
      this.valueChanged.emit(selectedCheckboxIds);
    });
  }
}