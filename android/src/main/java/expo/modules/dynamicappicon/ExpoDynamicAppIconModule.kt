package expo.modules.dynamicappicon

import android.app.Activity;
import android.app.Application;
import android.content.Context
import android.content.pm.PackageManager;
import android.content.Intent;
import android.content.ComponentName;

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoDynamicAppIconModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoDynamicAppIcon")

    Function("setAppIcon") { name: String ->
      try {
        var newIcon:String = context.packageName + ".MainActivity" + name
        var currentIcon:String = if(!SharedObject.icon.isEmpty()) SharedObject.icon else context.packageName + ".MainActivity"

        SharedObject.packageName = context.packageName
        SharedObject.pm = pm

        pm.setComponentEnabledSetting(
          ComponentName(context.packageName, newIcon),
          PackageManager.COMPONENT_ENABLED_STATE_ENABLED,
          PackageManager.DONT_KILL_APP
        )

        SharedObject.classesToKill.add(currentIcon)
        SharedObject.icon = newIcon

        return@Function name
      } catch (e: Exception) {
        return@Function false
      }

      return@Function false
    }

    Function("getAppIcon") {
      var componentClass:String = currentActivity.getComponentName().getClassName()

      var currentIcon:String = if(!SharedObject.icon.isEmpty()) SharedObject.icon else componentClass
      
      var currentIconName:String = currentIcon.split("MainActivity")[1]

      return@Function if(currentIconName.isEmpty()) "DEFAULT" else currentIconName
    }
  }

  private val context: Context
    get() = requireNotNull(appContext.reactContext) { "React Application Context is null" }
  
  private val currentActivity
    get() = requireNotNull(appContext.activityProvider?.currentActivity)

  private val pm
    get() = requireNotNull(currentActivity.packageManager)

}
