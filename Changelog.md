# 0.3.0

# 0.2.1

* Don't try to set the groups active tab if an app tab is active. (Issue [#27](https://github.com/denschub/firefox-tabgroups/issues/27))

# 0.2.0

## Features

* Added a migration override so tab groups won't be migrated away.
* Added compatiblity with Quicksavers Tab Groups add-on.
* Added keyboard shortcuts to switch between groups. (PR [#23](https://github.com/denschub/firefox-tabgroups/pull/23))
* Added option for alphabetic tab group sorting. (PR [#24](https://github.com/denschub/firefox-tabgroups/pull/24))

## Refactorings

* `minVersion` is now set to 44 so people have a chance to install the addon before the migration kicks in.
* `Tab Groups` was renamed to `Simplified Tab Groups` to avoid confusion and conflicts with other add-ons.
* Simpilified development by adding `jake` and some basic scripts.

# 0.1.1

This was the first public release.
