(self.webpackChunkplugin_tester=self.webpackChunkplugin_tester||[]).push([[4531],{4531:(se,R,f)=>{f.r(R),f.d(R,{AbstractDynamicComponent:()=>P,AbstractDynamicLoaderComponent:()=>w,AbstractPluginHandler:()=>q,AbstractReferenceComponent:()=>I,BaseDynamicEvent:()=>Q,BaseDynamicEventSource:()=>B,BeautifierPipe:()=>_,COMMAND_PROVIDER:()=>N,ComponentLoaderService:()=>v,DONT_CODE_CORE:()=>j,DONT_CODE_DOC_API_URL:()=>z,DONT_CODE_STORE_API_URL:()=>W,DynamicEventType:()=>T,DynamicInsertPoint:()=>S,EntityListManager:()=>J,EntityStoreService:()=>V,PluginBaseComponent:()=>b,PluginCommonModule:()=>E,PluginHandlerHelper:()=>O,PossibleTemplateList:()=>k,SubFieldInfo:()=>x,TemplateList:()=>G,ValueService:()=>A});var u=f(4459),r=f(549);let N=new r.InjectionToken("Inject the current command provider interface");const j=new r.InjectionToken("Dont-code core object"),W=new r.InjectionToken("DontCodeStoreApiUrl"),z=new r.InjectionToken("DontCodeStoreDocUrl");var g=f(7022),y=f(2256);class P{constructor(){this.parentPosition=null,this.subscriptions=new y.Subscription}setName(e){this.name=e}getValue(){return null!=this.form&&this.updateValueFromForm(),this.value}setValue(e){this.value=e,null!=this.form&&this.hydrateValueToForm()}setParentPosition(e){this.parentPosition=e}setForm(e){this.form=e,null!=this.form&&null!=this.name&&this.createAndRegisterFormControls()}getForm(){return this.form}createAndRegisterFormControls(){const e=new g.FormControl(null,{updateOn:"blur"});this.form.registerControl(this.name,e)}transformToFormGroupValue(e){return e}transformFromFormGroupValue(e){return e}hydrateValueToForm(){if(null!=this.name){const e=this.form.get(this.name);if(null==e)throw new Error("No form control for the name "+this.name);{const t=this.transformToFormGroupValue(this.value);e.setValue(t,{emitEvent:!1})}}}updateValueFromForm(){if(null==this.name)return!1;const e=this.form.get(this.name);if(null==e)throw new Error("No form control for the name "+this.name);return!!e.dirty&&(this.value=this.transformFromFormGroupValue(e.value),e.markAsPristine({onlySelf:!0}),!0)}static toBeautifyString(e,t){if(null==e)return null;let n="";switch(Array.isArray(e)&&(e=e[0]),typeof e){case"string":n=e;break;case"object":n=e instanceof Date?e.toLocaleDateString():JSON.stringify(e,null,2);break;case"undefined":break;default:n=e.toLocaleString()}return null!=t&&n.length>t&&(n=n.substring(0,t-3)+"..."),n}listEventSources(){return[]}selectEventSourceFor(e,t){const n=this.listEventSources();for(const i of n)if(i.type===e){if(null==t)return i;if(i.name==t)return i}return null}ngOnDestroy(){this.subscriptions.unsubscribe()}}P.\u0275fac=function(e){return new(e||P)},P.\u0275cmp=r.\u0275\u0275defineComponent({type:P,selectors:[["ng-component"]],decls:0,vars:0,template:function(e,t){},encapsulation:2});var H=f(6891);class v{constructor(e,t,n,i){this.injector=e,this.dontCodeCore=t,this.previewMgr=n,this.provider=i,this.moduleMap=new Map,this.mutex=new H.Mutex}getOrCreatePluginModuleRef(e){return this.mutex.acquire().then(t=>{try{let n=this.moduleMap.get(e);return n||(n=(0,r.createNgModule)((0,r.getNgModuleById)("dontcode-plugin/"+e),this.injector),n&&this.moduleMap.set(e,n)),n}finally{t()}})}loadPluginModule(e){return this.getOrCreatePluginModuleRef(e.class.source).then(t=>(null!=t&&this.dontCodeCore.initPlugins(),t))}insertComponentForFieldType(e,t){return this.insertComponent("creation/entities/fields/type",t,e)}insertComponent(e,t,n){let s,i=e.positionInSchema;i?(s=!0,n||(n=this.provider?.getJsonAt(e.position))):(s=!1,i=e);const l=this.previewMgr.retrieveHandlerConfig(i,n);return l?(console.debug("Importing from ",l.class.source),this.loadPluginModule(l).then(a=>{const m=a.instance.exposedPreviewHandlers().get(l.class.name);return this.createComponent(m,t,a,s?e:null)}).catch(a=>(console.error("Cannot load module because of ",a),Promise.reject("Cannot load module for source "+l.class.source+" because of "+a)))):Promise.resolve(null)}createComponent(e,t,n,i){const a=t.createComponent(e,{injector:this.injector,ngModuleRef:n}).instance;if(a.initCommandFlow){if(!i)throw new Error("Component "+a.constructor.name+" is a PreviewHandler and parent position is missing.");if(!this.provider)throw new Error("Component "+a.constructor.name+" is a PreviewHandler and CommandProviderInterface is missing.");a.initCommandFlow(this.provider,i)}return a}}v.\u0275fac=function(e){return new(e||v)(r.\u0275\u0275inject(r.Injector),r.\u0275\u0275inject(j),r.\u0275\u0275inject(u.DontCodePreviewManager),r.\u0275\u0275inject(N,8))},v.\u0275prov=r.\u0275\u0275defineInjectable({token:v,factory:v.\u0275fac,providedIn:"root"});class S{}S.\u0275fac=function(e){return new(e||S)},S.\u0275dir=r.\u0275\u0275defineDirective({type:S,selectors:[["dtcde-dynamic"]]});class w extends P{constructor(e,t,n){super(),this.loader=e,this.injector=t,this.ref=n,this.fields=new Array,this.fieldsMap=new Map,this.parentForm=null,this.componentInited=new y.ReplaySubject}defineSubField(e,t){const n=new x(e,t);this.addSubField(n)}getSubField(e){const t=this.fieldsMap.get(e);if(null!=t)return this.fields[t]}addSubField(e){const t=this.fields.push(e);return this.fieldsMap.set(e.name,t-1),t}getSubFields(){return this.fields}setForm(e){if(this.name){const t=new g.FormGroup({},{updateOn:"blur"});e.registerControl(this.name,t),super.setForm(t),this.parentForm=e}else super.setForm(e),this.parentForm=null;this.preloadSubFields()}hydrateValueToForm(){if(null==this.parentForm)super.hydrateValueToForm();else{let e=this.transformToFormGroupValue(this.value);for(const t in this.form.controls)null==this.fieldsMap.get(t)&&this.form.get(t)?.setValue(e&&e[t],{emitEvent:!1})}}updateValueFromForm(){if(null==this.parentForm)return super.updateValueFromForm();{let e=!1;for(const t in this.form.controls)if(null==this.fieldsMap.get(t)){const n=this.form.get(t);if(null!=n&&n.dirty){const i=this.transformFromFormGroupValue(n?.value);null==this.value&&(this.value={}),this.value[t]=i,e=!0,n.markAsPristine({onlySelf:!0})}}return e}}setValue(e){super.setValue(e);for(const t of this.fields)this.setSubFieldValue(t,null!=e?e[t.name]:void 0)}getValue(){let e=super.getValue();for(const t of this.fields){const n=this.getSubFieldValue(t);null!=n&&null==e&&(this.value={},e=this.value),e[t.name]!==n&&(e[t.name]=n)}return e}subFieldFullEditTemplate(e){const t="string"==typeof e?this.getSubField(e):e,n=t?.component;let i=null;if(null!=n&&(i=n.providesTemplates(t?.type).forFullEdit),null==e)throw new Error("No template for subField "+t?.name+" of component "+this.name);return i}subFieldInlineViewTemplate(e){const t="string"==typeof e?this.getSubField(e):e,n=t?.component;let i=null;if(null!=n&&(i=n.providesTemplates(t?.type).forInlineView),null==e)throw new Error("No template for subField "+t?.name+" of component "+this.name);return i}subFieldFullViewTemplate(e){const t="string"==typeof e?this.getSubField(e):e,n=t?.component;let i=null;if(null!=n&&(i=n.providesTemplates(t?.type).forFullView),null==e)throw new Error("No template for subField "+t?.name+" of component "+this.name);return i}loadSubField(e,t,n){const i="string"==typeof e?this.getSubField(e):e,s=i?.component;return null==s?this.loader.insertComponentForFieldType(t,this.dynamicInsertPoint).then(l=>null!=l?(this.prepareComponent(l,t,null!=i?i.name:null,n),l):null):Promise.resolve(s)}getSubFieldValue(e){const t="string"==typeof e?this.getSubField(e):e,n=t?.component;if(null!=n)return n.getValue();if(null!=this.form&&null!=t)return this.form.get(t.name)?.value;throw new Error("Cannot provide value for non existent subField "+e)}setSubFieldValue(e,t){const n="string"==typeof e?this.getSubField(e):e,i=n?.component;if(null!=i)i.setValue(t);else if(null!=this.form&&null!=n){const s={};let l=w.toBeautifyString(t);null==l&&(l=null),s[n.name]=l,this.form.patchValue(s,{emitEvent:!1})}}loadSubComponent(e,t,n,i){return new Promise((s,l)=>this.componentInited.subscribe({complete:()=>{s()},error:a=>{l(a)}})).then(()=>(console.debug("LoadSubComponent:"+e.position+" with type "+t,this.dynamicInsertPoint),null==this.dynamicInsertPoint?null:this.loader.insertComponent(e,this.dynamicInsertPoint,i).then(s=>null!=s?this.prepareComponent(s,t,n,i):null)))}prepareComponent(e,t,n,i){return n&&(null!=this.form&&(e.setName(n),e.setForm(this.form)),e.setValue(i)),e}applyComponentToSubField(e,t,n){let i=this.getSubField(n);return null==i?(i=new x(n,t,e),this.addSubField(i),!0):(i.component=e,!1)}ngAfterViewInit(){this.componentInited.complete(),this.preloadSubFields()}preloadSubFields(){if(null!=this.dynamicInsertPoint){let e=!1;for(const t of this.fields)null==t.component&&this.loadSubField(t.name,t.type,this.value?this.value[t.name]:void 0).then(i=>{null!=i&&this.applyComponentToSubField(i,t.type,t.name),null!=this.value&&!e&&(this.ref.detectChanges(),e=!0)})}}}w.\u0275fac=function(e){return new(e||w)(r.\u0275\u0275directiveInject(v),r.\u0275\u0275directiveInject(r.Injector),r.\u0275\u0275directiveInject(r.ChangeDetectorRef))},w.\u0275cmp=r.\u0275\u0275defineComponent({type:w,selectors:[["ng-component"]],viewQuery:function(e,t){if(1&e&&r.\u0275\u0275viewQuery(S,5,r.ViewContainerRef),2&e){let n;r.\u0275\u0275queryRefresh(n=r.\u0275\u0275loadQuery())&&(t.dynamicInsertPoint=n.first)}},features:[r.\u0275\u0275InheritDefinitionFeature],decls:0,vars:0,template:function(e,t){},encapsulation:2});class x{constructor(e,t,n){this.name=e,this.type=t,this.component=n}}var F=f(2369);class O{constructor(){this.subscriptions=new y.Subscription,this.entityPointer=null,this.provider=null,this.mutex=new H.Mutex}initCommandFlow(e,t,n){this.entityPointer=t,this.provider=e,this.changeHandler=n}decomposeJsonToMultipleChanges(e,t){if("object"==typeof t&&this.provider){let n;const i=this.provider.getSchemaManager();for(const s in t)if(t.hasOwnProperty(s)){const l=i.generateSubSchemaPointer(e,s),a=i.locateItem(l.positionInSchema);a?.isArray()&&l.isProperty?this.decomposeJsonToMultipleChanges(l,t[s]):(n=new u.Change(u.ChangeType.RESET,e.position+"/"+s,t[s],l),!a&&n.pointer&&(n.pointer.isProperty=!1),this.changeHandler&&this.changeHandler.handleChange(n))}}}initChangeListening(e){if(!this.provider||!this.entityPointer)throw new Error("Cannot listen to change before initCommandFlow is called");{let t=this.entityPointer.position;!0!==e&&(t+="/?"),this.subscriptions.add(this.provider.receiveCommands(t).pipe((0,F.map)(n=>{this.changeHandler&&this.changeHandler.handleChange(n)})).subscribe())}}applyUpdatesToArray(e,t,n,i,s,l){return this.applyUpdatesToArrayAsync(e,t,n,i,(a,m)=>Promise.resolve(s(a,m)))}applyUpdatesToArrayAsync(e,t,n,i,s,l){return this.mutex.runExclusive(()=>{try{if(!this.provider)throw new Error("Cannot apply updates before initCommandFlow is called");n.pointer||(n.pointer=this.provider.calculatePointerFor(n.position));let a=this.entityPointer?.position;null!=i&&(a=a+"/"+i);const m=n.pointer.containerPosition===a;let h=m?n.pointer.lastElement:u.DontCodeModelPointer.lastElementOf(n.pointer.containerPosition)??null,K=n.pointer.isProperty?n.pointer.lastElement:null,M=null,D=null,p=-1,d=-1;switch(null!=h&&t.has(h)&&(p=t.get(h),D=e[p],M=(0,y.of)(D)),n.beforeKey&&(d=t.get(n.beforeKey)),n.type){case u.ChangeType.ADD:case u.ChangeType.UPDATE:case u.ChangeType.RESET:if(null!=K){if(!D||D&&(!l||!l(D,K,n.value))){const c=this.provider.getJsonAt(n.pointer.containerPosition),C=this.provider.calculatePointerFor(n.pointer.containerPosition);if(C.isProperty)throw new Error("A parent of a property "+n.pointer.position+" must be an array");M=(0,y.from)(s(C,c))}}else M=(0,y.from)(s(n.pointer,n.value));break;case u.ChangeType.MOVE:-1!==p&&m&&h&&(-1!==d&&d>p&&d--,e.splice(p,1),t.forEach((c,C)=>{c>p&&t.set(C,c-1)}),t.delete(h),p=-1);break;case u.ChangeType.DELETE:-1!==p&&m&&h&&(e.splice(p,1),t.forEach((c,C)=>{c>p&&t.set(C,c-1)}),t.delete(h)),M=null}return M?(0,y.firstValueFrom)(M.pipe((0,F.map)(c=>{if(-1!==p)e[p]=c;else if(-1!==d){if(e.splice(d,0,c),t.forEach((C,oe)=>{C>=d&&t.set(oe,C+1)}),null==h)throw new Error("Cannot set targetPos "+d+" without knowing the itemId");t.set(h,d)}else{if(e.push(c),null==h)throw new Error("Cannot set targetPos "+d+" without knowing the itemId");t.set(h,t.size)}return e}),(0,F.takeLast)(1),(0,F.catchError)(c=>Promise.reject(c)))):Promise.resolve(e)}catch(a){return Promise.reject(a)}})}unsubscribe(){this.subscriptions.unsubscribe()}}class b extends w{constructor(e,t,n){super(e,t,n),this.pluginHelper=new O,this.entityPointer=null,this.provider=null}ngOnDestroy(){this.pluginHelper.unsubscribe(),super.ngOnDestroy()}updateValueOnFormChanges(){this.subscriptions.add(this.form.valueChanges.pipe((0,F.map)(e=>(console.debug("Value changed",e),this.getValue(),e))).subscribe())}initCommandFlow(e,t){this.entityPointer=t,this.provider=e,this.pluginHelper.initCommandFlow(e,t,this)}initChangeListening(e){this.pluginHelper.initChangeListening(e)}decomposeJsonToMultipleChanges(e,t){this.pluginHelper.decomposeJsonToMultipleChanges(e,t)}decodeStringField(e,t){if(e.pointer?.lastElement===t)return e.value}applyUpdatesToArray(e,t,n,i,s,l){return this.applyUpdatesToArrayAsync(e,t,n,i,(a,m)=>Promise.resolve(s(a,m)))}applyUpdatesToArrayAsync(e,t,n,i,s,l){return this.pluginHelper.applyUpdatesToArrayAsync(e,t,n,i,s,l)}updateSubFieldsWithChange(e,t){return this.applyUpdatesToArrayAsync(this.fields,this.fieldsMap,e,t,(n,i)=>this.loadSubComponent(n,i.type,i.name).then(s=>new x(i.name,i.type,s??void 0)),(n,i,s)=>i===u.DontCodeModel.APP_FIELDS_NAME_NODE&&(n.name=s,!0)).then(n=>(this.fields=n,this.rebuildForm(),n))}rebuildForm(){if(null==this.form)return;const e=new Set;for(const t in this.form.controls)e.add(t);for(const t of this.fields){let n=null;this.value&&this.value[t.name]&&(n=this.value[t.name]),e.delete(t.name),null!=t.component?t.component?.setValue(n):(n=b.toBeautifyString(n),this.form.registerControl(t.name,new g.FormControl(n,g.Validators.required)))}e.forEach(t=>{this.form.removeControl(t)})}}b.\u0275fac=function(e){return new(e||b)(r.\u0275\u0275directiveInject(v),r.\u0275\u0275directiveInject(r.Injector),r.\u0275\u0275directiveInject(r.ChangeDetectorRef))},b.\u0275cmp=r.\u0275\u0275defineComponent({type:b,selectors:[["ng-component"]],features:[r.\u0275\u0275InheritDefinitionFeature],decls:0,vars:0,template:function(e,t){},encapsulation:2});class _{transform(e,...t){return b.toBeautifyString(e,t[0])}}_.\u0275fac=function(e){return new(e||_)},_.\u0275pipe=r.\u0275\u0275definePipe({name:"beautifier",type:_,pure:!0});var L=f(6674),U=f(7863);class q{constructor(){this.subscriptions=new y.Subscription,this.pluginHelper=new O,this.entityPointer=null,this.provider=null}unsubscribe(){this.pluginHelper.unsubscribe(),this.subscriptions.unsubscribe()}initCommandFlow(e,t){this.entityPointer=t,this.provider=e,this.pluginHelper.initCommandFlow(e,t,this)}initChangeListening(){this.pluginHelper.initChangeListening()}decomposeJsonToMultipleChanges(e,t){this.pluginHelper.decomposeJsonToMultipleChanges(e,t)}applyUpdatesToArray(e,t,n,i,s,l){return this.applyUpdatesToArrayAsync(e,t,n,i,(a,m)=>Promise.resolve(s(a,m)))}applyUpdatesToArrayAsync(e,t,n,i,s,l){return this.pluginHelper.applyUpdatesToArrayAsync(e,t,n,i,s,l)}}class G{constructor(e,t,n){this.forInlineView=e,this.forFullView=t,this.forFullEdit=n}}class k{constructor(e,t,n){this.forInlineView=e,this.forFullView=t,this.forFullEdit=n}}class B{constructor(e,t,n){this.name=e,this.type=t,this.eventSource=n}}var T=(()=>{return(o=T||(T={})).VALUE_CHANGE="VALUE_CHANGE",o.SELECTION_CHANGE="SELECTION_CHANGE",T;var o})();class Q{constructor(e,t,n){this.name=e,this.type=t,this.value=n}}var $=f(3134);const X=["inlineView"],Y=["fullEditView"];function Z(o,e){if(1&o&&r.\u0275\u0275text(0),2&o){const t=r.\u0275\u0275nextContext();r.\u0275\u0275textInterpolate(t.value)}}function ee(o,e){if(1&o&&(r.\u0275\u0275elementStart(0,"div"),r.\u0275\u0275text(1),r.\u0275\u0275elementEnd()),2&o){const t=r.\u0275\u0275nextContext(4);r.\u0275\u0275advance(1),r.\u0275\u0275textInterpolate1(" ",t.value," ")}}function te(o,e){if(1&o&&r.\u0275\u0275template(0,ee,2,1,"div",7),2&o){const t=r.\u0275\u0275nextContext(3);r.\u0275\u0275property("ngIf",t.value)}}function ne(o,e){1&o&&r.\u0275\u0275text(0),2&o&&r.\u0275\u0275textInterpolate1(" ",e.$implicit," ")}function re(o,e){if(1&o){const t=r.\u0275\u0275getCurrentView();r.\u0275\u0275elementContainerStart(0,3),r.\u0275\u0275elementStart(1,"p-dropdown",4),r.\u0275\u0275listener("onChange",function(i){r.\u0275\u0275restoreView(t);const s=r.\u0275\u0275nextContext(2);return r.\u0275\u0275resetView(s.valueChanged(i))}),r.\u0275\u0275template(2,te,1,1,"ng-template",5),r.\u0275\u0275template(3,ne,1,1,"ng-template",6),r.\u0275\u0275elementEnd(),r.\u0275\u0275elementContainerEnd()}if(2&o){const t=r.\u0275\u0275nextContext(2);r.\u0275\u0275property("formGroup",t.form),r.\u0275\u0275advance(1),r.\u0275\u0275property("options",t.options)("formControlName",t.name)("filter",!0)("showClear",!0)("lazy",!0)}}function ie(o,e){if(1&o&&r.\u0275\u0275template(0,re,4,6,"ng-container",2),2&o){const t=r.\u0275\u0275nextContext();r.\u0275\u0275property("ngIf",t.form)}}class I extends P{constructor(e,t){super(),this.modelMgr=e,this.storeMgr=t,this.valueChange=new r.EventEmitter,this.targetEntitiesPos=null,this.targetEntitiesProperty=null,this.options=new Array,null==e&&(this.modelMgr=u.dtcde.getModelManager()),null==t&&(this.storeMgr=u.dtcde.getStoreManager())}canProvide(e){return new k(!0,!1,!0)}providesTemplates(e){return new G(this.inlineView,null,this.fullEditView)}setTargetEntitiesWithName(e,t){return this.targetEntitiesPos=this.modelMgr.queryModelToSingle("$.creation.entities[?(@.name=='"+e+"')]").pointer,null!=this.targetEntitiesPos&&(this.targetEntitiesProperty=t??null,this.subscriptions.add(this.possibleValues().subscribe({next:i=>{this.options=i},error:i=>{this.options=["Error",i.toString()]}})),!0)}possibleValues(){if(null==this.targetEntitiesPos)throw new Error("Missing query of target entity for class "+this.constructor.name);const e=this.storeMgr.searchEntities(this.targetEntitiesPos);if(null!=this.targetEntitiesProperty){const t=this.targetEntitiesProperty;return e.pipe((0,F.map)(n=>n.map(i=>i[t])))}return e}listEventSources(){const e=super.listEventSources();return e.push(new B("Value",T.VALUE_CHANGE,this.valueChange.asObservable())),e}valueChanged(e){this.valueChange.emit(new Q("Value",T.VALUE_CHANGE,e.value))}setValue(e){null!=e&&null!=this.options&&-1==this.options.findIndex(t=>t==e)&&null!=this.options[1]&&(e=this.options[1].toString()),super.setValue(e)}}I.\u0275fac=function(e){return new(e||I)(r.\u0275\u0275directiveInject(u.DontCodeModelManager,8),r.\u0275\u0275directiveInject(u.DontCodeStoreManager,8))},I.\u0275cmp=r.\u0275\u0275defineComponent({type:I,selectors:[["dontcode-reference"]],viewQuery:function(e,t){if(1&e&&(r.\u0275\u0275viewQuery(X,7),r.\u0275\u0275viewQuery(Y,7)),2&e){let n;r.\u0275\u0275queryRefresh(n=r.\u0275\u0275loadQuery())&&(t.inlineView=n.first),r.\u0275\u0275queryRefresh(n=r.\u0275\u0275loadQuery())&&(t.fullEditView=n.first)}},outputs:{valueChange:"valueChange"},features:[r.\u0275\u0275InheritDefinitionFeature],decls:4,vars:0,consts:[["inlineView",""],["fullEditView",""],[3,"formGroup",4,"ngIf"],[3,"formGroup"],["placeholder","Select a reference",3,"options","formControlName","filter","showClear","lazy","onChange"],["pTemplate","selectedItem"],["pTemplate","item"],[4,"ngIf"]],template:function(e,t){1&e&&(r.\u0275\u0275template(0,Z,1,1,"ng-template",null,0,r.\u0275\u0275templateRefExtractor),r.\u0275\u0275template(2,ie,1,1,"ng-template",null,1,r.\u0275\u0275templateRefExtractor))},dependencies:[U.NgIf,L.Dropdown,$.PrimeTemplate,g.NgControlStatus,g.NgControlStatusGroup,g.FormGroupDirective,g.FormControlName],changeDetection:0});class V{constructor(e){this.storeMgr=e,this.listsByPosition=new Map}retrieveListManager(e,t){let n=this.listsByPosition.get(e);return null==n&&(n=new J(e,t,this.storeMgr),this.listsByPosition.set(e,n)),n}}V.\u0275fac=function(e){return new(e||V)(r.\u0275\u0275inject(u.DontCodeStoreManager))},V.\u0275prov=r.\u0275\u0275defineInjectable({token:V,factory:V.\u0275fac,providedIn:"root"});class J{constructor(e,t,n){this.storeMgr=n,this.entities=new Array,this.position=e,this.description=t}push(e){this.entities=[...this.entities,e]}updateWithDetailedEntity(e){const t=new Array;return this.entities.forEach(n=>{n._id==e._id?(e={...e,...n},t.push(e)):t.push(n)}),this.entities=[...t],e}replace(e){let t=!1;const n=new Array;return this.entities.forEach(i=>{i._id==e._id?(n.push(e),t=!0):n.push(i)}),this.entities=[...n],t}remove(e){return null==e._id?new Promise(t=>{this.entities=this.entities.filter(n=>n!==e),t(!0)}):this.storeMgr.deleteEntity(this.position,e._id).then(t=>(t&&(this.entities=this.entities.filter(n=>n!==e)),t)).catch(t=>(console.error(t.message),!1))}reset(){this.entities.length=0}store(e){return this.storeMgr.storeEntity(this.position,e)}loadAll(){return(0,y.lastValueFrom)(this.storeMgr.searchEntities(this.position).pipe((0,F.map)(e=>{this.entities=[...e]})),{defaultValue:void 0})}loadDetailFromKey(e){return null==e?Promise.reject("Cannot load entity with null key"):this.storeMgr.loadEntity(this.position,e).then(t=>null!=t?this.updateWithDetailedEntity(t):t)}loadDetailOf(e){return this.loadDetailFromKey(e._id)}}class A{constructor(e){this.modelMgr=e}getContent(){return this.modelMgr.getContent()}resetContent(e){this.modelMgr.resetContent(e)}findAtPosition(e,t){return this.modelMgr.findAtPosition(e,t)}queryModelToArray(e,t){return this.modelMgr.queryModelToArray(e,t)}queryModelToSingle(e,t){return this.modelMgr.queryModelToSingle(e,t)}findAllPossibleTargetsOfProperty(e,t,n){return this.modelMgr.findAllPossibleTargetsOfProperty(e,t,n)}findTargetOfProperty(e,t,n){return this.modelMgr.findTargetOfProperty(e,t,n)}}A.\u0275fac=function(e){return new(e||A)(r.\u0275\u0275inject(u.DontCodeModelManager))},A.\u0275prov=r.\u0275\u0275defineInjectable({token:A,factory:A.\u0275fac,providedIn:"root"});class E{static forRoot(){return{ngModule:E,providers:[{provide:j,useValue:u.dtcde},{provide:u.DontCodeSchemaManager,useValue:u.dtcde.getSchemaManager()},{provide:u.DontCodeModelManager,useValue:u.dtcde.getModelManager()},{provide:u.DontCodePreviewManager,useValue:u.dtcde.getPreviewManager()},{provide:u.DontCodeStoreManager,useValue:u.dtcde.getStoreManager()},{provide:u.DontCodeChangeManager,useValue:u.dtcde.getChangeManager()},_]}}}E.\u0275fac=function(e){return new(e||E)},E.\u0275mod=r.\u0275\u0275defineNgModule({type:E}),E.\u0275inj=r.\u0275\u0275defineInjector({imports:[U.CommonModule,L.DropdownModule,g.ReactiveFormsModule]})}}]);