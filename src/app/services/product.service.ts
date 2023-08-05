import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';
import { ProductListRequest } from '../request/product-list-request';
import { ProductListResponse } from '../response/product-list-response';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  

  //the base url of our API in backend. 
  private baseUrl = 'http://localhost:8080/api/products/';
  private categoryUrl = 'http://localhost:8080/api/product-category';
  private baseUrl2 = 'http://localhost:8080/product/productById';

 

  //inject HttpClient
  constructor(private httpClient: HttpClient) { }

  //method to get the product list from our backend
  //map the JSON data from backend (SpringBoot) to Product array.
  getProductListPaginate(thePage:number, 
                         thePageSize: number, 
                         theCategoryId: number): Observable<GetResponseProducts>{
    //build the URL
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                          + `&page=${thePage}&size=${thePageSize}`

    return this.httpClient.get<GetResponseProducts>(searchUrl);
}

  //method to get the product list from our backend
  //map the JSON data from backend (SpringBoot) to Product array.
  getProductList(theCategoryId: number): Observable<Product[]>{
      //build the URL
      const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

      return this.getProducts(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]>{
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  searchProducts(keyWord: string): Observable<Product[]> {
      const searchUrl: string = `${this.baseUrl}/search/findByNameContaining?name=${keyWord}`;

      return this.getProducts(searchUrl)
  }


  getProductListPaginate(thePage: number, 
                         thePageSize: number, 
                         theCategoryId: number): Observable<GetResponseProducts> {

    // need to build URL based on category id, page and size 
    const searchUrl = `${this.baseUrl}search/findByCategoryId?id=${theCategoryId}`
                    + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  

  productListPaginated(request: ProductListRequest): Observable<ProductListResponse[]>{
     return this.httpClient.post<ProductListResponse[]>(this.baseUrl2, request);

  getProduct(theProductId: number) {

    //need to build URL based on product id
    const productUrl = `${this.baseUrl}/${theProductId}`;
    
    return this.httpClient.get<Product>(productUrl);

  }



  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }




}

//method to unwrap JSON from SpringBoot DATA REST 
interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number

  }
}

interface GetResponseProductsRequest{
  _embedded: {
    productsList: ProductListResponse[];

  }
}

interface GetResponseProductCategory{ 
  _embedded:{
    productCategory: ProductCategory[];
  }
}
