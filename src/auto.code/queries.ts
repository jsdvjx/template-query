import { Observable, of, from } from "rxjs";
import { Maker } from "./maker";
import * as makers from './maker'
import { first,curryRight } from 'lodash/fp'
import { map } from "rxjs/operators";
export interface Querist {
    query: <R = any>(sql: string) => Promise<R>
}


export default class QueristMgr {
    private static queristMap: Map<string, Querist> = new Map;
    static register = (name: string, querist: Querist) => {
        QueristMgr.queristMap.set(name, querist)
    }
    static set = QueristMgr.register
    static get = (name: string) => {
        return QueristMgr.queristMap.get(name)
    }
    static has = (name: string) => {
        return QueristMgr.queristMap.has(name)
    }
    static delete = (name: string) => {
        return QueristMgr.queristMap.delete(name)
    }
}
export interface QueryResultOption {
    multiple: boolean
    auto: boolean
    pick?: string
    type: any
}
export const QueryComplie = <R = any>(list: R[], option: QueryResultOption) => {
    if (!list) return null;
    const result = option.multiple ? list : first(list);
    if (typeof option.pick === 'string' && option.pick.length > 0) {
        const tmp = result[option.pick]
        if (!tmp) return null;
        switch (option.type) {
            case 'Date':
                return new Date(tmp)
            case 'string':
                return tmp.toString();
            case 'number':
                return parseInt(tmp, 10)
            default:
                return tmp;
        }
    }
    return result;
}
type Query<R, P = any> = (params: P) => Observable<R>
export const QueryBuilder = <R = any, P = any>(maker: Maker<P>, queristName: string, option?: QueryResultOption) => {
    const handler = option ? curryRight(QueryComplie)(option):(_:any)=>_;
    return (param: P): Observable<R> => {
        return (QueristMgr.has(name) ? from(QueristMgr.get(queristName).query((maker as any)(param))) : of(null)).pipe(map(handler))
    };
}
/*{#template_included#}*/

export const syncQuery = QueryBuilder(makers.syncSqlMaker, 'bigdata');
export const syncCountQuery = QueryBuilder(makers.syncCountSqlMaker, 'default');
export const syncTestQuery = QueryBuilder(makers.syncTestSqlMaker, 'default');