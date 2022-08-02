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