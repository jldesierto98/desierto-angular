import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AddToCartResponse } from '../response/add-to-cart-response';
import { HttpClient } from '@angular/common/http';
import { ProductInCart } from '../common/product-in-cart';
import { Product } from '../common/product';
import { CartItem } from '../common/cart-item';
import { Purchase } from '../common/purchase';
import { PurchaseResponse } from '../response/purchase-response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddToCartService {

  private addToCartUrl = environment.desiertoecommerceBackendUrl + '/product/';
  private decrement = 'decrement/';
  private remove = 'remove/';
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);
  productInCart!: ProductInCart;
  initialQuantity: number = 0;

  storage: Storage = sessionStorage;

  constructor(private httpClient: HttpClient) {
    this.totalQuantity.next(0);

    //read data from storage
    let data = JSON.parse(this.storage.getItem('productInCart')!);
    console.log(data);
    
    if(data != null){
      this.productInCart = data;

      this.updateTotals(this.productInCart);
    }

   }

  addToCart(productId : number): Observable<ProductInCart>{
      return this.httpClient.post<ProductInCart>(`${this.addToCartUrl}${productId}`, productId);
  }

  decrementQuantity(productId : number): Observable<ProductInCart>{
     return this.httpClient.post<ProductInCart>(`${this.addToCartUrl}${this.decrement}${productId}`, productId);
  }

  removeItem(productId : number): Observable<ProductInCart>{
     return this.httpClient.post<ProductInCart>(`${this.addToCartUrl}${this.remove}${productId}`, productId)
  }

  updateTotals(response: ProductInCart) {
    this.totalPrice.next(response.totalPrice);
    this.totalQuantity.next(response.totalQuantity);
    this.productInCart = response;
    this.persistCartItems();
  }

  persistCartItems(){
    this.storage.setItem('productInCart', JSON.stringify(this.productInCart));
  }



  
}
