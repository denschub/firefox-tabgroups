Tab Groups for Firefox
======================

This project aims to provide a simple add-on to replace some functionalities
from TabView/Tab Groups/Panorama which were removed from Firefox due to a lot
of open bugs and a very low overall usage.

As this add-on is built to replace the features removed from the Firefox core,
it is supported in Firefox 45 or later. It may work in older versions, but be
careful.

Compatibility with old Tab Groups/Panorama
------------------------------------------

This extension was built to replace the functionalities, not to work together
with it. While this project is able to read the data created by the old
built-in functionalities, groups managed by this extension will not work in
panorama. That is, mainly, because Panorama requires additional data (like the
groups position and size on the virtual board) which we do not save.

Thus, *please do not open Panorama* if you use this extension and Panorama is
not yet removed from Firefox. If you have opened Panorama, you have to restart
your browser to make this addon work again since Panorama registers some event
listeners that conflict with our code.

Warning
-------

Please note that this extension is currently in a very unstable and untested
state and may kill your tabs or small kittens. While it may get improved and
secured in the future, I strongly advise you to make a backup of your important
tabs...
