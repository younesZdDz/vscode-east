import { Executable, ExecutableOptions } from "vscode-languageclient";
import { RequirementsData } from "./requirements";
import * as path from "path";

const glob = require("glob");

export function prepareExecutable(requirements: RequirementsData): Executable {
  let executable: Executable = Object.create(null);
  let options: ExecutableOptions = Object.create(null);
  options.env = process.env;
  options.stdio = "pipe";
  executable.options = options;
  executable.command = path.resolve(requirements.java_home + "/bin/java");
  executable.args = prepareParams();
  return executable;
}

function prepareParams(): string[] {
  let params: string[] = [];

  let server_home: string = path.resolve(__dirname, "../server");
  let launchersFound: Array<string> = glob.sync(
    "**/org.eclipse.lemminx*-uber.jar",
    { cwd: server_home }
  );
  if (launchersFound.length) {
    params.push("-cp");
    params.push(
      path.resolve(server_home, launchersFound[0])
    );
    params.push("org.eclipse.lemminx.XMLServerLauncher");
  } else {
    return null;
  }
  return params;
}
