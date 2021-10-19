type AnyObject = Record<any, any>;
type BuilderObj<T> = { [k in keyof T]: (value: T[k]) => BuilderObj<T> };
type BuilderObjWithValues<T> = BuilderObj<T & { values: T }>;

// immutable
function builder<T extends AnyObject>(res?: Partial<T>) {
  const proxy: BuilderObjWithValues<T> = new Proxy({} as BuilderObjWithValues<T>, {
    get:  (obj, prop: keyof T) =>{
      if (prop === "values") {
        return {...res};
      }

      return ((value) => {
        const data = {
          ...(res || obj),
          [prop]: value
        }

        return builder(data);
      }) as BuilderObjWithValues<T>[keyof T];
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

const result1 = b.name("hello").age(12)
const result2 = result1.address("address").values
const result3 = result1.address("address1").values

console.log(result1.values, result2, result3);
