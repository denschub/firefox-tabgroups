const WindowUtils = require("sdk/window/utils");

const Ui = require("lib/ui");
const {SessionStorage} = require("lib/storage/session");

const Storage = new SessionStorage();

const groupsPanel = Ui.GroupsPanel();
const showPanelButton = Ui.PanelButton();

Ui.GroupsHotkey(() => {
  if (groupsPanel.isShowing) {
    groupsPanel.hide();
  } else {
    groupsPanel.show({position: showPanelButton});
    showPanelButton.state("window", {checked: true});
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
