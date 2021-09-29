// 实现每隔两秒输出 name

function A(name) {
  this.name = name;
}

A.prototype.log = function (){
  // 箭头函数中 this 指向函数最外层作用域，最外层是 A，因此可以拿到 name
  setInterval(  ()=>{
    console.log(this.name,'name')
  }, 2000);
}


const a = new A("hello");
a.log();
