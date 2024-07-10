import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'example',
    standalone: true,
    templateUrl: './example.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [RouterModule]
})
export class ExampleComponent {
    /**
     * Constructor
     */
    constructor() {
    }
}
