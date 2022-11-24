package expo.modules.dynamicappicon

import android.app.Activity;
import android.app.Application;
import android.content.Context
import android.content.pm.PackageManager;
import android.content.ComponentName;

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoDynamicAppIconModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoDynamicAppIcon")
    
    Function("setAppIconWithoutAlert") { name: String ->
      name
    }

    Function("setAppIcon") { name: String ->

      // expo.modules.dynamicappicon.example.MainActivityred
      // expo.modules.dynamicappicon/expo.modules.dynamicappicon.MainActivitygray

      
      // PackageManager.COMPONENT_ENABLED_STATE_ENABLED,
      // PackageManager.DONT_KILL_APP
      try {
        var newIcon:String = "expo.modules.dynamicappicon.example" + ".MainActivity" + name
        
        pm.setComponentEnabledSetting(
          ComponentName("expo.modules.dynamicappicon.example", newIcon),
          PackageManager.COMPONENT_ENABLED_STATE_ENABLED,
          PackageManager.DONT_KILL_APP
        )

        SharedObject.classesToKill.add(icon)
        icon = newIcon

        return@Function name
      } catch (e: Exception) {
        return@Function "ICON_INVALID"
      }

      return@Function "test"
    }

    Function("getIconName") {
      "Hello world! 👋"
    }
  }

  private var icon: String = "expo.modules.dynamicappicon.example" + ".MainActivity"
  
  private val context: Context
    get() = requireNotNull(appContext.reactContext) { "React Application Context is null" }

  private val currentActivity
    get() = requireNotNull(appContext.activityProvider?.currentActivity)

  private val pm
    get() = requireNotNull(currentActivity.packageManager)

}
