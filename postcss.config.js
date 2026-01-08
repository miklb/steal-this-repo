export default (ctx) => ({
    map: ctx.options.map,
    plugins: {
        'postcss-preset-env': {
            stage: 1,
            features: {
                'nesting-rules': true,
                'custom-properties': true
            }
        },
        'cssnano': { preset: 'default' }
    }
})