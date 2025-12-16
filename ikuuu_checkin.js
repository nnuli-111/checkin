/*
 * 运行方式:
 * 1. 安装依赖 (如果没有): npm install node-fetch (Node 18+ 内置 fetch 可跳过)
 * 2. 设置环境变量 IKUUU_COOKIE 为你的 cookie 字符串
 * 3. 运行: node ikuuu_checkin.js
 */

const checkInIkuuu = async () => {
  const notice = []
  // 从环境变量获取 Cookie，如果没有设置则报错
  const cookie = process.env.IKUUU_COOKIE
  if (!cookie) {
    console.log('请设置环境变量 IKUUU_COOKIE')
    return
  }

  try {
    // 构造通用的请求头，最重要的是 Cookie 和 Referer
    const headers = {
      'Cookie': cookie,
      'Referer': 'https://ikuuu.de/user',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Origin': 'https://ikuuu.de',
      'Content-Type': 'application/json;charset=UTF-8'
    }

    // 1. 发送签到请求 (核心步骤)
    // SSPanel 系统的标准签到接口通常是 /user/checkin
    console.log('正在尝试签到...')
    const checkinResponse = await fetch('https://ikuuu.de/user/checkin', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({}) // 空的 JSON body 即可，有的版本甚至不需要 body
    }).then((r) => r.json())

    // 2. 处理签到结果
    // 成功通常返回 { ret: 1, msg: "..." }
    // 失败或已签到通常返回 { ret: 0, msg: "..." }
    if (checkinResponse?.ret === 1) {
      notice.push('✅ 签到成功!', `信息: ${checkinResponse.msg}`)
    } else {
      // 即使 ret 为 0，也可能是“您今天已经签到过了”，这也可以视为成功
      notice.push('⚠️ 签到返回 (可能已签到):', `信息: ${checkinResponse?.msg}`)
    }

    // 3. (可选) 获取最新用户状态，比如剩余流量
    // 这是一个普通的页面访问，用来抓取页面上的信息，或者调用 /user/get_info 接口(如果有)
    // 这里我们简单打印一下结束信息
    
  } catch (error) {
    notice.push(
      '❌ 签到出错 (网络或脚本错误)',
      `${error}`
    )
  }

  return notice
}

// 执行并打印结果
const main = async () => {
  const result = await checkInIkuuu()
  if (result) {
    result.forEach(line => console.log(line))
  }
}

main()
