import {
  ConfigPlugin,
  ExportedConfigWithProps,
  IOSConfig,
  withDangerousMod,
  withInfoPlist,
  withXcodeProject,
  withAndroidManifest,
  AndroidConfig,
  AndroidManifest,
} from "@expo/config-plugins";
import { generateImageAsync } from "@expo/image-utils";
import fs from "fs";
import path from "path";
// @ts-ignore
import pbxFile from "xcode/lib/pbxFile";

const {
  addMetaDataItemToMainApplication,
  getMainApplicationOrThrow,
  addUsesLibraryItemToMainApplication,
} = AndroidConfig.Manifest;

const androidFolderPath = ["app", "src", "main", "res"];
const androidFolderNames = [
  "mipmap-hdpi",
  "mipmap-mdpi",
  "mipmap-xhdpi",
  "mipmap-xxhdpi",
  "mipmap-xxxhdpi",
];
const androidSize = [162, 108, 216, 324, 432];

const iosFolderName = "DynamicAppIcons";
const iosSize = 60;
const ipad152Scale = 2.53;
const ipad167Scale = 2.78;
const iosScales = [2, 3, ipad152Scale, ipad167Scale];

type IconSet = Record<string, { image: string; prerendered?: boolean }>;

type Props = {
  icons: Record<string, { image: string; prerendered?: boolean }>;
};

function arrayToImages(images: string[]) {
  return images.reduce(
    (prev, curr, i) => ({ ...prev, [i]: { image: curr } }),
    {}
  );
}

const withDynamicIcon: ConfigPlugin<string[] | IconSet | void> = (
  config,
  props = {}
) => {
  const _props = props || {};

  let prepped: Props["icons"] = {};

  if (Array.isArray(_props)) {
    prepped = arrayToImages(_props);
  } else if (_props) {
    prepped = _props;
  }

  // for ios
  config = withIconXcodeProject(config, { icons: prepped });
  config = withIconInfoPlist(config, { icons: prepped });
  config = withIconIosImages(config, { icons: prepped });

  // for aos
  config = withIconAndroidManifest(config, { icons: prepped });
  config = withIconAndroidImages(config, { icons: prepped });

  return config;
};

// for aos
const withIconAndroidManifest: ConfigPlugin<Props> = (config, { icons }) => {
  return withAndroidManifest(config, (config) => {
    const mainApplication: any = getMainApplicationOrThrow(config.modResults);

    const iconNamePrefix = `${config.android!.package}.MainActivity`;
    const iconNames = Object.keys(icons);

    function addIconActivityAlias(config: any[]): any[] {
      return [
        ...config,
        ...iconNames.map((iconName) => ({
          $: {
            "android:name": `${iconNamePrefix}${iconName}`,
            "android:enabled": "false",
            "android:exported": "true",
            "android:icon": `@mipmap/${iconName}`,
            "android:targetActivity": ".MainActivity",
          },
          "intent-filter": [
            {
              action: [{ $: { "android:name": "android.intent.action.MAIN" } }],
              category: [
                { $: { "android:name": "android.intent.category.LAUNCHER" } },
              ],
            },
          ],
        })),
      ];
    }
    function removeIconActivityAlias(config: any[]): any[] {
      return config.filter(
        (activityAlias) =>
          !(activityAlias.$["android:name"] as string).startsWith(
            iconNamePrefix
          )
      );
    }

    mainApplication["activity-alias"] = removeIconActivityAlias(
      mainApplication["activity-alias"] || []
    );
    mainApplication["activity-alias"] = addIconActivityAlias(
      mainApplication["activity-alias"] || []
    );

    return config;
  });
};

const withIconAndroidImages: ConfigPlugin<Props> = (config, { icons }) => {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const androidResPath = path.join(
        config.modRequest.platformProjectRoot,
        ...androidFolderPath
      );

      const removeIconRes = async () => {
        for (let i = 0; androidFolderNames.length > i; i += 1) {
          const folder = path.join(androidResPath, androidFolderNames[i]);

          const files = await fs.promises.readdir(folder).catch(() => []);
          for (let j = 0; files.length > j; j += 1) {
            if (!files[j].startsWith("ic_launcher")) {
              await fs.promises
                .rm(path.join(folder, files[j]), { force: true })
                .catch(() => null);
            }
          }
        }
      };
      const addIconRes = async () => {
        for (let i = 0; androidFolderNames.length > i; i += 1) {
          const size = androidSize[i];
          const outputPath = path.join(androidResPath, androidFolderNames[i]);

          for (const [name, { image }] of Object.entries(icons)) {
            const fileName = `${name}.png`;

            const { source } = await generateImageAsync(
              {
                projectRoot: config.modRequest.projectRoot,
                cacheType: "react-native-dynamic-app-icon",
              },
              {
                name: fileName,
                src: image,
                // removeTransparency: true,
                backgroundColor: "#ffffff",
                resizeMode: "cover",
                width: size,
                height: size,
              }
            );
            await fs.promises.writeFile(
              path.join(outputPath, fileName),
              source
            );
          }
        }
        // for (const size of ) {
        //   // size
        //   const iconFileName = "";
        //   const fileName = path.join(iosFolderName, iconFileName);
        //   const outputPath = path.join(iosRoot, fileName);

        //   const scaledSize = scale * iosSize;

        // }
      };

      await removeIconRes();
      await addIconRes();

      return config;
    },
  ]);
};

// for ios
function getIconName(name: string, size: number, scale?: number) {
  
  const fileName = `${name}-Icon-$${size}x${size}`;

  if (scale != null) {
    if(scale == ipad152Scale){
      return `${fileName}@2x~ipad.png`;
    }
    if(scale == ipad167Scale){
      return `${fileName}@3x~ipad.png`;
    }
    return `${fileName}@${scale}x.png`;
  }
  return fileName;
}

