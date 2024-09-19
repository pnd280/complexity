import { createRequire } from "module";
import gulp from "gulp";
import gulpZip from "gulp-zip";
import fs from "fs";

function zip() {
  const require = createRequire(import.meta.url);
  const manifest = require("./package.json");
  const zipFileName = `${manifest.name.replaceAll(" ", "-")}-${manifest.version}.zip`;

  return gulp
    .src("build/**")
    .pipe(gulpZip(zipFileName))
    .pipe(gulp.dest("package"));
}

// Temp fix for CSP on Chrome 130
// Manually remove them because there is no option to disable use_dynamic_url on @crxjs/vite-plugin
function forceDisableUseDynamicUrl(done) {
  const require = createRequire(import.meta.url);
  const manifest = require("./build/manifest.json");

  manifest.web_accessible_resources.forEach((resource) => {
    delete resource.use_dynamic_url;
  });

  if (!fs.existsSync("./build/manifest.json")) {
    return done();
  }

  fs.writeFileSync("./build/manifest.json", JSON.stringify(manifest, null, 2));

  done();
}

export { zip, forceDisableUseDynamicUrl };
