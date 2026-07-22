# Play Store Release Checklist

## ✅ Completed Setup
- [x] Capacitor installed and configured
- [x] Android platform added
- [x] Required permissions added (RECORD_AUDIO, MODIFY_AUDIO_SETTINGS, BLUETOOTH)
- [x] Debug APK built successfully
- [x] Build scripts added to package.json

## 📋 Required for Play Store Release

### 1. App Signing (CRITICAL)
Generate a signing keystore for release builds:
```bash
keytool -genkey -v -keystore pianio-release.keystore -alias pianio-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

**IMPORTANT**: Keep this keystore file safe and backed up. You'll need it for all future app updates.

### 2. App Assets Needed
Create these image assets:

**App Icons:**
- 512x512px for Play Store listing
- Various sizes for Android app (adaptive icons)
- Use existing `public/icons.svg` as base

**Screenshots** (at least 2):
- Phone screenshots: 1080x1920px (or 1080x2400px for tall phones)
- Tablet screenshots: 2024x3048px
- Show: Home screen, lesson player, settings, achievements

**Feature Graphic:**
- 1024x500px for Play Store featured section

**Banner:**
- 180x120px for TV listings

### 3. Store Listing Information
- **App Name**: Pianio (32 chars max)
- **Short Description**: Learn piano with fun lessons! (80 chars max)
- **Full Description**: Write compelling 4000-char description
- **Privacy Policy URL**: Required (create one)
- **Contact Email**: Support email

### 4. Content Rating
Complete Play Console content rating questionnaire:
- Since app targets kids (5-8, 9-12), may need COPPA compliance
- No violence, strong language, or mature content
- Educational category

### 5. Data Safety Section
Declare what data your app collects:
- Firebase analytics (if enabled)
- User profiles (local storage)
- Practice data (local storage)
- No personal data transmitted without consent

### 6. Target Audience
- Primary: Kids 5-17
- Secondary: Adults 18+
- Educational category

## 🔧 Build Commands

### Development
```bash
npm run android:sync    # Sync web assets to Android
npm run android:open    # Open in Android Studio
npm run android:build   # Build debug APK
```

### Release Build
```bash
# First, configure signing in android/app/build.gradle
# Then run:
npm run android:release
```

### Manual Build in Android Studio
1. Run `npm run android:open`
2. Open Android Studio
3. Build > Generate Signed Bundle/APK
4. Select "Android App Bundle" (AAB) for Play Store
5. Use your keystore file
6. Upload AAB to Play Console

## 📱 Testing Before Release

### Test on Real Device
```bash
# Install debug APK on connected device
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### Test Checklist
- [ ] App launches correctly
- [ ] Audio/MIDI input works
- [ ] Microphone permission requested
- [ ] Bluetooth MIDI devices connect
- [ ] All lessons load and play
- [ ] Settings save correctly
- [ ] Profile switching works
- [ ] Dark mode toggles
- [ ] App works offline (PWA features)

## 🍎 Future iOS App Store Setup

When ready for iOS:
```bash
npm install @capacitor/ios
npx cap add ios
npx cap sync ios
npx cap open ios
```

iOS Requirements:
- Apple Developer Account ($99/year)
- Mac with Xcode
- App Store Connect setup
- iOS-specific permissions (Microphone, Bluetooth)
- App icons and screenshots for iOS
- Privacy policy (same as Android)

## 📁 Current Build Output
Debug APK location: `android/app/build/outputs/apk/debug/app-debug.apk` (8.2 MB)

## 🚀 Next Steps
1. Create app icons and screenshots
2. Generate signing keystore
3. Write app description and privacy policy
4. Set up Google Play Console account
5. Build release AAB
6. Upload to Play Console
7. Complete store listing
8. Submit for review
