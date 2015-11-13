const self = require("sdk/self");
var _ = require("sdk/l10n").get;

const {Hotkey} = require("sdk/hotkeys");
const {Panel} = require("sdk/panel");
const Prefs = require("sdk/simple-prefs");
const {SessionStorage} = require("lib/storage/session");
const {ToggleButton} = require("sdk/ui/button/toggle");
const WindowUtils = require("sdk/window/utils");

function TabGroups() {
  this._groupsPanel = null;
  this._hotkey = null;
  this._panelButton = null;

  this._storage = new SessionStorage();

  this.init();
  this.bindEvents();
}

TabGroups.prototype = {
  init: function() {
    this.createPanelButton();
    this.createGroupsPanel();
    this.createHotkey();
  },

  bindEvents: function() {
    this.bindHotkeyPreference();
    this.bindPanelButtonEvents();
    this.bindPanelEvents();
  },

  createGroupsPanel: function() {
    this._groupsPanel = Panel({
      contentScriptFile: [
        self.data.url("vendor/react-0.14.2.js"),
        self.data.url("vendor/react-dom-0.14.2.min.js"),
        self.data.url("vendor/redux.min.js"),
        self.data.url("vendor/react-redux.min.js"),
        self.data.url("vendor/immutable.min.js"),

        self.data.url("action_creators.js"),
        self.data.url("reducer.js"),
        self.data.url("components/app.js"),
        self.data.url("components/group.js"),
        self.data.url("components/grouplist.js"),
        self.data.url("components/tab.js"),
        self.data.url("components/tablist.js"),
        self.data.url("groupspanel.js")
      ],
      contentURL: self.data.url("groupspanel.html")
    });
  },

  createPanelButton: function() {
    this._panelButton = ToggleButton({
      id: "tabgroups-show",
      icon: {
        "32": self.data.url("assets/images/icon-32.png"),
        "64": self.data.url("assets/images/icon-64.png")
      },
      label: _("panelButton_label")
    });
  },

  createHotkey: function() {
    if (!Prefs.prefs.bindPanoramaShortcut) {
      return;
    }

    this._hotkey = Hotkey({
      combo: "accel-shift-e",
      onPress: () => {
        if (this._groupsPanel.isShowing) {
          this._groupsPanel.hide();
        } else {
          this._groupsPanel.show({position: this._panelButton});
          this._panelButton.state("window", {checked: true});
        }
      }
    });
  },

  bindHotkeyPreference: function() {
    if (Prefs.prefs.bindPanoramaShortcut) {
      this.createHotkey();
    }

    Prefs.on("bindPanoramaShortcut", () => {
      if (Prefs.prefs.bindPanoramaShortcut) {
        if (!this._hotkey) {
          this.createHotkey();
        }
      } else if (this._hotkey) {
        this._hotkey.destroy();
        this._hotkey = null;
      }
    });
  },

  bindPanelButtonEvents: function() {
    this._panelButton.on("change", (state) => {
      if (!state.checked) {
        return;
      }

      this._groupsPanel.show({position: this._panelButton});
    });
  },

  bindPanelEvents: function() {
    this._groupsPanel.on("hide", () => {
      this._panelButton.state("window", {checked: false});
    });

    this._groupsPanel.on("show", () => {
      let currentWindow = WindowUtils.getMostRecentBrowserWindow();
      let groups = this._storage.getGroups(currentWindow);
      let tabs = this._storage.getGroupedTabs(currentWindow);

      this._groupsPanel.port.emit("TabgroupsChanged", groups.map((group) => {
        group.tabs = tabs[group.id];
        return group;
      }));
    });
  }
};

new TabGroups();
