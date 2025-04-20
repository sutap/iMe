# iMe Capacitor Integration Guide

This guide provides detailed instructions for setting up and configuring the iMe app with Capacitor for iOS and Android platforms.

## Prerequisites

- Node.js 14 or higher
- Xcode 13 or higher (for iOS builds)
- Android Studio 4.2 or higher (for Android builds)
- Java Development Kit (JDK) 11 or higher (for Android builds)
- Capacitor CLI (`@capacitor/cli` package)

## Initial Setup

1. **Build the Web Application**
   ```bash
   npm run build
   ```

2. **Initialize Capacitor**
   ```bash
   ./cap-init.sh
   ```
   
   This script will:
   - Create the Capacitor configuration file
   - Add iOS and Android platforms
   - Copy web assets to native projects

## iOS Configuration

### Opening the iOS Project

```bash
npx cap open ios
```

### App Configuration in Xcode

1. **Signing & Capabilities**
   - Select the project in the Project Navigator
   - Go to the "Signing & Capabilities" tab
   - Choose your Apple Developer Team
   - Enable automatic signing (for development)
   - For distribution, configure a distribution certificate

2. **App Icons**
   - Open Assets.xcassets
   - Select AppIcon
   - Drag and drop appropriate sized icons from app-store-assets/icons/
   - Xcode can generate all required sizes from the master SVG

3. **Splash Screen**
   - Open Assets.xcassets
   - Create a new Image Set called "Splash"
   - Add the splash screen image from app-store-assets/icons/
   - Configure LaunchScreen.storyboard to use this image

4. **Permissions**
   
   Update Info.plist for any permissions your app needs:

   ```xml
   <!-- For camera access -->
   <key>NSCameraUsageDescription</key>
   <string>iMe requires camera access to update your profile picture.</string>
   
   <!-- For photo library access -->
   <key>NSPhotoLibraryUsageDescription</key>
   <string>iMe requires photo library access to update your profile picture.</string>
   
   <!-- For microphone access (voice commands) -->
   <key>NSMicrophoneUsageDescription</key>
   <string>iMe requires microphone access for voice commands.</string>
   
   <!-- For location services -->
   <key>NSLocationWhenInUseUsageDescription</key>
   <string>iMe uses your location for personalized recommendations.</string>
   ```

## Android Configuration

### Opening the Android Project

```bash
npx cap open android
```

### App Configuration in Android Studio

1. **Application ID and Version**
   - Open build.gradle (Module: app)
   - Verify applicationId matches "com.imeapp.app"
   - Update versionCode and versionName as needed

2. **App Icons**
   - Place appropriately sized icons in app/src/main/res/mipmap folders
   - Android Studio can generate all required sizes from the master SVG
   - Alternatively, use the Image Asset Studio: Right-click on res folder > New > Image Asset

3. **Splash Screen**
   - Place splash screen image in app/src/main/res/drawable
   - Configure splash screen in res/values/styles.xml and AndroidManifest.xml

4. **Permissions**
   
   Update AndroidManifest.xml for any permissions your app needs:

   ```xml
   <!-- For camera access -->
   <uses-permission android:name="android.permission.CAMERA" />
   
   <!-- For photo library access -->
   <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
   
   <!-- For microphone access (voice commands) -->
   <uses-permission android:name="android.permission.RECORD_AUDIO" />
   
   <!-- For location services -->
   <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
   
   <!-- For network access -->
   <uses-permission android:name="android.permission.INTERNET" />
   <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
   ```

## Capacitor Plugins

Our app uses several Capacitor plugins to access native functionality:

1. **Core Plugins**

   The following core plugins are automatically installed:
   - `@capacitor/core`: Base Capacitor functionality
   - `@capacitor/ios`: iOS platform integration
   - `@capacitor/android`: Android platform integration

2. **Additional Plugins**

   For more functionality, you may need to install additional plugins:

   ```bash
   npm install @capacitor/camera @capacitor/storage @capacitor/push-notifications
   npx cap sync
   ```

## Testing Native Features

### Testing on iOS Simulator

1. Build and run the app in Xcode
2. Test basic navigation and functionality
3. Test any native integrations (camera, filesystem, etc.)
4. Check push notifications (if implemented)

### Testing on Android Emulator

1. Build and run the app in Android Studio
2. Test basic navigation and functionality
3. Test any native integrations
4. Verify permissions are requested properly

### Testing on Physical Devices

For a complete test, deploy to physical devices:

1. **iOS Device**
   - Connect your iOS device to your Mac
   - Select your device in Xcode's device menu
   - Build and run

2. **Android Device**
   - Enable USB debugging on your Android device
   - Connect your Android device via USB
   - Select your device in Android Studio's device menu
   - Build and run

## Troubleshooting

### Common iOS Issues

1. **Code Signing Issues**
   - Verify your Apple Developer account has an active membership
   - Check if your certificate and provisioning profiles are valid
   - Try refreshing certificates in Xcode

2. **Build Errors**
   - Clean the build folder: Product > Clean Build Folder
   - Update CocoaPods: `pod update`
   - Check Xcode version compatibility

### Common Android Issues

1. **Gradle Sync Issues**
   - Update Gradle plugin and distribution versions
   - Check for incompatible dependencies
   - Clear Gradle caches: File > Invalidate Caches / Restart

2. **Emulator Problems**
   - Update Android Studio and emulator images
   - Increase emulator memory allocation
   - Try using a physical device instead

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [iOS Development Resources](https://developer.apple.com/documentation/)
- [Android Development Resources](https://developer.android.com/docs)

---

For further assistance, consult the official Capacitor documentation or seek help from the Capacitor community on the Ionic Forum or Discord.