import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { ProductInCart } from 'src/app/common/product-in-cart';
import { AddToCartService } from 'src/app/services/add-to-cart-service.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {
  productInCart!: ProductInCart;
  totalPrice: number = 0.0;
  totalQuantity: number = 0;
  initialQuantity: number = 0;

  constructor(private cartService: AddToCartService) {
    this.initialQuantity = 0;
   }

  ngOnInit(): void {
    
    this.productInCart = this.cartService.productInCart;

    if (this.cartService.productInCart) {
      this.productInCart = this.cartService.productInCart;
  
      if (this.productInCart.totalPrice == undefined && this.productInCart.totalQuantity == undefined) {
        this.totalPrice = 0;
        this.totalQuantity = 0;
      } else {
        this.totalPrice = this.productInCart.totalPrice || 0; // Use default value if undefined
        this.totalQuantity = this.productInCart.totalQuantity || 0; // Use default value if undefined
        this.initialQuantity++;
      }
    } else {
      // Handle the case where this.cartService.productInCart is undefined.
     // Create a new empty ProductInCart or handle it accordingly.
      this.cartService.totalPrice.subscribe(price => {
        this.totalPrice = price;
      });

      this.cartService.totalQuantity.subscribe(quantity => {
        this.totalQuantity = quantity;
      });


    }

  
   


    console.log(`====xXTotalPrice:${this.totalPrice}=======||===TotalQuantity:${this.totalQuantity}========`);
  }

}


