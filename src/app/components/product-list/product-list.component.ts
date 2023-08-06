import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';
import { ProductListRequest } from 'src/app/request/product-list-request';
import { ProductListResponse } from 'src/app/response/product-list-response';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  productListResponse: ProductListResponse[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string = "";
  searchMode: boolean = false;

  //pagination properties
  thePageNumber: number = 1;
  thePageSize: number = 10;
  theTotalElements: number = 40;
  

  constructor(private productService: ProductService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode){
      this.handleSearchProducts();
    }
    else{
      this.handleListProducts();
    }
      
  }

  
    handleListProducts() {
    // check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // get the "id" param string. convert string to a number using the "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;

      // get the "name" param string
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
    }
    else {
      // not category id available ... default to category id 1 and 'Books'
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books';
    }

    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId: ${this.currentCategoryId}, thePageNumber: ${this.thePageNumber}, thePageSize: ${this.thePageSize}`);

    const productListRequest = new ProductListRequest(this.currentCategoryId, 
      this.thePageNumber - 1, this.thePageSize);

    console.log(`id: ${productListRequest.id}, pageNumber: ${productListRequest.page}, pageSize: ${productListRequest.size}` )

      
                      // now get the products for the given category id
                      //this.productService.getProductListPaginate(this.thePageNumber - 1,
                      //  this.thePageSize,
                      //  this.currentCategoryId)
                       // .subscribe(
                       // data => {
                       //   this.products = data._embedded.products;
                       //   this.thePageNumber = data.page.number + 1;
                       //   this.thePageSize = data.page.size;
                        //  this.theTotalElements = data.page.totalElements;
                       // }                                     
                       // );

                     // this.productService.getProductListPaginate(this.thePageNumber - 1,
                      //  this.thePageSize,
                      //  this.currentCategoryId)
                      //  .subscribe(
                     //    data => {
                      //     this.products = data._embedded.products;
                       //    this.thePageNumber = data.page.number + 1;
                       //    this.thePageSize = data.page.size;
                       //    this.theTotalElements = data.page.totalElements;
                      //   }                                     
                      //  );

    this.productService.productListPaginated(productListRequest).subscribe(
        data => {
          this.productListResponse = data;
        }
    )               
  }

  handleSearchProducts() {
    const keyWord: string = this.route.snapshot.paramMap.get('keyword')!;

    //search for the product using keyword
    this.productService.searchProducts(keyWord).subscribe(
      data => {
        this.products = data;
      }
    );


  }

}
