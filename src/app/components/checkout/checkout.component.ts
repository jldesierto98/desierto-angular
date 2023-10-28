import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { State } from 'src/app/common/state';
import { Country } from 'src/app/common/country';
import { ProductInCart } from 'src/app/common/product-in-cart';
import { AddToCartService } from 'src/app/services/add-to-cart-service.service';
import { FormActionService } from 'src/app/services/form-action.service';
import { ValidatorsUtils } from 'src/app/validators/validators-utils';

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
  theStates: State[] = [];  
  theStatesBilling: State[] = [];
  constructor(private formBuilder: FormBuilder,
    private cartService: AddToCartService,
    private formActionService: FormActionService) { }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: ['', [Validators.required, Validators.minLength(2), ValidatorsUtils.notOnlyWhitespace]],
        lastName: ['', [Validators.required, Validators.minLength(2), ValidatorsUtils.notOnlyWhitespace]],
        email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]]
      }),
      shippingAddress: this.formBuilder.group({
        street: ['', [Validators.required, ValidatorsUtils.notOnlyWhitespace]],
        city:['', [Validators.required, ValidatorsUtils.notOnlyWhitespace]],
        state:['', [Validators.required]],
        country:['', [Validators.required]],
        zipcode:['', [Validators.required]]
      }),
      billingAddress: this.formBuilder.group({
        street: ['', [Validators.required, ValidatorsUtils.notOnlyWhitespace]],
        city:['', [Validators.required, ValidatorsUtils.notOnlyWhitespace]],
        state:['', [Validators.required]],
        country:['', [Validators.required]],
        zipcode:['', [Validators.required]]
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
    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
    }
    console.log("Handling submit button");
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log(this.checkoutFormGroup.get('billingAddress')?.value);
    console.log(this.checkoutFormGroup.get('shippingAddress')?.value);
  }


  //customer form getters
  get firstName(){
    return this.checkoutFormGroup.get('customer.firstName');
  }

  get lastName(){
    return this.checkoutFormGroup.get('customer.lastName');
  }

  get emailAddress(){
    return this.checkoutFormGroup.get('customer.email');
  }

  //shipping address form getters
  get shippingAddressStreet(){
    return this.checkoutFormGroup.get('shippingAddress.street');
  }

  get shippingAddressZipCode(){
    return this.checkoutFormGroup.get('shippingAddress.zipcode');
  }

  get shippingAddressCity(){
    return this.checkoutFormGroup.get('shippingAddress.city');
  }

  get shippingAddressCountry(){
    return this.checkoutFormGroup.get('shippingAddress.country');
  }

  get shippingAddressState(){
    return this.checkoutFormGroup.get('shippingAddress.state');
  }

  //billing address form getters
  get billingAddressStreet(){
    return this.checkoutFormGroup.get('billingAddress.street');
  }

  get billingAddressCity(){
    return this.checkoutFormGroup.get('billingAddress.city');
  }

  get billingAddressZipCode(){
    return this.checkoutFormGroup.get('billingAddress.zipcode');
  }

  get billingAddressCountry(){
    return this.checkoutFormGroup.get('billingAddress.country');
  }

  get billingAddressState(){
    return this.checkoutFormGroup.get('billingAddress.state');
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

  handleCountryState(formGroupName: string){
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;
    const countryId = formGroup?.value.country.id;

    this.formActionService.getStateByCountryId(countryId).subscribe(data =>{
      this.theStates = data;
    });

  }

  handleCountryStateBilling(formGroupName: string){
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;
    const countryId = formGroup?.value.country.id;

    this.formActionService.getStateByCountryId(countryId).subscribe(data =>{
      this.theStatesBilling = data;
    });

  }
}
