import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductListResponse } from 'src/app/response/product-list-response';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  productListResponse: ProductListResponse[] = [];


  constructor(private router: Router,
              private productService: ProductService) { }

  ngOnInit(): void {
  }

  doSearch(value: string){
    console.log(`value=${value}`);
    this.router.navigateByUrl(`/search/${value}`);
  }



}
