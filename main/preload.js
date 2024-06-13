import { contextBridge, ipcRenderer } from "electron";

const handler = {
  send(channel, value) {
    ipcRenderer.send(channel, value);
  },
  on(channel, callback) {
    const subscription = (_event, ...args) => callback(...args);
    ipcRenderer.on(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },
};

contextBridge.exposeInMainWorld("ipc", handler);
contextBridge.exposeInMainWorld("environmentVariables", {
  api_url: process.env.NEXT_PUBLIC_API_URL,
});
