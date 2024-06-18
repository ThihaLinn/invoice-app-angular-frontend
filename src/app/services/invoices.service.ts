import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoicesService {

  private apiUrl = 'http://localhost:8080/invoice';

  constructor(private http: HttpClient) { }

  getInvoiceList(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  createInvoice(invoiceCreateRequest:any):Observable<any>{
    return this.http.post(`${this.apiUrl}/createInvoice`,invoiceCreateRequest)
  }

  updateInvoice(invoiceUpdateRequest:any):Observable<any>{
    return this.http.post(`${this.apiUrl}/updateInvoice`,invoiceUpdateRequest)
  }

  deleteInvoice(id:number):Observable<any> {
    return this.http.delete(`${this.apiUrl}/`+id)
  }

  findInvoiceById(id:number):Observable<any>{
    return this.http.get(`${this.apiUrl}/`+id)
  }

  searchInvoice(term: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search`, { params: { q: term } });
  }

  validateExcel(file: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/invoiceDetail/validate-excel`, file);
  }
}
