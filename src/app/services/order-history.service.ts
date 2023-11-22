import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {


  private getOrderHistoryUrl = 'http://localhost:8080/order/orderHistory';


  constructor(private httpClient: HttpClient) { }

  getOrderHistoryPaginate(theEmail: string): Observable<GetResponseOrderHistory>
  {
  return this.httpClient.get<GetResponseOrderHistory>(this.getOrderHistoryUrl);                          
  }


}

interface GetResponseOrderHistory {
  _embedded: {
    orders: OrderHistory[];
  }
}
