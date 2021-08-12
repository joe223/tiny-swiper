module.exports = {
    title: 'Tiny-Swiper | Ingenious JavaScript Carousel powered by wonderful plugins',
    tagline: 'The tagline of my site',
    url: 'https://tiny-swiper.js.org',
    baseUrl: '/',
    onBrokenLinks: 'throw',
    favicon: 'img/favicon.ico',
    organizationName: 'joe223', // Usually your GitHub org/user name.
    projectName: 'tiny-swiper', // Usually your repo name.
    plugins: [
        'docusaurus-plugin-sass'
    ],
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
                {
                    to: 'docs/demo/',
                    activeBasePath: 'docs',
                    label: 'Demos',
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
        },
        googleAnalytics: {
            trackingID: 'UA-153214295-1',
            // Optional fields.
            anonymizeIP: true, // Should IPs be anonymized
        }
    },
    presets: [
        [
            '@docusaurus/preset-classic',
            {
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    editUrl:
                        'https://github.com/joe223/tiny-swiper/blob/dev_2.0/packages/website/docs'
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
