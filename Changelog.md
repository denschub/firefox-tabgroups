# 0.6.0

# 0.5.1

Set `multiprocessCompatible` to `true`!

# 0.5.0

## Bug fixes

* Use the inverted toolbar icon if needed on high resolutions.

## Refactorings

* Use the default favicon instead of no favicon at all. (PR [35](https://github.com/denschub/firefox-tabgroups/pull/35))
* Removed the Panorama migration to avoid breakage in Firefox 52

# 0.4.0

## Features

* You can now drag and drop tabs in the panel to move them between groups. Dragging a tab onto the "Create new group" button will create a new group with that tab. (PR [32](https://github.com/denschub/firefox-tabgroups/pull/32))

# 0.3.0

## Bug fixes

* Clicking the input field while renaming will no longer select the group. (PR [28](https://github.com/denschub/firefox-tabgroups/pull/28))
* Use `label` instead of `visibleLabel` since the latter was removed in bug 1247920.

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
