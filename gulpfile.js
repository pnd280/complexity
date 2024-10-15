import { createRequire } from "module";
import gulp from "gulp";
import gulpZip from "gulp-zip";
import fs from "fs";
import { glob } from "glob";
import * as path from "path";

function removeUnwantedFiles(cb) {
  const filesToRemove = [
    "dist/**/tailwind*.js",
    "dist/**/postcss*.js",
    "dist/gulpfile.js",
  ];

  filesToRemove.forEach((pattern) => {
    const files = glob.sync(pattern);
    files.forEach((file) => {
      try {
        fs.unlinkSync(file);
      } catch (err) {
        console.error(`Error deleting ${file}: ${err}`);
      }
    });
  });

  cb();
}

function zip() {
  const require = createRequire(import.meta.url);
  const manifest = require("./package.json");
  const zipFileName = `${manifest.name.replaceAll(" ", "-")}-${manifest.version}-${process.env.TARGET_BROWSER}.zip`;

  return gulp
    .src("dist/**")
    .pipe(gulpZip(zipFileName))
    .pipe(gulp.dest("package"));
}

function forceDisableUseDynamicUrl(done) {
  const manifestPath = "./dist/manifest.json";

  if (!fs.existsSync(manifestPath)) {
    console.warn(
      "Manifest file not found. Skipping forceDisableUseDynamicUrl.",
    );
    return done();
  }

  try {
    const require = createRequire(import.meta.url);
    const manifest = require(manifestPath);

    manifest.web_accessible_resources.forEach((resource) => {
      delete resource.use_dynamic_url;
    });

    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  } catch (error) {
    console.error("Error processing manifest:", error);
  }

  done();
}

const createPackage = gulp.series(removeUnwantedFiles, zip);

function rootifyOptionsPageHTMLEntries(done) {
  const manifestPath = "./dist/manifest.json";

  if (!fs.existsSync(manifestPath)) {
    console.warn("Manifest file not found. Skipping rootifyOptionsPageHTMLEntries.");
    return done();
  }

  const htmlFiles = glob.sync("dist/**/*.html");
  htmlFiles.forEach((file) => {
    // Move the file into the root of the dist folder
    const fileName = path.basename(file);
    const destPath = path.join("dist", fileName);

    fs.renameSync(file, destPath);
    console.log(`Moved ${file} to ${destPath}`);

    // Update paths in the HTML file
    const htmlContent = fs.readFileSync(destPath, "utf8");
    const updatedHtmlContent = htmlContent.replace(
      /(\.\.\/)+(\w+)\//g,
      "$2/",
    );
    fs.writeFileSync(destPath, updatedHtmlContent);

    // Remove empty directories
    let currentDir = path.dirname(file);
    while (currentDir !== "dist") {
      if (fs.readdirSync(currentDir).length === 0) {
        fs.rmdirSync(currentDir);
        console.log(`Removed empty directory: ${currentDir}`);
        currentDir = path.dirname(currentDir);
      } else {
        break;
      }
    }

    // Reflect new file locations
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

      if (manifest.options_ui && manifest.options_ui.page) {
        manifest.options_ui.page = path.basename(manifest.options_ui.page);
      }

      if (manifest.options_page) {
        manifest.options_page = path.basename(manifest.options_page);
      }

      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      console.log("Updated manifest.json with new file locations");
    } catch (error) {
      console.error("Error updating manifest.json:", error);
    }
  });

  done();
}

export { createPackage, forceDisableUseDynamicUrl, rootifyOptionsPageHTMLEntries };
