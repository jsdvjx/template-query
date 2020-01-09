interface RegexDict {
    [k: string]: RegExp;
}
export interface Maker<T> {
    (p: T): string
}
function createDict(tmp: string) {
    const reg = /\{(.+?)\}+/g;
    const dict = Array.from(new Set(tmp.match(reg) || []))
        .map(s => ({
            name: s.replace(/[\{\}]/g, '').split(":").shift() || '',
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
function createFun<T>(string: string) {
    const dict = createDict(string);
    return ((parameter: T) => {
        if (parameter) {
            const type = typeof parameter;
            switch (type) {
                case 'bigint':
                case 'boolean':
                case 'number':
                case 'string':
                    return string.replace(Object.values(dict).pop() || '', (parameter as any).toString())
                case 'object':
                default:
                    return Object.entries(parameter).reduce(
                        (str, [k, v]) => str.replace(dict[k], v),
                        string,
                    )
            }

        } else {
            return string;
        }
    }
    ) as Maker<T>;
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

/*Thu Jan 09 2020 16:48:42 GMT+0800 (GMT+08:00)*/

/*{#syncSqlMaker_end#}*/

/*{#syncCountSqlMaker_start#}*/

export interface SyncCountSqlMakerParam {
    table: string;
    version_field: string;
    version_value: number;
}
export const syncCountSqlMaker = createFun<SyncCountSqlMakerParam>(`SELECT count(0) count FROM {table} WHERE {version_field} >= '{version_value:number}'`)

/*Thu Jan 09 2020 16:48:42 GMT+0800 (GMT+08:00)*/

/*{#syncCountSqlMaker_end#}*/

/*{#syncTestSqlMaker_start#}*/

export interface SyncTestSqlMakerParam {
    table: string;
    version_field: string;
    version_value: string;
    take: string;
}
export const syncTestSqlMaker = createFun<SyncTestSqlMakerParam>(`SELECT * FROM {table} WHERE {version_field} >= '{version_value}' ORDER BY {version_field} ASC LIMIT {take}`)

/*Thu Jan 09 2020 16:48:42 GMT+0800 (GMT+08:00)*/

/*{#syncTestSqlMaker_end#}*/
