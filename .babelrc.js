module.exports = {
  presets: [
    '@babel/typescript',
    [
      '@babel/env',
      {
        targets: {
          browsers: ['ie >= 11']
        },
        modules: false,
        loose: true
      }
    ]
  ],
  plugins: [],
}
