import Message from '@/components/main/Message.vue'
import { h, render } from 'vue'
// 定义类型
export type MessageType = 'success' | 'error' | 'default'
const createMessage = (message: string, type: MessageType, timeout?: number) => {
  const messageVnode = h(Message, {
    // 传入组件的props
    message,
    type
  })
  // 挂载节点
  const mountNode = document.createElement('div')
  document.body.appendChild(mountNode)
  // 挂载dom
  render(messageVnode, mountNode)
  // 卸载的函数
  const destory = () => {
    // 卸载dom
    render(null, mountNode)
    // 卸载节点
    document.body.removeChild(mountNode)
  }
  // 如果存在timeout，才去卸载
  if (timeout) {
    setTimeout(() => {
      destory()
    }, timeout)
  }
  return {
    destory
  }
}
export default createMessage
