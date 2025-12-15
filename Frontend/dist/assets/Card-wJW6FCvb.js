import{g as C,j as a}from"./animations-CCQynVHD.js";var y={exports:{}},x,w;function N(){if(w)return x;w=1;var n="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";return x=n,x}var f,k;function R(){if(k)return f;k=1;var n=N();function t(){}function l(){}return l.resetWarningCache=t,f=function(){function r(d,g,b,p,m,u){if(u!==n){var i=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw i.name="Invariant Violation",i}}r.isRequired=r;function o(){return r}var s={array:r,bigint:r,bool:r,func:r,number:r,object:r,string:r,symbol:r,any:r,arrayOf:o,element:r,elementType:r,instanceOf:o,node:r,objectOf:o,oneOf:o,oneOfType:o,shape:o,exact:o,checkPropTypes:l,resetWarningCache:t};return s.PropTypes=s,s},f}var T;function O(){return T||(T=1,y.exports=R()()),y.exports}var $=O();const e=C($),P=({variant:n="primary",size:t="md",children:l,className:r="",disabled:o=!1,loading:s=!1,icon:d,iconPosition:g="left",fullWidth:b=!1,type:p="button",...m})=>{const u=`
    inline-flex items-center justify-center font-medium rounded-lg
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `,i={primary:`
      bg-blue-600 text-white hover:bg-blue-700 
      focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600
    `,secondary:`
      bg-gray-200 text-gray-900 hover:bg-gray-300 
      focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600
    `,success:`
      bg-green-600 text-white hover:bg-green-700 
      focus:ring-green-500 dark:bg-green-500 dark:hover:bg-green-600
    `,danger:`
      bg-red-600 text-white hover:bg-red-700 
      focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600
    `,warning:`
      bg-yellow-500 text-white hover:bg-yellow-600 
      focus:ring-yellow-500 dark:bg-yellow-400 dark:hover:bg-yellow-500
    `,ghost:`
      bg-transparent text-gray-700 hover:bg-gray-100 
      focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-800
    `,outline:`
      border-2 border-blue-600 text-blue-600 bg-transparent
      hover:bg-blue-50 focus:ring-blue-500
      dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20
    `,premium:`
      bg-gradient-to-r from-blue-600 to-indigo-600 text-white 
      hover:from-blue-500 hover:to-indigo-500 hover:shadow-lg hover:shadow-blue-500/25
      active:scale-[0.98] focus:ring-blue-500
    `,gradient:`
      bg-gradient-to-r from-emerald-500 to-teal-600 text-white 
      hover:from-emerald-400 hover:to-teal-500 hover:shadow-lg hover:shadow-emerald-500/25
      active:scale-[0.98] focus:ring-emerald-500
    `},c={xs:"px-2 py-1 text-xs",sm:"px-3 py-1.5 text-sm",md:"px-4 py-2 text-sm",lg:"px-5 py-2.5 text-base",xl:"px-6 py-3 text-lg"},h={xs:"h-3 w-3",sm:"h-4 w-4",md:"h-4 w-4",lg:"h-5 w-5",xl:"h-6 w-6"},v=`
    ${u}
    ${i[n]||i.primary}
    ${c[t]||c.md}
    ${b?"w-full":""}
    ${r}
  `.replace(/\s+/g," ").trim();return a.jsx("button",{type:p,className:v,disabled:o||s,...m,children:s?a.jsxs(a.Fragment,{children:[a.jsxs("svg",{className:`animate-spin ${h[t]} ${g==="left"?"mr-2":"ml-2"}`,xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[a.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),a.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),l]}):a.jsxs(a.Fragment,{children:[d&&g==="left"&&a.jsx(d,{className:`${h[t]} mr-2`}),l,d&&g==="right"&&a.jsx(d,{className:`${h[t]} ml-2`})]})})};P.propTypes={variant:e.oneOf(["primary","secondary","success","danger","warning","ghost","outline"]),size:e.oneOf(["xs","sm","md","lg","xl"]),children:e.node.isRequired,className:e.string,disabled:e.bool,loading:e.bool,icon:e.elementType,iconPosition:e.oneOf(["left","right"]),fullWidth:e.bool,type:e.oneOf(["button","submit","reset"])};const S=({title:n,subtitle:t,children:l,className:r="",variant:o="default",padding:s="md",shadow:d="md",rounded:g="lg",hoverable:b=!1,header:p,footer:m,...u})=>{const i={none:"",sm:"shadow-sm",md:"shadow-md",lg:"shadow-lg",xl:"shadow-xl"},c={none:"",sm:"p-3",md:"p-4",lg:"p-6",xl:"p-8"},h={none:"",sm:"rounded-sm",md:"rounded-md",lg:"rounded-lg",xl:"rounded-xl",full:"rounded-2xl"},j=`
    ${{default:"bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",elevated:"bg-white dark:bg-gray-800",outlined:"bg-transparent border-2 border-gray-300 dark:border-gray-600",filled:"bg-gray-100 dark:bg-gray-700",gradient:"bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900",glass:"glass rounded-2xl",premium:"card-premium"}[o]}
    ${i[d]}
    ${h[g]}
    ${b?"transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5":""}
    ${r}
  `.replace(/\s+/g," ").trim();return a.jsxs("div",{className:j,...u,children:[(n||t||p)&&a.jsx("div",{className:`${c[s]} border-b border-gray-200 dark:border-gray-700`,children:p||a.jsxs(a.Fragment,{children:[n&&a.jsx("h3",{className:"text-lg font-semibold text-gray-900 dark:text-white",children:n}),t&&a.jsx("p",{className:"mt-1 text-sm text-gray-500 dark:text-gray-400",children:t})]})}),a.jsx("div",{className:c[s],children:l}),m&&a.jsx("div",{className:`${c[s]} border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50`,children:m})]})};S.propTypes={title:e.string,subtitle:e.string,children:e.node.isRequired,className:e.string,variant:e.oneOf(["default","elevated","outlined","filled","gradient"]),padding:e.oneOf(["none","sm","md","lg","xl"]),shadow:e.oneOf(["none","sm","md","lg","xl"]),rounded:e.oneOf(["none","sm","md","lg","xl","full"]),hoverable:e.bool,header:e.node,footer:e.node};export{P as B,S as C,e as P};
//# sourceMappingURL=Card-wJW6FCvb.js.map
