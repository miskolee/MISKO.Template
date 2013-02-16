/***   MISKO ECMAScript 工具集
 ***  模板引擎工具
 ***  用于本地应用开发。服务器不再推送HTML页面，而是推送数据。
 ***  模板引擎解析数据将数据绑定到指定位置。节约网络传输流量，疏解
 ***  服务器压力
 ***  @author Misko_Lee
 ***  @created 2013-01-18 23:58
 ***  @version 0.51
 ***  ================== 语法 ==============================
 ***  1.变量使用{?以及?}分别作为左右定界符。定界符内为变量。变量为数据object属性名
 ***  2.支持简单数学运算
 ***  3.无法解析的变量将不解析
 ***  Example:
 ***  data = {title:'title',content:'testContent'}
 ***  <h1>{?title?}</h1><p>{?content?}
 ***  使用数组作为数据源，形成listview
 ***  data = [{name:'misko',age:'15'},{name:'lee',age:'23'}]
 ***  <div><span>{?name?}</span>{?age?}</div>
 ***  =======================================================
 ***  未来版本将按需加入一定的变量调节器以及格式化方法
 * ***/
// defined namespace
window.MISKO = window.MISKO || {};
window.MISKO.UI = window.MISKO.UI || {};
window.MISKO.UI.Template ={
    findVarReg :/\{\?.*?\?\}/g,
    varReg:/(\w[\w|\d|_]+)|([\+|\-|\*|\/|\%])/g,
    data:null,
    tpl:null,
    //编译器
    _compile:function(data){
        var partten = this.findVarReg;
        var varPartten =this.varReg;
        var text = String(this.tpl);
        var match = text.match(partten);
        var compileVar = new Array();
        for(var i=0;i<match.length;i++){
            var vars = match[i].match(varPartten);

            if(typeof vars =='object'){
                var res = '';
                for(var j =0;j<vars.length;j++){
                    //console.log(vars[i]);
                    var d = new String(vars[j]).slice(0,1);
                    //  console.log(d);
                    if(d =='+' || d =='-' || d =='*' || d =='/' || d =='%'){
                        res+=vars[j];
                        continue;
                    }

                    res+='data.'+vars[j];



                }
            }


            compileVar[i]=eval(res)
            if(typeof compileVar[i] == 'undefined'){

                compileVar[i]=match[i];

            }
            text = text.replace(match[i],compileVar[i]);
        }
        return text;
    },
    //数组编译
    _compileArrayData:function(array){
        var result = '';
        for(var i=0;i<array.length;i++){
            //console.log(array[])
            result+=this._compile(array[i]);
        }
        return result;
    },
    //编译API，检测数据类型调用不同种类的编译器
    compile:function(){
        if(this.data instanceof Array){
            return this._compileArrayData(this.data);
        }else{
            return this._compile(this.data);
        }
    },
    //重载数据
    reLoad:function(data){
        if(data){
        this.data=data;
        }
        return this.compile();
    },
    //更改模板
    changeTpl:function(text){
        this.tpl=text;
        return this.compile();
    },
    constructor:function(tpl,data){
        this.tpl=tpl;
        this.data=data;
        return this;
    }
};
window.MISKO.UI.MSTemplate = function(tpl,data){
    this.constructor = window.MISKO.UI.Template.constructor;
    this.__proto__= window.MISKO.UI.Template;
}
/***
var tpl = new window.MISKO.UI.MSTemplate('aa','bb');
console.log(tpl.tpl);
****/


