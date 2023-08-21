import { ProductInCart } from "./product-in-cart";

export class CartItem {

    constructor(public id: number,
                public name: string,
                public unitPrice: number,
                public subTotalPrice: number,
                public quantityInCart: number){
    }
}
