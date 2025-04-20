#!/bin/bash

# Build the app first
echo "Building the app..."
npm run build

# Initialize Capacitor
echo "Initializing Capacitor..."
npx cap init iMe com.ime.app --web-dir=dist

# Add iOS platform
echo "Adding iOS platform..."
npx cap add ios

# Add Android platform
echo "Adding Android platform..."
npx cap add android

# Sync the web code to the native projects
echo "Syncing web code to native projects..."
npx cap sync

echo "Capacitor initialization complete!"
echo "To open iOS project: npx cap open ios"
echo "To open Android project: npx cap open android"