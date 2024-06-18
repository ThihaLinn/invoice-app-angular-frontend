import { ValueOf } from './../../../../node_modules/type-fest/source/value-of.d';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoicesService } from '../../services/invoices.service';
import { Township } from '../../types';

@Component({
  selector: 'app-update-invoice',
  templateUrl: './update-invoice.component.html',
  styles: ``
})
export class UpdateInvoiceComponent implements OnInit {

    id:string | undefined ;
    townships = Object.values(Township)

  ngOnInit(): void {
    
    this.id = this.route.snapshot.params['id']; // Assuming you fetch id from route


    this.invoiceService.findInvoiceById(parseInt(this.id as string)).subscribe(data => {
      console.log(data)

      this.invoiceForm.patchValue({
        invoiceId: data.invoiceId,
        casherName: data.casherName,
        date: data.date,
        township: data.township,
        remark: data.remark,
        totalAmount: data.totalAmount // Adjust as per your data structure
      });

      this.clearInvoiceDetails();

      data.invoiceDetailDtos.forEach((detail: { id:any; item: any; price: any; quantity: any; setAmount: any; }) => {
        this.invoiceDetails.push(this.fb.group({
          id:detail.id,
          item: detail.item,
          price: detail.price,
          quantity: detail.quantity,
          setAmount: detail.setAmount
        }));
        this.updateTotalAmount();

      });

    })
  }
  invoiceForm: FormGroup;
  
  constructor(private invoiceService:InvoicesService,private fb: FormBuilder,private router:Router,private route: ActivatedRoute) {
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
      id:[null],
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

  clearInvoiceDetails() {
    while (this.invoiceDetails.length !== 0) {
      this.invoiceDetails.removeAt(0);
    }
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
  
      this.invoiceService.updateInvoice(invoiceCreateRequest).subscribe(
        data => {
          console.log(data);
        }
      );
      this.router.navigate(['/']); // Navigate upon successful creation

    } else {
      this.invoiceForm.markAllAsTouched(); // Mark all form fields as touched to trigger validation messages
      console.log("Form data:", this.invoiceForm.value);
    }
  }

  onDelete() {
    this.invoiceService.deleteInvoice(parseInt(this.id as string)).subscribe(data => {
      console.log(data);
      
    })
    this.router.navigate(['/'])
  }

  numberWithCommas(x: number): string {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  private extractFormData(formGroup: FormGroup): any {
    const formData = { ...formGroup.value };
    return formData;
  }

}




