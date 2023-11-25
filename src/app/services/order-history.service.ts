import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';
import { OrderHistoryRequest } from '../request/order-history-request';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {


  private getOrderHistoryUrl = environment.desiertoecommerceBackendUrl + '/order/orderHistory';


  constructor(private httpClient: HttpClient) { }

  getOrderHistoryPaginate(request: OrderHistoryRequest): Observable<OrderHistory[]>
  {
  return this.httpClient.post<OrderHistory[]>(this.getOrderHistoryUrl, request);                          
  }


}



// interface GetResponseOrderHistory {
//   _embedded: {
//     orders: OrderHistory[];
//   }

