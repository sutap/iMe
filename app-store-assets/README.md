# iMe App Store Assets

This directory contains all the necessary assets and documentation for submitting the iMe app to the Apple App Store and Google Play Store.

## Directory Structure

```
app-store-assets/
├── icons/                     # App icons and splash screens
│   ├── app-icon.svg           # Main app icon (1024x1024)
│   └── splash-screen.svg      # Splash screen design
│
├── metadata/                  # Store listing information
│   ├── app-description.txt    # Full app description
│   ├── app-store-notes.md     # Notes for app store publication
│   ├── keywords.txt           # SEO keywords for store listings
│   └── privacy-policy.html    # Required privacy policy document
│
├── screenshots/               # Screenshot assets
│   ├── ios/                   # iOS screenshots (empty, to be filled)
│   ├── android/               # Android screenshots (empty, to be filled)
│   ├── screenshot-descriptions.md  # Caption text for screenshots
│   └── screenshot-templates.svg    # Design templates for screenshots
│
├── capture-screenshots.sh     # Helper script for capturing screenshots
├── capacitor-integration-guide.md  # Guide for Capacitor native setup
├── testing-checklist.md       # Pre-submission testing checklist
└── README.md                  # This file
```

## Getting Started

1. **Prepare App for Store Submission**
   - Run the main Capacitor initialization script: `./cap-init.sh`
   - Follow the instructions in `capacitor-integration-guide.md` for platform-specific setup

2. **Create Screenshots**
   - Run the screenshot helper script: `./app-store-assets/capture-screenshots.sh`
   - Follow the prompts to capture all required screenshots
   - Save them to the appropriate directories (ios/ and android/)

3. **Review Documentation**
   - Check `testing-checklist.md` to verify app readiness
   - Review `app-store-notes.md` for specific store requirements
   - Make sure the privacy policy is accurate and up-to-date

4. **Submit to App Stores**
   - Follow the detailed steps in `../app-store-publication-guide.md`

## Icon and Image Assets

The SVG files provided in the `icons/` directory are master files that should be used to generate all required sizes for both iOS and Android. Tools like Xcode Asset Catalog and Android Studio's Image Asset Studio can automatically generate the necessary variations from these source files.

## Metadata

The files in the `metadata/` directory contain text that should be used in the app store listings:

- `app-description.txt`: Copy this text into the "Description" field of your app listing
- `keywords.txt`: Use these keywords in the App Store keyword field and throughout your Google Play listing
- `privacy-policy.html`: Host this HTML file on your website and provide the URL during submission

## Screenshots

The `screenshot-descriptions.md` file contains recommended captions for each screenshot. Use these captions when uploading your screenshots to the app stores.

## Additional Resources

- `testing-checklist.md`: Comprehensive list of tests to perform before submission
- `capacitor-integration-guide.md`: Detailed instructions for setting up iOS and Android projects

## Maintenance

Keep these assets updated whenever significant changes are made to the app. When releasing updates, you may need to:

1. Capture new screenshots if the UI has changed
2. Update the app description if features have been added or removed
3. Revise the privacy policy if data handling practices have changed

## Notes

- The App Store review process typically takes 1-3 days
- Google Play review process typically takes 1-7 days
- Plan your submission timeline accordingly, especially for initial releases

For any questions or issues related to app store submissions, refer to the official Apple and Google documentation:

- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Developer Policy Center](https://play.google.com/about/developer-content-policy/)