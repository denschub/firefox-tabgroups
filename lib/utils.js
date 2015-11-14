const _ = require("sdk/l10n").get;
const PrefService = require("sdk/preferences/service");

exports.getL10nStrings = function(keys) {
  let returnStrings = {};

  for (let key of keys) {
    returnStrings[key] = _(key);
  }

  return returnStrings;
};

exports.themeSwitch = function(object) {
  let currentTheme = PrefService.get("lightweightThemes.selectedThemeID");
  let devtoolsTheme = PrefService.get("devtools.theme");

  let retValue = object.light;
  if (
    currentTheme == "firefox-devedition@mozilla.org"
    && devtoolsTheme == "dark"
  ) {
    retValue = object.dark;
  }

  return retValue;
};
