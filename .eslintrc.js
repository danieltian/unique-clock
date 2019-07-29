module.exports = {
  extends: 'plugin:vue/recommended',

  rules: {
    // Don't allow semi-colons: https://eslint.org/docs/rules/semi
    'semi': ['error', 'never'],

    // Don't allow spaces between array bracket and first/last items: https://eslint.org/docs/rules/array-bracket-spacing
    'array-bracket-spacing': ['error', 'never'],

    // Don't allow space between function and parameters: https://eslint.org/docs/rules/space-before-function-paren
    'space-before-function-paren': ['error', { named: 'never', anonymous: 'never' }],

    // Always require a space between { and }: https://eslint.org/docs/rules/object-curly-spacing
    'object-curly-spacing': ['error', 'always'],

    // Require spaces after commas for function parameters: https://eslint.org/docs/rules/comma-spacing
    'comma-spacing': ['error', { after: true }],

    // Require parenthesis around arrow function parameters: https://eslint.org/docs/rules/arrow-parens
    'arrow-parens': ['error', 'always'],

    // Require spaces around the arrow part of the arrow function: https://eslint.org/docs/rules/arrow-spacing
    'arrow-spacing': ['error', { before: true, after: true }],

    // Don't allow commas after the last item for objects and arrays: https://eslint.org/docs/rules/comma-dangle
    'comma-dangle': ['warn', 'never'],

    // Comments must have a space after the double-slash: https://eslint.org/docs/rules/spaced-comment
    'spaced-comment': ['warn', 'always', { block: { markers: ['!'] } }],

    // Comments must always start with a capital letter: https://eslint.org/docs/rules/capitalized-comments
    'capitalized-comments': ['warn', 'always', { ignoreConsecutiveComments: true }],

    // Indentation in Vue templates must always be 2 spaces, no tabs: https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/script-indent.md
    'vue/script-indent': ['error', 2, { baseIndent: 1, switchCase: 1 }],

    // Quotes must be single quotes only: https://eslint.org/docs/rules/quotes
    'quotes': ['error', 'single']
  }
}
