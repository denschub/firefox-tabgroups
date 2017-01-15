const _ = require("sdk/l10n").get;
const PrefService = require("sdk/preferences/service");

/**
 * Returns an object of translated strings for the use in the frontend.
 *
 * @param {Array} keys - l10n keys
 * @returns {Object}
 */
exports.getL10nStrings = function(keys) {
  let returnStrings = {};

  for (let key of keys) {
    returnStrings[key] = _(key);
  }

  return returnStrings;
};

function isDarkTheme() {
  let currentTheme = PrefService.get("lightweightThemes.selectedThemeID");
  switch (currentTheme) {
    case "firefox-compact-dark@mozilla.org":
      return true;
    case "firefox-devedition@mozilla.org":
      let devtoolsTheme = PrefService.get("devtools.theme");
      return devtoolsTheme == "dark";
    default:
      return false;
  }
}

/**
 * Used to switch stuff by the current design.
 *
 * @param {Object} object - object with .light and .dark
 * @returns {Object} input.dark if a dark theme is used, .light otherwise
 */
exports.themeSwitch = function(object) {
  return isDarkTheme() ? object.dark : object.light;
};
