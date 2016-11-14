import {Token} from "./Token"
//去掉字符串首尾空格
String.prototype.trim=function() {
    return this.replace(/(^\s*)|(\s*$)/g,'');
}


class Tokenizer{
    tokens:Array<Token>;
    input:string;
    errors;
    constructor(public str){
        this.input = str;
        this.tokens=[];
        this.errors = [];
        this.getTokens();
    }
    // 获取Token流的方法
    getTokens(){
        let current = 0,
            input = this.input.trim(),
            finalstr = ""; 
        while(current < input.length){
            //获取一个当前的字符
            let currentChar = input[current];
            //检查是不是单界符 +,-,/,*,(,)
            let regexp = /[+\-/*()]/;
            if(regexp.test(currentChar)){
                switch(currentChar){
                    case '+':{
                        let token = new Token(1,currentChar,"NULL","NULL");
                        this.tokens.push(token);
                        break;
                    };
                    case '-':{
                        let token = new Token(2,currentChar,"NULL","NULL");
                        this.tokens.push(token);
                        break;
                    };
                    case '*':{
                        let token = new Token(3,currentChar,"NULL","NULL");
                        this.tokens.push(token);
                        break;
                    };
                    case '/':{
                        let token = new Token(4,currentChar,"NULL","NULL");
                        this.tokens.push(token);
                        break;
                    };
                    case '(':{
                        let token = new Token(6,currentChar,"NULL","NULL");
                        this.tokens.push(token);
                        break;
                    };
                    case ')':{
                        let token = new Token(7,currentChar,"NULL","NULL");
                        this.tokens.push(token);
                        break;
                    };
                }   
                current++;
                continue;
            }
            //检查是不是0
            if(currentChar == '0'){
                //这是字符为0的情况,后面只能是单界符或者为最后一个字符
                let regexp = /[+\-/*()]/;
                console.log(input[current+1]);
                if(input[current+1]=='' || regexp.test(input[current+1])){
                    let token = new Token(5,currentChar,'0',"int");
                    this.tokens.push(token);
                    current++;
                    continue;
                }
                //字符为0,后面跟着小数点的情况
                else if(input[current+1] ==='.'){
                    let value = "",
                        token;
                    //判断小数点后面的一位是不是整数,当前current是0
                    if(!/\d/.test(input[current+2])){
                        //  throw new SyntaxError("after . must be a number");
                        this.errors.push("after . must be a number");  
                    }
                    while(/\d/.test(currentChar) || currentChar === '.'){
                        value+=currentChar;
                        currentChar=input[++current];
                    }

                    if(isNaN(+value)){
                    //    throw new SyntaxError(value);  
                        this.errors.push("SyntaxError: "+value);
                    }
                    token = new Token(8,value,+value,"double");
                    this.tokens.push(token);
                    continue;
                }else{
                     let token = new Token(5,currentChar,currentChar,"NULL");
                     this.tokens.push(token);
                    // throw new SyntaxError("after 0 must is a .");  
                    this.errors.push("SyntaxError: "+"after 0 must is a .");
                    current++;
                    continue;
                }
  
            }

            //检查是不是非0整数
            if(/[1-9]/.test(currentChar)){
                let value = "";
                let token;
                let ponit = 0;
                //循环检查是不是0-9的整数
                while(/[\d|.]/.test(currentChar)){
                    if(currentChar == '.'){
                        ponit++;
                    }
                    value+=currentChar;
                    currentChar=input[++current];
                }
                if(ponit<=1){
                    if(value.indexOf('.') != -1){
                        token = new Token(8,value,value,"double");
                    }else{
                        token = new Token(5,value,value,"int");
                    }
                    this.tokens.push(token);
                    continue;                    
                }else{
                    this.errors.push("SyntaxError: "+value);
                    token = new Token(8,value,value,"double");
                    this.tokens.push(token);
                    continue; 
                }
              
                
            }
            // throw new TypeError('I dont know what this character is: ' + currentChar);  
            this.errors.push("TypeError: "+'I dont know what this character is: ' + currentChar);
        }          
        this.output();
        return this.tokens;  
    }
    //输出函数
    output(){
        let output="";
        for(let i=0;i<this.tokens.length;i++){
            output+="<div>("+this.tokens[i].codes+","+this.tokens[i].str+","+this.tokens[i].values+","+this.tokens[i].types+")</div>";
        }
        output+="<div>errors:</div>"
        for(let i=0;i<this.errors.length;i++){
            output+="<div>"+this.errors[i]+"</div>";
        }
       document.write(output);
    }
}

document.getElementById("tokenBtn").onclick=function(){
    new Tokenizer(document.querySelector("#str").value);
}