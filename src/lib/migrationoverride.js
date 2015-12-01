const { Cu } = require("chrome");

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
