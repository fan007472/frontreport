import { ILayout } from '@/type/layout'
import { IPage } from '@/type/page'

declare global {
    interface IResponse<T = any> {
        code: number;
        message: string;
        obj: T;
    }
    interface IObject<T> {
        [index: string]: T
    }
    interface IState extends IPage {
        layout: ILayout
    }
    interface ITable<T = any> {
        data : Array<T>
        total: number
        page: number
        size: number
    }
    interface ImportMetaEnv {
        VITE_APP_TITLE: string
    }
}
