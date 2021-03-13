/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
    filenameHashing: true,
    productionSourceMap: false,
    chainWebpack: (config) => {
        config
            .plugin('html')
            .tap((args) => {
                args[0].title = 'Расписание';
                return args;
            });
    },
}
