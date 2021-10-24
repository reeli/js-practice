function async(generator: () => any) {
  const iterator = generator();

  function handle(iteratorResult: { value: any; done: boolean }) {
    if (iteratorResult.done) {
      return;
    }

    if (iteratorResult.value instanceof Promise) {
      iteratorResult.value.then(res => handle(iterator.next(res)))
        .catch(err => iterator.throw(err))
    }
  }

  try {
    handle(iterator.next())
  } catch (e) {
    iterator.throw(e)
  }
}

function getJSON(url: string, time: number): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(url)
    }, time)
  });
}

async(function* myGenerator() {
  try {
    // @ts-ignore
    const res1 = yield getJSON("data/a.json", 100);
    console.log(res1);

    // @ts-ignore
    const res2 = yield getJSON("data/b.json", 2000)
    console.log(res2)
  } catch (e) {

  }
})
