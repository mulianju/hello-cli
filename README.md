---
title: 从零开始开发一个node-cli工具
date: 2022-08-01 14:45:04
comments: true
categories:
- node
tags:
- node
---

## 什么是CLI

命令行界面（英语：command-line interface，缩写：CLI）是在图形用户界面得到普及之前使用最为广泛的用户界面，它通常不支持鼠标，用户通过键盘输入指令，计算机接收到指令后，予以执行。也有人称之为字符用户界面（character user interface, CUI）。

## CLI能做什么

我们在项目开发时，经常会用到一些cli工具，比如`vue-cli`、`npm init`等等，这些CLI工具我们常常用做项目初始化、代码检查、模板创建等交互相对简单，且重复性较多的工作。

## 准备开发

实现CLI工具开发的方式和语言有很多，本文只介绍基于node的实现方案。

### Hello World

依照惯例，我们第一步还是从`Hello World`开始：

首先，进入工作区，创建并进入项目目录`hello-cli`，执行`npm`初始化命令：

```bash
mkdir hello-cli
cd hello-cli
npm init
```

输入或选择一系列项目配置

```bash
package name: (hello-cli) 
version: (1.0.0) 
description: hello world
entry point: (index.js) 
test command: test
git repository: 
keywords: cli
author: mulianju
license: (ISC) 
```

`npm`会自动创建好项目配置文件`package.json`

```json
{
  "name": "hello-cli",
  "version": "1.0.0",
  "description": "hello world",
  "main": "index.js",
  "scripts": {
    "test": "test"
  },
  "keywords": [
    "cli"
  ],
  "author": "mulianju",
  "license": "ISC"
}
```

在项目根目录，创建`bin`文件夹，并在`bin`文件夹内创建`hello-cli.js`文件，文件中写入：

```javascript
#!/usr/bin/env node
console.log('Hello World!')
```

> 注意文件第一行的“**注释**”，这行“注释”并不是普通的“注释”，他是用来声明此CLI工具的开发语言，所以千万不要删掉。

在`package.json`里添加`bin`字段，用来创建一个命令，并声明命令指向的执行文件即可：

```json
"bin": {
  "hello-cli": "bin/hello-cli.js"
},
```

执行本地安装：

```bash
npm link
```

至此，我们的第一个CLI工具就开发完成了。我们新建个终端窗口，执行我们自定义的命令，即可看到效果：

```bash
hello-cli
```

输出结果：

```bash
Hello World!
```

### CLI交互

CLI工具最关键的一个点，就是用户交互，简单的交互可以极大扩展我们的CLI的能力，比如以上我们用到的`npm init`，一些项目信息都需要在我们初始化项目过程中，通过CLI输入或选择。

用来实现CLI交互的，主要依赖以下两个包：

