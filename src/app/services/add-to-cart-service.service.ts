import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AddToCartResponse } from '../response/add-to-cart-response';
import { HttpClient } from '@angular/common/http';
import { ProductInCart } from '../common/product-in-cart';

@Injectable({
  providedIn: 'root'
})
export class AddToCartService {

  private addToCartUrl = 'http://localhost:8080/product/';
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();



  constructor(private httpClient: HttpClient) { }

  addToCart(productId: number): Observable<ProductInCart>{
      return this.httpClient.post<ProductInCart>(`${this.addToCartUrl}${productId}`, productId);
  }

   updateTotals(response: ProductInCart) {
    this.totalPrice.next(response.totalPrice);
    this.totalQuantity.next(response.totalQuantity);
    
    console.log(`TOTAL PRICE : ${response.totalPrice} || TOTAL QUANTITY : ${response.totalQuantity}`);
  }

  
}
