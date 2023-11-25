import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../common/purchase';
import { Observable } from 'rxjs';
import { PurchaseResponse } from '../response/purchase-response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckoutServiceService {
  
  private purchaseUrl = environment.desiertoecommerceBackendUrl + '/purchase/buy';

  constructor(private httpClient: HttpClient) { }


  purchaseItem(purchase: Purchase): Observable<PurchaseResponse>{
    return this.httpClient.post<PurchaseResponse>(`${this.purchaseUrl}`, purchase);
  }
}
