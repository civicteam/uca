'use strict';var _classCallCheck2=require("babel-runtime/helpers/classCallCheck"),_classCallCheck3=_interopRequireDefault(_classCallCheck2),_createClass2=require("babel-runtime/helpers/createClass"),_createClass3=_interopRequireDefault(_createClass2),_stringify=require("babel-runtime/core-js/json/stringify"),_stringify2=_interopRequireDefault(_stringify);function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}var _=require("lodash"),timestamp=require("unix-timestamp"),_require=require("uuid"),uuidv4=_require.v4,flatten=require("flat"),definitions=require("./definitions"),_require2=require("./utils"),resolveType=_require2.resolveType,isValueOfType=_require2.isValueOfType,getTypeName=_require2.getTypeName,resolveDefinition=_require2.resolveDefinition,getTypeDefinition=_require2.getTypeDefinition,getObjectBasePropName=_require2.getObjectBasePropName,getObjectTypeDefProps=_require2.getObjectTypeDefProps,_require3=require("./UCATemplateValue"),UCATemplateValue=_require3.UCATemplateValue,isAttestableValue=function(a){return a&&a.attestableValue},handleNotFoundDefinition=function(a,b,c){if(null!=c){var d=_.find(a,{identifier:b});if(d)throw new Error("Version "+c+" is not supported for the identifier "+b)}throw new Error(b+" is not defined")},getUCATemplateProperties=function a(b,c,d,e){var f=d?_.find(definitions,{identifier:b,version:d}):_.find(definitions,{identifier:b});if(!f)return handleNotFoundDefinition(definitions,b,d);var g=getTypeDefinition(definitions,b),h=[];if(g&&"Object"===getTypeName(g,definitions)){var i=getObjectTypeDefProps(definitions,g),j=getObjectBasePropName(definitions,g,e);_.forEach(i,function(b){var c=_.split(b.type,":")[2],e=b.name===c?j:j+"."+b.name,f=a(b.type,b.required,d,e);_.forEach(f,function(a){h.push(a)})})}else if(e){var k=e+"."+_.split(f.identifier,":")[2],l=new UCATemplateValue(f.identifier,f.type,k,c,d);h.push(JSON.parse((0,_stringify2.default)(l)))}else{var m=_.split(b,":"),n=_.camelCase(m[1])+"."+m[2],o=new UCATemplateValue(f.identifier,f.type,n,c,d);h.push(JSON.parse((0,_stringify2.default)(o)))}return h},UserCollectableAttribute=function(){function a(b,c,d,e){(0,_classCallCheck3.default)(this,a),this.id=null,this.identifier=null,this.timestamp=null,this.version=null,this.type=null,this.value=null,this.credentialItem=null,this.definitions=e||definitions,this.initialize(b,c,d)}return(0,_createClass3.default)(a,[{key:"initialize",value:function(b,c,d){var e=a.getDefinition(b,d,this.definitions);this.timestamp=null,this.id=null,this.identifier=b,this.version=d||e.version,this.type=getTypeName(e,this.definitions);var f=_.clone(e);if(e.type=resolveType(e,this.definitions),"Array"===this.type)this.initializeValuesWithArrayItems(b,c,d);else if(isAttestableValue(c))this.value=c,this.initializeAttestableValue();else if(isValueOfType(c,this.type)){var g=resolveDefinition(f,this.definitions);if(this.timestamp=timestamp.now(),!a.isValid(c,this.type,g))throw new Error((0,_stringify2.default)(c)+" is not valid for "+b);this.value=c}else if(_.isEmpty(e.type.properties))throw new Error((0,_stringify2.default)(c)+" is not valid for "+b);else this.initializeValuesWithProperties(b,e,c);return this.credentialItem=e.credentialItem,this.id=this.version+":"+this.identifier+":"+uuidv4(),this}},{key:"initializeValuesWithArrayItems",value:function(b,c,d){var e=a.getDefinition(b,d,this.definitions);if(!_.isArray(c))throw new Error("Value for "+b+"-"+d+" should be an array");var f=_.map(c,function(b){return new a(_.get(e,"items.type"),b)});this.value=f}},{key:"initializeValuesWithProperties",value:function(a,b,c){var d=this,e=_.reduce(b.type.required,function(a,b){return c[b]&&a},!0);if(!e)throw new Error("Missing required fields to "+a);var f=_.mapValues(_.keyBy(_.map(c,function(a,c){var e=_.find(b.type.properties,{name:c}),f=new d.constructor(e.type,a,e.version);return{key:c,value:f}}),"key"),"value");this.value=f}},{key:"initializeAttestableValue",value:function(){throw new Error("UserCollectableAttribute must not receive attestable value: "+(0,_stringify2.default)(this.value))}},{key:"getFlattenValue",value:function(){var b=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[],c=this,d=1<arguments.length&&void 0!==arguments[1]?arguments[1]:null,e=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null;if("Object"===this.type){var f=a.getDefinition(this.identifier,this.version),g=resolveType(f,this.definitions);_.each(_.keys(this.value),function(a){var f=_.get(_.find(g.properties,{name:a}),"deambiguify");c.value[a].getFlattenValue(b,f?">"+a:d,e)})}else if("Array"===this.type){var h=flatten(this.getPlainValue());_.each(h,function(a,f){b.push({name:""+(e||"")+c.identifier+(d||"")+"."+f,value:_.toString(a)})})}else b.push({name:""+(e||"")+this.identifier+(d||""),value:_.toString(this.value)});return b}},{key:"getPlainValue",value:function(a){var b=this,c={},d=[];switch(this.type){case"String":case"Number":case"Boolean":if(a)c[a]=this.value;else return this.value;return c;case"Array":return _.forEach(this.value,function(a){d.push(a.getPlainValue())}),a?(c[a]=d,c):d;default:return _.forEach(_.sortBy(_.keys(this.value)),function(a){d.push(b.value[a].getPlainValue(a))}),_.forEach(d,function(b){a?(c[a]=c[a]?c[a]:{},_.assign(c[a],b)):_.assign(c,b)}),c;}}}],[{key:"getDefinition",value:function(a,b,c){var d=c||definitions,e=b?_.find(d,{identifier:a,version:b}):_.find(d,{identifier:a});return e?_.clone(e):handleNotFoundDefinition(d,a,b)}},{key:"fromFlattenValue",value:function(b,c){var d=c,e=a.getUCAProps(b),f=_.map(d,function(a){var b=_.cloneDeep(a),f=_.split(a.name,">"),g=f[0],h=f[1],i=_.find(e.properties,function(a){return"Array"===_.get(a,"meta.type")&&g.startsWith(a.name)||a.name===g&&(!h||_.includes(a.meta.propertyName,h))});if("Number"===_.get(i,"meta.type")&&(b.value=_.toNumber(a.value)),"Boolean"===_.get(i,"meta.type")&&(b.value="true"===_.toString(a.value)),"Array"===_.get(i,"meta.type")){var j=a.name.substring(0,i.name.length+1),k=_.filter(c,function(a){return a.name.startsWith(j)}),l=_.map(k,function(a){return{name:a.name.replace(i.name+".","$items."),value:a.value}}),m=_.reduce(l,function(a,b){var c=a;return c[b.name]=b.value,c},{});b.value=flatten.unflatten(m).$items,d=_.filter(d,function(a){return!_.includes(k,a)})}return b.name=_.get(i,"meta.propertyName"),b}),g=_.reduce(f,function(a,b){return a[b.name]=b.value,a},{}),h=flatten.unflatten(g,{object:!1});return new a(b,_.get(h,e.basePropertyName))}},{key:"getAllProperties",value:function(b,c){var d=_.find(definitions,{identifier:b}),e=[],f=getTypeDefinition(definitions,b);if(f&&"Object"===getTypeName(f,definitions)){var g=getObjectTypeDefProps(definitions,f),h=getObjectBasePropName(definitions,f,c);_.includes(["String","Number","Boolean"],""+g.type)?e.push(h+"."+g.name):_.forEach(g,function(b){var c=_.split(b.type,":")[2],d=b.name===c?h:h+"."+b.name,f=a.getAllProperties(b.type,d);_.forEach(f,function(a){return e.push(a)})})}else if(c){var i=c+"."+_.split(d.identifier,":")[2];e.push(i)}else{var j=_.split(b,":"),k=_.camelCase(j[1])+"."+j[2];e.push(k)}return e}},{key:"getUCAProps",value:function(a,b){var c=b?_.find(definitions,{identifier:a,version:b}):_.find(definitions,{identifier:a});if(!c)return handleNotFoundDefinition(definitions,a,b);var d={name:a,version:c.version,basePropertyName:"",properties:[]},e=getTypeDefinition(definitions,a);if(e&&"Object"===getTypeName(e,definitions)){var f=getObjectBasePropName(definitions,e);d.basePropertyName=f}else{var g=_.split(a,":"),h=_.camelCase(g[1])+"."+g[2];d.basePropertyName=h}return d.properties=getUCATemplateProperties(a,!0,b),d}},{key:"parseValueFromProps",value:function(b,c,d){var e=a.getUCAProps(b,d),f={};_.each(e.properties,function(a){var b=_.find(c,{name:a.name});b&&(f[a.meta.propertyName]=b.value)});var g=flatten.unflatten(f),h=_.get(g,e.basePropertyName);return h}},{key:"isValid",value:function(a,b,c){return"String"===b?(!c.pattern||c.pattern.test(a))&&(!c.minimumLength||a.length>=c.minimumLength)&&(!c.maximumLength||a.length<=c.minimumLength)&&(!c.enum||0<=_.indexOf(_.values(c.enum),a)):"Number"===b?((!_.isNil(c.minimum)&&c.exclusiveMinimum?a>c.minimum:a>=c.minimum)||_.isNil(c.minimum))&&((!_.isNil(c.maximum)&&c.exclusiveMaximum?a<c.maximum:a<=c.maximum)||_.isNil(c.maximum)):"Boolean"==b&&_.isBoolean(a)}}]),a}();function convertIdentifierToClassName(a){var b=_.split(a,":"),c=b[1],d=_.upperFirst(_.camelCase(b[2]));return""+c+d}function mixinIdentifiers(a){return _.forEach(_.filter(definitions,function(a){return a.credentialItem}),function(a){var b=convertIdentifierToClassName(a.identifier),c={},d=a.identifier;c[b]=function(a,b){var c=new UserCollectableAttribute(d,a,b);return c},_.mixin(UserCollectableAttribute,c)}),a}var UserCollectableAttributeToExport=mixinIdentifiers(UserCollectableAttribute);UserCollectableAttributeToExport.resolveType=resolveType,module.exports=UserCollectableAttributeToExport;