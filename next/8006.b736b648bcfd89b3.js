(self.webpackChunkplugin_tester=self.webpackChunkplugin_tester||[]).push([[8006],{48006:(se,C,c)=>{c.r(C),c.d(C,{CountryComponent:()=>g,CurrencyComponent:()=>_,EuroDollarComponent:()=>h,FieldsModule:()=>I,MoneyComponent:()=>v,RatingComponent:()=>S});var m=c(57863),s=c(26282);class M{getConfiguration(){return{plugin:{id:"FieldsPlugin","display-name":"Dont code plugin for specific fields like country, currency",version:"1.0.0"},"schema-updates":[{id:"country-type",description:"Add Country as a type of field",changes:[{location:{parent:"#/$defs/field",id:"type"},update:{enum:[{Social:{enum:["Rating"]}}]},replace:!1}]}],"preview-handlers":[{location:{parent:s.DontCodeModel.APP_FIELDS,id:"type",values:[{Social:{enum:["Rating"]}}]},class:{name:"RatingComponent",source:"fields"}},{location:{parent:s.DontCodeModel.APP_FIELDS,id:"type",values:[{International:{enum:["Country"]}}]},class:{name:"CountryComponent",source:"fields"}},{location:{parent:s.DontCodeModel.APP_FIELDS,id:"type",values:[{International:{enum:["Currency"]}}]},class:{name:"CurrencyComponent",source:"fields"}},{location:{parent:s.DontCodeModel.APP_FIELDS,id:"type",values:[{Money:{enum:["Euro","Dollar"]}}]},class:{name:"EuroDollarComponent",source:"fields"}},{location:{parent:s.DontCodeModel.APP_FIELDS,id:"type",values:[{Money:{enum:["Other currency"]}}]},class:{name:"MoneyComponent",source:"fields"}}]}}pluginInit(r){}}var u=c(33272),p=c(71982);const T=JSON.parse('{"locale":"en","countries":{"AF":"Afghanistan","AL":"Albania","DZ":"Algeria","AS":"American Samoa","AD":"Andorra","AO":"Angola","AI":"Anguilla","AQ":"Antarctica","AG":"Antigua and Barbuda","AR":"Argentina","AM":"Armenia","AW":"Aruba","AU":"Australia","AT":"Austria","AZ":"Azerbaijan","BS":"Bahamas","BH":"Bahrain","BD":"Bangladesh","BB":"Barbados","BY":"Belarus","BE":"Belgium","BZ":"Belize","BJ":"Benin","BM":"Bermuda","BT":"Bhutan","BO":"Bolivia","BA":"Bosnia and Herzegovina","BW":"Botswana","BV":"Bouvet Island","BR":"Brazil","IO":"British Indian Ocean Territory","BN":"Brunei Darussalam","BG":"Bulgaria","BF":"Burkina Faso","BI":"Burundi","KH":"Cambodia","CM":"Cameroon","CA":"Canada","CV":"Cape Verde","KY":"Cayman Islands","CF":"Central African Republic","TD":"Chad","CL":"Chile","CN":["People\'s Republic of China","China"],"CX":"Christmas Island","CC":"Cocos (Keeling) Islands","CO":"Colombia","KM":"Comoros","CG":["Republic of the Congo","Congo"],"CD":["Democratic Republic of the Congo","Congo"],"CK":"Cook Islands","CR":"Costa Rica","CI":["Cote D\'Ivoire","Ivory Coast"],"HR":"Croatia","CU":"Cuba","CY":"Cyprus","CZ":["Czech Republic","Czechia"],"DK":"Denmark","DJ":"Djibouti","DM":"Dominica","DO":"Dominican Republic","EC":"Ecuador","EG":"Egypt","SV":"El Salvador","GQ":"Equatorial Guinea","ER":"Eritrea","EE":"Estonia","ET":"Ethiopia","FK":"Falkland Islands (Malvinas)","FO":"Faroe Islands","FJ":"Fiji","FI":"Finland","FR":"France","GF":"French Guiana","PF":"French Polynesia","TF":"French Southern Territories","GA":"Gabon","GM":["Republic of The Gambia","The Gambia","Gambia"],"GE":"Georgia","DE":"Germany","GH":"Ghana","GI":"Gibraltar","GR":"Greece","GL":"Greenland","GD":"Grenada","GP":"Guadeloupe","GU":"Guam","GT":"Guatemala","GN":"Guinea","GW":"Guinea-Bissau","GY":"Guyana","HT":"Haiti","HM":"Heard Island and McDonald Islands","VA":"Holy See (Vatican City State)","HN":"Honduras","HK":"Hong Kong","HU":"Hungary","IS":"Iceland","IN":"India","ID":"Indonesia","IR":["Islamic Republic of Iran","Iran"],"IQ":"Iraq","IE":"Ireland","IL":"Israel","IT":"Italy","JM":"Jamaica","JP":"Japan","JO":"Jordan","KZ":"Kazakhstan","KE":"Kenya","KI":"Kiribati","KP":"North Korea","KR":["South Korea","Korea, Republic of","Republic of Korea"],"KW":"Kuwait","KG":"Kyrgyzstan","LA":"Lao People\'s Democratic Republic","LV":"Latvia","LB":"Lebanon","LS":"Lesotho","LR":"Liberia","LY":"Libya","LI":"Liechtenstein","LT":"Lithuania","LU":"Luxembourg","MO":"Macao","MG":"Madagascar","MW":"Malawi","MY":"Malaysia","MV":"Maldives","ML":"Mali","MT":"Malta","MH":"Marshall Islands","MQ":"Martinique","MR":"Mauritania","MU":"Mauritius","YT":"Mayotte","MX":"Mexico","FM":"Micronesia, Federated States of","MD":"Moldova, Republic of","MC":"Monaco","MN":"Mongolia","MS":"Montserrat","MA":"Morocco","MZ":"Mozambique","MM":"Myanmar","NA":"Namibia","NR":"Nauru","NP":"Nepal","NL":"Netherlands","NC":"New Caledonia","NZ":"New Zealand","NI":"Nicaragua","NE":"Niger","NG":"Nigeria","NU":"Niue","NF":"Norfolk Island","MK":["The Republic of North Macedonia","North Macedonia"],"MP":"Northern Mariana Islands","NO":"Norway","OM":"Oman","PK":"Pakistan","PW":"Palau","PS":["State of Palestine","Palestine"],"PA":"Panama","PG":"Papua New Guinea","PY":"Paraguay","PE":"Peru","PH":"Philippines","PN":"Pitcairn","PL":"Poland","PT":"Portugal","PR":"Puerto Rico","QA":"Qatar","RE":"Reunion","RO":"Romania","RU":["Russian Federation","Russia"],"RW":"Rwanda","SH":"Saint Helena","KN":"Saint Kitts and Nevis","LC":"Saint Lucia","PM":"Saint Pierre and Miquelon","VC":"Saint Vincent and the Grenadines","WS":"Samoa","SM":"San Marino","ST":"Sao Tome and Principe","SA":"Saudi Arabia","SN":"Senegal","SC":"Seychelles","SL":"Sierra Leone","SG":"Singapore","SK":"Slovakia","SI":"Slovenia","SB":"Solomon Islands","SO":"Somalia","ZA":"South Africa","GS":"South Georgia and the South Sandwich Islands","ES":"Spain","LK":"Sri Lanka","SD":"Sudan","SR":"Suriname","SJ":"Svalbard and Jan Mayen","SZ":"Eswatini","SE":"Sweden","CH":"Switzerland","SY":"Syrian Arab Republic","TW":["Taiwan, Province of China","Taiwan"],"TJ":"Tajikistan","TZ":["United Republic of Tanzania","Tanzania"],"TH":"Thailand","TL":"Timor-Leste","TG":"Togo","TK":"Tokelau","TO":"Tonga","TT":"Trinidad and Tobago","TN":"Tunisia","TR":["T\xfcrkiye","Turkey"],"TM":"Turkmenistan","TC":"Turks and Caicos Islands","TV":"Tuvalu","UG":"Uganda","UA":"Ukraine","AE":"United Arab Emirates","GB":["United Kingdom","UK","Great Britain"],"US":["United States of America","United States","USA"],"UM":"United States Minor Outlying Islands","UY":"Uruguay","UZ":"Uzbekistan","VU":"Vanuatu","VE":"Venezuela","VN":"Vietnam","VG":"Virgin Islands, British","VI":"Virgin Islands, U.S.","WF":"Wallis and Futuna","EH":"Western Sahara","YE":"Yemen","ZM":"Zambia","ZW":"Zimbabwe","AX":"\xc5land Islands","BQ":"Bonaire, Sint Eustatius and Saba","CW":"Cura\xe7ao","GG":"Guernsey","IM":"Isle of Man","JE":"Jersey","ME":"Montenegro","BL":"Saint Barth\xe9lemy","MF":"Saint Martin (French part)","RS":"Serbia","SX":"Sint Maarten (Dutch part)","SS":"South Sudan","XK":"Kosovo"}}');var e=c(30549),i=c(27022),d=c(46674),y=c(3134);const E=["inlineView"],w=["fullEditView"];function N(n,r){if(1&n&&(e.\u0275\u0275element(0,"span",2),e.\u0275\u0275text(1)),2&n){const t=e.\u0275\u0275nextContext();e.\u0275\u0275property("ngClass","flag-icon-"+(null==t.value?null:t.value.toLowerCase())),e.\u0275\u0275advance(1),e.\u0275\u0275textInterpolate(t.value)}}function F(n,r){if(1&n&&(e.\u0275\u0275elementStart(0,"div"),e.\u0275\u0275element(1,"span",2),e.\u0275\u0275text(2),e.\u0275\u0275elementEnd()),2&n){const t=e.\u0275\u0275nextContext(3);e.\u0275\u0275advance(1),e.\u0275\u0275property("ngClass","flag-icon-"+(null==t.form.controls[t.name].value?null:t.form.controls[t.name].value.toLowerCase())),e.\u0275\u0275advance(1),e.\u0275\u0275textInterpolate1(" ",t.form.controls[t.name].value," ")}}function G(n,r){if(1&n&&e.\u0275\u0275template(0,F,3,2,"div",7),2&n){const t=e.\u0275\u0275nextContext(2);e.\u0275\u0275property("ngIf",t.form.controls[t.name].value)}}function R(n,r){if(1&n&&(e.\u0275\u0275element(0,"span",2),e.\u0275\u0275text(1)),2&n){const t=r.$implicit;e.\u0275\u0275property("ngClass","flag-icon-"+(null==t?null:t.alpha2code.toLowerCase())),e.\u0275\u0275advance(1),e.\u0275\u0275textInterpolate1(" ",t.name," ")}}function A(n,r){if(1&n&&(e.\u0275\u0275elementContainerStart(0,3),e.\u0275\u0275elementStart(1,"p-dropdown",4),e.\u0275\u0275template(2,G,1,1,"ng-template",5),e.\u0275\u0275template(3,R,2,2,"ng-template",6),e.\u0275\u0275elementEnd(),e.\u0275\u0275elementContainerEnd()),2&n){const t=e.\u0275\u0275nextContext();e.\u0275\u0275property("formGroup",t.form),e.\u0275\u0275advance(1),e.\u0275\u0275property("options",t.countries)("formControlName",t.name)("filter",!0)("showClear",!0)}}let g=(()=>{class n extends u.AbstractDynamicComponent{constructor(){super(...arguments),this.countries=new Array}ngOnInit(){p.registerLocale(T);for(const t in p.getAlpha2Codes())this.countries.push({name:p.getName(t,"en"),alpha2code:t})}providesTemplates(){return new u.TemplateList(this.inlineView,null,this.fullEditView)}canProvide(t){return new u.PossibleTemplateList(!0,!1,!0)}static#e=this.\u0275fac=function(){let t;return function(a){return(t||(t=e.\u0275\u0275getInheritedFactory(n)))(a||n)}}();static#t=this.\u0275cmp=e.\u0275\u0275defineComponent({type:n,selectors:[["dontcode-fields-country"]],viewQuery:function(o,a){if(1&o&&(e.\u0275\u0275viewQuery(E,7),e.\u0275\u0275viewQuery(w,7)),2&o){let l;e.\u0275\u0275queryRefresh(l=e.\u0275\u0275loadQuery())&&(a.inlineView=l.first),e.\u0275\u0275queryRefresh(l=e.\u0275\u0275loadQuery())&&(a.fullEditView=l.first)}},features:[e.\u0275\u0275InheritDefinitionFeature],decls:4,vars:0,consts:[["inlineView",""],["fullEditView",""],[1,"flag-icon",3,"ngClass"],[3,"formGroup"],["optionLabel","name","optionValue","alpha2code","filterBy","name","placeholder","Select a Country",3,"options","formControlName","filter","showClear"],["pTemplate","selectedItem"],["pTemplate","item"],[4,"ngIf"]],template:function(o,a){1&o&&(e.\u0275\u0275template(0,N,2,2,"ng-template",null,0,e.\u0275\u0275templateRefExtractor),e.\u0275\u0275template(2,A,4,5,"ng-template",null,1,e.\u0275\u0275templateRefExtractor))},dependencies:[m.NgClass,m.NgIf,i.NgControlStatus,i.NgControlStatusGroup,i.FormGroupDirective,i.FormControlName,d.Dropdown,y.PrimeTemplate]})}return n})();var D=c(56621),P=c.n(D);const V=["inlineView"],b=["fullEditView"];function L(n,r){if(1&n&&e.\u0275\u0275text(0),2&n){const t=e.\u0275\u0275nextContext();e.\u0275\u0275textInterpolate(t.value)}}function B(n,r){if(1&n&&(e.\u0275\u0275elementStart(0,"div"),e.\u0275\u0275text(1),e.\u0275\u0275elementEnd()),2&n){const t=e.\u0275\u0275nextContext(4);e.\u0275\u0275advance(1),e.\u0275\u0275textInterpolate1(" ",t.form.controls[t.name].value," ")}}function Q(n,r){if(1&n&&e.\u0275\u0275template(0,B,2,1,"div",7),2&n){const t=e.\u0275\u0275nextContext(3);e.\u0275\u0275property("ngIf",t.form.controls[t.name].value)}}function K(n,r){if(1&n&&e.\u0275\u0275text(0),2&n){const t=r.$implicit;e.\u0275\u0275textInterpolate2(" ",t.currency," - ",t.currencyCode," ")}}function U(n,r){if(1&n&&(e.\u0275\u0275elementContainerStart(0,3),e.\u0275\u0275elementStart(1,"p-dropdown",4),e.\u0275\u0275template(2,Q,1,1,"ng-template",5),e.\u0275\u0275template(3,K,1,2,"ng-template",6),e.\u0275\u0275elementEnd(),e.\u0275\u0275elementContainerEnd()),2&n){const t=e.\u0275\u0275nextContext(2);e.\u0275\u0275property("formGroup",t.form),e.\u0275\u0275advance(1),e.\u0275\u0275property("options",t.currencies)("formControlName",t.name)("filter",!0)("showClear",!0)}}function O(n,r){if(1&n&&e.\u0275\u0275template(0,U,4,5,"ng-container",2),2&n){const t=e.\u0275\u0275nextContext();e.\u0275\u0275property("ngIf",t.form)}}let _=(()=>{class n extends u.AbstractDynamicComponent{constructor(){super(),this.currencies=new Array;const t=new Map;P().countryCurrencyList().forEach(o=>{o.currency&&o.currency_code&&t.set(o.currency,o.currency_code)}),this.currencies=[],t.forEach((o,a)=>{this.currencies.push({currency:a,currencyCode:o})}),this.currencies=this.currencies.sort((o,a)=>o.currency.localeCompare(a.currency))}providesTemplates(){return new u.TemplateList(this.inlineView,null,this.fullEditView)}canProvide(t){return new u.PossibleTemplateList(!0,!1,!0)}static#e=this.\u0275fac=function(o){return new(o||n)};static#t=this.\u0275cmp=e.\u0275\u0275defineComponent({type:n,selectors:[["dontcode-fields-currency"]],viewQuery:function(o,a){if(1&o&&(e.\u0275\u0275viewQuery(V,7),e.\u0275\u0275viewQuery(b,7)),2&o){let l;e.\u0275\u0275queryRefresh(l=e.\u0275\u0275loadQuery())&&(a.inlineView=l.first),e.\u0275\u0275queryRefresh(l=e.\u0275\u0275loadQuery())&&(a.fullEditView=l.first)}},features:[e.\u0275\u0275InheritDefinitionFeature],decls:4,vars:0,consts:[["inlineView",""],["fullEditView",""],[3,"formGroup",4,"ngIf"],[3,"formGroup"],["optionValue","currencyCode","filterBy","currency","placeholder","Select a Currency",3,"options","formControlName","filter","showClear"],["pTemplate","selectedItem"],["pTemplate","item"],[4,"ngIf"]],template:function(o,a){1&o&&(e.\u0275\u0275template(0,L,1,1,"ng-template",null,0,e.\u0275\u0275templateRefExtractor),e.\u0275\u0275template(2,O,1,1,"ng-template",null,1,e.\u0275\u0275templateRefExtractor))},dependencies:[m.NgIf,i.NgControlStatus,i.NgControlStatusGroup,i.FormGroupDirective,i.FormControlName,d.Dropdown,y.PrimeTemplate]})}return n})();var f=c(46346);const H=["inlineView"],j=["fullEditView"];function z(n,r){if(1&n&&(e.\u0275\u0275elementStart(0,"span",3),e.\u0275\u0275text(1),e.\u0275\u0275elementEnd()),2&n){const t=e.\u0275\u0275nextContext(2);e.\u0275\u0275advance(1),e.\u0275\u0275textInterpolate(t.localizedAmount(t.value.amount))}}function Z(n,r){if(1&n&&e.\u0275\u0275template(0,z,2,1,"span",2),2&n){const t=e.\u0275\u0275nextContext();e.\u0275\u0275property("ngIf",null==t.value?null:t.value.amount)}}function J(n,r){if(1&n&&e.\u0275\u0275element(0,"p-inputNumber",7),2&n){const t=e.\u0275\u0275nextContext(3);e.\u0275\u0275property("currency",t.value.currencyCode)("name",t.name)("formControlName",t.name)}}function W(n,r){if(1&n&&(e.\u0275\u0275elementContainerStart(0,5),e.\u0275\u0275template(1,J,1,3,"p-inputNumber",6),e.\u0275\u0275elementContainerEnd()),2&n){const t=e.\u0275\u0275nextContext(2);e.\u0275\u0275property("formGroup",t.form),e.\u0275\u0275advance(1),e.\u0275\u0275property("ngIf",null==t.value?null:t.value.currencyCode)}}function Y(n,r){if(1&n&&e.\u0275\u0275template(0,W,2,2,"ng-container",4),2&n){const t=e.\u0275\u0275nextContext();e.\u0275\u0275property("ngIf",t.form)}}let h=(()=>{class n extends u.AbstractDynamicComponent{constructor(){super(),this.value=new s.MoneyAmount,this.converter=Intl.NumberFormat(navigator.language,{style:"currency",currency:"EUR"})}providesTemplates(t){switch(t){case"Euro":case"Dollar":return this.value.currencyCode="Euro"===t?"EUR":"USD",this.updateConverter(),new u.TemplateList(this.inlineView,null,this.fullEditView);default:return new u.TemplateList(null,null,null)}}setValue(t){null==t?(t=new s.MoneyAmount).currencyCode=this.value.currencyCode:t.currencyCode!=this.value.currencyCode&&null!=this.value.currencyCode&&console.warn("Setting currencyCode to "+t.currencyCode+" that is different from the component one ("+this.value.currencyCode+")"),super.setValue(t)}canProvide(t){switch(t){case"Euro":case"Dollar":return this.value.currencyCode="Euro"===t?"EUR":"USD",this.updateConverter(),new u.PossibleTemplateList(!0,!1,!0)}return new u.PossibleTemplateList(!1,!1,!1)}updateConverter(){null!=this.value?.currencyCode&&(this.converter=Intl.NumberFormat(navigator.language,{style:"currency",currency:this.value.currencyCode}))}localizedAmount(t){return null==t?this.value.currencyCode??"":this.converter.format(t)}transformToFormGroupValue(t){return null==t?.amount?null:t.amount}transformFromFormGroupValue(t){return this.value.amount=t,this.value}static#e=this.\u0275fac=function(o){return new(o||n)};static#t=this.\u0275cmp=e.\u0275\u0275defineComponent({type:n,selectors:[["dontcode-fields-eurodollar"]],viewQuery:function(o,a){if(1&o&&(e.\u0275\u0275viewQuery(H,7),e.\u0275\u0275viewQuery(j,7)),2&o){let l;e.\u0275\u0275queryRefresh(l=e.\u0275\u0275loadQuery())&&(a.inlineView=l.first),e.\u0275\u0275queryRefresh(l=e.\u0275\u0275loadQuery())&&(a.fullEditView=l.first)}},features:[e.\u0275\u0275InheritDefinitionFeature],decls:4,vars:0,consts:[["inlineView",""],["fullEditView",""],["class","numeric",4,"ngIf"],[1,"numeric"],[3,"formGroup",4,"ngIf"],[3,"formGroup"],["mode","currency",3,"currency","name","formControlName",4,"ngIf"],["mode","currency",3,"currency","name","formControlName"]],template:function(o,a){1&o&&(e.\u0275\u0275template(0,Z,1,1,"ng-template",null,0,e.\u0275\u0275templateRefExtractor),e.\u0275\u0275template(2,Y,1,1,"ng-template",null,1,e.\u0275\u0275templateRefExtractor))},dependencies:[m.NgIf,i.NgControlStatus,i.NgControlStatusGroup,i.FormGroupDirective,i.FormControlName,f.InputNumber],styles:[".numeric[_ngcontent-%COMP%]{text-align:end}"]})}return n})();const k=["inlineView"],X=["fullEditView"];function $(n,r){if(1&n&&(e.\u0275\u0275elementStart(0,"span",3),e.\u0275\u0275text(1),e.\u0275\u0275elementEnd()),2&n){const t=e.\u0275\u0275nextContext(2);e.\u0275\u0275advance(1),e.\u0275\u0275textInterpolate(t.localizedAmount(t.value.amount))}}function q(n,r){if(1&n&&e.\u0275\u0275template(0,$,2,1,"span",2),2&n){const t=e.\u0275\u0275nextContext();e.\u0275\u0275property("ngIf",null==t.value?null:t.value.currencyCode)}}function ee(n,r){1&n&&e.\u0275\u0275elementContainer(0)}function te(n,r){if(1&n&&(e.\u0275\u0275elementContainerStart(0,5),e.\u0275\u0275elementStart(1,"div",6)(2,"div",7),e.\u0275\u0275element(3,"p-inputNumber",8),e.\u0275\u0275elementEnd(),e.\u0275\u0275elementStart(4,"div",9),e.\u0275\u0275template(5,ee,1,0,"ng-container",10),e.\u0275\u0275elementEnd()(),e.\u0275\u0275elementContainerEnd()),2&n){const t=e.\u0275\u0275nextContext(2);e.\u0275\u0275property("formGroup",t.form),e.\u0275\u0275advance(3),e.\u0275\u0275property("name",t.name)("minFractionDigits",2),e.\u0275\u0275advance(2),e.\u0275\u0275property("ngTemplateOutlet",t.subFieldFullEditTemplate("currencyCode"))}}function ne(n,r){if(1&n&&e.\u0275\u0275template(0,te,6,4,"ng-container",4),2&n){const t=e.\u0275\u0275nextContext();e.\u0275\u0275property("ngIf",t.form)}}let v=(()=>{class n extends u.AbstractDynamicLoaderComponent{constructor(t,o,a){super(t,o,a),this.value=new s.MoneyAmount,this.converter=null,this.defineSubField("currencyCode","Currency")}providesTemplates(t){return new u.TemplateList(this.inlineView,null,this.fullEditView)}canProvide(t){return new u.PossibleTemplateList(!0,!1,!0)}createAndRegisterFormControls(){this.form.registerControl("amount",new i.FormControl(null,{updateOn:"blur"}))}loadSubField(t,o,a){return super.loadSubField(t,o,a)}getAmountSafe(){return this.value?.amount}setValue(t){null==t&&(t=new s.MoneyAmount),super.setValue(t),this.updateConverter()}updateConverter(){this.converter=null!=this.value?.currencyCode?Intl.NumberFormat(navigator.language,{style:"currency",currency:this.value.currencyCode}):null}localizedAmount(t){return null==t?this.value?.currencyCode??"":null!=this.converter?this.converter?.format(t):t.toString()}subFieldFullEditTemplate(t){return super.subFieldFullEditTemplate(t)}static#e=this.\u0275fac=function(o){return new(o||n)(e.\u0275\u0275directiveInject(u.ComponentLoaderService),e.\u0275\u0275directiveInject(e.Injector),e.\u0275\u0275directiveInject(e.ChangeDetectorRef))};static#t=this.\u0275cmp=e.\u0275\u0275defineComponent({type:n,selectors:[["dontcode-fields-money"]],viewQuery:function(o,a){if(1&o&&(e.\u0275\u0275viewQuery(k,7),e.\u0275\u0275viewQuery(X,7)),2&o){let l;e.\u0275\u0275queryRefresh(l=e.\u0275\u0275loadQuery())&&(a.inlineView=l.first),e.\u0275\u0275queryRefresh(l=e.\u0275\u0275loadQuery())&&(a.fullEditView=l.first)}},features:[e.\u0275\u0275InheritDefinitionFeature],decls:5,vars:0,consts:[["inlineView",""],["fullEditView",""],["class","numeric",4,"ngIf"],[1,"numeric"],[3,"formGroup",4,"ngIf"],[3,"formGroup"],[1,"grid"],[1,"col-12","md:col-8"],["formControlName","amount",3,"name","minFractionDigits"],[1,"col-12","md:col-4"],[4,"ngTemplateOutlet"]],template:function(o,a){1&o&&(e.\u0275\u0275element(0,"dtcde-dynamic"),e.\u0275\u0275template(1,q,1,1,"ng-template",null,0,e.\u0275\u0275templateRefExtractor),e.\u0275\u0275template(3,ne,1,1,"ng-template",null,1,e.\u0275\u0275templateRefExtractor))},dependencies:[m.NgIf,m.NgTemplateOutlet,i.NgControlStatus,i.NgControlStatusGroup,i.FormGroupDirective,i.FormControlName,u.DynamicInsertPoint,f.InputNumber]})}return n})();var x=c(66188);const oe=["inlineView"],ae=["fullEditView"];function re(n,r){if(1&n&&e.\u0275\u0275element(0,"p-rating",3),2&n){const t=e.\u0275\u0275nextContext(2);e.\u0275\u0275property("readonly",!0)("ngModel",t.value)("cancel",!1)}}function ie(n,r){if(1&n&&e.\u0275\u0275template(0,re,1,3,"p-rating",2),2&n){const t=e.\u0275\u0275nextContext();e.\u0275\u0275property("ngIf",t.value)}}function le(n,r){if(1&n&&(e.\u0275\u0275elementContainerStart(0,5),e.\u0275\u0275element(1,"p-rating",6),e.\u0275\u0275elementContainerEnd()),2&n){const t=e.\u0275\u0275nextContext(2);e.\u0275\u0275property("formGroup",t.form),e.\u0275\u0275advance(1),e.\u0275\u0275property("readonly",!1)("formControlName",t.name)}}function ue(n,r){if(1&n&&e.\u0275\u0275template(0,le,2,3,"ng-container",4),2&n){const t=e.\u0275\u0275nextContext();e.\u0275\u0275property("ngIf",t.form)}}let S=(()=>{class n extends u.AbstractDynamicComponent{providesTemplates(){return new u.TemplateList(this.inlineView,null,this.fullEditView)}canProvide(t){return new u.PossibleTemplateList(!0,!1,!0)}static#e=this.\u0275fac=function(){let t;return function(a){return(t||(t=e.\u0275\u0275getInheritedFactory(n)))(a||n)}}();static#t=this.\u0275cmp=e.\u0275\u0275defineComponent({type:n,selectors:[["dontcode-fields-rating"]],viewQuery:function(o,a){if(1&o&&(e.\u0275\u0275viewQuery(oe,7),e.\u0275\u0275viewQuery(ae,7)),2&o){let l;e.\u0275\u0275queryRefresh(l=e.\u0275\u0275loadQuery())&&(a.inlineView=l.first),e.\u0275\u0275queryRefresh(l=e.\u0275\u0275loadQuery())&&(a.fullEditView=l.first)}},features:[e.\u0275\u0275InheritDefinitionFeature],decls:4,vars:0,consts:[["inlineView",""],["fullEditView",""],["iconOnClass","pi pi-star-fill","iconOffClass","pi pi-star",3,"readonly","ngModel","cancel",4,"ngIf"],["iconOnClass","pi pi-star-fill","iconOffClass","pi pi-star",3,"readonly","ngModel","cancel"],[3,"formGroup",4,"ngIf"],[3,"formGroup"],["iconOnClass","pi pi-star-fill","iconOffClass","pi pi-star",3,"readonly","formControlName"]],template:function(o,a){1&o&&(e.\u0275\u0275template(0,ie,1,1,"ng-template",null,0,e.\u0275\u0275templateRefExtractor),e.\u0275\u0275template(2,ue,1,1,"ng-template",null,1,e.\u0275\u0275templateRefExtractor))},dependencies:[m.NgIf,i.NgControlStatus,i.NgControlStatusGroup,i.FormGroupDirective,i.FormControlName,i.NgModel,x.Rating]})}return n})();var ce=c(16602);let I=(()=>{class n{constructor(){console.log("Fields Plugin registering"),s.dtcde.registerPlugin(new M)}exposedPreviewHandlers(){return new Map([["CountryComponent",g],["CurrencyComponent",_],["EuroDollarComponent",h],["MoneyComponent",v],["RatingComponent",S]])}static#e=this.\u0275fac=function(o){return new(o||n)};static#t=this.\u0275mod=e.\u0275\u0275defineNgModule({type:n,id:"dontcode-plugin/fields"});static#n=this.\u0275inj=e.\u0275\u0275defineInjector({imports:[m.CommonModule,ce.HttpClientModule,i.ReactiveFormsModule,d.DropdownModule,u.PluginCommonModule,f.InputNumberModule,i.FormsModule,x.RatingModule]})}return n})();e.\u0275\u0275registerNgModuleType(I,"dontcode-plugin/fields")}}]);