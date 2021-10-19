type AnyObject = Record<any, any>;
type BuilderObj<T> = { [k in keyof T]: (value: T[k]) => BuilderObj<T> };

function builder<T extends AnyObject>() {

  return new Proxy({} as BuilderObj<T & { values: T }>, {
    get: function (obj, prop: keyof T) {
      if (prop === "values") {
        return obj;
      }

      return ((value) => {
        obj[prop] = value;

        return this;
      }) as BuilderObj<T>[keyof T];
    },
  });
}

interface Foo {
  name: string;
  age: number;
  address: string;
  count: number;
  fakeName: string;
}

const b = builder<Foo>();

b.name("rui");
b.address("hello");
b.count(12);
b.fakeName("fake name");

console.log(b.values);
