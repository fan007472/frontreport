export type ITag = '家' | '公司' | '学校' | '超市'
export interface IRenderTableList {
    date: string
    name: string
    address: string
    tag: ITag
    amt: number
}

export interface IStockBasicList {
    tsCode: string
    name: string
    area: string
    industry: string
    market: string
    tsMarket: string
}