let t;var i=Object.defineProperty,r=Object.getOwnPropertyDescriptor,a=Object.getOwnPropertyNames,n=Object.prototype.hasOwnProperty,s,o,u,l,d,p,c,h,f,m,g,y,_,b,$,v,w,x,C,k,S,T,I,E,z,A,O,R,B,N,M,D,P,U=(t=function(t){if("u">typeof require)return require.apply(this,arguments);throw Error('Dynamic require of "'+t+'" is not supported')},"u">typeof require?require:"u">typeof Proxy?new Proxy(t,{get:(t,i)=>("u">typeof require?require:t)[i]}):t),q=(t,i)=>()=>(t&&(i=t(t=0)),i),W=(t,r)=>{for(var a in r)i(t,a,{get:r[a],enumerable:!0})},L=t=>((t,s,o,u)=>{if(s&&"object"==typeof s||"function"==typeof s)for(let l of a(s))n.call(t,l)||l===o||i(t,l,{get:()=>s[l],enumerable:!(u=r(s,l))||u.enumerable});return t})(i({},"__esModule",{value:!0}),t),V=q(()=>{"use strict";s=new Map,o=[],u=(t,i,r)=>{if(i&&"function"==typeof i.init&&"function"==typeof i.createInferenceSessionHandler){let a=s.get(t);if(void 0===a)s.set(t,{backend:i,priority:r});else{if(a.priority>r)return;if(a.priority===r&&a.backend!==i)throw Error(`cannot register backend "${t}" using priority ${r}`)}if(r>=0){let i=o.indexOf(t);-1!==i&&o.splice(i,1);for(let i=0;i<o.length;i++)if(s.get(o[i]).priority<=r)return void o.splice(i,0,t);o.push(t)}return}throw TypeError("not a valid backend")},l=async t=>{let i=s.get(t);if(!i)return"backend not found.";if(i.initialized)return i.backend;if(i.aborted)return i.error;{let r=!!i.initPromise;try{return r||(i.initPromise=i.backend.init(t)),await i.initPromise,i.initialized=!0,i.backend}catch(t){return r||(i.error=`${t}`,i.aborted=!0),i.error}finally{delete i.initPromise}}},d=async t=>{let i=t.executionProviders||[],r=i.map(t=>"string"==typeof t?t:t.name),a=0===r.length?o:r,n,s=[],u=new Set;for(let t of a){let i=await l(t);"string"==typeof i?s.push({name:t,err:i}):(n||(n=i),n===i&&u.add(t))}if(!n)throw Error(`no available backend found. ERR: ${s.map(t=>`[${t.name}] ${t.err}`).join(", ")}`);for(let{name:t,err:i}of s)r.includes(t)&&console.warn(`removing requested execution provider "${t}" from session options because it is not available: ${i}`);let d=i.filter(t=>u.has("string"==typeof t?t:t.name));return[n,new Proxy(t,{get:(t,i)=>"executionProviders"===i?d:Reflect.get(t,i)})]}}),G=q(()=>{"use strict";V()}),j=q(()=>{"use strict";p="1.23.0"}),H=q(()=>{"use strict";j(),c="warning",Object.defineProperty(h={wasm:{},webgl:{},webgpu:{},versions:{common:p},set logLevel(e){if(void 0!==e){if("string"!=typeof e||-1===["verbose","info","warning","error","fatal"].indexOf(e))throw Error(`Unsupported logging level: ${e}`);c=e}},get logLevel(){return c}},"logLevel",{enumerable:!0})}),F=q(()=>{"use strict";H(),f=h}),K=q(()=>{"use strict";m=(t,i)=>{let r="u">typeof document?document.createElement("canvas"):new OffscreenCanvas(1,1);r.width=t.dims[3],r.height=t.dims[2];let a=r.getContext("2d");if(null!=a){let n,s;i?.tensorLayout!==void 0&&"NHWC"===i.tensorLayout?(n=t.dims[2],s=t.dims[3]):(n=t.dims[3],s=t.dims[2]);let o=i?.format!==void 0?i.format:"RGB",u=i?.norm,l,d;void 0===u||void 0===u.mean?l=[255,255,255,255]:"number"==typeof u.mean?l=[u.mean,u.mean,u.mean,u.mean]:(l=[u.mean[0],u.mean[1],u.mean[2],0],void 0!==u.mean[3]&&(l[3]=u.mean[3])),void 0===u||void 0===u.bias?d=[0,0,0,0]:"number"==typeof u.bias?d=[u.bias,u.bias,u.bias,u.bias]:(d=[u.bias[0],u.bias[1],u.bias[2],0],void 0!==u.bias[3]&&(d[3]=u.bias[3]));let p=s*n,c=0,h=p,f=2*p,m=-1;"RGBA"===o?(c=0,h=p,f=2*p,m=3*p):"RGB"===o?(c=0,h=p,f=2*p):"RBG"===o&&(c=0,f=p,h=2*p);for(let i=0;i<s;i++)for(let r=0;r<n;r++)a.fillStyle="rgba("+(t.data[c++]-d[0])*l[0]+","+(t.data[h++]-d[1])*l[1]+","+(t.data[f++]-d[2])*l[2]+","+(-1===m?255:(t.data[m++]-d[3])*l[3])+")",a.fillRect(r,i,1,1);if("toDataURL"in r)return r.toDataURL();throw Error("toDataURL is not supported")}throw Error("Can not access image data")},g=(t,i)=>{let r="u">typeof document?document.createElement("canvas").getContext("2d"):new OffscreenCanvas(1,1).getContext("2d"),a;if(null!=r){let n,s,o;i?.tensorLayout!==void 0&&"NHWC"===i.tensorLayout?(n=t.dims[2],s=t.dims[1],o=t.dims[3]):(n=t.dims[3],s=t.dims[2],o=t.dims[1]);let u=void 0!==i&&void 0!==i.format?i.format:"RGB",l=i?.norm,d,p;void 0===l||void 0===l.mean?d=[255,255,255,255]:"number"==typeof l.mean?d=[l.mean,l.mean,l.mean,l.mean]:(d=[l.mean[0],l.mean[1],l.mean[2],255],void 0!==l.mean[3]&&(d[3]=l.mean[3])),void 0===l||void 0===l.bias?p=[0,0,0,0]:"number"==typeof l.bias?p=[l.bias,l.bias,l.bias,l.bias]:(p=[l.bias[0],l.bias[1],l.bias[2],0],void 0!==l.bias[3]&&(p[3]=l.bias[3]));let c=s*n;if(void 0!==i&&(void 0!==i.format&&4===o&&"RGBA"!==i.format||3===o&&"RGB"!==i.format&&"BGR"!==i.format))throw Error("Tensor format doesn't match input tensor dims");let h=0,f=1,m=2,g=3,y=0,_=c,b=2*c,$=-1;"RGBA"===u?(y=0,_=c,b=2*c,$=3*c):"RGB"===u?(y=0,_=c,b=2*c):"RBG"===u&&(y=0,b=c,_=2*c),a=r.createImageData(n,s);for(let i=0;i<s*n;h+=4,f+=4,m+=4,g+=4,i++)a.data[h]=(t.data[y++]-p[0])*d[0],a.data[f]=(t.data[_++]-p[1])*d[1],a.data[m]=(t.data[b++]-p[2])*d[2],a.data[g]=-1===$?255:(t.data[$++]-p[3])*d[3]}else throw Error("Can not access image data");return a}}),Z=q(()=>{"use strict";Y(),y=(t,i)=>{if(void 0===t)throw Error("Image buffer must be defined");if(void 0===i.height||void 0===i.width)throw Error("Image height and width must be defined");if("NHWC"===i.tensorLayout)throw Error("NHWC Tensor layout is not supported yet");let{height:r,width:a}=i,n=i.norm??{mean:255,bias:0},s,o;s="number"==typeof n.mean?[n.mean,n.mean,n.mean,n.mean]:[n.mean[0],n.mean[1],n.mean[2],n.mean[3]??255],o="number"==typeof n.bias?[n.bias,n.bias,n.bias,n.bias]:[n.bias[0],n.bias[1],n.bias[2],n.bias[3]??0];let u=void 0!==i.format?i.format:"RGBA",l=void 0!==i.tensorFormat&&void 0!==i.tensorFormat?i.tensorFormat:"RGB",d=r*a,p=new Float32Array("RGBA"===l?4*d:3*d),c=4,h=0,f=1,m=2,g=3,y=0,_=d,b=2*d,$=-1;"RGB"===u&&(c=3,h=0,f=1,m=2,g=-1),"RGBA"===l?$=3*d:"RBG"===l?(y=0,b=d,_=2*d):"BGR"===l&&(b=0,_=d,y=2*d);for(let i=0;i<d;i++,h+=c,m+=c,f+=c,g+=c)p[y++]=(t[h]+o[0])/s[0],p[_++]=(t[f]+o[1])/s[1],p[b++]=(t[m]+o[2])/s[2],-1!==$&&-1!==g&&(p[$++]=(t[g]+o[3])/s[3]);return"RGBA"===l?new E("float32",p,[1,4,r,a]):new E("float32",p,[1,3,r,a])},_=async(t,i)=>{let r="u">typeof HTMLImageElement&&t instanceof HTMLImageElement,a="u">typeof ImageData&&t instanceof ImageData,n="u">typeof ImageBitmap&&t instanceof ImageBitmap,s="string"==typeof t,o,u=i??{},l=()=>{if("u">typeof document)return document.createElement("canvas");if("u">typeof OffscreenCanvas)return new OffscreenCanvas(1,1);throw Error("Canvas is not supported")},d=t=>"u">typeof HTMLCanvasElement&&t instanceof HTMLCanvasElement||t instanceof OffscreenCanvas?t.getContext("2d"):null;if(r){let r=l();r.width=t.width,r.height=t.height;let a=d(r);if(null!=a){let r=t.height,n=t.width;if(void 0!==i&&void 0!==i.resizedHeight&&void 0!==i.resizedWidth&&(r=i.resizedHeight,n=i.resizedWidth),void 0!==i){if(u=i,void 0!==i.tensorFormat)throw Error("Image input config format must be RGBA for HTMLImageElement");u.tensorFormat="RGBA",u.height=r,u.width=n}else u.tensorFormat="RGBA",u.height=r,u.width=n;a.drawImage(t,0,0),o=a.getImageData(0,0,n,r).data}else throw Error("Can not access image data")}else if(a){let r,a;if(void 0!==i&&void 0!==i.resizedWidth&&void 0!==i.resizedHeight?(r=i.resizedHeight,a=i.resizedWidth):(r=t.height,a=t.width),void 0!==i&&(u=i),u.format="RGBA",u.height=r,u.width=a,void 0!==i){let i=l();i.width=a,i.height=r;let n=d(i);if(null!=n)n.putImageData(t,0,0),o=n.getImageData(0,0,a,r).data;else throw Error("Can not access image data")}else o=t.data}else if(n){if(void 0===i)throw Error("Please provide image config with format for Imagebitmap");let r=l();r.width=t.width,r.height=t.height;let a=d(r);if(null!=a){let i=t.height,r=t.width;return a.drawImage(t,0,0,r,i),o=a.getImageData(0,0,r,i).data,u.height=i,u.width=r,y(o,u)}throw Error("Can not access image data")}else{if(s)return new Promise((i,r)=>{let a=l(),n=d(a);if(!t||!n)return r();let s=new Image;s.crossOrigin="Anonymous",s.src=t,s.onload=()=>{a.width=s.width,a.height=s.height,n.drawImage(s,0,0,a.width,a.height);let t=n.getImageData(0,0,a.width,a.height);u.height=a.height,u.width=a.width,i(y(t.data,u))}});throw Error("Input data provided is not supported - aborted tensor creation")}if(void 0!==o)return y(o,u);throw Error("Input data provided is not supported - aborted tensor creation")},b=(t,i)=>{let{width:r,height:a,download:n,dispose:s}=i;return new E({location:"texture",type:"float32",texture:t,dims:[1,a,r,4],download:n,dispose:s})},$=(t,i)=>{let{dataType:r,dims:a,download:n,dispose:s}=i;return new E({location:"gpu-buffer",type:r??"float32",gpuBuffer:t,dims:a,download:n,dispose:s})},v=(t,i)=>{let{dataType:r,dims:a,download:n,dispose:s}=i;return new E({location:"ml-tensor",type:r??"float32",mlTensor:t,dims:a,download:n,dispose:s})},w=(t,i,r)=>new E({location:"cpu-pinned",type:t,data:i,dims:r??[i.length]})}),Q=q(()=>{"use strict";x=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],["int16",Int16Array],["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array],["int4",Uint8Array],["uint4",Uint8Array]]),C=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],[Int16Array,"int16"],[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]),k=!1,S=()=>{if(!k){k=!0;let t="u">typeof BigInt64Array&&BigInt64Array.from,i="u">typeof BigUint64Array&&BigUint64Array.from,r=globalThis.Float16Array,a="u">typeof r&&r.from;t&&(x.set("int64",BigInt64Array),C.set(BigInt64Array,"int64")),i&&(x.set("uint64",BigUint64Array),C.set(BigUint64Array,"uint64")),a?(x.set("float16",r),C.set(r,"float16")):x.set("float16",Uint16Array)}}}),X=q(()=>{"use strict";Y(),T=t=>{let i=1;for(let r=0;r<t.length;r++){let a=t[r];if("number"!=typeof a||!Number.isSafeInteger(a))throw TypeError(`dims[${r}] must be an integer, got: ${a}`);if(a<0)throw RangeError(`dims[${r}] must be a non-negative integer, got: ${a}`);i*=a}return i},I=(t,i)=>{switch(t.location){case"cpu":return new E(t.type,t.data,i);case"cpu-pinned":return new E({location:"cpu-pinned",data:t.data,type:t.type,dims:i});case"texture":return new E({location:"texture",texture:t.texture,type:t.type,dims:i});case"gpu-buffer":return new E({location:"gpu-buffer",gpuBuffer:t.gpuBuffer,type:t.type,dims:i});case"ml-tensor":return new E({location:"ml-tensor",mlTensor:t.mlTensor,type:t.type,dims:i});default:throw Error(`tensorReshape: tensor location ${t.location} is not supported`)}}}),Y=q(()=>{"use strict";K(),Z(),Q(),X(),E=class{constructor(t,i,r){let a,n;if(S(),"object"==typeof t&&"location"in t)switch(this.dataLocation=t.location,a=t.type,n=t.dims,t.location){case"cpu-pinned":{let i=x.get(a);if(!i)throw TypeError(`unsupported type "${a}" to create tensor from pinned buffer`);if(!(t.data instanceof i))throw TypeError(`buffer should be of type ${i.name}`);this.cpuData=t.data;break}case"texture":if("float32"!==a)throw TypeError(`unsupported type "${a}" to create tensor from texture`);this.gpuTextureData=t.texture,this.downloader=t.download,this.disposer=t.dispose;break;case"gpu-buffer":if("float32"!==a&&"float16"!==a&&"int32"!==a&&"int64"!==a&&"uint32"!==a&&"uint8"!==a&&"bool"!==a&&"uint4"!==a&&"int4"!==a)throw TypeError(`unsupported type "${a}" to create tensor from gpu buffer`);this.gpuBufferData=t.gpuBuffer,this.downloader=t.download,this.disposer=t.dispose;break;case"ml-tensor":if("float32"!==a&&"float16"!==a&&"int32"!==a&&"int64"!==a&&"uint32"!==a&&"uint64"!==a&&"int8"!==a&&"uint8"!==a&&"bool"!==a&&"uint4"!==a&&"int4"!==a)throw TypeError(`unsupported type "${a}" to create tensor from MLTensor`);this.mlTensorData=t.mlTensor,this.downloader=t.download,this.disposer=t.dispose;break;default:throw Error(`Tensor constructor: unsupported location '${this.dataLocation}'`)}else{let s,o;if("string"==typeof t)if(a=t,o=r,"string"===t){if(!Array.isArray(i))throw TypeError("A string tensor's data must be a string array.");s=i}else{let r=x.get(t);if(void 0===r)throw TypeError(`Unsupported tensor type: ${t}.`);if(Array.isArray(i)){if("float16"===t&&r===Uint16Array||"uint4"===t||"int4"===t)throw TypeError(`Creating a ${t} tensor from number array is not supported. Please use ${r.name} as data.`);s="uint64"===t||"int64"===t?r.from(i,BigInt):r.from(i)}else if(i instanceof r)s=i;else if(i instanceof Uint8ClampedArray)if("uint8"===t)s=Uint8Array.from(i);else throw TypeError("A Uint8ClampedArray tensor's data must be type of uint8");else if("float16"===t&&i instanceof Uint16Array&&r!==Uint16Array)s=new globalThis.Float16Array(i.buffer,i.byteOffset,i.length);else throw TypeError(`A ${a} tensor's data must be type of ${r}`)}else if(o=i,Array.isArray(t)){if(0===t.length)throw TypeError("Tensor type cannot be inferred from an empty array.");let i=typeof t[0];if("string"===i)a="string",s=t;else if("boolean"===i)a="bool",s=Uint8Array.from(t);else throw TypeError(`Invalid element type of data array: ${i}.`)}else if(t instanceof Uint8ClampedArray)a="uint8",s=Uint8Array.from(t);else{let i=C.get(t.constructor);if(void 0===i)throw TypeError(`Unsupported type for tensor data: ${t.constructor}.`);a=i,s=t}if(void 0===o)o=[s.length];else if(!Array.isArray(o))throw TypeError("A tensor's dims must be a number array");n=o,this.cpuData=s,this.dataLocation="cpu"}let s=T(n);if(this.cpuData&&s!==this.cpuData.length&&("uint4"!==a&&"int4"!==a||Math.ceil(s/2)!==this.cpuData.length))throw Error(`Tensor's size(${s}) does not match data length(${this.cpuData.length}).`);this.type=a,this.dims=n,this.size=s}static async fromImage(t,i){return _(t,i)}static fromTexture(t,i){return b(t,i)}static fromGpuBuffer(t,i){return $(t,i)}static fromMLTensor(t,i){return v(t,i)}static fromPinnedBuffer(t,i,r){return w(t,i,r)}toDataURL(t){return m(this,t)}toImageData(t){return g(this,t)}get data(){if(this.ensureValid(),!this.cpuData)throw Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw Error("The data is not stored as a WebGL texture.");return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw Error("The data is not stored as a WebGPU buffer.");return this.gpuBufferData}get mlTensor(){if(this.ensureValid(),!this.mlTensorData)throw Error("The data is not stored as a WebNN MLTensor.");return this.mlTensorData}async getData(t){switch(this.ensureValid(),this.dataLocation){case"cpu":case"cpu-pinned":return this.data;case"texture":case"gpu-buffer":case"ml-tensor":if(!this.downloader)throw Error("The current tensor is not created with a specified data downloader.");if(this.isDownloading)throw Error("The current tensor is being downloaded.");try{this.isDownloading=!0;let i=await this.downloader();return this.downloader=void 0,this.dataLocation="cpu",this.cpuData=i,t&&this.disposer&&(this.disposer(),this.disposer=void 0),i}finally{this.isDownloading=!1}default:throw Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.isDownloading)throw Error("The current tensor is being downloaded.");this.disposer&&(this.disposer(),this.disposer=void 0),this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.mlTensorData=void 0,this.downloader=void 0,this.isDownloading=void 0,this.dataLocation="none"}ensureValid(){if("none"===this.dataLocation)throw Error("The tensor is disposed.")}reshape(t){if(this.ensureValid(),this.downloader||this.disposer)throw Error("Cannot reshape a tensor that owns GPU resource.");return I(this,t)}}}),J=q(()=>{"use strict";Y(),z=E}),ee=q(()=>{"use strict";H(),A=(t,i)=>{(typeof h.trace>"u"?h.wasm.trace:h.trace)&&console.timeStamp(`${t}::ORT::${i}`)},O=(t,i)=>{let r=Error().stack?.split(/\r\n|\r|\n/g)||[],a=!1;for(let n=0;n<r.length;n++){if(a&&!r[n].includes("TRACE_FUNC")){let a=`FUNC_${t}::${r[n].trim().split(" ")[1]}`;i&&(a+=`::${i}`),A("CPU",a);return}r[n].includes("TRACE_FUNC")&&(a=!0)}},R=t=>{(typeof h.trace>"u"?h.wasm.trace:h.trace)&&O("BEGIN",t)},B=t=>{(typeof h.trace>"u"?h.wasm.trace:h.trace)&&O("END",t)},N=t=>{(typeof h.trace>"u"?h.wasm.trace:h.trace)&&console.time(`ORT::${t}`)},M=t=>{(typeof h.trace>"u"?h.wasm.trace:h.trace)&&console.timeEnd(`ORT::${t}`)}}),et=q(()=>{"use strict";V(),J(),ee(),D=class t{constructor(t){this.handler=t}async run(t,i,r){R(),N("InferenceSession.run");let a={},n={};if("object"!=typeof t||null===t||t instanceof z||Array.isArray(t))throw TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");let s=!0;if("object"==typeof i){if(null===i)throw TypeError("Unexpected argument[1]: cannot be null.");if(i instanceof z)throw TypeError("'fetches' cannot be a Tensor");if(Array.isArray(i)){if(0===i.length)throw TypeError("'fetches' cannot be an empty array.");for(let t of(s=!1,i)){if("string"!=typeof t)throw TypeError("'fetches' must be a string array or an object.");if(-1===this.outputNames.indexOf(t))throw RangeError(`'fetches' contains invalid output name: ${t}.`);a[t]=null}if("object"==typeof r&&null!==r)n=r;else if("u">typeof r)throw TypeError("'options' must be an object.")}else{let t=!1,o=Object.getOwnPropertyNames(i);for(let r of this.outputNames)if(-1!==o.indexOf(r)){let n=i[r];(null===n||n instanceof z)&&(t=!0,s=!1,a[r]=n)}if(t){if("object"==typeof r&&null!==r)n=r;else if("u">typeof r)throw TypeError("'options' must be an object.")}else n=i}}else if("u">typeof i)throw TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");for(let i of this.inputNames)if(typeof t[i]>"u")throw Error(`input '${i}' is missing in 'feeds'.`);if(s)for(let t of this.outputNames)a[t]=null;let o=await this.handler.run(t,a,n),u={};for(let t in o)if(Object.hasOwnProperty.call(o,t)){let i=o[t];i instanceof z?u[t]=i:u[t]=new z(i.type,i.data,i.dims)}return M("InferenceSession.run"),B(),u}async release(){return this.handler.dispose()}static async create(i,r,a,n){R(),N("InferenceSession.create");let s,o={};if("string"==typeof i){if(s=i,"object"==typeof r&&null!==r)o=r;else if("u">typeof r)throw TypeError("'options' must be an object.")}else if(i instanceof Uint8Array){if(s=i,"object"==typeof r&&null!==r)o=r;else if("u">typeof r)throw TypeError("'options' must be an object.")}else if(i instanceof ArrayBuffer||"u">typeof SharedArrayBuffer&&i instanceof SharedArrayBuffer){let t=0,u=i.byteLength;if("object"==typeof r&&null!==r)o=r;else if("number"==typeof r){if(!Number.isSafeInteger(t=r))throw RangeError("'byteOffset' must be an integer.");if(t<0||t>=i.byteLength)throw RangeError(`'byteOffset' is out of range [0, ${i.byteLength}).`);if(u=i.byteLength-t,"number"==typeof a){if(!Number.isSafeInteger(u=a))throw RangeError("'byteLength' must be an integer.");if(u<=0||t+u>i.byteLength)throw RangeError(`'byteLength' is out of range (0, ${i.byteLength-t}].`);if("object"==typeof n&&null!==n)o=n;else if("u">typeof n)throw TypeError("'options' must be an object.")}else if("u">typeof a)throw TypeError("'byteLength' must be a number.")}else if("u">typeof r)throw TypeError("'options' must be an object.");s=new Uint8Array(i,t,u)}else throw TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let[u,l]=await d(o),p=await u.createInferenceSessionHandler(s,l);return M("InferenceSession.create"),B(),new t(p)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}get inputMetadata(){return this.handler.inputMetadata}get outputMetadata(){return this.handler.outputMetadata}}}),ei=q(()=>{"use strict";et(),P=D}),er=q(()=>{}),ea=q(()=>{}),en=q(()=>{}),es=q(()=>{}),eo={};W(eo,{InferenceSession:()=>P,TRACE:()=>A,TRACE_EVENT_BEGIN:()=>N,TRACE_EVENT_END:()=>M,TRACE_FUNC_BEGIN:()=>R,TRACE_FUNC_END:()=>B,Tensor:()=>z,env:()=>f,registerBackend:()=>u});var eu=q(()=>{"use strict";G(),F(),ei(),J(),er(),ea(),ee(),en(),es()}),el=q(()=>{}),ed={};W(ed,{default:()=>ec});var ep,ec,eh=q(()=>{"use strict";s1(),nd(),nl(),(ep=globalThis.self?.name==="ort-wasm-proxy-worker")&&(self.onmessage=t=>{let{type:i,in:r}=t.data;try{switch(i){case"init-wasm":eO(r.wasm).then(()=>{sx(r).then(()=>{postMessage({type:i})},t=>{postMessage({type:i,err:t})})},t=>{postMessage({type:i,err:t})});break;case"init-ep":{let{epName:t,env:a}=r;sC(a,t).then(()=>{postMessage({type:i})},t=>{postMessage({type:i,err:t})});break}case"copy-from":{let{buffer:t}=r,a=sT(t);postMessage({type:i,out:a});break}case"create":{let{model:t,options:a}=r;sI(t,a).then(t=>{postMessage({type:i,out:t})},t=>{postMessage({type:i,err:t})});break}case"release":sE(r),postMessage({type:i});break;case"run":{let{sessionId:t,inputIndices:a,inputs:n,outputIndices:s,options:o}=r;sA(t,a,n,s,Array(s.length).fill(null),o).then(t=>{t.some(t=>"cpu"!==t[3])?postMessage({type:i,err:"Proxy does not support non-cpu tensor location."}):postMessage({type:i,out:t},sR([...n,...t]))},t=>{postMessage({type:i,err:t})});break}case"end-profiling":sO(r),postMessage({type:i})}}catch(t){postMessage({type:i,err:t})}}),ec=ep?null:t=>new Worker(t??eb,{type:"module",name:"ort-wasm-proxy-worker"})}),ef={};W(ef,{default:()=>eg});var em,eg,ey,e_,eb,e$,ev,ew,ex,eC,ek,eS,eT,eI,eE,ez,eA,eO,eR,eB,eN,eM,eD,eP,eU,eq,eW,eL,eV,eG,ej,eH,eF,eK,eZ,eQ,eX,eY,eJ,e0,e2,e1,e3,e4,e6,e8,e5,e9,e7,te,tt,ti,tr,ta,tn,ts,to,tu,tl,td,tp,tc,th,tf,tm,tg,ty,t_,tb,t$,tv,tw,tx,tC,tk,tS,tT,tI,tE,tz,tA,tO,tR,tB,tN,tM,tD,tP,tU,tq,tW,tL,tV,tG,tj,tH,tF,tK,tZ,tQ,tX,tY,tJ,t0,t2,t1,t3,t4,t6,t8,t5,t9,t7,ie,it,ii,ir,ia,is,io,iu,il,id,ip,ic,ih,im,ig,iy,i_,ib,i$,iv,iw,ix,iC,ik,iS,iT,iI,iE,iz,iA,iO,iR,iB,iN,iM,iD,iP,iU,iq,iW,iL,iV,iG,ij,iH,iF,iK,iZ,iQ,iX,iY,iJ,i0,i2,i1,i3,i4,i6,i8,i5,i9,i7,re,rt,ri,rr,ra,rn,rs,ro,ru,rl,rd,rp,rc,rh,rf,rm,rg,ry,r_,rb,r$,rv,rw,rx,rC,rk,rS,rT,rI,rE,rz,rA,rO,rR,rB,rN,rM,rD,rP,rU,rq,rW,rL,rV,rG,rj,rH,rF,rK,rZ,rQ,rX,rY,rJ,r0,r2,r1,r3,r4,r6,r8,r5,r9,r7,ae,at,ai,ar,aa,an,as,ao,au,al,ad,ap,ac,ah,af,am,ag,ay,a_,ab,a$,av,aw,ax,aC,ak,aS,aT,aI,aE,az,aA,aO,aR,aB,aN,aM,aD,aP,aU,aq,aW,aL,aV,aG,aj,aH,aF,aK,aZ,aQ,aX,aY,aJ,a0,a2,a1,a3,a4,a6,a8,a5,a9,a7,ne,nt,ni,nr,na,nn,ns,no,nu=q(()=>{"use strict";eg=em=async function(t={}){var i,r,a=new Promise((t,a)=>{i=t,r=a}),n="object"==typeof window,s="u">typeof WorkerGlobalScope,o=s&&self.name?.startsWith("em-pthread");t.mountExternalData=(i,r)=>{i.startsWith("./")&&(i=i.substring(2)),(t.Fb||(t.Fb=new Map)).set(i,r)},t.unmountExternalData=()=>{delete t.Fb};var u=globalThis.SharedArrayBuffer??new WebAssembly.Memory({initial:0,maximum:0,qc:!0}).buffer.constructor;let l=i=>async(...r)=>{try{if(t.Gb)throw Error("Session already started");let a=t.Gb={ec:r[0],errors:[]},n=await i(...r);if(t.Gb!==a)throw Error("Session mismatch");t.Kb?.flush();let s=a.errors;if(0<s.length){let t=await Promise.all(s);if(t=t.filter(t=>t),0<t.length)throw Error(t.join(`
`))}return n}finally{t.Gb=null}};t.jsepInit=(i,r)=>{if("webgpu"===i){[t.Kb,t.Vb,t.Zb,t.Lb,t.Yb,t.Ab,t.$b,t.bc,t.Wb,t.Xb,t.ac]=r;let i=t.Kb;t.jsepRegisterBuffer=(t,r,a,n)=>i.registerBuffer(t,r,a,n),t.jsepGetBuffer=t=>i.getBuffer(t),t.jsepCreateDownloader=(t,r,a)=>i.createDownloader(t,r,a),t.jsepOnCreateSession=t=>{i.onCreateSession(t)},t.jsepOnReleaseSession=t=>{i.onReleaseSession(t)},t.jsepOnRunStart=t=>i.onRunStart(t),t.cc=(t,r)=>{i.upload(t,r)}}else if("webnn"===i){let i=r[0];[t.oc,t.Ob,t.webnnEnsureTensor,t.Pb,t.webnnDownloadTensor,t.nc,t.webnnEnableTraceEvent]=r.slice(1),t.webnnReleaseTensorId=t.Ob,t.webnnUploadTensor=t.Pb,t.webnnRegisterMLContext=t.nc,t.webnnOnRunStart=t=>i.onRunStart(t),t.webnnOnRunEnd=i.onRunEnd.bind(i),t.webnnOnReleaseSession=t=>{i.onReleaseSession(t)},t.webnnCreateMLTensorDownloader=(t,r)=>i.createMLTensorDownloader(t,r),t.webnnRegisterMLTensor=(t,r,a,n)=>i.registerMLTensor(t,r,a,n),t.webnnCreateMLContext=t=>i.createMLContext(t),t.webnnRegisterMLConstant=(r,a,n,s,o,u)=>i.registerMLConstant(r,a,n,s,o,t.Fb,u),t.webnnRegisterGraphInput=i.registerGraphInput.bind(i),t.webnnIsGraphInput=i.isGraphInput.bind(i),t.webnnRegisterGraphOutput=i.registerGraphOutput.bind(i),t.webnnIsGraphOutput=i.isGraphOutput.bind(i),t.webnnCreateTemporaryTensor=i.createTemporaryTensor.bind(i),t.webnnIsGraphInputOutputTypeSupported=i.isGraphInputOutputTypeSupported.bind(i)}};let d=()=>{let i=(t,i,r)=>(...a)=>{let n=tS,s=i?.();a=t(...a);let o=i?.();return s!==o&&(t=o,r(s),i=r=null),tS!=n?new Promise((t,i)=>{tO={resolve:t,reject:i}}):a};(()=>{for(let r of["_OrtAppendExecutionProvider","_OrtCreateSession","_OrtRun","_OrtRunWithBinding","_OrtBindInput"])t[r]=i(t[r],()=>t[r],i=>t[r]=i)})(),void 0!==l&&(t._OrtRun=l(t._OrtRun),t._OrtRunWithBinding=l(t._OrtRunWithBinding)),d=void 0};t.asyncInit=()=>{d?.()};var p,c,h=(t,i)=>{throw i},f=import.meta.url,m="";if(n||s){try{m=new URL(".",f).href}catch{}s&&(c=t=>{var i=new XMLHttpRequest;return i.open("GET",t,!1),i.responseType="arraybuffer",i.send(null),new Uint8Array(i.response)}),p=async t=>{if(M(t))return new Promise((i,r)=>{var a=new XMLHttpRequest;a.open("GET",t,!0),a.responseType="arraybuffer",a.onload=()=>{200==a.status||0==a.status&&a.response?i(a.response):r(a.status)},a.onerror=r,a.send(null)});var i=await fetch(t,{credentials:"same-origin"});if(i.ok)return i.arrayBuffer();throw Error(i.status+" : "+i.url)}}var g,y,_,b,$,v,w,x,C,k,S,T,I,E,z,A=console.log.bind(console),O=console.error.bind(console),R=A,B=O,N=!1,M=t=>t.startsWith("file://");function D(){return y.buffer!=$.buffer&&H(),$}function P(){return y.buffer!=$.buffer&&H(),v}function U(){return y.buffer!=$.buffer&&H(),w}function q(){return y.buffer!=$.buffer&&H(),x}function W(){return y.buffer!=$.buffer&&H(),C}function L(){return y.buffer!=$.buffer&&H(),k}function V(){return y.buffer!=$.buffer&&H(),S}function G(){return y.buffer!=$.buffer&&H(),E}if(o){let i=function(r){try{var a=r.data,n=a.Db;if("load"===n){let r=[];for(let n of(self.onmessage=t=>r.push(t),self.startWorker=()=>{for(let t of(postMessage({Db:"loaded"}),r))i(t);self.onmessage=i},a.Sb))t[n]&&!t[n].proxy||(t[n]=(...t)=>{postMessage({Db:"callHandler",Rb:n,args:t})},"print"==n&&(R=t[n]),"printErr"==n&&(B=t[n]));y=a.kc,H(),z(a.lc)}else if("run"===n){ey(a.Bb),ij(a.Bb,0,0,1,0,0),ef(),tc(a.Bb),j||(iW(),j=!0);try{e_(a.hc,a.Jb)}catch(t){if("unwind"!=t)throw t}}else"setimmediate"!==a.target&&("checkMailbox"===n?j&&th():n&&(B(`worker: received unknown command ${n}`),B(a)))}catch(t){throw iH(),t}};var j=!1;self.onunhandledrejection=t=>{throw t.reason||t},self.onmessage=i}function H(){var i=y.buffer;t.HEAP8=$=new Int8Array(i),w=new Int16Array(i),t.HEAPU8=v=new Uint8Array(i),x=new Uint16Array(i),t.HEAP32=C=new Int32Array(i),t.HEAPU32=k=new Uint32Array(i),S=new Float32Array(i),E=new Float64Array(i),T=new BigInt64Array(i),I=new BigUint64Array(i)}function F(){o?startWorker(t):iU.Da()}var K,Z=0,Q=null;function X(){if(0==--Z&&Q){var t=Q;Q=null,t()}}function Y(t){throw B(t="Aborted("+t+")"),N=!0,t=new WebAssembly.RuntimeError(t+". Build with -sASSERTIONS for more info."),r(t),t}function J(){return{a:{L:iP,Aa:iD,b:e$,$:ew,A:eS,pa:eT,X:eI,Z:eE,qa:ez,na:eA,ga:eO,ma:eR,J:eB,Y:eN,V:eM,oa:eD,W:eP,va:eq,E:eK,Q:eQ,O:e4,D:e6,v:e8,s:e5,P:te,z:tu,R:tl,ja:td,T:tf,aa:tg,M:ty,F:t_,ia:tc,sa:tb,r:tw,Ca:tx,w:tN,o:tD,m:tq,c:eJ,Ba:tW,n:tV,j:tG,u:tj,p:tH,f:tF,t:tK,l:tZ,e:tQ,k:tX,h:tY,g:tJ,d:t0,da:t2,ea:t6,fa:t8,ba:t5,ca:t9,N:it,xa:ii,ua:ia,i:iu,C:il,G:id,ta:ir,x:ip,ra:ic,U:ih,q:ie,y:im,K:ig,S:iy,za:iv,ya:iw,ka:iS,la:iT,_:eu,B:iI,I:iE,ha:iz,H:iO,a:y,wa:es}}}class ee{name="ExitStatus";constructor(t){this.message=`Program terminated with exit(${t})`,this.status=t}}var et=t=>{t.terminate(),t.onmessage=()=>{}},ei=[],er=t=>{0==el.length&&(eg(),em(el[0]));var i=el.pop();if(!i)return 6;ed.push(i),ec[t.Bb]=i,i.Bb=t.Bb;var r={Db:"run",hc:t.fc,Jb:t.Jb,Bb:t.Bb};return i.postMessage(r,t.Nb),0},ea=0,en=(t,i,...r)=>{for(var a=2*r.length,n=i2(),s=i0(8*a),o=s>>>3,u=0;u<r.length;u++){var l=r[u];"bigint"==typeof l?(T[o+2*u]=1n,T[o+2*u+1]=l):(T[o+2*u]=0n,G()[o+2*u+1>>>0]=l)}return t=iF(t,0,a,s,i),iJ(n),t};function es(t){if(o)return en(0,1,t);if(b=t,!(0<ea)){for(var i of ed)et(i);for(i of el)et(i);el=[],ed=[],ec={},N=!0}h(0,new ee(t))}function eo(t){if(o)return en(1,0,t);eu(t)}var eu=t=>{if(b=t,o)throw eo(t),"unwind";es(t)},el=[],ed=[],ep=[],ec={},eh=t=>{var i=t.Bb;delete ec[i],el.push(t),ed.splice(ed.indexOf(t),1),t.Bb=0,iK(i)};function ef(){ep.forEach(t=>t())}var em=i=>new Promise(r=>{i.onmessage=a=>{var n=(a=a.data).Db;if(a.Hb&&a.Hb!=iL()){var s=ec[a.Hb];s?s.postMessage(a,a.Nb):B(`Internal error! Worker sent a message "${n}" to target pthread ${a.Hb}, but that thread no longer exists!`)}else"checkMailbox"===n?th():"spawnThread"===n?er(a):"cleanupThread"===n?eh(ec[a.ic]):"loaded"===n?(i.loaded=!0,r(i)):"setimmediate"===a.target?i.postMessage(a):"callHandler"===n?t[a.Rb](...a.args):n&&B(`worker sent an unknown command ${n}`)},i.onerror=t=>{throw B(`worker sent an error! ${t.filename}:${t.lineno}: ${t.message}`),t};var a,n=[];for(a of[])t.propertyIsEnumerable(a)&&n.push(a);i.postMessage({Db:"load",Sb:n,kc:y,lc:_})});function eg(){let t;var i=new Worker((t=URL,import.meta.url>"file:"&&import.meta.url<"file;"?new t("ort.bundle.min.mjs",import.meta.url):new URL(import.meta.url)),{type:"module",workerData:"em-pthread",name:"em-pthread"});el.push(i)}var ey=t=>{H();var i=L()[t+52>>>2>>>0];t=L()[t+56>>>2>>>0],iY(i,i-t),iJ(i)},e_=(t,i)=>{ea=0,t=i1(t,i),0<ea?b=t:iZ(t)};class eb{constructor(t){this.Ib=t-24}}function e$(t,i,r){var a=new eb(t>>>=0);throw i>>>=0,r>>>=0,L()[a.Ib+16>>>2>>>0]=0,L()[a.Ib+4>>>2>>>0]=i,L()[a.Ib+8>>>2>>>0]=r,t}function ev(t,i,r,a){return o?en(2,1,t,i,r,a):ew(t,i,r,a)}function ew(t,i,r,a){if(t>>>=0,r>>>=0,a>>>=0,void 0===u)return 6;var n=[];return o&&0===n.length?ev(t,i>>>=0,r,a):(t={fc:r,Bb:t,Jb:a,Nb:n},o?(t.Db="spawnThread",postMessage(t,n),0):er(t))}var ex="u">typeof TextDecoder?new TextDecoder:void 0,eC=(t,i=0,r=NaN)=>{var a=(i>>>=0)+r;for(r=i;t[r]&&!(r>=a);)++r;if(16<r-i&&t.buffer&&ex)return ex.decode(t.buffer instanceof ArrayBuffer?t.subarray(i,r):t.slice(i,r));for(a="";i<r;){var n=t[i++];if(128&n){var s=63&t[i++];if((224&n)==192)a+=String.fromCharCode((31&n)<<6|s);else{var o=63&t[i++];65536>(n=(240&n)==224?(15&n)<<12|s<<6|o:(7&n)<<18|s<<12|o<<6|63&t[i++])?a+=String.fromCharCode(n):(n-=65536,a+=String.fromCharCode(55296|n>>10,56320|1023&n))}}else a+=String.fromCharCode(n)}return a},ek=(t,i)=>(t>>>=0)?eC(P(),t,i):"";function eS(t,i,r){return o?en(3,1,t,i,r):0}function eT(t,i){if(o)return en(4,1,t,i)}function eI(t,i){if(o)return en(5,1,t,i)}function eE(t,i,r){if(o)return en(6,1,t,i,r)}function ez(t,i,r){return o?en(7,1,t,i,r):0}function eA(t,i){if(o)return en(8,1,t,i)}function eO(t,i,r){if(o)return en(9,1,t,i,r)}function eR(t,i,r,a){if(o)return en(10,1,t,i,r,a)}function eB(t,i,r,a){if(o)return en(11,1,t,i,r,a)}function eN(t,i,r,a){if(o)return en(12,1,t,i,r,a)}function eM(t){if(o)return en(13,1,t)}function eD(t,i){if(o)return en(14,1,t,i)}function eP(t,i,r){if(o)return en(15,1,t,i,r)}var eU,eq=()=>Y(""),eW=t=>{for(var i="";P()[t>>>0];)i+=eU[P()[t++>>>0]];return i},eL={},eV={},eG={},ej=t.BindingError=class extends Error{constructor(t){super(t),this.name="BindingError"}};function eH(t,i,r={}){return function(t,i,r={}){var a=i.name;if(!t)throw new ej(`type "${a}" must have a positive integer typeid pointer`);if(eV.hasOwnProperty(t)){if(r.Tb)return;throw new ej(`Cannot register type '${a}' twice`)}eV[t]=i,delete eG[t],eL.hasOwnProperty(t)&&(i=eL[t],delete eL[t],i.forEach(t=>t()))}(t,i,r)}var eF=(t,i,r)=>{switch(i){case 1:return r?t=>D()[t>>>0]:t=>P()[t>>>0];case 2:return r?t=>U()[t>>>1>>>0]:t=>q()[t>>>1>>>0];case 4:return r?t=>W()[t>>>2>>>0]:t=>L()[t>>>2>>>0];case 8:return r?t=>T[t>>>3]:t=>I[t>>>3];default:throw TypeError(`invalid integer width (${i}): ${t}`)}};function eK(t,i,r){r>>>=0,eH(t>>>=0,{name:i=eW(i>>>0),fromWireType:t=>t,toWireType:function(t,i){if("bigint"!=typeof i&&"number"!=typeof i)throw i=null===i?"null":"object"==(t=typeof i)||"array"===t||"function"===t?i.toString():""+i,TypeError(`Cannot convert "${i}" to ${this.name}`);return"number"==typeof i&&(i=BigInt(i)),i},Cb:eZ,readValueFromPointer:eF(i,r,-1==i.indexOf("u")),Eb:null})}var eZ=8;function eQ(t,i,r,a){eH(t>>>=0,{name:i=eW(i>>>0),fromWireType:function(t){return!!t},toWireType:function(t,i){return i?r:a},Cb:eZ,readValueFromPointer:function(t){return this.fromWireType(P()[t>>>0])},Eb:null})}var eX=[],eY=[];function eJ(t){9<(t>>>=0)&&0==--eY[t+1]&&(eY[t]=void 0,eX.push(t))}var e0=t=>{if(!t)throw new ej(`Cannot use deleted val. handle = ${t}`);return eY[t]},e2=t=>{switch(t){case void 0:return 2;case null:return 4;case!0:return 6;case!1:return 8;default:let i=eX.pop()||eY.length;return eY[i]=t,eY[i+1]=1,i}};function e1(t){return this.fromWireType(L()[t>>>2>>>0])}var e3={name:"emscripten::val",fromWireType:t=>{var i=e0(t);return eJ(t),i},toWireType:(t,i)=>e2(i),Cb:8,readValueFromPointer:e1,Eb:null};function e4(t){return eH(t>>>0,e3)}function e6(t,i,r){r>>>=0,eH(t>>>=0,{name:i=eW(i>>>0),fromWireType:t=>t,toWireType:(t,i)=>i,Cb:eZ,readValueFromPointer:((t,i)=>{switch(i){case 4:return function(t){return this.fromWireType(V()[t>>>2>>>0])};case 8:return function(t){return this.fromWireType(G()[t>>>3>>>0])};default:throw TypeError(`invalid float width (${i}): ${t}`)}})(i,r),Eb:null})}function e8(t,i,r,a,n){if(t>>>=0,r>>>=0,i=eW(i>>>0),-1===n&&(n=0xffffffff),n=t=>t,0===a){var s=32-8*r;n=t=>t<<s>>>s}var o=i.includes("unsigned")?function(t,i){return i>>>0}:function(t,i){return i};eH(t,{name:i,fromWireType:n,toWireType:o,Cb:eZ,readValueFromPointer:eF(i,r,0!==a),Eb:null})}function e5(t,i,r){function a(t){var i=L()[t>>>2>>>0];return t=L()[t+4>>>2>>>0],new n(D().buffer,t,i)}var n=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,BigInt64Array,BigUint64Array][i];eH(t>>>=0,{name:r=eW(r>>>0),fromWireType:a,Cb:eZ,readValueFromPointer:a},{Tb:!0})}var e9=(t,i,r)=>{var a=P();if(i>>>=0,0<r){var n=i;r=i+r-1;for(var s=0;s<t.length;++s){var o=t.charCodeAt(s);if(55296<=o&&57343>=o&&(o=65536+((1023&o)<<10)|1023&t.charCodeAt(++s)),127>=o){if(i>=r)break;a[i++>>>0]=o}else{if(2047>=o){if(i+1>=r)break;a[i++>>>0]=192|o>>6}else{if(65535>=o){if(i+2>=r)break;a[i++>>>0]=224|o>>12}else{if(i+3>=r)break;a[i++>>>0]=240|o>>18,a[i++>>>0]=128|o>>12&63}a[i++>>>0]=128|o>>6&63}a[i++>>>0]=128|63&o}}a[i>>>0]=0,t=i-n}else t=0;return t},e7=t=>{for(var i=0,r=0;r<t.length;++r){var a=t.charCodeAt(r);127>=a?i++:2047>=a?i+=2:55296<=a&&57343>=a?(i+=4,++r):i+=3}return i};function te(t,i){eH(t>>>=0,{name:i=eW(i>>>0),fromWireType:function(t){for(var i,r=L()[t>>>2>>>0],a=t+4,n=a,s=0;s<=r;++s){var o=a+s;s!=r&&0!=P()[o>>>0]||(n=ek(n,o-n),void 0===i?i=n:(i+="\0",i+=n),n=o+1)}return iV(t),i},toWireType:function(t,i){i instanceof ArrayBuffer&&(i=new Uint8Array(i));var r="string"==typeof i;if(!(r||ArrayBuffer.isView(i)&&1==i.BYTES_PER_ELEMENT))throw new ej("Cannot pass non-string to std::string");var a=r?e7(i):i.length,n=iG(4+a+1),s=n+4;return L()[n>>>2>>>0]=a,r?e9(i,s,a+1):P().set(i,s>>>0),null!==t&&t.push(iV,n),n},Cb:eZ,readValueFromPointer:e1,Eb(t){iV(t)}})}var tt="u">typeof TextDecoder?new TextDecoder("utf-16le"):void 0,ti=(t,i)=>{for(var r=t>>1,a=r+i/2;!(r>=a)&&q()[r>>>0];)++r;if(32<(r<<=1)-t&&tt)return tt.decode(P().slice(t,r));for(r="",a=0;!(a>=i/2);++a){var n=U()[t+2*a>>>1>>>0];if(0==n)break;r+=String.fromCharCode(n)}return r},tr=(t,i,r)=>{if(2>(r??=0x7fffffff))return 0;var a=i;r=(r-=2)<2*t.length?r/2:t.length;for(var n=0;n<r;++n){var s=t.charCodeAt(n);U()[i>>>1>>>0]=s,i+=2}return U()[i>>>1>>>0]=0,i-a},ta=t=>2*t.length,tn=(t,i)=>{for(var r=0,a="";!(r>=i/4);){var n=W()[t+4*r>>>2>>>0];if(0==n)break;++r,65536<=n?(n-=65536,a+=String.fromCharCode(55296|n>>10,56320|1023&n)):a+=String.fromCharCode(n)}return a},ts=(t,i,r)=>{if(i>>>=0,4>(r??=0x7fffffff))return 0;var a=i;r=a+r-4;for(var n=0;n<t.length;++n){var s=t.charCodeAt(n);if(55296<=s&&57343>=s&&(s=65536+((1023&s)<<10)|1023&t.charCodeAt(++n)),W()[i>>>2>>>0]=s,(i+=4)+4>r)break}return W()[i>>>2>>>0]=0,i-a},to=t=>{for(var i=0,r=0;r<t.length;++r){var a=t.charCodeAt(r);55296<=a&&57343>=a&&++r,i+=4}return i};function tu(t,i,r){if(t>>>=0,i>>>=0,r=eW(r>>>=0),2===i)var a=ti,n=tr,s=ta,o=t=>q()[t>>>1>>>0];else 4===i&&(a=tn,n=ts,s=to,o=t=>L()[t>>>2>>>0]);eH(t,{name:r,fromWireType:t=>{for(var r,n=L()[t>>>2>>>0],s=t+4,u=0;u<=n;++u){var l=t+4+u*i;u!=n&&0!=o(l)||(s=a(s,l-s),void 0===r?r=s:(r+="\0",r+=s),s=l+i)}return iV(t),r},toWireType:(t,a)=>{if("string"!=typeof a)throw new ej(`Cannot pass non-string to C++ string type ${r}`);var o=s(a),u=iG(4+o+i);return L()[u>>>2>>>0]=o/i,n(a,u+4,o+i),null!==t&&t.push(iV,u),u},Cb:eZ,readValueFromPointer:e1,Eb(t){iV(t)}})}function tl(t,i){eH(t>>>=0,{Ub:!0,name:i=eW(i>>>0),Cb:0,fromWireType:()=>{},toWireType:()=>{}})}function td(t){ij(t>>>0,!s,1,!n,131072,!1),ef()}var tp=t=>{if(!N)try{if(t(),!(0<ea))try{o?iZ(b):eu(b)}catch(t){t instanceof ee||"unwind"==t||h(0,t)}}catch(t){t instanceof ee||"unwind"==t||h(0,t)}};function tc(t){t>>>=0,"function"==typeof Atomics.jc&&(Atomics.jc(W(),t>>>2,t).value.then(th),t+=128,Atomics.store(W(),t>>>2,1))}var th=()=>{var t=iL();t&&(tc(t),tp(iX))};function tf(t,i){(t>>>=0)==i>>>0?setTimeout(th):o?postMessage({Hb:t,Db:"checkMailbox"}):(t=ec[t])&&t.postMessage({Db:"checkMailbox"})}var tm=[];function tg(t,i,r,a,n){for(i>>>=0,tm.length=a/=2,r=n>>>0>>>3,n=0;n<a;n++)tm[n]=T[r+2*n]?T[r+2*n+1]:G()[r+2*n+1>>>0];return(i?iM[i]:iN[t])(...tm)}var ty=()=>{ea=0};function t_(t){t>>>=0,o?postMessage({Db:"cleanupThread",ic:t}):eh(ec[t])}function tb(t){}var t$=(t,i)=>{var r=eV[t];if(void 0===r)throw r=eW(t=iq(t)),iV(t),new ej(`${i} has unknown type ${r}`);return r},tv=(t,i,r)=>{var a=[];return t=t.toWireType(a,r),a.length&&(L()[i>>>2>>>0]=e2(a)),t};function tw(t,i,r){return i>>>=0,r>>>=0,t=e0(t>>>0),tv(i=t$(i,"emval::as"),r,t)}function tx(t,i){return i>>>=0,t=e0(t>>>0),(i=t$(i,"emval::as")).toWireType(null,t)}var tC=t=>{try{t()}catch(t){Y(t)}},tk=0,tS=null,tT=0,tI=[],tE={},tz={},tA=0,tO=null,tR=[];function tB(t){return function(t){if(!N){if(0===tk){var i,r,a,n=!1,s=!1;t((t=0)=>{if(!N&&(tT=t,n=!0,s)){tk=2,tC(()=>i6(tS)),"u">typeof MainLoop&&MainLoop.Qb&&MainLoop.resume(),t=!1;try{var i,r=(i=iU[tz[i=W()[tS+8>>>2>>>0]]],--ea,i())}catch(i){r=i,t=!0}var a=!1;if(!tS){var o=tO;o&&(tO=null,(t?o.reject:o.resolve)(r),a=!0)}if(t&&!a)throw r}}),s=!0,n||(tk=1,r=(i=iG(65548))+12,L()[i>>>2>>>0]=r,L()[i+4>>>2>>>0]=r+65536,void 0===(a=tE[r=tI[0]])&&(a=tA++,tE[r]=a,tz[a]=r),r=a,W()[i+8>>>2>>>0]=r,tS=i,"u">typeof MainLoop&&MainLoop.Qb&&MainLoop.pause(),tC(()=>i3(tS)))}else 2===tk?(tk=0,tC(i8),iV(tS),tS=null,tR.forEach(tp)):Y(`invalid state: ${tk}`);return tT}}(i=>{t().then(i)})}function tN(t){return t>>>=0,tB(async()=>e2(await e0(t)))}var tM=[];function tD(t,i,r,a){return r>>>=0,a>>>=0,(t=tM[t>>>0])(null,i=e0(i>>>0),r,a)}var tP={},tU=t=>{var i=tP[t];return void 0===i?eW(t):i};function tq(t,i,r,a,n){return r>>>=0,a>>>=0,n>>>=0,(t=tM[t>>>0])(i=e0(i>>>0),i[r=tU(r)],a,n)}function tW(t,i){return i>>>=0,(t=e0(t>>>0))==e0(i)}var tL=()=>"object"==typeof globalThis?globalThis:Function("return this")();function tV(t){return 0==(t>>>=0)?e2(tL()):(t=tU(t),e2(tL()[t]))}function tG(t,i,r){var a,n,s=(i=((t,i)=>{for(var r=Array(t),a=0;a<t;++a)r[a]=t$(L()[i+4*a>>>2>>>0],`parameter ${a}`);return r})(t,i>>>0)).shift();t--;var o=`return function (obj, func, destructorsRef, args) {
`,u=0,l=[];0===r&&l.push("obj");for(var d=["retType"],p=[s],c=0;c<t;++c)l.push(`arg${c}`),d.push(`argType${c}`),p.push(i[c]),o+=`  var arg${c} = argType${c}.readValueFromPointer(args${u?"+"+u:""});
`,u+=i[c].Cb;return o+=`  var rv = ${1===r?"new func":"func.call"}(${l.join(", ")});
`,s.Ub||(d.push("emval_returnValue"),p.push(tv),o+=`  return emval_returnValue(retType, destructorsRef, rv);
`),a=Object.defineProperty(t=Function(...d,o+`};
`)(...p),"name",{value:r=`methodCaller<(${i.map(t=>t.name).join(", ")}) => ${s.name}>`}),n=tM.length,tM.push(a),n}function tj(i){return e2(t[i=tU(i>>>0)])}function tH(t,i){return i>>>=0,e2((t=e0(t>>>0))[i=e0(i)])}function tF(t){9<(t>>>=0)&&(eY[t+1]+=1)}function tK(){return e2([])}function tZ(t){t=e0(t>>>0);for(var i=Array(t.length),r=0;r<t.length;r++)i[r]=t[r];return e2(i)}function tQ(t){return e2(tU(t>>>0))}function tX(){return e2({})}function tY(t){for(var i=e0(t>>>=0);i.length;){var r=i.pop();i.pop()(r)}eJ(t)}function tJ(t,i,r){i>>>=0,r>>>=0,t=e0(t>>>0),i=e0(i),r=e0(r),t[i]=r}function t0(t,i){return i>>>=0,e2(t=(t=t$(t>>>0,"_emval_take_value")).readValueFromPointer(i))}function t2(t,i){t=-0x20000000000000>t||0x20000000000000<t?NaN:Number(t),i>>>=0,t=new Date(1e3*t),W()[i>>>2>>>0]=t.getUTCSeconds(),W()[i+4>>>2>>>0]=t.getUTCMinutes(),W()[i+8>>>2>>>0]=t.getUTCHours(),W()[i+12>>>2>>>0]=t.getUTCDate(),W()[i+16>>>2>>>0]=t.getUTCMonth(),W()[i+20>>>2>>>0]=t.getUTCFullYear()-1900,W()[i+24>>>2>>>0]=t.getUTCDay(),t=(t.getTime()-Date.UTC(t.getUTCFullYear(),0,1,0,0,0,0))/864e5|0,W()[i+28>>>2>>>0]=t}var t1=t=>t%4==0&&(t%100!=0||t%400==0),t3=[0,31,60,91,121,152,182,213,244,274,305,335],t4=[0,31,59,90,120,151,181,212,243,273,304,334];function t6(t,i){t=-0x20000000000000>t||0x20000000000000<t?NaN:Number(t),i>>>=0,t=new Date(1e3*t),W()[i>>>2>>>0]=t.getSeconds(),W()[i+4>>>2>>>0]=t.getMinutes(),W()[i+8>>>2>>>0]=t.getHours(),W()[i+12>>>2>>>0]=t.getDate(),W()[i+16>>>2>>>0]=t.getMonth(),W()[i+20>>>2>>>0]=t.getFullYear()-1900,W()[i+24>>>2>>>0]=t.getDay();var r=(t1(t.getFullYear())?t3:t4)[t.getMonth()]+t.getDate()-1|0;W()[i+28>>>2>>>0]=r,W()[i+36>>>2>>>0]=-60*t.getTimezoneOffset(),r=new Date(t.getFullYear(),6,1).getTimezoneOffset();var a=new Date(t.getFullYear(),0,1).getTimezoneOffset();t=0|(r!=a&&t.getTimezoneOffset()==Math.min(a,r)),W()[i+32>>>2>>>0]=t}function t8(t){t>>>=0;var i=new Date(W()[t+20>>>2>>>0]+1900,W()[t+16>>>2>>>0],W()[t+12>>>2>>>0],W()[t+8>>>2>>>0],W()[t+4>>>2>>>0],W()[t>>>2>>>0],0),r=W()[t+32>>>2>>>0],a=i.getTimezoneOffset(),n=new Date(i.getFullYear(),6,1).getTimezoneOffset(),s=new Date(i.getFullYear(),0,1).getTimezoneOffset(),o=Math.min(s,n);return 0>r?W()[t+32>>>2>>>0]=+(n!=s&&o==a):0<r!=(o==a)&&(n=Math.max(s,n),i.setTime(i.getTime()+6e4*((0<r?o:n)-a))),W()[t+24>>>2>>>0]=i.getDay(),r=(t1(i.getFullYear())?t3:t4)[i.getMonth()]+i.getDate()-1|0,W()[t+28>>>2>>>0]=r,W()[t>>>2>>>0]=i.getSeconds(),W()[t+4>>>2>>>0]=i.getMinutes(),W()[t+8>>>2>>>0]=i.getHours(),W()[t+12>>>2>>>0]=i.getDate(),W()[t+16>>>2>>>0]=i.getMonth(),W()[t+20>>>2>>>0]=i.getYear(),BigInt(isNaN(t=i.getTime())?-1:t/1e3)}function t5(t,i,r,a,n,s,u){return o?en(16,1,t,i,r,a,n,s,u):-52}function t9(t,i,r,a,n,s){if(o)return en(17,1,t,i,r,a,n,s)}var t7={},ie=()=>performance.timeOrigin+performance.now();function it(t,i){if(o)return en(18,1,t,i);if(t7[t]&&(clearTimeout(t7[t].id),delete t7[t]),!i)return 0;var r=setTimeout(()=>{delete t7[t],tp(()=>iQ(t,performance.timeOrigin+performance.now()))},i);return t7[t]={id:r,rc:i},0}function ii(t,i,r,a){t>>>=0,i>>>=0,r>>>=0,a>>>=0;var n=new Date().getFullYear(),s=new Date(n,0,1).getTimezoneOffset(),o=Math.max(s,n=new Date(n,6,1).getTimezoneOffset());L()[t>>>2>>>0]=60*o,W()[i>>>2>>>0]=+(s!=n),t=(i=t=>{var i=Math.abs(t);return`UTC${0<=t?"-":"+"}${String(Math.floor(i/60)).padStart(2,"0")}${String(i%60).padStart(2,"0")}`})(s),i=i(n),n<s?(e9(t,r,17),e9(i,a,17)):(e9(t,a,17),e9(i,r,17))}var ir=()=>Date.now();function ia(t,i,r){return 0<=t&&3>=t?(t=0===t?Date.now():performance.timeOrigin+performance.now(),T[r>>>0>>>3]=BigInt(Math.round(1e6*t)),0):28}var is=[],io=(t,i)=>{is.length=0;for(var r;r=P()[t++>>>0];){var a=105!=r;i+=(a&=112!=r)&&i%8?4:0,is.push(112==r?L()[i>>>2>>>0]:106==r?T[i>>>3]:105==r?W()[i>>>2>>>0]:G()[i>>>3>>>0]),i+=a?8:4}return is};function iu(t,i,r){return t>>>=0,i=io(i>>>0,r>>>0),iM[t](...i)}function il(t,i,r){return t>>>=0,i=io(i>>>0,r>>>0),iM[t](...i)}var id=()=>{};function ip(t,i){return B(ek(t>>>0,i>>>0))}var ic=()=>{throw ea+=1,"unwind"};function ih(){return 0xffff0000}var im=()=>navigator.hardwareConcurrency;function ig(){return Y("Cannot use emscripten_pc_get_function without -sUSE_OFFSET_CONVERTER"),0}function iy(t){t>>>=0;var i=P().length;if(t<=i||0xffff0000<t)return!1;for(var r=1;4>=r;r*=2){var a=i*(1+.2/r);a=Math.min(a,t+0x6000000);e:{a=(Math.min(0xffff0000,65536*Math.ceil(Math.max(t,a)/65536))-y.buffer.byteLength+65535)/65536|0;try{y.grow(a),H();var n=1;break e}catch{}n=void 0}if(n)return!0}return!1}var i_=()=>(Y("Cannot use convertFrameToPC (needed by __builtin_return_address) without -sUSE_OFFSET_CONVERTER"),0),ib={},i$=t=>{t.forEach(t=>{var i=i_();i&&(ib[i]=t)})};function iv(){var t=Error().stack.toString().split(`
`);return"Error"==t[0]&&t.shift(),i$(t),ib.Mb=i_(),ib.dc=t,ib.Mb}function iw(t,i,r){if(t>>>=0,i>>>=0,ib.Mb==t)var a=ib.dc;else"Error"==(a=Error().stack.toString().split(`
`))[0]&&a.shift(),i$(a);for(var n=3;a[n]&&i_()!=t;)++n;for(t=0;t<r&&a[t+n];++t)W()[i+4*t>>>2>>>0]=i_();return t}var ix,iC={},ik=()=>{if(!ix){var t,i={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:("object"==typeof navigator&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",_:"./this.program"};for(t in iC)void 0===iC[t]?delete i[t]:i[t]=iC[t];var r=[];for(t in i)r.push(`${t}=${i[t]}`);ix=r}return ix};function iS(t,i){if(o)return en(19,1,t,i);t>>>=0,i>>>=0;var r,a=0,n=0;for(r of ik()){var s=i+a;L()[t+n>>>2>>>0]=s,a+=e9(r,s,1/0)+1,n+=4}return 0}function iT(t,i){if(o)return en(20,1,t,i);t>>>=0,i>>>=0;var r=ik();for(var a of(L()[t>>>2>>>0]=r.length,t=0,r))t+=e7(a)+1;return L()[i>>>2>>>0]=t,0}function iI(t){return o?en(21,1,t):52}function iE(t,i,r,a){return o?en(22,1,t,i,r,a):52}function iz(t,i,r,a){return o?en(23,1,t,i,r,a):70}var iA=[null,[],[]];function iO(t,i,r,a){if(o)return en(24,1,t,i,r,a);i>>>=0,r>>>=0,a>>>=0;for(var n=0,s=0;s<r;s++){var u=L()[i>>>2>>>0],l=L()[i+4>>>2>>>0];i+=8;for(var d=0;d<l;d++){var p=P()[u+d>>>0],c=iA[t];0===p||10===p?((1===t?R:B)(eC(c)),c.length=0):c.push(p)}n+=l}return L()[a>>>2>>>0]=n,0}o||function(){for(var i=t.numThreads-1;i--;)eg();ei.push(()=>{var t;Z++,t=()=>X(),o?t():Promise.all(el.map(em)).then(t)})}();for(var iR=Array(256),iB=0;256>iB;++iB)iR[iB]=String.fromCharCode(iB);eU=iR,eY.push(0,1,void 0,1,null,1,!0,1,!1,1),t.count_emval_handles=()=>eY.length/2-5-eX.length,o||(y=new WebAssembly.Memory({initial:256,maximum:65536,shared:!0}),H()),t.wasmBinary&&(g=t.wasmBinary),t.stackSave=()=>i2(),t.stackRestore=t=>iJ(t),t.stackAlloc=t=>i0(t),t.setValue=function(t,i,r="i8"){switch(r.endsWith("*")&&(r="*"),r){case"i1":case"i8":D()[t>>>0]=i;break;case"i16":U()[t>>>1>>>0]=i;break;case"i32":W()[t>>>2>>>0]=i;break;case"i64":T[t>>>3]=BigInt(i);break;case"float":V()[t>>>2>>>0]=i;break;case"double":G()[t>>>3>>>0]=i;break;case"*":L()[t>>>2>>>0]=i;break;default:Y(`invalid type for setValue: ${r}`)}},t.getValue=function(t,i="i8"){switch(i.endsWith("*")&&(i="*"),i){case"i1":case"i8":return D()[t>>>0];case"i16":return U()[t>>>1>>>0];case"i32":return W()[t>>>2>>>0];case"i64":return T[t>>>3];case"float":return V()[t>>>2>>>0];case"double":return G()[t>>>3>>>0];case"*":return L()[t>>>2>>>0];default:Y(`invalid type for getValue: ${i}`)}},t.UTF8ToString=ek,t.stringToUTF8=e9,t.lengthBytesUTF8=e7;var iN=[es,eo,ev,eS,eT,eI,eE,ez,eA,eO,eR,eB,eN,eM,eD,eP,t5,t9,it,iS,iT,iI,iE,iz,iO],iM={892060:(i,r,a,n,s)=>{if(void 0===t||!t.Fb)return 1;if((i=ek(Number(i>>>0))).startsWith("./")&&(i=i.substring(2)),!(i=t.Fb.get(i)))return 2;if(r=Number(r>>>0),a=Number(a>>>0),n=Number(n>>>0),r+a>i.byteLength)return 3;try{let o=i.subarray(r,r+a);switch(s){case 0:P().set(o,n>>>0);break;case 1:t.mc?t.mc(n,o):t.cc(n,o);break;default:return 4}return 0}catch{return 4}},892884:(i,r,a)=>{t.Pb(i,P().subarray(r>>>0,r+a>>>0))},892948:()=>t.oc(),892990:i=>{t.Ob(i)},893027:()=>{t.Wb()},893058:()=>{t.Xb()},893087:()=>{t.ac()},893112:i=>t.Vb(i),893145:i=>t.Zb(i),893177:(i,r,a)=>{t.Lb(Number(i),Number(r),Number(a),!0)},893240:(i,r,a)=>{t.Lb(Number(i),Number(r),Number(a))},893297:()=>"u">typeof wasmOffsetConverter,893354:i=>{t.Ab("Abs",i,void 0)},893405:i=>{t.Ab("Neg",i,void 0)},893456:i=>{t.Ab("Floor",i,void 0)},893509:i=>{t.Ab("Ceil",i,void 0)},893561:i=>{t.Ab("Reciprocal",i,void 0)},893619:i=>{t.Ab("Sqrt",i,void 0)},893671:i=>{t.Ab("Exp",i,void 0)},893722:i=>{t.Ab("Erf",i,void 0)},893773:i=>{t.Ab("Sigmoid",i,void 0)},893828:(i,r,a)=>{t.Ab("HardSigmoid",i,{alpha:r,beta:a})},893907:i=>{t.Ab("Log",i,void 0)},893958:i=>{t.Ab("Sin",i,void 0)},894009:i=>{t.Ab("Cos",i,void 0)},894060:i=>{t.Ab("Tan",i,void 0)},894111:i=>{t.Ab("Asin",i,void 0)},894163:i=>{t.Ab("Acos",i,void 0)},894215:i=>{t.Ab("Atan",i,void 0)},894267:i=>{t.Ab("Sinh",i,void 0)},894319:i=>{t.Ab("Cosh",i,void 0)},894371:i=>{t.Ab("Asinh",i,void 0)},894424:i=>{t.Ab("Acosh",i,void 0)},894477:i=>{t.Ab("Atanh",i,void 0)},894530:i=>{t.Ab("Tanh",i,void 0)},894582:i=>{t.Ab("Not",i,void 0)},894633:(i,r,a)=>{t.Ab("Clip",i,{min:r,max:a})},894702:i=>{t.Ab("Clip",i,void 0)},894754:(i,r)=>{t.Ab("Elu",i,{alpha:r})},894812:i=>{t.Ab("Gelu",i,void 0)},894864:i=>{t.Ab("Relu",i,void 0)},894916:(i,r)=>{t.Ab("LeakyRelu",i,{alpha:r})},894980:(i,r)=>{t.Ab("ThresholdedRelu",i,{alpha:r})},895050:(i,r)=>{t.Ab("Cast",i,{to:r})},895108:i=>{t.Ab("Add",i,void 0)},895159:i=>{t.Ab("Sub",i,void 0)},895210:i=>{t.Ab("Mul",i,void 0)},895261:i=>{t.Ab("Div",i,void 0)},895312:i=>{t.Ab("Pow",i,void 0)},895363:i=>{t.Ab("Equal",i,void 0)},895416:i=>{t.Ab("Greater",i,void 0)},895471:i=>{t.Ab("GreaterOrEqual",i,void 0)},895533:i=>{t.Ab("Less",i,void 0)},895585:i=>{t.Ab("LessOrEqual",i,void 0)},895644:(i,r,a,n,s)=>{t.Ab("ReduceMean",i,{keepDims:!!r,noopWithEmptyAxes:!!a,axes:n?Array.from(W().subarray(Number(n)>>>0,Number(s)>>>0)):[]})},895819:(i,r,a,n,s)=>{t.Ab("ReduceMax",i,{keepDims:!!r,noopWithEmptyAxes:!!a,axes:n?Array.from(W().subarray(Number(n)>>>0,Number(s)>>>0)):[]})},895993:(i,r,a,n,s)=>{t.Ab("ReduceMin",i,{keepDims:!!r,noopWithEmptyAxes:!!a,axes:n?Array.from(W().subarray(Number(n)>>>0,Number(s)>>>0)):[]})},896167:(i,r,a,n,s)=>{t.Ab("ReduceProd",i,{keepDims:!!r,noopWithEmptyAxes:!!a,axes:n?Array.from(W().subarray(Number(n)>>>0,Number(s)>>>0)):[]})},896342:(i,r,a,n,s)=>{t.Ab("ReduceSum",i,{keepDims:!!r,noopWithEmptyAxes:!!a,axes:n?Array.from(W().subarray(Number(n)>>>0,Number(s)>>>0)):[]})},896516:(i,r,a,n,s)=>{t.Ab("ReduceL1",i,{keepDims:!!r,noopWithEmptyAxes:!!a,axes:n?Array.from(W().subarray(Number(n)>>>0,Number(s)>>>0)):[]})},896689:(i,r,a,n,s)=>{t.Ab("ReduceL2",i,{keepDims:!!r,noopWithEmptyAxes:!!a,axes:n?Array.from(W().subarray(Number(n)>>>0,Number(s)>>>0)):[]})},896862:(i,r,a,n,s)=>{t.Ab("ReduceLogSum",i,{keepDims:!!r,noopWithEmptyAxes:!!a,axes:n?Array.from(W().subarray(Number(n)>>>0,Number(s)>>>0)):[]})},897039:(i,r,a,n,s)=>{t.Ab("ReduceSumSquare",i,{keepDims:!!r,noopWithEmptyAxes:!!a,axes:n?Array.from(W().subarray(Number(n)>>>0,Number(s)>>>0)):[]})},897219:(i,r,a,n,s)=>{t.Ab("ReduceLogSumExp",i,{keepDims:!!r,noopWithEmptyAxes:!!a,axes:n?Array.from(W().subarray(Number(n)>>>0,Number(s)>>>0)):[]})},897399:i=>{t.Ab("Where",i,void 0)},897452:(i,r,a)=>{t.Ab("Transpose",i,{perm:r?Array.from(W().subarray(Number(r)>>>0,Number(a)>>>0)):[]})},897576:(i,r,a,n)=>{t.Ab("DepthToSpace",i,{blocksize:r,mode:ek(a),format:n?"NHWC":"NCHW"})},897709:(i,r,a,n)=>{t.Ab("DepthToSpace",i,{blocksize:r,mode:ek(a),format:n?"NHWC":"NCHW"})},897842:(i,r,a,n,s,o,u,l,d,p,c,h,f,m,g)=>{t.Ab("ConvTranspose",i,{format:d?"NHWC":"NCHW",autoPad:r,dilations:[a],group:n,kernelShape:[s],pads:[o,u],strides:[l],wIsConst:()=>!!D()[p>>>0],outputPadding:c?Array.from(W().subarray(Number(c)>>>0,Number(h)>>>0)):[],outputShape:f?Array.from(W().subarray(Number(f)>>>0,Number(m)>>>0)):[],activation:ek(g)})},898275:(i,r,a,n,s,o,u,l,d,p,c,h,f,m)=>{t.Ab("ConvTranspose",i,{format:l?"NHWC":"NCHW",autoPad:r,dilations:Array.from(W().subarray(Number(a)>>>0,2+(Number(a)>>>0)>>>0)),group:n,kernelShape:Array.from(W().subarray(Number(s)>>>0,2+(Number(s)>>>0)>>>0)),pads:Array.from(W().subarray(Number(o)>>>0,4+(Number(o)>>>0)>>>0)),strides:Array.from(W().subarray(Number(u)>>>0,2+(Number(u)>>>0)>>>0)),wIsConst:()=>!!D()[d>>>0],outputPadding:p?Array.from(W().subarray(Number(p)>>>0,Number(c)>>>0)):[],outputShape:h?Array.from(W().subarray(Number(h)>>>0,Number(f)>>>0)):[],activation:ek(m)})},898936:(i,r,a,n,s,o,u,l,d,p,c,h,f,m,g)=>{t.Ab("ConvTranspose",i,{format:d?"NHWC":"NCHW",autoPad:r,dilations:[a],group:n,kernelShape:[s],pads:[o,u],strides:[l],wIsConst:()=>!!D()[p>>>0],outputPadding:c?Array.from(W().subarray(Number(c)>>>0,Number(h)>>>0)):[],outputShape:f?Array.from(W().subarray(Number(f)>>>0,Number(m)>>>0)):[],activation:ek(g)})},899369:(i,r,a,n,s,o,u,l,d,p,c,h,f,m)=>{t.Ab("ConvTranspose",i,{format:l?"NHWC":"NCHW",autoPad:r,dilations:Array.from(W().subarray(Number(a)>>>0,2+(Number(a)>>>0)>>>0)),group:n,kernelShape:Array.from(W().subarray(Number(s)>>>0,2+(Number(s)>>>0)>>>0)),pads:Array.from(W().subarray(Number(o)>>>0,4+(Number(o)>>>0)>>>0)),strides:Array.from(W().subarray(Number(u)>>>0,2+(Number(u)>>>0)>>>0)),wIsConst:()=>!!D()[d>>>0],outputPadding:p?Array.from(W().subarray(Number(p)>>>0,Number(c)>>>0)):[],outputShape:h?Array.from(W().subarray(Number(h)>>>0,Number(f)>>>0)):[],activation:ek(m)})},900030:(i,r)=>{t.Ab("GlobalAveragePool",i,{format:r?"NHWC":"NCHW"})},900121:(i,r,a,n,s,o,u,l,d,p,c,h,f,m)=>{t.Ab("AveragePool",i,{format:m?"NHWC":"NCHW",auto_pad:r,ceil_mode:a,count_include_pad:n,storage_order:s,dilations:o?Array.from(W().subarray(Number(o)>>>0,Number(u)>>>0)):[],kernel_shape:l?Array.from(W().subarray(Number(l)>>>0,Number(d)>>>0)):[],pads:p?Array.from(W().subarray(Number(p)>>>0,Number(c)>>>0)):[],strides:h?Array.from(W().subarray(Number(h)>>>0,Number(f)>>>0)):[]})},900600:(i,r)=>{t.Ab("GlobalAveragePool",i,{format:r?"NHWC":"NCHW"})},900691:(i,r,a,n,s,o,u,l,d,p,c,h,f,m)=>{t.Ab("AveragePool",i,{format:m?"NHWC":"NCHW",auto_pad:r,ceil_mode:a,count_include_pad:n,storage_order:s,dilations:o?Array.from(W().subarray(Number(o)>>>0,Number(u)>>>0)):[],kernel_shape:l?Array.from(W().subarray(Number(l)>>>0,Number(d)>>>0)):[],pads:p?Array.from(W().subarray(Number(p)>>>0,Number(c)>>>0)):[],strides:h?Array.from(W().subarray(Number(h)>>>0,Number(f)>>>0)):[]})},901170:(i,r)=>{t.Ab("GlobalMaxPool",i,{format:r?"NHWC":"NCHW"})},901257:(i,r,a,n,s,o,u,l,d,p,c,h,f,m)=>{t.Ab("MaxPool",i,{format:m?"NHWC":"NCHW",auto_pad:r,ceil_mode:a,count_include_pad:n,storage_order:s,dilations:o?Array.from(W().subarray(Number(o)>>>0,Number(u)>>>0)):[],kernel_shape:l?Array.from(W().subarray(Number(l)>>>0,Number(d)>>>0)):[],pads:p?Array.from(W().subarray(Number(p)>>>0,Number(c)>>>0)):[],strides:h?Array.from(W().subarray(Number(h)>>>0,Number(f)>>>0)):[]})},901732:(i,r)=>{t.Ab("GlobalMaxPool",i,{format:r?"NHWC":"NCHW"})},901819:(i,r,a,n,s,o,u,l,d,p,c,h,f,m)=>{t.Ab("MaxPool",i,{format:m?"NHWC":"NCHW",auto_pad:r,ceil_mode:a,count_include_pad:n,storage_order:s,dilations:o?Array.from(W().subarray(Number(o)>>>0,Number(u)>>>0)):[],kernel_shape:l?Array.from(W().subarray(Number(l)>>>0,Number(d)>>>0)):[],pads:p?Array.from(W().subarray(Number(p)>>>0,Number(c)>>>0)):[],strides:h?Array.from(W().subarray(Number(h)>>>0,Number(f)>>>0)):[]})},902294:(i,r,a,n,s)=>{t.Ab("Gemm",i,{alpha:r,beta:a,transA:n,transB:s})},902398:i=>{t.Ab("MatMul",i,void 0)},902452:(i,r,a,n)=>{t.Ab("ArgMax",i,{keepDims:!!r,selectLastIndex:!!a,axis:n})},902560:(i,r,a,n)=>{t.Ab("ArgMin",i,{keepDims:!!r,selectLastIndex:!!a,axis:n})},902668:(i,r)=>{t.Ab("Softmax",i,{axis:r})},902731:(i,r)=>{t.Ab("Concat",i,{axis:r})},902791:(i,r,a,n,s)=>{t.Ab("Split",i,{axis:r,numOutputs:a,splitSizes:n?Array.from(W().subarray(Number(n)>>>0,Number(s)>>>0)):[]})},902947:i=>{t.Ab("Expand",i,void 0)},903001:(i,r)=>{t.Ab("Gather",i,{axis:Number(r)})},903072:(i,r)=>{t.Ab("GatherElements",i,{axis:Number(r)})},903151:(i,r)=>{t.Ab("GatherND",i,{batch_dims:Number(r)})},903230:(i,r,a,n,s,o,u,l,d,p,c)=>{t.Ab("Resize",i,{antialias:r,axes:a?Array.from(W().subarray(Number(a)>>>0,Number(n)>>>0)):[],coordinateTransformMode:ek(s),cubicCoeffA:o,excludeOutside:u,extrapolationValue:l,keepAspectRatioPolicy:ek(d),mode:ek(p),nearestMode:ek(c)})},903592:(i,r,a,n,s,o,u)=>{t.Ab("Slice",i,{starts:r?Array.from(W().subarray(Number(r)>>>0,Number(a)>>>0)):[],ends:n?Array.from(W().subarray(Number(n)>>>0,Number(s)>>>0)):[],axes:o?Array.from(W().subarray(Number(o)>>>0,Number(u)>>>0)):[]})},903856:i=>{t.Ab("Tile",i,void 0)},903908:(i,r,a)=>{t.Ab("InstanceNormalization",i,{epsilon:r,format:a?"NHWC":"NCHW"})},904022:(i,r,a)=>{t.Ab("InstanceNormalization",i,{epsilon:r,format:a?"NHWC":"NCHW"})},904136:i=>{t.Ab("Range",i,void 0)},904189:(i,r)=>{t.Ab("Einsum",i,{equation:ek(r)})},904270:(i,r,a,n,s)=>{t.Ab("Pad",i,{mode:r,value:a,pads:n?Array.from(W().subarray(Number(n)>>>0,Number(s)>>>0)):[]})},904413:(i,r,a,n,s,o)=>{t.Ab("BatchNormalization",i,{epsilon:r,momentum:a,spatial:!!s,trainingMode:!!n,format:o?"NHWC":"NCHW"})},904582:(i,r,a,n,s,o)=>{t.Ab("BatchNormalization",i,{epsilon:r,momentum:a,spatial:!!s,trainingMode:!!n,format:o?"NHWC":"NCHW"})},904751:(i,r,a)=>{t.Ab("CumSum",i,{exclusive:Number(r),reverse:Number(a)})},904848:(i,r,a)=>{t.Ab("DequantizeLinear",i,{axis:r,blockSize:a})},904938:(i,r,a,n,s)=>{t.Ab("GridSample",i,{align_corners:r,mode:ek(a),padding_mode:ek(n),format:s?"NHWC":"NCHW"})},905108:(i,r,a,n,s)=>{t.Ab("GridSample",i,{align_corners:r,mode:ek(a),padding_mode:ek(n),format:s?"NHWC":"NCHW"})},905278:(i,r)=>{t.Ab("ScatterND",i,{reduction:ek(r)})},905363:(i,r,a,n,s,o,u,l,d)=>{t.Ab("Attention",i,{numHeads:r,isUnidirectional:a,maskFilterValue:n,scale:s,doRotary:o,qkvHiddenSizes:u?Array.from(W().subarray(Number(l)>>>0,Number(l)+u>>>0)):[],pastPresentShareBuffer:!!d})},905635:i=>{t.Ab("BiasAdd",i,void 0)},905690:i=>{t.Ab("BiasSplitGelu",i,void 0)},905751:i=>{t.Ab("FastGelu",i,void 0)},905807:(i,r,a,n,s,o,u,l,d,p,c,h,f,m,g,y)=>{t.Ab("Conv",i,{format:h?"NHWC":"NCHW",auto_pad:r,dilations:a?Array.from(W().subarray(Number(a)>>>0,Number(n)>>>0)):[],group:s,kernel_shape:o?Array.from(W().subarray(Number(o)>>>0,Number(u)>>>0)):[],pads:l?Array.from(W().subarray(Number(l)>>>0,Number(d)>>>0)):[],strides:p?Array.from(W().subarray(Number(p)>>>0,Number(c)>>>0)):[],w_is_const:()=>!!D()[Number(f)>>>0],activation:ek(m),activation_params:g?Array.from(V().subarray(Number(g)>>>0,Number(y)>>>0)):[]})},906391:i=>{t.Ab("Gelu",i,void 0)},906443:(i,r,a,n,s,o,u,l,d)=>{t.Ab("GroupQueryAttention",i,{numHeads:r,kvNumHeads:a,scale:n,softcap:s,doRotary:o,rotaryInterleaved:u,smoothSoftmax:l,localWindowSize:d})},906660:(i,r,a,n)=>{t.Ab("LayerNormalization",i,{axis:r,epsilon:a,simplified:!!n})},906771:(i,r,a,n)=>{t.Ab("LayerNormalization",i,{axis:r,epsilon:a,simplified:!!n})},906882:(i,r,a,n,s,o)=>{t.Ab("MatMulNBits",i,{k:r,n:a,accuracyLevel:n,bits:s,blockSize:o})},907009:(i,r,a,n,s,o)=>{t.Ab("MultiHeadAttention",i,{numHeads:r,isUnidirectional:a,maskFilterValue:n,scale:s,doRotary:o})},907168:(i,r)=>{t.Ab("QuickGelu",i,{alpha:r})},907232:(i,r,a,n,s)=>{t.Ab("RotaryEmbedding",i,{interleaved:!!r,numHeads:a,rotaryEmbeddingDim:n,scale:s})},907371:(i,r,a)=>{t.Ab("SkipLayerNormalization",i,{epsilon:r,simplified:!!a})},907473:(i,r,a)=>{t.Ab("SkipLayerNormalization",i,{epsilon:r,simplified:!!a})},907575:(i,r,a,n)=>{t.Ab("GatherBlockQuantized",i,{gatherAxis:r,quantizeAxis:a,blockSize:n})},907696:i=>{t.$b(i)},907730:(i,r)=>t.bc(Number(i),Number(r),t.Gb.ec,t.Gb.errors)};function iD(i,r,a){return tB(async()=>{await t.Yb(Number(i),Number(r),Number(a))})}function iP(){return"u">typeof wasmOffsetConverter}var iU=await async function(){function i(t,i){var r,a,n;return iU=t.exports,r=iU=function(){var t={};for(let[i,r]of Object.entries(iU))t[i]="function"==typeof r?(...t)=>{tI.push(i);try{return r(...t)}finally{N||(tI.pop(),tS&&1===tk&&0===tI.length&&(tk=0,ea+=1,tC(i4),"u">typeof Fibers&&Fibers.sc()))}}:r;return t}(),a=t=>i=>t(i)>>>0,n=t=>()=>t()>>>0,(r=Object.assign({},r)).Ea=a(r.Ea),r.gb=n(r.gb),r.ib=a(r.ib),r.tb=a(r.tb),r.ub=n(r.ub),r.__cxa_get_exception_ptr=a(r.__cxa_get_exception_ptr),iU=r,ep.push(iU.jb),_=i,X(),iU}Z++;var a=J();if(t.instantiateWasm)return new Promise(r=>{t.instantiateWasm(a,(t,a)=>{r(i(t,a))})});if(o)return new Promise(t=>{z=r=>{t(i(new WebAssembly.Instance(r,J()),r))}});K??=t.locateFile?t.locateFile?t.locateFile("ort-wasm-simd-threaded.jsep.wasm",m):m+"ort-wasm-simd-threaded.jsep.wasm":new URL("ort-wasm-simd-threaded.jsep.wasm",import.meta.url).href;try{var n=await async function(t){if(!g&&"function"==typeof WebAssembly.instantiateStreaming&&!M(K))try{var i=fetch(K,{credentials:"same-origin"});return await WebAssembly.instantiateStreaming(i,t)}catch(t){B(`wasm streaming compile failed: ${t}`),B("falling back to ArrayBuffer instantiation")}return async function(t,i){try{var r=await async function(t){if(!g)try{var i=await p(t);return new Uint8Array(i)}catch{}if(t==K&&g)t=new Uint8Array(g);else{if(!c)throw"both async and sync fetching of the wasm failed";t=c(t)}return t}(t);return await WebAssembly.instantiate(r,i)}catch(t){B(`failed to asynchronously prepare wasm: ${t}`),Y(t)}}(K,t)}(a);return i(n.instance,n.module)}catch(t){return r(t),Promise.reject(t)}}(),iq=t=>(iq=iU.Ea)(t),iW=()=>(iW=iU.Fa)();t._OrtInit=(i,r)=>(t._OrtInit=iU.Ga)(i,r),t._OrtGetLastError=(i,r)=>(t._OrtGetLastError=iU.Ha)(i,r),t._OrtCreateSessionOptions=(i,r,a,n,s,o,u,l,d,p)=>(t._OrtCreateSessionOptions=iU.Ia)(i,r,a,n,s,o,u,l,d,p),t._OrtAppendExecutionProvider=(i,r,a,n,s)=>(t._OrtAppendExecutionProvider=iU.Ja)(i,r,a,n,s),t._OrtAddFreeDimensionOverride=(i,r,a)=>(t._OrtAddFreeDimensionOverride=iU.Ka)(i,r,a),t._OrtAddSessionConfigEntry=(i,r,a)=>(t._OrtAddSessionConfigEntry=iU.La)(i,r,a),t._OrtReleaseSessionOptions=i=>(t._OrtReleaseSessionOptions=iU.Ma)(i),t._OrtCreateSession=(i,r,a)=>(t._OrtCreateSession=iU.Na)(i,r,a),t._OrtReleaseSession=i=>(t._OrtReleaseSession=iU.Oa)(i),t._OrtGetInputOutputCount=(i,r,a)=>(t._OrtGetInputOutputCount=iU.Pa)(i,r,a),t._OrtGetInputOutputMetadata=(i,r,a,n)=>(t._OrtGetInputOutputMetadata=iU.Qa)(i,r,a,n),t._OrtFree=i=>(t._OrtFree=iU.Ra)(i),t._OrtCreateTensor=(i,r,a,n,s,o)=>(t._OrtCreateTensor=iU.Sa)(i,r,a,n,s,o),t._OrtGetTensorData=(i,r,a,n,s)=>(t._OrtGetTensorData=iU.Ta)(i,r,a,n,s),t._OrtReleaseTensor=i=>(t._OrtReleaseTensor=iU.Ua)(i),t._OrtCreateRunOptions=(i,r,a,n)=>(t._OrtCreateRunOptions=iU.Va)(i,r,a,n),t._OrtAddRunConfigEntry=(i,r,a)=>(t._OrtAddRunConfigEntry=iU.Wa)(i,r,a),t._OrtReleaseRunOptions=i=>(t._OrtReleaseRunOptions=iU.Xa)(i),t._OrtCreateBinding=i=>(t._OrtCreateBinding=iU.Ya)(i),t._OrtBindInput=(i,r,a)=>(t._OrtBindInput=iU.Za)(i,r,a),t._OrtBindOutput=(i,r,a,n)=>(t._OrtBindOutput=iU._a)(i,r,a,n),t._OrtClearBoundOutputs=i=>(t._OrtClearBoundOutputs=iU.$a)(i),t._OrtReleaseBinding=i=>(t._OrtReleaseBinding=iU.ab)(i),t._OrtRunWithBinding=(i,r,a,n,s)=>(t._OrtRunWithBinding=iU.bb)(i,r,a,n,s),t._OrtRun=(i,r,a,n,s,o,u,l)=>(t._OrtRun=iU.cb)(i,r,a,n,s,o,u,l),t._OrtEndProfiling=i=>(t._OrtEndProfiling=iU.db)(i),t._JsepOutput=(i,r,a)=>(t._JsepOutput=iU.eb)(i,r,a),t._JsepGetNodeName=i=>(t._JsepGetNodeName=iU.fb)(i);var iL=()=>(iL=iU.gb)(),iV=t._free=i=>(iV=t._free=iU.hb)(i),iG=t._malloc=i=>(iG=t._malloc=iU.ib)(i),ij=(t,i,r,a,n,s)=>(ij=iU.kb)(t,i,r,a,n,s),iH=()=>(iH=iU.lb)(),iF=(t,i,r,a,n)=>(iF=iU.mb)(t,i,r,a,n),iK=t=>(iK=iU.nb)(t),iZ=t=>(iZ=iU.ob)(t),iQ=(t,i)=>(iQ=iU.pb)(t,i),iX=()=>(iX=iU.qb)(),iY=(t,i)=>(iY=iU.rb)(t,i),iJ=t=>(iJ=iU.sb)(t),i0=t=>(i0=iU.tb)(t),i2=()=>(i2=iU.ub)(),i1=t.dynCall_ii=(i,r)=>(i1=t.dynCall_ii=iU.vb)(i,r);t.dynCall_vii=(i,r,a)=>(t.dynCall_vii=iU.dynCall_vii)(i,r,a),t.dynCall_iiiii=(i,r,a,n,s)=>(t.dynCall_iiiii=iU.dynCall_iiiii)(i,r,a,n,s),t.dynCall_iii=(i,r,a)=>(t.dynCall_iii=iU.dynCall_iii)(i,r,a),t.dynCall_iiiiii=(i,r,a,n,s,o)=>(t.dynCall_iiiiii=iU.dynCall_iiiiii)(i,r,a,n,s,o),t.dynCall_iiiiiiii=(i,r,a,n,s,o,u,l)=>(t.dynCall_iiiiiiii=iU.dynCall_iiiiiiii)(i,r,a,n,s,o,u,l),t.dynCall_iiiiiii=(i,r,a,n,s,o,u)=>(t.dynCall_iiiiiii=iU.dynCall_iiiiiii)(i,r,a,n,s,o,u),t.dynCall_vi=(i,r)=>(t.dynCall_vi=iU.dynCall_vi)(i,r),t.dynCall_iiii=(i,r,a,n)=>(t.dynCall_iiii=iU.dynCall_iiii)(i,r,a,n),t.dynCall_i=i=>(t.dynCall_i=iU.dynCall_i)(i),t.dynCall_viiiiiiii=(i,r,a,n,s,o,u,l,d)=>(t.dynCall_viiiiiiii=iU.dynCall_viiiiiiii)(i,r,a,n,s,o,u,l,d),t.dynCall_viii=(i,r,a,n)=>(t.dynCall_viii=iU.dynCall_viii)(i,r,a,n),t.dynCall_viijj=(i,r,a,n,s)=>(t.dynCall_viijj=iU.dynCall_viijj)(i,r,a,n,s),t.dynCall_viiiiii=(i,r,a,n,s,o,u)=>(t.dynCall_viiiiii=iU.dynCall_viiiiii)(i,r,a,n,s,o,u),t.dynCall_viiii=(i,r,a,n,s)=>(t.dynCall_viiii=iU.dynCall_viiii)(i,r,a,n,s),t.dynCall_viiiii=(i,r,a,n,s,o)=>(t.dynCall_viiiii=iU.dynCall_viiiii)(i,r,a,n,s,o),t.dynCall_vfiii=(i,r,a,n,s)=>(t.dynCall_vfiii=iU.dynCall_vfiii)(i,r,a,n,s),t.dynCall_viiiiff=(i,r,a,n,s,o,u)=>(t.dynCall_viiiiff=iU.dynCall_viiiiff)(i,r,a,n,s,o,u),t.dynCall_viiiiiff=(i,r,a,n,s,o,u,l)=>(t.dynCall_viiiiiff=iU.dynCall_viiiiiff)(i,r,a,n,s,o,u,l),t.dynCall_ffff=(i,r,a,n)=>(t.dynCall_ffff=iU.dynCall_ffff)(i,r,a,n),t.dynCall_viiff=(i,r,a,n,s)=>(t.dynCall_viiff=iU.dynCall_viiff)(i,r,a,n,s),t.dynCall_fffffff=(i,r,a,n,s,o,u)=>(t.dynCall_fffffff=iU.dynCall_fffffff)(i,r,a,n,s,o,u),t.dynCall_jjjjjjj=(i,r,a,n,s,o,u)=>(t.dynCall_jjjjjjj=iU.dynCall_jjjjjjj)(i,r,a,n,s,o,u),t.dynCall_jjjjjj=(i,r,a,n,s,o)=>(t.dynCall_jjjjjj=iU.dynCall_jjjjjj)(i,r,a,n,s,o),t.dynCall_iijjii=(i,r,a,n,s,o)=>(t.dynCall_iijjii=iU.dynCall_iijjii)(i,r,a,n,s,o),t.dynCall_viiiiiiiiiiiii=(i,r,a,n,s,o,u,l,d,p,c,h,f,m)=>(t.dynCall_viiiiiiiiiiiii=iU.dynCall_viiiiiiiiiiiii)(i,r,a,n,s,o,u,l,d,p,c,h,f,m),t.dynCall_viiiiiiiiii=(i,r,a,n,s,o,u,l,d,p,c)=>(t.dynCall_viiiiiiiiii=iU.dynCall_viiiiiiiiii)(i,r,a,n,s,o,u,l,d,p,c),t.dynCall_viiiiiiiiiii=(i,r,a,n,s,o,u,l,d,p,c,h)=>(t.dynCall_viiiiiiiiiii=iU.dynCall_viiiiiiiiiii)(i,r,a,n,s,o,u,l,d,p,c,h),t.dynCall_viiiiiiiiiiii=(i,r,a,n,s,o,u,l,d,p,c,h,f)=>(t.dynCall_viiiiiiiiiiii=iU.dynCall_viiiiiiiiiiii)(i,r,a,n,s,o,u,l,d,p,c,h,f),t.dynCall_viiiiiiiiiiiiiiiiii=(i,r,a,n,s,o,u,l,d,p,c,h,f,m,g,y,_,b,$)=>(t.dynCall_viiiiiiiiiiiiiiiiii=iU.dynCall_viiiiiiiiiiiiiiiiii)(i,r,a,n,s,o,u,l,d,p,c,h,f,m,g,y,_,b,$),t.dynCall_viiiiiiiii=(i,r,a,n,s,o,u,l,d,p)=>(t.dynCall_viiiiiiiii=iU.dynCall_viiiiiiiii)(i,r,a,n,s,o,u,l,d,p),t.dynCall_viiiiiiiiiiiiiiiiiii=(i,r,a,n,s,o,u,l,d,p,c,h,f,m,g,y,_,b,$,v)=>(t.dynCall_viiiiiiiiiiiiiiiiiii=iU.dynCall_viiiiiiiiiiiiiiiiiii)(i,r,a,n,s,o,u,l,d,p,c,h,f,m,g,y,_,b,$,v),t.dynCall_viiiiiii=(i,r,a,n,s,o,u,l)=>(t.dynCall_viiiiiii=iU.dynCall_viiiiiii)(i,r,a,n,s,o,u,l),t.dynCall_viiiiiiiiiiiiiii=(i,r,a,n,s,o,u,l,d,p,c,h,f,m,g,y)=>(t.dynCall_viiiiiiiiiiiiiii=iU.dynCall_viiiiiiiiiiiiiii)(i,r,a,n,s,o,u,l,d,p,c,h,f,m,g,y),t.dynCall_jiji=(i,r,a,n)=>(t.dynCall_jiji=iU.dynCall_jiji)(i,r,a,n),t.dynCall_v=i=>(t.dynCall_v=iU.dynCall_v)(i),t.dynCall_iidiiii=(i,r,a,n,s,o,u)=>(t.dynCall_iidiiii=iU.dynCall_iidiiii)(i,r,a,n,s,o,u),t.dynCall_iiiiiiiii=(i,r,a,n,s,o,u,l,d)=>(t.dynCall_iiiiiiiii=iU.dynCall_iiiiiiiii)(i,r,a,n,s,o,u,l,d),t.dynCall_iiij=(i,r,a,n)=>(t.dynCall_iiij=iU.dynCall_iiij)(i,r,a,n),t.dynCall_iiiiiiiiii=(i,r,a,n,s,o,u,l,d,p)=>(t.dynCall_iiiiiiiiii=iU.dynCall_iiiiiiiiii)(i,r,a,n,s,o,u,l,d,p),t.dynCall_iiiiiiiiiiiii=(i,r,a,n,s,o,u,l,d,p,c,h,f)=>(t.dynCall_iiiiiiiiiiiii=iU.dynCall_iiiiiiiiiiiii)(i,r,a,n,s,o,u,l,d,p,c,h,f),t.dynCall_iiiiiiiiiii=(i,r,a,n,s,o,u,l,d,p,c)=>(t.dynCall_iiiiiiiiiii=iU.dynCall_iiiiiiiiiii)(i,r,a,n,s,o,u,l,d,p,c),t.dynCall_ji=(i,r)=>(t.dynCall_ji=iU.dynCall_ji)(i,r),t.dynCall_iijii=(i,r,a,n,s)=>(t.dynCall_iijii=iU.dynCall_iijii)(i,r,a,n,s),t.dynCall_vij=(i,r,a)=>(t.dynCall_vij=iU.dynCall_vij)(i,r,a),t.dynCall_viiijii=(i,r,a,n,s,o,u)=>(t.dynCall_viiijii=iU.dynCall_viiijii)(i,r,a,n,s,o,u),t.dynCall_viijiiiiiiiiiiiiii=(i,r,a,n,s,o,u,l,d,p,c,h,f,m,g,y,_,b)=>(t.dynCall_viijiiiiiiiiiiiiii=iU.dynCall_viijiiiiiiiiiiiiii)(i,r,a,n,s,o,u,l,d,p,c,h,f,m,g,y,_,b),t.dynCall_viiiji=(i,r,a,n,s,o)=>(t.dynCall_viiiji=iU.dynCall_viiiji)(i,r,a,n,s,o),t.dynCall_fiii=(i,r,a,n)=>(t.dynCall_fiii=iU.dynCall_fiii)(i,r,a,n),t.dynCall_viijii=(i,r,a,n,s,o)=>(t.dynCall_viijii=iU.dynCall_viijii)(i,r,a,n,s,o),t.dynCall_viij=(i,r,a,n)=>(t.dynCall_viij=iU.dynCall_viij)(i,r,a,n),t.dynCall_jiij=(i,r,a,n)=>(t.dynCall_jiij=iU.dynCall_jiij)(i,r,a,n),t.dynCall_fi=(i,r)=>(t.dynCall_fi=iU.dynCall_fi)(i,r),t.dynCall_fii=(i,r,a)=>(t.dynCall_fii=iU.dynCall_fii)(i,r,a),t.dynCall_jii=(i,r,a)=>(t.dynCall_jii=iU.dynCall_jii)(i,r,a),t.dynCall_dii=(i,r,a)=>(t.dynCall_dii=iU.dynCall_dii)(i,r,a),t.dynCall_fiiii=(i,r,a,n,s)=>(t.dynCall_fiiii=iU.dynCall_fiiii)(i,r,a,n,s),t.dynCall_fif=(i,r,a)=>(t.dynCall_fif=iU.dynCall_fif)(i,r,a),t.dynCall_jfi=(i,r,a)=>(t.dynCall_jfi=iU.dynCall_jfi)(i,r,a),t.dynCall_viiiiiiiiiiiiii=(i,r,a,n,s,o,u,l,d,p,c,h,f,m,g)=>(t.dynCall_viiiiiiiiiiiiii=iU.dynCall_viiiiiiiiiiiiii)(i,r,a,n,s,o,u,l,d,p,c,h,f,m,g),t.dynCall_viiiiiiiiiiiiiiiiiiii=(i,r,a,n,s,o,u,l,d,p,c,h,f,m,g,y,_,b,$,v,w)=>(t.dynCall_viiiiiiiiiiiiiiiiiiii=iU.dynCall_viiiiiiiiiiiiiiiiiiii)(i,r,a,n,s,o,u,l,d,p,c,h,f,m,g,y,_,b,$,v,w),t.dynCall_viiiiiiiiiiiiiiii=(i,r,a,n,s,o,u,l,d,p,c,h,f,m,g,y,_)=>(t.dynCall_viiiiiiiiiiiiiiii=iU.dynCall_viiiiiiiiiiiiiiii)(i,r,a,n,s,o,u,l,d,p,c,h,f,m,g,y,_),t.dynCall_iif=(i,r,a)=>(t.dynCall_iif=iU.dynCall_iif)(i,r,a),t.dynCall_jiiii=(i,r,a,n,s)=>(t.dynCall_jiiii=iU.dynCall_jiiii)(i,r,a,n,s),t.dynCall_jiii=(i,r,a,n)=>(t.dynCall_jiii=iU.dynCall_jiii)(i,r,a,n),t.dynCall_viif=(i,r,a,n)=>(t.dynCall_viif=iU.dynCall_viif)(i,r,a,n),t.dynCall_viiij=(i,r,a,n,s)=>(t.dynCall_viiij=iU.dynCall_viiij)(i,r,a,n,s),t.dynCall_viiiijii=(i,r,a,n,s,o,u,l)=>(t.dynCall_viiiijii=iU.dynCall_viiiijii)(i,r,a,n,s,o,u,l),t.dynCall_iiiiij=(i,r,a,n,s,o)=>(t.dynCall_iiiiij=iU.dynCall_iiiiij)(i,r,a,n,s,o),t.dynCall_iiiiid=(i,r,a,n,s,o)=>(t.dynCall_iiiiid=iU.dynCall_iiiiid)(i,r,a,n,s,o),t.dynCall_iiiiijj=(i,r,a,n,s,o,u)=>(t.dynCall_iiiiijj=iU.dynCall_iiiiijj)(i,r,a,n,s,o,u),t.dynCall_iiiiiijj=(i,r,a,n,s,o,u,l)=>(t.dynCall_iiiiiijj=iU.dynCall_iiiiiijj)(i,r,a,n,s,o,u,l);var i3=t=>(i3=iU.wb)(t),i4=()=>(i4=iU.xb)(),i6=t=>(i6=iU.yb)(t),i8=()=>(i8=iU.zb)();return function r(){if(0<Z)Q=r;else if(o)i(t),F();else{for(;0<ei.length;)ei.shift()(t);0<Z?Q=r:(t.calledRun=!0,N||(F(),i(t)))}}(),t.PTR_SIZE=4,a},globalThis.self?.name?.startsWith("em-pthread")&&em()}),nl=q(()=>{"use strict";el(),ey=typeof location>"u"?void 0:location.origin,e_=import.meta.url>"file:"&&import.meta.url<"file;",eb=(()=>{if(e_){let t=URL;return new URL(new t("ort.bundle.min.mjs",import.meta.url).href,ey).href}return import.meta.url})(),e$=()=>{if(eb&&!eb.startsWith("blob:"))return eb.substring(0,eb.lastIndexOf("/")+1)},ev=(t,i)=>{try{let r=i??eb;return(r?new URL(t,r):new URL(t)).origin===ey}catch{return!1}},ew=async t=>{let i=await (await fetch(t,{credentials:"same-origin"})).blob();return URL.createObjectURL(i)},ex=async t=>(await import(t)).default,eC=(eh(),L(ed)).default,ek=async()=>{if(!eb)throw Error("Failed to load proxy worker: cannot determine the script source URL.");if(ev(eb))return[void 0,eC()];let t=await ew(eb);return[t,eC(t)]},eS=(nu(),L(ef)).default,eT=async(t,i,r,a)=>{let n=eS&&!(t||i);if(n)if(eb)n=ev(eb);else if(a&&!r)n=!0;else throw Error("cannot determine the script source URL.");if(n)return[void 0,eS];{let a,n,s="ort-wasm-simd-threaded.jsep.mjs",o=t??((t,i)=>{let r=i??eb;try{return(r?new URL(t,r):new URL(t)).href}catch{return}})(s,i),u=r&&o&&!ev(o,i),l=u?await ew(o):o??(a=s,n=i,`${n??"./"}${a}`);return[u?l:void 0,await ex(l)]}}}),nd=q(()=>{"use strict";nl(),eE=!1,ez=!1,eA=!1,eO=async t=>{if(eE)return Promise.resolve();if(ez)throw Error("multiple calls to 'initializeWebAssembly()' detected.");if(eA)throw Error("previous call to 'initializeWebAssembly()' failed.");ez=!0;let i=t.initTimeout,r=t.numThreads;if(!1!==t.simd){if("relaxed"===t.simd){if(!(()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,19,1,17,0,65,1,253,15,65,2,253,15,65,3,253,15,253,147,2,11]))}catch{return!1}})())throw Error("Relaxed WebAssembly SIMD is not supported in the current environment.")}else if(!(()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch{return!1}})())throw Error("WebAssembly SIMD is not supported in the current environment.")}let a=(()=>{if(typeof SharedArrayBuffer>"u")return!1;try{return"u">typeof MessageChannel&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}})();r>1&&!a&&("u">typeof self&&!self.crossOriginIsolated&&console.warn("env.wasm.numThreads is set to "+r+", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."),console.warn("WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."),t.numThreads=r=1);let n=t.wasmPaths,s="string"==typeof n?n:void 0,o=n?.mjs,u=o?.href??o,l=n?.wasm,d=l?.href??l,p=t.wasmBinary,[c,h]=await eT(u,s,r>1,!!p||!!d),f=!1,m=[];if(i>0&&m.push(new Promise(t=>{setTimeout(()=>{f=!0,t()},i)})),m.push(new Promise((t,i)=>{let a={numThreads:r};if(p)a.wasmBinary=p;else if(d||s)a.locateFile=t=>d??s+t;else if(u&&0!==u.indexOf("blob:"))a.locateFile=t=>new URL(t,u).href;else if(c){let t=e$();t&&(a.locateFile=i=>t+i)}h(a).then(i=>{ez=!1,eE=!0,eI=i,t(),c&&URL.revokeObjectURL(c)},t=>{ez=!1,eA=!0,i(t)})})),await Promise.race(m),f)throw Error(`WebAssembly backend initializing failed due to timeout: ${i}ms`)},eR=()=>{if(eE&&eI)return eI;throw Error("WebAssembly is not initialized yet.")}}),np=q(()=>{"use strict";nd(),eB=(t,i)=>{let r=eR(),a=r.lengthBytesUTF8(t)+1,n=r._malloc(a);return r.stringToUTF8(t,n,a),i.push(n),n},eN=(t,i,r,a)=>{if("object"==typeof t&&null!==t){if(r.has(t))throw Error("Circular reference in options");r.add(t)}Object.entries(t).forEach(([t,n])=>{let s=i?i+t:t;if("object"==typeof n)eN(n,s+".",r,a);else if("string"==typeof n||"number"==typeof n)a(s,n.toString());else if("boolean"==typeof n)a(s,n?"1":"0");else throw Error(`Can't handle extra config type: ${typeof n}`)})},eM=t=>{let i=eR(),r=i.stackSave();try{let r=i.PTR_SIZE,a=i.stackAlloc(2*r);i._OrtGetLastError(a,a+r);let n=Number(i.getValue(a,4===r?"i32":"i64")),s=i.getValue(a+r,"*"),o=s?i.UTF8ToString(s):"";throw Error(`${t} ERROR_CODE: ${n}, ERROR_MESSAGE: ${o}`)}finally{i.stackRestore(r)}}}),nc=q(()=>{"use strict";nd(),np(),eD=t=>{let i=eR(),r=0,a=[],n=t||{};try{if(t?.logSeverityLevel===void 0)n.logSeverityLevel=2;else if("number"!=typeof t.logSeverityLevel||!Number.isInteger(t.logSeverityLevel)||t.logSeverityLevel<0||t.logSeverityLevel>4)throw Error(`log severity level is not valid: ${t.logSeverityLevel}`);if(t?.logVerbosityLevel===void 0)n.logVerbosityLevel=0;else if("number"!=typeof t.logVerbosityLevel||!Number.isInteger(t.logVerbosityLevel))throw Error(`log verbosity level is not valid: ${t.logVerbosityLevel}`);t?.terminate===void 0&&(n.terminate=!1);let s=0;return t?.tag!==void 0&&(s=eB(t.tag,a)),r=i._OrtCreateRunOptions(n.logSeverityLevel,n.logVerbosityLevel,!!n.terminate,s),0===r&&eM("Can't create run options."),t?.extra!==void 0&&eN(t.extra,"",new WeakSet,(t,n)=>{let s=eB(t,a),o=eB(n,a);0!==i._OrtAddRunConfigEntry(r,s,o)&&eM(`Can't set a run config entry: ${t} - ${n}.`)}),[r,a]}catch(t){throw 0!==r&&i._OrtReleaseRunOptions(r),a.forEach(t=>i._free(t)),t}}}),nh=q(()=>{"use strict";nd(),np(),eP=(t,i,r,a)=>{let n=eB(i,a),s=eB(r,a);0!==eR()._OrtAddSessionConfigEntry(t,n,s)&&eM(`Can't set a session config entry: ${i} - ${r}.`)},eU=async(t,i,r)=>{for(let a of i){let i="string"==typeof a?a:a.name,n=[];switch(i){case"webnn":if(i="WEBNN","string"!=typeof a){let i=a?.deviceType;i&&eP(t,"deviceType",i,r)}break;case"webgpu":if(i="JS","string"!=typeof a&&a?.preferredLayout){if("NCHW"!==a.preferredLayout&&"NHWC"!==a.preferredLayout)throw Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${a.preferredLayout}`);eP(t,"preferredLayout",a.preferredLayout,r)}break;case"wasm":case"cpu":continue;default:throw Error(`not supported execution provider: ${i}`)}let s=eB(i,r),o=n.length,u=0,l=0;if(o>0){u=eR()._malloc(o*eR().PTR_SIZE),r.push(u),l=eR()._malloc(o*eR().PTR_SIZE),r.push(l);for(let t=0;t<o;t++)eR().setValue(u+t*eR().PTR_SIZE,n[t][0],"*"),eR().setValue(l+t*eR().PTR_SIZE,n[t][1],"*")}await eR()._OrtAppendExecutionProvider(t,s,u,l,o)!==0&&eM(`Can't append execution provider: ${i}.`)}},eq=async t=>{var i;let r,a=eR(),n=0,s=[],o=t||{};(i=o).extra||(i.extra={}),i.extra.session||(i.extra.session={}),(r=i.extra.session).use_ort_model_bytes_directly||(r.use_ort_model_bytes_directly="1"),i.executionProviders&&i.executionProviders.some(t=>("string"==typeof t?t:t.name)==="webgpu")&&(i.enableMemPattern=!1);try{let t=(t=>{switch(t){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"layout":return 3;case"all":return 99;default:throw Error(`unsupported graph optimization level: ${t}`)}})(o.graphOptimizationLevel??"all"),i=(t=>{switch(t){case"sequential":return 0;case"parallel":return 1;default:throw Error(`unsupported execution mode: ${t}`)}})(o.executionMode??"sequential"),r="string"==typeof o.logId?eB(o.logId,s):0,u=o.logSeverityLevel??2;if(!Number.isInteger(u)||u<0||u>4)throw Error(`log severity level is not valid: ${u}`);let l=o.logVerbosityLevel??0;if(!Number.isInteger(l)||l<0||l>4)throw Error(`log verbosity level is not valid: ${l}`);let d="string"==typeof o.optimizedModelFilePath?eB(o.optimizedModelFilePath,s):0;if(n=a._OrtCreateSessionOptions(t,!!o.enableCpuMemArena,!!o.enableMemPattern,i,!!o.enableProfiling,0,r,u,l,d),0===n&&eM("Can't create session options."),o.executionProviders&&await eU(n,o.executionProviders,s),void 0!==o.enableGraphCapture){if("boolean"!=typeof o.enableGraphCapture)throw Error(`enableGraphCapture must be a boolean value: ${o.enableGraphCapture}`);eP(n,"enableGraphCapture",o.enableGraphCapture.toString(),s)}if(o.freeDimensionOverrides)for(let[t,i]of Object.entries(o.freeDimensionOverrides)){if("string"!=typeof t)throw Error(`free dimension override name must be a string: ${t}`);if("number"!=typeof i||!Number.isInteger(i)||i<0)throw Error(`free dimension override value must be a non-negative integer: ${i}`);let r=eB(t,s);0!==a._OrtAddFreeDimensionOverride(n,r,i)&&eM(`Can't set a free dimension override: ${t} - ${i}.`)}return void 0!==o.extra&&eN(o.extra,"",new WeakSet,(t,i)=>{eP(n,t,i,s)}),[n,s]}catch(t){throw 0!==n&&0!==a._OrtReleaseSessionOptions(n)&&eM("Can't release session options."),s.forEach(t=>a._free(t)),t}}}),nf=q(()=>{"use strict";eW=t=>{switch(t){case"int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"uint32":return 12;case"float16":return 10;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int64":return 7;case"uint64":return 13;case"int4":return 22;case"uint4":return 21;default:throw Error(`unsupported data type: ${t}`)}},eL=t=>{switch(t){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:return"uint16";case 6:return"int32";case 12:return"uint32";case 10:return"float16";case 1:return"float32";case 11:return"float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";case 22:return"int4";case 21:return"uint4";default:throw Error(`unsupported data type: ${t}`)}},eV=(t,i)=>{let r=[-1,4,1,1,2,2,4,8,-1,1,2,8,4,8,-1,-1,-1,-1,-1,-1,-1,.5,.5][t],a="number"==typeof i?i:i.reduce((t,i)=>t*i,1);return r>0?Math.ceil(a*r):void 0},eG=t=>{switch(t){case"float16":return"u">typeof Float16Array&&Float16Array.from?Float16Array:Uint16Array;case"float32":return Float32Array;case"uint8":case"bool":return Uint8Array;case"int8":return Int8Array;case"uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:throw Error(`unsupported type: ${t}`)}},ej=t=>{switch(t){case"verbose":return 0;case"info":return 1;case"warning":return 2;case"error":return 3;case"fatal":return 4;default:throw Error(`unsupported logging level: ${t}`)}},eH=t=>"float32"===t||"float16"===t||"int32"===t||"int64"===t||"uint32"===t||"uint8"===t||"bool"===t||"uint4"===t||"int4"===t,eF=t=>"float32"===t||"float16"===t||"int32"===t||"int64"===t||"uint32"===t||"uint64"===t||"int8"===t||"uint8"===t||"bool"===t||"uint4"===t||"int4"===t,eK=t=>{switch(t){case"none":return 0;case"cpu":return 1;case"cpu-pinned":return 2;case"texture":return 3;case"gpu-buffer":return 4;case"ml-tensor":return 5;default:throw Error(`unsupported data location: ${t}`)}}}),nm=q(()=>{"use strict";el(),eZ=async t=>{if("string"!=typeof t)return t instanceof Blob?new Uint8Array(await t.arrayBuffer()):t instanceof Uint8Array?t:new Uint8Array(t);{let i=await fetch(t);if(!i.ok)throw Error(`failed to load external data file: ${t}`);let r=i.headers.get("Content-Length"),a=r?parseInt(r,10):0;if(a<0x40000000)return new Uint8Array(await i.arrayBuffer());{if(!i.body)throw Error(`failed to load external data file: ${t}, no response body.`);let r=i.body.getReader(),n;try{n=new ArrayBuffer(a)}catch(t){if(t instanceof RangeError){let t=Math.ceil(a/65536);n=new WebAssembly.Memory({initial:t,maximum:t}).buffer}else throw t}let s=0;for(;;){let{done:t,value:i}=await r.read();if(t)break;let a=i.byteLength;new Uint8Array(n,s,a).set(i),s+=a}return new Uint8Array(n,0,a)}}}}),ng=q(()=>{"use strict";nf(),eQ=["V","I","W","E","F"],eJ=(t,i)=>{eX=t,eY=i},e0=(...t)=>{eY&&((t,i)=>{var r,a;let n=ej(t);n>=ej(eX)&&(r=n,a="function"==typeof i?i():i,console.log(`[${eQ[r]},${new Date().toISOString()}]${a}`))})(...t)}}),ny=q(()=>{"use strict";e2=class{static calcMatMulShape(t,i){return t[1]!==i[0]?void 0:[t[0],i[1]]}},e1=class{static calcShape(t,i,r=!1){let a=t.length,n=i.length;if(0===a)return i;if(0===n)return t;let s=Math.max(t.length,i.length),o=Array(s);if(r){if(a<2||n<2)return;let r=e2.calcMatMulShape([t[a-2],t[a-1]],[i[n-2],i[n-1]]);if(void 0===r)return;[o[s-2],o[s-1]]=r}for(let u=r?3:1;u<=s;u++){let r=a-u<0?1:t[a-u],l=n-u<0?1:i[n-u];if(r!==l&&r>1&&l>1)return;let d=Math.max(r,l);if(r&&l)o[s-u]=Math.max(r,l);else{if(d>1)return;o[s-u]=0}}return o}static isValidBroadcast(t,i){let r=t.length,a=i.length;if(r>a)return!1;for(let n=1;n<=r;n++)if(1!==t[r-n]&&t[r-n]!==i[a-n])return!1;return!0}},e3=class t{static size(i){return t.getSizeFromDimensionRange(i,0,i.length)}static convertShape(t,i=4){let r=t.length;if(0===r)return[];let a=Array(r),n=r-1;for(;n>=0;){if(t[n]%i==0){a[n]=t[n]/i;break}if(i%t[n]!=0)throw Error("cannot convert shape");a[n]=1,i/=t[n],n--}for(n--;n>=0;n--)a[n]=t[n];return a}static sizeFromDimension(i,r){if(r<0||r>i.length)throw Error(`invalid dimension of ${r} for sizeFromDimension as Tensor has ${i.length} dimensions.`);return t.getSizeFromDimensionRange(i,r,i.length)}static sizeToDimension(i,r){if(r<0||r>i.length)throw Error(`invalid dimension of ${r} for sizeToDimension as Tensor has ${i.length} dimensions.`);return t.getSizeFromDimensionRange(i,0,r)}static getSizeFromDimensionRange(t,i,r){let a=1;for(let n=i;n<r;n++){if(t[n]<0)throw Error("cannot get valid size from specified dimension range. Most likely the range contains negative values in them.");a*=Number(t[n])}return a}static computeStrides(t){let i=t.length;if(0===i)return[];if(1===i)return[1];let r=Array(i);r[i-1]=1,r[i-2]=t[i-1];for(let a=i-3;a>=0;--a)r[a]=r[a+1]*t[a+1];return r}static normalizeAxis(t,i){if(t<-i&&t>=i)throw Error("unsupported axis for this operation.");return t<0?t+i:t}static normalizeAxes(t,i){return t.map(r=>this.normalizeAxis(r,i??t.length))}static sortBasedOnPerm(t,i){return i?i.map(i=>t[i]):t.slice().reverse()}static padShape(t,i){let r=t.length;return t.map((t,a)=>t+i[a]+i[a+r])}static areEqual(t,i){return t.length===i.length&&t.every((t,r)=>t===i[r])}},e4=class t{static adjustPoolAttributes(t,i,r,a,n,s){if(!t&&r.length!==i.length-2)throw Error("length of specified kernel shapes should be 2 less than length of input dimensions");if(t)for(let t=0;t<i.length-2;t++)t>=r.length?r.push(i[t+2]):r[t]=i[t+2];for(let t=0;t<r.length;t++)if(t<a.length){if(a[t]<0)throw Error("strides should be greater than or equal to 1")}else a.push(1);for(let t=0;t<r.length;t++)if(t<n.length){if(n[t]<0)throw Error("dilations should be greater than or equal to 1")}else n.push(1);for(let t=0;t<2*r.length;t++)if(t<s.length){if(s[t]<0)throw Error("pad should be greater than or equal to 1")}else s.push(0);for(let t=0;t<r.length;t++){if(r[t]<=0)throw Error("kernel shapes need to be greater than 0");if(s[t]>=r[t]||s[t+r.length]>=r[t])throw Error("pads should be smaller than kernel")}}static adjustPadsBasedOnAutoPad(i,r,a,n,s,o,u){if(u){if(s.length!==2*(i.length-2))throw Error("length of pads should be twice the length of data dimensions");if(r.length!==i.length-2)throw Error("length of strides should be the length of data dimensions");if(n.length!==i.length-2)throw Error("length of kernel shapes should be the length of data dimensions");for(let l=0;l<i.length-2;l++)t.adjustPadAndReturnShape(i[l+(o?1:2)],r[l],a[l],n[l],s,l,l+i.length-2,u)}}static computePoolOutputShape(i,r,a,n,s,o,u){if(r.length<=0)throw Error("input shape must be of size greater than 0");let l=[r[0],r[1]];return t.computeShapeHelper(i,r,l,a,n,s,o,u),l}static computeConvOutputShape(i,r,a,n,s,o,u){if(i.length<=0||r.length<=0)throw Error("invalid input tensor dims or invalid filter tensor dims");let l=[i[0],r[0]];return t.computeShapeHelper(!1,i,l,a,n,s,o,u),l}static computeShapeHelper(i,r,a,n,s,o,u,l){if(i)for(let t=0;t<r.length-2;t++)a.push(1);else for(let i=0;i<r.length-2;i++)a.push(t.adjustPadAndReturnShape(r[i+2],n[i],s[i],o[i],u,i,i+r.length-2,l))}static adjustPadAndReturnShape(t,i,r,a,n,s,o,u){let l=r*(a-1)+1;if(!u||"NOTSET"===u)return Math.floor((t+n[s]+n[o]-l)/i+1);switch(u){case"VALID":return n[s]=0,n[o]=0,Math.floor((t-l)/i+1);case"SAME_LOWER":case"SAME_UPPER":if(1!==r)throw Error("Dilation not supported for SAME_UPPER or SAME_LOWER");{let r=((t+i-1)/i-1)*i+a-t;return n[s]=Math.floor("SAME_LOWER"===u?(r+1)/2:r/2),n[o]=r-n[s],Math.floor((t+r-a)/i+1)}default:throw Error("Unsupported AutoPad type")}}},e6=class{static getShapeOfGemmResult(t,i,r,a,n){let s,o,u;if(2!==t.length||2!==r.length)throw Error("shape need to be of size 2");i?(s=t[1],o=t[0]):(s=t[0],o=t[1]);let l=-1;if(a?(u=r[0],l=1):(u=r[1],l=0),r[l]!==o)throw Error("dimension mismatch");if(s<=0||u<=0||o<=0)throw Error("invalid shape specified");if(n&&!e1.isValidBroadcast(n,[s,u]))throw Error("gemm: invalid bias shape for broadcast");return[s,u,o]}},e8=-34028234663852886e22,e5=34028234663852886e22}),n_=q(()=>{"use strict";nf(),e9=(t,i)=>new(eG(i))(t)}),nb=q(()=>{"use strict";nf(),ng(),e7=new Map([["float32",32],["float16",16],["int32",32],["uint32",32],["int64",64],["uint64",64],["int8",8],["uint8",8],["int4",4],["uint4",4]]),te=(t,i)=>{if("int32"===i)return t;let r=e7.get(i);if(!r)throw Error(`WebNN backend does not support data type: ${i}`);let a=r/8;if(t.byteLength%a!=0)throw Error(`Invalid Uint8Array length - must be a multiple of ${a}.`);let n=t.byteLength/a,s=new(eG(i))(t.buffer,t.byteOffset,n);switch(i){case"int64":case"uint64":{let t=new Int32Array(n);for(let i=0;i<n;i++){let r=s[i];if(r>2147483647n||r<-2147483648n)throw Error("Can not convert int64 data to int32 - value out of range.");t[i]=Number(r)}return new Uint8Array(t.buffer)}case"int8":case"uint8":case"uint32":if("uint32"===i&&s.some(t=>t>0x7fffffff))throw Error("Can not convert uint32 data to int32 - value out of range.");return new Uint8Array(Int32Array.from(s,Number).buffer);default:throw Error(`Unsupported data conversion from ${i} to 'int32'`)}},tt=(t,i)=>{if("int32"===i)return t;if(t.byteLength%4!=0)throw Error("Invalid Uint8Array length - must be a multiple of 4 (int32).");let r=t.byteLength/4,a=new Int32Array(t.buffer,t.byteOffset,r);switch(i){case"int64":return new Uint8Array(BigInt64Array.from(a,BigInt).buffer);case"uint64":if(a.some(t=>t<0))throw Error("Can not convert int32 data to uin64 - negative value found.");return new Uint8Array(BigUint64Array.from(a,BigInt).buffer);case"int8":if(a.some(t=>t<-128||t>127))throw Error("Can not convert int32 data to int8 - value out of range.");return new Uint8Array(Int8Array.from(a,Number).buffer);case"uint8":if(a.some(t=>t<0||t>255))throw Error("Can not convert int32 data to uint8 - value out of range.");return Uint8Array.from(a,Number);case"uint32":if(a.some(t=>t<0))throw Error("Can not convert int32 data to uint32 - negative value found.");return new Uint8Array(Uint32Array.from(a,Number).buffer);default:throw Error(`Unsupported data conversion from 'int32' to ${i}`)}},ti=1,tr=()=>ti++,ta=new Map([["int8","int32"],["uint8","int32"],["uint32","int32"],["int64","int32"]]),tn=(t,i)=>{let r=e7.get(t);if(!r)throw Error(`WebNN backend does not support data type: ${t}`);return i.length>0?Math.ceil(i.reduce((t,i)=>t*i)*r/8):0},ts=class{constructor(t){this.isDataConverted=!1;let{sessionId:i,context:r,tensor:a,dataType:n,shape:s,fallbackDataType:o}=t;this.sessionId=i,this.mlContext=r,this.mlTensor=a,this.dataType=n,this.tensorShape=s,this.fallbackDataType=o}get tensor(){return this.mlTensor}get type(){return this.dataType}get fallbackType(){return this.fallbackDataType}get shape(){return this.tensorShape}get byteLength(){return tn(this.dataType,this.tensorShape)}destroy(){e0("verbose",()=>"[WebNN] TensorWrapper.destroy"),this.mlTensor.destroy()}write(t){this.mlContext.writeTensor(this.mlTensor,t)}async read(t){if(!this.fallbackDataType)return t?this.mlContext.readTensor(this.mlTensor,t):this.mlContext.readTensor(this.mlTensor);{let i=tt(new Uint8Array(await this.mlContext.readTensor(this.mlTensor)),this.dataType);return t?void(t instanceof ArrayBuffer?new Uint8Array(t):new Uint8Array(t.buffer,t.byteOffset,t.byteLength)).set(i):i.buffer}}canReuseTensor(t,i,r){return this.mlContext===t&&this.dataType===i&&this.tensorShape.length===r.length&&this.tensorShape.every((t,i)=>t===r[i])}setIsDataConverted(t){this.isDataConverted=t}},to=class{constructor(t,i){this.tensorManager=t,this.wrapper=i}get tensorWrapper(){return this.wrapper}releaseTensor(){this.tensorWrapper&&(this.tensorManager.releaseTensor(this.tensorWrapper),this.wrapper=void 0)}async ensureTensor(t,i,r,a){let n=this.tensorManager.getMLContext(t),s;if(!n.opSupportLimits().input.dataTypes.includes(i)){if(!(s=ta.get(i))||!n.opSupportLimits().input.dataTypes.includes(s))throw Error(`WebNN backend does not support data type: ${i}`);e0("verbose",()=>`[WebNN] TensorIdTracker.ensureTensor: fallback dataType from ${i} to ${s}`)}if(this.wrapper){if(this.wrapper.canReuseTensor(n,i,r))return this.wrapper.tensor;if(a){if(this.wrapper.byteLength!==tn(i,r))throw Error("Unable to copy data to tensor with different size.");this.activeUpload=new Uint8Array(await this.wrapper.read())}this.tensorManager.releaseTensor(this.wrapper)}let o=typeof MLTensorUsage>"u"?void 0:MLTensorUsage.READ|MLTensorUsage.WRITE;return this.wrapper=await this.tensorManager.getCachedTensor(t,i,r,o,!0,!0,s),a&&this.activeUpload&&(this.wrapper.write(this.activeUpload),this.activeUpload=void 0),this.wrapper.tensor}upload(t){let i=t;if(this.wrapper){if(this.wrapper.fallbackType)if("int32"===this.wrapper.fallbackType)i=te(t,this.wrapper.type),this.wrapper.setIsDataConverted(!0);else throw Error(`Unsupported fallback data type: ${this.wrapper.fallbackType}`);if(t.byteLength===this.wrapper.byteLength)return void this.wrapper.write(i);e0("verbose",()=>"Data size does not match tensor size. Releasing tensor."),this.releaseTensor()}this.activeUpload?this.activeUpload.set(i):this.activeUpload=new Uint8Array(i)}async download(t){if(this.activeUpload){let i=this.wrapper?.isDataConverted?tt(this.activeUpload,this.wrapper?.type):this.activeUpload;return t?void(t instanceof ArrayBuffer?new Uint8Array(t).set(i):new Uint8Array(t.buffer,t.byteOffset,t.byteLength).set(i)):i.buffer}if(!this.wrapper)throw Error("Tensor has not been created.");return t?this.wrapper.read(t):this.wrapper.read()}},tu=class{constructor(t){this.backend=t,this.tensorTrackersById=new Map,this.freeTensors=[],this.externalTensors=new Set}getMLContext(t){let i=this.backend.getMLContext(t);if(!i)throw Error("MLContext not found for session.");return i}reserveTensorId(){let t=tr();return this.tensorTrackersById.set(t,new to(this)),t}releaseTensorId(t){let i=this.tensorTrackersById.get(t);i&&(this.tensorTrackersById.delete(t),i.tensorWrapper&&this.releaseTensor(i.tensorWrapper))}async ensureTensor(t,i,r,a,n){e0("verbose",()=>`[WebNN] TensorManager.ensureTensor {tensorId: ${i}, dataType: ${r}, shape: ${a}, copyOld: ${n}}`);let s=this.tensorTrackersById.get(i);if(!s)throw Error("Tensor not found.");return s.ensureTensor(t,r,a,n)}upload(t,i){let r=this.tensorTrackersById.get(t);if(!r)throw Error("Tensor not found.");r.upload(i)}async download(t,i){e0("verbose",()=>`[WebNN] TensorManager.download {tensorId: ${t}, dstBuffer: ${i?.byteLength}}`);let r=this.tensorTrackersById.get(t);if(!r)throw Error("Tensor not found.");return r.download(i)}releaseTensorsForSession(t){for(let i of this.freeTensors)i.sessionId===t&&i.destroy();this.freeTensors=this.freeTensors.filter(i=>i.sessionId!==t)}registerTensor(t,i,r,a){let n=this.getMLContext(t),s=tr(),o=new ts({sessionId:t,context:n,tensor:i,dataType:r,shape:a});return this.tensorTrackersById.set(s,new to(this,o)),this.externalTensors.add(o),s}async getCachedTensor(t,i,r,a,n,s,o){let u=this.getMLContext(t);for(let[a,n]of this.freeTensors.entries())if(n.canReuseTensor(u,i,r)){e0("verbose",()=>`[WebNN] Reusing tensor {dataType: ${i}, ${o?`fallbackDataType: ${o},`:""} shape: ${r}`);let n=this.freeTensors.splice(a,1)[0];return n.sessionId=t,n}e0("verbose",()=>`[WebNN] MLContext.createTensor {dataType: ${i}, ${o?`fallbackDataType: ${o},`:""} shape: ${r}}`);let l=await u.createTensor({dataType:o??i,shape:r,dimensions:r,usage:a,writable:n,readable:s});return new ts({sessionId:t,context:u,tensor:l,dataType:i,shape:r,fallbackDataType:o})}releaseTensor(t){this.externalTensors.has(t)&&this.externalTensors.delete(t),this.freeTensors.push(t)}},tl=(...t)=>new tu(...t)}),n$=q(()=>{"use strict";nf(),nd(),n_(),nb(),ng(),td=new Map([[1,"float32"],[10,"float16"],[6,"int32"],[12,"uint32"],[7,"int64"],[13,"uint64"],[22,"int4"],[21,"uint4"],[3,"int8"],[2,"uint8"],[9,"uint8"]]),tp=class{constructor(t){this.tensorManager=tl(this),this.mlContextBySessionId=new Map,this.sessionIdsByMLContext=new Map,this.mlContextCache=[],this.sessionGraphInputs=new Map,this.sessionGraphOutputs=new Map,this.temporaryGraphInputs=[],this.temporaryGraphOutputs=[],this.temporarySessionTensorIds=new Map,eJ(t.logLevel,!!t.debug)}get currentSessionId(){if(void 0===this.activeSessionId)throw Error("No active session");return this.activeSessionId}onRunStart(t){e0("verbose",()=>`[WebNN] onRunStart {sessionId: ${t}}`),this.activeSessionId=t}onRunEnd(t){e0("verbose",()=>`[WebNN] onRunEnd {sessionId: ${t}}`);let i=this.temporarySessionTensorIds.get(t);if(i){for(let t of i)e0("verbose",()=>`[WebNN] releasing temporary tensor {tensorId: ${t}}`),this.tensorManager.releaseTensorId(t);this.temporarySessionTensorIds.delete(t),this.activeSessionId=void 0}}async createMLContext(t){if(t instanceof GPUDevice){let i=this.mlContextCache.findIndex(i=>i.gpuDevice===t);if(-1!==i)return this.mlContextCache[i].mlContext;{let i=await navigator.ml.createContext(t);return this.mlContextCache.push({gpuDevice:t,mlContext:i}),i}}if(void 0===t){let t=this.mlContextCache.findIndex(t=>void 0===t.options&&void 0===t.gpuDevice);if(-1!==t)return this.mlContextCache[t].mlContext;{let t=await navigator.ml.createContext();return this.mlContextCache.push({mlContext:t}),t}}let i=this.mlContextCache.findIndex(i=>((t,i)=>{if(t===i)return!0;if(void 0===t||void 0===i)return!1;let r=Object.keys(t).sort(),a=Object.keys(i).sort();return r.length===a.length&&r.every((r,n)=>r===a[n]&&t[r]===i[r])})(i.options,t));if(-1!==i)return this.mlContextCache[i].mlContext;{let i=await navigator.ml.createContext(t);return this.mlContextCache.push({options:t,mlContext:i}),i}}registerMLContext(t,i){this.mlContextBySessionId.set(t,i);let r=this.sessionIdsByMLContext.get(i);r||(r=new Set,this.sessionIdsByMLContext.set(i,r)),r.add(t),this.temporaryGraphInputs.length>0&&(this.sessionGraphInputs.set(t,this.temporaryGraphInputs),this.temporaryGraphInputs=[]),this.temporaryGraphOutputs.length>0&&(this.sessionGraphOutputs.set(t,this.temporaryGraphOutputs),this.temporaryGraphOutputs=[])}onReleaseSession(t){this.sessionGraphInputs.delete(t),this.sessionGraphOutputs.delete(t);let i=this.mlContextBySessionId.get(t);if(!i)return;this.tensorManager.releaseTensorsForSession(t),this.mlContextBySessionId.delete(t);let r=this.sessionIdsByMLContext.get(i);if(r.delete(t),0===r.size){this.sessionIdsByMLContext.delete(i);let t=this.mlContextCache.findIndex(t=>t.mlContext===i);-1!==t&&this.mlContextCache.splice(t,1)}}getMLContext(t){return this.mlContextBySessionId.get(t)}reserveTensorId(){return this.tensorManager.reserveTensorId()}releaseTensorId(t){e0("verbose",()=>`[WebNN] releaseTensorId {tensorId: ${t}}`),this.tensorManager.releaseTensorId(t)}async ensureTensor(t,i,r,a,n){let s=td.get(r);if(!s)throw Error(`Unsupported ONNX data type: ${r}`);return this.tensorManager.ensureTensor(t??this.currentSessionId,i,s,a,n)}async createTemporaryTensor(t,i,r){e0("verbose",()=>`[WebNN] createTemporaryTensor {onnxDataType: ${i}, shape: ${r}}`);let a=td.get(i);if(!a)throw Error(`Unsupported ONNX data type: ${i}`);let n=this.tensorManager.reserveTensorId();await this.tensorManager.ensureTensor(t,n,a,r,!1);let s=this.temporarySessionTensorIds.get(t);return s?s.push(n):this.temporarySessionTensorIds.set(t,[n]),n}uploadTensor(t,i){if(!eR().shouldTransferToMLTensor)throw Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");e0("verbose",()=>`[WebNN] uploadTensor {tensorId: ${t}, data: ${i.byteLength}}`),this.tensorManager.upload(t,i)}async downloadTensor(t,i){return this.tensorManager.download(t,i)}createMLTensorDownloader(t,i){return async()=>{let r=await this.tensorManager.download(t);return e9(r,i)}}registerMLTensor(t,i,r,a){let n=td.get(r);if(!n)throw Error(`Unsupported ONNX data type: ${r}`);let s=this.tensorManager.registerTensor(t,i,n,a);return e0("verbose",()=>`[WebNN] registerMLTensor {tensor: ${i}, dataType: ${n}, dimensions: ${a}} -> {tensorId: ${s}}`),s}registerMLConstant(t,i,r,a,n,s,o=!1){if(!s)throw Error("External mounted files are not available.");let u=t;t.startsWith("./")&&(u=t.substring(2));let l=s.get(u);if(!l)throw Error(`File with name ${u} not found in preloaded files.`);if(i+r>l.byteLength)throw Error("Out of bounds: data offset and length exceed the external file data size.");let d=l.slice(i,i+r).buffer,p;switch(n.dataType){case"float32":p=new Float32Array(d);break;case"float16":p="u">typeof Float16Array&&Float16Array.from?new Float16Array(d):new Uint16Array(d);break;case"int32":p=new Int32Array(d);break;case"uint32":p=new Uint32Array(d);break;case"int64":o?(p=new Int32Array(te(new Uint8Array(d),"int64").buffer),n.dataType="int32"):p=new BigInt64Array(d);break;case"uint64":p=new BigUint64Array(d);break;case"int8":p=new Int8Array(d);break;case"int4":case"uint4":case"uint8":p=new Uint8Array(d);break;default:throw Error(`Unsupported data type: ${n.dataType} in creating WebNN Constant from external data.`)}return e0("verbose",()=>`[WebNN] registerMLConstant {dataType: ${n.dataType}, shape: ${n.shape}}} ${o?"(Note: it was int64 data type and registered to int32 as workaround)":""}`),a.constant(n,p)}registerGraphInput(t){this.temporaryGraphInputs.push(t)}registerGraphOutput(t){this.temporaryGraphOutputs.push(t)}isGraphInput(t,i){let r=this.sessionGraphInputs.get(t);return!!r&&r.includes(i)}isGraphOutput(t,i){let r=this.sessionGraphOutputs.get(t);return!!r&&r.includes(i)}isGraphInputOutputTypeSupported(t,i,r=!0){let a=this.mlContextBySessionId.get(t),n=td.get(eW(i));return!(typeof n>"u")&&(r?!!a?.opSupportLimits().input.dataTypes.includes(n):!!a?.opSupportLimits().output.dataTypes.includes(n))}flush(){}}}),nv=q(()=>{}),nw=q(()=>{"use strict";ng(),nv(),tc=new Map([[64,250],[128,200],[256,200],[512,200],[2048,230],[4096,200],[8192,50],[16384,50],[32768,50],[65536,50],[131072,50],[262144,50],[524288,50],[1048576,50],[2097152,30],[4194304,20],[8388608,10],[0xc00000,10],[0x1000000,10],[0x1900000,15],[0x2000000,22],[0x2a30000,2],[0x3840000,6],[0x4000000,6],[0x8000000,6],[0xa000000,6]]),th=[],tf=t=>16*Math.ceil(Number(t)/16),tm=1,tg=()=>tm++,ty=async(t,i,r,a)=>{let n=tf(r),s=t.device.createBuffer({size:n,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});try{let o=t.getCommandEncoder();t.endComputePass(),o.copyBufferToBuffer(i,0,s,0,n),t.flush(),await s.mapAsync(GPUMapMode.READ);let u=s.getMappedRange();if(!a)return new Uint8Array(u.slice(0,r));{let t=a();return t.set(new Uint8Array(u,0,r)),t}}finally{s.destroy()}},t_=class{constructor(t){for(let[i]of(this.backend=t,this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.buffersPending=[],this.capturedPendingBuffers=new Map,tc))th.push(i),this.freeBuffers.set(i,[]),this.freeUniformBuffers.set(i,[]);this.sessionCount=0}upload(t,i){let r=i.buffer,a=i.byteOffset,n=i.byteLength,s=tf(n),o=this.storageCache.get(t);if(!o)throw Error("gpu data for uploading does not exist");if(Number(o.originalSize)!==n)throw Error(`inconsistent data size. gpu data size=${o.originalSize}, data size=${n}`);let u=this.backend.device.createBuffer({mappedAtCreation:!0,size:s,usage:GPUBufferUsage.MAP_WRITE|GPUBufferUsage.COPY_SRC});new Uint8Array(u.getMappedRange()).set(new Uint8Array(r,a,n)),u.unmap();let l=this.backend.device.createCommandEncoder();l.copyBufferToBuffer(u,0,o.gpuData.buffer,0,s),this.backend.device.queue.submit([l.finish()]),u.destroy(),e0("verbose",()=>`[WebGPU] GpuDataManager.upload(id=${t})`)}memcpy(t,i){let r=this.storageCache.get(t);if(!r)throw Error("source gpu data for memcpy does not exist");let a=this.storageCache.get(i);if(!a)throw Error("destination gpu data for memcpy does not exist");if(r.originalSize!==a.originalSize)throw Error("inconsistent source and destination gpu data size");let n=tf(r.originalSize),s=this.backend.getCommandEncoder();this.backend.endComputePass(),s.copyBufferToBuffer(r.gpuData.buffer,0,a.gpuData.buffer,0,n)}registerExternalBuffer(t,i,r){let a;if(r){if(a=r[0],t===r[1])return e0("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${i}) => id=${a}, buffer is the same, skip.`),a;if(this.backend.capturedCommandList.has(this.backend.currentSessionId))throw Error(`Registering a different external buffer under graph capture mode is not supported yet.
             Please use the previous external buffer!`)}else a=tg();return this.storageCache.set(a,{gpuData:{id:a,type:0,buffer:t},originalSize:i}),e0("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${i}) => id=${a}, registered.`),a}unregisterExternalBuffer(t){void 0!==t&&(this.storageCache.delete(t),e0("verbose",()=>`[WebGPU] GpuDataManager.unregisterExternalBuffer() => id=${t}`))}create(t,i=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST){let r=(t=>{for(let i=0;i<th.length;i++){let r=th[i];if(t<=r)return r}return 16*Math.ceil(t/16)})(t),a,n=(i&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE,s=(i&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM;if(n||s){let t=(n?this.freeBuffers:this.freeUniformBuffers).get(r);a=t&&t.length>0?t.pop():this.backend.device.createBuffer({size:r,usage:i})}else a=this.backend.device.createBuffer({size:r,usage:i});let o={id:tg(),type:0,buffer:a};return this.storageCache.set(o.id,{gpuData:o,originalSize:Number(t)}),e0("verbose",()=>`[WebGPU] GpuDataManager.create(size=${t}) => id=${o.id}`),o}get(t){return this.storageCache.get(t)?.gpuData}release(t){let i="bigint"==typeof t?Number(t):t,r=this.storageCache.get(i);if(!r){if(0===this.storageCache.size)return 0;throw Error("releasing data does not exist")}return e0("verbose",()=>`[WebGPU] GpuDataManager.release(id=${i}), gpuDataId=${r.gpuData.id}`),this.storageCache.delete(i),this.buffersPending.push(r.gpuData.buffer),r.originalSize}async download(t,i){let r=this.storageCache.get(Number(t));if(!r)throw Error("data does not exist");await ty(this.backend,r.gpuData.buffer,r.originalSize,i)}refreshPendingBuffers(){if(0!==this.buffersPending.length)if("default"===this.backend.sessionStatus){for(let t of this.buffersPending){let i=tc.get(t.size);if((t.usage&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE){let r=this.freeBuffers.get(t.size)||[];void 0===i||r.length>=i?t.destroy():r.push(t)}else if((t.usage&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM){let r=this.freeUniformBuffers.get(t.size)||[];void 0===i||r.length>=i?t.destroy():r.push(t)}else t.destroy()}this.buffersPending=[]}else{let t=this.capturedPendingBuffers.get(this.backend.currentSessionId);for(let i of(t||(t=[],this.capturedPendingBuffers.set(this.backend.currentSessionId,t)),this.buffersPending))t.push(i);this.buffersPending=[]}}dispose(){this.freeBuffers.forEach(t=>{t.forEach(t=>{t.destroy()})}),this.freeUniformBuffers.forEach(t=>{t.forEach(t=>{t.destroy()})}),this.storageCache.forEach(t=>{t.gpuData.buffer.destroy()}),this.capturedPendingBuffers.forEach(t=>{t.forEach(t=>{t.destroy()})}),this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.capturedPendingBuffers=new Map}onCreateSession(){this.sessionCount+=1}onReleaseSession(t){let i=this.capturedPendingBuffers.get(t);i&&(i.forEach(t=>{t.destroy()}),this.capturedPendingBuffers.delete(t)),this.sessionCount-=1,0===this.sessionCount&&(e0("warning",()=>"[WebGPU] Clearing webgpu buffer cache"),this.storageCache.forEach(t=>{t.gpuData.buffer.destroy()}),this.storageCache=new Map)}},tb=(...t)=>new t_(...t)}),nx=q(()=>{"use strict";t$=class{constructor(t){Object.assign(this,t)}get cacheKey(){return this.key||(this.key=Object.getOwnPropertyNames(this).sort().map(t=>`${this[t]}`).join(";")),this.key}},tv=t=>new t$(t)}),nC=q(()=>{"use strict";nf(),ny(),tw=64,tx=(t,i)=>{if(3===i)throw Error("vec3 has same alignment as vec4, use vec4 instead");switch(Number(t)){case 10:return i>1?`vec${i}<f16>`:"f16";case 1:return i>1?`vec${i}<f32>`:"f32";case 6:return i>1?`vec${i}<i32>`:"i32";case 12:return i>1?`vec${i}<u32>`:"u32";case 7:if(i>1)throw Error("currently not supported vecX of uint64 yet");return["vec2<u32>","i32"];case 13:if(i>1)throw Error("currently not supported vecX of uint64 yet");return["vec2<u32>","u32"];case 9:if(4!==i)throw Error("bool must be vec4");return["u32","vec4<bool>"];case 22:return"i32";case 21:return"u32";default:throw Error(`Unknown data type: ${t}`)}},tC=(t,i=1)=>{let r=tx(t,i);return"string"==typeof r?r:r[0]},tk=(t,i=1)=>{let r=tx(t,i);return"string"==typeof r?r:r[1]},tS=(...t)=>{let i=[];return t.forEach(t=>{0!==t.length&&i.push({type:12,data:t},{type:12,data:e3.computeStrides(t)})}),i},tT=t=>t%4==0?4:t%2==0?2:1,tI=(t="f32",i,r="0")=>i&&1!==i?`vec${i}<${t}>(${r})`:`${t}(${r})`,tE=(t,i,r)=>"f32"===t?r:1===i?`f32(${r})`:`vec${i}<f32>(${r})`,tz=(t,i)=>4===i?`(${t}.x + ${t}.y + ${t}.z + ${t}.w)`:2===i?`(${t}.x + ${t}.y)`:3===i?`(${t}.x + ${t}.y + ${t}.z)`:t,tA=(t,i,r,a)=>t.startsWith("uniforms.")&&r>4?"string"==typeof i?"f16"===a?`${t}[(${i}) / 8][(${i}) % 8 / 4][(${i}) % 8 % 4]`:`${t}[(${i}) / 4][(${i}) % 4]`:"f16"===a?`${t}[${Math.floor(i/8)}][${Math.floor(i%8/4)}][${i%8%4}]`:`${t}[${Math.floor(i/4)}][${i%4}]`:r>1?`${t}[${i}]`:t,tO=(t,i,r,a,n)=>{let s,o,u,l,d="number"==typeof r,p=d?r:r.length,c=[...Array(p).keys()],h=p<2?"u32":p<=4?`vec${p}<u32>`:`array<u32, ${p}>`,f=tx(i,n),m="string"==typeof f?f:f[1],g={indices:h,value:m,storage:"string"==typeof f?f:f[0],tensor:i},y=t=>"string"==typeof t?t:`${t}u`,_={offsetToIndices:!1,indicesToOffset:!1,broadcastedIndicesToOffset:!1,set:!1,setByIndices:!1,get:!1,getByIndices:!1},b=d?"uniforms.":"",$=`${b}${t}_shape`,v=`${b}${t}_strides`,w="";for(let t=0;t<p-1;t++)w+=`
    let dim${t} = current / ${tA(v,t,p)};
    let rest${t} = current % ${tA(v,t,p)};
    indices[${t}] = dim${t};
    current = rest${t};
    `;w+=`indices[${p-1}] = current;`;let x=p<2?"":`
  fn o2i_${t}(offset: u32) -> ${g.indices} {
    var indices: ${g.indices};
    var current = offset;
    ${w}
    return indices;
  }`,C=[];if(p>=2)for(let t=p-1;t>=0;t--)C.push(`${tA(v,t,p)} * (indices[${t}])`);let k=p<2?"":`
  fn i2o_${t}(indices: ${g.indices}) -> u32 {
    return ${C.join("+")};
  }`,S=(...t)=>0===p?"0u":`${g.indices}(${t.map(y).join(",")})`,T=(t,i)=>p<2?`${t}`:`${tA(t,i,p)}`,I={},E=(i,r)=>(()=>{if(g.storage===g.value)return`${t}[${i}]=${r};`;if("vec2<u32>"===g.storage&&"i32"===g.value)return`${t}[${i}]=vec2<u32>(u32(${r}), select(0u, 0xFFFFFFFFu, ${r} < 0));`;if("vec2<u32>"===g.storage&&"u32"===g.value)return`${t}[${i}]=vec2<u32>(u32(${r}), 0u);`;if("u32"===g.storage&&"vec4<bool>"===g.value)return`${t}[${i}]=dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(${r}));`;throw Error(`not supported combination of storage type ${g.storage} and value type ${g.value} yet`)})(),z=i=>(()=>{if(g.storage===g.value)return`${t}[${i}]`;if("vec2<u32>"===g.storage&&"i32"===g.value)return`i32(${t}[${i}].x)`;if("vec2<u32>"===g.storage&&"u32"===g.value)return`u32(${t}[${i}].x)`;if("u32"===g.storage&&"vec4<bool>"===g.value)return`vec4<bool>(bool(${t}[${i}] & 0xFFu), bool(${t}[${i}] & 0xFF00u), bool(${t}[${i}] & 0xFF0000u), bool(${t}[${i}] & 0xFF000000u))`;throw Error(`not supported combination of storage type ${g.storage} and value type ${g.value} yet`)})(),A=p<2?"":`
  fn get_${t}ByIndices(indices: ${g.indices}) -> ${m} {
    return ${z(`i2o_${t}(indices)`)};
  }`,O=p<2?"":(s=c.map(t=>`d${t}: u32`).join(", "),o=c.map(t=>`d${t}`).join(", "),`
  fn get_${t}(${s}) -> ${m} {
    return get_${t}ByIndices(${S(o)});
  }`),R=p<2?"":`
  fn set_${t}ByIndices(indices: ${g.indices}, value: ${m}) {
    ${E(`i2o_${t}(indices)`,"value")}
  }`,B=p<2?"":(u=c.map(t=>`d${t}: u32`).join(", "),l=c.map(t=>`d${t}`).join(", "),`
  fn set_${t}(${u}, value: ${m}) {
    set_${t}ByIndices(${S(l)}, value);
  }`);return{impl:()=>{let t=[],i=!1;return _.offsetToIndices&&(t.push(x),i=!0),_.indicesToOffset&&(t.push(k),i=!0),_.broadcastedIndicesToOffset&&(Object.values(I).forEach(i=>t.push(i)),i=!0),_.set&&(t.push(B),i=!0),_.setByIndices&&(t.push(R),i=!0),_.get&&(t.push(O),i=!0),_.getByIndices&&(t.push(A),i=!0),!d&&i&&t.unshift(`const ${$} = ${g.indices}(${r.join(",")});`,`const ${v} = ${g.indices}(${e3.computeStrides(r).join(",")});`),t.join(`
`)},type:g,offsetToIndices:i=>(_.offsetToIndices=!0,p<2?i:`o2i_${t}(${i})`),indicesToOffset:i=>(_.indicesToOffset=!0,p<2?i:`i2o_${t}(${i})`),broadcastedIndicesToOffset:(i,r)=>{_.broadcastedIndicesToOffset=!0;let a=`${r.name}broadcastedIndicesTo${t}Offset`;if(a in I)return`${a}(${i})`;let n=[];for(let t=p-1;t>=0;t--){let i=r.indicesGet("outputIndices",t+r.rank-p);n.push(`${T(v,t)} * (${i} % ${T($,t)})`)}return I[a]=`fn ${a}(outputIndices: ${r.type.indices}) -> u32 {
             return ${n.length>0?n.join("+"):"0u"};
           }`,`${a}(${i})`},indices:S,indicesGet:T,indicesSet:(t,i,r)=>p<2?`${t}=${r};`:`${tA(t,i,p)}=${r};`,set:(...i)=>{if(i.length!==p+1)throw Error(`indices length must be ${p}`);let r=i[p];if("string"!=typeof r)throw Error("value must be string");let a=i.slice(0,p).map(y).join(",");return 0===p?E("0u",r):1===p?E(a[0],r):(_.set=!0,_.setByIndices=!0,_.indicesToOffset=!0,`set_${t}(${a}, ${r})`)},setByOffset:E,setByIndices:(i,r)=>p<2?E(i,r):(_.setByIndices=!0,_.indicesToOffset=!0,`set_${t}ByIndices(${i}, ${r});`),get:(...i)=>{if(i.length!==p)throw Error(`indices length must be ${p}`);let r=i.map(y).join(",");return 0===p?z("0u"):1===p?z(r[0]):(_.get=!0,_.getByIndices=!0,_.indicesToOffset=!0,`get_${t}(${r})`)},getByOffset:z,getByIndices:i=>p<2?z(i):(_.getByIndices=!0,_.indicesToOffset=!0,`get_${t}ByIndices(${i})`),usage:a,name:t,strides:v,shape:$,rank:p}},tR=(t,i,r,a=1)=>tO(t,i,r,"input",a),tB=(t,i,r,a=1)=>tO(t,i,r,"output",a),tN=(t,i,r)=>tO(t,i,r,"atomicOutput",1),tM=(t,i,r,a=1)=>tO(t,i,r,"internal",a),tD=class{constructor(t,i){this.normalizedDispatchGroup=t,this.limits=i,this.internalVariables=[],this.variables=[],this.uniforms=[],this.variableIndex=0}guardAgainstOutOfBoundsWorkgroupSizes(t){return`if (global_idx >= ${"number"==typeof t?`${t}u`:t}) { return; }`}mainStart(t=tw){let i="number"==typeof t?t:t[0],r="number"==typeof t?1:t[1],a="number"==typeof t?1:t[2];if(i>this.limits.maxComputeWorkgroupSizeX||r>this.limits.maxComputeWorkgroupSizeY||a>this.limits.maxComputeWorkgroupSizeZ)throw Error(`workgroup size [${i}, ${r}, ${a}] exceeds the maximum workgroup size [${this.limits.maxComputeWorkgroupSizeX}, ${this.limits.maxComputeWorkgroupSizeY}, ${this.limits.maxComputeWorkgroupSizeZ}].`);if(i*r*a>this.limits.maxComputeInvocationsPerWorkgroup)throw Error(`workgroup size [${i}, ${r}, ${a}] exceeds the maximum workgroup invocations ${this.limits.maxComputeInvocationsPerWorkgroup}.`);let n=1===this.normalizedDispatchGroup[1]&&1===this.normalizedDispatchGroup[2],s=n?`@builtin(global_invocation_id) global_id : vec3<u32>,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(local_invocation_id) local_id : vec3<u32>`:`@builtin(global_invocation_id) global_id : vec3<u32>,
                                             @builtin(local_invocation_id) local_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(num_workgroups) num_workgroups : vec3<u32>`,o=n?`let global_idx = global_id.x;
         let workgroup_index = workgroup_id.x;`:`let workgroup_index = workgroup_id.z * num_workgroups[0] * num_workgroups[1] +
             workgroup_id.y * num_workgroups[0] + workgroup_id.x;
         let global_idx = workgroup_index * ${i*r*a}u + local_idx;`;return`@compute @workgroup_size(${i}, ${r}, ${a})
  fn main(${s}) {
    ${o}
  `}appendVariableUniforms(t){0!==t.rank&&(t.shape.startsWith("uniforms.")&&this.uniforms.push({name:t.shape.replace("uniforms.",""),type:"u32",length:t.rank}),t.strides.startsWith("uniforms.")&&this.uniforms.push({name:t.strides.replace("uniforms.",""),type:"u32",length:t.rank}))}declareVariable(t,i){if("internal"===t.usage)throw Error("cannot use internal variable with declareVariable(). use registerInternalVariables() instead.");this.variables.push(t),this.appendVariableUniforms(t);let r="input"===t.usage?"read":"read_write",a="atomicOutput"===t.usage?"atomic<i32>":t.type.storage;return`@group(0) @binding(${i}) var<storage, ${r}> ${t.name}: array<${a}>;`}declareVariables(...t){return t.map(t=>this.declareVariable(t,this.variableIndex++)).join(`
`)}registerInternalVariable(t){if("internal"!==t.usage)throw Error("cannot use input or output variable with registerInternalVariable(). use declareVariables() instead.");this.internalVariables.push(t),this.appendVariableUniforms(t)}registerInternalVariables(...t){return t.forEach(t=>this.registerInternalVariable(t)),this}registerUniform(t,i,r=1){return this.uniforms.push({name:t,type:i,length:r}),this}registerUniforms(t){return this.uniforms=this.uniforms.concat(t),this}uniformDeclaration(){if(0===this.uniforms.length)return"";let t=[];for(let{name:i,type:r,length:a}of this.uniforms)if(a&&a>4)"f16"===r?t.push(`@align(16) ${i}:array<mat2x4<${r}>, ${Math.ceil(a/8)}>`):t.push(`${i}:array<vec4<${r}>, ${Math.ceil(a/4)}>`);else{let n=null==a||1===a?r:`vec${a}<${r}>`;t.push(`${i}:${n}`)}return`
      struct Uniforms { ${t.join(", ")} };
      @group(0) @binding(${this.variableIndex}) var<uniform> uniforms: Uniforms;`}get additionalImplementations(){return this.uniformDeclaration()+this.variables.map(t=>t.impl()).join(`
`)+this.internalVariables.map(t=>t.impl()).join(`
`)}get variablesInfo(){if(0!==this.uniforms.length)return this.uniforms.map(t=>[[12,10,1,6][["u32","f16","f32","i32"].indexOf(t.type)],t.length??1])}},tP=(t,i)=>new tD(t,i)}),nk=q(()=>{"use strict";nf(),ny(),nx(),nC(),tU=(t,i)=>0!==i.length?i:[...Array(t).keys()].reverse(),tq=(t,i)=>{let r,a,n=t.dataType,s=t.dims.length,o=tU(s,i),u=(r=t.dims,a=o,e3.sortBasedOnPerm(r,tU(r.length,a))),l=t.dims,d=u;if(s<2||((t,i)=>{let r=0;for(let a=0;a<t.length;++a)if(1!==i[t[a]]){if(t[a]<r)return!1;r=t[a]}return!0})(o,t.dims))return{name:"TransposeCopy",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let i=e3.size(u);return{outputs:[{dims:u,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(i/64/4)},programUniforms:[{type:12,data:Math.ceil(i/4)}]}},getShaderSource:t=>{let i=tR("input",n,l,4),r=tB("output",n,d,4);return`
  ${t.registerUniform("output_size","u32").declareVariables(i,r)}
  ${t.mainStart()}
    ${t.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    output[global_idx] = input[global_idx];
  }`}};let{newShape:p,newPerm:c}=((t,i)=>{let r=[],a=[];for(let n=0;n<t.length;++n)1!==t[n]&&r.push(t[n]),1!==t[i[n]]&&a.push(i[n]);return{newShape:r,newPerm:a}})(t.dims,o),h=e3.areEqual(c,[2,3,1]),f=e3.areEqual(c,[3,1,2]);return 2===p.length||h||f?(d=[(l=h?[p[0],p[1]*p[2]]:f?[p[0]*p[1],p[2]]:p)[1],l[0]],{name:"TransposeShared",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let i=e3.size(u);return{outputs:[{dims:u,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(d[1]/16),y:Math.ceil(d[0]/16)},programUniforms:[{type:12,data:i},...tS(l,d)]}},getShaderSource:t=>{let i=tR("a",n,l.length),r=tB("output",n,d.length);return`
  ${t.registerUniform("output_size","u32").declareVariables(i,r)}
  var<workgroup> tile : array<array<${r.type.value}, 17>, 16>;
  ${t.mainStart([16,16,1])}
    let stride = (uniforms.output_shape[1] - 1) / 16 + 1;
    let workgroup_id_x = workgroup_index % stride;
    let workgroup_id_y = workgroup_index / stride;
    let input_col = workgroup_id_y * 16u + local_id.x;
    let input_row = workgroup_id_x * 16u + local_id.y;
    if (input_row < uniforms.a_shape[0] && input_col < uniforms.a_shape[1]) {
      tile[local_id.y][local_id.x] = ${i.getByIndices(`${i.type.indices}(input_row, input_col)`)};
    }
    workgroupBarrier();

    let output_col = workgroup_id_x * 16u + local_id.x;
    let output_row = workgroup_id_y * 16u + local_id.y;
    if (output_row < uniforms.output_shape[0] && output_col < uniforms.output_shape[1]) {
      ${r.setByIndices(`${r.type.indices}(output_row, output_col)`,"tile[local_id.x][local_id.y]")}
    }
  }`}}):{name:"Transpose",shaderCache:{hint:`${i}`,inputDependencies:["rank"]},getRunData:()=>{let i=e3.size(u);return{outputs:[{dims:u,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:[{type:12,data:i},...tS(l,d)]}},getShaderSource:t=>{let i=tR("a",n,l.length),r=tB("output",n,d.length);return`
  ${t.registerUniform("output_size","u32").declareVariables(i,r)}

  ${((t,i,r,a)=>{let n=`fn perm(i: ${a.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`;for(let r=0;r<i;++r)n+=`a[${t[r]}]=i[${r}];`;return n+"return a;}"})(o,s,i,r)}

  ${t.mainStart()}
    ${t.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${r.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${r.setByOffset("global_idx",i.getByIndices("aIndices"))}
  }`}}},tW=(t,i)=>{((t,i)=>{if(!t||1!==t.length)throw Error("Transpose requires 1 input.");if(0!==i.length&&i.length!==t[0].dims.length)throw Error(`perm size ${i.length} does not match input rank ${t[0].dims.length}`)})(t.inputs,i.perm),t.compute(tq(t.inputs[0],i.perm))},tL=t=>tv({perm:t.perm})}),nS=q(()=>{"use strict";nf(),ny(),nC(),nT(),nk(),tV={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate * candidate",logSumExp:"bestValue + exp(candidate)",l1:"bestValue + abs(candidate)",l2:"bestValue + candidate * candidate",logSum:"bestValue + candidate"},tG={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate",logSumExp:"bestValue + candidate",l1:"bestValue + candidate",l2:"bestValue + candidate",logSum:"bestValue + candidate"},tj={max:"_A[offset]",min:"_A[offset]",mean:"0",sum:"0",prod:"1",sumSquare:"0",logSumExp:"0",l1:"0",l2:"0",logSum:"0"},tH={max:"bestValue",min:"bestValue",sum:"bestValue",prod:"bestValue",sumSquare:"bestValue",logSumExp:"log(bestValue)",l1:"bestValue",l2:"sqrt(bestValue)",logSum:"log(bestValue)"},tF=(t,i,r,a)=>{var n,s,o,u,l,d,p;let c,h,f,m,g,y,_,b=1===t.inputs.length?r:t5(t.inputs,r),$=b.axes;0!==$.length||b.noopWithEmptyAxes||($=t.inputs[0].dims.map((t,i)=>i));let v=e3.normalizeAxes($,t.inputs[0].dims.length),w=v,x=t.inputs[0],C=((t,i)=>{let r=[];if(!((t,i)=>{for(let r=0;r<t.length;++r)if(t[t.length-r-1]!==i-1-r)return!1;return!0})(t,i)){for(let a=0;a<i;++a)-1===t.indexOf(a)&&r.push(a);t.forEach(t=>r.push(t))}return r})(w,t.inputs[0].dims.length);C.length>0&&(x=t.compute(tq(t.inputs[0],C),{inputs:[0],outputs:[-1]})[0],w=((t,i)=>{let r=[];for(let a=i-t;a<i;++a)r.push(a);return r})(w.length,x.dims.length));let[k,S]=((t,i)=>{let r=[],a=t.length;for(let n=0;n<a;n++)-1===i.indexOf(n)&&r.push(t[n]);return[r,i.map(i=>t[i])]})(x.dims,w),T=k;b.keepDims&&(T=((t,i)=>{let r=t.length+i.length,a=[],n=0;for(let s=0;s<r;s++)-1===i.indexOf(s)?a.push(t[n++]):a.push(1);return a})(k,v)),t.compute((n=i,s=b.cacheKey,o=[x],u=a,l=t.inputs[0].dataType,d=T,p=S,c=o[0].dims,h=e3.size(d),f=e3.size(p),m=tR("_A",o[0].dataType,c),g=tB("output",l,d),y=64,1===h&&(y=256),_=`
          var<workgroup> aBestValues : array<f32, ${y}>;
       `,{name:n,shaderCache:{hint:`${s};${y}`,inputDependencies:["type"]},getShaderSource:t=>`
        ${t.registerUniform("reduceSize","u32").declareVariables(m,g)}
        ${_}
        fn DIV_CEIL(a : u32, b : u32) -> u32 {
          return ((a - 1u) / b + 1u);
         }
         ${t.mainStart(y)}

          let outputIndex = global_idx / ${y};
          let offset = outputIndex * uniforms.reduceSize;

          var bestValue = f32(${tj[u]});
          let Length = uniforms.reduceSize;
          for (var k = local_idx; k < Length; k = k + ${y}) {
           let candidate = f32(${m.getByOffset("offset + k")});
           bestValue = ${tV[u]};
          }
          aBestValues[local_idx] = bestValue;
          workgroupBarrier();

         var reduceSize = min(Length, ${y}u);
         for (var currentSize = reduceSize / 2u; reduceSize > 1u;
             currentSize = reduceSize / 2u) {
           let interval = DIV_CEIL(reduceSize, 2u);
           if (local_idx < currentSize) {
            let candidate = aBestValues[local_idx + interval];
            bestValue = ${tG[u]};
            aBestValues[local_idx] = bestValue;
           }
           reduceSize = interval;
           workgroupBarrier();
         }

         if (local_idx == 0u) {
          ${g.setByOffset("outputIndex",`${"mean"===u?`${g.type.storage}(bestValue / f32(uniforms.reduceSize))`:`${g.type.storage}(${tH[u]})`}`)};
         }
        }`,getRunData:()=>({outputs:[{dims:d,dataType:l}],dispatchGroup:{x:h},programUniforms:[{type:12,data:f}]})}),{inputs:[x]})},tK=(t,i)=>{tF(t,"ReduceMeanShared",i,"mean")},tZ=(t,i)=>{tF(t,"ReduceL1Shared",i,"l1")},tQ=(t,i)=>{tF(t,"ReduceL2Shared",i,"l2")},tX=(t,i)=>{tF(t,"ReduceLogSumExpShared",i,"logSumExp")},tY=(t,i)=>{tF(t,"ReduceMaxShared",i,"max")},tJ=(t,i)=>{tF(t,"ReduceMinShared",i,"min")},t0=(t,i)=>{tF(t,"ReduceProdShared",i,"prod")},t2=(t,i)=>{tF(t,"ReduceSumShared",i,"sum")},t1=(t,i)=>{tF(t,"ReduceSumSquareShared",i,"sumSquare")},t3=(t,i)=>{tF(t,"ReduceLogSumShared",i,"logSum")}}),nT=q(()=>{"use strict";nf(),ny(),nx(),nC(),nS(),t4=t=>{if(!t||0===t.length||t.length>2)throw Error("Reduce op requires 1 or 2 inputs.");if(2===t.length&&1!==t[1].dims.length)throw Error("Invalid axes input dims.")},t6=t=>["","",`var value = ${t.getByIndices("input_indices")};`,""],t8=(t,i,r,a,n,s,o=!1,u=!1)=>{let l=[],d=r[0].dims,p=d.length,c=e3.normalizeAxes(n,p),h=!u&&0===c.length;d.forEach((t,i)=>{h||c.indexOf(i)>=0?o&&l.push(1):l.push(t)});let f=l.length,m=e3.size(l);return{name:t,shaderCache:i,getShaderSource:t=>{let i=[],n=tR("_A",r[0].dataType,p),u=tB("output",s,f),l=a(n,u,c),m=l[2];for(let t=0,r=0;t<p;t++)h||c.indexOf(t)>=0?(o&&r++,m=`for(var j${t}: u32 = 0; j${t} < ${d[t]}; j${t}++) {
                  ${l[2].includes("last_index")?`let last_index = j${t};`:""}
                  ${n.indicesSet("input_indices",t,`j${t}`)}
                  ${m}
                }`):(i.push(`${n.indicesSet("input_indices",t,u.indicesGet("output_indices",r))};`),r++);return`

        ${t.registerUniform("output_size","u32").declareVariables(n,u)}

        ${t.mainStart()}
          ${t.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          var input_indices: ${n.type.indices};
          let output_indices = ${u.offsetToIndices("global_idx")};

          ${i.join(`
`)}
          ${l[0]}       // init ops for reduce max/min
          ${l[1]}
          ${m}
          ${l[3]}
          ${4===l.length?u.setByOffset("global_idx","value"):l.slice(4).join(`
`)}
        }`},getRunData:()=>({outputs:[{dims:l,dataType:s}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:[{type:12,data:m},...tS(d,l)]})}},t5=(t,i)=>{let r=[];return t[1].dims[0]>0&&t[1].getBigInt64Array().forEach(t=>r.push(Number(t))),tv({axes:r,keepDims:i.keepDims,noopWithEmptyAxes:i.noopWithEmptyAxes})},t9=(t,i,r,a)=>{let n=t.inputs,s=1===n.length?r:t5(n,r);t.compute(t8(i,{hint:s.cacheKey,inputDependencies:["rank"]},[n[0]],s.noopWithEmptyAxes&&0===s.axes.length?t6:a,s.axes,n[0].dataType,s.keepDims,s.noopWithEmptyAxes),{inputs:[0]})},t7=(t,i,r)=>{if(0===i.length)return r;let a=1,n=1;for(let r=0;r<i.length;r++)-1===i.indexOf(r)?a*=t[r]:n*=t[r];return n<32&&a>1024},ie=(t,i)=>{var r,a;t7(t.inputs[0].dims,i.axes,i.noopWithEmptyAxes)?(r=t,a=i,t4(r.inputs),t9(r,"ReduceMean",a,(t,i,a)=>{let n=1;for(let i=0;i<t.rank;i++)(a.indexOf(i)>=0||0===a.length)&&(n*=r.inputs[0].dims[i]);return["var sum = f32(0);","",`sum += f32(${t.getByIndices("input_indices")});`,`let value = ${i.type.value}(sum / ${n});`]})):tK(t,i)},it=(t,i)=>{var r,a;t7(t.inputs[0].dims,i.axes,i.noopWithEmptyAxes)?(r=t,a=i,t4(r.inputs),t9(r,"ReduceL1",a,(t,i)=>[`var value = ${i.type.storage}(0);`,"",`value += abs(${t.getByIndices("input_indices")});`,""])):tZ(t,i)},ii=(t,i)=>{var r,a;t7(t.inputs[0].dims,i.axes,i.noopWithEmptyAxes)?(r=t,a=i,t4(r.inputs),t9(r,"ReduceL2",a,(t,i)=>[`var t = ${i.type.value}(0); var value = ${i.type.value}(0);`,"",`t = ${t.getByIndices("input_indices")}; value += (t * t);`,"value = sqrt(value);"])):tQ(t,i)},ir=(t,i)=>{var r,a;t7(t.inputs[0].dims,i.axes,i.noopWithEmptyAxes)?(r=t,a=i,t4(r.inputs),t9(r,"ReduceLogSumExp",a,(t,i)=>[`var value = ${i.type.storage}(0);`,"",`value += exp(${t.getByIndices("input_indices")});`,"value = log(value);"])):tX(t,i)},ia=(t,i)=>{var r,a;t7(t.inputs[0].dims,i.axes,i.noopWithEmptyAxes)?(r=t,a=i,t4(r.inputs),t9(r,"ReduceMax",a,(t,i,r)=>{let a=[];for(let i=0;i<t.rank;i++)(r.indexOf(i)>=0||0===r.length)&&a.push(t.indicesSet("input_indices",i,0));return[`${a.join(`
`)}`,`var value = ${t.getByIndices("input_indices")};`,`value = max(value, ${t.getByIndices("input_indices")});`,""]})):tY(t,i)},is=(t,i)=>{var r,a;t7(t.inputs[0].dims,i.axes,i.noopWithEmptyAxes)?(r=t,a=i,t4(r.inputs),t9(r,"ReduceMin",a,(t,i,r)=>{let a=[];for(let i=0;i<t.rank;i++)(r.indexOf(i)>=0||0===r.length)&&a.push(`input_indices[${i}] = 0;`);return[`${a.join(`
`)}`,`var value = ${t.getByIndices("input_indices")};`,`value = min(value, ${t.getByIndices("input_indices")});`,""]})):tJ(t,i)},io=(t,i)=>{var r,a;t7(t.inputs[0].dims,i.axes,i.noopWithEmptyAxes)?(r=t,a=i,t4(r.inputs),t9(r,"ReduceProd",a,(t,i)=>[`var value = ${i.type.storage}(1);`,"",`value *= ${t.getByIndices("input_indices")};`,""])):t0(t,i)},iu=(t,i)=>{var r,a;t7(t.inputs[0].dims,i.axes,i.noopWithEmptyAxes)?(r=t,a=i,t4(r.inputs),t9(r,"ReduceSum",a,(t,i)=>[`var value = ${i.type.storage}(0);`,"",`value += ${t.getByIndices("input_indices")};`,""])):t2(t,i)},il=(t,i)=>{var r,a;t7(t.inputs[0].dims,i.axes,i.noopWithEmptyAxes)?(r=t,a=i,t4(r.inputs),t9(r,"ReduceSumSquare",a,(t,i)=>[`var t = ${i.type.value}(0); var value = ${i.type.value}(0);`,"",`t = ${t.getByIndices("input_indices")}; value += t * t;`,""])):t1(t,i)},id=(t,i)=>{var r,a;t7(t.inputs[0].dims,i.axes,i.noopWithEmptyAxes)?(r=t,a=i,t4(r.inputs),t9(r,"ReduceLogSum",a,(t,i)=>[`var value = ${i.type.storage}(0);`,"",`value += ${t.getByIndices("input_indices")};`,"value = log(value);"])):t3(t,i)}}),nI=q(()=>{"use strict";nf(),nx(),nT(),ip=t=>{if(!t||0===t.length||t.length>2)throw Error("ArgMinMaxOp op requires 1 or 2 inputs.");if(1!==t[0].dataType)throw Error("Invalid input type.")},ic=(t,i)=>{ip(t.inputs),t.compute(t8("ArgMin",{hint:i.cacheKey,inputDependencies:["rank"]},[t.inputs[0]],(t,r,a)=>{let n=[];for(let i=0;i<t.rank;i++)(a.indexOf(i)>=0||0===a.length)&&n.push(`input_indices[${i}] = 0;`);return[`${n.join(`
`)}`,`var value = ${t.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${t.getByIndices("input_indices")} ${i.selectLastIndex>0?"<=":"<"} value) {
         value = ${t.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",r.setByOffset("global_idx","best_index")]},[i.axis],7,i.keepDims),{inputs:[0]})},ih=(t,i)=>{ip(t.inputs),t.compute(t8("argMax",{hint:i.cacheKey,inputDependencies:["rank"]},[t.inputs[0]],(t,r,a)=>{let n=[];for(let i=0;i<t.rank;i++)(a.indexOf(i)>=0||0===a.length)&&n.push(`input_indices[${i}] = 0;`);return[`${n.join(`
`)}`,`var value = ${t.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${t.getByIndices("input_indices")} ${i.selectLastIndex>0?">=":">"} value) {
         value = ${t.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",r.setByOffset("global_idx","best_index")]},[i.axis],7,i.keepDims),{inputs:[0]})},im=t=>tv(t)}),nE=q(()=>{"use strict";nf(),ny(),nv(),nC(),ig=(t,i,r)=>i&&t?`
      let total_sequence_length_input = u32(${i.getByOffset("0")});
      let present_sequence_length = max(total_sequence_length_input, uniforms.past_sequence_length);
      let is_subsequent_prompt: bool = sequence_length > 1 && sequence_length != total_sequence_length_input;
      let is_first_prompt: bool = is_subsequent_prompt == false && sequence_length == total_sequence_length_input;
      total_sequence_length = u32(${t?.getByOffset("batchIdx")}) + 1;
      var past_sequence_length: u32 = 0;
      if (is_first_prompt == false) {
        past_sequence_length = total_sequence_length - sequence_length;
      }
       `:`
    ${r?"let past_sequence_length = uniforms.past_sequence_length":""};
    let present_sequence_length = total_sequence_length;
    `,iy=(t,i,r,a,n,s,o,u,l,d,p,c)=>{var h,f,m,g,y,_,b,$,v,w,x,C,k,S,T,I,E,z,A,O,R,B,N,M,D;let P,U,q,W,L,V,G,j,H,F,K,Z,Q,X,Y,J,ee,et,ei,er,ea,en,es,eo,eu,el,ed,ep,ec,eh,ef,em,eg,ey=Math.min(t.outputCount,1+ +!!o+ +!!u),e_=ey>1?d.pastSequenceLength:0,eb=e_+d.kvSequenceLength,e$=l&&e3.size(l.dims)>0?l:void 0,ev=[i,r];ey>1&&o&&e3.size(o.dims)>0&&ev.push(o),e$&&ev.push(e$),p&&ev.push(p),c&&ev.push(c);let ew=t.compute((h=ey,f=i,m=r,g=o,y=e$,_=d,b=e_,$=p,v=c,P=b+_.kvSequenceLength,U=[_.batchSize,_.numHeads,_.sequenceLength,P],q=h>1&&g,W=_.kvNumHeads?_.kvNumHeads:_.numHeads,L=q?[_.batchSize,W,P,_.headSize]:void 0,V=_.nReps?_.nReps:1,G=0===_.scale?1/Math.sqrt(_.headSize):_.scale,j=tT(_.headSize),H=_.headSize/j,F={x:Math.ceil(P/12),y:Math.ceil(_.sequenceLength/12),z:_.batchSize*_.numHeads},K=[{type:12,data:_.sequenceLength},{type:12,data:H},{type:12,data:P},{type:12,data:_.numHeads},{type:12,data:_.headSize},{type:1,data:G},{type:12,data:b},{type:12,data:_.kvSequenceLength},{type:12,data:V}],Z=q&&g&&e3.size(g.dims)>0,Q=["type","type"],Z&&Q.push("type"),y&&Q.push("type"),$&&Q.push("type"),v&&Q.push("type"),X=[{dims:U,dataType:f.dataType,gpuDataType:0}],q&&X.push({dims:L,dataType:f.dataType,gpuDataType:0}),{name:"AttentionProbs",shaderCache:{hint:`${j};${void 0!==y};${void 0!==g};${h}`,inputDependencies:Q},getRunData:()=>({outputs:X,dispatchGroup:F,programUniforms:K}),getShaderSource:t=>{let i=tR("q",f.dataType,f.dims,j),r=[i,tR("key",m.dataType,m.dims,j)];if(Z){let t=tR("past_key",g.dataType,g.dims,j);r.push(t)}y&&r.push(tR("attention_bias",y.dataType,y.dims));let a=$?tR("seq_lens",$.dataType,$.dims):void 0;a&&r.push(a);let n=v?tR("total_sequence_length_input",v.dataType,v.dims):void 0;n&&r.push(n);let s=tB("output",f.dataType,U),o=[s];q&&o.push(tB("present_key",f.dataType,L,j));let u=tk(1,j);return`
  const TILE_SIZE = 12u;

  var<workgroup> tileQ: array<${i.type.storage}, 144>;
  var<workgroup> tileK: array<${i.type.storage}, 144>;
  ${t.registerUniforms([{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"alpha",type:"f32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}]).declareVariables(...r,...o)}
  ${t.mainStart([12,12,1])}
    // x holds the N and y holds the M
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let kvHeadIdx = ${1===V?"headIdx":"headIdx / uniforms.n_reps"};
    let kv_num_heads = ${1===V?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let m = workgroup_id.y * TILE_SIZE;
    let n = workgroup_id.x * TILE_SIZE;
    let sequence_length = uniforms.M;
    var total_sequence_length = uniforms.N;
    ${ig(a,n,!0)}
    let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx;
    let qOffset = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
    ${Z&&q?"let pastKeyOffset = absKvHeadIdx * uniforms.past_sequence_length * uniforms.K;":""};
    let kOffset = absKvHeadIdx * uniforms.kv_sequence_length * uniforms.K;
    ${q?"let presentKeyOffset = absKvHeadIdx * uniforms.N * uniforms.K;":""}
    var value = ${u}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (global_id.y < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = q[qOffset + local_id.y * uniforms.K + w + local_id.x];
      }
      if (n + local_id.y < uniforms.N && w + local_id.x < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
      ${Z&&q?`
              if (n + local_id.y < past_sequence_length) {
                tileK[idx] = past_key[pastKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
              } else if (n + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
                tileK[idx] = key[kOffset + (n + local_id.y - past_sequence_length) * uniforms.K + w + local_id.x];
              }`:`
          if (n + local_id.y < uniforms.kv_sequence_length) {
            tileK[idx] = key[kOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
          }`}
      ${q?`if (n + local_id.y < present_sequence_length) {
        present_key[presentKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x] = tileK[idx];
      }`:""}
      }
      workgroupBarrier();

      for (var k: u32 = 0u; k < TILE_SIZE && w+k < uniforms.K; k++) {
          value += ${u}(tileQ[TILE_SIZE * local_id.y + k] * tileK[TILE_SIZE * local_id.x + k]);
      }

      workgroupBarrier();
    }

    if (global_id.y < uniforms.M && global_id.x < total_sequence_length) {
      let headOffset = workgroup_id.z * uniforms.M * uniforms.N;
      let outputIdx = headOffset + global_id.y * uniforms.N + global_id.x;
      var sum: f32 = ${(()=>{switch(j){case 1:return"value";case 2:return"value.x + value.y";case 4:return"value.x + value.y + value.z + value.w";default:throw Error(`Unsupported components: ${j}`)}})()};
        output[outputIdx] = ${s.type.value} (sum * uniforms.alpha) + ${y?"attention_bias[outputIdx]":"0.0"};
    }
  }`}}),{inputs:ev,outputs:ey>1?[-1,1]:[-1]})[0];t.compute((w=ew,x=d.batchSize,C=d.numHeads,k=e_,S=d.sequenceLength,T=eb,I=p,E=c,Y=tT(I?1:T),J=64,(ee=T/Y)<64&&(J=32),et=[{type:12,data:x},{type:12,data:C},{type:12,data:k},{type:12,data:S},{type:12,data:ee},{type:12,data:Math.ceil(T/Y/J)}],ei=tC(w.dataType,Y),er=tk(1,Y),ea=["type"],I&&ea.push("type"),E&&ea.push("type"),{name:"AttentionProbsSoftmax",shaderCache:{hint:`${J};${ei};${Y}`,inputDependencies:ea},getShaderSource:t=>{let i=tB("x",w.dataType,w.dims,Y),r=[i],a=I?tR("seq_lens",I.dataType,I.dims):void 0;a&&r.push(a);let n=E?tR("total_sequence_length_input",E.dataType,E.dims):void 0;n&&r.push(n);let s=tk(w.dataType);return`
  var<workgroup> thread_max: array<f32, ${J}>;
  var<workgroup> thread_sum: array<f32, ${J}>;
  ${t.registerUniforms([{name:"batch_size",type:"u32"},{name:"num_heads",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"sequence_length",type:"u32"},{name:"total_sequence_length",type:"u32"},{name:"elements_per_thread",type:"u32"}]).declareVariables(...r)}
  ${t.mainStart([J,1,1])}
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let sequence_length = uniforms.sequence_length;
    var total_sequence_length = uniforms.total_sequence_length;
    ${ig(a,n,!1)}
    let local_offset = local_idx * uniforms.elements_per_thread;
    let offset = (global_idx / ${J}) * uniforms.total_sequence_length + local_offset;
    let seq_causal_length = ${I?"u32(past_sequence_length + workgroup_id.y + 1)":"total_sequence_length"};
    var thread_max_vector = ${er}(-3.402823e+38f);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      thread_max_vector = max(${er}(x[offset + i]), thread_max_vector);
    }
    thread_max[local_idx] = ${(()=>{switch(Y){case 1:return"thread_max_vector";case 2:return"max(thread_max_vector.x, thread_max_vector.y)";case 4:return"max(max(thread_max_vector.x, thread_max_vector.y), max(thread_max_vector.z, thread_max_vector.w))";default:throw Error(`Unsupported components: ${Y}`)}})()};
    workgroupBarrier();

    var max_value =  f32(-3.402823e+38f);
    for (var i = 0u; i < ${J}; i++) {
      max_value = max(thread_max[i], max_value);
    }

    var sum_vector = ${er}(0);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      sum_vector += exp(${er}(x[offset + i]) - max_value);
    }
    thread_sum[local_idx] = ${(()=>{switch(Y){case 1:return"sum_vector";case 2:return"sum_vector.x + sum_vector.y";case 4:return"sum_vector.x + sum_vector.y + sum_vector.z + sum_vector.w";default:throw Error(`Unsupported components: ${Y}`)}})()};
    workgroupBarrier();

    var sum: f32 = 0;
    for (var i = 0u; i < ${J}; i++) {
      sum += thread_sum[i];
    }

    if (sum == 0) {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        x[offset + i] = ${i.type.value}(${s}(1.0) / ${s}(seq_causal_length));
      }
    } else {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        var f32input = ${er}(x[offset + i]);
        x[offset + i] = ${i.type.value}(exp(f32input - max_value) / sum);
      }
    }
      ${I?`
        for (var total_seq_id: u32 = seq_causal_length; total_seq_id + local_offset < uniforms.total_sequence_length; total_seq_id++) {
          x[offset + total_seq_id] = ${i.type.value}(${s}(0));
        }`:""};
  }`},getRunData:()=>({outputs:[],dispatchGroup:{x:1,y:S,z:x*C},programUniforms:et})}),{inputs:p&&c?[ew,p,c]:[ew],outputs:[]});let ex=[ew,a];ey>1&&u&&e3.size(u.dims)>0&&ex.push(u),p&&ex.push(p),c&&ex.push(c),t.compute((z=ey,A=ew,O=a,R=u,B=d,N=e_,M=p,D=c,en=N+B.kvSequenceLength,es=B.nReps?B.nReps:1,eo=B.vHiddenSize*es,eu=z>1&&R,el=B.kvNumHeads?B.kvNumHeads:B.numHeads,ed=eu?[B.batchSize,el,en,B.headSize]:void 0,ep=[B.batchSize,B.sequenceLength,eo],ec={x:Math.ceil(B.vHeadSize/12),y:Math.ceil(B.sequenceLength/12),z:B.batchSize*B.numHeads},eh=[{type:12,data:B.sequenceLength},{type:12,data:en},{type:12,data:B.vHeadSize},{type:12,data:B.numHeads},{type:12,data:B.headSize},{type:12,data:eo},{type:12,data:N},{type:12,data:B.kvSequenceLength},{type:12,data:es}],ef=eu&&R&&e3.size(R.dims)>0,em=["type","type"],ef&&em.push("type"),M&&em.push("type"),D&&em.push("type"),eg=[{dims:ep,dataType:A.dataType,gpuDataType:0}],eu&&eg.push({dims:ed,dataType:A.dataType,gpuDataType:0}),{name:"AttentionScore",shaderCache:{hint:`${void 0!==R};${z}`,inputDependencies:em},getRunData:()=>({outputs:eg,dispatchGroup:ec,programUniforms:eh}),getShaderSource:t=>{let i=tR("probs",A.dataType,A.dims),r=[i,tR("v",O.dataType,O.dims)];ef&&r.push(tR("past_value",R.dataType,R.dims));let a=M?tR("seq_lens",M.dataType,M.dims):void 0;M&&r.push(a);let n=D?tR("total_sequence_length_input",D.dataType,D.dims):void 0;D&&r.push(n);let s=[tB("output",A.dataType,ep)];return eu&&s.push(tB("present_value",A.dataType,ed)),`
  const TILE_SIZE = 12u;
  var<workgroup> tileQ: array<${i.type.value}, 144>;
  var<workgroup> tileV: array<${i.type.value}, 144>;
  ${t.registerUniforms([{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"v_hidden_size",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}]).declareVariables(...r,...s)}
  ${t.mainStart([12,12,1])}
   let headIdx = workgroup_id.z % uniforms.num_heads;
   let batchIdx = workgroup_id.z / uniforms.num_heads;
   let kvHeadIdx = ${1===es?"headIdx":"headIdx / uniforms.n_reps"};
   let kv_num_heads = ${1===es?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
   let m = global_id.y;
   let n = global_id.x;
   let sequence_length = uniforms.M;
   var total_sequence_length = uniforms.K;
   ${ig(a,n,!0)}
   let offsetA = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
   let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx; // kvHeadIdx is relative to the batch
   ${ef&&eu?"let pastValueOffset = absKvHeadIdx * uniforms.N * uniforms.past_sequence_length + n;":""};
   let vOffset = absKvHeadIdx * uniforms.N * uniforms.kv_sequence_length + n;
   ${eu?"let presentValueOffset = absKvHeadIdx * uniforms.N * uniforms.K + n;":""}
   var value = ${i.type.storage}(0);
   for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = probs[offsetA + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
        ${ef&&eu?`
        if (w + local_id.y < past_sequence_length) {
          tileV[idx] = past_value[pastValueOffset + (w + local_id.y) * uniforms.N];
        } else if (w + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
          tileV[idx] = v[vOffset + (w + local_id.y - past_sequence_length) * uniforms.N];
        }
      `:`
            if (w + local_id.y < uniforms.kv_sequence_length) {
              tileV[idx] = v[vOffset + (w + local_id.y) * uniforms.N];
            }`}
        ${eu?`
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
  }`}}),{inputs:ex,outputs:ey>1?[0,2]:[0]})},i_=(t,i)=>{var r,a;let n,s,o,u,l,d,p,c=((t,i)=>{let r=t[0],a=t[1],n=t[2],s=t[3],o=t[4],u=t[5];if(o&&u)throw Error("Attention cannot have both past and attention_bias");if(3!==r.dims.length)throw Error('Input "input" must have 3 dimensions');let l=r.dims[0],d=r.dims[1],p=r.dims[2];if(1!==n.dims.length)throw Error('Input "bias" is expected to have 1 dimensions');if(2!==a.dims.length)throw Error('Input "weights" is expected to have 2 dimensions');if(a.dims[0]!==p)throw Error("Input 1 dimension 0 should have same length as dimension 2 of input 0");if(n.dims[0]!==a.dims[1])throw Error('Input "bias" dimension 0 should have same length as dimension 1 of input "weights"');let c=n.dims[0]/3,h=c,f=h;if(i.qkvHiddenSizes.length>0){if(3!==i.qkvHiddenSizes.length)throw Error("qkv_hidden_sizes attribute should have 3 elements");for(let t of i.qkvHiddenSizes)if(t%i.numHeads!=0)throw Error("qkv_hidden_sizes should be divisible by num_heads");c=i.qkvHiddenSizes[0],h=i.qkvHiddenSizes[1],f=i.qkvHiddenSizes[2]}if(c!==h)throw Error("qkv_hidden_sizes first element should be same as the second");if(n.dims[0]!==c+h+f)throw Error('Input "bias" dimension 0 should have same length as sum of Q/K/V hidden sizes');let m=0;if(o){if(h!==f)throw Error('Input "past" expect k_hidden_size == v_hidden_size');if(5!==o.dims.length)throw Error('Input "past" must have 5 dimensions');if(2!==o.dims[0])throw Error('Input "past" first dimension must be 2');if(o.dims[1]!==l)throw Error('Input "past" second dimension must be batch_size');if(o.dims[2]!==i.numHeads)throw Error('Input "past" third dimension must be num_heads');if(o.dims[4]!==h/i.numHeads)throw Error('Input "past" fifth dimension must be k_hidden_size / num_heads');i.pastPresentShareBuffer||(m=o.dims[3])}let g=d+m;if(s)throw Error("Mask not supported");if(o)throw Error("past is not supported");if(u){if(4!==u.dims.length)throw Error('Input "attention_bias" must have 4 dimensions');if(u.dims[0]!==l||u.dims[1]!==i.numHeads||u.dims[2]!==d||u.dims[3]!==g)throw Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:l,sequenceLength:d,pastSequenceLength:m,kvSequenceLength:d,totalSequenceLength:g,maxSequenceLength:-1,inputHiddenSize:p,hiddenSize:c,vHiddenSize:f,headSize:Math.floor(c/i.numHeads),vHeadSize:Math.floor(f/i.numHeads),numHeads:i.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:i.maskFilterValue,maskType:0,scale:i.scale,broadcastResPosBias:!1,passPastInKv:!1,qkvFormat:1}})(t.inputs,i),[h,f,m]=(r=t,n=[(a=c).batchSize,a.numHeads,a.sequenceLength,a.headSize],s=a.sequenceLength,o=a.inputHiddenSize,u=a.headSize,l={x:Math.ceil(a.headSize/12),y:Math.ceil(a.sequenceLength/12),z:a.batchSize*a.numHeads},d=[r.inputs[0],r.inputs[1],r.inputs[2]],p=[{type:12,data:s},{type:12,data:o},{type:12,data:u},{type:12,data:a.numHeads},{type:12,data:a.headSize},{type:12,data:a.hiddenSize},{type:12,data:a.hiddenSize+a.hiddenSize+a.vHiddenSize}],r.compute({name:"AttentionPrepare",shaderCache:{inputDependencies:["type","type","type"]},getRunData:()=>({outputs:[{dims:n,dataType:r.inputs[0].dataType,gpuDataType:0},{dims:n,dataType:r.inputs[0].dataType,gpuDataType:0},{dims:n,dataType:r.inputs[0].dataType,gpuDataType:0}],dispatchGroup:l,programUniforms:p}),getShaderSource:t=>{let i=tB("output_q",d[0].dataType,n),r=tB("output_k",d[0].dataType,n),a=tB("output_v",d[0].dataType,n),s=tR("input",d[0].dataType,d[0].dims),o=tR("weight",d[1].dataType,d[1].dims),u=tR("bias",d[2].dataType,d[2].dims),l=s.type.storage;return`
  const TILE_SIZE = 12u;
  var<workgroup> tileInput: array<${l}, 144>;
  var<workgroup> tileWeightQ: array<${l}, 144>;
  var<workgroup> tileWeightK: array<${l}, 144>;
  var<workgroup> tileWeightV: array<${l}, 144>;
  ${t.registerUniforms([{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"hidden_size",type:"u32"},{name:"ldb",type:"u32"}]).declareVariables(s,o,u,i,r,a)}
  ${t.mainStart([12,12,1])}
    let batchIndex = workgroup_id.z / uniforms.num_heads;
    let headNumber = workgroup_id.z % uniforms.num_heads;
    let m = global_id.y;
    let n = global_id.x;

    let inputOffset = batchIndex * (uniforms.M * uniforms.K) + m * uniforms.K;
    let biasOffsetQ = headNumber * uniforms.head_size;
    let biasOffsetK = uniforms.hidden_size + biasOffsetQ;
    let biasOffsetV = uniforms.hidden_size + biasOffsetK;

    var valueQ = ${l}(0);
    var valueK = ${l}(0);
    var valueV = ${l}(0);
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
  }`}},{inputs:d,outputs:[-1,-1,-1]}));return iy(t,h,f,m,t.inputs[4],void 0,void 0,void 0,t.inputs[5],c)}}),nz=q(()=>{"use strict";eu(),nf(),ny(),nx(),nC(),ib=(t,i)=>{let r,{inputs:a,outputCount:n}=t,s=(r={...i,outputCount:n},tv(r));if(f.webgpu.validateInputContent&&((t,i)=>{if(!t||5!==t.length)throw Error("BatchNormalization requires 5 inputs");let r=(t,i,r)=>{let a=i.length;if(a!==t.length)throw Error(`${r}: num dimensions != ${a}`);i.forEach((i,a)=>{if(i!==t[a])throw Error(`${r}: dim[${a}] do not match`)})};if(t[0].dims.length>1){let a="NHWC"===i.format?i.spatial?t[0].dims.slice(-1):t[0].dims.slice(-1).concat(t[0].dims.slice(1,t[0].dims.length-1)):t[0].dims.slice(1,i.spatial?2:void 0);r(t[1].dims,a,"Invalid input scale"),r(t[2].dims,a,"Invalid input B"),r(t[3].dims,a,"Invalid input mean"),r(t[4].dims,a,"Invalid input var")}else r(t[1].dims,[1],"Invalid input scale"),r(t[2].dims,[1],"Invalid input B"),r(t[3].dims,[1],"Invalid input mean"),r(t[4].dims,[1],"Invalid input var")})(a,s),i.trainingMode)throw Error("BatchNormalization trainingMode is not supported yet.");t.compute(((t,i)=>{let{epsilon:r,spatial:a,format:n}=i,s=t[0].dims,o=a?tT(s[s.length-1]):1,u="NHWC"===n&&s.length>1?o:1,l=e3.size(s)/o,d=a?s.length:s,p=tR("x",t[0].dataType,t[0].dims,o),c=tR("scale",t[1].dataType,t[1].dims,u),h=tR("bias",t[2].dataType,t[2].dims,u),f=tR("inputMean",t[3].dataType,t[3].dims,u),m=tR("inputVar",t[4].dataType,t[4].dims,u),g=tB("y",t[0].dataType,d,o);return{name:"BatchNormalization",shaderCache:{hint:`${i.epsilon}_${i.format}_${a}_${o}`,inputDependencies:a?["rank","type","type","type","type"]:void 0},getShaderSource:t=>`
  const epsilon = ${r};
  ${t.registerUniform("outputSize","u32").declareVariables(p,c,h,f,m,g)}
  ${t.mainStart()}
  ${t.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
    var outputIndices = ${g.offsetToIndices(`global_idx * ${o}`)};
    ${(()=>{let t="";if(a)t=`let cOffset = ${1===s.length?"0u":"NHWC"===n?`outputIndices[${s.length-1}] / ${o}`:"outputIndices[1]"};`;else if("NCHW"===n)t=`
            ${g.indicesSet("outputIndices","0","0")}
            let cOffset = ${g.indicesToOffset("outputIndices")};`;else{t=`var cIndices = ${c.type.indices}(0);
                       cIndices[0] = outputIndices[${s.length-1}];`;for(let i=1;i<c.rank;i++)t+=`cIndices[${i}] = outputIndices[${i}];`;t+=`let cOffset = ${c.indicesToOffset("cIndices")};`}return t})()}
    let scale = ${c.getByOffset("cOffset")};
    let bias = ${h.getByOffset("cOffset")};
    let inputMean = ${f.getByOffset("cOffset")};
    let inputVar = ${m.getByOffset("cOffset")};
    let x = ${p.getByOffset("global_idx")};
    let value = (x - inputMean) * inverseSqrt(inputVar + epsilon) * scale + bias;
    ${g.setByOffset("global_idx","value")}
  }`,getRunData:()=>({outputs:[{dims:t[0].dims,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:a?[{type:12,data:l},...tS(s)]:[{type:12,data:l}]})}})(a,s))}}),nA=q(()=>{"use strict";ny(),nC(),i$=t=>{var i;let r,a,n,s,o,u,l,d;(t=>{if(3!==t[0].dims.length)throw Error("input should have 3 dimensions");if(![320,640,1280].includes(t[0].dims[2]))throw Error("number of channels should be 320, 640 or 1280");if(1!==t[1].dims.length)throw Error("bias is expected to have 1 dimensions");if(t[0].dims[2]!==t[1].dims[0])throw Error("last dimension of input and bias are not the same")})(t.inputs),t.compute((r=(i=t.inputs)[0].dims,a=i[0].dims[2],n=e3.size(r)/4,s=i[0].dataType,o=tR("input",s,r,4),u=tR("bias",s,[a],4),l=tR("residual",s,r,4),d=tB("output",s,r,4),{name:"BiasAdd",getRunData:()=>({outputs:[{dims:r,dataType:i[0].dataType}],dispatchGroup:{x:Math.ceil(n/64)}}),getShaderSource:t=>`
  const channels = ${a}u / 4;
  ${t.declareVariables(o,u,l,d)}

  ${t.mainStart()}
    ${t.guardAgainstOutOfBoundsWorkgroupSizes(n)}
    let value = ${o.getByOffset("global_idx")}
      + ${u.getByOffset("global_idx % channels")} + ${l.getByOffset("global_idx")};
    ${d.setByOffset("global_idx","value")}
  }`}))}}),nO=q(()=>{"use strict";nf(),ny(),nx(),nC(),iv=(t,i,r,a,n,s=t.dataType,o,u)=>{let l=[{type:12,data:Math.ceil(e3.size(t.dims)/4)}];return o&&l.push(...o),{name:i,shaderCache:{hint:n,inputDependencies:["type"]},getShaderSource:i=>{var n,o,l,d,p,c,h;let f,m,g,y,_;return n=i,o=e3.size(t.dims),l=t.dataType,d=s,p=r,c=a,h=u,f=Math.ceil(o/4),m="",m="string"==typeof p?`${p}(a)`:p("a"),g=tR("inputData",l,[f],4),y=tB("outputData",d,[f],4),_=[{name:"vec_size",type:"u32"}],h&&_.push(...h),`
      ${n.registerUniforms(_).declareVariables(g,y)}

  ${c??""}

  ${n.mainStart()}
    ${n.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}

    let a = ${g.getByOffset("global_idx")};
    ${y.setByOffset("global_idx",m)}
  }`},getRunData:i=>({outputs:[{dims:t.dims,dataType:s}],dispatchGroup:{x:Math.ceil(e3.size(i[0].dims)/64/4)},programUniforms:l})}},iw=t=>{t.compute(iv(t.inputs[0],"Abs","abs"))},ix=t=>{t.compute(iv(t.inputs[0],"Acos","acos"))},iC=t=>{t.compute(iv(t.inputs[0],"Acosh","acosh"))},ik=t=>{t.compute(iv(t.inputs[0],"Asin","asin"))},iS=t=>{t.compute(iv(t.inputs[0],"Asinh","asinh"))},iT=t=>{t.compute(iv(t.inputs[0],"Atan","atan"))},iI=t=>{t.compute(iv(t.inputs[0],"Atanh","atanh"))},iE=t=>tv(t),iz=(t,i)=>{let r;switch(i.to){case 10:r="vec4<f16>";break;case 1:r="vec4<f32>";break;case 12:r="vec4<u32>";break;case 6:r="vec4<i32>";break;case 9:r="vec4<bool>";break;default:throw RangeError(`not supported type (specified in attribute 'to' from 'Cast' operator): ${i.to}`)}t.compute(iv(t.inputs[0],"Cast",r,void 0,i.cacheKey,i.to))},iA=(t,i)=>{let r=i||(t=>{let i,r,a=t.length>=2&&0!==t[1].data,n=t.length>=3&&0!==t[2].data;switch(t[0].dataType){case 1:i=a?t[1].getFloat32Array()[0]:-34028234663852886e22,r=n?t[2].getFloat32Array()[0]:34028234663852886e22;break;case 10:i=a?t[1].getUint16Array()[0]:64511,r=n?t[2].getUint16Array()[0]:31743;break;default:throw Error("Unsupport data type")}return tv({min:i,max:r})})(t.inputs),a=tk(t.inputs[0].dataType);t.compute(iv(t.inputs[0],"Clip",t=>`clamp(${t}, vec4<${a}>(uniforms.min), vec4<${a}>(uniforms.max))`,void 0,r.cacheKey,void 0,[{type:t.inputs[0].dataType,data:r.min},{type:t.inputs[0].dataType,data:r.max}],[{name:"min",type:a},{name:"max",type:a}]),{inputs:[0]})},iO=t=>{t.compute(iv(t.inputs[0],"Ceil","ceil"))},iR=t=>{t.compute(iv(t.inputs[0],"Cos","cos"))},iB=t=>{t.compute(iv(t.inputs[0],"Cosh","cosh"))},iN=t=>tv(t),iM=(t,i)=>{let r=tk(t.inputs[0].dataType);t.compute(iv(t.inputs[0],"Elu",t=>`elu_vf32(${t})`,`
  const elu_alpha_ = ${r}(${i.alpha});

  fn elu_f32(a: ${r}) -> ${r} {
  return select((exp(a) - 1.0) * elu_alpha_, a, a >= 0.0);
  }

  fn elu_vf32(v: vec4<${r}>) -> vec4<${r}> {
  return vec4(elu_f32(v.x), elu_f32(v.y), elu_f32(v.z), elu_f32(v.w));
  }`,i.cacheKey))},iD=(t="f32")=>`
const r0: ${t} = 0.3275911;
const r1: ${t} = 0.254829592;
const r2: ${t} = -0.284496736;
const r3: ${t} = 1.421413741;
const r4: ${t} = -1.453152027;
const r5: ${t} = 1.061405429;

fn erf_vf32(v: vec4<${t}>) -> vec4<${t}> {
  let absv = abs(v);
  let x = 1.0 / (1.0 + r0 * absv);
  return sign(v) * (1.0 - ((((r5 * x + r4) * x + r3) * x + r2) * x + r1) * x * exp(-absv * absv));
}`,iP=t=>{let i=tk(t.inputs[0].dataType);t.compute(iv(t.inputs[0],"Erf",t=>`erf_vf32(${t})`,iD(i)))},iU=t=>{t.compute(iv(t.inputs[0],"Exp","exp"))},iq=t=>{t.compute(iv(t.inputs[0],"Floor","floor"))},iW=t=>{let i=tk(t.inputs[0].dataType);t.compute(iv(t.inputs[0],"Gelu",t=>`0.5 * ${t} * (1.0 + erf_vf32(${t} * 0.7071067811865475))`,iD(i)))},iL=(t,i)=>{let r=tk(t.inputs[0].dataType);t.compute(iv(t.inputs[0],"LeakyRelu",t=>`select(leaky_relu_alpha_ * ${t}, ${t}, ${t} >= vec4<${r}>(0.0))`,`const leaky_relu_alpha_ = ${r}(${i.alpha});`,i.cacheKey))},iV=t=>{t.compute(iv(t.inputs[0],"Not",t=>`!${t}`))},iG=t=>{t.compute(iv(t.inputs[0],"Neg",t=>`-${t}`))},ij=t=>{t.compute(iv(t.inputs[0],"Reciprocal",t=>`1.0/${t}`))},iH=t=>{let i=tk(t.inputs[0].dataType);t.compute(iv(t.inputs[0],"Relu",t=>`select(vec4<${i}>(0.0), ${t}, ${t} > vec4<${i}>(0.0))`))},iF=t=>{t.compute(iv(t.inputs[0],"Sigmoid",t=>`(1.0 / (1.0 + exp(-${t})))`))},iK=t=>tv(t),iZ=(t,i)=>{let r=tk(t.inputs[0].dataType);t.compute(iv(t.inputs[0],"HardSigmoid",t=>`max(vec4<${r}>(0.0), min(vec4<${r}>(1.0), ${i.alpha} * ${t} + vec4<${r}>(${i.beta})))`,void 0,i.cacheKey))},iQ=t=>{t.compute(iv(t.inputs[0],"Sin","sin"))},iX=t=>{t.compute(iv(t.inputs[0],"Sinh","sinh"))},iY=t=>{t.compute(iv(t.inputs[0],"Sqrt","sqrt"))},iJ=t=>{t.compute(iv(t.inputs[0],"Tan","tan"))},i0=t=>`sign(${t}) * (1 - exp(-2 * abs(${t}))) / (1 + exp(-2 * abs(${t})))`,i2=t=>{t.compute(iv(t.inputs[0],"Tanh",i0))},i1=(t="f32")=>`
const fast_gelu_a: ${t} = 0.5;
const fast_gelu_b: ${t} = 0.7978845608028654;
const fast_gelu_c: ${t} = 0.035677408136300125;

fn tanh_v(v: vec4<${t}>) -> vec4<${t}> {
  return ${i0("v")};
}
`,i3=t=>`(fast_gelu_a + fast_gelu_a * tanh_v(${t} * (fast_gelu_c * ${t} * ${t} + fast_gelu_b))) * ${t}`,i4=t=>{let i=tk(t.inputs[0].dataType);t.compute(iv(t.inputs[0],"FastGelu",i3,i1(i),void 0,t.inputs[0].dataType))},i6=(t,i)=>{let r=tk(t.inputs[0].dataType);return t.compute(iv(t.inputs[0],"ThresholdedRelu",t=>`select(vec4<${r}>(0.0), ${t}, ${t} > thresholded_relu_alpha_)`,`const thresholded_relu_alpha_ = vec4<${r}>(${i.alpha});`,i.cacheKey)),0},i8=t=>{t.compute(iv(t.inputs[0],"Log","log"))},i5=t=>`quick_gelu_impl(${t})`,i9=(t,i)=>{let r,a,n=tk(t.inputs[0].dataType);t.compute(iv(t.inputs[0],"QuickGelu",i5,(r=n,a=i.alpha,`
const alpha = vec4<${r}>(${a});
const one = ${r}(1.0);
const zero = ${r}(0.0);

fn quick_gelu_impl(x: vec4<${r}>) -> vec4<${r}> {
  let v = x *alpha;
  var x1 : vec4<${r}>;
  for (var i = 0; i < 4; i = i + 1) {
    if (v[i] >= zero) {
      x1[i] = one / (one + exp(-v[i]));
    } else {
      x1[i] = one - one / (one + exp(v[i]));
    }
  }
  return x * x1;
}
`),i.cacheKey,t.inputs[0].dataType))}}),nR=q(()=>{"use strict";ny(),nC(),nO(),i7=t=>{var i;let r,a,n,s,o,u;(t=>{if(3!==t[0].dims.length)throw Error("input should have 3 dimensions");if(![2560,5120,10240].includes(t[0].dims[2]))throw Error("hidden state should be 2560, 5120 or 10240");if(1!==t[1].dims.length)throw Error("bias is expected to have 1 dimensions");if(t[0].dims[2]!==t[1].dims[0])throw Error("last dimension of input and bias are not the same")})(t.inputs),t.compute(((r=(i=t.inputs)[0].dims.slice())[2]=r[2]/2,a=tR("input",i[0].dataType,i[0].dims,4),n=tR("bias",i[0].dataType,[i[0].dims[2]],4),s=tB("output",i[0].dataType,r,4),o=e3.size(r)/4,u=tC(i[0].dataType),{name:"BiasSplitGelu",getRunData:()=>({outputs:[{dims:r,dataType:i[0].dataType}],dispatchGroup:{x:Math.ceil(o/64)}}),getShaderSource:t=>`
  const M_SQRT2 = sqrt(2.0);
  const halfChannels = ${i[0].dims[2]/4/2}u;

  ${t.declareVariables(a,n,s)}

  ${iD(u)}

  ${t.mainStart()}
    ${t.guardAgainstOutOfBoundsWorkgroupSizes(o)}
    let biasIdx = global_idx % halfChannels;
    let batchIndex = global_idx / halfChannels;
    let inputOffset = biasIdx + batchIndex * halfChannels * 2;
    let valueLeft = input[inputOffset] + bias[biasIdx];
    let valueRight = input[inputOffset + halfChannels] + bias[biasIdx + halfChannels];
    let geluRight = valueRight * 0.5 * (erf_vf32(valueRight / M_SQRT2) + 1);

    ${s.setByOffset("global_idx","valueLeft * geluRight")}
  }`}))}}),nB=q(()=>{"use strict";nf(),ny(),nC(),re=(t,i,r,a,n,s)=>{t.compute(((t,i,r,a,n,s,o=r.dataType)=>{let u=r.dims.map(t=>Number(t)??1),l=a.dims.map(t=>Number(t)??1),d=!e3.areEqual(u,l),p=u,c=e3.size(u),h=!1,f=!1,m=[d];if(d){let t=e1.calcShape(u,l,!1);if(!t)throw Error("Can't perform binary op on the given tensors");p=t.slice(),c=e3.size(p);let i=1===e3.size(u),r=1===e3.size(l),a=u.length>0&&u[u.length-1]%4==0,n=l.length>0&&l[l.length-1]%4==0;m.push(i),m.push(r),m.push(a),m.push(n);let s=1;for(let t=1;t<p.length;t++){let i=u[u.length-t];if(i===l[l.length-t])s*=i;else break}s%4==0?(f=!0,h=!0):(i||r||a||n)&&(h=!0)}else h=!0;return m.push(h),{name:t,shaderCache:{hint:i+m.map(t=>t.toString()).join("_"),inputDependencies:["rank","rank"]},getShaderSource:t=>((t,i,r,a,n,s,o,u,l,d,p,c)=>{let h,f;"string"==typeof u?h=f=(t,i)=>`${u}((${t}),(${i}))`:"function"==typeof u?h=f=u:(h=u.scalar,f=u.vector);let m=tB("outputData",p,a.length,4),g=tR("aData",l,i.length,4),y=tR("bData",d,r.length,4),_;if(n)if(s){let t=1===e3.size(i),a=1===e3.size(r),n=i.length>0&&i[i.length-1]%4==0,s=r.length>0&&r[r.length-1]%4==0;_=t||a?m.setByOffset("global_idx",f(t?`${g.type.value}(${g.getByOffset("0")}.x)`:g.getByOffset("global_idx"),a?`${y.type.value}(${y.getByOffset("0")}.x)`:y.getByOffset("global_idx"))):`
            let outputIndices = ${m.offsetToIndices("global_idx * 4u")};
            let offsetA = ${g.broadcastedIndicesToOffset("outputIndices",m)};
            let offsetB = ${y.broadcastedIndicesToOffset("outputIndices",m)};
            ${m.setByOffset("global_idx",f(o||n?g.getByOffset("offsetA / 4u"):`${g.type.value}(${g.getByOffset("offsetA / 4u")}[offsetA % 4u])`,o||s?y.getByOffset("offsetB / 4u"):`${y.type.value}(${y.getByOffset("offsetB / 4u")}[offsetB % 4u])`))}
          `}else _=m.setByOffset("global_idx",f(g.getByOffset("global_idx"),y.getByOffset("global_idx")));else{if(!s)throw Error("no necessary to use scalar implementation for element-wise binary op implementation.");let t=(t,i,r="")=>{let a=`aData[indexA${i}][componentA${i}]`,n=`bData[indexB${i}][componentB${i}]`;return`
            let outputIndices${i} = ${m.offsetToIndices(`global_idx * 4u + ${i}u`)};
            let offsetA${i} = ${g.broadcastedIndicesToOffset(`outputIndices${i}`,m)};
            let offsetB${i} = ${y.broadcastedIndicesToOffset(`outputIndices${i}`,m)};
            let indexA${i} = offsetA${i} / 4u;
            let indexB${i} = offsetB${i} / 4u;
            let componentA${i} = offsetA${i} % 4u;
            let componentB${i} = offsetB${i} % 4u;
            ${t}[${i}] = ${r}(${h(a,n)});
          `};_=9===p?`
            var data = vec4<u32>(0);
            ${t("data",0,"u32")}
            ${t("data",1,"u32")}
            ${t("data",2,"u32")}
            ${t("data",3,"u32")}
            outputData[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:`
            ${t("outputData[global_idx]",0)}
            ${t("outputData[global_idx]",1)}
            ${t("outputData[global_idx]",2)}
            ${t("outputData[global_idx]",3)}
          `}return`
        ${t.registerUniform("vec_size","u32").declareVariables(g,y,m)}

        ${c??""}

        ${t.mainStart()}
        ${t.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${_}
      }`})(t,u,l,p,h,d,f,n,r.dataType,a.dataType,o,s),getRunData:()=>({outputs:[{dims:p,dataType:o}],dispatchGroup:{x:Math.ceil(c/64/4)},programUniforms:[{type:12,data:Math.ceil(e3.size(p)/4)},...tS(u,l,p)]})}})(i,n??"",t.inputs[0],t.inputs[1],r,a,s))},rt=t=>{re(t,"Add",(t,i)=>`${t}+${i}`)},ri=t=>{re(t,"Div",(t,i)=>`${t}/${i}`)},rr=t=>{re(t,"Equal",{scalar:(t,i)=>`u32(${t}==${i})`,vector:(t,i)=>`vec4<u32>(${t}==${i})`},void 0,void 0,9)},ra=t=>{re(t,"Mul",(t,i)=>`${t}*${i}`)},rn=t=>{let i=tR("input",t.inputs[0].dataType,t.inputs[0].dims).type.value;re(t,"Pow",{scalar:(t,i)=>`pow_custom(${t},${i})`,vector:(t,i)=>`pow_vector_custom(${t},${i})`},`
    fn pow_custom(a : ${i}, b : ${i}) -> ${i} {
      if (b == ${i}(0.0)) {
        return ${i}(1.0);
      } else if (a < ${i}(0.0) && f32(b) != floor(f32(b))) {
        return ${i}(pow(f32(a), f32(b))); // NaN
      }
      return select(sign(a), ${i}(1.0), round(f32(abs(b) % ${i}(2.0))) != 1.0) * ${i}(${"i32"===i?"round":""}(pow(f32(abs(a)), f32(b))));
    }
    fn pow_vector_custom(a : vec4<${i}>, b : vec4<${i}>) -> vec4<${i}> {
      // TODO: implement vectorized pow
      return vec4<${i}>(pow_custom(a.x, b.x), pow_custom(a.y, b.y), pow_custom(a.z, b.z), pow_custom(a.w, b.w));
    }
      `)},rs=t=>{re(t,"Sub",(t,i)=>`${t}-${i}`)},ro=t=>{re(t,"Greater",{scalar:(t,i)=>`u32(${t}>${i})`,vector:(t,i)=>`vec4<u32>(${t}>${i})`},void 0,void 0,9)},ru=t=>{re(t,"Less",{scalar:(t,i)=>`u32(${t}<${i})`,vector:(t,i)=>`vec4<u32>(${t}<${i})`},void 0,void 0,9)},rl=t=>{re(t,"GreaterOrEqual",{scalar:(t,i)=>`u32(${t}>=${i})`,vector:(t,i)=>`vec4<u32>(${t}>=${i})`},void 0,void 0,9)},rd=t=>{re(t,"LessOrEqual",{scalar:(t,i)=>`u32(${t}<=${i})`,vector:(t,i)=>`vec4<u32>(${t}<=${i})`},void 0,void 0,9)}}),nN=q(()=>{"use strict";nf(),ny(),nx(),nC(),rp=(t,i)=>{let r=t.inputs,a=r[0].dims,n=e3.normalizeAxis(i.axis,a.length);var s=r,o=n;if(!s||s.length<1)throw Error("too few inputs");let u=s[0],l=u.dataType,d=u.dims.length;s.forEach((t,i)=>{if(0!==i){if(t.dataType!==l)throw Error("input tensors should be one type");if(t.dims.length!==d)throw Error("input tensors should have the same shape");t.dims.forEach((t,i)=>{if(i!==o&&t!==u.dims[i])throw Error("non concat dimensions must match")})}});let p=a.slice();p[n]=r.reduce((t,i)=>t+(i.dims.length>n?i.dims[n]:0),0);let c=r.filter(t=>e3.size(t.dims)>0);t.compute(((t,i,r,a)=>{let n=e3.size(r),s=Array(t.length),o=Array(t.length),u=0,l=[],d=[],p=[{type:12,data:n}];for(let r=0;r<t.length;++r)u+=t[r].dims[i],s[r]=u,d.push(t[r].dims.length),o[r]=tR(`input${r}`,a,d[r]),l.push("rank"),p.push({type:12,data:s[r]});for(let i=0;i<t.length;++i)p.push(...tS(t[i].dims));p.push(...tS(r));let c=tB("output",a,r.length),h=c.indicesGet("indices",i),f=Array.from(Array(s.length).keys()).map(t=>`uniforms.sizeInConcatAxis${t}`).join(",");return{name:"Concat",shaderCache:{hint:`${i}`,inputDependencies:l},getRunData:()=>({outputs:[{dims:r,dataType:a}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:p}),getShaderSource:i=>{let r,a;return`

  ${(()=>{i.registerUniform("outputSize","u32");for(let r=0;r<t.length;r++)i.registerUniform(`sizeInConcatAxis${r}`,"u32");return i.declareVariables(...o,c)})()}

  ${r=s.length,a=f,`
  fn calculateInputIndex(index: u32) -> u32 {
    let sizeInConcatAxis = array<u32, ${r}u>(${a});
    for (var i: u32 = 0u; i < ${r}; i += 1u ) {
      if (index < sizeInConcatAxis[i]) {
        return i;
      }
    }
    return ${r}u;
  }`}

  ${i.mainStart()}
    ${i.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

    var indices = ${c.offsetToIndices("global_idx")};

    let inputIndex = calculateInputIndex(${h});
    if (inputIndex != 0u) {
      let sizeInConcatAxis = array<u32, ${s.length}u>(${f});
      ${h} -= sizeInConcatAxis[inputIndex - 1u];
    }

    ${((t,i)=>{let r=t.length,a=[];for(let n=0;n<r;++n){let s=i.setByOffset("global_idx",t[n].getByIndices("indices"));1===r?a.push(s):0===n?a.push(`if (inputIndex == ${n}u) { ${s} }`):n===r-1?a.push(`else { ${s} }`):a.push(`else if (inputIndex == ${n}) { ${s} }`)}return a.join(`
`)})(o,c)}
  }`}}})(c,n,p,r[0].dataType),{inputs:c})},rc=t=>tv({axis:t.axis})}),nM=q(()=>{"use strict";nf(),ny(),rh=(t,i,r="f32")=>{switch(t.activation){case"Relu":return`value = max(value, ${i}(0.0));`;case"Sigmoid":return`value = (${i}(1.0) / (${i}(1.0) + exp(-value)));`;case"Clip":return`value = clamp(value, ${i}(${r}(uniforms.clip_min)), ${i}(${r}(uniforms.clip_max)));`;case"HardSigmoid":return`value = max(${i}(0.0), min(${i}(1.0), ${r}(uniforms.alpha) * value + ${r}(uniforms.beta)));`;case"LeakyRelu":return`value = select(${r}(uniforms.alpha) * value, value, value >= ${i}(0.0));`;case"Tanh":return`let e2x = exp(-2.0 * abs(value));
              value = sign(value) * (1.0 - e2x) / (1.0 + e2x);
        `;case"":return"";default:throw Error(`Unsupported activation ${t.activation}`)}},rf=(t,i)=>{"Clip"===t.activation?i.push({type:1,data:t.clipMax},{type:1,data:t.clipMin}):"HardSigmoid"===t.activation?i.push({type:1,data:t.alpha},{type:1,data:t.beta}):"LeakyRelu"===t.activation&&i.push({type:1,data:t.alpha})},rm=(t,i)=>{"Clip"===t.activation?i.push({name:"clip_max",type:"f32"},{name:"clip_min",type:"f32"}):"HardSigmoid"===t.activation?i.push({name:"alpha",type:"f32"},{name:"beta",type:"f32"}):"LeakyRelu"===t.activation&&i.push({name:"alpha",type:"f32"})},rg=t=>{let i=t?.activation||"";if("HardSigmoid"===i){let[r,a]=t?.activation_params||[.2,.5];return{activation:i,alpha:r,beta:a}}if("Clip"===i){let[r,a]=t?.activation_params||[e8,e5];return{activation:i,clipMax:a,clipMin:r}}if("LeakyRelu"===i){let[r]=t?.activation_params||[.01];return{activation:i,alpha:r}}return{activation:i}}}),nD=q(()=>{"use strict";ry=(t,i)=>{switch(t){case 1:return i;case 2:return`vec2<${i}>`;case 3:return`vec3<${i}>`;case 4:return`vec4<${i}>`;default:throw Error(`${t}-component is not supported.`)}},r_=t=>`
      ${t?"value = value + getBiasByOutputCoords(coords);":""}
      `}),nP=q(()=>{"use strict";rb=t=>`
fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
      shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
}
fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
    i32(${t}.x), i32(${t}.y), i32(${t}.z), 1));
}
`}),nU=q(()=>{"use strict";nf(),ny(),nC(),nM(),r$=(t,i,r,a,n)=>{let s=a-r;return`
      ${Array.from({length:r}).map((r,o)=>`
      if (${tA(i.shape,o,i.rank)} != 1) {
        ${i.indicesSet(t,o,tA(n,o+s,a))}
      } else {
        ${i.indicesSet(t,o,0)}
      }`).join("")}
`},rv=(t,i,r,a,n=!1,s)=>{let o=t[0].dims,u=t[1].dims,l=o[o.length-2],d=u[u.length-1],p=o[o.length-1],c=tT(d),h=tT(p),f=tT(l),m=e3.size(r)/c/f,g=t.length>2,y=a?a.slice(0,-2):r.slice(0,-2),_=[e3.size(y),l,d],b=[{type:12,data:m},{type:12,data:l},{type:12,data:d},{type:12,data:p}];return rf(i,b),b.push(...tS(y,o,u)),g&&b.push(...tS(t[2].dims)),b.push(...tS(_)),{name:"MatMulNaive",shaderCache:{hint:`${i.activation};${c};${h};${f};${n}`,inputDependencies:g?["rank","rank","rank"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:s?s(r):r,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:b}),getShaderSource:a=>{let s=tM("batch_dims",t[0].dataType,y.length),l=tR("a",t[0].dataType,o.length,h),d=tR("b",t[1].dataType,u.length,c),p=tB("output",t[0].dataType,_.length,c),m=tC(p.type.tensor),b=rh(i,p.type.value,m),$=[l,d],v="";if(g){let i=n?c:1;$.push(tR("bias",t[2].dataType,t[2].dims.length,i)),v=`${n?`value += bias[col / ${i}];`:`value += ${p.type.value}(bias[row + i]);`}`}let w=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"}];return rm(i,w),`
  ${a.registerUniforms(w).registerInternalVariables(s).declareVariables(...$,p)}
  ${a.mainStart()}
    ${a.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let col = (global_idx % (uniforms.N / ${c})) * ${c};
    var index1 = global_idx / (uniforms.N / ${c});
    let stride1 = uniforms.M / ${f};
    let row = (index1 % stride1) * ${f};
    let batch = index1 / stride1;

    ${2===r.length?"":`let batch_indices = ${s.offsetToIndices("batch")};`}

    var a_indices: ${l.type.indices};
    ${r$("a_indices",l,l.rank-2,s.rank,"batch_indices")}
    ${l.indicesSet("a_indices",l.rank-2,0)}
    ${l.indicesSet("a_indices",l.rank-1,0)}
    let a_offset = ${l.indicesToOffset("a_indices")};

    var b_indices: ${d.type.indices};
    ${r$("b_indices",d,d.rank-2,s.rank,"batch_indices")}
    ${d.indicesSet("b_indices",d.rank-2,0)}
    ${d.indicesSet("b_indices",d.rank-1,0)}
    let b_offset = ${d.indicesToOffset("b_indices")};
    var values: array<${p.type.value}, ${f}>;
    for (var k: u32 = 0u; k < uniforms.K; k = k + ${h}) {
      ${(()=>{let t=`var a_data: ${l.type.value};`;for(let i=0;i<h;i++)t+=`
              let b_data${i} = b[(b_offset + (k + ${i}) * uniforms.N + col) / ${c}];`;for(let i=0;i<f;i++){t+=`a_data = a[(a_offset + (row + ${i}) * uniforms.K + k) / ${h}];`;for(let r=0;r<h;r++)t+=`
            values[${i}] = fma(${d.type.value}(a_data${1===h?"":`[${r}]`}), b_data${r}, values[${i}]);
`}return t})()}
    }
    for (var i = 0u; i < ${f}u; i++) {
      var value = values[i];
      ${v}
      ${b}
      let cur_indices = ${p.type.indices}(batch, row + i, col);
      let offset = ${p.indicesToOffset("cur_indices")};
      ${p.setByOffset(`offset / ${c}`,"value")};
    }
  }
  `}}}}),nq=q(()=>{"use strict";nf(),ny(),nC(),nM(),nU(),nD(),rw=(t,i,r="f32",a,n=!1,s=32,o=!1,u=32)=>{let l,d,p,c,h=i[1]*t[1],f=i[0]*t[0],m=n?h:s,g=n?s:h,y=m/i[0],_=s/i[1];if(!((n&&4===y&&4===t[1]||!n&&(3===y||4===y))&&m%i[0]==0&&s%i[1]==0&&4===t[0]))throw Error(`If transposeA ${n} is true, innerElementSize ${y} and workPerThread[1] ${t[1]} must be 4.
      Otherwise, innerElementSize ${y} must be 3 or 4.
  tileAWidth ${m} must be divisible by workgroupSize[0]${i[0]}. tileInner ${s} must be divisible by workgroupSize[1] ${i[1]}. colPerThread ${t[0]} must be 4.`);return`
var<workgroup> mm_Asub: array<array<vec${y}<${r}>, ${m/y}>, ${g}>;
var<workgroup> mm_Bsub: array<array<vec4<${r}>, ${f/t[0]}>, ${s}>;

const rowPerThread = ${t[1]};
const colPerThread = ${t[0]};
const innerElementSize = ${y};
const tileInner = ${s};

@compute @workgroup_size(${i[0]}, ${i[1]}, ${i[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
  let localRow = i32(localId.y);
  let tileRow = localRow * rowPerThread;
  let tileCol = i32(localId.x);

  let globalRow =i32(globalId.y) * rowPerThread;
  let globalCol = i32(globalId.x);
  let batch = ${o?"0":"i32(globalId.z)"};
  ${a?`let batchIndices = ${a.offsetToIndices("u32(batch)")};`:""}
  let globalRowStart = i32(workgroupId.y) * ${h};

  let num_tiles = ${o?`${Math.ceil(u/s)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
  var kStart = ${o?`i32(globalId.z) * ${u}`:"0"};

  var acc: array<vec4<${r}>, rowPerThread>;

  // Loop over shared dimension.
  let tileRowB = localRow * ${_};
  for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let inputRow = tileRow + innerRow;
          let inputCol = tileCol;
          ${l=n,d=a,l?`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          kStart + inputRow,
          globalRowStart / innerElementSize + inputCol${d?", batchIndices":""});
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          globalRow + innerRow,
          kStart / innerElementSize + inputCol${d?", batchIndices":""});
        `}
      }

      // Load one tile of B into local memory.
      for (var innerRow = 0; innerRow < ${_}; innerRow = innerRow + 1) {
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
          ${3===y?"":"let BCached3 = mm_Bsub[k * innerElementSize + 3][tileCol];"}

          ${p=n,c=y,p?`
        let ACached0 = mm_Asub[k * innerElementSize][localRow];
        let ACached1 = mm_Asub[k * innerElementSize + 1][localRow];
        let ACached2 = mm_Asub[k * innerElementSize + 2][localRow];
        ${3===c?"":"let ACached3 = mm_Asub[k * innerElementSize + 3][localRow];"}
        for (var i = 0; i < rowPerThread; i = i + 1) {
          acc[i] = BCached0 * ACached0[i] + acc[i];
          acc[i] = BCached1 * ACached1[i] + acc[i];
          acc[i] = BCached2 * ACached2[i] + acc[i];
          ${3===c?"":"acc[i] = BCached3 * ACached3[i] + acc[i];"}
        }`:`
        for (var i = 0; i < rowPerThread; i = i + 1) {
          let ACached = mm_Asub[tileRow + i][k];
          acc[i] = BCached0 * ACached.x + acc[i];
          acc[i] = BCached1 * ACached.y + acc[i];
          acc[i] = BCached2 * ACached.z + acc[i];
          ${3===c?"":"acc[i] = BCached3 * ACached.w + acc[i];"}
        }`}
      }

      workgroupBarrier();
  }

  for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      mm_write(batch, globalRow + innerRow, globalCol, acc[innerRow]);
  }
}`},rx=(t,i)=>t?`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              kStart + inputRow,
              globalRowStart + inputCol${i?", batchIndices":""});
            `:`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              globalRowStart + inputRow,
              kStart + inputCol${i?", batchIndices":""});
            `,rC=(t,i,r="f32",a,n=!1,s=32,o=!1,u=32,l=!1)=>{let d=t[1]*i[1],p=t[0]*i[0],c=n?d:s,h=n?s:d;if(h%i[1]!=0||c%i[0]!=0||s%i[1]!=0)throw Error(`tileAHight ${h} must be divisible by workgroupSize[1]${i[1]}, tileAWidth ${c} must be divisible by workgroupSize[0]${i[0]}, tileInner ${s} must be divisible by workgroupSize[1]${i[1]}`);let f=h/i[1],m=c/i[0],g=s/i[1],y=l?`
    let localRow = i32(localId.y);
    let localCol = i32(localId.x);
    let globalRowStart = i32(workgroupId.y) * ${d};
    let globalColStart = i32(workgroupId.x) * ${p};

    // Loop over shared dimension.
    for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var inputRow = localRow; inputRow < ${h}; inputRow = inputRow + ${i[1]}) {
        for (var inputCol = localCol; inputCol < ${c}; inputCol = inputCol + ${i[0]}) {
          ${rx(n,a)}
        }
      }
      // Load one tile of B into local memory.
      for (var inputRow = localRow; inputRow < ${s}; inputRow = inputRow + ${i[1]}) {
            for (var inputCol = localCol; inputCol < ${p}; inputCol = inputCol + ${i[0]}) {
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
          BCached[inner] = mm_Bsub[k][localCol + inner * ${i[0]}];
        }
        for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let ACached = ${n?`mm_Asub[k][localRow + innerRow * ${i[1]}];`:`mm_Asub[localRow + innerRow * ${i[1]}][k];`}
          for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
            acc[innerRow][innerCol] = acc[innerRow][innerCol] +
                ACached * BCached[innerCol];
          }
        }
      }
      workgroupBarrier();
    }
    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      let gRow = globalRowStart + localRow + innerRow * ${i[1]};
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        let gCol = globalColStart + localCol + innerCol * ${i[0]};
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
      ${rx(n,a)}
    }
  }

  // Load one tile of B into local memory.
  for (var innerRow = 0; innerRow < ${g}; innerRow = innerRow + 1) {
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
      ${n?"let ACached = mm_Asub[k][tileRow + innerRow];":"let ACached = mm_Asub[tileRow + innerRow][k];"}
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
  var<workgroup> mm_Asub : array<array<${r}, ${c}>, ${h}>;
  var<workgroup> mm_Bsub : array<array<${r}, ${p}>, ${s}>;
  const rowPerThread = ${t[1]};
  const colPerThread = ${t[0]};
  const tileInner = ${s};

@compute @workgroup_size(${i[0]}, ${i[1]}, ${i[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
    let batch = ${o?"0":"i32(globalId.z)"};
    ${a?`let batchIndices = ${a.offsetToIndices("u32(batch)")};`:""}
    let num_tiles = ${o?`${Math.ceil(u/s)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
    var kStart = ${o?`i32(globalId.z) * ${u}`:"0"};

    var acc : array<array<${r}, colPerThread>, rowPerThread>;
    ${y}
  }
`},rk=(t,i,r,a,n=!1,s)=>{let o=t[0].dims,u=t[1].dims,l=o.slice(0,-2),d=u.slice(0,-2),p=a?a.slice(0,-2):r.slice(0,-2),c=e3.size(p),h=o[o.length-2],f=o[o.length-1],m=u[u.length-1],g=f%4==0&&m%4==0,y=h<=8?[4,1,1]:[4,4,1],_=[8,8,1],b=[Math.ceil(m/_[0]/y[0]),Math.ceil(h/_[1]/y[1]),Math.ceil(c/_[2]/y[2])],$=g?4:1,v=[...l,h,f/$],w=v.length,x=[...d,f,m/$],C=x.length,k=[c,h,m/$],S=[{type:6,data:h},{type:6,data:m},{type:6,data:f}];rf(i,S),S.push(...tS(p,v,x));let T=["rank","rank"],I=t.length>2;return I&&(S.push(...tS(t[2].dims)),T.push("rank")),S.push(...tS(k)),{name:"MatMul",shaderCache:{hint:`${y};${i.activation};${g};${n}`,inputDependencies:T},getRunData:()=>({outputs:[{dims:s?s(r):r,dataType:t[0].dataType}],dispatchGroup:{x:b[0],y:b[1],z:b[2]},programUniforms:S}),getShaderSource:r=>{let a=p.length,s=tM("batchDims",t[0].dataType,a,1),o=tC(t[0].dataType),u=tR("a",t[0].dataType,w,$),l=tR("b",t[1].dataType,C,$),d=tB("result",t[0].dataType,k.length,$),c=[u,l];if(I){let i=n?$:1;c.push(tR("bias",t[2].dataType,t[2].dims.length,i))}let h=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"}];rm(i,h);let f=tC(d.type.tensor),m=((t,i,r,a,n=!1)=>{let[s,o,u,l]=a,d=tC(a[0].type.tensor);return`
    fn mm_readA(batch: i32, row: i32, colIn: i32, batchIndices: ${s.type.indices}) -> ${ry(t,d)} {
      var value = ${ry(t,d)}(0.0);
      let col = colIn * ${t};
      if(row < uniforms.dim_a_outer && col < uniforms.dim_inner)
      {
        var aIndices: ${o.type.indices};
        ${r$("aIndices",o,o.rank-2,s.rank,"batchIndices")}
        ${o.indicesSet("aIndices",o.rank-2,"u32(row)")}
        ${o.indicesSet("aIndices",o.rank-1,"u32(colIn)")}
        value = ${o.getByIndices("aIndices")};
      }
      return value;
    }

    fn mm_readB(batch: i32, row: i32, colIn: i32, batchIndices: ${s.type.indices}) -> ${ry(t,d)} {
      var value = ${ry(t,d)}(0.0);
      let col = colIn * ${t};
      if(row < uniforms.dim_inner && col < uniforms.dim_b_outer)
      {
        var bIndices: ${u.type.indices};
        ${r$("bIndices",u,u.rank-2,s.rank,"batchIndices")}
        ${u.indicesSet("bIndices",u.rank-2,"u32(row)")}
        ${u.indicesSet("bIndices",u.rank-1,"u32(colIn)")}
        value = ${u.getByIndices("bIndices")};
      }
      return value;
    }

    fn mm_write(batch: i32, row: i32, colIn: i32, valueIn: ${ry(t,d)}) {
      let col = colIn * ${t};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer) {
        var value = valueIn;
        let coords = vec3<i32>(batch, row, colIn);
        ${i?`value = value + ${n?"bias[colIn]":`${ry(t,d)}(bias[row])`};`:""}
        ${r}
        ${l.setByIndices("vec3<u32>(coords)","value")}
      }
    }
    `})($,I,rh(i,d.type.value,f),[s,u,l,d],n);return`
  ${r.registerUniforms(h).registerInternalVariables(s).declareVariables(...c,d)}
  ${m}
  ${g?rw(y,_,o,s):rC(y,_,o,s)}
                   `}}}}),nW=q(()=>{"use strict";nf(),ng(),nC(),nM(),nD(),nP(),nq(),rS=(t,i,r,a,n,s,o,u,l)=>{let d="NHWC"===i.format,p=d?t[0].dims[3]:t[0].dims[1],c=r[0],h=d?r[2]:r[3],f=d?r[1]:r[2],m=d?r[3]:r[1],g=d&&(p%4==0||p%3==0)&&m%4==0,y=d?m:h*f,_=d?h*f:m,b=[8,8,1],$=a<=8?[4,1,1]:[4,4,1],v=[Math.ceil(y/b[0]/$[0]),Math.ceil(_/b[1]/$[1]),Math.ceil(c/b[2]/$[2])];e0("verbose",()=>`[conv2d_mm_webgpu] dispatch = ${v}`);let w=g?d&&p%4!=0?3:4:1,x=b[1]*$[1],C=b[0]*$[0],k=Math.max(b[0]*w,b[1]),S=a%x==0,T=n%C==0,I=s%k==0,E=g?[w,4,4]:[1,1,1],z=[{type:6,data:a},{type:6,data:n},{type:6,data:s},{type:6,data:[i.pads[0],i.pads[1]]},{type:6,data:i.strides},{type:6,data:i.dilations}];rf(i,z),z.push(...tS(t[0].dims,t[1].dims));let A=["rank","rank"];return o&&(z.push(...tS(t[2].dims)),A.push("rank")),z.push(...tS(r)),{name:"Conv2DMatMul",shaderCache:{hint:`${i.cacheKey};${w};${g};${S};${T};${I};${x};${C};${k}`,inputDependencies:A},getRunData:()=>({outputs:[{dims:l?l(r):r,dataType:t[0].dataType}],dispatchGroup:{x:v[0],y:v[1],z:v[2]},programUniforms:z}),getShaderSource:a=>{let n=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"},{name:"pad",type:"i32",length:2},{name:"stride",type:"i32",length:2},{name:"dilation",type:"i32",length:2}];rm(i,n);let s=g?4:1,l=tC(t[0].dataType),p=`
      fn setOutputAtIndex(flatIndex : i32, value : ${g?`vec4<${l}>`:l}) {
        result[flatIndex] = ${g?`vec4<${l}>`:l}(value);
      }
      fn setOutputAtCoords(d0 : i32, d1 : i32, d2 : i32, d3 : i32, value : ${g?`vec4<${l}>`:l}) {
        let flatIndex = getOutputIndexFromCoords(vec4<i32>(d0, d1, d2, d3));
        setOutputAtIndex(flatIndex ${g?"/ 4":""}, value);
      }`,c=[tR("x",t[0].dataType,t[0].dims.length,3===w?1:w),tR("w",t[1].dataType,t[1].dims.length,s)],h=tB("result",t[0].dataType,r.length,s);if(o){let i=tR("bias",t[2].dataType,t[2].dims.length,s);c.push(i),p+=`
        fn getBiasByOutputCoords(coords : vec4<i32>) -> ${g?`vec4<${l}>`:l} {
          return bias[coords.${d?"w":"y"}${g?"/ 4":""}];
        }`}return`
        ${rb("uniforms.result_strides")}
        //struct Uniforms { xShape : vec4<i32>, wShape : vec4<i32>, outShape : vec4<i32>,
        //  outShapeStrides: vec3<i32>, filterDims : vec2<i32>, pad : vec2<i32>, stride : vec2<i32>,
        //  dilation : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32 };
        ${a.registerUniforms(n).declareVariables(...c,h)}
        ${p}
        ${((t,i,r,a,n=!1,s,o=4,u=4,l=4,d="f32")=>{let p=t=>{switch(t){case 1:return"return w[row * i32(uniforms.w_shape[3]) + colIn];";case 4:return"return w[row * i32(uniforms.w_shape[3]) / 4 + colIn];";default:throw Error(`innerElementSize ${t} is not supported.`)}},c=t?`
    let coord = vec4<i32>(batch, xRow, xCol, xCh);
    `:`
    let coord = vec4<i32>(batch, xCh, xRow, xCol);
    `,h=t?`
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
    `,f=t?"row":"col",m=t?"col":"row",g=`
    let inChannels = i32(uniforms.w_shape[2]);
    let outWidth = ${t?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
    let outRow = ${f} / outWidth;
    let outCol = ${f} % outWidth;

    let WRow = ${m} / (i32(uniforms.w_shape[1]) * inChannels);
    let WCol = ${m} / inChannels % i32(uniforms.w_shape[1]);
    let xRow = outRow * uniforms.stride[0] + uniforms.dilation[0] * WRow - uniforms.pad[0];
    let xCol = outCol * uniforms.stride[1] + uniforms.dilation[1] * WCol - uniforms.pad[1];
    let xCh = ${m} % inChannels;
    var resData = ${ry(o,d)}(0.0);
    // The bounds checking is always needed since we use it to pad zero for
    // the 'same' padding type.
    if (xRow >= 0 && xRow < ${t?"i32(uniforms.x_shape[1])":"i32(uniforms.x_shape[2])"} && xCol >= 0 && xCol < ${t?"i32(uniforms.x_shape[2])":"i32(uniforms.x_shape[3])"}) {
      ${c}
      let xIndex = getIndexFromCoords4D(coord, vec4<i32>(uniforms.x_shape));
      ${(t=>{switch(t){case 1:return"resData = x[xIndex];";case 3:return`resData = vec3<${d}>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);`;case 4:return"resData = x[xIndex / 4];";default:throw Error(`innerElementSize ${t} is not supported.`)}})(o)}
    }
    return resData;`,y=t?i&&a?`
    let col = colIn * ${o};
    ${g}`:`
    let col = colIn * ${o};
    if (row < uniforms.dim_a_outer && col < uniforms.dim_inner) {
      ${g}
    }
    return ${ry(o,d)}(0.0);`:a&&r?`
    let col = colIn * ${o};
    ${g}`:`
    let col = colIn * ${o};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${g}
    }
    return ${ry(o,d)}(0.0);`,_=t?a&&r?p(u):`
    let col = colIn * ${u};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${p(u)}
    }
    return ${ry(u,d)}(0.0);`:`
    let col = colIn * ${u};
    if (row < uniforms.dim_inner && col < uniforms.dim_a_outer) {
      ${p(u)}
    }
    return ${ry(u,d)}(0.0);`,b=ry(l,d),$=t?ry(o,d):ry(u,d),v=t?ry(u,d):ry(o,d),w=rh(s,b,d);return`
    fn mm_readA(batch: i32, row : i32, colIn : i32) -> ${$} {
      ${t?y:_}
    }

    fn mm_readB(batch: i32, row : i32, colIn : i32) -> ${v} {
      ${t?_:y}
    }

    fn mm_write(batch: i32, row : i32, colIn : i32, valueIn : ${b}) {
      let col = colIn * ${l};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer)
      {
      var value = valueIn;
      let outWidth = ${t?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
      ${h}
      ${r_(n)}
      ${w}
      setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
      }
    }`})(d,S,T,I,o,i,E[0],E[1],E[2],l)}
        ${g?rw($,b,l,void 0,!d,k):rC($,b,l,void 0,!d,k,!1,void 0,u)}`}}}}),nL=q(()=>{"use strict";nf(),ng(),ny(),nC(),nM(),nD(),rT=t=>"number"==typeof t?[t,t,t]:t,rI=(t,i)=>i<=1?t:t+(t-1)*(i-1),rE=(t,i,r,a,n)=>{null==n&&(n=((t,i,r,a=1)=>{let n=rI(i,a);return Math.floor((t[0]*(r-1)-r+n)/2)})(t,i[0],a[0]));let s=[0,0,0,r];for(let r=0;r<3;r++)t[r]+2*n>=i[r]&&(s[r]=Math.trunc((t[r]-i[r]+2*n)/a[r]+1));return s},rz=(t,i,r,a,n,s=!1,o="channelsLast")=>{let u,l,d,p,c;if("channelsLast"===o)[u,l,d,p,c]=t;else if("channelsFirst"===o)[u,c,l,d,p]=t;else throw Error(`Unknown dataFormat ${o}`);let[h,,f,m,g]=i,[y,_,b]=rT(r),[$,v,w]=rT(a),x=rI(f,$),C=rI(m,v),k=rI(g,w),{padInfo:S,outDepth:T,outHeight:I,outWidth:E}=((t,i,r,a,n,s,o,u,l,d)=>{let p,c,h,f;if("VALID"===t&&(t=0),"number"==typeof t){p={top:t,bottom:t,left:t,right:t,front:t,back:t};let m=rE([i,r,a,1],[u,l,d],1,[n,s,o],t);c=m[0],h=m[1],f=m[2]}else if(Array.isArray(t)){if(!t.every((t,i,r)=>t===r[0]))throw Error(`Unsupported padding parameter: ${t}`);p={top:t[0],bottom:t[1],left:t[2],right:t[3],front:t[4],back:t[5]};let m=rE([i,r,a,1],[u,l,d],1,[n,s,o],t[0]);c=m[0],h=m[1],f=m[2]}else if("SAME_UPPER"===t){c=Math.ceil(i/n),h=Math.ceil(r/s),f=Math.ceil(a/o);let t=(c-1)*n+u-i,m=(h-1)*s+l-r,g=(f-1)*o+d-a,y=Math.floor(t/2),_=Math.floor(m/2),b=Math.floor(g/2);p={top:_,bottom:m-_,left:b,right:g-b,front:y,back:t-y}}else throw Error(`Unknown padding parameter: ${t}`);return{padInfo:p,outDepth:c,outHeight:h,outWidth:f}})(n,l,d,p,y,_,b,x,C,k),z=s?h*c:h,A=[0,0,0,0,0];return"channelsFirst"===o?A=[u,z,T,I,E]:"channelsLast"===o&&(A=[u,T,I,E,z]),{batchSize:u,dataFormat:o,inDepth:l,inHeight:d,inWidth:p,inChannels:c,outDepth:T,outHeight:I,outWidth:E,outChannels:z,padInfo:S,strideDepth:y,strideHeight:_,strideWidth:b,filterDepth:f,filterHeight:m,filterWidth:g,effectiveFilterDepth:x,effectiveFilterHeight:C,effectiveFilterWidth:k,dilationDepth:$,dilationHeight:v,dilationWidth:w,inShape:t,outShape:A,filterShape:i}},rA=(t,i,r,a,n,s)=>{let o="channelsLast"===s,u=(o?t[0].dims[3]:t[0].dims[1],[Math.ceil((t=>{let i=1;for(let r=0;r<t.length;r++)i*=t[r];return i})(({x:r.map((t,i)=>i)}).x.map(t=>r[t]))/64),1,1]);e0("verbose",()=>`[conv3d_naive_webgpu] dispatch = ${u}`);let l=[{type:12,data:e3.size(r)},{type:12,data:a},{type:12,data:n},{type:12,data:i.strides},{type:12,data:i.dilations}];rf(i,l),l.push(...tS(t[0].dims,t[1].dims));let d=["rank","rank"],p=3===t.length;return p&&(l.push(...tS(t[2].dims)),d.push("rank")),l.push(...tS(r)),{name:"Conv3DNaive",shaderCache:{hint:`${i.cacheKey};${o};1;${p}`,inputDependencies:d},getRunData:()=>({outputs:[{dims:r,dataType:t[0].dataType}],dispatchGroup:{x:u[0],y:u[1],z:u[2]},programUniforms:l}),getShaderSource:s=>{let u=[{name:"output_size",type:"u32"},{name:"filter_dims",type:"u32",length:a.length},{name:"pads",type:"u32",length:n.length},{name:"strides",type:"u32",length:i.strides.length},{name:"dilations",type:"u32",length:i.dilations.length}];rm(i,u);let l=tC(t[0].dataType),d=tR("x",t[0].dataType,t[0].dims.length,1),c=tR("W",t[1].dataType,t[1].dims.length,1),h=[d,c],f=tB("result",t[0].dataType,r.length,1),m="";if(p){let i=tR("bias",t[2].dataType,t[2].dims.length,1);h.push(i),m+=`
        fn getBiasByOutputCoords(coords : array<u32, 5>) -> ${l} {
          return bias[${o?tA("coords",4,5):tA("coords",1,5)}];
        }`}let g=ry(1,l),y=rh(i,g,l);return`
            ${m}
            fn getX(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${d.getByIndices("aIndices")};
            }
            fn getW(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${c.getByIndices("aIndices")};
            }
          ${s.registerUniforms(u).declareVariables(...h,f)}
          ${s.mainStart()}
          ${s.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
              let coords = ${f.offsetToIndices("global_idx")};
              let batch = ${tA("coords",0,d.rank)};
              let d2 = ${o?tA("coords",d.rank-1,d.rank):tA("coords",1,d.rank)};
              let xFRCCorner = vec3<u32>(${o?tA("coords",1,d.rank):tA("coords",2,d.rank)},
              ${o?tA("coords",2,d.rank):tA("coords",3,d.rank)},
              ${o?tA("coords",3,d.rank):tA("coords",4,d.rank)}) * uniforms.strides - uniforms.pads;
              let xFCorner = xFRCCorner.x;
              let xRCorner = xFRCCorner.y;
              let xCCorner = xFRCCorner.z;
              let xShapeY = ${o?tA("uniforms.x_shape",1,d.rank):tA("uniforms.x_shape",2,d.rank)};
              let xShapeZ = ${o?tA("uniforms.x_shape",2,d.rank):tA("uniforms.x_shape",3,d.rank)};
              let xShapeW = ${o?tA("uniforms.x_shape",3,d.rank):tA("uniforms.x_shape",4,d.rank)};
              let xShapeU = ${o?tA("uniforms.x_shape",4,d.rank):tA("uniforms.x_shape",1,d.rank)};
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
                      ${o?`let xValues = vec4<f32>(
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
                        ${o?`value += getX(batch, xF, xR, xC, inputDepthNearestVec4)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`:`value += getX(batch, inputDepthNearestVec4, xF, xR, xC)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`}
                    } else if (inputDepthVec4Remainder == 2) {
                      ${o?`let xValues = vec2<f32>(
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
                      ${o?`let xValues = vec3<f32>(
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
              ${p?"value = value + getBiasByOutputCoords(coords)":""};
              ${y}
              result[global_idx] = f32(value);
          }`}}}}),nV=q(()=>{"use strict";nf(),ny(),nC(),nM(),rO=(t,i,r,a)=>{let n=t.length>2,s=n?"value += b[output_channel];":"",o=t[0].dims,u=t[1].dims,l="NHWC"===i.format,d=l?r[3]:r[1],p=d/i.group,c=l&&p>=4?tT(d):1,h=e3.size(r)/c,f=[{type:12,data:h},{type:12,data:i.dilations},{type:12,data:[i.strides[0],i.strides[1]]},{type:12,data:[i.pads[0],i.pads[1]]},{type:12,data:p}];return rf(i,f),f.push(...tS(o,[u[0],u[1],u[2],u[3]/c])),f.push(...tS([r[0],r[1],r[2],r[3]/c])),{name:"GroupedConv",shaderCache:{hint:`${i.cacheKey}_${c}`,inputDependencies:n?["rank","rank","rank"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:a?a(r):r,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:f}),getShaderSource:a=>{let d=tB("output",t[0].dataType,r.length,c),p=tC(d.type.tensor),h=rh(i,d.type.value,p),f=tR("x",t[0].dataType,o.length),m=tR("w",t[1].dataType,u.length,c),g=[f,m];n&&g.push(tR("b",t[2].dataType,t[2].dims,c));let y=[{name:"output_size",type:"u32"},{name:"dilations",type:"u32",length:i.dilations.length},{name:"strides",type:"u32",length:2},{name:"pads",type:"u32",length:2},{name:"output_channels_per_group",type:"u32"}];rm(i,y);let _=l?`
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
  ${a.registerUniforms(y).declareVariables(...g,d)}

  ${a.mainStart()}
    ${a.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let outputIndices = ${d.offsetToIndices("global_idx")};
    let batch: u32 = outputIndices[0];
    let output_channel: u32 = outputIndices[${l?3:1}];
    let xRCCorner: vec2<u32> = vec2<u32>(outputIndices[${l?1:2}], outputIndices[${l?2:3}]) * uniforms.strides - uniforms.pads;
    let group_id: u32 = output_channel * ${c} / uniforms.output_channels_per_group;
    var in_channel_offset = group_id * uniforms.w_shape[${l?2:1}];

    var value: ${d.type.value} = ${d.type.value}(0);
    ${_}
    ${s}
    ${h}
    ${d.setByOffset("global_idx","value")}
  }`}}},rR=(t,i,r,a)=>{let n=t.length>2,s=tT(r[3]),o=tT(r[2]),u=e3.size(r)/s/o,l=[t[0].dims[0],t[0].dims[1],t[0].dims[2],t[0].dims[3]/s],d=[t[1].dims[0],t[1].dims[1],t[1].dims[2],t[1].dims[3]/s],p=[r[0],r[1],r[2],r[3]/s],c=[{type:12,data:u},{type:6,data:[i.strides[0],i.strides[1]]},{type:6,data:[i.pads[0],i.pads[1]]}];rf(i,c),c.push(...tS(l,d,p));let h=(o-1)*i.strides[1]+d[1];return{name:"GroupedConv-Vectorize",shaderCache:{hint:`${i.cacheKey};${s};${o};${h};${d[0]};${d[1]}`,inputDependencies:n?["rank","rank","type"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:a?a(r):r,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:c}),getShaderSource:r=>{let a=tB("output",t[0].dataType,p.length,s),u=tC(a.type.tensor),c=rh(i,a.type.value,u),f=tR("x",t[0].dataType,l.length,s),m=tR("w",t[1].dataType,d.length,s),g=[f,m];n&&g.push(tR("b",t[2].dataType,t[2].dims,s));let y=[{name:"output_size",type:"u32"},{name:"strides",type:"i32",length:2},{name:"pads",type:"i32",length:2}];return rm(i,y),`
  ${r.registerUniforms(y).declareVariables(...g,a)}
  ${r.mainStart()}
    ${r.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let width0 = uniforms.output_shape[3];
    let output_channel = global_idx % width0;
    var index1 = global_idx / width0;
    let width1 = uniforms.output_shape[2] / ${o}u;
    let col = (index1 % width1) * ${o}u;
    index1 = index1 / width1;
    let row = index1 % uniforms.output_shape[1];
    let batch = index1 / uniforms.output_shape[1];

    let x_corner = vec2<i32>(i32(row), i32(col)) * uniforms.strides - uniforms.pads;

    var x_vals: array<${f.type.value}, ${h}>;
    var values: array<${a.type.value}, ${o}>;
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
          for (var i = 0u; i < ${o}u; i++) {
            values[i] = fma(x_vals[i * u32(uniforms.strides[1]) + w_width], w_val, values[i]);
          }
        }
      }
    }

    for (var i = 0u; i < ${o}u; i++) {
      var value = values[i];
      ${n?"value += b[output_channel];":""}
      ${c}
      ${a.set("batch","row","col + i","output_channel","value")};
    }
  }`}}}}),nG=q(()=>{"use strict";ny(),nW(),nL(),nq(),nV(),nM(),nU(),nk(),rB=[2,3,1,0],rN=(t,i)=>{let r=t.kernelShape.slice();r.length<i[1].dims.length-2&&r.push(...Array(i[1].dims.length-2-r.length).fill(0));for(let t=2;t<i[1].dims.length;++t)0===r[t-2]&&(r[t-2]=i[1].dims[t]);let a=t.pads.slice();e4.adjustPadsBasedOnAutoPad(i[0].dims,t.strides,t.dilations,r,a,"NHWC"===t.format,t.autoPad);let n=Object.assign({},t);return Object.assign(n,{kernelShape:r,pads:a}),n},rM=t=>{let i=rg(t),r=t.format;return{autoPad:["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][t.auto_pad],format:r,dilations:t.dilations,group:t.group,kernelShape:t.kernel_shape,pads:t.pads,strides:t.strides,wIsConst:t.w_is_const(),...i,cacheKey:`${t.format};${i.activation};`}},rD=(t,i,r,a)=>{var n,s,o,u,l,d;let p,c,h,f,m,g,y="NHWC"===r.format,_=(n=i[0].dims,s=i[1].dims,o=r.dilations,u=r.pads,l=r.strides,d=y,p=n[0],h=(c=n.slice(d?1:2,d?3:4)).length,f=s[0],m=s.slice(2).map((t,i)=>t+(t-1)*(o[i]-1)),(g=c.map((t,i)=>t+u[i]+u[i+h]).map((t,i)=>Math.floor((t-m[i]+l[i])/l[i]))).splice(0,0,p),g.splice(d?3:1,0,f),g);if(1!==r.group){let n=[i[0]];if(y){let a=t.kernelCustomData.wT??t.compute(tq(i[1],rB),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!t.kernelCustomData.wT&&(t.kernelCustomData.wT=a),n.push(a)}else n.push(i[1]);3===i.length&&n.push(i[2]),!t.adapterInfo.isArchitecture("ampere")&&y&&i[1].dims[0]===r.group&&1===i[1].dims[1]&&1===r.dilations[0]&&1===r.dilations[1]?t.compute(rR(n,r,_,a),{inputs:n}):t.compute(rO(n,r,_,a),{inputs:n});return}let b=3===i.length,$=i[0].dims[y?1:2],v=i[0].dims[y?2:3],w=i[0].dims[y?3:1],x=i[1].dims[2],C=i[1].dims[3],k=_[y?1:2],S=_[y?2:3],T=_[y?3:1],I=y&&x===$&&C===v&&0===r.pads[0]&&0===r.pads[1];if(I||1===x&&1===C&&1===r.dilations[0]&&1===r.dilations[1]&&1===r.strides[0]&&1===r.strides[1]&&0===r.pads[0]&&0===r.pads[1]){let n=_[0],s,o,u,l=[];if(y){let a=t.kernelCustomData.wT??t.compute(tq(i[1],rB),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];if(r.wIsConst&&!t.kernelCustomData.wT&&(t.kernelCustomData.wT=a),I){let t=$*v*w;s=i[0].reshape([1,n,t]),o=a.reshape([1,t,T]),u=[1,n,T]}else s=i[0].reshape([n,$*v,w]),o=a.reshape([1,w,T]),u=[n,k*S,T];l.push(s),l.push(o)}else s=i[0].reshape([n,w,$*v]),o=i[1].reshape([1,T,w]),u=[n,T,k*S],l.push(o),l.push(s);b&&l.push(i[2]);let d=u[2],p=l[0].dims[l[0].dims.length-1];d<8&&p<8?t.compute(rv(l,r,_,u,y,a),{inputs:l}):t.compute(rk(l,r,_,u,y,a),{inputs:l});return}let E=t.kernelCustomData.wT??t.compute(tq(i[1],rB),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!t.kernelCustomData.wT&&(t.kernelCustomData.wT=E);let z=[i[0],E];b&&z.push(i[2]);let A=y?k*S:T,O=y?T:k*S,R=x*C*w;t.compute(rS(z,r,_,A,O,R,b,!0,a),{inputs:z})},rP=(t,i)=>{var r,a,n,s,o;if(((t,i)=>{if(!t||2!==t.length&&3!==t.length)throw Error("Conv requires 2 or 3 inputs");if(t[0].dims.length>5)throw Error("greater than 5D is not supported");if(t[0].dims.length!==t[1].dims.length)throw Error("filter does not have same dimension as input");if(t[0].dims["NHWC"===i.format?t[0].dims.length-1:1]!==t[1].dims[1]*i.group)throw Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");if(3===t.length&&(1!==t[2].dims.length||t[1].dims[0]!==t[2].dims[0]))throw Error("invalid bias");let r=t[0].dims.length-2;if(i.dilations.length!==r)throw Error(`dilations should be ${r}D`);if(i.strides.length!==r)throw Error(`strides should be ${r}D`);if(i.pads.length!==2*r)throw Error(`pads should be ${2*r}D`);if(0!==i.kernelShape.length&&i.kernelShape.length!==t[1].dims.length-2)throw Error("invalid kernel shape")})(t.inputs,i),3===t.inputs[0].dims.length){let n,s,o,u,l,d,p;r=t,n="NHWC"===(a=i).format,s=[r.inputs[0].reshape(n?[r.inputs[0].dims[0],1,r.inputs[0].dims[1],r.inputs[0].dims[2]]:[r.inputs[0].dims[0],r.inputs[0].dims[1],1,r.inputs[0].dims[2]]),r.inputs[1].reshape([r.inputs[1].dims[0],r.inputs[1].dims[1],1,r.inputs[1].dims[2]])],3===r.inputs.length&&s.push(r.inputs[2]),o=[0,a.pads[0],0,a.pads[1]],u=[1].concat(a.strides),l=[1].concat(a.dilations),d=[1].concat(a.kernelShape),p=rN({...a,pads:o,strides:u,dilations:l,kernelShape:d},s),rD(r,s,p,t=>n?[t[0],t[2],t[3]]:[t[0],t[1],t[3]])}else if(5===t.inputs[0].dims.length){let r,a,u,l;n=t,s=t.inputs,r="NHWC"===(o=i).format?"channelsLast":"channelsFirst",a=rN(o,s),u="NOTSET"===o.autoPad?o.pads:o.autoPad,l=rz(s[0].dims,s[1].dims,o.strides,o.dilations,u,!1,r),n.compute(rA(s,a,l.outShape,[l.filterDepth,l.filterHeight,l.filterWidth],[l.padInfo.front,l.padInfo.top,l.padInfo.left],r))}else{let r=rN(i,t.inputs);rD(t,t.inputs,r)}}}),nj=q(()=>{"use strict";nf(),ng(),ny(),nC(),rU=(t,i,r)=>{let a=t.length>2,n=i.outputShape,s="NHWC"===i.format,o=i.group,u=t[1].dims,l=u[2]/o,d=u[3],p=s?tT(l):1,c=s&&1===d&&l>=4,h=c?4*Math.floor(l/4):Math.floor(l/p)*p,f=l-h,m=s?tT(d):1,g=s?1===d?p:m:1,y=e3.size(n)/m,_=[Math.ceil(y/64),1,1];e0("verbose",()=>`[conv2d_backprop_webgpu] dispatch = ${_}`);let b=["rank","rank"],$=[i.strides[0],i.strides[1]],v=[i.kernelShape[s?1:2],i.kernelShape[s?2:3]],w=[i.dilations[0],i.dilations[1]],x=[v[0]+(i.dilations[0]<=1?0:(i.kernelShape[s?1:2]-1)*(i.dilations[0]-1)),v[1]+(i.dilations[1]<=1?0:(i.kernelShape[s?2:3]-1)*(i.dilations[1]-1))],C=[x[0]-1-Math.floor((i.pads[0]+i.pads[2])/2),x[1]-1-Math.floor((i.pads[1]+i.pads[3])/2)],k=[{type:12,data:y},{type:12,data:$},{type:12,data:v},{type:12,data:w},{type:12,data:x},{type:6,data:C},{type:12,data:h},{type:12,data:l},{type:12,data:d},...tS(t[0].dims,t[1].dims)];return a&&(k.push(...tS(t[2].dims)),b.push("rank")),k.push(...tS(n)),{name:"ConvTranspose2D",shaderCache:{hint:`${i.cacheKey};${p}${g}${m}${c}${f}`,inputDependencies:b},getRunData:()=>({dispatchGroup:{x:_[0],y:_[1],z:_[2]},outputs:[{dims:r?r(n):n,dataType:t[0].dataType}],programUniforms:k}),getShaderSource:i=>{let r=[{name:"output_size",type:"u32"},{name:"strides",type:"u32",length:$.length},{name:"filter_dims",type:"u32",length:v.length},{name:"dilations",type:"u32",length:v.length},{name:"effective_filter_dims",type:"u32",length:x.length},{name:"pads",type:"i32",length:C.length},{name:"input_channels_per_group_int",type:"u32"},{name:"input_channels_per_group",type:"u32"},{name:"output_channels_per_group",type:"u32"}],o=tC(t[0].dataType),u=s?1:2,l=s?2:3,d=s?3:1,h=tR("W",t[1].dataType,t[1].dims.length,g),y=tR("Dy",t[0].dataType,t[0].dims.length,p),_=[y,h];a&&_.push(tR("bias",t[2].dataType,[n[d]].length,m));let b=tB("result",t[0].dataType,n.length,m),w=`
            let outputIndices = ${b.offsetToIndices(`global_idx * ${m}`)};
            let batch = ${b.indicesGet("outputIndices",0)};
            let d1 = ${b.indicesGet("outputIndices",d)};
            let r = ${b.indicesGet("outputIndices",u)};
            let c = ${b.indicesGet("outputIndices",l)};
            let dyCorner = vec2<i32>(i32(r), i32(c)) - uniforms.pads;
            let dyRCorner = dyCorner.x;
            let dyCCorner = dyCorner.y;
            let groupId = d1 / uniforms.output_channels_per_group;
            let wOutChannel = d1 - groupId * uniforms.output_channels_per_group;
            // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
            // ? = to be determined. : = across all values in that axis.
            var dotProd = ${b.type.value}(0.0);
            var wR: u32 = 0;
            if (uniforms.dilations.x == 1) {
              // Minimum wR >= 0 that satisfies (dyRCorner + wR) % (uniforms.strides.x) == 0
              wR = u32(((dyRCorner + i32(uniforms.strides.x) - 1) / i32(uniforms.strides.x)) * i32(uniforms.strides.x) - dyRCorner);
            }
            for (; wR < uniforms.effective_filter_dims.x; wR = wR + 1) {
              if (wR % uniforms.dilations.x != 0) {
                continue;
              }
              let dyR = (${o}(dyRCorner) + ${o}(wR)) / ${o}(uniforms.strides[0]);
              let wRPerm = uniforms.filter_dims.x - 1 - wR / uniforms.dilations.x;
              if (dyR < 0.0 || dyR >= ${o}(uniforms.Dy_shape[${u}]) || fract(dyR) > 0.0 ||
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
                let dyC = (${o}(dyCCorner) + ${o}(wC)) / ${o}(uniforms.strides.y);
                let wCPerm = uniforms.filter_dims.y - 1 - wC / uniforms.dilations.y;
                if (dyC < 0.0 || dyC >= ${o}(uniforms.Dy_shape[${l}]) ||
                    fract(dyC) > 0.0 || wCPerm < 0) {
                  continue;
                }
                let idyC: u32 = u32(dyC);
                var inputChannel = groupId * uniforms.input_channels_per_group;
                ${c?`
                var x_offset = ${y.indicesToOffset(`${y.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${p};
                var w_offset = ${h.indicesToOffset(`${h.type.indices}(wRPerm, wCPerm, inputChannel, wOutChannel)`)} / ${g};
                  `:""}
                for (var d2: u32 = 0; d2 < uniforms.input_channels_per_group_int; d2 = d2 + ${c?4:p}) {
                  ${(()=>{let t="";if(c)4===p?t+=`
        let xValue = ${y.getByOffset("x_offset")};
        let wValue = ${h.getByOffset("w_offset")};
        dotProd = dotProd + dot(xValue, wValue);
        x_offset += 1u;
        w_offset += 1u;`:2===p?t+=`
          dotProd = dotProd + dot(vec4<${o}>(${y.getByOffset("x_offset")}, ${y.getByOffset("x_offset + 1u")}), vec4<${o}>(${h.getByOffset("w_offset")}, ${h.getByOffset("w_offset + 1u")}));
          x_offset += 2u;
          w_offset += 2u;`:1===p&&(t+=`
          dotProd = dotProd + dot(vec4<${o}>(${y.getByOffset("x_offset")}, ${y.getByOffset("x_offset + 1u")}, ${y.getByOffset("x_offset + 2u")}, ${y.getByOffset("x_offset + 3u")}), vec4<${o}>(${h.getByOffset("w_offset")}, ${h.getByOffset("w_offset + 1u")}, ${h.getByOffset("w_offset + 2u")}, ${h.getByOffset("w_offset + 3u")}));
          x_offset += 4u;
          w_offset += 4u;`);else if(t+=`
                  let xValue = ${s?y.getByOffset(`${y.indicesToOffset(`${y.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${p}`):y.get("batch","inputChannel","idyR","idyC")};
        `,1===p)t+=`
          let w_offset = ${h.indicesToOffset(`${h.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel, wOutChannel)`)};
          let wValue = ${h.getByOffset(`w_offset / ${g}`)};
          dotProd = dotProd + xValue * wValue;`;else for(let i=0;i<p;i++)t+=`
            let wValue${i} = ${h.getByOffset(`${h.indicesToOffset(`${h.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel + ${i}, wOutChannel)`)} / ${g}`)};
            dotProd = dotProd + xValue[${i}] * wValue${i};`;return t})()}
                  inputChannel = inputChannel + ${c?4:p};
                }
                ${(()=>{if(0===f)return"";if(!c)throw Error(`packInputAs4 ${c} is not true.`);let t="";if(1===p){t+="dotProd = dotProd";for(let i=0;i<f;i++)t+=`
            + ${y.getByOffset(`x_offset + ${i}`)} * ${h.getByOffset(`w_offset + ${i}`)}`;t+=";"}else if(2===p){if(2!==f)throw Error(`Invalid inputChannelsRemainder ${f}.`);t+=`
          let xValue = ${y.getByOffset("x_offset")};
          let wValue = ${h.getByOffset("w_offset")};
          dotProd = dotProd + dot(xValue, wValue);`}return t})()}
                wC = wC + uniforms.strides.y - 1;
              }
              wR = wR + uniforms.strides[0] - 1;
            }
            let value = dotProd${a?` + bias[d1 / ${m}]`:""};
            ${b.setByOffset("global_idx","value")};
          `;return`
    ${i.registerUniforms(r).declareVariables(..._,b)}
      ${i.mainStart()}
      ${i.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")};
    ${w}}`}}}}),nH=q(()=>{"use strict";nj(),nM(),nk(),rq=(t,i,r,a,n,s)=>(t-1)*i+r+(a-1)*n+1-s,rW=(t,i,r,a,n)=>{let s=Math.floor(t/2);"SAME_UPPER"===i?(r[a]=s,r[n]=t-s):"SAME_LOWER"===i&&(r[a]=t-s,r[n]=s)},rL=(t,i)=>{let r=t.kernelShape.slice();if(0===t.kernelShape.length||0===t.kernelShape.reduce((t,i)=>t*i,1)){r.length=0;for(let t=2;t<i[1].dims.length;++t)r.push(i[1].dims[t])}let a="NHWC"===t.format;r.splice(0,0,i[1].dims[0]),r.splice(a?3:1,0,i[1].dims[1]);let n=t.pads.slice(),s=t.outputShape.slice(),o=t.outputPadding.slice(),u=i[0].dims,l=t.dilations.slice();0===l.reduce((t,i)=>t+i,0)&&(l=Array(i[0].dims.length-2).fill(1));let d=t.strides.slice();0===d.reduce((t,i)=>t+i,0)&&(d=Array(i[0].dims.length-2).fill(1)),((t,i,r,a,n,s,o,u,l,d)=>{let p=t.length-2,c=0===d.length;l.length<p&&l.push(...Array(p-l.length).fill(0));let h=t[0],f=i[u?3:1]*n;for(let n=0,h=t.length-p-!!u;n<p;++n,++h){let u=t[h],f=c?u*o[n]:d[n];rW(rq(u,o[n],s[n],i[h],r[n],f),a,s,n,n+p),c&&d.push(o[n]*(u-1)+l[n]+(i[h]-1)*r[n]+1-s[n]-s[n+p])}d.splice(0,0,h),d.splice(u?3:1,0,f)})(u,r,l,t.autoPad,t.group,n,d,a,o,s);let p=Object.assign({},t);return Object.assign(p,{kernelShape:r,pads:n,outputPadding:o,outputShape:s,dilations:l,strides:d}),p},rV=t=>{let i=rg(t),r=t.format,a=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][typeof t.autoPad>"u"?0:t.autoPad],n=t.dilations,s=t.group,o=t.kernelShape,u=t.pads,l=t.strides,d=t.wIsConst();return{autoPad:a,format:r,dilations:n,group:s,kernelShape:o,outputPadding:t.outputPadding,outputShape:t.outputShape,pads:u,strides:l,wIsConst:d,...i,cacheKey:`${t.format};${i.activation};`}},rG=(t,i,r,a)=>{let n=t.kernelCustomData.wT??t.compute(tq(i[1],[2,3,0,1]),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!t.kernelCustomData.wT&&(t.kernelCustomData.wT=n);let s=[i[0],n];3===i.length&&s.push(i[2]),t.compute(rU(s,r,a),{inputs:s})},rj=(t,i)=>{if(((t,i)=>{if(!t||2!==t.length&&3!==t.length)throw Error("Conv requires 2 or 3 inputs");if(4!==t[0].dims.length&&3!==t[0].dims.length)throw Error("currently only support 2-dimensional conv");if(t[0].dims.length!==t[1].dims.length)throw Error("filter does not have same dimension as input");if(t[0].dims["NHWC"===i.format?t[0].dims.length-1:1]!==t[1].dims[0])throw Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");let r=t[1].dims[1]*i.group;if(3===t.length&&(1!==t[2].dims.length||t[2].dims[0]!==r))throw Error("invalid bias");let a=t[0].dims.length-2;if(i.dilations.reduce((t,i)=>t+i,0)>0&&i.dilations.length!==a)throw Error(`dilations should be ${a}D`);if(i.strides.reduce((t,i)=>t+i,0)>0&&i.strides.length!==a)throw Error(`strides should be ${a}D`);if(i.pads.reduce((t,i)=>t+i,0)>0&&i.pads.length!==2*a)throw Error(`pads should be ${2*a}D`);if(i.outputPadding.length!==a&&0!==i.outputPadding.length)throw Error(`output_padding should be ${a}D`);if(i.kernelShape.reduce((t,i)=>t+i,0)>0&&0!==i.kernelShape.length&&i.kernelShape.length!==t[1].dims.length-2)throw Error("invalid kernel shape");if(0!==i.outputShape.length&&i.outputShape.length!==t[0].dims.length-2)throw Error("invalid output shape")})(t.inputs,i),3===t.inputs[0].dims.length){var r,a;let n,s,o,u,l,d,p,c;r=t,n="NHWC"===(a=i).format,s=[r.inputs[0].reshape(n?[r.inputs[0].dims[0],1,r.inputs[0].dims[1],r.inputs[0].dims[2]]:[r.inputs[0].dims[0],r.inputs[0].dims[1],1,r.inputs[0].dims[2]]),r.inputs[1].reshape([r.inputs[1].dims[0],r.inputs[1].dims[1],1,r.inputs[1].dims[2]])],3===r.inputs.length&&s.push(r.inputs[2]),(0===(o=a.kernelShape).length||0===o[0])&&(o=[r.inputs[1].dims[2]]),(0===(u=a.dilations).length||0===u[0])&&(u=[1]),(0===(l=a.strides).length||0===l[0])&&(l=[1]),0===(d=a.pads).length&&(d=[0,0]),d=[0,d[0],0,d[1]],l=[1].concat(l),u=[1].concat(u),o=[1].concat(o),p=[0].concat(p=a.outputPadding),c=rL({...a,pads:d,strides:l,dilations:u,kernelShape:o,outputPadding:p},s),rG(r,s,c,t=>n?[t[0],t[2],t[3]]:[t[0],t[1],t[3]])}else{let r=rL(i,t.inputs);rG(t,t.inputs,r)}}}),nF=q(()=>{"use strict";nf(),ny(),nx(),nC(),rH=(t,i)=>{var r,a,n,s;let o,u,l,d,p,c,h=t.inputs[0].dims,f=t.inputs[0].dataType,m=t.inputs[1];t.compute((r=f,a=h,n=m,s=i,o=e3.size(a),u=a.length,l=tR("input",r,u),d=tB("output",r,u),p=6===n.dataType?n.getInt32Array()[0]:Number(n.getBigInt64Array()[0]),c=e3.normalizeAxis(p,u),{name:"CumSum",shaderCache:{hint:s.cacheKey,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:a,dataType:r}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:[{type:12,data:o},{type:12,data:c},...tS(a,a)]}),getShaderSource:t=>{let i=` i32(${l.indicesGet("inputIndices","uniforms.axis")}) `,r=tA("uniforms.input_shape","uniforms.axis",u),a=s.reverse?i+(s.exclusive?" + 1":""):"0",n=s.reverse?r:i+(s.exclusive?"":" + 1");return`
                ${t.registerUniform("outputSize","u32").registerUniform("axis","u32").declareVariables(l,d)}
                ${t.mainStart()}
                  ${t.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
                  var inputIndices = ${d.offsetToIndices("global_idx")};
                  var sum = ${d.type.value}(0);
                  let first : i32 = ${a};
                  let last : i32 = ${n};
                  for (var i : i32 = first; i < last; i++) {
                    ${l.indicesSet("inputIndices","uniforms.axis","u32(i)")};
                    sum = sum + ${l.getByIndices("inputIndices")};
                  }
                  ${d.setByOffset("global_idx","sum")};
                }`}}),{inputs:[0]})},rF=t=>{let i=1===t.exclusive,r=1===t.reverse;return tv({exclusive:i,reverse:r})}}),nK=q(()=>{"use strict";nf(),ny(),nx(),nC(),rK=(t,i)=>{var r,a;let n,s,o,u,l,d,p,c,h,f,m,g,y,_;(t=>{if(!t||1!==t.length)throw Error("DepthToSpace requires 1 input.");if(4!==t[0].dims.length)throw Error("DepthToSpace requires 4D input.")})(t.inputs),t.compute((r=t.inputs[0],p="NHWC"===(a=i).format,c=a.blocksize,h="DCR"===a.mode,p?([n,s,o,u]=r.dims,l=h?[n,s,o,c,c,u/c**2]:[n,s,o,u/c**2,c,c],d=h?[0,1,3,2,4,5]:[0,1,4,2,5,3]):([n,s,o,u]=[r.dims[0],r.dims[2],r.dims[3],r.dims[1]],l=h?[n,c,c,u/c**2,s,o]:[n,u/c**2,c,c,s,o],d=h?[0,3,4,1,5,2]:[0,1,4,2,5,3]),m=(f=r.reshape(l)).dims.length,g=r.dataType,y=tR("a",g,m),_=tB("output",g,m),{name:"DepthToSpace",shaderCache:{hint:`${r.dims};${a.blocksize};${a.mode}`,inputDependencies:["rank"]},getRunData:t=>{let i=p?[n,s*c,o*c,u/c**2]:[n,u/c**2,s*c,o*c],r=e3.size(i),a=f.dims,l=e3.sortBasedOnPerm(a,d);return{outputs:[{dims:i,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(r/64)},programUniforms:[{type:12,data:r},...tS(a,l)]}},getShaderSource:t=>`
  ${t.registerUniform("output_size","u32").declareVariables(y,_)}

  ${((t,i,r,a)=>{let n=[];n.push(`fn perm(i: ${a.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`);for(let a=0;a<i;++a)n.push(r.indicesSet("a",t[a],`i[${a}]`));return n.push("return a;}"),n.join(`
`)})(d,m,y,_)}

  ${t.mainStart()}
    ${t.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${_.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${_.setByOffset("global_idx",y.getByIndices("aIndices"))}
  }`}))},rZ=t=>tv({blocksize:t.blocksize,mode:t.mode,format:t.format})}),nZ=q(()=>{"use strict";nf(),ny(),nx(),nC(),rY="^"+(rX="("+(rQ="[a-zA-Z]|\\.\\.\\.")+")+")+"$",rJ="^"+("("+rX+",)*")+rX+"$",r0=class{constructor(t=-1){this.symbolToIndices=new Map,this.inputIndex=t}addSymbol(t,i){let r=this.symbolToIndices.get(t);void 0===r?r=[i]:r.push(i),this.symbolToIndices.set(t,r)}},r2=class{constructor(t,i){this.equation=i,this.hasEllipsis=!1,this.symbolToInfo=new Map,this.lhs=[],this.outputDims=[];let[r,a]=i.includes("->")?i.split("->",2):[i,""];if(!r.match(RegExp(rJ)))throw Error("Invalid LHS term");if(r.split(",").forEach((i,r)=>{let a=t[r].dims.slice();if(!i.match(RegExp(rY)))throw Error("Invalid LHS term");let n=this.processTerm(i,!0,a,r);this.lhs.push(n)}),""===a)a+=[...this.symbolToInfo.entries()].filter(([t,i])=>1===i.count||"..."===t).map(([t])=>t).join("");else if(!a.match(RegExp(rX)))throw Error("Invalid RHS");a.match(RegExp(rQ,"g"))?.forEach(t=>{if("..."===t)this.outputDims=this.outputDims.concat(this.ellipsisDims);else{let i=this.symbolToInfo.get(t);if(void 0===i)throw Error("Invalid RHS symbol");this.outputDims.push(i.dimValue)}}),this.rhs=this.processTerm(a,!1,this.outputDims)}addSymbol(t,i,r){let a=this.symbolToInfo.get(t);if(void 0!==a){if(a.dimValue!==i&&1!==a.count)throw Error("Dimension mismatch");a.count++,a.inputIndices.push(r)}else a={count:1,dimValue:i,inputIndices:[r]};this.symbolToInfo.set(t,a)}processTerm(t,i,r,a=-1){let n=r.length,s=!1,o=[],u=0;if(!t.match(RegExp(rY))&&!i&&""!==t)throw Error("Invalid LHS term");let l=t.match(RegExp(rQ,"g")),d=new r0(a);return l?.forEach((t,p)=>{if("..."===t){if(s)throw Error("Only one ellipsis is allowed per input term");s=!0;let t=n-l.length+1;if(t<0)throw Error("Ellipsis out of bounds");if(o=r.slice(u,u+t),this.hasEllipsis){if(this.ellipsisDims.length!==o.length||this.ellipsisDims.toString()!==o.toString())throw Error("Ellipsis dimensions mismatch")}else if(i)this.hasEllipsis=!0,this.ellipsisDims=o;else throw Error("Ellipsis must be specified in the LHS");for(let t=0;t<o.length;t++){let i=String.fromCharCode(48+t);d.addSymbol(i,p+t),this.addSymbol(i,r[u++],a)}}else d.addSymbol(t,p+(this.hasEllipsis?this.ellipsisDims.length-1:0)),this.addSymbol(t,r[u++],a)}),d}},r1=(t,i)=>{var r,a,n,s;let o,u,l,d,p=new r2(t.inputs,i.equation),c=p.outputDims,h=t.inputs.map((t,i)=>t.dims);t.compute((r=h,a=t.inputs[0].dataType,n=p,s=c,o=r.map(t=>t.length).map((t,i)=>tR(`input${i}`,a,t)),u=e3.size(s),l=tB("output",a,s.length),d=[...n.symbolToInfo.keys()].filter(t=>!n.rhs.symbolToIndices.has(t)),{name:"Einsum",shaderCache:{hint:n.equation,inputDependencies:r.map(()=>"rank")},getRunData:()=>{let t=d.filter(t=>n.symbolToInfo.has(t)).map(t=>({type:12,data:n.symbolToInfo.get(t)?.dimValue||0}));t.push({type:12,data:u});let i=r.map((t,i)=>[...tS(t)]).reduce((t,i)=>t.concat(i),t);return i.push(...tS(s)),{outputs:[{dims:s,dataType:a}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:i}},getShaderSource:t=>{let i=[],r=[],a=[],s=[],u=[],p=n.symbolToInfo.size===n.rhs.symbolToIndices.size;n.symbolToInfo.forEach((t,d)=>{if(n.rhs.symbolToIndices.has(d)){let r=n.rhs.symbolToIndices.get(d)?.[0];void 0!==r&&n.lhs.forEach((a,n)=>{if(t.inputIndices.includes(n)){let t=a.symbolToIndices.get(d);if(void 0===t)throw Error("Invalid symbol error");t.forEach(t=>{i.push(`${o[n].indicesSet(`input${n}Indices`,t,l.indicesGet("outputIndices",r))}`)})}})}else n.lhs.forEach((i,a)=>{if(t.inputIndices.includes(a)){let t=i.symbolToIndices.get(d);if(void 0===t)throw Error("Invalid symbol error");t.forEach(t=>{r.push(`${o[a].indicesSet(`input${a}Indices`,t,`${d}`)}`)}),u.push(`prod *= ${o[a].getByIndices(`input${a}Indices`)};`)}}),a.push(`for(var ${d}: u32 = 0; ${d} < uniforms.${d+"_max"}; ${d}++) {`),s.push("}")});let c=p?[...i,`let sum = ${o.map((t,i)=>t.getByIndices(`input${i}Indices`)).join(" * ")};`]:[...i,"var sum = 0.0;",...a,...r,"var prod = 1.0;",...u,"sum += prod;",...s];return`
            ${t.registerUniforms(d.map(t=>({name:`${t+"_max"}`,type:"u32"}))).registerUniform("outputSize","u32").declareVariables(...o,l)}

            ${t.mainStart()}
            ${t.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
            var outputIndices = ${l.offsetToIndices("global_idx")};
            ${o.map((t,i)=>`var input${i}Indices: ${o[i].type.indices};`).join(`
`)}
            ${c.join(`
`)};
            ${l.setByOffset("global_idx","sum")};
          }`}}))},r3=t=>{let i=t.equation.replace(/\s+/g,"");return tv({equation:i})}}),nQ=q(()=>{"use strict";nf(),ny(),nC(),r4=(t,i)=>{let r=t.length-i.length,a=[];for(let i=0;i<r;++i)a.push(t[i]);for(let n=0;n<i.length;++n)a.push(1===i[n]?t[n+r]:i[n]);return a},r6=t=>{var i;let r,a,n,s,o,u,l,d,p,c;(t=>{if(!t||2!==t.length)throw Error("Expand requires 2 input.");let i=t[0].dims,r=Array.from(t[1].getBigInt64Array(),Number),a=r.length<i.length?0:r.length-i.length,n=i.length<r.length?0:i.length-r.length;for(;a<r.length&&n<i.length;++a,++n)if(r[a]!==i[n]&&1!==r[a]&&1!==i[n])throw Error("Expand requires shape to be broadcastable to input")})(t.inputs),t.compute((s=(r=n=(i=t.inputs)[0].dims,a=Array.from(i[1].getBigInt64Array(),Number),r.length>a.length?r4(r,a):r4(a,r)),u=9===(o=i[0].dataType)||1===e3.size(n),l=9===o||n.length>0&&n[n.length-1]%4==0?4:1,d=u||s.length>0&&s[s.length-1]%4==0?4:1,c=[{type:12,data:p=Math.ceil(e3.size(s)/d)},...tS(n,s)],{name:"Expand",shaderCache:{hint:`${s.length};${l}${d}`,inputDependencies:["rank"]},getShaderSource:t=>{let i=tR("input",o,n.length,l),r=tB("output",o,s.length,d),a;if(9===o){let t=(t,a,n="")=>`
          let outputIndices${a} = ${r.offsetToIndices(`outputOffset + ${a}u`)};
          let offset${a} = ${i.broadcastedIndicesToOffset(`outputIndices${a}`,r)};
          let index${a} = offset${a} / 4u;
          let component${a} = offset${a} % 4u;
          ${t}[${a}] = ${n}(${i.getByOffset(`index${a}`)}[component${a}]);
        `;a=`
        let outputOffset = global_idx * ${d};
        var data = vec4<u32>(0);
        ${t("data",0,"u32")}
        ${t("data",1,"u32")}
        ${t("data",2,"u32")}
        ${t("data",3,"u32")}
        ${r.setByOffset("global_idx","data")}
      }`}else a=`
        let outputIndices = ${r.offsetToIndices(`global_idx * ${d}`)};
        let inputOffset = ${i.broadcastedIndicesToOffset("outputIndices",r)};
        let data = ${r.type.value}(${i.getByOffset(`inputOffset / ${l}`)});
        ${r.setByOffset("global_idx","data")}
      }`;return`
    ${t.registerUniform("vec_size","u32").declareVariables(i,r)}
    ${t.mainStart()}
    ${t.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
    ${a}`},getRunData:()=>({outputs:[{dims:s,dataType:i[0].dataType}],dispatchGroup:{x:Math.ceil(p/64)},programUniforms:c})}),{inputs:[0]})}}),nX=q(()=>{"use strict";nf(),ny(),nC(),nO(),r8=t=>{var i;let r,a,n,s;t.inputs.length<2||0===e3.size(t.inputs[1].dims)?i4(t):t.compute((r=(i=t.inputs)[0].dataType,a=e3.size(i[0].dims),s=(n=e3.size(i[1].dims))%4==0,{name:"FastGeluWithBias",shaderCache:{hint:`${s}`,inputDependencies:["type","type"]},getShaderSource:t=>{let i=tR("x",r,[1],4),a=tR("bias",r,[1],4),n=tB("y",r,[1],4),o=t=>`
      let bias${t}_offset: u32 = (global_idx * 4 + ${t}) % uniforms.bias_size;
      let bias${t} = ${a.getByOffset(`bias${t}_offset / 4`)}[bias${t}_offset % 4];`,u=s?`
      let bias = ${a.getByOffset("global_idx % (uniforms.bias_size / 4)")};`:`${o(0)}${o(1)}${o(2)}${o(3)}
      let bias = ${i.type.value}(bias0, bias1, bias2, bias3);`;return`${t.registerUniforms([{name:"output_vec_size",type:"u32"},{name:"bias_size",type:"u32"}]).declareVariables(i,a,n)}

    ${i1(tk(r))}

    ${t.mainStart(tw)}
      ${t.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_vec_size")}

      let x = ${i.getByOffset("global_idx")};
      ${u}
      let x_in = x + bias;
      ${n.setByOffset("global_idx",i3("x_in"))}
    }`},getRunData:t=>({outputs:[{dims:t[0].dims,dataType:t[0].dataType}],programUniforms:[{type:12,data:Math.ceil(a/4)},{type:12,data:n}],dispatchGroup:{x:Math.ceil(a/tw/4)}})}))}}),nY=q(()=>{"use strict";nf(),ny(),nx(),nC(),r5=t=>tv({axis:t.axis}),r9=(t,i)=>{var r,a;let n,s,o,u,l,d,p,c,h;(t=>{if(!t||2!==t.length)throw Error("Gather requires 2 inputs.")})(t.inputs),t.compute((r=t.inputs,a=i,n=r[0].dims,s=r[1].dims,o=n.length,u=e3.normalizeAxis(a.axis,o),(l=n.slice(0)).splice(u,1,...s),d=n[u],p=9===r[0].dataType?4:1,h=[{type:12,data:c=Math.ceil(e3.size(l)/p)},{type:6,data:d},{type:12,data:u},...tS(r[0].dims,r[1].dims,l)],{name:"Gather",shaderCache:{hint:a.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:l,dataType:r[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:h}),getShaderSource:t=>{let i=tR("data",r[0].dataType,r[0].dims.length,p),a=tR("inputIndices",r[1].dataType,r[1].dims.length),n=tB("output",r[0].dataType,l.length,p),d=t=>{let r=s.length,n=`var indicesIndices${t}  = ${a.type.indices}(0);`;for(let i=0;i<r;i++)n+=`${r>1?`indicesIndices${t}[${i}]`:`indicesIndices${t}`} = ${l.length>1?`outputIndices${t}[uniforms.axis + ${i}]`:`outputIndices${t}`};`;n+=`
          var idx${t} = ${a.getByIndices(`indicesIndices${t}`)};
          if (idx${t} < 0) {
            idx${t} = idx${t} + uniforms.axisDimLimit;
          }
          var dataIndices${t} : ${i.type.indices};
        `;for(let i=0,a=0;i<o;i++)i===u?(n+=`${o>1?`dataIndices${t}[${i}]`:`dataIndices${t}`} = u32(idx${t});`,a+=r):(n+=`${o>1?`dataIndices${t}[${i}]`:`dataIndices${t}`} = ${l.length>1?`outputIndices${t}[${a}]`:`outputIndices${t}`};`,a++);return n},c;if(9===r[0].dataType){let t=(t,r,a="")=>`
          let outputIndices${r} = ${n.offsetToIndices(`outputOffset + ${r}u`)};
          ${d(r)};
          let offset${r} = ${i.indicesToOffset(`dataIndices${r}`)};
          let index${r} = offset${r} / 4u;
          let component${r} = offset${r} % 4u;
          ${t}[${r}] = ${a}(${i.getByOffset(`index${r}`)}[component${r}]);
        `;c=`
        let outputOffset = global_idx * ${p};
        var value = vec4<u32>(0);
        ${t("value",0,"u32")}
        ${t("value",1,"u32")}
        ${t("value",2,"u32")}
        ${t("value",3,"u32")}
        ${n.setByOffset("global_idx","value")}
      `}else c=`
      let outputIndices = ${n.offsetToIndices("global_idx")};
      ${d("")};
      let value = ${i.getByIndices("dataIndices")};
      ${n.setByOffset("global_idx","value")};
      `;return`
      ${t.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(i,a,n)}
      ${t.mainStart()}
        ${t.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        ${c}
      }`}}))}}),nJ=q(()=>{"use strict";nf(),ny(),nC(),r7=(t,i)=>{var r,a,n,s,o,u;let l,d,p=t.inputs,c=p[0].dims,h=p[0].dataType,f=p[1].dims,m=f[f.length-1],g=e3.sizeToDimension(f,f.length-1),y=e3.sizeFromDimension(c,i.batchDims+m),_=e3.sizeToDimension(c,i.batchDims),b=e3.sizeFromDimension(c,i.batchDims),$=Array(m),v=y;for(let t=0;t<m;++t)$[m-1-t]=v,v*=c[i.batchDims+m-1-t];let w=(r=t,a=p[1],n=$,s=i.batchDims,o=c,l=[{type:12,data:u=g},{type:12,data:s},{type:12,data:o},{type:12,data:n},{type:12,data:g/_},{type:12,data:b},{type:12,data:m}],d=[u],l.push(...tS(a.dims,d)),r.compute({name:"computeSliceOffsets",shaderCache:{hint:`${o.length}_${n.length}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:d,dataType:r.inputs[1].dataType}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:l}),getShaderSource:t=>{let i=tR("indices_data",a.dataType,a.dims.length),r=tB("input_slice_offsets_data",12,1,1),s=[{name:"output_size",type:"u32"},{name:"batch_dims",type:"u32"},{name:"input_dims",type:"u32",length:o.length},{name:"sizes_from_slice_dims_data",type:"u32",length:n.length},{name:"num_slices_per_batch",type:"u32"},{name:"input_batch_stride",type:"u32"},{name:"num_slice_dims",type:"u32"}];return`
  ${t.registerUniforms(s).declareVariables(i,r)}
  ${t.mainStart()}
    ${t.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
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
      ${1===n.length?"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data);":"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data[dim_idx]);"}
    }

    input_slice_offsets_data[global_idx] =  base_offset + u32(relative_slice_offset);
  }`}},{inputs:[a],outputs:[-1]})[0]),x=i.batchDims+m;if(x>c.length)throw Error("last dimension of indices must not be larger than rank of input tensor");let C=f.slice(0,-1).concat(c.slice(x)),k=e3.size(C),S=[{type:12,data:k},{type:12,data:y},...tS(p[0].dims,w.dims,C)];t.compute({name:"GatherND",shaderCache:{hint:i.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:C,dataType:h}],dispatchGroup:{x:Math.ceil(k/64)},programUniforms:S}),getShaderSource:t=>{let i=tR("data",p[0].dataType,p[0].dims.length),r=tR("slice_offsets",12,w.dims.length),a=tB("output",p[0].dataType,C.length);return`
          ${t.registerUniform("output_size","u32").registerUniform("slice_size","u32").declareVariables(i,r,a)}
            ${t.mainStart()}
            ${t.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let slice_offset = slice_offsets[global_idx / uniforms.slice_size];
          output[global_idx] = data[u32(slice_offset) + global_idx % uniforms.slice_size];
        }`}},{inputs:[p[0],w]})},ae=t=>({batchDims:t.batch_dims,cacheKey:""})}),n0=q(()=>{"use strict";nf(),ny(),nx(),nC(),at=(t,i)=>{var r,a;let n,s,o,u,l,d,p,c,h,f;((t,i)=>{if(t.length<3||t.length>4)throw Error("GatherBlockQuantized requires 3 or 4 inputs.");let r=e3.normalizeAxis(i.quantizeAxis,t[0].dims.length),a=i.blockSize,n=t[0],s=t[2],o=4===t.length?t[3]:void 0;if(s.dims.length!==n.dims.length||!n.dims.map((t,i)=>i===r?Math.ceil(t/a)===s.dims[i]:t===s.dims[i]).reduce((t,i)=>t&&i,!0))throw Error("Scales must have the same rank as the input tensor and the dims should match except on gatherAxis.");if(o){if(o.dataType!==n.dataType)throw Error("Zero point must have the same data type as the input tensor.");if(o.dims.length!==s.dims.length||!o.dims.map((t,i)=>t===s.dims[i]).reduce((t,i)=>t&&i,!0))throw Error("Zero point must have the same rank as the input tensor and the dims should match except on quantizeAxis.")}})(t.inputs,i),t.compute((r=t.inputs,a=i,n=r[0].dims,s=r[1].dims,o=n.length,u=e3.normalizeAxis(a.gatherAxis,o),l=e3.normalizeAxis(a.quantizeAxis,o),(d=n.slice(0)).splice(u,1,...s),p=e3.size(d),c=r[2].dataType,h=22===r[0].dataType,f=[{type:12,data:p},{type:12,data:l},{type:12,data:u},{type:12,data:a.blockSize},...tS(...r.map((t,i)=>t.dims),d)],{name:"GatherBlockQuantized",shaderCache:{hint:`${a.cacheKey};${r.filter((t,i)=>1!==i).map(t=>t.dims.join("_")).join(";")}`,inputDependencies:Array.from({length:r.length},(t,i)=>"rank")},getRunData:()=>({outputs:[{dims:d,dataType:c}],dispatchGroup:{x:Math.ceil(p/64)},programUniforms:f}),getShaderSource:t=>{let i=tR("data",r[0].dataType,r[0].dims.length),a=tR("inputIndices",r[1].dataType,r[1].dims.length),o=tR("scales",r[2].dataType,r[2].dims.length),l=r.length>3?tR("zeroPoint",r[3].dataType,r[3].dims.length):void 0,p=tB("output",c,d.length),f=[i,a,o];return l&&f.push(l),`
        ${t.registerUniforms([{name:"output_size",type:"u32"},{name:"quantize_axis",type:"u32"},{name:"gather_axis",type:"u32"},{name:"block_size",type:"u32"}]).declareVariables(...f,p)}
        ${t.mainStart()}
        let output_indices = ${p.offsetToIndices("global_idx")};
        var indices_indices = ${a.type.indices}(0);
        ${s.length>1?`
          for (var i: u32 = 0; i < ${s.length}; i++) {
            let index = ${p.indicesGet("output_indices","uniforms.gather_axis + i")};
            ${a.indicesSet("indices_indices","i","index")};
          }`:`indices_indices = ${p.indicesGet("output_indices","uniforms.gather_axis")};`};
        var data_indices = ${i.type.indices}(0);
        for (var i: u32 = 0; i < uniforms.gather_axis; i++) {
          let index = ${p.indicesGet("output_indices","i")};
          ${i.indicesSet("data_indices","i","index")};
        }
        var index_from_indices = ${a.getByIndices("indices_indices")};
        if (index_from_indices < 0) {
          index_from_indices += ${n[u]};
        }
        ${i.indicesSet("data_indices","uniforms.gather_axis","u32(index_from_indices)")};
        for (var i = uniforms.gather_axis + 1; i < ${d.length}; i++) {
          let index = ${p.indicesGet("output_indices",`i + ${s.length} - 1`)};
          ${i.indicesSet("data_indices","i","index")};
        }
        let data_offset = ${i.indicesToOffset("data_indices")};
        let data_index = data_offset % 8;
        // Convert 4-bit packed data to 8-bit packed data.
        let packed_4bit_quantized_data = ${i.getByOffset("data_offset / 8")};
        let packed_8bit_quantized_data = (packed_4bit_quantized_data >> (4 * (data_index % 2))) & 0x0f0f0f0f;
        let quantized_data_vec = ${h?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_quantized_data));
        let quantized_data = quantized_data_vec[data_index / 2];
        var scale_indices = data_indices;
        let quantize_axis_index = ${o.indicesGet("data_indices","uniforms.quantize_axis")} / uniforms.block_size;
        ${o.indicesSet("scale_indices","uniforms.quantize_axis","quantize_axis_index")};
        var scale = ${o.getByIndices("scale_indices")};
        ${l?`
              let zero_point_indices = scale_indices;
              let zero_point_offset = ${l.indicesToOffset("zero_point_indices")};
              let zero_point_index = zero_point_offset % 8;
              let packed_4bit_zero_points = ${l.getByOffset("zero_point_offset / 8")};
              let packed_8bit_zero_points = (packed_4bit_zero_points >> (4 * (zero_point_index % 2))) & 0x0f0f0f0f;
              let zero_point_vec = ${h?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_zero_points));
              let zero_point = zero_point_vec[zero_point_index / 2];`:"var zero_point = 0"};
        let dequantized_data = ${tk(c)}(quantized_data - zero_point) * scale;
        ${p.setByOffset("global_idx","dequantized_data")};
    }`}}))},ai=t=>tv({blockSize:t.blockSize,gatherAxis:t.gatherAxis,quantizeAxis:t.quantizeAxis})}),n2=q(()=>{"use strict";nf(),ny(),nx(),nC(),ar=t=>tv({axis:t.axis}),aa=(t,i)=>{var r,a;let n,s,o,u,l,d,p,c,h,f,m,g,y;(t=>{if(!t||2!==t.length)throw Error("GatherElements requires 2 inputs.");if(t[0].dims.length<1)throw Error("GatherElements requires that the data input be rank >= 1.");if(t[0].dims.length!==t[1].dims.length)throw Error(`GatherElements requires that the data input and
                     indices input tensors be of same rank.`)})(t.inputs),t.compute((r=t.inputs,a=i,n=r[0].dims,s=r[0].dataType,o=n.length,u=r[1].dims,l=r[1].dataType,p=n[d=e3.normalizeAxis(a.axis,o)],c=u.slice(0),h=e3.size(c),f=tR("input",s,o),m=tR("indicesInput",l,u.length),g=tB("output",s,c.length),(y=[{type:12,data:h},{type:6,data:p},{type:12,data:d}]).push(...tS(n,u,c)),{name:"GatherElements",shaderCache:{inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:c,dataType:r[0].dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:y}),getShaderSource:t=>`
      ${t.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(f,m,g)}
      ${t.mainStart()}
      ${t.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

      let outputIndices = ${g.offsetToIndices("global_idx")};

      var idx = ${m.getByOffset("global_idx")};
      if (idx < 0) {
        idx = idx + uniforms.axisDimLimit;
      }
      var inputIndices = ${f.type.indices}(outputIndices);
      ${f.indicesSet("inputIndices","uniforms.axis","u32(idx)")};
      let value = ${f.getByIndices("inputIndices")};

      ${g.setByOffset("global_idx","value")};
  }`}))}}),n1=q(()=>{"use strict";nf(),ny(),nC(),an=t=>({transA:t.transA,transB:t.transB,alpha:t.alpha,beta:t.beta,cacheKey:`${t.transA};${t.transB};${1===t.alpha}`}),as=(t,i)=>{(t=>{if(!t)throw Error("Input is missing");if(t.length<2||t.length>3)throw Error("Invaid input number.");if(3===t.length&&t[2].dims.length>2)throw Error("Invalid input shape of C");if(t[0].dataType!==t[1].dataType||3===t.length&&t[0].dataType!==t[2].dataType)throw Error("Input types are mismatched")})(t.inputs),t.compute(((t,i)=>{let r=t[0].dims.slice(),a=t[1].dims.slice(),[n,s,o]=e6.getShapeOfGemmResult(r,i.transA,a,i.transB,3===t.length?t[2].dims:void 0),u=[n,s];if(!u)throw Error("Can't use gemm on the given tensors");let l=Math.ceil(s/16),d=Math.ceil(n/16),p=(e3.size(u),[{type:12,data:l},{type:12,data:n},{type:12,data:s},{type:12,data:o},{type:1,data:i.alpha},{type:1,data:i.beta}]),c=["type","type"];return 3===t.length&&(p.push(...tS(t[2].dims)),c.push("rank")),p.push(...tS(u)),{name:"GemmShared",shaderCache:{hint:`${i.cacheKey}`,inputDependencies:c},getRunData:()=>({outputs:[{dims:u,dataType:t[0].dataType}],dispatchGroup:{x:l*d},programUniforms:p}),getShaderSource:r=>{let a=tR("a",t[0].dataType,t[0].dims),n=tR("b",t[1].dataType,t[1].dims),s=null,o=[a,n];3===t.length&&(s=tR("c",t[2].dataType,t[2].dims.length),o.push(s));let l=tB("output",t[0].dataType,u.length);o.push(l);let d="",p="";i.transA&&i.transB?(p=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${a.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${n.type.value}(0);
      }
      `,d="value += tile_a[k][local_id.y] * tile_b[local_id.x][k];"):i.transA&&!i.transB?(p=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${a.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${n.type.value}(0);
      }
      `,d="value += tile_a[k][local_id.y] * tile_b[k][local_id.x];"):!i.transA&&i.transB?(p=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${a.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${n.type.value}(0);
      }
      `,d="value += tile_a[local_id.y][k] * tile_b[local_id.x][k];"):i.transA||i.transB||(p=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${a.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${n.type.value}(0);
      }
      `,d="value += tile_a[local_id.y][k] * tile_b[k][local_id.x];");let c=1===i.alpha?"":"value *= uniforms.alpha;";return`
  ${r.registerUniforms([{name:"num_tile_n",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}]).declareVariables(...o)}
  var<workgroup> tile_a: array<array<${a.type.storage}, 16>, 16>;
  var<workgroup> tile_b: array<array<${n.type.storage}, 16>, 16>;
  ${r.mainStart([16,16,1])}
    let tile_col_start = (workgroup_index % uniforms.num_tile_n) * 16;
    let tile_row_start = (workgroup_index / uniforms.num_tile_n) * 16;
    let num_tiles = (uniforms.K - 1) / 16 + 1;
    var k_start = 0u;
    var value = ${l.type.value}(0);
    for (var t: u32 = 0u; t < num_tiles; t++) {
      ${p}
      k_start = k_start + 16;
      workgroupBarrier();

      for (var k: u32 = 0u; k < 16; k++) {
        ${d}
      }
      workgroupBarrier();
    }

    ${c}
    let m = tile_row_start + local_id.y;
    let n = tile_col_start + local_id.x;
    ${null!=s?`let cOffset = ${s.broadcastedIndicesToOffset("vec2(m, n)",l)}; value += ${l.type.value}(uniforms.beta) * ${s.getByOffset("cOffset")};`:""}
    if (m < uniforms.M && n < uniforms.N) {
      output[m * uniforms.N + n] = value;
    }
  }`}}})(t.inputs,i))}}),n3=q(()=>{"use strict";nf(),ny(),nx(),nC(),[ao,au,al,ad]=[0,1,2,3],ap=`
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
`,ac=(t,i)=>{var r,a;let n,s,o,u,l,d,p;(t=>{if(4!==t[0].dims.length)throw Error("only 4-D tensor is supported.");if(t[0].dims.length!==t[1].dims.length)throw Error("input dimensions must be equal to grid dimensions");if(t[0].dims.length-2!==t[1].dims[t[1].dims.length-1])throw Error(`last dimension of grid must be equal to ${t[0].dims.length-2}`);if(t[0].dims[0]!==t[1].dims[0])throw Error("grid batch size must match input batch size")})(t.inputs),t.compute((r=t.inputs,a=i,n=tR("x",r[0].dataType,r[0].dims.length),s=[r[1].dims[0],r[1].dims[1],r[1].dims[2]],o=tR("grid",r[1].dataType,s.length,2),u=[r[0].dims[0],r[0].dims[1],r[1].dims[1],r[1].dims[2]],"NHWC"===a.format&&(u=[r[0].dims[0],r[1].dims[1],r[1].dims[2],r[0].dims[3]],[ao,au,al,ad]=[0,3,1,2]),l=tB("output",r[0].dataType,u.length),d=n.type.value,p=[{type:12,data:e3.size(u)},...tS(r[0].dims,s,u)],{name:"GridSample",shaderCache:{hint:`${a.cacheKey}`,inputDependencies:["type","type"]},getRunData:t=>{let i=e3.size(u);return{outputs:[{dims:u,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:p}},getShaderSource:t=>{let i,r,s,u,p,c,h,f,m;return`
  ${t.registerUniform("output_size","u32").declareVariables(n,o,l)}
  ${ap}
  ${i=d,`
  fn gs_bicubic_interpolate(p: mat4x4<${i}>, x: f32, y: f32) -> ${i} {
    var v: vec4<f32>;
    var coeffs = gs_get_cubic_coeffs(x);
    for (var i = 0; i < 4; i++) {
      v[i] = coeffs[0] * p[i][0] + coeffs[1] * p[i][1] + coeffs[2] * p[i][2] + coeffs[3] * p[i][3];
    }
    coeffs = gs_get_cubic_coeffs(y);
    let pixel = ${i}(coeffs[0] * v[0] + coeffs[1] * v[1] + coeffs[2] * v[2] + coeffs[3] * v[3]);
    return pixel;
  }
`}
  ${r=a,`
  fn gs_denormalize(n: f32, length: i32) -> f32 {
    ${0===r.alignCorners?`
    // alignCorners: false => [-1, 1] to [-0.5, length - 0.5]
    return ((n + 1.0) * f32(length) - 1.0) / 2.0;
    `:`
    // alignCorners: true => [-1, 1] to [0, length - 1]
    return (n + 1.0) / 2.0 * (f32(length - 1));
    `}
  }
`}
  ${s=a,`
  ${"reflection"===s.paddingMode?`
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
`}
  ${u=n,p=d,c=a,`
  fn pixel_at_grid(r: i32, c: i32, H: i32, W: i32, batch: u32, channel: u32, border: vec4<f32>) -> ${p} {
     var pixel = ${p}(0);
     var indices = vec4<u32>(0);
     indices[${ao}] = batch;
     indices[${au}] = channel;`+(()=>{switch(c.paddingMode){case"zeros":return`
          if (r >= 0 && r < H && c >=0 && c < W) {
            indices[${al}] = u32(r);
            indices[${ad}] = u32(c);
          } else {
            return ${p}(0);
          }
        `;case"border":return`
          indices[${al}] = u32(clamp(r, 0, H - 1));
          indices[${ad}] = u32(clamp(c, 0, W - 1));
        `;case"reflection":return`
          indices[${al}] = gs_reflect(r, border[1], border[3]);
          indices[${ad}] = gs_reflect(c, border[0], border[2]);
        `;default:throw Error(`padding mode ${c.paddingMode} is not supported`)}})()+`
    return ${u.getByIndices("indices")};
  }
`}

  ${t.mainStart()}
    ${t.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let H_in = i32(uniforms.x_shape[${al}]);
      let W_in = i32(uniforms.x_shape[${ad}]);

      ${0===a.alignCorners?`
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

      let indices = ${l.offsetToIndices("global_idx")};
      var grid_indices = vec3<u32>(indices[${ao}], indices[${al}], indices[${ad}]);
      let nxy = ${o.getByIndices("grid_indices")};
      var x = gs_denormalize(f32(nxy[0]), W_in);
      var y = gs_denormalize(f32(nxy[1]), H_in);

      ${h=l,f=d,m=a,(()=>{switch(m.mode){case"nearest":return`
          let result = pixel_at_grid(i32(round(y)), i32(round(x)), H_in, W_in, indices[${ao}], indices[${au}], border);
        `;case"bilinear":return`
          let x1 = i32(floor(x));
          let y1 = i32(floor(y));
          let x2 = x1 + 1;
          let y2 = y1 + 1;

          let p11 = pixel_at_grid(y1, x1, H_in, W_in, indices[${ao}], indices[${au}], border);
          let p12 = pixel_at_grid(y1, x2, H_in, W_in, indices[${ao}], indices[${au}], border);
          let p21 = pixel_at_grid(y2, x1, H_in, W_in, indices[${ao}], indices[${au}], border);
          let p22 = pixel_at_grid(y2, x2, H_in, W_in, indices[${ao}], indices[${au}], border);

          let dx2 = ${f}(f32(x2) - x);
          let dx1 = ${f}(x - f32(x1));
          let dy2 = ${f}(f32(y2) - y);
          let dy1 = ${f}(y - f32(y1));
          let result = dy2 * (dx2 * p11 + dx1 * p12) + dy1 * (dx2 * p21 + dx1 * p22);
        `;case"bicubic":return`
          let x0 = i32(floor(x)) - 1;
          let y0 = i32(floor(y)) - 1;
          var p: mat4x4<${f}>;
          for (var h = 0; h < 4; h++) {
            for (var w = 0; w < 4; w++) {
              p[h][w] = pixel_at_grid(h + y0, w + x0, H_in, W_in, indices[${ao}], indices[${au}], border);
            }
          }

          let dx = x - f32(x0 + 1);
          let dy = y - f32(y0 + 1);
          let result = gs_bicubic_interpolate(p, dx, dy);
        `;default:throw Error(`mode ${m.mode} is not supported`)}})()+`${h.setByOffset("global_idx","result")}`}
  }`}}))},ah=t=>tv({alignCorners:t.align_corners,mode:t.mode,paddingMode:t.padding_mode,format:t.format})}),n4=q(()=>{"use strict";nf(),ny(),nx(),nv(),nE(),nC(),nk(),af=(t,i)=>t.length>i&&t[i].dims.length>0?t[i]:void 0,am=t=>tv({...t}),ag=tv({perm:[0,2,1,3]}),ay=(t,i,r,a,n,s,o,u)=>{var l,d,p,c,h,f,m;let g,y,_,b=s;if(!(o&&e3.size(o.dims)>0))return 3===s.dims.length&&(b=s.reshape([i,a,r,n])),1===r||1===a?b:t.compute(tq(b,ag.perm),{inputs:[b],outputs:[-1]})[0];if(1===a)throw Error("AddBiasReshape is not implemented. Please export your model with packed QKV or KV");return b=(l=t,d=s,p=o,c=i,h=a,f=r*n,m=u,g=[c,h,f],_=[{type:12,data:y=e3.size(g)},{type:12,data:m},{type:12,data:f}],b=l.compute({name:"MultiHeadAttentionAddBias",shaderCache:{inputDependencies:["type","type"]},getRunData:()=>({outputs:[{dims:g,dataType:d.dataType,gpuDataType:0}],dispatchGroup:{x:Math.ceil(y/64)},programUniforms:_}),getShaderSource:t=>{let i=tB("qkv_with_bias",d.dataType,g),r=tR("qkv",d.dataType,g),a=tR("bias",p.dataType,g);return`
  ${t.registerUniforms([{name:"output_size",type:"u32"},{name:"bias_offset",type:"u32"},{name:"hidden_size",type:"u32"}]).declareVariables(r,a,i)}
  ${t.mainStart()}
    ${t.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let bias_offset_idx = (global_idx % uniforms.hidden_size) + uniforms.bias_offset;

    qkv_with_bias[global_idx] = qkv[global_idx] + bias[bias_offset_idx];
  }`}},{inputs:[d,p],outputs:[-1]})[0]).reshape([i,a,r,n]),1===r||1===a?b:t.compute(tq(b,ag.perm),{inputs:[b],outputs:[-1]})[0]},a_=(t,i)=>{let r=((t,i)=>{let r,a=t[0],n=af(t,1),s=af(t,2),o=af(t,3),u=af(t,4),l=af(t,5),d=af(t,6),p=af(t,7);if(3!==a.dims.length&&5!==a.dims.length)throw Error("Input query is expected to have 3 or 5 dimensions");let c=a.dims[0],h=a.dims[1],f=3===a.dims.length?a.dims[2]:i.numHeads*a.dims[4],m=h,g=0,y=0,_=Math.floor(f/i.numHeads);if(d&&p&&e3.size(d.dims)&&e3.size(p.dims)){if(4!==d.dims.length)throw Error('Input "past_key" is expected to have 4 dimensions');if(d.dims[0]!==c||d.dims[1]!==i.numHeads||d.dims[3]!==_)throw Error('Input "past_key" shape (batch_size, num_heads, past_sequence_length, head_size)');if(p.dims[0]!==c||p.dims[1]!==i.numHeads||p.dims[3]!==_)throw Error('Input "past_value" shape (batch_size, num_heads, past_sequence_length, head_size)');if(d.dims[2]!==p.dims[2])throw Error('Input "past_key" and "past_value" shall have same dim 2 (past_sequence_length)');if(4!==p.dims.length)throw Error('Input "past_value" is expected to have 4 dimensions');g=d.dims[2],y=d.dims[2]}else if(d&&e3.size(d.dims)||p&&e3.size(p.dims))throw Error('Input "past_key" and "past_value" shall be both present or both absent');if(n&&e3.size(n.dims)>0){if(3!==a.dims.length)throw Error('Input "query" is expected to have 3 dimensions when key is given');if(n.dims.length<3||n.dims.length>5)throw Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(a.dims[0]!==n.dims[0])throw Error('Input "query" and "key" shall have same dim 0 (batch size)');if(3===n.dims.length){if(n.dims[2]!==a.dims[2])throw Error('Input "query" and "key" shall have same dim 2 (hidden_size)');r=2,m=n.dims[1]}else if(5===n.dims.length){if(n.dims[2]!==i.numHeads||2!==n.dims[3]||n.dims[4]!==_)throw Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(s)throw Error('Expect "value" be none when "key" has packed kv format.');r=5,m=n.dims[1]}else{if(n.dims[1]!==i.numHeads||n.dims[3]!==_)throw Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');r=0,m=n.dims[2]}}else{if(5!==a.dims.length)throw Error('Input "query" is expected to have 5 dimensions when key is empty');if(a.dims[2]!==i.numHeads||3!==a.dims[3])throw Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');r=3}if(o&&e3.size(o.dims)>0){if(1!==o.dims.length)throw Error('Input "bias" is expected to have 1 dimension');if(n&&5===n.dims.length&&2===n.dims[3])throw Error("bias is not allowed for packed kv.")}let b=g+m,$=0;if(u&&e3.size(u.dims)>0){$=8;let t=u.dims;throw 1===t.length?t[0]===c?$=1:t[0]===3*c+2&&($=3):2===t.length&&t[0]===c&&t[1]===b&&($=5),8===$?Error('Input "key_padding_mask" shape shall be (batch_size) or (batch_size, total_sequence_length)'):Error("Mask not supported")}let v=!1,w=f;if(s&&e3.size(s.dims)>0){if(3!==s.dims.length&&4!==s.dims.length)throw Error('Input "value" is expected to have 3 or 4 dimensions');if(a.dims[0]!==s.dims[0])throw Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(3===s.dims.length){if(m!==s.dims[1])throw Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');w=s.dims[2]}else{if(m!==s.dims[2])throw Error('Input "key" and "value" shall have the same dim 2 (kv_sequence_length)');w=s.dims[1]*s.dims[3],v=!0}}if(u&&e3.size(u.dims)>0)throw Error("Key padding mask is not supported");if(l&&e3.size(l.dims)>0){if(4!==l.dims.length)throw Error('Input "attention_bias" is expected to have 4 dimensions');if(l.dims[0]!==c||l.dims[1]!==i.numHeads||l.dims[2]!==h||l.dims[3]!==b)throw Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:c,sequenceLength:h,pastSequenceLength:g,kvSequenceLength:m,totalSequenceLength:b,maxSequenceLength:y,inputHiddenSize:0,hiddenSize:f,vHiddenSize:w,headSize:_,vHeadSize:Math.floor(w/i.numHeads),numHeads:i.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:i.maskFilterValue,maskType:$,scale:i.scale,broadcastResPosBias:!1,passPastInKv:v,qkvFormat:r}})(t.inputs,i),a=t.inputs[0],n=af(t.inputs,1),s=af(t.inputs,2),o=af(t.inputs,3),u=af(t.inputs,4),l=af(t.inputs,5),d=af(t.inputs,6),p=af(t.inputs,7);if(5===a.dims.length)throw Error("Packed QKV is not implemented");if(n?.dims.length===5)throw Error("Packed KV is not implemented");let c=n&&s&&4===n.dims.length&&4===s.dims.length,h=ay(t,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,a,o,0);if(c)return iy(t,h,n,s,u,void 0,d,p,l,r);if(!n||!s)throw Error("key and value must be provided");let f=ay(t,r.batchSize,r.numHeads,r.kvSequenceLength,r.headSize,n,o,r.hiddenSize),m=ay(t,r.batchSize,r.numHeads,r.kvSequenceLength,r.vHeadSize,s,o,2*r.hiddenSize);iy(t,h,f,m,u,void 0,d,p,l,r)}}),n6=q(()=>{"use strict";nf(),ny(),nx(),nC(),ab=(t,i)=>{let r=t[0].dims,a=e3.size(r),n=t[0].dataType,s=e3.normalizeAxis(i.axis,r.length),o=Array(i.numOutputs),u=tR("input",n,r.length),l=Array(i.numOutputs),d=[],p=[],c=0,h=[{type:12,data:a}];for(let a=0;a<i.numOutputs;a++){c+=i.splitSizes[a],l[a]=c;let u=r.slice();u[s]=i.splitSizes[a],p.push(u),o[a]=tB(`output${a}`,n,u.length),d.push({dims:p[a],dataType:t[0].dataType})}return h.push({type:12,data:l},...tS(r,...p)),{name:"Split",shaderCache:{hint:i.cacheKey,inputDependencies:["rank"]},getShaderSource:t=>{let i;return`
  ${t.registerUniform("input_size","u32").registerUniform("size_in_split_axis","u32",l.length).declareVariables(u,...o)}
  ${i=l.length,`
fn calculateOutputIndex(index: u32) -> u32 {
    for (var i: u32 = 0u; i < ${i}u; i += 1u ) {
    if (index < ${tA("uniforms.size_in_split_axis","i",i)}) {
        return i;
    }
    }
    return ${i}u;
}`}
  ${(t=>{let i=t.length,r=[];for(let a=0;a<i;++a){let n=t[a].setByIndices("indices","input[global_idx]");1===i?r.push(n):0===a?r.push(`if (output_number == ${a}u) { ${n} }`):a===i-1?r.push(`else { ${n} }`):r.push(`else if (output_number == ${a}) { ${n} }`)}return`
      fn writeBufferData(output_number: u32, indices: ${t[0].type.indices}, global_idx: u32) {
        ${r.join(`
`)}
      }`})(o)}

  ${t.mainStart()}
    ${t.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.input_size")}

    var indices = ${u.offsetToIndices("global_idx")};
    var index = ${u.indicesGet("indices",s)};
    let output_number = calculateOutputIndex(index);
    if (output_number != 0) {
      index -= ${tA("uniforms.size_in_split_axis","output_number - 1u",l.length)};
      ${u.indicesSet("indices",s,"index")};
    }
    writeBufferData(output_number, indices, global_idx);
  }`},getRunData:()=>({outputs:d,dispatchGroup:{x:Math.ceil(a/64)},programUniforms:h})}},a$=(t,i)=>{let r,a;var n,s,o=t.inputs;if(!o||o.length<1)throw Error("too few inputs");let u=1===t.inputs.length?i:(n=t.inputs,r=[],a=(s=i).numOutputs,n[1].dims[0]>0&&(n[1].getBigInt64Array().forEach(t=>r.push(Number(t))),a=r.length),tv({numOutputs:a,axis:s.axis,splitSizes:r}));t.compute(ab(t.inputs,u),{inputs:[0]})},av=t=>{let i=t.axis,r=t.splitSizes,a=t.numOutputs<0?r.length:t.numOutputs;if(a!==r.length)throw Error("numOutputs and splitSizes length must be equal");return tv({axis:i,numOutputs:a,splitSizes:r})}}),n8=q(()=>{"use strict";nf(),ny(),nx(),nC(),aw=(t,i)=>{let{interleaved:r,numHeads:a,rotaryEmbeddingDim:n,scale:s}=i,o=t[0].dims[0],u=e3.sizeFromDimension(t[0].dims,1),l=t[0].dims[t[0].dims.length-2],d=u/l,p=t[2].dims[1],c=0===n?2*p:d/a,h=[o,l,d/c,c-p],f=e3.computeStrides(h),m=[{type:1,data:s},{type:12,data:h},{type:12,data:f},...3===t[0].dims.length?Array({type:12,data:[u,d,c,1]}):[],...4===t[0].dims.length?Array({type:12,data:[u,c,l*c,1]}):[],...tS(t[0].dims,t[1].dims,t[2].dims,t[3].dims,t[0].dims)];return{name:"RotaryEmbedding",shaderCache:{hint:tv({interleaved:r}).cacheKey,inputDependencies:["rank","rank","rank","rank"]},getShaderSource:i=>{let a=tR("input",t[0].dataType,t[0].dims.length),n=tR("position_ids",t[1].dataType,t[1].dims.length),s=tR("cos_cache",t[2].dataType,t[2].dims.length),o=tR("sin_cache",t[3].dataType,t[3].dims.length),u=tB("output",t[0].dataType,t[0].dims.length);return i.registerUniforms([{name:"scale",type:"f32"},{name:"global_shape",type:"u32",length:h.length},{name:"global_strides",type:"u32",length:f.length},{name:"input_output_strides",type:"u32",length:f.length}]),`
        ${i.declareVariables(a,n,s,o,u)}

        ${i.mainStart(tw)}
          let half_rotary_emb_dim = uniforms.${s.name}_shape[1];
          let bsnh = global_idx / uniforms.global_strides % uniforms.global_shape;
          let size = uniforms.global_shape[0] * uniforms.global_strides[0];
          ${i.guardAgainstOutOfBoundsWorkgroupSizes("size")}

          if (bsnh[3] < half_rotary_emb_dim) {
            let position_ids_idx =
                ${n.broadcastedIndicesToOffset("bsnh.xy",tB("",n.type.tensor,2))};
            let position_id =
                u32(${n.getByOffset("position_ids_idx")}) + select(0, bsnh[1], position_ids_idx == 0);
            let i = dot(bsnh, uniforms.input_output_strides) + select(0, bsnh[3], ${r});
            let j = i + select(half_rotary_emb_dim, 1, ${r});
            let re = ${a.getByOffset("i")} * ${s.get("position_id","bsnh[3]")} -
                ${a.getByOffset("j")} * ${o.get("position_id","bsnh[3]")};
            ${u.setByOffset("i","re")}
            let im = ${a.getByOffset("i")} * ${o.get("position_id","bsnh[3]")} +
                ${a.getByOffset("j")} * ${s.get("position_id","bsnh[3]")};
            ${u.setByOffset("j","im")}
          } else {
            let k = dot(bsnh, uniforms.input_output_strides) + half_rotary_emb_dim;
            ${u.setByOffset("k",a.getByOffset("k"))}
          }
        }`},getRunData:()=>({outputs:[{dims:t[0].dims,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(e3.size(h)/tw)},programUniforms:m})}},ax=(t,i)=>{((t,i)=>{let[r,a,n,s]=t,{numHeads:o,rotaryEmbeddingDim:u}=i;if(3!==r.dims.length&&4!==r.dims.length)throw Error(`Input 'x' is expected to have 3 or 4 dimensions, got ${r.dims.length}`);if(!e3.areEqual(a.dims,[])&&!e3.areEqual(a.dims,[1])&&2!==a.dims.length)throw Error(`Input 'position_ids' is expected to have 0, 1, or 2 dimensions, got ${a.dims.length}`);if(2!==n.dims.length)throw Error(`Input 'cos_cache' is expected to have 2 dimensions, got ${n.dims.length}`);if(2!==s.dims.length)throw Error(`Input 'sin_cache' is expected to have 2 dimensions, got ${s.dims.length}`);if(!e3.areEqual(n.dims,s.dims))throw Error("Inputs 'cos_cache' and 'sin_cache' are expected to have the same shape");if(u>0&&0===o)throw Error("num_heads must be provided if rotary_embedding_dim is specified");let l=r.dims[0],d=r.dims[r.dims.length-2],p=n.dims[0],c=e3.sizeFromDimension(r.dims,1)/d,h=0===u?2*n.dims[1]:c/o;if(u>h)throw Error("rotary_embedding_dim must be less than or equal to head_size");if(2===a.dims.length){if(l!==a.dims[0])throw Error(`Input 'position_ids' dimension 0 should be of size batch_size, got ${a.dims[0]}`);if(d!==a.dims[1])throw Error(`Input 'position_ids' dimension 1 should be of size sequence_length, got ${a.dims[1]}`)}if(h/2!==n.dims[1]&&u/2!==n.dims[1])throw Error(`Input 'cos_cache' dimension 1 should be same as head_size / 2 or rotary_embedding_dim / 2, got ${n.dims[1]}`);if(d>p)throw Error("Updating cos_cache and sin_cache in RotaryEmbedding is not currently supported")})(t.inputs,i),t.compute(aw(t.inputs,i))}}),n5=q(()=>{"use strict";nx(),nf(),nE(),n4(),n6(),nk(),n8(),nC(),aC=tv({perm:[0,2,1,3]}),ak=(t,i,r)=>{let a=i,n=r.kvNumHeads;return 3===i.dims.length&&0!==r.kvSequenceLength&&(a=i.reshape([r.batchSize,r.kvSequenceLength,n,r.headSize]),a=t.compute(tq(a,aC.perm),{inputs:[a],outputs:[-1]})[0]),a},aS=(t,i)=>{let r=((t,i)=>{if(i.doRotary&&t.length<=7)throw Error("cos_cache and sin_cache inputs are required if do_rotary is specified");let r=t[0],a=t[1],n=t[2],s=t[3],o=t[4];if(0!==i.doRotary&&t.length<=7)throw Error("cos_cast and sin_cache are expected if do_rotary attribute is non-zero");if(-1!==i.localWindowSize)throw Error("Local attention is not supported");if(0!==i.softcap)throw Error("Softcap is not supported");if(0!==i.rotaryInterleaved)throw Error("Rotary interleaved is not supported");if(i.smoothSoftmax)throw Error("Smooth softmax is not supported");if(3!==r.dims.length&&5!==r.dims.length)throw Error("Input query is expected to have 3 or 5 dimensions");let u=r.dims[0],l=r.dims[1],d=3===r.dims.length?r.dims[2]:i.numHeads*r.dims[4],p=l,c=0,h=!a||0===a.dims.length,f=Math.floor(h?d/(i.numHeads+2*i.kvNumHeads):d/i.numHeads);h&&(d=f*i.numHeads);let m=s&&0!==s.dims.length,g=o&&0!==o.dims.length;if(m&&4===s.dims.length&&s.dims[0]===u&&s.dims[1]!==i.kvNumHeads&&s.dims[2]===i.kvNumHeads&&s.dims[3]===f)throw Error("BSNH pastKey/pastValue is not supported");if(m&&g){if(4!==s.dims.length)throw Error('Input "past_key" is expected to have 4 dimensions');if(4!==o.dims.length)throw Error('Input "past_value" is expected to have 4 dimensions');c=s.dims[2]}else if(m||g)throw Error('Input "past_key" and "past_value" shall be both present or both absent');let y=1;if(a&&a.dims.length>0){if(3!==r.dims.length)throw Error('Input "query" is expected to have 3 dimensions when key is given');if(a.dims.length<3||a.dims.length>5)throw Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==a.dims[0])throw Error('Input "query" and "key" shall have same dim 0 (batch size)');if(3===a.dims.length){if(r.dims[2]%a.dims[2]!=0)throw Error('Dimension 2 of "query" should be a multiple of "key"');p=a.dims[1]}else if(5===a.dims.length){if(a.dims[2]!==i.numHeads||2!==a.dims[3]||a.dims[4]!==f)throw Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(n)throw Error('Expect "value" be none when "key" has packed kv format.');p=a.dims[1]}else{if(a.dims[1]!==i.numHeads||a.dims[3]!==f)throw Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');p=a.dims[2]}}else{if(3!==r.dims.length&&5!==r.dims.length)throw Error('Input "query" is expected to have 3 or 5 dimensions when key is empty');if(5===r.dims.length&&(r.dims[2]!==i.numHeads||3!==r.dims[3]))throw Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');y=3}let _=!1,b=i.kvNumHeads?f*i.kvNumHeads:d;if(n&&n.dims.length>0){if(3!==n.dims.length&&4!==n.dims.length)throw Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==n.dims[0])throw Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(3===n.dims.length){if(p!==n.dims[1])throw Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');b=n.dims[2]}else{if(p!==n.dims[2])throw Error('Input "past_key" and "past_value" shall have the same dim 2 (kv_sequence_length)');b=n.dims[1]*n.dims[3],_=!0}}let $=t.length>4?t[5]:void 0;if($&&1!==$.dims.length&&$.dims[0]!==u)throw Error('Input "seqlens" is expected to have 1 dimension and the same dim 0 as batch_size');return{batchSize:u,sequenceLength:l,pastSequenceLength:c,kvSequenceLength:p,totalSequenceLength:-1,maxSequenceLength:-1,inputHiddenSize:0,hiddenSize:d,vHiddenSize:b,headSize:f,vHeadSize:Math.floor(b/i.kvNumHeads),numHeads:i.numHeads,kvNumHeads:i.kvNumHeads,nReps:i.numHeads/i.kvNumHeads,pastPresentShareBuffer:!1,maskType:0,scale:i.scale,broadcastResPosBias:!1,passPastInKv:_,qkvFormat:y}})(t.inputs,i);if(5===t.inputs[0].dims.length)throw Error("Packed QKV is not implemented");if(t.inputs[1]?.dims.length===5)throw Error("Packed KV is not implemented");let a=t.inputs[0],n=t.inputs[1]&&t.inputs[1].dims.length>0?t.inputs[1]:void 0,s=t.inputs[2]&&t.inputs[2].dims.length>0?t.inputs[2]:void 0,o=t.inputs[3]&&0!==t.inputs[3].dims.length?t.inputs[3]:void 0,u=t.inputs[4]&&0!==t.inputs[4].dims.length?t.inputs[4]:void 0,l=t.inputs.length>4?t.inputs[5]:void 0,d=t.inputs.length>5?t.inputs[6]:void 0,p=r.kvNumHeads?r.kvNumHeads:r.numHeads,c=tv({axis:2,numOutputs:3,splitSizes:[r.numHeads*r.headSize,p*r.headSize,p*r.headSize]}),[h,f,m]=n||s?[a,n,s]:t.compute(ab([a],c),{inputs:[a],outputs:[-1,-1,-1]}),g,y;if(i.doRotary){var _,b,$,v;let a,n,s,o=t.compute((_=r.batchSize,b=r.sequenceLength,$=l,v=d,a=[_*b],s=[{type:12,data:n=_*b},{type:12,data:b},{type:12,data:_}],{name:"GeneratePositionIds",shaderCache:{hint:`${_};${b}`,inputDependencies:["type","type"]},getRunData:()=>({outputs:[{dims:a,dataType:7}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:s}),getShaderSource:t=>{let i=tR("seq_lens",$.dataType,$.dims),r=tR("total_seq_lens",v.dataType,v.dims),n=tB("pos_ids",7,a);return`
  ${t.registerUniforms([{name:"output_size",type:"u32"},{name:"sequence_length",type:"u32"},{name:"batch_size",type:"u32"}]).declareVariables(i,r,n)}
  ${t.mainStart()}
    ${t.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let total_sequence_length = u32(${r.getByOffset("0")});
    let is_subsequent_prompt = uniforms.sequence_length > 1 && uniforms.sequence_length != total_sequence_length;
    let is_first_prompt = !is_subsequent_prompt && uniforms.sequence_length == total_sequence_length;
    let batch_idx = global_idx / uniforms.sequence_length;
    let sequence_idx = i32(global_idx % uniforms.sequence_length);
    var pos_id: i32 = 0;
    let seqlen = ${i.getByOffset("batch_idx")};
    let total_seqlen = seqlen + 1;
    if (is_first_prompt) {
      if (sequence_idx < total_seqlen) {
        pos_id = sequence_idx;
      } else {
        pos_id = 1;
      }
      ${n.setByOffset("global_idx","pos_id")}
    } else if (is_subsequent_prompt) {
      let past_seqlen = total_seqlen - i32(uniforms.sequence_length);
      if (past_seqlen + sequence_idx < total_seqlen) {
        pos_id = past_seqlen + sequence_idx;
      } else {
        pos_id = 1;
      }
      ${n.setByOffset("global_idx","pos_id")}
    } else if (global_idx < uniforms.batch_size) {
      ${n.setByOffset("global_idx","seqlen")}
    };
  }
  `}}),{inputs:[l,d],outputs:[-1]})[0],u=t.inputs[7],p=t.inputs[8],c=tv({interleaved:0!==i.rotaryInterleaved,numHeads:r.numHeads,rotaryEmbeddingDim:0,scale:i.scale}),m=[h,o,u,p],w=[-1];g=t.compute(aw(m,c),{inputs:m,outputs:w})[0],m.splice(0,1,f);let x=tv({interleaved:0!==i.rotaryInterleaved,numHeads:r.kvNumHeads,rotaryEmbeddingDim:0,scale:i.scale});y=t.compute(aw(m,x),{inputs:m,outputs:w})[0]}let w=ay(t,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,i.doRotary?g:h,void 0,0),x=ak(t,i.doRotary?y:f,r),C=ak(t,m,r);iy(t,w,x,C,void 0,void 0,o,u,void 0,r,l,d)}}),n9=q(()=>{"use strict";nf(),ny(),nk(),nC(),aT=(t,i,r,a,n,s,o,u)=>{let l=tT(s),d=1===l?"f32":`vec${l}f`,p=1===l?"vec2f":`mat2x${l}f`,c=n*o,h=64;1===c&&(h=256);let f=[n,o,s/l],m=[n,o,2],g=[];return g.push(...tS(f,m)),t.compute({name:"InstanceNormComputeChannelScaleShift",shaderCache:{hint:`${l};${u};${h}`,inputDependencies:["rank","type","type"]},getRunData:()=>({outputs:[{dims:m,dataType:1}],dispatchGroup:{x:c},programUniforms:g}),getShaderSource:t=>{let n=tR("x",i.dataType,3,l),s=[n,tR("scale",r.dataType,r.dims),tR("bias",a.dataType,a.dims),tB("output",1,3,2)];return`
  var<workgroup> workgroup_shared : array<${p}, ${h}>;
  const workgroup_size = ${h}u;
  ${t.declareVariables(...s)}
  ${t.mainStart(h)}
    let batch = workgroup_index / uniforms.x_shape[1];
    let channel = workgroup_index % uniforms.x_shape[1];
    let hight = uniforms.x_shape[2];
    // initialize workgroup memory
    var sum = ${d}(0);
    var squared_sum = ${d}(0);
    for (var h = local_idx; h < hight; h += workgroup_size) {
      let value = ${d}(${n.get("batch","channel","h")});
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
      let sum_final = ${tz("workgroup_shared[0][0]",l)} / f32(hight * ${l});
      let squared_sum_final = ${tz("workgroup_shared[0][1]",l)} / f32(hight * ${l});

      let inv_std_dev = inverseSqrt(squared_sum_final - sum_final * sum_final + f32(${u}));
      let channel_scale = inv_std_dev * f32(scale[channel]);
      let channel_shift = f32(bias[channel]) - sum_final * channel_scale;
      output[workgroup_index] = vec2f(channel_scale, channel_shift);
    }
  }`}},{inputs:[i,r,a],outputs:[-1]})[0]},aI=(t,i)=>{var r,a,n;let s,o,u,l,d,p,c,h,f;"NHWC"===i.format?((t,i,r)=>{let a=i[0].dims,n=a[0],s=a[a.length-1],o=e3.sizeFromDimension(a,1)/s,u=tT(s),l=e3.size(a)/u,d=[{type:12,data:o},{type:12,data:Math.floor(s/u)}],p=!1,c=[0,a.length-1];for(let t=0;t<a.length-2;t++)p=p||1!==a[t+1],c.push(t+1);let h=(p=p&&1!==a[a.length-1])?t.compute(tq(t.inputs[0],c),{inputs:[t.inputs[0]],outputs:[-1]})[0]:t.inputs[0].reshape(Array.from({length:a.length},(t,i)=>a[c[i]])),f=aT(t,h,i[1],i[2],n,o,s,r.epsilon);t.compute({name:"InstanceNormalizationNHWC",shaderCache:{hint:`${u}`,inputDependencies:["type","type"]},getRunData:()=>({outputs:[{dims:a,dataType:i[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:d}),getShaderSource:t=>{let r=tC(i[0].dataType),n=1===u?"vec2f":`mat${u}x2f`,s=t=>{let i=0===t?"x":"y",a=1===u?"f32":`vec${u}f`;switch(u){case 1:return`${r}(${a}(scale.${i}))`;case 2:return`vec2<${r}>(${a}(scale[0].${i}, scale[1].${i}))`;case 4:return`vec4<${r}>(${a}(scale[0].${i}, scale[1].${i}, scale[2].${i}, scale[3].${i}))`;default:throw Error(`Not supported compoents ${u}`)}},o=tR("input",i[0].dataType,i[0].dims,u),l=tB("output",i[0].dataType,a,u);return`
  @group(0) @binding(0) var<storage, read> input : array<${o.type.storage}>;
  @group(0) @binding(1) var<storage, read> scale_input : array<${n}>;
  @group(0) @binding(2) var<storage, read_write> output : array<${l.type.storage}>;
  struct Uniforms {H: u32, C : u32};
  @group(0) @binding(3) var<uniform> uniforms: Uniforms;

  ${t.mainStart()}
    let current_image_number = global_idx / (uniforms.C * uniforms.H);
    let current_channel_number = global_idx % uniforms.C;

    let scale_offset = current_image_number * uniforms.C + current_channel_number;
    let scale = scale_input[scale_offset];
    output[global_idx] = fma(input[global_idx], ${s(0)}, ${s(1)});
  }`}},{inputs:[i[0],f]})})(t,t.inputs,i):(r=t,a=t.inputs,n=i,o=(s=a[0].dims)[0],u=s[1],l=e3.sizeFromDimension(s,2),d=tT(l),p=e3.size(s)/d,c=aT(r,a[0],a[1],a[2],o,l,u,n.epsilon),h=[o,u,l/d],f=[o,u],r.compute({name:"InstanceNormalization",shaderCache:{hint:`${d}`,inputDependencies:["type","none"]},getRunData:()=>({outputs:[{dims:s,dataType:a[0].dataType}],dispatchGroup:{x:Math.ceil(p/64)},programUniforms:[{type:12,data:p},...tS(h,f,h)]}),getShaderSource:t=>{let i=tR("x",a[0].dataType,h.length,d),r=tR("scale_shift",1,f.length,2),n=tB("output",a[0].dataType,h.length,d),s=[i,r,n];return`
  ${t.registerUniform("output_size","u32").declareVariables(...s)}
  ${t.mainStart()}
  ${t.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let outputIndices = ${n.offsetToIndices("global_idx")};
      let batch = outputIndices[0];
      let channel = outputIndices[1];
      let scale_shift = ${r.getByIndices("vec2<u32>(batch, channel)")};
      let value = ${i.getByOffset("global_idx")} * ${n.type.value}(scale_shift.x) + ${n.type.value}(scale_shift.y);
      ${n.setByOffset("global_idx","value")};
  }`}},{inputs:[a[0],c]}))}}),n7=q(()=>{"use strict";nf(),ny(),nC(),aE=(t,i)=>{(t=>{if(!t||t.length<2)throw Error("layerNorm requires at least 2 inputs.")})(t.inputs),t.compute(((t,i,r)=>{let a=i.simplified,n=t[0].dims,s=t[1],o=!a&&t[2],u=e3.normalizeAxis(i.axis,n.length),l=e3.sizeToDimension(n,u),d=e3.sizeFromDimension(n,u),p=e3.size(s.dims),c=o?e3.size(o.dims):0;if(p!==d||o&&c!==d)throw Error(`Size of X.shape()[axis:] == ${d}.
       Size of scale and bias (if provided) must match this.
       Got scale size of ${p} and bias size of ${c}`);let h=[];for(let t=0;t<n.length;++t)t<u?h.push(n[t]):h.push(1);let f=tT(d),m=["type","type"],g=[{type:12,data:l},{type:1,data:d},{type:12,data:Math.floor(d/f)},{type:1,data:i.epsilon}];o&&m.push("type");let y=r>1,_=r>2,b=[{dims:n,dataType:t[0].dataType}];return y&&b.push({dims:h,dataType:1}),_&&b.push({dims:h,dataType:1}),{name:"LayerNormalization",shaderCache:{hint:`${f};${r};${a}`,inputDependencies:m},getRunData:()=>({outputs:b,dispatchGroup:{x:Math.ceil(l/64)},programUniforms:g}),getShaderSource:i=>{let r=tC(t[0].dataType),u=[tR("x",t[0].dataType,t[0].dims,f),tR("scale",s.dataType,s.dims,f)];return o&&u.push(tR("bias",o.dataType,o.dims,f)),u.push(tB("output",t[0].dataType,n,f)),y&&u.push(tB("mean_data_output",1,h)),_&&u.push(tB("inv_std_output",1,h)),`
  ${i.registerUniforms([{name:"norm_count",type:"u32"},{name:"norm_size",type:"f32"},{name:"norm_size_vectorized",type:"u32"},{name:"epsilon",type:"f32"}]).declareVariables(...u)}
  ${i.mainStart()}
    ${i.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.norm_count")}
    let offset = global_idx * uniforms.norm_size_vectorized;
    var mean_vector = ${tI("f32",f)};
    var mean_square_vector = ${tI("f32",f)};

    for (var h: u32 = 0u; h < uniforms.norm_size_vectorized; h++) {
      let value = ${tE(r,f,"x[h + offset]")};
      mean_vector += value;
      mean_square_vector += value * value;
    }
    let mean = ${tz("mean_vector",f)} / uniforms.norm_size;
    let inv_std_dev = inverseSqrt(${tz("mean_square_vector",f)} / uniforms.norm_size ${a?"":"- mean * mean"} + uniforms.epsilon);

    for (var j: u32 = 0; j < uniforms.norm_size_vectorized; j++) {
      let f32input = ${tE(r,f,"x[j + offset]")};
      let f32scale = ${tE(r,f,"scale[j]")};
      output[j + offset] = ${u[0].type.value}((f32input ${a?"":"- mean"}) * inv_std_dev * f32scale
        ${o?`+ ${tE(r,f,"bias[j]")}`:""}
      );
    }

    ${y?"mean_data_output[global_idx] = mean":""};
    ${_?"inv_std_output[global_idx] = inv_std_dev":""};
  }`}}})(t.inputs,i,t.outputCount))}}),se=q(()=>{"use strict";ny(),nU(),nq(),az=t=>{var i=t.inputs;if(!i||2!==i.length)throw Error("MatMul requires 2 inputs.");if(i[0].dims[i[0].dims.length-1]!==i[1].dims[i[1].dims.length-2])throw Error("shared dimension does not match.");let r=e1.calcShape(t.inputs[0].dims,t.inputs[1].dims,!0);if(!r)throw Error("Can't use matmul on the given tensors");let a=r[r.length-1],n=t.inputs[0].dims[t.inputs[0].dims.length-1];if(a<8&&n<8)t.compute(rv(t.inputs,{activation:""},r));else{let i=r[r.length-2],s=e3.size(t.inputs[0].dims.slice(0,-2)),o=e3.size(t.inputs[1].dims.slice(0,-2));if(1!==s&&1===i&&1===o){let i=t.inputs[0].reshape([1,s,n]),o=t.inputs[1].reshape([1,n,a]),u=[1,s,a],l=[i,o];t.compute(rk(l,{activation:""},r,u),{inputs:l})}else t.compute(rk(t.inputs,{activation:""},r))}}}),st=q(()=>{"use strict";nf(),ny(),nx(),nC(),aA=(t,i)=>{var r,a,n,s;let o,u,l,d,p,c,h,f,m,g,y,_,b,$,v,w,x,C,k,S,T,I,E,z,A,O,R,B,N,M,D,P,U,q,W,L,V,G,j,H,F;((t,i)=>{if(t.length<3||t.length>4)throw Error("MatMulNBits requires 3 or 4 inputs");let r=t[0],a=r.dims.length;if(r.dims[a-1]!==i.k)throw Error("The last dim of input shape does not match the k value");let n=Math.floor((i.k+i.blockSize-1)/i.blockSize),s=i.blockSize/8*i.bits,o=t[1];if(!e3.areEqual(o.dims,[i.n,n,s]))throw Error("The second inputs must be 3D tensor with shape N X nBlocksPerCol X blobSize");let u=t[2].dims;if(e3.size(u)!==i.n*n)throw Error("scales input size error.");if(4===t.length){let r=t[3].dims,a=i.n*(8===i.bits?n:Math.floor((n*i.bits+7)/8));if(e3.size(r)!==a)throw Error("zeroPoints input size error.")}})(t.inputs,i),32===i.blockSize&&t.adapterInfo.isVendor("intel")&&t.adapterInfo.isArchitecture("gen-12lp")?t.compute((r=t.inputs,a=i,u=(o=r[0].dims).length,l=o[u-2],d=a.k,p=a.n,c=o.slice(0,u-2),h=e3.size(c),f=r[1].dims[2]/4,m=r[0].dataType,g=tT(a.k),y=tT(f),_=c.concat([l,p]),w=(v=($=128/(b=p%8==0?8:p%4==0?4:1))*y*8)/g,x=v/a.blockSize,C=e3.size(_)/b,k=[],S=[h,l,d/g],(T=e3.convertShape(r[1].dims).slice()).splice(-1,1,f/y),k.push(...tS(S)),k.push(...tS(T)),k.push(...tS(r[2].dims)),4===r.length&&k.push(...tS(e3.convertShape(r[3].dims))),I=[h,l,p],k.push(...tS(I)),{name:"BlockwiseMatMulNBits32",shaderCache:{hint:`${a.blockSize};${g};${y};${$};${b}`,inputDependencies:Array(r.length).fill("rank")},getRunData:()=>({outputs:[{dims:_,dataType:m}],dispatchGroup:{x:C},programUniforms:k}),getShaderSource:t=>{let i=S.length,n=tR("a",r[0].dataType,i,g),s=tR("b",12,T.length,y),o=tR("scales",r[2].dataType,r[2].dims.length),u=[n,s,o],l=4===r.length?tR("zero_points",12,r[3].dims.length):void 0;l&&u.push(l);let d=I.length,p=tB("output",r[0].dataType,d),c=tC(r[0].dataType);return`
        var<workgroup> sub_a: array<${n.type.value}, ${w}>;
        var<workgroup> inter_results: array<array<${p.type.value}, ${$}>, ${b}>;
        ${t.declareVariables(...u,p)}
        ${t.mainStart([$,b,1])}
          let output_indices = ${p.offsetToIndices(`workgroup_index * ${b}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let n_blocks_per_col = uniforms.b_shape[1];
          let num_tiles =  (n_blocks_per_col - 1) / ${x} + 1;

          // Loop over shared dimension.
          for (var tile: u32 = 0; tile < num_tiles; tile += 1) {
            let a_col_start = tile * ${w};
            // load one tile A data into shared memory.
            for (var a_offset = local_idx; a_offset < ${w}; a_offset += 128)
            {
              let a_col = a_col_start + a_offset;
              if (a_col < uniforms.a_shape[2])
              {
                sub_a[a_offset] = ${n.getByIndices(`${n.type.indices}(batch, row, a_col)`)};
              } else {
                sub_a[a_offset] = ${n.type.value}(0);
              }
            }
            workgroupBarrier();

            // each thread process one block
            let b_row = col + local_id.y;
            let block = tile * ${x} + local_id.x;
            ${l?`
            let zero_point_bytes_per_col = (n_blocks_per_col + 1) / 2;
            let zero_point_byte_count = b_row * zero_point_bytes_per_col + (block >> 0x1u);
            let zero_point_word_index = zero_point_byte_count >> 0x2u;
            let zero_point_byte_offset = zero_point_byte_count & 0x3u;
            let zero_point_nibble_offset: u32 = block & 0x1u;
            let zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_nibble_offset << 2);
            let zero_point_word = ${l.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point = ${c}((zero_point_word) & 0xFu);`:`
            // The default zero point is 8 for unsigned 4-bit quantization.
            let zero_point = ${c}(8);`}
            let scale = ${o.getByOffset("b_row * n_blocks_per_col + block")};
            let b_data = ${s.getByIndices(`${s.type.indices}(b_row, block, 0)`)};
            var word_offset = local_id.x * ${a.blockSize/g};
            for (var i: u32 = 0; i < ${y}; i++) {
              ${(()=>{switch(g){case 1:return`
          let a_data0 = vec4<${c}>(sub_a[word_offset], sub_a[word_offset + 1], sub_a[word_offset + 2], sub_a[word_offset + 3]);
          let a_data1 = vec4<${c}>(sub_a[word_offset + 4], sub_a[word_offset + 5], sub_a[word_offset + 6], sub_a[word_offset + 7]);`;case 2:return`
          let a_data0 = vec4<${c}>(sub_a[word_offset], sub_a[word_offset + 1]);
          let a_data1 = vec4<${c}>(sub_a[word_offset + 2], sub_a[word_offset + 3]);`;case 4:return`
          let a_data0 = sub_a[word_offset];
          let a_data1 = sub_a[word_offset + 1];`;default:throw Error(`${g}-component is not supported.`)}})()}
              let b_value = ${1===y?"b_data":"b_data[i]"};
              let b_value_lower = unpack4xU8(b_value & 0x0F0F0F0Fu);
              let b_value_upper = unpack4xU8((b_value >> 4) & 0x0F0F0F0Fu);
              let b_quantized_values = mat2x4<${c}>(${Array.from({length:4},(t,i)=>`${c}(b_value_lower[${i}]), ${c}(b_value_upper[${i}])`).join(", ")});
              let b_dequantized_values = (b_quantized_values - mat2x4<${c}>(${Array(8).fill("zero_point").join(",")})) * scale;
              inter_results[local_id.y][local_id.x] += ${Array.from({length:2},(t,i)=>`dot(a_data${i}, b_dequantized_values[${i}])`).join(" + ")};
              word_offset += ${8/g};
            }
            workgroupBarrier();
          }

          if (local_idx < ${b}) {
            var output_value: ${p.type.value} = ${p.type.value}(0);
            for (var b = 0u; b < ${$}; b++) {
              output_value += inter_results[local_idx][b];
            }
            if (col + local_idx < uniforms.output_shape[2])
            {
              ${p.setByIndices(`${p.type.indices}(batch, row, col + local_idx)`,"output_value")}
            }
          }
        }`}})):t.compute((n=t.inputs,s=i,z=(E=n[0].dims).length,A=E[z-2],O=s.k,R=s.n,B=E.slice(0,z-2),N=e3.size(B),M=n[1].dims[2]/4,D=n[0].dataType,P=tT(s.k),U=tT(M),q=tT(R),W=B.concat([A,R]),L=A>1&&R/q%2==0?2:1,V=e3.size(W)/q/L,G=[],j=[N,A,O/P],(H=e3.convertShape(n[1].dims).slice()).splice(-1,1,M/U),G.push(...tS(j)),G.push(...tS(H)),G.push(...tS(n[2].dims)),4===n.length&&G.push(...tS(e3.convertShape(n[3].dims))),F=[N,A,R/q],G.push(...tS(F)),{name:"MatMulNBits",shaderCache:{hint:`${s.blockSize};${s.bits};${P};${U};${q};${L};64`,inputDependencies:Array(n.length).fill("rank")},getRunData:()=>({outputs:[{dims:W,dataType:D}],dispatchGroup:{x:V},programUniforms:G}),getShaderSource:t=>{let i=j.length,r=tR("a",n[0].dataType,i,P),a=tR("b",12,H.length,U),o=tR("scales",n[2].dataType,n[2].dims.length),u=[r,a,o],l=4===n.length?tR("zero_points",12,n[3].dims.length):void 0;l&&u.push(l);let d=F.length,p=tB("output",n[0].dataType,d,q),c=tC(n[0].dataType),h=(()=>{switch(P){case 1:return`array<${c}, 8>`;case 2:return`mat4x2<${c}>`;case 4:return`mat2x4<${c}>`;default:throw Error(`${P}-component is not supported.`)}})();return`
        var<workgroup> workgroup_shared: array<${p.type.value}, ${64*L}>;
        ${t.declareVariables(...u,p)}
        ${t.mainStart([64,1,1])}
          let output_indices = ${p.offsetToIndices(`(global_idx / 64) * ${L}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let nBlocksPerCol = uniforms.b_shape[1];

          for (var block = local_id.x; block < nBlocksPerCol; block += 64) {
            //process one block
            var word_offset: u32 = block * ${s.blockSize/P};
            ${(()=>{let t=`
            var col_index = col * ${q};
            ${l?`
            let zero_point_bytes_per_col = (nBlocksPerCol + 1) / 2;
            var zero_point_byte_count: u32;
            var zero_point_word_index: u32;
            var zero_point_byte_offset: u32;
            let zero_point_nibble_offset: u32 = block & 0x1u;
            var zero_point_bits_offset: u32;
            var zero_point_word: u32;`:`
            // The default zero point is 8 for unsigned 4-bit quantization.
            let zero_point = ${c}(8);`}
            `;for(let i=0;i<q*L;i++)t+=`
            let scale${i} = ${o.getByOffset("col_index * nBlocksPerCol + block")};
            ${l?`
            zero_point_byte_count = col_index * zero_point_bytes_per_col + (block >> 0x1u);
            zero_point_word_index = zero_point_byte_count >> 0x2u;
            zero_point_byte_offset = zero_point_byte_count & 0x3u;
            zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_nibble_offset << 2);
            zero_point_word = ${l.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point${i} = ${c}((zero_point_word) & 0xFu);`:""}
            col_index += 1;`;return t})()}
            for (var word: u32 = 0; word < ${M}; word += ${U}) {
              ${(()=>{let t=`col_index = col * ${q};`;for(let i=0;i<q*L;i++)t+=`
            let b${i}_data = ${a.getByIndices(`${a.type.indices}(col_index, block, word)`)};
            col_index += 1;`;return t+`
            var b_value: u32;
            let b_mask: u32 = 0x0F0F0F0Fu;
            var b_value_lower: vec4<u32>;
            var b_value_upper: vec4<u32>;
            var b_quantized_values: ${h};
            var b_dequantized_values: ${h};`})()}
              for (var i: u32 = 0; i < ${U}; i++) {
                ${(()=>{let t=`
          // reuse a data
            var input_offset = ${r.indicesToOffset(`${r.type.indices}(batch, row, word_offset)`)};
            var a_data: ${h};
            for (var j: u32 = 0; j < ${8/P}; j++) {
              a_data[j] = ${r.getByOffset("input_offset")};
              input_offset++;
            }
          `;for(let i=0;i<q*L;i++)t+=`
            b_value = ${1===U?`b${i}_data`:`b${i}_data[i]`};
            b_value_lower = unpack4xU8(b_value & b_mask);
            b_value_upper = unpack4xU8((b_value >> 4) & b_mask);
            b_quantized_values = ${h}(${Array.from({length:4},(t,i)=>`${c}(b_value_lower[${i}]), ${c}(b_value_upper[${i}])`).join(", ")});
            b_dequantized_values = ${1===P?`${h}(${Array.from({length:8},(t,r)=>`(b_quantized_values[${r}] - ${l?`zero_point${i}`:"zero_point"}) * scale${i}`).join(", ")});`:`(b_quantized_values - ${h}(${Array(8).fill(`${l?`zero_point${i}`:"zero_point"}`).join(",")})) * scale${i};`};
            workgroup_shared[local_id.x * ${L} + ${Math.floor(i/q)}]${q>1?`[${i%q}]`:""} += ${Array.from({length:8/P},(t,i)=>`${1===P?`a_data[${i}] * b_dequantized_values[${i}]`:`dot(a_data[${i}], b_dequantized_values[${i}])`}`).join(" + ")};
          `;return t})()}
                word_offset += ${8/P};
              }
            }
          }
          workgroupBarrier();

          if (local_id.x < ${L}) {
            var output_value: ${p.type.value} = ${p.type.value}(0);
            var workgroup_shared_offset: u32 = local_id.x;
            for (var b: u32 = 0u; b < 64u; b++) {
              output_value += workgroup_shared[workgroup_shared_offset];
              workgroup_shared_offset += ${L};
            }
            ${p.setByIndices(`${p.type.indices}(batch, row, col + local_id.x)`,"output_value")};
          }
        }`}}))},aO=t=>tv(t)}),si=q(()=>{"use strict";nf(),ny(),nC(),aR=(t,i)=>{let r,a,n,s;var o,u,l=t.inputs;if(!l||l.length<1)throw Error("Too few inputs");if(1!==l[0].dataType&&10!==l[0].dataType)throw Error("Input type must be float or float16.");if(l.length>=2){let t=2*l[0].dims.length===l[1].dims[0];if(4===l.length&&(t=2*l[3].dims[0]===l[1].dims[0]),!t)throw Error("The pads should be a 1D tensor of shape [2 * input_rank] or [2 * num_axes].")}let d=((t,i)=>{if(!(t.length>1))return i;{let r=t[1].getBigInt64Array(),a=t.length>=3&&t[2].data?10===t[2].dataType?t[2].getUint16Array()[0]:t[2].getFloat32Array()[0]:0,n=t[0].dims.length,s=new Int32Array(2*n).fill(0);if(t.length>=4){let i=t[3].getBigInt64Array();for(let t=0;t<i.length;t++)s[Number(i[t])]=Number(r[t]),s[Number(i[t])+n]=Number(r[t+i.length])}else r.forEach((t,i)=>s[Number(i)]=Number(t));let o=[];return s.forEach(t=>o.push(t)),{mode:i.mode,value:a,pads:o}}})(t.inputs,i);t.compute((o=t.inputs,u=d,r=e3.padShape(o[0].dims.slice(),u.pads),a=o[0].dims,n=[{type:12,data:e3.size(r)},{type:6,data:u.pads}],s=o.length>=3&&o[2].data,0===u.mode&&n.push({type:s?o[2].dataType:1,data:u.value}),n.push(...tS(o[0].dims,r)),{name:"Pad",shaderCache:{hint:`${u.mode}${s}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:r,dataType:o[0].dataType}],dispatchGroup:{x:Math.ceil(e3.size(r)/64)},programUniforms:n}),getShaderSource:t=>{let i=tB("output",o[0].dataType,r.length),n=tR("x",o[0].dataType,a.length),l=n.type.value,d=((t,i,r)=>{switch(r.mode){case 0:var a=t,n=i,s=r.pads.length;let o="";for(let t=n-1;t>=0;--t)o+=`
            k = i32(${a.indicesGet("indices",t)}) - ${tA("uniforms.pads",t,s)};
            if (k < 0) {
              break;
            }
            if (k >= i32(${tA("uniforms.x_shape",t,n)})) {
              break;
            }
            offset += k * i32(${tA("uniforms.x_strides",t,n)});
        `;return`
          value = ${a.type.value}(uniforms.constant_value);
          for (var i = 0; i < 1; i++) {
            var offset = 0;
            var k = 0;
            ${o}
            value = x[offset];
          }
      `;case 1:var u=t,l=i,d=r.pads.length;let p="";for(let t=l-1;t>=0;--t)p+=`
                k = i32(${u.indicesGet("indices",t)}) - ${tA("uniforms.pads",t,d)};
                if (k < 0) {
                  k = -k;
                }
                {
                  let _2n_1 = 2 * (i32(${tA("uniforms.x_shape",t,l)}) - 1);
                  k = k % _2n_1;
                  if(k >= i32(${tA("uniforms.x_shape",t,l)})) {
                    k = _2n_1 - k;
                  }
                }
                offset += k * i32(${tA("uniforms.x_strides",t,l)});
            `;return`
              var offset = 0;
              var k = 0;
              ${p}
              value = x[offset];
          `;case 2:var c=t,h=i,f=r.pads.length;let m="";for(let t=h-1;t>=0;--t)m+=`
                k = i32(${c.indicesGet("indices",t)}) - ${tA("uniforms.pads",t,f)};
                if (k < 0) {
                  k = 0;
                }
                if (k >= i32(${tA("uniforms.x_shape",t,h)})) {
                  k = i32(${tA("uniforms.x_shape",t,h)}) - 1;
                }
                offset += k * i32(${tA("uniforms.x_strides",t,h)});
            `;return`
              var offset = 0;
              var k = 0;
              ${m}
              value = x[offset];
          `;case 3:var g=t,y=i,_=r.pads.length;let b="";for(let t=y-1;t>=0;--t)b+=`
                k = i32(${g.indicesGet("indices",t)}) - ${tA("uniforms.pads",t,_)};
                if (k < 0)  {
                  k += i32(${tA("uniforms.x_shape",t,y)}]);
                }
                if (k >= i32(${tA("uniforms.x_shape",t,y)})) {
                  k -= i32(${tA("uniforms.x_shape",t,y)});
                }
                offset += k * i32(${tA("uniforms.x_strides",t,y)});
            `;return`
              var offset = 0;
              var k = 0;
              ${b}
              value = x[offset];
          `;default:throw Error("Invalid mode")}})(i,a.length,u),p=[{name:"output_size",type:"u32"},{name:"pads",type:"i32",length:u.pads.length}];return 0===u.mode&&p.push({name:"constant_value",type:s?l:"f32"}),`
            ${t.registerUniforms(p).declareVariables(n,i)}
            ${t.mainStart()}
            ${t.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

            let indices = ${i.offsetToIndices("global_idx")};

            var value = ${l}(0);
            ${d}
            output[global_idx] = value;
        }`}}),{inputs:[0]})}}),sr=q(()=>{"use strict";eu(),nf(),ny(),nC(),aB=t=>{if(f.webgpu.validateInputContent&&(!t||1!==t.length))throw Error("Pool ops requires 1 input.")},aN=(t,i,r)=>{let a="NHWC"===i.format,n=t.dims.slice();a&&n.splice(1,0,n.pop());let s=Object.hasOwnProperty.call(i,"dilations"),o=i.kernelShape.slice(),u=i.strides.slice(),l=s?i.dilations.slice():[],d=i.pads.slice();e4.adjustPoolAttributes(r,n,o,u,l,d);let p=e4.computePoolOutputShape(r,n,u,l,o,d,i.autoPad),c=Object.assign({},i);s?Object.assign(c,{kernelShape:o,strides:u,pads:d,dilations:l,cacheKey:i.cacheKey}):Object.assign(c,{kernelShape:o,strides:u,pads:d,cacheKey:i.cacheKey});let h=p.slice();return h.push(h.splice(1,1)[0]),[c,a?h:p]},aM=(t,i)=>{let r="NHWC"===i.format,a=[{type:12,data:e3.size(t)},{type:12,data:e3.size(i.kernelShape)}],n=[{name:"outputSize",type:"u32"},{name:"kernelSize",type:"u32"}];if(i.kernelShape.length<=2){let t=i.kernelShape[i.kernelShape.length-1],r=i.strides[i.strides.length-1],s=i.pads[i.pads.length/2-1],o=i.pads[i.pads.length-1],u=!!(s+o);a.push({type:12,data:t},{type:12,data:r},{type:12,data:s},{type:12,data:o}),n.push({name:"kw",type:"u32"},{name:"sw",type:"u32"},{name:"pwStart",type:"u32"},{name:"pwEnd",type:"u32"});let l=!1;if(2===i.kernelShape.length){let t=i.kernelShape[i.kernelShape.length-2],r=i.strides[i.strides.length-2],s=i.pads[i.pads.length/2-2],o=i.pads[i.pads.length-2];l=!!(s+o),a.push({type:12,data:t},{type:12,data:r},{type:12,data:s},{type:12,data:o}),n.push({name:"kh",type:"u32"},{name:"sh",type:"u32"},{name:"phStart",type:"u32"},{name:"phEnd",type:"u32"})}return[a,n,!0,u,l]}{if(r)throw Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let t=e3.computeStrides(i.kernelShape);return a.push({type:12,data:t},{type:12,data:i.pads},{type:12,data:i.strides}),n.push({name:"kernelStrides",type:"u32",length:t.length},{name:"pads",type:"u32",length:i.pads.length},{name:"strides",type:"u32",length:i.strides.length}),[a,n,!!i.pads.reduce((t,i)=>t+i),!1,!1]}},aD=(t,i,r,a,n,s,o,u,l,d,p,c)=>{let h="NHWC"===n.format,f=i.type.value,m=tB("output",i.type.tensor,a);if(n.kernelShape.length<=2){let a="",d="",g="",y=r-(h?2:1);if(a=p?`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${y}] = indices[${y}] * uniforms.sw - uniforms.pwStart + i;
                  if (xIndices[${y}] < 0 || xIndices[${y}]
                      >= uniforms.x_shape[${y}]) {
                    pad++;
                    continue;
                  }
                  let x_val = x[${i.indicesToOffset("xIndices")}];
                  ${s}
                }`:`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${y}] = indices[${y}] * uniforms.sw - uniforms.pwStart + i;
                  let x_val = x[${i.indicesToOffset("xIndices")}];
                  ${s}
                }`,2===n.kernelShape.length){let t=r-(h?3:2);d=c?`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${t}] = indices[${t}] * uniforms.sh - uniforms.phStart + j;
                  if (xIndices[${t}] < 0 || xIndices[${t}] >= uniforms.x_shape[${t}]) {
                    pad += i32(uniforms.kw);
                    continue;
                  }
              `:`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${t}] = indices[${t}] * uniforms.sh - uniforms.phStart + j;
                `,g=`
              }
            `}return`
            ${t.registerUniforms(l).declareVariables(i,m)}

            ${t.mainStart()}
              ${t.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

              let indices = ${m.offsetToIndices("global_idx")};
              var xIndices = ${m.offsetToIndices("global_idx")};

              var value = ${f}(${u});
              var pad = 0;
              ${d}
              ${a}
              ${g}
              ${o}

              output[global_idx] = value;
            }`}{if(h)throw Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let a=n.kernelShape.length,p=n.pads.length,c="";return c=d?`
                if (xIndices[j] >= uniforms.x_shape[j]) {
                  pad++;
                  isPad = true;
                  break;
                }
              }
              if (!isPad) {
                let x_val = x[${i.indicesToOffset("xIndices")}];
                ${s}
              }`:`
              }
              let x_val = x[${i.indicesToOffset("xIndices")}];
              ${s}
            `,`
            ${t.registerUniforms(l).declareVariables(i,m)}

            ${t.mainStart()}
              ${t.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
              let indices = ${m.offsetToIndices("global_idx")};
              var xIndices = ${m.offsetToIndices("global_idx")};

              var offsets: array<u32, ${a}>;

              var value = ${f}(${u});
              var pad = 0;
              var isPad = false;

              for (var i: u32 = 0u; i < uniforms.kernelSize; i++) {
                var offset = i;
                for (var j = 0u; j < ${a-1}u; j++) {
                  offsets[j] = offset / ${tA("uniforms.kernelStrides","j",a)};
                  offset -= offsets[j] * ${tA("uniforms.kernelStrides","j",a)};
                }
                offsets[${a-1}] = offset;

                isPad = false;
                for (var j = ${r-a}u; j < ${r}u; j++) {
                  xIndices[j] = indices[j] * ${tA("uniforms.strides",`j - ${r-a}u`,a)}
                    + offsets[j - ${r-a}u] - ${tA("uniforms.pads","j - 2u",p)};
                  ${c}
              }
              ${o}

              output[global_idx] = value;
            }`}},aP=t=>`${t.format};${t.ceilMode};${t.autoPad};${t.kernelShape.length}`,aU=t=>({format:t.format,autoPad:["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][t.auto_pad],ceilMode:t.ceil_mode,kernelShape:t.kernel_shape,strides:t.strides,pads:t.pads}),aq=(t,i,r,a)=>{let[n,s]=aN(i,a,r),o=tR("x",i.dataType,i.dims.length),u=o.type.value,l="";n.countIncludePad?l+=`value /= ${u}(uniforms.kernelSize);`:l+=`value /= ${u}(i32(uniforms.kernelSize) - pad);`;let[d,p,c,h,f]=aM(s,n);return d.push(...tS(i.dims,s)),{name:t,shaderCache:{hint:`${a.cacheKey};${c};${h};${f}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:s,dataType:i.dataType}],dispatchGroup:{x:Math.ceil(e3.size(s)/64)},programUniforms:d}),getShaderSource:t=>aD(t,o,i.dims.length,s.length,n,"value += x_val;",l,0,p,c,h,f)}},aW=t=>{let i,r=0!==t.count_include_pad,a=aU(t);if(0!==a.ceilMode)throw Error("using ceil() in shape computation is not yet supported for AveragePool");let n={countIncludePad:r,...a,cacheKey:""};return{...n,cacheKey:(i=n,`${aP(i)};${i.countIncludePad}`)}},aL=(t,i)=>{aB(t.inputs),t.compute(aq("AveragePool",t.inputs[0],!1,i))},aV={autoPad:"",ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[]},aG=t=>{let i=t.format;return{format:i,...aV,cacheKey:i}},aj=(t,i)=>{aB(t.inputs),t.compute(aq("GlobalAveragePool",t.inputs[0],!0,i))},aH=(t,i,r,a)=>{let[n,s]=aN(i,a,r),o=`
      value = max(x_val, value);
    `,u=tR("x",i.dataType,i.dims.length),[l,d,p,c,h]=aM(s,n);return l.push(...tS(i.dims,s)),{name:t,shaderCache:{hint:`${a.cacheKey};${p};${c};${h}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:s,dataType:i.dataType}],dispatchGroup:{x:Math.ceil(e3.size(s)/64)},programUniforms:l}),getShaderSource:t=>aD(t,u,i.dims.length,s.length,n,o,"",10===i.dataType?-65504:-1e5,d,p,c,h)}},aF=(t,i)=>{aB(t.inputs),t.compute(aH("MaxPool",t.inputs[0],!1,i))},aK=t=>{let i,r=t.storage_order,a=t.dilations,n=aU(t);if(0!==r)throw Error("column major storage order is not yet supported for MaxPool");if(0!==n.ceilMode)throw Error("using ceil() in shape computation is not yet supported for MaxPool");let s={storageOrder:r,dilations:a,...n,cacheKey:""};return{...s,cacheKey:(i=s,`${aP(i)};${i.storageOrder};${i.dilations}`)}},aZ=t=>{let i=t.format;return{format:i,...aV,cacheKey:i}},aQ=(t,i)=>{aB(t.inputs),t.compute(aH("GlobalMaxPool",t.inputs[0],!0,i))}}),sa=q(()=>{"use strict";nf(),ny(),nx(),nC(),aX=(t,i)=>{var r,a;let n,s,o,u,l,d,p,c,h,f,m,g,y,_,b,$,v,w,x,C,k,S,T;((t,i)=>{if(t.length<2||t.length>3)throw Error("DequantizeLinear requires 2 or 3 inputs.");if(3===t.length&&t[1].dims===t[2].dims)throw Error("x-scale and x-zero-point must have the same shape.");if(3===t.length&&t[0].dataType!==t[2].dataType)throw Error("x and x-zero-point must have the same data type.");if(6===t[0].dataType&&t.length>2)throw Error("In the case of dequantizing int32 there is no zero point.");if(0!==t[1].dims.length&&1!==t[1].dims.length&&t[1].dims.length!==t[0].dims.length)throw Error("scale input must be a scalar, a 1D tensor, or have the same rank as the input tensor.");if(t.length>2){if(t[0].dataType!==t[2].dataType)throw Error("x and x-zero-point must have the same data type.");if(t[1].dims.length!==t[2].dims.length)throw Error("scale and zero-point inputs must have the same rank.");if(!t[1].dims.map((i,r)=>i===t[2].dims[r]).reduce((t,i)=>t&&i,!0))throw Error("scale and zero-point inputs must have the same shape.")}if(i.blockSize>0){if(0===t[1].dims.length||1===t[1].dims.length&&1===t[1].dims[0])throw Error("blockSize must be set only for block quantization.");if(!t[1].dims.map((r,a)=>a===i.axis||r===t[0].dims[a]).reduce((t,i)=>t&&i,!0))throw Error("For block qunatization, scale input shape to match the input shape except for the axis");if(t[1].dims.length!==t[0].dims.length)throw Error("For block qunatization the scale input rank must be the same as the x rank.");let r=t[0].dims[i.axis],a=t[1].dims[i.axis];if(i.blockSize<Math.ceil(r/a)||i.blockSize>Math.ceil(r/(a-1)-1))throw Error("blockSize must be with in the range [ceil(dI / Si), ceil(dI / (Si - 1) - 1)].")}})(t.inputs,i),t.compute((r=t.inputs,a=i,n=e3.normalizeAxis(a.axis,r[0].dims.length),o=3===(s=r[0].dataType),u=r[0].dims,l=r[1].dataType,d=e3.size(u),c=(p=3===s||2===s)?[Math.ceil(e3.size(r[0].dims)/4)]:r[0].dims,h=r[1].dims,m=(f=r.length>2?r[2]:void 0)?p?[Math.ceil(e3.size(f.dims)/4)]:f.dims:void 0,y=!1==(g=0===h.length||1===h.length&&1===h[0])&&1===h.length,_=tT(d),$=(b=g&&(!p||4===_))?_:1,v=tR("input",p?12:s,c.length,b&&!p?_:1),w=tR("scale",l,h.length),x=f?tR("zero_point",p?12:s,m.length):void 0,C=tB("output",l,u.length,$),k=[v,w],x&&k.push(x),S=[c,h],f&&S.push(m),T=[{type:12,data:d/$},{type:12,data:n},{type:12,data:a.blockSize},...tS(...S,u)],{name:"DequantizeLinear",shaderCache:{hint:a.cacheKey,inputDependencies:x?["rank","rank","rank"]:["rank","rank"]},getShaderSource:t=>`
      ${t.registerUniforms([{name:"output_size",type:"u32"},{name:"axis",type:"u32"},{name:"block_size",type:"u32"}]).declareVariables(...k,C)}
      ${t.mainStart()}
          ${t.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let output_indices = ${C.offsetToIndices("global_idx")};

          // Set input x
          ${p?`
            let input = ${v.getByOffset("global_idx / 4")};
            let x_vec = ${o?"unpack4xI8(input)":"unpack4xU8(input)"};
            let x_value = ${1===$?"x_vec[global_idx % 4]":"x_vec"};`:`let x_value = ${v.getByOffset("global_idx")};`};

          // Set scale input
          ${g?`let scale_value= ${w.getByOffset("0")}`:y?`
            let scale_index = ${C.indicesGet("output_indices","uniforms.axis")};
            let scale_value= ${w.getByOffset("scale_index")};`:`
            var scale_indices: ${w.type.indices} = output_indices;
            let index = ${w.indicesGet("scale_indices","uniforms.axis")} / uniforms.block_size;
            ${w.indicesSet("scale_indices","uniforms.axis","index")};
            let scale_value= ${w.getByIndices("scale_indices")};`};

          // Set zero-point input
          ${x?g?p?`
                let zero_point_input = ${x.getByOffset("0")};
                let zero_point_vec =  ${o?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value= zero_point_vec[0]`:`let zero_point_value = ${x.getByOffset("0")}`:y?p?`
                let zero_point_index = ${C.indicesGet("output_indices","uniforms.axis")};
                let zero_point_input = ${x.getByOffset("zero_point_index / 4")};
                let zero_point_vec =  ${o?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_index % 4]`:`
                let zero_point_index = ${C.indicesGet("output_indices","uniforms.axis")};
                let zero_point_value = ${x.getByOffset("zero_point_index")};`:p?`
                let zero_point_offset = ${w.indicesToOffset("scale_indices")};
                let zero_point_input = ${x.getByOffset("zero_point_offset / 4")};
                let zero_point_vec = ${o?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_offset % 4];`:`let zero_point_value = ${x.getByIndices("scale_indices")};`:`let zero_point_value = ${p?o?"i32":"u32":v.type.value}(0);`};
      // Compute and write output
      ${C.setByOffset("global_idx",`${C.type.value}(x_value - zero_point_value) * scale_value`)};
      }`,getRunData:()=>({outputs:[{dims:u,dataType:l}],dispatchGroup:{x:Math.ceil(d/$/64),y:1,z:1},programUniforms:T})}))},aY=t=>tv({axis:t.axis,blockSize:t.blockSize})}),sn=q(()=>{"use strict";eu(),nf(),nC(),aJ=t=>{var i,r,a,n;let s,o,u,l=0,d=0,p=0;6===t.inputs[0].dataType?(l=t.inputs[0].getInt32Array()[0],d=t.inputs[1].getInt32Array()[0],p=t.inputs[2].getInt32Array()[0]):1===t.inputs[0].dataType&&(l=t.inputs[0].getFloat32Array()[0],d=t.inputs[1].getFloat32Array()[0],p=t.inputs[2].getFloat32Array()[0]),f.webgpu.validateInputContent&&((t,i,r)=>{if(t===i||t<i&&r<0||t>i&&r>0)throw Error("Range these inputs' contents are invalid.")})(l,d,p),t.compute((i=l,r=d,a=p,n=t.inputs[0].dataType,o=[s=Math.abs(Math.ceil((r-i)/a))],u=[{type:12,data:s},{type:n,data:i},{type:n,data:a},...tS(o)],{name:"Range",shaderCache:{hint:`${n}`},getShaderSource:t=>{let i=tB("output",n,o.length),r=i.type.value;return`
        ${t.registerUniforms([{name:"outputSize",type:"u32"},{name:"start",type:r},{name:"delta",type:r}]).declareVariables(i)}
        ${t.mainStart()}
        ${t.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        output[global_idx] = uniforms.start + ${r}(global_idx) * uniforms.delta;
      }`},getRunData:()=>({outputs:[{dims:o,dataType:n}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:u})}),{inputs:[]})}}),ss=q(()=>{"use strict";nf(),ny(),nx(),nC(),a0=t=>tv({reduction:t.reduction}),a2=(t,i)=>{var r,a;let n,s,o,u,l,d;t.compute((r=t.inputs,a=i,n=r[0].dims,s=r[1].dims,o=Math.ceil(e3.sizeToDimension(s,s.length-1)/1),u=s[s.length-1],l=e3.sizeFromDimension(n,u),d=[{type:12,data:o},{type:12,data:u},{type:12,data:l},...tS(r[1].dims,r[2].dims,n)],{name:"ScatterND",shaderCache:{hint:`${a.cacheKey}_${a.reduction}`,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:n,dataType:r[0].dataType}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:d}),getShaderSource:t=>{let i=tR("indices",r[1].dataType,r[1].dims.length),s=tR("updates",r[2].dataType,r[2].dims.length,1),o="none"!==a.reduction&&""!==a.reduction?tN("output",r[0].dataType,n.length):tB("output",r[0].dataType,n.length,1);return`
      ${t.registerUniform("output_size","u32").registerUniform("last_index_dimension","u32").registerUniform("num_updates_elements","u32").declareVariables(i,s,o)}
      ${t.mainStart()}
        ${t.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
  var data_offset = 0u;
  let indices_start = uniforms.last_index_dimension * global_idx;
  let indices_end = indices_start + uniforms.last_index_dimension;
  for (var i = indices_start; i < indices_end; i++) {
    var index = i32(indices[i].x);
    ${1===r[0].dims.length?`
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
    ${((t,i,r,a)=>{if("none"!==t&&"i32"!==a&&"u32"!==a&&"f32"!==a)throw Error(`Input ${a} is not supported with reduction ${t}.`);let n=`{
                var oldValue = 0;
                loop {
                  let newValueF32 =`,s=`;
                  let newValue = bitcast<i32>(newValueF32);
                  let res = atomicCompareExchangeWeak(&${i}, oldValue, newValue);
                  if res.exchanged {
                    break;
                  }
                  oldValue = res.old_value;
                }
              }`;switch(t){case"none":return`${i}=${r};`;case"add":return"i32"===a||"u32"===a?`atomicAdd(&${i}, bitcast<${a}>(${r}));`:`
              ${n}bitcast<${a}>(oldValue) + (${r})${s}`;case"max":return"i32"===a||"u32"===a?`atomicMax(&${i}, bitcast<${a}>(${r}));`:`
                ${n}max(bitcast<f32>(oldValue), (${r}))${s}`;case"min":return"i32"===a||"u32"===a?`atomicMin(&${i}, bitcast<${a}>(${r}));`:`${n}min(bitcast<${a}>(oldValue), (${r}))${s}`;case"mul":return`${n}(bitcast<${a}>(oldValue) * (${r}))${s}`;default:throw Error(`Reduction ${t} is not supported.`)}})(a.reduction,"output[data_offset + i]","value",o.type.value)}
  }

      }`}}),{inputs:[t.inputs[1],t.inputs[2]],outputs:[]})}}),so=q(()=>{"use strict";nf(),ny(),nx(),nC(),a1=(t,i,r,a)=>`
  // The whole part and the fractional part are calculated separately due to inaccuracy of floating
  // point division. As an example, f32(21) / f32(7) may evaluate to 2.99... instead of 3, causing an
  // offset-by-one error later in floor().
  let big = (${t}) * (${i});
  let whole = ${a}(big / (${r}));
  let fract = ${a}(big % (${r})) / ${a}(${r});
  return whole + fract;
`,a3=(t,i,r,a)=>t.rank>a?`
    ${t.indicesSet("input_indices",i,"channel")};
    ${t.indicesSet("input_indices",r,"batch")};
`:"",a4=(t,i)=>{var r,a,n,s,o,u,l,d,p,c,h,f;let m,g,y,_,b,$,v,w,x,C,k,S,T,I,E,z,A=[],O=[],R=[],B=new Uint32Array(m=t.customDataBuffer,m.byteOffset,1)[0];if(0!==i.antialias)throw Error("Only default value (0) for Antialias attribute is supported");((t,i,r,a,n,s)=>{let[o,u,l]=r>10?[1,2,3]:[-1,t.length>1?1:-1,-1],d=t[0].dims.length;if(o>0&&t.length>o&&t[o].dims.length>0)t[o].getFloat32Array().forEach(t=>s.push(t));else if("tf_crop_and_resize"===i.coordinateTransformMode)throw Error("Resize requires RoI input to be specified when coordinateTransformMode is tfCropAndResize");if(u>0&&t.length>u&&1===t[u].dims.length&&t[u].dims[0]>0){var p,c,h;let n;if(t[u].getFloat32Array().forEach(t=>a.push(t)),0!==a.length&&a.length!==d&&r>=18&&a.length!==i.axes.length)throw Error("Resize requires scales input size to be same as input rank or axes size for opset 18 and up");((t,i)=>{if(t.every(t=>t>0||(()=>{throw Error("Resize requires scales input values to be positive")})),t.length>0){if("linear"===i.mode){if(2!==t.length&&3!==t.length&&(4!==t.length||1!==t[0]||1!==t[1])&&(4!==t.length||1!==t[0]||1!==t[3])&&(5!==t.length||1!==t[0]||1!==t[1]))throw Error(`For linear mode, Resize requires scales to be 2D, 3D, 4D with either two outermost or one innermost and
            one outermost scale values equal to 1, or 5D with two outermost scale values equal to 1`)}else if("cubic"===i.mode&&2!==t.length&&(4!==t.length||1!==t[0]||1!==t[1])&&(4!==t.length||1!==t[0]||1!==t[3]))throw Error("Resize requires scales input size to be 2 or 4 for cubic mode")}})(a,i),i.axes.length>0&&(p=a,c=i.axes,h=d,c.every(t=>t>=0&&t<h||(()=>{throw Error("Resize requires axes input values to be positive and less than rank")})),n=Array(h).fill(1),c.forEach((t,i)=>n[t]=p[i]),n).forEach((t,i)=>a[i]=t)}if(l>0&&t.length>l&&1===t[l].dims.length&&t[l].dims[0]>0&&(t[l].getBigInt64Array().forEach(t=>n.push(Number(t))),0!==n.length&&n.length!==d&&r>=18&&n.length!==i.axes.length))throw Error("Resize requires sizes input size to be same as input rank or axes size for opset 18 and up");if(i.axes.length>0){if(0!==a.length&&a.length!==i.axes.length)throw Error('Resize requires "scales" input size to be of axes rank when axes attributes is specified');if(0!==n.length&&n.length!==i.axes.length)throw Error('Resize requires "sizes" input size to be of rank axes rank when axes attributes is specified')}if("u">typeof a&&"u">typeof n&&a.length>0&&n.length>d)throw Error("Resize requires only of scales or sizes to be specified")})(t.inputs,i,B,A,O,R),t.compute((r=t.inputs[0],a=i,n=B,s=A,o=O,u=R,_=r.dims,b=(l=u,d=a.axes,g=Array(p=_.length).fill(0).concat(Array(p).fill(1)),y=0===l.length?g:l.slice(),d.length>0?(d.forEach((t,i)=>{g[t]=y[i],g[i+p]=y[d.length+i]}),g):y),$=((t,i,r,a)=>{let n=[];if(r.length>0)if(a.length>0){if(t.forEach(t=>n.push(t)),Math.max(...a)>t.length)throw Error("axes is out of bound");a.forEach((t,i)=>n[t]=r[i])}else r.forEach(t=>n.push(t));else{if(0===i.length)throw Error("Resize requires either scales or sizes.");n=t.map((t,r)=>Math.round(t*i[r]))}return n})(_,s,o,a.axes),v=s.slice(),0===s.length&&(v=_.map((t,i)=>0===t?1:$[i]/t),"stretch"!==a.keepAspectRatioPolicy&&(c=_,h=v,f=a,w=(()=>{switch(f.keepAspectRatioPolicy){case"not_larger":return f.axes.length>0?Math.min(...f.axes.map(t=>h[t]),Number.MAX_VALUE):Math.min(...h,Number.MAX_VALUE);case"not_smaller":return f.axes.length>0?Math.max(...f.axes.map(t=>h[t]),5e-324):Math.max(...h,5e-324);default:throw Error(`Keep aspect ratio policy ${f.keepAspectRatioPolicy} is not supported`)}})(),h.fill(1,0,h.length),x=c.slice(),f.axes.length>0?(f.axes.forEach(t=>h[t]=w),f.axes.forEach(t=>x[t]=Math.round(c[t]*h[t]))):(h.fill(w,0,h.length),x.forEach((t,i)=>x[i]=Math.round(t*h[i]))),$=x)),C=tB("output",r.dataType,$.length),k=tR("input",r.dataType,_.length),S=e3.size($),T=_.length===$.length&&_.every((t,i)=>t===$[i]),I="tf_crop_and_resize"===a.coordinateTransformMode,E=a.extrapolationValue,z=k.type.value,{name:"Resize",shaderCache:{hint:`${a.cacheKey}|${n}|${v.length>0?"cubic"===a.mode?v:v.length:""}|${o.length>0?o:""}|${b.length>0?b:""}|${T}|${"nearest"===a.mode?_.length:_}`,inputDependencies:["rank"]},getShaderSource:t=>{let i,r;return`
      ${T?"":`
      ${i=a.coordinateTransformMode,r=z,`fn getOriginalCoordinateFromResizedCoordinate(xResized: u32, xScale: f32, lengthResized: u32,
     lengthOriginal: u32, roiStart: f32, roiEnd: f32) -> ${r} { `+(()=>{switch(i){case"asymmetric":return`
          if (xScale < 1.0 || floor(xScale) != xScale) {
            return ${r}(xResized) / ${r}(xScale);
          } else {
            ${a1("xResized","lengthOriginal","lengthResized",r)}
          }
        `;case"pytorch_half_pixel":return`if (lengthResized > 1) {
                    return (${r}(xResized) + 0.5) / ${r}(xScale) - 0.5;
                  } else {
                    return 0.0;
                  }`;case"tf_half_pixel_for_nn":return`return (${r}(xResized) + 0.5) / ${r}(xScale);`;case"align_corners":return`if (lengthResized == 1) {
                    return 0.0;
                  } else {
                    ${a1("xResized","lengthOriginal - 1","lengthResized - 1",r)}
                  }`;case"tf_crop_and_resize":return`if (lengthResized > 1) {
                    return ${r}(roiStart) * ${r}(lengthOriginal - 1) +
                        (${r}(xResized) * ${r}(roiEnd - roiStart) * ${r}(lengthOriginal - 1)) /
                        ${r}(lengthResized - 1);
                  } else {
                    return 0.5 * ${r}(roiStart + roiEnd) * ${r}(lengthOriginal - 1);
                  }`;case"half_pixel_symmetric":return`const outputWidth = ${r}xScale * ${r}(lengthResized);
                  const adjustment = ${r}(lengthResized) / outputWidth;
                  const center = ${r}(lengthOriginal) / 2;
                  const offset = center * (1 - adjustment);
                  return offset + ((${r}(xResized) + 0.5) / ${r}(xScale)) - 0.5;`;case"half_pixel":return`return ((${r}(xResized) + 0.5) / ${r}(xScale)) - 0.5;`;default:throw Error(`Coordinate transform mode ${i} is not supported`)}})()+"}"};
      ${(()=>{switch(a.mode){case"nearest":let t,i,r,s,o,u,l,d,p,c,h,f;return`
              ${t=k,i=_,`
    fn checkInputIndices(input_indices: ${t.type.indices}) -> bool {
      for (var i:u32 = 0; i < ${i.length}; i++) {
        var input_index = ${t.indicesGet("input_indices","i")};
        if (input_index < 0 || input_index >= ${tA("uniforms.input_shape","i",i.length)}) {
          return false;
        }
      }
      return true;
    }`};
              ${r=a.nearestMode,s=n,o=z,`fn getNearestPixelFromOriginal(xOriginal: ${o}, isDownSample: bool) -> ${o} {`+(()=>{switch(r){case"round_prefer_ceil":return"if (fract(xOriginal) == 0.5) {             return ceil(xOriginal);           } else {             return round(xOriginal);           }";case"floor":return"return floor(xOriginal);";case"ceil":return"return ceil(xOriginal);";case"round_prefer_floor":return"if (fract(xOriginal) == 0.5) {                     return floor(xOriginal);                   } else {                     return round(xOriginal);                   }";default:if(s<11)return"if (isDownSample)                     {                       return ceil(xOriginal);                     } else {                       return xOriginal;                     }";throw Error(`Nearest mode ${r} is not supported`)}})()+"}"};
              ${u=k,l=C,d=_,p=$,c=v.length,h=b.length,f=I,`
    fn calculateInputIndicesFromOutputIndices(output_indices: ${l.type.indices}) -> ${u.type.indices} {
      var input_indices: ${u.type.indices};
      for (var i:u32 = 0; i < ${p.length}; i++) {
        var output_index = ${l.indicesGet("output_indices","i")};
        var input_index: u32;
        var scale = ${tA("uniforms.scales","i",c)};
        if (scale == 1.0) {
          input_index = output_index;
        } else {
          var roi_low = ${tA("uniforms.roi","i",h)};
          var roi_hi = ${tA("uniforms.roi",`i + ${d.length}`,h)};
          var input_shape_i = ${tA("uniforms.input_shape","i",d.length)};
          var output_shape_i = ${tA("uniforms.output_shape","i",p.length)};
          var original_idx = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                        input_shape_i, roi_low, roi_hi);
          if (!${f} || (original_idx >= 0 && original_idx < ${l.type.value}(input_shape_i))) {
            if (original_idx < 0) {
              input_index = 0;
            } else if (original_idx > ${l.type.value}(input_shape_i - 1)) {
              input_index = input_shape_i - 1;
            } else {
              input_index = u32(getNearestPixelFromOriginal(original_idx, scale < 1));
            }
          } else {
            input_index = u32(original_idx);
          }
        }
        ${u.indicesSet("input_indices","i","input_index")}
      }
      return input_indices;
    }`};
              `;case"linear":let m,g,y,w,x;return`
              ${m=C,g=_,y=$,w=v.length,x=b.length,`
    fn calculateOriginalIndicesFromOutputIndices(output_indices: ${m.type.indices}) -> array<${m.type.value}, ${y.length}> {
      var original_indices: array<${m.type.value}, ${y.length}>;
      for (var i:u32 = 0; i < ${y.length}; i++) {
        var output_index = ${m.indicesGet("output_indices","i")};
        var scale = ${tA("uniforms.scales","i",w)};
        var roi_low = ${tA("uniforms.roi","i",x)};
        var roi_hi = ${tA("uniforms.roi",`i + ${g.length}`,x)};
        if (scale == 1.0) {
          original_indices[i] = ${m.type.value}(output_index);
        } else {
          var input_shape_i = ${tA("uniforms.input_shape","i",g.length)};
          var output_shape_i = ${tA("uniforms.output_shape","i",y.length)};
          original_indices[i] = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                           input_shape_i, roi_low, roi_hi);
        }
      }
      return original_indices;
    }`};
              ${(()=>{if(2===_.length||4===_.length)return`${((t,i,r,a,n)=>{let[s,o,u,l]=2===r.length?[-1,0,1,-1]:[0,2,3,1],d=t.type.value;return`
    fn getInputValue(batch: u32, channel: u32, row: u32, col: u32) -> ${d} {
      var input_indices: ${t.type.indices};
      ${t.indicesSet("input_indices",o,`max(0, min(row, ${r[o]} - 1))`)};
      ${t.indicesSet("input_indices",u,`max(0, min(col, ${r[u]} - 1))`)};
      ${a3(t,l,s,2)}
      return ${t.getByIndices("input_indices")};
    }

    fn bilinearInterpolation(output_indices: ${i.type.indices}) -> ${d} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var row:${d} = originalIndices[${o}];
      var col:${d} = originalIndices[${u}];
      ${a?`if (row < 0 || row > (${r[o]} - 1) || col < 0 || col > (${r[u]} - 1)) {
        return ${n};
      }`:""};
      row = max(0, min(row, ${r[o]} - 1));
      col = max(0, min(col, ${r[u]} - 1));
      var row1: u32 = u32(row);
      var col1: u32 = u32(col);
      var row2: u32 = u32(row + 1);
      var col2: u32 = u32(col + 1);
      var channel: u32 = ${r.length>2?`u32(originalIndices[${l}])`:"0"};
      var batch: u32 =  ${r.length>2?`u32(originalIndices[${s}])`:"0"};
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
    }`})(k,C,_,I,E)}`;if(3===_.length||5===_.length)return`${((t,i,r,a,n)=>{let[s,o,u,l,d]=3===r.length?[-1,0,1,2,-1]:[0,2,3,4,1],p=t.type.value;return`
    fn getInputValue(batch: u32, channel: u32, depth:u32, height: u32, width: u32) -> ${p} {
      var input_indices: ${t.type.indices};
      ${t.indicesSet("input_indices",o,`max(0, min(depth, ${r[o]} - 1))`)};
      ${t.indicesSet("input_indices",u,`max(0, min(height, ${r[u]} - 1))`)};
      ${t.indicesSet("input_indices",l,`max(0, min(width, ${r[l]} - 1))`)};
      ${a3(t,d,s,3)}
      return ${t.getByIndices("input_indices")};
    }

    fn trilinearInterpolation(output_indices: ${i.type.indices}) -> ${p} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var depth:${p} = originalIndices[${o}];
      var height:${p} = originalIndices[${u}];
      var width:${p} = originalIndices[${l}];
      ${a?`if (depth < 0 || depth > (${r[o]} - 1) || height < 0 || height > (${r[u]} - 1) || width < 0 || (width > ${r[l]} - 1)) {
      return ${n};
        }`:""};

    depth = max(0, min(depth, ${r[o]} - 1));
      height = max(0, min(height, ${r[u]} - 1));
      width = max(0, min(width, ${r[l]} - 1));
      var depth1: u32 = u32(depth);
      var height1: u32 = u32(height);
      var width1: u32 = u32(width);
      var depth2: u32 = u32(depth + 1);
      var height2: u32 = u32(height + 1);
      var width2: u32 = u32(width + 1);
      var channel: u32 = ${r.length>3?`u32(originalIndices[${d}])`:"0"};
      var batch: u32 =  ${r.length>3?`u32(originalIndices[${s}])`:"0"};

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
    }`})(k,C,_,I,E)}`;throw Error("Linear mode only supports input dims 2, 3, 4 and 5 are supported in linear mode.")})()};
            `;case"cubic":return`
            ${(()=>{if(2===_.length||4===_.length)return`${((t,i,r,a,n,s,o,u,l,d)=>{let[p,c]=2===r.length?[0,1]:[2,3],h=t.type.value,f=o=>{let c=o===p?"row":"col";return`
      fn ${c}CubicInterpolation(input_indices: ${t.type.indices}, output_indices: ${i.type.indices}) -> ${h} {
        var output_index = ${i.indicesGet("output_indices",o)};
        var originalIdx: ${h} = getOriginalCoordinateFromResizedCoordinate(output_index, ${n[o]},
        ${a[o]}, ${r[o]}, ${s[o]}, ${s[o]} + ${r.length});
        var fractOriginalIdx: ${h} = originalIdx - floor(originalIdx);
        var coefs = getCubicInterpolationCoefs(fractOriginalIdx);

        if (${u} && (originalIdx < 0 || originalIdx > (${r[o]} - 1))) {
          return ${l};
        }
        var data: array<${h}, 4> = array<${h}, 4>(0.0, 0.0, 0.0, 0.0);
        for (var i: i32 = -1; i < 3; i++) {
          var ${c}: ${h} = originalIdx + ${h}(i);
          if (${c} < 0 || ${c} >= ${r[o]}) {
            ${d?`coefs[i + 1] = 0.0;
                        continue;`:u?`return ${l};`:`${c} = max(0, min(${c}, ${r[o]} - 1));`};
          }
        var input_indices_copy: ${t.type.indices} = input_indices;
          ${t.indicesSet("input_indices_copy",o,`u32(${c})`)};
          data[i + 1] = ${o===p?t.getByIndices("input_indices_copy"):"rowCubicInterpolation(input_indices_copy, output_indices)"};
        }
        return cubicInterpolation1D(data, coefs);
      }`};return`
    ${f(p)};
    ${f(c)};
  fn getCubicInterpolationCoefs(s: ${h}) -> array<${h}, 4> {
    var absS = abs(s);
    var coeffs: array<${h}, 4> = array<${h}, 4>(0.0, 0.0, 0.0, 0.0);
    var oneMinusAbsS: ${h} = 1.0 - absS;
    var twoMinusAbsS: ${h} = 2.0 - absS;
    var onePlusAbsS: ${h} = 1.0 + absS;
    coeffs[0] = ((${o} * onePlusAbsS - 5 * ${o}) * onePlusAbsS + 8 * ${o}) * onePlusAbsS - 4 * ${o};
    coeffs[1] = ((${o} + 2) * absS - (${o} + 3)) * absS * absS + 1;
    coeffs[2] = ((${o} + 2) * oneMinusAbsS - (${o} + 3)) * oneMinusAbsS * oneMinusAbsS + 1;
    coeffs[3] = ((${o} * twoMinusAbsS - 5 * ${o}) * twoMinusAbsS + 8 * ${o}) * twoMinusAbsS - 4 * ${o};
    return coeffs;
  }

  fn cubicInterpolation1D(x: array<${h}, 4>, coefs: array<${h}, 4>) -> ${h} {
    var coefsSum: ${h} = coefs[0] + coefs[1] + coefs[2] + coefs[3];
    return (x[0] * coefs[0] + x[1] * coefs[1]+ x[2] * coefs[2]+ x[3] * coefs[3]) / coefsSum;
  }

  fn bicubicInterpolation(output_indices: ${i.type.indices}) -> ${h} {
    var input_indices: ${t.type.indices} = output_indices;
    return colCubicInterpolation(input_indices, output_indices);
  }
    `})(k,C,_,$,v,b,a.cubicCoeffA,I,a.extrapolationValue,a.excludeOutside)}`;throw Error("Cubic mode only supports input dims 2 and 4 are supported in linear mode.")})()};
            `;default:throw Error("Invalid resize mode")}})()};
      `}
      ${t.registerUniform("output_size","u32").registerUniform("scales","f32",v.length).registerUniform("roi","f32",b.length).declareVariables(k,C)}
      ${t.mainStart()}
        ${t.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
        ${T?"output[global_idx] = input[global_idx];":`
        let output_indices = ${C.offsetToIndices("global_idx")};
        var input_indices: ${k.type.indices};
        ${(()=>{switch(a.mode){case"nearest":return`input_indices = calculateInputIndicesFromOutputIndices(output_indices);
                if (checkInputIndices(input_indices)) {
                  output[global_idx] = ${k.getByIndices("input_indices")};
                } else {
                  output[global_idx] = ${a.extrapolationValue};
                }`;case"linear":return`output[global_idx] = ${2===_.length||4===_.length?"bilinearInterpolation":"trilinearInterpolation"}(output_indices);`;case"cubic":return"output[global_idx] = bicubicInterpolation(output_indices);";default:throw Error(`Unsupported resize mode: ${a.mode}`)}})()};
`}
      }`},getRunData:()=>({outputs:[{dims:$,dataType:r.dataType}],dispatchGroup:{x:Math.ceil(S/64)},programUniforms:[{type:12,data:S},{type:1,data:v},{type:1,data:b},...tS(_,$)]})}),{inputs:[0]})},a6=t=>{let i=t.antialias,r=t.axes,a=t.coordinateTransformMode,n=t.cubicCoeffA,s=0!==t.excludeOutside,o=t.extrapolationValue,u=t.keepAspectRatioPolicy,l=t.mode,d=""===t.nearestMode?"simple":t.nearestMode;return tv({antialias:i,axes:r,coordinateTransformMode:a,cubicCoeffA:n,excludeOutside:s,extrapolationValue:o,keepAspectRatioPolicy:u,mode:l,nearestMode:d})}}),su=q(()=>{"use strict";nf(),ny(),nC(),a8=(t,i)=>{var r,a,n,s;let o,u,l,d,p,c,h,f,m,g,y,_,b;(t=>{if(!t||t.length<3)throw Error("layerNorm requires at least 3 inputs.");let i=t[0],r=t[1],a=t[2];if(i.dataType!==r.dataType||i.dataType!==a.dataType)throw Error("All inputs must have the same data type");if(3!==i.dims.length&&2!==i.dims.length)throw Error("Input must be 2D or 3D");if(3!==r.dims.length&&2!==r.dims.length)throw Error("Skip must be 2D or 3D");let n=i.dims[i.dims.length-1],s=i.dims[i.dims.length-2];if(r.dims[r.dims.length-1]!==n)throw Error("Skip must have the same hidden size as input");if(r.dims[r.dims.length-2]!==s)throw Error("Skip must have the same sequence length as input");if(1!==a.dims.length)throw Error("Gamma must be 1D");if(a.dims[a.dims.length-1]!==n)throw Error("Gamma must have the same hidden size as input");if(t.length>3){let i=t[3];if(1!==i.dims.length)throw Error("Beta must be 1D");if(i.dims[i.dims.length-1]!==n)throw Error("Beta must have the same hidden size as input")}if(t.length>4){let i=t[4];if(1!==i.dims.length)throw Error("Bias must be 1D");if(i.dims[i.dims.length-1]!==n)throw Error("Bias must have the same hidden size as input")}})(t.inputs);let $=[0];t.outputCount>1&&$.push(-3),t.outputCount>2&&$.push(-3),t.outputCount>3&&$.push(3),t.compute((r=t.inputs,a=i,n=t.outputCount,s=!1,o=a.simplified,u=r[0].dims,l=e3.size(u),d=u.slice(-1)[0],p=s?u.slice(0,-1).concat(1):[],c=!o&&r.length>3,h=r.length>4,f=s&&n>1,m=s&&n>2,g=n>3,_=[{type:12,data:l},{type:12,data:y=tT(d)},{type:12,data:d},{type:1,data:a.epsilon}],b=[{dims:u,dataType:r[0].dataType}],n>1&&b.push({dims:p,dataType:1}),n>2&&b.push({dims:p,dataType:1}),n>3&&b.push({dims:u,dataType:r[0].dataType}),{name:"SkipLayerNormalization",shaderCache:{hint:`${y};${f};${m};${g}`,inputDependencies:r.map((t,i)=>"type")},getShaderSource:t=>{let i=[tR("x",r[0].dataType,r[0].dims,y),tR("skip",r[1].dataType,r[1].dims,y),tR("gamma",r[2].dataType,r[2].dims,y)];c&&i.push(tR("beta",r[3].dataType,r[3].dims,y)),h&&i.push(tR("bias",r[4].dataType,r[4].dims,y)),i.push(tB("output",r[0].dataType,u,y)),f&&i.push(tB("mean_output",1,p)),m&&i.push(tB("inv_std_output",1,p)),g&&i.push(tB("input_skip_bias_sum",r[0].dataType,u,y));let a=tC(r[0].dataType),n=tC(1,y);return`

      ${t.registerUniforms([{name:"output_size",type:"u32"},{name:"components",type:"u32"},{name:"hidden_size",type:"u32"},{name:"epsilon",type:"f32"}]).declareVariables(...i)}
      var<workgroup> sum_shared : array<${n}, 64>;
      var<workgroup> sum_squared_shared : array<${n}, 64>;

      ${t.mainStart([64,1,1])}
        let ix = local_id.x;
        let iy = global_id.x / 64;

        let hidden_size_vectorized: u32 = uniforms.hidden_size / uniforms.components;
        var stride = hidden_size_vectorized / 64;
        let offset = ix * stride + iy * hidden_size_vectorized;
        let offset1d = stride * ix;
        if (ix == 63) {
          stride = hidden_size_vectorized - stride * ix;
        }
        for (var i: u32 = 0; i < stride; i++) {
          let skip_value = skip[offset + i];
          let bias_value = ${h?"bias[offset1d + i]":a+"(0.0)"};
          let input_value = x[offset + i];
          let value = input_value + skip_value + bias_value;
          ${g?"input_skip_bias_sum[offset + i] = value;":""}
          output[offset + i] = value;
          let f32_value = ${tE(a,y,"value")};
          sum_shared[ix] += f32_value;
          sum_squared_shared[ix] += f32_value * f32_value;
        }
        workgroupBarrier();

        var reduce_size : u32 = 64;
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
        let mean = ${tz("sum",y)} / f32(uniforms.hidden_size);
        let inv_std_dev = inverseSqrt(${tz("square_sum",y)} / f32(uniforms.hidden_size) ${o?"":"- mean * mean"} + uniforms.epsilon);
        ${f?"mean_output[global_idx] = mean;":""}
        ${m?"inv_std_output[global_idx] = inv_std_dev;":""}

        for (var i: u32 = 0; i < stride; i++) {
          output[offset + i] = (output[offset + i] ${o?"":`- ${a}(mean)`}) *
            ${a}(inv_std_dev) * gamma[offset1d + i]
            ${c?"+ beta[offset1d + i]":""};
        }
      }`},getRunData:()=>({outputs:b,dispatchGroup:{x:Math.ceil(l/d)},programUniforms:_})}),{outputs:$})}}),sl=q(()=>{"use strict";nf(),ny(),nx(),nC(),a5=(t,i)=>{let r=[];if(t.length>i)if(7===t[i].dataType)t[i].getBigInt64Array().forEach(t=>r.push(Number(t)));else if(6===t[i].dataType)t[i].getInt32Array().forEach(t=>r.push(Number(t)));else throw Error(`Input ${i} must be an array of int32 or int64`);return r},a9=(t,i,r,a,n)=>{let s=t;return t<0&&(s+=r[a[i]]),n[i]<0?Math.max(0,Math.min(s,r[a[i]]-1)):Math.max(0,Math.min(s,r[a[i]]))},a7=(t,i)=>{var r=t.inputs,a=i;if(!r||r.length<1)throw Error("too few inputs");if(0!==a.axes.length){if(a.axes.length!==a.starts.length||a.axes.length!==a.ends.length)throw Error("axes, starts and ends must have the same length")}else if(a.starts.length!==a.ends.length)throw Error("starts and ends must have the same length");r.slice(1).forEach((t,i)=>{if(6!==r[i+1].dataType&&7!==r[i+1].dataType)throw Error(`Input ${i} must be an array of int32 or int64`)});let n=((t,i)=>{if(!(t.length>1))return i;{let i=a5(t,1),r=a5(t,2),a=a5(t,3);return 0===a.length&&(a=[...Array(t[0].dims.length).keys()]),tv({starts:i,ends:r,axes:a})}})(t.inputs,i);t.compute(((t,i)=>{let r=t[0].dims,a=e3.size(r),n=i.axes.length>0?e3.normalizeAxes(i.axes,r.length):[...Array(r.length).keys()],s=a5(t,4);s.forEach(t=>0!==t||(()=>{throw Error("step cannot be 0")})),0===s.length&&(s=Array(n.length).fill(1));let o=i.starts.map((t,i)=>a9(t,i,r,n,s)),u=i.ends.map((t,i)=>a9(t,i,r,n,s));if(n.length!==o.length||n.length!==u.length)throw Error("start, ends and axes should have the same number of elements");if(n.length!==r.length)for(let t=0;t<r.length;++t)n.includes(t)||(o.splice(t,0,0),u.splice(t,0,r[t]),s.splice(t,0,1));let l=s.map(t=>Math.sign(t));s.forEach((t,i,r)=>{if(t<0){let a=(u[i]-o[i])/t,n=o[i],l=n+a*s[i];o[i]=l,u[i]=n,r[i]=-t}});let d=r.slice(0);n.forEach((t,i)=>{d[t]=Math.ceil((u[t]-o[t])/s[t])});let p={dims:d,dataType:t[0].dataType},c=tB("output",t[0].dataType,d.length),h=tR("input",t[0].dataType,t[0].dims.length),f=e3.size(d),m=[{name:"outputSize",type:"u32"},{name:"starts",type:"u32",length:o.length},{name:"signs",type:"i32",length:l.length},{name:"steps",type:"u32",length:s.length}],g=[{type:12,data:f},{type:12,data:o},{type:6,data:l},{type:12,data:s},...tS(t[0].dims,d)];return{name:"Slice",shaderCache:{hint:`${l.length}_${o.length}_${s.length}`,inputDependencies:["rank"]},getShaderSource:t=>{let i,a,n;return`
      ${t.registerUniforms(m).declareVariables(h,c)}
        ${i=h,a=c,n=r,`fn calculateInputIndices(output_indices: ${a.type.indices}) -> ${i.type.indices} {
          var input_indices: ${i.type.indices};
          var carry = 0u;
          for (var i = ${n.length-1}; i >= 0; i--) {
            let input_shape_i = ${tA("uniforms.input_shape","i",n.length)};
            let steps_i = ${tA("uniforms.steps","i",n.length)};
            let signs_i = ${tA("uniforms.signs","i",n.length)};
            let starts_i = ${tA("uniforms.starts","i",n.length)};
            var output_index = ${a.indicesGet("output_indices","i")};
            var input_index = output_index * steps_i + starts_i + carry;
            carry = input_index / input_shape_i;
            input_index = input_index % input_shape_i;
            if (signs_i < 0) {
              input_index = input_shape_i - input_index - 1u + starts_i;
            }
            ${i.indicesSet("input_indices","i","input_index")};
          }
          return input_indices;
      }`}
        ${t.mainStart()}
          ${t.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
          let output_indices = ${c.offsetToIndices("global_idx")};
          let input_indices = calculateInputIndices(output_indices);
          ${c.setByOffset("global_idx",h.getByIndices("input_indices"))}
      }`},getRunData:()=>({outputs:[p],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:g})}})(t.inputs,n),{inputs:[0]})},ne=t=>{let i=t.starts,r=t.ends,a=t.axes;return tv({starts:i,ends:r,axes:a})}}),sd=q(()=>{"use strict";nf(),ny(),nx(),nk(),nC(),nt=(t,i)=>{var r,a;let n,s,o,u,l,d,p,c,h,f,m,g,y,_,b,$,v,w,x;(t=>{if(!t||1!==t.length)throw Error("Softmax op requires 1 input.")})(t.inputs),r=t,a=i,s=(n=r.inputs[0]).dims,o=e3.size(s),u=s.length,d=(l=e3.normalizeAxis(a.axis,u))<s.length-1,c=[],d?((c=Array.from({length:u},(t,i)=>i))[l]=u-1,c[u-1]=l,p=r.compute(tq(n,c),{inputs:[n],outputs:[-1]})[0]):p=n,m=o/(f=(h=p.dims)[u-1]),g=tT(f),y=f/g,_=64,1===m&&(_=256),b=tR("x",p.dataType,p.dims,g),$=tB("result",p.dataType,p.dims,g),v=b.type.value,w="f32"===tC(p.dataType)?`var threadMax = ${v}(-3.402823e+38f);`:`var threadMax = ${v}(-65504.0h);`,x=r.compute({name:"Softmax",shaderCache:{hint:`${g};${_}`,inputDependencies:["type"]},getRunData:()=>({outputs:[{dims:h,dataType:p.dataType}],dispatchGroup:{x:m},programUniforms:[{type:6,data:y}]}),getShaderSource:t=>{let i;return`
      var<workgroup> rowMaxShared : ${v};
      var<workgroup> rowSumShared : ${v};
      var<workgroup> threadShared : array<${v}, ${_}>;

      fn getValue(row: i32, col: i32, row_stride: i32) -> ${v} {
        let index = row * row_stride + col;
        return x[index];
      }

      fn setValue(row: i32, col: i32, row_stride: i32, value: ${v}) {
        let index = row * row_stride + col;
        result[index] = value;
      }
      ${t.registerUniform("packedCols","i32").declareVariables(b,$)}
      ${t.mainStart(_)}
        let gindex = i32(global_idx);
        let lindex = i32(local_idx);
        const wg = ${_};
        let row = gindex / wg;
        let cols = uniforms.packedCols;
        let row_stride : i32 = uniforms.packedCols;

        // find the rows max
        ${w}
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
          rowMaxShared = ${v}(${i="threadShared[0]",4===g?`max(max(${i}.x, ${i}.y), max(${i}.z, ${i}.w))`:2===g?`max(${i}.x, ${i}.y)`:3===g?`max(max(${i}.x, ${i}.y), ${i}.z)`:i});
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
          rowSumShared = ${v}(${tz("threadShared[0]",g)});
        }
        workgroupBarrier();

        // calculate final value for each element in the row
        for (var col = lindex; col < cols; col += wg) {
          var value = exp(getValue(row, col, row_stride) - rowMaxShared) / rowSumShared;
          // max operation protects against NaN since all values should be >=0
          value = max(value, ${v}(0.0));
          setValue(row, col, row_stride, value);
        }
      }`}},{inputs:[p],outputs:[d?-1:0]})[0],d&&r.compute(tq(x,c),{inputs:[x]})},ni=t=>tv({axis:t.axis})}),sp=q(()=>{"use strict";nf(),ny(),nC(),nr=t=>Array.from(t.getBigInt64Array(),Number),na=t=>{var i,r;let a,n,s,o,u,l,d;(t=>{if(!t||2!==t.length)throw Error("Tile requires 2 inputs.");if(1!==t[0].dataType&&10!==t[0].dataType&&6!==t[0].dataType&&12!==t[0].dataType)throw Error("Tile only support float, float16, int32, and uint32 data types");if(7!==t[1].dataType)throw Error("Tile `repeats` input should be of int64 data type");if(1!==t[1].dims.length)throw Error("Tile `repeats` input should be 1-D");if(nr(t[1]).length!==t[0].dims.length)throw Error("Tile `repeats` input should have same number of elements as rank of input data tensor")})(t.inputs),t.compute((a=(i=t.inputs)[0].dims,s=((t,i)=>{let r=[];for(let a=0;a<t.length;++a)r.push(t[a]*i[a]);return r})(a,n=r??nr(i[1])),o=e3.size(s),u=i[0].dataType,l=tR("input",u,a.length),d=tB("output",u,s.length),{name:"Tile",shaderCache:{hint:`${n}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:s,dataType:i[0].dataType}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:[{type:12,data:o},...tS(i[0].dims,s)]}),getShaderSource:t=>`
      const inputShape = ${l.indices(...a)};
      ${t.registerUniform("output_size","u32").declareVariables(l,d)}
      ${t.mainStart()}
      ${t.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let output_indices = ${d.offsetToIndices("global_idx")};
      var input_indices: ${l.type.indices};
      for (var i = 0; i < ${a.length}; i++) {
        let input_dim_i = ${l.indicesGet("uniforms.input_shape","i")};
        let input_dim_value = ${d.indicesGet("output_indices","i")}  % input_dim_i;

        ${l.indicesSet("input_indices","i","input_dim_value")}
      }
      ${d.setByOffset("global_idx",l.getByIndices("input_indices"))}
    }`}),{inputs:[0]})}}),sc=q(()=>{"use strict";nf(),ny(),nC(),nn=t=>{t.compute((t=>{let i=t[1].dims,r=t[2].dims,a=t[0].dims,n=t[1].dataType,s=!(e3.areEqual(i,r)&&e3.areEqual(r,a)),o=i,u=e3.size(i);if(s){let t=e1.calcShape(e1.calcShape(i,r,!1),a,!1);if(!t)throw Error("Can't perform where op on the given tensors");o=t,u=e3.size(o)}let l=Math.ceil(u/4);return{name:"Where",shaderCache:{inputDependencies:["rank","rank","rank"]},getShaderSource:i=>((t,i,r,a,n)=>{let s=tB("output_data",n,r.length,4),o=tR("a_data",i[1].dataType,i[1].dims.length,4),u=tR("b_data",i[2].dataType,i[2].dims.length,4),l=tR("c_data",i[0].dataType,i[0].dims.length,4),d,p=(t,i,r)=>`select(${i}, ${t}, ${r})`;if(a){let t=(t,i,r="")=>{let a=`a_data[index_a${i}][component_a${i}]`,n=`b_data[index_b${i}][component_b${i}]`,d=`bool(c_data[index_c${i}] & (0xffu << (component_c${i} * 8)))`;return`
            let output_indices${i} = ${s.offsetToIndices(`global_idx * 4u + ${i}u`)};
            let offset_a${i} = ${o.broadcastedIndicesToOffset(`output_indices${i}`,s)};
            let offset_b${i} = ${u.broadcastedIndicesToOffset(`output_indices${i}`,s)};
            let offset_c${i} = ${l.broadcastedIndicesToOffset(`output_indices${i}`,s)};
            let index_a${i} = offset_a${i} / 4u;
            let index_b${i} = offset_b${i} / 4u;
            let index_c${i} = offset_c${i} / 4u;
            let component_a${i} = offset_a${i} % 4u;
            let component_b${i} = offset_b${i} % 4u;
            let component_c${i} = offset_c${i} % 4u;
            ${t}[${i}] = ${r}(${p(a,n,d)});
          `};d=9===n?`
            var data = vec4<u32>(0);
            ${t("data",0,"u32")}
            ${t("data",1,"u32")}
            ${t("data",2,"u32")}
            ${t("data",3,"u32")}
            output_data[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:`
            ${t("output_data[global_idx]",0)}
            ${t("output_data[global_idx]",1)}
            ${t("output_data[global_idx]",2)}
            ${t("output_data[global_idx]",3)}
          `}else d=s.setByOffset("global_idx",p(o.getByOffset("global_idx"),u.getByOffset("global_idx"),l.getByOffset("global_idx")));return`
        ${t.registerUniform("vec_size","u32").declareVariables(l,o,u,s)}
        ${t.mainStart()}
        ${t.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${d}
      }`})(i,t,o,s,n),getRunData:()=>({outputs:[{dims:o,dataType:n}],dispatchGroup:{x:Math.ceil(u/64/4)},programUniforms:[{type:12,data:l},...tS(a,i,r,o)]})}})(t.inputs))}}),sh=q(()=>{"use strict";nI(),nE(),nz(),nA(),nR(),nB(),nN(),nG(),nH(),nF(),nK(),nZ(),nQ(),nX(),nY(),nJ(),n0(),n2(),n1(),n3(),n5(),n9(),n7(),se(),st(),n4(),si(),sr(),sa(),sn(),ss(),nT(),so(),n8(),su(),sl(),sd(),n6(),sp(),nk(),nO(),sc(),ns=new Map([["Abs",[iw]],["Acos",[ix]],["Acosh",[iC]],["Add",[rt]],["ArgMax",[ih,im]],["ArgMin",[ic,im]],["Asin",[ik]],["Asinh",[iS]],["Atan",[iT]],["Atanh",[iI]],["Attention",[i_]],["AveragePool",[aL,aW]],["BatchNormalization",[ib]],["BiasAdd",[i$]],["BiasSplitGelu",[i7]],["Cast",[iz,iE]],["Ceil",[iO]],["Clip",[iA]],["Concat",[rp,rc]],["Conv",[rP,rM]],["ConvTranspose",[rj,rV]],["Cos",[iR]],["Cosh",[iB]],["CumSum",[rH,rF]],["DepthToSpace",[rK,rZ]],["DequantizeLinear",[aX,aY]],["Div",[ri]],["Einsum",[r1,r3]],["Elu",[iM,iN]],["Equal",[rr]],["Erf",[iP]],["Exp",[iU]],["Expand",[r6]],["FastGelu",[r8]],["Floor",[iq]],["FusedConv",[rP,rM]],["Gather",[r9,r5]],["GatherElements",[aa,ar]],["GatherBlockQuantized",[at,ai]],["GatherND",[r7,ae]],["Gelu",[iW]],["Gemm",[as,an]],["GlobalAveragePool",[aj,aG]],["GlobalMaxPool",[aQ,aZ]],["Greater",[ro]],["GreaterOrEqual",[rl]],["GridSample",[ac,ah]],["GroupQueryAttention",[aS]],["HardSigmoid",[iZ,iK]],["InstanceNormalization",[aI]],["LayerNormalization",[aE]],["LeakyRelu",[iL,iN]],["Less",[ru]],["LessOrEqual",[rd]],["Log",[i8]],["MatMul",[az]],["MatMulNBits",[aA,aO]],["MaxPool",[aF,aK]],["Mul",[ra]],["MultiHeadAttention",[a_,am]],["Neg",[iG]],["Not",[iV]],["Pad",[aR]],["Pow",[rn]],["QuickGelu",[i9,iN]],["Range",[aJ]],["Reciprocal",[ij]],["ReduceMin",[is]],["ReduceMean",[ie]],["ReduceMax",[ia]],["ReduceSum",[iu]],["ReduceProd",[io]],["ReduceL1",[it]],["ReduceL2",[ii]],["ReduceLogSum",[id]],["ReduceLogSumExp",[ir]],["ReduceSumSquare",[il]],["Relu",[iH]],["Resize",[a4,a6]],["RotaryEmbedding",[ax]],["ScatterND",[a2,a0]],["Sigmoid",[iF]],["Sin",[iQ]],["Sinh",[iX]],["Slice",[a7,ne]],["SkipLayerNormalization",[a8]],["Split",[a$,av]],["Sqrt",[iY]],["Softmax",[nt,ni]],["Sub",[rs]],["Tan",[iJ]],["Tanh",[i2]],["ThresholdedRelu",[i6,iN]],["Tile",[na]],["Transpose",[tW,tL]],["Where",[nn]]])}),sf=q(()=>{"use strict";eu(),ng(),nC(),no=class{constructor(t){this.backend=t,this.repo=new Map,this.attributesBound=!1}getArtifact(t){return this.repo.get(t)}setArtifact(t,i){this.repo.set(t,i)}run(t,i,r,a,n){R(t.programInfo.name);let s=this.backend.device,o=this.backend.getComputePassEncoder();this.backend.writeTimestamp(2*this.backend.pendingDispatchNumber);let u=[];for(let t of i)u.push({binding:u.length,resource:{buffer:t.buffer}});for(let t of r)u.push({binding:u.length,resource:{buffer:t.buffer}});n&&u.push({binding:u.length,resource:n});let l=s.createBindGroup({layout:t.computePipeline.getBindGroupLayout(0),entries:u,label:t.programInfo.name});if("capturing"===this.backend.sessionStatus){let i={kernelId:this.backend.currentKernelId,computePipeline:t.computePipeline,bindGroup:l,dispatchGroup:a};this.backend.capturedCommandList.get(this.backend.currentSessionId).push(i)}o.setPipeline(t.computePipeline),o.setBindGroup(0,l),o.dispatchWorkgroups(...a),this.backend.writeTimestamp(2*this.backend.pendingDispatchNumber+1),this.backend.pendingDispatchNumber++,(this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber||"at-passes"===this.backend.queryType)&&this.backend.endComputePass(),this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber&&this.backend.flush(),B(t.programInfo.name)}dispose(){}build(t,i){R(t.name);let r=this.backend.device,a=[];[{feature:"shader-f16",extension:"f16"},{feature:"subgroups",extension:"subgroups"}].forEach(t=>{r.features.has(t.feature)&&a.push(`enable ${t.extension};`)});let n=tP(i,this.backend.device.limits),s=t.getShaderSource(n),o=`${a.join(`
`)}
${n.additionalImplementations}
${s}`,u=r.createShaderModule({code:o,label:t.name});e0("verbose",()=>`[WebGPU] ${t.name} shader code: ${o}`);let l=r.createComputePipeline({compute:{module:u,entryPoint:"main"},layout:"auto",label:t.name});return B(t.name),{programInfo:t,computePipeline:l,uniformVariablesInfo:n.variablesInfo}}normalizeDispatchGroupSize(t){let i="number"==typeof t?t:t.x,r="number"==typeof t?1:t.y||1,a="number"==typeof t?1:t.z||1,n=this.backend.device.limits.maxComputeWorkgroupsPerDimension;if(i<=n&&r<=n&&a<=n)return[i,r,a];let s=i*r*a,o=Math.ceil(Math.sqrt(s));if(!(o>n))return[o,o,1];if((o=Math.ceil(Math.cbrt(s)))>n)throw Error("Total dispatch size exceeds WebGPU maximum.");return[o,o,o]}}}),sm={};W(sm,{WebGpuBackend:()=>sy});var sg,sy,s_=q(()=>{"use strict";eu(),nf(),ng(),n_(),nw(),sh(),sf(),sg=class{constructor(t){t&&(this.architecture=t.architecture,this.vendor=t.vendor)}isArchitecture(t){return this.architecture===t}isVendor(t){return this.vendor===t}},sy=class{constructor(){this.currentSessionId=null,this.currentKernelId=null,this.commandEncoder=null,this.computePassEncoder=null,this.maxDispatchNumber=16,this.pendingDispatchNumber=0,this.pendingKernels=[],this.pendingQueries=new Map,this.sessionStatus="default",this.capturedCommandList=new Map,this.capturedPendingKernels=new Map,this.sessionExternalDataMapping=new Map}get currentKernelCustomData(){if(null===this.currentKernelId)throw Error("currentKernelCustomData(): currentKernelId is null. (should not happen)");let t=this.kernelCustomData.get(this.currentKernelId);return t||(t={},this.kernelCustomData.set(this.currentKernelId,t)),t}async initialize(t,i){this.env=t;let r=[],a={requiredLimits:{maxComputeWorkgroupStorageSize:i.limits.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:i.limits.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:i.limits.maxStorageBufferBindingSize,maxBufferSize:i.limits.maxBufferSize,maxComputeInvocationsPerWorkgroup:i.limits.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupSizeX:i.limits.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:i.limits.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:i.limits.maxComputeWorkgroupSizeZ},requiredFeatures:r},n=t=>i.features.has(t)&&r.push(t)&&!0;n("chromium-experimental-timestamp-query-inside-passes")||n("timestamp-query"),n("shader-f16"),n("subgroups"),this.device=await i.requestDevice(a),this.adapterInfo=new sg(i.info||await i.requestAdapterInfo()),this.gpuDataManager=tb(this),this.programManager=new no(this),this.kernels=new Map,this.kernelPersistentData=new Map,this.kernelCustomData=new Map,eJ(t.logLevel,!!t.debug),this.device.onuncapturederror=t=>{t.error instanceof GPUValidationError&&console.error(`An uncaught WebGPU validation error was raised: ${t.error.message}`)},Object.defineProperty(this.env.webgpu,"device",{value:this.device,writable:!1,enumerable:!0,configurable:!1}),Object.defineProperty(this.env.webgpu,"adapter",{value:i,writable:!1,enumerable:!0,configurable:!1}),this.setQueryType()}dispose(){"u">typeof this.querySet&&this.querySet.destroy(),this.gpuDataManager.dispose()}getCommandEncoder(){return this.commandEncoder||(this.commandEncoder=this.device.createCommandEncoder()),this.commandEncoder}getComputePassEncoder(){if(!this.computePassEncoder){let t=this.getCommandEncoder(),i={};"at-passes"===this.queryType&&(i.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:2*this.pendingDispatchNumber,endOfPassWriteIndex:2*this.pendingDispatchNumber+1}),this.computePassEncoder=t.beginComputePass(i)}return this.computePassEncoder}endComputePass(){this.computePassEncoder&&(this.computePassEncoder.end(),this.computePassEncoder=null)}flush(){let t;this.commandEncoder&&(R(),this.endComputePass(),"none"!==this.queryType&&(this.commandEncoder.resolveQuerySet(this.querySet,0,2*this.pendingDispatchNumber,this.queryResolveBuffer,0),t=this.device.createBuffer({size:2*this.pendingDispatchNumber*8,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.pendingQueries.set(t,this.pendingKernels),this.pendingKernels=[],this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer,0,t,0,2*this.pendingDispatchNumber*8)),this.device.queue.submit([this.commandEncoder.finish()]),this.gpuDataManager.refreshPendingBuffers(),this.commandEncoder=null,this.pendingDispatchNumber=0,"none"!==this.queryType&&t.mapAsync(GPUMapMode.READ).then(()=>{let i=new BigUint64Array(t.getMappedRange()),r=this.pendingQueries.get(t);for(let t=0;t<i.length/2;t++){let a=r[t],n=a.kernelId,s=this.kernels.get(n),o=s.kernelType,u=s.kernelName,l=a.programName,d=a.inputTensorViews,p=a.outputTensorViews,c=i[2*t],h=i[2*t+1];typeof this.queryTimeBase>"u"&&(this.queryTimeBase=c);let f=Number(c-this.queryTimeBase),m=Number(h-this.queryTimeBase);if(!Number.isSafeInteger(f)||!Number.isSafeInteger(m))throw RangeError("incorrect timestamp range");if(this.env.webgpu.profiling?.ondata)this.env.webgpu.profiling.ondata({version:1,inputsMetadata:d.map(t=>({dims:t.dims,dataType:eL(t.dataType)})),outputsMetadata:p.map(t=>({dims:t.dims,dataType:eL(t.dataType)})),kernelId:n,kernelType:o,kernelName:u,programName:l,startTime:f,endTime:m});else{let t="";d.forEach((i,r)=>{t+=`input[${r}]: [${i.dims}] | ${eL(i.dataType)}, `});let i="";p.forEach((t,r)=>{i+=`output[${r}]: [${t.dims}] | ${eL(t.dataType)}, `}),console.log(`[profiling] kernel "${n}|${o}|${u}|${l}" ${t}${i}start time: ${f} ns, execution time: ${m-f} ns`)}A("GPU",`${l}::${c}::${h}`)}t.unmap(),this.pendingQueries.delete(t)}),B())}run(t,i,r,a,n,s){var o,u,l;let d,p;R(t.name);let c=[];for(let t=0;t<i.length;++t){let r=i[t].data;if(0===r)continue;let a=this.gpuDataManager.get(r);if(!a)throw Error(`no GPU data for input: ${r}`);c.push(a)}let{outputs:h,dispatchGroup:f,programUniforms:m}=t.getRunData(i),g=0===r.length?h.map((t,i)=>i):r;if(g.length!==h.length)throw Error(`Output size ${g.length} must be equal to ${h.length}.`);let y=[],_=[];for(let t=0;t<h.length;++t){if(!Number.isInteger(g[t])||g[t]<-3||g[t]>=s)throw Error(`Invalid output index: ${g[t]}`);if(-3===g[t])continue;let i=-1===g[t],r=-2===g[t],o=i||r?n(h[t].dataType,h[t].dims):a(g[t],h[t].dataType,h[t].dims);if(y.push(o),0===o.data)continue;let u=this.gpuDataManager.get(o.data);if(!u)throw Error(`no GPU data for output: ${o.data}`);if(i&&this.temporaryData.push(u),r){let t=this.kernelPersistentData.get(this.currentKernelId);t||(t=[],this.kernelPersistentData.set(this.currentKernelId,t)),t.push(u)}_.push(u)}if(c.length!==i.length||_.length!==y.length){if(0===_.length)return B(t.name),y;throw Error(`Program ${t.name} has zero-sized tensor(s) in inputs or outputs. This is not supported now.`)}if(m){let t=0,i=[];m.forEach(r=>{let a="number"==typeof r.data?[r.data]:r.data;if(0===a.length)return;let n=10===r.type?2:4,s,o;10===r.type?(o=a.length>4?16:a.length>2?8:a.length*n,s=a.length>4?16:n*a.length):(o=a.length<=2?a.length*n:16,s=16),t=Math.ceil(t/o)*o,i.push(t);let u=10===r.type?8:4;t+=a.length>4?Math.ceil(a.length/u)*s:a.length*n});let r=new ArrayBuffer(t=16*Math.ceil(t/16));m.forEach((t,a)=>{let n=i[a],s="number"==typeof t.data?[t.data]:t.data;if(6===t.type)new Int32Array(r,n,s.length).set(s);else if(12===t.type)new Uint32Array(r,n,s.length).set(s);else if(10===t.type)new Uint16Array(r,n,s.length).set(s);else if(1===t.type)new Float32Array(r,n,s.length).set(s);else throw Error(`Unsupported uniform type: ${eL(t.type)}`)});let a=this.gpuDataManager.create(t,GPUBufferUsage.COPY_DST|GPUBufferUsage.UNIFORM);this.device.queue.writeBuffer(a.buffer,0,r,0,t),this.gpuDataManager.release(a.id),d={offset:0,size:t,buffer:a.buffer}}let b=this.programManager.normalizeDispatchGroupSize(f),$=(o=t,u=i,l=1===b[1]&&1===b[2],p=o.name,o.shaderCache?.hint&&(p+="["+o.shaderCache.hint+"]"),p+=":"+l+`:${((t,i)=>{if(i.length!==t.length)throw Error(`inputDependencies length ${i.length} is not equal to inputTensors length ${t.length}.`);let r=[];for(let a=0;a<t.length;++a){let n=t[a].dataType;switch(i[a]){case"none":r.push("");break;case"type":r.push(`${n}`);break;case"rank":{let i=t[a].dims.length;r.push(`${n};${i}`);break}case"dims":{let i=t[a].dims.join(",");r.push(`${n};${i}`);break}default:throw Error(`unsupported input dependency: ${i[a]}`)}}return r.join("|")})(u,o.shaderCache?.inputDependencies??Array(u.length).fill("dims"))}`),v=this.programManager.getArtifact($);if(v||(v=this.programManager.build(t,b),this.programManager.setArtifact($,v),e0("info",()=>`[artifact] key: ${$}, programName: ${t.name}`)),m&&v.uniformVariablesInfo){if(m.length!==v.uniformVariablesInfo.length)throw Error(`Uniform variables count mismatch: expect ${v.uniformVariablesInfo.length}, got ${m.length} in program "${v.programInfo.name}".`);for(let t=0;t<m.length;t++){let i=m[t],r=i.type,a="number"==typeof i.data?1:i.data.length,[n,s]=v.uniformVariablesInfo[t];if(r!==n||a!==s)throw Error(`Uniform variable ${t} mismatch: expect type ${n} with size ${s}, got type ${r} with size ${a} in program "${v.programInfo.name}".`)}}if(e0("info",()=>`[ProgramManager] run "${t.name}" (key=${$}) with ${b[0]}x${b[1]}x${b[2]}`),"none"!==this.queryType||"capturing"===this.sessionStatus){let t={kernelId:this.currentKernelId,programName:v.programInfo.name,inputTensorViews:i,outputTensorViews:y};this.pendingKernels.push(t),"capturing"===this.sessionStatus&&this.capturedPendingKernels.get(this.currentSessionId).push(t)}return this.programManager.run(v,c,_,b,d),B(t.name),y}upload(t,i){this.gpuDataManager.upload(t,i)}memcpy(t,i){this.gpuDataManager.memcpy(t,i)}async download(t,i){await this.gpuDataManager.download(t,i)}alloc(t){return this.gpuDataManager.create(t).id}free(t){return this.gpuDataManager.release(t)}createKernel(t,i,r,a){let n=ns.get(t);if(!n)throw Error(`kernel not implemented: ${t}`);let s={kernelType:t,kernelName:a,kernelEntry:n[0],attributes:[n[1],r]};this.kernels.set(i,s)}releaseKernel(t){let i=this.kernelPersistentData.get(t);if(i){for(let t of i)this.gpuDataManager.release(t.id);this.kernelPersistentData.delete(t)}this.kernelCustomData.delete(t),this.kernels.delete(t)}computeKernel(t,i,r){let a=this.kernels.get(t);if(!a)throw Error(`kernel not created: ${t}`);let n=a.kernelType,s=a.kernelName,o=a.kernelEntry,u=a.attributes;if(null!==this.currentKernelId)throw Error(`kernel "[${n}] ${s}" is not allowed to be called recursively`);this.currentKernelId=t,u[0]&&(u[1]=u[0](u[1]),u[0]=void 0),e0("info",()=>`[WebGPU] Start to run kernel "[${n}] ${s}"...`);let l=this.env.debug;this.temporaryData=[];try{return l&&this.device.pushErrorScope("validation"),o(i,u[1]),0}catch(t){return r.push(Promise.resolve(`[WebGPU] Kernel "[${n}] ${s}" failed. ${t}`)),1}finally{for(let t of(l&&r.push(this.device.popErrorScope().then(t=>t?`GPU validation error for kernel "[${n}] ${s}": ${t.message}`:null)),this.temporaryData))this.gpuDataManager.release(t.id);this.temporaryData=[],this.currentKernelId=null}}registerBuffer(t,i,r,a){let n=this.sessionExternalDataMapping.get(t);n||(n=new Map,this.sessionExternalDataMapping.set(t,n));let s=n.get(i),o=this.gpuDataManager.registerExternalBuffer(r,a,s);return n.set(i,[o,r]),o}unregisterBuffers(t){let i=this.sessionExternalDataMapping.get(t);i&&(i.forEach(t=>this.gpuDataManager.unregisterExternalBuffer(t[0])),this.sessionExternalDataMapping.delete(t))}getBuffer(t){let i=this.gpuDataManager.get(t);if(!i)throw Error(`no GPU data for buffer: ${t}`);return i.buffer}createDownloader(t,i,r){return async()=>{let a=await ty(this,t,i);return e9(a.buffer,r)}}writeTimestamp(t){"inside-passes"===this.queryType&&this.computePassEncoder.writeTimestamp(this.querySet,t)}setQueryType(){this.queryType="none",(this.env.webgpu.profiling?.mode==="default"||(typeof this.env.trace>"u"?this.env.wasm.trace:this.env.trace))&&(this.device.features.has("chromium-experimental-timestamp-query-inside-passes")?this.queryType="inside-passes":this.device.features.has("timestamp-query")&&(this.queryType="at-passes"),"none"!==this.queryType&&typeof this.querySet>"u"&&(this.querySet=this.device.createQuerySet({type:"timestamp",count:2*this.maxDispatchNumber}),this.queryResolveBuffer=this.device.createBuffer({size:2*this.maxDispatchNumber*8,usage:GPUBufferUsage.COPY_SRC|GPUBufferUsage.QUERY_RESOLVE})))}captureBegin(){e0("info","captureBegin"),this.capturedCommandList.get(this.currentSessionId)||this.capturedCommandList.set(this.currentSessionId,[]),this.capturedPendingKernels.get(this.currentSessionId)||this.capturedPendingKernels.set(this.currentSessionId,[]),this.flush(),this.sessionStatus="capturing"}captureEnd(){e0("info","captureEnd"),this.flush(),this.sessionStatus="default"}replay(){e0("info","replay"),this.sessionStatus="replaying";let t=this.capturedCommandList.get(this.currentSessionId),i=this.capturedPendingKernels.get(this.currentSessionId),r=t.length;this.pendingKernels=[];for(let a=0;a<r;a++){let r=this.getComputePassEncoder(),n=t[a];this.writeTimestamp(2*this.pendingDispatchNumber),r.setPipeline(n.computePipeline),r.setBindGroup(0,n.bindGroup),r.dispatchWorkgroups(...n.dispatchGroup),this.writeTimestamp(2*this.pendingDispatchNumber+1),this.pendingDispatchNumber++,"none"!==this.queryType&&this.pendingKernels.push(i[a]),(this.pendingDispatchNumber>=this.maxDispatchNumber||"at-passes"===this.queryType)&&this.endComputePass(),this.pendingDispatchNumber>=this.maxDispatchNumber&&this.flush()}this.flush(),this.sessionStatus="default"}onCreateSession(){this.gpuDataManager.onCreateSession()}onReleaseSession(t){this.unregisterBuffers(t),this.capturedCommandList.has(t)&&this.capturedCommandList.delete(t),this.capturedPendingKernels.has(t)&&this.capturedPendingKernels.delete(t),this.gpuDataManager.onReleaseSession(t)}onRunStart(t){this.currentSessionId=t,this.setQueryType()}}}),sb={};W(sb,{init:()=>sw});var s$,sv,sw,sx,sC,sk,sS,sT,sI,sE,sz,sA,sO,sR,sB,sN,sM,sD,sP,sU,sq,sW,sL,sV,sG,sj,sH,sF,sK,sZ,sQ,sX,sY,sJ,s0,s2=q(()=>{"use strict";nf(),ng(),ny(),n$(),s$=class t{constructor(t,i,r,a){this.module=t,this.dataType=i,this.data=r,this.dims=a}getFloat32Array(){if(1!==this.dataType)throw Error("Invalid data type");let t=e3.size(this.dims);return 0===t?new Float32Array:new Float32Array(this.module.HEAP8.buffer,this.data,t)}getBigInt64Array(){if(7!==this.dataType)throw Error("Invalid data type");let t=e3.size(this.dims);return 0===t?new BigInt64Array:new BigInt64Array(this.module.HEAP8.buffer,this.data,t)}getInt32Array(){if(6!==this.dataType)throw Error("Invalid data type");let t=e3.size(this.dims);return 0===t?new Int32Array:new Int32Array(this.module.HEAP8.buffer,this.data,t)}getUint16Array(){if(10!==this.dataType&&4!==this.dataType)throw Error("Invalid data type");let t=e3.size(this.dims);return 0===t?new Uint16Array:new Uint16Array(this.module.HEAP8.buffer,this.data,t)}reshape(i){if(e3.size(i)!==e3.size(this.dims))throw Error("Invalid new shape");return new t(this.module,this.dataType,this.data,i)}},sv=class{constructor(t,i,r){this.module=t,this.backend=i,this.customDataOffset=0,this.customDataSize=0,this.adapterInfo=i.adapterInfo;let a=t.PTR_SIZE,n=r/t.PTR_SIZE,s=4===a?"i32":"i64";this.opKernelContext=Number(t.getValue(a*n++,s));let o=Number(t.getValue(a*n++,s));this.outputCount=Number(t.getValue(a*n++,s)),this.customDataOffset=Number(t.getValue(a*n++,"*")),this.customDataSize=Number(t.getValue(a*n++,s));let u=[];for(let i=0;i<o;i++){let i=Number(t.getValue(a*n++,s)),r=Number(t.getValue(a*n++,"*")),o=Number(t.getValue(a*n++,s)),l=[];for(let i=0;i<o;i++)l.push(Number(t.getValue(a*n++,s)));u.push(new s$(t,i,r,l))}this.inputs=u}get kernelCustomData(){return this.backend.currentKernelCustomData}get customDataBuffer(){return this.module.HEAPU8.subarray(this.customDataOffset,this.customDataOffset+this.customDataSize)}compute(t,i){let r=i?.inputs?.map(t=>"number"==typeof t?this.inputs[t]:t)??this.inputs,a=i?.outputs??[],n=(t,i,r)=>new s$(this.module,i,this.output(t,r),r),s=(t,i)=>{let r=eV(t,i);if(!r)throw Error(`Unsupported data type: ${t}`);let a=r>0?this.backend.gpuDataManager.create(r).id:0;return new s$(this.module,t,a,i)};return this.backend.run(t,r,a,n,s,this.outputCount)}output(t,i){let r=this.module.stackSave();try{let r=this.module.PTR_SIZE,a=4===r?"i32":"i64",n=this.module.stackAlloc((1+i.length)*r);this.module.setValue(n,i.length,a);for(let t=0;t<i.length;t++)this.module.setValue(n+r*(t+1),i[t],a);return this.module._JsepOutput(this.opKernelContext,t,n)}catch(r){throw Error(`Failed to generate kernel's output[${t}] with dims [${i}]. If you are running with pre-allocated output, please make sure the output type/dims are correct. Error: ${r}`)}finally{this.module.stackRestore(r)}}},sw=async(t,i,r,a)=>{let n=i.jsepInit;if(!n)throw Error("Failed to initialize JSEP. The WebAssembly module is not built with JSEP support.");if("webgpu"===t){let t=new(s_(),L(sm)).WebGpuBackend;await t.initialize(r,a),n("webgpu",[t,i=>t.alloc(Number(i)),i=>t.free(i),(r,a,n,s=!1)=>{if(s)e0("verbose",()=>`[WebGPU] jsepCopyGpuToGpu: src=${Number(r)}, dst=${Number(a)}, size=${Number(n)}`),t.memcpy(Number(r),Number(a));else{e0("verbose",()=>`[WebGPU] jsepCopyCpuToGpu: dataOffset=${Number(r)}, gpuDataId=${Number(a)}, size=${Number(n)}`);let s=i.HEAPU8.subarray(Number(r>>>0),Number(r>>>0)+Number(n));t.upload(Number(a),s)}},async(r,a,n)=>{e0("verbose",()=>`[WebGPU] jsepCopyGpuToCpu: gpuDataId=${r}, dataOffset=${a}, size=${n}`),await t.download(Number(r),()=>i.HEAPU8.subarray(Number(a)>>>0,Number(a+n)>>>0))},(r,a,n)=>t.createKernel(r,Number(a),n,i.UTF8ToString(i._JsepGetNodeName(Number(a)))),i=>t.releaseKernel(i),(r,a,n,s)=>{e0("verbose",()=>`[WebGPU] jsepRun: sessionHandle=${n}, kernel=${r}, contextDataOffset=${a}`);let o=new sv(i,t,Number(a));return t.computeKernel(Number(r),o,s)},()=>t.captureBegin(),()=>t.captureEnd(),()=>t.replay()])}else{let t=new tp(r);n("webnn",[t,()=>t.reserveTensorId(),i=>t.releaseTensorId(i),async(i,r,a,n,s)=>t.ensureTensor(i,r,a,n,s),(i,r)=>{t.uploadTensor(i,r)},async(i,r)=>t.downloadTensor(i,r),(i,r)=>t.registerMLContext(i,r),!!r.trace])}}}),s1=q(()=>{"use strict";eu(),nc(),nh(),nf(),nd(),np(),nm(),sx=async t=>{var i,r;i=t.wasm.numThreads,r=ej(t.logLevel),0!==eR()._OrtInit(i,r)&&eM("Can't initialize onnxruntime.")},sC=async(t,i)=>{eR().asyncInit?.();let r=t.webgpu.adapter;if("webgpu"===i){if(typeof navigator>"u"||!navigator.gpu)throw Error("WebGPU is not supported in current environment");if(r){if("object"!=typeof r.limits||"object"!=typeof r.features||"function"!=typeof r.requestDevice)throw Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.")}else{let i=t.webgpu.powerPreference;if(void 0!==i&&"low-power"!==i&&"high-performance"!==i)throw Error(`Invalid powerPreference setting: "${i}"`);let a=t.webgpu.forceFallbackAdapter;if(void 0!==a&&"boolean"!=typeof a)throw Error(`Invalid forceFallbackAdapter setting: "${a}"`);if(!(r=await navigator.gpu.requestAdapter({powerPreference:i,forceFallbackAdapter:a})))throw Error('Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.')}}if("webnn"===i&&(typeof navigator>"u"||!navigator.ml))throw Error("WebNN is not supported in current environment");{let a=(s2(),L(sb)).init;"webgpu"===i&&await a("webgpu",eR(),t,r),"webnn"===i&&await a("webnn",eR(),t)}},sk=new Map,sS=(t,i)=>{let r=eR(),a=r.stackSave(),n=0;try{let a=r.PTR_SIZE,s=r.stackAlloc(2*a);0!==r._OrtGetInputOutputMetadata(t,i,s,s+a)&&eM("Can't get session input/output metadata.");let o=Number(r.getValue(s,"*"));n=Number(r.getValue(s+a,"*"));let u=r.HEAP32[n/4];if(0===u)return[o,0];let l=r.HEAPU32[n/4+1],d=[];for(let t=0;t<l;t++){let i=Number(r.getValue(n+8+t*a,"*"));d.push(0!==i?r.UTF8ToString(i):Number(r.getValue(n+8+(t+l)*a,"*")))}return[o,u,d]}finally{r.stackRestore(a),0!==n&&r._OrtFree(n)}},sT=t=>{let i=eR(),r=i._malloc(t.byteLength);if(0===r)throw Error(`Can't create a session. failed to allocate a buffer of size ${t.byteLength}.`);return i.HEAPU8.set(t,r),[r,t.byteLength]},sI=async(t,i)=>{let r,a,n=eR();Array.isArray(t)?[r,a]=t:t.buffer===n.HEAPU8.buffer?[r,a]=[t.byteOffset,t.byteLength]:[r,a]=sT(t);let s=0,o=0,u=0,l=[],d=[],p=[];try{if([o,l]=await eq(i),i?.externalData&&n.mountExternalData){let t=[];for(let r of i.externalData){let i="string"==typeof r?r:r.path;t.push(eZ("string"==typeof r?r:r.data).then(t=>{n.mountExternalData(i,t)}))}await Promise.all(t)}for(let t of i?.executionProviders??[])if(("string"==typeof t?t:t.name)==="webnn"){if(n.shouldTransferToMLTensor=!1,"string"!=typeof t){let i=t?.context,r=t?.gpuDevice,a=t?.deviceType,s=t?.powerPreference;i?n.currentContext=i:r?n.currentContext=await n.webnnCreateMLContext(r):n.currentContext=await n.webnnCreateMLContext({deviceType:a,powerPreference:s})}else n.currentContext=await n.webnnCreateMLContext();break}s=await n._OrtCreateSession(r,a,o),n.webgpuOnCreateSession?.(s),0===s&&eM("Can't create a session."),n.jsepOnCreateSession?.(),n.currentContext&&(n.webnnRegisterMLContext(s,n.currentContext),n.currentContext=void 0,n.shouldTransferToMLTensor=!0);let[t,c]=(t=>{let i=eR(),r=i.stackSave();try{let r=i.PTR_SIZE,a=i.stackAlloc(2*r);0!==i._OrtGetInputOutputCount(t,a,a+r)&&eM("Can't get session input/output count.");let n=4===r?"i32":"i64";return[Number(i.getValue(a,n)),Number(i.getValue(a+r,n))]}finally{i.stackRestore(r)}})(s),h=!!i?.enableGraphCapture,f=[],m=[],g=[],y=[],_=[];for(let i=0;i<t;i++){let[t,r,a]=sS(s,i);0===t&&eM("Can't get an input name."),d.push(t);let o=n.UTF8ToString(t);f.push(o),g.push(0===r?{name:o,isTensor:!1}:{name:o,isTensor:!0,type:eL(r),shape:a})}for(let r=0;r<c;r++){let[a,o,u]=sS(s,r+t);0===a&&eM("Can't get an output name."),p.push(a);let l=n.UTF8ToString(a);m.push(l),y.push(0===o?{name:l,isTensor:!1}:{name:l,isTensor:!0,type:eL(o),shape:u});{if(h&&i?.preferredOutputLocation===void 0){_.push("gpu-buffer");continue}let t="string"==typeof i?.preferredOutputLocation?i.preferredOutputLocation:i?.preferredOutputLocation?.[l]??"cpu",r=n.webnnIsGraphOutput;if("cpu"===t&&r&&r(s,l)){_.push("ml-tensor-cpu-output");continue}if("cpu"!==t&&"cpu-pinned"!==t&&"gpu-buffer"!==t&&"ml-tensor"!==t)throw Error(`Not supported preferred output location: ${t}.`);if(h&&"gpu-buffer"!==t)throw Error(`Not supported preferred output location: ${t}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);_.push(t)}}let b=null;return _.some(t=>"gpu-buffer"===t||"ml-tensor"===t||"ml-tensor-cpu-output"===t)&&(u=n._OrtCreateBinding(s),0===u&&eM("Can't create IO binding."),b={handle:u,outputPreferredLocations:_,outputPreferredLocationsEncoded:_.map(t=>"ml-tensor-cpu-output"===t?"ml-tensor":t).map(t=>eK(t))}),sk.set(s,[s,d,p,b,h,!1]),[s,f,m,g,y]}catch(t){throw d.forEach(t=>n._OrtFree(t)),p.forEach(t=>n._OrtFree(t)),0!==u&&0!==n._OrtReleaseBinding(u)&&eM("Can't release IO binding."),0!==s&&0!==n._OrtReleaseSession(s)&&eM("Can't release session."),t}finally{n._free(r),0!==o&&0!==n._OrtReleaseSessionOptions(o)&&eM("Can't release session options."),l.forEach(t=>n._free(t)),n.unmountExternalData?.()}},sE=t=>{let i=eR(),r=sk.get(t);if(!r)throw Error(`cannot release session. invalid session id: ${t}`);let[a,n,s,o,u]=r;o&&(u&&0!==i._OrtClearBoundOutputs(o.handle)&&eM("Can't clear bound outputs."),0!==i._OrtReleaseBinding(o.handle)&&eM("Can't release IO binding.")),i.jsepOnReleaseSession?.(t),i.webnnOnReleaseSession?.(t),i.webgpuOnReleaseSession?.(t),n.forEach(t=>i._OrtFree(t)),s.forEach(t=>i._OrtFree(t)),0!==i._OrtReleaseSession(a)&&eM("Can't release session."),sk.delete(t)},sz=async(t,i,r,a,n,s,o=!1)=>{if(!t)return void i.push(0);let u=eR(),l=u.PTR_SIZE,d=t[0],p=t[1],c=t[3],h=c,f,m;if("string"===d&&("gpu-buffer"===c||"ml-tensor"===c))throw Error("String tensor is not supported on GPU.");if(o&&"gpu-buffer"!==c)throw Error(`External buffer must be provided for input/output index ${s} when enableGraphCapture is true.`);if("gpu-buffer"===c){let i=t[2].gpuBuffer;m=eV(eW(d),p);{let t=u.jsepRegisterBuffer;if(!t)throw Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');f=t(a,s,i,m)}}else if("ml-tensor"===c){let i=t[2].mlTensor;m=eV(eW(d),p);let r=u.webnnRegisterMLTensor;if(!r)throw Error('Tensor location "ml-tensor" is not supported without using WebNN.');f=r(a,i,eW(d),p)}else{let i=t[2];if(Array.isArray(i)){m=l*i.length,f=u._malloc(m),r.push(f);for(let t=0;t<i.length;t++){if("string"!=typeof i[t])throw TypeError(`tensor data at index ${t} is not a string`);u.setValue(f+t*l,eB(i[t],r),"*")}}else{let t=u.webnnIsGraphInput,s=u.webnnIsGraphOutput;if("string"!==d&&t&&s){let o=u.UTF8ToString(n);if(t(a,o)||s(a,o)){let t=eW(d);m=eV(t,p),h="ml-tensor";let r=u.webnnCreateTemporaryTensor,n=u.webnnUploadTensor;if(!r||!n)throw Error('Tensor location "ml-tensor" is not supported without using WebNN.');let s=await r(a,t,p);n(s,new Uint8Array(i.buffer,i.byteOffset,i.byteLength)),f=s}else m=i.byteLength,f=u._malloc(m),r.push(f),u.HEAPU8.set(new Uint8Array(i.buffer,i.byteOffset,m),f)}else m=i.byteLength,f=u._malloc(m),r.push(f),u.HEAPU8.set(new Uint8Array(i.buffer,i.byteOffset,m),f)}}let g=u.stackSave(),y=u.stackAlloc(4*p.length);try{p.forEach((t,i)=>u.setValue(y+i*l,t,4===l?"i32":"i64"));let t=u._OrtCreateTensor(eW(d),f,m,y,p.length,eK(h));0===t&&eM(`Can't create tensor for input/output. session=${a}, index=${s}.`),i.push(t)}finally{u.stackRestore(g)}},sA=async(t,i,r,a,n,s)=>{let o=eR(),u=o.PTR_SIZE,l=sk.get(t);if(!l)throw Error(`cannot run inference. invalid session id: ${t}`);let d=l[0],p=l[1],c=l[2],h=l[3],f=l[4],m=l[5],g=i.length,y=a.length,_=0,b=[],$=[],v=[],w=[],x=o.stackSave(),C=o.stackAlloc(g*u),k=o.stackAlloc(g*u),S=o.stackAlloc(y*u),T=o.stackAlloc(y*u);try{let l;[_,b]=eD(s),N("wasm prepareInputOutputTensor");for(let a=0;a<g;a++)await sz(r[a],$,w,t,p[i[a]],i[a],f);for(let i=0;i<y;i++)await sz(n[i],v,w,t,c[a[i]],g+a[i],f);M("wasm prepareInputOutputTensor");for(let t=0;t<g;t++)o.setValue(C+t*u,$[t],"*"),o.setValue(k+t*u,p[i[t]],"*");for(let t=0;t<y;t++)o.setValue(S+t*u,v[t],"*"),o.setValue(T+t*u,c[a[t]],"*");if(h&&!m){let{handle:r,outputPreferredLocations:s,outputPreferredLocationsEncoded:u}=h;if(p.length!==g)throw Error(`input count from feeds (${g}) is expected to be always equal to model's input count (${p.length}).`);N("wasm bindInputsOutputs");for(let a=0;a<g;a++){let n=i[a];await o._OrtBindInput(r,p[n],$[a])!==0&&eM(`Can't bind input[${a}] for session=${t}.`)}for(let i=0;i<y;i++){let l=a[i];n[i]?.[3]?0!==o._OrtBindOutput(r,c[l],v[i],0)&&eM(`Can't bind pre-allocated output[${i}] for session=${t}.`):0!==o._OrtBindOutput(r,c[l],0,u[l])&&eM(`Can't bind output[${i}] to ${s[i]} for session=${t}.`)}M("wasm bindInputsOutputs"),sk.set(t,[d,p,c,h,f,!0])}o.jsepOnRunStart?.(d),o.webnnOnRunStart?.(d),l=h?await o._OrtRunWithBinding(d,h.handle,y,S,_):await o._OrtRun(d,k,C,g,T,y,S,_),0!==l&&eM("failed to call OrtRun().");let x=[],I=[];N("wasm ProcessOutputTensor");for(let i=0;i<y;i++){let r=Number(o.getValue(S+i*u,"*"));if(r===v[i]){x.push(n[i]);continue}let s=o.stackSave(),l=o.stackAlloc(4*u),d=!1,p,c=0;try{0!==o._OrtGetTensorData(r,l,l+u,l+2*u,l+3*u)&&eM(`Can't access output tensor data on index ${i}.`);let n=4===u?"i32":"i64",s=Number(o.getValue(l,n));c=o.getValue(l+u,"*");let f=o.getValue(l+2*u,"*"),m=Number(o.getValue(l+3*u,n)),g=[];for(let t=0;t<m;t++)g.push(Number(o.getValue(f+t*u,n)));0!==o._OrtFree(f)&&eM("Can't free memory for tensor dims.");let y=g.reduce((t,i)=>t*i,1);p=eL(s);let _=h?.outputPreferredLocations[a[i]];if("string"===p){if("gpu-buffer"===_||"ml-tensor"===_)throw Error("String tensor is not supported on GPU.");let t=[];for(let i=0;i<y;i++){let r=o.getValue(c+i*u,"*"),a=o.getValue(c+(i+1)*u,"*"),n=i===y-1?void 0:a-r;t.push(o.UTF8ToString(r,n))}x.push([p,g,t,"cpu"])}else if("gpu-buffer"===_&&y>0){let t=o.jsepGetBuffer;if(!t)throw Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');let i=t(c),a=eV(s,y);if(void 0===a||!eH(p))throw Error(`Unsupported data type: ${p}`);d=!0,x.push([p,g,{gpuBuffer:i,download:o.jsepCreateDownloader(i,a,p),dispose:()=>{0!==o._OrtReleaseTensor(r)&&eM("Can't release tensor.")}},"gpu-buffer"])}else if("ml-tensor"===_&&y>0){let i=o.webnnEnsureTensor,a=o.webnnIsGraphInputOutputTypeSupported;if(!i||!a)throw Error('preferredLocation "ml-tensor" is not supported without using WebNN.');if(void 0===eV(s,y)||!eF(p))throw Error(`Unsupported data type: ${p}`);if(!a(t,p,!1))throw Error(`preferredLocation "ml-tensor" for ${p} output is not supported by current WebNN Context.`);let n=await i(t,c,s,g,!1);d=!0,x.push([p,g,{mlTensor:n,download:o.webnnCreateMLTensorDownloader(c,p),dispose:()=>{o.webnnReleaseTensorId(c),o._OrtReleaseTensor(r)}},"ml-tensor"])}else if("ml-tensor-cpu-output"===_&&y>0){let t=o.webnnCreateMLTensorDownloader(c,p)(),i=x.length;d=!0,I.push((async()=>{let a=[i,await t];return o.webnnReleaseTensorId(c),o._OrtReleaseTensor(r),a})()),x.push([p,g,[],"cpu"])}else{let t=new(eG(p))(y);new Uint8Array(t.buffer,t.byteOffset,t.byteLength).set(o.HEAPU8.subarray(c,c+t.byteLength)),x.push([p,g,t,"cpu"])}}finally{o.stackRestore(s),"string"===p&&c&&o._free(c),d||o._OrtReleaseTensor(r)}}for(let[i,r]of(h&&!f&&(0!==o._OrtClearBoundOutputs(h.handle)&&eM("Can't clear bound outputs."),sk.set(t,[d,p,c,h,f,!1])),await Promise.all(I)))x[i][2]=r;return M("wasm ProcessOutputTensor"),x}finally{o.webnnOnRunEnd?.(d),o.stackRestore(x),$.forEach(t=>o._OrtReleaseTensor(t)),v.forEach(t=>o._OrtReleaseTensor(t)),w.forEach(t=>o._free(t)),0!==_&&o._OrtReleaseRunOptions(_),b.forEach(t=>o._free(t))}},sO=t=>{let i=eR(),r=sk.get(t);if(!r)throw Error("invalid session id");let a=r[0],n=i._OrtEndProfiling(a);0===n&&eM("Can't get an profile file name."),i._OrtFree(n)},sR=t=>{let i=[];for(let r of t){let t=r[2];!Array.isArray(t)&&"buffer"in t&&i.push(t.buffer)}return i}}),s3=q(()=>{"use strict";eu(),s1(),nd(),nl(),sB=()=>!!f.wasm.proxy&&"u">typeof document,sM=!1,sD=!1,sP=!1,sW=new Map,sL=(t,i)=>{let r=sW.get(t);r?r.push(i):sW.set(t,[i])},sV=()=>{if(sM||!sD||sP||!sN)throw Error("worker not ready")},sG=t=>{switch(t.data.type){case"init-wasm":sM=!1,t.data.err?(sP=!0,sq[1](t.data.err)):(sD=!0,sq[0]()),sU&&(URL.revokeObjectURL(sU),sU=void 0);break;case"init-ep":case"copy-from":case"create":case"release":case"run":case"end-profiling":{let i=sW.get(t.data.type);t.data.err?i.shift()[1](t.data.err):i.shift()[0](t.data.out)}}},sj=async()=>{if(!sD){if(sM)throw Error("multiple calls to 'initWasm()' detected.");if(sP)throw Error("previous call to 'initWasm()' failed.");if(sM=!0,sB())return new Promise((t,i)=>{sN?.terminate(),ek().then(([r,a])=>{try{(sN=a).onerror=t=>i(t),sN.onmessage=sG,sq=[t,i];let n={type:"init-wasm",in:f};!n.in.wasm.wasmPaths&&(r||e_)&&(n.in.wasm.wasmPaths={wasm:new URL("ort-wasm-simd-threaded.jsep.wasm",import.meta.url).href}),sN.postMessage(n),sU=r}catch(t){i(t)}},i)});try{await eO(f.wasm),await sx(f),sD=!0}catch(t){throw sP=!0,t}finally{sM=!1}}},sH=async t=>{if(sB())return sV(),new Promise((i,r)=>{sL("init-ep",[i,r]);let a={type:"init-ep",in:{epName:t,env:f}};sN.postMessage(a)});await sC(f,t)},sF=async t=>sB()?(sV(),new Promise((i,r)=>{sL("copy-from",[i,r]),sN.postMessage({type:"copy-from",in:{buffer:t}},[t.buffer])})):sT(t),sK=async(t,i)=>{if(!sB())return sI(t,i);if(i?.preferredOutputLocation)throw Error('session option "preferredOutputLocation" is not supported for proxy.');return sV(),new Promise((r,a)=>{sL("create",[r,a]);let n={type:"create",in:{model:t,options:{...i}}},s=[];t instanceof Uint8Array&&s.push(t.buffer),sN.postMessage(n,s)})},sZ=async t=>{if(sB())return sV(),new Promise((i,r)=>{sL("release",[i,r]),sN.postMessage({type:"release",in:t})});sE(t)},sQ=async(t,i,r,a,n,s)=>{if(!sB())return sA(t,i,r,a,n,s);if(r.some(t=>"cpu"!==t[3]))throw Error("input tensor on GPU is not supported for proxy.");if(n.some(t=>t))throw Error("pre-allocated output tensor is not supported for proxy.");return sV(),new Promise((n,o)=>{sL("run",[n,o]),sN.postMessage({type:"run",in:{sessionId:t,inputIndices:i,inputs:r,outputIndices:a,options:s}},sR(r))})},sX=async t=>{if(sB())return sV(),new Promise((i,r)=>{sL("end-profiling",[i,r]),sN.postMessage({type:"end-profiling",in:t})});sO(t)}}),s4=q(()=>{"use strict";eu(),s3(),nf(),el(),nm(),sY=(t,i)=>{switch(t.location){case"cpu":return[t.type,t.dims,t.data,"cpu"];case"gpu-buffer":return[t.type,t.dims,{gpuBuffer:t.gpuBuffer},"gpu-buffer"];case"ml-tensor":return[t.type,t.dims,{mlTensor:t.mlTensor},"ml-tensor"];default:throw Error(`invalid data location: ${t.location} for ${i()}`)}},sJ=t=>{switch(t[3]){case"cpu":return new z(t[0],t[2],t[1]);case"gpu-buffer":{let i=t[0];if(!eH(i))throw Error(`not supported data type: ${i} for deserializing GPU tensor`);let{gpuBuffer:r,download:a,dispose:n}=t[2];return z.fromGpuBuffer(r,{dataType:i,dims:t[1],download:a,dispose:n})}case"ml-tensor":{let i=t[0];if(!eF(i))throw Error(`not supported data type: ${i} for deserializing MLTensor tensor`);let{mlTensor:r,download:a,dispose:n}=t[2];return z.fromMLTensor(r,{dataType:i,dims:t[1],download:a,dispose:n})}default:throw Error(`invalid data location: ${t[3]}`)}},s0=class{async fetchModelAndCopyToWasmMemory(t){return sF(await eZ(t))}async loadModel(t,i){let r;R(),r="string"==typeof t?await this.fetchModelAndCopyToWasmMemory(t):t,[this.sessionId,this.inputNames,this.outputNames,this.inputMetadata,this.outputMetadata]=await sK(r,i),B()}async dispose(){return sZ(this.sessionId)}async run(t,i,r){R();let a=[],n=[];Object.entries(t).forEach(t=>{let i=t[0],r=t[1],s=this.inputNames.indexOf(i);if(-1===s)throw Error(`invalid input '${i}'`);a.push(r),n.push(s)});let s=[],o=[];Object.entries(i).forEach(t=>{let i=t[0],r=t[1],a=this.outputNames.indexOf(i);if(-1===a)throw Error(`invalid output '${i}'`);s.push(r),o.push(a)});let u=a.map((t,i)=>sY(t,()=>`input "${this.inputNames[n[i]]}"`)),l=s.map((t,i)=>t?sY(t,()=>`output "${this.outputNames[o[i]]}"`):null),d=await sQ(this.sessionId,n,u,o,l,r),p={};for(let t=0;t<d.length;t++)p[this.outputNames[o[t]]]=s[t]??sJ(d[t]);return B(),p}startProfiling(){}endProfiling(){sX(this.sessionId)}}}),s6={};W(s6,{OnnxruntimeWebAssemblyBackend:()=>s5,initializeFlags:()=>s8,wasmBackend:()=>s9});var s8,s5,s9,s7=q(()=>{"use strict";eu(),s3(),s4(),s8=()=>{("number"!=typeof f.wasm.initTimeout||f.wasm.initTimeout<0)&&(f.wasm.initTimeout=0);let t=f.wasm.simd;if("boolean"!=typeof t&&void 0!==t&&"fixed"!==t&&"relaxed"!==t&&(console.warn(`Property "env.wasm.simd" is set to unknown value "${t}". Reset it to \`false\` and ignore SIMD feature checking.`),f.wasm.simd=!1),"boolean"!=typeof f.wasm.proxy&&(f.wasm.proxy=!1),"boolean"!=typeof f.wasm.trace&&(f.wasm.trace=!1),"number"!=typeof f.wasm.numThreads||!Number.isInteger(f.wasm.numThreads)||f.wasm.numThreads<=0)if("u">typeof self&&!self.crossOriginIsolated)f.wasm.numThreads=1;else{let t=typeof navigator>"u"?U("node:os").cpus().length:navigator.hardwareConcurrency;f.wasm.numThreads=Math.min(4,Math.ceil((t||1)/2))}},s9=new(s5=class{async init(t){s8(),await sj(),await sH(t)}async createInferenceSessionHandler(t,i){let r=new s0;return await r.loadModel(t,i),r}})});eu(),eu(),eu();var oe=eo;{let t=(s7(),L(s6)).wasmBackend;u("webgpu",t,5),u("webnn",t,5),u("cpu",t,10),u("wasm",t,10)}Object.defineProperty(f.versions,"web",{value:"1.23.0",enumerable:!0});export{P as InferenceSession,A as TRACE,N as TRACE_EVENT_BEGIN,M as TRACE_EVENT_END,R as TRACE_FUNC_BEGIN,B as TRACE_FUNC_END,z as Tensor,oe as default,f as env,u as registerBackend};