(self.webpackChunkplugin_tester=self.webpackChunkplugin_tester||[]).push([[2260],{2260:(L,d,f)=>{f.r(d),f.d(d,{E_ALREADY_LOCKED:()=>w,E_CANCELED:()=>v,E_TIMEOUT:()=>_,Mutex:()=>x,Semaphore:()=>p,tryAcquire:()=>A,withTimeout:()=>m});const _=new Error("timeout while waiting for mutex to become available"),w=new Error("mutex already locked"),v=new Error("request for lock canceled");class p{constructor(e,t=v){this._value=e,this._cancelError=t,this._weightedQueues=[],this._weightedWaiters=[]}acquire(e=1){if(e<=0)throw new Error(`invalid weight ${e}: must be positive`);return new Promise((t,i)=>{this._weightedQueues[e-1]||(this._weightedQueues[e-1]=[]),this._weightedQueues[e-1].push({resolve:t,reject:i}),this._dispatch()})}runExclusive(e,t=1){return function(u,e,t,i){return new(t||(t=Promise))(function(r,n){function h(s){try{c(i.next(s))}catch(l){n(l)}}function a(s){try{c(i.throw(s))}catch(l){n(l)}}function c(s){s.done?r(s.value):function o(r){return r instanceof t?r:new t(function(n){n(r)})}(s.value).then(h,a)}c((i=i.apply(u,e||[])).next())})}(this,void 0,void 0,function*(){const[i,o]=yield this.acquire(t);try{return yield e(i)}finally{o()}})}waitForUnlock(e=1){if(e<=0)throw new Error(`invalid weight ${e}: must be positive`);return new Promise(t=>{this._weightedWaiters[e-1]||(this._weightedWaiters[e-1]=[]),this._weightedWaiters[e-1].push(t),this._dispatch()})}isLocked(){return this._value<=0}getValue(){return this._value}setValue(e){this._value=e,this._dispatch()}release(e=1){if(e<=0)throw new Error(`invalid weight ${e}: must be positive`);this._value+=e,this._dispatch()}cancel(){this._weightedQueues.forEach(e=>e.forEach(t=>t.reject(this._cancelError))),this._weightedQueues=[]}_dispatch(){var e;for(let t=this._value;t>0;t--){const i=null===(e=this._weightedQueues[t-1])||void 0===e?void 0:e.shift();if(!i)continue;const o=this._value,r=t;this._value-=t,t=this._value+1,i.resolve([o,this._newReleaser(r)])}this._drainUnlockWaiters()}_newReleaser(e){let t=!1;return()=>{t||(t=!0,this.release(e))}}_drainUnlockWaiters(){for(let e=this._value;e>0;e--)this._weightedWaiters[e-1]&&(this._weightedWaiters[e-1].forEach(t=>t()),this._weightedWaiters[e-1]=[])}}class x{constructor(e){this._semaphore=new p(1,e)}acquire(){return u=this,e=void 0,i=function*(){const[,e]=yield this._semaphore.acquire();return e},new((t=void 0)||(t=Promise))(function(r,n){function h(s){try{c(i.next(s))}catch(l){n(l)}}function a(s){try{c(i.throw(s))}catch(l){n(l)}}function c(s){s.done?r(s.value):function o(r){return r instanceof t?r:new t(function(n){n(r)})}(s.value).then(h,a)}c((i=i.apply(u,e||[])).next())});var u,e,t,i}runExclusive(e){return this._semaphore.runExclusive(()=>e())}isLocked(){return this._semaphore.isLocked()}waitForUnlock(){return this._semaphore.waitForUnlock()}release(){this._semaphore.isLocked()&&this._semaphore.release()}cancel(){return this._semaphore.cancel()}}var E=function(u,e,t,i){return new(t||(t=Promise))(function(r,n){function h(s){try{c(i.next(s))}catch(l){n(l)}}function a(s){try{c(i.throw(s))}catch(l){n(l)}}function c(s){s.done?r(s.value):function o(r){return r instanceof t?r:new t(function(n){n(r)})}(s.value).then(h,a)}c((i=i.apply(u,e||[])).next())})};function m(u,e,t=_){return{acquire:i=>{if(void 0!==i&&i<=0)throw new Error(`invalid weight ${i}: must be positive`);return new Promise((o,r)=>E(this,void 0,void 0,function*(){let n=!1;const h=setTimeout(()=>{n=!0,r(t)},e);try{const a=yield u.acquire(i);n?(Array.isArray(a)?a[1]:a)():(clearTimeout(h),o(a))}catch(a){n||(clearTimeout(h),r(a))}}))},runExclusive(i,o){return E(this,void 0,void 0,function*(){let r=()=>{};try{const n=yield this.acquire(o);return Array.isArray(n)?(r=n[1],yield i(n[0])):(r=n,yield i())}finally{r()}})},release(i){u.release(i)},cancel:()=>u.cancel(),waitForUnlock:i=>{if(void 0!==i&&i<=0)throw new Error(`invalid weight ${i}: must be positive`);return new Promise((o,r)=>{u.waitForUnlock(i).then(o),setTimeout(()=>r(t),e)})},isLocked:()=>u.isLocked(),getValue:()=>u.getValue(),setValue:i=>u.setValue(i)}}function A(u,e=w){return m(u,0,e)}}}]);