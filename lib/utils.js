const _ = require("sdk/l10n").get;

exports.getL10nStrings = function(keys) {
  let returnStrings = {};

  for (let key of keys) {
    returnStrings[key] = _(key);
  }

  return returnStrings;
};
