import ExpoDynamicAppIconModule from "./ExpoDynamicAppIconModule";

export function setAppIcon(name: string): string {
  return ExpoDynamicAppIconModule.setAppIcon(name);
}

export function setAppIconWithoutAlert(name: string): string {
  return ExpoDynamicAppIconModule.setAppIconWithoutAlert(name);
}

export function getIconName(): string {
  return ExpoDynamicAppIconModule.getIconName();
}
