# EAST language support for VSCode
## Description

This VS Code extension provides support for creating and editing EAST XML documents.

![Tag suggestion](./screens/tag_suggestion.png)

## Features
* Tag suggestion based on DTD
![Tag suggestion](./screens/tag_suggestion.png)
* Syntax error reporting based on DTD
![Tag suggestion](./screens/syntax_error.png)
* Tag documentation on hover
![Tag suggestion](./screens/tag_documentation.png)

## Requirements
* latest Visual Studio Code
* Node.js 
* JDK 8+
* Set JAVA_HOME environement variable
## Setup
* Fork and clone this repository
* Install the dependencies:  
	```bash  
	$ npm install
	```

* Build the server by running:

	```bash   
	$ npm run compile
	```
* To run the extension, open the Debugging tab in VSCode
* Select and run 'Launch Extension' at the top left:

    ![ Launch Extension ](./screens/launch_extension.png)