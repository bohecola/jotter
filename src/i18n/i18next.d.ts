/*
  让 t() 认识 en.json 里的键：写错键名是编译错误。
  参数形状没有编译期检查（明确接受的代价），由两道防线补：
  dev 下的 missingInterpolationHandler（setup.ts）和 scripts/check-locales.mjs 的
  变量一致性检查。
*/
import 'i18next'
import type en from '../locales/en.json'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: { translation: typeof en }
    keySeparator: false
    nsSeparator: false
    returnNull: false
  }
}
