# EAST language support for VSCode

## Description

This VS Code extension provides support for creating and editing EAST XML documents.

![Tag suggestion](./screens/tag_suggestion.png)

## Features

- Tag suggestion based on DTD
  ![Tag suggestion](./screens/tag_suggestion.png)
- Syntax error reporting based on DTD
  ![Tag suggestion](./screens/syntax_error.png)
- Tag documentation on hover
  ![Tag suggestion](./screens/tag_documentation.png)
- Generate HTML based on XSLT file using the command palette
  ![Tag suggestion](./screens/generate_HTML.png)

## Requirements 
- latest Visual Studio Code
- Node.js
- JDK 8+
- Set JAVA_HOME environement variable

## Usage
Some usage conditions in order to the extension to work: <br>
1. The opened folder or workspace needs to contain the `east.xsd` file
2. The opened folder or workspace needs to contain the `east.xslt` file
3. The opened folder or workspace needs to contain the `config_EAST` folder
4. The east file needs to end with `*.east.xml`
## Setup for developement (contributing)

- Fork and clone this repository
- Install the dependencies:

  ```bash
  $ npm install
  ```

- Build the server by running:

  ```bash
  $ npm run compile
  ```

- To run the extension, open the Debugging tab in VSCode
- Select and run 'Launch Extension' at the top left:

  ![ Launch Extension ](./screens/launch_extension.png)

## Team

<table>
	<tbody>
		<tr>
			<td align="center" valign="top" width="11%">
				<a href="https://github.com/younesZdDz">
					<img src="https://github.com/younesZdDz.png?s=75" width="75" height="75"><br />
					ZADI Younes
				</a>
			</td>
			<td align="center" valign="top" width="11%">
				<a href="https://github.com/nasri-soufiane">
					<img src="https://github.com/nasri-soufiane.png?s=75" width="75" height="75"><br />
					NASRI Soufiane
				</a>
			</td>
			<td align="center" valign="top" width="11%">
				<a href="https://github.com/Youssef-Aissi">
					<img src="https://github.com/Youssef-Aissi.png?s=75" width="75" height="75"><br />
					AISSI Youssouf
				</a>
			</td>
			<td align="center" valign="top" width="11%">
				<a href="https://github.com/rafiktaamma">
					<img src="https://github.com/rafiktaamma.png?s=75" width="75" height="75"><br />
					TAAMMA Baghdad Rafik
				</a>
			</td>
		</tr>
	</tbody>
</table>
