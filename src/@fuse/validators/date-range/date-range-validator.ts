import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateRangeValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
        const from = formGroup.get('from')?.value;
        const to = formGroup.get('to')?.value;

        if ((from && !to) || (!from && to)) {
            return { dateRangeInvalid: true };
        }

        return null;
    };
}
