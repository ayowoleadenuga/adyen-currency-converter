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
  today = new Date().toISOString().substring(0, 10);

  fromAmount = new FormControl(1);
  fromCurrency = new FormControl('EUR');
  toCurrency = new FormControl('GBP');
  date = new FormControl(this.today);

  currencies$ = this.currencyConverterService.latest$.pipe(
    map(latest => [latest.base, ...Object.keys(latest.rates)]),
    map(latest => latest.sort())
  );
  
  conversionRate$ = combineLatest([
    this.fromCurrency.valueChanges.pipe(startWith(this.fromCurrency.value)),
    this.toCurrency.valueChanges.pipe(startWith(this.toCurrency.value)),
    this.date.valueChanges.pipe(startWith(this.date.value)),
  ]).pipe(
    debounceTime(200),
    switchMap(([from, to, date]) => {
      if (isNaN(Date.parse(date))) {
        date = 'latest';
      }

      return this.currencyConverterService.getConversionRate(from, to, date).pipe(
        map(ratesReponse => ratesReponse.rates[to])
      )
    }
  ));

  convertedAmount$ = combineLatest([
    this.fromAmount.valueChanges.pipe(startWith(this.fromAmount.value), debounceTime(500)),
    this.conversionRate$
  ]).pipe(
    map(([amount, conversionRate]) => amount * conversionRate)
  );

  constructor(private currencyConverterService: CurrencyConverterService) { }

  switch(): void {
    const from = this.fromCurrency.value;
    const to = this.toCurrency.value;
    this.fromCurrency.setValue(to);
    this.toCurrency.setValue(from);
  }
}
