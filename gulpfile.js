import { createRequire } from "module";
import gulp from "gulp";
import gulpZip from "gulp-zip";

function zip() {
  const require = createRequire(import.meta.url);
  const manifest = require("./build/manifest.json");
  const zipFileName = `${manifest.name.replaceAll(" ", "-")}-${manifest.version}.zip`;

  return gulp
    .src("build/**")
    .pipe(gulpZip(zipFileName))
    .pipe(gulp.dest("package"));
}

export { zip };
