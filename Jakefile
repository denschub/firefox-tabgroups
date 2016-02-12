/* global desc, task, jake, complete */
/* vim: set fdl=0: */
"use strict";

const SRC_DIR = "./src";
const DIST_DIR = "./dist";

desc("Builds the source");
task("build", ["cleanup"], () => {
  jake.cpR(SRC_DIR, DIST_DIR);
});

desc("Removes all build-related files");
task("cleanup", () => {
  jake.rmRf(DIST_DIR);
});

desc("runs wslint on the built source");
task("lint", ["build"], {async: true}, () => {
  jake.exec([`cd ${DIST_DIR}; eslint .`], {
    interactive: true
  }, complete);
});

desc("Builds the source and starts a test installation. You can specify jpm parameters with 'JPM_PARAMS=\"...\" jake run'");
task("run", ["build"], {async: true}, () => {
  jake.exec([`cd ${DIST_DIR}; jpm run ${process.env.JPM_PARAMS}`], {
    interactive: true
  }, complete);
});

desc("Builds the source and generates a XPI");
task("xpi", ["build"], {async: true}, () => {
  jake.exec([
    `cd ${DIST_DIR}; jpm xpi`,
    `cd ${DIST_DIR}; find . -not -name "*.xpi" -delete`
  ], {printStderr: true}, () => {
    console.log(`.xpi was created in ${DIST_DIR}`);
    complete();
  });
});
