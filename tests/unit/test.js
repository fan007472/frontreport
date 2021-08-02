const modules = require.context('../views', true, /\*.vue/)
console.log(modules.resolve)

console.log('123123')