import ExpoDynamicAppIconModule from "./ExpoDynamicAppIconModule";

export function setAppIcon(name: string): string {
  return ExpoDynamicAppIconModule.setAppIcon(name);
}

export function getIconName(): string {
  return ExpoDynamicAppIconModule.getIconName();
}
