const execSync = require("child_process").execSync;

const exec = (command, extraEnv) =>
  execSync(command, {
    stdio: "inherit",
    env: Object.assign({}, process.env, extraEnv),
  });

console.log("\nBuilding ES modules ...");
exec("babel src -d dist/es --ignore *.test.js", {
  BABEL_ENV: "es",
});

console.log("Building CommonJS modules ...");
exec("babel src -d dist --ignore *.test.js", {
  BABEL_ENV: "cjs",
});
