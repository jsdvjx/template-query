// import * as fs from 'fs'
// import fromPairs = require('lodash/fp/fromPairs')
// import first = require("lodash/fp/first")
// const p = /\[[\w\d]{4,10}\]:.\/[\w]+\/[\w\d]{4,10}.\"[\w\W]+?\"/g
// const ps = /\[[\w\d]{4,10}\]/g
// const bp = "C:\\Users\\jsdv\\project\\lingaoqiming.github.com-master\\_posts"
// type Info = {
//     layout: string,
//     title: string,
//     category: number,
//     path: string,
//     tag: string,
// }
// type SArticle = {
//     title: string;
//     index: number;
//     content: string;
// }
// const info2SInfo = (info: Info): SArticle => ({
//     title: `${info.category.toString() == '0' ? '资料' : `第${info.category}章`} ${info.title}`,
//     index: parseInt(`${info.category}${first(info.path.split('.')).split('-').pop()}`),
//     content: ''
// })
// const complie = (article: string) => {
//     const [, titleStr, content] = article.replace(p, '').replace(ps, '').split('---\r\n')
//     const info: Info = fromPairs(titleStr.split("\r\n").map(i => i.split(":").map(s => s.trim()))) as any
//     const result = info2SInfo(info);
//     result.content = content;
//     return result;
// }
// const sa2str=(article:SArticle)=>{
//     return `${article.title}\n\n${article.content}\n\n---------------------------------------------------\n\n`
// }
// const getBook = (bookPath: string) =>
//     fs.readdirSync(bookPath).map(p => `${bookPath}/${p}`).map(p => complie(fs.readFileSync(p).toString())).sort((a, b) => a.index - b.index).map(sa2str).join('')

// fs.writeFileSync(bp+"/临高启明.txt",getBook(bp));