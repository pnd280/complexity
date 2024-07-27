import chalk from "chalk";
import { exec } from "child_process";
import { HmrContext, Plugin } from "vite";

const pluginName = "vite-plugin-run-command-on-demand";

const log = (message: string) =>
  console.log(chalk.blue(`\n[${pluginName}]`), chalk.green(message));
const logError = (message: string) =>
  console.error(chalk.blue(`\n[${pluginName}]`), chalk.red(message));

const runCommand = (command: string): Promise<void> =>
  new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        logError(`Error executing command: ${command}\n${stderr}`);
        reject(error);
      } else {
        log(`Command executed successfully: ${command}\n${stdout}`);
        resolve();
      }
    });
  });

type CustomCommandsPluginOptions = {
  beforeServerStart?: string;
  afterServerStart?: string;
  onHotUpdate?: string;
  beforeBuild?: string;
  afterBuild?: string;
  closeBundle?: string;
};

const executeCommand = async (
  command: string | undefined,
  errorMessage: string,
) => {
  if (command) {
    try {
      await runCommand(command);
    } catch {
      logError(errorMessage);
    }
  }
};

export default function customCommandsPlugin(
  options: CustomCommandsPluginOptions = {},
): Plugin {
  return {
    name: pluginName,
    configureServer(server) {
      server.httpServer?.once("listening", async () => {
        await executeCommand(
          options.beforeServerStart,
          `Error running beforeServerStart command: ${options.beforeServerStart}`,
        );
        await executeCommand(
          options.afterServerStart,
          `Error running afterServerStart command: ${options.afterServerStart}`,
        );
      });
    },

    async handleHotUpdate(ctx: HmrContext) {
      const isPageReload = ctx.modules.some(
        (module) => !module.isSelfAccepting,
      );
      if (!isPageReload) {
        await executeCommand(
          options.onHotUpdate,
          `Error running onHotUpdate command: ${options.onHotUpdate}`,
        );
      }
      return ctx.modules;
    },

    async buildStart() {
      await executeCommand(
        options.beforeBuild,
        `Error running beforeBuild command: ${options.beforeBuild}`,
      );
    },

    async buildEnd() {
      await executeCommand(
        options.afterBuild,
        `Error running afterBuild command: ${options.afterBuild}`,
      );
    },

    async closeBundle() {
      await executeCommand(
        options.closeBundle,
        `Error running closeBundle command: ${options.closeBundle}`,
      );
    },
  };
}
