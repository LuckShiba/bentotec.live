/**
 * @preserve
 * Gerador e Validador de CPF v5.0.2
 * http://tiagoporto.github.io/gerador-validador-cpf
 * Copyright (c) 2014-present Tiago Porto (http://tiagoporto.com)
 * Released under the MIT license
 */

 !function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).CPF={})}(this,(function(e){"use strict";const t=e=>{let t=0;for(let r=0;r<9;++r)t+=Number(e.charAt(r))*(10-r);const r=t%11;return r<2?0:11-r},r=e=>{let t=0;for(let r=0;r<10;++r)t+=Number(e.charAt(r))*(11-r);const r=t%11;return r<2?0:11-r},n=()=>{let e="";for(let t=0;t<9;++t)e+=String(Math.floor(10*Math.random()));return e},o=e=>{for(let t=0;t<10;t++)if(e===new Array(e.length+1).join(String(t)))return!0;return!1};e.validate=e=>{if("string"!=typeof e)return!1;const n=String(e).replace(/[\s.-]/g,""),l=n.slice(0,9),i=n.slice(9,11);if((f=n).length>11||f.length<11||o(n))return!1;var f;const s=t(l);return i===`${s}${r(`${l}${s}`)}`},Object.defineProperty(e,"__esModule",{value:!0})}));
