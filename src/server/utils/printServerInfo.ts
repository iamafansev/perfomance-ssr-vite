import { ViteDevServer } from "vite";
import chalk from "chalk";
import { performance } from "perf_hooks";

export const printServerInfo = ({
  viteServer,
  port,
}: {
  viteServer: ViteDevServer;
  port: number;
}) => {
  const { info } = viteServer.config.logger;

  let ssrReadyMessage = "\n -- SSR mode";

  info(chalk.green(`dev server running at:\n`), {
    clear: !viteServer.config.logger.hasWarned,
  });

  info(`http://${viteServer.config.server.host}:${port}`);

  if (globalThis.ssrStartTime) {
    ssrReadyMessage += chalk.cyan(
      ` ready in ${Math.round(performance.now() - globalThis.ssrStartTime)}ms.`
    );
  }

  info(ssrReadyMessage.concat("\n"));
};
