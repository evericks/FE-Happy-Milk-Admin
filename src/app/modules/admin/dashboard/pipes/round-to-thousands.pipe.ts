import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'roundToThousands'
})
export class RoundToThousandsPipe implements PipeTransform {

    transform(value: number): number {
        if (isNaN(value)) return null;
        return Math.round(value / 1000) * 1000;
    }
}
