(self.webpackChunkplugin_tester=self.webpackChunkplugin_tester||[]).push([[2526],{2526:(Z,m,d)=>{d.r(m),d.d(m,{OVERLAY_VALUE_ACCESSOR:()=>u,Overlay:()=>f,OverlayModule:()=>A});var a=d(7596),c=d(7863),t=d(549),g=d(7022),v=d(3134),o=d(8409),h=d(1243);const _=["overlay"],O=["content"];function C(n,l){1&n&&t.\u0275\u0275elementContainer(0)}const E=function(n,l,e){return{showTransitionParams:n,hideTransitionParams:l,transform:e}},b=function(n){return{value:"visible",params:n}},x=function(n){return{mode:n}},D=function(n){return{$implicit:n}};function T(n,l){if(1&n){const e=t.\u0275\u0275getCurrentView();t.\u0275\u0275elementStart(0,"div",1,3),t.\u0275\u0275listener("click",function(s){t.\u0275\u0275restoreView(e);const r=t.\u0275\u0275nextContext(2);return t.\u0275\u0275resetView(r.onOverlayContentClick(s))})("@overlayContentAnimation.start",function(s){t.\u0275\u0275restoreView(e);const r=t.\u0275\u0275nextContext(2);return t.\u0275\u0275resetView(r.onOverlayContentAnimationStart(s))})("@overlayContentAnimation.done",function(s){t.\u0275\u0275restoreView(e);const r=t.\u0275\u0275nextContext(2);return t.\u0275\u0275resetView(r.onOverlayContentAnimationDone(s))}),t.\u0275\u0275projection(2),t.\u0275\u0275template(3,C,1,0,"ng-container",4),t.\u0275\u0275elementEnd()}if(2&n){const e=t.\u0275\u0275nextContext(2);t.\u0275\u0275classMap(e.contentStyleClass),t.\u0275\u0275property("ngStyle",e.contentStyle)("ngClass","p-overlay-content")("@overlayContentAnimation",t.\u0275\u0275pureFunction1(11,b,t.\u0275\u0275pureFunction3(7,E,e.showTransitionOptions,e.hideTransitionOptions,e.transformOptions[e.modal?e.overlayResponsiveDirection:"default"]))),t.\u0275\u0275advance(3),t.\u0275\u0275property("ngTemplateOutlet",e.contentTemplate)("ngTemplateOutletContext",t.\u0275\u0275pureFunction1(15,D,t.\u0275\u0275pureFunction1(13,x,e.overlayMode)))}}const w=function(n,l,e,i,s,r,p,y,I,k,H,V,j,P){return{"p-overlay p-component":!0,"p-overlay-modal p-component-overlay p-component-overlay-enter":n,"p-overlay-center":l,"p-overlay-top":e,"p-overlay-top-start":i,"p-overlay-top-end":s,"p-overlay-bottom":r,"p-overlay-bottom-start":p,"p-overlay-bottom-end":y,"p-overlay-left":I,"p-overlay-left-start":k,"p-overlay-left-end":H,"p-overlay-right":V,"p-overlay-right-start":j,"p-overlay-right-end":P}};function S(n,l){if(1&n){const e=t.\u0275\u0275getCurrentView();t.\u0275\u0275elementStart(0,"div",1,2),t.\u0275\u0275listener("click",function(s){t.\u0275\u0275restoreView(e);const r=t.\u0275\u0275nextContext();return t.\u0275\u0275resetView(r.onOverlayClick(s))}),t.\u0275\u0275template(2,T,4,17,"div",0),t.\u0275\u0275elementEnd()}if(2&n){const e=t.\u0275\u0275nextContext();t.\u0275\u0275classMap(e.styleClass),t.\u0275\u0275property("ngStyle",e.style)("ngClass",t.\u0275\u0275pureFunctionV(5,w,[e.modal,e.modal&&"center"===e.overlayResponsiveDirection,e.modal&&"top"===e.overlayResponsiveDirection,e.modal&&"top-start"===e.overlayResponsiveDirection,e.modal&&"top-end"===e.overlayResponsiveDirection,e.modal&&"bottom"===e.overlayResponsiveDirection,e.modal&&"bottom-start"===e.overlayResponsiveDirection,e.modal&&"bottom-end"===e.overlayResponsiveDirection,e.modal&&"left"===e.overlayResponsiveDirection,e.modal&&"left-start"===e.overlayResponsiveDirection,e.modal&&"left-end"===e.overlayResponsiveDirection,e.modal&&"right"===e.overlayResponsiveDirection,e.modal&&"right-start"===e.overlayResponsiveDirection,e.modal&&"right-end"===e.overlayResponsiveDirection])),t.\u0275\u0275advance(2),t.\u0275\u0275property("ngIf",e.visible)}}const R=["*"],u={provide:g.NG_VALUE_ACCESSOR,useExisting:(0,t.forwardRef)(()=>f),multi:!0},L=(0,a.animation)([(0,a.style)({transform:"{{transform}}",opacity:0}),(0,a.animate)("{{showTransitionParams}}")]),M=(0,a.animation)([(0,a.animate)("{{hideTransitionParams}}",(0,a.style)({transform:"{{transform}}",opacity:0}))]);let f=(()=>{class n{constructor(e,i,s,r,p,y){this.document=e,this.el=i,this.renderer=s,this.config=r,this.overlayService=p,this.zone=y,this.visibleChange=new t.EventEmitter,this.onBeforeShow=new t.EventEmitter,this.onShow=new t.EventEmitter,this.onBeforeHide=new t.EventEmitter,this.onHide=new t.EventEmitter,this.onAnimationStart=new t.EventEmitter,this.onAnimationDone=new t.EventEmitter,this._visible=!1,this.modalVisible=!1,this.isOverlayClicked=!1,this.isOverlayContentClicked=!1,this.transformOptions={default:"scaleY(0.8)",center:"scale(0.7)",top:"translate3d(0px, -100%, 0px)","top-start":"translate3d(0px, -100%, 0px)","top-end":"translate3d(0px, -100%, 0px)",bottom:"translate3d(0px, 100%, 0px)","bottom-start":"translate3d(0px, 100%, 0px)","bottom-end":"translate3d(0px, 100%, 0px)",left:"translate3d(-100%, 0px, 0px)","left-start":"translate3d(-100%, 0px, 0px)","left-end":"translate3d(-100%, 0px, 0px)",right:"translate3d(100%, 0px, 0px)","right-start":"translate3d(100%, 0px, 0px)","right-end":"translate3d(100%, 0px, 0px)"},this.window=this.document.defaultView}get visible(){return this._visible}set visible(e){this._visible=e,this._visible&&!this.modalVisible&&(this.modalVisible=!0)}get mode(){return this._mode||this.overlayOptions?.mode}set mode(e){this._mode=e}get style(){return h.ObjectUtils.merge(this._style,this.modal?this.overlayResponsiveOptions?.style:this.overlayOptions?.style)}set style(e){this._style=e}get styleClass(){return h.ObjectUtils.merge(this._styleClass,this.modal?this.overlayResponsiveOptions?.styleClass:this.overlayOptions?.styleClass)}set styleClass(e){this._styleClass=e}get contentStyle(){return h.ObjectUtils.merge(this._contentStyle,this.modal?this.overlayResponsiveOptions?.contentStyle:this.overlayOptions?.contentStyle)}set contentStyle(e){this._contentStyle=e}get contentStyleClass(){return h.ObjectUtils.merge(this._contentStyleClass,this.modal?this.overlayResponsiveOptions?.contentStyleClass:this.overlayOptions?.contentStyleClass)}set contentStyleClass(e){this._contentStyleClass=e}get target(){const e=this._target||this.overlayOptions?.target;return void 0===e?"@prev":e}set target(e){this._target=e}get appendTo(){return this._appendTo||this.overlayOptions?.appendTo}set appendTo(e){this._appendTo=e}get autoZIndex(){const e=this._autoZIndex||this.overlayOptions?.autoZIndex;return void 0===e||e}set autoZIndex(e){this._autoZIndex=e}get baseZIndex(){const e=this._baseZIndex||this.overlayOptions?.baseZIndex;return void 0===e?0:e}set baseZIndex(e){this._baseZIndex=e}get showTransitionOptions(){const e=this._showTransitionOptions||this.overlayOptions?.showTransitionOptions;return void 0===e?".12s cubic-bezier(0, 0, 0.2, 1)":e}set showTransitionOptions(e){this._showTransitionOptions=e}get hideTransitionOptions(){const e=this._hideTransitionOptions||this.overlayOptions?.hideTransitionOptions;return void 0===e?".1s linear":e}set hideTransitionOptions(e){this._hideTransitionOptions=e}get listener(){return this._listener||this.overlayOptions?.listener}set listener(e){this._listener=e}get responsive(){return this._responsive||this.overlayOptions?.responsive}set responsive(e){this._responsive=e}get options(){return this._options}set options(e){this._options=e}get modal(){return"modal"===this.mode||this.overlayResponsiveOptions&&this.window?.matchMedia(this.overlayResponsiveOptions.media?.replace("@media","")||`(max-width: ${this.overlayResponsiveOptions.breakpoint})`).matches}get overlayMode(){return this.mode||(this.modal?"modal":"overlay")}get overlayOptions(){return{...this.config?.overlayOptions,...this.options}}get overlayResponsiveOptions(){return{...this.overlayOptions?.responsive,...this.responsive}}get overlayResponsiveDirection(){return this.overlayResponsiveOptions?.direction||"center"}get overlayEl(){return this.overlayViewChild?.nativeElement}get contentEl(){return this.contentViewChild?.nativeElement}get targetEl(){return o.DomHandler.getTargetElement(this.target,this.el?.nativeElement)}ngAfterContentInit(){this.templates?.forEach(e=>{e.getType(),this.contentTemplate=e.template})}show(e,i=!1){this.onVisibleChange(!0),this.handleEvents("onShow",{overlay:e||this.overlayEl,target:this.targetEl,mode:this.overlayMode}),i&&o.DomHandler.focus(this.targetEl),this.modal&&o.DomHandler.addClass(this.document?.body,"p-overflow-hidden")}hide(e,i=!1){this.visible&&(this.onVisibleChange(!1),this.handleEvents("onHide",{overlay:e||this.overlayEl,target:this.targetEl,mode:this.overlayMode}),i&&o.DomHandler.focus(this.targetEl),this.modal&&o.DomHandler.removeClass(this.document?.body,"p-overflow-hidden"))}alignOverlay(){!this.modal&&o.DomHandler.alignOverlay(this.overlayEl,this.targetEl,this.appendTo)}onVisibleChange(e){this._visible=e,this.visibleChange.emit(e)}onOverlayClick(e){this.isOverlayClicked=!0}onOverlayContentClick(e){this.overlayService.add({originalEvent:e,target:this.targetEl}),this.isOverlayContentClicked=!0}onOverlayContentAnimationStart(e){switch(e.toState){case"visible":this.handleEvents("onBeforeShow",{overlay:this.overlayEl,target:this.targetEl,mode:this.overlayMode}),this.autoZIndex&&h.ZIndexUtils.set(this.overlayMode,this.overlayEl,this.baseZIndex+this.config?.zIndex[this.overlayMode]),o.DomHandler.appendOverlay(this.overlayEl,"body"===this.appendTo?this.document.body:this.appendTo,this.appendTo),this.alignOverlay();break;case"void":this.handleEvents("onBeforeHide",{overlay:this.overlayEl,target:this.targetEl,mode:this.overlayMode}),this.modal&&o.DomHandler.addClass(this.overlayEl,"p-component-overlay-leave")}this.handleEvents("onAnimationStart",e)}onOverlayContentAnimationDone(e){const i=this.overlayEl||e.element.parentElement;switch(e.toState){case"visible":this.show(i,!0),this.bindListeners();break;case"void":this.hide(i,!0),this.unbindListeners(),o.DomHandler.appendOverlay(this.overlayEl,this.targetEl,this.appendTo),h.ZIndexUtils.clear(i),this.modalVisible=!1}this.handleEvents("onAnimationDone",e)}handleEvents(e,i){this[e].emit(i),this.options&&this.options[e]&&this.options[e](i),this.config?.overlayOptions&&this.config?.overlayOptions[e]&&this.config?.overlayOptions[e](i)}bindListeners(){this.bindScrollListener(),this.bindDocumentClickListener(),this.bindDocumentResizeListener(),this.bindDocumentKeyboardListener()}unbindListeners(){this.unbindScrollListener(),this.unbindDocumentClickListener(),this.unbindDocumentResizeListener(),this.unbindDocumentKeyboardListener()}bindScrollListener(){this.scrollHandler||(this.scrollHandler=new o.ConnectedOverlayScrollHandler(this.targetEl,e=>{(!this.listener||this.listener(e,{type:"scroll",mode:this.overlayMode,valid:!0}))&&this.hide(e,!0)})),this.scrollHandler.bindScrollListener()}unbindScrollListener(){this.scrollHandler&&this.scrollHandler.unbindScrollListener()}bindDocumentClickListener(){this.documentClickListener||(this.documentClickListener=this.renderer.listen(this.document,"click",e=>{const s=!(this.targetEl&&(this.targetEl.isSameNode(e.target)||!this.isOverlayClicked&&this.targetEl.contains(e.target))||this.isOverlayContentClicked);(this.listener?this.listener(e,{type:"outside",mode:this.overlayMode,valid:3!==e.which&&s}):s)&&this.hide(e),this.isOverlayClicked=this.isOverlayContentClicked=!1}))}unbindDocumentClickListener(){this.documentClickListener&&(this.documentClickListener(),this.documentClickListener=null)}bindDocumentResizeListener(){this.documentResizeListener||(this.documentResizeListener=this.renderer.listen(this.window,"resize",e=>{(this.listener?this.listener(e,{type:"resize",mode:this.overlayMode,valid:!o.DomHandler.isTouchDevice()}):!o.DomHandler.isTouchDevice())&&this.hide(e,!0)}))}unbindDocumentResizeListener(){this.documentResizeListener&&(this.documentResizeListener(),this.documentResizeListener=null)}bindDocumentKeyboardListener(){this.documentKeyboardListener||this.zone.runOutsideAngular(()=>{this.documentKeyboardListener=this.renderer.listen(this.window,"keydown",e=>{this.overlayOptions.hideOnEscape&&27===e.keyCode&&(this.listener?this.listener(e,{type:"keydown",mode:this.overlayMode,valid:!o.DomHandler.isTouchDevice()}):!o.DomHandler.isTouchDevice())&&this.zone.run(()=>{this.hide(e,!0)})})})}unbindDocumentKeyboardListener(){this.documentKeyboardListener&&(this.documentKeyboardListener(),this.documentKeyboardListener=null)}ngOnDestroy(){this.hide(this.overlayEl,!0),this.overlayEl&&(o.DomHandler.appendOverlay(this.overlayEl,this.targetEl,this.appendTo),h.ZIndexUtils.clear(this.overlayEl)),this.scrollHandler&&(this.scrollHandler.destroy(),this.scrollHandler=null),this.unbindListeners()}}return n.\u0275fac=function(e){return new(e||n)(t.\u0275\u0275directiveInject(c.DOCUMENT),t.\u0275\u0275directiveInject(t.ElementRef),t.\u0275\u0275directiveInject(t.Renderer2),t.\u0275\u0275directiveInject(v.PrimeNGConfig),t.\u0275\u0275directiveInject(v.OverlayService),t.\u0275\u0275directiveInject(t.NgZone))},n.\u0275cmp=t.\u0275\u0275defineComponent({type:n,selectors:[["p-overlay"]],contentQueries:function(e,i,s){if(1&e&&t.\u0275\u0275contentQuery(s,v.PrimeTemplate,4),2&e){let r;t.\u0275\u0275queryRefresh(r=t.\u0275\u0275loadQuery())&&(i.templates=r)}},viewQuery:function(e,i){if(1&e&&(t.\u0275\u0275viewQuery(_,5),t.\u0275\u0275viewQuery(O,5)),2&e){let s;t.\u0275\u0275queryRefresh(s=t.\u0275\u0275loadQuery())&&(i.overlayViewChild=s.first),t.\u0275\u0275queryRefresh(s=t.\u0275\u0275loadQuery())&&(i.contentViewChild=s.first)}},hostAttrs:[1,"p-element"],inputs:{visible:"visible",mode:"mode",style:"style",styleClass:"styleClass",contentStyle:"contentStyle",contentStyleClass:"contentStyleClass",target:"target",appendTo:"appendTo",autoZIndex:"autoZIndex",baseZIndex:"baseZIndex",showTransitionOptions:"showTransitionOptions",hideTransitionOptions:"hideTransitionOptions",listener:"listener",responsive:"responsive",options:"options"},outputs:{visibleChange:"visibleChange",onBeforeShow:"onBeforeShow",onShow:"onShow",onBeforeHide:"onBeforeHide",onHide:"onHide",onAnimationStart:"onAnimationStart",onAnimationDone:"onAnimationDone"},features:[t.\u0275\u0275ProvidersFeature([u])],ngContentSelectors:R,decls:1,vars:1,consts:[[3,"ngStyle","class","ngClass","click",4,"ngIf"],[3,"ngStyle","ngClass","click"],["overlay",""],["content",""],[4,"ngTemplateOutlet","ngTemplateOutletContext"]],template:function(e,i){1&e&&(t.\u0275\u0275projectionDef(),t.\u0275\u0275template(0,S,3,20,"div",0)),2&e&&t.\u0275\u0275property("ngIf",i.modalVisible)},dependencies:[c.NgClass,c.NgIf,c.NgTemplateOutlet,c.NgStyle],styles:[".p-overlay{position:absolute;top:0;left:0}.p-overlay-modal{display:flex;align-items:center;justify-content:center;position:fixed;top:0;left:0;width:100%;height:100%}.p-overlay-content{transform-origin:inherit}.p-overlay-modal>.p-overlay-content{z-index:1;width:90%}.p-overlay-top{align-items:flex-start}.p-overlay-top-start{align-items:flex-start;justify-content:flex-start}.p-overlay-top-end{align-items:flex-start;justify-content:flex-end}.p-overlay-bottom{align-items:flex-end}.p-overlay-bottom-start{align-items:flex-end;justify-content:flex-start}.p-overlay-bottom-end{align-items:flex-end;justify-content:flex-end}.p-overlay-left{justify-content:flex-start}.p-overlay-left-start{justify-content:flex-start;align-items:flex-start}.p-overlay-left-end{justify-content:flex-start;align-items:flex-end}.p-overlay-right{justify-content:flex-end}.p-overlay-right-start{justify-content:flex-end;align-items:flex-start}.p-overlay-right-end{justify-content:flex-end;align-items:flex-end}\n"],encapsulation:2,data:{animation:[(0,a.trigger)("overlayContentAnimation",[(0,a.transition)(":enter",[(0,a.useAnimation)(L)]),(0,a.transition)(":leave",[(0,a.useAnimation)(M)])])]},changeDetection:0}),n})(),A=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275mod=t.\u0275\u0275defineNgModule({type:n}),n.\u0275inj=t.\u0275\u0275defineInjector({imports:[c.CommonModule,v.SharedModule,v.SharedModule]}),n})()}}]);