# Adyen Currency Converter
Made by Otto Coster for Adyen

View it on: http://ottocoster.com/adyen/

## Features
This currency converter supports currency conversion of all major currencies. You can enter an amount in the input field, select from and to currencies and the app will convert the entered amount to the selected target currency.

Optionally, you can select a different date to see what would be the converted amount in the past. You can select up to the year 1999 for the historical currency rates.

As a handy shortcut, there is a switch button that switches the from and to currencies, if you realize that you want it to convert the other way around.
## Tech info
This app is made using Angular 11, with heavy use of rxjs pipelines for a declarative, reactive application. As API, the ratesapi.io service is used. The UI styling is based on the Adyen branding.