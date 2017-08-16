const fs = require('fs')
const path = require('path')
const rollup = require('rollup')
const flow = require('rollup-plugin-flow-no-whitespace')
const node = require('rollup-plugin-node-resolve')
const cjs = require('rollup-plugin-commonjs')
const replace = require('rollup-plugin-replace')
const buble = require('rollup-plugin-buble')
const uglify = require('uglify-js')
const zlib = require('zlib')
const version = process.env.VERSION || require("../package.json").version
const external = Object.keys(require("../package.json").dependencies || {});
const banner =
`/**
  * vue-app-loader v${version}
  * (c) ${new Date().getFullYear()} Jimmy Fan
  * @license MIT
  */`

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist')
}

const resolve = _path => path.resolve(__dirname, '../', _path)

build([
  // browser dev
  {
    dest: resolve('dist/vue-app-loader.js'),
    format: 'umd',
    env: 'development'
  },
  {
    dest: resolve('dist/vue-app-loader.min.js'),
    format: 'umd',
    env: 'production'
  },
  {
    dest: resolve('dist/vue-app-loader.common.js'),
    format: 'cjs'
  },
  {
    dest: resolve('dist/vue-app-loader.esm.js'),
    format: 'es'
  }
].map(genConfig))


function build (builds) {
  let built = 0
  const total = builds.length
  const next = () => {
    buildEntry(builds[built]).then(() => {
      built++
      if (built < total) {
        next()
      }
    }).catch(logError)
  }

  next()
}


function genConfig (opts) {
  const config = {
    entry: resolve('src/index.js'),
    dest: opts.dest,
    format: opts.format,
    banner,
    moduleName: 'VueAppLoader',
    globals: {
      vue: 'Vue',
      lodash: '_'
    },
    plugins: [
      flow(),
      node(),
      cjs(),
      replace({
        __VERSION__: version
      }),
      buble()
    ],
    external
  }

  if (opts.env) {
    config.plugins.unshift(replace({
      'process.env.NODE_ENV': JSON.stringify(opts.env)
    }))
  }

  return config
}

function buildEntry (config) {
  const isProd = /min\.js$/.test(config.dest)
  return rollup.rollup(config).then(bundle => {
    const code = bundle.generate(config).code
    if (isProd) {
      var minified = (config.banner ? config.banner + '\n' : '') + uglify.minify(code, {
        output: {
          ascii_only: true
        },
        compress: {
          pure_funcs: ['makeMap']
        }
      }).code
      return write(config.dest, minified, true)
    } else {
      return write(config.dest, code)
    }
  })
}

function write (dest, code, zip) {
  return new Promise((resolve, reject) => {
    function report (extra) {
      console.log(blue(path.relative(process.cwd(), dest)) + ' ' + getSize(code) + (extra || ''))
      resolve()
    }

    fs.writeFile(dest, code, err => {
      if (err) return reject(err)
      if (zip) {
        zlib.gzip(code, (err, zipped) => {
          if (err) return reject(err)
          report(' (gzipped: ' + getSize(zipped) + ')')
        })
      } else {
        report()
      }
    })
  })
}

function getSize (code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

function logError (e) {
  console.log(e)
}

function blue (str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}
