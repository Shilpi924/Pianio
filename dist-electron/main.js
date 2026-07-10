import { createRequire } from "node:module";
//#region \0rolldown/runtime.js
var __require = /* #__PURE__ */ (() => createRequire(import.meta.url))();
//#endregion
//#region electron/main.js
var { app, BrowserWindow } = __require("electron");
var path = __require("path");
var mainWindow = null;
var createWindow = () => {
	mainWindow = new BrowserWindow({
		width: 1400,
		height: 900,
		minWidth: 1200,
		minHeight: 700,
		webPreferences: {
			preload: path.join(__dirname, "../preload/index.js"),
			contextIsolation: true,
			nodeIntegration: false
		},
		backgroundColor: "#ffffff",
		titleBarStyle: "hiddenInset"
	});
	if (process.env.NODE_ENV === "development") {
		mainWindow.loadURL("http://localhost:5173");
		mainWindow.webContents.openDevTools();
	} else mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
	mainWindow.on("closed", () => {
		mainWindow = null;
	});
};
app.on("ready", createWindow);
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});
app.on("activate", () => {
	if (mainWindow === null) createWindow();
});
//#endregion
export {};
