!function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([function(e,t,r){e.exports=r(5)},function(e,t,r){},function(e,t,r){},function(e,t,r){},function(e,t,r){},function(e,t,r){"use strict";function n(){}function o(e,t){for(var r in t)e[r]=t[r];return e}function a(e,t){for(var r in t)e[r]=1;return e}function s(e,t){return 0===t&&e(),()=>{--t||e()}}function i(e){e()}function c(e,t){e.appendChild(t)}function l(e,t,r){e.insertBefore(t,r)}function u(e){e.parentNode.removeChild(e)}function d(e,t){for(var r=0;r<e.length;r+=1)e[r]&&e[r].d(t)}function p(e){return document.createElement(e)}function f(e){return document.createTextNode(e)}function h(){return document.createComment("")}function m(e,t,r){e.addEventListener(t,r,!1)}function v(e,t,r){e.removeEventListener(t,r,!1)}function _(e,t,r){e.setAttribute(t,r)}function g(e,t){e.data=""+t}function y(e){return e}function b({a:e,b:t,delta:r,duration:n},o,a){const s=16.666/n;let i="{\n";for(let t=0;t<=1;t+=s){const n=e+r*o(t);i+=100*t+`%{${a(n,1-n)}}\n`}return i+`100% {${a(t,1-t)}}\n}`}function j(e){let t=5381,r=e.length;for(;r--;)t=(t<<5)-t^e.charCodeAt(r);return t>>>0}function x(e,t,r,o,a){let s,c,l,u=r.call(e,t,o),d=!1;return{t:a?0:1,running:!1,program:null,pending:null,run(e,t){"function"==typeof u?w.wait().then(()=>{u=u(),this._run(e,t)}):this._run(e,t)},_run(e,r){s=u.duration||300,c=u.easing||y;const o={start:window.performance.now()+(u.delay||0),b:e,callback:r||n};a&&!d&&(u.css&&u.delay&&(l=t.style.cssText,t.style.cssText+=u.css(0,1)),u.tick&&u.tick(0,1),d=!0),e||(o.group=N.current,N.current.remaining+=1),u.delay?this.pending=o:this.start(o),this.running||(this.running=!0,w.add(this))},start(r){if(e.fire(`${r.b?"intro":"outro"}.start`,{node:t}),r.a=this.t,r.delta=r.b-r.a,r.duration=s*Math.abs(r.b-r.a),r.end=r.start+r.duration,u.css){u.delay&&(t.style.cssText=l);const e=b(r,c,u.css);w.addRule(e,r.name="__svelte_"+j(e)),t.style.animation=(t.style.animation||"").split(", ").filter(e=>e&&(r.delta<0||!/__svelte/.test(e))).concat(`${r.name} ${r.duration}ms linear 1 forwards`).join(", ")}this.program=r,this.pending=null},update(e){const t=this.program;if(!t)return;const r=e-t.start;this.t=t.a+t.delta*c(r/t.duration),u.tick&&u.tick(this.t,1-this.t)},done(){const r=this.program;this.t=r.b,u.tick&&u.tick(this.t,1-this.t),e.fire(`${r.b?"intro":"outro"}.end`,{node:t}),r.b||r.invalidated?u.css&&w.deleteRule(t,r.name):(r.group.callbacks.push(()=>{r.callback(),u.css&&w.deleteRule(t,r.name)}),0==--r.group.remaining&&r.group.callbacks.forEach(i)),this.running=!!this.pending},abort(e){this.program&&(e&&u.tick&&u.tick(1,0),u.css&&w.deleteRule(t,this.program.name),this.program=this.pending=null,this.running=!1)},invalidate(){this.program&&(this.program.invalidated=!0)}}}r.r(t);let N={};function k(){N.current={remaining:0,callbacks:[]}}var w={running:!1,transitions:[],bound:null,stylesheet:null,activeRules:{},promise:null,add(e){this.transitions.push(e),this.running||(this.running=!0,requestAnimationFrame(this.bound||(this.bound=this.next.bind(this))))},addRule(e,t){if(!this.stylesheet){const e=p("style");document.head.appendChild(e),w.stylesheet=e.sheet}this.activeRules[t]||(this.activeRules[t]=!0,this.stylesheet.insertRule(`@keyframes ${t} ${e}`,this.stylesheet.cssRules.length))},next(){this.running=!1;const e=window.performance.now();let t=this.transitions.length;for(;t--;){const r=this.transitions[t];r.program&&e>=r.program.end&&r.done(),r.pending&&e>=r.pending.start&&r.start(r.pending),r.running?(r.update(e),this.running=!0):r.pending||this.transitions.splice(t,1)}if(this.running)requestAnimationFrame(this.bound);else if(this.stylesheet){let e=this.stylesheet.cssRules.length;for(;e--;)this.stylesheet.deleteRule(e);this.activeRules={}}},deleteRule(e,t){e.style.animation=e.style.animation.split(", ").filter(e=>e&&-1===e.indexOf(t)).join(", ")},wait:()=>(w.promise||(w.promise=Promise.resolve(),w.promise.then(()=>{w.promise=null})),w.promise)};function P(){return Object.create(null)}function S(e){this.destroy=n,this.fire("destroy"),this.set=n,this._fragment.d(!1!==e),this._fragment=null,this._state={}}function R(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}function Y(e,t){return e!=e?t==t:e!==t}function O(e,t){var r=e in this._handlers&&this._handlers[e].slice();if(r)for(var n=0;n<r.length;n+=1){var o=r[n];if(!o.__calling)try{o.__calling=!0,o.call(this,t)}finally{o.__calling=!1}}}function I(e){e._lock=!0,A(e._beforecreate),A(e._oncreate),A(e._aftercreate),e._lock=!1}function C(){return this._state}function T(e,t){e._handlers=P(),e._slots=P(),e._bind=t._bind,e._staged={},e.options=t,e.root=t.root||e,e.store=t.store||e.root.store,t.root||(e._beforecreate=[],e._oncreate=[],e._aftercreate=[])}function M(e,t){var r=this._handlers[e]||(this._handlers[e]=[]);return r.push(t),{cancel:function(){var e=r.indexOf(t);~e&&r.splice(e,1)}}}function F(e){this._set(o({},e)),this.root._lock||I(this.root)}function $(e){var t=this._state,r={},n=!1;for(var a in e=o(this._staged,e),this._staged={},e)this._differs(e[a],t[a])&&(r[a]=n=!0);n&&(this._state=o(o({},t),e),this._recompute(r,this._state),this._bind&&this._bind(r,this._state),this._fragment&&(this.fire("state",{changed:r,current:this._state,previous:t}),this._fragment.p(r,this._state),this.fire("update",{changed:r,current:this._state,previous:t})))}function L(e){o(this._staged,e)}function A(e){for(;e&&e.length;)e.shift()()}function z(e,t){this._fragment[this._fragment.i?"i":"m"](e,t||null)}var B={destroy:S,get:C,fire:O,on:M,set:F,_recompute:n,_set:$,_stage:L,_mount:z,_differs:R};function q(e){var t=e-1;return t*t*t+1}var E=function(e,t){var r=t.delay;void 0===r&&(r=0);var n=t.duration;void 0===n&&(n=400);var o=+getComputedStyle(e).opacity;return{delay:r,duration:n,css:function(e){return"opacity: "+e*o}}};var H=function(e,t){var r=t.delay;void 0===r&&(r=0);var n=t.duration;void 0===n&&(n=400);var o=t.easing;void 0===o&&(o=q);var a=t.x;void 0===a&&(a=0);var s=t.y;void 0===s&&(s=0);var i=getComputedStyle(e),c=+i.opacity,l="none"===i.transform?"":i.transform;return{delay:r,duration:n,easing:o,css:function(e){return"\n\t\t\ttransform: "+l+" translate("+(1-e)*a+"px, "+(1-e)*s+"px);\n\t\t\topacity: "+e*c}}};var G=function(e,t){var r=t.delay;void 0===r&&(r=0);var n=t.duration;void 0===n&&(n=400);var o=t.easing;void 0===o&&(o=q);var a=getComputedStyle(e),s=+a.opacity,i=parseFloat(a.height),c=parseFloat(a.paddingTop),l=parseFloat(a.paddingBottom),u=parseFloat(a.marginTop),d=parseFloat(a.marginBottom),p=parseFloat(a.borderTopWidth),f=parseFloat(a.borderBottomWidth);return{delay:r,duration:n,easing:o,css:function(e){return"overflow: hidden;opacity: "+Math.min(20*e,1)*s+";height: "+e*i+"px;padding-top: "+e*c+"px;padding-bottom: "+e*l+"px;margin-top: "+e*u+"px;margin-bottom: "+e*d+"px;border-top-width: "+e*p+"px;border-bottom-width: "+e*f+"px;"}}};r(1);const W=e=>e?"✔":"𝗫";var K={boolSym:W,clearSearch(){this.set({search:""})}};function V(e){const{component:t,ctx:r}=this._svelte;t.fire("select",{project:r.project})}function D(e,t,r){const n=Object.create(e);return n.key=t[r][0],n.project=t[r][1],n.each_value=t,n.index=r,n}function J(e,t){var r,n;function o(t){e.clearSearch()}return{c(){r=p("span"),(n=p("button")).innerHTML='<span aria-hidden="true">×</span>',m(n,"click",o),n.type="button",n.className="close",_(n,"aria-label","Close"),r.className="input-group-text",r.id="inputGroup-sizing-sm"},m(e,t){l(e,r,t),c(r,n)},d(e){e&&u(r),v(n,"click",o)}}}function Q(e,t){var r,n,o,a,s,i,d,h,_,y,b,j,N,k,w,P,S,R,Y,O,I,C,T,M,F,$,L,A,z,B,q,E,G,W,K=t.index+1,D=t.project.event.name,J=t.project.event.manager,Q=t.project.invoice.number||"",U=t.project.event.date,X=t.boolSym(t.project.checks.ready_for_offer),Z=t.boolSym(t.project.checks.ready_for_invoice),ee=t.boolSym(t.project.checks.ready_for_archive),te=t.boolSym(t.project.checks.payed_by_customer);return{c(){r=p("tr"),n=p("td"),o=f(K),a=f("\n            "),s=p("td"),i=f(D),d=f("\n            "),h=p("td"),_=f(J),y=f("\n            "),b=p("td"),j=f(Q),N=f("\n            "),k=p("td"),w=f(U),P=f("\n            "),S=p("td"),R=p("span"),Y=f(X),I=f("\n            "),C=p("span"),T=f(Z),F=f("\n            "),$=p("span"),L=f(ee),z=f("\n            "),B=p("span"),q=f(te),E=f("\n        "),R.className="checkbox",R.dataset.toggle="tooltip",R.dataset.placement="bottom",R.title=O=t.project.errors.ready_for_offer,C.className="checkbox",C.dataset.toggle="tooltip",C.dataset.placement="bottom",C.title=M=t.project.errors.ready_for_invoice,$.className="checkbox",$.dataset.toggle="tooltip",$.dataset.placement="bottom",$.title=A=t.project.errors.ready_for_archive,B.className="checkbox",S.className="checkbox svelte-ccexqv",r._svelte={component:e,ctx:t},m(r,"click",V),r.className="svelte-ccexqv"},m(e,t){l(e,r,t),c(r,n),c(n,o),c(r,a),c(r,s),c(s,i),c(r,d),c(r,h),c(h,_),c(r,y),c(r,b),c(b,j),c(r,N),c(r,k),c(k,w),c(r,P),c(r,S),c(S,R),c(R,Y),c(S,I),c(S,C),c(C,T),c(S,F),c(S,$),c($,L),c(S,z),c(S,B),c(B,q),c(r,E),W=!0},p(e,n){t=n,W&&!e.filteredProjects||D===(D=t.project.event.name)||g(i,D),W&&!e.filteredProjects||J===(J=t.project.event.manager)||g(_,J),W&&!e.filteredProjects||Q===(Q=t.project.invoice.number||"")||g(j,Q),W&&!e.filteredProjects||U===(U=t.project.event.date)||g(w,U),W&&!e.boolSym&&!e.filteredProjects||X===(X=t.boolSym(t.project.checks.ready_for_offer))||g(Y,X),W&&!e.filteredProjects||O===(O=t.project.errors.ready_for_offer)||(R.title=O),W&&!e.boolSym&&!e.filteredProjects||Z===(Z=t.boolSym(t.project.checks.ready_for_invoice))||g(T,Z),W&&!e.filteredProjects||M===(M=t.project.errors.ready_for_invoice)||(C.title=M),W&&!e.boolSym&&!e.filteredProjects||ee===(ee=t.boolSym(t.project.checks.ready_for_archive))||g(L,ee),W&&!e.filteredProjects||A===(A=t.project.errors.ready_for_archive)||($.title=A),W&&!e.boolSym&&!e.filteredProjects||te===(te=t.boolSym(t.project.checks.payed_by_customer))||g(q,te),r._svelte.ctx=t},i(t,n){W||(e.root._intro&&(G&&G.invalidate(),e.root._aftercreate.push(()=>{G||(G=x(e,r,H,{},!0)),G.run(1)})),this.m(t,n))},o(t){W&&(G||(G=x(e,r,H,{},!1)),G.run(0,()=>{t(),G=null}),W=!1)},d(e){e&&u(r),v(r,"click",V),e&&G&&G.abort()}}}function U(e){T(this,e),this._state=o({boolSym:W,search:""},e.data),this._recompute({search:1,projects:1},this._state),this._intro=!!e.intro,this._fragment=function(e,t){var r,n,o,a,i,h,y,b,j,x,N,w,P,S,R=t.filteredProjects.length,Y=!1;function O(){Y=!0,e.set({search:h.value}),Y=!1}for(var I=t.search&&J(e),C=t.filteredProjects,T=[],M=0;M<C.length;M+=1)T[M]=Q(e,D(t,C,M));function F(e,t,r){T[e]&&T[e].o(()=>{t&&(T[e].d(t),T[e]=null),r&&r()})}return{c(){r=p("div"),n=p("div"),o=p("span"),a=f(R),i=f("\n    "),h=p("input"),y=f("\n    "),b=p("div"),I&&I.c(),j=f("\n\n"),x=p("div"),N=p("div"),w=p("table"),P=p("tbody");for(var e=0;e<T.length;e+=1)T[e].c();o.className="input-group-text",o.id="inputGroup-sizing-sm",n.className="input-group-prepend",m(h,"input",O),h.placeholder="filter",_(h,"type","text"),h.className="form-control",_(h,"aria-label","Sizing example input"),_(h,"aria-describedby","inputGroup-sizing-sm"),b.className="input-group-prepend",r.className="input-group mb-3",w.id="project-list",w.className="table table-striped table-sm",N.className="table-responsive",x.id="projects",x.className="container-fluid svelte-ccexqv"},m(e,s){l(e,r,s),c(r,n),c(n,o),c(o,a),c(r,i),c(r,h),h.value=t.search,c(r,y),c(r,b),I&&I.m(b,null),l(e,j,s),l(e,x,s),c(x,N),c(N,w),c(w,P);for(var u=0;u<T.length;u+=1)T[u].i(P,null);S=!0},p(t,r){if(S&&!t.filteredProjects||R===(R=r.filteredProjects.length)||g(a,R),!Y&&t.search&&(h.value=r.search),r.search?I||((I=J(e)).c(),I.m(b,null)):I&&(I.d(1),I=null),t.filteredProjects||t.boolSym){C=r.filteredProjects;for(var n=0;n<C.length;n+=1){const o=D(r,C,n);T[n]?T[n].p(t,o):(T[n]=Q(e,o),T[n].c()),T[n].i(P,null)}for(k();n<T.length;n+=1)F(n,1)}},i(e,t){S||this.m(e,t)},o(e){if(!S)return;const t=s(e,(T=T.filter(Boolean)).length);for(let e=0;e<T.length;e+=1)F(e,0,t);S=!1},d(e){e&&u(r),v(h,"input",O),I&&I.d(),e&&(u(j),u(x)),d(T,e)}}}(this,this._state),e.target&&(this._fragment.c(),this._mount(e.target,e.anchor),I(this)),this._intro=!0}o(U.prototype,B),o(U.prototype,K),U.prototype._recompute=function(e,t){(e.search||e.projects)&&this._differs(t.filteredProjects,t.filteredProjects=function({search:e,projects:t}){e=e.toLowerCase();const r=t=>t&&t.toLowerCase().includes(e);return t.filter(([,t])=>{const{event:{name:n,manager:o},client:{full_name:a},invoice:{number_long:s,number:i}}=t;return 0===e.length||[n,o,a,s,i].some(r)})}(t))&&(e.filteredProjects=!0)},U.prototype._differs=Y;var X=U;r(2);function Z(e,t,r){const n=Object.create(e);return n.gross_sum=t[r].gross_sum,n.tax_sum=t[r].tax_sum,n.tax_value=t[r].tax_value,n.each1_value=t,n.each_index=r,n}function ee(e,t,r){const n=Object.create(e);return n.name=t[r].name,n.price=t[r].price,n.amount=t[r].amount,n.cost=t[r].cost,n.price=t[r].price,n.tax=t[r].tax,n.each0_value=t,n.index=r,n}function te(e,t){var r,n,o,a=t.date&&re(e,t);return{c(){r=p("h3"),n=f(t.name),o=f(" "),a&&a.c(),r.className="card-title"},m(e,t){l(e,r,t),c(r,n),c(r,o),a&&a.m(r,null)},p(t,o){t.name&&g(n,o.name),o.date?a?a.p(t,o):((a=re(e,o)).c(),a.m(r,null)):a&&(a.d(1),a=null)},d(e){e&&u(r),a&&a.d()}}}function re(e,t){var r,n;return{c(){r=p("small"),n=f(t.date)},m(e,t){l(e,r,t),c(r,n)},p(e,t){e.date&&g(n,t.date)},d(e){e&&u(r)}}}function ne(e,t){var r;return{c(){r=f("−")},m(e,t){l(e,r,t)},p:n,d(e){e&&u(r)}}}function oe(e,t){var r;return{c(){r=f(t.id)},m(e,t){l(e,r,t)},p(e,t){e.id&&g(r,t.id)},d(e){e&&u(r)}}}function ae(e,t){var r,n,o,a,s,i,d,h,m,v,_,y,b,j,x,N,k,w=t.index+1,P=t.name,S=t.amount,R=t.price,Y=t.cost;return{c(){r=p("tr"),n=p("td"),o=f(w),a=f("\n                "),s=p("td"),i=f(P),h=f("\n                "),m=p("td"),v=f(S),_=f("x"),y=f("\n                "),b=p("td"),j=f(R),x=f("\n                "),N=p("td"),k=f(Y),n.className="number svelte-w0m8ky",s.className="checkbox",s.dataset.toggle="tooltip",s.dataset.placement="bottom",s.title=d=100*t.tax+"%",m.className="number svelte-w0m8ky",b.className="cost svelte-w0m8ky",N.className="cost svelte-w0m8ky"},m(e,t){l(e,r,t),c(r,n),c(n,o),c(r,a),c(r,s),c(s,i),c(r,h),c(r,m),c(m,v),c(m,_),c(r,y),c(r,b),c(b,j),c(r,x),c(r,N),c(N,k)},p(e,t){e.bill&&P!==(P=t.name)&&g(i,P),e.bill&&d!==(d=100*t.tax+"%")&&(s.title=d),e.bill&&S!==(S=t.amount)&&g(v,S),e.bill&&R!==(R=t.price)&&g(j,R),e.bill&&Y!==(Y=t.cost)&&g(k,Y)},d(e){e&&u(r)}}}function se(e,t){var r,n,o,a,s,i,d,h,m,v,_,y,b,j=t.desc.gross_total,x=t.tax_value,N=t.tax_sum;return{c(){r=p("tr"),n=p("td"),o=f("\n                "),a=p("td"),s=f(j),i=f("\n            "),d=p("tr"),h=p("td"),m=f(x),v=f("%"),_=f("\n                "),y=p("td"),b=f(N),n.className="number svelte-w0m8ky",n.colSpan="4",a.className="number svelte-w0m8ky",a.colSpan="1",h.className="tax svelte-w0m8ky",h.colSpan="4",y.className="number svelte-w0m8ky",y.colSpan="1"},m(e,t){l(e,r,t),c(r,n),c(r,o),c(r,a),c(a,s),l(e,i,t),l(e,d,t),c(d,h),c(h,m),c(h,v),c(d,_),c(d,y),c(y,b)},p(e,t){e.desc&&j!==(j=t.desc.gross_total)&&g(s,j),e.desc&&x!==(x=t.tax_value)&&g(m,x),e.desc&&N!==(N=t.tax_sum)&&g(b,N)},d(e){e&&(u(r),u(i),u(d))}}}function ie(e,t){var r,n=t.tax_value>0&&se(0,t);return{c(){n&&n.c(),r=h()},m(e,t){n&&n.m(e,t),l(e,r,t)},p(e,t){t.tax_value>0?n?n.p(e,t):((n=se(0,t)).c(),n.m(r.parentNode,r)):n&&(n.d(1),n=null)},d(e){n&&n.d(e),e&&u(r)}}}function ce(e){T(this,e),this._state=o({},e.data),this._intro=!!e.intro,this._fragment=function(e,t){var r,n,o,a,s,h,m,v,_,y,b,j,x,N,k,w,P,S,R,Y=t.desc.net_total,O=t.name&&te(e,t);function I(e){return e.id?oe:ne}for(var C=I(t),T=C(e,t),M=t.bill,F=[],$=0;$<M.length;$+=1)F[$]=ae(0,ee(t,M,$));var L=t.desc.sums,A=[];for($=0;$<L.length;$+=1)A[$]=ie(0,Z(t,L,$));return{c(){r=p("div"),n=p("div"),O&&O.c(),o=f("\n\n        "),a=p("div"),s=f("Nummer: "),T.c(),h=f("\n\n        "),m=p("table"),(v=p("thead")).innerHTML='<tr><th class="number"></th>\n\t\t\t                <th>Produkt</th>\n\t\t\t                <th class="number">Anzahl</th>\n\t\t\t                <th class="cost">Einzelpreis</th>\n\t\t\t                <th class="cost">Kosten</th></tr>',_=f("\n            "),y=p("tbody");for(var e=0;e<F.length;e+=1)F[e].c();for(b=f("\n\n            "),j=p("tfoot"),e=0;e<A.length;e+=1)A[e].c();x=f("\n            "),N=p("tr"),k=p("td"),w=f("\n                "),P=p("td"),S=f(Y),a.className="card-text",v.className="thead-light",k.className="number svelte-w0m8ky",k.colSpan="4",P.className="total svelte-w0m8ky",j.className="table-borderless table-sm",m.className="table table-light table-responsive",n.className="card-body",r.className="card"},m(e,t){l(e,r,t),c(r,n),O&&O.m(n,null),c(n,o),c(n,a),c(a,s),T.m(a,null),c(n,h),c(n,m),c(m,v),c(m,_),c(m,y);for(var i=0;i<F.length;i+=1)F[i].m(y,null);for(c(m,b),c(m,j),i=0;i<A.length;i+=1)A[i].m(j,null);c(j,x),c(j,N),c(N,k),c(N,w),c(N,P),c(P,S),R=!0},p(t,r){if(r.name?O?O.p(t,r):((O=te(e,r)).c(),O.m(n,o)):O&&(O.d(1),O=null),C===(C=I(r))&&T?T.p(t,r):(T.d(1),(T=C(e,r)).c(),T.m(a,null)),t.bill){M=r.bill;for(var s=0;s<M.length;s+=1){const e=ee(r,M,s);F[s]?F[s].p(t,e):(F[s]=ae(0,e),F[s].c(),F[s].m(y,null))}for(;s<F.length;s+=1)F[s].d(1);F.length=M.length}if(t.desc){for(L=r.desc.sums,s=0;s<L.length;s+=1){const e=Z(r,L,s);A[s]?A[s].p(t,e):(A[s]=ie(0,e),A[s].c(),A[s].m(j,x))}for(;s<A.length;s+=1)A[s].d(1);A.length=L.length}t.desc&&Y!==(Y=r.desc.net_total)&&g(S,Y)},i(e,t){R||this.m(e,t)},o:i,d(e){e&&u(r),O&&O.d(),T.d(),d(F,e),d(A,e)}}}(this,this._state),e.target&&(this._fragment.c(),this._mount(e.target,e.anchor)),this._intro=!0}o(ce.prototype,B),ce.prototype._differs=Y;var le=ce,ue=(r(3),{closeView(){this.destroy()}});function de(e,t,r){const n=Object.create(e);return n.error=t[r],n.each1_value=t,n.error_index=r,n}function pe(e,t,r){const n=Object.create(e);return n.error=t[r],n.each0_value=t,n.error_index_1=r,n}function fe(e,t){var r;return{c(){(r=p("small")).textContent="🚫 Abgesagt"},m(e,t){l(e,r,t)},d(e){e&&u(r)}}}function he(e,t){var r,n,o,a,s,i,d=t.project.client.email;return{c(){r=f("(\n                            "),n=p("a"),o=f("✉️ "),a=f(d),i=f(")"),n.href=s="mailto:"+t.project.client.email+" "},m(e,t){l(e,r,t),l(e,n,t),c(n,o),c(n,a),l(e,i,t)},p(e,t){e.project&&d!==(d=t.project.client.email)&&g(a,d),e.project&&s!==(s="mailto:"+t.project.client.email+" ")&&(n.href=s)},d(e){e&&(u(r),u(n),u(i))}}}function me(e,t){var r,n,o=t.project.invoice.official;return{c(){r=p("strong"),n=f(o)},m(e,t){l(e,r,t),c(r,n)},p(e,t){e.project&&o!==(o=t.project.invoice.official)&&g(n,o)},d(e){e&&u(r)}}}function ve(e,t){var r,n,o,a=t.error;return{c(){r=p("li"),n=f("❌ "),o=f(a)},m(e,t){l(e,r,t),c(r,n),c(r,o)},p(e,t){e.project&&a!==(a=t.error)&&g(o,a)},d(e){e&&u(r)}}}function _e(e,t){var r,n,o,a=t.error;return{c(){r=p("li"),n=f("❌ "),o=f(a)},m(e,t){l(e,r,t),c(r,n),c(r,o)},p(e,t){e.project&&a!==(a=t.error)&&g(o,a)},d(e){e&&u(r)}}}function ge(e){T(this,e),this._state=o({},e.data),this._intro=!!e.intro,this._fragment=function(e,t){var r,n,o,a,i,h,y,b,j,N,k,w,P,S,R,Y,O,I,C,T,M,F,$,L,A,z,B,q,H,W,K,V,D,J,Q,U,X,Z,ee,te=t.project.event.name,re=t.project.client.full_name,ne=t.project.client.address,oe=t.project.event.manager;function ae(t){e.fire("close")}for(var se=t.project.checks.canceled&&fe(),ie=t.project.client.email&&he(0,t),ce=t.project.invoice.official&&me(0,t),ue=t.project.errors.ready_for_invoice,ge=[],ye=0;ye<ue.length;ye+=1)ge[ye]=ve(0,pe(t,ue,ye));var be=t.project.errors.ready_for_archive,je=[];for(ye=0;ye<be.length;ye+=1)je[ye]=_e(0,de(t,be,ye));var xe={name:"Angebot",id:t.project.offer.number,date:t.project.offer.date,bill:t.project.bills.offer,desc:t.project.offer},Ne=new le({root:e.root,store:e.store,data:xe}),ke={name:"Rechnung",id:t.project.invoice.number_long,date:t.project.invoice.date,bill:t.project.bills.invoice,desc:t.project.invoice},we=new le({root:e.root,store:e.store,data:ke});return{c(){r=p("hr"),n=f("\n\n"),o=p("div"),a=p("div"),(i=p("button")).innerHTML='<span aria-hidden="true">×</span>',h=f("\n\n        "),y=p("h2"),se&&se.c(),b=f("\n            "),j=f(te),N=f("\n\n        "),k=p("div"),w=p("div"),P=p("div"),S=p("span"),R=p("address"),Y=f(re),O=f(" "),ie&&ie.c(),I=f("\n                            "),C=p("pre"),T=f(ne),M=f(" "),ce&&ce.c(),F=f("\n                "),$=p("div"),L=f(oe),A=f("\n                    "),z=p("ul");for(var e=0;e<ge.length;e+=1)ge[e].c();for(B=f("\n\n                    "),q=p("ul"),e=0;e<je.length;e+=1)je[e].c();W=f("\n\n        "),K=p("div"),V=p("div"),D=p("div"),Ne._fragment.c(),Q=f("\n                "),U=p("div"),we._fragment.c(),m(i,"click",ae),i.type="button",i.className="close svelte-19yxhpk",_(i,"aria-label","Close"),y.className="card-title",R.className="container",S.id="flex",S.className="svelte-19yxhpk",P.className="col-9",z.className="list-inline",q.className="list-inline",$.className="col-3",w.className="row",k.className="container",D.className="col",U.className="col",V.className="row",K.className="container",a.className="card-body",o.className="card"},m(e,t){l(e,r,t),l(e,n,t),l(e,o,t),c(o,a),c(a,i),c(a,h),c(a,y),se&&se.m(y,null),c(y,b),c(y,j),c(a,N),c(a,k),c(k,w),c(w,P),c(P,S),c(S,R),c(R,Y),c(R,O),ie&&ie.m(R,null),c(R,I),c(R,C),c(C,T),c(R,M),ce&&ce.m(R,null),c(w,F),c(w,$),c($,L),c($,A),c($,z);for(var s=0;s<ge.length;s+=1)ge[s].m(z,null);for(c($,B),c($,q),s=0;s<je.length;s+=1)je[s].m(q,null);c(a,W),c(a,K),c(K,V),c(V,D),Ne._mount(D,null),c(V,Q),c(V,U),we._mount(U,null),ee=!0},p(e,t){if(t.project.checks.canceled?se||((se=fe()).c(),se.m(y,b)):se&&(se.d(1),se=null),ee&&!e.project||te===(te=t.project.event.name)||g(j,te),ee&&!e.project||re===(re=t.project.client.full_name)||g(Y,re),t.project.client.email?ie?ie.p(e,t):((ie=he(0,t)).c(),ie.m(R,I)):ie&&(ie.d(1),ie=null),ee&&!e.project||ne===(ne=t.project.client.address)||g(T,ne),t.project.invoice.official?ce?ce.p(e,t):((ce=me(0,t)).c(),ce.m(R,null)):ce&&(ce.d(1),ce=null),ee&&!e.project||oe===(oe=t.project.event.manager)||g(L,oe),e.project){ue=t.project.errors.ready_for_invoice;for(var r=0;r<ue.length;r+=1){const n=pe(t,ue,r);ge[r]?ge[r].p(e,n):(ge[r]=ve(0,n),ge[r].c(),ge[r].m(z,null))}for(;r<ge.length;r+=1)ge[r].d(1);ge.length=ue.length}if(e.project){for(be=t.project.errors.ready_for_archive,r=0;r<be.length;r+=1){const n=de(t,be,r);je[r]?je[r].p(e,n):(je[r]=_e(0,n),je[r].c(),je[r].m(q,null))}for(;r<je.length;r+=1)je[r].d(1);je.length=be.length}var n={};e.project&&(n.id=t.project.offer.number),e.project&&(n.date=t.project.offer.date),e.project&&(n.bill=t.project.bills.offer),e.project&&(n.desc=t.project.offer),Ne._set(n);var o={};e.project&&(o.id=t.project.invoice.number_long),e.project&&(o.date=t.project.invoice.date),e.project&&(o.bill=t.project.bills.invoice),e.project&&(o.desc=t.project.invoice),we._set(o)},i(t,r){ee||(e.root._intro&&(H&&H.invalidate(),e.root._aftercreate.push(()=>{H||(H=x(e,k,G,{},!0)),H.run(1)}),J&&J.invalidate(),e.root._aftercreate.push(()=>{J||(J=x(e,D,E,{},!0)),J.run(1)}),X&&X.invalidate(),e.root._aftercreate.push(()=>{X||(X=x(e,U,E,{},!0)),X.run(1)}),Z&&Z.invalidate(),e.root._aftercreate.push(()=>{Z||(Z=x(e,K,G,{},!0)),Z.run(1)})),this.m(t,r))},o(t){ee&&(t=s(t,6),H||(H=x(e,k,G,{},!1)),H.run(0,()=>{t(),H=null}),Ne&&Ne._fragment.o(t),J||(J=x(e,D,E,{},!1)),J.run(0,()=>{t(),J=null}),we&&we._fragment.o(t),X||(X=x(e,U,E,{},!1)),X.run(0,()=>{t(),X=null}),Z||(Z=x(e,K,G,{},!1)),Z.run(0,()=>{t(),Z=null}),ee=!1)},d(e){e&&(u(r),u(n),u(o)),v(i,"click",ae),se&&se.d(),ie&&ie.d(),ce&&ce.d(),d(ge,e),d(je,e),e&&H&&H.abort(),Ne.destroy(),e&&J&&J.abort(),we.destroy(),e&&(X&&X.abort(),Z&&Z.abort())}}}(this,this._state),e.target&&(this._fragment.c(),this._mount(e.target,e.anchor),I(this)),this._intro=!0}o(ge.prototype,B),o(ge.prototype,ue),ge.prototype._differs=Y;var ye=ge;function be(e){const{component:t,ctx:r}=this._svelte;t.fire("select",{year:r.year})}function je(e){const{component:t,ctx:r}=this._svelte;t.fire("select",{year:r.year})}function xe(e,t,r){const n=Object.create(e);return n.year=t[r],n.each_value=t,n.year_index=r,n}function Ne(e,t){var r,n,o,a=t.year;return{c(){r=p("button"),n=f(a),o=f(" "),r._svelte={component:e,ctx:t},m(r,"click",be),r.type="button",r.className="btn btn-light"},m(e,t){l(e,r,t),c(r,n),c(r,o)},p(e,o){t=o,e.yearsReversed&&a!==(a=t.year)&&g(n,a),r._svelte.ctx=t},d(e){e&&u(r),v(r,"click",be)}}}function ke(e,t){var r,n,o,a=t.year;return{c(){r=p("button"),n=f(a),o=f(" "),r._svelte={component:e,ctx:t},m(r,"click",je),r.type="button",r.className="btn btn-secondary"},m(e,t){l(e,r,t),c(r,n),c(r,o)},p(e,o){t=o,e.yearsReversed&&a!==(a=t.year)&&g(n,a),r._svelte.ctx=t},d(e){e&&u(r),v(r,"click",je)}}}function we(e,t){var r;function n(e){return e.selectedYear==e.year?ke:Ne}var o=n(t),a=o(e,t);return{c(){a.c(),r=h()},m(e,t){a.m(e,t),l(e,r,t)},p(t,s){o===(o=n(s))&&a?a.p(t,s):(a.d(1),(a=o(e,s)).c(),a.m(r.parentNode,r))},d(e){a.d(e),e&&u(r)}}}function Pe(e){T(this,e),this._state=o({},e.data),this._recompute({years:1},this._state),this._intro=!!e.intro,this._fragment=function(e,t){for(var r,n,o=t.yearsReversed,a=[],s=0;s<o.length;s+=1)a[s]=we(e,xe(t,o,s));return{c(){r=p("div");for(var e=0;e<a.length;e+=1)a[e].c();r.className="btn-group",_(r,"role","group"),_(r,"aria-label","Basic example")},m(e,t){l(e,r,t);for(var o=0;o<a.length;o+=1)a[o].m(r,null);n=!0},p(t,n){if(t.selectedYear||t.yearsReversed){o=n.yearsReversed;for(var s=0;s<o.length;s+=1){const i=xe(n,o,s);a[s]?a[s].p(t,i):(a[s]=we(e,i),a[s].c(),a[s].m(r,null))}for(;s<a.length;s+=1)a[s].d(1);a.length=o.length}},i(e,t){n||this.m(e,t)},o:i,d(e){e&&u(r),d(a,e)}}}(this,this._state),e.target&&(this._fragment.c(),this._mount(e.target,e.anchor)),this._intro=!0}o(Pe.prototype,B),Pe.prototype._recompute=function(e,t){e.years&&this._differs(t.yearsReversed,t.yearsReversed=function({years:e}){return e.reverse()}(t))&&(e.yearsReversed=!0)},Pe.prototype._differs=Y;var Se=Pe;const Re=([,{extras:{sort_index:e}}],[,{extras:{sort_index:t}}])=>e>t,Ye=e=>e.json(),Oe=e=>Object.entries(e).sort(Re),Ie=()=>fetch("http://localhost:8000/api/full_projects/workingdir").then(Ye).then(Oe);r(4);var Ce={async selectYear(e){"working"===e?(this.set({selectedYear:e}),this.set({projects:await Ie()})):(this.set({selectedYear:e}),this.set({projects:await(e=>fetch(`http://localhost:8000/api/full_projects/year/${e}`).then(Ye).then(Oe))(e)}))},selectProject(e){this.set({selectedProject:e})},unselectProject(){this.set({selectedProject:null})}};function Te(e){}function Me(e,t){var r,n,o,a,s,i,d,h,m,v,_,y=t.versionInfo.version,b=t.versionInfo.built,j=t.versionInfo.commit,x=t.versionInfo.profile;return{c(){r=p("header"),n=p("small"),o=p("pre"),a=f("v"),s=f(y),i=f(" built "),d=f(b),h=f(" "),m=f(j),v=f(" --"),_=f(x),r.className="nav justify-content-end"},m(e,t){l(e,r,t),c(r,n),c(n,o),c(o,a),c(o,s),c(o,i),c(o,d),c(o,h),c(o,m),c(o,v),c(o,_)},p(e,t){e.versionInfo&&y!==(y=t.versionInfo.version)&&g(s,y),e.versionInfo&&b!==(b=t.versionInfo.built)&&g(d,b),e.versionInfo&&j!==(j=t.versionInfo.commit)&&g(m,j),e.versionInfo&&x!==(x=t.versionInfo.profile)&&g(_,x)},d(e){e&&u(r)}}}function Fe(e,t){var r,n,o={project:t.selectedProject},a=new ye({root:e.root,store:e.store,data:o});return a.on("close",function(t){e.unselectProject()}),{c(){r=p("div"),a._fragment.c(),r.className="container"},m(e,t){l(e,r,t),a._mount(r,null),n=!0},p(e,t){var r={};e.selectedProject&&(r.project=t.selectedProject),a._set(r)},i(e,t){n||this.m(e,t)},o(e){n&&(a&&a._fragment.o(e),n=!1)},d(e){e&&u(r),a.destroy()}}}function $e(e){T(this,e),this._state=o({},e.data),this._intro=!!e.intro,this._handlers.state=[Te],Te.call(this,{changed:a({},this._state),current:this._state}),this._fragment=function(e,t){var r,n,o,a,i,d,h,m,v,_,g=t.versionInfo&&Me(0,t),y={years:t.years,selectedYear:t.selectedYear},b=new Se({root:e.root,store:e.store,data:y});b.on("select",function(t){e.selectYear(t.year)});var j={projects:t.projects,selectedYear:t.selectedYear},x=new X({root:e.root,store:e.store,data:j});x.on("select",function(t){e.selectProject(t.project)});var N=t.selectedProject&&Fe(e,t);return{c(){g&&g.c(),r=f("\n\n"),n=p("div"),o=p("nav"),(a=p("a")).innerHTML="<strong>asciii web</strong>",i=f("\n        "),b._fragment.c(),d=f("\n\n    "),h=p("div"),m=p("div"),x._fragment.c(),v=f("\n\n    "),N&&N.c(),a.className="navbar-brand",a.href="/",o.className="navbar navbar-light bg-light",m.className="row justify-content-md-center",h.className="container-fluid",n.className="container"},m(e,t){g&&g.m(e,t),l(e,r,t),l(e,n,t),c(n,o),c(o,a),c(o,i),b._mount(o,null),c(n,d),c(n,h),c(h,m),x._mount(m,null),c(n,v),N&&N.m(n,null),_=!0},p(t,o){o.versionInfo?g?g.p(t,o):((g=Me(0,o)).c(),g.m(r.parentNode,r)):g&&(g.d(1),g=null);var a={};t.years&&(a.years=o.years),t.selectedYear&&(a.selectedYear=o.selectedYear),b._set(a);var s={};t.projects&&(s.projects=o.projects),t.selectedYear&&(s.selectedYear=o.selectedYear),x._set(s),o.selectedProject?(N?N.p(t,o):(N=Fe(e,o))&&N.c(),N.i(n,null)):N&&(k(),N.o(function(){N.d(1),N=null}))},i(e,t){_||this.m(e,t)},o(e){_&&(e=s(e,3),b&&b._fragment.o(e),x&&x._fragment.o(e),N?N.o(e):e(),_=!1)},d(e){g&&g.d(e),e&&(u(r),u(n)),b.destroy(),x.destroy(),N&&N.d()}}}(this,this._state),this.root._oncreate.push(()=>{this.fire("update",{changed:a({},this._state),current:this._state})}),e.target&&(this._fragment.c(),this._mount(e.target,e.anchor),I(this)),this._intro=!0}o($e.prototype,B),o($e.prototype,Ce),$e.prototype._differs=Y;const Le=new $e({target:document.body,data:{years:[],projects:[],selectedYear:null,selectedProject:null,versionInfo:null}});window.app=Le,fetch("http://localhost:8000/api/projects/year").then(Ye).then(e=>Le.set({years:["working"].concat(e)})),Ie().then(e=>Le.set({selectedYear:"working",projects:e})),fetch("http://localhost:8000/api/version").then(Ye).then(e=>Le.set({versionInfo:e}));t.default=Le}]);