interface RegexDict {
    [k: string]: RegExp;
}
export interface Maker<T> {
    (p: T): string
}
function createFun<T>(string: string) {
    function createDict(string: string) {
        const reg = /\{(.+?)\}+/g;
        const dict = Array.from(new Set(string.match(reg) || []))
            .map(s => ({
                name: s.replace(/[\{\}]/g, ''),
                target: new RegExp(`${s}`, 'g'),
            }))
            .reduce(
                (t, acc) => {
                    t[acc.name] = acc.target;
                    return t;
                },
                {} as RegexDict,
            );
        return dict;
    }
    const dict = createDict(string);
    return ((parameter: T) =>
        Object.entries(parameter).reduce(
            (str, [k, v]) => str.replace(dict[k], v),
            string,
        )) as Maker<T>;
}
/*{#template_included#}*/
/*{#syncSqlMaker_start#}*/

export interface SyncSqlMakerParam {
  table: string;
  version_field: string;
  version_value: string;
  take: string;
}
export const syncSqlMaker = createFun<SyncSqlMakerParam>(`SELECT * FROM {table} WHERE {version_field} >= '{version_value}' ORDER BY {version_field} ASC LIMIT {take}`)

/*Fri Dec 13 2019 17:47:45 GMT+0800 (GMT+08:00)*/

/*{#syncSqlMaker_end#}*/

/*{#syncCountSqlMaker_start#}*/

export interface SyncCountSqlMakerParam {
  table: string;
  version_field: string;
  version_value: string;
}
export const syncCountSqlMaker = createFun<SyncCountSqlMakerParam>(`SELECT count(0) count FROM {table} WHERE {version_field} >= '{version_value}'`)

/*Fri Dec 13 2019 17:47:45 GMT+0800 (GMT+08:00)*/

/*{#syncCountSqlMaker_end#}*/

/*{#syncTestSqlMaker_start#}*/

export interface SyncTestSqlMakerParam {
  table: string;
  version_field: string;
  version_value: string;
  take: string;
}
export const syncTestSqlMaker = createFun<SyncTestSqlMakerParam>(`SELECT * FROM {table} WHERE {version_field} >= '{version_value}' ORDER BY {version_field} ASC LIMIT {take}`)

/*Fri Dec 13 2019 17:47:45 GMT+0800 (GMT+08:00)*/

/*{#syncTestSqlMaker_end#}*/
