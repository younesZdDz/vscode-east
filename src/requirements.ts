import { Uri, ExtensionContext } from "vscode";
import * as path from "path";

const pathExists = require("path-exists");
const expandHomeDir = require("expand-home-dir");
const findJavaHome = require("find-java-home");

const isWindows = process.platform.indexOf("win") === 0;
const JAVA_FILENAME = "java" + (isWindows ? ".exe" : "");

export interface RequirementsData {
  java_home: string;
}

export async function resolveRequirements(
  context: ExtensionContext
): Promise<RequirementsData> {
  const javaHome = await checkJava(context);
  return Promise.resolve({ java_home: javaHome });
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
