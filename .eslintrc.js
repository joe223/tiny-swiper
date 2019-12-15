module.exports = {
    'plugins': [
        'import'
    ],
    'env': {
        'jest': true,
        'browser': true,
        'node': true,
        'es6': true,
        'mocha': true
    },
    'extends': 'airbnb-base',
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
        'semi': [
            'error',
            'never'
        ],
        "comma-dangle": ["error", {
            "arrays": "never",
            "objects": "never",
            "imports": "never",
            "exports": "never",
            "functions": "never"
        }],
        'prefer-arrow-callback': ['off'],
        'func-names': ["off"],
        'no-param-reassign': ['error', {
            'props': false
        }],
        'import/extensions': ['error', {
            "js": 'always'
        }],
        "max-len": ["error", {
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
