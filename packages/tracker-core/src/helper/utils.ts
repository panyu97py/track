/**
 * 空函数
 */
export const noop = () => {}

/**
 * 顺序执行方法
 * @param functions
 */
export const pipe = (...functions: Array<(val: any) => any>) => {
  return (inputVal: any) => functions.reduce((resultVal, func) => func(resultVal), inputVal)
}

export const generateUUIDv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c: any) => {
    const r = Math.random() * 16 | 0 // 生成一个 0-15 之间的随机整数
    const v = c === 'x' ? r : (r & 0x3 | 0x8) // 'x' 位置随机，'y' 位置符合版本4规范
    return v.toString(16) // 将结果转换成 16 进制字符串
  })
}
