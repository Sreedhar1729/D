(function(){class e extends THREE.Loader{constructor(e){super(e)}load(e,t,n,s){const o=this;const i=o.path===""?THREE.LoaderUtils.extractUrlBase(e):o.path;const r=new THREE.FileLoader(o.manager);r.setPath(o.path);r.setRequestHeader(o.requestHeader);r.setWithCredentials(o.withCredentials);r.load(e,function(n){try{t(o.parse(n,i))}catch(t){if(s){s(t)}else{console.error(t)}o.manager.itemError(e)}},n,s)}parse(e,t){function n(e,t){const n=[];const s=e.childNodes;for(let e=0,o=s.length;e<o;e++){const o=s[e];if(o.nodeName===t){n.push(o)}}return n}function s(e){if(e.length===0)return[];const t=e.trim().split(/\s+/);const n=new Array(t.length);for(let e=0,s=t.length;e<s;e++){n[e]=t[e]}return n}function o(e){if(e.length===0)return[];const t=e.trim().split(/\s+/);const n=new Array(t.length);for(let e=0,s=t.length;e<s;e++){n[e]=parseFloat(t[e])}return n}function i(e){if(e.length===0)return[];const t=e.trim().split(/\s+/);const n=new Array(t.length);for(let e=0,s=t.length;e<s;e++){n[e]=parseInt(t[e])}return n}function r(e){return e.substring(1)}function a(){return"three_default_"+wt++}function c(e){return Object.keys(e).length===0}function l(e){return{unit:u(n(e,"unit")[0]),upAxis:d(n(e,"up_axis")[0])}}function u(e){if(e!==undefined&&e.hasAttribute("meter")===true){return parseFloat(e.getAttribute("meter"))}else{return 1}}function d(e){return e!==undefined?e.textContent:"Y_UP"}function f(e,t,s,o){const i=n(e,t)[0];if(i!==undefined){const e=n(i,s);for(let t=0;t<e.length;t++){o(e[t])}}}function h(e,t){for(const n in e){const s=e[n];s.build=t(e[n])}}function m(e,t){if(e.build!==undefined)return e.build;e.build=t(e);return e.build}function p(e){const t={sources:{},samplers:{},channels:{}};let n=false;for(let s=0,o=e.childNodes.length;s<o;s++){const o=e.childNodes[s];if(o.nodeType!==1)continue;let i;switch(o.nodeName){case"source":i=o.getAttribute("id");t.sources[i]=Ne(o);break;case"sampler":i=o.getAttribute("id");t.samplers[i]=b(o);break;case"channel":i=o.getAttribute("target");t.channels[i]=g(o);break;case"animation":p(o);n=true;break;default:console.log(o)}}if(n===false){xt.animations[e.getAttribute("id")||THREE.MathUtils.generateUUID()]=t}}function b(e){const t={inputs:{}};for(let n=0,s=e.childNodes.length;n<s;n++){const s=e.childNodes[n];if(s.nodeType!==1)continue;switch(s.nodeName){case"input":const e=r(s.getAttribute("source"));const n=s.getAttribute("semantic");t.inputs[n]=e;break}}return t}function g(e){const t={};const n=e.getAttribute("target");let s=n.split("/");const o=s.shift();let i=s.shift();const a=i.indexOf("(")!==-1;const c=i.indexOf(".")!==-1;if(c){s=i.split(".");i=s.shift();t.member=s.shift()}else if(a){const e=i.split("(");i=e.shift();for(let t=0;t<e.length;t++){e[t]=parseInt(e[t].replace(/\)/,""))}t.indices=e}t.id=o;t.sid=i;t.arraySyntax=a;t.memberSyntax=c;t.sampler=r(e.getAttribute("source"));return t}function y(e){const t=[];const n=e.channels;const s=e.samplers;const o=e.sources;for(const e in n){if(n.hasOwnProperty(e)){const i=n[e];const r=s[i.sampler];const a=r.inputs.INPUT;const c=r.inputs.OUTPUT;const l=o[a];const u=o[c];const d=k(i,l,u);A(d,t)}}return t}function E(e){return m(xt.animations[e],y)}function k(e,t,n){const s=xt.nodes[e.id];const o=rt(s.id);const i=s.transforms[e.sid];const r=s.matrix.clone().transpose();let a,c;let l,u,d,f;const h={};switch(i){case"matrix":for(l=0,u=t.array.length;l<u;l++){a=t.array[l];c=l*n.stride;if(h[a]===undefined)h[a]={};if(e.arraySyntax===true){const t=n.array[c];const s=e.indices[0]+4*e.indices[1];h[a][s]=t}else{for(d=0,f=n.stride;d<f;d++){h[a][d]=n.array[c+d]}}}break;case"translate":console.warn('THREE.ColladaLoader: Animation transform type "%s" not yet implemented.',i);break;case"rotate":console.warn('THREE.ColladaLoader: Animation transform type "%s" not yet implemented.',i);break;case"scale":console.warn('THREE.ColladaLoader: Animation transform type "%s" not yet implemented.',i);break}const m=N(h,r);const p={name:o.uuid,keyframes:m};return p}function N(e,t){const n=[];for(const t in e){n.push({time:parseFloat(t),value:e[t]})}n.sort(s);for(let e=0;e<16;e++){R(n,e,t.elements[e])}return n;function s(e,t){return e.time-t.time}}const T=new THREE.Vector3;const w=new THREE.Vector3;const x=new THREE.Quaternion;function A(e,t){const n=e.keyframes;const s=e.name;const o=[];const i=[];const r=[];const a=[];for(let e=0,t=n.length;e<t;e++){const t=n[e];const s=t.time;const c=t.value;Ke.fromArray(c).transpose();Ke.decompose(T,x,w);o.push(s);i.push(T.x,T.y,T.z);r.push(x.x,x.y,x.z,x.w);a.push(w.x,w.y,w.z)}if(i.length>0)t.push(new THREE.VectorKeyframeTrack(s+".position",o,i));if(r.length>0)t.push(new THREE.QuaternionKeyframeTrack(s+".quaternion",o,r));if(a.length>0)t.push(new THREE.VectorKeyframeTrack(s+".scale",o,a));return t}function R(e,t,n){let s;let o=true;let i,r;for(i=0,r=e.length;i<r;i++){s=e[i];if(s.value[t]===undefined){s.value[t]=null}else{o=false}}if(o===true){for(i=0,r=e.length;i<r;i++){s=e[i];s.value[t]=n}}else{H(e,t)}}function H(e,t){let n,s;for(let o=0,i=e.length;o<i;o++){const i=e[o];if(i.value[t]===null){n=C(e,o,t);s=v(e,o,t);if(n===null){i.value[t]=s.value[t];continue}if(s===null){i.value[t]=n.value[t];continue}_(i,n,s,t)}}}function C(e,t,n){while(t>=0){const s=e[t];if(s.value[n]!==null)return s;t--}return null}function v(e,t,n){while(t<e.length){const s=e[t];if(s.value[n]!==null)return s;t++}return null}function _(e,t,n,s){if(n.time-t.time===0){e.value[s]=t.value[s];return}e.value[s]=(e.time-t.time)*(n.value[s]-t.value[s])/(n.time-t.time)+t.value[s]}function M(e){const t={name:e.getAttribute("id")||"default",start:parseFloat(e.getAttribute("start")||0),end:parseFloat(e.getAttribute("end")||0),animations:[]};for(let n=0,s=e.childNodes.length;n<s;n++){const s=e.childNodes[n];if(s.nodeType!==1)continue;switch(s.nodeName){case"instance_animation":t.animations.push(r(s.getAttribute("url")));break}}xt.clips[e.getAttribute("id")]=t}function L(e){const t=[];const n=e.name;const s=e.end-e.start||-1;const o=e.animations;for(let e=0,n=o.length;e<n;e++){const n=E(o[e]);for(let e=0,s=n.length;e<s;e++){t.push(n[e])}}return new THREE.AnimationClip(n,s,t)}function O(e){return m(xt.clips[e],L)}function I(e){const t={};for(let n=0,s=e.childNodes.length;n<s;n++){const s=e.childNodes[n];if(s.nodeType!==1)continue;switch(s.nodeName){case"skin":t.id=r(s.getAttribute("source"));t.skin=j(s);break;case"morph":t.id=r(s.getAttribute("source"));console.warn("THREE.ColladaLoader: Morph target animation not supported yet.");break}}xt.controllers[e.getAttribute("id")]=t}function j(e){const t={sources:{}};for(let n=0,s=e.childNodes.length;n<s;n++){const s=e.childNodes[n];if(s.nodeType!==1)continue;switch(s.nodeName){case"bind_shape_matrix":t.bindShapeMatrix=o(s.textContent);break;case"source":const e=s.getAttribute("id");t.sources[e]=Ne(s);break;case"joints":t.joints=q(s);break;case"vertex_weights":t.vertexWeights=S(s);break}}return t}function q(e){const t={inputs:{}};for(let n=0,s=e.childNodes.length;n<s;n++){const s=e.childNodes[n];if(s.nodeType!==1)continue;switch(s.nodeName){case"input":const e=s.getAttribute("semantic");const n=r(s.getAttribute("source"));t.inputs[e]=n;break}}return t}function S(e){const t={inputs:{}};for(let n=0,s=e.childNodes.length;n<s;n++){const s=e.childNodes[n];if(s.nodeType!==1)continue;switch(s.nodeName){case"input":const e=s.getAttribute("semantic");const n=r(s.getAttribute("source"));const o=parseInt(s.getAttribute("offset"));t.inputs[e]={id:n,offset:o};break;case"vcount":t.vcount=i(s.textContent);break;case"v":t.v=i(s.textContent);break}}return t}function U(e){const t={id:e.id};const n=xt.geometries[t.id];if(e.skin!==undefined){t.skin=F(e.skin);n.sources.skinIndices=t.skin.indices;n.sources.skinWeights=t.skin.weights}return t}function F(e){const t=4;const n={joints:[],indices:{array:[],stride:t},weights:{array:[],stride:t}};const s=e.sources;const o=e.vertexWeights;const i=o.vcount;const r=o.v;const a=o.inputs.JOINT.offset;const c=o.inputs.WEIGHT.offset;const l=e.sources[e.joints.inputs.JOINT];const u=e.sources[e.joints.inputs.INV_BIND_MATRIX];const d=s[o.inputs.WEIGHT.id].array;let f=0;let h,m,p;for(h=0,p=i.length;h<p;h++){const e=i[h];const s=[];for(m=0;m<e;m++){const e=r[f+a];const t=r[f+c];const n=d[t];s.push({index:e,weight:n});f+=2}s.sort(b);for(m=0;m<t;m++){const e=s[m];if(e!==undefined){n.indices.array.push(e.index);n.weights.array.push(e.weight)}else{n.indices.array.push(0);n.weights.array.push(0)}}}if(e.bindShapeMatrix){n.bindMatrix=(new THREE.Matrix4).fromArray(e.bindShapeMatrix).transpose()}else{n.bindMatrix=(new THREE.Matrix4).identity()}for(h=0,p=l.array.length;h<p;h++){const e=l.array[h];const t=(new THREE.Matrix4).fromArray(u.array,h*u.stride).transpose();n.joints.push({name:e,boneInverse:t})}return n;function b(e,t){return t.weight-e.weight}}function B(e){return m(xt.controllers[e],U)}function V(e){const t={init_from:n(e,"init_from")[0].textContent};xt.images[e.getAttribute("id")]=t}function P(e){if(e.build!==undefined)return e.build;return e.init_from}function D(e){const t=xt.images[e];if(t!==undefined){return m(t,P)}console.warn("THREE.ColladaLoader: Couldn't find image with ID:",e);return null}function W(e){const t={};for(let n=0,s=e.childNodes.length;n<s;n++){const s=e.childNodes[n];if(s.nodeType!==1)continue;switch(s.nodeName){case"profile_COMMON":t.profile=z(s);break}}xt.effects[e.getAttribute("id")]=t}function z(e){const t={surfaces:{},samplers:{}};for(let n=0,s=e.childNodes.length;n<s;n++){const s=e.childNodes[n];if(s.nodeType!==1)continue;switch(s.nodeName){case"newparam":G(s,t);break;case"technique":t.technique=K(s);break;case"extra":t.extra=te(s);break}}return t}function G(e,t){const n=e.getAttribute("sid");for(let s=0,o=e.childNodes.length;s<o;s++){const o=e.childNodes[s];if(o.nodeType!==1)continue;switch(o.nodeName){case"surface":t.surfaces[n]=J(o);break;case"sampler2D":t.samplers[n]=X(o);break}}}function J(e){const t={};for(let n=0,s=e.childNodes.length;n<s;n++){const s=e.childNodes[n];if(s.nodeType!==1)continue;switch(s.nodeName){case"init_from":t.init_from=s.textContent;break}}return t}function X(e){const t={};for(let n=0,s=e.childNodes.length;n<s;n++){const s=e.childNodes[n];if(s.nodeType!==1)continue;switch(s.nodeName){case"source":t.source=s.textContent;break}}return t}function K(e){const t={};for(let n=0,s=e.childNodes.length;n<s;n++){const s=e.childNodes[n];if(s.nodeType!==1)continue;switch(s.nodeName){case"constant":case"lambert":case"blinn":case"phong":t.type=s.nodeName;t.parameters=Z(s);break}}return t}function Z(e){const t={};for(let n=0,s=e.childNodes.length;n<s;n++){const s=e.childNodes[n];if(s.nodeType!==1)continue;switch(s.nodeName){case"emission":case"diffuse":case"specular":case"bump":case"ambient":case"shininess":case"transparency":t[s.nodeName]=Q(s);break;case"transparent":t[s.nodeName]={opaque:s.getAttribute("opaque"),data:Q(s)};break}}return t}function Q(e){const t={};for(let n=0,s=e.childNodes.length;n<s;n++){const s=e.childNodes[n];if(s.nodeType!==1)continue;switch(s.nodeName){case"color":t[s.nodeName]=o(s.textContent);break;case"float":t[s.nodeName]=parseFloat(s.textContent);break;case"texture":t[s.nodeName]={id:s.getAttribute("texture"),extra:Y(s)};break}}return t}function Y(e){const t={technique:{}};for(let n=0,s=e.childNodes.length;n<s;n++){const s=e.childNodes[n];if(s.nodeType!==1)continue;switch(s.nodeName){case"extra":$(s,t);break}}return t}function $(e,t){for(let n=0,s=e.childNodes.length;n<s;n++){const s=e.childNodes[n];if(s.nodeType!==1)continue;switch(s.nodeName){case"technique":ee(s,t);break}}}function ee(e,t){for(let n=0,s=e.childNodes.length;n<s;n++){const s=e.childNodes[n];if(s.nodeType!==1)continue;switch(s.nodeName){case"repeatU":case"repeatV":case"offsetU":case"offsetV":t.technique[s.nodeName]=parseFloat(s.textContent);break;case"wrapU":case"wrapV":if(s.textContent.toUpperCase()==="TRUE"){t.technique[s.nodeName]=1}else if(s.textContent.toUpperCase()==="FALSE"){t.technique[s.nodeName]=0}else{t.technique[s.nodeName]=parseInt(s.textContent)}break}}}function te(e){const t={};for(let n=0,s=e.childNodes.length;n<s;n++){const s=e.childNodes[n];if(s.nodeType!==1)continue;switch(s.nodeName){case"technique":t.technique=ne(s);break}}return t}function ne(e){const t={};for(let n=0,s=e.childNodes.length;n<s;n++){const s=e.childNodes[n];if(s.nodeType!==1)continue;switch(s.nodeName){case"double_sided":t[s.nodeName]=parseInt(s.textContent);break}}return t}function se(e){return e}function oe(e){return m(xt.effects[e],se)}function ie(e){const t={name:e.getAttribute("name")};for(let n=0,s=e.childNodes.length;n<s;n++){const s=e.childNodes[n];if(s.nodeType!==1)continue;switch(s.nodeName){case"instance_effect":t.url=r(s.getAttribute("url"));break}}xt.materials[e.getAttribute("id")]=t}function re(e){let t;let n=e.slice((e.lastIndexOf(".")-1>>>0)+2);n=n.toLowerCase();switch(n){case"tga":t=kt;break;default:t=Et}return t}function ae(e){const t=oe(e.url);const n=t.profile.technique;const s=t.profile.extra;let o;switch(n.type){case"phong":case"blinn":o=new THREE.MeshPhongMaterial;break;case"lambert":o=new THREE.MeshLambertMaterial;break;default:o=new THREE.MeshBasicMaterial;break}o.name=e.name||"";function i(e){const n=t.profile.samplers[e.id];let s=null;if(n!==undefined){const e=t.profile.surfaces[n.source];s=D(e.init_from)}else{console.warn("THREE.ColladaLoader: Undefined sampler. Access image directly (see #12530).");s=D(e.id)}if(s!==null){const t=re(s);if(t!==undefined){const n=t.load(s);const o=e.extra;if(o!==undefined&&o.technique!==undefined&&c(o.technique)===false){const e=o.technique;n.wrapS=e.wrapU?THREE.RepeatWrapping:THREE.ClampToEdgeWrapping;n.wrapT=e.wrapV?THREE.RepeatWrapping:THREE.ClampToEdgeWrapping;n.offset.set(e.offsetU||0,e.offsetV||0);n.repeat.set(e.repeatU||1,e.repeatV||1)}else{n.wrapS=THREE.RepeatWrapping;n.wrapT=THREE.RepeatWrapping}return n}else{console.warn("THREE.ColladaLoader: THREE.Loader for texture %s not found.",s);return null}}else{console.warn("THREE.ColladaLoader: Couldn't create texture with ID:",e.id);return null}}const r=n.parameters;for(const e in r){const t=r[e];switch(e){case"diffuse":if(t.color)o.color.fromArray(t.color);if(t.texture)o.map=i(t.texture);break;case"specular":if(t.color&&o.specular)o.specular.fromArray(t.color);if(t.texture)o.specularMap=i(t.texture);break;case"bump":if(t.texture)o.normalMap=i(t.texture);break;case"ambient":if(t.texture)o.lightMap=i(t.texture);break;case"shininess":if(t.float&&o.shininess)o.shininess=t.float;break;case"emission":if(t.color&&o.emissive)o.emissive.fromArray(t.color);if(t.texture)o.emissiveMap=i(t.texture);break}}let a=r["transparent"];let l=r["transparency"];if(l===undefined&&a){l={float:1}}if(a===undefined&&l){a={opaque:"A_ONE",data:{color:[1,1,1,1]}}}if(a&&l){if(a.data.texture){o.transparent=true}else{const e=a.data.color;switch(a.opaque){case"A_ONE":o.opacity=e[3]*l.float;break;case"RGB_ZERO":o.opacity=1-e[0]*l.float;break;case"A_ZERO":o.opacity=1-e[3]*l.float;break;case"RGB_ONE":o.opacity=e[0]*l.float;break;default:console.warn('THREE.ColladaLoader: Invalid opaque type "%s" of transparent tag.',a.opaque)}if(o.opacity<1)o.transparent=true}}if(s!==undefined&&s.technique!==undefined&&s.technique.double_sided===1){o.side=THREE.DoubleSide}return o}function ce(e){return m(xt.materials[e],ae)}function le(e){const t={name:e.getAttribute("name")};for(let n=0,s=e.childNodes.length;n<s;n++){const s=e.childNodes[n];if(s.nodeType!==1)continue;switch(s.nodeName){case"optics":t.optics=ue(s);break}}xt.cameras[e.getAttribute("id")]=t}function ue(e){for(let t=0;t<e.childNodes.length;t++){const n=e.childNodes[t];switch(n.nodeName){case"technique_common":return de(n)}}return{}}function de(e){const t={};for(let n=0;n<e.childNodes.length;n++){const s=e.childNodes[n];switch(s.nodeName){case"perspective":case"orthographic":t.technique=s.nodeName;t.parameters=fe(s);break}}return t}function fe(e){const t={};for(let n=0;n<e.childNodes.length;n++){const s=e.childNodes[n];switch(s.nodeName){case"xfov":case"yfov":case"xmag":case"ymag":case"znear":case"zfar":case"aspect_ratio":t[s.nodeName]=parseFloat(s.textContent);break}}return t}function he(e){let t;switch(e.optics.technique){case"perspective":t=new THREE.PerspectiveCamera(e.optics.parameters.yfov,e.optics.parameters.aspect_ratio,e.optics.parameters.znear,e.optics.parameters.zfar);break;case"orthographic":let n=e.optics.parameters.ymag;let s=e.optics.parameters.xmag;const o=e.optics.parameters.aspect_ratio;s=s===undefined?n*o:s;n=n===undefined?s/o:n;s*=.5;n*=.5;t=new THREE.OrthographicCamera(-s,s,n,-n,e.optics.parameters.znear,e.optics.parameters.zfar);break;default:t=new THREE.PerspectiveCamera;break}t.name=e.name||"";return t}function me(e){const t=xt.cameras[e];if(t!==undefined){return m(t,he)}console.warn("THREE.ColladaLoader: Couldn't find camera with ID:",e);return null}function pe(e){let t={};for(let n=0,s=e.childNodes.length;n<s;n++){const s=e.childNodes[n];if(s.nodeType!==1)continue;switch(s.nodeName){case"technique_common":t=be(s);break}}xt.lights[e.getAttribute("id")]=t}function be(e){const t={};for(let n=0,s=e.childNodes.length;n<s;n++){const s=e.childNodes[n];if(s.nodeType!==1)continue;switch(s.nodeName){case"directional":case"point":case"spot":case"ambient":t.technique=s.nodeName;t.parameters=ge(s)}}return t}function ge(e){const t={};for(let n=0,s=e.childNodes.length;n<s;n++){const s=e.childNodes[n];if(s.nodeType!==1)continue;switch(s.nodeName){case"color":const e=o(s.textContent);t.color=(new THREE.Color).fromArray(e);break;case"falloff_angle":t.falloffAngle=parseFloat(s.textContent);break;case"quadratic_attenuation":const n=parseFloat(s.textContent);t.distance=n?Math.sqrt(1/n):0;break}}return t}function ye(e){let t;switch(e.technique){case"directional":t=new THREE.DirectionalLight;break;case"point":t=new THREE.PointLight;break;case"spot":t=new THREE.SpotLight;break;case"ambient":t=new THREE.AmbientLight;break}if(e.parameters.color)t.color.copy(e.parameters.color);if(e.parameters.distance)t.distance=e.parameters.distance;return t}function Ee(e){const t=xt.lights[e];if(t!==undefined){return m(t,ye)}console.warn("THREE.ColladaLoader: Couldn't find light with ID:",e);return null}function ke(e){const t={name:e.getAttribute("name"),sources:{},vertices:{},primitives:[]};const s=n(e,"mesh")[0];if(s===undefined)return;for(let e=0;e<s.childNodes.length;e++){const n=s.childNodes[e];if(n.nodeType!==1)continue;const o=n.getAttribute("id");switch(n.nodeName){case"source":t.sources[o]=Ne(n);break;case"vertices":t.vertices=Te(n);break;case"polygons":console.warn("THREE.ColladaLoader: Unsupported primitive type: ",n.nodeName);break;case"lines":case"linestrips":case"polylist":case"triangles":t.primitives.push(we(n));break;default:console.log(n)}}xt.geometries[e.getAttribute("id")]=t}function Ne(e){const t={array:[],stride:3};for(let i=0;i<e.childNodes.length;i++){const r=e.childNodes[i];if(r.nodeType!==1)continue;switch(r.nodeName){case"float_array":t.array=o(r.textContent);break;case"Name_array":t.array=s(r.textContent);break;case"technique_common":const e=n(r,"accessor")[0];if(e!==undefined){t.stride=parseInt(e.getAttribute("stride"))}break}}return t}function Te(e){const t={};for(let n=0;n<e.childNodes.length;n++){const s=e.childNodes[n];if(s.nodeType!==1)continue;t[s.getAttribute("semantic")]=r(s.getAttribute("source"))}return t}function we(e){const t={type:e.nodeName,material:e.getAttribute("material"),count:parseInt(e.getAttribute("count")),inputs:{},stride:0,hasUV:false};for(let n=0,s=e.childNodes.length;n<s;n++){const s=e.childNodes[n];if(s.nodeType!==1)continue;switch(s.nodeName){case"input":const e=r(s.getAttribute("source"));const n=s.getAttribute("semantic");const o=parseInt(s.getAttribute("offset"));const a=parseInt(s.getAttribute("set"));const c=a>0?n+a:n;t.inputs[c]={id:e,offset:o};t.stride=Math.max(t.stride,o+1);if(n==="TEXCOORD")t.hasUV=true;break;case"vcount":t.vcount=i(s.textContent);break;case"p":t.p=i(s.textContent);break}}return t}function xe(e){const t={};for(let n=0;n<e.length;n++){const s=e[n];if(t[s.type]===undefined)t[s.type]=[];t[s.type].push(s)}return t}function Ae(e){let t=0;for(let n=0,s=e.length;n<s;n++){const s=e[n];if(s.hasUV===true){t++}}if(t>0&&t<e.length){e.uvsNeedsFix=true}}function Re(e){const t={};const n=e.sources;const s=e.vertices;const o=e.primitives;if(o.length===0)return{};const i=xe(o);for(const e in i){const o=i[e];Ae(o);t[e]=He(o,n,s)}return t}function He(e,t,n){const s={};const o={array:[],stride:0};const i={array:[],stride:0};const r={array:[],stride:0};const a={array:[],stride:0};const c={array:[],stride:0};const l={array:[],stride:4};const u={array:[],stride:4};const d=new THREE.BufferGeometry;const f=[];let h=0;for(let s=0;s<e.length;s++){const m=e[s];const p=m.inputs;let b=0;switch(m.type){case"lines":case"linestrips":b=m.count*2;break;case"triangles":b=m.count*3;break;case"polylist":for(let e=0;e<m.count;e++){const t=m.vcount[e];switch(t){case 3:b+=3;break;case 4:b+=6;break;default:b+=(t-2)*3;break}}break;default:console.warn("THREE.ColladaLoader: Unknow primitive type:",m.type)}d.addGroup(h,b,s);h+=b;if(m.material){f.push(m.material)}for(const s in p){const d=p[s];switch(s){case"VERTEX":for(const s in n){const f=n[s];switch(s){case"POSITION":const n=o.array.length;Ce(m,t[f],d.offset,o.array);o.stride=t[f].stride;if(t.skinWeights&&t.skinIndices){Ce(m,t.skinIndices,d.offset,l.array);Ce(m,t.skinWeights,d.offset,u.array)}if(m.hasUV===false&&e.uvsNeedsFix===true){const e=(o.array.length-n)/o.stride;for(let t=0;t<e;t++){r.array.push(0,0)}}break;case"NORMAL":Ce(m,t[f],d.offset,i.array);i.stride=t[f].stride;break;case"COLOR":Ce(m,t[f],d.offset,c.array);c.stride=t[f].stride;break;case"TEXCOORD":Ce(m,t[f],d.offset,r.array);r.stride=t[f].stride;break;case"TEXCOORD1":Ce(m,t[f],d.offset,a.array);r.stride=t[f].stride;break;default:console.warn('THREE.ColladaLoader: Semantic "%s" not handled in geometry build process.',s)}}break;case"NORMAL":Ce(m,t[d.id],d.offset,i.array);i.stride=t[d.id].stride;break;case"COLOR":Ce(m,t[d.id],d.offset,c.array);c.stride=t[d.id].stride;break;case"TEXCOORD":Ce(m,t[d.id],d.offset,r.array);r.stride=t[d.id].stride;break;case"TEXCOORD1":Ce(m,t[d.id],d.offset,a.array);a.stride=t[d.id].stride;break}}}if(o.array.length>0)d.setAttribute("position",new THREE.Float32BufferAttribute(o.array,o.stride));if(i.array.length>0)d.setAttribute("normal",new THREE.Float32BufferAttribute(i.array,i.stride));if(c.array.length>0)d.setAttribute("color",new THREE.Float32BufferAttribute(c.array,c.stride));if(r.array.length>0)d.setAttribute("uv",new THREE.Float32BufferAttribute(r.array,r.stride));if(a.array.length>0)d.setAttribute("uv2",new THREE.Float32BufferAttribute(a.array,a.stride));if(l.array.length>0)d.setAttribute("skinIndex",new THREE.Float32BufferAttribute(l.array,l.stride));if(u.array.length>0)d.setAttribute("skinWeight",new THREE.Float32BufferAttribute(u.array,u.stride));s.data=d;s.type=e[0].type;s.materialKeys=f;return s}function Ce(e,t,n,s){const o=e.p;const i=e.stride;const r=e.vcount;function a(e){let t=o[e+n]*l;const i=t+l;for(;t<i;t++){s.push(c[t])}}const c=t.array;const l=t.stride;if(e.vcount!==undefined){let e=0;for(let t=0,n=r.length;t<n;t++){const n=r[t];if(n===4){const t=e+i*0;const n=e+i*1;const s=e+i*2;const o=e+i*3;a(t);a(n);a(o);a(n);a(s);a(o)}else if(n===3){const t=e+i*0;const n=e+i*1;const s=e+i*2;a(t);a(n);a(s)}else if(n>4){for(let t=1,s=n-2;t<=s;t++){const n=e+i*0;const s=e+i*t;const o=e+i*(t+1);a(n);a(s);a(o)}}e+=i*n}}else{for(let e=0,t=o.length;e<t;e+=i){a(e)}}}function ve(e){return m(xt.geometries[e],Re)}function _e(e){const t={name:e.getAttribute("name")||"",joints:{},links:[]};for(let n=0;n<e.childNodes.length;n++){const s=e.childNodes[n];if(s.nodeType!==1)continue;switch(s.nodeName){case"technique_common":Oe(s,t);break}}xt.kinematicsModels[e.getAttribute("id")]=t}function Me(e){if(e.build!==undefined)return e.build;return e}function Le(e){return m(xt.kinematicsModels[e],Me)}function Oe(e,t){for(let n=0;n<e.childNodes.length;n++){const s=e.childNodes[n];if(s.nodeType!==1)continue;switch(s.nodeName){case"joint":t.joints[s.getAttribute("sid")]=Ie(s);break;case"link":t.links.push(qe(s));break}}}function Ie(e){let t;for(let n=0;n<e.childNodes.length;n++){const s=e.childNodes[n];if(s.nodeType!==1)continue;switch(s.nodeName){case"prismatic":case"revolute":t=je(s);break}}return t}function je(e){const t={sid:e.getAttribute("sid"),name:e.getAttribute("name")||"",axis:new THREE.Vector3,limits:{min:0,max:0},type:e.nodeName,static:false,zeroPosition:0,middlePosition:0};for(let n=0;n<e.childNodes.length;n++){const s=e.childNodes[n];if(s.nodeType!==1)continue;switch(s.nodeName){case"axis":const e=o(s.textContent);t.axis.fromArray(e);break;case"limits":const n=s.getElementsByTagName("max")[0];const i=s.getElementsByTagName("min")[0];t.limits.max=parseFloat(n.textContent);t.limits.min=parseFloat(i.textContent);break}}if(t.limits.min>=t.limits.max){t.static=true}t.middlePosition=(t.limits.min+t.limits.max)/2;return t}function qe(e){const t={sid:e.getAttribute("sid"),name:e.getAttribute("name")||"",attachments:[],transforms:[]};for(let n=0;n<e.childNodes.length;n++){const s=e.childNodes[n];if(s.nodeType!==1)continue;switch(s.nodeName){case"attachment_full":t.attachments.push(Se(s));break;case"matrix":case"translate":case"rotate":t.transforms.push(Ue(s));break}}return t}function Se(e){const t={joint:e.getAttribute("joint").split("/").pop(),transforms:[],links:[]};for(let n=0;n<e.childNodes.length;n++){const s=e.childNodes[n];if(s.nodeType!==1)continue;switch(s.nodeName){case"link":t.links.push(qe(s));break;case"matrix":case"translate":case"rotate":t.transforms.push(Ue(s));break}}return t}function Ue(e){const t={type:e.nodeName};const n=o(e.textContent);switch(t.type){case"matrix":t.obj=new THREE.Matrix4;t.obj.fromArray(n).transpose();break;case"translate":t.obj=new THREE.Vector3;t.obj.fromArray(n);break;case"rotate":t.obj=new THREE.Vector3;t.obj.fromArray(n);t.angle=THREE.MathUtils.degToRad(n[3]);break}return t}function Fe(e){const t={name:e.getAttribute("name")||"",rigidBodies:{}};for(let n=0;n<e.childNodes.length;n++){const s=e.childNodes[n];if(s.nodeType!==1)continue;switch(s.nodeName){case"rigid_body":t.rigidBodies[s.getAttribute("name")]={};Be(s,t.rigidBodies[s.getAttribute("name")]);break}}xt.physicsModels[e.getAttribute("id")]=t}function Be(e,t){for(let n=0;n<e.childNodes.length;n++){const s=e.childNodes[n];if(s.nodeType!==1)continue;switch(s.nodeName){case"technique_common":Ve(s,t);break}}}function Ve(e,t){for(let n=0;n<e.childNodes.length;n++){const s=e.childNodes[n];if(s.nodeType!==1)continue;switch(s.nodeName){case"inertia":t.inertia=o(s.textContent);break;case"mass":t.mass=o(s.textContent)[0];break}}}function Pe(e){const t={bindJointAxis:[]};for(let n=0;n<e.childNodes.length;n++){const s=e.childNodes[n];if(s.nodeType!==1)continue;switch(s.nodeName){case"bind_joint_axis":t.bindJointAxis.push(De(s));break}}xt.kinematicsScenes[r(e.getAttribute("url"))]=t}function De(e){const t={target:e.getAttribute("target").split("/").pop()};for(let n=0;n<e.childNodes.length;n++){const s=e.childNodes[n];if(s.nodeType!==1)continue;switch(s.nodeName){case"axis":const e=s.getElementsByTagName("param")[0];t.axis=e.textContent;const n=t.axis.split("inst_").pop().split("axis")[0];t.jointIndex=n.substr(0,n.length-1);break}}return t}function We(e){if(e.build!==undefined)return e.build;return e}function ze(e){return m(xt.kinematicsScenes[e],We)}function Ge(){const e=Object.keys(xt.kinematicsModels)[0];const t=Object.keys(xt.kinematicsScenes)[0];const n=Object.keys(xt.visualScenes)[0];if(e===undefined||t===undefined)return;const s=Le(e);const o=ze(t);const i=ut(n);const r=o.bindJointAxis;const a={};for(let e=0,t=r.length;e<t;e++){const t=r[e];const n=pt.querySelector('[sid="'+t.target+'"]');if(n){const e=n.parentElement;c(t.jointIndex,e)}}function c(e,t){const n=t.getAttribute("name");const o=s.joints[e];i.traverse(function(s){if(s.name===n){a[e]={object:s,transforms:Je(t),joint:o,position:o.zeroPosition}}})}const l=new THREE.Matrix4;Tt={joints:s&&s.joints,getJointValue:function(e){const t=a[e];if(t){return t.position}else{console.warn("THREE.ColladaLoader: Joint "+e+" doesn't exist.")}},setJointValue:function(e,t){const n=a[e];if(n){const s=n.joint;if(t>s.limits.max||t<s.limits.min){console.warn("THREE.ColladaLoader: Joint "+e+" value "+t+" outside of limits (min: "+s.limits.min+", max: "+s.limits.max+").")}else if(s.static){console.warn("THREE.ColladaLoader: Joint "+e+" is static.")}else{const o=n.object;const i=s.axis;const r=n.transforms;Ke.identity();for(let n=0;n<r.length;n++){const o=r[n];if(o.sid&&o.sid.indexOf(e)!==-1){switch(s.type){case"revolute":Ke.multiply(l.makeRotationAxis(i,THREE.MathUtils.degToRad(t)));break;case"prismatic":Ke.multiply(l.makeTranslation(i.x*t,i.y*t,i.z*t));break;default:console.warn("THREE.ColladaLoader: Unknown joint type: "+s.type);break}}else{switch(o.type){case"matrix":Ke.multiply(o.obj);break;case"translate":Ke.multiply(l.makeTranslation(o.obj.x,o.obj.y,o.obj.z));break;case"scale":Ke.scale(o.obj);break;case"rotate":Ke.multiply(l.makeRotationAxis(o.obj,o.angle));break}}}o.matrix.copy(Ke);o.matrix.decompose(o.position,o.quaternion,o.scale);a[e].position=t}}else{console.log("THREE.ColladaLoader: "+e+" does not exist.")}}}}function Je(e){const t=[];const n=pt.querySelector('[id="'+e.id+'"]');for(let e=0;e<n.childNodes.length;e++){const s=n.childNodes[e];if(s.nodeType!==1)continue;let i,r;switch(s.nodeName){case"matrix":i=o(s.textContent);const e=(new THREE.Matrix4).fromArray(i).transpose();t.push({sid:s.getAttribute("sid"),type:s.nodeName,obj:e});break;case"translate":case"scale":i=o(s.textContent);r=(new THREE.Vector3).fromArray(i);t.push({sid:s.getAttribute("sid"),type:s.nodeName,obj:r});break;case"rotate":i=o(s.textContent);r=(new THREE.Vector3).fromArray(i);const n=THREE.MathUtils.degToRad(i[3]);t.push({sid:s.getAttribute("sid"),type:s.nodeName,obj:r,angle:n});break}}return t}function Xe(e){const t=e.getElementsByTagName("node");for(let e=0;e<t.length;e++){const n=t[e];if(n.hasAttribute("id")===false){n.setAttribute("id",a())}}}const Ke=new THREE.Matrix4;const Ze=new THREE.Vector3;function Qe(e){const t={name:e.getAttribute("name")||"",type:e.getAttribute("type"),id:e.getAttribute("id"),sid:e.getAttribute("sid"),matrix:new THREE.Matrix4,nodes:[],instanceCameras:[],instanceControllers:[],instanceLights:[],instanceGeometries:[],instanceNodes:[],transforms:{}};for(let n=0;n<e.childNodes.length;n++){const s=e.childNodes[n];if(s.nodeType!==1)continue;let i;switch(s.nodeName){case"node":t.nodes.push(s.getAttribute("id"));Qe(s);break;case"instance_camera":t.instanceCameras.push(r(s.getAttribute("url")));break;case"instance_controller":t.instanceControllers.push(Ye(s));break;case"instance_light":t.instanceLights.push(r(s.getAttribute("url")));break;case"instance_geometry":t.instanceGeometries.push(Ye(s));break;case"instance_node":t.instanceNodes.push(r(s.getAttribute("url")));break;case"matrix":i=o(s.textContent);t.matrix.multiply(Ke.fromArray(i).transpose());t.transforms[s.getAttribute("sid")]=s.nodeName;break;case"translate":i=o(s.textContent);Ze.fromArray(i);t.matrix.multiply(Ke.makeTranslation(Ze.x,Ze.y,Ze.z));t.transforms[s.getAttribute("sid")]=s.nodeName;break;case"rotate":i=o(s.textContent);const e=THREE.MathUtils.degToRad(i[3]);t.matrix.multiply(Ke.makeRotationAxis(Ze.fromArray(i),e));t.transforms[s.getAttribute("sid")]=s.nodeName;break;case"scale":i=o(s.textContent);t.matrix.scale(Ze.fromArray(i));t.transforms[s.getAttribute("sid")]=s.nodeName;break;case"extra":break;default:console.log(s)}}if(it(t.id)){console.warn("THREE.ColladaLoader: There is already a node with ID %s. Exclude current node from further processing.",t.id)}else{xt.nodes[t.id]=t}return t}function Ye(e){const t={id:r(e.getAttribute("url")),materials:{},skeletons:[]};for(let n=0;n<e.childNodes.length;n++){const s=e.childNodes[n];switch(s.nodeName){case"bind_material":const e=s.getElementsByTagName("instance_material");for(let n=0;n<e.length;n++){const s=e[n];const o=s.getAttribute("symbol");const i=s.getAttribute("target");t.materials[o]=r(i)}break;case"skeleton":t.skeletons.push(r(s.textContent));break;default:break}}return t}function $e(e,t){const n=[];const s=[];let o,i,r;for(o=0;o<e.length;o++){const s=e[o];let i;if(it(s)){i=rt(s);et(i,t,n)}else if(lt(s)){const e=xt.visualScenes[s];const o=e.children;for(let e=0;e<o.length;e++){const s=o[e];if(s.type==="JOINT"){const e=rt(s.id);et(e,t,n)}}}else{console.error("THREE.ColladaLoader: Unable to find root bone of skeleton with ID:",s)}}for(o=0;o<t.length;o++){for(i=0;i<n.length;i++){r=n[i];if(r.bone.name===t[o].name){s[o]=r;r.processed=true;break}}}for(o=0;o<n.length;o++){r=n[o];if(r.processed===false){s.push(r);r.processed=true}}const a=[];const c=[];for(o=0;o<s.length;o++){r=s[o];a.push(r.bone);c.push(r.boneInverse)}return new THREE.Skeleton(a,c)}function et(e,t,n){e.traverse(function(e){if(e.isBone===true){let s;for(let n=0;n<t.length;n++){const o=t[n];if(o.name===e.name){s=o.boneInverse;break}}if(s===undefined){s=new THREE.Matrix4}n.push({bone:e,boneInverse:s,processed:false})}})}function tt(e){const t=[];const n=e.matrix;const s=e.nodes;const o=e.type;const i=e.instanceCameras;const r=e.instanceControllers;const a=e.instanceLights;const c=e.instanceGeometries;const l=e.instanceNodes;for(let e=0,n=s.length;e<n;e++){t.push(rt(s[e]))}for(let e=0,n=i.length;e<n;e++){const n=me(i[e]);if(n!==null){t.push(n.clone())}}for(let e=0,n=r.length;e<n;e++){const n=r[e];const s=B(n.id);const o=ve(s.id);const i=ot(o,n.materials);const a=n.skeletons;const c=s.skin.joints;const l=$e(a,c);for(let e=0,n=i.length;e<n;e++){const n=i[e];if(n.isSkinnedMesh){n.bind(l,s.skin.bindMatrix);n.normalizeSkinWeights()}t.push(n)}}for(let e=0,n=a.length;e<n;e++){const n=Ee(a[e]);if(n!==null){t.push(n.clone())}}for(let e=0,n=c.length;e<n;e++){const n=c[e];const s=ve(n.id);const o=ot(s,n.materials);for(let e=0,n=o.length;e<n;e++){t.push(o[e])}}for(let e=0,n=l.length;e<n;e++){t.push(rt(l[e]).clone())}let u;if(s.length===0&&t.length===1){u=t[0]}else{u=o==="JOINT"?new THREE.Bone:new THREE.Group;for(let e=0;e<t.length;e++){u.add(t[e])}}u.name=o==="JOINT"?e.sid:e.name;u.matrix.copy(n);u.matrix.decompose(u.position,u.quaternion,u.scale);return u}const nt=new THREE.MeshBasicMaterial({color:16711935});function st(e,t){const n=[];for(let s=0,o=e.length;s<o;s++){const o=t[e[s]];if(o===undefined){console.warn("THREE.ColladaLoader: Material with key %s not found. Apply fallback material.",e[s]);n.push(nt)}else{n.push(ce(o))}}return n}function ot(e,t){const n=[];for(const s in e){const o=e[s];const i=st(o.materialKeys,t);if(i.length===0){if(s==="lines"||s==="linestrips"){i.push(new THREE.LineBasicMaterial)}else{i.push(new THREE.MeshPhongMaterial)}}const r=o.data.attributes.skinIndex!==undefined;if(r){for(let e=0,t=i.length;e<t;e++){i[e].skinning=true}}const a=i.length===1?i[0]:i;let c;switch(s){case"lines":c=new THREE.LineSegments(o.data,a);break;case"linestrips":c=new THREE.Line(o.data,a);break;case"triangles":case"polylist":if(r){c=new THREE.SkinnedMesh(o.data,a)}else{c=new THREE.Mesh(o.data,a)}break}n.push(c)}return n}function it(e){return xt.nodes[e]!==undefined}function rt(e){return m(xt.nodes[e],tt)}function at(e){const t={name:e.getAttribute("name"),children:[]};Xe(e);const s=n(e,"node");for(let e=0;e<s.length;e++){t.children.push(Qe(s[e]))}xt.visualScenes[e.getAttribute("id")]=t}function ct(e){const t=new THREE.Group;t.name=e.name;const n=e.children;for(let e=0;e<n.length;e++){const s=n[e];t.add(rt(s.id))}return t}function lt(e){return xt.visualScenes[e]!==undefined}function ut(e){return m(xt.visualScenes[e],ct)}function dt(e){const t=n(e,"instance_visual_scene")[0];return ut(r(t.getAttribute("url")))}function ft(){const e=xt.clips;if(c(e)===true){if(c(xt.animations)===false){const e=[];for(const t in xt.animations){const n=E(t);for(let t=0,s=n.length;t<s;t++){e.push(n[t])}}Nt.push(new THREE.AnimationClip("default",-1,e))}}else{for(const t in e){Nt.push(O(t))}}}function ht(e){let t="";const n=[e];while(n.length){const e=n.shift();if(e.nodeType===Node.TEXT_NODE){t+=e.textContent}else{t+="\n";n.push.apply(n,e.childNodes)}}return t.trim()}if(e.length===0){return{scene:new THREE.Scene}}const mt=(new DOMParser).parseFromString(e,"application/xml");const pt=n(mt,"COLLADA")[0];const bt=mt.getElementsByTagName("parsererror")[0];if(bt!==undefined){const e=n(bt,"div")[0];let t;if(e){t=e.textContent}else{t=ht(bt)}console.error("THREE.ColladaLoader: Failed to parse collada file.\n",t);return null}const gt=pt.getAttribute("version");console.log("THREE.ColladaLoader: File version",gt);const yt=l(n(pt,"asset")[0]);const Et=new THREE.TextureLoader(this.manager);Et.setPath(this.resourcePath||t).setCrossOrigin(this.crossOrigin);let kt;if(THREE.TGALoader){kt=new THREE.TGALoader(this.manager);kt.setPath(this.resourcePath||t)}const Nt=[];let Tt={};let wt=0;const xt={animations:{},clips:{},controllers:{},images:{},effects:{},materials:{},cameras:{},lights:{},geometries:{},nodes:{},visualScenes:{},kinematicsModels:{},physicsModels:{},kinematicsScenes:{}};f(pt,"library_animations","animation",p);f(pt,"library_animation_clips","animation_clip",M);f(pt,"library_controllers","controller",I);f(pt,"library_images","image",V);f(pt,"library_effects","effect",W);f(pt,"library_materials","material",ie);f(pt,"library_cameras","camera",le);f(pt,"library_lights","light",pe);f(pt,"library_geometries","geometry",ke);f(pt,"library_nodes","node",Qe);f(pt,"library_visual_scenes","visual_scene",at);f(pt,"library_kinematics_models","kinematics_model",_e);f(pt,"library_physics_models","physics_model",Fe);f(pt,"scene","instance_kinematics_scene",Pe);h(xt.animations,y);h(xt.clips,L);h(xt.controllers,U);h(xt.images,P);h(xt.effects,se);h(xt.materials,ae);h(xt.cameras,he);h(xt.lights,ye);h(xt.geometries,Re);h(xt.visualScenes,ct);ft();Ge();const At=dt(n(pt,"scene")[0]);At.animations=Nt;if(yt.upAxis==="Z_UP"){At.quaternion.setFromEuler(new THREE.Euler(-Math.PI/2,0,0))}At.scale.multiplyScalar(yt.unit);return{get animations(){console.warn("THREE.ColladaLoader: Please access animations over scene.animations now.");return Nt},kinematics:Tt,library:xt,scene:At}}}THREE.ColladaLoader=e})();
//# sourceMappingURL=ColladaLoader.js.map