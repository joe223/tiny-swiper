(window.webpackJsonp=window.webpackJsonp||[]).push([[22,8],{100:function(e,t){e.exports.parse=function(e){var t=e.split(",").map((function(e){return function(e){if(/^-?\d+$/.test(e))return parseInt(e,10);var t;if(t=e.match(/^(-?\d+)(-|\.\.\.?|\u2025|\u2026|\u22EF)(-?\d+)$/)){var a=t[1],n=t[2],r=t[3];if(a&&r){var l=[],s=(a=parseInt(a))<(r=parseInt(r))?1:-1;"-"!=n&&".."!=n&&"\u2025"!=n||(r+=s);for(var o=a;o!=r;o+=s)l.push(o);return l}}return[]}(e)}));return 0===t.length?[]:1===t.length?Array.isArray(t[0])?t[0]:t:t.reduce((function(e,t){return Array.isArray(e)||(e=[e]),Array.isArray(t)||(t=[t]),e.concat(t)}))}},101:function(e,t,a){"use strict";var n=a(2),r=a(0),l=a.n(r),s=a(84),o={plain:{backgroundColor:"#2a2734",color:"#9a86fd"},styles:[{types:["comment","prolog","doctype","cdata","punctuation"],style:{color:"#6c6783"}},{types:["namespace"],style:{opacity:.7}},{types:["tag","operator","number"],style:{color:"#e09142"}},{types:["property","function"],style:{color:"#9a86fd"}},{types:["tag-id","selector","atrule-id"],style:{color:"#eeebff"}},{types:["attr-name"],style:{color:"#c4b9fe"}},{types:["boolean","string","entity","url","attr-value","keyword","control","directive","unit","statement","regex","at-rule","placeholder","variable"],style:{color:"#ffcc99"}},{types:["deleted"],style:{textDecorationLine:"line-through"}},{types:["inserted"],style:{textDecorationLine:"underline"}},{types:["italic"],style:{fontStyle:"italic"}},{types:["important","bold"],style:{fontWeight:"bold"}},{types:["important"],style:{color:"#c4b9fe"}}]},i={Prism:a(20).a,theme:o};function c(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function p(){return(p=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(e[n]=a[n])}return e}).apply(this,arguments)}var u=/\r\n|\r|\n/,d=function(e){0===e.length?e.push({types:["plain"],content:"",empty:!0}):1===e.length&&""===e[0].content&&(e[0].empty=!0)},m=function(e,t){var a=e.length;return a>0&&e[a-1]===t?e:e.concat(t)},g=function(e,t){var a=e.plain,n=Object.create(null),r=e.styles.reduce((function(e,a){var n=a.languages,r=a.style;return n&&!n.includes(t)||a.types.forEach((function(t){var a=p({},e[t],r);e[t]=a})),e}),n);return r.root=a,r.plain=p({},a,{backgroundColor:null}),r};function y(e,t){var a={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&-1===t.indexOf(n)&&(a[n]=e[n]);return a}var b=function(e){function t(){for(var t=this,a=[],n=arguments.length;n--;)a[n]=arguments[n];e.apply(this,a),c(this,"getThemeDict",(function(e){if(void 0!==t.themeDict&&e.theme===t.prevTheme&&e.language===t.prevLanguage)return t.themeDict;t.prevTheme=e.theme,t.prevLanguage=e.language;var a=e.theme?g(e.theme,e.language):void 0;return t.themeDict=a})),c(this,"getLineProps",(function(e){var a=e.key,n=e.className,r=e.style,l=p({},y(e,["key","className","style","line"]),{className:"token-line",style:void 0,key:void 0}),s=t.getThemeDict(t.props);return void 0!==s&&(l.style=s.plain),void 0!==r&&(l.style=void 0!==l.style?p({},l.style,r):r),void 0!==a&&(l.key=a),n&&(l.className+=" "+n),l})),c(this,"getStyleForToken",(function(e){var a=e.types,n=e.empty,r=a.length,l=t.getThemeDict(t.props);if(void 0!==l){if(1===r&&"plain"===a[0])return n?{display:"inline-block"}:void 0;if(1===r&&!n)return l[a[0]];var s=n?{display:"inline-block"}:{},o=a.map((function(e){return l[e]}));return Object.assign.apply(Object,[s].concat(o))}})),c(this,"getTokenProps",(function(e){var a=e.key,n=e.className,r=e.style,l=e.token,s=p({},y(e,["key","className","style","token"]),{className:"token "+l.types.join(" "),children:l.content,style:t.getStyleForToken(l),key:void 0});return void 0!==r&&(s.style=void 0!==s.style?p({},s.style,r):r),void 0!==a&&(s.key=a),n&&(s.className+=" "+n),s}))}return e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t,t.prototype.render=function(){var e=this.props,t=e.Prism,a=e.language,n=e.code,r=e.children,l=this.getThemeDict(this.props),s=t.languages[a];return r({tokens:function(e){for(var t=[[]],a=[e],n=[0],r=[e.length],l=0,s=0,o=[],i=[o];s>-1;){for(;(l=n[s]++)<r[s];){var c=void 0,p=t[s],g=a[s][l];if("string"==typeof g?(p=s>0?p:["plain"],c=g):(p=m(p,g.type),g.alias&&(p=m(p,g.alias)),c=g.content),"string"==typeof c){var y=c.split(u),b=y.length;o.push({types:p,content:y[0]});for(var h=1;h<b;h++)d(o),i.push(o=[]),o.push({types:p,content:y[h]})}else s++,t.push(p),a.push(c),n.push(0),r.push(c.length)}s--,t.pop(),a.pop(),n.pop(),r.pop()}return d(o),i}(void 0!==s?t.tokenize(n,s,a):[n]),className:"prism-code language-"+a,style:void 0!==l?l.root:{},getLineProps:this.getLineProps,getTokenProps:this.getTokenProps})},t}(r.Component),h=a(99),v=a.n(h),f=a(100),k=a.n(f),j=a(83),w={plain:{color:"#bfc7d5",backgroundColor:"#292d3e"},styles:[{types:["comment"],style:{color:"rgb(105, 112, 152)",fontStyle:"italic"}},{types:["string","inserted"],style:{color:"rgb(195, 232, 141)"}},{types:["number"],style:{color:"rgb(247, 140, 108)"}},{types:["builtin","char","constant","function"],style:{color:"rgb(130, 170, 255)"}},{types:["punctuation","selector"],style:{color:"rgb(199, 146, 234)"}},{types:["variable"],style:{color:"rgb(191, 199, 213)"}},{types:["class-name","attr-name"],style:{color:"rgb(255, 203, 107)"}},{types:["tag","deleted"],style:{color:"rgb(255, 85, 114)"}},{types:["operator"],style:{color:"rgb(137, 221, 255)"}},{types:["boolean"],style:{color:"rgb(255, 88, 116)"}},{types:["keyword"],style:{fontStyle:"italic"}},{types:["doctype"],style:{color:"rgb(199, 146, 234)",fontStyle:"italic"}},{types:["namespace"],style:{color:"rgb(178, 204, 214)"}},{types:["url"],style:{color:"rgb(221, 221, 221)"}}]},E=a(87);var O=()=>{const{siteConfig:{themeConfig:{prism:e={}}}}=Object(j.a)(),{isDarkTheme:t}=Object(E.a)(),a=e.theme||w,n=e.darkTheme||a;return t?n:a},N=a(49),_=a.n(N);const S=/{([\d,-]+)}/,x=(e=["js","jsBlock","jsx","python","html"])=>{const t={js:{start:"\\/\\/",end:""},jsBlock:{start:"\\/\\*",end:"\\*\\/"},jsx:{start:"\\{\\s*\\/\\*",end:"\\*\\/\\s*\\}"},python:{start:"#",end:""},html:{start:"\x3c!--",end:"--\x3e"}},a=["highlight-next-line","highlight-start","highlight-end"].join("|"),n=e.map((e=>`(?:${t[e].start}\\s*(${a})\\s*${t[e].end})`)).join("|");return new RegExp(`^\\s*(?:${n})\\s*$`)},T=/title=".*"/;t.a=({children:e,className:t,metastring:a})=>{const{siteConfig:{themeConfig:{prism:o={}}}}=Object(j.a)(),[c,p]=Object(r.useState)(!1),[u,d]=Object(r.useState)(!1);Object(r.useEffect)((()=>{d(!0)}),[]);const m=Object(r.useRef)(null);let g=[],y="";const h=O();if(a&&S.test(a)){const e=a.match(S)[1];g=k.a.parse(e).filter((e=>e>0))}a&&T.test(a)&&(y=a.match(T)[0].split("title=")[1].replace(/"+/g,""));let f=t&&t.replace(/language-/,"");!f&&o.defaultLanguage&&(f=o.defaultLanguage);let w=e.replace(/\n$/,"");if(0===g.length&&void 0!==f){let t="";const a=(e=>{switch(e){case"js":case"javascript":case"ts":case"typescript":return x(["js","jsBlock"]);case"jsx":case"tsx":return x(["js","jsBlock","jsx"]);case"html":return x(["js","jsBlock","html"]);case"python":case"py":return x(["python"]);default:return x()}})(f),n=e.replace(/\n$/,"").split("\n");let r;for(let e=0;e<n.length;){const l=e+1,s=n[e].match(a);if(null!==s){switch(s.slice(1).reduce(((e,t)=>e||t),void 0)){case"highlight-next-line":t+=l+",";break;case"highlight-start":r=l;break;case"highlight-end":t+=`${r}-${l-1},`}n.splice(e,1)}else e+=1}g=k.a.parse(t),w=n.join("\n")}const E=()=>{v()(w),p(!0),setTimeout((()=>p(!1)),2e3)};return l.a.createElement(b,Object(n.a)({},i,{key:String(u),theme:h,code:w,language:f}),(({className:e,style:t,tokens:a,getLineProps:r,getTokenProps:o})=>l.a.createElement(l.a.Fragment,null,y&&l.a.createElement("div",{style:t,className:_.a.codeBlockTitle},y),l.a.createElement("div",{className:_.a.codeBlockContent},l.a.createElement("button",{ref:m,type:"button","aria-label":"Copy code to clipboard",className:Object(s.a)(_.a.copyButton,{[_.a.copyButtonWithTitle]:y}),onClick:E},c?"Copied":"Copy"),l.a.createElement("div",{tabIndex:0,className:Object(s.a)(e,_.a.codeBlock,{[_.a.codeBlockWithTitle]:y})},l.a.createElement("div",{className:_.a.codeBlockLines,style:t},a.map(((e,t)=>{1===e.length&&""===e[0].content&&(e[0].content="\n");const a=r({line:e,key:t});return g.includes(t+1)&&(a.className=a.className+" docusaurus-highlight-code-line"),l.a.createElement("div",Object(n.a)({key:t},a),e.map(((e,t)=>l.a.createElement("span",Object(n.a)({key:t},o({token:e,key:t}))))))}))))))))}},123:function(e,t,a){e.exports={container:"container_3QU4",head:"head_3nkB",logo:"logo_uGj9",sloganPc:"sloganPc_2ULa",sloganMobile:"sloganMobile_2xwn",desc:"desc_1wXT",descMobile:"descMobile_RiM5",btnGroup:"btnGroup_aJqr",button:"button_Qf9c",btnStart:"btnStart_1EPM",btnGithub:"btnGithub_3Vu1",demo:"demo_2S95"}},78:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),l=a(84),s=a(94),o=a(85),i=a(101),c=a(83),p=a(86),u=a(123),d=a.n(u);t.default=function(){return Object(c.a)().siteConfig,r.a.createElement(s.a,{description:"Ingenious JavaScript Carousel powered by wonderful plugins with native-like experience for the web."},r.a.createElement("div",{className:d.a.container},r.a.createElement("main",{className:d.a.head},r.a.createElement("img",{className:d.a.logo,src:Object(p.a)("img/logo.svg"),alt:"Tiny-Swiper logo"}),r.a.createElement("div",{className:Object(l.a)(d.a.slogan,d.a.sloganPc)},"The Powerful ",r.a.createElement("br",null),"JavaScript Carousel"),r.a.createElement("div",{className:Object(l.a)(d.a.slogan,d.a.sloganMobile)},"Tiny-Swiper")),r.a.createElement("div",{className:d.a.desc},"Ingenious JavaScript Carousel powered by wonderful plugins with native-like experience for the web. Zero dependency, written in TypeScript, used\xa0for free\xa0and\xa0without any attribution.",r.a.createElement(o.a,{to:Object(p.a)("docs")},"\xa0More Details")),r.a.createElement("div",{className:d.a.descMobile},"Ingenious JavaScript Carousel powered by wonderful plugins with native-like experience for the web."),r.a.createElement("div",{className:d.a.btnGroup},r.a.createElement(o.a,{to:Object(p.a)("docs"),className:Object(l.a)(d.a.button,d.a.btnStart)},"GET STARTED"),r.a.createElement(o.a,{to:"https://github.com/joe223/tiny-swiper",className:Object(l.a)(d.a.button,d.a.btnGithub)},"GITHUB")),r.a.createElement("div",{className:d.a.demo},r.a.createElement("p",null,"It's easy to initialize TinySwiper:"),r.a.createElement(i.a,{className:"js"},"import Swiper, {\n    SwiperPluginLazyload,\n    SwiperPluginPagination\n} from 'tiny-swiper'\n\nSwiper.use([ SwiperPluginLazyload, SwiperPluginPagination ])\n\nconst swiper = new Swiper(swiperContainer: HTMLElement | string, parameters?: TinySwiperParameters)"),r.a.createElement("p",null,"And the basic HTML code:"),r.a.createElement(i.a,{className:"html"},'\x3c!-- Slider main container --\x3e\n<div class="swiper-container">\n    \x3c!-- Additional required wrapper --\x3e\n    <div class="swiper-wrapper">\n        \x3c!-- Slides --\x3e\n        <div class="swiper-slide">Slide 1</div>\n        <div class="swiper-slide">Slide 2</div>\n        <div class="swiper-slide">Slide 3</div>\n        ...\n    </div>\n    \x3c!-- If we need pagination --\x3e\n    <div class="swiper-pagination"></div>\n</div>'))))}},96:function(e,t,a){"use strict";var n=a(2),r=a(0),l=a.n(r),s=a(84),o=a(85),i=a(83),c=a(103),p=a(97),u=a(87),d=a(104),m=a(90),g=a(91),y=a(92),b=a(48),h=a.n(b),v=a(98),f="right";t.a=function(){var e,t,a=Object(i.a)(),b=a.siteConfig.themeConfig,k=b.navbar,j=(k=void 0===k?{}:k).title,w=void 0===j?"":j,E=k.items,O=void 0===E?[]:E,N=k.hideOnScroll,_=void 0!==N&&N,S=k.style,x=void 0===S?void 0:S,T=b.colorMode,C=(T=void 0===T?{}:T).disableSwitch,P=void 0!==C&&C,L=a.isClient,B=Object(r.useState)(!1),D=B[0],I=B[1],M=Object(r.useState)(!1),A=M[0],$=M[1],G=Object(u.a)(),R=G.isDarkTheme,J=G.setLightTheme,z=G.setDarkTheme,H=Object(d.a)(_),F=H.navbarRef,U=H.isNavbarVisible,W=Object(y.a)(),V=W.logoLink,q=W.logoLinkProps,Q=W.logoImageUrl,K=W.logoAlt;Object(m.a)(D);var X=Object(r.useCallback)((function(){I(!0)}),[I]),Z=Object(r.useCallback)((function(){I(!1)}),[I]),Y=Object(r.useCallback)((function(e){return e.target.checked?z():J()}),[J,z]),ee=Object(g.a)();Object(r.useEffect)((function(){ee===g.b.desktop&&I(!1)}),[ee]);var te=function(e){return{leftItems:e.filter((function(e){var t;return"left"===(null!==(t=e.position)&&void 0!==t?t:f)})),rightItems:e.filter((function(e){var t;return"right"===(null!==(t=e.position)&&void 0!==t?t:f)}))}}(O),ae=te.leftItems,ne=te.rightItems;return l.a.createElement("nav",{ref:F,className:Object(s.a)("navbar","navbar--fixed-top",(e={"navbar--dark":"dark"===x,"navbar--primary":"primary"===x,"navbar-sidebar--show":D},e[h.a.navbarHideable]=_,e[h.a.navbarHidden]=!U,e))},l.a.createElement("div",{className:"navbar__inner"},l.a.createElement("div",{className:"navbar__items"},null!=O&&0!==O.length&&l.a.createElement("div",{"aria-label":"Navigation bar toggle",className:"navbar__toggle",role:"button",tabIndex:0,onClick:X,onKeyDown:X},l.a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"30",height:"30",viewBox:"0 0 30 30",role:"img",focusable:"false"},l.a.createElement("title",null,"Menu"),l.a.createElement("path",{stroke:"currentColor",strokeLinecap:"round",strokeMiterlimit:"10",strokeWidth:"2",d:"M4 7h22M4 15h22M4 23h22"}))),l.a.createElement(o.a,Object(n.a)({className:"navbar__brand",to:V},q),null!=Q&&l.a.createElement("img",{key:L,className:"navbar__logo",src:Q,alt:K}),null!=w&&l.a.createElement("strong",{className:Object(s.a)("navbar__title",(t={},t[h.a.hideLogoText]=A,t))},w)),ae.map((function(e,t){return l.a.createElement(v.a,Object(n.a)({},e,{key:t}))}))),l.a.createElement("div",{className:"navbar__items navbar__items--right"},ne.map((function(e,t){return l.a.createElement(v.a,Object(n.a)({},e,{key:t}))})),!P&&l.a.createElement(p.a,{className:h.a.displayOnlyInLargeViewport,"aria-label":"Dark mode toggle",checked:R,onChange:Y}),l.a.createElement(c.a,{handleSearchBarToggle:$,isSearchBarExpanded:A}))),l.a.createElement("div",{role:"presentation",className:"navbar-sidebar__backdrop",onClick:Z}),l.a.createElement("div",{className:"navbar-sidebar"},l.a.createElement("div",{className:"navbar-sidebar__brand"},l.a.createElement(o.a,Object(n.a)({className:"navbar__brand",onClick:Z,to:V},q),null!=Q&&l.a.createElement("img",{key:L,className:"navbar__logo",src:Q,alt:K}),null!=w&&l.a.createElement("strong",{className:"navbar__title"},w)),!P&&D&&l.a.createElement(p.a,{"aria-label":"Dark mode toggle in sidebar",checked:R,onChange:Y})),l.a.createElement("div",{className:"navbar-sidebar__items"},l.a.createElement("div",{className:"menu"},l.a.createElement("ul",{className:"menu__list"},O.map((function(e,t){return l.a.createElement(v.a,Object(n.a)({mobile:!0},e,{onClick:Z,key:t}))})))))))}},99:function(e,t,a){"use strict";const n=(e,{target:t=document.body}={})=>{const a=document.createElement("textarea"),n=document.activeElement;a.value=e,a.setAttribute("readonly",""),a.style.contain="strict",a.style.position="absolute",a.style.left="-9999px",a.style.fontSize="12pt";const r=document.getSelection();let l=!1;r.rangeCount>0&&(l=r.getRangeAt(0)),t.append(a),a.select(),a.selectionStart=0,a.selectionEnd=e.length;let s=!1;try{s=document.execCommand("copy")}catch(o){}return a.remove(),l&&(r.removeAllRanges(),r.addRange(l)),n&&n.focus(),s};e.exports=n,e.exports.default=n}}]);