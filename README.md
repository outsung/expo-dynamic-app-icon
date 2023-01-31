# expo-dynamic-app-icon

Programmatically change the app icon in Expo.

## Install

```
npx expo install rn-dynamic-app-icon
```

## Set icon file

add plugins in `app.json`

```typescript
 "plugins": [
      [
        "expo-dynamic-app-icon",
        {
          "red": { // icon name
            "image": "./assets/icon1.png", // icon path
            "prerendered": true // for ios UIPrerenderedIcon option
          },
          "gray": {
            "image": "./assets/icon2.png",
            "prerendered": true
          }
        }
      ]
    ]
```

## Use setAppIcon

```typescript
import { setAppIcon } from "expo-dynamic-app-icon";

...

setAppIcon("red") // set icon 'assets/icon1.png'
```
