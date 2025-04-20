# iMe App Store Publication Guide

This guide will walk you through the process of publishing the iMe app to Apple App Store and Google Play Store.

## Prerequisites

Before you begin, make sure you have:

1. **Developer Accounts**:
   - [Apple Developer Account](https://developer.apple.com/programs/) ($99/year)
   - [Google Play Developer Account](https://play.google.com/console/signup) ($25 one-time fee)

2. **Development Environment**:
   - For iOS: Mac computer with Xcode installed
   - For Android: Android Studio installed (available on macOS, Windows, or Linux)

3. **App Assets**:
   - App icons and splash screens (available in `app-store-assets/icons/`)
   - Screenshots and promotional graphics (examples in `app-store-assets/screenshots/`)
   - App metadata (available in `app-store-assets/metadata/`)

## Step 1: Prepare the App with Capacitor

```bash
# Initialize Capacitor with app info
./cap-init.sh

# After initialization, you can sync web code changes to native projects with:
npx cap sync
```

## Step 2: iOS App Store Submission

1. **Open the iOS Project**:
   ```bash
   npx cap open ios
   ```

2. **Configure in Xcode**:
   - Select your project in the Project Navigator
   - Under "Signing & Capabilities", select your team and ensure automatic signing is enabled
   - Update the Bundle Identifier if needed

3. **Add App Store Assets**:
   - Add the app icon in the Assets catalog
   - Configure the splash screen
   - Ensure all orientations and device types are supported

4. **Archive and Upload**:
   - Select "Generic iOS Device" as the build target
   - Go to Product > Archive
   - After archiving, click "Distribute App" and follow the prompts

5. **Submit in App Store Connect**:
   - Log in to [App Store Connect](https://appstoreconnect.apple.com/)
   - Create a new app entry
   - Add the required metadata, screenshots, and pricing information
   - Submit for review

## Step 3: Google Play Store Submission

1. **Open the Android Project**:
   ```bash
   npx cap open android
   ```

2. **Configure in Android Studio**:
   - Update the `applicationId` in `app/build.gradle` if needed
   - Configure signing keys

3. **Build the Release APK/AAB**:
   - Go to Build > Generate Signed Bundle/APK
   - Create a new keystore or use an existing one
   - Choose Android App Bundle (AAB) format for Play Store
   - Complete the build process

4. **Submit to Google Play Console**:
   - Log in to [Google Play Console](https://play.google.com/console/)
   - Create a new app
   - Complete the store listing with your assets from `app-store-assets/`
   - Upload the AAB file
   - Set up pricing and distribution
   - Submit for review

## Additional Resources

- [Apple App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Developer Policy Center](https://play.google.com/about/developer-content-policy/)
- [Capacitor Documentation](https://capacitorjs.com/docs)

## Troubleshooting Tips

- **Common iOS Issues**:
  - Signing issues: Ensure your developer certificate is valid
  - Missing privacy descriptions: Add required privacy descriptions in Info.plist
  - Screenshot requirements: Follow Apple's exact dimensions for screenshots

- **Common Android Issues**:
  - API compatibility: Make sure you're targeting the right Android API level
  - AAB vs APK: Google Play requires AAB format for new apps
  - App permissions: Keep permissions to the minimum required for your app

---

This guide provides a high-level overview of the submission process. The exact steps might change as app store policies evolve, so always refer to the official documentation from Apple and Google for the most up-to-date information.