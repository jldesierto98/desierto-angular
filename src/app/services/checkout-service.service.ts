import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../common/purchase';
import { Observable } from 'rxjs';
import { PurchaseResponse } from '../response/purchase-response';
import { environment } from 'src/environments/environment';
import { PaymentInfo } from '../common/payment-info';

@Injectable({
  providedIn: 'root'
})
export class CheckoutServiceService {
  
  private purchaseUrl = environment.desiertoecommerceBackendUrl + '/purchase/buy';

  private paymentIntentUrl = environment.desiertoecommerceBackendUrl + '/api/payment/payment-intent';

  constructor(private httpClient: HttpClient) { }


  purchaseItem(purchase: Purchase): Observable<PurchaseResponse>{
    return this.httpClient.post<PurchaseResponse>(`${this.purchaseUrl}`, purchase);
  }

  createPaymentIntent(paymentInfo: PaymentInfo): Observable<any>{
    return this.httpClient.post<PaymentInfo>(this.paymentIntentUrl, paymentInfo);
  }
}
