const WindowUtils = require("sdk/window/utils");

const Ui = require("lib/ui");
const Prefs = require("sdk/simple-prefs");
const {SessionStorage} = require("lib/storage/session");

const Storage = new SessionStorage();

const groupsPanel = Ui.GroupsPanel();
const showPanelButton = Ui.PanelButton();

let hotkey = null;

if (Prefs.prefs.bindPanoramaShortcut) {
  hotkey = Ui.GroupsHotkey(groupsPanel, showPanelButton);
}

Prefs.on("bindPanoramaShortcut", () => {
  if (Prefs.prefs.bindPanoramaShortcut) {
    if (!hotkey) {
      hotkey = Ui.GroupsHotkey(groupsPanel, showPanelButton);
    }
  } else if (hotkey) {
    hotkey.destroy();
    hotkey = null;
  }
});

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
  let groups = Storage.getGroups(currentWindow);
  let tabs = Storage.getGroupedTabs(currentWindow);

  groupsPanel.port.emit("TabgroupsChanged", groups.map((group) => {
    group.tabs = tabs[group.id];
    return group;
  }));
});
