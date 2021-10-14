// function Foo():void {
//   return "123"
// }
//
// type Fn = (n: number)=>void;
//
// interface Func {
//   params: [number]
// }
//
//
// const fn2 = (n: number):string=>{
//   return "123"
// }
//
// interface Func2 {
//   params: [number]
//   return: string
// }
//
//
// const fn: Fn = fn2
//
//
// const v = fn2()
// const v2 = fn()
//
//
// abstract class A {
//   abstract fn(): void
// }
//
// class N implements A {
//   fn(): string {
//
//   }
// }
//
// // function A({name, age, address}:{name:string, age:number, address?:string}){
// //
// // }
//
// interface AAA {
//   name: string;
//   age: string;
// }
//
// interface B{
//   age: string;
// }
//
// const b: B = {
//   age: "11",
//   s:x
// }

interface Duck {
  name: string;
  age: number;
  city: string;
}

const aDuck = {
  name: "aDuck",
  age: 12,
  city: "America",
  price: 100,
};

const cDuck: Duck = {
  name: "aDuck",
  age: 12,
  city: "America",
  // favorite: "money"
}

function A(duck: Duck) {
  return duck;
}


A(aDuck);
A(cDuck);

A(/* const a: Duck = */{
  name: "dDuck",
  age: 10,
  city: "20",
  // greet: "hello"
})

// 赋值和函数传参时，类型会


interface Point2D {
  x: number;
  y: number;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

// let iTakePoint2D = (point: Point2D) => {};
// let iTakePoint3D = (point: Point3D) => {};

// iTakePoint3D = iTakePoint2D; // ok, 这是合理的
// iTakePoint2D = iTakePoint3D; // ok，为什么？


// interface Animal {
//   age: number
// }
//
// interface Dog extends Animal {
//   bark(): void
// }
//
// type MakeFunction<T> = (arg: T) => void
//
// let visitAnimal:MakeFunction<Animal> = (animal: Animal) => {
//   return animal.age
// }
//
// let visitDog:MakeFunction<Dog> = (dog: Dog) => {
//   dog.age
//   dog.bark()
// }

// interface Animal {
//   name: string;
// }
//
// interface Dog {
//   name: string;
//   age: number;
// }
//
// interface Greyhound extends Dog {
//   price: number
// }
//
// function dog(dog: Dog): Dog {
//   console.log(dog,'dog')
//   return {name:"hello", age:12};
// }
//
// const a: Greyhound = {name: "1", age:12, price:100}
//
// dog(a)

interface Animal {
  age: number
}

interface Dog extends Animal {
  bark(): void
}

interface Greyhound extends Dog {
  greet(): void;
}

let haveAnimal = (animal: Animal):Dog => {
  animal.age;
  return {} as Greyhound;
}

let haveDog: (dog: Dog) => Dog;


// haveAnimal = haveDog
haveDog = haveAnimal
// haveDog =  (dog: Dog) => {
//  const animal= haveAnimal(dog)
//   animal.greet();
// }


haveDog({ age:12, bark:()=>{}})

// haveAnimal({
//   age: 123,
// })
