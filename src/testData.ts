// 所有需要用到的接口，统一导入
import { UserProps, ColumnProps, PostProps } from './interface/interface'
/*  头部登录信息 */
export const headerData: UserProps = {
  isLogin: false
}
/* 文章信息数据 */
// 定义一组数据,并且它的类型用接口限制
export const testData: ColumnProps[] = []
/* 文章细节数据 */
export const testPosts: PostProps[] = []
