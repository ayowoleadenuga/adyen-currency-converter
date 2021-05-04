import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface RatesResponse {
  base: string,
  rates: {
    [currency: string]: number;
  },
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class CurrencyConverterService {
  latest$ = this.httpClient.get<RatesResponse>('https://api.ratesapi.io/api/latest');
  
  constructor(private httpClient: HttpClient) { }
  
  getConversionRate(fromCurrency: string, toCurrency: string) {
    return this.httpClient.get<RatesResponse>(`https://api.ratesapi.io/api/latest?base=${fromCurrency}&symbols=${toCurrency}`);
  }
}