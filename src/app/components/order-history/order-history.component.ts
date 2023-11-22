import { Component, OnInit } from '@angular/core';
import { OrderHistory } from 'src/app/common/order-history';
import { OrderHistoryRequest } from 'src/app/request/order-history-request';
import { OrderHistoryService } from 'src/app/services/order-history.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orderHistoryList: OrderHistory[] = [];
  storage: Storage = sessionStorage;

  constructor(private orderHistoryService: OrderHistoryService) { }

  ngOnInit(): void {
    this.handleOrderHistory();
  }

  handleOrderHistory() {
    //read the user's email address from browser storage
    const theEmail = JSON.parse(this.storage.getItem('userEmail')!);
    console.log('===== THE EMAIL ====== ' + theEmail);

    const orderHistoryRequest = new OrderHistoryRequest(theEmail, 0, 10);

    this.orderHistoryService.getOrderHistoryPaginate(orderHistoryRequest).subscribe(
      data => {
        this.orderHistoryList = data;
      }
    )
  }

}
