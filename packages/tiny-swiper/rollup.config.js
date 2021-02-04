import path from 'path'
import { babel } from '@rollup/plugin-babel'
import serve from 'rollup-plugin-serve'
import { uglify } from 'rollup-plugin-uglify'
import eslint from '@rollup/plugin-eslint'
import typescript from '@rollup/plugin-typescript'

const isBuildProd = process.env.NODE_ENV === 'production'

const entries = [
    {
        input: 'index.ts',
        compress: isBuildProd,
        serve: true,
        options: {
            name: 'Swiper'
        }
    },
    {
        input: 'index.full.ts',
        compress: isBuildProd,
        options: {
            name: 'Swiper',
            entryFileNames: '[name].js'
        }
    },
    {
        input: 'index.esm.ts',
        compress: false,
        options: {
            name: 'Swiper',
            format: 'es',
            entryFileNames: '[name].js'
        }
    },
    {
        input: 'modules/pagination.ts',
        compress: isBuildProd,
        options: {
            name: 'SwiperPluginPagination'
        }
    },
    {
        input: 'modules/navigation.ts',
        compress: isBuildProd,
        options: {
            name: 'SwiperPluginNavigation'
        }
    },
    {
        input: 'modules/lazyload.ts',
        compress: isBuildProd,
        options: {
            name: 'SwiperPluginLazyload'
        }
    },
    {
        input: 'modules/keyboardControl.ts',
        compress: isBuildProd,
        options: {
            name: 'SwiperPluginKeyboardControl'
        }
    },
    {
        input: 'modules/mousewheel.ts',
        compress: isBuildProd,
        options: {
            name: 'SwiperPluginMousewheel'
        }
    },
    {
        input: 'modules/autoPlay.ts',
        compress: isBuildProd,
        options: {
            name: 'SwiperPluginAutoPlay'
        }
    }
]
const extensions = [
    '.js', '.jsx', '.ts', '.tsx'
]
const plugins = [
    eslint(),
    typescript(),
    babel({
        extensions,
        include: ['src/**/*']
    })
]

function genConfig (options) {
    return options.map(entry => ({
        input: path.resolve('src', entry.input),
        plugins: [
            ...plugins,
            entry.compress ? uglify() : null,
            (isBuildProd || !entry.serve) ? null : serve(path.resolve(__dirname), {
                openPage: '/demo/default.html'
            })
        ],
        output: {
            dir: path.resolve('lib', path.dirname(entry.input)),
            format: 'umd',
            sourcemap: !isBuildProd,
            entryFileNames: isBuildProd ? '[name].min.js' : '[name].js',
            ...entry.options
        }
    }))
}

export default genConfig(entries)
