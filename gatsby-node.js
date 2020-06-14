/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
exports.onCreateWebpackConfig = ({
    stage,
    rules,
    loaders,
    plugins,
    actions,
  }) => {
    const path = require('path');
    
    actions.setWebpackConfig({
        module: {
            rules: [
                {
                    test: /\.(glsl|frag|vert)$/,
                    use: ['glslify-import-loader', 'raw-loader', 'glslify-loader']
                },
                {
                    test: /three\/examples\/js/,
                    use: 'imports-loader?THREE=three'
                },
            ]
        },
        resolve: {
            modules: [path.resolve(__dirname, "src"), "node_modules"],
        },
        plugins: [
            plugins.provide({
                'THREE': 'three'
            })
        ]
    })
  }