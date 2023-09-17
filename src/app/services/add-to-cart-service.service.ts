import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AddToCartResponse } from '../response/add-to-cart-response';
import { HttpClient } from '@angular/common/http';
import { ProductInCart } from '../common/product-in-cart';
import { Product } from '../common/product';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class AddToCartService {

  private addToCartUrl = 'http://localhost:8080/product/';
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();
  productInCart!: ProductInCart;
  initialQuantity: number = 0;



  constructor(private httpClient: HttpClient) {
    this.totalQuantity.next(0);
   }

  addToCart(productId: number): Observable<ProductInCart>{
      return this.httpClient.post<ProductInCart>(`${this.addToCartUrl}${productId}`, productId);
  }

   updateTotals(response: ProductInCart) {
    this.totalPrice.next(response.totalPrice);
    this.totalQuantity.next(response.totalQuantity);
    this.productInCart = response;
  }

  
}