- `commander`:完整的`node.js`命令行解决方案。[详细资料](https://github.com/tj/commander.js)
- `inquirer`:常见交互式命令行用户界面的集合。[详细资料](https://github.com/SBoudrias/Inquirer.js)

> **注意:**`inquirer`在`9.0.0`版本开始，模块化方式改为`native esm modules`，言下之意，如果你的项目中使用的是`CMD`模块化方式，则需要限制`inquirer`的版本低于`9.0.0`，否则将会抛出以下错误：

```bash
internal/modules/cjs/loader.js:1102
      throw new ERR_REQUIRE_ESM(filename, parentPath, packageJsonPath);
      ^

Error [ERR_REQUIRE_ESM]: Must use import to load ES Module: /mnt/d/work/work/2022/08/hello-cli/node_modules/inquirer/lib/inquirer.js
require() of ES modules is not supported.
require() of /mnt/d/work/work/2022/08/hello-cli/node_modules/inquirer/lib/inquirer.js from /mnt/d/work/work/2022/08/hello-cli/bin/hello-cli.js is an ES module file as it is a .js file whose nearest parent package.json contains "type": "module" which defines all .js files in that package scope as ES modules.
Instead rename inquirer.js to end in .cjs, change the requiring code to use import(), or remove "type": "module" from /mnt/d/work/work/2022/08/hello-cli/node_modules/inquirer/package.json.

    at new NodeError (internal/errors.js:322:7)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1102:13)
    at Module.load (internal/modules/cjs/loader.js:950:32)
    at Function.Module._load (internal/modules/cjs/loader.js:790:12)
    at Module.require (internal/modules/cjs/loader.js:974:19)
    at require (internal/modules/cjs/helpers.js:101:18)
    at Object.<anonymous> (/mnt/d/work/work/2022/08/hello-cli/bin/hello-cli.js:3:18)
    at Module._compile (internal/modules/cjs/loader.js:1085:14)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1114:10)
    at Module.load (internal/modules/cjs/loader.js:950:32) {
  code: 'ERR_REQUIRE_ESM'
}
```

关于以上两个包的更多介绍，基于篇幅原因，我们这里就不详细展开来说了，我们这里只讲一个最简单的应用，其他的功能，待您亲自去尝试~

### 项目实例

以下应用完成了，通过用户输入的项目信息和一些默认信息，来初始化一个`package.json`项目配置文件的功能：

```javascript
#!/usr/bin/env node

const { program } = require("commander")
const inquire = require("inquirer")
const fs = require("fs")

const projectInfo = [
  {
    type: "input",
    message: "请输入项目名称",
    name: "name",
    default: "project",
  },
  {
    type: "input",
    message: "请输入项目描述",
    name: "description",
  },
  {
    type: "input",
    message: "请输入项目作者",
    name: "author",
  },
  {
    type: "input",
    message: "请输入项目git仓库",
    name: "git",
  },
  {
    type: "list",
    message: "请选择开源协议",
    name: "license",
    choices: ["ISC", "BSD", "GPL", "Apache Licence 2.0", "LGPL", "MIT"],
    default: "GPL",
  },
]

const defaultInfo = {
  version: "1.0.0",
  scripts: {},
}

const initAction = () => {
  inquire.prompt(projectInfo).then((answers) => {
    const info = Object.assign({}, defaultInfo, answers)
    fs.writeFile("package.json", JSON.stringify(info), function (err) {
      if (err) {
        res.status(500).send("写入错误")
      } else {
        console.log("项目初始化成功，您的项目信息为：\n", info)
      }
    })
  })
}

switch (process.argv[2]) {
  case "init":
    program
      .command("init")
      .description("初始化项目")
      .action(initAction)
      .parse(process.argv)
    break
  default:
    program
      .usage("<command>")
      .command("init", "初始化项目")
      .parse(process.argv)
    break
}

```

### 扩展能力

以上例子，我们实现了自动创建`package.json`文件，`CLI`当然不只这点能耐，利用一些`npm`包，我们还可以实现更丰富的功能。

#### 自动克隆远程git仓库

首先，安装依赖工具:

```bash
npm install shelljs --save
```

编写功能：

```javascript
const inquire = require("inquirer")
const shell = require("shelljs")

const projectInfo = [
  {
    type: "input",
    message: "请输入项目名称",
    name: "name",
    default: "project",
  }
]

const gitRepository = 'https://github.com/mulianju/hello-cli.git'

const initWithGit = () => {
  inquire.prompt(projectInfo).then((answers) => {
    console.log('项目正在创建...')
    const { name = 'project' } = answers
    shell.exec(`
      rm -rf ./hello-cli
      git clone ${gitRepository}
      rm -rf ./hello-cli/.git
      mv hello-cli ${name}
      cd ${name};
    `)
  })
}

module.exports = {
  initWithGit
}

```

运行：

```bash
hello-cli initWithGit

## CLI交互及输出
? 请输入项目名称 project
项目正在创建...
Cloning into 'hello-cli'...

```


#### 自动创建模板

首先，安装依赖工具:

```bash
npm install art-template chalk --save
```

> **注意:**`chalk`在`5.0.0`版本开始，模块化方式也变更了，和`inquirer`相似，[参考](https://github.com/chalk/chalk#install)

编写功能：

```javascript
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
  console.log(__dirname)
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
        console.log(answers)
      })
  }
}

module.exports = {
  add
}
```

运行：

```bash
## 注意：若使用此功能，请将hello-cli项目放置到项目node_modules文件夹，并执行npm link本地安装
## 并且项目根目录需创建templates文件夹
## 来存放component.vue.art和page.vue.art两个art-template模板文件
hello-cli add

## CLI交互
[?] 请选择需要创建的类型? 组件(component)
[?] 请输入名称(支持多级路径, 如:xxx/xxx)? index/test_component

```

运行后，会在项目根目录自动创建`components/index/TestComponent.vue`文件

以上，简单做两个例子，更多功能期待你们探索

## 结语

本文案例，均存放在开源项目: [hello-cli](https://github.com/mulianju/hello-cli)

本文永久地址：[从零开始开发一个node-cli工具](https://www.mulianju.com/develop-node-cli/)
