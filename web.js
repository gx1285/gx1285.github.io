const html = require("html");
const markdown = require("markdown").markdown;
const fs = require("node:fs");
const path = require("node:path");
const { exec, execSync } = require("node:child_process");
const paths = path.join(__dirname + "/blog/file");
execSync("npx rimraf build");
fs.mkdir(path.join(__dirname + "/build"), function (err) {});
fs.mkdir(path.join(__dirname + "/build/blog"), function (err) {});
// ファイル名の一覧
const paths2 = path.join(__dirname + "/web");

const filenames2 = fs.readdirSync(paths2);
const filenames = fs.readdirSync(paths);
for (const File_Name of filenames2) {
  const data = fs.readFileSync(`${paths2}/${File_Name}`);
  fs.writeFile(`build/${File_Name}`, data, function (err) {
    if (err) {
      console.warn(err);
    }
  });
}
for (const FileName of filenames) {
  const data = fs.readFileSync(`${paths}/${FileName}`, "utf-8");
  const d = markdown.toHTML(data);

  const data_config = fs.readFileSync(
    `${path.join(__dirname + "/blog/config")}/${FileName.replace(
      ".md",
      ""
    )}.json`,
    "utf-8"
  );
  const config = JSON.parse(data_config);
  const add_html = `<title>${config.title}</title>`;
  const output = html
    .prettyPrint(add_html + d)
    .replaceAll("&lt;br&gt;", "<br>");
  fs.writeFile(`build/blog/${config.slug}.html`, output, function (err) {
    if (err) {
      console.warn(err);
    }
  });
}
