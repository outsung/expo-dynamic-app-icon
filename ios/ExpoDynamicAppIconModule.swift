import ExpoModulesCore

public class ExpoDynamicAppIconModule: Module {
  public func definition() -> ModuleDefinition {
    
    Name("ExpoDynamicAppIcon")


    Function("setAppIcon") { (name:String) -> String in
      UIApplication.shared.setAlternateIconName(name) { (error) in
        if let error = error {
            print(error.localizedDescription)
        }
      }
      return name
    }

    Function("getIconName") {
      return "Hello world! 👋"
    }

  }
}
