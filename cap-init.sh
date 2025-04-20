#!/bin/bash

# Color definitions
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=====================================${NC}"
echo -e "${BLUE}   iMe Capacitor Initialization      ${NC}"
echo -e "${BLUE}=====================================${NC}"

# Build the web app
echo -e "\n${GREEN}Step 1: Building the web application...${NC}"
npm run build

# Initialize Capacitor configuration
echo -e "\n${GREEN}Step 2: Initializing Capacitor configuration...${NC}"

# Check if capacitor.config.ts already has content
if [ -s "capacitor.config.ts" ]; then
  echo "Capacitor config already exists. Skipping initialization."
else
  echo "Creating Capacitor configuration..."
  cat > capacitor.config.ts << EOL
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.imeapp.app',
  appName: 'iMe',
  webDir: 'dist/client',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#EEF7FF",
      showSpinner: true,
      spinnerColor: "#3B82F6",
    }
  }
};

export default config;
EOL
fi

# Add platforms
echo -e "\n${GREEN}Step 3: Adding platforms...${NC}"

# iOS
echo -e "\n${GREEN}Adding iOS platform...${NC}"
npx cap add ios

# Android
echo -e "\n${GREEN}Adding Android platform...${NC}"
npx cap add android

# Copy web assets to native projects
echo -e "\n${GREEN}Step 4: Copying web assets to native projects...${NC}"
npx cap sync

echo -e "\n${GREEN}Step 5: Copying app icons and splash screens...${NC}"
# For a production app, you would need to copy and configure icons properly
# This would typically involve tools like cordova-res
echo "For a complete setup, you'll need to manually configure icons and splash screens in Xcode and Android Studio."

echo -e "\n${BLUE}=====================================${NC}"
echo -e "${GREEN}✓ Initialization Complete!${NC}"
echo -e "${BLUE}=====================================${NC}"
echo -e "\n${BLUE}Next steps:${NC}"
echo -e "1. Open iOS project:    ${GREEN}npx cap open ios${NC}"
echo -e "2. Open Android project: ${GREEN}npx cap open android${NC}"
echo -e "3. See app-store-publication-guide.md for detailed submission instructions"
echo -e "\n${BLUE}Remember to configure app icons, splash screens, and other native settings${NC}"
echo -e "${BLUE}in the respective IDEs before submitting to app stores.${NC}"