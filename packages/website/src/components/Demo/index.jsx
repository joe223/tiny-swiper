import React, { createRef, useCallback, useEffect, useState } from 'react'
import Swiper, { SwiperPluginBreakpoints } from 'tiny-swiper/lib/index.esm'
import './index.scss'
import StackblitzIcon from '../../../static/img/stackblitz-icon.svg'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        console.log(error);

        return { 
            error,
            hasError: true
         };
    }

    tryAgain = () => {
        console.log(this);
        this.render()
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback?.({
                error: this.state.error,
                tryAgain: this.tryAgain
            }) || <h1>Something went wrong.</h1>;
        }

        return this.props.children;
    }
}

function Container(props) {
    const EditLink = () => {
        return props.demoID ?
            <a
                className="edit-link"
                href={`https://stackblitz.com/edit/${props.demoID}?file=index.html`}
                target="_blank">
                <StackblitzIcon className="edit-icon" />
                Edit in Stackblitz
            </a> : null
    }
    const [swiperInstance, setSwiperInstance] = useState()
    const $el = createRef()
    const [width, setWidth] = useState(100)
    const setSize = useCallback(e => {
        setWidth(e.target.value)
        setTimeout(() => {
            console.log(swiperInstance);
            swiperInstance?.breakpoints?.update()
        })
    }, [setWidth, swiperInstance])
    const styleSetter = props.setWidth && <div
        className="demo-size-setting"
    >
        <label for="width">Set Width</label>

        <input
            type="range"
            name="width"
            min="20"
            max="100"
            value={width}
            step="1"
            onChange={setSize} />
    </div>

    useEffect(() => {
        const swiper = Swiper($el.current.children[0], {
            ...props.option
        })

        setSwiperInstance(swiper)
        return () => swiper.destroy()
    }, [])

    return <div className="demo-container">
        <EditLink />
        <div
            ref={$el}
            className="demo-block"
            style={{
                width: `${width}%`
            }}>
            {props.children}
        </div>
       {styleSetter}
    </div>
}

export default function Demo(props) {
    return <ErrorBoundary
        fallback={({ error, tryAgain }) => (
            <div>
                <p>This Demo crashed because of error: {error.message}.</p>
                <button onClick={tryAgain}>Try Again!</button>
            </div>
        )}>
        <Container
            {...props}
        />
    </ErrorBoundary>
}