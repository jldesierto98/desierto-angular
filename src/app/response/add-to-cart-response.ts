import { Product } from "../common/product";

export class AddToCartResponse {

    constructor(public totalPrice: number,
                public totalQuantity: number,
                public products: Product[]){

                }
}
