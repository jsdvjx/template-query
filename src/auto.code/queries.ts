import { Observable, of, from } from "rxjs";
import { Maker } from "./maker";
import * as makers from './maker'
import { first, curry } from 'lodash/fp'
import { map, concatMap, catchError, toArray } from "rxjs/operators";
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
    transaction: boolean
}
export const QueryComplie = <R = any>(option: QueryResultOption, list: R[]) => {
    if (!list) return null;
    const result = option.multiple ? list : first(list);
    if (option.transaction) {
        return !!list.pop() === false
    }
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
const query = (querist: Querist, option: QueryResultOption, sql: string) => {
    if (option.transaction) {
        return from(sql.split(";")).pipe(
            concatMap((_sql) => querist.query(_sql)),
            catchError(_ => from(querist.query('rollback')).pipe(map(_ => false))),
            toArray()
        )
    } else {
        return from(querist.query(sql))
    }
}
export const QueryBuilder = <R = any, P = any>(maker: Maker<P>, option?: QueryResultOption, baseName?: string) => {
    const handler = option ? curry(QueryComplie)(option) : (_: any) => _;
    return (param: P, queristName?: string): Observable<R> => {
        const name = queristName || baseName;
        return (QueristMgr.has(name) ? query(QueristMgr.get(name), option, (maker as any)(param)) : of(null)).pipe(map(handler))
    };
}
/*{#template_included#}*/

