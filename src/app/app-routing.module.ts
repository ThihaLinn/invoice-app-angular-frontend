import { apps } from './../../node_modules/webpack-dev-server/node_modules/open/index.d';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateInvoiceComponent } from './components/create-invoice/create-invoice.component';
import { InvoiceListComponent } from './components/invoice-list/invoice-list.component';
import { UpdateInvoiceComponent } from './components/update-invoice/update-invoice.component';

const routes: Routes = [
  {path:"",component:InvoiceListComponent},
  {path:"invoice-list",component:InvoiceListComponent},
  {path:"create-invoice",component:CreateInvoiceComponent},
  {path:"update-invoice/:id",component:UpdateInvoiceComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
