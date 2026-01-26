const babel = require("@babel/core");
const parser = require("@babel/parser");
const fs = require("fs");
const path = require("path");
const glob = require("glob");

const DEFAULT_COMPILER_OPTIONS = {
  noEmit: true,
  compilationMode: "all",
  panicThreshold: "none",
  environment: {
    enableTreatRefLikeIdentifiersAsRefs: true,
  },
};

const IGNORED_ERROR_REASONS = [
  "(BuildHIR::lowerExpression) Handle Import expressions",
];

const results = {
  successful: [],
  failed: [],
  skipped: [],
  total: 0,
};

console.log("🔍 Starting Enhanced React Compiler scan...");

// Import the babel plugin
try {
  var BabelPluginReactCompiler = require("babel-plugin-react-compiler");
  console.log("✅ Successfully loaded babel-plugin-react-compiler");
} catch (error) {
  console.error(
    "❌ Failed to load babel-plugin-react-compiler:",
    error.message,
  );
  process.exit(1);
}

// Find all React files
console.log("📁 Searching for React files...");
const files = glob.sync("src/{components,entrypoints,hooks,plugins}/**/*.{ts,tsx}");
console.log(`Found ${files.length} files total`);

// Ensure compiled directory exists
// const compiledDir = path.join(__dirname, "compiled");
// if (!fs.existsSync(compiledDir)) {
//   fs.mkdirSync(compiledDir, { recursive: true });
//   console.log(`📂 Created compiled directory: ${compiledDir}`);
// }

files.forEach((file, index) => {
  console.log(`\n📄 Processing file ${index + 1}/${files.length}: ${file}`);

  try {
    const sourceCode = fs.readFileSync(file, "utf8");
    console.log(`   📊 File size: ${sourceCode.length} characters`);

    if (sourceCode.length === 0) {
      console.log(`   ⚠️ Empty file, skipping`);
      return;
    }

    const successfulCompilations = [];
    const failedCompilations = [];
    const skippedCompilations = [];

    const logger = {
      logEvent(filename, rawEvent) {
        const event = { ...rawEvent, filename };

        // Check if error reason should be ignored
        const shouldIgnore = IGNORED_ERROR_REASONS.includes(
          event.detail?.reason,
        );

        switch (event.kind) {
          case "CompileSuccess":
            successfulCompilations.push(event);
            break;
          case "CompileError":
          case "CompileDiagnostic":
          case "PipelineError":
            if (!shouldIgnore) {
              failedCompilations.push(event);
            } else {
              skippedCompilations.push(event);
            }
            break;
          default:
            skippedCompilations.push(event);
            break;
        }
      },
    };

    const compilerOptions = {
      ...DEFAULT_COMPILER_OPTIONS,
      logger,
    };

    // Parse the AST
    console.log(`   🔍 Parsing AST...`);
    const ast = parser.parse(sourceCode, {
      sourceFilename: file,
      plugins: ["typescript", "jsx"],
      sourceType: "module",
    });
    console.log(`   ✅ AST parsed successfully`);

    // Transform with React compiler
    console.log(`   ⚙️ Running React compiler...`);
    const result = babel.transformFromAstSync(ast, sourceCode, {
      filename: file,
      highlightCode: false,
      retainLines: true,
      plugins: [[BabelPluginReactCompiler, compilerOptions]],
      sourceType: "module",
      configFile: false,
      babelrc: false,
    });

    if (!result?.code) {
      throw new Error("Compilation produced no output");
    }

    console.log(`   ✅ Compilation completed`);
    console.log(
      `   📊 Results: ${successfulCompilations.length} successful, ${failedCompilations.length} failed, ${skippedCompilations.length} skipped`,
    );

    // Save compiled output
    // const relativePath = path.relative("src", file);
    // const outputPath = path.join(compiledDir, relativePath);
    // const outputDir = path.dirname(outputPath);

    // if (!fs.existsSync(outputDir)) {
    //   fs.mkdirSync(outputDir, { recursive: true });
    // }

    // fs.writeFileSync(outputPath, result.code);
    // console.log(`   💾 Saved compiled output to: ${outputPath}`);

    // Log detailed results
    if (successfulCompilations.length > 0) {
      console.log(`   🎯 Successful compilations:`);
      successfulCompilations.forEach((event) => {
        console.log(
          `      - ${event.fnName || "anonymous"} at line ${event.fnLoc.start.line}`,
        );
      });
    }

    if (failedCompilations.length > 0) {
      console.log(`   ❌ Failed compilations:`);
      failedCompilations.forEach((event) => {
        console.log(
          `      - ${event.fnName || "anonymous"}: ${event.detail?.reason || "Unknown error"}`,
        );
        if (event.detail?.suggestions?.length > 0) {
          console.log(
            `        Suggestions: ${event.detail.suggestions.join(", ")}`,
          );
        }
      });
    }

    // Update results
    results.total++;
    if (successfulCompilations.length > 0) {
      results.successful.push({
        file,
        components: successfulCompilations,
      });
    }
    if (failedCompilations.length > 0) {
      results.failed.push({
        file,
        components: failedCompilations,
      });
    }
    if (skippedCompilations.length > 0) {
      results.skipped.push({
        file,
        components: skippedCompilations,
      });
    }
  } catch (error) {
    console.error(`   ❌ Error processing file: ${error.message}`);
    console.error(`   🔍 Error stack: ${error.stack}`);
    results.failed.push({ file, error: error.message });
  }
});

// Final report
console.log("\n" + "=".repeat(60));
console.log("📊 ENHANCED COMPILER REPORT");
console.log("=".repeat(60));
console.log(`Processed ${results.total} files`);
console.log(`✅ Successful: ${results.successful.length}`);
console.log(`❌ Failed: ${results.failed.length}`);
console.log(`⏭️ Skipped: ${results.skipped.length}`);

// Detailed breakdown
if (results.successful.length > 0) {
  console.log("\n🎯 Successfully compiled components:");
  results.successful.forEach((item) => {
    console.log(`  ${item.file}`);
    item.components.forEach((event) => {
      console.log(
        `    - ${event.fnName || "anonymous"} (line ${event.fnLoc.start.line})`,
      );
    });
  });
}

if (results.failed.length > 0) {
  console.log("\n❌ Failed compilations:");
  results.failed.forEach((item) => {
    if (item.error) {
      console.log(`  ${item.file}: ERROR - ${item.error}`);
    } else {
      console.log(`  ${item.file}`);
      item.components.forEach((event) => {
        console.log(
          `    - ${event.fnName || "anonymous"}: ${event.detail?.reason}`,
        );
      });
    }
  });
}

// Save detailed JSON report (failures only - file paths only)
const failuresReport = {
  total: results.total,
  failed: results.failed.map((item) => ({
    file: item.file.replace(/\\/g, "/"),
  })),
};
const reportPath = path.join(__dirname, "react-compiler-scan.json");
fs.writeFileSync(reportPath, JSON.stringify(failuresReport, null, 2));
console.log(`\n💾 Detailed report saved to: ${reportPath}`);
console.log("✅ Enhanced compilation completed!");
