import * as yaml from 'yamljs'
import { coder } from 'string2fun'
import { compose, map, filter, curry, flatMap } from 'lodash/fp'
import { uniqBy } from 'lodash'
import * as ph from 'path'
import * as fs from 'fs'
import fromPairs = require('lodash/fp/fromPairs')
import { map as _map } from 'rxjs/operators'
import join = require('lodash/fp/join')
export interface QueryResultOption {
    multiple: boolean
    auto: boolean
    pick?: string
    type: any
}
export interface QueryTemplate<P = any, R = any> {
    template: string;
    name: string;
    tag: string;
    maker: string;
    result: QueryResultOption;
    resultType: R;
}
export interface Querist {
    query: <R = any>(sql: string) => Promise<R>
}

export interface QueryConfig {
    path: {
        maker: string;
        query: string;
    }
    templates: QueryTemplate[];
    include_templates: string[]
}
const queryTemplateComplie = (template: Partial<QueryTemplate>) => {
    return {
        ...template, maker: {}, tag: template.tag ?? 'default', result: {
            auto: template?.result?.auto ?? false,
            multiple: template?.result?.multiple ?? true,
            pick: template?.result?.pick ?? null,
            type: template?.result?.type ?? 'any'
        }
    } as QueryTemplate;
}

const removeExt = (path: string) => ph.basename(path).replace(ph.extname(path), '')
const isDirectory = compose((stat: fs.Stats) => stat.isDirectory(), curry(fs.statSync))
const isFile = compose((b) => !b, isDirectory);
const isYaml = (path: string) => isFile(path) && ['.yaml', '.yml'].includes(ph.extname(path).toLowerCase())
const readFullPath = (path: string) => map(sub => ph.resolve(`${path}/${sub}`))(fs.readdirSync(path))
const mergeYaml = map(yaml.load.bind(yaml))
const findYamlPath = curry((file: string, path: string[]) =>
    compose(flatMap(_ => _ as string[]),
        map((s: string) => filter((p: string) => isYaml(p) && p != ph.resolve(file))(readFullPath(ph.resolve(ph.dirname(file), s)))))(path));
const genFun = (template: QueryTemplate) => {
    return `export const ${template.name}Query = QueryBuilder(makers.${template.maker},'${template.tag}');`
}
const genCode = compose(join('\n'), map(genFun));
const build = ([makerPath, queryPath]: [string, string], templates: QueryTemplate[]) => {
    const templateContent = fs.readFileSync(__dirname + "/../../code.template").toString();
    const target = fs.existsSync(queryPath) ? fs.readFileSync(queryPath).toString() : '';
    const code = `${templateContent}\n${genCode(templates)}`;
    if (target !== code) {
        fs.writeFileSync(queryPath, code)
    }

}
export const resolve = (path: string) => {
    const config: QueryConfig = yaml.load(path)
    config.include_templates = config.include_templates || []
    config.templates = map(queryTemplateComplie)(uniqBy(
        [...config.templates,
        ...mergeYaml(findYamlPath(path)(config.include_templates)) as QueryTemplate[]]
        , 'name'
    ))
    //console.log()
    config.path = fromPairs(Object.entries(config.path).map(([name, val]) => [name, ph.resolve(ph.dirname(path), val)])) as any
    const _coder = new coder(config.path.maker)
    for (const template of config.templates) {
        template.maker = `${template.name}SqlMaker` as any
        _coder.write(template.maker, template.template, false)
    }
    build([config.path.maker, config.path.query], config.templates)
    return config;
}
