const data = [
  {
    id: 1,
    name: "文本1",
    parent: null
  },
  {
    id: 2,
    name: "文本2",
    parent: 1
  },
  {
    id: 3,
    name: "文本3",
    parent: 2
  }
]

interface InputItem {
  id: number;
  parent: number | null;
  name: string;
}

interface Node {
  id: number;
  name: string;
  children: Node[] | null
}

const toTree = (data: InputItem[]): Node[] | null => {
  const filterChildrenByParentId = (parentId: number | null): Node[] | null => {
    const children = data.filter(v => v.parent === parentId);

    if (children.length > 0) {
      return children.map(child => {
        const ch = filterChildrenByParentId(child.id);
        const v = ch ? {children: ch} : undefined;

        return ({
          id: child.id,
          name: child.name,
          ...v
        });
      }) as Node[]
    }

    return null;
  }

  return filterChildrenByParentId(null);
}

console.log(JSON.stringify(toTree(data), null, 2), 'toTree(data)')
