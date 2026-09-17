var Cg=Object.defineProperty;var zg=(e,t,r)=>t in e?Cg(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var tr=(e,t,r)=>zg(e,typeof t!="symbol"?t+"":t,r);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function r(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(n){if(n.ep)return;n.ep=!0;const i=r(n);fetch(n.href,i)}})();function Ag(e){return createImageBitmap(e).then(t=>{const r=document.createElement("canvas");r.width=t.width,r.height=t.height;const a=r.getContext("2d",{willReadFrequently:!0});return a.drawImage(t,0,0),t.close(),a.getImageData(0,0,r.width,r.height)})}function Ii(e,t){const r=new ImageData(t.width,t.height);for(let a=0;a<t.height;a++)r.data.set(e.data.slice(((t.y+a)*e.width+t.x)*4,((t.y+a)*e.width+t.x+t.width)*4),a*t.width*4);return r}function Og(e,t,r,a){const n=new ImageData(new Uint8ClampedArray(e.data),e.width,e.height);for(let i=0;i<a.height;i++)for(let s=0;s<a.width;s++){const u=(i*r.width+s)*4,d=r.data[u]/255,l=((a.y+i)*e.width+a.x+s)*4,c=(i*t.width+s)*4;if(!(d<=0))for(let f=0;f<3;f++)n.data[l+f]=Math.round(n.data[l+f]*(1-d)+t.data[c+f]*d)}return n}function _p(e){const t=document.createElement("canvas");return t.width=e.width,t.height=e.height,t.getContext("2d").putImageData(e,0,0),t}/*!
 * ONNX Runtime Web v1.22.0-dev.20250409-89f8206ba4
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */var _n=Object.defineProperty,Rg=Object.getOwnPropertyDescriptor,Mg=Object.getOwnPropertyNames,Bg=Object.prototype.hasOwnProperty,Ng=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(t,r)=>(typeof require<"u"?require:t)[r]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')}),W=(e,t)=>()=>(e&&(t=e(e=0)),t),Qt=(e,t)=>{for(var r in t)_n(e,r,{get:t[r],enumerable:!0})},Dg=(e,t,r,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of Mg(t))!Bg.call(e,n)&&n!==r&&_n(e,n,{get:()=>t[n],enumerable:!(a=Rg(t,n))||a.enumerable});return e},_r=e=>Dg(_n({},"__esModule",{value:!0}),e),rr,St,Ht,ho,bp,wp=W(()=>{rr=new Map,St=[],Ht=(e,t,r)=>{if(t&&typeof t.init=="function"&&typeof t.createInferenceSessionHandler=="function"){let a=rr.get(e);if(a===void 0)rr.set(e,{backend:t,priority:r});else{if(a.priority>r)return;if(a.priority===r&&a.backend!==t)throw new Error(`cannot register backend "${e}" using priority ${r}`)}if(r>=0){let n=St.indexOf(e);n!==-1&&St.splice(n,1);for(let i=0;i<St.length;i++)if(rr.get(St[i]).priority<=r){St.splice(i,0,e);return}St.push(e)}return}throw new TypeError("not a valid backend")},ho=async e=>{let t=rr.get(e);if(!t)return"backend not found.";if(t.initialized)return t.backend;if(t.aborted)return t.error;{let r=!!t.initPromise;try{return r||(t.initPromise=t.backend.init(e)),await t.initPromise,t.initialized=!0,t.backend}catch(a){return r||(t.error=`${a}`,t.aborted=!0),t.error}finally{delete t.initPromise}}},bp=async e=>{let t=e.executionProviders||[],r=t.map(d=>typeof d=="string"?d:d.name),a=r.length===0?St:r,n,i=[],s=new Set;for(let d of a){let l=await ho(d);typeof l=="string"?i.push({name:d,err:l}):(n||(n=l),n===l&&s.add(d))}if(!n)throw new Error(`no available backend found. ERR: ${i.map(d=>`[${d.name}] ${d.err}`).join(", ")}`);for(let{name:d,err:l}of i)r.includes(d)&&console.warn(`removing requested execution provider "${d}" from session options because it is not available: ${l}`);let u=t.filter(d=>s.has(typeof d=="string"?d:d.name));return[n,new Proxy(e,{get:(d,l)=>l==="executionProviders"?u:Reflect.get(d,l)})]}}),Pg=W(()=>{wp()}),vp,Lg=W(()=>{vp="1.22.0-dev.20250409-89f8206ba4"}),Ti,Ke,$p=W(()=>{Lg(),Ti="warning",Ke={wasm:{},webgl:{},webgpu:{},versions:{common:vp},set logLevel(e){if(e!==void 0){if(typeof e!="string"||["verbose","info","warning","error","fatal"].indexOf(e)===-1)throw new Error(`Unsupported logging level: ${e}`);Ti=e}},get logLevel(){return Ti}},Object.defineProperty(Ke,"logLevel",{enumerable:!0})}),Se,Ug=W(()=>{$p(),Se=Ke}),xp,Sp,qg=W(()=>{xp=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas"):new OffscreenCanvas(1,1);r.width=e.dims[3],r.height=e.dims[2];let a=r.getContext("2d");if(a!=null){let n,i;(t==null?void 0:t.tensorLayout)!==void 0&&t.tensorLayout==="NHWC"?(n=e.dims[2],i=e.dims[3]):(n=e.dims[3],i=e.dims[2]);let s=(t==null?void 0:t.format)!==void 0?t.format:"RGB",u=t==null?void 0:t.norm,d,l;u===void 0||u.mean===void 0?d=[255,255,255,255]:typeof u.mean=="number"?d=[u.mean,u.mean,u.mean,u.mean]:(d=[u.mean[0],u.mean[1],u.mean[2],0],u.mean[3]!==void 0&&(d[3]=u.mean[3])),u===void 0||u.bias===void 0?l=[0,0,0,0]:typeof u.bias=="number"?l=[u.bias,u.bias,u.bias,u.bias]:(l=[u.bias[0],u.bias[1],u.bias[2],0],u.bias[3]!==void 0&&(l[3]=u.bias[3]));let c=i*n,f=0,h=c,g=c*2,y=-1;s==="RGBA"?(f=0,h=c,g=c*2,y=c*3):s==="RGB"?(f=0,h=c,g=c*2):s==="RBG"&&(f=0,g=c,h=c*2);for(let b=0;b<i;b++)for(let x=0;x<n;x++){let v=(e.data[f++]-l[0])*d[0],w=(e.data[h++]-l[1])*d[1],k=(e.data[g++]-l[2])*d[2],S=y===-1?255:(e.data[y++]-l[3])*d[3];a.fillStyle="rgba("+v+","+w+","+k+","+S+")",a.fillRect(x,b,1,1)}if("toDataURL"in r)return r.toDataURL();throw new Error("toDataURL is not supported")}else throw new Error("Can not access image data")},Sp=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas").getContext("2d"):new OffscreenCanvas(1,1).getContext("2d"),a;if(r!=null){let n,i,s;(t==null?void 0:t.tensorLayout)!==void 0&&t.tensorLayout==="NHWC"?(n=e.dims[2],i=e.dims[1],s=e.dims[3]):(n=e.dims[3],i=e.dims[2],s=e.dims[1]);let u=t!==void 0&&t.format!==void 0?t.format:"RGB",d=t==null?void 0:t.norm,l,c;d===void 0||d.mean===void 0?l=[255,255,255,255]:typeof d.mean=="number"?l=[d.mean,d.mean,d.mean,d.mean]:(l=[d.mean[0],d.mean[1],d.mean[2],255],d.mean[3]!==void 0&&(l[3]=d.mean[3])),d===void 0||d.bias===void 0?c=[0,0,0,0]:typeof d.bias=="number"?c=[d.bias,d.bias,d.bias,d.bias]:(c=[d.bias[0],d.bias[1],d.bias[2],0],d.bias[3]!==void 0&&(c[3]=d.bias[3]));let f=i*n;if(t!==void 0&&(t.format!==void 0&&s===4&&t.format!=="RGBA"||s===3&&t.format!=="RGB"&&t.format!=="BGR"))throw new Error("Tensor format doesn't match input tensor dims");let h=4,g=0,y=1,b=2,x=3,v=0,w=f,k=f*2,S=-1;u==="RGBA"?(v=0,w=f,k=f*2,S=f*3):u==="RGB"?(v=0,w=f,k=f*2):u==="RBG"&&(v=0,k=f,w=f*2),a=r.createImageData(n,i);for(let I=0;I<i*n;g+=h,y+=h,b+=h,x+=h,I++)a.data[g]=(e.data[v++]-c[0])*l[0],a.data[y]=(e.data[w++]-c[1])*l[1],a.data[b]=(e.data[k++]-c[2])*l[2],a.data[x]=S===-1?255:(e.data[S++]-c[3])*l[3]}else throw new Error("Can not access image data");return a}}),Rr,kp,Ip,Tp,Ep,Cp,Wg=W(()=>{bn(),Rr=(e,t)=>{if(e===void 0)throw new Error("Image buffer must be defined");if(t.height===void 0||t.width===void 0)throw new Error("Image height and width must be defined");if(t.tensorLayout==="NHWC")throw new Error("NHWC Tensor layout is not supported yet");let{height:r,width:a}=t,n=t.norm??{mean:255,bias:0},i,s;typeof n.mean=="number"?i=[n.mean,n.mean,n.mean,n.mean]:i=[n.mean[0],n.mean[1],n.mean[2],n.mean[3]??255],typeof n.bias=="number"?s=[n.bias,n.bias,n.bias,n.bias]:s=[n.bias[0],n.bias[1],n.bias[2],n.bias[3]??0];let u=t.format!==void 0?t.format:"RGBA",d=t.tensorFormat!==void 0&&t.tensorFormat!==void 0?t.tensorFormat:"RGB",l=r*a,c=d==="RGBA"?new Float32Array(l*4):new Float32Array(l*3),f=4,h=0,g=1,y=2,b=3,x=0,v=l,w=l*2,k=-1;u==="RGB"&&(f=3,h=0,g=1,y=2,b=-1),d==="RGBA"?k=l*3:d==="RBG"?(x=0,w=l,v=l*2):d==="BGR"&&(w=0,v=l,x=l*2);for(let S=0;S<l;S++,h+=f,y+=f,g+=f,b+=f)c[x++]=(e[h]+s[0])/i[0],c[v++]=(e[g]+s[1])/i[1],c[w++]=(e[y]+s[2])/i[2],k!==-1&&b!==-1&&(c[k++]=(e[b]+s[3])/i[3]);return d==="RGBA"?new je("float32",c,[1,4,r,a]):new je("float32",c,[1,3,r,a])},kp=async(e,t)=>{let r=typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement,a=typeof ImageData<"u"&&e instanceof ImageData,n=typeof ImageBitmap<"u"&&e instanceof ImageBitmap,i=typeof e=="string",s,u=t??{},d=()=>{if(typeof document<"u")return document.createElement("canvas");if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(1,1);throw new Error("Canvas is not supported")},l=c=>typeof HTMLCanvasElement<"u"&&c instanceof HTMLCanvasElement||c instanceof OffscreenCanvas?c.getContext("2d"):null;if(r){let c=d();c.width=e.width,c.height=e.height;let f=l(c);if(f!=null){let h=e.height,g=e.width;if(t!==void 0&&t.resizedHeight!==void 0&&t.resizedWidth!==void 0&&(h=t.resizedHeight,g=t.resizedWidth),t!==void 0){if(u=t,t.tensorFormat!==void 0)throw new Error("Image input config format must be RGBA for HTMLImageElement");u.tensorFormat="RGBA",u.height=h,u.width=g}else u.tensorFormat="RGBA",u.height=h,u.width=g;f.drawImage(e,0,0),s=f.getImageData(0,0,g,h).data}else throw new Error("Can not access image data")}else if(a){let c,f;if(t!==void 0&&t.resizedWidth!==void 0&&t.resizedHeight!==void 0?(c=t.resizedHeight,f=t.resizedWidth):(c=e.height,f=e.width),t!==void 0&&(u=t),u.format="RGBA",u.height=c,u.width=f,t!==void 0){let h=d();h.width=f,h.height=c;let g=l(h);if(g!=null)g.putImageData(e,0,0),s=g.getImageData(0,0,f,c).data;else throw new Error("Can not access image data")}else s=e.data}else if(n){if(t===void 0)throw new Error("Please provide image config with format for Imagebitmap");let c=d();c.width=e.width,c.height=e.height;let f=l(c);if(f!=null){let h=e.height,g=e.width;return f.drawImage(e,0,0,g,h),s=f.getImageData(0,0,g,h).data,u.height=h,u.width=g,Rr(s,u)}else throw new Error("Can not access image data")}else{if(i)return new Promise((c,f)=>{let h=d(),g=l(h);if(!e||!g)return f();let y=new Image;y.crossOrigin="Anonymous",y.src=e,y.onload=()=>{h.width=y.width,h.height=y.height,g.drawImage(y,0,0,h.width,h.height);let b=g.getImageData(0,0,h.width,h.height);u.height=h.height,u.width=h.width,c(Rr(b.data,u))}});throw new Error("Input data provided is not supported - aborted tensor creation")}if(s!==void 0)return Rr(s,u);throw new Error("Input data provided is not supported - aborted tensor creation")},Ip=(e,t)=>{let{width:r,height:a,download:n,dispose:i}=t,s=[1,a,r,4];return new je({location:"texture",type:"float32",texture:e,dims:s,download:n,dispose:i})},Tp=(e,t)=>{let{dataType:r,dims:a,download:n,dispose:i}=t;return new je({location:"gpu-buffer",type:r??"float32",gpuBuffer:e,dims:a,download:n,dispose:i})},Ep=(e,t)=>{let{dataType:r,dims:a,download:n,dispose:i}=t;return new je({location:"ml-tensor",type:r??"float32",mlTensor:e,dims:a,download:n,dispose:i})},Cp=(e,t,r)=>new je({location:"cpu-pinned",type:e,data:t,dims:r??[t.length]})}),Mt,fr,Ei,zp,Gg=W(()=>{Mt=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],["int16",Int16Array],["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array],["int4",Uint8Array],["uint4",Uint8Array]]),fr=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],[Int16Array,"int16"],[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]),Ei=!1,zp=()=>{if(!Ei){Ei=!0;let e=typeof BigInt64Array<"u"&&BigInt64Array.from,t=typeof BigUint64Array<"u"&&BigUint64Array.from,r=globalThis.Float16Array,a=typeof r<"u"&&r.from;e&&(Mt.set("int64",BigInt64Array),fr.set(BigInt64Array,"int64")),t&&(Mt.set("uint64",BigUint64Array),fr.set(BigUint64Array,"uint64")),a?(Mt.set("float16",r),fr.set(r,"float16")):Mt.set("float16",Uint16Array)}}}),Ap,Op,jg=W(()=>{bn(),Ap=e=>{let t=1;for(let r=0;r<e.length;r++){let a=e[r];if(typeof a!="number"||!Number.isSafeInteger(a))throw new TypeError(`dims[${r}] must be an integer, got: ${a}`);if(a<0)throw new RangeError(`dims[${r}] must be a non-negative integer, got: ${a}`);t*=a}return t},Op=(e,t)=>{switch(e.location){case"cpu":return new je(e.type,e.data,t);case"cpu-pinned":return new je({location:"cpu-pinned",data:e.data,type:e.type,dims:t});case"texture":return new je({location:"texture",texture:e.texture,type:e.type,dims:t});case"gpu-buffer":return new je({location:"gpu-buffer",gpuBuffer:e.gpuBuffer,type:e.type,dims:t});case"ml-tensor":return new je({location:"ml-tensor",mlTensor:e.mlTensor,type:e.type,dims:t});default:throw new Error(`tensorReshape: tensor location ${e.location} is not supported`)}}}),je,bn=W(()=>{qg(),Wg(),Gg(),jg(),je=class{constructor(e,t,r){zp();let a,n;if(typeof e=="object"&&"location"in e)switch(this.dataLocation=e.location,a=e.type,n=e.dims,e.location){case"cpu-pinned":{let s=Mt.get(a);if(!s)throw new TypeError(`unsupported type "${a}" to create tensor from pinned buffer`);if(!(e.data instanceof s))throw new TypeError(`buffer should be of type ${s.name}`);this.cpuData=e.data;break}case"texture":{if(a!=="float32")throw new TypeError(`unsupported type "${a}" to create tensor from texture`);this.gpuTextureData=e.texture,this.downloader=e.download,this.disposer=e.dispose;break}case"gpu-buffer":{if(a!=="float32"&&a!=="float16"&&a!=="int32"&&a!=="int64"&&a!=="uint32"&&a!=="uint8"&&a!=="bool"&&a!=="uint4"&&a!=="int4")throw new TypeError(`unsupported type "${a}" to create tensor from gpu buffer`);this.gpuBufferData=e.gpuBuffer,this.downloader=e.download,this.disposer=e.dispose;break}case"ml-tensor":{if(a!=="float32"&&a!=="float16"&&a!=="int32"&&a!=="int64"&&a!=="uint32"&&a!=="uint64"&&a!=="int8"&&a!=="uint8"&&a!=="bool"&&a!=="uint4"&&a!=="int4")throw new TypeError(`unsupported type "${a}" to create tensor from MLTensor`);this.mlTensorData=e.mlTensor,this.downloader=e.download,this.disposer=e.dispose;break}default:throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`)}else{let s,u;if(typeof e=="string")if(a=e,u=r,e==="string"){if(!Array.isArray(t))throw new TypeError("A string tensor's data must be a string array.");s=t}else{let d=Mt.get(e);if(d===void 0)throw new TypeError(`Unsupported tensor type: ${e}.`);if(Array.isArray(t)){if(e==="float16"&&d===Uint16Array||e==="uint4"||e==="int4")throw new TypeError(`Creating a ${e} tensor from number array is not supported. Please use ${d.name} as data.`);e==="uint64"||e==="int64"?s=d.from(t,BigInt):s=d.from(t)}else if(t instanceof d)s=t;else if(t instanceof Uint8ClampedArray)if(e==="uint8")s=Uint8Array.from(t);else throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");else if(e==="float16"&&t instanceof Uint16Array&&d!==Uint16Array)s=new globalThis.Float16Array(t.buffer,t.byteOffset,t.length);else throw new TypeError(`A ${a} tensor's data must be type of ${d}`)}else if(u=t,Array.isArray(e)){if(e.length===0)throw new TypeError("Tensor type cannot be inferred from an empty array.");let d=typeof e[0];if(d==="string")a="string",s=e;else if(d==="boolean")a="bool",s=Uint8Array.from(e);else throw new TypeError(`Invalid element type of data array: ${d}.`)}else if(e instanceof Uint8ClampedArray)a="uint8",s=Uint8Array.from(e);else{let d=fr.get(e.constructor);if(d===void 0)throw new TypeError(`Unsupported type for tensor data: ${e.constructor}.`);a=d,s=e}if(u===void 0)u=[s.length];else if(!Array.isArray(u))throw new TypeError("A tensor's dims must be a number array");n=u,this.cpuData=s,this.dataLocation="cpu"}let i=Ap(n);if(this.cpuData&&i!==this.cpuData.length&&!((a==="uint4"||a==="int4")&&Math.ceil(i/2)===this.cpuData.length))throw new Error(`Tensor's size(${i}) does not match data length(${this.cpuData.length}).`);this.type=a,this.dims=n,this.size=i}static async fromImage(e,t){return kp(e,t)}static fromTexture(e,t){return Ip(e,t)}static fromGpuBuffer(e,t){return Tp(e,t)}static fromMLTensor(e,t){return Ep(e,t)}static fromPinnedBuffer(e,t,r){return Cp(e,t,r)}toDataURL(e){return xp(this,e)}toImageData(e){return Sp(this,e)}get data(){if(this.ensureValid(),!this.cpuData)throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw new Error("The data is not stored as a WebGL texture.");return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw new Error("The data is not stored as a WebGPU buffer.");return this.gpuBufferData}get mlTensor(){if(this.ensureValid(),!this.mlTensorData)throw new Error("The data is not stored as a WebNN MLTensor.");return this.mlTensorData}async getData(e){switch(this.ensureValid(),this.dataLocation){case"cpu":case"cpu-pinned":return this.data;case"texture":case"gpu-buffer":case"ml-tensor":{if(!this.downloader)throw new Error("The current tensor is not created with a specified data downloader.");if(this.isDownloading)throw new Error("The current tensor is being downloaded.");try{this.isDownloading=!0;let t=await this.downloader();return this.downloader=void 0,this.dataLocation="cpu",this.cpuData=t,e&&this.disposer&&(this.disposer(),this.disposer=void 0),t}finally{this.isDownloading=!1}}default:throw new Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.isDownloading)throw new Error("The current tensor is being downloaded.");this.disposer&&(this.disposer(),this.disposer=void 0),this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.mlTensorData=void 0,this.downloader=void 0,this.isDownloading=void 0,this.dataLocation="none"}ensureValid(){if(this.dataLocation==="none")throw new Error("The tensor is disposed.")}reshape(e){if(this.ensureValid(),this.downloader||this.disposer)throw new Error("Cannot reshape a tensor that owns GPU resource.");return Op(this,e)}}}),Ze,Rp=W(()=>{bn(),Ze=je}),Zr,Ci,lt,rt,Mp=W(()=>{$p(),Zr=(e,t)=>{(typeof Ke.trace>"u"?!Ke.wasm.trace:!Ke.trace)||console.timeStamp(`${e}::ORT::${t}`)},Ci=(e,t)=>{var n;let r=((n=new Error().stack)==null?void 0:n.split(/\r\n|\r|\n/g))||[],a=!1;for(let i=0;i<r.length;i++){if(a&&!r[i].includes("TRACE_FUNC")){let s=`FUNC_${e}::${r[i].trim().split(" ")[1]}`;t&&(s+=`::${t}`),Zr("CPU",s);return}r[i].includes("TRACE_FUNC")&&(a=!0)}},lt=e=>{(typeof Ke.trace>"u"?!Ke.wasm.trace:!Ke.trace)||Ci("BEGIN",e)},rt=e=>{(typeof Ke.trace>"u"?!Ke.wasm.trace:!Ke.trace)||Ci("END",e)}}),Bp,Vg=W(()=>{wp(),Rp(),Mp(),Bp=class Np{constructor(t){this.handler=t}async run(t,r,a){lt();let n={},i={};if(typeof t!="object"||t===null||t instanceof Ze||Array.isArray(t))throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");let s=!0;if(typeof r=="object"){if(r===null)throw new TypeError("Unexpected argument[1]: cannot be null.");if(r instanceof Ze)throw new TypeError("'fetches' cannot be a Tensor");if(Array.isArray(r)){if(r.length===0)throw new TypeError("'fetches' cannot be an empty array.");s=!1;for(let l of r){if(typeof l!="string")throw new TypeError("'fetches' must be a string array or an object.");if(this.outputNames.indexOf(l)===-1)throw new RangeError(`'fetches' contains invalid output name: ${l}.`);n[l]=null}if(typeof a=="object"&&a!==null)i=a;else if(typeof a<"u")throw new TypeError("'options' must be an object.")}else{let l=!1,c=Object.getOwnPropertyNames(r);for(let f of this.outputNames)if(c.indexOf(f)!==-1){let h=r[f];(h===null||h instanceof Ze)&&(l=!0,s=!1,n[f]=h)}if(l){if(typeof a=="object"&&a!==null)i=a;else if(typeof a<"u")throw new TypeError("'options' must be an object.")}else i=r}}else if(typeof r<"u")throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");for(let l of this.inputNames)if(typeof t[l]>"u")throw new Error(`input '${l}' is missing in 'feeds'.`);if(s)for(let l of this.outputNames)n[l]=null;let u=await this.handler.run(t,n,i),d={};for(let l in u)if(Object.hasOwnProperty.call(u,l)){let c=u[l];c instanceof Ze?d[l]=c:d[l]=new Ze(c.type,c.data,c.dims)}return rt(),d}async release(){return this.handler.dispose()}static async create(t,r,a,n){lt();let i,s={};if(typeof t=="string"){if(i=t,typeof r=="object"&&r!==null)s=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof Uint8Array){if(i=t,typeof r=="object"&&r!==null)s=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof ArrayBuffer||typeof SharedArrayBuffer<"u"&&t instanceof SharedArrayBuffer){let c=t,f=0,h=t.byteLength;if(typeof r=="object"&&r!==null)s=r;else if(typeof r=="number"){if(f=r,!Number.isSafeInteger(f))throw new RangeError("'byteOffset' must be an integer.");if(f<0||f>=c.byteLength)throw new RangeError(`'byteOffset' is out of range [0, ${c.byteLength}).`);if(h=t.byteLength-f,typeof a=="number"){if(h=a,!Number.isSafeInteger(h))throw new RangeError("'byteLength' must be an integer.");if(h<=0||f+h>c.byteLength)throw new RangeError(`'byteLength' is out of range (0, ${c.byteLength-f}].`);if(typeof n=="object"&&n!==null)s=n;else if(typeof n<"u")throw new TypeError("'options' must be an object.")}else if(typeof a<"u")throw new TypeError("'byteLength' must be a number.")}else if(typeof r<"u")throw new TypeError("'options' must be an object.");i=new Uint8Array(c,f,h)}else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let[u,d]=await bp(s),l=await u.createInferenceSessionHandler(i,d);return rt(),new Np(l)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}get inputMetadata(){return this.handler.inputMetadata}get outputMetadata(){return this.handler.outputMetadata}}}),wn,Hg=W(()=>{Vg(),wn=Bp}),Fg=W(()=>{}),Kg=W(()=>{}),Zg=W(()=>{}),Qg=W(()=>{}),Xg={};Qt(Xg,{InferenceSession:()=>wn,TRACE:()=>Zr,TRACE_FUNC_BEGIN:()=>lt,TRACE_FUNC_END:()=>rt,Tensor:()=>Ze,env:()=>Se,registerBackend:()=>Ht});var at=W(()=>{Pg(),Ug(),Hg(),Rp(),Fg(),Kg(),Mp(),Zg(),Qg()}),vn=W(()=>{}),Dp={};Qt(Dp,{default:()=>Pp});var zi,Ai,Pp,Yg=W(()=>{var e;jh(),Lt(),$n(),zi="ort-wasm-proxy-worker",Ai=((e=globalThis.self)==null?void 0:e.name)===zi,Ai&&(self.onmessage=t=>{let{type:r,in:a}=t.data;try{switch(r){case"init-wasm":xn(a.wasm).then(()=>{qn(a).then(()=>{postMessage({type:r})},n=>{postMessage({type:r,err:n})})},n=>{postMessage({type:r,err:n})});break;case"init-ep":{let{epName:n,env:i}=a;Wn(i,n).then(()=>{postMessage({type:r})},s=>{postMessage({type:r,err:s})});break}case"copy-from":{let{buffer:n}=a,i=ri(n);postMessage({type:r,out:i});break}case"create":{let{model:n,options:i}=a;Gn(n,i).then(s=>{postMessage({type:r,out:s})},s=>{postMessage({type:r,err:s})});break}case"release":jn(a),postMessage({type:r});break;case"run":{let{sessionId:n,inputIndices:i,inputs:s,outputIndices:u,options:d}=a;Vn(n,i,s,u,new Array(u.length).fill(null),d).then(l=>{l.some(c=>c[3]!=="cpu")?postMessage({type:r,err:"Proxy does not support non-cpu tensor location."}):postMessage({type:r,out:l},Fn([...s,...l]))},l=>{postMessage({type:r,err:l})});break}case"end-profiling":Hn(a),postMessage({type:r});break;default:}}catch(n){postMessage({type:r,err:n})}}),Pp=Ai?null:t=>new Worker(t??Ge,{type:"module",name:zi})}),Lp={};Qt(Lp,{default:()=>Up});var Oi,Ri,Up,mo,Jg=W(()=>{var e,t;Ri=(Oi=import.meta.url,async function(r={}){var fo;var a,n,i=r,s=new Promise((o,p)=>{a=o,n=p}),u=typeof window=="object",d=typeof WorkerGlobalScope<"u",l=d&&((fo=self.name)==null?void 0:fo.startsWith("em-pthread"));i.mountExternalData=(o,p)=>{o.startsWith("./")&&(o=o.substring(2)),(i.Eb||(i.Eb=new Map)).set(o,p)},i.unmountExternalData=()=>{delete i.Eb};var c=globalThis.SharedArrayBuffer??new WebAssembly.Memory({initial:0,maximum:0,pc:!0}).buffer.constructor;let f=o=>async(...p)=>{var m;try{if(i.Fb)throw Error("Session already started");let _=i.Fb={dc:p[0],errors:[]},$=await o(...p);if(i.Fb!==_)throw Error("Session mismatch");(m=i.Jb)==null||m.flush();let T=_.errors;if(0<T.length){let D=await Promise.all(T);if(D=D.filter(q=>q),0<D.length)throw Error(D.join(`
`))}return $}finally{i.Fb=null}};i.jsepInit=(o,p)=>{if(o==="webgpu"){[i.Jb,i.Ub,i.Yb,i.Kb,i.Xb,i.jb,i.Zb,i.ac,i.Vb,i.Wb,i.$b]=p;let m=i.Jb;i.jsepRegisterBuffer=(_,$,T,D)=>m.registerBuffer(_,$,T,D),i.jsepGetBuffer=_=>m.getBuffer(_),i.jsepCreateDownloader=(_,$,T)=>m.createDownloader(_,$,T),i.jsepOnCreateSession=_=>{m.onCreateSession(_)},i.jsepOnReleaseSession=_=>{m.onReleaseSession(_)},i.jsepOnRunStart=_=>m.onRunStart(_),i.bc=(_,$)=>{m.upload(_,$)}}else if(o==="webnn"){let m=p[0];[i.nc,i.Nb,i.webnnEnsureTensor,i.Ob,i.webnnDownloadTensor]=p.slice(1),i.webnnReleaseTensorId=i.Nb,i.webnnUploadTensor=i.Ob,i.webnnOnRunStart=_=>m.onRunStart(_),i.webnnOnRunEnd=m.onRunEnd.bind(m),i.webnnRegisterMLContext=(_,$)=>{m.registerMLContext(_,$)},i.webnnOnReleaseSession=_=>{m.onReleaseSession(_)},i.webnnCreateMLTensorDownloader=(_,$)=>m.createMLTensorDownloader(_,$),i.webnnRegisterMLTensor=(_,$,T,D)=>m.registerMLTensor(_,$,T,D),i.webnnCreateMLContext=_=>m.createMLContext(_),i.webnnRegisterMLConstant=(_,$,T,D,q,V)=>m.registerMLConstant(_,$,T,D,q,i.Eb,V),i.webnnRegisterGraphInput=m.registerGraphInput.bind(m),i.webnnIsGraphInput=m.isGraphInput.bind(m),i.webnnCreateTemporaryTensor=m.createTemporaryTensor.bind(m),i.webnnIsInt64Supported=m.isInt64Supported.bind(m)}};let h=()=>{let o=(p,m,_)=>(...$)=>{let T=st,D=m==null?void 0:m();$=p(...$);let q=m==null?void 0:m();return D!==q&&(p=q,_(D),m=_=null),st!=T?new Promise((V,ee)=>{_i={resolve:V,reject:ee}}):$};(()=>{for(let p of["_OrtAppendExecutionProvider","_OrtCreateSession","_OrtRun","_OrtRunWithBinding","_OrtBindInput"])i[p]=o(i[p],()=>i[p],m=>i[p]=m)})(),f!==void 0&&(i._OrtRun=f(i._OrtRun),i._OrtRunWithBinding=f(i._OrtRunWithBinding)),h=void 0};i.asyncInit=()=>{h==null||h()};var g,y,b=Object.assign({},i),x=(o,p)=>{throw p},v="";(u||d)&&(d?v=self.location.href:typeof document<"u"&&document.currentScript&&(v=document.currentScript.src),Oi&&(v=Oi),v=v.startsWith("blob:")?"":v.slice(0,v.replace(/[?#].*/,"").lastIndexOf("/")+1),d&&(y=o=>{var p=new XMLHttpRequest;return p.open("GET",o,!1),p.responseType="arraybuffer",p.send(null),new Uint8Array(p.response)}),g=async o=>{if(E(o))return new Promise((m,_)=>{var $=new XMLHttpRequest;$.open("GET",o,!0),$.responseType="arraybuffer",$.onload=()=>{$.status==200||$.status==0&&$.response?m($.response):_($.status)},$.onerror=_,$.send(null)});var p=await fetch(o,{credentials:"same-origin"});if(p.ok)return p.arrayBuffer();throw Error(p.status+" : "+p.url)});var w=console.log.bind(console),k=console.error.bind(console),S=w,I=k;Object.assign(i,b),b=null;var C,z,A,O,G,X,K,F,Z,ie,H,j,he,N=i.wasmBinary,M=!1,E=o=>o.startsWith("file://");function B(){return C.buffer!=O.buffer&&de(),O}function L(){return C.buffer!=O.buffer&&de(),G}function Q(){return C.buffer!=O.buffer&&de(),X}function ge(){return C.buffer!=O.buffer&&de(),K}function U(){return C.buffer!=O.buffer&&de(),F}function ue(){return C.buffer!=O.buffer&&de(),Z}function ve(){return C.buffer!=O.buffer&&de(),ie}function ae(){return C.buffer!=O.buffer&&de(),he}if(l){let o=function(p){try{var m=p.data,_=m.Bb;if(_==="load"){let $=[];self.onmessage=T=>$.push(T),self.startWorker=()=>{postMessage({Bb:"loaded"});for(let T of $)o(T);self.onmessage=o};for(let T of m.Rb)i[T]&&!i[T].proxy||(i[T]=(...D)=>{postMessage({Bb:"callHandler",Qb:T,args:D})},T=="print"&&(S=i[T]),T=="printErr"&&(I=i[T]));C=m.kc,de(),le(m.lc)}else if(_==="run"){cm(m.Ab),$i(m.Ab,0,0,1,0,0),ss(),gi(m.Ab),ce||(eo(),ce=!0);try{fm(m.fc,m.Hb)}catch($){if($!="unwind")throw $}}else m.target!=="setimmediate"&&(_==="checkMailbox"?ce&&$r():_&&(I(`worker: received unknown command ${_}`),I(m)))}catch($){throw to(),$}};var le,ce=!1;I=function(...p){p=p.join(" "),console.error(p)},self.alert=function(...p){postMessage({Bb:"alert",text:p.join(" "),ic:zr()})},self.onunhandledrejection=p=>{throw p.reason||p},self.onmessage=o}function de(){var o=C.buffer;i.HEAP8=O=new Int8Array(o),i.HEAP16=X=new Int16Array(o),i.HEAPU8=G=new Uint8Array(o),i.HEAPU16=K=new Uint16Array(o),i.HEAP32=F=new Int32Array(o),i.HEAPU32=Z=new Uint32Array(o),i.HEAPF32=ie=new Float32Array(o),i.HEAPF64=he=new Float64Array(o),i.HEAP64=H=new BigInt64Array(o),i.HEAPU64=j=new BigUint64Array(o)}function Te(){l?startWorker(i):re.Ca()}l||(C=new WebAssembly.Memory({initial:256,maximum:65536,shared:!0}),de());var De,yt=0,dt=null;function vr(){if(--yt==0&&dt){var o=dt;dt=null,o()}}function _t(o){throw I(o="Aborted("+o+")"),M=!0,o=new WebAssembly.RuntimeError(o+". Build with -sASSERTIONS for more info."),n(o),o}function es(){return{a:{L:pm,Aa:dm,b:mm,$:ds,A:fs,pa:hs,X:gs,Z:ys,qa:_s,na:bs,ga:ws,ma:vs,J:$s,Y:xs,V:Ss,oa:ks,W:Is,va:gm,E:ym,Q:_m,O:wm,D:$m,u:xm,r:Sm,P:km,z:Om,R:Rm,ja:Mm,T:Bm,aa:Nm,M:Dm,F:Pm,ia:gi,sa:Lm,t:Um,Ba:qm,w:jm,o:Vm,l:Fm,c:fi,n:Km,j:Xm,v:Ym,p:Jm,f:eg,s:tg,m:rg,e:ig,k:ag,i:ng,g:sg,d:og,da:ug,ea:lg,fa:dg,ba:Us,ca:qs,N:Ws,xa:cg,ua:hg,h:mg,C:gg,G:yg,ta:fg,x:_g,ra:bg,U:wg,q:pg,y:vg,K:$g,S:xg,za:Sg,ya:kg,ka:Hs,la:Fs,_:li,B:Ks,I:Zs,ha:Qs,H:Xs,a:C,wa:ui}}}var ni={829644:(o,p,m,_,$)=>{if(i===void 0||!i.Eb)return 1;if((o=Ce(Number(o>>>0))).startsWith("./")&&(o=o.substring(2)),!(o=i.Eb.get(o)))return 2;if(p=Number(p>>>0),m=Number(m>>>0),_=Number(_>>>0),p+m>o.byteLength)return 3;try{let T=o.subarray(p,p+m);switch($){case 0:L().set(T,_>>>0);break;case 1:i.mc?i.mc(_,T):i.bc(_,T);break;default:return 4}return 0}catch{return 4}},830468:(o,p,m)=>{i.Ob(o,L().subarray(p>>>0,p+m>>>0))},830532:()=>i.nc(),830574:o=>{i.Nb(o)},830611:()=>{i.Vb()},830642:()=>{i.Wb()},830671:()=>{i.$b()},830696:o=>i.Ub(o),830729:o=>i.Yb(o),830761:(o,p,m)=>{i.Kb(Number(o),Number(p),Number(m),!0)},830824:(o,p,m)=>{i.Kb(Number(o),Number(p),Number(m))},830881:()=>typeof wasmOffsetConverter<"u",830938:o=>{i.jb("Abs",o,void 0)},830989:o=>{i.jb("Neg",o,void 0)},831040:o=>{i.jb("Floor",o,void 0)},831093:o=>{i.jb("Ceil",o,void 0)},831145:o=>{i.jb("Reciprocal",o,void 0)},831203:o=>{i.jb("Sqrt",o,void 0)},831255:o=>{i.jb("Exp",o,void 0)},831306:o=>{i.jb("Erf",o,void 0)},831357:o=>{i.jb("Sigmoid",o,void 0)},831412:(o,p,m)=>{i.jb("HardSigmoid",o,{alpha:p,beta:m})},831491:o=>{i.jb("Log",o,void 0)},831542:o=>{i.jb("Sin",o,void 0)},831593:o=>{i.jb("Cos",o,void 0)},831644:o=>{i.jb("Tan",o,void 0)},831695:o=>{i.jb("Asin",o,void 0)},831747:o=>{i.jb("Acos",o,void 0)},831799:o=>{i.jb("Atan",o,void 0)},831851:o=>{i.jb("Sinh",o,void 0)},831903:o=>{i.jb("Cosh",o,void 0)},831955:o=>{i.jb("Asinh",o,void 0)},832008:o=>{i.jb("Acosh",o,void 0)},832061:o=>{i.jb("Atanh",o,void 0)},832114:o=>{i.jb("Tanh",o,void 0)},832166:o=>{i.jb("Not",o,void 0)},832217:(o,p,m)=>{i.jb("Clip",o,{min:p,max:m})},832286:o=>{i.jb("Clip",o,void 0)},832338:(o,p)=>{i.jb("Elu",o,{alpha:p})},832396:o=>{i.jb("Gelu",o,void 0)},832448:o=>{i.jb("Relu",o,void 0)},832500:(o,p)=>{i.jb("LeakyRelu",o,{alpha:p})},832564:(o,p)=>{i.jb("ThresholdedRelu",o,{alpha:p})},832634:(o,p)=>{i.jb("Cast",o,{to:p})},832692:o=>{i.jb("Add",o,void 0)},832743:o=>{i.jb("Sub",o,void 0)},832794:o=>{i.jb("Mul",o,void 0)},832845:o=>{i.jb("Div",o,void 0)},832896:o=>{i.jb("Pow",o,void 0)},832947:o=>{i.jb("Equal",o,void 0)},833e3:o=>{i.jb("Greater",o,void 0)},833055:o=>{i.jb("GreaterOrEqual",o,void 0)},833117:o=>{i.jb("Less",o,void 0)},833169:o=>{i.jb("LessOrEqual",o,void 0)},833228:(o,p,m,_,$)=>{i.jb("ReduceMean",o,{keepDims:!!p,noopWithEmptyAxes:!!m,axes:_?Array.from(U().subarray(Number(_)>>>0,Number($)>>>0)):[]})},833403:(o,p,m,_,$)=>{i.jb("ReduceMax",o,{keepDims:!!p,noopWithEmptyAxes:!!m,axes:_?Array.from(U().subarray(Number(_)>>>0,Number($)>>>0)):[]})},833577:(o,p,m,_,$)=>{i.jb("ReduceMin",o,{keepDims:!!p,noopWithEmptyAxes:!!m,axes:_?Array.from(U().subarray(Number(_)>>>0,Number($)>>>0)):[]})},833751:(o,p,m,_,$)=>{i.jb("ReduceProd",o,{keepDims:!!p,noopWithEmptyAxes:!!m,axes:_?Array.from(U().subarray(Number(_)>>>0,Number($)>>>0)):[]})},833926:(o,p,m,_,$)=>{i.jb("ReduceSum",o,{keepDims:!!p,noopWithEmptyAxes:!!m,axes:_?Array.from(U().subarray(Number(_)>>>0,Number($)>>>0)):[]})},834100:(o,p,m,_,$)=>{i.jb("ReduceL1",o,{keepDims:!!p,noopWithEmptyAxes:!!m,axes:_?Array.from(U().subarray(Number(_)>>>0,Number($)>>>0)):[]})},834273:(o,p,m,_,$)=>{i.jb("ReduceL2",o,{keepDims:!!p,noopWithEmptyAxes:!!m,axes:_?Array.from(U().subarray(Number(_)>>>0,Number($)>>>0)):[]})},834446:(o,p,m,_,$)=>{i.jb("ReduceLogSum",o,{keepDims:!!p,noopWithEmptyAxes:!!m,axes:_?Array.from(U().subarray(Number(_)>>>0,Number($)>>>0)):[]})},834623:(o,p,m,_,$)=>{i.jb("ReduceSumSquare",o,{keepDims:!!p,noopWithEmptyAxes:!!m,axes:_?Array.from(U().subarray(Number(_)>>>0,Number($)>>>0)):[]})},834803:(o,p,m,_,$)=>{i.jb("ReduceLogSumExp",o,{keepDims:!!p,noopWithEmptyAxes:!!m,axes:_?Array.from(U().subarray(Number(_)>>>0,Number($)>>>0)):[]})},834983:o=>{i.jb("Where",o,void 0)},835036:(o,p,m)=>{i.jb("Transpose",o,{perm:p?Array.from(U().subarray(Number(p)>>>0,Number(m)>>>0)):[]})},835160:(o,p,m,_)=>{i.jb("DepthToSpace",o,{blocksize:p,mode:Ce(m),format:_?"NHWC":"NCHW"})},835293:(o,p,m,_)=>{i.jb("DepthToSpace",o,{blocksize:p,mode:Ce(m),format:_?"NHWC":"NCHW"})},835426:(o,p,m,_,$,T,D,q,V,ee,pe,ye,$e,Be,Gt)=>{i.jb("ConvTranspose",o,{format:V?"NHWC":"NCHW",autoPad:p,dilations:[m],group:_,kernelShape:[$],pads:[T,D],strides:[q],wIsConst:()=>!!B()[ee>>>0],outputPadding:pe?Array.from(U().subarray(Number(pe)>>>0,Number(ye)>>>0)):[],outputShape:$e?Array.from(U().subarray(Number($e)>>>0,Number(Be)>>>0)):[],activation:Ce(Gt)})},835859:(o,p,m,_,$,T,D,q,V,ee,pe,ye,$e,Be)=>{i.jb("ConvTranspose",o,{format:q?"NHWC":"NCHW",autoPad:p,dilations:Array.from(U().subarray(Number(m)>>>0,2+(Number(m)>>>0)>>>0)),group:_,kernelShape:Array.from(U().subarray(Number($)>>>0,2+(Number($)>>>0)>>>0)),pads:Array.from(U().subarray(Number(T)>>>0,4+(Number(T)>>>0)>>>0)),strides:Array.from(U().subarray(Number(D)>>>0,2+(Number(D)>>>0)>>>0)),wIsConst:()=>!!B()[V>>>0],outputPadding:ee?Array.from(U().subarray(Number(ee)>>>0,Number(pe)>>>0)):[],outputShape:ye?Array.from(U().subarray(Number(ye)>>>0,Number($e)>>>0)):[],activation:Ce(Be)})},836520:(o,p,m,_,$,T,D,q,V,ee,pe,ye,$e,Be,Gt)=>{i.jb("ConvTranspose",o,{format:V?"NHWC":"NCHW",autoPad:p,dilations:[m],group:_,kernelShape:[$],pads:[T,D],strides:[q],wIsConst:()=>!!B()[ee>>>0],outputPadding:pe?Array.from(U().subarray(Number(pe)>>>0,Number(ye)>>>0)):[],outputShape:$e?Array.from(U().subarray(Number($e)>>>0,Number(Be)>>>0)):[],activation:Ce(Gt)})},836953:(o,p,m,_,$,T,D,q,V,ee,pe,ye,$e,Be)=>{i.jb("ConvTranspose",o,{format:q?"NHWC":"NCHW",autoPad:p,dilations:Array.from(U().subarray(Number(m)>>>0,2+(Number(m)>>>0)>>>0)),group:_,kernelShape:Array.from(U().subarray(Number($)>>>0,2+(Number($)>>>0)>>>0)),pads:Array.from(U().subarray(Number(T)>>>0,4+(Number(T)>>>0)>>>0)),strides:Array.from(U().subarray(Number(D)>>>0,2+(Number(D)>>>0)>>>0)),wIsConst:()=>!!B()[V>>>0],outputPadding:ee?Array.from(U().subarray(Number(ee)>>>0,Number(pe)>>>0)):[],outputShape:ye?Array.from(U().subarray(Number(ye)>>>0,Number($e)>>>0)):[],activation:Ce(Be)})},837614:(o,p)=>{i.jb("GlobalAveragePool",o,{format:p?"NHWC":"NCHW"})},837705:(o,p,m,_,$,T,D,q,V,ee,pe,ye,$e,Be)=>{i.jb("AveragePool",o,{format:Be?"NHWC":"NCHW",auto_pad:p,ceil_mode:m,count_include_pad:_,storage_order:$,dilations:T?Array.from(U().subarray(Number(T)>>>0,Number(D)>>>0)):[],kernel_shape:q?Array.from(U().subarray(Number(q)>>>0,Number(V)>>>0)):[],pads:ee?Array.from(U().subarray(Number(ee)>>>0,Number(pe)>>>0)):[],strides:ye?Array.from(U().subarray(Number(ye)>>>0,Number($e)>>>0)):[]})},838184:(o,p)=>{i.jb("GlobalAveragePool",o,{format:p?"NHWC":"NCHW"})},838275:(o,p,m,_,$,T,D,q,V,ee,pe,ye,$e,Be)=>{i.jb("AveragePool",o,{format:Be?"NHWC":"NCHW",auto_pad:p,ceil_mode:m,count_include_pad:_,storage_order:$,dilations:T?Array.from(U().subarray(Number(T)>>>0,Number(D)>>>0)):[],kernel_shape:q?Array.from(U().subarray(Number(q)>>>0,Number(V)>>>0)):[],pads:ee?Array.from(U().subarray(Number(ee)>>>0,Number(pe)>>>0)):[],strides:ye?Array.from(U().subarray(Number(ye)>>>0,Number($e)>>>0)):[]})},838754:(o,p)=>{i.jb("GlobalMaxPool",o,{format:p?"NHWC":"NCHW"})},838841:(o,p,m,_,$,T,D,q,V,ee,pe,ye,$e,Be)=>{i.jb("MaxPool",o,{format:Be?"NHWC":"NCHW",auto_pad:p,ceil_mode:m,count_include_pad:_,storage_order:$,dilations:T?Array.from(U().subarray(Number(T)>>>0,Number(D)>>>0)):[],kernel_shape:q?Array.from(U().subarray(Number(q)>>>0,Number(V)>>>0)):[],pads:ee?Array.from(U().subarray(Number(ee)>>>0,Number(pe)>>>0)):[],strides:ye?Array.from(U().subarray(Number(ye)>>>0,Number($e)>>>0)):[]})},839316:(o,p)=>{i.jb("GlobalMaxPool",o,{format:p?"NHWC":"NCHW"})},839403:(o,p,m,_,$,T,D,q,V,ee,pe,ye,$e,Be)=>{i.jb("MaxPool",o,{format:Be?"NHWC":"NCHW",auto_pad:p,ceil_mode:m,count_include_pad:_,storage_order:$,dilations:T?Array.from(U().subarray(Number(T)>>>0,Number(D)>>>0)):[],kernel_shape:q?Array.from(U().subarray(Number(q)>>>0,Number(V)>>>0)):[],pads:ee?Array.from(U().subarray(Number(ee)>>>0,Number(pe)>>>0)):[],strides:ye?Array.from(U().subarray(Number(ye)>>>0,Number($e)>>>0)):[]})},839878:(o,p,m,_,$)=>{i.jb("Gemm",o,{alpha:p,beta:m,transA:_,transB:$})},839982:o=>{i.jb("MatMul",o,void 0)},840036:(o,p,m,_)=>{i.jb("ArgMax",o,{keepDims:!!p,selectLastIndex:!!m,axis:_})},840144:(o,p,m,_)=>{i.jb("ArgMin",o,{keepDims:!!p,selectLastIndex:!!m,axis:_})},840252:(o,p)=>{i.jb("Softmax",o,{axis:p})},840315:(o,p)=>{i.jb("Concat",o,{axis:p})},840375:(o,p,m,_,$)=>{i.jb("Split",o,{axis:p,numOutputs:m,splitSizes:_?Array.from(U().subarray(Number(_)>>>0,Number($)>>>0)):[]})},840531:o=>{i.jb("Expand",o,void 0)},840585:(o,p)=>{i.jb("Gather",o,{axis:Number(p)})},840656:(o,p)=>{i.jb("GatherElements",o,{axis:Number(p)})},840735:(o,p)=>{i.jb("GatherND",o,{batch_dims:Number(p)})},840814:(o,p,m,_,$,T,D,q,V,ee,pe)=>{i.jb("Resize",o,{antialias:p,axes:m?Array.from(U().subarray(Number(m)>>>0,Number(_)>>>0)):[],coordinateTransformMode:Ce($),cubicCoeffA:T,excludeOutside:D,extrapolationValue:q,keepAspectRatioPolicy:Ce(V),mode:Ce(ee),nearestMode:Ce(pe)})},841176:(o,p,m,_,$,T,D)=>{i.jb("Slice",o,{starts:p?Array.from(U().subarray(Number(p)>>>0,Number(m)>>>0)):[],ends:_?Array.from(U().subarray(Number(_)>>>0,Number($)>>>0)):[],axes:T?Array.from(U().subarray(Number(T)>>>0,Number(D)>>>0)):[]})},841440:o=>{i.jb("Tile",o,void 0)},841492:(o,p,m)=>{i.jb("InstanceNormalization",o,{epsilon:p,format:m?"NHWC":"NCHW"})},841606:(o,p,m)=>{i.jb("InstanceNormalization",o,{epsilon:p,format:m?"NHWC":"NCHW"})},841720:o=>{i.jb("Range",o,void 0)},841773:(o,p)=>{i.jb("Einsum",o,{equation:Ce(p)})},841854:(o,p,m,_,$)=>{i.jb("Pad",o,{mode:p,value:m,pads:_?Array.from(U().subarray(Number(_)>>>0,Number($)>>>0)):[]})},841997:(o,p,m,_,$,T)=>{i.jb("BatchNormalization",o,{epsilon:p,momentum:m,spatial:!!$,trainingMode:!!_,format:T?"NHWC":"NCHW"})},842166:(o,p,m,_,$,T)=>{i.jb("BatchNormalization",o,{epsilon:p,momentum:m,spatial:!!$,trainingMode:!!_,format:T?"NHWC":"NCHW"})},842335:(o,p,m)=>{i.jb("CumSum",o,{exclusive:Number(p),reverse:Number(m)})},842432:(o,p,m)=>{i.jb("DequantizeLinear",o,{axis:p,blockSize:m})},842522:(o,p,m,_,$)=>{i.jb("GridSample",o,{align_corners:p,mode:Ce(m),padding_mode:Ce(_),format:$?"NHWC":"NCHW"})},842692:(o,p,m,_,$)=>{i.jb("GridSample",o,{align_corners:p,mode:Ce(m),padding_mode:Ce(_),format:$?"NHWC":"NCHW"})},842862:(o,p)=>{i.jb("ScatterND",o,{reduction:Ce(p)})},842947:(o,p,m,_,$,T,D,q,V)=>{i.jb("Attention",o,{numHeads:p,isUnidirectional:m,maskFilterValue:_,scale:$,doRotary:T,qkvHiddenSizes:D?Array.from(U().subarray(Number(q)>>>0,Number(q)+D>>>0)):[],pastPresentShareBuffer:!!V})},843219:o=>{i.jb("BiasAdd",o,void 0)},843274:o=>{i.jb("BiasSplitGelu",o,void 0)},843335:o=>{i.jb("FastGelu",o,void 0)},843391:(o,p,m,_,$,T,D,q,V,ee,pe,ye,$e,Be,Gt,Eg)=>{i.jb("Conv",o,{format:ye?"NHWC":"NCHW",auto_pad:p,dilations:m?Array.from(U().subarray(Number(m)>>>0,Number(_)>>>0)):[],group:$,kernel_shape:T?Array.from(U().subarray(Number(T)>>>0,Number(D)>>>0)):[],pads:q?Array.from(U().subarray(Number(q)>>>0,Number(V)>>>0)):[],strides:ee?Array.from(U().subarray(Number(ee)>>>0,Number(pe)>>>0)):[],w_is_const:()=>!!B()[Number($e)>>>0],activation:Ce(Be),activation_params:Gt?Array.from(ve().subarray(Number(Gt)>>>0,Number(Eg)>>>0)):[]})},843975:o=>{i.jb("Gelu",o,void 0)},844027:(o,p,m,_,$,T,D,q,V)=>{i.jb("GroupQueryAttention",o,{numHeads:p,kvNumHeads:m,scale:_,softcap:$,doRotary:T,rotaryInterleaved:D,smoothSoftmax:q,localWindowSize:V})},844244:(o,p,m,_)=>{i.jb("LayerNormalization",o,{axis:p,epsilon:m,simplified:!!_})},844355:(o,p,m,_)=>{i.jb("LayerNormalization",o,{axis:p,epsilon:m,simplified:!!_})},844466:(o,p,m,_,$,T)=>{i.jb("MatMulNBits",o,{k:p,n:m,accuracyLevel:_,bits:$,blockSize:T})},844593:(o,p,m,_,$,T)=>{i.jb("MultiHeadAttention",o,{numHeads:p,isUnidirectional:m,maskFilterValue:_,scale:$,doRotary:T})},844752:(o,p)=>{i.jb("QuickGelu",o,{alpha:p})},844816:(o,p,m,_,$)=>{i.jb("RotaryEmbedding",o,{interleaved:!!p,numHeads:m,rotaryEmbeddingDim:_,scale:$})},844955:(o,p,m)=>{i.jb("SkipLayerNormalization",o,{epsilon:p,simplified:!!m})},845057:(o,p,m)=>{i.jb("SkipLayerNormalization",o,{epsilon:p,simplified:!!m})},845159:(o,p,m,_)=>{i.jb("GatherBlockQuantized",o,{gatherAxis:p,quantizeAxis:m,blockSize:_})},845280:o=>{i.Zb(o)},845314:(o,p)=>i.ac(Number(o),Number(p),i.Fb.dc,i.Fb.errors)};function dm(o,p,m){return Ms(async()=>{await i.Xb(Number(o),Number(p),Number(m))})}function pm(){return typeof wasmOffsetConverter<"u"}class si{constructor(p){tr(this,"name","ExitStatus");this.message=`Program terminated with exit(${p})`,this.status=p}}var ts=o=>{o.terminate(),o.onmessage=()=>{}},oi=[],rs=o=>{wt.length==0&&(us(),os(wt[0]));var p=wt.pop();if(!p)return 6;Yt.push(p),Ct[o.Ab]=p,p.Ab=o.Ab;var m={Bb:"run",fc:o.ec,Hb:o.Hb,Ab:o.Ab};return p.postMessage(m,o.Mb),0},bt=0,ke=(o,p,...m)=>{for(var _=2*m.length,$=ki(),T=Si(8*_),D=T>>>3,q=0;q<m.length;q++){var V=m[q];typeof V=="bigint"?(H[D+2*q]=1n,H[D+2*q+1]=V):(H[D+2*q]=0n,ae()[D+2*q+1>>>0]=V)}return o=ro(o,0,_,T,p),Or($),o};function ui(o){if(l)return ke(0,1,o);if(A=o,!(0<bt)){for(var p of Yt)ts(p);for(p of wt)ts(p);wt=[],Yt=[],Ct={},M=!0}x(0,new si(o))}function is(o){if(l)return ke(1,0,o);li(o)}var li=o=>{if(A=o,l)throw is(o),"unwind";ui(o)},wt=[],Yt=[],as=[],Ct={},ns=o=>{var p=o.Ab;delete Ct[p],wt.push(o),Yt.splice(Yt.indexOf(o),1),o.Ab=0,io(p)};function ss(){as.forEach(o=>o())}var os=o=>new Promise(p=>{o.onmessage=$=>{var T=($=$.data).Bb;if($.Gb&&$.Gb!=zr()){var D=Ct[$.Gb];D?D.postMessage($,$.Mb):I(`Internal error! Worker sent a message "${T}" to target pthread ${$.Gb}, but that thread no longer exists!`)}else T==="checkMailbox"?$r():T==="spawnThread"?rs($):T==="cleanupThread"?ns(Ct[$.hc]):T==="loaded"?(o.loaded=!0,p(o)):T==="alert"?alert(`Thread ${$.ic}: ${$.text}`):$.target==="setimmediate"?o.postMessage($):T==="callHandler"?i[$.Qb](...$.args):T&&I(`worker sent an unknown command ${T}`)},o.onerror=$=>{throw I(`worker sent an error! ${$.filename}:${$.lineno}: ${$.message}`),$};var m,_=[];for(m of[])i.propertyIsEnumerable(m)&&_.push(m);o.postMessage({Bb:"load",Rb:_,kc:C,lc:z})});function us(){var o=new Worker((()=>{let p=URL;return import.meta.url>"file:"&&import.meta.url<"file;"?new p("ort.webgpu.bundle.min.mjs",import.meta.url):new URL(import.meta.url)})(),{type:"module",workerData:"em-pthread",name:"em-pthread"});wt.push(o)}var cm=o=>{de();var p=ue()[o+52>>>2>>>0];o=ue()[o+56>>>2>>>0],so(p,p-o),Or(p)},fm=(o,p)=>{bt=0,o=oo(o,p),0<bt?A=o:xi(o)};class hm{constructor(p){this.Ib=p-24}}function mm(o,p,m){var _=new hm(o>>>=0);throw p>>>=0,m>>>=0,ue()[_.Ib+16>>>2>>>0]=0,ue()[_.Ib+4>>>2>>>0]=p,ue()[_.Ib+8>>>2>>>0]=m,o}function ls(o,p,m,_){return l?ke(2,1,o,p,m,_):ds(o,p,m,_)}function ds(o,p,m,_){if(o>>>=0,m>>>=0,_>>>=0,c===void 0)return 6;var $=[];return l&&$.length===0?ls(o,p>>>=0,m,_):(o={ec:m,Ab:o,Hb:_,Mb:$},l?(o.Bb="spawnThread",postMessage(o,$),0):rs(o))}var ps=typeof TextDecoder<"u"?new TextDecoder:void 0,cs=(o,p=0,m=NaN)=>{var _=(p>>>=0)+m;for(m=p;o[m]&&!(m>=_);)++m;if(16<m-p&&o.buffer&&ps)return ps.decode(o.buffer instanceof ArrayBuffer?o.subarray(p,m):o.slice(p,m));for(_="";p<m;){var $=o[p++];if(128&$){var T=63&o[p++];if((224&$)==192)_+=String.fromCharCode((31&$)<<6|T);else{var D=63&o[p++];65536>($=(240&$)==224?(15&$)<<12|T<<6|D:(7&$)<<18|T<<12|D<<6|63&o[p++])?_+=String.fromCharCode($):($-=65536,_+=String.fromCharCode(55296|$>>10,56320|1023&$))}}else _+=String.fromCharCode($)}return _},Ce=(o,p)=>(o>>>=0)?cs(L(),o,p):"";function fs(o,p,m){return l?ke(3,1,o,p,m):0}function hs(o,p){if(l)return ke(4,1,o,p)}var ms=o=>{for(var p=0,m=0;m<o.length;++m){var _=o.charCodeAt(m);127>=_?p++:2047>=_?p+=2:55296<=_&&57343>=_?(p+=4,++m):p+=3}return p},Wt=(o,p,m)=>{var _=L();if(p>>>=0,0<m){var $=p;m=p+m-1;for(var T=0;T<o.length;++T){var D=o.charCodeAt(T);if(55296<=D&&57343>=D&&(D=65536+((1023&D)<<10)|1023&o.charCodeAt(++T)),127>=D){if(p>=m)break;_[p++>>>0]=D}else{if(2047>=D){if(p+1>=m)break;_[p++>>>0]=192|D>>6}else{if(65535>=D){if(p+2>=m)break;_[p++>>>0]=224|D>>12}else{if(p+3>=m)break;_[p++>>>0]=240|D>>18,_[p++>>>0]=128|D>>12&63}_[p++>>>0]=128|D>>6&63}_[p++>>>0]=128|63&D}}_[p>>>0]=0,o=p-$}else o=0;return o};function gs(o,p){if(l)return ke(5,1,o,p)}function ys(o,p,m){if(l)return ke(6,1,o,p,m)}function _s(o,p,m){return l?ke(7,1,o,p,m):0}function bs(o,p){if(l)return ke(8,1,o,p)}function ws(o,p,m){if(l)return ke(9,1,o,p,m)}function vs(o,p,m,_){if(l)return ke(10,1,o,p,m,_)}function $s(o,p,m,_){if(l)return ke(11,1,o,p,m,_)}function xs(o,p,m,_){if(l)return ke(12,1,o,p,m,_)}function Ss(o){if(l)return ke(13,1,o)}function ks(o,p){if(l)return ke(14,1,o,p)}function Is(o,p,m){if(l)return ke(15,1,o,p,m)}var Ts,vt,gm=()=>_t(""),nt=o=>{for(var p="";L()[o>>>0];)p+=Ts[L()[o++>>>0]];return p},di={},pi={};function pt(o,p,m={}){return(function(_,$,T={}){var D=$.name;if(!_)throw new vt(`type "${D}" must have a positive integer typeid pointer`);if(pi.hasOwnProperty(_)){if(T.Sb)return;throw new vt(`Cannot register type '${D}' twice`)}pi[_]=$,di.hasOwnProperty(_)&&($=di[_],delete di[_],$.forEach(q=>q()))})(o,p,m)}var Es=(o,p,m)=>{switch(p){case 1:return m?_=>B()[_>>>0]:_=>L()[_>>>0];case 2:return m?_=>Q()[_>>>1>>>0]:_=>ge()[_>>>1>>>0];case 4:return m?_=>U()[_>>>2>>>0]:_=>ue()[_>>>2>>>0];case 8:return m?_=>H[_>>>3]:_=>j[_>>>3];default:throw new TypeError(`invalid integer width (${p}): ${o}`)}};function ym(o,p,m){m>>>=0,pt(o>>>=0,{name:p=nt(p>>>0),fromWireType:_=>_,toWireType:function(_,$){if(typeof $!="bigint"&&typeof $!="number")throw $=$===null?"null":(_=typeof $)=="object"||_==="array"||_==="function"?$.toString():""+$,new TypeError(`Cannot convert "${$}" to ${this.name}`);return typeof $=="number"&&($=BigInt($)),$},Cb:$t,readValueFromPointer:Es(p,m,p.indexOf("u")==-1),Db:null})}var $t=8;function _m(o,p,m,_){pt(o>>>=0,{name:p=nt(p>>>0),fromWireType:function($){return!!$},toWireType:function($,T){return T?m:_},Cb:$t,readValueFromPointer:function($){return this.fromWireType(L()[$>>>0])},Db:null})}var ci=[],ct=[];function fi(o){9<(o>>>=0)&&--ct[o+1]==0&&(ct[o]=void 0,ci.push(o))}var We=o=>{if(!o)throw new vt("Cannot use deleted val. handle = "+o);return ct[o]},Fe=o=>{switch(o){case void 0:return 2;case null:return 4;case!0:return 6;case!1:return 8;default:let p=ci.pop()||ct.length;return ct[p]=o,ct[p+1]=1,p}};function hi(o){return this.fromWireType(ue()[o>>>2>>>0])}var bm={name:"emscripten::val",fromWireType:o=>{var p=We(o);return fi(o),p},toWireType:(o,p)=>Fe(p),Cb:$t,readValueFromPointer:hi,Db:null};function wm(o){return pt(o>>>0,bm)}var vm=(o,p)=>{switch(p){case 4:return function(m){return this.fromWireType(ve()[m>>>2>>>0])};case 8:return function(m){return this.fromWireType(ae()[m>>>3>>>0])};default:throw new TypeError(`invalid float width (${p}): ${o}`)}};function $m(o,p,m){m>>>=0,pt(o>>>=0,{name:p=nt(p>>>0),fromWireType:_=>_,toWireType:(_,$)=>$,Cb:$t,readValueFromPointer:vm(p,m),Db:null})}function xm(o,p,m,_,$){if(o>>>=0,m>>>=0,p=nt(p>>>0),$===-1&&($=4294967295),$=q=>q,_===0){var T=32-8*m;$=q=>q<<T>>>T}var D=p.includes("unsigned")?function(q,V){return V>>>0}:function(q,V){return V};pt(o,{name:p,fromWireType:$,toWireType:D,Cb:$t,readValueFromPointer:Es(p,m,_!==0),Db:null})}function Sm(o,p,m){function _(T){var D=ue()[T>>>2>>>0];return T=ue()[T+4>>>2>>>0],new $(B().buffer,T,D)}var $=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,BigInt64Array,BigUint64Array][p];pt(o>>>=0,{name:m=nt(m>>>0),fromWireType:_,Cb:$t,readValueFromPointer:_},{Sb:!0})}function km(o,p){pt(o>>>=0,{name:p=nt(p>>>0),fromWireType:function(m){for(var _,$=ue()[m>>>2>>>0],T=m+4,D=T,q=0;q<=$;++q){var V=T+q;q!=$&&L()[V>>>0]!=0||(D=Ce(D,V-D),_===void 0?_=D:(_+="\0",_+=D),D=V+1)}return ot(m),_},toWireType:function(m,_){_ instanceof ArrayBuffer&&(_=new Uint8Array(_));var $=typeof _=="string";if(!($||_ instanceof Uint8Array||_ instanceof Uint8ClampedArray||_ instanceof Int8Array))throw new vt("Cannot pass non-string to std::string");var T=$?ms(_):_.length,D=Ar(4+T+1),q=D+4;if(ue()[D>>>2>>>0]=T,$)Wt(_,q,T+1);else if($)for($=0;$<T;++$){var V=_.charCodeAt($);if(255<V)throw ot(D),new vt("String has UTF-16 code units that do not fit in 8 bits");L()[q+$>>>0]=V}else for($=0;$<T;++$)L()[q+$>>>0]=_[$];return m!==null&&m.push(ot,D),D},Cb:$t,readValueFromPointer:hi,Db(m){ot(m)}})}var Cs=typeof TextDecoder<"u"?new TextDecoder("utf-16le"):void 0,Im=(o,p)=>{for(var m=o>>1,_=m+p/2;!(m>=_)&&ge()[m>>>0];)++m;if(32<(m<<=1)-o&&Cs)return Cs.decode(L().slice(o,m));for(m="",_=0;!(_>=p/2);++_){var $=Q()[o+2*_>>>1>>>0];if($==0)break;m+=String.fromCharCode($)}return m},Tm=(o,p,m)=>{if(m??(m=2147483647),2>m)return 0;var _=p;m=(m-=2)<2*o.length?m/2:o.length;for(var $=0;$<m;++$){var T=o.charCodeAt($);Q()[p>>>1>>>0]=T,p+=2}return Q()[p>>>1>>>0]=0,p-_},Em=o=>2*o.length,Cm=(o,p)=>{for(var m=0,_="";!(m>=p/4);){var $=U()[o+4*m>>>2>>>0];if($==0)break;++m,65536<=$?($-=65536,_+=String.fromCharCode(55296|$>>10,56320|1023&$)):_+=String.fromCharCode($)}return _},zm=(o,p,m)=>{if(p>>>=0,m??(m=2147483647),4>m)return 0;var _=p;m=_+m-4;for(var $=0;$<o.length;++$){var T=o.charCodeAt($);if(55296<=T&&57343>=T&&(T=65536+((1023&T)<<10)|1023&o.charCodeAt(++$)),U()[p>>>2>>>0]=T,(p+=4)+4>m)break}return U()[p>>>2>>>0]=0,p-_},Am=o=>{for(var p=0,m=0;m<o.length;++m){var _=o.charCodeAt(m);55296<=_&&57343>=_&&++m,p+=4}return p};function Om(o,p,m){if(o>>>=0,p>>>=0,m=nt(m>>>=0),p===2)var _=Im,$=Tm,T=Em,D=q=>ge()[q>>>1>>>0];else p===4&&(_=Cm,$=zm,T=Am,D=q=>ue()[q>>>2>>>0]);pt(o,{name:m,fromWireType:q=>{for(var V,ee=ue()[q>>>2>>>0],pe=q+4,ye=0;ye<=ee;++ye){var $e=q+4+ye*p;ye!=ee&&D($e)!=0||(pe=_(pe,$e-pe),V===void 0?V=pe:(V+="\0",V+=pe),pe=$e+p)}return ot(q),V},toWireType:(q,V)=>{if(typeof V!="string")throw new vt(`Cannot pass non-string to C++ string type ${m}`);var ee=T(V),pe=Ar(4+ee+p);return ue()[pe>>>2>>>0]=ee/p,$(V,pe+4,ee+p),q!==null&&q.push(ot,pe),pe},Cb:$t,readValueFromPointer:hi,Db(q){ot(q)}})}function Rm(o,p){pt(o>>>=0,{Tb:!0,name:p=nt(p>>>0),Cb:0,fromWireType:()=>{},toWireType:()=>{}})}function Mm(o){$i(o>>>0,!d,1,!u,131072,!1),ss()}var mi=o=>{if(!M)try{if(o(),!(0<bt))try{l?xi(A):li(A)}catch(p){p instanceof si||p=="unwind"||x(0,p)}}catch(p){p instanceof si||p=="unwind"||x(0,p)}};function gi(o){o>>>=0,typeof Atomics.jc=="function"&&(Atomics.jc(U(),o>>>2,o).value.then($r),o+=128,Atomics.store(U(),o>>>2,1))}var $r=()=>{var o=zr();o&&(gi(o),mi(no))};function Bm(o,p){(o>>>=0)==p>>>0?setTimeout($r):l?postMessage({Gb:o,Bb:"checkMailbox"}):(o=Ct[o])&&o.postMessage({Bb:"checkMailbox"})}var yi=[];function Nm(o,p,m,_,$){for(p>>>=0,_/=2,yi.length=_,m=$>>>0>>>3,$=0;$<_;$++)yi[$]=H[m+2*$]?H[m+2*$+1]:ae()[m+2*$+1>>>0];return(p?ni[p]:Tg[o])(...yi)}var Dm=()=>{bt=0};function Pm(o){o>>>=0,l?postMessage({Bb:"cleanupThread",hc:o}):ns(Ct[o])}function Lm(o){}var xr=(o,p)=>{var m=pi[o];if(m===void 0)throw o=Js(o),m=nt(o),ot(o),new vt(`${p} has unknown type ${m}`);return m},zs=(o,p,m)=>{var _=[];return o=o.toWireType(_,m),_.length&&(ue()[p>>>2>>>0]=Fe(_)),o};function Um(o,p,m){return p>>>=0,m>>>=0,o=We(o>>>0),p=xr(p,"emval::as"),zs(p,m,o)}function qm(o,p){return p>>>=0,o=We(o>>>0),(p=xr(p,"emval::as")).toWireType(null,o)}var Sr=o=>{try{o()}catch(p){_t(p)}},xt=0,st=null,As=0,kr=[],Os={},Rs={},Wm=0,_i=null,Gm=[];function Ms(o){return(function(p){if(!M){if(xt===0){var m=!1,_=!1;p(($=0)=>{if(!M&&(As=$,m=!0,_)){xt=2,Sr(()=>po(st)),typeof MainLoop<"u"&&MainLoop.Pb&&MainLoop.resume(),$=!1;try{var T=(function(){var V=U()[st+8>>>2>>>0];return V=re[Rs[V]],--bt,V()})()}catch(V){T=V,$=!0}var D=!1;if(!st){var q=_i;q&&(_i=null,($?q.reject:q.resolve)(T),D=!0)}if($&&!D)throw T}}),_=!0,m||(xt=1,st=(function(){var $=Ar(65548),T=$+12;ue()[$>>>2>>>0]=T,ue()[$+4>>>2>>>0]=T+65536,T=kr[0];var D=Os[T];return D===void 0&&(D=Wm++,Os[T]=D,Rs[D]=T),T=D,U()[$+8>>>2>>>0]=T,$})(),typeof MainLoop<"u"&&MainLoop.Pb&&MainLoop.pause(),Sr(()=>uo(st)))}else xt===2?(xt=0,Sr(co),ot(st),st=null,Gm.forEach(mi)):_t(`invalid state: ${xt}`);return As}})(p=>{o().then(p)})}function jm(o){return o>>>=0,Ms(async()=>{var p=await We(o);return Fe(p)})}var Ir=[];function Vm(o,p,m,_){return m>>>=0,_>>>=0,(o=Ir[o>>>0])(null,p=We(p>>>0),m,_)}var Hm={},Tr=o=>{var p=Hm[o];return p===void 0?nt(o):p};function Fm(o,p,m,_,$){return m>>>=0,_>>>=0,$>>>=0,(o=Ir[o>>>0])(p=We(p>>>0),p[m=Tr(m)],_,$)}var Bs=()=>typeof globalThis=="object"?globalThis:Function("return this")();function Km(o){return(o>>>=0)==0?Fe(Bs()):(o=Tr(o),Fe(Bs()[o]))}var Zm=o=>{var p=Ir.length;return Ir.push(o),p},Qm=(o,p)=>{for(var m=Array(o),_=0;_<o;++_)m[_]=xr(ue()[p+4*_>>>2>>>0],"parameter "+_);return m},Ns=(o,p)=>Object.defineProperty(p,"name",{value:o});function Xm(o,p,m){var _=(p=Qm(o,p>>>0)).shift();o--;var $=`return function (obj, func, destructorsRef, args) {
`,T=0,D=[];m===0&&D.push("obj");for(var q=["retType"],V=[_],ee=0;ee<o;++ee)D.push("arg"+ee),q.push("argType"+ee),V.push(p[ee]),$+=`  var arg${ee} = argType${ee}.readValueFromPointer(args${T?"+"+T:""});
`,T+=p[ee].Cb;return $+=`  var rv = ${m===1?"new func":"func.call"}(${D.join(", ")});
`,_.Tb||(q.push("emval_returnValue"),V.push(zs),$+=`  return emval_returnValue(retType, destructorsRef, rv);
`),q.push($+`};
`),o=(function(pe){var ye=Function;if(!(ye instanceof Function))throw new TypeError(`new_ called with constructor type ${typeof ye} which is not a function`);var $e=Ns(ye.name||"unknownFunctionName",function(){});return $e.prototype=ye.prototype,$e=new $e,(pe=ye.apply($e,pe))instanceof Object?pe:$e})(q)(...V),m=`methodCaller<(${p.map(pe=>pe.name).join(", ")}) => ${_.name}>`,Zm(Ns(m,o))}function Ym(o){return o=Tr(o>>>0),Fe(i[o])}function Jm(o,p){return p>>>=0,o=We(o>>>0),p=We(p),Fe(o[p])}function eg(o){9<(o>>>=0)&&(ct[o+1]+=1)}function tg(){return Fe([])}function rg(o){o=We(o>>>0);for(var p=Array(o.length),m=0;m<o.length;m++)p[m]=o[m];return Fe(p)}function ig(o){return Fe(Tr(o>>>0))}function ag(){return Fe({})}function ng(o){for(var p=We(o>>>=0);p.length;){var m=p.pop();p.pop()(m)}fi(o)}function sg(o,p,m){p>>>=0,m>>>=0,o=We(o>>>0),p=We(p),m=We(m),o[p]=m}function og(o,p){return p>>>=0,o=(o=xr(o>>>0,"_emval_take_value")).readValueFromPointer(p),Fe(o)}function ug(o,p){o=-9007199254740992>o||9007199254740992<o?NaN:Number(o),p>>>=0,o=new Date(1e3*o),U()[p>>>2>>>0]=o.getUTCSeconds(),U()[p+4>>>2>>>0]=o.getUTCMinutes(),U()[p+8>>>2>>>0]=o.getUTCHours(),U()[p+12>>>2>>>0]=o.getUTCDate(),U()[p+16>>>2>>>0]=o.getUTCMonth(),U()[p+20>>>2>>>0]=o.getUTCFullYear()-1900,U()[p+24>>>2>>>0]=o.getUTCDay(),o=(o.getTime()-Date.UTC(o.getUTCFullYear(),0,1,0,0,0,0))/864e5|0,U()[p+28>>>2>>>0]=o}var Ds=o=>o%4==0&&(o%100!=0||o%400==0),Ps=[0,31,60,91,121,152,182,213,244,274,305,335],Ls=[0,31,59,90,120,151,181,212,243,273,304,334];function lg(o,p){o=-9007199254740992>o||9007199254740992<o?NaN:Number(o),p>>>=0,o=new Date(1e3*o),U()[p>>>2>>>0]=o.getSeconds(),U()[p+4>>>2>>>0]=o.getMinutes(),U()[p+8>>>2>>>0]=o.getHours(),U()[p+12>>>2>>>0]=o.getDate(),U()[p+16>>>2>>>0]=o.getMonth(),U()[p+20>>>2>>>0]=o.getFullYear()-1900,U()[p+24>>>2>>>0]=o.getDay();var m=(Ds(o.getFullYear())?Ps:Ls)[o.getMonth()]+o.getDate()-1|0;U()[p+28>>>2>>>0]=m,U()[p+36>>>2>>>0]=-60*o.getTimezoneOffset(),m=new Date(o.getFullYear(),6,1).getTimezoneOffset();var _=new Date(o.getFullYear(),0,1).getTimezoneOffset();o=0|(m!=_&&o.getTimezoneOffset()==Math.min(_,m)),U()[p+32>>>2>>>0]=o}function dg(o){o>>>=0;var p=new Date(U()[o+20>>>2>>>0]+1900,U()[o+16>>>2>>>0],U()[o+12>>>2>>>0],U()[o+8>>>2>>>0],U()[o+4>>>2>>>0],U()[o>>>2>>>0],0),m=U()[o+32>>>2>>>0],_=p.getTimezoneOffset(),$=new Date(p.getFullYear(),6,1).getTimezoneOffset(),T=new Date(p.getFullYear(),0,1).getTimezoneOffset(),D=Math.min(T,$);return 0>m?U()[o+32>>>2>>>0]=+($!=T&&D==_):0<m!=(D==_)&&($=Math.max(T,$),p.setTime(p.getTime()+6e4*((0<m?D:$)-_))),U()[o+24>>>2>>>0]=p.getDay(),m=(Ds(p.getFullYear())?Ps:Ls)[p.getMonth()]+p.getDate()-1|0,U()[o+28>>>2>>>0]=m,U()[o>>>2>>>0]=p.getSeconds(),U()[o+4>>>2>>>0]=p.getMinutes(),U()[o+8>>>2>>>0]=p.getHours(),U()[o+12>>>2>>>0]=p.getDate(),U()[o+16>>>2>>>0]=p.getMonth(),U()[o+20>>>2>>>0]=p.getYear(),o=p.getTime(),BigInt(isNaN(o)?-1:o/1e3)}function Us(o,p,m,_,$,T,D){return l?ke(16,1,o,p,m,_,$,T,D):-52}function qs(o,p,m,_,$,T){if(l)return ke(17,1,o,p,m,_,$,T)}var Jt={},pg=()=>performance.timeOrigin+performance.now();function Ws(o,p){if(l)return ke(18,1,o,p);if(Jt[o]&&(clearTimeout(Jt[o].id),delete Jt[o]),!p)return 0;var m=setTimeout(()=>{delete Jt[o],mi(()=>ao(o,performance.timeOrigin+performance.now()))},p);return Jt[o]={id:m,qc:p},0}function cg(o,p,m,_){o>>>=0,p>>>=0,m>>>=0,_>>>=0;var $=new Date().getFullYear(),T=new Date($,0,1).getTimezoneOffset();$=new Date($,6,1).getTimezoneOffset();var D=Math.max(T,$);ue()[o>>>2>>>0]=60*D,U()[p>>>2>>>0]=+(T!=$),o=(p=q=>{var V=Math.abs(q);return`UTC${0<=q?"-":"+"}${String(Math.floor(V/60)).padStart(2,"0")}${String(V%60).padStart(2,"0")}`})(T),p=p($),$<T?(Wt(o,m,17),Wt(p,_,17)):(Wt(o,_,17),Wt(p,m,17))}var fg=()=>Date.now();function hg(o,p,m){return 0<=o&&3>=o?(o===0?o=Date.now():o=performance.timeOrigin+performance.now(),H[m>>>0>>>3]=BigInt(Math.round(1e6*o)),0):28}var bi=[],Gs=(o,p)=>{bi.length=0;for(var m;m=L()[o++>>>0];){var _=m!=105;p+=(_&=m!=112)&&p%8?4:0,bi.push(m==112?ue()[p>>>2>>>0]:m==106?H[p>>>3]:m==105?U()[p>>>2>>>0]:ae()[p>>>3>>>0]),p+=_?8:4}return bi};function mg(o,p,m){return o>>>=0,p=Gs(p>>>0,m>>>0),ni[o](...p)}function gg(o,p,m){return o>>>=0,p=Gs(p>>>0,m>>>0),ni[o](...p)}var yg=()=>{};function _g(o,p){return I(Ce(o>>>0,p>>>0))}var bg=()=>{throw bt+=1,"unwind"};function wg(){return 4294901760}var vg=()=>navigator.hardwareConcurrency;function $g(){return _t("Cannot use emscripten_pc_get_function without -sUSE_OFFSET_CONVERTER"),0}function xg(o){o>>>=0;var p=L().length;if(o<=p||4294901760<o)return!1;for(var m=1;4>=m;m*=2){var _=p*(1+.2/m);_=Math.min(_,o+100663296);e:{_=(Math.min(4294901760,65536*Math.ceil(Math.max(o,_)/65536))-C.buffer.byteLength+65535)/65536|0;try{C.grow(_),de();var $=1;break e}catch{}$=void 0}if($)return!0}return!1}var Er=()=>(_t("Cannot use convertFrameToPC (needed by __builtin_return_address) without -sUSE_OFFSET_CONVERTER"),0),er={},js=o=>{o.forEach(p=>{Er()})};function Sg(){var o=Error().stack.toString().split(`
`);return o[0]=="Error"&&o.shift(),js(o),er.Lb=Er(),er.cc=o,er.Lb}function kg(o,p,m){if(o>>>=0,p>>>=0,er.Lb==o)var _=er.cc;else(_=Error().stack.toString().split(`
`))[0]=="Error"&&_.shift(),js(_);for(var $=3;_[$]&&Er()!=o;)++$;for(o=0;o<m&&_[o+$];++o)U()[p+4*o>>>2>>>0]=Er();return o}var wi,vi={},Vs=()=>{if(!wi){var o,p={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:(typeof navigator=="object"&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",_:"./this.program"};for(o in vi)vi[o]===void 0?delete p[o]:p[o]=vi[o];var m=[];for(o in p)m.push(`${o}=${p[o]}`);wi=m}return wi};function Hs(o,p){if(l)return ke(19,1,o,p);o>>>=0,p>>>=0;var m=0;return Vs().forEach((_,$)=>{var T=p+m;for($=ue()[o+4*$>>>2>>>0]=T,T=0;T<_.length;++T)B()[$++>>>0]=_.charCodeAt(T);B()[$>>>0]=0,m+=_.length+1}),0}function Fs(o,p){if(l)return ke(20,1,o,p);o>>>=0,p>>>=0;var m=Vs();ue()[o>>>2>>>0]=m.length;var _=0;return m.forEach($=>_+=$.length+1),ue()[p>>>2>>>0]=_,0}function Ks(o){return l?ke(21,1,o):52}function Zs(o,p,m,_){return l?ke(22,1,o,p,m,_):52}function Qs(o,p,m,_){return l?ke(23,1,o,p,m,_):70}var Ig=[null,[],[]];function Xs(o,p,m,_){if(l)return ke(24,1,o,p,m,_);p>>>=0,m>>>=0,_>>>=0;for(var $=0,T=0;T<m;T++){var D=ue()[p>>>2>>>0],q=ue()[p+4>>>2>>>0];p+=8;for(var V=0;V<q;V++){var ee=L()[D+V>>>0],pe=Ig[o];ee===0||ee===10?((o===1?S:I)(cs(pe)),pe.length=0):pe.push(ee)}$+=q}return ue()[_>>>2>>>0]=$,0}l||(function(){for(var o=i.numThreads-1;o--;)us();oi.unshift(()=>{yt++,(function(p){l?p():Promise.all(wt.map(os)).then(p)})(()=>vr())})})();for(var Ys=Array(256),Cr=0;256>Cr;++Cr)Ys[Cr]=String.fromCharCode(Cr);Ts=Ys,vt=i.BindingError=class extends Error{constructor(o){super(o),this.name="BindingError"}},i.InternalError=class extends Error{constructor(o){super(o),this.name="InternalError"}},ct.push(0,1,void 0,1,null,1,!0,1,!1,1),i.count_emval_handles=()=>ct.length/2-5-ci.length;var re,Tg=[ui,is,ls,fs,hs,gs,ys,_s,bs,ws,vs,$s,xs,Ss,ks,Is,Us,qs,Ws,Hs,Fs,Ks,Zs,Qs,Xs];(async function(){function o(_,$){return re=_.exports,re=(function(){var T=re,D={};for(let[q,V]of Object.entries(T))D[q]=typeof V=="function"?(...ee)=>{kr.push(q);try{return V(...ee)}finally{M||(kr.pop(),st&&xt===1&&kr.length===0&&(xt=0,bt+=1,Sr(lo),typeof Fibers<"u"&&Fibers.rc()))}}:V;return D})(),re=(function(){var T=re,D=V=>ee=>V(ee)>>>0,q=V=>()=>V()>>>0;return(T=Object.assign({},T)).Da=D(T.Da),T.fb=q(T.fb),T.hb=D(T.hb),T.tb=D(T.tb),T.ub=q(T.ub),T.__cxa_get_exception_ptr=D(T.__cxa_get_exception_ptr),T})(),as.push(re.ib),z=$,vr(),re}yt++;var p=es();if(i.instantiateWasm)return new Promise(_=>{i.instantiateWasm(p,($,T)=>{o($,T),_($.exports)})});if(l)return new Promise(_=>{le=$=>{var T=new WebAssembly.Instance($,es());_(o(T,$))}});De??(De=i.locateFile?i.locateFile?i.locateFile("ort-wasm-simd-threaded.jsep.wasm",v):v+"ort-wasm-simd-threaded.jsep.wasm":new URL(""+new URL("ort-wasm-simd-threaded.jsep-B0T3yYHD.wasm",import.meta.url).href,import.meta.url).href);try{var m=await(async function(_){var $=De;if(!N&&typeof WebAssembly.instantiateStreaming=="function"&&!E($))try{var T=fetch($,{credentials:"same-origin"});return await WebAssembly.instantiateStreaming(T,_)}catch(D){I(`wasm streaming compile failed: ${D}`),I("falling back to ArrayBuffer instantiation")}return(async function(D,q){try{var V=await(async function(ee){if(!N)try{var pe=await g(ee);return new Uint8Array(pe)}catch{}if(ee==De&&N)ee=new Uint8Array(N);else{if(!y)throw"both async and sync fetching of the wasm failed";ee=y(ee)}return ee})(D);return await WebAssembly.instantiate(V,q)}catch(ee){I(`failed to asynchronously prepare wasm: ${ee}`),_t(ee)}})($,_)})(p);return o(m.instance,m.module)}catch(_){return n(_),Promise.reject(_)}})();var Js=o=>(Js=re.Da)(o),eo=()=>(eo=re.Ea)();i._OrtInit=(o,p)=>(i._OrtInit=re.Fa)(o,p),i._OrtGetLastError=(o,p)=>(i._OrtGetLastError=re.Ga)(o,p),i._OrtCreateSessionOptions=(o,p,m,_,$,T,D,q,V,ee)=>(i._OrtCreateSessionOptions=re.Ha)(o,p,m,_,$,T,D,q,V,ee),i._OrtAppendExecutionProvider=(o,p,m,_,$)=>(i._OrtAppendExecutionProvider=re.Ia)(o,p,m,_,$),i._OrtAddFreeDimensionOverride=(o,p,m)=>(i._OrtAddFreeDimensionOverride=re.Ja)(o,p,m),i._OrtAddSessionConfigEntry=(o,p,m)=>(i._OrtAddSessionConfigEntry=re.Ka)(o,p,m),i._OrtReleaseSessionOptions=o=>(i._OrtReleaseSessionOptions=re.La)(o),i._OrtCreateSession=(o,p,m)=>(i._OrtCreateSession=re.Ma)(o,p,m),i._OrtReleaseSession=o=>(i._OrtReleaseSession=re.Na)(o),i._OrtGetInputOutputCount=(o,p,m)=>(i._OrtGetInputOutputCount=re.Oa)(o,p,m),i._OrtGetInputOutputMetadata=(o,p,m,_)=>(i._OrtGetInputOutputMetadata=re.Pa)(o,p,m,_),i._OrtFree=o=>(i._OrtFree=re.Qa)(o),i._OrtCreateTensor=(o,p,m,_,$,T)=>(i._OrtCreateTensor=re.Ra)(o,p,m,_,$,T),i._OrtGetTensorData=(o,p,m,_,$)=>(i._OrtGetTensorData=re.Sa)(o,p,m,_,$),i._OrtReleaseTensor=o=>(i._OrtReleaseTensor=re.Ta)(o),i._OrtCreateRunOptions=(o,p,m,_)=>(i._OrtCreateRunOptions=re.Ua)(o,p,m,_),i._OrtAddRunConfigEntry=(o,p,m)=>(i._OrtAddRunConfigEntry=re.Va)(o,p,m),i._OrtReleaseRunOptions=o=>(i._OrtReleaseRunOptions=re.Wa)(o),i._OrtCreateBinding=o=>(i._OrtCreateBinding=re.Xa)(o),i._OrtBindInput=(o,p,m)=>(i._OrtBindInput=re.Ya)(o,p,m),i._OrtBindOutput=(o,p,m,_)=>(i._OrtBindOutput=re.Za)(o,p,m,_),i._OrtClearBoundOutputs=o=>(i._OrtClearBoundOutputs=re._a)(o),i._OrtReleaseBinding=o=>(i._OrtReleaseBinding=re.$a)(o),i._OrtRunWithBinding=(o,p,m,_,$)=>(i._OrtRunWithBinding=re.ab)(o,p,m,_,$),i._OrtRun=(o,p,m,_,$,T,D,q)=>(i._OrtRun=re.bb)(o,p,m,_,$,T,D,q),i._OrtEndProfiling=o=>(i._OrtEndProfiling=re.cb)(o),i._JsepOutput=(o,p,m)=>(i._JsepOutput=re.db)(o,p,m),i._JsepGetNodeName=o=>(i._JsepGetNodeName=re.eb)(o);var zr=()=>(zr=re.fb)(),ot=i._free=o=>(ot=i._free=re.gb)(o),Ar=i._malloc=o=>(Ar=i._malloc=re.hb)(o),$i=(o,p,m,_,$,T)=>($i=re.kb)(o,p,m,_,$,T),to=()=>(to=re.lb)(),ro=(o,p,m,_,$)=>(ro=re.mb)(o,p,m,_,$),io=o=>(io=re.nb)(o),xi=o=>(xi=re.ob)(o),ao=(o,p)=>(ao=re.pb)(o,p),no=()=>(no=re.qb)(),so=(o,p)=>(so=re.rb)(o,p),Or=o=>(Or=re.sb)(o),Si=o=>(Si=re.tb)(o),ki=()=>(ki=re.ub)(),oo=i.dynCall_ii=(o,p)=>(oo=i.dynCall_ii=re.vb)(o,p),uo=o=>(uo=re.wb)(o),lo=()=>(lo=re.xb)(),po=o=>(po=re.yb)(o),co=()=>(co=re.zb)();return i.stackSave=()=>ki(),i.stackRestore=o=>Or(o),i.stackAlloc=o=>Si(o),i.setValue=function(o,p,m="i8"){switch(m.endsWith("*")&&(m="*"),m){case"i1":case"i8":B()[o>>>0]=p;break;case"i16":Q()[o>>>1>>>0]=p;break;case"i32":U()[o>>>2>>>0]=p;break;case"i64":H[o>>>3]=BigInt(p);break;case"float":ve()[o>>>2>>>0]=p;break;case"double":ae()[o>>>3>>>0]=p;break;case"*":ue()[o>>>2>>>0]=p;break;default:_t(`invalid type for setValue: ${m}`)}},i.getValue=function(o,p="i8"){switch(p.endsWith("*")&&(p="*"),p){case"i1":case"i8":return B()[o>>>0];case"i16":return Q()[o>>>1>>>0];case"i32":return U()[o>>>2>>>0];case"i64":return H[o>>>3];case"float":return ve()[o>>>2>>>0];case"double":return ae()[o>>>3>>>0];case"*":return ue()[o>>>2>>>0];default:_t(`invalid type for getValue: ${p}`)}},i.UTF8ToString=Ce,i.stringToUTF8=Wt,i.lengthBytesUTF8=ms,(function o(){if(0<yt)dt=o;else if(l)a(i),Te();else{for(;0<oi.length;)oi.shift()(i);0<yt?dt=o:(i.calledRun=!0,M||(Te(),a(i)))}})(),i.PTR_SIZE=4,s}),Up=Ri,mo=(t=(e=globalThis.self)==null?void 0:e.name)==null?void 0:t.startsWith("em-pthread"),mo&&Ri()}),Mi,Xa,go,Ge,qp,Mr,yo,_o,Bi,bo,Ni,Wp,Di,Gp,$n=W(()=>{vn(),Mi=typeof location>"u"?void 0:location.origin,Xa=import.meta.url>"file:"&&import.meta.url<"file;",go=()=>{{if(Xa){let e=URL;return new URL(new e("ort.webgpu.bundle.min.mjs",import.meta.url).href,Mi).href}return import.meta.url}},Ge=go(),qp=()=>{if(Ge&&!Ge.startsWith("blob:"))return Ge.substring(0,Ge.lastIndexOf("/")+1)},Mr=(e,t)=>{try{let r=t??Ge;return(r?new URL(e,r):new URL(e)).origin===Mi}catch{return!1}},yo=(e,t)=>{let r=t??Ge;try{return(r?new URL(e,r):new URL(e)).href}catch{return}},_o=(e,t)=>`${t??"./"}${e}`,Bi=async e=>{let t=await(await fetch(e,{credentials:"same-origin"})).blob();return URL.createObjectURL(t)},bo=async e=>(await import(e)).default,Ni=(Yg(),_r(Dp)).default,Wp=async()=>{if(!Ge)throw new Error("Failed to load proxy worker: cannot determine the script source URL.");if(Mr(Ge))return[void 0,Ni()];let e=await Bi(Ge);return[e,Ni(e)]},Di=(Jg(),_r(Lp)).default,Gp=async(e,t,r)=>{if(!e&&!t&&Di&&Ge&&Mr(Ge))return[void 0,Di];{let a="ort-wasm-simd-threaded.jsep.mjs",n=e??yo(a,t),i=r&&n&&!Mr(n,t),s=i?await Bi(n):n??_o(a,t);return[i?s:void 0,await bo(s)]}}}),Pi,Br,ir,Li,wo,vo,$o,xn,xe,Lt=W(()=>{$n(),Br=!1,ir=!1,Li=!1,wo=()=>{if(typeof SharedArrayBuffer>"u")return!1;try{return typeof MessageChannel<"u"&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},vo=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},$o=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,19,1,17,0,65,1,253,15,65,2,253,15,65,3,253,15,253,147,2,11]))}catch{return!1}},xn=async e=>{if(Br)return Promise.resolve();if(ir)throw new Error("multiple calls to 'initializeWebAssembly()' detected.");if(Li)throw new Error("previous call to 'initializeWebAssembly()' failed.");ir=!0;let t=e.initTimeout,r=e.numThreads;if(e.simd!==!1){if(e.simd==="relaxed"){if(!$o())throw new Error("Relaxed WebAssembly SIMD is not supported in the current environment.")}else if(!vo())throw new Error("WebAssembly SIMD is not supported in the current environment.")}let a=wo();r>1&&!a&&(typeof self<"u"&&!self.crossOriginIsolated&&console.warn("env.wasm.numThreads is set to "+r+", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."),console.warn("WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."),e.numThreads=r=1);let n=e.wasmPaths,i=typeof n=="string"?n:void 0,s=n==null?void 0:n.mjs,u=(s==null?void 0:s.href)??s,d=n==null?void 0:n.wasm,l=(d==null?void 0:d.href)??d,c=e.wasmBinary,[f,h]=await Gp(u,i,r>1),g=!1,y=[];if(t>0&&y.push(new Promise(b=>{setTimeout(()=>{g=!0,b()},t)})),y.push(new Promise((b,x)=>{let v={numThreads:r};if(c)v.wasmBinary=c;else if(l||i)v.locateFile=w=>l??i+w;else if(u&&u.indexOf("blob:")!==0)v.locateFile=w=>new URL(w,u).href;else if(f){let w=qp();w&&(v.locateFile=k=>w+k)}h(v).then(w=>{ir=!1,Br=!0,Pi=w,b(),f&&URL.revokeObjectURL(f)},w=>{ir=!1,Li=!0,x(w)})})),await Promise.race(y),g)throw new Error(`WebAssembly backend initializing failed due to timeout: ${t}ms`)},xe=()=>{if(Br&&Pi)return Pi;throw new Error("WebAssembly is not initialized yet.")}}),tt,Qr,we,Sn=W(()=>{Lt(),tt=(e,t)=>{let r=xe(),a=r.lengthBytesUTF8(e)+1,n=r._malloc(a);return r.stringToUTF8(e,n,a),t.push(n),n},Qr=(e,t,r,a)=>{if(typeof e=="object"&&e!==null){if(r.has(e))throw new Error("Circular reference in options");r.add(e)}Object.entries(e).forEach(([n,i])=>{let s=t?t+n:n;if(typeof i=="object")Qr(i,s+".",r,a);else if(typeof i=="string"||typeof i=="number")a(s,i.toString());else if(typeof i=="boolean")a(s,i?"1":"0");else throw new Error(`Can't handle extra config type: ${typeof i}`)})},we=e=>{let t=xe(),r=t.stackSave();try{let a=t.PTR_SIZE,n=t.stackAlloc(2*a);t._OrtGetLastError(n,n+a);let i=Number(t.getValue(n,a===4?"i32":"i64")),s=t.getValue(n+a,"*"),u=s?t.UTF8ToString(s):"";throw new Error(`${e} ERROR_CODE: ${i}, ERROR_MESSAGE: ${u}`)}finally{t.stackRestore(r)}}}),jp,ey=W(()=>{Lt(),Sn(),jp=e=>{let t=xe(),r=0,a=[],n=e||{};try{if((e==null?void 0:e.logSeverityLevel)===void 0)n.logSeverityLevel=2;else if(typeof e.logSeverityLevel!="number"||!Number.isInteger(e.logSeverityLevel)||e.logSeverityLevel<0||e.logSeverityLevel>4)throw new Error(`log serverity level is not valid: ${e.logSeverityLevel}`);if((e==null?void 0:e.logVerbosityLevel)===void 0)n.logVerbosityLevel=0;else if(typeof e.logVerbosityLevel!="number"||!Number.isInteger(e.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${e.logVerbosityLevel}`);(e==null?void 0:e.terminate)===void 0&&(n.terminate=!1);let i=0;return(e==null?void 0:e.tag)!==void 0&&(i=tt(e.tag,a)),r=t._OrtCreateRunOptions(n.logSeverityLevel,n.logVerbosityLevel,!!n.terminate,i),r===0&&we("Can't create run options."),(e==null?void 0:e.extra)!==void 0&&Qr(e.extra,"",new WeakSet,(s,u)=>{let d=tt(s,a),l=tt(u,a);t._OrtAddRunConfigEntry(r,d,l)!==0&&we(`Can't set a run config entry: ${s} - ${u}.`)}),[r,a]}catch(i){throw r!==0&&t._OrtReleaseRunOptions(r),a.forEach(s=>t._free(s)),i}}}),xo,So,ko,ar,Io,Vp,ty=W(()=>{Lt(),Sn(),xo=e=>{switch(e){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"all":return 99;default:throw new Error(`unsupported graph optimization level: ${e}`)}},So=e=>{switch(e){case"sequential":return 0;case"parallel":return 1;default:throw new Error(`unsupported execution mode: ${e}`)}},ko=e=>{e.extra||(e.extra={}),e.extra.session||(e.extra.session={});let t=e.extra.session;t.use_ort_model_bytes_directly||(t.use_ort_model_bytes_directly="1"),e.executionProviders&&e.executionProviders.some(r=>(typeof r=="string"?r:r.name)==="webgpu")&&(e.enableMemPattern=!1)},ar=(e,t,r,a)=>{let n=tt(t,a),i=tt(r,a);xe()._OrtAddSessionConfigEntry(e,n,i)!==0&&we(`Can't set a session config entry: ${t} - ${r}.`)},Io=async(e,t,r)=>{for(let a of t){let n=typeof a=="string"?a:a.name,i=[];switch(n){case"webnn":if(n="WEBNN",typeof a!="string"){let c=a==null?void 0:a.deviceType;c&&ar(e,"deviceType",c,r)}break;case"webgpu":if(n="JS",typeof a!="string"){let c=a;if(c!=null&&c.preferredLayout){if(c.preferredLayout!=="NCHW"&&c.preferredLayout!=="NHWC")throw new Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${c.preferredLayout}`);ar(e,"preferredLayout",c.preferredLayout,r)}}break;case"wasm":case"cpu":continue;default:throw new Error(`not supported execution provider: ${n}`)}let s=tt(n,r),u=i.length,d=0,l=0;if(u>0){d=xe()._malloc(u*xe().PTR_SIZE),r.push(d),l=xe()._malloc(u*xe().PTR_SIZE),r.push(l);for(let c=0;c<u;c++)xe().setValue(d+c*xe().PTR_SIZE,i[c][0],"*"),xe().setValue(l+c*xe().PTR_SIZE,i[c][1],"*")}await xe()._OrtAppendExecutionProvider(e,s,d,l,u)!==0&&we(`Can't append execution provider: ${n}.`)}},Vp=async e=>{let t=xe(),r=0,a=[],n=e||{};ko(n);try{let i=xo(n.graphOptimizationLevel??"all"),s=So(n.executionMode??"sequential"),u=typeof n.logId=="string"?tt(n.logId,a):0,d=n.logSeverityLevel??2;if(!Number.isInteger(d)||d<0||d>4)throw new Error(`log serverity level is not valid: ${d}`);let l=n.logVerbosityLevel??0;if(!Number.isInteger(l)||l<0||l>4)throw new Error(`log verbosity level is not valid: ${l}`);let c=typeof n.optimizedModelFilePath=="string"?tt(n.optimizedModelFilePath,a):0;if(r=t._OrtCreateSessionOptions(i,!!n.enableCpuMemArena,!!n.enableMemPattern,s,!!n.enableProfiling,0,u,d,l,c),r===0&&we("Can't create session options."),n.executionProviders&&await Io(r,n.executionProviders,a),n.enableGraphCapture!==void 0){if(typeof n.enableGraphCapture!="boolean")throw new Error(`enableGraphCapture must be a boolean value: ${n.enableGraphCapture}`);ar(r,"enableGraphCapture",n.enableGraphCapture.toString(),a)}if(n.freeDimensionOverrides)for(let[f,h]of Object.entries(n.freeDimensionOverrides)){if(typeof f!="string")throw new Error(`free dimension override name must be a string: ${f}`);if(typeof h!="number"||!Number.isInteger(h)||h<0)throw new Error(`free dimension override value must be a non-negative integer: ${h}`);let g=tt(f,a);t._OrtAddFreeDimensionOverride(r,g,h)!==0&&we(`Can't set a free dimension override: ${f} - ${h}.`)}return n.extra!==void 0&&Qr(n.extra,"",new WeakSet,(f,h)=>{ar(r,f,h,a)}),[r,a]}catch(i){throw r!==0&&t._OrtReleaseSessionOptions(r)!==0&&we("Can't release session options."),a.forEach(s=>t._free(s)),i}}}),Vt,ht,Bt,kn,Xr,In,Tn,Ya,ne=W(()=>{Vt=e=>{switch(e){case"int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"uint32":return 12;case"float16":return 10;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int64":return 7;case"uint64":return 13;case"int4":return 22;case"uint4":return 21;default:throw new Error(`unsupported data type: ${e}`)}},ht=e=>{switch(e){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:return"uint16";case 6:return"int32";case 12:return"uint32";case 10:return"float16";case 1:return"float32";case 11:return"float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";case 22:return"int4";case 21:return"uint4";default:throw new Error(`unsupported data type: ${e}`)}},Bt=(e,t)=>{let r=[-1,4,1,1,2,2,4,8,-1,1,2,8,4,8,-1,-1,-1,-1,-1,-1,-1,.5,.5][e],a=typeof t=="number"?t:t.reduce((n,i)=>n*i,1);return r>0?Math.ceil(a*r):void 0},kn=e=>{switch(e){case"float16":return typeof Float16Array<"u"&&Float16Array.from?Float16Array:Uint16Array;case"float32":return Float32Array;case"uint8":return Uint8Array;case"int8":return Int8Array;case"uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"bool":return Uint8Array;case"float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:throw new Error(`unsupported type: ${e}`)}},Xr=e=>{switch(e){case"verbose":return 0;case"info":return 1;case"warning":return 2;case"error":return 3;case"fatal":return 4;default:throw new Error(`unsupported logging level: ${e}`)}},In=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",Tn=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint64"||e==="int8"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",Ya=e=>{switch(e){case"none":return 0;case"cpu":return 1;case"cpu-pinned":return 2;case"texture":return 3;case"gpu-buffer":return 4;case"ml-tensor":return 5;default:throw new Error(`unsupported data location: ${e}`)}}}),En,Hp=W(()=>{vn(),En=async e=>{if(typeof e=="string"){let t=await fetch(e);if(!t.ok)throw new Error(`failed to load external data file: ${e}`);let r=t.headers.get("Content-Length"),a=r?parseInt(r,10):0;if(a<1073741824)return new Uint8Array(await t.arrayBuffer());{if(!t.body)throw new Error(`failed to load external data file: ${e}, no response body.`);let n=t.body.getReader(),i;try{i=new ArrayBuffer(a)}catch(u){if(u instanceof RangeError){let d=Math.ceil(a/65536);i=new WebAssembly.Memory({initial:d,maximum:d}).buffer}else throw u}let s=0;for(;;){let{done:u,value:d}=await n.read();if(u)break;let l=d.byteLength;new Uint8Array(i,s,l).set(d),s+=l}return new Uint8Array(i,0,a)}}else return e instanceof Blob?new Uint8Array(await e.arrayBuffer()):e instanceof Uint8Array?e:new Uint8Array(e)}}),To,Eo,Co,zo,Cn,Ao,me,gt=W(()=>{ne(),To=["V","I","W","E","F"],Eo=(e,t)=>{console.log(`[${To[e]},${new Date().toISOString()}]${t}`)},Cn=(e,t)=>{Co=e,zo=t},Ao=(e,t)=>{let r=Xr(e),a=Xr(Co);r>=a&&Eo(r,typeof t=="function"?t():t)},me=(...e)=>{zo&&Ao(...e)}}),Oo,Kt,R,Yr,Fp,Kp,Zp,se=W(()=>{Oo=class{static calcMatMulShape(e,t){return e[1]!==t[0]?void 0:[e[0],t[1]]}},Kt=class{static calcShape(e,t,r=!1){let a=e.length,n=t.length;if(a===0)return t;if(n===0)return e;let i=Math.max(e.length,t.length),s=new Array(i);if(r){if(a<2||n<2)return;let u=Oo.calcMatMulShape([e[a-2],e[a-1]],[t[n-2],t[n-1]]);if(u===void 0)return;[s[i-2],s[i-1]]=u}for(let u=r?3:1;u<=i;u++){let d=a-u<0?1:e[a-u],l=n-u<0?1:t[n-u];if(d!==l&&d>1&&l>1)return;let c=Math.max(d,l);if(d&&l)s[i-u]=Math.max(d,l);else{if(c>1)return;s[i-u]=0}}return s}static isValidBroadcast(e,t){let r=e.length,a=t.length;if(r>a)return!1;for(let n=1;n<=r;n++)if(e[r-n]!==1&&e[r-n]!==t[a-n])return!1;return!0}},R=class Fr{static size(t){return Fr.getSizeFromDimensionRange(t,0,t.length)}static convertShape(t,r=4){let a=t.length;if(a===0)return[];let n=new Array(a),i=a-1;for(;i>=0;){if(t[i]%r===0){n[i]=t[i]/r;break}if(r%t[i]!==0)throw new Error("cannot convert shape");n[i]=1,r/=t[i],i--}for(i--;i>=0;i--)n[i]=t[i];return n}static sizeFromDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeFromDimension as Tensor has ${t.length} dimensions.`);return Fr.getSizeFromDimensionRange(t,r,t.length)}static sizeToDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeToDimension as Tensor has ${t.length} dimensions.`);return Fr.getSizeFromDimensionRange(t,0,r)}static getSizeFromDimensionRange(t,r,a){let n=1;for(let i=r;i<a;i++){if(t[i]<0)throw new Error("cannot get valid size from specified dimension range. Most likely the range contains negative values in them.");n*=Number(t[i])}return n}static computeStrides(t){let r=t.length;if(r===0)return[];if(r===1)return[1];let a=new Array(r);a[r-1]=1,a[r-2]=t[r-1];for(let n=r-3;n>=0;--n)a[n]=a[n+1]*t[n+1];return a}static normalizeAxis(t,r){if(t<-r&&t>=r)throw new Error("unsupported axis for this operation.");return t<0?t+r:t}static normalizeAxes(t,r){return t.map(a=>this.normalizeAxis(a,r??t.length))}static sortBasedOnPerm(t,r){return r?r.map(a=>t[a]):t.slice().reverse()}static padShape(t,r){let a=t.length;return t.map((n,i)=>n+r[i]+r[i+a])}static areEqual(t,r){return t.length!==r.length?!1:t.every((a,n)=>a===r[n])}},Yr=class hr{static adjustPoolAttributes(t,r,a,n,i,s){if(!t&&a.length!==r.length-2)throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");if(t)for(let u=0;u<r.length-2;u++)u>=a.length?a.push(r[u+2]):a[u]=r[u+2];for(let u=0;u<a.length;u++)if(u<n.length){if(n[u]<0)throw new Error("strides should be greater than or equal to 1")}else n.push(1);for(let u=0;u<a.length;u++)if(u<i.length){if(i[u]<0)throw new Error("dilations should be greater than or equal to 1")}else i.push(1);for(let u=0;u<a.length*2;u++)if(u<s.length){if(s[u]<0)throw new Error("pad should be greater than or equal to 1")}else s.push(0);for(let u=0;u<a.length;u++){if(a[u]<=0)throw new Error("kernel shapes need to be greater than 0");if(s[u]>=a[u]||s[u+a.length]>=a[u])throw new Error("pads should be smaller than kernel")}}static adjustPadsBasedOnAutoPad(t,r,a,n,i,s,u){if(u){if(i.length!==2*(t.length-2))throw new Error("length of pads should be twice the length of data dimensions");if(r.length!==t.length-2)throw new Error("length of strides should be the length of data dimensions");if(n.length!==t.length-2)throw new Error("length of kernel shapes should be the length of data dimensions");for(let d=0;d<t.length-2;d++)hr.adjustPadAndReturnShape(t[d+(s?1:2)],r[d],a[d],n[d],i,d,d+t.length-2,u)}}static computePoolOutputShape(t,r,a,n,i,s,u){if(r.length<=0)throw new Error("input shape must be of size greater than 0");let d=[r[0],r[1]];return hr.computeShapeHelper(t,r,d,a,n,i,s,u),d}static computeConvOutputShape(t,r,a,n,i,s,u){if(t.length<=0||r.length<=0)throw new Error("invalid input tensor dims or invalid filter tensor dims");let d=[t[0],r[0]];return hr.computeShapeHelper(!1,t,d,a,n,i,s,u),d}static computeShapeHelper(t,r,a,n,i,s,u,d){if(t)for(let l=0;l<r.length-2;l++)a.push(1);else for(let l=0;l<r.length-2;l++)a.push(hr.adjustPadAndReturnShape(r[l+2],n[l],i[l],s[l],u,l,l+r.length-2,d))}static adjustPadAndReturnShape(t,r,a,n,i,s,u,d){let l=a*(n-1)+1;if(d&&d!=="NOTSET")switch(d){case"VALID":return i[s]=0,i[u]=0,Math.floor((t-l)/r+1);case"SAME_LOWER":case"SAME_UPPER":if(a!==1)throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");{let c=((t+r-1)/r-1)*r+n-t;return i[s]=Math.floor(d==="SAME_LOWER"?(c+1)/2:c/2),i[u]=c-i[s],Math.floor((t+c-n)/r+1)}default:throw new Error("Unsupported AutoPad type")}else return Math.floor((t+i[s]+i[u]-l)/r+1)}},Fp=class{static getShapeOfGemmResult(e,t,r,a,n){if(e.length!==2||r.length!==2)throw new Error("shape need to be of size 2");let i,s,u;t?(i=e[1],s=e[0]):(i=e[0],s=e[1]);let d=-1;if(a?(u=r[0],d=1):(u=r[1],d=0),r[d]!==s)throw new Error("dimension mismatch");if(i<=0||u<=0||s<=0)throw new Error("invalid shape specified");if(n&&!Kt.isValidBroadcast(n,[i,u]))throw new Error("gemm: invalid bias shape for broadcast");return[i,u,s]}},Kp=-34028234663852886e22,Zp=34028234663852886e22}),zn,Qp=W(()=>{ne(),zn=(e,t)=>new(kn(t))(e)}),Ja,Ui,Ro,qi,Mo,Wi,Gi,ji,Bo,Xp,ry=W(()=>{gt(),Ja=(e,t=!0)=>{if(e.byteLength%8!==0)throw new Error("Invalid Uint8Array length - must be a multiple of 8 (BigInt).");let r=e.byteLength/8,a=new BigInt64Array(e.buffer,e.byteOffset,r),n=new Int32Array(r);for(let i=0;i<r;i++){let s=a[i];if(s>2147483647n||s<-2147483648n)throw new Error(`Overflow occurred when converting BigInt to Int32 at index ${i}: ${s}`);n[i]=Number(s)}return t?new Uint8Array(n.buffer):n},Ui=(e,t=!0)=>{if(e.byteLength%4!==0)throw new Error("Invalid Uint8Array length - must be a multiple of 4 (Int32).");let r=e.byteLength/4,a=new Int32Array(e.buffer,e.byteOffset,r),n=BigInt64Array.from(a,BigInt);return t?new Uint8Array(n.buffer):n},Ro=1,qi=()=>Ro++,Mo=new Map([["float32",32],["float16",16],["int32",32],["uint32",32],["int64",64],["uint64",64],["int8",8],["uint8",8],["int4",4],["uint4",4]]),Wi=(e,t)=>{let r=Mo.get(e);if(!r)throw new Error("Unsupported data type.");return t.length>0?Math.ceil(t.reduce((a,n)=>a*n)*r/8):0},Gi=class{constructor(e){this.shouldConvertInt64toInt32=!1,this.isInt64ToInt32Converted=!1;let{sessionId:t,context:r,tensor:a,dataType:n,shape:i,shouldConvertInt64toInt32:s=!1}=e;this.sessionId=t,this.mlContext=r,this.mlTensor=a,this.dataType=n,this.tensorShape=i,this.shouldConvertInt64toInt32=s}get tensor(){return this.mlTensor}get type(){return this.dataType}get shape(){return this.tensorShape}get byteLength(){return Wi(this.dataType,this.tensorShape)}destroy(){me("verbose",()=>"[WebNN] TensorWrapper.destroy"),this.mlTensor.destroy()}write(e){this.mlContext.writeTensor(this.mlTensor,e)}async read(e,t){if(e){let r=await this.mlContext.readTensor(this.mlTensor),a=Ui(new Uint8Array(r));if(t){(t instanceof ArrayBuffer?new Uint8Array(t):new Uint8Array(t.buffer,t.byteOffset,t.byteLength)).set(a);return}else return a.buffer}else return t?this.mlContext.readTensor(this.mlTensor,t):this.mlContext.readTensor(this.mlTensor)}canReuseTensor(e,t,r){return this.mlContext===e&&this.dataType===t&&this.tensorShape.length===r.length&&this.tensorShape.every((a,n)=>a===r[n])}setIsInt64ToInt32Converted(e){this.isInt64ToInt32Converted=e}},ji=class{constructor(e,t){this.tensorManager=e,this.wrapper=t}get tensorWrapper(){return this.wrapper}releaseTensor(){this.tensorWrapper&&(this.tensorManager.releaseTensor(this.tensorWrapper),this.wrapper=void 0)}async ensureTensor(e,t,r,a){let n=t,i=this.tensorManager.getMLContext(e),s=n==="int64"&&!i.opSupportLimits().input.dataTypes.includes("int64");if(s&&(n="int32",me("verbose",()=>"[WebNN] TensorIdTracker.ensureTensor: convert dataType from int64 to int32")),this.wrapper){if(this.wrapper.canReuseTensor(i,n,r))return this.wrapper.tensor;if(a){if(this.wrapper.byteLength!==Wi(n,r))throw new Error("Unable to copy data to tensor with different size.");this.activeUpload=new Uint8Array(await this.wrapper.read())}this.tensorManager.releaseTensor(this.wrapper)}let u=typeof MLTensorUsage>"u"?void 0:MLTensorUsage.READ|MLTensorUsage.WRITE;return this.wrapper=await this.tensorManager.getCachedTensor(e,n,r,u,!0,!0,s),a&&this.activeUpload&&(this.wrapper.write(this.activeUpload),this.activeUpload=void 0),this.wrapper.tensor}upload(e){let t=e;if(this.wrapper)if(this.wrapper.shouldConvertInt64toInt32&&(t=Ja(e,!0),this.wrapper.setIsInt64ToInt32Converted(!0)),t.byteLength===this.wrapper.byteLength){this.wrapper.write(t);return}else me("verbose",()=>"Data size does not match tensor size. Releasing tensor."),this.releaseTensor();this.activeUpload?this.activeUpload.set(t):this.activeUpload=new Uint8Array(t)}async download(e){var t,r,a;if(this.activeUpload){let n=(t=this.wrapper)!=null&&t.isInt64ToInt32Converted?Ui(this.activeUpload):this.activeUpload;if(e){e instanceof ArrayBuffer?new Uint8Array(e).set(n):new Uint8Array(e.buffer,e.byteOffset,e.byteLength).set(n);return}else return n.buffer}if(!this.wrapper)throw new Error("Tensor has not been created.");return e?this.wrapper.read((r=this.wrapper)==null?void 0:r.shouldConvertInt64toInt32,e):this.wrapper.read((a=this.wrapper)==null?void 0:a.shouldConvertInt64toInt32)}},Bo=class{constructor(e){this.backend=e,this.tensorTrackersById=new Map,this.freeTensors=[],this.externalTensors=new Set}getMLContext(e){let t=this.backend.getMLContext(e);if(!t)throw new Error("MLContext not found for session.");return t}reserveTensorId(){let e=qi();return this.tensorTrackersById.set(e,new ji(this)),e}releaseTensorId(e){let t=this.tensorTrackersById.get(e);t&&(this.tensorTrackersById.delete(e),t.tensorWrapper&&this.releaseTensor(t.tensorWrapper))}async ensureTensor(e,t,r,a,n){me("verbose",()=>`[WebNN] TensorManager.ensureTensor {tensorId: ${t}, dataType: ${r}, shape: ${a}, copyOld: ${n}}`);let i=this.tensorTrackersById.get(t);if(!i)throw new Error("Tensor not found.");return i.ensureTensor(e,r,a,n)}upload(e,t){let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");r.upload(t)}async download(e,t){me("verbose",()=>`[WebNN] TensorManager.download {tensorId: ${e}, dstBuffer: ${t==null?void 0:t.byteLength}}`);let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");return r.download(t)}releaseTensorsForSession(e){for(let t of this.freeTensors)t.sessionId===e&&t.destroy();this.freeTensors=this.freeTensors.filter(t=>t.sessionId!==e)}registerTensor(e,t,r,a){let n=this.getMLContext(e),i=qi(),s=new Gi({sessionId:e,context:n,tensor:t,dataType:r,shape:a});return this.tensorTrackersById.set(i,new ji(this,s)),this.externalTensors.add(s),i}async getCachedTensor(e,t,r,a,n,i,s=!1){let u=this.getMLContext(e);for(let[l,c]of this.freeTensors.entries())if(c.canReuseTensor(u,t,r)){me("verbose",()=>`[WebNN] Reusing tensor {dataType: ${t}, shape: ${r}}`);let f=this.freeTensors.splice(l,1)[0];return f.sessionId=e,f}me("verbose",()=>`[WebNN] MLContext.createTensor {dataType: ${t}, shape: ${r}}`);let d=await u.createTensor({dataType:t,shape:r,dimensions:r,usage:a,writable:n,readable:i});return new Gi({sessionId:e,context:u,tensor:d,dataType:t,shape:r,shouldConvertInt64toInt32:s})}releaseTensor(e){this.externalTensors.has(e)&&this.externalTensors.delete(e),this.freeTensors.push(e)}},Xp=(...e)=>new Bo(...e)}),Nr,No,Yp,iy=W(()=>{ne(),Lt(),Qp(),ry(),gt(),Nr=new Map([[1,"float32"],[10,"float16"],[6,"int32"],[12,"uint32"],[7,"int64"],[13,"uint64"],[22,"int4"],[21,"uint4"],[3,"int8"],[2,"uint8"],[9,"uint8"]]),No=(e,t)=>{if(e===t)return!0;if(e===void 0||t===void 0)return!1;let r=Object.keys(e).sort(),a=Object.keys(t).sort();return r.length===a.length&&r.every((n,i)=>n===a[i]&&e[n]===t[n])},Yp=class{constructor(e){this.tensorManager=Xp(this),this.mlContextBySessionId=new Map,this.sessionIdsByMLContext=new Map,this.mlContextCache=[],this.sessionGraphInputs=new Map,this.temporaryGraphInputs=[],this.temporarySessionTensorIds=new Map,Cn(e.logLevel,!!e.debug)}get currentSessionId(){if(this.activeSessionId===void 0)throw new Error("No active session");return this.activeSessionId}onRunStart(e){me("verbose",()=>`[WebNN] onRunStart {sessionId: ${e}}`),this.activeSessionId=e}onRunEnd(e){me("verbose",()=>`[WebNN] onRunEnd {sessionId: ${e}}`);let t=this.temporarySessionTensorIds.get(e);if(t){for(let r of t)me("verbose",()=>`[WebNN] releasing temporary tensor {tensorId: ${r}}`),this.tensorManager.releaseTensorId(r);this.temporarySessionTensorIds.delete(e),this.activeSessionId=void 0}}async createMLContext(e){if(e instanceof GPUDevice){let r=this.mlContextCache.findIndex(a=>a.gpuDevice===e);if(r!==-1)return this.mlContextCache[r].mlContext;{let a=await navigator.ml.createContext(e);return this.mlContextCache.push({gpuDevice:e,mlContext:a}),a}}else if(e===void 0){let r=this.mlContextCache.findIndex(a=>a.options===void 0&&a.gpuDevice===void 0);if(r!==-1)return this.mlContextCache[r].mlContext;{let a=await navigator.ml.createContext();return this.mlContextCache.push({mlContext:a}),a}}let t=this.mlContextCache.findIndex(r=>No(r.options,e));if(t!==-1)return this.mlContextCache[t].mlContext;{let r=await navigator.ml.createContext(e);return this.mlContextCache.push({options:e,mlContext:r}),r}}registerMLContext(e,t){this.mlContextBySessionId.set(e,t);let r=this.sessionIdsByMLContext.get(t);r||(r=new Set,this.sessionIdsByMLContext.set(t,r)),r.add(e),this.temporaryGraphInputs.length>0&&(this.sessionGraphInputs.set(e,this.temporaryGraphInputs),this.temporaryGraphInputs=[])}onReleaseSession(e){this.sessionGraphInputs.delete(e);let t=this.mlContextBySessionId.get(e);if(!t)return;this.tensorManager.releaseTensorsForSession(e),this.mlContextBySessionId.delete(e);let r=this.sessionIdsByMLContext.get(t);if(r.delete(e),r.size===0){this.sessionIdsByMLContext.delete(t);let a=this.mlContextCache.findIndex(n=>n.mlContext===t);a!==-1&&this.mlContextCache.splice(a,1)}}getMLContext(e){return this.mlContextBySessionId.get(e)}reserveTensorId(){return this.tensorManager.reserveTensorId()}releaseTensorId(e){me("verbose",()=>`[WebNN] releaseTensorId {tensorId: ${e}}`),this.tensorManager.releaseTensorId(e)}async ensureTensor(e,t,r,a,n){let i=Nr.get(r);if(!i)throw new Error(`Unsupported ONNX data type: ${r}`);return this.tensorManager.ensureTensor(e??this.currentSessionId,t,i,a,n)}async createTemporaryTensor(e,t,r){me("verbose",()=>`[WebNN] createTemporaryTensor {onnxDataType: ${t}, shape: ${r}}`);let a=Nr.get(t);if(!a)throw new Error(`Unsupported ONNX data type: ${t}`);let n=this.tensorManager.reserveTensorId();await this.tensorManager.ensureTensor(e,n,a,r,!1);let i=this.temporarySessionTensorIds.get(e);return i?i.push(n):this.temporarySessionTensorIds.set(e,[n]),n}uploadTensor(e,t){if(!xe().shouldTransferToMLTensor)throw new Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");me("verbose",()=>`[WebNN] uploadTensor {tensorId: ${e}, data: ${t.byteLength}}`),this.tensorManager.upload(e,t)}async downloadTensor(e,t){return this.tensorManager.download(e,t)}createMLTensorDownloader(e,t){return async()=>{let r=await this.tensorManager.download(e);return zn(r,t)}}registerMLTensor(e,t,r,a){let n=Nr.get(r);if(!n)throw new Error(`Unsupported ONNX data type: ${r}`);let i=this.tensorManager.registerTensor(e,t,n,a);return me("verbose",()=>`[WebNN] registerMLTensor {tensor: ${t}, dataType: ${n}, dimensions: ${a}} -> {tensorId: ${i}}`),i}registerMLConstant(e,t,r,a,n,i,s=!1){if(!i)throw new Error("External mounted files are not available.");let u=e;e.startsWith("./")&&(u=e.substring(2));let d=i.get(u);if(!d)throw new Error(`File with name ${u} not found in preloaded files.`);if(t+r>d.byteLength)throw new Error("Out of bounds: data offset and length exceed the external file data size.");let l=d.slice(t,t+r).buffer,c;switch(n.dataType){case"float32":c=new Float32Array(l);break;case"float16":c=typeof Float16Array<"u"&&Float16Array.from?new Float16Array(l):new Uint16Array(l);break;case"int32":c=new Int32Array(l);break;case"uint32":c=new Uint32Array(l);break;case"int64":s?(c=Ja(new Uint8Array(l),!1),n.dataType="int32"):c=new BigInt64Array(l);break;case"uint64":c=new BigUint64Array(l);break;case"int8":c=new Int8Array(l);break;case"int4":case"uint4":case"uint8":c=new Uint8Array(l);break;default:throw new Error(`Unsupported data type: ${n.dataType} in creating WebNN Constant from external data.`)}return me("verbose",()=>`[WebNN] registerMLConstant {dataType: ${n.dataType}, shape: ${n.shape}}} ${s?"(Note: it was int64 data type and registered to int32 as workaround)":""}`),a.constant(n,c)}registerGraphInput(e){this.temporaryGraphInputs.push(e)}isGraphInput(e,t){let r=this.sessionGraphInputs.get(e);return r?r.includes(t):!1}isInt64Supported(e){var t;return!!((t=this.mlContextBySessionId.get(e))!=null&&t.opSupportLimits().input.dataTypes.includes("int64"))}flush(){}}}),An=W(()=>{}),Vi,Dr,Pr,Do,Po,Hi,en,Lo,Jp,ay=W(()=>{gt(),An(),Vi=new Map([[64,250],[128,200],[256,200],[512,200],[2048,230],[4096,200],[8192,50],[16384,50],[32768,50],[65536,50],[131072,50],[262144,50],[524288,50],[1048576,50],[2097152,30],[4194304,20],[8388608,10],[12582912,10],[16777216,10],[26214400,15],[33554432,22],[44236800,2],[58982400,6],[67108864,6],[134217728,6],[167772160,6]]),Dr=[],Pr=e=>Math.ceil(Number(e)/16)*16,Do=e=>{for(let t=0;t<Dr.length;t++){let r=Dr[t];if(e<=r)return r}return Math.ceil(e/16)*16},Po=1,Hi=()=>Po++,en=async(e,t,r,a)=>{let n=Pr(r),i=e.device.createBuffer({size:n,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});try{let s=e.getCommandEncoder();e.endComputePass(),s.copyBufferToBuffer(t,0,i,0,n),e.flush(),await i.mapAsync(GPUMapMode.READ);let u=i.getMappedRange();if(a){let d=a();return d.set(new Uint8Array(u,0,r)),d}else return new Uint8Array(u.slice(0,r))}finally{i.destroy()}},Lo=class{constructor(e){this.backend=e,this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.buffersPending=[],this.capturedPendingBuffers=new Map;for(let[t]of Vi)Dr.push(t),this.freeBuffers.set(t,[]),this.freeUniformBuffers.set(t,[]);this.sessionCount=0}upload(e,t){let r=t.buffer,a=t.byteOffset,n=t.byteLength,i=Pr(n),s=this.storageCache.get(e);if(!s)throw new Error("gpu data for uploading does not exist");if(Number(s.originalSize)!==n)throw new Error(`inconsistent data size. gpu data size=${s.originalSize}, data size=${n}`);let u=this.backend.device.createBuffer({mappedAtCreation:!0,size:i,usage:GPUBufferUsage.MAP_WRITE|GPUBufferUsage.COPY_SRC}),d=u.getMappedRange();new Uint8Array(d).set(new Uint8Array(r,a,n)),u.unmap();let l=this.backend.device.createCommandEncoder();l.copyBufferToBuffer(u,0,s.gpuData.buffer,0,i),this.backend.device.queue.submit([l.finish()]),u.destroy(),me("verbose",()=>`[WebGPU] GpuDataManager.upload(id=${e})`)}memcpy(e,t){let r=this.storageCache.get(e);if(!r)throw new Error("source gpu data for memcpy does not exist");let a=this.storageCache.get(t);if(!a)throw new Error("destination gpu data for memcpy does not exist");if(r.originalSize!==a.originalSize)throw new Error("inconsistent source and destination gpu data size");let n=Pr(r.originalSize),i=this.backend.getCommandEncoder();this.backend.endComputePass(),i.copyBufferToBuffer(r.gpuData.buffer,0,a.gpuData.buffer,0,n)}registerExternalBuffer(e,t,r){let a;if(r){if(a=r[0],e===r[1])return me("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${a}, buffer is the same, skip.`),a;if(this.backend.capturedCommandList.has(this.backend.currentSessionId))throw new Error(`Registering a different external buffer under graph capture mode is not supported yet.
             Please use the previous external buffer!`)}else a=Hi();return this.storageCache.set(a,{gpuData:{id:a,type:0,buffer:e},originalSize:t}),me("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${a}, registered.`),a}unregisterExternalBuffer(e){e!==void 0&&(this.storageCache.delete(e),me("verbose",()=>`[WebGPU] GpuDataManager.unregisterExternalBuffer() => id=${e}`))}create(e,t=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST){let r=Do(e),a,n=(t&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE,i=(t&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM;if(n||i){let u=(n?this.freeBuffers:this.freeUniformBuffers).get(r);u?u.length>0?a=u.pop():a=this.backend.device.createBuffer({size:r,usage:t}):a=this.backend.device.createBuffer({size:r,usage:t})}else a=this.backend.device.createBuffer({size:r,usage:t});let s={id:Hi(),type:0,buffer:a};return this.storageCache.set(s.id,{gpuData:s,originalSize:Number(e)}),me("verbose",()=>`[WebGPU] GpuDataManager.create(size=${e}) => id=${s.id}`),s}get(e){var t;return(t=this.storageCache.get(e))==null?void 0:t.gpuData}release(e){let t=typeof e=="bigint"?Number(e):e,r=this.storageCache.get(t);if(!r){if(this.storageCache.size===0)return 0;throw new Error("releasing data does not exist")}return me("verbose",()=>`[WebGPU] GpuDataManager.release(id=${t}), gpuDataId=${r.gpuData.id}`),this.storageCache.delete(t),this.buffersPending.push(r.gpuData.buffer),r.originalSize}async download(e,t){let r=this.storageCache.get(Number(e));if(!r)throw new Error("data does not exist");await en(this.backend,r.gpuData.buffer,r.originalSize,t)}refreshPendingBuffers(){if(this.buffersPending.length!==0)if(this.backend.sessionStatus==="default"){for(let e of this.buffersPending){let t=Vi.get(e.size);if((e.usage&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE){let r=this.freeBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else if((e.usage&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM){let r=this.freeUniformBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else e.destroy()}this.buffersPending=[]}else{let e=this.capturedPendingBuffers.get(this.backend.currentSessionId);e||(e=[],this.capturedPendingBuffers.set(this.backend.currentSessionId,e));for(let t of this.buffersPending)e.push(t);this.buffersPending=[]}}dispose(){this.freeBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.freeUniformBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache.forEach(e=>{e.gpuData.buffer.destroy()}),this.capturedPendingBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.capturedPendingBuffers=new Map}onCreateSession(){this.sessionCount+=1}onReleaseSession(e){let t=this.capturedPendingBuffers.get(e);t&&(t.forEach(r=>{r.destroy()}),this.capturedPendingBuffers.delete(e)),this.sessionCount-=1,this.sessionCount===0&&(me("warning",()=>"[WebGPU] Clearing webgpu buffer cache"),this.storageCache.forEach(r=>{r.gpuData.buffer.destroy()}),this.storageCache=new Map)}},Jp=(...e)=>new Lo(...e)}),Uo,be,Ee=W(()=>{Uo=class{constructor(e){Object.assign(this,e)}get cacheKey(){return this.key||(this.key=Object.getOwnPropertyNames(this).sort().map(e=>`${this[e]}`).join(";")),this.key}},be=e=>new Uo(e)}),Zt,Lr,Oe,Pe,te,Ie,tn,Ft,Tt,J,nr,P,Y,ec,On,qo,tc,oe=W(()=>{ne(),se(),Zt=64,Lr=(e,t)=>{if(t===3)throw new Error("vec3 has same alignment as vec4, use vec4 instead");switch(Number(e)){case 10:return t>1?`vec${t}<f16>`:"f16";case 1:return t>1?`vec${t}<f32>`:"f32";case 6:return t>1?`vec${t}<i32>`:"i32";case 12:return t>1?`vec${t}<u32>`:"u32";case 7:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","i32"];case 13:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","u32"];case 9:if(t!==4)throw new Error("bool must be vec4");return["u32","vec4<bool>"];case 22:return"i32";case 21:return"u32";default:throw new Error(`Unknown data type: ${e}`)}},Oe=(e,t=1)=>{let r=Lr(e,t);return typeof r=="string"?r:r[0]},Pe=(e,t=1)=>{let r=Lr(e,t);return typeof r=="string"?r:r[1]},te=(...e)=>{let t=[];return e.forEach(r=>{r.length!==0&&t.push({type:12,data:r},{type:12,data:R.computeStrides(r)})}),t},Ie=e=>e%4===0?4:e%2===0?2:1,tn=(e="f32",t,r="0")=>!t||t===1?`${e}(${r})`:`vec${t}<${e}>(${r})`,Ft=(e,t,r)=>e==="f32"?r:t===1?`f32(${r})`:`vec${t}<f32>(${r})`,Tt=(e,t)=>t===4?`(${e}.x + ${e}.y + ${e}.z + ${e}.w)`:t===2?`(${e}.x + ${e}.y)`:t===3?`(${e}.x + ${e}.y + ${e}.z)`:e,J=(e,t,r,a)=>e.startsWith("uniforms.")&&r>4?typeof t=="string"?a==="f16"?`${e}[(${t}) / 8][(${t}) % 8 / 4][(${t}) % 8 % 4]`:`${e}[(${t}) / 4][(${t}) % 4]`:a==="f16"?`${e}[${Math.floor(t/8)}][${Math.floor(t%8/4)}][${t%8%4}]`:`${e}[${Math.floor(t/4)}][${t%4}]`:r>1?`${e}[${t}]`:e,nr=(e,t,r,a,n)=>{let i=typeof r=="number",s=i?r:r.length,u=[...new Array(s).keys()],d=s<2?"u32":s<=4?`vec${s}<u32>`:`array<u32, ${s}>`,l=Lr(t,n),c=typeof l=="string"?l:l[1],f=typeof l=="string"?l:l[0],h={indices:d,value:c,storage:f,tensor:t},g=E=>typeof E=="string"?E:`${E}u`,y={offsetToIndices:!1,indicesToOffset:!1,broadcastedIndicesToOffset:!1,set:!1,setByIndices:!1,get:!1,getByIndices:!1},b=i?"uniforms.":"",x=`${b}${e}_shape`,v=`${b}${e}_strides`,w="";for(let E=0;E<s-1;E++)w+=`
    let dim${E} = current / ${J(v,E,s)};
    let rest${E} = current % ${J(v,E,s)};
    indices[${E}] = dim${E};
    current = rest${E};
    `;w+=`indices[${s-1}] = current;`;let k=s<2?"":`
  fn o2i_${e}(offset: u32) -> ${h.indices} {
    var indices: ${h.indices};
    var current = offset;
    ${w}
    return indices;
  }`,S=E=>(y.offsetToIndices=!0,s<2?E:`o2i_${e}(${E})`),I=[];if(s>=2)for(let E=s-1;E>=0;E--)I.push(`${J(v,E,s)} * (indices[${E}])`);let C=s<2?"":`
  fn i2o_${e}(indices: ${h.indices}) -> u32 {
    return ${I.join("+")};
  }`,z=E=>(y.indicesToOffset=!0,s<2?E:`i2o_${e}(${E})`),A=(...E)=>s===0?"0u":`${h.indices}(${E.map(g).join(",")})`,O=(E,B)=>s<2?`${E}`:`${J(E,B,s)}`,G=(E,B,L)=>s<2?`${E}=${L};`:`${J(E,B,s)}=${L};`,X={},K=(E,B)=>{y.broadcastedIndicesToOffset=!0;let L=`${B.name}broadcastedIndicesTo${e}Offset`;if(L in X)return`${L}(${E})`;let Q=[];for(let ge=s-1;ge>=0;ge--){let U=B.indicesGet("outputIndices",ge+B.rank-s);Q.push(`${O(v,ge)} * (${U} % ${O(x,ge)})`)}return X[L]=`fn ${L}(outputIndices: ${B.type.indices}) -> u32 {
             return ${Q.length>0?Q.join("+"):"0u"};
           }`,`${L}(${E})`},F=(E,B)=>(()=>{if(h.storage===h.value)return`${e}[${E}]=${B};`;if(h.storage==="vec2<u32>"&&h.value==="i32")return`${e}[${E}]=vec2<u32>(u32(${B}), select(0u, 0xFFFFFFFFu, ${B} < 0));`;if(h.storage==="vec2<u32>"&&h.value==="u32")return`${e}[${E}]=vec2<u32>(u32(${B}), 0u);`;if(h.storage==="u32"&&h.value==="vec4<bool>")return`${e}[${E}]=dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(${B}));`;throw new Error(`not supported combination of storage type ${h.storage} and value type ${h.value} yet`)})(),Z=E=>(()=>{if(h.storage===h.value)return`${e}[${E}]`;if(h.storage==="vec2<u32>"&&h.value==="i32")return`i32(${e}[${E}].x)`;if(h.storage==="vec2<u32>"&&h.value==="u32")return`u32(${e}[${E}].x)`;if(h.storage==="u32"&&h.value==="vec4<bool>")return`vec4<bool>(bool(${e}[${E}] & 0xFFu), bool(${e}[${E}] & 0xFF00u), bool(${e}[${E}] & 0xFF0000u), bool(${e}[${E}] & 0xFF000000u))`;throw new Error(`not supported combination of storage type ${h.storage} and value type ${h.value} yet`)})(),ie=s<2?"":`
  fn get_${e}ByIndices(indices: ${h.indices}) -> ${c} {
    return ${Z(`i2o_${e}(indices)`)};
  }`,H=s<2?"":(()=>{let E=u.map(L=>`d${L}: u32`).join(", "),B=u.map(L=>`d${L}`).join(", ");return`
  fn get_${e}(${E}) -> ${c} {
    return get_${e}ByIndices(${A(B)});
  }`})(),j=(...E)=>{if(E.length!==s)throw new Error(`indices length must be ${s}`);let B=E.map(g).join(",");return s===0?Z("0u"):s===1?Z(B[0]):(y.get=!0,y.getByIndices=!0,y.indicesToOffset=!0,`get_${e}(${B})`)},he=E=>s<2?Z(E):(y.getByIndices=!0,y.indicesToOffset=!0,`get_${e}ByIndices(${E})`),N=s<2?"":`
  fn set_${e}ByIndices(indices: ${h.indices}, value: ${c}) {
    ${F(`i2o_${e}(indices)`,"value")}
  }`,M=s<2?"":(()=>{let E=u.map(L=>`d${L}: u32`).join(", "),B=u.map(L=>`d${L}`).join(", ");return`
  fn set_${e}(${E}, value: ${c}) {
    set_${e}ByIndices(${A(B)}, value);
  }`})();return{impl:()=>{let E=[],B=!1;return y.offsetToIndices&&(E.push(k),B=!0),y.indicesToOffset&&(E.push(C),B=!0),y.broadcastedIndicesToOffset&&(Object.values(X).forEach(L=>E.push(L)),B=!0),y.set&&(E.push(M),B=!0),y.setByIndices&&(E.push(N),B=!0),y.get&&(E.push(H),B=!0),y.getByIndices&&(E.push(ie),B=!0),!i&&B&&E.unshift(`const ${x} = ${h.indices}(${r.join(",")});`,`const ${v} = ${h.indices}(${R.computeStrides(r).join(",")});`),E.join(`
`)},type:h,offsetToIndices:S,indicesToOffset:z,broadcastedIndicesToOffset:K,indices:A,indicesGet:O,indicesSet:G,set:(...E)=>{if(E.length!==s+1)throw new Error(`indices length must be ${s}`);let B=E[s];if(typeof B!="string")throw new Error("value must be string");let L=E.slice(0,s).map(g).join(",");return s===0?F("0u",B):s===1?F(L[0],B):(y.set=!0,y.setByIndices=!0,y.indicesToOffset=!0,`set_${e}(${L}, ${B})`)},setByOffset:F,setByIndices:(E,B)=>s<2?F(E,B):(y.setByIndices=!0,y.indicesToOffset=!0,`set_${e}ByIndices(${E}, ${B});`),get:j,getByOffset:Z,getByIndices:he,usage:a,name:e,strides:v,shape:x,rank:s}},P=(e,t,r,a=1)=>nr(e,t,r,"input",a),Y=(e,t,r,a=1)=>nr(e,t,r,"output",a),ec=(e,t,r)=>nr(e,t,r,"atomicOutput",1),On=(e,t,r,a=1)=>nr(e,t,r,"internal",a),qo=class{constructor(e,t){this.normalizedDispatchGroup=e,this.limits=t,this.internalVariables=[],this.variables=[],this.uniforms=[],this.variableIndex=0}guardAgainstOutOfBoundsWorkgroupSizes(e){return`if (global_idx >= ${typeof e=="number"?`${e}u`:e}) { return; }`}mainStart(e=Zt){let t=typeof e=="number"?e:e[0],r=typeof e=="number"?1:e[1],a=typeof e=="number"?1:e[2];if(t>this.limits.maxComputeWorkgroupSizeX||r>this.limits.maxComputeWorkgroupSizeY||a>this.limits.maxComputeWorkgroupSizeZ)throw new Error(`workgroup size [${t}, ${r}, ${a}] exceeds the maximum workgroup size [${this.limits.maxComputeWorkgroupSizeX}, ${this.limits.maxComputeWorkgroupSizeY}, ${this.limits.maxComputeWorkgroupSizeZ}].`);if(t*r*a>this.limits.maxComputeInvocationsPerWorkgroup)throw new Error(`workgroup size [${t}, ${r}, ${a}] exceeds the maximum workgroup invocations ${this.limits.maxComputeInvocationsPerWorkgroup}.`);let n=this.normalizedDispatchGroup[1]===1&&this.normalizedDispatchGroup[2]===1,i=n?`@builtin(global_invocation_id) global_id : vec3<u32>,
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
`)}get variablesInfo(){if(this.uniforms.length===0)return;let e=t=>[12,10,1,6][["u32","f16","f32","i32"].indexOf(t)];return this.uniforms.map(t=>[e(t.type),t.length??1])}},tc=(e,t)=>new qo(e,t)}),Wo,Fi,Go,jo,Vo,Ho,Ve,rc,ic,Et=W(()=>{ne(),se(),Ee(),oe(),Wo=(e,t)=>{if(!e||e.length!==1)throw new Error("Transpose requires 1 input.");if(t.length!==0&&t.length!==e[0].dims.length)throw new Error(`perm size ${t.length} does not match input rank ${e[0].dims.length}`)},Fi=(e,t)=>t.length!==0?t:[...new Array(e).keys()].reverse(),Go=(e,t)=>R.sortBasedOnPerm(e,Fi(e.length,t)),jo=(e,t,r,a)=>{let n=`fn perm(i: ${a.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`;for(let i=0;i<t;++i)n+=`a[${e[i]}]=i[${i}];`;return n+="return a;}"},Vo=(e,t)=>{let r=[],a=[];for(let n=0;n<e.length;++n)e[n]!==1&&r.push(e[n]),e[t[n]]!==1&&a.push(t[n]);return{newShape:r,newPerm:a}},Ho=(e,t)=>{let r=0;for(let a=0;a<e.length;++a)if(t[e[a]]!==1){if(e[a]<r)return!1;r=e[a]}return!0},Ve=(e,t)=>{let r=e.dataType,a=e.dims.length,n=Fi(a,t),i=Go(e.dims,n),s=e.dims,u=i,d=a<2||Ho(n,e.dims),l;if(d)return l=y=>{let b=P("input",r,s,4),x=Y("output",r,u,4);return`
  ${y.registerUniform("output_size","u32").declareVariables(b,x)}
  ${y.mainStart()}
    ${y.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    output[global_idx] = input[global_idx];
  }`},{name:"TransposeCopy",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let y=R.size(i);return{outputs:[{dims:i,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(y/64/4)},programUniforms:[{type:12,data:Math.ceil(y/4)}]}},getShaderSource:l};let{newShape:c,newPerm:f}=Vo(e.dims,n),h=R.areEqual(f,[2,3,1]),g=R.areEqual(f,[3,1,2]);if(c.length===2||h||g){s=h?[c[0],c[1]*c[2]]:g?[c[0]*c[1],c[2]]:c,u=[s[1],s[0]];let y=16;return l=b=>{let x=P("a",r,s.length),v=Y("output",r,u.length);return`
  ${b.registerUniform("output_size","u32").declareVariables(x,v)}
  var<workgroup> tile : array<array<${v.type.value}, ${y+1}>, ${y}>;
  ${b.mainStart([y,y,1])}
    let stride = (uniforms.output_shape[1] - 1) / ${y} + 1;
    let workgroup_id_x = workgroup_index % stride;
    let workgroup_id_y = workgroup_index / stride;
    let input_col = workgroup_id_y * ${y}u + local_id.x;
    let input_row = workgroup_id_x * ${y}u + local_id.y;
    if (input_row < uniforms.a_shape[0] && input_col < uniforms.a_shape[1]) {
      tile[local_id.y][local_id.x] = ${x.getByIndices(`${x.type.indices}(input_row, input_col)`)};
    }
    workgroupBarrier();

    let output_col = workgroup_id_x * ${y}u + local_id.x;
    let output_row = workgroup_id_y * ${y}u + local_id.y;
    if (output_row < uniforms.output_shape[0] && output_col < uniforms.output_shape[1]) {
      ${v.setByIndices(`${v.type.indices}(output_row, output_col)`,"tile[local_id.x][local_id.y]")}
    }
  }`},{name:"TransposeShared",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let b=R.size(i);return{outputs:[{dims:i,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(u[1]/y),y:Math.ceil(u[0]/y)},programUniforms:[{type:12,data:b},...te(s,u)]}},getShaderSource:l}}return l=y=>{let b=P("a",r,s.length),x=Y("output",r,u.length);return`
  ${y.registerUniform("output_size","u32").declareVariables(b,x)}

  ${jo(n,a,b,x)}

  ${y.mainStart()}
    ${y.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${x.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${x.setByOffset("global_idx",b.getByIndices("aIndices"))}
  }`},{name:"Transpose",shaderCache:{hint:`${t}`,inputDependencies:["rank"]},getRunData:()=>{let y=R.size(i);return{outputs:[{dims:i,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(y/64)},programUniforms:[{type:12,data:y},...te(s,u)]}},getShaderSource:l}},rc=(e,t)=>{Wo(e.inputs,t.perm),e.compute(Ve(e.inputs[0],t.perm))},ic=e=>be({perm:e.perm})}),Fo,Ko,Zo,Qo,Xo,Yo,Jo,eu,tu,ru,Qe,ac,nc,sc,oc,uc,lc,dc,pc,cc,fc,ny=W(()=>{ne(),se(),oe(),Rn(),Et(),Fo={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate * candidate",logSumExp:"bestValue + exp(candidate)",l1:"bestValue + abs(candidate)",l2:"bestValue + candidate * candidate",logSum:"bestValue + candidate"},Ko={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate",logSumExp:"bestValue + candidate",l1:"bestValue + candidate",l2:"bestValue + candidate",logSum:"bestValue + candidate"},Zo={max:"_A[offset]",min:"_A[offset]",mean:"0",sum:"0",prod:"1",sumSquare:"0",logSumExp:"0",l1:"0",l2:"0",logSum:"0"},Qo={max:"bestValue",min:"bestValue",sum:"bestValue",prod:"bestValue",sumSquare:"bestValue",logSumExp:"log(bestValue)",l1:"bestValue",l2:"sqrt(bestValue)",logSum:"log(bestValue)"},Xo=(e,t)=>{let r=[];for(let a=t-e;a<t;++a)r.push(a);return r},Yo=(e,t)=>{let r=[],a=e.length;for(let i=0;i<a;i++)t.indexOf(i)===-1&&r.push(e[i]);let n=t.map(i=>e[i]);return[r,n]},Jo=(e,t)=>{let r=e.length+t.length,a=[],n=0;for(let i=0;i<r;i++)t.indexOf(i)===-1?a.push(e[n++]):a.push(1);return a},eu=(e,t)=>{for(let r=0;r<e.length;++r)if(e[e.length-r-1]!==t-1-r)return!1;return!0},tu=(e,t)=>{let r=[];if(!eu(e,t)){for(let a=0;a<t;++a)e.indexOf(a)===-1&&r.push(a);e.forEach(a=>r.push(a))}return r},ru=(e,t,r,a,n,i,s)=>{let u=r[0].dims,d=R.size(i),l=R.size(s),c=P("_A",r[0].dataType,u),f=Y("output",n,i),h=64;d===1&&(h=256);let g=`
          var<workgroup> aBestValues : array<f32, ${h}>;
       `,y=b=>`
        ${b.registerUniform("reduceSize","u32").declareVariables(c,f)}
        ${g}
        fn DIV_CEIL(a : u32, b : u32) -> u32 {
          return ((a - 1u) / b + 1u);
         }
         ${b.mainStart(h)}

          let outputIndex = global_idx / ${h};
          let offset = outputIndex * uniforms.reduceSize;

          var bestValue = f32(${Zo[a]});
          let Length = uniforms.reduceSize;
          for (var k = local_idx; k < Length; k = k + ${h}) {
           let candidate = f32(${c.getByOffset("offset + k")});
           bestValue = ${Fo[a]};
          }
          aBestValues[local_idx] = bestValue;
          workgroupBarrier();

         var reduceSize = min(Length, ${h}u);
         for (var currentSize = reduceSize / 2u; reduceSize > 1u;
             currentSize = reduceSize / 2u) {
           let interval = DIV_CEIL(reduceSize, 2u);
           if (local_idx < currentSize) {
            let candidate = aBestValues[local_idx + interval];
            bestValue = ${Ko[a]};
            aBestValues[local_idx] = bestValue;
           }
           reduceSize = interval;
           workgroupBarrier();
         }

         if (local_idx == 0u) {
          ${f.setByOffset("outputIndex",`${a==="mean"?`${f.type.storage}(bestValue / f32(uniforms.reduceSize))`:`${f.type.storage}(${Qo[a]})`}`)};
         }
        }`;return{name:e,shaderCache:{hint:`${t};${h}`,inputDependencies:["type"]},getShaderSource:y,getRunData:()=>({outputs:[{dims:i,dataType:n}],dispatchGroup:{x:d},programUniforms:[{type:12,data:l}]})}},Qe=(e,t,r,a)=>{let n=e.inputs.length===1?r:rn(e.inputs,r),i=n.axes;i.length===0&&!n.noopWithEmptyAxes&&(i=e.inputs[0].dims.map((g,y)=>y));let s=R.normalizeAxes(i,e.inputs[0].dims.length),u=s,d=e.inputs[0],l=tu(u,e.inputs[0].dims.length);l.length>0&&(d=e.compute(Ve(e.inputs[0],l),{inputs:[0],outputs:[-1]})[0],u=Xo(u.length,d.dims.length));let[c,f]=Yo(d.dims,u),h=c;n.keepDims&&(h=Jo(c,s)),e.compute(ru(t,n.cacheKey,[d],a,e.inputs[0].dataType,h,f),{inputs:[d]})},ac=(e,t)=>{Qe(e,"ReduceMeanShared",t,"mean")},nc=(e,t)=>{Qe(e,"ReduceL1Shared",t,"l1")},sc=(e,t)=>{Qe(e,"ReduceL2Shared",t,"l2")},oc=(e,t)=>{Qe(e,"ReduceLogSumExpShared",t,"logSumExp")},uc=(e,t)=>{Qe(e,"ReduceMaxShared",t,"max")},lc=(e,t)=>{Qe(e,"ReduceMinShared",t,"min")},dc=(e,t)=>{Qe(e,"ReduceProdShared",t,"prod")},pc=(e,t)=>{Qe(e,"ReduceSumShared",t,"sum")},cc=(e,t)=>{Qe(e,"ReduceSumSquareShared",t,"sumSquare")},fc=(e,t)=>{Qe(e,"ReduceLogSumShared",t,"logSum")}}),Xe,iu,Jr,rn,Ye,au,nu,su,ou,uu,lu,du,pu,cu,fu,Je,hc,mc,gc,yc,_c,bc,wc,vc,$c,xc,Rn=W(()=>{ne(),se(),Ee(),oe(),ny(),Xe=e=>{if(!e||e.length===0||e.length>2)throw new Error("Reduce op requires 1 or 2 inputs.");if(e.length===2&&e[1].dims.length!==1)throw new Error("Invalid axes input dims.")},iu=e=>["","",`var value = ${e.getByIndices("input_indices")};`,""],Jr=(e,t,r,a,n,i,s=!1,u=!1)=>{let d=[],l=r[0].dims,c=l.length,f=R.normalizeAxes(n,c),h=!u&&f.length===0;l.forEach((b,x)=>{h||f.indexOf(x)>=0?s&&d.push(1):d.push(b)});let g=d.length,y=R.size(d);return{name:e,shaderCache:t,getShaderSource:b=>{let x=[],v=P("_A",r[0].dataType,c),w=Y("output",i,g),k=a(v,w,f),S=k[2];for(let I=0,C=0;I<c;I++)h||f.indexOf(I)>=0?(s&&C++,S=`for(var j${I}: u32 = 0; j${I} < ${l[I]}; j${I}++) {
                  ${k[2].includes("last_index")?`let last_index = j${I};`:""}
                  ${v.indicesSet("input_indices",I,`j${I}`)}
                  ${S}
                }`):(x.push(`${v.indicesSet("input_indices",I,w.indicesGet("output_indices",C))};`),C++);return`

        ${b.registerUniform("output_size","u32").declareVariables(v,w)}

        ${b.mainStart()}
          ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          var input_indices: ${v.type.indices};
          let output_indices = ${w.offsetToIndices("global_idx")};

          ${x.join(`
`)}
          ${k[0]}       // init ops for reduce max/min
          ${k[1]}
          ${S}
          ${k[3]}
          ${k.length===4?w.setByOffset("global_idx","value"):k.slice(4).join(`
`)}
        }`},getRunData:()=>({outputs:[{dims:d,dataType:i}],dispatchGroup:{x:Math.ceil(y/64)},programUniforms:[{type:12,data:y},...te(l,d)]})}},rn=(e,t)=>{let r=[];return e[1].dims[0]>0&&e[1].getBigInt64Array().forEach(a=>r.push(Number(a))),be({axes:r,keepDims:t.keepDims,noopWithEmptyAxes:t.noopWithEmptyAxes})},Ye=(e,t,r,a)=>{let n=e.inputs,i=n.length===1?r:rn(n,r);e.compute(Jr(t,{hint:i.cacheKey,inputDependencies:["rank"]},[n[0]],i.noopWithEmptyAxes&&i.axes.length===0?iu:a,i.axes,n[0].dataType,i.keepDims,i.noopWithEmptyAxes),{inputs:[0]})},au=(e,t)=>{Xe(e.inputs),Ye(e,"ReduceLogSum",t,(r,a)=>[`var value = ${a.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,"value = log(value);"])},nu=(e,t)=>{Xe(e.inputs),Ye(e,"ReduceL1",t,(r,a)=>[`var value = ${a.type.storage}(0);`,"",`value += abs(${r.getByIndices("input_indices")});`,""])},su=(e,t)=>{Xe(e.inputs),Ye(e,"ReduceL2",t,(r,a)=>[`var t = ${a.type.value}(0); var value = ${a.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += (t * t);`,"value = sqrt(value);"])},ou=(e,t)=>{Xe(e.inputs),Ye(e,"ReduceLogSumExp",t,(r,a)=>[`var value = ${a.type.storage}(0);`,"",`value += exp(${r.getByIndices("input_indices")});`,"value = log(value);"])},uu=(e,t)=>{Xe(e.inputs),Ye(e,"ReduceMax",t,(r,a,n)=>{let i=[];for(let s=0;s<r.rank;s++)(n.indexOf(s)>=0||n.length===0)&&i.push(r.indicesSet("input_indices",s,0));return[`${i.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = max(value, ${r.getByIndices("input_indices")});`,""]})},lu=(e,t)=>{Xe(e.inputs),Ye(e,"ReduceMean",t,(r,a,n)=>{let i=1;for(let s=0;s<r.rank;s++)(n.indexOf(s)>=0||n.length===0)&&(i*=e.inputs[0].dims[s]);return["var sum = f32(0);","",`sum += f32(${r.getByIndices("input_indices")});`,`let value = ${a.type.value}(sum / ${i});`]})},du=(e,t)=>{Xe(e.inputs),Ye(e,"ReduceMin",t,(r,a,n)=>{let i=[];for(let s=0;s<r.rank;s++)(n.indexOf(s)>=0||n.length===0)&&i.push(`input_indices[${s}] = 0;`);return[`${i.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = min(value, ${r.getByIndices("input_indices")});`,""]})},pu=(e,t)=>{Xe(e.inputs),Ye(e,"ReduceProd",t,(r,a)=>[`var value = ${a.type.storage}(1);`,"",`value *= ${r.getByIndices("input_indices")};`,""])},cu=(e,t)=>{Xe(e.inputs),Ye(e,"ReduceSum",t,(r,a)=>[`var value = ${a.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,""])},fu=(e,t)=>{Xe(e.inputs),Ye(e,"ReduceSumSquare",t,(r,a)=>[`var t = ${a.type.value}(0); var value = ${a.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += t * t;`,""])},Je=(e,t,r)=>{if(t.length===0)return r;let a=1,n=1;for(let i=0;i<t.length;i++)t.indexOf(i)===-1?a*=e[i]:n*=e[i];return n<32&&a>1024},hc=(e,t)=>{Je(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?lu(e,t):ac(e,t)},mc=(e,t)=>{Je(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?nu(e,t):nc(e,t)},gc=(e,t)=>{Je(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?su(e,t):sc(e,t)},yc=(e,t)=>{Je(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?ou(e,t):oc(e,t)},_c=(e,t)=>{Je(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?uu(e,t):uc(e,t)},bc=(e,t)=>{Je(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?du(e,t):lc(e,t)},wc=(e,t)=>{Je(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?pu(e,t):dc(e,t)},vc=(e,t)=>{Je(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?cu(e,t):pc(e,t)},$c=(e,t)=>{Je(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?fu(e,t):cc(e,t)},xc=(e,t)=>{Je(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?au(e,t):fc(e,t)}}),Ki,Sc,kc,an,sy=W(()=>{ne(),Ee(),Rn(),Ki=e=>{if(!e||e.length===0||e.length>2)throw new Error("ArgMinMaxOp op requires 1 or 2 inputs.");if(e[0].dataType!==1)throw new Error("Invalid input type.")},Sc=(e,t)=>{Ki(e.inputs);let r=(a,n,i)=>{let s=[];for(let u=0;u<a.rank;u++)(i.indexOf(u)>=0||i.length===0)&&s.push(`input_indices[${u}] = 0;`);return[`${s.join(`
`)}`,`var value = ${a.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${a.getByIndices("input_indices")} ${t.selectLastIndex>0?"<=":"<"} value) {
         value = ${a.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",n.setByOffset("global_idx","best_index")]};e.compute(Jr("ArgMin",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},kc=(e,t)=>{Ki(e.inputs);let r=(a,n,i)=>{let s=[];for(let u=0;u<a.rank;u++)(i.indexOf(u)>=0||i.length===0)&&s.push(`input_indices[${u}] = 0;`);return[`${s.join(`
`)}`,`var value = ${a.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${a.getByIndices("input_indices")} ${t.selectLastIndex>0?">=":">"} value) {
         value = ${a.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",n.setByOffset("global_idx","best_index")]};e.compute(Jr("argMax",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},an=e=>be(e)}),hu,Ur,mu,gu,yu,br,_u,Ic,Mn=W(()=>{ne(),se(),An(),oe(),hu=(e,t)=>{let r=e[0],a=e[1],n=e[2],i=e[3],s=e[4],u=e[5];if(s&&u)throw new Error("Attention cannot have both past and attention_bias");if(r.dims.length!==3)throw new Error('Input "input" must have 3 dimensions');let d=r.dims[0],l=r.dims[1],c=r.dims[2];if(n.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimensions');if(a.dims.length!==2)throw new Error('Input "weights" is expected to have 2 dimensions');if(a.dims[0]!==c)throw new Error("Input 1 dimension 0 should have same length as dimension 2 of input 0");if(n.dims[0]!==a.dims[1])throw new Error('Input "bias" dimension 0 should have same length as dimension 1 of input "weights"');let f=n.dims[0]/3,h=f,g=h;if(t.qkvHiddenSizes.length>0){if(t.qkvHiddenSizes.length!==3)throw new Error("qkv_hidden_sizes attribute should have 3 elements");for(let k of t.qkvHiddenSizes)if(k%t.numHeads!==0)throw new Error("qkv_hidden_sizes should be divisible by num_heads");f=t.qkvHiddenSizes[0],h=t.qkvHiddenSizes[1],g=t.qkvHiddenSizes[2]}let y=l;if(f!==h)throw new Error("qkv_hidden_sizes first element should be same as the second");if(n.dims[0]!==f+h+g)throw new Error('Input "bias" dimension 0 should have same length as sum of Q/K/V hidden sizes');let b=0;if(s){if(h!==g)throw new Error('Input "past" expect k_hidden_size == v_hidden_size');if(s.dims.length!==5)throw new Error('Input "past" must have 5 dimensions');if(s.dims[0]!==2)throw new Error('Input "past" first dimension must be 2');if(s.dims[1]!==d)throw new Error('Input "past" second dimension must be batch_size');if(s.dims[2]!==t.numHeads)throw new Error('Input "past" third dimension must be num_heads');if(s.dims[4]!==h/t.numHeads)throw new Error('Input "past" fifth dimension must be k_hidden_size / num_heads');t.pastPresentShareBuffer||(b=s.dims[3])}let x=y+b,v=-1,w=0;if(i)throw new Error("Mask not supported");if(s)throw new Error("past is not supported");if(u){if(u.dims.length!==4)throw new Error('Input "attention_bias" must have 4 dimensions');if(u.dims[0]!==d||u.dims[1]!==t.numHeads||u.dims[2]!==l||u.dims[3]!==x)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:d,sequenceLength:l,pastSequenceLength:b,kvSequenceLength:y,totalSequenceLength:x,maxSequenceLength:v,inputHiddenSize:c,hiddenSize:f,vHiddenSize:g,headSize:Math.floor(f/t.numHeads),vHeadSize:Math.floor(g/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:w,scale:t.scale,broadcastResPosBias:!1,passPastInKv:!1,qkvFormat:1}},Ur=(e,t,r)=>t&&e?`
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
    `,mu=(e,t,r,a,n,i,s,u)=>{let d=Ie(s?1:i),l=64,c=i/d;c<l&&(l=32);let f=Math.ceil(i/d/l),h=[{type:12,data:t},{type:12,data:r},{type:12,data:a},{type:12,data:n},{type:12,data:c},{type:12,data:f}],g=Oe(e.dataType,d),y=Pe(1,d),b=["type"];s&&b.push("type"),u&&b.push("type");let x=v=>{let w=Y("x",e.dataType,e.dims,d),k=[w],S=s?P("seq_lens",s.dataType,s.dims):void 0;S&&k.push(S);let I=u?P("total_sequence_length_input",u.dataType,u.dims):void 0;I&&k.push(I);let C=Pe(e.dataType),z=[{name:"batch_size",type:"u32"},{name:"num_heads",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"sequence_length",type:"u32"},{name:"total_sequence_length",type:"u32"},{name:"elements_per_thread",type:"u32"}];return`
  var<workgroup> thread_max: array<f32, ${l}>;
  var<workgroup> thread_sum: array<f32, ${l}>;
  ${v.registerUniforms(z).declareVariables(...k)}
  ${v.mainStart([l,1,1])}
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let sequence_length = uniforms.sequence_length;
    var total_sequence_length = uniforms.total_sequence_length;
    ${Ur(S,I,!1)}
    let local_offset = local_idx * uniforms.elements_per_thread;
    let offset = (global_idx / ${l}) * uniforms.total_sequence_length + local_offset;
    let seq_causal_length = ${s?"u32(past_sequence_length + workgroup_id.y + 1)":"total_sequence_length"};
    var thread_max_vector = ${y}(-3.402823e+38f);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      thread_max_vector = max(${y}(x[offset + i]), thread_max_vector);
    }
    thread_max[local_idx] = ${(()=>{switch(d){case 1:return"thread_max_vector";case 2:return"max(thread_max_vector.x, thread_max_vector.y)";case 4:return"max(max(thread_max_vector.x, thread_max_vector.y), max(thread_max_vector.z, thread_max_vector.w))";default:throw new Error(`Unsupported components: ${d}`)}})()};
    workgroupBarrier();

    var max_value =  f32(-3.402823e+38f);
    for (var i = 0u; i < ${l}; i++) {
      max_value = max(thread_max[i], max_value);
    }

    var sum_vector = ${y}(0);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      sum_vector += exp(${y}(x[offset + i]) - max_value);
    }
    thread_sum[local_idx] = ${(()=>{switch(d){case 1:return"sum_vector";case 2:return"sum_vector.x + sum_vector.y";case 4:return"sum_vector.x + sum_vector.y + sum_vector.z + sum_vector.w";default:throw new Error(`Unsupported components: ${d}`)}})()};
    workgroupBarrier();

    var sum: f32 = 0;
    for (var i = 0u; i < ${l}; i++) {
      sum += thread_sum[i];
    }

    if (sum == 0) {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        x[offset + i] = ${w.type.value}(${C}(1.0) / ${C}(seq_causal_length));
      }
    } else {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        var f32input = ${y}(x[offset + i]);
        x[offset + i] = ${w.type.value}(exp(f32input - max_value) / sum);
      }
    }
      ${s?`
        for (var total_seq_id: u32 = seq_causal_length; total_seq_id + local_offset < uniforms.total_sequence_length; total_seq_id++) {
          x[offset + total_seq_id] = ${w.type.value}(${C}(0));
        }`:""};
  }`};return{name:"AttentionProbsSoftmax",shaderCache:{hint:`${l};${g};${d}`,inputDependencies:b},getShaderSource:x,getRunData:()=>({outputs:[],dispatchGroup:{x:1,y:n,z:t*r},programUniforms:h})}},gu=(e,t,r,a,n,i,s,u,d)=>{let l=s+i.kvSequenceLength,c=[i.batchSize,i.numHeads,i.sequenceLength,l],f=e>1&&a,h=i.kvNumHeads?i.kvNumHeads:i.numHeads,g=f?[i.batchSize,h,l,i.headSize]:void 0,y=i.nReps?i.nReps:1,b=i.scale===0?1/Math.sqrt(i.headSize):i.scale,x=Ie(i.headSize),v=i.headSize/x,w=12,k={x:Math.ceil(l/w),y:Math.ceil(i.sequenceLength/w),z:i.batchSize*i.numHeads},S=[{type:12,data:i.sequenceLength},{type:12,data:v},{type:12,data:l},{type:12,data:i.numHeads},{type:12,data:i.headSize},{type:1,data:b},{type:12,data:s},{type:12,data:i.kvSequenceLength},{type:12,data:y}],I=f&&a&&R.size(a.dims)>0,C=["type","type"];I&&C.push("type"),n&&C.push("type"),u&&C.push("type"),d&&C.push("type");let z=[{dims:c,dataType:t.dataType,gpuDataType:0}];f&&z.push({dims:g,dataType:t.dataType,gpuDataType:0});let A=O=>{let G=P("q",t.dataType,t.dims,x),X=P("key",r.dataType,r.dims,x),K=[G,X];if(I){let N=P("past_key",a.dataType,a.dims,x);K.push(N)}n&&K.push(P("attention_bias",n.dataType,n.dims));let F=u?P("seq_lens",u.dataType,u.dims):void 0;F&&K.push(F);let Z=d?P("total_sequence_length_input",d.dataType,d.dims):void 0;Z&&K.push(Z);let ie=Y("output",t.dataType,c),H=[ie];f&&H.push(Y("present_key",t.dataType,g,x));let j=Pe(1,x),he=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"alpha",type:"f32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${w}u;

  var<workgroup> tileQ: array<${G.type.storage}, ${w*w}>;
  var<workgroup> tileK: array<${G.type.storage}, ${w*w}>;
  ${O.registerUniforms(he).declareVariables(...K,...H)}
  ${O.mainStart([w,w,1])}
    // x holds the N and y holds the M
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let kvHeadIdx = ${y===1?"headIdx":"headIdx / uniforms.n_reps"};
    let kv_num_heads = ${y===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let m = workgroup_id.y * TILE_SIZE;
    let n = workgroup_id.x * TILE_SIZE;
    let sequence_length = uniforms.M;
    var total_sequence_length = uniforms.N;
    ${Ur(F,Z,!0)}
    let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx;
    let qOffset = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
    ${I&&f?"let pastKeyOffset = absKvHeadIdx * uniforms.past_sequence_length * uniforms.K;":""};
    let kOffset = absKvHeadIdx * uniforms.kv_sequence_length * uniforms.K;
    ${f?"let presentKeyOffset = absKvHeadIdx * uniforms.N * uniforms.K;":""}
    var value = ${j}(0);
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
          value += ${j}(tileQ[TILE_SIZE * local_id.y + k] * tileK[TILE_SIZE * local_id.x + k]);
      }

      workgroupBarrier();
    }

    if (global_id.y < uniforms.M && global_id.x < total_sequence_length) {
      let headOffset = workgroup_id.z * uniforms.M * uniforms.N;
      let outputIdx = headOffset + global_id.y * uniforms.N + global_id.x;
      var sum: f32 = ${(()=>{switch(x){case 1:return"value";case 2:return"value.x + value.y";case 4:return"value.x + value.y + value.z + value.w";default:throw new Error(`Unsupported components: ${x}`)}})()};
        output[outputIdx] = ${ie.type.value} (sum * uniforms.alpha) + ${n?"attention_bias[outputIdx]":"0.0"};
    }
  }`};return{name:"AttentionProbs",shaderCache:{hint:`${x};${n!==void 0};${a!==void 0};${e}`,inputDependencies:C},getRunData:()=>({outputs:z,dispatchGroup:k,programUniforms:S}),getShaderSource:A}},yu=(e,t,r,a,n,i,s=void 0,u=void 0)=>{let d=i+n.kvSequenceLength,l=n.nReps?n.nReps:1,c=n.vHiddenSize*l,f=e>1&&a,h=n.kvNumHeads?n.kvNumHeads:n.numHeads,g=f?[n.batchSize,h,d,n.headSize]:void 0,y=[n.batchSize,n.sequenceLength,c],b=12,x={x:Math.ceil(n.vHeadSize/b),y:Math.ceil(n.sequenceLength/b),z:n.batchSize*n.numHeads},v=[{type:12,data:n.sequenceLength},{type:12,data:d},{type:12,data:n.vHeadSize},{type:12,data:n.numHeads},{type:12,data:n.headSize},{type:12,data:c},{type:12,data:i},{type:12,data:n.kvSequenceLength},{type:12,data:l}],w=f&&a&&R.size(a.dims)>0,k=["type","type"];w&&k.push("type"),s&&k.push("type"),u&&k.push("type");let S=[{dims:y,dataType:t.dataType,gpuDataType:0}];f&&S.push({dims:g,dataType:t.dataType,gpuDataType:0});let I=C=>{let z=P("probs",t.dataType,t.dims),A=P("v",r.dataType,r.dims),O=[z,A];w&&O.push(P("past_value",a.dataType,a.dims));let G=s?P("seq_lens",s.dataType,s.dims):void 0;s&&O.push(G);let X=u?P("total_sequence_length_input",u.dataType,u.dims):void 0;u&&O.push(X);let K=[Y("output",t.dataType,y)];f&&K.push(Y("present_value",t.dataType,g));let F=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"v_hidden_size",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${b}u;
  var<workgroup> tileQ: array<${z.type.value}, ${b*b}>;
  var<workgroup> tileV: array<${z.type.value}, ${b*b}>;
  ${C.registerUniforms(F).declareVariables(...O,...K)}
  ${C.mainStart([b,b,1])}
   let headIdx = workgroup_id.z % uniforms.num_heads;
   let batchIdx = workgroup_id.z / uniforms.num_heads;
   let kvHeadIdx = ${l===1?"headIdx":"headIdx / uniforms.n_reps"};
   let kv_num_heads = ${l===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
   let m = global_id.y;
   let n = global_id.x;
   let sequence_length = uniforms.M;
   var total_sequence_length = uniforms.K;
   ${Ur(G,X,!0)}
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
  }`};return{name:"AttentionScore",shaderCache:{hint:`${a!==void 0};${e}`,inputDependencies:k},getRunData:()=>({outputs:S,dispatchGroup:x,programUniforms:v}),getShaderSource:I}},br=(e,t,r,a,n,i,s,u,d,l,c=void 0,f=void 0)=>{let h=Math.min(e.outputCount,1+(s?1:0)+(u?1:0)),g=h>1?l.pastSequenceLength:0,y=g+l.kvSequenceLength,b=d&&R.size(d.dims)>0?d:void 0,x=[t,r];h>1&&s&&R.size(s.dims)>0&&x.push(s),b&&x.push(b),c&&x.push(c),f&&x.push(f);let v=e.compute(gu(h,t,r,s,b,l,g,c,f),{inputs:x,outputs:h>1?[-1,1]:[-1]})[0];e.compute(mu(v,l.batchSize,l.numHeads,g,l.sequenceLength,y,c,f),{inputs:c&&f?[v,c,f]:[v],outputs:[]});let w=[v,a];h>1&&u&&R.size(u.dims)>0&&w.push(u),c&&w.push(c),f&&w.push(f),e.compute(yu(h,v,a,u,l,g,c,f),{inputs:w,outputs:h>1?[0,2]:[0]})},_u=(e,t)=>{let r=[t.batchSize,t.numHeads,t.sequenceLength,t.headSize],a=t.sequenceLength,n=t.inputHiddenSize,i=t.headSize,s=12,u={x:Math.ceil(t.headSize/s),y:Math.ceil(t.sequenceLength/s),z:t.batchSize*t.numHeads},d=[e.inputs[0],e.inputs[1],e.inputs[2]],l=[{type:12,data:a},{type:12,data:n},{type:12,data:i},{type:12,data:t.numHeads},{type:12,data:t.headSize},{type:12,data:t.hiddenSize},{type:12,data:t.hiddenSize+t.hiddenSize+t.vHiddenSize}],c=f=>{let h=Y("output_q",d[0].dataType,r),g=Y("output_k",d[0].dataType,r),y=Y("output_v",d[0].dataType,r),b=P("input",d[0].dataType,d[0].dims),x=P("weight",d[1].dataType,d[1].dims),v=P("bias",d[2].dataType,d[2].dims),w=b.type.storage,k=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"hidden_size",type:"u32"},{name:"ldb",type:"u32"}];return`
  const TILE_SIZE = ${s}u;
  var<workgroup> tileInput: array<${w}, ${s*s}>;
  var<workgroup> tileWeightQ: array<${w}, ${s*s}>;
  var<workgroup> tileWeightK: array<${w}, ${s*s}>;
  var<workgroup> tileWeightV: array<${w}, ${s*s}>;
  ${f.registerUniforms(k).declareVariables(b,x,v,h,g,y)}
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
  }`};return e.compute({name:"AttentionPrepare",shaderCache:{inputDependencies:["type","type","type"]},getRunData:()=>({outputs:[{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0}],dispatchGroup:u,programUniforms:l}),getShaderSource:c},{inputs:d,outputs:[-1,-1,-1]})},Ic=(e,t)=>{let r=hu(e.inputs,t),[a,n,i]=_u(e,r);return br(e,a,n,i,e.inputs[4],void 0,void 0,void 0,e.inputs[5],r)}}),bu,wu,vu,Tc,oy=W(()=>{at(),ne(),se(),Ee(),oe(),bu=(e,t)=>{if(!e||e.length!==5)throw new Error("BatchNormalization requires 5 inputs");let r=(a,n,i)=>{let s=n.length;if(s!==a.length)throw new Error(`${i}: num dimensions != ${s}`);n.forEach((u,d)=>{if(u!==a[d])throw new Error(`${i}: dim[${d}] do not match`)})};if(e[0].dims.length>1){let a=t.format==="NHWC"?t.spatial?e[0].dims.slice(-1):e[0].dims.slice(-1).concat(e[0].dims.slice(1,e[0].dims.length-1)):e[0].dims.slice(1,t.spatial?2:void 0);r(e[1].dims,a,"Invalid input scale"),r(e[2].dims,a,"Invalid input B"),r(e[3].dims,a,"Invalid input mean"),r(e[4].dims,a,"Invalid input var")}else r(e[1].dims,[1],"Invalid input scale"),r(e[2].dims,[1],"Invalid input B"),r(e[3].dims,[1],"Invalid input mean"),r(e[4].dims,[1],"Invalid input var")},wu=(e,t)=>{let{epsilon:r,spatial:a,format:n}=t,i=e[0].dims,s=a?Ie(i[i.length-1]):1,u=n==="NHWC"&&i.length>1?s:1,d=R.size(i)/s,l=a,c=l?i.length:i,f=P("x",e[0].dataType,e[0].dims,s),h=P("scale",e[1].dataType,e[1].dims,u),g=P("bias",e[2].dataType,e[2].dims,u),y=P("inputMean",e[3].dataType,e[3].dims,u),b=P("inputVar",e[4].dataType,e[4].dims,u),x=Y("y",e[0].dataType,c,s),v=()=>{let k="";if(a)k=`let cOffset = ${i.length===1?"0u":n==="NHWC"?`outputIndices[${i.length-1}] / ${s}`:"outputIndices[1]"};`;else if(n==="NCHW")k=`
            ${x.indicesSet("outputIndices","0","0")}
            let cOffset = ${x.indicesToOffset("outputIndices")};`;else{k=`var cIndices = ${h.type.indices}(0);
                       cIndices[0] = outputIndices[${i.length-1}];`;for(let S=1;S<h.rank;S++)k+=`cIndices[${S}] = outputIndices[${S}];`;k+=`let cOffset = ${h.indicesToOffset("cIndices")};`}return k},w=k=>`
  const epsilon = ${r};
  ${k.registerUniform("outputSize","u32").declareVariables(f,h,g,y,b,x)}
  ${k.mainStart()}
  ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
    var outputIndices = ${x.offsetToIndices(`global_idx * ${s}`)};
    ${v()}
    let scale = ${h.getByOffset("cOffset")};
    let bias = ${g.getByOffset("cOffset")};
    let inputMean = ${y.getByOffset("cOffset")};
    let inputVar = ${b.getByOffset("cOffset")};
    let x = ${f.getByOffset("global_idx")};
    let value = (x - inputMean) * inverseSqrt(inputVar + epsilon) * scale + bias;
    ${x.setByOffset("global_idx","value")}
  }`;return{name:"BatchNormalization",shaderCache:{hint:`${t.epsilon}_${t.format}_${a}_${s}`,inputDependencies:l?["rank","type","type","type","type"]:void 0},getShaderSource:w,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:l?[{type:12,data:d},...te(i)]:[{type:12,data:d}]})}},vu=e=>be(e),Tc=(e,t)=>{let{inputs:r,outputCount:a}=e,n=vu({...t,outputCount:a});if(Se.webgpu.validateInputContent&&bu(r,n),t.trainingMode)throw new Error("BatchNormalization trainingMode is not supported yet.");e.compute(wu(r,n))}}),$u,xu,Ec,uy=W(()=>{se(),oe(),$u=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![320,640,1280].includes(e[0].dims[2]))throw new Error("number of channels should be 320, 640 or 1280");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},xu=e=>{let t=e[0].dims,r=e[0].dims[2],a=R.size(t)/4,n=e[0].dataType,i=P("input",n,t,4),s=P("bias",n,[r],4),u=P("residual",n,t,4),d=Y("output",n,t,4);return{name:"BiasAdd",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(a/64)}}),getShaderSource:l=>`
  const channels = ${r}u / 4;
  ${l.declareVariables(i,s,u,d)}

  ${l.mainStart()}
    ${l.guardAgainstOutOfBoundsWorkgroupSizes(a)}
    let value = ${i.getByOffset("global_idx")}
      + ${s.getByOffset("global_idx % channels")} + ${u.getByOffset("global_idx")};
    ${d.setByOffset("global_idx","value")}
  }`}},Ec=e=>{$u(e.inputs),e.compute(xu(e.inputs))}}),Su,_e,Cc,zc,Ac,Oc,Rc,Mc,Bc,Nc,Dc,ku,Pc,Lc,Uc,qc,mr,Wc,Kr,Gc,jc,Vc,Hc,Fc,Kc,Zc,Qc,Xc,Yc,Jc,ef,tf,rf,af,nf,Zi,sf,nn,sn,of,uf,lf,Iu,Tu,df,Bn=W(()=>{ne(),se(),Ee(),oe(),Su=(e,t,r,a,n,i,s)=>{let u=Math.ceil(t/4),d="";typeof n=="string"?d=`${n}(a)`:d=n("a");let l=P("inputData",r,[u],4),c=Y("outputData",a,[u],4),f=[{name:"vec_size",type:"u32"}];return s&&f.push(...s),`
      ${e.registerUniforms(f).declareVariables(l,c)}

  ${i??""}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}

    let a = ${l.getByOffset("global_idx")};
    ${c.setByOffset("global_idx",d)}
  }`},_e=(e,t,r,a,n,i=e.dataType,s,u)=>{let d=[{type:12,data:Math.ceil(R.size(e.dims)/4)}];return s&&d.push(...s),{name:t,shaderCache:{hint:n,inputDependencies:["type"]},getShaderSource:l=>Su(l,R.size(e.dims),e.dataType,i,r,a,u),getRunData:l=>({outputs:[{dims:e.dims,dataType:i}],dispatchGroup:{x:Math.ceil(R.size(l[0].dims)/64/4)},programUniforms:d})}},Cc=e=>{e.compute(_e(e.inputs[0],"Abs","abs"))},zc=e=>{e.compute(_e(e.inputs[0],"Acos","acos"))},Ac=e=>{e.compute(_e(e.inputs[0],"Acosh","acosh"))},Oc=e=>{e.compute(_e(e.inputs[0],"Asin","asin"))},Rc=e=>{e.compute(_e(e.inputs[0],"Asinh","asinh"))},Mc=e=>{e.compute(_e(e.inputs[0],"Atan","atan"))},Bc=e=>{e.compute(_e(e.inputs[0],"Atanh","atanh"))},Nc=e=>be(e),Dc=(e,t)=>{let r;switch(t.to){case 10:r="vec4<f16>";break;case 1:r="vec4<f32>";break;case 12:r="vec4<u32>";break;case 6:r="vec4<i32>";break;case 9:r="vec4<bool>";break;default:throw new RangeError(`not supported type (specified in attribute 'to' from 'Cast' operator): ${t.to}`)}e.compute(_e(e.inputs[0],"Cast",r,void 0,t.cacheKey,t.to))},ku=e=>{let t,r,a=e.length>=2&&e[1].data!==0,n=e.length>=3&&e[2].data!==0;switch(e[0].dataType){case 1:t=a?e[1].getFloat32Array()[0]:-34028234663852886e22,r=n?e[2].getFloat32Array()[0]:34028234663852886e22;break;case 10:t=a?e[1].getUint16Array()[0]:64511,r=n?e[2].getUint16Array()[0]:31743;break;default:throw new Error("Unsupport data type")}return be({min:t,max:r})},Pc=(e,t)=>{let r=t||ku(e.inputs),a=Pe(e.inputs[0].dataType);e.compute(_e(e.inputs[0],"Clip",n=>`clamp(${n}, vec4<${a}>(uniforms.min), vec4<${a}>(uniforms.max))`,void 0,r.cacheKey,void 0,[{type:e.inputs[0].dataType,data:r.min},{type:e.inputs[0].dataType,data:r.max}],[{name:"min",type:a},{name:"max",type:a}]),{inputs:[0]})},Lc=e=>{e.compute(_e(e.inputs[0],"Ceil","ceil"))},Uc=e=>{e.compute(_e(e.inputs[0],"Cos","cos"))},qc=e=>{e.compute(_e(e.inputs[0],"Cosh","cosh"))},mr=e=>be(e),Wc=(e,t)=>{let r=Pe(e.inputs[0].dataType);e.compute(_e(e.inputs[0],"Elu",a=>`elu_vf32(${a})`,`
  const elu_alpha_ = ${r}(${t.alpha});

  fn elu_f32(a: ${r}) -> ${r} {
  return select((exp(a) - 1.0) * elu_alpha_, a, a >= 0.0);
  }

  fn elu_vf32(v: vec4<${r}>) -> vec4<${r}> {
  return vec4(elu_f32(v.x), elu_f32(v.y), elu_f32(v.z), elu_f32(v.w));
  }`,t.cacheKey))},Kr=(e="f32")=>`
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
}`,Gc=e=>{let t=Pe(e.inputs[0].dataType);e.compute(_e(e.inputs[0],"Erf",r=>`erf_vf32(${r})`,Kr(t)))},jc=e=>{e.compute(_e(e.inputs[0],"Exp","exp"))},Vc=e=>{e.compute(_e(e.inputs[0],"Floor","floor"))},Hc=e=>{let t=Pe(e.inputs[0].dataType);e.compute(_e(e.inputs[0],"Gelu",r=>`0.5 * ${r} * (1.0 + erf_vf32(${r} * 0.7071067811865475))`,Kr(t)))},Fc=(e,t)=>{let r=Pe(e.inputs[0].dataType);e.compute(_e(e.inputs[0],"LeakyRelu",a=>`select(leaky_relu_alpha_ * ${a}, ${a}, ${a} >= vec4<${r}>(0.0))`,`const leaky_relu_alpha_ = ${r}(${t.alpha});`,t.cacheKey))},Kc=e=>{e.compute(_e(e.inputs[0],"Not",t=>`!${t}`))},Zc=e=>{e.compute(_e(e.inputs[0],"Neg",t=>`-${t}`))},Qc=e=>{e.compute(_e(e.inputs[0],"Reciprocal",t=>`1.0/${t}`))},Xc=e=>{let t=Pe(e.inputs[0].dataType);e.compute(_e(e.inputs[0],"Relu",r=>`select(vec4<${t}>(0.0), ${r}, ${r} > vec4<${t}>(0.0))`))},Yc=e=>{e.compute(_e(e.inputs[0],"Sigmoid",t=>`(1.0 / (1.0 + exp(-${t})))`))},Jc=e=>be(e),ef=(e,t)=>{let r=Pe(e.inputs[0].dataType);e.compute(_e(e.inputs[0],"HardSigmoid",a=>`max(vec4<${r}>(0.0), min(vec4<${r}>(1.0), ${t.alpha} * ${a} + vec4<${r}>(${t.beta})))`,void 0,t.cacheKey))},tf=e=>{e.compute(_e(e.inputs[0],"Sin","sin"))},rf=e=>{e.compute(_e(e.inputs[0],"Sinh","sinh"))},af=e=>{e.compute(_e(e.inputs[0],"Sqrt","sqrt"))},nf=e=>{e.compute(_e(e.inputs[0],"Tan","tan"))},Zi=e=>`sign(${e}) * (1 - exp(-2 * abs(${e}))) / (1 + exp(-2 * abs(${e})))`,sf=e=>{e.compute(_e(e.inputs[0],"Tanh",Zi))},nn=(e="f32")=>`
const fast_gelu_a: ${e} = 0.5;
const fast_gelu_b: ${e} = 0.7978845608028654;
const fast_gelu_c: ${e} = 0.035677408136300125;

fn tanh_v(v: vec4<${e}>) -> vec4<${e}> {
  return ${Zi("v")};
}
`,sn=e=>`(fast_gelu_a + fast_gelu_a * tanh_v(${e} * (fast_gelu_c * ${e} * ${e} + fast_gelu_b))) * ${e}`,of=e=>{let t=Pe(e.inputs[0].dataType);e.compute(_e(e.inputs[0],"FastGelu",sn,nn(t),void 0,e.inputs[0].dataType))},uf=(e,t)=>{let r=Pe(e.inputs[0].dataType);return e.compute(_e(e.inputs[0],"ThresholdedRelu",a=>`select(vec4<${r}>(0.0), ${a}, ${a} > thresholded_relu_alpha_)`,`const thresholded_relu_alpha_ = vec4<${r}>(${t.alpha});`,t.cacheKey)),0},lf=e=>{e.compute(_e(e.inputs[0],"Log","log"))},Iu=(e,t)=>`
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
`,Tu=e=>`quick_gelu_impl(${e})`,df=(e,t)=>{let r=Pe(e.inputs[0].dataType);e.compute(_e(e.inputs[0],"QuickGelu",Tu,Iu(r,t.alpha),t.cacheKey,e.inputs[0].dataType))}}),Eu,Cu,pf,ly=W(()=>{se(),oe(),Bn(),Eu=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![2560,5120,10240].includes(e[0].dims[2]))throw new Error("hidden state should be 2560, 5120 or 10240");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},Cu=e=>{let t=e[0].dims.slice();t[2]=t[2]/2;let r=P("input",e[0].dataType,e[0].dims,4),a=P("bias",e[0].dataType,[e[0].dims[2]],4),n=Y("output",e[0].dataType,t,4),i=R.size(t)/4,s=Oe(e[0].dataType);return{name:"BiasSplitGelu",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(i/64)}}),getShaderSource:u=>`
  const M_SQRT2 = sqrt(2.0);
  const halfChannels = ${e[0].dims[2]/4/2}u;

  ${u.declareVariables(r,a,n)}

  ${Kr(s)}

  ${u.mainStart()}
    ${u.guardAgainstOutOfBoundsWorkgroupSizes(i)}
    let biasIdx = global_idx % halfChannels;
    let batchIndex = global_idx / halfChannels;
    let inputOffset = biasIdx + batchIndex * halfChannels * 2;
    let valueLeft = input[inputOffset] + bias[biasIdx];
    let valueRight = input[inputOffset + halfChannels] + bias[biasIdx + halfChannels];
    let geluRight = valueRight * 0.5 * (erf_vf32(valueRight / M_SQRT2) + 1);

    ${n.setByOffset("global_idx","valueLeft * geluRight")}
  }`}},pf=e=>{Eu(e.inputs),e.compute(Cu(e.inputs))}}),zu,Au,et,cf,ff,hf,mf,gf,yf,_f,bf,wf,vf,dy=W(()=>{ne(),se(),oe(),zu=(e,t,r,a,n,i,s,u,d,l,c,f)=>{let h,g;typeof u=="string"?h=g=(w,k)=>`${u}((${w}),(${k}))`:typeof u=="function"?h=g=u:(h=u.scalar,g=u.vector);let y=Y("outputData",c,a.length,4),b=P("aData",d,t.length,4),x=P("bData",l,r.length,4),v;if(n)if(i){let w=R.size(t)===1,k=R.size(r)===1,S=t.length>0&&t[t.length-1]%4===0,I=r.length>0&&r[r.length-1]%4===0;w||k?v=y.setByOffset("global_idx",g(w?`${b.type.value}(${b.getByOffset("0")}.x)`:b.getByOffset("global_idx"),k?`${x.type.value}(${x.getByOffset("0")}.x)`:x.getByOffset("global_idx"))):v=`
            let outputIndices = ${y.offsetToIndices("global_idx * 4u")};
            let offsetA = ${b.broadcastedIndicesToOffset("outputIndices",y)};
            let offsetB = ${x.broadcastedIndicesToOffset("outputIndices",y)};
            ${y.setByOffset("global_idx",g(s||S?b.getByOffset("offsetA / 4u"):`${b.type.value}(${b.getByOffset("offsetA / 4u")}[offsetA % 4u])`,s||I?x.getByOffset("offsetB / 4u"):`${x.type.value}(${x.getByOffset("offsetB / 4u")}[offsetB % 4u])`))}
          `}else v=y.setByOffset("global_idx",g(b.getByOffset("global_idx"),x.getByOffset("global_idx")));else{if(!i)throw new Error("no necessary to use scalar implementation for element-wise binary op implementation.");let w=(k,S,I="")=>{let C=`aData[indexA${S}][componentA${S}]`,z=`bData[indexB${S}][componentB${S}]`;return`
            let outputIndices${S} = ${y.offsetToIndices(`global_idx * 4u + ${S}u`)};
            let offsetA${S} = ${b.broadcastedIndicesToOffset(`outputIndices${S}`,y)};
            let offsetB${S} = ${x.broadcastedIndicesToOffset(`outputIndices${S}`,y)};
            let indexA${S} = offsetA${S} / 4u;
            let indexB${S} = offsetB${S} / 4u;
            let componentA${S} = offsetA${S} % 4u;
            let componentB${S} = offsetB${S} % 4u;
            ${k}[${S}] = ${I}(${h(C,z)});
          `};c===9?v=`
            var data = vec4<u32>(0);
            ${w("data",0,"u32")}
            ${w("data",1,"u32")}
            ${w("data",2,"u32")}
            ${w("data",3,"u32")}
            outputData[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:v=`
            ${w("outputData[global_idx]",0)}
            ${w("outputData[global_idx]",1)}
            ${w("outputData[global_idx]",2)}
            ${w("outputData[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(b,x,y)}

        ${f??""}

        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${v}
      }`},Au=(e,t,r,a,n,i,s=r.dataType)=>{let u=r.dims.map(b=>Number(b)??1),d=a.dims.map(b=>Number(b)??1),l=!R.areEqual(u,d),c=u,f=R.size(u),h=!1,g=!1,y=[l];if(l){let b=Kt.calcShape(u,d,!1);if(!b)throw new Error("Can't perform binary op on the given tensors");c=b.slice(),f=R.size(c);let x=R.size(u)===1,v=R.size(d)===1,w=u.length>0&&u[u.length-1]%4===0,k=d.length>0&&d[d.length-1]%4===0;y.push(x),y.push(v),y.push(w),y.push(k);let S=1;for(let I=1;I<c.length;I++){let C=u[u.length-I],z=d[d.length-I];if(C===z)S*=C;else break}S%4===0?(g=!0,h=!0):(x||v||w||k)&&(h=!0)}else h=!0;return y.push(h),{name:e,shaderCache:{hint:t+y.map(b=>b.toString()).join("_"),inputDependencies:["rank","rank"]},getShaderSource:b=>zu(b,u,d,c,h,l,g,n,r.dataType,a.dataType,s,i),getRunData:()=>({outputs:[{dims:c,dataType:s}],dispatchGroup:{x:Math.ceil(f/64/4)},programUniforms:[{type:12,data:Math.ceil(R.size(c)/4)},...te(u,d,c)]})}},et=(e,t,r,a,n,i)=>{e.compute(Au(t,n??"",e.inputs[0],e.inputs[1],r,a,i))},cf=e=>{et(e,"Add",(t,r)=>`${t}+${r}`)},ff=e=>{et(e,"Div",(t,r)=>`${t}/${r}`)},hf=e=>{et(e,"Equal",{scalar:(t,r)=>`u32(${t}==${r})`,vector:(t,r)=>`vec4<u32>(${t}==${r})`},void 0,void 0,9)},mf=e=>{et(e,"Mul",(t,r)=>`${t}*${r}`)},gf=e=>{let t=P("input",e.inputs[0].dataType,e.inputs[0].dims).type.value;et(e,"Pow",{scalar:(r,a)=>`pow_custom(${r},${a})`,vector:(r,a)=>`pow_vector_custom(${r},${a})`},`
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
      `)},yf=e=>{et(e,"Sub",(t,r)=>`${t}-${r}`)},_f=e=>{et(e,"Greater",{scalar:(t,r)=>`u32(${t}>${r})`,vector:(t,r)=>`vec4<u32>(${t}>${r})`},void 0,void 0,9)},bf=e=>{et(e,"Less",{scalar:(t,r)=>`u32(${t}<${r})`,vector:(t,r)=>`vec4<u32>(${t}<${r})`},void 0,void 0,9)},wf=e=>{et(e,"GreaterOrEqual",{scalar:(t,r)=>`u32(${t}>=${r})`,vector:(t,r)=>`vec4<u32>(${t}>=${r})`},void 0,void 0,9)},vf=e=>{et(e,"LessOrEqual",{scalar:(t,r)=>`u32(${t}<=${r})`,vector:(t,r)=>`vec4<u32>(${t}<=${r})`},void 0,void 0,9)}}),Ou,Ru,Mu,Bu,$f,xf,py=W(()=>{ne(),se(),Ee(),oe(),Ou=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");let r=0,a=e[r],n=a.dataType,i=a.dims.length;e.forEach((s,u)=>{if(u!==r){if(s.dataType!==n)throw new Error("input tensors should be one type");if(s.dims.length!==i)throw new Error("input tensors should have the same shape");s.dims.forEach((d,l)=>{if(l!==t&&d!==a.dims[l])throw new Error("non concat dimensions must match")})}})},Ru=(e,t)=>`
  fn calculateInputIndex(index: u32) -> u32 {
    let sizeInConcatAxis = array<u32, ${e}u>(${t});
    for (var i: u32 = 0u; i < ${e}; i += 1u ) {
      if (index < sizeInConcatAxis[i]) {
        return i;
      }
    }
    return ${e}u;
  }`,Mu=(e,t)=>{let r=e.length,a=[];for(let n=0;n<r;++n){let i=t.setByOffset("global_idx",e[n].getByIndices("indices"));r===1?a.push(i):n===0?a.push(`if (inputIndex == ${n}u) { ${i} }`):n===r-1?a.push(`else { ${i} }`):a.push(`else if (inputIndex == ${n}) { ${i} }`)}return a.join(`
`)},Bu=(e,t,r,a)=>{let n=R.size(r),i=new Array(e.length),s=new Array(e.length),u=0,d=[],l=[],c=[{type:12,data:n}];for(let b=0;b<e.length;++b)u+=e[b].dims[t],i[b]=u,l.push(e[b].dims.length),s[b]=P(`input${b}`,a,l[b]),d.push("rank"),c.push({type:12,data:i[b]});for(let b=0;b<e.length;++b)c.push(...te(e[b].dims));c.push(...te(r));let f=Y("output",a,r.length),h=f.indicesGet("indices",t),g=Array.from(Array(i.length).keys()).map(b=>`uniforms.sizeInConcatAxis${b}`).join(","),y=b=>`

  ${(()=>{b.registerUniform("outputSize","u32");for(let x=0;x<e.length;x++)b.registerUniform(`sizeInConcatAxis${x}`,"u32");return b.declareVariables(...s,f)})()}

  ${Ru(i.length,g)}

  ${b.mainStart()}
    ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

    var indices = ${f.offsetToIndices("global_idx")};

    let inputIndex = calculateInputIndex(${h});
    if (inputIndex != 0u) {
      let sizeInConcatAxis = array<u32, ${i.length}u>(${g});
      ${h} -= sizeInConcatAxis[inputIndex - 1u];
    }

    ${Mu(s,f)}
  }`;return{name:"Concat",shaderCache:{hint:`${t}`,inputDependencies:d},getRunData:()=>({outputs:[{dims:r,dataType:a}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:c}),getShaderSource:y}},$f=(e,t)=>{let r=e.inputs,a=r[0].dims,n=R.normalizeAxis(t.axis,a.length);Ou(r,n);let i=a.slice();i[n]=r.reduce((u,d)=>u+(d.dims.length>n?d.dims[n]:0),0);let s=r.filter(u=>R.size(u.dims)>0);e.compute(Bu(s,n,i,r[0].dataType),{inputs:s})},xf=e=>be({axis:e.axis})}),Nt,Dt,Pt,Nn,Ut=W(()=>{ne(),se(),Nt=(e,t,r="f32")=>{switch(e.activation){case"Relu":return`value = max(value, ${t}(0.0));`;case"Sigmoid":return`value = (${t}(1.0) / (${t}(1.0) + exp(-value)));`;case"Clip":return`value = clamp(value, ${t}(${r}(uniforms.clip_min)), ${t}(${r}(uniforms.clip_max)));`;case"HardSigmoid":return`value = max(${t}(0.0), min(${t}(1.0), ${r}(uniforms.alpha) * value + ${r}(uniforms.beta)));`;case"LeakyRelu":return`value = select(${r}(uniforms.alpha) * value, value, value >= ${t}(0.0));`;case"Tanh":return`let e2x = exp(-2.0 * abs(value));
              value = sign(value) * (1.0 - e2x) / (1.0 + e2x);
        `;case"":return"";default:throw new Error(`Unsupported activation ${e.activation}`)}},Dt=(e,t)=>{e.activation==="Clip"?t.push({type:1,data:e.clipMax},{type:1,data:e.clipMin}):e.activation==="HardSigmoid"?t.push({type:1,data:e.alpha},{type:1,data:e.beta}):e.activation==="LeakyRelu"&&t.push({type:1,data:e.alpha})},Pt=(e,t)=>{e.activation==="Clip"?t.push({name:"clip_max",type:"f32"},{name:"clip_min",type:"f32"}):e.activation==="HardSigmoid"?t.push({name:"alpha",type:"f32"},{name:"beta",type:"f32"}):e.activation==="LeakyRelu"&&t.push({name:"alpha",type:"f32"})},Nn=e=>{let t=(e==null?void 0:e.activation)||"";if(t==="HardSigmoid"){let[r,a]=(e==null?void 0:e.activation_params)||[.2,.5];return{activation:t,alpha:r,beta:a}}else if(t==="Clip"){let[r,a]=(e==null?void 0:e.activation_params)||[Kp,Zp];return{activation:t,clipMax:a,clipMin:r}}else if(t==="LeakyRelu"){let[r]=(e==null?void 0:e.activation_params)||[.01];return{activation:t,alpha:r}}return{activation:t}}}),Re,Sf,Dn=W(()=>{Re=(e,t)=>{switch(e){case 1:return t;case 2:return`vec2<${t}>`;case 3:return`vec3<${t}>`;case 4:return`vec4<${t}>`;default:throw new Error(`${e}-component is not supported.`)}},Sf=e=>`
      ${e?"value = value + getBiasByOutputCoords(coords);":""}
      `}),kf,cy=W(()=>{kf=e=>`
fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
      shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
}
fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
    i32(${e}.x), i32(${e}.y), i32(${e}.z), 1));
}
`}),yr,Pn,Ln=W(()=>{ne(),se(),oe(),Ut(),yr=(e,t,r,a,n)=>{let i=a-r;return`
      ${Array.from({length:r}).map((s,u)=>`
      if (${J(t.shape,u,t.rank)} != 1) {
        ${t.indicesSet(e,u,J(n,u+i,a))}
      } else {
        ${t.indicesSet(e,u,0)}
      }`).join("")}
`},Pn=(e,t,r,a,n=!1,i)=>{let s=e[0].dims,u=e[1].dims,d=s[s.length-2],l=u[u.length-1],c=s[s.length-1],f=Ie(l),h=Ie(c),g=Ie(d),y=R.size(r)/f/g,b=e.length>2,x=a?a.slice(0,-2):r.slice(0,-2),v=[R.size(x),d,l],w=[{type:12,data:y},{type:12,data:d},{type:12,data:l},{type:12,data:c}];Dt(t,w),w.push(...te(x,s,u)),b&&w.push(...te(e[2].dims)),w.push(...te(v));let k=S=>{let I=On("batch_dims",e[0].dataType,x.length),C=P("a",e[0].dataType,s.length,h),z=P("b",e[1].dataType,u.length,f),A=Y("output",e[0].dataType,v.length,f),O=Oe(A.type.tensor),G=Nt(t,A.type.value,O),X=[C,z],K="";if(b){let ie=n?f:1;X.push(P("bias",e[2].dataType,e[2].dims.length,ie)),K=`${n?`value += bias[col / ${ie}];`:`value += ${A.type.value}(bias[row + i]);`}`}let F=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"}];Pt(t,F);let Z=()=>{let ie=`var a_data: ${C.type.value};`;for(let H=0;H<h;H++)ie+=`
              let b_data${H} = b[(b_offset + (k + ${H}) * uniforms.N + col) / ${f}];`;for(let H=0;H<g;H++){ie+=`a_data = a[(a_offset + (row + ${H}) * uniforms.K + k) / ${h}];`;for(let j=0;j<h;j++)ie+=`
            values[${H}] = fma(${z.type.value}(a_data${h===1?"":`[${j}]`}), b_data${j}, values[${H}]);
`}return ie};return`
  ${S.registerUniforms(F).registerInternalVariables(I).declareVariables(...X,A)}
  ${S.mainStart()}
    ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let col = (global_idx % (uniforms.N / ${f})) * ${f};
    var index1 = global_idx / (uniforms.N / ${f});
    let stride1 = uniforms.M / ${g};
    let row = (index1 % stride1) * ${g};
    let batch = index1 / stride1;

    ${r.length===2?"":`let batch_indices = ${I.offsetToIndices("batch")};`}

    var a_indices: ${C.type.indices};
    ${yr("a_indices",C,C.rank-2,I.rank,"batch_indices")}
    ${C.indicesSet("a_indices",C.rank-2,0)}
    ${C.indicesSet("a_indices",C.rank-1,0)}
    let a_offset = ${C.indicesToOffset("a_indices")};

    var b_indices: ${z.type.indices};
    ${yr("b_indices",z,z.rank-2,I.rank,"batch_indices")}
    ${z.indicesSet("b_indices",z.rank-2,0)}
    ${z.indicesSet("b_indices",z.rank-1,0)}
    let b_offset = ${z.indicesToOffset("b_indices")};
    var values: array<${A.type.value}, ${g}>;
    for (var k: u32 = 0u; k < uniforms.K; k = k + ${h}) {
      ${Z()}
    }
    for (var i = 0u; i < ${g}u; i++) {
      var value = values[i];
      ${K}
      ${G}
      let cur_indices = ${A.type.indices}(batch, row + i, col);
      let offset = ${A.indicesToOffset("cur_indices")};
      ${A.setByOffset(`offset / ${f}`,"value")};
    }
  }
  `};return{name:"MatMulNaive",shaderCache:{hint:`${t.activation};${f};${h};${g};${n}`,inputDependencies:b?["rank","rank","rank"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(y/64)},programUniforms:w}),getShaderSource:k}}}),Nu,Du,on,Qi,Pu,un,Lu,ei,Un=W(()=>{ne(),se(),oe(),Ut(),Ln(),Dn(),Nu=(e,t)=>e?`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          kStart + inputRow,
          globalRowStart / innerElementSize + inputCol${t?", batchIndices":""});
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          globalRow + innerRow,
          kStart / innerElementSize + inputCol${t?", batchIndices":""});
        `,Du=(e,t)=>e?`
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
        }`,on=(e,t,r="f32",a,n=!1,i=32,s=!1,u=32)=>{let d=t[1]*e[1],l=t[0]*e[0],c=n?d:i,f=n?i:d,h=c/t[0],g=i/t[1];if(!((n&&h===4&&e[1]===4||!n&&(h===3||h===4))&&c%t[0]===0&&i%t[1]===0&&e[0]===4))throw new Error(`If transposeA ${n} is true, innerElementSize ${h} and workPerThread[1] ${e[1]} must be 4.
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
          ${Nu(n,a)}
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

          ${Du(n,h)}
      }

      workgroupBarrier();
  }

  for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      mm_write(batch, globalRow + innerRow, globalCol, acc[innerRow]);
  }
}`},Qi=(e,t)=>e?`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              kStart + inputRow,
              globalRowStart + inputCol${t?", batchIndices":""});
            `:`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              globalRowStart + inputRow,
              kStart + inputCol${t?", batchIndices":""});
            `,Pu=e=>e?"let ACached = mm_Asub[k][tileRow + innerRow];":"let ACached = mm_Asub[tileRow + innerRow][k];",un=(e,t,r="f32",a,n=!1,i=32,s=!1,u=32,d=!1)=>{let l=e[1]*t[1],c=e[0]*t[0],f=n?l:i,h=n?i:l;if(!(h%t[1]===0&&f%t[0]===0&&i%t[1]===0))throw new Error(`tileAHight ${h} must be divisible by workgroupSize[1]${t[1]}, tileAWidth ${f} must be divisible by workgroupSize[0]${t[0]}, tileInner ${i} must be divisible by workgroupSize[1]${t[1]}`);let g=h/t[1],y=f/t[0],b=i/t[1],x=d?`
    let localRow = i32(localId.y);
    let localCol = i32(localId.x);
    let globalRowStart = i32(workgroupId.y) * ${l};
    let globalColStart = i32(workgroupId.x) * ${c};

    // Loop over shared dimension.
    for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var inputRow = localRow; inputRow < ${h}; inputRow = inputRow + ${t[1]}) {
        for (var inputCol = localCol; inputCol < ${f}; inputCol = inputCol + ${t[0]}) {
          ${Qi(n,a)}
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
let tileColA = i32(localId.x) * ${y};
let tileRowB = i32(localId.y) * ${b};
// Loop over shared dimension.
for (var t = 0; t < num_tiles; t = t + 1) {
  // Load one tile of A into local memory.
  for (var innerRow = 0; innerRow < ${g}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < ${y}; innerCol = innerCol + 1) {
      let inputRow = tileRowA + innerRow;
      let inputCol = tileColA + innerCol;
      ${Qi(n,a)}
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
      ${Pu(n)}
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
`},Lu=(e,t,r,a,n=!1)=>{let[i,s,u,d]=a,l=Oe(a[0].type.tensor);return`
    fn mm_readA(batch: i32, row: i32, colIn: i32, batchIndices: ${i.type.indices}) -> ${Re(e,l)} {
      var value = ${Re(e,l)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_a_outer && col < uniforms.dim_inner)
      {
        var aIndices: ${s.type.indices};
        ${yr("aIndices",s,s.rank-2,i.rank,"batchIndices")}
        ${s.indicesSet("aIndices",s.rank-2,"u32(row)")}
        ${s.indicesSet("aIndices",s.rank-1,"u32(colIn)")}
        value = ${s.getByIndices("aIndices")};
      }
      return value;
    }

    fn mm_readB(batch: i32, row: i32, colIn: i32, batchIndices: ${i.type.indices}) -> ${Re(e,l)} {
      var value = ${Re(e,l)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_inner && col < uniforms.dim_b_outer)
      {
        var bIndices: ${u.type.indices};
        ${yr("bIndices",u,u.rank-2,i.rank,"batchIndices")}
        ${u.indicesSet("bIndices",u.rank-2,"u32(row)")}
        ${u.indicesSet("bIndices",u.rank-1,"u32(colIn)")}
        value = ${u.getByIndices("bIndices")};
      }
      return value;
    }

    fn mm_write(batch: i32, row: i32, colIn: i32, valueIn: ${Re(e,l)}) {
      let col = colIn * ${e};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer) {
        var value = valueIn;
        let coords = vec3<i32>(batch, row, colIn);
        ${t?`value = value + ${n?"bias[colIn]":`${Re(e,l)}(bias[row])`};`:""}
        ${r}
        ${d.setByIndices("vec3<u32>(coords)","value")}
      }
    }
    `},ei=(e,t,r,a,n=!1,i)=>{let s=e[0].dims,u=e[1].dims,d=s.slice(0,-2),l=u.slice(0,-2),c=a?a.slice(0,-2):r.slice(0,-2),f=R.size(c),h=s[s.length-2],g=s[s.length-1],y=u[u.length-1],b=g%4===0&&y%4===0,x=h<=8?[4,1,1]:[4,4,1],v=[8,8,1],w=[Math.ceil(y/v[0]/x[0]),Math.ceil(h/v[1]/x[1]),Math.ceil(f/v[2]/x[2])],k=b?4:1,S=[...d,h,g/k],I=S.length,C=[...l,g,y/k],z=C.length,A=[f,h,y/k],O=[{type:6,data:h},{type:6,data:y},{type:6,data:g}];Dt(t,O),O.push(...te(c,S,C));let G=["rank","rank"],X=e.length>2;X&&(O.push(...te(e[2].dims)),G.push("rank")),O.push(...te(A));let K=F=>{let Z=c.length,ie=On("batchDims",e[0].dataType,Z,1),H=Oe(e[0].dataType),j=P("a",e[0].dataType,I,k),he=P("b",e[1].dataType,z,k),N=Y("result",e[0].dataType,A.length,k),M=[j,he];if(X){let ge=n?k:1;M.push(P("bias",e[2].dataType,e[2].dims.length,ge))}let E=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"}];Pt(t,E);let B=Oe(N.type.tensor),L=Nt(t,N.type.value,B),Q=Lu(k,X,L,[ie,j,he,N],n);return`
  ${F.registerUniforms(E).registerInternalVariables(ie).declareVariables(...M,N)}
  ${Q}
  ${b?on(x,v,H,ie):un(x,v,H,ie)}
                   `};return{name:"MatMul",shaderCache:{hint:`${x};${t.activation};${b};${n}`,inputDependencies:G},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:w[0],y:w[1],z:w[2]},programUniforms:O}),getShaderSource:K}}}),Uu,If,fy=W(()=>{ne(),gt(),oe(),Ut(),Dn(),cy(),Un(),Uu=(e,t,r,a,n=!1,i,s=4,u=4,d=4,l="f32")=>{let c=O=>{switch(O){case 1:return"resData = x[xIndex];";case 3:return`resData = vec3<${l}>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);`;case 4:return"resData = x[xIndex / 4];";default:throw new Error(`innerElementSize ${O} is not supported.`)}},f=O=>{switch(O){case 1:return"return w[row * i32(uniforms.w_shape[3]) + colIn];";case 4:return"return w[row * i32(uniforms.w_shape[3]) / 4 + colIn];";default:throw new Error(`innerElementSize ${O} is not supported.`)}},h=e?`
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
    `,y=e?"i32(uniforms.x_shape[1])":"i32(uniforms.x_shape[2])",b=e?"i32(uniforms.x_shape[2])":"i32(uniforms.x_shape[3])",x=e?"row":"col",v=e?"col":"row",w=`
    let inChannels = i32(uniforms.w_shape[2]);
    let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
    let outRow = ${x} / outWidth;
    let outCol = ${x} % outWidth;

    let WRow = ${v} / (i32(uniforms.w_shape[1]) * inChannels);
    let WCol = ${v} / inChannels % i32(uniforms.w_shape[1]);
    let xRow = outRow * uniforms.stride[0] + uniforms.dilation[0] * WRow - uniforms.pad[0];
    let xCol = outCol * uniforms.stride[1] + uniforms.dilation[1] * WCol - uniforms.pad[1];
    let xCh = ${v} % inChannels;
    var resData = ${Re(s,l)}(0.0);
    // The bounds checking is always needed since we use it to pad zero for
    // the 'same' padding type.
    if (xRow >= 0 && xRow < ${y} && xCol >= 0 && xCol < ${b}) {
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
    return ${Re(s,l)}(0.0);`:a&&r?`
    let col = colIn * ${s};
    ${w}`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${w}
    }
    return ${Re(s,l)}(0.0);`,S=e?a&&r?f(u):`
    let col = colIn * ${u};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${f(u)}
    }
    return ${Re(u,l)}(0.0);`:`
    let col = colIn * ${u};
    if (row < uniforms.dim_inner && col < uniforms.dim_a_outer) {
      ${f(u)}
    }
    return ${Re(u,l)}(0.0);`,I=Re(d,l),C=Re(e?s:u,l),z=Re(e?u:s,l),A=Nt(i,I,l);return`
    fn mm_readA(batch: i32, row : i32, colIn : i32) -> ${C} {
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
      ${Sf(n)}
      ${A}
      setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
      }
    }`},If=(e,t,r,a,n,i,s,u,d)=>{let l=t.format==="NHWC",c=l?e[0].dims[3]:e[0].dims[1],f=r[0],h=l?r[2]:r[3],g=l?r[1]:r[2],y=l?r[3]:r[1],b=l&&(c%4===0||c%3===0)&&y%4===0,x=l?y:h*g,v=l?h*g:y,w=[8,8,1],k=a<=8?[4,1,1]:[4,4,1],S=[Math.ceil(x/w[0]/k[0]),Math.ceil(v/w[1]/k[1]),Math.ceil(f/w[2]/k[2])];me("verbose",()=>`[conv2d_mm_webgpu] dispatch = ${S}`);let I=b?l&&c%4!==0?3:4:1,C=w[1]*k[1],z=w[0]*k[0],A=Math.max(w[0]*I,w[1]),O=a%C===0,G=n%z===0,X=i%A===0,K=b?[I,4,4]:[1,1,1],F=[{type:6,data:a},{type:6,data:n},{type:6,data:i},{type:6,data:[t.pads[0],t.pads[1]]},{type:6,data:t.strides},{type:6,data:t.dilations}];Dt(t,F),F.push(...te(e[0].dims,e[1].dims));let Z=["rank","rank"];s&&(F.push(...te(e[2].dims)),Z.push("rank")),F.push(...te(r));let ie=H=>{let j=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"},{name:"pad",type:"i32",length:2},{name:"stride",type:"i32",length:2},{name:"dilation",type:"i32",length:2}];Pt(t,j);let he=b?4:1,N=Oe(e[0].dataType),M=`
      fn setOutputAtIndex(flatIndex : i32, value : ${b?`vec4<${N}>`:N}) {
        result[flatIndex] = ${b?`vec4<${N}>`:N}(value);
      }
      fn setOutputAtCoords(d0 : i32, d1 : i32, d2 : i32, d3 : i32, value : ${b?`vec4<${N}>`:N}) {
        let flatIndex = getOutputIndexFromCoords(vec4<i32>(d0, d1, d2, d3));
        setOutputAtIndex(flatIndex ${b?"/ 4":""}, value);
      }`,E=P("x",e[0].dataType,e[0].dims.length,I===3?1:I),B=P("w",e[1].dataType,e[1].dims.length,he),L=[E,B],Q=Y("result",e[0].dataType,r.length,he);if(s){let ge=P("bias",e[2].dataType,e[2].dims.length,he);L.push(ge),M+=`
        fn getBiasByOutputCoords(coords : vec4<i32>) -> ${b?`vec4<${N}>`:N} {
          return bias[coords.${l?"w":"y"}${b?"/ 4":""}];
        }`}return`
        ${kf("uniforms.result_strides")}
        //struct Uniforms { xShape : vec4<i32>, wShape : vec4<i32>, outShape : vec4<i32>,
        //  outShapeStrides: vec3<i32>, filterDims : vec2<i32>, pad : vec2<i32>, stride : vec2<i32>,
        //  dilation : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32 };
        ${H.registerUniforms(j).declareVariables(...L,Q)}
        ${M}
        ${Uu(l,O,G,X,s,t,K[0],K[1],K[2],N)}
        ${b?on(k,w,N,void 0,!l,A):un(k,w,N,void 0,!l,A,!1,void 0,u)}`};return{name:"Conv2DMatMul",shaderCache:{hint:`${t.cacheKey};${I};${b};${O};${G};${X};${C};${z};${A}`,inputDependencies:Z},getRunData:()=>({outputs:[{dims:d?d(r):r,dataType:e[0].dataType}],dispatchGroup:{x:S[0],y:S[1],z:S[2]},programUniforms:F}),getShaderSource:ie}}}),qu,Xi,sr,Wu,Yi,Gu,Tf,Ef,hy=W(()=>{ne(),gt(),se(),oe(),Ut(),Dn(),qu=e=>{let t=1;for(let r=0;r<e.length;r++)t*=e[r];return t},Xi=e=>typeof e=="number"?[e,e,e]:e,sr=(e,t)=>t<=1?e:e+(e-1)*(t-1),Wu=(e,t,r,a=1)=>{let n=sr(t,a);return Math.floor((e[0]*(r-1)-r+n)/2)},Yi=(e,t,r,a,n)=>{n==null&&(n=Wu(e,t[0],a[0]));let i=[0,0,0,r];for(let s=0;s<3;s++)e[s]+2*n>=t[s]&&(i[s]=Math.trunc((e[s]-t[s]+2*n)/a[s]+1));return i},Gu=(e,t,r,a,n,i,s,u,d,l)=>{let c,f,h,g;if(e==="VALID"&&(e=0),typeof e=="number"){c={top:e,bottom:e,left:e,right:e,front:e,back:e};let y=Yi([t,r,a,1],[u,d,l],1,[n,i,s],e);f=y[0],h=y[1],g=y[2]}else if(Array.isArray(e)){if(!e.every((b,x,v)=>b===v[0]))throw Error(`Unsupported padding parameter: ${e}`);c={top:e[0],bottom:e[1],left:e[2],right:e[3],front:e[4],back:e[5]};let y=Yi([t,r,a,1],[u,d,l],1,[n,i,s],e[0]);f=y[0],h=y[1],g=y[2]}else if(e==="SAME_UPPER"){f=Math.ceil(t/n),h=Math.ceil(r/i),g=Math.ceil(a/s);let y=(f-1)*n+u-t,b=(h-1)*i+d-r,x=(g-1)*s+l-a,v=Math.floor(y/2),w=y-v,k=Math.floor(b/2),S=b-k,I=Math.floor(x/2),C=x-I;c={top:k,bottom:S,left:I,right:C,front:v,back:w}}else throw Error(`Unknown padding parameter: ${e}`);return{padInfo:c,outDepth:f,outHeight:h,outWidth:g}},Tf=(e,t,r,a,n,i=!1,s="channelsLast")=>{let u,d,l,c,f;if(s==="channelsLast")[u,d,l,c,f]=e;else if(s==="channelsFirst")[u,f,d,l,c]=e;else throw new Error(`Unknown dataFormat ${s}`);let[h,,g,y,b]=t,[x,v,w]=Xi(r),[k,S,I]=Xi(a),C=sr(g,k),z=sr(y,S),A=sr(b,I),{padInfo:O,outDepth:G,outHeight:X,outWidth:K}=Gu(n,d,l,c,x,v,w,C,z,A),F=i?h*f:h,Z=[0,0,0,0,0];return s==="channelsFirst"?Z=[u,F,G,X,K]:s==="channelsLast"&&(Z=[u,G,X,K,F]),{batchSize:u,dataFormat:s,inDepth:d,inHeight:l,inWidth:c,inChannels:f,outDepth:G,outHeight:X,outWidth:K,outChannels:F,padInfo:O,strideDepth:x,strideHeight:v,strideWidth:w,filterDepth:g,filterHeight:y,filterWidth:b,effectiveFilterDepth:C,effectiveFilterHeight:z,effectiveFilterWidth:A,dilationDepth:k,dilationHeight:S,dilationWidth:I,inShape:e,outShape:Z,filterShape:t}},Ef=(e,t,r,a,n,i)=>{let s=i==="channelsLast";s?e[0].dims[3]:e[0].dims[1];let u=[64,1,1],d={x:r.map((x,v)=>v)},l=[Math.ceil(qu(d.x.map(x=>r[x]))/u[0]),1,1];me("verbose",()=>`[conv3d_naive_webgpu] dispatch = ${l}`);let c=1,f=R.size(r),h=[{type:12,data:f},{type:12,data:a},{type:12,data:n},{type:12,data:t.strides},{type:12,data:t.dilations}];Dt(t,h),h.push(...te(e[0].dims,e[1].dims));let g=["rank","rank"],y=e.length===3;y&&(h.push(...te(e[2].dims)),g.push("rank")),h.push(...te(r));let b=x=>{let v=[{name:"output_size",type:"u32"},{name:"filter_dims",type:"u32",length:a.length},{name:"pads",type:"u32",length:n.length},{name:"strides",type:"u32",length:t.strides.length},{name:"dilations",type:"u32",length:t.dilations.length}];Pt(t,v);let w=1,k=Oe(e[0].dataType),S=P("x",e[0].dataType,e[0].dims.length,c),I=P("W",e[1].dataType,e[1].dims.length,w),C=[S,I],z=Y("result",e[0].dataType,r.length,w),A="";if(y){let X=P("bias",e[2].dataType,e[2].dims.length,w);C.push(X),A+=`
        fn getBiasByOutputCoords(coords : array<u32, 5>) -> ${k} {
          return bias[${s?J("coords",4,5):J("coords",1,5)}];
        }`}let O=Re(c,k),G=Nt(t,O,k);return`
            ${A}
            fn getX(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${S.getByIndices("aIndices")};
            }
            fn getW(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${I.getByIndices("aIndices")};
            }
          ${x.registerUniforms(v).declareVariables(...C,z)}
          ${x.mainStart()}
          ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
              let coords = ${z.offsetToIndices("global_idx")};
              let batch = ${J("coords",0,S.rank)};
              let d2 = ${s?J("coords",S.rank-1,S.rank):J("coords",1,S.rank)};
              let xFRCCorner = vec3<u32>(${s?J("coords",1,S.rank):J("coords",2,S.rank)},
              ${s?J("coords",2,S.rank):J("coords",3,S.rank)},
              ${s?J("coords",3,S.rank):J("coords",4,S.rank)}) * uniforms.strides - uniforms.pads;
              let xFCorner = xFRCCorner.x;
              let xRCorner = xFRCCorner.y;
              let xCCorner = xFRCCorner.z;
              let xShapeY = ${s?J("uniforms.x_shape",1,S.rank):J("uniforms.x_shape",2,S.rank)};
              let xShapeZ = ${s?J("uniforms.x_shape",2,S.rank):J("uniforms.x_shape",3,S.rank)};
              let xShapeW = ${s?J("uniforms.x_shape",3,S.rank):J("uniforms.x_shape",4,S.rank)};
              let xShapeU = ${s?J("uniforms.x_shape",4,S.rank):J("uniforms.x_shape",1,S.rank)};
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
              ${y?"value = value + getBiasByOutputCoords(coords)":""};
              ${G}
              result[global_idx] = f32(value);
          }`};return{name:"Conv3DNaive",shaderCache:{hint:`${t.cacheKey};${s};${c};${y}`,inputDependencies:g},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:l[0],y:l[1],z:l[2]},programUniforms:h}),getShaderSource:b}}}),Cf,zf,my=W(()=>{ne(),se(),oe(),Ut(),Cf=(e,t,r,a)=>{let n=e.length>2,i=n?"value += b[output_channel];":"",s=e[0].dims,u=e[1].dims,d=t.format==="NHWC",l=d?r[3]:r[1],c=l/t.group,f=d&&c>=4?Ie(l):1,h=R.size(r)/f,g=[{type:12,data:h},{type:12,data:t.dilations},{type:12,data:[t.strides[0],t.strides[1]]},{type:12,data:[t.pads[0],t.pads[1]]},{type:12,data:c}];Dt(t,g),g.push(...te(s,[u[0],u[1],u[2],u[3]/f]));let y=n?["rank","rank","rank"]:["rank","rank"];g.push(...te([r[0],r[1],r[2],r[3]/f]));let b=x=>{let v=Y("output",e[0].dataType,r.length,f),w=Oe(v.type.tensor),k=Nt(t,v.type.value,w),S=P("x",e[0].dataType,s.length),I=P("w",e[1].dataType,u.length,f),C=[S,I];n&&C.push(P("b",e[2].dataType,e[2].dims,f));let z=[{name:"output_size",type:"u32"},{name:"dilations",type:"u32",length:t.dilations.length},{name:"strides",type:"u32",length:2},{name:"pads",type:"u32",length:2},{name:"output_channels_per_group",type:"u32"}];Pt(t,z);let A=d?`
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
  ${x.registerUniforms(z).declareVariables(...C,v)}

  ${x.mainStart()}
    ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let outputIndices = ${v.offsetToIndices("global_idx")};
    let batch: u32 = outputIndices[0];
    let output_channel: u32 = outputIndices[${d?3:1}];
    let xRCCorner: vec2<u32> = vec2<u32>(outputIndices[${d?1:2}], outputIndices[${d?2:3}]) * uniforms.strides - uniforms.pads;
    let group_id: u32 = output_channel * ${f} / uniforms.output_channels_per_group;
    var in_channel_offset = group_id * uniforms.w_shape[${d?2:1}];

    var value: ${v.type.value} = ${v.type.value}(0);
    ${A}
    ${i}
    ${k}
    ${v.setByOffset("global_idx","value")}
  }`};return{name:"GroupedConv",shaderCache:{hint:`${t.cacheKey}_${f}`,inputDependencies:y},getRunData:()=>({outputs:[{dims:a?a(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:g}),getShaderSource:b}},zf=(e,t,r,a)=>{let n=e.length>2,i=Ie(r[3]),s=Ie(r[2]),u=R.size(r)/i/s,d=[e[0].dims[0],e[0].dims[1],e[0].dims[2],e[0].dims[3]/i],l=[e[1].dims[0],e[1].dims[1],e[1].dims[2],e[1].dims[3]/i],c=[r[0],r[1],r[2],r[3]/i],f=[{type:12,data:u},{type:6,data:[t.strides[0],t.strides[1]]},{type:6,data:[t.pads[0],t.pads[1]]}];Dt(t,f),f.push(...te(d,l,c));let h=(s-1)*t.strides[1]+l[1],g=y=>{let b=Y("output",e[0].dataType,c.length,i),x=Oe(b.type.tensor),v=Nt(t,b.type.value,x),w=P("x",e[0].dataType,d.length,i),k=P("w",e[1].dataType,l.length,i),S=[w,k];n&&S.push(P("b",e[2].dataType,e[2].dims,i));let I=n?"value += b[output_channel];":"",C=[{name:"output_size",type:"u32"},{name:"strides",type:"i32",length:2},{name:"pads",type:"i32",length:2}];return Pt(t,C),`
  ${y.registerUniforms(C).declareVariables(...S,b)}
  ${y.mainStart()}
    ${y.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
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
      ${v}
      ${b.set("batch","row","col + i","output_channel","value")};
    }
  }`};return{name:"GroupedConv-Vectorize",shaderCache:{hint:`${t.cacheKey};${i};${s};${h};${l[0]};${l[1]}`,inputDependencies:n?["rank","rank","type"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:a?a(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:f}),getShaderSource:g}}}),ju,qr,Vu,Wr,ln,Ji,Hu,Fu,dn,gy=W(()=>{se(),fy(),hy(),Un(),my(),Ut(),Ln(),Et(),ju=(e,t,r,a,n,i)=>{let s=e[0],u=e.slice(i?1:2,i?3:4),d=u.length,l=t[0],c=t.slice(2).map((h,g)=>h+(h-1)*(r[g]-1)),f=u.map((h,g)=>h+a[g]+a[g+d]).map((h,g)=>Math.floor((h-c[g]+n[g])/n[g]));return f.splice(0,0,s),f.splice(i?3:1,0,l),f},qr=[2,3,1,0],Vu=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length>5)throw new Error("greater than 5D is not supported");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],a=e[1].dims[1]*t.group;if(r!==a)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");if(e.length===3&&(e[2].dims.length!==1||e[1].dims[0]!==e[2].dims[0]))throw new Error("invalid bias");let n=e[0].dims.length-2;if(t.dilations.length!==n)throw new Error(`dilations should be ${n}D`);if(t.strides.length!==n)throw new Error(`strides should be ${n}D`);if(t.pads.length!==n*2)throw new Error(`pads should be ${n*2}D`);if(t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape")},Wr=(e,t)=>{let r=e.kernelShape.slice();r.length<t[1].dims.length-2&&r.push(...Array(t[1].dims.length-2-r.length).fill(0));for(let i=2;i<t[1].dims.length;++i)r[i-2]===0&&(r[i-2]=t[1].dims[i]);let a=e.pads.slice();Yr.adjustPadsBasedOnAutoPad(t[0].dims,e.strides,e.dilations,r,a,e.format==="NHWC",e.autoPad);let n=Object.assign({},e);return Object.assign(n,{kernelShape:r,pads:a}),n},ln=e=>{let t=Nn(e),r=e.format,a=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],n=e.dilations,i=e.group,s=e.kernel_shape,u=e.pads,d=e.strides,l=e.w_is_const();return{autoPad:a,format:r,dilations:n,group:i,kernelShape:s,pads:u,strides:d,wIsConst:l,...t,cacheKey:`${e.format};${t.activation};`}},Ji=(e,t,r,a)=>{let n=r.format==="NHWC",i=ju(t[0].dims,t[1].dims,r.dilations,r.pads,r.strides,n);if(r.group!==1){let C=[t[0]];if(n){let z=e.kernelCustomData.wT??e.compute(Ve(t[1],qr),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=z),C.push(z)}else C.push(t[1]);t.length===3&&C.push(t[2]),!e.adapterInfo.isArchitecture("ampere")&&n&&t[1].dims[0]===r.group&&t[1].dims[1]===1&&r.dilations[0]===1&&r.dilations[1]===1?e.compute(zf(C,r,i,a),{inputs:C}):e.compute(Cf(C,r,i,a),{inputs:C});return}let s=t.length===3,u=t[0].dims[n?1:2],d=t[0].dims[n?2:3],l=t[0].dims[n?3:1],c=t[1].dims[2],f=t[1].dims[3],h=i[n?1:2],g=i[n?2:3],y=i[n?3:1],b=n&&c===u&&f===d&&r.pads[0]===0&&r.pads[1]===0;if(b||c===1&&f===1&&r.dilations[0]===1&&r.dilations[1]===1&&r.strides[0]===1&&r.strides[1]===1&&r.pads[0]===0&&r.pads[1]===0){let C=i[0],z,A,O,G=[];if(n){let F=e.kernelCustomData.wT??e.compute(Ve(t[1],qr),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];if(r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=F),b){let Z=u*d*l;z=t[0].reshape([1,C,Z]),A=F.reshape([1,Z,y]),O=[1,C,y]}else z=t[0].reshape([C,u*d,l]),A=F.reshape([1,l,y]),O=[C,h*g,y];G.push(z),G.push(A)}else z=t[0].reshape([C,l,u*d]),A=t[1].reshape([1,y,l]),O=[C,y,h*g],G.push(A),G.push(z);s&&G.push(t[2]);let X=O[2],K=G[0].dims[G[0].dims.length-1];X<8&&K<8?e.compute(Pn(G,r,i,O,n,a),{inputs:G}):e.compute(ei(G,r,i,O,n,a),{inputs:G});return}let x=!0,v=e.kernelCustomData.wT??e.compute(Ve(t[1],qr),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=v);let w=[t[0],v];s&&w.push(t[2]);let k=n?h*g:y,S=n?y:h*g,I=c*f*l;e.compute(If(w,r,i,k,S,I,s,x,a),{inputs:w})},Hu=(e,t)=>{let r=t.format==="NHWC",a=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&a.push(e.inputs[2]);let n=[0,t.pads[0],0,t.pads[1]],i=[1].concat(t.strides),s=[1].concat(t.dilations),u=[1].concat(t.kernelShape),d=Wr({...t,pads:n,strides:i,dilations:s,kernelShape:u},a);Ji(e,a,d,l=>r?[l[0],l[2],l[3]]:[l[0],l[1],l[3]])},Fu=(e,t,r)=>{let a=r.format==="NHWC"?"channelsLast":"channelsFirst",n=Wr(r,t),i=r.autoPad==="NOTSET"?r.pads:r.autoPad,s=Tf(t[0].dims,t[1].dims,r.strides,r.dilations,i,!1,a);e.compute(Ef(t,n,s.outShape,[s.filterDepth,s.filterHeight,s.filterWidth],[s.padInfo.front,s.padInfo.top,s.padInfo.left],a))},dn=(e,t)=>{if(Vu(e.inputs,t),e.inputs[0].dims.length===3)Hu(e,t);else if(e.inputs[0].dims.length===5)Fu(e,e.inputs,t);else{let r=Wr(t,e.inputs);Ji(e,e.inputs,r)}}}),Af,yy=W(()=>{ne(),gt(),se(),oe(),Af=(e,t,r)=>{let a=e.length>2,n=t.outputShape,i=t.format==="NHWC",s=t.group,u=e[1].dims,d=u[2]/s,l=u[3],c=i?Ie(d):1,f=i&&l===1&&d>=4,h=f?Math.floor(d/4)*4:Math.floor(d/c)*c,g=d-h,y=i?Ie(l):1,b=i?l===1?c:y:1,x=R.size(n)/y,v=[Math.ceil(x/64),1,1];me("verbose",()=>`[conv2d_backprop_webgpu] dispatch = ${v}`);let w=["rank","rank"],k=[t.strides[0],t.strides[1]],S=[t.kernelShape[i?1:2],t.kernelShape[i?2:3]],I=[t.dilations[0],t.dilations[1]],C=[S[0]+(t.dilations[0]<=1?0:(t.kernelShape[i?1:2]-1)*(t.dilations[0]-1)),S[1]+(t.dilations[1]<=1?0:(t.kernelShape[i?2:3]-1)*(t.dilations[1]-1))],z=[C[0]-1-Math.floor((t.pads[0]+t.pads[2])/2),C[1]-1-Math.floor((t.pads[1]+t.pads[3])/2)],A=[{type:12,data:x},{type:12,data:k},{type:12,data:S},{type:12,data:I},{type:12,data:C},{type:6,data:z},{type:12,data:h},{type:12,data:d},{type:12,data:l},...te(e[0].dims,e[1].dims)];a&&(A.push(...te(e[2].dims)),w.push("rank")),A.push(...te(n));let O=G=>{let X=[{name:"output_size",type:"u32"},{name:"strides",type:"u32",length:k.length},{name:"filter_dims",type:"u32",length:S.length},{name:"dilations",type:"u32",length:S.length},{name:"effective_filter_dims",type:"u32",length:C.length},{name:"pads",type:"i32",length:z.length},{name:"input_channels_per_group_int",type:"u32"},{name:"input_channels_per_group",type:"u32"},{name:"output_channels_per_group",type:"u32"}],K=Oe(e[0].dataType),F=i?1:2,Z=i?2:3,ie=i?3:1,H=P("W",e[1].dataType,e[1].dims.length,b),j=P("Dy",e[0].dataType,e[0].dims.length,c),he=[j,H];a&&he.push(P("bias",e[2].dataType,[n[ie]].length,y));let N=Y("result",e[0].dataType,n.length,y),M=()=>{let L="";if(f)c===4?L+=`
        let xValue = ${j.getByOffset("x_offset")};
        let wValue = ${H.getByOffset("w_offset")};
        dotProd = dotProd + dot(xValue, wValue);
        x_offset += 1u;
        w_offset += 1u;`:c===2?L+=`
          dotProd = dotProd + dot(vec4<${K}>(${j.getByOffset("x_offset")}, ${j.getByOffset("x_offset + 1u")}), vec4<${K}>(${H.getByOffset("w_offset")}, ${H.getByOffset("w_offset + 1u")}));
          x_offset += 2u;
          w_offset += 2u;`:c===1&&(L+=`
          dotProd = dotProd + dot(vec4<${K}>(${j.getByOffset("x_offset")}, ${j.getByOffset("x_offset + 1u")}, ${j.getByOffset("x_offset + 2u")}, ${j.getByOffset("x_offset + 3u")}), vec4<${K}>(${H.getByOffset("w_offset")}, ${H.getByOffset("w_offset + 1u")}, ${H.getByOffset("w_offset + 2u")}, ${H.getByOffset("w_offset + 3u")}));
          x_offset += 4u;
          w_offset += 4u;`);else if(L+=`
                  let xValue = ${i?j.getByOffset(`${j.indicesToOffset(`${j.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${c}`):j.get("batch","inputChannel","idyR","idyC")};
        `,c===1)L+=`
          let w_offset = ${H.indicesToOffset(`${H.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel, wOutChannel)`)};
          let wValue = ${H.getByOffset(`w_offset / ${b}`)};
          dotProd = dotProd + xValue * wValue;`;else for(let Q=0;Q<c;Q++)L+=`
            let wValue${Q} = ${H.getByOffset(`${H.indicesToOffset(`${H.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel + ${Q}, wOutChannel)`)} / ${b}`)};
            dotProd = dotProd + xValue[${Q}] * wValue${Q};`;return L},E=()=>{if(g===0)return"";if(!f)throw new Error(`packInputAs4 ${f} is not true.`);let L="";if(c===1){L+="dotProd = dotProd";for(let Q=0;Q<g;Q++)L+=`
            + ${j.getByOffset(`x_offset + ${Q}`)} * ${H.getByOffset(`w_offset + ${Q}`)}`;L+=";"}else if(c===2){if(g!==2)throw new Error(`Invalid inputChannelsRemainder ${g}.`);L+=`
          let xValue = ${j.getByOffset("x_offset")};
          let wValue = ${H.getByOffset("w_offset")};
          dotProd = dotProd + dot(xValue, wValue);`}return L},B=`
            let outputIndices = ${N.offsetToIndices(`global_idx * ${y}`)};
            let batch = ${N.indicesGet("outputIndices",0)};
            let d1 = ${N.indicesGet("outputIndices",ie)};
            let r = ${N.indicesGet("outputIndices",F)};
            let c = ${N.indicesGet("outputIndices",Z)};
            let dyCorner = vec2<i32>(i32(r), i32(c)) - uniforms.pads;
            let dyRCorner = dyCorner.x;
            let dyCCorner = dyCorner.y;
            let groupId = d1 / uniforms.output_channels_per_group;
            let wOutChannel = d1 - groupId * uniforms.output_channels_per_group;
            // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
            // ? = to be determined. : = across all values in that axis.
            var dotProd = ${N.type.value}(0.0);
            var wR: u32 = 0;
            if (uniforms.dilations.x == 1) {
              // Minimum wR >= 0 that satisfies (dyRCorner + wR) % (uniforms.strides.x) == 0
              wR = u32(((dyRCorner + i32(uniforms.strides.x) - 1) / i32(uniforms.strides.x)) * i32(uniforms.strides.x) - dyRCorner);
            }
            for (; wR < uniforms.effective_filter_dims.x; wR = wR + 1) {
              if (wR % uniforms.dilations.x != 0) {
                continue;
              }
              let dyR = (${K}(dyRCorner) + ${K}(wR)) / ${K}(uniforms.strides[0]);
              let wRPerm = uniforms.filter_dims.x - 1 - wR / uniforms.dilations.x;
              if (dyR < 0.0 || dyR >= ${K}(uniforms.Dy_shape[${F}]) || fract(dyR) > 0.0 ||
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
                let dyC = (${K}(dyCCorner) + ${K}(wC)) / ${K}(uniforms.strides.y);
                let wCPerm = uniforms.filter_dims.y - 1 - wC / uniforms.dilations.y;
                if (dyC < 0.0 || dyC >= ${K}(uniforms.Dy_shape[${Z}]) ||
                    fract(dyC) > 0.0 || wCPerm < 0) {
                  continue;
                }
                let idyC: u32 = u32(dyC);
                var inputChannel = groupId * uniforms.input_channels_per_group;
                ${f?`
                var x_offset = ${j.indicesToOffset(`${j.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${c};
                var w_offset = ${H.indicesToOffset(`${H.type.indices}(wRPerm, wCPerm, inputChannel, wOutChannel)`)} / ${b};
                  `:""}
                for (var d2: u32 = 0; d2 < uniforms.input_channels_per_group_int; d2 = d2 + ${f?4:c}) {
                  ${M()}
                  inputChannel = inputChannel + ${f?4:c};
                }
                ${E()}
                wC = wC + uniforms.strides.y - 1;
              }
              wR = wR + uniforms.strides[0] - 1;
            }
            let value = dotProd${a?` + bias[d1 / ${y}]`:""};
            ${N.setByOffset("global_idx","value")};
          `;return`
    ${G.registerUniforms(X).declareVariables(...he,N)}
      ${G.mainStart()}
      ${G.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")};
    ${B}}`};return{name:"ConvTranspose2D",shaderCache:{hint:`${t.cacheKey};${c}${b}${y}${f}${g}`,inputDependencies:w},getRunData:()=>({dispatchGroup:{x:v[0],y:v[1],z:v[2]},outputs:[{dims:r?r(n):n,dataType:e[0].dataType}],programUniforms:A}),getShaderSource:O}}}),Ku,Zu,Qu,ea,Of,Xu,ta,Yu,Rf,_y=W(()=>{yy(),Ut(),Et(),Ku=(e,t,r,a,n,i)=>(e-1)*t+r+(a-1)*n+1-i,Zu=(e,t,r,a,n)=>{let i=Math.floor(e/2);t==="SAME_UPPER"?(r[a]=i,r[n]=e-i):t==="SAME_LOWER"&&(r[a]=e-i,r[n]=i)},Qu=(e,t,r,a,n,i,s,u,d,l)=>{let c=e.length-2,f=l.length===0;d.length<c&&d.push(...Array(c-d.length).fill(0));let h=e[0],g=t[u?3:1]*n;for(let y=0,b=e.length-c-(u?1:0);y<c;++y,++b){let x=e[b],v=f?x*s[y]:l[y],w=Ku(x,s[y],i[y],t[b],r[y],v);Zu(w,a,i,y,y+c),f&&l.push(s[y]*(x-1)+d[y]+(t[b]-1)*r[y]+1-i[y]-i[y+c])}l.splice(0,0,h),l.splice(u?3:1,0,g)},ea=(e,t)=>{let r=e.kernelShape.slice();if(e.kernelShape.length===0||e.kernelShape.reduce((f,h)=>f*h,1)===0){r.length=0;for(let f=2;f<t[1].dims.length;++f)r.push(t[1].dims[f])}let a=e.format==="NHWC";r.splice(0,0,t[1].dims[0]),r.splice(a?3:1,0,t[1].dims[1]);let n=e.pads.slice(),i=e.outputShape.slice(),s=e.outputPadding.slice(),u=t[0].dims,d=e.dilations.slice();if(d.reduce((f,h)=>f+h,0)===0){let f=t[0].dims.length-2;d=new Array(f).fill(1)}let l=e.strides.slice();if(l.reduce((f,h)=>f+h,0)===0){let f=t[0].dims.length-2;l=new Array(f).fill(1)}Qu(u,r,d,e.autoPad,e.group,n,l,a,s,i);let c=Object.assign({},e);return Object.assign(c,{kernelShape:r,pads:n,outputPadding:s,outputShape:i,dilations:d,strides:l}),c},Of=e=>{let t=Nn(e),r=e.format,a=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][typeof e.autoPad>"u"?0:e.autoPad],n=e.dilations,i=e.group,s=e.kernelShape,u=e.pads,d=e.strides,l=e.wIsConst(),c=e.outputPadding,f=e.outputShape;return{autoPad:a,format:r,dilations:n,group:i,kernelShape:s,outputPadding:c,outputShape:f,pads:u,strides:d,wIsConst:l,...t,cacheKey:`${e.format};${t.activation};`}},Xu=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length!==4&&e[0].dims.length!==3)throw new Error("currently only support 2-dimensional conv");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],a=e[1].dims[0];if(r!==a)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");let n=e[1].dims[1]*t.group;if(e.length===3&&(e[2].dims.length!==1||e[2].dims[0]!==n))throw new Error("invalid bias");let i=e[0].dims.length-2;if(t.dilations.reduce((s,u)=>s+u,0)>0&&t.dilations.length!==i)throw new Error(`dilations should be ${i}D`);if(t.strides.reduce((s,u)=>s+u,0)>0&&t.strides.length!==i)throw new Error(`strides should be ${i}D`);if(t.pads.reduce((s,u)=>s+u,0)>0&&t.pads.length!==i*2)throw new Error(`pads should be ${i*2}D`);if(t.outputPadding.length!==i&&t.outputPadding.length!==0)throw new Error(`output_padding should be ${i}D`);if(t.kernelShape.reduce((s,u)=>s+u,0)>0&&t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape");if(t.outputShape.length!==0&&t.outputShape.length!==e[0].dims.length-2)throw new Error("invalid output shape")},ta=(e,t,r,a)=>{let n=e.kernelCustomData.wT??e.compute(Ve(t[1],[2,3,0,1]),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=n);let i=[t[0],n];t.length===3&&i.push(t[2]),e.compute(Af(i,r,a),{inputs:i})},Yu=(e,t)=>{let r=t.format==="NHWC",a=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&a.push(e.inputs[2]);let n=t.kernelShape;(n.length===0||n[0]===0)&&(n=[e.inputs[1].dims[2]]);let i=t.dilations;(i.length===0||i[0]===0)&&(i=[1]);let s=t.strides;(s.length===0||s[0]===0)&&(s=[1]);let u=t.pads;u.length===0&&(u=[0,0]),u=[0,u[0],0,u[1]],s=[1].concat(s),i=[1].concat(i),n=[1].concat(n);let d=t.outputPadding;d=[0].concat(d);let l=ea({...t,pads:u,strides:s,dilations:i,kernelShape:n,outputPadding:d},a);ta(e,a,l,c=>r?[c[0],c[2],c[3]]:[c[0],c[1],c[3]])},Rf=(e,t)=>{if(Xu(e.inputs,t),e.inputs[0].dims.length===3)Yu(e,t);else{let r=ea(t,e.inputs);ta(e,e.inputs,r)}}}),Ju,Mf,Bf,by=W(()=>{ne(),se(),Ee(),oe(),Ju=(e,t,r,a)=>{let n=R.size(t),i=t.length,s=P("input",e,i),u=Y("output",e,i),d=r.dataType===6?r.getInt32Array()[0]:Number(r.getBigInt64Array()[0]),l=R.normalizeAxis(d,i),c=f=>{let h=` i32(${s.indicesGet("inputIndices","uniforms.axis")}) `,g=J("uniforms.input_shape","uniforms.axis",i),y=a.reverse?h+(a.exclusive?" + 1":""):"0",b=a.reverse?g:h+(a.exclusive?"":" + 1");return`
                ${f.registerUniform("outputSize","u32").registerUniform("axis","u32").declareVariables(s,u)}
                ${f.mainStart()}
                  ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
                  var inputIndices = ${u.offsetToIndices("global_idx")};
                  var sum = ${u.type.value}(0);
                  let first : i32 = ${y};
                  let last : i32 = ${b};
                  for (var i : i32 = first; i < last; i++) {
                    ${s.indicesSet("inputIndices","uniforms.axis","u32(i)")};
                    sum = sum + ${s.getByIndices("inputIndices")};
                  }
                  ${u.setByOffset("global_idx","sum")};
                }`};return{name:"CumSum",shaderCache:{hint:a.cacheKey,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:t,dataType:e}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:[{type:12,data:n},{type:12,data:l},...te(t,t)]}),getShaderSource:c}},Mf=(e,t)=>{let r=e.inputs[0].dims,a=e.inputs[0].dataType,n=e.inputs[1];e.compute(Ju(a,r,n,t),{inputs:[0]})},Bf=e=>{let t=e.exclusive===1,r=e.reverse===1;return be({exclusive:t,reverse:r})}}),el,tl,rl,Nf,Df,wy=W(()=>{ne(),se(),Ee(),oe(),el=e=>{if(!e||e.length!==1)throw new Error("DepthToSpace requires 1 input.");if(e[0].dims.length!==4)throw new Error("DepthToSpace requires 4D input.")},tl=(e,t,r,a)=>{let n=[];n.push(`fn perm(i: ${a.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`);for(let i=0;i<t;++i)n.push(r.indicesSet("a",e[i],`i[${i}]`));return n.push("return a;}"),n.join(`
`)},rl=(e,t)=>{let r,a,n,i,s,u,d=t.format==="NHWC",l=t.blocksize,c=t.mode==="DCR";d?([r,a,n,i]=e.dims,s=c?[r,a,n,l,l,i/l**2]:[r,a,n,i/l**2,l,l],u=c?[0,1,3,2,4,5]:[0,1,4,2,5,3]):([r,a,n,i]=[e.dims[0],e.dims[2],e.dims[3],e.dims[1]],s=c?[r,l,l,i/l**2,a,n]:[r,i/l**2,l,l,a,n],u=c?[0,3,4,1,5,2]:[0,1,4,2,5,3]);let f=e.reshape(s),h=f.dims.length,g=e.dataType,y=P("a",g,h),b=Y("output",g,h),x=v=>`
  ${v.registerUniform("output_size","u32").declareVariables(y,b)}

  ${tl(u,h,y,b)}

  ${v.mainStart()}
    ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${b.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${b.setByOffset("global_idx",y.getByIndices("aIndices"))}
  }`;return{name:"DepthToSpace",shaderCache:{hint:`${e.dims};${t.blocksize};${t.mode}`,inputDependencies:["rank"]},getRunData:v=>{let w=d?[r,a*l,n*l,i/l**2]:[r,i/l**2,a*l,n*l],k=R.size(w),S=f.dims,I=R.sortBasedOnPerm(S,u);return{outputs:[{dims:w,dataType:v[0].dataType}],dispatchGroup:{x:Math.ceil(k/64)},programUniforms:[{type:12,data:k},...te(S,I)]}},getShaderSource:x}},Nf=(e,t)=>{el(e.inputs),e.compute(rl(e.inputs[0],t))},Df=e=>be({blocksize:e.blocksize,mode:e.mode,format:e.format})}),Gr,or,ra,il,al,nl,sl,ia,ol,Pf,Lf,vy=W(()=>{ne(),se(),Ee(),oe(),Gr="[a-zA-Z]|\\.\\.\\.",or="("+Gr+")+",ra="^"+or+"$",il="("+or+",)*"+or,al="^"+il+"$",nl=class{constructor(e=-1){this.symbolToIndices=new Map,this.inputIndex=e}addSymbol(e,t){let r=this.symbolToIndices.get(e);r===void 0?r=[t]:r.push(t),this.symbolToIndices.set(e,r)}},sl=class{constructor(e,t){var n;this.equation=t,this.hasEllipsis=!1,this.symbolToInfo=new Map,this.lhs=new Array,this.outputDims=[];let[r,a]=t.includes("->")?t.split("->",2):[t,""];if(!r.match(RegExp(al)))throw new Error("Invalid LHS term");if(r.split(",").forEach((i,s)=>{let u=e[s].dims.slice();if(!i.match(RegExp(ra)))throw new Error("Invalid LHS term");let d=this.processTerm(i,!0,u,s);this.lhs.push(d)}),a==="")a+=[...this.symbolToInfo.entries()].filter(([i,s])=>s.count===1||i==="...").map(([i])=>i).join("");else if(!a.match(RegExp(or)))throw new Error("Invalid RHS");(n=a.match(RegExp(Gr,"g")))==null||n.forEach(i=>{if(i==="...")this.outputDims=this.outputDims.concat(this.ellipsisDims);else{let s=this.symbolToInfo.get(i);if(s===void 0)throw new Error("Invalid RHS symbol");this.outputDims.push(s.dimValue)}}),this.rhs=this.processTerm(a,!1,this.outputDims)}addSymbol(e,t,r){let a=this.symbolToInfo.get(e);if(a!==void 0){if(a.dimValue!==t&&a.count!==1)throw new Error("Dimension mismatch");a.count++,a.inputIndices.push(r)}else a={count:1,dimValue:t,inputIndices:[r]};this.symbolToInfo.set(e,a)}processTerm(e,t,r,a=-1){let n=r.length,i=!1,s=[],u=0;if(!e.match(RegExp(ra))&&!t&&e!=="")throw new Error("Invalid LHS term");let d=e.match(RegExp(Gr,"g")),l=new nl(a);return d==null||d.forEach((c,f)=>{if(c==="..."){if(i)throw new Error("Only one ellipsis is allowed per input term");i=!0;let h=n-d.length+1;if(h<0)throw new Error("Ellipsis out of bounds");if(s=r.slice(u,u+h),this.hasEllipsis){if(this.ellipsisDims.length!==s.length||this.ellipsisDims.toString()!==s.toString())throw new Error("Ellipsis dimensions mismatch")}else if(t)this.hasEllipsis=!0,this.ellipsisDims=s;else throw new Error("Ellipsis must be specified in the LHS");for(let g=0;g<s.length;g++){let y=String.fromCharCode(48+g);l.addSymbol(y,f+g),this.addSymbol(y,r[u++],a)}}else l.addSymbol(c,f+(this.hasEllipsis?this.ellipsisDims.length-1:0)),this.addSymbol(c,r[u++],a)}),l}},ia=e=>e+"_max",ol=(e,t,r,a)=>{let n=e.map(l=>l.length).map((l,c)=>P(`input${c}`,t,l)),i=R.size(a),s=Y("output",t,a.length),u=[...r.symbolToInfo.keys()].filter(l=>!r.rhs.symbolToIndices.has(l)),d=l=>{let c=[],f="var prod = 1.0;",h="var sum = 0.0;",g="sum += prod;",y=[],b=[],x=[],v=[],w=r.symbolToInfo.size===r.rhs.symbolToIndices.size;r.symbolToInfo.forEach((S,I)=>{var C;if(r.rhs.symbolToIndices.has(I)){let z=(C=r.rhs.symbolToIndices.get(I))==null?void 0:C[0];z!==void 0&&r.lhs.forEach((A,O)=>{if(S.inputIndices.includes(O)){let G=A.symbolToIndices.get(I);if(G===void 0)throw new Error("Invalid symbol error");G.forEach(X=>{c.push(`${n[O].indicesSet(`input${O}Indices`,X,s.indicesGet("outputIndices",z))}`)})}})}else r.lhs.forEach((z,A)=>{if(S.inputIndices.includes(A)){let O=z.symbolToIndices.get(I);if(O===void 0)throw new Error("Invalid symbol error");O.forEach(G=>{y.push(`${n[A].indicesSet(`input${A}Indices`,G,`${I}`)}`)}),v.push(`prod *= ${n[A].getByIndices(`input${A}Indices`)};`)}}),b.push(`for(var ${I}: u32 = 0; ${I} < uniforms.${ia(I)}; ${I}++) {`),x.push("}")});let k=w?[...c,`let sum = ${n.map((S,I)=>S.getByIndices(`input${I}Indices`)).join(" * ")};`]:[...c,h,...b,...y,f,...v,g,...x];return`
            ${l.registerUniforms(u.map(S=>({name:`${ia(S)}`,type:"u32"}))).registerUniform("outputSize","u32").declareVariables(...n,s)}

            ${l.mainStart()}
            ${l.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
            var outputIndices = ${s.offsetToIndices("global_idx")};
            ${n.map((S,I)=>`var input${I}Indices: ${n[I].type.indices};`).join(`
`)}
            ${k.join(`
`)};
            ${s.setByOffset("global_idx","sum")};
          }`};return{name:"Einsum",shaderCache:{hint:r.equation,inputDependencies:e.map(()=>"rank")},getRunData:()=>{let l=u.filter(f=>r.symbolToInfo.has(f)).map(f=>{var h;return{type:12,data:((h=r.symbolToInfo.get(f))==null?void 0:h.dimValue)||0}});l.push({type:12,data:i});let c=e.map((f,h)=>[...te(f)]).reduce((f,h)=>f.concat(h),l);return c.push(...te(a)),{outputs:[{dims:a,dataType:t}],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:c}},getShaderSource:d}},Pf=(e,t)=>{let r=new sl(e.inputs,t.equation),a=r.outputDims,n=e.inputs.map((i,s)=>i.dims);e.compute(ol(n,e.inputs[0].dataType,r,a))},Lf=e=>{let t=e.equation.replace(/\s+/g,"");return be({equation:t})}}),ul,aa,ll,dl,Uf,$y=W(()=>{ne(),se(),oe(),ul=e=>{if(!e||e.length!==2)throw new Error("Expand requires 2 input.");let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),a=r.length<t.length?0:r.length-t.length,n=t.length<r.length?0:t.length-r.length;for(;a<r.length&&n<t.length;++a,++n)if(r[a]!==t[n]&&r[a]!==1&&t[n]!==1)throw new Error("Expand requires shape to be broadcastable to input")},aa=(e,t)=>{let r=e.length-t.length,a=[];for(let n=0;n<r;++n)a.push(e[n]);for(let n=0;n<t.length;++n)a.push(t[n]===1?e[n+r]:t[n]);return a},ll=(e,t)=>e.length>t.length?aa(e,t):aa(t,e),dl=e=>{let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),a=ll(t,r),n=e[0].dataType,i=n===9||R.size(t)===1,s=n===9||t.length>0&&t[t.length-1]%4===0?4:1,u=i||a.length>0&&a[a.length-1]%4===0?4:1,d=Math.ceil(R.size(a)/u),l=f=>{let h=P("input",n,t.length,s),g=Y("output",n,a.length,u),y;if(n===9){let b=(x,v,w="")=>`
          let outputIndices${v} = ${g.offsetToIndices(`outputOffset + ${v}u`)};
          let offset${v} = ${h.broadcastedIndicesToOffset(`outputIndices${v}`,g)};
          let index${v} = offset${v} / 4u;
          let component${v} = offset${v} % 4u;
          ${x}[${v}] = ${w}(${h.getByOffset(`index${v}`)}[component${v}]);
        `;y=`
        let outputOffset = global_idx * ${u};
        var data = vec4<u32>(0);
        ${b("data",0,"u32")}
        ${b("data",1,"u32")}
        ${b("data",2,"u32")}
        ${b("data",3,"u32")}
        ${g.setByOffset("global_idx","data")}
      }`}else y=`
        let outputIndices = ${g.offsetToIndices(`global_idx * ${u}`)};
        let inputOffset = ${h.broadcastedIndicesToOffset("outputIndices",g)};
        let data = ${g.type.value}(${h.getByOffset(`inputOffset / ${s}`)});
        ${g.setByOffset("global_idx","data")}
      }`;return`
    ${f.registerUniform("vec_size","u32").declareVariables(h,g)}
    ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
    ${y}`},c=[{type:12,data:d},...te(t,a)];return{name:"Expand",shaderCache:{hint:`${a.length};${s}${u}`,inputDependencies:["rank"]},getShaderSource:l,getRunData:()=>({outputs:[{dims:a,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:c})}},Uf=e=>{ul(e.inputs),e.compute(dl(e.inputs),{inputs:[0]})}}),pl,qf,xy=W(()=>{ne(),se(),oe(),Bn(),pl=e=>{let t=e[0].dataType,r=R.size(e[0].dims),a=R.size(e[1].dims),n=a%4===0,i=s=>{let u=P("x",t,[1],4),d=P("bias",t,[1],4),l=Y("y",t,[1],4),c=[{name:"output_vec_size",type:"u32"},{name:"bias_size",type:"u32"}],f=g=>`
      let bias${g}_offset: u32 = (global_idx * 4 + ${g}) % uniforms.bias_size;
      let bias${g} = ${d.getByOffset(`bias${g}_offset / 4`)}[bias${g}_offset % 4];`,h=n?`
      let bias = ${d.getByOffset("global_idx % (uniforms.bias_size / 4)")};`:`${f(0)}${f(1)}${f(2)}${f(3)}
      let bias = ${u.type.value}(bias0, bias1, bias2, bias3);`;return`${s.registerUniforms(c).declareVariables(u,d,l)}

    ${nn(Pe(t))}

    ${s.mainStart(Zt)}
      ${s.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_vec_size")}

      let x = ${u.getByOffset("global_idx")};
      ${h}
      let x_in = x + bias;
      ${l.setByOffset("global_idx",sn("x_in"))}
    }`};return{name:"FastGeluWithBias",shaderCache:{hint:`${n}`,inputDependencies:["type","type"]},getShaderSource:i,getRunData:s=>({outputs:[{dims:s[0].dims,dataType:s[0].dataType}],programUniforms:[{type:12,data:Math.ceil(r/4)},{type:12,data:a}],dispatchGroup:{x:Math.ceil(r/Zt/4)}})}},qf=e=>{e.inputs.length<2||R.size(e.inputs[1].dims)===0?of(e):e.compute(pl(e.inputs))}}),cl,fl,Wf,Gf,Sy=W(()=>{ne(),se(),Ee(),oe(),cl=e=>{if(!e||e.length!==2)throw new Error("Gather requires 2 inputs.")},fl=(e,t)=>{let r=e[0].dims,a=e[1].dims,n=r.length,i=R.normalizeAxis(t.axis,n),s=r.slice(0);s.splice(i,1,...a);let u=r[i],d=e[0].dataType===9?4:1,l=Math.ceil(R.size(s)/d),c=[{type:12,data:l},{type:6,data:u},{type:12,data:i},...te(e[0].dims,e[1].dims,s)],f=h=>{let g=P("data",e[0].dataType,e[0].dims.length,d),y=P("inputIndices",e[1].dataType,e[1].dims.length),b=Y("output",e[0].dataType,s.length,d),x=w=>{let k=a.length,S=`var indicesIndices${w}  = ${y.type.indices}(0);`;for(let I=0;I<k;I++)S+=`${k>1?`indicesIndices${w}[${I}]`:`indicesIndices${w}`} = ${s.length>1?`outputIndices${w}[uniforms.axis + ${I}]`:`outputIndices${w}`};`;S+=`
          var idx${w} = ${y.getByIndices(`indicesIndices${w}`)};
          if (idx${w} < 0) {
            idx${w} = idx${w} + uniforms.axisDimLimit;
          }
          var dataIndices${w} : ${g.type.indices};
        `;for(let I=0,C=0;I<n;I++)I===i?(S+=`${n>1?`dataIndices${w}[${I}]`:`dataIndices${w}`} = u32(idx${w});`,C+=k):(S+=`${n>1?`dataIndices${w}[${I}]`:`dataIndices${w}`} = ${s.length>1?`outputIndices${w}[${C}]`:`outputIndices${w}`};`,C++);return S},v;if(e[0].dataType===9){let w=(k,S,I="")=>`
          let outputIndices${S} = ${b.offsetToIndices(`outputOffset + ${S}u`)};
          ${x(S)};
          let offset${S} = ${g.indicesToOffset(`dataIndices${S}`)};
          let index${S} = offset${S} / 4u;
          let component${S} = offset${S} % 4u;
          ${k}[${S}] = ${I}(${g.getByOffset(`index${S}`)}[component${S}]);
        `;v=`
        let outputOffset = global_idx * ${d};
        var value = vec4<u32>(0);
        ${w("value",0,"u32")}
        ${w("value",1,"u32")}
        ${w("value",2,"u32")}
        ${w("value",3,"u32")}
        ${b.setByOffset("global_idx","value")}
      `}else v=`
      let outputIndices = ${b.offsetToIndices("global_idx")};
      ${x("")};
      let value = ${g.getByIndices("dataIndices")};
      ${b.setByOffset("global_idx","value")};
      `;return`
      ${h.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(g,y,b)}
      ${h.mainStart()}
        ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        ${v}
      }`};return{name:"Gather",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:s,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:c}),getShaderSource:f}},Wf=e=>be({axis:e.axis}),Gf=(e,t)=>{let r=e.inputs;cl(r),e.compute(fl(e.inputs,t))}}),hl,jf,Vf,ky=W(()=>{ne(),se(),oe(),hl=(e,t,r,a,n,i,s,u,d)=>{let l=[{type:12,data:i},{type:12,data:a},{type:12,data:n},{type:12,data:r},{type:12,data:s},{type:12,data:u},{type:12,data:d}],c=[i];l.push(...te(t.dims,c));let f=h=>{let g=P("indices_data",t.dataType,t.dims.length),y=Y("input_slice_offsets_data",12,1,1),b=[g,y],x=[{name:"output_size",type:"u32"},{name:"batch_dims",type:"u32"},{name:"input_dims",type:"u32",length:n.length},{name:"sizes_from_slice_dims_data",type:"u32",length:r.length},{name:"num_slices_per_batch",type:"u32"},{name:"input_batch_stride",type:"u32"},{name:"num_slice_dims",type:"u32"}];return`
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
  }`};return e.compute({name:"computeSliceOffsets",shaderCache:{hint:`${n.length}_${r.length}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:c,dataType:e.inputs[1].dataType}],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:l}),getShaderSource:f},{inputs:[t],outputs:[-1]})[0]},jf=(e,t)=>{let r=e.inputs,a=r[0].dims,n=r[0].dataType,i=r[1].dims,s=i[i.length-1],u=R.sizeToDimension(i,i.length-1),d=R.sizeFromDimension(a,t.batchDims+s),l=R.sizeToDimension(a,t.batchDims),c=R.sizeFromDimension(a,t.batchDims),f=u/l,h=new Array(s),g=d;for(let S=0;S<s;++S)h[s-1-S]=g,g*=a[t.batchDims+s-1-S];let y=hl(e,r[1],h,t.batchDims,a,u,f,c,s),b=t.batchDims+s;if(b>a.length)throw new Error("last dimension of indices must not be larger than rank of input tensor");let x=i.slice(0,-1).concat(a.slice(b)),v=R.size(x),w=[{type:12,data:v},{type:12,data:d},...te(r[0].dims,y.dims,x)],k=S=>{let I=P("data",r[0].dataType,r[0].dims.length),C=P("slice_offsets",12,y.dims.length),z=Y("output",r[0].dataType,x.length);return`
          ${S.registerUniform("output_size","u32").registerUniform("slice_size","u32").declareVariables(I,C,z)}
            ${S.mainStart()}
            ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let slice_offset = slice_offsets[global_idx / uniforms.slice_size];
          output[global_idx] = data[u32(slice_offset) + global_idx % uniforms.slice_size];
        }`};e.compute({name:"GatherND",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:x,dataType:n}],dispatchGroup:{x:Math.ceil(v/64)},programUniforms:w}),getShaderSource:k},{inputs:[r[0],y]})},Vf=e=>({batchDims:e.batch_dims,cacheKey:""})}),ml,gl,Hf,Ff,Iy=W(()=>{ne(),se(),Ee(),oe(),ml=(e,t)=>{if(e.length<3||e.length>4)throw new Error("GatherBlockQuantized requires 3 or 4 inputs.");let r=R.normalizeAxis(t.quantizeAxis,e[0].dims.length),a=t.blockSize,n=e[0],i=e[2],s=e.length===4?e[3]:void 0;if(i.dims.length!==n.dims.length||!n.dims.map((u,d)=>d===r?Math.ceil(u/a)===i.dims[d]:u===i.dims[d]).reduce((u,d)=>u&&d,!0))throw new Error("Scales must have the same rank as the input tensor and the dims should match except on gatherAxis.");if(s){if(s.dataType!==n.dataType)throw new Error("Zero point must have the same data type as the input tensor.");if(s.dims.length!==i.dims.length||!s.dims.map((u,d)=>u===i.dims[d]).reduce((u,d)=>u&&d,!0))throw new Error("Zero point must have the same rank as the input tensor and the dims should match except on quantizeAxis.")}},gl=(e,t)=>{let r=e[0].dims,a=e[1].dims,n=r.length,i=R.normalizeAxis(t.gatherAxis,n),s=R.normalizeAxis(t.quantizeAxis,n),u=r.slice(0);u.splice(i,1,...a);let d=R.size(u),l=e[2].dataType,c=e[0].dataType===22,f=[{type:12,data:d},{type:12,data:s},{type:12,data:i},{type:12,data:t.blockSize},...te(...e.map((g,y)=>g.dims),u)],h=g=>{let y=P("data",e[0].dataType,e[0].dims.length),b=P("inputIndices",e[1].dataType,e[1].dims.length),x=P("scales",e[2].dataType,e[2].dims.length),v=e.length>3?P("zeroPoint",e[3].dataType,e[3].dims.length):void 0,w=Y("output",l,u.length),k=[y,b,x];v&&k.push(v);let S=[{name:"output_size",type:"u32"},{name:"quantize_axis",type:"u32"},{name:"gather_axis",type:"u32"},{name:"block_size",type:"u32"}];return`
        ${g.registerUniforms(S).declareVariables(...k,w)}
        ${g.mainStart()}
        let output_indices = ${w.offsetToIndices("global_idx")};
        var indices_indices = ${b.type.indices}(0);
        ${a.length>1?`
          for (var i: u32 = 0; i < ${a.length}; i++) {
            let index = ${w.indicesGet("output_indices","uniforms.gather_axis + i")};
            ${b.indicesSet("indices_indices","i","index")};
          }`:`indices_indices = ${w.indicesGet("output_indices","uniforms.gather_axis")};`};
        var data_indices = ${y.type.indices}(0);
        for (var i: u32 = 0; i < uniforms.gather_axis; i++) {
          let index = ${w.indicesGet("output_indices","i")};
          ${y.indicesSet("data_indices","i","index")};
        }
        var index_from_indices = ${b.getByIndices("indices_indices")};
        if (index_from_indices < 0) {
          index_from_indices += ${r[i]};
        }
        ${y.indicesSet("data_indices","uniforms.gather_axis","u32(index_from_indices)")};
        for (var i = uniforms.gather_axis + 1; i < ${u.length}; i++) {
          let index = ${w.indicesGet("output_indices",`i + ${a.length} - 1`)};
          ${y.indicesSet("data_indices","i","index")};
        }
        let data_offset = ${y.indicesToOffset("data_indices")};
        let data_index = data_offset % 8;
        // Convert 4-bit packed data to 8-bit packed data.
        let packed_4bit_quantized_data = ${y.getByOffset("data_offset / 8")};
        let packed_8bit_quantized_data = (packed_4bit_quantized_data >> (4 * (data_index % 2))) & 0x0f0f0f0f;
        let quantized_data_vec = ${c?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_quantized_data));
        let quantized_data = quantized_data_vec[data_index / 2];
        var scale_indices = data_indices;
        let quantize_axis_index = ${x.indicesGet("data_indices","uniforms.quantize_axis")} / uniforms.block_size;
        ${x.indicesSet("scale_indices","uniforms.quantize_axis","quantize_axis_index")};
        var scale = ${x.getByIndices("scale_indices")};
        ${v?`
              let zero_point_indices = scale_indices;
              let zero_point_offset = ${v.indicesToOffset("zero_point_indices")};
              let zero_point_index = zero_point_offset % 8;
              let packed_4bit_zero_points = ${v.getByOffset("zero_point_offset / 8")};
              let packed_8bit_zero_points = (packed_4bit_zero_points >> (4 * (zero_point_index % 2))) & 0x0f0f0f0f;
              let zero_point_vec = ${c?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_zero_points));
              let zero_point = zero_point_vec[zero_point_index / 2];`:"var zero_point = 0"};
        let dequantized_data = ${Pe(l)}(quantized_data - zero_point) * scale;
        ${w.setByOffset("global_idx","dequantized_data")};
    }`};return{name:"GatherBlockQuantized",shaderCache:{hint:`${t.cacheKey};${e.filter((g,y)=>y!==1).map(g=>g.dims.join("_")).join(";")}`,inputDependencies:Array.from({length:e.length},(g,y)=>"rank")},getRunData:()=>({outputs:[{dims:u,dataType:l}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:f}),getShaderSource:h}},Hf=(e,t)=>{let r=e.inputs;ml(r,t),e.compute(gl(e.inputs,t))},Ff=e=>be({blockSize:e.blockSize,gatherAxis:e.gatherAxis,quantizeAxis:e.quantizeAxis})}),yl,_l,Kf,Zf,Ty=W(()=>{ne(),se(),Ee(),oe(),yl=e=>{if(!e||e.length!==2)throw new Error("GatherElements requires 2 inputs.");if(e[0].dims.length<1)throw new Error("GatherElements requires that the data input be rank >= 1.");if(e[0].dims.length!==e[1].dims.length)throw new Error(`GatherElements requires that the data input and
                     indices input tensors be of same rank.`)},_l=(e,t)=>{let r=e[0].dims,a=e[0].dataType,n=r.length,i=e[1].dims,s=e[1].dataType,u=R.normalizeAxis(t.axis,n),d=r[u],l=i.slice(0),c=R.size(l),f=P("input",a,n),h=P("indicesInput",s,i.length),g=Y("output",a,l.length),y=[{type:12,data:c},{type:6,data:d},{type:12,data:u}];return y.push(...te(r,i,l)),{name:"GatherElements",shaderCache:{inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:l,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:y}),getShaderSource:b=>`
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
  }`}},Kf=e=>be({axis:e.axis}),Zf=(e,t)=>{let r=e.inputs;yl(r),e.compute(_l(e.inputs,t))}}),bl,wl,Qf,Xf,Ey=W(()=>{ne(),se(),oe(),bl=e=>{if(!e)throw new Error("Input is missing");if(e.length<2||e.length>3)throw new Error("Invaid input number.");if(e.length===3&&e[2].dims.length>2)throw new Error("Invalid input shape of C");if(e[0].dataType!==e[1].dataType||e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("Input types are mismatched")},wl=(e,t)=>{let r=e[0].dims.slice(),a=e[1].dims.slice(),[n,i,s]=Fp.getShapeOfGemmResult(r,t.transA,a,t.transB,e.length===3?e[2].dims:void 0),u=[n,i];if(!u)throw new Error("Can't use gemm on the given tensors");let d=16,l=Math.ceil(i/d),c=Math.ceil(n/d),f=!0,h=R.size(u),g=[{type:12,data:f?l:h},{type:12,data:n},{type:12,data:i},{type:12,data:s},{type:1,data:t.alpha},{type:1,data:t.beta}],y=["type","type"];e.length===3&&(g.push(...te(e[2].dims)),y.push("rank")),g.push(...te(u));let b=v=>{let w="";t.transA&&t.transB?w="value += a[k * uniforms.M + m] * b[n * uniforms.K + k];":t.transA&&!t.transB?w="value += a[k * uniforms.M + m] * b[k * uniforms.N + n];":!t.transA&&t.transB?w="value += a[m * uniforms.K + k] * b[n * uniforms.K + k];":!t.transA&&!t.transB&&(w="value += a[m * uniforms.K + k] * b[k * uniforms.N + n];");let k=t.alpha===1?"":"value *= uniforms.alpha;",S=P("a",e[0].dataType,e[0].dims),I=P("b",e[1].dataType,e[1].dims),C=S.type.value,z=null,A=[S,I];e.length===3&&(z=P("c",e[2].dataType,e[2].dims.length),A.push(z));let O=Y("output",e[0].dataType,u.length);A.push(O);let G=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}];return`
  ${v.registerUniforms(G).declareVariables(...A)}

  ${v.mainStart()}
    ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let m = global_idx / uniforms.N;
    let n = global_idx % uniforms.N;

    var value = ${C}(0);
    for (var k: u32 = 0u; k < uniforms.K; k++) {
      ${w}
    }

    ${k}
    ${z!=null?`let cOffset = ${z.broadcastedIndicesToOffset("vec2(m, n)",O)}; value += ${C}(uniforms.beta) * ${z.getByOffset("cOffset")};`:""}
    output[global_idx] = value;
  }`},x=v=>{let w=P("a",e[0].dataType,e[0].dims),k=P("b",e[1].dataType,e[1].dims),S=null,I=[w,k];e.length===3&&(S=P("c",e[2].dataType,e[2].dims.length),I.push(S));let C=Y("output",e[0].dataType,u.length);I.push(C);let z=[{name:"num_tile_n",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}],A="",O="";t.transA&&t.transB?(O=`
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
      `,A="value += tile_a[local_id.y][k] * tile_b[k][local_id.x];");let G=t.alpha===1?"":"value *= uniforms.alpha;";return`
  ${v.registerUniforms(z).declareVariables(...I)}
  var<workgroup> tile_a: array<array<${w.type.storage}, ${d}>, ${d}>;
  var<workgroup> tile_b: array<array<${k.type.storage}, ${d}>, ${d}>;
  ${v.mainStart([d,d,1])}
    let tile_col_start = (workgroup_index % uniforms.num_tile_n) * ${d};
    let tile_row_start = (workgroup_index / uniforms.num_tile_n) * ${d};
    let num_tiles = (uniforms.K - 1) / ${d} + 1;
    var k_start = 0u;
    var value = ${C.type.value}(0);
    for (var t: u32 = 0u; t < num_tiles; t++) {
      ${O}
      k_start = k_start + ${d};
      workgroupBarrier();

      for (var k: u32 = 0u; k < ${d}; k++) {
        ${A}
      }
      workgroupBarrier();
    }

    ${G}
    let m = tile_row_start + local_id.y;
    let n = tile_col_start + local_id.x;
    ${S!=null?`let cOffset = ${S.broadcastedIndicesToOffset("vec2(m, n)",C)}; value += ${C.type.value}(uniforms.beta) * ${S.getByOffset("cOffset")};`:""}
    if (m < uniforms.M && n < uniforms.N) {
      output[m * uniforms.N + n] = value;
    }
  }`};return f?{name:"GemmShared",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:y},getRunData:()=>({outputs:[{dims:u,dataType:e[0].dataType}],dispatchGroup:{x:l*c},programUniforms:g}),getShaderSource:x}:{name:"Gemm",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:y},getRunData:()=>({outputs:[{dims:u,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:g}),getShaderSource:b}},Qf=e=>{let t=e.transA,r=e.transB,a=e.alpha,n=e.beta;return{transA:t,transB:r,alpha:a,beta:n,cacheKey:`${e.transA};${e.transB};${e.alpha===1}`}},Xf=(e,t)=>{bl(e.inputs),e.compute(wl(e.inputs,t))}}),ut,ft,zt,At,vl,$l,xl,Sl,kl,Il,Tl,El,Yf,Jf,Cy=W(()=>{ne(),se(),Ee(),oe(),[ut,ft,zt,At]=[0,1,2,3],vl=e=>{if(e[0].dims.length!==4)throw new Error("only 4-D tensor is supported.");if(e[0].dims.length!==e[1].dims.length)throw new Error("input dimensions must be equal to grid dimensions");if(e[0].dims.length-2!==e[1].dims[e[1].dims.length-1])throw new Error(`last dimension of grid must be equal to ${e[0].dims.length-2}`);if(e[0].dims[0]!==e[1].dims[0])throw new Error("grid batch size must match input batch size")},$l=`
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
`,xl=e=>`
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
`,Sl=e=>`
  fn gs_denormalize(n: f32, length: i32) -> f32 {
    ${e.alignCorners===0?`
    // alignCorners: false => [-1, 1] to [-0.5, length - 0.5]
    return ((n + 1.0) * f32(length) - 1.0) / 2.0;
    `:`
    // alignCorners: true => [-1, 1] to [0, length - 1]
    return (n + 1.0) / 2.0 * (f32(length - 1));
    `}
  }
`,kl=e=>`
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
`,Il=(e,t,r)=>`
  fn pixel_at_grid(r: i32, c: i32, H: i32, W: i32, batch: u32, channel: u32, border: vec4<f32>) -> ${t} {
     var pixel = ${t}(0);
     var indices = vec4<u32>(0);
     indices[${ut}] = batch;
     indices[${ft}] = channel;`+(()=>{switch(r.paddingMode){case"zeros":return`
          if (r >= 0 && r < H && c >=0 && c < W) {
            indices[${zt}] = u32(r);
            indices[${At}] = u32(c);
          } else {
            return ${t}(0);
          }
        `;case"border":return`
          indices[${zt}] = u32(clamp(r, 0, H - 1));
          indices[${At}] = u32(clamp(c, 0, W - 1));
        `;case"reflection":return`
          indices[${zt}] = gs_reflect(r, border[1], border[3]);
          indices[${At}] = gs_reflect(c, border[0], border[2]);
        `;default:throw new Error(`padding mode ${r.paddingMode} is not supported`)}})()+`
    return ${e.getByIndices("indices")};
  }
`,Tl=(e,t,r)=>(()=>{switch(r.mode){case"nearest":return`
          let result = pixel_at_grid(i32(round(y)), i32(round(x)), H_in, W_in, indices[${ut}], indices[${ft}], border);
        `;case"bilinear":return`
          let x1 = i32(floor(x));
          let y1 = i32(floor(y));
          let x2 = x1 + 1;
          let y2 = y1 + 1;

          let p11 = pixel_at_grid(y1, x1, H_in, W_in, indices[${ut}], indices[${ft}], border);
          let p12 = pixel_at_grid(y1, x2, H_in, W_in, indices[${ut}], indices[${ft}], border);
          let p21 = pixel_at_grid(y2, x1, H_in, W_in, indices[${ut}], indices[${ft}], border);
          let p22 = pixel_at_grid(y2, x2, H_in, W_in, indices[${ut}], indices[${ft}], border);

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
              p[h][w] = pixel_at_grid(h + y0, w + x0, H_in, W_in, indices[${ut}], indices[${ft}], border);
            }
          }

          let dx = x - f32(x0 + 1);
          let dy = y - f32(y0 + 1);
          let result = gs_bicubic_interpolate(p, dx, dy);
        `;default:throw new Error(`mode ${r.mode} is not supported`)}})()+`${e.setByOffset("global_idx","result")}`,El=(e,t)=>{let r=P("x",e[0].dataType,e[0].dims.length),a=[e[1].dims[0],e[1].dims[1],e[1].dims[2]],n=P("grid",e[1].dataType,a.length,2),i=[e[0].dims[0],e[0].dims[1],e[1].dims[1],e[1].dims[2]];t.format==="NHWC"&&(i=[e[0].dims[0],e[1].dims[1],e[1].dims[2],e[0].dims[3]],[ut,ft,zt,At]=[0,3,1,2]);let s=Y("output",e[0].dataType,i.length),u=r.type.value,d=R.size(i),l=[{type:12,data:d},...te(e[0].dims,a,i)],c=f=>`
  ${f.registerUniform("output_size","u32").declareVariables(r,n,s)}
  ${$l}
  ${xl(u)}
  ${Sl(t)}
  ${kl(t)}
  ${Il(r,u,t)}

  ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let H_in = i32(uniforms.x_shape[${zt}]);
      let W_in = i32(uniforms.x_shape[${At}]);

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
      var grid_indices = vec3<u32>(indices[${ut}], indices[${zt}], indices[${At}]);
      let nxy = ${n.getByIndices("grid_indices")};
      var x = gs_denormalize(f32(nxy[0]), W_in);
      var y = gs_denormalize(f32(nxy[1]), H_in);

      ${Tl(s,u,t)}
  }`;return{name:"GridSample",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:["type","type"]},getRunData:f=>{let h=R.size(i);return{outputs:[{dims:i,dataType:f[0].dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:l}},getShaderSource:c}},Yf=(e,t)=>{vl(e.inputs),e.compute(El(e.inputs,t))},Jf=e=>be({alignCorners:e.align_corners,mode:e.mode,paddingMode:e.padding_mode,format:e.format})}),Le,Cl,eh,na,zl,gr,th,rh=W(()=>{ne(),se(),Ee(),An(),Mn(),oe(),Et(),Le=(e,t)=>e.length>t&&e[t].dims.length>0?e[t]:void 0,Cl=(e,t)=>{let r=e[0],a=Le(e,1),n=Le(e,2),i=Le(e,3),s=Le(e,4),u=Le(e,5),d=Le(e,6),l=Le(e,7);if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let c=r.dims[0],f=r.dims[1],h=r.dims.length===3?r.dims[2]:t.numHeads*r.dims[4],g=f,y=0,b=0,x=Math.floor(h/t.numHeads);if(d&&l&&R.size(d.dims)&&R.size(l.dims)){if(d.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(d.dims[0]!==c||d.dims[1]!==t.numHeads||d.dims[3]!==x)throw new Error('Input "past_key" shape (batch_size, num_heads, past_sequence_length, head_size)');if(l.dims[0]!==c||l.dims[1]!==t.numHeads||l.dims[3]!==x)throw new Error('Input "past_value" shape (batch_size, num_heads, past_sequence_length, head_size)');if(d.dims[2]!==l.dims[2])throw new Error('Input "past_key" and "past_value" shall have same dim 2 (past_sequence_length)');if(l.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');y=d.dims[2],b=d.dims[2]}else if(d&&R.size(d.dims)||l&&R.size(l.dims))throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let v;if(a&&R.size(a.dims)>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(a.dims.length<3||a.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==a.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(a.dims.length===3){if(a.dims[2]!==r.dims[2])throw new Error('Input "query" and "key" shall have same dim 2 (hidden_size)');v=2,g=a.dims[1]}else if(a.dims.length===5){if(a.dims[2]!==t.numHeads||a.dims[3]!==2||a.dims[4]!==x)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(n)throw new Error('Expect "value" be none when "key" has packed kv format.');v=5,g=a.dims[1]}else{if(a.dims[1]!==t.numHeads||a.dims[3]!==x)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');v=0,g=a.dims[2]}}else{if(r.dims.length!==5)throw new Error('Input "query" is expected to have 5 dimensions when key is empty');if(r.dims[2]!==t.numHeads||r.dims[3]!==3)throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');v=3}if(i&&R.size(i.dims)>0){if(i.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimension');if(a&&a.dims.length===5&&a.dims[3]===2)throw new Error("bias is not allowed for packed kv.")}let w=y+g,k=0;if(s&&R.size(s.dims)>0){k=8;let z=s.dims;throw z.length===1?z[0]===c?k=1:z[0]===3*c+2&&(k=3):z.length===2&&z[0]===c&&z[1]===w&&(k=5),k===8?new Error('Input "key_padding_mask" shape shall be (batch_size) or (batch_size, total_sequence_length)'):new Error("Mask not supported")}let S=!1,I=h;if(n&&R.size(n.dims)>0){if(n.dims.length!==3&&n.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==n.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(n.dims.length===3){if(g!==n.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');I=n.dims[2]}else{if(g!==n.dims[2])throw new Error('Input "key" and "value" shall have the same dim 2 (kv_sequence_length)');I=n.dims[1]*n.dims[3],S=!0}}let C=!1;if(s&&R.size(s.dims)>0)throw new Error("Key padding mask is not supported");if(u&&R.size(u.dims)>0){if(u.dims.length!==4)throw new Error('Input "attention_bias" is expected to have 4 dimensions');if(u.dims[0]!==c||u.dims[1]!==t.numHeads||u.dims[2]!==f||u.dims[3]!==w)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:c,sequenceLength:f,pastSequenceLength:y,kvSequenceLength:g,totalSequenceLength:w,maxSequenceLength:b,inputHiddenSize:0,hiddenSize:h,vHiddenSize:I,headSize:x,vHeadSize:Math.floor(I/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:k,scale:t.scale,broadcastResPosBias:C,passPastInKv:S,qkvFormat:v}},eh=e=>be({...e}),na=be({perm:[0,2,1,3]}),zl=(e,t,r,a,n,i,s)=>{let u=[a,n,i],d=R.size(u),l=[{type:12,data:d},{type:12,data:s},{type:12,data:i}],c=f=>{let h=Y("qkv_with_bias",t.dataType,u),g=P("qkv",t.dataType,u),y=P("bias",r.dataType,u),b=[{name:"output_size",type:"u32"},{name:"bias_offset",type:"u32"},{name:"hidden_size",type:"u32"}];return`
  ${f.registerUniforms(b).declareVariables(g,y,h)}
  ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let bias_offset_idx = (global_idx % uniforms.hidden_size) + uniforms.bias_offset;

    qkv_with_bias[global_idx] = qkv[global_idx] + bias[bias_offset_idx];
  }`};return e.compute({name:"MultiHeadAttentionAddBias",shaderCache:{inputDependencies:["type","type"]},getRunData:()=>({outputs:[{dims:u,dataType:t.dataType,gpuDataType:0}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:l}),getShaderSource:c},{inputs:[t,r],outputs:[-1]})[0]},gr=(e,t,r,a,n,i,s,u)=>{let d=i;if(s&&R.size(s.dims)>0){if(a===1)throw new Error("AddBiasReshape is not implemented. Please export your model with packed QKV or KV");return d=zl(e,i,s,t,a,r*n,u),d=d.reshape([t,a,r,n]),r===1||a===1?d:e.compute(Ve(d,na.perm),{inputs:[d],outputs:[-1]})[0]}else return i.dims.length===3&&(d=i.reshape([t,a,r,n])),r===1||a===1?d:e.compute(Ve(d,na.perm),{inputs:[d],outputs:[-1]})[0]},th=(e,t)=>{let r=Cl(e.inputs,t),a=e.inputs[0],n=Le(e.inputs,1),i=Le(e.inputs,2),s=Le(e.inputs,3),u=Le(e.inputs,4),d=Le(e.inputs,5),l=Le(e.inputs,6),c=Le(e.inputs,7);if(a.dims.length===5)throw new Error("Packed QKV is not implemented");if((n==null?void 0:n.dims.length)===5)throw new Error("Packed KV is not implemented");let f=n&&i&&n.dims.length===4&&i.dims.length===4,h=gr(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,a,s,0);if(f)return br(e,h,n,i,u,void 0,l,c,d,r);if(!n||!i)throw new Error("key and value must be provided");let g=gr(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.headSize,n,s,r.hiddenSize),y=gr(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.vHeadSize,i,s,2*r.hiddenSize);br(e,h,g,y,u,void 0,l,c,d,r)}}),Al,Ol,Rl,Ml,pn,ih,ah,nh=W(()=>{ne(),se(),Ee(),oe(),Al=e=>{if(!e||e.length<1)throw new Error("too few inputs")},Ol=(e,t)=>{let r=[],a=t.numOutputs;return e[1].dims[0]>0&&(e[1].getBigInt64Array().forEach(n=>r.push(Number(n))),a=r.length),be({numOutputs:a,axis:t.axis,splitSizes:r})},Rl=e=>`
fn calculateOutputIndex(index: u32) -> u32 {
    for (var i: u32 = 0u; i < ${e}u; i += 1u ) {
    if (index < ${J("uniforms.size_in_split_axis","i",e)}) {
        return i;
    }
    }
    return ${e}u;
}`,Ml=e=>{let t=e.length,r=[];for(let a=0;a<t;++a){let n=e[a].setByIndices("indices","input[global_idx]");t===1?r.push(n):a===0?r.push(`if (output_number == ${a}u) { ${n} }`):a===t-1?r.push(`else { ${n} }`):r.push(`else if (output_number == ${a}) { ${n} }`)}return`
      fn writeBufferData(output_number: u32, indices: ${e[0].type.indices}, global_idx: u32) {
        ${r.join(`
`)}
      }`},pn=(e,t)=>{let r=e[0].dims,a=R.size(r),n=e[0].dataType,i=R.normalizeAxis(t.axis,r.length),s=new Array(t.numOutputs),u=P("input",n,r.length),d=new Array(t.numOutputs),l=[],c=[],f=0,h=[{type:12,data:a}];for(let y=0;y<t.numOutputs;y++){f+=t.splitSizes[y],d[y]=f;let b=r.slice();b[i]=t.splitSizes[y],c.push(b),s[y]=Y(`output${y}`,n,b.length),l.push({dims:c[y],dataType:e[0].dataType})}h.push({type:12,data:d},...te(r,...c));let g=y=>`
  ${y.registerUniform("input_size","u32").registerUniform("size_in_split_axis","u32",d.length).declareVariables(u,...s)}
  ${Rl(d.length)}
  ${Ml(s)}

  ${y.mainStart()}
    ${y.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.input_size")}

    var indices = ${u.offsetToIndices("global_idx")};
    var index = ${u.indicesGet("indices",i)};
    let output_number = calculateOutputIndex(index);
    if (output_number != 0) {
      index -= ${J("uniforms.size_in_split_axis","output_number - 1u",d.length)};
      ${u.indicesSet("indices",i,"index")};
    }
    writeBufferData(output_number, indices, global_idx);
  }`;return{name:"Split",shaderCache:{hint:t.cacheKey,inputDependencies:["rank"]},getShaderSource:g,getRunData:()=>({outputs:l,dispatchGroup:{x:Math.ceil(a/64)},programUniforms:h})}},ih=(e,t)=>{Al(e.inputs);let r=e.inputs.length===1?t:Ol(e.inputs,t);e.compute(pn(e.inputs,r),{inputs:[0]})},ah=e=>{let t=e.axis,r=e.splitSizes,a=e.numOutputs<0?r.length:e.numOutputs;if(a!==r.length)throw new Error("numOutputs and splitSizes lengh must be equal");return be({axis:t,numOutputs:a,splitSizes:r})}}),Bl,ti,sh,oh=W(()=>{ne(),se(),Ee(),oe(),Bl=(e,t)=>{let[r,a,n,i]=e,{numHeads:s,rotaryEmbeddingDim:u}=t;if(r.dims.length!==3&&r.dims.length!==4)throw new Error(`Input 'x' is expected to have 3 or 4 dimensions, got ${r.dims.length}`);if(!R.areEqual(a.dims,[])&&!R.areEqual(a.dims,[1])&&a.dims.length!==2)throw new Error(`Input 'position_ids' is expected to have 0, 1, or 2 dimensions, got ${a.dims.length}`);if(n.dims.length!==2)throw new Error(`Input 'cos_cache' is expected to have 2 dimensions, got ${n.dims.length}`);if(i.dims.length!==2)throw new Error(`Input 'sin_cache' is expected to have 2 dimensions, got ${i.dims.length}`);if(!R.areEqual(n.dims,i.dims))throw new Error("Inputs 'cos_cache' and 'sin_cache' are expected to have the same shape");if(u>0&&s===0)throw new Error("num_heads must be provided if rotary_embedding_dim is specified");let d=r.dims[0],l=r.dims[r.dims.length-2],c=n.dims[0],f=R.sizeFromDimension(r.dims,1)/l,h=u===0?n.dims[1]*2:f/s;if(u>h)throw new Error("rotary_embedding_dim must be less than or equal to head_size");if(a.dims.length===2){if(d!==a.dims[0])throw new Error(`Input 'position_ids' dimension 0 should be of size batch_size, got ${a.dims[0]}`);if(l!==a.dims[1])throw new Error(`Input 'position_ids' dimension 1 should be of size sequence_length, got ${a.dims[1]}`)}if(h/2!==n.dims[1]&&u/2!==n.dims[1])throw new Error(`Input 'cos_cache' dimension 1 should be same as head_size / 2 or rotary_embedding_dim / 2, got ${n.dims[1]}`);if(l>c)throw new Error("Updating cos_cache and sin_cache in RotaryEmbedding is not currently supported")},ti=(e,t)=>{let{interleaved:r,numHeads:a,rotaryEmbeddingDim:n,scale:i}=t,s=e[0].dims[0],u=R.sizeFromDimension(e[0].dims,1),d=e[0].dims[e[0].dims.length-2],l=u/d,c=e[2].dims[1],f=n===0?c*2:l/a,h=new Array(s,d,l/f,f-c),g=R.computeStrides(h),y=[{type:1,data:i},{type:12,data:h},{type:12,data:g},...e[0].dims.length===3?new Array({type:12,data:[u,l,f,1]}):[],...e[0].dims.length===4?new Array({type:12,data:[u,f,d*f,1]}):[],...te(e[0].dims,e[1].dims,e[2].dims,e[3].dims,e[0].dims)],b=x=>{let v=P("input",e[0].dataType,e[0].dims.length),w=P("position_ids",e[1].dataType,e[1].dims.length),k=P("cos_cache",e[2].dataType,e[2].dims.length),S=P("sin_cache",e[3].dataType,e[3].dims.length),I=Y("output",e[0].dataType,e[0].dims.length);return x.registerUniforms([{name:"scale",type:"f32"},{name:"global_shape",type:"u32",length:h.length},{name:"global_strides",type:"u32",length:g.length},{name:"input_output_strides",type:"u32",length:g.length}]),`
        ${x.declareVariables(v,w,k,S,I)}

        ${x.mainStart(Zt)}
          let half_rotary_emb_dim = uniforms.${k.name}_shape[1];
          let bsnh = global_idx / uniforms.global_strides % uniforms.global_shape;
          let size = uniforms.global_shape[0] * uniforms.global_strides[0];
          ${x.guardAgainstOutOfBoundsWorkgroupSizes("size")}

          if (bsnh[3] < half_rotary_emb_dim) {
            let position_ids_idx =
                ${w.broadcastedIndicesToOffset("bsnh.xy",Y("",w.type.tensor,2))};
            let position_id =
                u32(${w.getByOffset("position_ids_idx")}) + select(0, bsnh[1], position_ids_idx == 0);
            let i = dot(bsnh, uniforms.input_output_strides) + select(0, bsnh[3], ${r});
            let j = i + select(half_rotary_emb_dim, 1, ${r});
            let re = ${v.getByOffset("i")} * ${k.get("position_id","bsnh[3]")} -
                ${v.getByOffset("j")} * ${S.get("position_id","bsnh[3]")};
            ${I.setByOffset("i","re")}
            let im = ${v.getByOffset("i")} * ${S.get("position_id","bsnh[3]")} +
                ${v.getByOffset("j")} * ${k.get("position_id","bsnh[3]")};
            ${I.setByOffset("j","im")}
          } else {
            let k = dot(bsnh, uniforms.input_output_strides) + half_rotary_emb_dim;
            ${I.setByOffset("k",v.getByOffset("k"))}
          }
        }`};return{name:"RotaryEmbedding",shaderCache:{hint:be({interleaved:r}).cacheKey,inputDependencies:["rank","rank","rank","rank"]},getShaderSource:b,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(R.size(h)/Zt)},programUniforms:y})}},sh=(e,t)=>{Bl(e.inputs,t),e.compute(ti(e.inputs,t))}}),Nl,Dl,sa,Pl,uh,zy=W(()=>{Ee(),ne(),Mn(),rh(),nh(),Et(),oh(),oe(),Nl=(e,t)=>{if(t.doRotary&&e.length<=7)throw new Error("cos_cache and sin_cache inputs are required if do_rotary is specified");let r=e[0],a=e[1],n=e[2],i=e[3],s=e[4];if(t.doRotary!==0&&e.length<=7)throw new Error("cos_cast and sin_cache are expected if do_rotary attribute is non-zero");if(t.localWindowSize!==-1)throw new Error("Local attention is not supported");if(t.softcap!==0)throw new Error("Softcap is not supported");if(t.rotaryInterleaved!==0)throw new Error("Rotary interleaved is not supported");if(t.smoothSoftmax)throw new Error("Smooth softmax is not supported");if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let u=!1,d=r.dims[0],l=r.dims[1],c=r.dims.length===3?u?r.dims[2]/3:r.dims[2]:t.numHeads*r.dims[4],f=l,h=0,g=!a||a.dims.length===0,y=Math.floor(g?c/(t.numHeads+2*t.kvNumHeads):c/t.numHeads);g&&(c=y*t.numHeads);let b=i&&i.dims.length!==0,x=s&&s.dims.length!==0;if(b&&i.dims.length===4&&i.dims[0]===d&&i.dims[1]!==t.kvNumHeads&&i.dims[2]===t.kvNumHeads&&i.dims[3]===y)throw new Error("BSNH pastKey/pastValue is not supported");if(b&&x){if(i.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(s.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');h=i.dims[2]}else if(b||x)throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let v=1;if(a&&a.dims.length>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(a.dims.length<3||a.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==a.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(a.dims.length===3){if(r.dims[2]%a.dims[2]!==0)throw new Error('Dimension 2 of "query" should be a multiple of "key"');f=a.dims[1]}else if(a.dims.length===5){if(a.dims[2]!==t.numHeads||a.dims[3]!==2||a.dims[4]!==y)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(n)throw new Error('Expect "value" be none when "key" has packed kv format.');f=a.dims[1]}else{if(a.dims[1]!==t.numHeads||a.dims[3]!==y)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');f=a.dims[2]}}else{if(r.dims.length!==3&&r.dims.length!==5)throw new Error('Input "query" is expected to have 3 or 5 dimensions when key is empty');if(r.dims.length===5&&(r.dims[2]!==t.numHeads||r.dims[3]!==3))throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');v=3}let w=0,k=!1,S=t.kvNumHeads?y*t.kvNumHeads:c;if(n&&n.dims.length>0){if(n.dims.length!==3&&n.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==n.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(n.dims.length===3){if(f!==n.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');S=n.dims[2]}else{if(f!==n.dims[2])throw new Error('Input "past_key" and "past_value" shall have the same dim 2 (kv_sequence_length)');S=n.dims[1]*n.dims[3],k=!0}}let I=e.length>4?e[5]:void 0;if(I&&I.dims.length!==1&&I.dims[0]!==d)throw new Error('Input "seqlens" is expected to have 1 dimension and the same dim 0 as batch_size');return{batchSize:d,sequenceLength:l,pastSequenceLength:h,kvSequenceLength:f,totalSequenceLength:-1,maxSequenceLength:-1,inputHiddenSize:0,hiddenSize:c,vHiddenSize:S,headSize:y,vHeadSize:Math.floor(S/t.kvNumHeads),numHeads:t.numHeads,kvNumHeads:t.kvNumHeads,nReps:t.numHeads/t.kvNumHeads,pastPresentShareBuffer:!1,maskType:w,scale:t.scale,broadcastResPosBias:!1,passPastInKv:k,qkvFormat:v}},Dl=be({perm:[0,2,1,3]}),sa=(e,t,r)=>{let a=t,n=r.kvNumHeads;return t.dims.length===3&&r.kvSequenceLength!==0&&(a=t.reshape([r.batchSize,r.kvSequenceLength,n,r.headSize]),a=e.compute(Ve(a,Dl.perm),{inputs:[a],outputs:[-1]})[0]),a},Pl=(e,t,r,a)=>{let n=7,i=["type","type"],s=[e*t],u=e*t,d=[{type:12,data:u},{type:12,data:t},{type:12,data:e}],l=c=>{let f=P("seq_lens",r.dataType,r.dims),h=P("total_seq_lens",a.dataType,a.dims),g=Y("pos_ids",n,s),y=[{name:"output_size",type:"u32"},{name:"sequence_length",type:"u32"},{name:"batch_size",type:"u32"}];return`
  ${c.registerUniforms(y).declareVariables(f,h,g)}
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
  `};return{name:"GeneratePositionIds",shaderCache:{hint:`${e};${t}`,inputDependencies:i},getRunData:()=>({outputs:[{dims:s,dataType:n}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:d}),getShaderSource:l}},uh=(e,t)=>{var S;let r=Nl(e.inputs,t);if(e.inputs[0].dims.length===5)throw new Error("Packed QKV is not implemented");if(((S=e.inputs[1])==null?void 0:S.dims.length)===5)throw new Error("Packed KV is not implemented");let a=e.inputs[0],n=e.inputs[1]&&e.inputs[1].dims.length>0?e.inputs[1]:void 0,i=e.inputs[2]&&e.inputs[2].dims.length>0?e.inputs[2]:void 0,s=e.inputs[3]&&e.inputs[3].dims.length!==0?e.inputs[3]:void 0,u=e.inputs[4]&&e.inputs[4].dims.length!==0?e.inputs[4]:void 0,d=e.inputs.length>4?e.inputs[5]:void 0,l=e.inputs.length>5?e.inputs[6]:void 0,c=r.kvNumHeads?r.kvNumHeads:r.numHeads,f=be({axis:2,numOutputs:3,splitSizes:[r.numHeads*r.headSize,c*r.headSize,c*r.headSize]}),[h,g,y]=!n&&!i?e.compute(pn([a],f),{inputs:[a],outputs:[-1,-1,-1]}):[a,n,i],b,x;if(t.doRotary){let I=e.compute(Pl(r.batchSize,r.sequenceLength,d,l),{inputs:[d,l],outputs:[-1]})[0],C=e.inputs[7],z=e.inputs[8],A=be({interleaved:t.rotaryInterleaved!==0,numHeads:r.numHeads,rotaryEmbeddingDim:0,scale:t.scale}),O=[h,I,C,z],G=[-1];b=e.compute(ti(O,A),{inputs:O,outputs:G})[0],O.splice(0,1,g);let X=be({interleaved:t.rotaryInterleaved!==0,numHeads:r.kvNumHeads,rotaryEmbeddingDim:0,scale:t.scale});x=e.compute(ti(O,X),{inputs:O,outputs:G})[0]}let v=gr(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,t.doRotary?b:h,void 0,0),w=sa(e,t.doRotary?x:g,r),k=sa(e,y,r);br(e,v,w,k,void 0,void 0,s,u,void 0,r,d,l)}}),oa,Ll,Ul,lh,Ay=W(()=>{ne(),se(),Et(),oe(),oa=(e,t,r,a,n,i,s,u)=>{let d=Ie(i),l=d===1?"f32":`vec${d}f`,c=d===1?"vec2f":`mat2x${d}f`,f=n*s,h=64;f===1&&(h=256);let g=[n,s,i/d],y=[n,s,2],b=["rank","type","type"],x=[];x.push(...te(g,y));let v=w=>{let k=P("x",t.dataType,3,d),S=P("scale",r.dataType,r.dims),I=P("bias",a.dataType,a.dims),C=Y("output",1,3,2),z=[k,S,I,C];return`
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
      let sum_final = ${Tt("workgroup_shared[0][0]",d)} / f32(hight * ${d});
      let squared_sum_final = ${Tt("workgroup_shared[0][1]",d)} / f32(hight * ${d});

      let inv_std_dev = inverseSqrt(squared_sum_final - sum_final * sum_final + f32(${u}));
      let channel_scale = inv_std_dev * f32(scale[channel]);
      let channel_shift = f32(bias[channel]) - sum_final * channel_scale;
      output[workgroup_index] = vec2f(channel_scale, channel_shift);
    }
  }`};return e.compute({name:"InstanceNormComputeChannelScaleShift",shaderCache:{hint:`${d};${u};${h}`,inputDependencies:b},getRunData:()=>({outputs:[{dims:y,dataType:1}],dispatchGroup:{x:f},programUniforms:x}),getShaderSource:v},{inputs:[t,r,a],outputs:[-1]})[0]},Ll=(e,t,r)=>{let a=t[0].dims,n=a,i=2,s=a[0],u=a[1],d=R.sizeFromDimension(a,i),l=Ie(d),c=R.size(n)/l,f=oa(e,t[0],t[1],t[2],s,d,u,r.epsilon),h=[s,u,d/l],g=[s,u],y=["type","none"],b=x=>{let v=P("x",t[0].dataType,h.length,l),w=P("scale_shift",1,g.length,2),k=Y("output",t[0].dataType,h.length,l),S=[v,w,k];return`
  ${x.registerUniform("output_size","u32").declareVariables(...S)}
  ${x.mainStart()}
  ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let outputIndices = ${k.offsetToIndices("global_idx")};
      let batch = outputIndices[0];
      let channel = outputIndices[1];
      let scale_shift = ${w.getByIndices("vec2<u32>(batch, channel)")};
      let value = ${v.getByOffset("global_idx")} * ${k.type.value}(scale_shift.x) + ${k.type.value}(scale_shift.y);
      ${k.setByOffset("global_idx","value")};
  }`};e.compute({name:"InstanceNormalization",shaderCache:{hint:`${l}`,inputDependencies:y},getRunData:()=>({outputs:[{dims:n,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:[{type:12,data:c},...te(h,g,h)]}),getShaderSource:b},{inputs:[t[0],f]})},Ul=(e,t,r)=>{let a=t[0].dims,n=a,i=a[0],s=a[a.length-1],u=R.sizeFromDimension(a,1)/s,d=Ie(s),l=R.size(n)/d,c=[{type:12,data:u},{type:12,data:Math.floor(s/d)}],f=["type","type"],h=!1,g=[0,a.length-1];for(let v=0;v<a.length-2;v++)h=h||a[v+1]!==1,g.push(v+1);h=h&&a[a.length-1]!==1;let y=h?e.compute(Ve(e.inputs[0],g),{inputs:[e.inputs[0]],outputs:[-1]})[0]:e.inputs[0].reshape(Array.from({length:a.length},(v,w)=>a[g[w]])),b=oa(e,y,t[1],t[2],i,u,s,r.epsilon),x=v=>{let w=Oe(t[0].dataType),k=d===1?"vec2f":`mat${d}x2f`,S=z=>{let A=z===0?"x":"y",O=d===1?"f32":`vec${d}f`;switch(d){case 1:return`${w}(${O}(scale.${A}))`;case 2:return`vec2<${w}>(${O}(scale[0].${A}, scale[1].${A}))`;case 4:return`vec4<${w}>(${O}(scale[0].${A}, scale[1].${A}, scale[2].${A}, scale[3].${A}))`;default:throw new Error(`Not supported compoents ${d}`)}},I=P("input",t[0].dataType,t[0].dims,d),C=Y("output",t[0].dataType,n,d);return`
  @group(0) @binding(0) var<storage, read> input : array<${I.type.storage}>;
  @group(0) @binding(1) var<storage, read> scale_input : array<${k}>;
  @group(0) @binding(2) var<storage, read_write> output : array<${C.type.storage}>;
  struct Uniforms {H: u32, C : u32};
  @group(0) @binding(3) var<uniform> uniforms: Uniforms;

  ${v.mainStart()}
    let current_image_number = global_idx / (uniforms.C * uniforms.H);
    let current_channel_number = global_idx % uniforms.C;

    let scale_offset = current_image_number * uniforms.C + current_channel_number;
    let scale = scale_input[scale_offset];
    output[global_idx] = fma(input[global_idx], ${S(0)}, ${S(1)});
  }`};e.compute({name:"InstanceNormalizationNHWC",shaderCache:{hint:`${d}`,inputDependencies:f},getRunData:()=>({outputs:[{dims:n,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:c}),getShaderSource:x},{inputs:[t[0],b]})},lh=(e,t)=>{t.format==="NHWC"?Ul(e,e.inputs,t):Ll(e,e.inputs,t)}}),ql,Wl,dh,Oy=W(()=>{ne(),se(),oe(),ql=e=>{if(!e||e.length<2)throw new Error("layerNorm requires at least 2 inputs.")},Wl=(e,t,r)=>{let a=t.simplified,n=e[0].dims,i=e[1],s=!a&&e[2],u=n,d=R.normalizeAxis(t.axis,n.length),l=R.sizeToDimension(n,d),c=R.sizeFromDimension(n,d),f=R.size(i.dims),h=s?R.size(s.dims):0;if(f!==c||s&&h!==c)throw new Error(`Size of X.shape()[axis:] == ${c}.
       Size of scale and bias (if provided) must match this.
       Got scale size of ${f} and bias size of ${h}`);let g=[];for(let I=0;I<n.length;++I)I<d?g.push(n[I]):g.push(1);let y=Ie(c),b=["type","type"],x=[{type:12,data:l},{type:1,data:c},{type:12,data:Math.floor(c/y)},{type:1,data:t.epsilon}];s&&b.push("type");let v=r>1,w=r>2,k=I=>{let C=Oe(e[0].dataType),z=[P("x",e[0].dataType,e[0].dims,y),P("scale",i.dataType,i.dims,y)];s&&z.push(P("bias",s.dataType,s.dims,y)),z.push(Y("output",e[0].dataType,u,y)),v&&z.push(Y("mean_data_output",1,g)),w&&z.push(Y("inv_std_output",1,g));let A=[{name:"norm_count",type:"u32"},{name:"norm_size",type:"f32"},{name:"norm_size_vectorized",type:"u32"},{name:"epsilon",type:"f32"}];return`
  ${I.registerUniforms(A).declareVariables(...z)}
  ${I.mainStart()}
    ${I.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.norm_count")}
    let offset = global_idx * uniforms.norm_size_vectorized;
    var mean_vector = ${tn("f32",y)};
    var mean_square_vector = ${tn("f32",y)};

    for (var h: u32 = 0u; h < uniforms.norm_size_vectorized; h++) {
      let value = ${Ft(C,y,"x[h + offset]")};
      mean_vector += value;
      mean_square_vector += value * value;
    }
    let mean = ${Tt("mean_vector",y)} / uniforms.norm_size;
    let inv_std_dev = inverseSqrt(${Tt("mean_square_vector",y)} / uniforms.norm_size ${a?"":"- mean * mean"} + uniforms.epsilon);

    for (var j: u32 = 0; j < uniforms.norm_size_vectorized; j++) {
      let f32input = ${Ft(C,y,"x[j + offset]")};
      let f32scale = ${Ft(C,y,"scale[j]")};
      output[j + offset] = ${z[0].type.value}((f32input ${a?"":"- mean"}) * inv_std_dev * f32scale
        ${s?`+ ${Ft(C,y,"bias[j]")}`:""}
      );
    }

    ${v?"mean_data_output[global_idx] = mean":""};
    ${w?"inv_std_output[global_idx] = inv_std_dev":""};
  }`},S=[{dims:u,dataType:e[0].dataType}];return v&&S.push({dims:g,dataType:1}),w&&S.push({dims:g,dataType:1}),{name:"LayerNormalization",shaderCache:{hint:`${y};${r};${a}`,inputDependencies:b},getRunData:()=>({outputs:S,dispatchGroup:{x:Math.ceil(l/64)},programUniforms:x}),getShaderSource:k}},dh=(e,t)=>{ql(e.inputs),e.compute(Wl(e.inputs,t,e.outputCount))}}),Gl,ph,Ry=W(()=>{se(),Ln(),Un(),Gl=e=>{if(!e||e.length!==2)throw new Error("MatMul requires 2 inputs.");if(e[0].dims[e[0].dims.length-1]!==e[1].dims[e[1].dims.length-2])throw new Error("shared dimension does not match.")},ph=e=>{Gl(e.inputs);let t=Kt.calcShape(e.inputs[0].dims,e.inputs[1].dims,!0);if(!t)throw new Error("Can't use matmul on the given tensors");let r=t[t.length-1],a=e.inputs[0].dims[e.inputs[0].dims.length-1];if(r<8&&a<8)e.compute(Pn(e.inputs,{activation:""},t));else{let n=t[t.length-2],i=R.size(e.inputs[0].dims.slice(0,-2)),s=R.size(e.inputs[1].dims.slice(0,-2));if(i!==1&&n===1&&s===1){let u=e.inputs[0].reshape([1,i,a]),d=e.inputs[1].reshape([1,a,r]),l=[1,i,r],c=[u,d];e.compute(ei(c,{activation:""},t,l),{inputs:c})}else e.compute(ei(e.inputs,{activation:""},t))}}}),jl,Vl,Hl,ch,fh,My=W(()=>{ne(),se(),Ee(),oe(),jl=(e,t)=>{if(e.length<3||e.length>4)throw new Error("MatMulNBits requires 3 or 4 inputs");let r=e[0],a=r.dims.length;if(r.dims[a-1]!==t.k)throw new Error("The last dim of input shape does not match the k value");let n=Math.floor((t.k+t.blockSize-1)/t.blockSize),i=t.blockSize/8*t.bits,s=e[1];if(!R.areEqual(s.dims,[t.n,n,i]))throw new Error("The second inputs must be 3D tensor with shape N X nBlocksPerCol X blobSize");let u=e[2].dims;if(R.size(u)!==t.n*n)throw new Error("scales input size error.");if(e.length===4){let d=e[3].dims,l=t.bits>4?t.n*n:t.n*Math.floor((n+1)/2);if(R.size(d)!==l)throw new Error("zeroPoints input size error.")}},Vl=(e,t)=>{let r=e[0].dims,a=r.length,n=r[a-2],i=t.k,s=t.n,u=r.slice(0,a-2),d=R.size(u),l=e[1].dims[2]/4,c=e[0].dataType,f=Ie(t.k),h=Ie(l),g=Ie(s),y=u.concat([n,s]),b=n>1&&s/g%2===0?2:1,x=R.size(y)/g/b,v=64,w=[],k=[d,n,i/f],S=R.convertShape(e[1].dims).slice();S.splice(-1,1,l/h),w.push(...te(k)),w.push(...te(S)),w.push(...te(e[2].dims)),e.length===4&&w.push(...te(R.convertShape(e[3].dims)));let I=[d,n,s/g];w.push(...te(I));let C=z=>{let A=k.length,O=P("a",e[0].dataType,A,f),G=P("b",12,S.length,h),X=P("scales",e[2].dataType,e[2].dims.length),K=[O,G,X],F=e.length===4?P("zero_points",12,e[3].dims.length):void 0;F&&K.push(F);let Z=I.length,ie=Y("output",e[0].dataType,Z,g),H=Oe(e[0].dataType),j=(()=>{switch(f){case 1:return`array<${H}, 8>`;case 2:return`mat4x2<${H}>`;case 4:return`mat2x4<${H}>`;default:throw new Error(`${f}-component is not supported.`)}})(),he=()=>{let E=`
          // reuse a data
            var input_offset = ${O.indicesToOffset(`${O.type.indices}(batch, row, word_offset)`)};
            var a_data: ${j};
            for (var j: u32 = 0; j < ${8/f}; j++) {
              a_data[j] = ${O.getByOffset("input_offset")};
              input_offset++;
            }
          `;for(let B=0;B<g*b;B++)E+=`
            b_value = ${h===1?`b${B}_data`:`b${B}_data[i]`};
            b_value_lower = unpack4xU8(b_value & b_mask);
            b_value_upper = unpack4xU8((b_value >> 4) & b_mask);
            b_quantized_values = ${j}(${Array.from({length:4},(L,Q)=>`${H}(b_value_lower[${Q}]), ${H}(b_value_upper[${Q}])`).join(", ")});
            b_dequantized_values = ${f===1?`${j}(${Array.from({length:8},(L,Q)=>`(b_quantized_values[${Q}] - ${F?`zero_point${B}`:"zero_point"}) * scale${B}`).join(", ")});`:`(b_quantized_values - ${j}(${Array(8).fill(`${F?`zero_point${B}`:"zero_point"}`).join(",")})) * scale${B};`};
            workgroup_shared[local_id.x * ${b} + ${Math.floor(B/g)}]${g>1?`[${B%g}]`:""} += ${Array.from({length:8/f},(L,Q)=>`${f===1?`a_data[${Q}] * b_dequantized_values[${Q}]`:`dot(a_data[${Q}], b_dequantized_values[${Q}])`}`).join(" + ")};
          `;return E},N=()=>{let E=`
            var col_index = col * ${g};
            ${F?`
            let zero_point_bytes_per_col = (nBlocksPerCol + 1) / 2;
            var zero_point_byte_count: u32;
            var zero_point_word_index: u32;
            var zero_point_byte_offset: u32;
            let zero_point_nibble_offset: u32 = block & 0x1u;
            var zero_point_bits_offset: u32;
            var zero_point_word: u32;`:`
            // The default zero point is 8 for unsigned 4-bit quantization.
            let zero_point = ${H}(8);`}
            `;for(let B=0;B<g*b;B++)E+=`
            let scale${B} = ${X.getByOffset("col_index * nBlocksPerCol + block")};
            ${F?`
            zero_point_byte_count = col_index * zero_point_bytes_per_col + (block >> 0x1u);
            zero_point_word_index = zero_point_byte_count >> 0x2u;
            zero_point_byte_offset = zero_point_byte_count & 0x3u;
            zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_nibble_offset << 2);
            zero_point_word = ${F.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point${B} = ${H}((zero_point_word) & 0xFu);`:""}
            col_index += 1;`;return E},M=()=>{let E=`col_index = col * ${g};`;for(let B=0;B<g*b;B++)E+=`
            let b${B}_data = ${G.getByIndices(`${G.type.indices}(col_index, block, word)`)};
            col_index += 1;`;return E+=`
            var b_value: u32;
            let b_mask: u32 = 0x0F0F0F0Fu;
            var b_value_lower: vec4<u32>;
            var b_value_upper: vec4<u32>;
            var b_quantized_values: ${j};
            var b_dequantized_values: ${j};`,E};return`
        var<workgroup> workgroup_shared: array<${ie.type.value}, ${b*v}>;
        ${z.declareVariables(...K,ie)}
        ${z.mainStart([v,1,1])}
          let output_indices = ${ie.offsetToIndices(`(global_idx / ${v}) * ${b}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let nBlocksPerCol = uniforms.b_shape[1];

          for (var block = local_id.x; block < nBlocksPerCol; block += ${v}) {
            //process one block
            var word_offset: u32 = block * ${t.blockSize/f};
            ${N()}
            for (var word: u32 = 0; word < ${l}; word += ${h}) {
              ${M()}
              for (var i: u32 = 0; i < ${h}; i++) {
                ${he()}
                word_offset += ${8/f};
              }
            }
          }
          workgroupBarrier();

          if (local_id.x < ${b}) {
            var output_value: ${ie.type.value} = ${ie.type.value}(0);
            var workgroup_shared_offset: u32 = local_id.x;
            for (var b: u32 = 0u; b < ${v}u; b++) {
              output_value += workgroup_shared[workgroup_shared_offset];
              workgroup_shared_offset += ${b};
            }
            ${ie.setByIndices(`${ie.type.indices}(batch, row, col + local_id.x)`,"output_value")};
          }
        }`};return{name:"MatMulNBits",shaderCache:{hint:`${t.blockSize};${t.bits};${f};${h};${g};${b};${v}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:y,dataType:c}],dispatchGroup:{x},programUniforms:w}),getShaderSource:C}},Hl=(e,t)=>{let r=e[0].dims,a=r.length,n=r[a-2],i=t.k,s=t.n,u=r.slice(0,a-2),d=R.size(u),l=e[1].dims[2]/4,c=e[0].dataType,f=Ie(t.k),h=Ie(l),g=u.concat([n,s]),y=128,b=s%8===0?8:s%4===0?4:1,x=y/b,v=x*h*8,w=v/f,k=v/t.blockSize,S=R.size(g)/b,I=[],C=[d,n,i/f],z=R.convertShape(e[1].dims).slice();z.splice(-1,1,l/h),I.push(...te(C)),I.push(...te(z)),I.push(...te(e[2].dims)),e.length===4&&I.push(...te(R.convertShape(e[3].dims)));let A=[d,n,s];I.push(...te(A));let O=G=>{let X=C.length,K=P("a",e[0].dataType,X,f),F=P("b",12,z.length,h),Z=P("scales",e[2].dataType,e[2].dims.length),ie=[K,F,Z],H=e.length===4?P("zero_points",12,e[3].dims.length):void 0;H&&ie.push(H);let j=A.length,he=Y("output",e[0].dataType,j),N=Oe(e[0].dataType),M=()=>{switch(f){case 1:return`
          let a_data0 = vec4<${N}>(sub_a[word_offset], sub_a[word_offset + 1], sub_a[word_offset + 2], sub_a[word_offset + 3]);
          let a_data1 = vec4<${N}>(sub_a[word_offset + 4], sub_a[word_offset + 5], sub_a[word_offset + 6], sub_a[word_offset + 7]);`;case 2:return`
          let a_data0 = vec4<${N}>(sub_a[word_offset], sub_a[word_offset + 1]);
          let a_data1 = vec4<${N}>(sub_a[word_offset + 2], sub_a[word_offset + 3]);`;case 4:return`
          let a_data0 = sub_a[word_offset];
          let a_data1 = sub_a[word_offset + 1];`;default:throw new Error(`${f}-component is not supported.`)}};return`
        var<workgroup> sub_a: array<${K.type.value}, ${w}>;
        var<workgroup> inter_results: array<array<${he.type.value}, ${x}>, ${b}>;
        ${G.declareVariables(...ie,he)}
        ${G.mainStart([x,b,1])}
          let output_indices = ${he.offsetToIndices(`workgroup_index * ${b}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let n_blocks_per_col = uniforms.b_shape[1];
          let num_tiles =  (n_blocks_per_col - 1) / ${k} + 1;

          // Loop over shared dimension.
          for (var tile: u32 = 0; tile < num_tiles; tile += 1) {
            let a_col_start = tile * ${w};
            // load one tile A data into shared memory.
            for (var a_offset = local_idx; a_offset < ${w}; a_offset += ${y})
            {
              let a_col = a_col_start + a_offset;
              if (a_col < uniforms.a_shape[2])
              {
                sub_a[a_offset] = ${K.getByIndices(`${K.type.indices}(batch, row, a_col)`)};
              } else {
                sub_a[a_offset] = ${K.type.value}(0);
              }
            }
            workgroupBarrier();

            // each thread process one block
            let b_row = col + local_id.y;
            let block = tile * ${k} + local_id.x;
            ${H?`
            let zero_point_bytes_per_col = (n_blocks_per_col + 1) / 2;
            let zero_point_byte_count = b_row * zero_point_bytes_per_col + (block >> 0x1u);
            let zero_point_word_index = zero_point_byte_count >> 0x2u;
            let zero_point_byte_offset = zero_point_byte_count & 0x3u;
            let zero_point_nibble_offset: u32 = block & 0x1u;
            let zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_nibble_offset << 2);
            let zero_point_word = ${H.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point = ${N}((zero_point_word) & 0xFu);`:`
            // The default zero point is 8 for unsigned 4-bit quantization.
            let zero_point = ${N}(8);`}
            let scale = ${Z.getByOffset("b_row * n_blocks_per_col + block")};
            let b_data = ${F.getByIndices(`${F.type.indices}(b_row, block, 0)`)};
            var word_offset = local_id.x * ${t.blockSize/f};
            for (var i: u32 = 0; i < ${h}; i++) {
              ${M()}
              let b_value = ${h===1?"b_data":"b_data[i]"};
              let b_value_lower = unpack4xU8(b_value & 0x0F0F0F0Fu);
              let b_value_upper = unpack4xU8((b_value >> 4) & 0x0F0F0F0Fu);
              let b_quantized_values = mat2x4<${N}>(${Array.from({length:4},(E,B)=>`${N}(b_value_lower[${B}]), ${N}(b_value_upper[${B}])`).join(", ")});
              let b_dequantized_values = (b_quantized_values - mat2x4<${N}>(${Array(8).fill("zero_point").join(",")})) * scale;
              inter_results[local_id.y][local_id.x] += ${Array.from({length:2},(E,B)=>`${`dot(a_data${B}, b_dequantized_values[${B}])`}`).join(" + ")};
              word_offset += ${8/f};
            }
            workgroupBarrier();
          }

          if (local_idx < ${b}) {
            var output_value: ${he.type.value} = ${he.type.value}(0);
            for (var b = 0u; b < ${x}; b++) {
              output_value += inter_results[local_idx][b];
            }
            if (col + local_idx < uniforms.output_shape[2])
            {
              ${he.setByIndices(`${he.type.indices}(batch, row, col + local_idx)`,"output_value")}
            }
          }
        }`};return{name:"BlockwiseMatMulNBits32",shaderCache:{hint:`${t.blockSize};${f};${h};${x};${b}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:g,dataType:c}],dispatchGroup:{x:S},programUniforms:I}),getShaderSource:O}},ch=(e,t)=>{jl(e.inputs,t),t.blockSize===32&&e.adapterInfo.isVendor("intel")&&e.adapterInfo.isArchitecture("gen-12lp")?e.compute(Hl(e.inputs,t)):e.compute(Vl(e.inputs,t))},fh=e=>be(e)}),Fl,Kl,Zl,Ql,Xl,Yl,Jl,ed,hh,By=W(()=>{ne(),se(),oe(),Fl=e=>{if(!e||e.length<1)throw new Error("Too few inputs");if(e[0].dataType!==1&&e[0].dataType!==10)throw new Error("Input type must be float or float16.");if(e.length>=2){let t=e[0].dims.length*2===e[1].dims[0];if(e.length===4&&(t=e[3].dims[0]*2===e[1].dims[0]),!t)throw new Error("The pads should be a 1D tensor of shape [2 * input_rank] or [2 * num_axes].")}},Kl=(e,t,r)=>{let a="";for(let n=t-1;n>=0;--n)a+=`
            k = i32(${e.indicesGet("indices",n)}) - ${J("uniforms.pads",n,r)};
            if (k < 0) {
              break;
            }
            if (k >= i32(${J("uniforms.x_shape",n,t)})) {
              break;
            }
            offset += k * i32(${J("uniforms.x_strides",n,t)});
        `;return`
          value = ${e.type.value}(uniforms.constant_value);
          for (var i = 0; i < 1; i++) {
            var offset = 0;
            var k = 0;
            ${a}
            value = x[offset];
          }
      `},Zl=(e,t,r)=>{let a="";for(let n=t-1;n>=0;--n)a+=`
                k = i32(${e.indicesGet("indices",n)}) - ${J("uniforms.pads",n,r)};
                if (k < 0) {
                  k = -k;
                }
                {
                  let _2n_1 = 2 * (i32(${J("uniforms.x_shape",n,t)}) - 1);
                  k = k % _2n_1;
                  if(k >= i32(${J("uniforms.x_shape",n,t)})) {
                    k = _2n_1 - k;
                  }
                }
                offset += k * i32(${J("uniforms.x_strides",n,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${a}
              value = x[offset];
          `},Ql=(e,t,r)=>{let a="";for(let n=t-1;n>=0;--n)a+=`
                k = i32(${e.indicesGet("indices",n)}) - ${J("uniforms.pads",n,r)};
                if (k < 0) {
                  k = 0;
                }
                if (k >= i32(${J("uniforms.x_shape",n,t)})) {
                  k = i32(${J("uniforms.x_shape",n,t)}) - 1;
                }
                offset += k * i32(${J("uniforms.x_strides",n,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${a}
              value = x[offset];
          `},Xl=(e,t,r)=>{let a="";for(let n=t-1;n>=0;--n)a+=`
                k = i32(${e.indicesGet("indices",n)}) - ${J("uniforms.pads",n,r)};
                if (k < 0)  {
                  k += i32(${J("uniforms.x_shape",n,t)}]);
                }
                if (k >= i32(${J("uniforms.x_shape",n,t)})) {
                  k -= i32(${J("uniforms.x_shape",n,t)});
                }
                offset += k * i32(${J("uniforms.x_strides",n,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${a}
              value = x[offset];
          `},Yl=(e,t,r)=>{switch(r.mode){case 0:return Kl(e,t,r.pads.length);case 1:return Zl(e,t,r.pads.length);case 2:return Ql(e,t,r.pads.length);case 3:return Xl(e,t,r.pads.length);default:throw new Error("Invalid mode")}},Jl=(e,t)=>{let r=R.padShape(e[0].dims.slice(),t.pads),a=e[0].dims,n=R.size(r),i=[{type:12,data:n},{type:6,data:t.pads}],s=e.length>=3&&e[2].data;t.mode===0&&i.push({type:s?e[2].dataType:1,data:t.value}),i.push(...te(e[0].dims,r));let u=["rank"],d=l=>{let c=Y("output",e[0].dataType,r.length),f=P("x",e[0].dataType,a.length),h=f.type.value,g=Yl(c,a.length,t),y=[{name:"output_size",type:"u32"},{name:"pads",type:"i32",length:t.pads.length}];return t.mode===0&&y.push({name:"constant_value",type:s?h:"f32"}),`
            ${l.registerUniforms(y).declareVariables(f,c)}
            ${l.mainStart()}
            ${l.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

            let indices = ${c.offsetToIndices("global_idx")};

            var value = ${h}(0);
            ${g}
            output[global_idx] = value;
        }`};return{name:"Pad",shaderCache:{hint:`${t.mode}${s}`,inputDependencies:u},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(R.size(r)/64)},programUniforms:i}),getShaderSource:d}},ed=(e,t)=>{if(e.length>1){let r=e[1].getBigInt64Array(),a=e.length>=3&&e[2].data?e[2].dataType===10?e[2].getUint16Array()[0]:e[2].getFloat32Array()[0]:0,n=e[0].dims.length,i=new Int32Array(2*n).fill(0);if(e.length>=4){let u=e[3].getBigInt64Array();for(let d=0;d<u.length;d++)i[Number(u[d])]=Number(r[d]),i[Number(u[d])+n]=Number(r[d+u.length])}else r.forEach((u,d)=>i[Number(d)]=Number(u));let s=[];return i.forEach(u=>s.push(u)),{mode:t.mode,value:a,pads:s}}else return t},hh=(e,t)=>{Fl(e.inputs);let r=ed(e.inputs,t);e.compute(Jl(e.inputs,r),{inputs:[0]})}}),ur,ua,la,da,pa,td,rd,ca,fa,mh,gh,ha,yh,_h,ma,bh,wh,vh,$h,Ny=W(()=>{at(),ne(),se(),oe(),ur=e=>{if(Se.webgpu.validateInputContent&&(!e||e.length!==1))throw new Error("Pool ops requires 1 input.")},ua=(e,t,r)=>{let a=t.format==="NHWC",n=e.dims.slice();a&&n.splice(1,0,n.pop());let i=Object.hasOwnProperty.call(t,"dilations"),s=t.kernelShape.slice(),u=t.strides.slice(),d=i?t.dilations.slice():[],l=t.pads.slice();Yr.adjustPoolAttributes(r,n,s,u,d,l);let c=Yr.computePoolOutputShape(r,n,u,d,s,l,t.autoPad),f=Object.assign({},t);i?Object.assign(f,{kernelShape:s,strides:u,pads:l,dilations:d,cacheKey:t.cacheKey}):Object.assign(f,{kernelShape:s,strides:u,pads:l,cacheKey:t.cacheKey});let h=c.slice();return h.push(h.splice(1,1)[0]),[f,a?h:c]},la=(e,t)=>{let r=t.format==="NHWC",a=R.size(e),n=R.size(t.kernelShape),i=[{type:12,data:a},{type:12,data:n}],s=[{name:"outputSize",type:"u32"},{name:"kernelSize",type:"u32"}];if(t.kernelShape.length<=2){let u=t.kernelShape[t.kernelShape.length-1],d=t.strides[t.strides.length-1],l=t.pads[t.pads.length/2-1],c=t.pads[t.pads.length-1],f=!!(l+c);i.push({type:12,data:u},{type:12,data:d},{type:12,data:l},{type:12,data:c}),s.push({name:"kw",type:"u32"},{name:"sw",type:"u32"},{name:"pwStart",type:"u32"},{name:"pwEnd",type:"u32"});let h=!1;if(t.kernelShape.length===2){let g=t.kernelShape[t.kernelShape.length-2],y=t.strides[t.strides.length-2],b=t.pads[t.pads.length/2-2],x=t.pads[t.pads.length-2];h=!!(b+x),i.push({type:12,data:g},{type:12,data:y},{type:12,data:b},{type:12,data:x}),s.push({name:"kh",type:"u32"},{name:"sh",type:"u32"},{name:"phStart",type:"u32"},{name:"phEnd",type:"u32"})}return[i,s,!0,f,h]}else{if(r)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let u=R.computeStrides(t.kernelShape);i.push({type:12,data:u},{type:12,data:t.pads},{type:12,data:t.strides}),s.push({name:"kernelStrides",type:"u32",length:u.length},{name:"pads",type:"u32",length:t.pads.length},{name:"strides",type:"u32",length:t.strides.length});let d=t.pads.reduce((l,c)=>l+c);return[i,s,!!d,!1,!1]}},da=(e,t,r,a,n,i,s,u,d,l,c,f)=>{let h=n.format==="NHWC",g=t.type.value,y=Y("output",t.type.tensor,a);if(n.kernelShape.length<=2){let b="",x="",v="",w=r-(h?2:1);if(c?b=`
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
                `,v=`
              }
            `}return`
            ${e.registerUniforms(d).declareVariables(t,y)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

              let indices = ${y.offsetToIndices("global_idx")};
              var xIndices = ${y.offsetToIndices("global_idx")};

              var value = ${g}(${u});
              var pad = 0;
              ${x}
              ${b}
              ${v}
              ${s}

              output[global_idx] = value;
            }`}else{if(h)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let b=n.kernelShape.length,x=n.pads.length,v="";return l?v=`
                if (xIndices[j] >= uniforms.x_shape[j]) {
                  pad++;
                  isPad = true;
                  break;
                }
              }
              if (!isPad) {
                let x_val = x[${t.indicesToOffset("xIndices")}];
                ${i}
              }`:v=`
              }
              let x_val = x[${t.indicesToOffset("xIndices")}];
              ${i}
            `,`
            ${e.registerUniforms(d).declareVariables(t,y)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
              let indices = ${y.offsetToIndices("global_idx")};
              var xIndices = ${y.offsetToIndices("global_idx")};

              var offsets: array<u32, ${b}>;

              var value = ${g}(${u});
              var pad = 0;
              var isPad = false;

              for (var i: u32 = 0u; i < uniforms.kernelSize; i++) {
                var offset = i;
                for (var j = 0u; j < ${b-1}u; j++) {
                  offsets[j] = offset / ${J("uniforms.kernelStrides","j",b)};
                  offset -= offsets[j] * ${J("uniforms.kernelStrides","j",b)};
                }
                offsets[${b-1}] = offset;

                isPad = false;
                for (var j = ${r-b}u; j < ${r}u; j++) {
                  xIndices[j] = indices[j] * ${J("uniforms.strides",`j - ${r-b}u`,b)}
                    + offsets[j - ${r-b}u] - ${J("uniforms.pads","j - 2u",x)};
                  ${v}
              }
              ${s}

              output[global_idx] = value;
            }`}},pa=e=>`${e.format};${e.ceilMode};${e.autoPad};${e.kernelShape.length}`,td=e=>`${pa(e)};${e.countIncludePad}`,rd=e=>`${pa(e)};${e.storageOrder};${e.dilations}`,ca=e=>({format:e.format,autoPad:["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],ceilMode:e.ceil_mode,kernelShape:e.kernel_shape,strides:e.strides,pads:e.pads}),fa=(e,t,r,a)=>{let[n,i]=ua(t,a,r),s=P("x",t.dataType,t.dims.length),u=s.type.value,d="value += x_val;",l="";n.countIncludePad?l+=`value /= ${u}(uniforms.kernelSize);`:l+=`value /= ${u}(i32(uniforms.kernelSize) - pad);`;let[c,f,h,g,y]=la(i,n);c.push(...te(t.dims,i));let b=["rank"];return{name:e,shaderCache:{hint:`${a.cacheKey};${h};${g};${y}`,inputDependencies:b},getRunData:()=>({outputs:[{dims:i,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(R.size(i)/64)},programUniforms:c}),getShaderSource:x=>da(x,s,t.dims.length,i.length,n,d,l,0,f,h,g,y)}},mh=e=>{let t=e.count_include_pad!==0,r=ca(e);if(r.ceilMode!==0)throw new Error("using ceil() in shape computation is not yet supported for AveragePool");let a={countIncludePad:t,...r,cacheKey:""};return{...a,cacheKey:td(a)}},gh=(e,t)=>{ur(e.inputs),e.compute(fa("AveragePool",e.inputs[0],!1,t))},ha={autoPad:"",ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[]},yh=e=>{let t=e.format;return{format:t,...ha,cacheKey:t}},_h=(e,t)=>{ur(e.inputs),e.compute(fa("GlobalAveragePool",e.inputs[0],!0,t))},ma=(e,t,r,a)=>{let[n,i]=ua(t,a,r),s=`
      value = max(x_val, value);
    `,u="",d=P("x",t.dataType,t.dims.length),l=["rank"],[c,f,h,g,y]=la(i,n);return c.push(...te(t.dims,i)),{name:e,shaderCache:{hint:`${a.cacheKey};${h};${g};${y}`,inputDependencies:l},getRunData:()=>({outputs:[{dims:i,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(R.size(i)/64)},programUniforms:c}),getShaderSource:b=>da(b,d,t.dims.length,i.length,n,s,u,t.dataType===10?-65504:-1e5,f,h,g,y)}},bh=(e,t)=>{ur(e.inputs),e.compute(ma("MaxPool",e.inputs[0],!1,t))},wh=e=>{let t=e.storage_order,r=e.dilations,a=ca(e);if(t!==0)throw new Error("column major storage order is not yet supported for MaxPool");if(a.ceilMode!==0)throw new Error("using ceil() in shape computation is not yet supported for MaxPool");let n={storageOrder:t,dilations:r,...a,cacheKey:""};return{...n,cacheKey:rd(n)}},vh=e=>{let t=e.format;return{format:t,...ha,cacheKey:t}},$h=(e,t)=>{ur(e.inputs),e.compute(ma("GlobalMaxPool",e.inputs[0],!0,t))}}),id,ad,xh,Sh,Dy=W(()=>{ne(),se(),Ee(),oe(),id=(e,t)=>{if(e.length<2||e.length>3)throw new Error("DequantizeLinear requires 2 or 3 inputs.");if(e.length===3&&e[1].dims===e[2].dims)throw new Error("x-scale and x-zero-point must have the same shape.");if(e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[0].dataType===6&&e.length>2)throw new Error("In the case of dequantizing int32 there is no zero point.");if(e[1].dims.length!==0&&e[1].dims.length!==1&&e[1].dims.length!==e[0].dims.length)throw new Error("scale input must be a scalar, a 1D tensor, or have the same rank as the input tensor.");if(e.length>2){if(e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==e[2].dims.length)throw new Error("scale and zero-point inputs must have the same rank.");if(!e[1].dims.map((r,a)=>r===e[2].dims[a]).reduce((r,a)=>r&&a,!0))throw new Error("scale and zero-point inputs must have the same shape.")}if(t.blockSize>0){if(e[1].dims.length===0||e[1].dims.length===1&&e[1].dims[0]===1)throw new Error("blockSize must be set only for block quantization.");if(!e[1].dims.map((n,i)=>i===t.axis||n===e[0].dims[i]).reduce((n,i)=>n&&i,!0))throw new Error("For block qunatization, scale input shape to match the input shape except for the axis");if(e[1].dims.length!==e[0].dims.length)throw new Error("For block qunatization the scale input rank must be the same as the x rank.");let r=e[0].dims[t.axis],a=e[1].dims[t.axis];if(t.blockSize<Math.ceil(r/a)||t.blockSize>Math.ceil(r/(a-1)-1))throw new Error("blockSize must be with in the range [ceil(dI / Si), ceil(dI / (Si - 1) - 1)].")}},ad=(e,t)=>{let r=R.normalizeAxis(t.axis,e[0].dims.length),a=e[0].dataType,n=a===3,i=e[0].dims,s=e[1].dataType,u=R.size(i),d=a===3||a===2,l=d?[Math.ceil(R.size(e[0].dims)/4)]:e[0].dims,c=e[1].dims,f=e.length>2?e[2]:void 0,h=f?d?[Math.ceil(R.size(f.dims)/4)]:f.dims:void 0,g=c.length===0||c.length===1&&c[0]===1,y=g===!1&&c.length===1,b=Ie(u),x=g&&(!d||b===4),v=x?b:1,w=x&&!d?b:1,k=P("input",d?12:a,l.length,w),S=P("scale",s,c.length),I=f?P("zero_point",d?12:a,h.length):void 0,C=Y("output",s,i.length,v),z=[k,S];I&&z.push(I);let A=[l,c];f&&A.push(h);let O=[{type:12,data:u/v},{type:12,data:r},{type:12,data:t.blockSize},...te(...A,i)],G=X=>{let K=[{name:"output_size",type:"u32"},{name:"axis",type:"u32"},{name:"block_size",type:"u32"}];return`
      ${X.registerUniforms(K).declareVariables(...z,C)}
      ${X.mainStart()}
          ${X.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let output_indices = ${C.offsetToIndices("global_idx")};

          // Set input x
          ${d?`
            let input = ${k.getByOffset("global_idx / 4")};
            let x_vec = ${n?"unpack4xI8(input)":"unpack4xU8(input)"};
            let x_value = ${v===1?"x_vec[global_idx % 4]":"x_vec"};`:`let x_value = ${k.getByOffset("global_idx")};`};

          // Set scale input
          ${g?`let scale_value= ${S.getByOffset("0")}`:y?`
            let scale_index = ${C.indicesGet("output_indices","uniforms.axis")};
            let scale_value= ${S.getByOffset("scale_index")};`:`
            var scale_indices: ${S.type.indices} = output_indices;
            let index = ${S.indicesGet("scale_indices","uniforms.axis")} / uniforms.block_size;
            ${S.indicesSet("scale_indices","uniforms.axis","index")};
            let scale_value= ${S.getByIndices("scale_indices")};`};

          // Set zero-point input
          ${I?g?d?`
                let zero_point_input = ${I.getByOffset("0")};
                let zero_point_vec =  ${n?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value= zero_point_vec[0]`:`let zero_point_value = ${I.getByOffset("0")}`:y?d?`
                let zero_point_index = ${C.indicesGet("output_indices","uniforms.axis")};
                let zero_point_input = ${I.getByOffset("zero_point_index / 4")};
                let zero_point_vec =  ${n?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_index % 4]`:`
                let zero_point_index = ${C.indicesGet("output_indices","uniforms.axis")};
                let zero_point_value = ${I.getByOffset("zero_point_index")};`:d?`
                let zero_point_offset = ${S.indicesToOffset("scale_indices")};
                let zero_point_input = ${I.getByOffset("zero_point_offset / 4")};
                let zero_point_vec = ${n?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_offset % 4];`:`let zero_point_value = ${I.getByIndices("scale_indices")};`:`let zero_point_value = ${d?n?"i32":"u32":k.type.value}(0);`};
      // Compute and write output
      ${C.setByOffset("global_idx",`${C.type.value}(x_value - zero_point_value) * scale_value`)};
      }`};return{name:"DequantizeLinear",shaderCache:{hint:t.cacheKey,inputDependencies:I?["rank","rank","rank"]:["rank","rank"]},getShaderSource:G,getRunData:()=>({outputs:[{dims:i,dataType:s}],dispatchGroup:{x:Math.ceil(u/v/64),y:1,z:1},programUniforms:O})}},xh=(e,t)=>{id(e.inputs,t),e.compute(ad(e.inputs,t))},Sh=e=>be({axis:e.axis,blockSize:e.blockSize})}),nd,sd,kh,Py=W(()=>{at(),ne(),oe(),nd=(e,t,r)=>{let a=e===t,n=e<t&&r<0,i=e>t&&r>0;if(a||n||i)throw new Error("Range these inputs' contents are invalid.")},sd=(e,t,r,a)=>{let n=Math.abs(Math.ceil((t-e)/r)),i=[n],s=n,u=[{type:12,data:s},{type:a,data:e},{type:a,data:r},...te(i)],d=l=>{let c=Y("output",a,i.length),f=c.type.value,h=[{name:"outputSize",type:"u32"},{name:"start",type:f},{name:"delta",type:f}];return`
        ${l.registerUniforms(h).declareVariables(c)}
        ${l.mainStart()}
        ${l.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        output[global_idx] = uniforms.start + ${f}(global_idx) * uniforms.delta;
      }`};return{name:"Range",shaderCache:{hint:`${a}`},getShaderSource:d,getRunData:()=>({outputs:[{dims:i,dataType:a}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:u})}},kh=e=>{let t=0,r=0,a=0;e.inputs[0].dataType===6?(t=e.inputs[0].getInt32Array()[0],r=e.inputs[1].getInt32Array()[0],a=e.inputs[2].getInt32Array()[0]):e.inputs[0].dataType===1&&(t=e.inputs[0].getFloat32Array()[0],r=e.inputs[1].getFloat32Array()[0],a=e.inputs[2].getFloat32Array()[0]),Se.webgpu.validateInputContent&&nd(t,r,a),e.compute(sd(t,r,a,e.inputs[0].dataType),{inputs:[]})}}),od,ga,ya,ud,Ih,Th,Ly=W(()=>{ne(),se(),Ee(),oe(),od=(e,t,r,a)=>{if(e!=="none"&&a!=="i32"&&a!=="u32"&&a!=="f32")throw new Error(`Input ${a} is not supported with reduction ${e}.`);let n=`{
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
                ${n}max(bitcast<f32>(oldValue), (${r}))${i}`;case"min":return a==="i32"||a==="u32"?`atomicMin(&${t}, bitcast<${a}>(${r}));`:`${n}min(bitcast<${a}>(oldValue), (${r}))${i}`;case"mul":return`${n}(bitcast<${a}>(oldValue) * (${r}))${i}`;default:throw new Error(`Reduction ${e} is not supported.`)}},ga=(e,t)=>`${e===1?`
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
    data_offset += u32((u32(index) * element_count_dim));`,ya=(e,t,r)=>`for (var i = 0u; i < uniforms.num_updates_elements; i++) {
        let value = updates[uniforms.num_updates_elements * ${r?"global_idx":"idx"} + i];
        ${od(e.reduction,"output[data_offset + i]","value",t)}
      }`,ud=(e,t)=>{let r=e[0].dims,a=e[1].dims,n=r,i=1,s=Math.ceil(R.size(a)/i),u=a[a.length-1],d=R.sizeFromDimension(r,u),l=R.sizeFromDimension(a,0)/u,c=[{type:12,data:s},{type:12,data:u},{type:12,data:d},...te(e[1].dims,e[2].dims,n)],f=h=>{let g=P("indices",e[1].dataType,e[1].dims.length),y=P("updates",e[2].dataType,e[2].dims.length,i),b=t.reduction!=="none"&&t.reduction!==""?ec("output",e[0].dataType,n.length):Y("output",e[0].dataType,n.length,i);return`
      ${h.registerUniform("output_size","u32").registerUniform("last_index_dimension","u32").registerUniform("num_updates_elements","u32").declareVariables(g,y,b)}
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
        ${ga(r.length,!1)}
      }
      ${ya(t,b.type.value,!1)}
    }
    return;
  }

  var data_offset = 0u;
  var indices_start = uniforms.last_index_dimension * global_idx;
  var indices_end = indices_start + uniforms.last_index_dimension;
  for (var i = indices_start; i < indices_end; i++) {
    var index = i32(indices[i].x);
    ${ga(r.length,!0)}
  }
  ${ya(t,b.type.value,!0)}
  }`};return{name:"ScatterND",shaderCache:{hint:`${t.cacheKey}_${t.reduction}`,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:c}),getShaderSource:f}},Ih=e=>be({reduction:e.reduction}),Th=(e,t)=>{e.compute(ud(e.inputs,t),{inputs:[e.inputs[1],e.inputs[2]],outputs:[]})}}),ld,dd,pd,_a,cd,fd,hd,md,gd,yd,_d,bd,ba,wd,vd,$d,xd,Sd,Eh,Ch,Uy=W(()=>{ne(),se(),Ee(),oe(),ld=(e,t)=>{if(e.every(r=>r>0||(()=>{throw new Error("Resize requires scales input values to be positive")})),e.length>0){if(t.mode==="linear"){if(!(e.length===2||e.length===3||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1||e.length===5&&e[0]===1&&e[1]===1))throw new Error(`For linear mode, Resize requires scales to be 2D, 3D, 4D with either two outermost or one innermost and
            one outermost scale values equal to 1, or 5D with two outermost scale values equal to 1`)}else if(t.mode==="cubic"&&!(e.length===2||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1))throw new Error("Resize requires scales input size to be 2 or 4 for cubic mode")}},dd=(e,t,r)=>{t.every(n=>n>=0&&n<r||(()=>{throw new Error("Resize requires axes input values to be positive and less than rank")}));let a=new Array(r).fill(1);return t.forEach((n,i)=>a[n]=e[i]),a},pd=(e,t,r,a,n,i)=>{let[s,u,d]=r>10?[1,2,3]:[-1,e.length>1?1:-1,-1],l=e[0].dims.length;if(s>0&&e.length>s&&e[s].dims.length>0)e[s].getFloat32Array().forEach(c=>i.push(c));else if(t.coordinateTransformMode==="tf_crop_and_resize")throw new Error("Resize requires RoI input to be specified when coordinateTransformMode is tfCropAndResize");if(u>0&&e.length>u&&e[u].dims.length===1&&e[u].dims[0]>0){if(e[u].getFloat32Array().forEach(c=>a.push(c)),a.length!==0&&a.length!==l&&r>=18&&a.length!==t.axes.length)throw new Error("Resize requires scales input size to be same as input rank or axes size for opset 18 and up");ld(a,t),t.axes.length>0&&dd(a,t.axes,l).forEach((c,f)=>a[f]=c)}if(d>0&&e.length>d&&e[d].dims.length===1&&e[d].dims[0]>0&&(e[d].getBigInt64Array().forEach(c=>n.push(Number(c))),n.length!==0&&n.length!==l&&r>=18&&n.length!==t.axes.length))throw new Error("Resize requires sizes input size to be same as input rank or axes size for opset 18 and up");if(t.axes.length>0){if(a.length!==0&&a.length!==t.axes.length)throw new Error('Resize requires "scales" input size to be of axes rank when axes attributes is specified');if(n.length!==0&&n.length!==t.axes.length)throw new Error('Resize requires "sizes" input size to be of rank axes rank when axes attributes is specified')}if(typeof a<"u"&&typeof n<"u"&&a.length>0&&n.length>l)throw new Error("Resize requires only of scales or sizes to be specified")},_a=(e,t,r,a)=>`
  // The whole part and the fractional part are calculated separately due to inaccuracy of floating
  // point division. As an example, f32(21) / f32(7) may evaluate to 2.99... instead of 3, causing an
  // offset-by-one error later in floor().
  let big = (${e}) * (${t});
  let whole = ${a}(big / (${r}));
  let fract = ${a}(big % (${r})) / ${a}(${r});
  return whole + fract;
`,cd=(e,t)=>`fn getOriginalCoordinateFromResizedCoordinate(xResized: u32, xScale: f32, lengthResized: u32,
     lengthOriginal: u32, roiStart: f32, roiEnd: f32) -> ${t} { `+(()=>{switch(e){case"asymmetric":return`
          if (xScale < 1.0 || floor(xScale) != xScale) {
            return ${t}(xResized) / ${t}(xScale);
          } else {
            ${_a("xResized","lengthOriginal","lengthResized",t)}
          }
        `;case"pytorch_half_pixel":return`if (lengthResized > 1) {
                    return (${t}(xResized) + 0.5) / ${t}(xScale) - 0.5;
                  } else {
                    return 0.0;
                  }`;case"tf_half_pixel_for_nn":return`return (${t}(xResized) + 0.5) / ${t}(xScale);`;case"align_corners":return`if (lengthResized == 1) {
                    return 0.0;
                  } else {
                    ${_a("xResized","lengthOriginal - 1","lengthResized - 1",t)}
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
                  return offset + ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;case"half_pixel":return`return ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;default:throw new Error(`Coordinate transform mode ${e} is not supported`)}})()+"}",fd=(e,t,r)=>`fn getNearestPixelFromOriginal(xOriginal: ${r}, isDownSample: bool) -> ${r} {`+(()=>{switch(e){case"round_prefer_ceil":return"if (fract(xOriginal) == 0.5) {             return ceil(xOriginal);           } else {             return round(xOriginal);           }";case"floor":return"return floor(xOriginal);";case"ceil":return"return ceil(xOriginal);";case"round_prefer_floor":return"if (fract(xOriginal) == 0.5) {                     return floor(xOriginal);                   } else {                     return round(xOriginal);                   }";case"simple":default:if(t<11)return"if (isDownSample)                     {                       return ceil(xOriginal);                     } else {                       return xOriginal;                     }";throw new Error(`Nearest mode ${e} is not supported`)}})()+"}",hd=(e,t,r)=>{let a=new Array(r).fill(0).concat(new Array(r).fill(1)),n=e.length===0?a:e.slice();return t.length>0?(t.forEach((i,s)=>{a[i]=n[s],a[s+r]=n[t.length+s]}),a):n},md=(e,t,r,a)=>{let n=[];if(r.length>0)if(a.length>0){if(e.forEach(i=>n.push(i)),Math.max(...a)>e.length)throw new Error("axes is out of bound");a.forEach((i,s)=>n[i]=r[s])}else r.forEach(i=>n.push(i));else{if(t.length===0)throw new Error("Resize requires either scales or sizes.");n=e.map((i,s)=>Math.round(i*t[s]))}return n},gd=(e,t,r)=>{let a=(()=>{switch(r.keepAspectRatioPolicy){case"not_larger":return r.axes.length>0?Math.min(...r.axes.map(i=>t[i]),Number.MAX_VALUE):Math.min(...t,Number.MAX_VALUE);case"not_smaller":return r.axes.length>0?Math.max(...r.axes.map(i=>t[i]),Number.MIN_VALUE):Math.max(...t,Number.MIN_VALUE);default:throw new Error(`Keep aspect ratio policy ${r.keepAspectRatioPolicy} is not supported`)}})();t.fill(1,0,t.length);let n=e.slice();return r.axes.length>0?(r.axes.forEach(i=>t[i]=a),r.axes.forEach(i=>n[i]=Math.round(e[i]*t[i]))):(t.fill(a,0,t.length),n.forEach((i,s)=>n[s]=Math.round(i*t[s]))),n},yd=(e,t,r,a,n)=>`
    fn calculateOriginalIndicesFromOutputIndices(output_indices: ${e.type.indices}) -> array<${e.type.value}, ${r.length}> {
      var original_indices: array<${e.type.value}, ${r.length}>;
      for (var i:u32 = 0; i < ${r.length}; i++) {
        var output_index = ${e.indicesGet("output_indices","i")};
        var scale = ${J("uniforms.scales","i",a)};
        var roi_low = ${J("uniforms.roi","i",n)};
        var roi_hi = ${J("uniforms.roi",`i + ${t.length}`,n)};
        if (scale == 1.0) {
          original_indices[i] = ${e.type.value}(output_index);
        } else {
          var input_shape_i = ${J("uniforms.input_shape","i",t.length)};
          var output_shape_i = ${J("uniforms.output_shape","i",r.length)};
          original_indices[i] = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                           input_shape_i, roi_low, roi_hi);
        }
      }
      return original_indices;
    }`,_d=(e,t,r,a,n,i,s)=>`
    fn calculateInputIndicesFromOutputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
      var input_indices: ${e.type.indices};
      for (var i:u32 = 0; i < ${a.length}; i++) {
        var output_index = ${t.indicesGet("output_indices","i")};
        var input_index: u32;
        var scale = ${J("uniforms.scales","i",n)};
        if (scale == 1.0) {
          input_index = output_index;
        } else {
          var roi_low = ${J("uniforms.roi","i",i)};
          var roi_hi = ${J("uniforms.roi",`i + ${r.length}`,i)};
          var input_shape_i = ${J("uniforms.input_shape","i",r.length)};
          var output_shape_i = ${J("uniforms.output_shape","i",a.length)};
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
    }`,bd=(e,t)=>`
    fn checkInputIndices(input_indices: ${e.type.indices}) -> bool {
      for (var i:u32 = 0; i < ${t.length}; i++) {
        var input_index = ${e.indicesGet("input_indices","i")};
        if (input_index < 0 || input_index >= ${J("uniforms.input_shape","i",t.length)}) {
          return false;
        }
      }
      return true;
    }`,ba=(e,t,r,a)=>e.rank>a?`
    ${e.indicesSet("input_indices",t,"channel")};
    ${e.indicesSet("input_indices",r,"batch")};
`:"",wd=(e,t,r,a,n)=>{let[i,s,u,d]=r.length===2?[-1,0,1,-1]:[0,2,3,1],l=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, row: u32, col: u32) -> ${l} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",s,`max(0, min(row, ${r[s]} - 1))`)};
      ${e.indicesSet("input_indices",u,`max(0, min(col, ${r[u]} - 1))`)};
      ${ba(e,d,i,2)}
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
    }`},vd=(e,t,r,a,n,i,s,u,d,l)=>{let c=r.length===2,[f,h]=c?[0,1]:[2,3],g=e.type.value,y=b=>{let x=b===f?"row":"col";return`
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
    ${y(f)};
    ${y(h)};
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
    `},$d=(e,t,r,a,n)=>{let[i,s,u,d,l]=r.length===3?[-1,0,1,2,-1]:[0,2,3,4,1],c=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, depth:u32, height: u32, width: u32) -> ${c} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",s,`max(0, min(depth, ${r[s]} - 1))`)};
      ${e.indicesSet("input_indices",u,`max(0, min(height, ${r[u]} - 1))`)};
      ${e.indicesSet("input_indices",d,`max(0, min(width, ${r[d]} - 1))`)};
      ${ba(e,l,i,3)}
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
    }`},xd=(e,t,r,a,n,i)=>{let s=e.dims,u=hd(i,t.axes,s.length),d=md(s,a,n,t.axes),l=a.slice();a.length===0&&(l=s.map((w,k)=>w===0?1:d[k]/w),t.keepAspectRatioPolicy!=="stretch"&&(d=gd(s,l,t)));let c=Y("output",e.dataType,d.length),f=P("input",e.dataType,s.length),h=R.size(d),g=s.length===d.length&&s.every((w,k)=>w===d[k]),y=t.coordinateTransformMode==="tf_crop_and_resize",b=t.extrapolationValue,x=f.type.value,v=w=>`
      ${g?"":`
      ${cd(t.coordinateTransformMode,x)};
      ${(()=>{switch(t.mode){case"nearest":return`
              ${bd(f,s)};
              ${fd(t.nearestMode,r,x)};
              ${_d(f,c,s,d,l.length,u.length,y)};
              `;case"linear":return`
              ${yd(c,s,d,l.length,u.length)};
              ${(()=>{if(s.length===2||s.length===4)return`${wd(f,c,s,y,b)}`;if(s.length===3||s.length===5)return`${$d(f,c,s,y,b)}`;throw Error("Linear mode only supports input dims 2, 3, 4 and 5 are supported in linear mode.")})()};
            `;case"cubic":return`
            ${(()=>{if(s.length===2||s.length===4)return`${vd(f,c,s,d,l,u,t.cubicCoeffA,y,t.extrapolationValue,t.excludeOutside)}`;throw Error("Cubic mode only supports input dims 2 and 4 are supported in linear mode.")})()};
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
      }`;return{name:"Resize",shaderCache:{hint:`${t.cacheKey}|${r}|${l.length>0?t.mode==="cubic"?l:l.length:""}|${n.length>0?n:""}|${u.length>0?u:""}|${g}|${t.mode==="nearest"?s.length:s}`,inputDependencies:["rank"]},getShaderSource:v,getRunData:()=>({outputs:[{dims:d,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:[{type:12,data:h},{type:1,data:l},{type:1,data:u},...te(s,d)]})}},Sd=e=>{let t=e.customDataBuffer;return new Uint32Array(t,t.byteOffset,1)[0]},Eh=(e,t)=>{let r=[],a=[],n=[],i=Sd(e);if(t.antialias!==0)throw Error("Only default value (0) for Antialias attribute is supported");pd(e.inputs,t,i,r,a,n),e.compute(xd(e.inputs[0],t,i,r,a,n),{inputs:[0]})},Ch=e=>{let t=e.antialias,r=e.axes,a=e.coordinateTransformMode,n=e.cubicCoeffA,i=e.excludeOutside!==0,s=e.extrapolationValue,u=e.keepAspectRatioPolicy,d=e.mode,l=e.nearestMode===""?"simple":e.nearestMode;return be({antialias:t,axes:r,coordinateTransformMode:a,cubicCoeffA:n,excludeOutside:i,extrapolationValue:s,keepAspectRatioPolicy:u,mode:d,nearestMode:l})}}),kd,Id,zh,qy=W(()=>{ne(),se(),oe(),kd=e=>{if(!e||e.length<3)throw new Error("layerNorm requires at least 3 inputs.");let t=e[0],r=e[1],a=e[2];if(t.dataType!==r.dataType||t.dataType!==a.dataType)throw new Error("All inputs must have the same data type");if(t.dims.length!==3&&t.dims.length!==2)throw new Error("Input must be 2D or 3D");if(r.dims.length!==3&&r.dims.length!==2)throw new Error("Skip must be 2D or 3D");let n=t.dims[t.dims.length-1],i=t.dims[t.dims.length-2];if(r.dims[r.dims.length-1]!==n)throw new Error("Skip must have the same hidden size as input");if(r.dims[r.dims.length-2]!==i)throw new Error("Skip must have the same sequence length as input");if(a.dims.length!==1)throw new Error("Gamma must be 1D");if(a.dims[a.dims.length-1]!==n)throw new Error("Gamma must have the same hidden size as input");if(e.length>3){let s=e[3];if(s.dims.length!==1)throw new Error("Beta must be 1D");if(s.dims[s.dims.length-1]!==n)throw new Error("Beta must have the same hidden size as input")}if(e.length>4){let s=e[4];if(s.dims.length!==1)throw new Error("Bias must be 1D");if(s.dims[s.dims.length-1]!==n)throw new Error("Bias must have the same hidden size as input")}},Id=(e,t,r,a)=>{let n=t.simplified,i=e[0].dims,s=R.size(i),u=i,d=s,l=i.slice(-1)[0],c=a?i.slice(0,-1).concat(1):[],f=!n&&e.length>3,h=e.length>4,g=a&&r>1,y=a&&r>2,b=r>3,x=64,v=Ie(l),w=[{type:12,data:d},{type:12,data:v},{type:12,data:l},{type:1,data:t.epsilon}],k=I=>{let C=[{name:"output_size",type:"u32"},{name:"components",type:"u32"},{name:"hidden_size",type:"u32"},{name:"epsilon",type:"f32"}],z=[P("x",e[0].dataType,e[0].dims,v),P("skip",e[1].dataType,e[1].dims,v),P("gamma",e[2].dataType,e[2].dims,v)];f&&z.push(P("beta",e[3].dataType,e[3].dims,v)),h&&z.push(P("bias",e[4].dataType,e[4].dims,v)),z.push(Y("output",e[0].dataType,u,v)),g&&z.push(Y("mean_output",1,c)),y&&z.push(Y("inv_std_output",1,c)),b&&z.push(Y("input_skip_bias_sum",e[0].dataType,u,v));let A=Oe(e[0].dataType),O=Oe(1,v);return`

      ${I.registerUniforms(C).declareVariables(...z)}
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
          let f32_value = ${Ft(A,v,"value")};
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
        let mean = ${Tt("sum",v)} / f32(uniforms.hidden_size);
        let inv_std_dev = inverseSqrt(${Tt("square_sum",v)} / f32(uniforms.hidden_size) ${n?"":"- mean * mean"} + uniforms.epsilon);
        ${g?"mean_output[global_idx] = mean;":""}
        ${y?"inv_std_output[global_idx] = inv_std_dev;":""}

        for (var i: u32 = 0; i < stride; i++) {
          output[offset + i] = (output[offset + i] ${n?"":`- ${A}(mean)`}) *
            ${A}(inv_std_dev) * gamma[offset1d + i]
            ${f?"+ beta[offset1d + i]":""};
        }
      }`},S=[{dims:u,dataType:e[0].dataType}];return r>1&&S.push({dims:c,dataType:1}),r>2&&S.push({dims:c,dataType:1}),r>3&&S.push({dims:i,dataType:e[0].dataType}),{name:"SkipLayerNormalization",shaderCache:{hint:`${v};${g};${y};${b}`,inputDependencies:e.map((I,C)=>"type")},getShaderSource:k,getRunData:()=>({outputs:S,dispatchGroup:{x:Math.ceil(d/l)},programUniforms:w})}},zh=(e,t)=>{kd(e.inputs);let r=[0];e.outputCount>1&&r.push(-3),e.outputCount>2&&r.push(-3),e.outputCount>3&&r.push(3),e.compute(Id(e.inputs,t,e.outputCount,!1),{outputs:r})}}),Td,lr,Ed,wa,Cd,zd,Ah,Oh,Wy=W(()=>{ne(),se(),Ee(),oe(),Td=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");if(t.axes.length!==0){if(t.axes.length!==t.starts.length||t.axes.length!==t.ends.length)throw new Error("axes, starts and ends must have the same length")}else if(t.starts.length!==t.ends.length)throw new Error("starts and ends must have the same length");e.slice(1).forEach((r,a)=>{if(e[a+1].dataType!==6&&e[a+1].dataType!==7)throw new Error(`Input ${a} must be an array of int32 or int64`)})},lr=(e,t)=>{let r=[];if(e.length>t)if(e[t].dataType===7)e[t].getBigInt64Array().forEach(a=>r.push(Number(a)));else if(e[t].dataType===6)e[t].getInt32Array().forEach(a=>r.push(Number(a)));else throw new Error(`Input ${t} must be an array of int32 or int64`);return r},Ed=(e,t)=>{if(e.length>1){let r=lr(e,1),a=lr(e,2),n=lr(e,3);return n.length===0&&(n=[...Array(e[0].dims.length).keys()]),be({starts:r,ends:a,axes:n})}else return t},wa=(e,t,r,a,n)=>{let i=e;return e<0&&(i+=r[a[t]]),n[t]<0?Math.max(0,Math.min(i,r[a[t]]-1)):Math.max(0,Math.min(i,r[a[t]]))},Cd=(e,t,r)=>`fn calculateInputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
          var input_indices: ${e.type.indices};
          var carry = 0u;
          for (var i = ${r.length}; i >= 0; i--) {
            let input_shape_i = ${J("uniforms.input_shape","i",r.length)};
            let steps_i = ${J("uniforms.steps","i",r.length)};
            let signs_i = ${J("uniforms.signs","i",r.length)};
            let starts_i = ${J("uniforms.starts","i",r.length)};
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
      }`,zd=(e,t)=>{let r=e[0].dims,a=R.size(r),n=t.axes.length>0?R.normalizeAxes(t.axes,r.length):[...Array(r.length).keys()],i=lr(e,4);i.forEach(v=>v!==0||(()=>{throw new Error("step cannot be 0")})),i.length===0&&(i=Array(n.length).fill(1));let s=t.starts.map((v,w)=>wa(v,w,r,n,i)),u=t.ends.map((v,w)=>wa(v,w,r,n,i));if(n.length!==s.length||n.length!==u.length)throw new Error("start, ends and axes should have the same number of elements");if(n.length!==r.length)for(let v=0;v<r.length;++v)n.includes(v)||(s.splice(v,0,0),u.splice(v,0,r[v]),i.splice(v,0,1));let d=i.map(v=>Math.sign(v));i.forEach((v,w,k)=>{if(v<0){let S=(u[w]-s[w])/v,I=s[w],C=I+S*i[w];s[w]=C,u[w]=I,k[w]=-v}});let l=r.slice(0);n.forEach((v,w)=>{l[v]=Math.ceil((u[v]-s[v])/i[v])});let c={dims:l,dataType:e[0].dataType},f=Y("output",e[0].dataType,l.length),h=P("input",e[0].dataType,e[0].dims.length),g=R.size(l),y=[{name:"outputSize",type:"u32"},{name:"starts",type:"u32",length:s.length},{name:"signs",type:"i32",length:d.length},{name:"steps",type:"u32",length:i.length}],b=[{type:12,data:g},{type:12,data:s},{type:6,data:d},{type:12,data:i},...te(e[0].dims,l)],x=v=>`
      ${v.registerUniforms(y).declareVariables(h,f)}
        ${Cd(h,f,r)}
        ${v.mainStart()}
          ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
          let output_indices = ${f.offsetToIndices("global_idx")};
          let input_indices = calculateInputIndices(output_indices);
          ${f.setByOffset("global_idx",h.getByIndices("input_indices"))}
      }`;return{name:"Slice",shaderCache:{hint:`${d.length}_${s.length}_${i.length}`,inputDependencies:["rank"]},getShaderSource:x,getRunData:()=>({outputs:[c],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:b})}},Ah=(e,t)=>{Td(e.inputs,t);let r=Ed(e.inputs,t);e.compute(zd(e.inputs,r),{inputs:[0]})},Oh=e=>{let t=e.starts,r=e.ends,a=e.axes;return be({starts:t,ends:r,axes:a})}}),Ad,Od,Rh,Mh,Gy=W(()=>{ne(),se(),Ee(),Et(),oe(),Ad=e=>{if(!e||e.length!==1)throw new Error("Softmax op requires 1 input.")},Od=(e,t)=>{let r=e.inputs[0],a=r.dims,n=R.size(a),i=a.length,s=R.normalizeAxis(t.axis,i),u=s<a.length-1,d,l=[];u?(l=Array.from({length:i},(z,A)=>A),l[s]=i-1,l[i-1]=s,d=e.compute(Ve(r,l),{inputs:[r],outputs:[-1]})[0]):d=r;let c=d.dims,f=c[i-1],h=n/f,g=Ie(f),y=f/g,b=64;h===1&&(b=256);let x=(z,A)=>A===4?`max(max(${z}.x, ${z}.y), max(${z}.z, ${z}.w))`:A===2?`max(${z}.x, ${z}.y)`:A===3?`max(max(${z}.x, ${z}.y), ${z}.z)`:z,v=P("x",d.dataType,d.dims,g),w=Y("result",d.dataType,d.dims,g),k=v.type.value,S=Oe(d.dataType)==="f32"?`var threadMax = ${k}(-3.402823e+38f);`:`var threadMax = ${k}(-65504.0h);`,I=z=>`
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
      ${z.registerUniform("packedCols","i32").declareVariables(v,w)}
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
          rowSumShared = ${k}(${Tt("threadShared[0]",g)});
        }
        workgroupBarrier();

        // calculate final value for each element in the row
        for (var col = lindex; col < cols; col += wg) {
          let value = exp(getValue(row, col, row_stride) - rowMaxShared) / rowSumShared;
          setValue(row, col, row_stride, value);
        }
      }`,C=e.compute({name:"Softmax",shaderCache:{hint:`${g};${b}`,inputDependencies:["type"]},getRunData:()=>({outputs:[{dims:c,dataType:d.dataType}],dispatchGroup:{x:h},programUniforms:[{type:6,data:y}]}),getShaderSource:I},{inputs:[d],outputs:[u?-1:0]})[0];u&&e.compute(Ve(C,l),{inputs:[C]})},Rh=(e,t)=>{Ad(e.inputs),Od(e,t)},Mh=e=>be({axis:e.axis})}),va,Rd,Md,Bd,Bh,jy=W(()=>{ne(),se(),oe(),va=e=>Array.from(e.getBigInt64Array(),Number),Rd=e=>{if(!e||e.length!==2)throw new Error("Tile requires 2 inputs.");if(e[0].dataType!==1&&e[0].dataType!==10&&e[0].dataType!==6&&e[0].dataType!==12)throw new Error("Tile only support float, float16, int32, and uint32 data types");if(e[1].dataType!==7)throw new Error("Tile `repeats` input should be of int64 data type");if(e[1].dims.length!==1)throw new Error("Tile `repeats` input should be 1-D");if(va(e[1]).length!==e[0].dims.length)throw new Error("Tile `repeats` input should have same number of elements as rank of input data tensor")},Md=(e,t)=>{let r=[];for(let a=0;a<e.length;++a)r.push(e[a]*t[a]);return r},Bd=(e,t)=>{let r=e[0].dims,a=t??va(e[1]),n=Md(r,a),i=R.size(n),s=e[0].dataType,u=P("input",s,r.length),d=Y("output",s,n.length),l=c=>`
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
    }`;return{name:"Tile",shaderCache:{hint:`${a}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:[{type:12,data:i},...te(e[0].dims,n)]}),getShaderSource:l}},Bh=e=>{Rd(e.inputs),e.compute(Bd(e.inputs),{inputs:[0]})}}),Nd,Dd,Nh,Vy=W(()=>{ne(),se(),oe(),Nd=(e,t,r,a,n)=>{let i=Y("output_data",n,r.length,4),s=P("a_data",t[1].dataType,t[1].dims.length,4),u=P("b_data",t[2].dataType,t[2].dims.length,4),d=P("c_data",t[0].dataType,t[0].dims.length,4),l,c=(f,h,g)=>`select(${h}, ${f}, ${g})`;if(!a)l=i.setByOffset("global_idx",c(s.getByOffset("global_idx"),u.getByOffset("global_idx"),d.getByOffset("global_idx")));else{let f=(h,g,y="")=>{let b=`a_data[index_a${g}][component_a${g}]`,x=`b_data[index_b${g}][component_b${g}]`,v=`bool(c_data[index_c${g}] & (0xffu << (component_c${g} * 8)))`;return`
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
            ${h}[${g}] = ${y}(${c(b,x,v)});
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
      }`},Dd=e=>{let t=e[1].dims,r=e[2].dims,a=e[0].dims,n=e[1].dataType,i=!(R.areEqual(t,r)&&R.areEqual(r,a)),s=t,u=R.size(t);if(i){let l=Kt.calcShape(Kt.calcShape(t,r,!1),a,!1);if(!l)throw new Error("Can't perform where op on the given tensors");s=l,u=R.size(s)}let d=Math.ceil(u/4);return{name:"Where",shaderCache:{inputDependencies:["rank","rank","rank"]},getShaderSource:l=>Nd(l,e,s,i,n),getRunData:()=>({outputs:[{dims:s,dataType:n}],dispatchGroup:{x:Math.ceil(u/64/4)},programUniforms:[{type:12,data:d},...te(a,t,r,s)]})}},Nh=e=>{e.compute(Dd(e.inputs))}}),Dh,Hy=W(()=>{sy(),Mn(),oy(),uy(),ly(),dy(),py(),gy(),_y(),by(),wy(),vy(),$y(),xy(),Sy(),ky(),Iy(),Ty(),Ey(),Cy(),zy(),Ay(),Oy(),Ry(),My(),rh(),By(),Ny(),Dy(),Py(),Ly(),Rn(),Uy(),oh(),qy(),Wy(),Gy(),nh(),jy(),Et(),Bn(),Vy(),Dh=new Map([["Abs",[Cc]],["Acos",[zc]],["Acosh",[Ac]],["Add",[cf]],["ArgMax",[kc,an]],["ArgMin",[Sc,an]],["Asin",[Oc]],["Asinh",[Rc]],["Atan",[Mc]],["Atanh",[Bc]],["Attention",[Ic]],["AveragePool",[gh,mh]],["BatchNormalization",[Tc]],["BiasAdd",[Ec]],["BiasSplitGelu",[pf]],["Cast",[Dc,Nc]],["Ceil",[Lc]],["Clip",[Pc]],["Concat",[$f,xf]],["Conv",[dn,ln]],["ConvTranspose",[Rf,Of]],["Cos",[Uc]],["Cosh",[qc]],["CumSum",[Mf,Bf]],["DepthToSpace",[Nf,Df]],["DequantizeLinear",[xh,Sh]],["Div",[ff]],["Einsum",[Pf,Lf]],["Elu",[Wc,mr]],["Equal",[hf]],["Erf",[Gc]],["Exp",[jc]],["Expand",[Uf]],["FastGelu",[qf]],["Floor",[Vc]],["FusedConv",[dn,ln]],["Gather",[Gf,Wf]],["GatherElements",[Zf,Kf]],["GatherBlockQuantized",[Hf,Ff]],["GatherND",[jf,Vf]],["Gelu",[Hc]],["Gemm",[Xf,Qf]],["GlobalAveragePool",[_h,yh]],["GlobalMaxPool",[$h,vh]],["Greater",[_f]],["GreaterOrEqual",[wf]],["GridSample",[Yf,Jf]],["GroupQueryAttention",[uh]],["HardSigmoid",[ef,Jc]],["InstanceNormalization",[lh]],["LayerNormalization",[dh]],["LeakyRelu",[Fc,mr]],["Less",[bf]],["LessOrEqual",[vf]],["Log",[lf]],["MatMul",[ph]],["MatMulNBits",[ch,fh]],["MaxPool",[bh,wh]],["Mul",[mf]],["MultiHeadAttention",[th,eh]],["Neg",[Zc]],["Not",[Kc]],["Pad",[hh]],["Pow",[gf]],["QuickGelu",[df,mr]],["Range",[kh]],["Reciprocal",[Qc]],["ReduceMin",[bc]],["ReduceMean",[hc]],["ReduceMax",[_c]],["ReduceSum",[vc]],["ReduceProd",[wc]],["ReduceL1",[mc]],["ReduceL2",[gc]],["ReduceLogSum",[xc]],["ReduceLogSumExp",[yc]],["ReduceSumSquare",[$c]],["Relu",[Xc]],["Resize",[Eh,Ch]],["RotaryEmbedding",[sh]],["ScatterND",[Th,Ih]],["Sigmoid",[Yc]],["Sin",[tf]],["Sinh",[rf]],["Slice",[Ah,Oh]],["SkipLayerNormalization",[zh]],["Split",[ih,ah]],["Sqrt",[af]],["Softmax",[Rh,Mh]],["Sub",[yf]],["Tan",[nf]],["Tanh",[sf]],["ThresholdedRelu",[uf,mr]],["Tile",[Bh]],["Transpose",[rc,ic]],["Where",[Nh]]])}),Ph,Fy=W(()=>{at(),gt(),oe(),Ph=class{constructor(e){this.backend=e,this.repo=new Map,this.attributesBound=!1}getArtifact(e){return this.repo.get(e)}setArtifact(e,t){this.repo.set(e,t)}run(e,t,r,a,n){lt(e.programInfo.name);let i=this.backend.device,s=this.backend.getComputePassEncoder();this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2);let u=[];for(let l of t)u.push({binding:u.length,resource:{buffer:l.buffer}});for(let l of r)u.push({binding:u.length,resource:{buffer:l.buffer}});n&&u.push({binding:u.length,resource:n});let d=i.createBindGroup({layout:e.computePipeline.getBindGroupLayout(0),entries:u,label:e.programInfo.name});if(this.backend.sessionStatus==="capturing"){let l={kernelId:this.backend.currentKernelId,computePipeline:e.computePipeline,bindGroup:d,dispatchGroup:a};this.backend.capturedCommandList.get(this.backend.currentSessionId).push(l)}s.setPipeline(e.computePipeline),s.setBindGroup(0,d),s.dispatchWorkgroups(...a),this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2+1),this.backend.pendingDispatchNumber++,(this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber||this.backend.queryType==="at-passes")&&this.backend.endComputePass(),this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber&&this.backend.flush(),rt(e.programInfo.name)}dispose(){}build(e,t){lt(e.name);let r=this.backend.device,a=[];[{feature:"shader-f16",extension:"f16"},{feature:"subgroups",extension:"subgroups"}].forEach(l=>{r.features.has(l.feature)&&a.push(`enable ${l.extension};`)});let n=tc(t,this.backend.device.limits),i=e.getShaderSource(n),s=`${a.join(`
`)}
${n.additionalImplementations}
${i}`,u=r.createShaderModule({code:s,label:e.name});me("verbose",()=>`[WebGPU] ${e.name} shader code: ${s}`);let d=r.createComputePipeline({compute:{module:u,entryPoint:"main"},layout:"auto",label:e.name});return rt(e.name),{programInfo:e,computePipeline:d,uniformVariablesInfo:n.variablesInfo}}normalizeDispatchGroupSize(e){let t=typeof e=="number"?e:e.x,r=typeof e=="number"?1:e.y||1,a=typeof e=="number"?1:e.z||1,n=this.backend.device.limits.maxComputeWorkgroupsPerDimension;if(t<=n&&r<=n&&a<=n)return[t,r,a];let i=t*r*a,s=Math.ceil(Math.sqrt(i));if(s>n){if(s=Math.ceil(Math.cbrt(i)),s>n)throw new Error("Total dispatch size exceeds WebGPU maximum.");return[s,s,s]}else return[s,s,1]}}}),Lh={};Qt(Lh,{WebGpuBackend:()=>Uh});var Pd,Ld,Ud,Uh,Ky=W(()=>{at(),ne(),gt(),Qp(),ay(),Hy(),Fy(),Pd=(e,t)=>{if(t.length!==e.length)throw new Error(`inputDependencies length ${t.length} is not equal to inputTensors length ${e.length}.`);let r=[];for(let a=0;a<e.length;++a){let n=e[a].dataType;switch(t[a]){case"none":{r.push("");break}case"type":{r.push(`${n}`);break}case"rank":{let i=e[a].dims.length;r.push(`${n};${i}`);break}case"dims":{let i=e[a].dims.join(",");r.push(`${n};${i}`);break}default:throw new Error(`unsupported input dependency: ${t[a]}`)}}return r.join("|")},Ld=(e,t,r)=>{var n,i;let a=e.name;return(n=e.shaderCache)!=null&&n.hint&&(a+="["+e.shaderCache.hint+"]"),a+=":"+r+`:${Pd(t,((i=e.shaderCache)==null?void 0:i.inputDependencies)??new Array(t.length).fill("dims"))}`,a},Ud=class{constructor(e){e&&(this.architecture=e.architecture,this.vendor=e.vendor)}isArchitecture(e){return this.architecture===e}isVendor(e){return this.vendor===e}},Uh=class{constructor(){this.currentSessionId=null,this.currentKernelId=null,this.commandEncoder=null,this.computePassEncoder=null,this.maxDispatchNumber=16,this.pendingDispatchNumber=0,this.pendingKernels=[],this.pendingQueries=new Map,this.sessionStatus="default",this.capturedCommandList=new Map,this.capturedPendingKernels=new Map,this.sessionExternalDataMapping=new Map}get currentKernelCustomData(){if(this.currentKernelId===null)throw new Error("currentKernelCustomData(): currentKernelId is null. (should not happen)");let e=this.kernelCustomData.get(this.currentKernelId);return e||(e={},this.kernelCustomData.set(this.currentKernelId,e)),e}async initialize(e,t){this.env=e;let r=[],a={requiredLimits:{maxComputeWorkgroupStorageSize:t.limits.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:t.limits.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:t.limits.maxStorageBufferBindingSize,maxBufferSize:t.limits.maxBufferSize,maxComputeInvocationsPerWorkgroup:t.limits.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupSizeX:t.limits.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.limits.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.limits.maxComputeWorkgroupSizeZ},requiredFeatures:r},n=i=>t.features.has(i)&&r.push(i)&&!0;n("chromium-experimental-timestamp-query-inside-passes")||n("timestamp-query"),n("shader-f16"),n("subgroups"),this.device=await t.requestDevice(a),this.adapterInfo=new Ud(t.info||await t.requestAdapterInfo()),this.gpuDataManager=Jp(this),this.programManager=new Ph(this),this.kernels=new Map,this.kernelPersistentData=new Map,this.kernelCustomData=new Map,Cn(e.logLevel,!!e.debug),this.device.onuncapturederror=i=>{i.error instanceof GPUValidationError&&console.error(`An uncaught WebGPU validation error was raised: ${i.error.message}`)},Object.defineProperty(this.env.webgpu,"device",{value:this.device,writable:!1,enumerable:!0,configurable:!1}),Object.defineProperty(this.env.webgpu,"adapter",{value:t,writable:!1,enumerable:!0,configurable:!1}),this.setQueryType()}dispose(){typeof this.querySet<"u"&&this.querySet.destroy(),this.gpuDataManager.dispose()}getCommandEncoder(){return this.commandEncoder||(this.commandEncoder=this.device.createCommandEncoder()),this.commandEncoder}getComputePassEncoder(){if(!this.computePassEncoder){let e=this.getCommandEncoder(),t={};this.queryType==="at-passes"&&(t.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:this.pendingDispatchNumber*2,endOfPassWriteIndex:this.pendingDispatchNumber*2+1}),this.computePassEncoder=e.beginComputePass(t)}return this.computePassEncoder}endComputePass(){this.computePassEncoder&&(this.computePassEncoder.end(),this.computePassEncoder=null)}flush(){if(!this.commandEncoder)return;lt(),this.endComputePass();let e;this.queryType!=="none"&&(this.commandEncoder.resolveQuerySet(this.querySet,0,this.pendingDispatchNumber*2,this.queryResolveBuffer,0),e=this.device.createBuffer({size:this.pendingDispatchNumber*2*8,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.pendingQueries.set(e,this.pendingKernels),this.pendingKernels=[],this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer,0,e,0,this.pendingDispatchNumber*2*8)),this.device.queue.submit([this.commandEncoder.finish()]),this.gpuDataManager.refreshPendingBuffers(),this.commandEncoder=null,this.pendingDispatchNumber=0,this.queryType!=="none"&&e.mapAsync(GPUMapMode.READ).then(()=>{var a;let t=new BigUint64Array(e.getMappedRange()),r=this.pendingQueries.get(e);for(let n=0;n<t.length/2;n++){let i=r[n],s=i.kernelId,u=this.kernels.get(s),d=u.kernelType,l=u.kernelName,c=i.programName,f=i.inputTensorViews,h=i.outputTensorViews,g=t[n*2],y=t[n*2+1];typeof this.queryTimeBase>"u"&&(this.queryTimeBase=g);let b=Number(g-this.queryTimeBase),x=Number(y-this.queryTimeBase);if(!Number.isSafeInteger(b)||!Number.isSafeInteger(x))throw new RangeError("incorrect timestamp range");if((a=this.env.webgpu.profiling)!=null&&a.ondata)this.env.webgpu.profiling.ondata({version:1,inputsMetadata:f.map(v=>({dims:v.dims,dataType:ht(v.dataType)})),outputsMetadata:h.map(v=>({dims:v.dims,dataType:ht(v.dataType)})),kernelId:s,kernelType:d,kernelName:l,programName:c,startTime:b,endTime:x});else{let v="";f.forEach((k,S)=>{v+=`input[${S}]: [${k.dims}] | ${ht(k.dataType)}, `});let w="";h.forEach((k,S)=>{w+=`output[${S}]: [${k.dims}] | ${ht(k.dataType)}, `}),console.log(`[profiling] kernel "${s}|${d}|${l}|${c}" ${v}${w}execution time: ${x-b} ns`)}Zr("GPU",`${c}::${g}::${y}`)}e.unmap(),this.pendingQueries.delete(e)}),rt()}run(e,t,r,a,n,i){lt(e.name);let s=[];for(let w=0;w<t.length;++w){let k=t[w].data;if(k===0)continue;let S=this.gpuDataManager.get(k);if(!S)throw new Error(`no GPU data for input: ${k}`);s.push(S)}let{outputs:u,dispatchGroup:d,programUniforms:l}=e.getRunData(t),c=r.length===0?u.map((w,k)=>k):r;if(c.length!==u.length)throw new Error(`Output size ${c.length} must be equal to ${u.length}.`);let f=[],h=[];for(let w=0;w<u.length;++w){if(!Number.isInteger(c[w])||c[w]<-3||c[w]>=i)throw new Error(`Invalid output index: ${c[w]}`);if(c[w]===-3)continue;let k=c[w]===-1,S=c[w]===-2,I=k||S?n(u[w].dataType,u[w].dims):a(c[w],u[w].dataType,u[w].dims);if(f.push(I),I.data===0)continue;let C=this.gpuDataManager.get(I.data);if(!C)throw new Error(`no GPU data for output: ${I.data}`);if(k&&this.temporaryData.push(C),S){let z=this.kernelPersistentData.get(this.currentKernelId);z||(z=[],this.kernelPersistentData.set(this.currentKernelId,z)),z.push(C)}h.push(C)}if(s.length!==t.length||h.length!==f.length){if(h.length===0)return rt(e.name),f;throw new Error(`Program ${e.name} has zero-sized tensor(s) in inputs or outputs. This is not supported now.`)}let g;if(l){let w=0,k=[];l.forEach(z=>{let A=typeof z.data=="number"?[z.data]:z.data;if(A.length===0)return;let O=z.type===10?2:4,G,X;z.type===10?(X=A.length>4?16:A.length>2?8:A.length*O,G=A.length>4?16:O*A.length):(X=A.length<=2?A.length*O:16,G=16),w=Math.ceil(w/X)*X,k.push(w);let K=z.type===10?8:4;w+=A.length>4?Math.ceil(A.length/K)*G:A.length*O});let S=16;w=Math.ceil(w/S)*S;let I=new ArrayBuffer(w);l.forEach((z,A)=>{let O=k[A],G=typeof z.data=="number"?[z.data]:z.data;if(z.type===6)new Int32Array(I,O,G.length).set(G);else if(z.type===12)new Uint32Array(I,O,G.length).set(G);else if(z.type===10)new Uint16Array(I,O,G.length).set(G);else if(z.type===1)new Float32Array(I,O,G.length).set(G);else throw new Error(`Unsupported uniform type: ${ht(z.type)}`)});let C=this.gpuDataManager.create(w,GPUBufferUsage.COPY_DST|GPUBufferUsage.UNIFORM);this.device.queue.writeBuffer(C.buffer,0,I,0,w),this.gpuDataManager.release(C.id),g={offset:0,size:w,buffer:C.buffer}}let y=this.programManager.normalizeDispatchGroupSize(d),b=y[1]===1&&y[2]===1,x=Ld(e,t,b),v=this.programManager.getArtifact(x);if(v||(v=this.programManager.build(e,y),this.programManager.setArtifact(x,v),me("info",()=>`[artifact] key: ${x}, programName: ${e.name}`)),l&&v.uniformVariablesInfo){if(l.length!==v.uniformVariablesInfo.length)throw new Error(`Uniform variables count mismatch: expect ${v.uniformVariablesInfo.length}, got ${l.length} in program "${v.programInfo.name}".`);for(let w=0;w<l.length;w++){let k=l[w],S=k.type,I=typeof k.data=="number"?1:k.data.length,[C,z]=v.uniformVariablesInfo[w];if(S!==C||I!==z)throw new Error(`Uniform variable ${w} mismatch: expect type ${C} with size ${z}, got type ${S} with size ${I} in program "${v.programInfo.name}".`)}}if(me("info",()=>`[ProgramManager] run "${e.name}" (key=${x}) with ${y[0]}x${y[1]}x${y[2]}`),this.queryType!=="none"||this.sessionStatus==="capturing"){let w={kernelId:this.currentKernelId,programName:v.programInfo.name,inputTensorViews:t,outputTensorViews:f};this.pendingKernels.push(w),this.sessionStatus==="capturing"&&this.capturedPendingKernels.get(this.currentSessionId).push(w)}return this.programManager.run(v,s,h,y,g),rt(e.name),f}upload(e,t){this.gpuDataManager.upload(e,t)}memcpy(e,t){this.gpuDataManager.memcpy(e,t)}async download(e,t){await this.gpuDataManager.download(e,t)}alloc(e){return this.gpuDataManager.create(e).id}free(e){return this.gpuDataManager.release(e)}createKernel(e,t,r,a){let n=Dh.get(e);if(!n)throw new Error(`kernel not implemented: ${e}`);let i={kernelType:e,kernelName:a,kernelEntry:n[0],attributes:[n[1],r]};this.kernels.set(t,i)}releaseKernel(e){let t=this.kernelPersistentData.get(e);if(t){for(let r of t)this.gpuDataManager.release(r.id);this.kernelPersistentData.delete(e)}this.kernelCustomData.delete(e),this.kernels.delete(e)}computeKernel(e,t,r){let a=this.kernels.get(e);if(!a)throw new Error(`kernel not created: ${e}`);let n=a.kernelType,i=a.kernelName,s=a.kernelEntry,u=a.attributes;if(this.currentKernelId!==null)throw new Error(`kernel "[${n}] ${i}" is not allowed to be called recursively`);this.currentKernelId=e,u[0]&&(u[1]=u[0](u[1]),u[0]=void 0),me("info",()=>`[WebGPU] Start to run kernel "[${n}] ${i}"...`);let d=this.env.debug;this.temporaryData=[];try{return d&&this.device.pushErrorScope("validation"),s(t,u[1]),0}catch(l){return r.push(Promise.resolve(`[WebGPU] Kernel "[${n}] ${i}" failed. ${l}`)),1}finally{d&&r.push(this.device.popErrorScope().then(l=>l?`GPU validation error for kernel "[${n}] ${i}": ${l.message}`:null));for(let l of this.temporaryData)this.gpuDataManager.release(l.id);this.temporaryData=[],this.currentKernelId=null}}registerBuffer(e,t,r,a){let n=this.sessionExternalDataMapping.get(e);n||(n=new Map,this.sessionExternalDataMapping.set(e,n));let i=n.get(t),s=this.gpuDataManager.registerExternalBuffer(r,a,i);return n.set(t,[s,r]),s}unregisterBuffers(e){let t=this.sessionExternalDataMapping.get(e);t&&(t.forEach(r=>this.gpuDataManager.unregisterExternalBuffer(r[0])),this.sessionExternalDataMapping.delete(e))}getBuffer(e){let t=this.gpuDataManager.get(e);if(!t)throw new Error(`no GPU data for buffer: ${e}`);return t.buffer}createDownloader(e,t,r){return async()=>{let a=await en(this,e,t);return zn(a.buffer,r)}}writeTimestamp(e){this.queryType==="inside-passes"&&this.computePassEncoder.writeTimestamp(this.querySet,e)}setQueryType(){var e;this.queryType="none",(((e=this.env.webgpu.profiling)==null?void 0:e.mode)==="default"||(typeof this.env.trace>"u"?this.env.wasm.trace:this.env.trace))&&(this.device.features.has("chromium-experimental-timestamp-query-inside-passes")?this.queryType="inside-passes":this.device.features.has("timestamp-query")&&(this.queryType="at-passes"),this.queryType!=="none"&&typeof this.querySet>"u"&&(this.querySet=this.device.createQuerySet({type:"timestamp",count:this.maxDispatchNumber*2}),this.queryResolveBuffer=this.device.createBuffer({size:this.maxDispatchNumber*2*8,usage:GPUBufferUsage.COPY_SRC|GPUBufferUsage.QUERY_RESOLVE})))}captureBegin(){me("info","captureBegin"),this.capturedCommandList.get(this.currentSessionId)||this.capturedCommandList.set(this.currentSessionId,[]),this.capturedPendingKernels.get(this.currentSessionId)||this.capturedPendingKernels.set(this.currentSessionId,[]),this.flush(),this.sessionStatus="capturing"}captureEnd(){me("info","captureEnd"),this.flush(),this.sessionStatus="default"}replay(){me("info","replay"),this.sessionStatus="replaying";let e=this.capturedCommandList.get(this.currentSessionId),t=this.capturedPendingKernels.get(this.currentSessionId),r=e.length;this.pendingKernels=[];for(let a=0;a<r;a++){let n=this.getComputePassEncoder(),i=e[a];this.writeTimestamp(this.pendingDispatchNumber*2),n.setPipeline(i.computePipeline),n.setBindGroup(0,i.bindGroup),n.dispatchWorkgroups(...i.dispatchGroup),this.writeTimestamp(this.pendingDispatchNumber*2+1),this.pendingDispatchNumber++,this.queryType!=="none"&&this.pendingKernels.push(t[a]),(this.pendingDispatchNumber>=this.maxDispatchNumber||this.queryType==="at-passes")&&this.endComputePass(),this.pendingDispatchNumber>=this.maxDispatchNumber&&this.flush()}this.flush(),this.sessionStatus="default"}onCreateSession(){this.gpuDataManager.onCreateSession()}onReleaseSession(e){this.unregisterBuffers(e),this.capturedCommandList.has(e)&&this.capturedCommandList.delete(e),this.capturedPendingKernels.has(e)&&this.capturedPendingKernels.delete(e),this.gpuDataManager.onReleaseSession(e)}onRunStart(e){this.currentSessionId=e,this.setQueryType()}}}),qh={};Qt(qh,{init:()=>Wh});var jr,qd,Wh,Zy=W(()=>{ne(),gt(),se(),iy(),jr=class Gh{constructor(t,r,a,n){this.module=t,this.dataType=r,this.data=a,this.dims=n}getFloat32Array(){if(this.dataType!==1)throw new Error("Invalid data type");let t=R.size(this.dims);return t===0?new Float32Array:new Float32Array(this.module.HEAP8.buffer,this.data,t)}getBigInt64Array(){if(this.dataType!==7)throw new Error("Invalid data type");let t=R.size(this.dims);return t===0?new BigInt64Array:new BigInt64Array(this.module.HEAP8.buffer,this.data,t)}getInt32Array(){if(this.dataType!==6)throw new Error("Invalid data type");let t=R.size(this.dims);return t===0?new Int32Array:new Int32Array(this.module.HEAP8.buffer,this.data,t)}getUint16Array(){if(this.dataType!==10&&this.dataType!==4)throw new Error("Invalid data type");let t=R.size(this.dims);return t===0?new Uint16Array:new Uint16Array(this.module.HEAP8.buffer,this.data,t)}reshape(t){if(R.size(t)!==R.size(this.dims))throw new Error("Invalid new shape");return new Gh(this.module,this.dataType,this.data,t)}},qd=class{constructor(e,t,r){this.module=e,this.backend=t,this.customDataOffset=0,this.customDataSize=0,this.adapterInfo=t.adapterInfo;let a=e.PTR_SIZE,n=r/e.PTR_SIZE,i=a===4?"i32":"i64";this.opKernelContext=Number(e.getValue(a*n++,i));let s=Number(e.getValue(a*n++,i));this.outputCount=Number(e.getValue(a*n++,i)),this.customDataOffset=Number(e.getValue(a*n++,"*")),this.customDataSize=Number(e.getValue(a*n++,i));let u=[];for(let d=0;d<s;d++){let l=Number(e.getValue(a*n++,i)),c=Number(e.getValue(a*n++,"*")),f=Number(e.getValue(a*n++,i)),h=[];for(let g=0;g<f;g++)h.push(Number(e.getValue(a*n++,i)));u.push(new jr(e,l,c,h))}this.inputs=u}get kernelCustomData(){return this.backend.currentKernelCustomData}get customDataBuffer(){return this.module.HEAPU8.subarray(this.customDataOffset,this.customDataOffset+this.customDataSize)}compute(e,t){var s;let r=((s=t==null?void 0:t.inputs)==null?void 0:s.map(u=>typeof u=="number"?this.inputs[u]:u))??this.inputs,a=(t==null?void 0:t.outputs)??[],n=(u,d,l)=>new jr(this.module,d,this.output(u,l),l),i=(u,d)=>{let l=Bt(u,d);if(!l)throw new Error(`Unsupported data type: ${u}`);let c=l>0?this.backend.gpuDataManager.create(l).id:0;return new jr(this.module,u,c,d)};return this.backend.run(e,r,a,n,i,this.outputCount)}output(e,t){let r=this.module.stackSave();try{let a=this.module.PTR_SIZE,n=a===4?"i32":"i64",i=this.module.stackAlloc((1+t.length)*a);this.module.setValue(i,t.length,n);for(let s=0;s<t.length;s++)this.module.setValue(i+a*(s+1),t[s],n);return this.module._JsepOutput(this.opKernelContext,e,i)}catch(a){throw new Error(`Failed to generate kernel's output[${e}] with dims [${t}]. If you are running with pre-allocated output, please make sure the output type/dims are correct. Error: ${a}`)}finally{this.module.stackRestore(r)}}},Wh=async(e,t,r,a)=>{let n=t.jsepInit;if(!n)throw new Error("Failed to initialize JSEP. The WebAssembly module is not built with JSEP support.");if(e==="webgpu"){let i=(Ky(),_r(Lh)).WebGpuBackend,s=new i;await s.initialize(r,a),n("webgpu",[s,u=>s.alloc(Number(u)),u=>s.free(u),(u,d,l,c=!1)=>{if(c)me("verbose",()=>`[WebGPU] jsepCopyGpuToGpu: src=${Number(u)}, dst=${Number(d)}, size=${Number(l)}`),s.memcpy(Number(u),Number(d));else{me("verbose",()=>`[WebGPU] jsepCopyCpuToGpu: dataOffset=${Number(u)}, gpuDataId=${Number(d)}, size=${Number(l)}`);let f=t.HEAPU8.subarray(Number(u>>>0),Number(u>>>0)+Number(l));s.upload(Number(d),f)}},async(u,d,l)=>{me("verbose",()=>`[WebGPU] jsepCopyGpuToCpu: gpuDataId=${u}, dataOffset=${d}, size=${l}`),await s.download(Number(u),()=>t.HEAPU8.subarray(Number(d)>>>0,Number(d+l)>>>0))},(u,d,l)=>s.createKernel(u,Number(d),l,t.UTF8ToString(t._JsepGetNodeName(Number(d)))),u=>s.releaseKernel(u),(u,d,l,c)=>{me("verbose",()=>`[WebGPU] jsepRun: sessionHandle=${l}, kernel=${u}, contextDataOffset=${d}`);let f=new qd(t,s,Number(d));return s.computeKernel(Number(u),f,c)},()=>s.captureBegin(),()=>s.captureEnd(),()=>s.replay()])}else{let i=new Yp(r);n("webnn",[i,()=>i.reserveTensorId(),s=>i.releaseTensorId(s),async(s,u,d,l,c)=>i.ensureTensor(s,u,d,l,c),(s,u)=>{i.uploadTensor(s,u)},async(s,u)=>i.downloadTensor(s,u)])}}}),Wd,qn,Wn,kt,Gd,$a,ri,Gn,jn,xa,Vn,Hn,Fn,jh=W(()=>{ey(),ty(),ne(),Lt(),Sn(),Hp(),Wd=(e,t)=>{xe()._OrtInit(e,t)!==0&&we("Can't initialize onnxruntime.")},qn=async e=>{Wd(e.wasm.numThreads,Xr(e.logLevel))},Wn=async(e,t)=>{var r,a;(a=(r=xe()).asyncInit)==null||a.call(r);{let n=(Zy(),_r(qh)).init;if(t==="webgpu"){if(typeof navigator>"u"||!navigator.gpu)throw new Error("WebGPU is not supported in current environment");let i=e.webgpu.adapter;if(i){if(typeof i.limits!="object"||typeof i.features!="object"||typeof i.requestDevice!="function")throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.")}else{let s=e.webgpu.powerPreference;if(s!==void 0&&s!=="low-power"&&s!=="high-performance")throw new Error(`Invalid powerPreference setting: "${s}"`);let u=e.webgpu.forceFallbackAdapter;if(u!==void 0&&typeof u!="boolean")throw new Error(`Invalid forceFallbackAdapter setting: "${u}"`);if(i=await navigator.gpu.requestAdapter({powerPreference:s,forceFallbackAdapter:u}),!i)throw new Error('Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.')}await n("webgpu",xe(),e,i)}if(t==="webnn"){if(typeof navigator>"u"||!navigator.ml)throw new Error("WebNN is not supported in current environment");await n("webnn",xe(),e)}}},kt=new Map,Gd=e=>{let t=xe(),r=t.stackSave();try{let a=t.PTR_SIZE,n=t.stackAlloc(2*a);t._OrtGetInputOutputCount(e,n,n+a)!==0&&we("Can't get session input/output count.");let i=a===4?"i32":"i64";return[Number(t.getValue(n,i)),Number(t.getValue(n+a,i))]}finally{t.stackRestore(r)}},$a=(e,t)=>{let r=xe(),a=r.stackSave(),n=0;try{let i=r.PTR_SIZE,s=r.stackAlloc(2*i);r._OrtGetInputOutputMetadata(e,t,s,s+i)!==0&&we("Can't get session input/output metadata.");let u=Number(r.getValue(s,"*"));n=Number(r.getValue(s+i,"*"));let d=r.HEAP32[n/4];if(d===0)return[u,0];let l=r.HEAPU32[n/4+1],c=[];for(let f=0;f<l;f++){let h=Number(r.getValue(n+8+f*i,"*"));c.push(h!==0?r.UTF8ToString(h):Number(r.getValue(n+8+(f+l)*i,"*")))}return[u,d,c]}finally{r.stackRestore(a),n!==0&&r._OrtFree(n)}},ri=e=>{let t=xe(),r=t._malloc(e.byteLength);if(r===0)throw new Error(`Can't create a session. failed to allocate a buffer of size ${e.byteLength}.`);return t.HEAPU8.set(e,r),[r,e.byteLength]},Gn=async(e,t)=>{var f,h,g,y;let r,a,n=xe();Array.isArray(e)?[r,a]=e:e.buffer===n.HEAPU8.buffer?[r,a]=[e.byteOffset,e.byteLength]:[r,a]=ri(e);let i=0,s=0,u=0,d=[],l=[],c=[];try{if([s,d]=await Vp(t),(t==null?void 0:t.externalData)&&n.mountExternalData){let A=[];for(let O of t.externalData){let G=typeof O=="string"?O:O.path;A.push(En(typeof O=="string"?O:O.data).then(X=>{n.mountExternalData(G,X)}))}await Promise.all(A)}for(let A of(t==null?void 0:t.executionProviders)??[])if((typeof A=="string"?A:A.name)==="webnn"){if(n.shouldTransferToMLTensor=!1,typeof A!="string"){let O=A,G=O==null?void 0:O.context,X=O==null?void 0:O.gpuDevice,K=O==null?void 0:O.deviceType,F=O==null?void 0:O.powerPreference;G?n.currentContext=G:X?n.currentContext=await n.webnnCreateMLContext(X):n.currentContext=await n.webnnCreateMLContext({deviceType:K,powerPreference:F})}else n.currentContext=await n.webnnCreateMLContext();break}i=await n._OrtCreateSession(r,a,s),(f=n.webgpuOnCreateSession)==null||f.call(n,i),i===0&&we("Can't create a session."),(h=n.jsepOnCreateSession)==null||h.call(n),n.currentContext&&(n.webnnRegisterMLContext(i,n.currentContext),n.currentContext=void 0,n.shouldTransferToMLTensor=!0);let[b,x]=Gd(i),v=!!(t!=null&&t.enableGraphCapture),w=[],k=[],S=[],I=[],C=[];for(let A=0;A<b;A++){let[O,G,X]=$a(i,A);O===0&&we("Can't get an input name."),l.push(O);let K=n.UTF8ToString(O);w.push(K),S.push(G===0?{name:K,isTensor:!1}:{name:K,isTensor:!0,type:ht(G),shape:X})}for(let A=0;A<x;A++){let[O,G,X]=$a(i,A+b);O===0&&we("Can't get an output name."),c.push(O);let K=n.UTF8ToString(O);k.push(K),I.push(G===0?{name:K,isTensor:!1}:{name:K,isTensor:!0,type:ht(G),shape:X});{if(v&&(t==null?void 0:t.preferredOutputLocation)===void 0){C.push("gpu-buffer");continue}let F=typeof(t==null?void 0:t.preferredOutputLocation)=="string"?t.preferredOutputLocation:((g=t==null?void 0:t.preferredOutputLocation)==null?void 0:g[K])??"cpu";if(F!=="cpu"&&F!=="cpu-pinned"&&F!=="gpu-buffer"&&F!=="ml-tensor")throw new Error(`Not supported preferred output location: ${F}.`);if(v&&F!=="gpu-buffer")throw new Error(`Not supported preferred output location: ${F}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);C.push(F)}}let z=null;return C.some(A=>A==="gpu-buffer"||A==="ml-tensor")&&(u=n._OrtCreateBinding(i),u===0&&we("Can't create IO binding."),z={handle:u,outputPreferredLocations:C,outputPreferredLocationsEncoded:C.map(A=>Ya(A))}),kt.set(i,[i,l,c,z,v,!1]),[i,w,k,S,I]}catch(b){throw l.forEach(x=>n._OrtFree(x)),c.forEach(x=>n._OrtFree(x)),u!==0&&n._OrtReleaseBinding(u)!==0&&we("Can't release IO binding."),i!==0&&n._OrtReleaseSession(i)!==0&&we("Can't release session."),b}finally{n._free(r),s!==0&&n._OrtReleaseSessionOptions(s)!==0&&we("Can't release session options."),d.forEach(b=>n._free(b)),(y=n.unmountExternalData)==null||y.call(n)}},jn=e=>{var d,l,c;let t=xe(),r=kt.get(e);if(!r)throw new Error(`cannot release session. invalid session id: ${e}`);let[a,n,i,s,u]=r;s&&(u&&t._OrtClearBoundOutputs(s.handle)!==0&&we("Can't clear bound outputs."),t._OrtReleaseBinding(s.handle)!==0&&we("Can't release IO binding.")),(d=t.jsepOnReleaseSession)==null||d.call(t,e),(l=t.webnnOnReleaseSession)==null||l.call(t,e),(c=t.webgpuOnReleaseSession)==null||c.call(t,e),n.forEach(f=>t._OrtFree(f)),i.forEach(f=>t._OrtFree(f)),t._OrtReleaseSession(a)!==0&&we("Can't release session."),kt.delete(e)},xa=async(e,t,r,a,n,i,s=!1)=>{if(!e){t.push(0);return}let u=xe(),d=u.PTR_SIZE,l=e[0],c=e[1],f=e[3],h=f,g,y;if(l==="string"&&(f==="gpu-buffer"||f==="ml-tensor"))throw new Error("String tensor is not supported on GPU.");if(s&&f!=="gpu-buffer")throw new Error(`External buffer must be provided for input/output index ${i} when enableGraphCapture is true.`);if(f==="gpu-buffer"){let v=e[2].gpuBuffer;y=Bt(Vt(l),c);{let w=u.jsepRegisterBuffer;if(!w)throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');g=w(a,i,v,y)}}else if(f==="ml-tensor"){let v=e[2].mlTensor;y=Bt(Vt(l),c);let w=u.webnnRegisterMLTensor;if(!w)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');g=w(a,v,Vt(l),c)}else{let v=e[2];if(Array.isArray(v)){y=d*v.length,g=u._malloc(y),r.push(g);for(let w=0;w<v.length;w++){if(typeof v[w]!="string")throw new TypeError(`tensor data at index ${w} is not a string`);u.setValue(g+w*d,tt(v[w],r),"*")}}else{let w=u.webnnIsGraphInput;if(l!=="string"&&w){let k=u.UTF8ToString(n);if(w(a,k)){let S=Vt(l);y=Bt(S,c),h="ml-tensor";let I=u.webnnCreateTemporaryTensor,C=u.webnnUploadTensor;if(!I||!C)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');let z=await I(a,S,c);C(z,new Uint8Array(v.buffer,v.byteOffset,v.byteLength)),g=z}else y=v.byteLength,g=u._malloc(y),r.push(g),u.HEAPU8.set(new Uint8Array(v.buffer,v.byteOffset,y),g)}else y=v.byteLength,g=u._malloc(y),r.push(g),u.HEAPU8.set(new Uint8Array(v.buffer,v.byteOffset,y),g)}}let b=u.stackSave(),x=u.stackAlloc(4*c.length);try{c.forEach((w,k)=>u.setValue(x+k*d,w,d===4?"i32":"i64"));let v=u._OrtCreateTensor(Vt(l),g,y,x,c.length,Ya(h));v===0&&we(`Can't create tensor for input/output. session=${a}, index=${i}.`),t.push(v)}finally{u.stackRestore(b)}},Vn=async(e,t,r,a,n,i)=>{var X,K,F,Z;let s=xe(),u=s.PTR_SIZE,d=kt.get(e);if(!d)throw new Error(`cannot run inference. invalid session id: ${e}`);let l=d[0],c=d[1],f=d[2],h=d[3],g=d[4],y=d[5],b=t.length,x=a.length,v=0,w=[],k=[],S=[],I=[],C=s.stackSave(),z=s.stackAlloc(b*u),A=s.stackAlloc(b*u),O=s.stackAlloc(x*u),G=s.stackAlloc(x*u);try{[v,w]=jp(i);for(let j=0;j<b;j++)await xa(r[j],k,I,e,c[t[j]],t[j],g);for(let j=0;j<x;j++)await xa(n[j],S,I,e,f[a[j]],b+a[j],g);for(let j=0;j<b;j++)s.setValue(z+j*u,k[j],"*"),s.setValue(A+j*u,c[t[j]],"*");for(let j=0;j<x;j++)s.setValue(O+j*u,S[j],"*"),s.setValue(G+j*u,f[a[j]],"*");if(h&&!y){let{handle:j,outputPreferredLocations:he,outputPreferredLocationsEncoded:N}=h;if(c.length!==b)throw new Error(`input count from feeds (${b}) is expected to be always equal to model's input count (${c.length}).`);for(let M=0;M<b;M++){let E=t[M];await s._OrtBindInput(j,c[E],k[M])!==0&&we(`Can't bind input[${M}] for session=${e}.`)}for(let M=0;M<x;M++){let E=a[M];(X=n[M])!=null&&X[3]?s._OrtBindOutput(j,f[E],S[M],0)!==0&&we(`Can't bind pre-allocated output[${M}] for session=${e}.`):s._OrtBindOutput(j,f[E],0,N[E])!==0&&we(`Can't bind output[${M}] to ${he[M]} for session=${e}.`)}kt.set(e,[l,c,f,h,g,!0])}(K=s.jsepOnRunStart)==null||K.call(s,l),(F=s.webnnOnRunStart)==null||F.call(s,l);let ie;h?ie=await s._OrtRunWithBinding(l,h.handle,x,O,v):ie=await s._OrtRun(l,A,z,b,G,x,O,v),ie!==0&&we("failed to call OrtRun().");let H=[];for(let j=0;j<x;j++){let he=Number(s.getValue(O+j*u,"*"));if(he===S[j]){H.push(n[j]);continue}let N=s.stackSave(),M=s.stackAlloc(4*u),E=!1,B,L=0;try{s._OrtGetTensorData(he,M,M+u,M+2*u,M+3*u)!==0&&we(`Can't access output tensor data on index ${j}.`);let Q=u===4?"i32":"i64",ge=Number(s.getValue(M,Q));L=s.getValue(M+u,"*");let U=s.getValue(M+u*2,"*"),ue=Number(s.getValue(M+u*3,Q)),ve=[];for(let ce=0;ce<ue;ce++)ve.push(Number(s.getValue(U+ce*u,Q)));s._OrtFree(U)!==0&&we("Can't free memory for tensor dims.");let ae=ve.reduce((ce,de)=>ce*de,1);B=ht(ge);let le=h==null?void 0:h.outputPreferredLocations[a[j]];if(B==="string"){if(le==="gpu-buffer"||le==="ml-tensor")throw new Error("String tensor is not supported on GPU.");let ce=[];for(let de=0;de<ae;de++){let Te=s.getValue(L+de*u,"*"),De=s.getValue(L+(de+1)*u,"*"),yt=de===ae-1?void 0:De-Te;ce.push(s.UTF8ToString(Te,yt))}H.push([B,ve,ce,"cpu"])}else if(le==="gpu-buffer"&&ae>0){let ce=s.jsepGetBuffer;if(!ce)throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');let de=ce(L),Te=Bt(ge,ae);if(Te===void 0||!In(B))throw new Error(`Unsupported data type: ${B}`);E=!0,H.push([B,ve,{gpuBuffer:de,download:s.jsepCreateDownloader(de,Te,B),dispose:()=>{s._OrtReleaseTensor(he)!==0&&we("Can't release tensor.")}},"gpu-buffer"])}else if(le==="ml-tensor"&&ae>0){let ce=s.webnnEnsureTensor,de=s.webnnIsInt64Supported;if(!ce||!de)throw new Error('preferredLocation "ml-tensor" is not supported without using WebNN.');if(Bt(ge,ae)===void 0||!Tn(B))throw new Error(`Unsupported data type: ${B}`);if(B==="int64"&&!de(e))throw new Error('preferredLocation "ml-tensor" for int64 output is not supported by current WebNN Context.');let Te=await ce(e,L,ge,ve,!1);E=!0,H.push([B,ve,{mlTensor:Te,download:s.webnnCreateMLTensorDownloader(L,B),dispose:()=>{s.webnnReleaseTensorId(L),s._OrtReleaseTensor(he)}},"ml-tensor"])}else{let ce=kn(B),de=new ce(ae);new Uint8Array(de.buffer,de.byteOffset,de.byteLength).set(s.HEAPU8.subarray(L,L+de.byteLength)),H.push([B,ve,de,"cpu"])}}finally{s.stackRestore(N),B==="string"&&L&&s._free(L),E||s._OrtReleaseTensor(he),(Z=s.webnnOnRunEnd)==null||Z.call(s,l)}}return h&&!g&&(s._OrtClearBoundOutputs(h.handle)!==0&&we("Can't clear bound outputs."),kt.set(e,[l,c,f,h,g,!1])),H}finally{s.stackRestore(C),k.forEach(ie=>s._OrtReleaseTensor(ie)),S.forEach(ie=>s._OrtReleaseTensor(ie)),I.forEach(ie=>s._free(ie)),v!==0&&s._OrtReleaseRunOptions(v),w.forEach(ie=>s._free(ie))}},Hn=e=>{let t=xe(),r=kt.get(e);if(!r)throw new Error("invalid session id");let a=r[0],n=t._OrtEndProfiling(a);n===0&&we("Can't get an profile file name."),t._OrtFree(n)},Fn=e=>{let t=[];for(let r of e){let a=r[2];!Array.isArray(a)&&"buffer"in a&&t.push(a.buffer)}return t}}),It,Ue,jt,dr,pr,Vr,Sa,Hr,Ot,Rt,jd,Vh,Hh,Fh,Kh,Zh,Qh,Xh,Yh=W(()=>{at(),jh(),Lt(),$n(),It=()=>!!Se.wasm.proxy&&typeof document<"u",jt=!1,dr=!1,pr=!1,Hr=new Map,Ot=(e,t)=>{let r=Hr.get(e);r?r.push(t):Hr.set(e,[t])},Rt=()=>{if(jt||!dr||pr||!Ue)throw new Error("worker not ready")},jd=e=>{switch(e.data.type){case"init-wasm":jt=!1,e.data.err?(pr=!0,Sa[1](e.data.err)):(dr=!0,Sa[0]()),Vr&&(URL.revokeObjectURL(Vr),Vr=void 0);break;case"init-ep":case"copy-from":case"create":case"release":case"run":case"end-profiling":{let t=Hr.get(e.data.type);e.data.err?t.shift()[1](e.data.err):t.shift()[0](e.data.out);break}}},Vh=async()=>{if(!dr){if(jt)throw new Error("multiple calls to 'initWasm()' detected.");if(pr)throw new Error("previous call to 'initWasm()' failed.");if(jt=!0,It())return new Promise((e,t)=>{Ue==null||Ue.terminate(),Wp().then(([r,a])=>{try{Ue=a,Ue.onerror=i=>t(i),Ue.onmessage=jd,Sa=[e,t];let n={type:"init-wasm",in:Se};!n.in.wasm.wasmPaths&&(r||Xa)&&(n.in.wasm.wasmPaths={wasm:new URL(""+new URL("ort-wasm-simd-threaded.jsep-B0T3yYHD.wasm",import.meta.url).href,import.meta.url).href}),Ue.postMessage(n),Vr=r}catch(n){t(n)}},t)});try{await xn(Se.wasm),await qn(Se),dr=!0}catch(e){throw pr=!0,e}finally{jt=!1}}},Hh=async e=>{if(It())return Rt(),new Promise((t,r)=>{Ot("init-ep",[t,r]);let a={type:"init-ep",in:{epName:e,env:Se}};Ue.postMessage(a)});await Wn(Se,e)},Fh=async e=>It()?(Rt(),new Promise((t,r)=>{Ot("copy-from",[t,r]);let a={type:"copy-from",in:{buffer:e}};Ue.postMessage(a,[e.buffer])})):ri(e),Kh=async(e,t)=>{if(It()){if(t!=null&&t.preferredOutputLocation)throw new Error('session option "preferredOutputLocation" is not supported for proxy.');return Rt(),new Promise((r,a)=>{Ot("create",[r,a]);let n={type:"create",in:{model:e,options:{...t}}},i=[];e instanceof Uint8Array&&i.push(e.buffer),Ue.postMessage(n,i)})}else return Gn(e,t)},Zh=async e=>{if(It())return Rt(),new Promise((t,r)=>{Ot("release",[t,r]);let a={type:"release",in:e};Ue.postMessage(a)});jn(e)},Qh=async(e,t,r,a,n,i)=>{if(It()){if(r.some(s=>s[3]!=="cpu"))throw new Error("input tensor on GPU is not supported for proxy.");if(n.some(s=>s))throw new Error("pre-allocated output tensor is not supported for proxy.");return Rt(),new Promise((s,u)=>{Ot("run",[s,u]);let d=r,l={type:"run",in:{sessionId:e,inputIndices:t,inputs:d,outputIndices:a,options:i}};Ue.postMessage(l,Fn(d))})}else return Vn(e,t,r,a,n,i)},Xh=async e=>{if(It())return Rt(),new Promise((t,r)=>{Ot("end-profiling",[t,r]);let a={type:"end-profiling",in:e};Ue.postMessage(a)});Hn(e)}}),ka,Vd,Jh,Qy=W(()=>{at(),Yh(),ne(),vn(),Hp(),ka=(e,t)=>{switch(e.location){case"cpu":return[e.type,e.dims,e.data,"cpu"];case"gpu-buffer":return[e.type,e.dims,{gpuBuffer:e.gpuBuffer},"gpu-buffer"];case"ml-tensor":return[e.type,e.dims,{mlTensor:e.mlTensor},"ml-tensor"];default:throw new Error(`invalid data location: ${e.location} for ${t()}`)}},Vd=e=>{switch(e[3]){case"cpu":return new Ze(e[0],e[2],e[1]);case"gpu-buffer":{let t=e[0];if(!In(t))throw new Error(`not supported data type: ${t} for deserializing GPU tensor`);let{gpuBuffer:r,download:a,dispose:n}=e[2];return Ze.fromGpuBuffer(r,{dataType:t,dims:e[1],download:a,dispose:n})}case"ml-tensor":{let t=e[0];if(!Tn(t))throw new Error(`not supported data type: ${t} for deserializing MLTensor tensor`);let{mlTensor:r,download:a,dispose:n}=e[2];return Ze.fromMLTensor(r,{dataType:t,dims:e[1],download:a,dispose:n})}default:throw new Error(`invalid data location: ${e[3]}`)}},Jh=class{async fetchModelAndCopyToWasmMemory(e){return Fh(await En(e))}async loadModel(e,t){lt();let r;typeof e=="string"?r=await this.fetchModelAndCopyToWasmMemory(e):r=e,[this.sessionId,this.inputNames,this.outputNames,this.inputMetadata,this.outputMetadata]=await Kh(r,t),rt()}async dispose(){return Zh(this.sessionId)}async run(e,t,r){lt();let a=[],n=[];Object.entries(e).forEach(f=>{let h=f[0],g=f[1],y=this.inputNames.indexOf(h);if(y===-1)throw new Error(`invalid input '${h}'`);a.push(g),n.push(y)});let i=[],s=[];Object.entries(t).forEach(f=>{let h=f[0],g=f[1],y=this.outputNames.indexOf(h);if(y===-1)throw new Error(`invalid output '${h}'`);i.push(g),s.push(y)});let u=a.map((f,h)=>ka(f,()=>`input "${this.inputNames[n[h]]}"`)),d=i.map((f,h)=>f?ka(f,()=>`output "${this.outputNames[s[h]]}"`):null),l=await Qh(this.sessionId,n,u,s,d,r),c={};for(let f=0;f<l.length;f++)c[this.outputNames[s[f]]]=i[f]??Vd(l[f]);return rt(),c}startProfiling(){}endProfiling(){Xh(this.sessionId)}}}),em={};Qt(em,{OnnxruntimeWebAssemblyBackend:()=>fn,initializeFlags:()=>cn,wasmBackend:()=>tm});var cn,fn,tm,Xy=W(()=>{at(),Yh(),Qy(),cn=()=>{(typeof Se.wasm.initTimeout!="number"||Se.wasm.initTimeout<0)&&(Se.wasm.initTimeout=0);let e=Se.wasm.simd;if(typeof e!="boolean"&&e!==void 0&&e!=="fixed"&&e!=="relaxed"&&(console.warn(`Property "env.wasm.simd" is set to unknown value "${e}". Reset it to \`false\` and ignore SIMD feature checking.`),Se.wasm.simd=!1),typeof Se.wasm.proxy!="boolean"&&(Se.wasm.proxy=!1),typeof Se.wasm.trace!="boolean"&&(Se.wasm.trace=!1),typeof Se.wasm.numThreads!="number"||!Number.isInteger(Se.wasm.numThreads)||Se.wasm.numThreads<=0)if(typeof self<"u"&&!self.crossOriginIsolated)Se.wasm.numThreads=1;else{let t=typeof navigator>"u"?Ng("node:os").cpus().length:navigator.hardwareConcurrency;Se.wasm.numThreads=Math.min(4,Math.ceil((t||1)/2))}},fn=class{async init(e){cn(),await Vh(),await Hh(e)}async createInferenceSessionHandler(e,t){let r=new Jh;return await r.loadModel(e,t),r}},tm=new fn});at();at();at();var Yy="1.22.0-dev.20250409-89f8206ba4";{let e=(Xy(),_r(em)).wasmBackend;Ht("webgpu",e,5),Ht("webnn",e,5),Ht("cpu",e,10),Ht("wasm",e,10)}Object.defineProperty(Se.versions,"web",{value:Yy,enumerable:!0});/**
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
 */function Jy(e){let t=e.width,r=e.height,a=-1,n=-1;for(let i=0;i<e.height;i++)for(let s=0;s<e.width;s++)(e.data[(i*e.width+s)*4+3]>0||e.data[(i*e.width+s)*4]>0)&&(t=Math.min(t,s),r=Math.min(r,i),a=Math.max(a,s),n=Math.max(n,i));return a<0?null:{x:t,y:r,width:a-t+1,height:n-r+1}}function Hd(e){const t=new ImageData(e.width,e.height);for(let r=0;r<e.data.length;r+=4){const a=e.data[r]>127||e.data[r+3]>127?255:0;t.data[r]=t.data[r+1]=t.data[r+2]=a,t.data[r+3]=255}return t}function e0(e,t){if(t<=0)return Hd(e);const r=Hd(e),a=new ImageData(e.width,e.height),n=t*t;for(let i=0;i<r.height;i++)for(let s=0;s<r.width;s++){let u=!1;for(let l=-t;l<=t&&!u;l++)for(let c=-t;c<=t;c++){if(c*c+l*l>n)continue;const f=s+c,h=i+l;if(f>=0&&h>=0&&f<r.width&&h<r.height&&r.data[(h*r.width+f)*4]>0){u=!0;break}}const d=(i*r.width+s)*4;a.data[d]=a.data[d+1]=a.data[d+2]=u?255:0,a.data[d+3]=255}return a}function t0(e,t){if(t<=0)return e;const r=new ImageData(e.width,e.height),a=Math.ceil(t);for(let n=0;n<e.height;n++)for(let i=0;i<e.width;i++){let s=0,u=0;for(let c=-a;c<=a;c++)for(let f=-a;f<=a;f++){const h=i+f,g=n+c;h>=0&&g>=0&&h<e.width&&g<e.height&&(s+=e.data[(g*e.width+h)*4],u++)}const d=(n*e.width+i)*4,l=Math.round(s/u);r.data[d]=r.data[d+1]=r.data[d+2]=l,r.data[d+3]=255}return r}function r0(e){const t=new ImageData(e.width,e.height);let r=0;for(let a=1;a<e.height-1;a++)for(let n=1;n<e.width-1;n++){const i=(a*e.width+n)*4,s=e.data[i],u=e.data[i+1],d=e.data[i+2],l=(s+u+d)/3,c=Math.max(s,u,d)-Math.min(s,u,d),f=e.data[i-4],h=e.data[i+4],g=e.data[i-e.width*4],y=e.data[i+e.width*4],b=Math.max(Math.abs(l-(f+e.data[i-3]+e.data[i-2])/3),Math.abs(l-(h+e.data[i+5]+e.data[i+6])/3),Math.abs(l-(g+e.data[i-e.width*4+1]+e.data[i-e.width*4+2])/3),Math.abs(l-(y+e.data[i+e.width*4+1]+e.data[i+e.width*4+2])/3));c<55&&l>90&&l<235&&b>14&&(t.data[i]=t.data[i+1]=t.data[i+2]=255,t.data[i+3]=255,r++)}return r<e.width*e.height*2e-4?new ImageData(e.width,e.height):t}function i0(e,t,r,a){const n=Math.max(0,Math.floor(e.x-t)),i=Math.max(0,Math.floor(e.y-t)),s=Math.min(r,Math.ceil(e.x+e.width+t)),u=Math.min(a,Math.ceil(e.y+e.height+t));return{x:n,y:i,width:s-n,height:u-i}}function Ia(e,t,r){const a=document.createElement("canvas"),n=document.createElement("canvas");a.width=e.width,a.height=e.height,n.width=t,n.height=r,a.getContext("2d").putImageData(e,0,0);const i=n.getContext("2d",{willReadFrequently:!0});return i.imageSmoothingEnabled=!0,i.drawImage(a,0,0,t,r),i.getImageData(0,0,t,r)}class a0{constructor(t="./models/lama.onnx"){tr(this,"session",null);tr(this,"modelPromise",null);tr(this,"lastTiming",{});this.modelPath=t}async load(){if(!navigator.gpu)throw new Error("WebGPU is unavailable. Use a recent Chrome or Edge browser with WebGPU enabled.");Se.logLevel="error",this.modelPromise||(this.modelPromise=wn.create(this.modelPath,{executionProviders:["webgpu"]}).then(t=>(this.session=t,t)));try{return await this.modelPromise}catch{throw this.modelPromise=null,new Error(`Could not load the local LaMa model at ${this.modelPath}.`)}}async inpaint(t,r,a){var K,F;const n=performance.now(),i=Jy(r);if(!i)throw new Error("Paint an area to remove before running inpainting.");const s=await this.load(),u=e0(r,a.maskDilation),d=i0(i,a.cropPadding,t.width,t.height),l=512,c=Ia(Ii(t,d),l,l),f=Ia(Ii(u,d),l,l);(K=a.onStatus)==null||K.call(a,"Running local AI");const h=performance.now(),g=new Float32Array(l*l*3),y=new Float32Array(l*l);for(let Z=0;Z<l*l;Z++)g[Z]=c.data[Z*4]/255,g[l*l+Z]=c.data[Z*4+1]/255,g[l*l*2+Z]=c.data[Z*4+2]/255,y[Z]=f.data[Z*4]>127?1:0;this.lastTiming.preprocess=performance.now()-h;const b=new Ze("float32",g,[1,3,l,l]),x=new Ze("float32",y,[1,1,l,l]),v=performance.now();let w;try{w=await s.run({[s.inputNames[0]]:b,[s.inputNames[1]]:x})}catch(Z){throw console.error("[AnyPNG] WebGPU inference failed",Z),new Error("Local inference failed. The model may use an unsupported operator or require more GPU memory.")}this.lastTiming.inference=performance.now()-v;const S=w[s.outputNames[0]].data,I=new ImageData(d.width,d.height),C=Ia(f,d.width,d.height),z=t0(Ii(C,{x:0,y:0,width:C.width,height:C.height}),a.blendFeather);let A=0;for(const Z of S)A=Math.max(A,Number(Z));const O=A>1.5?1:255;for(let Z=0;Z<d.width*d.height;Z++){const ie=Math.min(l-1,Math.floor(Z%d.width*l/d.width)),H=Math.min(l-1,Math.floor(Math.floor(Z/d.width)*l/d.height)),j=H*l+ie;I.data[Z*4]=Ta(S[j]*O),I.data[Z*4+1]=Ta(S[l*l+j]*O),I.data[Z*4+2]=Ta(S[l*l*2+j]*O),I.data[Z*4+3]=255}(F=a.onStatus)==null||F.call(a,"Blending result");const G=performance.now(),X=Og(t,I,z,d);return this.lastTiming.composite=performance.now()-G,this.lastTiming.total=performance.now()-n,X}dispose(){var t;(t=this.session)==null||t.release(),this.session=null,this.modelPromise=null}}function Ta(e){return Math.max(0,Math.min(255,Math.round(e)))}var Ea={exports:{}},Fd;function n0(){return Fd||(Fd=1,(function(e){var t=(function(r){var a=Object.prototype,n=a.hasOwnProperty,i=Object.defineProperty||function(N,M,E){N[M]=E.value},s,u=typeof Symbol=="function"?Symbol:{},d=u.iterator||"@@iterator",l=u.asyncIterator||"@@asyncIterator",c=u.toStringTag||"@@toStringTag";function f(N,M,E){return Object.defineProperty(N,M,{value:E,enumerable:!0,configurable:!0,writable:!0}),N[M]}try{f({},"")}catch{f=function(M,E,B){return M[E]=B}}function h(N,M,E,B){var L=M&&M.prototype instanceof k?M:k,Q=Object.create(L.prototype),ge=new H(B||[]);return i(Q,"_invoke",{value:K(N,E,ge)}),Q}r.wrap=h;function g(N,M,E){try{return{type:"normal",arg:N.call(M,E)}}catch(B){return{type:"throw",arg:B}}}var y="suspendedStart",b="suspendedYield",x="executing",v="completed",w={};function k(){}function S(){}function I(){}var C={};f(C,d,function(){return this});var z=Object.getPrototypeOf,A=z&&z(z(j([])));A&&A!==a&&n.call(A,d)&&(C=A);var O=I.prototype=k.prototype=Object.create(C);S.prototype=I,i(O,"constructor",{value:I,configurable:!0}),i(I,"constructor",{value:S,configurable:!0}),S.displayName=f(I,c,"GeneratorFunction");function G(N){["next","throw","return"].forEach(function(M){f(N,M,function(E){return this._invoke(M,E)})})}r.isGeneratorFunction=function(N){var M=typeof N=="function"&&N.constructor;return M?M===S||(M.displayName||M.name)==="GeneratorFunction":!1},r.mark=function(N){return Object.setPrototypeOf?Object.setPrototypeOf(N,I):(N.__proto__=I,f(N,c,"GeneratorFunction")),N.prototype=Object.create(O),N},r.awrap=function(N){return{__await:N}};function X(N,M){function E(Q,ge,U,ue){var ve=g(N[Q],N,ge);if(ve.type==="throw")ue(ve.arg);else{var ae=ve.arg,le=ae.value;return le&&typeof le=="object"&&n.call(le,"__await")?M.resolve(le.__await).then(function(ce){E("next",ce,U,ue)},function(ce){E("throw",ce,U,ue)}):M.resolve(le).then(function(ce){ae.value=ce,U(ae)},function(ce){return E("throw",ce,U,ue)})}}var B;function L(Q,ge){function U(){return new M(function(ue,ve){E(Q,ge,ue,ve)})}return B=B?B.then(U,U):U()}i(this,"_invoke",{value:L})}G(X.prototype),f(X.prototype,l,function(){return this}),r.AsyncIterator=X,r.async=function(N,M,E,B,L){L===void 0&&(L=Promise);var Q=new X(h(N,M,E,B),L);return r.isGeneratorFunction(M)?Q:Q.next().then(function(ge){return ge.done?ge.value:Q.next()})};function K(N,M,E){var B=y;return function(Q,ge){if(B===x)throw new Error("Generator is already running");if(B===v){if(Q==="throw")throw ge;return he()}for(E.method=Q,E.arg=ge;;){var U=E.delegate;if(U){var ue=F(U,E);if(ue){if(ue===w)continue;return ue}}if(E.method==="next")E.sent=E._sent=E.arg;else if(E.method==="throw"){if(B===y)throw B=v,E.arg;E.dispatchException(E.arg)}else E.method==="return"&&E.abrupt("return",E.arg);B=x;var ve=g(N,M,E);if(ve.type==="normal"){if(B=E.done?v:b,ve.arg===w)continue;return{value:ve.arg,done:E.done}}else ve.type==="throw"&&(B=v,E.method="throw",E.arg=ve.arg)}}}function F(N,M){var E=M.method,B=N.iterator[E];if(B===s)return M.delegate=null,E==="throw"&&N.iterator.return&&(M.method="return",M.arg=s,F(N,M),M.method==="throw")||E!=="return"&&(M.method="throw",M.arg=new TypeError("The iterator does not provide a '"+E+"' method")),w;var L=g(B,N.iterator,M.arg);if(L.type==="throw")return M.method="throw",M.arg=L.arg,M.delegate=null,w;var Q=L.arg;if(!Q)return M.method="throw",M.arg=new TypeError("iterator result is not an object"),M.delegate=null,w;if(Q.done)M[N.resultName]=Q.value,M.next=N.nextLoc,M.method!=="return"&&(M.method="next",M.arg=s);else return Q;return M.delegate=null,w}G(O),f(O,c,"Generator"),f(O,d,function(){return this}),f(O,"toString",function(){return"[object Generator]"});function Z(N){var M={tryLoc:N[0]};1 in N&&(M.catchLoc=N[1]),2 in N&&(M.finallyLoc=N[2],M.afterLoc=N[3]),this.tryEntries.push(M)}function ie(N){var M=N.completion||{};M.type="normal",delete M.arg,N.completion=M}function H(N){this.tryEntries=[{tryLoc:"root"}],N.forEach(Z,this),this.reset(!0)}r.keys=function(N){var M=Object(N),E=[];for(var B in M)E.push(B);return E.reverse(),function L(){for(;E.length;){var Q=E.pop();if(Q in M)return L.value=Q,L.done=!1,L}return L.done=!0,L}};function j(N){if(N){var M=N[d];if(M)return M.call(N);if(typeof N.next=="function")return N;if(!isNaN(N.length)){var E=-1,B=function L(){for(;++E<N.length;)if(n.call(N,E))return L.value=N[E],L.done=!1,L;return L.value=s,L.done=!0,L};return B.next=B}}return{next:he}}r.values=j;function he(){return{value:s,done:!0}}return H.prototype={constructor:H,reset:function(N){if(this.prev=0,this.next=0,this.sent=this._sent=s,this.done=!1,this.delegate=null,this.method="next",this.arg=s,this.tryEntries.forEach(ie),!N)for(var M in this)M.charAt(0)==="t"&&n.call(this,M)&&!isNaN(+M.slice(1))&&(this[M]=s)},stop:function(){this.done=!0;var N=this.tryEntries[0],M=N.completion;if(M.type==="throw")throw M.arg;return this.rval},dispatchException:function(N){if(this.done)throw N;var M=this;function E(ue,ve){return Q.type="throw",Q.arg=N,M.next=ue,ve&&(M.method="next",M.arg=s),!!ve}for(var B=this.tryEntries.length-1;B>=0;--B){var L=this.tryEntries[B],Q=L.completion;if(L.tryLoc==="root")return E("end");if(L.tryLoc<=this.prev){var ge=n.call(L,"catchLoc"),U=n.call(L,"finallyLoc");if(ge&&U){if(this.prev<L.catchLoc)return E(L.catchLoc,!0);if(this.prev<L.finallyLoc)return E(L.finallyLoc)}else if(ge){if(this.prev<L.catchLoc)return E(L.catchLoc,!0)}else if(U){if(this.prev<L.finallyLoc)return E(L.finallyLoc)}else throw new Error("try statement without catch or finally")}}},abrupt:function(N,M){for(var E=this.tryEntries.length-1;E>=0;--E){var B=this.tryEntries[E];if(B.tryLoc<=this.prev&&n.call(B,"finallyLoc")&&this.prev<B.finallyLoc){var L=B;break}}L&&(N==="break"||N==="continue")&&L.tryLoc<=M&&M<=L.finallyLoc&&(L=null);var Q=L?L.completion:{};return Q.type=N,Q.arg=M,L?(this.method="next",this.next=L.finallyLoc,w):this.complete(Q)},complete:function(N,M){if(N.type==="throw")throw N.arg;return N.type==="break"||N.type==="continue"?this.next=N.arg:N.type==="return"?(this.rval=this.arg=N.arg,this.method="return",this.next="end"):N.type==="normal"&&M&&(this.next=M),w},finish:function(N){for(var M=this.tryEntries.length-1;M>=0;--M){var E=this.tryEntries[M];if(E.finallyLoc===N)return this.complete(E.completion,E.afterLoc),ie(E),w}},catch:function(N){for(var M=this.tryEntries.length-1;M>=0;--M){var E=this.tryEntries[M];if(E.tryLoc===N){var B=E.completion;if(B.type==="throw"){var L=B.arg;ie(E)}return L}}throw new Error("illegal catch attempt")},delegateYield:function(N,M,E){return this.delegate={iterator:j(N),resultName:M,nextLoc:E},this.method==="next"&&(this.arg=s),w}},r})(e.exports);try{regeneratorRuntime=t}catch{typeof globalThis=="object"?globalThis.regeneratorRuntime=t:Function("r","regeneratorRuntime = r")(t)}})(Ea)),Ea.exports}var Ca,Kd;function Kn(){return Kd||(Kd=1,Ca=(e,t)=>`${e}-${t}-${Math.random().toString(16).slice(3,8)}`),Ca}var za,Zd;function rm(){if(Zd)return za;Zd=1;const e=Kn();let t=0;return za=({id:r,action:a,payload:n={}})=>{let i=r;return typeof i>"u"&&(i=e("Job",t),t+=1),{id:i,action:a,payload:n}},za}var cr={},Qd;function Zn(){if(Qd)return cr;Qd=1;let e=!1;return cr.logging=e,cr.setLogging=t=>{e=t},cr.log=(...t)=>e?console.log.apply(this,t):null,cr}var Aa,Xd;function s0(){if(Xd)return Aa;Xd=1;const e=rm(),{log:t}=Zn(),r=Kn();let a=0;return Aa=()=>{const n=r("Scheduler",a),i={},s={};let u=[];a+=1;const d=()=>u.length,l=()=>Object.keys(i).length,c=()=>{if(u.length!==0){const b=Object.keys(i);for(let x=0;x<b.length;x+=1)if(typeof s[b[x]]>"u"){u[0](i[b[x]]);break}}},f=(b,x)=>new Promise((v,w)=>{const k=e({action:b,payload:x});u.push(async S=>{u.shift(),s[S.id]=k;try{v(await S[b].apply(this,[...x,k.id]))}catch(I){w(I)}finally{delete s[S.id],c()}}),t(`[${n}]: Add ${k.id} to JobQueue`),t(`[${n}]: JobQueue length=${u.length}`),c()});return{addWorker:b=>(i[b.id]=b,t(`[${n}]: Add ${b.id}`),t(`[${n}]: Number of workers=${l()}`),c(),b.id),addJob:async(b,...x)=>{if(l()===0)throw Error(`[${n}]: You need to have at least one worker before adding jobs`);return f(b,x)},terminate:async()=>{Object.keys(i).forEach(async b=>{await i[b].terminate()}),u=[]},getQueueLen:d,getNumWorkers:l}},Aa}function o0(e){throw new Error('Could not dynamically require "'+e+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Oa,Yd;function u0(){return Yd||(Yd=1,Oa=e=>{const t={};return typeof WorkerGlobalScope<"u"?t.type="webworker":typeof document=="object"?t.type="browser":typeof process=="object"&&typeof o0=="function"&&(t.type="node"),typeof e>"u"?t:t[e]}),Oa}var Ra,Jd;function l0(){if(Jd)return Ra;Jd=1;const t=u0()("type")==="browser"?r=>new URL(r,window.location.href).href:r=>r;return Ra=r=>{const a={...r};return["corePath","workerPath","langPath"].forEach(n=>{r[n]&&(a[n]=t(a[n]))}),a},Ra}var Ma,ep;function im(){return ep||(ep=1,Ma={TESSERACT_ONLY:0,LSTM_ONLY:1,TESSERACT_LSTM_COMBINED:2,DEFAULT:3}),Ma}const d0="7.0.0",p0={version:d0};var Ba,tp;function c0(){return tp||(tp=1,Ba={workerBlobURL:!0,logger:()=>{}}),Ba}var Na,rp;function f0(){if(rp)return Na;rp=1;const e=p0.version;return Na={...c0(),workerPath:`https://cdn.jsdelivr.net/npm/tesseract.js@v${e}/dist/worker.min.js`},Na}var Da,ip;function h0(){return ip||(ip=1,Da=({workerPath:e,workerBlobURL:t})=>{let r;if(Blob&&URL&&t){const a=new Blob([`importScripts("${e}");`],{type:"application/javascript"});r=new Worker(URL.createObjectURL(a))}else r=new Worker(e);return r}),Da}var Pa,ap;function m0(){return ap||(ap=1,Pa=e=>{e.terminate()}),Pa}var La,np;function g0(){return np||(np=1,La=(e,t)=>{e.onmessage=({data:r})=>{t(r)}}),La}var Ua,sp;function y0(){return sp||(sp=1,Ua=async(e,t)=>{e.postMessage(t)}),Ua}var qa,op;function _0(){if(op)return qa;op=1;const e=r=>new Promise((a,n)=>{const i=new FileReader;i.onload=()=>{a(i.result)},i.onerror=({target:{error:{code:s}}})=>{n(Error(`File could not be read! Code=${s}`))},i.readAsArrayBuffer(r)}),t=async r=>{let a=r;if(typeof r>"u")return"undefined";if(typeof r=="string")/data:image\/([a-zA-Z]*);base64,([^"]*)/.test(r)?a=atob(r.split(",")[1]).split("").map(n=>n.charCodeAt(0)):a=await(await fetch(r)).arrayBuffer();else if(typeof HTMLElement<"u"&&r instanceof HTMLElement)r.tagName==="IMG"&&(a=await t(r.src)),r.tagName==="VIDEO"&&(a=await t(r.poster)),r.tagName==="CANVAS"&&await new Promise(n=>{r.toBlob(async i=>{a=await e(i),n()})});else if(typeof OffscreenCanvas<"u"&&r instanceof OffscreenCanvas){const n=await r.convertToBlob();a=await e(n)}else(r instanceof File||r instanceof Blob)&&(a=await e(r));return new Uint8Array(a)};return qa=t,qa}var Wa,up;function b0(){if(up)return Wa;up=1;const e=f0(),t=h0(),r=m0(),a=g0(),n=y0(),i=_0();return Wa={defaultOptions:e,spawnWorker:t,terminateWorker:r,onMessage:a,send:n,loadImage:i},Wa}var Ga,lp;function am(){if(lp)return Ga;lp=1;const e=l0(),t=rm(),{log:r}=Zn(),a=Kn(),n=im(),{defaultOptions:i,spawnWorker:s,terminateWorker:u,onMessage:d,loadImage:l,send:c}=b0();let f=0;return Ga=async(h="eng",g=n.LSTM_ONLY,y={},b={})=>{const x=a("Worker",f),{logger:v,errorHandler:w,...k}=e({...i,...y}),S={},I=typeof h=="string"?h.split("+"):h;let C=g,z=b;const A=[n.DEFAULT,n.LSTM_ONLY].includes(g)&&!k.legacyCore;let O,G;const X=new Promise((ae,le)=>{G=ae,O=le}),K=ae=>{O(ae.message)};let F=s(k);F.onerror=K,f+=1;const Z=({id:ae,action:le,payload:ce})=>new Promise((de,Te)=>{r(`[${x}]: Start ${ae}, action=${le}`);const De=`${le}-${ae}`;S[De]={resolve:de,reject:Te},c(F,{workerId:x,jobId:ae,action:le,payload:ce})}),ie=()=>console.warn("`load` is depreciated and should be removed from code (workers now come pre-loaded)"),H=ae=>Z(t({id:ae,action:"load",payload:{options:{lstmOnly:A,corePath:k.corePath,logging:k.logging}}})),j=(ae,le,ce)=>Z(t({id:ce,action:"FS",payload:{method:"writeFile",args:[ae,le]}})),he=(ae,le)=>Z(t({id:le,action:"FS",payload:{method:"readFile",args:[ae,{encoding:"utf8"}]}})),N=(ae,le)=>Z(t({id:le,action:"FS",payload:{method:"unlink",args:[ae]}})),M=(ae,le,ce)=>Z(t({id:ce,action:"FS",payload:{method:ae,args:le}})),E=(ae,le)=>Z(t({id:le,action:"loadLanguage",payload:{langs:ae,options:{langPath:k.langPath,dataPath:k.dataPath,cachePath:k.cachePath,cacheMethod:k.cacheMethod,gzip:k.gzip,lstmOnly:[n.DEFAULT,n.LSTM_ONLY].includes(C)&&!k.legacyLang}}})),B=(ae,le,ce,de)=>Z(t({id:de,action:"initialize",payload:{langs:ae,oem:le,config:ce}})),L=(ae="eng",le,ce,de)=>{if(A&&[n.TESSERACT_ONLY,n.TESSERACT_LSTM_COMBINED].includes(le))throw Error("Legacy model requested but code missing.");const Te=le||C;C=Te;const De=ce||z;z=De;const dt=(typeof ae=="string"?ae.split("+"):ae).filter(vr=>!I.includes(vr));return I.push(...dt),dt.length>0?E(dt,de).then(()=>B(ae,Te,De,de)):B(ae,Te,De,de)},Q=(ae={},le)=>Z(t({id:le,action:"setParameters",payload:{params:ae}})),ge=async(ae,le={},ce={text:!0},de)=>Z(t({id:de,action:"recognize",payload:{image:await l(ae),options:le,output:ce}})),U=async(ae,le)=>{if(A)throw Error("`worker.detect` requires Legacy model, which was not loaded.");return Z(t({id:le,action:"detect",payload:{image:await l(ae)}}))},ue=async()=>(F!==null&&(u(F),F=null),Promise.resolve());d(F,({workerId:ae,jobId:le,status:ce,action:de,data:Te})=>{const De=`${de}-${le}`;if(ce==="resolve")r(`[${ae}]: Complete ${le}`),S[De].resolve({jobId:le,data:Te}),delete S[De];else if(ce==="reject")if(S[De].reject(Te),delete S[De],de==="load"&&O(Te),w)w(Te);else throw Error(Te);else ce==="progress"&&v({...Te,userJobId:le})});const ve={id:x,worker:F,load:ie,writeText:j,readText:he,removeFile:N,FS:M,reinitialize:L,setParameters:Q,recognize:ge,detect:U,terminate:ue};return H().then(()=>E(h)).then(()=>B(h,g,b)).then(()=>G(ve)).catch(()=>{}),X},Ga}var ja,dp;function w0(){if(dp)return ja;dp=1;const e=am();return ja={recognize:async(a,n,i)=>{const s=await e(n,1,i);return s.recognize(a).finally(async()=>{await s.terminate()})},detect:async(a,n)=>{const i=await e("osd",0,n);return i.detect(a).finally(async()=>{await i.terminate()})}},ja}var Va,pp;function v0(){return pp||(pp=1,Va={AFR:"afr",AMH:"amh",ARA:"ara",ASM:"asm",AZE:"aze",AZE_CYRL:"aze_cyrl",BEL:"bel",BEN:"ben",BOD:"bod",BOS:"bos",BUL:"bul",CAT:"cat",CEB:"ceb",CES:"ces",CHI_SIM:"chi_sim",CHI_TRA:"chi_tra",CHR:"chr",CYM:"cym",DAN:"dan",DEU:"deu",DZO:"dzo",ELL:"ell",ENG:"eng",ENM:"enm",EPO:"epo",EST:"est",EUS:"eus",FAS:"fas",FIN:"fin",FRA:"fra",FRK:"frk",FRM:"frm",GLE:"gle",GLG:"glg",GRC:"grc",GUJ:"guj",HAT:"hat",HEB:"heb",HIN:"hin",HRV:"hrv",HUN:"hun",IKU:"iku",IND:"ind",ISL:"isl",ITA:"ita",ITA_OLD:"ita_old",JAV:"jav",JPN:"jpn",KAN:"kan",KAT:"kat",KAT_OLD:"kat_old",KAZ:"kaz",KHM:"khm",KIR:"kir",KOR:"kor",KUR:"kur",LAO:"lao",LAT:"lat",LAV:"lav",LIT:"lit",MAL:"mal",MAR:"mar",MKD:"mkd",MLT:"mlt",MSA:"msa",MYA:"mya",NEP:"nep",NLD:"nld",NOR:"nor",ORI:"ori",PAN:"pan",POL:"pol",POR:"por",PUS:"pus",RON:"ron",RUS:"rus",SAN:"san",SIN:"sin",SLK:"slk",SLV:"slv",SPA:"spa",SPA_OLD:"spa_old",SQI:"sqi",SRP:"srp",SRP_LATN:"srp_latn",SWA:"swa",SWE:"swe",SYR:"syr",TAM:"tam",TEL:"tel",TGK:"tgk",TGL:"tgl",THA:"tha",TIR:"tir",TUR:"tur",UIG:"uig",UKR:"ukr",URD:"urd",UZB:"uzb",UZB_CYRL:"uzb_cyrl",VIE:"vie",YID:"yid"}),Va}var Ha,cp;function $0(){return cp||(cp=1,Ha={OSD_ONLY:"0",AUTO_OSD:"1",AUTO_ONLY:"2",AUTO:"3",SINGLE_COLUMN:"4",SINGLE_BLOCK_VERT_TEXT:"5",SINGLE_BLOCK:"6",SINGLE_LINE:"7",SINGLE_WORD:"8",CIRCLE_WORD:"9",SINGLE_CHAR:"10",SPARSE_TEXT:"11",SPARSE_TEXT_OSD:"12",RAW_LINE:"13"}),Ha}var Fa,fp;function x0(){if(fp)return Fa;fp=1,n0();const e=s0(),t=am(),r=w0(),a=v0(),n=im(),i=$0(),{setLogging:s}=Zn();return Fa={languages:a,OEM:n,PSM:i,createScheduler:e,createWorker:t,setLogging:s,...r},Fa}var S0=x0();let hp=null;async function k0(e){const t=document.createElement("canvas");t.width=e.width,t.height=e.height,t.getContext("2d",{willReadFrequently:!0}).putImageData(e,0,0),hp??(hp=S0.createWorker("eng"));const n=(await(await hp).recognize(t)).data.words??[],i=new Map;for(const d of n){const l=d.text.trim().toLowerCase().replace(/[^a-z0-9]+/g,"");l.length>=3&&(d.confidence??0)>=45&&i.set(l,(i.get(l)??0)+1)}const s=new Set([...i].filter(([,d])=>d>=2).map(([d])=>d)),u=new ImageData(e.width,e.height);for(const d of n){const l=d.text.trim().toLowerCase().replace(/[^a-z0-9]+/g,"");if(!s.has(l))continue;const c=Math.max(0,Math.floor(d.bbox.x0-12)),f=Math.max(0,Math.floor(d.bbox.y0-12)),h=Math.min(e.width,Math.ceil(d.bbox.x1+12)),g=Math.min(e.height,Math.ceil(d.bbox.y1+12));for(let y=f;y<g;y++)for(let b=c;b<h;b++){const x=(y*e.width+b)*4;u.data[x]=u.data[x+1]=u.data[x+2]=255,u.data[x+3]=255}}return u}const I0=document.querySelector("#app"),T0=new URLSearchParams(location.search).get("auto")==="1";I0.innerHTML=`<header><div><span class="eyebrow">ANYPNG / LOCAL AI</span><h1>Inpaint images privately</h1><p>Mask an unwanted overlay and reconstruct it locally in your browser.</p></div><div id="gpu-badge" class="badge">Checking WebGPU…</div></header>
<main><section class="workspace"><div id="dropzone" class="dropzone"><input id="file" type="file" accept="image/png,image/jpeg,image/webp" hidden><button id="upload" class="primary">Upload image</button><span>or drop a PNG, JPG, or WebP here</span></div><div id="canvas-wrap" class="canvas-wrap hidden"><div id="stage"><canvas id="image-canvas"></canvas><canvas id="mask-canvas"></canvas></div></div><div class="toolbar"><label>Brush <input id="brush" type="range" min="4" max="240" value="48"><output id="brush-value">48 px</output></label><label>Mask opacity <input id="opacity" type="range" min="10" max="100" value="55"></label><div class="buttons"><button data-mode="paint" class="tool active">Paint</button><button data-mode="erase" class="tool">Erase</button><button id="undo" class="tool">Undo</button><button id="redo" class="tool">Redo</button><button id="clear" class="tool">Clear</button></div><div class="buttons"><button id="fit" class="tool">Fit</button><button id="reset" class="tool">Reset view</button><button id="before" class="tool">Hold for original</button></div></div></section>
<aside><section class="card"><h2>Inference</h2><div class="segmented"><label><input type="radio" name="size" value="512" checked>512</label><label><input type="radio" name="size" value="768">768</label><label><input type="radio" name="size" value="1024">1024</label><label><input type="radio" name="size" value="auto">Auto</label></div><button id="run" class="primary full" disabled>Remove selected area</button><div id="status" class="status">Upload an image to begin.</div></section><section class="card"><h2>Export</h2><select id="format"><option value="png">PNG</option><option value="jpeg">JPEG</option><option value="webp">WebP</option></select><label class="quality">Quality <input id="quality" type="range" min="10" max="100" value="92"><output id="quality-value">92%</output></label><button id="download" class="secondary full" disabled>Download result</button></section><section class="card diagnostics"><h2>Diagnostics</h2><dl><dt>WebGPU</dt><dd id="gpu-detail">—</dd><dt>Model</dt><dd id="model-time">—</dd><dt>Preprocess</dt><dd id="prep-time">—</dd><dt>Inference</dt><dd id="infer-time">—</dd><dt>Composite</dt><dd id="comp-time">—</dd><dt>Total</dt><dd id="total-time">—</dd></dl><div id="debug" class="debug hidden"></div></section></aside></main>`;const hn=document.querySelector("#image-canvas"),Me=document.querySelector("#mask-canvas"),mn=document.querySelector("#canvas-wrap"),mp=document.querySelector("#stage"),nm=hn.getContext("2d",{willReadFrequently:!0}),Ne=Me.getContext("2d",{willReadFrequently:!0}),wr=new a0;let ze=null,mt=null,ii=!1,sm="paint",gn=.55,yn=48,Ka=1,it=[],He=-1;const fe=e=>document.querySelector(`#${e}`),qe=document.createElement("button");qe.id="benchmark";qe.className="secondary full";qe.disabled=!0;qe.textContent="Benchmark 512 / 768 / 1024";fe("run").after(qe);const Xt=document.createElement("button");Xt.id="auto-mask";Xt.className="secondary full";Xt.disabled=!1;Xt.textContent="Auto-detect watermark (AI)";qe.after(Xt);document.querySelectorAll("input[name=size]").forEach(e=>{e.value!=="512"&&(e.disabled=!0,e.parentElement.title="This bundled LaMa model supports 512×512 only")});qe.textContent="Benchmark 512 (LaMa model)";function Ae(e){fe("status").textContent=e}function qt(){Ne.clearRect(0,0,Me.width,Me.height),it[He]&&Ne.putImageData(it[He],0,0),Ne.globalAlpha=gn,Ne.globalCompositeOperation="source-over",Ne.fillStyle="#ff4d78";const e=Ne.getImageData(0,0,Me.width,Me.height);for(let t=0;t<e.data.length;t+=4)e.data[t+3]&&(e.data[t]=255,e.data[t+1]=77,e.data[t+2]=120,e.data[t+3]=Math.round(255*gn));Ne.putImageData(e,0,0),Ne.globalAlpha=1}function Qn(){ze&&(nm.putImageData(mt&&fe("before").dataset.down!=="1"?mt:ze,0,0),qt())}function om(){const e=Ne.getImageData(0,0,Me.width,Me.height);it=it.slice(0,He+1),it.push(e),He++,qt()}function E0(e){const t=Me.getBoundingClientRect();return{x:Math.max(0,Math.min(Me.width-1,(e.clientX-t.left)*Me.width/t.width)),y:Math.max(0,Math.min(Me.height-1,(e.clientY-t.top)*Me.height/t.height))}}function um(e){const t=E0(e);Ne.save(),Ne.globalCompositeOperation=sm==="erase"?"destination-out":"source-over",Ne.fillStyle="rgba(255,77,120,1)",Ne.beginPath(),Ne.arc(t.x,t.y,yn/2,0,Math.PI*2),Ne.fill(),Ne.restore(),qt()}function Xn(e){Ag(e).then(t=>{ze=t,mt=null,[hn.width,Me.width]=[t.width,t.width],[hn.height,Me.height]=[t.height,t.height],it=[new ImageData(t.width,t.height)],He=0,mn.classList.remove("hidden"),fe("dropzone").classList.add("hidden"),fe("run").removeAttribute("disabled"),qe.disabled=!1,fe("download").setAttribute("disabled",""),ai(),Qn(),Ae(`${t.width} × ${t.height} ready. Paint the area to remove.`)}).catch(()=>Ae("Could not read that image. Try PNG, JPG, or WebP."))}async function Yn(e){Ae("Detecting repeated watermark text locally…");let t=null;try{t=await k0(e)}catch(r){console.warn("[AnyPNG] local OCR unavailable; using visual watermark detection",r)}return t!=null&&t.data.some((r,a)=>a%4===3&&r>0)||(t=r0(e)),t.data.some((r,a)=>a%4===3&&r>0)?(it=[t],He=0,qt(),Ae("AI mask created. Removing the watermark…"),!0):(Ae("No watermark detected. Paint the mask manually."),!1)}Xt.onclick=()=>{ze&&Yn(ze)};function ai(){if(!ze)return;const e=mn.clientWidth-24,t=Math.max(360,window.innerHeight*.65);Ka=Math.min(1,e/ze.width,t/ze.height),mp.style.transform=`scale(${Ka})`,mp.style.transformOrigin="top left",mn.style.height=`${ze.height*Ka+24}px`}fe("upload").onclick=()=>fe("file").click();fe("file").onchange=()=>{var t;const e=(t=fe("file").files)==null?void 0:t[0];e&&Xn(e)};["dragover","drop"].forEach(e=>fe("dropzone").addEventListener(e,t=>{var r;if(t.preventDefault(),e==="drop"){const a=(r=t.dataTransfer)==null?void 0:r.files[0];a&&Xn(a)}}));Me.addEventListener("pointerdown",e=>{ii=!0,Me.setPointerCapture(e.pointerId),um(e)});Me.addEventListener("pointermove",e=>{ii&&um(e)});Me.addEventListener("pointerup",()=>{ii&&(ii=!1,om())});document.querySelectorAll(".tool[data-mode]").forEach(e=>e.onclick=()=>{sm=e.dataset.mode,document.querySelectorAll(".tool[data-mode]").forEach(t=>t.classList.toggle("active",t===e))});fe("brush").oninput=e=>{yn=Number(e.target.value),fe("brush-value").textContent=`${yn} px`};fe("opacity").oninput=e=>{gn=Number(e.target.value)/100,qt()};fe("undo").onclick=()=>{He>0&&(He--,qt())};fe("redo").onclick=()=>{He<it.length-1&&(He++,qt())};fe("clear").onclick=()=>{ze&&(Ne.clearRect(0,0,ze.width,ze.height),om())};fe("fit").onclick=ai;fe("reset").onclick=ai;fe("before").onpointerdown=()=>{fe("before").dataset.down="1",Qn()};fe("before").onpointerup=()=>{delete fe("before").dataset.down,Qn()};fe("quality").oninput=e=>fe("quality-value").textContent=`${e.target.value}%`;async function lm(){if(!ze)return;const e=performance.now();try{Ae("Preparing image…");const t=document.querySelector("input[name=size]:checked").value,r=t==="auto"?"auto":Number(t);mt=await wr.inpaint(ze,it[He],{inferenceSize:r,maskDilation:8,cropPadding:64,blendFeather:8,onStatus:Ae}),nm.putImageData(mt,0,0),fe("download").removeAttribute("disabled");const a=wr.lastTiming;fe("prep-time").textContent=`${Math.round(a.preprocess??0)} ms`,fe("infer-time").textContent=`${Math.round(a.inference??0)} ms`,fe("comp-time").textContent=`${Math.round(a.composite??0)} ms`,fe("total-time").textContent=`${Math.round(performance.now()-e)} ms`,fe("status").textContent="Done. Hold “original” to compare."}catch(t){console.error("[AnyPNG] inpainting error",t),Ae(t instanceof Error?t.message:"Inpainting failed.")}}fe("run").onclick=lm;fe("download").onclick=()=>{if(!mt)return;const e=fe("format").value,t=Number(fe("quality").value)/100;_p(mt).toBlob(a=>{if(!a)return;const n=document.createElement("a");n.href=URL.createObjectURL(a),n.download=`AnyPNG_Inpainted_${Date.now()}.${e}`,n.click(),setTimeout(()=>URL.revokeObjectURL(n.href),1e3)},`image/${e}`,e==="png"?void 0:t)};qe.onclick=async()=>{if(!ze)return;const e=it[He];qe.disabled=!0;try{Ae("Benchmarking 512…"),await wr.inpaint(ze,e,{inferenceSize:512,maskDilation:8,cropPadding:64,blendFeather:8}),console.log("[AnyPNG] benchmark 512",wr.lastTiming),Ae("Benchmark complete. See the developer console for timings.")}catch(t){console.error("[AnyPNG] benchmark failed",t),Ae(t instanceof Error?t.message:"Benchmark failed.")}finally{qe.disabled=!1}};(async()=>{const e=fe("gpu-badge");if(!navigator.gpu){e.textContent="WebGPU unavailable",e.classList.add("error"),fe("gpu-detail").textContent="No";return}e.textContent="WebGPU ready",fe("gpu-detail").textContent="Yes",new URLSearchParams(location.search).get("debug")==="true"&&fe("debug").classList.remove("hidden");try{const r=performance.now();await wr.load(),fe("model-time").textContent=`${Math.round(performance.now()-r)} ms`,Ae("Local model ready. Upload an image to begin.")}catch(r){console.error("[AnyPNG] model load",r),Ae(r instanceof Error?r.message:"Model could not be loaded.")}})();window.addEventListener("resize",ai);async function C0(){const e=new URLSearchParams(location.search).get("job");if(!e)return;const t=await new Promise((r,a)=>{const n=indexedDB.open("anypng-local-editor",1);n.onerror=()=>a(n.error),n.onsuccess=()=>{const i=n.result.transaction("jobs","readonly").objectStore("jobs").get(e);i.onsuccess=()=>{var s;return(s=i.result)!=null&&s.blob?r(i.result.blob):a(new Error("The image hand-off expired."))},i.onerror=()=>a(i.error)}});Xn(t)}C0().catch(e=>{console.error("[AnyPNG] extension image hand-off",e),Ae(e instanceof Error?e.message:"Could not load the selected image.")});async function Jn(){var t;const e=globalThis.chrome;if(!((t=e==null?void 0:e.runtime)!=null&&t.sendMessage))return Ae("Open this editor from the AnyPNG extension to use account credits."),!1;try{const r=await e.runtime.sendMessage({action:"AUTHORIZE_INPAINT"});if(!(r!=null&&r.authorized)||!r.permit)throw new Error((r==null?void 0:r.detail)||"No inpainting credits remaining.");return!0}catch(r){return Ae(r instanceof Error?r.message:"Credit authorization failed."),!1}}const Za=fe("run").onclick;fe("run").onclick=async()=>{await Jn()&&await(Za==null?void 0:Za.call(fe("run"),new PointerEvent("click")))};const Qa=qe.onclick;qe.onclick=async()=>{await Jn()&&await(Qa==null?void 0:Qa.call(qe,new PointerEvent("click")))};let gp=null;window.setInterval(()=>{ze&&ze!==gp&&(gp=ze,T0?z0(ze):Yn(ze))},250);let yp=!1;async function z0(e){var t,r;if(!yp){yp=!0;try{if(!await Yn(e))throw new Error("Automatic watermark detection found no safe mask.");if(!((t=it[He])==null?void 0:t.data.some((i,s)=>s%4===3&&i>0)))throw new Error("Automatic watermark detection found no safe mask.");if(!await Jn())throw new Error("Credit authorization failed.");if(await lm(),!mt)throw new Error("Inpainting did not return an image.");_p(mt).toBlob(i=>{var l;if(!i)return;const s=URL.createObjectURL(i),u=`AnyPNG_Inpainted_${Date.now()}.png`,d=globalThis.chrome;if((l=d==null?void 0:d.runtime)!=null&&l.sendMessage)d.runtime.sendMessage({action:"DOWNLOAD_RESULT",url:s,filename:u}).then(()=>{Ae("Downloaded."),URL.revokeObjectURL(s),window.close()}).catch(c=>{console.error("[AnyPNG] extension download failed",c),Ae("Download failed.")});else{const c=document.createElement("a");c.href=s,c.download=u,c.click(),Ae("Downloaded."),window.setTimeout(()=>{URL.revokeObjectURL(s),window.close()},900)}},"image/png")}catch(a){console.error("[AnyPNG] automatic inpainting failed",a);const n=a instanceof Error?a.message:"Automatic inpainting failed.";Ae(`${n} Open the editor to paint a mask.`);const i=globalThis.chrome;(r=i==null?void 0:i.runtime)!=null&&r.sendMessage&&i.runtime.sendMessage({action:"AUTO_INPAINT_STATUS",ok:!1,detail:n})}}}
