import {
  commands,
  ExtensionContext,
  window,
} from "vscode";
import {
  LanguageClientOptions,
  RevealOutputChannelOn,
  LanguageClient,
} from "vscode-languageclient";
import { prepareExecutable } from "./lemMinxStarter";
  import * as requirements from "./requirements";

let languageClient: LanguageClient;

export function activate(context: ExtensionContext) {
	return requirements
    .resolveRequirements(context)
    .catch((error) => {
      window.showErrorMessage(error.message, error.label).then((selection) => {
        if (error.label && error.label === selection && error.openUrl) {
          commands.executeCommand("vscode.open", error.openUrl);
        }
      });
      throw error;
    })
    .then((requirements) => {
      let clientOptions: LanguageClientOptions = {
        documentSelector: [
          { scheme: "file", language: "xml", pattern: "**/*.east.xml" },
          { scheme: "untitled", language: "xml", pattern: "**/*.east.xml" },
        ],
        revealOutputChannelOn: RevealOutputChannelOn.Never,
        initializationOptions: {
          settings: {
            xml: {
              fileAssociations: [
                {
                  pattern: "**/*.east.xml",
                  systemId: "east.xsd",
                },
              ],
            },
          },
          extendedClientCapabilities: {
            codeLens: {
              codeLensKind: {
                valueSet: ["references"],
              },
            },
            actionableNotificationSupport: true,
            openSettingsCommandSupport: true,
          },
        },
      };

      let serverOptions = prepareExecutable(requirements);
      languageClient = new LanguageClient(
        "east",
        "East Support",
        serverOptions,
        clientOptions
      );
      let toDispose = context.subscriptions;
      let disposable = languageClient.start();
      toDispose.push(disposable);
	});
}

export function deactivate() {}