import { Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { InvoicesService } from '../../services/invoices.service';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
})
export class InvoiceListComponent implements OnInit {
  invoices: any[] = [];
  currentPage: number = 1;
  pages: number[] = [];
  invoicesPerPage = 7; // Number of invoices per page

  searchTerm = new FormControl();
  
  constructor(private invoiceService: InvoicesService, private router: Router) { }

  ngOnInit(): void {
    this.getInvoices();

    this.searchTerm.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(term => term ? this.invoiceService.searchInvoice(term) : this.invoiceService.getInvoiceList())
    ).subscribe(data => {
      this.invoices = data;
      this.currentPage = 1;
    });

    this.getInvoices()

  }

  getInvoices(): void {
    this.invoiceService.getInvoiceList().subscribe(data => {
      this.invoices = data;
      this.setPages();
    });
  }

  setPages(): void {
    const totalPages = Math.ceil(this.invoices.length / this.invoicesPerPage);
    this.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  handlePageChange(page: number): void {
    this.currentPage = page;
  }

  handleFileChange(event: any): void {
    const input = event.target;
    if (!input.files || input.files.length === 0) {
      console.error('No file selected.');
      return;
    }

    const file = input.files[0];
    const formData = new FormData();
    formData.append('file', file);

    this.invoiceService.validateExcel(formData).subscribe(
      response => {
        console.log('Response from server:', response);
        this.getInvoices();
      },
      error => {
        console.error('Error:', error);
      }
    );

    input.value = '';
  }

  formatDateString(date: string): string {
    return new Date(date).toLocaleDateString();
  }

  truncate(text: string, maxLength: number): string {
    return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
  }
}
