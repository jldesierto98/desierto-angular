export class ProductSearchRequest {

    constructor(public keyword: string,
                public page: number,
                public size: number){
        }
}
