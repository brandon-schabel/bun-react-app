import { BUILD_DIR, JS_ENTRY_FILE, PUBLIC_DIR } from "./config";
import { createPageBuilder as htmlPageBuilder } from "./server/create-page-builder";
import { buildBundle, serveFromDir } from "./server/bundler";

const server = Bun.serve({
  async fetch(request, server) {
    // Bundle the files on each request
    const { filePaths } = await buildBundle();

    const cssFiles = filePaths.cssFiles;

    const pageBuilder = htmlPageBuilder({
      buildDir: BUILD_DIR,
      paths: {
        scriptPaths: [JS_ENTRY_FILE],
        stylePaths: cssFiles,
      },
    });

    // build HTML file to public
    await pageBuilder.generateHtmlFile({
      directory: PUBLIC_DIR,
    });

    let reqPath = new URL(request.url).pathname;

    console.log(request.method, reqPath);

    if (reqPath === "/") reqPath = "/index.html";

    // check public
    const publicResponse = serveFromDir({
      directory: PUBLIC_DIR,
      reqPath,
    });
    
    if (publicResponse) return publicResponse;

    // check /.build
    const buildResponse = serveFromDir({ directory: BUILD_DIR, reqPath });
    if (buildResponse) return buildResponse;

    // // Upgrade the request to a WebSocket
    // if (server.upgrade(request)) {
    //   return; // do not return a Response
    // }

    return new Response("File not found", {
      status: 404,
    });
  },

  // websocket: {
  //   open(ws) {
  //     webSocketClients.add(ws);
  //   },
  //   close(ws) {
  //     webSocketClients.delete(ws);
  //   },
  //   message(ws, message) {
  //     console.log({ message, ws });
  //   },
  // },
});

console.log(`Listening on http://localhost:${server.port}`);
