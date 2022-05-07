const childProcess = require('child_process')
const path = require('path')

const resolve = (link) => {
    return path.join(__dirname, link)
}

const filePath = {
    micro_vue2: resolve('../micro-vue2'),
    micro_vue3: resolve('../micro-vue3'),
    micro_react17: resolve('../micro-react17'),
    micro_service: resolve('../micro-service'),
    micro_main: resolve('../micro-main')
}

//  执行命令 cd 子应用目录执行 npm run start
function runChild() {
    Object.values(filePath).forEach(item => {
        // 开启子进程执行各项目启动
        childProcess.spawn(`cd ${item} && npm run start`, {
            stdio: 'inherit',
            shell: true
        })
    })
}

runChild()