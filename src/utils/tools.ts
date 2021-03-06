import { ILocalStore } from '@/type/tools'
import { IMenubarList } from '@/type/layout'
/**
 * 睡眠函数
 * @param time
 */
export async function sleep(time:number):Promise<void> {
    await new Promise(resolve => {
        setTimeout(() => resolve, time)
    })
}


/**
 * 金额格式化
 * @param num 金额
 * @param symbol 金额前面修饰符号，如$,¥
 */
export function format(num:number|string, symbol = '¥'):string {
    if (Number.isNaN(Number(num))) return `${symbol} -`
    return symbol + (Number(num).toFixed(2))
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
/**
 * 取消金额格式化
 * @param str 金额
 */
export function unformat(str:string):number|string {
    const s = str.substr(1).replace(/,/g, '')
    return Number.isNaN(Number(s)) || Number(s) === 0 ? '' : Number(s)
}
/**
 * 表格合计行
 * @param str 金额
 */
export function tableSummaries(param: { columns: any; data: any }):Array<string | number> {
    const { columns, data } = param
    const sums:Array<string | number> = []
    columns.forEach((column: { property: string | number }, index:number) => {
        if (index === 0) {
            sums[index] = '合计'
            return
        }
        const values = data.map((item: { [x: string]: any }) => Number(item[column.property]))
        if (!values.every((value: number) => isNaN(value))) {
            sums[index] = values.reduce((prev: number, curr: number) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                    return prev + curr
                } else {
                    return prev
                }
            }, 0)
            const sum = sums[index]
            if (typeof sum === 'number') {
                sums[index] = format(sum.toFixed(2))
            }
        } else {
            sums[index] = 'N/A'
        }
    })

    return sums
}

export function isInput(el: HTMLElement): boolean {
    return el.nodeName.toLocaleLowerCase() === 'input'
}
export function isTextarea(el: HTMLElement): boolean {
    return el.nodeName.toLocaleLowerCase() === 'textarea'
}

/**
 * localStorage设置有效期
 * @param name localStorage设置名称
 * @param data 数据对象
 * @param pExpires 有效期(默认100年) pExpires = 1000 * 60 * 60 * 24 * 365 * 100
 */
export function setLocal(name:string, data:IObject<any>, pExpires:any):void {
    const d = data as ILocalStore
    d.startTime = Date.now()
    d.expires = pExpires
    localStorage.setItem(name, JSON.stringify(data))
}
/**
 * 判断localStorage有效期是否失效
 * @param name localStorage设置名称
 */
export async function useLocal(name: string):Promise<ILocalStore> {
    return new Promise((resolve, reject) => {
        const local = getLocal<ILocalStore>(name)
        if (local.startTime + local.expires < Date.now()) reject(new Error(`${name}已超过有效期`))
        resolve(local)
    })
}
/**
 * 获取localStorage对象并转成对应的类型
 * @param name localStorage设置名称
 */
export function getLocal<T>(name:string):T {
    const l = localStorage.getItem(name)
    const local = JSON.parse(l !== null ? l : '{}') as unknown as T
    return local
}

/**
 * 函数节流
 * @param time 间隔时间
 */
export function throttle(time = 500):()=>Promise<void> {
    let timer:NodeJS.Timeout | null = null
    let firstTime = true
    return () => {
        return new Promise(resolve => {
            if (firstTime) {
                resolve()
                firstTime = false
                return firstTime
            }
            if (timer) return false
            timer = setTimeout(() => {
                if (timer) clearTimeout(timer)
                timer = null
                resolve()
            }, time)
        })
    }
}

/**
 * list结构转tree
 * @param data list原始数据
 * @param pid 最外层pid
 */
