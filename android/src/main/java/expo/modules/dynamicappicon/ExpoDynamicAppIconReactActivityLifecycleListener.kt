package expo.modules.dynamicappicon

import android.content.pm.PackageManager;
import android.content.ComponentName;
import android.app.Activity
import android.os.Bundle
import expo.modules.core.interfaces.ReactActivityLifecycleListener

import java.util.ArrayList;

object SharedObject {
  var classesToKill = ArrayList<String>()
}


class ExpoDynamicAppIconReactActivityLifecycleListener : ReactActivityLifecycleListener {

  override fun onPause(activity: Activity) {
    SharedObject.classesToKill.forEach{ cls ->
      activity.packageManager.setComponentEnabledSetting(
        ComponentName(activity.packageName, cls),
        PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
        PackageManager.DONT_KILL_APP
      )
    }

    SharedObject.classesToKill.clear()
  }
}