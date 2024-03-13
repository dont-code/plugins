(self.webpackChunkplugin_tester=self.webpackChunkplugin_tester||[]).push([[5360,5861],{65360:(K,V,d)=>{d.r(V),d.d(V,{AbstractDynamicComponent:()=>E,AbstractDynamicLoaderComponent:()=>D,AbstractPluginHandler:()=>z,AbstractReferenceComponent:()=>re,BaseDynamicEvent:()=>Q,BaseDynamicEventSource:()=>B,BeautifierPipe:()=>L,CHANNEL_CHANGE_NAME:()=>le,COMMAND_PROVIDER:()=>T,CommonConfigService:()=>ue,CommonTestManager:()=>ce,ComponentLoaderService:()=>C,DONT_CODE_COMMON_CONFIG:()=>_,DONT_CODE_CORE:()=>b,DynamicEventType:()=>S,DynamicInsertPoint:()=>v,EntityListManager:()=>J,EntityStoreService:()=>oe,PluginBaseComponent:()=>R,PluginCommonModule:()=>W,PluginCommonTestModule:()=>M,PluginHandlerHelper:()=>x,PossibleTemplateList:()=>k,SANDBOX_MENUS:()=>ae,SubFieldInfo:()=>N,TemplateList:()=>U,ValueService:()=>se});var u=d(26282),o=d(30549);let T=new o.InjectionToken("Inject the current command provider interface");const b=new o.InjectionToken("Dont-code core object"),_=new o.InjectionToken("DontCodeCommonLibConfig");var f=d(27022),h=d(92256);let E=(()=>{class s{constructor(){this.parentPosition=null,this.subscriptions=new h.Subscription}setName(e){this.name=e}getValue(){return null!=this.form&&this.updateValueFromForm(),this.value}setValue(e){this.value=e,null!=this.form&&this.hydrateValueToForm()}setParentPosition(e){this.parentPosition=e}setForm(e){this.form=e,null!=this.form&&null!=this.name&&this.createAndRegisterFormControls()}getForm(){return this.form}createAndRegisterFormControls(){const e=new f.FormControl(null,{updateOn:"blur"});this.form.registerControl(this.name,e)}transformToFormGroupValue(e){return e}transformFromFormGroupValue(e){return e}hydrateValueToForm(){if(null!=this.name){const e=this.form.get(this.name);if(null==e)throw new Error("No form control for the name "+this.name);{const t=this.transformToFormGroupValue(this.value);e.setValue(t,{emitEvent:!1})}}}updateValueFromForm(){if(null==this.name)return!1;const e=this.form.get(this.name);if(null==e)throw new Error("No form control for the name "+this.name);return!!e.dirty&&(this.value=this.transformFromFormGroupValue(e.value),e.markAsPristine({onlySelf:!0}),!0)}static toBeautifyString(e,t){if(null==e)return null;let n="";switch(Array.isArray(e)&&(e=e[0]),typeof e){case"string":n=e;break;case"object":n=e instanceof Date?e.toLocaleDateString():JSON.stringify(e,null,2);break;case"undefined":break;default:n=e.toLocaleString()}return null!=t&&n.length>t&&(n=n.substring(0,t-3)+"..."),n}listEventSources(){return[]}selectEventSourceFor(e,t){const n=this.listEventSources();for(const r of n)if(r.type===e){if(null==t)return r;if(r.name==t)return r}return null}ngOnDestroy(){this.subscriptions.unsubscribe()}static#e=this.\u0275fac=function(t){return new(t||s)};static#t=this.\u0275cmp=o.\u0275\u0275defineComponent({type:s,selectors:[["ng-component"]],decls:0,vars:0,template:function(t,n){},encapsulation:2})}return s})();var P=d(26891);let C=(()=>{class s{constructor(e,t,n,r){this.injector=e,this.dontCodeCore=t,this.previewMgr=n,this.provider=r,this.moduleMap=new Map,this.mutex=new P.Mutex}getOrCreatePluginModuleRef(e){return this.mutex.acquire().then(t=>{try{let n=this.moduleMap.get(e);return n||(n=(0,o.createNgModule)((0,o.getNgModuleById)("dontcode-plugin/"+e),this.injector),n&&this.moduleMap.set(e,n)),n}finally{t()}})}loadPluginModule(e){return this.getOrCreatePluginModuleRef(e.class.source).then(t=>(null!=t&&this.dontCodeCore.initPlugins(),t))}insertComponentForFieldType(e,t){return this.insertComponent("creation/entities/fields/type",t,e)}insertComponent(e,t,n){let l,r=e.positionInSchema;r?(l=!0,n||(n=this.provider?.getJsonAt(e.position))):(l=!1,r=e);const a=this.previewMgr.retrieveHandlerConfig(r,n);return a?this.loadPluginModule(a).then(c=>{const p=c.instance.exposedPreviewHandlers().get(a.class.name);return this.createComponent(p,t,c,l?e:null)}).catch(c=>(console.error("Cannot load module because of ",c),Promise.reject("Cannot load module for source "+a.class.source+" because of "+c))):Promise.resolve(null)}createComponent(e,t,n,r){const c=t.createComponent(e,{injector:this.injector,ngModuleRef:n}).instance;if(c.initCommandFlow){if(!r)throw new Error("Component "+c.constructor.name+" is a PreviewHandler and parent position is missing.");if(!this.provider)throw new Error("Component "+c.constructor.name+" is a PreviewHandler and CommandProviderInterface is missing.");c.initCommandFlow(this.provider,r)}return c}registerModuleForTest(e,t){this.moduleMap.set(t,null==e.instance?(0,o.createNgModule)(e,this.injector):e)}static#e=this.\u0275fac=function(t){return new(t||s)(o.\u0275\u0275inject(o.Injector),o.\u0275\u0275inject(b),o.\u0275\u0275inject(u.DontCodePreviewManager),o.\u0275\u0275inject(T,8))};static#t=this.\u0275prov=o.\u0275\u0275defineInjectable({token:s,factory:s.\u0275fac,providedIn:"root"})}return s})(),v=(()=>{class s{static#e=this.\u0275fac=function(t){return new(t||s)};static#t=this.\u0275dir=o.\u0275\u0275defineDirective({type:s,selectors:[["dtcde-dynamic"]]})}return s})(),D=(()=>{class s extends E{constructor(e,t,n){super(),this.loader=e,this.injector=t,this.ref=n,this.fields=new Array,this.fieldsMap=new Map,this.parentForm=null,this.componentInited=new h.ReplaySubject}defineSubField(e,t){const n=new N(e,t);this.addSubField(n)}getSubField(e){const t=this.fieldsMap.get(e);if(null!=t)return this.fields[t]}addSubField(e){const t=this.fields.push(e);return this.fieldsMap.set(e.name,t-1),t}getSubFields(){return this.fields}setForm(e){if(this.name){const t=new f.FormGroup({},{updateOn:"blur"});e.registerControl(this.name,t),super.setForm(t),this.parentForm=e}else super.setForm(e),this.parentForm=null;this.preloadSubFields()}hydrateValueToForm(){if(null==this.parentForm)super.hydrateValueToForm();else{let e=this.transformToFormGroupValue(this.value);for(const t in this.form.controls)null==this.fieldsMap.get(t)&&this.form.get(t)?.setValue(e&&e[t],{emitEvent:!1})}}updateValueFromForm(){if(null==this.parentForm)return super.updateValueFromForm();{let e=!1;for(const t in this.form.controls)if(null==this.fieldsMap.get(t)){const n=this.form.get(t);if(null!=n&&n.dirty){const r=this.transformFromFormGroupValue(n?.value);null==this.value&&(this.value={}),this.value[t]=r,e=!0,n.markAsPristine({onlySelf:!0})}}return e}}setValue(e){super.setValue(e);for(const t of this.fields)this.setSubFieldValue(t,null!=e?e[t.name]:void 0)}getValue(){let e=super.getValue();for(const t of this.fields){const n=this.getSubFieldValue(t);null!=n&&null==e&&(this.value={},e=this.value),e[t.name]!==n&&(e[t.name]=n)}return e}subFieldFullEditTemplate(e){const t="string"==typeof e?this.getSubField(e):e,n=t?.component;let r=null;if(null!=n&&(r=n.providesTemplates(t?.type).forFullEdit),null==e)throw new Error("No template for subField "+t?.name+" of component "+this.name);return r}subFieldInlineViewTemplate(e){const t="string"==typeof e?this.getSubField(e):e,n=t?.component;let r=null;if(null!=n&&(r=n.providesTemplates(t?.type).forInlineView),null==e)throw new Error("No template for subField "+t?.name+" of component "+this.name);return r}subFieldFullViewTemplate(e){const t="string"==typeof e?this.getSubField(e):e,n=t?.component;let r=null;if(null!=n&&(r=n.providesTemplates(t?.type).forFullView),null==e)throw new Error("No template for subField "+t?.name+" of component "+this.name);return r}loadSubField(e,t,n){const r="string"==typeof e?this.getSubField(e):e,l=r?.component;return null==l?this.loader.insertComponentForFieldType(t,this.dynamicInsertPoint).then(a=>null!=a?(this.prepareComponent(a,t,null!=r?r.name:null,n),a):null):Promise.resolve(l)}getSubFieldValue(e){const t="string"==typeof e?this.getSubField(e):e,n=t?.component;if(null!=n)return n.getValue();if(null!=this.form&&null!=t)return this.form.get(t.name)?.value;throw new Error("Cannot provide value for non existent subField "+e)}setSubFieldValue(e,t){const n="string"==typeof e?this.getSubField(e):e,r=n?.component;if(null!=r)r.setValue(t);else if(null!=this.form&&null!=n){const l={};let a=s.toBeautifyString(t);null==a&&(a=null),l[n.name]=a,this.form.patchValue(l,{emitEvent:!1})}}loadSubComponent(e,t,n,r){return new Promise((l,a)=>this.componentInited.subscribe({complete:()=>{l()},error:c=>{a(c)}})).then(()=>null==this.dynamicInsertPoint?null:this.loader.insertComponent(e,this.dynamicInsertPoint,r).then(l=>null!=l?this.prepareComponent(l,t,n,r):null))}prepareComponent(e,t,n,r){return n&&(null!=this.form&&(e.setName(n),e.setForm(this.form)),e.setValue(r)),e}applyComponentToSubField(e,t,n){let r=this.getSubField(n);return null==r?(r=new N(n,t,e),this.addSubField(r),!0):(r.component=e,!1)}ngAfterViewInit(){this.componentInited.complete(),this.preloadSubFields()}preloadSubFields(){if(null!=this.dynamicInsertPoint){let e=!1;for(const t of this.fields)null==t.component&&this.loadSubField(t.name,t.type,this.value?this.value[t.name]:void 0).then(r=>{null!=r&&this.applyComponentToSubField(r,t.type,t.name),null!=this.value&&!e&&(this.ref.detectChanges(),e=!0)})}}static#e=this.\u0275fac=function(t){return new(t||s)(o.\u0275\u0275directiveInject(C),o.\u0275\u0275directiveInject(o.Injector),o.\u0275\u0275directiveInject(o.ChangeDetectorRef))};static#t=this.\u0275cmp=o.\u0275\u0275defineComponent({type:s,selectors:[["ng-component"]],viewQuery:function(t,n){if(1&t&&o.\u0275\u0275viewQuery(v,5,o.ViewContainerRef),2&t){let r;o.\u0275\u0275queryRefresh(r=o.\u0275\u0275loadQuery())&&(n.dynamicInsertPoint=r.first)}},features:[o.\u0275\u0275InheritDefinitionFeature],decls:0,vars:0,template:function(t,n){},encapsulation:2})}return s})();class N{constructor(i,e,t){this.name=i,this.type=e,this.component=t}}var H=d(15861),F=d(2369);class x{constructor(){this.subscriptions=new h.Subscription,this.entityPointer=null,this.provider=null,this.changeHandler=null,this.actionPerformer=null,this.mutex=new P.Mutex}initCommandFlow(i,e,t,n){this.entityPointer=e,this.provider=i,this.changeHandler=t,null!=n?this.actionPerformer=n:null!=t.performAction&&(this.actionPerformer=t)}decomposeJsonToMultipleChanges(i,e){if("object"==typeof e&&this.provider){let t;const n=this.provider.getSchemaManager();for(const r in e)if(e.hasOwnProperty(r)){const l=n.generateSubSchemaPointer(i,r),a=n.locateItem(l.positionInSchema);a?.isArray()&&l.isProperty?this.decomposeJsonToMultipleChanges(l,e[r]):(t=new u.Change(u.ChangeType.RESET,i.position+"/"+r,e[r],l),!a&&t.pointer&&(t.pointer.isProperty=!1),null!=this.changeHandler&&this.changeHandler.handleChange(t))}}}initChangeListening(i){this.initOtherChangeListening(i,this.entityPointer)}initOtherChangeListening(i,e){if(!this.provider||!e)throw new Error("Cannot listen to change before initCommandFlow is called");{let t=e.position;!0!==i&&(t+="/?"),this.subscriptions.add(this.provider.receiveCommands(t).pipe((0,F.map)(n=>{null!=n.actionType?this.actionPerformer&&n.running?.next(this.actionPerformer.performAction(n)):this.changeHandler&&this.changeHandler.handleChange(n)})).subscribe())}}applyUpdatesToArray(i,e,t,n,r,l){return this.applyUpdatesToArrayAsync(i,e,t,n,(a,c)=>Promise.resolve(r(a,c)))}applyUpdatesToArrayAsync(i,e,t,n,r,l,a){return this.mutex.runExclusive(()=>{try{if(!this.provider)throw new Error("Cannot apply updates before initCommandFlow is called");t.pointer||(t.pointer=this.provider.calculatePointerFor(t.position)),l=l??this.entityPointer?.position,null!=n&&(l=l+"/"+n);const c=t.pointer.containerPosition===l;let p=c?t.pointer.lastElement:u.DontCodeModelPointer.lastElementOf(t.pointer.containerPosition)??null,j=t.pointer.isProperty?t.pointer.lastElement:null,A=null,I=null,g=-1,y=-1;switch(null!=p&&e.has(p)&&(g=e.get(p),I=i[g],A=(0,h.of)(I)),t.beforeKey&&(y=e.get(t.beforeKey)),t.type){case u.ChangeType.ADD:case u.ChangeType.UPDATE:case u.ChangeType.RESET:if(null!=j){if(!I||I&&(!a||!a(I,j,t.value))){const m=this.provider.getJsonAt(t.pointer.containerPosition),w=this.provider.calculatePointerFor(t.pointer.containerPosition);if(w.isProperty)throw new Error("A parent of a property "+t.pointer.position+" must be an array");A=(0,h.from)(r(w,m))}}else A=(0,h.from)(r(t.pointer,t.value));break;case u.ChangeType.MOVE:-1!==g&&c&&p&&(-1!==y&&y>g&&y--,i.splice(g,1),e.forEach((m,w)=>{m>g&&e.set(w,m-1)}),e.delete(p),g=-1);break;case u.ChangeType.DELETE:-1!==g&&c&&p&&(i.splice(g,1),e.forEach((m,w)=>{m>g&&e.set(w,m-1)}),e.delete(p)),A=null}return A?(0,h.firstValueFrom)(A.pipe((0,F.map)(m=>{if(-1!==g)i[g]=m;else if(-1!==y){if(i.splice(y,0,m),e.forEach((w,he)=>{w>=y&&e.set(he,w+1)}),null==p)throw new Error("Cannot set targetPos "+y+" without knowing the itemId");e.set(p,y)}else{if(i.push(m),null==p)throw new Error("Cannot set targetPos "+y+" without knowing the itemId");e.set(p,e.size)}return i}),(0,F.takeLast)(1),(0,F.catchError)(m=>Promise.reject(m)))):Promise.resolve(i)}catch(c){return Promise.reject(c)}})}unsubscribe(){this.subscriptions.unsubscribe()}performAction(i){var e=this;return(0,H.Z)(function*(){if(null==e.provider)return Promise.reject("No provider for the component at position "+e.entityPointer?.position);yield e.provider.sendCommand(i)})()}}let R=(()=>{class s extends D{constructor(e,t,n){super(e,t,n),this.pluginHelper=new x,this.entityPointer=null,this.provider=null}ngOnDestroy(){this.pluginHelper.unsubscribe(),super.ngOnDestroy()}updateValueOnFormChanges(){this.subscriptions.add(this.form.valueChanges.pipe((0,F.map)(e=>(this.getValue(),e))).subscribe())}initCommandFlow(e,t){this.entityPointer=t,this.provider=e,this.pluginHelper.initCommandFlow(e,t,this)}initChangeListening(e){this.pluginHelper.initChangeListening(e)}decomposeJsonToMultipleChanges(e,t){this.pluginHelper.decomposeJsonToMultipleChanges(e,t)}decodeStringField(e,t){if(e.pointer?.lastElement===t)return e.value}applyUpdatesToArray(e,t,n,r,l,a,c){return this.applyUpdatesToArrayAsync(e,t,n,r,(p,j)=>Promise.resolve(l(p,j)),a)}applyUpdatesToArrayAsync(e,t,n,r,l,a,c){return this.pluginHelper.applyUpdatesToArrayAsync(e,t,n,r,l,a,c)}updateSubFieldsWithChange(e,t,n){return this.applyUpdatesToArrayAsync(this.fields,this.fieldsMap,e,t,(r,l)=>this.loadSubComponent(r,l.type,l.name).then(a=>new N(l.name,l.type,a??void 0)),n,(r,l,a)=>l===u.DontCodeModel.APP_FIELDS_NAME_NODE&&(r.name=a,!0)).then(r=>(this.fields=r,this.rebuildForm(),r))}rebuildForm(){if(null==this.form)return;const e=new Set;for(const t in this.form.controls)e.add(t);for(const t of this.fields){let n=null;this.value&&this.value[t.name]&&(n=this.value[t.name]),e.delete(t.name),null!=t.component?t.component?.setValue(n):(n=s.toBeautifyString(n),this.form.registerControl(t.name,new f.FormControl(n,f.Validators.required)))}e.forEach(t=>{this.form.removeControl(t)})}static#e=this.\u0275fac=function(t){return new(t||s)(o.\u0275\u0275directiveInject(C),o.\u0275\u0275directiveInject(o.Injector),o.\u0275\u0275directiveInject(o.ChangeDetectorRef))};static#t=this.\u0275cmp=o.\u0275\u0275defineComponent({type:s,selectors:[["ng-component"]],features:[o.\u0275\u0275InheritDefinitionFeature],decls:0,vars:0,template:function(t,n){},encapsulation:2})}return s})(),L=(()=>{class s{transform(e,...t){return R.toBeautifyString(e,t[0])}static#e=this.\u0275fac=function(t){return new(t||s)};static#t=this.\u0275pipe=o.\u0275\u0275definePipe({name:"beautifier",type:s,pure:!0})}return s})();var G=d(46674),O=d(57863);class z{constructor(){this.subscriptions=new h.Subscription,this.pluginHelper=new x,this.entityPointer=null,this.provider=null}unsubscribe(){this.pluginHelper.unsubscribe(),this.subscriptions.unsubscribe()}initCommandFlow(i,e){this.entityPointer=e,this.provider=i,this.pluginHelper.initCommandFlow(i,e,this)}initChangeListening(){this.pluginHelper.initChangeListening()}decomposeJsonToMultipleChanges(i,e){this.pluginHelper.decomposeJsonToMultipleChanges(i,e)}applyUpdatesToArray(i,e,t,n,r,l){return this.applyUpdatesToArrayAsync(i,e,t,n,(a,c)=>Promise.resolve(r(a,c)))}applyUpdatesToArrayAsync(i,e,t,n,r,l,a){return this.pluginHelper.applyUpdatesToArrayAsync(i,e,t,n,r,l,a)}performAction(i){return Promise.resolve(void 0)}}class U{constructor(i,e,t){this.forInlineView=i,this.forFullView=e,this.forFullEdit=t}}class k{constructor(i,e,t){this.forInlineView=i,this.forFullView=e,this.forFullEdit=t}}class B{constructor(i,e,t){this.name=i,this.type=e,this.eventSource=t}}var S=(()=>{return(s=S||(S={})).VALUE_CHANGE="VALUE_CHANGE",s.SELECTION_CHANGE="SELECTION_CHANGE",S;var s})();class Q{constructor(i,e,t){this.name=i,this.type=e,this.value=t}}var Z=d(3134);const $=["inlineView"],X=["fullEditView"];function q(s,i){if(1&s&&o.\u0275\u0275text(0),2&s){const e=o.\u0275\u0275nextContext();o.\u0275\u0275textInterpolate(e.value)}}function Y(s,i){if(1&s&&(o.\u0275\u0275elementStart(0,"div"),o.\u0275\u0275text(1),o.\u0275\u0275elementEnd()),2&s){const e=o.\u0275\u0275nextContext(4);o.\u0275\u0275advance(1),o.\u0275\u0275textInterpolate1(" ",e.value," ")}}function ee(s,i){if(1&s&&o.\u0275\u0275template(0,Y,2,1,"div",7),2&s){const e=o.\u0275\u0275nextContext(3);o.\u0275\u0275property("ngIf",e.value)}}function te(s,i){1&s&&o.\u0275\u0275text(0),2&s&&o.\u0275\u0275textInterpolate1(" ",i.$implicit," ")}function ne(s,i){if(1&s){const e=o.\u0275\u0275getCurrentView();o.\u0275\u0275elementContainerStart(0,3),o.\u0275\u0275elementStart(1,"p-dropdown",4),o.\u0275\u0275listener("onChange",function(n){o.\u0275\u0275restoreView(e);const r=o.\u0275\u0275nextContext(2);return o.\u0275\u0275resetView(r.valueChanged(n))}),o.\u0275\u0275template(2,ee,1,1,"ng-template",5),o.\u0275\u0275template(3,te,1,1,"ng-template",6),o.\u0275\u0275elementEnd(),o.\u0275\u0275elementContainerEnd()}if(2&s){const e=o.\u0275\u0275nextContext(2);o.\u0275\u0275property("formGroup",e.form),o.\u0275\u0275advance(1),o.\u0275\u0275property("options",e.options)("formControlName",e.name)("filter",!0)("showClear",!0)("lazy",!0)}}function ie(s,i){if(1&s&&o.\u0275\u0275template(0,ne,4,6,"ng-container",2),2&s){const e=o.\u0275\u0275nextContext();o.\u0275\u0275property("ngIf",e.form)}}let re=(()=>{class s extends E{constructor(e,t){super(),this.modelMgr=e,this.storeMgr=t,this.valueChange=new o.EventEmitter,this.targetEntitiesPos=null,this.targetEntitiesProperty=null,this.options=new Array,null==e&&(this.modelMgr=u.dtcde.getModelManager()),null==t&&(this.storeMgr=u.dtcde.getStoreManager())}canProvide(e){return new k(!0,!1,!0)}providesTemplates(e){return new U(this.inlineView,null,this.fullEditView)}setTargetEntitiesWithName(e,t){const n=this.modelMgr.queryModelToSingle("$.creation.entities[?(@.name=='"+e+"')]");if(null==n)throw console.error("Cannot find an entity with name "+e+" in the model."),new Error("Cannot find an entity with name "+e+" in the model.");return this.targetEntitiesPos=n.pointer,null==this.targetEntitiesPos?Promise.resolve(!1):(this.targetEntitiesProperty=t??null,(0,h.firstValueFrom)(this.possibleValues()).then(r=>(this.options=r,!0)))}possibleValues(){if(null==this.targetEntitiesPos)throw new Error("Missing query of target entity for class "+this.constructor.name);const e=this.storeMgr.searchEntities(this.targetEntitiesPos);if(null!=this.targetEntitiesProperty){const t=this.targetEntitiesProperty;return e.pipe((0,F.map)(n=>n.map(r=>r[t])))}return e}listEventSources(){const e=super.listEventSources();return e.push(new B("Value",S.VALUE_CHANGE,this.valueChange.asObservable())),e}valueChanged(e){this.valueChange.emit(new Q("Value",S.VALUE_CHANGE,e.value))}setValue(e){null!=e&&null!=this.options&&-1==this.options.findIndex(t=>t==e)&&null!=this.options[1]&&(e=this.options[1].toString()),super.setValue(e)}static#e=this.\u0275fac=function(t){return new(t||s)(o.\u0275\u0275directiveInject(u.DontCodeModelManager,8),o.\u0275\u0275directiveInject(u.DontCodeStoreManager,8))};static#t=this.\u0275cmp=o.\u0275\u0275defineComponent({type:s,selectors:[["dontcode-reference"]],viewQuery:function(t,n){if(1&t&&(o.\u0275\u0275viewQuery($,7),o.\u0275\u0275viewQuery(X,7)),2&t){let r;o.\u0275\u0275queryRefresh(r=o.\u0275\u0275loadQuery())&&(n.inlineView=r.first),o.\u0275\u0275queryRefresh(r=o.\u0275\u0275loadQuery())&&(n.fullEditView=r.first)}},outputs:{valueChange:"valueChange"},features:[o.\u0275\u0275InheritDefinitionFeature],decls:4,vars:0,consts:[["inlineView",""],["fullEditView",""],[3,"formGroup",4,"ngIf"],[3,"formGroup"],["placeholder","Select a reference",3,"options","formControlName","filter","showClear","lazy","onChange"],["pTemplate","selectedItem"],["pTemplate","item"],[4,"ngIf"]],template:function(t,n){1&t&&(o.\u0275\u0275template(0,q,1,1,"ng-template",null,0,o.\u0275\u0275templateRefExtractor),o.\u0275\u0275template(2,ie,1,1,"ng-template",null,1,o.\u0275\u0275templateRefExtractor))},dependencies:[O.NgIf,G.Dropdown,Z.PrimeTemplate,f.NgControlStatus,f.NgControlStatusGroup,f.FormGroupDirective,f.FormControlName],changeDetection:0})}return s})(),oe=(()=>{class s{constructor(e,t){this.storeMgr=e,this.modelMgr=t,this.listsByPosition=new Map}retrieveListManager(e,t){let n=this.listsByPosition.get(e.position);return null==n&&(n=new J(e,t,this.storeMgr,this.modelMgr),this.listsByPosition.set(e.position,n)),n}static#e=this.\u0275fac=function(t){return new(t||s)(o.\u0275\u0275inject(u.DontCodeStoreManager),o.\u0275\u0275inject(u.DontCodeModelManager))};static#t=this.\u0275prov=o.\u0275\u0275defineInjectable({token:s,factory:s.\u0275fac,providedIn:"root"})}return s})();class J{constructor(i,e,t,n){this.storeMgr=t,this.modelMgr=n,this.entities=null,this.prepared=null,this.pointer=i,this.description=e}push(i){this.entities=null==this.entities?new Array(i):[...this.entities,i]}updateWithDetailedEntity(i){const e=i._id,t=new Array;return null!=this.entities?(this.entities.forEach(n=>{n._id==e?(i={...i,...n},t.push(i)):t.push(n)}),this.entities=[...t]):this.entities=[i],i}replace(i){if(null==this.entities)return!1;const e=i._id;let t=!1;const n=new Array;return this.entities.forEach(r=>{r._id==e?(n.push(i),t=!0):n.push(r)}),this.entities=[...n],t}remove(i){if(null==this.entities)return Promise.resolve(!1);const e=i._id;return null==e?new Promise(t=>{null!=this.entities?(this.entities=this.entities.filter(n=>n!==i),this.prepared=null,t(!0)):t(!1)}):this.storeMgr.deleteEntity(this.pointer.position,e).then(t=>(t&&null!=this.entities&&(this.entities=this.entities.filter(n=>n!==i),this.prepared=null),t)).catch(t=>(console.error(t.message),!1))}reset(){null!=this.entities&&(this.entities.length=0),this.prepared=null}store(i){return this.prepared=null,this.storeMgr.storeEntity(this.pointer.position,i)}storeAllChanged(){var i=this;return(0,H.Z)(function*(){if(null!=i.entities){i.prepared=null;for(const e of i.entities)yield i.storeMgr.storeEntity(i.pointer.position,e)}})()}loadAll(){return(0,h.firstValueFrom)(this.storeMgr.searchEntities(this.pointer.position).pipe((0,F.map)(i=>{this.prepared=null,this.entities=[...i]})),{defaultValue:void 0})}searchAndPrepareEntities(i,e,t,...n){let r=null!=i?Object.values(i):[];const l=r.length>0?r[0]:void 0;r=null!=e?Object.values(e):[];const a=r.length>0?new u.DontCodeStoreGroupby(r[0].of,r[0].display,r[0].show):void 0;if(null!=this.entities){this.prepared=null;let p,c=this.entities;return null!=n&&(c=u.StoreProviderHelper.applyFilters(c,...n)),null!=t&&(c=t.postLoadingTransformation(c)),null!=l&&(c=u.StoreProviderHelper.multiSortArray(c,l)),null!=a&&(p=u.StoreProviderHelper.calculateGroupedByValues(c,a,this.modelMgr,this.pointer)),(null!=n||null!=i||null!=e)&&(this.prepared=new u.DontCodeStorePreparedEntities(c,l,p)),this.entities=c,Promise.resolve()}return(0,h.firstValueFrom)(this.storeMgr.searchAndPrepareEntities(this.pointer.position,l,a,t,...n).pipe((0,F.map)(c=>{this.prepared=c,this.entities=this.prepared.sortedData})))}loadDetailFromKey(i){return null==i?Promise.reject("Cannot load entity with null key"):this.storeMgr.loadEntity(this.pointer.position,i).then(e=>null!=e?this.updateWithDetailedEntity(e):e)}loadDetailOf(i){return this.loadDetailFromKey(i._id)}}let se=(()=>{class s{constructor(e){this.modelMgr=e}getContent(){return this.modelMgr.getContent()}resetContent(e){this.modelMgr.resetContent(e)}findAtPosition(e,t){return this.modelMgr.findAtPosition(e,t)}queryModelToArray(e,t){return this.modelMgr.queryModelToArray(e,t)}queryModelToSingle(e,t){return this.modelMgr.queryModelToSingle(e,t)}findAllPossibleTargetsOfProperty(e,t,n){return this.modelMgr.findAllPossibleTargetsOfProperty(e,t,n)}findTargetOfProperty(e,t,n){return this.modelMgr.findTargetOfProperty(e,t,n)}static#e=this.\u0275fac=function(t){return new(t||s)(o.\u0275\u0275inject(u.DontCodeModelManager))};static#t=this.\u0275prov=o.\u0275\u0275defineInjectable({token:s,factory:s.\u0275fac,providedIn:"root"})}return s})();const le="preview-ui-changes",ae=new o.InjectionToken("Allows addition of menus");let ue=(()=>{class s{constructor(e){this.updates=new h.ReplaySubject(1),this.config=e,null==this.config&&(this.config={})}getConfig(){return this.config}getUpdates(){return this.updates}updateConfig(e,t){this.config[e]=t,this.updates.next(this.config)}batchUpdateConfig(e){this.config=Object.assign(this.config,e),this.updates.next(this.config)}static#e=this.\u0275fac=function(t){return new(t||s)(o.\u0275\u0275inject(_,8))};static#t=this.\u0275prov=o.\u0275\u0275defineInjectable({token:s,factory:s.\u0275fac,providedIn:"root"})}return s})(),W=(()=>{class s{static forRoot(){return{ngModule:s,providers:[{provide:b,useValue:u.dtcde},{provide:u.DontCodeSchemaManager,useValue:u.dtcde.getSchemaManager()},{provide:u.DontCodeModelManager,useValue:u.dtcde.getModelManager()},{provide:u.DontCodePreviewManager,useValue:u.dtcde.getPreviewManager()},{provide:u.DontCodeStoreManager,useValue:u.dtcde.getStoreManager()},{provide:u.DontCodeChangeManager,useValue:u.dtcde.getChangeManager()},L]}}static#e=this.\u0275fac=function(t){return new(t||s)};static#t=this.\u0275mod=o.\u0275\u0275defineNgModule({type:s});static#n=this.\u0275inj=o.\u0275\u0275defineInjector({imports:[O.CommonModule,G.DropdownModule,f.ReactiveFormsModule]})}return s})();class ce{static registerComponentForType(i,e,t){u.dtcde.registerPlugin(new pe({forType:i,name:e})),M.previewHandlers.set(e,t)}}class pe{constructor(i){this.testComponents=null,this.CONFIG={plugin:{id:"CommonTestManagerPlugin",version:"1.0"},"schema-updates":[{id:"test-component",description:"Test Component added",changes:[{location:{parent:"#/$defs/field",id:"type"},update:{enum:[{Test:{enum:[]}}]},replace:!1}]}],"preview-handlers":[]},this.PREVIEW_HANDLER_CONFIG={location:{parent:u.DontCodeModel.APP_FIELDS,id:"type",values:[{Test:{enum:[]}}]},class:{source:"common-test-module",name:"name"}},this.testComponents=i}getConfiguration(){if(null!=this.testComponents){const i=structuredClone(this.CONFIG),e=structuredClone(this.PREVIEW_HANDLER_CONFIG);if(null!=i["schema-updates"]&&null!=i["preview-handlers"])return i["schema-updates"][0].id=this.testComponents.name,i["schema-updates"][0].changes[0].update.enum[0].Test.enum.push(this.testComponents.forType),e.class.name=this.testComponents.name,e.location.values[0].Test.enum.push(this.testComponents.forType),i["preview-handlers"].push(e),i}throw new Error("No testComponent to register")}pluginInit(i){}}class M{static#e=this.previewHandlers=new Map;exposedPreviewHandlers(){return M.previewHandlers}static#t=this.\u0275fac=function(e){return new(e||M)};static#n=this.\u0275mod=o.\u0275\u0275defineNgModule({type:M,id:"dontcode-plugin/common-test-module"});static#i=this.\u0275inj=o.\u0275\u0275defineInjector({imports:[O.CommonModule,W]})}o.\u0275\u0275registerNgModuleType(M,"dontcode-plugin/common-test-module")},15861:(K,V,d)=>{function u(T,b,_,f,h,E,P){try{var C=T[E](P),v=C.value}catch(D){return void _(D)}C.done?b(v):Promise.resolve(v).then(f,h)}function o(T){return function(){var b=this,_=arguments;return new Promise(function(f,h){var E=T.apply(b,_);function P(v){u(E,f,h,P,C,"next",v)}function C(v){u(E,f,h,P,C,"throw",v)}P(void 0)})}}d.d(V,{Z:()=>o})}}]);