import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  

  //the base url of our API in backend. 
  private  baseUrl = 'http://localhost:8080/api/products';
  private categoryUrl = 'http://localhost:8080/api/product-category';

 

  //inject HttpClient
  constructor(private httpClient: HttpClient) { }

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



  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }
}

//method to unwrap JSON from SpringBoot DATA REST 
interface GetResponseProducts{
  _embedded:{
    products: Product[];
  }
}

interface GetResponseProductCategory{ 
  _embedded:{
    productCategory: ProductCategory[];
  }
}
