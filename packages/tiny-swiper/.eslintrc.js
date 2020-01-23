module.exports = {
    'parser': '@typescript-eslint/parser',
    'plugins': [
        '@typescript-eslint'
    ],
    'env': {
        'jest': true,
        'browser': true,
        'node': true,
        'es6': true,
        'mocha': true
    },
    'extends': [
        'airbnb-typescript/base',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly',
        'DocumentTouch': 'readonly'
    },
    'parserOptions': {
        'ecmaVersion': 2018,
        'sourceType': 'module'
    },
    'rules': {
        '@typescript-eslint/consistent-type-assertions': ['off'],
        '@typescript-eslint/indent': [
            'error',
            4
        ],
        '@typescript-eslint/no-unused-expressions': ['off'],
        '@typescript-eslint/no-non-null-assertion': ['off'],
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        '@typescript-eslint/semi': [
            'error',
            'never'
        ],
        '@typescript-eslint/member-delimiter-style': [
            'error',
            {
                'multiline': {
                    'delimiter': 'none'
                }
            }
        ],
        'semi': [
            'error',
            'never'
        ],
        'comma-dangle': ['error', {
            'arrays': 'never',
            'objects': 'never',
            'imports': 'never',
            'exports': 'never',
            'functions': 'never'
        }],
        'prefer-arrow-callback': ['off'],
        'func-names': ['off'],
        'no-param-reassign': ['error', {
            'props': false
        }],
        'import/extensions': ['error', {
            'js': 'always'
        }],
        'import/no-cycle': ['off'],
        'import/prefer-default-export': ['off'],
        'max-len': ['error', {
            code: 140
        }],
        'space-before-function-paren': ['error', 'always'],
        'arrow-parens': ['error', 'as-needed'],
        'no-lonely-if': ['off'],
        'no-plusplus': ['off'],
        'no-unused-expressions': ['off'],
        'no-mixed-operators': ['off'],
        'no-nested-ternary': ['off'],
        'no-restricted-properties': ['off'],
        'no-param-reassign': ['off']
    }
}
