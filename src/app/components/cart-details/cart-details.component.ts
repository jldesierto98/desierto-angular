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
  productInCart: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private cartService: AddToCartService) { }

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails() {

       this.productInCart = this.cartService.products;

       this.cartService.totalPrice.subscribe(price => {
        this.totalPrice = price;
      });
  
      this.cartService.totalQuantity.subscribe(quantity => {
        this.totalQuantity = quantity;
      });

       console.log(`TOTAL PRICE IN CART : ${this.totalPrice} || TOTAL QUANTITY IN CART : ${this.totalQuantity}`);

  }

}
