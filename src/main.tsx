import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { I18nProvider } from './i18n/index.tsx'
import { ThemeProvider } from './theme/index.tsx'
import { SettingsProvider } from './settings/index.tsx'
import { readLangMode, systemLang } from './i18n/context'
import { initI18n } from './i18n/setup'
import './assets/style/index.css'

/*
  先把 i18next 初始化完（含首帧语言那份资源）再挂 React，第一帧就是正确语言，
  不会闪一帧键名。语言用什么、怎么定，与 index.html 首帧脚本同一套规则：
  readLangMode + systemLang，见 i18n/context.ts。

  两个 Provider 互不依赖，顺序无关紧要；语言放外层是因为它还管着 <html lang> 与标题。
*/
async function bootstrap() {
  const mode = readLangMode()
  const lang = mode === 'system' ? systemLang() : mode
  await initI18n(lang)

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <I18nProvider>
        <ThemeProvider>
          <SettingsProvider>
            <App />
          </SettingsProvider>
        </ThemeProvider>
      </I18nProvider>
    </React.StrictMode>,
  )
}

void bootstrap()
