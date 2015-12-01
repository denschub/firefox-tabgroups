const { Cu } = require("chrome");

const DummyMigrator = {
  migrate: function() {
    // I'm a happy little migrator
    // and I'm doing nothing.
  }
};

exports.MigrationOverride = function() {
  try {
    let migrator = Cu.import("resource:///modules/TabGroupsMigrator.jsm", {});
    migrator.TabGroupsMigrator = DummyMigrator;
  } catch (e) {
    return;
  }
};
