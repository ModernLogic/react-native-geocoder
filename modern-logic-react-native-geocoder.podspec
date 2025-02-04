require 'json'
package = JSON.parse(File.read("package.json"))

Pod::Spec.new do |s|

  s.name           = "modern-logic-react-native-geocoder"
  s.version        = package["version"]
  s.summary        = package['description']
  s.author         = { "Andrew Rahn" => "andy@modernlogic.io" }
  s.license        = package["license"]
  s.homepage       = package["homepage"]
  s.platform       = :ios, "13.4"
  s.source         = { :git => "https://github.com/@modernlogic/react-native-geocoder.git", :tag => "v#{s.version}" }
  s.source_files   = 'ios/RNGeocoder/*.{h,m}'
  s.preserve_paths = "**/*.js"
  s.requires_arc = true

  if ENV['RCT_NEW_ARCH_ENABLED'] == '1'
    install_modules_dependencies(s)
  else
    s.exclude_files = "ios/fabric"

    s.dependency "React-Core"
  end

end
