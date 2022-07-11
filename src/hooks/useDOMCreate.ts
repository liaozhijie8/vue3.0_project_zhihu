import { onUnmounted } from 'vue'

function useDOMCreate(nodeId: string) {
  /* 添加主页面节点 */
  const node = document.createElement('div')
  node.id = nodeId
  document.body.appendChild(node)
  // 加载完成后清除节点
  onUnmounted(() => {
    document.body.removeChild(node)
  })
}
export default useDOMCreate
