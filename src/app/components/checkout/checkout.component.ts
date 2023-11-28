import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { State } from 'src/app/common/state';
import { Country } from 'src/app/common/country';
import { ProductInCart } from 'src/app/common/product-in-cart';
import { AddToCartService } from 'src/app/services/add-to-cart-service.service';
import { FormActionService } from 'src/app/services/form-action.service';
import { ValidatorsUtils } from 'src/app/validators/validators-utils';
import { CheckoutServiceService } from 'src/app/services/checkout-service.service';
import { Router } from '@angular/router';
import { Order } from 'src/app/common/order';
import { CartItem } from 'src/app/common/cart-item';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { Customer } from 'src/app/common/customer';
import { environment } from 'src/environments/environment';
import { PaymentInfo } from 'src/app/common/payment-info';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;
  totalQuantity: number = 0;
  // productInCart!: ProductInCart;
  totalPrice: number = 0;
  theMonths: number[] = [];
  theYears: number[] = [];
  theCountries: Country[] = [];
  theStates: State[] = [];  
  theStatesBilling: State[] = [];

  storage: Storage = sessionStorage;

  stripe = Stripe(environment.stripePublishableKey);

  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = "";

  constructor(private formBuilder: FormBuilder,
              private cartService: AddToCartService,
              private formActionService: FormActionService,
              private checkOutService: CheckoutServiceService,
              private router: Router) { }

  ngOnInit(): void {

    // setup Stripe payment form
    this.setupStripePaymentForm();

    //read user's email through browser storage
    const theEmail = JSON.parse(this.storage.getItem('userEmail')!)

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: ['', [Validators.required, Validators.minLength(2), ValidatorsUtils.notOnlyWhitespace]],
        lastName: ['', [Validators.required, Validators.minLength(2), ValidatorsUtils.notOnlyWhitespace]],
        email: [theEmail, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]]
      }),
      shippingAddress: this.formBuilder.group({
        street: ['', [Validators.required, ValidatorsUtils.notOnlyWhitespace]],
        city:['', [Validators.required, ValidatorsUtils.notOnlyWhitespace]],
        state:['', [Validators.required]],
        country:['', [Validators.required]],
        zipCode:['', [Validators.required]]
      }),
      billingAddress: this.formBuilder.group({
        street: ['', [Validators.required, ValidatorsUtils.notOnlyWhitespace]],
        city:['', [Validators.required, ValidatorsUtils.notOnlyWhitespace]],
        state:['', [Validators.required]],
        country:['', [Validators.required]],
        zipCode:['', [Validators.required]]
      }),
      creditCard: this.formBuilder.group({
        /*
        cardType: ['', [Validators.required]],
        nameOnCard: ['', [Validators.required, Validators.minLength(2), ValidatorsUtils.notOnlyWhitespace]],
        cardNumber: ['', [Validators.required, Validators.pattern('[0-9]{16}')]],
        securityCode: ['', [Validators.required, Validators.pattern('[0-9]{3}')]],
        expirationMonth: [''],
        expirationYear: ['']
        */

      })

    });

   
    //update review cart
    this.reviewCartStatus();

    console.log(`CHECKOUT COMP QUANTITY =======> ${this.totalQuantity}`);

    /*
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
    */

    this.formActionService.getCountries().subscribe(
      data => {
        this.theCountries = data;
      }
    );
  

  }  

  setupStripePaymentForm() {
    

      // get a handle to stripe elements
      var elements = this.stripe.elements();
  
      // Create a card element ... and hide the zip-code field
      this.cardElement = elements.create('card', { hidePostalCode: true });
  
      // Add an instance of card UI component into the 'card-element' div
      this.cardElement.mount('#card-element');
  
      // Add event binding for the 'change' event on the card element
      this.cardElement.on('change', (event: { complete: any; error: { message: any; }; }) => {
  
        // get a handle to card-errors element
        this.displayError = document.getElementById('card-errors');
  
        if (event.complete) {
          this.displayError.textContent = "";
        } else if (event.error) {
          // show validation error to customer
          this.displayError.textContent = event.error.message;
        }
  
      });
    
  }

  reviewCartStatus() {

    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );

    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );

  }



  onSubmit() {

    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    const cartItems = this.cartService.productInCart.products;

    // let orderItems : OrderItem[] = [];

    // for(let i = 0; i < cartItems.length; i++){
    //   orderItems[i] = new OrderItem(cartItems[i]);
    // }

    let orderItems: OrderItem[] = cartItems
                                    .map(tempCartItems => new OrderItem(tempCartItems));

                            

    let purchase = new Purchase();

    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingState.name;

    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;
    


    purchase.orders = order;
    purchase.orderItems = orderItems;
    

    // handle payment info as per Stripe's requirements
    // Dollar to Cents
    this.paymentInfo.amount = Math.round(this.totalPrice * 100);
    this.paymentInfo.currency = "USD";

    console.log("====PURCHASE==== : " + JSON.stringify(purchase));

    /*
    this.checkOutService.purchaseItem(purchase).subscribe({

      next: response => {
        alert(`Your order has been received. \nOrder Tracking Number : ${response.orderTrackingNumber}`);
        this.resetCart();
      },
      error: err =>{
        alert(`There was an error: ${err.message}`);
      }
    })
    */


    // if form is valid
    // - create payment intent
    // - confirm card payment
    // - place order

    if(!this.checkoutFormGroup.invalid && this.displayError.textContent === "") {

      this.checkOutService.createPaymentIntent(this.paymentInfo).subscribe(
        (paymentIntentResponse) => {
          //send credit card data to stripe.com servers
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret, 
            {
              payment_method: {
                card: this.cardElement
              }
            }, {handleActions: false})
            .then((result: any) => {
              if(result.error){
                //inform the customer that there was an error
                alert(`There was an error:  ${result.error.message}`)
              } else {
                // Call REST API via CheckOutService
                this.checkOutService.purchaseItem(purchase).subscribe({
                  next: (response: any) => {
                    alert(`Your order has been received. \nOrder Tracking Number: ${response.orderTrackingNumber}`);

                    this.resetCart();
                  },
                  error: (err: any) => {
                    alert(`There was an error: ${err.message}`);
                  }
                })
              }
            })
        }
      );
    } else {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }


  }

  resetCart(){

    this.cartService.productInCart.products = []
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    this.checkoutFormGroup.reset();
    this.router.navigateByUrl("/products");
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
  
  //credit card form getters
  get creditCardType(){
    return this.checkoutFormGroup.get('creditCard.cardType');
  }

  get creditCardNameOnCard(){
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }

  get cardNumber(){
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }

  get creditCardSecurityCode(){
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }

  copyShippingAddressToBillingAddress(event : any){

    if(event.target.checked){

      this.checkoutFormGroup.controls['billingAddress']
      .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

      this.theStatesBilling = this.theStates;
     

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
