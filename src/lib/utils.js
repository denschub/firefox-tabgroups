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

/**
 * Used to switch stuff by the current design.
 *
 * @param {Object} object - object with .light and .dark
 * @returns {Object} input.dark if a dark theme is used, .light otherwise
 */
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
