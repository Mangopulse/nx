export const i18n = {
    defaultLocale: "en",
    locales: [{
      label: "English",
      value: "en"
    }, 
    {
      label: "العربية",
      value: "ar"
    }
  ],
  } as const;
  
  export type Locale = (typeof i18n)["locales"][number];