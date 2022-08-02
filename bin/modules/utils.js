const path = require('path')
const fs = require("fs")

/**
 * 字符串首字母转大写
 *
 * @param { string } word 带转换的字符串
 * @return { string } 转换后的字符串
 */
const capitalize = (word) => {
  return `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`
}
/**
 * 字符串转小驼峰
 *
 * @param { string } text 带转换的字符串
 * @param { string } [separator='_'] 间隔符
 * @return { string } 转换后的字符串
 */
const camelize = (text, separator = '_') => {
  const words = text.split(separator)
  const result = [words[0]]
  words.slice(1).forEach((word) => result.push(capitalize(word)))
  return result.join('')
}

/**
 * 递归创建目录 同步方法
 *
 * @param { string } 目录名称
 * @return { boolean } 是否成功
 */
const mkdirsSync = dirname => {
  if (fs.existsSync(dirname)) {
    return true
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname)
      return true
    } else {
      return false
    }
  }
}

module.exports = {
  capitalize,
  camelize,
  mkdirsSync
}