const template = '嗨，{{ info.name.value }}您好，今天是星期{{ day.value }}';

const data1 = {
  info: {
    name: {
      value: '张三'
    }
  },
  day: {
    value: '三'
  }
};

const get = (obj: any, keyPath: string) => {
  const keyPaths = keyPath.split(".");
  let temp: any = obj;

  for (let i = 0; i < keyPaths.length; i++) {
    const key = keyPaths[i]
    temp = temp[key];
  }

  return temp;
}

const render = (template: string, data: { [key: string]: any }) => {
  const groups: RegExpMatchArray | null = template.match(/\{\{\s(\S+)\s\}\}/gi)

  if (groups) {
    const final: any = groups.reduce((res, v) => {
      const keyPath = v.replace(/\{\{/gi, "").replace(/\}\}/gi, "").trim();
      return {
        ...res,
        [keyPath]: get(data, keyPath)
      }
    }, {});

    let str = template;

    Object.keys(final).forEach((k: string) => {
      str = str.replace(`{{ ${k} }}`, final[k])
    })

    return str;
  }
}

console.log(render(template, data1));
