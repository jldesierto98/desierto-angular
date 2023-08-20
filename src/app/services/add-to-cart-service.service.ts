import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AddToCartResponse } from '../response/add-to-cart-response';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AddToCartService {

  private addToCartUrl = 'http://localhost:8080/product/';
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();



  constructor(private httpClient: HttpClient) { }

  addToCart(productId: number): Observable<AddToCartResponse>{
      return this.httpClient.post<AddToCartResponse>(`${this.addToCartUrl}${productId}`, productId);
  }

  updateTotals(response: AddToCartResponse) {
    this.totalPrice.next(response.totalPrice);
    this.totalQuantity.next(response.totalQuantity);
    
    console.log(`TOTAL PRICE : ${response.totalPrice} || TOTAL QUANTITY : ${response.totalQuantity}`);
  }

  
}
