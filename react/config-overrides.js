/* config-overrides.js */
const path = require('path');
const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');
const { getLessVars } = require('antd-theme-generator');

function resolve (dir) {
    return path.join(__dirname, '.', dir)
}

module.exports = function override(config, env) {
    //do stuff with the webpack config...

    //按需加载
    config = injectBabelPlugin(
        ['import', { libraryName: 'antd', style: true }],
        config
    );

    //配置antd主题
    config = rewireLess.withLoaderOptions({
        modifyVars: getLessVars(path.join(__dirname, './src/styles/vars.less')),
        javascriptEnabled: true
    })(config, env);

    //配置别名
    config.resolve.alias = {
        '@': resolve('src')
    }

    //启用ES7的修改器语法（babel 7）
    config = injectBabelPlugin(['@babel/plugin-proposal-decorators', { "legacy": true }], config)

    return config;
}
