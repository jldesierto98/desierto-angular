import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';
import { ProductListRequest } from '../request/product-list-request';
import { ProductListResponse } from '../response/product-list-response';
import { ProductSearchRequest } from '../request/product-search-request';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  //backend API
  private baseUrl = 'http://localhost:8080/api/products/';
  private categoryUrl = 'http://localhost:8080/api/product-category';
  private baseUrl2 = 'http://localhost:8080/product/productById';
  private baseUrl3 = 'http://localhost:8080/product/';
  private searchByKeywordPaginatedUrl = 'http://localhost:8080/product/search';

  //inject HttpClient
  constructor(private httpClient: HttpClient) { }


  getProductListPaginate(thePage: number,
    thePageSize: number,
    theCategoryId: number): Observable<GetResponseProducts> {

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
      + `&page=${thePage}&size=${thePageSize}`

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }


  getProductList(theCategoryId: number): Observable<ProductListResponse[]> {
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.getProducts(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  searchProducts(keyWord: string): Observable<ProductListResponse[]> {
    const searchUrl: string = `${this.baseUrl}search/findByNameContaining?name=${keyWord}`;

    return this.getProducts(searchUrl)
  }


  productListPaginated(request: ProductListRequest): Observable<ProductListResponse[]> {
    return this.httpClient.post<ProductListResponse[]>(this.baseUrl2, request);
  }

  productSearchListPaginated(request: ProductSearchRequest): Observable<ProductListResponse[]> {
    return this.httpClient.post<ProductListResponse[]>(this.searchByKeywordPaginatedUrl, request);
  }


  private getProducts(searchUrl: string): Observable<ProductListResponse[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  private getProductDetailsById(id: number): Observable<ProductListResponse>{
    return this.httpClient.get<ProductListResponse>(this.baseUrl3)
  }

  getProduct(theProductId: number): Observable<ProductListResponse> {
    return this.httpClient.get<ProductListResponse>(`${this.baseUrl3}${theProductId}`);
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

interface GetResponseProductsRequest {
  _embedded: {
    productsList: ProductListResponse[];

  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}

interface GetProductMasterViewResponse {
    productMasterView: ProductListResponse;
}
