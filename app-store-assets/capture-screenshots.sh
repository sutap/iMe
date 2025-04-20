#!/bin/bash

# Color definitions
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=====================================${NC}"
echo -e "${BLUE}   iMe App Screenshot Capture Tool    ${NC}"
echo -e "${BLUE}=====================================${NC}"

# Create directories if they don't exist
mkdir -p app-store-assets/screenshots/ios
mkdir -p app-store-assets/screenshots/android

# Check if we're on a Mac for iOS screenshots
if [[ "$OSTYPE" == "darwin"* ]]; then
  echo -e "\n${GREEN}Mac OS detected. iOS screenshots can be captured.${NC}"
  
  echo -e "\n${YELLOW}iOS Screenshot Capture Instructions:${NC}"
  echo -e "1. Open your app in iOS Simulator: ${GREEN}npx cap open ios${NC}"
  echo -e "2. In Simulator, select: Device > 'iPhone 13 Pro Max' (or latest equivalent)"
  echo -e "3. For each screenshot, navigate to the appropriate screen"
  echo -e "4. Capture simulator screenshot with: ${GREEN}Command + S${NC}"
  echo -e "5. Screenshots will be saved to your desktop"
  echo -e "6. Move the screenshots to: ${GREEN}app-store-assets/screenshots/ios/${NC}"
  echo -e "7. Rename them according to the screens they represent (dashboard.png, health.png, etc.)"
else
  echo -e "\n${YELLOW}Non-Mac OS detected. iOS screenshots will need to be captured on a Mac.${NC}"
fi

echo -e "\n${YELLOW}Android Screenshot Capture Instructions:${NC}"
echo -e "1. Open your app in Android Emulator: ${GREEN}npx cap open android${NC}"
echo -e "2. In Android Studio, select a device with 1080x1920 resolution"
echo -e "3. For each screenshot, navigate to the appropriate screen"
echo -e "4. Capture emulator screenshot with: ${GREEN}⌘+S (Mac) or Control+S (Windows/Linux)${NC}"
echo -e "5. Screenshots will be offered for download"
echo -e "6. Move the screenshots to: ${GREEN}app-store-assets/screenshots/android/${NC}"
echo -e "7. Rename them according to the screens they represent (dashboard.png, health.png, etc.)"

echo -e "\n${BLUE}Required Screenshots (6 total):${NC}"
echo -e "1. Dashboard - Homepage showing user overview"
echo -e "2. Schedule - Calendar and event management"
echo -e "3. Health - Health metrics and goals"
echo -e "4. Finance - Budget tracking and expenses"
echo -e "5. Discovery - Personalized recommendations"
echo -e "6. Accessibility - Voice commands and settings"

echo -e "\n${YELLOW}Note:${NC} Make sure all screenshots are taken with clean test data and no personal information."
echo -e "${YELLOW}Note:${NC} For best results, make sure the app is fully loaded before taking screenshots."

echo -e "\n${BLUE}=====================================${NC}"
echo -e "${GREEN}When finished, you'll have all necessary screenshots for app store submission.${NC}"
echo -e "${BLUE}=====================================${NC}"