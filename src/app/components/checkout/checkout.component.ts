import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { ProductInCart } from 'src/app/common/product-in-cart';
import { AddToCartService } from 'src/app/services/add-to-cart-service.service';
import { FormActionService } from 'src/app/services/form-action.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;
  totalQuantity: number = 0;
  productInCart!: ProductInCart;
  totalPrice: number = 0;
  theMonths: number[] = [];
  theYears: number[] = [];
  theCountries: Country[] = [];
  
  constructor(private formBuilder: FormBuilder,
    private cartService: AddToCartService,
    private formActionService: FormActionService) { }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city:[''],
        state:[''],
        country:[''],
        zipcode:['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city:[''],
        state:[''],
        country:[''],
        zipcode:['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        state: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })

    });

    if (this.cartService.productInCart) {
      this.productInCart = this.cartService.productInCart;
  
      if (this.productInCart.totalPrice == undefined && this.productInCart.totalQuantity == undefined) {
        this.totalPrice = 0;
        this.totalQuantity = 0;
      } else {
        this.totalPrice = this.productInCart.totalPrice || 0; // Use default value if undefined
        this.totalQuantity = this.productInCart.totalQuantity || 0; // Use default value if undefined
    
      }
    } else {
      // Handle the case where this.cartService.productInCart is undefined.
      this.cartService.totalPrice.subscribe(price => {
        this.totalPrice = price;
      });

      this.cartService.totalQuantity.subscribe(quantity => {
        this.totalQuantity = quantity;
      });


    }

    console.log(`CHECKOUT COMP QUANTITY =======> ${this.totalQuantity}`);

    const startMonth: number = new Date().getMonth() + 1;

    this.formActionService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.theMonths = data;
      }
    );

    this.formActionService.getCreditCardYears().subscribe(
      data => {
        this.theYears = data;
      }
    );

    this.formActionService.getCountries().subscribe(
      data => {
        this.theCountries = data;
      }
    );
  

  }

  onSubmit() {
    console.log("Handling submit button");
    console.log(this.checkoutFormGroup.get('customer')?.value);
  }

  copyShippingAddressToBillingAddress(event : any){

    if(event.target.checked){
      this.checkoutFormGroup.controls['billingAddress']
      .setValue(this.checkoutFormGroup.controls['shippingAddress'].value)
    }
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
    }

  }

  handleMonthsAndYears(){

    const creditCardForGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardForGroup?.value.expirationYear);

    let startMonth: number;

    //if current year is equal to selected year, start with current month
    if(currentYear == selectedYear){
      startMonth = new Date().getMonth() + 1;
    }else{
      startMonth = 1;
    }

    this.formActionService.getCreditCardMonths(startMonth).subscribe(data => {
      this.theMonths = data;
    })

  }
}