export function listToTree(data:Array<IMenubarList>, pid: string | number = 1, isChildNull = false):Array<IMenubarList> {
    const d:Array<IMenubarList> = []
    data.forEach(val => {
        if (val.parentId === pid) {
            const list = listToTree(data, val.id, isChildNull)
            const obj:IMenubarList = { ...val }
            if (!isChildNull || list.length !== 0) {
                obj.children = list
            }
            d.push(obj)
        }
    })
    return d
}
/**
  * 字符串首字母大写
  * @param str
  * @returns
  */
export function firstUpperCase(str: string): string {
    return str.replace(/^\S/, s => s.toUpperCase())
}

/**
 * 加载store状态
 * @param modules
 * @returns
 */
// export function loadStorePage(modules: IObject<any>): IObject<any> {
//     const page: IObject<any> = {}
//     Object.keys(modules).forEach(key => {
//         const nameMatch = key.substr(2).replace('.ts', '')
//             .split('/')
//             .map(v => firstUpperCase(v))
//             .join('')
//         page[nameMatch] = modules[key].default
//     })
//     return page
// }

/**
 * 两次编码url
 * @param url
 * @returns
 */
export function decodeUrl(url: string): string {
    return decodeURIComponent(decodeURIComponent(url))
}

/**
 * 两次解码url
 * @param url
 * @returns
 */
export function encodeUrl(url: string): string {
    return encodeURIComponent(encodeURIComponent(url))
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function utf8ByteToUnicodeStr(utf8Bytes: any) {
    let unicodeStr = ''
    for (let pos = 0; pos < utf8Bytes.length;) {
        const flag = utf8Bytes[pos]
        let unicode = 0
        if ((flag >>> 7) === 0) {
            unicodeStr += String.fromCharCode(utf8Bytes[pos])
            pos += 1
        } else if ((flag & 0xFC) === 0xFC) {
            unicode = (utf8Bytes[pos] & 0x3) << 30
            unicode |= (utf8Bytes[pos + 1] & 0x3F) << 24
            unicode |= (utf8Bytes[pos + 2] & 0x3F) << 18
            unicode |= (utf8Bytes[pos + 3] & 0x3F) << 12
            unicode |= (utf8Bytes[pos + 4] & 0x3F) << 6
            unicode |= (utf8Bytes[pos + 5] & 0x3F)
            unicodeStr += String.fromCharCode(unicode)
            pos += 6
        } else if ((flag & 0xF8) === 0xF8) {
            unicode = (utf8Bytes[pos] & 0x7) << 24
            unicode |= (utf8Bytes[pos + 1] & 0x3F) << 18
            unicode |= (utf8Bytes[pos + 2] & 0x3F) << 12
            unicode |= (utf8Bytes[pos + 3] & 0x3F) << 6
            unicode |= (utf8Bytes[pos + 4] & 0x3F)
            unicodeStr += String.fromCharCode(unicode)
            pos += 5
        } else if ((flag & 0xF0) === 0xF0) {
            unicode = (utf8Bytes[pos] & 0xF) << 18
            unicode |= (utf8Bytes[pos + 1] & 0x3F) << 12
            unicode |= (utf8Bytes[pos + 2] & 0x3F) << 6
            unicode |= (utf8Bytes[pos + 3] & 0x3F)
            unicodeStr += String.fromCharCode(unicode)
            pos += 4
        } else if ((flag & 0xE0) === 0xE0) {
            unicode = (utf8Bytes[pos] & 0x1F) << 12
            unicode |= (utf8Bytes[pos + 1] & 0x3F) << 6
            unicode |= (utf8Bytes[pos + 2] & 0x3F)
            unicodeStr += String.fromCharCode(unicode)
            pos += 3
        } else if ((flag & 0xC0) === 0xC0) { // 110
            unicode = (utf8Bytes[pos] & 0x3F) << 6
            unicode |= (utf8Bytes[pos + 1] & 0x3F)
            unicodeStr += String.fromCharCode(unicode)
            pos += 2
        } else {
            unicodeStr += String.fromCharCode(utf8Bytes[pos])
            pos += 1
        }
    }
    return unicodeStr
}
