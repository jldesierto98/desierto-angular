import { CartItem } from "./cart-item";

export class ProductInCart {

    constructor(public totalPrice: number,
        public totalQuantity: number,
        public productInCart: CartItem[]){
    }
}
