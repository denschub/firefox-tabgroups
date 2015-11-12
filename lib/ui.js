const self = require("sdk/self");

const {Hotkey} = require("sdk/hotkeys");
const {Panel} = require("sdk/panel");
const {ToggleButton} = require("sdk/ui/button/toggle");

/**
 * Registers and returns the hotkey.
 */
exports.GroupsHotkey = function(onPress) {
  /**
   * NOTE
   *
   * Since we're removing Panorama in 1222490 it should be safe to reassign
   * Ctrl-Shift-E for our replacement
   */
  return Hotkey({
    combo: "accel-shift-e",
    onPress
  });
};

/**
 * Creates and returns a Panel displaying the Tab Groupes and their Tabs.
 */
exports.GroupsPanel = function() {
  return Panel({
    contentScriptFile: [
      self.data.url("vendor/react-0.14.2.js"),
      self.data.url("vendor/react-dom-0.14.2.min.js"),
      self.data.url("vendor/redux.min.js"),
      self.data.url("vendor/react-redux.min.js"),
      self.data.url("vendor/immutable.min.js"),

      self.data.url("components/app.js"),
      self.data.url("components/group.js"),
      self.data.url("components/grouplist.js"),
      self.data.url("components/tab.js"),
      self.data.url("components/tablist.js"),
      self.data.url("action_creators.js"),
      self.data.url("reducer.js"),
      self.data.url("groupspanel.js")
    ],
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
