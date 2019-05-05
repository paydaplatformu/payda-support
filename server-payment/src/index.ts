// tslint:disable-next-line: no-var-requires
require("source-map-support").install({
  hookRequire: true
});

import { createServer } from "./server";

createServer();
