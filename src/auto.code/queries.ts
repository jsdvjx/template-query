import { Observable, of, from } from "rxjs";
import { Maker } from "./maker";
import * as makers from './maker'
import { Querist } from "./resolve";

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
type Query<R, P = any> = (params: P) => Observable<R>
export const QueryBuilder = <R = any, P = any>(maker: Maker<P>, queristName: string) => {
    return (param: P): Observable<R> => {
        return QueristMgr.has(name) ? from(QueristMgr.get(queristName).query((maker as any)(param))) : of(null)
    };
}
type PType<T> = T extends (p: infer P) => any ? P : any
/*{#template_included#}*/

export const syncQuery = QueryBuilder(makers.syncSqlMaker,'bigdata');
export const syncCountQuery = QueryBuilder(makers.syncCountSqlMaker,'default');
export const syncTestQuery = QueryBuilder(makers.syncTestSqlMaker,'default');