#!/usr/bin/env node

const {
  program
} = require("commander")

const {
  initAction
} = require("./modules/init")

const {
  initWithGit
} = require("./modules/initWithGit")

const {
  add
} = require("./modules/add")

switch (process.argv[2]) {
  case "init":
    program
      .command("init")
      .description("初始化项目")
      .action(initAction)
      .parse(process.argv)
    break
  case "initWithGit":
    program
      .command("initWithGit")
      .description("用远程git仓库初始化项目")
      .action(initWithGit)
      .parse(process.argv)
    break
  case "add":
    program
      .command("add")
      .description("添加模板")
      .action(add)
      .parse(process.argv)
    break
  default:
    program.usage("<command>").command("init", "初始化项目").command("initWithGit", "用远程git仓库初始化项目").command("add", "添加模板").parse(process.argv)
    break
}