(self.webpackChunkplugin_tester=self.webpackChunkplugin_tester||[]).push([[982],{982:(F,p,x)=>{x.r(p),x.d(p,{ObjectUtils:()=>f,UniqueComponentId:()=>I,ZIndexUtils:()=>E});class f{static equals(e,t,n){return n?this.resolveFieldData(e,n)===this.resolveFieldData(t,n):this.equalsByValue(e,t)}static equalsByValue(e,t){if(e===t)return!0;if(e&&t&&"object"==typeof e&&"object"==typeof t){var r,i,l,n=Array.isArray(e),s=Array.isArray(t);if(n&&s){if((i=e.length)!=t.length)return!1;for(r=i;0!=r--;)if(!this.equalsByValue(e[r],t[r]))return!1;return!0}if(n!=s)return!1;var a=e instanceof Date,d=t instanceof Date;if(a!=d)return!1;if(a&&d)return e.getTime()==t.getTime();var y=e instanceof RegExp,h=t instanceof RegExp;if(y!=h)return!1;if(y&&h)return e.toString()==t.toString();var u=Object.keys(e);if((i=u.length)!==Object.keys(t).length)return!1;for(r=i;0!=r--;)if(!Object.prototype.hasOwnProperty.call(t,u[r]))return!1;for(r=i;0!=r--;)if(!this.equalsByValue(e[l=u[r]],t[l]))return!1;return!0}return e!=e&&t!=t}static resolveFieldData(e,t){if(e&&t){if(this.isFunction(t))return t(e);if(-1==t.indexOf("."))return e[t];{let n=t.split("."),s=e;for(let r=0,i=n.length;r<i;++r){if(null==s)return null;s=s[n[r]]}return s}}return null}static isFunction(e){return!!(e&&e.constructor&&e.call&&e.apply)}static reorderArray(e,t,n){e&&t!==n&&(n>=e.length&&(n%=e.length,t%=e.length),e.splice(n,0,e.splice(t,1)[0]))}static insertIntoOrderedArray(e,t,n,s){if(n.length>0){let r=!1;for(let i=0;i<n.length;i++)if(this.findIndexInList(n[i],s)>t){n.splice(i,0,e),r=!0;break}r||n.push(e)}else n.push(e)}static findIndexInList(e,t){let n=-1;if(t)for(let s=0;s<t.length;s++)if(t[s]==e){n=s;break}return n}static contains(e,t){if(null!=e&&t&&t.length)for(let n of t)if(this.equals(e,n))return!0;return!1}static removeAccents(e){return e&&e.search(/[\xC0-\xFF]/g)>-1&&(e=e.replace(/[\xC0-\xC5]/g,"A").replace(/[\xC6]/g,"AE").replace(/[\xC7]/g,"C").replace(/[\xC8-\xCB]/g,"E").replace(/[\xCC-\xCF]/g,"I").replace(/[\xD0]/g,"D").replace(/[\xD1]/g,"N").replace(/[\xD2-\xD6\xD8]/g,"O").replace(/[\xD9-\xDC]/g,"U").replace(/[\xDD]/g,"Y").replace(/[\xDE]/g,"P").replace(/[\xE0-\xE5]/g,"a").replace(/[\xE6]/g,"ae").replace(/[\xE7]/g,"c").replace(/[\xE8-\xEB]/g,"e").replace(/[\xEC-\xEF]/g,"i").replace(/[\xF1]/g,"n").replace(/[\xF2-\xF6\xF8]/g,"o").replace(/[\xF9-\xFC]/g,"u").replace(/[\xFE]/g,"p").replace(/[\xFD\xFF]/g,"y")),e}static isEmpty(e){return null==e||""===e||Array.isArray(e)&&0===e.length||!(e instanceof Date)&&"object"==typeof e&&0===Object.keys(e).length}static isNotEmpty(e){return!this.isEmpty(e)}static compare(e,t,n,s=1){let r=-1;const i=this.isEmpty(e),l=this.isEmpty(t);return r=i&&l?0:i?s:l?-s:"string"==typeof e&&"string"==typeof t?e.localeCompare(t,n,{numeric:!0}):e<t?-1:e>t?1:0,r}static sort(e,t,n=1,s,r=1){return(1===r?n:r)*f.compare(e,t,s,n)}static merge(e,t){if(null!=e||null!=t)return null!=e&&"object"!=typeof e||null!=t&&"object"!=typeof t?null!=e&&"string"!=typeof e||null!=t&&"string"!=typeof t?t||e:[e||"",t||""].join(" "):{...e||{},...t||{}}}}var g=0;function I(){return"pr_id_"+ ++g}var E=function C(){let c=[];const s=r=>r&&parseInt(r.style.zIndex,10)||0;return{get:s,set:(r,i,l)=>{i&&(i.style.zIndex=String(((r,i)=>{let l=c.length>0?c[c.length-1]:{key:r,value:i},a=l.value+(l.key===r?0:i)+1;return c.push({key:r,value:a}),a})(r,l)))},clear:r=>{r&&((r=>{c=c.filter(i=>i.value!==r)})(s(r)),r.style.zIndex="")},getCurrent:()=>c.length>0?c[c.length-1].value:0}}()}}]);