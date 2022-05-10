var express = require('express');
var fs = require('fs')
var path = require('path')
var childProcess = require('child_process')

var router = express.Router();

const versionDir = path.join(__dirname, '../version')
const initVersion = '1.0.0.0';

router.get('/', function (req, res, next) {
  const name = req.query.name;
  //  1. 应用版本确定
  //  确定更新版本号, 每个应用一个独立的文件管理版本
  //  创建一个文件, 默认版本号
  const currentUrl = path.join(versionDir, name)
  let newVersion = ''

  try {
    const originVersion = fs.readFileSync(currentUrl).toString().replace(/\n/g, '');
    newVersion = originVersion.replace(/\.(\d+)$/, (a, b) => `.${+b + 1}`);
    fs.writeFileSync(currentUrl, newVersion)
  } catch (e) {
    //  未读取到文件, 创建应用, 写入版本
    fs.writeFileSync(currentUrl, initVersion)
  }

  //  2. 构建, 打包, 发布
  const originPath = path.join(__dirname, `../../../`, name)
  let originDist = path.join(originPath, 'dist')
  const bagPath = path.join(__dirname, '../bag')

  try {
    //  应用构建
    childProcess.execSync(`cd ${originPath} && cnpm install &&npm run build`)
    //  创建保存构建完成应用的目录
    childProcess.execSync(`cd ${bagPath} && mkdir -p ./${name}/${newVersion}`)
    //  移动构建完成目录到正确路径
    if (name.indexOf('/react')) { //  react 构建目录重新赋值
      originDist = path.join(originPath, 'build')
    }
    const lastPath = path.join(bagPath, `./${name}/${newVersion}`)
    childProcess.execSync(`mv ${originDist}/* ${lastPath}`)
  } catch (e) {
    console.log(e)
  }

  res.send({
    version: newVersion,
    message: `${name} 应用打包构建完成`
  })
});

module.exports = router;
