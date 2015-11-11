self.port.on("TablistChange", (tabs) => {
  document.getElementById("dbg").textContent = JSON.stringify(tabs, null, 2);
});
