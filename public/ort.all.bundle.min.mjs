var si,Ar,sr,NT,op,ap,up,ot,me,cp,dp,Cs,fp,hp,mp,gp,bp,Or,vo,_p,vp,xp,Tp,dt,St,li,Sp,$t,yt,ur,lr,ci,LT,PT=Object.create,ai=Object.defineProperty,ET=Object.getOwnPropertyDescriptor,CT=Object.getOwnPropertyNames,DT=Object.getPrototypeOf,kT=Object.prototype.hasOwnProperty,Os=(e=>"u">typeof require?require:"u">typeof Proxy?new Proxy(e,{get:(e,t)=>("u">typeof require?require:e)[t]}):e)(function(e){if("u">typeof require)return require.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')}),k=(e,t)=>()=>(e&&(t=e(e=0)),t),oe=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),$r=(e,t)=>{for(var i in t)ai(e,i,{get:t[i],enumerable:!0})},rp=(e,t,i,n)=>{if(t&&"object"==typeof t||"function"==typeof t)for(let o of CT(t))kT.call(e,o)||o===i||ai(e,o,{get:()=>t[o],enumerable:!(n=ET(t,o))||n.enumerable});return e},ve=(e,t,i)=>(i=null!=e?PT(DT(e)):{},rp(!t&&e&&e.__esModule?i:ai(i,"default",{value:e,enumerable:!0}),e)),Jr=e=>rp(ai({},"__esModule",{value:!0}),e),Ps=k(()=>{"use strict";si=new Map,Ar=[],sr=(e,t,i)=>{if(t&&"function"==typeof t.init&&"function"==typeof t.createInferenceSessionHandler){let n=si.get(e);if(void 0===n)si.set(e,{backend:t,priority:i});else{if(n.priority>i)return;if(n.priority===i&&n.backend!==t)throw Error(`cannot register backend "${e}" using priority ${i}`)}if(i>=0){let t=Ar.indexOf(e);-1!==t&&Ar.splice(t,1);for(let t=0;t<Ar.length;t++)if(si.get(Ar[t]).priority<=i)return void Ar.splice(t,0,e);Ar.push(e)}return}throw TypeError("not a valid backend")},NT=async e=>{let t=si.get(e);if(!t)return"backend not found.";if(t.initialized)return t.backend;if(t.aborted)return t.error;{let i=!!t.initPromise;try{return i||(t.initPromise=t.backend.init(e)),await t.initPromise,t.initialized=!0,t.backend}catch(e){return i||(t.error=`${e}`,t.aborted=!0),t.error}finally{delete t.initPromise}}},op=async e=>{let t=e.executionProviders||[],i=t.map(e=>"string"==typeof e?e:e.name),n=0===i.length?Ar:i,o,a=[],s=new Set;for(let e of n){let t=await NT(e);"string"==typeof t?a.push({name:e,err:t}):(o||(o=t),o===t&&s.add(e))}if(!o)throw Error(`no available backend found. ERR: ${a.map(e=>`[${e.name}] ${e.err}`).join(", ")}`);for(let{name:e,err:t}of a)i.includes(e)&&console.warn(`removing requested execution provider "${e}" from session options because it is not available: ${t}`);let u=t.filter(e=>s.has("string"==typeof e?e:e.name));return[o,new Proxy(e,{get:(e,t)=>"executionProviders"===t?u:Reflect.get(e,t)})]}}),ip=k(()=>{"use strict";Ps()}),sp=k(()=>{"use strict";ap="1.23.0"}),Es=k(()=>{"use strict";sp(),up="warning",Object.defineProperty(ot={wasm:{},webgl:{},webgpu:{},versions:{common:ap},set logLevel(r){if(void 0!==r){if("string"!=typeof r||-1===["verbose","info","warning","error","fatal"].indexOf(r))throw Error(`Unsupported logging level: ${r}`);up=r}},get logLevel(){return up}},"logLevel",{enumerable:!0})}),lp=k(()=>{"use strict";Es(),me=ot}),pp=k(()=>{"use strict";cp=(e,t)=>{let i="u">typeof document?document.createElement("canvas"):new OffscreenCanvas(1,1);i.width=e.dims[3],i.height=e.dims[2];let n=i.getContext("2d");if(null!=n){let o,a;t?.tensorLayout!==void 0&&"NHWC"===t.tensorLayout?(o=e.dims[2],a=e.dims[3]):(o=e.dims[3],a=e.dims[2]);let s=t?.format!==void 0?t.format:"RGB",u=t?.norm,l,d;void 0===u||void 0===u.mean?l=[255,255,255,255]:"number"==typeof u.mean?l=[u.mean,u.mean,u.mean,u.mean]:(l=[u.mean[0],u.mean[1],u.mean[2],0],void 0!==u.mean[3]&&(l[3]=u.mean[3])),void 0===u||void 0===u.bias?d=[0,0,0,0]:"number"==typeof u.bias?d=[u.bias,u.bias,u.bias,u.bias]:(d=[u.bias[0],u.bias[1],u.bias[2],0],void 0!==u.bias[3]&&(d[3]=u.bias[3]));let p=a*o,c=0,h=p,f=2*p,m=-1;"RGBA"===s?(c=0,h=p,f=2*p,m=3*p):"RGB"===s?(c=0,h=p,f=2*p):"RBG"===s&&(c=0,f=p,h=2*p);for(let t=0;t<a;t++)for(let i=0;i<o;i++)n.fillStyle="rgba("+(e.data[c++]-d[0])*l[0]+","+(e.data[h++]-d[1])*l[1]+","+(e.data[f++]-d[2])*l[2]+","+(-1===m?255:(e.data[m++]-d[3])*l[3])+")",n.fillRect(i,t,1,1);if("toDataURL"in i)return i.toDataURL();throw Error("toDataURL is not supported")}throw Error("Can not access image data")},dp=(e,t)=>{let i="u">typeof document?document.createElement("canvas").getContext("2d"):new OffscreenCanvas(1,1).getContext("2d"),n;if(null!=i){let o,a,s;t?.tensorLayout!==void 0&&"NHWC"===t.tensorLayout?(o=e.dims[2],a=e.dims[1],s=e.dims[3]):(o=e.dims[3],a=e.dims[2],s=e.dims[1]);let u=void 0!==t&&void 0!==t.format?t.format:"RGB",l=t?.norm,d,p;void 0===l||void 0===l.mean?d=[255,255,255,255]:"number"==typeof l.mean?d=[l.mean,l.mean,l.mean,l.mean]:(d=[l.mean[0],l.mean[1],l.mean[2],255],void 0!==l.mean[3]&&(d[3]=l.mean[3])),void 0===l||void 0===l.bias?p=[0,0,0,0]:"number"==typeof l.bias?p=[l.bias,l.bias,l.bias,l.bias]:(p=[l.bias[0],l.bias[1],l.bias[2],0],void 0!==l.bias[3]&&(p[3]=l.bias[3]));let c=a*o;if(void 0!==t&&(void 0!==t.format&&4===s&&"RGBA"!==t.format||3===s&&"RGB"!==t.format&&"BGR"!==t.format))throw Error("Tensor format doesn't match input tensor dims");let h=4,f=0,m=1,g=2,b=3,y=0,_=c,v=2*c,x=-1;"RGBA"===u?(y=0,_=c,v=2*c,x=3*c):"RGB"===u?(y=0,_=c,v=2*c):"RBG"===u&&(y=0,v=c,_=2*c),n=i.createImageData(o,a);for(let t=0;t<a*o;f+=h,m+=h,g+=h,b+=h,t++)n.data[f]=(e.data[y++]-p[0])*d[0],n.data[m]=(e.data[_++]-p[1])*d[1],n.data[g]=(e.data[v++]-p[2])*d[2],n.data[b]=-1===x?255:(e.data[x++]-p[3])*d[3]}else throw Error("Can not access image data");return n}}),yp=k(()=>{"use strict";ui(),Cs=(e,t)=>{if(void 0===e)throw Error("Image buffer must be defined");if(void 0===t.height||void 0===t.width)throw Error("Image height and width must be defined");if("NHWC"===t.tensorLayout)throw Error("NHWC Tensor layout is not supported yet");let{height:i,width:n}=t,o=t.norm??{mean:255,bias:0},a,s;a="number"==typeof o.mean?[o.mean,o.mean,o.mean,o.mean]:[o.mean[0],o.mean[1],o.mean[2],o.mean[3]??255],s="number"==typeof o.bias?[o.bias,o.bias,o.bias,o.bias]:[o.bias[0],o.bias[1],o.bias[2],o.bias[3]??0];let u=void 0!==t.format?t.format:"RGBA",l=void 0!==t.tensorFormat&&void 0!==t.tensorFormat?t.tensorFormat:"RGB",d=i*n,p=new Float32Array("RGBA"===l?4*d:3*d),c=4,h=0,f=1,m=2,g=3,b=0,y=d,_=2*d,v=-1;"RGB"===u&&(c=3,h=0,f=1,m=2,g=-1),"RGBA"===l?v=3*d:"RBG"===l?(b=0,_=d,y=2*d):"BGR"===l&&(_=0,y=d,b=2*d);for(let t=0;t<d;t++,h+=c,m+=c,f+=c,g+=c)p[b++]=(e[h]+s[0])/a[0],p[y++]=(e[f]+s[1])/a[1],p[_++]=(e[m]+s[2])/a[2],-1!==v&&-1!==g&&(p[v++]=(e[g]+s[3])/a[3]);return"RGBA"===l?new dt("float32",p,[1,4,i,n]):new dt("float32",p,[1,3,i,n])},fp=async(e,t)=>{let i="u">typeof HTMLImageElement&&e instanceof HTMLImageElement,n="u">typeof ImageData&&e instanceof ImageData,o="u">typeof ImageBitmap&&e instanceof ImageBitmap,a="string"==typeof e,s,u=t??{},l=()=>{if("u">typeof document)return document.createElement("canvas");if("u">typeof OffscreenCanvas)return new OffscreenCanvas(1,1);throw Error("Canvas is not supported")},d=e=>"u">typeof HTMLCanvasElement&&e instanceof HTMLCanvasElement||e instanceof OffscreenCanvas?e.getContext("2d"):null;if(i){let i=l();i.width=e.width,i.height=e.height;let n=d(i);if(null!=n){let i=e.height,o=e.width;if(void 0!==t&&void 0!==t.resizedHeight&&void 0!==t.resizedWidth&&(i=t.resizedHeight,o=t.resizedWidth),void 0!==t){if(u=t,void 0!==t.tensorFormat)throw Error("Image input config format must be RGBA for HTMLImageElement");u.tensorFormat="RGBA",u.height=i,u.width=o}else u.tensorFormat="RGBA",u.height=i,u.width=o;n.drawImage(e,0,0),s=n.getImageData(0,0,o,i).data}else throw Error("Can not access image data")}else if(n){let i,n;if(void 0!==t&&void 0!==t.resizedWidth&&void 0!==t.resizedHeight?(i=t.resizedHeight,n=t.resizedWidth):(i=e.height,n=e.width),void 0!==t&&(u=t),u.format="RGBA",u.height=i,u.width=n,void 0!==t){let t=l();t.width=n,t.height=i;let o=d(t);if(null!=o)o.putImageData(e,0,0),s=o.getImageData(0,0,n,i).data;else throw Error("Can not access image data")}else s=e.data}else if(o){if(void 0===t)throw Error("Please provide image config with format for Imagebitmap");let i=l();i.width=e.width,i.height=e.height;let n=d(i);if(null!=n){let t=e.height,i=e.width;return n.drawImage(e,0,0,i,t),s=n.getImageData(0,0,i,t).data,u.height=t,u.width=i,Cs(s,u)}throw Error("Can not access image data")}else{if(a)return new Promise((t,i)=>{let n=l(),o=d(n);if(!e||!o)return i();let a=new Image;a.crossOrigin="Anonymous",a.src=e,a.onload=()=>{n.width=a.width,n.height=a.height,o.drawImage(a,0,0,n.width,n.height);let e=o.getImageData(0,0,n.width,n.height);u.height=n.height,u.width=n.width,t(Cs(e.data,u))}});throw Error("Input data provided is not supported - aborted tensor creation")}if(void 0!==s)return Cs(s,u);throw Error("Input data provided is not supported - aborted tensor creation")},hp=(e,t)=>{let{width:i,height:n,download:o,dispose:a}=t;return new dt({location:"texture",type:"float32",texture:e,dims:[1,n,i,4],download:o,dispose:a})},mp=(e,t)=>{let{dataType:i,dims:n,download:o,dispose:a}=t;return new dt({location:"gpu-buffer",type:i??"float32",gpuBuffer:e,dims:n,download:o,dispose:a})},gp=(e,t)=>{let{dataType:i,dims:n,download:o,dispose:a}=t;return new dt({location:"ml-tensor",type:i??"float32",mlTensor:e,dims:n,download:o,dispose:a})},bp=(e,t,i)=>new dt({location:"cpu-pinned",type:e,data:t,dims:i??[t.length]})}),wp=k(()=>{"use strict";Or=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],["int16",Int16Array],["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array],["int4",Uint8Array],["uint4",Uint8Array]]),vo=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],[Int16Array,"int16"],[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]),_p=!1,vp=()=>{if(!_p){_p=!0;let e="u">typeof BigInt64Array&&BigInt64Array.from,t="u">typeof BigUint64Array&&BigUint64Array.from,i=globalThis.Float16Array,n="u">typeof i&&i.from;e&&(Or.set("int64",BigInt64Array),vo.set(BigInt64Array,"int64")),t&&(Or.set("uint64",BigUint64Array),vo.set(BigUint64Array,"uint64")),n?(Or.set("float16",i),vo.set(i,"float16")):Or.set("float16",Uint16Array)}}}),Ip=k(()=>{"use strict";ui(),xp=e=>{let t=1;for(let i=0;i<e.length;i++){let n=e[i];if("number"!=typeof n||!Number.isSafeInteger(n))throw TypeError(`dims[${i}] must be an integer, got: ${n}`);if(n<0)throw RangeError(`dims[${i}] must be a non-negative integer, got: ${n}`);t*=n}return t},Tp=(e,t)=>{switch(e.location){case"cpu":return new dt(e.type,e.data,t);case"cpu-pinned":return new dt({location:"cpu-pinned",data:e.data,type:e.type,dims:t});case"texture":return new dt({location:"texture",texture:e.texture,type:e.type,dims:t});case"gpu-buffer":return new dt({location:"gpu-buffer",gpuBuffer:e.gpuBuffer,type:e.type,dims:t});case"ml-tensor":return new dt({location:"ml-tensor",mlTensor:e.mlTensor,type:e.type,dims:t});default:throw Error(`tensorReshape: tensor location ${e.location} is not supported`)}}}),ui=k(()=>{"use strict";pp(),yp(),wp(),Ip(),dt=class{constructor(e,t,i){let n,o;if(vp(),"object"==typeof e&&"location"in e)switch(this.dataLocation=e.location,n=e.type,o=e.dims,e.location){case"cpu-pinned":{let t=Or.get(n);if(!t)throw TypeError(`unsupported type "${n}" to create tensor from pinned buffer`);if(!(e.data instanceof t))throw TypeError(`buffer should be of type ${t.name}`);this.cpuData=e.data;break}case"texture":if("float32"!==n)throw TypeError(`unsupported type "${n}" to create tensor from texture`);this.gpuTextureData=e.texture,this.downloader=e.download,this.disposer=e.dispose;break;case"gpu-buffer":if("float32"!==n&&"float16"!==n&&"int32"!==n&&"int64"!==n&&"uint32"!==n&&"uint8"!==n&&"bool"!==n&&"uint4"!==n&&"int4"!==n)throw TypeError(`unsupported type "${n}" to create tensor from gpu buffer`);this.gpuBufferData=e.gpuBuffer,this.downloader=e.download,this.disposer=e.dispose;break;case"ml-tensor":if("float32"!==n&&"float16"!==n&&"int32"!==n&&"int64"!==n&&"uint32"!==n&&"uint64"!==n&&"int8"!==n&&"uint8"!==n&&"bool"!==n&&"uint4"!==n&&"int4"!==n)throw TypeError(`unsupported type "${n}" to create tensor from MLTensor`);this.mlTensorData=e.mlTensor,this.downloader=e.download,this.disposer=e.dispose;break;default:throw Error(`Tensor constructor: unsupported location '${this.dataLocation}'`)}else{let a,s;if("string"==typeof e)if(n=e,s=i,"string"===e){if(!Array.isArray(t))throw TypeError("A string tensor's data must be a string array.");a=t}else{let i=Or.get(e);if(void 0===i)throw TypeError(`Unsupported tensor type: ${e}.`);if(Array.isArray(t)){if("float16"===e&&i===Uint16Array||"uint4"===e||"int4"===e)throw TypeError(`Creating a ${e} tensor from number array is not supported. Please use ${i.name} as data.`);a="uint64"===e||"int64"===e?i.from(t,BigInt):i.from(t)}else if(t instanceof i)a=t;else if(t instanceof Uint8ClampedArray)if("uint8"===e)a=Uint8Array.from(t);else throw TypeError("A Uint8ClampedArray tensor's data must be type of uint8");else if("float16"===e&&t instanceof Uint16Array&&i!==Uint16Array)a=new globalThis.Float16Array(t.buffer,t.byteOffset,t.length);else throw TypeError(`A ${n} tensor's data must be type of ${i}`)}else if(s=t,Array.isArray(e)){if(0===e.length)throw TypeError("Tensor type cannot be inferred from an empty array.");let t=typeof e[0];if("string"===t)n="string",a=e;else if("boolean"===t)n="bool",a=Uint8Array.from(e);else throw TypeError(`Invalid element type of data array: ${t}.`)}else if(e instanceof Uint8ClampedArray)n="uint8",a=Uint8Array.from(e);else{let t=vo.get(e.constructor);if(void 0===t)throw TypeError(`Unsupported type for tensor data: ${e.constructor}.`);n=t,a=e}if(void 0===s)s=[a.length];else if(!Array.isArray(s))throw TypeError("A tensor's dims must be a number array");o=s,this.cpuData=a,this.dataLocation="cpu"}let a=xp(o);if(this.cpuData&&a!==this.cpuData.length&&("uint4"!==n&&"int4"!==n||Math.ceil(a/2)!==this.cpuData.length))throw Error(`Tensor's size(${a}) does not match data length(${this.cpuData.length}).`);this.type=n,this.dims=o,this.size=a}static async fromImage(e,t){return fp(e,t)}static fromTexture(e,t){return hp(e,t)}static fromGpuBuffer(e,t){return mp(e,t)}static fromMLTensor(e,t){return gp(e,t)}static fromPinnedBuffer(e,t,i){return bp(e,t,i)}toDataURL(e){return cp(this,e)}toImageData(e){return dp(this,e)}get data(){if(this.ensureValid(),!this.cpuData)throw Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw Error("The data is not stored as a WebGL texture.");return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw Error("The data is not stored as a WebGPU buffer.");return this.gpuBufferData}get mlTensor(){if(this.ensureValid(),!this.mlTensorData)throw Error("The data is not stored as a WebNN MLTensor.");return this.mlTensorData}async getData(e){switch(this.ensureValid(),this.dataLocation){case"cpu":case"cpu-pinned":return this.data;case"texture":case"gpu-buffer":case"ml-tensor":if(!this.downloader)throw Error("The current tensor is not created with a specified data downloader.");if(this.isDownloading)throw Error("The current tensor is being downloaded.");try{this.isDownloading=!0;let t=await this.downloader();return this.downloader=void 0,this.dataLocation="cpu",this.cpuData=t,e&&this.disposer&&(this.disposer(),this.disposer=void 0),t}finally{this.isDownloading=!1}default:throw Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.isDownloading)throw Error("The current tensor is being downloaded.");this.disposer&&(this.disposer(),this.disposer=void 0),this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.mlTensorData=void 0,this.downloader=void 0,this.isDownloading=void 0,this.dataLocation="none"}ensureValid(){if("none"===this.dataLocation)throw Error("The tensor is disposed.")}reshape(e){if(this.ensureValid(),this.downloader||this.disposer)throw Error("Cannot reshape a tensor that owns GPU resource.");return Tp(this,e)}}}),Ds=k(()=>{"use strict";ui(),St=dt}),ks=k(()=>{"use strict";Es(),li=(e,t)=>{(typeof ot.trace>"u"?ot.wasm.trace:ot.trace)&&console.timeStamp(`${e}::ORT::${t}`)},Sp=(e,t)=>{let i=Error().stack?.split(/\r\n|\r|\n/g)||[],n=!1;for(let o=0;o<i.length;o++){if(n&&!i[o].includes("TRACE_FUNC")){let n=`FUNC_${e}::${i[o].trim().split(" ")[1]}`;t&&(n+=`::${t}`),li("CPU",n);return}i[o].includes("TRACE_FUNC")&&(n=!0)}},$t=e=>{(typeof ot.trace>"u"?ot.wasm.trace:ot.trace)&&Sp("BEGIN",e)},yt=e=>{(typeof ot.trace>"u"?ot.wasm.trace:ot.trace)&&Sp("END",e)},ur=e=>{(typeof ot.trace>"u"?ot.wasm.trace:ot.trace)&&console.time(`ORT::${e}`)},lr=e=>{(typeof ot.trace>"u"?ot.wasm.trace:ot.trace)&&console.timeEnd(`ORT::${e}`)}}),$p=k(()=>{"use strict";Ps(),Ds(),ks(),ci=class e{constructor(e){this.handler=e}async run(e,t,i){$t(),ur("InferenceSession.run");let n={},o={};if("object"!=typeof e||null===e||e instanceof St||Array.isArray(e))throw TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");let a=!0;if("object"==typeof t){if(null===t)throw TypeError("Unexpected argument[1]: cannot be null.");if(t instanceof St)throw TypeError("'fetches' cannot be a Tensor");if(Array.isArray(t)){if(0===t.length)throw TypeError("'fetches' cannot be an empty array.");for(let e of(a=!1,t)){if("string"!=typeof e)throw TypeError("'fetches' must be a string array or an object.");if(-1===this.outputNames.indexOf(e))throw RangeError(`'fetches' contains invalid output name: ${e}.`);n[e]=null}if("object"==typeof i&&null!==i)o=i;else if("u">typeof i)throw TypeError("'options' must be an object.")}else{let e=!1,s=Object.getOwnPropertyNames(t);for(let i of this.outputNames)if(-1!==s.indexOf(i)){let o=t[i];(null===o||o instanceof St)&&(e=!0,a=!1,n[i]=o)}if(e){if("object"==typeof i&&null!==i)o=i;else if("u">typeof i)throw TypeError("'options' must be an object.")}else o=t}}else if("u">typeof t)throw TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");for(let t of this.inputNames)if(typeof e[t]>"u")throw Error(`input '${t}' is missing in 'feeds'.`);if(a)for(let e of this.outputNames)n[e]=null;let s=await this.handler.run(e,n,o),u={};for(let e in s)if(Object.hasOwnProperty.call(s,e)){let t=s[e];t instanceof St?u[e]=t:u[e]=new St(t.type,t.data,t.dims)}return lr("InferenceSession.run"),yt(),u}async release(){return this.handler.dispose()}static async create(t,i,n,o){$t(),ur("InferenceSession.create");let a,s={};if("string"==typeof t){if(a=t,"object"==typeof i&&null!==i)s=i;else if("u">typeof i)throw TypeError("'options' must be an object.")}else if(t instanceof Uint8Array){if(a=t,"object"==typeof i&&null!==i)s=i;else if("u">typeof i)throw TypeError("'options' must be an object.")}else if(t instanceof ArrayBuffer||"u">typeof SharedArrayBuffer&&t instanceof SharedArrayBuffer){let e=t,u=0,l=t.byteLength;if("object"==typeof i&&null!==i)s=i;else if("number"==typeof i){if(!Number.isSafeInteger(u=i))throw RangeError("'byteOffset' must be an integer.");if(u<0||u>=e.byteLength)throw RangeError(`'byteOffset' is out of range [0, ${e.byteLength}).`);if(l=t.byteLength-u,"number"==typeof n){if(!Number.isSafeInteger(l=n))throw RangeError("'byteLength' must be an integer.");if(l<=0||u+l>e.byteLength)throw RangeError(`'byteLength' is out of range (0, ${e.byteLength-u}].`);if("object"==typeof o&&null!==o)s=o;else if("u">typeof o)throw TypeError("'options' must be an object.")}else if("u">typeof n)throw TypeError("'byteLength' must be a number.")}else if("u">typeof i)throw TypeError("'options' must be an object.");a=new Uint8Array(e,u,l)}else throw TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let[u,l]=await op(s),d=await u.createInferenceSessionHandler(a,l);return lr("InferenceSession.create"),yt(),new e(d)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}get inputMetadata(){return this.handler.inputMetadata}get outputMetadata(){return this.handler.outputMetadata}}}),Ap=k(()=>{"use strict";$p(),LT=ci}),Op=k(()=>{}),Pp=k(()=>{}),Ep=k(()=>{}),Cp=k(()=>{}),Ns={};$r(Ns,{InferenceSession:()=>LT,TRACE:()=>li,TRACE_EVENT_BEGIN:()=>ur,TRACE_EVENT_END:()=>lr,TRACE_FUNC_BEGIN:()=>$t,TRACE_FUNC_END:()=>yt,Tensor:()=>St,env:()=>me,registerBackend:()=>sr});var pt=k(()=>{"use strict";ip(),lp(),Ap(),Ds(),Op(),Pp(),ks(),Ep(),Cp()});function cr(e,t,i,n){if(void 0===t)return zT(e);if(void 0===i)di(e,t,1);else if("number"==typeof i&&void 0===n)di(e,t,i);else if("string"==typeof i&&void 0===n)di(e,i,1,t);else if("string"==typeof i&&"number"==typeof n)di(e,i,n,t);else throw TypeError("input is valid")}function zT(e){return{verbose:cr.verbose.bind(null,e),info:cr.info.bind(null,e),warning:cr.warning.bind(null,e),error:cr.error.bind(null,e),fatal:cr.fatal.bind(null,e)}}function di(e,t,i,n){let o=wo[n||""]||wo[""];kp[e]<kp[o.minimalSeverity]||(o.logDateTime&&(t=`${new Date().toISOString()}|${t}`),o.logSourceLocation,RT[o.provider].log(e,t,n))}var Ls,Rs,kp,RT,Np,wo,Fe,fi,hi,mi,pi,Ct=k(()=>{"use strict";Ls=class{log(e,t,i){}},Rs=class{log(e,t,i){console.log(`${this.color(e)} ${i?"\x1b[35m"+i+"\x1b[0m ":""}${t}`)}color(e){switch(e){case"verbose":return"\x1b[34;40mv\x1b[0m";case"info":return"\x1b[32mi\x1b[0m";case"warning":return"\x1b[30;43mw\x1b[0m";case"error":return"\x1b[31;40me\x1b[0m";case"fatal":return"\x1b[101mf\x1b[0m";default:throw Error(`unsupported severity: ${e}`)}}},kp={verbose:1e3,info:2e3,warning:4e3,error:5e3,fatal:6e3},RT={none:new Ls,console:new Rs},wo={"":Np={provider:"console",minimalSeverity:"warning",logDateTime:!0,logSourceLocation:!1}},(e=>{function t(t,i){e("verbose",t,i)}function i(t,i){e("info",t,i)}function n(t,i){e("warning",t,i)}function o(t,i){e("error",t,i)}function a(t,i){e("fatal",t,i)}function s(e){wo={},u("",e||{})}function u(e,t){if("*"===e)s(t);else{let i=wo[e]||Np;wo[e]={provider:t.provider||i.provider,minimalSeverity:t.minimalSeverity||i.minimalSeverity,logDateTime:void 0===t.logDateTime?i.logDateTime:t.logDateTime,logSourceLocation:void 0===t.logSourceLocation?i.logSourceLocation:t.logSourceLocation}}}e.verbose=t,e.info=i,e.warning=n,e.error=o,e.fatal=a,e.reset=s,e.set=u,e.setWithEnv=function(e){let t={};e.logLevel&&(t.minimalSeverity=e.logLevel),u("",t)}})(cr||={}),Fe=cr,fi=class{constructor(e,t,i,n,o,a){this.category=e,this.name=t,this.startTime=i,this.endCallback=n,this.timer=o,this.ctx=a}async end(){return this.endCallback(this)}async checkTimer(){if(void 0===this.ctx||void 0===this.timer)throw Error("No webgl timer found");return this.ctx.endTimer(),this.ctx.waitForQueryAndGetTime(this.timer)}},hi=class{constructor(e,t,i,n){this.category=e,this.name=t,this.startTime=i,this.endTime=n}},mi=class{constructor(e,t,i){this._started=!1,this._flushPointer=0,this._started=!1,this._maxNumberEvents=void 0===e?1e4:e,this._flushBatchSize=void 0===t?10:t,this._flushIntervalInMilliseconds=void 0===i?5e3:i}static create(e){return void 0===e?new this:new this(e.maxNumberEvents,e.flushBatchSize,e.flushIntervalInMilliseconds)}start(){this._started=!0,this._timingEvents=[],this._flushTime=pi(),this._flushPointer=0}stop(){for(this._started=!1;this._flushPointer<this._timingEvents.length;this._flushPointer++)this.logOneEvent(this._timingEvents[this._flushPointer])}event(e,t,i,n){let o=this._started?this.begin(e,t,n):void 0,a=!1,s=i();if(s&&"function"==typeof s.then)return a=!0,new Promise((e,t)=>{s.then(async t=>{o&&await o.end(),e(t)},async e=>{o&&await o.end(),t(e)})});if(!a&&o){let e=o.end();if(e&&"function"==typeof e.then)return new Promise((t,i)=>{e.then(()=>{t(s)},e=>{i(e)})})}return s}begin(e,t,i){if(!this._started)throw Error("profiler is not started yet");if(void 0!==i)return new fi(e,t,0,async e=>this.end(e),i.beginTimer(),i);{let i=pi();return this.flush(i),new fi(e,t,i,e=>this.endSync(e))}}async end(e){let t=await e.checkTimer();this._timingEvents.length<this._maxNumberEvents&&(this._timingEvents.push(new hi(e.category,e.name,e.startTime,t)),this.flush(t))}endSync(e){let t=pi();this._timingEvents.length<this._maxNumberEvents&&(this._timingEvents.push(new hi(e.category,e.name,e.startTime,t)),this.flush(t))}logOneEvent(e){Fe.verbose(`Profiler.${e.category}`,`${(e.endTime-e.startTime).toFixed(2)}ms on event '${e.name}' at ${e.endTime.toFixed(2)}`)}flush(e){if(this._timingEvents.length-this._flushPointer>=this._flushBatchSize||e-this._flushTime>=this._flushIntervalInMilliseconds){for(let e=this._flushPointer;this._flushPointer<e+this._flushBatchSize&&this._flushPointer<this._timingEvents.length;this._flushPointer++)this.logOneEvent(this._timingEvents[this._flushPointer]);this._flushTime=pi()}}get started(){return this._started}},pi="u">typeof performance&&performance.now?()=>performance.now():Date.now});function Lp(e,t,i){for(let n of i){let i=n[0],o=n[1],a=n[2],s=n[3],u=n[4];if(e.opType===i){for(let e of t)if((e.domain===o||"ai.onnx"===e.domain&&""===o)&&MT(e.version,a))return{opImpl:s,opInit:u}}}throw TypeError(`cannot resolve operator '${e.opType}' with opsets: ${t.map(e=>`${e.domain||"ai.onnx"} v${e.version}`).join(", ")}`)}function MT(e,t){if(t.endsWith("+")){let i=Number.parseInt(t.substring(0,t.length-1),10);return!isNaN(i)&&i<=e}if(2!==t.split("-").length)return Number.parseInt(t,10)===e;{let i=t.split("-"),n=Number.parseInt(i[0],10),o=Number.parseInt(i[1],10);return!isNaN(n)&&!isNaN(o)&&n<=e&&e<=o}}var Rp=k(()=>{}),zp=oe(e=>{"use strict";e.__esModule=!0,e.Guid=function(){function e(t){if(!t)throw TypeError("Invalid argument; `value` has no value.");this.value=e.EMPTY,t&&e.isGuid(t)&&(this.value=t)}return e.isGuid=function(t){var i=t.toString();return t&&(t instanceof e||e.validator.test(i))},e.create=function(){return new e([e.gen(2),e.gen(1),e.gen(1),e.gen(1),e.gen(3)].join("-"))},e.createEmpty=function(){return new e("emptyguid")},e.parse=function(t){return new e(t)},e.raw=function(){return[e.gen(2),e.gen(1),e.gen(1),e.gen(1),e.gen(3)].join("-")},e.gen=function(e){for(var t="",i=0;i<e;i++)t+=((1+Math.random())*65536|0).toString(16).substring(1);return t},e.prototype.equals=function(t){return e.isGuid(t)&&this.value===t.toString()},e.prototype.isEmpty=function(){return this.value===e.EMPTY},e.prototype.toString=function(){return this.value},e.prototype.toJSON=function(){return{value:this.value}},e.validator=RegExp("^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$","i"),e.EMPTY="00000000-0000-0000-0000-000000000000",e}()});function Ge(e,t,i){this.low=0|e,this.high=0|t,this.unsigned=!!i}function ht(e){return(e&&e.__isLong__)===!0}function Mp(e){var t=Math.clz32(e&-e);return e?31-t:t}function Pr(e,t){var i,n,o;return t?(e>>>=0,(o=0<=e&&e<256)&&(n=Fp[e])?n:(i=Re(e,0,!0),o&&(Fp[e]=i),i)):(e|=0,(o=-128<=e&&e<128)&&(n=Bp[e])?n:(i=Re(e,e<0?-1:0,!1),o&&(Bp[e]=i),i))}function kt(e,t){if(isNaN(e))return t?Zn:Gt;if(t){if(e<0)return Zn;if(e>=Wp)return qp}else{if(e<=-Gp)return _t;if(e+1>=Gp)return jp}return e<0?kt(-e,t).neg():Re(e%Qr|0,e/Qr|0,t)}function Re(e,t,i){return new Ge(e,t,i)}function Bs(e,t,i){if(0===e.length)throw Error("empty string");if("number"==typeof t?(i=t,t=!1):t=!!t,"NaN"===e||"Infinity"===e||"+Infinity"===e||"-Infinity"===e)return t?Zn:Gt;if((i=i||10)<2||36<i)throw RangeError("radix");if((n=e.indexOf("-"))>0)throw Error("interior hyphen");if(0===n)return Bs(e.substring(1),t,i).neg();for(var n,o=kt(gi(i,8)),a=Gt,s=0;s<e.length;s+=8){var u=Math.min(8,e.length-s),l=parseInt(e.substring(s,s+u),i);if(u<8){var d=kt(gi(i,u));a=a.mul(d).add(kt(l))}else a=(a=a.mul(o)).add(kt(l))}return a.unsigned=t,a}function Ut(e,t){return"number"==typeof e?kt(e,t):"string"==typeof e?Bs(e,t):Re(e.low,e.high,"boolean"==typeof t?t:e.unsigned)}var Dt,Bp,Fp,gi,Vp,FT,Qr,Wp,Gp,Up,Gt,Zn,Yr,Hp,Ms,jp,qp,_t,j,dr,R1,z1,Pi,Lt,M1,B1,F1,V1,G1,U1,W1,H1,el,tl,j1,q1,K1,X1,nl,Z1,J1,Y1,Q1,eS,tS,nS,rS,oS,iS,aS,sS,uS,So,rl,lS,ol,cS,Fs=k(()=>{Dt=null;try{Dt=new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0,97,115,109,1,0,0,0,1,13,2,96,0,1,127,96,4,127,127,127,127,1,127,3,7,6,0,1,1,1,1,1,6,6,1,127,1,65,0,11,7,50,6,3,109,117,108,0,1,5,100,105,118,95,115,0,2,5,100,105,118,95,117,0,3,5,114,101,109,95,115,0,4,5,114,101,109,95,117,0,5,8,103,101,116,95,104,105,103,104,0,0,10,191,1,6,4,0,35,0,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,126,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,127,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,128,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,129,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,130,34,4,66,32,135,167,36,0,32,4,167,11])),{}).exports}catch{}Ge.prototype.__isLong__,Object.defineProperty(Ge.prototype,"__isLong__",{value:!0}),Ge.isLong=ht,Bp={},Fp={},Ge.fromInt=Pr,Ge.fromNumber=kt,Ge.fromBits=Re,gi=Math.pow,Ge.fromString=Bs,Ge.fromValue=Ut,FT=0x1000000,Gp=(Wp=(Qr=(Vp=65536)*Vp)*Qr)/2,Up=Pr(FT),Ge.ZERO=Gt=Pr(0),Ge.UZERO=Zn=Pr(0,!0),Ge.ONE=Yr=Pr(1),Ge.UONE=Hp=Pr(1,!0),Ge.NEG_ONE=Ms=Pr(-1),Ge.MAX_VALUE=jp=Re(-1,0x7fffffff,!1),Ge.MAX_UNSIGNED_VALUE=qp=Re(-1,-1,!0),Ge.MIN_VALUE=_t=Re(0,-0x80000000,!1),(j=Ge.prototype).toInt=function(){return this.unsigned?this.low>>>0:this.low},j.toNumber=function(){return this.unsigned?(this.high>>>0)*Qr+(this.low>>>0):this.high*Qr+(this.low>>>0)},j.toString=function(e){if((e=e||10)<2||36<e)throw RangeError("radix");if(this.isZero())return"0";if(this.isNegative())if(!this.eq(_t))return"-"+this.neg().toString(e);else{var t=kt(e),i=this.div(t),n=i.mul(t).sub(this);return i.toString(e)+n.toInt().toString(e)}for(var o=kt(gi(e,6),this.unsigned),a=this,s="";;){var u=a.div(o),l=(a.sub(u.mul(o)).toInt()>>>0).toString(e);if((a=u).isZero())return l+s;for(;l.length<6;)l="0"+l;s=""+l+s}},j.getHighBits=function(){return this.high},j.getHighBitsUnsigned=function(){return this.high>>>0},j.getLowBits=function(){return this.low},j.getLowBitsUnsigned=function(){return this.low>>>0},j.getNumBitsAbs=function(){if(this.isNegative())return this.eq(_t)?64:this.neg().getNumBitsAbs();for(var e=0!=this.high?this.high:this.low,t=31;t>0&&(e&1<<t)==0;t--);return 0!=this.high?t+33:t+1},j.isZero=function(){return 0===this.high&&0===this.low},j.eqz=j.isZero,j.isNegative=function(){return!this.unsigned&&this.high<0},j.isPositive=function(){return this.unsigned||this.high>=0},j.isOdd=function(){return(1&this.low)==1},j.isEven=function(){return(1&this.low)==0},j.equals=function(e){return ht(e)||(e=Ut(e)),(this.unsigned===e.unsigned||this.high>>>31!=1||e.high>>>31!=1)&&this.high===e.high&&this.low===e.low},j.eq=j.equals,j.notEquals=function(e){return!this.eq(e)},j.neq=j.notEquals,j.ne=j.notEquals,j.lessThan=function(e){return 0>this.comp(e)},j.lt=j.lessThan,j.lessThanOrEqual=function(e){return 0>=this.comp(e)},j.lte=j.lessThanOrEqual,j.le=j.lessThanOrEqual,j.greaterThan=function(e){return this.comp(e)>0},j.gt=j.greaterThan,j.greaterThanOrEqual=function(e){return this.comp(e)>=0},j.gte=j.greaterThanOrEqual,j.ge=j.greaterThanOrEqual,j.compare=function(e){if(ht(e)||(e=Ut(e)),this.eq(e))return 0;var t=this.isNegative(),i=e.isNegative();return t&&!i?-1:!t&&i?1:this.unsigned?e.high>>>0>this.high>>>0||e.high===this.high&&e.low>>>0>this.low>>>0?-1:1:this.sub(e).isNegative()?-1:1},j.comp=j.compare,j.negate=function(){return!this.unsigned&&this.eq(_t)?_t:this.not().add(Yr)},j.neg=j.negate,j.add=function(e){ht(e)||(e=Ut(e));var t,i,n=this.high>>>16,o=65535&this.high,a=this.low>>>16,s=65535&this.low,u=e.high>>>16,l=65535&e.high,d=e.low>>>16,p=65535&e.low,c=0,h=0;return i=0+((t=0+(s+p))>>>16),t&=65535,i+=a+d,h+=i>>>16,i&=65535,h+=o+l,c+=h>>>16,h&=65535,c+=n+u,Re(i<<16|t,(c&=65535)<<16|h,this.unsigned)},j.subtract=function(e){return ht(e)||(e=Ut(e)),this.add(e.neg())},j.sub=j.subtract,j.multiply=function(e){if(this.isZero())return this;if(ht(e)||(e=Ut(e)),Dt)return Re(Dt.mul(this.low,this.high,e.low,e.high),Dt.get_high(),this.unsigned);if(e.isZero())return this.unsigned?Zn:Gt;if(this.eq(_t))return e.isOdd()?_t:Gt;if(e.eq(_t))return this.isOdd()?_t:Gt;if(this.isNegative())return e.isNegative()?this.neg().mul(e.neg()):this.neg().mul(e).neg();if(e.isNegative())return this.mul(e.neg()).neg();if(this.lt(Up)&&e.lt(Up))return kt(this.toNumber()*e.toNumber(),this.unsigned);var t,i,n=this.high>>>16,o=65535&this.high,a=this.low>>>16,s=65535&this.low,u=e.high>>>16,l=65535&e.high,d=e.low>>>16,p=65535&e.low,c=0,h=0;return i=0+((t=0+s*p)>>>16),t&=65535,i+=a*p,h+=i>>>16,i&=65535,i+=s*d,h+=i>>>16,i&=65535,h+=o*p,c+=h>>>16,h&=65535,h+=a*d,c+=h>>>16,h&=65535,h+=s*l,c+=h>>>16,h&=65535,c+=n*p+o*d+a*l+s*u,Re(i<<16|t,(c&=65535)<<16|h,this.unsigned)},j.mul=j.multiply,j.divide=function(e){if(ht(e)||(e=Ut(e)),e.isZero())throw Error("division by zero");if(Dt){var t,i,n;return this.unsigned||-0x80000000!==this.high||-1!==e.low||-1!==e.high?Re((this.unsigned?Dt.div_u:Dt.div_s)(this.low,this.high,e.low,e.high),Dt.get_high(),this.unsigned):this}if(this.isZero())return this.unsigned?Zn:Gt;if(this.unsigned){if(e.unsigned||(e=e.toUnsigned()),e.gt(this))return Zn;if(e.gt(this.shru(1)))return Hp;n=Zn}else{if(this.eq(_t))return e.eq(Yr)||e.eq(Ms)?_t:e.eq(_t)?Yr:(t=this.shr(1).div(e).shl(1)).eq(Gt)?e.isNegative()?Yr:Ms:(i=this.sub(e.mul(t)),n=t.add(i.div(e)));if(e.eq(_t))return this.unsigned?Zn:Gt;if(this.isNegative())return e.isNegative()?this.neg().div(e.neg()):this.neg().div(e).neg();if(e.isNegative())return this.div(e.neg()).neg();n=Gt}for(i=this;i.gte(e);){t=Math.max(1,Math.floor(i.toNumber()/e.toNumber()));for(var o=Math.ceil(Math.log(t)/Math.LN2),a=o<=48?1:gi(2,o-48),s=kt(t),u=s.mul(e);u.isNegative()||u.gt(i);)t-=a,u=(s=kt(t,this.unsigned)).mul(e);s.isZero()&&(s=Yr),n=n.add(s),i=i.sub(u)}return n},j.div=j.divide,j.modulo=function(e){return(ht(e)||(e=Ut(e)),Dt)?Re((this.unsigned?Dt.rem_u:Dt.rem_s)(this.low,this.high,e.low,e.high),Dt.get_high(),this.unsigned):this.sub(this.div(e).mul(e))},j.mod=j.modulo,j.rem=j.modulo,j.not=function(){return Re(~this.low,~this.high,this.unsigned)},j.countLeadingZeros=function(){return this.high?Math.clz32(this.high):Math.clz32(this.low)+32},j.clz=j.countLeadingZeros,j.countTrailingZeros=function(){return this.low?Mp(this.low):Mp(this.high)+32},j.ctz=j.countTrailingZeros,j.and=function(e){return ht(e)||(e=Ut(e)),Re(this.low&e.low,this.high&e.high,this.unsigned)},j.or=function(e){return ht(e)||(e=Ut(e)),Re(this.low|e.low,this.high|e.high,this.unsigned)},j.xor=function(e){return ht(e)||(e=Ut(e)),Re(this.low^e.low,this.high^e.high,this.unsigned)},j.shiftLeft=function(e){return ht(e)&&(e=e.toInt()),0==(e&=63)?this:e<32?Re(this.low<<e,this.high<<e|this.low>>>32-e,this.unsigned):Re(0,this.low<<e-32,this.unsigned)},j.shl=j.shiftLeft,j.shiftRight=function(e){return ht(e)&&(e=e.toInt()),0==(e&=63)?this:e<32?Re(this.low>>>e|this.high<<32-e,this.high>>e,this.unsigned):Re(this.high>>e-32,this.high>=0?0:-1,this.unsigned)},j.shr=j.shiftRight,j.shiftRightUnsigned=function(e){return ht(e)&&(e=e.toInt()),0==(e&=63)?this:e<32?Re(this.low>>>e|this.high<<32-e,this.high>>>e,this.unsigned):32===e?Re(this.high,0,this.unsigned):Re(this.high>>>e-32,0,this.unsigned)},j.shru=j.shiftRightUnsigned,j.shr_u=j.shiftRightUnsigned,j.rotateLeft=function(e){var t;return ht(e)&&(e=e.toInt()),0==(e&=63)?this:32===e?Re(this.high,this.low,this.unsigned):e<32?(t=32-e,Re(this.low<<e|this.high>>>t,this.high<<e|this.low>>>t,this.unsigned)):(e-=32,t=32-e,Re(this.high<<e|this.low>>>t,this.low<<e|this.high>>>t,this.unsigned))},j.rotl=j.rotateLeft,j.rotateRight=function(e){var t;return ht(e)&&(e=e.toInt()),0==(e&=63)?this:32===e?Re(this.high,this.low,this.unsigned):e<32?(t=32-e,Re(this.high<<t|this.low>>>e,this.low<<t|this.high>>>e,this.unsigned)):(e-=32,t=32-e,Re(this.low<<t|this.high>>>e,this.high<<t|this.low>>>e,this.unsigned))},j.rotr=j.rotateRight,j.toSigned=function(){return this.unsigned?Re(this.low,this.high,!1):this},j.toUnsigned=function(){return this.unsigned?this:Re(this.low,this.high,!0)},j.toBytes=function(e){return e?this.toBytesLE():this.toBytesBE()},j.toBytesLE=function(){var e=this.high,t=this.low;return[255&t,t>>>8&255,t>>>16&255,t>>>24,255&e,e>>>8&255,e>>>16&255,e>>>24]},j.toBytesBE=function(){var e=this.high,t=this.low;return[e>>>24,e>>>16&255,e>>>8&255,255&e,t>>>24,t>>>16&255,t>>>8&255,255&t]},Ge.fromBytes=function(e,t,i){return i?Ge.fromBytesLE(e,t):Ge.fromBytesBE(e,t)},Ge.fromBytesLE=function(e,t){return new Ge(e[0]|e[1]<<8|e[2]<<16|e[3]<<24,e[4]|e[5]<<8|e[6]<<16|e[7]<<24,t)},Ge.fromBytesBE=function(e,t){return new Ge(e[4]<<24|e[5]<<16|e[6]<<8|e[7],e[0]<<24|e[1]<<16|e[2]<<8|e[3],t)},dr=Ge}),Vs=oe(e=>{"use strict";var t;Object.defineProperty(e,"__esModule",{value:!0}),e.ArgType=void 0,function(e){e[e.INPUT=0]="INPUT",e[e.OUTPUT=1]="OUTPUT"}(t||(e.ArgType=t={}))}),Er=oe(e=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.SIZE_PREFIX_LENGTH=e.FILE_IDENTIFIER_LENGTH=e.SIZEOF_INT=e.SIZEOF_SHORT=void 0,e.SIZEOF_SHORT=2,e.SIZEOF_INT=4,e.FILE_IDENTIFIER_LENGTH=4,e.SIZE_PREFIX_LENGTH=4}),Gs=oe(e=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.isLittleEndian=e.float64=e.float32=e.int32=void 0,e.int32=new Int32Array(2),e.float32=new Float32Array(e.int32.buffer),e.float64=new Float64Array(e.int32.buffer),e.isLittleEndian=1===new Uint16Array(new Uint8Array([1,0]).buffer)[0]}),Us=oe(e=>{"use strict";var t;Object.defineProperty(e,"__esModule",{value:!0}),e.Encoding=void 0,function(e){e[e.UTF8_BYTES=1]="UTF8_BYTES",e[e.UTF16_STRING=2]="UTF16_STRING"}(t||(e.Encoding=t={}))}),Hs=oe(e=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.ByteBuffer=void 0;var t=Er(),i=Gs(),n=Us();e.ByteBuffer=class e{constructor(e){this.bytes_=e,this.position_=0,this.text_decoder_=new TextDecoder}static allocate(t){return new e(new Uint8Array(t))}clear(){this.position_=0}bytes(){return this.bytes_}position(){return this.position_}setPosition(e){this.position_=e}capacity(){return this.bytes_.length}readInt8(e){return this.readUint8(e)<<24>>24}readUint8(e){return this.bytes_[e]}readInt16(e){return this.readUint16(e)<<16>>16}readUint16(e){return this.bytes_[e]|this.bytes_[e+1]<<8}readInt32(e){return this.bytes_[e]|this.bytes_[e+1]<<8|this.bytes_[e+2]<<16|this.bytes_[e+3]<<24}readUint32(e){return this.readInt32(e)>>>0}readInt64(e){return BigInt.asIntN(64,BigInt(this.readUint32(e))+(BigInt(this.readUint32(e+4))<<BigInt(32)))}readUint64(e){return BigInt.asUintN(64,BigInt(this.readUint32(e))+(BigInt(this.readUint32(e+4))<<BigInt(32)))}readFloat32(e){return i.int32[0]=this.readInt32(e),i.float32[0]}readFloat64(e){return i.int32[+!i.isLittleEndian]=this.readInt32(e),i.int32[+!!i.isLittleEndian]=this.readInt32(e+4),i.float64[0]}writeInt8(e,t){this.bytes_[e]=t}writeUint8(e,t){this.bytes_[e]=t}writeInt16(e,t){this.bytes_[e]=t,this.bytes_[e+1]=t>>8}writeUint16(e,t){this.bytes_[e]=t,this.bytes_[e+1]=t>>8}writeInt32(e,t){this.bytes_[e]=t,this.bytes_[e+1]=t>>8,this.bytes_[e+2]=t>>16,this.bytes_[e+3]=t>>24}writeUint32(e,t){this.bytes_[e]=t,this.bytes_[e+1]=t>>8,this.bytes_[e+2]=t>>16,this.bytes_[e+3]=t>>24}writeInt64(e,t){this.writeInt32(e,Number(BigInt.asIntN(32,t))),this.writeInt32(e+4,Number(BigInt.asIntN(32,t>>BigInt(32))))}writeUint64(e,t){this.writeUint32(e,Number(BigInt.asUintN(32,t))),this.writeUint32(e+4,Number(BigInt.asUintN(32,t>>BigInt(32))))}writeFloat32(e,t){i.float32[0]=t,this.writeInt32(e,i.int32[0])}writeFloat64(e,t){i.float64[0]=t,this.writeInt32(e,i.int32[+!i.isLittleEndian]),this.writeInt32(e+4,i.int32[+!!i.isLittleEndian])}getBufferIdentifier(){if(this.bytes_.length<this.position_+t.SIZEOF_INT+t.FILE_IDENTIFIER_LENGTH)throw Error("FlatBuffers: ByteBuffer is too short to contain an identifier.");let e="";for(let i=0;i<t.FILE_IDENTIFIER_LENGTH;i++)e+=String.fromCharCode(this.readInt8(this.position_+t.SIZEOF_INT+i));return e}__offset(e,t){let i=e-this.readInt32(e);return t<this.readInt16(i)?this.readInt16(i+t):0}__union(e,t){return e.bb_pos=t+this.readInt32(t),e.bb=this,e}__string(e,i){e+=this.readInt32(e);let o=this.readInt32(e);e+=t.SIZEOF_INT;let a=this.bytes_.subarray(e,e+o);return i===n.Encoding.UTF8_BYTES?a:this.text_decoder_.decode(a)}__union_with_string(e,t){return"string"==typeof e?this.__string(t):this.__union(e,t)}__indirect(e){return e+this.readInt32(e)}__vector(e){return e+this.readInt32(e)+t.SIZEOF_INT}__vector_len(e){return this.readInt32(e+this.readInt32(e))}__has_identifier(e){if(e.length!=t.FILE_IDENTIFIER_LENGTH)throw Error("FlatBuffers: file identifier must be length "+t.FILE_IDENTIFIER_LENGTH);for(let i=0;i<t.FILE_IDENTIFIER_LENGTH;i++)if(e.charCodeAt(i)!=this.readInt8(this.position()+t.SIZEOF_INT+i))return!1;return!0}createScalarList(e,t){let i=[];for(let n=0;n<t;++n){let t=e(n);null!==t&&i.push(t)}return i}createObjList(e,t){let i=[];for(let n=0;n<t;++n){let t=e(n);null!==t&&i.push(t.unpack())}return i}}}),Jp=oe(e=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.Builder=void 0;var t=Hs(),i=Er();e.Builder=class e{constructor(e){let i;this.minalign=1,this.vtable=null,this.vtable_in_use=0,this.isNested=!1,this.object_start=0,this.vtables=[],this.vector_num_elems=0,this.force_defaults=!1,this.string_maps=null,this.text_encoder=new TextEncoder,i=e||1024,this.bb=t.ByteBuffer.allocate(i),this.space=i}clear(){this.bb.clear(),this.space=this.bb.capacity(),this.minalign=1,this.vtable=null,this.vtable_in_use=0,this.isNested=!1,this.object_start=0,this.vtables=[],this.vector_num_elems=0,this.force_defaults=!1,this.string_maps=null}forceDefaults(e){this.force_defaults=e}dataBuffer(){return this.bb}asUint8Array(){return this.bb.bytes().subarray(this.bb.position(),this.bb.position()+this.offset())}prep(t,i){t>this.minalign&&(this.minalign=t);let n=~(this.bb.capacity()-this.space+i)+1&t-1;for(;this.space<n+t+i;){let t=this.bb.capacity();this.bb=e.growByteBuffer(this.bb),this.space+=this.bb.capacity()-t}this.pad(n)}pad(e){for(let t=0;t<e;t++)this.bb.writeInt8(--this.space,0)}writeInt8(e){this.bb.writeInt8(this.space-=1,e)}writeInt16(e){this.bb.writeInt16(this.space-=2,e)}writeInt32(e){this.bb.writeInt32(this.space-=4,e)}writeInt64(e){this.bb.writeInt64(this.space-=8,e)}writeFloat32(e){this.bb.writeFloat32(this.space-=4,e)}writeFloat64(e){this.bb.writeFloat64(this.space-=8,e)}addInt8(e){this.prep(1,0),this.writeInt8(e)}addInt16(e){this.prep(2,0),this.writeInt16(e)}addInt32(e){this.prep(4,0),this.writeInt32(e)}addInt64(e){this.prep(8,0),this.writeInt64(e)}addFloat32(e){this.prep(4,0),this.writeFloat32(e)}addFloat64(e){this.prep(8,0),this.writeFloat64(e)}addFieldInt8(e,t,i){(this.force_defaults||t!=i)&&(this.addInt8(t),this.slot(e))}addFieldInt16(e,t,i){(this.force_defaults||t!=i)&&(this.addInt16(t),this.slot(e))}addFieldInt32(e,t,i){(this.force_defaults||t!=i)&&(this.addInt32(t),this.slot(e))}addFieldInt64(e,t,i){(this.force_defaults||t!==i)&&(this.addInt64(t),this.slot(e))}addFieldFloat32(e,t,i){(this.force_defaults||t!=i)&&(this.addFloat32(t),this.slot(e))}addFieldFloat64(e,t,i){(this.force_defaults||t!=i)&&(this.addFloat64(t),this.slot(e))}addFieldOffset(e,t,i){(this.force_defaults||t!=i)&&(this.addOffset(t),this.slot(e))}addFieldStruct(e,t,i){t!=i&&(this.nested(t),this.slot(e))}nested(e){if(e!=this.offset())throw TypeError("FlatBuffers: struct must be serialized inline.")}notNested(){if(this.isNested)throw TypeError("FlatBuffers: object serialization must not be nested.")}slot(e){null!==this.vtable&&(this.vtable[e]=this.offset())}offset(){return this.bb.capacity()-this.space}static growByteBuffer(e){let i=e.capacity();if(0xc0000000&i)throw Error("FlatBuffers: cannot grow buffer beyond 2 gigabytes.");let n=i<<1,o=t.ByteBuffer.allocate(n);return o.setPosition(n-i),o.bytes().set(e.bytes(),n-i),o}addOffset(e){this.prep(i.SIZEOF_INT,0),this.writeInt32(this.offset()-e+i.SIZEOF_INT)}startObject(e){this.notNested(),null==this.vtable&&(this.vtable=[]),this.vtable_in_use=e;for(let t=0;t<e;t++)this.vtable[t]=0;this.isNested=!0,this.object_start=this.offset()}endObject(){if(null==this.vtable||!this.isNested)throw Error("FlatBuffers: endObject called without startObject");this.addInt32(0);let e=this.offset(),t=this.vtable_in_use-1;for(;t>=0&&0==this.vtable[t];t--);let n=t+1;for(;t>=0;t--)this.addInt16(0!=this.vtable[t]?e-this.vtable[t]:0);let o=2;this.addInt16(e-this.object_start);let a=(n+o)*i.SIZEOF_SHORT;this.addInt16(a);let s=0,u=this.space;e:for(t=0;t<this.vtables.length;t++){let e=this.bb.capacity()-this.vtables[t];if(a==this.bb.readInt16(e)){for(let t=i.SIZEOF_SHORT;t<a;t+=i.SIZEOF_SHORT)if(this.bb.readInt16(u+t)!=this.bb.readInt16(e+t))continue e;s=this.vtables[t];break}}return s?(this.space=this.bb.capacity()-e,this.bb.writeInt32(this.space,s-e)):(this.vtables.push(this.offset()),this.bb.writeInt32(this.bb.capacity()-e,this.offset()-e)),this.isNested=!1,e}finish(e,t,n){let o=n?i.SIZE_PREFIX_LENGTH:0;if(t){let e=t;if(this.prep(this.minalign,i.SIZEOF_INT+i.FILE_IDENTIFIER_LENGTH+o),e.length!=i.FILE_IDENTIFIER_LENGTH)throw TypeError("FlatBuffers: file identifier must be length "+i.FILE_IDENTIFIER_LENGTH);for(let t=i.FILE_IDENTIFIER_LENGTH-1;t>=0;t--)this.writeInt8(e.charCodeAt(t))}this.prep(this.minalign,i.SIZEOF_INT+o),this.addOffset(e),o&&this.addInt32(this.bb.capacity()-this.space),this.bb.setPosition(this.space)}finishSizePrefixed(e,t){this.finish(e,t,!0)}requiredField(e,t){let i=this.bb.capacity()-e,n=i-this.bb.readInt32(i);if(!(t<this.bb.readInt16(n)&&0!=this.bb.readInt16(n+t)))throw TypeError("FlatBuffers: field "+t+" must be set")}startVector(e,t,n){this.notNested(),this.vector_num_elems=t,this.prep(i.SIZEOF_INT,e*t),this.prep(n,e*t)}endVector(){return this.writeInt32(this.vector_num_elems),this.offset()}createSharedString(e){if(!e)return 0;if(this.string_maps||(this.string_maps=new Map),this.string_maps.has(e))return this.string_maps.get(e);let t=this.createString(e);return this.string_maps.set(e,t),t}createString(e){let t;return null==e?0:(t=e instanceof Uint8Array?e:this.text_encoder.encode(e),this.addInt8(0),this.startVector(1,t.length,1),this.bb.setPosition(this.space-=t.length),this.bb.bytes().set(t,this.space),this.endVector())}createByteVector(e){return null==e?0:(this.startVector(1,e.length,1),this.bb.setPosition(this.space-=e.length),this.bb.bytes().set(e,this.space),this.endVector())}createObjectOffset(e){return null===e?0:"string"==typeof e?this.createString(e):e.pack(this)}createObjectOffsetList(e){let t=[];for(let i=0;i<e.length;++i){let n=e[i];if(null!==n)t.push(this.createObjectOffset(n));else throw TypeError("FlatBuffers: Argument for createObjectOffsetList cannot contain null.")}return t}createStructOffsetList(e,t){return t(this,e.length),this.createObjectOffsetList(e.slice().reverse()),this.endVector()}}}),ze=oe(e=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.ByteBuffer=e.Builder=e.Encoding=e.isLittleEndian=e.float64=e.float32=e.int32=e.SIZE_PREFIX_LENGTH=e.FILE_IDENTIFIER_LENGTH=e.SIZEOF_INT=e.SIZEOF_SHORT=void 0;var t=Er();Object.defineProperty(e,"SIZEOF_SHORT",{enumerable:!0,get:function(){return t.SIZEOF_SHORT}});var i=Er();Object.defineProperty(e,"SIZEOF_INT",{enumerable:!0,get:function(){return i.SIZEOF_INT}});var n=Er();Object.defineProperty(e,"FILE_IDENTIFIER_LENGTH",{enumerable:!0,get:function(){return n.FILE_IDENTIFIER_LENGTH}});var o=Er();Object.defineProperty(e,"SIZE_PREFIX_LENGTH",{enumerable:!0,get:function(){return o.SIZE_PREFIX_LENGTH}});var a=Gs();Object.defineProperty(e,"int32",{enumerable:!0,get:function(){return a.int32}}),Object.defineProperty(e,"float32",{enumerable:!0,get:function(){return a.float32}}),Object.defineProperty(e,"float64",{enumerable:!0,get:function(){return a.float64}}),Object.defineProperty(e,"isLittleEndian",{enumerable:!0,get:function(){return a.isLittleEndian}});var s=Us();Object.defineProperty(e,"Encoding",{enumerable:!0,get:function(){return s.Encoding}});var u=Jp();Object.defineProperty(e,"Builder",{enumerable:!0,get:function(){return u.Builder}});var l=Hs();Object.defineProperty(e,"ByteBuffer",{enumerable:!0,get:function(){return l.ByteBuffer}})}),Ks=oe(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i);var o=Object.getOwnPropertyDescriptor(t,i);(!o||("get"in o?!t.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,n,o)}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),i=e&&e.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),n=e&&e.__importStar||function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var o in e)"default"!==o&&Object.prototype.hasOwnProperty.call(e,o)&&t(n,e,o);return i(n,e),n};Object.defineProperty(e,"__esModule",{value:!0}),e.ArgTypeAndIndex=void 0;var o=n(ze()),a=Vs();e.ArgTypeAndIndex=class e{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsArgTypeAndIndex(t,i){return(i||new e).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsArgTypeAndIndex(t,i){return t.setPosition(t.position()+o.SIZE_PREFIX_LENGTH),(i||new e).__init(t.readInt32(t.position())+t.position(),t)}argType(){let e=this.bb.__offset(this.bb_pos,4);return e?this.bb.readInt8(this.bb_pos+e):a.ArgType.INPUT}index(){let e=this.bb.__offset(this.bb_pos,6);return e?this.bb.readUint32(this.bb_pos+e):0}static startArgTypeAndIndex(e){e.startObject(2)}static addArgType(e,t){e.addFieldInt8(0,t,a.ArgType.INPUT)}static addIndex(e,t){e.addFieldInt32(1,t,0)}static endArgTypeAndIndex(e){return e.endObject()}static createArgTypeAndIndex(t,i,n){return e.startArgTypeAndIndex(t),e.addArgType(t,i),e.addIndex(t,n),e.endArgTypeAndIndex(t)}}}),Xs=oe(e=>{"use strict";var t;Object.defineProperty(e,"__esModule",{value:!0}),e.AttributeType=void 0,function(e){e[e.UNDEFINED=0]="UNDEFINED",e[e.FLOAT=1]="FLOAT",e[e.INT=2]="INT",e[e.STRING=3]="STRING",e[e.TENSOR=4]="TENSOR",e[e.GRAPH=5]="GRAPH",e[e.FLOATS=6]="FLOATS",e[e.INTS=7]="INTS",e[e.STRINGS=8]="STRINGS",e[e.TENSORS=9]="TENSORS",e[e.GRAPHS=10]="GRAPHS",e[e.SPARSE_TENSOR=11]="SPARSE_TENSOR",e[e.SPARSE_TENSORS=12]="SPARSE_TENSORS"}(t||(e.AttributeType=t={}))}),Zs=oe(e=>{"use strict";var t;Object.defineProperty(e,"__esModule",{value:!0}),e.NodeType=void 0,function(e){e[e.Primitive=0]="Primitive",e[e.Fused=1]="Fused"}(t||(e.NodeType=t={}))}),Ys=oe(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i);var o=Object.getOwnPropertyDescriptor(t,i);(!o||("get"in o?!t.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,n,o)}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),i=e&&e.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),n=e&&e.__importStar||function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var o in e)"default"!==o&&Object.prototype.hasOwnProperty.call(e,o)&&t(n,e,o);return i(n,e),n};Object.defineProperty(e,"__esModule",{value:!0}),e.Node=void 0;var o=n(ze()),a=Qs(),s=Zs();e.Node=class e{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsNode(t,i){return(i||new e).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsNode(t,i){return t.setPosition(t.position()+o.SIZE_PREFIX_LENGTH),(i||new e).__init(t.readInt32(t.position())+t.position(),t)}name(e){let t=this.bb.__offset(this.bb_pos,4);return t?this.bb.__string(this.bb_pos+t,e):null}docString(e){let t=this.bb.__offset(this.bb_pos,6);return t?this.bb.__string(this.bb_pos+t,e):null}domain(e){let t=this.bb.__offset(this.bb_pos,8);return t?this.bb.__string(this.bb_pos+t,e):null}sinceVersion(){let e=this.bb.__offset(this.bb_pos,10);return e?this.bb.readInt32(this.bb_pos+e):0}index(){let e=this.bb.__offset(this.bb_pos,12);return e?this.bb.readUint32(this.bb_pos+e):0}opType(e){let t=this.bb.__offset(this.bb_pos,14);return t?this.bb.__string(this.bb_pos+t,e):null}type(){let e=this.bb.__offset(this.bb_pos,16);return e?this.bb.readInt32(this.bb_pos+e):s.NodeType.Primitive}executionProviderType(e){let t=this.bb.__offset(this.bb_pos,18);return t?this.bb.__string(this.bb_pos+t,e):null}inputs(e,t){let i=this.bb.__offset(this.bb_pos,20);return i?this.bb.__string(this.bb.__vector(this.bb_pos+i)+4*e,t):null}inputsLength(){let e=this.bb.__offset(this.bb_pos,20);return e?this.bb.__vector_len(this.bb_pos+e):0}outputs(e,t){let i=this.bb.__offset(this.bb_pos,22);return i?this.bb.__string(this.bb.__vector(this.bb_pos+i)+4*e,t):null}outputsLength(){let e=this.bb.__offset(this.bb_pos,22);return e?this.bb.__vector_len(this.bb_pos+e):0}attributes(e,t){let i=this.bb.__offset(this.bb_pos,24);return i?(t||new a.Attribute).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+i)+4*e),this.bb):null}attributesLength(){let e=this.bb.__offset(this.bb_pos,24);return e?this.bb.__vector_len(this.bb_pos+e):0}inputArgCounts(e){let t=this.bb.__offset(this.bb_pos,26);return t?this.bb.readInt32(this.bb.__vector(this.bb_pos+t)+4*e):0}inputArgCountsLength(){let e=this.bb.__offset(this.bb_pos,26);return e?this.bb.__vector_len(this.bb_pos+e):0}inputArgCountsArray(){let e=this.bb.__offset(this.bb_pos,26);return e?new Int32Array(this.bb.bytes().buffer,this.bb.bytes().byteOffset+this.bb.__vector(this.bb_pos+e),this.bb.__vector_len(this.bb_pos+e)):null}implicitInputs(e,t){let i=this.bb.__offset(this.bb_pos,28);return i?this.bb.__string(this.bb.__vector(this.bb_pos+i)+4*e,t):null}implicitInputsLength(){let e=this.bb.__offset(this.bb_pos,28);return e?this.bb.__vector_len(this.bb_pos+e):0}static startNode(e){e.startObject(13)}static addName(e,t){e.addFieldOffset(0,t,0)}static addDocString(e,t){e.addFieldOffset(1,t,0)}static addDomain(e,t){e.addFieldOffset(2,t,0)}static addSinceVersion(e,t){e.addFieldInt32(3,t,0)}static addIndex(e,t){e.addFieldInt32(4,t,0)}static addOpType(e,t){e.addFieldOffset(5,t,0)}static addType(e,t){e.addFieldInt32(6,t,s.NodeType.Primitive)}static addExecutionProviderType(e,t){e.addFieldOffset(7,t,0)}static addInputs(e,t){e.addFieldOffset(8,t,0)}static createInputsVector(e,t){e.startVector(4,t.length,4);for(let i=t.length-1;i>=0;i--)e.addOffset(t[i]);return e.endVector()}static startInputsVector(e,t){e.startVector(4,t,4)}static addOutputs(e,t){e.addFieldOffset(9,t,0)}static createOutputsVector(e,t){e.startVector(4,t.length,4);for(let i=t.length-1;i>=0;i--)e.addOffset(t[i]);return e.endVector()}static startOutputsVector(e,t){e.startVector(4,t,4)}static addAttributes(e,t){e.addFieldOffset(10,t,0)}static createAttributesVector(e,t){e.startVector(4,t.length,4);for(let i=t.length-1;i>=0;i--)e.addOffset(t[i]);return e.endVector()}static startAttributesVector(e,t){e.startVector(4,t,4)}static addInputArgCounts(e,t){e.addFieldOffset(11,t,0)}static createInputArgCountsVector(e,t){e.startVector(4,t.length,4);for(let i=t.length-1;i>=0;i--)e.addInt32(t[i]);return e.endVector()}static startInputArgCountsVector(e,t){e.startVector(4,t,4)}static addImplicitInputs(e,t){e.addFieldOffset(12,t,0)}static createImplicitInputsVector(e,t){e.startVector(4,t.length,4);for(let i=t.length-1;i>=0;i--)e.addOffset(t[i]);return e.endVector()}static startImplicitInputsVector(e,t){e.startVector(4,t,4)}static endNode(e){return e.endObject()}static createNode(t,i,n,o,a,s,u,l,d,p,c,h,f,m){return e.startNode(t),e.addName(t,i),e.addDocString(t,n),e.addDomain(t,o),e.addSinceVersion(t,a),e.addIndex(t,s),e.addOpType(t,u),e.addType(t,l),e.addExecutionProviderType(t,d),e.addInputs(t,p),e.addOutputs(t,c),e.addAttributes(t,h),e.addInputArgCounts(t,f),e.addImplicitInputs(t,m),e.endNode(t)}}}),tu=oe(e=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.EdgeEnd=void 0,e.EdgeEnd=class{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}nodeIndex(){return this.bb.readUint32(this.bb_pos)}srcArgIndex(){return this.bb.readInt32(this.bb_pos+4)}dstArgIndex(){return this.bb.readInt32(this.bb_pos+8)}static sizeOf(){return 12}static createEdgeEnd(e,t,i,n){return e.prep(4,12),e.writeInt32(n),e.writeInt32(i),e.writeInt32(t),e.offset()}}}),ru=oe(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i);var o=Object.getOwnPropertyDescriptor(t,i);(!o||("get"in o?!t.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,n,o)}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),i=e&&e.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),n=e&&e.__importStar||function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var o in e)"default"!==o&&Object.prototype.hasOwnProperty.call(e,o)&&t(n,e,o);return i(n,e),n};Object.defineProperty(e,"__esModule",{value:!0}),e.NodeEdge=void 0;var o=n(ze()),a=tu();e.NodeEdge=class e{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsNodeEdge(t,i){return(i||new e).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsNodeEdge(t,i){return t.setPosition(t.position()+o.SIZE_PREFIX_LENGTH),(i||new e).__init(t.readInt32(t.position())+t.position(),t)}nodeIndex(){let e=this.bb.__offset(this.bb_pos,4);return e?this.bb.readUint32(this.bb_pos+e):0}inputEdges(e,t){let i=this.bb.__offset(this.bb_pos,6);return i?(t||new a.EdgeEnd).__init(this.bb.__vector(this.bb_pos+i)+12*e,this.bb):null}inputEdgesLength(){let e=this.bb.__offset(this.bb_pos,6);return e?this.bb.__vector_len(this.bb_pos+e):0}outputEdges(e,t){let i=this.bb.__offset(this.bb_pos,8);return i?(t||new a.EdgeEnd).__init(this.bb.__vector(this.bb_pos+i)+12*e,this.bb):null}outputEdgesLength(){let e=this.bb.__offset(this.bb_pos,8);return e?this.bb.__vector_len(this.bb_pos+e):0}static startNodeEdge(e){e.startObject(3)}static addNodeIndex(e,t){e.addFieldInt32(0,t,0)}static addInputEdges(e,t){e.addFieldOffset(1,t,0)}static startInputEdgesVector(e,t){e.startVector(12,t,4)}static addOutputEdges(e,t){e.addFieldOffset(2,t,0)}static startOutputEdgesVector(e,t){e.startVector(12,t,4)}static endNodeEdge(e){return e.endObject()}static createNodeEdge(t,i,n,o){return e.startNodeEdge(t),e.addNodeIndex(t,i),e.addInputEdges(t,n),e.addOutputEdges(t,o),e.endNodeEdge(t)}}}),iu=oe(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i);var o=Object.getOwnPropertyDescriptor(t,i);(!o||("get"in o?!t.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,n,o)}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),i=e&&e.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),n=e&&e.__importStar||function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var o in e)"default"!==o&&Object.prototype.hasOwnProperty.call(e,o)&&t(n,e,o);return i(n,e),n};Object.defineProperty(e,"__esModule",{value:!0}),e.NodesToOptimizeIndices=void 0;var o=n(ze());e.NodesToOptimizeIndices=class e{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsNodesToOptimizeIndices(t,i){return(i||new e).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsNodesToOptimizeIndices(t,i){return t.setPosition(t.position()+o.SIZE_PREFIX_LENGTH),(i||new e).__init(t.readInt32(t.position())+t.position(),t)}nodeIndices(e){let t=this.bb.__offset(this.bb_pos,4);return t?this.bb.readUint32(this.bb.__vector(this.bb_pos+t)+4*e):0}nodeIndicesLength(){let e=this.bb.__offset(this.bb_pos,4);return e?this.bb.__vector_len(this.bb_pos+e):0}nodeIndicesArray(){let e=this.bb.__offset(this.bb_pos,4);return e?new Uint32Array(this.bb.bytes().buffer,this.bb.bytes().byteOffset+this.bb.__vector(this.bb_pos+e),this.bb.__vector_len(this.bb_pos+e)):null}numInputs(){let e=this.bb.__offset(this.bb_pos,6);return e?this.bb.readUint32(this.bb_pos+e):0}numOutputs(){let e=this.bb.__offset(this.bb_pos,8);return e?this.bb.readUint32(this.bb_pos+e):0}hasVariadicInput(){let e=this.bb.__offset(this.bb_pos,10);return!!e&&!!this.bb.readInt8(this.bb_pos+e)}hasVariadicOutput(){let e=this.bb.__offset(this.bb_pos,12);return!!e&&!!this.bb.readInt8(this.bb_pos+e)}numVariadicInputs(){let e=this.bb.__offset(this.bb_pos,14);return e?this.bb.readUint32(this.bb_pos+e):0}numVariadicOutputs(){let e=this.bb.__offset(this.bb_pos,16);return e?this.bb.readUint32(this.bb_pos+e):0}static startNodesToOptimizeIndices(e){e.startObject(7)}static addNodeIndices(e,t){e.addFieldOffset(0,t,0)}static createNodeIndicesVector(e,t){e.startVector(4,t.length,4);for(let i=t.length-1;i>=0;i--)e.addInt32(t[i]);return e.endVector()}static startNodeIndicesVector(e,t){e.startVector(4,t,4)}static addNumInputs(e,t){e.addFieldInt32(1,t,0)}static addNumOutputs(e,t){e.addFieldInt32(2,t,0)}static addHasVariadicInput(e,t){e.addFieldInt8(3,+t,0)}static addHasVariadicOutput(e,t){e.addFieldInt8(4,+t,0)}static addNumVariadicInputs(e,t){e.addFieldInt32(5,t,0)}static addNumVariadicOutputs(e,t){e.addFieldInt32(6,t,0)}static endNodesToOptimizeIndices(e){return e.endObject()}static createNodesToOptimizeIndices(t,i,n,o,a,s,u,l){return e.startNodesToOptimizeIndices(t),e.addNodeIndices(t,i),e.addNumInputs(t,n),e.addNumOutputs(t,o),e.addHasVariadicInput(t,a),e.addHasVariadicOutput(t,s),e.addNumVariadicInputs(t,u),e.addNumVariadicOutputs(t,l),e.endNodesToOptimizeIndices(t)}}}),su=oe(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i);var o=Object.getOwnPropertyDescriptor(t,i);(!o||("get"in o?!t.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,n,o)}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),i=e&&e.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),n=e&&e.__importStar||function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var o in e)"default"!==o&&Object.prototype.hasOwnProperty.call(e,o)&&t(n,e,o);return i(n,e),n};Object.defineProperty(e,"__esModule",{value:!0}),e.RuntimeOptimizationRecord=void 0;var o=n(ze()),a=iu();e.RuntimeOptimizationRecord=class e{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsRuntimeOptimizationRecord(t,i){return(i||new e).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsRuntimeOptimizationRecord(t,i){return t.setPosition(t.position()+o.SIZE_PREFIX_LENGTH),(i||new e).__init(t.readInt32(t.position())+t.position(),t)}actionId(e){let t=this.bb.__offset(this.bb_pos,4);return t?this.bb.__string(this.bb_pos+t,e):null}nodesToOptimizeIndices(e){let t=this.bb.__offset(this.bb_pos,6);return t?(e||new a.NodesToOptimizeIndices).__init(this.bb.__indirect(this.bb_pos+t),this.bb):null}producedOpIds(e,t){let i=this.bb.__offset(this.bb_pos,10);return i?this.bb.__string(this.bb.__vector(this.bb_pos+i)+4*e,t):null}producedOpIdsLength(){let e=this.bb.__offset(this.bb_pos,10);return e?this.bb.__vector_len(this.bb_pos+e):0}static startRuntimeOptimizationRecord(e){e.startObject(4)}static addActionId(e,t){e.addFieldOffset(0,t,0)}static addNodesToOptimizeIndices(e,t){e.addFieldOffset(1,t,0)}static addProducedOpIds(e,t){e.addFieldOffset(3,t,0)}static createProducedOpIdsVector(e,t){e.startVector(4,t.length,4);for(let i=t.length-1;i>=0;i--)e.addOffset(t[i]);return e.endVector()}static startProducedOpIdsVector(e,t){e.startVector(4,t,4)}static endRuntimeOptimizationRecord(e){return e.endObject()}}}),lu=oe(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i);var o=Object.getOwnPropertyDescriptor(t,i);(!o||("get"in o?!t.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,n,o)}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),i=e&&e.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),n=e&&e.__importStar||function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var o in e)"default"!==o&&Object.prototype.hasOwnProperty.call(e,o)&&t(n,e,o);return i(n,e),n};Object.defineProperty(e,"__esModule",{value:!0}),e.RuntimeOptimizationRecordContainerEntry=void 0;var o=n(ze()),a=su();e.RuntimeOptimizationRecordContainerEntry=class e{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsRuntimeOptimizationRecordContainerEntry(t,i){return(i||new e).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsRuntimeOptimizationRecordContainerEntry(t,i){return t.setPosition(t.position()+o.SIZE_PREFIX_LENGTH),(i||new e).__init(t.readInt32(t.position())+t.position(),t)}optimizerName(e){let t=this.bb.__offset(this.bb_pos,4);return t?this.bb.__string(this.bb_pos+t,e):null}runtimeOptimizationRecords(e,t){let i=this.bb.__offset(this.bb_pos,6);return i?(t||new a.RuntimeOptimizationRecord).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+i)+4*e),this.bb):null}runtimeOptimizationRecordsLength(){let e=this.bb.__offset(this.bb_pos,6);return e?this.bb.__vector_len(this.bb_pos+e):0}static startRuntimeOptimizationRecordContainerEntry(e){e.startObject(2)}static addOptimizerName(e,t){e.addFieldOffset(0,t,0)}static addRuntimeOptimizationRecords(e,t){e.addFieldOffset(1,t,0)}static createRuntimeOptimizationRecordsVector(e,t){e.startVector(4,t.length,4);for(let i=t.length-1;i>=0;i--)e.addOffset(t[i]);return e.endVector()}static startRuntimeOptimizationRecordsVector(e,t){e.startVector(4,t,4)}static endRuntimeOptimizationRecordContainerEntry(e){let t=e.endObject();return e.requiredField(t,4),t}static createRuntimeOptimizationRecordContainerEntry(t,i,n){return e.startRuntimeOptimizationRecordContainerEntry(t),e.addOptimizerName(t,i),e.addRuntimeOptimizationRecords(t,n),e.endRuntimeOptimizationRecordContainerEntry(t)}}}),du=oe(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i);var o=Object.getOwnPropertyDescriptor(t,i);(!o||("get"in o?!t.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,n,o)}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),i=e&&e.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),n=e&&e.__importStar||function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var o in e)"default"!==o&&Object.prototype.hasOwnProperty.call(e,o)&&t(n,e,o);return i(n,e),n};Object.defineProperty(e,"__esModule",{value:!0}),e.RuntimeOptimizations=void 0;var o=n(ze()),a=lu();e.RuntimeOptimizations=class e{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsRuntimeOptimizations(t,i){return(i||new e).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsRuntimeOptimizations(t,i){return t.setPosition(t.position()+o.SIZE_PREFIX_LENGTH),(i||new e).__init(t.readInt32(t.position())+t.position(),t)}records(e,t){let i=this.bb.__offset(this.bb_pos,4);return i?(t||new a.RuntimeOptimizationRecordContainerEntry).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+i)+4*e),this.bb):null}recordsLength(){let e=this.bb.__offset(this.bb_pos,4);return e?this.bb.__vector_len(this.bb_pos+e):0}static startRuntimeOptimizations(e){e.startObject(1)}static addRecords(e,t){e.addFieldOffset(0,t,0)}static createRecordsVector(e,t){e.startVector(4,t.length,4);for(let i=t.length-1;i>=0;i--)e.addOffset(t[i]);return e.endVector()}static startRecordsVector(e,t){e.startVector(4,t,4)}static endRuntimeOptimizations(e){return e.endObject()}static createRuntimeOptimizations(t,i){return e.startRuntimeOptimizations(t),e.addRecords(t,i),e.endRuntimeOptimizations(t)}}}),xo=oe(e=>{"use strict";var t;Object.defineProperty(e,"__esModule",{value:!0}),e.TensorDataType=void 0,function(e){e[e.UNDEFINED=0]="UNDEFINED",e[e.FLOAT=1]="FLOAT",e[e.UINT8=2]="UINT8",e[e.INT8=3]="INT8",e[e.UINT16=4]="UINT16",e[e.INT16=5]="INT16",e[e.INT32=6]="INT32",e[e.INT64=7]="INT64",e[e.STRING=8]="STRING",e[e.BOOL=9]="BOOL",e[e.FLOAT16=10]="FLOAT16",e[e.DOUBLE=11]="DOUBLE",e[e.UINT32=12]="UINT32",e[e.UINT64=13]="UINT64",e[e.COMPLEX64=14]="COMPLEX64",e[e.COMPLEX128=15]="COMPLEX128",e[e.BFLOAT16=16]="BFLOAT16",e[e.FLOAT8E4M3FN=17]="FLOAT8E4M3FN",e[e.FLOAT8E4M3FNUZ=18]="FLOAT8E4M3FNUZ",e[e.FLOAT8E5M2=19]="FLOAT8E5M2",e[e.FLOAT8E5M2FNUZ=20]="FLOAT8E5M2FNUZ"}(t||(e.TensorDataType=t={}))}),To=oe(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i);var o=Object.getOwnPropertyDescriptor(t,i);(!o||("get"in o?!t.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,n,o)}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),i=e&&e.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),n=e&&e.__importStar||function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var o in e)"default"!==o&&Object.prototype.hasOwnProperty.call(e,o)&&t(n,e,o);return i(n,e),n};Object.defineProperty(e,"__esModule",{value:!0}),e.Tensor=void 0;var o=n(ze()),a=xo();e.Tensor=class e{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsTensor(t,i){return(i||new e).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsTensor(t,i){return t.setPosition(t.position()+o.SIZE_PREFIX_LENGTH),(i||new e).__init(t.readInt32(t.position())+t.position(),t)}name(e){let t=this.bb.__offset(this.bb_pos,4);return t?this.bb.__string(this.bb_pos+t,e):null}docString(e){let t=this.bb.__offset(this.bb_pos,6);return t?this.bb.__string(this.bb_pos+t,e):null}dims(e){let t=this.bb.__offset(this.bb_pos,8);return t?this.bb.readInt64(this.bb.__vector(this.bb_pos+t)+8*e):BigInt(0)}dimsLength(){let e=this.bb.__offset(this.bb_pos,8);return e?this.bb.__vector_len(this.bb_pos+e):0}dataType(){let e=this.bb.__offset(this.bb_pos,10);return e?this.bb.readInt32(this.bb_pos+e):a.TensorDataType.UNDEFINED}rawData(e){let t=this.bb.__offset(this.bb_pos,12);return t?this.bb.readUint8(this.bb.__vector(this.bb_pos+t)+e):0}rawDataLength(){let e=this.bb.__offset(this.bb_pos,12);return e?this.bb.__vector_len(this.bb_pos+e):0}rawDataArray(){let e=this.bb.__offset(this.bb_pos,12);return e?new Uint8Array(this.bb.bytes().buffer,this.bb.bytes().byteOffset+this.bb.__vector(this.bb_pos+e),this.bb.__vector_len(this.bb_pos+e)):null}stringData(e,t){let i=this.bb.__offset(this.bb_pos,14);return i?this.bb.__string(this.bb.__vector(this.bb_pos+i)+4*e,t):null}stringDataLength(){let e=this.bb.__offset(this.bb_pos,14);return e?this.bb.__vector_len(this.bb_pos+e):0}externalDataOffset(){let e=this.bb.__offset(this.bb_pos,16);return e?this.bb.readInt64(this.bb_pos+e):BigInt("-1")}static startTensor(e){e.startObject(7)}static addName(e,t){e.addFieldOffset(0,t,0)}static addDocString(e,t){e.addFieldOffset(1,t,0)}static addDims(e,t){e.addFieldOffset(2,t,0)}static createDimsVector(e,t){e.startVector(8,t.length,8);for(let i=t.length-1;i>=0;i--)e.addInt64(t[i]);return e.endVector()}static startDimsVector(e,t){e.startVector(8,t,8)}static addDataType(e,t){e.addFieldInt32(3,t,a.TensorDataType.UNDEFINED)}static addRawData(e,t){e.addFieldOffset(4,t,0)}static createRawDataVector(e,t){e.startVector(1,t.length,1);for(let i=t.length-1;i>=0;i--)e.addInt8(t[i]);return e.endVector()}static startRawDataVector(e,t){e.startVector(1,t,1)}static addStringData(e,t){e.addFieldOffset(5,t,0)}static createStringDataVector(e,t){e.startVector(4,t.length,4);for(let i=t.length-1;i>=0;i--)e.addOffset(t[i]);return e.endVector()}static startStringDataVector(e,t){e.startVector(4,t,4)}static addExternalDataOffset(e,t){e.addFieldInt64(6,t,BigInt("-1"))}static endTensor(e){return e.endObject()}static createTensor(t,i,n,o,a,s,u,l){return e.startTensor(t),e.addName(t,i),e.addDocString(t,n),e.addDims(t,o),e.addDataType(t,a),e.addRawData(t,s),e.addStringData(t,u),e.addExternalDataOffset(t,l),e.endTensor(t)}}}),hu=oe(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i);var o=Object.getOwnPropertyDescriptor(t,i);(!o||("get"in o?!t.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,n,o)}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),i=e&&e.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),n=e&&e.__importStar||function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var o in e)"default"!==o&&Object.prototype.hasOwnProperty.call(e,o)&&t(n,e,o);return i(n,e),n};Object.defineProperty(e,"__esModule",{value:!0}),e.SparseTensor=void 0;var o=n(ze()),a=To();e.SparseTensor=class e{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsSparseTensor(t,i){return(i||new e).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsSparseTensor(t,i){return t.setPosition(t.position()+o.SIZE_PREFIX_LENGTH),(i||new e).__init(t.readInt32(t.position())+t.position(),t)}values(e){let t=this.bb.__offset(this.bb_pos,4);return t?(e||new a.Tensor).__init(this.bb.__indirect(this.bb_pos+t),this.bb):null}indices(e){let t=this.bb.__offset(this.bb_pos,6);return t?(e||new a.Tensor).__init(this.bb.__indirect(this.bb_pos+t),this.bb):null}dims(e){let t=this.bb.__offset(this.bb_pos,8);return t?this.bb.readInt64(this.bb.__vector(this.bb_pos+t)+8*e):BigInt(0)}dimsLength(){let e=this.bb.__offset(this.bb_pos,8);return e?this.bb.__vector_len(this.bb_pos+e):0}static startSparseTensor(e){e.startObject(3)}static addValues(e,t){e.addFieldOffset(0,t,0)}static addIndices(e,t){e.addFieldOffset(1,t,0)}static addDims(e,t){e.addFieldOffset(2,t,0)}static createDimsVector(e,t){e.startVector(8,t.length,8);for(let i=t.length-1;i>=0;i--)e.addInt64(t[i]);return e.endVector()}static startDimsVector(e,t){e.startVector(8,t,8)}static endSparseTensor(e){return e.endObject()}}}),gu=oe(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i);var o=Object.getOwnPropertyDescriptor(t,i);(!o||("get"in o?!t.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,n,o)}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),i=e&&e.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),n=e&&e.__importStar||function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var o in e)"default"!==o&&Object.prototype.hasOwnProperty.call(e,o)&&t(n,e,o);return i(n,e),n};Object.defineProperty(e,"__esModule",{value:!0}),e.MapType=void 0;var o=n(ze()),a=xo(),s=Io();e.MapType=class e{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsMapType(t,i){return(i||new e).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsMapType(t,i){return t.setPosition(t.position()+o.SIZE_PREFIX_LENGTH),(i||new e).__init(t.readInt32(t.position())+t.position(),t)}keyType(){let e=this.bb.__offset(this.bb_pos,4);return e?this.bb.readInt32(this.bb_pos+e):a.TensorDataType.UNDEFINED}valueType(e){let t=this.bb.__offset(this.bb_pos,6);return t?(e||new s.TypeInfo).__init(this.bb.__indirect(this.bb_pos+t),this.bb):null}static startMapType(e){e.startObject(2)}static addKeyType(e,t){e.addFieldInt32(0,t,a.TensorDataType.UNDEFINED)}static addValueType(e,t){e.addFieldOffset(1,t,0)}static endMapType(e){return e.endObject()}}}),yu=oe(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i);var o=Object.getOwnPropertyDescriptor(t,i);(!o||("get"in o?!t.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,n,o)}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),i=e&&e.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),n=e&&e.__importStar||function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var o in e)"default"!==o&&Object.prototype.hasOwnProperty.call(e,o)&&t(n,e,o);return i(n,e),n};Object.defineProperty(e,"__esModule",{value:!0}),e.SequenceType=void 0;var o=n(ze()),a=Io();e.SequenceType=class e{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsSequenceType(t,i){return(i||new e).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsSequenceType(t,i){return t.setPosition(t.position()+o.SIZE_PREFIX_LENGTH),(i||new e).__init(t.readInt32(t.position())+t.position(),t)}elemType(e){let t=this.bb.__offset(this.bb_pos,4);return t?(e||new a.TypeInfo).__init(this.bb.__indirect(this.bb_pos+t),this.bb):null}static startSequenceType(e){e.startObject(1)}static addElemType(e,t){e.addFieldOffset(0,t,0)}static endSequenceType(e){return e.endObject()}static createSequenceType(t,i){return e.startSequenceType(t),e.addElemType(t,i),e.endSequenceType(t)}}}),_u=oe(e=>{"use strict";var t;Object.defineProperty(e,"__esModule",{value:!0}),e.DimensionValueType=void 0,function(e){e[e.UNKNOWN=0]="UNKNOWN",e[e.VALUE=1]="VALUE",e[e.PARAM=2]="PARAM"}(t||(e.DimensionValueType=t={}))}),wu=oe(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i);var o=Object.getOwnPropertyDescriptor(t,i);(!o||("get"in o?!t.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,n,o)}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),i=e&&e.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),n=e&&e.__importStar||function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var o in e)"default"!==o&&Object.prototype.hasOwnProperty.call(e,o)&&t(n,e,o);return i(n,e),n};Object.defineProperty(e,"__esModule",{value:!0}),e.DimensionValue=void 0;var o=n(ze()),a=_u();e.DimensionValue=class e{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsDimensionValue(t,i){return(i||new e).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsDimensionValue(t,i){return t.setPosition(t.position()+o.SIZE_PREFIX_LENGTH),(i||new e).__init(t.readInt32(t.position())+t.position(),t)}dimType(){let e=this.bb.__offset(this.bb_pos,4);return e?this.bb.readInt8(this.bb_pos+e):a.DimensionValueType.UNKNOWN}dimValue(){let e=this.bb.__offset(this.bb_pos,6);return e?this.bb.readInt64(this.bb_pos+e):BigInt("0")}dimParam(e){let t=this.bb.__offset(this.bb_pos,8);return t?this.bb.__string(this.bb_pos+t,e):null}static startDimensionValue(e){e.startObject(3)}static addDimType(e,t){e.addFieldInt8(0,t,a.DimensionValueType.UNKNOWN)}static addDimValue(e,t){e.addFieldInt64(1,t,BigInt("0"))}static addDimParam(e,t){e.addFieldOffset(2,t,0)}static endDimensionValue(e){return e.endObject()}static createDimensionValue(t,i,n,o){return e.startDimensionValue(t),e.addDimType(t,i),e.addDimValue(t,n),e.addDimParam(t,o),e.endDimensionValue(t)}}}),Tu=oe(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i);var o=Object.getOwnPropertyDescriptor(t,i);(!o||("get"in o?!t.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,n,o)}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),i=e&&e.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),n=e&&e.__importStar||function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var o in e)"default"!==o&&Object.prototype.hasOwnProperty.call(e,o)&&t(n,e,o);return i(n,e),n};Object.defineProperty(e,"__esModule",{value:!0}),e.Dimension=void 0;var o=n(ze()),a=wu();e.Dimension=class e{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsDimension(t,i){return(i||new e).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsDimension(t,i){return t.setPosition(t.position()+o.SIZE_PREFIX_LENGTH),(i||new e).__init(t.readInt32(t.position())+t.position(),t)}value(e){let t=this.bb.__offset(this.bb_pos,4);return t?(e||new a.DimensionValue).__init(this.bb.__indirect(this.bb_pos+t),this.bb):null}denotation(e){let t=this.bb.__offset(this.bb_pos,6);return t?this.bb.__string(this.bb_pos+t,e):null}static startDimension(e){e.startObject(2)}static addValue(e,t){e.addFieldOffset(0,t,0)}static addDenotation(e,t){e.addFieldOffset(1,t,0)}static endDimension(e){return e.endObject()}static createDimension(t,i,n){return e.startDimension(t),e.addValue(t,i),e.addDenotation(t,n),e.endDimension(t)}}}),Su=oe(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i);var o=Object.getOwnPropertyDescriptor(t,i);(!o||("get"in o?!t.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,n,o)}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),i=e&&e.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),n=e&&e.__importStar||function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var o in e)"default"!==o&&Object.prototype.hasOwnProperty.call(e,o)&&t(n,e,o);return i(n,e),n};Object.defineProperty(e,"__esModule",{value:!0}),e.Shape=void 0;var o=n(ze()),a=Tu();e.Shape=class e{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsShape(t,i){return(i||new e).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsShape(t,i){return t.setPosition(t.position()+o.SIZE_PREFIX_LENGTH),(i||new e).__init(t.readInt32(t.position())+t.position(),t)}dim(e,t){let i=this.bb.__offset(this.bb_pos,4);return i?(t||new a.Dimension).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+i)+4*e),this.bb):null}dimLength(){let e=this.bb.__offset(this.bb_pos,4);return e?this.bb.__vector_len(this.bb_pos+e):0}static startShape(e){e.startObject(1)}static addDim(e,t){e.addFieldOffset(0,t,0)}static createDimVector(e,t){e.startVector(4,t.length,4);for(let i=t.length-1;i>=0;i--)e.addOffset(t[i]);return e.endVector()}static startDimVector(e,t){e.startVector(4,t,4)}static endShape(e){return e.endObject()}static createShape(t,i){return e.startShape(t),e.addDim(t,i),e.endShape(t)}}}),Au=oe(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i);var o=Object.getOwnPropertyDescriptor(t,i);(!o||("get"in o?!t.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,n,o)}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),i=e&&e.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),n=e&&e.__importStar||function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var o in e)"default"!==o&&Object.prototype.hasOwnProperty.call(e,o)&&t(n,e,o);return i(n,e),n};Object.defineProperty(e,"__esModule",{value:!0}),e.TensorTypeAndShape=void 0;var o=n(ze()),a=Su(),s=xo();e.TensorTypeAndShape=class e{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsTensorTypeAndShape(t,i){return(i||new e).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsTensorTypeAndShape(t,i){return t.setPosition(t.position()+o.SIZE_PREFIX_LENGTH),(i||new e).__init(t.readInt32(t.position())+t.position(),t)}elemType(){let e=this.bb.__offset(this.bb_pos,4);return e?this.bb.readInt32(this.bb_pos+e):s.TensorDataType.UNDEFINED}shape(e){let t=this.bb.__offset(this.bb_pos,6);return t?(e||new a.Shape).__init(this.bb.__indirect(this.bb_pos+t),this.bb):null}static startTensorTypeAndShape(e){e.startObject(2)}static addElemType(e,t){e.addFieldInt32(0,t,s.TensorDataType.UNDEFINED)}static addShape(e,t){e.addFieldOffset(1,t,0)}static endTensorTypeAndShape(e){return e.endObject()}}}),Ou=oe(e=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.unionListToTypeInfoValue=e.unionToTypeInfoValue=e.TypeInfoValue=void 0;var t,i=gu(),n=yu(),o=Au();!function(e){e[e.NONE=0]="NONE",e[e.tensor_type=1]="tensor_type",e[e.sequence_type=2]="sequence_type",e[e.map_type=3]="map_type"}(t||(e.TypeInfoValue=t={})),e.unionToTypeInfoValue=function(e,a){switch(t[e]){case"NONE":default:return null;case"tensor_type":return a(new o.TensorTypeAndShape);case"sequence_type":return a(new n.SequenceType);case"map_type":return a(new i.MapType)}},e.unionListToTypeInfoValue=function(e,a,s){switch(t[e]){case"NONE":default:return null;case"tensor_type":return a(s,new o.TensorTypeAndShape);case"sequence_type":return a(s,new n.SequenceType);case"map_type":return a(s,new i.MapType)}}}),Io=oe(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i);var o=Object.getOwnPropertyDescriptor(t,i);(!o||("get"in o?!t.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,n,o)}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),i=e&&e.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),n=e&&e.__importStar||function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var o in e)"default"!==o&&Object.prototype.hasOwnProperty.call(e,o)&&t(n,e,o);return i(n,e),n};Object.defineProperty(e,"__esModule",{value:!0}),e.TypeInfo=void 0;var o=n(ze()),a=Ou();e.TypeInfo=class e{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsTypeInfo(t,i){return(i||new e).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsTypeInfo(t,i){return t.setPosition(t.position()+o.SIZE_PREFIX_LENGTH),(i||new e).__init(t.readInt32(t.position())+t.position(),t)}denotation(e){let t=this.bb.__offset(this.bb_pos,4);return t?this.bb.__string(this.bb_pos+t,e):null}valueType(){let e=this.bb.__offset(this.bb_pos,6);return e?this.bb.readUint8(this.bb_pos+e):a.TypeInfoValue.NONE}value(e){let t=this.bb.__offset(this.bb_pos,8);return t?this.bb.__union(e,this.bb_pos+t):null}static startTypeInfo(e){e.startObject(3)}static addDenotation(e,t){e.addFieldOffset(0,t,0)}static addValueType(e,t){e.addFieldInt8(1,t,a.TypeInfoValue.NONE)}static addValue(e,t){e.addFieldOffset(2,t,0)}static endTypeInfo(e){return e.endObject()}static createTypeInfo(t,i,n,o){return e.startTypeInfo(t),e.addDenotation(t,i),e.addValueType(t,n),e.addValue(t,o),e.endTypeInfo(t)}}}),Cu=oe(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i);var o=Object.getOwnPropertyDescriptor(t,i);(!o||("get"in o?!t.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,n,o)}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),i=e&&e.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),n=e&&e.__importStar||function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var o in e)"default"!==o&&Object.prototype.hasOwnProperty.call(e,o)&&t(n,e,o);return i(n,e),n};Object.defineProperty(e,"__esModule",{value:!0}),e.ValueInfo=void 0;var o=n(ze()),a=Io();e.ValueInfo=class e{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsValueInfo(t,i){return(i||new e).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsValueInfo(t,i){return t.setPosition(t.position()+o.SIZE_PREFIX_LENGTH),(i||new e).__init(t.readInt32(t.position())+t.position(),t)}name(e){let t=this.bb.__offset(this.bb_pos,4);return t?this.bb.__string(this.bb_pos+t,e):null}docString(e){let t=this.bb.__offset(this.bb_pos,6);return t?this.bb.__string(this.bb_pos+t,e):null}type(e){let t=this.bb.__offset(this.bb_pos,8);return t?(e||new a.TypeInfo).__init(this.bb.__indirect(this.bb_pos+t),this.bb):null}static startValueInfo(e){e.startObject(3)}static addName(e,t){e.addFieldOffset(0,t,0)}static addDocString(e,t){e.addFieldOffset(1,t,0)}static addType(e,t){e.addFieldOffset(2,t,0)}static endValueInfo(e){return e.endObject()}}}),Oi=oe(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i);var o=Object.getOwnPropertyDescriptor(t,i);(!o||("get"in o?!t.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,n,o)}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),i=e&&e.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),n=e&&e.__importStar||function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var o in e)"default"!==o&&Object.prototype.hasOwnProperty.call(e,o)&&t(n,e,o);return i(n,e),n};Object.defineProperty(e,"__esModule",{value:!0}),e.Graph=void 0;var o=n(ze()),a=Ys(),s=ru(),u=du(),l=hu(),d=To(),p=Cu();e.Graph=class e{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsGraph(t,i){return(i||new e).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsGraph(t,i){return t.setPosition(t.position()+o.SIZE_PREFIX_LENGTH),(i||new e).__init(t.readInt32(t.position())+t.position(),t)}initializers(e,t){let i=this.bb.__offset(this.bb_pos,4);return i?(t||new d.Tensor).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+i)+4*e),this.bb):null}initializersLength(){let e=this.bb.__offset(this.bb_pos,4);return e?this.bb.__vector_len(this.bb_pos+e):0}nodeArgs(e,t){let i=this.bb.__offset(this.bb_pos,6);return i?(t||new p.ValueInfo).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+i)+4*e),this.bb):null}nodeArgsLength(){let e=this.bb.__offset(this.bb_pos,6);return e?this.bb.__vector_len(this.bb_pos+e):0}nodes(e,t){let i=this.bb.__offset(this.bb_pos,8);return i?(t||new a.Node).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+i)+4*e),this.bb):null}nodesLength(){let e=this.bb.__offset(this.bb_pos,8);return e?this.bb.__vector_len(this.bb_pos+e):0}maxNodeIndex(){let e=this.bb.__offset(this.bb_pos,10);return e?this.bb.readUint32(this.bb_pos+e):0}nodeEdges(e,t){let i=this.bb.__offset(this.bb_pos,12);return i?(t||new s.NodeEdge).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+i)+4*e),this.bb):null}nodeEdgesLength(){let e=this.bb.__offset(this.bb_pos,12);return e?this.bb.__vector_len(this.bb_pos+e):0}inputs(e,t){let i=this.bb.__offset(this.bb_pos,14);return i?this.bb.__string(this.bb.__vector(this.bb_pos+i)+4*e,t):null}inputsLength(){let e=this.bb.__offset(this.bb_pos,14);return e?this.bb.__vector_len(this.bb_pos+e):0}outputs(e,t){let i=this.bb.__offset(this.bb_pos,16);return i?this.bb.__string(this.bb.__vector(this.bb_pos+i)+4*e,t):null}outputsLength(){let e=this.bb.__offset(this.bb_pos,16);return e?this.bb.__vector_len(this.bb_pos+e):0}sparseInitializers(e,t){let i=this.bb.__offset(this.bb_pos,18);return i?(t||new l.SparseTensor).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+i)+4*e),this.bb):null}sparseInitializersLength(){let e=this.bb.__offset(this.bb_pos,18);return e?this.bb.__vector_len(this.bb_pos+e):0}runtimeOptimizations(e){let t=this.bb.__offset(this.bb_pos,20);return t?(e||new u.RuntimeOptimizations).__init(this.bb.__indirect(this.bb_pos+t),this.bb):null}static startGraph(e){e.startObject(9)}static addInitializers(e,t){e.addFieldOffset(0,t,0)}static createInitializersVector(e,t){e.startVector(4,t.length,4);for(let i=t.length-1;i>=0;i--)e.addOffset(t[i]);return e.endVector()}static startInitializersVector(e,t){e.startVector(4,t,4)}static addNodeArgs(e,t){e.addFieldOffset(1,t,0)}static createNodeArgsVector(e,t){e.startVector(4,t.length,4);for(let i=t.length-1;i>=0;i--)e.addOffset(t[i]);return e.endVector()}static startNodeArgsVector(e,t){e.startVector(4,t,4)}static addNodes(e,t){e.addFieldOffset(2,t,0)}static createNodesVector(e,t){e.startVector(4,t.length,4);for(let i=t.length-1;i>=0;i--)e.addOffset(t[i]);return e.endVector()}static startNodesVector(e,t){e.startVector(4,t,4)}static addMaxNodeIndex(e,t){e.addFieldInt32(3,t,0)}static addNodeEdges(e,t){e.addFieldOffset(4,t,0)}static createNodeEdgesVector(e,t){e.startVector(4,t.length,4);for(let i=t.length-1;i>=0;i--)e.addOffset(t[i]);return e.endVector()}static startNodeEdgesVector(e,t){e.startVector(4,t,4)}static addInputs(e,t){e.addFieldOffset(5,t,0)}static createInputsVector(e,t){e.startVector(4,t.length,4);for(let i=t.length-1;i>=0;i--)e.addOffset(t[i]);return e.endVector()}static startInputsVector(e,t){e.startVector(4,t,4)}static addOutputs(e,t){e.addFieldOffset(6,t,0)}static createOutputsVector(e,t){e.startVector(4,t.length,4);for(let i=t.length-1;i>=0;i--)e.addOffset(t[i]);return e.endVector()}static startOutputsVector(e,t){e.startVector(4,t,4)}static addSparseInitializers(e,t){e.addFieldOffset(7,t,0)}static createSparseInitializersVector(e,t){e.startVector(4,t.length,4);for(let i=t.length-1;i>=0;i--)e.addOffset(t[i]);return e.endVector()}static startSparseInitializersVector(e,t){e.startVector(4,t,4)}static addRuntimeOptimizations(e,t){e.addFieldOffset(8,t,0)}static endGraph(e){return e.endObject()}}}),Qs=oe(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i);var o=Object.getOwnPropertyDescriptor(t,i);(!o||("get"in o?!t.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,n,o)}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),i=e&&e.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),n=e&&e.__importStar||function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var o in e)"default"!==o&&Object.prototype.hasOwnProperty.call(e,o)&&t(n,e,o);return i(n,e),n};Object.defineProperty(e,"__esModule",{value:!0}),e.Attribute=void 0;var o=n(ze()),a=Xs(),s=Oi(),u=To();e.Attribute=class e{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsAttribute(t,i){return(i||new e).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsAttribute(t,i){return t.setPosition(t.position()+o.SIZE_PREFIX_LENGTH),(i||new e).__init(t.readInt32(t.position())+t.position(),t)}name(e){let t=this.bb.__offset(this.bb_pos,4);return t?this.bb.__string(this.bb_pos+t,e):null}docString(e){let t=this.bb.__offset(this.bb_pos,6);return t?this.bb.__string(this.bb_pos+t,e):null}type(){let e=this.bb.__offset(this.bb_pos,8);return e?this.bb.readInt32(this.bb_pos+e):a.AttributeType.UNDEFINED}f(){let e=this.bb.__offset(this.bb_pos,10);return e?this.bb.readFloat32(this.bb_pos+e):0}i(){let e=this.bb.__offset(this.bb_pos,12);return e?this.bb.readInt64(this.bb_pos+e):BigInt("0")}s(e){let t=this.bb.__offset(this.bb_pos,14);return t?this.bb.__string(this.bb_pos+t,e):null}t(e){let t=this.bb.__offset(this.bb_pos,16);return t?(e||new u.Tensor).__init(this.bb.__indirect(this.bb_pos+t),this.bb):null}g(e){let t=this.bb.__offset(this.bb_pos,18);return t?(e||new s.Graph).__init(this.bb.__indirect(this.bb_pos+t),this.bb):null}floats(e){let t=this.bb.__offset(this.bb_pos,20);return t?this.bb.readFloat32(this.bb.__vector(this.bb_pos+t)+4*e):0}floatsLength(){let e=this.bb.__offset(this.bb_pos,20);return e?this.bb.__vector_len(this.bb_pos+e):0}floatsArray(){let e=this.bb.__offset(this.bb_pos,20);return e?new Float32Array(this.bb.bytes().buffer,this.bb.bytes().byteOffset+this.bb.__vector(this.bb_pos+e),this.bb.__vector_len(this.bb_pos+e)):null}ints(e){let t=this.bb.__offset(this.bb_pos,22);return t?this.bb.readInt64(this.bb.__vector(this.bb_pos+t)+8*e):BigInt(0)}intsLength(){let e=this.bb.__offset(this.bb_pos,22);return e?this.bb.__vector_len(this.bb_pos+e):0}strings(e,t){let i=this.bb.__offset(this.bb_pos,24);return i?this.bb.__string(this.bb.__vector(this.bb_pos+i)+4*e,t):null}stringsLength(){let e=this.bb.__offset(this.bb_pos,24);return e?this.bb.__vector_len(this.bb_pos+e):0}tensors(e,t){let i=this.bb.__offset(this.bb_pos,26);return i?(t||new u.Tensor).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+i)+4*e),this.bb):null}tensorsLength(){let e=this.bb.__offset(this.bb_pos,26);return e?this.bb.__vector_len(this.bb_pos+e):0}graphs(e,t){let i=this.bb.__offset(this.bb_pos,28);return i?(t||new s.Graph).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+i)+4*e),this.bb):null}graphsLength(){let e=this.bb.__offset(this.bb_pos,28);return e?this.bb.__vector_len(this.bb_pos+e):0}static startAttribute(e){e.startObject(13)}static addName(e,t){e.addFieldOffset(0,t,0)}static addDocString(e,t){e.addFieldOffset(1,t,0)}static addType(e,t){e.addFieldInt32(2,t,a.AttributeType.UNDEFINED)}static addF(e,t){e.addFieldFloat32(3,t,0)}static addI(e,t){e.addFieldInt64(4,t,BigInt("0"))}static addS(e,t){e.addFieldOffset(5,t,0)}static addT(e,t){e.addFieldOffset(6,t,0)}static addG(e,t){e.addFieldOffset(7,t,0)}static addFloats(e,t){e.addFieldOffset(8,t,0)}static createFloatsVector(e,t){e.startVector(4,t.length,4);for(let i=t.length-1;i>=0;i--)e.addFloat32(t[i]);return e.endVector()}static startFloatsVector(e,t){e.startVector(4,t,4)}static addInts(e,t){e.addFieldOffset(9,t,0)}static createIntsVector(e,t){e.startVector(8,t.length,8);for(let i=t.length-1;i>=0;i--)e.addInt64(t[i]);return e.endVector()}static startIntsVector(e,t){e.startVector(8,t,8)}static addStrings(e,t){e.addFieldOffset(10,t,0)}static createStringsVector(e,t){e.startVector(4,t.length,4);for(let i=t.length-1;i>=0;i--)e.addOffset(t[i]);return e.endVector()}static startStringsVector(e,t){e.startVector(4,t,4)}static addTensors(e,t){e.addFieldOffset(11,t,0)}static createTensorsVector(e,t){e.startVector(4,t.length,4);for(let i=t.length-1;i>=0;i--)e.addOffset(t[i]);return e.endVector()}static startTensorsVector(e,t){e.startVector(4,t,4)}static addGraphs(e,t){e.addFieldOffset(12,t,0)}static createGraphsVector(e,t){e.startVector(4,t.length,4);for(let i=t.length-1;i>=0;i--)e.addOffset(t[i]);return e.endVector()}static startGraphsVector(e,t){e.startVector(4,t,4)}static endAttribute(e){return e.endObject()}}}),Lu=oe(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i);var o=Object.getOwnPropertyDescriptor(t,i);(!o||("get"in o?!t.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,n,o)}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),i=e&&e.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),n=e&&e.__importStar||function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var o in e)"default"!==o&&Object.prototype.hasOwnProperty.call(e,o)&&t(n,e,o);return i(n,e),n};Object.defineProperty(e,"__esModule",{value:!0}),e.DeprecatedKernelCreateInfos=void 0;var o=n(ze());e.DeprecatedKernelCreateInfos=class e{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsDeprecatedKernelCreateInfos(t,i){return(i||new e).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsDeprecatedKernelCreateInfos(t,i){return t.setPosition(t.position()+o.SIZE_PREFIX_LENGTH),(i||new e).__init(t.readInt32(t.position())+t.position(),t)}nodeIndices(e){let t=this.bb.__offset(this.bb_pos,4);return t?this.bb.readUint32(this.bb.__vector(this.bb_pos+t)+4*e):0}nodeIndicesLength(){let e=this.bb.__offset(this.bb_pos,4);return e?this.bb.__vector_len(this.bb_pos+e):0}nodeIndicesArray(){let e=this.bb.__offset(this.bb_pos,4);return e?new Uint32Array(this.bb.bytes().buffer,this.bb.bytes().byteOffset+this.bb.__vector(this.bb_pos+e),this.bb.__vector_len(this.bb_pos+e)):null}kernelDefHashes(e){let t=this.bb.__offset(this.bb_pos,6);return t?this.bb.readUint64(this.bb.__vector(this.bb_pos+t)+8*e):BigInt(0)}kernelDefHashesLength(){let e=this.bb.__offset(this.bb_pos,6);return e?this.bb.__vector_len(this.bb_pos+e):0}static startDeprecatedKernelCreateInfos(e){e.startObject(2)}static addNodeIndices(e,t){e.addFieldOffset(0,t,0)}static createNodeIndicesVector(e,t){e.startVector(4,t.length,4);for(let i=t.length-1;i>=0;i--)e.addInt32(t[i]);return e.endVector()}static startNodeIndicesVector(e,t){e.startVector(4,t,4)}static addKernelDefHashes(e,t){e.addFieldOffset(1,t,0)}static createKernelDefHashesVector(e,t){e.startVector(8,t.length,8);for(let i=t.length-1;i>=0;i--)e.addInt64(t[i]);return e.endVector()}static startKernelDefHashesVector(e,t){e.startVector(8,t,8)}static endDeprecatedKernelCreateInfos(e){return e.endObject()}static createDeprecatedKernelCreateInfos(t,i,n){return e.startDeprecatedKernelCreateInfos(t),e.addNodeIndices(t,i),e.addKernelDefHashes(t,n),e.endDeprecatedKernelCreateInfos(t)}}}),yf=oe(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i);var o=Object.getOwnPropertyDescriptor(t,i);(!o||("get"in o?!t.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,n,o)}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),i=e&&e.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),n=e&&e.__importStar||function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var o in e)"default"!==o&&Object.prototype.hasOwnProperty.call(e,o)&&t(n,e,o);return i(n,e),n};Object.defineProperty(e,"__esModule",{value:!0}),e.DeprecatedNodeIndexAndKernelDefHash=void 0;var o=n(ze());e.DeprecatedNodeIndexAndKernelDefHash=class e{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsDeprecatedNodeIndexAndKernelDefHash(t,i){return(i||new e).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsDeprecatedNodeIndexAndKernelDefHash(t,i){return t.setPosition(t.position()+o.SIZE_PREFIX_LENGTH),(i||new e).__init(t.readInt32(t.position())+t.position(),t)}nodeIndex(){let e=this.bb.__offset(this.bb_pos,4);return e?this.bb.readUint32(this.bb_pos+e):0}kernelDefHash(){let e=this.bb.__offset(this.bb_pos,6);return e?this.bb.readUint64(this.bb_pos+e):BigInt("0")}static startDeprecatedNodeIndexAndKernelDefHash(e){e.startObject(2)}static addNodeIndex(e,t){e.addFieldInt32(0,t,0)}static addKernelDefHash(e,t){e.addFieldInt64(1,t,BigInt("0"))}static endDeprecatedNodeIndexAndKernelDefHash(e){return e.endObject()}static createDeprecatedNodeIndexAndKernelDefHash(t,i,n){return e.startDeprecatedNodeIndexAndKernelDefHash(t),e.addNodeIndex(t,i),e.addKernelDefHash(t,n),e.endDeprecatedNodeIndexAndKernelDefHash(t)}}}),Mu=oe(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i);var o=Object.getOwnPropertyDescriptor(t,i);(!o||("get"in o?!t.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,n,o)}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),i=e&&e.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),n=e&&e.__importStar||function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var o in e)"default"!==o&&Object.prototype.hasOwnProperty.call(e,o)&&t(n,e,o);return i(n,e),n};Object.defineProperty(e,"__esModule",{value:!0}),e.DeprecatedSubGraphSessionState=void 0;var o=n(ze()),a=Bu();e.DeprecatedSubGraphSessionState=class e{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsDeprecatedSubGraphSessionState(t,i){return(i||new e).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsDeprecatedSubGraphSessionState(t,i){return t.setPosition(t.position()+o.SIZE_PREFIX_LENGTH),(i||new e).__init(t.readInt32(t.position())+t.position(),t)}graphId(e){let t=this.bb.__offset(this.bb_pos,4);return t?this.bb.__string(this.bb_pos+t,e):null}sessionState(e){let t=this.bb.__offset(this.bb_pos,6);return t?(e||new a.DeprecatedSessionState).__init(this.bb.__indirect(this.bb_pos+t),this.bb):null}static startDeprecatedSubGraphSessionState(e){e.startObject(2)}static addGraphId(e,t){e.addFieldOffset(0,t,0)}static addSessionState(e,t){e.addFieldOffset(1,t,0)}static endDeprecatedSubGraphSessionState(e){let t=e.endObject();return e.requiredField(t,4),t}}}),Bu=oe(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i);var o=Object.getOwnPropertyDescriptor(t,i);(!o||("get"in o?!t.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,n,o)}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),i=e&&e.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),n=e&&e.__importStar||function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var o in e)"default"!==o&&Object.prototype.hasOwnProperty.call(e,o)&&t(n,e,o);return i(n,e),n};Object.defineProperty(e,"__esModule",{value:!0}),e.DeprecatedSessionState=void 0;var o=n(ze()),a=Lu(),s=Mu();e.DeprecatedSessionState=class e{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsDeprecatedSessionState(t,i){return(i||new e).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsDeprecatedSessionState(t,i){return t.setPosition(t.position()+o.SIZE_PREFIX_LENGTH),(i||new e).__init(t.readInt32(t.position())+t.position(),t)}kernels(e){let t=this.bb.__offset(this.bb_pos,4);return t?(e||new a.DeprecatedKernelCreateInfos).__init(this.bb.__indirect(this.bb_pos+t),this.bb):null}subGraphSessionStates(e,t){let i=this.bb.__offset(this.bb_pos,6);return i?(t||new s.DeprecatedSubGraphSessionState).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+i)+4*e),this.bb):null}subGraphSessionStatesLength(){let e=this.bb.__offset(this.bb_pos,6);return e?this.bb.__vector_len(this.bb_pos+e):0}static startDeprecatedSessionState(e){e.startObject(2)}static addKernels(e,t){e.addFieldOffset(0,t,0)}static addSubGraphSessionStates(e,t){e.addFieldOffset(1,t,0)}static createSubGraphSessionStatesVector(e,t){e.startVector(4,t.length,4);for(let i=t.length-1;i>=0;i--)e.addOffset(t[i]);return e.endVector()}static startSubGraphSessionStatesVector(e,t){e.startVector(4,t,4)}static endDeprecatedSessionState(e){return e.endObject()}static createDeprecatedSessionState(t,i,n){return e.startDeprecatedSessionState(t),e.addKernels(t,i),e.addSubGraphSessionStates(t,n),e.endDeprecatedSessionState(t)}}}),Gu=oe(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i);var o=Object.getOwnPropertyDescriptor(t,i);(!o||("get"in o?!t.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,n,o)}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),i=e&&e.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),n=e&&e.__importStar||function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var o in e)"default"!==o&&Object.prototype.hasOwnProperty.call(e,o)&&t(n,e,o);return i(n,e),n};Object.defineProperty(e,"__esModule",{value:!0}),e.KernelTypeStrArgsEntry=void 0;var o=n(ze()),a=Ks();e.KernelTypeStrArgsEntry=class e{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsKernelTypeStrArgsEntry(t,i){return(i||new e).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsKernelTypeStrArgsEntry(t,i){return t.setPosition(t.position()+o.SIZE_PREFIX_LENGTH),(i||new e).__init(t.readInt32(t.position())+t.position(),t)}kernelTypeStr(e){let t=this.bb.__offset(this.bb_pos,4);return t?this.bb.__string(this.bb_pos+t,e):null}args(e,t){let i=this.bb.__offset(this.bb_pos,6);return i?(t||new a.ArgTypeAndIndex).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+i)+4*e),this.bb):null}argsLength(){let e=this.bb.__offset(this.bb_pos,6);return e?this.bb.__vector_len(this.bb_pos+e):0}static startKernelTypeStrArgsEntry(e){e.startObject(2)}static addKernelTypeStr(e,t){e.addFieldOffset(0,t,0)}static addArgs(e,t){e.addFieldOffset(1,t,0)}static createArgsVector(e,t){e.startVector(4,t.length,4);for(let i=t.length-1;i>=0;i--)e.addOffset(t[i]);return e.endVector()}static startArgsVector(e,t){e.startVector(4,t,4)}static endKernelTypeStrArgsEntry(e){let t=e.endObject();return e.requiredField(t,4),t}static createKernelTypeStrArgsEntry(t,i,n){return e.startKernelTypeStrArgsEntry(t),e.addKernelTypeStr(t,i),e.addArgs(t,n),e.endKernelTypeStrArgsEntry(t)}}}),Wu=oe(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i);var o=Object.getOwnPropertyDescriptor(t,i);(!o||("get"in o?!t.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,n,o)}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),i=e&&e.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),n=e&&e.__importStar||function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var o in e)"default"!==o&&Object.prototype.hasOwnProperty.call(e,o)&&t(n,e,o);return i(n,e),n};Object.defineProperty(e,"__esModule",{value:!0}),e.OpIdKernelTypeStrArgsEntry=void 0;var o=n(ze()),a=Gu();e.OpIdKernelTypeStrArgsEntry=class e{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsOpIdKernelTypeStrArgsEntry(t,i){return(i||new e).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsOpIdKernelTypeStrArgsEntry(t,i){return t.setPosition(t.position()+o.SIZE_PREFIX_LENGTH),(i||new e).__init(t.readInt32(t.position())+t.position(),t)}opId(e){let t=this.bb.__offset(this.bb_pos,4);return t?this.bb.__string(this.bb_pos+t,e):null}kernelTypeStrArgs(e,t){let i=this.bb.__offset(this.bb_pos,6);return i?(t||new a.KernelTypeStrArgsEntry).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+i)+4*e),this.bb):null}kernelTypeStrArgsLength(){let e=this.bb.__offset(this.bb_pos,6);return e?this.bb.__vector_len(this.bb_pos+e):0}static startOpIdKernelTypeStrArgsEntry(e){e.startObject(2)}static addOpId(e,t){e.addFieldOffset(0,t,0)}static addKernelTypeStrArgs(e,t){e.addFieldOffset(1,t,0)}static createKernelTypeStrArgsVector(e,t){e.startVector(4,t.length,4);for(let i=t.length-1;i>=0;i--)e.addOffset(t[i]);return e.endVector()}static startKernelTypeStrArgsVector(e,t){e.startVector(4,t,4)}static endOpIdKernelTypeStrArgsEntry(e){let t=e.endObject();return e.requiredField(t,4),t}static createOpIdKernelTypeStrArgsEntry(t,i,n){return e.startOpIdKernelTypeStrArgsEntry(t),e.addOpId(t,i),e.addKernelTypeStrArgs(t,n),e.endOpIdKernelTypeStrArgsEntry(t)}}}),ju=oe(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i);var o=Object.getOwnPropertyDescriptor(t,i);(!o||("get"in o?!t.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,n,o)}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),i=e&&e.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),n=e&&e.__importStar||function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var o in e)"default"!==o&&Object.prototype.hasOwnProperty.call(e,o)&&t(n,e,o);return i(n,e),n};Object.defineProperty(e,"__esModule",{value:!0}),e.KernelTypeStrResolver=void 0;var o=n(ze()),a=Wu();e.KernelTypeStrResolver=class e{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsKernelTypeStrResolver(t,i){return(i||new e).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsKernelTypeStrResolver(t,i){return t.setPosition(t.position()+o.SIZE_PREFIX_LENGTH),(i||new e).__init(t.readInt32(t.position())+t.position(),t)}opKernelTypeStrArgs(e,t){let i=this.bb.__offset(this.bb_pos,4);return i?(t||new a.OpIdKernelTypeStrArgsEntry).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+i)+4*e),this.bb):null}opKernelTypeStrArgsLength(){let e=this.bb.__offset(this.bb_pos,4);return e?this.bb.__vector_len(this.bb_pos+e):0}static startKernelTypeStrResolver(e){e.startObject(1)}static addOpKernelTypeStrArgs(e,t){e.addFieldOffset(0,t,0)}static createOpKernelTypeStrArgsVector(e,t){e.startVector(4,t.length,4);for(let i=t.length-1;i>=0;i--)e.addOffset(t[i]);return e.endVector()}static startOpKernelTypeStrArgsVector(e,t){e.startVector(4,t,4)}static endKernelTypeStrResolver(e){return e.endObject()}static createKernelTypeStrResolver(t,i){return e.startKernelTypeStrResolver(t),e.addOpKernelTypeStrArgs(t,i),e.endKernelTypeStrResolver(t)}}}),Ku=oe(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i);var o=Object.getOwnPropertyDescriptor(t,i);(!o||("get"in o?!t.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,n,o)}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),i=e&&e.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),n=e&&e.__importStar||function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var o in e)"default"!==o&&Object.prototype.hasOwnProperty.call(e,o)&&t(n,e,o);return i(n,e),n};Object.defineProperty(e,"__esModule",{value:!0}),e.OperatorSetId=void 0;var o=n(ze());e.OperatorSetId=class e{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsOperatorSetId(t,i){return(i||new e).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsOperatorSetId(t,i){return t.setPosition(t.position()+o.SIZE_PREFIX_LENGTH),(i||new e).__init(t.readInt32(t.position())+t.position(),t)}domain(e){let t=this.bb.__offset(this.bb_pos,4);return t?this.bb.__string(this.bb_pos+t,e):null}version(){let e=this.bb.__offset(this.bb_pos,6);return e?this.bb.readInt64(this.bb_pos+e):BigInt("0")}static startOperatorSetId(e){e.startObject(2)}static addDomain(e,t){e.addFieldOffset(0,t,0)}static addVersion(e,t){e.addFieldInt64(1,t,BigInt("0"))}static endOperatorSetId(e){return e.endObject()}static createOperatorSetId(t,i,n){return e.startOperatorSetId(t),e.addDomain(t,i),e.addVersion(t,n),e.endOperatorSetId(t)}}}),Zu=oe(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i);var o=Object.getOwnPropertyDescriptor(t,i);(!o||("get"in o?!t.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,n,o)}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),i=e&&e.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),n=e&&e.__importStar||function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var o in e)"default"!==o&&Object.prototype.hasOwnProperty.call(e,o)&&t(n,e,o);return i(n,e),n};Object.defineProperty(e,"__esModule",{value:!0}),e.StringStringEntry=void 0;var o=n(ze());e.StringStringEntry=class e{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsStringStringEntry(t,i){return(i||new e).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsStringStringEntry(t,i){return t.setPosition(t.position()+o.SIZE_PREFIX_LENGTH),(i||new e).__init(t.readInt32(t.position())+t.position(),t)}key(e){let t=this.bb.__offset(this.bb_pos,4);return t?this.bb.__string(this.bb_pos+t,e):null}value(e){let t=this.bb.__offset(this.bb_pos,6);return t?this.bb.__string(this.bb_pos+t,e):null}static startStringStringEntry(e){e.startObject(2)}static addKey(e,t){e.addFieldOffset(0,t,0)}static addValue(e,t){e.addFieldOffset(1,t,0)}static endStringStringEntry(e){return e.endObject()}static createStringStringEntry(t,i,n){return e.startStringStringEntry(t),e.addKey(t,i),e.addValue(t,n),e.endStringStringEntry(t)}}}),Yu=oe(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i);var o=Object.getOwnPropertyDescriptor(t,i);(!o||("get"in o?!t.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,n,o)}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),i=e&&e.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),n=e&&e.__importStar||function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var o in e)"default"!==o&&Object.prototype.hasOwnProperty.call(e,o)&&t(n,e,o);return i(n,e),n};Object.defineProperty(e,"__esModule",{value:!0}),e.Model=void 0;var o=n(ze()),a=Oi(),s=Ku(),u=Zu();e.Model=class e{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsModel(t,i){return(i||new e).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsModel(t,i){return t.setPosition(t.position()+o.SIZE_PREFIX_LENGTH),(i||new e).__init(t.readInt32(t.position())+t.position(),t)}irVersion(){let e=this.bb.__offset(this.bb_pos,4);return e?this.bb.readInt64(this.bb_pos+e):BigInt("0")}opsetImport(e,t){let i=this.bb.__offset(this.bb_pos,6);return i?(t||new s.OperatorSetId).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+i)+4*e),this.bb):null}opsetImportLength(){let e=this.bb.__offset(this.bb_pos,6);return e?this.bb.__vector_len(this.bb_pos+e):0}producerName(e){let t=this.bb.__offset(this.bb_pos,8);return t?this.bb.__string(this.bb_pos+t,e):null}producerVersion(e){let t=this.bb.__offset(this.bb_pos,10);return t?this.bb.__string(this.bb_pos+t,e):null}domain(e){let t=this.bb.__offset(this.bb_pos,12);return t?this.bb.__string(this.bb_pos+t,e):null}modelVersion(){let e=this.bb.__offset(this.bb_pos,14);return e?this.bb.readInt64(this.bb_pos+e):BigInt("0")}docString(e){let t=this.bb.__offset(this.bb_pos,16);return t?this.bb.__string(this.bb_pos+t,e):null}graph(e){let t=this.bb.__offset(this.bb_pos,18);return t?(e||new a.Graph).__init(this.bb.__indirect(this.bb_pos+t),this.bb):null}graphDocString(e){let t=this.bb.__offset(this.bb_pos,20);return t?this.bb.__string(this.bb_pos+t,e):null}metadataProps(e,t){let i=this.bb.__offset(this.bb_pos,22);return i?(t||new u.StringStringEntry).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+i)+4*e),this.bb):null}metadataPropsLength(){let e=this.bb.__offset(this.bb_pos,22);return e?this.bb.__vector_len(this.bb_pos+e):0}static startModel(e){e.startObject(10)}static addIrVersion(e,t){e.addFieldInt64(0,t,BigInt("0"))}static addOpsetImport(e,t){e.addFieldOffset(1,t,0)}static createOpsetImportVector(e,t){e.startVector(4,t.length,4);for(let i=t.length-1;i>=0;i--)e.addOffset(t[i]);return e.endVector()}static startOpsetImportVector(e,t){e.startVector(4,t,4)}static addProducerName(e,t){e.addFieldOffset(2,t,0)}static addProducerVersion(e,t){e.addFieldOffset(3,t,0)}static addDomain(e,t){e.addFieldOffset(4,t,0)}static addModelVersion(e,t){e.addFieldInt64(5,t,BigInt("0"))}static addDocString(e,t){e.addFieldOffset(6,t,0)}static addGraph(e,t){e.addFieldOffset(7,t,0)}static addGraphDocString(e,t){e.addFieldOffset(8,t,0)}static addMetadataProps(e,t){e.addFieldOffset(9,t,0)}static createMetadataPropsVector(e,t){e.startVector(4,t.length,4);for(let i=t.length-1;i>=0;i--)e.addOffset(t[i]);return e.endVector()}static startMetadataPropsVector(e,t){e.startVector(4,t,4)}static endModel(e){return e.endObject()}}}),_f=oe(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i);var o=Object.getOwnPropertyDescriptor(t,i);(!o||("get"in o?!t.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,n,o)}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),i=e&&e.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),n=e&&e.__importStar||function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var o in e)"default"!==o&&Object.prototype.hasOwnProperty.call(e,o)&&t(n,e,o);return i(n,e),n};Object.defineProperty(e,"__esModule",{value:!0}),e.InferenceSession=void 0;var o=n(ze()),a=ju(),s=Yu();e.InferenceSession=class e{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsInferenceSession(t,i){return(i||new e).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsInferenceSession(t,i){return t.setPosition(t.position()+o.SIZE_PREFIX_LENGTH),(i||new e).__init(t.readInt32(t.position())+t.position(),t)}static bufferHasIdentifier(e){return e.__has_identifier("ORTM")}ortVersion(e){let t=this.bb.__offset(this.bb_pos,4);return t?this.bb.__string(this.bb_pos+t,e):null}model(e){let t=this.bb.__offset(this.bb_pos,6);return t?(e||new s.Model).__init(this.bb.__indirect(this.bb_pos+t),this.bb):null}kernelTypeStrResolver(e){let t=this.bb.__offset(this.bb_pos,10);return t?(e||new a.KernelTypeStrResolver).__init(this.bb.__indirect(this.bb_pos+t),this.bb):null}static startInferenceSession(e){e.startObject(4)}static addOrtVersion(e,t){e.addFieldOffset(0,t,0)}static addModel(e,t){e.addFieldOffset(1,t,0)}static addKernelTypeStrResolver(e,t){e.addFieldOffset(3,t,0)}static endInferenceSession(e){return e.endObject()}static finishInferenceSessionBuffer(e,t){e.finish(t,"ORTM")}static finishSizePrefixedInferenceSessionBuffer(e,t){e.finish(t,"ORTM",!0)}}}),vf=k(()=>{"use strict";R1=ve(Vs()),z1=ve(Ks()),Pi=ve(Qs()),Lt=ve(Xs()),M1=ve(Lu()),B1=ve(yf()),F1=ve(Bu()),V1=ve(Mu()),G1=ve(Tu()),U1=ve(wu()),W1=ve(_u()),H1=ve(tu()),el=ve(Oi()),tl=ve(_f()),j1=ve(Gu()),q1=ve(ju()),K1=ve(gu()),X1=ve(Yu()),nl=ve(Ys()),Z1=ve(ru()),J1=ve(Zs()),Y1=ve(iu()),Q1=ve(Wu()),eS=ve(Ku()),tS=ve(su()),nS=ve(lu()),rS=ve(du()),oS=ve(yu()),iS=ve(Su()),aS=ve(hu()),sS=ve(Zu()),uS=ve(To()),So=ve(xo()),rl=ve(Au()),lS=ve(Io()),ol=ve(Ou()),cS=ve(Cu())}),$o=k(()=>{"use strict";vf()}),xf=oe((e,t)=>{"use strict";t.exports=function e(e,t){for(var i=Array(arguments.length-1),n=0,o=2,a=!0;o<arguments.length;)i[n++]=arguments[o++];return new Promise(function(o,s){i[n]=function(e){if(a)if(a=!1,e)s(e);else{for(var t=Array(arguments.length-1),i=0;i<t.length;)t[i++]=arguments[i];o.apply(null,t)}};try{e.apply(t||null,i)}catch(e){a&&(a=!1,s(e))}})}}),$f=oe(e=>{"use strict";var t,i=e;i.length=function(e){var t=e.length;if(!t)return 0;for(var i=0;--t%4>1&&"="===e.charAt(t);)++i;return Math.ceil(3*e.length)/4-i};var n=Array(64),o=Array(123);for(t=0;t<64;)o[n[t]=t<26?t+65:t<52?t+71:t<62?t-4:t-59|43]=t++;i.encode=function(e,t,i){for(var o,a=null,s=[],u=0,l=0;t<i;){var d=e[t++];switch(l){case 0:s[u++]=n[d>>2],o=(3&d)<<4,l=1;break;case 1:s[u++]=n[o|d>>4],o=(15&d)<<2,l=2;break;case 2:s[u++]=n[o|d>>6],s[u++]=n[63&d],l=0}u>8191&&((a||(a=[])).push(String.fromCharCode.apply(String,s)),u=0)}return l&&(s[u++]=n[o],s[u++]=61,1===l&&(s[u++]=61)),a?(u&&a.push(String.fromCharCode.apply(String,s.slice(0,u))),a.join("")):String.fromCharCode.apply(String,s.slice(0,u))};var a="invalid encoding";i.decode=function(e,t,i){for(var n,s=i,u=0,l=0;l<e.length;){var d=e.charCodeAt(l++);if(61===d&&u>1)break;if(void 0===(d=o[d]))throw Error(a);switch(u){case 0:n=d,u=1;break;case 1:t[i++]=n<<2|(48&d)>>4,n=d,u=2;break;case 2:t[i++]=(15&n)<<4|(60&d)>>2,n=d,u=3;break;case 3:t[i++]=(3&n)<<6|d,u=0}}if(1===u)throw Error(a);return i-s},i.test=function(e){return/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(e)}}),Of=oe((e,t)=>{"use strict";function i(){this._listeners={}}t.exports=i,i.prototype.on=function(e,t,i){return(this._listeners[e]||(this._listeners[e]=[])).push({fn:t,ctx:i||this}),this},i.prototype.off=function(e,t){if(void 0===e)this._listeners={};else if(void 0===t)this._listeners[e]=[];else for(var i=this._listeners[e],n=0;n<i.length;)i[n].fn===t?i.splice(n,1):++n;return this},i.prototype.emit=function(e){var t=this._listeners[e];if(t){for(var i=[],n=1;n<arguments.length;)i.push(arguments[n++]);for(n=0;n<t.length;)t[n].fn.apply(t[n++].ctx,i)}return this}}),Lf=oe((e,t)=>{"use strict";function i(e){return"u">typeof Float32Array?function(){var t=new Float32Array([-0]),i=new Uint8Array(t.buffer),n=128===i[3];function o(e,n,o){t[0]=e,n[o]=i[0],n[o+1]=i[1],n[o+2]=i[2],n[o+3]=i[3]}function a(e,n,o){t[0]=e,n[o]=i[3],n[o+1]=i[2],n[o+2]=i[1],n[o+3]=i[0]}function s(e,n){return i[0]=e[n],i[1]=e[n+1],i[2]=e[n+2],i[3]=e[n+3],t[0]}function u(e,n){return i[3]=e[n],i[2]=e[n+1],i[1]=e[n+2],i[0]=e[n+3],t[0]}e.writeFloatLE=n?o:a,e.writeFloatBE=n?a:o,e.readFloatLE=n?s:u,e.readFloatBE=n?u:s}():function(){function t(e,t,i,n){var o=+(t<0);if(o&&(t=-t),0===t)e(1/t>0?0:0x80000000,i,n);else if(isNaN(t))e(0x7fc00000,i,n);else if(t>34028234663852886e22)e((o<<31|0x7f800000)>>>0,i,n);else if(t<11754943508222875e-54)e((o<<31|Math.round(t/1401298464324817e-60))>>>0,i,n);else{var a=Math.floor(Math.log(t)/Math.LN2),s=8388607&Math.round(t*Math.pow(2,-a)*8388608);e((o<<31|a+127<<23|s)>>>0,i,n)}}function i(e,t,i){var n=e(t,i),o=(n>>31)*2+1,a=n>>>23&255,s=8388607&n;return 255===a?s?NaN:1/0*o:0===a?1401298464324817e-60*o*s:o*Math.pow(2,a-150)*(s+8388608)}e.writeFloatLE=t.bind(null,n),e.writeFloatBE=t.bind(null,o),e.readFloatLE=i.bind(null,a),e.readFloatBE=i.bind(null,s)}(),"u">typeof Float64Array?function(){var t=new Float64Array([-0]),i=new Uint8Array(t.buffer),n=128===i[7];function o(e,n,o){t[0]=e,n[o]=i[0],n[o+1]=i[1],n[o+2]=i[2],n[o+3]=i[3],n[o+4]=i[4],n[o+5]=i[5],n[o+6]=i[6],n[o+7]=i[7]}function a(e,n,o){t[0]=e,n[o]=i[7],n[o+1]=i[6],n[o+2]=i[5],n[o+3]=i[4],n[o+4]=i[3],n[o+5]=i[2],n[o+6]=i[1],n[o+7]=i[0]}function s(e,n){return i[0]=e[n],i[1]=e[n+1],i[2]=e[n+2],i[3]=e[n+3],i[4]=e[n+4],i[5]=e[n+5],i[6]=e[n+6],i[7]=e[n+7],t[0]}function u(e,n){return i[7]=e[n],i[6]=e[n+1],i[5]=e[n+2],i[4]=e[n+3],i[3]=e[n+4],i[2]=e[n+5],i[1]=e[n+6],i[0]=e[n+7],t[0]}e.writeDoubleLE=n?o:a,e.writeDoubleBE=n?a:o,e.readDoubleLE=n?s:u,e.readDoubleBE=n?u:s}():function(){function t(e,t,i,n,o,a){var s,u=+(n<0);if(u&&(n=-n),0===n)e(0,o,a+t),e(1/n>0?0:0x80000000,o,a+i);else if(isNaN(n))e(0,o,a+t),e(0x7ff80000,o,a+i);else if(n>17976931348623157e292)e(0,o,a+t),e((u<<31|0x7ff00000)>>>0,o,a+i);else if(n<22250738585072014e-324)e((s=n/5e-324)>>>0,o,a+t),e((u<<31|s/0x100000000)>>>0,o,a+i);else{var l=Math.floor(Math.log(n)/Math.LN2);1024===l&&(l=1023),e(0x10000000000000*(s=n*Math.pow(2,-l))>>>0,o,a+t),e((u<<31|l+1023<<20|1048576*s&1048575)>>>0,o,a+i)}}function i(e,t,i,n,o){var a=e(n,o+t),s=e(n,o+i),u=(s>>31)*2+1,l=s>>>20&2047,d=0x100000000*(1048575&s)+a;return 2047===l?d?NaN:1/0*u:0===l?5e-324*u*d:u*Math.pow(2,l-1075)*(d+0x10000000000000)}e.writeDoubleLE=t.bind(null,n,0,4),e.writeDoubleBE=t.bind(null,o,4,0),e.readDoubleLE=i.bind(null,a,0,4),e.readDoubleBE=i.bind(null,s,4,0)}(),e}function n(e,t,i){t[i]=255&e,t[i+1]=e>>>8&255,t[i+2]=e>>>16&255,t[i+3]=e>>>24}function o(e,t,i){t[i]=e>>>24,t[i+1]=e>>>16&255,t[i+2]=e>>>8&255,t[i+3]=255&e}function a(e,t){return(e[t]|e[t+1]<<8|e[t+2]<<16|e[t+3]<<24)>>>0}function s(e,t){return(e[t]<<24|e[t+1]<<16|e[t+2]<<8|e[t+3])>>>0}t.exports=i(i)}),Rf=oe((exports,module)=>{"use strict";function inquire(moduleName){try{var mod=eval("quire".replace(/^/,"re"))(moduleName);if(mod&&(mod.length||Object.keys(mod).length))return mod}catch(r){}return null}module.exports=inquire}),Mf=oe(e=>{"use strict";var t=e;t.length=function(e){for(var t=0,i=0,n=0;n<e.length;++n)(i=e.charCodeAt(n))<128?t+=1:i<2048?t+=2:(64512&i)==55296&&(64512&e.charCodeAt(n+1))==56320?(++n,t+=4):t+=3;return t},t.read=function(e,t,i){if(i-t<1)return"";for(var n,o=null,a=[],s=0;t<i;)(n=e[t++])<128?a[s++]=n:n>191&&n<224?a[s++]=(31&n)<<6|63&e[t++]:n>239&&n<365?(n=((7&n)<<18|(63&e[t++])<<12|(63&e[t++])<<6|63&e[t++])-65536,a[s++]=55296+(n>>10),a[s++]=56320+(1023&n)):a[s++]=(15&n)<<12|(63&e[t++])<<6|63&e[t++],s>8191&&((o||(o=[])).push(String.fromCharCode.apply(String,a)),s=0);return o?(s&&o.push(String.fromCharCode.apply(String,a.slice(0,s))),o.join("")):String.fromCharCode.apply(String,a.slice(0,s))},t.write=function(e,t,i){for(var n,o,a=i,s=0;s<e.length;++s)(n=e.charCodeAt(s))<128?t[i++]=n:(n<2048?t[i++]=n>>6|192:((64512&n)==55296&&(64512&(o=e.charCodeAt(s+1)))==56320?(n=65536+((1023&n)<<10)+(1023&o),++s,t[i++]=n>>18|240,t[i++]=n>>12&63|128):t[i++]=n>>12|224,t[i++]=n>>6&63|128),t[i++]=63&n|128);return i-a}}),Ff=oe((e,t)=>{"use strict";t.exports=function e(e,t,i){var n=i||8192,o=n>>>1,a=null,s=n;return function(i){if(i<1||i>o)return e(i);s+i>n&&(a=e(n),s=0);var u=t.call(a,s,s+=i);return 7&s&&(s=(7|s)+1),u}}}),Gf=oe((e,t)=>{"use strict";t.exports=n;var i=hr();function n(e,t){this.lo=e>>>0,this.hi=t>>>0}var o=n.zero=new n(0,0);o.toNumber=function(){return 0},o.zzEncode=o.zzDecode=function(){return this},o.length=function(){return 1};var a=n.zeroHash="\0\0\0\0\0\0\0\0";n.fromNumber=function(e){if(0===e)return o;var t=e<0;t&&(e=-e);var i=e>>>0,a=(e-i)/0x100000000>>>0;return t&&(a=~a>>>0,i=~i>>>0,++i>0xffffffff&&(i=0,++a>0xffffffff&&(a=0))),new n(i,a)},n.from=function(e){if("number"==typeof e)return n.fromNumber(e);if(i.isString(e))if(!i.Long)return n.fromNumber(parseInt(e,10));else e=i.Long.fromString(e);return e.low||e.high?new n(e.low>>>0,e.high>>>0):o},n.prototype.toNumber=function(e){if(!e&&this.hi>>>31){var t=~this.lo+1>>>0,i=~this.hi>>>0;return t||(i=i+1>>>0),-(t+0x100000000*i)}return this.lo+0x100000000*this.hi},n.prototype.toLong=function(e){return i.Long?new i.Long(0|this.lo,0|this.hi,!!e):{low:0|this.lo,high:0|this.hi,unsigned:!!e}};var s=String.prototype.charCodeAt;n.fromHash=function(e){return e===a?o:new n((s.call(e,0)|s.call(e,1)<<8|s.call(e,2)<<16|s.call(e,3)<<24)>>>0,(s.call(e,4)|s.call(e,5)<<8|s.call(e,6)<<16|s.call(e,7)<<24)>>>0)},n.prototype.toHash=function(){return String.fromCharCode(255&this.lo,this.lo>>>8&255,this.lo>>>16&255,this.lo>>>24,255&this.hi,this.hi>>>8&255,this.hi>>>16&255,this.hi>>>24)},n.prototype.zzEncode=function(){var e=this.hi>>31;return this.hi=((this.hi<<1|this.lo>>>31)^e)>>>0,this.lo=(this.lo<<1^e)>>>0,this},n.prototype.zzDecode=function(){var e=-(1&this.lo);return this.lo=((this.lo>>>1|this.hi<<31)^e)>>>0,this.hi=(this.hi>>>1^e)>>>0,this},n.prototype.length=function(){var e=this.lo,t=(this.lo>>>28|this.hi<<4)>>>0,i=this.hi>>>24;return 0===i?0===t?e<16384?e<128?1:2:e<2097152?3:4:t<16384?t<128?5:6:t<2097152?7:8:i<128?9:10}}),hr=oe(e=>{"use strict";var t=e;function i(e,t,i){for(var n=Object.keys(t),o=0;o<n.length;++o)void 0!==e[n[o]]&&i||(e[n[o]]=t[n[o]]);return e}function n(e){function t(e,n){if(!(this instanceof t))return new t(e,n);Object.defineProperty(this,"message",{get:function(){return e}}),Error.captureStackTrace?Error.captureStackTrace(this,t):Object.defineProperty(this,"stack",{value:Error().stack||""}),n&&i(this,n)}return t.prototype=Object.create(Error.prototype,{constructor:{value:t,writable:!0,enumerable:!1,configurable:!0},name:{get:function(){return e},set:void 0,enumerable:!1,configurable:!0},toString:{value:function(){return this.name+": "+this.message},writable:!0,enumerable:!1,configurable:!0}}),t}t.asPromise=xf(),t.base64=$f(),t.EventEmitter=Of(),t.float=Lf(),t.inquire=Rf(),t.utf8=Mf(),t.pool=Ff(),t.LongBits=Gf(),t.isNode=!!("u">typeof global&&global&&global.process&&global.process.versions&&global.process.versions.node),t.global=t.isNode&&global||"u">typeof window&&window||"u">typeof self&&self||e,t.emptyArray=Object.freeze?Object.freeze([]):[],t.emptyObject=Object.freeze?Object.freeze({}):{},t.isInteger=Number.isInteger||function(e){return"number"==typeof e&&isFinite(e)&&Math.floor(e)===e},t.isString=function(e){return"string"==typeof e||e instanceof String},t.isObject=function(e){return e&&"object"==typeof e},t.isset=t.isSet=function(e,t){var i=e[t];return!!(null!=i&&e.hasOwnProperty(t))&&("object"!=typeof i||(Array.isArray(i)?i.length:Object.keys(i).length)>0)},t.Buffer=function(){try{var e=t.inquire("buffer").Buffer;return e.prototype.utf8Write?e:null}catch{return null}}(),t._Buffer_from=null,t._Buffer_allocUnsafe=null,t.newBuffer=function(e){return"number"==typeof e?t.Buffer?t._Buffer_allocUnsafe(e):new t.Array(e):t.Buffer?t._Buffer_from(e):typeof Uint8Array>"u"?e:new Uint8Array(e)},t.Array="u">typeof Uint8Array?Uint8Array:Array,t.Long=t.global.dcodeIO&&t.global.dcodeIO.Long||t.global.Long||t.inquire("long"),t.key2Re=/^true|false|0|1$/,t.key32Re=/^-?(?:0|[1-9][0-9]*)$/,t.key64Re=/^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/,t.longToHash=function(e){return e?t.LongBits.from(e).toHash():t.LongBits.zeroHash},t.longFromHash=function(e,i){var n=t.LongBits.fromHash(e);return t.Long?t.Long.fromBits(n.lo,n.hi,i):n.toNumber(!!i)},t.merge=i,t.lcFirst=function(e){return e.charAt(0).toLowerCase()+e.substring(1)},t.newError=n,t.ProtocolError=n("ProtocolError"),t.oneOfGetter=function(e){for(var t={},i=0;i<e.length;++i)t[e[i]]=1;return function(){for(var e=Object.keys(this),i=e.length-1;i>-1;--i)if(1===t[e[i]]&&void 0!==this[e[i]]&&null!==this[e[i]])return e[i]}},t.oneOfSetter=function(e){return function(t){for(var i=0;i<e.length;++i)e[i]!==t&&delete this[e[i]]}},t.toJSONOptions={longs:String,enums:String,bytes:String,json:!0},t._configure=function(){var e=t.Buffer;if(!e){t._Buffer_from=t._Buffer_allocUnsafe=null;return}t._Buffer_from=e.from!==Uint8Array.from&&e.from||function(t,i){return new e(t,i)},t._Buffer_allocUnsafe=e.allocUnsafe||function(t){return new e(t)}}}),fl=oe((e,t)=>{"use strict";t.exports=p;var i,n=hr(),o=n.LongBits,a=n.base64,s=n.utf8;function u(e,t,i){this.fn=e,this.len=t,this.next=void 0,this.val=i}function l(){}function d(e){this.head=e.head,this.tail=e.tail,this.len=e.len,this.next=e.states}function p(){this.len=0,this.head=new u(l,0,0),this.tail=this.head,this.states=null}var c=function(){return n.Buffer?function(){return(p.create=function(){return new i})()}:function(){return new p}};function h(e,t,i){t[i]=255&e}function f(e,t,i){for(;e>127;)t[i++]=127&e|128,e>>>=7;t[i]=e}function m(e,t){this.len=e,this.next=void 0,this.val=t}function g(e,t,i){for(;e.hi;)t[i++]=127&e.lo|128,e.lo=(e.lo>>>7|e.hi<<25)>>>0,e.hi>>>=7;for(;e.lo>127;)t[i++]=127&e.lo|128,e.lo=e.lo>>>7;t[i++]=e.lo}function b(e,t,i){t[i]=255&e,t[i+1]=e>>>8&255,t[i+2]=e>>>16&255,t[i+3]=e>>>24}p.create=c(),p.alloc=function(e){return new n.Array(e)},n.Array!==Array&&(p.alloc=n.pool(p.alloc,n.Array.prototype.subarray)),p.prototype._push=function(e,t,i){return this.tail=this.tail.next=new u(e,t,i),this.len+=t,this},m.prototype=Object.create(u.prototype),m.prototype.fn=f,p.prototype.uint32=function(e){return this.len+=(this.tail=this.tail.next=new m((e>>>=0)<128?1:e<16384?2:e<2097152?3:e<0x10000000?4:5,e)).len,this},p.prototype.int32=function(e){return e<0?this._push(g,10,o.fromNumber(e)):this.uint32(e)},p.prototype.sint32=function(e){return this.uint32((e<<1^e>>31)>>>0)},p.prototype.uint64=function(e){var t=o.from(e);return this._push(g,t.length(),t)},p.prototype.int64=p.prototype.uint64,p.prototype.sint64=function(e){var t=o.from(e).zzEncode();return this._push(g,t.length(),t)},p.prototype.bool=function(e){return this._push(h,1,+!!e)},p.prototype.fixed32=function(e){return this._push(b,4,e>>>0)},p.prototype.sfixed32=p.prototype.fixed32,p.prototype.fixed64=function(e){var t=o.from(e);return this._push(b,4,t.lo)._push(b,4,t.hi)},p.prototype.sfixed64=p.prototype.fixed64,p.prototype.float=function(e){return this._push(n.float.writeFloatLE,4,e)},p.prototype.double=function(e){return this._push(n.float.writeDoubleLE,8,e)};var y=n.Array.prototype.set?function(e,t,i){t.set(e,i)}:function(e,t,i){for(var n=0;n<e.length;++n)t[i+n]=e[n]};p.prototype.bytes=function(e){var t=e.length>>>0;if(!t)return this._push(h,1,0);if(n.isString(e)){var i=p.alloc(t=a.length(e));a.decode(e,i,0),e=i}return this.uint32(t)._push(y,t,e)},p.prototype.string=function(e){var t=s.length(e);return t?this.uint32(t)._push(s.write,t,e):this._push(h,1,0)},p.prototype.fork=function(){return this.states=new d(this),this.head=this.tail=new u(l,0,0),this.len=0,this},p.prototype.reset=function(){return this.states?(this.head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.states.next):(this.head=this.tail=new u(l,0,0),this.len=0),this},p.prototype.ldelim=function(){var e=this.head,t=this.tail,i=this.len;return this.reset().uint32(i),i&&(this.tail.next=e.next,this.tail=t,this.len+=i),this},p.prototype.finish=function(){for(var e=this.head.next,t=this.constructor.alloc(this.len),i=0;e;)e.fn(e.val,t,i),i+=e.len,e=e.next;return t},p._configure=function(e){i=e,p.create=c(),i._configure()}}),Jf=oe((e,t)=>{"use strict";t.exports=o;var i=fl();(o.prototype=Object.create(i.prototype)).constructor=o;var n=hr();function o(){i.call(this)}function a(e,t,i){e.length<40?n.utf8.write(e,t,i):t.utf8Write?t.utf8Write(e,i):t.write(e,i)}o._configure=function(){o.alloc=n._Buffer_allocUnsafe,o.writeBytesBuffer=n.Buffer&&n.Buffer.prototype instanceof Uint8Array&&"set"===n.Buffer.prototype.set.name?function(e,t,i){t.set(e,i)}:function(e,t,i){if(e.copy)e.copy(t,i,0,e.length);else for(var n=0;n<e.length;)t[i++]=e[n++]}},o.prototype.bytes=function(e){n.isString(e)&&(e=n._Buffer_from(e,"base64"));var t=e.length>>>0;return this.uint32(t),t&&this._push(o.writeBytesBuffer,t,e),this},o.prototype.string=function(e){var t=n.Buffer.byteLength(e);return this.uint32(t),t&&this._push(a,t,e),this},o._configure()}),gl=oe((e,t)=>{"use strict";t.exports=u;var i,n=hr(),o=n.LongBits,a=n.utf8;function s(e,t){return RangeError("index out of range: "+e.pos+" + "+(t||1)+" > "+e.len)}function u(e){this.buf=e,this.pos=0,this.len=e.length}var l="u">typeof Uint8Array?function(e){if(e instanceof Uint8Array||Array.isArray(e))return new u(e);throw Error("illegal buffer")}:function(e){if(Array.isArray(e))return new u(e);throw Error("illegal buffer")},d=function(){return n.Buffer?function(e){return(u.create=function(e){return n.Buffer.isBuffer(e)?new i(e):l(e)})(e)}:l};function p(){var e=new o(0,0),t=0;if(this.len-this.pos>4){for(;t<4;++t)if(e.lo=(e.lo|(127&this.buf[this.pos])<<7*t)>>>0,this.buf[this.pos++]<128)return e;if(e.lo=(e.lo|(127&this.buf[this.pos])<<28)>>>0,e.hi=(e.hi|(127&this.buf[this.pos])>>4)>>>0,this.buf[this.pos++]<128)return e;t=0}else{for(;t<3;++t){if(this.pos>=this.len)throw s(this);if(e.lo=(e.lo|(127&this.buf[this.pos])<<7*t)>>>0,this.buf[this.pos++]<128)return e}return e.lo=(e.lo|(127&this.buf[this.pos++])<<7*t)>>>0,e}if(this.len-this.pos>4){for(;t<5;++t)if(e.hi=(e.hi|(127&this.buf[this.pos])<<7*t+3)>>>0,this.buf[this.pos++]<128)return e}else for(;t<5;++t){if(this.pos>=this.len)throw s(this);if(e.hi=(e.hi|(127&this.buf[this.pos])<<7*t+3)>>>0,this.buf[this.pos++]<128)return e}throw Error("invalid varint encoding")}function c(e,t){return(e[t-4]|e[t-3]<<8|e[t-2]<<16|e[t-1]<<24)>>>0}function h(){if(this.pos+8>this.len)throw s(this,8);return new o(c(this.buf,this.pos+=4),c(this.buf,this.pos+=4))}u.create=d(),u.prototype._slice=n.Array.prototype.subarray||n.Array.prototype.slice,u.prototype.uint32=function(){var e=0xffffffff;return function(){if(e=(127&this.buf[this.pos])>>>0,this.buf[this.pos++]<128||(e=(e|(127&this.buf[this.pos])<<7)>>>0,this.buf[this.pos++]<128)||(e=(e|(127&this.buf[this.pos])<<14)>>>0,this.buf[this.pos++]<128)||(e=(e|(127&this.buf[this.pos])<<21)>>>0,this.buf[this.pos++]<128)||(e=(e|(15&this.buf[this.pos])<<28)>>>0,this.buf[this.pos++]<128))return e;if((this.pos+=5)>this.len)throw this.pos=this.len,s(this,10);return e}}(),u.prototype.int32=function(){return 0|this.uint32()},u.prototype.sint32=function(){var e=this.uint32();return e>>>1^-(1&e)},u.prototype.bool=function(){return 0!==this.uint32()},u.prototype.fixed32=function(){if(this.pos+4>this.len)throw s(this,4);return c(this.buf,this.pos+=4)},u.prototype.sfixed32=function(){if(this.pos+4>this.len)throw s(this,4);return 0|c(this.buf,this.pos+=4)},u.prototype.float=function(){if(this.pos+4>this.len)throw s(this,4);var e=n.float.readFloatLE(this.buf,this.pos);return this.pos+=4,e},u.prototype.double=function(){if(this.pos+8>this.len)throw s(this,4);var e=n.float.readDoubleLE(this.buf,this.pos);return this.pos+=8,e},u.prototype.bytes=function(){var e=this.uint32(),t=this.pos,i=this.pos+e;if(i>this.len)throw s(this,e);if(this.pos+=e,Array.isArray(this.buf))return this.buf.slice(t,i);if(t===i){var o=n.Buffer;return o?o.alloc(0):new this.buf.constructor(0)}return this._slice.call(this.buf,t,i)},u.prototype.string=function(){var e=this.bytes();return a.read(e,0,e.length)},u.prototype.skip=function(e){if("number"==typeof e){if(this.pos+e>this.len)throw s(this,e);this.pos+=e}else do if(this.pos>=this.len)throw s(this);while(128&this.buf[this.pos++]);return this},u.prototype.skipType=function(e){switch(e){case 0:this.skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());break;case 3:for(;4!=(e=7&this.uint32());)this.skipType(e);break;case 5:this.skip(4);break;default:throw Error("invalid wire type "+e+" at offset "+this.pos)}return this},u._configure=function(e){i=e,u.create=d(),i._configure();var t=n.Long?"toLong":"toNumber";n.merge(u.prototype,{int64:function(){return p.call(this)[t](!1)},uint64:function(){return p.call(this)[t](!0)},sint64:function(){return p.call(this).zzDecode()[t](!1)},fixed64:function(){return h.call(this)[t](!0)},sfixed64:function(){return h.call(this)[t](!1)}})}}),ah=oe((e,t)=>{"use strict";t.exports=o;var i=gl();(o.prototype=Object.create(i.prototype)).constructor=o;var n=hr();function o(e){i.call(this,e)}o._configure=function(){n.Buffer&&(o.prototype._slice=n.Buffer.prototype.slice)},o.prototype.string=function(){var e=this.uint32();return this.buf.utf8Slice?this.buf.utf8Slice(this.pos,this.pos=Math.min(this.pos+e,this.len)):this.buf.toString("utf-8",this.pos,this.pos=Math.min(this.pos+e,this.len))},o._configure()}),uh=oe((e,t)=>{"use strict";t.exports=n;var i=hr();function n(e,t,n){if("function"!=typeof e)throw TypeError("rpcImpl must be a function");i.EventEmitter.call(this),this.rpcImpl=e,this.requestDelimited=!!t,this.responseDelimited=!!n}(n.prototype=Object.create(i.EventEmitter.prototype)).constructor=n,n.prototype.rpcCall=function e(t,n,o,a,s){if(!a)throw TypeError("request must be specified");var u=this;if(!s)return i.asPromise(e,u,t,n,o,a);if(!u.rpcImpl)return void setTimeout(function(){s(Error("already ended"))},0);try{return u.rpcImpl(t,n[u.requestDelimited?"encodeDelimited":"encode"](a).finish(),function(e,i){if(e)return u.emit("error",e,t),s(e);if(null===i)return void u.end(!0);if(!(i instanceof o))try{i=o[u.responseDelimited?"decodeDelimited":"decode"](i)}catch(e){return u.emit("error",e,t),s(e)}return u.emit("data",i,t),s(null,i)})}catch(e){u.emit("error",e,t),setTimeout(function(){s(e)},0);return}},n.prototype.end=function(e){return this.rpcImpl&&(e||this.rpcImpl(null,null,null),this.rpcImpl=null,this.emit("end").off()),this}}),ch=oe(e=>{"use strict";e.Service=uh()}),ph=oe((e,t)=>{"use strict";t.exports={}}),mh=oe(e=>{"use strict";var t=e;function i(){t.util._configure(),t.Writer._configure(t.BufferWriter),t.Reader._configure(t.BufferReader)}t.build="minimal",t.Writer=fl(),t.BufferWriter=Jf(),t.Reader=gl(),t.BufferReader=ah(),t.util=hr(),t.rpc=ch(),t.roots=ph(),t.configure=i,i()}),bh=oe((e,t)=>{"use strict";t.exports=mh()}),to=oe((e,t)=>{"use strict";var i=bh(),n=i.Reader,o=i.Writer,a=i.util,s=i.roots.default||(i.roots.default={});s.onnx=function(){var e={};return e.Version=function(){var e={},t=Object.create(e);return t[e[0]="_START_VERSION"]=0,t[e[1]="IR_VERSION_2017_10_10"]=1,t[e[2]="IR_VERSION_2017_10_30"]=2,t[e[3]="IR_VERSION_2017_11_3"]=3,t[e[4]="IR_VERSION_2019_1_22"]=4,t[e[5]="IR_VERSION_2019_3_18"]=5,t[e[6]="IR_VERSION_2019_9_19"]=6,t[e[7]="IR_VERSION_2020_5_8"]=7,t[e[8]="IR_VERSION_2021_7_30"]=8,t[e[9]="IR_VERSION"]=9,t}(),e.AttributeProto=function(){function e(e){if(this.floats=[],this.ints=[],this.strings=[],this.tensors=[],this.graphs=[],this.sparseTensors=[],this.typeProtos=[],e)for(var t=Object.keys(e),i=0;i<t.length;++i)null!=e[t[i]]&&(this[t[i]]=e[t[i]])}return e.prototype.name="",e.prototype.refAttrName="",e.prototype.docString="",e.prototype.type=0,e.prototype.f=0,e.prototype.i=a.Long?a.Long.fromBits(0,0,!1):0,e.prototype.s=a.newBuffer([]),e.prototype.t=null,e.prototype.g=null,e.prototype.sparseTensor=null,e.prototype.tp=null,e.prototype.floats=a.emptyArray,e.prototype.ints=a.emptyArray,e.prototype.strings=a.emptyArray,e.prototype.tensors=a.emptyArray,e.prototype.graphs=a.emptyArray,e.prototype.sparseTensors=a.emptyArray,e.prototype.typeProtos=a.emptyArray,e.create=function(t){return new e(t)},e.encode=function(e,t){if(t||(t=o.create()),null!=e.name&&Object.hasOwnProperty.call(e,"name")&&t.uint32(10).string(e.name),null!=e.f&&Object.hasOwnProperty.call(e,"f")&&t.uint32(21).float(e.f),null!=e.i&&Object.hasOwnProperty.call(e,"i")&&t.uint32(24).int64(e.i),null!=e.s&&Object.hasOwnProperty.call(e,"s")&&t.uint32(34).bytes(e.s),null!=e.t&&Object.hasOwnProperty.call(e,"t")&&s.onnx.TensorProto.encode(e.t,t.uint32(42).fork()).ldelim(),null!=e.g&&Object.hasOwnProperty.call(e,"g")&&s.onnx.GraphProto.encode(e.g,t.uint32(50).fork()).ldelim(),null!=e.floats&&e.floats.length){t.uint32(58).fork();for(var i=0;i<e.floats.length;++i)t.float(e.floats[i]);t.ldelim()}if(null!=e.ints&&e.ints.length){t.uint32(66).fork();for(var i=0;i<e.ints.length;++i)t.int64(e.ints[i]);t.ldelim()}if(null!=e.strings&&e.strings.length)for(var i=0;i<e.strings.length;++i)t.uint32(74).bytes(e.strings[i]);if(null!=e.tensors&&e.tensors.length)for(var i=0;i<e.tensors.length;++i)s.onnx.TensorProto.encode(e.tensors[i],t.uint32(82).fork()).ldelim();if(null!=e.graphs&&e.graphs.length)for(var i=0;i<e.graphs.length;++i)s.onnx.GraphProto.encode(e.graphs[i],t.uint32(90).fork()).ldelim();if(null!=e.docString&&Object.hasOwnProperty.call(e,"docString")&&t.uint32(106).string(e.docString),null!=e.tp&&Object.hasOwnProperty.call(e,"tp")&&s.onnx.TypeProto.encode(e.tp,t.uint32(114).fork()).ldelim(),null!=e.typeProtos&&e.typeProtos.length)for(var i=0;i<e.typeProtos.length;++i)s.onnx.TypeProto.encode(e.typeProtos[i],t.uint32(122).fork()).ldelim();if(null!=e.type&&Object.hasOwnProperty.call(e,"type")&&t.uint32(160).int32(e.type),null!=e.refAttrName&&Object.hasOwnProperty.call(e,"refAttrName")&&t.uint32(170).string(e.refAttrName),null!=e.sparseTensor&&Object.hasOwnProperty.call(e,"sparseTensor")&&s.onnx.SparseTensorProto.encode(e.sparseTensor,t.uint32(178).fork()).ldelim(),null!=e.sparseTensors&&e.sparseTensors.length)for(var i=0;i<e.sparseTensors.length;++i)s.onnx.SparseTensorProto.encode(e.sparseTensors[i],t.uint32(186).fork()).ldelim();return t},e.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},e.decode=function(e,t){e instanceof n||(e=n.create(e));for(var i=void 0===t?e.len:e.pos+t,o=new s.onnx.AttributeProto;e.pos<i;){var a=e.uint32();switch(a>>>3){case 1:o.name=e.string();break;case 21:o.refAttrName=e.string();break;case 13:o.docString=e.string();break;case 20:o.type=e.int32();break;case 2:o.f=e.float();break;case 3:o.i=e.int64();break;case 4:o.s=e.bytes();break;case 5:o.t=s.onnx.TensorProto.decode(e,e.uint32());break;case 6:o.g=s.onnx.GraphProto.decode(e,e.uint32());break;case 22:o.sparseTensor=s.onnx.SparseTensorProto.decode(e,e.uint32());break;case 14:o.tp=s.onnx.TypeProto.decode(e,e.uint32());break;case 7:if(o.floats&&o.floats.length||(o.floats=[]),(7&a)==2)for(var u=e.uint32()+e.pos;e.pos<u;)o.floats.push(e.float());else o.floats.push(e.float());break;case 8:if(o.ints&&o.ints.length||(o.ints=[]),(7&a)==2)for(var u=e.uint32()+e.pos;e.pos<u;)o.ints.push(e.int64());else o.ints.push(e.int64());break;case 9:o.strings&&o.strings.length||(o.strings=[]),o.strings.push(e.bytes());break;case 10:o.tensors&&o.tensors.length||(o.tensors=[]),o.tensors.push(s.onnx.TensorProto.decode(e,e.uint32()));break;case 11:o.graphs&&o.graphs.length||(o.graphs=[]),o.graphs.push(s.onnx.GraphProto.decode(e,e.uint32()));break;case 23:o.sparseTensors&&o.sparseTensors.length||(o.sparseTensors=[]),o.sparseTensors.push(s.onnx.SparseTensorProto.decode(e,e.uint32()));break;case 15:o.typeProtos&&o.typeProtos.length||(o.typeProtos=[]),o.typeProtos.push(s.onnx.TypeProto.decode(e,e.uint32()));break;default:e.skipType(7&a)}}return o},e.decodeDelimited=function(e){return e instanceof n||(e=new n(e)),this.decode(e,e.uint32())},e.verify=function(e){if("object"!=typeof e||null===e)return"object expected";if(null!=e.name&&e.hasOwnProperty("name")&&!a.isString(e.name))return"name: string expected";if(null!=e.refAttrName&&e.hasOwnProperty("refAttrName")&&!a.isString(e.refAttrName))return"refAttrName: string expected";if(null!=e.docString&&e.hasOwnProperty("docString")&&!a.isString(e.docString))return"docString: string expected";if(null!=e.type&&e.hasOwnProperty("type"))switch(e.type){default:return"type: enum value expected";case 0:case 1:case 2:case 3:case 4:case 5:case 11:case 13:case 6:case 7:case 8:case 9:case 10:case 12:case 14:}if(null!=e.f&&e.hasOwnProperty("f")&&"number"!=typeof e.f)return"f: number expected";if(null!=e.i&&e.hasOwnProperty("i")&&!a.isInteger(e.i)&&!(e.i&&a.isInteger(e.i.low)&&a.isInteger(e.i.high)))return"i: integer|Long expected";if(null!=e.s&&e.hasOwnProperty("s")&&!(e.s&&"number"==typeof e.s.length||a.isString(e.s)))return"s: buffer expected";if(null!=e.t&&e.hasOwnProperty("t")){var t=s.onnx.TensorProto.verify(e.t);if(t)return"t."+t}if(null!=e.g&&e.hasOwnProperty("g")){var t=s.onnx.GraphProto.verify(e.g);if(t)return"g."+t}if(null!=e.sparseTensor&&e.hasOwnProperty("sparseTensor")){var t=s.onnx.SparseTensorProto.verify(e.sparseTensor);if(t)return"sparseTensor."+t}if(null!=e.tp&&e.hasOwnProperty("tp")){var t=s.onnx.TypeProto.verify(e.tp);if(t)return"tp."+t}if(null!=e.floats&&e.hasOwnProperty("floats")){if(!Array.isArray(e.floats))return"floats: array expected";for(var i=0;i<e.floats.length;++i)if("number"!=typeof e.floats[i])return"floats: number[] expected"}if(null!=e.ints&&e.hasOwnProperty("ints")){if(!Array.isArray(e.ints))return"ints: array expected";for(var i=0;i<e.ints.length;++i)if(!a.isInteger(e.ints[i])&&!(e.ints[i]&&a.isInteger(e.ints[i].low)&&a.isInteger(e.ints[i].high)))return"ints: integer|Long[] expected"}if(null!=e.strings&&e.hasOwnProperty("strings")){if(!Array.isArray(e.strings))return"strings: array expected";for(var i=0;i<e.strings.length;++i)if(!(e.strings[i]&&"number"==typeof e.strings[i].length||a.isString(e.strings[i])))return"strings: buffer[] expected"}if(null!=e.tensors&&e.hasOwnProperty("tensors")){if(!Array.isArray(e.tensors))return"tensors: array expected";for(var i=0;i<e.tensors.length;++i){var t=s.onnx.TensorProto.verify(e.tensors[i]);if(t)return"tensors."+t}}if(null!=e.graphs&&e.hasOwnProperty("graphs")){if(!Array.isArray(e.graphs))return"graphs: array expected";for(var i=0;i<e.graphs.length;++i){var t=s.onnx.GraphProto.verify(e.graphs[i]);if(t)return"graphs."+t}}if(null!=e.sparseTensors&&e.hasOwnProperty("sparseTensors")){if(!Array.isArray(e.sparseTensors))return"sparseTensors: array expected";for(var i=0;i<e.sparseTensors.length;++i){var t=s.onnx.SparseTensorProto.verify(e.sparseTensors[i]);if(t)return"sparseTensors."+t}}if(null!=e.typeProtos&&e.hasOwnProperty("typeProtos")){if(!Array.isArray(e.typeProtos))return"typeProtos: array expected";for(var i=0;i<e.typeProtos.length;++i){var t=s.onnx.TypeProto.verify(e.typeProtos[i]);if(t)return"typeProtos."+t}}return null},e.fromObject=function(e){if(e instanceof s.onnx.AttributeProto)return e;var t=new s.onnx.AttributeProto;switch(null!=e.name&&(t.name=String(e.name)),null!=e.refAttrName&&(t.refAttrName=String(e.refAttrName)),null!=e.docString&&(t.docString=String(e.docString)),e.type){default:"number"==typeof e.type&&(t.type=e.type);break;case"UNDEFINED":case 0:t.type=0;break;case"FLOAT":case 1:t.type=1;break;case"INT":case 2:t.type=2;break;case"STRING":case 3:t.type=3;break;case"TENSOR":case 4:t.type=4;break;case"GRAPH":case 5:t.type=5;break;case"SPARSE_TENSOR":case 11:t.type=11;break;case"TYPE_PROTO":case 13:t.type=13;break;case"FLOATS":case 6:t.type=6;break;case"INTS":case 7:t.type=7;break;case"STRINGS":case 8:t.type=8;break;case"TENSORS":case 9:t.type=9;break;case"GRAPHS":case 10:t.type=10;break;case"SPARSE_TENSORS":case 12:t.type=12;break;case"TYPE_PROTOS":case 14:t.type=14}if(null!=e.f&&(t.f=Number(e.f)),null!=e.i&&(a.Long?(t.i=a.Long.fromValue(e.i)).unsigned=!1:"string"==typeof e.i?t.i=parseInt(e.i,10):"number"==typeof e.i?t.i=e.i:"object"==typeof e.i&&(t.i=new a.LongBits(e.i.low>>>0,e.i.high>>>0).toNumber())),null!=e.s&&("string"==typeof e.s?a.base64.decode(e.s,t.s=a.newBuffer(a.base64.length(e.s)),0):e.s.length>=0&&(t.s=e.s)),null!=e.t){if("object"!=typeof e.t)throw TypeError(".onnx.AttributeProto.t: object expected");t.t=s.onnx.TensorProto.fromObject(e.t)}if(null!=e.g){if("object"!=typeof e.g)throw TypeError(".onnx.AttributeProto.g: object expected");t.g=s.onnx.GraphProto.fromObject(e.g)}if(null!=e.sparseTensor){if("object"!=typeof e.sparseTensor)throw TypeError(".onnx.AttributeProto.sparseTensor: object expected");t.sparseTensor=s.onnx.SparseTensorProto.fromObject(e.sparseTensor)}if(null!=e.tp){if("object"!=typeof e.tp)throw TypeError(".onnx.AttributeProto.tp: object expected");t.tp=s.onnx.TypeProto.fromObject(e.tp)}if(e.floats){if(!Array.isArray(e.floats))throw TypeError(".onnx.AttributeProto.floats: array expected");t.floats=[];for(var i=0;i<e.floats.length;++i)t.floats[i]=Number(e.floats[i])}if(e.ints){if(!Array.isArray(e.ints))throw TypeError(".onnx.AttributeProto.ints: array expected");t.ints=[];for(var i=0;i<e.ints.length;++i)a.Long?(t.ints[i]=a.Long.fromValue(e.ints[i])).unsigned=!1:"string"==typeof e.ints[i]?t.ints[i]=parseInt(e.ints[i],10):"number"==typeof e.ints[i]?t.ints[i]=e.ints[i]:"object"==typeof e.ints[i]&&(t.ints[i]=new a.LongBits(e.ints[i].low>>>0,e.ints[i].high>>>0).toNumber())}if(e.strings){if(!Array.isArray(e.strings))throw TypeError(".onnx.AttributeProto.strings: array expected");t.strings=[];for(var i=0;i<e.strings.length;++i)"string"==typeof e.strings[i]?a.base64.decode(e.strings[i],t.strings[i]=a.newBuffer(a.base64.length(e.strings[i])),0):e.strings[i].length>=0&&(t.strings[i]=e.strings[i])}if(e.tensors){if(!Array.isArray(e.tensors))throw TypeError(".onnx.AttributeProto.tensors: array expected");t.tensors=[];for(var i=0;i<e.tensors.length;++i){if("object"!=typeof e.tensors[i])throw TypeError(".onnx.AttributeProto.tensors: object expected");t.tensors[i]=s.onnx.TensorProto.fromObject(e.tensors[i])}}if(e.graphs){if(!Array.isArray(e.graphs))throw TypeError(".onnx.AttributeProto.graphs: array expected");t.graphs=[];for(var i=0;i<e.graphs.length;++i){if("object"!=typeof e.graphs[i])throw TypeError(".onnx.AttributeProto.graphs: object expected");t.graphs[i]=s.onnx.GraphProto.fromObject(e.graphs[i])}}if(e.sparseTensors){if(!Array.isArray(e.sparseTensors))throw TypeError(".onnx.AttributeProto.sparseTensors: array expected");t.sparseTensors=[];for(var i=0;i<e.sparseTensors.length;++i){if("object"!=typeof e.sparseTensors[i])throw TypeError(".onnx.AttributeProto.sparseTensors: object expected");t.sparseTensors[i]=s.onnx.SparseTensorProto.fromObject(e.sparseTensors[i])}}if(e.typeProtos){if(!Array.isArray(e.typeProtos))throw TypeError(".onnx.AttributeProto.typeProtos: array expected");t.typeProtos=[];for(var i=0;i<e.typeProtos.length;++i){if("object"!=typeof e.typeProtos[i])throw TypeError(".onnx.AttributeProto.typeProtos: object expected");t.typeProtos[i]=s.onnx.TypeProto.fromObject(e.typeProtos[i])}}return t},e.toObject=function(e,t){t||(t={});var i={};if((t.arrays||t.defaults)&&(i.floats=[],i.ints=[],i.strings=[],i.tensors=[],i.graphs=[],i.typeProtos=[],i.sparseTensors=[]),t.defaults){if(i.name="",i.f=0,a.Long){var n=new a.Long(0,0,!1);i.i=t.longs===String?n.toString():t.longs===Number?n.toNumber():n}else i.i=t.longs===String?"0":0;t.bytes===String?i.s="":(i.s=[],t.bytes!==Array&&(i.s=a.newBuffer(i.s))),i.t=null,i.g=null,i.docString="",i.tp=null,i.type=t.enums===String?"UNDEFINED":0,i.refAttrName="",i.sparseTensor=null}if(null!=e.name&&e.hasOwnProperty("name")&&(i.name=e.name),null!=e.f&&e.hasOwnProperty("f")&&(i.f=t.json&&!isFinite(e.f)?String(e.f):e.f),null!=e.i&&e.hasOwnProperty("i")&&("number"==typeof e.i?i.i=t.longs===String?String(e.i):e.i:i.i=t.longs===String?a.Long.prototype.toString.call(e.i):t.longs===Number?new a.LongBits(e.i.low>>>0,e.i.high>>>0).toNumber():e.i),null!=e.s&&e.hasOwnProperty("s")&&(i.s=t.bytes===String?a.base64.encode(e.s,0,e.s.length):t.bytes===Array?Array.prototype.slice.call(e.s):e.s),null!=e.t&&e.hasOwnProperty("t")&&(i.t=s.onnx.TensorProto.toObject(e.t,t)),null!=e.g&&e.hasOwnProperty("g")&&(i.g=s.onnx.GraphProto.toObject(e.g,t)),e.floats&&e.floats.length){i.floats=[];for(var o=0;o<e.floats.length;++o)i.floats[o]=t.json&&!isFinite(e.floats[o])?String(e.floats[o]):e.floats[o]}if(e.ints&&e.ints.length){i.ints=[];for(var o=0;o<e.ints.length;++o)"number"==typeof e.ints[o]?i.ints[o]=t.longs===String?String(e.ints[o]):e.ints[o]:i.ints[o]=t.longs===String?a.Long.prototype.toString.call(e.ints[o]):t.longs===Number?new a.LongBits(e.ints[o].low>>>0,e.ints[o].high>>>0).toNumber():e.ints[o]}if(e.strings&&e.strings.length){i.strings=[];for(var o=0;o<e.strings.length;++o)i.strings[o]=t.bytes===String?a.base64.encode(e.strings[o],0,e.strings[o].length):t.bytes===Array?Array.prototype.slice.call(e.strings[o]):e.strings[o]}if(e.tensors&&e.tensors.length){i.tensors=[];for(var o=0;o<e.tensors.length;++o)i.tensors[o]=s.onnx.TensorProto.toObject(e.tensors[o],t)}if(e.graphs&&e.graphs.length){i.graphs=[];for(var o=0;o<e.graphs.length;++o)i.graphs[o]=s.onnx.GraphProto.toObject(e.graphs[o],t)}if(null!=e.docString&&e.hasOwnProperty("docString")&&(i.docString=e.docString),null!=e.tp&&e.hasOwnProperty("tp")&&(i.tp=s.onnx.TypeProto.toObject(e.tp,t)),e.typeProtos&&e.typeProtos.length){i.typeProtos=[];for(var o=0;o<e.typeProtos.length;++o)i.typeProtos[o]=s.onnx.TypeProto.toObject(e.typeProtos[o],t)}if(null!=e.type&&e.hasOwnProperty("type")&&(i.type=t.enums===String?void 0===s.onnx.AttributeProto.AttributeType[e.type]?e.type:s.onnx.AttributeProto.AttributeType[e.type]:e.type),null!=e.refAttrName&&e.hasOwnProperty("refAttrName")&&(i.refAttrName=e.refAttrName),null!=e.sparseTensor&&e.hasOwnProperty("sparseTensor")&&(i.sparseTensor=s.onnx.SparseTensorProto.toObject(e.sparseTensor,t)),e.sparseTensors&&e.sparseTensors.length){i.sparseTensors=[];for(var o=0;o<e.sparseTensors.length;++o)i.sparseTensors[o]=s.onnx.SparseTensorProto.toObject(e.sparseTensors[o],t)}return i},e.prototype.toJSON=function(){return this.constructor.toObject(this,i.util.toJSONOptions)},e.getTypeUrl=function(e){return void 0===e&&(e="type.googleapis.com"),e+"/onnx.AttributeProto"},e.AttributeType=function(){var e={},t=Object.create(e);return t[e[0]="UNDEFINED"]=0,t[e[1]="FLOAT"]=1,t[e[2]="INT"]=2,t[e[3]="STRING"]=3,t[e[4]="TENSOR"]=4,t[e[5]="GRAPH"]=5,t[e[11]="SPARSE_TENSOR"]=11,t[e[13]="TYPE_PROTO"]=13,t[e[6]="FLOATS"]=6,t[e[7]="INTS"]=7,t[e[8]="STRINGS"]=8,t[e[9]="TENSORS"]=9,t[e[10]="GRAPHS"]=10,t[e[12]="SPARSE_TENSORS"]=12,t[e[14]="TYPE_PROTOS"]=14,t}(),e}(),e.ValueInfoProto=function(){function e(e){if(e)for(var t=Object.keys(e),i=0;i<t.length;++i)null!=e[t[i]]&&(this[t[i]]=e[t[i]])}return e.prototype.name="",e.prototype.type=null,e.prototype.docString="",e.create=function(t){return new e(t)},e.encode=function(e,t){return t||(t=o.create()),null!=e.name&&Object.hasOwnProperty.call(e,"name")&&t.uint32(10).string(e.name),null!=e.type&&Object.hasOwnProperty.call(e,"type")&&s.onnx.TypeProto.encode(e.type,t.uint32(18).fork()).ldelim(),null!=e.docString&&Object.hasOwnProperty.call(e,"docString")&&t.uint32(26).string(e.docString),t},e.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},e.decode=function(e,t){e instanceof n||(e=n.create(e));for(var i=void 0===t?e.len:e.pos+t,o=new s.onnx.ValueInfoProto;e.pos<i;){var a=e.uint32();switch(a>>>3){case 1:o.name=e.string();break;case 2:o.type=s.onnx.TypeProto.decode(e,e.uint32());break;case 3:o.docString=e.string();break;default:e.skipType(7&a)}}return o},e.decodeDelimited=function(e){return e instanceof n||(e=new n(e)),this.decode(e,e.uint32())},e.verify=function(e){if("object"!=typeof e||null===e)return"object expected";if(null!=e.name&&e.hasOwnProperty("name")&&!a.isString(e.name))return"name: string expected";if(null!=e.type&&e.hasOwnProperty("type")){var t=s.onnx.TypeProto.verify(e.type);if(t)return"type."+t}return null!=e.docString&&e.hasOwnProperty("docString")&&!a.isString(e.docString)?"docString: string expected":null},e.fromObject=function(e){if(e instanceof s.onnx.ValueInfoProto)return e;var t=new s.onnx.ValueInfoProto;if(null!=e.name&&(t.name=String(e.name)),null!=e.type){if("object"!=typeof e.type)throw TypeError(".onnx.ValueInfoProto.type: object expected");t.type=s.onnx.TypeProto.fromObject(e.type)}return null!=e.docString&&(t.docString=String(e.docString)),t},e.toObject=function(e,t){t||(t={});var i={};return t.defaults&&(i.name="",i.type=null,i.docString=""),null!=e.name&&e.hasOwnProperty("name")&&(i.name=e.name),null!=e.type&&e.hasOwnProperty("type")&&(i.type=s.onnx.TypeProto.toObject(e.type,t)),null!=e.docString&&e.hasOwnProperty("docString")&&(i.docString=e.docString),i},e.prototype.toJSON=function(){return this.constructor.toObject(this,i.util.toJSONOptions)},e.getTypeUrl=function(e){return void 0===e&&(e="type.googleapis.com"),e+"/onnx.ValueInfoProto"},e}(),e.NodeProto=function(){function e(e){if(this.input=[],this.output=[],this.attribute=[],e)for(var t=Object.keys(e),i=0;i<t.length;++i)null!=e[t[i]]&&(this[t[i]]=e[t[i]])}return e.prototype.input=a.emptyArray,e.prototype.output=a.emptyArray,e.prototype.name="",e.prototype.opType="",e.prototype.domain="",e.prototype.attribute=a.emptyArray,e.prototype.docString="",e.create=function(t){return new e(t)},e.encode=function(e,t){if(t||(t=o.create()),null!=e.input&&e.input.length)for(var i=0;i<e.input.length;++i)t.uint32(10).string(e.input[i]);if(null!=e.output&&e.output.length)for(var i=0;i<e.output.length;++i)t.uint32(18).string(e.output[i]);if(null!=e.name&&Object.hasOwnProperty.call(e,"name")&&t.uint32(26).string(e.name),null!=e.opType&&Object.hasOwnProperty.call(e,"opType")&&t.uint32(34).string(e.opType),null!=e.attribute&&e.attribute.length)for(var i=0;i<e.attribute.length;++i)s.onnx.AttributeProto.encode(e.attribute[i],t.uint32(42).fork()).ldelim();return null!=e.docString&&Object.hasOwnProperty.call(e,"docString")&&t.uint32(50).string(e.docString),null!=e.domain&&Object.hasOwnProperty.call(e,"domain")&&t.uint32(58).string(e.domain),t},e.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},e.decode=function(e,t){e instanceof n||(e=n.create(e));for(var i=void 0===t?e.len:e.pos+t,o=new s.onnx.NodeProto;e.pos<i;){var a=e.uint32();switch(a>>>3){case 1:o.input&&o.input.length||(o.input=[]),o.input.push(e.string());break;case 2:o.output&&o.output.length||(o.output=[]),o.output.push(e.string());break;case 3:o.name=e.string();break;case 4:o.opType=e.string();break;case 7:o.domain=e.string();break;case 5:o.attribute&&o.attribute.length||(o.attribute=[]),o.attribute.push(s.onnx.AttributeProto.decode(e,e.uint32()));break;case 6:o.docString=e.string();break;default:e.skipType(7&a)}}return o},e.decodeDelimited=function(e){return e instanceof n||(e=new n(e)),this.decode(e,e.uint32())},e.verify=function(e){if("object"!=typeof e||null===e)return"object expected";if(null!=e.input&&e.hasOwnProperty("input")){if(!Array.isArray(e.input))return"input: array expected";for(var t=0;t<e.input.length;++t)if(!a.isString(e.input[t]))return"input: string[] expected"}if(null!=e.output&&e.hasOwnProperty("output")){if(!Array.isArray(e.output))return"output: array expected";for(var t=0;t<e.output.length;++t)if(!a.isString(e.output[t]))return"output: string[] expected"}if(null!=e.name&&e.hasOwnProperty("name")&&!a.isString(e.name))return"name: string expected";if(null!=e.opType&&e.hasOwnProperty("opType")&&!a.isString(e.opType))return"opType: string expected";if(null!=e.domain&&e.hasOwnProperty("domain")&&!a.isString(e.domain))return"domain: string expected";if(null!=e.attribute&&e.hasOwnProperty("attribute")){if(!Array.isArray(e.attribute))return"attribute: array expected";for(var t=0;t<e.attribute.length;++t){var i=s.onnx.AttributeProto.verify(e.attribute[t]);if(i)return"attribute."+i}}return null!=e.docString&&e.hasOwnProperty("docString")&&!a.isString(e.docString)?"docString: string expected":null},e.fromObject=function(e){if(e instanceof s.onnx.NodeProto)return e;var t=new s.onnx.NodeProto;if(e.input){if(!Array.isArray(e.input))throw TypeError(".onnx.NodeProto.input: array expected");t.input=[];for(var i=0;i<e.input.length;++i)t.input[i]=String(e.input[i])}if(e.output){if(!Array.isArray(e.output))throw TypeError(".onnx.NodeProto.output: array expected");t.output=[];for(var i=0;i<e.output.length;++i)t.output[i]=String(e.output[i])}if(null!=e.name&&(t.name=String(e.name)),null!=e.opType&&(t.opType=String(e.opType)),null!=e.domain&&(t.domain=String(e.domain)),e.attribute){if(!Array.isArray(e.attribute))throw TypeError(".onnx.NodeProto.attribute: array expected");t.attribute=[];for(var i=0;i<e.attribute.length;++i){if("object"!=typeof e.attribute[i])throw TypeError(".onnx.NodeProto.attribute: object expected");t.attribute[i]=s.onnx.AttributeProto.fromObject(e.attribute[i])}}return null!=e.docString&&(t.docString=String(e.docString)),t},e.toObject=function(e,t){t||(t={});var i={};if((t.arrays||t.defaults)&&(i.input=[],i.output=[],i.attribute=[]),t.defaults&&(i.name="",i.opType="",i.docString="",i.domain=""),e.input&&e.input.length){i.input=[];for(var n=0;n<e.input.length;++n)i.input[n]=e.input[n]}if(e.output&&e.output.length){i.output=[];for(var n=0;n<e.output.length;++n)i.output[n]=e.output[n]}if(null!=e.name&&e.hasOwnProperty("name")&&(i.name=e.name),null!=e.opType&&e.hasOwnProperty("opType")&&(i.opType=e.opType),e.attribute&&e.attribute.length){i.attribute=[];for(var n=0;n<e.attribute.length;++n)i.attribute[n]=s.onnx.AttributeProto.toObject(e.attribute[n],t)}return null!=e.docString&&e.hasOwnProperty("docString")&&(i.docString=e.docString),null!=e.domain&&e.hasOwnProperty("domain")&&(i.domain=e.domain),i},e.prototype.toJSON=function(){return this.constructor.toObject(this,i.util.toJSONOptions)},e.getTypeUrl=function(e){return void 0===e&&(e="type.googleapis.com"),e+"/onnx.NodeProto"},e}(),e.TrainingInfoProto=function(){function e(e){if(this.initializationBinding=[],this.updateBinding=[],e)for(var t=Object.keys(e),i=0;i<t.length;++i)null!=e[t[i]]&&(this[t[i]]=e[t[i]])}return e.prototype.initialization=null,e.prototype.algorithm=null,e.prototype.initializationBinding=a.emptyArray,e.prototype.updateBinding=a.emptyArray,e.create=function(t){return new e(t)},e.encode=function(e,t){if(t||(t=o.create()),null!=e.initialization&&Object.hasOwnProperty.call(e,"initialization")&&s.onnx.GraphProto.encode(e.initialization,t.uint32(10).fork()).ldelim(),null!=e.algorithm&&Object.hasOwnProperty.call(e,"algorithm")&&s.onnx.GraphProto.encode(e.algorithm,t.uint32(18).fork()).ldelim(),null!=e.initializationBinding&&e.initializationBinding.length)for(var i=0;i<e.initializationBinding.length;++i)s.onnx.StringStringEntryProto.encode(e.initializationBinding[i],t.uint32(26).fork()).ldelim();if(null!=e.updateBinding&&e.updateBinding.length)for(var i=0;i<e.updateBinding.length;++i)s.onnx.StringStringEntryProto.encode(e.updateBinding[i],t.uint32(34).fork()).ldelim();return t},e.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},e.decode=function(e,t){e instanceof n||(e=n.create(e));for(var i=void 0===t?e.len:e.pos+t,o=new s.onnx.TrainingInfoProto;e.pos<i;){var a=e.uint32();switch(a>>>3){case 1:o.initialization=s.onnx.GraphProto.decode(e,e.uint32());break;case 2:o.algorithm=s.onnx.GraphProto.decode(e,e.uint32());break;case 3:o.initializationBinding&&o.initializationBinding.length||(o.initializationBinding=[]),o.initializationBinding.push(s.onnx.StringStringEntryProto.decode(e,e.uint32()));break;case 4:o.updateBinding&&o.updateBinding.length||(o.updateBinding=[]),o.updateBinding.push(s.onnx.StringStringEntryProto.decode(e,e.uint32()));break;default:e.skipType(7&a)}}return o},e.decodeDelimited=function(e){return e instanceof n||(e=new n(e)),this.decode(e,e.uint32())},e.verify=function(e){if("object"!=typeof e||null===e)return"object expected";if(null!=e.initialization&&e.hasOwnProperty("initialization")){var t=s.onnx.GraphProto.verify(e.initialization);if(t)return"initialization."+t}if(null!=e.algorithm&&e.hasOwnProperty("algorithm")){var t=s.onnx.GraphProto.verify(e.algorithm);if(t)return"algorithm."+t}if(null!=e.initializationBinding&&e.hasOwnProperty("initializationBinding")){if(!Array.isArray(e.initializationBinding))return"initializationBinding: array expected";for(var i=0;i<e.initializationBinding.length;++i){var t=s.onnx.StringStringEntryProto.verify(e.initializationBinding[i]);if(t)return"initializationBinding."+t}}if(null!=e.updateBinding&&e.hasOwnProperty("updateBinding")){if(!Array.isArray(e.updateBinding))return"updateBinding: array expected";for(var i=0;i<e.updateBinding.length;++i){var t=s.onnx.StringStringEntryProto.verify(e.updateBinding[i]);if(t)return"updateBinding."+t}}return null},e.fromObject=function(e){if(e instanceof s.onnx.TrainingInfoProto)return e;var t=new s.onnx.TrainingInfoProto;if(null!=e.initialization){if("object"!=typeof e.initialization)throw TypeError(".onnx.TrainingInfoProto.initialization: object expected");t.initialization=s.onnx.GraphProto.fromObject(e.initialization)}if(null!=e.algorithm){if("object"!=typeof e.algorithm)throw TypeError(".onnx.TrainingInfoProto.algorithm: object expected");t.algorithm=s.onnx.GraphProto.fromObject(e.algorithm)}if(e.initializationBinding){if(!Array.isArray(e.initializationBinding))throw TypeError(".onnx.TrainingInfoProto.initializationBinding: array expected");t.initializationBinding=[];for(var i=0;i<e.initializationBinding.length;++i){if("object"!=typeof e.initializationBinding[i])throw TypeError(".onnx.TrainingInfoProto.initializationBinding: object expected");t.initializationBinding[i]=s.onnx.StringStringEntryProto.fromObject(e.initializationBinding[i])}}if(e.updateBinding){if(!Array.isArray(e.updateBinding))throw TypeError(".onnx.TrainingInfoProto.updateBinding: array expected");t.updateBinding=[];for(var i=0;i<e.updateBinding.length;++i){if("object"!=typeof e.updateBinding[i])throw TypeError(".onnx.TrainingInfoProto.updateBinding: object expected");t.updateBinding[i]=s.onnx.StringStringEntryProto.fromObject(e.updateBinding[i])}}return t},e.toObject=function(e,t){t||(t={});var i={};if((t.arrays||t.defaults)&&(i.initializationBinding=[],i.updateBinding=[]),t.defaults&&(i.initialization=null,i.algorithm=null),null!=e.initialization&&e.hasOwnProperty("initialization")&&(i.initialization=s.onnx.GraphProto.toObject(e.initialization,t)),null!=e.algorithm&&e.hasOwnProperty("algorithm")&&(i.algorithm=s.onnx.GraphProto.toObject(e.algorithm,t)),e.initializationBinding&&e.initializationBinding.length){i.initializationBinding=[];for(var n=0;n<e.initializationBinding.length;++n)i.initializationBinding[n]=s.onnx.StringStringEntryProto.toObject(e.initializationBinding[n],t)}if(e.updateBinding&&e.updateBinding.length){i.updateBinding=[];for(var n=0;n<e.updateBinding.length;++n)i.updateBinding[n]=s.onnx.StringStringEntryProto.toObject(e.updateBinding[n],t)}return i},e.prototype.toJSON=function(){return this.constructor.toObject(this,i.util.toJSONOptions)},e.getTypeUrl=function(e){return void 0===e&&(e="type.googleapis.com"),e+"/onnx.TrainingInfoProto"},e}(),e.ModelProto=function(){function e(e){if(this.opsetImport=[],this.metadataProps=[],this.trainingInfo=[],this.functions=[],e)for(var t=Object.keys(e),i=0;i<t.length;++i)null!=e[t[i]]&&(this[t[i]]=e[t[i]])}return e.prototype.irVersion=a.Long?a.Long.fromBits(0,0,!1):0,e.prototype.opsetImport=a.emptyArray,e.prototype.producerName="",e.prototype.producerVersion="",e.prototype.domain="",e.prototype.modelVersion=a.Long?a.Long.fromBits(0,0,!1):0,e.prototype.docString="",e.prototype.graph=null,e.prototype.metadataProps=a.emptyArray,e.prototype.trainingInfo=a.emptyArray,e.prototype.functions=a.emptyArray,e.create=function(t){return new e(t)},e.encode=function(e,t){if(t||(t=o.create()),null!=e.irVersion&&Object.hasOwnProperty.call(e,"irVersion")&&t.uint32(8).int64(e.irVersion),null!=e.producerName&&Object.hasOwnProperty.call(e,"producerName")&&t.uint32(18).string(e.producerName),null!=e.producerVersion&&Object.hasOwnProperty.call(e,"producerVersion")&&t.uint32(26).string(e.producerVersion),null!=e.domain&&Object.hasOwnProperty.call(e,"domain")&&t.uint32(34).string(e.domain),null!=e.modelVersion&&Object.hasOwnProperty.call(e,"modelVersion")&&t.uint32(40).int64(e.modelVersion),null!=e.docString&&Object.hasOwnProperty.call(e,"docString")&&t.uint32(50).string(e.docString),null!=e.graph&&Object.hasOwnProperty.call(e,"graph")&&s.onnx.GraphProto.encode(e.graph,t.uint32(58).fork()).ldelim(),null!=e.opsetImport&&e.opsetImport.length)for(var i=0;i<e.opsetImport.length;++i)s.onnx.OperatorSetIdProto.encode(e.opsetImport[i],t.uint32(66).fork()).ldelim();if(null!=e.metadataProps&&e.metadataProps.length)for(var i=0;i<e.metadataProps.length;++i)s.onnx.StringStringEntryProto.encode(e.metadataProps[i],t.uint32(114).fork()).ldelim();if(null!=e.trainingInfo&&e.trainingInfo.length)for(var i=0;i<e.trainingInfo.length;++i)s.onnx.TrainingInfoProto.encode(e.trainingInfo[i],t.uint32(162).fork()).ldelim();if(null!=e.functions&&e.functions.length)for(var i=0;i<e.functions.length;++i)s.onnx.FunctionProto.encode(e.functions[i],t.uint32(202).fork()).ldelim();return t},e.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},e.decode=function(e,t){e instanceof n||(e=n.create(e));for(var i=void 0===t?e.len:e.pos+t,o=new s.onnx.ModelProto;e.pos<i;){var a=e.uint32();switch(a>>>3){case 1:o.irVersion=e.int64();break;case 8:o.opsetImport&&o.opsetImport.length||(o.opsetImport=[]),o.opsetImport.push(s.onnx.OperatorSetIdProto.decode(e,e.uint32()));break;case 2:o.producerName=e.string();break;case 3:o.producerVersion=e.string();break;case 4:o.domain=e.string();break;case 5:o.modelVersion=e.int64();break;case 6:o.docString=e.string();break;case 7:o.graph=s.onnx.GraphProto.decode(e,e.uint32());break;case 14:o.metadataProps&&o.metadataProps.length||(o.metadataProps=[]),o.metadataProps.push(s.onnx.StringStringEntryProto.decode(e,e.uint32()));break;case 20:o.trainingInfo&&o.trainingInfo.length||(o.trainingInfo=[]),o.trainingInfo.push(s.onnx.TrainingInfoProto.decode(e,e.uint32()));break;case 25:o.functions&&o.functions.length||(o.functions=[]),o.functions.push(s.onnx.FunctionProto.decode(e,e.uint32()));break;default:e.skipType(7&a)}}return o},e.decodeDelimited=function(e){return e instanceof n||(e=new n(e)),this.decode(e,e.uint32())},e.verify=function(e){if("object"!=typeof e||null===e)return"object expected";if(null!=e.irVersion&&e.hasOwnProperty("irVersion")&&!a.isInteger(e.irVersion)&&!(e.irVersion&&a.isInteger(e.irVersion.low)&&a.isInteger(e.irVersion.high)))return"irVersion: integer|Long expected";if(null!=e.opsetImport&&e.hasOwnProperty("opsetImport")){if(!Array.isArray(e.opsetImport))return"opsetImport: array expected";for(var t=0;t<e.opsetImport.length;++t){var i=s.onnx.OperatorSetIdProto.verify(e.opsetImport[t]);if(i)return"opsetImport."+i}}if(null!=e.producerName&&e.hasOwnProperty("producerName")&&!a.isString(e.producerName))return"producerName: string expected";if(null!=e.producerVersion&&e.hasOwnProperty("producerVersion")&&!a.isString(e.producerVersion))return"producerVersion: string expected";if(null!=e.domain&&e.hasOwnProperty("domain")&&!a.isString(e.domain))return"domain: string expected";if(null!=e.modelVersion&&e.hasOwnProperty("modelVersion")&&!a.isInteger(e.modelVersion)&&!(e.modelVersion&&a.isInteger(e.modelVersion.low)&&a.isInteger(e.modelVersion.high)))return"modelVersion: integer|Long expected";if(null!=e.docString&&e.hasOwnProperty("docString")&&!a.isString(e.docString))return"docString: string expected";if(null!=e.graph&&e.hasOwnProperty("graph")){var i=s.onnx.GraphProto.verify(e.graph);if(i)return"graph."+i}if(null!=e.metadataProps&&e.hasOwnProperty("metadataProps")){if(!Array.isArray(e.metadataProps))return"metadataProps: array expected";for(var t=0;t<e.metadataProps.length;++t){var i=s.onnx.StringStringEntryProto.verify(e.metadataProps[t]);if(i)return"metadataProps."+i}}if(null!=e.trainingInfo&&e.hasOwnProperty("trainingInfo")){if(!Array.isArray(e.trainingInfo))return"trainingInfo: array expected";for(var t=0;t<e.trainingInfo.length;++t){var i=s.onnx.TrainingInfoProto.verify(e.trainingInfo[t]);if(i)return"trainingInfo."+i}}if(null!=e.functions&&e.hasOwnProperty("functions")){if(!Array.isArray(e.functions))return"functions: array expected";for(var t=0;t<e.functions.length;++t){var i=s.onnx.FunctionProto.verify(e.functions[t]);if(i)return"functions."+i}}return null},e.fromObject=function(e){if(e instanceof s.onnx.ModelProto)return e;var t=new s.onnx.ModelProto;if(null!=e.irVersion&&(a.Long?(t.irVersion=a.Long.fromValue(e.irVersion)).unsigned=!1:"string"==typeof e.irVersion?t.irVersion=parseInt(e.irVersion,10):"number"==typeof e.irVersion?t.irVersion=e.irVersion:"object"==typeof e.irVersion&&(t.irVersion=new a.LongBits(e.irVersion.low>>>0,e.irVersion.high>>>0).toNumber())),e.opsetImport){if(!Array.isArray(e.opsetImport))throw TypeError(".onnx.ModelProto.opsetImport: array expected");t.opsetImport=[];for(var i=0;i<e.opsetImport.length;++i){if("object"!=typeof e.opsetImport[i])throw TypeError(".onnx.ModelProto.opsetImport: object expected");t.opsetImport[i]=s.onnx.OperatorSetIdProto.fromObject(e.opsetImport[i])}}if(null!=e.producerName&&(t.producerName=String(e.producerName)),null!=e.producerVersion&&(t.producerVersion=String(e.producerVersion)),null!=e.domain&&(t.domain=String(e.domain)),null!=e.modelVersion&&(a.Long?(t.modelVersion=a.Long.fromValue(e.modelVersion)).unsigned=!1:"string"==typeof e.modelVersion?t.modelVersion=parseInt(e.modelVersion,10):"number"==typeof e.modelVersion?t.modelVersion=e.modelVersion:"object"==typeof e.modelVersion&&(t.modelVersion=new a.LongBits(e.modelVersion.low>>>0,e.modelVersion.high>>>0).toNumber())),null!=e.docString&&(t.docString=String(e.docString)),null!=e.graph){if("object"!=typeof e.graph)throw TypeError(".onnx.ModelProto.graph: object expected");t.graph=s.onnx.GraphProto.fromObject(e.graph)}if(e.metadataProps){if(!Array.isArray(e.metadataProps))throw TypeError(".onnx.ModelProto.metadataProps: array expected");t.metadataProps=[];for(var i=0;i<e.metadataProps.length;++i){if("object"!=typeof e.metadataProps[i])throw TypeError(".onnx.ModelProto.metadataProps: object expected");t.metadataProps[i]=s.onnx.StringStringEntryProto.fromObject(e.metadataProps[i])}}if(e.trainingInfo){if(!Array.isArray(e.trainingInfo))throw TypeError(".onnx.ModelProto.trainingInfo: array expected");t.trainingInfo=[];for(var i=0;i<e.trainingInfo.length;++i){if("object"!=typeof e.trainingInfo[i])throw TypeError(".onnx.ModelProto.trainingInfo: object expected");t.trainingInfo[i]=s.onnx.TrainingInfoProto.fromObject(e.trainingInfo[i])}}if(e.functions){if(!Array.isArray(e.functions))throw TypeError(".onnx.ModelProto.functions: array expected");t.functions=[];for(var i=0;i<e.functions.length;++i){if("object"!=typeof e.functions[i])throw TypeError(".onnx.ModelProto.functions: object expected");t.functions[i]=s.onnx.FunctionProto.fromObject(e.functions[i])}}return t},e.toObject=function(e,t){t||(t={});var i={};if((t.arrays||t.defaults)&&(i.opsetImport=[],i.metadataProps=[],i.trainingInfo=[],i.functions=[]),t.defaults){if(a.Long){var n=new a.Long(0,0,!1);i.irVersion=t.longs===String?n.toString():t.longs===Number?n.toNumber():n}else i.irVersion=t.longs===String?"0":0;if(i.producerName="",i.producerVersion="",i.domain="",a.Long){var n=new a.Long(0,0,!1);i.modelVersion=t.longs===String?n.toString():t.longs===Number?n.toNumber():n}else i.modelVersion=t.longs===String?"0":0;i.docString="",i.graph=null}if(null!=e.irVersion&&e.hasOwnProperty("irVersion")&&("number"==typeof e.irVersion?i.irVersion=t.longs===String?String(e.irVersion):e.irVersion:i.irVersion=t.longs===String?a.Long.prototype.toString.call(e.irVersion):t.longs===Number?new a.LongBits(e.irVersion.low>>>0,e.irVersion.high>>>0).toNumber():e.irVersion),null!=e.producerName&&e.hasOwnProperty("producerName")&&(i.producerName=e.producerName),null!=e.producerVersion&&e.hasOwnProperty("producerVersion")&&(i.producerVersion=e.producerVersion),null!=e.domain&&e.hasOwnProperty("domain")&&(i.domain=e.domain),null!=e.modelVersion&&e.hasOwnProperty("modelVersion")&&("number"==typeof e.modelVersion?i.modelVersion=t.longs===String?String(e.modelVersion):e.modelVersion:i.modelVersion=t.longs===String?a.Long.prototype.toString.call(e.modelVersion):t.longs===Number?new a.LongBits(e.modelVersion.low>>>0,e.modelVersion.high>>>0).toNumber():e.modelVersion),null!=e.docString&&e.hasOwnProperty("docString")&&(i.docString=e.docString),null!=e.graph&&e.hasOwnProperty("graph")&&(i.graph=s.onnx.GraphProto.toObject(e.graph,t)),e.opsetImport&&e.opsetImport.length){i.opsetImport=[];for(var o=0;o<e.opsetImport.length;++o)i.opsetImport[o]=s.onnx.OperatorSetIdProto.toObject(e.opsetImport[o],t)}if(e.metadataProps&&e.metadataProps.length){i.metadataProps=[];for(var o=0;o<e.metadataProps.length;++o)i.metadataProps[o]=s.onnx.StringStringEntryProto.toObject(e.metadataProps[o],t)}if(e.trainingInfo&&e.trainingInfo.length){i.trainingInfo=[];for(var o=0;o<e.trainingInfo.length;++o)i.trainingInfo[o]=s.onnx.TrainingInfoProto.toObject(e.trainingInfo[o],t)}if(e.functions&&e.functions.length){i.functions=[];for(var o=0;o<e.functions.length;++o)i.functions[o]=s.onnx.FunctionProto.toObject(e.functions[o],t)}return i},e.prototype.toJSON=function(){return this.constructor.toObject(this,i.util.toJSONOptions)},e.getTypeUrl=function(e){return void 0===e&&(e="type.googleapis.com"),e+"/onnx.ModelProto"},e}(),e.StringStringEntryProto=function(){function e(e){if(e)for(var t=Object.keys(e),i=0;i<t.length;++i)null!=e[t[i]]&&(this[t[i]]=e[t[i]])}return e.prototype.key="",e.prototype.value="",e.create=function(t){return new e(t)},e.encode=function(e,t){return t||(t=o.create()),null!=e.key&&Object.hasOwnProperty.call(e,"key")&&t.uint32(10).string(e.key),null!=e.value&&Object.hasOwnProperty.call(e,"value")&&t.uint32(18).string(e.value),t},e.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},e.decode=function(e,t){e instanceof n||(e=n.create(e));for(var i=void 0===t?e.len:e.pos+t,o=new s.onnx.StringStringEntryProto;e.pos<i;){var a=e.uint32();switch(a>>>3){case 1:o.key=e.string();break;case 2:o.value=e.string();break;default:e.skipType(7&a)}}return o},e.decodeDelimited=function(e){return e instanceof n||(e=new n(e)),this.decode(e,e.uint32())},e.verify=function(e){return"object"!=typeof e||null===e?"object expected":null!=e.key&&e.hasOwnProperty("key")&&!a.isString(e.key)?"key: string expected":null!=e.value&&e.hasOwnProperty("value")&&!a.isString(e.value)?"value: string expected":null},e.fromObject=function(e){if(e instanceof s.onnx.StringStringEntryProto)return e;var t=new s.onnx.StringStringEntryProto;return null!=e.key&&(t.key=String(e.key)),null!=e.value&&(t.value=String(e.value)),t},e.toObject=function(e,t){t||(t={});var i={};return t.defaults&&(i.key="",i.value=""),null!=e.key&&e.hasOwnProperty("key")&&(i.key=e.key),null!=e.value&&e.hasOwnProperty("value")&&(i.value=e.value),i},e.prototype.toJSON=function(){return this.constructor.toObject(this,i.util.toJSONOptions)},e.getTypeUrl=function(e){return void 0===e&&(e="type.googleapis.com"),e+"/onnx.StringStringEntryProto"},e}(),e.TensorAnnotation=function(){function e(e){if(this.quantParameterTensorNames=[],e)for(var t=Object.keys(e),i=0;i<t.length;++i)null!=e[t[i]]&&(this[t[i]]=e[t[i]])}return e.prototype.tensorName="",e.prototype.quantParameterTensorNames=a.emptyArray,e.create=function(t){return new e(t)},e.encode=function(e,t){if(t||(t=o.create()),null!=e.tensorName&&Object.hasOwnProperty.call(e,"tensorName")&&t.uint32(10).string(e.tensorName),null!=e.quantParameterTensorNames&&e.quantParameterTensorNames.length)for(var i=0;i<e.quantParameterTensorNames.length;++i)s.onnx.StringStringEntryProto.encode(e.quantParameterTensorNames[i],t.uint32(18).fork()).ldelim();return t},e.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},e.decode=function(e,t){e instanceof n||(e=n.create(e));for(var i=void 0===t?e.len:e.pos+t,o=new s.onnx.TensorAnnotation;e.pos<i;){var a=e.uint32();switch(a>>>3){case 1:o.tensorName=e.string();break;case 2:o.quantParameterTensorNames&&o.quantParameterTensorNames.length||(o.quantParameterTensorNames=[]),o.quantParameterTensorNames.push(s.onnx.StringStringEntryProto.decode(e,e.uint32()));break;default:e.skipType(7&a)}}return o},e.decodeDelimited=function(e){return e instanceof n||(e=new n(e)),this.decode(e,e.uint32())},e.verify=function(e){if("object"!=typeof e||null===e)return"object expected";if(null!=e.tensorName&&e.hasOwnProperty("tensorName")&&!a.isString(e.tensorName))return"tensorName: string expected";if(null!=e.quantParameterTensorNames&&e.hasOwnProperty("quantParameterTensorNames")){if(!Array.isArray(e.quantParameterTensorNames))return"quantParameterTensorNames: array expected";for(var t=0;t<e.quantParameterTensorNames.length;++t){var i=s.onnx.StringStringEntryProto.verify(e.quantParameterTensorNames[t]);if(i)return"quantParameterTensorNames."+i}}return null},e.fromObject=function(e){if(e instanceof s.onnx.TensorAnnotation)return e;var t=new s.onnx.TensorAnnotation;if(null!=e.tensorName&&(t.tensorName=String(e.tensorName)),e.quantParameterTensorNames){if(!Array.isArray(e.quantParameterTensorNames))throw TypeError(".onnx.TensorAnnotation.quantParameterTensorNames: array expected");t.quantParameterTensorNames=[];for(var i=0;i<e.quantParameterTensorNames.length;++i){if("object"!=typeof e.quantParameterTensorNames[i])throw TypeError(".onnx.TensorAnnotation.quantParameterTensorNames: object expected");t.quantParameterTensorNames[i]=s.onnx.StringStringEntryProto.fromObject(e.quantParameterTensorNames[i])}}return t},e.toObject=function(e,t){t||(t={});var i={};if((t.arrays||t.defaults)&&(i.quantParameterTensorNames=[]),t.defaults&&(i.tensorName=""),null!=e.tensorName&&e.hasOwnProperty("tensorName")&&(i.tensorName=e.tensorName),e.quantParameterTensorNames&&e.quantParameterTensorNames.length){i.quantParameterTensorNames=[];for(var n=0;n<e.quantParameterTensorNames.length;++n)i.quantParameterTensorNames[n]=s.onnx.StringStringEntryProto.toObject(e.quantParameterTensorNames[n],t)}return i},e.prototype.toJSON=function(){return this.constructor.toObject(this,i.util.toJSONOptions)},e.getTypeUrl=function(e){return void 0===e&&(e="type.googleapis.com"),e+"/onnx.TensorAnnotation"},e}(),e.GraphProto=function(){function e(e){if(this.node=[],this.initializer=[],this.sparseInitializer=[],this.input=[],this.output=[],this.valueInfo=[],this.quantizationAnnotation=[],e)for(var t=Object.keys(e),i=0;i<t.length;++i)null!=e[t[i]]&&(this[t[i]]=e[t[i]])}return e.prototype.node=a.emptyArray,e.prototype.name="",e.prototype.initializer=a.emptyArray,e.prototype.sparseInitializer=a.emptyArray,e.prototype.docString="",e.prototype.input=a.emptyArray,e.prototype.output=a.emptyArray,e.prototype.valueInfo=a.emptyArray,e.prototype.quantizationAnnotation=a.emptyArray,e.create=function(t){return new e(t)},e.encode=function(e,t){if(t||(t=o.create()),null!=e.node&&e.node.length)for(var i=0;i<e.node.length;++i)s.onnx.NodeProto.encode(e.node[i],t.uint32(10).fork()).ldelim();if(null!=e.name&&Object.hasOwnProperty.call(e,"name")&&t.uint32(18).string(e.name),null!=e.initializer&&e.initializer.length)for(var i=0;i<e.initializer.length;++i)s.onnx.TensorProto.encode(e.initializer[i],t.uint32(42).fork()).ldelim();if(null!=e.docString&&Object.hasOwnProperty.call(e,"docString")&&t.uint32(82).string(e.docString),null!=e.input&&e.input.length)for(var i=0;i<e.input.length;++i)s.onnx.ValueInfoProto.encode(e.input[i],t.uint32(90).fork()).ldelim();if(null!=e.output&&e.output.length)for(var i=0;i<e.output.length;++i)s.onnx.ValueInfoProto.encode(e.output[i],t.uint32(98).fork()).ldelim();if(null!=e.valueInfo&&e.valueInfo.length)for(var i=0;i<e.valueInfo.length;++i)s.onnx.ValueInfoProto.encode(e.valueInfo[i],t.uint32(106).fork()).ldelim();if(null!=e.quantizationAnnotation&&e.quantizationAnnotation.length)for(var i=0;i<e.quantizationAnnotation.length;++i)s.onnx.TensorAnnotation.encode(e.quantizationAnnotation[i],t.uint32(114).fork()).ldelim();if(null!=e.sparseInitializer&&e.sparseInitializer.length)for(var i=0;i<e.sparseInitializer.length;++i)s.onnx.SparseTensorProto.encode(e.sparseInitializer[i],t.uint32(122).fork()).ldelim();return t},e.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},e.decode=function(e,t){e instanceof n||(e=n.create(e));for(var i=void 0===t?e.len:e.pos+t,o=new s.onnx.GraphProto;e.pos<i;){var a=e.uint32();switch(a>>>3){case 1:o.node&&o.node.length||(o.node=[]),o.node.push(s.onnx.NodeProto.decode(e,e.uint32()));break;case 2:o.name=e.string();break;case 5:o.initializer&&o.initializer.length||(o.initializer=[]),o.initializer.push(s.onnx.TensorProto.decode(e,e.uint32()));break;case 15:o.sparseInitializer&&o.sparseInitializer.length||(o.sparseInitializer=[]),o.sparseInitializer.push(s.onnx.SparseTensorProto.decode(e,e.uint32()));break;case 10:o.docString=e.string();break;case 11:o.input&&o.input.length||(o.input=[]),o.input.push(s.onnx.ValueInfoProto.decode(e,e.uint32()));break;case 12:o.output&&o.output.length||(o.output=[]),o.output.push(s.onnx.ValueInfoProto.decode(e,e.uint32()));break;case 13:o.valueInfo&&o.valueInfo.length||(o.valueInfo=[]),o.valueInfo.push(s.onnx.ValueInfoProto.decode(e,e.uint32()));break;case 14:o.quantizationAnnotation&&o.quantizationAnnotation.length||(o.quantizationAnnotation=[]),o.quantizationAnnotation.push(s.onnx.TensorAnnotation.decode(e,e.uint32()));break;default:e.skipType(7&a)}}return o},e.decodeDelimited=function(e){return e instanceof n||(e=new n(e)),this.decode(e,e.uint32())},e.verify=function(e){if("object"!=typeof e||null===e)return"object expected";if(null!=e.node&&e.hasOwnProperty("node")){if(!Array.isArray(e.node))return"node: array expected";for(var t=0;t<e.node.length;++t){var i=s.onnx.NodeProto.verify(e.node[t]);if(i)return"node."+i}}if(null!=e.name&&e.hasOwnProperty("name")&&!a.isString(e.name))return"name: string expected";if(null!=e.initializer&&e.hasOwnProperty("initializer")){if(!Array.isArray(e.initializer))return"initializer: array expected";for(var t=0;t<e.initializer.length;++t){var i=s.onnx.TensorProto.verify(e.initializer[t]);if(i)return"initializer."+i}}if(null!=e.sparseInitializer&&e.hasOwnProperty("sparseInitializer")){if(!Array.isArray(e.sparseInitializer))return"sparseInitializer: array expected";for(var t=0;t<e.sparseInitializer.length;++t){var i=s.onnx.SparseTensorProto.verify(e.sparseInitializer[t]);if(i)return"sparseInitializer."+i}}if(null!=e.docString&&e.hasOwnProperty("docString")&&!a.isString(e.docString))return"docString: string expected";if(null!=e.input&&e.hasOwnProperty("input")){if(!Array.isArray(e.input))return"input: array expected";for(var t=0;t<e.input.length;++t){var i=s.onnx.ValueInfoProto.verify(e.input[t]);if(i)return"input."+i}}if(null!=e.output&&e.hasOwnProperty("output")){if(!Array.isArray(e.output))return"output: array expected";for(var t=0;t<e.output.length;++t){var i=s.onnx.ValueInfoProto.verify(e.output[t]);if(i)return"output."+i}}if(null!=e.valueInfo&&e.hasOwnProperty("valueInfo")){if(!Array.isArray(e.valueInfo))return"valueInfo: array expected";for(var t=0;t<e.valueInfo.length;++t){var i=s.onnx.ValueInfoProto.verify(e.valueInfo[t]);if(i)return"valueInfo."+i}}if(null!=e.quantizationAnnotation&&e.hasOwnProperty("quantizationAnnotation")){if(!Array.isArray(e.quantizationAnnotation))return"quantizationAnnotation: array expected";for(var t=0;t<e.quantizationAnnotation.length;++t){var i=s.onnx.TensorAnnotation.verify(e.quantizationAnnotation[t]);if(i)return"quantizationAnnotation."+i}}return null},e.fromObject=function(e){if(e instanceof s.onnx.GraphProto)return e;var t=new s.onnx.GraphProto;if(e.node){if(!Array.isArray(e.node))throw TypeError(".onnx.GraphProto.node: array expected");t.node=[];for(var i=0;i<e.node.length;++i){if("object"!=typeof e.node[i])throw TypeError(".onnx.GraphProto.node: object expected");t.node[i]=s.onnx.NodeProto.fromObject(e.node[i])}}if(null!=e.name&&(t.name=String(e.name)),e.initializer){if(!Array.isArray(e.initializer))throw TypeError(".onnx.GraphProto.initializer: array expected");t.initializer=[];for(var i=0;i<e.initializer.length;++i){if("object"!=typeof e.initializer[i])throw TypeError(".onnx.GraphProto.initializer: object expected");t.initializer[i]=s.onnx.TensorProto.fromObject(e.initializer[i])}}if(e.sparseInitializer){if(!Array.isArray(e.sparseInitializer))throw TypeError(".onnx.GraphProto.sparseInitializer: array expected");t.sparseInitializer=[];for(var i=0;i<e.sparseInitializer.length;++i){if("object"!=typeof e.sparseInitializer[i])throw TypeError(".onnx.GraphProto.sparseInitializer: object expected");t.sparseInitializer[i]=s.onnx.SparseTensorProto.fromObject(e.sparseInitializer[i])}}if(null!=e.docString&&(t.docString=String(e.docString)),e.input){if(!Array.isArray(e.input))throw TypeError(".onnx.GraphProto.input: array expected");t.input=[];for(var i=0;i<e.input.length;++i){if("object"!=typeof e.input[i])throw TypeError(".onnx.GraphProto.input: object expected");t.input[i]=s.onnx.ValueInfoProto.fromObject(e.input[i])}}if(e.output){if(!Array.isArray(e.output))throw TypeError(".onnx.GraphProto.output: array expected");t.output=[];for(var i=0;i<e.output.length;++i){if("object"!=typeof e.output[i])throw TypeError(".onnx.GraphProto.output: object expected");t.output[i]=s.onnx.ValueInfoProto.fromObject(e.output[i])}}if(e.valueInfo){if(!Array.isArray(e.valueInfo))throw TypeError(".onnx.GraphProto.valueInfo: array expected");t.valueInfo=[];for(var i=0;i<e.valueInfo.length;++i){if("object"!=typeof e.valueInfo[i])throw TypeError(".onnx.GraphProto.valueInfo: object expected");t.valueInfo[i]=s.onnx.ValueInfoProto.fromObject(e.valueInfo[i])}}if(e.quantizationAnnotation){if(!Array.isArray(e.quantizationAnnotation))throw TypeError(".onnx.GraphProto.quantizationAnnotation: array expected");t.quantizationAnnotation=[];for(var i=0;i<e.quantizationAnnotation.length;++i){if("object"!=typeof e.quantizationAnnotation[i])throw TypeError(".onnx.GraphProto.quantizationAnnotation: object expected");t.quantizationAnnotation[i]=s.onnx.TensorAnnotation.fromObject(e.quantizationAnnotation[i])}}return t},e.toObject=function(e,t){t||(t={});var i={};if((t.arrays||t.defaults)&&(i.node=[],i.initializer=[],i.input=[],i.output=[],i.valueInfo=[],i.quantizationAnnotation=[],i.sparseInitializer=[]),t.defaults&&(i.name="",i.docString=""),e.node&&e.node.length){i.node=[];for(var n=0;n<e.node.length;++n)i.node[n]=s.onnx.NodeProto.toObject(e.node[n],t)}if(null!=e.name&&e.hasOwnProperty("name")&&(i.name=e.name),e.initializer&&e.initializer.length){i.initializer=[];for(var n=0;n<e.initializer.length;++n)i.initializer[n]=s.onnx.TensorProto.toObject(e.initializer[n],t)}if(null!=e.docString&&e.hasOwnProperty("docString")&&(i.docString=e.docString),e.input&&e.input.length){i.input=[];for(var n=0;n<e.input.length;++n)i.input[n]=s.onnx.ValueInfoProto.toObject(e.input[n],t)}if(e.output&&e.output.length){i.output=[];for(var n=0;n<e.output.length;++n)i.output[n]=s.onnx.ValueInfoProto.toObject(e.output[n],t)}if(e.valueInfo&&e.valueInfo.length){i.valueInfo=[];for(var n=0;n<e.valueInfo.length;++n)i.valueInfo[n]=s.onnx.ValueInfoProto.toObject(e.valueInfo[n],t)}if(e.quantizationAnnotation&&e.quantizationAnnotation.length){i.quantizationAnnotation=[];for(var n=0;n<e.quantizationAnnotation.length;++n)i.quantizationAnnotation[n]=s.onnx.TensorAnnotation.toObject(e.quantizationAnnotation[n],t)}if(e.sparseInitializer&&e.sparseInitializer.length){i.sparseInitializer=[];for(var n=0;n<e.sparseInitializer.length;++n)i.sparseInitializer[n]=s.onnx.SparseTensorProto.toObject(e.sparseInitializer[n],t)}return i},e.prototype.toJSON=function(){return this.constructor.toObject(this,i.util.toJSONOptions)},e.getTypeUrl=function(e){return void 0===e&&(e="type.googleapis.com"),e+"/onnx.GraphProto"},e}(),e.TensorProto=function(){function e(e){if(this.dims=[],this.floatData=[],this.int32Data=[],this.stringData=[],this.int64Data=[],this.externalData=[],this.doubleData=[],this.uint64Data=[],e)for(var t=Object.keys(e),i=0;i<t.length;++i)null!=e[t[i]]&&(this[t[i]]=e[t[i]])}return e.prototype.dims=a.emptyArray,e.prototype.dataType=0,e.prototype.segment=null,e.prototype.floatData=a.emptyArray,e.prototype.int32Data=a.emptyArray,e.prototype.stringData=a.emptyArray,e.prototype.int64Data=a.emptyArray,e.prototype.name="",e.prototype.docString="",e.prototype.rawData=a.newBuffer([]),e.prototype.externalData=a.emptyArray,e.prototype.dataLocation=0,e.prototype.doubleData=a.emptyArray,e.prototype.uint64Data=a.emptyArray,e.create=function(t){return new e(t)},e.encode=function(e,t){if(t||(t=o.create()),null!=e.dims&&e.dims.length){t.uint32(10).fork();for(var i=0;i<e.dims.length;++i)t.int64(e.dims[i]);t.ldelim()}if(null!=e.dataType&&Object.hasOwnProperty.call(e,"dataType")&&t.uint32(16).int32(e.dataType),null!=e.segment&&Object.hasOwnProperty.call(e,"segment")&&s.onnx.TensorProto.Segment.encode(e.segment,t.uint32(26).fork()).ldelim(),null!=e.floatData&&e.floatData.length){t.uint32(34).fork();for(var i=0;i<e.floatData.length;++i)t.float(e.floatData[i]);t.ldelim()}if(null!=e.int32Data&&e.int32Data.length){t.uint32(42).fork();for(var i=0;i<e.int32Data.length;++i)t.int32(e.int32Data[i]);t.ldelim()}if(null!=e.stringData&&e.stringData.length)for(var i=0;i<e.stringData.length;++i)t.uint32(50).bytes(e.stringData[i]);if(null!=e.int64Data&&e.int64Data.length){t.uint32(58).fork();for(var i=0;i<e.int64Data.length;++i)t.int64(e.int64Data[i]);t.ldelim()}if(null!=e.name&&Object.hasOwnProperty.call(e,"name")&&t.uint32(66).string(e.name),null!=e.rawData&&Object.hasOwnProperty.call(e,"rawData")&&t.uint32(74).bytes(e.rawData),null!=e.doubleData&&e.doubleData.length){t.uint32(82).fork();for(var i=0;i<e.doubleData.length;++i)t.double(e.doubleData[i]);t.ldelim()}if(null!=e.uint64Data&&e.uint64Data.length){t.uint32(90).fork();for(var i=0;i<e.uint64Data.length;++i)t.uint64(e.uint64Data[i]);t.ldelim()}if(null!=e.docString&&Object.hasOwnProperty.call(e,"docString")&&t.uint32(98).string(e.docString),null!=e.externalData&&e.externalData.length)for(var i=0;i<e.externalData.length;++i)s.onnx.StringStringEntryProto.encode(e.externalData[i],t.uint32(106).fork()).ldelim();return null!=e.dataLocation&&Object.hasOwnProperty.call(e,"dataLocation")&&t.uint32(112).int32(e.dataLocation),t},e.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},e.decode=function(e,t){e instanceof n||(e=n.create(e));for(var i=void 0===t?e.len:e.pos+t,o=new s.onnx.TensorProto;e.pos<i;){var a=e.uint32();switch(a>>>3){case 1:if(o.dims&&o.dims.length||(o.dims=[]),(7&a)==2)for(var u=e.uint32()+e.pos;e.pos<u;)o.dims.push(e.int64());else o.dims.push(e.int64());break;case 2:o.dataType=e.int32();break;case 3:o.segment=s.onnx.TensorProto.Segment.decode(e,e.uint32());break;case 4:if(o.floatData&&o.floatData.length||(o.floatData=[]),(7&a)==2)for(var u=e.uint32()+e.pos;e.pos<u;)o.floatData.push(e.float());else o.floatData.push(e.float());break;case 5:if(o.int32Data&&o.int32Data.length||(o.int32Data=[]),(7&a)==2)for(var u=e.uint32()+e.pos;e.pos<u;)o.int32Data.push(e.int32());else o.int32Data.push(e.int32());break;case 6:o.stringData&&o.stringData.length||(o.stringData=[]),o.stringData.push(e.bytes());break;case 7:if(o.int64Data&&o.int64Data.length||(o.int64Data=[]),(7&a)==2)for(var u=e.uint32()+e.pos;e.pos<u;)o.int64Data.push(e.int64());else o.int64Data.push(e.int64());break;case 8:o.name=e.string();break;case 12:o.docString=e.string();break;case 9:o.rawData=e.bytes();break;case 13:o.externalData&&o.externalData.length||(o.externalData=[]),o.externalData.push(s.onnx.StringStringEntryProto.decode(e,e.uint32()));break;case 14:o.dataLocation=e.int32();break;case 10:if(o.doubleData&&o.doubleData.length||(o.doubleData=[]),(7&a)==2)for(var u=e.uint32()+e.pos;e.pos<u;)o.doubleData.push(e.double());else o.doubleData.push(e.double());break;case 11:if(o.uint64Data&&o.uint64Data.length||(o.uint64Data=[]),(7&a)==2)for(var u=e.uint32()+e.pos;e.pos<u;)o.uint64Data.push(e.uint64());else o.uint64Data.push(e.uint64());break;default:e.skipType(7&a)}}return o},e.decodeDelimited=function(e){return e instanceof n||(e=new n(e)),this.decode(e,e.uint32())},e.verify=function(e){if("object"!=typeof e||null===e)return"object expected";if(null!=e.dims&&e.hasOwnProperty("dims")){if(!Array.isArray(e.dims))return"dims: array expected";for(var t=0;t<e.dims.length;++t)if(!a.isInteger(e.dims[t])&&!(e.dims[t]&&a.isInteger(e.dims[t].low)&&a.isInteger(e.dims[t].high)))return"dims: integer|Long[] expected"}if(null!=e.dataType&&e.hasOwnProperty("dataType")&&!a.isInteger(e.dataType))return"dataType: integer expected";if(null!=e.segment&&e.hasOwnProperty("segment")){var i=s.onnx.TensorProto.Segment.verify(e.segment);if(i)return"segment."+i}if(null!=e.floatData&&e.hasOwnProperty("floatData")){if(!Array.isArray(e.floatData))return"floatData: array expected";for(var t=0;t<e.floatData.length;++t)if("number"!=typeof e.floatData[t])return"floatData: number[] expected"}if(null!=e.int32Data&&e.hasOwnProperty("int32Data")){if(!Array.isArray(e.int32Data))return"int32Data: array expected";for(var t=0;t<e.int32Data.length;++t)if(!a.isInteger(e.int32Data[t]))return"int32Data: integer[] expected"}if(null!=e.stringData&&e.hasOwnProperty("stringData")){if(!Array.isArray(e.stringData))return"stringData: array expected";for(var t=0;t<e.stringData.length;++t)if(!(e.stringData[t]&&"number"==typeof e.stringData[t].length||a.isString(e.stringData[t])))return"stringData: buffer[] expected"}if(null!=e.int64Data&&e.hasOwnProperty("int64Data")){if(!Array.isArray(e.int64Data))return"int64Data: array expected";for(var t=0;t<e.int64Data.length;++t)if(!a.isInteger(e.int64Data[t])&&!(e.int64Data[t]&&a.isInteger(e.int64Data[t].low)&&a.isInteger(e.int64Data[t].high)))return"int64Data: integer|Long[] expected"}if(null!=e.name&&e.hasOwnProperty("name")&&!a.isString(e.name))return"name: string expected";if(null!=e.docString&&e.hasOwnProperty("docString")&&!a.isString(e.docString))return"docString: string expected";if(null!=e.rawData&&e.hasOwnProperty("rawData")&&!(e.rawData&&"number"==typeof e.rawData.length||a.isString(e.rawData)))return"rawData: buffer expected";if(null!=e.externalData&&e.hasOwnProperty("externalData")){if(!Array.isArray(e.externalData))return"externalData: array expected";for(var t=0;t<e.externalData.length;++t){var i=s.onnx.StringStringEntryProto.verify(e.externalData[t]);if(i)return"externalData."+i}}if(null!=e.dataLocation&&e.hasOwnProperty("dataLocation"))switch(e.dataLocation){default:return"dataLocation: enum value expected";case 0:case 1:}if(null!=e.doubleData&&e.hasOwnProperty("doubleData")){if(!Array.isArray(e.doubleData))return"doubleData: array expected";for(var t=0;t<e.doubleData.length;++t)if("number"!=typeof e.doubleData[t])return"doubleData: number[] expected"}if(null!=e.uint64Data&&e.hasOwnProperty("uint64Data")){if(!Array.isArray(e.uint64Data))return"uint64Data: array expected";for(var t=0;t<e.uint64Data.length;++t)if(!a.isInteger(e.uint64Data[t])&&!(e.uint64Data[t]&&a.isInteger(e.uint64Data[t].low)&&a.isInteger(e.uint64Data[t].high)))return"uint64Data: integer|Long[] expected"}return null},e.fromObject=function(e){if(e instanceof s.onnx.TensorProto)return e;var t=new s.onnx.TensorProto;if(e.dims){if(!Array.isArray(e.dims))throw TypeError(".onnx.TensorProto.dims: array expected");t.dims=[];for(var i=0;i<e.dims.length;++i)a.Long?(t.dims[i]=a.Long.fromValue(e.dims[i])).unsigned=!1:"string"==typeof e.dims[i]?t.dims[i]=parseInt(e.dims[i],10):"number"==typeof e.dims[i]?t.dims[i]=e.dims[i]:"object"==typeof e.dims[i]&&(t.dims[i]=new a.LongBits(e.dims[i].low>>>0,e.dims[i].high>>>0).toNumber())}if(null!=e.dataType&&(t.dataType=0|e.dataType),null!=e.segment){if("object"!=typeof e.segment)throw TypeError(".onnx.TensorProto.segment: object expected");t.segment=s.onnx.TensorProto.Segment.fromObject(e.segment)}if(e.floatData){if(!Array.isArray(e.floatData))throw TypeError(".onnx.TensorProto.floatData: array expected");t.floatData=[];for(var i=0;i<e.floatData.length;++i)t.floatData[i]=Number(e.floatData[i])}if(e.int32Data){if(!Array.isArray(e.int32Data))throw TypeError(".onnx.TensorProto.int32Data: array expected");t.int32Data=[];for(var i=0;i<e.int32Data.length;++i)t.int32Data[i]=0|e.int32Data[i]}if(e.stringData){if(!Array.isArray(e.stringData))throw TypeError(".onnx.TensorProto.stringData: array expected");t.stringData=[];for(var i=0;i<e.stringData.length;++i)"string"==typeof e.stringData[i]?a.base64.decode(e.stringData[i],t.stringData[i]=a.newBuffer(a.base64.length(e.stringData[i])),0):e.stringData[i].length>=0&&(t.stringData[i]=e.stringData[i])}if(e.int64Data){if(!Array.isArray(e.int64Data))throw TypeError(".onnx.TensorProto.int64Data: array expected");t.int64Data=[];for(var i=0;i<e.int64Data.length;++i)a.Long?(t.int64Data[i]=a.Long.fromValue(e.int64Data[i])).unsigned=!1:"string"==typeof e.int64Data[i]?t.int64Data[i]=parseInt(e.int64Data[i],10):"number"==typeof e.int64Data[i]?t.int64Data[i]=e.int64Data[i]:"object"==typeof e.int64Data[i]&&(t.int64Data[i]=new a.LongBits(e.int64Data[i].low>>>0,e.int64Data[i].high>>>0).toNumber())}if(null!=e.name&&(t.name=String(e.name)),null!=e.docString&&(t.docString=String(e.docString)),null!=e.rawData&&("string"==typeof e.rawData?a.base64.decode(e.rawData,t.rawData=a.newBuffer(a.base64.length(e.rawData)),0):e.rawData.length>=0&&(t.rawData=e.rawData)),e.externalData){if(!Array.isArray(e.externalData))throw TypeError(".onnx.TensorProto.externalData: array expected");t.externalData=[];for(var i=0;i<e.externalData.length;++i){if("object"!=typeof e.externalData[i])throw TypeError(".onnx.TensorProto.externalData: object expected");t.externalData[i]=s.onnx.StringStringEntryProto.fromObject(e.externalData[i])}}switch(e.dataLocation){default:"number"==typeof e.dataLocation&&(t.dataLocation=e.dataLocation);break;case"DEFAULT":case 0:t.dataLocation=0;break;case"EXTERNAL":case 1:t.dataLocation=1}if(e.doubleData){if(!Array.isArray(e.doubleData))throw TypeError(".onnx.TensorProto.doubleData: array expected");t.doubleData=[];for(var i=0;i<e.doubleData.length;++i)t.doubleData[i]=Number(e.doubleData[i])}if(e.uint64Data){if(!Array.isArray(e.uint64Data))throw TypeError(".onnx.TensorProto.uint64Data: array expected");t.uint64Data=[];for(var i=0;i<e.uint64Data.length;++i)a.Long?(t.uint64Data[i]=a.Long.fromValue(e.uint64Data[i])).unsigned=!0:"string"==typeof e.uint64Data[i]?t.uint64Data[i]=parseInt(e.uint64Data[i],10):"number"==typeof e.uint64Data[i]?t.uint64Data[i]=e.uint64Data[i]:"object"==typeof e.uint64Data[i]&&(t.uint64Data[i]=new a.LongBits(e.uint64Data[i].low>>>0,e.uint64Data[i].high>>>0).toNumber(!0))}return t},e.toObject=function(e,t){t||(t={});var i={};if((t.arrays||t.defaults)&&(i.dims=[],i.floatData=[],i.int32Data=[],i.stringData=[],i.int64Data=[],i.doubleData=[],i.uint64Data=[],i.externalData=[]),t.defaults&&(i.dataType=0,i.segment=null,i.name="",t.bytes===String?i.rawData="":(i.rawData=[],t.bytes!==Array&&(i.rawData=a.newBuffer(i.rawData))),i.docString="",i.dataLocation=t.enums===String?"DEFAULT":0),e.dims&&e.dims.length){i.dims=[];for(var n=0;n<e.dims.length;++n)"number"==typeof e.dims[n]?i.dims[n]=t.longs===String?String(e.dims[n]):e.dims[n]:i.dims[n]=t.longs===String?a.Long.prototype.toString.call(e.dims[n]):t.longs===Number?new a.LongBits(e.dims[n].low>>>0,e.dims[n].high>>>0).toNumber():e.dims[n]}if(null!=e.dataType&&e.hasOwnProperty("dataType")&&(i.dataType=e.dataType),null!=e.segment&&e.hasOwnProperty("segment")&&(i.segment=s.onnx.TensorProto.Segment.toObject(e.segment,t)),e.floatData&&e.floatData.length){i.floatData=[];for(var n=0;n<e.floatData.length;++n)i.floatData[n]=t.json&&!isFinite(e.floatData[n])?String(e.floatData[n]):e.floatData[n]}if(e.int32Data&&e.int32Data.length){i.int32Data=[];for(var n=0;n<e.int32Data.length;++n)i.int32Data[n]=e.int32Data[n]}if(e.stringData&&e.stringData.length){i.stringData=[];for(var n=0;n<e.stringData.length;++n)i.stringData[n]=t.bytes===String?a.base64.encode(e.stringData[n],0,e.stringData[n].length):t.bytes===Array?Array.prototype.slice.call(e.stringData[n]):e.stringData[n]}if(e.int64Data&&e.int64Data.length){i.int64Data=[];for(var n=0;n<e.int64Data.length;++n)"number"==typeof e.int64Data[n]?i.int64Data[n]=t.longs===String?String(e.int64Data[n]):e.int64Data[n]:i.int64Data[n]=t.longs===String?a.Long.prototype.toString.call(e.int64Data[n]):t.longs===Number?new a.LongBits(e.int64Data[n].low>>>0,e.int64Data[n].high>>>0).toNumber():e.int64Data[n]}if(null!=e.name&&e.hasOwnProperty("name")&&(i.name=e.name),null!=e.rawData&&e.hasOwnProperty("rawData")&&(i.rawData=t.bytes===String?a.base64.encode(e.rawData,0,e.rawData.length):t.bytes===Array?Array.prototype.slice.call(e.rawData):e.rawData),e.doubleData&&e.doubleData.length){i.doubleData=[];for(var n=0;n<e.doubleData.length;++n)i.doubleData[n]=t.json&&!isFinite(e.doubleData[n])?String(e.doubleData[n]):e.doubleData[n]}if(e.uint64Data&&e.uint64Data.length){i.uint64Data=[];for(var n=0;n<e.uint64Data.length;++n)"number"==typeof e.uint64Data[n]?i.uint64Data[n]=t.longs===String?String(e.uint64Data[n]):e.uint64Data[n]:i.uint64Data[n]=t.longs===String?a.Long.prototype.toString.call(e.uint64Data[n]):t.longs===Number?new a.LongBits(e.uint64Data[n].low>>>0,e.uint64Data[n].high>>>0).toNumber(!0):e.uint64Data[n]}if(null!=e.docString&&e.hasOwnProperty("docString")&&(i.docString=e.docString),e.externalData&&e.externalData.length){i.externalData=[];for(var n=0;n<e.externalData.length;++n)i.externalData[n]=s.onnx.StringStringEntryProto.toObject(e.externalData[n],t)}return null!=e.dataLocation&&e.hasOwnProperty("dataLocation")&&(i.dataLocation=t.enums===String?void 0===s.onnx.TensorProto.DataLocation[e.dataLocation]?e.dataLocation:s.onnx.TensorProto.DataLocation[e.dataLocation]:e.dataLocation),i},e.prototype.toJSON=function(){return this.constructor.toObject(this,i.util.toJSONOptions)},e.getTypeUrl=function(e){return void 0===e&&(e="type.googleapis.com"),e+"/onnx.TensorProto"},e.DataType=function(){var e={},t=Object.create(e);return t[e[0]="UNDEFINED"]=0,t[e[1]="FLOAT"]=1,t[e[2]="UINT8"]=2,t[e[3]="INT8"]=3,t[e[4]="UINT16"]=4,t[e[5]="INT16"]=5,t[e[6]="INT32"]=6,t[e[7]="INT64"]=7,t[e[8]="STRING"]=8,t[e[9]="BOOL"]=9,t[e[10]="FLOAT16"]=10,t[e[11]="DOUBLE"]=11,t[e[12]="UINT32"]=12,t[e[13]="UINT64"]=13,t[e[14]="COMPLEX64"]=14,t[e[15]="COMPLEX128"]=15,t[e[16]="BFLOAT16"]=16,t[e[17]="FLOAT8E4M3FN"]=17,t[e[18]="FLOAT8E4M3FNUZ"]=18,t[e[19]="FLOAT8E5M2"]=19,t[e[20]="FLOAT8E5M2FNUZ"]=20,t}(),e.Segment=function(){function e(e){if(e)for(var t=Object.keys(e),i=0;i<t.length;++i)null!=e[t[i]]&&(this[t[i]]=e[t[i]])}return e.prototype.begin=a.Long?a.Long.fromBits(0,0,!1):0,e.prototype.end=a.Long?a.Long.fromBits(0,0,!1):0,e.create=function(t){return new e(t)},e.encode=function(e,t){return t||(t=o.create()),null!=e.begin&&Object.hasOwnProperty.call(e,"begin")&&t.uint32(8).int64(e.begin),null!=e.end&&Object.hasOwnProperty.call(e,"end")&&t.uint32(16).int64(e.end),t},e.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},e.decode=function(e,t){e instanceof n||(e=n.create(e));for(var i=void 0===t?e.len:e.pos+t,o=new s.onnx.TensorProto.Segment;e.pos<i;){var a=e.uint32();switch(a>>>3){case 1:o.begin=e.int64();break;case 2:o.end=e.int64();break;default:e.skipType(7&a)}}return o},e.decodeDelimited=function(e){return e instanceof n||(e=new n(e)),this.decode(e,e.uint32())},e.verify=function(e){return"object"!=typeof e||null===e?"object expected":null!=e.begin&&e.hasOwnProperty("begin")&&!a.isInteger(e.begin)&&!(e.begin&&a.isInteger(e.begin.low)&&a.isInteger(e.begin.high))?"begin: integer|Long expected":null!=e.end&&e.hasOwnProperty("end")&&!a.isInteger(e.end)&&!(e.end&&a.isInteger(e.end.low)&&a.isInteger(e.end.high))?"end: integer|Long expected":null},e.fromObject=function(e){if(e instanceof s.onnx.TensorProto.Segment)return e;var t=new s.onnx.TensorProto.Segment;return null!=e.begin&&(a.Long?(t.begin=a.Long.fromValue(e.begin)).unsigned=!1:"string"==typeof e.begin?t.begin=parseInt(e.begin,10):"number"==typeof e.begin?t.begin=e.begin:"object"==typeof e.begin&&(t.begin=new a.LongBits(e.begin.low>>>0,e.begin.high>>>0).toNumber())),null!=e.end&&(a.Long?(t.end=a.Long.fromValue(e.end)).unsigned=!1:"string"==typeof e.end?t.end=parseInt(e.end,10):"number"==typeof e.end?t.end=e.end:"object"==typeof e.end&&(t.end=new a.LongBits(e.end.low>>>0,e.end.high>>>0).toNumber())),t},e.toObject=function(e,t){t||(t={});var i={};if(t.defaults){if(a.Long){var n=new a.Long(0,0,!1);i.begin=t.longs===String?n.toString():t.longs===Number?n.toNumber():n}else i.begin=t.longs===String?"0":0;if(a.Long){var n=new a.Long(0,0,!1);i.end=t.longs===String?n.toString():t.longs===Number?n.toNumber():n}else i.end=t.longs===String?"0":0}return null!=e.begin&&e.hasOwnProperty("begin")&&("number"==typeof e.begin?i.begin=t.longs===String?String(e.begin):e.begin:i.begin=t.longs===String?a.Long.prototype.toString.call(e.begin):t.longs===Number?new a.LongBits(e.begin.low>>>0,e.begin.high>>>0).toNumber():e.begin),null!=e.end&&e.hasOwnProperty("end")&&("number"==typeof e.end?i.end=t.longs===String?String(e.end):e.end:i.end=t.longs===String?a.Long.prototype.toString.call(e.end):t.longs===Number?new a.LongBits(e.end.low>>>0,e.end.high>>>0).toNumber():e.end),i},e.prototype.toJSON=function(){return this.constructor.toObject(this,i.util.toJSONOptions)},e.getTypeUrl=function(e){return void 0===e&&(e="type.googleapis.com"),e+"/onnx.TensorProto.Segment"},e}(),e.DataLocation=function(){var e={},t=Object.create(e);return t[e[0]="DEFAULT"]=0,t[e[1]="EXTERNAL"]=1,t}(),e}(),e.SparseTensorProto=function(){function e(e){if(this.dims=[],e)for(var t=Object.keys(e),i=0;i<t.length;++i)null!=e[t[i]]&&(this[t[i]]=e[t[i]])}return e.prototype.values=null,e.prototype.indices=null,e.prototype.dims=a.emptyArray,e.create=function(t){return new e(t)},e.encode=function(e,t){if(t||(t=o.create()),null!=e.values&&Object.hasOwnProperty.call(e,"values")&&s.onnx.TensorProto.encode(e.values,t.uint32(10).fork()).ldelim(),null!=e.indices&&Object.hasOwnProperty.call(e,"indices")&&s.onnx.TensorProto.encode(e.indices,t.uint32(18).fork()).ldelim(),null!=e.dims&&e.dims.length){t.uint32(26).fork();for(var i=0;i<e.dims.length;++i)t.int64(e.dims[i]);t.ldelim()}return t},e.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},e.decode=function(e,t){e instanceof n||(e=n.create(e));for(var i=void 0===t?e.len:e.pos+t,o=new s.onnx.SparseTensorProto;e.pos<i;){var a=e.uint32();switch(a>>>3){case 1:o.values=s.onnx.TensorProto.decode(e,e.uint32());break;case 2:o.indices=s.onnx.TensorProto.decode(e,e.uint32());break;case 3:if(o.dims&&o.dims.length||(o.dims=[]),(7&a)==2)for(var u=e.uint32()+e.pos;e.pos<u;)o.dims.push(e.int64());else o.dims.push(e.int64());break;default:e.skipType(7&a)}}return o},e.decodeDelimited=function(e){return e instanceof n||(e=new n(e)),this.decode(e,e.uint32())},e.verify=function(e){if("object"!=typeof e||null===e)return"object expected";if(null!=e.values&&e.hasOwnProperty("values")){var t=s.onnx.TensorProto.verify(e.values);if(t)return"values."+t}if(null!=e.indices&&e.hasOwnProperty("indices")){var t=s.onnx.TensorProto.verify(e.indices);if(t)return"indices."+t}if(null!=e.dims&&e.hasOwnProperty("dims")){if(!Array.isArray(e.dims))return"dims: array expected";for(var i=0;i<e.dims.length;++i)if(!a.isInteger(e.dims[i])&&!(e.dims[i]&&a.isInteger(e.dims[i].low)&&a.isInteger(e.dims[i].high)))return"dims: integer|Long[] expected"}return null},e.fromObject=function(e){if(e instanceof s.onnx.SparseTensorProto)return e;var t=new s.onnx.SparseTensorProto;if(null!=e.values){if("object"!=typeof e.values)throw TypeError(".onnx.SparseTensorProto.values: object expected");t.values=s.onnx.TensorProto.fromObject(e.values)}if(null!=e.indices){if("object"!=typeof e.indices)throw TypeError(".onnx.SparseTensorProto.indices: object expected");t.indices=s.onnx.TensorProto.fromObject(e.indices)}if(e.dims){if(!Array.isArray(e.dims))throw TypeError(".onnx.SparseTensorProto.dims: array expected");t.dims=[];for(var i=0;i<e.dims.length;++i)a.Long?(t.dims[i]=a.Long.fromValue(e.dims[i])).unsigned=!1:"string"==typeof e.dims[i]?t.dims[i]=parseInt(e.dims[i],10):"number"==typeof e.dims[i]?t.dims[i]=e.dims[i]:"object"==typeof e.dims[i]&&(t.dims[i]=new a.LongBits(e.dims[i].low>>>0,e.dims[i].high>>>0).toNumber())}return t},e.toObject=function(e,t){t||(t={});var i={};if((t.arrays||t.defaults)&&(i.dims=[]),t.defaults&&(i.values=null,i.indices=null),null!=e.values&&e.hasOwnProperty("values")&&(i.values=s.onnx.TensorProto.toObject(e.values,t)),null!=e.indices&&e.hasOwnProperty("indices")&&(i.indices=s.onnx.TensorProto.toObject(e.indices,t)),e.dims&&e.dims.length){i.dims=[];for(var n=0;n<e.dims.length;++n)"number"==typeof e.dims[n]?i.dims[n]=t.longs===String?String(e.dims[n]):e.dims[n]:i.dims[n]=t.longs===String?a.Long.prototype.toString.call(e.dims[n]):t.longs===Number?new a.LongBits(e.dims[n].low>>>0,e.dims[n].high>>>0).toNumber():e.dims[n]}return i},e.prototype.toJSON=function(){return this.constructor.toObject(this,i.util.toJSONOptions)},e.getTypeUrl=function(e){return void 0===e&&(e="type.googleapis.com"),e+"/onnx.SparseTensorProto"},e}(),e.TensorShapeProto=function(){function e(e){if(this.dim=[],e)for(var t=Object.keys(e),i=0;i<t.length;++i)null!=e[t[i]]&&(this[t[i]]=e[t[i]])}return e.prototype.dim=a.emptyArray,e.create=function(t){return new e(t)},e.encode=function(e,t){if(t||(t=o.create()),null!=e.dim&&e.dim.length)for(var i=0;i<e.dim.length;++i)s.onnx.TensorShapeProto.Dimension.encode(e.dim[i],t.uint32(10).fork()).ldelim();return t},e.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},e.decode=function(e,t){e instanceof n||(e=n.create(e));for(var i=void 0===t?e.len:e.pos+t,o=new s.onnx.TensorShapeProto;e.pos<i;){var a=e.uint32();a>>>3==1?(o.dim&&o.dim.length||(o.dim=[]),o.dim.push(s.onnx.TensorShapeProto.Dimension.decode(e,e.uint32()))):e.skipType(7&a)}return o},e.decodeDelimited=function(e){return e instanceof n||(e=new n(e)),this.decode(e,e.uint32())},e.verify=function(e){if("object"!=typeof e||null===e)return"object expected";if(null!=e.dim&&e.hasOwnProperty("dim")){if(!Array.isArray(e.dim))return"dim: array expected";for(var t=0;t<e.dim.length;++t){var i=s.onnx.TensorShapeProto.Dimension.verify(e.dim[t]);if(i)return"dim."+i}}return null},e.fromObject=function(e){if(e instanceof s.onnx.TensorShapeProto)return e;var t=new s.onnx.TensorShapeProto;if(e.dim){if(!Array.isArray(e.dim))throw TypeError(".onnx.TensorShapeProto.dim: array expected");t.dim=[];for(var i=0;i<e.dim.length;++i){if("object"!=typeof e.dim[i])throw TypeError(".onnx.TensorShapeProto.dim: object expected");t.dim[i]=s.onnx.TensorShapeProto.Dimension.fromObject(e.dim[i])}}return t},e.toObject=function(e,t){t||(t={});var i={};if((t.arrays||t.defaults)&&(i.dim=[]),e.dim&&e.dim.length){i.dim=[];for(var n=0;n<e.dim.length;++n)i.dim[n]=s.onnx.TensorShapeProto.Dimension.toObject(e.dim[n],t)}return i},e.prototype.toJSON=function(){return this.constructor.toObject(this,i.util.toJSONOptions)},e.getTypeUrl=function(e){return void 0===e&&(e="type.googleapis.com"),e+"/onnx.TensorShapeProto"},e.Dimension=function(){var e;function t(e){if(e)for(var t=Object.keys(e),i=0;i<t.length;++i)null!=e[t[i]]&&(this[t[i]]=e[t[i]])}return t.prototype.dimValue=null,t.prototype.dimParam=null,t.prototype.denotation="",Object.defineProperty(t.prototype,"value",{get:a.oneOfGetter(e=["dimValue","dimParam"]),set:a.oneOfSetter(e)}),t.create=function(e){return new t(e)},t.encode=function(e,t){return t||(t=o.create()),null!=e.dimValue&&Object.hasOwnProperty.call(e,"dimValue")&&t.uint32(8).int64(e.dimValue),null!=e.dimParam&&Object.hasOwnProperty.call(e,"dimParam")&&t.uint32(18).string(e.dimParam),null!=e.denotation&&Object.hasOwnProperty.call(e,"denotation")&&t.uint32(26).string(e.denotation),t},t.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},t.decode=function(e,t){e instanceof n||(e=n.create(e));for(var i=void 0===t?e.len:e.pos+t,o=new s.onnx.TensorShapeProto.Dimension;e.pos<i;){var a=e.uint32();switch(a>>>3){case 1:o.dimValue=e.int64();break;case 2:o.dimParam=e.string();break;case 3:o.denotation=e.string();break;default:e.skipType(7&a)}}return o},t.decodeDelimited=function(e){return e instanceof n||(e=new n(e)),this.decode(e,e.uint32())},t.verify=function(e){if("object"!=typeof e||null===e)return"object expected";var t={};if(null!=e.dimValue&&e.hasOwnProperty("dimValue")&&(t.value=1,!a.isInteger(e.dimValue)&&!(e.dimValue&&a.isInteger(e.dimValue.low)&&a.isInteger(e.dimValue.high))))return"dimValue: integer|Long expected";if(null!=e.dimParam&&e.hasOwnProperty("dimParam")){if(1===t.value)return"value: multiple values";if(t.value=1,!a.isString(e.dimParam))return"dimParam: string expected"}return null!=e.denotation&&e.hasOwnProperty("denotation")&&!a.isString(e.denotation)?"denotation: string expected":null},t.fromObject=function(e){if(e instanceof s.onnx.TensorShapeProto.Dimension)return e;var t=new s.onnx.TensorShapeProto.Dimension;return null!=e.dimValue&&(a.Long?(t.dimValue=a.Long.fromValue(e.dimValue)).unsigned=!1:"string"==typeof e.dimValue?t.dimValue=parseInt(e.dimValue,10):"number"==typeof e.dimValue?t.dimValue=e.dimValue:"object"==typeof e.dimValue&&(t.dimValue=new a.LongBits(e.dimValue.low>>>0,e.dimValue.high>>>0).toNumber())),null!=e.dimParam&&(t.dimParam=String(e.dimParam)),null!=e.denotation&&(t.denotation=String(e.denotation)),t},t.toObject=function(e,t){t||(t={});var i={};return t.defaults&&(i.denotation=""),null!=e.dimValue&&e.hasOwnProperty("dimValue")&&("number"==typeof e.dimValue?i.dimValue=t.longs===String?String(e.dimValue):e.dimValue:i.dimValue=t.longs===String?a.Long.prototype.toString.call(e.dimValue):t.longs===Number?new a.LongBits(e.dimValue.low>>>0,e.dimValue.high>>>0).toNumber():e.dimValue,t.oneofs&&(i.value="dimValue")),null!=e.dimParam&&e.hasOwnProperty("dimParam")&&(i.dimParam=e.dimParam,t.oneofs&&(i.value="dimParam")),null!=e.denotation&&e.hasOwnProperty("denotation")&&(i.denotation=e.denotation),i},t.prototype.toJSON=function(){return this.constructor.toObject(this,i.util.toJSONOptions)},t.getTypeUrl=function(e){return void 0===e&&(e="type.googleapis.com"),e+"/onnx.TensorShapeProto.Dimension"},t}(),e}(),e.TypeProto=function(){var e;function t(e){if(e)for(var t=Object.keys(e),i=0;i<t.length;++i)null!=e[t[i]]&&(this[t[i]]=e[t[i]])}return t.prototype.tensorType=null,t.prototype.sequenceType=null,t.prototype.mapType=null,t.prototype.optionalType=null,t.prototype.sparseTensorType=null,t.prototype.denotation="",Object.defineProperty(t.prototype,"value",{get:a.oneOfGetter(e=["tensorType","sequenceType","mapType","optionalType","sparseTensorType"]),set:a.oneOfSetter(e)}),t.create=function(e){return new t(e)},t.encode=function(e,t){return t||(t=o.create()),null!=e.tensorType&&Object.hasOwnProperty.call(e,"tensorType")&&s.onnx.TypeProto.Tensor.encode(e.tensorType,t.uint32(10).fork()).ldelim(),null!=e.sequenceType&&Object.hasOwnProperty.call(e,"sequenceType")&&s.onnx.TypeProto.Sequence.encode(e.sequenceType,t.uint32(34).fork()).ldelim(),null!=e.mapType&&Object.hasOwnProperty.call(e,"mapType")&&s.onnx.TypeProto.Map.encode(e.mapType,t.uint32(42).fork()).ldelim(),null!=e.denotation&&Object.hasOwnProperty.call(e,"denotation")&&t.uint32(50).string(e.denotation),null!=e.sparseTensorType&&Object.hasOwnProperty.call(e,"sparseTensorType")&&s.onnx.TypeProto.SparseTensor.encode(e.sparseTensorType,t.uint32(66).fork()).ldelim(),null!=e.optionalType&&Object.hasOwnProperty.call(e,"optionalType")&&s.onnx.TypeProto.Optional.encode(e.optionalType,t.uint32(74).fork()).ldelim(),t},t.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},t.decode=function(e,t){e instanceof n||(e=n.create(e));for(var i=void 0===t?e.len:e.pos+t,o=new s.onnx.TypeProto;e.pos<i;){var a=e.uint32();switch(a>>>3){case 1:o.tensorType=s.onnx.TypeProto.Tensor.decode(e,e.uint32());break;case 4:o.sequenceType=s.onnx.TypeProto.Sequence.decode(e,e.uint32());break;case 5:o.mapType=s.onnx.TypeProto.Map.decode(e,e.uint32());break;case 9:o.optionalType=s.onnx.TypeProto.Optional.decode(e,e.uint32());break;case 8:o.sparseTensorType=s.onnx.TypeProto.SparseTensor.decode(e,e.uint32());break;case 6:o.denotation=e.string();break;default:e.skipType(7&a)}}return o},t.decodeDelimited=function(e){return e instanceof n||(e=new n(e)),this.decode(e,e.uint32())},t.verify=function(e){if("object"!=typeof e||null===e)return"object expected";var t={};if(null!=e.tensorType&&e.hasOwnProperty("tensorType")){t.value=1;var i=s.onnx.TypeProto.Tensor.verify(e.tensorType);if(i)return"tensorType."+i}if(null!=e.sequenceType&&e.hasOwnProperty("sequenceType")){if(1===t.value)return"value: multiple values";t.value=1;var i=s.onnx.TypeProto.Sequence.verify(e.sequenceType);if(i)return"sequenceType."+i}if(null!=e.mapType&&e.hasOwnProperty("mapType")){if(1===t.value)return"value: multiple values";t.value=1;var i=s.onnx.TypeProto.Map.verify(e.mapType);if(i)return"mapType."+i}if(null!=e.optionalType&&e.hasOwnProperty("optionalType")){if(1===t.value)return"value: multiple values";t.value=1;var i=s.onnx.TypeProto.Optional.verify(e.optionalType);if(i)return"optionalType."+i}if(null!=e.sparseTensorType&&e.hasOwnProperty("sparseTensorType")){if(1===t.value)return"value: multiple values";t.value=1;var i=s.onnx.TypeProto.SparseTensor.verify(e.sparseTensorType);if(i)return"sparseTensorType."+i}return null!=e.denotation&&e.hasOwnProperty("denotation")&&!a.isString(e.denotation)?"denotation: string expected":null},t.fromObject=function(e){if(e instanceof s.onnx.TypeProto)return e;var t=new s.onnx.TypeProto;if(null!=e.tensorType){if("object"!=typeof e.tensorType)throw TypeError(".onnx.TypeProto.tensorType: object expected");t.tensorType=s.onnx.TypeProto.Tensor.fromObject(e.tensorType)}if(null!=e.sequenceType){if("object"!=typeof e.sequenceType)throw TypeError(".onnx.TypeProto.sequenceType: object expected");t.sequenceType=s.onnx.TypeProto.Sequence.fromObject(e.sequenceType)}if(null!=e.mapType){if("object"!=typeof e.mapType)throw TypeError(".onnx.TypeProto.mapType: object expected");t.mapType=s.onnx.TypeProto.Map.fromObject(e.mapType)}if(null!=e.optionalType){if("object"!=typeof e.optionalType)throw TypeError(".onnx.TypeProto.optionalType: object expected");t.optionalType=s.onnx.TypeProto.Optional.fromObject(e.optionalType)}if(null!=e.sparseTensorType){if("object"!=typeof e.sparseTensorType)throw TypeError(".onnx.TypeProto.sparseTensorType: object expected");t.sparseTensorType=s.onnx.TypeProto.SparseTensor.fromObject(e.sparseTensorType)}return null!=e.denotation&&(t.denotation=String(e.denotation)),t},t.toObject=function(e,t){t||(t={});var i={};return t.defaults&&(i.denotation=""),null!=e.tensorType&&e.hasOwnProperty("tensorType")&&(i.tensorType=s.onnx.TypeProto.Tensor.toObject(e.tensorType,t),t.oneofs&&(i.value="tensorType")),null!=e.sequenceType&&e.hasOwnProperty("sequenceType")&&(i.sequenceType=s.onnx.TypeProto.Sequence.toObject(e.sequenceType,t),t.oneofs&&(i.value="sequenceType")),null!=e.mapType&&e.hasOwnProperty("mapType")&&(i.mapType=s.onnx.TypeProto.Map.toObject(e.mapType,t),t.oneofs&&(i.value="mapType")),null!=e.denotation&&e.hasOwnProperty("denotation")&&(i.denotation=e.denotation),null!=e.sparseTensorType&&e.hasOwnProperty("sparseTensorType")&&(i.sparseTensorType=s.onnx.TypeProto.SparseTensor.toObject(e.sparseTensorType,t),t.oneofs&&(i.value="sparseTensorType")),null!=e.optionalType&&e.hasOwnProperty("optionalType")&&(i.optionalType=s.onnx.TypeProto.Optional.toObject(e.optionalType,t),t.oneofs&&(i.value="optionalType")),i},t.prototype.toJSON=function(){return this.constructor.toObject(this,i.util.toJSONOptions)},t.getTypeUrl=function(e){return void 0===e&&(e="type.googleapis.com"),e+"/onnx.TypeProto"},t.Tensor=function(){function e(e){if(e)for(var t=Object.keys(e),i=0;i<t.length;++i)null!=e[t[i]]&&(this[t[i]]=e[t[i]])}return e.prototype.elemType=0,e.prototype.shape=null,e.create=function(t){return new e(t)},e.encode=function(e,t){return t||(t=o.create()),null!=e.elemType&&Object.hasOwnProperty.call(e,"elemType")&&t.uint32(8).int32(e.elemType),null!=e.shape&&Object.hasOwnProperty.call(e,"shape")&&s.onnx.TensorShapeProto.encode(e.shape,t.uint32(18).fork()).ldelim(),t},e.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},e.decode=function(e,t){e instanceof n||(e=n.create(e));for(var i=void 0===t?e.len:e.pos+t,o=new s.onnx.TypeProto.Tensor;e.pos<i;){var a=e.uint32();switch(a>>>3){case 1:o.elemType=e.int32();break;case 2:o.shape=s.onnx.TensorShapeProto.decode(e,e.uint32());break;default:e.skipType(7&a)}}return o},e.decodeDelimited=function(e){return e instanceof n||(e=new n(e)),this.decode(e,e.uint32())},e.verify=function(e){if("object"!=typeof e||null===e)return"object expected";if(null!=e.elemType&&e.hasOwnProperty("elemType")&&!a.isInteger(e.elemType))return"elemType: integer expected";if(null!=e.shape&&e.hasOwnProperty("shape")){var t=s.onnx.TensorShapeProto.verify(e.shape);if(t)return"shape."+t}return null},e.fromObject=function(e){if(e instanceof s.onnx.TypeProto.Tensor)return e;var t=new s.onnx.TypeProto.Tensor;if(null!=e.elemType&&(t.elemType=0|e.elemType),null!=e.shape){if("object"!=typeof e.shape)throw TypeError(".onnx.TypeProto.Tensor.shape: object expected");t.shape=s.onnx.TensorShapeProto.fromObject(e.shape)}return t},e.toObject=function(e,t){t||(t={});var i={};return t.defaults&&(i.elemType=0,i.shape=null),null!=e.elemType&&e.hasOwnProperty("elemType")&&(i.elemType=e.elemType),null!=e.shape&&e.hasOwnProperty("shape")&&(i.shape=s.onnx.TensorShapeProto.toObject(e.shape,t)),i},e.prototype.toJSON=function(){return this.constructor.toObject(this,i.util.toJSONOptions)},e.getTypeUrl=function(e){return void 0===e&&(e="type.googleapis.com"),e+"/onnx.TypeProto.Tensor"},e}(),t.Sequence=function(){function e(e){if(e)for(var t=Object.keys(e),i=0;i<t.length;++i)null!=e[t[i]]&&(this[t[i]]=e[t[i]])}return e.prototype.elemType=null,e.create=function(t){return new e(t)},e.encode=function(e,t){return t||(t=o.create()),null!=e.elemType&&Object.hasOwnProperty.call(e,"elemType")&&s.onnx.TypeProto.encode(e.elemType,t.uint32(10).fork()).ldelim(),t},e.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},e.decode=function(e,t){e instanceof n||(e=n.create(e));for(var i=void 0===t?e.len:e.pos+t,o=new s.onnx.TypeProto.Sequence;e.pos<i;){var a=e.uint32();a>>>3==1?o.elemType=s.onnx.TypeProto.decode(e,e.uint32()):e.skipType(7&a)}return o},e.decodeDelimited=function(e){return e instanceof n||(e=new n(e)),this.decode(e,e.uint32())},e.verify=function(e){if("object"!=typeof e||null===e)return"object expected";if(null!=e.elemType&&e.hasOwnProperty("elemType")){var t=s.onnx.TypeProto.verify(e.elemType);if(t)return"elemType."+t}return null},e.fromObject=function(e){if(e instanceof s.onnx.TypeProto.Sequence)return e;var t=new s.onnx.TypeProto.Sequence;if(null!=e.elemType){if("object"!=typeof e.elemType)throw TypeError(".onnx.TypeProto.Sequence.elemType: object expected");t.elemType=s.onnx.TypeProto.fromObject(e.elemType)}return t},e.toObject=function(e,t){t||(t={});var i={};return t.defaults&&(i.elemType=null),null!=e.elemType&&e.hasOwnProperty("elemType")&&(i.elemType=s.onnx.TypeProto.toObject(e.elemType,t)),i},e.prototype.toJSON=function(){return this.constructor.toObject(this,i.util.toJSONOptions)},e.getTypeUrl=function(e){return void 0===e&&(e="type.googleapis.com"),e+"/onnx.TypeProto.Sequence"},e}(),t.Map=function(){function e(e){if(e)for(var t=Object.keys(e),i=0;i<t.length;++i)null!=e[t[i]]&&(this[t[i]]=e[t[i]])}return e.prototype.keyType=0,e.prototype.valueType=null,e.create=function(t){return new e(t)},e.encode=function(e,t){return t||(t=o.create()),null!=e.keyType&&Object.hasOwnProperty.call(e,"keyType")&&t.uint32(8).int32(e.keyType),null!=e.valueType&&Object.hasOwnProperty.call(e,"valueType")&&s.onnx.TypeProto.encode(e.valueType,t.uint32(18).fork()).ldelim(),t},e.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},e.decode=function(e,t){e instanceof n||(e=n.create(e));for(var i=void 0===t?e.len:e.pos+t,o=new s.onnx.TypeProto.Map;e.pos<i;){var a=e.uint32();switch(a>>>3){case 1:o.keyType=e.int32();break;case 2:o.valueType=s.onnx.TypeProto.decode(e,e.uint32());break;default:e.skipType(7&a)}}return o},e.decodeDelimited=function(e){return e instanceof n||(e=new n(e)),this.decode(e,e.uint32())},e.verify=function(e){if("object"!=typeof e||null===e)return"object expected";if(null!=e.keyType&&e.hasOwnProperty("keyType")&&!a.isInteger(e.keyType))return"keyType: integer expected";if(null!=e.valueType&&e.hasOwnProperty("valueType")){var t=s.onnx.TypeProto.verify(e.valueType);if(t)return"valueType."+t}return null},e.fromObject=function(e){if(e instanceof s.onnx.TypeProto.Map)return e;var t=new s.onnx.TypeProto.Map;if(null!=e.keyType&&(t.keyType=0|e.keyType),null!=e.valueType){if("object"!=typeof e.valueType)throw TypeError(".onnx.TypeProto.Map.valueType: object expected");t.valueType=s.onnx.TypeProto.fromObject(e.valueType)}return t},e.toObject=function(e,t){t||(t={});var i={};return t.defaults&&(i.keyType=0,i.valueType=null),null!=e.keyType&&e.hasOwnProperty("keyType")&&(i.keyType=e.keyType),null!=e.valueType&&e.hasOwnProperty("valueType")&&(i.valueType=s.onnx.TypeProto.toObject(e.valueType,t)),i},e.prototype.toJSON=function(){return this.constructor.toObject(this,i.util.toJSONOptions)},e.getTypeUrl=function(e){return void 0===e&&(e="type.googleapis.com"),e+"/onnx.TypeProto.Map"},e}(),t.Optional=function(){function e(e){if(e)for(var t=Object.keys(e),i=0;i<t.length;++i)null!=e[t[i]]&&(this[t[i]]=e[t[i]])}return e.prototype.elemType=null,e.create=function(t){return new e(t)},e.encode=function(e,t){return t||(t=o.create()),null!=e.elemType&&Object.hasOwnProperty.call(e,"elemType")&&s.onnx.TypeProto.encode(e.elemType,t.uint32(10).fork()).ldelim(),t},e.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},e.decode=function(e,t){e instanceof n||(e=n.create(e));for(var i=void 0===t?e.len:e.pos+t,o=new s.onnx.TypeProto.Optional;e.pos<i;){var a=e.uint32();a>>>3==1?o.elemType=s.onnx.TypeProto.decode(e,e.uint32()):e.skipType(7&a)}return o},e.decodeDelimited=function(e){return e instanceof n||(e=new n(e)),this.decode(e,e.uint32())},e.verify=function(e){if("object"!=typeof e||null===e)return"object expected";if(null!=e.elemType&&e.hasOwnProperty("elemType")){var t=s.onnx.TypeProto.verify(e.elemType);if(t)return"elemType."+t}return null},e.fromObject=function(e){if(e instanceof s.onnx.TypeProto.Optional)return e;var t=new s.onnx.TypeProto.Optional;if(null!=e.elemType){if("object"!=typeof e.elemType)throw TypeError(".onnx.TypeProto.Optional.elemType: object expected");t.elemType=s.onnx.TypeProto.fromObject(e.elemType)}return t},e.toObject=function(e,t){t||(t={});var i={};return t.defaults&&(i.elemType=null),null!=e.elemType&&e.hasOwnProperty("elemType")&&(i.elemType=s.onnx.TypeProto.toObject(e.elemType,t)),i},e.prototype.toJSON=function(){return this.constructor.toObject(this,i.util.toJSONOptions)},e.getTypeUrl=function(e){return void 0===e&&(e="type.googleapis.com"),e+"/onnx.TypeProto.Optional"},e}(),t.SparseTensor=function(){function e(e){if(e)for(var t=Object.keys(e),i=0;i<t.length;++i)null!=e[t[i]]&&(this[t[i]]=e[t[i]])}return e.prototype.elemType=0,e.prototype.shape=null,e.create=function(t){return new e(t)},e.encode=function(e,t){return t||(t=o.create()),null!=e.elemType&&Object.hasOwnProperty.call(e,"elemType")&&t.uint32(8).int32(e.elemType),null!=e.shape&&Object.hasOwnProperty.call(e,"shape")&&s.onnx.TensorShapeProto.encode(e.shape,t.uint32(18).fork()).ldelim(),t},e.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},e.decode=function(e,t){e instanceof n||(e=n.create(e));for(var i=void 0===t?e.len:e.pos+t,o=new s.onnx.TypeProto.SparseTensor;e.pos<i;){var a=e.uint32();switch(a>>>3){case 1:o.elemType=e.int32();break;case 2:o.shape=s.onnx.TensorShapeProto.decode(e,e.uint32());break;default:e.skipType(7&a)}}return o},e.decodeDelimited=function(e){return e instanceof n||(e=new n(e)),this.decode(e,e.uint32())},e.verify=function(e){if("object"!=typeof e||null===e)return"object expected";if(null!=e.elemType&&e.hasOwnProperty("elemType")&&!a.isInteger(e.elemType))return"elemType: integer expected";if(null!=e.shape&&e.hasOwnProperty("shape")){var t=s.onnx.TensorShapeProto.verify(e.shape);if(t)return"shape."+t}return null},e.fromObject=function(e){if(e instanceof s.onnx.TypeProto.SparseTensor)return e;var t=new s.onnx.TypeProto.SparseTensor;if(null!=e.elemType&&(t.elemType=0|e.elemType),null!=e.shape){if("object"!=typeof e.shape)throw TypeError(".onnx.TypeProto.SparseTensor.shape: object expected");t.shape=s.onnx.TensorShapeProto.fromObject(e.shape)}return t},e.toObject=function(e,t){t||(t={});var i={};return t.defaults&&(i.elemType=0,i.shape=null),null!=e.elemType&&e.hasOwnProperty("elemType")&&(i.elemType=e.elemType),null!=e.shape&&e.hasOwnProperty("shape")&&(i.shape=s.onnx.TensorShapeProto.toObject(e.shape,t)),i},e.prototype.toJSON=function(){return this.constructor.toObject(this,i.util.toJSONOptions)},e.getTypeUrl=function(e){return void 0===e&&(e="type.googleapis.com"),e+"/onnx.TypeProto.SparseTensor"},e}(),t}(),e.OperatorSetIdProto=function(){function e(e){if(e)for(var t=Object.keys(e),i=0;i<t.length;++i)null!=e[t[i]]&&(this[t[i]]=e[t[i]])}return e.prototype.domain="",e.prototype.version=a.Long?a.Long.fromBits(0,0,!1):0,e.create=function(t){return new e(t)},e.encode=function(e,t){return t||(t=o.create()),null!=e.domain&&Object.hasOwnProperty.call(e,"domain")&&t.uint32(10).string(e.domain),null!=e.version&&Object.hasOwnProperty.call(e,"version")&&t.uint32(16).int64(e.version),t},e.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},e.decode=function(e,t){e instanceof n||(e=n.create(e));for(var i=void 0===t?e.len:e.pos+t,o=new s.onnx.OperatorSetIdProto;e.pos<i;){var a=e.uint32();switch(a>>>3){case 1:o.domain=e.string();break;case 2:o.version=e.int64();break;default:e.skipType(7&a)}}return o},e.decodeDelimited=function(e){return e instanceof n||(e=new n(e)),this.decode(e,e.uint32())},e.verify=function(e){return"object"!=typeof e||null===e?"object expected":null!=e.domain&&e.hasOwnProperty("domain")&&!a.isString(e.domain)?"domain: string expected":null!=e.version&&e.hasOwnProperty("version")&&!a.isInteger(e.version)&&!(e.version&&a.isInteger(e.version.low)&&a.isInteger(e.version.high))?"version: integer|Long expected":null},e.fromObject=function(e){if(e instanceof s.onnx.OperatorSetIdProto)return e;var t=new s.onnx.OperatorSetIdProto;return null!=e.domain&&(t.domain=String(e.domain)),null!=e.version&&(a.Long?(t.version=a.Long.fromValue(e.version)).unsigned=!1:"string"==typeof e.version?t.version=parseInt(e.version,10):"number"==typeof e.version?t.version=e.version:"object"==typeof e.version&&(t.version=new a.LongBits(e.version.low>>>0,e.version.high>>>0).toNumber())),t},e.toObject=function(e,t){t||(t={});var i={};if(t.defaults)if(i.domain="",a.Long){var n=new a.Long(0,0,!1);i.version=t.longs===String?n.toString():t.longs===Number?n.toNumber():n}else i.version=t.longs===String?"0":0;return null!=e.domain&&e.hasOwnProperty("domain")&&(i.domain=e.domain),null!=e.version&&e.hasOwnProperty("version")&&("number"==typeof e.version?i.version=t.longs===String?String(e.version):e.version:i.version=t.longs===String?a.Long.prototype.toString.call(e.version):t.longs===Number?new a.LongBits(e.version.low>>>0,e.version.high>>>0).toNumber():e.version),i},e.prototype.toJSON=function(){return this.constructor.toObject(this,i.util.toJSONOptions)},e.getTypeUrl=function(e){return void 0===e&&(e="type.googleapis.com"),e+"/onnx.OperatorSetIdProto"},e}(),e.OperatorStatus=function(){var e={},t=Object.create(e);return t[e[0]="EXPERIMENTAL"]=0,t[e[1]="STABLE"]=1,t}(),e.FunctionProto=function(){function e(e){if(this.input=[],this.output=[],this.attribute=[],this.attributeProto=[],this.node=[],this.opsetImport=[],e)for(var t=Object.keys(e),i=0;i<t.length;++i)null!=e[t[i]]&&(this[t[i]]=e[t[i]])}return e.prototype.name="",e.prototype.input=a.emptyArray,e.prototype.output=a.emptyArray,e.prototype.attribute=a.emptyArray,e.prototype.attributeProto=a.emptyArray,e.prototype.node=a.emptyArray,e.prototype.docString="",e.prototype.opsetImport=a.emptyArray,e.prototype.domain="",e.create=function(t){return new e(t)},e.encode=function(e,t){if(t||(t=o.create()),null!=e.name&&Object.hasOwnProperty.call(e,"name")&&t.uint32(10).string(e.name),null!=e.input&&e.input.length)for(var i=0;i<e.input.length;++i)t.uint32(34).string(e.input[i]);if(null!=e.output&&e.output.length)for(var i=0;i<e.output.length;++i)t.uint32(42).string(e.output[i]);if(null!=e.attribute&&e.attribute.length)for(var i=0;i<e.attribute.length;++i)t.uint32(50).string(e.attribute[i]);if(null!=e.node&&e.node.length)for(var i=0;i<e.node.length;++i)s.onnx.NodeProto.encode(e.node[i],t.uint32(58).fork()).ldelim();if(null!=e.docString&&Object.hasOwnProperty.call(e,"docString")&&t.uint32(66).string(e.docString),null!=e.opsetImport&&e.opsetImport.length)for(var i=0;i<e.opsetImport.length;++i)s.onnx.OperatorSetIdProto.encode(e.opsetImport[i],t.uint32(74).fork()).ldelim();if(null!=e.domain&&Object.hasOwnProperty.call(e,"domain")&&t.uint32(82).string(e.domain),null!=e.attributeProto&&e.attributeProto.length)for(var i=0;i<e.attributeProto.length;++i)s.onnx.AttributeProto.encode(e.attributeProto[i],t.uint32(90).fork()).ldelim();return t},e.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},e.decode=function(e,t){e instanceof n||(e=n.create(e));for(var i=void 0===t?e.len:e.pos+t,o=new s.onnx.FunctionProto;e.pos<i;){var a=e.uint32();switch(a>>>3){case 1:o.name=e.string();break;case 4:o.input&&o.input.length||(o.input=[]),o.input.push(e.string());break;case 5:o.output&&o.output.length||(o.output=[]),o.output.push(e.string());break;case 6:o.attribute&&o.attribute.length||(o.attribute=[]),o.attribute.push(e.string());break;case 11:o.attributeProto&&o.attributeProto.length||(o.attributeProto=[]),o.attributeProto.push(s.onnx.AttributeProto.decode(e,e.uint32()));break;case 7:o.node&&o.node.length||(o.node=[]),o.node.push(s.onnx.NodeProto.decode(e,e.uint32()));break;case 8:o.docString=e.string();break;case 9:o.opsetImport&&o.opsetImport.length||(o.opsetImport=[]),o.opsetImport.push(s.onnx.OperatorSetIdProto.decode(e,e.uint32()));break;case 10:o.domain=e.string();break;default:e.skipType(7&a)}}return o},e.decodeDelimited=function(e){return e instanceof n||(e=new n(e)),this.decode(e,e.uint32())},e.verify=function(e){if("object"!=typeof e||null===e)return"object expected";if(null!=e.name&&e.hasOwnProperty("name")&&!a.isString(e.name))return"name: string expected";if(null!=e.input&&e.hasOwnProperty("input")){if(!Array.isArray(e.input))return"input: array expected";for(var t=0;t<e.input.length;++t)if(!a.isString(e.input[t]))return"input: string[] expected"}if(null!=e.output&&e.hasOwnProperty("output")){if(!Array.isArray(e.output))return"output: array expected";for(var t=0;t<e.output.length;++t)if(!a.isString(e.output[t]))return"output: string[] expected"}if(null!=e.attribute&&e.hasOwnProperty("attribute")){if(!Array.isArray(e.attribute))return"attribute: array expected";for(var t=0;t<e.attribute.length;++t)if(!a.isString(e.attribute[t]))return"attribute: string[] expected"}if(null!=e.attributeProto&&e.hasOwnProperty("attributeProto")){if(!Array.isArray(e.attributeProto))return"attributeProto: array expected";for(var t=0;t<e.attributeProto.length;++t){var i=s.onnx.AttributeProto.verify(e.attributeProto[t]);if(i)return"attributeProto."+i}}if(null!=e.node&&e.hasOwnProperty("node")){if(!Array.isArray(e.node))return"node: array expected";for(var t=0;t<e.node.length;++t){var i=s.onnx.NodeProto.verify(e.node[t]);if(i)return"node."+i}}if(null!=e.docString&&e.hasOwnProperty("docString")&&!a.isString(e.docString))return"docString: string expected";if(null!=e.opsetImport&&e.hasOwnProperty("opsetImport")){if(!Array.isArray(e.opsetImport))return"opsetImport: array expected";for(var t=0;t<e.opsetImport.length;++t){var i=s.onnx.OperatorSetIdProto.verify(e.opsetImport[t]);if(i)return"opsetImport."+i}}return null!=e.domain&&e.hasOwnProperty("domain")&&!a.isString(e.domain)?"domain: string expected":null},e.fromObject=function(e){if(e instanceof s.onnx.FunctionProto)return e;var t=new s.onnx.FunctionProto;if(null!=e.name&&(t.name=String(e.name)),e.input){if(!Array.isArray(e.input))throw TypeError(".onnx.FunctionProto.input: array expected");t.input=[];for(var i=0;i<e.input.length;++i)t.input[i]=String(e.input[i])}if(e.output){if(!Array.isArray(e.output))throw TypeError(".onnx.FunctionProto.output: array expected");t.output=[];for(var i=0;i<e.output.length;++i)t.output[i]=String(e.output[i])}if(e.attribute){if(!Array.isArray(e.attribute))throw TypeError(".onnx.FunctionProto.attribute: array expected");t.attribute=[];for(var i=0;i<e.attribute.length;++i)t.attribute[i]=String(e.attribute[i])}if(e.attributeProto){if(!Array.isArray(e.attributeProto))throw TypeError(".onnx.FunctionProto.attributeProto: array expected");t.attributeProto=[];for(var i=0;i<e.attributeProto.length;++i){if("object"!=typeof e.attributeProto[i])throw TypeError(".onnx.FunctionProto.attributeProto: object expected");t.attributeProto[i]=s.onnx.AttributeProto.fromObject(e.attributeProto[i])}}if(e.node){if(!Array.isArray(e.node))throw TypeError(".onnx.FunctionProto.node: array expected");t.node=[];for(var i=0;i<e.node.length;++i){if("object"!=typeof e.node[i])throw TypeError(".onnx.FunctionProto.node: object expected");t.node[i]=s.onnx.NodeProto.fromObject(e.node[i])}}if(null!=e.docString&&(t.docString=String(e.docString)),e.opsetImport){if(!Array.isArray(e.opsetImport))throw TypeError(".onnx.FunctionProto.opsetImport: array expected");t.opsetImport=[];for(var i=0;i<e.opsetImport.length;++i){if("object"!=typeof e.opsetImport[i])throw TypeError(".onnx.FunctionProto.opsetImport: object expected");t.opsetImport[i]=s.onnx.OperatorSetIdProto.fromObject(e.opsetImport[i])}}return null!=e.domain&&(t.domain=String(e.domain)),t},e.toObject=function(e,t){t||(t={});var i={};if((t.arrays||t.defaults)&&(i.input=[],i.output=[],i.attribute=[],i.node=[],i.opsetImport=[],i.attributeProto=[]),t.defaults&&(i.name="",i.docString="",i.domain=""),null!=e.name&&e.hasOwnProperty("name")&&(i.name=e.name),e.input&&e.input.length){i.input=[];for(var n=0;n<e.input.length;++n)i.input[n]=e.input[n]}if(e.output&&e.output.length){i.output=[];for(var n=0;n<e.output.length;++n)i.output[n]=e.output[n]}if(e.attribute&&e.attribute.length){i.attribute=[];for(var n=0;n<e.attribute.length;++n)i.attribute[n]=e.attribute[n]}if(e.node&&e.node.length){i.node=[];for(var n=0;n<e.node.length;++n)i.node[n]=s.onnx.NodeProto.toObject(e.node[n],t)}if(null!=e.docString&&e.hasOwnProperty("docString")&&(i.docString=e.docString),e.opsetImport&&e.opsetImport.length){i.opsetImport=[];for(var n=0;n<e.opsetImport.length;++n)i.opsetImport[n]=s.onnx.OperatorSetIdProto.toObject(e.opsetImport[n],t)}if(null!=e.domain&&e.hasOwnProperty("domain")&&(i.domain=e.domain),e.attributeProto&&e.attributeProto.length){i.attributeProto=[];for(var n=0;n<e.attributeProto.length;++n)i.attributeProto[n]=s.onnx.AttributeProto.toObject(e.attributeProto[n],t)}return i},e.prototype.toJSON=function(){return this.constructor.toObject(this,i.util.toJSONOptions)},e.getTypeUrl=function(e){return void 0===e&&(e="type.googleapis.com"),e+"/onnx.FunctionProto"},e}(),e}(),t.exports=s});function no(e,t){if(!e)throw Error("string"==typeof t?t:t())}function Co(e){return new TextDecoder().decode(e)}var We,kr,yl,gt,Li,ft,xt,ne,Eo,Nr,Lr,Rr,Me=k(()=>{"use strict";Fs(),We=ve(to()),zr(),kr=class{static arraysEqual(e,t){if(e.length!==t.length)return!1;for(let i=0;i<e.length;i++)if(e[i]!==t[i])return!1;return!0}},yl=class{static preprocessInputShapes(e,t){return[1===e.length?[1,e[0]]:e,1===t.length?[t[0],1]:t]}static postprocessOutputShape(e,t,i){1===t&&e.splice(e.length-2,1),1===i&&e.pop()}static calcMatMulShape(e,t){return e[1]!==t[0]?void 0:[e[0],t[1]]}},gt=class e{static calcShape(e,t,i=!1){let n=e.length,o=t.length;if(0===n)return t;if(0===o)return e;let a=Math.max(e.length,t.length),s=Array(a);if(i){if(n<2||o<2)return;let i=yl.calcMatMulShape([e[n-2],e[n-1]],[t[o-2],t[o-1]]);if(void 0===i)return;[s[a-2],s[a-1]]=i}for(let u=i?3:1;u<=a;u++){let i=n-u<0?1:e[n-u],l=o-u<0?1:t[o-u];if(i!==l&&i>1&&l>1)return;s[a-u]=Math.max(i,l)}return s}static index(t,i){let n=Array(i.length);return e.fillIndex(t,i,n),n}static fillIndex(e,t,i){let n=e.length-t.length;for(let o=0;o<t.length;o++)i[o]=e[n+o]%t[o]}static calc(t,i,n,o,a){let s=e.calcShape(t.dims,i.dims);if(s){if(o&&!ne.areEqual(s,t.dims))return;let u=ne.size(s),l=o?t:new nt(s,a||t.type);if(0===s.length)l.set([],n(t.get([]),i.get([])));else{let o,a=Array(s.length),d=Array(t.dims.length),p=Array(i.dims.length),c=0,h=0,f=!1,m=!1;0===t.dims.length&&(c=t.get([]),f=!0),0===i.dims.length&&(h=i.get([]),m=!0);for(let g=0;g<u;g++){o=g;for(let e=s.length-1;e>=0;e--)a[e]=o%s[e],o=Math.floor(o/s[e]);f||(e.fillIndex(a,t.dims,d),c=t.get(d)),m||(e.fillIndex(a,i.dims,p),h=i.get(p)),l.set(a,n(c,h))}}return l}}static isValidBroadcast(e,t){let i=e.length,n=t.length;if(i>n)return!1;for(let o=1;o<=i;o++)if(1!==e[i-o]&&e[i-o]!==t[n-o])return!1;return!0}static getBroadcastDims(e,t){let i=e.length,n=[];for(let o=0;o<i;o++){let a=i-1-o,s=e[a]||1;(t[t.length-1-o]||1)>1&&1===s&&n.unshift(a)}return n}},Li=class{static getShapeOfGemmResult(e,t,i,n,o){let a,s,u;if(2!==e.length||2!==i.length)throw Error("shape need to be of size 2");t?(a=e[1],s=e[0]):(a=e[0],s=e[1]);let l=-1;if(n?(u=i[0],l=1):(u=i[1],l=0),i[l]!==s)throw Error("dimension mismatch");if(a<=0||u<=0||s<=0)throw Error("invalid shape specified");if(o&&!gt.isValidBroadcast(o,[a,u]))throw Error("gemm: invalid bias shape for broadcast");return[a,u,s]}},ft=class e{static tensorDataTypeFromProto(e){switch(e){case We.onnx.TensorProto.DataType.INT8:return"int8";case We.onnx.TensorProto.DataType.UINT8:return"uint8";case We.onnx.TensorProto.DataType.BOOL:return"bool";case We.onnx.TensorProto.DataType.INT16:return"int16";case We.onnx.TensorProto.DataType.UINT16:return"uint16";case We.onnx.TensorProto.DataType.INT32:return"int32";case We.onnx.TensorProto.DataType.UINT32:return"uint32";case We.onnx.TensorProto.DataType.FLOAT:return"float32";case We.onnx.TensorProto.DataType.DOUBLE:return"float64";case We.onnx.TensorProto.DataType.STRING:return"string";case We.onnx.TensorProto.DataType.INT64:return"int32";case We.onnx.TensorProto.DataType.UINT64:return"uint32";default:throw Error(`unsupported data type: ${We.onnx.TensorProto.DataType[e]}`)}}static tensorDataTypeStringToEnum(e){switch(e){case"int8":return We.onnx.TensorProto.DataType.INT8;case"uint8":return We.onnx.TensorProto.DataType.UINT8;case"bool":return We.onnx.TensorProto.DataType.BOOL;case"int16":return We.onnx.TensorProto.DataType.INT16;case"uint16":return We.onnx.TensorProto.DataType.UINT16;case"int32":return We.onnx.TensorProto.DataType.INT32;case"uint32":return We.onnx.TensorProto.DataType.UINT32;case"float32":return We.onnx.TensorProto.DataType.FLOAT;case"float64":return We.onnx.TensorProto.DataType.DOUBLE;case"string":return We.onnx.TensorProto.DataType.STRING;case"int64":return We.onnx.TensorProto.DataType.INT64;case"uint64":return We.onnx.TensorProto.DataType.UINT64;default:throw Error(`unsupported data type: ${e}`)}}static tensorDimsFromProto(e){return e.map(e=>dr.isLong(e)?e.toNumber():e)}static tensorValueTypeFromProto(t){return{tensorType:e.tensorDataTypeFromProto(t.elemType),shape:{dims:e.tensorDimsFromProto(t.shape.dim.map(e=>e.dimValue))}}}static tensorDimsFromORTFormat(e){let t=[];for(let i=0;i<e.dimsLength();i++)t.push(xt.longToNumber(e.dims(i)));return t}static tensorAttributesFromORTFormat(e){let t=[];for(let i=0;i<e.attributesLength();i++)t.push(e.attributes(i));return t}},xt=class{static longToNumber(e){return dr.isLong(e)?e.toNumber():"bigint"==typeof e?Number(e):e}static isLong(e){return dr.isLong(e)||"bigint"==typeof e}},ne=class e{static size(t){return e.getSizeFromDimensionRange(t,0,t.length)}static sizeFromDimension(t,i){if(i<0||i>t.length)throw Error(`invalid dimension of ${i} for sizeFromDimension as Tensor has ${t.length} dimensions.`);return e.getSizeFromDimensionRange(t,i,t.length)}static sizeToDimension(t,i){if(i<0||i>t.length)throw Error(`invalid dimension of ${i} for sizeToDimension as Tensor has ${t.length} dimensions.`);return e.getSizeFromDimensionRange(t,0,i)}static getSizeFromDimensionRange(e,t,i){let n=1;for(let o=t;o<i;o++){if(e[o]<=0)throw Error("cannot get valid size from specified dimension range. Most likely the range contains 0 or negative values in them.");n*=e[o]}return n}static computeStrides(e){let t=e.length;if(0===t)return[];if(1===t)return[1];let i=Array(t);i[t-1]=1,i[t-2]=e[t-1];for(let n=t-3;n>=0;--n)i[n]=i[n+1]*e[n+1];return i}static transpose(e){return e.slice().reverse()}static indicesToOffset(e,t,i){void 0===i&&(i=e.length);let n=0;for(let o=0;o<i;++o)n+=t[o]*e[o];return n}static offsetToIndices(e,t){let i=t.length;if(0===i)return[];if(1===i)return[e*t[0]];let n=Array(t.length);for(let i=0;i<n.length-1;++i)n[i]=Math.floor(e/t[i]),e-=n[i]*t[i];return n[n.length-1]=e,n}static normalizeAxis(e,t){if(e<-t&&e>=t)throw Error("unsupported axis for this operation.");return e<0?e+t:e}static normalizeAxes(e,t){return e.map(e=>this.normalizeAxis(e,t))}static incrementIndex(e,t,i){if(0===t.length||0===e.length)throw Error("Index incrementing unsupported for scalar Tensor");if(void 0===i)i=t.length;else if(i<=0||i>t.length)throw Error("Incorrect axis to increment on");for(let n=i-1;n>=0&&(e[n]++,!(e[n]<t[n]));--n)e[n]=0}static calculateReshapedDims(t,i){if(0===i.length){if(0===t.length||1===e.size(t))return[];throw Error("cannot reshape to a scalar Tensor")}let n=i.length,o=Array(n),a=-1,s=1;for(let e=0;e<n;e++){if(i[e]<-1)throw Error("a dimension in shape hints cannot be less than -1");if(-1===i[e]){if(-1!==a)throw Error("at most one dimension in shape hints can be -1");a=e}else{if(0===i[e]){if(e>=t.length)throw Error("the dimension with value zero exceeds the dimension size of the input tensor");o[e]=t[e]}else o[e]=i[e];s*=o[e]}}let u=e.size(t);if(-1!==a){if(u%s!=0)throw Error(`the input tensor cannot be reshaped to the requested shape. Input shape: [${t}] Output shape: [${i}]`);o[a]=u/s}else if(s!==u)throw Error("reshapedDims and originalDims don't have matching sizes");return o}static sortBasedOnPerm(e,t){return t?t.map(t=>e[t]):e.slice().reverse()}static padShape(e,t){let i=e.length;return e.map((e,n)=>e+t[n]+t[n+i])}static areEqual(e,t){return e.length===t.length&&e.every((e,i)=>e===t[i])}static validateDimsAndCalcSize(e){if(e.length>6)throw TypeError("Only rank 0 to 6 is supported for tensor shape.");let t=1;for(let i of e){if(!Number.isInteger(i))throw TypeError(`Invalid shape: ${i} is not an integer`);if(i<0||i>0x7fffffff)throw TypeError(`Invalid shape: length ${i} is not allowed`);t*=i}return t}static flattenShape(e,t){t<0&&(t+=e.length);let i=e.reduce((e,t)=>e*t,1),n=e.slice(t).reduce((e,t)=>e*t,1);return[i/n,n]}static squeezeShape(t,i){let n=[];i=e.normalizeAxes(i,t.length);for(let e=0;e<t.length;e++){let o=i.indexOf(e)>=0;if(o&&1!==t[e])throw Error("squeeze an axis of size different than 1");(0===i.length&&t[e]>1||i.length>0&&!o)&&n.push(t[e])}return n}static unsqueezeShape(t,i){let n=Array(t.length+i.length);n.fill(0);for(let t=0;t<i.length;t++){let o=e.normalizeAxis(i[t],n.length);if(o>=n.length)throw Error("'axes' has an out of range axis");if(0!==n[o])throw Error("'axes' has a duplicate axis");n[o]=1}let o=0;for(let e=0;e<n.length;e++)0===n[e]&&(n[e]=t[o++]);if(o!==t.length)throw Error("the unsqueezed dimension could not be established");return n}},Eo=class e{static splitShape(t,i,n,o){if(0===n.length){if(!o)throw Error("need to know number of outputs when the 'split' attribute is not specified");e.determineSplit(t[i],o,n)}let a=[],s=[0];for(let e=0;e<n.length;++e){0!==e&&s.push(s[e-1]+n[e-1]);let o=t.slice();o[i]=n[e],a.push(o)}return[a,s]}static determineSplit(e,t,i){if(e%t!=0)throw Error("cannot split tensor to equal sized parts");for(let n=0;n<t;++n)i.push(e/t)}},Nr=class e{static adjustPoolAttributes(e,t,i,n,o,a){if(!e&&i.length!==t.length-2)throw Error("length of specified kernel shapes should be 2 less than length of input dimensions");if(e)for(let e=0;e<t.length-2;e++)e>=i.length?i.push(t[e+2]):i[e]=t[e+2];for(let e=0;e<i.length;e++)if(e<n.length){if(n[e]<0)throw Error("strides should be greater than or equal to 1")}else n.push(1);for(let e=0;e<i.length;e++)if(e<o.length){if(o[e]<0)throw Error("dilations should be greater than or equal to 1")}else o.push(1);for(let e=0;e<2*i.length;e++)if(e<a.length){if(a[e]<0)throw Error("pad should be greater than or equal to 1")}else a.push(0);for(let e=0;e<i.length;e++){if(i[e]<=0)throw Error("kernel shapes need to be greater than 0");if(a[e]>=i[e]||a[e+i.length]>=i[e])throw Error("pads should be smaller than kernel")}}static adjustPadsBasedOnAutoPad(t,i,n,o,a,s){if(s){if(a.length!==2*(t.length-2))throw Error("length of pads should be twice the length of data dimensions");if(i.length!==t.length-2)throw Error("length of strides should be the length of data dimensions");if(o.length!==t.length-2)throw Error("length of kernel shapes should be the length of data dimensions");for(let u=0;u<t.length-2;u++)e.adjustPadAndReturnShape(t[u+2],i[u],n[u],o[u],a,u,u+t.length-2,s)}}static computePoolOutputShape(t,i,n,o,a,s,u){if(i.length<=0)throw Error("input shape must be of size greater than 0");let l=[i[0],i[1]];return e.computeShapeHelper(t,i,l,n,o,a,s,u),l}static computeConvOutputShape(t,i,n,o,a,s,u){if(t.length<=0||i.length<=0)throw Error("invalid input tensor dims or invalid filter tensor dims");let l=[t[0],i[0]];return e.computeShapeHelper(!1,t,l,n,o,a,s,u),l}static computeShapeHelper(t,i,n,o,a,s,u,l){if(t)for(let e=0;e<i.length-2;e++)n.push(1);else for(let t=0;t<i.length-2;t++)n.push(e.adjustPadAndReturnShape(i[t+2],o[t],a[t],s[t],u,t,t+i.length-2,l))}static adjustPadAndReturnShape(e,t,i,n,o,a,s,u){let l=i*(n-1)+1;if(!u||"NOTSET"===u)return Math.floor((e+o[a]+o[s]-l)/t+1);switch(u){case"VALID":return o[a]=0,o[s]=0,Math.floor((e-l)/t+1);case"SAME_LOWER":case"SAME_UPPER":if(1!==i)throw Error("Dilation not supported for SAME_UPPER or SAME_LOWER");{let i=((e+t-1)/t-1)*t+n-e;return o[a]=Math.floor("SAME_LOWER"===u?(i+1)/2:i/2),o[s]=i-o[a],Math.floor((e+i-n)/t+1)}default:throw Error("Unsupported AutoPad type")}}},Lr=-34028234663852886e22,Rr=34028234663852886e22});function vS(e){switch(e){case"bool":case"int8":case"uint8":return 1;case"int16":case"uint16":return 2;case"int32":case"uint32":case"float32":return 4;case"float64":return 8;default:throw Error(`cannot calculate sizeof() on type ${e}`)}}function _h(e){switch(e){case Ie.onnx.TensorProto.DataType.UINT8:case Ie.onnx.TensorProto.DataType.INT8:case Ie.onnx.TensorProto.DataType.BOOL:return 1;case Ie.onnx.TensorProto.DataType.UINT16:case Ie.onnx.TensorProto.DataType.INT16:return 2;case Ie.onnx.TensorProto.DataType.FLOAT:case Ie.onnx.TensorProto.DataType.INT32:case Ie.onnx.TensorProto.DataType.UINT32:return 4;case Ie.onnx.TensorProto.DataType.INT64:case Ie.onnx.TensorProto.DataType.DOUBLE:case Ie.onnx.TensorProto.DataType.UINT64:return 8;default:throw Error(`cannot calculate sizeof() on type ${Ie.onnx.TensorProto.DataType[e]}`)}}function wS(e,t){return new(xh(t))(e)}function xh(e){switch(e){case"bool":case"uint8":return Uint8Array;case"int8":return Int8Array;case"int16":return Int16Array;case"uint16":return Uint16Array;case"int32":return Int32Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"float32":return Float32Array;case"float64":return Float64Array;default:throw Error("unspecified error")}}function _l(e,t){if(t===Ie.onnx.TensorProto.DataType.INT64||t===So.TensorDataType.INT64){if(e.greaterThanOrEqual(0x80000000)||e.lessThan(-0x80000000))throw TypeError("int64 is not supported")}else if(t===Ie.onnx.TensorProto.DataType.UINT32||t===So.TensorDataType.UINT32||t===Ie.onnx.TensorProto.DataType.UINT64||t===So.TensorDataType.UINT64){if(e.greaterThanOrEqual(0x100000000)||e.lessThan(0))throw TypeError("uint64 is not supported")}else throw TypeError(`not a LONG type: ${Ie.onnx.TensorProto.DataType[t]}`);return e.toNumber()}function vh(e,t,i){switch(t){case Ie.onnx.TensorProto.DataType.BOOL:case Ie.onnx.TensorProto.DataType.UINT8:return e.getUint8(i);case Ie.onnx.TensorProto.DataType.INT8:return e.getInt8(i);case Ie.onnx.TensorProto.DataType.UINT16:return e.getUint16(i,!0);case Ie.onnx.TensorProto.DataType.INT16:return e.getInt16(i,!0);case Ie.onnx.TensorProto.DataType.FLOAT:return e.getFloat32(i,!0);case Ie.onnx.TensorProto.DataType.INT32:return e.getInt32(i,!0);case Ie.onnx.TensorProto.DataType.UINT32:return e.getUint32(i,!0);case Ie.onnx.TensorProto.DataType.INT64:return _l(dr.fromBits(e.getUint32(i,!0),e.getUint32(i+4,!0),!1),t);case Ie.onnx.TensorProto.DataType.DOUBLE:return e.getFloat64(i,!0);case Ie.onnx.TensorProto.DataType.UINT64:return _l(dr.fromBits(e.getUint32(i,!0),e.getUint32(i+4,!0),!0),t);default:throw Error(`cannot read from DataView for type ${Ie.onnx.TensorProto.DataType[t]}`)}}var wh,Ie,nt,zr=k(()=>{"use strict";wh=ve(zp()),Fs(),$o(),Ie=ve(to()),Me(),nt=class e{constructor(e,t,i,n,o,a=wh.Guid.create()){this.dims=e,this.type=t,this.dataProvider=i,this.asyncDataProvider=n,this.cache=o,this.dataId=a,this.size=ne.validateDimsAndCalcSize(e);let s=this.size,u=void 0===i&&void 0===n&&void 0===o;if(void 0!==o&&o.length!==s)throw RangeError("Input dims doesn't match data length.");if("string"===t){if(void 0!==o&&(!Array.isArray(o)||!o.every(e=>"string"==typeof e)))throw TypeError("cache should be a string array");u&&(this.cache=Array(s))}else{if(void 0!==o){let e=xh(t);if(!(o instanceof e))throw TypeError(`cache should be type ${e.name}`)}if(u){let e=new ArrayBuffer(s*vS(t));this.cache=wS(e,t)}}}get data(){if(void 0===this.cache){let e=this.dataProvider(this.dataId);if(e.length!==this.size)throw Error("Length of data provided by the Data Provider is inconsistent with the dims of this Tensor.");this.cache=e}return this.cache}get stringData(){if("string"!==this.type)throw TypeError("data type is not string");return this.data}get integerData(){switch(this.type){case"uint8":case"int8":case"uint16":case"int16":case"int32":case"uint32":case"bool":return this.data;default:throw TypeError("data type is not integer (uint8, int8, uint16, int16, int32, uint32, bool)")}}get floatData(){switch(this.type){case"float32":case"float64":return this.data;default:throw TypeError("data type is not float (float32, float64)")}}get numberData(){if("string"!==this.type)return this.data;throw TypeError("type cannot be non-number (string)")}get(e){return this.data[ne.indicesToOffset(e,this.strides)]}set(e,t){this.data[ne.indicesToOffset(e,this.strides)]=t}async getData(){return void 0===this.cache&&(this.cache=await this.asyncDataProvider(this.dataId)),this.cache}get strides(){return this._strides||(this._strides=ne.computeStrides(this.dims)),this._strides}static fromProto(t){if(!t)throw Error("cannot construct Value from an empty tensor");let i=ft.tensorDataTypeFromProto(t.dataType),n=new e(ft.tensorDimsFromProto(t.dims),i);if("string"===i)t.stringData.forEach((e,t)=>{n.data[t]=Co(e)});else if(t.rawData&&"number"==typeof t.rawData.byteLength&&t.rawData.byteLength>0){let e=n.data,i=new DataView(t.rawData.buffer,t.rawData.byteOffset,t.rawData.byteLength),o=_h(t.dataType),a=t.rawData.byteLength/o;if(t.rawData.byteLength%o!=0)throw Error("invalid buffer length");if(e.length!==a)throw Error("buffer length mismatch");for(let n=0;n<a;n++){let a=vh(i,t.dataType,n*o);e[n]=a}}else{let e;switch(t.dataType){case Ie.onnx.TensorProto.DataType.FLOAT:e=t.floatData;break;case Ie.onnx.TensorProto.DataType.INT32:case Ie.onnx.TensorProto.DataType.INT16:case Ie.onnx.TensorProto.DataType.UINT16:case Ie.onnx.TensorProto.DataType.INT8:case Ie.onnx.TensorProto.DataType.UINT8:case Ie.onnx.TensorProto.DataType.BOOL:e=t.int32Data;break;case Ie.onnx.TensorProto.DataType.INT64:e=t.int64Data;break;case Ie.onnx.TensorProto.DataType.DOUBLE:e=t.doubleData;break;case Ie.onnx.TensorProto.DataType.UINT32:case Ie.onnx.TensorProto.DataType.UINT64:e=t.uint64Data;break;default:throw Error("unspecific error")}if(null==e)throw Error("failed to populate data from a tensorproto value");let i=n.data;if(i.length!==e.length)throw Error("array length mismatch");for(let n=0;n<e.length;n++){let o=e[n];dr.isLong(o)?i[n]=_l(o,t.dataType):i[n]=o}}return n}static fromData(t,i,n){return new e(i,n,void 0,void 0,t)}static fromOrtTensor(t){if(!t)throw Error("cannot construct Value from an empty tensor");let i=ft.tensorDimsFromORTFormat(t),n=ft.tensorDataTypeFromProto(t.dataType()),o=new e(i,n);if("string"===n)for(let e=0;e<t.stringDataLength();e++)o.data[e]=t.stringData(e);else if(t.rawDataArray()&&"number"==typeof t.rawDataLength()&&t.rawDataLength()>0){let e=o.data,i=new DataView(t.rawDataArray().buffer,t.rawDataArray().byteOffset,t.rawDataLength()),n=_h(t.dataType()),a=t.rawDataLength()/n;if(t.rawDataLength()%n!=0)throw Error("invalid buffer length");if(e.length!==a)throw Error("buffer length mismatch");for(let o=0;o<a;o++){let a=vh(i,t.dataType(),o*n);e[o]=a}}return o}}});function ue(e){return 1===e?xS:TS}function Th(e){let t=ue(e);return`${t.version}
      precision highp float;
      ${t.attribute} vec3 position;
      ${t.attribute} vec2 textureCoord;

      ${t.varyingVertex} vec2 TexCoords;

      void main()
      {
          gl_Position = vec4(position, 1.0);
          TexCoords = textureCoord;
      }`}function Ih(e){let t=ue(e);return`${t.version}
    precision highp float;
    precision highp int;
    precision highp sampler2D;
    ${t.varyingFrag} vec2 TexCoords;
    ${t.outputDeclaration}
    const vec2 halfCR = vec2(0.5, 0.5);

    // Custom vector types to handle higher dimenalities.
    struct ivec5
    {
      int x;
      int y;
      int z;
      int w;
      int u;
    };

    struct ivec6
    {
      int x;
      int y;
      int z;
      int w;
      int u;
      int v;
    };

    int imod(int x, int y) {
      return x - y * (x / y);
    }

    `}function Sh(e,t){let i=ue(e);return`
  void main() {
    int indices[${t}];
    toVec(TexCoords, indices);
    vec4 result = vec4(process(indices));
    ${i.output} = result;
  }
  `}var xS,TS,Ke=k(()=>{"use strict";xS={version:"",attribute:"attribute",varyingVertex:"varying",varyingFrag:"varying",texture2D:"texture2D",output:"gl_FragColor",outputDeclaration:""},TS={version:"#version 300 es",attribute:"in",varyingVertex:"out",varyingFrag:"in",texture2D:"texture",output:"outputColor",outputDeclaration:"out vec4 outputColor;"}}),Ae=k(()=>{});async function vl(e,t=e=>0,i){return new Promise((n,o)=>{let a=0,s=()=>{if(e())return void n();let u=t(++a);if(null!=i&&a>=i)return void o();setTimeout(s,u)};s()})}function Ri(e){return no("u">typeof e&&0!==e.length,()=>"empty string found for sampler name"),"get"+e.charAt(0).toUpperCase()+e.slice(1)}function $h(e){return no("u">typeof e&&0!==e.length,()=>"empty string found for sampler name"),"get"+e.charAt(0).toUpperCase()+e.slice(1)+"AtOutCoords"}function ro(e,t){return JSON.parse(JSON.stringify(e)),t}function oo(e,t){return t.map(t=>e[t]).join(", ")}function bt(e){if(e<=1)return"int";if(2===e)return"ivec2";if(3===e)return"ivec3";if(4===e)return"ivec4";if(5===e)return"ivec5";if(6===e)return"ivec6";throw Error(`GPU for rank ${e} is not yet supported`)}function qt(e=6){return["x","y","z","w","u","v"].slice(0,e)}var Nn=k(()=>{"use strict";Me()});function IS(e,t){return qt(t).map(t=>`${e}.${t}`)}function io(e,t){return 1===t?[e]:IS(e,t)}function Ln(){return`
    float getChannel(vec4 frag, int dim) {
      int modCoord = imod(dim, 2);
      return modCoord == 0 ? frag.r : frag.g;
    }

    float getChannel(vec4 frag, vec2 innerDims) {
      vec2 modCoord = mod(innerDims, 2.);
      return modCoord.x == 0. ?
        (modCoord.y == 0. ? frag.r : frag.g) :
        (modCoord.y == 0. ? frag.b : frag.a);
    }
  `}var Mr=k(()=>{"use strict";Nn()});function $S(e,t,i){if(0===e)return"false";if(1===e)return`rc > ${t[0]}`;let n="";for(let o=e-2;o<e;o++)n+=`${i[o]} >= ${t[o-e+2]}`,o<e-1&&(n+="||");return n}function AS(e,t){let i=e.length;if(0===i)return"getA(), 0, 0, 0";if(1===i)return`getA(rc),
            rc + 1 >= ${e[0]} ? 0. : getA(rc + 1),
            0, 0`;let n="r, c",o="r, cp1",a="rp1, c",s="rp1, cp1",u="";if(i>2)for(let e=0;e<i-2;++e)u+=`${t[e]},`;return`getA(${u}${n}),
          rEdge ? 0. : getA(${u}${a}),
          cEdge ? 0. : getA(${u}${o}),
          rEdge || cEdge ? 0. : getA(${u}${s})`}function OS(e,t,i,n){return 0===e||1===e?"":`
    int r = ${t[e-2]};
    int c = ${t[e-1]};
    int rp1 = ${t[e-2]} + 1;
    int cp1 = ${t[e-1]} + 1;
    bool rEdge = rp1 >= ${n};
    bool cEdge = cp1 >= ${i};
    `}var Ah,SS,Oh,Ph=k(()=>{"use strict";Ke(),Ae(),Nn(),Mr(),Ah={name:"pack",inputNames:["A"],inputTypes:[1]},SS=(e,t)=>{let i=ue(e.session.backend.glContext.version),n=t.dims,o=n.length,a=t.dims.length,s=bt(a),u=io("rc",a),l=OS(a,u,n[n.length-2],n[n.length-1]),d;d=0===o?[1,1]:1===o?[n[0],1]:[n[a-1],n[a-2]];let p=$S(a,d,u),c=AS(n,u),h=`
        void main() {
          ${s} rc = getOutputCoords();

          if(${p}) {
            ${i.output} = vec4(0);
          } else {
            ${l}

            ${i.output} = vec4(${c});
          }
        }
      `;return{...Ah,hasMain:!0,output:{dims:t.dims,type:t.type,textureType:2},shaderSource:h}},Oh=(e,t)=>({...Ah,get:()=>SS(e,t)})});function wl(e){if(0===e.length)return[1,1,1];let t=1;for(let i=0;i<e.length-2;++i)t*=e[i];return[t,e.length>1?e[e.length-2]:1,e[e.length-1]]}function Ch(e,t){return 0===e.length||0===t.length||(e.length<2||t.length<2?e[e.length-1]===t[t.length-1]:e[e.length-1]===t[t.length-1]&&e[e.length-2]===t[t.length-2])}function CS(e){let t=ne.computeStrides(e),i=["b","r","c"],n="index";return`
    ivec3 inputCoordsFromReshapedOutCoords(int index) {
      ${t.map((e,o)=>{let a=`int ${i[o]} = ${n} / ${e}`,s=o===t.length-1?`int ${i[o+1]} = ${n} - ${i[o]} * ${e}`:`index -= ${i[o]} * ${e}`;return`${a}; ${s};`}).join("")}
      return ivec3(b, r, c);
    }
  `}function DS(e){let t=ne.computeStrides(e);return`
  int getFlattenedIndex(ivec3 coords) {
    // reverse y, z order
    return coords.x * ${t[0]} + coords.z * ${t[1]} + coords.y;
  }
`}var PS,ES,Eh,xl,Dh=k(()=>{"use strict";Me(),Ke(),Ae(),Mr(),PS=e=>({name:"Reshape (packed)",inputTypes:[2],inputNames:["A"],cacheHint:`${e}`}),ES=(e,t,i,n)=>{let o=t.dims,a=n,s="";for(let e=0;e<4;e++){let t="";switch(e){case 0:t="outputCoords = rc;";break;case 1:t="outputCoords = ivec3(rc.x, rc.y+1, rc.z);";break;case 2:t="outputCoords = ivec3(rc.x, rc.y, rc.z+1);";break;case 3:t="outputCoords = ivec3(rc.x, rc.y+1, rc.z+1);";break;default:throw Error()}s+=`
        ${t}
        ${e>0?"if(outputCoords.y < rows && outputCoords.z < cols){":""}
          int flattenedIndex = getFlattenedIndex(outputCoords);

          ivec3 inputRC = inputCoordsFromReshapedOutCoords(flattenedIndex);
          vec2 innerDims = vec2(float(inputRC.y),float(inputRC.z));

          result[${e}] = getChannel(getA(inputRC.x, inputRC.y, inputRC.z), innerDims);

        ${e>0?"}":""}
      `}let u=ue(e.session.backend.glContext.version),l=`
      ${CS(o)}
      ${DS(a)}
      ${Ln()}

      void main() {
        ivec3 rc = getOutputCoords();

        vec4 result = vec4(0.0);

        ivec3 outputCoords;
        int rows = ${a[2]};
        int cols = ${a[1]};

        ${s}
        ${u.output} = result;
      }
    `;return{...i,output:{dims:a,type:t.type,textureType:2},shaderSource:l,hasMain:!0}},Eh=(e,t,i)=>{let n=PS(i);return{...n,get:()=>ES(e,t,n,i)}}}),kh=k(()=>{"use strict";Ke(),Ae(),xl=(e,t)=>{let i=t.shape,n=ue(e.session.backend.glContext.version),o=`
    const float FLOAT_MAX = 1.70141184e38;
    const float FLOAT_MIN = 1.17549435e-38;

    bool isNaN(float val) {
      return (val < 1.0 || 0.0 < val || val == 0.0) ? false : true;
    }

    highp vec4 encodeAsUint8(highp float v) {
      if (isNaN(v)) {
        return vec4(255, 255, 255, 255);
      }

      highp float av = abs(v);

      if(av < FLOAT_MIN) {
        return vec4(0.0, 0.0, 0.0, 0.0);
      } else if(v > FLOAT_MAX) {
        return vec4(0.0, 0.0, 128.0, 127.0) / 255.0;
      } else if(v < -FLOAT_MAX) {
        return vec4(0.0, 0.0,  128.0, 255.0) / 255.0;
      }

      highp vec4 c = vec4(0,0,0,0);

      highp float e = floor(log2(av));
      highp float m = exp2(fract(log2(av))) - 1.0;

      c[2] = floor(128.0 * m);
      m -= c[2] / 128.0;
      c[1] = floor(32768.0 * m);
      m -= c[1] / 32768.0;
      c[0] = floor(8388608.0 * m);

      highp float ebias = e + 127.0;
      c[3] = floor(ebias / 2.0);
      ebias -= c[3] * 2.0;
      c[2] += floor(ebias) * 128.0;

      c[3] += 128.0 * step(0.0, -v);

      return c / 255.0;
    }

    void main() {
      float value = ${n.texture2D}(X,TexCoords).r;
      ${n.output} = encodeAsUint8(value);
    }`,a={name:"Uint8Encode",inputTypes:[0],inputNames:["X"],output:{dims:i,type:t.tensor.type,textureType:3},shaderSource:o,hasMain:!0};return e.executeProgram(a,[t.tensor])}});function NS(e,t){if(1===e)return"rc";let i="";for(let n=0;n<e;n++)i+=t[n],n<e-1&&(i+=",");return i}var Nh,kS,Lh,zi,Do,Mi,No,zh,Tl,RS,Bi,Il,xe,Vh,Gh,Uh,zS,MS,Fi,zt,Y,Lo,Vi,Rh=k(()=>{"use strict";Ke(),Ae(),Nn(),Mr(),Nh={name:"unpack",inputNames:["A"],inputTypes:[2]},kS=(e,t)=>{let i=t.dims.length,n=io("rc",i),o=n.slice(-2),a=bt(i),s=Ln(),u=0===t.dims.length?"":NS(i,n),l=i<=1?"rc":`vec2(${o.join(",")})`,d=ue(e.session.backend.glContext.version),p=`
    ${s}
    void main() {
      ${a} rc = getOutputCoords();

       // Sample the texture with the coords to get the rgba channel value.
       vec4 packedInput = getA(${u});

       ${d.output} = vec4(getChannel(packedInput, ${l}), 0, 0, 0);
     }
   `;return{...Nh,hasMain:!0,output:{dims:t.dims,type:t.type,textureType:0},shaderSource:p}},Lh=(e,t)=>({...Nh,get:()=>kS(e,t)})}),ko=k(()=>{"use strict";Ct(),zi=class{constructor(e,t=1){if(1===t)this.internalFormat=e.R32F,this.format=e.RED,this.textureType=e.FLOAT,this.channelSize=t;else if(4===t)this.internalFormat=e.RGBA32F,this.format=e.RGBA,this.textureType=e.FLOAT,this.channelSize=t;else throw Error(`Invalid number of channels: ${t}`)}encode(e,t){let i,n;return e.constructor!==Float32Array&&(Fe.warning("Encoder","data was not of type Float32; creating new Float32Array"),n=new Float32Array(e)),t*this.channelSize>e.length?(Fe.warning("Encoder","Source data too small. Allocating larger array"),n=e,i=this.allocate(t*this.channelSize),n.forEach((e,t)=>i[t]=e)):i=n=e,i}allocate(e){return new Float32Array(4*e)}decode(e,t){return 1===this.channelSize?e.filter((e,t)=>t%4==0).subarray(0,t):e.subarray(0,t)}},Do=class{constructor(e,t=1,i){if(1!==t&&4!==t)throw Error(`Invalid number of channels: ${t}`);this.internalFormat=e.RGBA,this.format=e.RGBA,this.channelSize=t,this.textureType=i||e.FLOAT}encode(e,t){let i=e;return 1===this.channelSize&&(Fe.verbose("Encoder","Exploding into a larger array"),i=this.allocate(t),e.forEach((e,t)=>i[4*t]=e)),i}allocate(e){return new Float32Array(4*e)}decode(e,t){return 1===this.channelSize?e.filter((e,t)=>t%4==0).subarray(0,t):e.subarray(0,t)}},Mi=class{constructor(e,t=1){if(this.channelSize=4,1===t)this.internalFormat=e.ALPHA,this.format=e.ALPHA,this.textureType=e.UNSIGNED_BYTE,this.channelSize=t;else if(4===t)this.internalFormat=e.RGBA,this.format=e.RGBA,this.textureType=e.UNSIGNED_BYTE,this.channelSize=t;else throw Error(`Invalid number of channels: ${t}`)}encode(e,t){return new Uint8Array(e.buffer,e.byteOffset,e.byteLength)}allocate(e){return new Uint8Array(e*this.channelSize)}decode(e,t){if(e instanceof Uint8Array)return e.subarray(0,t);throw Error(`Invalid array type: ${e.constructor}`)}}}),Mh=k(()=>{"use strict";Me(),Ae(),No=(e,t,i)=>{let n=0===i||1===i?1:4,o=2===i,a=1===i||2===i,s=4===i?t.length-1:void 0,u=4===i?t.map((e,i)=>i===t.length-1?4*e:e):void 0;return Tl(e,t,n,u,{isPacked:o,reverseWH:a,breakAxis:s})},zh=(e,t,i)=>{let n=No(e,t,i);return[n.width,n.height]},Tl=(e,t,i=1,n,o)=>{let a=!!(o&&o.isPacked),[s,u]=e.computeTextureWH(a&&n||t,o),l=t.length,d=t.slice(0);if(0===l&&(d=[1]),1===i)n=t;else if(a){if(4!==i)throw Error("a packed texture must be 4-channel");n=t,l>0&&(d[l-1]=Math.ceil(d[l-1]/2)),l>1&&(d[l-2]=Math.ceil(d[l-2]/2))}else if(!n)throw Error("Unpacked shape is needed when using channels > 1");return{width:s,height:u,channels:i,isPacked:a,shape:d,strides:ne.computeStrides(d),unpackedShape:n,reversedWH:o&&o.reverseWH}}}),Fh=k(()=>{"use strict";Ct(),zr(),Me(),Ph(),Dh(),kh(),Rh(),ko(),Mh(),Ae(),RS=(e,t)=>{let i=t.map(e=>`${e.unpackedShape.join(",")};${e.width}x${e.height}`).join("_"),n=e.name;return e.cacheHint&&(n+="["+e.cacheHint+"]"),n+=":"+i},Bi=class{constructor(e){this.session=e,this.packedTextureDataCache=new Map,this.unpackedTextureDataCache=new Map}calculateTextureWidthAndHeight(e,t){return zh(this.session.layoutStrategy,e,t)}executeProgram(e,t){if(t.length<e.inputNames.length)throw Error(`Input size mustn't be less than ${e.inputNames.length}.`);if(e.inputNames.length!==e.inputTypes.length)throw Error("input names size does not match input types");let i=[];for(let n=0;n<e.inputNames.length;++n)i[n]=this.getOrCreateTextureData(t[n],e.inputTypes[n]);let n=RS(e,i),o=this.session.programManager.getArtifact(n),a=o?o.programInfo:"function"==typeof e.get?e.get():e,s=No(this.session.layoutStrategy,a.output.dims,a.output.textureType),u=this.createTextureData(s,a.output.type);return o||(o=this.session.programManager.build(a,i,u),this.session.programManager.setArtifact(n,o)),this.runProgram(o,i,u),u}run(e,t){return this.executeProgram(e,t).tensor}runProgram(e,t,i){for(let i=0;i<t.length;++i)if(!!t[i].isPacked!=(2===e.programInfo.inputTypes[i]))throw Error(`input[${i}] property packed inconsistent`);if(!!i.isPacked!=(2===e.programInfo.output.textureType))throw Error("output property packed inconsistent");this.session.programManager.run(e,t,i)}getOrCreateTextureData(e,t){let i=this.getTextureData(e.dataId,2===t);if(!i&&(i=this.getTextureData(e.dataId,2!==t)))return 2===t?this.pack(i):this.unpack(i);if(!i){let n=No(this.session.layoutStrategy,e.dims,t);if(4===t){let i=e.dims;if(4===i.length){let n=[i[0],Math.ceil(i[1]*i[2]*i[3]/4)],o=No(this.session.layoutStrategy,n,t),a=e.numberData;if(i[1]*i[2]*i[3]%4!=0){let t=i[0],n=i[1]*i[2]*i[3],o=4*Math.ceil(n/4);a=new Float32Array(t*o);for(let i=0;i<t;++i){let t=i*n,s=i*o+i%1*n;a.set(e.numberData.subarray(t,t+n),s)}}return this.createTextureData(o,e.type,a,e,1)}}if(2===t){let t=Tl(this.session.layoutStrategy,e.dims,1,[],{reverseWH:!0}),n=this.createTextureData(t,e.type,e.numberData,e,1);i=this.pack(n)}else i=this.createTextureData(n,e.type,e.numberData,e,1)}return i}createTextureDataFromLayoutBindTensor(e,t,i,n){return this.createTextureData(e,t,i,n,1)}createTextureData(e,t,i,n,o){Fe.verbose("InferenceHandler",`Creating TextureData: layout:[${JSON.stringify(e)}]`);let a=this.session.textureManager.createTextureFromLayout(t,e,i,o);return this.createTextureDataFromTexture(e,t,a,n)}reshapeUnpacked(e,t){let i=this.getOrCreateTextureData(e,0),n={channels:i.channels,height:i.height,width:i.width,shape:0!==t.length?t:[1],strides:ne.computeStrides(t),unpackedShape:t};return this.createTextureDataFromTexture(n,e.type,i.texture).tensor}reshapePacked(e,t){let i=this.getOrCreateTextureData(e,2);if(Ch(e.dims,t)){let n={channels:i.channels,height:i.height,width:i.width,shape:0!==t.length?t:[1],strides:ne.computeStrides(t),unpackedShape:t,isPacked:!0};return this.createTextureDataFromTexture(n,e.type,i.texture).tensor}let n=wl(e.dims),o=wl(t),a=this.reshapePacked(e,n),s=this.run(Eh(this,a,o),[a]);return this.reshapePacked(s,t)}cast(e,t){let i=this.getOrCreateTextureData(e,0);return this.createTextureDataFromTexture(i,t,i.texture).tensor}createTextureDataFromTexture(e,t,i,n,o){let a={...e,tensor:n||new nt(e.unpackedShape,t,e=>this.readTexture(a),async e=>this.readTextureAsync(a),void 0,o),texture:i};return this.setTextureData(a.tensor.dataId,a,e.isPacked),a}getTextureData(e,t=!1){return this.session.isInitializer(e)?this.session.getTextureData(e,t):t?this.packedTextureDataCache.get(e):this.unpackedTextureDataCache.get(e)}setTextureData(e,t,i=!1){this.session.isInitializer(e)?this.session.setTextureData(e,t,i):(i?this.packedTextureDataCache:this.unpackedTextureDataCache).set(e,t)}isTextureLayoutCached(e,t=!1){return!!this.getTextureData(e.dataId,t)}dispose(){this.session.textureManager.clearActiveTextures(),this.packedTextureDataCache.forEach(e=>this.session.textureManager.releaseTexture(e)),this.packedTextureDataCache=new Map,this.unpackedTextureDataCache.forEach(e=>this.session.textureManager.releaseTexture(e)),this.unpackedTextureDataCache=new Map}readTexture(e){return e.isPacked?this.readTexture(this.unpack(e)):this.session.backend.glContext.isFloat32DownloadSupported?this.session.textureManager.readTexture(e,e.tensor.type,e.channels):this.session.textureManager.readUint8TextureAsFloat(xl(this,e))}async readTextureAsync(e){return e.isPacked?this.readTextureAsync(this.unpack(e)):this.session.backend.glContext.isFloat32DownloadSupported?this.session.textureManager.readTextureAsync(e,e.tensor.type,e.channels):this.session.textureManager.readUint8TextureAsFloat(xl(this,e))}pack(e){return this.executeProgram(Oh(this,e.tensor),[e.tensor])}unpack(e){return this.executeProgram(Lh(this,e.tensor),[e.tensor])}}}),lt=k(()=>{"use strict";Il=class{constructor(e){Object.assign(this,e)}get cacheKey(){return this.key||(this.key=Object.getOwnPropertyNames(this).sort().map(e=>`${this[e]}`).join(";")),this.key}},xe=e=>new Il(e)}),Wh=k(()=>{"use strict";lt(),Ke(),Ae(),Vh={name:"BatchNormalization",inputNames:["A","Scale","B","Mean","Variance"],inputTypes:[0,0,0,0,0]},Gh=(e,t,i)=>(MS(t),[e.run({...Vh,cacheHint:i.cacheKey,get:()=>zS(e,t,i)},t)]),Uh=e=>{let t=e.attributes.getFloat("epsilon",1e-5),i=e.attributes.getFloat("momentum",.9),n=e.attributes.getInt("spatial",1);return xe({epsilon:t,momentum:i,spatial:n})},zS=(e,t,i)=>{let n=ue(e.session.backend.glContext.version),o=t[0].dims.length,[a,s]=e.calculateTextureWidthAndHeight(t[1].dims,0),u=`
  float process(int[${o}] indices) {
    vec2 position = offsetToCoords(indices[1], ${a}, ${s});
    float scale = getColorAsFloat(${n.texture2D}(Scale, position));
    float mean = getColorAsFloat(${n.texture2D}(Mean, position));
    float variance = getColorAsFloat(${n.texture2D}(Variance, position));
    float b = getColorAsFloat(${n.texture2D}(B, position));

    return scale * ( (_A(indices) - mean) / sqrt(variance + float(${i.epsilon})) ) + b;
  }`;return{...Vh,output:{dims:t[0].dims,type:t[0].type,textureType:0},shaderSource:u}},MS=e=>{if(!e||5!==e.length)throw Error("BatchNormalization requires 5 inputs.");let t=e[0],i=e[1],n=e[2],o=e[3],a=e[4];if(t.dims.length<3||1!==i.dims.length||1!==n.dims.length||1!==o.dims.length||1!==a.dims.length||i.dims[0]!==t.dims[1]||n.dims[0]!==t.dims[1]||o.dims[0]!==t.dims[1]||a.dims[0]!==t.dims[1])throw Error("invalid input shape.");if("float32"!==t.type&&"float64"!==t.type||"float32"!==i.type&&"float64"!==i.type||"float32"!==n.type&&"float64"!==n.type||"float32"!==o.type&&"float64"!==o.type||"float32"!==a.type&&"float64"!==a.type)throw Error("invalid input tensor types.")}}),Jn=k(()=>{"use strict";Fi=class{constructor(e,t,i,n){this.glContext=e,this.programInfo=t,this.inputTextureLayouts=i,this.outputTextureLayout=n}},zt=class{constructor(e){this.context=e}},Y=class{constructor(e,t){this.routineBody=e,this.dependencies=t}},Lo=class{constructor(e,t,i){this.name=e,i?this.dependencies=i:this.dependencies=[],t&&(this.routineBody=t)}addDependency(e){e&&this.dependencies.push(e)}},Vi=class{static returnOrderedNodes(e){if(!e||0===e.length)return[];if(1===e.length)return e;let t=new Set,i=new Set,n=[];return this.createOrderedNodes(e,t,i,n),n}static createOrderedNodes(e,t,i,n){for(let o=0;o<e.length;++o)this.dfsTraverse(e[o],t,i,n)}static dfsTraverse(e,t,i,n){if(!e||i.has(e.name))return;if(t.has(e.name))throw Error("Cyclic dependency detected. Can't topologically sort routines needed for shader.");t.add(e.name);let o=e.dependencies;if(o&&o.length>0)for(let e=0;e<o.length;++e)this.dfsTraverse(o[e],t,i,n);n.push(e),i.add(e.name),t.delete(e.name)}}});function FS(){let e="add_";return{body:`
  float ${e}(float a, float b) {
    return a + b;
  }
  vec4 ${e}(vec4 v1, vec4 v2) {
    return v1 + v2;
  }
  `,name:e,type:0}}function VS(){let e="div_";return{body:`
  float ${e}(float a, float b) {
    return a / b;
  }
  vec4 ${e}(vec4 v1, vec4 v2) {
    return v1 / v2;
  }
  `,name:e,type:0}}function GS(){let e="mul_";return{body:`
  float ${e}(float a, float b) {
    return a * b;
  }
  vec4 ${e}(vec4 v1, vec4 v2) {
    return v1 * v2;
  }
  `,name:e,type:0}}function US(){let e="sub_";return{body:`
  float ${e}(float a, float b) {
    return a - b;
  }
  vec4 ${e}(vec4 v1, vec4 v2) {
    return v1 - v2;
  }
  `,name:e,type:0}}function WS(){let e="equal_";return{body:`
  float ${e}(float a, float b) {
    return float(a == b);
  }
  vec4 ${e}(vec4 v1, vec4 v2) {
    return vec4(equal(v1, v2));
  }
  `,name:e,type:0}}function HS(){let e="greater_";return{body:`
  float ${e}(float a, float b) {
    return float(a > b);
  }
  vec4 ${e}(vec4 v1, vec4 v2) {
    return vec4( v1.r > v2.r ,
      v1.g > v2.g,
      v1.b > v2.b,
      v1.a > v2.a );
  }
  `,name:e,type:0}}function jS(){let e="less_";return{body:`
  float ${e}(float a, float b) {
    return float(a < b);
  }
  vec4 ${e}(vec4 v1, vec4 v2) {
    return vec4( v1.r < v2.r ,
                v1.g < v2.g,
                v1.b < v2.b,
                v1.a < v2.a );
  }
  `,name:e,type:0}}function qS(){let e="and_";return{body:`
  float ${e}(float a, float b) {
    return float( bool(a) && bool(b) );
  }
  vec4 ${e}(vec4 v1, vec4 v2) {
    bvec4 b1 = bvec4(v1);
    bvec4 b2 = bvec4(v2);
    return vec4( b1.r && b2.r ,
                b1.g && b2.g,
                b1.b && b2.b,
                b1.a && b2.a );
  }
  `,name:e,type:0}}function KS(){let e="or_";return{body:`
  float ${e}(float a, float b) {
    return float( bool(a) || bool(b) );
  }
  vec4 ${e}(vec4 v1, vec4 v2) {
    bvec4 b1 = bvec4(v1);
    bvec4 b2 = bvec4(v2);
    return vec4( b1.r || b2.r ,
                b1.g || b2.g,
                b1.b || b2.b,
                b1.a || b2.a );
  }
  `,name:e,type:0}}function XS(){let e="xor_";return{body:`
  float ${e}(float a, float b) {
    return float( bool(a) ^^ bool(b) );
  }
  vec4 ${e}(vec4 v1, vec4 v2) {
    bvec4 b1 = bvec4(v1);
    bvec4 b2 = bvec4(v2);
    return vec4( b1.r ^^ b2.r ,
                b1.g ^^ b2.g,
                b1.b ^^ b2.b,
                b1.a ^^ b2.a );
  }
  `,name:e,type:0}}function ZS(){return YS("pow")}function JS(){let e="prelu_";return{body:`
  float ${e}(float a, float b) {
    return a < 0.0 ? a * b: a;
  }
  vec4 ${e}(vec4 v1, vec4 v2) {
    return vec4(
      v1.r < 0.0 ? v1.r * v2.r: v1.r,
      v1.g < 0.0 ? v1.g * v2.g: v1.g,
      v1.b < 0.0 ? v1.b * v2.b: v1.b,
      v1.a < 0.0 ? v1.a * v2.a: v1.a
      );
  }
  `,name:e,type:0}}function YS(e){let t=`${e}_`;return{body:`
  float ${t}(float a, float b) {
    return ${e}(a, b);
  }
  vec4 ${t}(vec4 v1, vec4 v2) {
    return ${e}(v1, v2);
  }
  `,name:t,type:0}}var Mt,QS,Hh,jh,qh,Kh,Xh,Zh,Jh,Yh,Qh,em,tm,nm,om,im,t$,n$,r$,sm,Gi,lm,o$,i$,a$,cm,s$,u$,l$,dm,c$,rm=k(()=>{"use strict";Me(),Jn(),Ke(),Ae(),Mt=(e,t,i,n=t[0].type,o)=>{let a=2*!!e.session.pack;return{name:i.name,inputNames:["A","B"],inputTypes:[a,a],cacheHint:o,get:()=>QS(e,t,i,n)}},QS=(e,t,i,n=t[0].type)=>{let o=2*!!e.session.pack,a=!ne.areEqual(t[0].dims,t[1].dims),s=t[0].dims,u=e.session.pack;if(a){let a=gt.calcShape(t[0].dims,t[1].dims,!1);if(!a)throw Error("Can't perform binary op on the given tensors");let l=(s=a).length,d=0!==t[0].dims.length?t[0].dims.length:1,p=0!==t[1].dims.length?t[1].dims.length:1,c=0!==t[0].dims.length?"bcastIndices_A(indices, aindices);":"aindices[0] = 0;",h=0!==t[1].dims.length?"bcastIndices_B(indices, bindices);":"bindices[0] = 0;",f=ue(e.session.backend.glContext.version),m=u?`
      ${i.body}
      void main() {
        vec4 a = getAAtOutCoords();
        vec4 b = getBAtOutCoords();
        vec4 result = ${i.name}(a, b);
        ${f.output} = result;
      }`:`
      ${i.body}
      float process(int indices[${l}]) {
        int aindices[${d}];
        int bindices[${p}];
        ${c}
        ${h}
        return ${i.name}(_A(aindices), _B(bindices));
      }`;return{name:i.name,inputNames:["A","B"],inputTypes:[o,o],output:{dims:s,type:n,textureType:o},shaderSource:m,hasMain:u}}let l=ue(e.session.backend.glContext.version),d=`
    ${i.body}
    void main() {
      vec4 v1 = ${l.texture2D}(A, TexCoords);
      vec4 v2 = ${l.texture2D}(B, TexCoords);
      vec4 result = ${i.name}(v1, v2);
      ${l.output} = result;
    }
    `;return{name:i.name,inputNames:["A","B"],inputTypes:[o,o],output:{dims:t[0].dims,type:n,textureType:o},shaderSource:d,hasMain:!0}},Hh=(e,t)=>[e.run(Mt(e,t,FS()),t)],jh=(e,t)=>[e.run(Mt(e,t,qS(),"bool"),t)],qh=(e,t)=>[e.run(Mt(e,t,VS()),t)],Kh=(e,t)=>[e.run(Mt(e,t,WS(),"bool"),t)],Xh=(e,t)=>[e.run(Mt(e,t,HS(),"bool"),t)],Zh=(e,t)=>[e.run(Mt(e,t,jS(),"bool"),t)],Jh=(e,t)=>[e.run(Mt(e,t,GS()),t)],Yh=(e,t)=>[e.run(Mt(e,t,KS(),"bool"),t)],Qh=(e,t)=>[e.run(Mt(e,t,ZS()),t)],em=(e,t)=>[e.run(Mt(e,t,JS()),t)],tm=(e,t)=>[e.run(Mt(e,t,US()),t)],nm=(e,t)=>[e.run(Mt(e,t,XS(),"bool"),t)]}),am=k(()=>{"use strict";Me(),om=(e,t,i)=>(t$(t),[e.cast(t[0],i)]),im=e=>ft.tensorDataTypeFromProto(e.attributes.getInt("to")),t$=e=>{if(!e||1!==e.length)throw Error("Cast requires 1 input.");if("string"===e[0].type)throw Error("Invalid input type.")}}),um=k(()=>{"use strict";Ke(),Ae(),Nn(),Mr(),n$=(e,t)=>({name:"Concat (packed)",inputNames:Array.from({length:e},(e,t)=>`X${t}`),inputTypes:Array(e).fill(2),cacheHint:t}),r$=(e,t,i,n)=>{let o=i[0].dims.slice();if(n>=o.length||n<-1*o.length)throw Error("axis specified for concat doesn't match input dimensionality");n<0&&(n=o.length+n);let a=o.slice(0);for(let e=1;e<i.length;e++){let t=i[e].dims.slice();for(let e=0;e<o.length;e++)if(e===n)a[n]+=t[e];else if(o[e]!==t[e])throw Error("non concat dimensions must match")}let s=a.length,u=io("coords",s),l=bt(s),d=Ln(),p=i.map(e=>e.dims),c=qt(s),h=Array(p.length-1);h[0]=p[0][n];for(let e=1;e<h.length;e++)h[e]=h[e-1]+p[e][n];let f=c[n],m=c.slice(-2),g=c.join(),b=`if (${f} < ${h[0]}) {
        return getChannel(
            getX0(${g}), vec2(${m.join()}));
        }`;for(let e=1;e<h.length;e++){let t=h[e-1];b+=`
            if (${f} < ${h[e]}  && ${f} >= ${h[e-1]}) {
              return getChannel(
                getX${e}(${Gi(c,f,t)}),
                vec2(${Gi(m,f,t)}));
            }`}let y=h.length,_=h[h.length-1];b+=`
            return getChannel(
              getX${y}(${Gi(c,f,_)}),
              vec2(${Gi(m,f,_)}));`;let v=ue(e.session.backend.glContext.version),x=`
          ${d}
          float getValue(${c.map(e=>"int "+e)}) {
            ${b}
          }

          void main() {
            ${l} coords = getOutputCoords();
            int lastDim = coords.${c[s-1]};
            coords.${c[s-1]} = coords.${c[s-2]};
            coords.${c[s-2]} = lastDim;

            vec4 result = vec4(getValue(${u}), 0., 0., 0.);

            ${u[s-1]} = ${u[s-1]} + 1;
            if (${u[s-1]} < ${a[s-1]}) {
              result.g = getValue(${u});
            }

            ${u[s-2]} = ${u[s-2]} + 1;
            if (${u[s-2]} < ${a[s-2]}) {
              result.a = getValue(${u});
            }

            ${u[s-1]} = ${u[s-1]} - 1;
            if (${u[s-2]} < ${a[s-2]} &&
                ${u[s-1]} < ${a[s-1]}) {
              result.b = getValue(${u});
            }
            ${v.output} = result;
          }
        `;return{...t,output:{dims:a,type:i[0].type,textureType:2},shaderSource:x,hasMain:!0}},sm=(e,t,i)=>{let n=n$(t.length,i.cacheKey);return{...n,get:()=>r$(e,n,t,i.axis)}},Gi=(e,t,i)=>{let n=e.indexOf(t);return e.map((e,t)=>t===n?`${e} - ${i}`:e).join()}}),pm=k(()=>{"use strict";lt(),Ae(),um(),lm=(e,t,i)=>(c$(t),e.session.pack&&t[0].dims.length>1?[e.run(sm(e,t,i),t)]:[e.run(a$(e,t,i),t)]),o$=(e,t)=>({name:"Concat",inputNames:Array.from({length:e},(e,t)=>`X${t}`),inputTypes:Array(e).fill(0),cacheHint:t}),i$=(e,t,i,n)=>{let o=i[0].dims.slice();if(n>=o.length||n<-1*o.length)throw Error("axis specified for concat doesn't match input dimensionality");n<0&&(n=o.length+n);let a=o.slice(0);for(let e=1;e<i.length;e++){let t=i[e].dims.slice();for(let e=0;e<o.length;e++)if(e===n)a[n]+=t[e];else if(o[e]!==t[e])throw Error("non concat dimensions must match")}let s=a.length,u=Array(i.length),l=0;for(let e=0;e<u.length;++e)l+=i[e].dims[n],u[e]=l;let d="";d=i.length<5?cm(u):s$(u);let p=u$(i.length,s),c=l$(u),h=`
        ${p}
        ${c}
        ${d}
        float process(int indices[${s}]) {
          int textureIndex = getTextureWhereDataResides (indices[${n}]);

          if(textureIndex != 0) {
            indices[${n}] = indices[${n}] - int(getSizeInConcatAxisValueFromIndex(textureIndex-int(1)));
          }

          return fetchDataFromCorrectTexture(textureIndex, indices);
        }`;return{...t,output:{dims:a,type:i[0].type,textureType:0},shaderSource:h}},a$=(e,t,i)=>{let n=o$(t.length,i.cacheKey);return{...n,get:()=>i$(e,n,t,i.axis)}},cm=e=>`int getTextureWhereDataResides(int index) {
      ${e.map((e,t)=>`if(index<${e}) {return ${t};}
`).join("")}
    }`,s$=e=>cm(e),u$=(e,t)=>{let i=[`float fetchDataFromCorrectTexture(int textureIndex, int indices[${t}]) {`];for(let t=0;t<e;++t)0===t?i.push(`	if (textureIndex == ${t}) { return _X${t}(indices); }`):t===e-1?i.push(`	else { return _X${t}(indices); }`):i.push(`	else if (textureIndex == ${t}) { return _X${t}(indices); }`);return i.push("	}"),i.join(`
`)},l$=e=>{let t=["int getSizeInConcatAxisValueFromIndex(int index) {"];for(let i=0;i<e.length;++i)0===i?t.push(`	if (index == ${i}) { return ${e[i]}; }`):i===e.length-1?t.push(`	else { return ${e[i]}; }`):t.push(`	else if (index == ${i}) { return ${e[i]}; }`);return t.push("	}"),t.join(`
`)},dm=e=>xe({axis:e.attributes.getInt("axis")}),c$=e=>{if(!e||e.length<1)throw Error("too few inputs");let t=e[0].type,i=e[0].dims.length;if("string"===t)throw Error("string tensor is not supported yet");for(let n of e){if(n.type!==t)throw Error("input tensors should be one type");if(n.dims.length!==i)throw Error("input tensors should have the same shape")}}});function d$(){return Bt("abs")}function p$(){return Bt("acos")}function f$(){return Bt("asin")}function h$(){return Bt("atan")}function m$(){return Bt("ceil")}function g$(){return Bt("cos")}function b$(e){let t="elu";return{body:`
  const float alpha = float(${e});

  float ${t}_(float a) {
    return a >= 0.0 ? a: (exp(a) - 1.0) * alpha;
  }
  vec4 ${t}_(vec4 v) {
    return vec4(${t}_(v.x), ${t}_(v.y), ${t}_(v.z), ${t}_(v.w));
  }
  `,name:t,type:0}}function y$(){return Bt("exp")}function _$(){return Bt("floor")}function Sl(e,t){let i="clip";return{body:`
  const float min = float(${e});
  const float max = float(${t});

  float ${i}_(float a) {
    return clamp(a, min, max);
  }
  vec4 ${i}_(vec4 v) {
    return clamp(v, min, max);
  }
  `,name:i,type:0}}function v$(){let e="indentity";return{body:`
  float ${e}_(float a) {
    return a;
  }
  vec4 ${e}_(vec4 v) {
    return v;
  }
  `,name:e,type:0}}function w$(e){let t="leakyRelu";return{body:`
  const float alpha = float(${e});

  float ${t}_(float a) {
    return a < 0.0 ? a * alpha : a;
  }
  vec4 ${t}_(vec4 v) {
    return vec4(${t}_(v.x), ${t}_(v.y), ${t}_(v.z), ${t}_(v.w));
  }
  `,name:t,type:0}}function x$(){return Bt("log")}function T$(){let e="neg";return{body:`
  float ${e}_(float a) {
    return -a;
  }
  vec4 ${e}_(vec4 v) {
    return -v;
  }
  `,name:e,type:0}}function I$(){let e="not";return{body:`
  float ${e}_(float a) {
    return float( ! bool(a) );
  }
  bool ${e}_(bool a) {
    return !a;
  }
  vec4 ${e}_(vec4 v) {
    return vec4(!bool(v.x), !bool(v.y), !bool(v.z), !bool(v.w));
  }
  bvec4 ${e}_(bvec4 v) {
    return bvec4(!v.x, !v.y, !v.z, !v.w);
  }
  `,name:e,type:0}}function S$(){return Bt("sin")}function $l(){let e="relu";return{body:`
  float ${e}_(float a) {
    return max( a, 0.0 );
  }
  vec4 ${e}_(vec4 v) {
    return max( v, 0.0 );
  }
  `,name:e,type:0}}function Al(){let e="sigmoid";return{body:`
  float ${e}_(float a) {
    return 1.0 / (1.0 + exp(-a));
  }
  vec4 ${e}_(vec4 v) {
    return 1.0 / (1.0 + exp(-v));
  }
  `,name:e,type:0}}function $$(){return Bt("sqrt")}function A$(){return Bt("tan")}function O$(){let e="tanh";return{body:`
  float ${e}_(float a) {
    a = clamp(a, -10., 10.);
    a = exp(2.*a);
    return (a - 1.) / (a + 1.);
  }
  vec4 ${e}_(vec4 v) {
    v = clamp(v, -10., 10.);
    v = exp(2.*v);
    return (v - 1.) / (v + 1.);
  }
  `,name:e,type:0}}function Bt(e){return{body:`
  float ${e}_(float a) {
    return ${e}(a);
  }
  vec4 ${e}_(vec4 v) {
    return ${e}(v);
  }
  `,name:e,type:0}}var P$,et,fm,hm,mm,gm,Ol,bm,ym,E$,_m,vm,wm,xm,Tm,Im,Pl,Sm,$m,Am,Om,Pm,Em,Cm,Dm,km,Nm,Lm,El=k(()=>{"use strict";lt(),Me(),Jn(),Ke(),Ae(),P$=(e,t,i,n)=>{let o=2*!!e.session.pack,a=ue(e.session.backend.glContext.version);return{...t,output:{dims:i.dims,type:i.type,textureType:o},shaderSource:`
     ${n.body}
     void main() {
       vec4 v = ${a.texture2D}(A, TexCoords);
       v = ${n.name}_(v);
       ${a.output} = v;
     }
     `,hasMain:!0}},et=(e,t,i,n)=>{let o=2*!!e.session.pack,a={name:i.name,inputTypes:[o],inputNames:["A"],cacheHint:n};return{...a,get:()=>P$(e,a,t,i)}},fm=(e,t)=>[e.run(et(e,t[0],d$()),t)],hm=(e,t)=>[e.run(et(e,t[0],p$()),t)],mm=(e,t)=>[e.run(et(e,t[0],f$()),t)],gm=(e,t)=>[e.run(et(e,t[0],h$()),t)],Ol=(e,t,i)=>[e.run(et(e,t[0],Sl(i.min,i.max),i.cacheKey),t)],bm=e=>xe({min:e.attributes.getFloat("min",Lr),max:e.attributes.getFloat("max",Rr)}),ym=(e,t)=>{let i=E$(e,t);return Ol(e,[t[0]],i)},E$=(e,t)=>{if(t.length>=3&&(!e.session.isInitializer(t[1].dataId)||!e.session.isInitializer(t[2].dataId)))throw Error("dynamic clip attributes are not allowed");let i=t.length>=3?t[1].numberData[0]:Lr,n=t.length>=3?t[2].numberData[0]:Rr;return xe({min:i,max:n})},_m=(e,t)=>[e.run(et(e,t[0],m$()),t)],vm=(e,t)=>[e.run(et(e,t[0],g$()),t)],wm=(e,t,i)=>[e.run(et(e,t[0],b$(i.alpha),i.cacheKey),t)],xm=e=>xe({alpha:e.attributes.getFloat("alpha",1)}),Tm=(e,t)=>[e.run(et(e,t[0],y$()),t)],Im=(e,t)=>[e.run(et(e,t[0],_$()),t)],Pl=(e,t)=>[e.run(et(e,t[0],v$()),t)],Sm=(e,t,i)=>[e.run(et(e,t[0],w$(i.alpha),i.cacheKey),t)],$m=e=>xe({alpha:e.attributes.getFloat("alpha",.01)}),Am=(e,t)=>[e.run(et(e,t[0],x$()),t)],Om=(e,t)=>[e.run(et(e,t[0],T$()),t)],Pm=(e,t)=>[e.run(et(e,t[0],I$()),t)],Em=(e,t)=>[e.run(et(e,t[0],$l()),t)],Cm=(e,t)=>[e.run(et(e,t[0],Al()),t)],Dm=(e,t)=>[e.run(et(e,t[0],S$()),t)],km=(e,t)=>[e.run(et(e,t[0],$$()),t)],Nm=(e,t)=>[e.run(et(e,t[0],A$()),t)],Lm=(e,t)=>[e.run(et(e,t[0],O$()),t)]});function Rn(e){let t;switch(e.activation){case"Relu":t=$l();break;case"Sigmoid":t=Al();break;case"Clip":t=Sl(e.clipMin,e.clipMax);break;default:return{activationFunction:"",applyActivation:""}}let i=t.name;return{activationFunction:t.body,applyActivation:`value = ${i}_(value);`}}var ao,D$,k$,Rm,N$,L$,Mm,Br=k(()=>{"use strict";Me(),El(),ao=e=>{let t=e.getString("activation","");if("Clip"===t){let[i,n]=e.getFloats("activation_params",[Lr,Rr]);return{activation:t,clipMax:n,clipMin:i,activationCacheKey:`${t}:${i},${n}`}}return{activation:t,activationCacheKey:t}}}),zm=k(()=>{"use strict";Ct(),Ke(),Ae(),Ui(),Br(),D$=(e,t)=>({name:"GroupedConv",inputNames:e?["X","W","Bias"]:["X","W"],inputTypes:e?[0,0,0]:[0,0],cacheHint:t}),k$=(e,t,i,n)=>{let o=t.length>2?"value += getBias(output_channel);":"",a=t[0].dims.slice(),s=t[1].dims.slice(),u=s[0]/n.group;Fe.verbose("GroupedConv",`autpPad:${n.autoPad}, dilations:${n.dilations}, group:${n.group}, kernelShape:${n.kernelShape}, pads:${n.pads}, strides:${n.strides}`);let l=so(a,s,n.dilations,n.pads,n.strides),d=ue(e.session.backend.glContext.version),{activationFunction:p,applyActivation:c}=Rn(n),h=`
  const ivec2 strides = ivec2(${n.strides[0]}, ${n.strides[1]});
  const ivec2 pads = ivec2(${n.pads[0]}, ${n.pads[1]});
  ${p}
  void main() {
    ivec4 coords = getOutputCoords();
    int batch = coords.x;
    int output_channel = coords.y;
    ivec2 xRCCorner = coords.zw * strides - pads;
    int group_id = output_channel / ${u};

    float value = 0.0;
    for (int wInChannel = 0; wInChannel < ${s[1]}; wInChannel++) {
      int input_channel = group_id * ${s[1]} + wInChannel;
      for (int wHeight = 0; wHeight < ${s[2]}; wHeight++) {
        int xHeight = xRCCorner.x + wHeight * ${n.dilations[0]};

        if (xHeight < 0 || xHeight >= ${a[2]}) {
          continue;
        }

        for (int wWidth = 0; wWidth < ${s[3]}; wWidth++) {
          int xWidth = xRCCorner.y + wWidth * ${n.dilations[1]};
          if (xWidth < 0 || xWidth >= ${a[3]}) {
            continue;
          }

          float xVal = getX(batch, input_channel, xWidth, xHeight);
          float wVal = getW(output_channel, wInChannel, wWidth, wHeight);
          value += xVal*wVal;
        }
      }
    }
    ${o}
    ${c}
    ${d.output} = vec4(value, .0, .0, .0);
  }
`;return{...i,output:{dims:l,type:t[0].type,textureType:0},shaderSource:h,hasMain:!0}},Rm=(e,t,i)=>{let n=D$(t.length>2,i.cacheKey);return{...n,get:()=>k$(e,t,n,i)}}}),Bm=k(()=>{"use strict";Ke(),Ae(),Mr(),N$=e=>({name:"Im2Col (packed)",inputNames:["A"],inputTypes:[2],cacheHint:e}),L$=(e,t,i,n,o,a)=>{let s=i.dims,u=n.dims,l=2,d=3,p=o.length,c=[u[1]*u[2]*u[3],o[2]*o[3]],h=u[2]*u[3],f=Ln(),m=ue(e.session.backend.glContext.version),g="";for(let e=0;e<=1;e++)for(let t=0;t<=1;t++)g+=`
            blockIndex = rc.x + ${t};
            pos = rc.y + ${e};

            if(blockIndex < ${c[1]} && pos < ${c[0]}) {
              offsetY = int(blockIndex / (${o[p-1]})) * ${a.strides[0]} -
                ${a.pads[0]};
              d0 = offsetY + ${a.dilations[0]} * (imod(pos, ${h}) / ${u[2]});

              if(d0 < ${s[l]} && d0 >= 0) {
                offsetX = imod(blockIndex, ${o[p-1]}) * ${a.strides[1]} -
                  ${a.pads[1]};
                d1 = offsetX + ${a.dilations[1]} * imod(imod(pos, ${h}), ${u[2]});

                if(d1 < ${s[d]} && d1 >= 0) {

                  ch = int(float(pos)/ ${h}.);
                    innerDims = vec2(d0, d1);
                    result[${2*e+t}] = getChannel(
                      getA(0, ch, int(innerDims.x),
                      int(innerDims.y)), innerDims);
                }
              }
            }

          `;let b=`
      ${f}

      void main() {
        ivec2 rc = getOutputCoords();
          vec4 result = vec4(0.0);
          int blockIndex, pos, offsetY, d0, offsetX, d1, ch;
          vec2 innerDims;
          ${g}
          ${m.output} = result;
      }
            `;return{...t,output:{dims:c,type:i.type,textureType:2},shaderSource:b,hasMain:!0}},Mm=(e,t,i,n,o)=>{let a=N$(o.cacheKey);return{...a,get:()=>L$(e,a,t,i,n,o)}}});function z$(e,t,i){let n=t[0].dims,o=t[1].dims,a=gt.calcShape(n,o,!0);if(!a)throw Error("Can't use matmul on the given tensors");let s=bt(a.length),u=qt(),{activationFunction:l,applyActivation:d}=Rn(i),p=t.length>2,c=p?"value += getBiasForMatmul();":"",h=p?`${Dl(s,u,t[2].dims,a,!1)}`:"",f=a.length,m=n.length,g=o.length,b=n[n.length-1],y=`
    ${l}
    ${h}
    float process(int indices[${f}]) {
        int a[${m}];
        int b[${g}];
        bcastMatmulIndices_A(indices, a);
        bcastMatmulIndices_B(indices, b);

        float value;
        for (int k=0; k<${b}; ++k) {
            a[${m-1}] = k;
            b[${g-2}] = k;
            value += _A(a) * _B(b);
        }
        ${c}
        ${d}
        return value;
    }`;return{...e,output:{dims:a,type:t[0].type,textureType:0},shaderSource:y}}function Cl(e,t){let i=R$(e.length>2,t.activationCacheKey);return{...i,get:()=>z$(i,e,t)}}function Dl(e,t,i,n,o){let a="",s=i.length,u=n.length,l=u-s;a=u<2&&s>0?"coords":i.map((e,i)=>`coords.${t[i+l]}`).join(", ");let d=gt.getBroadcastDims(i,n).map(e=>`coords.${t[e+l]} = 0;`).join(`
`),p=1===ne.size(i),c="vec4(outputValue.xx, outputValue.yy)";return p&&(c="vec4(outputValue.x)"),o?`
vec4 getBiasForMatmul() {
  ${e} coords = getOutputCoords();
  ${d}
  vec4 outputValue = getBias(${a});
  return ${c};
}`:`
float getBiasForMatmul() {
  ${e} coords = getOutputCoords();
  ${d}
  return getBias(coords.x);
}`}var Fm,Vm,R$,M$,Wi=k(()=>{"use strict";Me(),Ae(),Nn(),Br(),kl(),Fm=(e,t,i)=>(M$(t),e.session.pack?[e.run(Hi(e,t,i),t)]:[e.run(Cl(t,i),t)]),Vm=e=>ao(e.attributes),R$=(e,t)=>({name:"MatMul",inputNames:e?["A","B","Bias"]:["A","B"],inputTypes:e?[0,0,0]:[0,0],cacheHint:t}),M$=e=>{if(!e||2!==e.length)throw Error("MatMul requires 2 inputs.");if(e[0].dims[e[0].dims.length-1]!==e[1].dims[e[1].dims.length-2])throw Error("shared dimension does not match.");if("float32"!==e[0].type&&"float64"!==e[0].type||"float32"!==e[1].type&&"float64"!==e[1].type)throw Error("inputs should be float type");if(e[0].type!==e[1].type)throw Error("inputs types should match")}});function V$(e,t,i,n){let o=[],a=[],s=i[0].dims,u=i[1].dims,l=s.length,d=u.length,p=n.length,c=p-l,h=p-d;(o=s.map((e,i)=>`coords.${t[i+c]}`))[l-1]="i*2",o.join(", "),(a=u.map((e,i)=>`coords.${t[i+h]}`))[d-2]="i*2",a.join(", ");let f=gt.getBroadcastDims(s,n),m=gt.getBroadcastDims(u,n),g=f.map(e=>`coords.${t[e+c]} = 0;`).join(`
`),b=m.map(e=>`coords.${t[e+h]} = 0;`).join(`
`),y=`int lastDim = coords.${t[p-1]};
  coords.${t[p-1]} = coords.${t[p-2]};
  coords.${t[p-2]} = lastDim;`;return`
vec4 getAAtOutCoordsMatmul(int i) {
  ${e} coords = getOutputCoords();
  ${y}
  ${g}
  vec4 outputValue = getA(${o});
  return outputValue;
}

vec4 getBAtOutCoordsMatmul(int i) {
  ${e} coords = getOutputCoords();
  ${y}
  ${b}
  vec4 outputValue = getB(${a});
  return outputValue;
}`}function G$(e,t){let i="";for(let n=0;n<t-2;n++)i+=`rc.${e[n]}, `;return i+`rc.${e[t-2]}, i*2`}function U$(e,t){let i="";for(let n=0;n<t-2;n++)i+=`rc.${e[n]}, `;return i+`i*2, rc.${e[t-1]}`}var B$,F$,Hi,Gm,W$,H$,Wm,Nl,j$,q$,Hm,so,Rl,K$,X$,Z$,J$,zl,Y$,Q$,eA,tA,qm,nA,rA,oA,iA,aA,sA,Km,uA,Zm,Fr,Jm,lA,Ym,cA,dA,pA,Qm,eg,fA,ng,rg,hA,gr,ig,ag,mA,gA,bA,yA,Ml,ug,lg,cg,_A,vA,wA,pg,fg,xA,TA,IA,SA,$A,gg,bg,mg,AA,OA,PA,EA,CA,DA,kl=k(()=>{"use strict";Me(),Ke(),Ae(),Nn(),Br(),Wi(),B$=(e,t)=>({name:"MatMul (packed)",inputNames:e?["A","B","Bias"]:["A","B"],inputTypes:e?[2,2,2]:[2,2],cacheHint:t}),F$=(e,t,i,n)=>{let o=i.length>2,a=o?"value += getBiasForMatmul();":"",s=i[0].dims,u=i[1].dims,l=gt.calcShape(s,u,!0),d=!ne.areEqual(i[0].dims,i[1].dims);if(!l)throw Error("Can't use matmul on the given tensors");let p=Math.ceil(s[s.length-1]/2),c=s.length,h=u.length,f=ue(e.session.backend.glContext.version),m=bt(l.length),g=l.length,b=qt(),{activationFunction:y,applyActivation:_}=Rn(n),v=o?`${Dl(m,b,i[2].dims,l,!0)}`:"",x=d?`${V$(m,b,i,l)}`:"",w=d?"getAAtOutCoordsMatmul(i)":`getA(${G$(b,c)})`,$=d?"getBAtOutCoordsMatmul(i)":`getB(${U$(b,h)})`,T=d?"":`${m} rc =
          getOutputCoords(); int lastDim = rc.${b[g-1]}; rc.${b[g-1]} =
          rc.${b[g-2]}; rc.${b[g-2]} = lastDim;
      `,I=`
            ${x}
            ${v}
            ${y}
            void main() {
              ${T}

              vec4 value = vec4(0);
              for (int i = 0; i < ${p}; i++) {
                vec4 a = ${w};
                vec4 b = ${$};

                value += (a.rrbb * b.rgrg);
                value += (a.ggaa * b.baba);
              }
              ${a}
              ${_}
              ${f.output} = value;
            }`;return{...t,output:{dims:l,type:i[0].type,textureType:2},shaderSource:I,hasMain:!0}},Hi=(e,t,i)=>{let n=B$(t.length>2,i.activationCacheKey);return{...n,get:()=>F$(e,n,t,i)}}}),Um=k(()=>{"use strict";Ui(),Bm(),kl(),Gm=(e,t,i)=>{let n=t[0].dims,o=t[1].dims,a=so(n,o,i.dilations,i.pads,i.strides),s=e.run(Mm(e,t[0],t[1],a,i),[t[0]]),u=e.reshapePacked(t[1],[o[0],o[1]*o[2]*o[3]]),l=3===t.length?[u,s,t[2]]:[u,s],d=e.run(Hi(e,l,i),l);return e.reshapePacked(d,a)}}),Ll=k(()=>{"use strict";Ae(),W$=e=>({name:"Im2Col",inputNames:["X"],inputTypes:[0],cacheHint:e}),H$=(e,t,i,n,o,a)=>{let s=i.dims,u=n.dims,l=o.length,d=Nl(s,u,o,4),p=`
        const int XC = ${s[1]};
        const int XH = ${s[2]};
        const int XW = ${s[3]};
        const int KH = ${a.kernelShape[0]};
        const int KW = ${a.kernelShape[1]};
        const int dilationH = ${a.dilations[0]};
        const int dilationW = ${a.dilations[1]};
        const int strideH = ${a.strides[0]};
        const int strideW = ${a.strides[1]};
        const int padH = ${a.pads[0]};
        const int padW = ${a.pads[1]};
        const int KHKW = KH*KW;
        const int XCKHKW = XC * KHKW;
        const int outputChannels = 4;
        vec4 process(int indices[${l}]) {
          int b  = indices[0]; // batch size
          int oh = indices[1] * strideH - padH; //output height
          int ow = indices[2] * strideW - padW; //output width
          int p = indices[3] * outputChannels; //patch
          vec4 value = vec4(0.0);
          for(int i=0; i < outputChannels; ++i) {
            if(p < XCKHKW) {
              int patchC = p / KHKW;
              int patchH = (p - patchC*KHKW) / KW;
              int patchW = (p - patchC*KHKW) - patchH * KW;
              int xh2 = oh + patchH * dilationH;
              int xw2 = ow + patchW * dilationW;
              int x[${s.length}];
              x[0] = b;
              x[1] = patchC;
              x[2] = xh2;
              x[3] = xw2;
              if(xh2 >= 0 &&
                  xh2 < XH &&
                  xw2 >= 0 &&
                  xw2 < XW) {
                value[i] = _X(x);
              }
            }
            ++p;
          }
          return value;
        }
        `;return{...t,output:{dims:d,type:i.type,textureType:4},shaderSource:p}},Wm=(e,t,i,n,o)=>{let a=W$(o.cacheKey);return{...a,get:()=>H$(e,a,t,i,n,o)}},Nl=(e,t,i,n=4)=>[i[0],i[2],i[3],Math.ceil(e[1]*t[2]*t[3]/n)]}),jm=k(()=>{"use strict";Me(),Ke(),Ae(),Br(),Ll(),j$=(e,t)=>({name:"ConvDotProduct",inputNames:e?["Im2Col","K","B"]:["Im2Col","K"],inputTypes:e?[0,4,0]:[0,4],cacheKey:t.activationCacheKey}),q$=(e,t,i,n,o)=>{let a=i[0].dims,s=i[1].dims,u=[s[0],Math.ceil(a[1]*s[2]*s[3]/4)],l=Nl(a,s,n),[d,p]=e.calculateTextureWidthAndHeight(u,4),c=ne.computeStrides(l),[h,f]=e.calculateTextureWidthAndHeight(l,4),m=n.length,g=i.length<3?"0.0":"_B(b)",b=Math.ceil(a[1]*s[2]*s[3]/4),{activationFunction:y,applyActivation:_}=Rn(o),v=ue(e.session.backend.glContext.version),x=`
${y}
float process(int indices[${m}]) {
  int b[1];
  b[0] = indices[1];
  int im2col[4];
  im2col[0] = indices[0];
  im2col[1] = indices[2];
  im2col[2] = indices[3];
  int im2colOffset = im2col[0] * ${c[0]} + im2col[1] * ${c[1]} + im2col[2] * ${c[2]};
  int kernelOffset = indices[1] * ${u[1]};
  float value = ${g};
  for (int i = 0; i < ${b}; ++i) {
    vec2 im2colCoords = offsetToCoords(im2colOffset, ${h}, ${f});
    vec2 kernelCoords = offsetToCoords(kernelOffset, ${d}, ${p});
    value += dot(${v.texture2D}(Im2Col, im2colCoords), ${v.texture2D}(K, kernelCoords));
    ++im2colOffset;
    ++kernelOffset;
  }
  ${_}
  return value;
}`;return{...t,output:{dims:n,type:i[0].type,textureType:0},shaderSource:x}},Hm=(e,t,i,n)=>{let o=j$(t.length>2,n);return{...o,get:()=>q$(e,o,t,i,n)}}}),Ui=k(()=>{"use strict";lt(),Me(),zm(),Um(),jm(),Br(),Ll(),Wi(),so=(e,t,i,n,o)=>{let a=e[0],s=e.slice(2),u=s.length,l=t[0],d=t.slice(2).map((e,t)=>e+(e-1)*(i[t]-1));return[a,l].concat(...s.map((e,t)=>e+n[t]+n[t+u]).map((e,t)=>Math.floor((e-d[t]+o[t])/o[t])))},Rl=(e,t,i)=>(Y$(t,i),K$(e,t,i)),K$=(e,t,i)=>{let n=J$(i,t),o=e.session.pack,a=1===n.kernelShape[0]&&1===n.kernelShape[1];return n.group>1?[e.run(Rm(e,t,n),t)]:a&&o?[X$(e,t,n)]:o&&4===t[0].dims.length&&1===t[0].dims[0]&&!a?[Gm(e,t,n)]:[Z$(e,t,n)]},X$=(e,t,i)=>{let n=t[0].dims,o=t[1].dims,a=so(n,o,i.dilations,i.pads,i.strides),s=e.reshapeUnpacked(t[0],[n[1],n[2]*n[3]]),u=e.reshapeUnpacked(t[1],[o[0],o[1]]),l=t.length>2?[u,s,t[2]]:[u,s],d=e.run(Cl(l,i),l);return e.reshapeUnpacked(d,a)},Z$=(e,t,i)=>{let n=t[0].dims,o=t[1].dims,a=so(n,o,i.dilations,i.pads,i.strides),s=e.run(Wm(e,t[0],t[1],a,i),[t[0]]),u=3===t.length?[s,t[1],t[2]]:[s,t[1]];return e.run(Hm(e,t,a,i),u)},J$=(e,t)=>{let i=e.kernelShape.slice();if(0===e.kernelShape.length)for(let e=2;e<t[1].dims.length;++e)i.push(t[1].dims[e]);let n=e.pads.slice();Nr.adjustPadsBasedOnAutoPad(t[0].dims,e.strides,e.dilations,i,n,e.autoPad);let o=Object.assign({},e);return Object.assign(o,{kernelShape:i,pads:n,cacheKey:e.cacheKey}),o},zl=e=>{let t=e.attributes,i=ao(t),n=t.getString("auto_pad","NOTSET"),o=t.getInts("dilations",[1,1]),a=t.getInt("group",1),s=t.getInts("kernel_shape",[]),u=t.getInts("pads",[0,0,0,0]),l=t.getInts("strides",[1,1]);return xe({autoPad:n,dilations:o,group:a,kernelShape:s,pads:u,strides:l,...i})},Y$=(e,t)=>{if(!e||2!==e.length&&3!==e.length)throw Error("Conv requires 2 or 3 inputs");if(4!==e[0].dims.length||4!==e[1].dims.length)throw Error("currently only support 2-dimensional conv");if(e[0].dims[1]!==e[1].dims[1]*t.group)throw Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");if(3===e.length&&(1!==e[2].dims.length||e[1].dims[0]!==e[2].dims[0]))throw Error("invalid bias");let i=e[0].dims.length-2;if(t.dilations.length!==i)throw Error(`dilations should be ${i}D`);if(t.strides.length!==i)throw Error(`strides should be ${i}D`);if(t.pads.length!==2*i)throw Error(`pads should be ${2*i}D`);if(0!==t.kernelShape.length&&t.kernelShape.length!==e[1].dims.length-2)throw Error("invalid kernel shape");if("float32"!==e[0].type||"float32"!==e[1].type)throw Error("Conv input(X,W) should be float tensor");if(3===e.length&&"float32"!==e[2].type)throw Error("Conv input(bias) should be float tensor")}}),Xm=k(()=>{"use strict";lt(),Ke(),Ae(),Br(),Q$=(e,t,i,n,o,a)=>(e-1)*t+i+(n-1)*o+1-a,eA=(e,t,i,n,o)=>{let a=Math.floor(e/2);"SAME_UPPER"===t?(i[n]=a,i[o]=e-a):"SAME_LOWER"===t&&(i[n]=e-a,i[o]=a)},tA=(e,t,i,n,o,a,s,u)=>{let l=e.length-2,d=0===u.length;for(let p=0;p<l;++p){let c=d?e[p+2]*a[p]:u[p];eA(Q$(e[p+2],a[p],o[p],t[p],i[p],c),n,o,p,p+l),d&&u.push(a[p]*(e[p+2]-1)+s[p]+(t[p]-1)*i[p]+1-o[p]-o[p+l])}},qm=(e,t,i)=>(uA(t,i),nA(e,t,i)),nA=(e,t,i)=>{let n=sA(i,t);return[aA(e,t,n)]},rA=(e,t)=>({name:"ConvTranspose",inputNames:e?["X","W","B"]:["X","W"],inputTypes:e?[0,0,0]:[0,0],cacheHint:t}),oA=(e,t,i,n)=>{let o=t.length>2?"getB(output_channel)":"0.0",a=t[0].dims,s=t[1].dims,u=s[1],l=s[0]/n.group,d=[t[0].dims[0],t[1].dims[1]*n.group,...n.outputShape],p=ue(e.session.backend.glContext.version),{activationFunction:c,applyActivation:h}=Rn(n),f=`
  const ivec2 strides = ivec2(${n.strides[0]}, ${n.strides[1]});
  const ivec2 pads = ivec2(${n.pads[0]}, ${n.pads[1]});
  ${c}
  void main() {
    ivec4 coords = getOutputCoords();
    int batch = coords.x;
    int output_channel = coords.y;

    ivec2 loc = coords.zw + pads;

    int group_id = output_channel / ${u};
    int wOutChannel = output_channel - group_id * ${u};

    float value = ${o};
    for (int inChannelOffset = 0; inChannelOffset < ${l}; inChannelOffset++) {
      int input_channel = group_id * ${l} + inChannelOffset;
      for (int wWOff = 0; wWOff < ${s[2]}; wWOff++) {
        for (int wHOff = 0; wHOff < ${s[3]}; wHOff++) {
          ivec2 wOff = ivec2(wWOff * ${n.dilations[0]}, wHOff * ${n.dilations[1]});
          ivec2 wLoc = loc - wOff;
          ivec2 wLocIn = wLoc / strides;
          if (
            wLocIn * strides == wLoc &&
            wLocIn.x >= 0 && wLocIn.x < ${a[2]} &&
            wLocIn.y >= 0 && wLocIn.y < ${a[3]}
          ) {
            float xVal = getX(batch, input_channel, wLocIn.y, wLocIn.x);
            float wVal = getW(input_channel, wOutChannel, wHOff, wWOff);
            value += xVal * wVal;
          }
        }
      }
    }
    ${h}
    ${p.output} = vec4(value, .0, .0, .0);
  }
`;return{...i,output:{dims:d,type:t[0].type,textureType:0},shaderSource:f,hasMain:!0}},iA=(e,t,i)=>{let n=rA(t.length>2,i.cacheKey);return{...n,get:()=>oA(e,t,n,i)}},aA=(e,t,i)=>e.run(iA(e,t,i),t),sA=(e,t)=>{let i=e.kernelShape.slice();if(0===e.kernelShape.length)for(let e=2;e<t[1].dims.length;++e)i.push(t[1].dims[e]);let n=e.pads.slice(),o=e.outputShape.slice();tA(t[0].dims,i,e.dilations,e.autoPad,n,e.strides,e.outputPadding,o);let a=Object.assign({},e);return Object.assign(a,{kernelShape:i,pads:n,outputShape:o,cacheKey:e.cacheKey}),a},Km=e=>{let t=e.attributes,i=ao(t),n=t.getString("auto_pad","NOTSET"),o=t.getInts("dilations",[1,1]),a=t.getInt("group",1),s=t.getInts("kernel_shape",[]),u=t.getInts("output_padding",[0,0]),l=t.getInts("output_shape",[]),d=t.getInts("pads",[0,0,0,0]),p=t.getInts("strides",[1,1]);return xe({autoPad:n,dilations:o,group:a,kernelShape:s,outputPadding:u,outputShape:l,pads:d,strides:p,...i})},uA=(e,t)=>{if(!e||2!==e.length&&3!==e.length)throw Error("Conv requires 2 or 3 inputs");if(4!==e[0].dims.length||4!==e[1].dims.length)throw Error("currently only support 2-dimensional conv");if(e[0].dims[1]!==e[1].dims[0])throw Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");let i=e[1].dims[1]*t.group;if(3===e.length&&(1!==e[2].dims.length||e[2].dims[0]!==i))throw Error("invalid bias");let n=e[0].dims.length-2;if(t.dilations.length!==n)throw Error(`dilations should be ${n}D`);if(t.strides.length!==n)throw Error(`strides should be ${n}D`);if(t.pads.length!==2*n)throw Error(`pads should be ${2*n}D`);if(t.outputPadding.length!==n)throw Error(`output_padding should be ${n}D`);if(0!==t.kernelShape.length&&t.kernelShape.length!==e[1].dims.length-2)throw Error("invalid kernel shape");if(0!==t.outputShape.length&&t.outputShape.length!==e[0].dims.length-2)throw Error("invalid output shape");if("float32"!==e[0].type||"float32"!==e[1].type)throw Error("ConvTranspose input(X,W) should be float tensor");if(3===e.length&&"float32"!==e[2].type)throw Error("ConvTranspose input(bias) should be float tensor")}}),ji=k(()=>{"use strict";lt(),Me(),Ae(),Zm={name:"Transpose",inputNames:["A"],inputTypes:[0]},Fr=(e,t,i)=>(pA(t),[e.run({...Zm,cacheHint:i.cacheKey,get:()=>lA(e,t[0],i.perm)},t)]),Jm=e=>xe({perm:e.attributes.getInts("perm",[])}),lA=(e,t,i)=>{let n=t.dims;i=Ym(n,i);let o=cA(n,i),a=n.length,s=`
      ${dA("perm",i,a)}
      float process(int indices[${a}]) {
        int a[${a}];
        perm(a, indices);
        return _A(a);
      }`;return{...Zm,output:{dims:o,type:t.type,textureType:0},shaderSource:s}},Ym=(e,t)=>(t&&t.length!==e.length&&(t=[...e.keys()].reverse()),t),cA=(e,t)=>(t=Ym(e,t),ne.sortBasedOnPerm(e,t)),dA=(e,t,i)=>{let n=[];n.push(`void ${e}(out int a[${i}], int src[${i}]) {`);for(let e=0;e<i;++e)n.push(`	a[${t[e]}]=src[${e}];`);return n.push("	}"),n.join(`
`)},pA=e=>{if(!e||1!==e.length)throw Error("Transpose requires 1 input.");if("float32"!==e[0].type&&"float64"!==e[0].type)throw Error("input should be float tensor")}}),tg=k(()=>{"use strict";ji(),Qm=(e,t,i)=>{fA(t);let n=i.blocksize,o=n*n,a="DCR"===i.mode?[0,3,4,1,5,2]:[0,1,4,2,5,3],s="DCR"===i.mode?[t[0].dims[0],n,n,t[0].dims[1]/o,t[0].dims[2],t[0].dims[3]]:[t[0].dims[0],t[0].dims[1]/o,n,n,t[0].dims[2],t[0].dims[3]],u=e.reshapeUnpacked(t[0],s),l={perm:a,cacheKey:`${a}`},[d]=Fr(e,[u],l),p=[t[0].dims[0],t[0].dims[1]/o,t[0].dims[2]*n,t[0].dims[3]*n];return[e.reshapeUnpacked(d,p)]},eg=e=>{let t=e.attributes.getInt("blocksize");if(t<1)throw Error(`blocksize must be >= 1, but got : ${t} for DepthToSpace`);let i=e.attributes.getString("mode","DCR");if("DCR"!==i&&"CRD"!==i)throw Error(`unrecognized mode: ${i} for DepthToSpace`);return{mode:i,blocksize:t}},fA=e=>{if(1!==e.length)throw Error(`DepthToSpace expect 1 inputs, but got ${e.length}`);if("string"===e[0].type||4!==e[0].dims.length)throw TypeError("DepthToSpace input should be a 4-D numeric tensor")}}),og=k(()=>{"use strict";Me(),ng=(e,t,i)=>{hA(t,i);let n=ne.flattenShape(t[0].dims,i);return[e.reshapeUnpacked(t[0],n)]},rg=e=>e.attributes.getInt("axis",1),hA=(e,t)=>{if(!e||1!==e.length)throw Error("Flatten requires 1 input.");let i=e[0].dims.length;if(0===i)throw Error("scalar tensor is not supported.");if(t<-i||t>i)throw Error("Invalid axis");if("string"===e[0].type)throw Error("string tensor is not supported.")}}),Ro=k(()=>{"use strict";gr=["float32","float64","int32","int16","int8","uint16","uint32","uint8"]}),sg=k(()=>{"use strict";lt(),Ro(),Me(),Ae(),ig=(e,t,i)=>(yA(t,i.axis),[e.run(bA(e,t,i),t)]),ag=e=>xe({axis:e.attributes.getInt("axis",0)}),mA={name:"Gather",inputNames:["A","B"],inputTypes:[0,0]},gA=(e,t,i,n)=>{let o=i[0].dims.slice(),a=i[1].dims.slice(),s=Array(o.length+a.length-1);n=ne.normalizeAxis(n,o.length);let u=[];for(let e=0;e<s.length;e++)e<n?(s[e]=o[e],u.push(`inputIdx[${e}] = outputIdx[${e}];`)):e<n+a.length?(s[e]=a[e-n],u.push(`indexDataIdx[${e-n}] = outputIdx[${e}];`)):(s[e]=o[e-a.length+1],u.push(`inputIdx[${e-a.length+1}] = outputIdx[${e}];`));let l=s.length||1,d=o.length,p=a.length||1,c=`
      float process(int outputIdx[${l}]) {
        int inputIdx[${d}];
        int indexDataIdx[${p}];
        indexDataIdx[0] = 0;
        ${u.join(`
        `)}
        int idx = int(_B(indexDataIdx));
        inputIdx[${n}] = idx < 0 ? idx + ${o[n]} : idx;
        return _A(inputIdx);
      }`;return{...t,output:{dims:s,type:i[0].type,textureType:0},shaderSource:c}},bA=(e,t,i)=>{let n={...mA,cacheHint:i.cacheKey};return{...n,get:()=>gA(e,n,t,i.axis)}},yA=(e,t)=>{if(!e||2!==e.length)throw Error("Gather requires 2 inputs.");let i=e[0].dims.length;if(i<1)throw Error("Invalid input shape.");if(t<-i||t>i-1)throw Error("Invalid axis.");if(-1===gr.indexOf(e[0].type)||"int32"!==e[1].type&&"int16"!==e[1].type)throw Error("Invaid input type.")}}),dg=k(()=>{"use strict";lt(),Me(),Ae(),Ml=(e,t,i)=>(wA(t,i),[e.run(_A(t,i),t)]),ug=(e,t)=>{let i=0!==e.attributes.getInt("transA",0),n=0!==e.attributes.getInt("transB",0),o=e.attributes.getFloat("alpha",1),a=e.attributes.getFloat("beta",1);return xe({transA:i,transB:n,alpha:o,beta:a,isOptionalC:t})},lg=e=>ug(e,!1),cg=e=>ug(e,!0),_A=(e,t)=>{let i={name:"Gemm",inputNames:3===e.length?["A","B","C"]:["A","B"],inputTypes:3===e.length?[0,0,0]:[0,0],key:t.cacheKey};return{...i,get:()=>vA(i,e,t)}},vA=(e,t,i)=>{let n=t[0].dims.slice(),o=t[1].dims.slice(),[a,s]=Li.getShapeOfGemmResult(n,i.transA,o,i.transB,3===t.length?t[2].dims:void 0),u=[a,s];if(!u)throw Error("Can't use gemm on the given tensors");let l=n[n.length-1],d="";i.transA&&(l=n[0]),i.transA&&i.transB?d="value += _A_T(a) * _B_T(b);":i.transA&&!i.transB?d="value += _A_T(a) * _B(b);":!i.transA&&i.transB?d="value += _A(a) * _B_T(b);":i.transA||i.transB||(d="value += _A(a) * _B(b);");let p=u.length,c=3===t.length?`int c[${t[2].dims.length}];`:"",h=3===t.length?"bcastIndices_C(indices, c);":"",f=3===t.length?"value += beta * _C(c);":"",m=`
      float process(int indices[${p}]) {
          int a[${p}];
          int b[${p}];
          ${c}

          copyVec(indices, a);
          copyVec(indices, b);
          ${h}

          float value = 0.0;
          for (int k=0; k<${l}; ++k) {
              a[${p-1}] = k;
              b[${p-2}] = k;
              ${d}
          }

          value = value * alpha;
          ${f}
          return value;
      }`;return{...e,output:{dims:u,type:t[0].type,textureType:0},variables:[{name:"alpha",type:"float",data:i.alpha},{name:"beta",type:"float",data:i.beta}],shaderSource:m}},wA=(e,t)=>{if(!e)throw Error("Input is missing");if(t.isOptionalC&&(e.length<2||e.length>3))throw Error("Invaid input shape.");if(!t.isOptionalC&&3!==e.length)throw Error("Gemm requires 3 inputs");if(3===e.length&&1!==e[2].dims.length&&2!==e[2].dims.length)throw Error("Invalid input shape of C");if("float32"!==e[0].type&&"float64"!==e[0].type||"float32"!==e[1].type&&"float64"!==e[1].type||3===e.length&&"float32"!==e[2].type&&"float64"!==e[2].type)throw Error("Invalid input type.");if(e[0].type!==e[1].type||3===e.length&&e[0].type!==e[2].type)throw Error("Input types are mismatched")}}),hg=k(()=>{"use strict";lt(),Ae(),pg=(e,t,i)=>($A(t),[e.run(IA(e,t,i),t)]),fg=e=>{let t=e.attributes.getFloat("scale"),i=e.attributes.getFloats("bias");return xe({scale:t,bias:i})},xA={name:"ImageScaler",inputNames:["X"],inputTypes:[0]},TA=(e,t,i,n)=>{let o=i[0].dims.slice(),a=o.length,s=`
      ${SA(n.bias.length)}
      float process(int indices[${a}]) {
        return _X(indices) * scale + getBias(bias, indices[1]);
      }`;return{...t,output:{dims:o,type:i[0].type,textureType:0},variables:[{name:"bias",type:"float",arrayLength:n.bias.length,data:n.bias},{name:"scale",type:"float",data:n.scale}],shaderSource:s}},IA=(e,t,i)=>{let n={...xA,cacheHint:i.cacheKey};return{...n,get:()=>TA(e,n,t,i)}},SA=e=>{let t=[`float getBias(float bias[${e}], int channel) {`];for(let i=0;i<e;++i)0===i?t.push(`	if (channel == ${i}) { return bias[${i}]; }`):i===e-1?t.push(`	else { return bias[${i}]; }`):t.push(`	else if (channel == ${i}) { return bias[${i}]; }`);return t.push("	}"),t.join(`
`)},$A=e=>{if(!e||1!==e.length)throw Error("ImageScaler requires 1 input.");if(4!==e[0].dims.length)throw Error("Invalid input shape.");if("float32"!==e[0].type&&"float64"!==e[0].type)throw Error("Invalid input type.")}}),yg=k(()=>{"use strict";Ke(),Ae(),gg=(e,t,i)=>{DA(t);let n=e.run(OA(t[0]),t);return[e.run(CA(e,t[0],i,n.dims),[t[0],n,t[1],t[2]])]},bg=e=>e.attributes.getFloat("epsilon",1e-5),mg={name:"InstanceNormalization_MeanAndVariance",inputNames:["X"],inputTypes:[0]},AA=(e,t)=>{let i=t.dims.slice(),n=i[1],o=i[2]*i[3],a=[i[0],n],s=`
      vec4 process(int[2] indices) {
        vec4 v = vec4(0.0);
        int a[4];
        a[0] = indices[0];
        a[1] = indices[1];
        float temp = 0.0;
        for(int a2=0; a2<${i[2]}; a2++) {
          a[2] = a2;
          for(int a3=0; a3<${i[3]}; a3++) {
            a[3] = a3;
            float x = _X(a);
            temp += x;
          }
        }
        float mean = temp / float(${o});
        temp = 0.0;
        for(int a2=0; a2<${i[2]}; a2++) {
          a[2] = a2;
          for(int a3=0; a3<${i[3]}; a3++) {
            a[3] = a3;
            float x = _X(a);
            temp += (x - mean) * (x - mean);
          }
        }
        v.r = mean;
        v.g = temp / float(${o});

        return v;
      }`;return{...e,output:{dims:a,type:t.type,textureType:4},shaderSource:s}},OA=e=>({...mg,get:()=>AA(mg,e)}),PA={name:"InstanceNormalization_ComputeOutput",inputNames:["X","MeanAndVariance","Scale","B"],inputTypes:[0,4,0,0]},EA=(e,t,i,n,o)=>{let a=ue(e.session.backend.glContext.version),[s,u]=e.calculateTextureWidthAndHeight(o,4),[l,d]=[s/4,u],p=`
      vec4 get_MeanAndVariance(int[2] mv) {
        int offset = indicesToOffset_MeanAndVariance(mv);
        vec2 coords = offsetToCoords(offset, ${l}, ${d});
        return ${a.texture2D}(MeanAndVariance, coords);
      }

      float process(int[4] indices) {
        int mv[2];
        mv[0] = indices[0];
        mv[1] = indices[1];
        vec4 mean_and_variance = get_MeanAndVariance(mv);
        float mean = mean_and_variance.r;
        float variance = mean_and_variance.g;

        int sb[1];
        sb[0] = indices[1];
        float scale = _Scale(sb);
        float b = _B(sb);

        return scale * (_X(indices) - mean) / sqrt(variance + epsilon) + b;
      }`;return{...t,output:{dims:i.dims,type:i.type,textureType:0},variables:[{name:"epsilon",type:"float",data:n}],shaderSource:p}},CA=(e,t,i,n)=>{let o={...PA,cacheHint:`${i}`};return{...o,get:()=>EA(e,o,t,i,n)}},DA=e=>{if(!e||3!==e.length)throw Error("InstanceNormalization requires 3 inputs.");let t=e[0],i=e[1],n=e[2];if(t.dims.length<3||1!==i.dims.length||1!==n.dims.length)throw Error("Invalid input shape.");if(i.dims[0]!==t.dims[1]||n.dims[0]!==t.dims[1])throw Error("Input shapes are mismatched.");if("float32"!==t.type&&"float64"!==t.type||"float32"!==i.type&&"float64"!==i.type||"float32"!==n.type&&"float64"!==n.type)throw Error("Invalid input type.");if(4!==e[0].dims.length)throw Error("Only support 4-D input shape.")}});function kA(e,t){let i=e[0].dims[1],n=e[0].dims.length,o=-Math.floor((t.size-1)/2),a=Math.ceil((t.size-1)/2),s=`float(${t.alpha}) / float(${t.size})`,u=`float(${t.bias})`,l=`float(${t.beta})`,d=`
    float process(int indices[${n}]) {
        int c = indices[1];
        float x = _X(indices);
        float square_sum = 0.0;

        for (int i = ${o}; i <= ${a}; i++) {
          int idx = c + i;
          if (c >= 0 && c < ${i}) {
            indices[1] = idx;
            float j = _X(indices);
            square_sum += j * j;
          }
        }
        return x / pow(${u} + ${s} * square_sum, ${l});
    }`;return{...wg,cacheHint:t.cacheKey,output:{dims:e[0].dims,type:e[0].type,textureType:0},shaderSource:d}}function NA(e,t){return{...wg,cacheHint:t.cacheKey,get:()=>kA(e,t)}}var _g,vg,wg,LA,RA,Bl,Tg,Ig,Sg,zA,MA,BA,FA,VA,GA,UA,WA,Og,Pg,Eg,Cg,Dg,kg,Ng,Lg,Rg,HA,Ag,zg,Ki,Mg,qi,jA,Vr,br,qA,KA,Fg,Vg,Gg,Ug,Wg,Hg,jg,Kg,Zg,Fl,Jg,Yg,zo,XA,Vl,Xi,Ul,Wl,Qg,eb,ZA,JA,YA,QA,nb,eO,Hl,ob,ib,ab,tO,sb,nO,rO,lb,cb,db,pb,fb,hb,mb,gb,oO,iO,aO,bb,_b,vb,wb,sO,uO,lO,jl,Tb,Ib,cO,dO,$b,pO,fO,Ob,hO,mO,ql,Eb,Cb,gO,bO,kb,xg=k(()=>{"use strict";lt(),Ae(),_g=(e,t,i)=>(LA(t),[e.run(NA(t,i),t)]),vg=e=>{let t=e.attributes.getFloat("alpha",1e-4),i=e.attributes.getFloat("beta",.75),n=e.attributes.getFloat("bias",1),o=e.attributes.getInt("size");return xe({alpha:t,beta:i,bias:n,size:o})},wg={name:"LRN",inputNames:["X"],inputTypes:[0]},LA=e=>{if(!e||1!==e.length)throw Error("LRN requires 1 input.");if(4!==e[0].dims.length)throw Error('currently only support LRN for input with "NCHW" format');if("float32"!==e[0].type)throw Error("input should be float type")}}),$g=k(()=>{"use strict";lt(),Me(),Ke(),Ae(),RA={name:"Pad",inputNames:["A"],inputTypes:[0]},Bl=(e,t,i)=>(BA(t),[e.run({...RA,cacheHint:i.cacheKey,get:()=>MA(e,t[0],i)},t)]),Tg=e=>{let t=e.attributes.getString("mode","constant"),i=e.attributes.getFloat("value",0),n=e.attributes.getInts("pads");return xe({mode:t,value:i,pads:n})},Ig=(e,t,i)=>{FA(t);let n=zA(e,t,i);return Bl(e,[t[0]],n)},Sg=e=>e.attributes.getString("mode","constant"),zA=(e,t,i)=>{if(!e.session.isInitializer(t[1].dataId)||t.length>=3&&!e.session.isInitializer(t[2].dataId))throw Error("dynamic pad attributes are not allowed");let n=Array.from(t[1].integerData),o=t.length>=3?t[2].floatData[0]:0;return xe({mode:i,pads:n,value:o})},MA=(e,t,i)=>{let n=ne.padShape(t.dims.slice(),i.pads),o=n.length,a=`
      ${VA(e,t,i)}
      float process(int[${o}] indices) {
          return padA(indices);
      }`;return{name:"Pad",inputNames:["A"],inputTypes:[0],output:{dims:n,type:t.type,textureType:0},shaderSource:a}},BA=e=>{if(!e||1!==e.length)throw Error("Pad requires 1 input");if("float32"!==e[0].type&&"float64"!==e[0].type)throw Error("Invalid input type.")},FA=e=>{if(!e||2!==e.length&&3!==e.length)throw Error("Pad requires 2 or 3 inputs");if("int32"!==e[1].type||e.length>=3&&"string"===e[2].type)throw Error("Invalid input type.")},VA=(e,t,i)=>{let n=ue(e.session.backend.glContext.version),[o,a]=e.calculateTextureWidthAndHeight(t.dims,0),s=ne.computeStrides(t.dims);switch(i.mode){case"constant":return GA(n,t.dims,s,o,a,i.pads,i.value);case"reflect":return UA(n,t.dims,s,o,a,i.pads);case"edge":return WA(n,t.dims,s,o,a,i.pads);default:throw Error("Invalid mode")}},GA=(e,t,i,n,o,a,s)=>{let u=t.length,l="";for(let e=u-1;e>=0;--e)l+=`
        k = m[${e}] - ${a[e]};
        if (k < 0)  return constant;
        if (k >= ${t[e]}) return constant;
        offset += k * ${i[e]};
        `;return`
      float padA(int m[${u}]) {
        const float constant = float(${s});
        int offset = 0;
        int k = 0;
        ${l}
        vec2 coords = offsetToCoords(offset, ${n}, ${o});
        float value = getColorAsFloat(${e.texture2D}(A, coords));
        return value;
      }
      `},UA=(e,t,i,n,o,a)=>{let s=t.length,u="";for(let e=s-1;e>=0;--e)u+=`
        k = m[${e}] - ${a[e]};
        if (k < 0) { k = -k; }
        {
          const int _2n_1 = ${2*(t[e]-1)};
          k = int( mod( float(k), float(_2n_1) ) ) ;
          if(k >= ${t[e]}) { k = _2n_1 - k; }
        }
        offset += k * ${i[e]};
        `;return`
      float padA(int m[${s}]) {
        int offset = 0;
        int k = 0;
        ${u}
        vec2 coords = offsetToCoords(offset, ${n}, ${o});
        float value = getColorAsFloat(${e.texture2D}(A, coords));
        return value;
      }
      `},WA=(e,t,i,n,o,a)=>{let s=t.length,u="";for(let e=s-1;e>=0;--e)u+=`
        k = m[${e}] - ${a[e]};
        if (k < 0)  k = 0;
        if (k >= ${t[e]}) k = ${t[e]-1};
        offset += k * ${i[e]};
      `;return`
      float padA(int m[${s}]) {
        int offset = 0;
        int k = 0;
        ${u}
        vec2 coords = offsetToCoords(offset, ${n}, ${o});
        float value = getColorAsFloat(${e.texture2D}(A, coords));
        return value;
      }
      `}}),Bg=k(()=>{"use strict";lt(),Me(),Ae(),Og=(e,t,i)=>{Ki(t);let n={name:"AveragePool",inputNames:["X"],inputTypes:[0],cacheHint:i.cacheKey};return[e.run({...n,get:()=>Eg(t,n,!1,i)},t)]},Pg=e=>{let t=e.attributes.getString("auto_pad","NOTSET"),i=e.attributes.getInt("ceil_mode",0),n=0!==e.attributes.getInt("count_include_pad",0),o=e.attributes.getInts("kernel_shape"),a=e.attributes.getInts("strides",[]),s=e.attributes.getInts("pads",[]);if(0!==i)throw Error("using ceil() in shape computation is not yet supported for AveragePool");return xe({autoPad:t,ceilMode:i,countIncludePad:n,kernelShape:o,strides:a,pads:s})},Eg=(e,t,i,n)=>{let[o,a]=Rg(e,n,i),s=ne.size(o.kernelShape),u="value += _X(x);",l="";o.countIncludePad?l+=`value /= float(${s});`:l+=`value /= float(${s} - pad);`;let d=`
        ${Mg(e[0].dims,o,u,l,"0.0")}
      `;return{...t,output:{dims:a,type:e[0].type,textureType:0},shaderSource:d}},Cg=(e,t,i)=>{Ki(t);let n={name:"GlobalAveragePool",inputNames:["X"],inputTypes:[0],cacheHint:`${i.countIncludePad}`};return[e.run({...n,get:()=>Eg(t,n,!0,i)},t)]},Dg=e=>{let t=0!==e.attributes.getInt("count_include_pad",0);return xe({autoPad:"",ceilMode:0,countIncludePad:t,kernelShape:[],strides:[],pads:[]})},kg=(e,t,i)=>{Ki(t);let n={name:"MaxPool",inputNames:["X"],inputTypes:[0],cacheHint:i.cacheKey};return[e.run({...n,get:()=>Lg(t,n,!1,i)},t)]},Ng=e=>{let t=e.attributes.getString("auto_pad","NOTSET"),i=e.attributes.getInt("ceil_mode",0),n=e.attributes.getInts("kernel_shape"),o=e.attributes.getInts("strides",[]),a=e.attributes.getInts("pads",[]),s=e.attributes.getInt("storage_order",0),u=e.attributes.getInts("dilations",[]);if(0!==s)throw Error("column major storage order is not yet supported for MaxPool");if(0!==i)throw Error("using ceil() in shape computation is not yet supported for MaxPool");return xe({autoPad:t,ceilMode:i,countIncludePad:!1,kernelShape:n,strides:o,pads:a,storageOrder:s,dilations:u})},Lg=(e,t,i,n)=>{let[o,a]=Rg(e,n,i),s=`
      ${Mg(e[0].dims,o,`
      value = max(_X(x), value);
    `,"","-1e5")}
    `;return{...t,output:{dims:a,type:e[0].type,textureType:0},shaderSource:s}},Rg=(e,t,i)=>{let n=e[0].dims.slice(),o=Object.hasOwnProperty.call(t,"dilations"),a=t.kernelShape.slice(),s=t.strides.slice(),u=o?t.dilations.slice():[],l=t.pads.slice();Nr.adjustPoolAttributes(i,n,a,s,u,l);let d=Nr.computePoolOutputShape(i,n,s,u,a,l,t.autoPad),p=Object.assign({},t);return o?Object.assign(p,{kernelShape:a,strides:s,pads:l,dilations:u,cacheKey:t.cacheKey}):Object.assign(p,{kernelShape:a,strides:s,pads:l,cacheKey:t.cacheKey}),[p,d]},HA={autoPad:"",ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[],cacheKey:""},Ag={name:"GlobalMaxPool",inputNames:["X"],inputTypes:[0]},zg=(e,t)=>(Ki(t),[e.run({...Ag,get:()=>Lg(t,Ag,!0,HA)},t)]),Ki=e=>{if(!e||1!==e.length)throw Error("Pool ops requires 1 input.");if("float32"!==e[0].type&&"float64"!==e[0].type)throw Error("Invalid input type.")},Mg=(e,t,i,n,o)=>{let a=e.length;if(t.kernelShape.length<=2){let s=t.kernelShape[t.kernelShape.length-1],u=t.strides[t.strides.length-1],l=t.pads[t.pads.length/2-1],d=t.pads[t.pads.length-1],p=e[a-1],c="",h="",f="";if(c=l+d!==0?`
          for (int i = 0; i < ${s}; i++) {
            x[${a} - 1] = indices[${a} - 1] * ${u} - ${l} + i;
            if (x[${a} - 1] < 0 || x[${a} - 1] >= ${p}) {
              pad++;
              continue;
            }
            ${i}
          }`:`
          for (int i = 0; i < ${s}; i++) {
            x[${a} - 1] = indices[${a} - 1] * ${u} - ${l} + i;
            ${i}
          }`,2===t.kernelShape.length){let i=t.kernelShape[t.kernelShape.length-2],n=t.strides[t.strides.length-2],o=t.pads[t.pads.length/2-2],u=t.pads[t.pads.length-2],l=e[a-2];h=o+u!==0?`
            for (int j = 0; j < ${i}; j++) {
              x[${a} - 2] = indices[${a} - 2] * ${n} - ${o} + j;
              if (x[${a} - 2] < 0 || x[${a} - 2] >= ${l}) {
                pad+= ${s};
                continue;
              }
          `:`
            for (int j = 0; j < ${i}; j++) {
              x[${a} - 2] = indices[${a} - 2] * ${n} - ${o} + j;
            `,f=`
          }
        `}return`
        float process(int indices[${a}]) {
          int x[${a}];
          copyVec(indices, x);

          float value = ${o};
          int pad = 0;
          ${h}
          ${c}
          ${f}
          ${n}
          return value;
        }
      `}{let s=ne.size(t.kernelShape),u=ne.computeStrides(t.kernelShape),l=u.length,d=t.pads.length,p=jA(l),c=qi(e,"inputDims"),h=qi(t.pads,"pads"),f=qi(u,"kernelStrides"),m=qi(t.strides,"strides"),g=t.pads.reduce((e,t)=>e+t),b="";return b=g?`
            if (x[j] >= inputDims[j] || x[j] < 0) {
              pad++;
              isPad = true;
              break;
            }
          }
          if (!isPad) {
            ${i}
          }`:`
          }
          ${i}
        `,`
        ${p}
        float process(int indices[${a}]) {
          int x[${a}];
          copyVec(indices, x);
          int offset[${l}];
          int pads[${d}];
          int inputDims[${a}];
          int kernelStrides[${l}];
          int strides[${l}];
          ${h}
          ${c}
          ${m}
          ${f}

          float value = ${o};
          int pad = 0;
          bool isPad = false;
          for (int i = 0; i < ${s}; i++) {
            offsetToIndices(i, kernelStrides, offset);
            isPad = false;
            for (int j = ${a} - ${l}; j < ${a}; j++) {
              x[j] = indices[j] * strides[j - ${a} + ${l}]
                + offset[j - ${a} + ${l}] - pads[j - 2];
              ${b}
          }
          ${n}

          return value;
        }
      `}},qi=(e,t)=>{let i="";for(let n=0;n<e.length;n++)i+=`
      ${t}[${n}] = ${e[n]};
    `;return i},jA=e=>`
  void offsetToIndices(int offset, int[${e}] strides, out int[${e}] indices) {
    if (${e} == 0) {
      return;
    }
    for (int i = 0; i < ${e} - 1; ++i) {
      indices[i] = offset / strides[i];
      offset -= indices[i] * strides[i];
    }
    indices[${e} - 1] = offset;
  }`}),qg=k(()=>{"use strict";lt(),Ro(),Me(),Ae(),Vr=(e,t,i,n,o)=>{KA(t);let a={name:n,inputNames:["A"],inputTypes:[0]};return[e.run({...a,cacheHint:i.cacheKey,get:()=>qA(e,t,i,n,o,a)},t)]},br=e=>{let t=e.attributes.getInts("axes",[]),i=1===e.attributes.getInt("keepdims",1);return xe({axes:t,keepDims:i})},qA=(e,t,i,n,o,a)=>{let s=[],u=t[0].dims.length||1,l=[],d=ne.normalizeAxes(i.axes,t[0].dims.length),p=o(t,d),c=p[1];for(let e=0;e<t[0].dims.length;e++)d.indexOf(e)>=0||0===d.length?(i.keepDims&&s.push(1),c=`
          for(int j${e} = 0; j${e} < ${t[0].dims[e]}; j${e}++) {
            inputIdx[${e}] = j${e};
            ${c}
          }`):(l.push(`inputIdx[${e}] = outputIdx[${s.length}];`),s.push(t[0].dims[e]));let h=`
      float process(int outputIdx[${s.length||1}]) {
        float value;                 // final result
        int inputIdx[${u}];      // addressing input data
        ${l.join(`
`)}
        ${p[0]}       // init ops for reduce max/min
        ${c}
        ${p[2]}       // final computation for reduce mean
        return value;
      }`;return{...a,output:{dims:s,type:t[0].type,textureType:0},shaderSource:h}},KA=e=>{if(!e||1!==e.length)throw Error("Reduce op requires 1 input.");if(-1===gr.indexOf(e[0].type))throw Error("Invalid input type.")},Fg=(e,t,i)=>Vr(e,t,i,"ReduceSum",()=>["value = 0.0;","value += _A(inputIdx);",""]),Vg=(e,t,i)=>Vr(e,t,i,"ReduceMean",(e,t)=>{let i=1;for(let n=0;n<e[0].dims.length;n++)(t.indexOf(n)>=0||0===t.length)&&(i*=e[0].dims[n]);return["value = 0.0;","value += _A(inputIdx);",`value /= ${i}.;`]}),Gg=(e,t,i)=>Vr(e,t,i,"ReduceMax",(e,t)=>{let i=[];for(let n=0;n<e[0].dims.length;n++)(t.indexOf(n)>=0||0===t.length)&&i.push(`inputIdx[${n}] = 0;`);return[`${i.join(`
`)}
value = _A(inputIdx);`,"value = max(value, _A(inputIdx));",""]}),Ug=(e,t,i)=>Vr(e,t,i,"ReduceMin",(e,t)=>{let i=[];for(let n=0;n<e[0].dims.length;n++)(t.indexOf(n)>=0||0===t.length)&&i.push(`inputIdx[${n}] = 0;`);return[`${i.join(`
`)}
value = _A(inputIdx);`,"value = min(value, _A(inputIdx));",""]}),Wg=(e,t,i)=>Vr(e,t,i,"ReduceProd",()=>["value = 1.0;","value *= _A(inputIdx);",""]),Hg=(e,t,i)=>Vr(e,t,i,"ReduceLogSum",()=>["value = 0.0;","value += _A(inputIdx);","value = log(value);"]),jg=(e,t,i)=>Vr(e,t,i,"ReduceLogSumSquare",()=>["float t; value = 0.0;","t = _A(inputIdx); value += t * t;",""])}),Xg=k(()=>{"use strict";Me(),Kg=(e,t)=>{let i=ne.calculateReshapedDims(t[0].dims,t[1].integerData);return e.session.pack?[e.reshapePacked(t[0],i)]:[e.reshapeUnpacked(t[0],i)]}}),Gl=k(()=>{"use strict";lt(),Ke(),Ae(),Zg={name:"Upsample",inputNames:["X"],inputTypes:[0]},Fl=(e,t,i)=>(Vl(t,i),[e.run({...Zg,cacheHint:i.cacheKey,get:()=>XA(e,t,i)},t)]),Jg=e=>zo(e,7),Yg=e=>zo(e,9),zo=(e,t)=>{let i=t>=10,n=e.attributes.getString("mode","nearest");if("nearest"!==n&&"linear"!==n&&(t<11||"cubic"!==n))throw Error(`unrecognized mode: ${n}`);let o=[];t<9&&(o=e.attributes.getFloats("scales"),Xi(o,n,i));let a=e.attributes.getFloat("extrapolation_value",0),s=t>10?e.attributes.getString("coordinate_transformation_mode","half_pixel"):"asymmetric";if(-1===["asymmetric","pytorch_half_pixel","tf_half_pixel_for_nn","align_corners","tf_crop_and_resize","half_pixel"].indexOf(s))throw Error(`coordinate_transform_mode '${s}' is not supported`);let u="tf_crop_and_resize"===s,l=u,d="nearest"===n&&t>=11?e.attributes.getString("nearest_mode","round_prefer_floor"):"";if(-1===["round_prefer_floor","round_prefer_ceil","floor","ceil",""].indexOf(d))throw Error(`nearest_mode '${d}' is not supported`);let p=e.attributes.getFloat("cubic_coeff_a",-.75),c=0!==e.attributes.getInt("exclude_outside",0);if(c&&"cubic"!==n)throw Error("exclude_outside can be set to 1 only when mode is CUBIC.");let h=t<11||"nearest"===n&&"asymmetric"===s&&"floor"===d,f=0,m=0,g=0;return t>10?e.inputs.length>2?(f=1,m=2,g=3):(m=1,g=2):9===t&&(m=1),xe({opset:t,isResize:i,mode:n,scales:o,extrapolationValue:a,coordinateTransformMode:s,useExtrapolation:l,needRoiInput:u,nearestMode:d,cubicCoefficientA:p,excludeOutside:c,useNearest2xOptimization:h,roiInputIdx:f,scalesInputIdx:m,sizesInputIdx:g})},XA=(e,t,i)=>{let n=ue(e.session.backend.glContext.version),[o,a]=e.calculateTextureWidthAndHeight(t[0].dims,0),s=t[0].dims.map((e,t)=>Math.floor(e*i.scales[t])),[u,l]=e.calculateTextureWidthAndHeight(s,0),d=s.length,p=Array(d),c=Array(d),h=`
      int output_pitches[${d}];
      int input_pitches[${d}];
      `;for(let e=d-1;e>=0;e--)p[e]=e===d-1?1:p[e+1]*s[e+1],c[e]=e===d-1?1:c[e+1]*t[0].dims[e+1],h+=`
        output_pitches[${e}] = ${p[e]};
        input_pitches[${e}] = ${c[e]};
        `;let f=`
      float getInputFloat(int index) {
        vec2 coords = offsetToCoords(index, ${o}, ${a});
        float value = getColorAsFloat(${n.texture2D}(X, coords));
        return value;
      }
      `,m="nearest"===i.mode?`
    ${f}
    float process(int indices[${d}]) {
      int input_index = 0;
      int output_index = coordsToOffset(TexCoords, ${u}, ${l});

      ${h}

      int d, m;
      for (int dim = 0; dim < ${d}; ++dim) {
        d = output_index / output_pitches[dim];
        m = output_index - d * output_pitches[dim];
        output_index = m;

        if (scales[dim] != 1 && d > 0) {
          int d2 = d / scales[dim];
          m = d - d2 * scales[dim];
          d = d2;
        }
        input_index += input_pitches[dim] * d;
      }

      return getInputFloat(input_index);
    }`:4===d?`
    ${f}
    float process(int indices[4]) {
      int input_index = 0;
      int output_index = coordsToOffset(TexCoords, ${u}, ${l});

      ${h}

      int m;
      int index_of_dim0, index_of_dim1, index_of_dim2, index_of_dim3;
      index_of_dim0 = output_index / output_pitches[0];
      m = output_index - index_of_dim0 * output_pitches[0];
      index_of_dim1 = m / output_pitches[1];
      m = m - index_of_dim1 * output_pitches[1];
      index_of_dim2 = m / output_pitches[2];
      m = m - index_of_dim2 * output_pitches[2];
      index_of_dim3 = m;

      int index_of_input_dim2, index_of_input_dim3, x_offset, y_offset;
      index_of_input_dim2 = index_of_dim2 / scales[2];
      y_offset = index_of_dim2 - index_of_input_dim2 * scales[2];
      index_of_input_dim3 = index_of_dim3 / scales[3];
      x_offset = index_of_dim3 - index_of_input_dim3 * scales[3];

      input_index = index_of_dim0 * input_pitches[0] +
            index_of_dim1 * input_pitches[1] +
            index_of_input_dim2 * input_pitches[2] +
            index_of_input_dim3;

      float x00 = getInputFloat(input_index);
      float x10, x01, x11;

      bool end_of_dim2 = false;
      if (index_of_input_dim2 == (${t[0].dims[2]} - 1)) {
        // It's the end in dimension 2
        x01 = x00;
        end_of_dim2 = true;
      } else {
        x01 = getInputFloat(input_index + input_pitches[2]);
      }

      if (index_of_input_dim3 == (input_pitches[2] - 1)) {
        // It's the end in dimension 3
        x10 = x00;
        x11 = x01;
      }
      else {
        x10 = getInputFloat(input_index + 1);
        x11 = end_of_dim2 ? x10 : getInputFloat(input_index + input_pitches[2] + 1);
      }

      float y0 = x00 + float(y_offset) * (x01 - x00) / float(scales[2]);
      float y1 = x10 + float(y_offset) * (x11 - x10) / float(scales[2]);
      return y0 + float(x_offset) * (y1 - y0) / float(scales[3]);
    }`:`
    ${f}
    float process(int indices[2]) {
      int input_index = 0;
      int output_index = coordsToOffset(TexCoords, ${u}, ${l});

      ${h}

      int m;
      int index_of_dim0, index_of_dim1;
      index_of_dim0 = output_index / output_pitches[0];
      m = output_index - index_of_dim0 * output_pitches[0];
      index_of_dim1 = m;

      int index_of_input_dim0, index_of_input_dim1, x_offset, y_offset;
      index_of_input_dim0 = index_of_dim0 / scales[0];
      y_offset = index_of_dim0 - index_of_input_dim0 * scales[0];
      index_of_input_dim1 = index_of_dim1 / scales[1];
      x_offset = index_of_dim1 - index_of_input_dim1 * scales[1];

      input_index = index_of_input_dim0 * input_pitches[0] + index_of_input_dim1;

      float x00 = getInputFloat(input_index);
      float x10, x01, x11;

      bool end_of_dim0 = false;
      if (index_of_input_dim0 == (${t[0].dims[0]} - 1)) {
        // It's the end in dimension 0
        x01 = x00;
        end_of_dim0 = true;
      } else {
        x01 = getInputFloat(input_index + input_pitches[0]);
      }

      if (index_of_input_dim1 == (input_pitches[0] - 1)) {
        // It's the end in dimension 1
        x10 = x00;
        x11 = x01;
      }
      else {
        x10 = getInputFloat(input_index + 1);
        x11 = end_of_dim0 ? x10 : getInputFloat(input_index + input_pitches[0] + 1);
      }

      float y0 = x00 + float(y_offset) * (x01 - x00) / float(scales[0]);
      float y1 = x10 + float(y_offset) * (x11 - x10) / float(scales[0]);
      return y0 + float(x_offset) * (y1 - y0) / float(scales[1]);
    }`;return{...Zg,output:{dims:s,type:t[0].type,textureType:0},shaderSource:m,variables:[{name:"scales",type:"int",arrayLength:i.scales.length,data:i.scales.map(e=>Math.ceil(e))}]}},Vl=(e,t)=>{if(!e||t.opset<9&&1!==e.length||t.opset>=9&&t.opset<11&&2!==e.length||t.opset>=11&&e.length<2)throw Error("invalid inputs.");if(t.scales.length>0&&e[0].dims.length!==t.scales.length)throw Error("Invalid input shape.");if("string"===e[0].type)throw Error("Invalid input tensor types.")},Xi=(e,t,i)=>{if(i){for(let t of e)if(t<=0)throw Error("Scale value should be greater than 0.")}else for(let t of e)if(t<1)throw Error("Scale value should be greater than or equal to 1.");if(("linear"===t||"cubic"===t)&&2!==e.length&&(4!==e.length||1!==e[0]||1!==e[1]))throw Error(`'Linear' mode and 'Cubic' mode only support 2-D inputs ('Bilinear', 'Bicubic')         or 4-D inputs with the corresponding outermost 2 scale values being 1         in the ${i?"Resize":"Upsample"} opeartor.`)}}),tb=k(()=>{"use strict";Ke(),Ae(),Nn(),Mr(),Gl(),Ul={name:"Resize",inputNames:["A"],inputTypes:[2]},Wl=(e,t,i)=>(Vl(t,i),[e.run({...Ul,cacheHint:i.cacheKey,get:()=>ZA(e,t,i)},t)]),Qg=e=>zo(e,10),eb=e=>zo(e,11),ZA=(e,t,i)=>{let n=ue(e.session.backend.glContext.version),[o,a]=JA(t,i);if(o.every(e=>1===e)&&"tf_crop_and_resize"!==i.coordinateTransformMode)return{...Ul,output:{dims:a,type:t[0].type,textureType:2},hasMain:!0,shaderSource:`void main() {
                    vec4 v = ${n.texture2D}(X, TexCoords);
                    ${n.output} = v;
                }`};let s=a.length;if(s<2)throw Error(`output dimension should be at least 2, but got ${s}`);let u=a[s-2],l=a[s-1],d=t[0].dims;if(s!==d.length)throw Error(`output dimension should match input ${d.length}, but got ${s}`);let p=d[s-2],c=d[s-1],h=o[s-2],f=o[s-1],m="";if("linear"!==i.mode)throw Error(`resize (packed) does not support mode: '${i.mode}'`);switch(i.coordinateTransformMode){case"asymmetric":m=`
                    vec4 getSourceFracIndex(ivec4 coords) {
                        return vec4(coords) / scaleWHWH;
                    }
                `;break;case"half_pixel":m=`
                    vec4 getSourceFracIndex(ivec4 coords) {
                        return (vec4(coords) + 0.5) / scaleWHWH - 0.5;
                    }
                `;break;case"pytorch_half_pixel":m=`
                    vec4 getSourceFracIndex(ivec4 coords) {
                        vec4 fcoords = vec4(coords);
                        return vec4(
                            ${l}.0 > 1.0 ? (fcoords.x + 0.5) / scaleWHWH.x - 0.5 : 0.0,
                            ${u}.0 > 1.0 ? (fcoords.y + 0.5) / scaleWHWH.y - 0.5 : 0.0,
                            ${l}.0 > 1.0 ? (fcoords.z + 0.5) / scaleWHWH.z - 0.5 : 0.0,
                            ${u}.0 > 1.0 ? (fcoords.w + 0.5) / scaleWHWH.w - 0.5 : 0.0
                          );
                    }
                `;break;case"align_corners":m=`
                    vec4 getSourceFracIndex(ivec4 coords) {
                        vec4 resized = vec4(${l}.0 - 1.0, ${u}.0 - 1.0, ${l}.0 - 1.0,
                            ${u}.0 - 1.0);
                        vec4 original = vec4(${c}.0 - 1.0, ${p}.0 - 1.0, ${c}.0 - 1.0,
                            ${p}.0 - 1.0);
                        vec4 new_scale = original / resized;
                        return vec4(coords) * new_scale;
                    }
                `;break;default:throw Error(`resize (packed) does not support coordinateTransformMode:                                 '${i.coordinateTransformMode}'`)}let g=bt(s),b=Ln(),y=`
            const vec2 inputWH = vec2(${p}.0, ${c}.0);
            const vec4 scaleWHWH = vec4(float(${h}), float(${f}), float(${h}), float(${f}));
            ${b}
            ${m}
            float getAValue(int x10, int r, int c, int d) {
                return getChannel(getA(x10, r, c, d), vec2(c, d));
            }
            void main() {
                ${g} rc = getOutputCoords();

                int batch = rc[0];
                int depth = rc[1];

                // retrieve the 4 coordinates that is used in the 4 packed output values.
                ivec4 coords = ivec4(rc.wz, rc.w + 1, rc.z + 1);

                // calculate the source index in fraction
                vec4 sourceFrac = getSourceFracIndex(coords);

                // get the lower and upper bound of the 4 values that will be packed into one texel.
                ivec4 x00 = ivec4(max(sourceFrac.xy, vec2(0.0)), min(inputWH - 1.0, ceil(sourceFrac.xy)));
                ivec4 x01 = ivec4(max(sourceFrac.xw, vec2(0.0)), min(inputWH - 1.0, ceil(sourceFrac.xw)));
                ivec4 x10 = ivec4(max(sourceFrac.zy, vec2(0.0)), min(inputWH - 1.0, ceil(sourceFrac.zy)));
                ivec4 x11 = ivec4(max(sourceFrac.zw, vec2(0.0)), min(inputWH - 1.0, ceil(sourceFrac.zw)));

                bool hasNextRow = rc.w < ${u-1};
                bool hasNextCol = rc.z < ${l-1};

                // pack x00, x01, x10, x11's top-left corner into one vec4 structure
                vec4 topLeft = vec4(
                    getAValue(batch, depth, x00.x, x00.y),
                    hasNextCol ? getAValue(batch, depth, x01.x, x01.y) : 0.0,
                    hasNextRow ? getAValue(batch, depth, x10.x, x10.y) : 0.0,
                    (hasNextRow && hasNextCol) ? getAValue(batch, depth, x11.x, x11.y) : 0.0);

                // pack x00, x01, x10, x11's top-right corner into one vec4 structure
                vec4 topRight = vec4(
                    getAValue(batch, depth, x00.x, x00.w),
                    hasNextCol ? getAValue(batch, depth, x01.x, x01.w) : 0.0,
                    hasNextRow ? getAValue(batch, depth, x10.x, x10.w) : 0.0,
                    (hasNextRow && hasNextCol) ? getAValue(batch, depth, x11.x, x11.w) : 0.0);

                // pack x00, x01, x10, x11's bottom-left corner into one vec4 structure
                vec4 bottomLeft = vec4(
                    getAValue(batch, depth, x00.z, x00.y),
                    hasNextCol ? getAValue(batch, depth, x01.z, x01.y) : 0.0,
                    hasNextRow ? getAValue(batch, depth, x10.z, x10.y) : 0.0,
                    (hasNextRow && hasNextCol) ? getAValue(batch, depth, x11.z, x11.y) : 0.0);

                // pack x00, x01, x10, x11's bottom-right corner into one vec4 structure
                vec4 bottomRight = vec4(
                    getAValue(batch, depth, x00.z, x00.w),
                    hasNextCol ? getAValue(batch, depth, x01.z, x01.w) : 0.0,
                    hasNextRow ? getAValue(batch, depth, x10.z, x10.w) : 0.0,
                    (hasNextRow && hasNextCol) ? getAValue(batch, depth, x11.z, x11.w) : 0.0);

                // calculate the interpolation fraction on u and v direction
                vec4 frac = vec4(sourceFrac) - floor(sourceFrac);
                vec4 clampFrac = clamp(frac, vec4(0.0), vec4(1.0));

                vec4 top = mix(topLeft, topRight, clampFrac.ywyw);
                vec4 bottom = mix(bottomLeft, bottomRight, clampFrac.ywyw);
                vec4 newValue = mix(top, bottom, clampFrac.xxzz);

                ${n.output} = vec4(newValue);
            }
        `;return{...Ul,output:{dims:a,type:t[0].type,textureType:2},hasMain:!0,shaderSource:y}},JA=(e,t)=>{let i=e[0].dims,n=t.scales,o;if(0===n.length){let a=e[t.scalesInputIdx];if(a&&0!==a.size){if(e[t.sizesInputIdx])throw Error("Only one of scales or sizes must be provided as input.");n=YA(a,t.mode,t.isResize)}else{let a=e[t.sizesInputIdx];if(!a||0===a.size)throw Error("Either scales or sizes MUST be provided as input.");o=Array.from(a.integerData),n=QA(o,i,t.mode,t.isResize)}}else if(e[t.sizesInputIdx])throw Error("Only one of scales or sizes must be provided as input.");let a=o||i.map((e,t)=>Math.floor(e*n[t]));return[n,a]},YA=(e,t,i)=>{let n=Array.from(e.floatData);return Xi(n,t,i),n},QA=(e,t,i,n)=>{let o=t.length,a=Array(o);for(let i=0,n=o;i<n;i++)if(0===t[i]){if(0!==e[i])throw Error("Input dim is zero but required output dim is non-zero.");a[i]=1}else a[i]=e[i]/t[i];return Xi(a,i,n),a}}),rb=k(()=>{"use strict";zr(),nb=(e,t)=>(eO(t),[new nt([t[0].dims.length],"int32",void 0,void 0,new Int32Array(t[0].dims))]),eO=e=>{if(!e||1!==e.length)throw Error("Shape requires 1 input.")}}),ub=k(()=>{"use strict";lt(),Ro(),Me(),Ae(),Hl={name:"Slice",inputNames:["A"],inputTypes:[0]},ob=(e,t,i)=>(tO(t),[e.run({...Hl,cacheHint:i.cacheKey,get:()=>ab(e,t[0],i)},t)]),ib=e=>{let t=e.attributes.getInts("starts"),i=e.attributes.getInts("ends"),n=e.attributes.getInts("axes",[]);return xe({starts:t,ends:i,axes:n})},ab=(e,t,i)=>{let n=0===i.axes.length?t.dims.slice(0).map((e,t)=>t):i.axes,o=ne.normalizeAxes(n,t.dims.length),a=i.starts.map((e,i)=>e>t.dims[o[i]]-1?t.dims[o[i]]:ne.normalizeAxis(e,t.dims[o[i]])),s=i.ends.map((e,i)=>e>t.dims[o[i]]-1?t.dims[o[i]]:ne.normalizeAxis(e,t.dims[o[i]])),u=t.dims.slice(),l=[];for(let e=0;e<o.length;e++)u[o[e]]=s[e]-a[e],a[e]>0&&l.push(`outputIdx[${o[e]}] += ${a[e]};`);let d=`
      float process(int outputIdx[${u.length}]) {
        ${l.join(`
      `)}
        return _A(outputIdx);
      }`;return{...Hl,output:{dims:u,type:t.type,textureType:0},shaderSource:d}},tO=e=>{if(!e||1!==e.length)throw Error("Slice requires 1 input.");if(-1===gr.indexOf(e[0].type))throw Error("Invalid input type.")},sb=(e,t)=>{rO(t);let i=nO(e,t);return[e.run({...Hl,cacheHint:i.cacheKey,get:()=>ab(e,t[0],i)},[t[0]])]},nO=(e,t)=>{if(!e.session.isInitializer(t[1].dataId)||!e.session.isInitializer(t[2].dataId)||t.length>=4&&!e.session.isInitializer(t[3].dataId)||t.length>=5&&!e.session.isInitializer(t[4].dataId))throw Error("dynamic slice attributes are not allowed");if(t.length>=5&&t[4].integerData.some(e=>1!==e))throw Error("currently non-1 steps is not supported for Slice");let i=Array.from(t[1].integerData),n=Array.from(t[2].integerData),o=t.length>=4?Array.from(t[3].integerData):[],a=`${o};${i};${n}`;return{starts:i,ends:n,axes:o,cacheKey:a}},rO=e=>{if(!e||e.length<3||e.length>5)throw Error("Invalid input number.");if("int32"!==e[1].type||1!==e[1].dims.length||"int32"!==e[2].type||1!==e[2].dims.length||e.length>=4&&("int32"!==e[3].type||1!==e[3].dims.length)||e.length>=5&&("int32"!==e[4].type||1!==e[4].dims.length))throw Error("Invalid input type.")}}),yb=k(()=>{"use strict";lt(),Me(),Ke(),Ae(),ji(),lb={name:"SoftmaxComputeMax",inputNames:["A"],inputTypes:[0]},cb={name:"SoftmaxComputeScale",inputNames:["A","Max"],inputTypes:[0,0]},db={name:"SoftMax",inputNames:["A","Max","Norm"],inputTypes:[0,0,0]},pb=(e,t,i)=>{bb(t);let n=t[0].dims.slice(),o=ne.normalizeAxis(i.axis,n.length),a=ne.sizeToDimension(n,o),s=ne.sizeFromDimension(n,o);return gb(e,t,i,a,s)},fb=e=>xe({axis:e.attributes.getInt("axis",1)}),hb=e=>xe({axis:e.attributes.getInt("axis",-1)}),mb=(e,t,i)=>{bb(t);let n=t[0].dims.slice(),o=ne.normalizeAxis(i.axis,n.length),a=n.length,s=o!==a-1,u=[],l=[],d=[],p;s&&((l=Array.from({length:a}).map((e,t)=>t))[o]=a-1,l[a-1]=o,l.map(e=>u.push(n[e])),p=xe({perm:l}),d=Fr(e,t,p));let c=s?ne.sizeToDimension(u,a-1):ne.sizeToDimension(n,a-1),h=s?ne.sizeFromDimension(u,a-1):ne.sizeFromDimension(n,a-1),f=gb(e,s?d:t,i,c,h);return s?Fr(e,f,p):f},gb=(e,t,i,n,o)=>{let a=oO(e,t[0],n,o,[n]),s=e.run({...lb,cacheHint:i.cacheKey,get:()=>a},t),u=iO(e,t[0],n,o,a.output.dims,[n]),l=e.run({...cb,cacheHint:i.cacheKey,get:()=>u},[t[0],s]),d=aO(e,t[0],n,o,a.output.dims,u.output.dims);return[e.run({...db,cacheHint:i.cacheKey,get:()=>d},[t[0],s,l])]},oO=(e,t,i,n,o)=>{let[a,s]=e.calculateTextureWidthAndHeight(t.dims,0),u=o.length;if(i<1||n<1)throw Error("Logical row count N and feature count D must be greater than or equal to 1");if(1!==o.length)throw Error("Dimensionality of the output should be 1");if(o[0]!==i)throw Error("Shape of the output should be equal to logical row count");let l=ue(e.session.backend.glContext.version),d=`
      float process(int[${u}] indices) {
        int logical_row_start_offset = indices[0] * ${n};

        float max = getColorAsFloat(${l.texture2D}(A, offsetToCoords(logical_row_start_offset, ${a},
        ${s} )));
        for(int i=1; i<${n}; ++i)
        {
          float current = getColorAsFloat(${l.texture2D}(A, offsetToCoords(logical_row_start_offset + i,
            ${a}, ${s})));
          if(current > max)
          max = current;
        }

        return max;
      }`;return{...lb,output:{dims:o,type:t.type,textureType:0},shaderSource:d}},iO=(e,t,i,n,o,a)=>{let[s,u]=e.calculateTextureWidthAndHeight(t.dims,0),l=a.length;if(i<1||n<1)throw Error("Logical row count N and feature count D must be greater than or equal to 1");if(1!==a.length)throw Error("Dimensionality of the output should be 1");if(a[0]!==i)throw Error("Shape of the output should be equal to logical row count");if(1!==o.length)throw Error("Dimensionality of the intermediate results should be 1");if(o[0]!==i)throw Error("Shape of the intermediate results should be equal to logical row count");let d=ue(e.session.backend.glContext.version),p=`
      float process(int[${l}] indices) {
        int logical_row_start_offset = indices[0] * ${n};

        float norm_factor = 0.0;
        float max = _Max(indices);
        for(int i=0; i<${n}; ++i)
        {
          norm_factor += exp(getColorAsFloat(${d.texture2D}(A, offsetToCoords(logical_row_start_offset + i,
            ${s}, ${u}))) - max);
        }

        return norm_factor;
      }`;return{...cb,output:{dims:a,type:t.type,textureType:0},shaderSource:p}},aO=(e,t,i,n,o,a)=>{let[s,u]=e.calculateTextureWidthAndHeight(t.dims,0),l=t.dims.length;if(i<1||n<1)throw Error("Logical row count N and feature count D must be greater than or equal to 1");if(1!==o.length||1!==a.length)throw Error("Dimensionality of the intermediate results should be 1");if(o[0]!==i||a[0]!==i)throw Error("Shape of the intermediate results should be equal to logical row count");let d=`
      float process(int[${l}] indices) {

      // get offset of current logical tensor index from the 2-D texture coordinates (TexCoords)
      int offset = coordsToOffset(TexCoords, ${s}, ${u});

      //determine the logical row for this index
      int logical_row_index[1];
      logical_row_index[0] = offset / ${n};

      float norm_factor = _Norm(logical_row_index);

      // avoid possible division by 0
      // if norm_facor is 0, all elements are zero
      // if so, return 0
      if(norm_factor == 0.0)
        return 0.0;

      return exp(_A(indices) - _Max(logical_row_index)) / norm_factor;
    }`;return{...db,output:{dims:t.dims,type:t.type,textureType:0},shaderSource:d}},bb=e=>{if(!e||1!==e.length)throw Error("Softmax requires 1 input.");if("float32"!==e[0].type&&"float64"!==e[0].type)throw Error("Invalid input type")}}),xb=k(()=>{"use strict";lt(),Me(),Ae(),_b={name:"Split",inputNames:["A"],inputTypes:[0]},vb=(e,t,i)=>{lO(t);let n=ne.normalizeAxis(i.axis,t[0].dims.length),o=sO(e,t,n,i),a=[];for(let s=0;s<o;++s)a.push(e.run({..._b,cacheHint:`${i.cacheKey};${s}`,get:()=>uO(e,t[0],i,n,s)},t));return a},wb=e=>{let t=e.attributes.getInt("axis",0),i=e.attributes.getInts("split",[]),n=e.outputs.length;return xe({axis:t,split:i,numOutputs:n})},sO=(e,t,i,n)=>{let[,o]=Eo.splitShape(t[0].dims,i,n.split,n.numOutputs);return o.length},uO=(e,t,i,n,o)=>{let[a,s]=Eo.splitShape(t.dims,n,i.split,i.numOutputs),u=s[o],l=a[o],d=`
      float process(int indices[${l.length}]) {
        indices[${n}] += ${u};
        return _A(indices);
      }
    `;return{..._b,cacheHint:`${i.cacheKey}:${o}`,output:{dims:l,type:t.type,textureType:0},shaderSource:d}},lO=e=>{if(!e||1!==e.length)throw Error("Split requires one input.");if("int8"!==e[0].type&&"uint8"!==e[0].type&&"int16"!==e[0].type&&"uint16"!==e[0].type&&"int32"!==e[0].type&&"uint32"!==e[0].type&&"float32"!==e[0].type&&"float64"!==e[0].type&&"bool"!==e[0].type)throw Error("Invalid input type.")}}),Sb=k(()=>{"use strict";Me(),jl=(e,t,i)=>{cO(t);let n=ne.squeezeShape(t[0].dims,i);return[e.reshapeUnpacked(t[0],n)]},Tb=(e,t)=>(dO(t),jl(e,[t[0]],Array.from(t[1].integerData))),Ib=e=>e.attributes.getInts("axes"),cO=e=>{if(!e||1!==e.length)throw Error("Squeeze requires 1 input.");if("string"===e[0].type)throw Error("invalid input tensor types.")},dO=e=>{if(!e||2!==e.length)throw Error("Squeeze requires 2 inputs.");if("int32"!==e[1].type)throw Error("Invalid input type.")}}),Ab=k(()=>{"use strict";Ke(),Ae(),$b=(e,t)=>{fO(t);let i={name:"Sum",inputNames:t.map((e,t)=>`X${t}`),inputTypes:Array(t.length).fill(0)};return[e.run({...i,get:()=>pO(e,t,i)},t)]},pO=(e,t,i)=>{let n=ue(e.session.backend.glContext.version),o=t[0].dims.slice(),a=`
      void main() {
        vec4 result = ${t.map((e,t)=>`${n.texture2D}(X${t},TexCoords)`).join(" + ")};
        ${n.output} = result;
      }
    `;return{...i,output:{dims:o,type:t[0].type,textureType:0},hasMain:!0,shaderSource:a}},fO=e=>{if(!e||0===e.length)throw Error("Sum requires inputs.");let t=e[0].dims.length;for(let i=1;i<e.length;i++){if(t!==e[i].dims.length)throw Error("Input shapes are mismatched.");for(let n=0;n<t;n++)if(e[0].dims[n]!==e[i].dims[n])throw Error("Input shapes are not matched.")}if("float32"!==e[0].type&&"float64"!==e[0].type)throw Error("Invalid input type.");for(let t=1;t<e.length;t++)if(e[0].type!==e[t].type)throw Error("Input types are not matched.")}}),Pb=k(()=>{"use strict";Ro(),Ae(),Ob=(e,t)=>{mO(t);let i={name:"Tile",inputNames:["A"],inputTypes:[0]};return[e.run({...i,get:()=>hO(e,t,i)},t)]},hO=(e,t,i)=>{let n=t[0].dims.slice(),o=Array(n.length),a=[];for(let e=0;e<n.length;e++)o[e]=n[e]*t[1].numberData[e],a.push(`inputIdx[${e}] = int(mod(float(outputIdx[${e}]), ${n[e]}.));`);let s=o.length,u=`
      float process(int outputIdx[${s}]) {
        int inputIdx[${s}];
        ${a.join(`
`)}
        return _A(inputIdx);
      }
    `;return{...i,output:{dims:o,type:t[0].type,textureType:0},shaderSource:u}},mO=e=>{if(!e||2!==e.length)throw Error("Tile requires 2 input.");if(1!==e[1].dims.length)throw Error("The second input shape must 1 dimension.");if(e[1].dims[0]!==e[0].dims.length)throw Error("Invalid input shape.");if(-1===gr.indexOf(e[0].type))throw Error("Invalid input type.");if("int32"!==e[1].type&&"int16"!==e[1].type)throw Error("Invalid repeat type.")}}),Db=k(()=>{"use strict";Me(),ql=(e,t,i)=>{gO(t);let n=ne.unsqueezeShape(t[0].dims,i);return[e.reshapeUnpacked(t[0],n)]},Eb=(e,t)=>(bO(t),ql(e,[t[0]],Array.from(t[1].integerData))),Cb=e=>e.attributes.getInts("axes"),gO=e=>{if(!e||1!==e.length)throw Error("Unsqueeze requires 1 input.");if("string"===e[0].type)throw Error("invalid input tensor types.")},bO=e=>{if(!e||2!==e.length)throw Error("Unsqueeze requires 2 inputs.");if("int32"!==e[1].type)throw Error("Invalid input type.")}}),Nb=k(()=>{"use strict";Wh(),rm(),am(),pm(),Ui(),Xm(),tg(),og(),sg(),dg(),hg(),yg(),xg(),Wi(),$g(),Bg(),qg(),Xg(),tb(),rb(),ub(),yb(),xb(),Sb(),Ab(),Pb(),ji(),El(),Db(),Gl(),kb=[["Abs","","6+",fm],["Acos","","7+",hm],["Add","","7+",Hh],["And","","7+",jh],["Asin","","7+",mm],["Atan","","7+",gm],["AveragePool","","7+",Og,Pg],["BatchNormalization","","7+",Gh,Uh],["Cast","","6+",om,im],["Ceil","","6+",_m],["Clip","","6-10",Ol,bm],["Clip","","11+",ym],["Concat","","4+",lm,dm],["Conv","","1+",Rl,zl],["ConvTranspose","","1+",qm,Km],["Cos","","7+",vm],["Div","","7+",qh],["Dropout","","7+",Pl],["DepthToSpace","","1+",Qm,eg],["Equal","","7+",Kh],["Elu","","6+",wm,xm],["Exp","","6+",Tm],["Flatten","","1+",ng,rg],["Floor","","6+",Im],["FusedConv","com.microsoft","1+",Rl,zl],["Gather","","1+",ig,ag],["Gemm","","7-10",Ml,lg],["Gemm","","11+",Ml,cg],["GlobalAveragePool","","1+",Cg,Dg],["GlobalMaxPool","","1+",zg],["Greater","","7+",Xh],["Identity","","1+",Pl],["ImageScaler","","1+",pg,fg],["InstanceNormalization","","6+",gg,bg],["LeakyRelu","","6+",Sm,$m],["Less","","7+",Zh],["LRN","","1+",_g,vg],["Log","","6+",Am],["MatMul","","1+",Fm,Vm],["MaxPool","","1+",kg,Ng],["Mul","","7+",Jh],["Neg","","6+",Om],["Not","","1+",Pm],["Or","","7+",Yh],["Pad","","2-10",Bl,Tg],["Pad","","11+",Ig,Sg],["Pow","","7+",Qh],["PRelu","","7+",em],["ReduceLogSum","","1+",Hg,br],["ReduceMax","","1+",Gg,br],["ReduceMean","","1+",Vg,br],["ReduceMin","","1+",Ug,br],["ReduceProd","","1+",Wg,br],["ReduceSum","","1-12",Fg,br],["ReduceSumSquare","","1+",jg,br],["Relu","","6+",Em],["Reshape","","5+",Kg],["Resize","","10",Wl,Qg],["Resize","","11+",Wl,eb],["Shape","","1+",nb],["Sigmoid","","6+",Cm],["Sin","","7+",Dm],["Slice","","10+",sb],["Slice","","1-9",ob,ib],["Softmax","","1-12",pb,fb],["Softmax","","13+",mb,hb],["Split","","2-12",vb,wb],["Sqrt","","6+",km],["Squeeze","","1-12",jl,Ib],["Squeeze","","13+",Tb],["Sub","","7+",tm],["Sum","","6+",$b],["Tan","","7+",Nm],["Tanh","","6+",Lm],["Tile","","6+",Ob],["Transpose","","1+",Fr,Jm],["Upsample","","7-8",Fl,Jg],["Upsample","","9",Fl,Yg],["Unsqueeze","","1-12",ql,Cb],["Unsqueeze","","13+",Eb],["Xor","","7+",nm]]});function Rb(e){let t={},i;for(;null!==(i=Lb.exec(e));){let e=i[3].split(",").map(e=>{let t=e.trim().split(" ");return t&&2===t.length?{type:t[0],name:t[1]}:null}).filter(e=>null!==e);t[i[2]]={params:e,body:i[4]}}for(let n in t){let o=RegExp(yO.replace("__FUNC__",n),"gm");for(;null!==(i=o.exec(e));){let o=i[1],a=i[2],s=i[3].split(","),u=o?`${o} ${a};`:"",l=t[n].body,d="";t[n].params.forEach((e,t)=>{e&&(d+=`${e.type} ${e.name} = ${s[t]};
`)}),l=(l=`${d}
 ${l}`).replace("return",`${a} = `);let p=`
      ${u}
      {
        ${l}
      }
      `;e=e.replace(i[0],p)}}return e.replace(Lb,"")}var Lb,yO,zb=k(()=>{"use strict";Lb=/@inline[\s\n\r]+(\w+)[\s\n\r]+([0-9a-zA-Z_]+)\s*\(([^)]*)\)\s*{(([^}]|[\n\r])*)}/gm,yO="(\\w+)?\\s+([_0-9a-zA-Z]+)\\s+=\\s+__FUNC__\\((.*)\\)\\s*;"});function uo(e,t){let i=[],n=[],o=null!=t&&Array.isArray(t)&&0===t.length,a=null==t||o?null:_O(t,e).sort(),s=0;for(let t=0;t<e.length;++t){if(null!=a){if(a[s]===t&&1!==e[t])throw Error(`Can't squeeze axis ${t} since its dim '${e[t]}' is not 1`);(null==a[s]||a[s]>t)&&1===e[t]&&(i.push(e[t]),n.push(t)),a[s]<=t&&s++}1!==e[t]&&(i.push(e[t]),n.push(t))}return{newShape:i,keptDims:n}}function _O(e,t){let i=t.length;return no((e=null==e?t.map((e,t)=>t):[].concat(e)).every(e=>e>=-i&&e<i),()=>`All values in axis param must be in range [-${i}, ${i}) but got axis ${e}`),no(e.every(vO),()=>`All values in axis param must be integers but got axis ${e}`),e.map(e=>e<0?i+e:e)}function vO(e){return e%1==0}function wO(e){if(0===e.length)return 1;let t=e[0];for(let i=1;i<e.length;i++)t*=e[i];return t}function Mb(e){let t=Math.ceil(Math.sqrt(e));return[t,Math.ceil(e/t)]}var Zi,Ji,Yi,Qi,ea,ta,Xl,na,ra,oa,ia,Kl=k(()=>{"use strict";Ct(),Me(),Zi=class{constructor(e){this.maxTextureSize=e}computeTextureWH(e,t){let i=this.computeTexture(e,t);return t&&t.isPacked&&(i[0]/=2,i[1]/=2),t&&t.reverseWH?[i[1],i[0]]:i}computeTexture(e,t){let i=t&&t.isPacked;if(0===e.length)return i?[2,2]:[1,1];let n=this.maxTextureSize;if(t&&void 0!==t.breakAxis){let i=t.breakAxis>=e.length?1:e.slice(t.breakAxis).reduce((e,t)=>e*t),o=t.breakAxis<=0?1:e.slice(0,t.breakAxis).reduce((e,t)=>e*t);if(!(i>n)&&!(o>n))return[i,o];Fe.verbose("TextureLayout",`Given width/height preferences were unattainable: shape:${e}, breakAxis:${t.breakAxis}`)}let o=e.slice(0);i&&(n*=2,1===(o=o.map((e,t)=>t>=o.length-2?o[t]%2==0?o[t]:o[t]+1:o[t])).length&&(o=[2,o[0]])),2!==o.length&&(o=uo(o).newShape);let a=wO(o);return o.length<=1&&a<=n?[1,a]:2===o.length&&o[0]<=n&&o[1]<=n?o:3===o.length&&o[0]*o[1]<=n&&o[2]<=n?[o[0]*o[1],o[2]]:3===o.length&&o[0]<=n&&o[1]*o[2]<=n?[o[0],o[1]*o[2]]:4===o.length&&o[0]*o[1]*o[2]<=n&&o[3]<=n?[o[0]*o[1]*o[2],o[3]]:4===o.length&&o[0]<=n&&o[1]*o[2]*o[3]<=n?[o[0],o[1]*o[2]*o[3]]:i?Mb(a/4).map(e=>2*e):Mb(a)}}}),Bb=k(()=>{"use strict";Me(),Jn(),Ke(),Kl(),Nn(),Ji=class extends zt{constructor(e){super(e)}getFunctions(){return{...this.offsetToCoords(),...this.coordsToOffset(),...this.toVec(),...this.valueFrom(),...this.getCommonUtilFuncs(),...this.getInputsSamplingSnippets(),...this.getOutputSamplingSnippet()}}getCustomTypes(){return{}}offsetToCoords(){let e="offsetToCoords";return{offsetToCoords:new Y(`
      vec2 ${e}(int offset, int width, int height) {
        int t = offset / width;
        int s = offset - t*width;
        vec2 coords = (vec2(s,t) + vec2(0.5,0.5)) / vec2(width, height);
        return coords;
      }
      `)}}coordsToOffset(){let e="coordsToOffset";return{coordsToOffset:new Y(`
      int ${e}(vec2 coords, int width, int height) {
        float s = coords.s * float(width);
        float t = coords.t * float(height);
        int offset = int(t) * width + int(s);
        return offset;
      }
      `)}}getOutputSamplingSnippet(){let e=this.context.outputTextureLayout;return e.isPacked?this.getPackedOutputSamplingSnippet(e):this.getUnpackedOutputSamplingSnippet(e)}getPackedOutputSamplingSnippet(e){let t=e.unpackedShape,i=[e.width,e.height],n={},o="getOutputCoords";switch(t.length){case 0:n[o]=this.getOutputScalarCoords();break;case 1:n[o]=this.getOutputPacked1DCoords(t,i);break;case 2:n[o]=this.getOutputPacked2DCoords(t,i);break;case 3:n[o]=this.getOutputPacked3DCoords(t,i);break;default:n[o]=this.getOutputPackedNDCoords(t,i)}let a=`
      void setOutput(vec4 val) {
        ${ue(this.context.glContext.version).output} = val;
      }
    `;return n.floatTextureSetRGBA=new Y(a),n}getUnpackedOutputSamplingSnippet(e){let t=e.unpackedShape,i=[e.width,e.height],n={},o="getOutputCoords";switch(t.length){case 0:n[o]=this.getOutputScalarCoords();break;case 1:n[o]=this.getOutputUnpacked1DCoords(t,i);break;case 2:n[o]=this.getOutputUnpacked2DCoords(t,i);break;case 3:n[o]=this.getOutputUnpacked3DCoords(t,i);break;case 4:n[o]=this.getOutputUnpacked4DCoords(t,i);break;case 5:n[o]=this.getOutputUnpacked5DCoords(t,i);break;case 6:n[o]=this.getOutputUnpacked6DCoords(t,i);break;default:throw Error(`Unsupported output dimensionality: ${t.length}`)}let a=`
        void setOutput(float val) {
          ${ue(this.context.glContext.version).output} = vec4(val, 0, 0, 0);
        }
    `;return n.floatTextureSetR=new Y(a),n}getOutputScalarCoords(){return new Y(`
      int getOutputCoords() {
        return 0;
      }
    `)}getOutputPacked1DCoords(e,t){let i=t,n="";return n=1===i[0]?`
          int getOutputCoords() {
            return 2 * int(TexCoords.y * ${i[1]}.0);
          }
        `:1===i[1]?`
          int getOutputCoords() {
            return 2 * int(TexCoords.x * ${i[0]}.0);
          }
        `:`
        int getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                 vec2(${i[0]}, ${i[1]}));
          return 2 * (resTexRC.y * ${i[0]} + resTexRC.x);
        }
      `,new Y(n)}getOutputPacked2DCoords(e,t){let i="";if(kr.arraysEqual(e,t))return i=`
        ivec2 getOutputCoords() {
          return 2 * ivec2(TexCoords.xy * vec2(${t[0]}, ${t[1]}));
        }
      `,new Y(i);let n=t,o=Math.ceil(e[1]/2);return i=`
        ivec2 getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                vec2(${n[0]}, ${n[1]}));

          int index = resTexRC.y * ${n[0]} + resTexRC.x;

          // reverse r and c order for packed texture
          int r = imod(index, ${o}) * 2;
          int c = 2 * (index / ${o});

          return ivec2(r, c);
        }
      `,new Y(i)}getOutputPacked3DCoords(e,t){let i=[t[0],t[1]],n=Math.ceil(e[2]/2),o=n*Math.ceil(e[1]/2),a=`
        ivec3 getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                vec2(${i[0]}, ${i[1]}));
          int index = resTexRC.y * ${i[0]} + resTexRC.x;

          int b = index / ${o};
          index -= b * ${o};

          // reverse r and c order for packed texture
          int r = imod(index, ${n}) * 2;
          int c = 2 * (index / ${n});

          return ivec3(b, r, c);
        }
      `;return new Y(a)}getOutputPackedNDCoords(e,t){let i=[t[0],t[1]],n=Math.ceil(e[e.length-1]/2),o=n*Math.ceil(e[e.length-2]/2),a=o,s="",u="b, r, c";for(let t=2;t<e.length-1;t++)a*=e[e.length-t-1],s=`
      int b${t} = index / ${a};
      index -= b${t} * ${a};
    `+s,u=`b${t}, `+u;let l=`
      ivec${e.length} getOutputCoords() {
        ivec2 resTexRC = ivec2(TexCoords.xy *
                              vec2(${i[0]}, ${i[1]}));
        int index = resTexRC.y * ${i[0]} + resTexRC.x;

        ${s}

        int b = index / ${o};
        index -= b * ${o};

        // reverse r and c order for packed texture
        int r = imod(index, ${n}) * 2;
        int c = 2 * (index / ${n});

        return ivec${e.length}(${u});
      }
    `;return new Y(l)}getOutputUnpacked1DCoords(e,t){let i=`
        int getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                vec2(${t[0]}, ${t[1]}));
          return resTexRC.y * ${t[0]} + resTexRC.x;
        }
      `;return new Y(i)}getOutputUnpacked2DCoords(e,t){let i=`
        ivec2 getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                vec2(${t[0]}, ${t[1]}));
          int index = resTexRC.y * ${t[0]} + resTexRC.x;
          int r = index / ${e[1]};
          int c = index - r * ${e[1]};
          return ivec2(r, c);
        }
      `;return new Y(i)}getOutputUnpacked3DCoords(e,t){let i="",n=e.length,o=null;n<2&&(o=[]),(o=Array(n-1))[n-2]=e[n-1];for(let t=n-3;t>=0;--t)o[t]=o[t+1]*e[t+1];let a=["r","c","d"],s=o.map((e,t)=>{let i=`int ${a[t]} = index / ${e}`,n=t===o.length-1?`int ${a[t+1]} = index - ${a[t]} * ${e}`:`index -= ${a[t]} * ${e}`;return`${i}; ${n};`}).join("");return i=`
        ivec3 getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                vec2(${t[0]}, ${t[1]}));
          int index = resTexRC.y * ${t[0]} + resTexRC.x;
          ${s}
          return ivec3(r, c, d);
        }
      `,new Y(i)}getOutputUnpacked4DCoords(e,t){let i="",n=e.length,o=null;n<2&&(o=[]),(o=Array(n-1))[n-2]=e[n-1];for(let t=n-3;t>=0;--t)o[t]=o[t+1]*e[t+1];let a=["r","c","d","d2"],s=o.map((e,t)=>{let i=`int ${a[t]} = index / ${e}`,n=t===o.length-1?`int ${a[t+1]} = index - ${a[t]} * ${e}`:`index -= ${a[t]} * ${e}`;return`${i}; ${n};`}).join("");return i=`
      ivec4 getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                vec2(${t[0]}, ${t[1]}));
          int index = resTexRC.y * ${t[0]} + resTexRC.x;
          ${s}
          return ivec4(r, c, d, d2);
        }
      `,new Y(i)}getOutputUnpacked5DCoords(e,t){let i="",n=e.length,o=null;n<2&&(o=[]),(o=Array(n-1))[n-2]=e[n-1];for(let t=n-3;t>=0;--t)o[t]=o[t+1]*e[t+1];let a=["r","c","d","d2","d3"],s=o.map((e,t)=>{let i=`int ${a[t]} = index / ${e}`,n=t===o.length-1?`int ${a[t+1]} = index - ${a[t]} * ${e}`:`index -= ${a[t]} * ${e}`;return`${i}; ${n};`}).join("");return i=`
      ivec5 getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                vec2(${t[0]}, ${t[1]}));
          int index = resTexRC.y * ${t[0]} + resTexRC.x;
          ${s}
          return ivec5(r, c, d, d2, d3);
        }
      `,new Y(i)}getOutputUnpacked6DCoords(e,t){let i="",n=e.length,o=null;n<2&&(o=[]),(o=Array(n-1))[n-2]=e[n-1];for(let t=n-3;t>=0;--t)o[t]=o[t+1]*e[t+1];let a=["r","c","d","d2","d3","d4"],s=o.map((e,t)=>{let i=`int ${a[t]} = index / ${e}`,n=t===o.length-1?`int ${a[t+1]} = index - ${a[t]} * ${e}`:`index -= ${a[t]} * ${e}`;return`${i}; ${n};`}).join("");return i=`
     ivec6 getOutputCoords() {
         ivec2 resTexRC = ivec2(TexCoords.xy *
                               vec2(${t[0]}, ${t[1]}));
         int index = resTexRC.y * ${t[0]} + resTexRC.x;
         ${s}
         return ivec6(r, c, d, d2, d3, d4);
       }
     `,new Y(i)}getCommonUtilFuncs(){let e={},t="uvFromFlat";e[t]=new Y(`
    vec2 uvFromFlat(int texNumR, int texNumC, int index) {
      int texC = index / texNumR;
      int texR = index - texC * texNumR;
      // TODO: swap texR, texC order in following function so row is corresponding to u and column is corresponding to
      //       v.
      return (vec2(texR, texC) + halfCR) / vec2(texNumR, texNumC);
    }
    `),e[t="packedUVfrom1D"]=new Y(`
      vec2 packedUVfrom1D(int texNumR, int texNumC, int index) {
        int texelIndex = index / 2;
        int texR = texelIndex / texNumC;
        int texC = texelIndex - texR * texNumC;
        return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
      }
      `),e[t="packedUVfrom2D"]=new Y(`
      vec2 packedUVfrom2D(int texNumR, int texNumC, int texelsInLogicalRow, int row, int col) {
        int texelIndex = (row / 2) * texelsInLogicalRow + (col / 2);
        int texR = texelIndex / texNumC;
        int texC = texelIndex - texR * texNumC;
        return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
      }
      `),e[t="packedUVfrom3D"]=new Y(`
      vec2 packedUVfrom3D(int texNumR, int texNumC,
          int texelsInBatch, int texelsInLogicalRow, int b,
          int row, int col) {
        int index = b * texelsInBatch + (row / 2) * texelsInLogicalRow + (col / 2);
        int texR = index / texNumC;
        int texC = index - texR * texNumC;
        return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
      }
      `),t="sampleTexture";let i=ue(this.context.glContext.version);return e[t]=new Y(`
        float sampleTexture(sampler2D textureSampler, vec2 uv) {
            return ${i.texture2D}(textureSampler, uv).r;
        }`),e}getInputsSamplingSnippets(){let e={},t=this.context.outputTextureLayout;return this.context.programInfo.inputNames.forEach((i,n)=>{let o=this.context.inputTextureLayouts[n],a=Ri(i);o.isPacked?e[a]=this.getPackedSamplerFromInput(a,i,o):e[a]=this.getUnpackedSamplerFromInput(a,i,o);let s=$h(i);o.unpackedShape.length<=t.unpackedShape.length&&(o.isPacked?e[s]=this.getPackedSamplerAtOutputCoords(s,o,t,i):e[s]=this.getUnpackedSamplerAtOutputCoords(s,o,t,i))}),e}getPackedSamplerAtOutputCoords(e,t,i,n){let o=t.unpackedShape,a=i.unpackedShape,s=Ri(n),u=o.length,l=a.length,d=gt.getBroadcastDims(o,a),p=bt(l),c=l-u,h,f=qt();h=0===u?"":l<2&&d.length>=1?"coords = 0;":d.map(e=>`coords.${f[e+c]} = 0;`).join(`
`);let m="";m=l<2&&u>0?"coords":o.map((e,t)=>`coords.${f[t+c]}`).join(", ");let g="return outputValue;",b=1===ne.size(o),y=1===ne.size(a);if(1!==u||b||y){if(b&&!y)g=1===l?`
          return vec4(outputValue.x, outputValue.x, 0., 0.);
        `:`
          return vec4(outputValue.x);
        `;else if(d.length){let e=u-2,t=u-1;d.indexOf(e)>-1&&d.indexOf(t)>-1?g="return vec4(outputValue.x);":d.indexOf(e)>-1?g="return vec4(outputValue.x, outputValue.y, outputValue.x, outputValue.y);":d.indexOf(t)>-1&&(g="return vec4(outputValue.xx, outputValue.zz);")}}else g=`
        return vec4(outputValue.xy, outputValue.xy);
      `;let _=`
        int lastDim = coords.${f[l-1]};
        coords.${f[l-1]} = coords.${f[l-2]};
        coords.${f[l-2]} = lastDim;
      `,v=`
      vec4 ${e}() {
        ${p} coords = getOutputCoords();
        ${_}
        ${h}
        vec4 outputValue = ${s}(${m});
        ${g}
      }
    `;return new Y(v,["coordinates.getOutputCoords"])}getUnpackedSamplerAtOutputCoords(e,t,i,n){let o=[i.width,i.height],a=[t.width,t.height],s=t.unpackedShape.length,u=i.unpackedShape.length,l=t.unpackedShape,d=i.unpackedShape,p=Ri(n);if(s===u&&kr.arraysEqual(a,o)){let t=`
          float ${e}() {
            return sampleTexture(${n}, TexCoords);
          }
        `;return new Y(t,["coordinates.sampleTexture"])}let c=bt(u),h=gt.getBroadcastDims(l,d),f=u-s,m,g=qt();m=0===s?"":u<2&&h.length>=1?"coords = 0;":h.map(e=>`coords.${g[e+f]} = 0;`).join(`
`);let b="";b=u<2&&s>0?"coords":t.unpackedShape.map((e,t)=>`coords.${g[t+f]}`).join(", ");let y=`
        float ${e}() {
          ${c} coords = getOutputCoords();
          ${m}
          return ${p}(${b});
        }
      `;return new Y(y,["coordinates.getOutputCoords"])}getPackedSamplerFromInput(e,t,i){switch(i.unpackedShape.length){case 0:return this.getPackedSamplerScalar(e,t);case 1:return this.getPackedSampler1D(e,t,i);case 2:return this.getPackedSampler2D(e,t,i);case 3:return this.getPackedSampler3D(e,t,i);default:return this.getPackedSamplerND(e,t,i)}}getUnpackedSamplerFromInput(e,t,i){let n=i.unpackedShape;switch(n.length){case 0:return this.getUnpackedSamplerScalar(e,t,i);case 1:return this.getUnpackedSampler1D(e,t,i);case 2:return this.getUnpackedSampler2D(e,t,i);case 3:return this.getUnpackedSampler3D(e,t,i);case 4:return this.getUnpackedSampler4D(e,t,i);case 5:return this.getUnpackedSampler5D(e,t,i);case 6:return this.getUnpackedSampler6D(e,t,i);default:throw Error(`Unsupported dimension ${n.length}-D`)}}getPackedSamplerScalar(e,t){let i=ue(this.context.glContext.version),n=`
          vec4 ${e}() {
            return ${i.texture2D}(${t}, halfCR);
          }
        `;return new Y(n)}getPackedSampler1D(e,t,i){let n=[i.width,i.height],o=[n[1],n[0]],a=ue(this.context.glContext.version),s=`vec4 ${e}(int index) {
      vec2 uv = packedUVfrom1D(
      ${o[0]}, ${o[1]}, index);
      return ${a.texture2D}(${t}, uv);
    }`;return new Y(s,["coordinates.packedUVfrom1D"])}getPackedSampler2D(e,t,i){let n=i.unpackedShape,o=[i.width,i.height],a=ue(this.context.glContext.version),s=o[0],u=o[1];if(null!=o&&kr.arraysEqual(n,o)){let i=`vec4 ${e}(int row, int col) {
        vec2 uv = (vec2(col, row) + halfCR) / vec2(${u}.0, ${s}.0);
        return ${a.texture2D}(${t}, uv);
      }`;return new Y(i)}let l=o,d=Math.ceil(n[1]/2),p=`vec4 ${e}(int row, int col) {
      vec2 uv = packedUVfrom2D(${l[1]}, ${l[0]}, ${d}, row, col);
      return ${a.texture2D}(${t}, uv);
    }`;return new Y(p,["coordinates.packedUVfrom2D"])}getPackedSampler3D(e,t,i){let n=i.unpackedShape,o=[i.width,i.height],a=[o[0],o[1]],s=ue(this.context.glContext.version);if(1===n[0]){let o=n.slice(1),a=[1,2],s=ro(n,o),u=["b","row","col"],l=JSON.parse(JSON.stringify(i));l.unpackedShape=s;let d=this.getPackedSamplerFromInput(e,t,l),p=`${d.routineBody}
      vec4 ${e}(int b, int row, int col) {
        return ${e}(${oo(u,a)});
      } `;return new Y(p,d.dependencies)}let u=a[0],l=a[1],d=Math.ceil(n[2]/2),p=d*Math.ceil(n[1]/2),c=`vec4 ${e}(int b, int row, int col) {
      vec2 uv = packedUVfrom3D(
        ${l}, ${u}, ${p}, ${d}, b, row, col);
      return ${s.texture2D}(${t}, uv);}`;return new Y(c,["coordinates.packedUVfrom3D"])}getPackedSamplerND(e,t,i){let n=i.unpackedShape,o=n.length,a=[i.width,i.height],s=ue(this.context.glContext.version),u=[a[0],a[1]],l=u[1],d=u[0],p=Math.ceil(n[o-1]/2),c=p*Math.ceil(n[o-2]/2),h="int b, int row, int col",f=`b * ${c} + (row / 2) * ${p} + (col / 2)`;for(let e=2;e<o-1;e++)h=`int b${e}, `+h,c*=n[o-e-1],f=`b${e} * ${c} + `+f;let m=`vec4 ${e}(${h}) {
      int index = ${f};
      int texR = index / ${d};
      int texC = index - texR * ${d};
      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(${d}, ${l});
      return ${s.texture2D}(${t}, uv);
    }`;return new Y(m)}getUnpackedSamplerScalar(e,t,i){let[n,o]=[i.width,i.height];if(1===n&&1===o){let i=`
          float ${e}() {
            return sampleTexture(${t}, halfCR);
          }
        `;return new Y(i,["coordinates.sampleTexture"])}let a=`
        float ${e}() {
          int offset_${t} = coordsToOffset(TexCoords, ${n}, ${o});
          vec2 uv = uvFromFlat(${n}, ${o}, offset_${t});
          return sampleTexture(${t}, uv);
        }
      `;return new Y(a,["coordinates.uvFromFlat","coordinates.sampleTexture","coordinates.coordsToOffset"])}getUnpackedSampler1D(e,t,i){let n=i.width,o=i.height;if(1===o&&1===n){let i=`
        float ${e}(int index) {
          return sampleTexture(${t}, halfCR);
        }
      `;return new Y(i,["coordinates.sampleTexture"])}if(1===o){let i=`
          float ${e}(int index) {
            vec2 uv = vec2((float(index) + 0.5) / ${n}.0, 0.5);
            return sampleTexture(${t}, uv);
          }
        `;return new Y(i,["coordinates.sampleTexture"])}if(1===n){let i=`
          float ${e}(int index) {
            vec2 uv = vec2(0.5, (float(index) + 0.5) / ${o}.0);
            return sampleTexture(${t}, uv);
          }
        `;return new Y(i,["coordinates.sampleTexture"])}let a=`
        float ${e}(int index) {
          vec2 uv = uvFromFlat(${n}, ${o}, index);
          return sampleTexture(${t}, uv);
        }
      `;return new Y(a,["coordinates.uvFromFlat","coordinates.sampleTexture"])}getUnpackedSampler2D(e,t,i){let n=i.unpackedShape,o=[i.height,i.width];if(null!=o&&kr.arraysEqual(n,o)){let i=o[1],n=o[0],a=`
          float ${e}(int row, int col) {
            vec2 uv = (vec2(row, col) + halfCR) / vec2(${i}.0, ${n}.0);
            return sampleTexture(${t}, uv);
          }
        `;return new Y(a,["coordinates.sampleTexture"])}let{newShape:a,keptDims:s}=uo(n),u=a;if(u.length<n.length){let o=ro(n,u),a=JSON.parse(JSON.stringify(i));a.unpackedShape=o;let l=["col","row"],d=`
          ${this.getUnpackedSamplerFromInput(e,t,a).routineBody}
          float ${e}(int row, int col) {
            return ${e}(${oo(l,s)});
          }
        `;return new Y(d,["coordinates.sampleTexture"])}let l=o[1],d=o[0];if(1===d){let i=`
          float ${e}(int row, int col) {
            int offset_${t} = coordsToOffset(TexCoords, ${l}, ${d});
            float index = dot(vec3(row, col, offset_${t}), vec3(${n[1]}, 1, 1));
            vec2 uv = vec2(0.5, (index + 0.5) / ${l}.0);
            return sampleTexture(${t}, uv);
          }
        `;return new Y(i,["coordinates.sampleTexture","coordinates.coordsToOffset"])}if(1===l){let i=`
          float ${e}(int row, int col) {
            int offset_${t} = coordsToOffset(TexCoords, ${l}, ${d});
            float index = dot(vec3(row, col, offset_${t}), vec3(${n[1]}, 1, 1));
            vec2 uv = vec2((index + 0.5) / ${d}.0, 0.5);
            return sampleTexture(${t}, uv);
          }
        `;return new Y(i,["coordinates.sampleTexture","coordinates.coordsToOffset"])}let p=`
        float ${e}(int row, int col) {
          int index = col * ${n[1]} + row;
          vec2 uv = uvFromFlat(${l}, ${d}, index);
          return sampleTexture(${t}, uv);
        }
      `;return new Y(p,["coordinates.uvFromFlat","coordinates.sampleTexture","coordinates.coordsToOffset"])}getUnpackedSampler3D(e,t,i){let n=i.unpackedShape,o=n[1]*n[2],a=n[2],{newShape:s,keptDims:u}=uo(n),l=s;if(l.length<n.length){let o=ro(n,l),a=["batch","col","row"],s=JSON.parse(JSON.stringify(i));s.unpackedShape=o;let d=this.getUnpackedSamplerFromInput(e,t,s),p=u.reverse(),c=`
          ${d.routineBody}
          float ${e}(int batch, int row, int col) {
            return ${e}(${oo(a,p)});
          }
        `;return new Y(c,d.dependencies)}let d=i.width,p=i.height,c=`
          float ${e}(int depth, int row, int col) {
            // Explicitly use integer operations as dot() only works on floats.
            int index = depth * ${o} + col * ${a} + row;
            vec2 uv = uvFromFlat(${d}, ${p}, index);
            return sampleTexture(${t}, uv);
          }
      `;return new Y(c,["coordinates.uvFromFlat","coordinates.sampleTexture","coordinates.coordsToOffset"])}getUnpackedSampler4D(e,t,i){let n=i.unpackedShape,o=n[3],a=n[2]*o,s=n[1]*a,u=i.width,l=i.height,d=`
        float ${e}(int row, int col, int depth, int depth2) {
          int index = row * ${s} + col * ${a} +
              depth2 * ${o} + depth;
          vec2 uv = uvFromFlat(${u}, ${l}, index);
          return sampleTexture(${t}, uv);
        }
      `;return new Y(d,["coordinates.uvFromFlat","coordinates.sampleTexture"])}getUnpackedSampler5D(e,t,i){let n=i.unpackedShape,o=n[4],a=n[3]*o,s=n[2]*a,u=n[1]*s,{newShape:l,keptDims:d}=uo(n);if(l.length<n.length){let o=ro(n,l),a=["row","col","depth","depth2","depth3"],s=JSON.parse(JSON.stringify(i));s.unpackedShape=o;let u=`
          ${this.getUnpackedSamplerFromInput(e,t,s).routineBody}
          float ${e}(int row, int col, int depth, int depth2, int depth3) {
            return ${e}(${oo(a,d)});
          }
        `;return new Y(u,["coordinates.sampleTexture","coordinates.uvFromFlat"])}let p=i.width,c=i.height,h=`
        float ${e}(int row, int col, int depth, int depth2, int depth3) {
          int index = row * ${u} + col * ${s} + depth * ${a} +
          depth3 * ${o} + depth2;
          vec2 uv = uvFromFlat(${p}, ${c}, index);
          return sampleTexture(${t}, uv);
        }
      `;return new Y(h,["coordinates.sampleTexture","coordinates.uvFromFlat"])}getUnpackedSampler6D(e,t,i){let n=i.unpackedShape,o=n[5],a=n[4]*o,s=n[3]*a,u=n[2]*s,l=n[1]*u,{newShape:d,keptDims:p}=uo(n);if(d.length<n.length){let o=ro(n,d),a=["row","col","depth","depth2","depth3","depth4"],s=JSON.parse(JSON.stringify(i));s.unpackedShape=o;let u=`
            ${this.getUnpackedSamplerFromInput(e,t,s).routineBody}
            float ${e}(int row, int col, int depth,
              int depth2, int depth3, int depth4) {
              return ${e}(${oo(a,p)});
            }
          `;return new Y(u,["coordinates.sampleTexture","coordinates.uvFromFlat"])}let c=i.width,h=i.height,f=`
          float ${e}(int row, int col, int depth,
            int depth2, int depth3, int depth4) {
            int index = row * ${l} + col * ${u} + depth * ${s} +
            depth2 * ${a} + depth3 * ${o} + depth4;
            vec2 uv = uvFromFlat(${c}, ${h}, index);
            return sampleTexture(${t}, uv);
          }
        `;return new Y(f,["coordinates.uvFromFlat","coordinates.sampleTexture","coordinates.coordsToOffset"])}toVec(){let e=this.context.outputTextureLayout,t=e.shape.length,i=e.strides,n=e.width,o=e.height,a=[];for(let e=0;e<t-1;++e)a.push(`
        c[${e}] = offset / ${i[e]};`),a.push(`
        offset -= c[${e}] * ${i[e]};`);a.push(`
        c[${t-1}] = offset;`);let s=`
      void toVec(vec2 texCoords, out int c[${t}]) {
        int offset = coordsToOffset(texCoords, ${n}, ${o});
        ${a.join("")}
      }
      void toVec(int offset, out int c[${t}]) {
        ${a.join("")}
      }
    `;return{toVec:new Y(s,["coordinates.coordsToOffset"])}}valueFrom(){let e={};return this.context.programInfo.inputNames.forEach((t,i)=>{let n=this.context.inputTextureLayouts[i],o=(n.unpackedShape.length>0?n.unpackedShape:n.shape).length,a=`_${t}`;e[a]=new Y(this.getValueFromSingle(t,o,n.width,n.height,!1),[`shapeUtils.indicesToOffset${a}`,"coordinates.offsetToCoords","fragcolor.getColorAsFloat"]),e[a+="_T"]=new Y(this.getValueFromSingle(t,o,n.width,n.height,!0),[`shapeUtils.indicesToOffset${a}`,"coordinates.offsetToCoords","fragcolor.getColorAsFloat"])}),e}getValueFromSingle(e,t,i,n,o){let a=`_${e}`;o&&(a+="_T");let s=ue(this.context.glContext.version);return`
        float ${a}(int m[${t}]) {
          int offset = indicesToOffset${a}(m);
          vec2 coords = offsetToCoords(offset, ${i}, ${n});
          float value = getColorAsFloat(${s.texture2D}(${e}, coords));
          return value;
        }
        `}getPackedValueFrom(e,t,i,n,o){let a=`_${e}_Pack`;o&&(a+="_T");let s=ue(this.context.glContext.version);return`
        vec4 ${a}(int m[${t}]) {
          int offset = indicesToOffset_${e}(m);
          vec2 coords = offsetToCoords(offset, ${i}, ${n});
          return ${s.texture2D}(${e}, coords);
        }
        `}}}),Fb=k(()=>{"use strict";Jn(),Yi=class e extends zt{constructor(e){super(e)}getFunctions(){return{...this.encodeFloat32(),...this.decodeFloat32()}}getCustomTypes(){return{}}encodeFloat32(){return{encode:new Y(`highp vec4 encode(highp float f) {
        return vec4(f, 0.0, 0.0, 0.0);
      }
        `)}}decodeFloat32(){return{decode:new Y(`highp float decode(highp vec4 rgba) {
        return rgba.r;
      }
        `)}}encodeUint8(){let t=e.isLittleEndian()?"rgba.rgba=rgba.abgr;":"";return{encode:new Y(`
      highp vec4 encode(highp float f) {
        highp float F = abs(f);
        highp float Sign = step(0.0,-f);
        highp float Exponent = floor(log2(F));
        highp float Mantissa = (exp2(- Exponent) * F);
        Exponent = floor(log2(F) + 127.0) + floor(log2(Mantissa));
        highp vec4 rgba;
        rgba[0] = 128.0 * Sign  + floor(Exponent*exp2(-1.0));
        rgba[1] = 128.0 * mod(Exponent,2.0) + mod(floor(Mantissa*128.0),128.0);
        rgba[2] = floor(mod(floor(Mantissa*exp2(23.0 -8.0)),exp2(8.0)));
        rgba[3] = floor(exp2(23.0)*mod(Mantissa,exp2(-15.0)));
        ${t}
        rgba = rgba / 255.0; // values need to be normalized to [0,1]
        return rgba;
    }
        `)}}decodeUint8(){let t=e.isLittleEndian()?"rgba.rgba=rgba.abgr;":"";return{decode:new Y(`
        highp float decode(highp vec4 rgba) {
          rgba = rgba * 255.0; // values need to be de-normalized from [0,1] to [0,255]
          ${t}
          highp float Sign = 1.0 - step(128.0,rgba[0])*2.0;
          highp float Exponent = 2.0 * mod(rgba[0],128.0) + step(128.0,rgba[1]) - 127.0;
          highp float Mantissa = mod(rgba[1],128.0)*65536.0 + rgba[2]*256.0 +rgba[3] + float(0x800000);
          highp float Result =  Sign * exp2(Exponent) * (Mantissa * exp2(-23.0 ));
          return Result;
      }
        `)}}static isLittleEndian(){let e=new ArrayBuffer(4),t=new Uint32Array(e),i=new Uint8Array(e);if(t[0]=0xdeadbeef,239===i[0])return!0;if(222===i[0])return!1;throw Error("unknown endianness")}}}),Vb=k(()=>{"use strict";Jn(),Ke(),Qi=class extends zt{constructor(e){super(e)}getFunctions(){return{...this.setFragColor(),...this.getColorAsFloat()}}getCustomTypes(){return{}}setFragColor(){let e=ue(this.context.glContext.version);return{setFragColor:new Y(`
        void setFragColor(float value) {
            ${e.output} = encode(value);
        }
        `,["encoding.encode"])}}getColorAsFloat(){return{getColorAsFloat:new Y(`
        float getColorAsFloat(vec4 color) {
            return decode(color);
        }
        `,["encoding.decode"])}}}}),Gb=k(()=>{"use strict";Jn(),ea=class e extends zt{constructor(e){super(e)}getFunctions(){return{...this.bcastIndex(),...this.bcastMatmulIndex(),...this.offsetToIndices(),...this.indicesToOffset(),...this.incrementIndices()}}getCustomTypes(){return{}}bcastIndex(){let e=this.context.outputTextureLayout.shape.length,t={};return this.context.programInfo.inputNames.forEach((i,n)=>{let o=this.context.inputTextureLayouts[n].unpackedShape;if(o.length<=e){let n=o.length,a=e-n,s=`bcastIndices_${i}`,u="";for(let e=0;e<n;++e)u+=`
          realIndices[${e}] = int( mod(float(bcastedIndices[${a+e}]), ${o[e]}.0) );
          `;let l=`
        void ${s} (int bcastedIndices[${e}], out int realIndices[${n}]) {
          ${u}
        }
        `;t[s]=new Y(l)}}),t}bcastMatmulIndex(){let e=this.context.outputTextureLayout.shape.length,t={};return this.context.programInfo.inputNames.forEach((i,n)=>{let o=this.context.inputTextureLayouts[n].shape;if(!(o.length<2||o.length>e)){let n=o.length,a=e-n,s=`bcastMatmulIndices_${i}`,u="";for(let e=0;e<n-2;++e)u+=`
          realIndices[${e}] = int( mod(float(bcastedIndices[${a+e}]), ${o[e]}.0) );
          `;let l=`
        void ${s}(int bcastedIndices[${e}], out int realIndices[${n}]) {
          ${u}
          realIndices[${n-1}] = bcastedIndices[${e-1}];
          realIndices[${n-2}] = bcastedIndices[${e-2}];
        }
        `;t[s]=new Y(l)}}),t}indicesToOffset(){let t={};return this.context.programInfo.inputNames.forEach((i,n)=>{let o=this.context.inputTextureLayouts[n].shape,a=this.context.inputTextureLayouts[n].strides,s=o.length,u=`indicesToOffset_${i}`;t[u]=new Y(e.indexToOffsetSingle(u,s,a)),t[u=`indicesToOffset_${i}_T`]=new Y(e.indexToOffsetSingle(u,s,a.slice().reverse()))}),t}static indexToOffsetSingle(e,t,i){let n="";for(let e=t-1;e>=0;--e)n+=`
        offset += indices[${e}] * ${i[e]};
        `;return`
      int ${e}(int indices[${t}]) {
        int offset = 0;
        ${n}
        return offset;
      }
      `}offsetToIndices(){let t={};return this.context.programInfo.inputNames.forEach((i,n)=>{let o=this.context.inputTextureLayouts[n].shape,a=this.context.inputTextureLayouts[n].strides,s=o.length,u=`offsetToIndices_${i}`;t[u]=new Y(e.offsetToIndicesSingle(u,s,a)),t[u=`offsetToIndices_${i}_T`]=new Y(e.offsetToIndicesSingle(u,s,a.slice().reverse()))}),t}static offsetToIndicesSingle(e,t,i){let n=[];for(let e=0;e<t-1;++e)n.push(`
      indices[${e}] = offset / ${i[e]};`),n.push(`
        offset -= indices[${e}] * ${i[e]};`);return n.push(`
      indices[${t-1}] = offset;`),`
      void ${e}(int offset, out int indices[${t}]) {
        ${n.join("")}
      }
      `}incrementIndices(){let e={};return this.context.programInfo.inputNames.forEach((t,i)=>{let n=this.context.inputTextureLayouts[i].shape,o=n.length,a=`incrementIndices_${t}`,s="";for(let e=0;e<o;++e)s+=`
        shape[${e}] = ${n[e]};`;let u=`
        void ${a}(int axis, out int indices[${o}]) {
          int shape[${o}];
          ${s};
          for(int i = ${o} -1 ; i >= 0; --i) {
            if(i > axis) continue;
            indices[i] += 1;
            if(indices[i] < shape[i]) {
              break;
            }
            indices[i] = 0;
          }
        }
        `;e[a]=new Y(u)}),e}}}),Ub=k(()=>{"use strict";Jn(),ta=class extends zt{constructor(e){super(e)}getCustomTypes(){return{}}getFunctions(){return{...this.binaryVecFunctions(),...this.copyVec(),...this.setVecItem(),...this.getVecItem()}}binaryVecFunctions(){let e=this.context.outputTextureLayout.shape.length,t={add:"+=",sub:"-=",mul:"*=",div:"/="},i={};for(let n in t){let o=`${n}Vec`,a="";for(let i=0;i<e;++i)a+=`
          dest[${i}] ${t[n]} src[${i}];
          `;let s=`
        void ${o}(int src[${e}], out int dest[${e}]) {
          ${a}
        }
        `;i[o]=new Y(s)}return i}copyVec(){let e=this.context.outputTextureLayout.shape.length,t="";for(let i=0;i<e;++i)t+=`
        dest[${i}] = src[${i}];
        `;let i=`
      void copyVec(int src[${e}], out int dest[${e}]) {
        ${t}
      }
      `;return{copyVec:new Y(i)}}setVecItem(){let e=this.context.outputTextureLayout.shape.length,t=`
        if(index < 0)
            index =${e} + index;
        if (index == 0)
            m[0] = value;
        `;for(let i=1;i<e-1;++i)t+=`
        else if (index == ${i})
            m[${i}] = value;
            `;t+=`
        else
            m[${e-1}] = value;
        `;let i=`
      void setVecItem(out int m[${e}], int index, int value) {
        ${t}
      }
        `;return{setVecItem:new Y(i)}}getVecItem(){let e=this.context.outputTextureLayout.shape.length,t=`
        if(index < 0)
            index = ${e} + index;
        if (index == 0)
            return m[0];
      `;for(let i=1;i<e-1;++i)t+=`
        else if (index == ${i})
            return m[${i}];
      `;t+=`
        else
            return m[${e-1}];
        `;let i=`
      int getVecItem(int m[${e}], int index) {
        ${t}
      }
    `;return{getVecItem:new Y(i)}}}}),Wb=k(()=>{"use strict";Bb(),Fb(),Vb(),Gb(),Ub(),Xl={encoding:Yi,fragcolor:Qi,vec:ta,shapeUtils:ea,coordinates:Ji}}),Hb=k(()=>{"use strict";Jn(),zb(),Wb(),Ke(),na=class{constructor(e,t,i,n){this.libs={},this.glslLibRoutineDependencyGraph={},this.context=new Fi(e,t,i,n),Object.keys(Xl).forEach(e=>{let t=new Xl[e](this.context);this.libs[e]=t});let o=this.glslLibRoutineDependencyGraph;for(let e in this.libs){let t=this.libs[e].getFunctions();for(let i in t){let n=e+"."+i,a;o[n]?(a=o[n]).routineBody=t[i].routineBody:(a=new Lo(n,t[i].routineBody),o[n]=a);let s=t[i].dependencies;if(s)for(let e=0;e<s.length;++e)if(o[s[e]])a.addDependency(o[s[e]]);else{let t=new Lo(s[e]);o[s[e]]=t,a.addDependency(t)}}}}preprocess(){let e=this.context.programInfo,t=e.shaderSource;return this.context.programInfo.hasMain||(t=`${t}
      ${Sh(this.context.glContext.version,this.context.outputTextureLayout.shape.length)}`),t=Rb(t),`${Ih(this.context.glContext.version)}
    ${this.getUniforms(e.inputNames,e.variables)}
    ${this.getImports(t)}
    ${t}`}getImports(e){let t=this.selectGlslLibRoutinesToBeIncluded(e);if(0===t.length)return"";let i="";for(let e=0;e<t.length;++e)if(t[e].routineBody)i+=t[e].routineBody+`
`;else throw Error(`Missing body for the Glsl Library routine: ${t[e].name}`);return i}selectGlslLibRoutinesToBeIncluded(e){let t=[];return Object.keys(this.glslLibRoutineDependencyGraph).forEach(i=>{let n=i.split(".")[1];-1!==e.indexOf(n)&&t.push(this.glslLibRoutineDependencyGraph[i])}),Vi.returnOrderedNodes(t)}getUniforms(e,t){let i=[];if(e)for(let t of e)i.push(`uniform sampler2D ${t};`);if(t)for(let e of t)i.push(`uniform ${e.type} ${e.name}${e.arrayLength?`[${e.arrayLength}]`:""};`);return i.join(`
`)}}}),jb=k(()=>{"use strict";pt(),Ct(),Hb(),Ke(),ra=class{constructor(e,t,i){this.profiler=e,this.glContext=t,this.textureLayoutStrategy=i,this.repo=new Map,this.attributesBound=!1}getArtifact(e){return this.repo.get(e)}setArtifact(e,t){this.repo.set(e,t)}run(e,t,i){this.profiler.event("op",`ProgramManager.run ${e.programInfo.name??"unknown kernel"}`,()=>{let n=this.glContext.gl,o=e.program;n.useProgram(o);try{this.bindOutput(i),this.attributesBound||this.bindAttributes(e.attribLocations),this.bindUniforms(e.uniformLocations,e.programInfo.variables??[],t)}catch(t){throw Fe.error("ProgramManager",e.programInfo.shaderSource),t}this.profiler.event("backend","GlContext.draw()",()=>{this.glContext.draw()})},this.glContext)}dispose(){this.vertexShader&&this.glContext.deleteShader(this.vertexShader),this.repo.forEach(e=>this.glContext.deleteProgram(e.program))}build(e,t,i){return this.profiler.event("backend","ProgramManager.build",()=>{let n=new na(this.glContext,e,t,i),o=n.preprocess(),a=this.compile(o);return{programInfo:e,program:a,uniformLocations:this.getUniformLocations(a,n.context.programInfo.inputNames,n.context.programInfo.variables),attribLocations:this.getAttribLocations(a)}})}compile(e){if(!this.vertexShader){Fe.verbose("ProrgramManager","Compiling and caching Vertex shader for the first time");let e=Th(this.glContext.version);this.vertexShader=this.glContext.compileShader(e,this.glContext.gl.VERTEX_SHADER)}me.debug&&Fe.verbose("ProrgramManager",`FragShader:
${e}
`);let t=this.glContext.compileShader(e,this.glContext.gl.FRAGMENT_SHADER),i=this.glContext.createProgram(this.vertexShader,t);return this.glContext.deleteShader(t),i}bindOutput(e){let t=e.width,i=e.height;Fe.verbose("ProrgramManager",`Binding output texture to Framebuffer: w/h=${t}/${i}, shape=${e.shape}, type=${e.tensor.type}`),this.glContext.attachFramebuffer(e.texture,t,i)}bindAttributes(e){let t=e.position,i=e.textureCoord;this.glContext.setVertexAttributes(t,i),this.attributesBound=!0}bindUniforms(e,t,i){let n=this.glContext.gl,o=0;for(let{name:a,type:s,location:u,arrayLength:l}of e){let e=t.find(e=>e.name===a)?.data;if("sampler2D"!==s&&!e)throw Error(`variable '${a}' does not have data defined in program info`);switch(s){case"sampler2D":this.bindTexture(i[o],u,o),o++;break;case"float":l?n.uniform1fv(u,e):n.uniform1f(u,e);break;case"int":l?n.uniform1iv(u,e):n.uniform1i(u,e);break;default:throw Error(`Uniform not implemented: ${s}`)}}}bindTexture(e,t,i){this.glContext.bindTextureToUniform(e.texture,i,t)}getAttribLocations(e){return{position:this.getAttribLocation(e,"position"),textureCoord:this.getAttribLocation(e,"textureCoord")}}getUniformLocations(e,t,i){let n=[];if(t)for(let i of t)n.push({name:i,type:"sampler2D",location:this.getUniformLocation(e,i)});if(i)for(let t of i)n.push({...t,location:this.getUniformLocation(e,t.name)});return n}getUniformLocation(e,t){let i=this.glContext.gl.getUniformLocation(e,t);if(null===i)throw Error(`Uniform ${t} not found.`);return i}getAttribLocation(e,t){return this.glContext.gl.getAttribLocation(e,t)}}}),qb=k(()=>{"use strict";Ct(),ko(),oa=class{constructor(e,t,i,n){this.glContext=e,this.layoutStrategy=t,this.profiler=i,this.config=n,this.pendingRead=new Map,n.reuseTextures&&(this.inUseTextures=new Map,this.idleTextures=new Map,this.textureLookup=new Map)}createTextureFromLayout(e,t,i,n){let o=this.toEncoderType(e),a=this.glContext.getEncoder(o,t.channels||1,n);if(t.isPacked&&1===n)throw Error("not implemented");let s=t.width,u=t.height,l,d;if(this.config.reuseTextures){l=`${s}x${u}_${a.format}_${a.internalFormat}_${a.textureType}`,(d=this.inUseTextures.get(l))||(d=[],this.inUseTextures.set(l,d));let t=this.idleTextures.get(l);if(t&&t.length>0){let o=t.pop();return d.push(o),1===n&&this.glContext.updateTexture(o,s,u,a,this.toTextureData(e,i)),o}}Fe.verbose("TextureManager",`Creating new texture of size ${t.width}x${t.height}`);let p=this.glContext.allocateTexture(s,u,a,this.toTextureData(e,i));return this.config.reuseTextures&&(d.push(p),this.textureLookup.set(p,l)),p}readTexture(e,t,i){return i||(i=1),this.profiler.event("backend","TextureManager.readTexture",()=>{let n=e.shape.reduce((e,t)=>e*t)*i,o=this.glContext.readTexture(e.texture,e.width,e.height,n,this.toEncoderType(t),i);return this.toTensorData(t,o)})}async readTextureAsync(e,t,i){let n=e.tensor.dataId;if(i||(i=1),this.pendingRead.has(n)){let e=this.pendingRead.get(n);return new Promise(t=>e?.push(t))}return this.profiler.event("backend","TextureManager.readTextureAsync",async()=>{this.pendingRead.set(n,[]);let o=e.shape.reduce((e,t)=>e*t)*i;await this.glContext.createAndWaitForFence();let a=this.glContext.readTexture(e.texture,e.width,e.height,o,this.toEncoderType(t),i),s=this.toTensorData(t,a),u=this.pendingRead.get(n);return this.pendingRead.delete(n),u?.forEach(e=>e(s)),s})}readUint8TextureAsFloat(e){return this.profiler.event("backend","TextureManager.readUint8TextureAsFloat",()=>{let t=e.shape.reduce((e,t)=>e*t),i=this.glContext.readTexture(e.texture,e.width,e.height,4*t,"byte",4);return new Float32Array(i.buffer,i.byteOffset,t)})}releaseTexture(e,t){let i;if(this.config.reuseTextures&&(i=this.textureLookup.get(e.texture))){t&&this.textureLookup.delete(i);let n=this.inUseTextures.get(i);if(n){let t=n.indexOf(e.texture);if(-1!==t){n.splice(t,1);let o=this.idleTextures.get(i);o||(o=[],this.idleTextures.set(i,o)),o.push(e.texture)}}}(!i||t)&&(Fe.verbose("TextureManager",`Deleting texture of size ${e.width}x${e.height}`),this.glContext.deleteTexture(e.texture))}toTensorData(e,t){switch(e){case"int16":return t instanceof Int16Array?t:Int16Array.from(t);case"int32":return t instanceof Int32Array?t:Int32Array.from(t);case"int8":return t instanceof Int8Array?t:Int8Array.from(t);case"uint16":return t instanceof Uint16Array?t:Uint16Array.from(t);case"uint32":return t instanceof Uint32Array?t:Uint32Array.from(t);case"uint8":case"bool":return t instanceof Uint8Array?t:Uint8Array.from(t);case"float32":return t instanceof Float32Array?t:Float32Array.from(t);case"float64":return t instanceof Float64Array?t:Float64Array.from(t);default:throw Error(`TensorData type ${e} is not supported`)}}toTextureData(e,t){if(t)return t instanceof Float32Array?t:new Float32Array(t)}toEncoderType(e){return"float"}clearActiveTextures(){this.glContext.clearActiveTextures()}}}),Kb=k(()=>{"use strict";Ct(),Rp(),Fh(),Nb(),jb(),Kl(),qb(),ia=class{constructor(e,t){this.backend=e,this.context=t,this.layoutStrategy=new Zi(e.glContext.maxTextureSize),this.programManager=new ra(this.context.profiler,e.glContext,this.layoutStrategy),this.textureManager=new oa(e.glContext,this.layoutStrategy,this.context.profiler,{reuseTextures:"full"===e.textureCacheMode}),this.packedTextureDataCache=new Map,this.unpackedTextureDataCache=new Map,this.pack=e.pack,this.pack2unpackMap=new Map,this.unpack2packMap=new Map}createInferenceHandler(){return new Bi(this)}onGraphInitialized(e){let t=e.getValues().filter(e=>-1===e.from&&e.tensor).map(e=>e.tensor.dataId);this.initializers=new Set(t)}isInitializer(e){return!!this.initializers&&this.initializers.has(e)}addInitializer(e){this.initializers.add(e)}getTextureData(e,t){return t?this.packedTextureDataCache.get(e):this.unpackedTextureDataCache.get(e)}setTextureData(e,t,i=!1){Fe.verbose("WebGLSessionHandler","Storing Texture data in cache"),i?this.packedTextureDataCache.set(e,t):this.unpackedTextureDataCache.set(e,t)}dispose(){this.programManager.dispose(),this.textureManager.clearActiveTextures(),this.packedTextureDataCache.forEach(e=>this.textureManager.releaseTexture(e,!0)),this.packedTextureDataCache=new Map,this.unpackedTextureDataCache.forEach(e=>this.textureManager.releaseTexture(e,!0)),this.unpackedTextureDataCache=new Map}resolve(e,t,i){let n=Lp(e,t,kb);return{impl:n.opImpl,context:n.opInit?n.opInit(e,i):e}}}});function xO(e){let t=0;for(;t<e.length&&e[t]();++t);return t-1}var Mo,Xb=k(()=>{"use strict";pt(),ko(),ko(),Nn(),Mo=class{constructor(e,t){this.frameBufferBound=!1,this.itemsToPoll=[],this.gl=e,this.version=t,this.getExtensions(),this.vertexbuffer=this.createVertexbuffer(),this.framebuffer=this.createFramebuffer(),this.queryVitalParameters()}allocateTexture(e,t,i,n){let o=this.gl,a=o.createTexture();o.bindTexture(o.TEXTURE_2D,a),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,o.NEAREST),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,o.NEAREST),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_S,o.CLAMP_TO_EDGE),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_T,o.CLAMP_TO_EDGE);let s=n?i.encode(n,e*t):null;return o.texImage2D(o.TEXTURE_2D,0,i.internalFormat,e,t,0,i.format,i.textureType,s),this.checkError(),a}updateTexture(e,t,i,n,o){let a=this.gl;a.bindTexture(a.TEXTURE_2D,e);let s=n.encode(o,t*i);a.texSubImage2D(a.TEXTURE_2D,0,0,0,t,i,n.format,n.textureType,s),this.checkError()}attachFramebuffer(e,t,i){let n=this.gl;n.bindTexture(n.TEXTURE_2D,e),n.bindFramebuffer(n.FRAMEBUFFER,this.framebuffer),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,e,0),this.checkError(),n.viewport(0,0,t,i),n.scissor(0,0,t,i)}readTexture(e,t,i,n,o,a){let s=this.gl;a||(a=1),this.frameBufferBound||this.attachFramebuffer(e,t,i);let u=this.getEncoder(o,a),l=u.allocate(t*i);return s.bindTexture(s.TEXTURE_2D,e),s.framebufferTexture2D(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,e,0),s.readPixels(0,0,t,i,s.RGBA,u.textureType,l),this.checkError(),u.decode(l,n)}isFramebufferReady(){return!0}getActiveTexture(){let e=this.gl;return`TEXTURE${e.getParameter(this.gl.ACTIVE_TEXTURE)-e.TEXTURE0}`}getTextureBinding(){return this.gl.getParameter(this.gl.TEXTURE_BINDING_2D)}getFramebufferBinding(){return this.gl.getParameter(this.gl.FRAMEBUFFER_BINDING)}setVertexAttributes(e,t){let i=this.gl;i.vertexAttribPointer(e,3,i.FLOAT,!1,20,0),i.enableVertexAttribArray(e),-1!==t&&(i.vertexAttribPointer(t,2,i.FLOAT,!1,20,12),i.enableVertexAttribArray(t)),this.checkError()}createProgram(e,t){let i=this.gl,n=i.createProgram();return i.attachShader(n,e),i.attachShader(n,t),i.linkProgram(n),n}compileShader(e,t){let i=this.gl,n=i.createShader(t);if(!n)throw Error(`createShader() returned null with type ${t}`);if(i.shaderSource(n,e),i.compileShader(n),!1===i.getShaderParameter(n,i.COMPILE_STATUS))throw Error(`Failed to compile shader: ${i.getShaderInfoLog(n)}
Shader source:
${e}`);return n}deleteShader(e){this.gl.deleteShader(e)}bindTextureToUniform(e,t,i){let n=this.gl;n.activeTexture(n.TEXTURE0+t),this.checkError(),n.bindTexture(n.TEXTURE_2D,e),this.checkError(),n.uniform1i(i,t),this.checkError()}draw(){this.gl.drawArrays(this.gl.TRIANGLE_STRIP,0,4),this.checkError()}checkError(){if(me.debug){let e=this.gl,t=e.getError(),i="";switch(t){case e.NO_ERROR:return;case e.INVALID_ENUM:i="INVALID_ENUM";break;case e.INVALID_VALUE:i="INVALID_VALUE";break;case e.INVALID_OPERATION:i="INVALID_OPERATION";break;case e.INVALID_FRAMEBUFFER_OPERATION:i="INVALID_FRAMEBUFFER_OPERATION";break;case e.OUT_OF_MEMORY:i="OUT_OF_MEMORY";break;case e.CONTEXT_LOST_WEBGL:i="CONTEXT_LOST_WEBGL";break;default:i=`Unknown WebGL Error: ${t.toString(16)}`}throw Error(i)}}deleteTexture(e){this.gl.deleteTexture(e)}deleteProgram(e){this.gl.deleteProgram(e)}getEncoder(e,t,i=0){if(2===this.version)return new zi(this.gl,t);switch(e){case"float":return 1===i||this.isRenderFloat32Supported?new Do(this.gl,t):new Do(this.gl,t,this.textureHalfFloatExtension.HALF_FLOAT_OES);case"int":throw Error("not implemented");case"byte":return new Mi(this.gl,t);default:throw Error(`Invalid dataType: ${e}`)}}clearActiveTextures(){let e=this.gl;for(let t=0;t<this.maxTextureImageUnits;++t)e.activeTexture(e.TEXTURE0+t),e.bindTexture(e.TEXTURE_2D,null)}dispose(){if(this.disposed)return;let e=this.gl;e.bindFramebuffer(e.FRAMEBUFFER,null),e.deleteFramebuffer(this.framebuffer),e.bindBuffer(e.ARRAY_BUFFER,null),e.deleteBuffer(this.vertexbuffer),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,null),e.finish(),this.disposed=!0}createDefaultGeometry(){return new Float32Array([-1,1,0,0,1,-1,-1,0,0,0,1,1,0,1,1,1,-1,0,1,0])}createVertexbuffer(){let e=this.gl,t=e.createBuffer();if(!t)throw Error("createBuffer() returned null");let i=this.createDefaultGeometry();return e.bindBuffer(e.ARRAY_BUFFER,t),e.bufferData(e.ARRAY_BUFFER,i,e.STATIC_DRAW),this.checkError(),t}createFramebuffer(){let e=this.gl.createFramebuffer();if(!e)throw Error("createFramebuffer returned null");return e}queryVitalParameters(){let e=this.gl;if(this.isFloatTextureAttachableToFrameBuffer=this.checkFloatTextureAttachableToFrameBuffer(),this.isRenderFloat32Supported=this.checkRenderFloat32(),this.isFloat32DownloadSupported=this.checkFloat32Download(),1===this.version&&!this.textureHalfFloatExtension&&!this.isRenderFloat32Supported)throw Error("both float32 and float16 TextureType are not supported");this.isBlendSupported=!this.isRenderFloat32Supported||this.checkFloat32Blend(),this.maxTextureSize=e.getParameter(e.MAX_TEXTURE_SIZE),this.maxTextureImageUnits=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),this.version}getExtensions(){2===this.version?(this.colorBufferFloatExtension=this.gl.getExtension("EXT_color_buffer_float"),this.disjointTimerQueryWebgl2Extension=this.gl.getExtension("EXT_disjoint_timer_query_webgl2")):(this.textureFloatExtension=this.gl.getExtension("OES_texture_float"),this.textureHalfFloatExtension=this.gl.getExtension("OES_texture_half_float"))}checkFloatTextureAttachableToFrameBuffer(){let e=this.gl,t=e.createTexture();e.bindTexture(e.TEXTURE_2D,t);let i=2===this.version?e.RGBA32F:e.RGBA;e.texImage2D(e.TEXTURE_2D,0,i,1,1,0,e.RGBA,e.FLOAT,null);let n=e.createFramebuffer();e.bindFramebuffer(e.FRAMEBUFFER,n),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0);let o=e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE;return e.bindTexture(e.TEXTURE_2D,null),e.bindFramebuffer(e.FRAMEBUFFER,null),e.deleteTexture(t),e.deleteFramebuffer(n),o}checkRenderFloat32(){if(2===this.version){if(!this.colorBufferFloatExtension)return!1}else if(!this.textureFloatExtension)return!1;return this.isFloatTextureAttachableToFrameBuffer}checkFloat32Download(){if(2===this.version){if(!this.colorBufferFloatExtension)return!1}else if(!this.textureFloatExtension||!this.gl.getExtension("WEBGL_color_buffer_float"))return!1;return this.isFloatTextureAttachableToFrameBuffer}checkFloat32Blend(){let e=this.gl,t,i,n,o,a;try{t=e.createTexture(),i=e.createFramebuffer(),e.bindTexture(e.TEXTURE_2D,t);let s=2===this.version?e.RGBA32F:e.RGBA;return e.texImage2D(e.TEXTURE_2D,0,s,1,1,0,e.RGBA,e.FLOAT,null),e.bindFramebuffer(e.FRAMEBUFFER,i),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0),e.enable(e.BLEND),!!(n=e.createShader(e.VERTEX_SHADER))&&(e.shaderSource(n,"void main(){}"),e.compileShader(n),!!(o=e.createShader(e.FRAGMENT_SHADER)))&&(e.shaderSource(o,"precision highp float;void main(){gl_FragColor=vec4(0.5);}"),e.compileShader(o),!!(a=e.createProgram()))&&(e.attachShader(a,n),e.attachShader(a,o),e.linkProgram(a),e.useProgram(a),e.drawArrays(e.POINTS,0,1),e.getError()===e.NO_ERROR)}finally{e.disable(e.BLEND),a&&e.deleteProgram(a),n&&e.deleteShader(n),o&&e.deleteShader(o),i&&(e.bindFramebuffer(e.FRAMEBUFFER,null),e.deleteFramebuffer(i)),t&&(e.bindTexture(e.TEXTURE_2D,null),e.deleteTexture(t))}}beginTimer(){if(2===this.version&&this.disjointTimerQueryWebgl2Extension){let e=this.gl,t=this.disjointTimerQueryWebgl2Extension,i=e.createQuery();return e.beginQuery(t.TIME_ELAPSED_EXT,i),i}throw Error("WebGL1 profiling currently not supported.")}endTimer(){if(2===this.version&&this.disjointTimerQueryWebgl2Extension){let e=this.gl,t=this.disjointTimerQueryWebgl2Extension;e.endQuery(t.TIME_ELAPSED_EXT);return}throw Error("WebGL1 profiling currently not supported")}isTimerResultAvailable(e){let t=!1,i=!1;if(2===this.version&&this.disjointTimerQueryWebgl2Extension){let n=this.gl,o=this.disjointTimerQueryWebgl2Extension;t=n.getQueryParameter(e,n.QUERY_RESULT_AVAILABLE),i=n.getParameter(o.GPU_DISJOINT_EXT)}else throw Error("WebGL1 profiling currently not supported");return t&&!i}getTimerResult(e){let t=0;if(2===this.version){let i=this.gl;t=i.getQueryParameter(e,i.QUERY_RESULT),i.deleteQuery(e)}else throw Error("WebGL1 profiling currently not supported");return t/1e6}async waitForQueryAndGetTime(e){return await vl(()=>this.isTimerResultAvailable(e)),this.getTimerResult(e)}async createAndWaitForFence(){let e=this.createFence(this.gl);return this.pollFence(e)}createFence(e){let t,i=e,n=i.fenceSync(i.SYNC_GPU_COMMANDS_COMPLETE,0);return e.flush(),t=null===n?()=>!0:()=>{let e=i.clientWaitSync(n,0,0);return e===i.ALREADY_SIGNALED||e===i.CONDITION_SATISFIED},{query:n,isFencePassed:t}}async pollFence(e){return new Promise(t=>{this.addItemToPoll(()=>e.isFencePassed(),()=>t())})}pollItems(){let e=xO(this.itemsToPoll.map(e=>e.isDoneFn));for(let t=0;t<=e;++t){let{resolveFn:e}=this.itemsToPoll[t];e()}this.itemsToPoll=this.itemsToPoll.slice(e+1)}async addItemToPoll(e,t){this.itemsToPoll.push({isDoneFn:e,resolveFn:t}),this.itemsToPoll.length>1||await vl(()=>(this.pollItems(),0===this.itemsToPoll.length))}}});function Zl(e){let t;if((!e||"webgl2"===e)&&"webgl2"in lo?t=lo.webgl2:(!e||"webgl"===e)&&"webgl"in lo&&(t=lo.webgl),!t)try{let i=IO();t=Zb(i,e)}catch{t=Zb(TO(),e)}e=e||1===t.version?"webgl":"webgl2";let i=t.gl;return lo[e]=t,i.isContextLost()?(delete lo[e],Zl(e)):(i.disable(i.DEPTH_TEST),i.disable(i.STENCIL_TEST),i.disable(i.BLEND),i.disable(i.DITHER),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SAMPLE_COVERAGE),i.enable(i.SCISSOR_TEST),i.enable(i.CULL_FACE),i.cullFace(i.BACK),t)}function Zb(e,t){let i,n={alpha:!1,depth:!1,antialias:!1,stencil:!1,preserveDrawingBuffer:!1,premultipliedAlpha:!1,failIfMajorPerformanceCaveat:!1};if((!t||"webgl2"===t)&&(i=e.getContext("webgl2",n)))try{return new Mo(i,2)}catch(e){Fe.warning("GlContextFactory",`failed to create WebGLContext using contextId 'webgl2'. Error: ${e}`)}if((!t||"webgl"===t)&&(i=e.getContext("webgl",n)||e.getContext("experimental-webgl",n)))try{return new Mo(i,1)}catch(e){Fe.warning("GlContextFactory",`failed to create WebGLContext using contextId 'webgl' or 'experimental-webgl'. Error: ${e}`)}throw Error("WebGL is not supported")}function TO(){if(typeof document>"u")throw TypeError("failed to create canvas: document is not supported");let e=document.createElement("canvas");return e.width=1,e.height=1,e}function IO(){if(typeof OffscreenCanvas>"u")throw TypeError("failed to create offscreen canvas: OffscreenCanvas is not supported");return new OffscreenCanvas(1,1)}var lo,aa,Jb=k(()=>{"use strict";Ct(),Xb(),lo={}}),Yb=k(()=>{"use strict";pt(),Ct(),Kb(),Jb(),aa=class{get contextId(){return me.webgl.contextId}set contextId(e){me.webgl.contextId=e}get matmulMaxBatchSize(){return me.webgl.matmulMaxBatchSize}set matmulMaxBatchSize(e){me.webgl.matmulMaxBatchSize=e}get textureCacheMode(){return me.webgl.textureCacheMode}set textureCacheMode(e){me.webgl.textureCacheMode=e}get pack(){return me.webgl.pack}set pack(e){me.webgl.pack=e}get async(){return me.webgl.async}set async(e){me.webgl.async=e}initialize(){try{return this.glContext=Zl(this.contextId),"number"!=typeof this.matmulMaxBatchSize&&(this.matmulMaxBatchSize=16),"string"!=typeof this.textureCacheMode&&(this.textureCacheMode="full"),"boolean"!=typeof this.pack&&(this.pack=!1),"boolean"!=typeof this.async&&(this.async=!1),Fe.setWithEnv(me),me.webgl.context||Object.defineProperty(me.webgl,"context",{value:this.glContext.gl}),Fe.verbose("WebGLBackend",`Created WebGLContext: ${typeof this.glContext} with matmulMaxBatchSize: ${this.matmulMaxBatchSize}; textureCacheMode: ${this.textureCacheMode}; pack: ${this.pack}; async: ${this.async}.`),!0}catch(e){return Fe.warning("WebGLBackend",`Unable to initialize WebGLBackend. ${e}`),!1}}createSessionHandler(e){return new ia(this,e)}dispose(){this.glContext.dispose()}}});async function Jl(e){if(!e)return Jl(["webgl"]);for(let t of"string"==typeof e?[e]:e){let e=Qb.get(t);if(e)return e;let i=await $O(t);if(i)return i}throw Error("no available backend to use")}async function $O(e){let t=SO;if("u">typeof t[e]&&AO(t[e])){let i=t[e],n=i.initialize();if("object"==typeof n&&"then"in n&&(n=await n),n)return Qb.set(e,i),i}}function AO(e){let t=e;return"initialize"in t&&"function"==typeof t.initialize&&"createSessionHandler"in t&&"function"==typeof t.createSessionHandler&&"dispose"in t&&"function"==typeof t.dispose}var Qb,SO,Yl,sa,$e,Bo,ec,tc,zn,ua,Ql,oy,iy,la,ca,da,ey=k(()=>{"use strict";Yb(),Qb=new Map,SO={webgl:new aa}}),ty=k(()=>{"use strict";Ct(),Yl=class{constructor(e,t){this.op=e,this.node=t}},sa=class{constructor(e,t,i){this.graph=e,this.profiler=i,this.initialize(t)}initialize(e){this.profiler.event("session","ExecutionPlan.initialize",()=>{let t=this.graph.getNodes();if(t.length!==e.length)throw Error("The size of nodes and OPs do not match.");this._ops=e.map((e,i)=>new Yl(e,t[i])),this.reset(),this._starter=[],this._ops.forEach((e,t)=>{let i=!0;for(let t of e.node.inputs)if(!this._values[t]&&-1===this.graph.getInputIndices().indexOf(t)){i=!1;break}i&&this._starter.push(t)})})}reset(){this._values=this.graph.getValues().map(e=>e.tensor)}async execute(e,t){return this.profiler.event("session","ExecutionPlan.execute",async()=>{this.reset();let i=e.createInferenceHandler(),n=this.graph.getInputIndices();if(t.length!==n.length)throw Error(`number of input tensors don't match the number of inputs to the model: actual: ${t.length} expected: ${n.length}`);t.forEach((e,t)=>{let i=n[t];this._values[i]=e});let o=this._starter.slice(0),a=this.graph.getValues(),s=this.graph.getNodes(),u=0;for(;u<o.length;){let e=o[u++],t=this._ops[e],n=t.node.inputs.map(e=>this._values[e]);if(-1!==n.indexOf(void 0))throw Error(`unresolved input detected: op: ${t.node}`);let l=n;Fe.verbose("ExecPlan",`Running op:${t.node.name} (${l.map((e,i)=>`'${t.node.inputs[i]}': ${e.type}[${e.dims.join(",")}]`).join(", ")})`);let d=await this.profiler.event("node",t.node.name,async()=>t.op.impl(i,l,t.op.context));if(d.length!==t.node.outputs.length)throw Error("the size of output does not match model definition.");d.forEach((e,i)=>{let n=t.node.outputs[i];if(this._values[n])throw Error(`output [${n}] already has value: op:${t.node.name}`);this._values[n]=e});let p=new Set;d.forEach((e,i)=>{for(let e of a[t.node.outputs[i]].to){let t=s[e],i=!0;for(let e of t.inputs)if(!this._values[e]){i=!1;break}i&&p.add(e)}}),o.push(...p)}let l=[];for(let e=0;e<this.graph.getOutputIndices().length;e++){let t=this.graph.getOutputIndices()[e],i=this._values[t];if(void 0===i)throw Error(`required output [${t}] does not have value`);0===t?await i.getData():i.data,l.push(i)}return Fe.verbose("ExecPlan","disposing of inferenceHandler"),i.dispose(),l})}}}),ny=k(()=>{"use strict";$o(),$e=ve(to()),zr(),Me(),Bo=class e{constructor(t){if(this._attributes=new Map,null!=t){for(let i of t)i instanceof $e.onnx.AttributeProto?this._attributes.set(i.name,[e.getValue(i),e.getType(i)]):i instanceof Pi.Attribute&&this._attributes.set(i.name(),[e.getValue(i),e.getType(i)]);if(this._attributes.size<t.length)throw Error("duplicated attribute names")}}set(e,t,i){this._attributes.set(e,[i,t])}delete(e){this._attributes.delete(e)}getFloat(e,t){return this.get(e,"float",t)}getInt(e,t){return this.get(e,"int",t)}getString(e,t){return this.get(e,"string",t)}getTensor(e,t){return this.get(e,"tensor",t)}getFloats(e,t){return this.get(e,"floats",t)}getInts(e,t){return this.get(e,"ints",t)}getStrings(e,t){return this.get(e,"strings",t)}getTensors(e,t){return this.get(e,"tensors",t)}get(e,t,i){let n=this._attributes.get(e);if(void 0===n){if(void 0!==i)return i;throw Error(`required attribute not found: ${e}`)}if(n[1]!==t)throw Error(`type mismatch: expected ${t} but got ${n[1]}`);return n[0]}static getType(e){let t=e instanceof $e.onnx.AttributeProto?e.type:e.type();switch(t){case $e.onnx.AttributeProto.AttributeType.FLOAT:return"float";case $e.onnx.AttributeProto.AttributeType.INT:return"int";case $e.onnx.AttributeProto.AttributeType.STRING:return"string";case $e.onnx.AttributeProto.AttributeType.TENSOR:return"tensor";case $e.onnx.AttributeProto.AttributeType.FLOATS:return"floats";case $e.onnx.AttributeProto.AttributeType.INTS:return"ints";case $e.onnx.AttributeProto.AttributeType.STRINGS:return"strings";case $e.onnx.AttributeProto.AttributeType.TENSORS:return"tensors";default:throw Error(`attribute type is not supported yet: ${$e.onnx.AttributeProto.AttributeType[t]}`)}}static getValue(e){let t=e instanceof $e.onnx.AttributeProto?e.type:e.type();if(t===$e.onnx.AttributeProto.AttributeType.GRAPH||t===$e.onnx.AttributeProto.AttributeType.GRAPHS)throw Error("graph attribute is not supported yet");let i=this.getValueNoCheck(e);if(t===$e.onnx.AttributeProto.AttributeType.INT&&xt.isLong(i))return xt.longToNumber(i);if(t===$e.onnx.AttributeProto.AttributeType.INTS){let e=i,t=Array(e.length);for(let i=0;i<e.length;i++){let n=e[i];t[i]=xt.longToNumber(n)}return t}if(t===$e.onnx.AttributeProto.AttributeType.TENSOR)return e instanceof $e.onnx.AttributeProto?nt.fromProto(i):nt.fromOrtTensor(i);if(t===$e.onnx.AttributeProto.AttributeType.TENSORS){if(e instanceof $e.onnx.AttributeProto)return i.map(e=>nt.fromProto(e));if(e instanceof Pi.Attribute)return i.map(e=>nt.fromOrtTensor(e))}return t===$e.onnx.AttributeProto.AttributeType.STRING&&e instanceof $e.onnx.AttributeProto?Co(i):t===$e.onnx.AttributeProto.AttributeType.STRINGS&&e instanceof $e.onnx.AttributeProto?i.map(Co):i}static getValueNoCheck(e){return e instanceof $e.onnx.AttributeProto?this.getValueNoCheckFromOnnxFormat(e):this.getValueNoCheckFromOrtFormat(e)}static getValueNoCheckFromOnnxFormat(e){switch(e.type){case $e.onnx.AttributeProto.AttributeType.FLOAT:return e.f;case $e.onnx.AttributeProto.AttributeType.INT:return e.i;case $e.onnx.AttributeProto.AttributeType.STRING:return e.s;case $e.onnx.AttributeProto.AttributeType.TENSOR:return e.t;case $e.onnx.AttributeProto.AttributeType.GRAPH:return e.g;case $e.onnx.AttributeProto.AttributeType.FLOATS:return e.floats;case $e.onnx.AttributeProto.AttributeType.INTS:return e.ints;case $e.onnx.AttributeProto.AttributeType.STRINGS:return e.strings;case $e.onnx.AttributeProto.AttributeType.TENSORS:return e.tensors;case $e.onnx.AttributeProto.AttributeType.GRAPHS:return e.graphs;default:throw Error(`unsupported attribute type: ${$e.onnx.AttributeProto.AttributeType[e.type]}`)}}static getValueNoCheckFromOrtFormat(e){switch(e.type()){case Lt.AttributeType.FLOAT:return e.f();case Lt.AttributeType.INT:return e.i();case Lt.AttributeType.STRING:return e.s();case Lt.AttributeType.TENSOR:return e.t();case Lt.AttributeType.GRAPH:return e.g();case Lt.AttributeType.FLOATS:return e.floatsArray();case Lt.AttributeType.INTS:{let t=[];for(let i=0;i<e.intsLength();i++)t.push(e.ints(i));return t}case Lt.AttributeType.STRINGS:{let t=[];for(let i=0;i<e.stringsLength();i++)t.push(e.strings(i));return t}case Lt.AttributeType.TENSORS:{let t=[];for(let i=0;i<e.tensorsLength();i++)t.push(e.tensors(i));return t}default:throw Error(`unsupported attribute type: ${Lt.AttributeType[e.type()]}`)}}}}),ry=k(()=>{"use strict";ny(),$o(),ec=ve(to()),zr(),Me(),tc={from:(e,t)=>new Ql(e,t)},zn=class{constructor(e){this._from=void 0,this._to=[],this.tensor=void 0,this.type=void 0,e&&(this.type=ft.tensorValueTypeFromProto(e.type.tensorType))}get from(){return this._from}get to(){return this._to}},ua=class{constructor(e,t){e instanceof ec.onnx.NodeProto?(this.name=e.name,this.opType=e.opType,this.attributes=new Bo(e.attribute)):e instanceof nl.Node&&(this.name=t??e.name(),this.opType=e.opType(),this.attributes=new Bo(ft.tensorAttributesFromORTFormat(e))),this.inputs=[],this.outputs=[],this.executeNode=!0}},Ql=class{constructor(e,t){if(!e)throw TypeError("graph is empty");this.buildGraph(e),this.transformGraph(t),this.checkIsAcyclic()}getInputIndices(){return this._allInputIndices}getInputNames(){return this._allInputNames}getOutputIndices(){return this._allOutputIndices}getOutputNames(){return this._allOutputNames}getValues(){return this._allData}getNodes(){return this._nodes}buildGraph(e){if(e instanceof ec.onnx.GraphProto)this.buildGraphFromOnnxFormat(e);else if(e instanceof el.Graph)this.buildGraphFromOrtFormat(e);else throw TypeError("Graph type is not supported.")}buildGraphFromOnnxFormat(e){let t=new Map;this._allData=[],this._allInputIndices=[],this._allInputNames=[],this._allOutputIndices=[],this._allOutputNames=[],this._nodes=[];let i=new Map;if(!e.input)throw Error("missing information in graph: input");let n=[];for(let i of e.input){if(t.has(i.name))throw Error(`duplicated input name: ${i.name}`);let e=this._allData.push(new zn(i))-1;t.set(i.name,e),n.push(i.name)}if(!e.initializer)throw Error("missing information in graph: initializer");for(let i of e.initializer){let e=t.get(i.name);if(void 0===e){let n=new zn;n.type={shape:{dims:ft.tensorDimsFromProto(i.dims)},tensorType:ft.tensorDataTypeFromProto(i.dataType)},e=this._allData.push(n)-1,t.set(i.name,e)}this._allData[e]._from=-1,this._allData[e].tensor=nt.fromProto(i)}for(let e=0;e<this._allData.length;e++)this._allData[e].tensor||(this._allInputIndices.push(e),this._allInputNames.push(n[e]));if(!e.output)throw Error("missing information in graph: output");for(let i of e.output){if(t.has(i.name))throw Error(`duplicated output name: ${i.name}`);let e=this._allData.push(new zn(i))-1;t.set(i.name,e),this._allOutputIndices.push(e),this._allOutputNames.push(i.name)}if(!e.node)throw Error("missing information in graph: node");for(let t of e.node){if(!t.name)for(let e=0;;e++){let n=`unnamed_${t.opType}_${e}`;if(!i.has(n)){t.name=n;break}}if(i.has(t.name))throw Error(`duplicated node name: ${t.name}`);let e=this._nodes.push(new ua(t))-1;i.set(t.name,e)}for(let i=0;i<this._nodes.length;i++){let n=this._nodes[i],o=e.node[i];if(!o.output)throw Error(`missing output for node: ${o.name}`);for(let e of o.output){let a=t.get(e);if(typeof a>"u"&&(a=this._allData.push(new zn)-1,t.set(e,a)),n.outputs.push(a),void 0!==this._allData[a]._from)throw Error(`multiple nodes output to one data value: ${a}`);if(this._allData[a]._from=i,"Constant"===o.opType){if(!o.attribute||1!==o.attribute.length||!o.attribute[0].t)throw Error("missing attributes or missing tensor value in attributes for this Constant operator");if(!o.output||1!==o.output.length)throw Error("missing output or incorrect number of outputs for this Constant operator");n.outputs.pop(),n.executeNode=!1,this._allData[a]._from=-1,this._allData[a].tensor=nt.fromProto(o.attribute[0].t)}}}for(let i=0;i<this._nodes.length;i++){let n=this._nodes[i],o=e.node[i];if(!o.input)throw Error(`missing input for node: ${o.name}`);for(let e of o.input){let a=t.get(e);if(typeof a>"u"){if(""===e&&(3===o.input.length||4===o.input.length)&&"Resize"===o.opType)continue;throw Error(`unrecognized input '${e}' for node: ${o.name}`)}n.inputs.push(a),this._allData[a]._to.push(i)}}return!0}buildGraphFromOrtFormat(e){let t=new Map;this._allData=[],this._allInputIndices=[],this._allInputNames=[],this._allOutputIndices=[],this._allOutputNames=[],this._nodes=[];let i=new Map,n=[];for(let i=0;i<e.inputsLength();i++){let o=e.inputs(i);if(t.has(o))throw Error(`duplicated input name: ${o}`);for(let i=0;i<e.nodeArgsLength();i++)if(e.nodeArgs(i)?.name()===o){let a=new zn;if(e.nodeArgs(i)?.type()?.valueType()!==ol.TypeInfoValue.tensor_type)throw Error("Unexpected value type for the nodeArg.");let s=e.nodeArgs(i).type().value(new rl.TensorTypeAndShape),u=ft.tensorDataTypeFromProto(s.elemType()),l=s.shape(),d=[];for(let e=0;e<l.dimLength();e++)d.push(xt.longToNumber(l.dim(e).value().dimValue()));a.type={shape:{dims:d},tensorType:u};let p=this._allData.push(a)-1;t.set(o,p),n.push(o)}}for(let i=0;i<e.initializersLength();i++){let n=e.initializers(i),o=t.get(n.name());if(void 0===o){let e=new zn;e.type={shape:{dims:ft.tensorDimsFromORTFormat(n)},tensorType:ft.tensorDataTypeFromProto(n.dataType())},o=this._allData.push(e)-1,t.set(n.name(),o)}this._allData[o]._from=-1,this._allData[o].tensor=nt.fromOrtTensor(n)}for(let e=0;e<this._allData.length;e++)this._allData[e].tensor||(this._allInputIndices.push(e),this._allInputNames.push(n[e]));for(let i=0;i<e.outputsLength();i++){let n=e.outputs(i);if(t.has(n))throw Error(`duplicated output name: ${n}`);let o=this._allData.push(new zn)-1;t.set(n,o),this._allOutputIndices.push(o),this._allOutputNames.push(n)}if(!e.nodes)throw Error("missing information in graph: node");for(let t=0;t<e.nodesLength();t++){let n=e.nodes(t),o=n.name();if(!o)for(let e=0;o=`unnamed_${n.opType()}_${e}`,i.has(o);e++);if(i.has(o))throw Error(`duplicated node name: ${o}`);let a=this._nodes.push(new ua(n,o))-1;i.set(o,a)}for(let i=0;i<this._nodes.length;i++){let n=this._nodes[i],o=e.nodes(i);if(null==o)throw Error(`No node exists at index ${i}`);if(o?.outputsLength()===0)throw Error(`missing output for node: ${o.name}`);for(let e=0;e<o?.outputsLength();e++){let a=o?.outputs(e),s=t.get(a);if(typeof s>"u"&&(s=this._allData.push(new zn)-1,t.set(a,s)),n.outputs.push(s),void 0!==this._allData[s]._from)throw Error(`multiple nodes output to one data value: ${s}`);if(this._allData[s]._from=i,"Constant"===o.opType()){if(1!==o.attributesLength()||!o.attributes(0).t())throw Error("missing attributes or missing tensor value in attributes for this Constant operator");if(1!==o.outputsLength())throw Error("missing output or incorrect number of outputs for this Constant operator");n.outputs.pop(),n.executeNode=!1,this._allData[s]._from=-1,this._allData[s].tensor=nt.fromOrtTensor(o.attributes(0).t())}}}for(let i=0;i<this._nodes.length;i++){let n=this._nodes[i],o=e.nodes(i);if(0===o.inputsLength())throw Error(`missing input for node: ${o.name}`);for(let e=0;e<o.inputsLength();e++){let a=o.inputs(e),s=t.get(a);if(typeof s>"u")throw Error(`unrecognized input '${a}' for node: ${o.name()}`);n.inputs.push(s),this._allData[s]._to.push(i)}}}checkIsAcyclic(){let e=new Set;this._allInputIndices.forEach(t=>{this._allData[t]._to.forEach(t=>{e.add(t)})});let t=Array.from(e),i=Array(this._nodes.length).fill("white");for(;t.length>0;){let e=t.pop();"gray"===i[e]?i[e]="black":(t.push(e),i[e]="gray",this._nodes[e].outputs.forEach(n=>{let o=this._allData[n];if("u">typeof o.tensor)throw Error("node outputs should not be initialized");if(o._from!==e)throw Error("from property of the Value object doesn't match index of Node being processed");o._to.forEach(e=>{if("gray"===i[e])throw Error("model graph is cyclic");"white"===i[e]&&t.push(e)})}))}}transformGraph(e){this.removeAllIdentityNodes(),this.removeAllDropoutNodes(),this.fuseConvActivationNodes(),e&&e.transformGraph(this),this.finalizeGraph()}finalizeGraph(){let e=0,t=[this._nodes.length,0],i=0;for(let e=0;e<this._nodes.length;e++)t[e]=i,this._nodes[e].executeNode?(i!==e&&(this._nodes[i]=this._nodes[e]),i++):this._nodes[e].outputs.forEach(e=>{this._allData[e]._from=-2});this._nodes.splice(i,this._nodes.length-i);for(let e=0;e<this._allData.length;e++){let i=this._allData[e];void 0!==i._from&&-1!==i._from&&-2!==i._from&&(i._from=t[i._from]);for(let e=0;e<i._to.length;e++)if(i._to[e]>=0)i._to[e]=t[i._to[e]];else throw Error("Trying to update a removed node")}e=0;for(let t=0;t<this._allData.length;t++){if(-2===this._allData[t].from&&-1===this._allOutputIndices.indexOf(t+e)){e++,this._allData.splice(t,1),t--;continue}if(e>0){let i=-1;void 0!==this._allData[t].from&&-1!==this._allData[t].from?-1!==(i=this._nodes[this._allData[t].from].outputs.indexOf(t+e))&&(this._nodes[this._allData[t].from].outputs[i]=t):-1!==(i=this._allInputIndices.indexOf(t+e))&&(this._allInputIndices[i]=t),this._allData[t].to.forEach(n=>{-1!==(i=this._nodes[n].inputs.indexOf(t+e))&&(this._nodes[n].inputs[i]=t)}),0===this._allData[t].to.length&&-1!==(i=this._allOutputIndices.indexOf(t+e))&&(this._allOutputIndices[i]=t)}}}deleteNode(e){let t=this._nodes[e];if(t.outputs.length>1){for(let e=1;e<t.outputs.length;e++)if(this._allData[t.outputs[e]].to.length>0)throw Error("Node deletion with more than one output connected to other nodes is not supported. ")}t.executeNode=!1;let i=t.inputs[0],n=t.outputs[0],o=this._allData[n].to;for(let i=0;i<t.inputs.length;i++){let n=this._allData[t.inputs[i]].to.indexOf(e);if(-1===n)throw Error("The Value object doesn't have the current Node in it's 'to' property ");this._allData[t.inputs[i]].to.splice(n,1)}this._allData[n]._to=[];let a=this._allOutputIndices.indexOf(n);if(-1!==a&&(this._allOutputIndices[a]=i),o&&o.length>0)for(let e of o){let t=this._nodes[e].inputs.indexOf(n);if(-1===t)throw Error("The Node object doesn't have the output Value in it's 'inputs' property ");this._nodes[e].inputs[t]=i,this._allData[i].to.push(e)}}removeAllDropoutNodes(){let e=0;for(let t of this._nodes){if("Dropout"===t.opType){if(1!==t.inputs.length)throw Error("Dropout nodes should only contain one input. ");if(1!==t.outputs.length&&2!==t.outputs.length)throw Error("Dropout nodes should contain either 1 or 2 output(s)");if(2===t.outputs.length&&0!==this._allData[t.outputs[1]]._to.length)throw Error("Dropout nodes's second output should not be referenced by other nodes");this.deleteNode(e)}e++}}removeAllIdentityNodes(){let e=0;for(let t of this._nodes)"Identity"===t.opType&&this.deleteNode(e),e++}isActivation(e){switch(e.opType){case"Relu":case"Sigmoid":case"Clip":return!0;default:return!1}}fuseConvActivationNodes(){for(let e of this._nodes)if("Conv"===e.opType){let t=this._allData[e.outputs[0]]._to;if(1===t.length&&this.isActivation(this._nodes[t[0]])){let i=this._nodes[t[0]];if("Clip"===i.opType)if(1===i.inputs.length)try{e.attributes.set("activation_params","floats",[i.attributes.getFloat("min"),i.attributes.getFloat("max")])}catch{e.attributes.set("activation_params","floats",[Lr,Rr])}else{if(!(i.inputs.length>=3)||void 0===this._allData[i.inputs[1]].tensor||void 0===this._allData[i.inputs[2]].tensor)continue;e.attributes.set("activation_params","floats",[this._allData[i.inputs[1]].tensor.floatData[0],this._allData[i.inputs[2]].tensor.floatData[0]])}e.attributes.set("activation","string",i.opType),this.deleteNode(t[0])}}}}}),ay=k(()=>{"use strict";oy=ve(ze()),ry(),$o(),iy=ve(to()),Me(),la=class{constructor(){}load(e,t,i){let n;if(!i)try{this.loadFromOnnxFormat(e,t);return}catch(e){if(void 0!==i)throw e;n=e}try{this.loadFromOrtFormat(e,t)}catch(e){throw void 0!==i?e:Error(`Failed to load model as ONNX format: ${n}
as ORT format: ${e}`)}}loadFromOnnxFormat(e,t){let i=iy.onnx.ModelProto.decode(e);if(3>xt.longToNumber(i.irVersion))throw Error("only support ONNX model with IR_VERSION>=3");this._opsets=i.opsetImport.map(e=>({domain:e.domain,version:xt.longToNumber(e.version)})),this._graph=tc.from(i.graph,t)}loadFromOrtFormat(e,t){let i=new oy.ByteBuffer(e),n=tl.InferenceSession.getRootAsInferenceSession(i).model();if(3>xt.longToNumber(n.irVersion()))throw Error("only support ONNX model with IR_VERSION>=3");this._opsets=[];for(let e=0;e<n.opsetImportLength();e++){let t=n.opsetImport(e);this._opsets.push({domain:t?.domain(),version:xt.longToNumber(t.version())})}this._graph=tc.from(n.graph(),t)}get graph(){return this._graph}get opsets(){return this._opsets}}}),sy=k(()=>{"use strict";ey(),ty(),Ct(),ay(),ca=class{constructor(e={}){this._initialized=!1,this.backendHint=e.backendHint,this.profiler=mi.create(e.profiler),this.context={profiler:this.profiler,graphInputTypes:[],graphInputDims:[]}}get inputNames(){return this._model.graph.getInputNames()}get outputNames(){return this._model.graph.getOutputNames()}startProfiling(){this.profiler.start()}endProfiling(){this.profiler.stop()}async loadModel(e,t,i){await this.profiler.event("session","Session.loadModel",async()=>{let n=await Jl(this.backendHint);if(this.sessionHandler=n.createSessionHandler(this.context),this._model=new la,"string"==typeof e){let t=e.endsWith(".ort");{let i=await (await fetch(e)).arrayBuffer();this.initialize(new Uint8Array(i),t)}}else if(ArrayBuffer.isView(e))this.initialize(e);else{let n=new Uint8Array(e,t||0,i||e.byteLength);this.initialize(n)}})}initialize(e,t){if(this._initialized)throw Error("already initialized");this.profiler.event("session","Session.initialize",()=>{let i=this.sessionHandler.transformGraph?this.sessionHandler:void 0;this._model.load(e,i,t),this.sessionHandler.onGraphInitialized&&this.sessionHandler.onGraphInitialized(this._model.graph),this.initializeOps(this._model.graph),this._executionPlan=new sa(this._model.graph,this._ops,this.profiler)}),this._initialized=!0}async run(e){if(!this._initialized)throw Error("session not initialized yet");return this.profiler.event("session","Session.run",async()=>{let t=this.normalizeAndValidateInputs(e),i=await this._executionPlan.execute(this.sessionHandler,t);return this.createOutput(i)})}normalizeAndValidateInputs(e){let t=this._model.graph.getInputNames();if(Array.isArray(e)){if(e.length!==t.length)throw Error(`incorrect input array length: expected ${t.length} but got ${e.length}`)}else{if(e.size!==t.length)throw Error(`incorrect input map size: expected ${t.length} but got ${e.size}`);let i=Array(e.size),n=0;for(let o=0;o<t.length;++o){let a=e.get(t[o]);if(!a)throw Error(`missing input tensor for: '${name}'`);i[n++]=a}e=i}if(this.context.graphInputTypes&&0!==this.context.graphInputTypes.length&&this.context.graphInputDims&&0!==this.context.graphInputDims.length)this.validateInputTensorDims(this.context.graphInputDims,e,!1);else{let t=this._model.graph.getInputIndices(),i=this._model.graph.getValues(),n=Array(t.length);for(let o=0;o<t.length;++o){let a=i[t[o]];n[o]=a.type.shape.dims,this.context.graphInputTypes.push(a.type.tensorType),this.context.graphInputDims.push(e[o].dims)}this.validateInputTensorDims(n,e,!0)}return this.validateInputTensorTypes(this.context.graphInputTypes,e),e}validateInputTensorTypes(e,t){for(let i=0;i<t.length;i++){let n=e[i],o=t[i].type;if(n!==o)throw Error(`input tensor[${i}] check failed: expected type '${n}' but got ${o}`)}}validateInputTensorDims(e,t,i){for(let n=0;n<t.length;n++){let o=e[n],a=t[n].dims;if(!this.compareTensorDims(o,a,i))throw Error(`input tensor[${n}] check failed: expected shape '[${o.join(",")}]' but got [${a.join(",")}]`)}}compareTensorDims(e,t,i){if(e.length!==t.length)return!1;for(let n=0;n<e.length;++n)if(e[n]!==t[n]&&(!i||0!==e[n]))return!1;return!0}createOutput(e){let t=this._model.graph.getOutputNames();if(e.length!==t.length)throw Error("expected number of outputs do not match number of generated outputs");let i=new Map;for(let n=0;n<t.length;++n)i.set(t[n],e[n]);return i}initializeOps(e){let t=e.getNodes();this._ops=Array(t.length);for(let i=0;i<t.length;i++)this._ops[i]=this.sessionHandler.resolve(t[i],this._model.opsets,e)}}}),uy=k(()=>{"use strict";pt(),zr(),da=class{constructor(e){this.session=e,this.inputNames=this.session.inputNames,this.outputNames=this.session.outputNames}get inputMetadata(){throw Error("Getting model metadata is not supported in webgl backend.")}get outputMetadata(){throw Error("Getting model metadata is not supported in webgl backend.")}async dispose(){}async run(e,t,i){let n=new Map;for(let t in e)if(Object.hasOwnProperty.call(e,t)){let i=e[t];n.set(t,new nt(i.dims,i.type,void 0,void 0,i.data))}let o=await this.session.run(n),a={};return o.forEach((e,t)=>{a[t]=new St(e.type,e.data,e.dims)}),a}startProfiling(){this.session.startProfiling()}endProfiling(){this.session.endProfiling()}}}),ly={};$r(ly,{onnxjsBackend:()=>OO});var OO,cy=k(()=>{"use strict";sy(),uy(),OO=new class{async init(){}async createInferenceSessionHandler(e,t){let i=new ca(t);return await i.loadModel(e),new da(i)}}}),pa=k(()=>{}),fy={};$r(fy,{default:()=>PO});var dy,py,PO,hy=k(()=>{"use strict";rc(),yr(),fa(),dy="ort-wasm-proxy-worker",(py=globalThis.self?.name===dy)&&(self.onmessage=e=>{let{type:t,in:i}=e.data;try{switch(t){case"init-wasm":ha(i.wasm).then(()=>{ma(i).then(()=>{postMessage({type:t})},e=>{postMessage({type:t,err:e})})},e=>{postMessage({type:t,err:e})});break;case"init-ep":{let{epName:e,env:n}=i;ga(n,e).then(()=>{postMessage({type:t})},e=>{postMessage({type:t,err:e})});break}case"copy-from":{let{buffer:e}=i,n=Fo(e);postMessage({type:t,out:n});break}case"create":{let{model:e,options:n}=i;ba(e,n).then(e=>{postMessage({type:t,out:e})},e=>{postMessage({type:t,err:e})});break}case"release":ya(i),postMessage({type:t});break;case"run":{let{sessionId:e,inputIndices:n,inputs:o,outputIndices:a,options:s}=i;_a(e,n,o,a,Array(a.length).fill(null),s).then(e=>{e.some(e=>"cpu"!==e[3])?postMessage({type:t,err:"Proxy does not support non-cpu tensor location."}):postMessage({type:t,out:e},wa([...o,...e]))},e=>{postMessage({type:t,err:e})});break}case"end-profiling":va(i),postMessage({type:t})}}catch(e){postMessage({type:t,err:e})}}),PO=py?null:e=>new Worker(e??Ot,{type:"module",name:dy})}),gy={};$r(gy,{default:()=>EO});var my,EO,vy,ic,Ot,wy,oc,kO,NO,xy,LO,yy,Ty,_y,Iy,ac,sc,xa,Sy,RO,zO,MO,ha,Be,Pt,Vo,Ne,$y,BO,FO,VO,Ia,GO,Oy,_r,Mn,vr,co,Go,Sa,$a,uc,Uo,UO,WO,Ey,Cy,Aa,HO,_e,cc,Fn,C,Ur,Oa,Dy,ky,Pa,Ly,fc,Ry,jO,Ny,qO,zy,Ea,Ca,pc,My,Da,KO,ka,Vy,hc,mc,XO,ZO,Gy,bc,gc,Wy,yc,ce,Wr,vc,Ve,it,W,Ee,wc,Hr,Kt,Q,La,N,G,jy,Ra,_c,qy,JO,Ky,YO,QO,eP,tP,at,Xy,Zy,nP,rP,oP,iP,aP,sP,uP,lP,cP,dP,Vn,Jy,Yy,Qy,e_,t_,n_,r_,o_,i_,a_,Gn,pP,Ma,xc,Un,fP,hP,mP,gP,bP,yP,_P,vP,wP,xP,Wn,u_,l_,c_,d_,p_,f_,h_,m_,g_,b_,y_,__,v_,Tc,TP,Ic,IP,SP,$P,po,AP,x_,OP,PP,EP,T_,CP,DP,S_,kP,Le,A_,O_,P_,E_,C_,D_,k_,N_,L_,NP,R_,z_,M_,B_,Wo,F_,Fa,V_,G_,U_,W_,H_,j_,q_,K_,X_,Z_,J_,Y_,Q_,ev,tv,nv,rv,ov,Sc,$c,iv,av,sv,LP,RP,uv,zP,MP,cv,BP,FP,Hn,pv,fv,hv,mv,gv,bv,yv,_v,vv,wv,GP,UP,WP,HP,Tv,Iv,Xt,Zt,Jt,Ga,rt,$v,Av,Ho,Wa,jP,qP,Ac,Pv,KP,Oc,XP,jo,ZP,Ev,JP,Dv,qa,YP,kv,QP,Nv,Lv,zv,Mv,e3,Pc,t3,Ec,Cc,Fv,n3,r3,Dc,Gv,o3,i3,a3,Wv,Hv,s3,jv,u3,qv,l3,Xv,Zv,c3,d3,p3,Yv,Qv,kc,Ka,t0,h3,Nc,Lc,n0,m3,r0,o0,g3,a0,b3,y3,s0,_3,l0,v3,w3,d0,p0,x3,h0,m0,T3,I3,b0,y0,S3,$3,v0,w0,A3,O3,T0,I0,Qn,xr,fo,ho,P3,E3,C3,D3,k3,N3,L3,R3,$0,A0,Tt,B3,E0,P0,F3,qo,C0,V3,G3,U3,W3,zc,D0,k0,H3,Xa,N0,j3,q3,L0,K3,R0,M0,X3,Z3,B0,J3,Y3,V0,Q3,U0,eE,tE,nE,H0,j0,rE,oE,iE,aE,sE,uE,lE,cE,K0,Za,Z0,J0,Y0,Q0,dE,pE,ew,tw,nw,rw,ow,iw,aw,sw,uw,lw,cw,dw,hE,mE,fw,hw,gE,bE,gw,yE,_E,yw,_w,vE,wE,xE,ww,TE,IE,SE,$E,AE,OE,PE,EE,xw,CE,DE,kE,NE,LE,Tw,Iw,RE,zE,$w,ME,Ja,BE,Ow,FE,VE,Pw,Ew,GE,UE,Dw,kw,Lw,WE,HE,jE,Rw,qE,KE,Mw,Fw,Ya,by=k(()=>{"use strict";EO=my=async function(e={}){var t,i,n=e,o=new Promise((e,n)=>{t=e,i=n}),a="object"==typeof window,s="u">typeof WorkerGlobalScope,u=s&&self.name?.startsWith("em-pthread");n.mountExternalData=(e,t)=>{e.startsWith("./")&&(e=e.substring(2)),(n.Fb||(n.Fb=new Map)).set(e,t)},n.unmountExternalData=()=>{delete n.Fb};var l=globalThis.SharedArrayBuffer??new WebAssembly.Memory({initial:0,maximum:0,qc:!0}).buffer.constructor;let d=e=>async(...t)=>{try{if(n.Gb)throw Error("Session already started");let i=n.Gb={ec:t[0],errors:[]},o=await e(...t);if(n.Gb!==i)throw Error("Session mismatch");n.Kb?.flush();let a=i.errors;if(0<a.length){let e=await Promise.all(a);if(e=e.filter(e=>e),0<e.length)throw Error(e.join(`
`))}return o}finally{n.Gb=null}};n.jsepInit=(e,t)=>{if("webgpu"===e){[n.Kb,n.Vb,n.Zb,n.Lb,n.Yb,n.Ab,n.$b,n.bc,n.Wb,n.Xb,n.ac]=t;let e=n.Kb;n.jsepRegisterBuffer=(t,i,n,o)=>e.registerBuffer(t,i,n,o),n.jsepGetBuffer=t=>e.getBuffer(t),n.jsepCreateDownloader=(t,i,n)=>e.createDownloader(t,i,n),n.jsepOnCreateSession=t=>{e.onCreateSession(t)},n.jsepOnReleaseSession=t=>{e.onReleaseSession(t)},n.jsepOnRunStart=t=>e.onRunStart(t),n.cc=(t,i)=>{e.upload(t,i)}}else if("webnn"===e){let e=t[0];[n.oc,n.Ob,n.webnnEnsureTensor,n.Pb,n.webnnDownloadTensor,n.nc,n.webnnEnableTraceEvent]=t.slice(1),n.webnnReleaseTensorId=n.Ob,n.webnnUploadTensor=n.Pb,n.webnnRegisterMLContext=n.nc,n.webnnOnRunStart=t=>e.onRunStart(t),n.webnnOnRunEnd=e.onRunEnd.bind(e),n.webnnOnReleaseSession=t=>{e.onReleaseSession(t)},n.webnnCreateMLTensorDownloader=(t,i)=>e.createMLTensorDownloader(t,i),n.webnnRegisterMLTensor=(t,i,n,o)=>e.registerMLTensor(t,i,n,o),n.webnnCreateMLContext=t=>e.createMLContext(t),n.webnnRegisterMLConstant=(t,i,o,a,s,u)=>e.registerMLConstant(t,i,o,a,s,n.Fb,u),n.webnnRegisterGraphInput=e.registerGraphInput.bind(e),n.webnnIsGraphInput=e.isGraphInput.bind(e),n.webnnRegisterGraphOutput=e.registerGraphOutput.bind(e),n.webnnIsGraphOutput=e.isGraphOutput.bind(e),n.webnnCreateTemporaryTensor=e.createTemporaryTensor.bind(e),n.webnnIsGraphInputOutputTypeSupported=e.isGraphInputOutputTypeSupported.bind(e)}};let p=()=>{let e=(e,t,i)=>(...n)=>{let o=rB,a=t?.();n=e(...n);let s=t?.();return a!==s&&(e=s,i(a),t=i=null),rB!=o?new Promise((e,t)=>{rq={resolve:e,reject:t}}):n};(()=>{for(let t of["_OrtAppendExecutionProvider","_OrtCreateSession","_OrtRun","_OrtRunWithBinding","_OrtBindInput"])n[t]=e(n[t],()=>n[t],e=>n[t]=e)})(),void 0!==d&&(n._OrtRun=d(n._OrtRun),n._OrtRunWithBinding=d(n._OrtRunWithBinding)),p=void 0};n.asyncInit=()=>{p?.()};var c,h,f=(e,t)=>{throw t},m=import.meta.url,g="";if(a||s){try{g=new URL(".",m).href}catch{}s&&(h=e=>{var t=new XMLHttpRequest;return t.open("GET",e,!1),t.responseType="arraybuffer",t.send(null),new Uint8Array(t.response)}),c=async e=>{if(L(e))return new Promise((t,i)=>{var n=new XMLHttpRequest;n.open("GET",e,!0),n.responseType="arraybuffer",n.onload=()=>{200==n.status||0==n.status&&n.response?t(n.response):i(n.status)},n.onerror=i,n.send(null)});var t=await fetch(e,{credentials:"same-origin"});if(t.ok)return t.arrayBuffer();throw Error(t.status+" : "+t.url)}}var b,y,_,v,x,w,$,T,I,S,O,E,A,P,D,z=console.log.bind(console),R=console.error.bind(console),B=z,M=R,F=!1,L=e=>e.startsWith("file://");function V(){return y.buffer!=x.buffer&&er(),x}function U(){return y.buffer!=x.buffer&&er(),w}function q(){return y.buffer!=x.buffer&&er(),$}function H(){return y.buffer!=x.buffer&&er(),T}function K(){return y.buffer!=x.buffer&&er(),I}function X(){return y.buffer!=x.buffer&&er(),S}function Z(){return y.buffer!=x.buffer&&er(),O}function J(){return y.buffer!=x.buffer&&er(),P}if(u){let e=function(t){try{var i=t.data,o=i.Db;if("load"===o){let t=[];for(let o of(self.onmessage=e=>t.push(e),self.startWorker=()=>{for(let i of(postMessage({Db:"loaded"}),t))e(i);self.onmessage=e},i.Sb))n[o]&&!n[o].proxy||(n[o]=(...e)=>{postMessage({Db:"callHandler",Rb:o,args:e})},"print"==o&&(B=n[o]),"printErr"==o&&(M=n[o]));y=i.kc,er(),D(i.lc)}else if("run"===o){eq(i.Bb),nL(i.Bb,0,0,1,0,0),eL(),rr(i.Bb),ee||(nj(),ee=!0);try{eG(i.hc,i.Jb)}catch(e){if("unwind"!=e)throw e}}else"setimmediate"!==i.target&&("checkMailbox"===o?ee&&ri():o&&(M(`worker: received unknown command ${o}`),M(i)))}catch(e){throw nV(),e}};var ee=!1;self.onunhandledrejection=e=>{throw e.reason||e},self.onmessage=e}function er(){var e=y.buffer;n.HEAP8=x=new Int8Array(e),$=new Int16Array(e),n.HEAPU8=w=new Uint8Array(e),T=new Uint16Array(e),n.HEAP32=I=new Int32Array(e),n.HEAPU32=S=new Uint32Array(e),O=new Float32Array(e),P=new Float64Array(e),E=new BigInt64Array(e),A=new BigUint64Array(e)}function ei(){u?startWorker(n):nz.Da()}var en,eo=0,eu=null;function ed(){if(0==--eo&&eu){var e=eu;eu=null,e()}}function ep(e){throw M(e="Aborted("+e+")"),F=!0,e=new WebAssembly.RuntimeError(e+". Build with -sASSERTIONS for more info."),i(e),e}function eh(){return{a:{L:nN,Aa:nD,b:eW,$:eX,A:eY,pa:e1,X:e2,Z:e4,qa:e6,na:e8,ga:e5,ma:e7,J:e9,Y:te,V:tt,oa:tr,W:ti,va:td,E:tN,Q:tR,O:tq,D:tH,v:tW,s:tK,P:tJ,z:t5,R:t7,ja:t9,T:rn,aa:rh,M:rf,F:rT,ia:rr,sa:rI,r:rN,Ca:rz,w:rW,o:rX,m:rQ,c:tM,Ba:rY,n:r2,j:r8,u:r5,p:r7,f:r9,t:ie,l:ir,e:ii,k:is,h:il,g:id,d:ih,da:iT,ea:iD,fa:iN,ba:iz,ca:iR,N:iM,xa:iF,ua:iU,i:iH,C:iW,G:iK,ta:iL,x:iX,ra:iZ,U:iJ,q:iB,y:iQ,K:iY,S:i1,za:i8,ya:i5,ka:ni,la:nn,_:ez,B:nu,I:nd,ha:np,H:nh,a:y,wa:eD}}}class ef{name="ExitStatus";constructor(e){this.message=`Program terminated with exit(${e})`,this.status=e}}var e$=e=>{e.terminate(),e.onmessage=()=>{}},eT=[],eI=e=>{0==eR.length&&(eU(),eV(eR[0]));var t=eR.pop();if(!t)return 6;ej.push(t),eM[e.Bb]=t,t.Bb=e.Bb;var i={Db:"run",hc:e.fc,Jb:e.Jb,Bb:e.Bb};return t.postMessage(i,e.Nb),0},ek=0,eC=(e,t,...i)=>{for(var n=2*i.length,o=nJ(),a=nZ(8*n),s=a>>>3,u=0;u<i.length;u++){var l=i[u];"bigint"==typeof l?(E[s+2*u]=1n,E[s+2*u+1]=l):(E[s+2*u]=0n,J()[s+2*u+1>>>0]=l)}return e=nU(e,0,n,a,t),nX(o),e};function eD(e){if(u)return eC(0,1,e);if(v=e,!(0<ek)){for(var t of ej)e$(t);for(t of eR)e$(t);eR=[],ej=[],eM={},F=!0}f(0,new ef(e))}function eN(e){if(u)return eC(1,0,e);ez(e)}var ez=e=>{if(v=e,u)throw eN(e),"unwind";eD(e)},eR=[],ej=[],eB=[],eM={},eF=e=>{var t=e.Bb;delete eM[t],eR.push(e),ej.splice(ej.indexOf(e),1),e.Bb=0,nq(t)};function eL(){eB.forEach(e=>e())}var eV=e=>new Promise(t=>{e.onmessage=i=>{var o=(i=i.data).Db;if(i.Hb&&i.Hb!=nB()){var a=eM[i.Hb];a?a.postMessage(i,i.Nb):M(`Internal error! Worker sent a message "${o}" to target pthread ${i.Hb}, but that thread no longer exists!`)}else"checkMailbox"===o?ri():"spawnThread"===o?eI(i):"cleanupThread"===o?eF(eM[i.ic]):"loaded"===o?(e.loaded=!0,t(e)):"setimmediate"===i.target?e.postMessage(i):"callHandler"===o?n[i.Rb](...i.args):o&&M(`worker sent an unknown command ${o}`)},e.onerror=e=>{throw M(`worker sent an error! ${e.filename}:${e.lineno}: ${e.message}`),e};var i,o=[];for(i of[])n.propertyIsEnumerable(i)&&o.push(i);e.postMessage({Db:"load",Sb:o,kc:y,lc:_})});function eU(){var e=new Worker((()=>{let e=URL;return import.meta.url>"file:"&&import.meta.url<"file;"?new e("ort.all.bundle.min.mjs",import.meta.url):new URL(import.meta.url)})(),{type:"module",workerData:"em-pthread",name:"em-pthread"});eR.push(e)}var eq=e=>{er();var t=X()[e+52>>>2>>>0];e=X()[e+56>>>2>>>0],nK(t,t-e),nX(t)},eG=(e,t)=>{ek=0,e=nQ(e,t),0<ek?v=e:nG(e)};class eH{constructor(e){this.Ib=e-24}}function eW(e,t,i){var n=new eH(e>>>=0);throw t>>>=0,i>>>=0,X()[n.Ib+16>>>2>>>0]=0,X()[n.Ib+4>>>2>>>0]=t,X()[n.Ib+8>>>2>>>0]=i,e}function eK(e,t,i,n){return u?eC(2,1,e,t,i,n):eX(e,t,i,n)}function eX(e,t,i,n){if(e>>>=0,i>>>=0,n>>>=0,void 0===l)return 6;var o=[];return u&&0===o.length?eK(e,t>>>=0,i,n):(e={fc:i,Bb:e,Jb:n,Nb:o},u?(e.Db="spawnThread",postMessage(e,o),0):eI(e))}var eZ="u">typeof TextDecoder?new TextDecoder:void 0,eJ=(e,t=0,i=NaN)=>{var n=(t>>>=0)+i;for(i=t;e[i]&&!(i>=n);)++i;if(16<i-t&&e.buffer&&eZ)return eZ.decode(e.buffer instanceof ArrayBuffer?e.subarray(t,i):e.slice(t,i));for(n="";t<i;){var o=e[t++];if(128&o){var a=63&e[t++];if((224&o)==192)n+=String.fromCharCode((31&o)<<6|a);else{var s=63&e[t++];65536>(o=(240&o)==224?(15&o)<<12|a<<6|s:(7&o)<<18|a<<12|s<<6|63&e[t++])?n+=String.fromCharCode(o):(o-=65536,n+=String.fromCharCode(55296|o>>10,56320|1023&o))}}else n+=String.fromCharCode(o)}return n},eQ=(e,t)=>(e>>>=0)?eJ(U(),e,t):"";function eY(e,t,i){return u?eC(3,1,e,t,i):0}function e1(e,t){if(u)return eC(4,1,e,t)}function e2(e,t){if(u)return eC(5,1,e,t)}function e4(e,t,i){if(u)return eC(6,1,e,t,i)}function e6(e,t,i){return u?eC(7,1,e,t,i):0}function e8(e,t){if(u)return eC(8,1,e,t)}function e5(e,t,i){if(u)return eC(9,1,e,t,i)}function e7(e,t,i,n){if(u)return eC(10,1,e,t,i,n)}function e9(e,t,i,n){if(u)return eC(11,1,e,t,i,n)}function te(e,t,i,n){if(u)return eC(12,1,e,t,i,n)}function tt(e){if(u)return eC(13,1,e)}function tr(e,t){if(u)return eC(14,1,e,t)}function ti(e,t,i){if(u)return eC(15,1,e,t,i)}var tn,td=()=>ep(""),tp=e=>{for(var t="";U()[e>>>0];)t+=tn[U()[e++>>>0]];return t},th={},tf={},tT={},tI=n.BindingError=class extends Error{constructor(e){super(e),this.name="BindingError"}};function tk(e,t,i={}){return function(e,t,i={}){var n=t.name;if(!e)throw new tI(`type "${n}" must have a positive integer typeid pointer`);if(tf.hasOwnProperty(e)){if(i.Tb)return;throw new tI(`Cannot register type '${n}' twice`)}tf[e]=t,delete tT[e],th.hasOwnProperty(e)&&(t=th[e],delete th[e],t.forEach(e=>e()))}(e,t,i)}var tD=(e,t,i)=>{switch(t){case 1:return i?e=>V()[e>>>0]:e=>U()[e>>>0];case 2:return i?e=>q()[e>>>1>>>0]:e=>H()[e>>>1>>>0];case 4:return i?e=>K()[e>>>2>>>0]:e=>X()[e>>>2>>>0];case 8:return i?e=>E[e>>>3]:e=>A[e>>>3];default:throw TypeError(`invalid integer width (${t}): ${e}`)}};function tN(e,t,i){i>>>=0,tk(e>>>=0,{name:t=tp(t>>>0),fromWireType:e=>e,toWireType:function(e,t){if("bigint"!=typeof t&&"number"!=typeof t)throw t=null===t?"null":"object"==(e=typeof t)||"array"===e||"function"===e?t.toString():""+t,TypeError(`Cannot convert "${t}" to ${this.name}`);return"number"==typeof t&&(t=BigInt(t)),t},Cb:tz,readValueFromPointer:tD(t,i,-1==t.indexOf("u")),Eb:null})}var tz=8;function tR(e,t,i,n){tk(e>>>=0,{name:t=tp(t>>>0),fromWireType:function(e){return!!e},toWireType:function(e,t){return t?i:n},Cb:tz,readValueFromPointer:function(e){return this.fromWireType(U()[e>>>0])},Eb:null})}var tj=[],tB=[];function tM(e){9<(e>>>=0)&&0==--tB[e+1]&&(tB[e]=void 0,tj.push(e))}var tF=e=>{if(!e)throw new tI(`Cannot use deleted val. handle = ${e}`);return tB[e]},tL=e=>{switch(e){case void 0:return 2;case null:return 4;case!0:return 6;case!1:return 8;default:let t=tj.pop()||tB.length;return tB[t]=e,tB[t+1]=1,t}};function tV(e){return this.fromWireType(X()[e>>>2>>>0])}var tU={name:"emscripten::val",fromWireType:e=>{var t=tF(e);return tM(e),t},toWireType:(e,t)=>tL(t),Cb:8,readValueFromPointer:tV,Eb:null};function tq(e){return tk(e>>>0,tU)}var tG=(e,t)=>{switch(t){case 4:return function(e){return this.fromWireType(Z()[e>>>2>>>0])};case 8:return function(e){return this.fromWireType(J()[e>>>3>>>0])};default:throw TypeError(`invalid float width (${t}): ${e}`)}};function tH(e,t,i){i>>>=0,tk(e>>>=0,{name:t=tp(t>>>0),fromWireType:e=>e,toWireType:(e,t)=>t,Cb:tz,readValueFromPointer:tG(t,i),Eb:null})}function tW(e,t,i,n,o){if(e>>>=0,i>>>=0,t=tp(t>>>0),-1===o&&(o=0xffffffff),o=e=>e,0===n){var a=32-8*i;o=e=>e<<a>>>a}var s=t.includes("unsigned")?function(e,t){return t>>>0}:function(e,t){return t};tk(e,{name:t,fromWireType:o,toWireType:s,Cb:tz,readValueFromPointer:tD(t,i,0!==n),Eb:null})}function tK(e,t,i){function n(e){var t=X()[e>>>2>>>0];return e=X()[e+4>>>2>>>0],new o(V().buffer,e,t)}var o=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,BigInt64Array,BigUint64Array][t];tk(e>>>=0,{name:i=tp(i>>>0),fromWireType:n,Cb:tz,readValueFromPointer:n},{Tb:!0})}var tX=(e,t,i)=>{var n=U();if(t>>>=0,0<i){var o=t;i=t+i-1;for(var a=0;a<e.length;++a){var s=e.charCodeAt(a);if(55296<=s&&57343>=s&&(s=65536+((1023&s)<<10)|1023&e.charCodeAt(++a)),127>=s){if(t>=i)break;n[t++>>>0]=s}else{if(2047>=s){if(t+1>=i)break;n[t++>>>0]=192|s>>6}else{if(65535>=s){if(t+2>=i)break;n[t++>>>0]=224|s>>12}else{if(t+3>=i)break;n[t++>>>0]=240|s>>18,n[t++>>>0]=128|s>>12&63}n[t++>>>0]=128|s>>6&63}n[t++>>>0]=128|63&s}}n[t>>>0]=0,e=t-o}else e=0;return e},tZ=e=>{for(var t=0,i=0;i<e.length;++i){var n=e.charCodeAt(i);127>=n?t++:2047>=n?t+=2:55296<=n&&57343>=n?(t+=4,++i):t+=3}return t};function tJ(e,t){tk(e>>>=0,{name:t=tp(t>>>0),fromWireType:function(e){for(var t,i=X()[e>>>2>>>0],n=e+4,o=n,a=0;a<=i;++a){var s=n+a;a!=i&&0!=U()[s>>>0]||(o=eQ(o,s-o),void 0===t?t=o:(t+="\0",t+=o),o=s+1)}return nM(e),t},toWireType:function(e,t){t instanceof ArrayBuffer&&(t=new Uint8Array(t));var i="string"==typeof t;if(!(i||ArrayBuffer.isView(t)&&1==t.BYTES_PER_ELEMENT))throw new tI("Cannot pass non-string to std::string");var n=i?tZ(t):t.length,o=nF(4+n+1),a=o+4;return X()[o>>>2>>>0]=n,i?tX(t,a,n+1):U().set(t,a>>>0),null!==e&&e.push(nM,o),o},Cb:tz,readValueFromPointer:tV,Eb(e){nM(e)}})}var tQ="u">typeof TextDecoder?new TextDecoder("utf-16le"):void 0,tY=(e,t)=>{for(var i=e>>1,n=i+t/2;!(i>=n)&&H()[i>>>0];)++i;if(32<(i<<=1)-e&&tQ)return tQ.decode(U().slice(e,i));for(i="",n=0;!(n>=t/2);++n){var o=q()[e+2*n>>>1>>>0];if(0==o)break;i+=String.fromCharCode(o)}return i},t1=(e,t,i)=>{if(2>(i??=0x7fffffff))return 0;var n=t;i=(i-=2)<2*e.length?i/2:e.length;for(var o=0;o<i;++o){var a=e.charCodeAt(o);q()[t>>>1>>>0]=a,t+=2}return q()[t>>>1>>>0]=0,t-n},t2=e=>2*e.length,t4=(e,t)=>{for(var i=0,n="";!(i>=t/4);){var o=K()[e+4*i>>>2>>>0];if(0==o)break;++i,65536<=o?(o-=65536,n+=String.fromCharCode(55296|o>>10,56320|1023&o)):n+=String.fromCharCode(o)}return n},t6=(e,t,i)=>{if(t>>>=0,4>(i??=0x7fffffff))return 0;var n=t;i=n+i-4;for(var o=0;o<e.length;++o){var a=e.charCodeAt(o);if(55296<=a&&57343>=a&&(a=65536+((1023&a)<<10)|1023&e.charCodeAt(++o)),K()[t>>>2>>>0]=a,(t+=4)+4>i)break}return K()[t>>>2>>>0]=0,t-n},t8=e=>{for(var t=0,i=0;i<e.length;++i){var n=e.charCodeAt(i);55296<=n&&57343>=n&&++i,t+=4}return t};function t5(e,t,i){if(e>>>=0,t>>>=0,i=tp(i>>>=0),2===t)var n=tY,o=t1,a=t2,s=e=>H()[e>>>1>>>0];else 4===t&&(n=t4,o=t6,a=t8,s=e=>X()[e>>>2>>>0]);tk(e,{name:i,fromWireType:e=>{for(var i,o=X()[e>>>2>>>0],a=e+4,u=0;u<=o;++u){var l=e+4+u*t;u!=o&&0!=s(l)||(a=n(a,l-a),void 0===i?i=a:(i+="\0",i+=a),a=l+t)}return nM(e),i},toWireType:(e,n)=>{if("string"!=typeof n)throw new tI(`Cannot pass non-string to C++ string type ${i}`);var s=a(n),u=nF(4+s+t);return X()[u>>>2>>>0]=s/t,o(n,u+4,s+t),null!==e&&e.push(nM,u),u},Cb:tz,readValueFromPointer:tV,Eb(e){nM(e)}})}function t7(e,t){tk(e>>>=0,{Ub:!0,name:t=tp(t>>>0),Cb:0,fromWireType:()=>{},toWireType:()=>{}})}function t9(e){nL(e>>>0,!s,1,!a,131072,!1),eL()}var re=e=>{if(!F)try{if(e(),!(0<ek))try{u?nG(v):ez(v)}catch(e){e instanceof ef||"unwind"==e||f(0,e)}}catch(e){e instanceof ef||"unwind"==e||f(0,e)}};function rr(e){e>>>=0,"function"==typeof Atomics.jc&&(Atomics.jc(K(),e>>>2,e).value.then(ri),e+=128,Atomics.store(K(),e>>>2,1))}var ri=()=>{var e=nB();e&&(rr(e),re(nW))};function rn(e,t){(e>>>=0)==t>>>0?setTimeout(ri):u?postMessage({Hb:e,Db:"checkMailbox"}):(e=eM[e])&&e.postMessage({Db:"checkMailbox"})}var rd=[];function rh(e,t,i,n,o){for(t>>>=0,rd.length=n/=2,i=o>>>0>>>3,o=0;o<n;o++)rd[o]=E[i+2*o]?E[i+2*o+1]:J()[i+2*o+1>>>0];return(t?nk[t]:nI[e])(...rd)}var rf=()=>{ek=0};function rT(e){e>>>=0,u?postMessage({Db:"cleanupThread",ic:e}):eF(eM[e])}function rI(e){}var rk=(e,t)=>{var i=tf[e];if(void 0===i)throw i=tp(e=nR(e)),nM(e),new tI(`${t} has unknown type ${i}`);return i},rD=(e,t,i)=>{var n=[];return e=e.toWireType(n,i),n.length&&(X()[t>>>2>>>0]=tL(n)),e};function rN(e,t,i){return t>>>=0,i>>>=0,e=tF(e>>>0),rD(t=rk(t,"emval::as"),i,e)}function rz(e,t){return t>>>=0,e=tF(e>>>0),(t=rk(t,"emval::as")).toWireType(null,e)}var rR=e=>{try{e()}catch(e){ep(e)}},rj=0,rB=null,rM=0,rF=[],rL={},rV={},rU=0,rq=null,rG=[];function rH(e){return function(e){if(!F){if(0===rj){var t=!1,i=!1;e((e=0)=>{if(!F&&(rM=e,t=!0,i)){rj=2,rR(()=>n2(rB)),"u">typeof MainLoop&&MainLoop.Qb&&MainLoop.resume(),e=!1;try{var n=function(){var e=K()[rB+8>>>2>>>0];return e=nz[rV[e]],--ek,e()}()}catch(t){n=t,e=!0}var o=!1;if(!rB){var a=rq;a&&(rq=null,(e?a.reject:a.resolve)(n),o=!0)}if(e&&!o)throw n}}),i=!0,t||(rj=1,rB=function(){var e=nF(65548),t=e+12;X()[e>>>2>>>0]=t,X()[e+4>>>2>>>0]=t+65536;var i=rL[t=rF[0]];return void 0===i&&(i=rU++,rL[t]=i,rV[i]=t),t=i,K()[e+8>>>2>>>0]=t,e}(),"u">typeof MainLoop&&MainLoop.Qb&&MainLoop.pause(),rR(()=>nY(rB)))}else 2===rj?(rj=0,rR(n4),nM(rB),rB=null,rG.forEach(re)):ep(`invalid state: ${rj}`);return rM}}(t=>{e().then(t)})}function rW(e){return e>>>=0,rH(async()=>tL(await tF(e)))}var rK=[];function rX(e,t,i,n){return i>>>=0,n>>>=0,(e=rK[e>>>0])(null,t=tF(t>>>0),i,n)}var rZ={},rJ=e=>{var t=rZ[e];return void 0===t?tp(e):t};function rQ(e,t,i,n,o){return i>>>=0,n>>>=0,o>>>=0,(e=rK[e>>>0])(t=tF(t>>>0),t[i=rJ(i)],n,o)}function rY(e,t){return t>>>=0,(e=tF(e>>>0))==tF(t)}var r1=()=>"object"==typeof globalThis?globalThis:Function("return this")();function r2(e){return 0==(e>>>=0)?tL(r1()):(e=rJ(e),tL(r1()[e]))}var r4=e=>{var t=rK.length;return rK.push(e),t},r6=(e,t)=>{for(var i=Array(e),n=0;n<e;++n)i[n]=rk(X()[t+4*n>>>2>>>0],`parameter ${n}`);return i};function r8(e,t,i){var n=(t=r6(e,t>>>0)).shift();e--;var o=`return function (obj, func, destructorsRef, args) {
`,a=0,s=[];0===i&&s.push("obj");for(var u=["retType"],l=[n],d=0;d<e;++d)s.push(`arg${d}`),u.push(`argType${d}`),l.push(t[d]),o+=`  var arg${d} = argType${d}.readValueFromPointer(args${a?"+"+a:""});
`,a+=t[d].Cb;return o+=`  var rv = ${1===i?"new func":"func.call"}(${s.join(", ")});
`,n.Ub||(u.push("emval_returnValue"),l.push(rD),o+=`  return emval_returnValue(retType, destructorsRef, rv);
`),r4(Object.defineProperty(e=Function(...u,o+`};
`)(...l),"name",{value:i=`methodCaller<(${t.map(e=>e.name).join(", ")}) => ${n.name}>`}))}function r5(e){return tL(n[e=rJ(e>>>0)])}function r7(e,t){return t>>>=0,tL((e=tF(e>>>0))[t=tF(t)])}function r9(e){9<(e>>>=0)&&(tB[e+1]+=1)}function ie(){return tL([])}function ir(e){e=tF(e>>>0);for(var t=Array(e.length),i=0;i<e.length;i++)t[i]=e[i];return tL(t)}function ii(e){return tL(rJ(e>>>0))}function is(){return tL({})}function il(e){for(var t=tF(e>>>=0);t.length;){var i=t.pop();t.pop()(i)}tM(e)}function id(e,t,i){t>>>=0,i>>>=0,e=tF(e>>>0),t=tF(t),i=tF(i),e[t]=i}function ih(e,t){return t>>>=0,tL(e=(e=rk(e>>>0,"_emval_take_value")).readValueFromPointer(t))}function iT(e,t){e=-0x20000000000000>e||0x20000000000000<e?NaN:Number(e),t>>>=0,e=new Date(1e3*e),K()[t>>>2>>>0]=e.getUTCSeconds(),K()[t+4>>>2>>>0]=e.getUTCMinutes(),K()[t+8>>>2>>>0]=e.getUTCHours(),K()[t+12>>>2>>>0]=e.getUTCDate(),K()[t+16>>>2>>>0]=e.getUTCMonth(),K()[t+20>>>2>>>0]=e.getUTCFullYear()-1900,K()[t+24>>>2>>>0]=e.getUTCDay(),e=(e.getTime()-Date.UTC(e.getUTCFullYear(),0,1,0,0,0,0))/864e5|0,K()[t+28>>>2>>>0]=e}var iI=e=>e%4==0&&(e%100!=0||e%400==0),ik=[0,31,60,91,121,152,182,213,244,274,305,335],iC=[0,31,59,90,120,151,181,212,243,273,304,334];function iD(e,t){e=-0x20000000000000>e||0x20000000000000<e?NaN:Number(e),t>>>=0,e=new Date(1e3*e),K()[t>>>2>>>0]=e.getSeconds(),K()[t+4>>>2>>>0]=e.getMinutes(),K()[t+8>>>2>>>0]=e.getHours(),K()[t+12>>>2>>>0]=e.getDate(),K()[t+16>>>2>>>0]=e.getMonth(),K()[t+20>>>2>>>0]=e.getFullYear()-1900,K()[t+24>>>2>>>0]=e.getDay();var i=(iI(e.getFullYear())?ik:iC)[e.getMonth()]+e.getDate()-1|0;K()[t+28>>>2>>>0]=i,K()[t+36>>>2>>>0]=-60*e.getTimezoneOffset(),i=new Date(e.getFullYear(),6,1).getTimezoneOffset();var n=new Date(e.getFullYear(),0,1).getTimezoneOffset();e=0|(i!=n&&e.getTimezoneOffset()==Math.min(n,i)),K()[t+32>>>2>>>0]=e}function iN(e){e>>>=0;var t=new Date(K()[e+20>>>2>>>0]+1900,K()[e+16>>>2>>>0],K()[e+12>>>2>>>0],K()[e+8>>>2>>>0],K()[e+4>>>2>>>0],K()[e>>>2>>>0],0),i=K()[e+32>>>2>>>0],n=t.getTimezoneOffset(),o=new Date(t.getFullYear(),6,1).getTimezoneOffset(),a=new Date(t.getFullYear(),0,1).getTimezoneOffset(),s=Math.min(a,o);return 0>i?K()[e+32>>>2>>>0]=+(o!=a&&s==n):0<i!=(s==n)&&(o=Math.max(a,o),t.setTime(t.getTime()+6e4*((0<i?s:o)-n))),K()[e+24>>>2>>>0]=t.getDay(),i=(iI(t.getFullYear())?ik:iC)[t.getMonth()]+t.getDate()-1|0,K()[e+28>>>2>>>0]=i,K()[e>>>2>>>0]=t.getSeconds(),K()[e+4>>>2>>>0]=t.getMinutes(),K()[e+8>>>2>>>0]=t.getHours(),K()[e+12>>>2>>>0]=t.getDate(),K()[e+16>>>2>>>0]=t.getMonth(),K()[e+20>>>2>>>0]=t.getYear(),BigInt(isNaN(e=t.getTime())?-1:e/1e3)}function iz(e,t,i,n,o,a,s){return u?eC(16,1,e,t,i,n,o,a,s):-52}function iR(e,t,i,n,o,a){if(u)return eC(17,1,e,t,i,n,o,a)}var ij={},iB=()=>performance.timeOrigin+performance.now();function iM(e,t){if(u)return eC(18,1,e,t);if(ij[e]&&(clearTimeout(ij[e].id),delete ij[e]),!t)return 0;var i=setTimeout(()=>{delete ij[e],re(()=>nH(e,performance.timeOrigin+performance.now()))},t);return ij[e]={id:i,rc:t},0}function iF(e,t,i,n){e>>>=0,t>>>=0,i>>>=0,n>>>=0;var o=new Date().getFullYear(),a=new Date(o,0,1).getTimezoneOffset(),s=Math.max(a,o=new Date(o,6,1).getTimezoneOffset());X()[e>>>2>>>0]=60*s,K()[t>>>2>>>0]=+(a!=o),e=(t=e=>{var t=Math.abs(e);return`UTC${0<=e?"-":"+"}${String(Math.floor(t/60)).padStart(2,"0")}${String(t%60).padStart(2,"0")}`})(a),t=t(o),o<a?(tX(e,i,17),tX(t,n,17)):(tX(e,n,17),tX(t,i,17))}var iL=()=>Date.now(),iV=1;function iU(e,t,i){if(!(0<=e&&3>=e))return 28;if(0===e)e=Date.now();else{if(!iV)return 52;e=performance.timeOrigin+performance.now()}return E[i>>>0>>>3]=BigInt(Math.round(1e6*e)),0}var iq=[],iG=(e,t)=>{iq.length=0;for(var i;i=U()[e++>>>0];){var n=105!=i;t+=(n&=112!=i)&&t%8?4:0,iq.push(112==i?X()[t>>>2>>>0]:106==i?E[t>>>3]:105==i?K()[t>>>2>>>0]:J()[t>>>3>>>0]),t+=n?8:4}return iq};function iH(e,t,i){return e>>>=0,t=iG(t>>>0,i>>>0),nk[e](...t)}function iW(e,t,i){return e>>>=0,t=iG(t>>>0,i>>>0),nk[e](...t)}var iK=()=>{};function iX(e,t){return M(eQ(e>>>0,t>>>0))}var iZ=()=>{throw ek+=1,"unwind"};function iJ(){return 0xffff0000}var iQ=()=>navigator.hardwareConcurrency;function iY(){return ep("Cannot use emscripten_pc_get_function without -sUSE_OFFSET_CONVERTER"),0}function i1(e){e>>>=0;var t=U().length;if(e<=t||0xffff0000<e)return!1;for(var i=1;4>=i;i*=2){var n=t*(1+.2/i);n=Math.min(n,e+0x6000000);e:{n=(Math.min(0xffff0000,65536*Math.ceil(Math.max(e,n)/65536))-y.buffer.byteLength+65535)/65536|0;try{y.grow(n),er();var o=1;break e}catch{}o=void 0}if(o)return!0}return!1}var i2=()=>(ep("Cannot use convertFrameToPC (needed by __builtin_return_address) without -sUSE_OFFSET_CONVERTER"),0),i4={},i6=e=>{e.forEach(e=>{var t=i2();t&&(i4[t]=e)})};function i8(){var e=Error().stack.toString().split(`
`);return"Error"==e[0]&&e.shift(),i6(e),i4.Mb=i2(),i4.dc=e,i4.Mb}function i5(e,t,i){if(e>>>=0,t>>>=0,i4.Mb==e)var n=i4.dc;else"Error"==(n=Error().stack.toString().split(`
`))[0]&&n.shift(),i6(n);for(var o=3;n[o]&&i2()!=e;)++o;for(e=0;e<i&&n[e+o];++e)K()[t+4*e>>>2>>>0]=i2();return e}var i7,i9={},nr=()=>{if(!i7){var e,t={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:("object"==typeof navigator&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",_:"./this.program"};for(e in i9)void 0===i9[e]?delete t[e]:t[e]=i9[e];var i=[];for(e in t)i.push(`${e}=${t[e]}`);i7=i}return i7};function ni(e,t){if(u)return eC(19,1,e,t);e>>>=0,t>>>=0;var i,n=0,o=0;for(i of nr()){var a=t+n;X()[e+o>>>2>>>0]=a,n+=tX(i,a,1/0)+1,o+=4}return 0}function nn(e,t){if(u)return eC(20,1,e,t);e>>>=0,t>>>=0;var i=nr();for(var n of(X()[e>>>2>>>0]=i.length,e=0,i))e+=tZ(n)+1;return X()[t>>>2>>>0]=e,0}function nu(e){return u?eC(21,1,e):52}function nd(e,t,i,n){return u?eC(22,1,e,t,i,n):52}function np(e,t,i,n){return u?eC(23,1,e,t,i,n):70}var nc=[null,[],[]];function nh(e,t,i,n){if(u)return eC(24,1,e,t,i,n);t>>>=0,i>>>=0,n>>>=0;for(var o=0,a=0;a<i;a++){var s=X()[t>>>2>>>0],l=X()[t+4>>>2>>>0];t+=8;for(var d=0;d<l;d++){var p=e,c=U()[s+d>>>0],h=nc[p];0===c||10===c?((1===p?B:M)(eJ(h)),h.length=0):h.push(c)}o+=l}return X()[n>>>2>>>0]=o,0}u||function(){for(var e=n.numThreads-1;e--;)eU();eT.push(()=>{eo++,function(e){u?e():Promise.all(eR.map(eV)).then(e)}(()=>ed())})}();for(var nf=Array(256),nT=0;256>nT;++nT)nf[nT]=String.fromCharCode(nT);tn=nf,tB.push(0,1,void 0,1,null,1,!0,1,!1,1),n.count_emval_handles=()=>tB.length/2-5-tj.length,u||(y=new WebAssembly.Memory({initial:256,maximum:65536,shared:!0}),er()),n.wasmBinary&&(b=n.wasmBinary),n.stackSave=()=>nJ(),n.stackRestore=e=>nX(e),n.stackAlloc=e=>nZ(e),n.setValue=function(e,t,i="i8"){switch(i.endsWith("*")&&(i="*"),i){case"i1":case"i8":V()[e>>>0]=t;break;case"i16":q()[e>>>1>>>0]=t;break;case"i32":K()[e>>>2>>>0]=t;break;case"i64":E[e>>>3]=BigInt(t);break;case"float":Z()[e>>>2>>>0]=t;break;case"double":J()[e>>>3>>>0]=t;break;case"*":X()[e>>>2>>>0]=t;break;default:ep(`invalid type for setValue: ${i}`)}},n.getValue=function(e,t="i8"){switch(t.endsWith("*")&&(t="*"),t){case"i1":case"i8":return V()[e>>>0];case"i16":return q()[e>>>1>>>0];case"i32":return K()[e>>>2>>>0];case"i64":return E[e>>>3];case"float":return Z()[e>>>2>>>0];case"double":return J()[e>>>3>>>0];case"*":return X()[e>>>2>>>0];default:ep(`invalid type for getValue: ${t}`)}},n.UTF8ToString=eQ,n.stringToUTF8=tX,n.lengthBytesUTF8=tZ;var nI=[eD,eN,eK,eY,e1,e2,e4,e6,e8,e5,e7,e9,te,tt,tr,ti,iz,iR,iM,ni,nn,nu,nd,np,nh],nk={892060:(e,t,i,o,a)=>{if(void 0===n||!n.Fb)return 1;if((e=eQ(Number(e>>>0))).startsWith("./")&&(e=e.substring(2)),!(e=n.Fb.get(e)))return 2;if(t=Number(t>>>0),i=Number(i>>>0),o=Number(o>>>0),t+i>e.byteLength)return 3;try{let s=e.subarray(t,t+i);switch(a){case 0:U().set(s,o>>>0);break;case 1:n.mc?n.mc(o,s):n.cc(o,s);break;default:return 4}return 0}catch{return 4}},892884:(e,t,i)=>{n.Pb(e,U().subarray(t>>>0,t+i>>>0))},892948:()=>n.oc(),892990:e=>{n.Ob(e)},893027:()=>{n.Wb()},893058:()=>{n.Xb()},893087:()=>{n.ac()},893112:e=>n.Vb(e),893145:e=>n.Zb(e),893177:(e,t,i)=>{n.Lb(Number(e),Number(t),Number(i),!0)},893240:(e,t,i)=>{n.Lb(Number(e),Number(t),Number(i))},893297:()=>"u">typeof wasmOffsetConverter,893354:e=>{n.Ab("Abs",e,void 0)},893405:e=>{n.Ab("Neg",e,void 0)},893456:e=>{n.Ab("Floor",e,void 0)},893509:e=>{n.Ab("Ceil",e,void 0)},893561:e=>{n.Ab("Reciprocal",e,void 0)},893619:e=>{n.Ab("Sqrt",e,void 0)},893671:e=>{n.Ab("Exp",e,void 0)},893722:e=>{n.Ab("Erf",e,void 0)},893773:e=>{n.Ab("Sigmoid",e,void 0)},893828:(e,t,i)=>{n.Ab("HardSigmoid",e,{alpha:t,beta:i})},893907:e=>{n.Ab("Log",e,void 0)},893958:e=>{n.Ab("Sin",e,void 0)},894009:e=>{n.Ab("Cos",e,void 0)},894060:e=>{n.Ab("Tan",e,void 0)},894111:e=>{n.Ab("Asin",e,void 0)},894163:e=>{n.Ab("Acos",e,void 0)},894215:e=>{n.Ab("Atan",e,void 0)},894267:e=>{n.Ab("Sinh",e,void 0)},894319:e=>{n.Ab("Cosh",e,void 0)},894371:e=>{n.Ab("Asinh",e,void 0)},894424:e=>{n.Ab("Acosh",e,void 0)},894477:e=>{n.Ab("Atanh",e,void 0)},894530:e=>{n.Ab("Tanh",e,void 0)},894582:e=>{n.Ab("Not",e,void 0)},894633:(e,t,i)=>{n.Ab("Clip",e,{min:t,max:i})},894702:e=>{n.Ab("Clip",e,void 0)},894754:(e,t)=>{n.Ab("Elu",e,{alpha:t})},894812:e=>{n.Ab("Gelu",e,void 0)},894864:e=>{n.Ab("Relu",e,void 0)},894916:(e,t)=>{n.Ab("LeakyRelu",e,{alpha:t})},894980:(e,t)=>{n.Ab("ThresholdedRelu",e,{alpha:t})},895050:(e,t)=>{n.Ab("Cast",e,{to:t})},895108:e=>{n.Ab("Add",e,void 0)},895159:e=>{n.Ab("Sub",e,void 0)},895210:e=>{n.Ab("Mul",e,void 0)},895261:e=>{n.Ab("Div",e,void 0)},895312:e=>{n.Ab("Pow",e,void 0)},895363:e=>{n.Ab("Equal",e,void 0)},895416:e=>{n.Ab("Greater",e,void 0)},895471:e=>{n.Ab("GreaterOrEqual",e,void 0)},895533:e=>{n.Ab("Less",e,void 0)},895585:e=>{n.Ab("LessOrEqual",e,void 0)},895644:(e,t,i,o,a)=>{n.Ab("ReduceMean",e,{keepDims:!!t,noopWithEmptyAxes:!!i,axes:o?Array.from(K().subarray(Number(o)>>>0,Number(a)>>>0)):[]})},895819:(e,t,i,o,a)=>{n.Ab("ReduceMax",e,{keepDims:!!t,noopWithEmptyAxes:!!i,axes:o?Array.from(K().subarray(Number(o)>>>0,Number(a)>>>0)):[]})},895993:(e,t,i,o,a)=>{n.Ab("ReduceMin",e,{keepDims:!!t,noopWithEmptyAxes:!!i,axes:o?Array.from(K().subarray(Number(o)>>>0,Number(a)>>>0)):[]})},896167:(e,t,i,o,a)=>{n.Ab("ReduceProd",e,{keepDims:!!t,noopWithEmptyAxes:!!i,axes:o?Array.from(K().subarray(Number(o)>>>0,Number(a)>>>0)):[]})},896342:(e,t,i,o,a)=>{n.Ab("ReduceSum",e,{keepDims:!!t,noopWithEmptyAxes:!!i,axes:o?Array.from(K().subarray(Number(o)>>>0,Number(a)>>>0)):[]})},896516:(e,t,i,o,a)=>{n.Ab("ReduceL1",e,{keepDims:!!t,noopWithEmptyAxes:!!i,axes:o?Array.from(K().subarray(Number(o)>>>0,Number(a)>>>0)):[]})},896689:(e,t,i,o,a)=>{n.Ab("ReduceL2",e,{keepDims:!!t,noopWithEmptyAxes:!!i,axes:o?Array.from(K().subarray(Number(o)>>>0,Number(a)>>>0)):[]})},896862:(e,t,i,o,a)=>{n.Ab("ReduceLogSum",e,{keepDims:!!t,noopWithEmptyAxes:!!i,axes:o?Array.from(K().subarray(Number(o)>>>0,Number(a)>>>0)):[]})},897039:(e,t,i,o,a)=>{n.Ab("ReduceSumSquare",e,{keepDims:!!t,noopWithEmptyAxes:!!i,axes:o?Array.from(K().subarray(Number(o)>>>0,Number(a)>>>0)):[]})},897219:(e,t,i,o,a)=>{n.Ab("ReduceLogSumExp",e,{keepDims:!!t,noopWithEmptyAxes:!!i,axes:o?Array.from(K().subarray(Number(o)>>>0,Number(a)>>>0)):[]})},897399:e=>{n.Ab("Where",e,void 0)},897452:(e,t,i)=>{n.Ab("Transpose",e,{perm:t?Array.from(K().subarray(Number(t)>>>0,Number(i)>>>0)):[]})},897576:(e,t,i,o)=>{n.Ab("DepthToSpace",e,{blocksize:t,mode:eQ(i),format:o?"NHWC":"NCHW"})},897709:(e,t,i,o)=>{n.Ab("DepthToSpace",e,{blocksize:t,mode:eQ(i),format:o?"NHWC":"NCHW"})},897842:(e,t,i,o,a,s,u,l,d,p,c,h,f,m,g)=>{n.Ab("ConvTranspose",e,{format:d?"NHWC":"NCHW",autoPad:t,dilations:[i],group:o,kernelShape:[a],pads:[s,u],strides:[l],wIsConst:()=>!!V()[p>>>0],outputPadding:c?Array.from(K().subarray(Number(c)>>>0,Number(h)>>>0)):[],outputShape:f?Array.from(K().subarray(Number(f)>>>0,Number(m)>>>0)):[],activation:eQ(g)})},898275:(e,t,i,o,a,s,u,l,d,p,c,h,f,m)=>{n.Ab("ConvTranspose",e,{format:l?"NHWC":"NCHW",autoPad:t,dilations:Array.from(K().subarray(Number(i)>>>0,2+(Number(i)>>>0)>>>0)),group:o,kernelShape:Array.from(K().subarray(Number(a)>>>0,2+(Number(a)>>>0)>>>0)),pads:Array.from(K().subarray(Number(s)>>>0,4+(Number(s)>>>0)>>>0)),strides:Array.from(K().subarray(Number(u)>>>0,2+(Number(u)>>>0)>>>0)),wIsConst:()=>!!V()[d>>>0],outputPadding:p?Array.from(K().subarray(Number(p)>>>0,Number(c)>>>0)):[],outputShape:h?Array.from(K().subarray(Number(h)>>>0,Number(f)>>>0)):[],activation:eQ(m)})},898936:(e,t,i,o,a,s,u,l,d,p,c,h,f,m,g)=>{n.Ab("ConvTranspose",e,{format:d?"NHWC":"NCHW",autoPad:t,dilations:[i],group:o,kernelShape:[a],pads:[s,u],strides:[l],wIsConst:()=>!!V()[p>>>0],outputPadding:c?Array.from(K().subarray(Number(c)>>>0,Number(h)>>>0)):[],outputShape:f?Array.from(K().subarray(Number(f)>>>0,Number(m)>>>0)):[],activation:eQ(g)})},899369:(e,t,i,o,a,s,u,l,d,p,c,h,f,m)=>{n.Ab("ConvTranspose",e,{format:l?"NHWC":"NCHW",autoPad:t,dilations:Array.from(K().subarray(Number(i)>>>0,2+(Number(i)>>>0)>>>0)),group:o,kernelShape:Array.from(K().subarray(Number(a)>>>0,2+(Number(a)>>>0)>>>0)),pads:Array.from(K().subarray(Number(s)>>>0,4+(Number(s)>>>0)>>>0)),strides:Array.from(K().subarray(Number(u)>>>0,2+(Number(u)>>>0)>>>0)),wIsConst:()=>!!V()[d>>>0],outputPadding:p?Array.from(K().subarray(Number(p)>>>0,Number(c)>>>0)):[],outputShape:h?Array.from(K().subarray(Number(h)>>>0,Number(f)>>>0)):[],activation:eQ(m)})},900030:(e,t)=>{n.Ab("GlobalAveragePool",e,{format:t?"NHWC":"NCHW"})},900121:(e,t,i,o,a,s,u,l,d,p,c,h,f,m)=>{n.Ab("AveragePool",e,{format:m?"NHWC":"NCHW",auto_pad:t,ceil_mode:i,count_include_pad:o,storage_order:a,dilations:s?Array.from(K().subarray(Number(s)>>>0,Number(u)>>>0)):[],kernel_shape:l?Array.from(K().subarray(Number(l)>>>0,Number(d)>>>0)):[],pads:p?Array.from(K().subarray(Number(p)>>>0,Number(c)>>>0)):[],strides:h?Array.from(K().subarray(Number(h)>>>0,Number(f)>>>0)):[]})},900600:(e,t)=>{n.Ab("GlobalAveragePool",e,{format:t?"NHWC":"NCHW"})},900691:(e,t,i,o,a,s,u,l,d,p,c,h,f,m)=>{n.Ab("AveragePool",e,{format:m?"NHWC":"NCHW",auto_pad:t,ceil_mode:i,count_include_pad:o,storage_order:a,dilations:s?Array.from(K().subarray(Number(s)>>>0,Number(u)>>>0)):[],kernel_shape:l?Array.from(K().subarray(Number(l)>>>0,Number(d)>>>0)):[],pads:p?Array.from(K().subarray(Number(p)>>>0,Number(c)>>>0)):[],strides:h?Array.from(K().subarray(Number(h)>>>0,Number(f)>>>0)):[]})},901170:(e,t)=>{n.Ab("GlobalMaxPool",e,{format:t?"NHWC":"NCHW"})},901257:(e,t,i,o,a,s,u,l,d,p,c,h,f,m)=>{n.Ab("MaxPool",e,{format:m?"NHWC":"NCHW",auto_pad:t,ceil_mode:i,count_include_pad:o,storage_order:a,dilations:s?Array.from(K().subarray(Number(s)>>>0,Number(u)>>>0)):[],kernel_shape:l?Array.from(K().subarray(Number(l)>>>0,Number(d)>>>0)):[],pads:p?Array.from(K().subarray(Number(p)>>>0,Number(c)>>>0)):[],strides:h?Array.from(K().subarray(Number(h)>>>0,Number(f)>>>0)):[]})},901732:(e,t)=>{n.Ab("GlobalMaxPool",e,{format:t?"NHWC":"NCHW"})},901819:(e,t,i,o,a,s,u,l,d,p,c,h,f,m)=>{n.Ab("MaxPool",e,{format:m?"NHWC":"NCHW",auto_pad:t,ceil_mode:i,count_include_pad:o,storage_order:a,dilations:s?Array.from(K().subarray(Number(s)>>>0,Number(u)>>>0)):[],kernel_shape:l?Array.from(K().subarray(Number(l)>>>0,Number(d)>>>0)):[],pads:p?Array.from(K().subarray(Number(p)>>>0,Number(c)>>>0)):[],strides:h?Array.from(K().subarray(Number(h)>>>0,Number(f)>>>0)):[]})},902294:(e,t,i,o,a)=>{n.Ab("Gemm",e,{alpha:t,beta:i,transA:o,transB:a})},902398:e=>{n.Ab("MatMul",e,void 0)},902452:(e,t,i,o)=>{n.Ab("ArgMax",e,{keepDims:!!t,selectLastIndex:!!i,axis:o})},902560:(e,t,i,o)=>{n.Ab("ArgMin",e,{keepDims:!!t,selectLastIndex:!!i,axis:o})},902668:(e,t)=>{n.Ab("Softmax",e,{axis:t})},902731:(e,t)=>{n.Ab("Concat",e,{axis:t})},902791:(e,t,i,o,a)=>{n.Ab("Split",e,{axis:t,numOutputs:i,splitSizes:o?Array.from(K().subarray(Number(o)>>>0,Number(a)>>>0)):[]})},902947:e=>{n.Ab("Expand",e,void 0)},903001:(e,t)=>{n.Ab("Gather",e,{axis:Number(t)})},903072:(e,t)=>{n.Ab("GatherElements",e,{axis:Number(t)})},903151:(e,t)=>{n.Ab("GatherND",e,{batch_dims:Number(t)})},903230:(e,t,i,o,a,s,u,l,d,p,c)=>{n.Ab("Resize",e,{antialias:t,axes:i?Array.from(K().subarray(Number(i)>>>0,Number(o)>>>0)):[],coordinateTransformMode:eQ(a),cubicCoeffA:s,excludeOutside:u,extrapolationValue:l,keepAspectRatioPolicy:eQ(d),mode:eQ(p),nearestMode:eQ(c)})},903592:(e,t,i,o,a,s,u)=>{n.Ab("Slice",e,{starts:t?Array.from(K().subarray(Number(t)>>>0,Number(i)>>>0)):[],ends:o?Array.from(K().subarray(Number(o)>>>0,Number(a)>>>0)):[],axes:s?Array.from(K().subarray(Number(s)>>>0,Number(u)>>>0)):[]})},903856:e=>{n.Ab("Tile",e,void 0)},903908:(e,t,i)=>{n.Ab("InstanceNormalization",e,{epsilon:t,format:i?"NHWC":"NCHW"})},904022:(e,t,i)=>{n.Ab("InstanceNormalization",e,{epsilon:t,format:i?"NHWC":"NCHW"})},904136:e=>{n.Ab("Range",e,void 0)},904189:(e,t)=>{n.Ab("Einsum",e,{equation:eQ(t)})},904270:(e,t,i,o,a)=>{n.Ab("Pad",e,{mode:t,value:i,pads:o?Array.from(K().subarray(Number(o)>>>0,Number(a)>>>0)):[]})},904413:(e,t,i,o,a,s)=>{n.Ab("BatchNormalization",e,{epsilon:t,momentum:i,spatial:!!a,trainingMode:!!o,format:s?"NHWC":"NCHW"})},904582:(e,t,i,o,a,s)=>{n.Ab("BatchNormalization",e,{epsilon:t,momentum:i,spatial:!!a,trainingMode:!!o,format:s?"NHWC":"NCHW"})},904751:(e,t,i)=>{n.Ab("CumSum",e,{exclusive:Number(t),reverse:Number(i)})},904848:(e,t,i)=>{n.Ab("DequantizeLinear",e,{axis:t,blockSize:i})},904938:(e,t,i,o,a)=>{n.Ab("GridSample",e,{align_corners:t,mode:eQ(i),padding_mode:eQ(o),format:a?"NHWC":"NCHW"})},905108:(e,t,i,o,a)=>{n.Ab("GridSample",e,{align_corners:t,mode:eQ(i),padding_mode:eQ(o),format:a?"NHWC":"NCHW"})},905278:(e,t)=>{n.Ab("ScatterND",e,{reduction:eQ(t)})},905363:(e,t,i,o,a,s,u,l,d)=>{n.Ab("Attention",e,{numHeads:t,isUnidirectional:i,maskFilterValue:o,scale:a,doRotary:s,qkvHiddenSizes:u?Array.from(K().subarray(Number(l)>>>0,Number(l)+u>>>0)):[],pastPresentShareBuffer:!!d})},905635:e=>{n.Ab("BiasAdd",e,void 0)},905690:e=>{n.Ab("BiasSplitGelu",e,void 0)},905751:e=>{n.Ab("FastGelu",e,void 0)},905807:(e,t,i,o,a,s,u,l,d,p,c,h,f,m,g,b)=>{n.Ab("Conv",e,{format:h?"NHWC":"NCHW",auto_pad:t,dilations:i?Array.from(K().subarray(Number(i)>>>0,Number(o)>>>0)):[],group:a,kernel_shape:s?Array.from(K().subarray(Number(s)>>>0,Number(u)>>>0)):[],pads:l?Array.from(K().subarray(Number(l)>>>0,Number(d)>>>0)):[],strides:p?Array.from(K().subarray(Number(p)>>>0,Number(c)>>>0)):[],w_is_const:()=>!!V()[Number(f)>>>0],activation:eQ(m),activation_params:g?Array.from(Z().subarray(Number(g)>>>0,Number(b)>>>0)):[]})},906391:e=>{n.Ab("Gelu",e,void 0)},906443:(e,t,i,o,a,s,u,l,d)=>{n.Ab("GroupQueryAttention",e,{numHeads:t,kvNumHeads:i,scale:o,softcap:a,doRotary:s,rotaryInterleaved:u,smoothSoftmax:l,localWindowSize:d})},906660:(e,t,i,o)=>{n.Ab("LayerNormalization",e,{axis:t,epsilon:i,simplified:!!o})},906771:(e,t,i,o)=>{n.Ab("LayerNormalization",e,{axis:t,epsilon:i,simplified:!!o})},906882:(e,t,i,o,a,s)=>{n.Ab("MatMulNBits",e,{k:t,n:i,accuracyLevel:o,bits:a,blockSize:s})},907009:(e,t,i,o,a,s)=>{n.Ab("MultiHeadAttention",e,{numHeads:t,isUnidirectional:i,maskFilterValue:o,scale:a,doRotary:s})},907168:(e,t)=>{n.Ab("QuickGelu",e,{alpha:t})},907232:(e,t,i,o,a)=>{n.Ab("RotaryEmbedding",e,{interleaved:!!t,numHeads:i,rotaryEmbeddingDim:o,scale:a})},907371:(e,t,i)=>{n.Ab("SkipLayerNormalization",e,{epsilon:t,simplified:!!i})},907473:(e,t,i)=>{n.Ab("SkipLayerNormalization",e,{epsilon:t,simplified:!!i})},907575:(e,t,i,o)=>{n.Ab("GatherBlockQuantized",e,{gatherAxis:t,quantizeAxis:i,blockSize:o})},907696:e=>{n.$b(e)},907730:(e,t)=>n.bc(Number(e),Number(t),n.Gb.ec,n.Gb.errors)};function nD(e,t,i){return rH(async()=>{await n.Yb(Number(e),Number(t),Number(i))})}function nN(){return"u">typeof wasmOffsetConverter}var nz=await async function(){function e(e,t){return nz=e.exports,nz=function(){var e={};for(let[t,i]of Object.entries(nz))e[t]="function"==typeof i?(...e)=>{rF.push(t);try{return i(...e)}finally{F||(rF.pop(),rB&&1===rj&&0===rF.length&&(rj=0,ek+=1,rR(n1),"u">typeof Fibers&&Fibers.sc()))}}:i;return e}(),nz=function(){var e=nz,t=e=>t=>e(t)>>>0,i=e=>()=>e()>>>0;return(e=Object.assign({},e)).Ea=t(e.Ea),e.gb=i(e.gb),e.ib=t(e.ib),e.tb=t(e.tb),e.ub=i(e.ub),e.__cxa_get_exception_ptr=t(e.__cxa_get_exception_ptr),e}(),eB.push(nz.jb),_=t,ed(),nz}eo++;var t=eh();if(n.instantiateWasm)return new Promise(i=>{n.instantiateWasm(t,(t,n)=>{i(e(t,n))})});if(u)return new Promise(t=>{D=i=>{t(e(new WebAssembly.Instance(i,eh()),i))}});en??=n.locateFile?n.locateFile?n.locateFile("ort-wasm-simd-threaded.jsep.wasm",g):g+"ort-wasm-simd-threaded.jsep.wasm":new URL("ort-wasm-simd-threaded.jsep.wasm",import.meta.url).href;try{var o=await async function(e){var t=en;if(!b&&"function"==typeof WebAssembly.instantiateStreaming&&!L(t))try{var i=fetch(t,{credentials:"same-origin"});return await WebAssembly.instantiateStreaming(i,e)}catch(e){M(`wasm streaming compile failed: ${e}`),M("falling back to ArrayBuffer instantiation")}return async function(e,t){try{var i=await async function(e){if(!b)try{var t=await c(e);return new Uint8Array(t)}catch{}if(e==en&&b)e=new Uint8Array(b);else{if(!h)throw"both async and sync fetching of the wasm failed";e=h(e)}return e}(e);return await WebAssembly.instantiate(i,t)}catch(e){M(`failed to asynchronously prepare wasm: ${e}`),ep(e)}}(t,e)}(t);return e(o.instance,o.module)}catch(e){return i(e),Promise.reject(e)}}(),nR=e=>(nR=nz.Ea)(e),nj=()=>(nj=nz.Fa)();n._OrtInit=(e,t)=>(n._OrtInit=nz.Ga)(e,t),n._OrtGetLastError=(e,t)=>(n._OrtGetLastError=nz.Ha)(e,t),n._OrtCreateSessionOptions=(e,t,i,o,a,s,u,l,d,p)=>(n._OrtCreateSessionOptions=nz.Ia)(e,t,i,o,a,s,u,l,d,p),n._OrtAppendExecutionProvider=(e,t,i,o,a)=>(n._OrtAppendExecutionProvider=nz.Ja)(e,t,i,o,a),n._OrtAddFreeDimensionOverride=(e,t,i)=>(n._OrtAddFreeDimensionOverride=nz.Ka)(e,t,i),n._OrtAddSessionConfigEntry=(e,t,i)=>(n._OrtAddSessionConfigEntry=nz.La)(e,t,i),n._OrtReleaseSessionOptions=e=>(n._OrtReleaseSessionOptions=nz.Ma)(e),n._OrtCreateSession=(e,t,i)=>(n._OrtCreateSession=nz.Na)(e,t,i),n._OrtReleaseSession=e=>(n._OrtReleaseSession=nz.Oa)(e),n._OrtGetInputOutputCount=(e,t,i)=>(n._OrtGetInputOutputCount=nz.Pa)(e,t,i),n._OrtGetInputOutputMetadata=(e,t,i,o)=>(n._OrtGetInputOutputMetadata=nz.Qa)(e,t,i,o),n._OrtFree=e=>(n._OrtFree=nz.Ra)(e),n._OrtCreateTensor=(e,t,i,o,a,s)=>(n._OrtCreateTensor=nz.Sa)(e,t,i,o,a,s),n._OrtGetTensorData=(e,t,i,o,a)=>(n._OrtGetTensorData=nz.Ta)(e,t,i,o,a),n._OrtReleaseTensor=e=>(n._OrtReleaseTensor=nz.Ua)(e),n._OrtCreateRunOptions=(e,t,i,o)=>(n._OrtCreateRunOptions=nz.Va)(e,t,i,o),n._OrtAddRunConfigEntry=(e,t,i)=>(n._OrtAddRunConfigEntry=nz.Wa)(e,t,i),n._OrtReleaseRunOptions=e=>(n._OrtReleaseRunOptions=nz.Xa)(e),n._OrtCreateBinding=e=>(n._OrtCreateBinding=nz.Ya)(e),n._OrtBindInput=(e,t,i)=>(n._OrtBindInput=nz.Za)(e,t,i),n._OrtBindOutput=(e,t,i,o)=>(n._OrtBindOutput=nz._a)(e,t,i,o),n._OrtClearBoundOutputs=e=>(n._OrtClearBoundOutputs=nz.$a)(e),n._OrtReleaseBinding=e=>(n._OrtReleaseBinding=nz.ab)(e),n._OrtRunWithBinding=(e,t,i,o,a)=>(n._OrtRunWithBinding=nz.bb)(e,t,i,o,a),n._OrtRun=(e,t,i,o,a,s,u,l)=>(n._OrtRun=nz.cb)(e,t,i,o,a,s,u,l),n._OrtEndProfiling=e=>(n._OrtEndProfiling=nz.db)(e),n._JsepOutput=(e,t,i)=>(n._JsepOutput=nz.eb)(e,t,i),n._JsepGetNodeName=e=>(n._JsepGetNodeName=nz.fb)(e);var nB=()=>(nB=nz.gb)(),nM=n._free=e=>(nM=n._free=nz.hb)(e),nF=n._malloc=e=>(nF=n._malloc=nz.ib)(e),nL=(e,t,i,n,o,a)=>(nL=nz.kb)(e,t,i,n,o,a),nV=()=>(nV=nz.lb)(),nU=(e,t,i,n,o)=>(nU=nz.mb)(e,t,i,n,o),nq=e=>(nq=nz.nb)(e),nG=e=>(nG=nz.ob)(e),nH=(e,t)=>(nH=nz.pb)(e,t),nW=()=>(nW=nz.qb)(),nK=(e,t)=>(nK=nz.rb)(e,t),nX=e=>(nX=nz.sb)(e),nZ=e=>(nZ=nz.tb)(e),nJ=()=>(nJ=nz.ub)(),nQ=n.dynCall_ii=(e,t)=>(nQ=n.dynCall_ii=nz.vb)(e,t);n.dynCall_vii=(e,t,i)=>(n.dynCall_vii=nz.dynCall_vii)(e,t,i),n.dynCall_iiiii=(e,t,i,o,a)=>(n.dynCall_iiiii=nz.dynCall_iiiii)(e,t,i,o,a),n.dynCall_iii=(e,t,i)=>(n.dynCall_iii=nz.dynCall_iii)(e,t,i),n.dynCall_iiiiii=(e,t,i,o,a,s)=>(n.dynCall_iiiiii=nz.dynCall_iiiiii)(e,t,i,o,a,s),n.dynCall_iiiiiiii=(e,t,i,o,a,s,u,l)=>(n.dynCall_iiiiiiii=nz.dynCall_iiiiiiii)(e,t,i,o,a,s,u,l),n.dynCall_iiiiiii=(e,t,i,o,a,s,u)=>(n.dynCall_iiiiiii=nz.dynCall_iiiiiii)(e,t,i,o,a,s,u),n.dynCall_vi=(e,t)=>(n.dynCall_vi=nz.dynCall_vi)(e,t),n.dynCall_iiii=(e,t,i,o)=>(n.dynCall_iiii=nz.dynCall_iiii)(e,t,i,o),n.dynCall_i=e=>(n.dynCall_i=nz.dynCall_i)(e),n.dynCall_viiiiiiii=(e,t,i,o,a,s,u,l,d)=>(n.dynCall_viiiiiiii=nz.dynCall_viiiiiiii)(e,t,i,o,a,s,u,l,d),n.dynCall_viii=(e,t,i,o)=>(n.dynCall_viii=nz.dynCall_viii)(e,t,i,o),n.dynCall_viijj=(e,t,i,o,a)=>(n.dynCall_viijj=nz.dynCall_viijj)(e,t,i,o,a),n.dynCall_viiiiii=(e,t,i,o,a,s,u)=>(n.dynCall_viiiiii=nz.dynCall_viiiiii)(e,t,i,o,a,s,u),n.dynCall_viiii=(e,t,i,o,a)=>(n.dynCall_viiii=nz.dynCall_viiii)(e,t,i,o,a),n.dynCall_viiiii=(e,t,i,o,a,s)=>(n.dynCall_viiiii=nz.dynCall_viiiii)(e,t,i,o,a,s),n.dynCall_vfiii=(e,t,i,o,a)=>(n.dynCall_vfiii=nz.dynCall_vfiii)(e,t,i,o,a),n.dynCall_viiiiff=(e,t,i,o,a,s,u)=>(n.dynCall_viiiiff=nz.dynCall_viiiiff)(e,t,i,o,a,s,u),n.dynCall_viiiiiff=(e,t,i,o,a,s,u,l)=>(n.dynCall_viiiiiff=nz.dynCall_viiiiiff)(e,t,i,o,a,s,u,l),n.dynCall_ffff=(e,t,i,o)=>(n.dynCall_ffff=nz.dynCall_ffff)(e,t,i,o),n.dynCall_viiff=(e,t,i,o,a)=>(n.dynCall_viiff=nz.dynCall_viiff)(e,t,i,o,a),n.dynCall_fffffff=(e,t,i,o,a,s,u)=>(n.dynCall_fffffff=nz.dynCall_fffffff)(e,t,i,o,a,s,u),n.dynCall_jjjjjjj=(e,t,i,o,a,s,u)=>(n.dynCall_jjjjjjj=nz.dynCall_jjjjjjj)(e,t,i,o,a,s,u),n.dynCall_jjjjjj=(e,t,i,o,a,s)=>(n.dynCall_jjjjjj=nz.dynCall_jjjjjj)(e,t,i,o,a,s),n.dynCall_iijjii=(e,t,i,o,a,s)=>(n.dynCall_iijjii=nz.dynCall_iijjii)(e,t,i,o,a,s),n.dynCall_viiiiiiiiiiiii=(e,t,i,o,a,s,u,l,d,p,c,h,f,m)=>(n.dynCall_viiiiiiiiiiiii=nz.dynCall_viiiiiiiiiiiii)(e,t,i,o,a,s,u,l,d,p,c,h,f,m),n.dynCall_viiiiiiiiii=(e,t,i,o,a,s,u,l,d,p,c)=>(n.dynCall_viiiiiiiiii=nz.dynCall_viiiiiiiiii)(e,t,i,o,a,s,u,l,d,p,c),n.dynCall_viiiiiiiiiii=(e,t,i,o,a,s,u,l,d,p,c,h)=>(n.dynCall_viiiiiiiiiii=nz.dynCall_viiiiiiiiiii)(e,t,i,o,a,s,u,l,d,p,c,h),n.dynCall_viiiiiiiiiiii=(e,t,i,o,a,s,u,l,d,p,c,h,f)=>(n.dynCall_viiiiiiiiiiii=nz.dynCall_viiiiiiiiiiii)(e,t,i,o,a,s,u,l,d,p,c,h,f),n.dynCall_viiiiiiiiiiiiiiiiii=(e,t,i,o,a,s,u,l,d,p,c,h,f,m,g,b,y,_,v)=>(n.dynCall_viiiiiiiiiiiiiiiiii=nz.dynCall_viiiiiiiiiiiiiiiiii)(e,t,i,o,a,s,u,l,d,p,c,h,f,m,g,b,y,_,v),n.dynCall_viiiiiiiii=(e,t,i,o,a,s,u,l,d,p)=>(n.dynCall_viiiiiiiii=nz.dynCall_viiiiiiiii)(e,t,i,o,a,s,u,l,d,p),n.dynCall_viiiiiiiiiiiiiiiiiii=(e,t,i,o,a,s,u,l,d,p,c,h,f,m,g,b,y,_,v,x)=>(n.dynCall_viiiiiiiiiiiiiiiiiii=nz.dynCall_viiiiiiiiiiiiiiiiiii)(e,t,i,o,a,s,u,l,d,p,c,h,f,m,g,b,y,_,v,x),n.dynCall_viiiiiii=(e,t,i,o,a,s,u,l)=>(n.dynCall_viiiiiii=nz.dynCall_viiiiiii)(e,t,i,o,a,s,u,l),n.dynCall_viiiiiiiiiiiiiii=(e,t,i,o,a,s,u,l,d,p,c,h,f,m,g,b)=>(n.dynCall_viiiiiiiiiiiiiii=nz.dynCall_viiiiiiiiiiiiiii)(e,t,i,o,a,s,u,l,d,p,c,h,f,m,g,b),n.dynCall_jiji=(e,t,i,o)=>(n.dynCall_jiji=nz.dynCall_jiji)(e,t,i,o),n.dynCall_v=e=>(n.dynCall_v=nz.dynCall_v)(e),n.dynCall_iidiiii=(e,t,i,o,a,s,u)=>(n.dynCall_iidiiii=nz.dynCall_iidiiii)(e,t,i,o,a,s,u),n.dynCall_iiiiiiiii=(e,t,i,o,a,s,u,l,d)=>(n.dynCall_iiiiiiiii=nz.dynCall_iiiiiiiii)(e,t,i,o,a,s,u,l,d),n.dynCall_iiij=(e,t,i,o)=>(n.dynCall_iiij=nz.dynCall_iiij)(e,t,i,o),n.dynCall_iiiiiiiiii=(e,t,i,o,a,s,u,l,d,p)=>(n.dynCall_iiiiiiiiii=nz.dynCall_iiiiiiiiii)(e,t,i,o,a,s,u,l,d,p),n.dynCall_iiiiiiiiiiiii=(e,t,i,o,a,s,u,l,d,p,c,h,f)=>(n.dynCall_iiiiiiiiiiiii=nz.dynCall_iiiiiiiiiiiii)(e,t,i,o,a,s,u,l,d,p,c,h,f),n.dynCall_iiiiiiiiiii=(e,t,i,o,a,s,u,l,d,p,c)=>(n.dynCall_iiiiiiiiiii=nz.dynCall_iiiiiiiiiii)(e,t,i,o,a,s,u,l,d,p,c),n.dynCall_ji=(e,t)=>(n.dynCall_ji=nz.dynCall_ji)(e,t),n.dynCall_iijii=(e,t,i,o,a)=>(n.dynCall_iijii=nz.dynCall_iijii)(e,t,i,o,a),n.dynCall_vij=(e,t,i)=>(n.dynCall_vij=nz.dynCall_vij)(e,t,i),n.dynCall_viiijii=(e,t,i,o,a,s,u)=>(n.dynCall_viiijii=nz.dynCall_viiijii)(e,t,i,o,a,s,u),n.dynCall_viijiiiiiiiiiiiiii=(e,t,i,o,a,s,u,l,d,p,c,h,f,m,g,b,y,_)=>(n.dynCall_viijiiiiiiiiiiiiii=nz.dynCall_viijiiiiiiiiiiiiii)(e,t,i,o,a,s,u,l,d,p,c,h,f,m,g,b,y,_),n.dynCall_viiiji=(e,t,i,o,a,s)=>(n.dynCall_viiiji=nz.dynCall_viiiji)(e,t,i,o,a,s),n.dynCall_fiii=(e,t,i,o)=>(n.dynCall_fiii=nz.dynCall_fiii)(e,t,i,o),n.dynCall_viijii=(e,t,i,o,a,s)=>(n.dynCall_viijii=nz.dynCall_viijii)(e,t,i,o,a,s),n.dynCall_viij=(e,t,i,o)=>(n.dynCall_viij=nz.dynCall_viij)(e,t,i,o),n.dynCall_jiij=(e,t,i,o)=>(n.dynCall_jiij=nz.dynCall_jiij)(e,t,i,o),n.dynCall_fi=(e,t)=>(n.dynCall_fi=nz.dynCall_fi)(e,t),n.dynCall_fii=(e,t,i)=>(n.dynCall_fii=nz.dynCall_fii)(e,t,i),n.dynCall_jii=(e,t,i)=>(n.dynCall_jii=nz.dynCall_jii)(e,t,i),n.dynCall_dii=(e,t,i)=>(n.dynCall_dii=nz.dynCall_dii)(e,t,i),n.dynCall_fiiii=(e,t,i,o,a)=>(n.dynCall_fiiii=nz.dynCall_fiiii)(e,t,i,o,a),n.dynCall_fif=(e,t,i)=>(n.dynCall_fif=nz.dynCall_fif)(e,t,i),n.dynCall_jfi=(e,t,i)=>(n.dynCall_jfi=nz.dynCall_jfi)(e,t,i),n.dynCall_viiiiiiiiiiiiii=(e,t,i,o,a,s,u,l,d,p,c,h,f,m,g)=>(n.dynCall_viiiiiiiiiiiiii=nz.dynCall_viiiiiiiiiiiiii)(e,t,i,o,a,s,u,l,d,p,c,h,f,m,g),n.dynCall_viiiiiiiiiiiiiiiiiiii=(e,t,i,o,a,s,u,l,d,p,c,h,f,m,g,b,y,_,v,x,w)=>(n.dynCall_viiiiiiiiiiiiiiiiiiii=nz.dynCall_viiiiiiiiiiiiiiiiiiii)(e,t,i,o,a,s,u,l,d,p,c,h,f,m,g,b,y,_,v,x,w),n.dynCall_viiiiiiiiiiiiiiii=(e,t,i,o,a,s,u,l,d,p,c,h,f,m,g,b,y)=>(n.dynCall_viiiiiiiiiiiiiiii=nz.dynCall_viiiiiiiiiiiiiiii)(e,t,i,o,a,s,u,l,d,p,c,h,f,m,g,b,y),n.dynCall_iif=(e,t,i)=>(n.dynCall_iif=nz.dynCall_iif)(e,t,i),n.dynCall_jiiii=(e,t,i,o,a)=>(n.dynCall_jiiii=nz.dynCall_jiiii)(e,t,i,o,a),n.dynCall_jiii=(e,t,i,o)=>(n.dynCall_jiii=nz.dynCall_jiii)(e,t,i,o),n.dynCall_viif=(e,t,i,o)=>(n.dynCall_viif=nz.dynCall_viif)(e,t,i,o),n.dynCall_viiij=(e,t,i,o,a)=>(n.dynCall_viiij=nz.dynCall_viiij)(e,t,i,o,a),n.dynCall_viiiijii=(e,t,i,o,a,s,u,l)=>(n.dynCall_viiiijii=nz.dynCall_viiiijii)(e,t,i,o,a,s,u,l),n.dynCall_iiiiij=(e,t,i,o,a,s)=>(n.dynCall_iiiiij=nz.dynCall_iiiiij)(e,t,i,o,a,s),n.dynCall_iiiiid=(e,t,i,o,a,s)=>(n.dynCall_iiiiid=nz.dynCall_iiiiid)(e,t,i,o,a,s),n.dynCall_iiiiijj=(e,t,i,o,a,s,u)=>(n.dynCall_iiiiijj=nz.dynCall_iiiiijj)(e,t,i,o,a,s,u),n.dynCall_iiiiiijj=(e,t,i,o,a,s,u,l)=>(n.dynCall_iiiiiijj=nz.dynCall_iiiiiijj)(e,t,i,o,a,s,u,l);var nY=e=>(nY=nz.wb)(e),n1=()=>(n1=nz.xb)(),n2=e=>(n2=nz.yb)(e),n4=()=>(n4=nz.zb)();return function e(){if(0<eo)eu=e;else if(u)t(n),ei();else{for(;0<eT.length;)eT.shift()(n);0<eo?eu=e:(n.calledRun=!0,F||(ei(),t(n)))}}(),n.PTR_SIZE=4,o},globalThis.self?.name?.startsWith("em-pthread")&&my()}),fa=k(()=>{"use strict";pa(),vy=typeof location>"u"?void 0:location.origin,ic=import.meta.url>"file:"&&import.meta.url<"file;",Ot=(()=>{if(ic){let e=URL;return new URL(new e("ort.all.bundle.min.mjs",import.meta.url).href,vy).href}return import.meta.url})(),wy=()=>{if(Ot&&!Ot.startsWith("blob:"))return Ot.substring(0,Ot.lastIndexOf("/")+1)},oc=(e,t)=>{try{let i=t??Ot;return(i?new URL(e,i):new URL(e)).origin===vy}catch{return!1}},kO=(e,t)=>{let i=t??Ot;try{return(i?new URL(e,i):new URL(e)).href}catch{return}},NO=(e,t)=>`${t??"./"}${e}`,xy=async e=>{let t=await (await fetch(e,{credentials:"same-origin"})).blob();return URL.createObjectURL(t)},LO=async e=>(await import(e)).default,yy=(hy(),Jr(fy)).default,Ty=async()=>{if(!Ot)throw Error("Failed to load proxy worker: cannot determine the script source URL.");if(oc(Ot))return[void 0,yy()];let e=await xy(Ot);return[e,yy(e)]},_y=(by(),Jr(gy)).default,Iy=async(e,t,i,n)=>{let o=_y&&!(e||t);if(o)if(Ot)o=oc(Ot);else if(n&&!i)o=!0;else throw Error("cannot determine the script source URL.");if(o)return[void 0,_y];{let n="ort-wasm-simd-threaded.jsep.mjs",o=e??kO(n,t),a=i&&o&&!oc(o,t),s=a?await xy(o):o??NO(n,t);return[a?s:void 0,await LO(s)]}}}),yr=k(()=>{"use strict";fa(),sc=!1,xa=!1,Sy=!1,RO=()=>{if(typeof SharedArrayBuffer>"u")return!1;try{return"u">typeof MessageChannel&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},zO=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},MO=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,19,1,17,0,65,1,253,15,65,2,253,15,65,3,253,15,253,147,2,11]))}catch{return!1}},ha=async e=>{if(sc)return Promise.resolve();if(xa)throw Error("multiple calls to 'initializeWebAssembly()' detected.");if(Sy)throw Error("previous call to 'initializeWebAssembly()' failed.");xa=!0;let t=e.initTimeout,i=e.numThreads;if(!1!==e.simd){if("relaxed"===e.simd){if(!MO())throw Error("Relaxed WebAssembly SIMD is not supported in the current environment.")}else if(!zO())throw Error("WebAssembly SIMD is not supported in the current environment.")}let n=RO();i>1&&!n&&("u">typeof self&&!self.crossOriginIsolated&&console.warn("env.wasm.numThreads is set to "+i+", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."),console.warn("WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."),e.numThreads=i=1);let o=e.wasmPaths,a="string"==typeof o?o:void 0,s=o?.mjs,u=s?.href??s,l=o?.wasm,d=l?.href??l,p=e.wasmBinary,[c,h]=await Iy(u,a,i>1,!!p||!!d),f=!1,m=[];if(t>0&&m.push(new Promise(e=>{setTimeout(()=>{f=!0,e()},t)})),m.push(new Promise((e,t)=>{let n={numThreads:i};if(p)n.wasmBinary=p;else if(d||a)n.locateFile=e=>d??a+e;else if(u&&0!==u.indexOf("blob:"))n.locateFile=e=>new URL(e,u).href;else if(c){let e=wy();e&&(n.locateFile=t=>e+t)}h(n).then(t=>{xa=!1,sc=!0,ac=t,e(),c&&URL.revokeObjectURL(c)},e=>{xa=!1,Sy=!0,t(e)})})),await Promise.race(m),f)throw Error(`WebAssembly backend initializing failed due to timeout: ${t}ms`)},Be=()=>{if(sc&&ac)return ac;throw Error("WebAssembly is not initialized yet.")}}),Ta=k(()=>{"use strict";yr(),Pt=(e,t)=>{let i=Be(),n=i.lengthBytesUTF8(e)+1,o=i._malloc(n);return i.stringToUTF8(e,o,n),t.push(o),o},Vo=(e,t,i,n)=>{if("object"==typeof e&&null!==e){if(i.has(e))throw Error("Circular reference in options");i.add(e)}Object.entries(e).forEach(([e,o])=>{let a=t?t+e:e;if("object"==typeof o)Vo(o,a+".",i,n);else if("string"==typeof o||"number"==typeof o)n(a,o.toString());else if("boolean"==typeof o)n(a,o?"1":"0");else throw Error(`Can't handle extra config type: ${typeof o}`)})},Ne=e=>{let t=Be(),i=t.stackSave();try{let i=t.PTR_SIZE,n=t.stackAlloc(2*i);t._OrtGetLastError(n,n+i);let o=Number(t.getValue(n,4===i?"i32":"i64")),a=t.getValue(n+i,"*"),s=a?t.UTF8ToString(a):"";throw Error(`${e} ERROR_CODE: ${o}, ERROR_MESSAGE: ${s}`)}finally{t.stackRestore(i)}}}),Ay=k(()=>{"use strict";yr(),Ta(),$y=e=>{let t=Be(),i=0,n=[],o=e||{};try{if(e?.logSeverityLevel===void 0)o.logSeverityLevel=2;else if("number"!=typeof e.logSeverityLevel||!Number.isInteger(e.logSeverityLevel)||e.logSeverityLevel<0||e.logSeverityLevel>4)throw Error(`log severity level is not valid: ${e.logSeverityLevel}`);if(e?.logVerbosityLevel===void 0)o.logVerbosityLevel=0;else if("number"!=typeof e.logVerbosityLevel||!Number.isInteger(e.logVerbosityLevel))throw Error(`log verbosity level is not valid: ${e.logVerbosityLevel}`);e?.terminate===void 0&&(o.terminate=!1);let a=0;return e?.tag!==void 0&&(a=Pt(e.tag,n)),i=t._OrtCreateRunOptions(o.logSeverityLevel,o.logVerbosityLevel,!!o.terminate,a),0===i&&Ne("Can't create run options."),e?.extra!==void 0&&Vo(e.extra,"",new WeakSet,(e,o)=>{let a=Pt(e,n),s=Pt(o,n);0!==t._OrtAddRunConfigEntry(i,a,s)&&Ne(`Can't set a run config entry: ${e} - ${o}.`)}),[i,n]}catch(e){throw 0!==i&&t._OrtReleaseRunOptions(i),n.forEach(e=>t._free(e)),e}}}),Py=k(()=>{"use strict";yr(),Ta(),BO=e=>{switch(e){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"layout":return 3;case"all":return 99;default:throw Error(`unsupported graph optimization level: ${e}`)}},FO=e=>{switch(e){case"sequential":return 0;case"parallel":return 1;default:throw Error(`unsupported execution mode: ${e}`)}},VO=e=>{e.extra||(e.extra={}),e.extra.session||(e.extra.session={});let t=e.extra.session;t.use_ort_model_bytes_directly||(t.use_ort_model_bytes_directly="1"),e.executionProviders&&e.executionProviders.some(e=>("string"==typeof e?e:e.name)==="webgpu")&&(e.enableMemPattern=!1)},Ia=(e,t,i,n)=>{let o=Pt(t,n),a=Pt(i,n);0!==Be()._OrtAddSessionConfigEntry(e,o,a)&&Ne(`Can't set a session config entry: ${t} - ${i}.`)},GO=async(e,t,i)=>{for(let n of t){let t="string"==typeof n?n:n.name,o=[];switch(t){case"webnn":if(t="WEBNN","string"!=typeof n){let t=n?.deviceType;t&&Ia(e,"deviceType",t,i)}break;case"webgpu":if(t="JS","string"!=typeof n){let t=n;if(t?.preferredLayout){if("NCHW"!==t.preferredLayout&&"NHWC"!==t.preferredLayout)throw Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${t.preferredLayout}`);Ia(e,"preferredLayout",t.preferredLayout,i)}}break;case"wasm":case"cpu":continue;default:throw Error(`not supported execution provider: ${t}`)}let a=Pt(t,i),s=o.length,u=0,l=0;if(s>0){u=Be()._malloc(s*Be().PTR_SIZE),i.push(u),l=Be()._malloc(s*Be().PTR_SIZE),i.push(l);for(let e=0;e<s;e++)Be().setValue(u+e*Be().PTR_SIZE,o[e][0],"*"),Be().setValue(l+e*Be().PTR_SIZE,o[e][1],"*")}await Be()._OrtAppendExecutionProvider(e,a,u,l,s)!==0&&Ne(`Can't append execution provider: ${t}.`)}},Oy=async e=>{let t=Be(),i=0,n=[],o=e||{};VO(o);try{let e=BO(o.graphOptimizationLevel??"all"),a=FO(o.executionMode??"sequential"),s="string"==typeof o.logId?Pt(o.logId,n):0,u=o.logSeverityLevel??2;if(!Number.isInteger(u)||u<0||u>4)throw Error(`log severity level is not valid: ${u}`);let l=o.logVerbosityLevel??0;if(!Number.isInteger(l)||l<0||l>4)throw Error(`log verbosity level is not valid: ${l}`);let d="string"==typeof o.optimizedModelFilePath?Pt(o.optimizedModelFilePath,n):0;if(i=t._OrtCreateSessionOptions(e,!!o.enableCpuMemArena,!!o.enableMemPattern,a,!!o.enableProfiling,0,s,u,l,d),0===i&&Ne("Can't create session options."),o.executionProviders&&await GO(i,o.executionProviders,n),void 0!==o.enableGraphCapture){if("boolean"!=typeof o.enableGraphCapture)throw Error(`enableGraphCapture must be a boolean value: ${o.enableGraphCapture}`);Ia(i,"enableGraphCapture",o.enableGraphCapture.toString(),n)}if(o.freeDimensionOverrides)for(let[e,a]of Object.entries(o.freeDimensionOverrides)){if("string"!=typeof e)throw Error(`free dimension override name must be a string: ${e}`);if("number"!=typeof a||!Number.isInteger(a)||a<0)throw Error(`free dimension override value must be a non-negative integer: ${a}`);let o=Pt(e,n);0!==t._OrtAddFreeDimensionOverride(i,o,a)&&Ne(`Can't set a free dimension override: ${e} - ${a}.`)}return void 0!==o.extra&&Vo(o.extra,"",new WeakSet,(e,t)=>{Ia(i,e,t,n)}),[i,n]}catch(e){throw 0!==i&&0!==t._OrtReleaseSessionOptions(i)&&Ne("Can't release session options."),n.forEach(e=>t._free(e)),e}}}),le=k(()=>{"use strict";_r=e=>{switch(e){case"int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"uint32":return 12;case"float16":return 10;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int64":return 7;case"uint64":return 13;case"int4":return 22;case"uint4":return 21;default:throw Error(`unsupported data type: ${e}`)}},Mn=e=>{switch(e){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:return"uint16";case 6:return"int32";case 12:return"uint32";case 10:return"float16";case 1:return"float32";case 11:return"float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";case 22:return"int4";case 21:return"uint4";default:throw Error(`unsupported data type: ${e}`)}},vr=(e,t)=>{let i=[-1,4,1,1,2,2,4,8,-1,1,2,8,4,8,-1,-1,-1,-1,-1,-1,-1,.5,.5][e],n="number"==typeof t?t:t.reduce((e,t)=>e*t,1);return i>0?Math.ceil(n*i):void 0},co=e=>{switch(e){case"float16":return"u">typeof Float16Array&&Float16Array.from?Float16Array:Uint16Array;case"float32":return Float32Array;case"uint8":case"bool":return Uint8Array;case"int8":return Int8Array;case"uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:throw Error(`unsupported type: ${e}`)}},Go=e=>{switch(e){case"verbose":return 0;case"info":return 1;case"warning":return 2;case"error":return 3;case"fatal":return 4;default:throw Error(`unsupported logging level: ${e}`)}},Sa=e=>"float32"===e||"float16"===e||"int32"===e||"int64"===e||"uint32"===e||"uint8"===e||"bool"===e||"uint4"===e||"int4"===e,$a=e=>"float32"===e||"float16"===e||"int32"===e||"int64"===e||"uint32"===e||"uint64"===e||"int8"===e||"uint8"===e||"bool"===e||"uint4"===e||"int4"===e,uc=e=>{switch(e){case"none":return 0;case"cpu":return 1;case"cpu-pinned":return 2;case"texture":return 3;case"gpu-buffer":return 4;case"ml-tensor":return 5;default:throw Error(`unsupported data location: ${e}`)}}}),lc=k(()=>{"use strict";pa(),Uo=async e=>{if("string"!=typeof e)return e instanceof Blob?new Uint8Array(await e.arrayBuffer()):e instanceof Uint8Array?e:new Uint8Array(e);{let t=await fetch(e);if(!t.ok)throw Error(`failed to load external data file: ${e}`);let i=t.headers.get("Content-Length"),n=i?parseInt(i,10):0;if(n<0x40000000)return new Uint8Array(await t.arrayBuffer());{if(!t.body)throw Error(`failed to load external data file: ${e}, no response body.`);let i=t.body.getReader(),o;try{o=new ArrayBuffer(n)}catch(e){if(e instanceof RangeError){let e=Math.ceil(n/65536);o=new WebAssembly.Memory({initial:e,maximum:e}).buffer}else throw e}let a=0;for(;;){let{done:e,value:t}=await i.read();if(e)break;let n=t.byteLength;new Uint8Array(o,a,n).set(t),a+=n}return new Uint8Array(o,0,n)}}}}),Bn=k(()=>{"use strict";le(),UO=["V","I","W","E","F"],WO=(e,t)=>{console.log(`[${UO[e]},${new Date().toISOString()}]${t}`)},Aa=(e,t)=>{Ey=e,Cy=t},HO=(e,t)=>{let i=Go(e);i>=Go(Ey)&&WO(i,"function"==typeof t?t():t)},_e=(...e)=>{Cy&&HO(...e)}}),ge=k(()=>{"use strict";cc=class{static calcMatMulShape(e,t){return e[1]!==t[0]?void 0:[e[0],t[1]]}},Fn=class{static calcShape(e,t,i=!1){let n=e.length,o=t.length;if(0===n)return t;if(0===o)return e;let a=Math.max(e.length,t.length),s=Array(a);if(i){if(n<2||o<2)return;let i=cc.calcMatMulShape([e[n-2],e[n-1]],[t[o-2],t[o-1]]);if(void 0===i)return;[s[a-2],s[a-1]]=i}for(let u=i?3:1;u<=a;u++){let i=n-u<0?1:e[n-u],l=o-u<0?1:t[o-u];if(i!==l&&i>1&&l>1)return;let d=Math.max(i,l);if(i&&l)s[a-u]=Math.max(i,l);else{if(d>1)return;s[a-u]=0}}return s}static isValidBroadcast(e,t){let i=e.length,n=t.length;if(i>n)return!1;for(let o=1;o<=i;o++)if(1!==e[i-o]&&e[i-o]!==t[n-o])return!1;return!0}},C=class e{static size(t){return e.getSizeFromDimensionRange(t,0,t.length)}static convertShape(e,t=4){let i=e.length;if(0===i)return[];let n=Array(i),o=i-1;for(;o>=0;){if(e[o]%t==0){n[o]=e[o]/t;break}if(t%e[o]!=0)throw Error("cannot convert shape");n[o]=1,t/=e[o],o--}for(o--;o>=0;o--)n[o]=e[o];return n}static sizeFromDimension(t,i){if(i<0||i>t.length)throw Error(`invalid dimension of ${i} for sizeFromDimension as Tensor has ${t.length} dimensions.`);return e.getSizeFromDimensionRange(t,i,t.length)}static sizeToDimension(t,i){if(i<0||i>t.length)throw Error(`invalid dimension of ${i} for sizeToDimension as Tensor has ${t.length} dimensions.`);return e.getSizeFromDimensionRange(t,0,i)}static getSizeFromDimensionRange(e,t,i){let n=1;for(let o=t;o<i;o++){if(e[o]<0)throw Error("cannot get valid size from specified dimension range. Most likely the range contains negative values in them.");n*=Number(e[o])}return n}static computeStrides(e){let t=e.length;if(0===t)return[];if(1===t)return[1];let i=Array(t);i[t-1]=1,i[t-2]=e[t-1];for(let n=t-3;n>=0;--n)i[n]=i[n+1]*e[n+1];return i}static normalizeAxis(e,t){if(e<-t&&e>=t)throw Error("unsupported axis for this operation.");return e<0?e+t:e}static normalizeAxes(e,t){return e.map(i=>this.normalizeAxis(i,t??e.length))}static sortBasedOnPerm(e,t){return t?t.map(t=>e[t]):e.slice().reverse()}static padShape(e,t){let i=e.length;return e.map((e,n)=>e+t[n]+t[n+i])}static areEqual(e,t){return e.length===t.length&&e.every((e,i)=>e===t[i])}},Ur=class e{static adjustPoolAttributes(e,t,i,n,o,a){if(!e&&i.length!==t.length-2)throw Error("length of specified kernel shapes should be 2 less than length of input dimensions");if(e)for(let e=0;e<t.length-2;e++)e>=i.length?i.push(t[e+2]):i[e]=t[e+2];for(let e=0;e<i.length;e++)if(e<n.length){if(n[e]<0)throw Error("strides should be greater than or equal to 1")}else n.push(1);for(let e=0;e<i.length;e++)if(e<o.length){if(o[e]<0)throw Error("dilations should be greater than or equal to 1")}else o.push(1);for(let e=0;e<2*i.length;e++)if(e<a.length){if(a[e]<0)throw Error("pad should be greater than or equal to 1")}else a.push(0);for(let e=0;e<i.length;e++){if(i[e]<=0)throw Error("kernel shapes need to be greater than 0");if(a[e]>=i[e]||a[e+i.length]>=i[e])throw Error("pads should be smaller than kernel")}}static adjustPadsBasedOnAutoPad(t,i,n,o,a,s,u){if(u){if(a.length!==2*(t.length-2))throw Error("length of pads should be twice the length of data dimensions");if(i.length!==t.length-2)throw Error("length of strides should be the length of data dimensions");if(o.length!==t.length-2)throw Error("length of kernel shapes should be the length of data dimensions");for(let l=0;l<t.length-2;l++)e.adjustPadAndReturnShape(t[l+(s?1:2)],i[l],n[l],o[l],a,l,l+t.length-2,u)}}static computePoolOutputShape(t,i,n,o,a,s,u){if(i.length<=0)throw Error("input shape must be of size greater than 0");let l=[i[0],i[1]];return e.computeShapeHelper(t,i,l,n,o,a,s,u),l}static computeConvOutputShape(t,i,n,o,a,s,u){if(t.length<=0||i.length<=0)throw Error("invalid input tensor dims or invalid filter tensor dims");let l=[t[0],i[0]];return e.computeShapeHelper(!1,t,l,n,o,a,s,u),l}static computeShapeHelper(t,i,n,o,a,s,u,l){if(t)for(let e=0;e<i.length-2;e++)n.push(1);else for(let t=0;t<i.length-2;t++)n.push(e.adjustPadAndReturnShape(i[t+2],o[t],a[t],s[t],u,t,t+i.length-2,l))}static adjustPadAndReturnShape(e,t,i,n,o,a,s,u){let l=i*(n-1)+1;if(!u||"NOTSET"===u)return Math.floor((e+o[a]+o[s]-l)/t+1);switch(u){case"VALID":return o[a]=0,o[s]=0,Math.floor((e-l)/t+1);case"SAME_LOWER":case"SAME_UPPER":if(1!==i)throw Error("Dilation not supported for SAME_UPPER or SAME_LOWER");{let i=((e+t-1)/t-1)*t+n-e;return o[a]=Math.floor("SAME_LOWER"===u?(i+1)/2:i/2),o[s]=i-o[a],Math.floor((e+i-n)/t+1)}default:throw Error("Unsupported AutoPad type")}}},Oa=class{static getShapeOfGemmResult(e,t,i,n,o){let a,s,u;if(2!==e.length||2!==i.length)throw Error("shape need to be of size 2");t?(a=e[1],s=e[0]):(a=e[0],s=e[1]);let l=-1;if(n?(u=i[0],l=1):(u=i[1],l=0),i[l]!==s)throw Error("dimension mismatch");if(a<=0||u<=0||s<=0)throw Error("invalid shape specified");if(o&&!Fn.isValidBroadcast(o,[a,u]))throw Error("gemm: invalid bias shape for broadcast");return[a,u,s]}},Dy=-34028234663852886e22,ky=34028234663852886e22}),dc=k(()=>{"use strict";le(),Pa=(e,t)=>new(co(t))(e)}),By=k(()=>{"use strict";le(),Bn(),Ly=new Map([["float32",32],["float16",16],["int32",32],["uint32",32],["int64",64],["uint64",64],["int8",8],["uint8",8],["int4",4],["uint4",4]]),fc=(e,t)=>{if("int32"===t)return e;let i=Ly.get(t);if(!i)throw Error(`WebNN backend does not support data type: ${t}`);let n=i/8;if(e.byteLength%n!=0)throw Error(`Invalid Uint8Array length - must be a multiple of ${n}.`);let o=e.byteLength/n,a=new(co(t))(e.buffer,e.byteOffset,o);switch(t){case"int64":case"uint64":{let e=new Int32Array(o);for(let t=0;t<o;t++){let i=a[t];if(i>2147483647n||i<-2147483648n)throw Error("Can not convert int64 data to int32 - value out of range.");e[t]=Number(i)}return new Uint8Array(e.buffer)}case"int8":case"uint8":case"uint32":if("uint32"===t&&a.some(e=>e>0x7fffffff))throw Error("Can not convert uint32 data to int32 - value out of range.");return new Uint8Array(Int32Array.from(a,Number).buffer);default:throw Error(`Unsupported data conversion from ${t} to 'int32'`)}},Ry=(e,t)=>{if("int32"===t)return e;if(e.byteLength%4!=0)throw Error("Invalid Uint8Array length - must be a multiple of 4 (int32).");let i=e.byteLength/4,n=new Int32Array(e.buffer,e.byteOffset,i);switch(t){case"int64":return new Uint8Array(BigInt64Array.from(n,BigInt).buffer);case"uint64":if(n.some(e=>e<0))throw Error("Can not convert int32 data to uin64 - negative value found.");return new Uint8Array(BigUint64Array.from(n,BigInt).buffer);case"int8":if(n.some(e=>e<-128||e>127))throw Error("Can not convert int32 data to int8 - value out of range.");return new Uint8Array(Int8Array.from(n,Number).buffer);case"uint8":if(n.some(e=>e<0||e>255))throw Error("Can not convert int32 data to uint8 - value out of range.");return Uint8Array.from(n,Number);case"uint32":if(n.some(e=>e<0))throw Error("Can not convert int32 data to uint32 - negative value found.");return new Uint8Array(Uint32Array.from(n,Number).buffer);default:throw Error(`Unsupported data conversion from 'int32' to ${t}`)}},jO=1,Ny=()=>jO++,qO=new Map([["int8","int32"],["uint8","int32"],["uint32","int32"],["int64","int32"]]),zy=(e,t)=>{let i=Ly.get(e);if(!i)throw Error(`WebNN backend does not support data type: ${e}`);return t.length>0?Math.ceil(t.reduce((e,t)=>e*t)*i/8):0},Ea=class{constructor(e){this.isDataConverted=!1;let{sessionId:t,context:i,tensor:n,dataType:o,shape:a,fallbackDataType:s}=e;this.sessionId=t,this.mlContext=i,this.mlTensor=n,this.dataType=o,this.tensorShape=a,this.fallbackDataType=s}get tensor(){return this.mlTensor}get type(){return this.dataType}get fallbackType(){return this.fallbackDataType}get shape(){return this.tensorShape}get byteLength(){return zy(this.dataType,this.tensorShape)}destroy(){_e("verbose",()=>"[WebNN] TensorWrapper.destroy"),this.mlTensor.destroy()}write(e){this.mlContext.writeTensor(this.mlTensor,e)}async read(e){if(!this.fallbackDataType)return e?this.mlContext.readTensor(this.mlTensor,e):this.mlContext.readTensor(this.mlTensor);{let t=Ry(new Uint8Array(await this.mlContext.readTensor(this.mlTensor)),this.dataType);return e?void(e instanceof ArrayBuffer?new Uint8Array(e):new Uint8Array(e.buffer,e.byteOffset,e.byteLength)).set(t):t.buffer}}canReuseTensor(e,t,i){return this.mlContext===e&&this.dataType===t&&this.tensorShape.length===i.length&&this.tensorShape.every((e,t)=>e===i[t])}setIsDataConverted(e){this.isDataConverted=e}},Ca=class{constructor(e,t){this.tensorManager=e,this.wrapper=t}get tensorWrapper(){return this.wrapper}releaseTensor(){this.tensorWrapper&&(this.tensorManager.releaseTensor(this.tensorWrapper),this.wrapper=void 0)}async ensureTensor(e,t,i,n){let o=this.tensorManager.getMLContext(e),a;if(!o.opSupportLimits().input.dataTypes.includes(t)){if(!(a=qO.get(t))||!o.opSupportLimits().input.dataTypes.includes(a))throw Error(`WebNN backend does not support data type: ${t}`);_e("verbose",()=>`[WebNN] TensorIdTracker.ensureTensor: fallback dataType from ${t} to ${a}`)}if(this.wrapper){if(this.wrapper.canReuseTensor(o,t,i))return this.wrapper.tensor;if(n){if(this.wrapper.byteLength!==zy(t,i))throw Error("Unable to copy data to tensor with different size.");this.activeUpload=new Uint8Array(await this.wrapper.read())}this.tensorManager.releaseTensor(this.wrapper)}let s=typeof MLTensorUsage>"u"?void 0:MLTensorUsage.READ|MLTensorUsage.WRITE;return this.wrapper=await this.tensorManager.getCachedTensor(e,t,i,s,!0,!0,a),n&&this.activeUpload&&(this.wrapper.write(this.activeUpload),this.activeUpload=void 0),this.wrapper.tensor}upload(e){let t=e;if(this.wrapper){if(this.wrapper.fallbackType)if("int32"===this.wrapper.fallbackType)t=fc(e,this.wrapper.type),this.wrapper.setIsDataConverted(!0);else throw Error(`Unsupported fallback data type: ${this.wrapper.fallbackType}`);if(e.byteLength===this.wrapper.byteLength)return void this.wrapper.write(t);_e("verbose",()=>"Data size does not match tensor size. Releasing tensor."),this.releaseTensor()}this.activeUpload?this.activeUpload.set(t):this.activeUpload=new Uint8Array(t)}async download(e){if(this.activeUpload){let t=this.wrapper?.isDataConverted?Ry(this.activeUpload,this.wrapper?.type):this.activeUpload;return e?void(e instanceof ArrayBuffer?new Uint8Array(e).set(t):new Uint8Array(e.buffer,e.byteOffset,e.byteLength).set(t)):t.buffer}if(!this.wrapper)throw Error("Tensor has not been created.");return e?this.wrapper.read(e):this.wrapper.read()}},pc=class{constructor(e){this.backend=e,this.tensorTrackersById=new Map,this.freeTensors=[],this.externalTensors=new Set}getMLContext(e){let t=this.backend.getMLContext(e);if(!t)throw Error("MLContext not found for session.");return t}reserveTensorId(){let e=Ny();return this.tensorTrackersById.set(e,new Ca(this)),e}releaseTensorId(e){let t=this.tensorTrackersById.get(e);t&&(this.tensorTrackersById.delete(e),t.tensorWrapper&&this.releaseTensor(t.tensorWrapper))}async ensureTensor(e,t,i,n,o){_e("verbose",()=>`[WebNN] TensorManager.ensureTensor {tensorId: ${t}, dataType: ${i}, shape: ${n}, copyOld: ${o}}`);let a=this.tensorTrackersById.get(t);if(!a)throw Error("Tensor not found.");return a.ensureTensor(e,i,n,o)}upload(e,t){let i=this.tensorTrackersById.get(e);if(!i)throw Error("Tensor not found.");i.upload(t)}async download(e,t){_e("verbose",()=>`[WebNN] TensorManager.download {tensorId: ${e}, dstBuffer: ${t?.byteLength}}`);let i=this.tensorTrackersById.get(e);if(!i)throw Error("Tensor not found.");return i.download(t)}releaseTensorsForSession(e){for(let t of this.freeTensors)t.sessionId===e&&t.destroy();this.freeTensors=this.freeTensors.filter(t=>t.sessionId!==e)}registerTensor(e,t,i,n){let o=this.getMLContext(e),a=Ny(),s=new Ea({sessionId:e,context:o,tensor:t,dataType:i,shape:n});return this.tensorTrackersById.set(a,new Ca(this,s)),this.externalTensors.add(s),a}async getCachedTensor(e,t,i,n,o,a,s){let u=this.getMLContext(e);for(let[n,o]of this.freeTensors.entries())if(o.canReuseTensor(u,t,i)){_e("verbose",()=>`[WebNN] Reusing tensor {dataType: ${t}, ${s?`fallbackDataType: ${s},`:""} shape: ${i}`);let o=this.freeTensors.splice(n,1)[0];return o.sessionId=e,o}_e("verbose",()=>`[WebNN] MLContext.createTensor {dataType: ${t}, ${s?`fallbackDataType: ${s},`:""} shape: ${i}}`);let l=await u.createTensor({dataType:s??t,shape:i,dimensions:i,usage:n,writable:o,readable:a});return new Ea({sessionId:e,context:u,tensor:l,dataType:t,shape:i,fallbackDataType:s})}releaseTensor(e){this.externalTensors.has(e)&&this.externalTensors.delete(e),this.freeTensors.push(e)}},My=(...e)=>new pc(...e)}),Fy=k(()=>{"use strict";le(),yr(),dc(),By(),Bn(),Da=new Map([[1,"float32"],[10,"float16"],[6,"int32"],[12,"uint32"],[7,"int64"],[13,"uint64"],[22,"int4"],[21,"uint4"],[3,"int8"],[2,"uint8"],[9,"uint8"]]),KO=(e,t)=>{if(e===t)return!0;if(void 0===e||void 0===t)return!1;let i=Object.keys(e).sort(),n=Object.keys(t).sort();return i.length===n.length&&i.every((i,o)=>i===n[o]&&e[i]===t[i])},ka=class{constructor(e){this.tensorManager=My(this),this.mlContextBySessionId=new Map,this.sessionIdsByMLContext=new Map,this.mlContextCache=[],this.sessionGraphInputs=new Map,this.sessionGraphOutputs=new Map,this.temporaryGraphInputs=[],this.temporaryGraphOutputs=[],this.temporarySessionTensorIds=new Map,Aa(e.logLevel,!!e.debug)}get currentSessionId(){if(void 0===this.activeSessionId)throw Error("No active session");return this.activeSessionId}onRunStart(e){_e("verbose",()=>`[WebNN] onRunStart {sessionId: ${e}}`),this.activeSessionId=e}onRunEnd(e){_e("verbose",()=>`[WebNN] onRunEnd {sessionId: ${e}}`);let t=this.temporarySessionTensorIds.get(e);if(t){for(let e of t)_e("verbose",()=>`[WebNN] releasing temporary tensor {tensorId: ${e}}`),this.tensorManager.releaseTensorId(e);this.temporarySessionTensorIds.delete(e),this.activeSessionId=void 0}}async createMLContext(e){if(e instanceof GPUDevice){let t=this.mlContextCache.findIndex(t=>t.gpuDevice===e);if(-1!==t)return this.mlContextCache[t].mlContext;{let t=await navigator.ml.createContext(e);return this.mlContextCache.push({gpuDevice:e,mlContext:t}),t}}if(void 0===e){let e=this.mlContextCache.findIndex(e=>void 0===e.options&&void 0===e.gpuDevice);if(-1!==e)return this.mlContextCache[e].mlContext;{let e=await navigator.ml.createContext();return this.mlContextCache.push({mlContext:e}),e}}let t=this.mlContextCache.findIndex(t=>KO(t.options,e));if(-1!==t)return this.mlContextCache[t].mlContext;{let t=await navigator.ml.createContext(e);return this.mlContextCache.push({options:e,mlContext:t}),t}}registerMLContext(e,t){this.mlContextBySessionId.set(e,t);let i=this.sessionIdsByMLContext.get(t);i||(i=new Set,this.sessionIdsByMLContext.set(t,i)),i.add(e),this.temporaryGraphInputs.length>0&&(this.sessionGraphInputs.set(e,this.temporaryGraphInputs),this.temporaryGraphInputs=[]),this.temporaryGraphOutputs.length>0&&(this.sessionGraphOutputs.set(e,this.temporaryGraphOutputs),this.temporaryGraphOutputs=[])}onReleaseSession(e){this.sessionGraphInputs.delete(e),this.sessionGraphOutputs.delete(e);let t=this.mlContextBySessionId.get(e);if(!t)return;this.tensorManager.releaseTensorsForSession(e),this.mlContextBySessionId.delete(e);let i=this.sessionIdsByMLContext.get(t);if(i.delete(e),0===i.size){this.sessionIdsByMLContext.delete(t);let e=this.mlContextCache.findIndex(e=>e.mlContext===t);-1!==e&&this.mlContextCache.splice(e,1)}}getMLContext(e){return this.mlContextBySessionId.get(e)}reserveTensorId(){return this.tensorManager.reserveTensorId()}releaseTensorId(e){_e("verbose",()=>`[WebNN] releaseTensorId {tensorId: ${e}}`),this.tensorManager.releaseTensorId(e)}async ensureTensor(e,t,i,n,o){let a=Da.get(i);if(!a)throw Error(`Unsupported ONNX data type: ${i}`);return this.tensorManager.ensureTensor(e??this.currentSessionId,t,a,n,o)}async createTemporaryTensor(e,t,i){_e("verbose",()=>`[WebNN] createTemporaryTensor {onnxDataType: ${t}, shape: ${i}}`);let n=Da.get(t);if(!n)throw Error(`Unsupported ONNX data type: ${t}`);let o=this.tensorManager.reserveTensorId();await this.tensorManager.ensureTensor(e,o,n,i,!1);let a=this.temporarySessionTensorIds.get(e);return a?a.push(o):this.temporarySessionTensorIds.set(e,[o]),o}uploadTensor(e,t){if(!Be().shouldTransferToMLTensor)throw Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");_e("verbose",()=>`[WebNN] uploadTensor {tensorId: ${e}, data: ${t.byteLength}}`),this.tensorManager.upload(e,t)}async downloadTensor(e,t){return this.tensorManager.download(e,t)}createMLTensorDownloader(e,t){return async()=>{let i=await this.tensorManager.download(e);return Pa(i,t)}}registerMLTensor(e,t,i,n){let o=Da.get(i);if(!o)throw Error(`Unsupported ONNX data type: ${i}`);let a=this.tensorManager.registerTensor(e,t,o,n);return _e("verbose",()=>`[WebNN] registerMLTensor {tensor: ${t}, dataType: ${o}, dimensions: ${n}} -> {tensorId: ${a}}`),a}registerMLConstant(e,t,i,n,o,a,s=!1){if(!a)throw Error("External mounted files are not available.");let u=e;e.startsWith("./")&&(u=e.substring(2));let l=a.get(u);if(!l)throw Error(`File with name ${u} not found in preloaded files.`);if(t+i>l.byteLength)throw Error("Out of bounds: data offset and length exceed the external file data size.");let d=l.slice(t,t+i).buffer,p;switch(o.dataType){case"float32":p=new Float32Array(d);break;case"float16":p="u">typeof Float16Array&&Float16Array.from?new Float16Array(d):new Uint16Array(d);break;case"int32":p=new Int32Array(d);break;case"uint32":p=new Uint32Array(d);break;case"int64":s?(p=new Int32Array(fc(new Uint8Array(d),"int64").buffer),o.dataType="int32"):p=new BigInt64Array(d);break;case"uint64":p=new BigUint64Array(d);break;case"int8":p=new Int8Array(d);break;case"int4":case"uint4":case"uint8":p=new Uint8Array(d);break;default:throw Error(`Unsupported data type: ${o.dataType} in creating WebNN Constant from external data.`)}return _e("verbose",()=>`[WebNN] registerMLConstant {dataType: ${o.dataType}, shape: ${o.shape}}} ${s?"(Note: it was int64 data type and registered to int32 as workaround)":""}`),n.constant(o,p)}registerGraphInput(e){this.temporaryGraphInputs.push(e)}registerGraphOutput(e){this.temporaryGraphOutputs.push(e)}isGraphInput(e,t){let i=this.sessionGraphInputs.get(e);return!!i&&i.includes(t)}isGraphOutput(e,t){let i=this.sessionGraphOutputs.get(e);return!!i&&i.includes(t)}isGraphInputOutputTypeSupported(e,t,i=!0){let n=this.mlContextBySessionId.get(e),o=Da.get(_r(t));return!(typeof o>"u")&&(i?!!n?.opSupportLimits().input.dataTypes.includes(o):!!n?.opSupportLimits().output.dataTypes.includes(o))}flush(){}}}),Na=k(()=>{}),Hy=k(()=>{"use strict";Bn(),Na(),Vy=new Map([[64,250],[128,200],[256,200],[512,200],[2048,230],[4096,200],[8192,50],[16384,50],[32768,50],[65536,50],[131072,50],[262144,50],[524288,50],[1048576,50],[2097152,30],[4194304,20],[8388608,10],[0xc00000,10],[0x1000000,10],[0x1900000,15],[0x2000000,22],[0x2a30000,2],[0x3840000,6],[0x4000000,6],[0x8000000,6],[0xa000000,6]]),hc=[],mc=e=>16*Math.ceil(Number(e)/16),XO=e=>{for(let t=0;t<hc.length;t++){let i=hc[t];if(e<=i)return i}return 16*Math.ceil(e/16)},ZO=1,Gy=()=>ZO++,bc=async(e,t,i,n)=>{let o=mc(i),a=e.device.createBuffer({size:o,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});try{let s=e.getCommandEncoder();e.endComputePass(),s.copyBufferToBuffer(t,0,a,0,o),e.flush(),await a.mapAsync(GPUMapMode.READ);let u=a.getMappedRange();if(!n)return new Uint8Array(u.slice(0,i));{let e=n();return e.set(new Uint8Array(u,0,i)),e}}finally{a.destroy()}},gc=class{constructor(e){for(let[t]of(this.backend=e,this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.buffersPending=[],this.capturedPendingBuffers=new Map,Vy))hc.push(t),this.freeBuffers.set(t,[]),this.freeUniformBuffers.set(t,[]);this.sessionCount=0}upload(e,t){let i=t.buffer,n=t.byteOffset,o=t.byteLength,a=mc(o),s=this.storageCache.get(e);if(!s)throw Error("gpu data for uploading does not exist");if(Number(s.originalSize)!==o)throw Error(`inconsistent data size. gpu data size=${s.originalSize}, data size=${o}`);let u=this.backend.device.createBuffer({mappedAtCreation:!0,size:a,usage:GPUBufferUsage.MAP_WRITE|GPUBufferUsage.COPY_SRC});new Uint8Array(u.getMappedRange()).set(new Uint8Array(i,n,o)),u.unmap();let l=this.backend.device.createCommandEncoder();l.copyBufferToBuffer(u,0,s.gpuData.buffer,0,a),this.backend.device.queue.submit([l.finish()]),u.destroy(),_e("verbose",()=>`[WebGPU] GpuDataManager.upload(id=${e})`)}memcpy(e,t){let i=this.storageCache.get(e);if(!i)throw Error("source gpu data for memcpy does not exist");let n=this.storageCache.get(t);if(!n)throw Error("destination gpu data for memcpy does not exist");if(i.originalSize!==n.originalSize)throw Error("inconsistent source and destination gpu data size");let o=mc(i.originalSize),a=this.backend.getCommandEncoder();this.backend.endComputePass(),a.copyBufferToBuffer(i.gpuData.buffer,0,n.gpuData.buffer,0,o)}registerExternalBuffer(e,t,i){let n;if(i){if(n=i[0],e===i[1])return _e("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${n}, buffer is the same, skip.`),n;if(this.backend.capturedCommandList.has(this.backend.currentSessionId))throw Error(`Registering a different external buffer under graph capture mode is not supported yet.
             Please use the previous external buffer!`)}else n=Gy();return this.storageCache.set(n,{gpuData:{id:n,type:0,buffer:e},originalSize:t}),_e("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${n}, registered.`),n}unregisterExternalBuffer(e){void 0!==e&&(this.storageCache.delete(e),_e("verbose",()=>`[WebGPU] GpuDataManager.unregisterExternalBuffer() => id=${e}`))}create(e,t=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST){let i=XO(e),n,o=(t&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE,a=(t&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM;if(o||a){let e=(o?this.freeBuffers:this.freeUniformBuffers).get(i);n=e&&e.length>0?e.pop():this.backend.device.createBuffer({size:i,usage:t})}else n=this.backend.device.createBuffer({size:i,usage:t});let s={id:Gy(),type:0,buffer:n};return this.storageCache.set(s.id,{gpuData:s,originalSize:Number(e)}),_e("verbose",()=>`[WebGPU] GpuDataManager.create(size=${e}) => id=${s.id}`),s}get(e){return this.storageCache.get(e)?.gpuData}release(e){let t="bigint"==typeof e?Number(e):e,i=this.storageCache.get(t);if(!i){if(0===this.storageCache.size)return 0;throw Error("releasing data does not exist")}return _e("verbose",()=>`[WebGPU] GpuDataManager.release(id=${t}), gpuDataId=${i.gpuData.id}`),this.storageCache.delete(t),this.buffersPending.push(i.gpuData.buffer),i.originalSize}async download(e,t){let i=this.storageCache.get(Number(e));if(!i)throw Error("data does not exist");await bc(this.backend,i.gpuData.buffer,i.originalSize,t)}refreshPendingBuffers(){if(0!==this.buffersPending.length)if("default"===this.backend.sessionStatus){for(let e of this.buffersPending){let t=Vy.get(e.size);if((e.usage&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE){let i=this.freeBuffers.get(e.size)||[];void 0===t||i.length>=t?e.destroy():i.push(e)}else if((e.usage&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM){let i=this.freeUniformBuffers.get(e.size)||[];void 0===t||i.length>=t?e.destroy():i.push(e)}else e.destroy()}this.buffersPending=[]}else{let e=this.capturedPendingBuffers.get(this.backend.currentSessionId);for(let t of(e||(e=[],this.capturedPendingBuffers.set(this.backend.currentSessionId,e)),this.buffersPending))e.push(t);this.buffersPending=[]}}dispose(){this.freeBuffers.forEach(e=>{e.forEach(e=>{e.destroy()})}),this.freeUniformBuffers.forEach(e=>{e.forEach(e=>{e.destroy()})}),this.storageCache.forEach(e=>{e.gpuData.buffer.destroy()}),this.capturedPendingBuffers.forEach(e=>{e.forEach(e=>{e.destroy()})}),this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.capturedPendingBuffers=new Map}onCreateSession(){this.sessionCount+=1}onReleaseSession(e){let t=this.capturedPendingBuffers.get(e);t&&(t.forEach(e=>{e.destroy()}),this.capturedPendingBuffers.delete(e)),this.sessionCount-=1,0===this.sessionCount&&(_e("warning",()=>"[WebGPU] Clearing webgpu buffer cache"),this.storageCache.forEach(e=>{e.gpuData.buffer.destroy()}),this.storageCache=new Map)}},Wy=(...e)=>new gc(...e)}),Xe=k(()=>{"use strict";yc=class{constructor(e){Object.assign(this,e)}get cacheKey(){return this.key||(this.key=Object.getOwnPropertyNames(this).sort().map(e=>`${this[e]}`).join(";")),this.key}},ce=e=>new yc(e)}),ye=k(()=>{"use strict";le(),ge(),Wr=64,vc=(e,t)=>{if(3===t)throw Error("vec3 has same alignment as vec4, use vec4 instead");switch(Number(e)){case 10:return t>1?`vec${t}<f16>`:"f16";case 1:return t>1?`vec${t}<f32>`:"f32";case 6:return t>1?`vec${t}<i32>`:"i32";case 12:return t>1?`vec${t}<u32>`:"u32";case 7:if(t>1)throw Error("currently not supported vecX of uint64 yet");return["vec2<u32>","i32"];case 13:if(t>1)throw Error("currently not supported vecX of uint64 yet");return["vec2<u32>","u32"];case 9:if(4!==t)throw Error("bool must be vec4");return["u32","vec4<bool>"];case 22:return"i32";case 21:return"u32";default:throw Error(`Unknown data type: ${e}`)}},Ve=(e,t=1)=>{let i=vc(e,t);return"string"==typeof i?i:i[0]},it=(e,t=1)=>{let i=vc(e,t);return"string"==typeof i?i:i[1]},W=(...e)=>{let t=[];return e.forEach(e=>{0!==e.length&&t.push({type:12,data:e},{type:12,data:C.computeStrides(e)})}),t},Ee=e=>e%4==0?4:e%2==0?2:1,wc=(e="f32",t,i="0")=>t&&1!==t?`vec${t}<${e}>(${i})`:`${e}(${i})`,Hr=(e,t,i)=>"f32"===e?i:1===t?`f32(${i})`:`vec${t}<f32>(${i})`,Kt=(e,t)=>4===t?`(${e}.x + ${e}.y + ${e}.z + ${e}.w)`:2===t?`(${e}.x + ${e}.y)`:3===t?`(${e}.x + ${e}.y + ${e}.z)`:e,Q=(e,t,i,n)=>e.startsWith("uniforms.")&&i>4?"string"==typeof t?"f16"===n?`${e}[(${t}) / 8][(${t}) % 8 / 4][(${t}) % 8 % 4]`:`${e}[(${t}) / 4][(${t}) % 4]`:"f16"===n?`${e}[${Math.floor(t/8)}][${Math.floor(t%8/4)}][${t%8%4}]`:`${e}[${Math.floor(t/4)}][${t%4}]`:i>1?`${e}[${t}]`:e,La=(e,t,i,n,o)=>{let a="number"==typeof i,s=a?i:i.length,u=[...Array(s).keys()],l=s<2?"u32":s<=4?`vec${s}<u32>`:`array<u32, ${s}>`,d=vc(t,o),p="string"==typeof d?d:d[1],c={indices:l,value:p,storage:"string"==typeof d?d:d[0],tensor:t},h=e=>"string"==typeof e?e:`${e}u`,f={offsetToIndices:!1,indicesToOffset:!1,broadcastedIndicesToOffset:!1,set:!1,setByIndices:!1,get:!1,getByIndices:!1},m=a?"uniforms.":"",g=`${m}${e}_shape`,b=`${m}${e}_strides`,y="";for(let e=0;e<s-1;e++)y+=`
    let dim${e} = current / ${Q(b,e,s)};
    let rest${e} = current % ${Q(b,e,s)};
    indices[${e}] = dim${e};
    current = rest${e};
    `;y+=`indices[${s-1}] = current;`;let _=s<2?"":`
  fn o2i_${e}(offset: u32) -> ${c.indices} {
    var indices: ${c.indices};
    var current = offset;
    ${y}
    return indices;
  }`,v=t=>(f.offsetToIndices=!0,s<2?t:`o2i_${e}(${t})`),x=[];if(s>=2)for(let e=s-1;e>=0;e--)x.push(`${Q(b,e,s)} * (indices[${e}])`);let w=s<2?"":`
  fn i2o_${e}(indices: ${c.indices}) -> u32 {
    return ${x.join("+")};
  }`,$=t=>(f.indicesToOffset=!0,s<2?t:`i2o_${e}(${t})`),T=(...e)=>0===s?"0u":`${c.indices}(${e.map(h).join(",")})`,I=(e,t)=>s<2?`${e}`:`${Q(e,t,s)}`,S=(e,t,i)=>s<2?`${e}=${i};`:`${Q(e,t,s)}=${i};`,O={},E=(t,i)=>{f.broadcastedIndicesToOffset=!0;let n=`${i.name}broadcastedIndicesTo${e}Offset`;if(n in O)return`${n}(${t})`;let o=[];for(let e=s-1;e>=0;e--){let t=i.indicesGet("outputIndices",e+i.rank-s);o.push(`${I(b,e)} * (${t} % ${I(g,e)})`)}return O[n]=`fn ${n}(outputIndices: ${i.type.indices}) -> u32 {
             return ${o.length>0?o.join("+"):"0u"};
           }`,`${n}(${t})`},A=(t,i)=>(()=>{if(c.storage===c.value)return`${e}[${t}]=${i};`;if("vec2<u32>"===c.storage&&"i32"===c.value)return`${e}[${t}]=vec2<u32>(u32(${i}), select(0u, 0xFFFFFFFFu, ${i} < 0));`;if("vec2<u32>"===c.storage&&"u32"===c.value)return`${e}[${t}]=vec2<u32>(u32(${i}), 0u);`;if("u32"===c.storage&&"vec4<bool>"===c.value)return`${e}[${t}]=dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(${i}));`;throw Error(`not supported combination of storage type ${c.storage} and value type ${c.value} yet`)})(),P=t=>(()=>{if(c.storage===c.value)return`${e}[${t}]`;if("vec2<u32>"===c.storage&&"i32"===c.value)return`i32(${e}[${t}].x)`;if("vec2<u32>"===c.storage&&"u32"===c.value)return`u32(${e}[${t}].x)`;if("u32"===c.storage&&"vec4<bool>"===c.value)return`vec4<bool>(bool(${e}[${t}] & 0xFFu), bool(${e}[${t}] & 0xFF00u), bool(${e}[${t}] & 0xFF0000u), bool(${e}[${t}] & 0xFF000000u))`;throw Error(`not supported combination of storage type ${c.storage} and value type ${c.value} yet`)})(),D=s<2?"":`
  fn get_${e}ByIndices(indices: ${c.indices}) -> ${p} {
    return ${P(`i2o_${e}(indices)`)};
  }`,z=s<2?"":(()=>{let t=u.map(e=>`d${e}: u32`).join(", "),i=u.map(e=>`d${e}`).join(", ");return`
  fn get_${e}(${t}) -> ${p} {
    return get_${e}ByIndices(${T(i)});
  }`})(),R=(...t)=>{if(t.length!==s)throw Error(`indices length must be ${s}`);let i=t.map(h).join(",");return 0===s?P("0u"):1===s?P(i[0]):(f.get=!0,f.getByIndices=!0,f.indicesToOffset=!0,`get_${e}(${i})`)},B=t=>s<2?P(t):(f.getByIndices=!0,f.indicesToOffset=!0,`get_${e}ByIndices(${t})`),M=s<2?"":`
  fn set_${e}ByIndices(indices: ${c.indices}, value: ${p}) {
    ${A(`i2o_${e}(indices)`,"value")}
  }`,F=s<2?"":(()=>{let t=u.map(e=>`d${e}: u32`).join(", "),i=u.map(e=>`d${e}`).join(", ");return`
  fn set_${e}(${t}, value: ${p}) {
    set_${e}ByIndices(${T(i)}, value);
  }`})();return{impl:()=>{let e=[],t=!1;return f.offsetToIndices&&(e.push(_),t=!0),f.indicesToOffset&&(e.push(w),t=!0),f.broadcastedIndicesToOffset&&(Object.values(O).forEach(t=>e.push(t)),t=!0),f.set&&(e.push(F),t=!0),f.setByIndices&&(e.push(M),t=!0),f.get&&(e.push(z),t=!0),f.getByIndices&&(e.push(D),t=!0),!a&&t&&e.unshift(`const ${g} = ${c.indices}(${i.join(",")});`,`const ${b} = ${c.indices}(${C.computeStrides(i).join(",")});`),e.join(`
`)},type:c,offsetToIndices:v,indicesToOffset:$,broadcastedIndicesToOffset:E,indices:T,indicesGet:I,indicesSet:S,set:(...t)=>{if(t.length!==s+1)throw Error(`indices length must be ${s}`);let i=t[s];if("string"!=typeof i)throw Error("value must be string");let n=t.slice(0,s).map(h).join(",");return 0===s?A("0u",i):1===s?A(n[0],i):(f.set=!0,f.setByIndices=!0,f.indicesToOffset=!0,`set_${e}(${n}, ${i})`)},setByOffset:A,setByIndices:(t,i)=>s<2?A(t,i):(f.setByIndices=!0,f.indicesToOffset=!0,`set_${e}ByIndices(${t}, ${i});`),get:R,getByOffset:P,getByIndices:B,usage:n,name:e,strides:b,shape:g,rank:s}},N=(e,t,i,n=1)=>La(e,t,i,"input",n),G=(e,t,i,n=1)=>La(e,t,i,"output",n),jy=(e,t,i)=>La(e,t,i,"atomicOutput",1),Ra=(e,t,i,n=1)=>La(e,t,i,"internal",n),_c=class{constructor(e,t){this.normalizedDispatchGroup=e,this.limits=t,this.internalVariables=[],this.variables=[],this.uniforms=[],this.variableIndex=0}guardAgainstOutOfBoundsWorkgroupSizes(e){return`if (global_idx >= ${"number"==typeof e?`${e}u`:e}) { return; }`}mainStart(e=Wr){let t="number"==typeof e?e:e[0],i="number"==typeof e?1:e[1],n="number"==typeof e?1:e[2];if(t>this.limits.maxComputeWorkgroupSizeX||i>this.limits.maxComputeWorkgroupSizeY||n>this.limits.maxComputeWorkgroupSizeZ)throw Error(`workgroup size [${t}, ${i}, ${n}] exceeds the maximum workgroup size [${this.limits.maxComputeWorkgroupSizeX}, ${this.limits.maxComputeWorkgroupSizeY}, ${this.limits.maxComputeWorkgroupSizeZ}].`);if(t*i*n>this.limits.maxComputeInvocationsPerWorkgroup)throw Error(`workgroup size [${t}, ${i}, ${n}] exceeds the maximum workgroup invocations ${this.limits.maxComputeInvocationsPerWorkgroup}.`);let o=1===this.normalizedDispatchGroup[1]&&1===this.normalizedDispatchGroup[2],a=o?`@builtin(global_invocation_id) global_id : vec3<u32>,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(local_invocation_id) local_id : vec3<u32>`:`@builtin(global_invocation_id) global_id : vec3<u32>,
                                             @builtin(local_invocation_id) local_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(num_workgroups) num_workgroups : vec3<u32>`,s=o?`let global_idx = global_id.x;
         let workgroup_index = workgroup_id.x;`:`let workgroup_index = workgroup_id.z * num_workgroups[0] * num_workgroups[1] +
             workgroup_id.y * num_workgroups[0] + workgroup_id.x;
         let global_idx = workgroup_index * ${t*i*n}u + local_idx;`;return`@compute @workgroup_size(${t}, ${i}, ${n})
  fn main(${a}) {
    ${s}
  `}appendVariableUniforms(e){0!==e.rank&&(e.shape.startsWith("uniforms.")&&this.uniforms.push({name:e.shape.replace("uniforms.",""),type:"u32",length:e.rank}),e.strides.startsWith("uniforms.")&&this.uniforms.push({name:e.strides.replace("uniforms.",""),type:"u32",length:e.rank}))}declareVariable(e,t){if("internal"===e.usage)throw Error("cannot use internal variable with declareVariable(). use registerInternalVariables() instead.");this.variables.push(e),this.appendVariableUniforms(e);let i="input"===e.usage?"read":"read_write",n="atomicOutput"===e.usage?"atomic<i32>":e.type.storage;return`@group(0) @binding(${t}) var<storage, ${i}> ${e.name}: array<${n}>;`}declareVariables(...e){return e.map(e=>this.declareVariable(e,this.variableIndex++)).join(`
`)}registerInternalVariable(e){if("internal"!==e.usage)throw Error("cannot use input or output variable with registerInternalVariable(). use declareVariables() instead.");this.internalVariables.push(e),this.appendVariableUniforms(e)}registerInternalVariables(...e){return e.forEach(e=>this.registerInternalVariable(e)),this}registerUniform(e,t,i=1){return this.uniforms.push({name:e,type:t,length:i}),this}registerUniforms(e){return this.uniforms=this.uniforms.concat(e),this}uniformDeclaration(){if(0===this.uniforms.length)return"";let e=[];for(let{name:t,type:i,length:n}of this.uniforms)if(n&&n>4)"f16"===i?e.push(`@align(16) ${t}:array<mat2x4<${i}>, ${Math.ceil(n/8)}>`):e.push(`${t}:array<vec4<${i}>, ${Math.ceil(n/4)}>`);else{let o=null==n||1===n?i:`vec${n}<${i}>`;e.push(`${t}:${o}`)}return`
      struct Uniforms { ${e.join(", ")} };
      @group(0) @binding(${this.variableIndex}) var<uniform> uniforms: Uniforms;`}get additionalImplementations(){return this.uniformDeclaration()+this.variables.map(e=>e.impl()).join(`
`)+this.internalVariables.map(e=>e.impl()).join(`
`)}get variablesInfo(){if(0===this.uniforms.length)return;let e=e=>[12,10,1,6][["u32","f16","f32","i32"].indexOf(e)];return this.uniforms.map(t=>[e(t.type),t.length??1])}},qy=(e,t)=>new _c(e,t)}),Yn=k(()=>{"use strict";le(),ge(),Xe(),ye(),JO=(e,t)=>{if(!e||1!==e.length)throw Error("Transpose requires 1 input.");if(0!==t.length&&t.length!==e[0].dims.length)throw Error(`perm size ${t.length} does not match input rank ${e[0].dims.length}`)},Ky=(e,t)=>0!==t.length?t:[...Array(e).keys()].reverse(),YO=(e,t)=>C.sortBasedOnPerm(e,Ky(e.length,t)),QO=(e,t,i,n)=>{let o=`fn perm(i: ${n.type.indices}) -> ${i.type.indices} {
    var a: ${i.type.indices};`;for(let i=0;i<t;++i)o+=`a[${e[i]}]=i[${i}];`;return o+"return a;}"},eP=(e,t)=>{let i=[],n=[];for(let o=0;o<e.length;++o)1!==e[o]&&i.push(e[o]),1!==e[t[o]]&&n.push(t[o]);return{newShape:i,newPerm:n}},tP=(e,t)=>{let i=0;for(let n=0;n<e.length;++n)if(1!==t[e[n]]){if(e[n]<i)return!1;i=e[n]}return!0},at=(e,t)=>{let i=e.dataType,n=e.dims.length,o=Ky(n,t),a=YO(e.dims,o),s=e.dims,u=a;if(n<2||tP(o,e.dims))return{name:"TransposeCopy",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let t=C.size(a);return{outputs:[{dims:a,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(t/64/4)},programUniforms:[{type:12,data:Math.ceil(t/4)}]}},getShaderSource:e=>{let t=N("input",i,s,4),n=G("output",i,u,4);return`
  ${e.registerUniform("output_size","u32").declareVariables(t,n)}
  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    output[global_idx] = input[global_idx];
  }`}};let{newShape:l,newPerm:d}=eP(e.dims,o),p=C.areEqual(d,[2,3,1]),c=C.areEqual(d,[3,1,2]);if(2===l.length||p||c){u=[(s=p?[l[0],l[1]*l[2]]:c?[l[0]*l[1],l[2]]:l)[1],s[0]];let t=16;return{name:"TransposeShared",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let i=C.size(a);return{outputs:[{dims:a,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(u[1]/t),y:Math.ceil(u[0]/t)},programUniforms:[{type:12,data:i},...W(s,u)]}},getShaderSource:e=>{let n=N("a",i,s.length),o=G("output",i,u.length);return`
  ${e.registerUniform("output_size","u32").declareVariables(n,o)}
  var<workgroup> tile : array<array<${o.type.value}, ${t+1}>, ${t}>;
  ${e.mainStart([t,t,1])}
    let stride = (uniforms.output_shape[1] - 1) / ${t} + 1;
    let workgroup_id_x = workgroup_index % stride;
    let workgroup_id_y = workgroup_index / stride;
    let input_col = workgroup_id_y * ${t}u + local_id.x;
    let input_row = workgroup_id_x * ${t}u + local_id.y;
    if (input_row < uniforms.a_shape[0] && input_col < uniforms.a_shape[1]) {
      tile[local_id.y][local_id.x] = ${n.getByIndices(`${n.type.indices}(input_row, input_col)`)};
    }
    workgroupBarrier();

    let output_col = workgroup_id_x * ${t}u + local_id.x;
    let output_row = workgroup_id_y * ${t}u + local_id.y;
    if (output_row < uniforms.output_shape[0] && output_col < uniforms.output_shape[1]) {
      ${o.setByIndices(`${o.type.indices}(output_row, output_col)`,"tile[local_id.x][local_id.y]")}
    }
  }`}}}return{name:"Transpose",shaderCache:{hint:`${t}`,inputDependencies:["rank"]},getRunData:()=>{let t=C.size(a);return{outputs:[{dims:a,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(t/64)},programUniforms:[{type:12,data:t},...W(s,u)]}},getShaderSource:e=>{let t=N("a",i,s.length),a=G("output",i,u.length);return`
  ${e.registerUniform("output_size","u32").declareVariables(t,a)}

  ${QO(o,n,t,a)}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${a.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${a.setByOffset("global_idx",t.getByIndices("aIndices"))}
  }`}}},Xy=(e,t)=>{JO(e.inputs,t.perm),e.compute(at(e.inputs[0],t.perm))},Zy=e=>ce({perm:e.perm})}),s_=k(()=>{"use strict";le(),ge(),ye(),za(),Yn(),nP={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate * candidate",logSumExp:"bestValue + exp(candidate)",l1:"bestValue + abs(candidate)",l2:"bestValue + candidate * candidate",logSum:"bestValue + candidate"},rP={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate",logSumExp:"bestValue + candidate",l1:"bestValue + candidate",l2:"bestValue + candidate",logSum:"bestValue + candidate"},oP={max:"_A[offset]",min:"_A[offset]",mean:"0",sum:"0",prod:"1",sumSquare:"0",logSumExp:"0",l1:"0",l2:"0",logSum:"0"},iP={max:"bestValue",min:"bestValue",sum:"bestValue",prod:"bestValue",sumSquare:"bestValue",logSumExp:"log(bestValue)",l1:"bestValue",l2:"sqrt(bestValue)",logSum:"log(bestValue)"},aP=(e,t)=>{let i=[];for(let n=t-e;n<t;++n)i.push(n);return i},sP=(e,t)=>{let i=[],n=e.length;for(let o=0;o<n;o++)-1===t.indexOf(o)&&i.push(e[o]);return[i,t.map(t=>e[t])]},uP=(e,t)=>{let i=e.length+t.length,n=[],o=0;for(let a=0;a<i;a++)-1===t.indexOf(a)?n.push(e[o++]):n.push(1);return n},lP=(e,t)=>{for(let i=0;i<e.length;++i)if(e[e.length-i-1]!==t-1-i)return!1;return!0},cP=(e,t)=>{let i=[];if(!lP(e,t)){for(let n=0;n<t;++n)-1===e.indexOf(n)&&i.push(n);e.forEach(e=>i.push(e))}return i},dP=(e,t,i,n,o,a,s)=>{let u=i[0].dims,l=C.size(a),d=C.size(s),p=N("_A",i[0].dataType,u),c=G("output",o,a),h=64;1===l&&(h=256);let f=`
          var<workgroup> aBestValues : array<f32, ${h}>;
       `,m=e=>`
        ${e.registerUniform("reduceSize","u32").declareVariables(p,c)}
        ${f}
        fn DIV_CEIL(a : u32, b : u32) -> u32 {
          return ((a - 1u) / b + 1u);
         }
         ${e.mainStart(h)}

          let outputIndex = global_idx / ${h};
          let offset = outputIndex * uniforms.reduceSize;

          var bestValue = f32(${oP[n]});
          let Length = uniforms.reduceSize;
          for (var k = local_idx; k < Length; k = k + ${h}) {
           let candidate = f32(${p.getByOffset("offset + k")});
           bestValue = ${nP[n]};
          }
          aBestValues[local_idx] = bestValue;
          workgroupBarrier();

         var reduceSize = min(Length, ${h}u);
         for (var currentSize = reduceSize / 2u; reduceSize > 1u;
             currentSize = reduceSize / 2u) {
           let interval = DIV_CEIL(reduceSize, 2u);
           if (local_idx < currentSize) {
            let candidate = aBestValues[local_idx + interval];
            bestValue = ${rP[n]};
            aBestValues[local_idx] = bestValue;
           }
           reduceSize = interval;
           workgroupBarrier();
         }

         if (local_idx == 0u) {
          ${c.setByOffset("outputIndex",`${"mean"===n?`${c.type.storage}(bestValue / f32(uniforms.reduceSize))`:`${c.type.storage}(${iP[n]})`}`)};
         }
        }`;return{name:e,shaderCache:{hint:`${t};${h}`,inputDependencies:["type"]},getShaderSource:m,getRunData:()=>({outputs:[{dims:a,dataType:o}],dispatchGroup:{x:l},programUniforms:[{type:12,data:d}]})}},Vn=(e,t,i,n)=>{let o=1===e.inputs.length?i:xc(e.inputs,i),a=o.axes;0!==a.length||o.noopWithEmptyAxes||(a=e.inputs[0].dims.map((e,t)=>t));let s=C.normalizeAxes(a,e.inputs[0].dims.length),u=s,l=e.inputs[0],d=cP(u,e.inputs[0].dims.length);d.length>0&&(l=e.compute(at(e.inputs[0],d),{inputs:[0],outputs:[-1]})[0],u=aP(u.length,l.dims.length));let[p,c]=sP(l.dims,u),h=p;o.keepDims&&(h=uP(p,s)),e.compute(dP(t,o.cacheKey,[l],n,e.inputs[0].dataType,h,c),{inputs:[l]})},Jy=(e,t)=>{Vn(e,"ReduceMeanShared",t,"mean")},Yy=(e,t)=>{Vn(e,"ReduceL1Shared",t,"l1")},Qy=(e,t)=>{Vn(e,"ReduceL2Shared",t,"l2")},e_=(e,t)=>{Vn(e,"ReduceLogSumExpShared",t,"logSumExp")},t_=(e,t)=>{Vn(e,"ReduceMaxShared",t,"max")},n_=(e,t)=>{Vn(e,"ReduceMinShared",t,"min")},r_=(e,t)=>{Vn(e,"ReduceProdShared",t,"prod")},o_=(e,t)=>{Vn(e,"ReduceSumShared",t,"sum")},i_=(e,t)=>{Vn(e,"ReduceSumSquareShared",t,"sumSquare")},a_=(e,t)=>{Vn(e,"ReduceLogSumShared",t,"logSum")}}),za=k(()=>{"use strict";le(),ge(),Xe(),ye(),s_(),Gn=e=>{if(!e||0===e.length||e.length>2)throw Error("Reduce op requires 1 or 2 inputs.");if(2===e.length&&1!==e[1].dims.length)throw Error("Invalid axes input dims.")},pP=e=>["","",`var value = ${e.getByIndices("input_indices")};`,""],Ma=(e,t,i,n,o,a,s=!1,u=!1)=>{let l=[],d=i[0].dims,p=d.length,c=C.normalizeAxes(o,p),h=!u&&0===c.length;d.forEach((e,t)=>{h||c.indexOf(t)>=0?s&&l.push(1):l.push(e)});let f=l.length,m=C.size(l);return{name:e,shaderCache:t,getShaderSource:e=>{let t=[],o=N("_A",i[0].dataType,p),u=G("output",a,f),l=n(o,u,c),m=l[2];for(let e=0,i=0;e<p;e++)h||c.indexOf(e)>=0?(s&&i++,m=`for(var j${e}: u32 = 0; j${e} < ${d[e]}; j${e}++) {
                  ${l[2].includes("last_index")?`let last_index = j${e};`:""}
                  ${o.indicesSet("input_indices",e,`j${e}`)}
                  ${m}
                }`):(t.push(`${o.indicesSet("input_indices",e,u.indicesGet("output_indices",i))};`),i++);return`

        ${e.registerUniform("output_size","u32").declareVariables(o,u)}

        ${e.mainStart()}
          ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          var input_indices: ${o.type.indices};
          let output_indices = ${u.offsetToIndices("global_idx")};

          ${t.join(`
`)}
          ${l[0]}       // init ops for reduce max/min
          ${l[1]}
          ${m}
          ${l[3]}
          ${4===l.length?u.setByOffset("global_idx","value"):l.slice(4).join(`
`)}
        }`},getRunData:()=>({outputs:[{dims:l,dataType:a}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:[{type:12,data:m},...W(d,l)]})}},xc=(e,t)=>{let i=[];return e[1].dims[0]>0&&e[1].getBigInt64Array().forEach(e=>i.push(Number(e))),ce({axes:i,keepDims:t.keepDims,noopWithEmptyAxes:t.noopWithEmptyAxes})},Un=(e,t,i,n)=>{let o=e.inputs,a=1===o.length?i:xc(o,i);e.compute(Ma(t,{hint:a.cacheKey,inputDependencies:["rank"]},[o[0]],a.noopWithEmptyAxes&&0===a.axes.length?pP:n,a.axes,o[0].dataType,a.keepDims,a.noopWithEmptyAxes),{inputs:[0]})},fP=(e,t)=>{Gn(e.inputs),Un(e,"ReduceLogSum",t,(e,t)=>[`var value = ${t.type.storage}(0);`,"",`value += ${e.getByIndices("input_indices")};`,"value = log(value);"])},hP=(e,t)=>{Gn(e.inputs),Un(e,"ReduceL1",t,(e,t)=>[`var value = ${t.type.storage}(0);`,"",`value += abs(${e.getByIndices("input_indices")});`,""])},mP=(e,t)=>{Gn(e.inputs),Un(e,"ReduceL2",t,(e,t)=>[`var t = ${t.type.value}(0); var value = ${t.type.value}(0);`,"",`t = ${e.getByIndices("input_indices")}; value += (t * t);`,"value = sqrt(value);"])},gP=(e,t)=>{Gn(e.inputs),Un(e,"ReduceLogSumExp",t,(e,t)=>[`var value = ${t.type.storage}(0);`,"",`value += exp(${e.getByIndices("input_indices")});`,"value = log(value);"])},bP=(e,t)=>{Gn(e.inputs),Un(e,"ReduceMax",t,(e,t,i)=>{let n=[];for(let t=0;t<e.rank;t++)(i.indexOf(t)>=0||0===i.length)&&n.push(e.indicesSet("input_indices",t,0));return[`${n.join(`
`)}`,`var value = ${e.getByIndices("input_indices")};`,`value = max(value, ${e.getByIndices("input_indices")});`,""]})},yP=(e,t)=>{Gn(e.inputs),Un(e,"ReduceMean",t,(t,i,n)=>{let o=1;for(let i=0;i<t.rank;i++)(n.indexOf(i)>=0||0===n.length)&&(o*=e.inputs[0].dims[i]);return["var sum = f32(0);","",`sum += f32(${t.getByIndices("input_indices")});`,`let value = ${i.type.value}(sum / ${o});`]})},_P=(e,t)=>{Gn(e.inputs),Un(e,"ReduceMin",t,(e,t,i)=>{let n=[];for(let t=0;t<e.rank;t++)(i.indexOf(t)>=0||0===i.length)&&n.push(`input_indices[${t}] = 0;`);return[`${n.join(`
`)}`,`var value = ${e.getByIndices("input_indices")};`,`value = min(value, ${e.getByIndices("input_indices")});`,""]})},vP=(e,t)=>{Gn(e.inputs),Un(e,"ReduceProd",t,(e,t)=>[`var value = ${t.type.storage}(1);`,"",`value *= ${e.getByIndices("input_indices")};`,""])},wP=(e,t)=>{Gn(e.inputs),Un(e,"ReduceSum",t,(e,t)=>[`var value = ${t.type.storage}(0);`,"",`value += ${e.getByIndices("input_indices")};`,""])},xP=(e,t)=>{Gn(e.inputs),Un(e,"ReduceSumSquare",t,(e,t)=>[`var t = ${t.type.value}(0); var value = ${t.type.value}(0);`,"",`t = ${e.getByIndices("input_indices")}; value += t * t;`,""])},Wn=(e,t,i)=>{if(0===t.length)return i;let n=1,o=1;for(let i=0;i<t.length;i++)-1===t.indexOf(i)?n*=e[i]:o*=e[i];return o<32&&n>1024},u_=(e,t)=>{Wn(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?yP(e,t):Jy(e,t)},l_=(e,t)=>{Wn(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?hP(e,t):Yy(e,t)},c_=(e,t)=>{Wn(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?mP(e,t):Qy(e,t)},d_=(e,t)=>{Wn(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?gP(e,t):e_(e,t)},p_=(e,t)=>{Wn(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?bP(e,t):t_(e,t)},f_=(e,t)=>{Wn(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?_P(e,t):n_(e,t)},h_=(e,t)=>{Wn(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?vP(e,t):r_(e,t)},m_=(e,t)=>{Wn(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?wP(e,t):o_(e,t)},g_=(e,t)=>{Wn(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?xP(e,t):i_(e,t)},b_=(e,t)=>{Wn(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?fP(e,t):a_(e,t)}}),w_=k(()=>{"use strict";le(),Xe(),za(),y_=e=>{if(!e||0===e.length||e.length>2)throw Error("ArgMinMaxOp op requires 1 or 2 inputs.");if(1!==e[0].dataType)throw Error("Invalid input type.")},__=(e,t)=>{y_(e.inputs);let i=(e,i,n)=>{let o=[];for(let t=0;t<e.rank;t++)(n.indexOf(t)>=0||0===n.length)&&o.push(`input_indices[${t}] = 0;`);return[`${o.join(`
`)}`,`var value = ${e.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${e.getByIndices("input_indices")} ${t.selectLastIndex>0?"<=":"<"} value) {
         value = ${e.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",i.setByOffset("global_idx","best_index")]};e.compute(Ma("ArgMin",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],i,[t.axis],7,t.keepDims),{inputs:[0]})},v_=(e,t)=>{y_(e.inputs);let i=(e,i,n)=>{let o=[];for(let t=0;t<e.rank;t++)(n.indexOf(t)>=0||0===n.length)&&o.push(`input_indices[${t}] = 0;`);return[`${o.join(`
`)}`,`var value = ${e.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${e.getByIndices("input_indices")} ${t.selectLastIndex>0?">=":">"} value) {
         value = ${e.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",i.setByOffset("global_idx","best_index")]};e.compute(Ma("argMax",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],i,[t.axis],7,t.keepDims),{inputs:[0]})},Tc=e=>ce(e)}),Ba=k(()=>{"use strict";le(),ge(),Na(),ye(),TP=(e,t)=>{let i=e[0],n=e[1],o=e[2],a=e[3],s=e[4],u=e[5];if(s&&u)throw Error("Attention cannot have both past and attention_bias");if(3!==i.dims.length)throw Error('Input "input" must have 3 dimensions');let l=i.dims[0],d=i.dims[1],p=i.dims[2];if(1!==o.dims.length)throw Error('Input "bias" is expected to have 1 dimensions');if(2!==n.dims.length)throw Error('Input "weights" is expected to have 2 dimensions');if(n.dims[0]!==p)throw Error("Input 1 dimension 0 should have same length as dimension 2 of input 0");if(o.dims[0]!==n.dims[1])throw Error('Input "bias" dimension 0 should have same length as dimension 1 of input "weights"');let c=o.dims[0]/3,h=c,f=h;if(t.qkvHiddenSizes.length>0){if(3!==t.qkvHiddenSizes.length)throw Error("qkv_hidden_sizes attribute should have 3 elements");for(let e of t.qkvHiddenSizes)if(e%t.numHeads!=0)throw Error("qkv_hidden_sizes should be divisible by num_heads");c=t.qkvHiddenSizes[0],h=t.qkvHiddenSizes[1],f=t.qkvHiddenSizes[2]}let m=d;if(c!==h)throw Error("qkv_hidden_sizes first element should be same as the second");if(o.dims[0]!==c+h+f)throw Error('Input "bias" dimension 0 should have same length as sum of Q/K/V hidden sizes');let g=0;if(s){if(h!==f)throw Error('Input "past" expect k_hidden_size == v_hidden_size');if(5!==s.dims.length)throw Error('Input "past" must have 5 dimensions');if(2!==s.dims[0])throw Error('Input "past" first dimension must be 2');if(s.dims[1]!==l)throw Error('Input "past" second dimension must be batch_size');if(s.dims[2]!==t.numHeads)throw Error('Input "past" third dimension must be num_heads');if(s.dims[4]!==h/t.numHeads)throw Error('Input "past" fifth dimension must be k_hidden_size / num_heads');t.pastPresentShareBuffer||(g=s.dims[3])}let b=m+g,y=-1,_=0;if(a)throw Error("Mask not supported");if(s)throw Error("past is not supported");if(u){if(4!==u.dims.length)throw Error('Input "attention_bias" must have 4 dimensions');if(u.dims[0]!==l||u.dims[1]!==t.numHeads||u.dims[2]!==d||u.dims[3]!==b)throw Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:l,sequenceLength:d,pastSequenceLength:g,kvSequenceLength:m,totalSequenceLength:b,maxSequenceLength:y,inputHiddenSize:p,hiddenSize:c,vHiddenSize:f,headSize:Math.floor(c/t.numHeads),vHeadSize:Math.floor(f/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:_,scale:t.scale,broadcastResPosBias:!1,passPastInKv:!1,qkvFormat:1}},Ic=(e,t,i)=>t&&e?`
      let total_sequence_length_input = u32(${t.getByOffset("0")});
      let present_sequence_length = max(total_sequence_length_input, uniforms.past_sequence_length);
      let is_subsequent_prompt: bool = sequence_length > 1 && sequence_length != total_sequence_length_input;
      let is_first_prompt: bool = is_subsequent_prompt == false && sequence_length == total_sequence_length_input;
      total_sequence_length = u32(${e?.getByOffset("batchIdx")}) + 1;
      var past_sequence_length: u32 = 0;
      if (is_first_prompt == false) {
        past_sequence_length = total_sequence_length - sequence_length;
      }
       `:`
    ${i?"let past_sequence_length = uniforms.past_sequence_length":""};
    let present_sequence_length = total_sequence_length;
    `,IP=(e,t,i,n,o,a,s,u)=>{let l=Ee(s?1:a),d=64,p=a/l;p<64&&(d=32);let c=[{type:12,data:t},{type:12,data:i},{type:12,data:n},{type:12,data:o},{type:12,data:p},{type:12,data:Math.ceil(a/l/d)}],h=Ve(e.dataType,l),f=it(1,l),m=["type"];s&&m.push("type"),u&&m.push("type");let g=t=>{let i=G("x",e.dataType,e.dims,l),n=[i],o=s?N("seq_lens",s.dataType,s.dims):void 0;o&&n.push(o);let a=u?N("total_sequence_length_input",u.dataType,u.dims):void 0;a&&n.push(a);let p=it(e.dataType),c=[{name:"batch_size",type:"u32"},{name:"num_heads",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"sequence_length",type:"u32"},{name:"total_sequence_length",type:"u32"},{name:"elements_per_thread",type:"u32"}];return`
  var<workgroup> thread_max: array<f32, ${d}>;
  var<workgroup> thread_sum: array<f32, ${d}>;
  ${t.registerUniforms(c).declareVariables(...n)}
  ${t.mainStart([d,1,1])}
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let sequence_length = uniforms.sequence_length;
    var total_sequence_length = uniforms.total_sequence_length;
    ${Ic(o,a,!1)}
    let local_offset = local_idx * uniforms.elements_per_thread;
    let offset = (global_idx / ${d}) * uniforms.total_sequence_length + local_offset;
    let seq_causal_length = ${s?"u32(past_sequence_length + workgroup_id.y + 1)":"total_sequence_length"};
    var thread_max_vector = ${f}(-3.402823e+38f);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      thread_max_vector = max(${f}(x[offset + i]), thread_max_vector);
    }
    thread_max[local_idx] = ${(()=>{switch(l){case 1:return"thread_max_vector";case 2:return"max(thread_max_vector.x, thread_max_vector.y)";case 4:return"max(max(thread_max_vector.x, thread_max_vector.y), max(thread_max_vector.z, thread_max_vector.w))";default:throw Error(`Unsupported components: ${l}`)}})()};
    workgroupBarrier();

    var max_value =  f32(-3.402823e+38f);
    for (var i = 0u; i < ${d}; i++) {
      max_value = max(thread_max[i], max_value);
    }

    var sum_vector = ${f}(0);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      sum_vector += exp(${f}(x[offset + i]) - max_value);
    }
    thread_sum[local_idx] = ${(()=>{switch(l){case 1:return"sum_vector";case 2:return"sum_vector.x + sum_vector.y";case 4:return"sum_vector.x + sum_vector.y + sum_vector.z + sum_vector.w";default:throw Error(`Unsupported components: ${l}`)}})()};
    workgroupBarrier();

    var sum: f32 = 0;
    for (var i = 0u; i < ${d}; i++) {
      sum += thread_sum[i];
    }

    if (sum == 0) {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        x[offset + i] = ${i.type.value}(${p}(1.0) / ${p}(seq_causal_length));
      }
    } else {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        var f32input = ${f}(x[offset + i]);
        x[offset + i] = ${i.type.value}(exp(f32input - max_value) / sum);
      }
    }
      ${s?`
        for (var total_seq_id: u32 = seq_causal_length; total_seq_id + local_offset < uniforms.total_sequence_length; total_seq_id++) {
          x[offset + total_seq_id] = ${i.type.value}(${p}(0));
        }`:""};
  }`};return{name:"AttentionProbsSoftmax",shaderCache:{hint:`${d};${h};${l}`,inputDependencies:m},getShaderSource:g,getRunData:()=>({outputs:[],dispatchGroup:{x:1,y:o,z:t*i},programUniforms:c})}},SP=(e,t,i,n,o,a,s,u,l)=>{let d=s+a.kvSequenceLength,p=[a.batchSize,a.numHeads,a.sequenceLength,d],c=e>1&&n,h=a.kvNumHeads?a.kvNumHeads:a.numHeads,f=c?[a.batchSize,h,d,a.headSize]:void 0,m=a.nReps?a.nReps:1,g=0===a.scale?1/Math.sqrt(a.headSize):a.scale,b=Ee(a.headSize),y=a.headSize/b,_=12,v={x:Math.ceil(d/12),y:Math.ceil(a.sequenceLength/_),z:a.batchSize*a.numHeads},x=[{type:12,data:a.sequenceLength},{type:12,data:y},{type:12,data:d},{type:12,data:a.numHeads},{type:12,data:a.headSize},{type:1,data:g},{type:12,data:s},{type:12,data:a.kvSequenceLength},{type:12,data:m}],w=c&&n&&C.size(n.dims)>0,$=["type","type"];w&&$.push("type"),o&&$.push("type"),u&&$.push("type"),l&&$.push("type");let T=[{dims:p,dataType:t.dataType,gpuDataType:0}];c&&T.push({dims:f,dataType:t.dataType,gpuDataType:0});let I=e=>{let a=N("q",t.dataType,t.dims,b),s=[a,N("key",i.dataType,i.dims,b)];if(w){let e=N("past_key",n.dataType,n.dims,b);s.push(e)}o&&s.push(N("attention_bias",o.dataType,o.dims));let d=u?N("seq_lens",u.dataType,u.dims):void 0;d&&s.push(d);let h=l?N("total_sequence_length_input",l.dataType,l.dims):void 0;h&&s.push(h);let g=G("output",t.dataType,p),y=[g];c&&y.push(G("present_key",t.dataType,f,b));let v=it(1,b),x=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"alpha",type:"f32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${_}u;

  var<workgroup> tileQ: array<${a.type.storage}, ${_*_}>;
  var<workgroup> tileK: array<${a.type.storage}, ${_*_}>;
  ${e.registerUniforms(x).declareVariables(...s,...y)}
  ${e.mainStart([_,_,1])}
    // x holds the N and y holds the M
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let kvHeadIdx = ${1===m?"headIdx":"headIdx / uniforms.n_reps"};
    let kv_num_heads = ${1===m?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let m = workgroup_id.y * TILE_SIZE;
    let n = workgroup_id.x * TILE_SIZE;
    let sequence_length = uniforms.M;
    var total_sequence_length = uniforms.N;
    ${Ic(d,h,!0)}
    let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx;
    let qOffset = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
    ${w&&c?"let pastKeyOffset = absKvHeadIdx * uniforms.past_sequence_length * uniforms.K;":""};
    let kOffset = absKvHeadIdx * uniforms.kv_sequence_length * uniforms.K;
    ${c?"let presentKeyOffset = absKvHeadIdx * uniforms.N * uniforms.K;":""}
    var value = ${v}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (global_id.y < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = q[qOffset + local_id.y * uniforms.K + w + local_id.x];
      }
      if (n + local_id.y < uniforms.N && w + local_id.x < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
      ${w&&c?`
              if (n + local_id.y < past_sequence_length) {
                tileK[idx] = past_key[pastKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
              } else if (n + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
                tileK[idx] = key[kOffset + (n + local_id.y - past_sequence_length) * uniforms.K + w + local_id.x];
              }`:`
          if (n + local_id.y < uniforms.kv_sequence_length) {
            tileK[idx] = key[kOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
          }`}
      ${c?`if (n + local_id.y < present_sequence_length) {
        present_key[presentKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x] = tileK[idx];
      }`:""}
      }
      workgroupBarrier();

      for (var k: u32 = 0u; k < TILE_SIZE && w+k < uniforms.K; k++) {
          value += ${v}(tileQ[TILE_SIZE * local_id.y + k] * tileK[TILE_SIZE * local_id.x + k]);
      }

      workgroupBarrier();
    }

    if (global_id.y < uniforms.M && global_id.x < total_sequence_length) {
      let headOffset = workgroup_id.z * uniforms.M * uniforms.N;
      let outputIdx = headOffset + global_id.y * uniforms.N + global_id.x;
      var sum: f32 = ${(()=>{switch(b){case 1:return"value";case 2:return"value.x + value.y";case 4:return"value.x + value.y + value.z + value.w";default:throw Error(`Unsupported components: ${b}`)}})()};
        output[outputIdx] = ${g.type.value} (sum * uniforms.alpha) + ${o?"attention_bias[outputIdx]":"0.0"};
    }
  }`};return{name:"AttentionProbs",shaderCache:{hint:`${b};${void 0!==o};${void 0!==n};${e}`,inputDependencies:$},getRunData:()=>({outputs:T,dispatchGroup:v,programUniforms:x}),getShaderSource:I}},$P=(e,t,i,n,o,a,s,u)=>{let l=a+o.kvSequenceLength,d=o.nReps?o.nReps:1,p=o.vHiddenSize*d,c=e>1&&n,h=o.kvNumHeads?o.kvNumHeads:o.numHeads,f=c?[o.batchSize,h,l,o.headSize]:void 0,m=[o.batchSize,o.sequenceLength,p],g=12,b={x:Math.ceil(o.vHeadSize/g),y:Math.ceil(o.sequenceLength/g),z:o.batchSize*o.numHeads},y=[{type:12,data:o.sequenceLength},{type:12,data:l},{type:12,data:o.vHeadSize},{type:12,data:o.numHeads},{type:12,data:o.headSize},{type:12,data:p},{type:12,data:a},{type:12,data:o.kvSequenceLength},{type:12,data:d}],_=c&&n&&C.size(n.dims)>0,v=["type","type"];_&&v.push("type"),s&&v.push("type"),u&&v.push("type");let x=[{dims:m,dataType:t.dataType,gpuDataType:0}];c&&x.push({dims:f,dataType:t.dataType,gpuDataType:0});let w=e=>{let o=N("probs",t.dataType,t.dims),a=[o,N("v",i.dataType,i.dims)];_&&a.push(N("past_value",n.dataType,n.dims));let l=s?N("seq_lens",s.dataType,s.dims):void 0;s&&a.push(l);let p=u?N("total_sequence_length_input",u.dataType,u.dims):void 0;u&&a.push(p);let h=[G("output",t.dataType,m)];c&&h.push(G("present_value",t.dataType,f));let b=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"v_hidden_size",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${g}u;
  var<workgroup> tileQ: array<${o.type.value}, ${g*g}>;
  var<workgroup> tileV: array<${o.type.value}, ${g*g}>;
  ${e.registerUniforms(b).declareVariables(...a,...h)}
  ${e.mainStart([g,g,1])}
   let headIdx = workgroup_id.z % uniforms.num_heads;
   let batchIdx = workgroup_id.z / uniforms.num_heads;
   let kvHeadIdx = ${1===d?"headIdx":"headIdx / uniforms.n_reps"};
   let kv_num_heads = ${1===d?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
   let m = global_id.y;
   let n = global_id.x;
   let sequence_length = uniforms.M;
   var total_sequence_length = uniforms.K;
   ${Ic(l,p,!0)}
   let offsetA = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
   let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx; // kvHeadIdx is relative to the batch
   ${_&&c?"let pastValueOffset = absKvHeadIdx * uniforms.N * uniforms.past_sequence_length + n;":""};
   let vOffset = absKvHeadIdx * uniforms.N * uniforms.kv_sequence_length + n;
   ${c?"let presentValueOffset = absKvHeadIdx * uniforms.N * uniforms.K + n;":""}
   var value = ${o.type.storage}(0);
   for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = probs[offsetA + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
        ${_&&c?`
        if (w + local_id.y < past_sequence_length) {
          tileV[idx] = past_value[pastValueOffset + (w + local_id.y) * uniforms.N];
        } else if (w + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
          tileV[idx] = v[vOffset + (w + local_id.y - past_sequence_length) * uniforms.N];
        }
      `:`
            if (w + local_id.y < uniforms.kv_sequence_length) {
              tileV[idx] = v[vOffset + (w + local_id.y) * uniforms.N];
            }`}
        ${c?`
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
  }`};return{name:"AttentionScore",shaderCache:{hint:`${void 0!==n};${e}`,inputDependencies:v},getRunData:()=>({outputs:x,dispatchGroup:b,programUniforms:y}),getShaderSource:w}},po=(e,t,i,n,o,a,s,u,l,d,p,c)=>{let h=Math.min(e.outputCount,1+ +!!s+ +!!u),f=h>1?d.pastSequenceLength:0,m=f+d.kvSequenceLength,g=l&&C.size(l.dims)>0?l:void 0,b=[t,i];h>1&&s&&C.size(s.dims)>0&&b.push(s),g&&b.push(g),p&&b.push(p),c&&b.push(c);let y=e.compute(SP(h,t,i,s,g,d,f,p,c),{inputs:b,outputs:h>1?[-1,1]:[-1]})[0];e.compute(IP(y,d.batchSize,d.numHeads,f,d.sequenceLength,m,p,c),{inputs:p&&c?[y,p,c]:[y],outputs:[]});let _=[y,n];h>1&&u&&C.size(u.dims)>0&&_.push(u),p&&_.push(p),c&&_.push(c),e.compute($P(h,y,n,u,d,f,p,c),{inputs:_,outputs:h>1?[0,2]:[0]})},AP=(e,t)=>{let i=[t.batchSize,t.numHeads,t.sequenceLength,t.headSize],n=t.sequenceLength,o=t.inputHiddenSize,a=t.headSize,s=12,u={x:Math.ceil(t.headSize/s),y:Math.ceil(t.sequenceLength/s),z:t.batchSize*t.numHeads},l=[e.inputs[0],e.inputs[1],e.inputs[2]],d=[{type:12,data:n},{type:12,data:o},{type:12,data:a},{type:12,data:t.numHeads},{type:12,data:t.headSize},{type:12,data:t.hiddenSize},{type:12,data:t.hiddenSize+t.hiddenSize+t.vHiddenSize}],p=e=>{let t=G("output_q",l[0].dataType,i),n=G("output_k",l[0].dataType,i),o=G("output_v",l[0].dataType,i),a=N("input",l[0].dataType,l[0].dims),u=N("weight",l[1].dataType,l[1].dims),d=N("bias",l[2].dataType,l[2].dims),p=a.type.storage,c=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"hidden_size",type:"u32"},{name:"ldb",type:"u32"}];return`
  const TILE_SIZE = ${s}u;
  var<workgroup> tileInput: array<${p}, ${s*s}>;
  var<workgroup> tileWeightQ: array<${p}, ${s*s}>;
  var<workgroup> tileWeightK: array<${p}, ${s*s}>;
  var<workgroup> tileWeightV: array<${p}, ${s*s}>;
  ${e.registerUniforms(c).declareVariables(a,u,d,t,n,o)}
  ${e.mainStart([s,s,1])}
    let batchIndex = workgroup_id.z / uniforms.num_heads;
    let headNumber = workgroup_id.z % uniforms.num_heads;
    let m = global_id.y;
    let n = global_id.x;

    let inputOffset = batchIndex * (uniforms.M * uniforms.K) + m * uniforms.K;
    let biasOffsetQ = headNumber * uniforms.head_size;
    let biasOffsetK = uniforms.hidden_size + biasOffsetQ;
    let biasOffsetV = uniforms.hidden_size + biasOffsetK;

    var valueQ = ${p}(0);
    var valueK = ${p}(0);
    var valueV = ${p}(0);
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
  }`};return e.compute({name:"AttentionPrepare",shaderCache:{inputDependencies:["type","type","type"]},getRunData:()=>({outputs:[{dims:i,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:i,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:i,dataType:e.inputs[0].dataType,gpuDataType:0}],dispatchGroup:u,programUniforms:d}),getShaderSource:p},{inputs:l,outputs:[-1,-1,-1]})},x_=(e,t)=>{let i=TP(e.inputs,t),[n,o,a]=AP(e,i);return po(e,n,o,a,e.inputs[4],void 0,void 0,void 0,e.inputs[5],i)}}),I_=k(()=>{"use strict";pt(),le(),ge(),Xe(),ye(),OP=(e,t)=>{if(!e||5!==e.length)throw Error("BatchNormalization requires 5 inputs");let i=(e,t,i)=>{let n=t.length;if(n!==e.length)throw Error(`${i}: num dimensions != ${n}`);t.forEach((t,n)=>{if(t!==e[n])throw Error(`${i}: dim[${n}] do not match`)})};if(e[0].dims.length>1){let n="NHWC"===t.format?t.spatial?e[0].dims.slice(-1):e[0].dims.slice(-1).concat(e[0].dims.slice(1,e[0].dims.length-1)):e[0].dims.slice(1,t.spatial?2:void 0);i(e[1].dims,n,"Invalid input scale"),i(e[2].dims,n,"Invalid input B"),i(e[3].dims,n,"Invalid input mean"),i(e[4].dims,n,"Invalid input var")}else i(e[1].dims,[1],"Invalid input scale"),i(e[2].dims,[1],"Invalid input B"),i(e[3].dims,[1],"Invalid input mean"),i(e[4].dims,[1],"Invalid input var")},PP=(e,t)=>{let{epsilon:i,spatial:n,format:o}=t,a=e[0].dims,s=n?Ee(a[a.length-1]):1,u="NHWC"===o&&a.length>1?s:1,l=C.size(a)/s,d=n,p=d?a.length:a,c=N("x",e[0].dataType,e[0].dims,s),h=N("scale",e[1].dataType,e[1].dims,u),f=N("bias",e[2].dataType,e[2].dims,u),m=N("inputMean",e[3].dataType,e[3].dims,u),g=N("inputVar",e[4].dataType,e[4].dims,u),b=G("y",e[0].dataType,p,s),y=()=>{let e="";if(n)e=`let cOffset = ${1===a.length?"0u":"NHWC"===o?`outputIndices[${a.length-1}] / ${s}`:"outputIndices[1]"};`;else if("NCHW"===o)e=`
            ${b.indicesSet("outputIndices","0","0")}
            let cOffset = ${b.indicesToOffset("outputIndices")};`;else{e=`var cIndices = ${h.type.indices}(0);
                       cIndices[0] = outputIndices[${a.length-1}];`;for(let t=1;t<h.rank;t++)e+=`cIndices[${t}] = outputIndices[${t}];`;e+=`let cOffset = ${h.indicesToOffset("cIndices")};`}return e},_=e=>`
  const epsilon = ${i};
  ${e.registerUniform("outputSize","u32").declareVariables(c,h,f,m,g,b)}
  ${e.mainStart()}
  ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
    var outputIndices = ${b.offsetToIndices(`global_idx * ${s}`)};
    ${y()}
    let scale = ${h.getByOffset("cOffset")};
    let bias = ${f.getByOffset("cOffset")};
    let inputMean = ${m.getByOffset("cOffset")};
    let inputVar = ${g.getByOffset("cOffset")};
    let x = ${c.getByOffset("global_idx")};
    let value = (x - inputMean) * inverseSqrt(inputVar + epsilon) * scale + bias;
    ${b.setByOffset("global_idx","value")}
  }`;return{name:"BatchNormalization",shaderCache:{hint:`${t.epsilon}_${t.format}_${n}_${s}`,inputDependencies:d?["rank","type","type","type","type"]:void 0},getShaderSource:_,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:d?[{type:12,data:l},...W(a)]:[{type:12,data:l}]})}},EP=e=>ce(e),T_=(e,t)=>{let{inputs:i,outputCount:n}=e,o=EP({...t,outputCount:n});if(me.webgpu.validateInputContent&&OP(i,o),t.trainingMode)throw Error("BatchNormalization trainingMode is not supported yet.");e.compute(PP(i,o))}}),$_=k(()=>{"use strict";ge(),ye(),CP=e=>{if(3!==e[0].dims.length)throw Error("input should have 3 dimensions");if(![320,640,1280].includes(e[0].dims[2]))throw Error("number of channels should be 320, 640 or 1280");if(1!==e[1].dims.length)throw Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw Error("last dimension of input and bias are not the same")},DP=e=>{let t=e[0].dims,i=e[0].dims[2],n=C.size(t)/4,o=e[0].dataType,a=N("input",o,t,4),s=N("bias",o,[i],4),u=N("residual",o,t,4),l=G("output",o,t,4);return{name:"BiasAdd",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(n/64)}}),getShaderSource:e=>`
  const channels = ${i}u / 4;
  ${e.declareVariables(a,s,u,l)}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes(n)}
    let value = ${a.getByOffset("global_idx")}
      + ${s.getByOffset("global_idx % channels")} + ${u.getByOffset("global_idx")};
    ${l.setByOffset("global_idx","value")}
  }`}},S_=e=>{CP(e.inputs),e.compute(DP(e.inputs))}}),Va=k(()=>{"use strict";le(),ge(),Xe(),ye(),kP=(e,t,i,n,o,a,s)=>{let u=Math.ceil(t/4),l="";l="string"==typeof o?`${o}(a)`:o("a");let d=N("inputData",i,[u],4),p=G("outputData",n,[u],4),c=[{name:"vec_size",type:"u32"}];return s&&c.push(...s),`
      ${e.registerUniforms(c).declareVariables(d,p)}

  ${a??""}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}

    let a = ${d.getByOffset("global_idx")};
    ${p.setByOffset("global_idx",l)}
  }`},Le=(e,t,i,n,o,a=e.dataType,s,u)=>{let l=[{type:12,data:Math.ceil(C.size(e.dims)/4)}];return s&&l.push(...s),{name:t,shaderCache:{hint:o,inputDependencies:["type"]},getShaderSource:t=>kP(t,C.size(e.dims),e.dataType,a,i,n,u),getRunData:t=>({outputs:[{dims:e.dims,dataType:a}],dispatchGroup:{x:Math.ceil(C.size(t[0].dims)/64/4)},programUniforms:l})}},A_=e=>{e.compute(Le(e.inputs[0],"Abs","abs"))},O_=e=>{e.compute(Le(e.inputs[0],"Acos","acos"))},P_=e=>{e.compute(Le(e.inputs[0],"Acosh","acosh"))},E_=e=>{e.compute(Le(e.inputs[0],"Asin","asin"))},C_=e=>{e.compute(Le(e.inputs[0],"Asinh","asinh"))},D_=e=>{e.compute(Le(e.inputs[0],"Atan","atan"))},k_=e=>{e.compute(Le(e.inputs[0],"Atanh","atanh"))},N_=e=>ce(e),L_=(e,t)=>{let i;switch(t.to){case 10:i="vec4<f16>";break;case 1:i="vec4<f32>";break;case 12:i="vec4<u32>";break;case 6:i="vec4<i32>";break;case 9:i="vec4<bool>";break;default:throw RangeError(`not supported type (specified in attribute 'to' from 'Cast' operator): ${t.to}`)}e.compute(Le(e.inputs[0],"Cast",i,void 0,t.cacheKey,t.to))},NP=e=>{let t,i,n=e.length>=2&&0!==e[1].data,o=e.length>=3&&0!==e[2].data;switch(e[0].dataType){case 1:t=n?e[1].getFloat32Array()[0]:-34028234663852886e22,i=o?e[2].getFloat32Array()[0]:34028234663852886e22;break;case 10:t=n?e[1].getUint16Array()[0]:64511,i=o?e[2].getUint16Array()[0]:31743;break;default:throw Error("Unsupport data type")}return ce({min:t,max:i})},R_=(e,t)=>{let i=t||NP(e.inputs),n=it(e.inputs[0].dataType);e.compute(Le(e.inputs[0],"Clip",e=>`clamp(${e}, vec4<${n}>(uniforms.min), vec4<${n}>(uniforms.max))`,void 0,i.cacheKey,void 0,[{type:e.inputs[0].dataType,data:i.min},{type:e.inputs[0].dataType,data:i.max}],[{name:"min",type:n},{name:"max",type:n}]),{inputs:[0]})},z_=e=>{e.compute(Le(e.inputs[0],"Ceil","ceil"))},M_=e=>{e.compute(Le(e.inputs[0],"Cos","cos"))},B_=e=>{e.compute(Le(e.inputs[0],"Cosh","cosh"))},Wo=e=>ce(e),F_=(e,t)=>{let i=it(e.inputs[0].dataType);e.compute(Le(e.inputs[0],"Elu",e=>`elu_vf32(${e})`,`
  const elu_alpha_ = ${i}(${t.alpha});

  fn elu_f32(a: ${i}) -> ${i} {
  return select((exp(a) - 1.0) * elu_alpha_, a, a >= 0.0);
  }

  fn elu_vf32(v: vec4<${i}>) -> vec4<${i}> {
  return vec4(elu_f32(v.x), elu_f32(v.y), elu_f32(v.z), elu_f32(v.w));
  }`,t.cacheKey))},Fa=(e="f32")=>`
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
}`,V_=e=>{let t=it(e.inputs[0].dataType);e.compute(Le(e.inputs[0],"Erf",e=>`erf_vf32(${e})`,Fa(t)))},G_=e=>{e.compute(Le(e.inputs[0],"Exp","exp"))},U_=e=>{e.compute(Le(e.inputs[0],"Floor","floor"))},W_=e=>{let t=it(e.inputs[0].dataType);e.compute(Le(e.inputs[0],"Gelu",e=>`0.5 * ${e} * (1.0 + erf_vf32(${e} * 0.7071067811865475))`,Fa(t)))},H_=(e,t)=>{let i=it(e.inputs[0].dataType);e.compute(Le(e.inputs[0],"LeakyRelu",e=>`select(leaky_relu_alpha_ * ${e}, ${e}, ${e} >= vec4<${i}>(0.0))`,`const leaky_relu_alpha_ = ${i}(${t.alpha});`,t.cacheKey))},j_=e=>{e.compute(Le(e.inputs[0],"Not",e=>`!${e}`))},q_=e=>{e.compute(Le(e.inputs[0],"Neg",e=>`-${e}`))},K_=e=>{e.compute(Le(e.inputs[0],"Reciprocal",e=>`1.0/${e}`))},X_=e=>{let t=it(e.inputs[0].dataType);e.compute(Le(e.inputs[0],"Relu",e=>`select(vec4<${t}>(0.0), ${e}, ${e} > vec4<${t}>(0.0))`))},Z_=e=>{e.compute(Le(e.inputs[0],"Sigmoid",e=>`(1.0 / (1.0 + exp(-${e})))`))},J_=e=>ce(e),Y_=(e,t)=>{let i=it(e.inputs[0].dataType);e.compute(Le(e.inputs[0],"HardSigmoid",e=>`max(vec4<${i}>(0.0), min(vec4<${i}>(1.0), ${t.alpha} * ${e} + vec4<${i}>(${t.beta})))`,void 0,t.cacheKey))},Q_=e=>{e.compute(Le(e.inputs[0],"Sin","sin"))},ev=e=>{e.compute(Le(e.inputs[0],"Sinh","sinh"))},tv=e=>{e.compute(Le(e.inputs[0],"Sqrt","sqrt"))},nv=e=>{e.compute(Le(e.inputs[0],"Tan","tan"))},rv=e=>`sign(${e}) * (1 - exp(-2 * abs(${e}))) / (1 + exp(-2 * abs(${e})))`,ov=e=>{e.compute(Le(e.inputs[0],"Tanh",rv))},Sc=(e="f32")=>`
const fast_gelu_a: ${e} = 0.5;
const fast_gelu_b: ${e} = 0.7978845608028654;
const fast_gelu_c: ${e} = 0.035677408136300125;

fn tanh_v(v: vec4<${e}>) -> vec4<${e}> {
  return ${rv("v")};
}
`,$c=e=>`(fast_gelu_a + fast_gelu_a * tanh_v(${e} * (fast_gelu_c * ${e} * ${e} + fast_gelu_b))) * ${e}`,iv=e=>{let t=it(e.inputs[0].dataType);e.compute(Le(e.inputs[0],"FastGelu",$c,Sc(t),void 0,e.inputs[0].dataType))},av=(e,t)=>{let i=it(e.inputs[0].dataType);return e.compute(Le(e.inputs[0],"ThresholdedRelu",e=>`select(vec4<${i}>(0.0), ${e}, ${e} > thresholded_relu_alpha_)`,`const thresholded_relu_alpha_ = vec4<${i}>(${t.alpha});`,t.cacheKey)),0},sv=e=>{e.compute(Le(e.inputs[0],"Log","log"))},LP=(e,t)=>`
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
`,RP=e=>`quick_gelu_impl(${e})`,uv=(e,t)=>{let i=it(e.inputs[0].dataType);e.compute(Le(e.inputs[0],"QuickGelu",RP,LP(i,t.alpha),t.cacheKey,e.inputs[0].dataType))}}),dv=k(()=>{"use strict";ge(),ye(),Va(),zP=e=>{if(3!==e[0].dims.length)throw Error("input should have 3 dimensions");if(![2560,5120,10240].includes(e[0].dims[2]))throw Error("hidden state should be 2560, 5120 or 10240");if(1!==e[1].dims.length)throw Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw Error("last dimension of input and bias are not the same")},MP=e=>{let t=e[0].dims.slice();t[2]=t[2]/2;let i=N("input",e[0].dataType,e[0].dims,4),n=N("bias",e[0].dataType,[e[0].dims[2]],4),o=G("output",e[0].dataType,t,4),a=C.size(t)/4,s=Ve(e[0].dataType);return{name:"BiasSplitGelu",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(a/64)}}),getShaderSource:t=>`
  const M_SQRT2 = sqrt(2.0);
  const halfChannels = ${e[0].dims[2]/4/2}u;

  ${t.declareVariables(i,n,o)}

  ${Fa(s)}

  ${t.mainStart()}
    ${t.guardAgainstOutOfBoundsWorkgroupSizes(a)}
    let biasIdx = global_idx % halfChannels;
    let batchIndex = global_idx / halfChannels;
    let inputOffset = biasIdx + batchIndex * halfChannels * 2;
    let valueLeft = input[inputOffset] + bias[biasIdx];
    let valueRight = input[inputOffset + halfChannels] + bias[biasIdx + halfChannels];
    let geluRight = valueRight * 0.5 * (erf_vf32(valueRight / M_SQRT2) + 1);

    ${o.setByOffset("global_idx","valueLeft * geluRight")}
  }`}},cv=e=>{zP(e.inputs),e.compute(MP(e.inputs))}}),xv=k(()=>{"use strict";le(),ge(),ye(),BP=(e,t,i,n,o,a,s,u,l,d,p,c)=>{let h,f;"string"==typeof u?h=f=(e,t)=>`${u}((${e}),(${t}))`:"function"==typeof u?h=f=u:(h=u.scalar,f=u.vector);let m=G("outputData",p,n.length,4),g=N("aData",l,t.length,4),b=N("bData",d,i.length,4),y;if(o)if(a){let e=1===C.size(t),n=1===C.size(i),o=t.length>0&&t[t.length-1]%4==0,a=i.length>0&&i[i.length-1]%4==0;y=e||n?m.setByOffset("global_idx",f(e?`${g.type.value}(${g.getByOffset("0")}.x)`:g.getByOffset("global_idx"),n?`${b.type.value}(${b.getByOffset("0")}.x)`:b.getByOffset("global_idx"))):`
            let outputIndices = ${m.offsetToIndices("global_idx * 4u")};
            let offsetA = ${g.broadcastedIndicesToOffset("outputIndices",m)};
            let offsetB = ${b.broadcastedIndicesToOffset("outputIndices",m)};
            ${m.setByOffset("global_idx",f(s||o?g.getByOffset("offsetA / 4u"):`${g.type.value}(${g.getByOffset("offsetA / 4u")}[offsetA % 4u])`,s||a?b.getByOffset("offsetB / 4u"):`${b.type.value}(${b.getByOffset("offsetB / 4u")}[offsetB % 4u])`))}
          `}else y=m.setByOffset("global_idx",f(g.getByOffset("global_idx"),b.getByOffset("global_idx")));else{if(!a)throw Error("no necessary to use scalar implementation for element-wise binary op implementation.");let e=(e,t,i="")=>{let n=`aData[indexA${t}][componentA${t}]`,o=`bData[indexB${t}][componentB${t}]`;return`
            let outputIndices${t} = ${m.offsetToIndices(`global_idx * 4u + ${t}u`)};
            let offsetA${t} = ${g.broadcastedIndicesToOffset(`outputIndices${t}`,m)};
            let offsetB${t} = ${b.broadcastedIndicesToOffset(`outputIndices${t}`,m)};
            let indexA${t} = offsetA${t} / 4u;
            let indexB${t} = offsetB${t} / 4u;
            let componentA${t} = offsetA${t} % 4u;
            let componentB${t} = offsetB${t} % 4u;
            ${e}[${t}] = ${i}(${h(n,o)});
          `};y=9===p?`
            var data = vec4<u32>(0);
            ${e("data",0,"u32")}
            ${e("data",1,"u32")}
            ${e("data",2,"u32")}
            ${e("data",3,"u32")}
            outputData[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:`
            ${e("outputData[global_idx]",0)}
            ${e("outputData[global_idx]",1)}
            ${e("outputData[global_idx]",2)}
            ${e("outputData[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(g,b,m)}

        ${c??""}

        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${y}
      }`},FP=(e,t,i,n,o,a,s=i.dataType)=>{let u=i.dims.map(e=>Number(e)??1),l=n.dims.map(e=>Number(e)??1),d=!C.areEqual(u,l),p=u,c=C.size(u),h=!1,f=!1,m=[d];if(d){let e=Fn.calcShape(u,l,!1);if(!e)throw Error("Can't perform binary op on the given tensors");p=e.slice(),c=C.size(p);let t=1===C.size(u),i=1===C.size(l),n=u.length>0&&u[u.length-1]%4==0,o=l.length>0&&l[l.length-1]%4==0;m.push(t),m.push(i),m.push(n),m.push(o);let a=1;for(let e=1;e<p.length;e++){let t=u[u.length-e];if(t===l[l.length-e])a*=t;else break}a%4==0?(f=!0,h=!0):(t||i||n||o)&&(h=!0)}else h=!0;return m.push(h),{name:e,shaderCache:{hint:t+m.map(e=>e.toString()).join("_"),inputDependencies:["rank","rank"]},getShaderSource:e=>BP(e,u,l,p,h,d,f,o,i.dataType,n.dataType,s,a),getRunData:()=>({outputs:[{dims:p,dataType:s}],dispatchGroup:{x:Math.ceil(c/64/4)},programUniforms:[{type:12,data:Math.ceil(C.size(p)/4)},...W(u,l,p)]})}},Hn=(e,t,i,n,o,a)=>{e.compute(FP(t,o??"",e.inputs[0],e.inputs[1],i,n,a))},pv=e=>{Hn(e,"Add",(e,t)=>`${e}+${t}`)},fv=e=>{Hn(e,"Div",(e,t)=>`${e}/${t}`)},hv=e=>{Hn(e,"Equal",{scalar:(e,t)=>`u32(${e}==${t})`,vector:(e,t)=>`vec4<u32>(${e}==${t})`},void 0,void 0,9)},mv=e=>{Hn(e,"Mul",(e,t)=>`${e}*${t}`)},gv=e=>{let t=N("input",e.inputs[0].dataType,e.inputs[0].dims).type.value;Hn(e,"Pow",{scalar:(e,t)=>`pow_custom(${e},${t})`,vector:(e,t)=>`pow_vector_custom(${e},${t})`},`
    fn pow_custom(a : ${t}, b : ${t}) -> ${t} {
      if (b == ${t}(0.0)) {
        return ${t}(1.0);
      } else if (a < ${t}(0.0) && f32(b) != floor(f32(b))) {
        return ${t}(pow(f32(a), f32(b))); // NaN
      }
      return select(sign(a), ${t}(1.0), round(f32(abs(b) % ${t}(2.0))) != 1.0) * ${t}(${"i32"===t?"round":""}(pow(f32(abs(a)), f32(b))));
    }
    fn pow_vector_custom(a : vec4<${t}>, b : vec4<${t}>) -> vec4<${t}> {
      // TODO: implement vectorized pow
      return vec4<${t}>(pow_custom(a.x, b.x), pow_custom(a.y, b.y), pow_custom(a.z, b.z), pow_custom(a.w, b.w));
    }
      `)},bv=e=>{Hn(e,"Sub",(e,t)=>`${e}-${t}`)},yv=e=>{Hn(e,"Greater",{scalar:(e,t)=>`u32(${e}>${t})`,vector:(e,t)=>`vec4<u32>(${e}>${t})`},void 0,void 0,9)},_v=e=>{Hn(e,"Less",{scalar:(e,t)=>`u32(${e}<${t})`,vector:(e,t)=>`vec4<u32>(${e}<${t})`},void 0,void 0,9)},vv=e=>{Hn(e,"GreaterOrEqual",{scalar:(e,t)=>`u32(${e}>=${t})`,vector:(e,t)=>`vec4<u32>(${e}>=${t})`},void 0,void 0,9)},wv=e=>{Hn(e,"LessOrEqual",{scalar:(e,t)=>`u32(${e}<=${t})`,vector:(e,t)=>`vec4<u32>(${e}<=${t})`},void 0,void 0,9)}}),Sv=k(()=>{"use strict";le(),ge(),Xe(),ye(),GP=(e,t)=>{if(!e||e.length<1)throw Error("too few inputs");let i=0,n=e[0],o=n.dataType,a=n.dims.length;e.forEach((e,s)=>{if(s!==i){if(e.dataType!==o)throw Error("input tensors should be one type");if(e.dims.length!==a)throw Error("input tensors should have the same shape");e.dims.forEach((e,i)=>{if(i!==t&&e!==n.dims[i])throw Error("non concat dimensions must match")})}})},UP=(e,t)=>`
  fn calculateInputIndex(index: u32) -> u32 {
    let sizeInConcatAxis = array<u32, ${e}u>(${t});
    for (var i: u32 = 0u; i < ${e}; i += 1u ) {
      if (index < sizeInConcatAxis[i]) {
        return i;
      }
    }
    return ${e}u;
  }`,WP=(e,t)=>{let i=e.length,n=[];for(let o=0;o<i;++o){let a=t.setByOffset("global_idx",e[o].getByIndices("indices"));1===i?n.push(a):0===o?n.push(`if (inputIndex == ${o}u) { ${a} }`):o===i-1?n.push(`else { ${a} }`):n.push(`else if (inputIndex == ${o}) { ${a} }`)}return n.join(`
`)},HP=(e,t,i,n)=>{let o=C.size(i),a=Array(e.length),s=Array(e.length),u=0,l=[],d=[],p=[{type:12,data:o}];for(let i=0;i<e.length;++i)u+=e[i].dims[t],a[i]=u,d.push(e[i].dims.length),s[i]=N(`input${i}`,n,d[i]),l.push("rank"),p.push({type:12,data:a[i]});for(let t=0;t<e.length;++t)p.push(...W(e[t].dims));p.push(...W(i));let c=G("output",n,i.length),h=c.indicesGet("indices",t),f=Array.from(Array(a.length).keys()).map(e=>`uniforms.sizeInConcatAxis${e}`).join(",");return{name:"Concat",shaderCache:{hint:`${t}`,inputDependencies:l},getRunData:()=>({outputs:[{dims:i,dataType:n}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:p}),getShaderSource:t=>`

  ${(()=>{t.registerUniform("outputSize","u32");for(let i=0;i<e.length;i++)t.registerUniform(`sizeInConcatAxis${i}`,"u32");return t.declareVariables(...s,c)})()}

  ${UP(a.length,f)}

  ${t.mainStart()}
    ${t.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

    var indices = ${c.offsetToIndices("global_idx")};

    let inputIndex = calculateInputIndex(${h});
    if (inputIndex != 0u) {
      let sizeInConcatAxis = array<u32, ${a.length}u>(${f});
      ${h} -= sizeInConcatAxis[inputIndex - 1u];
    }

    ${WP(s,c)}
  }`}},Tv=(e,t)=>{let i=e.inputs,n=i[0].dims,o=C.normalizeAxis(t.axis,n.length);GP(i,o);let a=n.slice();a[o]=i.reduce((e,t)=>e+(t.dims.length>o?t.dims[o]:0),0);let s=i.filter(e=>C.size(e.dims)>0);e.compute(HP(s,o,a,i[0].dataType),{inputs:s})},Iv=e=>ce({axis:e.axis})}),wr=k(()=>{"use strict";le(),ge(),Xt=(e,t,i="f32")=>{switch(e.activation){case"Relu":return`value = max(value, ${t}(0.0));`;case"Sigmoid":return`value = (${t}(1.0) / (${t}(1.0) + exp(-value)));`;case"Clip":return`value = clamp(value, ${t}(${i}(uniforms.clip_min)), ${t}(${i}(uniforms.clip_max)));`;case"HardSigmoid":return`value = max(${t}(0.0), min(${t}(1.0), ${i}(uniforms.alpha) * value + ${i}(uniforms.beta)));`;case"LeakyRelu":return`value = select(${i}(uniforms.alpha) * value, value, value >= ${t}(0.0));`;case"Tanh":return`let e2x = exp(-2.0 * abs(value));
              value = sign(value) * (1.0 - e2x) / (1.0 + e2x);
        `;case"":return"";default:throw Error(`Unsupported activation ${e.activation}`)}},Zt=(e,t)=>{"Clip"===e.activation?t.push({type:1,data:e.clipMax},{type:1,data:e.clipMin}):"HardSigmoid"===e.activation?t.push({type:1,data:e.alpha},{type:1,data:e.beta}):"LeakyRelu"===e.activation&&t.push({type:1,data:e.alpha})},Jt=(e,t)=>{"Clip"===e.activation?t.push({name:"clip_max",type:"f32"},{name:"clip_min",type:"f32"}):"HardSigmoid"===e.activation?t.push({name:"alpha",type:"f32"},{name:"beta",type:"f32"}):"LeakyRelu"===e.activation&&t.push({name:"alpha",type:"f32"})},Ga=e=>{let t=e?.activation||"";if("HardSigmoid"===t){let[i,n]=e?.activation_params||[.2,.5];return{activation:t,alpha:i,beta:n}}if("Clip"===t){let[i,n]=e?.activation_params||[Dy,ky];return{activation:t,clipMax:n,clipMin:i}}if("LeakyRelu"===t){let[i]=e?.activation_params||[.01];return{activation:t,alpha:i}}return{activation:t}}}),Ua=k(()=>{"use strict";rt=(e,t)=>{switch(e){case 1:return t;case 2:return`vec2<${t}>`;case 3:return`vec3<${t}>`;case 4:return`vec4<${t}>`;default:throw Error(`${e}-component is not supported.`)}},$v=e=>`
      ${e?"value = value + getBiasByOutputCoords(coords);":""}
      `}),Ov=k(()=>{"use strict";Av=e=>`
fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
      shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
}
fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
    i32(${e}.x), i32(${e}.y), i32(${e}.z), 1));
}
`}),Ha=k(()=>{"use strict";le(),ge(),ye(),wr(),Ho=(e,t,i,n,o)=>{let a=n-i;return`
      ${Array.from({length:i}).map((i,s)=>`
      if (${Q(t.shape,s,t.rank)} != 1) {
        ${t.indicesSet(e,s,Q(o,s+a,n))}
      } else {
        ${t.indicesSet(e,s,0)}
      }`).join("")}
`},Wa=(e,t,i,n,o=!1,a)=>{let s=e[0].dims,u=e[1].dims,l=s[s.length-2],d=u[u.length-1],p=s[s.length-1],c=Ee(d),h=Ee(p),f=Ee(l),m=C.size(i)/c/f,g=e.length>2,b=n?n.slice(0,-2):i.slice(0,-2),y=[C.size(b),l,d],_=[{type:12,data:m},{type:12,data:l},{type:12,data:d},{type:12,data:p}];Zt(t,_),_.push(...W(b,s,u)),g&&_.push(...W(e[2].dims)),_.push(...W(y));let v=n=>{let a=Ra("batch_dims",e[0].dataType,b.length),l=N("a",e[0].dataType,s.length,h),d=N("b",e[1].dataType,u.length,c),p=G("output",e[0].dataType,y.length,c),m=Ve(p.type.tensor),_=Xt(t,p.type.value,m),v=[l,d],x="";if(g){let t=o?c:1;v.push(N("bias",e[2].dataType,e[2].dims.length,t)),x=`${o?`value += bias[col / ${t}];`:`value += ${p.type.value}(bias[row + i]);`}`}let w=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"}];Jt(t,w);let $=()=>{let e=`var a_data: ${l.type.value};`;for(let t=0;t<h;t++)e+=`
              let b_data${t} = b[(b_offset + (k + ${t}) * uniforms.N + col) / ${c}];`;for(let t=0;t<f;t++){e+=`a_data = a[(a_offset + (row + ${t}) * uniforms.K + k) / ${h}];`;for(let i=0;i<h;i++)e+=`
            values[${t}] = fma(${d.type.value}(a_data${1===h?"":`[${i}]`}), b_data${i}, values[${t}]);
`}return e};return`
  ${n.registerUniforms(w).registerInternalVariables(a).declareVariables(...v,p)}
  ${n.mainStart()}
    ${n.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let col = (global_idx % (uniforms.N / ${c})) * ${c};
    var index1 = global_idx / (uniforms.N / ${c});
    let stride1 = uniforms.M / ${f};
    let row = (index1 % stride1) * ${f};
    let batch = index1 / stride1;

    ${2===i.length?"":`let batch_indices = ${a.offsetToIndices("batch")};`}

    var a_indices: ${l.type.indices};
    ${Ho("a_indices",l,l.rank-2,a.rank,"batch_indices")}
    ${l.indicesSet("a_indices",l.rank-2,0)}
    ${l.indicesSet("a_indices",l.rank-1,0)}
    let a_offset = ${l.indicesToOffset("a_indices")};

    var b_indices: ${d.type.indices};
    ${Ho("b_indices",d,d.rank-2,a.rank,"batch_indices")}
    ${d.indicesSet("b_indices",d.rank-2,0)}
    ${d.indicesSet("b_indices",d.rank-1,0)}
    let b_offset = ${d.indicesToOffset("b_indices")};
    var values: array<${p.type.value}, ${f}>;
    for (var k: u32 = 0u; k < uniforms.K; k = k + ${h}) {
      ${$()}
    }
    for (var i = 0u; i < ${f}u; i++) {
      var value = values[i];
      ${x}
      ${_}
      let cur_indices = ${p.type.indices}(batch, row + i, col);
      let offset = ${p.indicesToOffset("cur_indices")};
      ${p.setByOffset(`offset / ${c}`,"value")};
    }
  }
  `};return{name:"MatMulNaive",shaderCache:{hint:`${t.activation};${c};${h};${f};${o}`,inputDependencies:g?["rank","rank","rank"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:a?a(i):i,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:_}),getShaderSource:v}}}),ja=k(()=>{"use strict";le(),ge(),ye(),wr(),Ha(),Ua(),jP=(e,t)=>e?`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          kStart + inputRow,
          globalRowStart / innerElementSize + inputCol${t?", batchIndices":""});
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          globalRow + innerRow,
          kStart / innerElementSize + inputCol${t?", batchIndices":""});
        `,qP=(e,t)=>e?`
        let ACached0 = mm_Asub[k * innerElementSize][localRow];
        let ACached1 = mm_Asub[k * innerElementSize + 1][localRow];
        let ACached2 = mm_Asub[k * innerElementSize + 2][localRow];
        ${3===t?"":"let ACached3 = mm_Asub[k * innerElementSize + 3][localRow];"}
        for (var i = 0; i < rowPerThread; i = i + 1) {
          acc[i] = BCached0 * ACached0[i] + acc[i];
          acc[i] = BCached1 * ACached1[i] + acc[i];
          acc[i] = BCached2 * ACached2[i] + acc[i];
          ${3===t?"":"acc[i] = BCached3 * ACached3[i] + acc[i];"}
        }`:`
        for (var i = 0; i < rowPerThread; i = i + 1) {
          let ACached = mm_Asub[tileRow + i][k];
          acc[i] = BCached0 * ACached.x + acc[i];
          acc[i] = BCached1 * ACached.y + acc[i];
          acc[i] = BCached2 * ACached.z + acc[i];
          ${3===t?"":"acc[i] = BCached3 * ACached.w + acc[i];"}
        }`,Ac=(e,t,i="f32",n,o=!1,a=32,s=!1,u=32)=>{let l=t[1]*e[1],d=t[0]*e[0],p=o?l:a,c=o?a:l,h=p/t[0],f=a/t[1];if(!((o&&4===h&&4===e[1]||!o&&(3===h||4===h))&&p%t[0]==0&&a%t[1]==0&&4===e[0]))throw Error(`If transposeA ${o} is true, innerElementSize ${h} and workPerThread[1] ${e[1]} must be 4.
      Otherwise, innerElementSize ${h} must be 3 or 4.
  tileAWidth ${p} must be divisible by workgroupSize[0]${t[0]}. tileInner ${a} must be divisible by workgroupSize[1] ${t[1]}. colPerThread ${e[0]} must be 4.`);return`
var<workgroup> mm_Asub: array<array<vec${h}<${i}>, ${p/h}>, ${c}>;
var<workgroup> mm_Bsub: array<array<vec4<${i}>, ${d/e[0]}>, ${a}>;

const rowPerThread = ${e[1]};
const colPerThread = ${e[0]};
const innerElementSize = ${h};
const tileInner = ${a};

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
  ${n?`let batchIndices = ${n.offsetToIndices("u32(batch)")};`:""}
  let globalRowStart = i32(workgroupId.y) * ${l};

  let num_tiles = ${s?`${Math.ceil(u/a)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
  var kStart = ${s?`i32(globalId.z) * ${u}`:"0"};

  var acc: array<vec4<${i}>, rowPerThread>;

  // Loop over shared dimension.
  let tileRowB = localRow * ${f};
  for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let inputRow = tileRow + innerRow;
          let inputCol = tileCol;
          ${jP(o,n)}
      }

      // Load one tile of B into local memory.
      for (var innerRow = 0; innerRow < ${f}; innerRow = innerRow + 1) {
          let inputRow = tileRowB + innerRow;
          let inputCol = tileCol;
          mm_Bsub[inputRow][inputCol] = mm_readB(batch, kStart + inputRow, globalCol${n?", batchIndices":""});
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      for (var k = 0; k < tileInner / innerElementSize; k = k + 1) {
          let BCached0 = mm_Bsub[k * innerElementSize][tileCol];
          let BCached1 = mm_Bsub[k * innerElementSize + 1][tileCol];
          let BCached2 = mm_Bsub[k * innerElementSize + 2][tileCol];
          ${3===h?"":"let BCached3 = mm_Bsub[k * innerElementSize + 3][tileCol];"}

          ${qP(o,h)}
      }

      workgroupBarrier();
  }

  for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      mm_write(batch, globalRow + innerRow, globalCol, acc[innerRow]);
  }
}`},Pv=(e,t)=>e?`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              kStart + inputRow,
              globalRowStart + inputCol${t?", batchIndices":""});
            `:`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              globalRowStart + inputRow,
              kStart + inputCol${t?", batchIndices":""});
            `,KP=e=>e?"let ACached = mm_Asub[k][tileRow + innerRow];":"let ACached = mm_Asub[tileRow + innerRow][k];",Oc=(e,t,i="f32",n,o=!1,a=32,s=!1,u=32,l=!1)=>{let d=e[1]*t[1],p=e[0]*t[0],c=o?d:a,h=o?a:d;if(h%t[1]!=0||c%t[0]!=0||a%t[1]!=0)throw Error(`tileAHight ${h} must be divisible by workgroupSize[1]${t[1]}, tileAWidth ${c} must be divisible by workgroupSize[0]${t[0]}, tileInner ${a} must be divisible by workgroupSize[1]${t[1]}`);let f=h/t[1],m=c/t[0],g=a/t[1],b=l?`
    let localRow = i32(localId.y);
    let localCol = i32(localId.x);
    let globalRowStart = i32(workgroupId.y) * ${d};
    let globalColStart = i32(workgroupId.x) * ${p};

    // Loop over shared dimension.
    for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var inputRow = localRow; inputRow < ${h}; inputRow = inputRow + ${t[1]}) {
        for (var inputCol = localCol; inputCol < ${c}; inputCol = inputCol + ${t[0]}) {
          ${Pv(o,n)}
        }
      }
      // Load one tile of B into local memory.
      for (var inputRow = localRow; inputRow < ${a}; inputRow = inputRow + ${t[1]}) {
            for (var inputCol = localCol; inputCol < ${p}; inputCol = inputCol + ${t[0]}) {
          mm_Bsub[inputRow][inputCol] = mm_readB(batch,
            kStart + inputRow,
            globalColStart + inputCol${n?", batchIndices":""});
        }
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      var BCached : array<${i}, colPerThread>;
      for (var k = 0; k < tileInner; k = k + 1) {
        for (var inner = 0; inner < colPerThread; inner = inner + 1) {
          BCached[inner] = mm_Bsub[k][localCol + inner * ${t[0]}];
        }
        for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let ACached = ${o?`mm_Asub[k][localRow + innerRow * ${t[1]}];`:`mm_Asub[localRow + innerRow * ${t[1]}][k];`}
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
let globalRowStart = i32(workgroupId.y) * ${d};

let tileRowA = i32(localId.y) * ${f};
let tileColA = i32(localId.x) * ${m};
let tileRowB = i32(localId.y) * ${g};
// Loop over shared dimension.
for (var t = 0; t < num_tiles; t = t + 1) {
  // Load one tile of A into local memory.
  for (var innerRow = 0; innerRow < ${f}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < ${m}; innerCol = innerCol + 1) {
      let inputRow = tileRowA + innerRow;
      let inputCol = tileColA + innerCol;
      ${Pv(o,n)}
    }
  }

  // Load one tile of B into local memory.
  for (var innerRow = 0; innerRow < ${g}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
      let inputRow = tileRowB + innerRow;
      let inputCol = tileCol + innerCol;
      mm_Bsub[inputRow][inputCol] = mm_readB(batch,
        kStart + inputRow,
        globalCol + innerCol${n?", batchIndices":""});
    }
  }
  kStart = kStart + tileInner;
  workgroupBarrier();

  // Compute acc values for a single thread.
  var BCached : array<${i}, colPerThread>;
  for (var k = 0; k < tileInner; k = k + 1) {
    for (var inner = 0; inner < colPerThread; inner = inner + 1) {
      BCached[inner] = mm_Bsub[k][tileCol + inner];
    }

    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      ${KP(o)}
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
  var<workgroup> mm_Asub : array<array<${i}, ${c}>, ${h}>;
  var<workgroup> mm_Bsub : array<array<${i}, ${p}>, ${a}>;
  const rowPerThread = ${e[1]};
  const colPerThread = ${e[0]};
  const tileInner = ${a};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
    let batch = ${s?"0":"i32(globalId.z)"};
    ${n?`let batchIndices = ${n.offsetToIndices("u32(batch)")};`:""}
    let num_tiles = ${s?`${Math.ceil(u/a)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
    var kStart = ${s?`i32(globalId.z) * ${u}`:"0"};

    var acc : array<array<${i}, colPerThread>, rowPerThread>;
    ${b}
  }
`},XP=(e,t,i,n,o=!1)=>{let[a,s,u,l]=n,d=Ve(n[0].type.tensor);return`
    fn mm_readA(batch: i32, row: i32, colIn: i32, batchIndices: ${a.type.indices}) -> ${rt(e,d)} {
      var value = ${rt(e,d)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_a_outer && col < uniforms.dim_inner)
      {
        var aIndices: ${s.type.indices};
        ${Ho("aIndices",s,s.rank-2,a.rank,"batchIndices")}
        ${s.indicesSet("aIndices",s.rank-2,"u32(row)")}
        ${s.indicesSet("aIndices",s.rank-1,"u32(colIn)")}
        value = ${s.getByIndices("aIndices")};
      }
      return value;
    }

    fn mm_readB(batch: i32, row: i32, colIn: i32, batchIndices: ${a.type.indices}) -> ${rt(e,d)} {
      var value = ${rt(e,d)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_inner && col < uniforms.dim_b_outer)
      {
        var bIndices: ${u.type.indices};
        ${Ho("bIndices",u,u.rank-2,a.rank,"batchIndices")}
        ${u.indicesSet("bIndices",u.rank-2,"u32(row)")}
        ${u.indicesSet("bIndices",u.rank-1,"u32(colIn)")}
        value = ${u.getByIndices("bIndices")};
      }
      return value;
    }

    fn mm_write(batch: i32, row: i32, colIn: i32, valueIn: ${rt(e,d)}) {
      let col = colIn * ${e};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer) {
        var value = valueIn;
        let coords = vec3<i32>(batch, row, colIn);
        ${t?`value = value + ${o?"bias[colIn]":`${rt(e,d)}(bias[row])`};`:""}
        ${i}
        ${l.setByIndices("vec3<u32>(coords)","value")}
      }
    }
    `},jo=(e,t,i,n,o=!1,a)=>{let s=e[0].dims,u=e[1].dims,l=s.slice(0,-2),d=u.slice(0,-2),p=n?n.slice(0,-2):i.slice(0,-2),c=C.size(p),h=s[s.length-2],f=s[s.length-1],m=u[u.length-1],g=f%4==0&&m%4==0,b=h<=8?[4,1,1]:[4,4,1],y=[8,8,1],_=[Math.ceil(m/y[0]/b[0]),Math.ceil(h/y[1]/b[1]),Math.ceil(c/y[2]/b[2])],v=g?4:1,x=[...l,h,f/v],w=x.length,$=[...d,f,m/v],T=$.length,I=[c,h,m/v],S=[{type:6,data:h},{type:6,data:m},{type:6,data:f}];Zt(t,S),S.push(...W(p,x,$));let O=["rank","rank"],E=e.length>2;E&&(S.push(...W(e[2].dims)),O.push("rank")),S.push(...W(I));let A=i=>{let n=p.length,a=Ra("batchDims",e[0].dataType,n,1),s=Ve(e[0].dataType),u=N("a",e[0].dataType,w,v),l=N("b",e[1].dataType,T,v),d=G("result",e[0].dataType,I.length,v),c=[u,l];if(E){let t=o?v:1;c.push(N("bias",e[2].dataType,e[2].dims.length,t))}let h=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"}];Jt(t,h);let f=Ve(d.type.tensor),m=XP(v,E,Xt(t,d.type.value,f),[a,u,l,d],o);return`
  ${i.registerUniforms(h).registerInternalVariables(a).declareVariables(...c,d)}
  ${m}
  ${g?Ac(b,y,s,a):Oc(b,y,s,a)}
                   `};return{name:"MatMul",shaderCache:{hint:`${b};${t.activation};${g};${o}`,inputDependencies:O},getRunData:()=>({outputs:[{dims:a?a(i):i,dataType:e[0].dataType}],dispatchGroup:{x:_[0],y:_[1],z:_[2]},programUniforms:S}),getShaderSource:A}}}),Cv=k(()=>{"use strict";le(),Bn(),ye(),wr(),Ua(),Ov(),ja(),ZP=(e,t,i,n,o=!1,a,s=4,u=4,l=4,d="f32")=>{let p=e=>{switch(e){case 1:return"resData = x[xIndex];";case 3:return`resData = vec3<${d}>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);`;case 4:return"resData = x[xIndex / 4];";default:throw Error(`innerElementSize ${e} is not supported.`)}},c=e=>{switch(e){case 1:return"return w[row * i32(uniforms.w_shape[3]) + colIn];";case 4:return"return w[row * i32(uniforms.w_shape[3]) / 4 + colIn];";default:throw Error(`innerElementSize ${e} is not supported.`)}},h=e?`
    let coord = vec4<i32>(batch, xRow, xCol, xCh);
    `:`
    let coord = vec4<i32>(batch, xCh, xRow, xCol);
    `,f=e?`
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
    `,m=e?"i32(uniforms.x_shape[1])":"i32(uniforms.x_shape[2])",g=e?"i32(uniforms.x_shape[2])":"i32(uniforms.x_shape[3])",b=e?"row":"col",y=e?"col":"row",_=`
    let inChannels = i32(uniforms.w_shape[2]);
    let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
    let outRow = ${b} / outWidth;
    let outCol = ${b} % outWidth;

    let WRow = ${y} / (i32(uniforms.w_shape[1]) * inChannels);
    let WCol = ${y} / inChannels % i32(uniforms.w_shape[1]);
    let xRow = outRow * uniforms.stride[0] + uniforms.dilation[0] * WRow - uniforms.pad[0];
    let xCol = outCol * uniforms.stride[1] + uniforms.dilation[1] * WCol - uniforms.pad[1];
    let xCh = ${y} % inChannels;
    var resData = ${rt(s,d)}(0.0);
    // The bounds checking is always needed since we use it to pad zero for
    // the 'same' padding type.
    if (xRow >= 0 && xRow < ${m} && xCol >= 0 && xCol < ${g}) {
      ${h}
      let xIndex = getIndexFromCoords4D(coord, vec4<i32>(uniforms.x_shape));
      ${p(s)}
    }
    return resData;`,v=e?t&&n?`
    let col = colIn * ${s};
    ${_}`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_a_outer && col < uniforms.dim_inner) {
      ${_}
    }
    return ${rt(s,d)}(0.0);`:n&&i?`
    let col = colIn * ${s};
    ${_}`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${_}
    }
    return ${rt(s,d)}(0.0);`,x=e?n&&i?c(u):`
    let col = colIn * ${u};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${c(u)}
    }
    return ${rt(u,d)}(0.0);`:`
    let col = colIn * ${u};
    if (row < uniforms.dim_inner && col < uniforms.dim_a_outer) {
      ${c(u)}
    }
    return ${rt(u,d)}(0.0);`,w=rt(l,d),$=e?rt(s,d):rt(u,d),T=e?rt(u,d):rt(s,d),I=Xt(a,w,d);return`
    fn mm_readA(batch: i32, row : i32, colIn : i32) -> ${$} {
      ${e?v:x}
    }

    fn mm_readB(batch: i32, row : i32, colIn : i32) -> ${T} {
      ${e?x:v}
    }

    fn mm_write(batch: i32, row : i32, colIn : i32, valueIn : ${w}) {
      let col = colIn * ${l};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer)
      {
      var value = valueIn;
      let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
      ${f}
      ${$v(o)}
      ${I}
      setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
      }
    }`},Ev=(e,t,i,n,o,a,s,u,l)=>{let d="NHWC"===t.format,p=d?e[0].dims[3]:e[0].dims[1],c=i[0],h=d?i[2]:i[3],f=d?i[1]:i[2],m=d?i[3]:i[1],g=d&&(p%4==0||p%3==0)&&m%4==0,b=d?m:h*f,y=d?h*f:m,_=[8,8,1],v=n<=8?[4,1,1]:[4,4,1],x=[Math.ceil(b/_[0]/v[0]),Math.ceil(y/_[1]/v[1]),Math.ceil(c/_[2]/v[2])];_e("verbose",()=>`[conv2d_mm_webgpu] dispatch = ${x}`);let w=g?d&&p%4!=0?3:4:1,$=_[1]*v[1],T=_[0]*v[0],I=Math.max(_[0]*w,_[1]),S=n%$==0,O=o%T==0,E=a%I==0,A=g?[w,4,4]:[1,1,1],P=[{type:6,data:n},{type:6,data:o},{type:6,data:a},{type:6,data:[t.pads[0],t.pads[1]]},{type:6,data:t.strides},{type:6,data:t.dilations}];Zt(t,P),P.push(...W(e[0].dims,e[1].dims));let D=["rank","rank"];s&&(P.push(...W(e[2].dims)),D.push("rank")),P.push(...W(i));let z=n=>{let o=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"},{name:"pad",type:"i32",length:2},{name:"stride",type:"i32",length:2},{name:"dilation",type:"i32",length:2}];Jt(t,o);let a=g?4:1,l=Ve(e[0].dataType),p=`
      fn setOutputAtIndex(flatIndex : i32, value : ${g?`vec4<${l}>`:l}) {
        result[flatIndex] = ${g?`vec4<${l}>`:l}(value);
      }
      fn setOutputAtCoords(d0 : i32, d1 : i32, d2 : i32, d3 : i32, value : ${g?`vec4<${l}>`:l}) {
        let flatIndex = getOutputIndexFromCoords(vec4<i32>(d0, d1, d2, d3));
        setOutputAtIndex(flatIndex ${g?"/ 4":""}, value);
      }`,c=[N("x",e[0].dataType,e[0].dims.length,3===w?1:w),N("w",e[1].dataType,e[1].dims.length,a)],h=G("result",e[0].dataType,i.length,a);if(s){let t=N("bias",e[2].dataType,e[2].dims.length,a);c.push(t),p+=`
        fn getBiasByOutputCoords(coords : vec4<i32>) -> ${g?`vec4<${l}>`:l} {
          return bias[coords.${d?"w":"y"}${g?"/ 4":""}];
        }`}return`
        ${Av("uniforms.result_strides")}
        //struct Uniforms { xShape : vec4<i32>, wShape : vec4<i32>, outShape : vec4<i32>,
        //  outShapeStrides: vec3<i32>, filterDims : vec2<i32>, pad : vec2<i32>, stride : vec2<i32>,
        //  dilation : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32 };
        ${n.registerUniforms(o).declareVariables(...c,h)}
        ${p}
        ${ZP(d,S,O,E,s,t,A[0],A[1],A[2],l)}
        ${g?Ac(v,_,l,void 0,!d,I):Oc(v,_,l,void 0,!d,I,!1,void 0,u)}`};return{name:"Conv2DMatMul",shaderCache:{hint:`${t.cacheKey};${w};${g};${S};${O};${E};${$};${T};${I}`,inputDependencies:D},getRunData:()=>({outputs:[{dims:l?l(i):i,dataType:e[0].dataType}],dispatchGroup:{x:x[0],y:x[1],z:x[2]},programUniforms:P}),getShaderSource:z}}}),Rv=k(()=>{"use strict";le(),Bn(),ge(),ye(),wr(),Ua(),JP=e=>{let t=1;for(let i=0;i<e.length;i++)t*=e[i];return t},Dv=e=>"number"==typeof e?[e,e,e]:e,qa=(e,t)=>t<=1?e:e+(e-1)*(t-1),YP=(e,t,i,n=1)=>{let o=qa(t,n);return Math.floor((e[0]*(i-1)-i+o)/2)},kv=(e,t,i,n,o)=>{null==o&&(o=YP(e,t[0],n[0]));let a=[0,0,0,i];for(let i=0;i<3;i++)e[i]+2*o>=t[i]&&(a[i]=Math.trunc((e[i]-t[i]+2*o)/n[i]+1));return a},QP=(e,t,i,n,o,a,s,u,l,d)=>{let p,c,h,f;if("VALID"===e&&(e=0),"number"==typeof e){p={top:e,bottom:e,left:e,right:e,front:e,back:e};let m=kv([t,i,n,1],[u,l,d],1,[o,a,s],e);c=m[0],h=m[1],f=m[2]}else if(Array.isArray(e)){if(!e.every((e,t,i)=>e===i[0]))throw Error(`Unsupported padding parameter: ${e}`);p={top:e[0],bottom:e[1],left:e[2],right:e[3],front:e[4],back:e[5]};let m=kv([t,i,n,1],[u,l,d],1,[o,a,s],e[0]);c=m[0],h=m[1],f=m[2]}else if("SAME_UPPER"===e){c=Math.ceil(t/o),h=Math.ceil(i/a),f=Math.ceil(n/s);let e=(c-1)*o+u-t,m=(h-1)*a+l-i,g=(f-1)*s+d-n,b=Math.floor(e/2),y=e-b,_=Math.floor(m/2),v=m-_,x=Math.floor(g/2),w=g-x;p={top:_,bottom:v,left:x,right:w,front:b,back:y}}else throw Error(`Unknown padding parameter: ${e}`);return{padInfo:p,outDepth:c,outHeight:h,outWidth:f}},Nv=(e,t,i,n,o,a=!1,s="channelsLast")=>{let u,l,d,p,c;if("channelsLast"===s)[u,l,d,p,c]=e;else if("channelsFirst"===s)[u,c,l,d,p]=e;else throw Error(`Unknown dataFormat ${s}`);let[h,,f,m,g]=t,[b,y,_]=Dv(i),[v,x,w]=Dv(n),$=qa(f,v),T=qa(m,x),I=qa(g,w),{padInfo:S,outDepth:O,outHeight:E,outWidth:A}=QP(o,l,d,p,b,y,_,$,T,I),P=a?h*c:h,D=[0,0,0,0,0];return"channelsFirst"===s?D=[u,P,O,E,A]:"channelsLast"===s&&(D=[u,O,E,A,P]),{batchSize:u,dataFormat:s,inDepth:l,inHeight:d,inWidth:p,inChannels:c,outDepth:O,outHeight:E,outWidth:A,outChannels:P,padInfo:S,strideDepth:b,strideHeight:y,strideWidth:_,filterDepth:f,filterHeight:m,filterWidth:g,effectiveFilterDepth:$,effectiveFilterHeight:T,effectiveFilterWidth:I,dilationDepth:v,dilationHeight:x,dilationWidth:w,inShape:e,outShape:D,filterShape:t}},Lv=(e,t,i,n,o,a)=>{let s="channelsLast"===a,u=s?e[0].dims[3]:e[0].dims[1],l=!1,d=[64,1,1],p=[Math.ceil(JP(({x:i.map((e,t)=>t)}).x.map(e=>i[e]))/d[0]),1,1];_e("verbose",()=>`[conv3d_naive_webgpu] dispatch = ${p}`);let c=l?s&&u%4!=0?3:4:1,h=[{type:12,data:C.size(i)},{type:12,data:n},{type:12,data:o},{type:12,data:t.strides},{type:12,data:t.dilations}];Zt(t,h),h.push(...W(e[0].dims,e[1].dims));let f=["rank","rank"],m=3===e.length;m&&(h.push(...W(e[2].dims)),f.push("rank")),h.push(...W(i));let g=a=>{let u=[{name:"output_size",type:"u32"},{name:"filter_dims",type:"u32",length:n.length},{name:"pads",type:"u32",length:o.length},{name:"strides",type:"u32",length:t.strides.length},{name:"dilations",type:"u32",length:t.dilations.length}];Jt(t,u);let d=l?4:1,p=Ve(e[0].dataType),h=N("x",e[0].dataType,e[0].dims.length,3===c?1:c),f=N("W",e[1].dataType,e[1].dims.length,d),g=[h,f],b=G("result",e[0].dataType,i.length,d),y="";if(m){let t=N("bias",e[2].dataType,e[2].dims.length,d);g.push(t),y+=`
        fn getBiasByOutputCoords(coords : array<u32, 5>) -> ${l?`vec4<${p}>`:p} {
          return bias[${s?Q("coords",4,5):Q("coords",1,5)}${l?"/ 4":""}];
        }`}let _=rt(c,p),v=Xt(t,_,p);return`
            ${y}
            fn getX(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${h.getByIndices("aIndices")};
            }
            fn getW(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${f.getByIndices("aIndices")};
            }
          ${a.registerUniforms(u).declareVariables(...g,b)}
          ${a.mainStart()}
          ${a.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
              let coords = ${b.offsetToIndices("global_idx")};
              let batch = ${Q("coords",0,h.rank)};
              let d2 = ${s?Q("coords",h.rank-1,h.rank):Q("coords",1,h.rank)};
              let xFRCCorner = vec3<u32>(${s?Q("coords",1,h.rank):Q("coords",2,h.rank)},
              ${s?Q("coords",2,h.rank):Q("coords",3,h.rank)},
              ${s?Q("coords",3,h.rank):Q("coords",4,h.rank)}) * uniforms.strides - uniforms.pads;
              let xFCorner = xFRCCorner.x;
              let xRCorner = xFRCCorner.y;
              let xCCorner = xFRCCorner.z;
              let xShapeY = ${s?Q("uniforms.x_shape",1,h.rank):Q("uniforms.x_shape",2,h.rank)};
              let xShapeZ = ${s?Q("uniforms.x_shape",2,h.rank):Q("uniforms.x_shape",3,h.rank)};
              let xShapeW = ${s?Q("uniforms.x_shape",3,h.rank):Q("uniforms.x_shape",4,h.rank)};
              let xShapeU = ${s?Q("uniforms.x_shape",4,h.rank):Q("uniforms.x_shape",1,h.rank)};
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
              ${m?"value = value + getBiasByOutputCoords(coords)":""};
              ${v}
              result[global_idx] = f32(value);
          }`};return{name:"Conv3DNaive",shaderCache:{hint:`${t.cacheKey};${s};${c};${m}`,inputDependencies:f},getRunData:()=>({outputs:[{dims:i,dataType:e[0].dataType}],dispatchGroup:{x:p[0],y:p[1],z:p[2]},programUniforms:h}),getShaderSource:g}}}),Bv=k(()=>{"use strict";le(),ge(),ye(),wr(),zv=(e,t,i,n)=>{let o=e.length>2,a=o?"value += b[output_channel];":"",s=e[0].dims,u=e[1].dims,l="NHWC"===t.format,d=l?i[3]:i[1],p=d/t.group,c=l&&p>=4?Ee(d):1,h=C.size(i)/c,f=[{type:12,data:h},{type:12,data:t.dilations},{type:12,data:[t.strides[0],t.strides[1]]},{type:12,data:[t.pads[0],t.pads[1]]},{type:12,data:p}];Zt(t,f),f.push(...W(s,[u[0],u[1],u[2],u[3]/c]));let m=o?["rank","rank","rank"]:["rank","rank"];f.push(...W([i[0],i[1],i[2],i[3]/c]));let g=n=>{let d=G("output",e[0].dataType,i.length,c),p=Ve(d.type.tensor),h=Xt(t,d.type.value,p),f=N("x",e[0].dataType,s.length),m=N("w",e[1].dataType,u.length,c),g=[f,m];o&&g.push(N("b",e[2].dataType,e[2].dims,c));let b=[{name:"output_size",type:"u32"},{name:"dilations",type:"u32",length:t.dilations.length},{name:"strides",type:"u32",length:2},{name:"pads",type:"u32",length:2},{name:"output_channels_per_group",type:"u32"}];Jt(t,b);let y=l?`
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
            let xVal = ${f.get("batch","xHeight","xWidth","input_channel")};
            let wVal = ${m.get("wHeight","wWidth","wInChannel","output_channel")};
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

            let xVal = ${f.get("batch","input_channel","xHeight","xWidth")};
            let wVal = ${m.get("output_channel","wInChannel","wHeight","wWidth")};
            value += xVal * wVal;
          }
        }
      }
      `;return`
  ${n.registerUniforms(b).declareVariables(...g,d)}

  ${n.mainStart()}
    ${n.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let outputIndices = ${d.offsetToIndices("global_idx")};
    let batch: u32 = outputIndices[0];
    let output_channel: u32 = outputIndices[${l?3:1}];
    let xRCCorner: vec2<u32> = vec2<u32>(outputIndices[${l?1:2}], outputIndices[${l?2:3}]) * uniforms.strides - uniforms.pads;
    let group_id: u32 = output_channel * ${c} / uniforms.output_channels_per_group;
    var in_channel_offset = group_id * uniforms.w_shape[${l?2:1}];

    var value: ${d.type.value} = ${d.type.value}(0);
    ${y}
    ${a}
    ${h}
    ${d.setByOffset("global_idx","value")}
  }`};return{name:"GroupedConv",shaderCache:{hint:`${t.cacheKey}_${c}`,inputDependencies:m},getRunData:()=>({outputs:[{dims:n?n(i):i,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:f}),getShaderSource:g}},Mv=(e,t,i,n)=>{let o=e.length>2,a=Ee(i[3]),s=Ee(i[2]),u=C.size(i)/a/s,l=[e[0].dims[0],e[0].dims[1],e[0].dims[2],e[0].dims[3]/a],d=[e[1].dims[0],e[1].dims[1],e[1].dims[2],e[1].dims[3]/a],p=[i[0],i[1],i[2],i[3]/a],c=[{type:12,data:u},{type:6,data:[t.strides[0],t.strides[1]]},{type:6,data:[t.pads[0],t.pads[1]]}];Zt(t,c),c.push(...W(l,d,p));let h=(s-1)*t.strides[1]+d[1],f=i=>{let n=G("output",e[0].dataType,p.length,a),u=Ve(n.type.tensor),c=Xt(t,n.type.value,u),f=N("x",e[0].dataType,l.length,a),m=N("w",e[1].dataType,d.length,a),g=[f,m];o&&g.push(N("b",e[2].dataType,e[2].dims,a));let b=o?"value += b[output_channel];":"",y=[{name:"output_size",type:"u32"},{name:"strides",type:"i32",length:2},{name:"pads",type:"i32",length:2}];return Jt(t,y),`
  ${i.registerUniforms(y).declareVariables(...g,n)}
  ${i.mainStart()}
    ${i.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let width0 = uniforms.output_shape[3];
    let output_channel = global_idx % width0;
    var index1 = global_idx / width0;
    let width1 = uniforms.output_shape[2] / ${s}u;
    let col = (index1 % width1) * ${s}u;
    index1 = index1 / width1;
    let row = index1 % uniforms.output_shape[1];
    let batch = index1 / uniforms.output_shape[1];

    let x_corner = vec2<i32>(i32(row), i32(col)) * uniforms.strides - uniforms.pads;

    var x_vals: array<${f.type.value}, ${h}>;
    var values: array<${n.type.value}, ${s}>;
    let input_channel = output_channel;
    // Use constant instead of uniform can give better performance for w's height/width.
    for (var w_height: u32 = 0u; w_height < ${d[0]}; w_height++) {
      let x_height = x_corner.x + i32(w_height);
      if (x_height >= 0 && u32(x_height) < uniforms.x_shape[1]) {
        for (var i = 0; i < ${h}; i++) {
          let x_width = x_corner.y + i;
          if (x_width >= 0 && u32(x_width) < uniforms.x_shape[2]) {
            x_vals[i] = ${f.get("batch","u32(x_height)","u32(x_width)","input_channel")};
          } else {
            x_vals[i] = ${f.type.value}(0);
          }
        }
        for (var w_width: u32 = 0u; w_width < ${d[1]}; w_width++) {
          let w_val = ${m.get("w_height","w_width","0","output_channel")};
          for (var i = 0u; i < ${s}u; i++) {
            values[i] = fma(x_vals[i * u32(uniforms.strides[1]) + w_width], w_val, values[i]);
          }
        }
      }
    }

    for (var i = 0u; i < ${s}u; i++) {
      var value = values[i];
      ${b}
      ${c}
      ${n.set("batch","row","col + i","output_channel","value")};
    }
  }`};return{name:"GroupedConv-Vectorize",shaderCache:{hint:`${t.cacheKey};${a};${s};${h};${d[0]};${d[1]}`,inputDependencies:o?["rank","rank","type"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:n?n(i):i,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:c}),getShaderSource:f}}}),Vv=k(()=>{"use strict";ge(),Cv(),Rv(),ja(),Bv(),wr(),Ha(),Yn(),e3=(e,t,i,n,o,a)=>{let s=e[0],u=e.slice(a?1:2,a?3:4),l=u.length,d=t[0],p=t.slice(2).map((e,t)=>e+(e-1)*(i[t]-1)),c=u.map((e,t)=>e+n[t]+n[t+l]).map((e,t)=>Math.floor((e-p[t]+o[t])/o[t]));return c.splice(0,0,s),c.splice(a?3:1,0,d),c},Pc=[2,3,1,0],t3=(e,t)=>{if(!e||2!==e.length&&3!==e.length)throw Error("Conv requires 2 or 3 inputs");if(e[0].dims.length>5)throw Error("greater than 5D is not supported");if(e[0].dims.length!==e[1].dims.length)throw Error("filter does not have same dimension as input");if(e[0].dims["NHWC"===t.format?e[0].dims.length-1:1]!==e[1].dims[1]*t.group)throw Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");if(3===e.length&&(1!==e[2].dims.length||e[1].dims[0]!==e[2].dims[0]))throw Error("invalid bias");let i=e[0].dims.length-2;if(t.dilations.length!==i)throw Error(`dilations should be ${i}D`);if(t.strides.length!==i)throw Error(`strides should be ${i}D`);if(t.pads.length!==2*i)throw Error(`pads should be ${2*i}D`);if(0!==t.kernelShape.length&&t.kernelShape.length!==e[1].dims.length-2)throw Error("invalid kernel shape")},Ec=(e,t)=>{let i=e.kernelShape.slice();i.length<t[1].dims.length-2&&i.push(...Array(t[1].dims.length-2-i.length).fill(0));for(let e=2;e<t[1].dims.length;++e)0===i[e-2]&&(i[e-2]=t[1].dims[e]);let n=e.pads.slice();Ur.adjustPadsBasedOnAutoPad(t[0].dims,e.strides,e.dilations,i,n,"NHWC"===e.format,e.autoPad);let o=Object.assign({},e);return Object.assign(o,{kernelShape:i,pads:n}),o},Cc=e=>{let t=Ga(e),i=e.format;return{autoPad:["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],format:i,dilations:e.dilations,group:e.group,kernelShape:e.kernel_shape,pads:e.pads,strides:e.strides,wIsConst:e.w_is_const(),...t,cacheKey:`${e.format};${t.activation};`}},Fv=(e,t,i,n)=>{let o="NHWC"===i.format,a=e3(t[0].dims,t[1].dims,i.dilations,i.pads,i.strides,o);if(1!==i.group){let s=[t[0]];if(o){let n=e.kernelCustomData.wT??e.compute(at(t[1],Pc),{inputs:[1],outputs:[i.wIsConst?-2:-1]})[0];i.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=n),s.push(n)}else s.push(t[1]);3===t.length&&s.push(t[2]),!e.adapterInfo.isArchitecture("ampere")&&o&&t[1].dims[0]===i.group&&1===t[1].dims[1]&&1===i.dilations[0]&&1===i.dilations[1]?e.compute(Mv(s,i,a,n),{inputs:s}):e.compute(zv(s,i,a,n),{inputs:s});return}let s=3===t.length,u=t[0].dims[o?1:2],l=t[0].dims[o?2:3],d=t[0].dims[o?3:1],p=t[1].dims[2],c=t[1].dims[3],h=a[o?1:2],f=a[o?2:3],m=a[o?3:1],g=o&&p===u&&c===l&&0===i.pads[0]&&0===i.pads[1];if(g||1===p&&1===c&&1===i.dilations[0]&&1===i.dilations[1]&&1===i.strides[0]&&1===i.strides[1]&&0===i.pads[0]&&0===i.pads[1]){let p=a[0],c,b,y,_=[];if(o){let n=e.kernelCustomData.wT??e.compute(at(t[1],Pc),{inputs:[1],outputs:[i.wIsConst?-2:-1]})[0];if(i.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=n),g){let e=u*l*d;c=t[0].reshape([1,p,e]),b=n.reshape([1,e,m]),y=[1,p,m]}else c=t[0].reshape([p,u*l,d]),b=n.reshape([1,d,m]),y=[p,h*f,m];_.push(c),_.push(b)}else c=t[0].reshape([p,d,u*l]),b=t[1].reshape([1,m,d]),y=[p,m,h*f],_.push(b),_.push(c);s&&_.push(t[2]);let v=y[2],x=_[0].dims[_[0].dims.length-1];v<8&&x<8?e.compute(Wa(_,i,a,y,o,n),{inputs:_}):e.compute(jo(_,i,a,y,o,n),{inputs:_});return}let b=!0,y=e.kernelCustomData.wT??e.compute(at(t[1],Pc),{inputs:[1],outputs:[i.wIsConst?-2:-1]})[0];i.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=y);let _=[t[0],y];s&&_.push(t[2]);let v=o?h*f:m,x=o?m:h*f,w=p*c*d;e.compute(Ev(_,i,a,v,x,w,s,b,n),{inputs:_})},n3=(e,t)=>{let i="NHWC"===t.format,n=[e.inputs[0].reshape(i?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];3===e.inputs.length&&n.push(e.inputs[2]);let o=[0,t.pads[0],0,t.pads[1]],a=[1].concat(t.strides),s=[1].concat(t.dilations),u=[1].concat(t.kernelShape),l=Ec({...t,pads:o,strides:a,dilations:s,kernelShape:u},n);Fv(e,n,l,e=>i?[e[0],e[2],e[3]]:[e[0],e[1],e[3]])},r3=(e,t,i)=>{let n="NHWC"===i.format?"channelsLast":"channelsFirst",o=Ec(i,t),a="NOTSET"===i.autoPad?i.pads:i.autoPad,s=Nv(t[0].dims,t[1].dims,i.strides,i.dilations,a,!1,n);e.compute(Lv(t,o,s.outShape,[s.filterDepth,s.filterHeight,s.filterWidth],[s.padInfo.front,s.padInfo.top,s.padInfo.left],n))},Dc=(e,t)=>{if(t3(e.inputs,t),3===e.inputs[0].dims.length)n3(e,t);else if(5===e.inputs[0].dims.length)r3(e,e.inputs,t);else{let i=Ec(t,e.inputs);Fv(e,e.inputs,i)}}}),Uv=k(()=>{"use strict";le(),Bn(),ge(),ye(),Gv=(e,t,i)=>{let n=e.length>2,o=t.outputShape,a="NHWC"===t.format,s=t.group,u=e[1].dims,l=u[2]/s,d=u[3],p=a?Ee(l):1,c=a&&1===d&&l>=4,h=c?4*Math.floor(l/4):Math.floor(l/p)*p,f=l-h,m=a?Ee(d):1,g=a?1===d?p:m:1,b=C.size(o)/m,y=[Math.ceil(b/64),1,1];_e("verbose",()=>`[conv2d_backprop_webgpu] dispatch = ${y}`);let _=["rank","rank"],v=[t.strides[0],t.strides[1]],x=[t.kernelShape[a?1:2],t.kernelShape[a?2:3]],w=[t.dilations[0],t.dilations[1]],$=[x[0]+(t.dilations[0]<=1?0:(t.kernelShape[a?1:2]-1)*(t.dilations[0]-1)),x[1]+(t.dilations[1]<=1?0:(t.kernelShape[a?2:3]-1)*(t.dilations[1]-1))],T=[$[0]-1-Math.floor((t.pads[0]+t.pads[2])/2),$[1]-1-Math.floor((t.pads[1]+t.pads[3])/2)],I=[{type:12,data:b},{type:12,data:v},{type:12,data:x},{type:12,data:w},{type:12,data:$},{type:6,data:T},{type:12,data:h},{type:12,data:l},{type:12,data:d},...W(e[0].dims,e[1].dims)];n&&(I.push(...W(e[2].dims)),_.push("rank")),I.push(...W(o));let S=t=>{let i=[{name:"output_size",type:"u32"},{name:"strides",type:"u32",length:v.length},{name:"filter_dims",type:"u32",length:x.length},{name:"dilations",type:"u32",length:x.length},{name:"effective_filter_dims",type:"u32",length:$.length},{name:"pads",type:"i32",length:T.length},{name:"input_channels_per_group_int",type:"u32"},{name:"input_channels_per_group",type:"u32"},{name:"output_channels_per_group",type:"u32"}],s=Ve(e[0].dataType),u=a?1:2,l=a?2:3,d=a?3:1,h=N("W",e[1].dataType,e[1].dims.length,g),b=N("Dy",e[0].dataType,e[0].dims.length,p),y=[b,h];n&&y.push(N("bias",e[2].dataType,[o[d]].length,m));let _=G("result",e[0].dataType,o.length,m),w=()=>{let e="";if(c)4===p?e+=`
        let xValue = ${b.getByOffset("x_offset")};
        let wValue = ${h.getByOffset("w_offset")};
        dotProd = dotProd + dot(xValue, wValue);
        x_offset += 1u;
        w_offset += 1u;`:2===p?e+=`
          dotProd = dotProd + dot(vec4<${s}>(${b.getByOffset("x_offset")}, ${b.getByOffset("x_offset + 1u")}), vec4<${s}>(${h.getByOffset("w_offset")}, ${h.getByOffset("w_offset + 1u")}));
          x_offset += 2u;
          w_offset += 2u;`:1===p&&(e+=`
          dotProd = dotProd + dot(vec4<${s}>(${b.getByOffset("x_offset")}, ${b.getByOffset("x_offset + 1u")}, ${b.getByOffset("x_offset + 2u")}, ${b.getByOffset("x_offset + 3u")}), vec4<${s}>(${h.getByOffset("w_offset")}, ${h.getByOffset("w_offset + 1u")}, ${h.getByOffset("w_offset + 2u")}, ${h.getByOffset("w_offset + 3u")}));
          x_offset += 4u;
          w_offset += 4u;`);else if(e+=`
                  let xValue = ${a?b.getByOffset(`${b.indicesToOffset(`${b.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${p}`):b.get("batch","inputChannel","idyR","idyC")};
        `,1===p)e+=`
          let w_offset = ${h.indicesToOffset(`${h.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel, wOutChannel)`)};
          let wValue = ${h.getByOffset(`w_offset / ${g}`)};
          dotProd = dotProd + xValue * wValue;`;else for(let t=0;t<p;t++)e+=`
            let wValue${t} = ${h.getByOffset(`${h.indicesToOffset(`${h.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel + ${t}, wOutChannel)`)} / ${g}`)};
            dotProd = dotProd + xValue[${t}] * wValue${t};`;return e},I=()=>{if(0===f)return"";if(!c)throw Error(`packInputAs4 ${c} is not true.`);let e="";if(1===p){e+="dotProd = dotProd";for(let t=0;t<f;t++)e+=`
            + ${b.getByOffset(`x_offset + ${t}`)} * ${h.getByOffset(`w_offset + ${t}`)}`;e+=";"}else if(2===p){if(2!==f)throw Error(`Invalid inputChannelsRemainder ${f}.`);e+=`
          let xValue = ${b.getByOffset("x_offset")};
          let wValue = ${h.getByOffset("w_offset")};
          dotProd = dotProd + dot(xValue, wValue);`}return e},S=`
            let outputIndices = ${_.offsetToIndices(`global_idx * ${m}`)};
            let batch = ${_.indicesGet("outputIndices",0)};
            let d1 = ${_.indicesGet("outputIndices",d)};
            let r = ${_.indicesGet("outputIndices",u)};
            let c = ${_.indicesGet("outputIndices",l)};
            let dyCorner = vec2<i32>(i32(r), i32(c)) - uniforms.pads;
            let dyRCorner = dyCorner.x;
            let dyCCorner = dyCorner.y;
            let groupId = d1 / uniforms.output_channels_per_group;
            let wOutChannel = d1 - groupId * uniforms.output_channels_per_group;
            // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
            // ? = to be determined. : = across all values in that axis.
            var dotProd = ${_.type.value}(0.0);
            var wR: u32 = 0;
            if (uniforms.dilations.x == 1) {
              // Minimum wR >= 0 that satisfies (dyRCorner + wR) % (uniforms.strides.x) == 0
              wR = u32(((dyRCorner + i32(uniforms.strides.x) - 1) / i32(uniforms.strides.x)) * i32(uniforms.strides.x) - dyRCorner);
            }
            for (; wR < uniforms.effective_filter_dims.x; wR = wR + 1) {
              if (wR % uniforms.dilations.x != 0) {
                continue;
              }
              let dyR = (${s}(dyRCorner) + ${s}(wR)) / ${s}(uniforms.strides[0]);
              let wRPerm = uniforms.filter_dims.x - 1 - wR / uniforms.dilations.x;
              if (dyR < 0.0 || dyR >= ${s}(uniforms.Dy_shape[${u}]) || fract(dyR) > 0.0 ||
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
                let dyC = (${s}(dyCCorner) + ${s}(wC)) / ${s}(uniforms.strides.y);
                let wCPerm = uniforms.filter_dims.y - 1 - wC / uniforms.dilations.y;
                if (dyC < 0.0 || dyC >= ${s}(uniforms.Dy_shape[${l}]) ||
                    fract(dyC) > 0.0 || wCPerm < 0) {
                  continue;
                }
                let idyC: u32 = u32(dyC);
                var inputChannel = groupId * uniforms.input_channels_per_group;
                ${c?`
                var x_offset = ${b.indicesToOffset(`${b.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${p};
                var w_offset = ${h.indicesToOffset(`${h.type.indices}(wRPerm, wCPerm, inputChannel, wOutChannel)`)} / ${g};
                  `:""}
                for (var d2: u32 = 0; d2 < uniforms.input_channels_per_group_int; d2 = d2 + ${c?4:p}) {
                  ${w()}
                  inputChannel = inputChannel + ${c?4:p};
                }
                ${I()}
                wC = wC + uniforms.strides.y - 1;
              }
              wR = wR + uniforms.strides[0] - 1;
            }
            let value = dotProd${n?` + bias[d1 / ${m}]`:""};
            ${_.setByOffset("global_idx","value")};
          `;return`
    ${t.registerUniforms(i).declareVariables(...y,_)}
      ${t.mainStart()}
      ${t.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")};
    ${S}}`};return{name:"ConvTranspose2D",shaderCache:{hint:`${t.cacheKey};${p}${g}${m}${c}${f}`,inputDependencies:_},getRunData:()=>({dispatchGroup:{x:y[0],y:y[1],z:y[2]},outputs:[{dims:i?i(o):o,dataType:e[0].dataType}],programUniforms:I}),getShaderSource:S}}}),Kv=k(()=>{"use strict";Uv(),wr(),Yn(),o3=(e,t,i,n,o,a)=>(e-1)*t+i+(n-1)*o+1-a,i3=(e,t,i,n,o)=>{let a=Math.floor(e/2);"SAME_UPPER"===t?(i[n]=a,i[o]=e-a):"SAME_LOWER"===t&&(i[n]=e-a,i[o]=a)},a3=(e,t,i,n,o,a,s,u,l,d)=>{let p=e.length-2,c=0===d.length;l.length<p&&l.push(...Array(p-l.length).fill(0));let h=e[0],f=t[u?3:1]*o;for(let o=0,h=e.length-p-!!u;o<p;++o,++h){let u=e[h],f=c?u*s[o]:d[o];i3(o3(u,s[o],a[o],t[h],i[o],f),n,a,o,o+p),c&&d.push(s[o]*(u-1)+l[o]+(t[h]-1)*i[o]+1-a[o]-a[o+p])}d.splice(0,0,h),d.splice(u?3:1,0,f)},Wv=(e,t)=>{let i=e.kernelShape.slice();if(0===e.kernelShape.length||0===e.kernelShape.reduce((e,t)=>e*t,1)){i.length=0;for(let e=2;e<t[1].dims.length;++e)i.push(t[1].dims[e])}let n="NHWC"===e.format;i.splice(0,0,t[1].dims[0]),i.splice(n?3:1,0,t[1].dims[1]);let o=e.pads.slice(),a=e.outputShape.slice(),s=e.outputPadding.slice(),u=t[0].dims,l=e.dilations.slice();0===l.reduce((e,t)=>e+t,0)&&(l=Array(t[0].dims.length-2).fill(1));let d=e.strides.slice();0===d.reduce((e,t)=>e+t,0)&&(d=Array(t[0].dims.length-2).fill(1)),a3(u,i,l,e.autoPad,e.group,o,d,n,s,a);let p=Object.assign({},e);return Object.assign(p,{kernelShape:i,pads:o,outputPadding:s,outputShape:a,dilations:l,strides:d}),p},Hv=e=>{let t=Ga(e),i=e.format,n=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][typeof e.autoPad>"u"?0:e.autoPad],o=e.dilations,a=e.group,s=e.kernelShape,u=e.pads,l=e.strides,d=e.wIsConst();return{autoPad:n,format:i,dilations:o,group:a,kernelShape:s,outputPadding:e.outputPadding,outputShape:e.outputShape,pads:u,strides:l,wIsConst:d,...t,cacheKey:`${e.format};${t.activation};`}},s3=(e,t)=>{if(!e||2!==e.length&&3!==e.length)throw Error("Conv requires 2 or 3 inputs");if(4!==e[0].dims.length&&3!==e[0].dims.length)throw Error("currently only support 2-dimensional conv");if(e[0].dims.length!==e[1].dims.length)throw Error("filter does not have same dimension as input");if(e[0].dims["NHWC"===t.format?e[0].dims.length-1:1]!==e[1].dims[0])throw Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");let i=e[1].dims[1]*t.group;if(3===e.length&&(1!==e[2].dims.length||e[2].dims[0]!==i))throw Error("invalid bias");let n=e[0].dims.length-2;if(t.dilations.reduce((e,t)=>e+t,0)>0&&t.dilations.length!==n)throw Error(`dilations should be ${n}D`);if(t.strides.reduce((e,t)=>e+t,0)>0&&t.strides.length!==n)throw Error(`strides should be ${n}D`);if(t.pads.reduce((e,t)=>e+t,0)>0&&t.pads.length!==2*n)throw Error(`pads should be ${2*n}D`);if(t.outputPadding.length!==n&&0!==t.outputPadding.length)throw Error(`output_padding should be ${n}D`);if(t.kernelShape.reduce((e,t)=>e+t,0)>0&&0!==t.kernelShape.length&&t.kernelShape.length!==e[1].dims.length-2)throw Error("invalid kernel shape");if(0!==t.outputShape.length&&t.outputShape.length!==e[0].dims.length-2)throw Error("invalid output shape")},jv=(e,t,i,n)=>{let o=e.kernelCustomData.wT??e.compute(at(t[1],[2,3,0,1]),{inputs:[1],outputs:[i.wIsConst?-2:-1]})[0];i.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=o);let a=[t[0],o];3===t.length&&a.push(t[2]),e.compute(Gv(a,i,n),{inputs:a})},u3=(e,t)=>{let i="NHWC"===t.format,n=[e.inputs[0].reshape(i?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];3===e.inputs.length&&n.push(e.inputs[2]);let o=t.kernelShape;(0===o.length||0===o[0])&&(o=[e.inputs[1].dims[2]]);let a=t.dilations;(0===a.length||0===a[0])&&(a=[1]);let s=t.strides;(0===s.length||0===s[0])&&(s=[1]);let u=t.pads;0===u.length&&(u=[0,0]),u=[0,u[0],0,u[1]],s=[1].concat(s),a=[1].concat(a),o=[1].concat(o);let l=t.outputPadding;l=[0].concat(l);let d=Wv({...t,pads:u,strides:s,dilations:a,kernelShape:o,outputPadding:l},n);jv(e,n,d,e=>i?[e[0],e[2],e[3]]:[e[0],e[1],e[3]])},qv=(e,t)=>{if(s3(e.inputs,t),3===e.inputs[0].dims.length)u3(e,t);else{let i=Wv(t,e.inputs);jv(e,e.inputs,i)}}}),Jv=k(()=>{"use strict";le(),ge(),Xe(),ye(),l3=(e,t,i,n)=>{let o=C.size(t),a=t.length,s=N("input",e,a),u=G("output",e,a),l=6===i.dataType?i.getInt32Array()[0]:Number(i.getBigInt64Array()[0]),d=C.normalizeAxis(l,a),p=e=>{let t=` i32(${s.indicesGet("inputIndices","uniforms.axis")}) `,i=Q("uniforms.input_shape","uniforms.axis",a),o=n.reverse?t+(n.exclusive?" + 1":""):"0",l=n.reverse?i:t+(n.exclusive?"":" + 1");return`
                ${e.registerUniform("outputSize","u32").registerUniform("axis","u32").declareVariables(s,u)}
                ${e.mainStart()}
                  ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
                  var inputIndices = ${u.offsetToIndices("global_idx")};
                  var sum = ${u.type.value}(0);
                  let first : i32 = ${o};
                  let last : i32 = ${l};
                  for (var i : i32 = first; i < last; i++) {
                    ${s.indicesSet("inputIndices","uniforms.axis","u32(i)")};
                    sum = sum + ${s.getByIndices("inputIndices")};
                  }
                  ${u.setByOffset("global_idx","sum")};
                }`};return{name:"CumSum",shaderCache:{hint:n.cacheKey,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:t,dataType:e}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:[{type:12,data:o},{type:12,data:d},...W(t,t)]}),getShaderSource:p}},Xv=(e,t)=>{let i=e.inputs[0].dims,n=e.inputs[0].dataType,o=e.inputs[1];e.compute(l3(n,i,o,t),{inputs:[0]})},Zv=e=>{let t=1===e.exclusive,i=1===e.reverse;return ce({exclusive:t,reverse:i})}}),e0=k(()=>{"use strict";le(),ge(),Xe(),ye(),c3=e=>{if(!e||1!==e.length)throw Error("DepthToSpace requires 1 input.");if(4!==e[0].dims.length)throw Error("DepthToSpace requires 4D input.")},d3=(e,t,i,n)=>{let o=[];o.push(`fn perm(i: ${n.type.indices}) -> ${i.type.indices} {
    var a: ${i.type.indices};`);for(let n=0;n<t;++n)o.push(i.indicesSet("a",e[n],`i[${n}]`));return o.push("return a;}"),o.join(`
`)},p3=(e,t)=>{let i,n,o,a,s,u,l="NHWC"===t.format,d=t.blocksize,p="DCR"===t.mode;l?([i,n,o,a]=e.dims,s=p?[i,n,o,d,d,a/d**2]:[i,n,o,a/d**2,d,d],u=p?[0,1,3,2,4,5]:[0,1,4,2,5,3]):([i,n,o,a]=[e.dims[0],e.dims[2],e.dims[3],e.dims[1]],s=p?[i,d,d,a/d**2,n,o]:[i,a/d**2,d,d,n,o],u=p?[0,3,4,1,5,2]:[0,1,4,2,5,3]);let c=e.reshape(s),h=c.dims.length,f=e.dataType,m=N("a",f,h),g=G("output",f,h),b=e=>`
  ${e.registerUniform("output_size","u32").declareVariables(m,g)}

  ${d3(u,h,m,g)}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${g.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${g.setByOffset("global_idx",m.getByIndices("aIndices"))}
  }`;return{name:"DepthToSpace",shaderCache:{hint:`${e.dims};${t.blocksize};${t.mode}`,inputDependencies:["rank"]},getRunData:e=>{let t=l?[i,n*d,o*d,a/d**2]:[i,a/d**2,n*d,o*d],s=C.size(t),p=c.dims,h=C.sortBasedOnPerm(p,u);return{outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:[{type:12,data:s},...W(p,h)]}},getShaderSource:b}},Yv=(e,t)=>{c3(e.inputs),e.compute(p3(e.inputs[0],t))},Qv=e=>ce({blocksize:e.blocksize,mode:e.mode,format:e.format})}),i0=k(()=>{"use strict";le(),ge(),Xe(),ye(),t0="^"+(Ka="("+(kc="[a-zA-Z]|\\.\\.\\.")+")+")+"$",h3="^"+("("+Ka+",)*")+Ka+"$",Nc=class{constructor(e=-1){this.symbolToIndices=new Map,this.inputIndex=e}addSymbol(e,t){let i=this.symbolToIndices.get(e);void 0===i?i=[t]:i.push(t),this.symbolToIndices.set(e,i)}},Lc=class{constructor(e,t){this.equation=t,this.hasEllipsis=!1,this.symbolToInfo=new Map,this.lhs=[],this.outputDims=[];let[i,n]=t.includes("->")?t.split("->",2):[t,""];if(!i.match(RegExp(h3)))throw Error("Invalid LHS term");if(i.split(",").forEach((t,i)=>{let n=e[i].dims.slice();if(!t.match(RegExp(t0)))throw Error("Invalid LHS term");let o=this.processTerm(t,!0,n,i);this.lhs.push(o)}),""===n)n+=[...this.symbolToInfo.entries()].filter(([e,t])=>1===t.count||"..."===e).map(([e])=>e).join("");else if(!n.match(RegExp(Ka)))throw Error("Invalid RHS");n.match(RegExp(kc,"g"))?.forEach(e=>{if("..."===e)this.outputDims=this.outputDims.concat(this.ellipsisDims);else{let t=this.symbolToInfo.get(e);if(void 0===t)throw Error("Invalid RHS symbol");this.outputDims.push(t.dimValue)}}),this.rhs=this.processTerm(n,!1,this.outputDims)}addSymbol(e,t,i){let n=this.symbolToInfo.get(e);if(void 0!==n){if(n.dimValue!==t&&1!==n.count)throw Error("Dimension mismatch");n.count++,n.inputIndices.push(i)}else n={count:1,dimValue:t,inputIndices:[i]};this.symbolToInfo.set(e,n)}processTerm(e,t,i,n=-1){let o=i.length,a=!1,s=[],u=0;if(!e.match(RegExp(t0))&&!t&&""!==e)throw Error("Invalid LHS term");let l=e.match(RegExp(kc,"g")),d=new Nc(n);return l?.forEach((e,p)=>{if("..."===e){if(a)throw Error("Only one ellipsis is allowed per input term");a=!0;let e=o-l.length+1;if(e<0)throw Error("Ellipsis out of bounds");if(s=i.slice(u,u+e),this.hasEllipsis){if(this.ellipsisDims.length!==s.length||this.ellipsisDims.toString()!==s.toString())throw Error("Ellipsis dimensions mismatch")}else if(t)this.hasEllipsis=!0,this.ellipsisDims=s;else throw Error("Ellipsis must be specified in the LHS");for(let e=0;e<s.length;e++){let t=String.fromCharCode(48+e);d.addSymbol(t,p+e),this.addSymbol(t,i[u++],n)}}else d.addSymbol(e,p+(this.hasEllipsis?this.ellipsisDims.length-1:0)),this.addSymbol(e,i[u++],n)}),d}},n0=e=>e+"_max",m3=(e,t,i,n)=>{let o=e.map(e=>e.length).map((e,i)=>N(`input${i}`,t,e)),a=C.size(n),s=G("output",t,n.length),u=[...i.symbolToInfo.keys()].filter(e=>!i.rhs.symbolToIndices.has(e)),l=e=>{let t=[],n="var prod = 1.0;",a="var sum = 0.0;",l="sum += prod;",d=[],p=[],c=[],h=[],f=i.symbolToInfo.size===i.rhs.symbolToIndices.size;i.symbolToInfo.forEach((e,n)=>{if(i.rhs.symbolToIndices.has(n)){let a=i.rhs.symbolToIndices.get(n)?.[0];void 0!==a&&i.lhs.forEach((i,u)=>{if(e.inputIndices.includes(u)){let e=i.symbolToIndices.get(n);if(void 0===e)throw Error("Invalid symbol error");e.forEach(e=>{t.push(`${o[u].indicesSet(`input${u}Indices`,e,s.indicesGet("outputIndices",a))}`)})}})}else i.lhs.forEach((t,i)=>{if(e.inputIndices.includes(i)){let e=t.symbolToIndices.get(n);if(void 0===e)throw Error("Invalid symbol error");e.forEach(e=>{d.push(`${o[i].indicesSet(`input${i}Indices`,e,`${n}`)}`)}),h.push(`prod *= ${o[i].getByIndices(`input${i}Indices`)};`)}}),p.push(`for(var ${n}: u32 = 0; ${n} < uniforms.${n0(n)}; ${n}++) {`),c.push("}")});let m=f?[...t,`let sum = ${o.map((e,t)=>e.getByIndices(`input${t}Indices`)).join(" * ")};`]:[...t,a,...p,...d,n,...h,l,...c];return`
            ${e.registerUniforms(u.map(e=>({name:`${n0(e)}`,type:"u32"}))).registerUniform("outputSize","u32").declareVariables(...o,s)}

            ${e.mainStart()}
            ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
            var outputIndices = ${s.offsetToIndices("global_idx")};
            ${o.map((e,t)=>`var input${t}Indices: ${o[t].type.indices};`).join(`
`)}
            ${m.join(`
`)};
            ${s.setByOffset("global_idx","sum")};
          }`};return{name:"Einsum",shaderCache:{hint:i.equation,inputDependencies:e.map(()=>"rank")},getRunData:()=>{let o=u.filter(e=>i.symbolToInfo.has(e)).map(e=>({type:12,data:i.symbolToInfo.get(e)?.dimValue||0}));o.push({type:12,data:a});let s=e.map((e,t)=>[...W(e)]).reduce((e,t)=>e.concat(t),o);return s.push(...W(n)),{outputs:[{dims:n,dataType:t}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:s}},getShaderSource:l}},r0=(e,t)=>{let i=new Lc(e.inputs,t.equation),n=i.outputDims,o=e.inputs.map((e,t)=>e.dims);e.compute(m3(o,e.inputs[0].dataType,i,n))},o0=e=>{let t=e.equation.replace(/\s+/g,"");return ce({equation:t})}}),u0=k(()=>{"use strict";le(),ge(),ye(),g3=e=>{if(!e||2!==e.length)throw Error("Expand requires 2 input.");let t=e[0].dims,i=Array.from(e[1].getBigInt64Array(),Number),n=i.length<t.length?0:i.length-t.length,o=t.length<i.length?0:t.length-i.length;for(;n<i.length&&o<t.length;++n,++o)if(i[n]!==t[o]&&1!==i[n]&&1!==t[o])throw Error("Expand requires shape to be broadcastable to input")},a0=(e,t)=>{let i=e.length-t.length,n=[];for(let t=0;t<i;++t)n.push(e[t]);for(let o=0;o<t.length;++o)n.push(1===t[o]?e[o+i]:t[o]);return n},b3=(e,t)=>e.length>t.length?a0(e,t):a0(t,e),y3=e=>{let t=e[0].dims,i=b3(t,Array.from(e[1].getBigInt64Array(),Number)),n=e[0].dataType,o=9===n||1===C.size(t),a=9===n||t.length>0&&t[t.length-1]%4==0?4:1,s=o||i.length>0&&i[i.length-1]%4==0?4:1,u=Math.ceil(C.size(i)/s),l=e=>{let o=N("input",n,t.length,a),u=G("output",n,i.length,s),l;if(9===n){let e=(e,t,i="")=>`
          let outputIndices${t} = ${u.offsetToIndices(`outputOffset + ${t}u`)};
          let offset${t} = ${o.broadcastedIndicesToOffset(`outputIndices${t}`,u)};
          let index${t} = offset${t} / 4u;
          let component${t} = offset${t} % 4u;
          ${e}[${t}] = ${i}(${o.getByOffset(`index${t}`)}[component${t}]);
        `;l=`
        let outputOffset = global_idx * ${s};
        var data = vec4<u32>(0);
        ${e("data",0,"u32")}
        ${e("data",1,"u32")}
        ${e("data",2,"u32")}
        ${e("data",3,"u32")}
        ${u.setByOffset("global_idx","data")}
      }`}else l=`
        let outputIndices = ${u.offsetToIndices(`global_idx * ${s}`)};
        let inputOffset = ${o.broadcastedIndicesToOffset("outputIndices",u)};
        let data = ${u.type.value}(${o.getByOffset(`inputOffset / ${a}`)});
        ${u.setByOffset("global_idx","data")}
      }`;return`
    ${e.registerUniform("vec_size","u32").declareVariables(o,u)}
    ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
    ${l}`},d=[{type:12,data:u},...W(t,i)];return{name:"Expand",shaderCache:{hint:`${i.length};${a}${s}`,inputDependencies:["rank"]},getShaderSource:l,getRunData:()=>({outputs:[{dims:i,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:d})}},s0=e=>{g3(e.inputs),e.compute(y3(e.inputs),{inputs:[0]})}}),c0=k(()=>{"use strict";le(),ge(),ye(),Va(),_3=e=>{let t=e[0].dataType,i=C.size(e[0].dims),n=C.size(e[1].dims),o=n%4==0,a=e=>{let i=N("x",t,[1],4),n=N("bias",t,[1],4),a=G("y",t,[1],4),s=[{name:"output_vec_size",type:"u32"},{name:"bias_size",type:"u32"}],u=e=>`
      let bias${e}_offset: u32 = (global_idx * 4 + ${e}) % uniforms.bias_size;
      let bias${e} = ${n.getByOffset(`bias${e}_offset / 4`)}[bias${e}_offset % 4];`,l=o?`
      let bias = ${n.getByOffset("global_idx % (uniforms.bias_size / 4)")};`:`${u(0)}${u(1)}${u(2)}${u(3)}
      let bias = ${i.type.value}(bias0, bias1, bias2, bias3);`;return`${e.registerUniforms(s).declareVariables(i,n,a)}

    ${Sc(it(t))}

    ${e.mainStart(Wr)}
      ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_vec_size")}

      let x = ${i.getByOffset("global_idx")};
      ${l}
      let x_in = x + bias;
      ${a.setByOffset("global_idx",$c("x_in"))}
    }`};return{name:"FastGeluWithBias",shaderCache:{hint:`${o}`,inputDependencies:["type","type"]},getShaderSource:a,getRunData:e=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],programUniforms:[{type:12,data:Math.ceil(i/4)},{type:12,data:n}],dispatchGroup:{x:Math.ceil(i/Wr/4)}})}},l0=e=>{e.inputs.length<2||0===C.size(e.inputs[1].dims)?iv(e):e.compute(_3(e.inputs))}}),f0=k(()=>{"use strict";le(),ge(),Xe(),ye(),v3=e=>{if(!e||2!==e.length)throw Error("Gather requires 2 inputs.")},w3=(e,t)=>{let i=e[0].dims,n=e[1].dims,o=i.length,a=C.normalizeAxis(t.axis,o),s=i.slice(0);s.splice(a,1,...n);let u=i[a],l=9===e[0].dataType?4:1,d=Math.ceil(C.size(s)/l),p=[{type:12,data:d},{type:6,data:u},{type:12,data:a},...W(e[0].dims,e[1].dims,s)],c=t=>{let i=N("data",e[0].dataType,e[0].dims.length,l),u=N("inputIndices",e[1].dataType,e[1].dims.length),d=G("output",e[0].dataType,s.length,l),p=e=>{let t=n.length,l=`var indicesIndices${e}  = ${u.type.indices}(0);`;for(let i=0;i<t;i++)l+=`${t>1?`indicesIndices${e}[${i}]`:`indicesIndices${e}`} = ${s.length>1?`outputIndices${e}[uniforms.axis + ${i}]`:`outputIndices${e}`};`;l+=`
          var idx${e} = ${u.getByIndices(`indicesIndices${e}`)};
          if (idx${e} < 0) {
            idx${e} = idx${e} + uniforms.axisDimLimit;
          }
          var dataIndices${e} : ${i.type.indices};
        `;for(let i=0,n=0;i<o;i++)i===a?(l+=`${o>1?`dataIndices${e}[${i}]`:`dataIndices${e}`} = u32(idx${e});`,n+=t):(l+=`${o>1?`dataIndices${e}[${i}]`:`dataIndices${e}`} = ${s.length>1?`outputIndices${e}[${n}]`:`outputIndices${e}`};`,n++);return l},c;if(9===e[0].dataType){let e=(e,t,n="")=>`
          let outputIndices${t} = ${d.offsetToIndices(`outputOffset + ${t}u`)};
          ${p(t)};
          let offset${t} = ${i.indicesToOffset(`dataIndices${t}`)};
          let index${t} = offset${t} / 4u;
          let component${t} = offset${t} % 4u;
          ${e}[${t}] = ${n}(${i.getByOffset(`index${t}`)}[component${t}]);
        `;c=`
        let outputOffset = global_idx * ${l};
        var value = vec4<u32>(0);
        ${e("value",0,"u32")}
        ${e("value",1,"u32")}
        ${e("value",2,"u32")}
        ${e("value",3,"u32")}
        ${d.setByOffset("global_idx","value")}
      `}else c=`
      let outputIndices = ${d.offsetToIndices("global_idx")};
      ${p("")};
      let value = ${i.getByIndices("dataIndices")};
      ${d.setByOffset("global_idx","value")};
      `;return`
      ${t.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(i,u,d)}
      ${t.mainStart()}
        ${t.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        ${c}
      }`};return{name:"Gather",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:s,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:p}),getShaderSource:c}},d0=e=>ce({axis:e.axis}),p0=(e,t)=>{v3(e.inputs),e.compute(w3(e.inputs,t))}}),g0=k(()=>{"use strict";le(),ge(),ye(),x3=(e,t,i,n,o,a,s,u,l)=>{let d=[{type:12,data:a},{type:12,data:n},{type:12,data:o},{type:12,data:i},{type:12,data:s},{type:12,data:u},{type:12,data:l}],p=[a];d.push(...W(t.dims,p));let c=e=>{let n=[N("indices_data",t.dataType,t.dims.length),G("input_slice_offsets_data",12,1,1)],a=[{name:"output_size",type:"u32"},{name:"batch_dims",type:"u32"},{name:"input_dims",type:"u32",length:o.length},{name:"sizes_from_slice_dims_data",type:"u32",length:i.length},{name:"num_slices_per_batch",type:"u32"},{name:"input_batch_stride",type:"u32"},{name:"num_slice_dims",type:"u32"}];return`
  ${e.registerUniforms(a).declareVariables(...n)}
  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let batch_idx = global_idx / uniforms.num_slices_per_batch;
    let base_offset = batch_idx * uniforms.input_batch_stride;

    let slice_indices_base_offset = global_idx * uniforms.num_slice_dims;
    var relative_slice_offset = 0;
    for (var dim_idx = 0u; dim_idx < uniforms.num_slice_dims; dim_idx ++) {
      var index = i32(indices_data[dim_idx + slice_indices_base_offset].x);
      let input_dim_idx = uniforms.batch_dims + dim_idx;
      if (index < 0) {
        ${1===o.length?"index += i32(uniforms.input_dims);":"index += i32(uniforms.input_dims[input_dim_idx]);"}
      }
      ${1===i.length?"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data);":"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data[dim_idx]);"}
    }

    input_slice_offsets_data[global_idx] =  base_offset + u32(relative_slice_offset);
  }`};return e.compute({name:"computeSliceOffsets",shaderCache:{hint:`${o.length}_${i.length}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:p,dataType:e.inputs[1].dataType}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:d}),getShaderSource:c},{inputs:[t],outputs:[-1]})[0]},h0=(e,t)=>{let i=e.inputs,n=i[0].dims,o=i[0].dataType,a=i[1].dims,s=a[a.length-1],u=C.sizeToDimension(a,a.length-1),l=C.sizeFromDimension(n,t.batchDims+s),d=C.sizeToDimension(n,t.batchDims),p=C.sizeFromDimension(n,t.batchDims),c=u/d,h=Array(s),f=l;for(let e=0;e<s;++e)h[s-1-e]=f,f*=n[t.batchDims+s-1-e];let m=x3(e,i[1],h,t.batchDims,n,u,c,p,s),g=t.batchDims+s;if(g>n.length)throw Error("last dimension of indices must not be larger than rank of input tensor");let b=a.slice(0,-1).concat(n.slice(g)),y=C.size(b),_=[{type:12,data:y},{type:12,data:l},...W(i[0].dims,m.dims,b)],v=e=>{let t=N("data",i[0].dataType,i[0].dims.length),n=N("slice_offsets",12,m.dims.length),o=G("output",i[0].dataType,b.length);return`
          ${e.registerUniform("output_size","u32").registerUniform("slice_size","u32").declareVariables(t,n,o)}
            ${e.mainStart()}
            ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let slice_offset = slice_offsets[global_idx / uniforms.slice_size];
          output[global_idx] = data[u32(slice_offset) + global_idx % uniforms.slice_size];
        }`};e.compute({name:"GatherND",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:b,dataType:o}],dispatchGroup:{x:Math.ceil(y/64)},programUniforms:_}),getShaderSource:v},{inputs:[i[0],m]})},m0=e=>({batchDims:e.batch_dims,cacheKey:""})}),_0=k(()=>{"use strict";le(),ge(),Xe(),ye(),T3=(e,t)=>{if(e.length<3||e.length>4)throw Error("GatherBlockQuantized requires 3 or 4 inputs.");let i=C.normalizeAxis(t.quantizeAxis,e[0].dims.length),n=t.blockSize,o=e[0],a=e[2],s=4===e.length?e[3]:void 0;if(a.dims.length!==o.dims.length||!o.dims.map((e,t)=>t===i?Math.ceil(e/n)===a.dims[t]:e===a.dims[t]).reduce((e,t)=>e&&t,!0))throw Error("Scales must have the same rank as the input tensor and the dims should match except on gatherAxis.");if(s){if(s.dataType!==o.dataType)throw Error("Zero point must have the same data type as the input tensor.");if(s.dims.length!==a.dims.length||!s.dims.map((e,t)=>e===a.dims[t]).reduce((e,t)=>e&&t,!0))throw Error("Zero point must have the same rank as the input tensor and the dims should match except on quantizeAxis.")}},I3=(e,t)=>{let i=e[0].dims,n=e[1].dims,o=i.length,a=C.normalizeAxis(t.gatherAxis,o),s=C.normalizeAxis(t.quantizeAxis,o),u=i.slice(0);u.splice(a,1,...n);let l=C.size(u),d=e[2].dataType,p=22===e[0].dataType,c=[{type:12,data:l},{type:12,data:s},{type:12,data:a},{type:12,data:t.blockSize},...W(...e.map((e,t)=>e.dims),u)],h=t=>{let o=N("data",e[0].dataType,e[0].dims.length),s=N("inputIndices",e[1].dataType,e[1].dims.length),l=N("scales",e[2].dataType,e[2].dims.length),c=e.length>3?N("zeroPoint",e[3].dataType,e[3].dims.length):void 0,h=G("output",d,u.length),f=[o,s,l];c&&f.push(c);let m=[{name:"output_size",type:"u32"},{name:"quantize_axis",type:"u32"},{name:"gather_axis",type:"u32"},{name:"block_size",type:"u32"}];return`
        ${t.registerUniforms(m).declareVariables(...f,h)}
        ${t.mainStart()}
        let output_indices = ${h.offsetToIndices("global_idx")};
        var indices_indices = ${s.type.indices}(0);
        ${n.length>1?`
          for (var i: u32 = 0; i < ${n.length}; i++) {
            let index = ${h.indicesGet("output_indices","uniforms.gather_axis + i")};
            ${s.indicesSet("indices_indices","i","index")};
          }`:`indices_indices = ${h.indicesGet("output_indices","uniforms.gather_axis")};`};
        var data_indices = ${o.type.indices}(0);
        for (var i: u32 = 0; i < uniforms.gather_axis; i++) {
          let index = ${h.indicesGet("output_indices","i")};
          ${o.indicesSet("data_indices","i","index")};
        }
        var index_from_indices = ${s.getByIndices("indices_indices")};
        if (index_from_indices < 0) {
          index_from_indices += ${i[a]};
        }
        ${o.indicesSet("data_indices","uniforms.gather_axis","u32(index_from_indices)")};
        for (var i = uniforms.gather_axis + 1; i < ${u.length}; i++) {
          let index = ${h.indicesGet("output_indices",`i + ${n.length} - 1`)};
          ${o.indicesSet("data_indices","i","index")};
        }
        let data_offset = ${o.indicesToOffset("data_indices")};
        let data_index = data_offset % 8;
        // Convert 4-bit packed data to 8-bit packed data.
        let packed_4bit_quantized_data = ${o.getByOffset("data_offset / 8")};
        let packed_8bit_quantized_data = (packed_4bit_quantized_data >> (4 * (data_index % 2))) & 0x0f0f0f0f;
        let quantized_data_vec = ${p?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_quantized_data));
        let quantized_data = quantized_data_vec[data_index / 2];
        var scale_indices = data_indices;
        let quantize_axis_index = ${l.indicesGet("data_indices","uniforms.quantize_axis")} / uniforms.block_size;
        ${l.indicesSet("scale_indices","uniforms.quantize_axis","quantize_axis_index")};
        var scale = ${l.getByIndices("scale_indices")};
        ${c?`
              let zero_point_indices = scale_indices;
              let zero_point_offset = ${c.indicesToOffset("zero_point_indices")};
              let zero_point_index = zero_point_offset % 8;
              let packed_4bit_zero_points = ${c.getByOffset("zero_point_offset / 8")};
              let packed_8bit_zero_points = (packed_4bit_zero_points >> (4 * (zero_point_index % 2))) & 0x0f0f0f0f;
              let zero_point_vec = ${p?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_zero_points));
              let zero_point = zero_point_vec[zero_point_index / 2];`:"var zero_point = 0"};
        let dequantized_data = ${it(d)}(quantized_data - zero_point) * scale;
        ${h.setByOffset("global_idx","dequantized_data")};
    }`};return{name:"GatherBlockQuantized",shaderCache:{hint:`${t.cacheKey};${e.filter((e,t)=>1!==t).map(e=>e.dims.join("_")).join(";")}`,inputDependencies:Array.from({length:e.length},(e,t)=>"rank")},getRunData:()=>({outputs:[{dims:u,dataType:d}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:c}),getShaderSource:h}},b0=(e,t)=>{T3(e.inputs,t),e.compute(I3(e.inputs,t))},y0=e=>ce({blockSize:e.blockSize,gatherAxis:e.gatherAxis,quantizeAxis:e.quantizeAxis})}),x0=k(()=>{"use strict";le(),ge(),Xe(),ye(),S3=e=>{if(!e||2!==e.length)throw Error("GatherElements requires 2 inputs.");if(e[0].dims.length<1)throw Error("GatherElements requires that the data input be rank >= 1.");if(e[0].dims.length!==e[1].dims.length)throw Error(`GatherElements requires that the data input and
                     indices input tensors be of same rank.`)},$3=(e,t)=>{let i=e[0].dims,n=e[0].dataType,o=i.length,a=e[1].dims,s=e[1].dataType,u=C.normalizeAxis(t.axis,o),l=i[u],d=a.slice(0),p=C.size(d),c=N("input",n,o),h=N("indicesInput",s,a.length),f=G("output",n,d.length),m=[{type:12,data:p},{type:6,data:l},{type:12,data:u}];return m.push(...W(i,a,d)),{name:"GatherElements",shaderCache:{inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:d,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(p/64)},programUniforms:m}),getShaderSource:e=>`
      ${e.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(c,h,f)}
      ${e.mainStart()}
      ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

      let outputIndices = ${f.offsetToIndices("global_idx")};

      var idx = ${h.getByOffset("global_idx")};
      if (idx < 0) {
        idx = idx + uniforms.axisDimLimit;
      }
      var inputIndices = ${c.type.indices}(outputIndices);
      ${c.indicesSet("inputIndices","uniforms.axis","u32(idx)")};
      let value = ${c.getByIndices("inputIndices")};

      ${f.setByOffset("global_idx","value")};
  }`}},v0=e=>ce({axis:e.axis}),w0=(e,t)=>{S3(e.inputs),e.compute($3(e.inputs,t))}}),S0=k(()=>{"use strict";le(),ge(),ye(),A3=e=>{if(!e)throw Error("Input is missing");if(e.length<2||e.length>3)throw Error("Invaid input number.");if(3===e.length&&e[2].dims.length>2)throw Error("Invalid input shape of C");if(e[0].dataType!==e[1].dataType||3===e.length&&e[0].dataType!==e[2].dataType)throw Error("Input types are mismatched")},O3=(e,t)=>{let i=e[0].dims.slice(),n=e[1].dims.slice(),[o,a,s]=Oa.getShapeOfGemmResult(i,t.transA,n,t.transB,3===e.length?e[2].dims:void 0),u=[o,a];if(!u)throw Error("Can't use gemm on the given tensors");let l=16,d=Math.ceil(a/16),p=Math.ceil(o/16),c=!0,h=C.size(u),f=[{type:12,data:c?d:h},{type:12,data:o},{type:12,data:a},{type:12,data:s},{type:1,data:t.alpha},{type:1,data:t.beta}],m=["type","type"];3===e.length&&(f.push(...W(e[2].dims)),m.push("rank")),f.push(...W(u));let g=i=>{let n="";t.transA&&t.transB?n="value += a[k * uniforms.M + m] * b[n * uniforms.K + k];":t.transA&&!t.transB?n="value += a[k * uniforms.M + m] * b[k * uniforms.N + n];":!t.transA&&t.transB?n="value += a[m * uniforms.K + k] * b[n * uniforms.K + k];":t.transA||t.transB||(n="value += a[m * uniforms.K + k] * b[k * uniforms.N + n];");let o=1===t.alpha?"":"value *= uniforms.alpha;",a=N("a",e[0].dataType,e[0].dims),s=N("b",e[1].dataType,e[1].dims),l=a.type.value,d=null,p=[a,s];3===e.length&&(d=N("c",e[2].dataType,e[2].dims.length),p.push(d));let c=G("output",e[0].dataType,u.length);p.push(c);let h=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}];return`
  ${i.registerUniforms(h).declareVariables(...p)}

  ${i.mainStart()}
    ${i.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let m = global_idx / uniforms.N;
    let n = global_idx % uniforms.N;

    var value = ${l}(0);
    for (var k: u32 = 0u; k < uniforms.K; k++) {
      ${n}
    }

    ${o}
    ${null!=d?`let cOffset = ${d.broadcastedIndicesToOffset("vec2(m, n)",c)}; value += ${l}(uniforms.beta) * ${d.getByOffset("cOffset")};`:""}
    output[global_idx] = value;
  }`},b=i=>{let n=N("a",e[0].dataType,e[0].dims),o=N("b",e[1].dataType,e[1].dims),a=null,s=[n,o];3===e.length&&(a=N("c",e[2].dataType,e[2].dims.length),s.push(a));let d=G("output",e[0].dataType,u.length);s.push(d);let p=[{name:"num_tile_n",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}],c="",h="";t.transA&&t.transB?(h=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${n.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${o.type.value}(0);
      }
      `,c="value += tile_a[k][local_id.y] * tile_b[local_id.x][k];"):t.transA&&!t.transB?(h=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${n.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${o.type.value}(0);
      }
      `,c="value += tile_a[k][local_id.y] * tile_b[k][local_id.x];"):!t.transA&&t.transB?(h=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${n.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${o.type.value}(0);
      }
      `,c="value += tile_a[local_id.y][k] * tile_b[local_id.x][k];"):t.transA||t.transB||(h=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${n.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${o.type.value}(0);
      }
      `,c="value += tile_a[local_id.y][k] * tile_b[k][local_id.x];");let f=1===t.alpha?"":"value *= uniforms.alpha;";return`
  ${i.registerUniforms(p).declareVariables(...s)}
  var<workgroup> tile_a: array<array<${n.type.storage}, ${l}>, ${l}>;
  var<workgroup> tile_b: array<array<${o.type.storage}, ${l}>, ${l}>;
  ${i.mainStart([l,l,1])}
    let tile_col_start = (workgroup_index % uniforms.num_tile_n) * ${l};
    let tile_row_start = (workgroup_index / uniforms.num_tile_n) * ${l};
    let num_tiles = (uniforms.K - 1) / ${l} + 1;
    var k_start = 0u;
    var value = ${d.type.value}(0);
    for (var t: u32 = 0u; t < num_tiles; t++) {
      ${h}
      k_start = k_start + ${l};
      workgroupBarrier();

      for (var k: u32 = 0u; k < ${l}; k++) {
        ${c}
      }
      workgroupBarrier();
    }

    ${f}
    let m = tile_row_start + local_id.y;
    let n = tile_col_start + local_id.x;
    ${null!=a?`let cOffset = ${a.broadcastedIndicesToOffset("vec2(m, n)",d)}; value += ${d.type.value}(uniforms.beta) * ${a.getByOffset("cOffset")};`:""}
    if (m < uniforms.M && n < uniforms.N) {
      output[m * uniforms.N + n] = value;
    }
  }`};return c?{name:"GemmShared",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:m},getRunData:()=>({outputs:[{dims:u,dataType:e[0].dataType}],dispatchGroup:{x:d*p},programUniforms:f}),getShaderSource:b}:{name:"Gemm",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:m},getRunData:()=>({outputs:[{dims:u,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:f}),getShaderSource:g}},T0=e=>({transA:e.transA,transB:e.transB,alpha:e.alpha,beta:e.beta,cacheKey:`${e.transA};${e.transB};${1===e.alpha}`}),I0=(e,t)=>{A3(e.inputs),e.compute(O3(e.inputs,t))}}),O0=k(()=>{"use strict";le(),ge(),Xe(),ye(),[Qn,xr,fo,ho]=[0,1,2,3],P3=e=>{if(4!==e[0].dims.length)throw Error("only 4-D tensor is supported.");if(e[0].dims.length!==e[1].dims.length)throw Error("input dimensions must be equal to grid dimensions");if(e[0].dims.length-2!==e[1].dims[e[1].dims.length-1])throw Error(`last dimension of grid must be equal to ${e[0].dims.length-2}`);if(e[0].dims[0]!==e[1].dims[0])throw Error("grid batch size must match input batch size")},E3=`
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
`,C3=e=>`
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
`,D3=e=>`
  fn gs_denormalize(n: f32, length: i32) -> f32 {
    ${0===e.alignCorners?`
    // alignCorners: false => [-1, 1] to [-0.5, length - 0.5]
    return ((n + 1.0) * f32(length) - 1.0) / 2.0;
    `:`
    // alignCorners: true => [-1, 1] to [0, length - 1]
    return (n + 1.0) / 2.0 * (f32(length - 1));
    `}
  }
`,k3=e=>`
  ${"reflection"===e.paddingMode?`
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
`,N3=(e,t,i)=>`
  fn pixel_at_grid(r: i32, c: i32, H: i32, W: i32, batch: u32, channel: u32, border: vec4<f32>) -> ${t} {
     var pixel = ${t}(0);
     var indices = vec4<u32>(0);
     indices[${Qn}] = batch;
     indices[${xr}] = channel;`+(()=>{switch(i.paddingMode){case"zeros":return`
          if (r >= 0 && r < H && c >=0 && c < W) {
            indices[${fo}] = u32(r);
            indices[${ho}] = u32(c);
          } else {
            return ${t}(0);
          }
        `;case"border":return`
          indices[${fo}] = u32(clamp(r, 0, H - 1));
          indices[${ho}] = u32(clamp(c, 0, W - 1));
        `;case"reflection":return`
          indices[${fo}] = gs_reflect(r, border[1], border[3]);
          indices[${ho}] = gs_reflect(c, border[0], border[2]);
        `;default:throw Error(`padding mode ${i.paddingMode} is not supported`)}})()+`
    return ${e.getByIndices("indices")};
  }
`,L3=(e,t,i)=>(()=>{switch(i.mode){case"nearest":return`
          let result = pixel_at_grid(i32(round(y)), i32(round(x)), H_in, W_in, indices[${Qn}], indices[${xr}], border);
        `;case"bilinear":return`
          let x1 = i32(floor(x));
          let y1 = i32(floor(y));
          let x2 = x1 + 1;
          let y2 = y1 + 1;

          let p11 = pixel_at_grid(y1, x1, H_in, W_in, indices[${Qn}], indices[${xr}], border);
          let p12 = pixel_at_grid(y1, x2, H_in, W_in, indices[${Qn}], indices[${xr}], border);
          let p21 = pixel_at_grid(y2, x1, H_in, W_in, indices[${Qn}], indices[${xr}], border);
          let p22 = pixel_at_grid(y2, x2, H_in, W_in, indices[${Qn}], indices[${xr}], border);

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
              p[h][w] = pixel_at_grid(h + y0, w + x0, H_in, W_in, indices[${Qn}], indices[${xr}], border);
            }
          }

          let dx = x - f32(x0 + 1);
          let dy = y - f32(y0 + 1);
          let result = gs_bicubic_interpolate(p, dx, dy);
        `;default:throw Error(`mode ${i.mode} is not supported`)}})()+`${e.setByOffset("global_idx","result")}`,R3=(e,t)=>{let i=N("x",e[0].dataType,e[0].dims.length),n=[e[1].dims[0],e[1].dims[1],e[1].dims[2]],o=N("grid",e[1].dataType,n.length,2),a=[e[0].dims[0],e[0].dims[1],e[1].dims[1],e[1].dims[2]];"NHWC"===t.format&&(a=[e[0].dims[0],e[1].dims[1],e[1].dims[2],e[0].dims[3]],[Qn,xr,fo,ho]=[0,3,1,2]);let s=G("output",e[0].dataType,a.length),u=i.type.value,l=[{type:12,data:C.size(a)},...W(e[0].dims,n,a)],d=e=>`
  ${e.registerUniform("output_size","u32").declareVariables(i,o,s)}
  ${E3}
  ${C3(u)}
  ${D3(t)}
  ${k3(t)}
  ${N3(i,u,t)}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let H_in = i32(uniforms.x_shape[${fo}]);
      let W_in = i32(uniforms.x_shape[${ho}]);

      ${0===t.alignCorners?`
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
      var grid_indices = vec3<u32>(indices[${Qn}], indices[${fo}], indices[${ho}]);
      let nxy = ${o.getByIndices("grid_indices")};
      var x = gs_denormalize(f32(nxy[0]), W_in);
      var y = gs_denormalize(f32(nxy[1]), H_in);

      ${L3(s,u,t)}
  }`;return{name:"GridSample",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:["type","type"]},getRunData:e=>{let t=C.size(a);return{outputs:[{dims:a,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(t/64)},programUniforms:l}},getShaderSource:d}},$0=(e,t)=>{P3(e.inputs),e.compute(R3(e.inputs,t))},A0=e=>ce({alignCorners:e.align_corners,mode:e.mode,paddingMode:e.padding_mode,format:e.format})}),Rc=k(()=>{"use strict";le(),ge(),Xe(),Na(),Ba(),ye(),Yn(),Tt=(e,t)=>e.length>t&&e[t].dims.length>0?e[t]:void 0,B3=(e,t)=>{let i,n=e[0],o=Tt(e,1),a=Tt(e,2),s=Tt(e,3),u=Tt(e,4),l=Tt(e,5),d=Tt(e,6),p=Tt(e,7);if(3!==n.dims.length&&5!==n.dims.length)throw Error("Input query is expected to have 3 or 5 dimensions");let c=n.dims[0],h=n.dims[1],f=3===n.dims.length?n.dims[2]:t.numHeads*n.dims[4],m=h,g=0,b=0,y=Math.floor(f/t.numHeads);if(d&&p&&C.size(d.dims)&&C.size(p.dims)){if(4!==d.dims.length)throw Error('Input "past_key" is expected to have 4 dimensions');if(d.dims[0]!==c||d.dims[1]!==t.numHeads||d.dims[3]!==y)throw Error('Input "past_key" shape (batch_size, num_heads, past_sequence_length, head_size)');if(p.dims[0]!==c||p.dims[1]!==t.numHeads||p.dims[3]!==y)throw Error('Input "past_value" shape (batch_size, num_heads, past_sequence_length, head_size)');if(d.dims[2]!==p.dims[2])throw Error('Input "past_key" and "past_value" shall have same dim 2 (past_sequence_length)');if(4!==p.dims.length)throw Error('Input "past_value" is expected to have 4 dimensions');g=d.dims[2],b=d.dims[2]}else if(d&&C.size(d.dims)||p&&C.size(p.dims))throw Error('Input "past_key" and "past_value" shall be both present or both absent');if(o&&C.size(o.dims)>0){if(3!==n.dims.length)throw Error('Input "query" is expected to have 3 dimensions when key is given');if(o.dims.length<3||o.dims.length>5)throw Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(n.dims[0]!==o.dims[0])throw Error('Input "query" and "key" shall have same dim 0 (batch size)');if(3===o.dims.length){if(o.dims[2]!==n.dims[2])throw Error('Input "query" and "key" shall have same dim 2 (hidden_size)');i=2,m=o.dims[1]}else if(5===o.dims.length){if(o.dims[2]!==t.numHeads||2!==o.dims[3]||o.dims[4]!==y)throw Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(a)throw Error('Expect "value" be none when "key" has packed kv format.');i=5,m=o.dims[1]}else{if(o.dims[1]!==t.numHeads||o.dims[3]!==y)throw Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');i=0,m=o.dims[2]}}else{if(5!==n.dims.length)throw Error('Input "query" is expected to have 5 dimensions when key is empty');if(n.dims[2]!==t.numHeads||3!==n.dims[3])throw Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');i=3}if(s&&C.size(s.dims)>0){if(1!==s.dims.length)throw Error('Input "bias" is expected to have 1 dimension');if(o&&5===o.dims.length&&2===o.dims[3])throw Error("bias is not allowed for packed kv.")}let _=g+m,v=0;if(u&&C.size(u.dims)>0){v=8;let e=u.dims;throw 1===e.length?e[0]===c?v=1:e[0]===3*c+2&&(v=3):2===e.length&&e[0]===c&&e[1]===_&&(v=5),8===v?Error('Input "key_padding_mask" shape shall be (batch_size) or (batch_size, total_sequence_length)'):Error("Mask not supported")}let x=!1,w=f;if(a&&C.size(a.dims)>0){if(3!==a.dims.length&&4!==a.dims.length)throw Error('Input "value" is expected to have 3 or 4 dimensions');if(n.dims[0]!==a.dims[0])throw Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(3===a.dims.length){if(m!==a.dims[1])throw Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');w=a.dims[2]}else{if(m!==a.dims[2])throw Error('Input "key" and "value" shall have the same dim 2 (kv_sequence_length)');w=a.dims[1]*a.dims[3],x=!0}}let $=!1;if(u&&C.size(u.dims)>0)throw Error("Key padding mask is not supported");if(l&&C.size(l.dims)>0){if(4!==l.dims.length)throw Error('Input "attention_bias" is expected to have 4 dimensions');if(l.dims[0]!==c||l.dims[1]!==t.numHeads||l.dims[2]!==h||l.dims[3]!==_)throw Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:c,sequenceLength:h,pastSequenceLength:g,kvSequenceLength:m,totalSequenceLength:_,maxSequenceLength:b,inputHiddenSize:0,hiddenSize:f,vHiddenSize:w,headSize:y,vHeadSize:Math.floor(w/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:v,scale:t.scale,broadcastResPosBias:$,passPastInKv:x,qkvFormat:i}},E0=e=>ce({...e}),P0=ce({perm:[0,2,1,3]}),F3=(e,t,i,n,o,a,s)=>{let u=[n,o,a],l=C.size(u),d=[{type:12,data:l},{type:12,data:s},{type:12,data:a}],p=e=>{let n=G("qkv_with_bias",t.dataType,u),o=N("qkv",t.dataType,u),a=N("bias",i.dataType,u),s=[{name:"output_size",type:"u32"},{name:"bias_offset",type:"u32"},{name:"hidden_size",type:"u32"}];return`
  ${e.registerUniforms(s).declareVariables(o,a,n)}
  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let bias_offset_idx = (global_idx % uniforms.hidden_size) + uniforms.bias_offset;

    qkv_with_bias[global_idx] = qkv[global_idx] + bias[bias_offset_idx];
  }`};return e.compute({name:"MultiHeadAttentionAddBias",shaderCache:{inputDependencies:["type","type"]},getRunData:()=>({outputs:[{dims:u,dataType:t.dataType,gpuDataType:0}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:d}),getShaderSource:p},{inputs:[t,i],outputs:[-1]})[0]},qo=(e,t,i,n,o,a,s,u)=>{let l=a;if(!(s&&C.size(s.dims)>0))return 3===a.dims.length&&(l=a.reshape([t,n,i,o])),1===i||1===n?l:e.compute(at(l,P0.perm),{inputs:[l],outputs:[-1]})[0];if(1===n)throw Error("AddBiasReshape is not implemented. Please export your model with packed QKV or KV");return l=(l=F3(e,a,s,t,n,i*o,u)).reshape([t,n,i,o]),1===i||1===n?l:e.compute(at(l,P0.perm),{inputs:[l],outputs:[-1]})[0]},C0=(e,t)=>{let i=B3(e.inputs,t),n=e.inputs[0],o=Tt(e.inputs,1),a=Tt(e.inputs,2),s=Tt(e.inputs,3),u=Tt(e.inputs,4),l=Tt(e.inputs,5),d=Tt(e.inputs,6),p=Tt(e.inputs,7);if(5===n.dims.length)throw Error("Packed QKV is not implemented");if(o?.dims.length===5)throw Error("Packed KV is not implemented");let c=o&&a&&4===o.dims.length&&4===a.dims.length,h=qo(e,i.batchSize,i.numHeads,i.sequenceLength,i.headSize,n,s,0);if(c)return po(e,h,o,a,u,void 0,d,p,l,i);if(!o||!a)throw Error("key and value must be provided");let f=qo(e,i.batchSize,i.numHeads,i.kvSequenceLength,i.headSize,o,s,i.hiddenSize),m=qo(e,i.batchSize,i.numHeads,i.kvSequenceLength,i.vHeadSize,a,s,2*i.hiddenSize);po(e,h,f,m,u,void 0,d,p,l,i)}}),Mc=k(()=>{"use strict";le(),ge(),Xe(),ye(),V3=e=>{if(!e||e.length<1)throw Error("too few inputs")},G3=(e,t)=>{let i=[],n=t.numOutputs;return e[1].dims[0]>0&&(e[1].getBigInt64Array().forEach(e=>i.push(Number(e))),n=i.length),ce({numOutputs:n,axis:t.axis,splitSizes:i})},U3=e=>`
fn calculateOutputIndex(index: u32) -> u32 {
    for (var i: u32 = 0u; i < ${e}u; i += 1u ) {
    if (index < ${Q("uniforms.size_in_split_axis","i",e)}) {
        return i;
    }
    }
    return ${e}u;
}`,W3=e=>{let t=e.length,i=[];for(let n=0;n<t;++n){let o=e[n].setByIndices("indices","input[global_idx]");1===t?i.push(o):0===n?i.push(`if (output_number == ${n}u) { ${o} }`):n===t-1?i.push(`else { ${o} }`):i.push(`else if (output_number == ${n}) { ${o} }`)}return`
      fn writeBufferData(output_number: u32, indices: ${e[0].type.indices}, global_idx: u32) {
        ${i.join(`
`)}
      }`},zc=(e,t)=>{let i=e[0].dims,n=C.size(i),o=e[0].dataType,a=C.normalizeAxis(t.axis,i.length),s=Array(t.numOutputs),u=N("input",o,i.length),l=Array(t.numOutputs),d=[],p=[],c=0,h=[{type:12,data:n}];for(let n=0;n<t.numOutputs;n++){c+=t.splitSizes[n],l[n]=c;let u=i.slice();u[a]=t.splitSizes[n],p.push(u),s[n]=G(`output${n}`,o,u.length),d.push({dims:p[n],dataType:e[0].dataType})}h.push({type:12,data:l},...W(i,...p));let f=e=>`
  ${e.registerUniform("input_size","u32").registerUniform("size_in_split_axis","u32",l.length).declareVariables(u,...s)}
  ${U3(l.length)}
  ${W3(s)}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.input_size")}

    var indices = ${u.offsetToIndices("global_idx")};
    var index = ${u.indicesGet("indices",a)};
    let output_number = calculateOutputIndex(index);
    if (output_number != 0) {
      index -= ${Q("uniforms.size_in_split_axis","output_number - 1u",l.length)};
      ${u.indicesSet("indices",a,"index")};
    }
    writeBufferData(output_number, indices, global_idx);
  }`;return{name:"Split",shaderCache:{hint:t.cacheKey,inputDependencies:["rank"]},getShaderSource:f,getRunData:()=>({outputs:d,dispatchGroup:{x:Math.ceil(n/64)},programUniforms:h})}},D0=(e,t)=>{V3(e.inputs);let i=1===e.inputs.length?t:G3(e.inputs,t);e.compute(zc(e.inputs,i),{inputs:[0]})},k0=e=>{let t=e.axis,i=e.splitSizes,n=e.numOutputs<0?i.length:e.numOutputs;if(n!==i.length)throw Error("numOutputs and splitSizes length must be equal");return ce({axis:t,numOutputs:n,splitSizes:i})}}),Bc=k(()=>{"use strict";le(),ge(),Xe(),ye(),H3=(e,t)=>{let[i,n,o,a]=e,{numHeads:s,rotaryEmbeddingDim:u}=t;if(3!==i.dims.length&&4!==i.dims.length)throw Error(`Input 'x' is expected to have 3 or 4 dimensions, got ${i.dims.length}`);if(!C.areEqual(n.dims,[])&&!C.areEqual(n.dims,[1])&&2!==n.dims.length)throw Error(`Input 'position_ids' is expected to have 0, 1, or 2 dimensions, got ${n.dims.length}`);if(2!==o.dims.length)throw Error(`Input 'cos_cache' is expected to have 2 dimensions, got ${o.dims.length}`);if(2!==a.dims.length)throw Error(`Input 'sin_cache' is expected to have 2 dimensions, got ${a.dims.length}`);if(!C.areEqual(o.dims,a.dims))throw Error("Inputs 'cos_cache' and 'sin_cache' are expected to have the same shape");if(u>0&&0===s)throw Error("num_heads must be provided if rotary_embedding_dim is specified");let l=i.dims[0],d=i.dims[i.dims.length-2],p=o.dims[0],c=C.sizeFromDimension(i.dims,1)/d,h=0===u?2*o.dims[1]:c/s;if(u>h)throw Error("rotary_embedding_dim must be less than or equal to head_size");if(2===n.dims.length){if(l!==n.dims[0])throw Error(`Input 'position_ids' dimension 0 should be of size batch_size, got ${n.dims[0]}`);if(d!==n.dims[1])throw Error(`Input 'position_ids' dimension 1 should be of size sequence_length, got ${n.dims[1]}`)}if(h/2!==o.dims[1]&&u/2!==o.dims[1])throw Error(`Input 'cos_cache' dimension 1 should be same as head_size / 2 or rotary_embedding_dim / 2, got ${o.dims[1]}`);if(d>p)throw Error("Updating cos_cache and sin_cache in RotaryEmbedding is not currently supported")},Xa=(e,t)=>{let{interleaved:i,numHeads:n,rotaryEmbeddingDim:o,scale:a}=t,s=e[0].dims[0],u=C.sizeFromDimension(e[0].dims,1),l=e[0].dims[e[0].dims.length-2],d=u/l,p=e[2].dims[1],c=0===o?2*p:d/n,h=[s,l,d/c,c-p],f=C.computeStrides(h),m=[{type:1,data:a},{type:12,data:h},{type:12,data:f},...3===e[0].dims.length?Array({type:12,data:[u,d,c,1]}):[],...4===e[0].dims.length?Array({type:12,data:[u,c,l*c,1]}):[],...W(e[0].dims,e[1].dims,e[2].dims,e[3].dims,e[0].dims)],g=t=>{let n=N("input",e[0].dataType,e[0].dims.length),o=N("position_ids",e[1].dataType,e[1].dims.length),a=N("cos_cache",e[2].dataType,e[2].dims.length),s=N("sin_cache",e[3].dataType,e[3].dims.length),u=G("output",e[0].dataType,e[0].dims.length);return t.registerUniforms([{name:"scale",type:"f32"},{name:"global_shape",type:"u32",length:h.length},{name:"global_strides",type:"u32",length:f.length},{name:"input_output_strides",type:"u32",length:f.length}]),`
        ${t.declareVariables(n,o,a,s,u)}

        ${t.mainStart(Wr)}
          let half_rotary_emb_dim = uniforms.${a.name}_shape[1];
          let bsnh = global_idx / uniforms.global_strides % uniforms.global_shape;
          let size = uniforms.global_shape[0] * uniforms.global_strides[0];
          ${t.guardAgainstOutOfBoundsWorkgroupSizes("size")}

          if (bsnh[3] < half_rotary_emb_dim) {
            let position_ids_idx =
                ${o.broadcastedIndicesToOffset("bsnh.xy",G("",o.type.tensor,2))};
            let position_id =
                u32(${o.getByOffset("position_ids_idx")}) + select(0, bsnh[1], position_ids_idx == 0);
            let i = dot(bsnh, uniforms.input_output_strides) + select(0, bsnh[3], ${i});
            let j = i + select(half_rotary_emb_dim, 1, ${i});
            let re = ${n.getByOffset("i")} * ${a.get("position_id","bsnh[3]")} -
                ${n.getByOffset("j")} * ${s.get("position_id","bsnh[3]")};
            ${u.setByOffset("i","re")}
            let im = ${n.getByOffset("i")} * ${s.get("position_id","bsnh[3]")} +
                ${n.getByOffset("j")} * ${a.get("position_id","bsnh[3]")};
            ${u.setByOffset("j","im")}
          } else {
            let k = dot(bsnh, uniforms.input_output_strides) + half_rotary_emb_dim;
            ${u.setByOffset("k",n.getByOffset("k"))}
          }
        }`};return{name:"RotaryEmbedding",shaderCache:{hint:ce({interleaved:i}).cacheKey,inputDependencies:["rank","rank","rank","rank"]},getShaderSource:g,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(C.size(h)/Wr)},programUniforms:m})}},N0=(e,t)=>{H3(e.inputs,t),e.compute(Xa(e.inputs,t))}}),z0=k(()=>{"use strict";Xe(),le(),Ba(),Rc(),Mc(),Yn(),Bc(),ye(),j3=(e,t)=>{if(t.doRotary&&e.length<=7)throw Error("cos_cache and sin_cache inputs are required if do_rotary is specified");let i=e[0],n=e[1],o=e[2],a=e[3],s=e[4];if(0!==t.doRotary&&e.length<=7)throw Error("cos_cast and sin_cache are expected if do_rotary attribute is non-zero");if(-1!==t.localWindowSize)throw Error("Local attention is not supported");if(0!==t.softcap)throw Error("Softcap is not supported");if(0!==t.rotaryInterleaved)throw Error("Rotary interleaved is not supported");if(t.smoothSoftmax)throw Error("Smooth softmax is not supported");if(3!==i.dims.length&&5!==i.dims.length)throw Error("Input query is expected to have 3 or 5 dimensions");let u=!1,l=i.dims[0],d=i.dims[1],p=3===i.dims.length?u?i.dims[2]/3:i.dims[2]:t.numHeads*i.dims[4],c=d,h=0,f=!n||0===n.dims.length,m=Math.floor(f?p/(t.numHeads+2*t.kvNumHeads):p/t.numHeads);f&&(p=m*t.numHeads);let g=a&&0!==a.dims.length,b=s&&0!==s.dims.length;if(g&&4===a.dims.length&&a.dims[0]===l&&a.dims[1]!==t.kvNumHeads&&a.dims[2]===t.kvNumHeads&&a.dims[3]===m)throw Error("BSNH pastKey/pastValue is not supported");if(g&&b){if(4!==a.dims.length)throw Error('Input "past_key" is expected to have 4 dimensions');if(4!==s.dims.length)throw Error('Input "past_value" is expected to have 4 dimensions');h=a.dims[2]}else if(g||b)throw Error('Input "past_key" and "past_value" shall be both present or both absent');let y=1;if(n&&n.dims.length>0){if(3!==i.dims.length)throw Error('Input "query" is expected to have 3 dimensions when key is given');if(n.dims.length<3||n.dims.length>5)throw Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(i.dims[0]!==n.dims[0])throw Error('Input "query" and "key" shall have same dim 0 (batch size)');if(3===n.dims.length){if(i.dims[2]%n.dims[2]!=0)throw Error('Dimension 2 of "query" should be a multiple of "key"');c=n.dims[1]}else if(5===n.dims.length){if(n.dims[2]!==t.numHeads||2!==n.dims[3]||n.dims[4]!==m)throw Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(o)throw Error('Expect "value" be none when "key" has packed kv format.');c=n.dims[1]}else{if(n.dims[1]!==t.numHeads||n.dims[3]!==m)throw Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');c=n.dims[2]}}else{if(3!==i.dims.length&&5!==i.dims.length)throw Error('Input "query" is expected to have 3 or 5 dimensions when key is empty');if(5===i.dims.length&&(i.dims[2]!==t.numHeads||3!==i.dims[3]))throw Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');y=3}let _=0,v=!1,x=t.kvNumHeads?m*t.kvNumHeads:p;if(o&&o.dims.length>0){if(3!==o.dims.length&&4!==o.dims.length)throw Error('Input "value" is expected to have 3 or 4 dimensions');if(i.dims[0]!==o.dims[0])throw Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(3===o.dims.length){if(c!==o.dims[1])throw Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');x=o.dims[2]}else{if(c!==o.dims[2])throw Error('Input "past_key" and "past_value" shall have the same dim 2 (kv_sequence_length)');x=o.dims[1]*o.dims[3],v=!0}}let w=e.length>4?e[5]:void 0;if(w&&1!==w.dims.length&&w.dims[0]!==l)throw Error('Input "seqlens" is expected to have 1 dimension and the same dim 0 as batch_size');return{batchSize:l,sequenceLength:d,pastSequenceLength:h,kvSequenceLength:c,totalSequenceLength:-1,maxSequenceLength:-1,inputHiddenSize:0,hiddenSize:p,vHiddenSize:x,headSize:m,vHeadSize:Math.floor(x/t.kvNumHeads),numHeads:t.numHeads,kvNumHeads:t.kvNumHeads,nReps:t.numHeads/t.kvNumHeads,pastPresentShareBuffer:!1,maskType:_,scale:t.scale,broadcastResPosBias:!1,passPastInKv:v,qkvFormat:y}},q3=ce({perm:[0,2,1,3]}),L0=(e,t,i)=>{let n=t,o=i.kvNumHeads;return 3===t.dims.length&&0!==i.kvSequenceLength&&(n=t.reshape([i.batchSize,i.kvSequenceLength,o,i.headSize]),n=e.compute(at(n,q3.perm),{inputs:[n],outputs:[-1]})[0]),n},K3=(e,t,i,n)=>{let o=7,a=[e*t],s=e*t,u=[{type:12,data:s},{type:12,data:t},{type:12,data:e}];return{name:"GeneratePositionIds",shaderCache:{hint:`${e};${t}`,inputDependencies:["type","type"]},getRunData:()=>({outputs:[{dims:a,dataType:o}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:u}),getShaderSource:e=>{let t=N("seq_lens",i.dataType,i.dims),s=N("total_seq_lens",n.dataType,n.dims),u=G("pos_ids",o,a),l=[{name:"output_size",type:"u32"},{name:"sequence_length",type:"u32"},{name:"batch_size",type:"u32"}];return`
  ${e.registerUniforms(l).declareVariables(t,s,u)}
  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let total_sequence_length = u32(${s.getByOffset("0")});
    let is_subsequent_prompt = uniforms.sequence_length > 1 && uniforms.sequence_length != total_sequence_length;
    let is_first_prompt = !is_subsequent_prompt && uniforms.sequence_length == total_sequence_length;
    let batch_idx = global_idx / uniforms.sequence_length;
    let sequence_idx = i32(global_idx % uniforms.sequence_length);
    var pos_id: i32 = 0;
    let seqlen = ${t.getByOffset("batch_idx")};
    let total_seqlen = seqlen + 1;
    if (is_first_prompt) {
      if (sequence_idx < total_seqlen) {
        pos_id = sequence_idx;
      } else {
        pos_id = 1;
      }
      ${u.setByOffset("global_idx","pos_id")}
    } else if (is_subsequent_prompt) {
      let past_seqlen = total_seqlen - i32(uniforms.sequence_length);
      if (past_seqlen + sequence_idx < total_seqlen) {
        pos_id = past_seqlen + sequence_idx;
      } else {
        pos_id = 1;
      }
      ${u.setByOffset("global_idx","pos_id")}
    } else if (global_idx < uniforms.batch_size) {
      ${u.setByOffset("global_idx","seqlen")}
    };
  }
  `}}},R0=(e,t)=>{let i=j3(e.inputs,t);if(5===e.inputs[0].dims.length)throw Error("Packed QKV is not implemented");if(e.inputs[1]?.dims.length===5)throw Error("Packed KV is not implemented");let n=e.inputs[0],o=e.inputs[1]&&e.inputs[1].dims.length>0?e.inputs[1]:void 0,a=e.inputs[2]&&e.inputs[2].dims.length>0?e.inputs[2]:void 0,s=e.inputs[3]&&0!==e.inputs[3].dims.length?e.inputs[3]:void 0,u=e.inputs[4]&&0!==e.inputs[4].dims.length?e.inputs[4]:void 0,l=e.inputs.length>4?e.inputs[5]:void 0,d=e.inputs.length>5?e.inputs[6]:void 0,p=i.kvNumHeads?i.kvNumHeads:i.numHeads,c=ce({axis:2,numOutputs:3,splitSizes:[i.numHeads*i.headSize,p*i.headSize,p*i.headSize]}),[h,f,m]=o||a?[n,o,a]:e.compute(zc([n],c),{inputs:[n],outputs:[-1,-1,-1]}),g,b;if(t.doRotary){let n=e.compute(K3(i.batchSize,i.sequenceLength,l,d),{inputs:[l,d],outputs:[-1]})[0],o=e.inputs[7],a=e.inputs[8],s=ce({interleaved:0!==t.rotaryInterleaved,numHeads:i.numHeads,rotaryEmbeddingDim:0,scale:t.scale}),u=[h,n,o,a],p=[-1];g=e.compute(Xa(u,s),{inputs:u,outputs:p})[0],u.splice(0,1,f);let c=ce({interleaved:0!==t.rotaryInterleaved,numHeads:i.kvNumHeads,rotaryEmbeddingDim:0,scale:t.scale});b=e.compute(Xa(u,c),{inputs:u,outputs:p})[0]}let y=qo(e,i.batchSize,i.numHeads,i.sequenceLength,i.headSize,t.doRotary?g:h,void 0,0),_=L0(e,t.doRotary?b:f,i),v=L0(e,m,i);po(e,y,_,v,void 0,void 0,s,u,void 0,i,l,d)}}),F0=k(()=>{"use strict";le(),ge(),Yn(),ye(),M0=(e,t,i,n,o,a,s,u)=>{let l=Ee(a),d=1===l?"f32":`vec${l}f`,p=1===l?"vec2f":`mat2x${l}f`,c=o*s,h=64;1===c&&(h=256);let f=[o,s,a/l],m=[o,s,2],g=["rank","type","type"],b=[];b.push(...W(f,m));let y=e=>{let o=N("x",t.dataType,3,l),a=[o,N("scale",i.dataType,i.dims),N("bias",n.dataType,n.dims),G("output",1,3,2)];return`
  var<workgroup> workgroup_shared : array<${p}, ${h}>;
  const workgroup_size = ${h}u;
  ${e.declareVariables(...a)}
  ${e.mainStart(h)}
    let batch = workgroup_index / uniforms.x_shape[1];
    let channel = workgroup_index % uniforms.x_shape[1];
    let hight = uniforms.x_shape[2];
    // initialize workgroup memory
    var sum = ${d}(0);
    var squared_sum = ${d}(0);
    for (var h = local_idx; h < hight; h += workgroup_size) {
      let value = ${d}(${o.get("batch","channel","h")});
      sum += value;
      squared_sum += value * value;
    }
    workgroup_shared[local_idx] = ${p}(sum, squared_sum);
    workgroupBarrier();

    for (var currSize = workgroup_size >> 1;  currSize > 0; currSize = currSize >> 1) {
      if (local_idx < currSize) {
        workgroup_shared[local_idx] = workgroup_shared[local_idx] + workgroup_shared[local_idx + currSize];
      }
      workgroupBarrier();
    }
    if (local_idx == 0) {
      let sum_final = ${Kt("workgroup_shared[0][0]",l)} / f32(hight * ${l});
      let squared_sum_final = ${Kt("workgroup_shared[0][1]",l)} / f32(hight * ${l});

      let inv_std_dev = inverseSqrt(squared_sum_final - sum_final * sum_final + f32(${u}));
      let channel_scale = inv_std_dev * f32(scale[channel]);
      let channel_shift = f32(bias[channel]) - sum_final * channel_scale;
      output[workgroup_index] = vec2f(channel_scale, channel_shift);
    }
  }`};return e.compute({name:"InstanceNormComputeChannelScaleShift",shaderCache:{hint:`${l};${u};${h}`,inputDependencies:g},getRunData:()=>({outputs:[{dims:m,dataType:1}],dispatchGroup:{x:c},programUniforms:b}),getShaderSource:y},{inputs:[t,i,n],outputs:[-1]})[0]},X3=(e,t,i)=>{let n=t[0].dims,o=n,a=2,s=n[0],u=n[1],l=C.sizeFromDimension(n,a),d=Ee(l),p=C.size(o)/d,c=M0(e,t[0],t[1],t[2],s,l,u,i.epsilon),h=[s,u,l/d],f=[s,u],m=["type","none"],g=e=>{let i=N("x",t[0].dataType,h.length,d),n=N("scale_shift",1,f.length,2),o=G("output",t[0].dataType,h.length,d),a=[i,n,o];return`
  ${e.registerUniform("output_size","u32").declareVariables(...a)}
  ${e.mainStart()}
  ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let outputIndices = ${o.offsetToIndices("global_idx")};
      let batch = outputIndices[0];
      let channel = outputIndices[1];
      let scale_shift = ${n.getByIndices("vec2<u32>(batch, channel)")};
      let value = ${i.getByOffset("global_idx")} * ${o.type.value}(scale_shift.x) + ${o.type.value}(scale_shift.y);
      ${o.setByOffset("global_idx","value")};
  }`};e.compute({name:"InstanceNormalization",shaderCache:{hint:`${d}`,inputDependencies:m},getRunData:()=>({outputs:[{dims:o,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(p/64)},programUniforms:[{type:12,data:p},...W(h,f,h)]}),getShaderSource:g},{inputs:[t[0],c]})},Z3=(e,t,i)=>{let n=t[0].dims,o=n,a=n[0],s=n[n.length-1],u=C.sizeFromDimension(n,1)/s,l=Ee(s),d=C.size(o)/l,p=[{type:12,data:u},{type:12,data:Math.floor(s/l)}],c=["type","type"],h=!1,f=[0,n.length-1];for(let e=0;e<n.length-2;e++)h=h||1!==n[e+1],f.push(e+1);let m=(h=h&&1!==n[n.length-1])?e.compute(at(e.inputs[0],f),{inputs:[e.inputs[0]],outputs:[-1]})[0]:e.inputs[0].reshape(Array.from({length:n.length},(e,t)=>n[f[t]])),g=M0(e,m,t[1],t[2],a,u,s,i.epsilon),b=e=>{let i=Ve(t[0].dataType),n=1===l?"vec2f":`mat${l}x2f`,a=e=>{let t=0===e?"x":"y",n=1===l?"f32":`vec${l}f`;switch(l){case 1:return`${i}(${n}(scale.${t}))`;case 2:return`vec2<${i}>(${n}(scale[0].${t}, scale[1].${t}))`;case 4:return`vec4<${i}>(${n}(scale[0].${t}, scale[1].${t}, scale[2].${t}, scale[3].${t}))`;default:throw Error(`Not supported compoents ${l}`)}},s=N("input",t[0].dataType,t[0].dims,l),u=G("output",t[0].dataType,o,l);return`
  @group(0) @binding(0) var<storage, read> input : array<${s.type.storage}>;
  @group(0) @binding(1) var<storage, read> scale_input : array<${n}>;
  @group(0) @binding(2) var<storage, read_write> output : array<${u.type.storage}>;
  struct Uniforms {H: u32, C : u32};
  @group(0) @binding(3) var<uniform> uniforms: Uniforms;

  ${e.mainStart()}
    let current_image_number = global_idx / (uniforms.C * uniforms.H);
    let current_channel_number = global_idx % uniforms.C;

    let scale_offset = current_image_number * uniforms.C + current_channel_number;
    let scale = scale_input[scale_offset];
    output[global_idx] = fma(input[global_idx], ${a(0)}, ${a(1)});
  }`};e.compute({name:"InstanceNormalizationNHWC",shaderCache:{hint:`${l}`,inputDependencies:c},getRunData:()=>({outputs:[{dims:o,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:p}),getShaderSource:b},{inputs:[t[0],g]})},B0=(e,t)=>{"NHWC"===t.format?Z3(e,e.inputs,t):X3(e,e.inputs,t)}}),G0=k(()=>{"use strict";le(),ge(),ye(),J3=e=>{if(!e||e.length<2)throw Error("layerNorm requires at least 2 inputs.")},Y3=(e,t,i)=>{let n=t.simplified,o=e[0].dims,a=e[1],s=!n&&e[2],u=o,l=C.normalizeAxis(t.axis,o.length),d=C.sizeToDimension(o,l),p=C.sizeFromDimension(o,l),c=C.size(a.dims),h=s?C.size(s.dims):0;if(c!==p||s&&h!==p)throw Error(`Size of X.shape()[axis:] == ${p}.
       Size of scale and bias (if provided) must match this.
       Got scale size of ${c} and bias size of ${h}`);let f=[];for(let e=0;e<o.length;++e)e<l?f.push(o[e]):f.push(1);let m=Ee(p),g=["type","type"],b=[{type:12,data:d},{type:1,data:p},{type:12,data:Math.floor(p/m)},{type:1,data:t.epsilon}];s&&g.push("type");let y=i>1,_=i>2,v=t=>{let i=Ve(e[0].dataType),o=[N("x",e[0].dataType,e[0].dims,m),N("scale",a.dataType,a.dims,m)];s&&o.push(N("bias",s.dataType,s.dims,m)),o.push(G("output",e[0].dataType,u,m)),y&&o.push(G("mean_data_output",1,f)),_&&o.push(G("inv_std_output",1,f));let l=[{name:"norm_count",type:"u32"},{name:"norm_size",type:"f32"},{name:"norm_size_vectorized",type:"u32"},{name:"epsilon",type:"f32"}];return`
  ${t.registerUniforms(l).declareVariables(...o)}
  ${t.mainStart()}
    ${t.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.norm_count")}
    let offset = global_idx * uniforms.norm_size_vectorized;
    var mean_vector = ${wc("f32",m)};
    var mean_square_vector = ${wc("f32",m)};

    for (var h: u32 = 0u; h < uniforms.norm_size_vectorized; h++) {
      let value = ${Hr(i,m,"x[h + offset]")};
      mean_vector += value;
      mean_square_vector += value * value;
    }
    let mean = ${Kt("mean_vector",m)} / uniforms.norm_size;
    let inv_std_dev = inverseSqrt(${Kt("mean_square_vector",m)} / uniforms.norm_size ${n?"":"- mean * mean"} + uniforms.epsilon);

    for (var j: u32 = 0; j < uniforms.norm_size_vectorized; j++) {
      let f32input = ${Hr(i,m,"x[j + offset]")};
      let f32scale = ${Hr(i,m,"scale[j]")};
      output[j + offset] = ${o[0].type.value}((f32input ${n?"":"- mean"}) * inv_std_dev * f32scale
        ${s?`+ ${Hr(i,m,"bias[j]")}`:""}
      );
    }

    ${y?"mean_data_output[global_idx] = mean":""};
    ${_?"inv_std_output[global_idx] = inv_std_dev":""};
  }`},x=[{dims:u,dataType:e[0].dataType}];return y&&x.push({dims:f,dataType:1}),_&&x.push({dims:f,dataType:1}),{name:"LayerNormalization",shaderCache:{hint:`${m};${i};${n}`,inputDependencies:g},getRunData:()=>({outputs:x,dispatchGroup:{x:Math.ceil(d/64)},programUniforms:b}),getShaderSource:v}},V0=(e,t)=>{J3(e.inputs),e.compute(Y3(e.inputs,t,e.outputCount))}}),W0=k(()=>{"use strict";ge(),Ha(),ja(),Q3=e=>{if(!e||2!==e.length)throw Error("MatMul requires 2 inputs.");if(e[0].dims[e[0].dims.length-1]!==e[1].dims[e[1].dims.length-2])throw Error("shared dimension does not match.")},U0=e=>{Q3(e.inputs);let t=Fn.calcShape(e.inputs[0].dims,e.inputs[1].dims,!0);if(!t)throw Error("Can't use matmul on the given tensors");let i=t[t.length-1],n=e.inputs[0].dims[e.inputs[0].dims.length-1];if(i<8&&n<8)e.compute(Wa(e.inputs,{activation:""},t));else{let o=t[t.length-2],a=C.size(e.inputs[0].dims.slice(0,-2)),s=C.size(e.inputs[1].dims.slice(0,-2));if(1!==a&&1===o&&1===s){let o=e.inputs[0].reshape([1,a,n]),s=e.inputs[1].reshape([1,n,i]),u=[1,a,i],l=[o,s];e.compute(jo(l,{activation:""},t,u),{inputs:l})}else e.compute(jo(e.inputs,{activation:""},t))}}}),q0=k(()=>{"use strict";le(),ge(),Xe(),ye(),eE=(e,t)=>{if(e.length<3||e.length>4)throw Error("MatMulNBits requires 3 or 4 inputs");let i=e[0],n=i.dims.length;if(i.dims[n-1]!==t.k)throw Error("The last dim of input shape does not match the k value");let o=Math.floor((t.k+t.blockSize-1)/t.blockSize),a=t.blockSize/8*t.bits,s=e[1];if(!C.areEqual(s.dims,[t.n,o,a]))throw Error("The second inputs must be 3D tensor with shape N X nBlocksPerCol X blobSize");let u=e[2].dims;if(C.size(u)!==t.n*o)throw Error("scales input size error.");if(4===e.length){let i=e[3].dims,n=t.n*(8===t.bits?o:Math.floor((o*t.bits+7)/8));if(C.size(i)!==n)throw Error("zeroPoints input size error.")}},tE=(e,t)=>{let i=e[0].dims,n=i.length,o=i[n-2],a=t.k,s=t.n,u=i.slice(0,n-2),l=C.size(u),d=e[1].dims[2]/4,p=e[0].dataType,c=Ee(t.k),h=Ee(d),f=Ee(s),m=u.concat([o,s]),g=o>1&&s/f%2==0?2:1,b=C.size(m)/f/g,y=64,_=[],v=[l,o,a/c],x=C.convertShape(e[1].dims).slice();x.splice(-1,1,d/h),_.push(...W(v)),_.push(...W(x)),_.push(...W(e[2].dims)),4===e.length&&_.push(...W(C.convertShape(e[3].dims)));let w=[l,o,s/f];_.push(...W(w));let $=i=>{let n=v.length,o=N("a",e[0].dataType,n,c),a=N("b",12,x.length,h),s=N("scales",e[2].dataType,e[2].dims.length),u=[o,a,s],l=4===e.length?N("zero_points",12,e[3].dims.length):void 0;l&&u.push(l);let p=w.length,m=G("output",e[0].dataType,p,f),b=Ve(e[0].dataType),_=(()=>{switch(c){case 1:return`array<${b}, 8>`;case 2:return`mat4x2<${b}>`;case 4:return`mat2x4<${b}>`;default:throw Error(`${c}-component is not supported.`)}})(),$=()=>{let e=`
          // reuse a data
            var input_offset = ${o.indicesToOffset(`${o.type.indices}(batch, row, word_offset)`)};
            var a_data: ${_};
            for (var j: u32 = 0; j < ${8/c}; j++) {
              a_data[j] = ${o.getByOffset("input_offset")};
              input_offset++;
            }
          `;for(let t=0;t<f*g;t++)e+=`
            b_value = ${1===h?`b${t}_data`:`b${t}_data[i]`};
            b_value_lower = unpack4xU8(b_value & b_mask);
            b_value_upper = unpack4xU8((b_value >> 4) & b_mask);
            b_quantized_values = ${_}(${Array.from({length:4},(e,t)=>`${b}(b_value_lower[${t}]), ${b}(b_value_upper[${t}])`).join(", ")});
            b_dequantized_values = ${1===c?`${_}(${Array.from({length:8},(e,i)=>`(b_quantized_values[${i}] - ${l?`zero_point${t}`:"zero_point"}) * scale${t}`).join(", ")});`:`(b_quantized_values - ${_}(${Array(8).fill(`${l?`zero_point${t}`:"zero_point"}`).join(",")})) * scale${t};`};
            workgroup_shared[local_id.x * ${g} + ${Math.floor(t/f)}]${f>1?`[${t%f}]`:""} += ${Array.from({length:8/c},(e,t)=>`${1===c?`a_data[${t}] * b_dequantized_values[${t}]`:`dot(a_data[${t}], b_dequantized_values[${t}])`}`).join(" + ")};
          `;return e},T=()=>{let e=`
            var col_index = col * ${f};
            ${l?`
            let zero_point_bytes_per_col = (nBlocksPerCol + 1) / 2;
            var zero_point_byte_count: u32;
            var zero_point_word_index: u32;
            var zero_point_byte_offset: u32;
            let zero_point_nibble_offset: u32 = block & 0x1u;
            var zero_point_bits_offset: u32;
            var zero_point_word: u32;`:`
            // The default zero point is 8 for unsigned 4-bit quantization.
            let zero_point = ${b}(8);`}
            `;for(let t=0;t<f*g;t++)e+=`
            let scale${t} = ${s.getByOffset("col_index * nBlocksPerCol + block")};
            ${l?`
            zero_point_byte_count = col_index * zero_point_bytes_per_col + (block >> 0x1u);
            zero_point_word_index = zero_point_byte_count >> 0x2u;
            zero_point_byte_offset = zero_point_byte_count & 0x3u;
            zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_nibble_offset << 2);
            zero_point_word = ${l.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point${t} = ${b}((zero_point_word) & 0xFu);`:""}
            col_index += 1;`;return e},I=()=>{let e=`col_index = col * ${f};`;for(let t=0;t<f*g;t++)e+=`
            let b${t}_data = ${a.getByIndices(`${a.type.indices}(col_index, block, word)`)};
            col_index += 1;`;return e+`
            var b_value: u32;
            let b_mask: u32 = 0x0F0F0F0Fu;
            var b_value_lower: vec4<u32>;
            var b_value_upper: vec4<u32>;
            var b_quantized_values: ${_};
            var b_dequantized_values: ${_};`};return`
        var<workgroup> workgroup_shared: array<${m.type.value}, ${g*y}>;
        ${i.declareVariables(...u,m)}
        ${i.mainStart([y,1,1])}
          let output_indices = ${m.offsetToIndices(`(global_idx / ${y}) * ${g}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let nBlocksPerCol = uniforms.b_shape[1];

          for (var block = local_id.x; block < nBlocksPerCol; block += ${y}) {
            //process one block
            var word_offset: u32 = block * ${t.blockSize/c};
            ${T()}
            for (var word: u32 = 0; word < ${d}; word += ${h}) {
              ${I()}
              for (var i: u32 = 0; i < ${h}; i++) {
                ${$()}
                word_offset += ${8/c};
              }
            }
          }
          workgroupBarrier();

          if (local_id.x < ${g}) {
            var output_value: ${m.type.value} = ${m.type.value}(0);
            var workgroup_shared_offset: u32 = local_id.x;
            for (var b: u32 = 0u; b < ${y}u; b++) {
              output_value += workgroup_shared[workgroup_shared_offset];
              workgroup_shared_offset += ${g};
            }
            ${m.setByIndices(`${m.type.indices}(batch, row, col + local_id.x)`,"output_value")};
          }
        }`};return{name:"MatMulNBits",shaderCache:{hint:`${t.blockSize};${t.bits};${c};${h};${f};${g};${y}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:m,dataType:p}],dispatchGroup:{x:b},programUniforms:_}),getShaderSource:$}},nE=(e,t)=>{let i=e[0].dims,n=i.length,o=i[n-2],a=t.k,s=t.n,u=i.slice(0,n-2),l=C.size(u),d=e[1].dims[2]/4,p=e[0].dataType,c=Ee(t.k),h=Ee(d),f=u.concat([o,s]),m=128,g=s%8==0?8:s%4==0?4:1,b=128/g,y=b*h*8,_=y/c,v=y/t.blockSize,x=C.size(f)/g,w=[],$=[l,o,a/c],T=C.convertShape(e[1].dims).slice();T.splice(-1,1,d/h),w.push(...W($)),w.push(...W(T)),w.push(...W(e[2].dims)),4===e.length&&w.push(...W(C.convertShape(e[3].dims)));let I=[l,o,s];w.push(...W(I));let S=i=>{let n=$.length,o=N("a",e[0].dataType,n,c),a=N("b",12,T.length,h),s=N("scales",e[2].dataType,e[2].dims.length),u=[o,a,s],l=4===e.length?N("zero_points",12,e[3].dims.length):void 0;l&&u.push(l);let d=I.length,p=G("output",e[0].dataType,d),f=Ve(e[0].dataType),y=()=>{switch(c){case 1:return`
          let a_data0 = vec4<${f}>(sub_a[word_offset], sub_a[word_offset + 1], sub_a[word_offset + 2], sub_a[word_offset + 3]);
          let a_data1 = vec4<${f}>(sub_a[word_offset + 4], sub_a[word_offset + 5], sub_a[word_offset + 6], sub_a[word_offset + 7]);`;case 2:return`
          let a_data0 = vec4<${f}>(sub_a[word_offset], sub_a[word_offset + 1]);
          let a_data1 = vec4<${f}>(sub_a[word_offset + 2], sub_a[word_offset + 3]);`;case 4:return`
          let a_data0 = sub_a[word_offset];
          let a_data1 = sub_a[word_offset + 1];`;default:throw Error(`${c}-component is not supported.`)}};return`
        var<workgroup> sub_a: array<${o.type.value}, ${_}>;
        var<workgroup> inter_results: array<array<${p.type.value}, ${b}>, ${g}>;
        ${i.declareVariables(...u,p)}
        ${i.mainStart([b,g,1])}
          let output_indices = ${p.offsetToIndices(`workgroup_index * ${g}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let n_blocks_per_col = uniforms.b_shape[1];
          let num_tiles =  (n_blocks_per_col - 1) / ${v} + 1;

          // Loop over shared dimension.
          for (var tile: u32 = 0; tile < num_tiles; tile += 1) {
            let a_col_start = tile * ${_};
            // load one tile A data into shared memory.
            for (var a_offset = local_idx; a_offset < ${_}; a_offset += ${m})
            {
              let a_col = a_col_start + a_offset;
              if (a_col < uniforms.a_shape[2])
              {
                sub_a[a_offset] = ${o.getByIndices(`${o.type.indices}(batch, row, a_col)`)};
              } else {
                sub_a[a_offset] = ${o.type.value}(0);
              }
            }
            workgroupBarrier();

            // each thread process one block
            let b_row = col + local_id.y;
            let block = tile * ${v} + local_id.x;
            ${l?`
            let zero_point_bytes_per_col = (n_blocks_per_col + 1) / 2;
            let zero_point_byte_count = b_row * zero_point_bytes_per_col + (block >> 0x1u);
            let zero_point_word_index = zero_point_byte_count >> 0x2u;
            let zero_point_byte_offset = zero_point_byte_count & 0x3u;
            let zero_point_nibble_offset: u32 = block & 0x1u;
            let zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_nibble_offset << 2);
            let zero_point_word = ${l.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point = ${f}((zero_point_word) & 0xFu);`:`
            // The default zero point is 8 for unsigned 4-bit quantization.
            let zero_point = ${f}(8);`}
            let scale = ${s.getByOffset("b_row * n_blocks_per_col + block")};
            let b_data = ${a.getByIndices(`${a.type.indices}(b_row, block, 0)`)};
            var word_offset = local_id.x * ${t.blockSize/c};
            for (var i: u32 = 0; i < ${h}; i++) {
              ${y()}
              let b_value = ${1===h?"b_data":"b_data[i]"};
              let b_value_lower = unpack4xU8(b_value & 0x0F0F0F0Fu);
              let b_value_upper = unpack4xU8((b_value >> 4) & 0x0F0F0F0Fu);
              let b_quantized_values = mat2x4<${f}>(${Array.from({length:4},(e,t)=>`${f}(b_value_lower[${t}]), ${f}(b_value_upper[${t}])`).join(", ")});
              let b_dequantized_values = (b_quantized_values - mat2x4<${f}>(${Array(8).fill("zero_point").join(",")})) * scale;
              inter_results[local_id.y][local_id.x] += ${Array.from({length:2},(e,t)=>`dot(a_data${t}, b_dequantized_values[${t}])`).join(" + ")};
              word_offset += ${8/c};
            }
            workgroupBarrier();
          }

          if (local_idx < ${g}) {
            var output_value: ${p.type.value} = ${p.type.value}(0);
            for (var b = 0u; b < ${b}; b++) {
              output_value += inter_results[local_idx][b];
            }
            if (col + local_idx < uniforms.output_shape[2])
            {
              ${p.setByIndices(`${p.type.indices}(batch, row, col + local_idx)`,"output_value")}
            }
          }
        }`};return{name:"BlockwiseMatMulNBits32",shaderCache:{hint:`${t.blockSize};${c};${h};${b};${g}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:f,dataType:p}],dispatchGroup:{x:x},programUniforms:w}),getShaderSource:S}},H0=(e,t)=>{eE(e.inputs,t),32===t.blockSize&&e.adapterInfo.isVendor("intel")&&e.adapterInfo.isArchitecture("gen-12lp")?e.compute(nE(e.inputs,t)):e.compute(tE(e.inputs,t))},j0=e=>ce(e)}),X0=k(()=>{"use strict";le(),ge(),ye(),rE=e=>{if(!e||e.length<1)throw Error("Too few inputs");if(1!==e[0].dataType&&10!==e[0].dataType)throw Error("Input type must be float or float16.");if(e.length>=2){let t=2*e[0].dims.length===e[1].dims[0];if(4===e.length&&(t=2*e[3].dims[0]===e[1].dims[0]),!t)throw Error("The pads should be a 1D tensor of shape [2 * input_rank] or [2 * num_axes].")}},oE=(e,t,i)=>{let n="";for(let o=t-1;o>=0;--o)n+=`
            k = i32(${e.indicesGet("indices",o)}) - ${Q("uniforms.pads",o,i)};
            if (k < 0) {
              break;
            }
            if (k >= i32(${Q("uniforms.x_shape",o,t)})) {
              break;
            }
            offset += k * i32(${Q("uniforms.x_strides",o,t)});
        `;return`
          value = ${e.type.value}(uniforms.constant_value);
          for (var i = 0; i < 1; i++) {
            var offset = 0;
            var k = 0;
            ${n}
            value = x[offset];
          }
      `},iE=(e,t,i)=>{let n="";for(let o=t-1;o>=0;--o)n+=`
                k = i32(${e.indicesGet("indices",o)}) - ${Q("uniforms.pads",o,i)};
                if (k < 0) {
                  k = -k;
                }
                {
                  let _2n_1 = 2 * (i32(${Q("uniforms.x_shape",o,t)}) - 1);
                  k = k % _2n_1;
                  if(k >= i32(${Q("uniforms.x_shape",o,t)})) {
                    k = _2n_1 - k;
                  }
                }
                offset += k * i32(${Q("uniforms.x_strides",o,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${n}
              value = x[offset];
          `},aE=(e,t,i)=>{let n="";for(let o=t-1;o>=0;--o)n+=`
                k = i32(${e.indicesGet("indices",o)}) - ${Q("uniforms.pads",o,i)};
                if (k < 0) {
                  k = 0;
                }
                if (k >= i32(${Q("uniforms.x_shape",o,t)})) {
                  k = i32(${Q("uniforms.x_shape",o,t)}) - 1;
                }
                offset += k * i32(${Q("uniforms.x_strides",o,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${n}
              value = x[offset];
          `},sE=(e,t,i)=>{let n="";for(let o=t-1;o>=0;--o)n+=`
                k = i32(${e.indicesGet("indices",o)}) - ${Q("uniforms.pads",o,i)};
                if (k < 0)  {
                  k += i32(${Q("uniforms.x_shape",o,t)}]);
                }
                if (k >= i32(${Q("uniforms.x_shape",o,t)})) {
                  k -= i32(${Q("uniforms.x_shape",o,t)});
                }
                offset += k * i32(${Q("uniforms.x_strides",o,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${n}
              value = x[offset];
          `},uE=(e,t,i)=>{switch(i.mode){case 0:return oE(e,t,i.pads.length);case 1:return iE(e,t,i.pads.length);case 2:return aE(e,t,i.pads.length);case 3:return sE(e,t,i.pads.length);default:throw Error("Invalid mode")}},lE=(e,t)=>{let i=C.padShape(e[0].dims.slice(),t.pads),n=e[0].dims,o=[{type:12,data:C.size(i)},{type:6,data:t.pads}],a=e.length>=3&&e[2].data;0===t.mode&&o.push({type:a?e[2].dataType:1,data:t.value}),o.push(...W(e[0].dims,i));let s=["rank"],u=o=>{let s=G("output",e[0].dataType,i.length),u=N("x",e[0].dataType,n.length),l=u.type.value,d=uE(s,n.length,t),p=[{name:"output_size",type:"u32"},{name:"pads",type:"i32",length:t.pads.length}];return 0===t.mode&&p.push({name:"constant_value",type:a?l:"f32"}),`
            ${o.registerUniforms(p).declareVariables(u,s)}
            ${o.mainStart()}
            ${o.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

            let indices = ${s.offsetToIndices("global_idx")};

            var value = ${l}(0);
            ${d}
            output[global_idx] = value;
        }`};return{name:"Pad",shaderCache:{hint:`${t.mode}${a}`,inputDependencies:s},getRunData:()=>({outputs:[{dims:i,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(C.size(i)/64)},programUniforms:o}),getShaderSource:u}},cE=(e,t)=>{if(!(e.length>1))return t;{let i=e[1].getBigInt64Array(),n=e.length>=3&&e[2].data?10===e[2].dataType?e[2].getUint16Array()[0]:e[2].getFloat32Array()[0]:0,o=e[0].dims.length,a=new Int32Array(2*o).fill(0);if(e.length>=4){let t=e[3].getBigInt64Array();for(let e=0;e<t.length;e++)a[Number(t[e])]=Number(i[e]),a[Number(t[e])+o]=Number(i[e+t.length])}else i.forEach((e,t)=>a[Number(t)]=Number(e));let s=[];return a.forEach(e=>s.push(e)),{mode:t.mode,value:n,pads:s}}},K0=(e,t)=>{rE(e.inputs);let i=cE(e.inputs,t);e.compute(lE(e.inputs,i),{inputs:[0]})}}),pw=k(()=>{"use strict";pt(),le(),ge(),ye(),Za=e=>{if(me.webgpu.validateInputContent&&(!e||1!==e.length))throw Error("Pool ops requires 1 input.")},Z0=(e,t,i)=>{let n="NHWC"===t.format,o=e.dims.slice();n&&o.splice(1,0,o.pop());let a=Object.hasOwnProperty.call(t,"dilations"),s=t.kernelShape.slice(),u=t.strides.slice(),l=a?t.dilations.slice():[],d=t.pads.slice();Ur.adjustPoolAttributes(i,o,s,u,l,d);let p=Ur.computePoolOutputShape(i,o,u,l,s,d,t.autoPad),c=Object.assign({},t);a?Object.assign(c,{kernelShape:s,strides:u,pads:d,dilations:l,cacheKey:t.cacheKey}):Object.assign(c,{kernelShape:s,strides:u,pads:d,cacheKey:t.cacheKey});let h=p.slice();return h.push(h.splice(1,1)[0]),[c,n?h:p]},J0=(e,t)=>{let i="NHWC"===t.format,n=[{type:12,data:C.size(e)},{type:12,data:C.size(t.kernelShape)}],o=[{name:"outputSize",type:"u32"},{name:"kernelSize",type:"u32"}];if(t.kernelShape.length<=2){let e=t.kernelShape[t.kernelShape.length-1],i=t.strides[t.strides.length-1],a=t.pads[t.pads.length/2-1],s=t.pads[t.pads.length-1],u=!!(a+s);n.push({type:12,data:e},{type:12,data:i},{type:12,data:a},{type:12,data:s}),o.push({name:"kw",type:"u32"},{name:"sw",type:"u32"},{name:"pwStart",type:"u32"},{name:"pwEnd",type:"u32"});let l=!1;if(2===t.kernelShape.length){let e=t.kernelShape[t.kernelShape.length-2],i=t.strides[t.strides.length-2],a=t.pads[t.pads.length/2-2],s=t.pads[t.pads.length-2];l=!!(a+s),n.push({type:12,data:e},{type:12,data:i},{type:12,data:a},{type:12,data:s}),o.push({name:"kh",type:"u32"},{name:"sh",type:"u32"},{name:"phStart",type:"u32"},{name:"phEnd",type:"u32"})}return[n,o,!0,u,l]}{if(i)throw Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let e=C.computeStrides(t.kernelShape);return n.push({type:12,data:e},{type:12,data:t.pads},{type:12,data:t.strides}),o.push({name:"kernelStrides",type:"u32",length:e.length},{name:"pads",type:"u32",length:t.pads.length},{name:"strides",type:"u32",length:t.strides.length}),[n,o,!!t.pads.reduce((e,t)=>e+t),!1,!1]}},Y0=(e,t,i,n,o,a,s,u,l,d,p,c)=>{let h="NHWC"===o.format,f=t.type.value,m=G("output",t.type.tensor,n);if(o.kernelShape.length<=2){let n="",d="",g="",b=i-(h?2:1);if(n=p?`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${b}] = indices[${b}] * uniforms.sw - uniforms.pwStart + i;
                  if (xIndices[${b}] < 0 || xIndices[${b}]
                      >= uniforms.x_shape[${b}]) {
                    pad++;
                    continue;
                  }
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${a}
                }`:`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${b}] = indices[${b}] * uniforms.sw - uniforms.pwStart + i;
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${a}
                }`,2===o.kernelShape.length){let e=i-(h?3:2);d=c?`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${e}] = indices[${e}] * uniforms.sh - uniforms.phStart + j;
                  if (xIndices[${e}] < 0 || xIndices[${e}] >= uniforms.x_shape[${e}]) {
                    pad += i32(uniforms.kw);
                    continue;
                  }
              `:`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${e}] = indices[${e}] * uniforms.sh - uniforms.phStart + j;
                `,g=`
              }
            `}return`
            ${e.registerUniforms(l).declareVariables(t,m)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

              let indices = ${m.offsetToIndices("global_idx")};
              var xIndices = ${m.offsetToIndices("global_idx")};

              var value = ${f}(${u});
              var pad = 0;
              ${d}
              ${n}
              ${g}
              ${s}

              output[global_idx] = value;
            }`}{if(h)throw Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let n=o.kernelShape.length,p=o.pads.length,c="";return c=d?`
                if (xIndices[j] >= uniforms.x_shape[j]) {
                  pad++;
                  isPad = true;
                  break;
                }
              }
              if (!isPad) {
                let x_val = x[${t.indicesToOffset("xIndices")}];
                ${a}
              }`:`
              }
              let x_val = x[${t.indicesToOffset("xIndices")}];
              ${a}
            `,`
            ${e.registerUniforms(l).declareVariables(t,m)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
              let indices = ${m.offsetToIndices("global_idx")};
              var xIndices = ${m.offsetToIndices("global_idx")};

              var offsets: array<u32, ${n}>;

              var value = ${f}(${u});
              var pad = 0;
              var isPad = false;

              for (var i: u32 = 0u; i < uniforms.kernelSize; i++) {
                var offset = i;
                for (var j = 0u; j < ${n-1}u; j++) {
                  offsets[j] = offset / ${Q("uniforms.kernelStrides","j",n)};
                  offset -= offsets[j] * ${Q("uniforms.kernelStrides","j",n)};
                }
                offsets[${n-1}] = offset;

                isPad = false;
                for (var j = ${i-n}u; j < ${i}u; j++) {
                  xIndices[j] = indices[j] * ${Q("uniforms.strides",`j - ${i-n}u`,n)}
                    + offsets[j - ${i-n}u] - ${Q("uniforms.pads","j - 2u",p)};
                  ${c}
              }
              ${s}

              output[global_idx] = value;
            }`}},Q0=e=>`${e.format};${e.ceilMode};${e.autoPad};${e.kernelShape.length}`,dE=e=>`${Q0(e)};${e.countIncludePad}`,pE=e=>`${Q0(e)};${e.storageOrder};${e.dilations}`,ew=e=>({format:e.format,autoPad:["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],ceilMode:e.ceil_mode,kernelShape:e.kernel_shape,strides:e.strides,pads:e.pads}),tw=(e,t,i,n)=>{let[o,a]=Z0(t,n,i),s=N("x",t.dataType,t.dims.length),u=s.type.value,l="value += x_val;",d="";o.countIncludePad?d+=`value /= ${u}(uniforms.kernelSize);`:d+=`value /= ${u}(i32(uniforms.kernelSize) - pad);`;let[p,c,h,f,m]=J0(a,o);p.push(...W(t.dims,a));let g=["rank"];return{name:e,shaderCache:{hint:`${n.cacheKey};${h};${f};${m}`,inputDependencies:g},getRunData:()=>({outputs:[{dims:a,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(C.size(a)/64)},programUniforms:p}),getShaderSource:e=>Y0(e,s,t.dims.length,a.length,o,l,d,0,c,h,f,m)}},nw=e=>{let t=0!==e.count_include_pad,i=ew(e);if(0!==i.ceilMode)throw Error("using ceil() in shape computation is not yet supported for AveragePool");let n={countIncludePad:t,...i,cacheKey:""};return{...n,cacheKey:dE(n)}},rw=(e,t)=>{Za(e.inputs),e.compute(tw("AveragePool",e.inputs[0],!1,t))},ow={autoPad:"",ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[]},iw=e=>{let t=e.format;return{format:t,...ow,cacheKey:t}},aw=(e,t)=>{Za(e.inputs),e.compute(tw("GlobalAveragePool",e.inputs[0],!0,t))},sw=(e,t,i,n)=>{let[o,a]=Z0(t,n,i),s=`
      value = max(x_val, value);
    `,u="",l=N("x",t.dataType,t.dims.length),d=["rank"],[p,c,h,f,m]=J0(a,o);return p.push(...W(t.dims,a)),{name:e,shaderCache:{hint:`${n.cacheKey};${h};${f};${m}`,inputDependencies:d},getRunData:()=>({outputs:[{dims:a,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(C.size(a)/64)},programUniforms:p}),getShaderSource:e=>Y0(e,l,t.dims.length,a.length,o,s,u,10===t.dataType?-65504:-1e5,c,h,f,m)}},uw=(e,t)=>{Za(e.inputs),e.compute(sw("MaxPool",e.inputs[0],!1,t))},lw=e=>{let t=e.storage_order,i=e.dilations,n=ew(e);if(0!==t)throw Error("column major storage order is not yet supported for MaxPool");if(0!==n.ceilMode)throw Error("using ceil() in shape computation is not yet supported for MaxPool");let o={storageOrder:t,dilations:i,...n,cacheKey:""};return{...o,cacheKey:pE(o)}},cw=e=>{let t=e.format;return{format:t,...ow,cacheKey:t}},dw=(e,t)=>{Za(e.inputs),e.compute(sw("GlobalMaxPool",e.inputs[0],!0,t))}}),mw=k(()=>{"use strict";le(),ge(),Xe(),ye(),hE=(e,t)=>{if(e.length<2||e.length>3)throw Error("DequantizeLinear requires 2 or 3 inputs.");if(3===e.length&&e[1].dims===e[2].dims)throw Error("x-scale and x-zero-point must have the same shape.");if(3===e.length&&e[0].dataType!==e[2].dataType)throw Error("x and x-zero-point must have the same data type.");if(6===e[0].dataType&&e.length>2)throw Error("In the case of dequantizing int32 there is no zero point.");if(0!==e[1].dims.length&&1!==e[1].dims.length&&e[1].dims.length!==e[0].dims.length)throw Error("scale input must be a scalar, a 1D tensor, or have the same rank as the input tensor.");if(e.length>2){if(e[0].dataType!==e[2].dataType)throw Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==e[2].dims.length)throw Error("scale and zero-point inputs must have the same rank.");if(!e[1].dims.map((t,i)=>t===e[2].dims[i]).reduce((e,t)=>e&&t,!0))throw Error("scale and zero-point inputs must have the same shape.")}if(t.blockSize>0){if(0===e[1].dims.length||1===e[1].dims.length&&1===e[1].dims[0])throw Error("blockSize must be set only for block quantization.");if(!e[1].dims.map((i,n)=>n===t.axis||i===e[0].dims[n]).reduce((e,t)=>e&&t,!0))throw Error("For block qunatization, scale input shape to match the input shape except for the axis");if(e[1].dims.length!==e[0].dims.length)throw Error("For block qunatization the scale input rank must be the same as the x rank.");let i=e[0].dims[t.axis],n=e[1].dims[t.axis];if(t.blockSize<Math.ceil(i/n)||t.blockSize>Math.ceil(i/(n-1)-1))throw Error("blockSize must be with in the range [ceil(dI / Si), ceil(dI / (Si - 1) - 1)].")}},mE=(e,t)=>{let i=C.normalizeAxis(t.axis,e[0].dims.length),n=e[0].dataType,o=3===n,a=e[0].dims,s=e[1].dataType,u=C.size(a),l=3===n||2===n,d=l?[Math.ceil(C.size(e[0].dims)/4)]:e[0].dims,p=e[1].dims,c=e.length>2?e[2]:void 0,h=c?l?[Math.ceil(C.size(c.dims)/4)]:c.dims:void 0,f=0===p.length||1===p.length&&1===p[0],m=!1===f&&1===p.length,g=Ee(u),b=f&&(!l||4===g),y=b?g:1,_=b&&!l?g:1,v=N("input",l?12:n,d.length,_),x=N("scale",s,p.length),w=c?N("zero_point",l?12:n,h.length):void 0,$=G("output",s,a.length,y),T=[v,x];w&&T.push(w);let I=[d,p];c&&I.push(h);let S=[{type:12,data:u/y},{type:12,data:i},{type:12,data:t.blockSize},...W(...I,a)],O=e=>{let t=[{name:"output_size",type:"u32"},{name:"axis",type:"u32"},{name:"block_size",type:"u32"}];return`
      ${e.registerUniforms(t).declareVariables(...T,$)}
      ${e.mainStart()}
          ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let output_indices = ${$.offsetToIndices("global_idx")};

          // Set input x
          ${l?`
            let input = ${v.getByOffset("global_idx / 4")};
            let x_vec = ${o?"unpack4xI8(input)":"unpack4xU8(input)"};
            let x_value = ${1===y?"x_vec[global_idx % 4]":"x_vec"};`:`let x_value = ${v.getByOffset("global_idx")};`};

          // Set scale input
          ${f?`let scale_value= ${x.getByOffset("0")}`:m?`
            let scale_index = ${$.indicesGet("output_indices","uniforms.axis")};
            let scale_value= ${x.getByOffset("scale_index")};`:`
            var scale_indices: ${x.type.indices} = output_indices;
            let index = ${x.indicesGet("scale_indices","uniforms.axis")} / uniforms.block_size;
            ${x.indicesSet("scale_indices","uniforms.axis","index")};
            let scale_value= ${x.getByIndices("scale_indices")};`};

          // Set zero-point input
          ${w?f?l?`
                let zero_point_input = ${w.getByOffset("0")};
                let zero_point_vec =  ${o?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value= zero_point_vec[0]`:`let zero_point_value = ${w.getByOffset("0")}`:m?l?`
                let zero_point_index = ${$.indicesGet("output_indices","uniforms.axis")};
                let zero_point_input = ${w.getByOffset("zero_point_index / 4")};
                let zero_point_vec =  ${o?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_index % 4]`:`
                let zero_point_index = ${$.indicesGet("output_indices","uniforms.axis")};
                let zero_point_value = ${w.getByOffset("zero_point_index")};`:l?`
                let zero_point_offset = ${x.indicesToOffset("scale_indices")};
                let zero_point_input = ${w.getByOffset("zero_point_offset / 4")};
                let zero_point_vec = ${o?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_offset % 4];`:`let zero_point_value = ${w.getByIndices("scale_indices")};`:`let zero_point_value = ${l?o?"i32":"u32":v.type.value}(0);`};
      // Compute and write output
      ${$.setByOffset("global_idx",`${$.type.value}(x_value - zero_point_value) * scale_value`)};
      }`};return{name:"DequantizeLinear",shaderCache:{hint:t.cacheKey,inputDependencies:w?["rank","rank","rank"]:["rank","rank"]},getShaderSource:O,getRunData:()=>({outputs:[{dims:a,dataType:s}],dispatchGroup:{x:Math.ceil(u/y/64),y:1,z:1},programUniforms:S})}},fw=(e,t)=>{hE(e.inputs,t),e.compute(mE(e.inputs,t))},hw=e=>ce({axis:e.axis,blockSize:e.blockSize})}),bw=k(()=>{"use strict";pt(),le(),ye(),gE=(e,t,i)=>{let n=e===t,o=e<t&&i<0,a=e>t&&i>0;if(n||o||a)throw Error("Range these inputs' contents are invalid.")},bE=(e,t,i,n)=>{let o=Math.abs(Math.ceil((t-e)/i)),a=[o],s=o,u=[{type:12,data:s},{type:n,data:e},{type:n,data:i},...W(a)],l=e=>{let t=G("output",n,a.length),i=t.type.value,o=[{name:"outputSize",type:"u32"},{name:"start",type:i},{name:"delta",type:i}];return`
        ${e.registerUniforms(o).declareVariables(t)}
        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        output[global_idx] = uniforms.start + ${i}(global_idx) * uniforms.delta;
      }`};return{name:"Range",shaderCache:{hint:`${n}`},getShaderSource:l,getRunData:()=>({outputs:[{dims:a,dataType:n}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:u})}},gw=e=>{let t=0,i=0,n=0;6===e.inputs[0].dataType?(t=e.inputs[0].getInt32Array()[0],i=e.inputs[1].getInt32Array()[0],n=e.inputs[2].getInt32Array()[0]):1===e.inputs[0].dataType&&(t=e.inputs[0].getFloat32Array()[0],i=e.inputs[1].getFloat32Array()[0],n=e.inputs[2].getFloat32Array()[0]),me.webgpu.validateInputContent&&gE(t,i,n),e.compute(bE(t,i,n,e.inputs[0].dataType),{inputs:[]})}}),vw=k(()=>{"use strict";le(),ge(),Xe(),ye(),yE=(e,t,i,n)=>{if("none"!==e&&"i32"!==n&&"u32"!==n&&"f32"!==n)throw Error(`Input ${n} is not supported with reduction ${e}.`);let o=`{
                var oldValue = 0;
                loop {
                  let newValueF32 =`,a=`;
                  let newValue = bitcast<i32>(newValueF32);
                  let res = atomicCompareExchangeWeak(&${t}, oldValue, newValue);
                  if res.exchanged {
                    break;
                  }
                  oldValue = res.old_value;
                }
              }`;switch(e){case"none":return`${t}=${i};`;case"add":return"i32"===n||"u32"===n?`atomicAdd(&${t}, bitcast<${n}>(${i}));`:`
              ${o}bitcast<${n}>(oldValue) + (${i})${a}`;case"max":return"i32"===n||"u32"===n?`atomicMax(&${t}, bitcast<${n}>(${i}));`:`
                ${o}max(bitcast<f32>(oldValue), (${i}))${a}`;case"min":return"i32"===n||"u32"===n?`atomicMin(&${t}, bitcast<${n}>(${i}));`:`${o}min(bitcast<${n}>(oldValue), (${i}))${a}`;case"mul":return`${o}(bitcast<${n}>(oldValue) * (${i}))${a}`;default:throw Error(`Reduction ${e} is not supported.`)}},_E=(e,t)=>{let i=e[0].dims,n=e[1].dims,o=i,a=1,s=Math.ceil(C.sizeToDimension(n,n.length-1)/a),u=n[n.length-1],l=C.sizeFromDimension(i,u),d=[{type:12,data:s},{type:12,data:u},{type:12,data:l},...W(e[1].dims,e[2].dims,o)],p=i=>{let n=N("indices",e[1].dataType,e[1].dims.length),s=N("updates",e[2].dataType,e[2].dims.length,a),u="none"!==t.reduction&&""!==t.reduction?jy("output",e[0].dataType,o.length):G("output",e[0].dataType,o.length,a);return`
      ${i.registerUniform("output_size","u32").registerUniform("last_index_dimension","u32").registerUniform("num_updates_elements","u32").declareVariables(n,s,u)}
      ${i.mainStart()}
        ${i.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
  var data_offset = 0u;
  let indices_start = uniforms.last_index_dimension * global_idx;
  let indices_end = indices_start + uniforms.last_index_dimension;
  for (var i = indices_start; i < indices_end; i++) {
    var index = i32(indices[i].x);
    ${1===e[0].dims.length?`
    let element_count_dim = uniforms.output_strides;
    let dim_value = uniforms.output_shape;`:`
    let element_count_dim = uniforms.output_strides[i - indices_start];
    let dim_value = uniforms.output_shape[i - indices_start];`}
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
    data_offset += u32((u32(index) * element_count_dim));
  }

  for (var i = 0u; i < uniforms.num_updates_elements; i++) {
    let value = updates[uniforms.num_updates_elements * global_idx + i];
    ${yE(t.reduction,"output[data_offset + i]","value",u.type.value)}
  }

      }`};return{name:"ScatterND",shaderCache:{hint:`${t.cacheKey}_${t.reduction}`,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:o,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:d}),getShaderSource:p}},yw=e=>ce({reduction:e.reduction}),_w=(e,t)=>{e.compute(_E(e.inputs,t),{inputs:[e.inputs[1],e.inputs[2]],outputs:[]})}}),Sw=k(()=>{"use strict";le(),ge(),Xe(),ye(),vE=(e,t)=>{if(e.every(e=>e>0||(()=>{throw Error("Resize requires scales input values to be positive")})),e.length>0){if("linear"===t.mode){if(2!==e.length&&3!==e.length&&(4!==e.length||1!==e[0]||1!==e[1])&&(4!==e.length||1!==e[0]||1!==e[3])&&(5!==e.length||1!==e[0]||1!==e[1]))throw Error(`For linear mode, Resize requires scales to be 2D, 3D, 4D with either two outermost or one innermost and
            one outermost scale values equal to 1, or 5D with two outermost scale values equal to 1`)}else if("cubic"===t.mode&&2!==e.length&&(4!==e.length||1!==e[0]||1!==e[1])&&(4!==e.length||1!==e[0]||1!==e[3]))throw Error("Resize requires scales input size to be 2 or 4 for cubic mode")}},wE=(e,t,i)=>{t.every(e=>e>=0&&e<i||(()=>{throw Error("Resize requires axes input values to be positive and less than rank")}));let n=Array(i).fill(1);return t.forEach((t,i)=>n[t]=e[i]),n},xE=(e,t,i,n,o,a)=>{let[s,u,l]=i>10?[1,2,3]:[-1,e.length>1?1:-1,-1],d=e[0].dims.length;if(s>0&&e.length>s&&e[s].dims.length>0)e[s].getFloat32Array().forEach(e=>a.push(e));else if("tf_crop_and_resize"===t.coordinateTransformMode)throw Error("Resize requires RoI input to be specified when coordinateTransformMode is tfCropAndResize");if(u>0&&e.length>u&&1===e[u].dims.length&&e[u].dims[0]>0){if(e[u].getFloat32Array().forEach(e=>n.push(e)),0!==n.length&&n.length!==d&&i>=18&&n.length!==t.axes.length)throw Error("Resize requires scales input size to be same as input rank or axes size for opset 18 and up");vE(n,t),t.axes.length>0&&wE(n,t.axes,d).forEach((e,t)=>n[t]=e)}if(l>0&&e.length>l&&1===e[l].dims.length&&e[l].dims[0]>0&&(e[l].getBigInt64Array().forEach(e=>o.push(Number(e))),0!==o.length&&o.length!==d&&i>=18&&o.length!==t.axes.length))throw Error("Resize requires sizes input size to be same as input rank or axes size for opset 18 and up");if(t.axes.length>0){if(0!==n.length&&n.length!==t.axes.length)throw Error('Resize requires "scales" input size to be of axes rank when axes attributes is specified');if(0!==o.length&&o.length!==t.axes.length)throw Error('Resize requires "sizes" input size to be of rank axes rank when axes attributes is specified')}if("u">typeof n&&"u">typeof o&&n.length>0&&o.length>d)throw Error("Resize requires only of scales or sizes to be specified")},ww=(e,t,i,n)=>`
  // The whole part and the fractional part are calculated separately due to inaccuracy of floating
  // point division. As an example, f32(21) / f32(7) may evaluate to 2.99... instead of 3, causing an
  // offset-by-one error later in floor().
  let big = (${e}) * (${t});
  let whole = ${n}(big / (${i}));
  let fract = ${n}(big % (${i})) / ${n}(${i});
  return whole + fract;
`,TE=(e,t)=>`fn getOriginalCoordinateFromResizedCoordinate(xResized: u32, xScale: f32, lengthResized: u32,
     lengthOriginal: u32, roiStart: f32, roiEnd: f32) -> ${t} { `+(()=>{switch(e){case"asymmetric":return`
          if (xScale < 1.0 || floor(xScale) != xScale) {
            return ${t}(xResized) / ${t}(xScale);
          } else {
            ${ww("xResized","lengthOriginal","lengthResized",t)}
          }
        `;case"pytorch_half_pixel":return`if (lengthResized > 1) {
                    return (${t}(xResized) + 0.5) / ${t}(xScale) - 0.5;
                  } else {
                    return 0.0;
                  }`;case"tf_half_pixel_for_nn":return`return (${t}(xResized) + 0.5) / ${t}(xScale);`;case"align_corners":return`if (lengthResized == 1) {
                    return 0.0;
                  } else {
                    ${ww("xResized","lengthOriginal - 1","lengthResized - 1",t)}
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
                  return offset + ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;case"half_pixel":return`return ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;default:throw Error(`Coordinate transform mode ${e} is not supported`)}})()+"}",IE=(e,t,i)=>`fn getNearestPixelFromOriginal(xOriginal: ${i}, isDownSample: bool) -> ${i} {`+(()=>{switch(e){case"round_prefer_ceil":return"if (fract(xOriginal) == 0.5) {             return ceil(xOriginal);           } else {             return round(xOriginal);           }";case"floor":return"return floor(xOriginal);";case"ceil":return"return ceil(xOriginal);";case"round_prefer_floor":return"if (fract(xOriginal) == 0.5) {                     return floor(xOriginal);                   } else {                     return round(xOriginal);                   }";default:if(t<11)return"if (isDownSample)                     {                       return ceil(xOriginal);                     } else {                       return xOriginal;                     }";throw Error(`Nearest mode ${e} is not supported`)}})()+"}",SE=(e,t,i)=>{let n=Array(i).fill(0).concat(Array(i).fill(1)),o=0===e.length?n:e.slice();return t.length>0?(t.forEach((e,a)=>{n[e]=o[a],n[a+i]=o[t.length+a]}),n):o},$E=(e,t,i,n)=>{let o=[];if(i.length>0)if(n.length>0){if(e.forEach(e=>o.push(e)),Math.max(...n)>e.length)throw Error("axes is out of bound");n.forEach((e,t)=>o[e]=i[t])}else i.forEach(e=>o.push(e));else{if(0===t.length)throw Error("Resize requires either scales or sizes.");o=e.map((e,i)=>Math.round(e*t[i]))}return o},AE=(e,t,i)=>{let n=(()=>{switch(i.keepAspectRatioPolicy){case"not_larger":return i.axes.length>0?Math.min(...i.axes.map(e=>t[e]),Number.MAX_VALUE):Math.min(...t,Number.MAX_VALUE);case"not_smaller":return i.axes.length>0?Math.max(...i.axes.map(e=>t[e]),5e-324):Math.max(...t,5e-324);default:throw Error(`Keep aspect ratio policy ${i.keepAspectRatioPolicy} is not supported`)}})();t.fill(1,0,t.length);let o=e.slice();return i.axes.length>0?(i.axes.forEach(e=>t[e]=n),i.axes.forEach(i=>o[i]=Math.round(e[i]*t[i]))):(t.fill(n,0,t.length),o.forEach((e,i)=>o[i]=Math.round(e*t[i]))),o},OE=(e,t,i,n,o)=>`
    fn calculateOriginalIndicesFromOutputIndices(output_indices: ${e.type.indices}) -> array<${e.type.value}, ${i.length}> {
      var original_indices: array<${e.type.value}, ${i.length}>;
      for (var i:u32 = 0; i < ${i.length}; i++) {
        var output_index = ${e.indicesGet("output_indices","i")};
        var scale = ${Q("uniforms.scales","i",n)};
        var roi_low = ${Q("uniforms.roi","i",o)};
        var roi_hi = ${Q("uniforms.roi",`i + ${t.length}`,o)};
        if (scale == 1.0) {
          original_indices[i] = ${e.type.value}(output_index);
        } else {
          var input_shape_i = ${Q("uniforms.input_shape","i",t.length)};
          var output_shape_i = ${Q("uniforms.output_shape","i",i.length)};
          original_indices[i] = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                           input_shape_i, roi_low, roi_hi);
        }
      }
      return original_indices;
    }`,PE=(e,t,i,n,o,a,s)=>`
    fn calculateInputIndicesFromOutputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
      var input_indices: ${e.type.indices};
      for (var i:u32 = 0; i < ${n.length}; i++) {
        var output_index = ${t.indicesGet("output_indices","i")};
        var input_index: u32;
        var scale = ${Q("uniforms.scales","i",o)};
        if (scale == 1.0) {
          input_index = output_index;
        } else {
          var roi_low = ${Q("uniforms.roi","i",a)};
          var roi_hi = ${Q("uniforms.roi",`i + ${i.length}`,a)};
          var input_shape_i = ${Q("uniforms.input_shape","i",i.length)};
          var output_shape_i = ${Q("uniforms.output_shape","i",n.length)};
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
    }`,EE=(e,t)=>`
    fn checkInputIndices(input_indices: ${e.type.indices}) -> bool {
      for (var i:u32 = 0; i < ${t.length}; i++) {
        var input_index = ${e.indicesGet("input_indices","i")};
        if (input_index < 0 || input_index >= ${Q("uniforms.input_shape","i",t.length)}) {
          return false;
        }
      }
      return true;
    }`,xw=(e,t,i,n)=>e.rank>n?`
    ${e.indicesSet("input_indices",t,"channel")};
    ${e.indicesSet("input_indices",i,"batch")};
`:"",CE=(e,t,i,n,o)=>{let[a,s,u,l]=2===i.length?[-1,0,1,-1]:[0,2,3,1],d=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, row: u32, col: u32) -> ${d} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",s,`max(0, min(row, ${i[s]} - 1))`)};
      ${e.indicesSet("input_indices",u,`max(0, min(col, ${i[u]} - 1))`)};
      ${xw(e,l,a,2)}
      return ${e.getByIndices("input_indices")};
    }

    fn bilinearInterpolation(output_indices: ${t.type.indices}) -> ${d} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var row:${d} = originalIndices[${s}];
      var col:${d} = originalIndices[${u}];
      ${n?`if (row < 0 || row > (${i[s]} - 1) || col < 0 || col > (${i[u]} - 1)) {
        return ${o};
      }`:""};
      row = max(0, min(row, ${i[s]} - 1));
      col = max(0, min(col, ${i[u]} - 1));
      var row1: u32 = u32(row);
      var col1: u32 = u32(col);
      var row2: u32 = u32(row + 1);
      var col2: u32 = u32(col + 1);
      var channel: u32 = ${i.length>2?`u32(originalIndices[${l}])`:"0"};
      var batch: u32 =  ${i.length>2?`u32(originalIndices[${a}])`:"0"};
      var x11: ${d} = getInputValue(batch, channel, row1, col1);
      var x12: ${d} = getInputValue(batch, channel, row1, col2);
      var x21: ${d} = getInputValue(batch, channel, row2, col1);
      var x22: ${d} = getInputValue(batch, channel, row2, col2);
      var dx1: ${d} = abs(row - ${d}(row1));
      var dx2: ${d} = abs(${d}(row2) - row);
      var dy1: ${d} = abs(col - ${d}(col1));
      var dy2: ${d} = abs(${d}(col2) - col);
      if (row1 == row2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (col1 == col2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      return (x11 * dx2 * dy2 + x12 * dx2 * dy1 + x21 * dx1 * dy2 + x22 * dx1 * dy1);
    }`},DE=(e,t,i,n,o,a,s,u,l,d)=>{let p=2===i.length,c=!0,[h,f]=p?[0,1]:c?[2,3]:[1,2],m=e.type.value,g=s=>{let p=s===h?"row":"col";return`
      fn ${p}CubicInterpolation(input_indices: ${e.type.indices}, output_indices: ${t.type.indices}) -> ${m} {
        var output_index = ${t.indicesGet("output_indices",s)};
        var originalIdx: ${m} = getOriginalCoordinateFromResizedCoordinate(output_index, ${o[s]},
        ${n[s]}, ${i[s]}, ${a[s]}, ${a[s]} + ${i.length});
        var fractOriginalIdx: ${m} = originalIdx - floor(originalIdx);
        var coefs = getCubicInterpolationCoefs(fractOriginalIdx);

        if (${u} && (originalIdx < 0 || originalIdx > (${i[s]} - 1))) {
          return ${l};
        }
        var data: array<${m}, 4> = array<${m}, 4>(0.0, 0.0, 0.0, 0.0);
        for (var i: i32 = -1; i < 3; i++) {
          var ${p}: ${m} = originalIdx + ${m}(i);
          if (${p} < 0 || ${p} >= ${i[s]}) {
            ${d?`coefs[i + 1] = 0.0;
                        continue;`:u?`return ${l};`:`${p} = max(0, min(${p}, ${i[s]} - 1));`};
          }
        var input_indices_copy: ${e.type.indices} = input_indices;
          ${e.indicesSet("input_indices_copy",s,`u32(${p})`)};
          data[i + 1] = ${s===h?e.getByIndices("input_indices_copy"):"rowCubicInterpolation(input_indices_copy, output_indices)"};
        }
        return cubicInterpolation1D(data, coefs);
      }`};return`
    ${g(h)};
    ${g(f)};
  fn getCubicInterpolationCoefs(s: ${m}) -> array<${m}, 4> {
    var absS = abs(s);
    var coeffs: array<${m}, 4> = array<${m}, 4>(0.0, 0.0, 0.0, 0.0);
    var oneMinusAbsS: ${m} = 1.0 - absS;
    var twoMinusAbsS: ${m} = 2.0 - absS;
    var onePlusAbsS: ${m} = 1.0 + absS;
    coeffs[0] = ((${s} * onePlusAbsS - 5 * ${s}) * onePlusAbsS + 8 * ${s}) * onePlusAbsS - 4 * ${s};
    coeffs[1] = ((${s} + 2) * absS - (${s} + 3)) * absS * absS + 1;
    coeffs[2] = ((${s} + 2) * oneMinusAbsS - (${s} + 3)) * oneMinusAbsS * oneMinusAbsS + 1;
    coeffs[3] = ((${s} * twoMinusAbsS - 5 * ${s}) * twoMinusAbsS + 8 * ${s}) * twoMinusAbsS - 4 * ${s};
    return coeffs;
  }

  fn cubicInterpolation1D(x: array<${m}, 4>, coefs: array<${m}, 4>) -> ${m} {
    var coefsSum: ${m} = coefs[0] + coefs[1] + coefs[2] + coefs[3];
    return (x[0] * coefs[0] + x[1] * coefs[1]+ x[2] * coefs[2]+ x[3] * coefs[3]) / coefsSum;
  }

  fn bicubicInterpolation(output_indices: ${t.type.indices}) -> ${m} {
    var input_indices: ${e.type.indices} = output_indices;
    return colCubicInterpolation(input_indices, output_indices);
  }
    `},kE=(e,t,i,n,o)=>{let[a,s,u,l,d]=3===i.length?[-1,0,1,2,-1]:[0,2,3,4,1],p=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, depth:u32, height: u32, width: u32) -> ${p} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",s,`max(0, min(depth, ${i[s]} - 1))`)};
      ${e.indicesSet("input_indices",u,`max(0, min(height, ${i[u]} - 1))`)};
      ${e.indicesSet("input_indices",l,`max(0, min(width, ${i[l]} - 1))`)};
      ${xw(e,d,a,3)}
      return ${e.getByIndices("input_indices")};
    }

    fn trilinearInterpolation(output_indices: ${t.type.indices}) -> ${p} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var depth:${p} = originalIndices[${s}];
      var height:${p} = originalIndices[${u}];
      var width:${p} = originalIndices[${l}];
      ${n?`if (depth < 0 || depth > (${i[s]} - 1) || height < 0 || height > (${i[u]} - 1) || width < 0 || (width > ${i[l]} - 1)) {
      return ${o};
        }`:""};

    depth = max(0, min(depth, ${i[s]} - 1));
      height = max(0, min(height, ${i[u]} - 1));
      width = max(0, min(width, ${i[l]} - 1));
      var depth1: u32 = u32(depth);
      var height1: u32 = u32(height);
      var width1: u32 = u32(width);
      var depth2: u32 = u32(depth + 1);
      var height2: u32 = u32(height + 1);
      var width2: u32 = u32(width + 1);
      var channel: u32 = ${i.length>3?`u32(originalIndices[${d}])`:"0"};
      var batch: u32 =  ${i.length>3?`u32(originalIndices[${a}])`:"0"};

      var x111: ${p} = getInputValue(batch, channel, depth1, height1, width1);
      var x112: ${p} = getInputValue(batch, channel, depth1, height1, width2);
      var x121: ${p} = getInputValue(batch, channel, depth1, height2, width1);
      var x122: ${p} = getInputValue(batch, channel, depth1, height2, width2);
      var x211: ${p} = getInputValue(batch, channel, depth2, height1, width1);
      var x212: ${p} = getInputValue(batch, channel, depth2, height1, width2);
      var x221: ${p} = getInputValue(batch, channel, depth2, height2, width1);
      var x222: ${p} = getInputValue(batch, channel, depth2, height2, width2);
      var dx1: ${p} = abs(depth - ${p}(depth1));
      var dx2: ${p} = abs(${p}(depth2) - depth);
      var dy1: ${p} = abs(height - ${p}(height1));
      var dy2: ${p} = abs(${p}(height2) - height);
      var dz1: ${p} = abs(width - ${p}(width1));
      var dz2: ${p} = abs(${p}(width2) - width);
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
    }`},NE=(e,t,i,n,o,a)=>{let s=e.dims,u=SE(a,t.axes,s.length),l=$E(s,n,o,t.axes),d=n.slice();0===n.length&&(d=s.map((e,t)=>0===e?1:l[t]/e),"stretch"!==t.keepAspectRatioPolicy&&(l=AE(s,d,t)));let p=G("output",e.dataType,l.length),c=N("input",e.dataType,s.length),h=C.size(l),f=s.length===l.length&&s.every((e,t)=>e===l[t]),m="tf_crop_and_resize"===t.coordinateTransformMode,g=t.extrapolationValue,b=c.type.value,y=e=>`
      ${f?"":`
      ${TE(t.coordinateTransformMode,b)};
      ${(()=>{switch(t.mode){case"nearest":return`
              ${EE(c,s)};
              ${IE(t.nearestMode,i,b)};
              ${PE(c,p,s,l,d.length,u.length,m)};
              `;case"linear":return`
              ${OE(p,s,l,d.length,u.length)};
              ${(()=>{if(2===s.length||4===s.length)return`${CE(c,p,s,m,g)}`;if(3===s.length||5===s.length)return`${kE(c,p,s,m,g)}`;throw Error("Linear mode only supports input dims 2, 3, 4 and 5 are supported in linear mode.")})()};
            `;case"cubic":return`
            ${(()=>{if(2===s.length||4===s.length)return`${DE(c,p,s,l,d,u,t.cubicCoeffA,m,t.extrapolationValue,t.excludeOutside)}`;throw Error("Cubic mode only supports input dims 2 and 4 are supported in linear mode.")})()};
            `;default:throw Error("Invalid resize mode")}})()};
      `}
      ${e.registerUniform("output_size","u32").registerUniform("scales","f32",d.length).registerUniform("roi","f32",u.length).declareVariables(c,p)}
      ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
        ${f?"output[global_idx] = input[global_idx];":`
        let output_indices = ${p.offsetToIndices("global_idx")};
        var input_indices: ${c.type.indices};
        ${(()=>{switch(t.mode){case"nearest":return`input_indices = calculateInputIndicesFromOutputIndices(output_indices);
                if (checkInputIndices(input_indices)) {
                  output[global_idx] = ${c.getByIndices("input_indices")};
                } else {
                  output[global_idx] = ${t.extrapolationValue};
                }`;case"linear":return`output[global_idx] = ${2===s.length||4===s.length?"bilinearInterpolation":"trilinearInterpolation"}(output_indices);`;case"cubic":return"output[global_idx] = bicubicInterpolation(output_indices);";default:throw Error(`Unsupported resize mode: ${t.mode}`)}})()};
`}
      }`;return{name:"Resize",shaderCache:{hint:`${t.cacheKey}|${i}|${d.length>0?"cubic"===t.mode?d:d.length:""}|${o.length>0?o:""}|${u.length>0?u:""}|${f}|${"nearest"===t.mode?s.length:s}`,inputDependencies:["rank"]},getShaderSource:y,getRunData:()=>({outputs:[{dims:l,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:[{type:12,data:h},{type:1,data:d},{type:1,data:u},...W(s,l)]})}},LE=e=>{let t=e.customDataBuffer;return new Uint32Array(t,t.byteOffset,1)[0]},Tw=(e,t)=>{let i=[],n=[],o=[],a=LE(e);if(0!==t.antialias)throw Error("Only default value (0) for Antialias attribute is supported");xE(e.inputs,t,a,i,n,o),e.compute(NE(e.inputs[0],t,a,i,n,o),{inputs:[0]})},Iw=e=>{let t=e.antialias,i=e.axes,n=e.coordinateTransformMode,o=e.cubicCoeffA,a=0!==e.excludeOutside,s=e.extrapolationValue,u=e.keepAspectRatioPolicy,l=e.mode,d=""===e.nearestMode?"simple":e.nearestMode;return ce({antialias:t,axes:i,coordinateTransformMode:n,cubicCoeffA:o,excludeOutside:a,extrapolationValue:s,keepAspectRatioPolicy:u,mode:l,nearestMode:d})}}),Aw=k(()=>{"use strict";le(),ge(),ye(),RE=e=>{if(!e||e.length<3)throw Error("layerNorm requires at least 3 inputs.");let t=e[0],i=e[1],n=e[2];if(t.dataType!==i.dataType||t.dataType!==n.dataType)throw Error("All inputs must have the same data type");if(3!==t.dims.length&&2!==t.dims.length)throw Error("Input must be 2D or 3D");if(3!==i.dims.length&&2!==i.dims.length)throw Error("Skip must be 2D or 3D");let o=t.dims[t.dims.length-1],a=t.dims[t.dims.length-2];if(i.dims[i.dims.length-1]!==o)throw Error("Skip must have the same hidden size as input");if(i.dims[i.dims.length-2]!==a)throw Error("Skip must have the same sequence length as input");if(1!==n.dims.length)throw Error("Gamma must be 1D");if(n.dims[n.dims.length-1]!==o)throw Error("Gamma must have the same hidden size as input");if(e.length>3){let t=e[3];if(1!==t.dims.length)throw Error("Beta must be 1D");if(t.dims[t.dims.length-1]!==o)throw Error("Beta must have the same hidden size as input")}if(e.length>4){let t=e[4];if(1!==t.dims.length)throw Error("Bias must be 1D");if(t.dims[t.dims.length-1]!==o)throw Error("Bias must have the same hidden size as input")}},zE=(e,t,i,n)=>{let o=t.simplified,a=e[0].dims,s=C.size(a),u=a,l=s,d=a.slice(-1)[0],p=n?a.slice(0,-1).concat(1):[],c=!o&&e.length>3,h=e.length>4,f=n&&i>1,m=n&&i>2,g=i>3,b=64,y=Ee(d),_=[{type:12,data:l},{type:12,data:y},{type:12,data:d},{type:1,data:t.epsilon}],v=t=>{let i=[{name:"output_size",type:"u32"},{name:"components",type:"u32"},{name:"hidden_size",type:"u32"},{name:"epsilon",type:"f32"}],n=[N("x",e[0].dataType,e[0].dims,y),N("skip",e[1].dataType,e[1].dims,y),N("gamma",e[2].dataType,e[2].dims,y)];c&&n.push(N("beta",e[3].dataType,e[3].dims,y)),h&&n.push(N("bias",e[4].dataType,e[4].dims,y)),n.push(G("output",e[0].dataType,u,y)),f&&n.push(G("mean_output",1,p)),m&&n.push(G("inv_std_output",1,p)),g&&n.push(G("input_skip_bias_sum",e[0].dataType,u,y));let a=Ve(e[0].dataType),s=Ve(1,y);return`

      ${t.registerUniforms(i).declareVariables(...n)}
      var<workgroup> sum_shared : array<${s}, ${b}>;
      var<workgroup> sum_squared_shared : array<${s}, ${b}>;

      ${t.mainStart([b,1,1])}
        let ix = local_id.x;
        let iy = global_id.x / ${b};

        let hidden_size_vectorized: u32 = uniforms.hidden_size / uniforms.components;
        var stride = hidden_size_vectorized / ${b};
        let offset = ix * stride + iy * hidden_size_vectorized;
        let offset1d = stride * ix;
        if (ix == ${b-1}) {
          stride = hidden_size_vectorized - stride * ix;
        }
        for (var i: u32 = 0; i < stride; i++) {
          let skip_value = skip[offset + i];
          let bias_value = ${h?"bias[offset1d + i]":a+"(0.0)"};
          let input_value = x[offset + i];
          let value = input_value + skip_value + bias_value;
          ${g?"input_skip_bias_sum[offset + i] = value;":""}
          output[offset + i] = value;
          let f32_value = ${Hr(a,y,"value")};
          sum_shared[ix] += f32_value;
          sum_squared_shared[ix] += f32_value * f32_value;
        }
        workgroupBarrier();

        var reduce_size : u32 = ${b};
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
        let mean = ${Kt("sum",y)} / f32(uniforms.hidden_size);
        let inv_std_dev = inverseSqrt(${Kt("square_sum",y)} / f32(uniforms.hidden_size) ${o?"":"- mean * mean"} + uniforms.epsilon);
        ${f?"mean_output[global_idx] = mean;":""}
        ${m?"inv_std_output[global_idx] = inv_std_dev;":""}

        for (var i: u32 = 0; i < stride; i++) {
          output[offset + i] = (output[offset + i] ${o?"":`- ${a}(mean)`}) *
            ${a}(inv_std_dev) * gamma[offset1d + i]
            ${c?"+ beta[offset1d + i]":""};
        }
      }`},x=[{dims:u,dataType:e[0].dataType}];return i>1&&x.push({dims:p,dataType:1}),i>2&&x.push({dims:p,dataType:1}),i>3&&x.push({dims:a,dataType:e[0].dataType}),{name:"SkipLayerNormalization",shaderCache:{hint:`${y};${f};${m};${g}`,inputDependencies:e.map((e,t)=>"type")},getShaderSource:v,getRunData:()=>({outputs:x,dispatchGroup:{x:Math.ceil(l/d)},programUniforms:_})}},$w=(e,t)=>{RE(e.inputs);let i=[0];e.outputCount>1&&i.push(-3),e.outputCount>2&&i.push(-3),e.outputCount>3&&i.push(3),e.compute(zE(e.inputs,t,e.outputCount,!1),{outputs:i})}}),Cw=k(()=>{"use strict";le(),ge(),Xe(),ye(),ME=(e,t)=>{if(!e||e.length<1)throw Error("too few inputs");if(0!==t.axes.length){if(t.axes.length!==t.starts.length||t.axes.length!==t.ends.length)throw Error("axes, starts and ends must have the same length")}else if(t.starts.length!==t.ends.length)throw Error("starts and ends must have the same length");e.slice(1).forEach((t,i)=>{if(6!==e[i+1].dataType&&7!==e[i+1].dataType)throw Error(`Input ${i} must be an array of int32 or int64`)})},Ja=(e,t)=>{let i=[];if(e.length>t)if(7===e[t].dataType)e[t].getBigInt64Array().forEach(e=>i.push(Number(e)));else if(6===e[t].dataType)e[t].getInt32Array().forEach(e=>i.push(Number(e)));else throw Error(`Input ${t} must be an array of int32 or int64`);return i},BE=(e,t)=>{if(!(e.length>1))return t;{let t=Ja(e,1),i=Ja(e,2),n=Ja(e,3);return 0===n.length&&(n=[...Array(e[0].dims.length).keys()]),ce({starts:t,ends:i,axes:n})}},Ow=(e,t,i,n,o)=>{let a=e;return e<0&&(a+=i[n[t]]),o[t]<0?Math.max(0,Math.min(a,i[n[t]]-1)):Math.max(0,Math.min(a,i[n[t]]))},FE=(e,t,i)=>`fn calculateInputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
          var input_indices: ${e.type.indices};
          var carry = 0u;
          for (var i = ${i.length-1}; i >= 0; i--) {
            let input_shape_i = ${Q("uniforms.input_shape","i",i.length)};
            let steps_i = ${Q("uniforms.steps","i",i.length)};
            let signs_i = ${Q("uniforms.signs","i",i.length)};
            let starts_i = ${Q("uniforms.starts","i",i.length)};
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
      }`,VE=(e,t)=>{let i=e[0].dims,n=C.size(i),o=t.axes.length>0?C.normalizeAxes(t.axes,i.length):[...Array(i.length).keys()],a=Ja(e,4);a.forEach(e=>0!==e||(()=>{throw Error("step cannot be 0")})),0===a.length&&(a=Array(o.length).fill(1));let s=t.starts.map((e,t)=>Ow(e,t,i,o,a)),u=t.ends.map((e,t)=>Ow(e,t,i,o,a));if(o.length!==s.length||o.length!==u.length)throw Error("start, ends and axes should have the same number of elements");if(o.length!==i.length)for(let e=0;e<i.length;++e)o.includes(e)||(s.splice(e,0,0),u.splice(e,0,i[e]),a.splice(e,0,1));let l=a.map(e=>Math.sign(e));a.forEach((e,t,i)=>{if(e<0){let n=(u[t]-s[t])/e,o=s[t],l=o+n*a[t];s[t]=l,u[t]=o,i[t]=-e}});let d=i.slice(0);o.forEach((e,t)=>{d[e]=Math.ceil((u[e]-s[e])/a[e])});let p={dims:d,dataType:e[0].dataType},c=G("output",e[0].dataType,d.length),h=N("input",e[0].dataType,e[0].dims.length),f=C.size(d),m=[{name:"outputSize",type:"u32"},{name:"starts",type:"u32",length:s.length},{name:"signs",type:"i32",length:l.length},{name:"steps",type:"u32",length:a.length}],g=[{type:12,data:f},{type:12,data:s},{type:6,data:l},{type:12,data:a},...W(e[0].dims,d)],b=e=>`
      ${e.registerUniforms(m).declareVariables(h,c)}
        ${FE(h,c,i)}
        ${e.mainStart()}
          ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
          let output_indices = ${c.offsetToIndices("global_idx")};
          let input_indices = calculateInputIndices(output_indices);
          ${c.setByOffset("global_idx",h.getByIndices("input_indices"))}
      }`;return{name:"Slice",shaderCache:{hint:`${l.length}_${s.length}_${a.length}`,inputDependencies:["rank"]},getShaderSource:b,getRunData:()=>({outputs:[p],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:g})}},Pw=(e,t)=>{ME(e.inputs,t);let i=BE(e.inputs,t);e.compute(VE(e.inputs,i),{inputs:[0]})},Ew=e=>{let t=e.starts,i=e.ends,n=e.axes;return ce({starts:t,ends:i,axes:n})}}),Nw=k(()=>{"use strict";le(),ge(),Xe(),Yn(),ye(),GE=e=>{if(!e||1!==e.length)throw Error("Softmax op requires 1 input.")},UE=(e,t)=>{let i=e.inputs[0],n=i.dims,o=C.size(n),a=n.length,s=C.normalizeAxis(t.axis,a),u=s<n.length-1,l,d=[];u?((d=Array.from({length:a},(e,t)=>t))[s]=a-1,d[a-1]=s,l=e.compute(at(i,d),{inputs:[i],outputs:[-1]})[0]):l=i;let p=l.dims,c=p[a-1],h=o/c,f=Ee(c),m=c/f,g=64;1===h&&(g=256);let b=(e,t)=>4===t?`max(max(${e}.x, ${e}.y), max(${e}.z, ${e}.w))`:2===t?`max(${e}.x, ${e}.y)`:3===t?`max(max(${e}.x, ${e}.y), ${e}.z)`:e,y=N("x",l.dataType,l.dims,f),_=G("result",l.dataType,l.dims,f),v=y.type.value,x="f32"===Ve(l.dataType)?`var threadMax = ${v}(-3.402823e+38f);`:`var threadMax = ${v}(-65504.0h);`,w=e=>`
      var<workgroup> rowMaxShared : ${v};
      var<workgroup> rowSumShared : ${v};
      var<workgroup> threadShared : array<${v}, ${g}>;

      fn getValue(row: i32, col: i32, row_stride: i32) -> ${v} {
        let index = row * row_stride + col;
        return x[index];
      }

      fn setValue(row: i32, col: i32, row_stride: i32, value: ${v}) {
        let index = row * row_stride + col;
        result[index] = value;
      }
      ${e.registerUniform("packedCols","i32").declareVariables(y,_)}
      ${e.mainStart(g)}
        let gindex = i32(global_idx);
        let lindex = i32(local_idx);
        const wg = ${g};
        let row = gindex / wg;
        let cols = uniforms.packedCols;
        let row_stride : i32 = uniforms.packedCols;

        // find the rows max
        ${x}
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
          rowMaxShared = ${v}(${b("threadShared[0]",f)});
        }
        workgroupBarrier();

        // find the rows sum
        var threadSum = ${v}(0.0);
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
          rowSumShared = ${v}(${Kt("threadShared[0]",f)});
        }
        workgroupBarrier();

        // calculate final value for each element in the row
        for (var col = lindex; col < cols; col += wg) {
          var value = exp(getValue(row, col, row_stride) - rowMaxShared) / rowSumShared;
          // max operation protects against NaN since all values should be >=0
          value = max(value, ${v}(0.0));
          setValue(row, col, row_stride, value);
        }
      }`,$=e.compute({name:"Softmax",shaderCache:{hint:`${f};${g}`,inputDependencies:["type"]},getRunData:()=>({outputs:[{dims:p,dataType:l.dataType}],dispatchGroup:{x:h},programUniforms:[{type:6,data:m}]}),getShaderSource:w},{inputs:[l],outputs:[u?-1:0]})[0];u&&e.compute(at($,d),{inputs:[$]})},Dw=(e,t)=>{GE(e.inputs),UE(e,t)},kw=e=>ce({axis:e.axis})}),zw=k(()=>{"use strict";le(),ge(),ye(),Lw=e=>Array.from(e.getBigInt64Array(),Number),WE=e=>{if(!e||2!==e.length)throw Error("Tile requires 2 inputs.");if(1!==e[0].dataType&&10!==e[0].dataType&&6!==e[0].dataType&&12!==e[0].dataType)throw Error("Tile only support float, float16, int32, and uint32 data types");if(7!==e[1].dataType)throw Error("Tile `repeats` input should be of int64 data type");if(1!==e[1].dims.length)throw Error("Tile `repeats` input should be 1-D");if(Lw(e[1]).length!==e[0].dims.length)throw Error("Tile `repeats` input should have same number of elements as rank of input data tensor")},HE=(e,t)=>{let i=[];for(let n=0;n<e.length;++n)i.push(e[n]*t[n]);return i},jE=(e,t)=>{let i=e[0].dims,n=t??Lw(e[1]),o=HE(i,n),a=C.size(o),s=e[0].dataType,u=N("input",s,i.length),l=G("output",s,o.length);return{name:"Tile",shaderCache:{hint:`${n}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:o,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:[{type:12,data:a},...W(e[0].dims,o)]}),getShaderSource:e=>`
      const inputShape = ${u.indices(...i)};
      ${e.registerUniform("output_size","u32").declareVariables(u,l)}
      ${e.mainStart()}
      ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let output_indices = ${l.offsetToIndices("global_idx")};
      var input_indices: ${u.type.indices};
      for (var i = 0; i < ${i.length}; i++) {
        let input_dim_i = ${u.indicesGet("uniforms.input_shape","i")};
        let input_dim_value = ${l.indicesGet("output_indices","i")}  % input_dim_i;

        ${u.indicesSet("input_indices","i","input_dim_value")}
      }
      ${l.setByOffset("global_idx",u.getByIndices("input_indices"))}
    }`}},Rw=e=>{WE(e.inputs),e.compute(jE(e.inputs),{inputs:[0]})}}),Bw=k(()=>{"use strict";le(),ge(),ye(),qE=(e,t,i,n,o)=>{let a=G("output_data",o,i.length,4),s=N("a_data",t[1].dataType,t[1].dims.length,4),u=N("b_data",t[2].dataType,t[2].dims.length,4),l=N("c_data",t[0].dataType,t[0].dims.length,4),d,p=(e,t,i)=>`select(${t}, ${e}, ${i})`;if(n){let e=(e,t,i="")=>{let n=`a_data[index_a${t}][component_a${t}]`,o=`b_data[index_b${t}][component_b${t}]`,d=`bool(c_data[index_c${t}] & (0xffu << (component_c${t} * 8)))`;return`
            let output_indices${t} = ${a.offsetToIndices(`global_idx * 4u + ${t}u`)};
            let offset_a${t} = ${s.broadcastedIndicesToOffset(`output_indices${t}`,a)};
            let offset_b${t} = ${u.broadcastedIndicesToOffset(`output_indices${t}`,a)};
            let offset_c${t} = ${l.broadcastedIndicesToOffset(`output_indices${t}`,a)};
            let index_a${t} = offset_a${t} / 4u;
            let index_b${t} = offset_b${t} / 4u;
            let index_c${t} = offset_c${t} / 4u;
            let component_a${t} = offset_a${t} % 4u;
            let component_b${t} = offset_b${t} % 4u;
            let component_c${t} = offset_c${t} % 4u;
            ${e}[${t}] = ${i}(${p(n,o,d)});
          `};d=9===o?`
            var data = vec4<u32>(0);
            ${e("data",0,"u32")}
            ${e("data",1,"u32")}
            ${e("data",2,"u32")}
            ${e("data",3,"u32")}
            output_data[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:`
            ${e("output_data[global_idx]",0)}
            ${e("output_data[global_idx]",1)}
            ${e("output_data[global_idx]",2)}
            ${e("output_data[global_idx]",3)}
          `}else d=a.setByOffset("global_idx",p(s.getByOffset("global_idx"),u.getByOffset("global_idx"),l.getByOffset("global_idx")));return`
        ${e.registerUniform("vec_size","u32").declareVariables(l,s,u,a)}
        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${d}
      }`},KE=e=>{let t=e[1].dims,i=e[2].dims,n=e[0].dims,o=e[1].dataType,a=!(C.areEqual(t,i)&&C.areEqual(i,n)),s=t,u=C.size(t);if(a){let e=Fn.calcShape(Fn.calcShape(t,i,!1),n,!1);if(!e)throw Error("Can't perform where op on the given tensors");s=e,u=C.size(s)}let l=Math.ceil(u/4);return{name:"Where",shaderCache:{inputDependencies:["rank","rank","rank"]},getShaderSource:t=>qE(t,e,s,a,o),getRunData:()=>({outputs:[{dims:s,dataType:o}],dispatchGroup:{x:Math.ceil(u/64/4)},programUniforms:[{type:12,data:l},...W(n,t,i,s)]})}},Mw=e=>{e.compute(KE(e.inputs))}}),Vw=k(()=>{"use strict";w_(),Ba(),I_(),$_(),dv(),xv(),Sv(),Vv(),Kv(),Jv(),e0(),i0(),u0(),c0(),f0(),g0(),_0(),x0(),S0(),O0(),z0(),F0(),G0(),W0(),q0(),Rc(),X0(),pw(),mw(),bw(),vw(),za(),Sw(),Bc(),Aw(),Cw(),Nw(),Mc(),zw(),Yn(),Va(),Bw(),Fw=new Map([["Abs",[A_]],["Acos",[O_]],["Acosh",[P_]],["Add",[pv]],["ArgMax",[v_,Tc]],["ArgMin",[__,Tc]],["Asin",[E_]],["Asinh",[C_]],["Atan",[D_]],["Atanh",[k_]],["Attention",[x_]],["AveragePool",[rw,nw]],["BatchNormalization",[T_]],["BiasAdd",[S_]],["BiasSplitGelu",[cv]],["Cast",[L_,N_]],["Ceil",[z_]],["Clip",[R_]],["Concat",[Tv,Iv]],["Conv",[Dc,Cc]],["ConvTranspose",[qv,Hv]],["Cos",[M_]],["Cosh",[B_]],["CumSum",[Xv,Zv]],["DepthToSpace",[Yv,Qv]],["DequantizeLinear",[fw,hw]],["Div",[fv]],["Einsum",[r0,o0]],["Elu",[F_,Wo]],["Equal",[hv]],["Erf",[V_]],["Exp",[G_]],["Expand",[s0]],["FastGelu",[l0]],["Floor",[U_]],["FusedConv",[Dc,Cc]],["Gather",[p0,d0]],["GatherElements",[w0,v0]],["GatherBlockQuantized",[b0,y0]],["GatherND",[h0,m0]],["Gelu",[W_]],["Gemm",[I0,T0]],["GlobalAveragePool",[aw,iw]],["GlobalMaxPool",[dw,cw]],["Greater",[yv]],["GreaterOrEqual",[vv]],["GridSample",[$0,A0]],["GroupQueryAttention",[R0]],["HardSigmoid",[Y_,J_]],["InstanceNormalization",[B0]],["LayerNormalization",[V0]],["LeakyRelu",[H_,Wo]],["Less",[_v]],["LessOrEqual",[wv]],["Log",[sv]],["MatMul",[U0]],["MatMulNBits",[H0,j0]],["MaxPool",[uw,lw]],["Mul",[mv]],["MultiHeadAttention",[C0,E0]],["Neg",[q_]],["Not",[j_]],["Pad",[K0]],["Pow",[gv]],["QuickGelu",[uv,Wo]],["Range",[gw]],["Reciprocal",[K_]],["ReduceMin",[f_]],["ReduceMean",[u_]],["ReduceMax",[p_]],["ReduceSum",[m_]],["ReduceProd",[h_]],["ReduceL1",[l_]],["ReduceL2",[c_]],["ReduceLogSum",[b_]],["ReduceLogSumExp",[d_]],["ReduceSumSquare",[g_]],["Relu",[X_]],["Resize",[Tw,Iw]],["RotaryEmbedding",[N0]],["ScatterND",[_w,yw]],["Sigmoid",[Z_]],["Sin",[Q_]],["Sinh",[ev]],["Slice",[Pw,Ew]],["SkipLayerNormalization",[$w]],["Split",[D0,k0]],["Sqrt",[tv]],["Softmax",[Dw,kw]],["Sub",[bv]],["Tan",[nv]],["Tanh",[ov]],["ThresholdedRelu",[av,Wo]],["Tile",[Rw]],["Transpose",[Xy,Zy]],["Where",[Mw]]])}),Gw=k(()=>{"use strict";pt(),Bn(),ye(),Ya=class{constructor(e){this.backend=e,this.repo=new Map,this.attributesBound=!1}getArtifact(e){return this.repo.get(e)}setArtifact(e,t){this.repo.set(e,t)}run(e,t,i,n,o){$t(e.programInfo.name);let a=this.backend.device,s=this.backend.getComputePassEncoder();this.backend.writeTimestamp(2*this.backend.pendingDispatchNumber);let u=[];for(let e of t)u.push({binding:u.length,resource:{buffer:e.buffer}});for(let e of i)u.push({binding:u.length,resource:{buffer:e.buffer}});o&&u.push({binding:u.length,resource:o});let l=a.createBindGroup({layout:e.computePipeline.getBindGroupLayout(0),entries:u,label:e.programInfo.name});if("capturing"===this.backend.sessionStatus){let t={kernelId:this.backend.currentKernelId,computePipeline:e.computePipeline,bindGroup:l,dispatchGroup:n};this.backend.capturedCommandList.get(this.backend.currentSessionId).push(t)}s.setPipeline(e.computePipeline),s.setBindGroup(0,l),s.dispatchWorkgroups(...n),this.backend.writeTimestamp(2*this.backend.pendingDispatchNumber+1),this.backend.pendingDispatchNumber++,(this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber||"at-passes"===this.backend.queryType)&&this.backend.endComputePass(),this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber&&this.backend.flush(),yt(e.programInfo.name)}dispose(){}build(e,t){$t(e.name);let i=this.backend.device,n=[];[{feature:"shader-f16",extension:"f16"},{feature:"subgroups",extension:"subgroups"}].forEach(e=>{i.features.has(e.feature)&&n.push(`enable ${e.extension};`)});let o=qy(t,this.backend.device.limits),a=e.getShaderSource(o),s=`${n.join(`
`)}
${o.additionalImplementations}
${a}`,u=i.createShaderModule({code:s,label:e.name});_e("verbose",()=>`[WebGPU] ${e.name} shader code: ${s}`);let l=i.createComputePipeline({compute:{module:u,entryPoint:"main"},layout:"auto",label:e.name});return yt(e.name),{programInfo:e,computePipeline:l,uniformVariablesInfo:o.variablesInfo}}normalizeDispatchGroupSize(e){let t="number"==typeof e?e:e.x,i="number"==typeof e?1:e.y||1,n="number"==typeof e?1:e.z||1,o=this.backend.device.limits.maxComputeWorkgroupsPerDimension;if(t<=o&&i<=o&&n<=o)return[t,i,n];let a=t*i*n,s=Math.ceil(Math.sqrt(a));if(!(s>o))return[s,s,1];if((s=Math.ceil(Math.cbrt(a)))>o)throw Error("Total dispatch size exceeds WebGPU maximum.");return[s,s,s]}}}),Uw={};$r(Uw,{WebGpuBackend:()=>Vc});var XE,ZE,Fc,Vc,Ww=k(()=>{"use strict";pt(),le(),Bn(),dc(),Hy(),Vw(),Gw(),XE=(e,t)=>{if(t.length!==e.length)throw Error(`inputDependencies length ${t.length} is not equal to inputTensors length ${e.length}.`);let i=[];for(let n=0;n<e.length;++n){let o=e[n].dataType;switch(t[n]){case"none":i.push("");break;case"type":i.push(`${o}`);break;case"rank":{let t=e[n].dims.length;i.push(`${o};${t}`);break}case"dims":{let t=e[n].dims.join(",");i.push(`${o};${t}`);break}default:throw Error(`unsupported input dependency: ${t[n]}`)}}return i.join("|")},ZE=(e,t,i)=>{let n=e.name;return e.shaderCache?.hint&&(n+="["+e.shaderCache.hint+"]"),n+=":"+i+`:${XE(t,e.shaderCache?.inputDependencies??Array(t.length).fill("dims"))}`},Fc=class{constructor(e){e&&(this.architecture=e.architecture,this.vendor=e.vendor)}isArchitecture(e){return this.architecture===e}isVendor(e){return this.vendor===e}},Vc=class{constructor(){this.currentSessionId=null,this.currentKernelId=null,this.commandEncoder=null,this.computePassEncoder=null,this.maxDispatchNumber=16,this.pendingDispatchNumber=0,this.pendingKernels=[],this.pendingQueries=new Map,this.sessionStatus="default",this.capturedCommandList=new Map,this.capturedPendingKernels=new Map,this.sessionExternalDataMapping=new Map}get currentKernelCustomData(){if(null===this.currentKernelId)throw Error("currentKernelCustomData(): currentKernelId is null. (should not happen)");let e=this.kernelCustomData.get(this.currentKernelId);return e||(e={},this.kernelCustomData.set(this.currentKernelId,e)),e}async initialize(e,t){this.env=e;let i=[],n={requiredLimits:{maxComputeWorkgroupStorageSize:t.limits.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:t.limits.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:t.limits.maxStorageBufferBindingSize,maxBufferSize:t.limits.maxBufferSize,maxComputeInvocationsPerWorkgroup:t.limits.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupSizeX:t.limits.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.limits.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.limits.maxComputeWorkgroupSizeZ},requiredFeatures:i},o=e=>t.features.has(e)&&i.push(e)&&!0;o("chromium-experimental-timestamp-query-inside-passes")||o("timestamp-query"),o("shader-f16"),o("subgroups"),this.device=await t.requestDevice(n),this.adapterInfo=new Fc(t.info||await t.requestAdapterInfo()),this.gpuDataManager=Wy(this),this.programManager=new Ya(this),this.kernels=new Map,this.kernelPersistentData=new Map,this.kernelCustomData=new Map,Aa(e.logLevel,!!e.debug),this.device.onuncapturederror=e=>{e.error instanceof GPUValidationError&&console.error(`An uncaught WebGPU validation error was raised: ${e.error.message}`)},Object.defineProperty(this.env.webgpu,"device",{value:this.device,writable:!1,enumerable:!0,configurable:!1}),Object.defineProperty(this.env.webgpu,"adapter",{value:t,writable:!1,enumerable:!0,configurable:!1}),this.setQueryType()}dispose(){"u">typeof this.querySet&&this.querySet.destroy(),this.gpuDataManager.dispose()}getCommandEncoder(){return this.commandEncoder||(this.commandEncoder=this.device.createCommandEncoder()),this.commandEncoder}getComputePassEncoder(){if(!this.computePassEncoder){let e=this.getCommandEncoder(),t={};"at-passes"===this.queryType&&(t.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:2*this.pendingDispatchNumber,endOfPassWriteIndex:2*this.pendingDispatchNumber+1}),this.computePassEncoder=e.beginComputePass(t)}return this.computePassEncoder}endComputePass(){this.computePassEncoder&&(this.computePassEncoder.end(),this.computePassEncoder=null)}flush(){let e;this.commandEncoder&&($t(),this.endComputePass(),"none"!==this.queryType&&(this.commandEncoder.resolveQuerySet(this.querySet,0,2*this.pendingDispatchNumber,this.queryResolveBuffer,0),e=this.device.createBuffer({size:2*this.pendingDispatchNumber*8,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.pendingQueries.set(e,this.pendingKernels),this.pendingKernels=[],this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer,0,e,0,2*this.pendingDispatchNumber*8)),this.device.queue.submit([this.commandEncoder.finish()]),this.gpuDataManager.refreshPendingBuffers(),this.commandEncoder=null,this.pendingDispatchNumber=0,"none"!==this.queryType&&e.mapAsync(GPUMapMode.READ).then(()=>{let t=new BigUint64Array(e.getMappedRange()),i=this.pendingQueries.get(e);for(let e=0;e<t.length/2;e++){let n=i[e],o=n.kernelId,a=this.kernels.get(o),s=a.kernelType,u=a.kernelName,l=n.programName,d=n.inputTensorViews,p=n.outputTensorViews,c=t[2*e],h=t[2*e+1];typeof this.queryTimeBase>"u"&&(this.queryTimeBase=c);let f=Number(c-this.queryTimeBase),m=Number(h-this.queryTimeBase);if(!Number.isSafeInteger(f)||!Number.isSafeInteger(m))throw RangeError("incorrect timestamp range");if(this.env.webgpu.profiling?.ondata)this.env.webgpu.profiling.ondata({version:1,inputsMetadata:d.map(e=>({dims:e.dims,dataType:Mn(e.dataType)})),outputsMetadata:p.map(e=>({dims:e.dims,dataType:Mn(e.dataType)})),kernelId:o,kernelType:s,kernelName:u,programName:l,startTime:f,endTime:m});else{let e="";d.forEach((t,i)=>{e+=`input[${i}]: [${t.dims}] | ${Mn(t.dataType)}, `});let t="";p.forEach((e,i)=>{t+=`output[${i}]: [${e.dims}] | ${Mn(e.dataType)}, `}),console.log(`[profiling] kernel "${o}|${s}|${u}|${l}" ${e}${t}start time: ${f} ns, execution time: ${m-f} ns`)}li("GPU",`${l}::${c}::${h}`)}e.unmap(),this.pendingQueries.delete(e)}),yt())}run(e,t,i,n,o,a){let s;$t(e.name);let u=[];for(let e=0;e<t.length;++e){let i=t[e].data;if(0===i)continue;let n=this.gpuDataManager.get(i);if(!n)throw Error(`no GPU data for input: ${i}`);u.push(n)}let{outputs:l,dispatchGroup:d,programUniforms:p}=e.getRunData(t),c=0===i.length?l.map((e,t)=>t):i;if(c.length!==l.length)throw Error(`Output size ${c.length} must be equal to ${l.length}.`);let h=[],f=[];for(let e=0;e<l.length;++e){if(!Number.isInteger(c[e])||c[e]<-3||c[e]>=a)throw Error(`Invalid output index: ${c[e]}`);if(-3===c[e])continue;let t=-1===c[e],i=-2===c[e],s=t||i?o(l[e].dataType,l[e].dims):n(c[e],l[e].dataType,l[e].dims);if(h.push(s),0===s.data)continue;let u=this.gpuDataManager.get(s.data);if(!u)throw Error(`no GPU data for output: ${s.data}`);if(t&&this.temporaryData.push(u),i){let e=this.kernelPersistentData.get(this.currentKernelId);e||(e=[],this.kernelPersistentData.set(this.currentKernelId,e)),e.push(u)}f.push(u)}if(u.length!==t.length||f.length!==h.length){if(0===f.length)return yt(e.name),h;throw Error(`Program ${e.name} has zero-sized tensor(s) in inputs or outputs. This is not supported now.`)}if(p){let e=0,t=[];p.forEach(i=>{let n="number"==typeof i.data?[i.data]:i.data;if(0===n.length)return;let o=10===i.type?2:4,a,s;10===i.type?(s=n.length>4?16:n.length>2?8:n.length*o,a=n.length>4?16:o*n.length):(s=n.length<=2?n.length*o:16,a=16),e=Math.ceil(e/s)*s,t.push(e);let u=10===i.type?8:4;e+=n.length>4?Math.ceil(n.length/u)*a:n.length*o});let i=new ArrayBuffer(e=16*Math.ceil(e/16));p.forEach((e,n)=>{let o=t[n],a="number"==typeof e.data?[e.data]:e.data;if(6===e.type)new Int32Array(i,o,a.length).set(a);else if(12===e.type)new Uint32Array(i,o,a.length).set(a);else if(10===e.type)new Uint16Array(i,o,a.length).set(a);else if(1===e.type)new Float32Array(i,o,a.length).set(a);else throw Error(`Unsupported uniform type: ${Mn(e.type)}`)});let n=this.gpuDataManager.create(e,GPUBufferUsage.COPY_DST|GPUBufferUsage.UNIFORM);this.device.queue.writeBuffer(n.buffer,0,i,0,e),this.gpuDataManager.release(n.id),s={offset:0,size:e,buffer:n.buffer}}let m=this.programManager.normalizeDispatchGroupSize(d),g=ZE(e,t,1===m[1]&&1===m[2]),b=this.programManager.getArtifact(g);if(b||(b=this.programManager.build(e,m),this.programManager.setArtifact(g,b),_e("info",()=>`[artifact] key: ${g}, programName: ${e.name}`)),p&&b.uniformVariablesInfo){if(p.length!==b.uniformVariablesInfo.length)throw Error(`Uniform variables count mismatch: expect ${b.uniformVariablesInfo.length}, got ${p.length} in program "${b.programInfo.name}".`);for(let e=0;e<p.length;e++){let t=p[e],i=t.type,n="number"==typeof t.data?1:t.data.length,[o,a]=b.uniformVariablesInfo[e];if(i!==o||n!==a)throw Error(`Uniform variable ${e} mismatch: expect type ${o} with size ${a}, got type ${i} with size ${n} in program "${b.programInfo.name}".`)}}if(_e("info",()=>`[ProgramManager] run "${e.name}" (key=${g}) with ${m[0]}x${m[1]}x${m[2]}`),"none"!==this.queryType||"capturing"===this.sessionStatus){let e={kernelId:this.currentKernelId,programName:b.programInfo.name,inputTensorViews:t,outputTensorViews:h};this.pendingKernels.push(e),"capturing"===this.sessionStatus&&this.capturedPendingKernels.get(this.currentSessionId).push(e)}return this.programManager.run(b,u,f,m,s),yt(e.name),h}upload(e,t){this.gpuDataManager.upload(e,t)}memcpy(e,t){this.gpuDataManager.memcpy(e,t)}async download(e,t){await this.gpuDataManager.download(e,t)}alloc(e){return this.gpuDataManager.create(e).id}free(e){return this.gpuDataManager.release(e)}createKernel(e,t,i,n){let o=Fw.get(e);if(!o)throw Error(`kernel not implemented: ${e}`);let a={kernelType:e,kernelName:n,kernelEntry:o[0],attributes:[o[1],i]};this.kernels.set(t,a)}releaseKernel(e){let t=this.kernelPersistentData.get(e);if(t){for(let e of t)this.gpuDataManager.release(e.id);this.kernelPersistentData.delete(e)}this.kernelCustomData.delete(e),this.kernels.delete(e)}computeKernel(e,t,i){let n=this.kernels.get(e);if(!n)throw Error(`kernel not created: ${e}`);let o=n.kernelType,a=n.kernelName,s=n.kernelEntry,u=n.attributes;if(null!==this.currentKernelId)throw Error(`kernel "[${o}] ${a}" is not allowed to be called recursively`);this.currentKernelId=e,u[0]&&(u[1]=u[0](u[1]),u[0]=void 0),_e("info",()=>`[WebGPU] Start to run kernel "[${o}] ${a}"...`);let l=this.env.debug;this.temporaryData=[];try{return l&&this.device.pushErrorScope("validation"),s(t,u[1]),0}catch(e){return i.push(Promise.resolve(`[WebGPU] Kernel "[${o}] ${a}" failed. ${e}`)),1}finally{for(let e of(l&&i.push(this.device.popErrorScope().then(e=>e?`GPU validation error for kernel "[${o}] ${a}": ${e.message}`:null)),this.temporaryData))this.gpuDataManager.release(e.id);this.temporaryData=[],this.currentKernelId=null}}registerBuffer(e,t,i,n){let o=this.sessionExternalDataMapping.get(e);o||(o=new Map,this.sessionExternalDataMapping.set(e,o));let a=o.get(t),s=this.gpuDataManager.registerExternalBuffer(i,n,a);return o.set(t,[s,i]),s}unregisterBuffers(e){let t=this.sessionExternalDataMapping.get(e);t&&(t.forEach(e=>this.gpuDataManager.unregisterExternalBuffer(e[0])),this.sessionExternalDataMapping.delete(e))}getBuffer(e){let t=this.gpuDataManager.get(e);if(!t)throw Error(`no GPU data for buffer: ${e}`);return t.buffer}createDownloader(e,t,i){return async()=>{let n=await bc(this,e,t);return Pa(n.buffer,i)}}writeTimestamp(e){"inside-passes"===this.queryType&&this.computePassEncoder.writeTimestamp(this.querySet,e)}setQueryType(){this.queryType="none",(this.env.webgpu.profiling?.mode==="default"||(typeof this.env.trace>"u"?this.env.wasm.trace:this.env.trace))&&(this.device.features.has("chromium-experimental-timestamp-query-inside-passes")?this.queryType="inside-passes":this.device.features.has("timestamp-query")&&(this.queryType="at-passes"),"none"!==this.queryType&&typeof this.querySet>"u"&&(this.querySet=this.device.createQuerySet({type:"timestamp",count:2*this.maxDispatchNumber}),this.queryResolveBuffer=this.device.createBuffer({size:2*this.maxDispatchNumber*8,usage:GPUBufferUsage.COPY_SRC|GPUBufferUsage.QUERY_RESOLVE})))}captureBegin(){_e("info","captureBegin"),this.capturedCommandList.get(this.currentSessionId)||this.capturedCommandList.set(this.currentSessionId,[]),this.capturedPendingKernels.get(this.currentSessionId)||this.capturedPendingKernels.set(this.currentSessionId,[]),this.flush(),this.sessionStatus="capturing"}captureEnd(){_e("info","captureEnd"),this.flush(),this.sessionStatus="default"}replay(){_e("info","replay"),this.sessionStatus="replaying";let e=this.capturedCommandList.get(this.currentSessionId),t=this.capturedPendingKernels.get(this.currentSessionId),i=e.length;this.pendingKernels=[];for(let n=0;n<i;n++){let i=this.getComputePassEncoder(),o=e[n];this.writeTimestamp(2*this.pendingDispatchNumber),i.setPipeline(o.computePipeline),i.setBindGroup(0,o.bindGroup),i.dispatchWorkgroups(...o.dispatchGroup),this.writeTimestamp(2*this.pendingDispatchNumber+1),this.pendingDispatchNumber++,"none"!==this.queryType&&this.pendingKernels.push(t[n]),(this.pendingDispatchNumber>=this.maxDispatchNumber||"at-passes"===this.queryType)&&this.endComputePass(),this.pendingDispatchNumber>=this.maxDispatchNumber&&this.flush()}this.flush(),this.sessionStatus="default"}onCreateSession(){this.gpuDataManager.onCreateSession()}onReleaseSession(e){this.unregisterBuffers(e),this.capturedCommandList.has(e)&&this.capturedCommandList.delete(e),this.capturedPendingKernels.has(e)&&this.capturedPendingKernels.delete(e),this.gpuDataManager.onReleaseSession(e)}onRunStart(e){this.currentSessionId=e,this.setQueryType()}}}),Hw={};$r(Hw,{init:()=>JE});var Ko,Gc,JE,YE,ma,ga,jr,QE,qw,Fo,ba,ya,Kw,_a,va,wa,qr,Ft,Xo,es,ts,Qa,Uc,Wc,mo,go,tC,Xw,Zw,Jw,Yw,Qw,ex,tx,nx,nC,ns,jw=k(()=>{"use strict";le(),Bn(),ge(),Fy(),Ko=class e{constructor(e,t,i,n){this.module=e,this.dataType=t,this.data=i,this.dims=n}getFloat32Array(){if(1!==this.dataType)throw Error("Invalid data type");let e=C.size(this.dims);return 0===e?new Float32Array:new Float32Array(this.module.HEAP8.buffer,this.data,e)}getBigInt64Array(){if(7!==this.dataType)throw Error("Invalid data type");let e=C.size(this.dims);return 0===e?new BigInt64Array:new BigInt64Array(this.module.HEAP8.buffer,this.data,e)}getInt32Array(){if(6!==this.dataType)throw Error("Invalid data type");let e=C.size(this.dims);return 0===e?new Int32Array:new Int32Array(this.module.HEAP8.buffer,this.data,e)}getUint16Array(){if(10!==this.dataType&&4!==this.dataType)throw Error("Invalid data type");let e=C.size(this.dims);return 0===e?new Uint16Array:new Uint16Array(this.module.HEAP8.buffer,this.data,e)}reshape(t){if(C.size(t)!==C.size(this.dims))throw Error("Invalid new shape");return new e(this.module,this.dataType,this.data,t)}},Gc=class{constructor(e,t,i){this.module=e,this.backend=t,this.customDataOffset=0,this.customDataSize=0,this.adapterInfo=t.adapterInfo;let n=e.PTR_SIZE,o=i/e.PTR_SIZE,a=4===n?"i32":"i64";this.opKernelContext=Number(e.getValue(n*o++,a));let s=Number(e.getValue(n*o++,a));this.outputCount=Number(e.getValue(n*o++,a)),this.customDataOffset=Number(e.getValue(n*o++,"*")),this.customDataSize=Number(e.getValue(n*o++,a));let u=[];for(let t=0;t<s;t++){let t=Number(e.getValue(n*o++,a)),i=Number(e.getValue(n*o++,"*")),s=Number(e.getValue(n*o++,a)),l=[];for(let t=0;t<s;t++)l.push(Number(e.getValue(n*o++,a)));u.push(new Ko(e,t,i,l))}this.inputs=u}get kernelCustomData(){return this.backend.currentKernelCustomData}get customDataBuffer(){return this.module.HEAPU8.subarray(this.customDataOffset,this.customDataOffset+this.customDataSize)}compute(e,t){let i=t?.inputs?.map(e=>"number"==typeof e?this.inputs[e]:e)??this.inputs,n=t?.outputs??[],o=(e,t,i)=>new Ko(this.module,t,this.output(e,i),i),a=(e,t)=>{let i=vr(e,t);if(!i)throw Error(`Unsupported data type: ${e}`);let n=i>0?this.backend.gpuDataManager.create(i).id:0;return new Ko(this.module,e,n,t)};return this.backend.run(e,i,n,o,a,this.outputCount)}output(e,t){let i=this.module.stackSave();try{let i=this.module.PTR_SIZE,n=4===i?"i32":"i64",o=this.module.stackAlloc((1+t.length)*i);this.module.setValue(o,t.length,n);for(let e=0;e<t.length;e++)this.module.setValue(o+i*(e+1),t[e],n);return this.module._JsepOutput(this.opKernelContext,e,o)}catch(i){throw Error(`Failed to generate kernel's output[${e}] with dims [${t}]. If you are running with pre-allocated output, please make sure the output type/dims are correct. Error: ${i}`)}finally{this.module.stackRestore(i)}}},JE=async(e,t,i,n)=>{let o=t.jsepInit;if(!o)throw Error("Failed to initialize JSEP. The WebAssembly module is not built with JSEP support.");if("webgpu"===e){let e=new(Ww(),Jr(Uw)).WebGpuBackend;await e.initialize(i,n),o("webgpu",[e,t=>e.alloc(Number(t)),t=>e.free(t),(i,n,o,a=!1)=>{if(a)_e("verbose",()=>`[WebGPU] jsepCopyGpuToGpu: src=${Number(i)}, dst=${Number(n)}, size=${Number(o)}`),e.memcpy(Number(i),Number(n));else{_e("verbose",()=>`[WebGPU] jsepCopyCpuToGpu: dataOffset=${Number(i)}, gpuDataId=${Number(n)}, size=${Number(o)}`);let a=t.HEAPU8.subarray(Number(i>>>0),Number(i>>>0)+Number(o));e.upload(Number(n),a)}},async(i,n,o)=>{_e("verbose",()=>`[WebGPU] jsepCopyGpuToCpu: gpuDataId=${i}, dataOffset=${n}, size=${o}`),await e.download(Number(i),()=>t.HEAPU8.subarray(Number(n)>>>0,Number(n+o)>>>0))},(i,n,o)=>e.createKernel(i,Number(n),o,t.UTF8ToString(t._JsepGetNodeName(Number(n)))),t=>e.releaseKernel(t),(i,n,o,a)=>{_e("verbose",()=>`[WebGPU] jsepRun: sessionHandle=${o}, kernel=${i}, contextDataOffset=${n}`);let s=new Gc(t,e,Number(n));return e.computeKernel(Number(i),s,a)},()=>e.captureBegin(),()=>e.captureEnd(),()=>e.replay()])}else{let e=new ka(i);o("webnn",[e,()=>e.reserveTensorId(),t=>e.releaseTensorId(t),async(t,i,n,o,a)=>e.ensureTensor(t,i,n,o,a),(t,i)=>{e.uploadTensor(t,i)},async(t,i)=>e.downloadTensor(t,i),(t,i)=>e.registerMLContext(t,i),!!i.trace])}}}),rc=k(()=>{"use strict";pt(),Ay(),Py(),le(),yr(),Ta(),lc(),YE=(e,t)=>{0!==Be()._OrtInit(e,t)&&Ne("Can't initialize onnxruntime.")},ma=async e=>{YE(e.wasm.numThreads,Go(e.logLevel))},ga=async(e,t)=>{Be().asyncInit?.();let i=e.webgpu.adapter;if("webgpu"===t){if(typeof navigator>"u"||!navigator.gpu)throw Error("WebGPU is not supported in current environment");if(i){if("object"!=typeof i.limits||"object"!=typeof i.features||"function"!=typeof i.requestDevice)throw Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.")}else{let t=e.webgpu.powerPreference;if(void 0!==t&&"low-power"!==t&&"high-performance"!==t)throw Error(`Invalid powerPreference setting: "${t}"`);let n=e.webgpu.forceFallbackAdapter;if(void 0!==n&&"boolean"!=typeof n)throw Error(`Invalid forceFallbackAdapter setting: "${n}"`);if(!(i=await navigator.gpu.requestAdapter({powerPreference:t,forceFallbackAdapter:n})))throw Error('Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.')}}if("webnn"===t&&(typeof navigator>"u"||!navigator.ml))throw Error("WebNN is not supported in current environment");{let n=(jw(),Jr(Hw)).init;"webgpu"===t&&await n("webgpu",Be(),e,i),"webnn"===t&&await n("webnn",Be(),e)}},jr=new Map,QE=e=>{let t=Be(),i=t.stackSave();try{let i=t.PTR_SIZE,n=t.stackAlloc(2*i);0!==t._OrtGetInputOutputCount(e,n,n+i)&&Ne("Can't get session input/output count.");let o=4===i?"i32":"i64";return[Number(t.getValue(n,o)),Number(t.getValue(n+i,o))]}finally{t.stackRestore(i)}},qw=(e,t)=>{let i=Be(),n=i.stackSave(),o=0;try{let n=i.PTR_SIZE,a=i.stackAlloc(2*n);0!==i._OrtGetInputOutputMetadata(e,t,a,a+n)&&Ne("Can't get session input/output metadata.");let s=Number(i.getValue(a,"*"));o=Number(i.getValue(a+n,"*"));let u=i.HEAP32[o/4];if(0===u)return[s,0];let l=i.HEAPU32[o/4+1],d=[];for(let e=0;e<l;e++){let t=Number(i.getValue(o+8+e*n,"*"));d.push(0!==t?i.UTF8ToString(t):Number(i.getValue(o+8+(e+l)*n,"*")))}return[s,u,d]}finally{i.stackRestore(n),0!==o&&i._OrtFree(o)}},Fo=e=>{let t=Be(),i=t._malloc(e.byteLength);if(0===i)throw Error(`Can't create a session. failed to allocate a buffer of size ${e.byteLength}.`);return t.HEAPU8.set(e,i),[i,e.byteLength]},ba=async(e,t)=>{let i,n,o=Be();Array.isArray(e)?[i,n]=e:e.buffer===o.HEAPU8.buffer?[i,n]=[e.byteOffset,e.byteLength]:[i,n]=Fo(e);let a=0,s=0,u=0,l=[],d=[],p=[];try{if([s,l]=await Oy(t),t?.externalData&&o.mountExternalData){let e=[];for(let i of t.externalData){let t="string"==typeof i?i:i.path;e.push(Uo("string"==typeof i?i:i.data).then(e=>{o.mountExternalData(t,e)}))}await Promise.all(e)}for(let e of t?.executionProviders??[])if(("string"==typeof e?e:e.name)==="webnn"){if(o.shouldTransferToMLTensor=!1,"string"!=typeof e){let t=e,i=t?.context,n=t?.gpuDevice,a=t?.deviceType,s=t?.powerPreference;i?o.currentContext=i:n?o.currentContext=await o.webnnCreateMLContext(n):o.currentContext=await o.webnnCreateMLContext({deviceType:a,powerPreference:s})}else o.currentContext=await o.webnnCreateMLContext();break}a=await o._OrtCreateSession(i,n,s),o.webgpuOnCreateSession?.(a),0===a&&Ne("Can't create a session."),o.jsepOnCreateSession?.(),o.currentContext&&(o.webnnRegisterMLContext(a,o.currentContext),o.currentContext=void 0,o.shouldTransferToMLTensor=!0);let[e,c]=QE(a),h=!!t?.enableGraphCapture,f=[],m=[],g=[],b=[],y=[];for(let t=0;t<e;t++){let[e,i,n]=qw(a,t);0===e&&Ne("Can't get an input name."),d.push(e);let s=o.UTF8ToString(e);f.push(s),g.push(0===i?{name:s,isTensor:!1}:{name:s,isTensor:!0,type:Mn(i),shape:n})}for(let i=0;i<c;i++){let[n,s,u]=qw(a,i+e);0===n&&Ne("Can't get an output name."),p.push(n);let l=o.UTF8ToString(n);m.push(l),b.push(0===s?{name:l,isTensor:!1}:{name:l,isTensor:!0,type:Mn(s),shape:u});{if(h&&t?.preferredOutputLocation===void 0){y.push("gpu-buffer");continue}let e="string"==typeof t?.preferredOutputLocation?t.preferredOutputLocation:t?.preferredOutputLocation?.[l]??"cpu",i=o.webnnIsGraphOutput;if("cpu"===e&&i&&i(a,l)){y.push("ml-tensor-cpu-output");continue}if("cpu"!==e&&"cpu-pinned"!==e&&"gpu-buffer"!==e&&"ml-tensor"!==e)throw Error(`Not supported preferred output location: ${e}.`);if(h&&"gpu-buffer"!==e)throw Error(`Not supported preferred output location: ${e}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);y.push(e)}}let _=null;return y.some(e=>"gpu-buffer"===e||"ml-tensor"===e||"ml-tensor-cpu-output"===e)&&(u=o._OrtCreateBinding(a),0===u&&Ne("Can't create IO binding."),_={handle:u,outputPreferredLocations:y,outputPreferredLocationsEncoded:y.map(e=>"ml-tensor-cpu-output"===e?"ml-tensor":e).map(e=>uc(e))}),jr.set(a,[a,d,p,_,h,!1]),[a,f,m,g,b]}catch(e){throw d.forEach(e=>o._OrtFree(e)),p.forEach(e=>o._OrtFree(e)),0!==u&&0!==o._OrtReleaseBinding(u)&&Ne("Can't release IO binding."),0!==a&&0!==o._OrtReleaseSession(a)&&Ne("Can't release session."),e}finally{o._free(i),0!==s&&0!==o._OrtReleaseSessionOptions(s)&&Ne("Can't release session options."),l.forEach(e=>o._free(e)),o.unmountExternalData?.()}},ya=e=>{let t=Be(),i=jr.get(e);if(!i)throw Error(`cannot release session. invalid session id: ${e}`);let[n,o,a,s,u]=i;s&&(u&&0!==t._OrtClearBoundOutputs(s.handle)&&Ne("Can't clear bound outputs."),0!==t._OrtReleaseBinding(s.handle)&&Ne("Can't release IO binding.")),t.jsepOnReleaseSession?.(e),t.webnnOnReleaseSession?.(e),t.webgpuOnReleaseSession?.(e),o.forEach(e=>t._OrtFree(e)),a.forEach(e=>t._OrtFree(e)),0!==t._OrtReleaseSession(n)&&Ne("Can't release session."),jr.delete(e)},Kw=async(e,t,i,n,o,a,s=!1)=>{if(!e)return void t.push(0);let u=Be(),l=u.PTR_SIZE,d=e[0],p=e[1],c=e[3],h=c,f,m;if("string"===d&&("gpu-buffer"===c||"ml-tensor"===c))throw Error("String tensor is not supported on GPU.");if(s&&"gpu-buffer"!==c)throw Error(`External buffer must be provided for input/output index ${a} when enableGraphCapture is true.`);if("gpu-buffer"===c){let t=e[2].gpuBuffer;m=vr(_r(d),p);{let e=u.jsepRegisterBuffer;if(!e)throw Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');f=e(n,a,t,m)}}else if("ml-tensor"===c){let t=e[2].mlTensor;m=vr(_r(d),p);let i=u.webnnRegisterMLTensor;if(!i)throw Error('Tensor location "ml-tensor" is not supported without using WebNN.');f=i(n,t,_r(d),p)}else{let t=e[2];if(Array.isArray(t)){m=l*t.length,f=u._malloc(m),i.push(f);for(let e=0;e<t.length;e++){if("string"!=typeof t[e])throw TypeError(`tensor data at index ${e} is not a string`);u.setValue(f+e*l,Pt(t[e],i),"*")}}else{let e=u.webnnIsGraphInput,a=u.webnnIsGraphOutput;if("string"!==d&&e&&a){let s=u.UTF8ToString(o);if(e(n,s)||a(n,s)){let e=_r(d);m=vr(e,p),h="ml-tensor";let i=u.webnnCreateTemporaryTensor,o=u.webnnUploadTensor;if(!i||!o)throw Error('Tensor location "ml-tensor" is not supported without using WebNN.');let a=await i(n,e,p);o(a,new Uint8Array(t.buffer,t.byteOffset,t.byteLength)),f=a}else m=t.byteLength,f=u._malloc(m),i.push(f),u.HEAPU8.set(new Uint8Array(t.buffer,t.byteOffset,m),f)}else m=t.byteLength,f=u._malloc(m),i.push(f),u.HEAPU8.set(new Uint8Array(t.buffer,t.byteOffset,m),f)}}let g=u.stackSave(),b=u.stackAlloc(4*p.length);try{p.forEach((e,t)=>u.setValue(b+t*l,e,4===l?"i32":"i64"));let e=u._OrtCreateTensor(_r(d),f,m,b,p.length,uc(h));0===e&&Ne(`Can't create tensor for input/output. session=${n}, index=${a}.`),t.push(e)}finally{u.stackRestore(g)}},_a=async(e,t,i,n,o,a)=>{let s=Be(),u=s.PTR_SIZE,l=jr.get(e);if(!l)throw Error(`cannot run inference. invalid session id: ${e}`);let d=l[0],p=l[1],c=l[2],h=l[3],f=l[4],m=l[5],g=t.length,b=n.length,y=0,_=[],v=[],x=[],w=[],$=s.stackSave(),T=s.stackAlloc(g*u),I=s.stackAlloc(g*u),S=s.stackAlloc(b*u),O=s.stackAlloc(b*u);try{let l;[y,_]=$y(a),ur("wasm prepareInputOutputTensor");for(let n=0;n<g;n++)await Kw(i[n],v,w,e,p[t[n]],t[n],f);for(let t=0;t<b;t++)await Kw(o[t],x,w,e,c[n[t]],g+n[t],f);lr("wasm prepareInputOutputTensor");for(let e=0;e<g;e++)s.setValue(T+e*u,v[e],"*"),s.setValue(I+e*u,p[t[e]],"*");for(let e=0;e<b;e++)s.setValue(S+e*u,x[e],"*"),s.setValue(O+e*u,c[n[e]],"*");if(h&&!m){let{handle:i,outputPreferredLocations:a,outputPreferredLocationsEncoded:u}=h;if(p.length!==g)throw Error(`input count from feeds (${g}) is expected to be always equal to model's input count (${p.length}).`);ur("wasm bindInputsOutputs");for(let n=0;n<g;n++){let o=t[n];await s._OrtBindInput(i,p[o],v[n])!==0&&Ne(`Can't bind input[${n}] for session=${e}.`)}for(let t=0;t<b;t++){let l=n[t];o[t]?.[3]?0!==s._OrtBindOutput(i,c[l],x[t],0)&&Ne(`Can't bind pre-allocated output[${t}] for session=${e}.`):0!==s._OrtBindOutput(i,c[l],0,u[l])&&Ne(`Can't bind output[${t}] to ${a[t]} for session=${e}.`)}lr("wasm bindInputsOutputs"),jr.set(e,[d,p,c,h,f,!0])}s.jsepOnRunStart?.(d),s.webnnOnRunStart?.(d),l=h?await s._OrtRunWithBinding(d,h.handle,b,S,y):await s._OrtRun(d,I,T,g,O,b,S,y),0!==l&&Ne("failed to call OrtRun().");let $=[],E=[];ur("wasm ProcessOutputTensor");for(let t=0;t<b;t++){let i=Number(s.getValue(S+t*u,"*"));if(i===x[t]){$.push(o[t]);continue}let a=s.stackSave(),l=s.stackAlloc(4*u),d=!1,p,c=0;try{0!==s._OrtGetTensorData(i,l,l+u,l+2*u,l+3*u)&&Ne(`Can't access output tensor data on index ${t}.`);let o=4===u?"i32":"i64",a=Number(s.getValue(l,o));c=s.getValue(l+u,"*");let f=s.getValue(l+2*u,"*"),m=Number(s.getValue(l+3*u,o)),g=[];for(let e=0;e<m;e++)g.push(Number(s.getValue(f+e*u,o)));0!==s._OrtFree(f)&&Ne("Can't free memory for tensor dims.");let b=g.reduce((e,t)=>e*t,1);p=Mn(a);let y=h?.outputPreferredLocations[n[t]];if("string"===p){if("gpu-buffer"===y||"ml-tensor"===y)throw Error("String tensor is not supported on GPU.");let e=[];for(let t=0;t<b;t++){let i=s.getValue(c+t*u,"*"),n=s.getValue(c+(t+1)*u,"*"),o=t===b-1?void 0:n-i;e.push(s.UTF8ToString(i,o))}$.push([p,g,e,"cpu"])}else if("gpu-buffer"===y&&b>0){let e=s.jsepGetBuffer;if(!e)throw Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');let t=e(c),n=vr(a,b);if(void 0===n||!Sa(p))throw Error(`Unsupported data type: ${p}`);d=!0,$.push([p,g,{gpuBuffer:t,download:s.jsepCreateDownloader(t,n,p),dispose:()=>{0!==s._OrtReleaseTensor(i)&&Ne("Can't release tensor.")}},"gpu-buffer"])}else if("ml-tensor"===y&&b>0){let t=s.webnnEnsureTensor,n=s.webnnIsGraphInputOutputTypeSupported;if(!t||!n)throw Error('preferredLocation "ml-tensor" is not supported without using WebNN.');if(void 0===vr(a,b)||!$a(p))throw Error(`Unsupported data type: ${p}`);if(!n(e,p,!1))throw Error(`preferredLocation "ml-tensor" for ${p} output is not supported by current WebNN Context.`);let o=await t(e,c,a,g,!1);d=!0,$.push([p,g,{mlTensor:o,download:s.webnnCreateMLTensorDownloader(c,p),dispose:()=>{s.webnnReleaseTensorId(c),s._OrtReleaseTensor(i)}},"ml-tensor"])}else if("ml-tensor-cpu-output"===y&&b>0){let e=s.webnnCreateMLTensorDownloader(c,p)(),t=$.length;d=!0,E.push((async()=>{let n=[t,await e];return s.webnnReleaseTensorId(c),s._OrtReleaseTensor(i),n})()),$.push([p,g,[],"cpu"])}else{let e=new(co(p))(b);new Uint8Array(e.buffer,e.byteOffset,e.byteLength).set(s.HEAPU8.subarray(c,c+e.byteLength)),$.push([p,g,e,"cpu"])}}finally{s.stackRestore(a),"string"===p&&c&&s._free(c),d||s._OrtReleaseTensor(i)}}for(let[t,i]of(h&&!f&&(0!==s._OrtClearBoundOutputs(h.handle)&&Ne("Can't clear bound outputs."),jr.set(e,[d,p,c,h,f,!1])),await Promise.all(E)))$[t][2]=i;return lr("wasm ProcessOutputTensor"),$}finally{s.webnnOnRunEnd?.(d),s.stackRestore($),v.forEach(e=>s._OrtReleaseTensor(e)),x.forEach(e=>s._OrtReleaseTensor(e)),w.forEach(e=>s._free(e)),0!==y&&s._OrtReleaseRunOptions(y),_.forEach(e=>s._free(e))}},va=e=>{let t=Be(),i=jr.get(e);if(!i)throw Error("invalid session id");let n=i[0],o=t._OrtEndProfiling(n);0===o&&Ne("Can't get an profile file name."),t._OrtFree(o)},wa=e=>{let t=[];for(let i of e){let e=i[2];!Array.isArray(e)&&"buffer"in e&&t.push(e.buffer)}return t}}),Hc=k(()=>{"use strict";pt(),rc(),yr(),fa(),qr=()=>!!me.wasm.proxy&&"u">typeof document,Xo=!1,es=!1,ts=!1,Wc=new Map,mo=(e,t)=>{let i=Wc.get(e);i?i.push(t):Wc.set(e,[t])},go=()=>{if(Xo||!es||ts||!Ft)throw Error("worker not ready")},tC=e=>{switch(e.data.type){case"init-wasm":Xo=!1,e.data.err?(ts=!0,Uc[1](e.data.err)):(es=!0,Uc[0]()),Qa&&(URL.revokeObjectURL(Qa),Qa=void 0);break;case"init-ep":case"copy-from":case"create":case"release":case"run":case"end-profiling":{let t=Wc.get(e.data.type);e.data.err?t.shift()[1](e.data.err):t.shift()[0](e.data.out)}}},Xw=async()=>{if(!es){if(Xo)throw Error("multiple calls to 'initWasm()' detected.");if(ts)throw Error("previous call to 'initWasm()' failed.");if(Xo=!0,qr())return new Promise((e,t)=>{Ft?.terminate(),Ty().then(([i,n])=>{try{(Ft=n).onerror=e=>t(e),Ft.onmessage=tC,Uc=[e,t];let o={type:"init-wasm",in:me};!o.in.wasm.wasmPaths&&(i||ic)&&(o.in.wasm.wasmPaths={wasm:new URL("ort-wasm-simd-threaded.jsep.wasm",import.meta.url).href}),Ft.postMessage(o),Qa=i}catch(e){t(e)}},t)});try{await ha(me.wasm),await ma(me),es=!0}catch(e){throw ts=!0,e}finally{Xo=!1}}},Zw=async e=>{if(qr())return go(),new Promise((t,i)=>{mo("init-ep",[t,i]);let n={type:"init-ep",in:{epName:e,env:me}};Ft.postMessage(n)});await ga(me,e)},Jw=async e=>qr()?(go(),new Promise((t,i)=>{mo("copy-from",[t,i]);let n={type:"copy-from",in:{buffer:e}};Ft.postMessage(n,[e.buffer])})):Fo(e),Yw=async(e,t)=>{if(!qr())return ba(e,t);if(t?.preferredOutputLocation)throw Error('session option "preferredOutputLocation" is not supported for proxy.');return go(),new Promise((i,n)=>{mo("create",[i,n]);let o={type:"create",in:{model:e,options:{...t}}},a=[];e instanceof Uint8Array&&a.push(e.buffer),Ft.postMessage(o,a)})},Qw=async e=>{if(qr())return go(),new Promise((t,i)=>{mo("release",[t,i]);let n={type:"release",in:e};Ft.postMessage(n)});ya(e)},ex=async(e,t,i,n,o,a)=>{if(!qr())return _a(e,t,i,n,o,a);if(i.some(e=>"cpu"!==e[3]))throw Error("input tensor on GPU is not supported for proxy.");if(o.some(e=>e))throw Error("pre-allocated output tensor is not supported for proxy.");return go(),new Promise((o,s)=>{mo("run",[o,s]);let u=i,l={type:"run",in:{sessionId:e,inputIndices:t,inputs:u,outputIndices:n,options:a}};Ft.postMessage(l,wa(u))})},tx=async e=>{if(qr())return go(),new Promise((t,i)=>{mo("end-profiling",[t,i]);let n={type:"end-profiling",in:e};Ft.postMessage(n)});va(e)}}),rx=k(()=>{"use strict";pt(),Hc(),le(),pa(),lc(),nx=(e,t)=>{switch(e.location){case"cpu":return[e.type,e.dims,e.data,"cpu"];case"gpu-buffer":return[e.type,e.dims,{gpuBuffer:e.gpuBuffer},"gpu-buffer"];case"ml-tensor":return[e.type,e.dims,{mlTensor:e.mlTensor},"ml-tensor"];default:throw Error(`invalid data location: ${e.location} for ${t()}`)}},nC=e=>{switch(e[3]){case"cpu":return new St(e[0],e[2],e[1]);case"gpu-buffer":{let t=e[0];if(!Sa(t))throw Error(`not supported data type: ${t} for deserializing GPU tensor`);let{gpuBuffer:i,download:n,dispose:o}=e[2];return St.fromGpuBuffer(i,{dataType:t,dims:e[1],download:n,dispose:o})}case"ml-tensor":{let t=e[0];if(!$a(t))throw Error(`not supported data type: ${t} for deserializing MLTensor tensor`);let{mlTensor:i,download:n,dispose:o}=e[2];return St.fromMLTensor(i,{dataType:t,dims:e[1],download:n,dispose:o})}default:throw Error(`invalid data location: ${e[3]}`)}},ns=class{async fetchModelAndCopyToWasmMemory(e){return Jw(await Uo(e))}async loadModel(e,t){let i;$t(),i="string"==typeof e?await this.fetchModelAndCopyToWasmMemory(e):e,[this.sessionId,this.inputNames,this.outputNames,this.inputMetadata,this.outputMetadata]=await Yw(i,t),yt()}async dispose(){return Qw(this.sessionId)}async run(e,t,i){$t();let n=[],o=[];Object.entries(e).forEach(e=>{let t=e[0],i=e[1],a=this.inputNames.indexOf(t);if(-1===a)throw Error(`invalid input '${t}'`);n.push(i),o.push(a)});let a=[],s=[];Object.entries(t).forEach(e=>{let t=e[0],i=e[1],n=this.outputNames.indexOf(t);if(-1===n)throw Error(`invalid output '${t}'`);a.push(i),s.push(n)});let u=n.map((e,t)=>nx(e,()=>`input "${this.inputNames[o[t]]}"`)),l=a.map((e,t)=>e?nx(e,()=>`output "${this.outputNames[s[t]]}"`):null),d=await ex(this.sessionId,o,u,s,l,i),p={};for(let e=0;e<d.length;e++)p[this.outputNames[s[e]]]=a[e]??nC(d[e]);return yt(),p}startProfiling(){}endProfiling(){tx(this.sessionId)}}}),ix={};$r(ix,{OnnxruntimeWebAssemblyBackend:()=>rs,initializeFlags:()=>ox,wasmBackend:()=>rC});var ox,rs,rC,ax=k(()=>{"use strict";pt(),Hc(),rx(),ox=()=>{("number"!=typeof me.wasm.initTimeout||me.wasm.initTimeout<0)&&(me.wasm.initTimeout=0);let e=me.wasm.simd;if("boolean"!=typeof e&&void 0!==e&&"fixed"!==e&&"relaxed"!==e&&(console.warn(`Property "env.wasm.simd" is set to unknown value "${e}". Reset it to \`false\` and ignore SIMD feature checking.`),me.wasm.simd=!1),"boolean"!=typeof me.wasm.proxy&&(me.wasm.proxy=!1),"boolean"!=typeof me.wasm.trace&&(me.wasm.trace=!1),"number"!=typeof me.wasm.numThreads||!Number.isInteger(me.wasm.numThreads)||me.wasm.numThreads<=0)if("u">typeof self&&!self.crossOriginIsolated)me.wasm.numThreads=1;else{let e=typeof navigator>"u"?Os("node:os").cpus().length:navigator.hardwareConcurrency;me.wasm.numThreads=Math.min(4,Math.ceil((e||1)/2))}},rC=new(rs=class{async init(e){ox(),await Xw(),await Zw(e)}async createInferenceSessionHandler(e,t){let i=new ns;return await i.loadModel(e,t),i}})});pt(),pt(),pt();var Dp="1.23.0",zq=Ns;{let r=(cy(),Jr(ly)).onnxjsBackend;sr("webgl",r,-10)}{let r=(ax(),Jr(ix)).wasmBackend;sr("webgpu",r,5),sr("webnn",r,5),sr("cpu",r,10),sr("wasm",r,10)}Object.defineProperty(me.versions,"web",{value:Dp,enumerable:!0});export{LT as InferenceSession,li as TRACE,ur as TRACE_EVENT_BEGIN,lr as TRACE_EVENT_END,$t as TRACE_FUNC_BEGIN,yt as TRACE_FUNC_END,St as Tensor,zq as default,me as env,sr as registerBackend};