import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InvoiceListComponent } from './components/invoice-list/invoice-list.component';
import { CreateInvoiceComponent } from './components/create-invoice/create-invoice.component';
import { UpdateInvoiceComponent } from './components/update-invoice/update-invoice.component';

@NgModule({
  declarations: [
    AppComponent,
    InvoiceListComponent,
    CreateInvoiceComponent,
    UpdateInvoiceComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
