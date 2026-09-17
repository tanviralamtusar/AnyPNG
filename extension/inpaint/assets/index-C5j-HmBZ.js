var zm=Object.defineProperty;var Cm=(e,t,r)=>t in e?zm(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var er=(e,t,r)=>Cm(e,typeof t!="symbol"?t+"":t,r);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function r(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(n){if(n.ep)return;n.ep=!0;const i=r(n);fetch(n.href,i)}})();function Am(e){return createImageBitmap(e).then(t=>{const r=document.createElement("canvas");r.width=t.width,r.height=t.height;const a=r.getContext("2d");return a.drawImage(t,0,0),t.close(),a.getImageData(0,0,r.width,r.height)})}function xi(e,t){const r=new ImageData(t.width,t.height);for(let a=0;a<t.height;a++)r.data.set(e.data.slice(((t.y+a)*e.width+t.x)*4,((t.y+a)*e.width+t.x+t.width)*4),a*t.width*4);return r}function Om(e,t,r,a){const n=new ImageData(new Uint8ClampedArray(e.data),e.width,e.height);for(let i=0;i<a.height;i++)for(let s=0;s<a.width;s++){const u=(i*r.width+s)*4,d=r.data[u]/255,l=((a.y+i)*e.width+a.x+s)*4,c=(i*t.width+s)*4;if(!(d<=0))for(let f=0;f<3;f++)n.data[l+f]=Math.round(n.data[l+f]*(1-d)+t.data[c+f]*d)}return n}function Bm(e){const t=document.createElement("canvas");return t.width=e.width,t.height=e.height,t.getContext("2d").putImageData(e,0,0),t}/*!
 * ONNX Runtime Web v1.22.0-dev.20250409-89f8206ba4
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */var Ka=Object.defineProperty,Rm=Object.getOwnPropertyDescriptor,Mm=Object.getOwnPropertyNames,Dm=Object.prototype.hasOwnProperty,Nm=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(t,r)=>(typeof require<"u"?require:t)[r]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')}),U=(e,t)=>()=>(e&&(t=e(e=0)),t),Ft=(e,t)=>{for(var r in t)Ka(e,r,{get:t[r],enumerable:!0})},Pm=(e,t,r,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of Mm(t))!Dm.call(e,n)&&n!==r&&Ka(e,n,{get:()=>t[n],enumerable:!(a=Rm(t,n))||a.enumerable});return e},gr=e=>Pm(Ka({},"__esModule",{value:!0}),e),tr,bt,Vt,Ws,vd,xd=U(()=>{tr=new Map,bt=[],Vt=(e,t,r)=>{if(t&&typeof t.init=="function"&&typeof t.createInferenceSessionHandler=="function"){let a=tr.get(e);if(a===void 0)tr.set(e,{backend:t,priority:r});else{if(a.priority>r)return;if(a.priority===r&&a.backend!==t)throw new Error(`cannot register backend "${e}" using priority ${r}`)}if(r>=0){let n=bt.indexOf(e);n!==-1&&bt.splice(n,1);for(let i=0;i<bt.length;i++)if(tr.get(bt[i]).priority<=r){bt.splice(i,0,e);return}bt.push(e)}return}throw new TypeError("not a valid backend")},Ws=async e=>{let t=tr.get(e);if(!t)return"backend not found.";if(t.initialized)return t.backend;if(t.aborted)return t.error;{let r=!!t.initPromise;try{return r||(t.initPromise=t.backend.init(e)),await t.initPromise,t.initialized=!0,t.backend}catch(a){return r||(t.error=`${a}`,t.aborted=!0),t.error}finally{delete t.initPromise}}},vd=async e=>{let t=e.executionProviders||[],r=t.map(d=>typeof d=="string"?d:d.name),a=r.length===0?bt:r,n,i=[],s=new Set;for(let d of a){let l=await Ws(d);typeof l=="string"?i.push({name:d,err:l}):(n||(n=l),n===l&&s.add(d))}if(!n)throw new Error(`no available backend found. ERR: ${i.map(d=>`[${d.name}] ${d.err}`).join(", ")}`);for(let{name:d,err:l}of i)r.includes(d)&&console.warn(`removing requested execution provider "${d}" from session options because it is not available: ${l}`);let u=t.filter(d=>s.has(typeof d=="string"?d:d.name));return[n,new Proxy(e,{get:(d,l)=>l==="executionProviders"?u:Reflect.get(d,l)})]}}),Um=U(()=>{xd()}),Sd,qm=U(()=>{Sd="1.22.0-dev.20250409-89f8206ba4"}),Si,Ve,kd=U(()=>{qm(),Si="warning",Ve={wasm:{},webgl:{},webgpu:{},versions:{common:Sd},set logLevel(e){if(e!==void 0){if(typeof e!="string"||["verbose","info","warning","error","fatal"].indexOf(e)===-1)throw new Error(`Unsupported logging level: ${e}`);Si=e}},get logLevel(){return Si}},Object.defineProperty(Ve,"logLevel",{enumerable:!0})}),be,Wm=U(()=>{kd(),be=Ve}),Id,Td,Lm=U(()=>{Id=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas"):new OffscreenCanvas(1,1);r.width=e.dims[3],r.height=e.dims[2];let a=r.getContext("2d");if(a!=null){let n,i;(t==null?void 0:t.tensorLayout)!==void 0&&t.tensorLayout==="NHWC"?(n=e.dims[2],i=e.dims[3]):(n=e.dims[3],i=e.dims[2]);let s=(t==null?void 0:t.format)!==void 0?t.format:"RGB",u=t==null?void 0:t.norm,d,l;u===void 0||u.mean===void 0?d=[255,255,255,255]:typeof u.mean=="number"?d=[u.mean,u.mean,u.mean,u.mean]:(d=[u.mean[0],u.mean[1],u.mean[2],0],u.mean[3]!==void 0&&(d[3]=u.mean[3])),u===void 0||u.bias===void 0?l=[0,0,0,0]:typeof u.bias=="number"?l=[u.bias,u.bias,u.bias,u.bias]:(l=[u.bias[0],u.bias[1],u.bias[2],0],u.bias[3]!==void 0&&(l[3]=u.bias[3]));let c=i*n,f=0,h=c,g=c*2,_=-1;s==="RGBA"?(f=0,h=c,g=c*2,_=c*3):s==="RGB"?(f=0,h=c,g=c*2):s==="RBG"&&(f=0,g=c,h=c*2);for(let b=0;b<i;b++)for(let x=0;x<n;x++){let $=(e.data[f++]-l[0])*d[0],w=(e.data[h++]-l[1])*d[1],k=(e.data[g++]-l[2])*d[2],S=_===-1?255:(e.data[_++]-l[3])*d[3];a.fillStyle="rgba("+$+","+w+","+k+","+S+")",a.fillRect(x,b,1,1)}if("toDataURL"in r)return r.toDataURL();throw new Error("toDataURL is not supported")}else throw new Error("Can not access image data")},Td=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas").getContext("2d"):new OffscreenCanvas(1,1).getContext("2d"),a;if(r!=null){let n,i,s;(t==null?void 0:t.tensorLayout)!==void 0&&t.tensorLayout==="NHWC"?(n=e.dims[2],i=e.dims[1],s=e.dims[3]):(n=e.dims[3],i=e.dims[2],s=e.dims[1]);let u=t!==void 0&&t.format!==void 0?t.format:"RGB",d=t==null?void 0:t.norm,l,c;d===void 0||d.mean===void 0?l=[255,255,255,255]:typeof d.mean=="number"?l=[d.mean,d.mean,d.mean,d.mean]:(l=[d.mean[0],d.mean[1],d.mean[2],255],d.mean[3]!==void 0&&(l[3]=d.mean[3])),d===void 0||d.bias===void 0?c=[0,0,0,0]:typeof d.bias=="number"?c=[d.bias,d.bias,d.bias,d.bias]:(c=[d.bias[0],d.bias[1],d.bias[2],0],d.bias[3]!==void 0&&(c[3]=d.bias[3]));let f=i*n;if(t!==void 0&&(t.format!==void 0&&s===4&&t.format!=="RGBA"||s===3&&t.format!=="RGB"&&t.format!=="BGR"))throw new Error("Tensor format doesn't match input tensor dims");let h=4,g=0,_=1,b=2,x=3,$=0,w=f,k=f*2,S=-1;u==="RGBA"?($=0,w=f,k=f*2,S=f*3):u==="RGB"?($=0,w=f,k=f*2):u==="RBG"&&($=0,k=f,w=f*2),a=r.createImageData(n,i);for(let I=0;I<i*n;g+=h,_+=h,b+=h,x+=h,I++)a.data[g]=(e.data[$++]-c[0])*l[0],a.data[_]=(e.data[w++]-c[1])*l[1],a.data[b]=(e.data[k++]-c[2])*l[2],a.data[x]=S===-1?255:(e.data[S++]-c[3])*l[3]}else throw new Error("Can not access image data");return a}}),Cr,Ed,zd,Cd,Ad,Od,Vm=U(()=>{Za(),Cr=(e,t)=>{if(e===void 0)throw new Error("Image buffer must be defined");if(t.height===void 0||t.width===void 0)throw new Error("Image height and width must be defined");if(t.tensorLayout==="NHWC")throw new Error("NHWC Tensor layout is not supported yet");let{height:r,width:a}=t,n=t.norm??{mean:255,bias:0},i,s;typeof n.mean=="number"?i=[n.mean,n.mean,n.mean,n.mean]:i=[n.mean[0],n.mean[1],n.mean[2],n.mean[3]??255],typeof n.bias=="number"?s=[n.bias,n.bias,n.bias,n.bias]:s=[n.bias[0],n.bias[1],n.bias[2],n.bias[3]??0];let u=t.format!==void 0?t.format:"RGBA",d=t.tensorFormat!==void 0&&t.tensorFormat!==void 0?t.tensorFormat:"RGB",l=r*a,c=d==="RGBA"?new Float32Array(l*4):new Float32Array(l*3),f=4,h=0,g=1,_=2,b=3,x=0,$=l,w=l*2,k=-1;u==="RGB"&&(f=3,h=0,g=1,_=2,b=-1),d==="RGBA"?k=l*3:d==="RBG"?(x=0,w=l,$=l*2):d==="BGR"&&(w=0,$=l,x=l*2);for(let S=0;S<l;S++,h+=f,_+=f,g+=f,b+=f)c[x++]=(e[h]+s[0])/i[0],c[$++]=(e[g]+s[1])/i[1],c[w++]=(e[_]+s[2])/i[2],k!==-1&&b!==-1&&(c[k++]=(e[b]+s[3])/i[3]);return d==="RGBA"?new Pe("float32",c,[1,4,r,a]):new Pe("float32",c,[1,3,r,a])},Ed=async(e,t)=>{let r=typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement,a=typeof ImageData<"u"&&e instanceof ImageData,n=typeof ImageBitmap<"u"&&e instanceof ImageBitmap,i=typeof e=="string",s,u=t??{},d=()=>{if(typeof document<"u")return document.createElement("canvas");if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(1,1);throw new Error("Canvas is not supported")},l=c=>typeof HTMLCanvasElement<"u"&&c instanceof HTMLCanvasElement||c instanceof OffscreenCanvas?c.getContext("2d"):null;if(r){let c=d();c.width=e.width,c.height=e.height;let f=l(c);if(f!=null){let h=e.height,g=e.width;if(t!==void 0&&t.resizedHeight!==void 0&&t.resizedWidth!==void 0&&(h=t.resizedHeight,g=t.resizedWidth),t!==void 0){if(u=t,t.tensorFormat!==void 0)throw new Error("Image input config format must be RGBA for HTMLImageElement");u.tensorFormat="RGBA",u.height=h,u.width=g}else u.tensorFormat="RGBA",u.height=h,u.width=g;f.drawImage(e,0,0),s=f.getImageData(0,0,g,h).data}else throw new Error("Can not access image data")}else if(a){let c,f;if(t!==void 0&&t.resizedWidth!==void 0&&t.resizedHeight!==void 0?(c=t.resizedHeight,f=t.resizedWidth):(c=e.height,f=e.width),t!==void 0&&(u=t),u.format="RGBA",u.height=c,u.width=f,t!==void 0){let h=d();h.width=f,h.height=c;let g=l(h);if(g!=null)g.putImageData(e,0,0),s=g.getImageData(0,0,f,c).data;else throw new Error("Can not access image data")}else s=e.data}else if(n){if(t===void 0)throw new Error("Please provide image config with format for Imagebitmap");let c=d();c.width=e.width,c.height=e.height;let f=l(c);if(f!=null){let h=e.height,g=e.width;return f.drawImage(e,0,0,g,h),s=f.getImageData(0,0,g,h).data,u.height=h,u.width=g,Cr(s,u)}else throw new Error("Can not access image data")}else{if(i)return new Promise((c,f)=>{let h=d(),g=l(h);if(!e||!g)return f();let _=new Image;_.crossOrigin="Anonymous",_.src=e,_.onload=()=>{h.width=_.width,h.height=_.height,g.drawImage(_,0,0,h.width,h.height);let b=g.getImageData(0,0,h.width,h.height);u.height=h.height,u.width=h.width,c(Cr(b.data,u))}});throw new Error("Input data provided is not supported - aborted tensor creation")}if(s!==void 0)return Cr(s,u);throw new Error("Input data provided is not supported - aborted tensor creation")},zd=(e,t)=>{let{width:r,height:a,download:n,dispose:i}=t,s=[1,a,r,4];return new Pe({location:"texture",type:"float32",texture:e,dims:s,download:n,dispose:i})},Cd=(e,t)=>{let{dataType:r,dims:a,download:n,dispose:i}=t;return new Pe({location:"gpu-buffer",type:r??"float32",gpuBuffer:e,dims:a,download:n,dispose:i})},Ad=(e,t)=>{let{dataType:r,dims:a,download:n,dispose:i}=t;return new Pe({location:"ml-tensor",type:r??"float32",mlTensor:e,dims:a,download:n,dispose:i})},Od=(e,t,r)=>new Pe({location:"cpu-pinned",type:e,data:t,dims:r??[t.length]})}),At,pr,ki,Bd,jm=U(()=>{At=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],["int16",Int16Array],["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array],["int4",Uint8Array],["uint4",Uint8Array]]),pr=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],[Int16Array,"int16"],[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]),ki=!1,Bd=()=>{if(!ki){ki=!0;let e=typeof BigInt64Array<"u"&&BigInt64Array.from,t=typeof BigUint64Array<"u"&&BigUint64Array.from,r=globalThis.Float16Array,a=typeof r<"u"&&r.from;e&&(At.set("int64",BigInt64Array),pr.set(BigInt64Array,"int64")),t&&(At.set("uint64",BigUint64Array),pr.set(BigUint64Array,"uint64")),a?(At.set("float16",r),pr.set(r,"float16")):At.set("float16",Uint16Array)}}}),Rd,Md,Gm=U(()=>{Za(),Rd=e=>{let t=1;for(let r=0;r<e.length;r++){let a=e[r];if(typeof a!="number"||!Number.isSafeInteger(a))throw new TypeError(`dims[${r}] must be an integer, got: ${a}`);if(a<0)throw new RangeError(`dims[${r}] must be a non-negative integer, got: ${a}`);t*=a}return t},Md=(e,t)=>{switch(e.location){case"cpu":return new Pe(e.type,e.data,t);case"cpu-pinned":return new Pe({location:"cpu-pinned",data:e.data,type:e.type,dims:t});case"texture":return new Pe({location:"texture",texture:e.texture,type:e.type,dims:t});case"gpu-buffer":return new Pe({location:"gpu-buffer",gpuBuffer:e.gpuBuffer,type:e.type,dims:t});case"ml-tensor":return new Pe({location:"ml-tensor",mlTensor:e.mlTensor,type:e.type,dims:t});default:throw new Error(`tensorReshape: tensor location ${e.location} is not supported`)}}}),Pe,Za=U(()=>{Lm(),Vm(),jm(),Gm(),Pe=class{constructor(e,t,r){Bd();let a,n;if(typeof e=="object"&&"location"in e)switch(this.dataLocation=e.location,a=e.type,n=e.dims,e.location){case"cpu-pinned":{let s=At.get(a);if(!s)throw new TypeError(`unsupported type "${a}" to create tensor from pinned buffer`);if(!(e.data instanceof s))throw new TypeError(`buffer should be of type ${s.name}`);this.cpuData=e.data;break}case"texture":{if(a!=="float32")throw new TypeError(`unsupported type "${a}" to create tensor from texture`);this.gpuTextureData=e.texture,this.downloader=e.download,this.disposer=e.dispose;break}case"gpu-buffer":{if(a!=="float32"&&a!=="float16"&&a!=="int32"&&a!=="int64"&&a!=="uint32"&&a!=="uint8"&&a!=="bool"&&a!=="uint4"&&a!=="int4")throw new TypeError(`unsupported type "${a}" to create tensor from gpu buffer`);this.gpuBufferData=e.gpuBuffer,this.downloader=e.download,this.disposer=e.dispose;break}case"ml-tensor":{if(a!=="float32"&&a!=="float16"&&a!=="int32"&&a!=="int64"&&a!=="uint32"&&a!=="uint64"&&a!=="int8"&&a!=="uint8"&&a!=="bool"&&a!=="uint4"&&a!=="int4")throw new TypeError(`unsupported type "${a}" to create tensor from MLTensor`);this.mlTensorData=e.mlTensor,this.downloader=e.download,this.disposer=e.dispose;break}default:throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`)}else{let s,u;if(typeof e=="string")if(a=e,u=r,e==="string"){if(!Array.isArray(t))throw new TypeError("A string tensor's data must be a string array.");s=t}else{let d=At.get(e);if(d===void 0)throw new TypeError(`Unsupported tensor type: ${e}.`);if(Array.isArray(t)){if(e==="float16"&&d===Uint16Array||e==="uint4"||e==="int4")throw new TypeError(`Creating a ${e} tensor from number array is not supported. Please use ${d.name} as data.`);e==="uint64"||e==="int64"?s=d.from(t,BigInt):s=d.from(t)}else if(t instanceof d)s=t;else if(t instanceof Uint8ClampedArray)if(e==="uint8")s=Uint8Array.from(t);else throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");else if(e==="float16"&&t instanceof Uint16Array&&d!==Uint16Array)s=new globalThis.Float16Array(t.buffer,t.byteOffset,t.length);else throw new TypeError(`A ${a} tensor's data must be type of ${d}`)}else if(u=t,Array.isArray(e)){if(e.length===0)throw new TypeError("Tensor type cannot be inferred from an empty array.");let d=typeof e[0];if(d==="string")a="string",s=e;else if(d==="boolean")a="bool",s=Uint8Array.from(e);else throw new TypeError(`Invalid element type of data array: ${d}.`)}else if(e instanceof Uint8ClampedArray)a="uint8",s=Uint8Array.from(e);else{let d=pr.get(e.constructor);if(d===void 0)throw new TypeError(`Unsupported type for tensor data: ${e.constructor}.`);a=d,s=e}if(u===void 0)u=[s.length];else if(!Array.isArray(u))throw new TypeError("A tensor's dims must be a number array");n=u,this.cpuData=s,this.dataLocation="cpu"}let i=Rd(n);if(this.cpuData&&i!==this.cpuData.length&&!((a==="uint4"||a==="int4")&&Math.ceil(i/2)===this.cpuData.length))throw new Error(`Tensor's size(${i}) does not match data length(${this.cpuData.length}).`);this.type=a,this.dims=n,this.size=i}static async fromImage(e,t){return Ed(e,t)}static fromTexture(e,t){return zd(e,t)}static fromGpuBuffer(e,t){return Cd(e,t)}static fromMLTensor(e,t){return Ad(e,t)}static fromPinnedBuffer(e,t,r){return Od(e,t,r)}toDataURL(e){return Id(this,e)}toImageData(e){return Td(this,e)}get data(){if(this.ensureValid(),!this.cpuData)throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw new Error("The data is not stored as a WebGL texture.");return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw new Error("The data is not stored as a WebGPU buffer.");return this.gpuBufferData}get mlTensor(){if(this.ensureValid(),!this.mlTensorData)throw new Error("The data is not stored as a WebNN MLTensor.");return this.mlTensorData}async getData(e){switch(this.ensureValid(),this.dataLocation){case"cpu":case"cpu-pinned":return this.data;case"texture":case"gpu-buffer":case"ml-tensor":{if(!this.downloader)throw new Error("The current tensor is not created with a specified data downloader.");if(this.isDownloading)throw new Error("The current tensor is being downloaded.");try{this.isDownloading=!0;let t=await this.downloader();return this.downloader=void 0,this.dataLocation="cpu",this.cpuData=t,e&&this.disposer&&(this.disposer(),this.disposer=void 0),t}finally{this.isDownloading=!1}}default:throw new Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.isDownloading)throw new Error("The current tensor is being downloaded.");this.disposer&&(this.disposer(),this.disposer=void 0),this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.mlTensorData=void 0,this.downloader=void 0,this.isDownloading=void 0,this.dataLocation="none"}ensureValid(){if(this.dataLocation==="none")throw new Error("The tensor is disposed.")}reshape(e){if(this.ensureValid(),this.downloader||this.disposer)throw new Error("Cannot reshape a tensor that owns GPU resource.");return Md(this,e)}}}),je,Dd=U(()=>{Za(),je=Pe}),Hr,Ii,st,Ye,Nd=U(()=>{kd(),Hr=(e,t)=>{(typeof Ve.trace>"u"?!Ve.wasm.trace:!Ve.trace)||console.timeStamp(`${e}::ORT::${t}`)},Ii=(e,t)=>{var n;let r=((n=new Error().stack)==null?void 0:n.split(/\r\n|\r|\n/g))||[],a=!1;for(let i=0;i<r.length;i++){if(a&&!r[i].includes("TRACE_FUNC")){let s=`FUNC_${e}::${r[i].trim().split(" ")[1]}`;t&&(s+=`::${t}`),Hr("CPU",s);return}r[i].includes("TRACE_FUNC")&&(a=!0)}},st=e=>{(typeof Ve.trace>"u"?!Ve.wasm.trace:!Ve.trace)||Ii("BEGIN",e)},Ye=e=>{(typeof Ve.trace>"u"?!Ve.wasm.trace:!Ve.trace)||Ii("END",e)}}),Pd,Hm=U(()=>{xd(),Dd(),Nd(),Pd=class Ud{constructor(t){this.handler=t}async run(t,r,a){st();let n={},i={};if(typeof t!="object"||t===null||t instanceof je||Array.isArray(t))throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");let s=!0;if(typeof r=="object"){if(r===null)throw new TypeError("Unexpected argument[1]: cannot be null.");if(r instanceof je)throw new TypeError("'fetches' cannot be a Tensor");if(Array.isArray(r)){if(r.length===0)throw new TypeError("'fetches' cannot be an empty array.");s=!1;for(let l of r){if(typeof l!="string")throw new TypeError("'fetches' must be a string array or an object.");if(this.outputNames.indexOf(l)===-1)throw new RangeError(`'fetches' contains invalid output name: ${l}.`);n[l]=null}if(typeof a=="object"&&a!==null)i=a;else if(typeof a<"u")throw new TypeError("'options' must be an object.")}else{let l=!1,c=Object.getOwnPropertyNames(r);for(let f of this.outputNames)if(c.indexOf(f)!==-1){let h=r[f];(h===null||h instanceof je)&&(l=!0,s=!1,n[f]=h)}if(l){if(typeof a=="object"&&a!==null)i=a;else if(typeof a<"u")throw new TypeError("'options' must be an object.")}else i=r}}else if(typeof r<"u")throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");for(let l of this.inputNames)if(typeof t[l]>"u")throw new Error(`input '${l}' is missing in 'feeds'.`);if(s)for(let l of this.outputNames)n[l]=null;let u=await this.handler.run(t,n,i),d={};for(let l in u)if(Object.hasOwnProperty.call(u,l)){let c=u[l];c instanceof je?d[l]=c:d[l]=new je(c.type,c.data,c.dims)}return Ye(),d}async release(){return this.handler.dispose()}static async create(t,r,a,n){st();let i,s={};if(typeof t=="string"){if(i=t,typeof r=="object"&&r!==null)s=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof Uint8Array){if(i=t,typeof r=="object"&&r!==null)s=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof ArrayBuffer||typeof SharedArrayBuffer<"u"&&t instanceof SharedArrayBuffer){let c=t,f=0,h=t.byteLength;if(typeof r=="object"&&r!==null)s=r;else if(typeof r=="number"){if(f=r,!Number.isSafeInteger(f))throw new RangeError("'byteOffset' must be an integer.");if(f<0||f>=c.byteLength)throw new RangeError(`'byteOffset' is out of range [0, ${c.byteLength}).`);if(h=t.byteLength-f,typeof a=="number"){if(h=a,!Number.isSafeInteger(h))throw new RangeError("'byteLength' must be an integer.");if(h<=0||f+h>c.byteLength)throw new RangeError(`'byteLength' is out of range (0, ${c.byteLength-f}].`);if(typeof n=="object"&&n!==null)s=n;else if(typeof n<"u")throw new TypeError("'options' must be an object.")}else if(typeof a<"u")throw new TypeError("'byteLength' must be a number.")}else if(typeof r<"u")throw new TypeError("'options' must be an object.");i=new Uint8Array(c,f,h)}else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let[u,d]=await vd(s),l=await u.createInferenceSessionHandler(i,d);return Ye(),new Ud(l)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}get inputMetadata(){return this.handler.inputMetadata}get outputMetadata(){return this.handler.outputMetadata}}}),Qa,Fm=U(()=>{Hm(),Qa=Pd}),Km=U(()=>{}),Zm=U(()=>{}),Qm=U(()=>{}),Xm=U(()=>{}),Ym={};Ft(Ym,{InferenceSession:()=>Qa,TRACE:()=>Hr,TRACE_FUNC_BEGIN:()=>st,TRACE_FUNC_END:()=>Ye,Tensor:()=>je,env:()=>be,registerBackend:()=>Vt});var et=U(()=>{Um(),Wm(),Fm(),Dd(),Km(),Zm(),Nd(),Qm(),Xm()}),Xa=U(()=>{}),qd={};Ft(qd,{default:()=>Wd});var Ti,Ei,Wd,Jm=U(()=>{var e;Ff(),Nt(),Ya(),Ti="ort-wasm-proxy-worker",Ei=((e=globalThis.self)==null?void 0:e.name)===Ti,Ei&&(self.onmessage=t=>{let{type:r,in:a}=t.data;try{switch(r){case"init-wasm":Ja(a.wasm).then(()=>{yn(a).then(()=>{postMessage({type:r})},n=>{postMessage({type:r,err:n})})},n=>{postMessage({type:r,err:n})});break;case"init-ep":{let{epName:n,env:i}=a;bn(i,n).then(()=>{postMessage({type:r})},s=>{postMessage({type:r,err:s})});break}case"copy-from":{let{buffer:n}=a,i=Jr(n);postMessage({type:r,out:i});break}case"create":{let{model:n,options:i}=a;wn(n,i).then(s=>{postMessage({type:r,out:s})},s=>{postMessage({type:r,err:s})});break}case"release":$n(a),postMessage({type:r});break;case"run":{let{sessionId:n,inputIndices:i,inputs:s,outputIndices:u,options:d}=a;vn(n,i,s,u,new Array(u.length).fill(null),d).then(l=>{l.some(c=>c[3]!=="cpu")?postMessage({type:r,err:"Proxy does not support non-cpu tensor location."}):postMessage({type:r,out:l},Sn([...s,...l]))},l=>{postMessage({type:r,err:l})});break}case"end-profiling":xn(a),postMessage({type:r});break;default:}}catch(n){postMessage({type:r,err:n})}}),Wd=Ei?null:t=>new Worker(t??Ne,{type:"module",name:Ti})}),Ld={};Ft(Ld,{default:()=>Vd});var zi,Ci,Vd,Ls,eg=U(()=>{var e,t;Ci=(zi=import.meta.url,async function(r={}){var qs;var a,n,i=r,s=new Promise((o,p)=>{a=o,n=p}),u=typeof window=="object",d=typeof WorkerGlobalScope<"u",l=d&&((qs=self.name)==null?void 0:qs.startsWith("em-pthread"));i.mountExternalData=(o,p)=>{o.startsWith("./")&&(o=o.substring(2)),(i.Eb||(i.Eb=new Map)).set(o,p)},i.unmountExternalData=()=>{delete i.Eb};var c=globalThis.SharedArrayBuffer??new WebAssembly.Memory({initial:0,maximum:0,pc:!0}).buffer.constructor;let f=o=>async(...p)=>{var m;try{if(i.Fb)throw Error("Session already started");let y=i.Fb={dc:p[0],errors:[]},v=await o(...p);if(i.Fb!==y)throw Error("Session mismatch");(m=i.Jb)==null||m.flush();let T=y.errors;if(0<T.length){let B=await Promise.all(T);if(B=B.filter(N=>N),0<B.length)throw Error(B.join(`
`))}return v}finally{i.Fb=null}};i.jsepInit=(o,p)=>{if(o==="webgpu"){[i.Jb,i.Ub,i.Yb,i.Kb,i.Xb,i.jb,i.Zb,i.ac,i.Vb,i.Wb,i.$b]=p;let m=i.Jb;i.jsepRegisterBuffer=(y,v,T,B)=>m.registerBuffer(y,v,T,B),i.jsepGetBuffer=y=>m.getBuffer(y),i.jsepCreateDownloader=(y,v,T)=>m.createDownloader(y,v,T),i.jsepOnCreateSession=y=>{m.onCreateSession(y)},i.jsepOnReleaseSession=y=>{m.onReleaseSession(y)},i.jsepOnRunStart=y=>m.onRunStart(y),i.bc=(y,v)=>{m.upload(y,v)}}else if(o==="webnn"){let m=p[0];[i.nc,i.Nb,i.webnnEnsureTensor,i.Ob,i.webnnDownloadTensor]=p.slice(1),i.webnnReleaseTensorId=i.Nb,i.webnnUploadTensor=i.Ob,i.webnnOnRunStart=y=>m.onRunStart(y),i.webnnOnRunEnd=m.onRunEnd.bind(m),i.webnnRegisterMLContext=(y,v)=>{m.registerMLContext(y,v)},i.webnnOnReleaseSession=y=>{m.onReleaseSession(y)},i.webnnCreateMLTensorDownloader=(y,v)=>m.createMLTensorDownloader(y,v),i.webnnRegisterMLTensor=(y,v,T,B)=>m.registerMLTensor(y,v,T,B),i.webnnCreateMLContext=y=>m.createMLContext(y),i.webnnRegisterMLConstant=(y,v,T,B,N,V)=>m.registerMLConstant(y,v,T,B,N,i.Eb,V),i.webnnRegisterGraphInput=m.registerGraphInput.bind(m),i.webnnIsGraphInput=m.isGraphInput.bind(m),i.webnnCreateTemporaryTensor=m.createTemporaryTensor.bind(m),i.webnnIsInt64Supported=m.isInt64Supported.bind(m)}};let h=()=>{let o=(p,m,y)=>(...v)=>{let T=it,B=m==null?void 0:m();v=p(...v);let N=m==null?void 0:m();return B!==N&&(p=N,y(B),m=y=null),it!=T?new Promise((V,Q)=>{mi={resolve:V,reject:Q}}):v};(()=>{for(let p of["_OrtAppendExecutionProvider","_OrtCreateSession","_OrtRun","_OrtRunWithBinding","_OrtBindInput"])i[p]=o(i[p],()=>i[p],m=>i[p]=m)})(),f!==void 0&&(i._OrtRun=f(i._OrtRun),i._OrtRunWithBinding=f(i._OrtRunWithBinding)),h=void 0};i.asyncInit=()=>{h==null||h()};var g,_,b=Object.assign({},i),x=(o,p)=>{throw p},$="";(u||d)&&(d?$=self.location.href:typeof document<"u"&&document.currentScript&&($=document.currentScript.src),zi&&($=zi),$=$.startsWith("blob:")?"":$.slice(0,$.replace(/[?#].*/,"").lastIndexOf("/")+1),d&&(_=o=>{var p=new XMLHttpRequest;return p.open("GET",o,!1),p.responseType="arraybuffer",p.send(null),new Uint8Array(p.response)}),g=async o=>{if(M(o))return new Promise((m,y)=>{var v=new XMLHttpRequest;v.open("GET",o,!0),v.responseType="arraybuffer",v.onload=()=>{v.status==200||v.status==0&&v.response?m(v.response):y(v.status)},v.onerror=y,v.send(null)});var p=await fetch(o,{credentials:"same-origin"});if(p.ok)return p.arrayBuffer();throw Error(p.status+" : "+p.url)});var w=console.log.bind(console),k=console.error.bind(console),S=w,I=k;Object.assign(i,b),b=null;var E,z,A,O,q,K,W,Z,ue,ee,j,L,de,te=i.wasmBinary,ae=!1,M=o=>o.startsWith("file://");function P(){return E.buffer!=O.buffer&&he(),O}function G(){return E.buffer!=O.buffer&&he(),q}function oe(){return E.buffer!=O.buffer&&he(),K}function Ie(){return E.buffer!=O.buffer&&he(),W}function D(){return E.buffer!=O.buffer&&he(),Z}function ge(){return E.buffer!=O.buffer&&he(),ue}function We(){return E.buffer!=O.buffer&&he(),ee}function Be(){return E.buffer!=O.buffer&&he(),de}if(l){let o=function(p){try{var m=p.data,y=m.Bb;if(y==="load"){let v=[];self.onmessage=T=>v.push(T),self.startWorker=()=>{postMessage({Bb:"loaded"});for(let T of v)o(T);self.onmessage=o};for(let T of m.Rb)i[T]&&!i[T].proxy||(i[T]=(...B)=>{postMessage({Bb:"callHandler",Qb:T,args:B})},T=="print"&&(S=i[T]),T=="printErr"&&(I=i[T]));E=m.kc,he(),St(m.lc)}else if(y==="run"){ch(m.Ab),bi(m.Ab,0,0,1,0,0),Rn(),fi(m.Ab),Se||(Es(),Se=!0);try{fh(m.fc,m.Hb)}catch(v){if(v!="unwind")throw v}}else m.target!=="setimmediate"&&(y==="checkMailbox"?Se&&br():y&&(I(`worker: received unknown command ${y}`),I(m)))}catch(v){throw zs(),v}};var St,Se=!1;I=function(...p){p=p.join(" "),console.error(p)},self.alert=function(...p){postMessage({Bb:"alert",text:p.join(" "),ic:Tr()})},self.onunhandledrejection=p=>{throw p.reason||p},self.onmessage=o}function he(){var o=E.buffer;i.HEAP8=O=new Int8Array(o),i.HEAP16=K=new Int16Array(o),i.HEAPU8=q=new Uint8Array(o),i.HEAPU16=W=new Uint16Array(o),i.HEAP32=Z=new Int32Array(o),i.HEAPU32=ue=new Uint32Array(o),i.HEAPF32=ee=new Float32Array(o),i.HEAPF64=de=new Float64Array(o),i.HEAP64=j=new BigInt64Array(o),i.HEAPU64=L=new BigUint64Array(o)}function tt(){l?startWorker(i):Y.Ca()}l||(E=new WebAssembly.Memory({initial:256,maximum:65536,shared:!0}),he());var Zt,kt=0,Qt=null;function Tn(){if(--kt==0&&Qt){var o=Qt;Qt=null,o()}}function ft(o){throw I(o="Aborted("+o+")"),ae=!0,o=new WebAssembly.RuntimeError(o+". Build with -sASSERTIONS for more info."),n(o),o}function En(){return{a:{L:ph,Aa:dh,b:mh,$:Pn,A:Wn,pa:Ln,X:jn,Z:Gn,qa:Hn,na:Fn,ga:Kn,ma:Zn,J:Qn,Y:Xn,V:Yn,oa:Jn,W:es,va:gh,E:_h,Q:yh,O:wh,D:vh,u:xh,r:Sh,P:kh,z:Oh,R:Bh,ja:Rh,T:Mh,aa:Dh,M:Nh,F:Ph,ia:fi,sa:Uh,t:qh,Ba:Wh,w:jh,o:Gh,l:Fh,c:di,n:Kh,j:Xh,v:Yh,p:Jh,f:em,s:tm,m:rm,e:im,k:am,i:nm,g:sm,d:om,da:um,ea:lm,fa:dm,ba:hs,ca:ms,N:gs,xa:cm,ua:hm,h:mm,C:gm,G:_m,ta:fm,x:ym,ra:bm,U:wm,q:pm,y:$m,K:vm,S:xm,za:Sm,ya:km,ka:ws,la:$s,_:si,B:vs,I:xs,ha:Ss,H:ks,a:E,wa:ni}}}var ri={829644:(o,p,m,y,v)=>{if(i===void 0||!i.Eb)return 1;if((o=xe(Number(o>>>0))).startsWith("./")&&(o=o.substring(2)),!(o=i.Eb.get(o)))return 2;if(p=Number(p>>>0),m=Number(m>>>0),y=Number(y>>>0),p+m>o.byteLength)return 3;try{let T=o.subarray(p,p+m);switch(v){case 0:G().set(T,y>>>0);break;case 1:i.mc?i.mc(y,T):i.bc(y,T);break;default:return 4}return 0}catch{return 4}},830468:(o,p,m)=>{i.Ob(o,G().subarray(p>>>0,p+m>>>0))},830532:()=>i.nc(),830574:o=>{i.Nb(o)},830611:()=>{i.Vb()},830642:()=>{i.Wb()},830671:()=>{i.$b()},830696:o=>i.Ub(o),830729:o=>i.Yb(o),830761:(o,p,m)=>{i.Kb(Number(o),Number(p),Number(m),!0)},830824:(o,p,m)=>{i.Kb(Number(o),Number(p),Number(m))},830881:()=>typeof wasmOffsetConverter<"u",830938:o=>{i.jb("Abs",o,void 0)},830989:o=>{i.jb("Neg",o,void 0)},831040:o=>{i.jb("Floor",o,void 0)},831093:o=>{i.jb("Ceil",o,void 0)},831145:o=>{i.jb("Reciprocal",o,void 0)},831203:o=>{i.jb("Sqrt",o,void 0)},831255:o=>{i.jb("Exp",o,void 0)},831306:o=>{i.jb("Erf",o,void 0)},831357:o=>{i.jb("Sigmoid",o,void 0)},831412:(o,p,m)=>{i.jb("HardSigmoid",o,{alpha:p,beta:m})},831491:o=>{i.jb("Log",o,void 0)},831542:o=>{i.jb("Sin",o,void 0)},831593:o=>{i.jb("Cos",o,void 0)},831644:o=>{i.jb("Tan",o,void 0)},831695:o=>{i.jb("Asin",o,void 0)},831747:o=>{i.jb("Acos",o,void 0)},831799:o=>{i.jb("Atan",o,void 0)},831851:o=>{i.jb("Sinh",o,void 0)},831903:o=>{i.jb("Cosh",o,void 0)},831955:o=>{i.jb("Asinh",o,void 0)},832008:o=>{i.jb("Acosh",o,void 0)},832061:o=>{i.jb("Atanh",o,void 0)},832114:o=>{i.jb("Tanh",o,void 0)},832166:o=>{i.jb("Not",o,void 0)},832217:(o,p,m)=>{i.jb("Clip",o,{min:p,max:m})},832286:o=>{i.jb("Clip",o,void 0)},832338:(o,p)=>{i.jb("Elu",o,{alpha:p})},832396:o=>{i.jb("Gelu",o,void 0)},832448:o=>{i.jb("Relu",o,void 0)},832500:(o,p)=>{i.jb("LeakyRelu",o,{alpha:p})},832564:(o,p)=>{i.jb("ThresholdedRelu",o,{alpha:p})},832634:(o,p)=>{i.jb("Cast",o,{to:p})},832692:o=>{i.jb("Add",o,void 0)},832743:o=>{i.jb("Sub",o,void 0)},832794:o=>{i.jb("Mul",o,void 0)},832845:o=>{i.jb("Div",o,void 0)},832896:o=>{i.jb("Pow",o,void 0)},832947:o=>{i.jb("Equal",o,void 0)},833e3:o=>{i.jb("Greater",o,void 0)},833055:o=>{i.jb("GreaterOrEqual",o,void 0)},833117:o=>{i.jb("Less",o,void 0)},833169:o=>{i.jb("LessOrEqual",o,void 0)},833228:(o,p,m,y,v)=>{i.jb("ReduceMean",o,{keepDims:!!p,noopWithEmptyAxes:!!m,axes:y?Array.from(D().subarray(Number(y)>>>0,Number(v)>>>0)):[]})},833403:(o,p,m,y,v)=>{i.jb("ReduceMax",o,{keepDims:!!p,noopWithEmptyAxes:!!m,axes:y?Array.from(D().subarray(Number(y)>>>0,Number(v)>>>0)):[]})},833577:(o,p,m,y,v)=>{i.jb("ReduceMin",o,{keepDims:!!p,noopWithEmptyAxes:!!m,axes:y?Array.from(D().subarray(Number(y)>>>0,Number(v)>>>0)):[]})},833751:(o,p,m,y,v)=>{i.jb("ReduceProd",o,{keepDims:!!p,noopWithEmptyAxes:!!m,axes:y?Array.from(D().subarray(Number(y)>>>0,Number(v)>>>0)):[]})},833926:(o,p,m,y,v)=>{i.jb("ReduceSum",o,{keepDims:!!p,noopWithEmptyAxes:!!m,axes:y?Array.from(D().subarray(Number(y)>>>0,Number(v)>>>0)):[]})},834100:(o,p,m,y,v)=>{i.jb("ReduceL1",o,{keepDims:!!p,noopWithEmptyAxes:!!m,axes:y?Array.from(D().subarray(Number(y)>>>0,Number(v)>>>0)):[]})},834273:(o,p,m,y,v)=>{i.jb("ReduceL2",o,{keepDims:!!p,noopWithEmptyAxes:!!m,axes:y?Array.from(D().subarray(Number(y)>>>0,Number(v)>>>0)):[]})},834446:(o,p,m,y,v)=>{i.jb("ReduceLogSum",o,{keepDims:!!p,noopWithEmptyAxes:!!m,axes:y?Array.from(D().subarray(Number(y)>>>0,Number(v)>>>0)):[]})},834623:(o,p,m,y,v)=>{i.jb("ReduceSumSquare",o,{keepDims:!!p,noopWithEmptyAxes:!!m,axes:y?Array.from(D().subarray(Number(y)>>>0,Number(v)>>>0)):[]})},834803:(o,p,m,y,v)=>{i.jb("ReduceLogSumExp",o,{keepDims:!!p,noopWithEmptyAxes:!!m,axes:y?Array.from(D().subarray(Number(y)>>>0,Number(v)>>>0)):[]})},834983:o=>{i.jb("Where",o,void 0)},835036:(o,p,m)=>{i.jb("Transpose",o,{perm:p?Array.from(D().subarray(Number(p)>>>0,Number(m)>>>0)):[]})},835160:(o,p,m,y)=>{i.jb("DepthToSpace",o,{blocksize:p,mode:xe(m),format:y?"NHWC":"NCHW"})},835293:(o,p,m,y)=>{i.jb("DepthToSpace",o,{blocksize:p,mode:xe(m),format:y?"NHWC":"NCHW"})},835426:(o,p,m,y,v,T,B,N,V,Q,ne,pe,_e,ze,qt)=>{i.jb("ConvTranspose",o,{format:V?"NHWC":"NCHW",autoPad:p,dilations:[m],group:y,kernelShape:[v],pads:[T,B],strides:[N],wIsConst:()=>!!P()[Q>>>0],outputPadding:ne?Array.from(D().subarray(Number(ne)>>>0,Number(pe)>>>0)):[],outputShape:_e?Array.from(D().subarray(Number(_e)>>>0,Number(ze)>>>0)):[],activation:xe(qt)})},835859:(o,p,m,y,v,T,B,N,V,Q,ne,pe,_e,ze)=>{i.jb("ConvTranspose",o,{format:N?"NHWC":"NCHW",autoPad:p,dilations:Array.from(D().subarray(Number(m)>>>0,2+(Number(m)>>>0)>>>0)),group:y,kernelShape:Array.from(D().subarray(Number(v)>>>0,2+(Number(v)>>>0)>>>0)),pads:Array.from(D().subarray(Number(T)>>>0,4+(Number(T)>>>0)>>>0)),strides:Array.from(D().subarray(Number(B)>>>0,2+(Number(B)>>>0)>>>0)),wIsConst:()=>!!P()[V>>>0],outputPadding:Q?Array.from(D().subarray(Number(Q)>>>0,Number(ne)>>>0)):[],outputShape:pe?Array.from(D().subarray(Number(pe)>>>0,Number(_e)>>>0)):[],activation:xe(ze)})},836520:(o,p,m,y,v,T,B,N,V,Q,ne,pe,_e,ze,qt)=>{i.jb("ConvTranspose",o,{format:V?"NHWC":"NCHW",autoPad:p,dilations:[m],group:y,kernelShape:[v],pads:[T,B],strides:[N],wIsConst:()=>!!P()[Q>>>0],outputPadding:ne?Array.from(D().subarray(Number(ne)>>>0,Number(pe)>>>0)):[],outputShape:_e?Array.from(D().subarray(Number(_e)>>>0,Number(ze)>>>0)):[],activation:xe(qt)})},836953:(o,p,m,y,v,T,B,N,V,Q,ne,pe,_e,ze)=>{i.jb("ConvTranspose",o,{format:N?"NHWC":"NCHW",autoPad:p,dilations:Array.from(D().subarray(Number(m)>>>0,2+(Number(m)>>>0)>>>0)),group:y,kernelShape:Array.from(D().subarray(Number(v)>>>0,2+(Number(v)>>>0)>>>0)),pads:Array.from(D().subarray(Number(T)>>>0,4+(Number(T)>>>0)>>>0)),strides:Array.from(D().subarray(Number(B)>>>0,2+(Number(B)>>>0)>>>0)),wIsConst:()=>!!P()[V>>>0],outputPadding:Q?Array.from(D().subarray(Number(Q)>>>0,Number(ne)>>>0)):[],outputShape:pe?Array.from(D().subarray(Number(pe)>>>0,Number(_e)>>>0)):[],activation:xe(ze)})},837614:(o,p)=>{i.jb("GlobalAveragePool",o,{format:p?"NHWC":"NCHW"})},837705:(o,p,m,y,v,T,B,N,V,Q,ne,pe,_e,ze)=>{i.jb("AveragePool",o,{format:ze?"NHWC":"NCHW",auto_pad:p,ceil_mode:m,count_include_pad:y,storage_order:v,dilations:T?Array.from(D().subarray(Number(T)>>>0,Number(B)>>>0)):[],kernel_shape:N?Array.from(D().subarray(Number(N)>>>0,Number(V)>>>0)):[],pads:Q?Array.from(D().subarray(Number(Q)>>>0,Number(ne)>>>0)):[],strides:pe?Array.from(D().subarray(Number(pe)>>>0,Number(_e)>>>0)):[]})},838184:(o,p)=>{i.jb("GlobalAveragePool",o,{format:p?"NHWC":"NCHW"})},838275:(o,p,m,y,v,T,B,N,V,Q,ne,pe,_e,ze)=>{i.jb("AveragePool",o,{format:ze?"NHWC":"NCHW",auto_pad:p,ceil_mode:m,count_include_pad:y,storage_order:v,dilations:T?Array.from(D().subarray(Number(T)>>>0,Number(B)>>>0)):[],kernel_shape:N?Array.from(D().subarray(Number(N)>>>0,Number(V)>>>0)):[],pads:Q?Array.from(D().subarray(Number(Q)>>>0,Number(ne)>>>0)):[],strides:pe?Array.from(D().subarray(Number(pe)>>>0,Number(_e)>>>0)):[]})},838754:(o,p)=>{i.jb("GlobalMaxPool",o,{format:p?"NHWC":"NCHW"})},838841:(o,p,m,y,v,T,B,N,V,Q,ne,pe,_e,ze)=>{i.jb("MaxPool",o,{format:ze?"NHWC":"NCHW",auto_pad:p,ceil_mode:m,count_include_pad:y,storage_order:v,dilations:T?Array.from(D().subarray(Number(T)>>>0,Number(B)>>>0)):[],kernel_shape:N?Array.from(D().subarray(Number(N)>>>0,Number(V)>>>0)):[],pads:Q?Array.from(D().subarray(Number(Q)>>>0,Number(ne)>>>0)):[],strides:pe?Array.from(D().subarray(Number(pe)>>>0,Number(_e)>>>0)):[]})},839316:(o,p)=>{i.jb("GlobalMaxPool",o,{format:p?"NHWC":"NCHW"})},839403:(o,p,m,y,v,T,B,N,V,Q,ne,pe,_e,ze)=>{i.jb("MaxPool",o,{format:ze?"NHWC":"NCHW",auto_pad:p,ceil_mode:m,count_include_pad:y,storage_order:v,dilations:T?Array.from(D().subarray(Number(T)>>>0,Number(B)>>>0)):[],kernel_shape:N?Array.from(D().subarray(Number(N)>>>0,Number(V)>>>0)):[],pads:Q?Array.from(D().subarray(Number(Q)>>>0,Number(ne)>>>0)):[],strides:pe?Array.from(D().subarray(Number(pe)>>>0,Number(_e)>>>0)):[]})},839878:(o,p,m,y,v)=>{i.jb("Gemm",o,{alpha:p,beta:m,transA:y,transB:v})},839982:o=>{i.jb("MatMul",o,void 0)},840036:(o,p,m,y)=>{i.jb("ArgMax",o,{keepDims:!!p,selectLastIndex:!!m,axis:y})},840144:(o,p,m,y)=>{i.jb("ArgMin",o,{keepDims:!!p,selectLastIndex:!!m,axis:y})},840252:(o,p)=>{i.jb("Softmax",o,{axis:p})},840315:(o,p)=>{i.jb("Concat",o,{axis:p})},840375:(o,p,m,y,v)=>{i.jb("Split",o,{axis:p,numOutputs:m,splitSizes:y?Array.from(D().subarray(Number(y)>>>0,Number(v)>>>0)):[]})},840531:o=>{i.jb("Expand",o,void 0)},840585:(o,p)=>{i.jb("Gather",o,{axis:Number(p)})},840656:(o,p)=>{i.jb("GatherElements",o,{axis:Number(p)})},840735:(o,p)=>{i.jb("GatherND",o,{batch_dims:Number(p)})},840814:(o,p,m,y,v,T,B,N,V,Q,ne)=>{i.jb("Resize",o,{antialias:p,axes:m?Array.from(D().subarray(Number(m)>>>0,Number(y)>>>0)):[],coordinateTransformMode:xe(v),cubicCoeffA:T,excludeOutside:B,extrapolationValue:N,keepAspectRatioPolicy:xe(V),mode:xe(Q),nearestMode:xe(ne)})},841176:(o,p,m,y,v,T,B)=>{i.jb("Slice",o,{starts:p?Array.from(D().subarray(Number(p)>>>0,Number(m)>>>0)):[],ends:y?Array.from(D().subarray(Number(y)>>>0,Number(v)>>>0)):[],axes:T?Array.from(D().subarray(Number(T)>>>0,Number(B)>>>0)):[]})},841440:o=>{i.jb("Tile",o,void 0)},841492:(o,p,m)=>{i.jb("InstanceNormalization",o,{epsilon:p,format:m?"NHWC":"NCHW"})},841606:(o,p,m)=>{i.jb("InstanceNormalization",o,{epsilon:p,format:m?"NHWC":"NCHW"})},841720:o=>{i.jb("Range",o,void 0)},841773:(o,p)=>{i.jb("Einsum",o,{equation:xe(p)})},841854:(o,p,m,y,v)=>{i.jb("Pad",o,{mode:p,value:m,pads:y?Array.from(D().subarray(Number(y)>>>0,Number(v)>>>0)):[]})},841997:(o,p,m,y,v,T)=>{i.jb("BatchNormalization",o,{epsilon:p,momentum:m,spatial:!!v,trainingMode:!!y,format:T?"NHWC":"NCHW"})},842166:(o,p,m,y,v,T)=>{i.jb("BatchNormalization",o,{epsilon:p,momentum:m,spatial:!!v,trainingMode:!!y,format:T?"NHWC":"NCHW"})},842335:(o,p,m)=>{i.jb("CumSum",o,{exclusive:Number(p),reverse:Number(m)})},842432:(o,p,m)=>{i.jb("DequantizeLinear",o,{axis:p,blockSize:m})},842522:(o,p,m,y,v)=>{i.jb("GridSample",o,{align_corners:p,mode:xe(m),padding_mode:xe(y),format:v?"NHWC":"NCHW"})},842692:(o,p,m,y,v)=>{i.jb("GridSample",o,{align_corners:p,mode:xe(m),padding_mode:xe(y),format:v?"NHWC":"NCHW"})},842862:(o,p)=>{i.jb("ScatterND",o,{reduction:xe(p)})},842947:(o,p,m,y,v,T,B,N,V)=>{i.jb("Attention",o,{numHeads:p,isUnidirectional:m,maskFilterValue:y,scale:v,doRotary:T,qkvHiddenSizes:B?Array.from(D().subarray(Number(N)>>>0,Number(N)+B>>>0)):[],pastPresentShareBuffer:!!V})},843219:o=>{i.jb("BiasAdd",o,void 0)},843274:o=>{i.jb("BiasSplitGelu",o,void 0)},843335:o=>{i.jb("FastGelu",o,void 0)},843391:(o,p,m,y,v,T,B,N,V,Q,ne,pe,_e,ze,qt,Em)=>{i.jb("Conv",o,{format:pe?"NHWC":"NCHW",auto_pad:p,dilations:m?Array.from(D().subarray(Number(m)>>>0,Number(y)>>>0)):[],group:v,kernel_shape:T?Array.from(D().subarray(Number(T)>>>0,Number(B)>>>0)):[],pads:N?Array.from(D().subarray(Number(N)>>>0,Number(V)>>>0)):[],strides:Q?Array.from(D().subarray(Number(Q)>>>0,Number(ne)>>>0)):[],w_is_const:()=>!!P()[Number(_e)>>>0],activation:xe(ze),activation_params:qt?Array.from(We().subarray(Number(qt)>>>0,Number(Em)>>>0)):[]})},843975:o=>{i.jb("Gelu",o,void 0)},844027:(o,p,m,y,v,T,B,N,V)=>{i.jb("GroupQueryAttention",o,{numHeads:p,kvNumHeads:m,scale:y,softcap:v,doRotary:T,rotaryInterleaved:B,smoothSoftmax:N,localWindowSize:V})},844244:(o,p,m,y)=>{i.jb("LayerNormalization",o,{axis:p,epsilon:m,simplified:!!y})},844355:(o,p,m,y)=>{i.jb("LayerNormalization",o,{axis:p,epsilon:m,simplified:!!y})},844466:(o,p,m,y,v,T)=>{i.jb("MatMulNBits",o,{k:p,n:m,accuracyLevel:y,bits:v,blockSize:T})},844593:(o,p,m,y,v,T)=>{i.jb("MultiHeadAttention",o,{numHeads:p,isUnidirectional:m,maskFilterValue:y,scale:v,doRotary:T})},844752:(o,p)=>{i.jb("QuickGelu",o,{alpha:p})},844816:(o,p,m,y,v)=>{i.jb("RotaryEmbedding",o,{interleaved:!!p,numHeads:m,rotaryEmbeddingDim:y,scale:v})},844955:(o,p,m)=>{i.jb("SkipLayerNormalization",o,{epsilon:p,simplified:!!m})},845057:(o,p,m)=>{i.jb("SkipLayerNormalization",o,{epsilon:p,simplified:!!m})},845159:(o,p,m,y)=>{i.jb("GatherBlockQuantized",o,{gatherAxis:p,quantizeAxis:m,blockSize:y})},845280:o=>{i.Zb(o)},845314:(o,p)=>i.ac(Number(o),Number(p),i.Fb.dc,i.Fb.errors)};function dh(o,p,m){return us(async()=>{await i.Xb(Number(o),Number(p),Number(m))})}function ph(){return typeof wasmOffsetConverter<"u"}class ii{constructor(p){er(this,"name","ExitStatus");this.message=`Program terminated with exit(${p})`,this.status=p}}var zn=o=>{o.terminate(),o.onmessage=()=>{}},ai=[],Cn=o=>{mt.length==0&&(Dn(),Mn(mt[0]));var p=mt.pop();if(!p)return 6;Xt.push(p),It[o.Ab]=p,p.Ab=o.Ab;var m={Bb:"run",fc:o.ec,Hb:o.Hb,Ab:o.Ab};return p.postMessage(m,o.Mb),0},ht=0,we=(o,p,...m)=>{for(var y=2*m.length,v=vi(),T=$i(8*y),B=T>>>3,N=0;N<m.length;N++){var V=m[N];typeof V=="bigint"?(j[B+2*N]=1n,j[B+2*N+1]=V):(j[B+2*N]=0n,Be()[B+2*N+1>>>0]=V)}return o=Cs(o,0,y,T,p),zr(v),o};function ni(o){if(l)return we(0,1,o);if(A=o,!(0<ht)){for(var p of Xt)zn(p);for(p of mt)zn(p);mt=[],Xt=[],It={},ae=!0}x(0,new ii(o))}function An(o){if(l)return we(1,0,o);si(o)}var si=o=>{if(A=o,l)throw An(o),"unwind";ni(o)},mt=[],Xt=[],On=[],It={},Bn=o=>{var p=o.Ab;delete It[p],mt.push(o),Xt.splice(Xt.indexOf(o),1),o.Ab=0,As(p)};function Rn(){On.forEach(o=>o())}var Mn=o=>new Promise(p=>{o.onmessage=v=>{var T=(v=v.data).Bb;if(v.Gb&&v.Gb!=Tr()){var B=It[v.Gb];B?B.postMessage(v,v.Mb):I(`Internal error! Worker sent a message "${T}" to target pthread ${v.Gb}, but that thread no longer exists!`)}else T==="checkMailbox"?br():T==="spawnThread"?Cn(v):T==="cleanupThread"?Bn(It[v.hc]):T==="loaded"?(o.loaded=!0,p(o)):T==="alert"?alert(`Thread ${v.ic}: ${v.text}`):v.target==="setimmediate"?o.postMessage(v):T==="callHandler"?i[v.Qb](...v.args):T&&I(`worker sent an unknown command ${T}`)},o.onerror=v=>{throw I(`worker sent an error! ${v.filename}:${v.lineno}: ${v.message}`),v};var m,y=[];for(m of[])i.propertyIsEnumerable(m)&&y.push(m);o.postMessage({Bb:"load",Rb:y,kc:E,lc:z})});function Dn(){var o=new Worker((()=>{let p=URL;return import.meta.url>"file:"&&import.meta.url<"file;"?new p("ort.webgpu.bundle.min.mjs",import.meta.url):new URL(import.meta.url)})(),{type:"module",workerData:"em-pthread",name:"em-pthread"});mt.push(o)}var ch=o=>{he();var p=ge()[o+52>>>2>>>0];o=ge()[o+56>>>2>>>0],Rs(p,p-o),zr(p)},fh=(o,p)=>{ht=0,o=Ms(o,p),0<ht?A=o:wi(o)};class hh{constructor(p){this.Ib=p-24}}function mh(o,p,m){var y=new hh(o>>>=0);throw p>>>=0,m>>>=0,ge()[y.Ib+16>>>2>>>0]=0,ge()[y.Ib+4>>>2>>>0]=p,ge()[y.Ib+8>>>2>>>0]=m,o}function Nn(o,p,m,y){return l?we(2,1,o,p,m,y):Pn(o,p,m,y)}function Pn(o,p,m,y){if(o>>>=0,m>>>=0,y>>>=0,c===void 0)return 6;var v=[];return l&&v.length===0?Nn(o,p>>>=0,m,y):(o={ec:m,Ab:o,Hb:y,Mb:v},l?(o.Bb="spawnThread",postMessage(o,v),0):Cn(o))}var Un=typeof TextDecoder<"u"?new TextDecoder:void 0,qn=(o,p=0,m=NaN)=>{var y=(p>>>=0)+m;for(m=p;o[m]&&!(m>=y);)++m;if(16<m-p&&o.buffer&&Un)return Un.decode(o.buffer instanceof ArrayBuffer?o.subarray(p,m):o.slice(p,m));for(y="";p<m;){var v=o[p++];if(128&v){var T=63&o[p++];if((224&v)==192)y+=String.fromCharCode((31&v)<<6|T);else{var B=63&o[p++];65536>(v=(240&v)==224?(15&v)<<12|T<<6|B:(7&v)<<18|T<<12|B<<6|63&o[p++])?y+=String.fromCharCode(v):(v-=65536,y+=String.fromCharCode(55296|v>>10,56320|1023&v))}}else y+=String.fromCharCode(v)}return y},xe=(o,p)=>(o>>>=0)?qn(G(),o,p):"";function Wn(o,p,m){return l?we(3,1,o,p,m):0}function Ln(o,p){if(l)return we(4,1,o,p)}var Vn=o=>{for(var p=0,m=0;m<o.length;++m){var y=o.charCodeAt(m);127>=y?p++:2047>=y?p+=2:55296<=y&&57343>=y?(p+=4,++m):p+=3}return p},Ut=(o,p,m)=>{var y=G();if(p>>>=0,0<m){var v=p;m=p+m-1;for(var T=0;T<o.length;++T){var B=o.charCodeAt(T);if(55296<=B&&57343>=B&&(B=65536+((1023&B)<<10)|1023&o.charCodeAt(++T)),127>=B){if(p>=m)break;y[p++>>>0]=B}else{if(2047>=B){if(p+1>=m)break;y[p++>>>0]=192|B>>6}else{if(65535>=B){if(p+2>=m)break;y[p++>>>0]=224|B>>12}else{if(p+3>=m)break;y[p++>>>0]=240|B>>18,y[p++>>>0]=128|B>>12&63}y[p++>>>0]=128|B>>6&63}y[p++>>>0]=128|63&B}}y[p>>>0]=0,o=p-v}else o=0;return o};function jn(o,p){if(l)return we(5,1,o,p)}function Gn(o,p,m){if(l)return we(6,1,o,p,m)}function Hn(o,p,m){return l?we(7,1,o,p,m):0}function Fn(o,p){if(l)return we(8,1,o,p)}function Kn(o,p,m){if(l)return we(9,1,o,p,m)}function Zn(o,p,m,y){if(l)return we(10,1,o,p,m,y)}function Qn(o,p,m,y){if(l)return we(11,1,o,p,m,y)}function Xn(o,p,m,y){if(l)return we(12,1,o,p,m,y)}function Yn(o){if(l)return we(13,1,o)}function Jn(o,p){if(l)return we(14,1,o,p)}function es(o,p,m){if(l)return we(15,1,o,p,m)}var ts,gt,gh=()=>ft(""),rt=o=>{for(var p="";G()[o>>>0];)p+=ts[G()[o++>>>0]];return p},oi={},ui={};function ot(o,p,m={}){return(function(y,v,T={}){var B=v.name;if(!y)throw new gt(`type "${B}" must have a positive integer typeid pointer`);if(ui.hasOwnProperty(y)){if(T.Sb)return;throw new gt(`Cannot register type '${B}' twice`)}ui[y]=v,oi.hasOwnProperty(y)&&(v=oi[y],delete oi[y],v.forEach(N=>N()))})(o,p,m)}var rs=(o,p,m)=>{switch(p){case 1:return m?y=>P()[y>>>0]:y=>G()[y>>>0];case 2:return m?y=>oe()[y>>>1>>>0]:y=>Ie()[y>>>1>>>0];case 4:return m?y=>D()[y>>>2>>>0]:y=>ge()[y>>>2>>>0];case 8:return m?y=>j[y>>>3]:y=>L[y>>>3];default:throw new TypeError(`invalid integer width (${p}): ${o}`)}};function _h(o,p,m){m>>>=0,ot(o>>>=0,{name:p=rt(p>>>0),fromWireType:y=>y,toWireType:function(y,v){if(typeof v!="bigint"&&typeof v!="number")throw v=v===null?"null":(y=typeof v)=="object"||y==="array"||y==="function"?v.toString():""+v,new TypeError(`Cannot convert "${v}" to ${this.name}`);return typeof v=="number"&&(v=BigInt(v)),v},Cb:_t,readValueFromPointer:rs(p,m,p.indexOf("u")==-1),Db:null})}var _t=8;function yh(o,p,m,y){ot(o>>>=0,{name:p=rt(p>>>0),fromWireType:function(v){return!!v},toWireType:function(v,T){return T?m:y},Cb:_t,readValueFromPointer:function(v){return this.fromWireType(G()[v>>>0])},Db:null})}var li=[],ut=[];function di(o){9<(o>>>=0)&&--ut[o+1]==0&&(ut[o]=void 0,li.push(o))}var De=o=>{if(!o)throw new gt("Cannot use deleted val. handle = "+o);return ut[o]},Le=o=>{switch(o){case void 0:return 2;case null:return 4;case!0:return 6;case!1:return 8;default:let p=li.pop()||ut.length;return ut[p]=o,ut[p+1]=1,p}};function pi(o){return this.fromWireType(ge()[o>>>2>>>0])}var bh={name:"emscripten::val",fromWireType:o=>{var p=De(o);return di(o),p},toWireType:(o,p)=>Le(p),Cb:_t,readValueFromPointer:pi,Db:null};function wh(o){return ot(o>>>0,bh)}var $h=(o,p)=>{switch(p){case 4:return function(m){return this.fromWireType(We()[m>>>2>>>0])};case 8:return function(m){return this.fromWireType(Be()[m>>>3>>>0])};default:throw new TypeError(`invalid float width (${p}): ${o}`)}};function vh(o,p,m){m>>>=0,ot(o>>>=0,{name:p=rt(p>>>0),fromWireType:y=>y,toWireType:(y,v)=>v,Cb:_t,readValueFromPointer:$h(p,m),Db:null})}function xh(o,p,m,y,v){if(o>>>=0,m>>>=0,p=rt(p>>>0),v===-1&&(v=4294967295),v=N=>N,y===0){var T=32-8*m;v=N=>N<<T>>>T}var B=p.includes("unsigned")?function(N,V){return V>>>0}:function(N,V){return V};ot(o,{name:p,fromWireType:v,toWireType:B,Cb:_t,readValueFromPointer:rs(p,m,y!==0),Db:null})}function Sh(o,p,m){function y(T){var B=ge()[T>>>2>>>0];return T=ge()[T+4>>>2>>>0],new v(P().buffer,T,B)}var v=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,BigInt64Array,BigUint64Array][p];ot(o>>>=0,{name:m=rt(m>>>0),fromWireType:y,Cb:_t,readValueFromPointer:y},{Sb:!0})}function kh(o,p){ot(o>>>=0,{name:p=rt(p>>>0),fromWireType:function(m){for(var y,v=ge()[m>>>2>>>0],T=m+4,B=T,N=0;N<=v;++N){var V=T+N;N!=v&&G()[V>>>0]!=0||(B=xe(B,V-B),y===void 0?y=B:(y+="\0",y+=B),B=V+1)}return at(m),y},toWireType:function(m,y){y instanceof ArrayBuffer&&(y=new Uint8Array(y));var v=typeof y=="string";if(!(v||y instanceof Uint8Array||y instanceof Uint8ClampedArray||y instanceof Int8Array))throw new gt("Cannot pass non-string to std::string");var T=v?Vn(y):y.length,B=Er(4+T+1),N=B+4;if(ge()[B>>>2>>>0]=T,v)Ut(y,N,T+1);else if(v)for(v=0;v<T;++v){var V=y.charCodeAt(v);if(255<V)throw at(B),new gt("String has UTF-16 code units that do not fit in 8 bits");G()[N+v>>>0]=V}else for(v=0;v<T;++v)G()[N+v>>>0]=y[v];return m!==null&&m.push(at,B),B},Cb:_t,readValueFromPointer:pi,Db(m){at(m)}})}var is=typeof TextDecoder<"u"?new TextDecoder("utf-16le"):void 0,Ih=(o,p)=>{for(var m=o>>1,y=m+p/2;!(m>=y)&&Ie()[m>>>0];)++m;if(32<(m<<=1)-o&&is)return is.decode(G().slice(o,m));for(m="",y=0;!(y>=p/2);++y){var v=oe()[o+2*y>>>1>>>0];if(v==0)break;m+=String.fromCharCode(v)}return m},Th=(o,p,m)=>{if(m??(m=2147483647),2>m)return 0;var y=p;m=(m-=2)<2*o.length?m/2:o.length;for(var v=0;v<m;++v){var T=o.charCodeAt(v);oe()[p>>>1>>>0]=T,p+=2}return oe()[p>>>1>>>0]=0,p-y},Eh=o=>2*o.length,zh=(o,p)=>{for(var m=0,y="";!(m>=p/4);){var v=D()[o+4*m>>>2>>>0];if(v==0)break;++m,65536<=v?(v-=65536,y+=String.fromCharCode(55296|v>>10,56320|1023&v)):y+=String.fromCharCode(v)}return y},Ch=(o,p,m)=>{if(p>>>=0,m??(m=2147483647),4>m)return 0;var y=p;m=y+m-4;for(var v=0;v<o.length;++v){var T=o.charCodeAt(v);if(55296<=T&&57343>=T&&(T=65536+((1023&T)<<10)|1023&o.charCodeAt(++v)),D()[p>>>2>>>0]=T,(p+=4)+4>m)break}return D()[p>>>2>>>0]=0,p-y},Ah=o=>{for(var p=0,m=0;m<o.length;++m){var y=o.charCodeAt(m);55296<=y&&57343>=y&&++m,p+=4}return p};function Oh(o,p,m){if(o>>>=0,p>>>=0,m=rt(m>>>=0),p===2)var y=Ih,v=Th,T=Eh,B=N=>Ie()[N>>>1>>>0];else p===4&&(y=zh,v=Ch,T=Ah,B=N=>ge()[N>>>2>>>0]);ot(o,{name:m,fromWireType:N=>{for(var V,Q=ge()[N>>>2>>>0],ne=N+4,pe=0;pe<=Q;++pe){var _e=N+4+pe*p;pe!=Q&&B(_e)!=0||(ne=y(ne,_e-ne),V===void 0?V=ne:(V+="\0",V+=ne),ne=_e+p)}return at(N),V},toWireType:(N,V)=>{if(typeof V!="string")throw new gt(`Cannot pass non-string to C++ string type ${m}`);var Q=T(V),ne=Er(4+Q+p);return ge()[ne>>>2>>>0]=Q/p,v(V,ne+4,Q+p),N!==null&&N.push(at,ne),ne},Cb:_t,readValueFromPointer:pi,Db(N){at(N)}})}function Bh(o,p){ot(o>>>=0,{Tb:!0,name:p=rt(p>>>0),Cb:0,fromWireType:()=>{},toWireType:()=>{}})}function Rh(o){bi(o>>>0,!d,1,!u,131072,!1),Rn()}var ci=o=>{if(!ae)try{if(o(),!(0<ht))try{l?wi(A):si(A)}catch(p){p instanceof ii||p=="unwind"||x(0,p)}}catch(p){p instanceof ii||p=="unwind"||x(0,p)}};function fi(o){o>>>=0,typeof Atomics.jc=="function"&&(Atomics.jc(D(),o>>>2,o).value.then(br),o+=128,Atomics.store(D(),o>>>2,1))}var br=()=>{var o=Tr();o&&(fi(o),ci(Bs))};function Mh(o,p){(o>>>=0)==p>>>0?setTimeout(br):l?postMessage({Gb:o,Bb:"checkMailbox"}):(o=It[o])&&o.postMessage({Bb:"checkMailbox"})}var hi=[];function Dh(o,p,m,y,v){for(p>>>=0,y/=2,hi.length=y,m=v>>>0>>>3,v=0;v<y;v++)hi[v]=j[m+2*v]?j[m+2*v+1]:Be()[m+2*v+1>>>0];return(p?ri[p]:Tm[o])(...hi)}var Nh=()=>{ht=0};function Ph(o){o>>>=0,l?postMessage({Bb:"cleanupThread",hc:o}):Bn(It[o])}function Uh(o){}var wr=(o,p)=>{var m=ui[o];if(m===void 0)throw o=Ts(o),m=rt(o),at(o),new gt(`${p} has unknown type ${m}`);return m},as=(o,p,m)=>{var y=[];return o=o.toWireType(y,m),y.length&&(ge()[p>>>2>>>0]=Le(y)),o};function qh(o,p,m){return p>>>=0,m>>>=0,o=De(o>>>0),p=wr(p,"emval::as"),as(p,m,o)}function Wh(o,p){return p>>>=0,o=De(o>>>0),(p=wr(p,"emval::as")).toWireType(null,o)}var $r=o=>{try{o()}catch(p){ft(p)}},yt=0,it=null,ns=0,vr=[],ss={},os={},Lh=0,mi=null,Vh=[];function us(o){return(function(p){if(!ae){if(yt===0){var m=!1,y=!1;p((v=0)=>{if(!ae&&(ns=v,m=!0,y)){yt=2,$r(()=>Ps(it)),typeof MainLoop<"u"&&MainLoop.Pb&&MainLoop.resume(),v=!1;try{var T=(function(){var V=D()[it+8>>>2>>>0];return V=Y[os[V]],--ht,V()})()}catch(V){T=V,v=!0}var B=!1;if(!it){var N=mi;N&&(mi=null,(v?N.reject:N.resolve)(T),B=!0)}if(v&&!B)throw T}}),y=!0,m||(yt=1,it=(function(){var v=Er(65548),T=v+12;ge()[v>>>2>>>0]=T,ge()[v+4>>>2>>>0]=T+65536,T=vr[0];var B=ss[T];return B===void 0&&(B=Lh++,ss[T]=B,os[B]=T),T=B,D()[v+8>>>2>>>0]=T,v})(),typeof MainLoop<"u"&&MainLoop.Pb&&MainLoop.pause(),$r(()=>Ds(it)))}else yt===2?(yt=0,$r(Us),at(it),it=null,Vh.forEach(ci)):ft(`invalid state: ${yt}`);return ns}})(p=>{o().then(p)})}function jh(o){return o>>>=0,us(async()=>{var p=await De(o);return Le(p)})}var xr=[];function Gh(o,p,m,y){return m>>>=0,y>>>=0,(o=xr[o>>>0])(null,p=De(p>>>0),m,y)}var Hh={},Sr=o=>{var p=Hh[o];return p===void 0?rt(o):p};function Fh(o,p,m,y,v){return m>>>=0,y>>>=0,v>>>=0,(o=xr[o>>>0])(p=De(p>>>0),p[m=Sr(m)],y,v)}var ls=()=>typeof globalThis=="object"?globalThis:Function("return this")();function Kh(o){return(o>>>=0)==0?Le(ls()):(o=Sr(o),Le(ls()[o]))}var Zh=o=>{var p=xr.length;return xr.push(o),p},Qh=(o,p)=>{for(var m=Array(o),y=0;y<o;++y)m[y]=wr(ge()[p+4*y>>>2>>>0],"parameter "+y);return m},ds=(o,p)=>Object.defineProperty(p,"name",{value:o});function Xh(o,p,m){var y=(p=Qh(o,p>>>0)).shift();o--;var v=`return function (obj, func, destructorsRef, args) {
`,T=0,B=[];m===0&&B.push("obj");for(var N=["retType"],V=[y],Q=0;Q<o;++Q)B.push("arg"+Q),N.push("argType"+Q),V.push(p[Q]),v+=`  var arg${Q} = argType${Q}.readValueFromPointer(args${T?"+"+T:""});
`,T+=p[Q].Cb;return v+=`  var rv = ${m===1?"new func":"func.call"}(${B.join(", ")});
`,y.Tb||(N.push("emval_returnValue"),V.push(as),v+=`  return emval_returnValue(retType, destructorsRef, rv);
`),N.push(v+`};
`),o=(function(ne){var pe=Function;if(!(pe instanceof Function))throw new TypeError(`new_ called with constructor type ${typeof pe} which is not a function`);var _e=ds(pe.name||"unknownFunctionName",function(){});return _e.prototype=pe.prototype,_e=new _e,(ne=pe.apply(_e,ne))instanceof Object?ne:_e})(N)(...V),m=`methodCaller<(${p.map(ne=>ne.name).join(", ")}) => ${y.name}>`,Zh(ds(m,o))}function Yh(o){return o=Sr(o>>>0),Le(i[o])}function Jh(o,p){return p>>>=0,o=De(o>>>0),p=De(p),Le(o[p])}function em(o){9<(o>>>=0)&&(ut[o+1]+=1)}function tm(){return Le([])}function rm(o){o=De(o>>>0);for(var p=Array(o.length),m=0;m<o.length;m++)p[m]=o[m];return Le(p)}function im(o){return Le(Sr(o>>>0))}function am(){return Le({})}function nm(o){for(var p=De(o>>>=0);p.length;){var m=p.pop();p.pop()(m)}di(o)}function sm(o,p,m){p>>>=0,m>>>=0,o=De(o>>>0),p=De(p),m=De(m),o[p]=m}function om(o,p){return p>>>=0,o=(o=wr(o>>>0,"_emval_take_value")).readValueFromPointer(p),Le(o)}function um(o,p){o=-9007199254740992>o||9007199254740992<o?NaN:Number(o),p>>>=0,o=new Date(1e3*o),D()[p>>>2>>>0]=o.getUTCSeconds(),D()[p+4>>>2>>>0]=o.getUTCMinutes(),D()[p+8>>>2>>>0]=o.getUTCHours(),D()[p+12>>>2>>>0]=o.getUTCDate(),D()[p+16>>>2>>>0]=o.getUTCMonth(),D()[p+20>>>2>>>0]=o.getUTCFullYear()-1900,D()[p+24>>>2>>>0]=o.getUTCDay(),o=(o.getTime()-Date.UTC(o.getUTCFullYear(),0,1,0,0,0,0))/864e5|0,D()[p+28>>>2>>>0]=o}var ps=o=>o%4==0&&(o%100!=0||o%400==0),cs=[0,31,60,91,121,152,182,213,244,274,305,335],fs=[0,31,59,90,120,151,181,212,243,273,304,334];function lm(o,p){o=-9007199254740992>o||9007199254740992<o?NaN:Number(o),p>>>=0,o=new Date(1e3*o),D()[p>>>2>>>0]=o.getSeconds(),D()[p+4>>>2>>>0]=o.getMinutes(),D()[p+8>>>2>>>0]=o.getHours(),D()[p+12>>>2>>>0]=o.getDate(),D()[p+16>>>2>>>0]=o.getMonth(),D()[p+20>>>2>>>0]=o.getFullYear()-1900,D()[p+24>>>2>>>0]=o.getDay();var m=(ps(o.getFullYear())?cs:fs)[o.getMonth()]+o.getDate()-1|0;D()[p+28>>>2>>>0]=m,D()[p+36>>>2>>>0]=-60*o.getTimezoneOffset(),m=new Date(o.getFullYear(),6,1).getTimezoneOffset();var y=new Date(o.getFullYear(),0,1).getTimezoneOffset();o=0|(m!=y&&o.getTimezoneOffset()==Math.min(y,m)),D()[p+32>>>2>>>0]=o}function dm(o){o>>>=0;var p=new Date(D()[o+20>>>2>>>0]+1900,D()[o+16>>>2>>>0],D()[o+12>>>2>>>0],D()[o+8>>>2>>>0],D()[o+4>>>2>>>0],D()[o>>>2>>>0],0),m=D()[o+32>>>2>>>0],y=p.getTimezoneOffset(),v=new Date(p.getFullYear(),6,1).getTimezoneOffset(),T=new Date(p.getFullYear(),0,1).getTimezoneOffset(),B=Math.min(T,v);return 0>m?D()[o+32>>>2>>>0]=+(v!=T&&B==y):0<m!=(B==y)&&(v=Math.max(T,v),p.setTime(p.getTime()+6e4*((0<m?B:v)-y))),D()[o+24>>>2>>>0]=p.getDay(),m=(ps(p.getFullYear())?cs:fs)[p.getMonth()]+p.getDate()-1|0,D()[o+28>>>2>>>0]=m,D()[o>>>2>>>0]=p.getSeconds(),D()[o+4>>>2>>>0]=p.getMinutes(),D()[o+8>>>2>>>0]=p.getHours(),D()[o+12>>>2>>>0]=p.getDate(),D()[o+16>>>2>>>0]=p.getMonth(),D()[o+20>>>2>>>0]=p.getYear(),o=p.getTime(),BigInt(isNaN(o)?-1:o/1e3)}function hs(o,p,m,y,v,T,B){return l?we(16,1,o,p,m,y,v,T,B):-52}function ms(o,p,m,y,v,T){if(l)return we(17,1,o,p,m,y,v,T)}var Yt={},pm=()=>performance.timeOrigin+performance.now();function gs(o,p){if(l)return we(18,1,o,p);if(Yt[o]&&(clearTimeout(Yt[o].id),delete Yt[o]),!p)return 0;var m=setTimeout(()=>{delete Yt[o],ci(()=>Os(o,performance.timeOrigin+performance.now()))},p);return Yt[o]={id:m,qc:p},0}function cm(o,p,m,y){o>>>=0,p>>>=0,m>>>=0,y>>>=0;var v=new Date().getFullYear(),T=new Date(v,0,1).getTimezoneOffset();v=new Date(v,6,1).getTimezoneOffset();var B=Math.max(T,v);ge()[o>>>2>>>0]=60*B,D()[p>>>2>>>0]=+(T!=v),o=(p=N=>{var V=Math.abs(N);return`UTC${0<=N?"-":"+"}${String(Math.floor(V/60)).padStart(2,"0")}${String(V%60).padStart(2,"0")}`})(T),p=p(v),v<T?(Ut(o,m,17),Ut(p,y,17)):(Ut(o,y,17),Ut(p,m,17))}var fm=()=>Date.now();function hm(o,p,m){return 0<=o&&3>=o?(o===0?o=Date.now():o=performance.timeOrigin+performance.now(),j[m>>>0>>>3]=BigInt(Math.round(1e6*o)),0):28}var gi=[],_s=(o,p)=>{gi.length=0;for(var m;m=G()[o++>>>0];){var y=m!=105;p+=(y&=m!=112)&&p%8?4:0,gi.push(m==112?ge()[p>>>2>>>0]:m==106?j[p>>>3]:m==105?D()[p>>>2>>>0]:Be()[p>>>3>>>0]),p+=y?8:4}return gi};function mm(o,p,m){return o>>>=0,p=_s(p>>>0,m>>>0),ri[o](...p)}function gm(o,p,m){return o>>>=0,p=_s(p>>>0,m>>>0),ri[o](...p)}var _m=()=>{};function ym(o,p){return I(xe(o>>>0,p>>>0))}var bm=()=>{throw ht+=1,"unwind"};function wm(){return 4294901760}var $m=()=>navigator.hardwareConcurrency;function vm(){return ft("Cannot use emscripten_pc_get_function without -sUSE_OFFSET_CONVERTER"),0}function xm(o){o>>>=0;var p=G().length;if(o<=p||4294901760<o)return!1;for(var m=1;4>=m;m*=2){var y=p*(1+.2/m);y=Math.min(y,o+100663296);e:{y=(Math.min(4294901760,65536*Math.ceil(Math.max(o,y)/65536))-E.buffer.byteLength+65535)/65536|0;try{E.grow(y),he();var v=1;break e}catch{}v=void 0}if(v)return!0}return!1}var kr=()=>(ft("Cannot use convertFrameToPC (needed by __builtin_return_address) without -sUSE_OFFSET_CONVERTER"),0),Jt={},ys=o=>{o.forEach(p=>{kr()})};function Sm(){var o=Error().stack.toString().split(`
`);return o[0]=="Error"&&o.shift(),ys(o),Jt.Lb=kr(),Jt.cc=o,Jt.Lb}function km(o,p,m){if(o>>>=0,p>>>=0,Jt.Lb==o)var y=Jt.cc;else(y=Error().stack.toString().split(`
`))[0]=="Error"&&y.shift(),ys(y);for(var v=3;y[v]&&kr()!=o;)++v;for(o=0;o<m&&y[o+v];++o)D()[p+4*o>>>2>>>0]=kr();return o}var _i,yi={},bs=()=>{if(!_i){var o,p={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:(typeof navigator=="object"&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",_:"./this.program"};for(o in yi)yi[o]===void 0?delete p[o]:p[o]=yi[o];var m=[];for(o in p)m.push(`${o}=${p[o]}`);_i=m}return _i};function ws(o,p){if(l)return we(19,1,o,p);o>>>=0,p>>>=0;var m=0;return bs().forEach((y,v)=>{var T=p+m;for(v=ge()[o+4*v>>>2>>>0]=T,T=0;T<y.length;++T)P()[v++>>>0]=y.charCodeAt(T);P()[v>>>0]=0,m+=y.length+1}),0}function $s(o,p){if(l)return we(20,1,o,p);o>>>=0,p>>>=0;var m=bs();ge()[o>>>2>>>0]=m.length;var y=0;return m.forEach(v=>y+=v.length+1),ge()[p>>>2>>>0]=y,0}function vs(o){return l?we(21,1,o):52}function xs(o,p,m,y){return l?we(22,1,o,p,m,y):52}function Ss(o,p,m,y){return l?we(23,1,o,p,m,y):70}var Im=[null,[],[]];function ks(o,p,m,y){if(l)return we(24,1,o,p,m,y);p>>>=0,m>>>=0,y>>>=0;for(var v=0,T=0;T<m;T++){var B=ge()[p>>>2>>>0],N=ge()[p+4>>>2>>>0];p+=8;for(var V=0;V<N;V++){var Q=G()[B+V>>>0],ne=Im[o];Q===0||Q===10?((o===1?S:I)(qn(ne)),ne.length=0):ne.push(Q)}v+=N}return ge()[y>>>2>>>0]=v,0}l||(function(){for(var o=i.numThreads-1;o--;)Dn();ai.unshift(()=>{kt++,(function(p){l?p():Promise.all(mt.map(Mn)).then(p)})(()=>Tn())})})();for(var Is=Array(256),Ir=0;256>Ir;++Ir)Is[Ir]=String.fromCharCode(Ir);ts=Is,gt=i.BindingError=class extends Error{constructor(o){super(o),this.name="BindingError"}},i.InternalError=class extends Error{constructor(o){super(o),this.name="InternalError"}},ut.push(0,1,void 0,1,null,1,!0,1,!1,1),i.count_emval_handles=()=>ut.length/2-5-li.length;var Y,Tm=[ni,An,Nn,Wn,Ln,jn,Gn,Hn,Fn,Kn,Zn,Qn,Xn,Yn,Jn,es,hs,ms,gs,ws,$s,vs,xs,Ss,ks];(async function(){function o(y,v){return Y=y.exports,Y=(function(){var T=Y,B={};for(let[N,V]of Object.entries(T))B[N]=typeof V=="function"?(...Q)=>{vr.push(N);try{return V(...Q)}finally{ae||(vr.pop(),it&&yt===1&&vr.length===0&&(yt=0,ht+=1,$r(Ns),typeof Fibers<"u"&&Fibers.rc()))}}:V;return B})(),Y=(function(){var T=Y,B=V=>Q=>V(Q)>>>0,N=V=>()=>V()>>>0;return(T=Object.assign({},T)).Da=B(T.Da),T.fb=N(T.fb),T.hb=B(T.hb),T.tb=B(T.tb),T.ub=N(T.ub),T.__cxa_get_exception_ptr=B(T.__cxa_get_exception_ptr),T})(),On.push(Y.ib),z=v,Tn(),Y}kt++;var p=En();if(i.instantiateWasm)return new Promise(y=>{i.instantiateWasm(p,(v,T)=>{o(v,T),y(v.exports)})});if(l)return new Promise(y=>{St=v=>{var T=new WebAssembly.Instance(v,En());y(o(T,v))}});Zt??(Zt=i.locateFile?i.locateFile?i.locateFile("ort-wasm-simd-threaded.jsep.wasm",$):$+"ort-wasm-simd-threaded.jsep.wasm":new URL(""+new URL("ort-wasm-simd-threaded.jsep-B0T3yYHD.wasm",import.meta.url).href,import.meta.url).href);try{var m=await(async function(y){var v=Zt;if(!te&&typeof WebAssembly.instantiateStreaming=="function"&&!M(v))try{var T=fetch(v,{credentials:"same-origin"});return await WebAssembly.instantiateStreaming(T,y)}catch(B){I(`wasm streaming compile failed: ${B}`),I("falling back to ArrayBuffer instantiation")}return(async function(B,N){try{var V=await(async function(Q){if(!te)try{var ne=await g(Q);return new Uint8Array(ne)}catch{}if(Q==Zt&&te)Q=new Uint8Array(te);else{if(!_)throw"both async and sync fetching of the wasm failed";Q=_(Q)}return Q})(B);return await WebAssembly.instantiate(V,N)}catch(Q){I(`failed to asynchronously prepare wasm: ${Q}`),ft(Q)}})(v,y)})(p);return o(m.instance,m.module)}catch(y){return n(y),Promise.reject(y)}})();var Ts=o=>(Ts=Y.Da)(o),Es=()=>(Es=Y.Ea)();i._OrtInit=(o,p)=>(i._OrtInit=Y.Fa)(o,p),i._OrtGetLastError=(o,p)=>(i._OrtGetLastError=Y.Ga)(o,p),i._OrtCreateSessionOptions=(o,p,m,y,v,T,B,N,V,Q)=>(i._OrtCreateSessionOptions=Y.Ha)(o,p,m,y,v,T,B,N,V,Q),i._OrtAppendExecutionProvider=(o,p,m,y,v)=>(i._OrtAppendExecutionProvider=Y.Ia)(o,p,m,y,v),i._OrtAddFreeDimensionOverride=(o,p,m)=>(i._OrtAddFreeDimensionOverride=Y.Ja)(o,p,m),i._OrtAddSessionConfigEntry=(o,p,m)=>(i._OrtAddSessionConfigEntry=Y.Ka)(o,p,m),i._OrtReleaseSessionOptions=o=>(i._OrtReleaseSessionOptions=Y.La)(o),i._OrtCreateSession=(o,p,m)=>(i._OrtCreateSession=Y.Ma)(o,p,m),i._OrtReleaseSession=o=>(i._OrtReleaseSession=Y.Na)(o),i._OrtGetInputOutputCount=(o,p,m)=>(i._OrtGetInputOutputCount=Y.Oa)(o,p,m),i._OrtGetInputOutputMetadata=(o,p,m,y)=>(i._OrtGetInputOutputMetadata=Y.Pa)(o,p,m,y),i._OrtFree=o=>(i._OrtFree=Y.Qa)(o),i._OrtCreateTensor=(o,p,m,y,v,T)=>(i._OrtCreateTensor=Y.Ra)(o,p,m,y,v,T),i._OrtGetTensorData=(o,p,m,y,v)=>(i._OrtGetTensorData=Y.Sa)(o,p,m,y,v),i._OrtReleaseTensor=o=>(i._OrtReleaseTensor=Y.Ta)(o),i._OrtCreateRunOptions=(o,p,m,y)=>(i._OrtCreateRunOptions=Y.Ua)(o,p,m,y),i._OrtAddRunConfigEntry=(o,p,m)=>(i._OrtAddRunConfigEntry=Y.Va)(o,p,m),i._OrtReleaseRunOptions=o=>(i._OrtReleaseRunOptions=Y.Wa)(o),i._OrtCreateBinding=o=>(i._OrtCreateBinding=Y.Xa)(o),i._OrtBindInput=(o,p,m)=>(i._OrtBindInput=Y.Ya)(o,p,m),i._OrtBindOutput=(o,p,m,y)=>(i._OrtBindOutput=Y.Za)(o,p,m,y),i._OrtClearBoundOutputs=o=>(i._OrtClearBoundOutputs=Y._a)(o),i._OrtReleaseBinding=o=>(i._OrtReleaseBinding=Y.$a)(o),i._OrtRunWithBinding=(o,p,m,y,v)=>(i._OrtRunWithBinding=Y.ab)(o,p,m,y,v),i._OrtRun=(o,p,m,y,v,T,B,N)=>(i._OrtRun=Y.bb)(o,p,m,y,v,T,B,N),i._OrtEndProfiling=o=>(i._OrtEndProfiling=Y.cb)(o),i._JsepOutput=(o,p,m)=>(i._JsepOutput=Y.db)(o,p,m),i._JsepGetNodeName=o=>(i._JsepGetNodeName=Y.eb)(o);var Tr=()=>(Tr=Y.fb)(),at=i._free=o=>(at=i._free=Y.gb)(o),Er=i._malloc=o=>(Er=i._malloc=Y.hb)(o),bi=(o,p,m,y,v,T)=>(bi=Y.kb)(o,p,m,y,v,T),zs=()=>(zs=Y.lb)(),Cs=(o,p,m,y,v)=>(Cs=Y.mb)(o,p,m,y,v),As=o=>(As=Y.nb)(o),wi=o=>(wi=Y.ob)(o),Os=(o,p)=>(Os=Y.pb)(o,p),Bs=()=>(Bs=Y.qb)(),Rs=(o,p)=>(Rs=Y.rb)(o,p),zr=o=>(zr=Y.sb)(o),$i=o=>($i=Y.tb)(o),vi=()=>(vi=Y.ub)(),Ms=i.dynCall_ii=(o,p)=>(Ms=i.dynCall_ii=Y.vb)(o,p),Ds=o=>(Ds=Y.wb)(o),Ns=()=>(Ns=Y.xb)(),Ps=o=>(Ps=Y.yb)(o),Us=()=>(Us=Y.zb)();return i.stackSave=()=>vi(),i.stackRestore=o=>zr(o),i.stackAlloc=o=>$i(o),i.setValue=function(o,p,m="i8"){switch(m.endsWith("*")&&(m="*"),m){case"i1":case"i8":P()[o>>>0]=p;break;case"i16":oe()[o>>>1>>>0]=p;break;case"i32":D()[o>>>2>>>0]=p;break;case"i64":j[o>>>3]=BigInt(p);break;case"float":We()[o>>>2>>>0]=p;break;case"double":Be()[o>>>3>>>0]=p;break;case"*":ge()[o>>>2>>>0]=p;break;default:ft(`invalid type for setValue: ${m}`)}},i.getValue=function(o,p="i8"){switch(p.endsWith("*")&&(p="*"),p){case"i1":case"i8":return P()[o>>>0];case"i16":return oe()[o>>>1>>>0];case"i32":return D()[o>>>2>>>0];case"i64":return j[o>>>3];case"float":return We()[o>>>2>>>0];case"double":return Be()[o>>>3>>>0];case"*":return ge()[o>>>2>>>0];default:ft(`invalid type for getValue: ${p}`)}},i.UTF8ToString=xe,i.stringToUTF8=Ut,i.lengthBytesUTF8=Vn,(function o(){if(0<kt)Qt=o;else if(l)a(i),tt();else{for(;0<ai.length;)ai.shift()(i);0<kt?Qt=o:(i.calledRun=!0,ae||(tt(),a(i)))}})(),i.PTR_SIZE=4,s}),Vd=Ci,Ls=(t=(e=globalThis.self)==null?void 0:e.name)==null?void 0:t.startsWith("em-pthread"),Ls&&Ci()}),Ai,Ea,Vs,Ne,jd,Ar,js,Gs,Oi,Hs,Bi,Gd,Ri,Hd,Ya=U(()=>{Xa(),Ai=typeof location>"u"?void 0:location.origin,Ea=import.meta.url>"file:"&&import.meta.url<"file;",Vs=()=>{{if(Ea){let e=URL;return new URL(new e("ort.webgpu.bundle.min.mjs",import.meta.url).href,Ai).href}return import.meta.url}},Ne=Vs(),jd=()=>{if(Ne&&!Ne.startsWith("blob:"))return Ne.substring(0,Ne.lastIndexOf("/")+1)},Ar=(e,t)=>{try{let r=t??Ne;return(r?new URL(e,r):new URL(e)).origin===Ai}catch{return!1}},js=(e,t)=>{let r=t??Ne;try{return(r?new URL(e,r):new URL(e)).href}catch{return}},Gs=(e,t)=>`${t??"./"}${e}`,Oi=async e=>{let t=await(await fetch(e,{credentials:"same-origin"})).blob();return URL.createObjectURL(t)},Hs=async e=>(await import(e)).default,Bi=(Jm(),gr(qd)).default,Gd=async()=>{if(!Ne)throw new Error("Failed to load proxy worker: cannot determine the script source URL.");if(Ar(Ne))return[void 0,Bi()];let e=await Oi(Ne);return[e,Bi(e)]},Ri=(eg(),gr(Ld)).default,Hd=async(e,t,r)=>{if(!e&&!t&&Ri&&Ne&&Ar(Ne))return[void 0,Ri];{let a="ort-wasm-simd-threaded.jsep.mjs",n=e??js(a,t),i=r&&n&&!Ar(n,t),s=i?await Oi(n):n??Gs(a,t);return[i?s:void 0,await Hs(s)]}}}),Mi,Or,rr,Di,Fs,Ks,Zs,Ja,ye,Nt=U(()=>{Ya(),Or=!1,rr=!1,Di=!1,Fs=()=>{if(typeof SharedArrayBuffer>"u")return!1;try{return typeof MessageChannel<"u"&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},Ks=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},Zs=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,19,1,17,0,65,1,253,15,65,2,253,15,65,3,253,15,253,147,2,11]))}catch{return!1}},Ja=async e=>{if(Or)return Promise.resolve();if(rr)throw new Error("multiple calls to 'initializeWebAssembly()' detected.");if(Di)throw new Error("previous call to 'initializeWebAssembly()' failed.");rr=!0;let t=e.initTimeout,r=e.numThreads;if(e.simd!==!1){if(e.simd==="relaxed"){if(!Zs())throw new Error("Relaxed WebAssembly SIMD is not supported in the current environment.")}else if(!Ks())throw new Error("WebAssembly SIMD is not supported in the current environment.")}let a=Fs();r>1&&!a&&(typeof self<"u"&&!self.crossOriginIsolated&&console.warn("env.wasm.numThreads is set to "+r+", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."),console.warn("WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."),e.numThreads=r=1);let n=e.wasmPaths,i=typeof n=="string"?n:void 0,s=n==null?void 0:n.mjs,u=(s==null?void 0:s.href)??s,d=n==null?void 0:n.wasm,l=(d==null?void 0:d.href)??d,c=e.wasmBinary,[f,h]=await Hd(u,i,r>1),g=!1,_=[];if(t>0&&_.push(new Promise(b=>{setTimeout(()=>{g=!0,b()},t)})),_.push(new Promise((b,x)=>{let $={numThreads:r};if(c)$.wasmBinary=c;else if(l||i)$.locateFile=w=>l??i+w;else if(u&&u.indexOf("blob:")!==0)$.locateFile=w=>new URL(w,u).href;else if(f){let w=jd();w&&($.locateFile=k=>w+k)}h($).then(w=>{rr=!1,Or=!0,Mi=w,b(),f&&URL.revokeObjectURL(f)},w=>{rr=!1,Di=!0,x(w)})})),await Promise.race(_),g)throw new Error(`WebAssembly backend initializing failed due to timeout: ${t}ms`)},ye=()=>{if(Or&&Mi)return Mi;throw new Error("WebAssembly is not initialized yet.")}}),Xe,Fr,me,en=U(()=>{Nt(),Xe=(e,t)=>{let r=ye(),a=r.lengthBytesUTF8(e)+1,n=r._malloc(a);return r.stringToUTF8(e,n,a),t.push(n),n},Fr=(e,t,r,a)=>{if(typeof e=="object"&&e!==null){if(r.has(e))throw new Error("Circular reference in options");r.add(e)}Object.entries(e).forEach(([n,i])=>{let s=t?t+n:n;if(typeof i=="object")Fr(i,s+".",r,a);else if(typeof i=="string"||typeof i=="number")a(s,i.toString());else if(typeof i=="boolean")a(s,i?"1":"0");else throw new Error(`Can't handle extra config type: ${typeof i}`)})},me=e=>{let t=ye(),r=t.stackSave();try{let a=t.PTR_SIZE,n=t.stackAlloc(2*a);t._OrtGetLastError(n,n+a);let i=Number(t.getValue(n,a===4?"i32":"i64")),s=t.getValue(n+a,"*"),u=s?t.UTF8ToString(s):"";throw new Error(`${e} ERROR_CODE: ${i}, ERROR_MESSAGE: ${u}`)}finally{t.stackRestore(r)}}}),Fd,tg=U(()=>{Nt(),en(),Fd=e=>{let t=ye(),r=0,a=[],n=e||{};try{if((e==null?void 0:e.logSeverityLevel)===void 0)n.logSeverityLevel=2;else if(typeof e.logSeverityLevel!="number"||!Number.isInteger(e.logSeverityLevel)||e.logSeverityLevel<0||e.logSeverityLevel>4)throw new Error(`log serverity level is not valid: ${e.logSeverityLevel}`);if((e==null?void 0:e.logVerbosityLevel)===void 0)n.logVerbosityLevel=0;else if(typeof e.logVerbosityLevel!="number"||!Number.isInteger(e.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${e.logVerbosityLevel}`);(e==null?void 0:e.terminate)===void 0&&(n.terminate=!1);let i=0;return(e==null?void 0:e.tag)!==void 0&&(i=Xe(e.tag,a)),r=t._OrtCreateRunOptions(n.logSeverityLevel,n.logVerbosityLevel,!!n.terminate,i),r===0&&me("Can't create run options."),(e==null?void 0:e.extra)!==void 0&&Fr(e.extra,"",new WeakSet,(s,u)=>{let d=Xe(s,a),l=Xe(u,a);t._OrtAddRunConfigEntry(r,d,l)!==0&&me(`Can't set a run config entry: ${s} - ${u}.`)}),[r,a]}catch(i){throw r!==0&&t._OrtReleaseRunOptions(r),a.forEach(s=>t._free(s)),i}}}),Qs,Xs,Ys,ir,Js,Kd,rg=U(()=>{Nt(),en(),Qs=e=>{switch(e){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"all":return 99;default:throw new Error(`unsupported graph optimization level: ${e}`)}},Xs=e=>{switch(e){case"sequential":return 0;case"parallel":return 1;default:throw new Error(`unsupported execution mode: ${e}`)}},Ys=e=>{e.extra||(e.extra={}),e.extra.session||(e.extra.session={});let t=e.extra.session;t.use_ort_model_bytes_directly||(t.use_ort_model_bytes_directly="1"),e.executionProviders&&e.executionProviders.some(r=>(typeof r=="string"?r:r.name)==="webgpu")&&(e.enableMemPattern=!1)},ir=(e,t,r,a)=>{let n=Xe(t,a),i=Xe(r,a);ye()._OrtAddSessionConfigEntry(e,n,i)!==0&&me(`Can't set a session config entry: ${t} - ${r}.`)},Js=async(e,t,r)=>{for(let a of t){let n=typeof a=="string"?a:a.name,i=[];switch(n){case"webnn":if(n="WEBNN",typeof a!="string"){let c=a==null?void 0:a.deviceType;c&&ir(e,"deviceType",c,r)}break;case"webgpu":if(n="JS",typeof a!="string"){let c=a;if(c!=null&&c.preferredLayout){if(c.preferredLayout!=="NCHW"&&c.preferredLayout!=="NHWC")throw new Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${c.preferredLayout}`);ir(e,"preferredLayout",c.preferredLayout,r)}}break;case"wasm":case"cpu":continue;default:throw new Error(`not supported execution provider: ${n}`)}let s=Xe(n,r),u=i.length,d=0,l=0;if(u>0){d=ye()._malloc(u*ye().PTR_SIZE),r.push(d),l=ye()._malloc(u*ye().PTR_SIZE),r.push(l);for(let c=0;c<u;c++)ye().setValue(d+c*ye().PTR_SIZE,i[c][0],"*"),ye().setValue(l+c*ye().PTR_SIZE,i[c][1],"*")}await ye()._OrtAppendExecutionProvider(e,s,d,l,u)!==0&&me(`Can't append execution provider: ${n}.`)}},Kd=async e=>{let t=ye(),r=0,a=[],n=e||{};Ys(n);try{let i=Qs(n.graphOptimizationLevel??"all"),s=Xs(n.executionMode??"sequential"),u=typeof n.logId=="string"?Xe(n.logId,a):0,d=n.logSeverityLevel??2;if(!Number.isInteger(d)||d<0||d>4)throw new Error(`log serverity level is not valid: ${d}`);let l=n.logVerbosityLevel??0;if(!Number.isInteger(l)||l<0||l>4)throw new Error(`log verbosity level is not valid: ${l}`);let c=typeof n.optimizedModelFilePath=="string"?Xe(n.optimizedModelFilePath,a):0;if(r=t._OrtCreateSessionOptions(i,!!n.enableCpuMemArena,!!n.enableMemPattern,s,!!n.enableProfiling,0,u,d,l,c),r===0&&me("Can't create session options."),n.executionProviders&&await Js(r,n.executionProviders,a),n.enableGraphCapture!==void 0){if(typeof n.enableGraphCapture!="boolean")throw new Error(`enableGraphCapture must be a boolean value: ${n.enableGraphCapture}`);ir(r,"enableGraphCapture",n.enableGraphCapture.toString(),a)}if(n.freeDimensionOverrides)for(let[f,h]of Object.entries(n.freeDimensionOverrides)){if(typeof f!="string")throw new Error(`free dimension override name must be a string: ${f}`);if(typeof h!="number"||!Number.isInteger(h)||h<0)throw new Error(`free dimension override value must be a non-negative integer: ${h}`);let g=Xe(f,a);t._OrtAddFreeDimensionOverride(r,g,h)!==0&&me(`Can't set a free dimension override: ${f} - ${h}.`)}return n.extra!==void 0&&Fr(n.extra,"",new WeakSet,(f,h)=>{ir(r,f,h,a)}),[r,a]}catch(i){throw r!==0&&t._OrtReleaseSessionOptions(r)!==0&&me("Can't release session options."),a.forEach(s=>t._free(s)),i}}}),Lt,dt,Ot,tn,Kr,rn,an,za,J=U(()=>{Lt=e=>{switch(e){case"int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"uint32":return 12;case"float16":return 10;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int64":return 7;case"uint64":return 13;case"int4":return 22;case"uint4":return 21;default:throw new Error(`unsupported data type: ${e}`)}},dt=e=>{switch(e){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:return"uint16";case 6:return"int32";case 12:return"uint32";case 10:return"float16";case 1:return"float32";case 11:return"float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";case 22:return"int4";case 21:return"uint4";default:throw new Error(`unsupported data type: ${e}`)}},Ot=(e,t)=>{let r=[-1,4,1,1,2,2,4,8,-1,1,2,8,4,8,-1,-1,-1,-1,-1,-1,-1,.5,.5][e],a=typeof t=="number"?t:t.reduce((n,i)=>n*i,1);return r>0?Math.ceil(a*r):void 0},tn=e=>{switch(e){case"float16":return typeof Float16Array<"u"&&Float16Array.from?Float16Array:Uint16Array;case"float32":return Float32Array;case"uint8":return Uint8Array;case"int8":return Int8Array;case"uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"bool":return Uint8Array;case"float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:throw new Error(`unsupported type: ${e}`)}},Kr=e=>{switch(e){case"verbose":return 0;case"info":return 1;case"warning":return 2;case"error":return 3;case"fatal":return 4;default:throw new Error(`unsupported logging level: ${e}`)}},rn=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",an=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint64"||e==="int8"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",za=e=>{switch(e){case"none":return 0;case"cpu":return 1;case"cpu-pinned":return 2;case"texture":return 3;case"gpu-buffer":return 4;case"ml-tensor":return 5;default:throw new Error(`unsupported data location: ${e}`)}}}),nn,Zd=U(()=>{Xa(),nn=async e=>{if(typeof e=="string"){let t=await fetch(e);if(!t.ok)throw new Error(`failed to load external data file: ${e}`);let r=t.headers.get("Content-Length"),a=r?parseInt(r,10):0;if(a<1073741824)return new Uint8Array(await t.arrayBuffer());{if(!t.body)throw new Error(`failed to load external data file: ${e}, no response body.`);let n=t.body.getReader(),i;try{i=new ArrayBuffer(a)}catch(u){if(u instanceof RangeError){let d=Math.ceil(a/65536);i=new WebAssembly.Memory({initial:d,maximum:d}).buffer}else throw u}let s=0;for(;;){let{done:u,value:d}=await n.read();if(u)break;let l=d.byteLength;new Uint8Array(i,s,l).set(d),s+=l}return new Uint8Array(i,0,a)}}else return e instanceof Blob?new Uint8Array(await e.arrayBuffer()):e instanceof Uint8Array?e:new Uint8Array(e)}}),eo,to,ro,io,sn,ao,le,ct=U(()=>{J(),eo=["V","I","W","E","F"],to=(e,t)=>{console.log(`[${eo[e]},${new Date().toISOString()}]${t}`)},sn=(e,t)=>{ro=e,io=t},ao=(e,t)=>{let r=Kr(e),a=Kr(ro);r>=a&&to(r,typeof t=="function"?t():t)},le=(...e)=>{io&&ao(...e)}}),no,Gt,C,Zr,Qd,Xd,Yd,re=U(()=>{no=class{static calcMatMulShape(e,t){return e[1]!==t[0]?void 0:[e[0],t[1]]}},Gt=class{static calcShape(e,t,r=!1){let a=e.length,n=t.length;if(a===0)return t;if(n===0)return e;let i=Math.max(e.length,t.length),s=new Array(i);if(r){if(a<2||n<2)return;let u=no.calcMatMulShape([e[a-2],e[a-1]],[t[n-2],t[n-1]]);if(u===void 0)return;[s[i-2],s[i-1]]=u}for(let u=r?3:1;u<=i;u++){let d=a-u<0?1:e[a-u],l=n-u<0?1:t[n-u];if(d!==l&&d>1&&l>1)return;let c=Math.max(d,l);if(d&&l)s[i-u]=Math.max(d,l);else{if(c>1)return;s[i-u]=0}}return s}static isValidBroadcast(e,t){let r=e.length,a=t.length;if(r>a)return!1;for(let n=1;n<=r;n++)if(e[r-n]!==1&&e[r-n]!==t[a-n])return!1;return!0}},C=class jr{static size(t){return jr.getSizeFromDimensionRange(t,0,t.length)}static convertShape(t,r=4){let a=t.length;if(a===0)return[];let n=new Array(a),i=a-1;for(;i>=0;){if(t[i]%r===0){n[i]=t[i]/r;break}if(r%t[i]!==0)throw new Error("cannot convert shape");n[i]=1,r/=t[i],i--}for(i--;i>=0;i--)n[i]=t[i];return n}static sizeFromDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeFromDimension as Tensor has ${t.length} dimensions.`);return jr.getSizeFromDimensionRange(t,r,t.length)}static sizeToDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeToDimension as Tensor has ${t.length} dimensions.`);return jr.getSizeFromDimensionRange(t,0,r)}static getSizeFromDimensionRange(t,r,a){let n=1;for(let i=r;i<a;i++){if(t[i]<0)throw new Error("cannot get valid size from specified dimension range. Most likely the range contains negative values in them.");n*=Number(t[i])}return n}static computeStrides(t){let r=t.length;if(r===0)return[];if(r===1)return[1];let a=new Array(r);a[r-1]=1,a[r-2]=t[r-1];for(let n=r-3;n>=0;--n)a[n]=a[n+1]*t[n+1];return a}static normalizeAxis(t,r){if(t<-r&&t>=r)throw new Error("unsupported axis for this operation.");return t<0?t+r:t}static normalizeAxes(t,r){return t.map(a=>this.normalizeAxis(a,r??t.length))}static sortBasedOnPerm(t,r){return r?r.map(a=>t[a]):t.slice().reverse()}static padShape(t,r){let a=t.length;return t.map((n,i)=>n+r[i]+r[i+a])}static areEqual(t,r){return t.length!==r.length?!1:t.every((a,n)=>a===r[n])}},Zr=class cr{static adjustPoolAttributes(t,r,a,n,i,s){if(!t&&a.length!==r.length-2)throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");if(t)for(let u=0;u<r.length-2;u++)u>=a.length?a.push(r[u+2]):a[u]=r[u+2];for(let u=0;u<a.length;u++)if(u<n.length){if(n[u]<0)throw new Error("strides should be greater than or equal to 1")}else n.push(1);for(let u=0;u<a.length;u++)if(u<i.length){if(i[u]<0)throw new Error("dilations should be greater than or equal to 1")}else i.push(1);for(let u=0;u<a.length*2;u++)if(u<s.length){if(s[u]<0)throw new Error("pad should be greater than or equal to 1")}else s.push(0);for(let u=0;u<a.length;u++){if(a[u]<=0)throw new Error("kernel shapes need to be greater than 0");if(s[u]>=a[u]||s[u+a.length]>=a[u])throw new Error("pads should be smaller than kernel")}}static adjustPadsBasedOnAutoPad(t,r,a,n,i,s,u){if(u){if(i.length!==2*(t.length-2))throw new Error("length of pads should be twice the length of data dimensions");if(r.length!==t.length-2)throw new Error("length of strides should be the length of data dimensions");if(n.length!==t.length-2)throw new Error("length of kernel shapes should be the length of data dimensions");for(let d=0;d<t.length-2;d++)cr.adjustPadAndReturnShape(t[d+(s?1:2)],r[d],a[d],n[d],i,d,d+t.length-2,u)}}static computePoolOutputShape(t,r,a,n,i,s,u){if(r.length<=0)throw new Error("input shape must be of size greater than 0");let d=[r[0],r[1]];return cr.computeShapeHelper(t,r,d,a,n,i,s,u),d}static computeConvOutputShape(t,r,a,n,i,s,u){if(t.length<=0||r.length<=0)throw new Error("invalid input tensor dims or invalid filter tensor dims");let d=[t[0],r[0]];return cr.computeShapeHelper(!1,t,d,a,n,i,s,u),d}static computeShapeHelper(t,r,a,n,i,s,u,d){if(t)for(let l=0;l<r.length-2;l++)a.push(1);else for(let l=0;l<r.length-2;l++)a.push(cr.adjustPadAndReturnShape(r[l+2],n[l],i[l],s[l],u,l,l+r.length-2,d))}static adjustPadAndReturnShape(t,r,a,n,i,s,u,d){let l=a*(n-1)+1;if(d&&d!=="NOTSET")switch(d){case"VALID":return i[s]=0,i[u]=0,Math.floor((t-l)/r+1);case"SAME_LOWER":case"SAME_UPPER":if(a!==1)throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");{let c=((t+r-1)/r-1)*r+n-t;return i[s]=Math.floor(d==="SAME_LOWER"?(c+1)/2:c/2),i[u]=c-i[s],Math.floor((t+c-n)/r+1)}default:throw new Error("Unsupported AutoPad type")}else return Math.floor((t+i[s]+i[u]-l)/r+1)}},Qd=class{static getShapeOfGemmResult(e,t,r,a,n){if(e.length!==2||r.length!==2)throw new Error("shape need to be of size 2");let i,s,u;t?(i=e[1],s=e[0]):(i=e[0],s=e[1]);let d=-1;if(a?(u=r[0],d=1):(u=r[1],d=0),r[d]!==s)throw new Error("dimension mismatch");if(i<=0||u<=0||s<=0)throw new Error("invalid shape specified");if(n&&!Gt.isValidBroadcast(n,[i,u]))throw new Error("gemm: invalid bias shape for broadcast");return[i,u,s]}},Xd=-34028234663852886e22,Yd=34028234663852886e22}),on,Jd=U(()=>{J(),on=(e,t)=>new(tn(t))(e)}),Ca,Ni,so,Pi,oo,Ui,qi,Wi,uo,ep,ig=U(()=>{ct(),Ca=(e,t=!0)=>{if(e.byteLength%8!==0)throw new Error("Invalid Uint8Array length - must be a multiple of 8 (BigInt).");let r=e.byteLength/8,a=new BigInt64Array(e.buffer,e.byteOffset,r),n=new Int32Array(r);for(let i=0;i<r;i++){let s=a[i];if(s>2147483647n||s<-2147483648n)throw new Error(`Overflow occurred when converting BigInt to Int32 at index ${i}: ${s}`);n[i]=Number(s)}return t?new Uint8Array(n.buffer):n},Ni=(e,t=!0)=>{if(e.byteLength%4!==0)throw new Error("Invalid Uint8Array length - must be a multiple of 4 (Int32).");let r=e.byteLength/4,a=new Int32Array(e.buffer,e.byteOffset,r),n=BigInt64Array.from(a,BigInt);return t?new Uint8Array(n.buffer):n},so=1,Pi=()=>so++,oo=new Map([["float32",32],["float16",16],["int32",32],["uint32",32],["int64",64],["uint64",64],["int8",8],["uint8",8],["int4",4],["uint4",4]]),Ui=(e,t)=>{let r=oo.get(e);if(!r)throw new Error("Unsupported data type.");return t.length>0?Math.ceil(t.reduce((a,n)=>a*n)*r/8):0},qi=class{constructor(e){this.shouldConvertInt64toInt32=!1,this.isInt64ToInt32Converted=!1;let{sessionId:t,context:r,tensor:a,dataType:n,shape:i,shouldConvertInt64toInt32:s=!1}=e;this.sessionId=t,this.mlContext=r,this.mlTensor=a,this.dataType=n,this.tensorShape=i,this.shouldConvertInt64toInt32=s}get tensor(){return this.mlTensor}get type(){return this.dataType}get shape(){return this.tensorShape}get byteLength(){return Ui(this.dataType,this.tensorShape)}destroy(){le("verbose",()=>"[WebNN] TensorWrapper.destroy"),this.mlTensor.destroy()}write(e){this.mlContext.writeTensor(this.mlTensor,e)}async read(e,t){if(e){let r=await this.mlContext.readTensor(this.mlTensor),a=Ni(new Uint8Array(r));if(t){(t instanceof ArrayBuffer?new Uint8Array(t):new Uint8Array(t.buffer,t.byteOffset,t.byteLength)).set(a);return}else return a.buffer}else return t?this.mlContext.readTensor(this.mlTensor,t):this.mlContext.readTensor(this.mlTensor)}canReuseTensor(e,t,r){return this.mlContext===e&&this.dataType===t&&this.tensorShape.length===r.length&&this.tensorShape.every((a,n)=>a===r[n])}setIsInt64ToInt32Converted(e){this.isInt64ToInt32Converted=e}},Wi=class{constructor(e,t){this.tensorManager=e,this.wrapper=t}get tensorWrapper(){return this.wrapper}releaseTensor(){this.tensorWrapper&&(this.tensorManager.releaseTensor(this.tensorWrapper),this.wrapper=void 0)}async ensureTensor(e,t,r,a){let n=t,i=this.tensorManager.getMLContext(e),s=n==="int64"&&!i.opSupportLimits().input.dataTypes.includes("int64");if(s&&(n="int32",le("verbose",()=>"[WebNN] TensorIdTracker.ensureTensor: convert dataType from int64 to int32")),this.wrapper){if(this.wrapper.canReuseTensor(i,n,r))return this.wrapper.tensor;if(a){if(this.wrapper.byteLength!==Ui(n,r))throw new Error("Unable to copy data to tensor with different size.");this.activeUpload=new Uint8Array(await this.wrapper.read())}this.tensorManager.releaseTensor(this.wrapper)}let u=typeof MLTensorUsage>"u"?void 0:MLTensorUsage.READ|MLTensorUsage.WRITE;return this.wrapper=await this.tensorManager.getCachedTensor(e,n,r,u,!0,!0,s),a&&this.activeUpload&&(this.wrapper.write(this.activeUpload),this.activeUpload=void 0),this.wrapper.tensor}upload(e){let t=e;if(this.wrapper)if(this.wrapper.shouldConvertInt64toInt32&&(t=Ca(e,!0),this.wrapper.setIsInt64ToInt32Converted(!0)),t.byteLength===this.wrapper.byteLength){this.wrapper.write(t);return}else le("verbose",()=>"Data size does not match tensor size. Releasing tensor."),this.releaseTensor();this.activeUpload?this.activeUpload.set(t):this.activeUpload=new Uint8Array(t)}async download(e){var t,r,a;if(this.activeUpload){let n=(t=this.wrapper)!=null&&t.isInt64ToInt32Converted?Ni(this.activeUpload):this.activeUpload;if(e){e instanceof ArrayBuffer?new Uint8Array(e).set(n):new Uint8Array(e.buffer,e.byteOffset,e.byteLength).set(n);return}else return n.buffer}if(!this.wrapper)throw new Error("Tensor has not been created.");return e?this.wrapper.read((r=this.wrapper)==null?void 0:r.shouldConvertInt64toInt32,e):this.wrapper.read((a=this.wrapper)==null?void 0:a.shouldConvertInt64toInt32)}},uo=class{constructor(e){this.backend=e,this.tensorTrackersById=new Map,this.freeTensors=[],this.externalTensors=new Set}getMLContext(e){let t=this.backend.getMLContext(e);if(!t)throw new Error("MLContext not found for session.");return t}reserveTensorId(){let e=Pi();return this.tensorTrackersById.set(e,new Wi(this)),e}releaseTensorId(e){let t=this.tensorTrackersById.get(e);t&&(this.tensorTrackersById.delete(e),t.tensorWrapper&&this.releaseTensor(t.tensorWrapper))}async ensureTensor(e,t,r,a,n){le("verbose",()=>`[WebNN] TensorManager.ensureTensor {tensorId: ${t}, dataType: ${r}, shape: ${a}, copyOld: ${n}}`);let i=this.tensorTrackersById.get(t);if(!i)throw new Error("Tensor not found.");return i.ensureTensor(e,r,a,n)}upload(e,t){let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");r.upload(t)}async download(e,t){le("verbose",()=>`[WebNN] TensorManager.download {tensorId: ${e}, dstBuffer: ${t==null?void 0:t.byteLength}}`);let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");return r.download(t)}releaseTensorsForSession(e){for(let t of this.freeTensors)t.sessionId===e&&t.destroy();this.freeTensors=this.freeTensors.filter(t=>t.sessionId!==e)}registerTensor(e,t,r,a){let n=this.getMLContext(e),i=Pi(),s=new qi({sessionId:e,context:n,tensor:t,dataType:r,shape:a});return this.tensorTrackersById.set(i,new Wi(this,s)),this.externalTensors.add(s),i}async getCachedTensor(e,t,r,a,n,i,s=!1){let u=this.getMLContext(e);for(let[l,c]of this.freeTensors.entries())if(c.canReuseTensor(u,t,r)){le("verbose",()=>`[WebNN] Reusing tensor {dataType: ${t}, shape: ${r}}`);let f=this.freeTensors.splice(l,1)[0];return f.sessionId=e,f}le("verbose",()=>`[WebNN] MLContext.createTensor {dataType: ${t}, shape: ${r}}`);let d=await u.createTensor({dataType:t,shape:r,dimensions:r,usage:a,writable:n,readable:i});return new qi({sessionId:e,context:u,tensor:d,dataType:t,shape:r,shouldConvertInt64toInt32:s})}releaseTensor(e){this.externalTensors.has(e)&&this.externalTensors.delete(e),this.freeTensors.push(e)}},ep=(...e)=>new uo(...e)}),Br,lo,tp,ag=U(()=>{J(),Nt(),Jd(),ig(),ct(),Br=new Map([[1,"float32"],[10,"float16"],[6,"int32"],[12,"uint32"],[7,"int64"],[13,"uint64"],[22,"int4"],[21,"uint4"],[3,"int8"],[2,"uint8"],[9,"uint8"]]),lo=(e,t)=>{if(e===t)return!0;if(e===void 0||t===void 0)return!1;let r=Object.keys(e).sort(),a=Object.keys(t).sort();return r.length===a.length&&r.every((n,i)=>n===a[i]&&e[n]===t[n])},tp=class{constructor(e){this.tensorManager=ep(this),this.mlContextBySessionId=new Map,this.sessionIdsByMLContext=new Map,this.mlContextCache=[],this.sessionGraphInputs=new Map,this.temporaryGraphInputs=[],this.temporarySessionTensorIds=new Map,sn(e.logLevel,!!e.debug)}get currentSessionId(){if(this.activeSessionId===void 0)throw new Error("No active session");return this.activeSessionId}onRunStart(e){le("verbose",()=>`[WebNN] onRunStart {sessionId: ${e}}`),this.activeSessionId=e}onRunEnd(e){le("verbose",()=>`[WebNN] onRunEnd {sessionId: ${e}}`);let t=this.temporarySessionTensorIds.get(e);if(t){for(let r of t)le("verbose",()=>`[WebNN] releasing temporary tensor {tensorId: ${r}}`),this.tensorManager.releaseTensorId(r);this.temporarySessionTensorIds.delete(e),this.activeSessionId=void 0}}async createMLContext(e){if(e instanceof GPUDevice){let r=this.mlContextCache.findIndex(a=>a.gpuDevice===e);if(r!==-1)return this.mlContextCache[r].mlContext;{let a=await navigator.ml.createContext(e);return this.mlContextCache.push({gpuDevice:e,mlContext:a}),a}}else if(e===void 0){let r=this.mlContextCache.findIndex(a=>a.options===void 0&&a.gpuDevice===void 0);if(r!==-1)return this.mlContextCache[r].mlContext;{let a=await navigator.ml.createContext();return this.mlContextCache.push({mlContext:a}),a}}let t=this.mlContextCache.findIndex(r=>lo(r.options,e));if(t!==-1)return this.mlContextCache[t].mlContext;{let r=await navigator.ml.createContext(e);return this.mlContextCache.push({options:e,mlContext:r}),r}}registerMLContext(e,t){this.mlContextBySessionId.set(e,t);let r=this.sessionIdsByMLContext.get(t);r||(r=new Set,this.sessionIdsByMLContext.set(t,r)),r.add(e),this.temporaryGraphInputs.length>0&&(this.sessionGraphInputs.set(e,this.temporaryGraphInputs),this.temporaryGraphInputs=[])}onReleaseSession(e){this.sessionGraphInputs.delete(e);let t=this.mlContextBySessionId.get(e);if(!t)return;this.tensorManager.releaseTensorsForSession(e),this.mlContextBySessionId.delete(e);let r=this.sessionIdsByMLContext.get(t);if(r.delete(e),r.size===0){this.sessionIdsByMLContext.delete(t);let a=this.mlContextCache.findIndex(n=>n.mlContext===t);a!==-1&&this.mlContextCache.splice(a,1)}}getMLContext(e){return this.mlContextBySessionId.get(e)}reserveTensorId(){return this.tensorManager.reserveTensorId()}releaseTensorId(e){le("verbose",()=>`[WebNN] releaseTensorId {tensorId: ${e}}`),this.tensorManager.releaseTensorId(e)}async ensureTensor(e,t,r,a,n){let i=Br.get(r);if(!i)throw new Error(`Unsupported ONNX data type: ${r}`);return this.tensorManager.ensureTensor(e??this.currentSessionId,t,i,a,n)}async createTemporaryTensor(e,t,r){le("verbose",()=>`[WebNN] createTemporaryTensor {onnxDataType: ${t}, shape: ${r}}`);let a=Br.get(t);if(!a)throw new Error(`Unsupported ONNX data type: ${t}`);let n=this.tensorManager.reserveTensorId();await this.tensorManager.ensureTensor(e,n,a,r,!1);let i=this.temporarySessionTensorIds.get(e);return i?i.push(n):this.temporarySessionTensorIds.set(e,[n]),n}uploadTensor(e,t){if(!ye().shouldTransferToMLTensor)throw new Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");le("verbose",()=>`[WebNN] uploadTensor {tensorId: ${e}, data: ${t.byteLength}}`),this.tensorManager.upload(e,t)}async downloadTensor(e,t){return this.tensorManager.download(e,t)}createMLTensorDownloader(e,t){return async()=>{let r=await this.tensorManager.download(e);return on(r,t)}}registerMLTensor(e,t,r,a){let n=Br.get(r);if(!n)throw new Error(`Unsupported ONNX data type: ${r}`);let i=this.tensorManager.registerTensor(e,t,n,a);return le("verbose",()=>`[WebNN] registerMLTensor {tensor: ${t}, dataType: ${n}, dimensions: ${a}} -> {tensorId: ${i}}`),i}registerMLConstant(e,t,r,a,n,i,s=!1){if(!i)throw new Error("External mounted files are not available.");let u=e;e.startsWith("./")&&(u=e.substring(2));let d=i.get(u);if(!d)throw new Error(`File with name ${u} not found in preloaded files.`);if(t+r>d.byteLength)throw new Error("Out of bounds: data offset and length exceed the external file data size.");let l=d.slice(t,t+r).buffer,c;switch(n.dataType){case"float32":c=new Float32Array(l);break;case"float16":c=typeof Float16Array<"u"&&Float16Array.from?new Float16Array(l):new Uint16Array(l);break;case"int32":c=new Int32Array(l);break;case"uint32":c=new Uint32Array(l);break;case"int64":s?(c=Ca(new Uint8Array(l),!1),n.dataType="int32"):c=new BigInt64Array(l);break;case"uint64":c=new BigUint64Array(l);break;case"int8":c=new Int8Array(l);break;case"int4":case"uint4":case"uint8":c=new Uint8Array(l);break;default:throw new Error(`Unsupported data type: ${n.dataType} in creating WebNN Constant from external data.`)}return le("verbose",()=>`[WebNN] registerMLConstant {dataType: ${n.dataType}, shape: ${n.shape}}} ${s?"(Note: it was int64 data type and registered to int32 as workaround)":""}`),a.constant(n,c)}registerGraphInput(e){this.temporaryGraphInputs.push(e)}isGraphInput(e,t){let r=this.sessionGraphInputs.get(e);return r?r.includes(t):!1}isInt64Supported(e){var t;return!!((t=this.mlContextBySessionId.get(e))!=null&&t.opSupportLimits().input.dataTypes.includes("int64"))}flush(){}}}),un=U(()=>{}),Li,Rr,Mr,po,co,Vi,Aa,fo,rp,ng=U(()=>{ct(),un(),Li=new Map([[64,250],[128,200],[256,200],[512,200],[2048,230],[4096,200],[8192,50],[16384,50],[32768,50],[65536,50],[131072,50],[262144,50],[524288,50],[1048576,50],[2097152,30],[4194304,20],[8388608,10],[12582912,10],[16777216,10],[26214400,15],[33554432,22],[44236800,2],[58982400,6],[67108864,6],[134217728,6],[167772160,6]]),Rr=[],Mr=e=>Math.ceil(Number(e)/16)*16,po=e=>{for(let t=0;t<Rr.length;t++){let r=Rr[t];if(e<=r)return r}return Math.ceil(e/16)*16},co=1,Vi=()=>co++,Aa=async(e,t,r,a)=>{let n=Mr(r),i=e.device.createBuffer({size:n,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});try{let s=e.getCommandEncoder();e.endComputePass(),s.copyBufferToBuffer(t,0,i,0,n),e.flush(),await i.mapAsync(GPUMapMode.READ);let u=i.getMappedRange();if(a){let d=a();return d.set(new Uint8Array(u,0,r)),d}else return new Uint8Array(u.slice(0,r))}finally{i.destroy()}},fo=class{constructor(e){this.backend=e,this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.buffersPending=[],this.capturedPendingBuffers=new Map;for(let[t]of Li)Rr.push(t),this.freeBuffers.set(t,[]),this.freeUniformBuffers.set(t,[]);this.sessionCount=0}upload(e,t){let r=t.buffer,a=t.byteOffset,n=t.byteLength,i=Mr(n),s=this.storageCache.get(e);if(!s)throw new Error("gpu data for uploading does not exist");if(Number(s.originalSize)!==n)throw new Error(`inconsistent data size. gpu data size=${s.originalSize}, data size=${n}`);let u=this.backend.device.createBuffer({mappedAtCreation:!0,size:i,usage:GPUBufferUsage.MAP_WRITE|GPUBufferUsage.COPY_SRC}),d=u.getMappedRange();new Uint8Array(d).set(new Uint8Array(r,a,n)),u.unmap();let l=this.backend.device.createCommandEncoder();l.copyBufferToBuffer(u,0,s.gpuData.buffer,0,i),this.backend.device.queue.submit([l.finish()]),u.destroy(),le("verbose",()=>`[WebGPU] GpuDataManager.upload(id=${e})`)}memcpy(e,t){let r=this.storageCache.get(e);if(!r)throw new Error("source gpu data for memcpy does not exist");let a=this.storageCache.get(t);if(!a)throw new Error("destination gpu data for memcpy does not exist");if(r.originalSize!==a.originalSize)throw new Error("inconsistent source and destination gpu data size");let n=Mr(r.originalSize),i=this.backend.getCommandEncoder();this.backend.endComputePass(),i.copyBufferToBuffer(r.gpuData.buffer,0,a.gpuData.buffer,0,n)}registerExternalBuffer(e,t,r){let a;if(r){if(a=r[0],e===r[1])return le("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${a}, buffer is the same, skip.`),a;if(this.backend.capturedCommandList.has(this.backend.currentSessionId))throw new Error(`Registering a different external buffer under graph capture mode is not supported yet.
             Please use the previous external buffer!`)}else a=Vi();return this.storageCache.set(a,{gpuData:{id:a,type:0,buffer:e},originalSize:t}),le("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${a}, registered.`),a}unregisterExternalBuffer(e){e!==void 0&&(this.storageCache.delete(e),le("verbose",()=>`[WebGPU] GpuDataManager.unregisterExternalBuffer() => id=${e}`))}create(e,t=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST){let r=po(e),a,n=(t&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE,i=(t&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM;if(n||i){let u=(n?this.freeBuffers:this.freeUniformBuffers).get(r);u?u.length>0?a=u.pop():a=this.backend.device.createBuffer({size:r,usage:t}):a=this.backend.device.createBuffer({size:r,usage:t})}else a=this.backend.device.createBuffer({size:r,usage:t});let s={id:Vi(),type:0,buffer:a};return this.storageCache.set(s.id,{gpuData:s,originalSize:Number(e)}),le("verbose",()=>`[WebGPU] GpuDataManager.create(size=${e}) => id=${s.id}`),s}get(e){var t;return(t=this.storageCache.get(e))==null?void 0:t.gpuData}release(e){let t=typeof e=="bigint"?Number(e):e,r=this.storageCache.get(t);if(!r){if(this.storageCache.size===0)return 0;throw new Error("releasing data does not exist")}return le("verbose",()=>`[WebGPU] GpuDataManager.release(id=${t}), gpuDataId=${r.gpuData.id}`),this.storageCache.delete(t),this.buffersPending.push(r.gpuData.buffer),r.originalSize}async download(e,t){let r=this.storageCache.get(Number(e));if(!r)throw new Error("data does not exist");await Aa(this.backend,r.gpuData.buffer,r.originalSize,t)}refreshPendingBuffers(){if(this.buffersPending.length!==0)if(this.backend.sessionStatus==="default"){for(let e of this.buffersPending){let t=Li.get(e.size);if((e.usage&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE){let r=this.freeBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else if((e.usage&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM){let r=this.freeUniformBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else e.destroy()}this.buffersPending=[]}else{let e=this.capturedPendingBuffers.get(this.backend.currentSessionId);e||(e=[],this.capturedPendingBuffers.set(this.backend.currentSessionId,e));for(let t of this.buffersPending)e.push(t);this.buffersPending=[]}}dispose(){this.freeBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.freeUniformBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache.forEach(e=>{e.gpuData.buffer.destroy()}),this.capturedPendingBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.capturedPendingBuffers=new Map}onCreateSession(){this.sessionCount+=1}onReleaseSession(e){let t=this.capturedPendingBuffers.get(e);t&&(t.forEach(r=>{r.destroy()}),this.capturedPendingBuffers.delete(e)),this.sessionCount-=1,this.sessionCount===0&&(le("warning",()=>"[WebGPU] Clearing webgpu buffer cache"),this.storageCache.forEach(r=>{r.gpuData.buffer.destroy()}),this.storageCache=new Map)}},rp=(...e)=>new fo(...e)}),ho,fe,ve=U(()=>{ho=class{constructor(e){Object.assign(this,e)}get cacheKey(){return this.key||(this.key=Object.getOwnPropertyNames(this).sort().map(e=>`${this[e]}`).join(";")),this.key}},fe=e=>new ho(e)}),Ht,Dr,ke,Ae,X,$e,Oa,jt,vt,F,ar,R,H,ip,ln,mo,ap,ie=U(()=>{J(),re(),Ht=64,Dr=(e,t)=>{if(t===3)throw new Error("vec3 has same alignment as vec4, use vec4 instead");switch(Number(e)){case 10:return t>1?`vec${t}<f16>`:"f16";case 1:return t>1?`vec${t}<f32>`:"f32";case 6:return t>1?`vec${t}<i32>`:"i32";case 12:return t>1?`vec${t}<u32>`:"u32";case 7:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","i32"];case 13:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","u32"];case 9:if(t!==4)throw new Error("bool must be vec4");return["u32","vec4<bool>"];case 22:return"i32";case 21:return"u32";default:throw new Error(`Unknown data type: ${e}`)}},ke=(e,t=1)=>{let r=Dr(e,t);return typeof r=="string"?r:r[0]},Ae=(e,t=1)=>{let r=Dr(e,t);return typeof r=="string"?r:r[1]},X=(...e)=>{let t=[];return e.forEach(r=>{r.length!==0&&t.push({type:12,data:r},{type:12,data:C.computeStrides(r)})}),t},$e=e=>e%4===0?4:e%2===0?2:1,Oa=(e="f32",t,r="0")=>!t||t===1?`${e}(${r})`:`vec${t}<${e}>(${r})`,jt=(e,t,r)=>e==="f32"?r:t===1?`f32(${r})`:`vec${t}<f32>(${r})`,vt=(e,t)=>t===4?`(${e}.x + ${e}.y + ${e}.z + ${e}.w)`:t===2?`(${e}.x + ${e}.y)`:t===3?`(${e}.x + ${e}.y + ${e}.z)`:e,F=(e,t,r,a)=>e.startsWith("uniforms.")&&r>4?typeof t=="string"?a==="f16"?`${e}[(${t}) / 8][(${t}) % 8 / 4][(${t}) % 8 % 4]`:`${e}[(${t}) / 4][(${t}) % 4]`:a==="f16"?`${e}[${Math.floor(t/8)}][${Math.floor(t%8/4)}][${t%8%4}]`:`${e}[${Math.floor(t/4)}][${t%4}]`:r>1?`${e}[${t}]`:e,ar=(e,t,r,a,n)=>{let i=typeof r=="number",s=i?r:r.length,u=[...new Array(s).keys()],d=s<2?"u32":s<=4?`vec${s}<u32>`:`array<u32, ${s}>`,l=Dr(t,n),c=typeof l=="string"?l:l[1],f=typeof l=="string"?l:l[0],h={indices:d,value:c,storage:f,tensor:t},g=M=>typeof M=="string"?M:`${M}u`,_={offsetToIndices:!1,indicesToOffset:!1,broadcastedIndicesToOffset:!1,set:!1,setByIndices:!1,get:!1,getByIndices:!1},b=i?"uniforms.":"",x=`${b}${e}_shape`,$=`${b}${e}_strides`,w="";for(let M=0;M<s-1;M++)w+=`
    let dim${M} = current / ${F($,M,s)};
    let rest${M} = current % ${F($,M,s)};
    indices[${M}] = dim${M};
    current = rest${M};
    `;w+=`indices[${s-1}] = current;`;let k=s<2?"":`
  fn o2i_${e}(offset: u32) -> ${h.indices} {
    var indices: ${h.indices};
    var current = offset;
    ${w}
    return indices;
  }`,S=M=>(_.offsetToIndices=!0,s<2?M:`o2i_${e}(${M})`),I=[];if(s>=2)for(let M=s-1;M>=0;M--)I.push(`${F($,M,s)} * (indices[${M}])`);let E=s<2?"":`
  fn i2o_${e}(indices: ${h.indices}) -> u32 {
    return ${I.join("+")};
  }`,z=M=>(_.indicesToOffset=!0,s<2?M:`i2o_${e}(${M})`),A=(...M)=>s===0?"0u":`${h.indices}(${M.map(g).join(",")})`,O=(M,P)=>s<2?`${M}`:`${F(M,P,s)}`,q=(M,P,G)=>s<2?`${M}=${G};`:`${F(M,P,s)}=${G};`,K={},W=(M,P)=>{_.broadcastedIndicesToOffset=!0;let G=`${P.name}broadcastedIndicesTo${e}Offset`;if(G in K)return`${G}(${M})`;let oe=[];for(let Ie=s-1;Ie>=0;Ie--){let D=P.indicesGet("outputIndices",Ie+P.rank-s);oe.push(`${O($,Ie)} * (${D} % ${O(x,Ie)})`)}return K[G]=`fn ${G}(outputIndices: ${P.type.indices}) -> u32 {
             return ${oe.length>0?oe.join("+"):"0u"};
           }`,`${G}(${M})`},Z=(M,P)=>(()=>{if(h.storage===h.value)return`${e}[${M}]=${P};`;if(h.storage==="vec2<u32>"&&h.value==="i32")return`${e}[${M}]=vec2<u32>(u32(${P}), select(0u, 0xFFFFFFFFu, ${P} < 0));`;if(h.storage==="vec2<u32>"&&h.value==="u32")return`${e}[${M}]=vec2<u32>(u32(${P}), 0u);`;if(h.storage==="u32"&&h.value==="vec4<bool>")return`${e}[${M}]=dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(${P}));`;throw new Error(`not supported combination of storage type ${h.storage} and value type ${h.value} yet`)})(),ue=M=>(()=>{if(h.storage===h.value)return`${e}[${M}]`;if(h.storage==="vec2<u32>"&&h.value==="i32")return`i32(${e}[${M}].x)`;if(h.storage==="vec2<u32>"&&h.value==="u32")return`u32(${e}[${M}].x)`;if(h.storage==="u32"&&h.value==="vec4<bool>")return`vec4<bool>(bool(${e}[${M}] & 0xFFu), bool(${e}[${M}] & 0xFF00u), bool(${e}[${M}] & 0xFF0000u), bool(${e}[${M}] & 0xFF000000u))`;throw new Error(`not supported combination of storage type ${h.storage} and value type ${h.value} yet`)})(),ee=s<2?"":`
  fn get_${e}ByIndices(indices: ${h.indices}) -> ${c} {
    return ${ue(`i2o_${e}(indices)`)};
  }`,j=s<2?"":(()=>{let M=u.map(G=>`d${G}: u32`).join(", "),P=u.map(G=>`d${G}`).join(", ");return`
  fn get_${e}(${M}) -> ${c} {
    return get_${e}ByIndices(${A(P)});
  }`})(),L=(...M)=>{if(M.length!==s)throw new Error(`indices length must be ${s}`);let P=M.map(g).join(",");return s===0?ue("0u"):s===1?ue(P[0]):(_.get=!0,_.getByIndices=!0,_.indicesToOffset=!0,`get_${e}(${P})`)},de=M=>s<2?ue(M):(_.getByIndices=!0,_.indicesToOffset=!0,`get_${e}ByIndices(${M})`),te=s<2?"":`
  fn set_${e}ByIndices(indices: ${h.indices}, value: ${c}) {
    ${Z(`i2o_${e}(indices)`,"value")}
  }`,ae=s<2?"":(()=>{let M=u.map(G=>`d${G}: u32`).join(", "),P=u.map(G=>`d${G}`).join(", ");return`
  fn set_${e}(${M}, value: ${c}) {
    set_${e}ByIndices(${A(P)}, value);
  }`})();return{impl:()=>{let M=[],P=!1;return _.offsetToIndices&&(M.push(k),P=!0),_.indicesToOffset&&(M.push(E),P=!0),_.broadcastedIndicesToOffset&&(Object.values(K).forEach(G=>M.push(G)),P=!0),_.set&&(M.push(ae),P=!0),_.setByIndices&&(M.push(te),P=!0),_.get&&(M.push(j),P=!0),_.getByIndices&&(M.push(ee),P=!0),!i&&P&&M.unshift(`const ${x} = ${h.indices}(${r.join(",")});`,`const ${$} = ${h.indices}(${C.computeStrides(r).join(",")});`),M.join(`
`)},type:h,offsetToIndices:S,indicesToOffset:z,broadcastedIndicesToOffset:W,indices:A,indicesGet:O,indicesSet:q,set:(...M)=>{if(M.length!==s+1)throw new Error(`indices length must be ${s}`);let P=M[s];if(typeof P!="string")throw new Error("value must be string");let G=M.slice(0,s).map(g).join(",");return s===0?Z("0u",P):s===1?Z(G[0],P):(_.set=!0,_.setByIndices=!0,_.indicesToOffset=!0,`set_${e}(${G}, ${P})`)},setByOffset:Z,setByIndices:(M,P)=>s<2?Z(M,P):(_.setByIndices=!0,_.indicesToOffset=!0,`set_${e}ByIndices(${M}, ${P});`),get:L,getByOffset:ue,getByIndices:de,usage:a,name:e,strides:$,shape:x,rank:s}},R=(e,t,r,a=1)=>ar(e,t,r,"input",a),H=(e,t,r,a=1)=>ar(e,t,r,"output",a),ip=(e,t,r)=>ar(e,t,r,"atomicOutput",1),ln=(e,t,r,a=1)=>ar(e,t,r,"internal",a),mo=class{constructor(e,t){this.normalizedDispatchGroup=e,this.limits=t,this.internalVariables=[],this.variables=[],this.uniforms=[],this.variableIndex=0}guardAgainstOutOfBoundsWorkgroupSizes(e){return`if (global_idx >= ${typeof e=="number"?`${e}u`:e}) { return; }`}mainStart(e=Ht){let t=typeof e=="number"?e:e[0],r=typeof e=="number"?1:e[1],a=typeof e=="number"?1:e[2];if(t>this.limits.maxComputeWorkgroupSizeX||r>this.limits.maxComputeWorkgroupSizeY||a>this.limits.maxComputeWorkgroupSizeZ)throw new Error(`workgroup size [${t}, ${r}, ${a}] exceeds the maximum workgroup size [${this.limits.maxComputeWorkgroupSizeX}, ${this.limits.maxComputeWorkgroupSizeY}, ${this.limits.maxComputeWorkgroupSizeZ}].`);if(t*r*a>this.limits.maxComputeInvocationsPerWorkgroup)throw new Error(`workgroup size [${t}, ${r}, ${a}] exceeds the maximum workgroup invocations ${this.limits.maxComputeInvocationsPerWorkgroup}.`);let n=this.normalizedDispatchGroup[1]===1&&this.normalizedDispatchGroup[2]===1,i=n?`@builtin(global_invocation_id) global_id : vec3<u32>,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(local_invocation_id) local_id : vec3<u32>`:`@builtin(global_invocation_id) global_id : vec3<u32>,
                                             @builtin(local_invocation_id) local_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(num_workgroups) num_workgroups : vec3<u32>`,s=n?`let global_idx = global_id.x;
         let workgroup_index = workgroup_id.x;`:`let workgroup_index = workgroup_id.z * num_workgroups[0] * num_workgroups[1] +
             workgroup_id.y * num_workgroups[0] + workgroup_id.x;
         let global_idx = workgroup_index * ${t*r*a}u + local_idx;`;return`@compute @workgroup_size(${t}, ${r}, ${a})
  fn main(${i}) {
    ${s}
  `}appendVariableUniforms(e){e.rank!==0&&(e.shape.startsWith("uniforms.")&&this.uniforms.push({name:e.shape.replace("uniforms.",""),type:"u32",length:e.rank}),e.strides.startsWith("uniforms.")&&this.uniforms.push({name:e.strides.replace("uniforms.",""),type:"u32",length:e.rank}))}declareVariable(e,t){if(e.usage==="internal")throw new Error("cannot use internal variable with declareVariable(). use registerInternalVariables() instead.");this.variables.push(e),this.appendVariableUniforms(e);let r=e.usage==="input"?"read":"read_write",a=e.usage==="atomicOutput"?"atomic<i32>":e.type.storage;return`@group(0) @binding(${t}) var<storage, ${r}> ${e.name}: array<${a}>;`}declareVariables(...e){return e.map(t=>this.declareVariable(t,this.variableIndex++)).join(`
`)}registerInternalVariable(e){if(e.usage!=="internal")throw new Error("cannot use input or output variable with registerInternalVariable(). use declareVariables() instead.");this.internalVariables.push(e),this.appendVariableUniforms(e)}registerInternalVariables(...e){return e.forEach(t=>this.registerInternalVariable(t)),this}registerUniform(e,t,r=1){return this.uniforms.push({name:e,type:t,length:r}),this}registerUniforms(e){return this.uniforms=this.uniforms.concat(e),this}uniformDeclaration(){if(this.uniforms.length===0)return"";let e=[];for(let{name:t,type:r,length:a}of this.uniforms)if(a&&a>4)r==="f16"?e.push(`@align(16) ${t}:array<mat2x4<${r}>, ${Math.ceil(a/8)}>`):e.push(`${t}:array<vec4<${r}>, ${Math.ceil(a/4)}>`);else{let n=a==null||a===1?r:`vec${a}<${r}>`;e.push(`${t}:${n}`)}return`
      struct Uniforms { ${e.join(", ")} };
      @group(0) @binding(${this.variableIndex}) var<uniform> uniforms: Uniforms;`}get additionalImplementations(){return this.uniformDeclaration()+this.variables.map(e=>e.impl()).join(`
`)+this.internalVariables.map(e=>e.impl()).join(`
`)}get variablesInfo(){if(this.uniforms.length===0)return;let e=t=>[12,10,1,6][["u32","f16","f32","i32"].indexOf(t)];return this.uniforms.map(t=>[e(t.type),t.length??1])}},ap=(e,t)=>new mo(e,t)}),go,ji,_o,yo,bo,wo,Ue,np,sp,xt=U(()=>{J(),re(),ve(),ie(),go=(e,t)=>{if(!e||e.length!==1)throw new Error("Transpose requires 1 input.");if(t.length!==0&&t.length!==e[0].dims.length)throw new Error(`perm size ${t.length} does not match input rank ${e[0].dims.length}`)},ji=(e,t)=>t.length!==0?t:[...new Array(e).keys()].reverse(),_o=(e,t)=>C.sortBasedOnPerm(e,ji(e.length,t)),yo=(e,t,r,a)=>{let n=`fn perm(i: ${a.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`;for(let i=0;i<t;++i)n+=`a[${e[i]}]=i[${i}];`;return n+="return a;}"},bo=(e,t)=>{let r=[],a=[];for(let n=0;n<e.length;++n)e[n]!==1&&r.push(e[n]),e[t[n]]!==1&&a.push(t[n]);return{newShape:r,newPerm:a}},wo=(e,t)=>{let r=0;for(let a=0;a<e.length;++a)if(t[e[a]]!==1){if(e[a]<r)return!1;r=e[a]}return!0},Ue=(e,t)=>{let r=e.dataType,a=e.dims.length,n=ji(a,t),i=_o(e.dims,n),s=e.dims,u=i,d=a<2||wo(n,e.dims),l;if(d)return l=_=>{let b=R("input",r,s,4),x=H("output",r,u,4);return`
  ${_.registerUniform("output_size","u32").declareVariables(b,x)}
  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    output[global_idx] = input[global_idx];
  }`},{name:"TransposeCopy",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let _=C.size(i);return{outputs:[{dims:i,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(_/64/4)},programUniforms:[{type:12,data:Math.ceil(_/4)}]}},getShaderSource:l};let{newShape:c,newPerm:f}=bo(e.dims,n),h=C.areEqual(f,[2,3,1]),g=C.areEqual(f,[3,1,2]);if(c.length===2||h||g){s=h?[c[0],c[1]*c[2]]:g?[c[0]*c[1],c[2]]:c,u=[s[1],s[0]];let _=16;return l=b=>{let x=R("a",r,s.length),$=H("output",r,u.length);return`
  ${b.registerUniform("output_size","u32").declareVariables(x,$)}
  var<workgroup> tile : array<array<${$.type.value}, ${_+1}>, ${_}>;
  ${b.mainStart([_,_,1])}
    let stride = (uniforms.output_shape[1] - 1) / ${_} + 1;
    let workgroup_id_x = workgroup_index % stride;
    let workgroup_id_y = workgroup_index / stride;
    let input_col = workgroup_id_y * ${_}u + local_id.x;
    let input_row = workgroup_id_x * ${_}u + local_id.y;
    if (input_row < uniforms.a_shape[0] && input_col < uniforms.a_shape[1]) {
      tile[local_id.y][local_id.x] = ${x.getByIndices(`${x.type.indices}(input_row, input_col)`)};
    }
    workgroupBarrier();

    let output_col = workgroup_id_x * ${_}u + local_id.x;
    let output_row = workgroup_id_y * ${_}u + local_id.y;
    if (output_row < uniforms.output_shape[0] && output_col < uniforms.output_shape[1]) {
      ${$.setByIndices(`${$.type.indices}(output_row, output_col)`,"tile[local_id.x][local_id.y]")}
    }
  }`},{name:"TransposeShared",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let b=C.size(i);return{outputs:[{dims:i,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(u[1]/_),y:Math.ceil(u[0]/_)},programUniforms:[{type:12,data:b},...X(s,u)]}},getShaderSource:l}}return l=_=>{let b=R("a",r,s.length),x=H("output",r,u.length);return`
  ${_.registerUniform("output_size","u32").declareVariables(b,x)}

  ${yo(n,a,b,x)}

  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${x.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${x.setByOffset("global_idx",b.getByIndices("aIndices"))}
  }`},{name:"Transpose",shaderCache:{hint:`${t}`,inputDependencies:["rank"]},getRunData:()=>{let _=C.size(i);return{outputs:[{dims:i,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(_/64)},programUniforms:[{type:12,data:_},...X(s,u)]}},getShaderSource:l}},np=(e,t)=>{go(e.inputs,t.perm),e.compute(Ue(e.inputs[0],t.perm))},sp=e=>fe({perm:e.perm})}),$o,vo,xo,So,ko,Io,To,Eo,zo,Co,He,op,up,lp,dp,pp,cp,fp,hp,mp,gp,sg=U(()=>{J(),re(),ie(),dn(),xt(),$o={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate * candidate",logSumExp:"bestValue + exp(candidate)",l1:"bestValue + abs(candidate)",l2:"bestValue + candidate * candidate",logSum:"bestValue + candidate"},vo={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate",logSumExp:"bestValue + candidate",l1:"bestValue + candidate",l2:"bestValue + candidate",logSum:"bestValue + candidate"},xo={max:"_A[offset]",min:"_A[offset]",mean:"0",sum:"0",prod:"1",sumSquare:"0",logSumExp:"0",l1:"0",l2:"0",logSum:"0"},So={max:"bestValue",min:"bestValue",sum:"bestValue",prod:"bestValue",sumSquare:"bestValue",logSumExp:"log(bestValue)",l1:"bestValue",l2:"sqrt(bestValue)",logSum:"log(bestValue)"},ko=(e,t)=>{let r=[];for(let a=t-e;a<t;++a)r.push(a);return r},Io=(e,t)=>{let r=[],a=e.length;for(let i=0;i<a;i++)t.indexOf(i)===-1&&r.push(e[i]);let n=t.map(i=>e[i]);return[r,n]},To=(e,t)=>{let r=e.length+t.length,a=[],n=0;for(let i=0;i<r;i++)t.indexOf(i)===-1?a.push(e[n++]):a.push(1);return a},Eo=(e,t)=>{for(let r=0;r<e.length;++r)if(e[e.length-r-1]!==t-1-r)return!1;return!0},zo=(e,t)=>{let r=[];if(!Eo(e,t)){for(let a=0;a<t;++a)e.indexOf(a)===-1&&r.push(a);e.forEach(a=>r.push(a))}return r},Co=(e,t,r,a,n,i,s)=>{let u=r[0].dims,d=C.size(i),l=C.size(s),c=R("_A",r[0].dataType,u),f=H("output",n,i),h=64;d===1&&(h=256);let g=`
          var<workgroup> aBestValues : array<f32, ${h}>;
       `,_=b=>`
        ${b.registerUniform("reduceSize","u32").declareVariables(c,f)}
        ${g}
        fn DIV_CEIL(a : u32, b : u32) -> u32 {
          return ((a - 1u) / b + 1u);
         }
         ${b.mainStart(h)}

          let outputIndex = global_idx / ${h};
          let offset = outputIndex * uniforms.reduceSize;

          var bestValue = f32(${xo[a]});
          let Length = uniforms.reduceSize;
          for (var k = local_idx; k < Length; k = k + ${h}) {
           let candidate = f32(${c.getByOffset("offset + k")});
           bestValue = ${$o[a]};
          }
          aBestValues[local_idx] = bestValue;
          workgroupBarrier();

         var reduceSize = min(Length, ${h}u);
         for (var currentSize = reduceSize / 2u; reduceSize > 1u;
             currentSize = reduceSize / 2u) {
           let interval = DIV_CEIL(reduceSize, 2u);
           if (local_idx < currentSize) {
            let candidate = aBestValues[local_idx + interval];
            bestValue = ${vo[a]};
            aBestValues[local_idx] = bestValue;
           }
           reduceSize = interval;
           workgroupBarrier();
         }

         if (local_idx == 0u) {
          ${f.setByOffset("outputIndex",`${a==="mean"?`${f.type.storage}(bestValue / f32(uniforms.reduceSize))`:`${f.type.storage}(${So[a]})`}`)};
         }
        }`;return{name:e,shaderCache:{hint:`${t};${h}`,inputDependencies:["type"]},getShaderSource:_,getRunData:()=>({outputs:[{dims:i,dataType:n}],dispatchGroup:{x:d},programUniforms:[{type:12,data:l}]})}},He=(e,t,r,a)=>{let n=e.inputs.length===1?r:Ba(e.inputs,r),i=n.axes;i.length===0&&!n.noopWithEmptyAxes&&(i=e.inputs[0].dims.map((g,_)=>_));let s=C.normalizeAxes(i,e.inputs[0].dims.length),u=s,d=e.inputs[0],l=zo(u,e.inputs[0].dims.length);l.length>0&&(d=e.compute(Ue(e.inputs[0],l),{inputs:[0],outputs:[-1]})[0],u=ko(u.length,d.dims.length));let[c,f]=Io(d.dims,u),h=c;n.keepDims&&(h=To(c,s)),e.compute(Co(t,n.cacheKey,[d],a,e.inputs[0].dataType,h,f),{inputs:[d]})},op=(e,t)=>{He(e,"ReduceMeanShared",t,"mean")},up=(e,t)=>{He(e,"ReduceL1Shared",t,"l1")},lp=(e,t)=>{He(e,"ReduceL2Shared",t,"l2")},dp=(e,t)=>{He(e,"ReduceLogSumExpShared",t,"logSumExp")},pp=(e,t)=>{He(e,"ReduceMaxShared",t,"max")},cp=(e,t)=>{He(e,"ReduceMinShared",t,"min")},fp=(e,t)=>{He(e,"ReduceProdShared",t,"prod")},hp=(e,t)=>{He(e,"ReduceSumShared",t,"sum")},mp=(e,t)=>{He(e,"ReduceSumSquareShared",t,"sumSquare")},gp=(e,t)=>{He(e,"ReduceLogSumShared",t,"logSum")}}),Fe,Ao,Qr,Ba,Ke,Oo,Bo,Ro,Mo,Do,No,Po,Uo,qo,Wo,Ze,_p,yp,bp,wp,$p,vp,xp,Sp,kp,Ip,dn=U(()=>{J(),re(),ve(),ie(),sg(),Fe=e=>{if(!e||e.length===0||e.length>2)throw new Error("Reduce op requires 1 or 2 inputs.");if(e.length===2&&e[1].dims.length!==1)throw new Error("Invalid axes input dims.")},Ao=e=>["","",`var value = ${e.getByIndices("input_indices")};`,""],Qr=(e,t,r,a,n,i,s=!1,u=!1)=>{let d=[],l=r[0].dims,c=l.length,f=C.normalizeAxes(n,c),h=!u&&f.length===0;l.forEach((b,x)=>{h||f.indexOf(x)>=0?s&&d.push(1):d.push(b)});let g=d.length,_=C.size(d);return{name:e,shaderCache:t,getShaderSource:b=>{let x=[],$=R("_A",r[0].dataType,c),w=H("output",i,g),k=a($,w,f),S=k[2];for(let I=0,E=0;I<c;I++)h||f.indexOf(I)>=0?(s&&E++,S=`for(var j${I}: u32 = 0; j${I} < ${l[I]}; j${I}++) {
                  ${k[2].includes("last_index")?`let last_index = j${I};`:""}
                  ${$.indicesSet("input_indices",I,`j${I}`)}
                  ${S}
                }`):(x.push(`${$.indicesSet("input_indices",I,w.indicesGet("output_indices",E))};`),E++);return`

        ${b.registerUniform("output_size","u32").declareVariables($,w)}

        ${b.mainStart()}
          ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          var input_indices: ${$.type.indices};
          let output_indices = ${w.offsetToIndices("global_idx")};

          ${x.join(`
`)}
          ${k[0]}       // init ops for reduce max/min
          ${k[1]}
          ${S}
          ${k[3]}
          ${k.length===4?w.setByOffset("global_idx","value"):k.slice(4).join(`
`)}
        }`},getRunData:()=>({outputs:[{dims:d,dataType:i}],dispatchGroup:{x:Math.ceil(_/64)},programUniforms:[{type:12,data:_},...X(l,d)]})}},Ba=(e,t)=>{let r=[];return e[1].dims[0]>0&&e[1].getBigInt64Array().forEach(a=>r.push(Number(a))),fe({axes:r,keepDims:t.keepDims,noopWithEmptyAxes:t.noopWithEmptyAxes})},Ke=(e,t,r,a)=>{let n=e.inputs,i=n.length===1?r:Ba(n,r);e.compute(Qr(t,{hint:i.cacheKey,inputDependencies:["rank"]},[n[0]],i.noopWithEmptyAxes&&i.axes.length===0?Ao:a,i.axes,n[0].dataType,i.keepDims,i.noopWithEmptyAxes),{inputs:[0]})},Oo=(e,t)=>{Fe(e.inputs),Ke(e,"ReduceLogSum",t,(r,a)=>[`var value = ${a.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,"value = log(value);"])},Bo=(e,t)=>{Fe(e.inputs),Ke(e,"ReduceL1",t,(r,a)=>[`var value = ${a.type.storage}(0);`,"",`value += abs(${r.getByIndices("input_indices")});`,""])},Ro=(e,t)=>{Fe(e.inputs),Ke(e,"ReduceL2",t,(r,a)=>[`var t = ${a.type.value}(0); var value = ${a.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += (t * t);`,"value = sqrt(value);"])},Mo=(e,t)=>{Fe(e.inputs),Ke(e,"ReduceLogSumExp",t,(r,a)=>[`var value = ${a.type.storage}(0);`,"",`value += exp(${r.getByIndices("input_indices")});`,"value = log(value);"])},Do=(e,t)=>{Fe(e.inputs),Ke(e,"ReduceMax",t,(r,a,n)=>{let i=[];for(let s=0;s<r.rank;s++)(n.indexOf(s)>=0||n.length===0)&&i.push(r.indicesSet("input_indices",s,0));return[`${i.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = max(value, ${r.getByIndices("input_indices")});`,""]})},No=(e,t)=>{Fe(e.inputs),Ke(e,"ReduceMean",t,(r,a,n)=>{let i=1;for(let s=0;s<r.rank;s++)(n.indexOf(s)>=0||n.length===0)&&(i*=e.inputs[0].dims[s]);return["var sum = f32(0);","",`sum += f32(${r.getByIndices("input_indices")});`,`let value = ${a.type.value}(sum / ${i});`]})},Po=(e,t)=>{Fe(e.inputs),Ke(e,"ReduceMin",t,(r,a,n)=>{let i=[];for(let s=0;s<r.rank;s++)(n.indexOf(s)>=0||n.length===0)&&i.push(`input_indices[${s}] = 0;`);return[`${i.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = min(value, ${r.getByIndices("input_indices")});`,""]})},Uo=(e,t)=>{Fe(e.inputs),Ke(e,"ReduceProd",t,(r,a)=>[`var value = ${a.type.storage}(1);`,"",`value *= ${r.getByIndices("input_indices")};`,""])},qo=(e,t)=>{Fe(e.inputs),Ke(e,"ReduceSum",t,(r,a)=>[`var value = ${a.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,""])},Wo=(e,t)=>{Fe(e.inputs),Ke(e,"ReduceSumSquare",t,(r,a)=>[`var t = ${a.type.value}(0); var value = ${a.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += t * t;`,""])},Ze=(e,t,r)=>{if(t.length===0)return r;let a=1,n=1;for(let i=0;i<t.length;i++)t.indexOf(i)===-1?a*=e[i]:n*=e[i];return n<32&&a>1024},_p=(e,t)=>{Ze(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?No(e,t):op(e,t)},yp=(e,t)=>{Ze(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Bo(e,t):up(e,t)},bp=(e,t)=>{Ze(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Ro(e,t):lp(e,t)},wp=(e,t)=>{Ze(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Mo(e,t):dp(e,t)},$p=(e,t)=>{Ze(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Do(e,t):pp(e,t)},vp=(e,t)=>{Ze(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Po(e,t):cp(e,t)},xp=(e,t)=>{Ze(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Uo(e,t):fp(e,t)},Sp=(e,t)=>{Ze(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?qo(e,t):hp(e,t)},kp=(e,t)=>{Ze(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Wo(e,t):mp(e,t)},Ip=(e,t)=>{Ze(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Oo(e,t):gp(e,t)}}),Gi,Tp,Ep,Ra,og=U(()=>{J(),ve(),dn(),Gi=e=>{if(!e||e.length===0||e.length>2)throw new Error("ArgMinMaxOp op requires 1 or 2 inputs.");if(e[0].dataType!==1)throw new Error("Invalid input type.")},Tp=(e,t)=>{Gi(e.inputs);let r=(a,n,i)=>{let s=[];for(let u=0;u<a.rank;u++)(i.indexOf(u)>=0||i.length===0)&&s.push(`input_indices[${u}] = 0;`);return[`${s.join(`
`)}`,`var value = ${a.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${a.getByIndices("input_indices")} ${t.selectLastIndex>0?"<=":"<"} value) {
         value = ${a.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",n.setByOffset("global_idx","best_index")]};e.compute(Qr("ArgMin",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},Ep=(e,t)=>{Gi(e.inputs);let r=(a,n,i)=>{let s=[];for(let u=0;u<a.rank;u++)(i.indexOf(u)>=0||i.length===0)&&s.push(`input_indices[${u}] = 0;`);return[`${s.join(`
`)}`,`var value = ${a.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${a.getByIndices("input_indices")} ${t.selectLastIndex>0?">=":">"} value) {
         value = ${a.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",n.setByOffset("global_idx","best_index")]};e.compute(Qr("argMax",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},Ra=e=>fe(e)}),Lo,Nr,Vo,jo,Go,_r,Ho,zp,pn=U(()=>{J(),re(),un(),ie(),Lo=(e,t)=>{let r=e[0],a=e[1],n=e[2],i=e[3],s=e[4],u=e[5];if(s&&u)throw new Error("Attention cannot have both past and attention_bias");if(r.dims.length!==3)throw new Error('Input "input" must have 3 dimensions');let d=r.dims[0],l=r.dims[1],c=r.dims[2];if(n.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimensions');if(a.dims.length!==2)throw new Error('Input "weights" is expected to have 2 dimensions');if(a.dims[0]!==c)throw new Error("Input 1 dimension 0 should have same length as dimension 2 of input 0");if(n.dims[0]!==a.dims[1])throw new Error('Input "bias" dimension 0 should have same length as dimension 1 of input "weights"');let f=n.dims[0]/3,h=f,g=h;if(t.qkvHiddenSizes.length>0){if(t.qkvHiddenSizes.length!==3)throw new Error("qkv_hidden_sizes attribute should have 3 elements");for(let k of t.qkvHiddenSizes)if(k%t.numHeads!==0)throw new Error("qkv_hidden_sizes should be divisible by num_heads");f=t.qkvHiddenSizes[0],h=t.qkvHiddenSizes[1],g=t.qkvHiddenSizes[2]}let _=l;if(f!==h)throw new Error("qkv_hidden_sizes first element should be same as the second");if(n.dims[0]!==f+h+g)throw new Error('Input "bias" dimension 0 should have same length as sum of Q/K/V hidden sizes');let b=0;if(s){if(h!==g)throw new Error('Input "past" expect k_hidden_size == v_hidden_size');if(s.dims.length!==5)throw new Error('Input "past" must have 5 dimensions');if(s.dims[0]!==2)throw new Error('Input "past" first dimension must be 2');if(s.dims[1]!==d)throw new Error('Input "past" second dimension must be batch_size');if(s.dims[2]!==t.numHeads)throw new Error('Input "past" third dimension must be num_heads');if(s.dims[4]!==h/t.numHeads)throw new Error('Input "past" fifth dimension must be k_hidden_size / num_heads');t.pastPresentShareBuffer||(b=s.dims[3])}let x=_+b,$=-1,w=0;if(i)throw new Error("Mask not supported");if(s)throw new Error("past is not supported");if(u){if(u.dims.length!==4)throw new Error('Input "attention_bias" must have 4 dimensions');if(u.dims[0]!==d||u.dims[1]!==t.numHeads||u.dims[2]!==l||u.dims[3]!==x)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:d,sequenceLength:l,pastSequenceLength:b,kvSequenceLength:_,totalSequenceLength:x,maxSequenceLength:$,inputHiddenSize:c,hiddenSize:f,vHiddenSize:g,headSize:Math.floor(f/t.numHeads),vHeadSize:Math.floor(g/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:w,scale:t.scale,broadcastResPosBias:!1,passPastInKv:!1,qkvFormat:1}},Nr=(e,t,r)=>t&&e?`
      let total_sequence_length_input = u32(${t.getByOffset("0")});
      let present_sequence_length = max(total_sequence_length_input, uniforms.past_sequence_length);
      let is_subsequent_prompt: bool = sequence_length > 1 && sequence_length != total_sequence_length_input;
      let is_first_prompt: bool = is_subsequent_prompt == false && sequence_length == total_sequence_length_input;
      total_sequence_length = u32(${e==null?void 0:e.getByOffset("batchIdx")}) + 1;
      var past_sequence_length: u32 = 0;
      if (is_first_prompt == false) {
        past_sequence_length = total_sequence_length - sequence_length;
      }
       `:`
    ${r?"let past_sequence_length = uniforms.past_sequence_length":""};
    let present_sequence_length = total_sequence_length;
    `,Vo=(e,t,r,a,n,i,s,u)=>{let d=$e(s?1:i),l=64,c=i/d;c<l&&(l=32);let f=Math.ceil(i/d/l),h=[{type:12,data:t},{type:12,data:r},{type:12,data:a},{type:12,data:n},{type:12,data:c},{type:12,data:f}],g=ke(e.dataType,d),_=Ae(1,d),b=["type"];s&&b.push("type"),u&&b.push("type");let x=$=>{let w=H("x",e.dataType,e.dims,d),k=[w],S=s?R("seq_lens",s.dataType,s.dims):void 0;S&&k.push(S);let I=u?R("total_sequence_length_input",u.dataType,u.dims):void 0;I&&k.push(I);let E=Ae(e.dataType),z=[{name:"batch_size",type:"u32"},{name:"num_heads",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"sequence_length",type:"u32"},{name:"total_sequence_length",type:"u32"},{name:"elements_per_thread",type:"u32"}];return`
  var<workgroup> thread_max: array<f32, ${l}>;
  var<workgroup> thread_sum: array<f32, ${l}>;
  ${$.registerUniforms(z).declareVariables(...k)}
  ${$.mainStart([l,1,1])}
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let sequence_length = uniforms.sequence_length;
    var total_sequence_length = uniforms.total_sequence_length;
    ${Nr(S,I,!1)}
    let local_offset = local_idx * uniforms.elements_per_thread;
    let offset = (global_idx / ${l}) * uniforms.total_sequence_length + local_offset;
    let seq_causal_length = ${s?"u32(past_sequence_length + workgroup_id.y + 1)":"total_sequence_length"};
    var thread_max_vector = ${_}(-3.402823e+38f);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      thread_max_vector = max(${_}(x[offset + i]), thread_max_vector);
    }
    thread_max[local_idx] = ${(()=>{switch(d){case 1:return"thread_max_vector";case 2:return"max(thread_max_vector.x, thread_max_vector.y)";case 4:return"max(max(thread_max_vector.x, thread_max_vector.y), max(thread_max_vector.z, thread_max_vector.w))";default:throw new Error(`Unsupported components: ${d}`)}})()};
    workgroupBarrier();

    var max_value =  f32(-3.402823e+38f);
    for (var i = 0u; i < ${l}; i++) {
      max_value = max(thread_max[i], max_value);
    }

    var sum_vector = ${_}(0);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      sum_vector += exp(${_}(x[offset + i]) - max_value);
    }
    thread_sum[local_idx] = ${(()=>{switch(d){case 1:return"sum_vector";case 2:return"sum_vector.x + sum_vector.y";case 4:return"sum_vector.x + sum_vector.y + sum_vector.z + sum_vector.w";default:throw new Error(`Unsupported components: ${d}`)}})()};
    workgroupBarrier();

    var sum: f32 = 0;
    for (var i = 0u; i < ${l}; i++) {
      sum += thread_sum[i];
    }

    if (sum == 0) {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        x[offset + i] = ${w.type.value}(${E}(1.0) / ${E}(seq_causal_length));
      }
    } else {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        var f32input = ${_}(x[offset + i]);
        x[offset + i] = ${w.type.value}(exp(f32input - max_value) / sum);
      }
    }
      ${s?`
        for (var total_seq_id: u32 = seq_causal_length; total_seq_id + local_offset < uniforms.total_sequence_length; total_seq_id++) {
          x[offset + total_seq_id] = ${w.type.value}(${E}(0));
        }`:""};
  }`};return{name:"AttentionProbsSoftmax",shaderCache:{hint:`${l};${g};${d}`,inputDependencies:b},getShaderSource:x,getRunData:()=>({outputs:[],dispatchGroup:{x:1,y:n,z:t*r},programUniforms:h})}},jo=(e,t,r,a,n,i,s,u,d)=>{let l=s+i.kvSequenceLength,c=[i.batchSize,i.numHeads,i.sequenceLength,l],f=e>1&&a,h=i.kvNumHeads?i.kvNumHeads:i.numHeads,g=f?[i.batchSize,h,l,i.headSize]:void 0,_=i.nReps?i.nReps:1,b=i.scale===0?1/Math.sqrt(i.headSize):i.scale,x=$e(i.headSize),$=i.headSize/x,w=12,k={x:Math.ceil(l/w),y:Math.ceil(i.sequenceLength/w),z:i.batchSize*i.numHeads},S=[{type:12,data:i.sequenceLength},{type:12,data:$},{type:12,data:l},{type:12,data:i.numHeads},{type:12,data:i.headSize},{type:1,data:b},{type:12,data:s},{type:12,data:i.kvSequenceLength},{type:12,data:_}],I=f&&a&&C.size(a.dims)>0,E=["type","type"];I&&E.push("type"),n&&E.push("type"),u&&E.push("type"),d&&E.push("type");let z=[{dims:c,dataType:t.dataType,gpuDataType:0}];f&&z.push({dims:g,dataType:t.dataType,gpuDataType:0});let A=O=>{let q=R("q",t.dataType,t.dims,x),K=R("key",r.dataType,r.dims,x),W=[q,K];if(I){let te=R("past_key",a.dataType,a.dims,x);W.push(te)}n&&W.push(R("attention_bias",n.dataType,n.dims));let Z=u?R("seq_lens",u.dataType,u.dims):void 0;Z&&W.push(Z);let ue=d?R("total_sequence_length_input",d.dataType,d.dims):void 0;ue&&W.push(ue);let ee=H("output",t.dataType,c),j=[ee];f&&j.push(H("present_key",t.dataType,g,x));let L=Ae(1,x),de=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"alpha",type:"f32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${w}u;

  var<workgroup> tileQ: array<${q.type.storage}, ${w*w}>;
  var<workgroup> tileK: array<${q.type.storage}, ${w*w}>;
  ${O.registerUniforms(de).declareVariables(...W,...j)}
  ${O.mainStart([w,w,1])}
    // x holds the N and y holds the M
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let kvHeadIdx = ${_===1?"headIdx":"headIdx / uniforms.n_reps"};
    let kv_num_heads = ${_===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let m = workgroup_id.y * TILE_SIZE;
    let n = workgroup_id.x * TILE_SIZE;
    let sequence_length = uniforms.M;
    var total_sequence_length = uniforms.N;
    ${Nr(Z,ue,!0)}
    let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx;
    let qOffset = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
    ${I&&f?"let pastKeyOffset = absKvHeadIdx * uniforms.past_sequence_length * uniforms.K;":""};
    let kOffset = absKvHeadIdx * uniforms.kv_sequence_length * uniforms.K;
    ${f?"let presentKeyOffset = absKvHeadIdx * uniforms.N * uniforms.K;":""}
    var value = ${L}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (global_id.y < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = q[qOffset + local_id.y * uniforms.K + w + local_id.x];
      }
      if (n + local_id.y < uniforms.N && w + local_id.x < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
      ${I&&f?`
              if (n + local_id.y < past_sequence_length) {
                tileK[idx] = past_key[pastKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
              } else if (n + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
                tileK[idx] = key[kOffset + (n + local_id.y - past_sequence_length) * uniforms.K + w + local_id.x];
              }`:`
          if (n + local_id.y < uniforms.kv_sequence_length) {
            tileK[idx] = key[kOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
          }`}
      ${f?`if (n + local_id.y < present_sequence_length) {
        present_key[presentKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x] = tileK[idx];
      }`:""}
      }
      workgroupBarrier();

      for (var k: u32 = 0u; k < TILE_SIZE && w+k < uniforms.K; k++) {
          value += ${L}(tileQ[TILE_SIZE * local_id.y + k] * tileK[TILE_SIZE * local_id.x + k]);
      }

      workgroupBarrier();
    }

    if (global_id.y < uniforms.M && global_id.x < total_sequence_length) {
      let headOffset = workgroup_id.z * uniforms.M * uniforms.N;
      let outputIdx = headOffset + global_id.y * uniforms.N + global_id.x;
      var sum: f32 = ${(()=>{switch(x){case 1:return"value";case 2:return"value.x + value.y";case 4:return"value.x + value.y + value.z + value.w";default:throw new Error(`Unsupported components: ${x}`)}})()};
        output[outputIdx] = ${ee.type.value} (sum * uniforms.alpha) + ${n?"attention_bias[outputIdx]":"0.0"};
    }
  }`};return{name:"AttentionProbs",shaderCache:{hint:`${x};${n!==void 0};${a!==void 0};${e}`,inputDependencies:E},getRunData:()=>({outputs:z,dispatchGroup:k,programUniforms:S}),getShaderSource:A}},Go=(e,t,r,a,n,i,s=void 0,u=void 0)=>{let d=i+n.kvSequenceLength,l=n.nReps?n.nReps:1,c=n.vHiddenSize*l,f=e>1&&a,h=n.kvNumHeads?n.kvNumHeads:n.numHeads,g=f?[n.batchSize,h,d,n.headSize]:void 0,_=[n.batchSize,n.sequenceLength,c],b=12,x={x:Math.ceil(n.vHeadSize/b),y:Math.ceil(n.sequenceLength/b),z:n.batchSize*n.numHeads},$=[{type:12,data:n.sequenceLength},{type:12,data:d},{type:12,data:n.vHeadSize},{type:12,data:n.numHeads},{type:12,data:n.headSize},{type:12,data:c},{type:12,data:i},{type:12,data:n.kvSequenceLength},{type:12,data:l}],w=f&&a&&C.size(a.dims)>0,k=["type","type"];w&&k.push("type"),s&&k.push("type"),u&&k.push("type");let S=[{dims:_,dataType:t.dataType,gpuDataType:0}];f&&S.push({dims:g,dataType:t.dataType,gpuDataType:0});let I=E=>{let z=R("probs",t.dataType,t.dims),A=R("v",r.dataType,r.dims),O=[z,A];w&&O.push(R("past_value",a.dataType,a.dims));let q=s?R("seq_lens",s.dataType,s.dims):void 0;s&&O.push(q);let K=u?R("total_sequence_length_input",u.dataType,u.dims):void 0;u&&O.push(K);let W=[H("output",t.dataType,_)];f&&W.push(H("present_value",t.dataType,g));let Z=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"v_hidden_size",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${b}u;
  var<workgroup> tileQ: array<${z.type.value}, ${b*b}>;
  var<workgroup> tileV: array<${z.type.value}, ${b*b}>;
  ${E.registerUniforms(Z).declareVariables(...O,...W)}
  ${E.mainStart([b,b,1])}
   let headIdx = workgroup_id.z % uniforms.num_heads;
   let batchIdx = workgroup_id.z / uniforms.num_heads;
   let kvHeadIdx = ${l===1?"headIdx":"headIdx / uniforms.n_reps"};
   let kv_num_heads = ${l===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
   let m = global_id.y;
   let n = global_id.x;
   let sequence_length = uniforms.M;
   var total_sequence_length = uniforms.K;
   ${Nr(q,K,!0)}
   let offsetA = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
   let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx; // kvHeadIdx is relative to the batch
   ${w&&f?"let pastValueOffset = absKvHeadIdx * uniforms.N * uniforms.past_sequence_length + n;":""};
   let vOffset = absKvHeadIdx * uniforms.N * uniforms.kv_sequence_length + n;
   ${f?"let presentValueOffset = absKvHeadIdx * uniforms.N * uniforms.K + n;":""}
   var value = ${z.type.storage}(0);
   for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = probs[offsetA + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
        ${w&&f?`
        if (w + local_id.y < past_sequence_length) {
          tileV[idx] = past_value[pastValueOffset + (w + local_id.y) * uniforms.N];
        } else if (w + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
          tileV[idx] = v[vOffset + (w + local_id.y - past_sequence_length) * uniforms.N];
        }
      `:`
            if (w + local_id.y < uniforms.kv_sequence_length) {
              tileV[idx] = v[vOffset + (w + local_id.y) * uniforms.N];
            }`}
        ${f?`
            if (w + local_id.y < present_sequence_length) {
          present_value[presentValueOffset + (w + local_id.y) * uniforms.N] = tileV[idx];
        }`:""}
      }
     workgroupBarrier();
     for (var k: u32 = 0u; k < TILE_SIZE && w+k < total_sequence_length; k++) {
       value += tileQ[TILE_SIZE * local_id.y + k] * tileV[TILE_SIZE * k + local_id.x];
     }
     workgroupBarrier();
   }

   // we need to transpose output from BNSH_v to BSND_v
   if (m < uniforms.M && n < uniforms.N) {
     let outputIdx = batchIdx * uniforms.M * uniforms.v_hidden_size + m * uniforms.v_hidden_size
       + headIdx * uniforms.N + n;
     output[outputIdx] = value;
   }
  }`};return{name:"AttentionScore",shaderCache:{hint:`${a!==void 0};${e}`,inputDependencies:k},getRunData:()=>({outputs:S,dispatchGroup:x,programUniforms:$}),getShaderSource:I}},_r=(e,t,r,a,n,i,s,u,d,l,c=void 0,f=void 0)=>{let h=Math.min(e.outputCount,1+(s?1:0)+(u?1:0)),g=h>1?l.pastSequenceLength:0,_=g+l.kvSequenceLength,b=d&&C.size(d.dims)>0?d:void 0,x=[t,r];h>1&&s&&C.size(s.dims)>0&&x.push(s),b&&x.push(b),c&&x.push(c),f&&x.push(f);let $=e.compute(jo(h,t,r,s,b,l,g,c,f),{inputs:x,outputs:h>1?[-1,1]:[-1]})[0];e.compute(Vo($,l.batchSize,l.numHeads,g,l.sequenceLength,_,c,f),{inputs:c&&f?[$,c,f]:[$],outputs:[]});let w=[$,a];h>1&&u&&C.size(u.dims)>0&&w.push(u),c&&w.push(c),f&&w.push(f),e.compute(Go(h,$,a,u,l,g,c,f),{inputs:w,outputs:h>1?[0,2]:[0]})},Ho=(e,t)=>{let r=[t.batchSize,t.numHeads,t.sequenceLength,t.headSize],a=t.sequenceLength,n=t.inputHiddenSize,i=t.headSize,s=12,u={x:Math.ceil(t.headSize/s),y:Math.ceil(t.sequenceLength/s),z:t.batchSize*t.numHeads},d=[e.inputs[0],e.inputs[1],e.inputs[2]],l=[{type:12,data:a},{type:12,data:n},{type:12,data:i},{type:12,data:t.numHeads},{type:12,data:t.headSize},{type:12,data:t.hiddenSize},{type:12,data:t.hiddenSize+t.hiddenSize+t.vHiddenSize}],c=f=>{let h=H("output_q",d[0].dataType,r),g=H("output_k",d[0].dataType,r),_=H("output_v",d[0].dataType,r),b=R("input",d[0].dataType,d[0].dims),x=R("weight",d[1].dataType,d[1].dims),$=R("bias",d[2].dataType,d[2].dims),w=b.type.storage,k=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"hidden_size",type:"u32"},{name:"ldb",type:"u32"}];return`
  const TILE_SIZE = ${s}u;
  var<workgroup> tileInput: array<${w}, ${s*s}>;
  var<workgroup> tileWeightQ: array<${w}, ${s*s}>;
  var<workgroup> tileWeightK: array<${w}, ${s*s}>;
  var<workgroup> tileWeightV: array<${w}, ${s*s}>;
  ${f.registerUniforms(k).declareVariables(b,x,$,h,g,_)}
  ${f.mainStart([s,s,1])}
    let batchIndex = workgroup_id.z / uniforms.num_heads;
    let headNumber = workgroup_id.z % uniforms.num_heads;
    let m = global_id.y;
    let n = global_id.x;

    let inputOffset = batchIndex * (uniforms.M * uniforms.K) + m * uniforms.K;
    let biasOffsetQ = headNumber * uniforms.head_size;
    let biasOffsetK = uniforms.hidden_size + biasOffsetQ;
    let biasOffsetV = uniforms.hidden_size + biasOffsetK;

    var valueQ = ${w}(0);
    var valueK = ${w}(0);
    var valueV = ${w}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileInput[TILE_SIZE * local_id.y + local_id.x] = input[inputOffset + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        let offset = n + (w + local_id.y) * uniforms.ldb;
        tileWeightQ[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetQ + offset];
        tileWeightK[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetK + offset];
        tileWeightV[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetV + offset];
      }
      workgroupBarrier();
      for (var k: u32 = 0u; k<TILE_SIZE && w+k < uniforms.K; k++) {
        let inputTileOffset = TILE_SIZE * local_id.y + k;
        let weightTileOffset = TILE_SIZE * k + local_id.x;
        valueQ += tileInput[inputTileOffset] * tileWeightQ[weightTileOffset];
        valueK += tileInput[inputTileOffset] * tileWeightK[weightTileOffset];
        valueV += tileInput[inputTileOffset] * tileWeightV[weightTileOffset];
      }

      workgroupBarrier();
    }

    let headOffset = (m * uniforms.N + n) % uniforms.head_size;
    valueQ += bias[headOffset + biasOffsetQ];
    valueK += bias[headOffset + biasOffsetK];
    valueV += bias[headOffset + biasOffsetV];

    let offset = workgroup_id.z * uniforms.M * uniforms.N;
    if (m < uniforms.M && n < uniforms.N) {
      let outputIdx = offset + m * uniforms.N + n;
      output_q[outputIdx] = valueQ;
      output_k[outputIdx] = valueK;
      output_v[outputIdx] = valueV;
    }
  }`};return e.compute({name:"AttentionPrepare",shaderCache:{inputDependencies:["type","type","type"]},getRunData:()=>({outputs:[{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0}],dispatchGroup:u,programUniforms:l}),getShaderSource:c},{inputs:d,outputs:[-1,-1,-1]})},zp=(e,t)=>{let r=Lo(e.inputs,t),[a,n,i]=Ho(e,r);return _r(e,a,n,i,e.inputs[4],void 0,void 0,void 0,e.inputs[5],r)}}),Fo,Ko,Zo,Cp,ug=U(()=>{et(),J(),re(),ve(),ie(),Fo=(e,t)=>{if(!e||e.length!==5)throw new Error("BatchNormalization requires 5 inputs");let r=(a,n,i)=>{let s=n.length;if(s!==a.length)throw new Error(`${i}: num dimensions != ${s}`);n.forEach((u,d)=>{if(u!==a[d])throw new Error(`${i}: dim[${d}] do not match`)})};if(e[0].dims.length>1){let a=t.format==="NHWC"?t.spatial?e[0].dims.slice(-1):e[0].dims.slice(-1).concat(e[0].dims.slice(1,e[0].dims.length-1)):e[0].dims.slice(1,t.spatial?2:void 0);r(e[1].dims,a,"Invalid input scale"),r(e[2].dims,a,"Invalid input B"),r(e[3].dims,a,"Invalid input mean"),r(e[4].dims,a,"Invalid input var")}else r(e[1].dims,[1],"Invalid input scale"),r(e[2].dims,[1],"Invalid input B"),r(e[3].dims,[1],"Invalid input mean"),r(e[4].dims,[1],"Invalid input var")},Ko=(e,t)=>{let{epsilon:r,spatial:a,format:n}=t,i=e[0].dims,s=a?$e(i[i.length-1]):1,u=n==="NHWC"&&i.length>1?s:1,d=C.size(i)/s,l=a,c=l?i.length:i,f=R("x",e[0].dataType,e[0].dims,s),h=R("scale",e[1].dataType,e[1].dims,u),g=R("bias",e[2].dataType,e[2].dims,u),_=R("inputMean",e[3].dataType,e[3].dims,u),b=R("inputVar",e[4].dataType,e[4].dims,u),x=H("y",e[0].dataType,c,s),$=()=>{let k="";if(a)k=`let cOffset = ${i.length===1?"0u":n==="NHWC"?`outputIndices[${i.length-1}] / ${s}`:"outputIndices[1]"};`;else if(n==="NCHW")k=`
            ${x.indicesSet("outputIndices","0","0")}
            let cOffset = ${x.indicesToOffset("outputIndices")};`;else{k=`var cIndices = ${h.type.indices}(0);
                       cIndices[0] = outputIndices[${i.length-1}];`;for(let S=1;S<h.rank;S++)k+=`cIndices[${S}] = outputIndices[${S}];`;k+=`let cOffset = ${h.indicesToOffset("cIndices")};`}return k},w=k=>`
  const epsilon = ${r};
  ${k.registerUniform("outputSize","u32").declareVariables(f,h,g,_,b,x)}
  ${k.mainStart()}
  ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
    var outputIndices = ${x.offsetToIndices(`global_idx * ${s}`)};
    ${$()}
    let scale = ${h.getByOffset("cOffset")};
    let bias = ${g.getByOffset("cOffset")};
    let inputMean = ${_.getByOffset("cOffset")};
    let inputVar = ${b.getByOffset("cOffset")};
    let x = ${f.getByOffset("global_idx")};
    let value = (x - inputMean) * inverseSqrt(inputVar + epsilon) * scale + bias;
    ${x.setByOffset("global_idx","value")}
  }`;return{name:"BatchNormalization",shaderCache:{hint:`${t.epsilon}_${t.format}_${a}_${s}`,inputDependencies:l?["rank","type","type","type","type"]:void 0},getShaderSource:w,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:l?[{type:12,data:d},...X(i)]:[{type:12,data:d}]})}},Zo=e=>fe(e),Cp=(e,t)=>{let{inputs:r,outputCount:a}=e,n=Zo({...t,outputCount:a});if(be.webgpu.validateInputContent&&Fo(r,n),t.trainingMode)throw new Error("BatchNormalization trainingMode is not supported yet.");e.compute(Ko(r,n))}}),Qo,Xo,Ap,lg=U(()=>{re(),ie(),Qo=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![320,640,1280].includes(e[0].dims[2]))throw new Error("number of channels should be 320, 640 or 1280");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},Xo=e=>{let t=e[0].dims,r=e[0].dims[2],a=C.size(t)/4,n=e[0].dataType,i=R("input",n,t,4),s=R("bias",n,[r],4),u=R("residual",n,t,4),d=H("output",n,t,4);return{name:"BiasAdd",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(a/64)}}),getShaderSource:l=>`
  const channels = ${r}u / 4;
  ${l.declareVariables(i,s,u,d)}

  ${l.mainStart()}
    ${l.guardAgainstOutOfBoundsWorkgroupSizes(a)}
    let value = ${i.getByOffset("global_idx")}
      + ${s.getByOffset("global_idx % channels")} + ${u.getByOffset("global_idx")};
    ${d.setByOffset("global_idx","value")}
  }`}},Ap=e=>{Qo(e.inputs),e.compute(Xo(e.inputs))}}),Yo,ce,Op,Bp,Rp,Mp,Dp,Np,Pp,Up,qp,Jo,Wp,Lp,Vp,jp,fr,Gp,Gr,Hp,Fp,Kp,Zp,Qp,Xp,Yp,Jp,ec,tc,rc,ic,ac,nc,sc,oc,Hi,uc,Ma,Da,lc,dc,pc,eu,tu,cc,cn=U(()=>{J(),re(),ve(),ie(),Yo=(e,t,r,a,n,i,s)=>{let u=Math.ceil(t/4),d="";typeof n=="string"?d=`${n}(a)`:d=n("a");let l=R("inputData",r,[u],4),c=H("outputData",a,[u],4),f=[{name:"vec_size",type:"u32"}];return s&&f.push(...s),`
      ${e.registerUniforms(f).declareVariables(l,c)}

  ${i??""}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}

    let a = ${l.getByOffset("global_idx")};
    ${c.setByOffset("global_idx",d)}
  }`},ce=(e,t,r,a,n,i=e.dataType,s,u)=>{let d=[{type:12,data:Math.ceil(C.size(e.dims)/4)}];return s&&d.push(...s),{name:t,shaderCache:{hint:n,inputDependencies:["type"]},getShaderSource:l=>Yo(l,C.size(e.dims),e.dataType,i,r,a,u),getRunData:l=>({outputs:[{dims:e.dims,dataType:i}],dispatchGroup:{x:Math.ceil(C.size(l[0].dims)/64/4)},programUniforms:d})}},Op=e=>{e.compute(ce(e.inputs[0],"Abs","abs"))},Bp=e=>{e.compute(ce(e.inputs[0],"Acos","acos"))},Rp=e=>{e.compute(ce(e.inputs[0],"Acosh","acosh"))},Mp=e=>{e.compute(ce(e.inputs[0],"Asin","asin"))},Dp=e=>{e.compute(ce(e.inputs[0],"Asinh","asinh"))},Np=e=>{e.compute(ce(e.inputs[0],"Atan","atan"))},Pp=e=>{e.compute(ce(e.inputs[0],"Atanh","atanh"))},Up=e=>fe(e),qp=(e,t)=>{let r;switch(t.to){case 10:r="vec4<f16>";break;case 1:r="vec4<f32>";break;case 12:r="vec4<u32>";break;case 6:r="vec4<i32>";break;case 9:r="vec4<bool>";break;default:throw new RangeError(`not supported type (specified in attribute 'to' from 'Cast' operator): ${t.to}`)}e.compute(ce(e.inputs[0],"Cast",r,void 0,t.cacheKey,t.to))},Jo=e=>{let t,r,a=e.length>=2&&e[1].data!==0,n=e.length>=3&&e[2].data!==0;switch(e[0].dataType){case 1:t=a?e[1].getFloat32Array()[0]:-34028234663852886e22,r=n?e[2].getFloat32Array()[0]:34028234663852886e22;break;case 10:t=a?e[1].getUint16Array()[0]:64511,r=n?e[2].getUint16Array()[0]:31743;break;default:throw new Error("Unsupport data type")}return fe({min:t,max:r})},Wp=(e,t)=>{let r=t||Jo(e.inputs),a=Ae(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"Clip",n=>`clamp(${n}, vec4<${a}>(uniforms.min), vec4<${a}>(uniforms.max))`,void 0,r.cacheKey,void 0,[{type:e.inputs[0].dataType,data:r.min},{type:e.inputs[0].dataType,data:r.max}],[{name:"min",type:a},{name:"max",type:a}]),{inputs:[0]})},Lp=e=>{e.compute(ce(e.inputs[0],"Ceil","ceil"))},Vp=e=>{e.compute(ce(e.inputs[0],"Cos","cos"))},jp=e=>{e.compute(ce(e.inputs[0],"Cosh","cosh"))},fr=e=>fe(e),Gp=(e,t)=>{let r=Ae(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"Elu",a=>`elu_vf32(${a})`,`
  const elu_alpha_ = ${r}(${t.alpha});

  fn elu_f32(a: ${r}) -> ${r} {
  return select((exp(a) - 1.0) * elu_alpha_, a, a >= 0.0);
  }

  fn elu_vf32(v: vec4<${r}>) -> vec4<${r}> {
  return vec4(elu_f32(v.x), elu_f32(v.y), elu_f32(v.z), elu_f32(v.w));
  }`,t.cacheKey))},Gr=(e="f32")=>`
const r0: ${e} = 0.3275911;
const r1: ${e} = 0.254829592;
const r2: ${e} = -0.284496736;
const r3: ${e} = 1.421413741;
const r4: ${e} = -1.453152027;
const r5: ${e} = 1.061405429;

fn erf_vf32(v: vec4<${e}>) -> vec4<${e}> {
  let absv = abs(v);
  let x = 1.0 / (1.0 + r0 * absv);
  return sign(v) * (1.0 - ((((r5 * x + r4) * x + r3) * x + r2) * x + r1) * x * exp(-absv * absv));
}`,Hp=e=>{let t=Ae(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"Erf",r=>`erf_vf32(${r})`,Gr(t)))},Fp=e=>{e.compute(ce(e.inputs[0],"Exp","exp"))},Kp=e=>{e.compute(ce(e.inputs[0],"Floor","floor"))},Zp=e=>{let t=Ae(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"Gelu",r=>`0.5 * ${r} * (1.0 + erf_vf32(${r} * 0.7071067811865475))`,Gr(t)))},Qp=(e,t)=>{let r=Ae(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"LeakyRelu",a=>`select(leaky_relu_alpha_ * ${a}, ${a}, ${a} >= vec4<${r}>(0.0))`,`const leaky_relu_alpha_ = ${r}(${t.alpha});`,t.cacheKey))},Xp=e=>{e.compute(ce(e.inputs[0],"Not",t=>`!${t}`))},Yp=e=>{e.compute(ce(e.inputs[0],"Neg",t=>`-${t}`))},Jp=e=>{e.compute(ce(e.inputs[0],"Reciprocal",t=>`1.0/${t}`))},ec=e=>{let t=Ae(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"Relu",r=>`select(vec4<${t}>(0.0), ${r}, ${r} > vec4<${t}>(0.0))`))},tc=e=>{e.compute(ce(e.inputs[0],"Sigmoid",t=>`(1.0 / (1.0 + exp(-${t})))`))},rc=e=>fe(e),ic=(e,t)=>{let r=Ae(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"HardSigmoid",a=>`max(vec4<${r}>(0.0), min(vec4<${r}>(1.0), ${t.alpha} * ${a} + vec4<${r}>(${t.beta})))`,void 0,t.cacheKey))},ac=e=>{e.compute(ce(e.inputs[0],"Sin","sin"))},nc=e=>{e.compute(ce(e.inputs[0],"Sinh","sinh"))},sc=e=>{e.compute(ce(e.inputs[0],"Sqrt","sqrt"))},oc=e=>{e.compute(ce(e.inputs[0],"Tan","tan"))},Hi=e=>`sign(${e}) * (1 - exp(-2 * abs(${e}))) / (1 + exp(-2 * abs(${e})))`,uc=e=>{e.compute(ce(e.inputs[0],"Tanh",Hi))},Ma=(e="f32")=>`
const fast_gelu_a: ${e} = 0.5;
const fast_gelu_b: ${e} = 0.7978845608028654;
const fast_gelu_c: ${e} = 0.035677408136300125;

fn tanh_v(v: vec4<${e}>) -> vec4<${e}> {
  return ${Hi("v")};
}
`,Da=e=>`(fast_gelu_a + fast_gelu_a * tanh_v(${e} * (fast_gelu_c * ${e} * ${e} + fast_gelu_b))) * ${e}`,lc=e=>{let t=Ae(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"FastGelu",Da,Ma(t),void 0,e.inputs[0].dataType))},dc=(e,t)=>{let r=Ae(e.inputs[0].dataType);return e.compute(ce(e.inputs[0],"ThresholdedRelu",a=>`select(vec4<${r}>(0.0), ${a}, ${a} > thresholded_relu_alpha_)`,`const thresholded_relu_alpha_ = vec4<${r}>(${t.alpha});`,t.cacheKey)),0},pc=e=>{e.compute(ce(e.inputs[0],"Log","log"))},eu=(e,t)=>`
const alpha = vec4<${e}>(${t});
const one = ${e}(1.0);
const zero = ${e}(0.0);

fn quick_gelu_impl(x: vec4<${e}>) -> vec4<${e}> {
  let v = x *alpha;
  var x1 : vec4<${e}>;
  for (var i = 0; i < 4; i = i + 1) {
    if (v[i] >= zero) {
      x1[i] = one / (one + exp(-v[i]));
    } else {
      x1[i] = one - one / (one + exp(v[i]));
    }
  }
  return x * x1;
}
`,tu=e=>`quick_gelu_impl(${e})`,cc=(e,t)=>{let r=Ae(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"QuickGelu",tu,eu(r,t.alpha),t.cacheKey,e.inputs[0].dataType))}}),ru,iu,fc,dg=U(()=>{re(),ie(),cn(),ru=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![2560,5120,10240].includes(e[0].dims[2]))throw new Error("hidden state should be 2560, 5120 or 10240");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},iu=e=>{let t=e[0].dims.slice();t[2]=t[2]/2;let r=R("input",e[0].dataType,e[0].dims,4),a=R("bias",e[0].dataType,[e[0].dims[2]],4),n=H("output",e[0].dataType,t,4),i=C.size(t)/4,s=ke(e[0].dataType);return{name:"BiasSplitGelu",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(i/64)}}),getShaderSource:u=>`
  const M_SQRT2 = sqrt(2.0);
  const halfChannels = ${e[0].dims[2]/4/2}u;

  ${u.declareVariables(r,a,n)}

  ${Gr(s)}

  ${u.mainStart()}
    ${u.guardAgainstOutOfBoundsWorkgroupSizes(i)}
    let biasIdx = global_idx % halfChannels;
    let batchIndex = global_idx / halfChannels;
    let inputOffset = biasIdx + batchIndex * halfChannels * 2;
    let valueLeft = input[inputOffset] + bias[biasIdx];
    let valueRight = input[inputOffset + halfChannels] + bias[biasIdx + halfChannels];
    let geluRight = valueRight * 0.5 * (erf_vf32(valueRight / M_SQRT2) + 1);

    ${n.setByOffset("global_idx","valueLeft * geluRight")}
  }`}},fc=e=>{ru(e.inputs),e.compute(iu(e.inputs))}}),au,nu,Qe,hc,mc,gc,_c,yc,bc,wc,$c,vc,xc,pg=U(()=>{J(),re(),ie(),au=(e,t,r,a,n,i,s,u,d,l,c,f)=>{let h,g;typeof u=="string"?h=g=(w,k)=>`${u}((${w}),(${k}))`:typeof u=="function"?h=g=u:(h=u.scalar,g=u.vector);let _=H("outputData",c,a.length,4),b=R("aData",d,t.length,4),x=R("bData",l,r.length,4),$;if(n)if(i){let w=C.size(t)===1,k=C.size(r)===1,S=t.length>0&&t[t.length-1]%4===0,I=r.length>0&&r[r.length-1]%4===0;w||k?$=_.setByOffset("global_idx",g(w?`${b.type.value}(${b.getByOffset("0")}.x)`:b.getByOffset("global_idx"),k?`${x.type.value}(${x.getByOffset("0")}.x)`:x.getByOffset("global_idx"))):$=`
            let outputIndices = ${_.offsetToIndices("global_idx * 4u")};
            let offsetA = ${b.broadcastedIndicesToOffset("outputIndices",_)};
            let offsetB = ${x.broadcastedIndicesToOffset("outputIndices",_)};
            ${_.setByOffset("global_idx",g(s||S?b.getByOffset("offsetA / 4u"):`${b.type.value}(${b.getByOffset("offsetA / 4u")}[offsetA % 4u])`,s||I?x.getByOffset("offsetB / 4u"):`${x.type.value}(${x.getByOffset("offsetB / 4u")}[offsetB % 4u])`))}
          `}else $=_.setByOffset("global_idx",g(b.getByOffset("global_idx"),x.getByOffset("global_idx")));else{if(!i)throw new Error("no necessary to use scalar implementation for element-wise binary op implementation.");let w=(k,S,I="")=>{let E=`aData[indexA${S}][componentA${S}]`,z=`bData[indexB${S}][componentB${S}]`;return`
            let outputIndices${S} = ${_.offsetToIndices(`global_idx * 4u + ${S}u`)};
            let offsetA${S} = ${b.broadcastedIndicesToOffset(`outputIndices${S}`,_)};
            let offsetB${S} = ${x.broadcastedIndicesToOffset(`outputIndices${S}`,_)};
            let indexA${S} = offsetA${S} / 4u;
            let indexB${S} = offsetB${S} / 4u;
            let componentA${S} = offsetA${S} % 4u;
            let componentB${S} = offsetB${S} % 4u;
            ${k}[${S}] = ${I}(${h(E,z)});
          `};c===9?$=`
            var data = vec4<u32>(0);
            ${w("data",0,"u32")}
            ${w("data",1,"u32")}
            ${w("data",2,"u32")}
            ${w("data",3,"u32")}
            outputData[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:$=`
            ${w("outputData[global_idx]",0)}
            ${w("outputData[global_idx]",1)}
            ${w("outputData[global_idx]",2)}
            ${w("outputData[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(b,x,_)}

        ${f??""}

        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${$}
      }`},nu=(e,t,r,a,n,i,s=r.dataType)=>{let u=r.dims.map(b=>Number(b)??1),d=a.dims.map(b=>Number(b)??1),l=!C.areEqual(u,d),c=u,f=C.size(u),h=!1,g=!1,_=[l];if(l){let b=Gt.calcShape(u,d,!1);if(!b)throw new Error("Can't perform binary op on the given tensors");c=b.slice(),f=C.size(c);let x=C.size(u)===1,$=C.size(d)===1,w=u.length>0&&u[u.length-1]%4===0,k=d.length>0&&d[d.length-1]%4===0;_.push(x),_.push($),_.push(w),_.push(k);let S=1;for(let I=1;I<c.length;I++){let E=u[u.length-I],z=d[d.length-I];if(E===z)S*=E;else break}S%4===0?(g=!0,h=!0):(x||$||w||k)&&(h=!0)}else h=!0;return _.push(h),{name:e,shaderCache:{hint:t+_.map(b=>b.toString()).join("_"),inputDependencies:["rank","rank"]},getShaderSource:b=>au(b,u,d,c,h,l,g,n,r.dataType,a.dataType,s,i),getRunData:()=>({outputs:[{dims:c,dataType:s}],dispatchGroup:{x:Math.ceil(f/64/4)},programUniforms:[{type:12,data:Math.ceil(C.size(c)/4)},...X(u,d,c)]})}},Qe=(e,t,r,a,n,i)=>{e.compute(nu(t,n??"",e.inputs[0],e.inputs[1],r,a,i))},hc=e=>{Qe(e,"Add",(t,r)=>`${t}+${r}`)},mc=e=>{Qe(e,"Div",(t,r)=>`${t}/${r}`)},gc=e=>{Qe(e,"Equal",{scalar:(t,r)=>`u32(${t}==${r})`,vector:(t,r)=>`vec4<u32>(${t}==${r})`},void 0,void 0,9)},_c=e=>{Qe(e,"Mul",(t,r)=>`${t}*${r}`)},yc=e=>{let t=R("input",e.inputs[0].dataType,e.inputs[0].dims).type.value;Qe(e,"Pow",{scalar:(r,a)=>`pow_custom(${r},${a})`,vector:(r,a)=>`pow_vector_custom(${r},${a})`},`
    fn pow_custom(a : ${t}, b : ${t}) -> ${t} {
      if (b == ${t}(0.0)) {
        return ${t}(1.0);
      } else if (a < ${t}(0.0) && f32(b) != floor(f32(b))) {
        return ${t}(pow(f32(a), f32(b))); // NaN
      }
      return select(sign(a), ${t}(1.0), round(f32(abs(b) % ${t}(2.0))) != 1.0) * ${t}(${t==="i32"?"round":""}(pow(f32(abs(a)), f32(b))));
    }
    fn pow_vector_custom(a : vec4<${t}>, b : vec4<${t}>) -> vec4<${t}> {
      // TODO: implement vectorized pow
      return vec4<${t}>(pow_custom(a.x, b.x), pow_custom(a.y, b.y), pow_custom(a.z, b.z), pow_custom(a.w, b.w));
    }
      `)},bc=e=>{Qe(e,"Sub",(t,r)=>`${t}-${r}`)},wc=e=>{Qe(e,"Greater",{scalar:(t,r)=>`u32(${t}>${r})`,vector:(t,r)=>`vec4<u32>(${t}>${r})`},void 0,void 0,9)},$c=e=>{Qe(e,"Less",{scalar:(t,r)=>`u32(${t}<${r})`,vector:(t,r)=>`vec4<u32>(${t}<${r})`},void 0,void 0,9)},vc=e=>{Qe(e,"GreaterOrEqual",{scalar:(t,r)=>`u32(${t}>=${r})`,vector:(t,r)=>`vec4<u32>(${t}>=${r})`},void 0,void 0,9)},xc=e=>{Qe(e,"LessOrEqual",{scalar:(t,r)=>`u32(${t}<=${r})`,vector:(t,r)=>`vec4<u32>(${t}<=${r})`},void 0,void 0,9)}}),su,ou,uu,lu,Sc,kc,cg=U(()=>{J(),re(),ve(),ie(),su=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");let r=0,a=e[r],n=a.dataType,i=a.dims.length;e.forEach((s,u)=>{if(u!==r){if(s.dataType!==n)throw new Error("input tensors should be one type");if(s.dims.length!==i)throw new Error("input tensors should have the same shape");s.dims.forEach((d,l)=>{if(l!==t&&d!==a.dims[l])throw new Error("non concat dimensions must match")})}})},ou=(e,t)=>`
  fn calculateInputIndex(index: u32) -> u32 {
    let sizeInConcatAxis = array<u32, ${e}u>(${t});
    for (var i: u32 = 0u; i < ${e}; i += 1u ) {
      if (index < sizeInConcatAxis[i]) {
        return i;
      }
    }
    return ${e}u;
  }`,uu=(e,t)=>{let r=e.length,a=[];for(let n=0;n<r;++n){let i=t.setByOffset("global_idx",e[n].getByIndices("indices"));r===1?a.push(i):n===0?a.push(`if (inputIndex == ${n}u) { ${i} }`):n===r-1?a.push(`else { ${i} }`):a.push(`else if (inputIndex == ${n}) { ${i} }`)}return a.join(`
`)},lu=(e,t,r,a)=>{let n=C.size(r),i=new Array(e.length),s=new Array(e.length),u=0,d=[],l=[],c=[{type:12,data:n}];for(let b=0;b<e.length;++b)u+=e[b].dims[t],i[b]=u,l.push(e[b].dims.length),s[b]=R(`input${b}`,a,l[b]),d.push("rank"),c.push({type:12,data:i[b]});for(let b=0;b<e.length;++b)c.push(...X(e[b].dims));c.push(...X(r));let f=H("output",a,r.length),h=f.indicesGet("indices",t),g=Array.from(Array(i.length).keys()).map(b=>`uniforms.sizeInConcatAxis${b}`).join(","),_=b=>`

  ${(()=>{b.registerUniform("outputSize","u32");for(let x=0;x<e.length;x++)b.registerUniform(`sizeInConcatAxis${x}`,"u32");return b.declareVariables(...s,f)})()}

  ${ou(i.length,g)}

  ${b.mainStart()}
    ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

    var indices = ${f.offsetToIndices("global_idx")};

    let inputIndex = calculateInputIndex(${h});
    if (inputIndex != 0u) {
      let sizeInConcatAxis = array<u32, ${i.length}u>(${g});
      ${h} -= sizeInConcatAxis[inputIndex - 1u];
    }

    ${uu(s,f)}
  }`;return{name:"Concat",shaderCache:{hint:`${t}`,inputDependencies:d},getRunData:()=>({outputs:[{dims:r,dataType:a}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:c}),getShaderSource:_}},Sc=(e,t)=>{let r=e.inputs,a=r[0].dims,n=C.normalizeAxis(t.axis,a.length);su(r,n);let i=a.slice();i[n]=r.reduce((u,d)=>u+(d.dims.length>n?d.dims[n]:0),0);let s=r.filter(u=>C.size(u.dims)>0);e.compute(lu(s,n,i,r[0].dataType),{inputs:s})},kc=e=>fe({axis:e.axis})}),Bt,Rt,Mt,fn,Pt=U(()=>{J(),re(),Bt=(e,t,r="f32")=>{switch(e.activation){case"Relu":return`value = max(value, ${t}(0.0));`;case"Sigmoid":return`value = (${t}(1.0) / (${t}(1.0) + exp(-value)));`;case"Clip":return`value = clamp(value, ${t}(${r}(uniforms.clip_min)), ${t}(${r}(uniforms.clip_max)));`;case"HardSigmoid":return`value = max(${t}(0.0), min(${t}(1.0), ${r}(uniforms.alpha) * value + ${r}(uniforms.beta)));`;case"LeakyRelu":return`value = select(${r}(uniforms.alpha) * value, value, value >= ${t}(0.0));`;case"Tanh":return`let e2x = exp(-2.0 * abs(value));
              value = sign(value) * (1.0 - e2x) / (1.0 + e2x);
        `;case"":return"";default:throw new Error(`Unsupported activation ${e.activation}`)}},Rt=(e,t)=>{e.activation==="Clip"?t.push({type:1,data:e.clipMax},{type:1,data:e.clipMin}):e.activation==="HardSigmoid"?t.push({type:1,data:e.alpha},{type:1,data:e.beta}):e.activation==="LeakyRelu"&&t.push({type:1,data:e.alpha})},Mt=(e,t)=>{e.activation==="Clip"?t.push({name:"clip_max",type:"f32"},{name:"clip_min",type:"f32"}):e.activation==="HardSigmoid"?t.push({name:"alpha",type:"f32"},{name:"beta",type:"f32"}):e.activation==="LeakyRelu"&&t.push({name:"alpha",type:"f32"})},fn=e=>{let t=(e==null?void 0:e.activation)||"";if(t==="HardSigmoid"){let[r,a]=(e==null?void 0:e.activation_params)||[.2,.5];return{activation:t,alpha:r,beta:a}}else if(t==="Clip"){let[r,a]=(e==null?void 0:e.activation_params)||[Xd,Yd];return{activation:t,clipMax:a,clipMin:r}}else if(t==="LeakyRelu"){let[r]=(e==null?void 0:e.activation_params)||[.01];return{activation:t,alpha:r}}return{activation:t}}}),Te,Ic,hn=U(()=>{Te=(e,t)=>{switch(e){case 1:return t;case 2:return`vec2<${t}>`;case 3:return`vec3<${t}>`;case 4:return`vec4<${t}>`;default:throw new Error(`${e}-component is not supported.`)}},Ic=e=>`
      ${e?"value = value + getBiasByOutputCoords(coords);":""}
      `}),Tc,fg=U(()=>{Tc=e=>`
fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
      shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
}
fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
    i32(${e}.x), i32(${e}.y), i32(${e}.z), 1));
}
`}),mr,mn,gn=U(()=>{J(),re(),ie(),Pt(),mr=(e,t,r,a,n)=>{let i=a-r;return`
      ${Array.from({length:r}).map((s,u)=>`
      if (${F(t.shape,u,t.rank)} != 1) {
        ${t.indicesSet(e,u,F(n,u+i,a))}
      } else {
        ${t.indicesSet(e,u,0)}
      }`).join("")}
`},mn=(e,t,r,a,n=!1,i)=>{let s=e[0].dims,u=e[1].dims,d=s[s.length-2],l=u[u.length-1],c=s[s.length-1],f=$e(l),h=$e(c),g=$e(d),_=C.size(r)/f/g,b=e.length>2,x=a?a.slice(0,-2):r.slice(0,-2),$=[C.size(x),d,l],w=[{type:12,data:_},{type:12,data:d},{type:12,data:l},{type:12,data:c}];Rt(t,w),w.push(...X(x,s,u)),b&&w.push(...X(e[2].dims)),w.push(...X($));let k=S=>{let I=ln("batch_dims",e[0].dataType,x.length),E=R("a",e[0].dataType,s.length,h),z=R("b",e[1].dataType,u.length,f),A=H("output",e[0].dataType,$.length,f),O=ke(A.type.tensor),q=Bt(t,A.type.value,O),K=[E,z],W="";if(b){let ee=n?f:1;K.push(R("bias",e[2].dataType,e[2].dims.length,ee)),W=`${n?`value += bias[col / ${ee}];`:`value += ${A.type.value}(bias[row + i]);`}`}let Z=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"}];Mt(t,Z);let ue=()=>{let ee=`var a_data: ${E.type.value};`;for(let j=0;j<h;j++)ee+=`
              let b_data${j} = b[(b_offset + (k + ${j}) * uniforms.N + col) / ${f}];`;for(let j=0;j<g;j++){ee+=`a_data = a[(a_offset + (row + ${j}) * uniforms.K + k) / ${h}];`;for(let L=0;L<h;L++)ee+=`
            values[${j}] = fma(${z.type.value}(a_data${h===1?"":`[${L}]`}), b_data${L}, values[${j}]);
`}return ee};return`
  ${S.registerUniforms(Z).registerInternalVariables(I).declareVariables(...K,A)}
  ${S.mainStart()}
    ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let col = (global_idx % (uniforms.N / ${f})) * ${f};
    var index1 = global_idx / (uniforms.N / ${f});
    let stride1 = uniforms.M / ${g};
    let row = (index1 % stride1) * ${g};
    let batch = index1 / stride1;

    ${r.length===2?"":`let batch_indices = ${I.offsetToIndices("batch")};`}

    var a_indices: ${E.type.indices};
    ${mr("a_indices",E,E.rank-2,I.rank,"batch_indices")}
    ${E.indicesSet("a_indices",E.rank-2,0)}
    ${E.indicesSet("a_indices",E.rank-1,0)}
    let a_offset = ${E.indicesToOffset("a_indices")};

    var b_indices: ${z.type.indices};
    ${mr("b_indices",z,z.rank-2,I.rank,"batch_indices")}
    ${z.indicesSet("b_indices",z.rank-2,0)}
    ${z.indicesSet("b_indices",z.rank-1,0)}
    let b_offset = ${z.indicesToOffset("b_indices")};
    var values: array<${A.type.value}, ${g}>;
    for (var k: u32 = 0u; k < uniforms.K; k = k + ${h}) {
      ${ue()}
    }
    for (var i = 0u; i < ${g}u; i++) {
      var value = values[i];
      ${W}
      ${q}
      let cur_indices = ${A.type.indices}(batch, row + i, col);
      let offset = ${A.indicesToOffset("cur_indices")};
      ${A.setByOffset(`offset / ${f}`,"value")};
    }
  }
  `};return{name:"MatMulNaive",shaderCache:{hint:`${t.activation};${f};${h};${g};${n}`,inputDependencies:b?["rank","rank","rank"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(_/64)},programUniforms:w}),getShaderSource:k}}}),du,pu,Na,Fi,cu,Pa,fu,Xr,_n=U(()=>{J(),re(),ie(),Pt(),gn(),hn(),du=(e,t)=>e?`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          kStart + inputRow,
          globalRowStart / innerElementSize + inputCol${t?", batchIndices":""});
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          globalRow + innerRow,
          kStart / innerElementSize + inputCol${t?", batchIndices":""});
        `,pu=(e,t)=>e?`
        let ACached0 = mm_Asub[k * innerElementSize][localRow];
        let ACached1 = mm_Asub[k * innerElementSize + 1][localRow];
        let ACached2 = mm_Asub[k * innerElementSize + 2][localRow];
        ${t===3?"":"let ACached3 = mm_Asub[k * innerElementSize + 3][localRow];"}
        for (var i = 0; i < rowPerThread; i = i + 1) {
          acc[i] = BCached0 * ACached0[i] + acc[i];
          acc[i] = BCached1 * ACached1[i] + acc[i];
          acc[i] = BCached2 * ACached2[i] + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached3[i] + acc[i];"}
        }`:`
        for (var i = 0; i < rowPerThread; i = i + 1) {
          let ACached = mm_Asub[tileRow + i][k];
          acc[i] = BCached0 * ACached.x + acc[i];
          acc[i] = BCached1 * ACached.y + acc[i];
          acc[i] = BCached2 * ACached.z + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached.w + acc[i];"}
        }`,Na=(e,t,r="f32",a,n=!1,i=32,s=!1,u=32)=>{let d=t[1]*e[1],l=t[0]*e[0],c=n?d:i,f=n?i:d,h=c/t[0],g=i/t[1];if(!((n&&h===4&&e[1]===4||!n&&(h===3||h===4))&&c%t[0]===0&&i%t[1]===0&&e[0]===4))throw new Error(`If transposeA ${n} is true, innerElementSize ${h} and workPerThread[1] ${e[1]} must be 4.
      Otherwise, innerElementSize ${h} must be 3 or 4.
  tileAWidth ${c} must be divisible by workgroupSize[0]${t[0]}. tileInner ${i} must be divisible by workgroupSize[1] ${t[1]}. colPerThread ${e[0]} must be 4.`);return`
var<workgroup> mm_Asub: array<array<vec${h}<${r}>, ${c/h}>, ${f}>;
var<workgroup> mm_Bsub: array<array<vec4<${r}>, ${l/e[0]}>, ${i}>;

const rowPerThread = ${e[1]};
const colPerThread = ${e[0]};
const innerElementSize = ${h};
const tileInner = ${i};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
  let localRow = i32(localId.y);
  let tileRow = localRow * rowPerThread;
  let tileCol = i32(localId.x);

  let globalRow =i32(globalId.y) * rowPerThread;
  let globalCol = i32(globalId.x);
  let batch = ${s?"0":"i32(globalId.z)"};
  ${a?`let batchIndices = ${a.offsetToIndices("u32(batch)")};`:""}
  let globalRowStart = i32(workgroupId.y) * ${d};

  let num_tiles = ${s?`${Math.ceil(u/i)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
  var kStart = ${s?`i32(globalId.z) * ${u}`:"0"};

  var acc: array<vec4<${r}>, rowPerThread>;

  // Loop over shared dimension.
  let tileRowB = localRow * ${g};
  for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let inputRow = tileRow + innerRow;
          let inputCol = tileCol;
          ${du(n,a)}
      }

      // Load one tile of B into local memory.
      for (var innerRow = 0; innerRow < ${g}; innerRow = innerRow + 1) {
          let inputRow = tileRowB + innerRow;
          let inputCol = tileCol;
          mm_Bsub[inputRow][inputCol] = mm_readB(batch, kStart + inputRow, globalCol${a?", batchIndices":""});
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      for (var k = 0; k < tileInner / innerElementSize; k = k + 1) {
          let BCached0 = mm_Bsub[k * innerElementSize][tileCol];
          let BCached1 = mm_Bsub[k * innerElementSize + 1][tileCol];
          let BCached2 = mm_Bsub[k * innerElementSize + 2][tileCol];
          ${h===3?"":"let BCached3 = mm_Bsub[k * innerElementSize + 3][tileCol];"}

          ${pu(n,h)}
      }

      workgroupBarrier();
  }

  for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      mm_write(batch, globalRow + innerRow, globalCol, acc[innerRow]);
  }
}`},Fi=(e,t)=>e?`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              kStart + inputRow,
              globalRowStart + inputCol${t?", batchIndices":""});
            `:`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              globalRowStart + inputRow,
              kStart + inputCol${t?", batchIndices":""});
            `,cu=e=>e?"let ACached = mm_Asub[k][tileRow + innerRow];":"let ACached = mm_Asub[tileRow + innerRow][k];",Pa=(e,t,r="f32",a,n=!1,i=32,s=!1,u=32,d=!1)=>{let l=e[1]*t[1],c=e[0]*t[0],f=n?l:i,h=n?i:l;if(!(h%t[1]===0&&f%t[0]===0&&i%t[1]===0))throw new Error(`tileAHight ${h} must be divisible by workgroupSize[1]${t[1]}, tileAWidth ${f} must be divisible by workgroupSize[0]${t[0]}, tileInner ${i} must be divisible by workgroupSize[1]${t[1]}`);let g=h/t[1],_=f/t[0],b=i/t[1],x=d?`
    let localRow = i32(localId.y);
    let localCol = i32(localId.x);
    let globalRowStart = i32(workgroupId.y) * ${l};
    let globalColStart = i32(workgroupId.x) * ${c};

    // Loop over shared dimension.
    for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var inputRow = localRow; inputRow < ${h}; inputRow = inputRow + ${t[1]}) {
        for (var inputCol = localCol; inputCol < ${f}; inputCol = inputCol + ${t[0]}) {
          ${Fi(n,a)}
        }
      }
      // Load one tile of B into local memory.
      for (var inputRow = localRow; inputRow < ${i}; inputRow = inputRow + ${t[1]}) {
            for (var inputCol = localCol; inputCol < ${c}; inputCol = inputCol + ${t[0]}) {
          mm_Bsub[inputRow][inputCol] = mm_readB(batch,
            kStart + inputRow,
            globalColStart + inputCol${a?", batchIndices":""});
        }
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      var BCached : array<${r}, colPerThread>;
      for (var k = 0; k < tileInner; k = k + 1) {
        for (var inner = 0; inner < colPerThread; inner = inner + 1) {
          BCached[inner] = mm_Bsub[k][localCol + inner * ${t[0]}];
        }
        for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let ACached = ${n?`mm_Asub[k][localRow + innerRow * ${t[1]}];`:`mm_Asub[localRow + innerRow * ${t[1]}][k];`}
          for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
            acc[innerRow][innerCol] = acc[innerRow][innerCol] +
                ACached * BCached[innerCol];
          }
        }
      }
      workgroupBarrier();
    }
    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      let gRow = globalRowStart + localRow + innerRow * ${t[1]};
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        let gCol = globalColStart + localCol + innerCol * ${t[0]};
        mm_write(batch, gRow, gCol, acc[innerRow][innerCol]);
      }
    }
    `:`
let tileRow = i32(localId.y) * rowPerThread;
let tileCol = i32(localId.x) * colPerThread;

let globalRow = i32(globalId.y) * rowPerThread;
let globalCol = i32(globalId.x) * colPerThread;
let globalRowStart = i32(workgroupId.y) * ${l};

let tileRowA = i32(localId.y) * ${g};
let tileColA = i32(localId.x) * ${_};
let tileRowB = i32(localId.y) * ${b};
// Loop over shared dimension.
for (var t = 0; t < num_tiles; t = t + 1) {
  // Load one tile of A into local memory.
  for (var innerRow = 0; innerRow < ${g}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < ${_}; innerCol = innerCol + 1) {
      let inputRow = tileRowA + innerRow;
      let inputCol = tileColA + innerCol;
      ${Fi(n,a)}
    }
  }

  // Load one tile of B into local memory.
  for (var innerRow = 0; innerRow < ${b}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
      let inputRow = tileRowB + innerRow;
      let inputCol = tileCol + innerCol;
      mm_Bsub[inputRow][inputCol] = mm_readB(batch,
        kStart + inputRow,
        globalCol + innerCol${a?", batchIndices":""});
    }
  }
  kStart = kStart + tileInner;
  workgroupBarrier();

  // Compute acc values for a single thread.
  var BCached : array<${r}, colPerThread>;
  for (var k = 0; k < tileInner; k = k + 1) {
    for (var inner = 0; inner < colPerThread; inner = inner + 1) {
      BCached[inner] = mm_Bsub[k][tileCol + inner];
    }

    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      ${cu(n)}
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        acc[innerRow][innerCol] = acc[innerRow][innerCol] + ACached * BCached[innerCol];
      }
    }
  }

  workgroupBarrier();
}

for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
  for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
    mm_write(batch, globalRow + innerRow, globalCol + innerCol,
        acc[innerRow][innerCol]);
  }
}
`;return`
  var<workgroup> mm_Asub : array<array<${r}, ${f}>, ${h}>;
  var<workgroup> mm_Bsub : array<array<${r}, ${c}>, ${i}>;
  const rowPerThread = ${e[1]};
  const colPerThread = ${e[0]};
  const tileInner = ${i};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
    let batch = ${s?"0":"i32(globalId.z)"};
    ${a?`let batchIndices = ${a.offsetToIndices("u32(batch)")};`:""}
    let num_tiles = ${s?`${Math.ceil(u/i)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
    var kStart = ${s?`i32(globalId.z) * ${u}`:"0"};

    var acc : array<array<${r}, colPerThread>, rowPerThread>;
    ${x}
  }
`},fu=(e,t,r,a,n=!1)=>{let[i,s,u,d]=a,l=ke(a[0].type.tensor);return`
    fn mm_readA(batch: i32, row: i32, colIn: i32, batchIndices: ${i.type.indices}) -> ${Te(e,l)} {
      var value = ${Te(e,l)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_a_outer && col < uniforms.dim_inner)
      {
        var aIndices: ${s.type.indices};
        ${mr("aIndices",s,s.rank-2,i.rank,"batchIndices")}
        ${s.indicesSet("aIndices",s.rank-2,"u32(row)")}
        ${s.indicesSet("aIndices",s.rank-1,"u32(colIn)")}
        value = ${s.getByIndices("aIndices")};
      }
      return value;
    }

    fn mm_readB(batch: i32, row: i32, colIn: i32, batchIndices: ${i.type.indices}) -> ${Te(e,l)} {
      var value = ${Te(e,l)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_inner && col < uniforms.dim_b_outer)
      {
        var bIndices: ${u.type.indices};
        ${mr("bIndices",u,u.rank-2,i.rank,"batchIndices")}
        ${u.indicesSet("bIndices",u.rank-2,"u32(row)")}
        ${u.indicesSet("bIndices",u.rank-1,"u32(colIn)")}
        value = ${u.getByIndices("bIndices")};
      }
      return value;
    }

    fn mm_write(batch: i32, row: i32, colIn: i32, valueIn: ${Te(e,l)}) {
      let col = colIn * ${e};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer) {
        var value = valueIn;
        let coords = vec3<i32>(batch, row, colIn);
        ${t?`value = value + ${n?"bias[colIn]":`${Te(e,l)}(bias[row])`};`:""}
        ${r}
        ${d.setByIndices("vec3<u32>(coords)","value")}
      }
    }
    `},Xr=(e,t,r,a,n=!1,i)=>{let s=e[0].dims,u=e[1].dims,d=s.slice(0,-2),l=u.slice(0,-2),c=a?a.slice(0,-2):r.slice(0,-2),f=C.size(c),h=s[s.length-2],g=s[s.length-1],_=u[u.length-1],b=g%4===0&&_%4===0,x=h<=8?[4,1,1]:[4,4,1],$=[8,8,1],w=[Math.ceil(_/$[0]/x[0]),Math.ceil(h/$[1]/x[1]),Math.ceil(f/$[2]/x[2])],k=b?4:1,S=[...d,h,g/k],I=S.length,E=[...l,g,_/k],z=E.length,A=[f,h,_/k],O=[{type:6,data:h},{type:6,data:_},{type:6,data:g}];Rt(t,O),O.push(...X(c,S,E));let q=["rank","rank"],K=e.length>2;K&&(O.push(...X(e[2].dims)),q.push("rank")),O.push(...X(A));let W=Z=>{let ue=c.length,ee=ln("batchDims",e[0].dataType,ue,1),j=ke(e[0].dataType),L=R("a",e[0].dataType,I,k),de=R("b",e[1].dataType,z,k),te=H("result",e[0].dataType,A.length,k),ae=[L,de];if(K){let Ie=n?k:1;ae.push(R("bias",e[2].dataType,e[2].dims.length,Ie))}let M=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"}];Mt(t,M);let P=ke(te.type.tensor),G=Bt(t,te.type.value,P),oe=fu(k,K,G,[ee,L,de,te],n);return`
  ${Z.registerUniforms(M).registerInternalVariables(ee).declareVariables(...ae,te)}
  ${oe}
  ${b?Na(x,$,j,ee):Pa(x,$,j,ee)}
                   `};return{name:"MatMul",shaderCache:{hint:`${x};${t.activation};${b};${n}`,inputDependencies:q},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:w[0],y:w[1],z:w[2]},programUniforms:O}),getShaderSource:W}}}),hu,Ec,hg=U(()=>{J(),ct(),ie(),Pt(),hn(),fg(),_n(),hu=(e,t,r,a,n=!1,i,s=4,u=4,d=4,l="f32")=>{let c=O=>{switch(O){case 1:return"resData = x[xIndex];";case 3:return`resData = vec3<${l}>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);`;case 4:return"resData = x[xIndex / 4];";default:throw new Error(`innerElementSize ${O} is not supported.`)}},f=O=>{switch(O){case 1:return"return w[row * i32(uniforms.w_shape[3]) + colIn];";case 4:return"return w[row * i32(uniforms.w_shape[3]) / 4 + colIn];";default:throw new Error(`innerElementSize ${O} is not supported.`)}},h=e?`
    let coord = vec4<i32>(batch, xRow, xCol, xCh);
    `:`
    let coord = vec4<i32>(batch, xCh, xRow, xCol);
    `,g=e?`
    let coords = vec4<i32>(
      batch,
      row / outWidth,
      row % outWidth,
      col);
    `:`
    let coords = vec4<i32>(
      batch,
      row,
      col / outWidth,
      col % outWidth);
    `,_=e?"i32(uniforms.x_shape[1])":"i32(uniforms.x_shape[2])",b=e?"i32(uniforms.x_shape[2])":"i32(uniforms.x_shape[3])",x=e?"row":"col",$=e?"col":"row",w=`
    let inChannels = i32(uniforms.w_shape[2]);
    let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
    let outRow = ${x} / outWidth;
    let outCol = ${x} % outWidth;

    let WRow = ${$} / (i32(uniforms.w_shape[1]) * inChannels);
    let WCol = ${$} / inChannels % i32(uniforms.w_shape[1]);
    let xRow = outRow * uniforms.stride[0] + uniforms.dilation[0] * WRow - uniforms.pad[0];
    let xCol = outCol * uniforms.stride[1] + uniforms.dilation[1] * WCol - uniforms.pad[1];
    let xCh = ${$} % inChannels;
    var resData = ${Te(s,l)}(0.0);
    // The bounds checking is always needed since we use it to pad zero for
    // the 'same' padding type.
    if (xRow >= 0 && xRow < ${_} && xCol >= 0 && xCol < ${b}) {
      ${h}
      let xIndex = getIndexFromCoords4D(coord, vec4<i32>(uniforms.x_shape));
      ${c(s)}
    }
    return resData;`,k=e?t&&a?`
    let col = colIn * ${s};
    ${w}`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_a_outer && col < uniforms.dim_inner) {
      ${w}
    }
    return ${Te(s,l)}(0.0);`:a&&r?`
    let col = colIn * ${s};
    ${w}`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${w}
    }
    return ${Te(s,l)}(0.0);`,S=e?a&&r?f(u):`
    let col = colIn * ${u};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${f(u)}
    }
    return ${Te(u,l)}(0.0);`:`
    let col = colIn * ${u};
    if (row < uniforms.dim_inner && col < uniforms.dim_a_outer) {
      ${f(u)}
    }
    return ${Te(u,l)}(0.0);`,I=Te(d,l),E=Te(e?s:u,l),z=Te(e?u:s,l),A=Bt(i,I,l);return`
    fn mm_readA(batch: i32, row : i32, colIn : i32) -> ${E} {
      ${e?k:S}
    }

    fn mm_readB(batch: i32, row : i32, colIn : i32) -> ${z} {
      ${e?S:k}
    }

    fn mm_write(batch: i32, row : i32, colIn : i32, valueIn : ${I}) {
      let col = colIn * ${d};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer)
      {
      var value = valueIn;
      let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
      ${g}
      ${Ic(n)}
      ${A}
      setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
      }
    }`},Ec=(e,t,r,a,n,i,s,u,d)=>{let l=t.format==="NHWC",c=l?e[0].dims[3]:e[0].dims[1],f=r[0],h=l?r[2]:r[3],g=l?r[1]:r[2],_=l?r[3]:r[1],b=l&&(c%4===0||c%3===0)&&_%4===0,x=l?_:h*g,$=l?h*g:_,w=[8,8,1],k=a<=8?[4,1,1]:[4,4,1],S=[Math.ceil(x/w[0]/k[0]),Math.ceil($/w[1]/k[1]),Math.ceil(f/w[2]/k[2])];le("verbose",()=>`[conv2d_mm_webgpu] dispatch = ${S}`);let I=b?l&&c%4!==0?3:4:1,E=w[1]*k[1],z=w[0]*k[0],A=Math.max(w[0]*I,w[1]),O=a%E===0,q=n%z===0,K=i%A===0,W=b?[I,4,4]:[1,1,1],Z=[{type:6,data:a},{type:6,data:n},{type:6,data:i},{type:6,data:[t.pads[0],t.pads[1]]},{type:6,data:t.strides},{type:6,data:t.dilations}];Rt(t,Z),Z.push(...X(e[0].dims,e[1].dims));let ue=["rank","rank"];s&&(Z.push(...X(e[2].dims)),ue.push("rank")),Z.push(...X(r));let ee=j=>{let L=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"},{name:"pad",type:"i32",length:2},{name:"stride",type:"i32",length:2},{name:"dilation",type:"i32",length:2}];Mt(t,L);let de=b?4:1,te=ke(e[0].dataType),ae=`
      fn setOutputAtIndex(flatIndex : i32, value : ${b?`vec4<${te}>`:te}) {
        result[flatIndex] = ${b?`vec4<${te}>`:te}(value);
      }
      fn setOutputAtCoords(d0 : i32, d1 : i32, d2 : i32, d3 : i32, value : ${b?`vec4<${te}>`:te}) {
        let flatIndex = getOutputIndexFromCoords(vec4<i32>(d0, d1, d2, d3));
        setOutputAtIndex(flatIndex ${b?"/ 4":""}, value);
      }`,M=R("x",e[0].dataType,e[0].dims.length,I===3?1:I),P=R("w",e[1].dataType,e[1].dims.length,de),G=[M,P],oe=H("result",e[0].dataType,r.length,de);if(s){let Ie=R("bias",e[2].dataType,e[2].dims.length,de);G.push(Ie),ae+=`
        fn getBiasByOutputCoords(coords : vec4<i32>) -> ${b?`vec4<${te}>`:te} {
          return bias[coords.${l?"w":"y"}${b?"/ 4":""}];
        }`}return`
        ${Tc("uniforms.result_strides")}
        //struct Uniforms { xShape : vec4<i32>, wShape : vec4<i32>, outShape : vec4<i32>,
        //  outShapeStrides: vec3<i32>, filterDims : vec2<i32>, pad : vec2<i32>, stride : vec2<i32>,
        //  dilation : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32 };
        ${j.registerUniforms(L).declareVariables(...G,oe)}
        ${ae}
        ${hu(l,O,q,K,s,t,W[0],W[1],W[2],te)}
        ${b?Na(k,w,te,void 0,!l,A):Pa(k,w,te,void 0,!l,A,!1,void 0,u)}`};return{name:"Conv2DMatMul",shaderCache:{hint:`${t.cacheKey};${I};${b};${O};${q};${K};${E};${z};${A}`,inputDependencies:ue},getRunData:()=>({outputs:[{dims:d?d(r):r,dataType:e[0].dataType}],dispatchGroup:{x:S[0],y:S[1],z:S[2]},programUniforms:Z}),getShaderSource:ee}}}),mu,Ki,nr,gu,Zi,_u,zc,Cc,mg=U(()=>{J(),ct(),re(),ie(),Pt(),hn(),mu=e=>{let t=1;for(let r=0;r<e.length;r++)t*=e[r];return t},Ki=e=>typeof e=="number"?[e,e,e]:e,nr=(e,t)=>t<=1?e:e+(e-1)*(t-1),gu=(e,t,r,a=1)=>{let n=nr(t,a);return Math.floor((e[0]*(r-1)-r+n)/2)},Zi=(e,t,r,a,n)=>{n==null&&(n=gu(e,t[0],a[0]));let i=[0,0,0,r];for(let s=0;s<3;s++)e[s]+2*n>=t[s]&&(i[s]=Math.trunc((e[s]-t[s]+2*n)/a[s]+1));return i},_u=(e,t,r,a,n,i,s,u,d,l)=>{let c,f,h,g;if(e==="VALID"&&(e=0),typeof e=="number"){c={top:e,bottom:e,left:e,right:e,front:e,back:e};let _=Zi([t,r,a,1],[u,d,l],1,[n,i,s],e);f=_[0],h=_[1],g=_[2]}else if(Array.isArray(e)){if(!e.every((b,x,$)=>b===$[0]))throw Error(`Unsupported padding parameter: ${e}`);c={top:e[0],bottom:e[1],left:e[2],right:e[3],front:e[4],back:e[5]};let _=Zi([t,r,a,1],[u,d,l],1,[n,i,s],e[0]);f=_[0],h=_[1],g=_[2]}else if(e==="SAME_UPPER"){f=Math.ceil(t/n),h=Math.ceil(r/i),g=Math.ceil(a/s);let _=(f-1)*n+u-t,b=(h-1)*i+d-r,x=(g-1)*s+l-a,$=Math.floor(_/2),w=_-$,k=Math.floor(b/2),S=b-k,I=Math.floor(x/2),E=x-I;c={top:k,bottom:S,left:I,right:E,front:$,back:w}}else throw Error(`Unknown padding parameter: ${e}`);return{padInfo:c,outDepth:f,outHeight:h,outWidth:g}},zc=(e,t,r,a,n,i=!1,s="channelsLast")=>{let u,d,l,c,f;if(s==="channelsLast")[u,d,l,c,f]=e;else if(s==="channelsFirst")[u,f,d,l,c]=e;else throw new Error(`Unknown dataFormat ${s}`);let[h,,g,_,b]=t,[x,$,w]=Ki(r),[k,S,I]=Ki(a),E=nr(g,k),z=nr(_,S),A=nr(b,I),{padInfo:O,outDepth:q,outHeight:K,outWidth:W}=_u(n,d,l,c,x,$,w,E,z,A),Z=i?h*f:h,ue=[0,0,0,0,0];return s==="channelsFirst"?ue=[u,Z,q,K,W]:s==="channelsLast"&&(ue=[u,q,K,W,Z]),{batchSize:u,dataFormat:s,inDepth:d,inHeight:l,inWidth:c,inChannels:f,outDepth:q,outHeight:K,outWidth:W,outChannels:Z,padInfo:O,strideDepth:x,strideHeight:$,strideWidth:w,filterDepth:g,filterHeight:_,filterWidth:b,effectiveFilterDepth:E,effectiveFilterHeight:z,effectiveFilterWidth:A,dilationDepth:k,dilationHeight:S,dilationWidth:I,inShape:e,outShape:ue,filterShape:t}},Cc=(e,t,r,a,n,i)=>{let s=i==="channelsLast";s?e[0].dims[3]:e[0].dims[1];let u=[64,1,1],d={x:r.map((x,$)=>$)},l=[Math.ceil(mu(d.x.map(x=>r[x]))/u[0]),1,1];le("verbose",()=>`[conv3d_naive_webgpu] dispatch = ${l}`);let c=1,f=C.size(r),h=[{type:12,data:f},{type:12,data:a},{type:12,data:n},{type:12,data:t.strides},{type:12,data:t.dilations}];Rt(t,h),h.push(...X(e[0].dims,e[1].dims));let g=["rank","rank"],_=e.length===3;_&&(h.push(...X(e[2].dims)),g.push("rank")),h.push(...X(r));let b=x=>{let $=[{name:"output_size",type:"u32"},{name:"filter_dims",type:"u32",length:a.length},{name:"pads",type:"u32",length:n.length},{name:"strides",type:"u32",length:t.strides.length},{name:"dilations",type:"u32",length:t.dilations.length}];Mt(t,$);let w=1,k=ke(e[0].dataType),S=R("x",e[0].dataType,e[0].dims.length,c),I=R("W",e[1].dataType,e[1].dims.length,w),E=[S,I],z=H("result",e[0].dataType,r.length,w),A="";if(_){let K=R("bias",e[2].dataType,e[2].dims.length,w);E.push(K),A+=`
        fn getBiasByOutputCoords(coords : array<u32, 5>) -> ${k} {
          return bias[${s?F("coords",4,5):F("coords",1,5)}];
        }`}let O=Te(c,k),q=Bt(t,O,k);return`
            ${A}
            fn getX(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${S.getByIndices("aIndices")};
            }
            fn getW(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${I.getByIndices("aIndices")};
            }
          ${x.registerUniforms($).declareVariables(...E,z)}
          ${x.mainStart()}
          ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
              let coords = ${z.offsetToIndices("global_idx")};
              let batch = ${F("coords",0,S.rank)};
              let d2 = ${s?F("coords",S.rank-1,S.rank):F("coords",1,S.rank)};
              let xFRCCorner = vec3<u32>(${s?F("coords",1,S.rank):F("coords",2,S.rank)},
              ${s?F("coords",2,S.rank):F("coords",3,S.rank)},
              ${s?F("coords",3,S.rank):F("coords",4,S.rank)}) * uniforms.strides - uniforms.pads;
              let xFCorner = xFRCCorner.x;
              let xRCorner = xFRCCorner.y;
              let xCCorner = xFRCCorner.z;
              let xShapeY = ${s?F("uniforms.x_shape",1,S.rank):F("uniforms.x_shape",2,S.rank)};
              let xShapeZ = ${s?F("uniforms.x_shape",2,S.rank):F("uniforms.x_shape",3,S.rank)};
              let xShapeW = ${s?F("uniforms.x_shape",3,S.rank):F("uniforms.x_shape",4,S.rank)};
              let xShapeU = ${s?F("uniforms.x_shape",4,S.rank):F("uniforms.x_shape",1,S.rank)};
              let inputDepthNearestVec4 = (xShapeU / 4) * 4;
              let inputDepthVec4Remainder = xShapeU % 4;

              var value = 0.0;
              for (var wF = 0u; wF < uniforms.filter_dims[0]; wF++) {
                let xF = xFCorner + wF * uniforms.dilations[0];
                if (xF < 0 || xF >= xShapeY) {
                  continue;
                }

                for (var wR = 0u; wR < uniforms.filter_dims[1]; wR++) {
                  let xR = xRCorner + wR * uniforms.dilations[1];
                  if (xR < 0 || xR >= xShapeZ) {
                    continue;
                  }

                  for (var wC = 0u; wC < uniforms.filter_dims[2]; wC++) {
                    let xC = xCCorner + wC * uniforms.dilations[2];
                    if (xC < 0 || xC >= xShapeW) {
                      continue;
                    }

                    for (var d1 = 0u; d1 < inputDepthNearestVec4; d1 += 4) {
                      ${s?`let xValues = vec4<f32>(
                               getX(batch, xF, xR, xC, d1),
                               getX(batch, xF, xR, xC, d1 + 1),
                               getX(batch, xF, xR, xC, d1 + 2),
                               getX(batch, xF, xR, xC, d1 + 3));
                            `:`let xValues = vec4<f32>(
                               getX(batch, d1, xF, xR, xC),
                               getX(batch, d1 + 1, xF, xR, xC),
                               getX(batch, d1 + 2, xF, xR, xC),
                               getX(batch, d1 + 3, xF, xR, xC));
                            `}
                            let wValues = vec4<f32>(
                              getW(d2, d1, wF, wR, wC),
                              getW(d2, d1 + 1, wF, wR, wC),
                              getW(d2, d1 + 2, wF, wR, wC),
                              getW(d2, d1 + 3, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                    if (inputDepthVec4Remainder == 1) {
                        ${s?`value += getX(batch, xF, xR, xC, inputDepthNearestVec4)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`:`value += getX(batch, inputDepthNearestVec4, xF, xR, xC)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`}
                    } else if (inputDepthVec4Remainder == 2) {
                      ${s?`let xValues = vec2<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1));
                      `:`let xValues = vec2<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC));
                    `}
                    let wValues = vec2<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC));
                      value += dot(xValues, wValues);
                    } else if (inputDepthVec4Remainder == 3) {
                      ${s?`let xValues = vec3<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 2));
                      `:`let xValues = vec3<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 2, xF, xR, xC));
                    `}
                    let wValues = vec3<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 2, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                  }
                }
              }
              ${_?"value = value + getBiasByOutputCoords(coords)":""};
              ${q}
              result[global_idx] = f32(value);
          }`};return{name:"Conv3DNaive",shaderCache:{hint:`${t.cacheKey};${s};${c};${_}`,inputDependencies:g},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:l[0],y:l[1],z:l[2]},programUniforms:h}),getShaderSource:b}}}),Ac,Oc,gg=U(()=>{J(),re(),ie(),Pt(),Ac=(e,t,r,a)=>{let n=e.length>2,i=n?"value += b[output_channel];":"",s=e[0].dims,u=e[1].dims,d=t.format==="NHWC",l=d?r[3]:r[1],c=l/t.group,f=d&&c>=4?$e(l):1,h=C.size(r)/f,g=[{type:12,data:h},{type:12,data:t.dilations},{type:12,data:[t.strides[0],t.strides[1]]},{type:12,data:[t.pads[0],t.pads[1]]},{type:12,data:c}];Rt(t,g),g.push(...X(s,[u[0],u[1],u[2],u[3]/f]));let _=n?["rank","rank","rank"]:["rank","rank"];g.push(...X([r[0],r[1],r[2],r[3]/f]));let b=x=>{let $=H("output",e[0].dataType,r.length,f),w=ke($.type.tensor),k=Bt(t,$.type.value,w),S=R("x",e[0].dataType,s.length),I=R("w",e[1].dataType,u.length,f),E=[S,I];n&&E.push(R("b",e[2].dataType,e[2].dims,f));let z=[{name:"output_size",type:"u32"},{name:"dilations",type:"u32",length:t.dilations.length},{name:"strides",type:"u32",length:2},{name:"pads",type:"u32",length:2},{name:"output_channels_per_group",type:"u32"}];Mt(t,z);let A=d?`
      for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[0]; wHeight++) {
        let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

        if (xHeight < 0u || xHeight >= uniforms.x_shape[1]) {
          continue;
        }

        for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[1]; wWidth++) {
          let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
          if (xWidth < 0u || xWidth >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[2]; wInChannel++) {
            let input_channel = in_channel_offset + wInChannel;
            let xVal = ${S.get("batch","xHeight","xWidth","input_channel")};
            let wVal = ${I.get("wHeight","wWidth","wInChannel","output_channel")};
            value += xVal * wVal;
          }
        }
      }
      `:`
      for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[1]; wInChannel++) {
        let input_channel = in_channel_offset + wInChannel;
        for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[2]; wHeight++) {
          let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

          if (xHeight < 0u || xHeight >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[3]; wWidth++) {
            let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
            if (xWidth < 0u || xWidth >= uniforms.x_shape[3]) {
              continue;
            }

            let xVal = ${S.get("batch","input_channel","xHeight","xWidth")};
            let wVal = ${I.get("output_channel","wInChannel","wHeight","wWidth")};
            value += xVal * wVal;
          }
        }
      }
      `;return`
  ${x.registerUniforms(z).declareVariables(...E,$)}

  ${x.mainStart()}
    ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let outputIndices = ${$.offsetToIndices("global_idx")};
    let batch: u32 = outputIndices[0];
    let output_channel: u32 = outputIndices[${d?3:1}];
    let xRCCorner: vec2<u32> = vec2<u32>(outputIndices[${d?1:2}], outputIndices[${d?2:3}]) * uniforms.strides - uniforms.pads;
    let group_id: u32 = output_channel * ${f} / uniforms.output_channels_per_group;
    var in_channel_offset = group_id * uniforms.w_shape[${d?2:1}];

    var value: ${$.type.value} = ${$.type.value}(0);
    ${A}
    ${i}
    ${k}
    ${$.setByOffset("global_idx","value")}
  }`};return{name:"GroupedConv",shaderCache:{hint:`${t.cacheKey}_${f}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:a?a(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:g}),getShaderSource:b}},Oc=(e,t,r,a)=>{let n=e.length>2,i=$e(r[3]),s=$e(r[2]),u=C.size(r)/i/s,d=[e[0].dims[0],e[0].dims[1],e[0].dims[2],e[0].dims[3]/i],l=[e[1].dims[0],e[1].dims[1],e[1].dims[2],e[1].dims[3]/i],c=[r[0],r[1],r[2],r[3]/i],f=[{type:12,data:u},{type:6,data:[t.strides[0],t.strides[1]]},{type:6,data:[t.pads[0],t.pads[1]]}];Rt(t,f),f.push(...X(d,l,c));let h=(s-1)*t.strides[1]+l[1],g=_=>{let b=H("output",e[0].dataType,c.length,i),x=ke(b.type.tensor),$=Bt(t,b.type.value,x),w=R("x",e[0].dataType,d.length,i),k=R("w",e[1].dataType,l.length,i),S=[w,k];n&&S.push(R("b",e[2].dataType,e[2].dims,i));let I=n?"value += b[output_channel];":"",E=[{name:"output_size",type:"u32"},{name:"strides",type:"i32",length:2},{name:"pads",type:"i32",length:2}];return Mt(t,E),`
  ${_.registerUniforms(E).declareVariables(...S,b)}
  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let width0 = uniforms.output_shape[3];
    let output_channel = global_idx % width0;
    var index1 = global_idx / width0;
    let width1 = uniforms.output_shape[2] / ${s}u;
    let col = (index1 % width1) * ${s}u;
    index1 = index1 / width1;
    let row = index1 % uniforms.output_shape[1];
    let batch = index1 / uniforms.output_shape[1];

    let x_corner = vec2<i32>(i32(row), i32(col)) * uniforms.strides - uniforms.pads;

    var x_vals: array<${w.type.value}, ${h}>;
    var values: array<${b.type.value}, ${s}>;
    let input_channel = output_channel;
    // Use constant instead of uniform can give better performance for w's height/width.
    for (var w_height: u32 = 0u; w_height < ${l[0]}; w_height++) {
      let x_height = x_corner.x + i32(w_height);
      if (x_height >= 0 && u32(x_height) < uniforms.x_shape[1]) {
        for (var i = 0; i < ${h}; i++) {
          let x_width = x_corner.y + i;
          if (x_width >= 0 && u32(x_width) < uniforms.x_shape[2]) {
            x_vals[i] = ${w.get("batch","u32(x_height)","u32(x_width)","input_channel")};
          } else {
            x_vals[i] = ${w.type.value}(0);
          }
        }
        for (var w_width: u32 = 0u; w_width < ${l[1]}; w_width++) {
          let w_val = ${k.get("w_height","w_width","0","output_channel")};
          for (var i = 0u; i < ${s}u; i++) {
            values[i] = fma(x_vals[i * u32(uniforms.strides[1]) + w_width], w_val, values[i]);
          }
        }
      }
    }

    for (var i = 0u; i < ${s}u; i++) {
      var value = values[i];
      ${I}
      ${$}
      ${b.set("batch","row","col + i","output_channel","value")};
    }
  }`};return{name:"GroupedConv-Vectorize",shaderCache:{hint:`${t.cacheKey};${i};${s};${h};${l[0]};${l[1]}`,inputDependencies:n?["rank","rank","type"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:a?a(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:f}),getShaderSource:g}}}),yu,Pr,bu,Ur,Ua,Qi,wu,$u,qa,_g=U(()=>{re(),hg(),mg(),_n(),gg(),Pt(),gn(),xt(),yu=(e,t,r,a,n,i)=>{let s=e[0],u=e.slice(i?1:2,i?3:4),d=u.length,l=t[0],c=t.slice(2).map((h,g)=>h+(h-1)*(r[g]-1)),f=u.map((h,g)=>h+a[g]+a[g+d]).map((h,g)=>Math.floor((h-c[g]+n[g])/n[g]));return f.splice(0,0,s),f.splice(i?3:1,0,l),f},Pr=[2,3,1,0],bu=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length>5)throw new Error("greater than 5D is not supported");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],a=e[1].dims[1]*t.group;if(r!==a)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");if(e.length===3&&(e[2].dims.length!==1||e[1].dims[0]!==e[2].dims[0]))throw new Error("invalid bias");let n=e[0].dims.length-2;if(t.dilations.length!==n)throw new Error(`dilations should be ${n}D`);if(t.strides.length!==n)throw new Error(`strides should be ${n}D`);if(t.pads.length!==n*2)throw new Error(`pads should be ${n*2}D`);if(t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape")},Ur=(e,t)=>{let r=e.kernelShape.slice();r.length<t[1].dims.length-2&&r.push(...Array(t[1].dims.length-2-r.length).fill(0));for(let i=2;i<t[1].dims.length;++i)r[i-2]===0&&(r[i-2]=t[1].dims[i]);let a=e.pads.slice();Zr.adjustPadsBasedOnAutoPad(t[0].dims,e.strides,e.dilations,r,a,e.format==="NHWC",e.autoPad);let n=Object.assign({},e);return Object.assign(n,{kernelShape:r,pads:a}),n},Ua=e=>{let t=fn(e),r=e.format,a=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],n=e.dilations,i=e.group,s=e.kernel_shape,u=e.pads,d=e.strides,l=e.w_is_const();return{autoPad:a,format:r,dilations:n,group:i,kernelShape:s,pads:u,strides:d,wIsConst:l,...t,cacheKey:`${e.format};${t.activation};`}},Qi=(e,t,r,a)=>{let n=r.format==="NHWC",i=yu(t[0].dims,t[1].dims,r.dilations,r.pads,r.strides,n);if(r.group!==1){let E=[t[0]];if(n){let z=e.kernelCustomData.wT??e.compute(Ue(t[1],Pr),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=z),E.push(z)}else E.push(t[1]);t.length===3&&E.push(t[2]),!e.adapterInfo.isArchitecture("ampere")&&n&&t[1].dims[0]===r.group&&t[1].dims[1]===1&&r.dilations[0]===1&&r.dilations[1]===1?e.compute(Oc(E,r,i,a),{inputs:E}):e.compute(Ac(E,r,i,a),{inputs:E});return}let s=t.length===3,u=t[0].dims[n?1:2],d=t[0].dims[n?2:3],l=t[0].dims[n?3:1],c=t[1].dims[2],f=t[1].dims[3],h=i[n?1:2],g=i[n?2:3],_=i[n?3:1],b=n&&c===u&&f===d&&r.pads[0]===0&&r.pads[1]===0;if(b||c===1&&f===1&&r.dilations[0]===1&&r.dilations[1]===1&&r.strides[0]===1&&r.strides[1]===1&&r.pads[0]===0&&r.pads[1]===0){let E=i[0],z,A,O,q=[];if(n){let Z=e.kernelCustomData.wT??e.compute(Ue(t[1],Pr),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];if(r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=Z),b){let ue=u*d*l;z=t[0].reshape([1,E,ue]),A=Z.reshape([1,ue,_]),O=[1,E,_]}else z=t[0].reshape([E,u*d,l]),A=Z.reshape([1,l,_]),O=[E,h*g,_];q.push(z),q.push(A)}else z=t[0].reshape([E,l,u*d]),A=t[1].reshape([1,_,l]),O=[E,_,h*g],q.push(A),q.push(z);s&&q.push(t[2]);let K=O[2],W=q[0].dims[q[0].dims.length-1];K<8&&W<8?e.compute(mn(q,r,i,O,n,a),{inputs:q}):e.compute(Xr(q,r,i,O,n,a),{inputs:q});return}let x=!0,$=e.kernelCustomData.wT??e.compute(Ue(t[1],Pr),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=$);let w=[t[0],$];s&&w.push(t[2]);let k=n?h*g:_,S=n?_:h*g,I=c*f*l;e.compute(Ec(w,r,i,k,S,I,s,x,a),{inputs:w})},wu=(e,t)=>{let r=t.format==="NHWC",a=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&a.push(e.inputs[2]);let n=[0,t.pads[0],0,t.pads[1]],i=[1].concat(t.strides),s=[1].concat(t.dilations),u=[1].concat(t.kernelShape),d=Ur({...t,pads:n,strides:i,dilations:s,kernelShape:u},a);Qi(e,a,d,l=>r?[l[0],l[2],l[3]]:[l[0],l[1],l[3]])},$u=(e,t,r)=>{let a=r.format==="NHWC"?"channelsLast":"channelsFirst",n=Ur(r,t),i=r.autoPad==="NOTSET"?r.pads:r.autoPad,s=zc(t[0].dims,t[1].dims,r.strides,r.dilations,i,!1,a);e.compute(Cc(t,n,s.outShape,[s.filterDepth,s.filterHeight,s.filterWidth],[s.padInfo.front,s.padInfo.top,s.padInfo.left],a))},qa=(e,t)=>{if(bu(e.inputs,t),e.inputs[0].dims.length===3)wu(e,t);else if(e.inputs[0].dims.length===5)$u(e,e.inputs,t);else{let r=Ur(t,e.inputs);Qi(e,e.inputs,r)}}}),Bc,yg=U(()=>{J(),ct(),re(),ie(),Bc=(e,t,r)=>{let a=e.length>2,n=t.outputShape,i=t.format==="NHWC",s=t.group,u=e[1].dims,d=u[2]/s,l=u[3],c=i?$e(d):1,f=i&&l===1&&d>=4,h=f?Math.floor(d/4)*4:Math.floor(d/c)*c,g=d-h,_=i?$e(l):1,b=i?l===1?c:_:1,x=C.size(n)/_,$=[Math.ceil(x/64),1,1];le("verbose",()=>`[conv2d_backprop_webgpu] dispatch = ${$}`);let w=["rank","rank"],k=[t.strides[0],t.strides[1]],S=[t.kernelShape[i?1:2],t.kernelShape[i?2:3]],I=[t.dilations[0],t.dilations[1]],E=[S[0]+(t.dilations[0]<=1?0:(t.kernelShape[i?1:2]-1)*(t.dilations[0]-1)),S[1]+(t.dilations[1]<=1?0:(t.kernelShape[i?2:3]-1)*(t.dilations[1]-1))],z=[E[0]-1-Math.floor((t.pads[0]+t.pads[2])/2),E[1]-1-Math.floor((t.pads[1]+t.pads[3])/2)],A=[{type:12,data:x},{type:12,data:k},{type:12,data:S},{type:12,data:I},{type:12,data:E},{type:6,data:z},{type:12,data:h},{type:12,data:d},{type:12,data:l},...X(e[0].dims,e[1].dims)];a&&(A.push(...X(e[2].dims)),w.push("rank")),A.push(...X(n));let O=q=>{let K=[{name:"output_size",type:"u32"},{name:"strides",type:"u32",length:k.length},{name:"filter_dims",type:"u32",length:S.length},{name:"dilations",type:"u32",length:S.length},{name:"effective_filter_dims",type:"u32",length:E.length},{name:"pads",type:"i32",length:z.length},{name:"input_channels_per_group_int",type:"u32"},{name:"input_channels_per_group",type:"u32"},{name:"output_channels_per_group",type:"u32"}],W=ke(e[0].dataType),Z=i?1:2,ue=i?2:3,ee=i?3:1,j=R("W",e[1].dataType,e[1].dims.length,b),L=R("Dy",e[0].dataType,e[0].dims.length,c),de=[L,j];a&&de.push(R("bias",e[2].dataType,[n[ee]].length,_));let te=H("result",e[0].dataType,n.length,_),ae=()=>{let G="";if(f)c===4?G+=`
        let xValue = ${L.getByOffset("x_offset")};
        let wValue = ${j.getByOffset("w_offset")};
        dotProd = dotProd + dot(xValue, wValue);
        x_offset += 1u;
        w_offset += 1u;`:c===2?G+=`
          dotProd = dotProd + dot(vec4<${W}>(${L.getByOffset("x_offset")}, ${L.getByOffset("x_offset + 1u")}), vec4<${W}>(${j.getByOffset("w_offset")}, ${j.getByOffset("w_offset + 1u")}));
          x_offset += 2u;
          w_offset += 2u;`:c===1&&(G+=`
          dotProd = dotProd + dot(vec4<${W}>(${L.getByOffset("x_offset")}, ${L.getByOffset("x_offset + 1u")}, ${L.getByOffset("x_offset + 2u")}, ${L.getByOffset("x_offset + 3u")}), vec4<${W}>(${j.getByOffset("w_offset")}, ${j.getByOffset("w_offset + 1u")}, ${j.getByOffset("w_offset + 2u")}, ${j.getByOffset("w_offset + 3u")}));
          x_offset += 4u;
          w_offset += 4u;`);else if(G+=`
                  let xValue = ${i?L.getByOffset(`${L.indicesToOffset(`${L.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${c}`):L.get("batch","inputChannel","idyR","idyC")};
        `,c===1)G+=`
          let w_offset = ${j.indicesToOffset(`${j.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel, wOutChannel)`)};
          let wValue = ${j.getByOffset(`w_offset / ${b}`)};
          dotProd = dotProd + xValue * wValue;`;else for(let oe=0;oe<c;oe++)G+=`
            let wValue${oe} = ${j.getByOffset(`${j.indicesToOffset(`${j.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel + ${oe}, wOutChannel)`)} / ${b}`)};
            dotProd = dotProd + xValue[${oe}] * wValue${oe};`;return G},M=()=>{if(g===0)return"";if(!f)throw new Error(`packInputAs4 ${f} is not true.`);let G="";if(c===1){G+="dotProd = dotProd";for(let oe=0;oe<g;oe++)G+=`
            + ${L.getByOffset(`x_offset + ${oe}`)} * ${j.getByOffset(`w_offset + ${oe}`)}`;G+=";"}else if(c===2){if(g!==2)throw new Error(`Invalid inputChannelsRemainder ${g}.`);G+=`
          let xValue = ${L.getByOffset("x_offset")};
          let wValue = ${j.getByOffset("w_offset")};
          dotProd = dotProd + dot(xValue, wValue);`}return G},P=`
            let outputIndices = ${te.offsetToIndices(`global_idx * ${_}`)};
            let batch = ${te.indicesGet("outputIndices",0)};
            let d1 = ${te.indicesGet("outputIndices",ee)};
            let r = ${te.indicesGet("outputIndices",Z)};
            let c = ${te.indicesGet("outputIndices",ue)};
            let dyCorner = vec2<i32>(i32(r), i32(c)) - uniforms.pads;
            let dyRCorner = dyCorner.x;
            let dyCCorner = dyCorner.y;
            let groupId = d1 / uniforms.output_channels_per_group;
            let wOutChannel = d1 - groupId * uniforms.output_channels_per_group;
            // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
            // ? = to be determined. : = across all values in that axis.
            var dotProd = ${te.type.value}(0.0);
            var wR: u32 = 0;
            if (uniforms.dilations.x == 1) {
              // Minimum wR >= 0 that satisfies (dyRCorner + wR) % (uniforms.strides.x) == 0
              wR = u32(((dyRCorner + i32(uniforms.strides.x) - 1) / i32(uniforms.strides.x)) * i32(uniforms.strides.x) - dyRCorner);
            }
            for (; wR < uniforms.effective_filter_dims.x; wR = wR + 1) {
              if (wR % uniforms.dilations.x != 0) {
                continue;
              }
              let dyR = (${W}(dyRCorner) + ${W}(wR)) / ${W}(uniforms.strides[0]);
              let wRPerm = uniforms.filter_dims.x - 1 - wR / uniforms.dilations.x;
              if (dyR < 0.0 || dyR >= ${W}(uniforms.Dy_shape[${Z}]) || fract(dyR) > 0.0 ||
                  wRPerm < 0) {
                continue;
              }
              let idyR: u32 = u32(dyR);
              var wC: u32 = 0;
              if (uniforms.dilations.y == 1) {
                // Minimum wC >= 0 that satisfies (dyCCorner + wC) % (uniforms.strides.y) == 0
                wC = u32(((dyCCorner + i32(uniforms.strides.y) - 1) / i32(uniforms.strides.y)) * i32(uniforms.strides.y) - dyCCorner);
              }
              for (; wC < uniforms.effective_filter_dims.y; wC = wC + 1) {
                if (wC % uniforms.dilations.y != 0) {
                  continue;
                }
                let dyC = (${W}(dyCCorner) + ${W}(wC)) / ${W}(uniforms.strides.y);
                let wCPerm = uniforms.filter_dims.y - 1 - wC / uniforms.dilations.y;
                if (dyC < 0.0 || dyC >= ${W}(uniforms.Dy_shape[${ue}]) ||
                    fract(dyC) > 0.0 || wCPerm < 0) {
                  continue;
                }
                let idyC: u32 = u32(dyC);
                var inputChannel = groupId * uniforms.input_channels_per_group;
                ${f?`
                var x_offset = ${L.indicesToOffset(`${L.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${c};
                var w_offset = ${j.indicesToOffset(`${j.type.indices}(wRPerm, wCPerm, inputChannel, wOutChannel)`)} / ${b};
                  `:""}
                for (var d2: u32 = 0; d2 < uniforms.input_channels_per_group_int; d2 = d2 + ${f?4:c}) {
                  ${ae()}
                  inputChannel = inputChannel + ${f?4:c};
                }
                ${M()}
                wC = wC + uniforms.strides.y - 1;
              }
              wR = wR + uniforms.strides[0] - 1;
            }
            let value = dotProd${a?` + bias[d1 / ${_}]`:""};
            ${te.setByOffset("global_idx","value")};
          `;return`
    ${q.registerUniforms(K).declareVariables(...de,te)}
      ${q.mainStart()}
      ${q.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")};
    ${P}}`};return{name:"ConvTranspose2D",shaderCache:{hint:`${t.cacheKey};${c}${b}${_}${f}${g}`,inputDependencies:w},getRunData:()=>({dispatchGroup:{x:$[0],y:$[1],z:$[2]},outputs:[{dims:r?r(n):n,dataType:e[0].dataType}],programUniforms:A}),getShaderSource:O}}}),vu,xu,Su,Xi,Rc,ku,Yi,Iu,Mc,bg=U(()=>{yg(),Pt(),xt(),vu=(e,t,r,a,n,i)=>(e-1)*t+r+(a-1)*n+1-i,xu=(e,t,r,a,n)=>{let i=Math.floor(e/2);t==="SAME_UPPER"?(r[a]=i,r[n]=e-i):t==="SAME_LOWER"&&(r[a]=e-i,r[n]=i)},Su=(e,t,r,a,n,i,s,u,d,l)=>{let c=e.length-2,f=l.length===0;d.length<c&&d.push(...Array(c-d.length).fill(0));let h=e[0],g=t[u?3:1]*n;for(let _=0,b=e.length-c-(u?1:0);_<c;++_,++b){let x=e[b],$=f?x*s[_]:l[_],w=vu(x,s[_],i[_],t[b],r[_],$);xu(w,a,i,_,_+c),f&&l.push(s[_]*(x-1)+d[_]+(t[b]-1)*r[_]+1-i[_]-i[_+c])}l.splice(0,0,h),l.splice(u?3:1,0,g)},Xi=(e,t)=>{let r=e.kernelShape.slice();if(e.kernelShape.length===0||e.kernelShape.reduce((f,h)=>f*h,1)===0){r.length=0;for(let f=2;f<t[1].dims.length;++f)r.push(t[1].dims[f])}let a=e.format==="NHWC";r.splice(0,0,t[1].dims[0]),r.splice(a?3:1,0,t[1].dims[1]);let n=e.pads.slice(),i=e.outputShape.slice(),s=e.outputPadding.slice(),u=t[0].dims,d=e.dilations.slice();if(d.reduce((f,h)=>f+h,0)===0){let f=t[0].dims.length-2;d=new Array(f).fill(1)}let l=e.strides.slice();if(l.reduce((f,h)=>f+h,0)===0){let f=t[0].dims.length-2;l=new Array(f).fill(1)}Su(u,r,d,e.autoPad,e.group,n,l,a,s,i);let c=Object.assign({},e);return Object.assign(c,{kernelShape:r,pads:n,outputPadding:s,outputShape:i,dilations:d,strides:l}),c},Rc=e=>{let t=fn(e),r=e.format,a=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][typeof e.autoPad>"u"?0:e.autoPad],n=e.dilations,i=e.group,s=e.kernelShape,u=e.pads,d=e.strides,l=e.wIsConst(),c=e.outputPadding,f=e.outputShape;return{autoPad:a,format:r,dilations:n,group:i,kernelShape:s,outputPadding:c,outputShape:f,pads:u,strides:d,wIsConst:l,...t,cacheKey:`${e.format};${t.activation};`}},ku=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length!==4&&e[0].dims.length!==3)throw new Error("currently only support 2-dimensional conv");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],a=e[1].dims[0];if(r!==a)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");let n=e[1].dims[1]*t.group;if(e.length===3&&(e[2].dims.length!==1||e[2].dims[0]!==n))throw new Error("invalid bias");let i=e[0].dims.length-2;if(t.dilations.reduce((s,u)=>s+u,0)>0&&t.dilations.length!==i)throw new Error(`dilations should be ${i}D`);if(t.strides.reduce((s,u)=>s+u,0)>0&&t.strides.length!==i)throw new Error(`strides should be ${i}D`);if(t.pads.reduce((s,u)=>s+u,0)>0&&t.pads.length!==i*2)throw new Error(`pads should be ${i*2}D`);if(t.outputPadding.length!==i&&t.outputPadding.length!==0)throw new Error(`output_padding should be ${i}D`);if(t.kernelShape.reduce((s,u)=>s+u,0)>0&&t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape");if(t.outputShape.length!==0&&t.outputShape.length!==e[0].dims.length-2)throw new Error("invalid output shape")},Yi=(e,t,r,a)=>{let n=e.kernelCustomData.wT??e.compute(Ue(t[1],[2,3,0,1]),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=n);let i=[t[0],n];t.length===3&&i.push(t[2]),e.compute(Bc(i,r,a),{inputs:i})},Iu=(e,t)=>{let r=t.format==="NHWC",a=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&a.push(e.inputs[2]);let n=t.kernelShape;(n.length===0||n[0]===0)&&(n=[e.inputs[1].dims[2]]);let i=t.dilations;(i.length===0||i[0]===0)&&(i=[1]);let s=t.strides;(s.length===0||s[0]===0)&&(s=[1]);let u=t.pads;u.length===0&&(u=[0,0]),u=[0,u[0],0,u[1]],s=[1].concat(s),i=[1].concat(i),n=[1].concat(n);let d=t.outputPadding;d=[0].concat(d);let l=Xi({...t,pads:u,strides:s,dilations:i,kernelShape:n,outputPadding:d},a);Yi(e,a,l,c=>r?[c[0],c[2],c[3]]:[c[0],c[1],c[3]])},Mc=(e,t)=>{if(ku(e.inputs,t),e.inputs[0].dims.length===3)Iu(e,t);else{let r=Xi(t,e.inputs);Yi(e,e.inputs,r)}}}),Tu,Dc,Nc,wg=U(()=>{J(),re(),ve(),ie(),Tu=(e,t,r,a)=>{let n=C.size(t),i=t.length,s=R("input",e,i),u=H("output",e,i),d=r.dataType===6?r.getInt32Array()[0]:Number(r.getBigInt64Array()[0]),l=C.normalizeAxis(d,i),c=f=>{let h=` i32(${s.indicesGet("inputIndices","uniforms.axis")}) `,g=F("uniforms.input_shape","uniforms.axis",i),_=a.reverse?h+(a.exclusive?" + 1":""):"0",b=a.reverse?g:h+(a.exclusive?"":" + 1");return`
                ${f.registerUniform("outputSize","u32").registerUniform("axis","u32").declareVariables(s,u)}
                ${f.mainStart()}
                  ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
                  var inputIndices = ${u.offsetToIndices("global_idx")};
                  var sum = ${u.type.value}(0);
                  let first : i32 = ${_};
                  let last : i32 = ${b};
                  for (var i : i32 = first; i < last; i++) {
                    ${s.indicesSet("inputIndices","uniforms.axis","u32(i)")};
                    sum = sum + ${s.getByIndices("inputIndices")};
                  }
                  ${u.setByOffset("global_idx","sum")};
                }`};return{name:"CumSum",shaderCache:{hint:a.cacheKey,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:t,dataType:e}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:[{type:12,data:n},{type:12,data:l},...X(t,t)]}),getShaderSource:c}},Dc=(e,t)=>{let r=e.inputs[0].dims,a=e.inputs[0].dataType,n=e.inputs[1];e.compute(Tu(a,r,n,t),{inputs:[0]})},Nc=e=>{let t=e.exclusive===1,r=e.reverse===1;return fe({exclusive:t,reverse:r})}}),Eu,zu,Cu,Pc,Uc,$g=U(()=>{J(),re(),ve(),ie(),Eu=e=>{if(!e||e.length!==1)throw new Error("DepthToSpace requires 1 input.");if(e[0].dims.length!==4)throw new Error("DepthToSpace requires 4D input.")},zu=(e,t,r,a)=>{let n=[];n.push(`fn perm(i: ${a.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`);for(let i=0;i<t;++i)n.push(r.indicesSet("a",e[i],`i[${i}]`));return n.push("return a;}"),n.join(`
`)},Cu=(e,t)=>{let r,a,n,i,s,u,d=t.format==="NHWC",l=t.blocksize,c=t.mode==="DCR";d?([r,a,n,i]=e.dims,s=c?[r,a,n,l,l,i/l**2]:[r,a,n,i/l**2,l,l],u=c?[0,1,3,2,4,5]:[0,1,4,2,5,3]):([r,a,n,i]=[e.dims[0],e.dims[2],e.dims[3],e.dims[1]],s=c?[r,l,l,i/l**2,a,n]:[r,i/l**2,l,l,a,n],u=c?[0,3,4,1,5,2]:[0,1,4,2,5,3]);let f=e.reshape(s),h=f.dims.length,g=e.dataType,_=R("a",g,h),b=H("output",g,h),x=$=>`
  ${$.registerUniform("output_size","u32").declareVariables(_,b)}

  ${zu(u,h,_,b)}

  ${$.mainStart()}
    ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${b.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${b.setByOffset("global_idx",_.getByIndices("aIndices"))}
  }`;return{name:"DepthToSpace",shaderCache:{hint:`${e.dims};${t.blocksize};${t.mode}`,inputDependencies:["rank"]},getRunData:$=>{let w=d?[r,a*l,n*l,i/l**2]:[r,i/l**2,a*l,n*l],k=C.size(w),S=f.dims,I=C.sortBasedOnPerm(S,u);return{outputs:[{dims:w,dataType:$[0].dataType}],dispatchGroup:{x:Math.ceil(k/64)},programUniforms:[{type:12,data:k},...X(S,I)]}},getShaderSource:x}},Pc=(e,t)=>{Eu(e.inputs),e.compute(Cu(e.inputs[0],t))},Uc=e=>fe({blocksize:e.blocksize,mode:e.mode,format:e.format})}),qr,sr,Ji,Au,Ou,Bu,Ru,ea,Mu,qc,Wc,vg=U(()=>{J(),re(),ve(),ie(),qr="[a-zA-Z]|\\.\\.\\.",sr="("+qr+")+",Ji="^"+sr+"$",Au="("+sr+",)*"+sr,Ou="^"+Au+"$",Bu=class{constructor(e=-1){this.symbolToIndices=new Map,this.inputIndex=e}addSymbol(e,t){let r=this.symbolToIndices.get(e);r===void 0?r=[t]:r.push(t),this.symbolToIndices.set(e,r)}},Ru=class{constructor(e,t){var n;this.equation=t,this.hasEllipsis=!1,this.symbolToInfo=new Map,this.lhs=new Array,this.outputDims=[];let[r,a]=t.includes("->")?t.split("->",2):[t,""];if(!r.match(RegExp(Ou)))throw new Error("Invalid LHS term");if(r.split(",").forEach((i,s)=>{let u=e[s].dims.slice();if(!i.match(RegExp(Ji)))throw new Error("Invalid LHS term");let d=this.processTerm(i,!0,u,s);this.lhs.push(d)}),a==="")a+=[...this.symbolToInfo.entries()].filter(([i,s])=>s.count===1||i==="...").map(([i])=>i).join("");else if(!a.match(RegExp(sr)))throw new Error("Invalid RHS");(n=a.match(RegExp(qr,"g")))==null||n.forEach(i=>{if(i==="...")this.outputDims=this.outputDims.concat(this.ellipsisDims);else{let s=this.symbolToInfo.get(i);if(s===void 0)throw new Error("Invalid RHS symbol");this.outputDims.push(s.dimValue)}}),this.rhs=this.processTerm(a,!1,this.outputDims)}addSymbol(e,t,r){let a=this.symbolToInfo.get(e);if(a!==void 0){if(a.dimValue!==t&&a.count!==1)throw new Error("Dimension mismatch");a.count++,a.inputIndices.push(r)}else a={count:1,dimValue:t,inputIndices:[r]};this.symbolToInfo.set(e,a)}processTerm(e,t,r,a=-1){let n=r.length,i=!1,s=[],u=0;if(!e.match(RegExp(Ji))&&!t&&e!=="")throw new Error("Invalid LHS term");let d=e.match(RegExp(qr,"g")),l=new Bu(a);return d==null||d.forEach((c,f)=>{if(c==="..."){if(i)throw new Error("Only one ellipsis is allowed per input term");i=!0;let h=n-d.length+1;if(h<0)throw new Error("Ellipsis out of bounds");if(s=r.slice(u,u+h),this.hasEllipsis){if(this.ellipsisDims.length!==s.length||this.ellipsisDims.toString()!==s.toString())throw new Error("Ellipsis dimensions mismatch")}else if(t)this.hasEllipsis=!0,this.ellipsisDims=s;else throw new Error("Ellipsis must be specified in the LHS");for(let g=0;g<s.length;g++){let _=String.fromCharCode(48+g);l.addSymbol(_,f+g),this.addSymbol(_,r[u++],a)}}else l.addSymbol(c,f+(this.hasEllipsis?this.ellipsisDims.length-1:0)),this.addSymbol(c,r[u++],a)}),l}},ea=e=>e+"_max",Mu=(e,t,r,a)=>{let n=e.map(l=>l.length).map((l,c)=>R(`input${c}`,t,l)),i=C.size(a),s=H("output",t,a.length),u=[...r.symbolToInfo.keys()].filter(l=>!r.rhs.symbolToIndices.has(l)),d=l=>{let c=[],f="var prod = 1.0;",h="var sum = 0.0;",g="sum += prod;",_=[],b=[],x=[],$=[],w=r.symbolToInfo.size===r.rhs.symbolToIndices.size;r.symbolToInfo.forEach((S,I)=>{var E;if(r.rhs.symbolToIndices.has(I)){let z=(E=r.rhs.symbolToIndices.get(I))==null?void 0:E[0];z!==void 0&&r.lhs.forEach((A,O)=>{if(S.inputIndices.includes(O)){let q=A.symbolToIndices.get(I);if(q===void 0)throw new Error("Invalid symbol error");q.forEach(K=>{c.push(`${n[O].indicesSet(`input${O}Indices`,K,s.indicesGet("outputIndices",z))}`)})}})}else r.lhs.forEach((z,A)=>{if(S.inputIndices.includes(A)){let O=z.symbolToIndices.get(I);if(O===void 0)throw new Error("Invalid symbol error");O.forEach(q=>{_.push(`${n[A].indicesSet(`input${A}Indices`,q,`${I}`)}`)}),$.push(`prod *= ${n[A].getByIndices(`input${A}Indices`)};`)}}),b.push(`for(var ${I}: u32 = 0; ${I} < uniforms.${ea(I)}; ${I}++) {`),x.push("}")});let k=w?[...c,`let sum = ${n.map((S,I)=>S.getByIndices(`input${I}Indices`)).join(" * ")};`]:[...c,h,...b,..._,f,...$,g,...x];return`
            ${l.registerUniforms(u.map(S=>({name:`${ea(S)}`,type:"u32"}))).registerUniform("outputSize","u32").declareVariables(...n,s)}

            ${l.mainStart()}
            ${l.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
            var outputIndices = ${s.offsetToIndices("global_idx")};
            ${n.map((S,I)=>`var input${I}Indices: ${n[I].type.indices};`).join(`
`)}
            ${k.join(`
`)};
            ${s.setByOffset("global_idx","sum")};
          }`};return{name:"Einsum",shaderCache:{hint:r.equation,inputDependencies:e.map(()=>"rank")},getRunData:()=>{let l=u.filter(f=>r.symbolToInfo.has(f)).map(f=>{var h;return{type:12,data:((h=r.symbolToInfo.get(f))==null?void 0:h.dimValue)||0}});l.push({type:12,data:i});let c=e.map((f,h)=>[...X(f)]).reduce((f,h)=>f.concat(h),l);return c.push(...X(a)),{outputs:[{dims:a,dataType:t}],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:c}},getShaderSource:d}},qc=(e,t)=>{let r=new Ru(e.inputs,t.equation),a=r.outputDims,n=e.inputs.map((i,s)=>i.dims);e.compute(Mu(n,e.inputs[0].dataType,r,a))},Wc=e=>{let t=e.equation.replace(/\s+/g,"");return fe({equation:t})}}),Du,ta,Nu,Pu,Lc,xg=U(()=>{J(),re(),ie(),Du=e=>{if(!e||e.length!==2)throw new Error("Expand requires 2 input.");let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),a=r.length<t.length?0:r.length-t.length,n=t.length<r.length?0:t.length-r.length;for(;a<r.length&&n<t.length;++a,++n)if(r[a]!==t[n]&&r[a]!==1&&t[n]!==1)throw new Error("Expand requires shape to be broadcastable to input")},ta=(e,t)=>{let r=e.length-t.length,a=[];for(let n=0;n<r;++n)a.push(e[n]);for(let n=0;n<t.length;++n)a.push(t[n]===1?e[n+r]:t[n]);return a},Nu=(e,t)=>e.length>t.length?ta(e,t):ta(t,e),Pu=e=>{let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),a=Nu(t,r),n=e[0].dataType,i=n===9||C.size(t)===1,s=n===9||t.length>0&&t[t.length-1]%4===0?4:1,u=i||a.length>0&&a[a.length-1]%4===0?4:1,d=Math.ceil(C.size(a)/u),l=f=>{let h=R("input",n,t.length,s),g=H("output",n,a.length,u),_;if(n===9){let b=(x,$,w="")=>`
          let outputIndices${$} = ${g.offsetToIndices(`outputOffset + ${$}u`)};
          let offset${$} = ${h.broadcastedIndicesToOffset(`outputIndices${$}`,g)};
          let index${$} = offset${$} / 4u;
          let component${$} = offset${$} % 4u;
          ${x}[${$}] = ${w}(${h.getByOffset(`index${$}`)}[component${$}]);
        `;_=`
        let outputOffset = global_idx * ${u};
        var data = vec4<u32>(0);
        ${b("data",0,"u32")}
        ${b("data",1,"u32")}
        ${b("data",2,"u32")}
        ${b("data",3,"u32")}
        ${g.setByOffset("global_idx","data")}
      }`}else _=`
        let outputIndices = ${g.offsetToIndices(`global_idx * ${u}`)};
        let inputOffset = ${h.broadcastedIndicesToOffset("outputIndices",g)};
        let data = ${g.type.value}(${h.getByOffset(`inputOffset / ${s}`)});
        ${g.setByOffset("global_idx","data")}
      }`;return`
    ${f.registerUniform("vec_size","u32").declareVariables(h,g)}
    ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
    ${_}`},c=[{type:12,data:d},...X(t,a)];return{name:"Expand",shaderCache:{hint:`${a.length};${s}${u}`,inputDependencies:["rank"]},getShaderSource:l,getRunData:()=>({outputs:[{dims:a,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:c})}},Lc=e=>{Du(e.inputs),e.compute(Pu(e.inputs),{inputs:[0]})}}),Uu,Vc,Sg=U(()=>{J(),re(),ie(),cn(),Uu=e=>{let t=e[0].dataType,r=C.size(e[0].dims),a=C.size(e[1].dims),n=a%4===0,i=s=>{let u=R("x",t,[1],4),d=R("bias",t,[1],4),l=H("y",t,[1],4),c=[{name:"output_vec_size",type:"u32"},{name:"bias_size",type:"u32"}],f=g=>`
      let bias${g}_offset: u32 = (global_idx * 4 + ${g}) % uniforms.bias_size;
      let bias${g} = ${d.getByOffset(`bias${g}_offset / 4`)}[bias${g}_offset % 4];`,h=n?`
      let bias = ${d.getByOffset("global_idx % (uniforms.bias_size / 4)")};`:`${f(0)}${f(1)}${f(2)}${f(3)}
      let bias = ${u.type.value}(bias0, bias1, bias2, bias3);`;return`${s.registerUniforms(c).declareVariables(u,d,l)}

    ${Ma(Ae(t))}

    ${s.mainStart(Ht)}
      ${s.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_vec_size")}

      let x = ${u.getByOffset("global_idx")};
      ${h}
      let x_in = x + bias;
      ${l.setByOffset("global_idx",Da("x_in"))}
    }`};return{name:"FastGeluWithBias",shaderCache:{hint:`${n}`,inputDependencies:["type","type"]},getShaderSource:i,getRunData:s=>({outputs:[{dims:s[0].dims,dataType:s[0].dataType}],programUniforms:[{type:12,data:Math.ceil(r/4)},{type:12,data:a}],dispatchGroup:{x:Math.ceil(r/Ht/4)}})}},Vc=e=>{e.inputs.length<2||C.size(e.inputs[1].dims)===0?lc(e):e.compute(Uu(e.inputs))}}),qu,Wu,jc,Gc,kg=U(()=>{J(),re(),ve(),ie(),qu=e=>{if(!e||e.length!==2)throw new Error("Gather requires 2 inputs.")},Wu=(e,t)=>{let r=e[0].dims,a=e[1].dims,n=r.length,i=C.normalizeAxis(t.axis,n),s=r.slice(0);s.splice(i,1,...a);let u=r[i],d=e[0].dataType===9?4:1,l=Math.ceil(C.size(s)/d),c=[{type:12,data:l},{type:6,data:u},{type:12,data:i},...X(e[0].dims,e[1].dims,s)],f=h=>{let g=R("data",e[0].dataType,e[0].dims.length,d),_=R("inputIndices",e[1].dataType,e[1].dims.length),b=H("output",e[0].dataType,s.length,d),x=w=>{let k=a.length,S=`var indicesIndices${w}  = ${_.type.indices}(0);`;for(let I=0;I<k;I++)S+=`${k>1?`indicesIndices${w}[${I}]`:`indicesIndices${w}`} = ${s.length>1?`outputIndices${w}[uniforms.axis + ${I}]`:`outputIndices${w}`};`;S+=`
          var idx${w} = ${_.getByIndices(`indicesIndices${w}`)};
          if (idx${w} < 0) {
            idx${w} = idx${w} + uniforms.axisDimLimit;
          }
          var dataIndices${w} : ${g.type.indices};
        `;for(let I=0,E=0;I<n;I++)I===i?(S+=`${n>1?`dataIndices${w}[${I}]`:`dataIndices${w}`} = u32(idx${w});`,E+=k):(S+=`${n>1?`dataIndices${w}[${I}]`:`dataIndices${w}`} = ${s.length>1?`outputIndices${w}[${E}]`:`outputIndices${w}`};`,E++);return S},$;if(e[0].dataType===9){let w=(k,S,I="")=>`
          let outputIndices${S} = ${b.offsetToIndices(`outputOffset + ${S}u`)};
          ${x(S)};
          let offset${S} = ${g.indicesToOffset(`dataIndices${S}`)};
          let index${S} = offset${S} / 4u;
          let component${S} = offset${S} % 4u;
          ${k}[${S}] = ${I}(${g.getByOffset(`index${S}`)}[component${S}]);
        `;$=`
        let outputOffset = global_idx * ${d};
        var value = vec4<u32>(0);
        ${w("value",0,"u32")}
        ${w("value",1,"u32")}
        ${w("value",2,"u32")}
        ${w("value",3,"u32")}
        ${b.setByOffset("global_idx","value")}
      `}else $=`
      let outputIndices = ${b.offsetToIndices("global_idx")};
      ${x("")};
      let value = ${g.getByIndices("dataIndices")};
      ${b.setByOffset("global_idx","value")};
      `;return`
      ${h.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(g,_,b)}
      ${h.mainStart()}
        ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        ${$}
      }`};return{name:"Gather",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:s,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:c}),getShaderSource:f}},jc=e=>fe({axis:e.axis}),Gc=(e,t)=>{let r=e.inputs;qu(r),e.compute(Wu(e.inputs,t))}}),Lu,Hc,Fc,Ig=U(()=>{J(),re(),ie(),Lu=(e,t,r,a,n,i,s,u,d)=>{let l=[{type:12,data:i},{type:12,data:a},{type:12,data:n},{type:12,data:r},{type:12,data:s},{type:12,data:u},{type:12,data:d}],c=[i];l.push(...X(t.dims,c));let f=h=>{let g=R("indices_data",t.dataType,t.dims.length),_=H("input_slice_offsets_data",12,1,1),b=[g,_],x=[{name:"output_size",type:"u32"},{name:"batch_dims",type:"u32"},{name:"input_dims",type:"u32",length:n.length},{name:"sizes_from_slice_dims_data",type:"u32",length:r.length},{name:"num_slices_per_batch",type:"u32"},{name:"input_batch_stride",type:"u32"},{name:"num_slice_dims",type:"u32"}];return`
  ${h.registerUniforms(x).declareVariables(...b)}
  ${h.mainStart()}
    ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let batch_idx = global_idx / uniforms.num_slices_per_batch;
    let base_offset = batch_idx * uniforms.input_batch_stride;

    let slice_indices_base_offset = global_idx * uniforms.num_slice_dims;
    var relative_slice_offset = 0;
    for (var dim_idx = 0u; dim_idx < uniforms.num_slice_dims; dim_idx ++) {
      var index = i32(indices_data[dim_idx + slice_indices_base_offset].x);
      let input_dim_idx = uniforms.batch_dims + dim_idx;
      if (index < 0) {
        ${n.length===1?"index += i32(uniforms.input_dims);":"index += i32(uniforms.input_dims[input_dim_idx]);"}
      }
      ${r.length===1?"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data);":"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data[dim_idx]);"}
    }

    input_slice_offsets_data[global_idx] =  base_offset + u32(relative_slice_offset);
  }`};return e.compute({name:"computeSliceOffsets",shaderCache:{hint:`${n.length}_${r.length}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:c,dataType:e.inputs[1].dataType}],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:l}),getShaderSource:f},{inputs:[t],outputs:[-1]})[0]},Hc=(e,t)=>{let r=e.inputs,a=r[0].dims,n=r[0].dataType,i=r[1].dims,s=i[i.length-1],u=C.sizeToDimension(i,i.length-1),d=C.sizeFromDimension(a,t.batchDims+s),l=C.sizeToDimension(a,t.batchDims),c=C.sizeFromDimension(a,t.batchDims),f=u/l,h=new Array(s),g=d;for(let S=0;S<s;++S)h[s-1-S]=g,g*=a[t.batchDims+s-1-S];let _=Lu(e,r[1],h,t.batchDims,a,u,f,c,s),b=t.batchDims+s;if(b>a.length)throw new Error("last dimension of indices must not be larger than rank of input tensor");let x=i.slice(0,-1).concat(a.slice(b)),$=C.size(x),w=[{type:12,data:$},{type:12,data:d},...X(r[0].dims,_.dims,x)],k=S=>{let I=R("data",r[0].dataType,r[0].dims.length),E=R("slice_offsets",12,_.dims.length),z=H("output",r[0].dataType,x.length);return`
          ${S.registerUniform("output_size","u32").registerUniform("slice_size","u32").declareVariables(I,E,z)}
            ${S.mainStart()}
            ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let slice_offset = slice_offsets[global_idx / uniforms.slice_size];
          output[global_idx] = data[u32(slice_offset) + global_idx % uniforms.slice_size];
        }`};e.compute({name:"GatherND",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:x,dataType:n}],dispatchGroup:{x:Math.ceil($/64)},programUniforms:w}),getShaderSource:k},{inputs:[r[0],_]})},Fc=e=>({batchDims:e.batch_dims,cacheKey:""})}),Vu,ju,Kc,Zc,Tg=U(()=>{J(),re(),ve(),ie(),Vu=(e,t)=>{if(e.length<3||e.length>4)throw new Error("GatherBlockQuantized requires 3 or 4 inputs.");let r=C.normalizeAxis(t.quantizeAxis,e[0].dims.length),a=t.blockSize,n=e[0],i=e[2],s=e.length===4?e[3]:void 0;if(i.dims.length!==n.dims.length||!n.dims.map((u,d)=>d===r?Math.ceil(u/a)===i.dims[d]:u===i.dims[d]).reduce((u,d)=>u&&d,!0))throw new Error("Scales must have the same rank as the input tensor and the dims should match except on gatherAxis.");if(s){if(s.dataType!==n.dataType)throw new Error("Zero point must have the same data type as the input tensor.");if(s.dims.length!==i.dims.length||!s.dims.map((u,d)=>u===i.dims[d]).reduce((u,d)=>u&&d,!0))throw new Error("Zero point must have the same rank as the input tensor and the dims should match except on quantizeAxis.")}},ju=(e,t)=>{let r=e[0].dims,a=e[1].dims,n=r.length,i=C.normalizeAxis(t.gatherAxis,n),s=C.normalizeAxis(t.quantizeAxis,n),u=r.slice(0);u.splice(i,1,...a);let d=C.size(u),l=e[2].dataType,c=e[0].dataType===22,f=[{type:12,data:d},{type:12,data:s},{type:12,data:i},{type:12,data:t.blockSize},...X(...e.map((g,_)=>g.dims),u)],h=g=>{let _=R("data",e[0].dataType,e[0].dims.length),b=R("inputIndices",e[1].dataType,e[1].dims.length),x=R("scales",e[2].dataType,e[2].dims.length),$=e.length>3?R("zeroPoint",e[3].dataType,e[3].dims.length):void 0,w=H("output",l,u.length),k=[_,b,x];$&&k.push($);let S=[{name:"output_size",type:"u32"},{name:"quantize_axis",type:"u32"},{name:"gather_axis",type:"u32"},{name:"block_size",type:"u32"}];return`
        ${g.registerUniforms(S).declareVariables(...k,w)}
        ${g.mainStart()}
        let output_indices = ${w.offsetToIndices("global_idx")};
        var indices_indices = ${b.type.indices}(0);
        ${a.length>1?`
          for (var i: u32 = 0; i < ${a.length}; i++) {
            let index = ${w.indicesGet("output_indices","uniforms.gather_axis + i")};
            ${b.indicesSet("indices_indices","i","index")};
          }`:`indices_indices = ${w.indicesGet("output_indices","uniforms.gather_axis")};`};
        var data_indices = ${_.type.indices}(0);
        for (var i: u32 = 0; i < uniforms.gather_axis; i++) {
          let index = ${w.indicesGet("output_indices","i")};
          ${_.indicesSet("data_indices","i","index")};
        }
        var index_from_indices = ${b.getByIndices("indices_indices")};
        if (index_from_indices < 0) {
          index_from_indices += ${r[i]};
        }
        ${_.indicesSet("data_indices","uniforms.gather_axis","u32(index_from_indices)")};
        for (var i = uniforms.gather_axis + 1; i < ${u.length}; i++) {
          let index = ${w.indicesGet("output_indices",`i + ${a.length} - 1`)};
          ${_.indicesSet("data_indices","i","index")};
        }
        let data_offset = ${_.indicesToOffset("data_indices")};
        let data_index = data_offset % 8;
        // Convert 4-bit packed data to 8-bit packed data.
        let packed_4bit_quantized_data = ${_.getByOffset("data_offset / 8")};
        let packed_8bit_quantized_data = (packed_4bit_quantized_data >> (4 * (data_index % 2))) & 0x0f0f0f0f;
        let quantized_data_vec = ${c?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_quantized_data));
        let quantized_data = quantized_data_vec[data_index / 2];
        var scale_indices = data_indices;
        let quantize_axis_index = ${x.indicesGet("data_indices","uniforms.quantize_axis")} / uniforms.block_size;
        ${x.indicesSet("scale_indices","uniforms.quantize_axis","quantize_axis_index")};
        var scale = ${x.getByIndices("scale_indices")};
        ${$?`
              let zero_point_indices = scale_indices;
              let zero_point_offset = ${$.indicesToOffset("zero_point_indices")};
              let zero_point_index = zero_point_offset % 8;
              let packed_4bit_zero_points = ${$.getByOffset("zero_point_offset / 8")};
              let packed_8bit_zero_points = (packed_4bit_zero_points >> (4 * (zero_point_index % 2))) & 0x0f0f0f0f;
              let zero_point_vec = ${c?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_zero_points));
              let zero_point = zero_point_vec[zero_point_index / 2];`:"var zero_point = 0"};
        let dequantized_data = ${Ae(l)}(quantized_data - zero_point) * scale;
        ${w.setByOffset("global_idx","dequantized_data")};
    }`};return{name:"GatherBlockQuantized",shaderCache:{hint:`${t.cacheKey};${e.filter((g,_)=>_!==1).map(g=>g.dims.join("_")).join(";")}`,inputDependencies:Array.from({length:e.length},(g,_)=>"rank")},getRunData:()=>({outputs:[{dims:u,dataType:l}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:f}),getShaderSource:h}},Kc=(e,t)=>{let r=e.inputs;Vu(r,t),e.compute(ju(e.inputs,t))},Zc=e=>fe({blockSize:e.blockSize,gatherAxis:e.gatherAxis,quantizeAxis:e.quantizeAxis})}),Gu,Hu,Qc,Xc,Eg=U(()=>{J(),re(),ve(),ie(),Gu=e=>{if(!e||e.length!==2)throw new Error("GatherElements requires 2 inputs.");if(e[0].dims.length<1)throw new Error("GatherElements requires that the data input be rank >= 1.");if(e[0].dims.length!==e[1].dims.length)throw new Error(`GatherElements requires that the data input and
                     indices input tensors be of same rank.`)},Hu=(e,t)=>{let r=e[0].dims,a=e[0].dataType,n=r.length,i=e[1].dims,s=e[1].dataType,u=C.normalizeAxis(t.axis,n),d=r[u],l=i.slice(0),c=C.size(l),f=R("input",a,n),h=R("indicesInput",s,i.length),g=H("output",a,l.length),_=[{type:12,data:c},{type:6,data:d},{type:12,data:u}];return _.push(...X(r,i,l)),{name:"GatherElements",shaderCache:{inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:l,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:_}),getShaderSource:b=>`
      ${b.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(f,h,g)}
      ${b.mainStart()}
      ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

      let outputIndices = ${g.offsetToIndices("global_idx")};

      var idx = ${h.getByOffset("global_idx")};
      if (idx < 0) {
        idx = idx + uniforms.axisDimLimit;
      }
      var inputIndices = ${f.type.indices}(outputIndices);
      ${f.indicesSet("inputIndices","uniforms.axis","u32(idx)")};
      let value = ${f.getByIndices("inputIndices")};

      ${g.setByOffset("global_idx","value")};
  }`}},Qc=e=>fe({axis:e.axis}),Xc=(e,t)=>{let r=e.inputs;Gu(r),e.compute(Hu(e.inputs,t))}}),Fu,Ku,Yc,Jc,zg=U(()=>{J(),re(),ie(),Fu=e=>{if(!e)throw new Error("Input is missing");if(e.length<2||e.length>3)throw new Error("Invaid input number.");if(e.length===3&&e[2].dims.length>2)throw new Error("Invalid input shape of C");if(e[0].dataType!==e[1].dataType||e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("Input types are mismatched")},Ku=(e,t)=>{let r=e[0].dims.slice(),a=e[1].dims.slice(),[n,i,s]=Qd.getShapeOfGemmResult(r,t.transA,a,t.transB,e.length===3?e[2].dims:void 0),u=[n,i];if(!u)throw new Error("Can't use gemm on the given tensors");let d=16,l=Math.ceil(i/d),c=Math.ceil(n/d),f=!0,h=C.size(u),g=[{type:12,data:f?l:h},{type:12,data:n},{type:12,data:i},{type:12,data:s},{type:1,data:t.alpha},{type:1,data:t.beta}],_=["type","type"];e.length===3&&(g.push(...X(e[2].dims)),_.push("rank")),g.push(...X(u));let b=$=>{let w="";t.transA&&t.transB?w="value += a[k * uniforms.M + m] * b[n * uniforms.K + k];":t.transA&&!t.transB?w="value += a[k * uniforms.M + m] * b[k * uniforms.N + n];":!t.transA&&t.transB?w="value += a[m * uniforms.K + k] * b[n * uniforms.K + k];":!t.transA&&!t.transB&&(w="value += a[m * uniforms.K + k] * b[k * uniforms.N + n];");let k=t.alpha===1?"":"value *= uniforms.alpha;",S=R("a",e[0].dataType,e[0].dims),I=R("b",e[1].dataType,e[1].dims),E=S.type.value,z=null,A=[S,I];e.length===3&&(z=R("c",e[2].dataType,e[2].dims.length),A.push(z));let O=H("output",e[0].dataType,u.length);A.push(O);let q=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}];return`
  ${$.registerUniforms(q).declareVariables(...A)}

  ${$.mainStart()}
    ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let m = global_idx / uniforms.N;
    let n = global_idx % uniforms.N;

    var value = ${E}(0);
    for (var k: u32 = 0u; k < uniforms.K; k++) {
      ${w}
    }

    ${k}
    ${z!=null?`let cOffset = ${z.broadcastedIndicesToOffset("vec2(m, n)",O)}; value += ${E}(uniforms.beta) * ${z.getByOffset("cOffset")};`:""}
    output[global_idx] = value;
  }`},x=$=>{let w=R("a",e[0].dataType,e[0].dims),k=R("b",e[1].dataType,e[1].dims),S=null,I=[w,k];e.length===3&&(S=R("c",e[2].dataType,e[2].dims.length),I.push(S));let E=H("output",e[0].dataType,u.length);I.push(E);let z=[{name:"num_tile_n",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}],A="",O="";t.transA&&t.transB?(O=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${w.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${k.type.value}(0);
      }
      `,A="value += tile_a[k][local_id.y] * tile_b[local_id.x][k];"):t.transA&&!t.transB?(O=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${w.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${k.type.value}(0);
      }
      `,A="value += tile_a[k][local_id.y] * tile_b[k][local_id.x];"):!t.transA&&t.transB?(O=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${w.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${k.type.value}(0);
      }
      `,A="value += tile_a[local_id.y][k] * tile_b[local_id.x][k];"):!t.transA&&!t.transB&&(O=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${w.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${k.type.value}(0);
      }
      `,A="value += tile_a[local_id.y][k] * tile_b[k][local_id.x];");let q=t.alpha===1?"":"value *= uniforms.alpha;";return`
  ${$.registerUniforms(z).declareVariables(...I)}
  var<workgroup> tile_a: array<array<${w.type.storage}, ${d}>, ${d}>;
  var<workgroup> tile_b: array<array<${k.type.storage}, ${d}>, ${d}>;
  ${$.mainStart([d,d,1])}
    let tile_col_start = (workgroup_index % uniforms.num_tile_n) * ${d};
    let tile_row_start = (workgroup_index / uniforms.num_tile_n) * ${d};
    let num_tiles = (uniforms.K - 1) / ${d} + 1;
    var k_start = 0u;
    var value = ${E.type.value}(0);
    for (var t: u32 = 0u; t < num_tiles; t++) {
      ${O}
      k_start = k_start + ${d};
      workgroupBarrier();

      for (var k: u32 = 0u; k < ${d}; k++) {
        ${A}
      }
      workgroupBarrier();
    }

    ${q}
    let m = tile_row_start + local_id.y;
    let n = tile_col_start + local_id.x;
    ${S!=null?`let cOffset = ${S.broadcastedIndicesToOffset("vec2(m, n)",E)}; value += ${E.type.value}(uniforms.beta) * ${S.getByOffset("cOffset")};`:""}
    if (m < uniforms.M && n < uniforms.N) {
      output[m * uniforms.N + n] = value;
    }
  }`};return f?{name:"GemmShared",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:u,dataType:e[0].dataType}],dispatchGroup:{x:l*c},programUniforms:g}),getShaderSource:x}:{name:"Gemm",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:u,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:g}),getShaderSource:b}},Yc=e=>{let t=e.transA,r=e.transB,a=e.alpha,n=e.beta;return{transA:t,transB:r,alpha:a,beta:n,cacheKey:`${e.transA};${e.transB};${e.alpha===1}`}},Jc=(e,t)=>{Fu(e.inputs),e.compute(Ku(e.inputs,t))}}),nt,lt,Tt,Et,Zu,Qu,Xu,Yu,Ju,el,tl,rl,ef,tf,Cg=U(()=>{J(),re(),ve(),ie(),[nt,lt,Tt,Et]=[0,1,2,3],Zu=e=>{if(e[0].dims.length!==4)throw new Error("only 4-D tensor is supported.");if(e[0].dims.length!==e[1].dims.length)throw new Error("input dimensions must be equal to grid dimensions");if(e[0].dims.length-2!==e[1].dims[e[1].dims.length-1])throw new Error(`last dimension of grid must be equal to ${e[0].dims.length-2}`);if(e[0].dims[0]!==e[1].dims[0])throw new Error("grid batch size must match input batch size")},Qu=`
  fn gs_get_cubic_coeffs(x: f32) -> vec4<f32> {
    let cubic_alpha = -0.75f;
    let x_abs = abs(x);
    var coeffs: vec4<f32>;
    coeffs[0] = (((cubic_alpha * (x_abs + 1) - 5 * cubic_alpha) * (x_abs + 1) + 8 * cubic_alpha) * (x_abs + 1) - 4 * cubic_alpha);
    coeffs[1] = (((cubic_alpha + 2) * x_abs - (cubic_alpha + 3)) * x_abs * x_abs + 1);
    coeffs[2] = (((cubic_alpha + 2) * (1 - x_abs) - (cubic_alpha + 3)) * (1 - x_abs) * (1 - x_abs) + 1);
    coeffs[3] = (((cubic_alpha * (2 - x_abs) - 5 * cubic_alpha) * (2 - x_abs) + 8 * cubic_alpha) * (2 - x_abs) - 4 * cubic_alpha);
    return coeffs;
  }
`,Xu=e=>`
  fn gs_bicubic_interpolate(p: mat4x4<${e}>, x: f32, y: f32) -> ${e} {
    var v: vec4<f32>;
    var coeffs = gs_get_cubic_coeffs(x);
    for (var i = 0; i < 4; i++) {
      v[i] = coeffs[0] * p[i][0] + coeffs[1] * p[i][1] + coeffs[2] * p[i][2] + coeffs[3] * p[i][3];
    }
    coeffs = gs_get_cubic_coeffs(y);
    let pixel = ${e}(coeffs[0] * v[0] + coeffs[1] * v[1] + coeffs[2] * v[2] + coeffs[3] * v[3]);
    return pixel;
  }
`,Yu=e=>`
  fn gs_denormalize(n: f32, length: i32) -> f32 {
    ${e.alignCorners===0?`
    // alignCorners: false => [-1, 1] to [-0.5, length - 0.5]
    return ((n + 1.0) * f32(length) - 1.0) / 2.0;
    `:`
    // alignCorners: true => [-1, 1] to [0, length - 1]
    return (n + 1.0) / 2.0 * (f32(length - 1));
    `}
  }
`,Ju=e=>`
  ${e.paddingMode==="reflection"?`
      fn gs_reflect(x: i32, x_min: f32, x_max: f32) -> u32 {
        var dx = 0.0;
        var fx = f32(x);
        let range = x_max - x_min;
        if (fx < x_min) {
          dx = x_min - fx;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_min + r;
          } else {
            fx = x_max - r;
          }
        } else if (fx > x_max) {
          dx = fx - x_max;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_max - r;
          } else {
            fx = x_min + r;
          }
        }
        return u32(fx);
      }`:""}
`,el=(e,t,r)=>`
  fn pixel_at_grid(r: i32, c: i32, H: i32, W: i32, batch: u32, channel: u32, border: vec4<f32>) -> ${t} {
     var pixel = ${t}(0);
     var indices = vec4<u32>(0);
     indices[${nt}] = batch;
     indices[${lt}] = channel;`+(()=>{switch(r.paddingMode){case"zeros":return`
          if (r >= 0 && r < H && c >=0 && c < W) {
            indices[${Tt}] = u32(r);
            indices[${Et}] = u32(c);
          } else {
            return ${t}(0);
          }
        `;case"border":return`
          indices[${Tt}] = u32(clamp(r, 0, H - 1));
          indices[${Et}] = u32(clamp(c, 0, W - 1));
        `;case"reflection":return`
          indices[${Tt}] = gs_reflect(r, border[1], border[3]);
          indices[${Et}] = gs_reflect(c, border[0], border[2]);
        `;default:throw new Error(`padding mode ${r.paddingMode} is not supported`)}})()+`
    return ${e.getByIndices("indices")};
  }
`,tl=(e,t,r)=>(()=>{switch(r.mode){case"nearest":return`
          let result = pixel_at_grid(i32(round(y)), i32(round(x)), H_in, W_in, indices[${nt}], indices[${lt}], border);
        `;case"bilinear":return`
          let x1 = i32(floor(x));
          let y1 = i32(floor(y));
          let x2 = x1 + 1;
          let y2 = y1 + 1;

          let p11 = pixel_at_grid(y1, x1, H_in, W_in, indices[${nt}], indices[${lt}], border);
          let p12 = pixel_at_grid(y1, x2, H_in, W_in, indices[${nt}], indices[${lt}], border);
          let p21 = pixel_at_grid(y2, x1, H_in, W_in, indices[${nt}], indices[${lt}], border);
          let p22 = pixel_at_grid(y2, x2, H_in, W_in, indices[${nt}], indices[${lt}], border);

          let dx2 = ${t}(f32(x2) - x);
          let dx1 = ${t}(x - f32(x1));
          let dy2 = ${t}(f32(y2) - y);
          let dy1 = ${t}(y - f32(y1));
          let result = dy2 * (dx2 * p11 + dx1 * p12) + dy1 * (dx2 * p21 + dx1 * p22);
        `;case"bicubic":return`
          let x0 = i32(floor(x)) - 1;
          let y0 = i32(floor(y)) - 1;
          var p: mat4x4<${t}>;
          for (var h = 0; h < 4; h++) {
            for (var w = 0; w < 4; w++) {
              p[h][w] = pixel_at_grid(h + y0, w + x0, H_in, W_in, indices[${nt}], indices[${lt}], border);
            }
          }

          let dx = x - f32(x0 + 1);
          let dy = y - f32(y0 + 1);
          let result = gs_bicubic_interpolate(p, dx, dy);
        `;default:throw new Error(`mode ${r.mode} is not supported`)}})()+`${e.setByOffset("global_idx","result")}`,rl=(e,t)=>{let r=R("x",e[0].dataType,e[0].dims.length),a=[e[1].dims[0],e[1].dims[1],e[1].dims[2]],n=R("grid",e[1].dataType,a.length,2),i=[e[0].dims[0],e[0].dims[1],e[1].dims[1],e[1].dims[2]];t.format==="NHWC"&&(i=[e[0].dims[0],e[1].dims[1],e[1].dims[2],e[0].dims[3]],[nt,lt,Tt,Et]=[0,3,1,2]);let s=H("output",e[0].dataType,i.length),u=r.type.value,d=C.size(i),l=[{type:12,data:d},...X(e[0].dims,a,i)],c=f=>`
  ${f.registerUniform("output_size","u32").declareVariables(r,n,s)}
  ${Qu}
  ${Xu(u)}
  ${Yu(t)}
  ${Ju(t)}
  ${el(r,u,t)}

  ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let H_in = i32(uniforms.x_shape[${Tt}]);
      let W_in = i32(uniforms.x_shape[${Et}]);

      ${t.alignCorners===0?`
      let x_min = -0.5;
      let x_max = f32(W_in) - 0.5;
      let y_min = -0.5;
      let y_max = f32(H_in) - 0.5;
      `:`
      let x_min = 0.0;
      let x_max = f32(W_in) - 1.0;
      let y_min = 0.0;
      let y_max = f32(H_in) - 1.0;
      `};
      let border = vec4<f32>(x_min, y_min, x_max, y_max);

      let indices = ${s.offsetToIndices("global_idx")};
      var grid_indices = vec3<u32>(indices[${nt}], indices[${Tt}], indices[${Et}]);
      let nxy = ${n.getByIndices("grid_indices")};
      var x = gs_denormalize(f32(nxy[0]), W_in);
      var y = gs_denormalize(f32(nxy[1]), H_in);

      ${tl(s,u,t)}
  }`;return{name:"GridSample",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:["type","type"]},getRunData:f=>{let h=C.size(i);return{outputs:[{dims:i,dataType:f[0].dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:l}},getShaderSource:c}},ef=(e,t)=>{Zu(e.inputs),e.compute(rl(e.inputs,t))},tf=e=>fe({alignCorners:e.align_corners,mode:e.mode,paddingMode:e.padding_mode,format:e.format})}),Oe,il,rf,ra,al,hr,af,nf=U(()=>{J(),re(),ve(),un(),pn(),ie(),xt(),Oe=(e,t)=>e.length>t&&e[t].dims.length>0?e[t]:void 0,il=(e,t)=>{let r=e[0],a=Oe(e,1),n=Oe(e,2),i=Oe(e,3),s=Oe(e,4),u=Oe(e,5),d=Oe(e,6),l=Oe(e,7);if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let c=r.dims[0],f=r.dims[1],h=r.dims.length===3?r.dims[2]:t.numHeads*r.dims[4],g=f,_=0,b=0,x=Math.floor(h/t.numHeads);if(d&&l&&C.size(d.dims)&&C.size(l.dims)){if(d.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(d.dims[0]!==c||d.dims[1]!==t.numHeads||d.dims[3]!==x)throw new Error('Input "past_key" shape (batch_size, num_heads, past_sequence_length, head_size)');if(l.dims[0]!==c||l.dims[1]!==t.numHeads||l.dims[3]!==x)throw new Error('Input "past_value" shape (batch_size, num_heads, past_sequence_length, head_size)');if(d.dims[2]!==l.dims[2])throw new Error('Input "past_key" and "past_value" shall have same dim 2 (past_sequence_length)');if(l.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');_=d.dims[2],b=d.dims[2]}else if(d&&C.size(d.dims)||l&&C.size(l.dims))throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let $;if(a&&C.size(a.dims)>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(a.dims.length<3||a.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==a.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(a.dims.length===3){if(a.dims[2]!==r.dims[2])throw new Error('Input "query" and "key" shall have same dim 2 (hidden_size)');$=2,g=a.dims[1]}else if(a.dims.length===5){if(a.dims[2]!==t.numHeads||a.dims[3]!==2||a.dims[4]!==x)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(n)throw new Error('Expect "value" be none when "key" has packed kv format.');$=5,g=a.dims[1]}else{if(a.dims[1]!==t.numHeads||a.dims[3]!==x)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');$=0,g=a.dims[2]}}else{if(r.dims.length!==5)throw new Error('Input "query" is expected to have 5 dimensions when key is empty');if(r.dims[2]!==t.numHeads||r.dims[3]!==3)throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');$=3}if(i&&C.size(i.dims)>0){if(i.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimension');if(a&&a.dims.length===5&&a.dims[3]===2)throw new Error("bias is not allowed for packed kv.")}let w=_+g,k=0;if(s&&C.size(s.dims)>0){k=8;let z=s.dims;throw z.length===1?z[0]===c?k=1:z[0]===3*c+2&&(k=3):z.length===2&&z[0]===c&&z[1]===w&&(k=5),k===8?new Error('Input "key_padding_mask" shape shall be (batch_size) or (batch_size, total_sequence_length)'):new Error("Mask not supported")}let S=!1,I=h;if(n&&C.size(n.dims)>0){if(n.dims.length!==3&&n.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==n.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(n.dims.length===3){if(g!==n.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');I=n.dims[2]}else{if(g!==n.dims[2])throw new Error('Input "key" and "value" shall have the same dim 2 (kv_sequence_length)');I=n.dims[1]*n.dims[3],S=!0}}let E=!1;if(s&&C.size(s.dims)>0)throw new Error("Key padding mask is not supported");if(u&&C.size(u.dims)>0){if(u.dims.length!==4)throw new Error('Input "attention_bias" is expected to have 4 dimensions');if(u.dims[0]!==c||u.dims[1]!==t.numHeads||u.dims[2]!==f||u.dims[3]!==w)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:c,sequenceLength:f,pastSequenceLength:_,kvSequenceLength:g,totalSequenceLength:w,maxSequenceLength:b,inputHiddenSize:0,hiddenSize:h,vHiddenSize:I,headSize:x,vHeadSize:Math.floor(I/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:k,scale:t.scale,broadcastResPosBias:E,passPastInKv:S,qkvFormat:$}},rf=e=>fe({...e}),ra=fe({perm:[0,2,1,3]}),al=(e,t,r,a,n,i,s)=>{let u=[a,n,i],d=C.size(u),l=[{type:12,data:d},{type:12,data:s},{type:12,data:i}],c=f=>{let h=H("qkv_with_bias",t.dataType,u),g=R("qkv",t.dataType,u),_=R("bias",r.dataType,u),b=[{name:"output_size",type:"u32"},{name:"bias_offset",type:"u32"},{name:"hidden_size",type:"u32"}];return`
  ${f.registerUniforms(b).declareVariables(g,_,h)}
  ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let bias_offset_idx = (global_idx % uniforms.hidden_size) + uniforms.bias_offset;

    qkv_with_bias[global_idx] = qkv[global_idx] + bias[bias_offset_idx];
  }`};return e.compute({name:"MultiHeadAttentionAddBias",shaderCache:{inputDependencies:["type","type"]},getRunData:()=>({outputs:[{dims:u,dataType:t.dataType,gpuDataType:0}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:l}),getShaderSource:c},{inputs:[t,r],outputs:[-1]})[0]},hr=(e,t,r,a,n,i,s,u)=>{let d=i;if(s&&C.size(s.dims)>0){if(a===1)throw new Error("AddBiasReshape is not implemented. Please export your model with packed QKV or KV");return d=al(e,i,s,t,a,r*n,u),d=d.reshape([t,a,r,n]),r===1||a===1?d:e.compute(Ue(d,ra.perm),{inputs:[d],outputs:[-1]})[0]}else return i.dims.length===3&&(d=i.reshape([t,a,r,n])),r===1||a===1?d:e.compute(Ue(d,ra.perm),{inputs:[d],outputs:[-1]})[0]},af=(e,t)=>{let r=il(e.inputs,t),a=e.inputs[0],n=Oe(e.inputs,1),i=Oe(e.inputs,2),s=Oe(e.inputs,3),u=Oe(e.inputs,4),d=Oe(e.inputs,5),l=Oe(e.inputs,6),c=Oe(e.inputs,7);if(a.dims.length===5)throw new Error("Packed QKV is not implemented");if((n==null?void 0:n.dims.length)===5)throw new Error("Packed KV is not implemented");let f=n&&i&&n.dims.length===4&&i.dims.length===4,h=hr(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,a,s,0);if(f)return _r(e,h,n,i,u,void 0,l,c,d,r);if(!n||!i)throw new Error("key and value must be provided");let g=hr(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.headSize,n,s,r.hiddenSize),_=hr(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.vHeadSize,i,s,2*r.hiddenSize);_r(e,h,g,_,u,void 0,l,c,d,r)}}),nl,sl,ol,ul,Wa,sf,of,uf=U(()=>{J(),re(),ve(),ie(),nl=e=>{if(!e||e.length<1)throw new Error("too few inputs")},sl=(e,t)=>{let r=[],a=t.numOutputs;return e[1].dims[0]>0&&(e[1].getBigInt64Array().forEach(n=>r.push(Number(n))),a=r.length),fe({numOutputs:a,axis:t.axis,splitSizes:r})},ol=e=>`
fn calculateOutputIndex(index: u32) -> u32 {
    for (var i: u32 = 0u; i < ${e}u; i += 1u ) {
    if (index < ${F("uniforms.size_in_split_axis","i",e)}) {
        return i;
    }
    }
    return ${e}u;
}`,ul=e=>{let t=e.length,r=[];for(let a=0;a<t;++a){let n=e[a].setByIndices("indices","input[global_idx]");t===1?r.push(n):a===0?r.push(`if (output_number == ${a}u) { ${n} }`):a===t-1?r.push(`else { ${n} }`):r.push(`else if (output_number == ${a}) { ${n} }`)}return`
      fn writeBufferData(output_number: u32, indices: ${e[0].type.indices}, global_idx: u32) {
        ${r.join(`
`)}
      }`},Wa=(e,t)=>{let r=e[0].dims,a=C.size(r),n=e[0].dataType,i=C.normalizeAxis(t.axis,r.length),s=new Array(t.numOutputs),u=R("input",n,r.length),d=new Array(t.numOutputs),l=[],c=[],f=0,h=[{type:12,data:a}];for(let _=0;_<t.numOutputs;_++){f+=t.splitSizes[_],d[_]=f;let b=r.slice();b[i]=t.splitSizes[_],c.push(b),s[_]=H(`output${_}`,n,b.length),l.push({dims:c[_],dataType:e[0].dataType})}h.push({type:12,data:d},...X(r,...c));let g=_=>`
  ${_.registerUniform("input_size","u32").registerUniform("size_in_split_axis","u32",d.length).declareVariables(u,...s)}
  ${ol(d.length)}
  ${ul(s)}

  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.input_size")}

    var indices = ${u.offsetToIndices("global_idx")};
    var index = ${u.indicesGet("indices",i)};
    let output_number = calculateOutputIndex(index);
    if (output_number != 0) {
      index -= ${F("uniforms.size_in_split_axis","output_number - 1u",d.length)};
      ${u.indicesSet("indices",i,"index")};
    }
    writeBufferData(output_number, indices, global_idx);
  }`;return{name:"Split",shaderCache:{hint:t.cacheKey,inputDependencies:["rank"]},getShaderSource:g,getRunData:()=>({outputs:l,dispatchGroup:{x:Math.ceil(a/64)},programUniforms:h})}},sf=(e,t)=>{nl(e.inputs);let r=e.inputs.length===1?t:sl(e.inputs,t);e.compute(Wa(e.inputs,r),{inputs:[0]})},of=e=>{let t=e.axis,r=e.splitSizes,a=e.numOutputs<0?r.length:e.numOutputs;if(a!==r.length)throw new Error("numOutputs and splitSizes lengh must be equal");return fe({axis:t,numOutputs:a,splitSizes:r})}}),ll,Yr,lf,df=U(()=>{J(),re(),ve(),ie(),ll=(e,t)=>{let[r,a,n,i]=e,{numHeads:s,rotaryEmbeddingDim:u}=t;if(r.dims.length!==3&&r.dims.length!==4)throw new Error(`Input 'x' is expected to have 3 or 4 dimensions, got ${r.dims.length}`);if(!C.areEqual(a.dims,[])&&!C.areEqual(a.dims,[1])&&a.dims.length!==2)throw new Error(`Input 'position_ids' is expected to have 0, 1, or 2 dimensions, got ${a.dims.length}`);if(n.dims.length!==2)throw new Error(`Input 'cos_cache' is expected to have 2 dimensions, got ${n.dims.length}`);if(i.dims.length!==2)throw new Error(`Input 'sin_cache' is expected to have 2 dimensions, got ${i.dims.length}`);if(!C.areEqual(n.dims,i.dims))throw new Error("Inputs 'cos_cache' and 'sin_cache' are expected to have the same shape");if(u>0&&s===0)throw new Error("num_heads must be provided if rotary_embedding_dim is specified");let d=r.dims[0],l=r.dims[r.dims.length-2],c=n.dims[0],f=C.sizeFromDimension(r.dims,1)/l,h=u===0?n.dims[1]*2:f/s;if(u>h)throw new Error("rotary_embedding_dim must be less than or equal to head_size");if(a.dims.length===2){if(d!==a.dims[0])throw new Error(`Input 'position_ids' dimension 0 should be of size batch_size, got ${a.dims[0]}`);if(l!==a.dims[1])throw new Error(`Input 'position_ids' dimension 1 should be of size sequence_length, got ${a.dims[1]}`)}if(h/2!==n.dims[1]&&u/2!==n.dims[1])throw new Error(`Input 'cos_cache' dimension 1 should be same as head_size / 2 or rotary_embedding_dim / 2, got ${n.dims[1]}`);if(l>c)throw new Error("Updating cos_cache and sin_cache in RotaryEmbedding is not currently supported")},Yr=(e,t)=>{let{interleaved:r,numHeads:a,rotaryEmbeddingDim:n,scale:i}=t,s=e[0].dims[0],u=C.sizeFromDimension(e[0].dims,1),d=e[0].dims[e[0].dims.length-2],l=u/d,c=e[2].dims[1],f=n===0?c*2:l/a,h=new Array(s,d,l/f,f-c),g=C.computeStrides(h),_=[{type:1,data:i},{type:12,data:h},{type:12,data:g},...e[0].dims.length===3?new Array({type:12,data:[u,l,f,1]}):[],...e[0].dims.length===4?new Array({type:12,data:[u,f,d*f,1]}):[],...X(e[0].dims,e[1].dims,e[2].dims,e[3].dims,e[0].dims)],b=x=>{let $=R("input",e[0].dataType,e[0].dims.length),w=R("position_ids",e[1].dataType,e[1].dims.length),k=R("cos_cache",e[2].dataType,e[2].dims.length),S=R("sin_cache",e[3].dataType,e[3].dims.length),I=H("output",e[0].dataType,e[0].dims.length);return x.registerUniforms([{name:"scale",type:"f32"},{name:"global_shape",type:"u32",length:h.length},{name:"global_strides",type:"u32",length:g.length},{name:"input_output_strides",type:"u32",length:g.length}]),`
        ${x.declareVariables($,w,k,S,I)}

        ${x.mainStart(Ht)}
          let half_rotary_emb_dim = uniforms.${k.name}_shape[1];
          let bsnh = global_idx / uniforms.global_strides % uniforms.global_shape;
          let size = uniforms.global_shape[0] * uniforms.global_strides[0];
          ${x.guardAgainstOutOfBoundsWorkgroupSizes("size")}

          if (bsnh[3] < half_rotary_emb_dim) {
            let position_ids_idx =
                ${w.broadcastedIndicesToOffset("bsnh.xy",H("",w.type.tensor,2))};
            let position_id =
                u32(${w.getByOffset("position_ids_idx")}) + select(0, bsnh[1], position_ids_idx == 0);
            let i = dot(bsnh, uniforms.input_output_strides) + select(0, bsnh[3], ${r});
            let j = i + select(half_rotary_emb_dim, 1, ${r});
            let re = ${$.getByOffset("i")} * ${k.get("position_id","bsnh[3]")} -
                ${$.getByOffset("j")} * ${S.get("position_id","bsnh[3]")};
            ${I.setByOffset("i","re")}
            let im = ${$.getByOffset("i")} * ${S.get("position_id","bsnh[3]")} +
                ${$.getByOffset("j")} * ${k.get("position_id","bsnh[3]")};
            ${I.setByOffset("j","im")}
          } else {
            let k = dot(bsnh, uniforms.input_output_strides) + half_rotary_emb_dim;
            ${I.setByOffset("k",$.getByOffset("k"))}
          }
        }`};return{name:"RotaryEmbedding",shaderCache:{hint:fe({interleaved:r}).cacheKey,inputDependencies:["rank","rank","rank","rank"]},getShaderSource:b,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(C.size(h)/Ht)},programUniforms:_})}},lf=(e,t)=>{ll(e.inputs,t),e.compute(Yr(e.inputs,t))}}),dl,pl,ia,cl,pf,Ag=U(()=>{ve(),J(),pn(),nf(),uf(),xt(),df(),ie(),dl=(e,t)=>{if(t.doRotary&&e.length<=7)throw new Error("cos_cache and sin_cache inputs are required if do_rotary is specified");let r=e[0],a=e[1],n=e[2],i=e[3],s=e[4];if(t.doRotary!==0&&e.length<=7)throw new Error("cos_cast and sin_cache are expected if do_rotary attribute is non-zero");if(t.localWindowSize!==-1)throw new Error("Local attention is not supported");if(t.softcap!==0)throw new Error("Softcap is not supported");if(t.rotaryInterleaved!==0)throw new Error("Rotary interleaved is not supported");if(t.smoothSoftmax)throw new Error("Smooth softmax is not supported");if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let u=!1,d=r.dims[0],l=r.dims[1],c=r.dims.length===3?u?r.dims[2]/3:r.dims[2]:t.numHeads*r.dims[4],f=l,h=0,g=!a||a.dims.length===0,_=Math.floor(g?c/(t.numHeads+2*t.kvNumHeads):c/t.numHeads);g&&(c=_*t.numHeads);let b=i&&i.dims.length!==0,x=s&&s.dims.length!==0;if(b&&i.dims.length===4&&i.dims[0]===d&&i.dims[1]!==t.kvNumHeads&&i.dims[2]===t.kvNumHeads&&i.dims[3]===_)throw new Error("BSNH pastKey/pastValue is not supported");if(b&&x){if(i.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(s.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');h=i.dims[2]}else if(b||x)throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let $=1;if(a&&a.dims.length>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(a.dims.length<3||a.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==a.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(a.dims.length===3){if(r.dims[2]%a.dims[2]!==0)throw new Error('Dimension 2 of "query" should be a multiple of "key"');f=a.dims[1]}else if(a.dims.length===5){if(a.dims[2]!==t.numHeads||a.dims[3]!==2||a.dims[4]!==_)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(n)throw new Error('Expect "value" be none when "key" has packed kv format.');f=a.dims[1]}else{if(a.dims[1]!==t.numHeads||a.dims[3]!==_)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');f=a.dims[2]}}else{if(r.dims.length!==3&&r.dims.length!==5)throw new Error('Input "query" is expected to have 3 or 5 dimensions when key is empty');if(r.dims.length===5&&(r.dims[2]!==t.numHeads||r.dims[3]!==3))throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');$=3}let w=0,k=!1,S=t.kvNumHeads?_*t.kvNumHeads:c;if(n&&n.dims.length>0){if(n.dims.length!==3&&n.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==n.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(n.dims.length===3){if(f!==n.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');S=n.dims[2]}else{if(f!==n.dims[2])throw new Error('Input "past_key" and "past_value" shall have the same dim 2 (kv_sequence_length)');S=n.dims[1]*n.dims[3],k=!0}}let I=e.length>4?e[5]:void 0;if(I&&I.dims.length!==1&&I.dims[0]!==d)throw new Error('Input "seqlens" is expected to have 1 dimension and the same dim 0 as batch_size');return{batchSize:d,sequenceLength:l,pastSequenceLength:h,kvSequenceLength:f,totalSequenceLength:-1,maxSequenceLength:-1,inputHiddenSize:0,hiddenSize:c,vHiddenSize:S,headSize:_,vHeadSize:Math.floor(S/t.kvNumHeads),numHeads:t.numHeads,kvNumHeads:t.kvNumHeads,nReps:t.numHeads/t.kvNumHeads,pastPresentShareBuffer:!1,maskType:w,scale:t.scale,broadcastResPosBias:!1,passPastInKv:k,qkvFormat:$}},pl=fe({perm:[0,2,1,3]}),ia=(e,t,r)=>{let a=t,n=r.kvNumHeads;return t.dims.length===3&&r.kvSequenceLength!==0&&(a=t.reshape([r.batchSize,r.kvSequenceLength,n,r.headSize]),a=e.compute(Ue(a,pl.perm),{inputs:[a],outputs:[-1]})[0]),a},cl=(e,t,r,a)=>{let n=7,i=["type","type"],s=[e*t],u=e*t,d=[{type:12,data:u},{type:12,data:t},{type:12,data:e}],l=c=>{let f=R("seq_lens",r.dataType,r.dims),h=R("total_seq_lens",a.dataType,a.dims),g=H("pos_ids",n,s),_=[{name:"output_size",type:"u32"},{name:"sequence_length",type:"u32"},{name:"batch_size",type:"u32"}];return`
  ${c.registerUniforms(_).declareVariables(f,h,g)}
  ${c.mainStart()}
    ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let total_sequence_length = u32(${h.getByOffset("0")});
    let is_subsequent_prompt = uniforms.sequence_length > 1 && uniforms.sequence_length != total_sequence_length;
    let is_first_prompt = !is_subsequent_prompt && uniforms.sequence_length == total_sequence_length;
    let batch_idx = global_idx / uniforms.sequence_length;
    let sequence_idx = i32(global_idx % uniforms.sequence_length);
    var pos_id: i32 = 0;
    let seqlen = ${f.getByOffset("batch_idx")};
    let total_seqlen = seqlen + 1;
    if (is_first_prompt) {
      if (sequence_idx < total_seqlen) {
        pos_id = sequence_idx;
      } else {
        pos_id = 1;
      }
      ${g.setByOffset("global_idx","pos_id")}
    } else if (is_subsequent_prompt) {
      let past_seqlen = total_seqlen - i32(uniforms.sequence_length);
      if (past_seqlen + sequence_idx < total_seqlen) {
        pos_id = past_seqlen + sequence_idx;
      } else {
        pos_id = 1;
      }
      ${g.setByOffset("global_idx","pos_id")}
    } else if (global_idx < uniforms.batch_size) {
      ${g.setByOffset("global_idx","seqlen")}
    };
  }
  `};return{name:"GeneratePositionIds",shaderCache:{hint:`${e};${t}`,inputDependencies:i},getRunData:()=>({outputs:[{dims:s,dataType:n}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:d}),getShaderSource:l}},pf=(e,t)=>{var S;let r=dl(e.inputs,t);if(e.inputs[0].dims.length===5)throw new Error("Packed QKV is not implemented");if(((S=e.inputs[1])==null?void 0:S.dims.length)===5)throw new Error("Packed KV is not implemented");let a=e.inputs[0],n=e.inputs[1]&&e.inputs[1].dims.length>0?e.inputs[1]:void 0,i=e.inputs[2]&&e.inputs[2].dims.length>0?e.inputs[2]:void 0,s=e.inputs[3]&&e.inputs[3].dims.length!==0?e.inputs[3]:void 0,u=e.inputs[4]&&e.inputs[4].dims.length!==0?e.inputs[4]:void 0,d=e.inputs.length>4?e.inputs[5]:void 0,l=e.inputs.length>5?e.inputs[6]:void 0,c=r.kvNumHeads?r.kvNumHeads:r.numHeads,f=fe({axis:2,numOutputs:3,splitSizes:[r.numHeads*r.headSize,c*r.headSize,c*r.headSize]}),[h,g,_]=!n&&!i?e.compute(Wa([a],f),{inputs:[a],outputs:[-1,-1,-1]}):[a,n,i],b,x;if(t.doRotary){let I=e.compute(cl(r.batchSize,r.sequenceLength,d,l),{inputs:[d,l],outputs:[-1]})[0],E=e.inputs[7],z=e.inputs[8],A=fe({interleaved:t.rotaryInterleaved!==0,numHeads:r.numHeads,rotaryEmbeddingDim:0,scale:t.scale}),O=[h,I,E,z],q=[-1];b=e.compute(Yr(O,A),{inputs:O,outputs:q})[0],O.splice(0,1,g);let K=fe({interleaved:t.rotaryInterleaved!==0,numHeads:r.kvNumHeads,rotaryEmbeddingDim:0,scale:t.scale});x=e.compute(Yr(O,K),{inputs:O,outputs:q})[0]}let $=hr(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,t.doRotary?b:h,void 0,0),w=ia(e,t.doRotary?x:g,r),k=ia(e,_,r);_r(e,$,w,k,void 0,void 0,s,u,void 0,r,d,l)}}),aa,fl,hl,cf,Og=U(()=>{J(),re(),xt(),ie(),aa=(e,t,r,a,n,i,s,u)=>{let d=$e(i),l=d===1?"f32":`vec${d}f`,c=d===1?"vec2f":`mat2x${d}f`,f=n*s,h=64;f===1&&(h=256);let g=[n,s,i/d],_=[n,s,2],b=["rank","type","type"],x=[];x.push(...X(g,_));let $=w=>{let k=R("x",t.dataType,3,d),S=R("scale",r.dataType,r.dims),I=R("bias",a.dataType,a.dims),E=H("output",1,3,2),z=[k,S,I,E];return`
  var<workgroup> workgroup_shared : array<${c}, ${h}>;
  const workgroup_size = ${h}u;
  ${w.declareVariables(...z)}
  ${w.mainStart(h)}
    let batch = workgroup_index / uniforms.x_shape[1];
    let channel = workgroup_index % uniforms.x_shape[1];
    let hight = uniforms.x_shape[2];
    // initialize workgroup memory
    var sum = ${l}(0);
    var squared_sum = ${l}(0);
    for (var h = local_idx; h < hight; h += workgroup_size) {
      let value = ${l}(${k.get("batch","channel","h")});
      sum += value;
      squared_sum += value * value;
    }
    workgroup_shared[local_idx] = ${c}(sum, squared_sum);
    workgroupBarrier();

    for (var currSize = workgroup_size >> 1;  currSize > 0; currSize = currSize >> 1) {
      if (local_idx < currSize) {
        workgroup_shared[local_idx] = workgroup_shared[local_idx] + workgroup_shared[local_idx + currSize];
      }
      workgroupBarrier();
    }
    if (local_idx == 0) {
      let sum_final = ${vt("workgroup_shared[0][0]",d)} / f32(hight * ${d});
      let squared_sum_final = ${vt("workgroup_shared[0][1]",d)} / f32(hight * ${d});

      let inv_std_dev = inverseSqrt(squared_sum_final - sum_final * sum_final + f32(${u}));
      let channel_scale = inv_std_dev * f32(scale[channel]);
      let channel_shift = f32(bias[channel]) - sum_final * channel_scale;
      output[workgroup_index] = vec2f(channel_scale, channel_shift);
    }
  }`};return e.compute({name:"InstanceNormComputeChannelScaleShift",shaderCache:{hint:`${d};${u};${h}`,inputDependencies:b},getRunData:()=>({outputs:[{dims:_,dataType:1}],dispatchGroup:{x:f},programUniforms:x}),getShaderSource:$},{inputs:[t,r,a],outputs:[-1]})[0]},fl=(e,t,r)=>{let a=t[0].dims,n=a,i=2,s=a[0],u=a[1],d=C.sizeFromDimension(a,i),l=$e(d),c=C.size(n)/l,f=aa(e,t[0],t[1],t[2],s,d,u,r.epsilon),h=[s,u,d/l],g=[s,u],_=["type","none"],b=x=>{let $=R("x",t[0].dataType,h.length,l),w=R("scale_shift",1,g.length,2),k=H("output",t[0].dataType,h.length,l),S=[$,w,k];return`
  ${x.registerUniform("output_size","u32").declareVariables(...S)}
  ${x.mainStart()}
  ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let outputIndices = ${k.offsetToIndices("global_idx")};
      let batch = outputIndices[0];
      let channel = outputIndices[1];
      let scale_shift = ${w.getByIndices("vec2<u32>(batch, channel)")};
      let value = ${$.getByOffset("global_idx")} * ${k.type.value}(scale_shift.x) + ${k.type.value}(scale_shift.y);
      ${k.setByOffset("global_idx","value")};
  }`};e.compute({name:"InstanceNormalization",shaderCache:{hint:`${l}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:n,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:[{type:12,data:c},...X(h,g,h)]}),getShaderSource:b},{inputs:[t[0],f]})},hl=(e,t,r)=>{let a=t[0].dims,n=a,i=a[0],s=a[a.length-1],u=C.sizeFromDimension(a,1)/s,d=$e(s),l=C.size(n)/d,c=[{type:12,data:u},{type:12,data:Math.floor(s/d)}],f=["type","type"],h=!1,g=[0,a.length-1];for(let $=0;$<a.length-2;$++)h=h||a[$+1]!==1,g.push($+1);h=h&&a[a.length-1]!==1;let _=h?e.compute(Ue(e.inputs[0],g),{inputs:[e.inputs[0]],outputs:[-1]})[0]:e.inputs[0].reshape(Array.from({length:a.length},($,w)=>a[g[w]])),b=aa(e,_,t[1],t[2],i,u,s,r.epsilon),x=$=>{let w=ke(t[0].dataType),k=d===1?"vec2f":`mat${d}x2f`,S=z=>{let A=z===0?"x":"y",O=d===1?"f32":`vec${d}f`;switch(d){case 1:return`${w}(${O}(scale.${A}))`;case 2:return`vec2<${w}>(${O}(scale[0].${A}, scale[1].${A}))`;case 4:return`vec4<${w}>(${O}(scale[0].${A}, scale[1].${A}, scale[2].${A}, scale[3].${A}))`;default:throw new Error(`Not supported compoents ${d}`)}},I=R("input",t[0].dataType,t[0].dims,d),E=H("output",t[0].dataType,n,d);return`
  @group(0) @binding(0) var<storage, read> input : array<${I.type.storage}>;
  @group(0) @binding(1) var<storage, read> scale_input : array<${k}>;
  @group(0) @binding(2) var<storage, read_write> output : array<${E.type.storage}>;
  struct Uniforms {H: u32, C : u32};
  @group(0) @binding(3) var<uniform> uniforms: Uniforms;

  ${$.mainStart()}
    let current_image_number = global_idx / (uniforms.C * uniforms.H);
    let current_channel_number = global_idx % uniforms.C;

    let scale_offset = current_image_number * uniforms.C + current_channel_number;
    let scale = scale_input[scale_offset];
    output[global_idx] = fma(input[global_idx], ${S(0)}, ${S(1)});
  }`};e.compute({name:"InstanceNormalizationNHWC",shaderCache:{hint:`${d}`,inputDependencies:f},getRunData:()=>({outputs:[{dims:n,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:c}),getShaderSource:x},{inputs:[t[0],b]})},cf=(e,t)=>{t.format==="NHWC"?hl(e,e.inputs,t):fl(e,e.inputs,t)}}),ml,gl,ff,Bg=U(()=>{J(),re(),ie(),ml=e=>{if(!e||e.length<2)throw new Error("layerNorm requires at least 2 inputs.")},gl=(e,t,r)=>{let a=t.simplified,n=e[0].dims,i=e[1],s=!a&&e[2],u=n,d=C.normalizeAxis(t.axis,n.length),l=C.sizeToDimension(n,d),c=C.sizeFromDimension(n,d),f=C.size(i.dims),h=s?C.size(s.dims):0;if(f!==c||s&&h!==c)throw new Error(`Size of X.shape()[axis:] == ${c}.
       Size of scale and bias (if provided) must match this.
       Got scale size of ${f} and bias size of ${h}`);let g=[];for(let I=0;I<n.length;++I)I<d?g.push(n[I]):g.push(1);let _=$e(c),b=["type","type"],x=[{type:12,data:l},{type:1,data:c},{type:12,data:Math.floor(c/_)},{type:1,data:t.epsilon}];s&&b.push("type");let $=r>1,w=r>2,k=I=>{let E=ke(e[0].dataType),z=[R("x",e[0].dataType,e[0].dims,_),R("scale",i.dataType,i.dims,_)];s&&z.push(R("bias",s.dataType,s.dims,_)),z.push(H("output",e[0].dataType,u,_)),$&&z.push(H("mean_data_output",1,g)),w&&z.push(H("inv_std_output",1,g));let A=[{name:"norm_count",type:"u32"},{name:"norm_size",type:"f32"},{name:"norm_size_vectorized",type:"u32"},{name:"epsilon",type:"f32"}];return`
  ${I.registerUniforms(A).declareVariables(...z)}
  ${I.mainStart()}
    ${I.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.norm_count")}
    let offset = global_idx * uniforms.norm_size_vectorized;
    var mean_vector = ${Oa("f32",_)};
    var mean_square_vector = ${Oa("f32",_)};

    for (var h: u32 = 0u; h < uniforms.norm_size_vectorized; h++) {
      let value = ${jt(E,_,"x[h + offset]")};
      mean_vector += value;
      mean_square_vector += value * value;
    }
    let mean = ${vt("mean_vector",_)} / uniforms.norm_size;
    let inv_std_dev = inverseSqrt(${vt("mean_square_vector",_)} / uniforms.norm_size ${a?"":"- mean * mean"} + uniforms.epsilon);

    for (var j: u32 = 0; j < uniforms.norm_size_vectorized; j++) {
      let f32input = ${jt(E,_,"x[j + offset]")};
      let f32scale = ${jt(E,_,"scale[j]")};
      output[j + offset] = ${z[0].type.value}((f32input ${a?"":"- mean"}) * inv_std_dev * f32scale
        ${s?`+ ${jt(E,_,"bias[j]")}`:""}
      );
    }

    ${$?"mean_data_output[global_idx] = mean":""};
    ${w?"inv_std_output[global_idx] = inv_std_dev":""};
  }`},S=[{dims:u,dataType:e[0].dataType}];return $&&S.push({dims:g,dataType:1}),w&&S.push({dims:g,dataType:1}),{name:"LayerNormalization",shaderCache:{hint:`${_};${r};${a}`,inputDependencies:b},getRunData:()=>({outputs:S,dispatchGroup:{x:Math.ceil(l/64)},programUniforms:x}),getShaderSource:k}},ff=(e,t)=>{ml(e.inputs),e.compute(gl(e.inputs,t,e.outputCount))}}),_l,hf,Rg=U(()=>{re(),gn(),_n(),_l=e=>{if(!e||e.length!==2)throw new Error("MatMul requires 2 inputs.");if(e[0].dims[e[0].dims.length-1]!==e[1].dims[e[1].dims.length-2])throw new Error("shared dimension does not match.")},hf=e=>{_l(e.inputs);let t=Gt.calcShape(e.inputs[0].dims,e.inputs[1].dims,!0);if(!t)throw new Error("Can't use matmul on the given tensors");let r=t[t.length-1],a=e.inputs[0].dims[e.inputs[0].dims.length-1];if(r<8&&a<8)e.compute(mn(e.inputs,{activation:""},t));else{let n=t[t.length-2],i=C.size(e.inputs[0].dims.slice(0,-2)),s=C.size(e.inputs[1].dims.slice(0,-2));if(i!==1&&n===1&&s===1){let u=e.inputs[0].reshape([1,i,a]),d=e.inputs[1].reshape([1,a,r]),l=[1,i,r],c=[u,d];e.compute(Xr(c,{activation:""},t,l),{inputs:c})}else e.compute(Xr(e.inputs,{activation:""},t))}}}),yl,bl,wl,mf,gf,Mg=U(()=>{J(),re(),ve(),ie(),yl=(e,t)=>{if(e.length<3||e.length>4)throw new Error("MatMulNBits requires 3 or 4 inputs");let r=e[0],a=r.dims.length;if(r.dims[a-1]!==t.k)throw new Error("The last dim of input shape does not match the k value");let n=Math.floor((t.k+t.blockSize-1)/t.blockSize),i=t.blockSize/8*t.bits,s=e[1];if(!C.areEqual(s.dims,[t.n,n,i]))throw new Error("The second inputs must be 3D tensor with shape N X nBlocksPerCol X blobSize");let u=e[2].dims;if(C.size(u)!==t.n*n)throw new Error("scales input size error.");if(e.length===4){let d=e[3].dims,l=t.bits>4?t.n*n:t.n*Math.floor((n+1)/2);if(C.size(d)!==l)throw new Error("zeroPoints input size error.")}},bl=(e,t)=>{let r=e[0].dims,a=r.length,n=r[a-2],i=t.k,s=t.n,u=r.slice(0,a-2),d=C.size(u),l=e[1].dims[2]/4,c=e[0].dataType,f=$e(t.k),h=$e(l),g=$e(s),_=u.concat([n,s]),b=n>1&&s/g%2===0?2:1,x=C.size(_)/g/b,$=64,w=[],k=[d,n,i/f],S=C.convertShape(e[1].dims).slice();S.splice(-1,1,l/h),w.push(...X(k)),w.push(...X(S)),w.push(...X(e[2].dims)),e.length===4&&w.push(...X(C.convertShape(e[3].dims)));let I=[d,n,s/g];w.push(...X(I));let E=z=>{let A=k.length,O=R("a",e[0].dataType,A,f),q=R("b",12,S.length,h),K=R("scales",e[2].dataType,e[2].dims.length),W=[O,q,K],Z=e.length===4?R("zero_points",12,e[3].dims.length):void 0;Z&&W.push(Z);let ue=I.length,ee=H("output",e[0].dataType,ue,g),j=ke(e[0].dataType),L=(()=>{switch(f){case 1:return`array<${j}, 8>`;case 2:return`mat4x2<${j}>`;case 4:return`mat2x4<${j}>`;default:throw new Error(`${f}-component is not supported.`)}})(),de=()=>{let M=`
          // reuse a data
            var input_offset = ${O.indicesToOffset(`${O.type.indices}(batch, row, word_offset)`)};
            var a_data: ${L};
            for (var j: u32 = 0; j < ${8/f}; j++) {
              a_data[j] = ${O.getByOffset("input_offset")};
              input_offset++;
            }
          `;for(let P=0;P<g*b;P++)M+=`
            b_value = ${h===1?`b${P}_data`:`b${P}_data[i]`};
            b_value_lower = unpack4xU8(b_value & b_mask);
            b_value_upper = unpack4xU8((b_value >> 4) & b_mask);
            b_quantized_values = ${L}(${Array.from({length:4},(G,oe)=>`${j}(b_value_lower[${oe}]), ${j}(b_value_upper[${oe}])`).join(", ")});
            b_dequantized_values = ${f===1?`${L}(${Array.from({length:8},(G,oe)=>`(b_quantized_values[${oe}] - ${Z?`zero_point${P}`:"zero_point"}) * scale${P}`).join(", ")});`:`(b_quantized_values - ${L}(${Array(8).fill(`${Z?`zero_point${P}`:"zero_point"}`).join(",")})) * scale${P};`};
            workgroup_shared[local_id.x * ${b} + ${Math.floor(P/g)}]${g>1?`[${P%g}]`:""} += ${Array.from({length:8/f},(G,oe)=>`${f===1?`a_data[${oe}] * b_dequantized_values[${oe}]`:`dot(a_data[${oe}], b_dequantized_values[${oe}])`}`).join(" + ")};
          `;return M},te=()=>{let M=`
            var col_index = col * ${g};
            ${Z?`
            let zero_point_bytes_per_col = (nBlocksPerCol + 1) / 2;
            var zero_point_byte_count: u32;
            var zero_point_word_index: u32;
            var zero_point_byte_offset: u32;
            let zero_point_nibble_offset: u32 = block & 0x1u;
            var zero_point_bits_offset: u32;
            var zero_point_word: u32;`:`
            // The default zero point is 8 for unsigned 4-bit quantization.
            let zero_point = ${j}(8);`}
            `;for(let P=0;P<g*b;P++)M+=`
            let scale${P} = ${K.getByOffset("col_index * nBlocksPerCol + block")};
            ${Z?`
            zero_point_byte_count = col_index * zero_point_bytes_per_col + (block >> 0x1u);
            zero_point_word_index = zero_point_byte_count >> 0x2u;
            zero_point_byte_offset = zero_point_byte_count & 0x3u;
            zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_nibble_offset << 2);
            zero_point_word = ${Z.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point${P} = ${j}((zero_point_word) & 0xFu);`:""}
            col_index += 1;`;return M},ae=()=>{let M=`col_index = col * ${g};`;for(let P=0;P<g*b;P++)M+=`
            let b${P}_data = ${q.getByIndices(`${q.type.indices}(col_index, block, word)`)};
            col_index += 1;`;return M+=`
            var b_value: u32;
            let b_mask: u32 = 0x0F0F0F0Fu;
            var b_value_lower: vec4<u32>;
            var b_value_upper: vec4<u32>;
            var b_quantized_values: ${L};
            var b_dequantized_values: ${L};`,M};return`
        var<workgroup> workgroup_shared: array<${ee.type.value}, ${b*$}>;
        ${z.declareVariables(...W,ee)}
        ${z.mainStart([$,1,1])}
          let output_indices = ${ee.offsetToIndices(`(global_idx / ${$}) * ${b}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let nBlocksPerCol = uniforms.b_shape[1];

          for (var block = local_id.x; block < nBlocksPerCol; block += ${$}) {
            //process one block
            var word_offset: u32 = block * ${t.blockSize/f};
            ${te()}
            for (var word: u32 = 0; word < ${l}; word += ${h}) {
              ${ae()}
              for (var i: u32 = 0; i < ${h}; i++) {
                ${de()}
                word_offset += ${8/f};
              }
            }
          }
          workgroupBarrier();

          if (local_id.x < ${b}) {
            var output_value: ${ee.type.value} = ${ee.type.value}(0);
            var workgroup_shared_offset: u32 = local_id.x;
            for (var b: u32 = 0u; b < ${$}u; b++) {
              output_value += workgroup_shared[workgroup_shared_offset];
              workgroup_shared_offset += ${b};
            }
            ${ee.setByIndices(`${ee.type.indices}(batch, row, col + local_id.x)`,"output_value")};
          }
        }`};return{name:"MatMulNBits",shaderCache:{hint:`${t.blockSize};${t.bits};${f};${h};${g};${b};${$}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:_,dataType:c}],dispatchGroup:{x},programUniforms:w}),getShaderSource:E}},wl=(e,t)=>{let r=e[0].dims,a=r.length,n=r[a-2],i=t.k,s=t.n,u=r.slice(0,a-2),d=C.size(u),l=e[1].dims[2]/4,c=e[0].dataType,f=$e(t.k),h=$e(l),g=u.concat([n,s]),_=128,b=s%8===0?8:s%4===0?4:1,x=_/b,$=x*h*8,w=$/f,k=$/t.blockSize,S=C.size(g)/b,I=[],E=[d,n,i/f],z=C.convertShape(e[1].dims).slice();z.splice(-1,1,l/h),I.push(...X(E)),I.push(...X(z)),I.push(...X(e[2].dims)),e.length===4&&I.push(...X(C.convertShape(e[3].dims)));let A=[d,n,s];I.push(...X(A));let O=q=>{let K=E.length,W=R("a",e[0].dataType,K,f),Z=R("b",12,z.length,h),ue=R("scales",e[2].dataType,e[2].dims.length),ee=[W,Z,ue],j=e.length===4?R("zero_points",12,e[3].dims.length):void 0;j&&ee.push(j);let L=A.length,de=H("output",e[0].dataType,L),te=ke(e[0].dataType),ae=()=>{switch(f){case 1:return`
          let a_data0 = vec4<${te}>(sub_a[word_offset], sub_a[word_offset + 1], sub_a[word_offset + 2], sub_a[word_offset + 3]);
          let a_data1 = vec4<${te}>(sub_a[word_offset + 4], sub_a[word_offset + 5], sub_a[word_offset + 6], sub_a[word_offset + 7]);`;case 2:return`
          let a_data0 = vec4<${te}>(sub_a[word_offset], sub_a[word_offset + 1]);
          let a_data1 = vec4<${te}>(sub_a[word_offset + 2], sub_a[word_offset + 3]);`;case 4:return`
          let a_data0 = sub_a[word_offset];
          let a_data1 = sub_a[word_offset + 1];`;default:throw new Error(`${f}-component is not supported.`)}};return`
        var<workgroup> sub_a: array<${W.type.value}, ${w}>;
        var<workgroup> inter_results: array<array<${de.type.value}, ${x}>, ${b}>;
        ${q.declareVariables(...ee,de)}
        ${q.mainStart([x,b,1])}
          let output_indices = ${de.offsetToIndices(`workgroup_index * ${b}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let n_blocks_per_col = uniforms.b_shape[1];
          let num_tiles =  (n_blocks_per_col - 1) / ${k} + 1;

          // Loop over shared dimension.
          for (var tile: u32 = 0; tile < num_tiles; tile += 1) {
            let a_col_start = tile * ${w};
            // load one tile A data into shared memory.
            for (var a_offset = local_idx; a_offset < ${w}; a_offset += ${_})
            {
              let a_col = a_col_start + a_offset;
              if (a_col < uniforms.a_shape[2])
              {
                sub_a[a_offset] = ${W.getByIndices(`${W.type.indices}(batch, row, a_col)`)};
              } else {
                sub_a[a_offset] = ${W.type.value}(0);
              }
            }
            workgroupBarrier();

            // each thread process one block
            let b_row = col + local_id.y;
            let block = tile * ${k} + local_id.x;
            ${j?`
            let zero_point_bytes_per_col = (n_blocks_per_col + 1) / 2;
            let zero_point_byte_count = b_row * zero_point_bytes_per_col + (block >> 0x1u);
            let zero_point_word_index = zero_point_byte_count >> 0x2u;
            let zero_point_byte_offset = zero_point_byte_count & 0x3u;
            let zero_point_nibble_offset: u32 = block & 0x1u;
            let zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_nibble_offset << 2);
            let zero_point_word = ${j.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point = ${te}((zero_point_word) & 0xFu);`:`
            // The default zero point is 8 for unsigned 4-bit quantization.
            let zero_point = ${te}(8);`}
            let scale = ${ue.getByOffset("b_row * n_blocks_per_col + block")};
            let b_data = ${Z.getByIndices(`${Z.type.indices}(b_row, block, 0)`)};
            var word_offset = local_id.x * ${t.blockSize/f};
            for (var i: u32 = 0; i < ${h}; i++) {
              ${ae()}
              let b_value = ${h===1?"b_data":"b_data[i]"};
              let b_value_lower = unpack4xU8(b_value & 0x0F0F0F0Fu);
              let b_value_upper = unpack4xU8((b_value >> 4) & 0x0F0F0F0Fu);
              let b_quantized_values = mat2x4<${te}>(${Array.from({length:4},(M,P)=>`${te}(b_value_lower[${P}]), ${te}(b_value_upper[${P}])`).join(", ")});
              let b_dequantized_values = (b_quantized_values - mat2x4<${te}>(${Array(8).fill("zero_point").join(",")})) * scale;
              inter_results[local_id.y][local_id.x] += ${Array.from({length:2},(M,P)=>`${`dot(a_data${P}, b_dequantized_values[${P}])`}`).join(" + ")};
              word_offset += ${8/f};
            }
            workgroupBarrier();
          }

          if (local_idx < ${b}) {
            var output_value: ${de.type.value} = ${de.type.value}(0);
            for (var b = 0u; b < ${x}; b++) {
              output_value += inter_results[local_idx][b];
            }
            if (col + local_idx < uniforms.output_shape[2])
            {
              ${de.setByIndices(`${de.type.indices}(batch, row, col + local_idx)`,"output_value")}
            }
          }
        }`};return{name:"BlockwiseMatMulNBits32",shaderCache:{hint:`${t.blockSize};${f};${h};${x};${b}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:g,dataType:c}],dispatchGroup:{x:S},programUniforms:I}),getShaderSource:O}},mf=(e,t)=>{yl(e.inputs,t),t.blockSize===32&&e.adapterInfo.isVendor("intel")&&e.adapterInfo.isArchitecture("gen-12lp")?e.compute(wl(e.inputs,t)):e.compute(bl(e.inputs,t))},gf=e=>fe(e)}),$l,vl,xl,Sl,kl,Il,Tl,El,_f,Dg=U(()=>{J(),re(),ie(),$l=e=>{if(!e||e.length<1)throw new Error("Too few inputs");if(e[0].dataType!==1&&e[0].dataType!==10)throw new Error("Input type must be float or float16.");if(e.length>=2){let t=e[0].dims.length*2===e[1].dims[0];if(e.length===4&&(t=e[3].dims[0]*2===e[1].dims[0]),!t)throw new Error("The pads should be a 1D tensor of shape [2 * input_rank] or [2 * num_axes].")}},vl=(e,t,r)=>{let a="";for(let n=t-1;n>=0;--n)a+=`
            k = i32(${e.indicesGet("indices",n)}) - ${F("uniforms.pads",n,r)};
            if (k < 0) {
              break;
            }
            if (k >= i32(${F("uniforms.x_shape",n,t)})) {
              break;
            }
            offset += k * i32(${F("uniforms.x_strides",n,t)});
        `;return`
          value = ${e.type.value}(uniforms.constant_value);
          for (var i = 0; i < 1; i++) {
            var offset = 0;
            var k = 0;
            ${a}
            value = x[offset];
          }
      `},xl=(e,t,r)=>{let a="";for(let n=t-1;n>=0;--n)a+=`
                k = i32(${e.indicesGet("indices",n)}) - ${F("uniforms.pads",n,r)};
                if (k < 0) {
                  k = -k;
                }
                {
                  let _2n_1 = 2 * (i32(${F("uniforms.x_shape",n,t)}) - 1);
                  k = k % _2n_1;
                  if(k >= i32(${F("uniforms.x_shape",n,t)})) {
                    k = _2n_1 - k;
                  }
                }
                offset += k * i32(${F("uniforms.x_strides",n,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${a}
              value = x[offset];
          `},Sl=(e,t,r)=>{let a="";for(let n=t-1;n>=0;--n)a+=`
                k = i32(${e.indicesGet("indices",n)}) - ${F("uniforms.pads",n,r)};
                if (k < 0) {
                  k = 0;
                }
                if (k >= i32(${F("uniforms.x_shape",n,t)})) {
                  k = i32(${F("uniforms.x_shape",n,t)}) - 1;
                }
                offset += k * i32(${F("uniforms.x_strides",n,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${a}
              value = x[offset];
          `},kl=(e,t,r)=>{let a="";for(let n=t-1;n>=0;--n)a+=`
                k = i32(${e.indicesGet("indices",n)}) - ${F("uniforms.pads",n,r)};
                if (k < 0)  {
                  k += i32(${F("uniforms.x_shape",n,t)}]);
                }
                if (k >= i32(${F("uniforms.x_shape",n,t)})) {
                  k -= i32(${F("uniforms.x_shape",n,t)});
                }
                offset += k * i32(${F("uniforms.x_strides",n,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${a}
              value = x[offset];
          `},Il=(e,t,r)=>{switch(r.mode){case 0:return vl(e,t,r.pads.length);case 1:return xl(e,t,r.pads.length);case 2:return Sl(e,t,r.pads.length);case 3:return kl(e,t,r.pads.length);default:throw new Error("Invalid mode")}},Tl=(e,t)=>{let r=C.padShape(e[0].dims.slice(),t.pads),a=e[0].dims,n=C.size(r),i=[{type:12,data:n},{type:6,data:t.pads}],s=e.length>=3&&e[2].data;t.mode===0&&i.push({type:s?e[2].dataType:1,data:t.value}),i.push(...X(e[0].dims,r));let u=["rank"],d=l=>{let c=H("output",e[0].dataType,r.length),f=R("x",e[0].dataType,a.length),h=f.type.value,g=Il(c,a.length,t),_=[{name:"output_size",type:"u32"},{name:"pads",type:"i32",length:t.pads.length}];return t.mode===0&&_.push({name:"constant_value",type:s?h:"f32"}),`
            ${l.registerUniforms(_).declareVariables(f,c)}
            ${l.mainStart()}
            ${l.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

            let indices = ${c.offsetToIndices("global_idx")};

            var value = ${h}(0);
            ${g}
            output[global_idx] = value;
        }`};return{name:"Pad",shaderCache:{hint:`${t.mode}${s}`,inputDependencies:u},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(C.size(r)/64)},programUniforms:i}),getShaderSource:d}},El=(e,t)=>{if(e.length>1){let r=e[1].getBigInt64Array(),a=e.length>=3&&e[2].data?e[2].dataType===10?e[2].getUint16Array()[0]:e[2].getFloat32Array()[0]:0,n=e[0].dims.length,i=new Int32Array(2*n).fill(0);if(e.length>=4){let u=e[3].getBigInt64Array();for(let d=0;d<u.length;d++)i[Number(u[d])]=Number(r[d]),i[Number(u[d])+n]=Number(r[d+u.length])}else r.forEach((u,d)=>i[Number(d)]=Number(u));let s=[];return i.forEach(u=>s.push(u)),{mode:t.mode,value:a,pads:s}}else return t},_f=(e,t)=>{$l(e.inputs);let r=El(e.inputs,t);e.compute(Tl(e.inputs,r),{inputs:[0]})}}),or,na,sa,oa,ua,zl,Cl,la,da,yf,bf,pa,wf,$f,ca,vf,xf,Sf,kf,Ng=U(()=>{et(),J(),re(),ie(),or=e=>{if(be.webgpu.validateInputContent&&(!e||e.length!==1))throw new Error("Pool ops requires 1 input.")},na=(e,t,r)=>{let a=t.format==="NHWC",n=e.dims.slice();a&&n.splice(1,0,n.pop());let i=Object.hasOwnProperty.call(t,"dilations"),s=t.kernelShape.slice(),u=t.strides.slice(),d=i?t.dilations.slice():[],l=t.pads.slice();Zr.adjustPoolAttributes(r,n,s,u,d,l);let c=Zr.computePoolOutputShape(r,n,u,d,s,l,t.autoPad),f=Object.assign({},t);i?Object.assign(f,{kernelShape:s,strides:u,pads:l,dilations:d,cacheKey:t.cacheKey}):Object.assign(f,{kernelShape:s,strides:u,pads:l,cacheKey:t.cacheKey});let h=c.slice();return h.push(h.splice(1,1)[0]),[f,a?h:c]},sa=(e,t)=>{let r=t.format==="NHWC",a=C.size(e),n=C.size(t.kernelShape),i=[{type:12,data:a},{type:12,data:n}],s=[{name:"outputSize",type:"u32"},{name:"kernelSize",type:"u32"}];if(t.kernelShape.length<=2){let u=t.kernelShape[t.kernelShape.length-1],d=t.strides[t.strides.length-1],l=t.pads[t.pads.length/2-1],c=t.pads[t.pads.length-1],f=!!(l+c);i.push({type:12,data:u},{type:12,data:d},{type:12,data:l},{type:12,data:c}),s.push({name:"kw",type:"u32"},{name:"sw",type:"u32"},{name:"pwStart",type:"u32"},{name:"pwEnd",type:"u32"});let h=!1;if(t.kernelShape.length===2){let g=t.kernelShape[t.kernelShape.length-2],_=t.strides[t.strides.length-2],b=t.pads[t.pads.length/2-2],x=t.pads[t.pads.length-2];h=!!(b+x),i.push({type:12,data:g},{type:12,data:_},{type:12,data:b},{type:12,data:x}),s.push({name:"kh",type:"u32"},{name:"sh",type:"u32"},{name:"phStart",type:"u32"},{name:"phEnd",type:"u32"})}return[i,s,!0,f,h]}else{if(r)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let u=C.computeStrides(t.kernelShape);i.push({type:12,data:u},{type:12,data:t.pads},{type:12,data:t.strides}),s.push({name:"kernelStrides",type:"u32",length:u.length},{name:"pads",type:"u32",length:t.pads.length},{name:"strides",type:"u32",length:t.strides.length});let d=t.pads.reduce((l,c)=>l+c);return[i,s,!!d,!1,!1]}},oa=(e,t,r,a,n,i,s,u,d,l,c,f)=>{let h=n.format==="NHWC",g=t.type.value,_=H("output",t.type.tensor,a);if(n.kernelShape.length<=2){let b="",x="",$="",w=r-(h?2:1);if(c?b=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${w}] = indices[${w}] * uniforms.sw - uniforms.pwStart + i;
                  if (xIndices[${w}] < 0 || xIndices[${w}]
                      >= uniforms.x_shape[${w}]) {
                    pad++;
                    continue;
                  }
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${i}
                }`:b=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${w}] = indices[${w}] * uniforms.sw - uniforms.pwStart + i;
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${i}
                }`,n.kernelShape.length===2){let k=r-(h?3:2);f?x=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${k}] = indices[${k}] * uniforms.sh - uniforms.phStart + j;
                  if (xIndices[${k}] < 0 || xIndices[${k}] >= uniforms.x_shape[${k}]) {
                    pad += i32(uniforms.kw);
                    continue;
                  }
              `:x=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${k}] = indices[${k}] * uniforms.sh - uniforms.phStart + j;
                `,$=`
              }
            `}return`
            ${e.registerUniforms(d).declareVariables(t,_)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

              let indices = ${_.offsetToIndices("global_idx")};
              var xIndices = ${_.offsetToIndices("global_idx")};

              var value = ${g}(${u});
              var pad = 0;
              ${x}
              ${b}
              ${$}
              ${s}

              output[global_idx] = value;
            }`}else{if(h)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let b=n.kernelShape.length,x=n.pads.length,$="";return l?$=`
                if (xIndices[j] >= uniforms.x_shape[j]) {
                  pad++;
                  isPad = true;
                  break;
                }
              }
              if (!isPad) {
                let x_val = x[${t.indicesToOffset("xIndices")}];
                ${i}
              }`:$=`
              }
              let x_val = x[${t.indicesToOffset("xIndices")}];
              ${i}
            `,`
            ${e.registerUniforms(d).declareVariables(t,_)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
              let indices = ${_.offsetToIndices("global_idx")};
              var xIndices = ${_.offsetToIndices("global_idx")};

              var offsets: array<u32, ${b}>;

              var value = ${g}(${u});
              var pad = 0;
              var isPad = false;

              for (var i: u32 = 0u; i < uniforms.kernelSize; i++) {
                var offset = i;
                for (var j = 0u; j < ${b-1}u; j++) {
                  offsets[j] = offset / ${F("uniforms.kernelStrides","j",b)};
                  offset -= offsets[j] * ${F("uniforms.kernelStrides","j",b)};
                }
                offsets[${b-1}] = offset;

                isPad = false;
                for (var j = ${r-b}u; j < ${r}u; j++) {
                  xIndices[j] = indices[j] * ${F("uniforms.strides",`j - ${r-b}u`,b)}
                    + offsets[j - ${r-b}u] - ${F("uniforms.pads","j - 2u",x)};
                  ${$}
              }
              ${s}

              output[global_idx] = value;
            }`}},ua=e=>`${e.format};${e.ceilMode};${e.autoPad};${e.kernelShape.length}`,zl=e=>`${ua(e)};${e.countIncludePad}`,Cl=e=>`${ua(e)};${e.storageOrder};${e.dilations}`,la=e=>({format:e.format,autoPad:["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],ceilMode:e.ceil_mode,kernelShape:e.kernel_shape,strides:e.strides,pads:e.pads}),da=(e,t,r,a)=>{let[n,i]=na(t,a,r),s=R("x",t.dataType,t.dims.length),u=s.type.value,d="value += x_val;",l="";n.countIncludePad?l+=`value /= ${u}(uniforms.kernelSize);`:l+=`value /= ${u}(i32(uniforms.kernelSize) - pad);`;let[c,f,h,g,_]=sa(i,n);c.push(...X(t.dims,i));let b=["rank"];return{name:e,shaderCache:{hint:`${a.cacheKey};${h};${g};${_}`,inputDependencies:b},getRunData:()=>({outputs:[{dims:i,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(C.size(i)/64)},programUniforms:c}),getShaderSource:x=>oa(x,s,t.dims.length,i.length,n,d,l,0,f,h,g,_)}},yf=e=>{let t=e.count_include_pad!==0,r=la(e);if(r.ceilMode!==0)throw new Error("using ceil() in shape computation is not yet supported for AveragePool");let a={countIncludePad:t,...r,cacheKey:""};return{...a,cacheKey:zl(a)}},bf=(e,t)=>{or(e.inputs),e.compute(da("AveragePool",e.inputs[0],!1,t))},pa={autoPad:"",ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[]},wf=e=>{let t=e.format;return{format:t,...pa,cacheKey:t}},$f=(e,t)=>{or(e.inputs),e.compute(da("GlobalAveragePool",e.inputs[0],!0,t))},ca=(e,t,r,a)=>{let[n,i]=na(t,a,r),s=`
      value = max(x_val, value);
    `,u="",d=R("x",t.dataType,t.dims.length),l=["rank"],[c,f,h,g,_]=sa(i,n);return c.push(...X(t.dims,i)),{name:e,shaderCache:{hint:`${a.cacheKey};${h};${g};${_}`,inputDependencies:l},getRunData:()=>({outputs:[{dims:i,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(C.size(i)/64)},programUniforms:c}),getShaderSource:b=>oa(b,d,t.dims.length,i.length,n,s,u,t.dataType===10?-65504:-1e5,f,h,g,_)}},vf=(e,t)=>{or(e.inputs),e.compute(ca("MaxPool",e.inputs[0],!1,t))},xf=e=>{let t=e.storage_order,r=e.dilations,a=la(e);if(t!==0)throw new Error("column major storage order is not yet supported for MaxPool");if(a.ceilMode!==0)throw new Error("using ceil() in shape computation is not yet supported for MaxPool");let n={storageOrder:t,dilations:r,...a,cacheKey:""};return{...n,cacheKey:Cl(n)}},Sf=e=>{let t=e.format;return{format:t,...pa,cacheKey:t}},kf=(e,t)=>{or(e.inputs),e.compute(ca("GlobalMaxPool",e.inputs[0],!0,t))}}),Al,Ol,If,Tf,Pg=U(()=>{J(),re(),ve(),ie(),Al=(e,t)=>{if(e.length<2||e.length>3)throw new Error("DequantizeLinear requires 2 or 3 inputs.");if(e.length===3&&e[1].dims===e[2].dims)throw new Error("x-scale and x-zero-point must have the same shape.");if(e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[0].dataType===6&&e.length>2)throw new Error("In the case of dequantizing int32 there is no zero point.");if(e[1].dims.length!==0&&e[1].dims.length!==1&&e[1].dims.length!==e[0].dims.length)throw new Error("scale input must be a scalar, a 1D tensor, or have the same rank as the input tensor.");if(e.length>2){if(e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==e[2].dims.length)throw new Error("scale and zero-point inputs must have the same rank.");if(!e[1].dims.map((r,a)=>r===e[2].dims[a]).reduce((r,a)=>r&&a,!0))throw new Error("scale and zero-point inputs must have the same shape.")}if(t.blockSize>0){if(e[1].dims.length===0||e[1].dims.length===1&&e[1].dims[0]===1)throw new Error("blockSize must be set only for block quantization.");if(!e[1].dims.map((n,i)=>i===t.axis||n===e[0].dims[i]).reduce((n,i)=>n&&i,!0))throw new Error("For block qunatization, scale input shape to match the input shape except for the axis");if(e[1].dims.length!==e[0].dims.length)throw new Error("For block qunatization the scale input rank must be the same as the x rank.");let r=e[0].dims[t.axis],a=e[1].dims[t.axis];if(t.blockSize<Math.ceil(r/a)||t.blockSize>Math.ceil(r/(a-1)-1))throw new Error("blockSize must be with in the range [ceil(dI / Si), ceil(dI / (Si - 1) - 1)].")}},Ol=(e,t)=>{let r=C.normalizeAxis(t.axis,e[0].dims.length),a=e[0].dataType,n=a===3,i=e[0].dims,s=e[1].dataType,u=C.size(i),d=a===3||a===2,l=d?[Math.ceil(C.size(e[0].dims)/4)]:e[0].dims,c=e[1].dims,f=e.length>2?e[2]:void 0,h=f?d?[Math.ceil(C.size(f.dims)/4)]:f.dims:void 0,g=c.length===0||c.length===1&&c[0]===1,_=g===!1&&c.length===1,b=$e(u),x=g&&(!d||b===4),$=x?b:1,w=x&&!d?b:1,k=R("input",d?12:a,l.length,w),S=R("scale",s,c.length),I=f?R("zero_point",d?12:a,h.length):void 0,E=H("output",s,i.length,$),z=[k,S];I&&z.push(I);let A=[l,c];f&&A.push(h);let O=[{type:12,data:u/$},{type:12,data:r},{type:12,data:t.blockSize},...X(...A,i)],q=K=>{let W=[{name:"output_size",type:"u32"},{name:"axis",type:"u32"},{name:"block_size",type:"u32"}];return`
      ${K.registerUniforms(W).declareVariables(...z,E)}
      ${K.mainStart()}
          ${K.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let output_indices = ${E.offsetToIndices("global_idx")};

          // Set input x
          ${d?`
            let input = ${k.getByOffset("global_idx / 4")};
            let x_vec = ${n?"unpack4xI8(input)":"unpack4xU8(input)"};
            let x_value = ${$===1?"x_vec[global_idx % 4]":"x_vec"};`:`let x_value = ${k.getByOffset("global_idx")};`};

          // Set scale input
          ${g?`let scale_value= ${S.getByOffset("0")}`:_?`
            let scale_index = ${E.indicesGet("output_indices","uniforms.axis")};
            let scale_value= ${S.getByOffset("scale_index")};`:`
            var scale_indices: ${S.type.indices} = output_indices;
            let index = ${S.indicesGet("scale_indices","uniforms.axis")} / uniforms.block_size;
            ${S.indicesSet("scale_indices","uniforms.axis","index")};
            let scale_value= ${S.getByIndices("scale_indices")};`};

          // Set zero-point input
          ${I?g?d?`
                let zero_point_input = ${I.getByOffset("0")};
                let zero_point_vec =  ${n?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value= zero_point_vec[0]`:`let zero_point_value = ${I.getByOffset("0")}`:_?d?`
                let zero_point_index = ${E.indicesGet("output_indices","uniforms.axis")};
                let zero_point_input = ${I.getByOffset("zero_point_index / 4")};
                let zero_point_vec =  ${n?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_index % 4]`:`
                let zero_point_index = ${E.indicesGet("output_indices","uniforms.axis")};
                let zero_point_value = ${I.getByOffset("zero_point_index")};`:d?`
                let zero_point_offset = ${S.indicesToOffset("scale_indices")};
                let zero_point_input = ${I.getByOffset("zero_point_offset / 4")};
                let zero_point_vec = ${n?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_offset % 4];`:`let zero_point_value = ${I.getByIndices("scale_indices")};`:`let zero_point_value = ${d?n?"i32":"u32":k.type.value}(0);`};
      // Compute and write output
      ${E.setByOffset("global_idx",`${E.type.value}(x_value - zero_point_value) * scale_value`)};
      }`};return{name:"DequantizeLinear",shaderCache:{hint:t.cacheKey,inputDependencies:I?["rank","rank","rank"]:["rank","rank"]},getShaderSource:q,getRunData:()=>({outputs:[{dims:i,dataType:s}],dispatchGroup:{x:Math.ceil(u/$/64),y:1,z:1},programUniforms:O})}},If=(e,t)=>{Al(e.inputs,t),e.compute(Ol(e.inputs,t))},Tf=e=>fe({axis:e.axis,blockSize:e.blockSize})}),Bl,Rl,Ef,Ug=U(()=>{et(),J(),ie(),Bl=(e,t,r)=>{let a=e===t,n=e<t&&r<0,i=e>t&&r>0;if(a||n||i)throw new Error("Range these inputs' contents are invalid.")},Rl=(e,t,r,a)=>{let n=Math.abs(Math.ceil((t-e)/r)),i=[n],s=n,u=[{type:12,data:s},{type:a,data:e},{type:a,data:r},...X(i)],d=l=>{let c=H("output",a,i.length),f=c.type.value,h=[{name:"outputSize",type:"u32"},{name:"start",type:f},{name:"delta",type:f}];return`
        ${l.registerUniforms(h).declareVariables(c)}
        ${l.mainStart()}
        ${l.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        output[global_idx] = uniforms.start + ${f}(global_idx) * uniforms.delta;
      }`};return{name:"Range",shaderCache:{hint:`${a}`},getShaderSource:d,getRunData:()=>({outputs:[{dims:i,dataType:a}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:u})}},Ef=e=>{let t=0,r=0,a=0;e.inputs[0].dataType===6?(t=e.inputs[0].getInt32Array()[0],r=e.inputs[1].getInt32Array()[0],a=e.inputs[2].getInt32Array()[0]):e.inputs[0].dataType===1&&(t=e.inputs[0].getFloat32Array()[0],r=e.inputs[1].getFloat32Array()[0],a=e.inputs[2].getFloat32Array()[0]),be.webgpu.validateInputContent&&Bl(t,r,a),e.compute(Rl(t,r,a,e.inputs[0].dataType),{inputs:[]})}}),Ml,fa,ha,Dl,zf,Cf,qg=U(()=>{J(),re(),ve(),ie(),Ml=(e,t,r,a)=>{if(e!=="none"&&a!=="i32"&&a!=="u32"&&a!=="f32")throw new Error(`Input ${a} is not supported with reduction ${e}.`);let n=`{
                var oldValue = 0;
                loop {
                  let newValueF32 =`,i=`;
                  let newValue = bitcast<i32>(newValueF32);
                  let res = atomicCompareExchangeWeak(&${t}, oldValue, newValue);
                  if res.exchanged {
                    break;
                  }
                  oldValue = res.old_value;
                }
              }`;switch(e){case"none":return`${t}=${r};`;case"add":return a==="i32"||a==="u32"?`atomicAdd(&${t}, bitcast<${a}>(${r}));`:`
              ${n}bitcast<${a}>(oldValue) + (${r})${i}`;case"max":return a==="i32"||a==="u32"?`atomicMax(&${t}, bitcast<${a}>(${r}));`:`
                ${n}max(bitcast<f32>(oldValue), (${r}))${i}`;case"min":return a==="i32"||a==="u32"?`atomicMin(&${t}, bitcast<${a}>(${r}));`:`${n}min(bitcast<${a}>(oldValue), (${r}))${i}`;case"mul":return`${n}(bitcast<${a}>(oldValue) * (${r}))${i}`;default:throw new Error(`Reduction ${e} is not supported.`)}},fa=(e,t)=>`${e===1?`
    let element_count_dim = uniforms.output_strides;
    let dim_value = uniforms.output_shape;`:`
    let element_count_dim = uniforms.output_strides[${t?"i - indices_start":"i"}];
    let dim_value = uniforms.output_shape[${t?"i - indices_start":"i"} + uniforms.last_index_dimension];`}
    
    if (index >= 0) {
      if (index >= i32(dim_value)) {
        index = i32(dim_value - 1);
      }
    } else {
      if (index < -i32(dim_value)) {
        index = 0;
      } else {
        index += i32(dim_value);
      }
    }
    data_offset += u32((u32(index) * element_count_dim));`,ha=(e,t,r)=>`for (var i = 0u; i < uniforms.num_updates_elements; i++) {
        let value = updates[uniforms.num_updates_elements * ${r?"global_idx":"idx"} + i];
        ${Ml(e.reduction,"output[data_offset + i]","value",t)}
      }`,Dl=(e,t)=>{let r=e[0].dims,a=e[1].dims,n=r,i=1,s=Math.ceil(C.size(a)/i),u=a[a.length-1],d=C.sizeFromDimension(r,u),l=C.sizeFromDimension(a,0)/u,c=[{type:12,data:s},{type:12,data:u},{type:12,data:d},...X(e[1].dims,e[2].dims,n)],f=h=>{let g=R("indices",e[1].dataType,e[1].dims.length),_=R("updates",e[2].dataType,e[2].dims.length,i),b=t.reduction!=="none"&&t.reduction!==""?ip("output",e[0].dataType,n.length):H("output",e[0].dataType,n.length,i);return`
      ${h.registerUniform("output_size","u32").registerUniform("last_index_dimension","u32").registerUniform("num_updates_elements","u32").declareVariables(g,_,b)}
      ${h.mainStart()}
        ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
  var hasDuplicates = false;
  if (${t.reduction==="none"}) {
    for (var i = 0; i < ${l}; i = i + 1) {
      for (var j = i + 1; j < ${l}; j = j + 1) {
        var index_i = i32(indices[i].x);
        var index_j = i32(indices[j].x);
        if (index_i == index_j) {
          hasDuplicates = true;
          break;
        }
      }
      if (hasDuplicates) {
        break;
      }
    }
  }

  if (${t.reduction==="none"} && hasDuplicates) {
    if (global_idx != 0u) {
      return;
    }
    // Process each index-update pair individually when duplicates exist
    for (var idx = 0u; idx < ${l}u; idx++) {
      var data_offset = 0u;
      for (var i = 0u; i < uniforms.last_index_dimension; i++) {
        var index = i32(indices[idx * uniforms.last_index_dimension + i].x);
        ${fa(r.length,!1)}
      }
      ${ha(t,b.type.value,!1)}
    }
    return;
  }

  var data_offset = 0u;
  var indices_start = uniforms.last_index_dimension * global_idx;
  var indices_end = indices_start + uniforms.last_index_dimension;
  for (var i = indices_start; i < indices_end; i++) {
    var index = i32(indices[i].x);
    ${fa(r.length,!0)}
  }
  ${ha(t,b.type.value,!0)}
  }`};return{name:"ScatterND",shaderCache:{hint:`${t.cacheKey}_${t.reduction}`,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:c}),getShaderSource:f}},zf=e=>fe({reduction:e.reduction}),Cf=(e,t)=>{e.compute(Dl(e.inputs,t),{inputs:[e.inputs[1],e.inputs[2]],outputs:[]})}}),Nl,Pl,Ul,ma,ql,Wl,Ll,Vl,jl,Gl,Hl,Fl,ga,Kl,Zl,Ql,Xl,Yl,Af,Of,Wg=U(()=>{J(),re(),ve(),ie(),Nl=(e,t)=>{if(e.every(r=>r>0||(()=>{throw new Error("Resize requires scales input values to be positive")})),e.length>0){if(t.mode==="linear"){if(!(e.length===2||e.length===3||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1||e.length===5&&e[0]===1&&e[1]===1))throw new Error(`For linear mode, Resize requires scales to be 2D, 3D, 4D with either two outermost or one innermost and
            one outermost scale values equal to 1, or 5D with two outermost scale values equal to 1`)}else if(t.mode==="cubic"&&!(e.length===2||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1))throw new Error("Resize requires scales input size to be 2 or 4 for cubic mode")}},Pl=(e,t,r)=>{t.every(n=>n>=0&&n<r||(()=>{throw new Error("Resize requires axes input values to be positive and less than rank")}));let a=new Array(r).fill(1);return t.forEach((n,i)=>a[n]=e[i]),a},Ul=(e,t,r,a,n,i)=>{let[s,u,d]=r>10?[1,2,3]:[-1,e.length>1?1:-1,-1],l=e[0].dims.length;if(s>0&&e.length>s&&e[s].dims.length>0)e[s].getFloat32Array().forEach(c=>i.push(c));else if(t.coordinateTransformMode==="tf_crop_and_resize")throw new Error("Resize requires RoI input to be specified when coordinateTransformMode is tfCropAndResize");if(u>0&&e.length>u&&e[u].dims.length===1&&e[u].dims[0]>0){if(e[u].getFloat32Array().forEach(c=>a.push(c)),a.length!==0&&a.length!==l&&r>=18&&a.length!==t.axes.length)throw new Error("Resize requires scales input size to be same as input rank or axes size for opset 18 and up");Nl(a,t),t.axes.length>0&&Pl(a,t.axes,l).forEach((c,f)=>a[f]=c)}if(d>0&&e.length>d&&e[d].dims.length===1&&e[d].dims[0]>0&&(e[d].getBigInt64Array().forEach(c=>n.push(Number(c))),n.length!==0&&n.length!==l&&r>=18&&n.length!==t.axes.length))throw new Error("Resize requires sizes input size to be same as input rank or axes size for opset 18 and up");if(t.axes.length>0){if(a.length!==0&&a.length!==t.axes.length)throw new Error('Resize requires "scales" input size to be of axes rank when axes attributes is specified');if(n.length!==0&&n.length!==t.axes.length)throw new Error('Resize requires "sizes" input size to be of rank axes rank when axes attributes is specified')}if(typeof a<"u"&&typeof n<"u"&&a.length>0&&n.length>l)throw new Error("Resize requires only of scales or sizes to be specified")},ma=(e,t,r,a)=>`
  // The whole part and the fractional part are calculated separately due to inaccuracy of floating
  // point division. As an example, f32(21) / f32(7) may evaluate to 2.99... instead of 3, causing an
  // offset-by-one error later in floor().
  let big = (${e}) * (${t});
  let whole = ${a}(big / (${r}));
  let fract = ${a}(big % (${r})) / ${a}(${r});
  return whole + fract;
`,ql=(e,t)=>`fn getOriginalCoordinateFromResizedCoordinate(xResized: u32, xScale: f32, lengthResized: u32,
     lengthOriginal: u32, roiStart: f32, roiEnd: f32) -> ${t} { `+(()=>{switch(e){case"asymmetric":return`
          if (xScale < 1.0 || floor(xScale) != xScale) {
            return ${t}(xResized) / ${t}(xScale);
          } else {
            ${ma("xResized","lengthOriginal","lengthResized",t)}
          }
        `;case"pytorch_half_pixel":return`if (lengthResized > 1) {
                    return (${t}(xResized) + 0.5) / ${t}(xScale) - 0.5;
                  } else {
                    return 0.0;
                  }`;case"tf_half_pixel_for_nn":return`return (${t}(xResized) + 0.5) / ${t}(xScale);`;case"align_corners":return`if (lengthResized == 1) {
                    return 0.0;
                  } else {
                    ${ma("xResized","lengthOriginal - 1","lengthResized - 1",t)}
                  }`;case"tf_crop_and_resize":return`if (lengthResized > 1) {
                    return ${t}(roiStart) * ${t}(lengthOriginal - 1) +
                        (${t}(xResized) * ${t}(roiEnd - roiStart) * ${t}(lengthOriginal - 1)) /
                        ${t}(lengthResized - 1);
                  } else {
                    return 0.5 * ${t}(roiStart + roiEnd) * ${t}(lengthOriginal - 1);
                  }`;case"half_pixel_symmetric":return`const outputWidth = ${t}xScale * ${t}(lengthResized);
                  const adjustment = ${t}(lengthResized) / outputWidth;
                  const center = ${t}(lengthOriginal) / 2;
                  const offset = center * (1 - adjustment);
                  return offset + ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;case"half_pixel":return`return ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;default:throw new Error(`Coordinate transform mode ${e} is not supported`)}})()+"}",Wl=(e,t,r)=>`fn getNearestPixelFromOriginal(xOriginal: ${r}, isDownSample: bool) -> ${r} {`+(()=>{switch(e){case"round_prefer_ceil":return"if (fract(xOriginal) == 0.5) {             return ceil(xOriginal);           } else {             return round(xOriginal);           }";case"floor":return"return floor(xOriginal);";case"ceil":return"return ceil(xOriginal);";case"round_prefer_floor":return"if (fract(xOriginal) == 0.5) {                     return floor(xOriginal);                   } else {                     return round(xOriginal);                   }";case"simple":default:if(t<11)return"if (isDownSample)                     {                       return ceil(xOriginal);                     } else {                       return xOriginal;                     }";throw new Error(`Nearest mode ${e} is not supported`)}})()+"}",Ll=(e,t,r)=>{let a=new Array(r).fill(0).concat(new Array(r).fill(1)),n=e.length===0?a:e.slice();return t.length>0?(t.forEach((i,s)=>{a[i]=n[s],a[s+r]=n[t.length+s]}),a):n},Vl=(e,t,r,a)=>{let n=[];if(r.length>0)if(a.length>0){if(e.forEach(i=>n.push(i)),Math.max(...a)>e.length)throw new Error("axes is out of bound");a.forEach((i,s)=>n[i]=r[s])}else r.forEach(i=>n.push(i));else{if(t.length===0)throw new Error("Resize requires either scales or sizes.");n=e.map((i,s)=>Math.round(i*t[s]))}return n},jl=(e,t,r)=>{let a=(()=>{switch(r.keepAspectRatioPolicy){case"not_larger":return r.axes.length>0?Math.min(...r.axes.map(i=>t[i]),Number.MAX_VALUE):Math.min(...t,Number.MAX_VALUE);case"not_smaller":return r.axes.length>0?Math.max(...r.axes.map(i=>t[i]),Number.MIN_VALUE):Math.max(...t,Number.MIN_VALUE);default:throw new Error(`Keep aspect ratio policy ${r.keepAspectRatioPolicy} is not supported`)}})();t.fill(1,0,t.length);let n=e.slice();return r.axes.length>0?(r.axes.forEach(i=>t[i]=a),r.axes.forEach(i=>n[i]=Math.round(e[i]*t[i]))):(t.fill(a,0,t.length),n.forEach((i,s)=>n[s]=Math.round(i*t[s]))),n},Gl=(e,t,r,a,n)=>`
    fn calculateOriginalIndicesFromOutputIndices(output_indices: ${e.type.indices}) -> array<${e.type.value}, ${r.length}> {
      var original_indices: array<${e.type.value}, ${r.length}>;
      for (var i:u32 = 0; i < ${r.length}; i++) {
        var output_index = ${e.indicesGet("output_indices","i")};
        var scale = ${F("uniforms.scales","i",a)};
        var roi_low = ${F("uniforms.roi","i",n)};
        var roi_hi = ${F("uniforms.roi",`i + ${t.length}`,n)};
        if (scale == 1.0) {
          original_indices[i] = ${e.type.value}(output_index);
        } else {
          var input_shape_i = ${F("uniforms.input_shape","i",t.length)};
          var output_shape_i = ${F("uniforms.output_shape","i",r.length)};
          original_indices[i] = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                           input_shape_i, roi_low, roi_hi);
        }
      }
      return original_indices;
    }`,Hl=(e,t,r,a,n,i,s)=>`
    fn calculateInputIndicesFromOutputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
      var input_indices: ${e.type.indices};
      for (var i:u32 = 0; i < ${a.length}; i++) {
        var output_index = ${t.indicesGet("output_indices","i")};
        var input_index: u32;
        var scale = ${F("uniforms.scales","i",n)};
        if (scale == 1.0) {
          input_index = output_index;
        } else {
          var roi_low = ${F("uniforms.roi","i",i)};
          var roi_hi = ${F("uniforms.roi",`i + ${r.length}`,i)};
          var input_shape_i = ${F("uniforms.input_shape","i",r.length)};
          var output_shape_i = ${F("uniforms.output_shape","i",a.length)};
          var original_idx = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                        input_shape_i, roi_low, roi_hi);
          if (!${s} || (original_idx >= 0 && original_idx < ${t.type.value}(input_shape_i))) {
            if (original_idx < 0) {
              input_index = 0;
            } else if (original_idx > ${t.type.value}(input_shape_i - 1)) {
              input_index = input_shape_i - 1;
            } else {
              input_index = u32(getNearestPixelFromOriginal(original_idx, scale < 1));
            }
          } else {
            input_index = u32(original_idx);
          }
        }
        ${e.indicesSet("input_indices","i","input_index")}
      }
      return input_indices;
    }`,Fl=(e,t)=>`
    fn checkInputIndices(input_indices: ${e.type.indices}) -> bool {
      for (var i:u32 = 0; i < ${t.length}; i++) {
        var input_index = ${e.indicesGet("input_indices","i")};
        if (input_index < 0 || input_index >= ${F("uniforms.input_shape","i",t.length)}) {
          return false;
        }
      }
      return true;
    }`,ga=(e,t,r,a)=>e.rank>a?`
    ${e.indicesSet("input_indices",t,"channel")};
    ${e.indicesSet("input_indices",r,"batch")};
`:"",Kl=(e,t,r,a,n)=>{let[i,s,u,d]=r.length===2?[-1,0,1,-1]:[0,2,3,1],l=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, row: u32, col: u32) -> ${l} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",s,`max(0, min(row, ${r[s]} - 1))`)};
      ${e.indicesSet("input_indices",u,`max(0, min(col, ${r[u]} - 1))`)};
      ${ga(e,d,i,2)}
      return ${e.getByIndices("input_indices")};
    }

    fn bilinearInterpolation(output_indices: ${t.type.indices}) -> ${l} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var row:${l} = originalIndices[${s}];
      var col:${l} = originalIndices[${u}];
      ${a?`if (row < 0 || row > (${r[s]} - 1) || col < 0 || col > (${r[u]} - 1)) {
        return ${n};
      }`:""};
      row = max(0, min(row, ${r[s]} - 1));
      col = max(0, min(col, ${r[u]} - 1));
      var row1: u32 = u32(row);
      var col1: u32 = u32(col);
      var row2: u32 = u32(row + 1);
      var col2: u32 = u32(col + 1);
      var channel: u32 = ${r.length>2?`u32(originalIndices[${d}])`:"0"};
      var batch: u32 =  ${r.length>2?`u32(originalIndices[${i}])`:"0"};
      var x11: ${l} = getInputValue(batch, channel, row1, col1);
      var x12: ${l} = getInputValue(batch, channel, row1, col2);
      var x21: ${l} = getInputValue(batch, channel, row2, col1);
      var x22: ${l} = getInputValue(batch, channel, row2, col2);
      var dx1: ${l} = abs(row - ${l}(row1));
      var dx2: ${l} = abs(${l}(row2) - row);
      var dy1: ${l} = abs(col - ${l}(col1));
      var dy2: ${l} = abs(${l}(col2) - col);
      if (row1 == row2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (col1 == col2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      return (x11 * dx2 * dy2 + x12 * dx2 * dy1 + x21 * dx1 * dy2 + x22 * dx1 * dy1);
    }`},Zl=(e,t,r,a,n,i,s,u,d,l)=>{let c=r.length===2,[f,h]=c?[0,1]:[2,3],g=e.type.value,_=b=>{let x=b===f?"row":"col";return`
      fn ${x}CubicInterpolation(input_indices: ${e.type.indices}, output_indices: ${t.type.indices}) -> ${g} {
        var output_index = ${t.indicesGet("output_indices",b)};
        var originalIdx: ${g} = getOriginalCoordinateFromResizedCoordinate(output_index, ${n[b]},
        ${a[b]}, ${r[b]}, ${i[b]}, ${i[b]} + ${r.length});
        var fractOriginalIdx: ${g} = originalIdx - floor(originalIdx);
        var coefs = getCubicInterpolationCoefs(fractOriginalIdx);

        if (${u} && (originalIdx < 0 || originalIdx > (${r[b]} - 1))) {
          return ${d};
        }
        var data: array<${g}, 4> = array<${g}, 4>(0.0, 0.0, 0.0, 0.0);
        for (var i: i32 = -1; i < 3; i++) {
          var ${x}: ${g} = originalIdx + ${g}(i);
          if (${x} < 0 || ${x} >= ${r[b]}) {
            ${l?`coefs[i + 1] = 0.0;
                        continue;`:u?`return ${d};`:`${x} = max(0, min(${x}, ${r[b]} - 1));`};
          }
        var input_indices_copy: ${e.type.indices} = input_indices;
          ${e.indicesSet("input_indices_copy",b,`u32(${x})`)};
          data[i + 1] = ${b===f?e.getByIndices("input_indices_copy"):"rowCubicInterpolation(input_indices_copy, output_indices)"};
        }
        return cubicInterpolation1D(data, coefs);
      }`};return`
    ${_(f)};
    ${_(h)};
  fn getCubicInterpolationCoefs(s: ${g}) -> array<${g}, 4> {
    var absS = abs(s);
    var coeffs: array<${g}, 4> = array<${g}, 4>(0.0, 0.0, 0.0, 0.0);
    var oneMinusAbsS: ${g} = 1.0 - absS;
    var twoMinusAbsS: ${g} = 2.0 - absS;
    var onePlusAbsS: ${g} = 1.0 + absS;
    coeffs[0] = ((${s} * onePlusAbsS - 5 * ${s}) * onePlusAbsS + 8 * ${s}) * onePlusAbsS - 4 * ${s};
    coeffs[1] = ((${s} + 2) * absS - (${s} + 3)) * absS * absS + 1;
    coeffs[2] = ((${s} + 2) * oneMinusAbsS - (${s} + 3)) * oneMinusAbsS * oneMinusAbsS + 1;
    coeffs[3] = ((${s} * twoMinusAbsS - 5 * ${s}) * twoMinusAbsS + 8 * ${s}) * twoMinusAbsS - 4 * ${s};
    return coeffs;
  }

  fn cubicInterpolation1D(x: array<${g}, 4>, coefs: array<${g}, 4>) -> ${g} {
    var coefsSum: ${g} = coefs[0] + coefs[1] + coefs[2] + coefs[3];
    return (x[0] * coefs[0] + x[1] * coefs[1]+ x[2] * coefs[2]+ x[3] * coefs[3]) / coefsSum;
  }

  fn bicubicInterpolation(output_indices: ${t.type.indices}) -> ${g} {
    var input_indices: ${e.type.indices} = output_indices;
    return colCubicInterpolation(input_indices, output_indices);
  }
    `},Ql=(e,t,r,a,n)=>{let[i,s,u,d,l]=r.length===3?[-1,0,1,2,-1]:[0,2,3,4,1],c=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, depth:u32, height: u32, width: u32) -> ${c} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",s,`max(0, min(depth, ${r[s]} - 1))`)};
      ${e.indicesSet("input_indices",u,`max(0, min(height, ${r[u]} - 1))`)};
      ${e.indicesSet("input_indices",d,`max(0, min(width, ${r[d]} - 1))`)};
      ${ga(e,l,i,3)}
      return ${e.getByIndices("input_indices")};
    }

    fn trilinearInterpolation(output_indices: ${t.type.indices}) -> ${c} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var depth:${c} = originalIndices[${s}];
      var height:${c} = originalIndices[${u}];
      var width:${c} = originalIndices[${d}];
      ${a?`if (depth < 0 || depth > (${r[s]} - 1) || height < 0 || height > (${r[u]} - 1) || width < 0 || (width > ${r[d]} - 1)) {
      return ${n};
        }`:""};

    depth = max(0, min(depth, ${r[s]} - 1));
      height = max(0, min(height, ${r[u]} - 1));
      width = max(0, min(width, ${r[d]} - 1));
      var depth1: u32 = u32(depth);
      var height1: u32 = u32(height);
      var width1: u32 = u32(width);
      var depth2: u32 = u32(depth + 1);
      var height2: u32 = u32(height + 1);
      var width2: u32 = u32(width + 1);
      var channel: u32 = ${r.length>3?`u32(originalIndices[${l}])`:"0"};
      var batch: u32 =  ${r.length>3?`u32(originalIndices[${i}])`:"0"};

      var x111: ${c} = getInputValue(batch, channel, depth1, height1, width1);
      var x112: ${c} = getInputValue(batch, channel, depth1, height1, width2);
      var x121: ${c} = getInputValue(batch, channel, depth1, height2, width1);
      var x122: ${c} = getInputValue(batch, channel, depth1, height2, width2);
      var x211: ${c} = getInputValue(batch, channel, depth2, height1, width1);
      var x212: ${c} = getInputValue(batch, channel, depth2, height1, width2);
      var x221: ${c} = getInputValue(batch, channel, depth2, height2, width1);
      var x222: ${c} = getInputValue(batch, channel, depth2, height2, width2);
      var dx1: ${c} = abs(depth - ${c}(depth1));
      var dx2: ${c} = abs(${c}(depth2) - depth);
      var dy1: ${c} = abs(height - ${c}(height1));
      var dy2: ${c} = abs(${c}(height2) - height);
      var dz1: ${c} = abs(width - ${c}(width1));
      var dz2: ${c} = abs(${c}(width2) - width);
      if (depth1 == depth2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (height1 == height2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      if (width1 == width2) {
        dz1 = 0.5;
        dz2 = 0.5;
      }
      return (x111 * dx2 * dy2 * dz2 + x112 * dx2 * dy2 * dz1 + x121 * dx2 * dy1 *dz2 + x122 * dx2 * dy1 * dz1 +
              x211 * dx1 * dy2 * dz2 + x212 * dx1 * dy2 * dz1 + x221 * dx1 * dy1 *dz2 + x222 * dx1 * dy1 * dz1);
    }`},Xl=(e,t,r,a,n,i)=>{let s=e.dims,u=Ll(i,t.axes,s.length),d=Vl(s,a,n,t.axes),l=a.slice();a.length===0&&(l=s.map((w,k)=>w===0?1:d[k]/w),t.keepAspectRatioPolicy!=="stretch"&&(d=jl(s,l,t)));let c=H("output",e.dataType,d.length),f=R("input",e.dataType,s.length),h=C.size(d),g=s.length===d.length&&s.every((w,k)=>w===d[k]),_=t.coordinateTransformMode==="tf_crop_and_resize",b=t.extrapolationValue,x=f.type.value,$=w=>`
      ${g?"":`
      ${ql(t.coordinateTransformMode,x)};
      ${(()=>{switch(t.mode){case"nearest":return`
              ${Fl(f,s)};
              ${Wl(t.nearestMode,r,x)};
              ${Hl(f,c,s,d,l.length,u.length,_)};
              `;case"linear":return`
              ${Gl(c,s,d,l.length,u.length)};
              ${(()=>{if(s.length===2||s.length===4)return`${Kl(f,c,s,_,b)}`;if(s.length===3||s.length===5)return`${Ql(f,c,s,_,b)}`;throw Error("Linear mode only supports input dims 2, 3, 4 and 5 are supported in linear mode.")})()};
            `;case"cubic":return`
            ${(()=>{if(s.length===2||s.length===4)return`${Zl(f,c,s,d,l,u,t.cubicCoeffA,_,t.extrapolationValue,t.excludeOutside)}`;throw Error("Cubic mode only supports input dims 2 and 4 are supported in linear mode.")})()};
            `;default:throw Error("Invalid resize mode")}})()};
      `}
      ${w.registerUniform("output_size","u32").registerUniform("scales","f32",l.length).registerUniform("roi","f32",u.length).declareVariables(f,c)}
      ${w.mainStart()}
        ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
        ${g?"output[global_idx] = input[global_idx];":`
        let output_indices = ${c.offsetToIndices("global_idx")};
        var input_indices: ${f.type.indices};
        ${(()=>{switch(t.mode){case"nearest":return`input_indices = calculateInputIndicesFromOutputIndices(output_indices);
                if (checkInputIndices(input_indices)) {
                  output[global_idx] = ${f.getByIndices("input_indices")};
                } else {
                  output[global_idx] = ${t.extrapolationValue};
                }`;case"linear":return`output[global_idx] = ${s.length===2||s.length===4?"bilinearInterpolation":"trilinearInterpolation"}(output_indices);`;case"cubic":return"output[global_idx] = bicubicInterpolation(output_indices);";default:throw Error(`Unsupported resize mode: ${t.mode}`)}})()};
`}
      }`;return{name:"Resize",shaderCache:{hint:`${t.cacheKey}|${r}|${l.length>0?t.mode==="cubic"?l:l.length:""}|${n.length>0?n:""}|${u.length>0?u:""}|${g}|${t.mode==="nearest"?s.length:s}`,inputDependencies:["rank"]},getShaderSource:$,getRunData:()=>({outputs:[{dims:d,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:[{type:12,data:h},{type:1,data:l},{type:1,data:u},...X(s,d)]})}},Yl=e=>{let t=e.customDataBuffer;return new Uint32Array(t,t.byteOffset,1)[0]},Af=(e,t)=>{let r=[],a=[],n=[],i=Yl(e);if(t.antialias!==0)throw Error("Only default value (0) for Antialias attribute is supported");Ul(e.inputs,t,i,r,a,n),e.compute(Xl(e.inputs[0],t,i,r,a,n),{inputs:[0]})},Of=e=>{let t=e.antialias,r=e.axes,a=e.coordinateTransformMode,n=e.cubicCoeffA,i=e.excludeOutside!==0,s=e.extrapolationValue,u=e.keepAspectRatioPolicy,d=e.mode,l=e.nearestMode===""?"simple":e.nearestMode;return fe({antialias:t,axes:r,coordinateTransformMode:a,cubicCoeffA:n,excludeOutside:i,extrapolationValue:s,keepAspectRatioPolicy:u,mode:d,nearestMode:l})}}),Jl,ed,Bf,Lg=U(()=>{J(),re(),ie(),Jl=e=>{if(!e||e.length<3)throw new Error("layerNorm requires at least 3 inputs.");let t=e[0],r=e[1],a=e[2];if(t.dataType!==r.dataType||t.dataType!==a.dataType)throw new Error("All inputs must have the same data type");if(t.dims.length!==3&&t.dims.length!==2)throw new Error("Input must be 2D or 3D");if(r.dims.length!==3&&r.dims.length!==2)throw new Error("Skip must be 2D or 3D");let n=t.dims[t.dims.length-1],i=t.dims[t.dims.length-2];if(r.dims[r.dims.length-1]!==n)throw new Error("Skip must have the same hidden size as input");if(r.dims[r.dims.length-2]!==i)throw new Error("Skip must have the same sequence length as input");if(a.dims.length!==1)throw new Error("Gamma must be 1D");if(a.dims[a.dims.length-1]!==n)throw new Error("Gamma must have the same hidden size as input");if(e.length>3){let s=e[3];if(s.dims.length!==1)throw new Error("Beta must be 1D");if(s.dims[s.dims.length-1]!==n)throw new Error("Beta must have the same hidden size as input")}if(e.length>4){let s=e[4];if(s.dims.length!==1)throw new Error("Bias must be 1D");if(s.dims[s.dims.length-1]!==n)throw new Error("Bias must have the same hidden size as input")}},ed=(e,t,r,a)=>{let n=t.simplified,i=e[0].dims,s=C.size(i),u=i,d=s,l=i.slice(-1)[0],c=a?i.slice(0,-1).concat(1):[],f=!n&&e.length>3,h=e.length>4,g=a&&r>1,_=a&&r>2,b=r>3,x=64,$=$e(l),w=[{type:12,data:d},{type:12,data:$},{type:12,data:l},{type:1,data:t.epsilon}],k=I=>{let E=[{name:"output_size",type:"u32"},{name:"components",type:"u32"},{name:"hidden_size",type:"u32"},{name:"epsilon",type:"f32"}],z=[R("x",e[0].dataType,e[0].dims,$),R("skip",e[1].dataType,e[1].dims,$),R("gamma",e[2].dataType,e[2].dims,$)];f&&z.push(R("beta",e[3].dataType,e[3].dims,$)),h&&z.push(R("bias",e[4].dataType,e[4].dims,$)),z.push(H("output",e[0].dataType,u,$)),g&&z.push(H("mean_output",1,c)),_&&z.push(H("inv_std_output",1,c)),b&&z.push(H("input_skip_bias_sum",e[0].dataType,u,$));let A=ke(e[0].dataType),O=ke(1,$);return`

      ${I.registerUniforms(E).declareVariables(...z)}
      var<workgroup> sum_shared : array<${O}, ${x}>;
      var<workgroup> sum_squared_shared : array<${O}, ${x}>;

      ${I.mainStart([x,1,1])}
        let ix = local_id.x;
        let iy = global_id.x / ${x};

        let hidden_size_vectorized: u32 = uniforms.hidden_size / uniforms.components;
        var stride = hidden_size_vectorized / ${x};
        let offset = ix * stride + iy * hidden_size_vectorized;
        let offset1d = stride * ix;
        if (ix == ${x-1}) {
          stride = hidden_size_vectorized - stride * ix;
        }
        for (var i: u32 = 0; i < stride; i++) {
          let skip_value = skip[offset + i];
          let bias_value = ${h?"bias[offset1d + i]":A+"(0.0)"};
          let input_value = x[offset + i];
          let value = input_value + skip_value + bias_value;
          ${b?"input_skip_bias_sum[offset + i] = value;":""}
          output[offset + i] = value;
          let f32_value = ${jt(A,$,"value")};
          sum_shared[ix] += f32_value;
          sum_squared_shared[ix] += f32_value * f32_value;
        }
        workgroupBarrier();

        var reduce_size : u32 = ${x};
        for (var curr_size = reduce_size >> 1;  curr_size > 0; curr_size = reduce_size >> 1) {
          reduce_size = curr_size + (reduce_size & 1);
          if (ix < curr_size) {
            sum_shared[ix] += sum_shared[ix + reduce_size];
            sum_squared_shared[ix] += sum_squared_shared[ix + reduce_size];
          }
          workgroupBarrier();
        }

        let sum = sum_shared[0];
        let square_sum = sum_squared_shared[0];
        let mean = ${vt("sum",$)} / f32(uniforms.hidden_size);
        let inv_std_dev = inverseSqrt(${vt("square_sum",$)} / f32(uniforms.hidden_size) ${n?"":"- mean * mean"} + uniforms.epsilon);
        ${g?"mean_output[global_idx] = mean;":""}
        ${_?"inv_std_output[global_idx] = inv_std_dev;":""}

        for (var i: u32 = 0; i < stride; i++) {
          output[offset + i] = (output[offset + i] ${n?"":`- ${A}(mean)`}) *
            ${A}(inv_std_dev) * gamma[offset1d + i]
            ${f?"+ beta[offset1d + i]":""};
        }
      }`},S=[{dims:u,dataType:e[0].dataType}];return r>1&&S.push({dims:c,dataType:1}),r>2&&S.push({dims:c,dataType:1}),r>3&&S.push({dims:i,dataType:e[0].dataType}),{name:"SkipLayerNormalization",shaderCache:{hint:`${$};${g};${_};${b}`,inputDependencies:e.map((I,E)=>"type")},getShaderSource:k,getRunData:()=>({outputs:S,dispatchGroup:{x:Math.ceil(d/l)},programUniforms:w})}},Bf=(e,t)=>{Jl(e.inputs);let r=[0];e.outputCount>1&&r.push(-3),e.outputCount>2&&r.push(-3),e.outputCount>3&&r.push(3),e.compute(ed(e.inputs,t,e.outputCount,!1),{outputs:r})}}),td,ur,rd,_a,id,ad,Rf,Mf,Vg=U(()=>{J(),re(),ve(),ie(),td=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");if(t.axes.length!==0){if(t.axes.length!==t.starts.length||t.axes.length!==t.ends.length)throw new Error("axes, starts and ends must have the same length")}else if(t.starts.length!==t.ends.length)throw new Error("starts and ends must have the same length");e.slice(1).forEach((r,a)=>{if(e[a+1].dataType!==6&&e[a+1].dataType!==7)throw new Error(`Input ${a} must be an array of int32 or int64`)})},ur=(e,t)=>{let r=[];if(e.length>t)if(e[t].dataType===7)e[t].getBigInt64Array().forEach(a=>r.push(Number(a)));else if(e[t].dataType===6)e[t].getInt32Array().forEach(a=>r.push(Number(a)));else throw new Error(`Input ${t} must be an array of int32 or int64`);return r},rd=(e,t)=>{if(e.length>1){let r=ur(e,1),a=ur(e,2),n=ur(e,3);return n.length===0&&(n=[...Array(e[0].dims.length).keys()]),fe({starts:r,ends:a,axes:n})}else return t},_a=(e,t,r,a,n)=>{let i=e;return e<0&&(i+=r[a[t]]),n[t]<0?Math.max(0,Math.min(i,r[a[t]]-1)):Math.max(0,Math.min(i,r[a[t]]))},id=(e,t,r)=>`fn calculateInputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
          var input_indices: ${e.type.indices};
          var carry = 0u;
          for (var i = ${r.length}; i >= 0; i--) {
            let input_shape_i = ${F("uniforms.input_shape","i",r.length)};
            let steps_i = ${F("uniforms.steps","i",r.length)};
            let signs_i = ${F("uniforms.signs","i",r.length)};
            let starts_i = ${F("uniforms.starts","i",r.length)};
            var output_index = ${t.indicesGet("output_indices","i")};
            var input_index = output_index * steps_i + starts_i + carry;
            carry = input_index / input_shape_i;
            input_index = input_index % input_shape_i;
            if (signs_i < 0) {
              input_index = input_shape_i - input_index - 1u + starts_i;
            }
            ${e.indicesSet("input_indices","i","input_index")};
          }
          return input_indices;
      }`,ad=(e,t)=>{let r=e[0].dims,a=C.size(r),n=t.axes.length>0?C.normalizeAxes(t.axes,r.length):[...Array(r.length).keys()],i=ur(e,4);i.forEach($=>$!==0||(()=>{throw new Error("step cannot be 0")})),i.length===0&&(i=Array(n.length).fill(1));let s=t.starts.map(($,w)=>_a($,w,r,n,i)),u=t.ends.map(($,w)=>_a($,w,r,n,i));if(n.length!==s.length||n.length!==u.length)throw new Error("start, ends and axes should have the same number of elements");if(n.length!==r.length)for(let $=0;$<r.length;++$)n.includes($)||(s.splice($,0,0),u.splice($,0,r[$]),i.splice($,0,1));let d=i.map($=>Math.sign($));i.forEach(($,w,k)=>{if($<0){let S=(u[w]-s[w])/$,I=s[w],E=I+S*i[w];s[w]=E,u[w]=I,k[w]=-$}});let l=r.slice(0);n.forEach(($,w)=>{l[$]=Math.ceil((u[$]-s[$])/i[$])});let c={dims:l,dataType:e[0].dataType},f=H("output",e[0].dataType,l.length),h=R("input",e[0].dataType,e[0].dims.length),g=C.size(l),_=[{name:"outputSize",type:"u32"},{name:"starts",type:"u32",length:s.length},{name:"signs",type:"i32",length:d.length},{name:"steps",type:"u32",length:i.length}],b=[{type:12,data:g},{type:12,data:s},{type:6,data:d},{type:12,data:i},...X(e[0].dims,l)],x=$=>`
      ${$.registerUniforms(_).declareVariables(h,f)}
        ${id(h,f,r)}
        ${$.mainStart()}
          ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
          let output_indices = ${f.offsetToIndices("global_idx")};
          let input_indices = calculateInputIndices(output_indices);
          ${f.setByOffset("global_idx",h.getByIndices("input_indices"))}
      }`;return{name:"Slice",shaderCache:{hint:`${d.length}_${s.length}_${i.length}`,inputDependencies:["rank"]},getShaderSource:x,getRunData:()=>({outputs:[c],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:b})}},Rf=(e,t)=>{td(e.inputs,t);let r=rd(e.inputs,t);e.compute(ad(e.inputs,r),{inputs:[0]})},Mf=e=>{let t=e.starts,r=e.ends,a=e.axes;return fe({starts:t,ends:r,axes:a})}}),nd,sd,Df,Nf,jg=U(()=>{J(),re(),ve(),xt(),ie(),nd=e=>{if(!e||e.length!==1)throw new Error("Softmax op requires 1 input.")},sd=(e,t)=>{let r=e.inputs[0],a=r.dims,n=C.size(a),i=a.length,s=C.normalizeAxis(t.axis,i),u=s<a.length-1,d,l=[];u?(l=Array.from({length:i},(z,A)=>A),l[s]=i-1,l[i-1]=s,d=e.compute(Ue(r,l),{inputs:[r],outputs:[-1]})[0]):d=r;let c=d.dims,f=c[i-1],h=n/f,g=$e(f),_=f/g,b=64;h===1&&(b=256);let x=(z,A)=>A===4?`max(max(${z}.x, ${z}.y), max(${z}.z, ${z}.w))`:A===2?`max(${z}.x, ${z}.y)`:A===3?`max(max(${z}.x, ${z}.y), ${z}.z)`:z,$=R("x",d.dataType,d.dims,g),w=H("result",d.dataType,d.dims,g),k=$.type.value,S=ke(d.dataType)==="f32"?`var threadMax = ${k}(-3.402823e+38f);`:`var threadMax = ${k}(-65504.0h);`,I=z=>`
      var<workgroup> rowMaxShared : ${k};
      var<workgroup> rowSumShared : ${k};
      var<workgroup> threadShared : array<${k}, ${b}>;

      fn getValue(row: i32, col: i32, row_stride: i32) -> ${k} {
        let index = row * row_stride + col;
        return x[index];
      }

      fn setValue(row: i32, col: i32, row_stride: i32, value: ${k}) {
        let index = row * row_stride + col;
        result[index] = value;
      }
      ${z.registerUniform("packedCols","i32").declareVariables($,w)}
      ${z.mainStart(b)}
        let gindex = i32(global_idx);
        let lindex = i32(local_idx);
        const wg = ${b};
        let row = gindex / wg;
        let cols = uniforms.packedCols;
        let row_stride : i32 = uniforms.packedCols;

        // find the rows max
        ${S}
        for (var col = lindex; col < cols; col += wg) {
          let value = getValue(row, col, row_stride);
          threadMax = max(threadMax, value);
        }
        if (lindex < cols) {
          threadShared[lindex] = threadMax;
        }
        workgroupBarrier();

        var reduceSize = min(cols, wg);
        for (var currSize = reduceSize >> 1;  currSize > 0; currSize = reduceSize >> 1) {
          reduceSize = currSize + (reduceSize & 1);
          if (lindex < currSize) {
            threadShared[lindex] = max(threadShared[lindex], threadShared[lindex + reduceSize]);
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowMaxShared = ${k}(${x("threadShared[0]",g)});
        }
        workgroupBarrier();

        // find the rows sum
        var threadSum = ${k}(0.0);
        for (var col = lindex; col < cols; col += wg) {
          let subExp = exp(getValue(row, col, row_stride) - rowMaxShared);
          threadSum += subExp;
        }
        threadShared[lindex] = threadSum;
        workgroupBarrier();

        for (var currSize = wg >> 1;  currSize > 0; currSize = currSize >> 1) {
          if (lindex < currSize) {
            threadShared[lindex] = threadShared[lindex] + threadShared[lindex + currSize];
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowSumShared = ${k}(${vt("threadShared[0]",g)});
        }
        workgroupBarrier();

        // calculate final value for each element in the row
        for (var col = lindex; col < cols; col += wg) {
          let value = exp(getValue(row, col, row_stride) - rowMaxShared) / rowSumShared;
          setValue(row, col, row_stride, value);
        }
      }`,E=e.compute({name:"Softmax",shaderCache:{hint:`${g};${b}`,inputDependencies:["type"]},getRunData:()=>({outputs:[{dims:c,dataType:d.dataType}],dispatchGroup:{x:h},programUniforms:[{type:6,data:_}]}),getShaderSource:I},{inputs:[d],outputs:[u?-1:0]})[0];u&&e.compute(Ue(E,l),{inputs:[E]})},Df=(e,t)=>{nd(e.inputs),sd(e,t)},Nf=e=>fe({axis:e.axis})}),ya,od,ud,ld,Pf,Gg=U(()=>{J(),re(),ie(),ya=e=>Array.from(e.getBigInt64Array(),Number),od=e=>{if(!e||e.length!==2)throw new Error("Tile requires 2 inputs.");if(e[0].dataType!==1&&e[0].dataType!==10&&e[0].dataType!==6&&e[0].dataType!==12)throw new Error("Tile only support float, float16, int32, and uint32 data types");if(e[1].dataType!==7)throw new Error("Tile `repeats` input should be of int64 data type");if(e[1].dims.length!==1)throw new Error("Tile `repeats` input should be 1-D");if(ya(e[1]).length!==e[0].dims.length)throw new Error("Tile `repeats` input should have same number of elements as rank of input data tensor")},ud=(e,t)=>{let r=[];for(let a=0;a<e.length;++a)r.push(e[a]*t[a]);return r},ld=(e,t)=>{let r=e[0].dims,a=t??ya(e[1]),n=ud(r,a),i=C.size(n),s=e[0].dataType,u=R("input",s,r.length),d=H("output",s,n.length),l=c=>`
      const inputShape = ${u.indices(...r)};
      ${c.registerUniform("output_size","u32").declareVariables(u,d)}
      ${c.mainStart()}
      ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let output_indices = ${d.offsetToIndices("global_idx")};
      var input_indices: ${u.type.indices};
      for (var i = 0; i < ${r.length}; i++) {
        let input_dim_i = ${u.indicesGet("uniforms.input_shape","i")};
        let input_dim_value = ${d.indicesGet("output_indices","i")}  % input_dim_i;

        ${u.indicesSet("input_indices","i","input_dim_value")}
      }
      ${d.setByOffset("global_idx",u.getByIndices("input_indices"))}
    }`;return{name:"Tile",shaderCache:{hint:`${a}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:[{type:12,data:i},...X(e[0].dims,n)]}),getShaderSource:l}},Pf=e=>{od(e.inputs),e.compute(ld(e.inputs),{inputs:[0]})}}),dd,pd,Uf,Hg=U(()=>{J(),re(),ie(),dd=(e,t,r,a,n)=>{let i=H("output_data",n,r.length,4),s=R("a_data",t[1].dataType,t[1].dims.length,4),u=R("b_data",t[2].dataType,t[2].dims.length,4),d=R("c_data",t[0].dataType,t[0].dims.length,4),l,c=(f,h,g)=>`select(${h}, ${f}, ${g})`;if(!a)l=i.setByOffset("global_idx",c(s.getByOffset("global_idx"),u.getByOffset("global_idx"),d.getByOffset("global_idx")));else{let f=(h,g,_="")=>{let b=`a_data[index_a${g}][component_a${g}]`,x=`b_data[index_b${g}][component_b${g}]`,$=`bool(c_data[index_c${g}] & (0xffu << (component_c${g} * 8)))`;return`
            let output_indices${g} = ${i.offsetToIndices(`global_idx * 4u + ${g}u`)};
            let offset_a${g} = ${s.broadcastedIndicesToOffset(`output_indices${g}`,i)};
            let offset_b${g} = ${u.broadcastedIndicesToOffset(`output_indices${g}`,i)};
            let offset_c${g} = ${d.broadcastedIndicesToOffset(`output_indices${g}`,i)};
            let index_a${g} = offset_a${g} / 4u;
            let index_b${g} = offset_b${g} / 4u;
            let index_c${g} = offset_c${g} / 4u;
            let component_a${g} = offset_a${g} % 4u;
            let component_b${g} = offset_b${g} % 4u;
            let component_c${g} = offset_c${g} % 4u;
            ${h}[${g}] = ${_}(${c(b,x,$)});
          `};n===9?l=`
            var data = vec4<u32>(0);
            ${f("data",0,"u32")}
            ${f("data",1,"u32")}
            ${f("data",2,"u32")}
            ${f("data",3,"u32")}
            output_data[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:l=`
            ${f("output_data[global_idx]",0)}
            ${f("output_data[global_idx]",1)}
            ${f("output_data[global_idx]",2)}
            ${f("output_data[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(d,s,u,i)}
        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${l}
      }`},pd=e=>{let t=e[1].dims,r=e[2].dims,a=e[0].dims,n=e[1].dataType,i=!(C.areEqual(t,r)&&C.areEqual(r,a)),s=t,u=C.size(t);if(i){let l=Gt.calcShape(Gt.calcShape(t,r,!1),a,!1);if(!l)throw new Error("Can't perform where op on the given tensors");s=l,u=C.size(s)}let d=Math.ceil(u/4);return{name:"Where",shaderCache:{inputDependencies:["rank","rank","rank"]},getShaderSource:l=>dd(l,e,s,i,n),getRunData:()=>({outputs:[{dims:s,dataType:n}],dispatchGroup:{x:Math.ceil(u/64/4)},programUniforms:[{type:12,data:d},...X(a,t,r,s)]})}},Uf=e=>{e.compute(pd(e.inputs))}}),qf,Fg=U(()=>{og(),pn(),ug(),lg(),dg(),pg(),cg(),_g(),bg(),wg(),$g(),vg(),xg(),Sg(),kg(),Ig(),Tg(),Eg(),zg(),Cg(),Ag(),Og(),Bg(),Rg(),Mg(),nf(),Dg(),Ng(),Pg(),Ug(),qg(),dn(),Wg(),df(),Lg(),Vg(),jg(),uf(),Gg(),xt(),cn(),Hg(),qf=new Map([["Abs",[Op]],["Acos",[Bp]],["Acosh",[Rp]],["Add",[hc]],["ArgMax",[Ep,Ra]],["ArgMin",[Tp,Ra]],["Asin",[Mp]],["Asinh",[Dp]],["Atan",[Np]],["Atanh",[Pp]],["Attention",[zp]],["AveragePool",[bf,yf]],["BatchNormalization",[Cp]],["BiasAdd",[Ap]],["BiasSplitGelu",[fc]],["Cast",[qp,Up]],["Ceil",[Lp]],["Clip",[Wp]],["Concat",[Sc,kc]],["Conv",[qa,Ua]],["ConvTranspose",[Mc,Rc]],["Cos",[Vp]],["Cosh",[jp]],["CumSum",[Dc,Nc]],["DepthToSpace",[Pc,Uc]],["DequantizeLinear",[If,Tf]],["Div",[mc]],["Einsum",[qc,Wc]],["Elu",[Gp,fr]],["Equal",[gc]],["Erf",[Hp]],["Exp",[Fp]],["Expand",[Lc]],["FastGelu",[Vc]],["Floor",[Kp]],["FusedConv",[qa,Ua]],["Gather",[Gc,jc]],["GatherElements",[Xc,Qc]],["GatherBlockQuantized",[Kc,Zc]],["GatherND",[Hc,Fc]],["Gelu",[Zp]],["Gemm",[Jc,Yc]],["GlobalAveragePool",[$f,wf]],["GlobalMaxPool",[kf,Sf]],["Greater",[wc]],["GreaterOrEqual",[vc]],["GridSample",[ef,tf]],["GroupQueryAttention",[pf]],["HardSigmoid",[ic,rc]],["InstanceNormalization",[cf]],["LayerNormalization",[ff]],["LeakyRelu",[Qp,fr]],["Less",[$c]],["LessOrEqual",[xc]],["Log",[pc]],["MatMul",[hf]],["MatMulNBits",[mf,gf]],["MaxPool",[vf,xf]],["Mul",[_c]],["MultiHeadAttention",[af,rf]],["Neg",[Yp]],["Not",[Xp]],["Pad",[_f]],["Pow",[yc]],["QuickGelu",[cc,fr]],["Range",[Ef]],["Reciprocal",[Jp]],["ReduceMin",[vp]],["ReduceMean",[_p]],["ReduceMax",[$p]],["ReduceSum",[Sp]],["ReduceProd",[xp]],["ReduceL1",[yp]],["ReduceL2",[bp]],["ReduceLogSum",[Ip]],["ReduceLogSumExp",[wp]],["ReduceSumSquare",[kp]],["Relu",[ec]],["Resize",[Af,Of]],["RotaryEmbedding",[lf]],["ScatterND",[Cf,zf]],["Sigmoid",[tc]],["Sin",[ac]],["Sinh",[nc]],["Slice",[Rf,Mf]],["SkipLayerNormalization",[Bf]],["Split",[sf,of]],["Sqrt",[sc]],["Softmax",[Df,Nf]],["Sub",[bc]],["Tan",[oc]],["Tanh",[uc]],["ThresholdedRelu",[dc,fr]],["Tile",[Pf]],["Transpose",[np,sp]],["Where",[Uf]]])}),Wf,Kg=U(()=>{et(),ct(),ie(),Wf=class{constructor(e){this.backend=e,this.repo=new Map,this.attributesBound=!1}getArtifact(e){return this.repo.get(e)}setArtifact(e,t){this.repo.set(e,t)}run(e,t,r,a,n){st(e.programInfo.name);let i=this.backend.device,s=this.backend.getComputePassEncoder();this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2);let u=[];for(let l of t)u.push({binding:u.length,resource:{buffer:l.buffer}});for(let l of r)u.push({binding:u.length,resource:{buffer:l.buffer}});n&&u.push({binding:u.length,resource:n});let d=i.createBindGroup({layout:e.computePipeline.getBindGroupLayout(0),entries:u,label:e.programInfo.name});if(this.backend.sessionStatus==="capturing"){let l={kernelId:this.backend.currentKernelId,computePipeline:e.computePipeline,bindGroup:d,dispatchGroup:a};this.backend.capturedCommandList.get(this.backend.currentSessionId).push(l)}s.setPipeline(e.computePipeline),s.setBindGroup(0,d),s.dispatchWorkgroups(...a),this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2+1),this.backend.pendingDispatchNumber++,(this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber||this.backend.queryType==="at-passes")&&this.backend.endComputePass(),this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber&&this.backend.flush(),Ye(e.programInfo.name)}dispose(){}build(e,t){st(e.name);let r=this.backend.device,a=[];[{feature:"shader-f16",extension:"f16"},{feature:"subgroups",extension:"subgroups"}].forEach(l=>{r.features.has(l.feature)&&a.push(`enable ${l.extension};`)});let n=ap(t,this.backend.device.limits),i=e.getShaderSource(n),s=`${a.join(`
`)}
${n.additionalImplementations}
${i}`,u=r.createShaderModule({code:s,label:e.name});le("verbose",()=>`[WebGPU] ${e.name} shader code: ${s}`);let d=r.createComputePipeline({compute:{module:u,entryPoint:"main"},layout:"auto",label:e.name});return Ye(e.name),{programInfo:e,computePipeline:d,uniformVariablesInfo:n.variablesInfo}}normalizeDispatchGroupSize(e){let t=typeof e=="number"?e:e.x,r=typeof e=="number"?1:e.y||1,a=typeof e=="number"?1:e.z||1,n=this.backend.device.limits.maxComputeWorkgroupsPerDimension;if(t<=n&&r<=n&&a<=n)return[t,r,a];let i=t*r*a,s=Math.ceil(Math.sqrt(i));if(s>n){if(s=Math.ceil(Math.cbrt(i)),s>n)throw new Error("Total dispatch size exceeds WebGPU maximum.");return[s,s,s]}else return[s,s,1]}}}),Lf={};Ft(Lf,{WebGpuBackend:()=>Vf});var cd,fd,hd,Vf,Zg=U(()=>{et(),J(),ct(),Jd(),ng(),Fg(),Kg(),cd=(e,t)=>{if(t.length!==e.length)throw new Error(`inputDependencies length ${t.length} is not equal to inputTensors length ${e.length}.`);let r=[];for(let a=0;a<e.length;++a){let n=e[a].dataType;switch(t[a]){case"none":{r.push("");break}case"type":{r.push(`${n}`);break}case"rank":{let i=e[a].dims.length;r.push(`${n};${i}`);break}case"dims":{let i=e[a].dims.join(",");r.push(`${n};${i}`);break}default:throw new Error(`unsupported input dependency: ${t[a]}`)}}return r.join("|")},fd=(e,t,r)=>{var n,i;let a=e.name;return(n=e.shaderCache)!=null&&n.hint&&(a+="["+e.shaderCache.hint+"]"),a+=":"+r+`:${cd(t,((i=e.shaderCache)==null?void 0:i.inputDependencies)??new Array(t.length).fill("dims"))}`,a},hd=class{constructor(e){e&&(this.architecture=e.architecture,this.vendor=e.vendor)}isArchitecture(e){return this.architecture===e}isVendor(e){return this.vendor===e}},Vf=class{constructor(){this.currentSessionId=null,this.currentKernelId=null,this.commandEncoder=null,this.computePassEncoder=null,this.maxDispatchNumber=16,this.pendingDispatchNumber=0,this.pendingKernels=[],this.pendingQueries=new Map,this.sessionStatus="default",this.capturedCommandList=new Map,this.capturedPendingKernels=new Map,this.sessionExternalDataMapping=new Map}get currentKernelCustomData(){if(this.currentKernelId===null)throw new Error("currentKernelCustomData(): currentKernelId is null. (should not happen)");let e=this.kernelCustomData.get(this.currentKernelId);return e||(e={},this.kernelCustomData.set(this.currentKernelId,e)),e}async initialize(e,t){this.env=e;let r=[],a={requiredLimits:{maxComputeWorkgroupStorageSize:t.limits.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:t.limits.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:t.limits.maxStorageBufferBindingSize,maxBufferSize:t.limits.maxBufferSize,maxComputeInvocationsPerWorkgroup:t.limits.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupSizeX:t.limits.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.limits.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.limits.maxComputeWorkgroupSizeZ},requiredFeatures:r},n=i=>t.features.has(i)&&r.push(i)&&!0;n("chromium-experimental-timestamp-query-inside-passes")||n("timestamp-query"),n("shader-f16"),n("subgroups"),this.device=await t.requestDevice(a),this.adapterInfo=new hd(t.info||await t.requestAdapterInfo()),this.gpuDataManager=rp(this),this.programManager=new Wf(this),this.kernels=new Map,this.kernelPersistentData=new Map,this.kernelCustomData=new Map,sn(e.logLevel,!!e.debug),this.device.onuncapturederror=i=>{i.error instanceof GPUValidationError&&console.error(`An uncaught WebGPU validation error was raised: ${i.error.message}`)},Object.defineProperty(this.env.webgpu,"device",{value:this.device,writable:!1,enumerable:!0,configurable:!1}),Object.defineProperty(this.env.webgpu,"adapter",{value:t,writable:!1,enumerable:!0,configurable:!1}),this.setQueryType()}dispose(){typeof this.querySet<"u"&&this.querySet.destroy(),this.gpuDataManager.dispose()}getCommandEncoder(){return this.commandEncoder||(this.commandEncoder=this.device.createCommandEncoder()),this.commandEncoder}getComputePassEncoder(){if(!this.computePassEncoder){let e=this.getCommandEncoder(),t={};this.queryType==="at-passes"&&(t.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:this.pendingDispatchNumber*2,endOfPassWriteIndex:this.pendingDispatchNumber*2+1}),this.computePassEncoder=e.beginComputePass(t)}return this.computePassEncoder}endComputePass(){this.computePassEncoder&&(this.computePassEncoder.end(),this.computePassEncoder=null)}flush(){if(!this.commandEncoder)return;st(),this.endComputePass();let e;this.queryType!=="none"&&(this.commandEncoder.resolveQuerySet(this.querySet,0,this.pendingDispatchNumber*2,this.queryResolveBuffer,0),e=this.device.createBuffer({size:this.pendingDispatchNumber*2*8,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.pendingQueries.set(e,this.pendingKernels),this.pendingKernels=[],this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer,0,e,0,this.pendingDispatchNumber*2*8)),this.device.queue.submit([this.commandEncoder.finish()]),this.gpuDataManager.refreshPendingBuffers(),this.commandEncoder=null,this.pendingDispatchNumber=0,this.queryType!=="none"&&e.mapAsync(GPUMapMode.READ).then(()=>{var a;let t=new BigUint64Array(e.getMappedRange()),r=this.pendingQueries.get(e);for(let n=0;n<t.length/2;n++){let i=r[n],s=i.kernelId,u=this.kernels.get(s),d=u.kernelType,l=u.kernelName,c=i.programName,f=i.inputTensorViews,h=i.outputTensorViews,g=t[n*2],_=t[n*2+1];typeof this.queryTimeBase>"u"&&(this.queryTimeBase=g);let b=Number(g-this.queryTimeBase),x=Number(_-this.queryTimeBase);if(!Number.isSafeInteger(b)||!Number.isSafeInteger(x))throw new RangeError("incorrect timestamp range");if((a=this.env.webgpu.profiling)!=null&&a.ondata)this.env.webgpu.profiling.ondata({version:1,inputsMetadata:f.map($=>({dims:$.dims,dataType:dt($.dataType)})),outputsMetadata:h.map($=>({dims:$.dims,dataType:dt($.dataType)})),kernelId:s,kernelType:d,kernelName:l,programName:c,startTime:b,endTime:x});else{let $="";f.forEach((k,S)=>{$+=`input[${S}]: [${k.dims}] | ${dt(k.dataType)}, `});let w="";h.forEach((k,S)=>{w+=`output[${S}]: [${k.dims}] | ${dt(k.dataType)}, `}),console.log(`[profiling] kernel "${s}|${d}|${l}|${c}" ${$}${w}execution time: ${x-b} ns`)}Hr("GPU",`${c}::${g}::${_}`)}e.unmap(),this.pendingQueries.delete(e)}),Ye()}run(e,t,r,a,n,i){st(e.name);let s=[];for(let w=0;w<t.length;++w){let k=t[w].data;if(k===0)continue;let S=this.gpuDataManager.get(k);if(!S)throw new Error(`no GPU data for input: ${k}`);s.push(S)}let{outputs:u,dispatchGroup:d,programUniforms:l}=e.getRunData(t),c=r.length===0?u.map((w,k)=>k):r;if(c.length!==u.length)throw new Error(`Output size ${c.length} must be equal to ${u.length}.`);let f=[],h=[];for(let w=0;w<u.length;++w){if(!Number.isInteger(c[w])||c[w]<-3||c[w]>=i)throw new Error(`Invalid output index: ${c[w]}`);if(c[w]===-3)continue;let k=c[w]===-1,S=c[w]===-2,I=k||S?n(u[w].dataType,u[w].dims):a(c[w],u[w].dataType,u[w].dims);if(f.push(I),I.data===0)continue;let E=this.gpuDataManager.get(I.data);if(!E)throw new Error(`no GPU data for output: ${I.data}`);if(k&&this.temporaryData.push(E),S){let z=this.kernelPersistentData.get(this.currentKernelId);z||(z=[],this.kernelPersistentData.set(this.currentKernelId,z)),z.push(E)}h.push(E)}if(s.length!==t.length||h.length!==f.length){if(h.length===0)return Ye(e.name),f;throw new Error(`Program ${e.name} has zero-sized tensor(s) in inputs or outputs. This is not supported now.`)}let g;if(l){let w=0,k=[];l.forEach(z=>{let A=typeof z.data=="number"?[z.data]:z.data;if(A.length===0)return;let O=z.type===10?2:4,q,K;z.type===10?(K=A.length>4?16:A.length>2?8:A.length*O,q=A.length>4?16:O*A.length):(K=A.length<=2?A.length*O:16,q=16),w=Math.ceil(w/K)*K,k.push(w);let W=z.type===10?8:4;w+=A.length>4?Math.ceil(A.length/W)*q:A.length*O});let S=16;w=Math.ceil(w/S)*S;let I=new ArrayBuffer(w);l.forEach((z,A)=>{let O=k[A],q=typeof z.data=="number"?[z.data]:z.data;if(z.type===6)new Int32Array(I,O,q.length).set(q);else if(z.type===12)new Uint32Array(I,O,q.length).set(q);else if(z.type===10)new Uint16Array(I,O,q.length).set(q);else if(z.type===1)new Float32Array(I,O,q.length).set(q);else throw new Error(`Unsupported uniform type: ${dt(z.type)}`)});let E=this.gpuDataManager.create(w,GPUBufferUsage.COPY_DST|GPUBufferUsage.UNIFORM);this.device.queue.writeBuffer(E.buffer,0,I,0,w),this.gpuDataManager.release(E.id),g={offset:0,size:w,buffer:E.buffer}}let _=this.programManager.normalizeDispatchGroupSize(d),b=_[1]===1&&_[2]===1,x=fd(e,t,b),$=this.programManager.getArtifact(x);if($||($=this.programManager.build(e,_),this.programManager.setArtifact(x,$),le("info",()=>`[artifact] key: ${x}, programName: ${e.name}`)),l&&$.uniformVariablesInfo){if(l.length!==$.uniformVariablesInfo.length)throw new Error(`Uniform variables count mismatch: expect ${$.uniformVariablesInfo.length}, got ${l.length} in program "${$.programInfo.name}".`);for(let w=0;w<l.length;w++){let k=l[w],S=k.type,I=typeof k.data=="number"?1:k.data.length,[E,z]=$.uniformVariablesInfo[w];if(S!==E||I!==z)throw new Error(`Uniform variable ${w} mismatch: expect type ${E} with size ${z}, got type ${S} with size ${I} in program "${$.programInfo.name}".`)}}if(le("info",()=>`[ProgramManager] run "${e.name}" (key=${x}) with ${_[0]}x${_[1]}x${_[2]}`),this.queryType!=="none"||this.sessionStatus==="capturing"){let w={kernelId:this.currentKernelId,programName:$.programInfo.name,inputTensorViews:t,outputTensorViews:f};this.pendingKernels.push(w),this.sessionStatus==="capturing"&&this.capturedPendingKernels.get(this.currentSessionId).push(w)}return this.programManager.run($,s,h,_,g),Ye(e.name),f}upload(e,t){this.gpuDataManager.upload(e,t)}memcpy(e,t){this.gpuDataManager.memcpy(e,t)}async download(e,t){await this.gpuDataManager.download(e,t)}alloc(e){return this.gpuDataManager.create(e).id}free(e){return this.gpuDataManager.release(e)}createKernel(e,t,r,a){let n=qf.get(e);if(!n)throw new Error(`kernel not implemented: ${e}`);let i={kernelType:e,kernelName:a,kernelEntry:n[0],attributes:[n[1],r]};this.kernels.set(t,i)}releaseKernel(e){let t=this.kernelPersistentData.get(e);if(t){for(let r of t)this.gpuDataManager.release(r.id);this.kernelPersistentData.delete(e)}this.kernelCustomData.delete(e),this.kernels.delete(e)}computeKernel(e,t,r){let a=this.kernels.get(e);if(!a)throw new Error(`kernel not created: ${e}`);let n=a.kernelType,i=a.kernelName,s=a.kernelEntry,u=a.attributes;if(this.currentKernelId!==null)throw new Error(`kernel "[${n}] ${i}" is not allowed to be called recursively`);this.currentKernelId=e,u[0]&&(u[1]=u[0](u[1]),u[0]=void 0),le("info",()=>`[WebGPU] Start to run kernel "[${n}] ${i}"...`);let d=this.env.debug;this.temporaryData=[];try{return d&&this.device.pushErrorScope("validation"),s(t,u[1]),0}catch(l){return r.push(Promise.resolve(`[WebGPU] Kernel "[${n}] ${i}" failed. ${l}`)),1}finally{d&&r.push(this.device.popErrorScope().then(l=>l?`GPU validation error for kernel "[${n}] ${i}": ${l.message}`:null));for(let l of this.temporaryData)this.gpuDataManager.release(l.id);this.temporaryData=[],this.currentKernelId=null}}registerBuffer(e,t,r,a){let n=this.sessionExternalDataMapping.get(e);n||(n=new Map,this.sessionExternalDataMapping.set(e,n));let i=n.get(t),s=this.gpuDataManager.registerExternalBuffer(r,a,i);return n.set(t,[s,r]),s}unregisterBuffers(e){let t=this.sessionExternalDataMapping.get(e);t&&(t.forEach(r=>this.gpuDataManager.unregisterExternalBuffer(r[0])),this.sessionExternalDataMapping.delete(e))}getBuffer(e){let t=this.gpuDataManager.get(e);if(!t)throw new Error(`no GPU data for buffer: ${e}`);return t.buffer}createDownloader(e,t,r){return async()=>{let a=await Aa(this,e,t);return on(a.buffer,r)}}writeTimestamp(e){this.queryType==="inside-passes"&&this.computePassEncoder.writeTimestamp(this.querySet,e)}setQueryType(){var e;this.queryType="none",(((e=this.env.webgpu.profiling)==null?void 0:e.mode)==="default"||(typeof this.env.trace>"u"?this.env.wasm.trace:this.env.trace))&&(this.device.features.has("chromium-experimental-timestamp-query-inside-passes")?this.queryType="inside-passes":this.device.features.has("timestamp-query")&&(this.queryType="at-passes"),this.queryType!=="none"&&typeof this.querySet>"u"&&(this.querySet=this.device.createQuerySet({type:"timestamp",count:this.maxDispatchNumber*2}),this.queryResolveBuffer=this.device.createBuffer({size:this.maxDispatchNumber*2*8,usage:GPUBufferUsage.COPY_SRC|GPUBufferUsage.QUERY_RESOLVE})))}captureBegin(){le("info","captureBegin"),this.capturedCommandList.get(this.currentSessionId)||this.capturedCommandList.set(this.currentSessionId,[]),this.capturedPendingKernels.get(this.currentSessionId)||this.capturedPendingKernels.set(this.currentSessionId,[]),this.flush(),this.sessionStatus="capturing"}captureEnd(){le("info","captureEnd"),this.flush(),this.sessionStatus="default"}replay(){le("info","replay"),this.sessionStatus="replaying";let e=this.capturedCommandList.get(this.currentSessionId),t=this.capturedPendingKernels.get(this.currentSessionId),r=e.length;this.pendingKernels=[];for(let a=0;a<r;a++){let n=this.getComputePassEncoder(),i=e[a];this.writeTimestamp(this.pendingDispatchNumber*2),n.setPipeline(i.computePipeline),n.setBindGroup(0,i.bindGroup),n.dispatchWorkgroups(...i.dispatchGroup),this.writeTimestamp(this.pendingDispatchNumber*2+1),this.pendingDispatchNumber++,this.queryType!=="none"&&this.pendingKernels.push(t[a]),(this.pendingDispatchNumber>=this.maxDispatchNumber||this.queryType==="at-passes")&&this.endComputePass(),this.pendingDispatchNumber>=this.maxDispatchNumber&&this.flush()}this.flush(),this.sessionStatus="default"}onCreateSession(){this.gpuDataManager.onCreateSession()}onReleaseSession(e){this.unregisterBuffers(e),this.capturedCommandList.has(e)&&this.capturedCommandList.delete(e),this.capturedPendingKernels.has(e)&&this.capturedPendingKernels.delete(e),this.gpuDataManager.onReleaseSession(e)}onRunStart(e){this.currentSessionId=e,this.setQueryType()}}}),jf={};Ft(jf,{init:()=>Gf});var Wr,md,Gf,Qg=U(()=>{J(),ct(),re(),ag(),Wr=class Hf{constructor(t,r,a,n){this.module=t,this.dataType=r,this.data=a,this.dims=n}getFloat32Array(){if(this.dataType!==1)throw new Error("Invalid data type");let t=C.size(this.dims);return t===0?new Float32Array:new Float32Array(this.module.HEAP8.buffer,this.data,t)}getBigInt64Array(){if(this.dataType!==7)throw new Error("Invalid data type");let t=C.size(this.dims);return t===0?new BigInt64Array:new BigInt64Array(this.module.HEAP8.buffer,this.data,t)}getInt32Array(){if(this.dataType!==6)throw new Error("Invalid data type");let t=C.size(this.dims);return t===0?new Int32Array:new Int32Array(this.module.HEAP8.buffer,this.data,t)}getUint16Array(){if(this.dataType!==10&&this.dataType!==4)throw new Error("Invalid data type");let t=C.size(this.dims);return t===0?new Uint16Array:new Uint16Array(this.module.HEAP8.buffer,this.data,t)}reshape(t){if(C.size(t)!==C.size(this.dims))throw new Error("Invalid new shape");return new Hf(this.module,this.dataType,this.data,t)}},md=class{constructor(e,t,r){this.module=e,this.backend=t,this.customDataOffset=0,this.customDataSize=0,this.adapterInfo=t.adapterInfo;let a=e.PTR_SIZE,n=r/e.PTR_SIZE,i=a===4?"i32":"i64";this.opKernelContext=Number(e.getValue(a*n++,i));let s=Number(e.getValue(a*n++,i));this.outputCount=Number(e.getValue(a*n++,i)),this.customDataOffset=Number(e.getValue(a*n++,"*")),this.customDataSize=Number(e.getValue(a*n++,i));let u=[];for(let d=0;d<s;d++){let l=Number(e.getValue(a*n++,i)),c=Number(e.getValue(a*n++,"*")),f=Number(e.getValue(a*n++,i)),h=[];for(let g=0;g<f;g++)h.push(Number(e.getValue(a*n++,i)));u.push(new Wr(e,l,c,h))}this.inputs=u}get kernelCustomData(){return this.backend.currentKernelCustomData}get customDataBuffer(){return this.module.HEAPU8.subarray(this.customDataOffset,this.customDataOffset+this.customDataSize)}compute(e,t){var s;let r=((s=t==null?void 0:t.inputs)==null?void 0:s.map(u=>typeof u=="number"?this.inputs[u]:u))??this.inputs,a=(t==null?void 0:t.outputs)??[],n=(u,d,l)=>new Wr(this.module,d,this.output(u,l),l),i=(u,d)=>{let l=Ot(u,d);if(!l)throw new Error(`Unsupported data type: ${u}`);let c=l>0?this.backend.gpuDataManager.create(l).id:0;return new Wr(this.module,u,c,d)};return this.backend.run(e,r,a,n,i,this.outputCount)}output(e,t){let r=this.module.stackSave();try{let a=this.module.PTR_SIZE,n=a===4?"i32":"i64",i=this.module.stackAlloc((1+t.length)*a);this.module.setValue(i,t.length,n);for(let s=0;s<t.length;s++)this.module.setValue(i+a*(s+1),t[s],n);return this.module._JsepOutput(this.opKernelContext,e,i)}catch(a){throw new Error(`Failed to generate kernel's output[${e}] with dims [${t}]. If you are running with pre-allocated output, please make sure the output type/dims are correct. Error: ${a}`)}finally{this.module.stackRestore(r)}}},Gf=async(e,t,r,a)=>{let n=t.jsepInit;if(!n)throw new Error("Failed to initialize JSEP. The WebAssembly module is not built with JSEP support.");if(e==="webgpu"){let i=(Zg(),gr(Lf)).WebGpuBackend,s=new i;await s.initialize(r,a),n("webgpu",[s,u=>s.alloc(Number(u)),u=>s.free(u),(u,d,l,c=!1)=>{if(c)le("verbose",()=>`[WebGPU] jsepCopyGpuToGpu: src=${Number(u)}, dst=${Number(d)}, size=${Number(l)}`),s.memcpy(Number(u),Number(d));else{le("verbose",()=>`[WebGPU] jsepCopyCpuToGpu: dataOffset=${Number(u)}, gpuDataId=${Number(d)}, size=${Number(l)}`);let f=t.HEAPU8.subarray(Number(u>>>0),Number(u>>>0)+Number(l));s.upload(Number(d),f)}},async(u,d,l)=>{le("verbose",()=>`[WebGPU] jsepCopyGpuToCpu: gpuDataId=${u}, dataOffset=${d}, size=${l}`),await s.download(Number(u),()=>t.HEAPU8.subarray(Number(d)>>>0,Number(d+l)>>>0))},(u,d,l)=>s.createKernel(u,Number(d),l,t.UTF8ToString(t._JsepGetNodeName(Number(d)))),u=>s.releaseKernel(u),(u,d,l,c)=>{le("verbose",()=>`[WebGPU] jsepRun: sessionHandle=${l}, kernel=${u}, contextDataOffset=${d}`);let f=new md(t,s,Number(d));return s.computeKernel(Number(u),f,c)},()=>s.captureBegin(),()=>s.captureEnd(),()=>s.replay()])}else{let i=new tp(r);n("webnn",[i,()=>i.reserveTensorId(),s=>i.releaseTensorId(s),async(s,u,d,l,c)=>i.ensureTensor(s,u,d,l,c),(s,u)=>{i.uploadTensor(s,u)},async(s,u)=>i.downloadTensor(s,u)])}}}),gd,yn,bn,wt,_d,ba,Jr,wn,$n,wa,vn,xn,Sn,Ff=U(()=>{tg(),rg(),J(),Nt(),en(),Zd(),gd=(e,t)=>{ye()._OrtInit(e,t)!==0&&me("Can't initialize onnxruntime.")},yn=async e=>{gd(e.wasm.numThreads,Kr(e.logLevel))},bn=async(e,t)=>{var r,a;(a=(r=ye()).asyncInit)==null||a.call(r);{let n=(Qg(),gr(jf)).init;if(t==="webgpu"){if(typeof navigator>"u"||!navigator.gpu)throw new Error("WebGPU is not supported in current environment");let i=e.webgpu.adapter;if(i){if(typeof i.limits!="object"||typeof i.features!="object"||typeof i.requestDevice!="function")throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.")}else{let s=e.webgpu.powerPreference;if(s!==void 0&&s!=="low-power"&&s!=="high-performance")throw new Error(`Invalid powerPreference setting: "${s}"`);let u=e.webgpu.forceFallbackAdapter;if(u!==void 0&&typeof u!="boolean")throw new Error(`Invalid forceFallbackAdapter setting: "${u}"`);if(i=await navigator.gpu.requestAdapter({powerPreference:s,forceFallbackAdapter:u}),!i)throw new Error('Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.')}await n("webgpu",ye(),e,i)}if(t==="webnn"){if(typeof navigator>"u"||!navigator.ml)throw new Error("WebNN is not supported in current environment");await n("webnn",ye(),e)}}},wt=new Map,_d=e=>{let t=ye(),r=t.stackSave();try{let a=t.PTR_SIZE,n=t.stackAlloc(2*a);t._OrtGetInputOutputCount(e,n,n+a)!==0&&me("Can't get session input/output count.");let i=a===4?"i32":"i64";return[Number(t.getValue(n,i)),Number(t.getValue(n+a,i))]}finally{t.stackRestore(r)}},ba=(e,t)=>{let r=ye(),a=r.stackSave(),n=0;try{let i=r.PTR_SIZE,s=r.stackAlloc(2*i);r._OrtGetInputOutputMetadata(e,t,s,s+i)!==0&&me("Can't get session input/output metadata.");let u=Number(r.getValue(s,"*"));n=Number(r.getValue(s+i,"*"));let d=r.HEAP32[n/4];if(d===0)return[u,0];let l=r.HEAPU32[n/4+1],c=[];for(let f=0;f<l;f++){let h=Number(r.getValue(n+8+f*i,"*"));c.push(h!==0?r.UTF8ToString(h):Number(r.getValue(n+8+(f+l)*i,"*")))}return[u,d,c]}finally{r.stackRestore(a),n!==0&&r._OrtFree(n)}},Jr=e=>{let t=ye(),r=t._malloc(e.byteLength);if(r===0)throw new Error(`Can't create a session. failed to allocate a buffer of size ${e.byteLength}.`);return t.HEAPU8.set(e,r),[r,e.byteLength]},wn=async(e,t)=>{var f,h,g,_;let r,a,n=ye();Array.isArray(e)?[r,a]=e:e.buffer===n.HEAPU8.buffer?[r,a]=[e.byteOffset,e.byteLength]:[r,a]=Jr(e);let i=0,s=0,u=0,d=[],l=[],c=[];try{if([s,d]=await Kd(t),(t==null?void 0:t.externalData)&&n.mountExternalData){let A=[];for(let O of t.externalData){let q=typeof O=="string"?O:O.path;A.push(nn(typeof O=="string"?O:O.data).then(K=>{n.mountExternalData(q,K)}))}await Promise.all(A)}for(let A of(t==null?void 0:t.executionProviders)??[])if((typeof A=="string"?A:A.name)==="webnn"){if(n.shouldTransferToMLTensor=!1,typeof A!="string"){let O=A,q=O==null?void 0:O.context,K=O==null?void 0:O.gpuDevice,W=O==null?void 0:O.deviceType,Z=O==null?void 0:O.powerPreference;q?n.currentContext=q:K?n.currentContext=await n.webnnCreateMLContext(K):n.currentContext=await n.webnnCreateMLContext({deviceType:W,powerPreference:Z})}else n.currentContext=await n.webnnCreateMLContext();break}i=await n._OrtCreateSession(r,a,s),(f=n.webgpuOnCreateSession)==null||f.call(n,i),i===0&&me("Can't create a session."),(h=n.jsepOnCreateSession)==null||h.call(n),n.currentContext&&(n.webnnRegisterMLContext(i,n.currentContext),n.currentContext=void 0,n.shouldTransferToMLTensor=!0);let[b,x]=_d(i),$=!!(t!=null&&t.enableGraphCapture),w=[],k=[],S=[],I=[],E=[];for(let A=0;A<b;A++){let[O,q,K]=ba(i,A);O===0&&me("Can't get an input name."),l.push(O);let W=n.UTF8ToString(O);w.push(W),S.push(q===0?{name:W,isTensor:!1}:{name:W,isTensor:!0,type:dt(q),shape:K})}for(let A=0;A<x;A++){let[O,q,K]=ba(i,A+b);O===0&&me("Can't get an output name."),c.push(O);let W=n.UTF8ToString(O);k.push(W),I.push(q===0?{name:W,isTensor:!1}:{name:W,isTensor:!0,type:dt(q),shape:K});{if($&&(t==null?void 0:t.preferredOutputLocation)===void 0){E.push("gpu-buffer");continue}let Z=typeof(t==null?void 0:t.preferredOutputLocation)=="string"?t.preferredOutputLocation:((g=t==null?void 0:t.preferredOutputLocation)==null?void 0:g[W])??"cpu";if(Z!=="cpu"&&Z!=="cpu-pinned"&&Z!=="gpu-buffer"&&Z!=="ml-tensor")throw new Error(`Not supported preferred output location: ${Z}.`);if($&&Z!=="gpu-buffer")throw new Error(`Not supported preferred output location: ${Z}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);E.push(Z)}}let z=null;return E.some(A=>A==="gpu-buffer"||A==="ml-tensor")&&(u=n._OrtCreateBinding(i),u===0&&me("Can't create IO binding."),z={handle:u,outputPreferredLocations:E,outputPreferredLocationsEncoded:E.map(A=>za(A))}),wt.set(i,[i,l,c,z,$,!1]),[i,w,k,S,I]}catch(b){throw l.forEach(x=>n._OrtFree(x)),c.forEach(x=>n._OrtFree(x)),u!==0&&n._OrtReleaseBinding(u)!==0&&me("Can't release IO binding."),i!==0&&n._OrtReleaseSession(i)!==0&&me("Can't release session."),b}finally{n._free(r),s!==0&&n._OrtReleaseSessionOptions(s)!==0&&me("Can't release session options."),d.forEach(b=>n._free(b)),(_=n.unmountExternalData)==null||_.call(n)}},$n=e=>{var d,l,c;let t=ye(),r=wt.get(e);if(!r)throw new Error(`cannot release session. invalid session id: ${e}`);let[a,n,i,s,u]=r;s&&(u&&t._OrtClearBoundOutputs(s.handle)!==0&&me("Can't clear bound outputs."),t._OrtReleaseBinding(s.handle)!==0&&me("Can't release IO binding.")),(d=t.jsepOnReleaseSession)==null||d.call(t,e),(l=t.webnnOnReleaseSession)==null||l.call(t,e),(c=t.webgpuOnReleaseSession)==null||c.call(t,e),n.forEach(f=>t._OrtFree(f)),i.forEach(f=>t._OrtFree(f)),t._OrtReleaseSession(a)!==0&&me("Can't release session."),wt.delete(e)},wa=async(e,t,r,a,n,i,s=!1)=>{if(!e){t.push(0);return}let u=ye(),d=u.PTR_SIZE,l=e[0],c=e[1],f=e[3],h=f,g,_;if(l==="string"&&(f==="gpu-buffer"||f==="ml-tensor"))throw new Error("String tensor is not supported on GPU.");if(s&&f!=="gpu-buffer")throw new Error(`External buffer must be provided for input/output index ${i} when enableGraphCapture is true.`);if(f==="gpu-buffer"){let $=e[2].gpuBuffer;_=Ot(Lt(l),c);{let w=u.jsepRegisterBuffer;if(!w)throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');g=w(a,i,$,_)}}else if(f==="ml-tensor"){let $=e[2].mlTensor;_=Ot(Lt(l),c);let w=u.webnnRegisterMLTensor;if(!w)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');g=w(a,$,Lt(l),c)}else{let $=e[2];if(Array.isArray($)){_=d*$.length,g=u._malloc(_),r.push(g);for(let w=0;w<$.length;w++){if(typeof $[w]!="string")throw new TypeError(`tensor data at index ${w} is not a string`);u.setValue(g+w*d,Xe($[w],r),"*")}}else{let w=u.webnnIsGraphInput;if(l!=="string"&&w){let k=u.UTF8ToString(n);if(w(a,k)){let S=Lt(l);_=Ot(S,c),h="ml-tensor";let I=u.webnnCreateTemporaryTensor,E=u.webnnUploadTensor;if(!I||!E)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');let z=await I(a,S,c);E(z,new Uint8Array($.buffer,$.byteOffset,$.byteLength)),g=z}else _=$.byteLength,g=u._malloc(_),r.push(g),u.HEAPU8.set(new Uint8Array($.buffer,$.byteOffset,_),g)}else _=$.byteLength,g=u._malloc(_),r.push(g),u.HEAPU8.set(new Uint8Array($.buffer,$.byteOffset,_),g)}}let b=u.stackSave(),x=u.stackAlloc(4*c.length);try{c.forEach((w,k)=>u.setValue(x+k*d,w,d===4?"i32":"i64"));let $=u._OrtCreateTensor(Lt(l),g,_,x,c.length,za(h));$===0&&me(`Can't create tensor for input/output. session=${a}, index=${i}.`),t.push($)}finally{u.stackRestore(b)}},vn=async(e,t,r,a,n,i)=>{var K,W,Z,ue;let s=ye(),u=s.PTR_SIZE,d=wt.get(e);if(!d)throw new Error(`cannot run inference. invalid session id: ${e}`);let l=d[0],c=d[1],f=d[2],h=d[3],g=d[4],_=d[5],b=t.length,x=a.length,$=0,w=[],k=[],S=[],I=[],E=s.stackSave(),z=s.stackAlloc(b*u),A=s.stackAlloc(b*u),O=s.stackAlloc(x*u),q=s.stackAlloc(x*u);try{[$,w]=Fd(i);for(let L=0;L<b;L++)await wa(r[L],k,I,e,c[t[L]],t[L],g);for(let L=0;L<x;L++)await wa(n[L],S,I,e,f[a[L]],b+a[L],g);for(let L=0;L<b;L++)s.setValue(z+L*u,k[L],"*"),s.setValue(A+L*u,c[t[L]],"*");for(let L=0;L<x;L++)s.setValue(O+L*u,S[L],"*"),s.setValue(q+L*u,f[a[L]],"*");if(h&&!_){let{handle:L,outputPreferredLocations:de,outputPreferredLocationsEncoded:te}=h;if(c.length!==b)throw new Error(`input count from feeds (${b}) is expected to be always equal to model's input count (${c.length}).`);for(let ae=0;ae<b;ae++){let M=t[ae];await s._OrtBindInput(L,c[M],k[ae])!==0&&me(`Can't bind input[${ae}] for session=${e}.`)}for(let ae=0;ae<x;ae++){let M=a[ae];(K=n[ae])!=null&&K[3]?s._OrtBindOutput(L,f[M],S[ae],0)!==0&&me(`Can't bind pre-allocated output[${ae}] for session=${e}.`):s._OrtBindOutput(L,f[M],0,te[M])!==0&&me(`Can't bind output[${ae}] to ${de[ae]} for session=${e}.`)}wt.set(e,[l,c,f,h,g,!0])}(W=s.jsepOnRunStart)==null||W.call(s,l),(Z=s.webnnOnRunStart)==null||Z.call(s,l);let ee;h?ee=await s._OrtRunWithBinding(l,h.handle,x,O,$):ee=await s._OrtRun(l,A,z,b,q,x,O,$),ee!==0&&me("failed to call OrtRun().");let j=[];for(let L=0;L<x;L++){let de=Number(s.getValue(O+L*u,"*"));if(de===S[L]){j.push(n[L]);continue}let te=s.stackSave(),ae=s.stackAlloc(4*u),M=!1,P,G=0;try{s._OrtGetTensorData(de,ae,ae+u,ae+2*u,ae+3*u)!==0&&me(`Can't access output tensor data on index ${L}.`);let oe=u===4?"i32":"i64",Ie=Number(s.getValue(ae,oe));G=s.getValue(ae+u,"*");let D=s.getValue(ae+u*2,"*"),ge=Number(s.getValue(ae+u*3,oe)),We=[];for(let Se=0;Se<ge;Se++)We.push(Number(s.getValue(D+Se*u,oe)));s._OrtFree(D)!==0&&me("Can't free memory for tensor dims.");let Be=We.reduce((Se,he)=>Se*he,1);P=dt(Ie);let St=h==null?void 0:h.outputPreferredLocations[a[L]];if(P==="string"){if(St==="gpu-buffer"||St==="ml-tensor")throw new Error("String tensor is not supported on GPU.");let Se=[];for(let he=0;he<Be;he++){let tt=s.getValue(G+he*u,"*"),Zt=s.getValue(G+(he+1)*u,"*"),kt=he===Be-1?void 0:Zt-tt;Se.push(s.UTF8ToString(tt,kt))}j.push([P,We,Se,"cpu"])}else if(St==="gpu-buffer"&&Be>0){let Se=s.jsepGetBuffer;if(!Se)throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');let he=Se(G),tt=Ot(Ie,Be);if(tt===void 0||!rn(P))throw new Error(`Unsupported data type: ${P}`);M=!0,j.push([P,We,{gpuBuffer:he,download:s.jsepCreateDownloader(he,tt,P),dispose:()=>{s._OrtReleaseTensor(de)!==0&&me("Can't release tensor.")}},"gpu-buffer"])}else if(St==="ml-tensor"&&Be>0){let Se=s.webnnEnsureTensor,he=s.webnnIsInt64Supported;if(!Se||!he)throw new Error('preferredLocation "ml-tensor" is not supported without using WebNN.');if(Ot(Ie,Be)===void 0||!an(P))throw new Error(`Unsupported data type: ${P}`);if(P==="int64"&&!he(e))throw new Error('preferredLocation "ml-tensor" for int64 output is not supported by current WebNN Context.');let tt=await Se(e,G,Ie,We,!1);M=!0,j.push([P,We,{mlTensor:tt,download:s.webnnCreateMLTensorDownloader(G,P),dispose:()=>{s.webnnReleaseTensorId(G),s._OrtReleaseTensor(de)}},"ml-tensor"])}else{let Se=tn(P),he=new Se(Be);new Uint8Array(he.buffer,he.byteOffset,he.byteLength).set(s.HEAPU8.subarray(G,G+he.byteLength)),j.push([P,We,he,"cpu"])}}finally{s.stackRestore(te),P==="string"&&G&&s._free(G),M||s._OrtReleaseTensor(de),(ue=s.webnnOnRunEnd)==null||ue.call(s,l)}}return h&&!g&&(s._OrtClearBoundOutputs(h.handle)!==0&&me("Can't clear bound outputs."),wt.set(e,[l,c,f,h,g,!1])),j}finally{s.stackRestore(E),k.forEach(ee=>s._OrtReleaseTensor(ee)),S.forEach(ee=>s._OrtReleaseTensor(ee)),I.forEach(ee=>s._free(ee)),$!==0&&s._OrtReleaseRunOptions($),w.forEach(ee=>s._free(ee))}},xn=e=>{let t=ye(),r=wt.get(e);if(!r)throw new Error("invalid session id");let a=r[0],n=t._OrtEndProfiling(a);n===0&&me("Can't get an profile file name."),t._OrtFree(n)},Sn=e=>{let t=[];for(let r of e){let a=r[2];!Array.isArray(a)&&"buffer"in a&&t.push(a.buffer)}return t}}),$t,Re,Wt,lr,dr,Lr,$a,Vr,zt,Ct,yd,Kf,Zf,Qf,Xf,Yf,Jf,eh,th=U(()=>{et(),Ff(),Nt(),Ya(),$t=()=>!!be.wasm.proxy&&typeof document<"u",Wt=!1,lr=!1,dr=!1,Vr=new Map,zt=(e,t)=>{let r=Vr.get(e);r?r.push(t):Vr.set(e,[t])},Ct=()=>{if(Wt||!lr||dr||!Re)throw new Error("worker not ready")},yd=e=>{switch(e.data.type){case"init-wasm":Wt=!1,e.data.err?(dr=!0,$a[1](e.data.err)):(lr=!0,$a[0]()),Lr&&(URL.revokeObjectURL(Lr),Lr=void 0);break;case"init-ep":case"copy-from":case"create":case"release":case"run":case"end-profiling":{let t=Vr.get(e.data.type);e.data.err?t.shift()[1](e.data.err):t.shift()[0](e.data.out);break}}},Kf=async()=>{if(!lr){if(Wt)throw new Error("multiple calls to 'initWasm()' detected.");if(dr)throw new Error("previous call to 'initWasm()' failed.");if(Wt=!0,$t())return new Promise((e,t)=>{Re==null||Re.terminate(),Gd().then(([r,a])=>{try{Re=a,Re.onerror=i=>t(i),Re.onmessage=yd,$a=[e,t];let n={type:"init-wasm",in:be};!n.in.wasm.wasmPaths&&(r||Ea)&&(n.in.wasm.wasmPaths={wasm:new URL(""+new URL("ort-wasm-simd-threaded.jsep-B0T3yYHD.wasm",import.meta.url).href,import.meta.url).href}),Re.postMessage(n),Lr=r}catch(n){t(n)}},t)});try{await Ja(be.wasm),await yn(be),lr=!0}catch(e){throw dr=!0,e}finally{Wt=!1}}},Zf=async e=>{if($t())return Ct(),new Promise((t,r)=>{zt("init-ep",[t,r]);let a={type:"init-ep",in:{epName:e,env:be}};Re.postMessage(a)});await bn(be,e)},Qf=async e=>$t()?(Ct(),new Promise((t,r)=>{zt("copy-from",[t,r]);let a={type:"copy-from",in:{buffer:e}};Re.postMessage(a,[e.buffer])})):Jr(e),Xf=async(e,t)=>{if($t()){if(t!=null&&t.preferredOutputLocation)throw new Error('session option "preferredOutputLocation" is not supported for proxy.');return Ct(),new Promise((r,a)=>{zt("create",[r,a]);let n={type:"create",in:{model:e,options:{...t}}},i=[];e instanceof Uint8Array&&i.push(e.buffer),Re.postMessage(n,i)})}else return wn(e,t)},Yf=async e=>{if($t())return Ct(),new Promise((t,r)=>{zt("release",[t,r]);let a={type:"release",in:e};Re.postMessage(a)});$n(e)},Jf=async(e,t,r,a,n,i)=>{if($t()){if(r.some(s=>s[3]!=="cpu"))throw new Error("input tensor on GPU is not supported for proxy.");if(n.some(s=>s))throw new Error("pre-allocated output tensor is not supported for proxy.");return Ct(),new Promise((s,u)=>{zt("run",[s,u]);let d=r,l={type:"run",in:{sessionId:e,inputIndices:t,inputs:d,outputIndices:a,options:i}};Re.postMessage(l,Sn(d))})}else return vn(e,t,r,a,n,i)},eh=async e=>{if($t())return Ct(),new Promise((t,r)=>{zt("end-profiling",[t,r]);let a={type:"end-profiling",in:e};Re.postMessage(a)});xn(e)}}),va,bd,rh,Xg=U(()=>{et(),th(),J(),Xa(),Zd(),va=(e,t)=>{switch(e.location){case"cpu":return[e.type,e.dims,e.data,"cpu"];case"gpu-buffer":return[e.type,e.dims,{gpuBuffer:e.gpuBuffer},"gpu-buffer"];case"ml-tensor":return[e.type,e.dims,{mlTensor:e.mlTensor},"ml-tensor"];default:throw new Error(`invalid data location: ${e.location} for ${t()}`)}},bd=e=>{switch(e[3]){case"cpu":return new je(e[0],e[2],e[1]);case"gpu-buffer":{let t=e[0];if(!rn(t))throw new Error(`not supported data type: ${t} for deserializing GPU tensor`);let{gpuBuffer:r,download:a,dispose:n}=e[2];return je.fromGpuBuffer(r,{dataType:t,dims:e[1],download:a,dispose:n})}case"ml-tensor":{let t=e[0];if(!an(t))throw new Error(`not supported data type: ${t} for deserializing MLTensor tensor`);let{mlTensor:r,download:a,dispose:n}=e[2];return je.fromMLTensor(r,{dataType:t,dims:e[1],download:a,dispose:n})}default:throw new Error(`invalid data location: ${e[3]}`)}},rh=class{async fetchModelAndCopyToWasmMemory(e){return Qf(await nn(e))}async loadModel(e,t){st();let r;typeof e=="string"?r=await this.fetchModelAndCopyToWasmMemory(e):r=e,[this.sessionId,this.inputNames,this.outputNames,this.inputMetadata,this.outputMetadata]=await Xf(r,t),Ye()}async dispose(){return Yf(this.sessionId)}async run(e,t,r){st();let a=[],n=[];Object.entries(e).forEach(f=>{let h=f[0],g=f[1],_=this.inputNames.indexOf(h);if(_===-1)throw new Error(`invalid input '${h}'`);a.push(g),n.push(_)});let i=[],s=[];Object.entries(t).forEach(f=>{let h=f[0],g=f[1],_=this.outputNames.indexOf(h);if(_===-1)throw new Error(`invalid output '${h}'`);i.push(g),s.push(_)});let u=a.map((f,h)=>va(f,()=>`input "${this.inputNames[n[h]]}"`)),d=i.map((f,h)=>f?va(f,()=>`output "${this.outputNames[s[h]]}"`):null),l=await Jf(this.sessionId,n,u,s,d,r),c={};for(let f=0;f<l.length;f++)c[this.outputNames[s[f]]]=i[f]??bd(l[f]);return Ye(),c}startProfiling(){}endProfiling(){eh(this.sessionId)}}}),ih={};Ft(ih,{OnnxruntimeWebAssemblyBackend:()=>Va,initializeFlags:()=>La,wasmBackend:()=>ah});var La,Va,ah,Yg=U(()=>{et(),th(),Xg(),La=()=>{(typeof be.wasm.initTimeout!="number"||be.wasm.initTimeout<0)&&(be.wasm.initTimeout=0);let e=be.wasm.simd;if(typeof e!="boolean"&&e!==void 0&&e!=="fixed"&&e!=="relaxed"&&(console.warn(`Property "env.wasm.simd" is set to unknown value "${e}". Reset it to \`false\` and ignore SIMD feature checking.`),be.wasm.simd=!1),typeof be.wasm.proxy!="boolean"&&(be.wasm.proxy=!1),typeof be.wasm.trace!="boolean"&&(be.wasm.trace=!1),typeof be.wasm.numThreads!="number"||!Number.isInteger(be.wasm.numThreads)||be.wasm.numThreads<=0)if(typeof self<"u"&&!self.crossOriginIsolated)be.wasm.numThreads=1;else{let t=typeof navigator>"u"?Nm("node:os").cpus().length:navigator.hardwareConcurrency;be.wasm.numThreads=Math.min(4,Math.ceil((t||1)/2))}},Va=class{async init(e){La(),await Kf(),await Zf(e)}async createInferenceSessionHandler(e,t){let r=new rh;return await r.loadModel(e,t),r}},ah=new Va});et();et();et();var Jg="1.22.0-dev.20250409-89f8206ba4";{let e=(Yg(),gr(ih)).wasmBackend;Vt("webgpu",e,5),Vt("webnn",e,5),Vt("cpu",e,10),Vt("wasm",e,10)}Object.defineProperty(be.versions,"web",{value:Jg,enumerable:!0});/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*//**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 *//**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function e0(e){let t=e.width,r=e.height,a=-1,n=-1;for(let i=0;i<e.height;i++)for(let s=0;s<e.width;s++)(e.data[(i*e.width+s)*4+3]>0||e.data[(i*e.width+s)*4]>0)&&(t=Math.min(t,s),r=Math.min(r,i),a=Math.max(a,s),n=Math.max(n,i));return a<0?null:{x:t,y:r,width:a-t+1,height:n-r+1}}function wd(e){const t=new ImageData(e.width,e.height);for(let r=0;r<e.data.length;r+=4){const a=e.data[r]>127||e.data[r+3]>127?255:0;t.data[r]=t.data[r+1]=t.data[r+2]=a,t.data[r+3]=255}return t}function t0(e,t){if(t<=0)return wd(e);const r=wd(e),a=new ImageData(e.width,e.height),n=t*t;for(let i=0;i<r.height;i++)for(let s=0;s<r.width;s++){let u=!1;for(let l=-t;l<=t&&!u;l++)for(let c=-t;c<=t;c++){if(c*c+l*l>n)continue;const f=s+c,h=i+l;if(f>=0&&h>=0&&f<r.width&&h<r.height&&r.data[(h*r.width+f)*4]>0){u=!0;break}}const d=(i*r.width+s)*4;a.data[d]=a.data[d+1]=a.data[d+2]=u?255:0,a.data[d+3]=255}return a}function r0(e,t){if(t<=0)return e;const r=new ImageData(e.width,e.height),a=Math.ceil(t);for(let n=0;n<e.height;n++)for(let i=0;i<e.width;i++){let s=0,u=0;for(let c=-a;c<=a;c++)for(let f=-a;f<=a;f++){const h=i+f,g=n+c;h>=0&&g>=0&&h<e.width&&g<e.height&&(s+=e.data[(g*e.width+h)*4],u++)}const d=(n*e.width+i)*4,l=Math.round(s/u);r.data[d]=r.data[d+1]=r.data[d+2]=l,r.data[d+3]=255}return r}function i0(e,t,r,a){const n=Math.max(0,Math.floor(e.x-t)),i=Math.max(0,Math.floor(e.y-t)),s=Math.min(r,Math.ceil(e.x+e.width+t)),u=Math.min(a,Math.ceil(e.y+e.height+t));return{x:n,y:i,width:s-n,height:u-i}}function xa(e,t,r){const a=document.createElement("canvas"),n=document.createElement("canvas");a.width=e.width,a.height=e.height,n.width=t,n.height=r,a.getContext("2d").putImageData(e,0,0);const i=n.getContext("2d");return i.imageSmoothingEnabled=!0,i.drawImage(a,0,0,t,r),i.getImageData(0,0,t,r)}class a0{constructor(t="./models/lama.onnx"){er(this,"session",null);er(this,"modelPromise",null);er(this,"lastTiming",{});this.modelPath=t}async load(){if(!navigator.gpu)throw new Error("WebGPU is unavailable. Use a recent Chrome or Edge browser with WebGPU enabled.");this.modelPromise||(this.modelPromise=Qa.create(this.modelPath,{executionProviders:["webgpu"]}).then(t=>(this.session=t,t)));try{return await this.modelPromise}catch{throw this.modelPromise=null,new Error(`Could not load the local LaMa model at ${this.modelPath}.`)}}async inpaint(t,r,a){var q,K;const n=performance.now(),i=e0(r);if(!i)throw new Error("Paint an area to remove before running inpainting.");const s=await this.load(),u=t0(r,a.maskDilation),d=i0(i,a.cropPadding,t.width,t.height),l=n0(a.inferenceSize,d.width,d.height),c=xa(xi(t,d),l,l),f=xa(xi(u,d),l,l);(q=a.onStatus)==null||q.call(a,"Running local AI");const h=performance.now(),g=new Float32Array(l*l*3),_=new Float32Array(l*l);for(let W=0;W<l*l;W++)g[W]=c.data[W*4]/255,g[l*l+W]=c.data[W*4+1]/255,g[l*l*2+W]=c.data[W*4+2]/255,_[W]=f.data[W*4]>127?1:0;this.lastTiming.preprocess=performance.now()-h;const b=new je("float32",g,[1,3,l,l]),x=new je("float32",_,[1,1,l,l]),$=performance.now();let w;try{w=await s.run({[s.inputNames[0]]:b,[s.inputNames[1]]:x})}catch(W){throw console.error("[AnyPNG] WebGPU inference failed",W),new Error("Local inference failed. The model may use an unsupported operator or require more GPU memory.")}this.lastTiming.inference=performance.now()-$;const S=w[s.outputNames[0]].data,I=new ImageData(d.width,d.height),E=xa(f,d.width,d.height),z=r0(xi(E,{x:0,y:0,width:E.width,height:E.height}),a.blendFeather);for(let W=0;W<d.width*d.height;W++){const Z=Math.min(l-1,Math.floor(W%d.width*l/d.width)),ue=Math.min(l-1,Math.floor(Math.floor(W/d.width)*l/d.height)),ee=ue*l+Z;I.data[W*4]=Sa(S[ee]*255),I.data[W*4+1]=Sa(S[l*l+ee]*255),I.data[W*4+2]=Sa(S[l*l*2+ee]*255),I.data[W*4+3]=255}(K=a.onStatus)==null||K.call(a,"Blending result");const A=performance.now(),O=Om(t,I,z,d);return this.lastTiming.composite=performance.now()-A,this.lastTiming.total=performance.now()-n,O}dispose(){var t;(t=this.session)==null||t.release(),this.session=null,this.modelPromise=null}}function Sa(e){return Math.max(0,Math.min(255,Math.round(e)))}function n0(e,t,r){if(e!=="auto")return e;const a=Math.max(t,r);return a>1800?1024:a>900?768:512}const s0=document.querySelector("#app");s0.innerHTML=`<header><div><span class="eyebrow">ANYPNG / LOCAL AI</span><h1>Inpaint images privately</h1><p>Mask an unwanted overlay and reconstruct it locally in your browser.</p></div><div id="gpu-badge" class="badge">Checking WebGPU…</div></header>
<main><section class="workspace"><div id="dropzone" class="dropzone"><input id="file" type="file" accept="image/png,image/jpeg,image/webp" hidden><button id="upload" class="primary">Upload image</button><span>or drop a PNG, JPG, or WebP here</span></div><div id="canvas-wrap" class="canvas-wrap hidden"><div id="stage"><canvas id="image-canvas"></canvas><canvas id="mask-canvas"></canvas></div></div><div class="toolbar"><label>Brush <input id="brush" type="range" min="4" max="240" value="48"><output id="brush-value">48 px</output></label><label>Mask opacity <input id="opacity" type="range" min="10" max="100" value="55"></label><div class="buttons"><button data-mode="paint" class="tool active">Paint</button><button data-mode="erase" class="tool">Erase</button><button id="undo" class="tool">Undo</button><button id="redo" class="tool">Redo</button><button id="clear" class="tool">Clear</button></div><div class="buttons"><button id="fit" class="tool">Fit</button><button id="reset" class="tool">Reset view</button><button id="before" class="tool">Hold for original</button></div></div></section>
<aside><section class="card"><h2>Inference</h2><div class="segmented"><label><input type="radio" name="size" value="512" checked>512</label><label><input type="radio" name="size" value="768">768</label><label><input type="radio" name="size" value="1024">1024</label><label><input type="radio" name="size" value="auto">Auto</label></div><button id="run" class="primary full" disabled>Remove selected area</button><div id="status" class="status">Upload an image to begin.</div></section><section class="card"><h2>Export</h2><select id="format"><option value="png">PNG</option><option value="jpeg">JPEG</option><option value="webp">WebP</option></select><label class="quality">Quality <input id="quality" type="range" min="10" max="100" value="92"><output id="quality-value">92%</output></label><button id="download" class="secondary full" disabled>Download result</button></section><section class="card diagnostics"><h2>Diagnostics</h2><dl><dt>WebGPU</dt><dd id="gpu-detail">—</dd><dt>Model</dt><dd id="model-time">—</dd><dt>Preprocess</dt><dd id="prep-time">—</dd><dt>Inference</dt><dd id="infer-time">—</dd><dt>Composite</dt><dd id="comp-time">—</dd><dt>Total</dt><dd id="total-time">—</dd></dl><div id="debug" class="debug hidden"></div></section></aside></main>`;const ja=document.querySelector("#image-canvas"),Ee=document.querySelector("#mask-canvas"),Ga=document.querySelector("#canvas-wrap"),$d=document.querySelector("#stage"),nh=ja.getContext("2d"),Ce=Ee.getContext("2d"),yr=new a0;let Me=null,Dt=null,ei=!1,sh="paint",Ha=.55,Fa=48,ka=1,pt=[],Je=-1;const se=e=>document.querySelector(`#${e}`),Ge=document.createElement("button");Ge.id="benchmark";Ge.className="secondary full";Ge.disabled=!0;Ge.textContent="Benchmark 512 / 768 / 1024";se("run").after(Ge);function qe(e){se("status").textContent=e}function Kt(){Ce.clearRect(0,0,Ee.width,Ee.height),pt[Je]&&Ce.putImageData(pt[Je],0,0),Ce.globalAlpha=Ha,Ce.globalCompositeOperation="source-over",Ce.fillStyle="#ff4d78";const e=Ce.getImageData(0,0,Ee.width,Ee.height);for(let t=0;t<e.data.length;t+=4)e.data[t+3]&&(e.data[t]=255,e.data[t+1]=77,e.data[t+2]=120,e.data[t+3]=Math.round(255*Ha));Ce.putImageData(e,0,0),Ce.globalAlpha=1}function kn(){Me&&(nh.putImageData(Dt&&se("before").dataset.down!=="1"?Dt:Me,0,0),Kt())}function oh(){const e=Ce.getImageData(0,0,Ee.width,Ee.height);pt=pt.slice(0,Je+1),pt.push(e),Je++,Kt()}function o0(e){const t=Ee.getBoundingClientRect();return{x:Math.max(0,Math.min(Ee.width-1,(e.clientX-t.left)*Ee.width/t.width)),y:Math.max(0,Math.min(Ee.height-1,(e.clientY-t.top)*Ee.height/t.height))}}function uh(e){const t=o0(e);Ce.save(),Ce.globalCompositeOperation=sh==="erase"?"destination-out":"source-over",Ce.fillStyle="rgba(255,77,120,1)",Ce.beginPath(),Ce.arc(t.x,t.y,Fa/2,0,Math.PI*2),Ce.fill(),Ce.restore(),Kt()}function In(e){Am(e).then(t=>{Me=t,Dt=null,[ja.width,Ee.width]=[t.width,t.width],[ja.height,Ee.height]=[t.height,t.height],pt=[new ImageData(t.width,t.height)],Je=0,Ga.classList.remove("hidden"),se("dropzone").classList.add("hidden"),se("run").removeAttribute("disabled"),Ge.disabled=!1,se("download").setAttribute("disabled",""),ti(),kn(),qe(`${t.width} × ${t.height} ready. Paint the area to remove.`)}).catch(()=>qe("Could not read that image. Try PNG, JPG, or WebP."))}function ti(){if(!Me)return;const e=Ga.clientWidth-24,t=Math.max(360,window.innerHeight*.65);ka=Math.min(1,e/Me.width,t/Me.height),$d.style.transform=`scale(${ka})`,$d.style.transformOrigin="top left",Ga.style.height=`${Me.height*ka+24}px`}se("upload").onclick=()=>se("file").click();se("file").onchange=()=>{var t;const e=(t=se("file").files)==null?void 0:t[0];e&&In(e)};["dragover","drop"].forEach(e=>se("dropzone").addEventListener(e,t=>{var r;if(t.preventDefault(),e==="drop"){const a=(r=t.dataTransfer)==null?void 0:r.files[0];a&&In(a)}}));Ee.addEventListener("pointerdown",e=>{ei=!0,Ee.setPointerCapture(e.pointerId),uh(e)});Ee.addEventListener("pointermove",e=>{ei&&uh(e)});Ee.addEventListener("pointerup",()=>{ei&&(ei=!1,oh())});document.querySelectorAll(".tool[data-mode]").forEach(e=>e.onclick=()=>{sh=e.dataset.mode,document.querySelectorAll(".tool[data-mode]").forEach(t=>t.classList.toggle("active",t===e))});se("brush").oninput=e=>{Fa=Number(e.target.value),se("brush-value").textContent=`${Fa} px`};se("opacity").oninput=e=>{Ha=Number(e.target.value)/100,Kt()};se("undo").onclick=()=>{Je>0&&(Je--,Kt())};se("redo").onclick=()=>{Je<pt.length-1&&(Je++,Kt())};se("clear").onclick=()=>{Me&&(Ce.clearRect(0,0,Me.width,Me.height),oh())};se("fit").onclick=ti;se("reset").onclick=ti;se("before").onpointerdown=()=>{se("before").dataset.down="1",kn()};se("before").onpointerup=()=>{delete se("before").dataset.down,kn()};se("quality").oninput=e=>se("quality-value").textContent=`${e.target.value}%`;async function u0(){if(!Me)return;const e=performance.now();try{qe("Preparing image…");const t=document.querySelector("input[name=size]:checked").value,r=t==="auto"?"auto":Number(t);Dt=await yr.inpaint(Me,pt[Je],{inferenceSize:r,maskDilation:8,cropPadding:64,blendFeather:8,onStatus:qe}),nh.putImageData(Dt,0,0),se("download").removeAttribute("disabled");const a=yr.lastTiming;se("prep-time").textContent=`${Math.round(a.preprocess??0)} ms`,se("infer-time").textContent=`${Math.round(a.inference??0)} ms`,se("comp-time").textContent=`${Math.round(a.composite??0)} ms`,se("total-time").textContent=`${Math.round(performance.now()-e)} ms`,se("status").textContent="Done. Hold “original” to compare."}catch(t){console.error("[AnyPNG] inpainting error",t),qe(t instanceof Error?t.message:"Inpainting failed.")}}se("run").onclick=u0;se("download").onclick=()=>{if(!Dt)return;const e=se("format").value,t=Number(se("quality").value)/100;Bm(Dt).toBlob(a=>{if(!a)return;const n=document.createElement("a");n.href=URL.createObjectURL(a),n.download=`AnyPNG_Inpainted_${Date.now()}.${e}`,n.click(),setTimeout(()=>URL.revokeObjectURL(n.href),1e3)},`image/${e}`,e==="png"?void 0:t)};Ge.onclick=async()=>{if(!Me)return;const e=pt[Je];Ge.disabled=!0;try{for(const t of[512,768,1024])qe(`Benchmarking ${t}…`),await yr.inpaint(Me,e,{inferenceSize:t,maskDilation:8,cropPadding:64,blendFeather:8}),console.log(`[AnyPNG] benchmark ${t}`,yr.lastTiming);qe("Benchmark complete. See the developer console for timings.")}catch(t){console.error("[AnyPNG] benchmark failed",t),qe(t instanceof Error?t.message:"Benchmark failed.")}finally{Ge.disabled=!1}};(async()=>{const e=se("gpu-badge");if(!navigator.gpu){e.textContent="WebGPU unavailable",e.classList.add("error"),se("gpu-detail").textContent="No";return}e.textContent="WebGPU ready",se("gpu-detail").textContent="Yes",new URLSearchParams(location.search).get("debug")==="true"&&se("debug").classList.remove("hidden");try{const r=performance.now();await yr.load(),se("model-time").textContent=`${Math.round(performance.now()-r)} ms`,qe("Local model ready. Upload an image to begin.")}catch(r){console.error("[AnyPNG] model load",r),qe(r instanceof Error?r.message:"Model could not be loaded.")}})();window.addEventListener("resize",ti);async function l0(){const e=new URLSearchParams(location.search).get("job");if(!e)return;const t=await new Promise((r,a)=>{const n=indexedDB.open("anypng-local-editor",1);n.onerror=()=>a(n.error),n.onsuccess=()=>{const i=n.result.transaction("jobs","readonly").objectStore("jobs").get(e);i.onsuccess=()=>{var s;return(s=i.result)!=null&&s.blob?r(i.result.blob):a(new Error("The image hand-off expired."))},i.onerror=()=>a(i.error)}});In(t)}l0().catch(e=>{console.error("[AnyPNG] extension image hand-off",e),qe(e instanceof Error?e.message:"Could not load the selected image.")});async function lh(){var t;const e=globalThis.chrome;if(!((t=e==null?void 0:e.runtime)!=null&&t.sendMessage))return qe("Open this editor from the AnyPNG extension to use account credits."),!1;try{const r=await e.runtime.sendMessage({action:"AUTHORIZE_INPAINT"});if(!(r!=null&&r.authorized)||!r.permit)throw new Error((r==null?void 0:r.detail)||"No inpainting credits remaining.");return!0}catch(r){return qe(r instanceof Error?r.message:"Credit authorization failed."),!1}}const Ia=se("run").onclick;se("run").onclick=async()=>{await lh()&&await(Ia==null?void 0:Ia.call(se("run"),new PointerEvent("click")))};const Ta=Ge.onclick;Ge.onclick=async()=>{await lh()&&await(Ta==null?void 0:Ta.call(Ge,new PointerEvent("click")))};
