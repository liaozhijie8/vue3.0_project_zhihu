/*  头部接口类型 */
export interface UserProps {
  isLogin: boolean
  nickName?: string
  _id?: string
  column?: string
  email?: string
}
/*  专栏接口 */
// 调整数据类型接口与api的一致
export interface ImageProps {
  _id?: string
  url?: string
  createdAt?: string
  fitUrl?: string
}
export interface ColumnProps {
  _id: string
  title: string
  // 加一个可选的情况
  avatar?: ImageProps
  description: string
}
/* 验证表单的接口 */
export interface RuleProps {
  type: 'required' | 'email' | 'range' | 'custom';
  message: string
  validator?: () => boolean
}
/* 文章细节接口 */
export interface PostProps {
  _id?: string
  title: string
  content?: string
  excerpt?: string
  image?: ImageProps | string
  createdAt?: string
  column: string
  author?:string
}
/* 错误信息的提示接口 */
export interface GlobalErrorProps {
  status: boolean
  message?: string
}
/* 上传文章返回的数据接口 */
export interface ResponseType<P = Record<string, unknown>> {
  code: number
  msg: string
  data: P
}
/* 全局接口-总的定义 */
export interface GlobalDataProps {
  error: GlobalErrorProps
  token: string
  loading: boolean
  columns: ColumnProps[]
  posts: PostProps[]
  user: UserProps
}
