module.exports = {
    title: 'Tiny-Swiper',
    tagline: 'The tagline of my site',
    url: 'https://tiny-swiper.joe223.com',
    baseUrl: '/',
    onBrokenLinks: 'throw',
    favicon: 'img/favicon.ico',
    organizationName: 'joe223', // Usually your GitHub org/user name.
    projectName: 'tiny-swiper', // Usually your repo name.
    themeConfig: {
        prism: {
            theme: require('prism-react-renderer/themes/github'),
            darkTheme: require('prism-react-renderer/themes/dracula')
        },
        navbar: {
            title: 'Tiny-Swiper',
            logo: {
                alt: 'Tiny-Swiper Logo',
                src: 'img/logo.svg'
            },
            items: [
                {
                    to: 'docs/',
                    activeBasePath: 'docs',
                    label: 'Docs',
                    position: 'left'
                },
                // right
                {
                    type: 'docsVersionDropdown',
                    position: 'right',
                },
                {
                    href: 'https://github.com/joe223/tiny-swiper',
                    label: 'GitHub',
                    position: 'right'
                }
            ]
        }
    },
    presets: [
        [
            '@docusaurus/preset-classic',
            {
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    editUrl:
                        'https://github.com/joe223/tiny-swiper/edit/master/website/'
                },
                blog: {
                    showReadingTime: true,
                    editUrl:
                        'https://github.com/joe223/tiny-swiper/edit/master/website/docs/'
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css')
                }
            }
        ]
    ]
}
