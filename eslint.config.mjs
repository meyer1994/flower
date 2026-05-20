import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  files: ['**/*.{ts,js,mjs,vue}'],
  rules: {
    '@stylistic/object-curly-newline': ['error', {
      ObjectExpression: { consistent: true },
      ObjectPattern: { consistent: true },
    }],

    // // Forces linebreaks right after '{' and right before '}'
    // '@stylistic/object-curly-newline': ['error', 'always'],

    // // Forces each individual property onto its own new line
    // '@stylistic/object-property-newline': ['error', {
    //   allowAllPropertiesOnSameLine: false,
    // }],

    // // Forces trailing commas on multi-line objects, arrays, imports, etc.
    // '@stylistic/comma-dangle': ['error', 'always-multiline'],
  },
})
