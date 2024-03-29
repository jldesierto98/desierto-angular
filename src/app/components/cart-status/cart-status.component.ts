import { Component, OnInit } from '@angular/core';
import { AddToCartResponse } from 'src/app/response/add-to-cart-response';
import { AddToCartService } from 'src/app/services/add-to-cart-service.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent implements OnInit {
  
  totalPrice: number = 0.0;
  totalQuantity: number = 0;
  initalQuantity: number = 0;

  constructor(private cartService: AddToCartService) { }

  ngOnInit(): void {
    
    // Subscribe to the totalPrice and totalQuantity subjects
    this.cartService.totalPrice.subscribe(price => {
      this.totalPrice = price;
      console.log(`totalPriceCartService2 : ${price}`);
    }); 

    this.cartService.totalQuantity.subscribe(quantity => {
      this.totalQuantity = quantity;
    });

    this.initalQuantity = 0;

    console.log(`==TotalPrice:${this.totalPrice}||totalQuantity:${this.totalQuantity}`);


  }





}
