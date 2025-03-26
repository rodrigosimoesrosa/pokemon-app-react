module.exports = {
    semi: false,
    trailingComma: 'none',
    singleQuote: true,
    printWidth: 100,
    tabWidth: 2,
    useTabs: false,
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
    importOrderCaseInsensitive: true,
    importOrder: [
        '^@core/(.*)$', 
        '^@server/(.*)$', 
        '^@ui/(.*)$', 
        '^@app/(.*)$',
        '^src/(.*)$',
        '^(.*)/(?!generated)(.*)/(.*)$', 
        '^(.*)/generated/(.*)$',
        '^[./]'
    ],
}