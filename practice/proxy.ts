type AnyObject = Record<any, any>;
type BuilderObj<T> = { [k in keyof T]: (value: T[k]) => BuilderObj<T> };
type BuilderObjWithValues<T> = BuilderObj<T & { values: T }>;

function builder<T extends AnyObject>() {
  const proxy: BuilderObjWithValues<T> = new Proxy({} as BuilderObj<T & { values: T }>, {
    get:  (obj, prop: keyof T) =>{
      if (prop === "values") {
        return obj;
      }

      return ((value) => {
        obj[prop] = value;

        return proxy;
      }) as BuilderObj<T>[keyof T];
    },
  });

  return proxy;
}

interface Foo {
  name: string;
  age: number;
  address: string;
  count: number;
  fakeName: string;
}

const b = builder<Foo>();
const result = b.name("hello").age(12).address("address").values

console.log(result);
