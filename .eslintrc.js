/* eslint-disable no-magic-numbers */
/* eslint-disable array-bracket-spacing */
/* eslint-disable quote-props */
module.exports = {
    extends: ['plugin:storybook/recommended'],
    plugins: ['@typescript-eslint', '@typescript-eslint/eslint-plugin'],
    rules: {
    // A temporary hack related to IDE not resolving correct package.json
        'import/no-extraneous-dependencies': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/jsx-filename-extension': 'off',
        'react/no-array-index-key': 'off',
        'import/extensions': 'off',
        'import/no-unresolved': 'off',
        'import/no-import-module-exports': 'off',
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': 'error',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'error',
        'class-methods-use-this': 'off',
        'no-await-in-loop': 'off',
        'no-console': 1, // Remember, this means error!  }"no-extra-parens": 2,
        'no-unexpected-multiline': 2,
        // All JSDoc comments must be valid
        'valid-jsdoc': [ 2, {
            'requireReturn': false,
            'requireReturnDescription': false,
            'requireParamDescription': true,
            'prefer': {
                'return': 'returns'
            }
        }],

        // Best Practices

        // Allowed a getter without setter, but all setters require getters
        'accessor-pairs': [ 2, {
            'getWithoutSet': false,
            'setWithoutGet': true
        }],
        'block-scoped-var': 1,
        'consistent-return': 2,
        'curly': 2,
        'default-case': 1,
        // the dot goes with the property when doing multiline
        'dot-location': [ 1, 'property' ],
        'dot-notation': 1,
        'eqeqeq': [ 2, 'smart' ],
        'guard-for-in': 1,
        'no-alert': 2,
        'no-caller': 2,
        'no-case-declarations': 1,
        'no-div-regex': 1,
        'no-else-return': 1,
        'no-empty-pattern': 1,
        'no-eq-null': 1,
        'no-eval': 2,
        'no-extend-native': 2,
        'no-extra-bind': 1,
        'no-floating-decimal': 1,
        'no-implicit-coercion': [ 1, {
            'boolean': true,
            'number': true,
            'string': true
        }],
        'no-implied-eval': 2,
        'no-invalid-this': 2,
        'no-iterator': 2,
        'no-labels': 1,
        'no-lone-blocks': 1,
        'no-loop-func': 2,
        'no-magic-numbers': 1,
        'no-multi-spaces': 2,
        'no-multi-str': 1,
        'no-native-reassign': 2,
        'no-new-func': 2,
        'no-new-wrappers': 2,
        'no-new': 2,
        'no-octal-escape': 2,
        'no-param-reassign': 2,
        'no-process-env': 1,
        'no-proto': 2,
        'no-redeclare': 2,
        'no-return-assign': 2,
        'no-script-url': 2,
        'no-self-compare': 2,
        'no-throw-literal': 2,
        'no-unused-expressions': 2,
        'no-useless-call': 2,
        'no-useless-concat': 2,
        'no-void': 1,
        // Produce warnings when something is commented as TODO or FIXME
        'no-warning-comments': [ 1, {
            'terms': [ 'TODO', 'FIXME' ],
            'location': 'start'
        }],
        'no-with': 1,
        'radix': 1,
        'vars-on-top': 2,
        // Enforces the style of wrapped functions
        'wrap-iife': [ 2, 'outside' ],
        'yoda': 2,

        // Strict Mode - for ES6, never use strict.
        'strict': [ 2, 'never' ],

        // Variables
        'init-declarations': [ 2, 'always' ],
        'no-catch-shadow': 1,
        'no-delete-var': 2,
        'no-label-var': 2,
        'no-shadow-restricted-names': 2,
        'no-shadow': 1,
        // We require all vars to be initialized (see init-declarations)
        // If we NEED a var to be initialized to undefined, it needs to be explicit
        'no-undef-init': 0,
        'no-undef': 2,
        'no-undefined': 0,
        'no-unused-vars': 1,
        // Disallow hoisting - let & const don't allow hoisting anyhow
        'no-use-before-define': 2,

        // Node.js and CommonJS
        'callback-return': [ 1, [ 'callback', 'next' ]],
        'global-require': 2,
        'handle-callback-err': 1,
        'no-mixed-requires': 1,
        'no-new-require': 2,
        // Use path.concat instead
        'no-path-concat': 2,
        'no-process-exit': 2,
        'no-restricted-modules': 0,
        'no-sync': 1,

        // ECMAScript 6 support
        'arrow-body-style': [ 2, 'always' ],
        'arrow-parens': [ 2, 'always' ],
        'arrow-spacing': [ 2, { 'before': true, 'after': true }],
        'constructor-super': 2,
        'generator-star-spacing': [ 2, 'before' ],
        'no-confusing-arrow': 2,
        'no-class-assign': 2,
        'no-const-assign': 2,
        'no-dupe-class-members': 2,
        'no-this-before-super': 2,
        'no-var': 1,
        'object-shorthand': [ 1, 'never' ],
        'prefer-arrow-callback': 1,
        'prefer-spread': 1,
        'prefer-template': 1,
        'require-yield': 2,

        // Stylistic - everything here is a warning because of style.
        'array-bracket-spacing': [ 1, 'always' ],
        'block-spacing': [ 1, 'always' ],
        'brace-style': [ 1, '1tbs', { 'allowSingleLine': false } ],
        'camelcase': 1,
        'comma-spacing': [ 1, { 'before': false, 'after': true } ],
        'comma-style': [ 1, 'last' ],
        'computed-property-spacing': [ 1, 'never' ],
        'consistent-this': [ 1, 'self' ],
        'eol-last': 1,
        'func-names': 1,
        'func-style': [ 1, 'declaration',
            {
                'allowArrowFunctions': true
            } ],
        'id-length': [ 1, { 'min': 2, 'max': 32 } ],
        'indent': [ 1, 4 ],
        'jsx-quotes': [ 1, 'prefer-double' ],
        'linebreak-style': [ 1, 'unix' ],
        'lines-around-comment': [ 1, { 'beforeBlockComment': true } ],
        'max-depth': [ 1, 8 ],
        'max-len': [ 1, 132 ],
        'max-nested-callbacks': [ 1, 8 ],
        'max-params': [ 1, 10 ],
        'new-cap': 1,
        'new-parens': 1,
        'no-array-constructor': 1,
        'no-bitwise': 0,
        'no-continue': 0,
        'no-inline-comments': 0,
        'no-lonely-if': 1,
        'no-mixed-spaces-and-tabs': 1,
        'no-multiple-empty-lines': 1,
        'no-negated-condition': 0,
        'no-nested-ternary': 1,
        'no-new-object': 1,
        'no-plusplus': 0,
        'no-spaced-func': 1,
        'no-ternary': 0,
        'no-trailing-spaces': 1,
        'no-underscore-dangle': 1,
        'no-unneeded-ternary': 1,
        'object-curly-spacing': [ 1, 'always' ],
        'one-var': 0,
        'operator-assignment': [ 1, 'never' ],
        'operator-linebreak': [ 1, 'after' ],
        'padded-blocks': [ 0, 'never' ],
        'quote-props': [ 1, 'consistent-as-needed' ],
        'quotes': [ 1, 'single' ],
        'require-jsdoc': [ 1, {
            'require': {
                'FunctionDeclaration': true,
                'MethodDefinition': true,
                'ClassDeclaration': false
            }
        }],
        'semi-spacing': [ 0, { 'before': false, 'after': true }],
        'semi': [ 0, 'always' ],
        'sort-vars': 0,
        'keyword-spacing': [ 1, { 'before':true, 'after':true } ],
        'space-before-blocks': [ 1, 'always' ],
        'space-before-function-paren': [ 1, 'never' ],
        'space-in-parens': [ 1, 'never' ],
        'space-infix-ops': [ 1, { 'int32Hint': true } ],
        'space-unary-ops': 2,
        'spaced-comment': [ 1, 'always' ],
        'wrap-regex': 1
    },
    parserOptions: {
        project: './tsconfig.json',
    },
};
