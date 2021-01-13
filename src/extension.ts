import {
  commands,
  ExtensionContext,
  window,
  Disposable,
  workspace,
} from "vscode";
import {
  LanguageClientOptions,
  RevealOutputChannelOn,
  LanguageClient,
  TextDocumentIdentifier,
  CancellationToken,
  ExecuteCommandParams,
  ExecuteCommandRequest,
} from "vscode-languageclient";
import * as fs from "fs";
import * as path from "path";
import { xmlParse, xsltProcess } from "xslt-processor";
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
      return languageClient.onReady().then(() => {
        const disposable: Disposable = commands.registerCommand(
          "east.runXSLTTransform",
          async (): Promise<any> => {
            const xml: string = window.activeTextEditor.document.getText();
            const xslt: string = fs
              .readFileSync(workspace.rootPath + path.sep + "east.xslt")
              .toString();
            try {
              const rXml = xmlParse(xml);
              const rXslt = xmlParse(xslt);
              const result = xsltProcess(rXml, rXslt);

              // window.showTextDocument(textDoc, ViewColumn.Beside);

              fs.writeFile(
                workspace.rootPath + path.sep + "east.html",
                result,
                function (err) {
                  if (err) {
                    window.showErrorMessage("Error creating html file");
                  }
                }
              );
              workspace
                .openTextDocument(workspace.rootPath + path.sep + "east.html")
                .then((doc) => {
                  window.showTextDocument(doc);
                });
            } catch (e) {
              window.showErrorMessage(e);
            }
          }
        );
        context.subscriptions.push(
          commands.registerCommand(
            "east.workspace.executeCommand",
            (command, ...rest) => {
              let token: CancellationToken;
              let commandArgs: any[] = rest;
              if (
                rest &&
                rest.length &&
                CancellationToken.is(rest[rest.length - 1])
              ) {
                token = rest[rest.length - 1];
                commandArgs = rest.slice(0, rest.length - 1);
              }
              const params: ExecuteCommandParams = {
                command,
                arguments: commandArgs,
              };
              if (token) {
                return languageClient.sendRequest(
                  ExecuteCommandRequest.type,
                  params,
                  token
                );
              } else {
                return languageClient.sendRequest(
                  ExecuteCommandRequest.type,
                  params
                );
              }
            }
          )
        );
        context.subscriptions.push(
          commands.registerCommand(
            "east.validateCurrentFile",
            async (params) => {
              const uri = window.activeTextEditor.document.uri;
              const identifier = TextDocumentIdentifier.create(uri.toString());
              commands
                .executeCommand(
                  "east.workspace.executeCommand",
                  "east.validateCurrentFile",
                  identifier
                )
                .then(
                  () => {
                    window.showInformationMessage(
                      "The current XML file was successfully validated."
                    );
                  },
                  (error) => {
                    window.showErrorMessage(
                      "Error during XML validation " + error.message
                    );
                  }
                );
            }
          )
        );

        context.subscriptions.push(disposable);
      });
    });
}

export function deactivate() {}
