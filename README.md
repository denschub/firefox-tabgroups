Simplified Tab Groups for Firefox
=================================

This project aims to provide a simple add-on to replace some functionalities
from TabView/Tab Groups/Panorama which were removed from Firefox due to a lot
of open bugs and a very low overall usage.

As this add-on is built to replace the features removed from the Firefox core,
it is supported in Firefox 45 or later. It may work in older versions, but be
careful.

Installation
------------

The add-on is available at [addons.mozilla.org][amo] and should be installed
there to ensure the add-on stays updated.

Compatibility with old Tab Groups/Panorama
------------------------------------------

This extension was built to replace the functionalities, not to work together
with it. While this project is able to read the data created by the old
built-in functionalities, groups managed by this extension will not work in
panorama. That is, mainly, because Panorama requires additional data (like the
groups position and size on the virtual board) which we do not save.

*Please do not open Panorama* if you use this extension and Panorama is not yet
removed from Firefox. If you have opened Panorama, you have to restart your
browser to make this add-on work again since Panorama registers some event
listeners that conflict with our code. Unfortunately, this also seems to happen
after some minutes/hours of using Firefox without opening Panorama. There is
nothing this project can do against it registering its event handlers so it's
probably best to wait for Panoramas removal...

Warning
-------

Please note that this extension is currently in a very unstable and untested
state and may kill your tabs or small kittens. While it may get improved and
secured in the future, I strongly advise you to make a backup of your important
tabs...

Building
--------

Assuming you have Node.js installed on your machine, building this project is
rather easy.

1. Install the dependencies: `npm install`.
2. Run `./node_modules/.bin/jake build` to build all source files into the
   `dist/` directory or run `./node_modules/.bin/jake run` to build the add-on
   and start a Firefox instance for testing.

`jake run` uses `jpm` and you can pass additional parameters to it by setting
an environment variable, for example: `JPM_PARAMS="-b nightly" jake run`

Contributing
------------

Feel free to [fix some open issues][issues] and submit a pull request. Please
make sure to file the pull request against the `develop` branch, which should
be the default. Please make sure your code passes the coding styleguides by
running `jake lint` before submitting the PR.

If you want to help translating this add-on, feel free to alter or add new
files in `src/locale`. The extensions name and descriptions have to be changed
in `src/install.rdf`.

License
-------

MIT.

[amo]: https://addons.mozilla.org/en-US/firefox/addon/tab-groups/
[issues]: https://github.com/denschub/firefox-tabgroups/issues
