export class OrderHistoryRequest {
    constructor(public email: string,
                public page: number,
                public pageSize: number){}
}
