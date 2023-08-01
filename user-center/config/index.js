const path = require('path');

const env = process.env.TARO_ENV;
let outputRoot = '';
switch (env) {
  case 'weapp':
    outputRoot = 'dist_weapp';
    break;
  case 'h5':
    outputRoot = 'dist_h5';
    break;
  case 'alipay':
    outputRoot = 'dist_alipay';
    break;
  case 'tt':
    outputRoot = 'dist_tt';
    break;
  default:
    outputRoot = 'dist';
}
const Version = new Date().getTime();
const config = {
  projectName: 'user-center',
  date: '2020-5-25',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot,
  plugins: [],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {}
  },
  framework: 'react',
  mini: {
    miniCssExtractPluginOption: {
      ignoreOrder: true
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {}
      },
      url: {
        enable: true,
        config: {
          limit: 10240 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  sass: {
    resource: [path.resolve(__dirname, '..', 'src/styles/theme.scss')]
  },
  alias: {
    '@actions': path.resolve(__dirname, '..', 'src/actions'),
    '@api': path.resolve(__dirname, '..', 'src/api'),
    '@assets': path.resolve(__dirname, '..', 'src/assets'),
    '@components': path.resolve(__dirname, '..', 'src/components'),
    '@constants': path.resolve(__dirname, '..', 'src/constants'),
    '@reducers': path.resolve(__dirname, '..', 'src/reducers'),
    '@styles': path.resolve(__dirname, '..', 'src/styles'),
    '@utils': path.resolve(__dirname, '..', 'src/utils'),
    '@i18n': path.resolve(__dirname, '..', 'src/i18n')
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    output: {
      filename: `js/[name].[hash:8]${Version}${new Date().getTime()}.js`,
      chunkFilename: `js/[name].[chunkhash:8]${Version}${new Date().getTime()}.js`
    },
    devServer: {
      port: 10086
    },
    esnextModules: ['taro-ui', 'taro-react-echarts'],
    postcss: {
      autoprefixer: {
        enable: true,
        config: {}
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  }
};

module.exports = function (merge) {
  const buildConfig = {
    env: {
      BUILD_ENV: JSON.stringify(process.env.BUILD_ENV)
    }
  };
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'), buildConfig);
  }
  return merge({}, config, require('./prod'), buildConfig);
};
