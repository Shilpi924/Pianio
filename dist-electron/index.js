import { createRequire } from "node:module";
//#endregion
//#region electron/preload/index.js
var { contextBridge } = (/* @__PURE__ */ (() => createRequire(import.meta.url))())("electron");
contextBridge.exposeInMainWorld("electron", { platform: process.platform });
//#endregion
export {};
