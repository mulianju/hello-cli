const inquirer = require("inquirer")
const fs = require("fs")
const template = require("art-template")
const chalk = require("chalk")
const path = require('path')
const {
  capitalize,
  camelize,
  mkdirsSync
} = require('./utils')

const rootDir = '../../../..'

const choices = [
  {
    title: "页面(page)",
    value: "page",
  },
  { title: "组件(component)", value: "component" },
]

const promptInfo = [
  {
    type: "list",
    name: "type",
    message: "请选择需要创建的类型?",
    prefix: "[?]",
    choices: choices.map((item) => item.title),
    filter(val) {
      return choices.find((item) => item.title == val).value
    },
  },
  {
    type: "input",
    name: "name",
    message: `请输入名称(支持多级路径, 如:xxx/xxx)?`,
    prefix: "[?]",
    default: "index",
  },
]

const checkTemplatesExistsSync = async () => {
  const results = [
    fs.existsSync(path.resolve(__dirname, rootDir, './templates/component.vue.art')),
    fs.existsSync(path.resolve(__dirname, rootDir, './templates/page.vue.art')),
  ]
    .filter((isExist) => !isExist)
    .map((_, index) => choices[index].title)

  if (results.length) {
    console.log(
      `${chalk.green(results.join(","))}${chalk.red(
        "模板不存在，请先创建模板"
      )}`
    )
  } else {
    return true
  }
}

const add = async () => {
  if (await checkTemplatesExistsSync()) {
    inquirer
      .prompt(promptInfo)
      .then(async (answers) => {
        const { type, name: inputName } = answers

        const nameMap = inputName.split('/')
        const name = capitalize(camelize(nameMap.pop()))
        const dirname = path.resolve(__dirname, rootDir, `./${type}s/${nameMap.join('/')}`)
        const templateDir = path.resolve(__dirname, rootDir, `./templates/${type}.vue.art`)

        if (!fs.existsSync(path.resolve(dirname, `./${name}.vue`))) {
          mkdirsSync(dirname)
          fs.writeFileSync(path.resolve(dirname, `./${name}.vue`), template(templateDir, {
            name
          }), 'utf8')
        } else {
          const role = choices.find(item => item.value == type)
          console.log(`${chalk.red(role.title)}: ${chalk.green(name)} ${chalk.red('已经存在，换个名字再试试吧')}`)
        }
      })
  }
}

module.exports = {
  add
}
