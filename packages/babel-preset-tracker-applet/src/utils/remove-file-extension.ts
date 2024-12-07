export const removeFileExtension = (filename: string) => {
  // 使用正则表达式去除扩展名
  return filename.replace(/\.[^/.]+$/, '')
}
