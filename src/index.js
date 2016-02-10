const self = require("sdk/self");
const _ = require("sdk/l10n").get;

const {Hotkey} = require("sdk/hotkeys");
const {Panel} = require("sdk/panel");
const Prefs = require("sdk/simple-prefs");
const TabsUtils = require("sdk/tabs/utils");
const {ToggleButton} = require("sdk/ui/button/toggle");
const WindowUtils = require("sdk/window/utils");

const Utils = require("lib/utils");
const {SessionStorage} = require("lib/storage/session");
const {TabManager} = require("lib/tabmanager");

function TabGroups() {
  this._groupsPanel = null;
  this._hotkey = null;
  this._panelButton = null;

  this._tabs = new TabManager(new SessionStorage());

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
      height: 1,
      contentURL: self.data.url("groupspanel.html"),
      contentScriptOptions: {
        l10n: Utils.getL10nStrings([
          "add_group",
          "unnamed_group"
        ])
      }
    });
  },

  createPanelButton: function() {
    let iconBase = "chrome://simplified-tabgroups/content/icons/togglebutton/";
    this._panelButton = ToggleButton({
      id: "tabgroups-show",
      icon: {
        "16": Utils.themeSwitch({
          dark: iconBase + "icon-inverted-32.png",
          light: iconBase + "icon-32.png"
        }),
        "32": iconBase + "icon-32.png",
        "64": iconBase + "icon-64.png"
      },
      label: _("panelButton_label")
    });
  },

  createHotkey: function() {
    if (!Prefs.prefs.bindPanoramaShortcut) {
      return;
    }

    /**
     * Note: since this is intended to be released after 1222490 has landed,
     * it is perfectly save to assume accel-shift-e is not used by anything
     * else.
     */
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
        this._groupsPanel.hide();
      } else {
        if (this._groupsPanel.isShowing) {
          this._groupsPanel.hide();
        }

        this._groupsPanel.show({position: this._panelButton});
      }
    });
  },

  bindPanelEvents: function() {
    this._groupsPanel.on("hide", () => {
      this._panelButton.state("window", {checked: false});
    });

    this._groupsPanel.on("show", this.refreshUi.bind(this));

    this._groupsPanel.port.on("Group:Add", this.onGroupAdd.bind(this));
    this._groupsPanel.port.on("Group:Close", this.onGroupClose.bind(this));
    this._groupsPanel.port.on("Group:Rename", this.onGroupRename.bind(this));
    this._groupsPanel.port.on("Group:Select", this.onGroupSelect.bind(this));
    this._groupsPanel.port.on("Tab:Select", this.onTabSelect.bind(this));
    this._groupsPanel.port.on("UI:Resize", this.resizePanel.bind(this));
  },

  refreshUi: function() {
    let groups = this._tabs.getGroupsWithTabs(this._getWindow(), Prefs.prefs.enableAlphabeticSort);

    this._groupsPanel.port.emit("Groups:Changed", groups);
  },

  resizePanel: function(dimensions) {
    this._groupsPanel.resize(
      this._groupsPanel.width,
      dimensions.height + 18
    );
  },

  onGroupAdd: function() {
    this._tabs.addGroup(
      this._getWindow()
    );
    this.refreshUi();
  },

  onGroupClose: function(event) {
    this._tabs.closeGroup(
      this._getWindow(),
      this._getTabBrowser(),
      event.groupID
    );
    this.refreshUi();
  },

  onGroupRename: function(event) {
    this._tabs.renameGroup(
      this._getWindow(),
      event.groupID,
      event.title
    );
    this.refreshUi();
  },

  onGroupSelect: function(event) {
    this._tabs.selectGroup(
      this._getWindow(),
      this._getTabBrowser(),
      event.groupID
    );
    this.refreshUi();
  },

  onTabSelect: function(event) {
    this._tabs.selectTab(
      this._getWindow(),
      this._getTabBrowser(),
      event.tabIndex,
      event.groupID
    );
    this.refreshUi();
  },

  _getWindow: function() {
    return WindowUtils.getMostRecentBrowserWindow();
  },

  _getTabBrowser: function() {
    return TabsUtils.getTabBrowser(this._getWindow());
  }
};

new TabGroups();
