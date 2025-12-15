import{r as v,j as r}from"./animations-CCQynVHD.js";import{P as e}from"./Card-wJW6FCvb.js";const p=v.forwardRef(({label:o,error:s,helperText:t,type:i="text",size:a="md",variant:m="default",className:d="",containerClassName:h="",icon:l,iconPosition:c="left",required:g=!1,disabled:x=!1,fullWidth:u=!0,...n},y)=>{const b={sm:"px-3 py-1.5 text-sm",md:"px-4 py-2 text-sm",lg:"px-4 py-3 text-base"},w={sm:{left:"pl-9",right:"pr-9"},md:{left:"pl-10",right:"pr-10"},lg:{left:"pl-11",right:"pr-11"}},f={sm:"h-4 w-4",md:"h-5 w-5",lg:"h-5 w-5"},k=()=>s?`
        border-red-500 text-red-900 placeholder-red-300
        focus:ring-red-500 focus:border-red-500
        dark:border-red-500 dark:text-red-400
      `:x?`
        bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed
        dark:bg-gray-800 dark:border-gray-700 dark:text-gray-500
      `:`
      border-gray-300 text-gray-900 placeholder-gray-400
      focus:ring-blue-500 focus:border-blue-500
      dark:bg-gray-700 dark:border-gray-600 dark:text-white
      dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500
    `,N=`
    block rounded-lg border
    transition-colors duration-200
    focus:outline-none focus:ring-2
    ${b[a]}
    ${l?w[a][c]:""}
    ${u?"w-full":""}
    ${k()}
    ${d}
  `.replace(/\s+/g," ").trim();return r.jsxs("div",{className:`${u?"w-full":""} ${h}`,children:[o&&r.jsxs("label",{className:"block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300",children:[o,g&&r.jsx("span",{className:"ml-1 text-red-500",children:"*"})]}),r.jsxs("div",{className:"relative",children:[l&&c==="left"&&r.jsx("div",{className:"absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none",children:r.jsx(l,{className:`${f[a]} text-gray-400`})}),r.jsx("input",{ref:y,type:i,className:N,disabled:x,required:g,"aria-invalid":s?"true":"false","aria-describedby":s?`${n.id}-error`:t?`${n.id}-helper`:void 0,...n}),l&&c==="right"&&r.jsx("div",{className:"absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none",children:r.jsx(l,{className:`${f[a]} text-gray-400`})})]}),s&&r.jsx("p",{id:`${n.id}-error`,className:"mt-1.5 text-sm text-red-600 dark:text-red-400",children:s}),t&&!s&&r.jsx("p",{id:`${n.id}-helper`,className:"mt-1.5 text-sm text-gray-500 dark:text-gray-400",children:t})]})});p.displayName="Input";p.propTypes={label:e.string,error:e.string,helperText:e.string,type:e.string,size:e.oneOf(["sm","md","lg"]),variant:e.oneOf(["default","filled"]),className:e.string,containerClassName:e.string,icon:e.elementType,iconPosition:e.oneOf(["left","right"]),required:e.bool,disabled:e.bool,fullWidth:e.bool};e.bool.isRequired,e.func.isRequired,e.string,e.node.isRequired,e.oneOf(["sm","md","lg","xl","2xl","3xl","4xl","full"]),e.bool,e.bool,e.bool,e.node,e.string;e.node.isRequired,e.oneOf(["default","primary","success","warning","danger","info"]),e.oneOf(["sm","md","lg"]),e.oneOf(["none","sm","md","lg","full"]),e.bool,e.bool,e.func,e.string;const j=({size:o="md",color:s="primary",label:t="Loading...",showLabel:i=!1,className:a=""})=>{const m={xs:"h-3 w-3",sm:"h-4 w-4",md:"h-6 w-6",lg:"h-8 w-8",xl:"h-12 w-12"},d={primary:"text-blue-600 dark:text-blue-400",secondary:"text-gray-600 dark:text-gray-400",success:"text-green-600 dark:text-green-400",danger:"text-red-600 dark:text-red-400",warning:"text-yellow-600 dark:text-yellow-400",white:"text-white"};return r.jsxs("div",{className:`inline-flex items-center ${a}`,role:"status",children:[r.jsxs("svg",{className:`animate-spin ${m[o]} ${d[s]}`,xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","aria-hidden":"true",children:[r.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),r.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),i&&r.jsx("span",{className:"ml-2 text-sm text-gray-600 dark:text-gray-400",children:t}),r.jsx("span",{className:"sr-only",children:t})]})};e.string,e.bool;j.propTypes={size:e.oneOf(["xs","sm","md","lg","xl"]),color:e.oneOf(["primary","secondary","success","danger","warning","white"]),label:e.string,showLabel:e.bool,className:e.string};e.string,e.oneOf(["default","circle","card"]);e.bool;e.number;e.number,e.number;e.number;export{p as I,j as S};
//# sourceMappingURL=Skeleton-Dr9iDnWc.js.map
