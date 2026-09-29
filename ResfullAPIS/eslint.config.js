module.exports = [
    {
        languageOptions: {
            globals: {
                // Node.js Globals
                require    : 'readonly',
                module     : 'readonly',
                exports    : 'readonly',
                console    : 'readonly',
                process    : 'readonly',
                __dirname  : 'readonly',
                __filename : 'readonly',
                setTimeout : 'readonly',
                setInterval: 'readonly',
                clearTimeout: 'readonly',
                Buffer     : 'readonly',
            }
        },

        rules: {

            // Variables

            'no-unused-vars'       : 'warn',
            'no-undef'             : 'error',
            'no-var'               : 'error',
            'prefer-const'         : 'warn',


            // Code Quality

            'eqeqeq'               : 'error',
            'no-console'           : 'off',
            'no-debugger'          : 'error',

            // FIX: Name changed from 'no-duplicate-keys' to 'no-dupe-keys'
            'no-dupe-keys'         : 'error',
            'no-empty'             : 'warn',
            'no-extra-semi'        : 'error',

            // Formatting

            'semi'                 : ['error', 'always'],
            'quotes'               : ['error', 'single'],
            'curly'                : 'error',
            'indent'               : ['warn', 4],
            'no-trailing-spaces'   : 'warn',
            'no-multiple-empty-lines': ['warn', { max: 2 }],

            // Functions

            'no-unused-expressions': 'warn',
            'consistent-return'    : 'warn',

            // Async / Await

            'no-async-promise-executor': 'error',
            'no-await-in-loop'         : 'warn',
        }
    }
];