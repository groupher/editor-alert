
# Warning Tool

Provides Code Blocks for the [Editor.js](https://editorjs.io).


![image](https://user-images.githubusercontent.com/6184465/65211450-5a543980-dad1-11e9-9539-c39145a55fca.png)

## Installation

### Install via NPM

Get the package

```shell
npm i --save-dev @groupher/editor-warning
```

Include module at your application

```javascript
const Warning = require('@groupher/editor-warning');
```

### Download to your project's source dir

1. Upload folder `dist` from repository
2. Add `dist/bundle.js` file to your page.

## Usage

Add a new Tool to the `tools` property of the Editor.js initial config.

```javascript
var editor = EditorJS({
  ...
  
  tools: {
    ...
    warning: Warning,
  },
  
  ...
});
```

## Output data

| Field     | Type     | Description          |
| --------- | -------- | -------------------- |
| title      | `string` | warning title         |
| desc  | `string` | warning desc |


```json
{
    "type" : "quote",
    "data" : {
        "title" : ""note",
        "desc" : "this is a warning"
    }
}
```
