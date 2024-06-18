import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { InvoicesService } from '../../services/invoices.service';
import { Router } from '@angular/router';
import { Township } from '../../types';

@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
})
export class CreateInvoiceComponent {
    invoiceForm: FormGroup;
    townships = Object.values(Township)
  
    constructor(private invoiceService:InvoicesService,private fb: FormBuilder,private router:Router) {
      this.invoiceForm = this.fb.group({
        invoiceId: [null],
        casherName: ['', Validators.required],
        date: ['', Validators.required],
        township: ['', Validators.required],
        remark: [''],
        invoiceDetailDtos: this.fb.array([this.createInvoiceDetail()]), // Change to invoiceDetailDtos
        totalAmount: [0, Validators.required] 
      });
  
      this.invoiceDetails.valueChanges.subscribe(() => {
        this.updateTotalAmount();
        this.updateSetAmounts();
      });
    }
  
    createInvoiceDetail(): FormGroup {
      return this.fb.group({
        item: ['', Validators.required],
        price: [1, [Validators.required, Validators.min(1)]],
        quantity: [1, [Validators.required, Validators.min(1)]],
        setAmount: [1, [Validators.required, Validators.min(1)]]
      });
    }
  
    get invoiceDetails(): FormArray {
      return this.invoiceForm.get('invoiceDetailDtos') as FormArray; // Change to invoiceDetailDtos
    }

    addInvoiceDetail() {
      this.invoiceDetails.push(this.createInvoiceDetail());
    }
    
    removeInvoiceDetail(index: number) {
      this.invoiceDetails.removeAt(index);
      this.updateTotalAmount();
    }
    
    updateTotalAmount() {
      const total = this.invoiceDetails.controls.reduce((sum, detail) => {
        const price = detail.get('price')?.value || 0;
        const quantity = detail.get('quantity')?.value || 0;
        const setAmount = price * quantity;
        return sum + setAmount;
      }, 0);
      this.invoiceForm.get('totalAmount')?.setValue(total, { emitEvent: false });
    }
    
    updateSetAmounts() {
      this.invoiceDetails.controls.forEach(detail => {
        const price = detail.get('price')?.value || 0;
        const quantity = detail.get('quantity')?.value || 0;
        const setAmount = price * quantity;
        detail.get('setAmount')?.setValue(setAmount, { emitEvent: false });
      });
    }
    
  
    onSubmit() {
      if (this.invoiceForm.valid) {
        // Extract the form values as a plain object
        const invoiceCreateRequest = this.extractFormData(this.invoiceForm);
    
        // Now send invoiceCreateRequest to your backend
        this.invoiceService.createInvoice(invoiceCreateRequest).subscribe(
          data => {
            console.log("Success:", data);
          }
        );
        this.router.navigate(['/']); // Navigate upon successful creation

      } else {
        this.invoiceForm.markAllAsTouched(); // Mark all form fields as touched to trigger validation messages
        console.log("Form data:", this.invoiceForm.value);
      }
    }
  
    numberWithCommas(x: number): string {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    private extractFormData(formGroup: FormGroup): any {
      const formData = { ...formGroup.value };
      return formData;
    }
  
  }

