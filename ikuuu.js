// 文件名: ikuuu.js
const checkInIkuuu = async () => {
  const notice = []
  const cookie = process.env.IKUUU_COOKIE
  if (!cookie) {
    console.log('❌ 请设置环境变量 IKUUU_COOKIE')
    return
  }

  try {
    const headers = {
      'Cookie': cookie,
      'Referer': 'https://ikuuu.de/user',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Origin': 'https://ikuuu.de',
      'Content-Type': 'application/json;charset=UTF-8'
    }

    // 1. 发送签到请求
    console.log('正在尝试 ikuuu 签到...')
    const checkinResponse = await fetch('https://ikuuu.de/user/checkin', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({}) 
    }).then((r) => r.json())

    // 2. 处理结果
    if (checkinResponse?.ret === 1) {
      console.log(`✅ ikuuu 签到成功! 信息: ${checkinResponse.msg}`)
    } else {
      console.log(`⚠️ ikuuu 签到返回: ${checkinResponse?.msg}`)
    }
    
  } catch (error) {
    console.log(`❌ ikuuu 签到出错: ${error}`)
  }
}

checkInIkuuu()
