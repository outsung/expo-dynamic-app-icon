import ExpoModulesCore

public class ExpoDynamicAppIconModule: Module {
  public func definition() -> ModuleDefinition {
    
    Name("ExpoDynamicAppIcon")


    Function("setAppIconWithoutAlert") { (name:String) -> String in
      setAppIconWithoutAlert(name)
      
      return name
    }

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

  private func setAppIconWithoutAlert(_ iconName: String?) {
    if UIApplication.shared.responds(to: #selector(getter: UIApplication.supportsAlternateIcons)) && UIApplication.shared.supportsAlternateIcons {
      typealias setAlternateIconName = @convention(c) (NSObject, Selector, NSString?, @escaping (NSError) -> ()) -> ()
      
      let selectorString = "_setAlternateIconName:completionHandler:"
      
      let selector = NSSelectorFromString(selectorString)
      let imp = UIApplication.shared.method(for: selector)
      let method = unsafeBitCast(imp, to: setAlternateIconName.self)
      method(UIApplication.shared, selector, iconName as NSString?, { _ in })
    }
  }

}
