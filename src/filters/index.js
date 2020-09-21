function padLeftZero (str) {
  return ('00' + str).substr(str.length)
}

export function formatDate (date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  if (/(s+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getMilliseconds() + '').substring(0, RegExp.$1.length)
    )
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    'S+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : padLeftZero(str)
      )
    }
  }
  return fmt
}
// 时间格式化
export function formate(date, fmt = 'YYYY-MM-DD HH:mm:ss') {
 var o = {
   'M+': date.getMonth() + 1,
   'D+': date.getDate(),
   'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
   'H+': date.getHours(),
   'm+': date.getMinutes(),
   's+': date.getSeconds(),
   'q+': Math.floor((date.getMonth() + 3) / 3),
   'S': date.getMilliseconds()
 }
 var week = {
   '0': '\u65e5',
   '1': '\u4e00',
   '2': '\u4e8c',
   '3': '\u4e09',
   '4': '\u56db',
   '5': '\u4e94',
   '6': '\u516d'
 }
 if (/(Y+)/.test(fmt)) {
   fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
 }
 if (/(E+)/.test(fmt)) {
   fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') + week[date.getDay() + ''])
 }
 for (var k in o) {
   if (new RegExp('(' + k + ')').test(fmt)) {
     fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
   }
 }
 return fmt
}
export const noDataFilter = text =>
  text === (null || undefined || '') ? '---' : text

//
export function getCurrentDays (fmt = 'YYYY-MM-DD HH:mm:ss') {
  return formate(new Date(), fmt)
}


// 计算n天前的时间
export function getBeforeDays (day,  fmt = 'YYYY-MM-DD HH:mm:ss') {
  var time = new Date();
  time.setDate(time.getDate() - day);//获取Day天后的日期

  return formate(time, fmt)
}
