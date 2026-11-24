// Prints one original cat joke to stdout and writes it to entry.txt
// inside the directory named by MAKEFUN_OUTPUT_DIR (or ./output).
const { mkdirSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");

const joke =
  "My cat walked across my keyboard during a job interview, so now we both work from home.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "./output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), joke + "\n", "utf8");
console.log(joke);
