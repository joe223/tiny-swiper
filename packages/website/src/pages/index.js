import React from 'react'
import clsx from 'clsx'
import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'
import CodeBlock from '@theme/CodeBlock'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import useBaseUrl from '@docusaurus/useBaseUrl'
import styles from './styles.module.css'

const demoJavaScript = `import Swiper, {
    SwiperPluginLazyload,
    SwiperPluginPagination
} from 'tiny-swiper'

Swiper.use([ SwiperPluginLazyload, SwiperPluginPagination ])

const swiper = new Swiper(swiperContainer: HTMLElement | string, parameters?: TinySwiperParameters)`
const demoHTML = `<!-- Slider main container -->
<div class="swiper-container">
    <!-- Additional required wrapper -->
    <div class="swiper-wrapper">
        <!-- Slides -->
        <div class="swiper-slide">Slide 1</div>
        <div class="swiper-slide">Slide 2</div>
        <div class="swiper-slide">Slide 3</div>
        ...
    </div>
    <!-- If we need pagination -->
    <div class="swiper-pagination"></div>
</div>`

function Home() {
    const context = useDocusaurusContext()
    const {siteConfig = {}} = context
    return (
        <Layout
            title={siteConfig.title}
            description="Lightweight yet fully configurable and extensible web carousel.">
            <div className={styles.container}>
                <main className={styles.head}>
                    <img
                        className={styles.logo}
                        src={useBaseUrl('img/logo.svg')}
                        alt="Tiny-Swiper logo"/>
                    <div className={styles.sloganPc}>The Powerful <br/>
                        JavaScript Carousels</div>
                </main>

                <div className={styles.desc}>Lightweight yet fully configurable and extensible web carousel with native-like behavior.
                    Zero dependency, written in vanilla JavaScript, used for free and without any attribution.
                    <Link to={useBaseUrl('./docs')}>
                        More Details
                    </Link>
                </div>

                <div className={styles.btnGroup}>
                    <Link
                        to='./docs'
                        className={clsx([styles.button, styles.btnStart])}>
                        GET STARTED
                    </Link>
                    <Link
                        to='https://github.com/joe223/tiny-swiper'
                        className={clsx([styles.button, styles.btnGithub])}>
                        GITHUB
                    </Link>
                </div>

                <div className={styles.demo}>
                    <p>It's easy to initialize TinySwiper:</p>

                    <CodeBlock className='js'>
                        {demoJavaScript}
                    </CodeBlock>

                    <p>And the basic HTML code:</p>

                    <CodeBlock className='html'>
                        {demoHTML}
                    </CodeBlock>
                </div>
            </div>
        </Layout>
    )
}

export default Home
