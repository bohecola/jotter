import type { ParseKeys } from 'i18next'

/** i18next 资源里的一条键名（en.json 的键，复数键写基名即可）。 */
export type DictKey = ParseKeys

/**
 * 「一条待翻译的文案」的描述符：不抛出、而是作为返回值往上传的那些提示用它。
 *
 * 校验函数（validateEntryName）和 import 检查（unresolvedImportMessage）都属于
 * 「这不是异常，只是有话要说」，用 throw 表达不合适，但同样不能在 lib 里造句子。
 */
export interface Problem {
  key: DictKey
  params?: unknown
}

/*
  带「错误码」的错误，供 lib/ 里那些纯模块使用。

  为什么需要它：fs-access / compile / idb 都是普通模块，拿不到 useI18n()，
  但它们抛出的错误最终是要给人看的（提示条、侧栏错误条、Console）。
  以前的做法是就地拼好中文句子扔出来，多语言之后那条路走不通 ——
  所以这里只带「哪条文案 + 什么参数」，翻译发生在展示处（messageOf(err, t)）。

  super(key) 让 message 退化成键名：真的漏了翻译时，界面上会出现
  `err.fs.tooLarge` 这种一眼能定位的东西，而不是一句空话。
*/
export class AppError extends Error {
  constructor(
    readonly key: DictKey,
    readonly params?: unknown
  ) {
    super(key)
    this.name = 'AppError'
  }
}
