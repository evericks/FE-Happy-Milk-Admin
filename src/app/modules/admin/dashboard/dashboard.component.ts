import { CommonModule, DecimalPipe, NgFor } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { CustomPipesModule } from '@fuse/pipes/custom/custom-pipes.module';
import { dateRangeValidator } from '@fuse/validators/date-range/date-range-validator';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { debounceTime, filter, map, Subject, switchMap, takeUntil } from 'rxjs';
import { DashboardService } from './dashboard.service';

@Component({
    selector: 'dashboard',
    standalone: true,
    templateUrl: './dashboard.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [CommonModule, MatIconModule, MatMenuModule, MatButtonModule,
        NgApexchartsModule, MatTooltipModule, NgFor, DecimalPipe, CustomPipesModule, MatFormFieldModule,
        MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatDatepickerModule, FormsModule],
})
export class DashboardComponent {

    isLoading: boolean = false;
    chartOrderRevenue: ApexOptions;
    chartOrderStatus: ApexOptions;
    data: any;
    filterForm: UntypedFormGroup;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _dashboardService: DashboardService,
        private _formBuilder: UntypedFormBuilder,
    ) {
    }

    /**
 * On init
 */
    ngOnInit(): void {
        // Get the data
        this._dashboardService.data$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                // Store the data
                this.data = data;
                console.log(data);

                // Prepare the chart data
                this._prepareChartData();
            });

        // Attach SVG fill fixer to all ApexCharts
        window['Apex'] = {
            chart: {
                events: {
                    mounted: (chart: any, options?: any): void => {
                        this._fixSvgFill(chart.el);
                    },
                    updated: (chart: any, options?: any): void => {
                        this._fixSvgFill(chart.el);
                    },
                },
            },
        };

        this.initFilterForm();
        this.subcribeFilterForm();
    }

    private initFilterForm() {
        this.filterForm = this._formBuilder.group({
            from: [null, [Validators.required]],
            to: [null, [Validators.required]],
        }, { validators: dateRangeValidator() });
    }

    private subcribeFilterForm() {
        this.filterForm.valueChanges.pipe(
            takeUntil(this._unsubscribeAll),
            filter(() => this.filterForm.valid),
            debounceTime(500),
            switchMap((filter) => {
                if (this.filterForm.valid) {
                    this.isLoading = true;
                    let result = this._dashboardService.getData(filter);
                    result.subscribe();
                    return result;
                }
            }),
            map(() => {
                this.isLoading = false;
            })
        ).subscribe();
    }

    onPickerOpened() {
        if (this.filterForm.get('from').value || this.filterForm.get('to').value) {
            this.filterForm.get('from').reset();
            this.filterForm.get('to').reset();
        }
    }

    /**
 * On destroy
 */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    private _fixSvgFill(element: Element): void {
        // Current URL
        const currentURL = this._router.url;

        // 1. Find all elements with 'fill' attribute within the element
        // 2. Filter out the ones that doesn't have cross reference so we only left with the ones that use the 'url(#id)' syntax
        // 3. Insert the 'currentURL' at the front of the 'fill' attribute value
        Array.from(element.querySelectorAll('*[fill]'))
            .filter(el => el.getAttribute('fill').indexOf('url(') !== -1)
            .forEach((el) => {
                const attrVal = el.getAttribute('fill');
                el.setAttribute('fill', `url(${currentURL}${attrVal.slice(attrVal.indexOf('#'))}`);
            });
    }

    private _prepareChartData(): void {

        // Order revenue
        this.chartOrderRevenue = {
            chart: {
                animations: {
                    speed: 400,
                    animateGradually: {
                        enabled: false,
                    },
                },
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'donut',
                sparkline: {
                    enabled: true,
                },
            },
            colors: ['#319795', '#8B5CF6'],
            labels: this.data.orderRevenue.labels,
            plotOptions: {
                pie: {
                    customScale: 0.9,
                    expandOnClick: false,
                    donut: {
                        size: '70%',
                    },
                },
            },
            series: this.data.orderRevenue.series,
            states: {
                hover: {
                    filter: {
                        type: 'none',
                    },
                },
                active: {
                    filter: {
                        type: 'none',
                    },
                },
            },
            tooltip: {
                enabled: true,
                fillSeriesColor: false,
                theme: 'dark',
                custom: ({
                    seriesIndex,
                    w,
                }): string => `<div class="flex items-center h-8 min-h-8 max-h-8 px-3">
                                                     <div class="w-3 h-3 rounded-full" style="background-color: ${w.config.colors[seriesIndex]};"></div>
                                                     <div class="ml-2 text-md leading-none">${w.config.labels[seriesIndex]}:</div>
                                                     <div class="ml-2 text-md font-bold leading-none">${w.config.series[seriesIndex].toFixed(2)}%</div>
                                                 </div>`,
            },
        };

        // Order status
        this.chartOrderStatus = {
            chart: {
                animations: {
                    speed: 400,
                    animateGradually: {
                        enabled: false,
                    },
                },
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'donut',
                sparkline: {
                    enabled: true,
                },
            },
            colors: ['#64748B', '#22C55E', '#8B5CF6', '#EC4899', '#3B82F6', '#F97316'],
            labels: this.data.orderStatus.labels,
            plotOptions: {
                pie: {
                    customScale: 0.9,
                    expandOnClick: false,
                    donut: {
                        size: '70%',
                    },
                },
            },
            series: this.data.orderStatus.series,
            states: {
                hover: {
                    filter: {
                        type: 'none',
                    },
                },
                active: {
                    filter: {
                        type: 'none',
                    },
                },
            },
            tooltip: {
                enabled: true,
                fillSeriesColor: false,
                theme: 'dark',
                custom: ({
                    seriesIndex,
                    w,
                }): string => `<div class="flex items-center h-8 min-h-8 max-h-8 px-3">
                                                             <div class="w-3 h-3 rounded-full" style="background-color: ${w.config.colors[seriesIndex]};"></div>
                                                             <div class="ml-2 text-md leading-none">${w.config.labels[seriesIndex]}:</div>
                                                             <div class="ml-2 text-md font-bold leading-none">${w.config.series[seriesIndex].toFixed(2)}%</div>
                                                         </div>`,
            },
        };
    }
}
