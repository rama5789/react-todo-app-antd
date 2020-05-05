# Moment Error:
Compiled with warnings.

./node_modules/moment/src/lib/locale/locales.js
Module not found: Can't resolve './locale' in '/media/rama/New Volume/MEANStack/E-github-projects/reactjs/todo-app-asz/node_modules/moment/src/lib/locale'

# Moment Error Temporary Fix:
1. $ npm install --save-dev npm-force-resolutions

2. add in package.json

    "resolutions": {
        "moment": "2.24.0"
    }

3. Add to "scripts" node in package.json

    "preinstall": "npx npm-force-resolutions"

4. $ npm install