import React, { createRef, useEffect } from 'react'
import Swiper from 'tiny-swiper/lib/index.esm'
import './index.scss'
import StackblitzIcon from '../../../static/img/stackblitz-icon.svg'

export default function Demo (props) {
    const EditLink = () => {
        return props.demoID ?
            <a
                className="edit-link"
                href={`https://stackblitz.com/edit/${props.demoID}?file=index.html`}
                target="_blank">
                <StackblitzIcon className="edit-icon"/>
                Edit in Stackblitz
            </a> : null
    }

    const $el = createRef()

    useEffect(() => {
        const swiper = Swiper($el.current.children[0], {
            ...props.option
        })

        return () => swiper.destroy()
    })

    return <div className="demo-container">
        <EditLink/>
        <div
            ref={$el}
            className="demo-block">
            {props.children}
        </div>
    </div>
}