const withIconXcodeProject: ConfigPlugin<Props> = (config, { icons }) => {
  return withXcodeProject(config, async (config) => {
    const groupPath = `${config.modRequest.projectName!}/${iosFolderName}`;
    const group = IOSConfig.XcodeUtils.ensureGroupRecursively(
      config.modResults,
      groupPath
    );
    const project = config.modResults;
    const opt: any = {};

    // Unlink old assets

    const groupId = Object.keys(project.hash.project.objects["PBXGroup"]).find(
      (id) => {
        const _group = project.hash.project.objects["PBXGroup"][id];
        return _group.name === group.name;
      }
    );
    if (!project.hash.project.objects["PBXVariantGroup"]) {
      project.hash.project.objects["PBXVariantGroup"] = {};
    }
    const variantGroupId = Object.keys(
      project.hash.project.objects["PBXVariantGroup"]
    ).find((id) => {
      const _group = project.hash.project.objects["PBXVariantGroup"][id];
      return _group.name === group.name;
    });

    const children = [...(group.children || [])];

    for (const child of children as {
      comment: string;
      value: string;
    }[]) {
      const file = new pbxFile(path.join(group.name, child.comment), opt);
      file.target = opt ? opt.target : undefined;

      project.removeFromPbxBuildFileSection(file); // PBXBuildFile
      project.removeFromPbxFileReferenceSection(file); // PBXFileReference
      if (group) {
        if (groupId) {
          project.removeFromPbxGroup(file, groupId); //Group other than Resources (i.e. 'splash')
        } else if (variantGroupId) {
          project.removeFromPbxVariantGroup(file, variantGroupId); // PBXVariantGroup
        }
      }
      project.removeFromPbxResourcesBuildPhase(file); // PBXResourcesBuildPhase
    }

    // Link new assets

    await iterateIconsAsync({ icons }, async (key, icon, index) => {
      for (const scale of iosScales) {
        const iconFileName = getIconName(key, iosSize, scale);

        if (
          !group?.children.some(
            ({ comment }: { comment: string }) => comment === iconFileName
          )
        ) {
          // Only write the file if it doesn't already exist.
          config.modResults = IOSConfig.XcodeUtils.addResourceFileToGroup({
            filepath: path.join(groupPath, iconFileName),
            groupName: groupPath,
            project: config.modResults,
            isBuildFile: true,
            verbose: true,
          });
        } else {
          console.log("Skipping duplicate: ", iconFileName);
        }
      }
    });

    return config;
  });
};

const withIconInfoPlist: ConfigPlugin<Props> = (config, { icons }) => {
  return withInfoPlist(config, async (config) => {
    const altIcons: Record<
      string,
      { CFBundleIconFiles: string[]; UIPrerenderedIcon: boolean }
    > = {};

    await iterateIconsAsync({ icons }, async (key, icon) => {
      altIcons[key] = {
        CFBundleIconFiles: [
          // Must be a file path relative to the source root (not a icon set it seems).
          // i.e. `Bacon-Icon-60x60` when the image is `ios/somn/appIcons/Bacon-Icon-60x60@2x.png`
          getIconName(key, iosSize),
        ],
        UIPrerenderedIcon: !!icon.prerendered,
      };
    });

    function applyToPlist(key: string) {
      if (
        typeof config.modResults[key] !== "object" ||
        Array.isArray(config.modResults[key]) ||
        !config.modResults[key]
      ) {
        config.modResults[key] = {};
      }

      // @ts-expect-error
      config.modResults[key].CFBundleAlternateIcons = altIcons;

      // @ts-expect-error
      config.modResults[key].CFBundlePrimaryIcon = {
        CFBundleIconFiles: ["AppIcon"],
      };
    }

    // Apply for both tablet and phone support
    applyToPlist("CFBundleIcons");
    applyToPlist("CFBundleIcons~ipad");

    return config;
  });
};

const withIconIosImages: ConfigPlugin<Props> = (config, props) => {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      await createIconsAsync(config, props);
      return config;
    },
  ]);
};

async function createIconsAsync(
  config: ExportedConfigWithProps,
  { icons }: Props
) {
  const iosRoot = path.join(
    config.modRequest.platformProjectRoot,
    config.modRequest.projectName!
  );

  // Delete all existing assets
  await fs.promises
    .rm(path.join(iosRoot, iosFolderName), { recursive: true, force: true })
    .catch(() => null);
  // Ensure directory exists
  await fs.promises.mkdir(path.join(iosRoot, iosFolderName), {
    recursive: true,
  });
  // Generate new assets
  await iterateIconsAsync({ icons }, async (key, icon) => {
    for (const scale of iosScales) {
      const iconFileName = getIconName(key, iosSize, scale);
      const fileName = path.join(iosFolderName, iconFileName);
      const outputPath = path.join(iosRoot, fileName);

      const scaledSize = Math.ceil(scale * iosSize);
      const { source } = await generateImageAsync(
        {
          projectRoot: config.modRequest.projectRoot,
          cacheType: "react-native-dynamic-app-icon",
        },
        {
          name: iconFileName,
          src: icon.image,
          removeTransparency: true,
          backgroundColor: "#ffffff",
          resizeMode: "cover",
          width: scaledSize,
          height: scaledSize,
        }
      );

      await fs.promises.writeFile(outputPath, source);
    }
  });
}

async function iterateIconsAsync(
  { icons }: Props,
  callback: (
    key: string,
    icon: { image: string; prerendered?: boolean },
    index: number
  ) => Promise<void>
) {
  const entries = Object.entries(icons);
  for (let i = 0; i < entries.length; i++) {
    const [key, val] = entries[i];

    await callback(key, val, i);
  }
}

export default withDynamicIcon;
