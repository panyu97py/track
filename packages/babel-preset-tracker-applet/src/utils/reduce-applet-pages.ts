import Taro from '@tarojs/taro'

export const reduceAppletPages = (appConfig: Taro.AppConfig) => {
  const { pages = [], subPackages = [] } = appConfig

  const mainPages = pages.reduce((result: string[], page: string) => {
    return [...result, page]
  }, [])

  const subPackagePages = subPackages.reduce((result: string[], subPackage) => {
    const { pages: subPackagePages = [] } = subPackage

    const pagesInSubPackage = subPackagePages.map((page: string) => {
      return `${subPackage.root}/${page}` // 拼接子包路径和页面路径
    })

    return [...result, ...pagesInSubPackage]
  }, [])

  // 步骤 3: 合并主包和子包的页面路径
  return [...mainPages, ...subPackagePages]
}
