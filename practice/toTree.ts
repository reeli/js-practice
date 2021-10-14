const data = [
  {
    name: "文本1",
    parent: null,
    id: 1
  },
  {
    name: "文本2",
    parent: 1,
    id: 2
  },
  {
    name: "文本3",
    parent: 2,
    id: 3
  },
]

interface Input {
  name: string;
  parent: number | null;
  id: number;
}

interface TreeNode {
  name: string;
  id: number;
  children?: TreeNode[]
}

// 1. getNodesById: 从所有的 Node 里面找出所有 parent 等于给定 id 的 Node。默认给定的 id 为 null，获取 root nodes。
// 2. 遍历得到的节点，每个子节点的 children 也是按照第一步的方式进行查找

function getNodesById(data: Input[], parentId: number | null) {
  return data.filter(v => v.parent === parentId)
}

export const toTree = (data: Input[], parentId: number | null): TreeNode[] => {
  const filteredNodes = getNodesById(data, parentId);

  return filteredNodes.map(v => {
    const children = toTree(data, v.id);
    const item = children && children.length > 0 ? {children} : {};

    return {
      id: v.id,
      name: v.name,
      ...item
    }
  });
}

console.dir(toTree(data, null), {depth: null})
