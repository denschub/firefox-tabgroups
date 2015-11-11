const self = require("sdk/self");

const {Hotkey} = require("sdk/hotkeys");
const {Panel} = require("sdk/panel");
const {ToggleButton} = require("sdk/ui/button/toggle");

/**
 * Registers and returns the hotkey.
 */
exports.GroupsHotkey = function(onPress) {
  return Hotkey({
    combo: "accel-shift-e",
    onPress
  });
}

/**
 * Creates and returns a Panel displaying the Tab Groupes and their Tabs.
 */
exports.GroupsPanel = function() {
  return Panel({
    contentScriptFile: self.data.url("groupspanel.js"),
    contentScriptWhen: "ready",
    contentURL: self.data.url("groupspanel.html")
  });
};

/**
 * Creates and returns a ToggleButton for toggling the Panel.
 */
exports.PanelButton = function() {
  return ToggleButton({
    id: "tabgroups-show",
    icon: {
      "32": self.data.url("assets/images/icon-32.png"),
      "64": self.data.url("assets/images/icon-64.png")
    },
    label: "Show Tab Groups"
  });
};
