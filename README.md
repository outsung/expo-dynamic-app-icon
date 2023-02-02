# expo-dynamic-app-icon

Programmatically change the app icon in Expo.

## Install

```
npx expo install expo-dynamic-app-icon
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

## Check AndroidManifest (for android)

```
expo prebuild
```

check added line
[AndroidManifest.xml](./example/android/app/src/main/AndroidManifest.xml#L33-L44)

```xml
  ...
    <activity-alias android:name="expo.modules.dynamicappicon.example.MainActivityred" android:enabled="false" android:exported="true" android:icon="@mipmap/red" android:targetActivity=".MainActivity">
      <intent-filter>
        <action android:name="android.intent.action.MAIN"/>
        <category android:name="android.intent.category.LAUNCHER"/>
      </intent-filter>
    </activity-alias>
    <activity-alias android:name="expo.modules.dynamicappicon.example.MainActivitygray" android:enabled="false" android:exported="true" android:icon="@mipmap/gray" android:targetActivity=".MainActivity">
      <intent-filter>
        <action android:name="android.intent.action.MAIN"/>
        <category android:name="android.intent.category.LAUNCHER"/>
      </intent-filter>
    </activity-alias>
  ...
```

## Create new `expo-dev-client`

create a new `expo-dev-client` and begin using `expo-dynamic-app-icon`

## Use `setAppIcon`

```typescript
import { setAppIcon } from "expo-dynamic-app-icon";

...

setAppIcon("red") // set icon 'assets/icon1.png'
```

<a href="https://www.buymeacoffee.com/outsung" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>
