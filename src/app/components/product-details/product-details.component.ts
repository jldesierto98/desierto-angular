import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductListResponse } from 'src/app/response/product-list-response';
import { AddToCartService } from 'src/app/services/add-to-cart-service.service';
import { ProductService } from 'src/app/services/product.service';



@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})

export class ProductDetailsComponent implements OnInit {

  product!: ProductListResponse;

  constructor(private productService: ProductService,
              private cartService: AddToCartService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    })
  }


  handleProductDetails() {
    const theProductId: number = +this.route.snapshot.paramMap.get('id')!;

    this.productService.getProduct(theProductId).subscribe(
      data => {
        this.product = data;
      }
    )
  }

  addToCart(product: ProductListResponse) {
  
    this.cartService.addToCart(product.id).subscribe(response => {
      this.cartService.updateTotals(response);
    });
  }


}
