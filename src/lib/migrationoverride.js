const { Cu } = require("chrome");

/**
 * This overrides the TabView migration as added in Bug 1221050 with a
 * migration that basically does nothing. Since our addon is compatible with
 * the original data, there is nothing we have to do here.
 *
 * This will get removed some time in the future.
 */
const DummyMigration = {
  migrate: function() {
    // I'm a happy little migration
    // and I'm doing nothing.
  }
};

exports.MigrationOverride = function() {
  try {
    let migrator = Cu.import("resource:///modules/TabGroupsMigrator.jsm", {});
    migrator.TabGroupsMigrator = DummyMigration;
  } catch (e) {
    return;
  }
};
