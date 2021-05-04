import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { debounceTime, map, startWith, switchMap } from 'rxjs/operators';
import { CurrencyConverterService } from './currency-converter.service';

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.scss']
})
export class CurrencyConverterComponent {
  fromAmount = new FormControl(1);
  fromCurrency = new FormControl('EUR');
  toCurrency = new FormControl('GBP');

  currencies$ = this.currencyConverterService.latest$.pipe(
    map(latest => [latest.base, ...Object.keys(latest.rates)])
  );
  
  conversionRate$ = combineLatest([
    this.fromCurrency.valueChanges.pipe(startWith(this.fromCurrency.value)),
    this.toCurrency.valueChanges.pipe(startWith(this.toCurrency.value)),
  ]).pipe(
    switchMap(([from, to]) => 
      this.currencyConverterService.getConversionRate(from, to).pipe(
        map(ratesReponse => ratesReponse.rates[to])
      )
  ));

  convertedAmount$ =
    combineLatest([
      this.fromAmount.valueChanges.pipe(startWith(this.fromAmount.value), debounceTime(500)),
      this.conversionRate$
    ])
  .pipe(
    map(([amount, conversionRate]) => amount * conversionRate)
  );

  constructor(private currencyConverterService: CurrencyConverterService) { }
}
