import{r as ps,a as ms,R as sr,b as N}from"./vendor-apcLg7-w.js";var Cn={exports:{}},wt={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Or;function gs(){if(Or)return wt;Or=1;var n=ps(),e=Symbol.for("react.element"),t=Symbol.for("react.fragment"),r=Object.prototype.hasOwnProperty,o=n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,i={key:!0,ref:!0,__self:!0,__source:!0};function s(l,a,c){var d,u={},h=null,f=null;c!==void 0&&(h=""+c),a.key!==void 0&&(h=""+a.key),a.ref!==void 0&&(f=a.ref);for(d in a)r.call(a,d)&&!i.hasOwnProperty(d)&&(u[d]=a[d]);if(l&&l.defaultProps)for(d in a=l.defaultProps,a)u[d]===void 0&&(u[d]=a[d]);return{$$typeof:e,type:l,key:h,ref:f,props:u,_owner:o.current}}return wt.Fragment=t,wt.jsx=s,wt.jsxs=s,wt}var Tr;function bs(){return Tr||(Tr=1,Cn.exports=gs()),Cn.exports}var m=bs(),Yt={},Dr;function ks(){if(Dr)return Yt;Dr=1;var n=ms();return Yt.createRoot=n.createRoot,Yt.hydrateRoot=n.hydrateRoot,Yt}var ys=ks();function U(n){this.content=n}U.prototype={constructor:U,find:function(n){for(var e=0;e<this.content.length;e+=2)if(this.content[e]===n)return e;return-1},get:function(n){var e=this.find(n);return e==-1?void 0:this.content[e+1]},update:function(n,e,t){var r=t&&t!=n?this.remove(t):this,o=r.find(n),i=r.content.slice();return o==-1?i.push(t||n,e):(i[o+1]=e,t&&(i[o]=t)),new U(i)},remove:function(n){var e=this.find(n);if(e==-1)return this;var t=this.content.slice();return t.splice(e,2),new U(t)},addToStart:function(n,e){return new U([n,e].concat(this.remove(n).content))},addToEnd:function(n,e){var t=this.remove(n).content.slice();return t.push(n,e),new U(t)},addBefore:function(n,e,t){var r=this.remove(e),o=r.content.slice(),i=r.find(n);return o.splice(i==-1?o.length:i,0,e,t),new U(o)},forEach:function(n){for(var e=0;e<this.content.length;e+=2)n(this.content[e],this.content[e+1])},prepend:function(n){return n=U.from(n),n.size?new U(n.content.concat(this.subtract(n).content)):this},append:function(n){return n=U.from(n),n.size?new U(this.subtract(n).content.concat(n.content)):this},subtract:function(n){var e=this;n=U.from(n);for(var t=0;t<n.content.length;t+=2)e=e.remove(n.content[t]);return e},toObject:function(){var n={};return this.forEach(function(e,t){n[e]=t}),n},get size(){return this.content.length>>1}};U.from=function(n){if(n instanceof U)return n;var e=[];if(n)for(var t in n)e.push(t,n[t]);return new U(e)};function Vo(n,e,t){for(let r=0;;r++){if(r==n.childCount||r==e.childCount)return n.childCount==e.childCount?null:t;let o=n.child(r),i=e.child(r);if(o==i){t+=o.nodeSize;continue}if(!o.sameMarkup(i))return t;if(o.isText&&o.text!=i.text){for(let s=0;o.text[s]==i.text[s];s++)t++;return t}if(o.content.size||i.content.size){let s=Vo(o.content,i.content,t+1);if(s!=null)return s}t+=o.nodeSize}}function Fo(n,e,t,r){for(let o=n.childCount,i=e.childCount;;){if(o==0||i==0)return o==i?null:{a:t,b:r};let s=n.child(--o),l=e.child(--i),a=s.nodeSize;if(s==l){t-=a,r-=a;continue}if(!s.sameMarkup(l))return{a:t,b:r};if(s.isText&&s.text!=l.text){let c=0,d=Math.min(s.text.length,l.text.length);for(;c<d&&s.text[s.text.length-c-1]==l.text[l.text.length-c-1];)c++,t--,r--;return{a:t,b:r}}if(s.content.size||l.content.size){let c=Fo(s.content,l.content,t-1,r-1);if(c)return c}t-=a,r-=a}}class v{constructor(e,t){if(this.content=e,this.size=t||0,t==null)for(let r=0;r<e.length;r++)this.size+=e[r].nodeSize}nodesBetween(e,t,r,o=0,i){for(let s=0,l=0;l<t;s++){let a=this.content[s],c=l+a.nodeSize;if(c>e&&r(a,o+l,i||null,s)!==!1&&a.content.size){let d=l+1;a.nodesBetween(Math.max(0,e-d),Math.min(a.content.size,t-d),r,o+d)}l=c}}descendants(e){this.nodesBetween(0,this.size,e)}textBetween(e,t,r,o){let i="",s=!0;return this.nodesBetween(e,t,(l,a)=>{let c=l.isText?l.text.slice(Math.max(e,a)-a,t-a):l.isLeaf?o?typeof o=="function"?o(l):o:l.type.spec.leafText?l.type.spec.leafText(l):"":"";l.isBlock&&(l.isLeaf&&c||l.isTextblock)&&r&&(s?s=!1:i+=r),i+=c},0),i}append(e){if(!e.size)return this;if(!this.size)return e;let t=this.lastChild,r=e.firstChild,o=this.content.slice(),i=0;for(t.isText&&t.sameMarkup(r)&&(o[o.length-1]=t.withText(t.text+r.text),i=1);i<e.content.length;i++)o.push(e.content[i]);return new v(o,this.size+e.size)}cut(e,t=this.size){if(e==0&&t==this.size)return this;let r=[],o=0;if(t>e)for(let i=0,s=0;s<t;i++){let l=this.content[i],a=s+l.nodeSize;a>e&&((s<e||a>t)&&(l.isText?l=l.cut(Math.max(0,e-s),Math.min(l.text.length,t-s)):l=l.cut(Math.max(0,e-s-1),Math.min(l.content.size,t-s-1))),r.push(l),o+=l.nodeSize),s=a}return new v(r,o)}cutByIndex(e,t){return e==t?v.empty:e==0&&t==this.content.length?this:new v(this.content.slice(e,t))}replaceChild(e,t){let r=this.content[e];if(r==t)return this;let o=this.content.slice(),i=this.size+t.nodeSize-r.nodeSize;return o[e]=t,new v(o,i)}addToStart(e){return new v([e].concat(this.content),this.size+e.nodeSize)}addToEnd(e){return new v(this.content.concat(e),this.size+e.nodeSize)}eq(e){if(this.content.length!=e.content.length)return!1;for(let t=0;t<this.content.length;t++)if(!this.content[t].eq(e.content[t]))return!1;return!0}get firstChild(){return this.content.length?this.content[0]:null}get lastChild(){return this.content.length?this.content[this.content.length-1]:null}get childCount(){return this.content.length}child(e){let t=this.content[e];if(!t)throw new RangeError("Index "+e+" out of range for "+this);return t}maybeChild(e){return this.content[e]||null}forEach(e){for(let t=0,r=0;t<this.content.length;t++){let o=this.content[t];e(o,r,t),r+=o.nodeSize}}findDiffStart(e,t=0){return Vo(this,e,t)}findDiffEnd(e,t=this.size,r=e.size){return Fo(this,e,t,r)}findIndex(e){if(e==0)return Gt(0,e);if(e==this.size)return Gt(this.content.length,e);if(e>this.size||e<0)throw new RangeError(`Position ${e} outside of fragment (${this})`);for(let t=0,r=0;;t++){let o=this.child(t),i=r+o.nodeSize;if(i>=e)return i==e?Gt(t+1,i):Gt(t,r);r=i}}toString(){return"<"+this.toStringInner()+">"}toStringInner(){return this.content.join(", ")}toJSON(){return this.content.length?this.content.map(e=>e.toJSON()):null}static fromJSON(e,t){if(!t)return v.empty;if(!Array.isArray(t))throw new RangeError("Invalid input for Fragment.fromJSON");return new v(t.map(e.nodeFromJSON))}static fromArray(e){if(!e.length)return v.empty;let t,r=0;for(let o=0;o<e.length;o++){let i=e[o];r+=i.nodeSize,o&&i.isText&&e[o-1].sameMarkup(i)?(t||(t=e.slice(0,o)),t[t.length-1]=i.withText(t[t.length-1].text+i.text)):t&&t.push(i)}return new v(t||e,r)}static from(e){if(!e)return v.empty;if(e instanceof v)return e;if(Array.isArray(e))return this.fromArray(e);if(e.attrs)return new v([e],e.nodeSize);throw new RangeError("Can not convert "+e+" to a Fragment"+(e.nodesBetween?" (looks like multiple versions of prosemirror-model were loaded)":""))}}v.empty=new v([],0);const Mn={index:0,offset:0};function Gt(n,e){return Mn.index=n,Mn.offset=e,Mn}function on(n,e){if(n===e)return!0;if(!(n&&typeof n=="object")||!(e&&typeof e=="object"))return!1;let t=Array.isArray(n);if(Array.isArray(e)!=t)return!1;if(t){if(n.length!=e.length)return!1;for(let r=0;r<n.length;r++)if(!on(n[r],e[r]))return!1}else{for(let r in n)if(!(r in e)||!on(n[r],e[r]))return!1;for(let r in e)if(!(r in n))return!1}return!0}class B{constructor(e,t){this.type=e,this.attrs=t}addToSet(e){let t,r=!1;for(let o=0;o<e.length;o++){let i=e[o];if(this.eq(i))return e;if(this.type.excludes(i.type))t||(t=e.slice(0,o));else{if(i.type.excludes(this.type))return e;!r&&i.type.rank>this.type.rank&&(t||(t=e.slice(0,o)),t.push(this),r=!0),t&&t.push(i)}}return t||(t=e.slice()),r||t.push(this),t}removeFromSet(e){for(let t=0;t<e.length;t++)if(this.eq(e[t]))return e.slice(0,t).concat(e.slice(t+1));return e}isInSet(e){for(let t=0;t<e.length;t++)if(this.eq(e[t]))return!0;return!1}eq(e){return this==e||this.type==e.type&&on(this.attrs,e.attrs)}toJSON(){let e={type:this.type.name};for(let t in this.attrs){e.attrs=this.attrs;break}return e}static fromJSON(e,t){if(!t)throw new RangeError("Invalid input for Mark.fromJSON");let r=e.marks[t.type];if(!r)throw new RangeError(`There is no mark type ${t.type} in this schema`);let o=r.create(t.attrs);return r.checkAttrs(o.attrs),o}static sameSet(e,t){if(e==t)return!0;if(e.length!=t.length)return!1;for(let r=0;r<e.length;r++)if(!e[r].eq(t[r]))return!1;return!0}static setFrom(e){if(!e||Array.isArray(e)&&e.length==0)return B.none;if(e instanceof B)return[e];let t=e.slice();return t.sort((r,o)=>r.type.rank-o.type.rank),t}}B.none=[];class sn extends Error{}class M{constructor(e,t,r){this.content=e,this.openStart=t,this.openEnd=r}get size(){return this.content.size-this.openStart-this.openEnd}insertAt(e,t){let r=_o(this.content,e+this.openStart,t);return r&&new M(r,this.openStart,this.openEnd)}removeBetween(e,t){return new M($o(this.content,e+this.openStart,t+this.openStart),this.openStart,this.openEnd)}eq(e){return this.content.eq(e.content)&&this.openStart==e.openStart&&this.openEnd==e.openEnd}toString(){return this.content+"("+this.openStart+","+this.openEnd+")"}toJSON(){if(!this.content.size)return null;let e={content:this.content.toJSON()};return this.openStart>0&&(e.openStart=this.openStart),this.openEnd>0&&(e.openEnd=this.openEnd),e}static fromJSON(e,t){if(!t)return M.empty;let r=t.openStart||0,o=t.openEnd||0;if(typeof r!="number"||typeof o!="number")throw new RangeError("Invalid input for Slice.fromJSON");return new M(v.fromJSON(e,t.content),r,o)}static maxOpen(e,t=!0){let r=0,o=0;for(let i=e.firstChild;i&&!i.isLeaf&&(t||!i.type.spec.isolating);i=i.firstChild)r++;for(let i=e.lastChild;i&&!i.isLeaf&&(t||!i.type.spec.isolating);i=i.lastChild)o++;return new M(e,r,o)}}M.empty=new M(v.empty,0,0);function $o(n,e,t){let{index:r,offset:o}=n.findIndex(e),i=n.maybeChild(r),{index:s,offset:l}=n.findIndex(t);if(o==e||i.isText){if(l!=t&&!n.child(s).isText)throw new RangeError("Removing non-flat range");return n.cut(0,e).append(n.cut(t))}if(r!=s)throw new RangeError("Removing non-flat range");return n.replaceChild(r,i.copy($o(i.content,e-o-1,t-o-1)))}function _o(n,e,t,r){let{index:o,offset:i}=n.findIndex(e),s=n.maybeChild(o);if(i==e||s.isText)return r&&!r.canReplace(o,o,t)?null:n.cut(0,e).append(t).append(n.cut(e));let l=_o(s.content,e-i-1,t,s);return l&&n.replaceChild(o,s.copy(l))}function xs(n,e,t){if(t.openStart>n.depth)throw new sn("Inserted content deeper than insertion position");if(n.depth-t.openStart!=e.depth-t.openEnd)throw new sn("Inconsistent open depths");return Wo(n,e,t,0)}function Wo(n,e,t,r){let o=n.index(r),i=n.node(r);if(o==e.index(r)&&r<n.depth-t.openStart){let s=Wo(n,e,t,r+1);return i.copy(i.content.replaceChild(o,s))}else if(t.content.size)if(!t.openStart&&!t.openEnd&&n.depth==r&&e.depth==r){let s=n.parent,l=s.content;return Xe(s,l.cut(0,n.parentOffset).append(t.content).append(l.cut(e.parentOffset)))}else{let{start:s,end:l}=ws(t,n);return Xe(i,Ho(n,s,l,e,r))}else return Xe(i,ln(n,e,r))}function qo(n,e){if(!e.type.compatibleContent(n.type))throw new sn("Cannot join "+e.type.name+" onto "+n.type.name)}function Jn(n,e,t){let r=n.node(t);return qo(r,e.node(t)),r}function Ge(n,e){let t=e.length-1;t>=0&&n.isText&&n.sameMarkup(e[t])?e[t]=n.withText(e[t].text+n.text):e.push(n)}function Nt(n,e,t,r){let o=(e||n).node(t),i=0,s=e?e.index(t):o.childCount;n&&(i=n.index(t),n.depth>t?i++:n.textOffset&&(Ge(n.nodeAfter,r),i++));for(let l=i;l<s;l++)Ge(o.child(l),r);e&&e.depth==t&&e.textOffset&&Ge(e.nodeBefore,r)}function Xe(n,e){return n.type.checkContent(e),n.copy(e)}function Ho(n,e,t,r,o){let i=n.depth>o&&Jn(n,e,o+1),s=r.depth>o&&Jn(t,r,o+1),l=[];return Nt(null,n,o,l),i&&s&&e.index(o)==t.index(o)?(qo(i,s),Ge(Xe(i,Ho(n,e,t,r,o+1)),l)):(i&&Ge(Xe(i,ln(n,e,o+1)),l),Nt(e,t,o,l),s&&Ge(Xe(s,ln(t,r,o+1)),l)),Nt(r,null,o,l),new v(l)}function ln(n,e,t){let r=[];if(Nt(null,n,t,r),n.depth>t){let o=Jn(n,e,t+1);Ge(Xe(o,ln(n,e,t+1)),r)}return Nt(e,null,t,r),new v(r)}function ws(n,e){let t=e.depth-n.openStart,o=e.node(t).copy(n.content);for(let i=t-1;i>=0;i--)o=e.node(i).copy(v.from(o));return{start:o.resolveNoCache(n.openStart+t),end:o.resolveNoCache(o.content.size-n.openEnd-t)}}class Rt{constructor(e,t,r){this.pos=e,this.path=t,this.parentOffset=r,this.depth=t.length/3-1}resolveDepth(e){return e==null?this.depth:e<0?this.depth+e:e}get parent(){return this.node(this.depth)}get doc(){return this.node(0)}node(e){return this.path[this.resolveDepth(e)*3]}index(e){return this.path[this.resolveDepth(e)*3+1]}indexAfter(e){return e=this.resolveDepth(e),this.index(e)+(e==this.depth&&!this.textOffset?0:1)}start(e){return e=this.resolveDepth(e),e==0?0:this.path[e*3-1]+1}end(e){return e=this.resolveDepth(e),this.start(e)+this.node(e).content.size}before(e){if(e=this.resolveDepth(e),!e)throw new RangeError("There is no position before the top-level node");return e==this.depth+1?this.pos:this.path[e*3-1]}after(e){if(e=this.resolveDepth(e),!e)throw new RangeError("There is no position after the top-level node");return e==this.depth+1?this.pos:this.path[e*3-1]+this.path[e*3].nodeSize}get textOffset(){return this.pos-this.path[this.path.length-1]}get nodeAfter(){let e=this.parent,t=this.index(this.depth);if(t==e.childCount)return null;let r=this.pos-this.path[this.path.length-1],o=e.child(t);return r?e.child(t).cut(r):o}get nodeBefore(){let e=this.index(this.depth),t=this.pos-this.path[this.path.length-1];return t?this.parent.child(e).cut(0,t):e==0?null:this.parent.child(e-1)}posAtIndex(e,t){t=this.resolveDepth(t);let r=this.path[t*3],o=t==0?0:this.path[t*3-1]+1;for(let i=0;i<e;i++)o+=r.child(i).nodeSize;return o}marks(){let e=this.parent,t=this.index();if(e.content.size==0)return B.none;if(this.textOffset)return e.child(t).marks;let r=e.maybeChild(t-1),o=e.maybeChild(t);if(!r){let l=r;r=o,o=l}let i=r.marks;for(var s=0;s<i.length;s++)i[s].type.spec.inclusive===!1&&(!o||!i[s].isInSet(o.marks))&&(i=i[s--].removeFromSet(i));return i}marksAcross(e){let t=this.parent.maybeChild(this.index());if(!t||!t.isInline)return null;let r=t.marks,o=e.parent.maybeChild(e.index());for(var i=0;i<r.length;i++)r[i].type.spec.inclusive===!1&&(!o||!r[i].isInSet(o.marks))&&(r=r[i--].removeFromSet(r));return r}sharedDepth(e){for(let t=this.depth;t>0;t--)if(this.start(t)<=e&&this.end(t)>=e)return t;return 0}blockRange(e=this,t){if(e.pos<this.pos)return e.blockRange(this);for(let r=this.depth-(this.parent.inlineContent||this.pos==e.pos?1:0);r>=0;r--)if(e.pos<=this.end(r)&&(!t||t(this.node(r))))return new an(this,e,r);return null}sameParent(e){return this.pos-this.parentOffset==e.pos-e.parentOffset}max(e){return e.pos>this.pos?e:this}min(e){return e.pos<this.pos?e:this}toString(){let e="";for(let t=1;t<=this.depth;t++)e+=(e?"/":"")+this.node(t).type.name+"_"+this.index(t-1);return e+":"+this.parentOffset}static resolve(e,t){if(!(t>=0&&t<=e.content.size))throw new RangeError("Position "+t+" out of range");let r=[],o=0,i=t;for(let s=e;;){let{index:l,offset:a}=s.content.findIndex(i),c=i-a;if(r.push(s,l,o+a),!c||(s=s.child(l),s.isText))break;i=c-1,o+=a+1}return new Rt(t,r,i)}static resolveCached(e,t){let r=Ar.get(e);if(r)for(let i=0;i<r.elts.length;i++){let s=r.elts[i];if(s.pos==t)return s}else Ar.set(e,r=new vs);let o=r.elts[r.i]=Rt.resolve(e,t);return r.i=(r.i+1)%Ss,o}}class vs{constructor(){this.elts=[],this.i=0}}const Ss=12,Ar=new WeakMap;class an{constructor(e,t,r){this.$from=e,this.$to=t,this.depth=r}get start(){return this.$from.before(this.depth+1)}get end(){return this.$to.after(this.depth+1)}get parent(){return this.$from.node(this.depth)}get startIndex(){return this.$from.index(this.depth)}get endIndex(){return this.$to.indexAfter(this.depth)}}const Cs=Object.create(null);class we{constructor(e,t,r,o=B.none){this.type=e,this.attrs=t,this.marks=o,this.content=r||v.empty}get children(){return this.content.content}get nodeSize(){return this.isLeaf?1:2+this.content.size}get childCount(){return this.content.childCount}child(e){return this.content.child(e)}maybeChild(e){return this.content.maybeChild(e)}forEach(e){this.content.forEach(e)}nodesBetween(e,t,r,o=0){this.content.nodesBetween(e,t,r,o,this)}descendants(e){this.nodesBetween(0,this.content.size,e)}get textContent(){return this.isLeaf&&this.type.spec.leafText?this.type.spec.leafText(this):this.textBetween(0,this.content.size,"")}textBetween(e,t,r,o){return this.content.textBetween(e,t,r,o)}get firstChild(){return this.content.firstChild}get lastChild(){return this.content.lastChild}eq(e){return this==e||this.sameMarkup(e)&&this.content.eq(e.content)}sameMarkup(e){return this.hasMarkup(e.type,e.attrs,e.marks)}hasMarkup(e,t,r){return this.type==e&&on(this.attrs,t||e.defaultAttrs||Cs)&&B.sameSet(this.marks,r||B.none)}copy(e=null){return e==this.content?this:new we(this.type,this.attrs,e,this.marks)}mark(e){return e==this.marks?this:new we(this.type,this.attrs,this.content,e)}cut(e,t=this.content.size){return e==0&&t==this.content.size?this:this.copy(this.content.cut(e,t))}slice(e,t=this.content.size,r=!1){if(e==t)return M.empty;let o=this.resolve(e),i=this.resolve(t),s=r?0:o.sharedDepth(t),l=o.start(s),c=o.node(s).content.cut(o.pos-l,i.pos-l);return new M(c,o.depth-s,i.depth-s)}replace(e,t,r){return xs(this.resolve(e),this.resolve(t),r)}nodeAt(e){for(let t=this;;){let{index:r,offset:o}=t.content.findIndex(e);if(t=t.maybeChild(r),!t)return null;if(o==e||t.isText)return t;e-=o+1}}childAfter(e){let{index:t,offset:r}=this.content.findIndex(e);return{node:this.content.maybeChild(t),index:t,offset:r}}childBefore(e){if(e==0)return{node:null,index:0,offset:0};let{index:t,offset:r}=this.content.findIndex(e);if(r<e)return{node:this.content.child(t),index:t,offset:r};let o=this.content.child(t-1);return{node:o,index:t-1,offset:r-o.nodeSize}}resolve(e){return Rt.resolveCached(this,e)}resolveNoCache(e){return Rt.resolve(this,e)}rangeHasMark(e,t,r){let o=!1;return t>e&&this.nodesBetween(e,t,i=>(r.isInSet(i.marks)&&(o=!0),!o)),o}get isBlock(){return this.type.isBlock}get isTextblock(){return this.type.isTextblock}get inlineContent(){return this.type.inlineContent}get isInline(){return this.type.isInline}get isText(){return this.type.isText}get isLeaf(){return this.type.isLeaf}get isAtom(){return this.type.isAtom}toString(){if(this.type.spec.toDebugString)return this.type.spec.toDebugString(this);let e=this.type.name;return this.content.size&&(e+="("+this.content.toStringInner()+")"),Jo(this.marks,e)}contentMatchAt(e){let t=this.type.contentMatch.matchFragment(this.content,0,e);if(!t)throw new Error("Called contentMatchAt on a node with invalid content");return t}canReplace(e,t,r=v.empty,o=0,i=r.childCount){let s=this.contentMatchAt(e).matchFragment(r,o,i),l=s&&s.matchFragment(this.content,t);if(!l||!l.validEnd)return!1;for(let a=o;a<i;a++)if(!this.type.allowsMarks(r.child(a).marks))return!1;return!0}canReplaceWith(e,t,r,o){if(o&&!this.type.allowsMarks(o))return!1;let i=this.contentMatchAt(e).matchType(r),s=i&&i.matchFragment(this.content,t);return s?s.validEnd:!1}canAppend(e){return e.content.size?this.canReplace(this.childCount,this.childCount,e.content):this.type.compatibleContent(e.type)}check(){this.type.checkContent(this.content),this.type.checkAttrs(this.attrs);let e=B.none;for(let t=0;t<this.marks.length;t++){let r=this.marks[t];r.type.checkAttrs(r.attrs),e=r.addToSet(e)}if(!B.sameSet(e,this.marks))throw new RangeError(`Invalid collection of marks for node ${this.type.name}: ${this.marks.map(t=>t.type.name)}`);this.content.forEach(t=>t.check())}toJSON(){let e={type:this.type.name};for(let t in this.attrs){e.attrs=this.attrs;break}return this.content.size&&(e.content=this.content.toJSON()),this.marks.length&&(e.marks=this.marks.map(t=>t.toJSON())),e}static fromJSON(e,t){if(!t)throw new RangeError("Invalid input for Node.fromJSON");let r;if(t.marks){if(!Array.isArray(t.marks))throw new RangeError("Invalid mark data for Node.fromJSON");r=t.marks.map(e.markFromJSON)}if(t.type=="text"){if(typeof t.text!="string")throw new RangeError("Invalid text node in JSON");return e.text(t.text,r)}let o=v.fromJSON(e,t.content),i=e.nodeType(t.type).create(t.attrs,o,r);return i.type.checkAttrs(i.attrs),i}}we.prototype.text=void 0;class cn extends we{constructor(e,t,r,o){if(super(e,t,null,o),!r)throw new RangeError("Empty text nodes are not allowed");this.text=r}toString(){return this.type.spec.toDebugString?this.type.spec.toDebugString(this):Jo(this.marks,JSON.stringify(this.text))}get textContent(){return this.text}textBetween(e,t){return this.text.slice(e,t)}get nodeSize(){return this.text.length}mark(e){return e==this.marks?this:new cn(this.type,this.attrs,this.text,e)}withText(e){return e==this.text?this:new cn(this.type,this.attrs,e,this.marks)}cut(e=0,t=this.text.length){return e==0&&t==this.text.length?this:this.withText(this.text.slice(e,t))}eq(e){return this.sameMarkup(e)&&this.text==e.text}toJSON(){let e=super.toJSON();return e.text=this.text,e}}function Jo(n,e){for(let t=n.length-1;t>=0;t--)e=n[t].type.name+"("+e+")";return e}class tt{constructor(e){this.validEnd=e,this.next=[],this.wrapCache=[]}static parse(e,t){let r=new Ms(e,t);if(r.next==null)return tt.empty;let o=Uo(r);r.next&&r.err("Unexpected trailing text");let i=Rs(Es(o));return Is(i,r),i}matchType(e){for(let t=0;t<this.next.length;t++)if(this.next[t].type==e)return this.next[t].next;return null}matchFragment(e,t=0,r=e.childCount){let o=this;for(let i=t;o&&i<r;i++)o=o.matchType(e.child(i).type);return o}get inlineContent(){return this.next.length!=0&&this.next[0].type.isInline}get defaultType(){for(let e=0;e<this.next.length;e++){let{type:t}=this.next[e];if(!(t.isText||t.hasRequiredAttrs()))return t}return null}compatible(e){for(let t=0;t<this.next.length;t++)for(let r=0;r<e.next.length;r++)if(this.next[t].type==e.next[r].type)return!0;return!1}fillBefore(e,t=!1,r=0){let o=[this];function i(s,l){let a=s.matchFragment(e,r);if(a&&(!t||a.validEnd))return v.from(l.map(c=>c.createAndFill()));for(let c=0;c<s.next.length;c++){let{type:d,next:u}=s.next[c];if(!(d.isText||d.hasRequiredAttrs())&&o.indexOf(u)==-1){o.push(u);let h=i(u,l.concat(d));if(h)return h}}return null}return i(this,[])}findWrapping(e){for(let r=0;r<this.wrapCache.length;r+=2)if(this.wrapCache[r]==e)return this.wrapCache[r+1];let t=this.computeWrapping(e);return this.wrapCache.push(e,t),t}computeWrapping(e){let t=Object.create(null),r=[{match:this,type:null,via:null}];for(;r.length;){let o=r.shift(),i=o.match;if(i.matchType(e)){let s=[];for(let l=o;l.type;l=l.via)s.push(l.type);return s.reverse()}for(let s=0;s<i.next.length;s++){let{type:l,next:a}=i.next[s];!l.isLeaf&&!l.hasRequiredAttrs()&&!(l.name in t)&&(!o.type||a.validEnd)&&(r.push({match:l.contentMatch,type:l,via:o}),t[l.name]=!0)}}return null}get edgeCount(){return this.next.length}edge(e){if(e>=this.next.length)throw new RangeError(`There's no ${e}th edge in this content match`);return this.next[e]}toString(){let e=[];function t(r){e.push(r);for(let o=0;o<r.next.length;o++)e.indexOf(r.next[o].next)==-1&&t(r.next[o].next)}return t(this),e.map((r,o)=>{let i=o+(r.validEnd?"*":" ")+" ";for(let s=0;s<r.next.length;s++)i+=(s?", ":"")+r.next[s].type.name+"->"+e.indexOf(r.next[s].next);return i}).join(`
`)}}tt.empty=new tt(!0);class Ms{constructor(e,t){this.string=e,this.nodeTypes=t,this.inline=null,this.pos=0,this.tokens=e.split(/\s*(?=\b|\W|$)/),this.tokens[this.tokens.length-1]==""&&this.tokens.pop(),this.tokens[0]==""&&this.tokens.shift()}get next(){return this.tokens[this.pos]}eat(e){return this.next==e&&(this.pos++||!0)}err(e){throw new SyntaxError(e+" (in content expression '"+this.string+"')")}}function Uo(n){let e=[];do e.push(Ns(n));while(n.eat("|"));return e.length==1?e[0]:{type:"choice",exprs:e}}function Ns(n){let e=[];do e.push(Os(n));while(n.next&&n.next!=")"&&n.next!="|");return e.length==1?e[0]:{type:"seq",exprs:e}}function Os(n){let e=As(n);for(;;)if(n.eat("+"))e={type:"plus",expr:e};else if(n.eat("*"))e={type:"star",expr:e};else if(n.eat("?"))e={type:"opt",expr:e};else if(n.eat("{"))e=Ts(n,e);else break;return e}function Er(n){/\D/.test(n.next)&&n.err("Expected number, got '"+n.next+"'");let e=Number(n.next);return n.pos++,e}function Ts(n,e){let t=Er(n),r=t;return n.eat(",")&&(n.next!="}"?r=Er(n):r=-1),n.eat("}")||n.err("Unclosed braced range"),{type:"range",min:t,max:r,expr:e}}function Ds(n,e){let t=n.nodeTypes,r=t[e];if(r)return[r];let o=[];for(let i in t){let s=t[i];s.isInGroup(e)&&o.push(s)}return o.length==0&&n.err("No node type or group '"+e+"' found"),o}function As(n){if(n.eat("(")){let e=Uo(n);return n.eat(")")||n.err("Missing closing paren"),e}else if(/\W/.test(n.next))n.err("Unexpected token '"+n.next+"'");else{let e=Ds(n,n.next).map(t=>(n.inline==null?n.inline=t.isInline:n.inline!=t.isInline&&n.err("Mixing inline and block content"),{type:"name",value:t}));return n.pos++,e.length==1?e[0]:{type:"choice",exprs:e}}}function Es(n){let e=[[]];return o(i(n,0),t()),e;function t(){return e.push([])-1}function r(s,l,a){let c={term:a,to:l};return e[s].push(c),c}function o(s,l){s.forEach(a=>a.to=l)}function i(s,l){if(s.type=="choice")return s.exprs.reduce((a,c)=>a.concat(i(c,l)),[]);if(s.type=="seq")for(let a=0;;a++){let c=i(s.exprs[a],l);if(a==s.exprs.length-1)return c;o(c,l=t())}else if(s.type=="star"){let a=t();return r(l,a),o(i(s.expr,a),a),[r(a)]}else if(s.type=="plus"){let a=t();return o(i(s.expr,l),a),o(i(s.expr,a),a),[r(a)]}else{if(s.type=="opt")return[r(l)].concat(i(s.expr,l));if(s.type=="range"){let a=l;for(let c=0;c<s.min;c++){let d=t();o(i(s.expr,a),d),a=d}if(s.max==-1)o(i(s.expr,a),a);else for(let c=s.min;c<s.max;c++){let d=t();r(a,d),o(i(s.expr,a),d),a=d}return[r(a)]}else{if(s.type=="name")return[r(l,void 0,s.value)];throw new Error("Unknown expr type")}}}}function Ko(n,e){return e-n}function Rr(n,e){let t=[];return r(e),t.sort(Ko);function r(o){let i=n[o];if(i.length==1&&!i[0].term)return r(i[0].to);t.push(o);for(let s=0;s<i.length;s++){let{term:l,to:a}=i[s];!l&&t.indexOf(a)==-1&&r(a)}}}function Rs(n){let e=Object.create(null);return t(Rr(n,0));function t(r){let o=[];r.forEach(s=>{n[s].forEach(({term:l,to:a})=>{if(!l)return;let c;for(let d=0;d<o.length;d++)o[d][0]==l&&(c=o[d][1]);Rr(n,a).forEach(d=>{c||o.push([l,c=[]]),c.indexOf(d)==-1&&c.push(d)})})});let i=e[r.join(",")]=new tt(r.indexOf(n.length-1)>-1);for(let s=0;s<o.length;s++){let l=o[s][1].sort(Ko);i.next.push({type:o[s][0],next:e[l.join(",")]||t(l)})}return i}}function Is(n,e){for(let t=0,r=[n];t<r.length;t++){let o=r[t],i=!o.validEnd,s=[];for(let l=0;l<o.next.length;l++){let{type:a,next:c}=o.next[l];s.push(a.name),i&&!(a.isText||a.hasRequiredAttrs())&&(i=!1),r.indexOf(c)==-1&&r.push(c)}i&&e.err("Only non-generatable nodes ("+s.join(", ")+") in a required position (see https://prosemirror.net/docs/guide/#generatable)")}}function Yo(n){let e=Object.create(null);for(let t in n){let r=n[t];if(!r.hasDefault)return null;e[t]=r.default}return e}function Go(n,e){let t=Object.create(null);for(let r in n){let o=e&&e[r];if(o===void 0){let i=n[r];if(i.hasDefault)o=i.default;else throw new RangeError("No value supplied for attribute "+r)}t[r]=o}return t}function Xo(n,e,t,r){for(let o in e)if(!(o in n))throw new RangeError(`Unsupported attribute ${o} for ${t} of type ${o}`);for(let o in n){let i=n[o];i.validate&&i.validate(e[o])}}function Zo(n,e){let t=Object.create(null);if(e)for(let r in e)t[r]=new Ps(n,r,e[r]);return t}let Ir=class Qo{constructor(e,t,r){this.name=e,this.schema=t,this.spec=r,this.markSet=null,this.groups=r.group?r.group.split(" "):[],this.attrs=Zo(e,r.attrs),this.defaultAttrs=Yo(this.attrs),this.contentMatch=null,this.inlineContent=null,this.isBlock=!(r.inline||e=="text"),this.isText=e=="text"}get isInline(){return!this.isBlock}get isTextblock(){return this.isBlock&&this.inlineContent}get isLeaf(){return this.contentMatch==tt.empty}get isAtom(){return this.isLeaf||!!this.spec.atom}isInGroup(e){return this.groups.indexOf(e)>-1}get whitespace(){return this.spec.whitespace||(this.spec.code?"pre":"normal")}hasRequiredAttrs(){for(let e in this.attrs)if(this.attrs[e].isRequired)return!0;return!1}compatibleContent(e){return this==e||this.contentMatch.compatible(e.contentMatch)}computeAttrs(e){return!e&&this.defaultAttrs?this.defaultAttrs:Go(this.attrs,e)}create(e=null,t,r){if(this.isText)throw new Error("NodeType.create can't construct text nodes");return new we(this,this.computeAttrs(e),v.from(t),B.setFrom(r))}createChecked(e=null,t,r){return t=v.from(t),this.checkContent(t),new we(this,this.computeAttrs(e),t,B.setFrom(r))}createAndFill(e=null,t,r){if(e=this.computeAttrs(e),t=v.from(t),t.size){let s=this.contentMatch.fillBefore(t);if(!s)return null;t=s.append(t)}let o=this.contentMatch.matchFragment(t),i=o&&o.fillBefore(v.empty,!0);return i?new we(this,e,t.append(i),B.setFrom(r)):null}validContent(e){let t=this.contentMatch.matchFragment(e);if(!t||!t.validEnd)return!1;for(let r=0;r<e.childCount;r++)if(!this.allowsMarks(e.child(r).marks))return!1;return!0}checkContent(e){if(!this.validContent(e))throw new RangeError(`Invalid content for node ${this.name}: ${e.toString().slice(0,50)}`)}checkAttrs(e){Xo(this.attrs,e,"node",this.name)}allowsMarkType(e){return this.markSet==null||this.markSet.indexOf(e)>-1}allowsMarks(e){if(this.markSet==null)return!0;for(let t=0;t<e.length;t++)if(!this.allowsMarkType(e[t].type))return!1;return!0}allowedMarks(e){if(this.markSet==null)return e;let t;for(let r=0;r<e.length;r++)this.allowsMarkType(e[r].type)?t&&t.push(e[r]):t||(t=e.slice(0,r));return t?t.length?t:B.none:e}static compile(e,t){let r=Object.create(null);e.forEach((i,s)=>r[i]=new Qo(i,t,s));let o=t.spec.topNode||"doc";if(!r[o])throw new RangeError("Schema is missing its top node type ('"+o+"')");if(!r.text)throw new RangeError("Every schema needs a 'text' type");for(let i in r.text.attrs)throw new RangeError("The text node type should not have attributes");return r}};function Bs(n,e,t){let r=t.split("|");return o=>{let i=o===null?"null":typeof o;if(r.indexOf(i)<0)throw new RangeError(`Expected value of type ${r} for attribute ${e} on type ${n}, got ${i}`)}}class Ps{constructor(e,t,r){this.hasDefault=Object.prototype.hasOwnProperty.call(r,"default"),this.default=r.default,this.validate=typeof r.validate=="string"?Bs(e,t,r.validate):r.validate}get isRequired(){return!this.hasDefault}}class bn{constructor(e,t,r,o){this.name=e,this.rank=t,this.schema=r,this.spec=o,this.attrs=Zo(e,o.attrs),this.excluded=null;let i=Yo(this.attrs);this.instance=i?new B(this,i):null}create(e=null){return!e&&this.instance?this.instance:new B(this,Go(this.attrs,e))}static compile(e,t){let r=Object.create(null),o=0;return e.forEach((i,s)=>r[i]=new bn(i,o++,t,s)),r}removeFromSet(e){for(var t=0;t<e.length;t++)e[t].type==this&&(e=e.slice(0,t).concat(e.slice(t+1)),t--);return e}isInSet(e){for(let t=0;t<e.length;t++)if(e[t].type==this)return e[t]}checkAttrs(e){Xo(this.attrs,e,"mark",this.name)}excludes(e){return this.excluded.indexOf(e)>-1}}class Ls{constructor(e){this.linebreakReplacement=null,this.cached=Object.create(null);let t=this.spec={};for(let o in e)t[o]=e[o];t.nodes=U.from(e.nodes),t.marks=U.from(e.marks||{}),this.nodes=Ir.compile(this.spec.nodes,this),this.marks=bn.compile(this.spec.marks,this);let r=Object.create(null);for(let o in this.nodes){if(o in this.marks)throw new RangeError(o+" can not be both a node and a mark");let i=this.nodes[o],s=i.spec.content||"",l=i.spec.marks;if(i.contentMatch=r[s]||(r[s]=tt.parse(s,this.nodes)),i.inlineContent=i.contentMatch.inlineContent,i.spec.linebreakReplacement){if(this.linebreakReplacement)throw new RangeError("Multiple linebreak nodes defined");if(!i.isInline||!i.isLeaf)throw new RangeError("Linebreak replacement nodes must be inline leaf nodes");this.linebreakReplacement=i}i.markSet=l=="_"?null:l?Br(this,l.split(" ")):l==""||!i.inlineContent?[]:null}for(let o in this.marks){let i=this.marks[o],s=i.spec.excludes;i.excluded=s==null?[i]:s==""?[]:Br(this,s.split(" "))}this.nodeFromJSON=o=>we.fromJSON(this,o),this.markFromJSON=o=>B.fromJSON(this,o),this.topNodeType=this.nodes[this.spec.topNode||"doc"],this.cached.wrappings=Object.create(null)}node(e,t=null,r,o){if(typeof e=="string")e=this.nodeType(e);else if(e instanceof Ir){if(e.schema!=this)throw new RangeError("Node type from different schema used ("+e.name+")")}else throw new RangeError("Invalid node type: "+e);return e.createChecked(t,r,o)}text(e,t){let r=this.nodes.text;return new cn(r,r.defaultAttrs,e,B.setFrom(t))}mark(e,t){return typeof e=="string"&&(e=this.marks[e]),e.create(t)}nodeType(e){let t=this.nodes[e];if(!t)throw new RangeError("Unknown node type: "+e);return t}}function Br(n,e){let t=[];for(let r=0;r<e.length;r++){let o=e[r],i=n.marks[o],s=i;if(i)t.push(i);else for(let l in n.marks){let a=n.marks[l];(o=="_"||a.spec.group&&a.spec.group.split(" ").indexOf(o)>-1)&&t.push(s=a)}if(!s)throw new SyntaxError("Unknown mark type: '"+e[r]+"'")}return t}function zs(n){return n.tag!=null}function js(n){return n.style!=null}class It{constructor(e,t){this.schema=e,this.rules=t,this.tags=[],this.styles=[];let r=this.matchedStyles=[];t.forEach(o=>{if(zs(o))this.tags.push(o);else if(js(o)){let i=/[^=]*/.exec(o.style)[0];r.indexOf(i)<0&&r.push(i),this.styles.push(o)}}),this.normalizeLists=!this.tags.some(o=>{if(!/^(ul|ol)\b/.test(o.tag)||!o.node)return!1;let i=e.nodes[o.node];return i.contentMatch.matchType(i)})}parse(e,t={}){let r=new Lr(this,t,!1);return r.addAll(e,B.none,t.from,t.to),r.finish()}parseSlice(e,t={}){let r=new Lr(this,t,!0);return r.addAll(e,B.none,t.from,t.to),M.maxOpen(r.finish())}matchTag(e,t,r){for(let o=r?this.tags.indexOf(r)+1:0;o<this.tags.length;o++){let i=this.tags[o];if($s(e,i.tag)&&(i.namespace===void 0||e.namespaceURI==i.namespace)&&(!i.context||t.matchesContext(i.context))){if(i.getAttrs){let s=i.getAttrs(e);if(s===!1)continue;i.attrs=s||void 0}return i}}}matchStyle(e,t,r,o){for(let i=o?this.styles.indexOf(o)+1:0;i<this.styles.length;i++){let s=this.styles[i],l=s.style;if(!(l.indexOf(e)!=0||s.context&&!r.matchesContext(s.context)||l.length>e.length&&(l.charCodeAt(e.length)!=61||l.slice(e.length+1)!=t))){if(s.getAttrs){let a=s.getAttrs(t);if(a===!1)continue;s.attrs=a||void 0}return s}}}static schemaRules(e){let t=[];function r(o){let i=o.priority==null?50:o.priority,s=0;for(;s<t.length;s++){let l=t[s];if((l.priority==null?50:l.priority)<i)break}t.splice(s,0,o)}for(let o in e.marks){let i=e.marks[o].spec.parseDOM;i&&i.forEach(s=>{r(s=zr(s)),s.mark||s.ignore||s.clearMark||(s.mark=o)})}for(let o in e.nodes){let i=e.nodes[o].spec.parseDOM;i&&i.forEach(s=>{r(s=zr(s)),s.node||s.ignore||s.mark||(s.node=o)})}return t}static fromSchema(e){return e.cached.domParser||(e.cached.domParser=new It(e,It.schemaRules(e)))}}const ei={address:!0,article:!0,aside:!0,blockquote:!0,canvas:!0,dd:!0,div:!0,dl:!0,fieldset:!0,figcaption:!0,figure:!0,footer:!0,form:!0,h1:!0,h2:!0,h3:!0,h4:!0,h5:!0,h6:!0,header:!0,hgroup:!0,hr:!0,li:!0,noscript:!0,ol:!0,output:!0,p:!0,pre:!0,section:!0,table:!0,tfoot:!0,ul:!0},Vs={head:!0,noscript:!0,object:!0,script:!0,style:!0,title:!0},ti={ol:!0,ul:!0},Bt=1,Un=2,Ot=4;function Pr(n,e,t){return e!=null?(e?Bt:0)|(e==="full"?Un:0):n&&n.whitespace=="pre"?Bt|Un:t&~Ot}class Xt{constructor(e,t,r,o,i,s){this.type=e,this.attrs=t,this.marks=r,this.solid=o,this.options=s,this.content=[],this.activeMarks=B.none,this.match=i||(s&Ot?null:e.contentMatch)}findWrapping(e){if(!this.match){if(!this.type)return[];let t=this.type.contentMatch.fillBefore(v.from(e));if(t)this.match=this.type.contentMatch.matchFragment(t);else{let r=this.type.contentMatch,o;return(o=r.findWrapping(e.type))?(this.match=r,o):null}}return this.match.findWrapping(e.type)}finish(e){if(!(this.options&Bt)){let r=this.content[this.content.length-1],o;if(r&&r.isText&&(o=/[ \t\r\n\u000c]+$/.exec(r.text))){let i=r;r.text.length==o[0].length?this.content.pop():this.content[this.content.length-1]=i.withText(i.text.slice(0,i.text.length-o[0].length))}}let t=v.from(this.content);return!e&&this.match&&(t=t.append(this.match.fillBefore(v.empty,!0))),this.type?this.type.create(this.attrs,t,this.marks):t}inlineContext(e){return this.type?this.type.inlineContent:this.content.length?this.content[0].isInline:e.parentNode&&!ei.hasOwnProperty(e.parentNode.nodeName.toLowerCase())}}class Lr{constructor(e,t,r){this.parser=e,this.options=t,this.isOpen=r,this.open=0,this.localPreserveWS=!1;let o=t.topNode,i,s=Pr(null,t.preserveWhitespace,0)|(r?Ot:0);o?i=new Xt(o.type,o.attrs,B.none,!0,t.topMatch||o.type.contentMatch,s):r?i=new Xt(null,null,B.none,!0,null,s):i=new Xt(e.schema.topNodeType,null,B.none,!0,null,s),this.nodes=[i],this.find=t.findPositions,this.needsBlock=!1}get top(){return this.nodes[this.open]}addDOM(e,t){e.nodeType==3?this.addTextNode(e,t):e.nodeType==1&&this.addElement(e,t)}addTextNode(e,t){let r=e.nodeValue,o=this.top,i=o.options&Un?"full":this.localPreserveWS||(o.options&Bt)>0,{schema:s}=this.parser;if(i==="full"||o.inlineContext(e)||/[^ \t\r\n\u000c]/.test(r)){if(i)if(i==="full")r=r.replace(/\r\n?/g,`
`);else if(s.linebreakReplacement&&/[\r\n]/.test(r)&&this.top.findWrapping(s.linebreakReplacement.create())){let l=r.split(/\r?\n|\r/);for(let a=0;a<l.length;a++)a&&this.insertNode(s.linebreakReplacement.create(),t,!0),l[a]&&this.insertNode(s.text(l[a]),t,!/\S/.test(l[a]));r=""}else r=r.replace(/\r?\n|\r/g," ");else if(r=r.replace(/[ \t\r\n\u000c]+/g," "),/^[ \t\r\n\u000c]/.test(r)&&this.open==this.nodes.length-1){let l=o.content[o.content.length-1],a=e.previousSibling;(!l||a&&a.nodeName=="BR"||l.isText&&/[ \t\r\n\u000c]$/.test(l.text))&&(r=r.slice(1))}r&&this.insertNode(s.text(r),t,!/\S/.test(r)),this.findInText(e)}else this.findInside(e)}addElement(e,t,r){let o=this.localPreserveWS,i=this.top;(e.tagName=="PRE"||/pre/.test(e.style&&e.style.whiteSpace))&&(this.localPreserveWS=!0);let s=e.nodeName.toLowerCase(),l;ti.hasOwnProperty(s)&&this.parser.normalizeLists&&Fs(e);let a=this.options.ruleFromNode&&this.options.ruleFromNode(e)||(l=this.parser.matchTag(e,this,r));e:if(a?a.ignore:Vs.hasOwnProperty(s))this.findInside(e),this.ignoreFallback(e,t);else if(!a||a.skip||a.closeParent){a&&a.closeParent?this.open=Math.max(0,this.open-1):a&&a.skip.nodeType&&(e=a.skip);let c,d=this.needsBlock;if(ei.hasOwnProperty(s))i.content.length&&i.content[0].isInline&&this.open&&(this.open--,i=this.top),c=!0,i.type||(this.needsBlock=!0);else if(!e.firstChild){this.leafFallback(e,t);break e}let u=a&&a.skip?t:this.readStyles(e,t);u&&this.addAll(e,u),c&&this.sync(i),this.needsBlock=d}else{let c=this.readStyles(e,t);c&&this.addElementByRule(e,a,c,a.consuming===!1?l:void 0)}this.localPreserveWS=o}leafFallback(e,t){e.nodeName=="BR"&&this.top.type&&this.top.type.inlineContent&&this.addTextNode(e.ownerDocument.createTextNode(`
`),t)}ignoreFallback(e,t){e.nodeName=="BR"&&(!this.top.type||!this.top.type.inlineContent)&&this.findPlace(this.parser.schema.text("-"),t,!0)}readStyles(e,t){let r=e.style;if(r&&r.length)for(let o=0;o<this.parser.matchedStyles.length;o++){let i=this.parser.matchedStyles[o],s=r.getPropertyValue(i);if(s)for(let l=void 0;;){let a=this.parser.matchStyle(i,s,this,l);if(!a)break;if(a.ignore)return null;if(a.clearMark?t=t.filter(c=>!a.clearMark(c)):t=t.concat(this.parser.schema.marks[a.mark].create(a.attrs)),a.consuming===!1)l=a;else break}}return t}addElementByRule(e,t,r,o){let i,s;if(t.node)if(s=this.parser.schema.nodes[t.node],s.isLeaf)this.insertNode(s.create(t.attrs),r,e.nodeName=="BR")||this.leafFallback(e,r);else{let a=this.enter(s,t.attrs||null,r,t.preserveWhitespace);a&&(i=!0,r=a)}else{let a=this.parser.schema.marks[t.mark];r=r.concat(a.create(t.attrs))}let l=this.top;if(s&&s.isLeaf)this.findInside(e);else if(o)this.addElement(e,r,o);else if(t.getContent)this.findInside(e),t.getContent(e,this.parser.schema).forEach(a=>this.insertNode(a,r,!1));else{let a=e;typeof t.contentElement=="string"?a=e.querySelector(t.contentElement):typeof t.contentElement=="function"?a=t.contentElement(e):t.contentElement&&(a=t.contentElement),this.findAround(e,a,!0),this.addAll(a,r),this.findAround(e,a,!1)}i&&this.sync(l)&&this.open--}addAll(e,t,r,o){let i=r||0;for(let s=r?e.childNodes[r]:e.firstChild,l=o==null?null:e.childNodes[o];s!=l;s=s.nextSibling,++i)this.findAtPoint(e,i),this.addDOM(s,t);this.findAtPoint(e,i)}findPlace(e,t,r){let o,i;for(let s=this.open,l=0;s>=0;s--){let a=this.nodes[s],c=a.findWrapping(e);if(c&&(!o||o.length>c.length+l)&&(o=c,i=a,!c.length))break;if(a.solid){if(r)break;l+=2}}if(!o)return null;this.sync(i);for(let s=0;s<o.length;s++)t=this.enterInner(o[s],null,t,!1);return t}insertNode(e,t,r){if(e.isInline&&this.needsBlock&&!this.top.type){let i=this.textblockFromContext();i&&(t=this.enterInner(i,null,t))}let o=this.findPlace(e,t,r);if(o){this.closeExtra();let i=this.top;i.match&&(i.match=i.match.matchType(e.type));let s=B.none;for(let l of o.concat(e.marks))(i.type?i.type.allowsMarkType(l.type):jr(l.type,e.type))&&(s=l.addToSet(s));return i.content.push(e.mark(s)),!0}return!1}enter(e,t,r,o){let i=this.findPlace(e.create(t),r,!1);return i&&(i=this.enterInner(e,t,r,!0,o)),i}enterInner(e,t,r,o=!1,i){this.closeExtra();let s=this.top;s.match=s.match&&s.match.matchType(e);let l=Pr(e,i,s.options);s.options&Ot&&s.content.length==0&&(l|=Ot);let a=B.none;return r=r.filter(c=>(s.type?s.type.allowsMarkType(c.type):jr(c.type,e))?(a=c.addToSet(a),!1):!0),this.nodes.push(new Xt(e,t,a,o,null,l)),this.open++,r}closeExtra(e=!1){let t=this.nodes.length-1;if(t>this.open){for(;t>this.open;t--)this.nodes[t-1].content.push(this.nodes[t].finish(e));this.nodes.length=this.open+1}}finish(){return this.open=0,this.closeExtra(this.isOpen),this.nodes[0].finish(!!(this.isOpen||this.options.topOpen))}sync(e){for(let t=this.open;t>=0;t--){if(this.nodes[t]==e)return this.open=t,!0;this.localPreserveWS&&(this.nodes[t].options|=Bt)}return!1}get currentPos(){this.closeExtra();let e=0;for(let t=this.open;t>=0;t--){let r=this.nodes[t].content;for(let o=r.length-1;o>=0;o--)e+=r[o].nodeSize;t&&e++}return e}findAtPoint(e,t){if(this.find)for(let r=0;r<this.find.length;r++)this.find[r].node==e&&this.find[r].offset==t&&(this.find[r].pos=this.currentPos)}findInside(e){if(this.find)for(let t=0;t<this.find.length;t++)this.find[t].pos==null&&e.nodeType==1&&e.contains(this.find[t].node)&&(this.find[t].pos=this.currentPos)}findAround(e,t,r){if(e!=t&&this.find)for(let o=0;o<this.find.length;o++)this.find[o].pos==null&&e.nodeType==1&&e.contains(this.find[o].node)&&t.compareDocumentPosition(this.find[o].node)&(r?2:4)&&(this.find[o].pos=this.currentPos)}findInText(e){if(this.find)for(let t=0;t<this.find.length;t++)this.find[t].node==e&&(this.find[t].pos=this.currentPos-(e.nodeValue.length-this.find[t].offset))}matchesContext(e){if(e.indexOf("|")>-1)return e.split(/\s*\|\s*/).some(this.matchesContext,this);let t=e.split("/"),r=this.options.context,o=!this.isOpen&&(!r||r.parent.type==this.nodes[0].type),i=-(r?r.depth+1:0)+(o?0:1),s=(l,a)=>{for(;l>=0;l--){let c=t[l];if(c==""){if(l==t.length-1||l==0)continue;for(;a>=i;a--)if(s(l-1,a))return!0;return!1}else{let d=a>0||a==0&&o?this.nodes[a].type:r&&a>=i?r.node(a-i).type:null;if(!d||d.name!=c&&!d.isInGroup(c))return!1;a--}}return!0};return s(t.length-1,this.open)}textblockFromContext(){let e=this.options.context;if(e)for(let t=e.depth;t>=0;t--){let r=e.node(t).contentMatchAt(e.indexAfter(t)).defaultType;if(r&&r.isTextblock&&r.defaultAttrs)return r}for(let t in this.parser.schema.nodes){let r=this.parser.schema.nodes[t];if(r.isTextblock&&r.defaultAttrs)return r}}}function Fs(n){for(let e=n.firstChild,t=null;e;e=e.nextSibling){let r=e.nodeType==1?e.nodeName.toLowerCase():null;r&&ti.hasOwnProperty(r)&&t?(t.appendChild(e),e=t):r=="li"?t=e:r&&(t=null)}}function $s(n,e){return(n.matches||n.msMatchesSelector||n.webkitMatchesSelector||n.mozMatchesSelector).call(n,e)}function zr(n){let e={};for(let t in n)e[t]=n[t];return e}function jr(n,e){let t=e.schema.nodes;for(let r in t){let o=t[r];if(!o.allowsMarkType(n))continue;let i=[],s=l=>{i.push(l);for(let a=0;a<l.edgeCount;a++){let{type:c,next:d}=l.edge(a);if(c==e||i.indexOf(d)<0&&s(d))return!0}};if(s(o.contentMatch))return!0}}class xt{constructor(e,t){this.nodes=e,this.marks=t}serializeFragment(e,t={},r){r||(r=Nn(t).createDocumentFragment());let o=r,i=[];return e.forEach(s=>{if(i.length||s.marks.length){let l=0,a=0;for(;l<i.length&&a<s.marks.length;){let c=s.marks[a];if(!this.marks[c.type.name]){a++;continue}if(!c.eq(i[l][0])||c.type.spec.spanning===!1)break;l++,a++}for(;l<i.length;)o=i.pop()[1];for(;a<s.marks.length;){let c=s.marks[a++],d=this.serializeMark(c,s.isInline,t);d&&(i.push([c,o]),o.appendChild(d.dom),o=d.contentDOM||d.dom)}}o.appendChild(this.serializeNodeInner(s,t))}),r}serializeNodeInner(e,t){let{dom:r,contentDOM:o}=tn(Nn(t),this.nodes[e.type.name](e),null,e.attrs);if(o){if(e.isLeaf)throw new RangeError("Content hole not allowed in a leaf node spec");this.serializeFragment(e.content,t,o)}return r}serializeNode(e,t={}){let r=this.serializeNodeInner(e,t);for(let o=e.marks.length-1;o>=0;o--){let i=this.serializeMark(e.marks[o],e.isInline,t);i&&((i.contentDOM||i.dom).appendChild(r),r=i.dom)}return r}serializeMark(e,t,r={}){let o=this.marks[e.type.name];return o&&tn(Nn(r),o(e,t),null,e.attrs)}static renderSpec(e,t,r=null,o){return tn(e,t,r,o)}static fromSchema(e){return e.cached.domSerializer||(e.cached.domSerializer=new xt(this.nodesFromSchema(e),this.marksFromSchema(e)))}static nodesFromSchema(e){let t=Vr(e.nodes);return t.text||(t.text=r=>r.text),t}static marksFromSchema(e){return Vr(e.marks)}}function Vr(n){let e={};for(let t in n){let r=n[t].spec.toDOM;r&&(e[t]=r)}return e}function Nn(n){return n.document||window.document}const Fr=new WeakMap;function _s(n){let e=Fr.get(n);return e===void 0&&Fr.set(n,e=Ws(n)),e}function Ws(n){let e=null;function t(r){if(r&&typeof r=="object")if(Array.isArray(r))if(typeof r[0]=="string")e||(e=[]),e.push(r);else for(let o=0;o<r.length;o++)t(r[o]);else for(let o in r)t(r[o])}return t(n),e}function tn(n,e,t,r){if(typeof e=="string")return{dom:n.createTextNode(e)};if(e.nodeType!=null)return{dom:e};if(e.dom&&e.dom.nodeType!=null)return e;let o=e[0],i;if(typeof o!="string")throw new RangeError("Invalid array passed to renderSpec");if(r&&(i=_s(r))&&i.indexOf(e)>-1)throw new RangeError("Using an array from an attribute object as a DOM spec. This may be an attempted cross site scripting attack.");let s=o.indexOf(" ");s>0&&(t=o.slice(0,s),o=o.slice(s+1));let l,a=t?n.createElementNS(t,o):n.createElement(o),c=e[1],d=1;if(c&&typeof c=="object"&&c.nodeType==null&&!Array.isArray(c)){d=2;for(let u in c)if(c[u]!=null){let h=u.indexOf(" ");h>0?a.setAttributeNS(u.slice(0,h),u.slice(h+1),c[u]):u=="style"&&a.style?a.style.cssText=c[u]:a.setAttribute(u,c[u])}}for(let u=d;u<e.length;u++){let h=e[u];if(h===0){if(u<e.length-1||u>d)throw new RangeError("Content hole must be the only child of its parent node");return{dom:a,contentDOM:a}}else{let{dom:f,contentDOM:p}=tn(n,h,t,r);if(a.appendChild(f),p){if(l)throw new RangeError("Multiple content holes");l=p}}}return{dom:a,contentDOM:l}}const ni=65535,ri=Math.pow(2,16);function qs(n,e){return n+e*ri}function $r(n){return n&ni}function Hs(n){return(n-(n&ni))/ri}const oi=1,ii=2,nn=4,si=8;class Kn{constructor(e,t,r){this.pos=e,this.delInfo=t,this.recover=r}get deleted(){return(this.delInfo&si)>0}get deletedBefore(){return(this.delInfo&(oi|nn))>0}get deletedAfter(){return(this.delInfo&(ii|nn))>0}get deletedAcross(){return(this.delInfo&nn)>0}}class ce{constructor(e,t=!1){if(this.ranges=e,this.inverted=t,!e.length&&ce.empty)return ce.empty}recover(e){let t=0,r=$r(e);if(!this.inverted)for(let o=0;o<r;o++)t+=this.ranges[o*3+2]-this.ranges[o*3+1];return this.ranges[r*3]+t+Hs(e)}mapResult(e,t=1){return this._map(e,t,!1)}map(e,t=1){return this._map(e,t,!0)}_map(e,t,r){let o=0,i=this.inverted?2:1,s=this.inverted?1:2;for(let l=0;l<this.ranges.length;l+=3){let a=this.ranges[l]-(this.inverted?o:0);if(a>e)break;let c=this.ranges[l+i],d=this.ranges[l+s],u=a+c;if(e<=u){let h=c?e==a?-1:e==u?1:t:t,f=a+o+(h<0?0:d);if(r)return f;let p=e==(t<0?a:u)?null:qs(l/3,e-a),g=e==a?ii:e==u?oi:nn;return(t<0?e!=a:e!=u)&&(g|=si),new Kn(f,g,p)}o+=d-c}return r?e+o:new Kn(e+o,0,null)}touches(e,t){let r=0,o=$r(t),i=this.inverted?2:1,s=this.inverted?1:2;for(let l=0;l<this.ranges.length;l+=3){let a=this.ranges[l]-(this.inverted?r:0);if(a>e)break;let c=this.ranges[l+i],d=a+c;if(e<=d&&l==o*3)return!0;r+=this.ranges[l+s]-c}return!1}forEach(e){let t=this.inverted?2:1,r=this.inverted?1:2;for(let o=0,i=0;o<this.ranges.length;o+=3){let s=this.ranges[o],l=s-(this.inverted?i:0),a=s+(this.inverted?0:i),c=this.ranges[o+t],d=this.ranges[o+r];e(l,l+c,a,a+d),i+=d-c}}invert(){return new ce(this.ranges,!this.inverted)}toString(){return(this.inverted?"-":"")+JSON.stringify(this.ranges)}static offset(e){return e==0?ce.empty:new ce(e<0?[0,-e,0]:[0,0,e])}}ce.empty=new ce([]);class Pt{constructor(e,t,r=0,o=e?e.length:0){this.mirror=t,this.from=r,this.to=o,this._maps=e||[],this.ownData=!(e||t)}get maps(){return this._maps}slice(e=0,t=this.maps.length){return new Pt(this._maps,this.mirror,e,t)}appendMap(e,t){this.ownData||(this._maps=this._maps.slice(),this.mirror=this.mirror&&this.mirror.slice(),this.ownData=!0),this.to=this._maps.push(e),t!=null&&this.setMirror(this._maps.length-1,t)}appendMapping(e){for(let t=0,r=this._maps.length;t<e._maps.length;t++){let o=e.getMirror(t);this.appendMap(e._maps[t],o!=null&&o<t?r+o:void 0)}}getMirror(e){if(this.mirror){for(let t=0;t<this.mirror.length;t++)if(this.mirror[t]==e)return this.mirror[t+(t%2?-1:1)]}}setMirror(e,t){this.mirror||(this.mirror=[]),this.mirror.push(e,t)}appendMappingInverted(e){for(let t=e.maps.length-1,r=this._maps.length+e._maps.length;t>=0;t--){let o=e.getMirror(t);this.appendMap(e._maps[t].invert(),o!=null&&o>t?r-o-1:void 0)}}invert(){let e=new Pt;return e.appendMappingInverted(this),e}map(e,t=1){if(this.mirror)return this._map(e,t,!0);for(let r=this.from;r<this.to;r++)e=this._maps[r].map(e,t);return e}mapResult(e,t=1){return this._map(e,t,!1)}_map(e,t,r){let o=0;for(let i=this.from;i<this.to;i++){let s=this._maps[i],l=s.mapResult(e,t);if(l.recover!=null){let a=this.getMirror(i);if(a!=null&&a>i&&a<this.to){i=a,e=this._maps[a].recover(l.recover);continue}}o|=l.delInfo,e=l.pos}return r?e:new Kn(e,o,null)}}const On=Object.create(null);class te{getMap(){return ce.empty}merge(e){return null}static fromJSON(e,t){if(!t||!t.stepType)throw new RangeError("Invalid input for Step.fromJSON");let r=On[t.stepType];if(!r)throw new RangeError(`No step type ${t.stepType} defined`);return r.fromJSON(e,t)}static jsonID(e,t){if(e in On)throw new RangeError("Duplicate use of step JSON ID "+e);return On[e]=t,t.prototype.jsonID=e,t}}class F{constructor(e,t){this.doc=e,this.failed=t}static ok(e){return new F(e,null)}static fail(e){return new F(null,e)}static fromReplace(e,t,r,o){try{return F.ok(e.replace(t,r,o))}catch(i){if(i instanceof sn)return F.fail(i.message);throw i}}}function lr(n,e,t){let r=[];for(let o=0;o<n.childCount;o++){let i=n.child(o);i.content.size&&(i=i.copy(lr(i.content,e,i))),i.isInline&&(i=e(i,t,o)),r.push(i)}return v.fromArray(r)}class ze extends te{constructor(e,t,r){super(),this.from=e,this.to=t,this.mark=r}apply(e){let t=e.slice(this.from,this.to),r=e.resolve(this.from),o=r.node(r.sharedDepth(this.to)),i=new M(lr(t.content,(s,l)=>!s.isAtom||!l.type.allowsMarkType(this.mark.type)?s:s.mark(this.mark.addToSet(s.marks)),o),t.openStart,t.openEnd);return F.fromReplace(e,this.from,this.to,i)}invert(){return new xe(this.from,this.to,this.mark)}map(e){let t=e.mapResult(this.from,1),r=e.mapResult(this.to,-1);return t.deleted&&r.deleted||t.pos>=r.pos?null:new ze(t.pos,r.pos,this.mark)}merge(e){return e instanceof ze&&e.mark.eq(this.mark)&&this.from<=e.to&&this.to>=e.from?new ze(Math.min(this.from,e.from),Math.max(this.to,e.to),this.mark):null}toJSON(){return{stepType:"addMark",mark:this.mark.toJSON(),from:this.from,to:this.to}}static fromJSON(e,t){if(typeof t.from!="number"||typeof t.to!="number")throw new RangeError("Invalid input for AddMarkStep.fromJSON");return new ze(t.from,t.to,e.markFromJSON(t.mark))}}te.jsonID("addMark",ze);class xe extends te{constructor(e,t,r){super(),this.from=e,this.to=t,this.mark=r}apply(e){let t=e.slice(this.from,this.to),r=new M(lr(t.content,o=>o.mark(this.mark.removeFromSet(o.marks)),e),t.openStart,t.openEnd);return F.fromReplace(e,this.from,this.to,r)}invert(){return new ze(this.from,this.to,this.mark)}map(e){let t=e.mapResult(this.from,1),r=e.mapResult(this.to,-1);return t.deleted&&r.deleted||t.pos>=r.pos?null:new xe(t.pos,r.pos,this.mark)}merge(e){return e instanceof xe&&e.mark.eq(this.mark)&&this.from<=e.to&&this.to>=e.from?new xe(Math.min(this.from,e.from),Math.max(this.to,e.to),this.mark):null}toJSON(){return{stepType:"removeMark",mark:this.mark.toJSON(),from:this.from,to:this.to}}static fromJSON(e,t){if(typeof t.from!="number"||typeof t.to!="number")throw new RangeError("Invalid input for RemoveMarkStep.fromJSON");return new xe(t.from,t.to,e.markFromJSON(t.mark))}}te.jsonID("removeMark",xe);class je extends te{constructor(e,t){super(),this.pos=e,this.mark=t}apply(e){let t=e.nodeAt(this.pos);if(!t)return F.fail("No node at mark step's position");let r=t.type.create(t.attrs,null,this.mark.addToSet(t.marks));return F.fromReplace(e,this.pos,this.pos+1,new M(v.from(r),0,t.isLeaf?0:1))}invert(e){let t=e.nodeAt(this.pos);if(t){let r=this.mark.addToSet(t.marks);if(r.length==t.marks.length){for(let o=0;o<t.marks.length;o++)if(!t.marks[o].isInSet(r))return new je(this.pos,t.marks[o]);return new je(this.pos,this.mark)}}return new nt(this.pos,this.mark)}map(e){let t=e.mapResult(this.pos,1);return t.deletedAfter?null:new je(t.pos,this.mark)}toJSON(){return{stepType:"addNodeMark",pos:this.pos,mark:this.mark.toJSON()}}static fromJSON(e,t){if(typeof t.pos!="number")throw new RangeError("Invalid input for AddNodeMarkStep.fromJSON");return new je(t.pos,e.markFromJSON(t.mark))}}te.jsonID("addNodeMark",je);class nt extends te{constructor(e,t){super(),this.pos=e,this.mark=t}apply(e){let t=e.nodeAt(this.pos);if(!t)return F.fail("No node at mark step's position");let r=t.type.create(t.attrs,null,this.mark.removeFromSet(t.marks));return F.fromReplace(e,this.pos,this.pos+1,new M(v.from(r),0,t.isLeaf?0:1))}invert(e){let t=e.nodeAt(this.pos);return!t||!this.mark.isInSet(t.marks)?this:new je(this.pos,this.mark)}map(e){let t=e.mapResult(this.pos,1);return t.deletedAfter?null:new nt(t.pos,this.mark)}toJSON(){return{stepType:"removeNodeMark",pos:this.pos,mark:this.mark.toJSON()}}static fromJSON(e,t){if(typeof t.pos!="number")throw new RangeError("Invalid input for RemoveNodeMarkStep.fromJSON");return new nt(t.pos,e.markFromJSON(t.mark))}}te.jsonID("removeNodeMark",nt);class ee extends te{constructor(e,t,r,o=!1){super(),this.from=e,this.to=t,this.slice=r,this.structure=o}apply(e){return this.structure&&Yn(e,this.from,this.to)?F.fail("Structure replace would overwrite content"):F.fromReplace(e,this.from,this.to,this.slice)}getMap(){return new ce([this.from,this.to-this.from,this.slice.size])}invert(e){return new ee(this.from,this.from+this.slice.size,e.slice(this.from,this.to))}map(e){let t=e.mapResult(this.from,1),r=e.mapResult(this.to,-1);return t.deletedAcross&&r.deletedAcross?null:new ee(t.pos,Math.max(t.pos,r.pos),this.slice,this.structure)}merge(e){if(!(e instanceof ee)||e.structure||this.structure)return null;if(this.from+this.slice.size==e.from&&!this.slice.openEnd&&!e.slice.openStart){let t=this.slice.size+e.slice.size==0?M.empty:new M(this.slice.content.append(e.slice.content),this.slice.openStart,e.slice.openEnd);return new ee(this.from,this.to+(e.to-e.from),t,this.structure)}else if(e.to==this.from&&!this.slice.openStart&&!e.slice.openEnd){let t=this.slice.size+e.slice.size==0?M.empty:new M(e.slice.content.append(this.slice.content),e.slice.openStart,this.slice.openEnd);return new ee(e.from,this.to,t,this.structure)}else return null}toJSON(){let e={stepType:"replace",from:this.from,to:this.to};return this.slice.size&&(e.slice=this.slice.toJSON()),this.structure&&(e.structure=!0),e}static fromJSON(e,t){if(typeof t.from!="number"||typeof t.to!="number")throw new RangeError("Invalid input for ReplaceStep.fromJSON");return new ee(t.from,t.to,M.fromJSON(e,t.slice),!!t.structure)}}te.jsonID("replace",ee);class G extends te{constructor(e,t,r,o,i,s,l=!1){super(),this.from=e,this.to=t,this.gapFrom=r,this.gapTo=o,this.slice=i,this.insert=s,this.structure=l}apply(e){if(this.structure&&(Yn(e,this.from,this.gapFrom)||Yn(e,this.gapTo,this.to)))return F.fail("Structure gap-replace would overwrite content");let t=e.slice(this.gapFrom,this.gapTo);if(t.openStart||t.openEnd)return F.fail("Gap is not a flat range");let r=this.slice.insertAt(this.insert,t.content);return r?F.fromReplace(e,this.from,this.to,r):F.fail("Content does not fit in gap")}getMap(){return new ce([this.from,this.gapFrom-this.from,this.insert,this.gapTo,this.to-this.gapTo,this.slice.size-this.insert])}invert(e){let t=this.gapTo-this.gapFrom;return new G(this.from,this.from+this.slice.size+t,this.from+this.insert,this.from+this.insert+t,e.slice(this.from,this.to).removeBetween(this.gapFrom-this.from,this.gapTo-this.from),this.gapFrom-this.from,this.structure)}map(e){let t=e.mapResult(this.from,1),r=e.mapResult(this.to,-1),o=this.from==this.gapFrom?t.pos:e.map(this.gapFrom,-1),i=this.to==this.gapTo?r.pos:e.map(this.gapTo,1);return t.deletedAcross&&r.deletedAcross||o<t.pos||i>r.pos?null:new G(t.pos,r.pos,o,i,this.slice,this.insert,this.structure)}toJSON(){let e={stepType:"replaceAround",from:this.from,to:this.to,gapFrom:this.gapFrom,gapTo:this.gapTo,insert:this.insert};return this.slice.size&&(e.slice=this.slice.toJSON()),this.structure&&(e.structure=!0),e}static fromJSON(e,t){if(typeof t.from!="number"||typeof t.to!="number"||typeof t.gapFrom!="number"||typeof t.gapTo!="number"||typeof t.insert!="number")throw new RangeError("Invalid input for ReplaceAroundStep.fromJSON");return new G(t.from,t.to,t.gapFrom,t.gapTo,M.fromJSON(e,t.slice),t.insert,!!t.structure)}}te.jsonID("replaceAround",G);function Yn(n,e,t){let r=n.resolve(e),o=t-e,i=r.depth;for(;o>0&&i>0&&r.indexAfter(i)==r.node(i).childCount;)i--,o--;if(o>0){let s=r.node(i).maybeChild(r.indexAfter(i));for(;o>0;){if(!s||s.isLeaf)return!0;s=s.firstChild,o--}}return!1}function Js(n,e,t,r){let o=[],i=[],s,l;n.doc.nodesBetween(e,t,(a,c,d)=>{if(!a.isInline)return;let u=a.marks;if(!r.isInSet(u)&&d.type.allowsMarkType(r.type)){let h=Math.max(c,e),f=Math.min(c+a.nodeSize,t),p=r.addToSet(u);for(let g=0;g<u.length;g++)u[g].isInSet(p)||(s&&s.to==h&&s.mark.eq(u[g])?s.to=f:o.push(s=new xe(h,f,u[g])));l&&l.to==h?l.to=f:i.push(l=new ze(h,f,r))}}),o.forEach(a=>n.step(a)),i.forEach(a=>n.step(a))}function Us(n,e,t,r){let o=[],i=0;n.doc.nodesBetween(e,t,(s,l)=>{if(!s.isInline)return;i++;let a=null;if(r instanceof bn){let c=s.marks,d;for(;d=r.isInSet(c);)(a||(a=[])).push(d),c=d.removeFromSet(c)}else r?r.isInSet(s.marks)&&(a=[r]):a=s.marks;if(a&&a.length){let c=Math.min(l+s.nodeSize,t);for(let d=0;d<a.length;d++){let u=a[d],h;for(let f=0;f<o.length;f++){let p=o[f];p.step==i-1&&u.eq(o[f].style)&&(h=p)}h?(h.to=c,h.step=i):o.push({style:u,from:Math.max(l,e),to:c,step:i})}}}),o.forEach(s=>n.step(new xe(s.from,s.to,s.style)))}function ar(n,e,t,r=t.contentMatch,o=!0){let i=n.doc.nodeAt(e),s=[],l=e+1;for(let a=0;a<i.childCount;a++){let c=i.child(a),d=l+c.nodeSize,u=r.matchType(c.type);if(!u)s.push(new ee(l,d,M.empty));else{r=u;for(let h=0;h<c.marks.length;h++)t.allowsMarkType(c.marks[h].type)||n.step(new xe(l,d,c.marks[h]));if(o&&c.isText&&t.whitespace!="pre"){let h,f=/\r?\n|\r/g,p;for(;h=f.exec(c.text);)p||(p=new M(v.from(t.schema.text(" ",t.allowedMarks(c.marks))),0,0)),s.push(new ee(l+h.index,l+h.index+h[0].length,p))}}l=d}if(!r.validEnd){let a=r.fillBefore(v.empty,!0);n.replace(l,l,new M(a,0,0))}for(let a=s.length-1;a>=0;a--)n.step(s[a])}function Ks(n,e,t){return(e==0||n.canReplace(e,n.childCount))&&(t==n.childCount||n.canReplace(0,t))}function $t(n){let t=n.parent.content.cutByIndex(n.startIndex,n.endIndex);for(let r=n.depth,o=0,i=0;;--r){let s=n.$from.node(r),l=n.$from.index(r)+o,a=n.$to.indexAfter(r)-i;if(r<n.depth&&s.canReplace(l,a,t))return r;if(r==0||s.type.spec.isolating||!Ks(s,l,a))break;l&&(o=1),a<s.childCount&&(i=1)}return null}function Ys(n,e,t){let{$from:r,$to:o,depth:i}=e,s=r.before(i+1),l=o.after(i+1),a=s,c=l,d=v.empty,u=0;for(let p=i,g=!1;p>t;p--)g||r.index(p)>0?(g=!0,d=v.from(r.node(p).copy(d)),u++):a--;let h=v.empty,f=0;for(let p=i,g=!1;p>t;p--)g||o.after(p+1)<o.end(p)?(g=!0,h=v.from(o.node(p).copy(h)),f++):c++;n.step(new G(a,c,s,l,new M(d.append(h),u,f),d.size-u,!0))}function cr(n,e,t=null,r=n){let o=Gs(n,e),i=o&&Xs(r,e);return i?o.map(_r).concat({type:e,attrs:t}).concat(i.map(_r)):null}function _r(n){return{type:n,attrs:null}}function Gs(n,e){let{parent:t,startIndex:r,endIndex:o}=n,i=t.contentMatchAt(r).findWrapping(e);if(!i)return null;let s=i.length?i[0]:e;return t.canReplaceWith(r,o,s)?i:null}function Xs(n,e){let{parent:t,startIndex:r,endIndex:o}=n,i=t.child(r),s=e.contentMatch.findWrapping(i.type);if(!s)return null;let a=(s.length?s[s.length-1]:e).contentMatch;for(let c=r;a&&c<o;c++)a=a.matchType(t.child(c).type);return!a||!a.validEnd?null:s}function Zs(n,e,t){let r=v.empty;for(let s=t.length-1;s>=0;s--){if(r.size){let l=t[s].type.contentMatch.matchFragment(r);if(!l||!l.validEnd)throw new RangeError("Wrapper type given to Transform.wrap does not form valid content of its parent wrapper")}r=v.from(t[s].type.create(t[s].attrs,r))}let o=e.start,i=e.end;n.step(new G(o,i,o,i,new M(r,0,0),t.length,!0))}function Qs(n,e,t,r,o){if(!r.isTextblock)throw new RangeError("Type given to setBlockType should be a textblock");let i=n.steps.length;n.doc.nodesBetween(e,t,(s,l)=>{let a=typeof o=="function"?o(s):o;if(s.isTextblock&&!s.hasMarkup(r,a)&&el(n.doc,n.mapping.slice(i).map(l),r)){let c=null;if(r.schema.linebreakReplacement){let f=r.whitespace=="pre",p=!!r.contentMatch.matchType(r.schema.linebreakReplacement);f&&!p?c=!1:!f&&p&&(c=!0)}c===!1&&ai(n,s,l,i),ar(n,n.mapping.slice(i).map(l,1),r,void 0,c===null);let d=n.mapping.slice(i),u=d.map(l,1),h=d.map(l+s.nodeSize,1);return n.step(new G(u,h,u+1,h-1,new M(v.from(r.create(a,null,s.marks)),0,0),1,!0)),c===!0&&li(n,s,l,i),!1}})}function li(n,e,t,r){e.forEach((o,i)=>{if(o.isText){let s,l=/\r?\n|\r/g;for(;s=l.exec(o.text);){let a=n.mapping.slice(r).map(t+1+i+s.index);n.replaceWith(a,a+1,e.type.schema.linebreakReplacement.create())}}})}function ai(n,e,t,r){e.forEach((o,i)=>{if(o.type==o.type.schema.linebreakReplacement){let s=n.mapping.slice(r).map(t+1+i);n.replaceWith(s,s+1,e.type.schema.text(`
`))}})}function el(n,e,t){let r=n.resolve(e),o=r.index();return r.parent.canReplaceWith(o,o+1,t)}function tl(n,e,t,r,o){let i=n.doc.nodeAt(e);if(!i)throw new RangeError("No node at given position");t||(t=i.type);let s=t.create(r,null,o||i.marks);if(i.isLeaf)return n.replaceWith(e,e+i.nodeSize,s);if(!t.validContent(i.content))throw new RangeError("Invalid content for node type "+t.name);n.step(new G(e,e+i.nodeSize,e+1,e+i.nodeSize-1,new M(v.from(s),0,0),1,!0))}function Tt(n,e,t=1,r){let o=n.resolve(e),i=o.depth-t,s=r&&r[r.length-1]||o.parent;if(i<0||o.parent.type.spec.isolating||!o.parent.canReplace(o.index(),o.parent.childCount)||!s.type.validContent(o.parent.content.cutByIndex(o.index(),o.parent.childCount)))return!1;for(let c=o.depth-1,d=t-2;c>i;c--,d--){let u=o.node(c),h=o.index(c);if(u.type.spec.isolating)return!1;let f=u.content.cutByIndex(h,u.childCount),p=r&&r[d+1];p&&(f=f.replaceChild(0,p.type.create(p.attrs)));let g=r&&r[d]||u;if(!u.canReplace(h+1,u.childCount)||!g.type.validContent(f))return!1}let l=o.indexAfter(i),a=r&&r[0];return o.node(i).canReplaceWith(l,l,a?a.type:o.node(i+1).type)}function nl(n,e,t=1,r){let o=n.doc.resolve(e),i=v.empty,s=v.empty;for(let l=o.depth,a=o.depth-t,c=t-1;l>a;l--,c--){i=v.from(o.node(l).copy(i));let d=r&&r[c];s=v.from(d?d.type.create(d.attrs,s):o.node(l).copy(s))}n.step(new ee(e,e,new M(i.append(s),t,t),!0))}function kn(n,e){let t=n.resolve(e),r=t.index();return ol(t.nodeBefore,t.nodeAfter)&&t.parent.canReplace(r,r+1)}function rl(n,e){e.content.size||n.type.compatibleContent(e.type);let t=n.contentMatchAt(n.childCount),{linebreakReplacement:r}=n.type.schema;for(let o=0;o<e.childCount;o++){let i=e.child(o),s=i.type==r?n.type.schema.nodes.text:i.type;if(t=t.matchType(s),!t||!n.type.allowsMarks(i.marks))return!1}return t.validEnd}function ol(n,e){return!!(n&&e&&!n.isLeaf&&rl(n,e))}function il(n,e,t){let r=null,{linebreakReplacement:o}=n.doc.type.schema,i=n.doc.resolve(e-t),s=i.node().type;if(o&&s.inlineContent){let d=s.whitespace=="pre",u=!!s.contentMatch.matchType(o);d&&!u?r=!1:!d&&u&&(r=!0)}let l=n.steps.length;if(r===!1){let d=n.doc.resolve(e+t);ai(n,d.node(),d.before(),l)}s.inlineContent&&ar(n,e+t-1,s,i.node().contentMatchAt(i.index()),r==null);let a=n.mapping.slice(l),c=a.map(e-t);if(n.step(new ee(c,a.map(e+t,-1),M.empty,!0)),r===!0){let d=n.doc.resolve(c);li(n,d.node(),d.before(),n.steps.length)}return n}function sl(n,e,t){let r=n.resolve(e);if(r.parent.canReplaceWith(r.index(),r.index(),t))return e;if(r.parentOffset==0)for(let o=r.depth-1;o>=0;o--){let i=r.index(o);if(r.node(o).canReplaceWith(i,i,t))return r.before(o+1);if(i>0)return null}if(r.parentOffset==r.parent.content.size)for(let o=r.depth-1;o>=0;o--){let i=r.indexAfter(o);if(r.node(o).canReplaceWith(i,i,t))return r.after(o+1);if(i<r.node(o).childCount)return null}return null}function ci(n,e,t){let r=n.resolve(e);if(!t.content.size)return e;let o=t.content;for(let i=0;i<t.openStart;i++)o=o.firstChild.content;for(let i=1;i<=(t.openStart==0&&t.size?2:1);i++)for(let s=r.depth;s>=0;s--){let l=s==r.depth?0:r.pos<=(r.start(s+1)+r.end(s+1))/2?-1:1,a=r.index(s)+(l>0?1:0),c=r.node(s),d=!1;if(i==1)d=c.canReplace(a,a,o);else{let u=c.contentMatchAt(a).findWrapping(o.firstChild.type);d=u&&c.canReplaceWith(a,a,u[0])}if(d)return l==0?r.pos:l<0?r.before(s+1):r.after(s+1)}return null}function dr(n,e,t=e,r=M.empty){if(e==t&&!r.size)return null;let o=n.resolve(e),i=n.resolve(t);return di(o,i,r)?new ee(e,t,r):new ll(o,i,r).fit()}function di(n,e,t){return!t.openStart&&!t.openEnd&&n.start()==e.start()&&n.parent.canReplace(n.index(),e.index(),t.content)}class ll{constructor(e,t,r){this.$from=e,this.$to=t,this.unplaced=r,this.frontier=[],this.placed=v.empty;for(let o=0;o<=e.depth;o++){let i=e.node(o);this.frontier.push({type:i.type,match:i.contentMatchAt(e.indexAfter(o))})}for(let o=e.depth;o>0;o--)this.placed=v.from(e.node(o).copy(this.placed))}get depth(){return this.frontier.length-1}fit(){for(;this.unplaced.size;){let c=this.findFittable();c?this.placeNodes(c):this.openMore()||this.dropNode()}let e=this.mustMoveInline(),t=this.placed.size-this.depth-this.$from.depth,r=this.$from,o=this.close(e<0?this.$to:r.doc.resolve(e));if(!o)return null;let i=this.placed,s=r.depth,l=o.depth;for(;s&&l&&i.childCount==1;)i=i.firstChild.content,s--,l--;let a=new M(i,s,l);return e>-1?new G(r.pos,e,this.$to.pos,this.$to.end(),a,t):a.size||r.pos!=this.$to.pos?new ee(r.pos,o.pos,a):null}findFittable(){let e=this.unplaced.openStart;for(let t=this.unplaced.content,r=0,o=this.unplaced.openEnd;r<e;r++){let i=t.firstChild;if(t.childCount>1&&(o=0),i.type.spec.isolating&&o<=r){e=r;break}t=i.content}for(let t=1;t<=2;t++)for(let r=t==1?e:this.unplaced.openStart;r>=0;r--){let o,i=null;r?(i=Tn(this.unplaced.content,r-1).firstChild,o=i.content):o=this.unplaced.content;let s=o.firstChild;for(let l=this.depth;l>=0;l--){let{type:a,match:c}=this.frontier[l],d,u=null;if(t==1&&(s?c.matchType(s.type)||(u=c.fillBefore(v.from(s),!1)):i&&a.compatibleContent(i.type)))return{sliceDepth:r,frontierDepth:l,parent:i,inject:u};if(t==2&&s&&(d=c.findWrapping(s.type)))return{sliceDepth:r,frontierDepth:l,parent:i,wrap:d};if(i&&c.matchType(i.type))break}}}openMore(){let{content:e,openStart:t,openEnd:r}=this.unplaced,o=Tn(e,t);return!o.childCount||o.firstChild.isLeaf?!1:(this.unplaced=new M(e,t+1,Math.max(r,o.size+t>=e.size-r?t+1:0)),!0)}dropNode(){let{content:e,openStart:t,openEnd:r}=this.unplaced,o=Tn(e,t);if(o.childCount<=1&&t>0){let i=e.size-t<=t+o.size;this.unplaced=new M(St(e,t-1,1),t-1,i?t-1:r)}else this.unplaced=new M(St(e,t,1),t,r)}placeNodes({sliceDepth:e,frontierDepth:t,parent:r,inject:o,wrap:i}){for(;this.depth>t;)this.closeFrontierNode();if(i)for(let g=0;g<i.length;g++)this.openFrontierNode(i[g]);let s=this.unplaced,l=r?r.content:s.content,a=s.openStart-e,c=0,d=[],{match:u,type:h}=this.frontier[t];if(o){for(let g=0;g<o.childCount;g++)d.push(o.child(g));u=u.matchFragment(o)}let f=l.size+e-(s.content.size-s.openEnd);for(;c<l.childCount;){let g=l.child(c),b=u.matchType(g.type);if(!b)break;c++,(c>1||a==0||g.content.size)&&(u=b,d.push(ui(g.mark(h.allowedMarks(g.marks)),c==1?a:0,c==l.childCount?f:-1)))}let p=c==l.childCount;p||(f=-1),this.placed=Ct(this.placed,t,v.from(d)),this.frontier[t].match=u,p&&f<0&&r&&r.type==this.frontier[this.depth].type&&this.frontier.length>1&&this.closeFrontierNode();for(let g=0,b=l;g<f;g++){let x=b.lastChild;this.frontier.push({type:x.type,match:x.contentMatchAt(x.childCount)}),b=x.content}this.unplaced=p?e==0?M.empty:new M(St(s.content,e-1,1),e-1,f<0?s.openEnd:e-1):new M(St(s.content,e,c),s.openStart,s.openEnd)}mustMoveInline(){if(!this.$to.parent.isTextblock)return-1;let e=this.frontier[this.depth],t;if(!e.type.isTextblock||!Dn(this.$to,this.$to.depth,e.type,e.match,!1)||this.$to.depth==this.depth&&(t=this.findCloseLevel(this.$to))&&t.depth==this.depth)return-1;let{depth:r}=this.$to,o=this.$to.after(r);for(;r>1&&o==this.$to.end(--r);)++o;return o}findCloseLevel(e){e:for(let t=Math.min(this.depth,e.depth);t>=0;t--){let{match:r,type:o}=this.frontier[t],i=t<e.depth&&e.end(t+1)==e.pos+(e.depth-(t+1)),s=Dn(e,t,o,r,i);if(s){for(let l=t-1;l>=0;l--){let{match:a,type:c}=this.frontier[l],d=Dn(e,l,c,a,!0);if(!d||d.childCount)continue e}return{depth:t,fit:s,move:i?e.doc.resolve(e.after(t+1)):e}}}}close(e){let t=this.findCloseLevel(e);if(!t)return null;for(;this.depth>t.depth;)this.closeFrontierNode();t.fit.childCount&&(this.placed=Ct(this.placed,t.depth,t.fit)),e=t.move;for(let r=t.depth+1;r<=e.depth;r++){let o=e.node(r),i=o.type.contentMatch.fillBefore(o.content,!0,e.index(r));this.openFrontierNode(o.type,o.attrs,i)}return e}openFrontierNode(e,t=null,r){let o=this.frontier[this.depth];o.match=o.match.matchType(e),this.placed=Ct(this.placed,this.depth,v.from(e.create(t,r))),this.frontier.push({type:e,match:e.contentMatch})}closeFrontierNode(){let t=this.frontier.pop().match.fillBefore(v.empty,!0);t.childCount&&(this.placed=Ct(this.placed,this.frontier.length,t))}}function St(n,e,t){return e==0?n.cutByIndex(t,n.childCount):n.replaceChild(0,n.firstChild.copy(St(n.firstChild.content,e-1,t)))}function Ct(n,e,t){return e==0?n.append(t):n.replaceChild(n.childCount-1,n.lastChild.copy(Ct(n.lastChild.content,e-1,t)))}function Tn(n,e){for(let t=0;t<e;t++)n=n.firstChild.content;return n}function ui(n,e,t){if(e<=0)return n;let r=n.content;return e>1&&(r=r.replaceChild(0,ui(r.firstChild,e-1,r.childCount==1?t-1:0))),e>0&&(r=n.type.contentMatch.fillBefore(r).append(r),t<=0&&(r=r.append(n.type.contentMatch.matchFragment(r).fillBefore(v.empty,!0)))),n.copy(r)}function Dn(n,e,t,r,o){let i=n.node(e),s=o?n.indexAfter(e):n.index(e);if(s==i.childCount&&!t.compatibleContent(i.type))return null;let l=r.fillBefore(i.content,!0,s);return l&&!al(t,i.content,s)?l:null}function al(n,e,t){for(let r=t;r<e.childCount;r++)if(!n.allowsMarks(e.child(r).marks))return!0;return!1}function cl(n){return n.spec.defining||n.spec.definingForContent}function dl(n,e,t,r){if(!r.size)return n.deleteRange(e,t);let o=n.doc.resolve(e),i=n.doc.resolve(t);if(di(o,i,r))return n.step(new ee(e,t,r));let s=fi(o,i);s[s.length-1]==0&&s.pop();let l=-(o.depth+1);s.unshift(l);for(let h=o.depth,f=o.pos-1;h>0;h--,f--){let p=o.node(h).type.spec;if(p.defining||p.definingAsContext||p.isolating)break;s.indexOf(h)>-1?l=h:o.before(h)==f&&s.splice(1,0,-h)}let a=s.indexOf(l),c=[],d=r.openStart;for(let h=r.content,f=0;;f++){let p=h.firstChild;if(c.push(p),f==r.openStart)break;h=p.content}for(let h=d-1;h>=0;h--){let f=c[h],p=cl(f.type);if(p&&!f.sameMarkup(o.node(Math.abs(l)-1)))d=h;else if(p||!f.type.isTextblock)break}for(let h=r.openStart;h>=0;h--){let f=(h+d+1)%(r.openStart+1),p=c[f];if(p)for(let g=0;g<s.length;g++){let b=s[(g+a)%s.length],x=!0;b<0&&(x=!1,b=-b);let w=o.node(b-1),k=o.index(b-1);if(w.canReplaceWith(k,k,p.type,p.marks))return n.replace(o.before(b),x?i.after(b):t,new M(hi(r.content,0,r.openStart,f),f,r.openEnd))}}let u=n.steps.length;for(let h=s.length-1;h>=0&&(n.replace(e,t,r),!(n.steps.length>u));h--){let f=s[h];f<0||(e=o.before(f),t=i.after(f))}}function hi(n,e,t,r,o){if(e<t){let i=n.firstChild;n=n.replaceChild(0,i.copy(hi(i.content,e+1,t,r,i)))}if(e>r){let i=o.contentMatchAt(0),s=i.fillBefore(n).append(n);n=s.append(i.matchFragment(s).fillBefore(v.empty,!0))}return n}function ul(n,e,t,r){if(!r.isInline&&e==t&&n.doc.resolve(e).parent.content.size){let o=sl(n.doc,e,r.type);o!=null&&(e=t=o)}n.replaceRange(e,t,new M(v.from(r),0,0))}function hl(n,e,t){let r=n.doc.resolve(e),o=n.doc.resolve(t),i=fi(r,o);for(let s=0;s<i.length;s++){let l=i[s],a=s==i.length-1;if(a&&l==0||r.node(l).type.contentMatch.validEnd)return n.delete(r.start(l),o.end(l));if(l>0&&(a||r.node(l-1).canReplace(r.index(l-1),o.indexAfter(l-1))))return n.delete(r.before(l),o.after(l))}for(let s=1;s<=r.depth&&s<=o.depth;s++)if(e-r.start(s)==r.depth-s&&t>r.end(s)&&o.end(s)-t!=o.depth-s&&r.start(s-1)==o.start(s-1)&&r.node(s-1).canReplace(r.index(s-1),o.index(s-1)))return n.delete(r.before(s),t);n.delete(e,t)}function fi(n,e){let t=[],r=Math.min(n.depth,e.depth);for(let o=r;o>=0;o--){let i=n.start(o);if(i<n.pos-(n.depth-o)||e.end(o)>e.pos+(e.depth-o)||n.node(o).type.spec.isolating||e.node(o).type.spec.isolating)break;(i==e.start(o)||o==n.depth&&o==e.depth&&n.parent.inlineContent&&e.parent.inlineContent&&o&&e.start(o-1)==i-1)&&t.push(o)}return t}class ft extends te{constructor(e,t,r){super(),this.pos=e,this.attr=t,this.value=r}apply(e){let t=e.nodeAt(this.pos);if(!t)return F.fail("No node at attribute step's position");let r=Object.create(null);for(let i in t.attrs)r[i]=t.attrs[i];r[this.attr]=this.value;let o=t.type.create(r,null,t.marks);return F.fromReplace(e,this.pos,this.pos+1,new M(v.from(o),0,t.isLeaf?0:1))}getMap(){return ce.empty}invert(e){return new ft(this.pos,this.attr,e.nodeAt(this.pos).attrs[this.attr])}map(e){let t=e.mapResult(this.pos,1);return t.deletedAfter?null:new ft(t.pos,this.attr,this.value)}toJSON(){return{stepType:"attr",pos:this.pos,attr:this.attr,value:this.value}}static fromJSON(e,t){if(typeof t.pos!="number"||typeof t.attr!="string")throw new RangeError("Invalid input for AttrStep.fromJSON");return new ft(t.pos,t.attr,t.value)}}te.jsonID("attr",ft);class Lt extends te{constructor(e,t){super(),this.attr=e,this.value=t}apply(e){let t=Object.create(null);for(let o in e.attrs)t[o]=e.attrs[o];t[this.attr]=this.value;let r=e.type.create(t,e.content,e.marks);return F.ok(r)}getMap(){return ce.empty}invert(e){return new Lt(this.attr,e.attrs[this.attr])}map(e){return this}toJSON(){return{stepType:"docAttr",attr:this.attr,value:this.value}}static fromJSON(e,t){if(typeof t.attr!="string")throw new RangeError("Invalid input for DocAttrStep.fromJSON");return new Lt(t.attr,t.value)}}te.jsonID("docAttr",Lt);let gt=class extends Error{};gt=function n(e){let t=Error.call(this,e);return t.__proto__=n.prototype,t};gt.prototype=Object.create(Error.prototype);gt.prototype.constructor=gt;gt.prototype.name="TransformError";class fl{constructor(e){this.doc=e,this.steps=[],this.docs=[],this.mapping=new Pt}get before(){return this.docs.length?this.docs[0]:this.doc}step(e){let t=this.maybeStep(e);if(t.failed)throw new gt(t.failed);return this}maybeStep(e){let t=e.apply(this.doc);return t.failed||this.addStep(e,t.doc),t}get docChanged(){return this.steps.length>0}changedRange(){let e=1e9,t=-1e9;for(let r=0;r<this.mapping.maps.length;r++){let o=this.mapping.maps[r];r&&(e=o.map(e,1),t=o.map(t,-1)),o.forEach((i,s,l,a)=>{e=Math.min(e,l),t=Math.max(t,a)})}return e==1e9?null:{from:e,to:t}}addStep(e,t){this.docs.push(this.doc),this.steps.push(e),this.mapping.appendMap(e.getMap()),this.doc=t}replace(e,t=e,r=M.empty){let o=dr(this.doc,e,t,r);return o&&this.step(o),this}replaceWith(e,t,r){return this.replace(e,t,new M(v.from(r),0,0))}delete(e,t){return this.replace(e,t,M.empty)}insert(e,t){return this.replaceWith(e,e,t)}replaceRange(e,t,r){return dl(this,e,t,r),this}replaceRangeWith(e,t,r){return ul(this,e,t,r),this}deleteRange(e,t){return hl(this,e,t),this}lift(e,t){return Ys(this,e,t),this}join(e,t=1){return il(this,e,t),this}wrap(e,t){return Zs(this,e,t),this}setBlockType(e,t=e,r,o=null){return Qs(this,e,t,r,o),this}setNodeMarkup(e,t,r=null,o){return tl(this,e,t,r,o),this}setNodeAttribute(e,t,r){return this.step(new ft(e,t,r)),this}setDocAttribute(e,t){return this.step(new Lt(e,t)),this}addNodeMark(e,t){return this.step(new je(e,t)),this}removeNodeMark(e,t){let r=this.doc.nodeAt(e);if(!r)throw new RangeError("No node at position "+e);if(t instanceof B)t.isInSet(r.marks)&&this.step(new nt(e,t));else{let o=r.marks,i,s=[];for(;i=t.isInSet(o);)s.push(new nt(e,i)),o=i.removeFromSet(o);for(let l=s.length-1;l>=0;l--)this.step(s[l])}return this}split(e,t=1,r){return nl(this,e,t,r),this}addMark(e,t,r){return Js(this,e,t,r),this}removeMark(e,t,r){return Us(this,e,t,r),this}clearIncompatible(e,t,r){return ar(this,e,t,r),this}}const An=Object.create(null);class I{constructor(e,t,r){this.$anchor=e,this.$head=t,this.ranges=r||[new pl(e.min(t),e.max(t))]}get anchor(){return this.$anchor.pos}get head(){return this.$head.pos}get from(){return this.$from.pos}get to(){return this.$to.pos}get $from(){return this.ranges[0].$from}get $to(){return this.ranges[0].$to}get empty(){let e=this.ranges;for(let t=0;t<e.length;t++)if(e[t].$from.pos!=e[t].$to.pos)return!1;return!0}content(){return this.$from.doc.slice(this.from,this.to,!0)}replace(e,t=M.empty){let r=t.content.lastChild,o=null;for(let l=0;l<t.openEnd;l++)o=r,r=r.lastChild;let i=e.steps.length,s=this.ranges;for(let l=0;l<s.length;l++){let{$from:a,$to:c}=s[l],d=e.mapping.slice(i);e.replaceRange(d.map(a.pos),d.map(c.pos),l?M.empty:t),l==0&&Hr(e,i,(r?r.isInline:o&&o.isTextblock)?-1:1)}}replaceWith(e,t){let r=e.steps.length,o=this.ranges;for(let i=0;i<o.length;i++){let{$from:s,$to:l}=o[i],a=e.mapping.slice(r),c=a.map(s.pos),d=a.map(l.pos);i?e.deleteRange(c,d):(e.replaceRangeWith(c,d,t),Hr(e,r,t.isInline?-1:1))}}static findFrom(e,t,r=!1){let o=e.parent.inlineContent?new E(e):ct(e.node(0),e.parent,e.pos,e.index(),t,r);if(o)return o;for(let i=e.depth-1;i>=0;i--){let s=t<0?ct(e.node(0),e.node(i),e.before(i+1),e.index(i),t,r):ct(e.node(0),e.node(i),e.after(i+1),e.index(i)+1,t,r);if(s)return s}return null}static near(e,t=1){return this.findFrom(e,t)||this.findFrom(e,-t)||new se(e.node(0))}static atStart(e){return ct(e,e,0,0,1)||new se(e)}static atEnd(e){return ct(e,e,e.content.size,e.childCount,-1)||new se(e)}static fromJSON(e,t){if(!t||!t.type)throw new RangeError("Invalid input for Selection.fromJSON");let r=An[t.type];if(!r)throw new RangeError(`No selection type ${t.type} defined`);return r.fromJSON(e,t)}static jsonID(e,t){if(e in An)throw new RangeError("Duplicate use of selection JSON ID "+e);return An[e]=t,t.prototype.jsonID=e,t}getBookmark(){return E.between(this.$anchor,this.$head).getBookmark()}}I.prototype.visible=!0;class pl{constructor(e,t){this.$from=e,this.$to=t}}let Wr=!1;function qr(n){!Wr&&!n.parent.inlineContent&&(Wr=!0,console.warn("TextSelection endpoint not pointing into a node with inline content ("+n.parent.type.name+")"))}class E extends I{constructor(e,t=e){qr(e),qr(t),super(e,t)}get $cursor(){return this.$anchor.pos==this.$head.pos?this.$head:null}map(e,t){let r=e.resolve(t.map(this.head));if(!r.parent.inlineContent)return I.near(r);let o=e.resolve(t.map(this.anchor));return new E(o.parent.inlineContent?o:r,r)}replace(e,t=M.empty){if(super.replace(e,t),t==M.empty){let r=this.$from.marksAcross(this.$to);r&&e.ensureMarks(r)}}eq(e){return e instanceof E&&e.anchor==this.anchor&&e.head==this.head}getBookmark(){return new yn(this.anchor,this.head)}toJSON(){return{type:"text",anchor:this.anchor,head:this.head}}static fromJSON(e,t){if(typeof t.anchor!="number"||typeof t.head!="number")throw new RangeError("Invalid input for TextSelection.fromJSON");return new E(e.resolve(t.anchor),e.resolve(t.head))}static create(e,t,r=t){let o=e.resolve(t);return new this(o,r==t?o:e.resolve(r))}static between(e,t,r){let o=e.pos-t.pos;if((!r||o)&&(r=o>=0?1:-1),!t.parent.inlineContent){let i=I.findFrom(t,r,!0)||I.findFrom(t,-r,!0);if(i)t=i.$head;else return I.near(t,r)}return e.parent.inlineContent||(o==0?e=t:(e=(I.findFrom(e,-r,!0)||I.findFrom(e,r,!0)).$anchor,e.pos<t.pos!=o<0&&(e=t))),new E(e,t)}}I.jsonID("text",E);class yn{constructor(e,t){this.anchor=e,this.head=t}map(e){return new yn(e.map(this.anchor),e.map(this.head))}resolve(e){return E.between(e.resolve(this.anchor),e.resolve(this.head))}}class A extends I{constructor(e){let t=e.nodeAfter,r=e.node(0).resolve(e.pos+t.nodeSize);super(e,r),this.node=t}map(e,t){let{deleted:r,pos:o}=t.mapResult(this.anchor),i=e.resolve(o);return r?I.near(i):new A(i)}content(){return new M(v.from(this.node),0,0)}eq(e){return e instanceof A&&e.anchor==this.anchor}toJSON(){return{type:"node",anchor:this.anchor}}getBookmark(){return new ur(this.anchor)}static fromJSON(e,t){if(typeof t.anchor!="number")throw new RangeError("Invalid input for NodeSelection.fromJSON");return new A(e.resolve(t.anchor))}static create(e,t){return new A(e.resolve(t))}static isSelectable(e){return!e.isText&&e.type.spec.selectable!==!1}}A.prototype.visible=!1;I.jsonID("node",A);class ur{constructor(e){this.anchor=e}map(e){let{deleted:t,pos:r}=e.mapResult(this.anchor);return t?new yn(r,r):new ur(r)}resolve(e){let t=e.resolve(this.anchor),r=t.nodeAfter;return r&&A.isSelectable(r)?new A(t):I.near(t)}}class se extends I{constructor(e){super(e.resolve(0),e.resolve(e.content.size))}replace(e,t=M.empty){if(t==M.empty){e.delete(0,e.doc.content.size);let r=I.atStart(e.doc);r.eq(e.selection)||e.setSelection(r)}else super.replace(e,t)}toJSON(){return{type:"all"}}static fromJSON(e){return new se(e)}map(e){return new se(e)}eq(e){return e instanceof se}getBookmark(){return ml}}I.jsonID("all",se);const ml={map(){return this},resolve(n){return new se(n)}};function ct(n,e,t,r,o,i=!1){if(e.inlineContent)return E.create(n,t);for(let s=r-(o>0?0:1);o>0?s<e.childCount:s>=0;s+=o){let l=e.child(s);if(l.isAtom){if(!i&&A.isSelectable(l))return A.create(n,t-(o<0?l.nodeSize:0))}else{let a=ct(n,l,t+o,o<0?l.childCount:0,o,i);if(a)return a}t+=l.nodeSize*o}return null}function Hr(n,e,t){let r=n.steps.length-1;if(r<e)return;let o=n.steps[r];if(!(o instanceof ee||o instanceof G))return;let i=n.mapping.maps[r],s;i.forEach((l,a,c,d)=>{s==null&&(s=d)}),n.setSelection(I.near(n.doc.resolve(s),t))}const Jr=1,Zt=2,Ur=4;class gl extends fl{constructor(e){super(e.doc),this.curSelectionFor=0,this.updated=0,this.meta=Object.create(null),this.time=Date.now(),this.curSelection=e.selection,this.storedMarks=e.storedMarks}get selection(){return this.curSelectionFor<this.steps.length&&(this.curSelection=this.curSelection.map(this.doc,this.mapping.slice(this.curSelectionFor)),this.curSelectionFor=this.steps.length),this.curSelection}setSelection(e){if(e.$from.doc!=this.doc)throw new RangeError("Selection passed to setSelection must point at the current document");return this.curSelection=e,this.curSelectionFor=this.steps.length,this.updated=(this.updated|Jr)&~Zt,this.storedMarks=null,this}get selectionSet(){return(this.updated&Jr)>0}setStoredMarks(e){return this.storedMarks=e,this.updated|=Zt,this}ensureMarks(e){return B.sameSet(this.storedMarks||this.selection.$from.marks(),e)||this.setStoredMarks(e),this}addStoredMark(e){return this.ensureMarks(e.addToSet(this.storedMarks||this.selection.$head.marks()))}removeStoredMark(e){return this.ensureMarks(e.removeFromSet(this.storedMarks||this.selection.$head.marks()))}get storedMarksSet(){return(this.updated&Zt)>0}addStep(e,t){super.addStep(e,t),this.updated=this.updated&~Zt,this.storedMarks=null}setTime(e){return this.time=e,this}replaceSelection(e){return this.selection.replace(this,e),this}replaceSelectionWith(e,t=!0){let r=this.selection;return t&&(e=e.mark(this.storedMarks||(r.empty?r.$from.marks():r.$from.marksAcross(r.$to)||B.none))),r.replaceWith(this,e),this}deleteSelection(){return this.selection.replace(this),this}insertText(e,t,r){let o=this.doc.type.schema;if(t==null)return e?this.replaceSelectionWith(o.text(e),!0):this.deleteSelection();{if(r==null&&(r=t),!e)return this.deleteRange(t,r);let i=this.storedMarks;if(!i){let s=this.doc.resolve(t);i=r==t?s.marks():s.marksAcross(this.doc.resolve(r))}return this.replaceRangeWith(t,r,o.text(e,i)),!this.selection.empty&&this.selection.to==t+e.length&&this.setSelection(I.near(this.selection.$to)),this}}setMeta(e,t){return this.meta[typeof e=="string"?e:e.key]=t,this}getMeta(e){return this.meta[typeof e=="string"?e:e.key]}get isGeneric(){for(let e in this.meta)return!1;return!0}scrollIntoView(){return this.updated|=Ur,this}get scrolledIntoView(){return(this.updated&Ur)>0}}function Kr(n,e){return!e||!n?n:n.bind(e)}class Mt{constructor(e,t,r){this.name=e,this.init=Kr(t.init,r),this.apply=Kr(t.apply,r)}}const bl=[new Mt("doc",{init(n){return n.doc||n.schema.topNodeType.createAndFill()},apply(n){return n.doc}}),new Mt("selection",{init(n,e){return n.selection||I.atStart(e.doc)},apply(n){return n.selection}}),new Mt("storedMarks",{init(n){return n.storedMarks||null},apply(n,e,t,r){return r.selection.$cursor?n.storedMarks:null}}),new Mt("scrollToSelection",{init(){return 0},apply(n,e){return n.scrolledIntoView?e+1:e}})];class En{constructor(e,t){this.schema=e,this.plugins=[],this.pluginsByKey=Object.create(null),this.fields=bl.slice(),t&&t.forEach(r=>{if(this.pluginsByKey[r.key])throw new RangeError("Adding different instances of a keyed plugin ("+r.key+")");this.plugins.push(r),this.pluginsByKey[r.key]=r,r.spec.state&&this.fields.push(new Mt(r.key,r.spec.state,r))})}}class ut{constructor(e){this.config=e}get schema(){return this.config.schema}get plugins(){return this.config.plugins}apply(e){return this.applyTransaction(e).state}filterTransaction(e,t=-1){for(let r=0;r<this.config.plugins.length;r++)if(r!=t){let o=this.config.plugins[r];if(o.spec.filterTransaction&&!o.spec.filterTransaction.call(o,e,this))return!1}return!0}applyTransaction(e){if(!this.filterTransaction(e))return{state:this,transactions:[]};let t=[e],r=this.applyInner(e),o=null;for(;;){let i=!1;for(let s=0;s<this.config.plugins.length;s++){let l=this.config.plugins[s];if(l.spec.appendTransaction){let a=o?o[s].n:0,c=o?o[s].state:this,d=a<t.length&&l.spec.appendTransaction.call(l,a?t.slice(a):t,c,r);if(d&&r.filterTransaction(d,s)){if(d.setMeta("appendedTransaction",e),!o){o=[];for(let u=0;u<this.config.plugins.length;u++)o.push(u<s?{state:r,n:t.length}:{state:this,n:0})}t.push(d),r=r.applyInner(d),i=!0}o&&(o[s]={state:r,n:t.length})}}if(!i)return{state:r,transactions:t}}}applyInner(e){if(!e.before.eq(this.doc))throw new RangeError("Applying a mismatched transaction");let t=new ut(this.config),r=this.config.fields;for(let o=0;o<r.length;o++){let i=r[o];t[i.name]=i.apply(e,this[i.name],this,t)}return t}get tr(){return new gl(this)}static create(e){let t=new En(e.doc?e.doc.type.schema:e.schema,e.plugins),r=new ut(t);for(let o=0;o<t.fields.length;o++)r[t.fields[o].name]=t.fields[o].init(e,r);return r}reconfigure(e){let t=new En(this.schema,e.plugins),r=t.fields,o=new ut(t);for(let i=0;i<r.length;i++){let s=r[i].name;o[s]=this.hasOwnProperty(s)?this[s]:r[i].init(e,o)}return o}toJSON(e){let t={doc:this.doc.toJSON(),selection:this.selection.toJSON()};if(this.storedMarks&&(t.storedMarks=this.storedMarks.map(r=>r.toJSON())),e&&typeof e=="object")for(let r in e){if(r=="doc"||r=="selection")throw new RangeError("The JSON fields `doc` and `selection` are reserved");let o=e[r],i=o.spec.state;i&&i.toJSON&&(t[r]=i.toJSON.call(o,this[o.key]))}return t}static fromJSON(e,t,r){if(!t)throw new RangeError("Invalid input for EditorState.fromJSON");if(!e.schema)throw new RangeError("Required config field 'schema' missing");let o=new En(e.schema,e.plugins),i=new ut(o);return o.fields.forEach(s=>{if(s.name=="doc")i.doc=we.fromJSON(e.schema,t.doc);else if(s.name=="selection")i.selection=I.fromJSON(i.doc,t.selection);else if(s.name=="storedMarks")t.storedMarks&&(i.storedMarks=t.storedMarks.map(e.schema.markFromJSON));else{if(r)for(let l in r){let a=r[l],c=a.spec.state;if(a.key==s.name&&c&&c.fromJSON&&Object.prototype.hasOwnProperty.call(t,l)){i[s.name]=c.fromJSON.call(a,e,t[l],i);return}}i[s.name]=s.init(e,i)}}),i}}function pi(n,e,t){for(let r in n){let o=n[r];o instanceof Function?o=o.bind(e):r=="handleDOMEvents"&&(o=pi(o,e,{})),t[r]=o}return t}class ge{constructor(e){this.spec=e,this.props={},e.props&&pi(e.props,this,this.props),this.key=e.key?e.key.key:mi("plugin")}getState(e){return e[this.key]}}const Rn=Object.create(null);function mi(n){return n in Rn?n+"$"+ ++Rn[n]:(Rn[n]=0,n+"$")}class Ae{constructor(e="key"){this.key=mi(e)}get(e){return e.config.pluginsByKey[this.key]}getState(e){return e[this.key]}}const J=[];for(let n=0;n<256;++n)J.push((n+256).toString(16).slice(1));function kl(n,e=0){return(J[n[e+0]]+J[n[e+1]]+J[n[e+2]]+J[n[e+3]]+"-"+J[n[e+4]]+J[n[e+5]]+"-"+J[n[e+6]]+J[n[e+7]]+"-"+J[n[e+8]]+J[n[e+9]]+"-"+J[n[e+10]]+J[n[e+11]]+J[n[e+12]]+J[n[e+13]]+J[n[e+14]]+J[n[e+15]]).toLowerCase()}let In;const yl=new Uint8Array(16);function xl(){if(!In){if(typeof crypto>"u"||!crypto.getRandomValues)throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");In=crypto.getRandomValues.bind(crypto)}return In(yl)}const wl=typeof crypto<"u"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto),Yr={randomUUID:wl};function Fe(n,e,t){var o;if(Yr.randomUUID&&!n)return Yr.randomUUID();n=n||{};const r=n.random??((o=n.rng)==null?void 0:o.call(n))??xl();if(r.length<16)throw new Error("Random bytes length must be >= 16");return r[6]=r[6]&15|64,r[8]=r[8]&63|128,kl(r)}var qe={8:"Backspace",9:"Tab",10:"Enter",12:"NumLock",13:"Enter",16:"Shift",17:"Control",18:"Alt",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",44:"PrintScreen",45:"Insert",46:"Delete",59:";",61:"=",91:"Meta",92:"Meta",106:"*",107:"+",108:",",109:"-",110:".",111:"/",144:"NumLock",145:"ScrollLock",160:"Shift",161:"Shift",162:"Control",163:"Control",164:"Alt",165:"Alt",173:"-",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"},dn={48:")",49:"!",50:"@",51:"#",52:"$",53:"%",54:"^",55:"&",56:"*",57:"(",59:":",61:"+",173:"_",186:":",187:"+",188:"<",189:"_",190:">",191:"?",192:"~",219:"{",220:"|",221:"}",222:'"'},vl=typeof navigator<"u"&&/Mac/.test(navigator.platform),Sl=typeof navigator<"u"&&/MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);for(var K=0;K<10;K++)qe[48+K]=qe[96+K]=String(K);for(var K=1;K<=24;K++)qe[K+111]="F"+K;for(var K=65;K<=90;K++)qe[K]=String.fromCharCode(K+32),dn[K]=String.fromCharCode(K);for(var Bn in qe)dn.hasOwnProperty(Bn)||(dn[Bn]=qe[Bn]);function Cl(n){var e=vl&&n.metaKey&&n.shiftKey&&!n.ctrlKey&&!n.altKey||Sl&&n.shiftKey&&n.key&&n.key.length==1||n.key=="Unidentified",t=!e&&n.key||(n.shiftKey?dn:qe)[n.keyCode]||n.key||"Unidentified";return t=="Esc"&&(t="Escape"),t=="Del"&&(t="Delete"),t=="Left"&&(t="ArrowLeft"),t=="Up"&&(t="ArrowUp"),t=="Right"&&(t="ArrowRight"),t=="Down"&&(t="ArrowDown"),t}const Ml=typeof navigator<"u"&&/Mac|iP(hone|[oa]d)/.test(navigator.platform),Nl=typeof navigator<"u"&&/Win/.test(navigator.platform);function Ol(n){let e=n.split(/-(?!$)/),t=e[e.length-1];t=="Space"&&(t=" ");let r,o,i,s;for(let l=0;l<e.length-1;l++){let a=e[l];if(/^(cmd|meta|m)$/i.test(a))s=!0;else if(/^a(lt)?$/i.test(a))r=!0;else if(/^(c|ctrl|control)$/i.test(a))o=!0;else if(/^s(hift)?$/i.test(a))i=!0;else if(/^mod$/i.test(a))Ml?s=!0:o=!0;else throw new Error("Unrecognized modifier name: "+a)}return r&&(t="Alt-"+t),o&&(t="Ctrl-"+t),s&&(t="Meta-"+t),i&&(t="Shift-"+t),t}function Tl(n){let e=Object.create(null);for(let t in n)e[Ol(t)]=n[t];return e}function Pn(n,e,t=!0){return e.altKey&&(n="Alt-"+n),e.ctrlKey&&(n="Ctrl-"+n),e.metaKey&&(n="Meta-"+n),t&&e.shiftKey&&(n="Shift-"+n),n}function Dt(n){return new ge({props:{handleKeyDown:gi(n)}})}function gi(n){let e=Tl(n);return function(t,r){let o=Cl(r),i,s=e[Pn(o,r)];if(s&&s(t.state,t.dispatch,t))return!0;if(o.length==1&&o!=" "){if(r.shiftKey){let l=e[Pn(o,r,!1)];if(l&&l(t.state,t.dispatch,t))return!0}if((r.altKey||r.metaKey||r.ctrlKey)&&!(Nl&&r.ctrlKey&&r.altKey)&&(i=qe[r.keyCode])&&i!=o){let l=e[Pn(i,r)];if(l&&l(t.state,t.dispatch,t))return!0}}return!1}}const bi=(n,e)=>n.selection.empty?!1:(e&&e(n.tr.deleteSelection().scrollIntoView()),!0);function Dl(n,e){let{$cursor:t}=n.selection;return!t||(e?!e.endOfTextblock("backward",n):t.parentOffset>0)?null:t}const Al=(n,e,t)=>{let r=Dl(n,t);if(!r)return!1;let o=ki(r);if(!o){let s=r.blockRange(),l=s&&$t(s);return l==null?!1:(e&&e(n.tr.lift(s,l).scrollIntoView()),!0)}let i=o.nodeBefore;if(xi(n,o,e,-1))return!0;if(r.parent.content.size==0&&(bt(i,"end")||A.isSelectable(i)))for(let s=r.depth;;s--){let l=dr(n.doc,r.before(s),r.after(s),M.empty);if(l&&l.slice.size<l.to-l.from){if(e){let a=n.tr.step(l);a.setSelection(bt(i,"end")?I.findFrom(a.doc.resolve(a.mapping.map(o.pos,-1)),-1):A.create(a.doc,o.pos-i.nodeSize)),e(a.scrollIntoView())}return!0}if(s==1||r.node(s-1).childCount>1)break}return i.isAtom&&o.depth==r.depth-1?(e&&e(n.tr.delete(o.pos-i.nodeSize,o.pos).scrollIntoView()),!0):!1};function bt(n,e,t=!1){for(let r=n;r;r=e=="start"?r.firstChild:r.lastChild){if(r.isTextblock)return!0;if(t&&r.childCount!=1)return!1}return!1}const El=(n,e,t)=>{let{$head:r,empty:o}=n.selection,i=r;if(!o)return!1;if(r.parent.isTextblock){if(t?!t.endOfTextblock("backward",n):r.parentOffset>0)return!1;i=ki(r)}let s=i&&i.nodeBefore;return!s||!A.isSelectable(s)?!1:(e&&e(n.tr.setSelection(A.create(n.doc,i.pos-s.nodeSize)).scrollIntoView()),!0)};function ki(n){if(!n.parent.type.spec.isolating)for(let e=n.depth-1;e>=0;e--){if(n.index(e)>0)return n.doc.resolve(n.before(e+1));if(n.node(e).type.spec.isolating)break}return null}function Rl(n,e){let{$cursor:t}=n.selection;return!t||(e?!e.endOfTextblock("forward",n):t.parentOffset<t.parent.content.size)?null:t}const Il=(n,e,t)=>{let r=Rl(n,t);if(!r)return!1;let o=yi(r);if(!o)return!1;let i=o.nodeAfter;if(xi(n,o,e,1))return!0;if(r.parent.content.size==0&&(bt(i,"start")||A.isSelectable(i))){let s=dr(n.doc,r.before(),r.after(),M.empty);if(s&&s.slice.size<s.to-s.from){if(e){let l=n.tr.step(s);l.setSelection(bt(i,"start")?I.findFrom(l.doc.resolve(l.mapping.map(o.pos)),1):A.create(l.doc,l.mapping.map(o.pos))),e(l.scrollIntoView())}return!0}}return i.isAtom&&o.depth==r.depth-1?(e&&e(n.tr.delete(o.pos,o.pos+i.nodeSize).scrollIntoView()),!0):!1},Bl=(n,e,t)=>{let{$head:r,empty:o}=n.selection,i=r;if(!o)return!1;if(r.parent.isTextblock){if(t?!t.endOfTextblock("forward",n):r.parentOffset<r.parent.content.size)return!1;i=yi(r)}let s=i&&i.nodeAfter;return!s||!A.isSelectable(s)?!1:(e&&e(n.tr.setSelection(A.create(n.doc,i.pos)).scrollIntoView()),!0)};function yi(n){if(!n.parent.type.spec.isolating)for(let e=n.depth-1;e>=0;e--){let t=n.node(e);if(n.index(e)+1<t.childCount)return n.doc.resolve(n.after(e+1));if(t.type.spec.isolating)break}return null}const Pl=(n,e)=>{let{$from:t,$to:r}=n.selection,o=t.blockRange(r),i=o&&$t(o);return i==null?!1:(e&&e(n.tr.lift(o,i).scrollIntoView()),!0)},Ll=(n,e)=>{let{$head:t,$anchor:r}=n.selection;return!t.parent.type.spec.code||!t.sameParent(r)?!1:(e&&e(n.tr.insertText(`
`).scrollIntoView()),!0)};function hr(n){for(let e=0;e<n.edgeCount;e++){let{type:t}=n.edge(e);if(t.isTextblock&&!t.hasRequiredAttrs())return t}return null}const zl=(n,e)=>{let{$head:t,$anchor:r}=n.selection;if(!t.parent.type.spec.code||!t.sameParent(r))return!1;let o=t.node(-1),i=t.indexAfter(-1),s=hr(o.contentMatchAt(i));if(!s||!o.canReplaceWith(i,i,s))return!1;if(e){let l=t.after(),a=n.tr.replaceWith(l,l,s.createAndFill());a.setSelection(I.near(a.doc.resolve(l),1)),e(a.scrollIntoView())}return!0},jl=(n,e)=>{let t=n.selection,{$from:r,$to:o}=t;if(t instanceof se||r.parent.inlineContent||o.parent.inlineContent)return!1;let i=hr(o.parent.contentMatchAt(o.indexAfter()));if(!i||!i.isTextblock)return!1;if(e){let s=(!r.parentOffset&&o.index()<o.parent.childCount?r:o).pos,l=n.tr.insert(s,i.createAndFill());l.setSelection(E.create(l.doc,s+1)),e(l.scrollIntoView())}return!0},Vl=(n,e)=>{let{$cursor:t}=n.selection;if(!t||t.parent.content.size)return!1;if(t.depth>1&&t.after()!=t.end(-1)){let i=t.before();if(Tt(n.doc,i))return e&&e(n.tr.split(i).scrollIntoView()),!0}let r=t.blockRange(),o=r&&$t(r);return o==null?!1:(e&&e(n.tr.lift(r,o).scrollIntoView()),!0)};function Fl(n){return(e,t)=>{let{$from:r,$to:o}=e.selection;if(e.selection instanceof A&&e.selection.node.isBlock)return!r.parentOffset||!Tt(e.doc,r.pos)?!1:(t&&t(e.tr.split(r.pos).scrollIntoView()),!0);if(!r.depth)return!1;let i=[],s,l,a=!1,c=!1;for(let f=r.depth;;f--)if(r.node(f).isBlock){a=r.end(f)==r.pos+(r.depth-f),c=r.start(f)==r.pos-(r.depth-f),l=hr(r.node(f-1).contentMatchAt(r.indexAfter(f-1))),i.unshift(a&&l?{type:l}:null),s=f;break}else{if(f==1)return!1;i.unshift(null)}let d=e.tr;(e.selection instanceof E||e.selection instanceof se)&&d.deleteSelection();let u=d.mapping.map(r.pos),h=Tt(d.doc,u,i.length,i);if(h||(i[0]=l?{type:l}:null,h=Tt(d.doc,u,i.length,i)),!h)return!1;if(d.split(u,i.length,i),!a&&c&&r.node(s).type!=l){let f=d.mapping.map(r.before(s)),p=d.doc.resolve(f);l&&r.node(s-1).canReplaceWith(p.index(),p.index()+1,l)&&d.setNodeMarkup(d.mapping.map(r.before(s)),l)}return t&&t(d.scrollIntoView()),!0}}const $l=Fl(),_l=(n,e)=>(e&&e(n.tr.setSelection(new se(n.doc))),!0);function Wl(n,e,t){let r=e.nodeBefore,o=e.nodeAfter,i=e.index();return!r||!o||!r.type.compatibleContent(o.type)?!1:!r.content.size&&e.parent.canReplace(i-1,i)?(t&&t(n.tr.delete(e.pos-r.nodeSize,e.pos).scrollIntoView()),!0):!e.parent.canReplace(i,i+1)||!(o.isTextblock||kn(n.doc,e.pos))?!1:(t&&t(n.tr.join(e.pos).scrollIntoView()),!0)}function xi(n,e,t,r){let o=e.nodeBefore,i=e.nodeAfter,s,l,a=o.type.spec.isolating||i.type.spec.isolating;if(!a&&Wl(n,e,t))return!0;let c=!a&&e.parent.canReplace(e.index(),e.index()+1);if(c&&(s=(l=o.contentMatchAt(o.childCount)).findWrapping(i.type))&&l.matchType(s[0]||i.type).validEnd){if(t){let f=e.pos+i.nodeSize,p=v.empty;for(let x=s.length-1;x>=0;x--)p=v.from(s[x].create(null,p));p=v.from(o.copy(p));let g=n.tr.step(new G(e.pos-1,f,e.pos,f,new M(p,1,0),s.length,!0)),b=g.doc.resolve(f+2*s.length);b.nodeAfter&&b.nodeAfter.type==o.type&&kn(g.doc,b.pos)&&g.join(b.pos),t(g.scrollIntoView())}return!0}let d=i.type.spec.isolating||r>0&&a?null:I.findFrom(e,1),u=d&&d.$from.blockRange(d.$to),h=u&&$t(u);if(h!=null&&h>=e.depth)return t&&t(n.tr.lift(u,h).scrollIntoView()),!0;if(c&&bt(i,"start",!0)&&bt(o,"end")){let f=o,p=[];for(;p.push(f),!f.isTextblock;)f=f.lastChild;let g=i,b=1;for(;!g.isTextblock;g=g.firstChild)b++;if(f.canReplace(f.childCount,f.childCount,g.content)){if(t){let x=v.empty;for(let k=p.length-1;k>=0;k--)x=v.from(p[k].copy(x));let w=n.tr.step(new G(e.pos-p.length,e.pos+i.nodeSize,e.pos+b,e.pos+i.nodeSize-b,new M(x,p.length,0),0,!0));t(w.scrollIntoView())}return!0}}return!1}function wi(n){return function(e,t){let r=e.selection,o=n<0?r.$from:r.$to,i=o.depth;for(;o.node(i).isInline;){if(!i)return!1;i--}return o.node(i).isTextblock?(t&&t(e.tr.setSelection(E.create(e.doc,n<0?o.start(i):o.end(i)))),!0):!1}}const ql=wi(-1),Hl=wi(1);function Jl(n,e=null){return function(t,r){let{$from:o,$to:i}=t.selection,s=o.blockRange(i),l=s&&cr(s,n,e);return l?(r&&r(t.tr.wrap(s,l).scrollIntoView()),!0):!1}}function Pe(n,e=null){return function(t,r){let o=!1;for(let i=0;i<t.selection.ranges.length&&!o;i++){let{$from:{pos:s},$to:{pos:l}}=t.selection.ranges[i];t.doc.nodesBetween(s,l,(a,c)=>{if(o)return!1;if(!(!a.isTextblock||a.hasMarkup(n,e)))if(a.type==n)o=!0;else{let d=t.doc.resolve(c),u=d.index();o=d.parent.canReplaceWith(u,u+1,n)}})}if(!o)return!1;if(r){let i=t.tr;for(let s=0;s<t.selection.ranges.length;s++){let{$from:{pos:l},$to:{pos:a}}=t.selection.ranges[s];i.setBlockType(l,a,n,e)}r(i.scrollIntoView())}return!0}}function Ul(n,e,t,r){for(let o=0;o<e.length;o++){let{$from:i,$to:s}=e[o],l=i.depth==0?n.inlineContent&&n.type.allowsMarkType(t):!1;if(n.nodesBetween(i.pos,s.pos,(a,c)=>{if(l)return!1;l=a.inlineContent&&a.type.allowsMarkType(t)}),l)return!0}return!1}function vi(n,e=null,t){return function(r,o){let{empty:i,$cursor:s,ranges:l}=r.selection;if(i&&!s||!Ul(r.doc,l,n))return!1;if(o)if(s)n.isInSet(r.storedMarks||s.marks())?o(r.tr.removeStoredMark(n)):o(r.tr.addStoredMark(n.create(e)));else{let a,c=r.tr;a=!l.some(d=>r.doc.rangeHasMark(d.$from.pos,d.$to.pos,n));for(let d=0;d<l.length;d++){let{$from:u,$to:h}=l[d];if(!a)c.removeMark(u.pos,h.pos,n);else{let f=u.pos,p=h.pos,g=u.nodeAfter,b=h.nodeBefore,x=g&&g.isText?/^\s*/.exec(g.text)[0].length:0,w=b&&b.isText?/\s*$/.exec(b.text)[0].length:0;f+x<p&&(f+=x,p-=w),c.addMark(f,p,n.create(e))}}o(c.scrollIntoView())}return!0}}function fr(...n){return function(e,t,r){for(let o=0;o<n.length;o++)if(n[o](e,t,r))return!0;return!1}}let Ln=fr(bi,Al,El),Gr=fr(bi,Il,Bl);const Oe={Enter:fr(Ll,jl,Vl,$l),"Mod-Enter":zl,Backspace:Ln,"Mod-Backspace":Ln,"Shift-Backspace":Ln,Delete:Gr,"Mod-Delete":Gr,"Mod-a":_l},Si={"Ctrl-h":Oe.Backspace,"Alt-Backspace":Oe["Mod-Backspace"],"Ctrl-d":Oe.Delete,"Ctrl-Alt-Backspace":Oe["Mod-Delete"],"Alt-Delete":Oe["Mod-Delete"],"Alt-d":Oe["Mod-Delete"],"Ctrl-a":ql,"Ctrl-e":Hl};for(let n in Oe)Si[n]=Oe[n];const Kl=typeof navigator<"u"?/Mac|iP(hone|[oa]d)/.test(navigator.platform):typeof os<"u"&&os.platform?os.platform()=="darwin":!1,Yl=Kl?Si:Oe;function Xr(n,e=null){return function(t,r){let{$from:o,$to:i}=t.selection,s=o.blockRange(i);if(!s)return!1;let l=r?t.tr:null;return Gl(l,s,n,e)?(r&&r(l.scrollIntoView()),!0):!1}}function Gl(n,e,t,r=null){let o=!1,i=e,s=e.$from.doc;if(e.depth>=2&&e.$from.node(e.depth-1).type.compatibleContent(t)&&e.startIndex==0){if(e.$from.index(e.depth-1)==0)return!1;let a=s.resolve(e.start-2);i=new an(a,a,e.depth),e.endIndex<e.parent.childCount&&(e=new an(e.$from,s.resolve(e.$to.end(e.depth)),e.depth)),o=!0}let l=cr(i,t,r,e);return l?(n&&Xl(n,e,l,o,t),!0):!1}function Xl(n,e,t,r,o){let i=v.empty;for(let d=t.length-1;d>=0;d--)i=v.from(t[d].type.create(t[d].attrs,i));n.step(new G(e.start-(r?2:0),e.end,e.start,e.end,new M(i,0,0),t.length,!0));let s=0;for(let d=0;d<t.length;d++)t[d].type==o&&(s=d+1);let l=t.length-s,a=e.start+t.length-(r?2:0),c=e.parent;for(let d=e.startIndex,u=e.endIndex,h=!0;d<u;d++,h=!1)!h&&Tt(n.doc,a,l)&&(n.split(a,l),a+=2*l),a+=c.child(d).nodeSize;return n}function Zl(n){return function(e,t){let{$from:r,$to:o}=e.selection,i=r.blockRange(o,s=>s.childCount>0&&s.firstChild.type==n);return i?t?r.node(i.depth-1).type==n?Ql(e,t,n,i):ea(e,t,i):!0:!1}}function Ql(n,e,t,r){let o=n.tr,i=r.end,s=r.$to.end(r.depth);i<s&&(o.step(new G(i-1,s,i,s,new M(v.from(t.create(null,r.parent.copy())),1,0),1,!0)),r=new an(o.doc.resolve(r.$from.pos),o.doc.resolve(s),r.depth));const l=$t(r);if(l==null)return!1;o.lift(r,l);let a=o.doc.resolve(o.mapping.map(i,-1)-1);return kn(o.doc,a.pos)&&a.nodeBefore.type==a.nodeAfter.type&&o.join(a.pos),e(o.scrollIntoView()),!0}function ea(n,e,t){let r=n.tr,o=t.parent;for(let f=t.end,p=t.endIndex-1,g=t.startIndex;p>g;p--)f-=o.child(p).nodeSize,r.delete(f-1,f+1);let i=r.doc.resolve(t.start),s=i.nodeAfter;if(r.mapping.map(t.end)!=t.start+i.nodeAfter.nodeSize)return!1;let l=t.startIndex==0,a=t.endIndex==o.childCount,c=i.node(-1),d=i.index(-1);if(!c.canReplace(d+(l?0:1),d+1,s.content.append(a?v.empty:v.from(o))))return!1;let u=i.pos,h=u+s.nodeSize;return r.step(new G(u-(l?1:0),h+(a?1:0),u+1,h-1,new M((l?v.empty:v.from(o.copy(v.empty))).append(a?v.empty:v.from(o.copy(v.empty))),l?0:1,a?0:1),l?0:1)),e(r.scrollIntoView()),!0}function ta(n){return function(e,t){let{$from:r,$to:o}=e.selection,i=r.blockRange(o,c=>c.childCount>0&&c.firstChild.type==n);if(!i)return!1;let s=i.startIndex;if(s==0)return!1;let l=i.parent,a=l.child(s-1);if(a.type!=n)return!1;if(t){let c=a.lastChild&&a.lastChild.type==l.type,d=v.from(c?n.create():null),u=new M(v.from(n.create(null,v.from(l.type.create(null,d)))),c?3:1,0),h=i.start,f=i.end;t(e.tr.step(new G(h-(c?3:1),f,h,f,u,1,!0)).scrollIntoView())}return!0}}var un=200,q=function(){};q.prototype.append=function(e){return e.length?(e=q.from(e),!this.length&&e||e.length<un&&this.leafAppend(e)||this.length<un&&e.leafPrepend(this)||this.appendInner(e)):this};q.prototype.prepend=function(e){return e.length?q.from(e).append(this):this};q.prototype.appendInner=function(e){return new na(this,e)};q.prototype.slice=function(e,t){return e===void 0&&(e=0),t===void 0&&(t=this.length),e>=t?q.empty:this.sliceInner(Math.max(0,e),Math.min(this.length,t))};q.prototype.get=function(e){if(!(e<0||e>=this.length))return this.getInner(e)};q.prototype.forEach=function(e,t,r){t===void 0&&(t=0),r===void 0&&(r=this.length),t<=r?this.forEachInner(e,t,r,0):this.forEachInvertedInner(e,t,r,0)};q.prototype.map=function(e,t,r){t===void 0&&(t=0),r===void 0&&(r=this.length);var o=[];return this.forEach(function(i,s){return o.push(e(i,s))},t,r),o};q.from=function(e){return e instanceof q?e:e&&e.length?new Ci(e):q.empty};var Ci=(function(n){function e(r){n.call(this),this.values=r}n&&(e.__proto__=n),e.prototype=Object.create(n&&n.prototype),e.prototype.constructor=e;var t={length:{configurable:!0},depth:{configurable:!0}};return e.prototype.flatten=function(){return this.values},e.prototype.sliceInner=function(o,i){return o==0&&i==this.length?this:new e(this.values.slice(o,i))},e.prototype.getInner=function(o){return this.values[o]},e.prototype.forEachInner=function(o,i,s,l){for(var a=i;a<s;a++)if(o(this.values[a],l+a)===!1)return!1},e.prototype.forEachInvertedInner=function(o,i,s,l){for(var a=i-1;a>=s;a--)if(o(this.values[a],l+a)===!1)return!1},e.prototype.leafAppend=function(o){if(this.length+o.length<=un)return new e(this.values.concat(o.flatten()))},e.prototype.leafPrepend=function(o){if(this.length+o.length<=un)return new e(o.flatten().concat(this.values))},t.length.get=function(){return this.values.length},t.depth.get=function(){return 0},Object.defineProperties(e.prototype,t),e})(q);q.empty=new Ci([]);var na=(function(n){function e(t,r){n.call(this),this.left=t,this.right=r,this.length=t.length+r.length,this.depth=Math.max(t.depth,r.depth)+1}return n&&(e.__proto__=n),e.prototype=Object.create(n&&n.prototype),e.prototype.constructor=e,e.prototype.flatten=function(){return this.left.flatten().concat(this.right.flatten())},e.prototype.getInner=function(r){return r<this.left.length?this.left.get(r):this.right.get(r-this.left.length)},e.prototype.forEachInner=function(r,o,i,s){var l=this.left.length;if(o<l&&this.left.forEachInner(r,o,Math.min(i,l),s)===!1||i>l&&this.right.forEachInner(r,Math.max(o-l,0),Math.min(this.length,i)-l,s+l)===!1)return!1},e.prototype.forEachInvertedInner=function(r,o,i,s){var l=this.left.length;if(o>l&&this.right.forEachInvertedInner(r,o-l,Math.max(i,l)-l,s+l)===!1||i<l&&this.left.forEachInvertedInner(r,Math.min(o,l),i,s)===!1)return!1},e.prototype.sliceInner=function(r,o){if(r==0&&o==this.length)return this;var i=this.left.length;return o<=i?this.left.slice(r,o):r>=i?this.right.slice(r-i,o-i):this.left.slice(r,i).append(this.right.slice(0,o-i))},e.prototype.leafAppend=function(r){var o=this.right.leafAppend(r);if(o)return new e(this.left,o)},e.prototype.leafPrepend=function(r){var o=this.left.leafPrepend(r);if(o)return new e(o,this.right)},e.prototype.appendInner=function(r){return this.left.depth>=Math.max(this.right.depth,r.depth)+1?new e(this.left,new e(this.right,r)):new e(this,r)},e})(q);const ra=500;class ke{constructor(e,t){this.items=e,this.eventCount=t}popEvent(e,t){if(this.eventCount==0)return null;let r=this.items.length;for(;;r--)if(this.items.get(r-1).selection){--r;break}let o,i;t&&(o=this.remapping(r,this.items.length),i=o.maps.length);let s=e.tr,l,a,c=[],d=[];return this.items.forEach((u,h)=>{if(!u.step){o||(o=this.remapping(r,h+1),i=o.maps.length),i--,d.push(u);return}if(o){d.push(new ye(u.map));let f=u.step.map(o.slice(i)),p;f&&s.maybeStep(f).doc&&(p=s.mapping.maps[s.mapping.maps.length-1],c.push(new ye(p,void 0,void 0,c.length+d.length))),i--,p&&o.appendMap(p,i)}else s.maybeStep(u.step);if(u.selection)return l=o?u.selection.map(o.slice(i)):u.selection,a=new ke(this.items.slice(0,r).append(d.reverse().concat(c)),this.eventCount-1),!1},this.items.length,0),{remaining:a,transform:s,selection:l}}addTransform(e,t,r,o){let i=[],s=this.eventCount,l=this.items,a=!o&&l.length?l.get(l.length-1):null;for(let d=0;d<e.steps.length;d++){let u=e.steps[d].invert(e.docs[d]),h=new ye(e.mapping.maps[d],u,t),f;(f=a&&a.merge(h))&&(h=f,d?i.pop():l=l.slice(0,l.length-1)),i.push(h),t&&(s++,t=void 0),o||(a=h)}let c=s-r.depth;return c>ia&&(l=oa(l,c),s-=c),new ke(l.append(i),s)}remapping(e,t){let r=new Pt;return this.items.forEach((o,i)=>{let s=o.mirrorOffset!=null&&i-o.mirrorOffset>=e?r.maps.length-o.mirrorOffset:void 0;r.appendMap(o.map,s)},e,t),r}addMaps(e){return this.eventCount==0?this:new ke(this.items.append(e.map(t=>new ye(t))),this.eventCount)}rebased(e,t){if(!this.eventCount)return this;let r=[],o=Math.max(0,this.items.length-t),i=e.mapping,s=e.steps.length,l=this.eventCount;this.items.forEach(h=>{h.selection&&l--},o);let a=t;this.items.forEach(h=>{let f=i.getMirror(--a);if(f==null)return;s=Math.min(s,f);let p=i.maps[f];if(h.step){let g=e.steps[f].invert(e.docs[f]),b=h.selection&&h.selection.map(i.slice(a+1,f));b&&l++,r.push(new ye(p,g,b))}else r.push(new ye(p))},o);let c=[];for(let h=t;h<s;h++)c.push(new ye(i.maps[h]));let d=this.items.slice(0,o).append(c).append(r),u=new ke(d,l);return u.emptyItemCount()>ra&&(u=u.compress(this.items.length-r.length)),u}emptyItemCount(){let e=0;return this.items.forEach(t=>{t.step||e++}),e}compress(e=this.items.length){let t=this.remapping(0,e),r=t.maps.length,o=[],i=0;return this.items.forEach((s,l)=>{if(l>=e)o.push(s),s.selection&&i++;else if(s.step){let a=s.step.map(t.slice(r)),c=a&&a.getMap();if(r--,c&&t.appendMap(c,r),a){let d=s.selection&&s.selection.map(t.slice(r));d&&i++;let u=new ye(c.invert(),a,d),h,f=o.length-1;(h=o.length&&o[f].merge(u))?o[f]=h:o.push(u)}}else s.map&&r--},this.items.length,0),new ke(q.from(o.reverse()),i)}}ke.empty=new ke(q.empty,0);function oa(n,e){let t;return n.forEach((r,o)=>{if(r.selection&&e--==0)return t=o,!1}),n.slice(t)}class ye{constructor(e,t,r,o){this.map=e,this.step=t,this.selection=r,this.mirrorOffset=o}merge(e){if(this.step&&e.step&&!e.selection){let t=e.step.merge(this.step);if(t)return new ye(t.getMap().invert(),t,this.selection)}}}class Ie{constructor(e,t,r,o,i){this.done=e,this.undone=t,this.prevRanges=r,this.prevTime=o,this.prevComposition=i}}const ia=20;function sa(n,e,t,r){let o=t.getMeta(Ze),i;if(o)return o.historyState;t.getMeta(ca)&&(n=new Ie(n.done,n.undone,null,0,-1));let s=t.getMeta("appendedTransaction");if(t.steps.length==0)return n;if(s&&s.getMeta(Ze))return s.getMeta(Ze).redo?new Ie(n.done.addTransform(t,void 0,r,rn(e)),n.undone,Zr(t.mapping.maps),n.prevTime,n.prevComposition):new Ie(n.done,n.undone.addTransform(t,void 0,r,rn(e)),null,n.prevTime,n.prevComposition);if(t.getMeta("addToHistory")!==!1&&!(s&&s.getMeta("addToHistory")===!1)){let l=t.getMeta("composition"),a=n.prevTime==0||!s&&n.prevComposition!=l&&(n.prevTime<(t.time||0)-r.newGroupDelay||!la(t,n.prevRanges)),c=s?zn(n.prevRanges,t.mapping):Zr(t.mapping.maps);return new Ie(n.done.addTransform(t,a?e.selection.getBookmark():void 0,r,rn(e)),ke.empty,c,t.time,l??n.prevComposition)}else return(i=t.getMeta("rebased"))?new Ie(n.done.rebased(t,i),n.undone.rebased(t,i),zn(n.prevRanges,t.mapping),n.prevTime,n.prevComposition):new Ie(n.done.addMaps(t.mapping.maps),n.undone.addMaps(t.mapping.maps),zn(n.prevRanges,t.mapping),n.prevTime,n.prevComposition)}function la(n,e){if(!e)return!1;if(!n.docChanged)return!0;let t=!1;return n.mapping.maps[0].forEach((r,o)=>{for(let i=0;i<e.length;i+=2)r<=e[i+1]&&o>=e[i]&&(t=!0)}),t}function Zr(n){let e=[];for(let t=n.length-1;t>=0&&e.length==0;t--)n[t].forEach((r,o,i,s)=>e.push(i,s));return e}function zn(n,e){if(!n)return null;let t=[];for(let r=0;r<n.length;r+=2){let o=e.map(n[r],1),i=e.map(n[r+1],-1);o<=i&&t.push(o,i)}return t}function aa(n,e,t){let r=rn(e),o=Ze.get(e).spec.config,i=(t?n.undone:n.done).popEvent(e,r);if(!i)return null;let s=i.selection.resolve(i.transform.doc),l=(t?n.done:n.undone).addTransform(i.transform,e.selection.getBookmark(),o,r),a=new Ie(t?l:i.remaining,t?i.remaining:l,null,0,-1);return i.transform.setSelection(s).setMeta(Ze,{redo:t,historyState:a})}let jn=!1,Qr=null;function rn(n){let e=n.plugins;if(Qr!=e){jn=!1,Qr=e;for(let t=0;t<e.length;t++)if(e[t].spec.historyPreserveItems){jn=!0;break}}return jn}const Ze=new Ae("history"),ca=new Ae("closeHistory");function da(n={}){return n={depth:n.depth||100,newGroupDelay:n.newGroupDelay||500},new ge({key:Ze,state:{init(){return new Ie(ke.empty,ke.empty,null,0,-1)},apply(e,t,r){return sa(t,r,e,n)}},config:n,props:{handleDOMEvents:{beforeinput(e,t){let r=t.inputType,o=r=="historyUndo"?xn:r=="historyRedo"?zt:null;return!o||!e.editable?!1:(t.preventDefault(),o(e.state,e.dispatch))}}}})}function Mi(n,e){return(t,r)=>{let o=Ze.getState(t);if(!o||(n?o.undone:o.done).eventCount==0)return!1;if(r){let i=aa(o,t,n);i&&r(e?i.scrollIntoView():i)}return!0}}const xn=Mi(!1,!0),zt=Mi(!0,!0),Y=function(n){for(var e=0;;e++)if(n=n.previousSibling,!n)return e},kt=function(n){let e=n.assignedSlot||n.parentNode;return e&&e.nodeType==11?e.host:e};let Gn=null;const Ne=function(n,e,t){let r=Gn||(Gn=document.createRange());return r.setEnd(n,t??n.nodeValue.length),r.setStart(n,e||0),r},ua=function(){Gn=null},rt=function(n,e,t,r){return t&&(eo(n,e,t,r,-1)||eo(n,e,t,r,1))},ha=/^(img|br|input|textarea|hr)$/i;function eo(n,e,t,r,o){for(var i;;){if(n==t&&e==r)return!0;if(e==(o<0?0:fe(n))){let s=n.parentNode;if(!s||s.nodeType!=1||_t(n)||ha.test(n.nodeName)||n.contentEditable=="false")return!1;e=Y(n)+(o<0?0:1),n=s}else if(n.nodeType==1){let s=n.childNodes[e+(o<0?-1:0)];if(s.nodeType==1&&s.contentEditable=="false")if(!((i=s.pmViewDesc)===null||i===void 0)&&i.ignoreForSelection)e+=o;else return!1;else n=s,e=o<0?fe(n):0}else return!1}}function fe(n){return n.nodeType==3?n.nodeValue.length:n.childNodes.length}function fa(n,e){for(;;){if(n.nodeType==3&&e)return n;if(n.nodeType==1&&e>0){if(n.contentEditable=="false")return null;n=n.childNodes[e-1],e=fe(n)}else if(n.parentNode&&!_t(n))e=Y(n),n=n.parentNode;else return null}}function pa(n,e){for(;;){if(n.nodeType==3&&e<n.nodeValue.length)return n;if(n.nodeType==1&&e<n.childNodes.length){if(n.contentEditable=="false")return null;n=n.childNodes[e],e=0}else if(n.parentNode&&!_t(n))e=Y(n)+1,n=n.parentNode;else return null}}function ma(n,e,t){for(let r=e==0,o=e==fe(n);r||o;){if(n==t)return!0;let i=Y(n);if(n=n.parentNode,!n)return!1;r=r&&i==0,o=o&&i==fe(n)}}function _t(n){let e;for(let t=n;t&&!(e=t.pmViewDesc);t=t.parentNode);return e&&e.node&&e.node.isBlock&&(e.dom==n||e.contentDOM==n)}const wn=function(n){return n.focusNode&&rt(n.focusNode,n.focusOffset,n.anchorNode,n.anchorOffset)};function Ue(n,e){let t=document.createEvent("Event");return t.initEvent("keydown",!0,!0),t.keyCode=n,t.key=t.code=e,t}function ga(n){let e=n.activeElement;for(;e&&e.shadowRoot;)e=e.shadowRoot.activeElement;return e}function ba(n,e,t){if(n.caretPositionFromPoint)try{let r=n.caretPositionFromPoint(e,t);if(r)return{node:r.offsetNode,offset:Math.min(fe(r.offsetNode),r.offset)}}catch{}if(n.caretRangeFromPoint){let r=n.caretRangeFromPoint(e,t);if(r)return{node:r.startContainer,offset:Math.min(fe(r.startContainer),r.startOffset)}}}const ve=typeof navigator<"u"?navigator:null,to=typeof document<"u"?document:null,He=ve&&ve.userAgent||"",Xn=/Edge\/(\d+)/.exec(He),Ni=/MSIE \d/.exec(He),Zn=/Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(He),le=!!(Ni||Zn||Xn),$e=Ni?document.documentMode:Zn?+Zn[1]:Xn?+Xn[1]:0,pe=!le&&/gecko\/(\d+)/i.test(He);pe&&+(/Firefox\/(\d+)/.exec(He)||[0,0])[1];const Qn=!le&&/Chrome\/(\d+)/.exec(He),_=!!Qn,Oi=Qn?+Qn[1]:0,X=!le&&!!ve&&/Apple Computer/.test(ve.vendor),yt=X&&(/Mobile\/\w+/.test(He)||!!ve&&ve.maxTouchPoints>2),he=yt||(ve?/Mac/.test(ve.platform):!1),Ti=ve?/Win/.test(ve.platform):!1,Te=/Android \d/.test(He),Wt=!!to&&"webkitFontSmoothing"in to.documentElement.style,ka=Wt?+(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent)||[0,0])[1]:0;function ya(n){let e=n.defaultView&&n.defaultView.visualViewport;return e?{left:0,right:e.width,top:0,bottom:e.height}:{left:0,right:n.documentElement.clientWidth,top:0,bottom:n.documentElement.clientHeight}}function Ce(n,e){return typeof n=="number"?n:n[e]}function xa(n){let e=n.getBoundingClientRect(),t=e.width/n.offsetWidth||1,r=e.height/n.offsetHeight||1;return{left:e.left,right:e.left+n.clientWidth*t,top:e.top,bottom:e.top+n.clientHeight*r}}function no(n,e,t){let r=n.someProp("scrollThreshold")||0,o=n.someProp("scrollMargin")||5,i=n.dom.ownerDocument;for(let s=t||n.dom;s;){if(s.nodeType!=1){s=kt(s);continue}let l=s,a=l==i.body,c=a?ya(i):xa(l),d=0,u=0;if(e.top<c.top+Ce(r,"top")?u=-(c.top-e.top+Ce(o,"top")):e.bottom>c.bottom-Ce(r,"bottom")&&(u=e.bottom-e.top>c.bottom-c.top?e.top+Ce(o,"top")-c.top:e.bottom-c.bottom+Ce(o,"bottom")),e.left<c.left+Ce(r,"left")?d=-(c.left-e.left+Ce(o,"left")):e.right>c.right-Ce(r,"right")&&(d=e.right-c.right+Ce(o,"right")),d||u)if(a)i.defaultView.scrollBy(d,u);else{let f=l.scrollLeft,p=l.scrollTop;u&&(l.scrollTop+=u),d&&(l.scrollLeft+=d);let g=l.scrollLeft-f,b=l.scrollTop-p;e={left:e.left-g,top:e.top-b,right:e.right-g,bottom:e.bottom-b}}let h=a?"fixed":getComputedStyle(s).position;if(/^(fixed|sticky)$/.test(h))break;s=h=="absolute"?s.offsetParent:kt(s)}}function wa(n){let e=n.dom.getBoundingClientRect(),t=Math.max(0,e.top),r,o;for(let i=(e.left+e.right)/2,s=t+1;s<Math.min(innerHeight,e.bottom);s+=5){let l=n.root.elementFromPoint(i,s);if(!l||l==n.dom||!n.dom.contains(l))continue;let a=l.getBoundingClientRect();if(a.top>=t-20){r=l,o=a.top;break}}return{refDOM:r,refTop:o,stack:Di(n.dom)}}function Di(n){let e=[],t=n.ownerDocument;for(let r=n;r&&(e.push({dom:r,top:r.scrollTop,left:r.scrollLeft}),n!=t);r=kt(r));return e}function va({refDOM:n,refTop:e,stack:t}){let r=n?n.getBoundingClientRect().top:0;Ai(t,r==0?0:r-e)}function Ai(n,e){for(let t=0;t<n.length;t++){let{dom:r,top:o,left:i}=n[t];r.scrollTop!=o+e&&(r.scrollTop=o+e),r.scrollLeft!=i&&(r.scrollLeft=i)}}let lt=null;function Sa(n){if(n.setActive)return n.setActive();if(lt)return n.focus(lt);let e=Di(n);n.focus(lt==null?{get preventScroll(){return lt={preventScroll:!0},!0}}:void 0),lt||(lt=!1,Ai(e,0))}function Ei(n,e){let t,r=2e8,o,i=0,s=e.top,l=e.top,a,c;for(let d=n.firstChild,u=0;d;d=d.nextSibling,u++){let h;if(d.nodeType==1)h=d.getClientRects();else if(d.nodeType==3)h=Ne(d).getClientRects();else continue;for(let f=0;f<h.length;f++){let p=h[f];if(p.top<=s&&p.bottom>=l){s=Math.max(p.bottom,s),l=Math.min(p.top,l);let g=p.left>e.left?p.left-e.left:p.right<e.left?e.left-p.right:0;if(g<r){t=d,r=g,o=g&&t.nodeType==3?{left:p.right<e.left?p.right:p.left,top:e.top}:e,d.nodeType==1&&g&&(i=u+(e.left>=(p.left+p.right)/2?1:0));continue}}else p.top>e.top&&!a&&p.left<=e.left&&p.right>=e.left&&(a=d,c={left:Math.max(p.left,Math.min(p.right,e.left)),top:p.top});!t&&(e.left>=p.right&&e.top>=p.top||e.left>=p.left&&e.top>=p.bottom)&&(i=u+1)}}return!t&&a&&(t=a,o=c,r=0),t&&t.nodeType==3?Ca(t,o):!t||r&&t.nodeType==1?{node:n,offset:i}:Ei(t,o)}function Ca(n,e){let t=n.nodeValue.length,r=document.createRange(),o;for(let i=0;i<t;i++){r.setEnd(n,i+1),r.setStart(n,i);let s=Ee(r,1);if(s.top!=s.bottom&&pr(e,s)){o={node:n,offset:i+(e.left>=(s.left+s.right)/2?1:0)};break}}return r.detach(),o||{node:n,offset:0}}function pr(n,e){return n.left>=e.left-1&&n.left<=e.right+1&&n.top>=e.top-1&&n.top<=e.bottom+1}function Ma(n,e){let t=n.parentNode;return t&&/^li$/i.test(t.nodeName)&&e.left<n.getBoundingClientRect().left?t:n}function Na(n,e,t){let{node:r,offset:o}=Ei(e,t),i=-1;if(r.nodeType==1&&!r.firstChild){let s=r.getBoundingClientRect();i=s.left!=s.right&&t.left>(s.left+s.right)/2?1:-1}return n.docView.posFromDOM(r,o,i)}function Oa(n,e,t,r){let o=-1;for(let i=e,s=!1;i!=n.dom;){let l=n.docView.nearestDesc(i,!0),a;if(!l)return null;if(l.dom.nodeType==1&&(l.node.isBlock&&l.parent||!l.contentDOM)&&((a=l.dom.getBoundingClientRect()).width||a.height)&&(l.node.isBlock&&l.parent&&!/^T(R|BODY|HEAD|FOOT)$/.test(l.dom.nodeName)&&(!s&&a.left>r.left||a.top>r.top?o=l.posBefore:(!s&&a.right<r.left||a.bottom<r.top)&&(o=l.posAfter),s=!0),!l.contentDOM&&o<0&&!l.node.isText))return(l.node.isBlock?r.top<(a.top+a.bottom)/2:r.left<(a.left+a.right)/2)?l.posBefore:l.posAfter;i=l.dom.parentNode}return o>-1?o:n.docView.posFromDOM(e,t,-1)}function Ri(n,e,t){let r=n.childNodes.length;if(r&&t.top<t.bottom)for(let o=Math.max(0,Math.min(r-1,Math.floor(r*(e.top-t.top)/(t.bottom-t.top))-2)),i=o;;){let s=n.childNodes[i];if(s.nodeType==1){let l=s.getClientRects();for(let a=0;a<l.length;a++){let c=l[a];if(pr(e,c))return Ri(s,e,c)}}if((i=(i+1)%r)==o)break}return n}function Ta(n,e){let t=n.dom.ownerDocument,r,o=0,i=ba(t,e.left,e.top);i&&({node:r,offset:o}=i);let s=(n.root.elementFromPoint?n.root:t).elementFromPoint(e.left,e.top),l;if(!s||!n.dom.contains(s.nodeType!=1?s.parentNode:s)){let c=n.dom.getBoundingClientRect();if(!pr(e,c)||(s=Ri(n.dom,e,c),!s))return null}if(X)for(let c=s;r&&c;c=kt(c))c.draggable&&(r=void 0);if(s=Ma(s,e),r){if(pe&&r.nodeType==1&&(o=Math.min(o,r.childNodes.length),o<r.childNodes.length)){let d=r.childNodes[o],u;d.nodeName=="IMG"&&(u=d.getBoundingClientRect()).right<=e.left&&u.bottom>e.top&&o++}let c;Wt&&o&&r.nodeType==1&&(c=r.childNodes[o-1]).nodeType==1&&c.contentEditable=="false"&&c.getBoundingClientRect().top>=e.top&&o--,r==n.dom&&o==r.childNodes.length-1&&r.lastChild.nodeType==1&&e.top>r.lastChild.getBoundingClientRect().bottom?l=n.state.doc.content.size:(o==0||r.nodeType!=1||r.childNodes[o-1].nodeName!="BR")&&(l=Oa(n,r,o,e))}l==null&&(l=Na(n,s,e));let a=n.docView.nearestDesc(s,!0);return{pos:l,inside:a?a.posAtStart-a.border:-1}}function ro(n){return n.top<n.bottom||n.left<n.right}function Ee(n,e){let t=n.getClientRects();if(t.length){let r=t[e<0?0:t.length-1];if(ro(r))return r}return Array.prototype.find.call(t,ro)||n.getBoundingClientRect()}const Da=/[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;function Ii(n,e,t){let{node:r,offset:o,atom:i}=n.docView.domFromPos(e,t<0?-1:1),s=Wt||pe;if(r.nodeType==3)if(s&&(Da.test(r.nodeValue)||(t<0?!o:o==r.nodeValue.length))){let a=Ee(Ne(r,o,o),t);if(pe&&o&&/\s/.test(r.nodeValue[o-1])&&o<r.nodeValue.length){let c=Ee(Ne(r,o-1,o-1),-1);if(c.top==a.top){let d=Ee(Ne(r,o,o+1),-1);if(d.top!=a.top)return vt(d,d.left<c.left)}}return a}else{let a=o,c=o,d=t<0?1:-1;return t<0&&!o?(c++,d=-1):t>=0&&o==r.nodeValue.length?(a--,d=1):t<0?a--:c++,vt(Ee(Ne(r,a,c),d),d<0)}if(!n.state.doc.resolve(e-(i||0)).parent.inlineContent){if(i==null&&o&&(t<0||o==fe(r))){let a=r.childNodes[o-1];if(a.nodeType==1)return Vn(a.getBoundingClientRect(),!1)}if(i==null&&o<fe(r)){let a=r.childNodes[o];if(a.nodeType==1)return Vn(a.getBoundingClientRect(),!0)}return Vn(r.getBoundingClientRect(),t>=0)}if(i==null&&o&&(t<0||o==fe(r))){let a=r.childNodes[o-1],c=a.nodeType==3?Ne(a,fe(a)-(s?0:1)):a.nodeType==1&&(a.nodeName!="BR"||!a.nextSibling)?a:null;if(c)return vt(Ee(c,1),!1)}if(i==null&&o<fe(r)){let a=r.childNodes[o];for(;a.pmViewDesc&&a.pmViewDesc.ignoreForCoords;)a=a.nextSibling;let c=a?a.nodeType==3?Ne(a,0,s?0:1):a.nodeType==1?a:null:null;if(c)return vt(Ee(c,-1),!0)}return vt(Ee(r.nodeType==3?Ne(r):r,-t),t>=0)}function vt(n,e){if(n.width==0)return n;let t=e?n.left:n.right;return{top:n.top,bottom:n.bottom,left:t,right:t}}function Vn(n,e){if(n.height==0)return n;let t=e?n.top:n.bottom;return{top:t,bottom:t,left:n.left,right:n.right}}function Bi(n,e,t){let r=n.state,o=n.root.activeElement;r!=e&&n.updateState(e),o!=n.dom&&n.focus();try{return t()}finally{r!=e&&n.updateState(r),o!=n.dom&&o&&o.focus()}}function Aa(n,e,t){let r=e.selection,o=t=="up"?r.$from:r.$to;return Bi(n,e,()=>{let{node:i}=n.docView.domFromPos(o.pos,t=="up"?-1:1);for(;;){let l=n.docView.nearestDesc(i,!0);if(!l)break;if(l.node.isBlock){i=l.contentDOM||l.dom;break}i=l.dom.parentNode}let s=Ii(n,o.pos,1);for(let l=i.firstChild;l;l=l.nextSibling){let a;if(l.nodeType==1)a=l.getClientRects();else if(l.nodeType==3)a=Ne(l,0,l.nodeValue.length).getClientRects();else continue;for(let c=0;c<a.length;c++){let d=a[c];if(d.bottom>d.top+1&&(t=="up"?s.top-d.top>(d.bottom-s.top)*2:d.bottom-s.bottom>(s.bottom-d.top)*2))return!1}}return!0})}const Ea=/[\u0590-\u08ac]/;function Ra(n,e,t){let{$head:r}=e.selection;if(!r.parent.isTextblock)return!1;let o=r.parentOffset,i=!o,s=o==r.parent.content.size,l=n.domSelection();return l?!Ea.test(r.parent.textContent)||!l.modify?t=="left"||t=="backward"?i:s:Bi(n,e,()=>{let{focusNode:a,focusOffset:c,anchorNode:d,anchorOffset:u}=n.domSelectionRange(),h=l.caretBidiLevel;l.modify("move",t,"character");let f=r.depth?n.docView.domAfterPos(r.before()):n.dom,{focusNode:p,focusOffset:g}=n.domSelectionRange(),b=p&&!f.contains(p.nodeType==1?p:p.parentNode)||a==p&&c==g;try{l.collapse(d,u),a&&(a!=d||c!=u)&&l.extend&&l.extend(a,c)}catch{}return h!=null&&(l.caretBidiLevel=h),b}):r.pos==r.start()||r.pos==r.end()}let oo=null,io=null,so=!1;function Ia(n,e,t){return oo==e&&io==t?so:(oo=e,io=t,so=t=="up"||t=="down"?Aa(n,e,t):Ra(n,e,t))}const me=0,lo=1,Ke=2,Se=3;class qt{constructor(e,t,r,o){this.parent=e,this.children=t,this.dom=r,this.contentDOM=o,this.dirty=me,r.pmViewDesc=this}matchesWidget(e){return!1}matchesMark(e){return!1}matchesNode(e,t,r){return!1}matchesHack(e){return!1}parseRule(){return null}stopEvent(e){return!1}get size(){let e=0;for(let t=0;t<this.children.length;t++)e+=this.children[t].size;return e}get border(){return 0}destroy(){this.parent=void 0,this.dom.pmViewDesc==this&&(this.dom.pmViewDesc=void 0);for(let e=0;e<this.children.length;e++)this.children[e].destroy()}posBeforeChild(e){for(let t=0,r=this.posAtStart;;t++){let o=this.children[t];if(o==e)return r;r+=o.size}}get posBefore(){return this.parent.posBeforeChild(this)}get posAtStart(){return this.parent?this.parent.posBeforeChild(this)+this.border:0}get posAfter(){return this.posBefore+this.size}get posAtEnd(){return this.posAtStart+this.size-2*this.border}localPosFromDOM(e,t,r){if(this.contentDOM&&this.contentDOM.contains(e.nodeType==1?e:e.parentNode))if(r<0){let i,s;if(e==this.contentDOM)i=e.childNodes[t-1];else{for(;e.parentNode!=this.contentDOM;)e=e.parentNode;i=e.previousSibling}for(;i&&!((s=i.pmViewDesc)&&s.parent==this);)i=i.previousSibling;return i?this.posBeforeChild(s)+s.size:this.posAtStart}else{let i,s;if(e==this.contentDOM)i=e.childNodes[t];else{for(;e.parentNode!=this.contentDOM;)e=e.parentNode;i=e.nextSibling}for(;i&&!((s=i.pmViewDesc)&&s.parent==this);)i=i.nextSibling;return i?this.posBeforeChild(s):this.posAtEnd}let o;if(e==this.dom&&this.contentDOM)o=t>Y(this.contentDOM);else if(this.contentDOM&&this.contentDOM!=this.dom&&this.dom.contains(this.contentDOM))o=e.compareDocumentPosition(this.contentDOM)&2;else if(this.dom.firstChild){if(t==0)for(let i=e;;i=i.parentNode){if(i==this.dom){o=!1;break}if(i.previousSibling)break}if(o==null&&t==e.childNodes.length)for(let i=e;;i=i.parentNode){if(i==this.dom){o=!0;break}if(i.nextSibling)break}}return o??r>0?this.posAtEnd:this.posAtStart}nearestDesc(e,t=!1){for(let r=!0,o=e;o;o=o.parentNode){let i=this.getDesc(o),s;if(i&&(!t||i.node))if(r&&(s=i.nodeDOM)&&!(s.nodeType==1?s.contains(e.nodeType==1?e:e.parentNode):s==e))r=!1;else return i}}getDesc(e){let t=e.pmViewDesc;for(let r=t;r;r=r.parent)if(r==this)return t}posFromDOM(e,t,r){for(let o=e;o;o=o.parentNode){let i=this.getDesc(o);if(i)return i.localPosFromDOM(e,t,r)}return-1}descAt(e){for(let t=0,r=0;t<this.children.length;t++){let o=this.children[t],i=r+o.size;if(r==e&&i!=r){for(;!o.border&&o.children.length;)for(let s=0;s<o.children.length;s++){let l=o.children[s];if(l.size){o=l;break}}return o}if(e<i)return o.descAt(e-r-o.border);r=i}}domFromPos(e,t){if(!this.contentDOM)return{node:this.dom,offset:0,atom:e+1};let r=0,o=0;for(let i=0;r<this.children.length;r++){let s=this.children[r],l=i+s.size;if(l>e||s instanceof Li){o=e-i;break}i=l}if(o)return this.children[r].domFromPos(o-this.children[r].border,t);for(let i;r&&!(i=this.children[r-1]).size&&i instanceof Pi&&i.side>=0;r--);if(t<=0){let i,s=!0;for(;i=r?this.children[r-1]:null,!(!i||i.dom.parentNode==this.contentDOM);r--,s=!1);return i&&t&&s&&!i.border&&!i.domAtom?i.domFromPos(i.size,t):{node:this.contentDOM,offset:i?Y(i.dom)+1:0}}else{let i,s=!0;for(;i=r<this.children.length?this.children[r]:null,!(!i||i.dom.parentNode==this.contentDOM);r++,s=!1);return i&&s&&!i.border&&!i.domAtom?i.domFromPos(0,t):{node:this.contentDOM,offset:i?Y(i.dom):this.contentDOM.childNodes.length}}}parseRange(e,t,r=0){if(this.children.length==0)return{node:this.contentDOM,from:e,to:t,fromOffset:0,toOffset:this.contentDOM.childNodes.length};let o=-1,i=-1;for(let s=r,l=0;;l++){let a=this.children[l],c=s+a.size;if(o==-1&&e<=c){let d=s+a.border;if(e>=d&&t<=c-a.border&&a.node&&a.contentDOM&&this.contentDOM.contains(a.contentDOM))return a.parseRange(e,t,d);e=s;for(let u=l;u>0;u--){let h=this.children[u-1];if(h.size&&h.dom.parentNode==this.contentDOM&&!h.emptyChildAt(1)){o=Y(h.dom)+1;break}e-=h.size}o==-1&&(o=0)}if(o>-1&&(c>t||l==this.children.length-1)){t=c;for(let d=l+1;d<this.children.length;d++){let u=this.children[d];if(u.size&&u.dom.parentNode==this.contentDOM&&!u.emptyChildAt(-1)){i=Y(u.dom);break}t+=u.size}i==-1&&(i=this.contentDOM.childNodes.length);break}s=c}return{node:this.contentDOM,from:e,to:t,fromOffset:o,toOffset:i}}emptyChildAt(e){if(this.border||!this.contentDOM||!this.children.length)return!1;let t=this.children[e<0?0:this.children.length-1];return t.size==0||t.emptyChildAt(e)}domAfterPos(e){let{node:t,offset:r}=this.domFromPos(e,0);if(t.nodeType!=1||r==t.childNodes.length)throw new RangeError("No node after pos "+e);return t.childNodes[r]}setSelection(e,t,r,o=!1){let i=Math.min(e,t),s=Math.max(e,t);for(let f=0,p=0;f<this.children.length;f++){let g=this.children[f],b=p+g.size;if(i>p&&s<b)return g.setSelection(e-p-g.border,t-p-g.border,r,o);p=b}let l=this.domFromPos(e,e?-1:1),a=t==e?l:this.domFromPos(t,t?-1:1),c=r.root.getSelection(),d=r.domSelectionRange(),u=!1;if((pe||X)&&e==t){let{node:f,offset:p}=l;if(f.nodeType==3){if(u=!!(p&&f.nodeValue[p-1]==`
`),u&&p==f.nodeValue.length)for(let g=f,b;g;g=g.parentNode){if(b=g.nextSibling){b.nodeName=="BR"&&(l=a={node:b.parentNode,offset:Y(b)+1});break}let x=g.pmViewDesc;if(x&&x.node&&x.node.isBlock)break}}else{let g=f.childNodes[p-1];u=g&&(g.nodeName=="BR"||g.contentEditable=="false")}}if(pe&&d.focusNode&&d.focusNode!=a.node&&d.focusNode.nodeType==1){let f=d.focusNode.childNodes[d.focusOffset];f&&f.contentEditable=="false"&&(o=!0)}if(!(o||u&&X)&&rt(l.node,l.offset,d.anchorNode,d.anchorOffset)&&rt(a.node,a.offset,d.focusNode,d.focusOffset))return;let h=!1;if((c.extend||e==t)&&!(u&&pe)){c.collapse(l.node,l.offset);try{e!=t&&c.extend(a.node,a.offset),h=!0}catch{}}if(!h){if(e>t){let p=l;l=a,a=p}let f=document.createRange();f.setEnd(a.node,a.offset),f.setStart(l.node,l.offset),c.removeAllRanges(),c.addRange(f)}}ignoreMutation(e){return!this.contentDOM&&e.type!="selection"}get contentLost(){return this.contentDOM&&this.contentDOM!=this.dom&&!this.dom.contains(this.contentDOM)}markDirty(e,t){for(let r=0,o=0;o<this.children.length;o++){let i=this.children[o],s=r+i.size;if(r==s?e<=s&&t>=r:e<s&&t>r){let l=r+i.border,a=s-i.border;if(e>=l&&t<=a){this.dirty=e==r||t==s?Ke:lo,e==l&&t==a&&(i.contentLost||i.dom.parentNode!=this.contentDOM)?i.dirty=Se:i.markDirty(e-l,t-l);return}else i.dirty=i.dom==i.contentDOM&&i.dom.parentNode==this.contentDOM&&!i.children.length?Ke:Se}r=s}this.dirty=Ke}markParentsDirty(){let e=1;for(let t=this.parent;t;t=t.parent,e++){let r=e==1?Ke:lo;t.dirty<r&&(t.dirty=r)}}get domAtom(){return!1}get ignoreForCoords(){return!1}get ignoreForSelection(){return!1}isText(e){return!1}}class Pi extends qt{constructor(e,t,r,o){let i,s=t.type.toDOM;if(typeof s=="function"&&(s=s(r,()=>{if(!i)return o;if(i.parent)return i.parent.posBeforeChild(i)})),!t.type.spec.raw){if(s.nodeType!=1){let l=document.createElement("span");l.appendChild(s),s=l}s.contentEditable="false",s.classList.add("ProseMirror-widget")}super(e,[],s,null),this.widget=t,this.widget=t,i=this}matchesWidget(e){return this.dirty==me&&e.type.eq(this.widget.type)}parseRule(){return{ignore:!0}}stopEvent(e){let t=this.widget.spec.stopEvent;return t?t(e):!1}ignoreMutation(e){return e.type!="selection"||this.widget.spec.ignoreSelection}destroy(){this.widget.type.destroy(this.dom),super.destroy()}get domAtom(){return!0}get ignoreForSelection(){return!!this.widget.type.spec.relaxedSide}get side(){return this.widget.type.side}}class Ba extends qt{constructor(e,t,r,o){super(e,[],t,null),this.textDOM=r,this.text=o}get size(){return this.text.length}localPosFromDOM(e,t){return e!=this.textDOM?this.posAtStart+(t?this.size:0):this.posAtStart+t}domFromPos(e){return{node:this.textDOM,offset:e}}ignoreMutation(e){return e.type==="characterData"&&e.target.nodeValue==e.oldValue}}class ot extends qt{constructor(e,t,r,o,i){super(e,[],r,o),this.mark=t,this.spec=i}static create(e,t,r,o){let i=o.nodeViews[t.type.name],s=i&&i(t,o,r);return(!s||!s.dom)&&(s=xt.renderSpec(document,t.type.spec.toDOM(t,r),null,t.attrs)),new ot(e,t,s.dom,s.contentDOM||s.dom,s)}parseRule(){return this.dirty&Se||this.mark.type.spec.reparseInView?null:{mark:this.mark.type.name,attrs:this.mark.attrs,contentElement:this.contentDOM}}matchesMark(e){return this.dirty!=Se&&this.mark.eq(e)}markDirty(e,t){if(super.markDirty(e,t),this.dirty!=me){let r=this.parent;for(;!r.node;)r=r.parent;r.dirty<this.dirty&&(r.dirty=this.dirty),this.dirty=me}}slice(e,t,r){let o=ot.create(this.parent,this.mark,!0,r),i=this.children,s=this.size;t<s&&(i=tr(i,t,s,r)),e>0&&(i=tr(i,0,e,r));for(let l=0;l<i.length;l++)i[l].parent=o;return o.children=i,o}ignoreMutation(e){return this.spec.ignoreMutation?this.spec.ignoreMutation(e):super.ignoreMutation(e)}destroy(){this.spec.destroy&&this.spec.destroy(),super.destroy()}}class _e extends qt{constructor(e,t,r,o,i,s,l,a,c){super(e,[],i,s),this.node=t,this.outerDeco=r,this.innerDeco=o,this.nodeDOM=l}static create(e,t,r,o,i,s){let l=i.nodeViews[t.type.name],a,c=l&&l(t,i,()=>{if(!a)return s;if(a.parent)return a.parent.posBeforeChild(a)},r,o),d=c&&c.dom,u=c&&c.contentDOM;if(t.isText){if(!d)d=document.createTextNode(t.text);else if(d.nodeType!=3)throw new RangeError("Text must be rendered as a DOM text node")}else d||({dom:d,contentDOM:u}=xt.renderSpec(document,t.type.spec.toDOM(t),null,t.attrs));!u&&!t.isText&&d.nodeName!="BR"&&(d.hasAttribute("contenteditable")||(d.contentEditable="false"),t.type.spec.draggable&&(d.draggable=!0));let h=d;return d=Vi(d,r,t),c?a=new Pa(e,t,r,o,d,u||null,h,c,i,s+1):t.isText?new vn(e,t,r,o,d,h,i):new _e(e,t,r,o,d,u||null,h,i,s+1)}parseRule(){if(this.node.type.spec.reparseInView)return null;let e={node:this.node.type.name,attrs:this.node.attrs};if(this.node.type.whitespace=="pre"&&(e.preserveWhitespace="full"),!this.contentDOM)e.getContent=()=>this.node.content;else if(!this.contentLost)e.contentElement=this.contentDOM;else{for(let t=this.children.length-1;t>=0;t--){let r=this.children[t];if(this.dom.contains(r.dom.parentNode)){e.contentElement=r.dom.parentNode;break}}e.contentElement||(e.getContent=()=>v.empty)}return e}matchesNode(e,t,r){return this.dirty==me&&e.eq(this.node)&&hn(t,this.outerDeco)&&r.eq(this.innerDeco)}get size(){return this.node.nodeSize}get border(){return this.node.isLeaf?0:1}updateChildren(e,t){let r=this.node.inlineContent,o=t,i=e.composing?this.localCompositionInfo(e,t):null,s=i&&i.pos>-1?i:null,l=i&&i.pos<0,a=new za(this,s&&s.node,e);Fa(this.node,this.innerDeco,(c,d,u)=>{c.spec.marks?a.syncToMarks(c.spec.marks,r,e,d):c.type.side>=0&&!u&&a.syncToMarks(d==this.node.childCount?B.none:this.node.child(d).marks,r,e,d),a.placeWidget(c,e,o)},(c,d,u,h)=>{a.syncToMarks(c.marks,r,e,h);let f;a.findNodeMatch(c,d,u,h)||l&&e.state.selection.from>o&&e.state.selection.to<o+c.nodeSize&&(f=a.findIndexWithChild(i.node))>-1&&a.updateNodeAt(c,d,u,f,e)||a.updateNextNode(c,d,u,e,h,o)||a.addNode(c,d,u,e,o),o+=c.nodeSize}),a.syncToMarks([],r,e,0),this.node.isTextblock&&a.addTextblockHacks(),a.destroyRest(),(a.changed||this.dirty==Ke)&&(s&&this.protectLocalComposition(e,s),zi(this.contentDOM,this.children,e),yt&&$a(this.dom))}localCompositionInfo(e,t){let{from:r,to:o}=e.state.selection;if(!(e.state.selection instanceof E)||r<t||o>t+this.node.content.size)return null;let i=e.input.compositionNode;if(!i||!this.dom.contains(i.parentNode))return null;if(this.node.inlineContent){let s=i.nodeValue,l=_a(this.node.content,s,r-t,o-t);return l<0?null:{node:i,pos:l,text:s}}else return{node:i,pos:-1,text:""}}protectLocalComposition(e,{node:t,pos:r,text:o}){if(this.getDesc(t))return;let i=t;for(;i.parentNode!=this.contentDOM;i=i.parentNode){for(;i.previousSibling;)i.parentNode.removeChild(i.previousSibling);for(;i.nextSibling;)i.parentNode.removeChild(i.nextSibling);i.pmViewDesc&&(i.pmViewDesc=void 0)}let s=new Ba(this,i,t,o);e.input.compositionNodes.push(s),this.children=tr(this.children,r,r+o.length,e,s)}update(e,t,r,o){return this.dirty==Se||!e.sameMarkup(this.node)?!1:(this.updateInner(e,t,r,o),!0)}updateInner(e,t,r,o){this.updateOuterDeco(t),this.node=e,this.innerDeco=r,this.contentDOM&&this.updateChildren(o,this.posAtStart),this.dirty=me}updateOuterDeco(e){if(hn(e,this.outerDeco))return;let t=this.nodeDOM.nodeType!=1,r=this.dom;this.dom=ji(this.dom,this.nodeDOM,er(this.outerDeco,this.node,t),er(e,this.node,t)),this.dom!=r&&(r.pmViewDesc=void 0,this.dom.pmViewDesc=this),this.outerDeco=e}selectNode(){this.nodeDOM.nodeType==1&&(this.nodeDOM.classList.add("ProseMirror-selectednode"),(this.contentDOM||!this.node.type.spec.draggable)&&(this.nodeDOM.draggable=!0))}deselectNode(){this.nodeDOM.nodeType==1&&(this.nodeDOM.classList.remove("ProseMirror-selectednode"),(this.contentDOM||!this.node.type.spec.draggable)&&this.nodeDOM.removeAttribute("draggable"))}get domAtom(){return this.node.isAtom}}function ao(n,e,t,r,o){Vi(r,e,n);let i=new _e(void 0,n,e,t,r,r,r,o,0);return i.contentDOM&&i.updateChildren(o,0),i}class vn extends _e{constructor(e,t,r,o,i,s,l){super(e,t,r,o,i,null,s,l,0)}parseRule(){let e=this.nodeDOM.parentNode;for(;e&&e!=this.dom&&!e.pmIsDeco;)e=e.parentNode;return{skip:e||!0}}update(e,t,r,o){return this.dirty==Se||this.dirty!=me&&!this.inParent()||!e.sameMarkup(this.node)?!1:(this.updateOuterDeco(t),(this.dirty!=me||e.text!=this.node.text)&&e.text!=this.nodeDOM.nodeValue&&(this.nodeDOM.nodeValue=e.text,o.trackWrites==this.nodeDOM&&(o.trackWrites=null)),this.node=e,this.dirty=me,!0)}inParent(){let e=this.parent.contentDOM;for(let t=this.nodeDOM;t;t=t.parentNode)if(t==e)return!0;return!1}domFromPos(e){return{node:this.nodeDOM,offset:e}}localPosFromDOM(e,t,r){return e==this.nodeDOM?this.posAtStart+Math.min(t,this.node.text.length):super.localPosFromDOM(e,t,r)}ignoreMutation(e){return e.type!="characterData"&&e.type!="selection"}slice(e,t,r){let o=this.node.cut(e,t),i=document.createTextNode(o.text);return new vn(this.parent,o,this.outerDeco,this.innerDeco,i,i,r)}markDirty(e,t){super.markDirty(e,t),this.dom!=this.nodeDOM&&(e==0||t==this.nodeDOM.nodeValue.length)&&(this.dirty=Se)}get domAtom(){return!1}isText(e){return this.node.text==e}}class Li extends qt{parseRule(){return{ignore:!0}}matchesHack(e){return this.dirty==me&&this.dom.nodeName==e}get domAtom(){return!0}get ignoreForCoords(){return this.dom.nodeName=="IMG"}}class Pa extends _e{constructor(e,t,r,o,i,s,l,a,c,d){super(e,t,r,o,i,s,l,c,d),this.spec=a}update(e,t,r,o){if(this.dirty==Se)return!1;if(this.spec.update&&(this.node.type==e.type||this.spec.multiType)){let i=this.spec.update(e,t,r);return i&&this.updateInner(e,t,r,o),i}else return!this.contentDOM&&!e.isLeaf?!1:super.update(e,t,r,o)}selectNode(){this.spec.selectNode?this.spec.selectNode():super.selectNode()}deselectNode(){this.spec.deselectNode?this.spec.deselectNode():super.deselectNode()}setSelection(e,t,r,o){this.spec.setSelection?this.spec.setSelection(e,t,r.root):super.setSelection(e,t,r,o)}destroy(){this.spec.destroy&&this.spec.destroy(),super.destroy()}stopEvent(e){return this.spec.stopEvent?this.spec.stopEvent(e):!1}ignoreMutation(e){return this.spec.ignoreMutation?this.spec.ignoreMutation(e):super.ignoreMutation(e)}}function zi(n,e,t){let r=n.firstChild,o=!1;for(let i=0;i<e.length;i++){let s=e[i],l=s.dom;if(l.parentNode==n){for(;l!=r;)r=co(r),o=!0;r=r.nextSibling}else o=!0,n.insertBefore(l,r);if(s instanceof ot){let a=r?r.previousSibling:n.lastChild;zi(s.contentDOM,s.children,t),r=a?a.nextSibling:n.firstChild}}for(;r;)r=co(r),o=!0;o&&t.trackWrites==n&&(t.trackWrites=null)}const At=function(n){n&&(this.nodeName=n)};At.prototype=Object.create(null);const Ye=[new At];function er(n,e,t){if(n.length==0)return Ye;let r=t?Ye[0]:new At,o=[r];for(let i=0;i<n.length;i++){let s=n[i].type.attrs;if(s){s.nodeName&&o.push(r=new At(s.nodeName));for(let l in s){let a=s[l];a!=null&&(t&&o.length==1&&o.push(r=new At(e.isInline?"span":"div")),l=="class"?r.class=(r.class?r.class+" ":"")+a:l=="style"?r.style=(r.style?r.style+";":"")+a:l!="nodeName"&&(r[l]=a))}}}return o}function ji(n,e,t,r){if(t==Ye&&r==Ye)return e;let o=e;for(let i=0;i<r.length;i++){let s=r[i],l=t[i];if(i){let a;l&&l.nodeName==s.nodeName&&o!=n&&(a=o.parentNode)&&a.nodeName.toLowerCase()==s.nodeName||(a=document.createElement(s.nodeName),a.pmIsDeco=!0,a.appendChild(o),l=Ye[0]),o=a}La(o,l||Ye[0],s)}return o}function La(n,e,t){for(let r in e)r!="class"&&r!="style"&&r!="nodeName"&&!(r in t)&&n.removeAttribute(r);for(let r in t)r!="class"&&r!="style"&&r!="nodeName"&&t[r]!=e[r]&&n.setAttribute(r,t[r]);if(e.class!=t.class){let r=e.class?e.class.split(" ").filter(Boolean):[],o=t.class?t.class.split(" ").filter(Boolean):[];for(let i=0;i<r.length;i++)o.indexOf(r[i])==-1&&n.classList.remove(r[i]);for(let i=0;i<o.length;i++)r.indexOf(o[i])==-1&&n.classList.add(o[i]);n.classList.length==0&&n.removeAttribute("class")}if(e.style!=t.style){if(e.style){let r=/\s*([\w\-\xa1-\uffff]+)\s*:(?:"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\(.*?\)|[^;])*/g,o;for(;o=r.exec(e.style);)n.style.removeProperty(o[1])}t.style&&(n.style.cssText+=t.style)}}function Vi(n,e,t){return ji(n,n,Ye,er(e,t,n.nodeType!=1))}function hn(n,e){if(n.length!=e.length)return!1;for(let t=0;t<n.length;t++)if(!n[t].type.eq(e[t].type))return!1;return!0}function co(n){let e=n.nextSibling;return n.parentNode.removeChild(n),e}class za{constructor(e,t,r){this.lock=t,this.view=r,this.index=0,this.stack=[],this.changed=!1,this.top=e,this.preMatch=ja(e.node.content,e)}destroyBetween(e,t){if(e!=t){for(let r=e;r<t;r++)this.top.children[r].destroy();this.top.children.splice(e,t-e),this.changed=!0}}destroyRest(){this.destroyBetween(this.index,this.top.children.length)}syncToMarks(e,t,r,o){let i=0,s=this.stack.length>>1,l=Math.min(s,e.length);for(;i<l&&(i==s-1?this.top:this.stack[i+1<<1]).matchesMark(e[i])&&e[i].type.spec.spanning!==!1;)i++;for(;i<s;)this.destroyRest(),this.top.dirty=me,this.index=this.stack.pop(),this.top=this.stack.pop(),s--;for(;s<e.length;){this.stack.push(this.top,this.index+1);let a=-1,c=this.top.children.length;o<this.preMatch.index&&(c=Math.min(this.index+3,c));for(let d=this.index;d<c;d++){let u=this.top.children[d];if(u.matchesMark(e[s])&&!this.isLocked(u.dom)){a=d;break}}if(a>-1)a>this.index&&(this.changed=!0,this.destroyBetween(this.index,a)),this.top=this.top.children[this.index];else{let d=ot.create(this.top,e[s],t,r);this.top.children.splice(this.index,0,d),this.top=d,this.changed=!0}this.index=0,s++}}findNodeMatch(e,t,r,o){let i=-1,s;if(o>=this.preMatch.index&&(s=this.preMatch.matches[o-this.preMatch.index]).parent==this.top&&s.matchesNode(e,t,r))i=this.top.children.indexOf(s,this.index);else for(let l=this.index,a=Math.min(this.top.children.length,l+5);l<a;l++){let c=this.top.children[l];if(c.matchesNode(e,t,r)&&!this.preMatch.matched.has(c)){i=l;break}}return i<0?!1:(this.destroyBetween(this.index,i),this.index++,!0)}updateNodeAt(e,t,r,o,i){let s=this.top.children[o];return s.dirty==Se&&s.dom==s.contentDOM&&(s.dirty=Ke),s.update(e,t,r,i)?(this.destroyBetween(this.index,o),this.index++,!0):!1}findIndexWithChild(e){for(;;){let t=e.parentNode;if(!t)return-1;if(t==this.top.contentDOM){let r=e.pmViewDesc;if(r){for(let o=this.index;o<this.top.children.length;o++)if(this.top.children[o]==r)return o}return-1}e=t}}updateNextNode(e,t,r,o,i,s){for(let l=this.index;l<this.top.children.length;l++){let a=this.top.children[l];if(a instanceof _e){let c=this.preMatch.matched.get(a);if(c!=null&&c!=i)return!1;let d=a.dom,u,h=this.isLocked(d)&&!(e.isText&&a.node&&a.node.isText&&a.nodeDOM.nodeValue==e.text&&a.dirty!=Se&&hn(t,a.outerDeco));if(!h&&a.update(e,t,r,o))return this.destroyBetween(this.index,l),a.dom!=d&&(this.changed=!0),this.index++,!0;if(!h&&(u=this.recreateWrapper(a,e,t,r,o,s)))return this.destroyBetween(this.index,l),this.top.children[this.index]=u,u.contentDOM&&(u.dirty=Ke,u.updateChildren(o,s+1),u.dirty=me),this.changed=!0,this.index++,!0;break}}return!1}recreateWrapper(e,t,r,o,i,s){if(e.dirty||t.isAtom||!e.children.length||!e.node.content.eq(t.content)||!hn(r,e.outerDeco)||!o.eq(e.innerDeco))return null;let l=_e.create(this.top,t,r,o,i,s);if(l.contentDOM){l.children=e.children,e.children=[];for(let a of l.children)a.parent=l}return e.destroy(),l}addNode(e,t,r,o,i){let s=_e.create(this.top,e,t,r,o,i);s.contentDOM&&s.updateChildren(o,i+1),this.top.children.splice(this.index++,0,s),this.changed=!0}placeWidget(e,t,r){let o=this.index<this.top.children.length?this.top.children[this.index]:null;if(o&&o.matchesWidget(e)&&(e==o.widget||!o.widget.type.toDOM.parentNode))this.index++;else{let i=new Pi(this.top,e,t,r);this.top.children.splice(this.index++,0,i),this.changed=!0}}addTextblockHacks(){let e=this.top.children[this.index-1],t=this.top;for(;e instanceof ot;)t=e,e=t.children[t.children.length-1];(!e||!(e instanceof vn)||/\n$/.test(e.node.text)||this.view.requiresGeckoHackNode&&/\s$/.test(e.node.text))&&((X||_)&&e&&e.dom.contentEditable=="false"&&this.addHackNode("IMG",t),this.addHackNode("BR",this.top))}addHackNode(e,t){if(t==this.top&&this.index<t.children.length&&t.children[this.index].matchesHack(e))this.index++;else{let r=document.createElement(e);e=="IMG"&&(r.className="ProseMirror-separator",r.alt=""),e=="BR"&&(r.className="ProseMirror-trailingBreak");let o=new Li(this.top,[],r,null);t!=this.top?t.children.push(o):t.children.splice(this.index++,0,o),this.changed=!0}}isLocked(e){return this.lock&&(e==this.lock||e.nodeType==1&&e.contains(this.lock.parentNode))}}function ja(n,e){let t=e,r=t.children.length,o=n.childCount,i=new Map,s=[];e:for(;o>0;){let l;for(;;)if(r){let c=t.children[r-1];if(c instanceof ot)t=c,r=c.children.length;else{l=c,r--;break}}else{if(t==e)break e;r=t.parent.children.indexOf(t),t=t.parent}let a=l.node;if(a){if(a!=n.child(o-1))break;--o,i.set(l,o),s.push(l)}}return{index:o,matched:i,matches:s.reverse()}}function Va(n,e){return n.type.side-e.type.side}function Fa(n,e,t,r){let o=e.locals(n),i=0;if(o.length==0){for(let c=0;c<n.childCount;c++){let d=n.child(c);r(d,o,e.forChild(i,d),c),i+=d.nodeSize}return}let s=0,l=[],a=null;for(let c=0;;){let d,u;for(;s<o.length&&o[s].to==i;){let b=o[s++];b.widget&&(d?(u||(u=[d])).push(b):d=b)}if(d)if(u){u.sort(Va);for(let b=0;b<u.length;b++)t(u[b],c,!!a)}else t(d,c,!!a);let h,f;if(a)f=-1,h=a,a=null;else if(c<n.childCount)f=c,h=n.child(c++);else break;for(let b=0;b<l.length;b++)l[b].to<=i&&l.splice(b--,1);for(;s<o.length&&o[s].from<=i&&o[s].to>i;)l.push(o[s++]);let p=i+h.nodeSize;if(h.isText){let b=p;s<o.length&&o[s].from<b&&(b=o[s].from);for(let x=0;x<l.length;x++)l[x].to<b&&(b=l[x].to);b<p&&(a=h.cut(b-i),h=h.cut(0,b-i),p=b,f=-1)}else for(;s<o.length&&o[s].to<p;)s++;let g=h.isInline&&!h.isLeaf?l.filter(b=>!b.inline):l.slice();r(h,g,e.forChild(i,h),f),i=p}}function $a(n){if(n.nodeName=="UL"||n.nodeName=="OL"){let e=n.style.cssText;n.style.cssText=e+"; list-style: square !important",window.getComputedStyle(n).listStyle,n.style.cssText=e}}function _a(n,e,t,r){for(let o=0,i=0;o<n.childCount&&i<=r;){let s=n.child(o++),l=i;if(i+=s.nodeSize,!s.isText)continue;let a=s.text;for(;o<n.childCount;){let c=n.child(o++);if(i+=c.nodeSize,!c.isText)break;a+=c.text}if(i>=t){if(i>=r&&a.slice(r-e.length-l,r-l)==e)return r-e.length;let c=l<r?a.lastIndexOf(e,r-l-1):-1;if(c>=0&&c+e.length+l>=t)return l+c;if(t==r&&a.length>=r+e.length-l&&a.slice(r-l,r-l+e.length)==e)return r}}return-1}function tr(n,e,t,r,o){let i=[];for(let s=0,l=0;s<n.length;s++){let a=n[s],c=l,d=l+=a.size;c>=t||d<=e?i.push(a):(c<e&&i.push(a.slice(0,e-c,r)),o&&(i.push(o),o=void 0),d>t&&i.push(a.slice(t-c,a.size,r)))}return i}function mr(n,e=null){let t=n.domSelectionRange(),r=n.state.doc;if(!t.focusNode)return null;let o=n.docView.nearestDesc(t.focusNode),i=o&&o.size==0,s=n.docView.posFromDOM(t.focusNode,t.focusOffset,1);if(s<0)return null;let l=r.resolve(s),a,c;if(wn(t)){for(a=s;o&&!o.node;)o=o.parent;let u=o.node;if(o&&u.isAtom&&A.isSelectable(u)&&o.parent&&!(u.isInline&&ma(t.focusNode,t.focusOffset,o.dom))){let h=o.posBefore;c=new A(s==h?l:r.resolve(h))}}else{if(t instanceof n.dom.ownerDocument.defaultView.Selection&&t.rangeCount>1){let u=s,h=s;for(let f=0;f<t.rangeCount;f++){let p=t.getRangeAt(f);u=Math.min(u,n.docView.posFromDOM(p.startContainer,p.startOffset,1)),h=Math.max(h,n.docView.posFromDOM(p.endContainer,p.endOffset,-1))}if(u<0)return null;[a,s]=h==n.state.selection.anchor?[h,u]:[u,h],l=r.resolve(s)}else a=n.docView.posFromDOM(t.anchorNode,t.anchorOffset,1);if(a<0)return null}let d=r.resolve(a);if(!c){let u=e=="pointer"||n.state.selection.head<l.pos&&!i?1:-1;c=gr(n,d,l,u)}return c}function Fi(n){return n.editable?n.hasFocus():_i(n)&&document.activeElement&&document.activeElement.contains(n.dom)}function De(n,e=!1){let t=n.state.selection;if($i(n,t),!!Fi(n)){if(!e&&n.input.mouseDown&&n.input.mouseDown.allowDefault&&_){let r=n.domSelectionRange(),o=n.domObserver.currentSelection;if(r.anchorNode&&o.anchorNode&&rt(r.anchorNode,r.anchorOffset,o.anchorNode,o.anchorOffset)){n.input.mouseDown.delayedSelectionSync=!0,n.domObserver.setCurSelection();return}}if(n.domObserver.disconnectSelection(),n.cursorWrapper)qa(n);else{let{anchor:r,head:o}=t,i,s;uo&&!(t instanceof E)&&(t.$from.parent.inlineContent||(i=ho(n,t.from)),!t.empty&&!t.$from.parent.inlineContent&&(s=ho(n,t.to))),n.docView.setSelection(r,o,n,e),uo&&(i&&fo(i),s&&fo(s)),t.visible?n.dom.classList.remove("ProseMirror-hideselection"):(n.dom.classList.add("ProseMirror-hideselection"),"onselectionchange"in document&&Wa(n))}n.domObserver.setCurSelection(),n.domObserver.connectSelection()}}const uo=X||_&&Oi<63;function ho(n,e){let{node:t,offset:r}=n.docView.domFromPos(e,0),o=r<t.childNodes.length?t.childNodes[r]:null,i=r?t.childNodes[r-1]:null;if(X&&o&&o.contentEditable=="false")return Fn(o);if((!o||o.contentEditable=="false")&&(!i||i.contentEditable=="false")){if(o)return Fn(o);if(i)return Fn(i)}}function Fn(n){return n.contentEditable="true",X&&n.draggable&&(n.draggable=!1,n.wasDraggable=!0),n}function fo(n){n.contentEditable="false",n.wasDraggable&&(n.draggable=!0,n.wasDraggable=null)}function Wa(n){let e=n.dom.ownerDocument;e.removeEventListener("selectionchange",n.input.hideSelectionGuard);let t=n.domSelectionRange(),r=t.anchorNode,o=t.anchorOffset;e.addEventListener("selectionchange",n.input.hideSelectionGuard=()=>{(t.anchorNode!=r||t.anchorOffset!=o)&&(e.removeEventListener("selectionchange",n.input.hideSelectionGuard),setTimeout(()=>{(!Fi(n)||n.state.selection.visible)&&n.dom.classList.remove("ProseMirror-hideselection")},20))})}function qa(n){let e=n.domSelection();if(!e)return;let t=n.cursorWrapper.dom,r=t.nodeName=="IMG";r?e.collapse(t.parentNode,Y(t)+1):e.collapse(t,0),!r&&!n.state.selection.visible&&le&&$e<=11&&(t.disabled=!0,t.disabled=!1)}function $i(n,e){if(e instanceof A){let t=n.docView.descAt(e.from);t!=n.lastSelectedViewDesc&&(po(n),t&&t.selectNode(),n.lastSelectedViewDesc=t)}else po(n)}function po(n){n.lastSelectedViewDesc&&(n.lastSelectedViewDesc.parent&&n.lastSelectedViewDesc.deselectNode(),n.lastSelectedViewDesc=void 0)}function gr(n,e,t,r){return n.someProp("createSelectionBetween",o=>o(n,e,t))||E.between(e,t,r)}function mo(n){return n.editable&&!n.hasFocus()?!1:_i(n)}function _i(n){let e=n.domSelectionRange();if(!e.anchorNode)return!1;try{return n.dom.contains(e.anchorNode.nodeType==3?e.anchorNode.parentNode:e.anchorNode)&&(n.editable||n.dom.contains(e.focusNode.nodeType==3?e.focusNode.parentNode:e.focusNode))}catch{return!1}}function Ha(n){let e=n.docView.domFromPos(n.state.selection.anchor,0),t=n.domSelectionRange();return rt(e.node,e.offset,t.anchorNode,t.anchorOffset)}function nr(n,e){let{$anchor:t,$head:r}=n.selection,o=e>0?t.max(r):t.min(r),i=o.parent.inlineContent?o.depth?n.doc.resolve(e>0?o.after():o.before()):null:o;return i&&I.findFrom(i,e)}function Be(n,e){return n.dispatch(n.state.tr.setSelection(e).scrollIntoView()),!0}function go(n,e,t){let r=n.state.selection;if(r instanceof E)if(t.indexOf("s")>-1){let{$head:o}=r,i=o.textOffset?null:e<0?o.nodeBefore:o.nodeAfter;if(!i||i.isText||!i.isLeaf)return!1;let s=n.state.doc.resolve(o.pos+i.nodeSize*(e<0?-1:1));return Be(n,new E(r.$anchor,s))}else if(r.empty){if(n.endOfTextblock(e>0?"forward":"backward")){let o=nr(n.state,e);return o&&o instanceof A?Be(n,o):!1}else if(!(he&&t.indexOf("m")>-1)){let o=r.$head,i=o.textOffset?null:e<0?o.nodeBefore:o.nodeAfter,s;if(!i||i.isText)return!1;let l=e<0?o.pos-i.nodeSize:o.pos;return i.isAtom||(s=n.docView.descAt(l))&&!s.contentDOM?A.isSelectable(i)?Be(n,new A(e<0?n.state.doc.resolve(o.pos-i.nodeSize):o)):Wt?Be(n,new E(n.state.doc.resolve(e<0?l:l+i.nodeSize))):!1:!1}}else return!1;else{if(r instanceof A&&r.node.isInline)return Be(n,new E(e>0?r.$to:r.$from));{let o=nr(n.state,e);return o?Be(n,o):!1}}}function fn(n){return n.nodeType==3?n.nodeValue.length:n.childNodes.length}function Et(n,e){let t=n.pmViewDesc;return t&&t.size==0&&(e<0||n.nextSibling||n.nodeName!="BR")}function at(n,e){return e<0?Ja(n):Ua(n)}function Ja(n){let e=n.domSelectionRange(),t=e.focusNode,r=e.focusOffset;if(!t)return;let o,i,s=!1;for(pe&&t.nodeType==1&&r<fn(t)&&Et(t.childNodes[r],-1)&&(s=!0);;)if(r>0){if(t.nodeType!=1)break;{let l=t.childNodes[r-1];if(Et(l,-1))o=t,i=--r;else if(l.nodeType==3)t=l,r=t.nodeValue.length;else break}}else{if(Wi(t))break;{let l=t.previousSibling;for(;l&&Et(l,-1);)o=t.parentNode,i=Y(l),l=l.previousSibling;if(l)t=l,r=fn(t);else{if(t=t.parentNode,t==n.dom)break;r=0}}}s?rr(n,t,r):o&&rr(n,o,i)}function Ua(n){let e=n.domSelectionRange(),t=e.focusNode,r=e.focusOffset;if(!t)return;let o=fn(t),i,s;for(;;)if(r<o){if(t.nodeType!=1)break;let l=t.childNodes[r];if(Et(l,1))i=t,s=++r;else break}else{if(Wi(t))break;{let l=t.nextSibling;for(;l&&Et(l,1);)i=l.parentNode,s=Y(l)+1,l=l.nextSibling;if(l)t=l,r=0,o=fn(t);else{if(t=t.parentNode,t==n.dom)break;r=o=0}}}i&&rr(n,i,s)}function Wi(n){let e=n.pmViewDesc;return e&&e.node&&e.node.isBlock}function Ka(n,e){for(;n&&e==n.childNodes.length&&!_t(n);)e=Y(n)+1,n=n.parentNode;for(;n&&e<n.childNodes.length;){let t=n.childNodes[e];if(t.nodeType==3)return t;if(t.nodeType==1&&t.contentEditable=="false")break;n=t,e=0}}function Ya(n,e){for(;n&&!e&&!_t(n);)e=Y(n),n=n.parentNode;for(;n&&e;){let t=n.childNodes[e-1];if(t.nodeType==3)return t;if(t.nodeType==1&&t.contentEditable=="false")break;n=t,e=n.childNodes.length}}function rr(n,e,t){if(e.nodeType!=3){let i,s;(s=Ka(e,t))?(e=s,t=0):(i=Ya(e,t))&&(e=i,t=i.nodeValue.length)}let r=n.domSelection();if(!r)return;if(wn(r)){let i=document.createRange();i.setEnd(e,t),i.setStart(e,t),r.removeAllRanges(),r.addRange(i)}else r.extend&&r.extend(e,t);n.domObserver.setCurSelection();let{state:o}=n;setTimeout(()=>{n.state==o&&De(n)},50)}function bo(n,e){let t=n.state.doc.resolve(e);if(!(_||Ti)&&t.parent.inlineContent){let o=n.coordsAtPos(e);if(e>t.start()){let i=n.coordsAtPos(e-1),s=(i.top+i.bottom)/2;if(s>o.top&&s<o.bottom&&Math.abs(i.left-o.left)>1)return i.left<o.left?"ltr":"rtl"}if(e<t.end()){let i=n.coordsAtPos(e+1),s=(i.top+i.bottom)/2;if(s>o.top&&s<o.bottom&&Math.abs(i.left-o.left)>1)return i.left>o.left?"ltr":"rtl"}}return getComputedStyle(n.dom).direction=="rtl"?"rtl":"ltr"}function ko(n,e,t){let r=n.state.selection;if(r instanceof E&&!r.empty||t.indexOf("s")>-1||he&&t.indexOf("m")>-1)return!1;let{$from:o,$to:i}=r;if(!o.parent.inlineContent||n.endOfTextblock(e<0?"up":"down")){let s=nr(n.state,e);if(s&&s instanceof A)return Be(n,s)}if(!o.parent.inlineContent){let s=e<0?o:i,l=r instanceof se?I.near(s,e):I.findFrom(s,e);return l?Be(n,l):!1}return!1}function yo(n,e){if(!(n.state.selection instanceof E))return!0;let{$head:t,$anchor:r,empty:o}=n.state.selection;if(!t.sameParent(r))return!0;if(!o)return!1;if(n.endOfTextblock(e>0?"forward":"backward"))return!0;let i=!t.textOffset&&(e<0?t.nodeBefore:t.nodeAfter);if(i&&!i.isText){let s=n.state.tr;return e<0?s.delete(t.pos-i.nodeSize,t.pos):s.delete(t.pos,t.pos+i.nodeSize),n.dispatch(s),!0}return!1}function xo(n,e,t){n.domObserver.stop(),e.contentEditable=t,n.domObserver.start()}function Ga(n){if(!X||n.state.selection.$head.parentOffset>0)return!1;let{focusNode:e,focusOffset:t}=n.domSelectionRange();if(e&&e.nodeType==1&&t==0&&e.firstChild&&e.firstChild.contentEditable=="false"){let r=e.firstChild;xo(n,r,"true"),setTimeout(()=>xo(n,r,"false"),20)}return!1}function Xa(n){let e="";return n.ctrlKey&&(e+="c"),n.metaKey&&(e+="m"),n.altKey&&(e+="a"),n.shiftKey&&(e+="s"),e}function Za(n,e){let t=e.keyCode,r=Xa(e);if(t==8||he&&t==72&&r=="c")return yo(n,-1)||at(n,-1);if(t==46&&!e.shiftKey||he&&t==68&&r=="c")return yo(n,1)||at(n,1);if(t==13||t==27)return!0;if(t==37||he&&t==66&&r=="c"){let o=t==37?bo(n,n.state.selection.from)=="ltr"?-1:1:-1;return go(n,o,r)||at(n,o)}else if(t==39||he&&t==70&&r=="c"){let o=t==39?bo(n,n.state.selection.from)=="ltr"?1:-1:1;return go(n,o,r)||at(n,o)}else{if(t==38||he&&t==80&&r=="c")return ko(n,-1,r)||at(n,-1);if(t==40||he&&t==78&&r=="c")return Ga(n)||ko(n,1,r)||at(n,1);if(r==(he?"m":"c")&&(t==66||t==73||t==89||t==90))return!0}return!1}function br(n,e){n.someProp("transformCopied",f=>{e=f(e,n)});let t=[],{content:r,openStart:o,openEnd:i}=e;for(;o>1&&i>1&&r.childCount==1&&r.firstChild.childCount==1;){o--,i--;let f=r.firstChild;t.push(f.type.name,f.attrs!=f.type.defaultAttrs?f.attrs:null),r=f.content}let s=n.someProp("clipboardSerializer")||xt.fromSchema(n.state.schema),l=Yi(),a=l.createElement("div");a.appendChild(s.serializeFragment(r,{document:l}));let c=a.firstChild,d,u=0;for(;c&&c.nodeType==1&&(d=Ki[c.nodeName.toLowerCase()]);){for(let f=d.length-1;f>=0;f--){let p=l.createElement(d[f]);for(;a.firstChild;)p.appendChild(a.firstChild);a.appendChild(p),u++}c=a.firstChild}c&&c.nodeType==1&&c.setAttribute("data-pm-slice",`${o} ${i}${u?` -${u}`:""} ${JSON.stringify(t)}`);let h=n.someProp("clipboardTextSerializer",f=>f(e,n))||e.content.textBetween(0,e.content.size,`

`);return{dom:a,text:h,slice:e}}function qi(n,e,t,r,o){let i=o.parent.type.spec.code,s,l;if(!t&&!e)return null;let a=!!e&&(r||i||!t);if(a){if(n.someProp("transformPastedText",h=>{e=h(e,i||r,n)}),i)return l=new M(v.from(n.state.schema.text(e.replace(/\r\n?/g,`
`))),0,0),n.someProp("transformPasted",h=>{l=h(l,n,!0)}),l;let u=n.someProp("clipboardTextParser",h=>h(e,o,r,n));if(u)l=u;else{let h=o.marks(),{schema:f}=n.state,p=xt.fromSchema(f);s=document.createElement("div"),e.split(/(?:\r\n?|\n)+/).forEach(g=>{let b=s.appendChild(document.createElement("p"));g&&b.appendChild(p.serializeNode(f.text(g,h)))})}}else n.someProp("transformPastedHTML",u=>{t=u(t,n)}),s=nc(t),Wt&&rc(s);let c=s&&s.querySelector("[data-pm-slice]"),d=c&&/^(\d+) (\d+)(?: -(\d+))? (.*)/.exec(c.getAttribute("data-pm-slice")||"");if(d&&d[3])for(let u=+d[3];u>0;u--){let h=s.firstChild;for(;h&&h.nodeType!=1;)h=h.nextSibling;if(!h)break;s=h}if(l||(l=(n.someProp("clipboardParser")||n.someProp("domParser")||It.fromSchema(n.state.schema)).parseSlice(s,{preserveWhitespace:!!(a||d),context:o,ruleFromNode(h){return h.nodeName=="BR"&&!h.nextSibling&&h.parentNode&&!Qa.test(h.parentNode.nodeName)?{ignore:!0}:null}})),d)l=oc(wo(l,+d[1],+d[2]),d[4]);else if(l=M.maxOpen(ec(l.content,o),!0),l.openStart||l.openEnd){let u=0,h=0;for(let f=l.content.firstChild;u<l.openStart&&!f.type.spec.isolating;u++,f=f.firstChild);for(let f=l.content.lastChild;h<l.openEnd&&!f.type.spec.isolating;h++,f=f.lastChild);l=wo(l,u,h)}return n.someProp("transformPasted",u=>{l=u(l,n,a)}),l}const Qa=/^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var)$/i;function ec(n,e){if(n.childCount<2)return n;for(let t=e.depth;t>=0;t--){let o=e.node(t).contentMatchAt(e.index(t)),i,s=[];if(n.forEach(l=>{if(!s)return;let a=o.findWrapping(l.type),c;if(!a)return s=null;if(c=s.length&&i.length&&Ji(a,i,l,s[s.length-1],0))s[s.length-1]=c;else{s.length&&(s[s.length-1]=Ui(s[s.length-1],i.length));let d=Hi(l,a);s.push(d),o=o.matchType(d.type),i=a}}),s)return v.from(s)}return n}function Hi(n,e,t=0){for(let r=e.length-1;r>=t;r--)n=e[r].create(null,v.from(n));return n}function Ji(n,e,t,r,o){if(o<n.length&&o<e.length&&n[o]==e[o]){let i=Ji(n,e,t,r.lastChild,o+1);if(i)return r.copy(r.content.replaceChild(r.childCount-1,i));if(r.contentMatchAt(r.childCount).matchType(o==n.length-1?t.type:n[o+1]))return r.copy(r.content.append(v.from(Hi(t,n,o+1))))}}function Ui(n,e){if(e==0)return n;let t=n.content.replaceChild(n.childCount-1,Ui(n.lastChild,e-1)),r=n.contentMatchAt(n.childCount).fillBefore(v.empty,!0);return n.copy(t.append(r))}function or(n,e,t,r,o,i){let s=e<0?n.firstChild:n.lastChild,l=s.content;return n.childCount>1&&(i=0),o<r-1&&(l=or(l,e,t,r,o+1,i)),o>=t&&(l=e<0?s.contentMatchAt(0).fillBefore(l,i<=o).append(l):l.append(s.contentMatchAt(s.childCount).fillBefore(v.empty,!0))),n.replaceChild(e<0?0:n.childCount-1,s.copy(l))}function wo(n,e,t){return e<n.openStart&&(n=new M(or(n.content,-1,e,n.openStart,0,n.openEnd),e,n.openEnd)),t<n.openEnd&&(n=new M(or(n.content,1,t,n.openEnd,0,0),n.openStart,t)),n}const Ki={thead:["table"],tbody:["table"],tfoot:["table"],caption:["table"],colgroup:["table"],col:["table","colgroup"],tr:["table","tbody"],td:["table","tbody","tr"],th:["table","tbody","tr"]};let vo=null;function Yi(){return vo||(vo=document.implementation.createHTMLDocument("title"))}let $n=null;function tc(n){let e=window.trustedTypes;return e?($n||($n=e.defaultPolicy||e.createPolicy("ProseMirrorClipboard",{createHTML:t=>t})),$n.createHTML(n)):n}function nc(n){let e=/^(\s*<meta [^>]*>)*/.exec(n);e&&(n=n.slice(e[0].length));let t=Yi().createElement("div"),r=/<([a-z][^>\s]+)/i.exec(n),o;if((o=r&&Ki[r[1].toLowerCase()])&&(n=o.map(i=>"<"+i+">").join("")+n+o.map(i=>"</"+i+">").reverse().join("")),t.innerHTML=tc(n),o)for(let i=0;i<o.length;i++)t=t.querySelector(o[i])||t;return t}function rc(n){let e=n.querySelectorAll(_?"span:not([class]):not([style])":"span.Apple-converted-space");for(let t=0;t<e.length;t++){let r=e[t];r.childNodes.length==1&&r.textContent==" "&&r.parentNode&&r.parentNode.replaceChild(n.ownerDocument.createTextNode(" "),r)}}function oc(n,e){if(!n.size)return n;let t=n.content.firstChild.type.schema,r;try{r=JSON.parse(e)}catch{return n}let{content:o,openStart:i,openEnd:s}=n;for(let l=r.length-2;l>=0;l-=2){let a=t.nodes[r[l]];if(!a||a.hasRequiredAttrs())break;o=v.from(a.create(r[l+1],o)),i++,s++}return new M(o,i,s)}const ne={},re={},ic={touchstart:!0,touchmove:!0};class sc{constructor(){this.shiftKey=!1,this.mouseDown=null,this.lastKeyCode=null,this.lastKeyCodeTime=0,this.lastClick={time:0,x:0,y:0,type:"",button:0},this.lastSelectionOrigin=null,this.lastSelectionTime=0,this.lastIOSEnter=0,this.lastIOSEnterFallbackTimeout=-1,this.lastFocus=0,this.lastTouch=0,this.lastChromeDelete=0,this.composing=!1,this.compositionNode=null,this.composingTimeout=-1,this.compositionNodes=[],this.compositionEndedAt=-2e8,this.compositionID=1,this.badSafariComposition=!1,this.compositionPendingChanges=0,this.domChangeCount=0,this.eventHandlers=Object.create(null),this.hideSelectionGuard=null}}function lc(n){for(let e in ne){let t=ne[e];n.dom.addEventListener(e,n.input.eventHandlers[e]=r=>{cc(n,r)&&!kr(n,r)&&(n.editable||!(r.type in re))&&t(n,r)},ic[e]?{passive:!0}:void 0)}X&&n.dom.addEventListener("input",()=>null),ir(n)}function Ve(n,e){n.input.lastSelectionOrigin=e,n.input.lastSelectionTime=Date.now()}function ac(n){n.domObserver.stop();for(let e in n.input.eventHandlers)n.dom.removeEventListener(e,n.input.eventHandlers[e]);clearTimeout(n.input.composingTimeout),clearTimeout(n.input.lastIOSEnterFallbackTimeout)}function ir(n){n.someProp("handleDOMEvents",e=>{for(let t in e)n.input.eventHandlers[t]||n.dom.addEventListener(t,n.input.eventHandlers[t]=r=>kr(n,r))})}function kr(n,e){return n.someProp("handleDOMEvents",t=>{let r=t[e.type];return r?r(n,e)||e.defaultPrevented:!1})}function cc(n,e){if(!e.bubbles)return!0;if(e.defaultPrevented)return!1;for(let t=e.target;t!=n.dom;t=t.parentNode)if(!t||t.nodeType==11||t.pmViewDesc&&t.pmViewDesc.stopEvent(e))return!1;return!0}function dc(n,e){!kr(n,e)&&ne[e.type]&&(n.editable||!(e.type in re))&&ne[e.type](n,e)}re.keydown=(n,e)=>{let t=e;if(n.input.shiftKey=t.keyCode==16||t.shiftKey,!Xi(n,t)&&(n.input.lastKeyCode=t.keyCode,n.input.lastKeyCodeTime=Date.now(),!(Te&&_&&t.keyCode==13)))if(t.keyCode!=229&&n.domObserver.forceFlush(),yt&&t.keyCode==13&&!t.ctrlKey&&!t.altKey&&!t.metaKey){let r=Date.now();n.input.lastIOSEnter=r,n.input.lastIOSEnterFallbackTimeout=setTimeout(()=>{n.input.lastIOSEnter==r&&(n.someProp("handleKeyDown",o=>o(n,Ue(13,"Enter"))),n.input.lastIOSEnter=0)},200)}else n.someProp("handleKeyDown",r=>r(n,t))||Za(n,t)?t.preventDefault():Ve(n,"key")};re.keyup=(n,e)=>{e.keyCode==16&&(n.input.shiftKey=!1)};re.keypress=(n,e)=>{let t=e;if(Xi(n,t)||!t.charCode||t.ctrlKey&&!t.altKey||he&&t.metaKey)return;if(n.someProp("handleKeyPress",o=>o(n,t))){t.preventDefault();return}let r=n.state.selection;if(!(r instanceof E)||!r.$from.sameParent(r.$to)){let o=String.fromCharCode(t.charCode),i=()=>n.state.tr.insertText(o).scrollIntoView();!/[\r\n]/.test(o)&&!n.someProp("handleTextInput",s=>s(n,r.$from.pos,r.$to.pos,o,i))&&n.dispatch(i()),t.preventDefault()}};function Sn(n){return{left:n.clientX,top:n.clientY}}function uc(n,e){let t=e.x-n.clientX,r=e.y-n.clientY;return t*t+r*r<100}function yr(n,e,t,r,o){if(r==-1)return!1;let i=n.state.doc.resolve(r);for(let s=i.depth+1;s>0;s--)if(n.someProp(e,l=>s>i.depth?l(n,t,i.nodeAfter,i.before(s),o,!0):l(n,t,i.node(s),i.before(s),o,!1)))return!0;return!1}function pt(n,e,t){if(n.focused||n.focus(),n.state.selection.eq(e))return;let r=n.state.tr.setSelection(e);r.setMeta("pointer",!0),n.dispatch(r)}function hc(n,e){if(e==-1)return!1;let t=n.state.doc.resolve(e),r=t.nodeAfter;return r&&r.isAtom&&A.isSelectable(r)?(pt(n,new A(t)),!0):!1}function fc(n,e){if(e==-1)return!1;let t=n.state.selection,r,o;t instanceof A&&(r=t.node);let i=n.state.doc.resolve(e);for(let s=i.depth+1;s>0;s--){let l=s>i.depth?i.nodeAfter:i.node(s);if(A.isSelectable(l)){r&&t.$from.depth>0&&s>=t.$from.depth&&i.before(t.$from.depth+1)==t.$from.pos?o=i.before(t.$from.depth):o=i.before(s);break}}return o!=null?(pt(n,A.create(n.state.doc,o)),!0):!1}function pc(n,e,t,r,o){return yr(n,"handleClickOn",e,t,r)||n.someProp("handleClick",i=>i(n,e,r))||(o?fc(n,t):hc(n,t))}function mc(n,e,t,r){return yr(n,"handleDoubleClickOn",e,t,r)||n.someProp("handleDoubleClick",o=>o(n,e,r))}function gc(n,e,t,r){return yr(n,"handleTripleClickOn",e,t,r)||n.someProp("handleTripleClick",o=>o(n,e,r))||bc(n,t,r)}function bc(n,e,t){if(t.button!=0)return!1;let r=n.state.doc;if(e==-1)return r.inlineContent?(pt(n,E.create(r,0,r.content.size)),!0):!1;let o=r.resolve(e);for(let i=o.depth+1;i>0;i--){let s=i>o.depth?o.nodeAfter:o.node(i),l=o.before(i);if(s.inlineContent)pt(n,E.create(r,l+1,l+1+s.content.size));else if(A.isSelectable(s))pt(n,A.create(r,l));else continue;return!0}}function xr(n){return pn(n)}const Gi=he?"metaKey":"ctrlKey";ne.mousedown=(n,e)=>{let t=e;n.input.shiftKey=t.shiftKey;let r=xr(n),o=Date.now(),i="singleClick";o-n.input.lastClick.time<500&&uc(t,n.input.lastClick)&&!t[Gi]&&n.input.lastClick.button==t.button&&(n.input.lastClick.type=="singleClick"?i="doubleClick":n.input.lastClick.type=="doubleClick"&&(i="tripleClick")),n.input.lastClick={time:o,x:t.clientX,y:t.clientY,type:i,button:t.button};let s=n.posAtCoords(Sn(t));s&&(i=="singleClick"?(n.input.mouseDown&&n.input.mouseDown.done(),n.input.mouseDown=new kc(n,s,t,!!r)):(i=="doubleClick"?mc:gc)(n,s.pos,s.inside,t)?t.preventDefault():Ve(n,"pointer"))};class kc{constructor(e,t,r,o){this.view=e,this.pos=t,this.event=r,this.flushed=o,this.delayedSelectionSync=!1,this.mightDrag=null,this.startDoc=e.state.doc,this.selectNode=!!r[Gi],this.allowDefault=r.shiftKey;let i,s;if(t.inside>-1)i=e.state.doc.nodeAt(t.inside),s=t.inside;else{let d=e.state.doc.resolve(t.pos);i=d.parent,s=d.depth?d.before():0}const l=o?null:r.target,a=l?e.docView.nearestDesc(l,!0):null;this.target=a&&a.nodeDOM.nodeType==1?a.nodeDOM:null;let{selection:c}=e.state;(r.button==0&&i.type.spec.draggable&&i.type.spec.selectable!==!1||c instanceof A&&c.from<=s&&c.to>s)&&(this.mightDrag={node:i,pos:s,addAttr:!!(this.target&&!this.target.draggable),setUneditable:!!(this.target&&pe&&!this.target.hasAttribute("contentEditable"))}),this.target&&this.mightDrag&&(this.mightDrag.addAttr||this.mightDrag.setUneditable)&&(this.view.domObserver.stop(),this.mightDrag.addAttr&&(this.target.draggable=!0),this.mightDrag.setUneditable&&setTimeout(()=>{this.view.input.mouseDown==this&&this.target.setAttribute("contentEditable","false")},20),this.view.domObserver.start()),e.root.addEventListener("mouseup",this.up=this.up.bind(this)),e.root.addEventListener("mousemove",this.move=this.move.bind(this)),Ve(e,"pointer")}done(){this.view.root.removeEventListener("mouseup",this.up),this.view.root.removeEventListener("mousemove",this.move),this.mightDrag&&this.target&&(this.view.domObserver.stop(),this.mightDrag.addAttr&&this.target.removeAttribute("draggable"),this.mightDrag.setUneditable&&this.target.removeAttribute("contentEditable"),this.view.domObserver.start()),this.delayedSelectionSync&&setTimeout(()=>De(this.view)),this.view.input.mouseDown=null}up(e){if(this.done(),!this.view.dom.contains(e.target))return;let t=this.pos;this.view.state.doc!=this.startDoc&&(t=this.view.posAtCoords(Sn(e))),this.updateAllowDefault(e),this.allowDefault||!t?Ve(this.view,"pointer"):pc(this.view,t.pos,t.inside,e,this.selectNode)?e.preventDefault():e.button==0&&(this.flushed||X&&this.mightDrag&&!this.mightDrag.node.isAtom||_&&!this.view.state.selection.visible&&Math.min(Math.abs(t.pos-this.view.state.selection.from),Math.abs(t.pos-this.view.state.selection.to))<=2)?(pt(this.view,I.near(this.view.state.doc.resolve(t.pos))),e.preventDefault()):Ve(this.view,"pointer")}move(e){this.updateAllowDefault(e),Ve(this.view,"pointer"),e.buttons==0&&this.done()}updateAllowDefault(e){!this.allowDefault&&(Math.abs(this.event.x-e.clientX)>4||Math.abs(this.event.y-e.clientY)>4)&&(this.allowDefault=!0)}}ne.touchstart=n=>{n.input.lastTouch=Date.now(),xr(n),Ve(n,"pointer")};ne.touchmove=n=>{n.input.lastTouch=Date.now(),Ve(n,"pointer")};ne.contextmenu=n=>xr(n);function Xi(n,e){return n.composing?!0:X&&Math.abs(e.timeStamp-n.input.compositionEndedAt)<500?(n.input.compositionEndedAt=-2e8,!0):!1}const yc=Te?5e3:-1;re.compositionstart=re.compositionupdate=n=>{if(!n.composing){n.domObserver.flush();let{state:e}=n,t=e.selection.$to;if(e.selection instanceof E&&(e.storedMarks||!t.textOffset&&t.parentOffset&&t.nodeBefore.marks.some(r=>r.type.spec.inclusive===!1)||_&&Ti&&xc(n)))n.markCursor=n.state.storedMarks||t.marks(),pn(n,!0),n.markCursor=null;else if(pn(n,!e.selection.empty),pe&&e.selection.empty&&t.parentOffset&&!t.textOffset&&t.nodeBefore.marks.length){let r=n.domSelectionRange();for(let o=r.focusNode,i=r.focusOffset;o&&o.nodeType==1&&i!=0;){let s=i<0?o.lastChild:o.childNodes[i-1];if(!s)break;if(s.nodeType==3){let l=n.domSelection();l&&l.collapse(s,s.nodeValue.length);break}else o=s,i=-1}}n.input.composing=!0}Zi(n,yc)};function xc(n){let{focusNode:e,focusOffset:t}=n.domSelectionRange();if(!e||e.nodeType!=1||t>=e.childNodes.length)return!1;let r=e.childNodes[t];return r.nodeType==1&&r.contentEditable=="false"}re.compositionend=(n,e)=>{n.composing&&(n.input.composing=!1,n.input.compositionEndedAt=e.timeStamp,n.input.compositionPendingChanges=n.domObserver.pendingRecords().length?n.input.compositionID:0,n.input.compositionNode=null,n.input.badSafariComposition?n.domObserver.forceFlush():n.input.compositionPendingChanges&&Promise.resolve().then(()=>n.domObserver.flush()),n.input.compositionID++,Zi(n,20))};function Zi(n,e){clearTimeout(n.input.composingTimeout),e>-1&&(n.input.composingTimeout=setTimeout(()=>pn(n),e))}function Qi(n){for(n.composing&&(n.input.composing=!1,n.input.compositionEndedAt=vc());n.input.compositionNodes.length>0;)n.input.compositionNodes.pop().markParentsDirty()}function wc(n){let e=n.domSelectionRange();if(!e.focusNode)return null;let t=fa(e.focusNode,e.focusOffset),r=pa(e.focusNode,e.focusOffset);if(t&&r&&t!=r){let o=r.pmViewDesc,i=n.domObserver.lastChangedTextNode;if(t==i||r==i)return i;if(!o||!o.isText(r.nodeValue))return r;if(n.input.compositionNode==r){let s=t.pmViewDesc;if(!(!s||!s.isText(t.nodeValue)))return r}}return t||r}function vc(){let n=document.createEvent("Event");return n.initEvent("event",!0,!0),n.timeStamp}function pn(n,e=!1){if(!(Te&&n.domObserver.flushingSoon>=0)){if(n.domObserver.forceFlush(),Qi(n),e||n.docView&&n.docView.dirty){let t=mr(n),r=n.state.selection;return t&&!t.eq(r)?n.dispatch(n.state.tr.setSelection(t)):(n.markCursor||e)&&!r.$from.node(r.$from.sharedDepth(r.to)).inlineContent?n.dispatch(n.state.tr.deleteSelection()):n.updateState(n.state),!0}return!1}}function Sc(n,e){if(!n.dom.parentNode)return;let t=n.dom.parentNode.appendChild(document.createElement("div"));t.appendChild(e),t.style.cssText="position: fixed; left: -10000px; top: 10px";let r=getSelection(),o=document.createRange();o.selectNodeContents(e),n.dom.blur(),r.removeAllRanges(),r.addRange(o),setTimeout(()=>{t.parentNode&&t.parentNode.removeChild(t),n.focus()},50)}const jt=le&&$e<15||yt&&ka<604;ne.copy=re.cut=(n,e)=>{let t=e,r=n.state.selection,o=t.type=="cut";if(r.empty)return;let i=jt?null:t.clipboardData,s=r.content(),{dom:l,text:a}=br(n,s);i?(t.preventDefault(),i.clearData(),i.setData("text/html",l.innerHTML),i.setData("text/plain",a)):Sc(n,l),o&&n.dispatch(n.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent","cut"))};function Cc(n){return n.openStart==0&&n.openEnd==0&&n.content.childCount==1?n.content.firstChild:null}function Mc(n,e){if(!n.dom.parentNode)return;let t=n.input.shiftKey||n.state.selection.$from.parent.type.spec.code,r=n.dom.parentNode.appendChild(document.createElement(t?"textarea":"div"));t||(r.contentEditable="true"),r.style.cssText="position: fixed; left: -10000px; top: 10px",r.focus();let o=n.input.shiftKey&&n.input.lastKeyCode!=45;setTimeout(()=>{n.focus(),r.parentNode&&r.parentNode.removeChild(r),t?Vt(n,r.value,null,o,e):Vt(n,r.textContent,r.innerHTML,o,e)},50)}function Vt(n,e,t,r,o){let i=qi(n,e,t,r,n.state.selection.$from);if(n.someProp("handlePaste",a=>a(n,o,i||M.empty)))return!0;if(!i)return!1;let s=Cc(i),l=s?n.state.tr.replaceSelectionWith(s,r):n.state.tr.replaceSelection(i);return n.dispatch(l.scrollIntoView().setMeta("paste",!0).setMeta("uiEvent","paste")),!0}function es(n){let e=n.getData("text/plain")||n.getData("Text");if(e)return e;let t=n.getData("text/uri-list");return t?t.replace(/\r?\n/g," "):""}re.paste=(n,e)=>{let t=e;if(n.composing&&!Te)return;let r=jt?null:t.clipboardData,o=n.input.shiftKey&&n.input.lastKeyCode!=45;r&&Vt(n,es(r),r.getData("text/html"),o,t)?t.preventDefault():Mc(n,t)};class ts{constructor(e,t,r){this.slice=e,this.move=t,this.node=r}}const Nc=he?"altKey":"ctrlKey";function ns(n,e){let t=n.someProp("dragCopies",r=>!r(e));return t??!e[Nc]}ne.dragstart=(n,e)=>{let t=e,r=n.input.mouseDown;if(r&&r.done(),!t.dataTransfer)return;let o=n.state.selection,i=o.empty?null:n.posAtCoords(Sn(t)),s;if(!(i&&i.pos>=o.from&&i.pos<=(o instanceof A?o.to-1:o.to))){if(r&&r.mightDrag)s=A.create(n.state.doc,r.mightDrag.pos);else if(t.target&&t.target.nodeType==1){let u=n.docView.nearestDesc(t.target,!0);u&&u.node.type.spec.draggable&&u!=n.docView&&(s=A.create(n.state.doc,u.posBefore))}}let l=(s||n.state.selection).content(),{dom:a,text:c,slice:d}=br(n,l);(!t.dataTransfer.files.length||!_||Oi>120)&&t.dataTransfer.clearData(),t.dataTransfer.setData(jt?"Text":"text/html",a.innerHTML),t.dataTransfer.effectAllowed="copyMove",jt||t.dataTransfer.setData("text/plain",c),n.dragging=new ts(d,ns(n,t),s)};ne.dragend=n=>{let e=n.dragging;window.setTimeout(()=>{n.dragging==e&&(n.dragging=null)},50)};re.dragover=re.dragenter=(n,e)=>e.preventDefault();re.drop=(n,e)=>{try{Oc(n,e,n.dragging)}finally{n.dragging=null}};function Oc(n,e,t){if(!e.dataTransfer)return;let r=n.posAtCoords(Sn(e));if(!r)return;let o=n.state.doc.resolve(r.pos),i=t&&t.slice;i?n.someProp("transformPasted",f=>{i=f(i,n,!1)}):i=qi(n,es(e.dataTransfer),jt?null:e.dataTransfer.getData("text/html"),!1,o);let s=!!(t&&ns(n,e));if(n.someProp("handleDrop",f=>f(n,e,i||M.empty,s))){e.preventDefault();return}if(!i)return;e.preventDefault();let l=i?ci(n.state.doc,o.pos,i):o.pos;l==null&&(l=o.pos);let a=n.state.tr;if(s){let{node:f}=t;f?f.replace(a):a.deleteSelection()}let c=a.mapping.map(l),d=i.openStart==0&&i.openEnd==0&&i.content.childCount==1,u=a.doc;if(d?a.replaceRangeWith(c,c,i.content.firstChild):a.replaceRange(c,c,i),a.doc.eq(u))return;let h=a.doc.resolve(c);if(d&&A.isSelectable(i.content.firstChild)&&h.nodeAfter&&h.nodeAfter.sameMarkup(i.content.firstChild))a.setSelection(new A(h));else{let f=a.mapping.map(l);a.mapping.maps[a.mapping.maps.length-1].forEach((p,g,b,x)=>f=x),a.setSelection(gr(n,h,a.doc.resolve(f)))}n.focus(),n.dispatch(a.setMeta("uiEvent","drop"))}ne.focus=n=>{n.input.lastFocus=Date.now(),n.focused||(n.domObserver.stop(),n.dom.classList.add("ProseMirror-focused"),n.domObserver.start(),n.focused=!0,setTimeout(()=>{n.docView&&n.hasFocus()&&!n.domObserver.currentSelection.eq(n.domSelectionRange())&&De(n)},20))};ne.blur=(n,e)=>{let t=e;n.focused&&(n.domObserver.stop(),n.dom.classList.remove("ProseMirror-focused"),n.domObserver.start(),t.relatedTarget&&n.dom.contains(t.relatedTarget)&&n.domObserver.currentSelection.clear(),n.focused=!1)};ne.beforeinput=(n,e)=>{if(_&&Te&&e.inputType=="deleteContentBackward"){n.domObserver.flushSoon();let{domChangeCount:r}=n.input;setTimeout(()=>{if(n.input.domChangeCount!=r||(n.dom.blur(),n.focus(),n.someProp("handleKeyDown",i=>i(n,Ue(8,"Backspace")))))return;let{$cursor:o}=n.state.selection;o&&o.pos>0&&n.dispatch(n.state.tr.delete(o.pos-1,o.pos).scrollIntoView())},50)}};for(let n in re)ne[n]=re[n];function Ft(n,e){if(n==e)return!0;for(let t in n)if(n[t]!==e[t])return!1;for(let t in e)if(!(t in n))return!1;return!0}class mn{constructor(e,t){this.toDOM=e,this.spec=t||Qe,this.side=this.spec.side||0}map(e,t,r,o){let{pos:i,deleted:s}=e.mapResult(t.from+o,this.side<0?-1:1);return s?null:new W(i-r,i-r,this)}valid(){return!0}eq(e){return this==e||e instanceof mn&&(this.spec.key&&this.spec.key==e.spec.key||this.toDOM==e.toDOM&&Ft(this.spec,e.spec))}destroy(e){this.spec.destroy&&this.spec.destroy(e)}}class We{constructor(e,t){this.attrs=e,this.spec=t||Qe}map(e,t,r,o){let i=e.map(t.from+o,this.spec.inclusiveStart?-1:1)-r,s=e.map(t.to+o,this.spec.inclusiveEnd?1:-1)-r;return i>=s?null:new W(i,s,this)}valid(e,t){return t.from<t.to}eq(e){return this==e||e instanceof We&&Ft(this.attrs,e.attrs)&&Ft(this.spec,e.spec)}static is(e){return e.type instanceof We}destroy(){}}class wr{constructor(e,t){this.attrs=e,this.spec=t||Qe}map(e,t,r,o){let i=e.mapResult(t.from+o,1);if(i.deleted)return null;let s=e.mapResult(t.to+o,-1);return s.deleted||s.pos<=i.pos?null:new W(i.pos-r,s.pos-r,this)}valid(e,t){let{index:r,offset:o}=e.content.findIndex(t.from),i;return o==t.from&&!(i=e.child(r)).isText&&o+i.nodeSize==t.to}eq(e){return this==e||e instanceof wr&&Ft(this.attrs,e.attrs)&&Ft(this.spec,e.spec)}destroy(){}}class W{constructor(e,t,r){this.from=e,this.to=t,this.type=r}copy(e,t){return new W(e,t,this.type)}eq(e,t=0){return this.type.eq(e.type)&&this.from+t==e.from&&this.to+t==e.to}map(e,t,r){return this.type.map(e,this,t,r)}static widget(e,t,r){return new W(e,e,new mn(t,r))}static inline(e,t,r,o){return new W(e,t,new We(r,o))}static node(e,t,r,o){return new W(e,t,new wr(r,o))}get spec(){return this.type.spec}get inline(){return this.type instanceof We}get widget(){return this.type instanceof mn}}const dt=[],Qe={};class L{constructor(e,t){this.local=e.length?e:dt,this.children=t.length?t:dt}static create(e,t){return t.length?gn(t,e,0,Qe):Q}find(e,t,r){let o=[];return this.findInner(e??0,t??1e9,o,0,r),o}findInner(e,t,r,o,i){for(let s=0;s<this.local.length;s++){let l=this.local[s];l.from<=t&&l.to>=e&&(!i||i(l.spec))&&r.push(l.copy(l.from+o,l.to+o))}for(let s=0;s<this.children.length;s+=3)if(this.children[s]<t&&this.children[s+1]>e){let l=this.children[s]+1;this.children[s+2].findInner(e-l,t-l,r,o+l,i)}}map(e,t,r){return this==Q||e.maps.length==0?this:this.mapInner(e,t,0,0,r||Qe)}mapInner(e,t,r,o,i){let s;for(let l=0;l<this.local.length;l++){let a=this.local[l].map(e,r,o);a&&a.type.valid(t,a)?(s||(s=[])).push(a):i.onRemove&&i.onRemove(this.local[l].spec)}return this.children.length?Tc(this.children,s||[],e,t,r,o,i):s?new L(s.sort(et),dt):Q}add(e,t){return t.length?this==Q?L.create(e,t):this.addInner(e,t,0):this}addInner(e,t,r){let o,i=0;e.forEach((l,a)=>{let c=a+r,d;if(d=is(t,l,c)){for(o||(o=this.children.slice());i<o.length&&o[i]<a;)i+=3;o[i]==a?o[i+2]=o[i+2].addInner(l,d,c+1):o.splice(i,0,a,a+l.nodeSize,gn(d,l,c+1,Qe)),i+=3}});let s=rs(i?ss(t):t,-r);for(let l=0;l<s.length;l++)s[l].type.valid(e,s[l])||s.splice(l--,1);return new L(s.length?this.local.concat(s).sort(et):this.local,o||this.children)}remove(e){return e.length==0||this==Q?this:this.removeInner(e,0)}removeInner(e,t){let r=this.children,o=this.local;for(let i=0;i<r.length;i+=3){let s,l=r[i]+t,a=r[i+1]+t;for(let d=0,u;d<e.length;d++)(u=e[d])&&u.from>l&&u.to<a&&(e[d]=null,(s||(s=[])).push(u));if(!s)continue;r==this.children&&(r=this.children.slice());let c=r[i+2].removeInner(s,l+1);c!=Q?r[i+2]=c:(r.splice(i,3),i-=3)}if(o.length){for(let i=0,s;i<e.length;i++)if(s=e[i])for(let l=0;l<o.length;l++)o[l].eq(s,t)&&(o==this.local&&(o=this.local.slice()),o.splice(l--,1))}return r==this.children&&o==this.local?this:o.length||r.length?new L(o,r):Q}forChild(e,t){if(this==Q)return this;if(t.isLeaf)return L.empty;let r,o;for(let l=0;l<this.children.length;l+=3)if(this.children[l]>=e){this.children[l]==e&&(r=this.children[l+2]);break}let i=e+1,s=i+t.content.size;for(let l=0;l<this.local.length;l++){let a=this.local[l];if(a.from<s&&a.to>i&&a.type instanceof We){let c=Math.max(i,a.from)-i,d=Math.min(s,a.to)-i;c<d&&(o||(o=[])).push(a.copy(c,d))}}if(o){let l=new L(o.sort(et),dt);return r?new Le([l,r]):l}return r||Q}eq(e){if(this==e)return!0;if(!(e instanceof L)||this.local.length!=e.local.length||this.children.length!=e.children.length)return!1;for(let t=0;t<this.local.length;t++)if(!this.local[t].eq(e.local[t]))return!1;for(let t=0;t<this.children.length;t+=3)if(this.children[t]!=e.children[t]||this.children[t+1]!=e.children[t+1]||!this.children[t+2].eq(e.children[t+2]))return!1;return!0}locals(e){return vr(this.localsInner(e))}localsInner(e){if(this==Q)return dt;if(e.inlineContent||!this.local.some(We.is))return this.local;let t=[];for(let r=0;r<this.local.length;r++)this.local[r].type instanceof We||t.push(this.local[r]);return t}forEachSet(e){e(this)}}L.empty=new L([],[]);L.removeOverlap=vr;const Q=L.empty;class Le{constructor(e){this.members=e}map(e,t){const r=this.members.map(o=>o.map(e,t,Qe));return Le.from(r)}forChild(e,t){if(t.isLeaf)return L.empty;let r=[];for(let o=0;o<this.members.length;o++){let i=this.members[o].forChild(e,t);i!=Q&&(i instanceof Le?r=r.concat(i.members):r.push(i))}return Le.from(r)}eq(e){if(!(e instanceof Le)||e.members.length!=this.members.length)return!1;for(let t=0;t<this.members.length;t++)if(!this.members[t].eq(e.members[t]))return!1;return!0}locals(e){let t,r=!0;for(let o=0;o<this.members.length;o++){let i=this.members[o].localsInner(e);if(i.length)if(!t)t=i;else{r&&(t=t.slice(),r=!1);for(let s=0;s<i.length;s++)t.push(i[s])}}return t?vr(r?t:t.sort(et)):dt}static from(e){switch(e.length){case 0:return Q;case 1:return e[0];default:return new Le(e.every(t=>t instanceof L)?e:e.reduce((t,r)=>t.concat(r instanceof L?r:r.members),[]))}}forEachSet(e){for(let t=0;t<this.members.length;t++)this.members[t].forEachSet(e)}}function Tc(n,e,t,r,o,i,s){let l=n.slice();for(let c=0,d=i;c<t.maps.length;c++){let u=0;t.maps[c].forEach((h,f,p,g)=>{let b=g-p-(f-h);for(let x=0;x<l.length;x+=3){let w=l[x+1];if(w<0||h>w+d-u)continue;let k=l[x]+d-u;f>=k?l[x+1]=h<=k?-2:-1:h>=d&&b&&(l[x]+=b,l[x+1]+=b)}u+=b}),d=t.maps[c].map(d,-1)}let a=!1;for(let c=0;c<l.length;c+=3)if(l[c+1]<0){if(l[c+1]==-2){a=!0,l[c+1]=-1;continue}let d=t.map(n[c]+i),u=d-o;if(u<0||u>=r.content.size){a=!0;continue}let h=t.map(n[c+1]+i,-1),f=h-o,{index:p,offset:g}=r.content.findIndex(u),b=r.maybeChild(p);if(b&&g==u&&g+b.nodeSize==f){let x=l[c+2].mapInner(t,b,d+1,n[c]+i+1,s);x!=Q?(l[c]=u,l[c+1]=f,l[c+2]=x):(l[c+1]=-2,a=!0)}else a=!0}if(a){let c=Dc(l,n,e,t,o,i,s),d=gn(c,r,0,s);e=d.local;for(let u=0;u<l.length;u+=3)l[u+1]<0&&(l.splice(u,3),u-=3);for(let u=0,h=0;u<d.children.length;u+=3){let f=d.children[u];for(;h<l.length&&l[h]<f;)h+=3;l.splice(h,0,d.children[u],d.children[u+1],d.children[u+2])}}return new L(e.sort(et),l)}function rs(n,e){if(!e||!n.length)return n;let t=[];for(let r=0;r<n.length;r++){let o=n[r];t.push(new W(o.from+e,o.to+e,o.type))}return t}function Dc(n,e,t,r,o,i,s){function l(a,c){for(let d=0;d<a.local.length;d++){let u=a.local[d].map(r,o,c);u?t.push(u):s.onRemove&&s.onRemove(a.local[d].spec)}for(let d=0;d<a.children.length;d+=3)l(a.children[d+2],a.children[d]+c+1)}for(let a=0;a<n.length;a+=3)n[a+1]==-1&&l(n[a+2],e[a]+i+1);return t}function is(n,e,t){if(e.isLeaf)return null;let r=t+e.nodeSize,o=null;for(let i=0,s;i<n.length;i++)(s=n[i])&&s.from>t&&s.to<r&&((o||(o=[])).push(s),n[i]=null);return o}function ss(n){let e=[];for(let t=0;t<n.length;t++)n[t]!=null&&e.push(n[t]);return e}function gn(n,e,t,r){let o=[],i=!1;e.forEach((l,a)=>{let c=is(n,l,a+t);if(c){i=!0;let d=gn(c,l,t+a+1,r);d!=Q&&o.push(a,a+l.nodeSize,d)}});let s=rs(i?ss(n):n,-t).sort(et);for(let l=0;l<s.length;l++)s[l].type.valid(e,s[l])||(r.onRemove&&r.onRemove(s[l].spec),s.splice(l--,1));return s.length||o.length?new L(s,o):Q}function et(n,e){return n.from-e.from||n.to-e.to}function vr(n){let e=n;for(let t=0;t<e.length-1;t++){let r=e[t];if(r.from!=r.to)for(let o=t+1;o<e.length;o++){let i=e[o];if(i.from==r.from){i.to!=r.to&&(e==n&&(e=n.slice()),e[o]=i.copy(i.from,r.to),So(e,o+1,i.copy(r.to,i.to)));continue}else{i.from<r.to&&(e==n&&(e=n.slice()),e[t]=r.copy(r.from,i.from),So(e,o,r.copy(i.from,r.to)));break}}}return e}function So(n,e,t){for(;e<n.length&&et(t,n[e])>0;)e++;n.splice(e,0,t)}function _n(n){let e=[];return n.someProp("decorations",t=>{let r=t(n.state);r&&r!=Q&&e.push(r)}),n.cursorWrapper&&e.push(L.create(n.state.doc,[n.cursorWrapper.deco])),Le.from(e)}const Ac={childList:!0,characterData:!0,characterDataOldValue:!0,attributes:!0,attributeOldValue:!0,subtree:!0},Ec=le&&$e<=11;class Rc{constructor(){this.anchorNode=null,this.anchorOffset=0,this.focusNode=null,this.focusOffset=0}set(e){this.anchorNode=e.anchorNode,this.anchorOffset=e.anchorOffset,this.focusNode=e.focusNode,this.focusOffset=e.focusOffset}clear(){this.anchorNode=this.focusNode=null}eq(e){return e.anchorNode==this.anchorNode&&e.anchorOffset==this.anchorOffset&&e.focusNode==this.focusNode&&e.focusOffset==this.focusOffset}}class Ic{constructor(e,t){this.view=e,this.handleDOMChange=t,this.queue=[],this.flushingSoon=-1,this.observer=null,this.currentSelection=new Rc,this.onCharData=null,this.suppressingSelectionUpdates=!1,this.lastChangedTextNode=null,this.observer=window.MutationObserver&&new window.MutationObserver(r=>{for(let o=0;o<r.length;o++)this.queue.push(r[o]);le&&$e<=11&&r.some(o=>o.type=="childList"&&o.removedNodes.length||o.type=="characterData"&&o.oldValue.length>o.target.nodeValue.length)?this.flushSoon():X&&e.composing&&r.some(o=>o.type=="childList"&&o.target.nodeName=="TR")?(e.input.badSafariComposition=!0,this.flushSoon()):this.flush()}),Ec&&(this.onCharData=r=>{this.queue.push({target:r.target,type:"characterData",oldValue:r.prevValue}),this.flushSoon()}),this.onSelectionChange=this.onSelectionChange.bind(this)}flushSoon(){this.flushingSoon<0&&(this.flushingSoon=window.setTimeout(()=>{this.flushingSoon=-1,this.flush()},20))}forceFlush(){this.flushingSoon>-1&&(window.clearTimeout(this.flushingSoon),this.flushingSoon=-1,this.flush())}start(){this.observer&&(this.observer.takeRecords(),this.observer.observe(this.view.dom,Ac)),this.onCharData&&this.view.dom.addEventListener("DOMCharacterDataModified",this.onCharData),this.connectSelection()}stop(){if(this.observer){let e=this.observer.takeRecords();if(e.length){for(let t=0;t<e.length;t++)this.queue.push(e[t]);window.setTimeout(()=>this.flush(),20)}this.observer.disconnect()}this.onCharData&&this.view.dom.removeEventListener("DOMCharacterDataModified",this.onCharData),this.disconnectSelection()}connectSelection(){this.view.dom.ownerDocument.addEventListener("selectionchange",this.onSelectionChange)}disconnectSelection(){this.view.dom.ownerDocument.removeEventListener("selectionchange",this.onSelectionChange)}suppressSelectionUpdates(){this.suppressingSelectionUpdates=!0,setTimeout(()=>this.suppressingSelectionUpdates=!1,50)}onSelectionChange(){if(mo(this.view)){if(this.suppressingSelectionUpdates)return De(this.view);if(le&&$e<=11&&!this.view.state.selection.empty){let e=this.view.domSelectionRange();if(e.focusNode&&rt(e.focusNode,e.focusOffset,e.anchorNode,e.anchorOffset))return this.flushSoon()}this.flush()}}setCurSelection(){this.currentSelection.set(this.view.domSelectionRange())}ignoreSelectionChange(e){if(!e.focusNode)return!0;let t=new Set,r;for(let i=e.focusNode;i;i=kt(i))t.add(i);for(let i=e.anchorNode;i;i=kt(i))if(t.has(i)){r=i;break}let o=r&&this.view.docView.nearestDesc(r);if(o&&o.ignoreMutation({type:"selection",target:r.nodeType==3?r.parentNode:r}))return this.setCurSelection(),!0}pendingRecords(){if(this.observer)for(let e of this.observer.takeRecords())this.queue.push(e);return this.queue}flush(){let{view:e}=this;if(!e.docView||this.flushingSoon>-1)return;let t=this.pendingRecords();t.length&&(this.queue=[]);let r=e.domSelectionRange(),o=!this.suppressingSelectionUpdates&&!this.currentSelection.eq(r)&&mo(e)&&!this.ignoreSelectionChange(r),i=-1,s=-1,l=!1,a=[];if(e.editable)for(let d=0;d<t.length;d++){let u=this.registerMutation(t[d],a);u&&(i=i<0?u.from:Math.min(u.from,i),s=s<0?u.to:Math.max(u.to,s),u.typeOver&&(l=!0))}if(pe&&a.length){let d=a.filter(u=>u.nodeName=="BR");if(d.length==2){let[u,h]=d;u.parentNode&&u.parentNode.parentNode==h.parentNode?h.remove():u.remove()}else{let{focusNode:u}=this.currentSelection;for(let h of d){let f=h.parentNode;f&&f.nodeName=="LI"&&(!u||Lc(e,u)!=f)&&h.remove()}}}else if((_||X)&&a.some(d=>d.nodeName=="BR")&&(e.input.lastKeyCode==8||e.input.lastKeyCode==46)){for(let d of a)if(d.nodeName=="BR"&&d.parentNode){let u=d.nextSibling;u&&u.nodeType==1&&u.contentEditable=="false"&&d.parentNode.removeChild(d)}}let c=null;i<0&&o&&e.input.lastFocus>Date.now()-200&&Math.max(e.input.lastTouch,e.input.lastClick.time)<Date.now()-300&&wn(r)&&(c=mr(e))&&c.eq(I.near(e.state.doc.resolve(0),1))?(e.input.lastFocus=0,De(e),this.currentSelection.set(r),e.scrollToSelection()):(i>-1||o)&&(i>-1&&(e.docView.markDirty(i,s),Bc(e)),e.input.badSafariComposition&&(e.input.badSafariComposition=!1,zc(e,a)),this.handleDOMChange(i,s,l,a),e.docView&&e.docView.dirty?e.updateState(e.state):this.currentSelection.eq(r)||De(e),this.currentSelection.set(r))}registerMutation(e,t){if(t.indexOf(e.target)>-1)return null;let r=this.view.docView.nearestDesc(e.target);if(e.type=="attributes"&&(r==this.view.docView||e.attributeName=="contenteditable"||e.attributeName=="style"&&!e.oldValue&&!e.target.getAttribute("style"))||!r||r.ignoreMutation(e))return null;if(e.type=="childList"){for(let d=0;d<e.addedNodes.length;d++){let u=e.addedNodes[d];t.push(u),u.nodeType==3&&(this.lastChangedTextNode=u)}if(r.contentDOM&&r.contentDOM!=r.dom&&!r.contentDOM.contains(e.target))return{from:r.posBefore,to:r.posAfter};let o=e.previousSibling,i=e.nextSibling;if(le&&$e<=11&&e.addedNodes.length)for(let d=0;d<e.addedNodes.length;d++){let{previousSibling:u,nextSibling:h}=e.addedNodes[d];(!u||Array.prototype.indexOf.call(e.addedNodes,u)<0)&&(o=u),(!h||Array.prototype.indexOf.call(e.addedNodes,h)<0)&&(i=h)}let s=o&&o.parentNode==e.target?Y(o)+1:0,l=r.localPosFromDOM(e.target,s,-1),a=i&&i.parentNode==e.target?Y(i):e.target.childNodes.length,c=r.localPosFromDOM(e.target,a,1);return{from:l,to:c}}else return e.type=="attributes"?{from:r.posAtStart-r.border,to:r.posAtEnd+r.border}:(this.lastChangedTextNode=e.target,{from:r.posAtStart,to:r.posAtEnd,typeOver:e.target.nodeValue==e.oldValue})}}let Co=new WeakMap,Mo=!1;function Bc(n){if(!Co.has(n)&&(Co.set(n,null),["normal","nowrap","pre-line"].indexOf(getComputedStyle(n.dom).whiteSpace)!==-1)){if(n.requiresGeckoHackNode=pe,Mo)return;console.warn("ProseMirror expects the CSS white-space property to be set, preferably to 'pre-wrap'. It is recommended to load style/prosemirror.css from the prosemirror-view package."),Mo=!0}}function No(n,e){let t=e.startContainer,r=e.startOffset,o=e.endContainer,i=e.endOffset,s=n.domAtPos(n.state.selection.anchor);return rt(s.node,s.offset,o,i)&&([t,r,o,i]=[o,i,t,r]),{anchorNode:t,anchorOffset:r,focusNode:o,focusOffset:i}}function Pc(n,e){if(e.getComposedRanges){let o=e.getComposedRanges(n.root)[0];if(o)return No(n,o)}let t;function r(o){o.preventDefault(),o.stopImmediatePropagation(),t=o.getTargetRanges()[0]}return n.dom.addEventListener("beforeinput",r,!0),document.execCommand("indent"),n.dom.removeEventListener("beforeinput",r,!0),t?No(n,t):null}function Lc(n,e){for(let t=e.parentNode;t&&t!=n.dom;t=t.parentNode){let r=n.docView.nearestDesc(t,!0);if(r&&r.node.isBlock)return t}return null}function zc(n,e){var t;let{focusNode:r,focusOffset:o}=n.domSelectionRange();for(let i of e)if(((t=i.parentNode)===null||t===void 0?void 0:t.nodeName)=="TR"){let s=i.nextSibling;for(;s&&s.nodeName!="TD"&&s.nodeName!="TH";)s=s.nextSibling;if(s){let l=s;for(;;){let a=l.firstChild;if(!a||a.nodeType!=1||a.contentEditable=="false"||/^(BR|IMG)$/.test(a.nodeName))break;l=a}l.insertBefore(i,l.firstChild),r==i&&n.domSelection().collapse(i,o)}else i.parentNode.removeChild(i)}}function jc(n,e,t){let{node:r,fromOffset:o,toOffset:i,from:s,to:l}=n.docView.parseRange(e,t),a=n.domSelectionRange(),c,d=a.anchorNode;if(d&&n.dom.contains(d.nodeType==1?d:d.parentNode)&&(c=[{node:d,offset:a.anchorOffset}],wn(a)||c.push({node:a.focusNode,offset:a.focusOffset})),_&&n.input.lastKeyCode===8)for(let b=i;b>o;b--){let x=r.childNodes[b-1],w=x.pmViewDesc;if(x.nodeName=="BR"&&!w){i=b;break}if(!w||w.size)break}let u=n.state.doc,h=n.someProp("domParser")||It.fromSchema(n.state.schema),f=u.resolve(s),p=null,g=h.parse(r,{topNode:f.parent,topMatch:f.parent.contentMatchAt(f.index()),topOpen:!0,from:o,to:i,preserveWhitespace:f.parent.type.whitespace=="pre"?"full":!0,findPositions:c,ruleFromNode:Vc,context:f});if(c&&c[0].pos!=null){let b=c[0].pos,x=c[1]&&c[1].pos;x==null&&(x=b),p={anchor:b+s,head:x+s}}return{doc:g,sel:p,from:s,to:l}}function Vc(n){let e=n.pmViewDesc;if(e)return e.parseRule();if(n.nodeName=="BR"&&n.parentNode){if(X&&/^(ul|ol)$/i.test(n.parentNode.nodeName)){let t=document.createElement("div");return t.appendChild(document.createElement("li")),{skip:t}}else if(n.parentNode.lastChild==n||X&&/^(tr|table)$/i.test(n.parentNode.nodeName))return{ignore:!0}}else if(n.nodeName=="IMG"&&n.getAttribute("mark-placeholder"))return{ignore:!0};return null}const Fc=/^(a|abbr|acronym|b|bd[io]|big|br|button|cite|code|data(list)?|del|dfn|em|i|img|ins|kbd|label|map|mark|meter|output|q|ruby|s|samp|small|span|strong|su[bp]|time|u|tt|var)$/i;function $c(n,e,t,r,o){let i=n.input.compositionPendingChanges||(n.composing?n.input.compositionID:0);if(n.input.compositionPendingChanges=0,e<0){let y=n.input.lastSelectionTime>Date.now()-50?n.input.lastSelectionOrigin:null,T=mr(n,y);if(T&&!n.state.selection.eq(T)){if(_&&Te&&n.input.lastKeyCode===13&&Date.now()-100<n.input.lastKeyCodeTime&&n.someProp("handleKeyDown",R=>R(n,Ue(13,"Enter"))))return;let D=n.state.tr.setSelection(T);y=="pointer"?D.setMeta("pointer",!0):y=="key"&&D.scrollIntoView(),i&&D.setMeta("composition",i),n.dispatch(D)}return}let s=n.state.doc.resolve(e),l=s.sharedDepth(t);e=s.before(l+1),t=n.state.doc.resolve(t).after(l+1);let a=n.state.selection,c=jc(n,e,t),d=n.state.doc,u=d.slice(c.from,c.to),h,f;n.input.lastKeyCode===8&&Date.now()-100<n.input.lastKeyCodeTime?(h=n.state.selection.to,f="end"):(h=n.state.selection.from,f="start"),n.input.lastKeyCode=null;let p=qc(u.content,c.doc.content,c.from,h,f);if(p&&n.input.domChangeCount++,(yt&&n.input.lastIOSEnter>Date.now()-225||Te)&&o.some(y=>y.nodeType==1&&!Fc.test(y.nodeName))&&(!p||p.endA>=p.endB)&&n.someProp("handleKeyDown",y=>y(n,Ue(13,"Enter")))){n.input.lastIOSEnter=0;return}if(!p)if(r&&a instanceof E&&!a.empty&&a.$head.sameParent(a.$anchor)&&!n.composing&&!(c.sel&&c.sel.anchor!=c.sel.head))p={start:a.from,endA:a.to,endB:a.to};else{if(c.sel){let y=Oo(n,n.state.doc,c.sel);if(y&&!y.eq(n.state.selection)){let T=n.state.tr.setSelection(y);i&&T.setMeta("composition",i),n.dispatch(T)}}return}n.state.selection.from<n.state.selection.to&&p.start==p.endB&&n.state.selection instanceof E&&(p.start>n.state.selection.from&&p.start<=n.state.selection.from+2&&n.state.selection.from>=c.from?p.start=n.state.selection.from:p.endA<n.state.selection.to&&p.endA>=n.state.selection.to-2&&n.state.selection.to<=c.to&&(p.endB+=n.state.selection.to-p.endA,p.endA=n.state.selection.to)),le&&$e<=11&&p.endB==p.start+1&&p.endA==p.start&&p.start>c.from&&c.doc.textBetween(p.start-c.from-1,p.start-c.from+1)=="  "&&(p.start--,p.endA--,p.endB--);let g=c.doc.resolveNoCache(p.start-c.from),b=c.doc.resolveNoCache(p.endB-c.from),x=d.resolve(p.start),w=g.sameParent(b)&&g.parent.inlineContent&&x.end()>=p.endA;if((yt&&n.input.lastIOSEnter>Date.now()-225&&(!w||o.some(y=>y.nodeName=="DIV"||y.nodeName=="P"))||!w&&g.pos<c.doc.content.size&&(!g.sameParent(b)||!g.parent.inlineContent)&&g.pos<b.pos&&!/\S/.test(c.doc.textBetween(g.pos,b.pos,"","")))&&n.someProp("handleKeyDown",y=>y(n,Ue(13,"Enter")))){n.input.lastIOSEnter=0;return}if(n.state.selection.anchor>p.start&&Wc(d,p.start,p.endA,g,b)&&n.someProp("handleKeyDown",y=>y(n,Ue(8,"Backspace")))){Te&&_&&n.domObserver.suppressSelectionUpdates();return}_&&p.endB==p.start&&(n.input.lastChromeDelete=Date.now()),Te&&!w&&g.start()!=b.start()&&b.parentOffset==0&&g.depth==b.depth&&c.sel&&c.sel.anchor==c.sel.head&&c.sel.head==p.endA&&(p.endB-=2,b=c.doc.resolveNoCache(p.endB-c.from),setTimeout(()=>{n.someProp("handleKeyDown",function(y){return y(n,Ue(13,"Enter"))})},20));let k=p.start,C=p.endA,O=y=>{let T=y||n.state.tr.replace(k,C,c.doc.slice(p.start-c.from,p.endB-c.from));if(c.sel){let D=Oo(n,T.doc,c.sel);D&&!(_&&n.composing&&D.empty&&(p.start!=p.endB||n.input.lastChromeDelete<Date.now()-100)&&(D.head==k||D.head==T.mapping.map(C)-1)||le&&D.empty&&D.head==k)&&T.setSelection(D)}return i&&T.setMeta("composition",i),T.scrollIntoView()},S;if(w)if(g.pos==b.pos){le&&$e<=11&&g.parentOffset==0&&(n.domObserver.suppressSelectionUpdates(),setTimeout(()=>De(n),20));let y=O(n.state.tr.delete(k,C)),T=d.resolve(p.start).marksAcross(d.resolve(p.endA));T&&y.ensureMarks(T),n.dispatch(y)}else if(p.endA==p.endB&&(S=_c(g.parent.content.cut(g.parentOffset,b.parentOffset),x.parent.content.cut(x.parentOffset,p.endA-x.start())))){let y=O(n.state.tr);S.type=="add"?y.addMark(k,C,S.mark):y.removeMark(k,C,S.mark),n.dispatch(y)}else if(g.parent.child(g.index()).isText&&g.index()==b.index()-(b.textOffset?0:1)){let y=g.parent.textBetween(g.parentOffset,b.parentOffset),T=()=>O(n.state.tr.insertText(y,k,C));n.someProp("handleTextInput",D=>D(n,k,C,y,T))||n.dispatch(T())}else n.dispatch(O());else n.dispatch(O())}function Oo(n,e,t){return Math.max(t.anchor,t.head)>e.content.size?null:gr(n,e.resolve(t.anchor),e.resolve(t.head))}function _c(n,e){let t=n.firstChild.marks,r=e.firstChild.marks,o=t,i=r,s,l,a;for(let d=0;d<r.length;d++)o=r[d].removeFromSet(o);for(let d=0;d<t.length;d++)i=t[d].removeFromSet(i);if(o.length==1&&i.length==0)l=o[0],s="add",a=d=>d.mark(l.addToSet(d.marks));else if(o.length==0&&i.length==1)l=i[0],s="remove",a=d=>d.mark(l.removeFromSet(d.marks));else return null;let c=[];for(let d=0;d<e.childCount;d++)c.push(a(e.child(d)));if(v.from(c).eq(n))return{mark:l,type:s}}function Wc(n,e,t,r,o){if(t-e<=o.pos-r.pos||Wn(r,!0,!1)<o.pos)return!1;let i=n.resolve(e);if(!r.parent.isTextblock){let l=i.nodeAfter;return l!=null&&t==e+l.nodeSize}if(i.parentOffset<i.parent.content.size||!i.parent.isTextblock)return!1;let s=n.resolve(Wn(i,!0,!0));return!s.parent.isTextblock||s.pos>t||Wn(s,!0,!1)<t?!1:r.parent.content.cut(r.parentOffset).eq(s.parent.content)}function Wn(n,e,t){let r=n.depth,o=e?n.end():n.pos;for(;r>0&&(e||n.indexAfter(r)==n.node(r).childCount);)r--,o++,e=!1;if(t){let i=n.node(r).maybeChild(n.indexAfter(r));for(;i&&!i.isLeaf;)i=i.firstChild,o++}return o}function qc(n,e,t,r,o){let i=n.findDiffStart(e,t);if(i==null)return null;let{a:s,b:l}=n.findDiffEnd(e,t+n.size,t+e.size);if(o=="end"){let a=Math.max(0,i-Math.min(s,l));r-=s+a-i}if(s<i&&n.size<e.size){let a=r<=i&&r>=s?i-r:0;i-=a,i&&i<e.size&&To(e.textBetween(i-1,i+1))&&(i+=a?1:-1),l=i+(l-s),s=i}else if(l<i){let a=r<=i&&r>=l?i-r:0;i-=a,i&&i<n.size&&To(n.textBetween(i-1,i+1))&&(i+=a?1:-1),s=i+(s-l),l=i}return{start:i,endA:s,endB:l}}function To(n){if(n.length!=2)return!1;let e=n.charCodeAt(0),t=n.charCodeAt(1);return e>=56320&&e<=57343&&t>=55296&&t<=56319}class ls{constructor(e,t){this._root=null,this.focused=!1,this.trackWrites=null,this.mounted=!1,this.markCursor=null,this.cursorWrapper=null,this.lastSelectedViewDesc=void 0,this.input=new sc,this.prevDirectPlugins=[],this.pluginViews=[],this.requiresGeckoHackNode=!1,this.dragging=null,this._props=t,this.state=t.state,this.directPlugins=t.plugins||[],this.directPlugins.forEach(Io),this.dispatch=this.dispatch.bind(this),this.dom=e&&e.mount||document.createElement("div"),e&&(e.appendChild?e.appendChild(this.dom):typeof e=="function"?e(this.dom):e.mount&&(this.mounted=!0)),this.editable=Eo(this),Ao(this),this.nodeViews=Ro(this),this.docView=ao(this.state.doc,Do(this),_n(this),this.dom,this),this.domObserver=new Ic(this,(r,o,i,s)=>$c(this,r,o,i,s)),this.domObserver.start(),lc(this),this.updatePluginViews()}get composing(){return this.input.composing}get props(){if(this._props.state!=this.state){let e=this._props;this._props={};for(let t in e)this._props[t]=e[t];this._props.state=this.state}return this._props}update(e){e.handleDOMEvents!=this._props.handleDOMEvents&&ir(this);let t=this._props;this._props=e,e.plugins&&(e.plugins.forEach(Io),this.directPlugins=e.plugins),this.updateStateInner(e.state,t)}setProps(e){let t={};for(let r in this._props)t[r]=this._props[r];t.state=this.state;for(let r in e)t[r]=e[r];this.update(t)}updateState(e){this.updateStateInner(e,this._props)}updateStateInner(e,t){var r;let o=this.state,i=!1,s=!1;e.storedMarks&&this.composing&&(Qi(this),s=!0),this.state=e;let l=o.plugins!=e.plugins||this._props.plugins!=t.plugins;if(l||this._props.plugins!=t.plugins||this._props.nodeViews!=t.nodeViews){let f=Ro(this);Jc(f,this.nodeViews)&&(this.nodeViews=f,i=!0)}(l||t.handleDOMEvents!=this._props.handleDOMEvents)&&ir(this),this.editable=Eo(this),Ao(this);let a=_n(this),c=Do(this),d=o.plugins!=e.plugins&&!o.doc.eq(e.doc)?"reset":e.scrollToSelection>o.scrollToSelection?"to selection":"preserve",u=i||!this.docView.matchesNode(e.doc,c,a);(u||!e.selection.eq(o.selection))&&(s=!0);let h=d=="preserve"&&s&&this.dom.style.overflowAnchor==null&&wa(this);if(s){this.domObserver.stop();let f=u&&(le||_)&&!this.composing&&!o.selection.empty&&!e.selection.empty&&Hc(o.selection,e.selection);if(u){let p=_?this.trackWrites=this.domSelectionRange().focusNode:null;this.composing&&(this.input.compositionNode=wc(this)),(i||!this.docView.update(e.doc,c,a,this))&&(this.docView.updateOuterDeco(c),this.docView.destroy(),this.docView=ao(e.doc,c,a,this.dom,this)),p&&(!this.trackWrites||!this.dom.contains(this.trackWrites))&&(f=!0)}f||!(this.input.mouseDown&&this.domObserver.currentSelection.eq(this.domSelectionRange())&&Ha(this))?De(this,f):($i(this,e.selection),this.domObserver.setCurSelection()),this.domObserver.start()}this.updatePluginViews(o),!((r=this.dragging)===null||r===void 0)&&r.node&&!o.doc.eq(e.doc)&&this.updateDraggedNode(this.dragging,o),d=="reset"?this.dom.scrollTop=0:d=="to selection"?this.scrollToSelection():h&&va(h)}scrollToSelection(){let e=this.domSelectionRange().focusNode;if(!(!e||!this.dom.contains(e.nodeType==1?e:e.parentNode))){if(!this.someProp("handleScrollToSelection",t=>t(this)))if(this.state.selection instanceof A){let t=this.docView.domAfterPos(this.state.selection.from);t.nodeType==1&&no(this,t.getBoundingClientRect(),e)}else no(this,this.coordsAtPos(this.state.selection.head,1),e)}}destroyPluginViews(){let e;for(;e=this.pluginViews.pop();)e.destroy&&e.destroy()}updatePluginViews(e){if(!e||e.plugins!=this.state.plugins||this.directPlugins!=this.prevDirectPlugins){this.prevDirectPlugins=this.directPlugins,this.destroyPluginViews();for(let t=0;t<this.directPlugins.length;t++){let r=this.directPlugins[t];r.spec.view&&this.pluginViews.push(r.spec.view(this))}for(let t=0;t<this.state.plugins.length;t++){let r=this.state.plugins[t];r.spec.view&&this.pluginViews.push(r.spec.view(this))}}else for(let t=0;t<this.pluginViews.length;t++){let r=this.pluginViews[t];r.update&&r.update(this,e)}}updateDraggedNode(e,t){let r=e.node,o=-1;if(this.state.doc.nodeAt(r.from)==r.node)o=r.from;else{let i=r.from+(this.state.doc.content.size-t.doc.content.size);(i>0&&this.state.doc.nodeAt(i))==r.node&&(o=i)}this.dragging=new ts(e.slice,e.move,o<0?void 0:A.create(this.state.doc,o))}someProp(e,t){let r=this._props&&this._props[e],o;if(r!=null&&(o=t?t(r):r))return o;for(let s=0;s<this.directPlugins.length;s++){let l=this.directPlugins[s].props[e];if(l!=null&&(o=t?t(l):l))return o}let i=this.state.plugins;if(i)for(let s=0;s<i.length;s++){let l=i[s].props[e];if(l!=null&&(o=t?t(l):l))return o}}hasFocus(){if(le){let e=this.root.activeElement;if(e==this.dom)return!0;if(!e||!this.dom.contains(e))return!1;for(;e&&this.dom!=e&&this.dom.contains(e);){if(e.contentEditable=="false")return!1;e=e.parentElement}return!0}return this.root.activeElement==this.dom}focus(){this.domObserver.stop(),this.editable&&Sa(this.dom),De(this),this.domObserver.start()}get root(){let e=this._root;if(e==null){for(let t=this.dom.parentNode;t;t=t.parentNode)if(t.nodeType==9||t.nodeType==11&&t.host)return t.getSelection||(Object.getPrototypeOf(t).getSelection=()=>t.ownerDocument.getSelection()),this._root=t}return e||document}updateRoot(){this._root=null}posAtCoords(e){return Ta(this,e)}coordsAtPos(e,t=1){return Ii(this,e,t)}domAtPos(e,t=0){return this.docView.domFromPos(e,t)}nodeDOM(e){let t=this.docView.descAt(e);return t?t.nodeDOM:null}posAtDOM(e,t,r=-1){let o=this.docView.posFromDOM(e,t,r);if(o==null)throw new RangeError("DOM position not inside the editor");return o}endOfTextblock(e,t){return Ia(this,t||this.state,e)}pasteHTML(e,t){return Vt(this,"",e,!1,t||new ClipboardEvent("paste"))}pasteText(e,t){return Vt(this,e,null,!0,t||new ClipboardEvent("paste"))}serializeForClipboard(e){return br(this,e)}destroy(){this.docView&&(ac(this),this.destroyPluginViews(),this.mounted?(this.docView.update(this.state.doc,[],_n(this),this),this.dom.textContent=""):this.dom.parentNode&&this.dom.parentNode.removeChild(this.dom),this.docView.destroy(),this.docView=null,ua())}get isDestroyed(){return this.docView==null}dispatchEvent(e){return dc(this,e)}domSelectionRange(){let e=this.domSelection();return e?X&&this.root.nodeType===11&&ga(this.dom.ownerDocument)==this.dom&&Pc(this,e)||e:{focusNode:null,focusOffset:0,anchorNode:null,anchorOffset:0}}domSelection(){return this.root.getSelection()}}ls.prototype.dispatch=function(n){let e=this._props.dispatchTransaction;e?e.call(this,n):this.updateState(this.state.apply(n))};function Do(n){let e=Object.create(null);return e.class="ProseMirror",e.contenteditable=String(n.editable),n.someProp("attributes",t=>{if(typeof t=="function"&&(t=t(n.state)),t)for(let r in t)r=="class"?e.class+=" "+t[r]:r=="style"?e.style=(e.style?e.style+";":"")+t[r]:!e[r]&&r!="contenteditable"&&r!="nodeName"&&(e[r]=String(t[r]))}),e.translate||(e.translate="no"),[W.node(0,n.state.doc.content.size,e)]}function Ao(n){if(n.markCursor){let e=document.createElement("img");e.className="ProseMirror-separator",e.setAttribute("mark-placeholder","true"),e.setAttribute("alt",""),n.cursorWrapper={dom:e,deco:W.widget(n.state.selection.from,e,{raw:!0,marks:n.markCursor})}}else n.cursorWrapper=null}function Eo(n){return!n.someProp("editable",e=>e(n.state)===!1)}function Hc(n,e){let t=Math.min(n.$anchor.sharedDepth(n.head),e.$anchor.sharedDepth(e.head));return n.$anchor.start(t)!=e.$anchor.start(t)}function Ro(n){let e=Object.create(null);function t(r){for(let o in r)Object.prototype.hasOwnProperty.call(e,o)||(e[o]=r[o])}return n.someProp("nodeViews",t),n.someProp("markViews",t),e}function Jc(n,e){let t=0,r=0;for(let o in n){if(n[o]!=e[o])return!0;t++}for(let o in e)r++;return t!=r}function Io(n){if(n.spec.state||n.spec.filterTransaction||n.spec.appendTransaction)throw new RangeError("Plugins passed directly to the view must not have a state component")}function Uc(n={}){return new ge({view(e){return new Kc(e,n)}})}class Kc{constructor(e,t){var r;this.editorView=e,this.cursorPos=null,this.element=null,this.timeout=-1,this.width=(r=t.width)!==null&&r!==void 0?r:1,this.color=t.color===!1?void 0:t.color||"black",this.class=t.class,this.handlers=["dragover","dragend","drop","dragleave"].map(o=>{let i=s=>{this[o](s)};return e.dom.addEventListener(o,i),{name:o,handler:i}})}destroy(){this.handlers.forEach(({name:e,handler:t})=>this.editorView.dom.removeEventListener(e,t))}update(e,t){this.cursorPos!=null&&t.doc!=e.state.doc&&(this.cursorPos>e.state.doc.content.size?this.setCursor(null):this.updateOverlay())}setCursor(e){e!=this.cursorPos&&(this.cursorPos=e,e==null?(this.element.parentNode.removeChild(this.element),this.element=null):this.updateOverlay())}updateOverlay(){let e=this.editorView.state.doc.resolve(this.cursorPos),t=!e.parent.inlineContent,r,o=this.editorView.dom,i=o.getBoundingClientRect(),s=i.width/o.offsetWidth,l=i.height/o.offsetHeight;if(t){let u=e.nodeBefore,h=e.nodeAfter;if(u||h){let f=this.editorView.nodeDOM(this.cursorPos-(u?u.nodeSize:0));if(f){let p=f.getBoundingClientRect(),g=u?p.bottom:p.top;u&&h&&(g=(g+this.editorView.nodeDOM(this.cursorPos).getBoundingClientRect().top)/2);let b=this.width/2*l;r={left:p.left,right:p.right,top:g-b,bottom:g+b}}}}if(!r){let u=this.editorView.coordsAtPos(this.cursorPos),h=this.width/2*s;r={left:u.left-h,right:u.left+h,top:u.top,bottom:u.bottom}}let a=this.editorView.dom.offsetParent;this.element||(this.element=a.appendChild(document.createElement("div")),this.class&&(this.element.className=this.class),this.element.style.cssText="position: absolute; z-index: 50; pointer-events: none;",this.color&&(this.element.style.backgroundColor=this.color)),this.element.classList.toggle("prosemirror-dropcursor-block",t),this.element.classList.toggle("prosemirror-dropcursor-inline",!t);let c,d;if(!a||a==document.body&&getComputedStyle(a).position=="static")c=-pageXOffset,d=-pageYOffset;else{let u=a.getBoundingClientRect(),h=u.width/a.offsetWidth,f=u.height/a.offsetHeight;c=u.left-a.scrollLeft*h,d=u.top-a.scrollTop*f}this.element.style.left=(r.left-c)/s+"px",this.element.style.top=(r.top-d)/l+"px",this.element.style.width=(r.right-r.left)/s+"px",this.element.style.height=(r.bottom-r.top)/l+"px"}scheduleRemoval(e){clearTimeout(this.timeout),this.timeout=setTimeout(()=>this.setCursor(null),e)}dragover(e){if(!this.editorView.editable)return;let t=this.editorView.posAtCoords({left:e.clientX,top:e.clientY}),r=t&&t.inside>=0&&this.editorView.state.doc.nodeAt(t.inside),o=r&&r.type.spec.disableDropCursor,i=typeof o=="function"?o(this.editorView,t,e):o;if(t&&!i){let s=t.pos;if(this.editorView.dragging&&this.editorView.dragging.slice){let l=ci(this.editorView.state.doc,s,this.editorView.dragging.slice);l!=null&&(s=l)}this.setCursor(s),this.scheduleRemoval(5e3)}}dragend(){this.scheduleRemoval(20)}drop(){this.scheduleRemoval(20)}dragleave(e){this.editorView.dom.contains(e.relatedTarget)||this.setCursor(null)}}class V extends I{constructor(e){super(e,e)}map(e,t){let r=e.resolve(t.map(this.head));return V.valid(r)?new V(r):I.near(r)}content(){return M.empty}eq(e){return e instanceof V&&e.head==this.head}toJSON(){return{type:"gapcursor",pos:this.head}}static fromJSON(e,t){if(typeof t.pos!="number")throw new RangeError("Invalid input for GapCursor.fromJSON");return new V(e.resolve(t.pos))}getBookmark(){return new Sr(this.anchor)}static valid(e){let t=e.parent;if(t.isTextblock||!Yc(e)||!Gc(e))return!1;let r=t.type.spec.allowGapCursor;if(r!=null)return r;let o=t.contentMatchAt(e.index()).defaultType;return o&&o.isTextblock}static findGapCursorFrom(e,t,r=!1){e:for(;;){if(!r&&V.valid(e))return e;let o=e.pos,i=null;for(let s=e.depth;;s--){let l=e.node(s);if(t>0?e.indexAfter(s)<l.childCount:e.index(s)>0){i=l.child(t>0?e.indexAfter(s):e.index(s)-1);break}else if(s==0)return null;o+=t;let a=e.doc.resolve(o);if(V.valid(a))return a}for(;;){let s=t>0?i.firstChild:i.lastChild;if(!s){if(i.isAtom&&!i.isText&&!A.isSelectable(i)){e=e.doc.resolve(o+i.nodeSize*t),r=!1;continue e}break}i=s,o+=t;let l=e.doc.resolve(o);if(V.valid(l))return l}return null}}}V.prototype.visible=!1;V.findFrom=V.findGapCursorFrom;I.jsonID("gapcursor",V);class Sr{constructor(e){this.pos=e}map(e){return new Sr(e.map(this.pos))}resolve(e){let t=e.resolve(this.pos);return V.valid(t)?new V(t):I.near(t)}}function as(n){return n.isAtom||n.spec.isolating||n.spec.createGapCursor}function Yc(n){for(let e=n.depth;e>=0;e--){let t=n.index(e),r=n.node(e);if(t==0){if(r.type.spec.isolating)return!0;continue}for(let o=r.child(t-1);;o=o.lastChild){if(o.childCount==0&&!o.inlineContent||as(o.type))return!0;if(o.inlineContent)return!1}}return!0}function Gc(n){for(let e=n.depth;e>=0;e--){let t=n.indexAfter(e),r=n.node(e);if(t==r.childCount){if(r.type.spec.isolating)return!0;continue}for(let o=r.child(t);;o=o.firstChild){if(o.childCount==0&&!o.inlineContent||as(o.type))return!0;if(o.inlineContent)return!1}}return!0}function Xc(){return new ge({props:{decorations:td,createSelectionBetween(n,e,t){return e.pos==t.pos&&V.valid(t)?new V(t):null},handleClick:Qc,handleKeyDown:Zc,handleDOMEvents:{beforeinput:ed}}})}const Zc=gi({ArrowLeft:Qt("horiz",-1),ArrowRight:Qt("horiz",1),ArrowUp:Qt("vert",-1),ArrowDown:Qt("vert",1)});function Qt(n,e){const t=n=="vert"?e>0?"down":"up":e>0?"right":"left";return function(r,o,i){let s=r.selection,l=e>0?s.$to:s.$from,a=s.empty;if(s instanceof E){if(!i.endOfTextblock(t)||l.depth==0)return!1;a=!1,l=r.doc.resolve(e>0?l.after():l.before())}let c=V.findGapCursorFrom(l,e,a);return c?(o&&o(r.tr.setSelection(new V(c))),!0):!1}}function Qc(n,e,t){if(!n||!n.editable)return!1;let r=n.state.doc.resolve(e);if(!V.valid(r))return!1;let o=n.posAtCoords({left:t.clientX,top:t.clientY});return o&&o.inside>-1&&A.isSelectable(n.state.doc.nodeAt(o.inside))?!1:(n.dispatch(n.state.tr.setSelection(new V(r))),!0)}function ed(n,e){if(e.inputType!="insertCompositionText"||!(n.state.selection instanceof V))return!1;let{$from:t}=n.state.selection,r=t.parent.contentMatchAt(t.index()).findWrapping(n.state.schema.nodes.text);if(!r)return!1;let o=v.empty;for(let s=r.length-1;s>=0;s--)o=v.from(r[s].createAndFill(null,o));let i=n.state.tr.replace(t.pos,t.pos,new M(o,0,0));return i.setSelection(E.near(i.doc.resolve(t.pos+1))),n.dispatch(i),!1}function td(n){if(!(n.selection instanceof V))return null;let e=document.createElement("div");return e.className="ProseMirror-gapcursor",L.create(n.doc,[W.widget(n.selection.head,e,{key:"gapcursor"})])}class de{constructor(e,t,r={}){this.match=e,this.match=e,this.handler=typeof t=="string"?nd(t):t,this.undoable=r.undoable!==!1,this.inCode=r.inCode||!1,this.inCodeMark=r.inCodeMark!==!1}}function nd(n){return function(e,t,r,o){let i=n;if(t[1]){let s=t[0].lastIndexOf(t[1]);i+=t[0].slice(s+t[1].length),r+=s;let l=r-o;l>0&&(i=t[0].slice(s-l,s)+i,r=o)}return e.tr.insertText(i,r,o)}}const rd=500;function od({rules:n}){let e=new ge({state:{init(){return null},apply(t,r){let o=t.getMeta(this);return o||(t.selectionSet||t.docChanged?null:r)}},props:{handleTextInput(t,r,o,i){return Bo(t,r,o,i,n,e)},handleDOMEvents:{compositionend:t=>{setTimeout(()=>{let{$cursor:r}=t.state.selection;r&&Bo(t,r.pos,r.pos,"",n,e)})}}},isInputRules:!0});return e}function Bo(n,e,t,r,o,i){if(n.composing)return!1;let s=n.state,l=s.doc.resolve(e),a=l.parent.textBetween(Math.max(0,l.parentOffset-rd),l.parentOffset,null,"￼")+r;for(let c=0;c<o.length;c++){let d=o[c];if(!d.inCodeMark&&l.marks().some(p=>p.type.spec.code))continue;if(l.parent.type.spec.code){if(!d.inCode)continue}else if(d.inCode==="only")continue;let u=d.match.exec(a);if(!u||u[0].length<r.length)continue;let h=e-(u[0].length-r.length);if(!d.inCodeMark){let p=!1;if(s.doc.nodesBetween(h,l.pos,g=>{g.isInline&&g.marks.some(b=>b.type.spec.code)&&(p=!0)}),p)continue}let f=d.handler(s,u,h,t);if(f)return d.undoable&&f.setMeta(i,{transform:f,from:e,to:t,text:r}),n.dispatch(f),!0}return!1}new de(/--$/,"—",{inCodeMark:!1});new de(/\.\.\.$/,"…",{inCodeMark:!1});new de(/(?:^|[\s\{\[\(\<'"\u2018\u201C])(")$/,"“",{inCodeMark:!1});new de(/"$/,"”",{inCodeMark:!1});new de(/(?:^|[\s\{\[\(\<'"\u2018\u201C])(')$/,"‘",{inCodeMark:!1});new de(/'$/,"’",{inCodeMark:!1});function Cr(n,e,t=null,r){return new de(n,(o,i,s,l)=>{let a=t instanceof Function?t(i):t,c=o.tr.delete(s,l),d=c.doc.resolve(s),u=d.blockRange(),h=u&&cr(u,e,a);if(!h)return null;c.wrap(u,h);let f=c.doc.resolve(s-1).nodeBefore;return f&&f.type==e&&kn(c.doc,s-1)&&(!r||r(i,f))&&c.join(s-1),c})}function cs(n,e,t=null){return new de(n,(r,o,i,s)=>{let l=r.doc.resolve(i),a=t instanceof Function?t(o):t;return l.node(-1).canReplaceWith(l.index(-1),l.indexAfter(-1),e)?r.tr.delete(i,s).setBlockType(i,i,e,a):null})}class id{constructor(e){this.editor=e,this.decorations={widget:(t,r,o)=>W.widget(t,r,o),inline:(t,r,o)=>W.inline(t,r,o),node:(t,r,o)=>W.node(t,r,o),set:(t,r)=>L.create(t,r),empty:L.empty}}get view(){return this.editor._pmView}get state(){return this.view.state}get schema(){return this.state.schema}get doc(){return this.state.doc}get hasFocus(){return this.view.hasFocus()}get dom(){return this.view.dom}createTransaction(){return this.state.tr}dispatch(e){this.view.dispatch(e)}dispatchWith(e){this.dispatch(e(this.createTransaction()))}resolve(e){return this.doc.resolve(e)}coordsAtPos(e,t){return this.view.coordsAtPos(e,t)}posAtCoords(e){return this.view.posAtCoords(e)}posAtDOM(e,t,r){return this.view.posAtDOM(e,t,r)}nodeDOM(e){return this.view.nodeDOM(e)}domAtPos(e){return this.view.domAtPos(e)}nodeAt(e){return this.doc.nodeAt(e)}getNodeType(e){return this.schema.nodes[e]}getMarkType(e){return this.schema.marks[e]}setNodeAttrs(e,t){const r=this.nodeAt(e);if(!r)return;const o=this.createTransaction();o.setNodeMarkup(e,void 0,{...r.attrs,...t}),this.dispatch(o)}replaceNode(e,t){const o=this.resolve(e).nodeAfter;if(!o)return;const i=this.createTransaction();i.replaceWith(e,e+o.nodeSize,t),this.dispatch(i)}deleteNode(e){const r=this.resolve(e).nodeAfter;if(!r)return;const o=this.createTransaction();o.delete(e,e+r.nodeSize),this.dispatch(o)}createNode(e,t,r,o){return(typeof e=="string"?this.getNodeType(e):e).create(t,r,o)}createTextNode(e,t){return this.schema.text(e,t)}get selection(){return this.state.selection}setSelection(e){const t=this.createTransaction();t.setSelection(e),this.dispatch(t)}createTextSelection(e,t){return E.create(this.doc,e,t??e)}createNodeSelection(e){return A.create(this.doc,e)}createAllSelection(){return new se(this.doc)}getSelectedText(){const{from:e,to:t}=this.selection;return this.doc.textBetween(e,t)}hasSelection(){return!this.selection.empty}activeMarks(){return this.state.storedMarks||this.selection.$from.marks()}isMarkActive(e){const t=typeof e=="string"?this.getMarkType(e):e,{from:r,to:o,empty:i}=this.selection;return i?!!t.isInSet(this.activeMarks()):this.doc.rangeHasMark(r,o,t)}toggleMark(e,t){const r=typeof e=="string"?this.getMarkType(e):e;return vi(r,t)(this.state,this.dispatch.bind(this))}addMark(e,t){const r=typeof e=="string"?this.getMarkType(e):e,{from:o,to:i}=this.selection;if(o===i)return;const s=this.createTransaction();s.addMark(o,i,r.create(t)),this.dispatch(s)}removeMark(e){const t=typeof e=="string"?this.getMarkType(e):e,{from:r,to:o}=this.selection;if(r===o)return;const i=this.createTransaction();i.removeMark(r,o,t),this.dispatch(i)}getPluginState(e){return e.getState(this.state)}addPlugin(e){const t=[...this.state.plugins,e],r=this.state.reconfigure({plugins:t});this.view.updateState(r)}removePlugin(e){const t=this.state.plugins.filter(o=>o.spec.key!==e),r=this.state.reconfigure({plugins:t});this.view.updateState(r)}getPlugins(){return this.state.plugins}runCommand(e){return e(this.state,this.dispatch.bind(this),this.view)}createSlice(e,t=0,r=0){const o=Array.isArray(e)?v.from(e):e instanceof v?e:v.from(e);return new M(o,t,r)}createFragment(e){return v.from(e)}insertText(e){const t=this.createTransaction();t.insertText(e),this.dispatch(t)}insertNode(e){const t=this.createTransaction();t.replaceSelectionWith(e),this.dispatch(t)}replaceSelection(e){const t=this.createTransaction();e instanceof M?t.replaceSelection(e):e instanceof v?t.replaceSelection(new M(e,0,0)):Array.isArray(e)?t.replaceSelection(new M(v.from(e),0,0)):t.replaceSelectionWith(e),this.dispatch(t)}forEach(e){this.doc.descendants((t,r,o,i)=>e(t,r,o,i))}findNodes(e){const t=[];return this.forEach((r,o)=>{e(r)&&t.push({node:r,pos:o})}),t}findNodesByType(e){const t=typeof e=="string"?this.getNodeType(e):e;return this.findNodes(r=>r.type===t)}}const sd={editable:!0,autoFocus:!1,injectStyles:!0},ld={content:"block+"},ad={content:"inline*",group:"block",attrs:{id:{default:null},textAlign:{default:"left"}},parseDOM:[{tag:"p",getAttrs(n){return{textAlign:n.style.textAlign||"left"}}}],toDOM(n){const e={"data-block-id":n.attrs.id};return n.attrs.textAlign&&n.attrs.textAlign!=="left"&&(e.style=`text-align: ${n.attrs.textAlign}`),["p",e,0]}},cd={content:"inline*",group:"block",attrs:{id:{default:null},level:{default:1},textAlign:{default:"left"}},parseDOM:[{tag:"h1",getAttrs:n=>({level:1,textAlign:n.style.textAlign||"left"})},{tag:"h2",getAttrs:n=>({level:2,textAlign:n.style.textAlign||"left"})},{tag:"h3",getAttrs:n=>({level:3,textAlign:n.style.textAlign||"left"})},{tag:"h4",getAttrs:n=>({level:4,textAlign:n.style.textAlign||"left"})},{tag:"h5",getAttrs:n=>({level:5,textAlign:n.style.textAlign||"left"})},{tag:"h6",getAttrs:n=>({level:6,textAlign:n.style.textAlign||"left"})}],toDOM(n){const e={"data-block-id":n.attrs.id};return n.attrs.textAlign&&n.attrs.textAlign!=="left"&&(e.style=`text-align: ${n.attrs.textAlign}`),[`h${n.attrs.level}`,e,0]}},dd={group:"inline"},ud={inline:!0,group:"inline",selectable:!1,parseDOM:[{tag:"br"}],toDOM(){return["br"]}},hd={content:"inline*",group:"block",attrs:{id:{default:null}},parseDOM:[{tag:"blockquote"}],toDOM(n){return["blockquote",{class:"openblock-blockquote","data-block-id":n.attrs.id},0]}},fd={content:"inline*",group:"block",attrs:{id:{default:null},calloutType:{default:"info"}},parseDOM:[{tag:"div.openblock-callout",getAttrs(n){return{calloutType:n.dataset.calloutType||"info"}}}],toDOM(n){const e=n.attrs.calloutType;return["div",{class:`openblock-callout openblock-callout--${e}`,"data-block-id":n.attrs.id,"data-callout-type":e},0]}},pd={content:"text*",group:"block",marks:"",code:!0,defining:!0,attrs:{id:{default:null},language:{default:""}},parseDOM:[{tag:"pre",preserveWhitespace:"full",getAttrs(n){var e;const r=n.querySelector("code");return{language:(r==null?void 0:r.getAttribute("data-language"))||((e=r==null?void 0:r.className.match(/language-(\w+)/))==null?void 0:e[1])||""}}}],toDOM(n){const e=n.attrs.language||"";return["pre",{class:"openblock-code-block","data-block-id":n.attrs.id},["code",{"data-language":e,class:e?`language-${e}`:""},0]]}},md={group:"block",attrs:{id:{default:null}},parseDOM:[{tag:"hr"}],toDOM(n){return["hr",{class:"openblock-divider","data-block-id":n.attrs.id}]}},gd={content:"listItem+",group:"block",attrs:{id:{default:null}},parseDOM:[{tag:"ul"}],toDOM(n){return["ul",{class:"openblock-bullet-list","data-block-id":n.attrs.id},0]}},bd={content:"listItem+",group:"block",attrs:{id:{default:null},start:{default:1}},parseDOM:[{tag:"ol",getAttrs(n){const e=n;return{start:e.hasAttribute("start")?parseInt(e.getAttribute("start")??"1",10):1}}}],toDOM(n){const e={class:"openblock-ordered-list","data-block-id":n.attrs.id};return n.attrs.start!==1&&(e.start=String(n.attrs.start)),["ol",e,0]}},kd={content:"paragraph block*",attrs:{id:{default:null}},defining:!0,parseDOM:[{tag:"li"}],toDOM(n){return["li",{class:"openblock-list-item","data-block-id":n.attrs.id},0]}},yd={group:"block",content:"column+",defining:!0,isolating:!0,attrs:{id:{default:null},gap:{default:16}},parseDOM:[{tag:"div[data-column-list]",getAttrs(n){const e=n.getAttribute("data-gap");return{id:n.getAttribute("data-block-id")||null,gap:e?parseInt(e,10):16}}}],toDOM(n){const e={"data-column-list":"","data-gap":String(n.attrs.gap),class:"ob-column-list",style:`gap: ${n.attrs.gap}px`};return n.attrs.id&&(e["data-block-id"]=n.attrs.id),["div",e,0]}},xd={content:"block+",defining:!0,isolating:!0,attrs:{id:{default:null},width:{default:50}},parseDOM:[{tag:"div[data-column]",getAttrs(n){const e=n.getAttribute("data-width");return{id:n.getAttribute("data-block-id")||null,width:e?parseInt(e,10):50}}}],toDOM(n){const e={"data-column":"","data-width":String(n.attrs.width),class:"ob-column",style:`flex: ${n.attrs.width} 0 0; min-width: 0;`};return n.attrs.id&&(e["data-block-id"]=n.attrs.id),["div",e,0]}},wd={group:"block",content:"tableRow+",tableRole:"table",defining:!0,isolating:!0,attrs:{id:{default:null}},parseDOM:[{tag:"table",getAttrs(n){return{id:n.getAttribute("data-block-id")||null}}}],toDOM(n){const e={class:"ob-table"};return n.attrs.id&&(e["data-block-id"]=n.attrs.id),["table",e,["tbody",0]]}},vd={content:"(tableCell | tableHeader)+",tableRole:"row",attrs:{id:{default:null}},parseDOM:[{tag:"tr",getAttrs(n){return{id:n.getAttribute("data-block-id")||null}}}],toDOM(n){const e={class:"ob-table-row"};return n.attrs.id&&(e["data-block-id"]=n.attrs.id),["tr",e,0]}},Sd={content:"block+",tableRole:"cell",isolating:!0,attrs:{id:{default:null},colspan:{default:1},rowspan:{default:1},colwidth:{default:null},backgroundColor:{default:null}},parseDOM:[{tag:"td",getAttrs(n){const e=n.getAttribute("data-block-id"),t=n.getAttribute("colspan"),r=n.getAttribute("rowspan"),o=n.getAttribute("data-colwidth"),i=n.style.backgroundColor||null;return{id:e||null,colspan:t?parseInt(t,10):1,rowspan:r?parseInt(r,10):1,colwidth:o?o.split(",").map(s=>parseInt(s,10)):null,backgroundColor:i}}},{tag:"th",getAttrs(n){const e=n.getAttribute("data-block-id"),t=n.getAttribute("colspan"),r=n.getAttribute("rowspan"),o=n.getAttribute("data-colwidth"),i=n.style.backgroundColor||null;return{id:e||null,colspan:t?parseInt(t,10):1,rowspan:r?parseInt(r,10):1,colwidth:o?o.split(",").map(s=>parseInt(s,10)):null,backgroundColor:i}}}],toDOM(n){const e={class:"ob-table-cell"};return n.attrs.id&&(e["data-block-id"]=n.attrs.id),n.attrs.colspan>1&&(e.colspan=String(n.attrs.colspan)),n.attrs.rowspan>1&&(e.rowspan=String(n.attrs.rowspan)),n.attrs.colwidth&&(e["data-colwidth"]=n.attrs.colwidth.join(","),e.style=`width: ${n.attrs.colwidth[0]}px`),n.attrs.backgroundColor&&(e.style=(e.style||"")+`background-color: ${n.attrs.backgroundColor}`),["td",e,0]}},Cd={content:"block+",tableRole:"header_cell",isolating:!0,attrs:{id:{default:null},colspan:{default:1},rowspan:{default:1},colwidth:{default:null},backgroundColor:{default:null}},parseDOM:[{tag:"th",getAttrs(n){const e=n.getAttribute("data-block-id"),t=n.getAttribute("colspan"),r=n.getAttribute("rowspan"),o=n.getAttribute("data-colwidth"),i=n.style.backgroundColor||null;return{id:e||null,colspan:t?parseInt(t,10):1,rowspan:r?parseInt(r,10):1,colwidth:o?o.split(",").map(s=>parseInt(s,10)):null,backgroundColor:i}}}],toDOM(n){const e={class:"ob-table-header"};return n.attrs.id&&(e["data-block-id"]=n.attrs.id),n.attrs.colspan>1&&(e.colspan=String(n.attrs.colspan)),n.attrs.rowspan>1&&(e.rowspan=String(n.attrs.rowspan)),n.attrs.colwidth&&(e["data-colwidth"]=n.attrs.colwidth.join(","),e.style=`width: ${n.attrs.colwidth[0]}px`),n.attrs.backgroundColor&&(e.style=(e.style||"")+`background-color: ${n.attrs.backgroundColor}`),["th",e,0]}},Md={group:"block",atom:!0,draggable:!0,attrs:{id:{default:null},src:{default:""},alt:{default:""},caption:{default:""},width:{default:null},alignment:{default:"center"}},parseDOM:[{tag:"figure.openblock-image",getAttrs:n=>{var e;const t=n,r=t.querySelector("img");return{id:t.getAttribute("data-block-id"),src:(r==null?void 0:r.getAttribute("src"))||"",alt:(r==null?void 0:r.getAttribute("alt"))||"",caption:((e=t.querySelector("figcaption"))==null?void 0:e.textContent)||"",width:r!=null&&r.getAttribute("data-width")?parseInt(r.getAttribute("data-width")??"0"):null,alignment:t.getAttribute("data-alignment")||"center"}}},{tag:"img[src]",getAttrs:n=>{const e=n;return{src:e.getAttribute("src")||"",alt:e.getAttribute("alt")||"",width:e.width||null}}}],toDOM:n=>{const{src:e,alt:t,caption:r,width:o,alignment:i,id:s}=n.attrs,l={class:`openblock-image openblock-image--${i}`,"data-block-id":s||"","data-alignment":i};if(!e){const c=["div",{class:"openblock-image-placeholder"},["span",{class:"openblock-image-placeholder-icon"}],["span",{class:"openblock-image-placeholder-text"},"Click to add an image"]];return r?["figure",l,c,["figcaption",{},r]]:["figure",l,c]}const a={src:e,alt:t};return o&&(a["data-width"]=String(o),a.style=`width: ${o}px`),r?["figure",l,["img",a],["figcaption",{},r]]:["figure",l,["img",a]]}},Nd={group:"block",atom:!0,draggable:!0,attrs:{id:{default:null},url:{default:""},provider:{default:"generic"},embedId:{default:""},caption:{default:""},width:{default:null},height:{default:null},aspectRatio:{default:"16:9"}},parseDOM:[{tag:"figure.openblock-embed",getAttrs:n=>{var e;const t=n;return{id:t.getAttribute("data-block-id"),url:t.getAttribute("data-url")||"",provider:t.getAttribute("data-provider")||"generic",embedId:t.getAttribute("data-embed-id")||"",caption:((e=t.querySelector("figcaption"))==null?void 0:e.textContent)||"",width:t.getAttribute("data-width"),height:t.getAttribute("data-height"),aspectRatio:t.getAttribute("data-aspect-ratio")||"16:9"}}}],toDOM:n=>{const{url:e,provider:t,embedId:r,caption:o,width:i,height:s,aspectRatio:l}=n.attrs,a=Od(t,r,e),c=i?`max-width: ${typeof i=="number"?`${i}px`:i}`:"";return["figure",{class:`openblock-embed openblock-embed--${t}`,"data-block-id":n.attrs.id||"","data-url":e,"data-provider":t,"data-embed-id":r,"data-aspect-ratio":l,...i?{"data-width":String(i)}:{},...s?{"data-height":String(s)}:{},style:c},["div",{class:"openblock-embed-container",style:`aspect-ratio: ${l.replace(":","/")}`},a?["iframe",{src:a,frameborder:"0",allowfullscreen:"true",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",loading:"lazy"}]:["div",{class:"openblock-embed-placeholder"},["span",{class:"openblock-embed-placeholder-text"},"Paste a URL to embed"]]],...o?[["figcaption",{class:"openblock-embed-caption"},o]]:[]]}};function Od(n,e,t){if(!e&&!t)return"";switch(n){case"youtube":return`https://www.youtube.com/embed/${e}`;case"vimeo":return`https://player.vimeo.com/video/${e}`;case"twitter":return"";case"codepen":return`https://codepen.io/${e}/embed/preview`;case"codesandbox":return`https://codesandbox.io/embed/${e}`;case"figma":return`https://www.figma.com/embed?embed_host=openblock&url=${encodeURIComponent(t)}`;case"loom":return`https://www.loom.com/embed/${e}`;case"spotify":return`https://open.spotify.com/embed/${e}`;case"soundcloud":return`https://w.soundcloud.com/player/?url=${encodeURIComponent(t)}&auto_play=false`;case"generic":default:return t}}const Td={group:"block",content:"checkListItem+",attrs:{id:{default:null}},parseDOM:[{tag:"ul.openblock-checklist",getAttrs:n=>({id:n.getAttribute("data-block-id")})}],toDOM:n=>["ul",{class:"openblock-checklist","data-block-id":n.attrs.id||""},0]},Dd={content:"inline*",attrs:{id:{default:null},checked:{default:!1}},parseDOM:[{tag:"li.openblock-checklist-item",getAttrs:n=>{const e=n,t=e.querySelector('input[type="checkbox"]');return{id:e.getAttribute("data-block-id"),checked:(t==null?void 0:t.checked)||e.getAttribute("data-checked")==="true"}}}],toDOM:n=>["li",{class:`openblock-checklist-item ${n.attrs.checked?"openblock-checklist-item--checked":""}`,"data-block-id":n.attrs.id||"","data-checked":String(n.attrs.checked)},["label",{class:"openblock-checklist-label",contenteditable:"false"},["input",{type:"checkbox",class:"openblock-checklist-checkbox",...n.attrs.checked?{checked:"checked"}:{}}]],["span",{class:"openblock-checklist-content"},0]],draggable:!1},Ad={parseDOM:[{tag:"strong"},{tag:"b"},{style:"font-weight=bold"},{style:"font-weight=700"}],toDOM(){return["strong",0]}},Ed={parseDOM:[{tag:"em"},{tag:"i"},{style:"font-style=italic"}],toDOM(){return["em",0]}},Rd={parseDOM:[{tag:"u"},{style:"text-decoration=underline"}],toDOM(){return["u",0]}},Id={parseDOM:[{tag:"s"},{tag:"strike"},{style:"text-decoration=line-through"}],toDOM(){return["s",0]}},Bd={parseDOM:[{tag:"code"}],toDOM(){return["code",0]}},Pd={attrs:{href:{},title:{default:null},target:{default:null}},inclusive:!1,parseDOM:[{tag:"a[href]",getAttrs(n){return{href:n.getAttribute("href"),title:n.getAttribute("title"),target:n.getAttribute("target")}}}],toDOM(n){return["a",{href:n.attrs.href,title:n.attrs.title,target:n.attrs.target},0]}},Ld={attrs:{color:{}},parseDOM:[{style:"color",getAttrs(n){return{color:n}}},{tag:"span[data-text-color]",getAttrs(n){return{color:n.getAttribute("data-text-color")}}}],toDOM(n){return["span",{"data-text-color":n.attrs.color,style:`color: ${n.attrs.color}`},0]}},zd={attrs:{color:{}},parseDOM:[{style:"background-color",getAttrs(n){return{color:n}}},{tag:"span[data-background-color]",getAttrs(n){return{color:n.getAttribute("data-background-color")}}},{tag:"mark",getAttrs(n){return{color:n.style.backgroundColor||"#ffff00"}}}],toDOM(n){return["span",{"data-background-color":n.attrs.color,style:`background-color: ${n.attrs.color}; border-radius: 2px; padding: 0 2px;`},0]}},jd={doc:ld,paragraph:ad,heading:cd,text:dd,hardBreak:ud,blockquote:hd,callout:fd,codeBlock:pd,divider:md,bulletList:gd,orderedList:bd,listItem:kd,columnList:yd,column:xd,table:wd,tableRow:vd,tableCell:Sd,tableHeader:Cd,image:Md,checkList:Td,checkListItem:Dd,embed:Nd},Vd={bold:Ad,italic:Ed,underline:Rd,strikethrough:Id,code:Bd,link:Pd,textColor:Ld,backgroundColor:zd};function Fd(){return new Ls({nodes:jd,marks:Vd})}const $d=new Ae("blockIds");function _d(){return new ge({key:$d,appendTransaction(n,e,t){const r=[];if(t.doc.descendants((i,s)=>{(i.type.name==="doc"||!i.isBlock)&&i.type.name!=="column"||i.attrs.id!==void 0&&(i.attrs.id||r.push({pos:s,attrs:{...i.attrs,id:Fe()}}))}),r.length===0)return null;let o=t.tr;for(let i=r.length-1;i>=0;i--){const{pos:s,attrs:l}=r[i];o=o.setNodeMarkup(s,void 0,l)}return o}})}function Wd(n,e=6){return cs(new RegExp(`^(#{1,${e}})\\s$`),n,t=>({level:t[1].length}))}function qd(n){return Cr(/^\s*([-+*])\s$/,n,void 0,(e,t)=>t.type===n)}function Hd(n){return Cr(/^\s*(\d+)\.\s$/,n,e=>({start:parseInt(e[1],10)}),(e,t)=>t.type===n)}function Jd(n){return Cr(/^\s*>\s$/,n)}function Ud(n){return cs(/^```([a-zA-Z0-9]*)\s$/,n,e=>({language:e[1]||""}))}function Kd(n){return new de(/^([-*_]){3,}\s$/,(e,t,r,o)=>{const i=e.tr;return i.replaceWith(r,o,n.create()),i})}function Yd(n){return new de(/(?:\*\*|__)([^*_]+)(?:\*\*|__)$/,(e,t,r,o)=>{const i=t[1];if(!i)return null;const s=e.tr;return s.delete(r,o),s.insertText(i,r),s.addMark(r,r+i.length,n.create()),s})}function Gd(n){return new de(/(?:^|[^*_])(\*|_)([^*_]+)\1$/,(e,t,r,o)=>{const i=t[2];if(!i)return null;const s=e.tr,l=t[0].length>t[1].length+i.length+t[1].length?r+1:r;return s.delete(l,o),s.insertText(i,l),s.addMark(l,l+i.length,n.create()),s})}function Xd(n){return new de(/`([^`]+)`$/,(e,t,r,o)=>{const i=t[1];if(!i)return null;const s=e.tr;return s.delete(r,o),s.insertText(i,r),s.addMark(r,r+i.length,n.create()),s})}function Zd(n){return new de(/~~([^~]+)~~$/,(e,t,r,o)=>{const i=t[1];if(!i)return null;const s=e.tr;return s.delete(r,o),s.insertText(i,r),s.addMark(r,r+i.length,n.create()),s})}function Qd(n,e={}){const{headings:t=!0,bulletLists:r=!0,orderedLists:o=!0,blockquotes:i=!0,codeBlocks:s=!0,dividers:l=!0,bold:a=!0,italic:c=!0,inlineCode:d=!0,strikethrough:u=!0}=e,h=[];return t&&n.nodes.heading&&h.push(Wd(n.nodes.heading)),r&&n.nodes.bulletList&&n.nodes.listItem&&h.push(qd(n.nodes.bulletList)),o&&n.nodes.orderedList&&n.nodes.listItem&&h.push(Hd(n.nodes.orderedList)),i&&n.nodes.blockquote&&h.push(Jd(n.nodes.blockquote)),s&&n.nodes.codeBlock&&h.push(Ud(n.nodes.codeBlock)),l&&n.nodes.divider&&h.push(Kd(n.nodes.divider)),a&&n.marks.bold&&h.push(Yd(n.marks.bold)),c&&n.marks.italic&&h.push(Gd(n.marks.italic)),d&&n.marks.code&&h.push(Xd(n.marks.code)),u&&n.marks.strikethrough&&h.push(Zd(n.marks.strikethrough)),od({rules:h})}const ae=new Ae("slashMenu");function eu(n={}){const{trigger:e="/",onlyAtStart:t=!0}=n;return new ge({key:ae,state:{init(){return{active:!1,query:"",triggerPos:0,coords:null}},apply(r,o,i,s){const l=r.getMeta(ae);if(l)return l.close?{active:!1,query:"",triggerPos:0,coords:null}:{...o,...l};if(!o.active){if(!r.docChanged)return o;const{$from:h}=s.selection,f=h.parent.textContent.slice(0,h.parentOffset);return f.endsWith(e)?t&&f!==e?o:{active:!0,query:"",triggerPos:h.pos-e.length,coords:null}:o}if(!r.docChanged&&r.selectionSet)return{active:!1,query:"",triggerPos:0,coords:null};const{$from:a}=s.selection,c=a.parent.textContent.slice(0,a.parentOffset),d=c.lastIndexOf(e);if(d===-1)return{active:!1,query:"",triggerPos:0,coords:null};const u=c.slice(d+e.length);return u.includes(" ")?{active:!1,query:"",triggerPos:0,coords:null}:{...o,query:u}}},props:{handleKeyDown(r,o){const i=ae.getState(r.state);return i!=null&&i.active&&o.key==="Escape"?(r.dispatch(r.state.tr.setMeta(ae,{close:!0})),!0):!1},handleClick(r){const o=ae.getState(r.state);if(o!=null&&o.active){const{from:i}=r.state.selection;(i<o.triggerPos||i>o.triggerPos+o.query.length+1)&&r.dispatch(r.state.tr.setMeta(ae,{close:!0}))}return!1}},view(r){return{update(o){const i=ae.getState(o.state);if(i!=null&&i.active&&!i.coords){const s=o.coordsAtPos(i.triggerPos);o.dispatch(o.state.tr.setMeta(ae,{coords:{left:s.left,top:s.top,bottom:s.bottom}}))}}}}})}function tu(n){n.dispatch(n.state.tr.setMeta(ae,{close:!0}))}function nu(n,e,t){const{triggerPos:r,query:o,insertAfterBlock:i}=e;if(i!==void 0){const a=n.state.doc.nodeAt(i);if(a){const c=i+a.nodeSize,d=n.state.tr;d.setSelection(E.create(n.state.doc,c)),d.setMeta(ae,{close:!0}),n.dispatch(d),t(n,e);return}}const s=n.state.tr;n.state.doc.textBetween(r,Math.min(r+1,n.state.doc.content.size),"")==="/"&&s.delete(r,r+1+o.length),s.setMeta(ae,{close:!0}),n.dispatch(s),t(n,e)}function Po(n,e){const{$from:t}=n.state.selection,r=t.depth>0?1:0,o=t.start(r),i=t.end(r),s=n.state.tr;s.replaceWith(o-1,i+1,e);const l=o;s.setSelection(E.create(s.doc,l)),n.dispatch(s)}function ru(n){const e=[];if(n.nodes.heading&&e.push({id:"heading1",title:"Heading 1",description:"Large section heading",icon:"heading1",keywords:["h1","title","large"],group:"Basic blocks",action:(t,r)=>{Pe(n.nodes.heading,{level:1})(t.state,t.dispatch)}},{id:"heading2",title:"Heading 2",description:"Medium section heading",icon:"heading2",keywords:["h2","subtitle"],group:"Basic blocks",action:(t,r)=>{Pe(n.nodes.heading,{level:2})(t.state,t.dispatch)}},{id:"heading3",title:"Heading 3",description:"Small section heading",icon:"heading3",keywords:["h3"],group:"Basic blocks",action:(t,r)=>{Pe(n.nodes.heading,{level:3})(t.state,t.dispatch)}}),n.nodes.bulletList&&n.nodes.listItem&&e.push({id:"bulletList",title:"Bullet List",description:"Create a bulleted list",icon:"list",keywords:["ul","unordered","bullets"],group:"Lists",action:(t,r)=>{const o=n.nodes.listItem.create(null,n.nodes.paragraph.create()),i=n.nodes.bulletList.create(null,o);t.dispatch(t.state.tr.replaceSelectionWith(i))}}),n.nodes.orderedList&&n.nodes.listItem&&e.push({id:"orderedList",title:"Numbered List",description:"Create a numbered list",icon:"listOrdered",keywords:["ol","ordered","numbers"],group:"Lists",action:(t,r)=>{const o=n.nodes.listItem.create(null,n.nodes.paragraph.create()),i=n.nodes.orderedList.create(null,o);t.dispatch(t.state.tr.replaceSelectionWith(i))}}),n.nodes.blockquote&&e.push({id:"quote",title:"Quote",description:"Capture a quotation",icon:"quote",keywords:["blockquote","citation"],group:"Basic blocks",action:(t,r)=>{const o=n.nodes.blockquote.create();Po(t,o)}}),n.nodes.callout){const t=r=>(o,i)=>{const s=n.nodes.callout.create({calloutType:r});Po(o,s)};e.push({id:"calloutInfo",title:"Callout",description:"Highlight important information",icon:"info",keywords:["callout","alert","note","info","highlight"],group:"Basic blocks",action:t("info")},{id:"calloutWarning",title:"Warning",description:"Show a warning message",icon:"alertTriangle",keywords:["callout","alert","warning","caution"],group:"Basic blocks",action:t("warning")},{id:"calloutSuccess",title:"Success",description:"Show a success message",icon:"checkCircle",keywords:["callout","success","done","tip"],group:"Basic blocks",action:t("success")},{id:"calloutError",title:"Error",description:"Show an error message",icon:"xCircle",keywords:["callout","error","danger","important"],group:"Basic blocks",action:t("error")})}return n.nodes.codeBlock&&e.push({id:"codeBlock",title:"Code Block",description:"Display code with syntax highlighting",icon:"code",keywords:["pre","programming","snippet"],group:"Basic blocks",action:(t,r)=>{const o=n.nodes.codeBlock.create(null,n.text(" ")),i=t.state.tr.replaceSelectionWith(o);t.dispatch(i)}}),n.nodes.divider&&e.push({id:"divider",title:"Divider",description:"Visual separator between sections",icon:"minus",keywords:["hr","horizontal","line","separator"],group:"Basic blocks",action:(t,r)=>{const{tr:o,schema:i}=t.state,s=n.nodes.divider.create(),l=i.nodes.paragraph.create();o.replaceSelectionWith(s),o.insert(o.selection.to,l),t.dispatch(o)}}),n.nodes.columnList&&n.nodes.column&&e.push({id:"columns2",title:"2 Columns",description:"Split into two columns",icon:"columns",keywords:["col","layout","split","two"],group:"Layout",action:(t,r)=>{const o=n.nodes.column.create({width:50},n.nodes.paragraph.create()),i=n.nodes.column.create({width:50},n.nodes.paragraph.create()),s=n.nodes.columnList.create(null,[o,i]);t.dispatch(t.state.tr.replaceSelectionWith(s))}},{id:"columns3",title:"3 Columns",description:"Split into three columns",icon:"columns",keywords:["col","layout","split","three"],group:"Layout",action:(t,r)=>{const o=n.nodes.column.create({width:33.33},n.nodes.paragraph.create()),i=n.nodes.column.create({width:33.33},n.nodes.paragraph.create()),s=n.nodes.column.create({width:33.34},n.nodes.paragraph.create()),l=n.nodes.columnList.create(null,[o,i,s]);t.dispatch(t.state.tr.replaceSelectionWith(l))}},{id:"columnsSidebar",title:"Sidebar Left",description:"Small sidebar with main content",icon:"columns",keywords:["col","layout","sidebar","aside"],group:"Layout",action:(t,r)=>{const o=n.nodes.column.create({width:30},n.nodes.paragraph.create()),i=n.nodes.column.create({width:70},n.nodes.paragraph.create()),s=n.nodes.columnList.create(null,[o,i]);t.dispatch(t.state.tr.replaceSelectionWith(s))}}),n.nodes.table&&n.nodes.tableRow&&n.nodes.tableCell&&e.push({id:"table",title:"Table",description:"Insert a table (3x3)",icon:"table",keywords:["grid","spreadsheet","rows","columns"],group:"Layout",action:(t,r)=>{const o=l=>{const a=[];for(let c=0;c<l;c++)a.push(n.nodes.tableCell.create(null,n.nodes.paragraph.create()));return n.nodes.tableRow.create(null,a)},i=[];for(let l=0;l<3;l++)i.push(o(3));const s=n.nodes.table.create(null,i);t.dispatch(t.state.tr.replaceSelectionWith(s))}},{id:"table2x2",title:"Table 2x2",description:"Insert a small table (2x2)",icon:"table",keywords:["grid","small","simple"],group:"Layout",action:(t,r)=>{const o=l=>{const a=[];for(let c=0;c<l;c++)a.push(n.nodes.tableCell.create(null,n.nodes.paragraph.create()));return n.nodes.tableRow.create(null,a)},i=[];for(let l=0;l<2;l++)i.push(o(2));const s=n.nodes.table.create(null,i);t.dispatch(t.state.tr.replaceSelectionWith(s))}},{id:"table4x4",title:"Table 4x4",description:"Insert a larger table (4x4)",icon:"table",keywords:["grid","large","big"],group:"Layout",action:(t,r)=>{const o=l=>{const a=[];for(let c=0;c<l;c++)a.push(n.nodes.tableCell.create(null,n.nodes.paragraph.create()));return n.nodes.tableRow.create(null,a)},i=[];for(let l=0;l<4;l++)i.push(o(4));const s=n.nodes.table.create(null,i);t.dispatch(t.state.tr.replaceSelectionWith(s))}}),n.nodes.image&&e.push({id:"image",title:"Image",description:"Insert an image",icon:"image",keywords:["img","picture","photo","media"],group:"Media",action:t=>{const r=n.nodes.image.create({src:"",alt:""});t.dispatch(t.state.tr.replaceSelectionWith(r))}}),n.nodes.checkList&&n.nodes.checkListItem&&e.push({id:"checklist",title:"To-do list",description:"Track tasks with checkboxes",icon:"checkSquare",keywords:["todo","task","checkbox","check","list"],group:"Lists",action:t=>{const r=n.nodes.checkListItem.create({checked:!1}),o=n.nodes.checkList.create(null,[r]);t.dispatch(t.state.tr.replaceSelectionWith(o))}}),n.nodes.embed&&e.push({id:"embed",title:"Embed",description:"Embed external content (YouTube, etc.)",icon:"embed",keywords:["video","youtube","vimeo","iframe","external"],group:"Media",action:t=>{const r=n.nodes.embed.create({url:"",provider:"generic"});t.dispatch(t.state.tr.replaceSelectionWith(r))}},{id:"youtube",title:"YouTube",description:"Embed a YouTube video",icon:"youtube",keywords:["video","embed","media"],group:"Media",action:t=>{const r=n.nodes.embed.create({url:"",provider:"youtube"});t.dispatch(t.state.tr.replaceSelectionWith(r))}}),e}function ou(n,e){if(!e)return n;const t=e.toLowerCase();return n.filter(r=>{var o;return!!(r.title.toLowerCase().includes(t)||(o=r.keywords)!=null&&o.some(i=>i.toLowerCase().includes(t)))}).sort((r,o)=>{const i=r.title.toLowerCase().startsWith(t),s=o.title.toLowerCase().startsWith(t);return i&&!s?-1:!i&&s?1:0})}const oe=new Ae("dragDrop");function iu(n={}){const{showHandles:e=!0,showAddButton:t=!0,sideMenuClass:r="ob-side-menu",handleClass:o="ob-drag-handle",addButtonClass:i="ob-add-button",onAddClick:s,onDrop:l}=n;let a=null,c=null,d=null;function u(){const S=document.createElement("div");if(S.className=r,S.setAttribute("contenteditable","false"),t){const y=document.createElement("button");y.className=i,y.type="button",y.setAttribute("tabindex","-1"),y.setAttribute("aria-label","Add block"),y.innerHTML=`
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round">
          <path d="M7 2v10M2 7h10"/>
        </svg>
      `,y.addEventListener("mousedown",T=>{if(T.preventDefault(),T.stopPropagation(),!c)return;const D=parseInt(S.dataset.blockPos||"0",10);s?s(D,c):su(D,c)}),S.appendChild(y)}if(e){const y=document.createElement("div");y.className=o,y.setAttribute("data-drag-handle","true"),y.innerHTML=`
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" style="pointer-events: none;">
          <circle cx="4" cy="3" r="1.5"/>
          <circle cx="10" cy="3" r="1.5"/>
          <circle cx="4" cy="7" r="1.5"/>
          <circle cx="10" cy="7" r="1.5"/>
          <circle cx="4" cy="11" r="1.5"/>
          <circle cx="10" cy="11" r="1.5"/>
        </svg>
      `,y.addEventListener("mousedown",T=>{if(T.button!==0||(T.preventDefault(),T.stopPropagation(),!c))return;d=parseInt(S.dataset.blockPos||"0",10),a==null||a.classList.remove(`${r}--visible`),y.classList.add(`${o}--dragging`),document.body.style.cursor="grabbing"}),S.appendChild(y)}return S}function h(S,y){if(!a)return;if(y===null){a.classList.remove(`${r}--visible`);return}const T=S.state.doc.nodeAt(y);if(!T){a.classList.remove(`${r}--visible`);return}const D=T.attrs.id,R=D?S.dom.querySelector(`[data-block-id="${D}"]`):null,z=S.dom.getBoundingClientRect();let $,P;if(R){const H=R.getBoundingClientRect();$=H.top-z.top;const be=R.closest(".ob-column"),j=R.closest("ul, ol"),Z=j&&!j.classList.contains("openblock-checklist");be?P=be.getBoundingClientRect().left-z.left+4:Z?P=8:(P=H.left-z.left-40-4,P=Math.max(4,P))}else $=S.coordsAtPos(y).top-z.top,P=8;a.style.top=`${$}px`,a.style.left=`${P}px`,a.dataset.blockPos=String(y),a.classList.add(`${r}--visible`)}const f=new Map;let p=-1;function g(S){const y=S.state.doc.content.size;y!==p&&(p=y,f.clear(),S.state.doc.descendants((T,D)=>(T.attrs.id&&f.set(T.attrs.id,D),!0)))}function b(S,y){const T=y.closest("[data-block-id]");if(!T||T.closest('table, .ob-table, [data-node-type="table"]'))return null;const D=T.getAttribute("data-block-id");if(!D)return null;const R=f.get(D);if(R!==void 0)return{pos:R,id:D};g(S);const z=f.get(D);return z===void 0?null:{pos:z,id:D}}let x=null,w=null,k=null,C=null;function O(S){if(a)return;const y=S.dom.parentElement;if(!y)return;a=u(),y.appendChild(a);const T=()=>{C&&clearTimeout(C),C=setTimeout(()=>{const R=oe.getState(S.state);(R==null?void 0:R.hoveredBlockPos)!==null&&S.dispatch(S.state.tr.setMeta(oe,{hoveredBlockPos:null,hoveredBlockId:null})),C=null},150)},D=()=>{C&&(clearTimeout(C),C=null)};x=R=>{const z=R.target;if(a!=null&&a.contains(z)){D();return}const $=oe.getState(S.state);if($!=null&&$.hoveredBlockId&&a){const H=a.getBoundingClientRect();if(R.clientX<H.right+20&&R.clientY>=H.top-10&&R.clientY<=H.bottom+10){D();return}}const P=b(S,z);P?(D(),($==null?void 0:$.hoveredBlockPos)!==P.pos&&S.dispatch(S.state.tr.setMeta(oe,{hoveredBlockPos:P.pos,hoveredBlockId:P.id}))):T()},S.dom.addEventListener("mousemove",x),a.addEventListener("mouseenter",D),a.addEventListener("mouseleave",()=>{T()}),w=(R=>{if(d===null)return;const z=S.posAtCoords({left:R.clientX,top:R.clientY});if(!z)return;const $=S.state.doc.resolve(z.pos);let P=null,H=null;for(let ue=$.depth;ue>=1;ue--){const Ut=$.node(ue),fs=ue>1?$.node(ue-1):S.state.doc;if(!Ut.isBlock||Ut.type.name==="column"||Ut.type.name==="columnList")continue;const Kt=fs.type.name;if(Kt==="doc"||Kt==="column"||Kt==="blockquote"||Kt==="listItem"){P=$.before(ue),H=Ut;break}}if(P===null||!H||P===d)return;const be=S.state.doc.nodeAt(d);if(!be)return;const j=S.coordsAtPos(P),Z=S.coordsAtPos(P+H.nodeSize),Ht=(j.top+Z.bottom)/2,Jt=R.clientY<Ht;let st;Jt?st=P:st=P+H.nodeSize;const us=st<d,hs=st>d+be.nodeSize;if(us||hs){const ue=oe.getState(S.state);(ue==null?void 0:ue.dropTarget)!==st&&S.dispatch(S.state.tr.setMeta(oe,{dropTarget:st}))}else{const ue=oe.getState(S.state);(ue==null?void 0:ue.dropTarget)!==null&&S.dispatch(S.state.tr.setMeta(oe,{dropTarget:null}))}}),k=(()=>{if(document.body.style.cursor="",d===null)return;const R=oe.getState(S.state),z=R==null?void 0:R.dropTarget;z!=null&&z!==d&&(l&&l(d,z),au(S,d,z)),d=null,S.dispatch(S.state.tr.setMeta(oe,{dragging:null,dropTarget:null}));const $=a==null?void 0:a.querySelector(`.${o}`);$==null||$.classList.remove(`${o}--dragging`)}),document.addEventListener("mousemove",w),document.addEventListener("mouseup",k)}return new ge({key:oe,view(S){return c=S,O(S),a||requestAnimationFrame(()=>{O(S)}),{update(y){g(y),O(y);const T=oe.getState(y.state);h(y,(T==null?void 0:T.hoveredBlockPos)??null)},destroy(){x&&S.dom.removeEventListener("mousemove",x),w&&document.removeEventListener("mousemove",w),k&&document.removeEventListener("mouseup",k),C&&(clearTimeout(C),C=null),a==null||a.remove(),a=null,c=null,x=null,w=null,k=null,d=null,f.clear(),p=-1}}},state:{init(){return{dragging:null,dropTarget:null,hoveredBlockPos:null,hoveredBlockId:null}},apply(S,y){const T=S.getMeta(oe);return T?{...y,...T}:y}},props:{decorations(S){const y=oe.getState(S),T=[];if((y==null?void 0:y.dragging)!=null){const D=S.doc.nodeAt(y.dragging);D&&T.push(W.node(y.dragging,y.dragging+D.nodeSize,{class:"ob-block-dragging"}))}if((y==null?void 0:y.dropTarget)!=null){const D=W.widget(y.dropTarget,()=>lu(),{side:-1,key:"drop-indicator"});T.push(D)}return T.length===0?null:L.create(S.doc,T)}}})}function su(n,e){const{state:t}=e,r=t.doc.nodeAt(n);if(!r)return;const o=n+r.nodeSize-1,i=t.tr.setSelection(E.create(t.doc,o));e.dispatch(i),e.focus(),setTimeout(()=>{const s=e.coordsAtPos(n+1);e.dispatch(e.state.tr.setMeta(ae,{active:!0,query:"",triggerPos:o,coords:{left:s.left,top:s.top,bottom:s.bottom},insertAfterBlock:n}))},0)}function lu(){const n=document.createElement("div");return n.className="ob-drop-indicator",n}function au(n,e,t){const{state:r}=n,o=r.doc.nodeAt(e);if(!o)return;const i=r.tr,s=t>e?t-o.nodeSize:t;i.delete(e,e+o.nodeSize),i.insert(s,o),n.dispatch(i)}const Re=new Ae("bubbleMenu");function cu(n){const{$from:e}=n.selection;for(let t=e.depth;t>0;t--){const r=e.node(t);if(r.isBlock&&r.type.name!=="doc"){const o=r.type.name;if(o==="paragraph"||o==="listItem")continue;const i={};return o==="heading"&&(i.level=r.attrs.level),{type:o,props:i}}}return{type:"paragraph",props:{}}}function du(n){var e;const{$from:t}=n.selection;for(let r=t.depth;r>0;r--){const o=t.node(r);if(o.isBlock&&((e=o.type.spec.attrs)==null?void 0:e.textAlign)!==void 0)return o.attrs.textAlign||"left"}return"left"}function uu(n){const{from:e,$from:t,to:r,empty:o}=n.selection,i={bold:!1,italic:!1,underline:!1,strikethrough:!1,code:!1,link:null,textColor:null,backgroundColor:null};if(o){const s=n.storedMarks||t.marks();for(const l of s)l.type.name==="bold"&&(i.bold=!0),l.type.name==="italic"&&(i.italic=!0),l.type.name==="underline"&&(i.underline=!0),l.type.name==="strikethrough"&&(i.strikethrough=!0),l.type.name==="code"&&(i.code=!0),l.type.name==="link"&&(i.link=l.attrs.href),l.type.name==="textColor"&&(i.textColor=l.attrs.color),l.type.name==="backgroundColor"&&(i.backgroundColor=l.attrs.color)}else n.doc.nodesBetween(e,r,s=>{if(s.isText&&s.marks)for(const l of s.marks)l.type.name==="bold"&&(i.bold=!0),l.type.name==="italic"&&(i.italic=!0),l.type.name==="underline"&&(i.underline=!0),l.type.name==="strikethrough"&&(i.strikethrough=!0),l.type.name==="code"&&(i.code=!0),l.type.name==="link"&&(i.link=l.attrs.href),l.type.name==="textColor"&&(i.textColor=l.attrs.color),l.type.name==="backgroundColor"&&(i.backgroundColor=l.attrs.color)});return i}function hu(n,e){var t,r;const{selection:o}=n,{empty:i,from:s,to:l}=o,{minSelectionLength:a=1,showOnNodeSelection:c=!1}=e;if(i||l-s<a)return!1;if(o.constructor.name==="NodeSelection"){if(!c)return!1;const h=o.node;if(((t=h==null?void 0:h.type)==null?void 0:t.name)==="image"||((r=h==null?void 0:h.type)==null?void 0:r.name)==="embed")return!1}if(o.$from.parent.type.name==="codeBlock")return!1;let u=!1;return n.doc.nodesBetween(s,l,h=>h.type.name==="image"||h.type.name==="embed"?(u=!0,!1):!0),!u}function fu(n={}){return new ge({key:Re,state:{init(){return{visible:!1,from:0,to:0,coords:null,activeMarks:{bold:!1,italic:!1,underline:!1,strikethrough:!1,code:!1,link:null,textColor:null,backgroundColor:null},blockType:{type:"paragraph",props:{}},textAlign:"left"}},apply(e,t,r,o){const i=e.getMeta(Re);if(i)return i.hide?{...t,visible:!1,coords:null}:{...t,...i};if(!hu(o,n))return t.visible?{...t,visible:!1,coords:null}:t;const{from:l,to:a}=o.selection,c=uu(o),d=cu(o),u=du(o),f=t.from===l&&t.to===a?t.coords:null;return{visible:!0,from:l,to:a,coords:f,activeMarks:c,blockType:d,textAlign:u}}},view(e){let t=null;const{showDelay:r=0}=n,o=()=>{const i=Re.getState(e.state);if(!(i!=null&&i.visible))return;const{from:s}=e.state.selection,l=e.coordsAtPos(s),a=l.left,c=l.top,d=l.bottom;(!i.coords||i.coords.left!==a||i.coords.top!==c)&&e.dispatch(e.state.tr.setMeta(Re,{coords:{left:a,top:c,bottom:d}}))};return{update(i){const s=Re.getState(i.state);s!=null&&s.visible&&!s.coords&&(r>0?(t&&clearTimeout(t),t=setTimeout(o,r)):o())},destroy(){t&&clearTimeout(t)}}},props:{handleDOMEvents:{blur(e){const t=Re.getState(e.state);return t!=null&&t.visible&&setTimeout(()=>{const r=document.activeElement,o=r==null?void 0:r.closest(".ob-bubble-menu"),i=r==null?void 0:r.closest(".ob-link-popover"),s=r==null?void 0:r.closest(".ob-color-picker-dropdown");!e.hasFocus()&&!o&&!i&&!s&&e.dispatch(e.state.tr.setMeta(Re,{hide:!0}))},100),!1}}}})}const ie=new Ae("multiBlockSelection");function pu(n,e){const t=n.resolve(e);for(let r=t.depth;r>=1;r--){const o=t.node(r);if(o.isBlock&&r===1)return{node:o,pos:t.before(r),depth:r}}return null}function ds(n){const e=[];return n.forEach((t,r)=>{e.push(r)}),e}function mu(n,e,t){const r=[],o=ds(n),i=Math.min(e,t),s=Math.max(e,t);for(const l of o)l>=i&&l<=s&&r.push(l);return r}function gu(n,e){const t=[];for(const r of e){const o=n.doc.nodeAt(r);o&&t.push(W.node(r,r+o.nodeSize,{class:"ob-block-selected"}))}return L.create(n.doc,t)}const bu={marginClickSelect:!0,marginWidth:40};function ku(n={}){const e={...bu,...n};return new ge({key:ie,state:{init(){return{active:!1,selectedBlocks:[],anchorPos:null}},apply(t,r,o,i){const s=t.getMeta(ie);if(s)return s;if(t.docChanged&&r.selectedBlocks.length>0){const l=[];for(const a of r.selectedBlocks){const c=t.mapping.map(a),d=i.doc.nodeAt(c);d&&d.isBlock&&l.push(c)}return l.length!==r.selectedBlocks.length?{...r,selectedBlocks:l,active:l.length>0}:{...r,selectedBlocks:l}}return r}},props:{decorations(t){const r=ie.getState(t);return!r||!r.active||r.selectedBlocks.length===0?L.empty:gu(t,r.selectedBlocks)},handleClick(t,r,o){if(!o.shiftKey&&!o.metaKey&&!o.ctrlKey){const i=ie.getState(t.state);i!=null&&i.active&&t.dispatch(t.state.tr.setMeta(ie,{active:!1,selectedBlocks:[],anchorPos:null}))}return!1},handleKeyDown(t,r){const o=ie.getState(t.state);if(r.key==="Escape"&&(o!=null&&o.active))return t.dispatch(t.state.tr.setMeta(ie,{active:!1,selectedBlocks:[],anchorPos:null})),!0;if((r.metaKey||r.ctrlKey)&&r.key==="a"){const{from:i,to:s}=t.state.selection,l=t.state.doc.content.size;if(i===0&&s===l){const a=ds(t.state.doc);return t.dispatch(t.state.tr.setMeta(ie,{active:!0,selectedBlocks:a,anchorPos:a[0]??null})),!0}}return(r.key==="Delete"||r.key==="Backspace")&&(o!=null&&o.active)&&o.selectedBlocks.length>0?(yu(t),!0):!1},handleDOMEvents:{mousedown(t,r){if(!e.marginClickSelect)return!1;const o=t.dom.getBoundingClientRect();if(r.clientX-o.left>e.marginWidth)return!1;const s={left:r.clientX,top:r.clientY},l=t.posAtCoords(s);if(!l)return!1;const a=pu(t.state.doc,l.pos);if(!a)return!1;const c=ie.getState(t.state);if(r.shiftKey&&c&&c.anchorPos!==null){const d=mu(t.state.doc,c.anchorPos,a.pos);t.dispatch(t.state.tr.setMeta(ie,{active:!0,selectedBlocks:d,anchorPos:c.anchorPos}))}else if(r.metaKey||r.ctrlKey){const d=(c==null?void 0:c.selectedBlocks)||[],h=d.includes(a.pos)?d.filter(f=>f!==a.pos):[...d,a.pos];t.dispatch(t.state.tr.setMeta(ie,{active:h.length>0,selectedBlocks:h,anchorPos:a.pos}))}else t.dispatch(t.state.tr.setMeta(ie,{active:!0,selectedBlocks:[a.pos],anchorPos:a.pos}));return r.preventDefault(),!0}}}})}function yu(n){const e=ie.getState(n.state);if(!e||e.selectedBlocks.length===0)return;const t=[...e.selectedBlocks].sort((o,i)=>i-o);let r=n.state.tr;for(const o of t){const i=r.doc.nodeAt(o);i&&(r=r.delete(o,o+i.nodeSize))}r=r.setMeta(ie,{active:!1,selectedBlocks:[],anchorPos:null}),n.dispatch(r)}function it(n){const{$from:e}=n.selection;let t=null,r=-1,o=null,i=-1,s=null,l=-1;for(let d=e.depth;d>0;d--){const u=e.node(d),h=e.before(d);if(u.type.name==="tableCell"||u.type.name==="tableHeader")t=u,r=h;else if(u.type.name==="tableRow")o=u,i=h;else if(u.type.name==="table"){s=u,l=h;break}}if(!s||!o||!t)return null;let a=0,c=0;return s.forEach((d,u)=>{l+1+u<i&&a++}),o.forEach((d,u)=>{i+1+u<r&&c++}),{table:s,tablePos:l,row:o,rowPos:i,rowIndex:a,cell:t,cellPos:r,cellIndex:c,colCount:o.childCount,rowCount:s.childCount}}function Mr(n,e,t=!1){const{schema:r}=n,o=t&&r.nodes.tableHeader?r.nodes.tableHeader:r.nodes.tableCell,i=[];for(let s=0;s<e;s++)i.push(o.create(null,r.nodes.paragraph.create()));return r.nodes.tableRow.create(null,i)}const xu=(n,e)=>{const t=it(n);if(!t)return!1;if(e){const{tablePos:r,rowIndex:o,colCount:i,table:s}=t,l=Mr(n,i);let a=r+1;for(let c=0;c<=o;c++)a+=s.child(c).nodeSize;e(n.tr.insert(a,l))}return!0},wu=(n,e)=>{const t=it(n);if(!t)return!1;if(e){const{tablePos:r,rowIndex:o,colCount:i,table:s}=t,l=Mr(n,i);let a=r+1;for(let c=0;c<o;c++)a+=s.child(c).nodeSize;e(n.tr.insert(a,l))}return!0},vu=(n,e)=>{const t=it(n);if(!t||t.rowCount<=1)return!1;if(e){const{tablePos:r,rowIndex:o,table:i}=t;let s=r+1;for(let a=0;a<o;a++)s+=i.child(a).nodeSize;const l=s+i.child(o).nodeSize;e(n.tr.delete(s,l))}return!0},Su=(n,e)=>{const t=it(n);if(!t)return!1;if(e){const{schema:r}=n,{tablePos:o,cellIndex:i,table:s}=t,l=[];s.forEach(d=>{const u=[],f=d.child(0).type.name==="tableHeader"&&r.nodes.tableHeader?r.nodes.tableHeader:r.nodes.tableCell;d.forEach((p,g,b)=>{u.push(p),b===i&&u.push(f.create(null,r.nodes.paragraph.create()))}),l.push(r.nodes.tableRow.create(d.attrs,u))});const a=r.nodes.table.create(s.attrs,l),c=n.tr.replaceWith(o,o+s.nodeSize,a);e(c)}return!0},Cu=(n,e)=>{const t=it(n);if(!t)return!1;if(e){const{schema:r}=n,{tablePos:o,cellIndex:i,table:s}=t,l=[];s.forEach(d=>{const u=[],f=d.child(0).type.name==="tableHeader"&&r.nodes.tableHeader?r.nodes.tableHeader:r.nodes.tableCell;d.forEach((p,g,b)=>{b===i&&u.push(f.create(null,r.nodes.paragraph.create())),u.push(p)}),l.push(r.nodes.tableRow.create(d.attrs,u))});const a=r.nodes.table.create(s.attrs,l),c=n.tr.replaceWith(o,o+s.nodeSize,a);e(c)}return!0},Mu=(n,e)=>{const t=it(n);if(!t)return!1;const{tablePos:r,rowIndex:o,cellIndex:i,colCount:s,rowCount:l,table:a}=t,c=i===s-1,d=o===l-1;if(e){let u=n.tr;if(c&&d){const h=Mr(n,s),f=r+a.nodeSize-1;u=u.insert(f,h),u=u.setSelection(E.near(u.doc.resolve(f+3)))}else{let h=o,f=i+1;c&&(h++,f=0);let p=r+1;for(let b=0;b<h;b++)p+=a.child(b).nodeSize;p+=1;const g=a.child(h);for(let b=0;b<f;b++)p+=g.child(b).nodeSize;p+=2,u=u.setSelection(E.near(u.doc.resolve(p)))}e(u)}return!0},Nu=(n,e)=>{const t=it(n);if(!t)return!1;const{tablePos:r,rowIndex:o,cellIndex:i,colCount:s,table:l}=t;if(o===0&&i===0)return!1;if(e){let a=o,c=i-1;i===0&&(a--,c=s-1);let d=r+1;for(let f=0;f<a;f++)d+=l.child(f).nodeSize;d+=1;const u=l.child(a);for(let f=0;f<c;f++)d+=u.child(f).nodeSize;d+=2;const h=n.tr.setSelection(E.near(n.doc.resolve(d)));e(h)}return!0};function Ou(n,e,t,r){const o=n.doc.nodeAt(t);if(!o||o.type.name!=="table")return!1;if(e){const i=o.child(0).childCount,{schema:s}=n,l=[];for(let d=0;d<i;d++)l.push(s.nodes.tableCell.create(null,s.nodes.paragraph.create()));const a=s.nodes.tableRow.create(null,l);let c=t+1;for(let d=0;d<r;d++)c+=o.child(d).nodeSize;e(n.tr.insert(c,a))}return!0}function Tu(n,e,t,r){const o=n.doc.nodeAt(t);if(!o||o.type.name!=="table")return!1;if(e){const{schema:i}=n,s=[];o.forEach(a=>{const c=[],d=a.childCount>0?a.child(0):null,h=(d==null?void 0:d.type.name)==="tableHeader"&&i.nodes.tableHeader?i.nodes.tableHeader:i.nodes.tableCell,f=()=>{const p=h.createAndFill();return p||h.create(null,i.nodes.paragraph.create())};a.forEach((p,g,b)=>{b===r&&c.push(f()),c.push(p)}),r>=a.childCount&&c.push(f()),s.push(i.nodes.tableRow.create(a.attrs,c))});const l=i.nodes.table.create(o.attrs,s);e(n.tr.replaceWith(t,t+o.nodeSize,l))}return!0}function Du(n,e,t,r){const o=n.doc.nodeAt(t);if(!o||o.type.name!=="table"||o.childCount<=1)return!1;if(e){let i=t+1;for(let l=0;l<r;l++)i+=o.child(l).nodeSize;const s=i+o.child(r).nodeSize;e(n.tr.delete(i,s))}return!0}function Au(n,e,t,r){const o=n.doc.nodeAt(t);if(!o||o.type.name!=="table"||o.child(0).childCount<=1)return!1;if(e){const{schema:i}=n,s=[];o.forEach(a=>{const c=[];a.forEach((d,u,h)=>{h!==r&&c.push(d)}),s.push(i.nodes.tableRow.create(a.attrs,c))});const l=i.nodes.table.create(o.attrs,s);e(n.tr.replaceWith(t,t+o.nodeSize,l))}return!0}new Ae("tablePlugin");function Eu(n={}){const{tabNavigation:e=!0}=n,t={};return e&&(t.Tab=Mu,t["Shift-Tab"]=Nu),t["Mod-Alt-ArrowDown"]=xu,t["Mod-Alt-ArrowUp"]=wu,t["Mod-Alt-ArrowRight"]=Su,t["Mod-Alt-ArrowLeft"]=Cu,t["Mod-Shift-Backspace"]=vu,Dt(t)}const Ru=[{key:"Mod-b",description:"Bold",action:"bold"},{key:"Mod-i",description:"Italic",action:"italic"},{key:"Mod-u",description:"Underline",action:"underline"},{key:"Mod-Shift-s",description:"Strikethrough",action:"strikethrough"},{key:"Mod-e",description:"Inline code",action:"code"},{key:"Mod-z",description:"Undo",action:"undo"},{key:"Mod-y",description:"Redo",action:"redo"},{key:"Mod-Shift-z",description:"Redo",action:"redo"},{key:"Mod-Alt-0",description:"Paragraph",action:"paragraph"},{key:"Mod-Alt-1",description:"Heading 1",action:"heading1"},{key:"Mod-Alt-2",description:"Heading 2",action:"heading2"},{key:"Mod-Alt-3",description:"Heading 3",action:"heading3"},{key:"Mod-Shift-7",description:"Ordered list",action:"orderedList"},{key:"Mod-Shift-8",description:"Bullet list",action:"bulletList"},{key:"Mod-Shift-9",description:"Checklist",action:"checkList"},{key:"Mod-Shift-b",description:"Blockquote",action:"blockquote"},{key:"Mod-Shift-c",description:"Code block",action:"codeBlock"},{key:"Tab",description:"Indent list item",action:"indentListItem"},{key:"Shift-Tab",description:"Outdent list item",action:"outdentListItem"}];function Iu(n,e={}){const{shortcuts:t={},includeDefaults:r=!0,disabledShortcuts:o=[]}=e,i={};if(r)for(const s of Ru){if(o.includes(s.key))continue;const l=Lo(n,s.action);l&&(i[s.key]=l)}for(const[s,l]of Object.entries(t))if(typeof l=="function")i[s]=l;else{const a=Lo(n,l);a&&(i[s]=a)}return Dt(i)}function Lo(n,e){if(typeof e=="function")return e;const t={bold:"bold",italic:"italic",underline:"underline",strikethrough:"strikethrough",code:"code"};if(t[e]&&n.marks[t[e]])return vi(n.marks[t[e]]);switch(e){case"undo":return xn;case"redo":return zt;case"paragraph":if(n.nodes.paragraph)return Pe(n.nodes.paragraph);break;case"heading1":if(n.nodes.heading)return Pe(n.nodes.heading,{level:1});break;case"heading2":if(n.nodes.heading)return Pe(n.nodes.heading,{level:2});break;case"heading3":if(n.nodes.heading)return Pe(n.nodes.heading,{level:3});break;case"bulletList":if(n.nodes.bulletList&&n.nodes.listItem)return Xr(n.nodes.bulletList);break;case"orderedList":if(n.nodes.orderedList&&n.nodes.listItem)return Xr(n.nodes.orderedList);break;case"checkList":if(n.nodes.checkList&&n.nodes.checkListItem)return(r,o)=>{const{$from:i,$to:s}=r.selection,l=i.blockRange(s);if(!l)return!1;const a=r.tr,c=n.nodes.checkListItem.create({checked:!1},i.parent.content),d=n.nodes.checkList.create(null,[c]);return a.replaceRangeWith(l.start,l.end,d),o&&o(a),!0};break;case"blockquote":if(n.nodes.blockquote)return Jl(n.nodes.blockquote);break;case"codeBlock":if(n.nodes.codeBlock)return Pe(n.nodes.codeBlock);break;case"indentListItem":if(n.nodes.listItem)return ta(n.nodes.listItem);break;case"outdentListItem":if(n.nodes.listItem)return Zl(n.nodes.listItem);break;case"lift":return Pl}return null}function Bu(n={}){return new ge({props:{handleKeyDown(e,t){const{state:r}=e,{selection:o}=r,{$from:i}=o;let s=null;for(let c=i.depth;c>=0;c--)if(i.node(c).type.name==="checkListItem"){s=c;break}if(s===null)return!1;const l=i.node(s),a=i.before(s);if(t.key==="Enter"&&t.shiftKey){const c=r.schema.nodes.hardBreak;if(c){const d=r.tr.replaceSelectionWith(c.create());return e.dispatch(d),!0}}if(t.key==="Enter"&&!t.shiftKey&&l.textContent.trim()===""){const d=s-1;if(d>=0&&i.node(d).type.name==="checkList"){const u=i.node(d),h=i.before(d);if(u.childCount===1){const k=r.schema.nodes.paragraph.create(),C=r.tr.replaceWith(h,h+u.nodeSize,k);return e.dispatch(C.scrollIntoView()),!0}const f=r.tr;f.delete(a,a+l.nodeSize);const p=f.mapping.map(h),g=f.doc.resolve(p);let b=p;for(let k=g.depth;k>=0;k--)if(g.node(k).type.name==="checkList"){b=g.after(k);break}const x=r.schema.nodes.paragraph.create();f.insert(b,x);const w=f.doc.resolve(b+1);return f.setSelection(E.near(w)),e.dispatch(f.scrollIntoView()),!0}}return!1},handleDOMEvents:{click(e,t){var r;const i=t.target;if(i.tagName==="INPUT"&&i.getAttribute("type")==="checkbox"&&i.classList.contains("openblock-checklist-checkbox")){const s=i.closest(".openblock-checklist-item");if(!s)return!1;const l=e.posAtDOM(s,0);if(l==null)return!1;const a=e.state.doc.resolve(l);let c=null,d=null;for(let f=a.depth;f>=0;f--){const p=a.node(f);if(p.type.name==="checkListItem"){c=a.before(f),d=p;break}}if(c===null||!d)return!1;const u=!d.attrs.checked,h=e.state.tr.setNodeMarkup(c,void 0,{...d.attrs,checked:u});return e.dispatch(h),(r=n.onToggle)==null||r.call(n,u,d.attrs.id),t.preventDefault(),!0}return!1}}}})}const Je=new Ae("mediaMenu");function Pu(n){return n.type.name==="image"?"image":n.type.name==="embed"?"embed":null}function Lu(n){const{selection:e}=n;if(e instanceof A){const t=Pu(e.node);if(t)return{mediaType:t,pos:e.from,node:e.node}}return null}function zu(){return new ge({key:Je,state:{init(){return{visible:!1,mediaType:null,nodePos:null,node:null,attrs:null,coords:null}},apply(n,e,t,r){const o=n.getMeta(Je);if(o)return o.hide?{...e,visible:!1,coords:null,node:null,attrs:null}:{...e,...o};const i=Lu(r);if(!i)return e.visible?{visible:!1,mediaType:null,nodePos:null,node:null,attrs:null,coords:null}:e;const{mediaType:s,pos:l,node:a}=i,d=e.nodePos===l&&e.visible?e.coords:null;return{visible:!0,mediaType:s,nodePos:l,node:a,attrs:a.attrs,coords:d}}},view(n){const e=()=>{const t=Je.getState(n.state);if(!(t!=null&&t.visible)||t.nodePos===null)return;const r=n.nodeDOM(t.nodePos);if(!r||!(r instanceof HTMLElement))return;const o=r.getBoundingClientRect(),i={left:o.left,top:o.top,right:o.right,bottom:o.bottom};(!t.coords||t.coords.left!==i.left||t.coords.top!==i.top)&&n.dispatch(n.state.tr.setMeta(Je,{coords:i}))};return{update(t){const r=Je.getState(t.state);r!=null&&r.visible&&!r.coords&&requestAnimationFrame(e)},destroy(){}}},props:{handleDOMEvents:{blur(n){const e=Je.getState(n.state);return e!=null&&e.visible&&setTimeout(()=>{const t=document.activeElement,r=t==null?void 0:t.closest(".ob-media-menu"),o=t==null?void 0:t.closest(".ob-media-url-popover");!n.hasFocus()&&!r&&!o&&n.dispatch(n.state.tr.setMeta(Je,{hide:!0}))},150),!1}}}})}function ju(n={}){const{schema:e,toggleMark:t,inputRules:r,dragDrop:o,slashMenu:i,bubbleMenu:s,multiBlockSelection:l,table:a,keyboardShortcuts:c,checklist:d,mediaMenu:u,additionalPlugins:h=[]}=n,f=i!==!1?eu(typeof i=="object"?i:{}):null,p=[da(),...f?[f]:[],...d!==!1?[Bu(typeof d=="object"?d:{})]:[],Dt(Yl),Uc(),Xc(),_d()];if(e&&c!==!1){const g=typeof c=="object"?c:{};p.splice(2,0,Iu(e,g))}else t&&(p.splice(2,0,Dt({"Mod-b":()=>t("bold"),"Mod-i":()=>t("italic"),"Mod-u":()=>t("underline")})),p.splice(2,0,Dt({"Mod-z":xn,"Mod-y":zt,"Mod-Shift-z":zt})));if(e&&r!==!1){const g=typeof r=="object"?r:{};p.push(Qd(e,g))}if(o!==!1){const g=typeof o=="object"?o:{};p.push(iu(g))}if(s!==!1){const g=typeof s=="object"?s:{};p.push(fu(g))}if(l!==!1){const g=typeof l=="object"?l:{};p.push(ku(g))}if(a!==!1){const g=typeof a=="object"?a:{};p.push(Eu(g))}return u!==!1&&p.push(zu()),p.push(...h),p}const zo="openblock-styles";let qn=!1;const Vu=`
/* OpenBlock Editor Styles - Auto-injected */

.openblock-container,
.openblock-editor {
  --ob-foreground: var(--foreground, 25 5% 22%);
  --ob-background: var(--background, 0 0% 100%);
  --ob-muted: var(--muted, 40 6% 96%);
  --ob-muted-foreground: var(--muted-foreground, 25 2% 57%);
  --ob-border: var(--border, 40 6% 90%);
  --ob-primary: var(--primary, 25 5% 22%);
  --ob-radius: var(--radius, 0.25rem);
  --ob-font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --ob-font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
  --ob-font-size: 16px;
  --ob-line-height: 1.6;
  --ob-block-spacing: 0.75em;
  --ob-content-padding: 1rem;
}

.openblock-container {
  position: relative;
  width: 100%;
}

.openblock-editor {
  font-family: var(--ob-font-family);
  font-size: var(--ob-font-size);
  line-height: var(--ob-line-height);
  color: hsl(var(--ob-foreground));
  background: hsl(var(--ob-background));
  padding: var(--ob-content-padding) var(--ob-content-padding) var(--ob-content-padding) calc(var(--ob-content-padding) + 48px);
  outline: none;
  min-height: 100px;
}

.openblock-editor:focus {
  outline: none;
}

/* ProseMirror Core */
.ProseMirror {
  outline: none;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.ProseMirror-focused {
  outline: none;
}

.ProseMirror p.is-empty::before {
  content: attr(data-placeholder);
  color: hsl(var(--ob-muted-foreground));
  pointer-events: none;
  position: absolute;
}

.ProseMirror ::selection {
  background: hsl(var(--ob-primary) / 0.2);
}

.ProseMirror-gapcursor {
  display: none;
  pointer-events: none;
  position: absolute;
}

.ProseMirror-gapcursor:after {
  content: '';
  display: block;
  position: absolute;
  top: -2px;
  width: 20px;
  border-top: 1px solid hsl(var(--ob-foreground));
  animation: ProseMirror-cursor-blink 1.1s steps(2, start) infinite;
}

@keyframes ProseMirror-cursor-blink {
  to { visibility: hidden; }
}

.ProseMirror-focused .ProseMirror-gapcursor {
  display: block;
}

.ProseMirror-dropcursor {
  position: absolute;
  border-left: 2px solid hsl(var(--ob-primary));
  pointer-events: none;
}

/* Block Spacing */
.openblock-editor > * + * {
  margin-top: var(--ob-block-spacing);
}

/* Paragraph */
.openblock-editor p {
  margin: 0;
}

/* Headings */
.openblock-editor h1,
.openblock-editor h2,
.openblock-editor h3,
.openblock-editor h4,
.openblock-editor h5,
.openblock-editor h6 {
  margin: 0;
  font-weight: 600;
  line-height: 1.3;
}

.openblock-editor h1 {
  font-size: 2em;
  margin-top: 1em;
}

.openblock-editor h2 {
  font-size: 1.5em;
  margin-top: 0.875em;
}

.openblock-editor h3 {
  font-size: 1.25em;
  margin-top: 0.75em;
}

.openblock-editor h4 {
  font-size: 1.125em;
}

.openblock-editor h5 {
  font-size: 1em;
}

.openblock-editor h6 {
  font-size: 0.875em;
  color: hsl(var(--ob-muted-foreground));
}

/* Inline Formatting */
.openblock-editor strong {
  font-weight: 600;
}

.openblock-editor em {
  font-style: italic;
}

.openblock-editor u {
  text-decoration: underline;
}

.openblock-editor s {
  text-decoration: line-through;
}

.openblock-editor code {
  font-family: var(--ob-font-mono);
  font-size: 0.9em;
  background: hsl(var(--ob-muted));
  padding: 0.125em 0.25em;
  border-radius: calc(var(--ob-radius) / 2);
}

/* Links */
.openblock-editor a {
  color: hsl(var(--ob-primary));
  text-decoration: none;
}

.openblock-editor a:hover {
  text-decoration: underline;
}

/* Lists */
.openblock-editor ul,
.openblock-editor ol {
  margin: 0;
  padding-left: 1.5em;
}

.openblock-editor li {
  margin: 0.25em 0;
}

.openblock-editor li > p {
  margin: 0;
}

/* Blockquote */
.openblock-editor blockquote {
  margin: 0;
  padding-left: 1em;
  border-left: 3px solid hsl(var(--ob-border));
  color: hsl(var(--ob-muted-foreground));
}

/* Callout */
.openblock-editor .openblock-callout {
  margin: 0;
  padding: 0.75em 1em;
  border-radius: var(--ob-radius);
  border-left: 4px solid;
  background: hsl(var(--ob-muted) / 0.5);
}

.openblock-editor .openblock-callout--info {
  border-left-color: hsl(220 90% 56%);
  background: hsl(220 90% 56% / 0.1);
}

.openblock-editor .openblock-callout--warning {
  border-left-color: hsl(38 92% 50%);
  background: hsl(38 92% 50% / 0.1);
}

.openblock-editor .openblock-callout--success {
  border-left-color: hsl(142 76% 36%);
  background: hsl(142 76% 36% / 0.1);
}

.openblock-editor .openblock-callout--error {
  border-left-color: hsl(0 84% 60%);
  background: hsl(0 84% 60% / 0.1);
}

.openblock-editor .openblock-callout--note {
  border-left-color: hsl(var(--ob-muted-foreground));
  background: hsl(var(--ob-muted) / 0.5);
}

/* Code Block */
.openblock-editor pre {
  font-family: var(--ob-font-mono);
  font-size: 0.9em;
  background: hsl(var(--ob-muted));
  padding: 1em;
  border-radius: var(--ob-radius);
  overflow-x: auto;
  margin: 0;
}

.openblock-editor pre code {
  background: none;
  padding: 0;
}

/* Divider */
.openblock-editor hr {
  border: none;
  border-top: 1px solid hsl(var(--ob-border));
  margin: 1.5em 0;
}

/* Side Menu */
.ob-side-menu {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 1px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
  user-select: none;
  z-index: 100;
}

.ob-side-menu--visible {
  opacity: 1;
  pointer-events: auto;
}

.ob-add-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 24px;
  padding: 0;
  border: none;
  background: transparent;
  border-radius: 4px;
  color: #9ca3af;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.ob-add-button svg {
  width: 14px;
  height: 14px;
}

.ob-add-button:hover {
  background: #f3f4f6;
  color: #374151;
}

.ob-add-button:active {
  background: #e5e7eb;
}

.ob-drag-handle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 24px;
  cursor: grab;
  color: #9ca3af;
  border-radius: 4px;
  transition: background 0.15s ease, color 0.15s ease;
  user-select: none;
  -webkit-user-select: none;
}

.ob-drag-handle svg {
  width: 14px;
  height: 14px;
}

.ob-drag-handle:hover {
  background: #f3f4f6;
  color: #374151;
}

.ob-drag-handle--dragging {
  cursor: grabbing;
}

.ob-drag-handle:active {
  cursor: grabbing;
}

.ob-block-dragging {
  opacity: 0.4;
  background: hsl(var(--ob-muted));
  border-radius: var(--ob-radius);
}

.ob-drop-indicator {
  height: 3px;
  background: hsl(220 90% 56%);
  border-radius: 2px;
  margin: -2px 0;
  pointer-events: none;
  position: relative;
}

.ob-drop-indicator::before {
  content: '';
  position: absolute;
  left: -4px;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: hsl(220 90% 56%);
}

.openblock-editor > *,
.openblock-editor p,
.openblock-editor h1,
.openblock-editor h2,
.openblock-editor h3,
.openblock-editor h4,
.openblock-editor h5,
.openblock-editor h6,
.openblock-editor blockquote,
.openblock-editor .openblock-callout,
.openblock-editor pre,
.openblock-editor ul,
.openblock-editor ol,
.openblock-editor hr {
  position: relative;
}

.openblock-editor [data-block-id] {
  position: relative;
}

/* Slash Menu */
.ob-slash-menu {
  --ob-foreground: var(--foreground, 25 5% 22%);
  --ob-background: var(--background, 0 0% 100%);
  --ob-muted: var(--muted, 40 6% 96%);
  --ob-muted-foreground: var(--muted-foreground, 25 2% 57%);
  --ob-border: var(--border, 40 6% 90%);
  --ob-radius: var(--radius, 0.5rem);
  background: hsl(var(--ob-background));
  border: 1px solid hsl(var(--ob-border));
  border-radius: var(--ob-radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1);
  max-height: 300px;
  min-width: 220px;
  max-width: 320px;
  overflow-y: auto;
  padding: 6px;
}

.ob-slash-menu-empty {
  padding: 8px 12px;
  color: hsl(var(--ob-muted-foreground));
  font-size: 0.875em;
  text-align: center;
}

.ob-slash-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: calc(var(--ob-radius) - 2px);
  cursor: pointer;
  transition: background 0.1s ease;
}

.ob-slash-menu-item:hover,
.ob-slash-menu-item--selected {
  background: hsl(var(--ob-muted));
}

.ob-slash-menu-item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  color: hsl(var(--ob-muted-foreground));
}

.ob-slash-menu-item--selected .ob-slash-menu-item-icon {
  color: hsl(var(--ob-foreground));
}

.ob-slash-menu-item-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
}

.ob-slash-menu-item-title {
  font-size: 0.875em;
  font-weight: 500;
  color: hsl(var(--ob-foreground));
}

.ob-slash-menu-item-description {
  font-size: 0.75em;
  color: hsl(var(--ob-muted-foreground));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Bubble Menu */
.ob-bubble-menu {
  --ob-foreground: var(--foreground, 222 47% 11%);
  --ob-background: var(--background, 0 0% 100%);
  --ob-muted: var(--muted, 210 40% 96%);
  --ob-muted-foreground: var(--muted-foreground, 215 16% 47%);
  --ob-border: var(--border, 214 32% 91%);
  --ob-primary: var(--primary, 222 47% 11%);
  --ob-radius: var(--radius, 0.5rem);
  display: flex;
  align-items: center;
  gap: 1px;
  background: hsl(var(--ob-background));
  border: 1px solid hsl(var(--ob-border));
  border-radius: var(--ob-radius);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 4px 6px;
}

.ob-bubble-menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  background: transparent;
  border-radius: 4px;
  color: hsl(var(--ob-muted-foreground));
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.ob-bubble-menu-btn svg {
  width: 15px;
  height: 15px;
  stroke-width: 1.75;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.ob-bubble-menu-btn:hover {
  background: hsl(var(--ob-muted));
  color: hsl(var(--ob-foreground));
}

.ob-bubble-menu-btn--active {
  background: hsl(215 20% 85%);
  color: hsl(var(--ob-foreground));
}

.ob-bubble-menu-btn--active:hover {
  background: hsl(215 20% 80%);
  color: hsl(var(--ob-foreground));
}

.ob-bubble-menu-divider {
  width: 1px;
  height: 16px;
  background: hsl(var(--ob-border));
  margin: 0 6px;
  flex-shrink: 0;
}

/* Text Alignment */
.ob-text-align-buttons {
  display: flex;
  align-items: center;
  gap: 1px;
}

/* Block Type Selector */
.ob-block-type-selector {
  position: relative;
}

.ob-block-type-selector-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border: none;
  background: transparent;
  border-radius: 4px;
  color: hsl(var(--ob-foreground));
  cursor: pointer;
  transition: background 0.15s ease;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
}

.ob-block-type-selector-btn:hover {
  background: hsl(var(--ob-muted));
}

.ob-block-type-selector-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  color: hsl(var(--ob-muted-foreground));
}

.ob-block-type-selector-icon svg {
  width: 14px;
  height: 14px;
  stroke-width: 1.75;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.ob-block-type-selector-label {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ob-block-type-selector-chevron {
  width: 14px;
  height: 14px;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  color: hsl(var(--ob-muted-foreground));
  transition: transform 0.15s ease;
}

.ob-block-type-selector-chevron--open {
  transform: rotate(180deg);
}

.ob-block-type-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  background: hsl(var(--ob-background));
  border: 1px solid hsl(var(--ob-border));
  border-radius: var(--ob-radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08);
  padding: 4px;
  min-width: 160px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1001;
  animation: ob-dropdown-fade-in 0.12s ease-out;
}

.ob-block-type-dropdown--upward {
  top: auto;
  bottom: 100%;
  margin-top: 0;
  margin-bottom: 4px;
  animation: ob-dropdown-fade-in-up 0.12s ease-out;
}

@keyframes ob-dropdown-fade-in {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes ob-dropdown-fade-in-up {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.ob-block-type-option {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  border: none;
  background: transparent;
  border-radius: calc(var(--ob-radius) - 2px);
  color: hsl(var(--ob-foreground));
  cursor: pointer;
  transition: background 0.1s ease;
  text-align: left;
  font-size: 13px;
}

.ob-block-type-option:hover {
  background: hsl(var(--ob-muted));
}

.ob-block-type-option--active {
  background: hsl(var(--ob-muted) / 0.7);
}

.ob-block-type-option-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  color: hsl(var(--ob-muted-foreground));
  flex-shrink: 0;
}

.ob-block-type-option-icon svg {
  width: 16px;
  height: 16px;
  stroke-width: 1.75;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.ob-block-type-option-label {
  flex: 1;
}

.ob-block-type-option-check {
  width: 16px;
  height: 16px;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  color: hsl(var(--ob-primary));
  flex-shrink: 0;
}

/* Column Layout */
.ob-column-list {
  display: flex;
  gap: 8px;
  width: 100%;
  margin: 0.5em 0;
  position: relative;
}

.ob-column {
  position: relative;
  min-width: 80px;
  min-height: 1em;
  padding: 0 8px 0 48px;
}

.ob-column:first-child {
  padding-left: 48px;
}

.ob-column:last-child {
  padding-right: 0;
}

.ob-column:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 1px;
  background: hsl(var(--ob-border) / 0.3);
}

.ob-column:empty::before,
.ob-column > p:only-child:empty::before {
  content: 'Type something...';
  color: hsl(var(--ob-muted-foreground));
  pointer-events: none;
}

/* Table */
.openblock-editor table,
.openblock-editor .ob-table {
  border-collapse: collapse;
  width: calc(100% - 28px);
  margin: 0.5em 0 28px 0;
  table-layout: fixed;
}

.openblock-editor th,
.openblock-editor td,
.openblock-editor .ob-table-cell,
.openblock-editor .ob-table-header {
  border: 1px solid hsl(var(--ob-border));
  padding: 0.5em 0.75em;
  text-align: left;
  vertical-align: top;
  position: relative;
  min-width: 50px;
}

.openblock-editor th,
.openblock-editor .ob-table-header {
  background: hsl(var(--ob-muted));
  font-weight: 600;
}

.openblock-editor .ob-table-cell > p,
.openblock-editor .ob-table-header > p,
.openblock-editor td > p,
.openblock-editor th > p {
  margin: 0;
}

.openblock-editor .ob-table-cell > p:first-child,
.openblock-editor .ob-table-header > p:first-child {
  margin-top: 0;
}

.openblock-editor .ob-table-cell > p:last-child,
.openblock-editor .ob-table-header > p:last-child {
  margin-bottom: 0;
}

.openblock-editor .ob-table-cell.selectedCell,
.openblock-editor .ob-table-header.selectedCell {
  background: hsl(220 90% 56% / 0.1);
}

.openblock-editor .ob-table-cell-resize-handle,
.openblock-editor .ob-table-header-resize-handle {
  position: absolute;
  right: -2px;
  top: 0;
  bottom: 0;
  width: 4px;
  cursor: col-resize;
  background: transparent;
  z-index: 10;
}

.openblock-editor .ob-table-cell-resize-handle:hover,
.openblock-editor .ob-table-header-resize-handle:hover {
  background: hsl(var(--ob-primary) / 0.3);
}

.openblock-editor .ob-table-wrapper {
  overflow-x: auto;
  margin: 0.5em 0;
}

/* Link Popover */
.ob-link-popover {
  --ob-foreground: var(--foreground, 222 47% 11%);
  --ob-background: var(--background, 0 0% 100%);
  --ob-muted: var(--muted, 210 40% 96%);
  --ob-muted-foreground: var(--muted-foreground, 215 16% 47%);
  --ob-border: var(--border, 214 32% 91%);
  --ob-primary: var(--primary, 222 47% 11%);
  --ob-destructive: var(--destructive, 0 84% 60%);
  --ob-radius: var(--radius, 0.5rem);
  background: hsl(var(--ob-background));
  border: 1px solid hsl(var(--ob-border));
  border-radius: var(--ob-radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08);
  padding: 4px;
  animation: ob-link-popover-fade-in 0.12s ease-out;
}

@keyframes ob-link-popover-fade-in {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.ob-link-popover-form {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ob-link-popover-input-row {
  display: flex;
}

.ob-link-popover-input-wrapper {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 2px 4px 2px 8px;
  border: 1px solid hsl(var(--ob-border));
  border-radius: calc(var(--ob-radius) - 2px);
  background: hsl(var(--ob-background));
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.ob-link-popover-input-wrapper:focus-within {
  border-color: hsl(var(--ob-primary) / 0.5);
  box-shadow: 0 0 0 2px hsl(var(--ob-primary) / 0.1);
}

.ob-link-popover-input-wrapper--error {
  border-color: hsl(var(--ob-destructive));
}

.ob-link-popover-input-wrapper--error:focus-within {
  border-color: hsl(var(--ob-destructive));
  box-shadow: 0 0 0 2px hsl(var(--ob-destructive) / 0.1);
}

.ob-link-popover-input-icon {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  stroke-width: 1.75;
  stroke-linecap: round;
  stroke-linejoin: round;
  color: hsl(var(--ob-muted-foreground));
}

.ob-link-popover-input {
  flex: 1;
  min-width: 180px;
  padding: 6px 8px;
  font-size: 13px;
  border: none;
  background: transparent;
  color: hsl(var(--ob-foreground));
  outline: none;
}

.ob-link-popover-input::placeholder {
  color: hsl(var(--ob-muted-foreground));
}

.ob-link-popover-inline-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: hsl(var(--ob-muted-foreground));
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
  flex-shrink: 0;
}

.ob-link-popover-inline-btn svg {
  width: 14px;
  height: 14px;
  stroke-width: 1.75;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.ob-link-popover-inline-btn:hover {
  background: hsl(var(--ob-muted));
  color: hsl(var(--ob-foreground));
}

.ob-link-popover-inline-btn--primary {
  background: hsl(var(--ob-primary));
  color: hsl(var(--ob-background));
}

.ob-link-popover-inline-btn--primary:hover {
  background: hsl(var(--ob-primary) / 0.85);
  color: hsl(var(--ob-background));
}

.ob-link-popover-inline-btn--danger:hover {
  background: hsl(var(--ob-destructive) / 0.1);
  color: hsl(var(--ob-destructive));
}

.ob-link-popover-error {
  margin: 0;
  padding: 0 8px;
  font-size: 11px;
  color: hsl(var(--ob-destructive));
}

/* Color Picker */
.ob-color-picker {
  position: relative;
}

.ob-color-picker > .ob-bubble-menu-btn {
  position: relative;
}

.ob-color-picker-indicator {
  position: absolute;
  bottom: 3px;
  left: 50%;
  transform: translateX(-50%);
  width: 14px;
  height: 3px;
  border-radius: 2px;
}

.ob-color-picker-dropdown {
  background: hsl(var(--ob-background));
  border: 1px solid hsl(var(--ob-border));
  border-radius: var(--ob-radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08);
  padding: 8px;
  min-width: 160px;
  z-index: 1002;
}

.ob-color-picker-section {
  padding: 4px 0;
}

.ob-color-picker-section:first-child {
  padding-top: 0;
}

.ob-color-picker-section:last-child {
  padding-bottom: 0;
}

.ob-color-picker-divider {
  height: 1px;
  background: hsl(var(--ob-border));
  margin: 8px 0;
}

.ob-color-picker-label {
  font-size: 11px;
  font-weight: 500;
  color: hsl(var(--ob-muted-foreground));
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.ob-color-picker-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
}

.ob-color-picker-option {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid transparent;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: border-color 0.15s ease, transform 0.1s ease;
}

.ob-color-picker-option:hover {
  border-color: hsl(var(--ob-border));
  transform: scale(1.05);
}

.ob-color-picker-option--active {
  border-color: hsl(var(--ob-primary));
  background: hsl(var(--ob-muted) / 0.5);
}

.ob-color-picker-option svg {
  width: 20px;
  height: 20px;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  color: hsl(var(--ob-muted-foreground));
}

.ob-color-picker-swatch {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.ob-color-picker-swatch--text {
  background: transparent;
  font-size: 14px;
}

/* Multi-Block Selection */
.ob-block-selected {
  background: hsl(220 90% 56% / 0.1);
  outline: 2px solid hsl(220 90% 56% / 0.5);
  outline-offset: -2px;
  border-radius: var(--ob-radius);
}

.ob-block-selected::before {
  content: '';
  position: absolute;
  left: -24px;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  background: hsl(220 90% 56%);
  border-radius: 50%;
}

/* Table Menu */
.ob-table-menu {
  --ob-foreground: var(--foreground, 222 47% 11%);
  --ob-background: var(--background, 0 0% 100%);
  --ob-muted: var(--muted, 210 40% 96%);
  --ob-muted-foreground: var(--muted-foreground, 215 16% 47%);
  --ob-border: var(--border, 214 32% 91%);
  --ob-primary: var(--primary, 222 47% 11%);
  --ob-destructive: var(--destructive, 0 84% 60%);
  --ob-radius: var(--radius, 0.5rem);
  display: flex;
  align-items: center;
  gap: 4px;
  background: hsl(var(--ob-background));
  border: 1px solid hsl(var(--ob-border));
  border-radius: var(--ob-radius);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 4px 8px;
  animation: ob-table-menu-fade-in 0.15s ease-out;
}

@keyframes ob-table-menu-fade-in {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.ob-table-menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  background: transparent;
  border-radius: 4px;
  color: hsl(var(--ob-muted-foreground));
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.ob-table-menu-btn svg {
  width: 16px;
  height: 16px;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.ob-table-menu-btn:hover {
  background: hsl(var(--ob-muted));
  color: hsl(var(--ob-foreground));
}

.ob-table-menu-btn--danger {
  color: hsl(var(--ob-destructive));
}

.ob-table-menu-btn--danger:hover {
  background: hsl(var(--ob-destructive) / 0.1);
  color: hsl(var(--ob-destructive));
}

.ob-table-menu-divider {
  width: 1px;
  height: 20px;
  background: hsl(var(--ob-border));
  margin: 0 4px;
  flex-shrink: 0;
}

.ob-table-menu-info {
  font-size: 11px;
  color: hsl(var(--ob-muted-foreground));
  padding: 0 8px;
  white-space: nowrap;
}

.ob-table-menu-dropdown {
  position: relative;
}

.ob-table-menu-dropdown-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border: none;
  background: transparent;
  border-radius: 4px;
  color: hsl(var(--ob-foreground));
  cursor: pointer;
  transition: background 0.15s ease;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
}

.ob-table-menu-dropdown-btn:hover {
  background: hsl(var(--ob-muted));
}

.ob-table-menu-dropdown-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  color: hsl(var(--ob-muted-foreground));
}

.ob-table-menu-dropdown-icon svg {
  width: 14px;
  height: 14px;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.ob-table-menu-dropdown-label {
  min-width: 40px;
}

.ob-table-menu-dropdown-chevron {
  width: 12px;
  height: 12px;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  color: hsl(var(--ob-muted-foreground));
  transition: transform 0.15s ease;
}

.ob-table-menu-dropdown-chevron--open {
  transform: rotate(180deg);
}

.ob-table-menu-dropdown-content {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  background: hsl(var(--ob-background));
  border: 1px solid hsl(var(--ob-border));
  border-radius: var(--ob-radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08);
  padding: 4px;
  min-width: 180px;
  z-index: 1001;
  animation: ob-dropdown-fade-in 0.12s ease-out;
}

.ob-table-menu-dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: transparent;
  border-radius: calc(var(--ob-radius) - 2px);
  color: hsl(var(--ob-foreground));
  cursor: pointer;
  transition: background 0.1s ease;
  text-align: left;
  font-size: 13px;
}

.ob-table-menu-dropdown-item:hover {
  background: hsl(var(--ob-muted));
}

.ob-table-menu-dropdown-item:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ob-table-menu-dropdown-item:disabled:hover {
  background: transparent;
}

.ob-table-menu-dropdown-item svg {
  width: 16px;
  height: 16px;
  stroke-linecap: round;
  stroke-linejoin: round;
  color: hsl(var(--ob-muted-foreground));
  flex-shrink: 0;
}

.ob-table-menu-dropdown-item span {
  flex: 1;
}

.ob-table-menu-dropdown-item--danger {
  color: hsl(var(--ob-destructive));
}

.ob-table-menu-dropdown-item--danger svg {
  color: hsl(var(--ob-destructive));
}

.ob-table-menu-dropdown-item--danger:hover {
  background: hsl(var(--ob-destructive) / 0.1);
}

/* Table Handles */
.ob-table-handles {
  pointer-events: none;
  z-index: 100;
}

.ob-table-handle {
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.15s ease;
  pointer-events: auto;
}

.ob-table-handle--visible {
  opacity: 1;
}

.ob-table-handle--row {
  width: 24px;
}

.ob-table-handle--col {
  height: 24px;
}

.ob-table-handle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  background: hsl(var(--ob-background, 0 0% 100%));
  border: 1px solid hsl(var(--ob-border, 214 32% 91%));
  border-radius: 4px;
  color: hsl(var(--ob-muted-foreground, 215 16% 47%));
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.ob-table-handle-btn:hover {
  background: hsl(var(--ob-muted, 210 40% 96%));
  color: hsl(var(--ob-foreground, 222 47% 11%));
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.ob-table-handle-btn svg {
  width: 12px;
  height: 12px;
}

.ob-table-handle-menu {
  position: fixed;
  background: hsl(var(--ob-background, 0 0% 100%));
  border: 1px solid hsl(var(--ob-border, 214 32% 91%));
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08);
  padding: 4px;
  min-width: 150px;
  z-index: 1001;
  animation: ob-dropdown-fade-in 0.12s ease-out;
}

.ob-table-handle-menu button {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: transparent;
  border-radius: 4px;
  color: hsl(var(--ob-foreground, 222 47% 11%));
  cursor: pointer;
  transition: background 0.1s ease;
  text-align: left;
  font-size: 13px;
  white-space: nowrap;
}

.ob-table-handle-menu button:hover {
  background: hsl(var(--ob-muted, 210 40% 96%));
}

.ob-table-handle-menu button svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.ob-table-handle-menu-danger {
  color: hsl(var(--ob-destructive, 0 84% 60%)) !important;
}

.ob-table-handle-menu-danger:hover {
  background: hsl(var(--ob-destructive, 0 84% 60%) / 0.1) !important;
}

.ob-table-extend-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: hsl(var(--ob-muted-foreground, 215 16% 47%) / 0.15);
  color: hsl(var(--ob-muted-foreground, 215 16% 47%));
  cursor: pointer;
  transition: all 0.15s ease;
  opacity: 0;
  pointer-events: auto;
  border-radius: 4px;
}

.ob-table-extend-btn--visible,
.ob-table-handles:hover .ob-table-extend-btn {
  opacity: 1;
}

.ob-table-extend-btn:hover {
  color: hsl(var(--ob-foreground, 222 47% 11%));
  background: hsl(var(--ob-muted-foreground, 215 16% 47%) / 0.3);
}

.ob-table-extend-btn svg {
  width: 14px;
  height: 14px;
}

.ob-table-extend-btn--col {
  width: 20px;
}

.ob-table-extend-btn--row {
  height: 20px;
}

.ob-table-cell .ob-side-menu,
.ob-table-header .ob-side-menu,
td .ob-side-menu,
th .ob-side-menu,
.openblock-editor table .ob-side-menu {
  display: none !important;
}

/* Checklist / To-do List */
.openblock-editor ul.openblock-checklist {
  padding-left: 0;
}

.openblock-checklist {
  list-style: none !important;
  list-style-type: none !important;
  margin: 0;
  padding: 0 !important;
  padding-left: 0 !important;
}

.openblock-checklist-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5em;
  margin: 0.25em 0;
  padding-left: 0.25em;
  position: relative;
  list-style: none !important;
  list-style-type: none !important;
}

.openblock-checklist > .openblock-checklist-item::marker {
  content: none;
}

.openblock-checklist > .openblock-checklist-item::before {
  content: none;
  display: none;
}

.openblock-checklist-label {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 0.2em;
}

.openblock-checklist-checkbox {
  width: 16px;
  height: 16px;
  margin: 0;
  cursor: pointer;
  accent-color: hsl(var(--ob-primary));
}

.openblock-checklist-content {
  flex: 1;
  min-width: 0;
}

.openblock-checklist-item--checked .openblock-checklist-content {
  text-decoration: line-through;
  color: hsl(var(--ob-muted-foreground));
}

/* Image Block */
.openblock-image {
  margin: 0.5em 0;
  text-align: center;
}

.openblock-image--left {
  text-align: left;
}

.openblock-image--center {
  text-align: center;
}

.openblock-image--right {
  text-align: right;
}

.openblock-image img {
  max-width: 100%;
  height: auto;
  border-radius: var(--ob-radius);
}

.openblock-image figcaption {
  margin-top: 0.5em;
  font-size: 0.875em;
  color: hsl(var(--ob-muted-foreground));
  text-align: center;
}

/* Image Placeholder */
.openblock-image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 150px;
  padding: 2em;
  background: hsl(var(--ob-muted));
  border: 2px dashed hsl(var(--ob-border));
  border-radius: var(--ob-radius);
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.openblock-image-placeholder:hover {
  background: hsl(var(--ob-muted) / 0.7);
  border-color: hsl(var(--ob-muted-foreground));
}

.openblock-image-placeholder-icon {
  display: block;
  width: 48px;
  height: 48px;
  margin-bottom: 0.75em;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpath d='M21 15l-5-5L5 21'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.openblock-image-placeholder-text {
  font-size: 0.875em;
  color: hsl(var(--ob-muted-foreground));
}

/* Embed Block */
.openblock-embed {
  margin: 0.5em 0;
}

.openblock-embed-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: var(--ob-radius);
  background: hsl(var(--ob-muted));
}

.openblock-embed-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.openblock-embed-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: hsl(var(--ob-muted-foreground));
}

.openblock-embed-caption {
  margin-top: 0.5em;
  font-size: 0.875em;
  color: hsl(var(--ob-muted-foreground));
  text-align: center;
}

/* Media Menu */
.ob-media-menu {
  --ob-foreground: var(--foreground, 222 47% 11%);
  --ob-background: var(--background, 0 0% 100%);
  --ob-muted: var(--muted, 210 40% 96%);
  --ob-muted-foreground: var(--muted-foreground, 215 16% 47%);
  --ob-border: var(--border, 214 32% 91%);
  --ob-primary: var(--primary, 222 47% 11%);
  --ob-radius: var(--radius, 0.5rem);
  display: flex;
  align-items: center;
  gap: 1px;
  background: hsl(var(--ob-background));
  border: 1px solid hsl(var(--ob-border));
  border-radius: var(--ob-radius);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 4px 6px;
  position: relative;
}

.ob-media-menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  background: transparent;
  border-radius: 4px;
  color: hsl(var(--ob-muted-foreground));
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.ob-media-menu-btn svg {
  width: 15px;
  height: 15px;
  stroke-width: 1.75;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.ob-media-menu-btn:hover {
  background: hsl(var(--ob-muted));
  color: hsl(var(--ob-foreground));
}

.ob-media-menu-btn--active {
  background: hsl(215 20% 85%);
  color: hsl(var(--ob-foreground));
}

.ob-media-menu-btn--active:hover {
  background: hsl(215 20% 80%);
  color: hsl(var(--ob-foreground));
}

.ob-media-menu-btn--danger:hover {
  background: hsl(0 84% 60% / 0.1);
  color: hsl(0 84% 60%);
}

.ob-media-menu-divider {
  width: 1px;
  height: 16px;
  background: hsl(var(--ob-border));
  margin: 0 6px;
  flex-shrink: 0;
}

.ob-media-url-popover {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: hsl(var(--ob-background));
  border: 1px solid hsl(var(--ob-border));
  border-radius: var(--ob-radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08);
  padding: 12px;
  min-width: 280px;
  z-index: 1001;
}

.ob-media-url-label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: hsl(var(--ob-muted-foreground));
  margin-bottom: 8px;
}

.ob-media-url-input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid hsl(var(--ob-border));
  border-radius: 4px;
  font-size: 13px;
  color: hsl(var(--ob-foreground));
  background: hsl(var(--ob-background));
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.ob-media-url-input:focus {
  border-color: hsl(var(--ob-primary));
  box-shadow: 0 0 0 2px hsl(var(--ob-primary) / 0.1);
}

.ob-media-url-input::placeholder {
  color: hsl(var(--ob-muted-foreground));
}

.ob-media-url-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
}

.ob-media-url-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s ease;
}

.ob-media-url-btn--cancel {
  background: hsl(var(--ob-muted));
  color: hsl(var(--ob-foreground));
}

.ob-media-url-btn--cancel:hover {
  background: hsl(var(--ob-border));
}

.ob-media-url-btn--save {
  background: hsl(var(--ob-primary));
  color: hsl(var(--ob-background));
}

.ob-media-url-btn--save:hover {
  opacity: 0.9;
}
`;function Fu(){if(typeof document>"u")return!1;if(qn||document.getElementById(zo))return qn=!0,!1;const n=document.createElement("style");return n.id=zo,n.textContent=Vu,document.head.appendChild(n),qn=!0,!0}function Nr(n,e){const t=n.nodes[e.type];if(!t)return console.warn(`Unknown block type: ${e.type}, falling back to paragraph`),n.node("paragraph",{id:e.id||Fe()});const r={id:e.id||Fe(),...e.props};if(e.children&&e.children.length>0){const i=e.children.map(s=>Nr(n,s));return t.create(r,i)}if(e.type==="listItem"&&e.content){const i=n.node("paragraph",null,en(n,e.content));return t.create(r,[i])}if(e.type==="checkListItem"&&e.content)return t.create(r,en(n,e.content));if(e.type==="image")return t.create(r);if((e.type==="tableCell"||e.type==="tableHeader")&&e.content&&!e.children){const i=n.node("paragraph",null,en(n,e.content));return t.create(r,[i])}if(!e.content||e.content.length===0)return t.spec.content===""||t.spec.content===void 0?t.create(r):t.create(r,[]);const o=en(n,e.content);return t.create(r,o)}function en(n,e){return e.map(t=>{if(t.type==="text"){const r=$u(n,t.styles);return n.text(t.text,r)}return n.text("")})}function $u(n,e){const t=[];return e.bold&&n.marks.bold&&t.push(n.marks.bold.create()),e.italic&&n.marks.italic&&t.push(n.marks.italic.create()),e.underline&&n.marks.underline&&t.push(n.marks.underline.create()),e.strikethrough&&n.marks.strikethrough&&t.push(n.marks.strikethrough.create()),e.code&&n.marks.code&&t.push(n.marks.code.create()),t}function jo(n,e){if(!e||e.length===0)return n.node("doc",null,[n.node("paragraph",{id:Fe()})]);const t=e.map(r=>Nr(n,r));return n.node("doc",null,t)}const _u=new Set(["bulletList","orderedList","listItem","checkList","checkListItem","table","tableRow","tableCell","tableHeader"]);function mt(n){const{id:e,...t}=n.attrs,r={id:e||Fe(),type:n.type.name,props:t};if(_u.has(n.type.name)){if(n.type.name==="listItem"){const o=n.firstChild;if(o&&o.isTextblock&&(r.content=Hn(o)),n.childCount>1){const i=[];n.forEach((s,l,a)=>{a>0&&i.push(mt(s))}),r.children=i}}else if(n.type.name==="checkListItem")r.content=Hn(n);else if(n.type.name==="tableCell"||n.type.name==="tableHeader"){const o=[];n.forEach(i=>{o.push(mt(i))}),r.children=o}else{const o=[];n.forEach(i=>{o.push(mt(i))}),r.children=o}return r}return n.isTextblock&&n.content.size>0&&(r.content=Hn(n)),r}function Hn(n){const e=[];return n.content.forEach(t=>{t.isText&&e.push({type:"text",text:t.text||"",styles:Wu(t.marks)})}),e}function Wu(n){const e={};for(const t of n)switch(t.type.name){case"bold":e.bold=!0;break;case"italic":e.italic=!0;break;case"underline":e.underline=!0;break;case"strikethrough":e.strikethrough=!0;break;case"code":e.code=!0;break}return e}function qu(n){const e=[];return n.forEach(t=>{e.push(mt(t))}),e}class Hu{constructor(e={}){this._listeners=new Map,this._destroyed=!1,this._config={...sd,...e},this.pm=new id(this),this._config.injectStyles!==!1&&Fu(),this._schema=Fd(),this._createEditor(),this._config.autoFocus&&this.focus(this._config.autoFocus==="start"?"start":"end")}_createEditor(){var e;const t=jo(this._schema,this._config.initialContent),r=ju({schema:this._schema,toggleMark:i=>this.pm.toggleMark(i),inputRules:this._config.inputRules,additionalPlugins:(e=this._config.prosemirror)==null?void 0:e.plugins}),o=ut.create({doc:t,schema:this._schema,plugins:r});this._pmView=new ls(this._config.element??null,{state:o,editable:()=>this._config.editable!==!1,dispatchTransaction:this._handleTransaction.bind(this),attributes:{class:"openblock-editor",role:"textbox","aria-multiline":"true"},...this._config.prosemirror})}_handleTransaction(e){var t,r,o,i;if(this._destroyed)return;const s=this._pmView.state.apply(e);if(this._pmView.updateState(s),e.docChanged){const l=this.getDocument();this._emit("change",{blocks:l}),(r=(t=this._config).onUpdate)==null||r.call(t,l)}if(e.selectionSet){const l=this.getSelectedBlocks();this._emit("selectionChange",{blocks:l}),(i=(o=this._config).onSelectionChange)==null||i.call(o,l)}this._emit("transaction",{transaction:e})}getDocument(){return qu(this.pm.doc)}setDocument(e){const t=jo(this._schema,e),r=this.pm.createTransaction();r.replaceWith(0,this.pm.doc.content.size,t.content),this.pm.dispatch(r)}getBlock(e){let t;return this.pm.doc.descendants((r,o)=>{if(r.attrs.id===e)return t=mt(r),!1}),t}getSelectedBlocks(){const{from:e,to:t}=this.pm.selection,r=[];return this.pm.doc.nodesBetween(e,t,(o,i)=>{o.isBlock&&o.type.name!=="doc"&&r.push(mt(o))}),r}insertBlocks(e,t,r="after"){const o=typeof t=="string"?t:t.id;let i=null;if(this.pm.doc.descendants((a,c)=>{if(a.attrs.id===o)return i=r==="before"?c:c+a.nodeSize,!1}),i===null){console.warn(`Reference block not found: ${o}`);return}const s=e.map(a=>Nr(this._schema,{...a,id:a.id||Fe()})),l=this.pm.createTransaction();l.insert(i,s),this.pm.dispatch(l)}updateBlock(e,t){const r=typeof e=="string"?e:e.id;this.pm.doc.descendants((o,i)=>{if(o.attrs.id===r)return this.pm.setNodeAttrs(i,{...o.attrs,...t.props}),!1})}removeBlocks(e){const t=new Set(e.map(i=>typeof i=="string"?i:i.id)),r=this.pm.createTransaction(),o=[];this.pm.doc.descendants((i,s)=>{t.has(i.attrs.id)&&o.push({from:s,to:s+i.nodeSize})}),o.reverse().forEach(({from:i,to:s})=>r.delete(i,s)),this.pm.dispatch(r)}undo(){return xn(this._pmView.state,this._pmView.dispatch)}redo(){return zt(this._pmView.state,this._pmView.dispatch)}toggleBold(){return this.pm.toggleMark("bold")}toggleItalic(){return this.pm.toggleMark("italic")}toggleUnderline(){return this.pm.toggleMark("underline")}toggleStrikethrough(){return this.pm.toggleMark("strikethrough")}toggleCode(){return this.pm.toggleMark("code")}setLink(e,t){this.pm.addMark("link",{href:e,title:t})}removeLink(){this.pm.removeMark("link")}setTextColor(e){this.pm.addMark("textColor",{color:e})}removeTextColor(){this.pm.removeMark("textColor")}setBackgroundColor(e){this.pm.addMark("backgroundColor",{color:e})}removeBackgroundColor(){this.pm.removeMark("backgroundColor")}setTextAlign(e){var t;const{$from:r}=this.pm.selection;for(let o=r.depth;o>0;o--){const i=r.node(o);if(i.isBlock&&((t=i.type.spec.attrs)==null?void 0:t.textAlign)!==void 0){const s=r.before(o),l=this.pm.createTransaction();l.setNodeMarkup(s,void 0,{...i.attrs,textAlign:e}),this.pm.dispatch(l);return}}}getTextAlign(){var e;const{$from:t}=this.pm.selection;for(let r=t.depth;r>0;r--){const o=t.node(r);if(o.isBlock&&((e=o.type.spec.attrs)==null?void 0:e.textAlign)!==void 0)return o.attrs.textAlign||"left"}return"left"}setBlockType(e,t={}){const{$from:r}=this.pm.selection,o=this._schema.nodes[e];if(!o){console.warn(`Unknown block type: ${e}`);return}if(e==="bulletList"||e==="orderedList"){this._wrapInList(e);return}let i=null,s=null;for(let c=r.depth;c>0;c--){const d=r.node(c);if(d.isBlock&&d.type.name!=="doc"&&d.type.name!=="listItem"){i=r.before(c),s=d;break}}if(i===null||!s)return;if(s.type.name==="bulletList"||s.type.name==="orderedList"){this._unwrapList(e,t);return}if(e==="codeBlock"){this._convertToCodeBlock(i,s);return}const l={id:s.attrs.id,...t},a=this.pm.createTransaction();a.setNodeMarkup(i,o,l),this.pm.dispatch(a)}_wrapInList(e){const{$from:t}=this.pm.selection,r=this._schema.nodes[e],o=this._schema.nodes.listItem,i=this._schema.nodes.paragraph;if(!r||!o)return;let s=null,l=null;for(let p=t.depth;p>0;p--){const g=t.node(p);if(g.isBlock&&g.type.name!=="doc"&&g.type.name!=="listItem"){s=t.before(p),l=g;break}}if(s===null||!l)return;if(l.type.name==="bulletList"||l.type.name==="orderedList"){if(l.type.name!==e){const p=this.pm.createTransaction();p.setNodeMarkup(s,r,{id:l.attrs.id}),this.pm.dispatch(p)}return}const a=l.content,c=l.attrs.id,d=i.create({id:Fe()},a),u=o.create({id:Fe()},d),h=r.create({id:c},u),f=this.pm.createTransaction();f.replaceWith(s,s+l.nodeSize,h),this.pm.dispatch(f)}_unwrapList(e,t){const{$from:r}=this.pm.selection,o=this._schema.nodes[e];if(!o)return;let i=null,s=null;for(let d=r.depth;d>0;d--){const u=r.node(d);if(u.type.name==="bulletList"||u.type.name==="orderedList"){i=r.before(d),s=u;break}}if(i===null||!s)return;let l=this._schema.nodes.paragraph.create().content;s.firstChild&&s.firstChild.firstChild&&(l=s.firstChild.firstChild.content);const a=o.create({id:s.attrs.id,...t},l),c=this.pm.createTransaction();c.replaceWith(i,i+s.nodeSize,a),this.pm.dispatch(c)}_convertToCodeBlock(e,t){const r=this._schema.nodes.codeBlock;if(!r)return;let o="";t.content.forEach(a=>{a.isText&&(o+=a.text||"")});const i=o?this._schema.text(o):null,s=r.create({id:t.attrs.id},i?[i]:[]),l=this.pm.createTransaction();l.replaceWith(e,e+t.nodeSize,s),this.pm.dispatch(l)}insertColumns(e){const t=this._schema.nodes.columnList,r=this._schema.nodes.column,o=this._schema.nodes.paragraph;if(!t||!r||!o){console.warn("Column nodes not available in schema");return}let i;typeof e=="number"?i=Array(e).fill(100/e):i=e;const s=i.map(u=>r.create({width:u},o.create())),l=t.create(null,s),{$from:a}=this.pm.selection,c=a.end(a.depth),d=this.pm.createTransaction();d.insert(c,l),this.pm.dispatch(d)}addColumn(e,t="end",r){const o=this._schema.nodes.column,i=this._schema.nodes.paragraph,s=this.pm.doc.nodeAt(e);if(!o||!i||!s||s.type.name!=="columnList")return;const l=this.pm.createTransaction();let a;if(t==="start")a=1;else if(t==="end")a=s.nodeSize-1;else{let u=1;for(let h=0;h<t&&h<s.childCount;h++)u+=s.child(h).nodeSize;a=u}const c=r??100/(s.childCount+1),d=o.create({width:c},i.create());if(l.insert(e+a,d),!r){const u=100/(s.childCount+1);let h=e+1;for(let f=0;f<s.childCount;f++){const p=s.child(f);l.setNodeMarkup(l.mapping.map(h),void 0,{...p.attrs,width:u}),h+=p.nodeSize}}this.pm.dispatch(l)}removeColumn(e){const t=this.pm.doc.nodeAt(e);if(!t||t.type.name!=="column")return;const r=this.pm.doc.resolve(e),o=r.before(r.depth),i=this.pm.doc.nodeAt(o);if(!i||i.type.name!=="columnList")return;const s=this.pm.createTransaction();if(i.childCount<=2){const l=[];i.forEach((a,c)=>{o+1+c!==e&&a.forEach(u=>l.push(u))}),s.replaceWith(o,o+i.nodeSize,l)}else{s.delete(e,e+t.nodeSize);const a=100/(i.childCount-1);let c=o+1;i.forEach((d,u)=>{o+1+u!==e&&s.setNodeMarkup(s.mapping.map(c),void 0,{...d.attrs,width:a}),c+=d.nodeSize})}this.pm.dispatch(s)}distributeColumns(e){const t=this.pm.doc.nodeAt(e);if(!t||t.type.name!=="columnList")return;const r=100/t.childCount,o=this.pm.createTransaction();let i=e+1;t.forEach(s=>{o.setNodeMarkup(i,void 0,{...s.attrs,width:r}),i+=s.nodeSize}),this.pm.dispatch(o)}focus(e="end"){this._pmView.focus(),e==="start"?this.pm.setSelection(this.pm.createTextSelection(1)):e==="end"?this.pm.setSelection(this.pm.createTextSelection(this.pm.doc.content.size-1)):this.pm.setSelection(this.pm.createTextSelection(e))}blur(){this._pmView.dom.blur()}get hasFocus(){return this._pmView.hasFocus()}toJSON(){return this.getDocument()}fromJSON(e){this.setDocument(e)}on(e,t){let r=this._listeners.get(e);return r||(r=new Set,this._listeners.set(e,r)),r.add(t),()=>this.off(e,t)}off(e,t){var r;(r=this._listeners.get(e))==null||r.delete(t)}_emit(e,t){var r;(r=this._listeners.get(e))==null||r.forEach(o=>o(t))}mount(e){this._destroyed||(this._pmView.dom.parentElement&&this._pmView.dom.parentElement.removeChild(this._pmView.dom),e.appendChild(this._pmView.dom))}destroy(){this._destroyed||(this._destroyed=!0,this._pmView.destroy(),this._listeners.clear())}get isDestroyed(){return this._destroyed}get isEditable(){return this._config.editable!==!1}setEditable(e){this._config.editable=e,this._pmView.setProps({editable:()=>e})}}function dh(n={}){const[e,t]=N.useState(null),r=N.useRef(n),o=N.useRef(null);return N.useEffect(()=>{var i;const{customBlocks:s,...l}=r.current,a={};if(s&&s.length>0)for(const u of s)a[u.type]=(h,f,p,g,b)=>{const x=o.current;if(!x)throw new Error("Editor not initialized");return u.createNodeView(x)(h,f,p,g,b)};const c={...l.prosemirror,nodeViews:{...(i=l.prosemirror)==null?void 0:i.nodeViews,...a}},d=new Hu({...l,prosemirror:Object.keys(a).length>0?c:l.prosemirror});return o.current=d,t(d),()=>{d.destroy(),o.current=null}},[]),e}function uh(n,e){return N.useMemo(()=>!n||n.isDestroyed?[]:e.filter(t=>t.slashMenu!==void 0).map(t=>{const{slashMenu:r,type:o,propSchema:i}=t;return{id:o,title:r.title,description:r.description,icon:r.icon,keywords:r.aliases,group:r.group||"Custom",action:s=>{const l={};for(const[c,d]of Object.entries(i))l[c]=d.default;const a=s.state.schema.nodes[o];if(a){const c=a.create(l);s.dispatch(s.state.tr.replaceSelectionWith(c))}}}}),[n,e])}const Ju=N.forwardRef(function({editor:e,className:t,style:r,children:o},i){const s=N.useRef(null),l=N.useRef(!1);return N.useImperativeHandle(i,()=>({container:s.current,editor:e}),[e]),N.useEffect(()=>{const a=s.current;!a||!e||e.isDestroyed||(e.mount(a),l.current=!0)},[e]),m.jsx("div",{ref:s,className:t?`openblock-container ${t}`:"openblock-container",style:{position:"relative",...r},children:o})});Ju.displayName="OpenBlockView";const Uu={heading1:({className:n})=>m.jsx("svg",{className:n,width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:m.jsx("path",{d:"M4 12h8M4 6v12M12 6v12M17 12l3-2v8"})}),heading2:({className:n})=>m.jsx("svg",{className:n,width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:m.jsx("path",{d:"M4 12h8M4 6v12M12 6v12M17 10c1.5-1 3 0 3 2s-3 3-3 5h3"})}),heading3:({className:n})=>m.jsx("svg",{className:n,width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:m.jsx("path",{d:"M4 12h8M4 6v12M12 6v12M17 10c1.5-1 3 0 3 1.5c0 1-1 1.5-1.5 1.5c.5 0 1.5.5 1.5 1.5c0 1.5-1.5 2.5-3 1.5"})}),list:({className:n})=>m.jsx("svg",{className:n,width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:m.jsx("path",{d:"M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"})}),listOrdered:({className:n})=>m.jsx("svg",{className:n,width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:m.jsx("path",{d:"M10 6h11M10 12h11M10 18h11M3 5v3h2M3 10v1c0 1 2 2 2 2s-2 1-2 2v1h4M3 17v4h2l2-2"})}),quote:({className:n})=>m.jsxs("svg",{className:n,width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[m.jsx("path",{d:"M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21"}),m.jsx("path",{d:"M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v4"})]}),code:({className:n})=>m.jsx("svg",{className:n,width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:m.jsx("path",{d:"M16 18l6-6-6-6M8 6l-6 6 6 6"})}),minus:({className:n})=>m.jsx("svg",{className:n,width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:m.jsx("path",{d:"M5 12h14"})}),image:({className:n})=>m.jsxs("svg",{className:n,width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[m.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2",ry:"2"}),m.jsx("circle",{cx:"8.5",cy:"8.5",r:"1.5"}),m.jsx("polyline",{points:"21 15 16 10 5 21"})]}),checkSquare:({className:n})=>m.jsxs("svg",{className:n,width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[m.jsx("polyline",{points:"9 11 12 14 22 4"}),m.jsx("path",{d:"M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"})]}),callout:({className:n})=>m.jsx("svg",{className:n,width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:m.jsx("path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"})}),table:({className:n})=>m.jsxs("svg",{className:n,width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[m.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2",ry:"2"}),m.jsx("line",{x1:"3",y1:"9",x2:"21",y2:"9"}),m.jsx("line",{x1:"3",y1:"15",x2:"21",y2:"15"}),m.jsx("line",{x1:"9",y1:"3",x2:"9",y2:"21"}),m.jsx("line",{x1:"15",y1:"3",x2:"15",y2:"21"})]}),embed:({className:n})=>m.jsxs("svg",{className:n,width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[m.jsx("rect",{x:"2",y:"3",width:"20",height:"14",rx:"2",ry:"2"}),m.jsx("line",{x1:"8",y1:"21",x2:"16",y2:"21"}),m.jsx("line",{x1:"12",y1:"17",x2:"12",y2:"21"})]}),youtube:({className:n})=>m.jsxs("svg",{className:n,width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[m.jsx("path",{d:"M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"}),m.jsx("polygon",{points:"9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"})]})};function hh({editor:n,items:e,customItems:t,itemOrder:r,hideItems:o,renderItem:i,className:s}){const[l,a]=N.useState(null),[c,d]=N.useState(0),[u,h]=N.useState(!1),f=N.useRef(null),p=N.useMemo(()=>{if(!n)return[];if(e)return e;const w=ru(n.pm.state.schema),k=t?[...w,...t]:w,C=new Map;if(k.forEach(O=>C.set(O.id,O)),r){const O=[];return r.forEach(S=>{const y=C.get(S);y&&O.push(y)}),O}if(o&&o.length>0){const O=new Set(o);return k.filter(S=>!O.has(S.id))}return k},[n,e,t,r,o]),g=l?ou(p,l.query):[];N.useEffect(()=>{if(!n||n.isDestroyed)return;const w=()=>{const C=ae.getState(n.pm.state);a(C??null),d(0)};return w(),n.on("transaction",w)},[n]),N.useEffect(()=>{if(!n||n.isDestroyed||!(l!=null&&l.active))return;const w=C=>{switch(C.key){case"ArrowDown":C.preventDefault(),C.stopPropagation(),d(O=>Math.min(O+1,g.length-1));break;case"ArrowUp":C.preventDefault(),C.stopPropagation(),d(O=>Math.max(O-1,0));break;case"Enter":C.preventDefault(),C.stopPropagation(),g[c]&&b(g[c]);break;case"Escape":C.preventDefault(),C.stopPropagation(),tu(n.pm.view);break}},k=n.pm.view.dom;return k.addEventListener("keydown",w,!0),()=>k.removeEventListener("keydown",w,!0)},[l==null?void 0:l.active,g,c,n]);const b=N.useCallback(w=>{!n||n.isDestroyed||!l||(nu(n.pm.view,l,w.action),n.pm.view.focus())},[n,l]);if(N.useLayoutEffect(()=>{if(!(l!=null&&l.active)||!l.coords||!f.current)return;const w=f.current.offsetHeight||300,k=window.innerHeight-l.coords.bottom-8,C=l.coords.top-8;h(k<w&&C>k)},[l==null?void 0:l.active,l==null?void 0:l.coords,g.length]),!(l!=null&&l.active)||!l.coords)return null;const x={position:"fixed",left:l.coords.left,zIndex:1e3,...u?{bottom:window.innerHeight-l.coords.top+4}:{top:l.coords.bottom+4}};return m.jsx("div",{ref:f,className:`ob-slash-menu ${s||""}`,style:x,role:"listbox",children:g.length===0?m.jsx("div",{className:"ob-slash-menu-empty",children:"No results"}):g.map((w,k)=>{const C=k===c,O=w.icon?Uu[w.icon]:null;return i?m.jsx("div",{onClick:()=>b(w),role:"option","aria-selected":C,children:i(w,C)},w.id):m.jsxs("div",{className:`ob-slash-menu-item ${C?"ob-slash-menu-item--selected":""}`,onClick:()=>b(w),onMouseEnter:()=>d(k),role:"option","aria-selected":C,children:[O&&m.jsx("span",{className:"ob-slash-menu-item-icon",children:m.jsx(O,{})}),m.jsxs("div",{className:"ob-slash-menu-item-content",children:[m.jsx("span",{className:"ob-slash-menu-item-title",children:w.title}),w.description&&m.jsx("span",{className:"ob-slash-menu-item-description",children:w.description})]})]},w.id)})})}function Ku(n){if(!n.trim())return!1;const e=n.startsWith("http://")||n.startsWith("https://")?n:`https://${n}`;try{return new URL(e),!0}catch{return!1}}function Yu(n){const e=n.trim();return e?e.startsWith("http://")||e.startsWith("https://")?e:`https://${e}`:""}function Gu({editor:n,currentUrl:e,onClose:t,position:r,className:o,triggerRef:i}){const[s,l]=N.useState(e||""),[a,c]=N.useState(null),d=N.useRef(null),u=N.useRef(null);N.useEffect(()=>{var x,w;(x=d.current)==null||x.focus(),(w=d.current)==null||w.select()},[]),N.useEffect(()=>{const x=k=>{const C=k.target;u.current&&u.current.contains(C)||i!=null&&i.current&&i.current.contains(C)||t()},w=requestAnimationFrame(()=>{document.addEventListener("mousedown",x)});return()=>{cancelAnimationFrame(w),document.removeEventListener("mousedown",x)}},[t,i]),N.useEffect(()=>{const x=w=>{w.key==="Escape"&&t()};return document.addEventListener("keydown",x),()=>document.removeEventListener("keydown",x)},[t]);const h=N.useCallback(x=>{if(x.preventDefault(),!s.trim()){c("Please enter a URL");return}if(!Ku(s)){c("Please enter a valid URL");return}const w=Yu(s);n.setLink(w),n.pm.view.focus(),t()},[n,s,t]),f=N.useCallback(()=>{n.removeLink(),n.pm.view.focus(),t()},[n,t]),p=N.useCallback(()=>{e&&window.open(e,"_blank","noopener,noreferrer")},[e]),g=N.useCallback(x=>{l(x.target.value),c(null)},[]),b=e!==null;return m.jsx("div",{ref:u,className:`ob-link-popover ${o||""}`,style:{position:"fixed",left:r.left,top:r.top,zIndex:1001},role:"dialog","aria-label":b?"Edit link":"Add link",children:m.jsxs("form",{onSubmit:h,className:"ob-link-popover-form",children:[m.jsx("div",{className:"ob-link-popover-input-row",children:m.jsxs("div",{className:`ob-link-popover-input-wrapper ${a?"ob-link-popover-input-wrapper--error":""}`,children:[m.jsxs("svg",{className:"ob-link-popover-input-icon",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",children:[m.jsx("path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"}),m.jsx("path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"})]}),m.jsx("input",{ref:d,type:"text",className:"ob-link-popover-input",value:s,onChange:g,placeholder:"Enter URL...","aria-label":"Link URL","aria-invalid":!!a}),b&&m.jsxs(m.Fragment,{children:[m.jsx("button",{type:"button",className:"ob-link-popover-inline-btn",onClick:p,title:"Open link",children:m.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",children:[m.jsx("path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"}),m.jsx("polyline",{points:"15 3 21 3 21 9"}),m.jsx("line",{x1:"10",y1:"14",x2:"21",y2:"3"})]})}),m.jsx("button",{type:"button",className:"ob-link-popover-inline-btn ob-link-popover-inline-btn--danger",onClick:f,title:"Remove link",children:m.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",children:m.jsx("path",{d:"M18 6 6 18M6 6l12 12"})})})]}),m.jsx("button",{type:"submit",className:"ob-link-popover-inline-btn ob-link-popover-inline-btn--primary",title:b?"Update link":"Add link",children:m.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",children:m.jsx("polyline",{points:"20 6 9 17 4 12"})})})]})}),a&&m.jsx("p",{className:"ob-link-popover-error",children:a})]})})}const Xu=[{value:"",label:"Default"},{value:"#374151",label:"Gray"},{value:"#dc2626",label:"Red"},{value:"#ea580c",label:"Orange"},{value:"#ca8a04",label:"Yellow"},{value:"#16a34a",label:"Green"},{value:"#2563eb",label:"Blue"},{value:"#7c3aed",label:"Purple"},{value:"#db2777",label:"Pink"}],Zu=[{value:"",label:"Default"},{value:"#f3f4f6",label:"Gray"},{value:"#fee2e2",label:"Red"},{value:"#ffedd5",label:"Orange"},{value:"#fef9c3",label:"Yellow"},{value:"#dcfce7",label:"Green"},{value:"#dbeafe",label:"Blue"},{value:"#ede9fe",label:"Purple"},{value:"#fce7f3",label:"Pink"}];function Qu({editor:n,currentTextColor:e,currentBackgroundColor:t,textColors:r=Xu,backgroundColors:o=Zu,textColorLabel:i="Color",backgroundColorLabel:s="Background",onClose:l}){const[a,c]=N.useState(!1),[d,u]=N.useState({left:0}),h=N.useRef(null),f=N.useRef(null),p=N.useRef(null),g=e||t;N.useEffect(()=>{const k=C=>{h.current&&!h.current.contains(C.target)&&(c(!1),l==null||l())};return a&&document.addEventListener("mousedown",k),()=>{document.removeEventListener("mousedown",k)}},[a,l]),N.useLayoutEffect(()=>{if(!a||!f.current||!p.current)return;const k=f.current.getBoundingClientRect(),C=p.current.offsetHeight||250,O=window.innerHeight-k.bottom-8,S=k.top-8,y=O<C&&S>O;u({left:k.left+k.width/2,...y?{bottom:window.innerHeight-k.top+8}:{top:k.bottom+8}})},[a]);const b=N.useCallback(()=>{c(!a)},[a]),x=N.useCallback(k=>{k===""?n.removeTextColor():n.setTextColor(k),n.pm.view.focus()},[n]),w=N.useCallback(k=>{k===""?n.removeBackgroundColor():n.setBackgroundColor(k),n.pm.view.focus()},[n]);return m.jsxs("div",{className:"ob-color-picker",ref:h,children:[m.jsx("button",{ref:f,type:"button",className:`ob-bubble-menu-btn ${g?"ob-bubble-menu-btn--active":""}`,onClick:b,onMouseDown:k=>k.preventDefault(),title:"Colors","aria-expanded":a,"aria-haspopup":"listbox",children:m.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",children:[m.jsx("path",{d:"M5 18h14",strokeWidth:"3",stroke:e||t||"currentColor"}),m.jsx("path",{d:"M6 15l6-12 6 12"}),m.jsx("path",{d:"M8.5 11h7"})]})}),a&&m.jsxs("div",{ref:p,className:"ob-color-picker-dropdown",role:"listbox",style:{position:"fixed",left:d.left,top:d.top,bottom:d.bottom,transform:"translateX(-50%)"},children:[m.jsxs("div",{className:"ob-color-picker-section",children:[m.jsx("div",{className:"ob-color-picker-label",children:i}),m.jsx("div",{className:"ob-color-picker-grid",children:r.map(k=>{const C=k.value===""?!e:e===k.value;return m.jsx("button",{type:"button",className:`ob-color-picker-option ${C?"ob-color-picker-option--active":""}`,onClick:()=>x(k.value),onMouseDown:O=>O.preventDefault(),role:"option","aria-selected":C,title:k.label,children:k.value===""?m.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[m.jsx("circle",{cx:"12",cy:"12",r:"10"}),m.jsx("path",{d:"M4 4l16 16"})]}):m.jsx("span",{className:"ob-color-picker-swatch ob-color-picker-swatch--text",children:m.jsx("span",{style:{color:k.value},children:"A"})})},`text-${k.value||"default"}`)})})]}),m.jsx("div",{className:"ob-color-picker-divider"}),m.jsxs("div",{className:"ob-color-picker-section",children:[m.jsx("div",{className:"ob-color-picker-label",children:s}),m.jsx("div",{className:"ob-color-picker-grid",children:o.map(k=>{const C=k.value===""?!t:t===k.value;return m.jsx("button",{type:"button",className:`ob-color-picker-option ${C?"ob-color-picker-option--active":""}`,onClick:()=>w(k.value),onMouseDown:O=>O.preventDefault(),role:"option","aria-selected":C,title:k.label,children:k.value===""?m.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[m.jsx("circle",{cx:"12",cy:"12",r:"10"}),m.jsx("path",{d:"M4 4l16 16"})]}):m.jsx("span",{className:"ob-color-picker-swatch",style:{backgroundColor:k.value}})},`bg-${k.value||"default"}`)})})]})]})]})}const Me={bold:m.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",children:[m.jsx("path",{d:"M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"}),m.jsx("path",{d:"M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"})]}),italic:m.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",children:m.jsx("path",{d:"M19 4h-9M14 20H5M15 4L9 20"})}),underline:m.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",children:[m.jsx("path",{d:"M6 4v6a6 6 0 0 0 12 0V4"}),m.jsx("path",{d:"M4 20h16"})]}),strikethrough:m.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",children:[m.jsx("path",{d:"M16 4c-1.5 0-3-.5-4.5-.5S8 4 6.5 5.5 5 9 6.5 10.5"}),m.jsx("path",{d:"M8 20c1.5 0 3 .5 4.5.5s3.5-.5 5-2 1.5-4 0-5.5"}),m.jsx("path",{d:"M4 12h16"})]}),code:m.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",children:[m.jsx("path",{d:"m16 18 6-6-6-6"}),m.jsx("path",{d:"m8 6-6 6 6 6"})]}),link:m.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",children:[m.jsx("path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"}),m.jsx("path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"})]}),alignLeft:m.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",children:m.jsx("path",{d:"M4 6h16M4 12h10M4 18h14"})}),alignCenter:m.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",children:m.jsx("path",{d:"M4 6h16M7 12h10M5 18h14"})}),alignRight:m.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",children:m.jsx("path",{d:"M4 6h16M10 12h10M6 18h14"})})},eh={bold:{id:"bold",label:"Bold (Cmd+B)",icon:Me.bold,isActive:n=>n.activeMarks.bold,action:n=>{n.toggleBold(),n.pm.view.focus()}},italic:{id:"italic",label:"Italic (Cmd+I)",icon:Me.italic,isActive:n=>n.activeMarks.italic,action:n=>{n.toggleItalic(),n.pm.view.focus()}},underline:{id:"underline",label:"Underline (Cmd+U)",icon:Me.underline,isActive:n=>n.activeMarks.underline,action:n=>{n.toggleUnderline(),n.pm.view.focus()}},strikethrough:{id:"strikethrough",label:"Strikethrough",icon:Me.strikethrough,isActive:n=>n.activeMarks.strikethrough,action:n=>{n.toggleStrikethrough(),n.pm.view.focus()}},code:{id:"code",label:"Inline code",icon:Me.code,isActive:n=>n.activeMarks.code,action:n=>{n.toggleCode(),n.pm.view.focus()}},alignLeft:{id:"alignLeft",label:"Align left",icon:Me.alignLeft,isActive:n=>n.textAlign==="left",action:n=>{n.setTextAlign("left"),n.pm.view.focus()}},alignCenter:{id:"alignCenter",label:"Align center",icon:Me.alignCenter,isActive:n=>n.textAlign==="center",action:n=>{n.setTextAlign("center"),n.pm.view.focus()}},alignRight:{id:"alignRight",label:"Align right",icon:Me.alignRight,isActive:n=>n.textAlign==="right",action:n=>{n.setTextAlign("right"),n.pm.view.focus()}}},th=["blockType","---","alignLeft","alignCenter","alignRight","---","bold","italic","underline","strikethrough","---","code","link","---","color"];function nh({active:n,onClick:e,title:t,children:r}){return m.jsx("button",{type:"button",className:`ob-bubble-menu-btn ${n?"ob-bubble-menu-btn--active":""}`,onClick:e,title:t,onMouseDown:o=>o.preventDefault(),children:r})}const ht=[{type:"paragraph",label:"Paragraph",icon:m.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",children:m.jsx("path",{d:"M4 6h16M4 12h16M4 18h10"})})},{type:"heading",label:"Heading 1",props:{level:1},icon:m.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",children:[m.jsx("path",{d:"M4 12h8M4 6v12M12 6v12"}),m.jsx("path",{d:"M20 8v8M17 8h6",strokeWidth:"1.5"})]})},{type:"heading",label:"Heading 2",props:{level:2},icon:m.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",children:[m.jsx("path",{d:"M4 12h8M4 6v12M12 6v12"}),m.jsx("path",{d:"M16 12a3 3 0 1 1 6 0c0 1.5-3 3-3 3h3M16 18h6",strokeWidth:"1.5"})]})},{type:"heading",label:"Heading 3",props:{level:3},icon:m.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",children:[m.jsx("path",{d:"M4 12h8M4 6v12M12 6v12"}),m.jsx("path",{d:"M16 9a2 2 0 1 1 4 1.5c-.5.5-2 1-2 1s1.5.5 2 1a2 2 0 1 1-4 1.5",strokeWidth:"1.5"})]})},{type:"blockquote",label:"Quote",icon:m.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",children:[m.jsx("path",{d:"M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z"}),m.jsx("path",{d:"M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v4z"})]})},{type:"bulletList",label:"Bullet List",icon:m.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",children:[m.jsx("circle",{cx:"4",cy:"7",r:"1.5",fill:"currentColor",stroke:"none"}),m.jsx("circle",{cx:"4",cy:"12",r:"1.5",fill:"currentColor",stroke:"none"}),m.jsx("circle",{cx:"4",cy:"17",r:"1.5",fill:"currentColor",stroke:"none"}),m.jsx("path",{d:"M9 7h11M9 12h11M9 17h11"})]})},{type:"orderedList",label:"Numbered List",icon:m.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",children:[m.jsx("path",{d:"M10 7h10M10 12h10M10 17h10"}),m.jsx("path",{d:"M4 7h2M4 17h2M5 11v3h2",strokeWidth:"1.5"})]})},{type:"codeBlock",label:"Code Block",icon:m.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",children:[m.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2"}),m.jsx("path",{d:"m9 9-3 3 3 3M15 9l3 3-3 3"})]})}];function rh(n){if(n.type==="heading")return`Heading ${n.props.level}`;const e=ht.find(t=>t.type===n.type);return(e==null?void 0:e.label)||"Paragraph"}function oh(n){if(n.type==="heading"){const t=n.props.level,r=ht.find(o=>{var i;return o.type==="heading"&&((i=o.props)==null?void 0:i.level)===t});return(r==null?void 0:r.icon)||ht[0].icon}const e=ht.find(t=>t.type===n.type);return(e==null?void 0:e.icon)||ht[0].icon}function ih(n,e){var t;return!(n.type!==e.type||(t=e.props)!=null&&t.level&&n.props.level!==e.props.level)}function sh({editor:n,blockType:e}){const[t,r]=N.useState(!1),[o,i]=N.useState(!1),s=N.useRef(null),l=N.useRef(null),a=N.useRef(null);N.useEffect(()=>{const d=u=>{s.current&&!s.current.contains(u.target)&&r(!1)};return t&&document.addEventListener("mousedown",d),()=>{document.removeEventListener("mousedown",d)}},[t]),N.useLayoutEffect(()=>{if(!t||!l.current||!a.current)return;const d=l.current.getBoundingClientRect(),u=a.current.offsetHeight||300,h=window.innerHeight-d.bottom-8,f=d.top-8;i(h<u&&f>h)},[t]);const c=N.useCallback(d=>{n.setBlockType(d.type,d.props||{}),n.pm.view.focus(),r(!1)},[n]);return m.jsxs("div",{className:"ob-block-type-selector",ref:s,children:[m.jsxs("button",{ref:l,type:"button",className:"ob-block-type-selector-btn",onClick:()=>r(!t),onMouseDown:d=>d.preventDefault(),"aria-expanded":t,"aria-haspopup":"listbox",children:[m.jsx("span",{className:"ob-block-type-selector-icon",children:oh(e)}),m.jsx("span",{className:"ob-block-type-selector-label",children:rh(e)}),m.jsx("svg",{className:`ob-block-type-selector-chevron ${t?"ob-block-type-selector-chevron--open":""}`,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",children:m.jsx("path",{d:"m6 9 6 6 6-6"})})]}),t&&m.jsx("div",{ref:a,className:`ob-block-type-dropdown ${o?"ob-block-type-dropdown--upward":""}`,role:"listbox",children:ht.map((d,u)=>{var h;const f=ih(e,d);return m.jsxs("button",{type:"button",className:`ob-block-type-option ${f?"ob-block-type-option--active":""}`,onClick:()=>c(d),onMouseDown:p=>p.preventDefault(),role:"option","aria-selected":f,children:[m.jsx("span",{className:"ob-block-type-option-icon",children:d.icon}),m.jsx("span",{className:"ob-block-type-option-label",children:d.label}),f&&m.jsx("svg",{className:"ob-block-type-option-check",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",children:m.jsx("path",{d:"M20 6 9 17l-5-5"})})]},`${d.type}-${((h=d.props)==null?void 0:h.level)||u}`)})})]})}function fh({editor:n,customItems:e=[],itemOrder:t,hideItems:r=[],children:o,className:i}){const[s,l]=N.useState(null),[a,c]=N.useState(!1),d=N.useRef(null);N.useEffect(()=>{if(!n||n.isDestroyed)return;const O=()=>{const y=Re.getState(n.pm.state);l(y??null)};return O(),n.on("transaction",O)},[n]),N.useEffect(()=>{s!=null&&s.visible||c(!1)},[s==null?void 0:s.visible]);const u=N.useCallback(()=>{c(!0)},[]),h=N.useCallback(()=>{c(!1)},[]);if(!n||n.isDestroyed||!(s!=null&&s.visible)||!s.coords)return null;const p={position:"fixed",left:s.coords.left,top:s.coords.top-36-8,zIndex:1e3};if(o)return m.jsx("div",{className:`ob-bubble-menu ${i||""}`,style:p,children:o({editor:n,state:s})});const g={...eh};for(const O of e)g[O.id]=O;const b=t||[...th,...e.length>0?["---",...e.map(O=>O.id)]:[]],x=new Set(r),{activeMarks:w,blockType:k}=s,C=(O,S)=>{if(O==="---")return m.jsx("span",{className:"ob-bubble-menu-divider"},`divider-${S}`);if(x.has(O))return null;if(O==="blockType")return m.jsx(sh,{editor:n,blockType:k},"blockType");if(O==="link")return m.jsx("button",{ref:d,type:"button",className:`ob-bubble-menu-btn ${w.link?"ob-bubble-menu-btn--active":""}`,onClick:u,onMouseDown:D=>D.preventDefault(),title:w.link?"Edit link":"Add link",children:Me.link},"link");if(O==="color")return m.jsx(Qu,{editor:n,currentTextColor:w.textColor,currentBackgroundColor:w.backgroundColor},"color");const y=g[O];if(!y)return null;const T=y.isActive?y.isActive(s,n):!1;return m.jsx(nh,{active:T,onClick:()=>y.action(n,s),title:y.label,children:y.icon},y.id)};return m.jsxs("div",{className:`ob-bubble-menu ${i||""}`,style:p,role:"toolbar","aria-label":"Text formatting",children:[b.map((O,S)=>C(O,S)),a&&d.current&&m.jsx(Gu,{editor:n,currentUrl:w.link,onClose:h,triggerRef:d,position:{left:d.current.getBoundingClientRect().left,top:d.current.getBoundingClientRect().bottom+8}})]})}function lh(n,e){const t=n.pm.view;let r=-1;if(t.state.doc.descendants((c,d)=>{if(c.type.name==="table"&&r===-1){const u=t.nodeDOM(d);if(u===e||e.contains(u))return r=d,!1}return!0}),r===-1)return null;const o=t.state.doc.nodeAt(r);if(!o||o.type.name!=="table")return null;const i=e.querySelectorAll(":scope > tr, :scope > tbody > tr, :scope > thead > tr"),s=[],l=e.getBoundingClientRect();i.forEach(c=>{const d=c.getBoundingClientRect();s.push({element:c,top:d.top-l.top,height:d.height})});const a=[];return i.length>0&&i[0].querySelectorAll(":scope > td, :scope > th").forEach(d=>{const u=d.getBoundingClientRect();a.push({element:d,left:u.left-l.left,width:u.width})}),{tablePos:r,tableElement:e,rowCount:o.childCount,colCount:a.length,rows:s,cols:a}}function ph({editor:n,className:e}){const[t,r]=N.useState(null),[o,i]=N.useState({type:null,index:-1}),[s,l]=N.useState(null),[a,c]=N.useState(null),[d,u]=N.useState(null),h=N.useRef(null);N.useEffect(()=>{if(!n||n.isDestroyed)return;let w=null;const k=()=>{w&&(clearTimeout(w),w=null)},C=()=>{k(),w=setTimeout(()=>{r(null),i({type:null,index:-1})},100)},O=y=>{var T;const D=y.target;if((T=h.current)!=null&&T.contains(D)){k();return}const R=D.closest("table");if(!R){if(t){const j=t.tableElement.getBoundingClientRect();if(y.clientX>=j.right&&y.clientX<=j.right+30&&y.clientY>=j.top&&y.clientY<=j.bottom||y.clientY>=j.bottom&&y.clientY<=j.bottom+30&&y.clientX>=j.left&&y.clientX<=j.right){k();return}}C();return}k();const z=lh(n,R);if(!z){C();return}r(z);const $=R.getBoundingClientRect(),P=y.clientX-$.left,H=y.clientY-$.top;if(P<0&&P>-40){const j=z.rows.findIndex(Z=>H>=Z.top&&H<=Z.top+Z.height);if(j!==-1){i({type:"row",index:j});return}}if(H<0&&H>-40){const j=z.cols.findIndex(Z=>P>=Z.left&&P<=Z.left+Z.width);if(j!==-1){i({type:"col",index:j});return}}const be=D.closest("td, th");if(be){const j=be.getBoundingClientRect(),Z=be.closest("tr");if(Z){const Ht=Array.from(R.querySelectorAll(":scope > tr, :scope > tbody > tr, :scope > thead > tr")).indexOf(Z),Jt=Array.from(Z.children).indexOf(be);y.clientX-j.left<20?i({type:"row",index:Ht}):y.clientY-j.top<20?i({type:"col",index:Jt}):i({type:null,index:-1})}}},S=()=>{C()};return document.addEventListener("mousemove",O),document.addEventListener("mouseleave",S),()=>{k(),document.removeEventListener("mousemove",O),document.removeEventListener("mouseleave",S)}},[n,t]),N.useEffect(()=>{const w=k=>{h.current&&!h.current.contains(k.target)&&(l(null),c(null),u(null))};return document.addEventListener("mousedown",w),()=>document.removeEventListener("mousedown",w)},[]);const f=N.useCallback(w=>{!n||n.isDestroyed||!t||(Ou(n.pm.state,n.pm.view.dispatch,t.tablePos,w),n.pm.view.focus(),l(null))},[n,t]),p=N.useCallback(w=>{!n||n.isDestroyed||!t||(Du(n.pm.state,n.pm.view.dispatch,t.tablePos,w),n.pm.view.focus(),l(null))},[n,t]),g=N.useCallback(w=>{!n||n.isDestroyed||!t||(Tu(n.pm.state,n.pm.view.dispatch,t.tablePos,w),n.pm.view.focus(),c(null))},[n,t]),b=N.useCallback(w=>{!n||n.isDestroyed||!t||(Au(n.pm.state,n.pm.view.dispatch,t.tablePos,w),n.pm.view.focus(),c(null))},[n,t]);if(!n||n.isDestroyed||!t)return null;const x=t.tableElement.getBoundingClientRect();return m.jsxs("div",{ref:h,className:`ob-table-handles ${e||""}`,children:[t.rows.map((w,k)=>m.jsxs("div",{className:`ob-table-handle ob-table-handle--row ${o.type==="row"&&o.index===k?"ob-table-handle--visible":""}`,style:{position:"fixed",left:x.left-28,top:x.top+w.top,height:w.height},children:[m.jsx("button",{type:"button",className:"ob-table-handle-btn",onClick:C=>{if(s===k)l(null),u(null);else{const O=C.currentTarget.getBoundingClientRect();l(k),c(null),u({left:O.right+4,top:O.top})}},onMouseDown:C=>C.preventDefault(),title:"Row options",children:m.jsxs("svg",{viewBox:"0 0 24 24",fill:"currentColor",children:[m.jsx("circle",{cx:"12",cy:"6",r:"2"}),m.jsx("circle",{cx:"12",cy:"12",r:"2"}),m.jsx("circle",{cx:"12",cy:"18",r:"2"})]})}),s===k&&d&&m.jsxs("div",{className:"ob-table-handle-menu",style:{left:d.left,top:d.top},children:[m.jsxs("button",{onClick:()=>f(k),children:[m.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:m.jsx("path",{d:"M12 5v14M5 12h14"})}),"Insert above"]}),m.jsxs("button",{onClick:()=>f(k+1),children:[m.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:m.jsx("path",{d:"M12 5v14M5 12h14"})}),"Insert below"]}),t.rowCount>1&&m.jsxs("button",{className:"ob-table-handle-menu-danger",onClick:()=>p(k),children:[m.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:m.jsx("path",{d:"M18 6L6 18M6 6l12 12"})}),"Delete row"]})]})]},`row-${k}`)),t.cols.map((w,k)=>m.jsxs("div",{className:`ob-table-handle ob-table-handle--col ${o.type==="col"&&o.index===k?"ob-table-handle--visible":""}`,style:{position:"fixed",left:x.left+w.left,top:x.top-28,width:w.width},children:[m.jsx("button",{type:"button",className:"ob-table-handle-btn",onClick:C=>{if(a===k)c(null),u(null);else{const O=C.currentTarget.getBoundingClientRect();c(k),l(null),u({left:O.left+O.width/2-75,top:O.bottom+4})}},onMouseDown:C=>C.preventDefault(),title:"Column options",children:m.jsxs("svg",{viewBox:"0 0 24 24",fill:"currentColor",children:[m.jsx("circle",{cx:"6",cy:"12",r:"2"}),m.jsx("circle",{cx:"12",cy:"12",r:"2"}),m.jsx("circle",{cx:"18",cy:"12",r:"2"})]})}),a===k&&d&&m.jsxs("div",{className:"ob-table-handle-menu",style:{left:d.left,top:d.top},children:[m.jsxs("button",{onClick:()=>g(k),children:[m.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:m.jsx("path",{d:"M12 5v14M5 12h14"})}),"Insert left"]}),m.jsxs("button",{onClick:()=>g(k+1),children:[m.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:m.jsx("path",{d:"M12 5v14M5 12h14"})}),"Insert right"]}),t.colCount>1&&m.jsxs("button",{className:"ob-table-handle-menu-danger",onClick:()=>b(k),children:[m.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:m.jsx("path",{d:"M18 6L6 18M6 6l12 12"})}),"Delete column"]})]})]},`col-${k}`)),m.jsx("button",{type:"button",className:"ob-table-extend-btn ob-table-extend-btn--row ob-table-extend-btn--visible",style:{position:"fixed",left:x.left,top:x.bottom+4,width:x.width},onClick:()=>f(t.rowCount),onMouseDown:w=>w.preventDefault(),title:"Add row",children:m.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:m.jsx("path",{d:"M12 5v14M5 12h14"})})}),m.jsx("button",{type:"button",className:"ob-table-extend-btn ob-table-extend-btn--col ob-table-extend-btn--visible",style:{position:"fixed",left:x.right+4,top:x.top,height:x.height},onClick:()=>g(t.colCount),onMouseDown:w=>w.preventDefault(),title:"Add column",children:m.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:m.jsx("path",{d:"M12 5v14M5 12h14"})})})]})}const ah=sr.createContext(null);function mh(n,e){const{type:t,propSchema:r,content:o}=n,{render:i,slashMenu:s}=e,l={id:{default:null}};for(const[d,u]of Object.entries(r))l[d]={default:u.default};const a={group:"block",content:o==="inline"?"inline*":"",atom:o==="none",attrs:l,parseDOM:[{tag:`div[data-block-type="${t}"]`,getAttrs:d=>{const u={id:d.getAttribute("data-block-id")};for(const h of Object.keys(r)){const f=d.getAttribute(`data-${h}`);if(f!==null)try{u[h]=JSON.parse(f)}catch{u[h]=f}}return u}}],toDOM:d=>{const u={"data-block-type":t,"data-block-id":d.attrs.id||"",class:`openblock-custom-block openblock-${t}`,contenteditable:"false"};for(const h of Object.keys(r)){const f=d.attrs[h];f!=null&&(u[`data-${h}`]=typeof f=="object"?JSON.stringify(f):String(f))}return o==="inline"?["div",u,0]:["div",u]}};return{type:t,propSchema:r,content:o,nodeSpec:a,createNodeView:d=>(u,h,f,p,g)=>{const b=document.createElement("div");b.className=`openblock-custom-block openblock-${t}`,b.setAttribute("data-block-type",t),b.setAttribute("data-block-id",u.attrs.id||""),b.contentEditable="false";let x;o==="inline"&&(x=document.createElement("div"),x.className="openblock-block-content",x.contentEditable="true");let w=null;const k=document.createElement("div");k.className="openblock-react-container",b.appendChild(k);const C=O=>{const S={id:O.attrs.id||"",type:t,props:{}};for(const D of Object.keys(r))S.props[D]=O.attrs[D];const y=sr.createRef(),T=m.jsx(ah.Provider,{value:{editor:d},children:m.jsx(i,{block:S,editor:d,isEditable:d.isEditable,contentRef:o==="inline"?y:void 0})});if(w||(w=ys.createRoot(k)),w.render(T),o==="inline"&&x){const D=x;requestAnimationFrame(()=>{const R=y.current;R&&!R.contains(D)&&R.appendChild(D)})}};return C(u),{dom:b,contentDOM:x,update:O=>O.type.name!==t?!1:(C(O),!0),destroy:()=>{w&&(w.unmount(),w=null)},stopEvent:O=>O.target!==b,ignoreMutation:()=>!0}},slashMenu:s}}function gh(n,e){return sr.useCallback(t=>{if(!n||n.isDestroyed)return;let r=null;if(n.pm.doc.descendants((o,i)=>{if(o.attrs.id===e)return r=i,!1}),r!==null){const o=n.pm.doc.nodeAt(r);if(o){const i=n.pm.createTransaction();i.setNodeMarkup(r,void 0,{...o.attrs,...t}),n.pm.dispatch(i)}}},[n,e])}export{fh as B,Ju as O,hh as S,ph as T,dh as a,uh as b,mh as c,ys as d,m as j,bs as r,gh as u};
