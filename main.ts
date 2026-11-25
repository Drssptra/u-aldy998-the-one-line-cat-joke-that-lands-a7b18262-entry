// One-line cat joke entry generator.
//
// The joke is assembled from ordered fragments, validated against the
// competition gates (1-200 chars, exactly one line, non-blank), then
// written byte-exactly to entry.txt under MAKEFUN_OUTPUT_DIR with no
// trailing newline. Node 22, stdlib only, no network, deterministic.
const fs = require("node:fs");
const path = require("node:path");

const FRAGMENTS = [
  "My cat pushed my phone",
  "off the table,",
  "then glared at me",
  "like I'd dropped it.",
];

function buildEntry(fragments) {
  return fragments.join(" ");
}

function validateEntry(text) {
  const problems = [];
  if (typeof text !== "string") problems.push("not a string");
  if (text.length < 1 || text.length > 200) {
    problems.push(`length ${text.length} outside 1-200`);
  }
  if (/[\r\n]/.test(text)) problems.push("must be a single line");
  if (text.trim().length === 0) problems.push("must not be blank");
  if (problems.length > 0) {
    throw new Error(`Entry failed validation: ${problems.join("; ")}`);
  }
  return text;
}

function resolveOutputDir() {
  const raw = process.env.MAKEFUN_OUTPUT_DIR;
  if (raw !== undefined && raw.trim() !== "") return path.resolve(raw);
  return path.resolve(process.cwd(), "output");
}

function main() {
  const entry = validateEntry(buildEntry(FRAGMENTS));
  const outDir = resolveOutputDir();
  fs.mkdirSync(outDir, { recursive: true });
  const target = path.join(outDir, "entry.txt");
  fs.writeFileSync(target, entry, { encoding: "utf8", flag: "w" });
  // Post-write check: the file on disk must be byte-exactly the entry,
  // with no trailing newline added by the write.
  const written = fs.readFileSync(target, "utf8");
  if (written !== entry) {
    throw new Error("entry.txt on disk does not match the entry text");
  }
  process.stdout.write(entry + "\n");
  return entry;
}

main();
