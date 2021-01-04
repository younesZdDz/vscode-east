import { Uri, ExtensionContext } from "vscode";
import * as cp from "child_process";
import * as path from "path";

const pathExists = require("path-exists");
const expandHomeDir = require("expand-home-dir");
const findJavaHome = require("find-java-home");

const isWindows = process.platform.indexOf("win") === 0;
const JAVA_FILENAME = "java" + (isWindows ? ".exe" : "");

export interface RequirementsData {
  java_home: string;
  java_version: number;
}

export async function resolveRequirements(
  context: ExtensionContext
): Promise<RequirementsData> {
  const javaHome = await checkJava(context);
  const javaVersion = await checkJavaVersion(javaHome);
  return Promise.resolve({ java_home: javaHome, java_version: javaVersion });
}

function checkJava(context: ExtensionContext): Promise<string> {
  return new Promise(async (resolve, reject) => {
    let javaHome = process.env["JAVA_HOME"];
    let source = "The JAVA_HOME environment variable";

    if (javaHome) {
      javaHome = expandHomeDir(javaHome);
      if (!pathExists.sync(javaHome)) {
        openJDKDownload(reject, source + " points to a missing folder");
      } else if (
        !pathExists.sync(path.resolve(javaHome, "bin", JAVA_FILENAME))
      ) {
        openJDKDownload(reject, source + " does not point to a Java runtime.");
      }
      return resolve(javaHome);
    }

    findJavaHome({ allowJre: true }, function (err, home) {
      if (err) {
        openJDKDownload(reject, "Java runtime could not be located.");
      } else {
        resolve(home);
      }
    });
  });
}

function checkJavaVersion(java_home: string): Promise<number> {
  return new Promise((resolve, reject) => {
    cp.execFile(
      java_home + "/bin/java",
      ["-version"],
      {},
      (error, stdout, stderr) => {
        let javaVersion = parseMajorVersion(stderr);
        if (javaVersion < 8) {
          openJDKDownload(
            reject,
            "Java 8 or more recent is required to run. Please download and install a recent Java runtime."
          );
        } else {
          resolve(javaVersion);
        }
      }
    );
  });
}

export function parseMajorVersion(content: string): number {
  let regexp = /version "(.*)"/g;
  let match = regexp.exec(content);
  if (!match) {
    return 0;
  }
  let version = match[1];
  //Ignore '1.' prefix for legacy Java versions
  if (version.startsWith("1.")) {
    version = version.substring(2);
  }

  //look into the interesting bits now
  regexp = /\d+/g;
  match = regexp.exec(version);
  let javaVersion = 0;
  if (match) {
    javaVersion = parseInt(match[0]);
  }
  return javaVersion;
}

function openJDKDownload(reject, cause: string) {
  let jdkUrl =
    "https://developers.redhat.com/products/openjdk/download/?sc_cid=701f2000000RWTnAAO";
  if (process.platform === "darwin") {
    jdkUrl = "https://adoptopenjdk.net/releases.html";
  }
  reject({
    message: cause,
    label: "Get the Java runtime",
    openUrl: Uri.parse(jdkUrl),
    replaceClose: false,
  });
}
