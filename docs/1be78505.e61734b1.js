(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{97:function(e,a,t){"use strict";var r=t(2),l=t(0),n=t.n(l),c=t(85),s=t(86),i=t(84),o=t(104),m=t(98),b=t(88),d=t(105),v=t(91),g=t(92),h=t(93),k=t(48),u=t.n(k),_=t(99);const E="right";a.a=function(){const{siteConfig:{themeConfig:{navbar:{title:e="",items:a=[],hideOnScroll:t=!1,style:k}={},colorMode:{disableSwitch:p=!1}={}}},isClient:O}=Object(i.a)(),[N,j]=Object(l.useState)(!1),[f,w]=Object(l.useState)(!1),{isDarkTheme:C,setLightTheme:y,setDarkTheme:I}=Object(b.a)(),{navbarRef:x,isNavbarVisible:L}=Object(d.a)(t),{logoLink:M,logoLinkProps:S,logoImageUrl:D,logoAlt:T}=Object(h.a)();Object(v.a)(N);const B=Object(l.useCallback)((()=>{j(!0)}),[j]),H=Object(l.useCallback)((()=>{j(!1)}),[j]),J=Object(l.useCallback)((e=>e.target.checked?I():y()),[y,I]),V=Object(g.a)();Object(l.useEffect)((()=>{V===g.b.desktop&&j(!1)}),[V]);const{leftItems:A,rightItems:K}=function(e){return{leftItems:e.filter((e=>{var a;return"left"===(null!==(a=e.position)&&void 0!==a?a:E)})),rightItems:e.filter((e=>{var a;return"right"===(null!==(a=e.position)&&void 0!==a?a:E)}))}}(a);return n.a.createElement("nav",{ref:x,className:Object(c.a)("navbar","navbar--fixed-top",{"navbar--dark":"dark"===k,"navbar--primary":"primary"===k,"navbar-sidebar--show":N,[u.a.navbarHideable]:t,[u.a.navbarHidden]:!L})},n.a.createElement("div",{className:"navbar__inner"},n.a.createElement("div",{className:"navbar__items"},null!=a&&0!==a.length&&n.a.createElement("div",{"aria-label":"Navigation bar toggle",className:"navbar__toggle",role:"button",tabIndex:0,onClick:B,onKeyDown:B},n.a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"30",height:"30",viewBox:"0 0 30 30",role:"img",focusable:"false"},n.a.createElement("title",null,"Menu"),n.a.createElement("path",{stroke:"currentColor",strokeLinecap:"round",strokeMiterlimit:"10",strokeWidth:"2",d:"M4 7h22M4 15h22M4 23h22"}))),n.a.createElement(s.a,Object(r.a)({className:"navbar__brand",to:M},S),null!=D&&n.a.createElement("img",{key:O,className:"navbar__logo",src:D,alt:T}),null!=e&&n.a.createElement("strong",{className:Object(c.a)("navbar__title",{[u.a.hideLogoText]:f})},e)),A.map(((e,a)=>n.a.createElement(_.a,Object(r.a)({},e,{key:a}))))),n.a.createElement("div",{className:"navbar__items navbar__items--right"},K.map(((e,a)=>n.a.createElement(_.a,Object(r.a)({},e,{key:a})))),!p&&n.a.createElement(m.a,{className:u.a.displayOnlyInLargeViewport,"aria-label":"Dark mode toggle",checked:C,onChange:J}),n.a.createElement(o.a,{handleSearchBarToggle:w,isSearchBarExpanded:f}))),n.a.createElement("div",{role:"presentation",className:"navbar-sidebar__backdrop",onClick:H}),n.a.createElement("div",{className:"navbar-sidebar"},n.a.createElement("div",{className:"navbar-sidebar__brand"},n.a.createElement(s.a,Object(r.a)({className:"navbar__brand",onClick:H,to:M},S),null!=D&&n.a.createElement("img",{key:O,className:"navbar__logo",src:D,alt:T}),null!=e&&n.a.createElement("strong",{className:"navbar__title"},e)),!p&&N&&n.a.createElement(m.a,{"aria-label":"Dark mode toggle in sidebar",checked:C,onChange:J})),n.a.createElement("div",{className:"navbar-sidebar__items"},n.a.createElement("div",{className:"menu"},n.a.createElement("ul",{className:"menu__list"},a.map(((e,a)=>n.a.createElement(_.a,Object(r.a)({mobile:!0},e,{onClick:H,key:a})))))))))}}}]);