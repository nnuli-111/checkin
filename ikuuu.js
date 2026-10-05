const cookie = process.env.IKUUU_COOKIE

if (!cookie) {
  console.error('请先在 GitHub Actions Secrets 中设置 IKUUU_COOKIE')
  process.exit(1)
}

const response = await fetch('https://ikuuu.org/user/checkin', {
  method: 'POST',
  headers: {
    Cookie: cookie,
    Referer: 'https://ikuuu.org/user',
    Origin: 'https://ikuuu.org',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest',
    Accept: 'application/json, text/javascript, */*; q=0.01',
  },
})

if (!response.ok) {
  console.error(`签到请求失败：HTTP ${response.status}`)
  process.exit(1)
}

let result
try {
  result = await response.json()
} catch {
  console.error('返回内容不是 JSON；请检查 Cookie 是否有效')
  process.exit(1)
}

const message = result?.msg || result?.message || '网站未返回签到信息'
console.log(message)

if (Number(result?.ret) !== 1 && !/已签到|已经签到|今日签到过/.test(message)) {
  process.exit(1)
}
