const WindowUtils = require("sdk/window/utils");

const Ui = require("lib/ui");
const {SessionStorage} = require("lib/storage/session");

const Storage = new SessionStorage();

const showPanelButton = Ui.PanelButton();
const groupsPanel = Ui.GroupsPanel();

showPanelButton.on("change", (state) => {
  if (!state.checked) {
    return;
  }

  groupsPanel.show({position: showPanelButton});
});

groupsPanel.on("hide", () => {
  showPanelButton.state("window", {checked: false});
});

groupsPanel.on("show", () => {
  let currentWindow = WindowUtils.getMostRecentBrowserWindow();

  groupsPanel.port.emit(
    "TablistChange",
    Storage.getTabs(currentWindow)
  );
});
