import {
	commands,
	ExtensionContext,
	window
  } from "vscode";
  import * as requirements from "./requirements";

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
		console.log(requirements);
	});
}

export function deactivate() {}