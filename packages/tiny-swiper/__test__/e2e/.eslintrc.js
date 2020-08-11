module.exports = {
    'extends': '../../.eslintrc.js',
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly',
        'browser': true,
        'expect': 'readonly'
    },
    "rules": {
        "no-undef": ['off'],
        "no-unused-vars": ['off'],
        "no-console": ['off'],
        'import/extensions': ['error', 'never']
    }
}
