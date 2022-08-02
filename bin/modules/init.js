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
    fs.writeFile("package.test.json", JSON.stringify(info), function (err) {
      if (err) {
        res.status(500).send("写入错误")
      } else {
        console.log("项目初始化成功，您的项目信息为：\n", info)
      }
    })
  })
}

module.exports = {
  initAction
}