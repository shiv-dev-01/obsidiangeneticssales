import logo from "../../logo.png";

export const PRODUCT_LINES = {
  JOINTRIM: {
    id: 'JOINTRIM',
    name: 'JoinTrim',
    baseUrl: 'https://panel.whitelabelmd.com/obsidian',
    enabled: true,
    logo: 'https://jointrim.com/wp-content/uploads/2024/07/JoinTrim-Logo-zoomed-1.png'
  },
  // GETTRIM: {
  //   id: 'GETTRIM',
  //   name: 'obsidiangenetics',
  //   baseUrl: 'https://panel.whitelabelmd.com/obsidian',
  //   enabled: true,
  //   logo: logo,
  //   // logo: 'https://www.gettrim.com/wp-content/uploads/2024/12/GetTrim-Logo-with-TM-1.png'
  // }
} as const;

export type ProductLine = keyof typeof PRODUCT_LINES;