//import * as maker from './maker'
interface QueryResultOption {
    multiple: boolean
    auto: boolean
    pick?: string
    type: any
}
interface QueryTemplate<P = any, R = any> {
    template: string;
    name: string;
    tag: string;
    maker: string;
    result: QueryResultOption;
    resultType: R;
}
interface Querist {
    query: <R = any>(sql: string) => Promise<R>
}
interface SqlMaker<T = any> {
    (param: T): string;
}
interface QueryConfig {
    path: {
        maker: string;
        query: string;
    }
    templates: QueryTemplate[];
    include_templates: string[]
}
export default {}