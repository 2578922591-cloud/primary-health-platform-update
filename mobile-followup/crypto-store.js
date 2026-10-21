const KEY_NAME="followup_encrypted_v1";
const enc=new TextEncoder(),dec=new TextDecoder();
const b64=a=>btoa(String.fromCharCode(...new Uint8Array(a)));
const unb64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
let sessionKey=null,currentSalt=null;

async function derive(pin,salt){const base=await crypto.subtle.importKey("raw",enc.encode(pin),"PBKDF2",false,["deriveKey"]);return crypto.subtle.deriveKey({name:"PBKDF2",salt,iterations:210000,hash:"SHA-256"},base,{name:"AES-GCM",length:256},false,["encrypt","decrypt"])}
export const exists=()=>Boolean(localStorage.getItem(KEY_NAME));
export async function create(pin){currentSalt=crypto.getRandomValues(new Uint8Array(16));sessionKey=await derive(pin,currentSalt);const data={version:1,records:[],createdAt:new Date().toISOString()};await save(data);return data}
export async function unlock(pin){const box=JSON.parse(localStorage.getItem(KEY_NAME)||"null");if(!box)throw new Error("尚未创建本地数据仓");currentSalt=unb64(box.salt);sessionKey=await derive(pin,currentSalt);try{const plain=await crypto.subtle.decrypt({name:"AES-GCM",iv:unb64(box.iv)},sessionKey,unb64(box.data));return JSON.parse(dec.decode(plain))}catch{sessionKey=null;throw new Error("密码错误或数据已损坏")}}
export async function save(data){if(!sessionKey)throw new Error("应用尚未解锁");const iv=crypto.getRandomValues(new Uint8Array(12));const ciphertext=await crypto.subtle.encrypt({name:"AES-GCM",iv},sessionKey,enc.encode(JSON.stringify(data)));localStorage.setItem(KEY_NAME,JSON.stringify({version:1,salt:b64(currentSalt),iv:b64(iv),data:b64(ciphertext),updatedAt:new Date().toISOString()}))}
export function lock(){sessionKey=null;currentSalt=null}
export function backup(){return localStorage.getItem(KEY_NAME)}
export function clear(){localStorage.removeItem(KEY_NAME);lock()}

