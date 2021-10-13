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

interface TreeNode {
  id: number;
  name: string;
  children: TreeNode[] | null
}

const toTree = (data: InputItem[], parentId: number | null = null): TreeNode[] => {
  return data
    .filter(v => v.parent === parentId)
    .map((v): TreeNode => ({
      name: v.name,
      id: v.id,
      children: toTree(data, v.id),
    }));
}

console.log(JSON.stringify(toTree(data,), null, 2), 'toTree(data)')
