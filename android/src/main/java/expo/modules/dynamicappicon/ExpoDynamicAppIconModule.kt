package expo.modules.dynamicappicon

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoDynamicAppIconModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoDynamicAppIcon")

    
    Function("setAppIcon") { name: String ->
      name
    }

    Function("getIconName") {
      "Hello world! 👋"
    }
  }
}
