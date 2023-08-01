import { createI18n } from '@i18n-chain/core';
import en from './locales/en';
import zh from './locales/zh-cn';

const i18n = createI18n({
  defaultLocale: {
    key: 'zh',
    values: zh
  }
});
i18n.define('en', en);

export default i18n;
