[//]: # (Readme partial used by an default readme page)

## Main features

*   run any node cli tool with additional args
*   passes unknown args as env variable to the e.g. underlying config scripts
*   Typescript types included
*   exposes esm/cjs modules
*   always 100% test coverage

## Guide

*   [Installation](#installation "Installation")
*   [Basic usage](#basicusage "Basic usage")
*   [API documentation](#documentation "Documentation")

## Installation

<pre>npm install --save xargv</pre>

or

<pre>yarn add xargv</pre>

or

<pre>pnpm --save xargv</pre>

## Basic usage

Imagine a situation: you want to dynamically generate webpack config (webpack.config.js)
based on provided args but webpack cli blocks you from passing any foreign values.

Below you will find way to deal with it.

### Set argv config in the config file

In the root of the project provide .xargvrc file:
<pre>{
      // command name matches first ath passed to xargv
      "webpack": {
        // this is the path to cli you want to execute
        "binPath": "webpack/bin",
        // this is the env variable name all your extra args will be placed in
        "containerName": "ARGVX",
        // want to pass to xargv command args without --name? Thats the map of keys
        // for this values
        "unnamedArgKeys": [
            "unnamedA",
            "unnamedB"
        ],
        // thats the list of all args passed that should be passed as foreign vars
        "foreignKeys": [
            "unnamedA",
            "defaultA",
            "flagA",
            "inlineA"
        ],
        // This are args you dont want to define all over the package.json
        // did you noticed one of this values will endup as foreign var? Neat!
        "defaultArgs": {
            "defaultA": "defaultValueA",
            "defaultB": "defaultValueB"
        }
    }
}</pre>

Keep in mind you can define same config in the package.json file:
<pre>{
    [...]
    "xargv": {
        [...]
    }
}</pre>

As soon as you have config defined use it in one of the npm script's:
<pre>{
    [...]
    "scripts": {
        "start": "xargv webpack foreignValue nativeValue --nativeFlag --nativeInline nativeInlineValue nativeUnmatchedValue"
    }
}</pre>

Or via cli if you have installed package globally:
<pre>
xargv webpack foreignValue nativeValue --nativeFlag --nativeInline nativeInlineValue nativeUnmatchedValue
</pre>

For working examples please take a look at the repos example dir.
