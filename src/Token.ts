class Token{
    codes:number;
    str:string;
    values:any;
    types:string;
    constructor(codes:number, str:string, values:any, types:string){
        this.codes = codes;
        this.str = str;
        this.values = values;
        this.types = types;
    }
}
export {Token};