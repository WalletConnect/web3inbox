const importOrder = [
  '^(react)$',
  '<THIRD_PARTY_MODULES>',
  '^@\\/c?(.*)$',
  '^[./](?!.*.(scss|css)$).*$',
  '^[./](.*.(scss|css)$).*$'
]

const config = {
  arrowParens: 'avoid',
  printWidth: 100,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'none',
  singleAttributePerLine: false,
  semi: false,
  importOrder,
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: ['@trivago/prettier-plugin-sort-imports']
}

module.exports = config
