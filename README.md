# react-docgen-exports-handler [![Build Status](https://travis-ci.org/nerdlabs/react-docgen-exports-handler.svg?branch=master)](https://travis-ci.org/nerdlabs/react-docgen-exports-handler)
A handler for react-docgen that finds the format, type and name of the export definition for a component.

## Rationale
[react-docgen](https://github.com/reactjs/react-docgen) is a CLI and API toolbox
to help extract information from [React](http://facebook.github.io/react/)
components and generate documentation from it.

`react-docgen-exports-handler` is a custom handler for `react-docgen` and can be
used to find the format (`ES2015` or `CommonJS`), the type (`default` or `named`)
and the name (if it is not a default export) of an exported component.

## Installation
Install `react-docgen-exports-handler` from [npm](https://www.npmjs.com/package/react-docgen-exports-handler)

```shell
npm install --save react-docgen-exports-handler
```

## Usage
Unfortunately there is currently no easy way to use custom handlers with the
[react-docgen CLI](https://github.com/reactjs/react-docgen#cli).

Discussions and Ideas about how to make this easier are happening in the
[react-docgen issue discussions](https://github.com/reactjs/react-docgen/issues/115).

If you want to use this module programmatically check out the [react-docgen API docs](https://github.com/reactjs/react-docgen#api) for more information about
the `react-docgen` API.  
Below is a small example that demonstrates how to
integrate `react-docgen-exports-handler`.

```javascript
import reactDocs from 'react-docgen';
import exportsHandler from 'react-docgen-exports-handler';
const resolver = reactDocs.resolver.findExportedComponentDefinition;
const handlers = reactDocs.handlers.concat(exportsHandler);
const documentation = reactDocs.parse(src, resolver, handlers);
```

## Examples
When using this custom handler with `react-docgen` it will try to find the
export definition for the component definition.

```javascript
import React from 'react';
export default function() { return <button />; }
```

```json
{
  "exports": {
    "format": "ES2015",
    "type": "default",
    "name": ""
  },
  "props": {...}
}
```

For more information about the data format see the [react-docgen readme](https://github.com/reactjs/react-docgen#result-data-structure)
