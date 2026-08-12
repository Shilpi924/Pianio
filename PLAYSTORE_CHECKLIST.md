# Play Store Release Checklist

## ✅ Completed Setup
- [x] Capacitor installed and configured
- [x] Android platform added
- [x] Required permissions added (RECORD_AUDIO, MODIFY_AUDIO_SETTINGS, BLUETOOTH)
- [x] Debug APK built successfully
- [x] Build scripts added to package.json
- [x] App signing keystore generated
- [x] Android build.gradle configured for signing
- [x] Target API level set to 36 (exceeds API 34 requirement)
- [x] App icons generated (512x512 and adaptive icons)
- [x] Screenshots generated (placeholder - need real screenshots)
- [x] Feature graphic generated (1024x500px)
- [x] Store listing information documented
- [x] Privacy policy created
- [x] Data safety declaration documented
- [x] Target audience declaration documented
- [x] Release AAB built successfully

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

## 🚀 Next Steps (Play Console Actions Required)

### Immediate Actions (Requires Play Console Access)
1. **Set up Google Play Console account** (if not already done)
2. **Upload release AAB to Play Console**
   - File location: `android/app/build/outputs/bundle/release/app-release.aab`
3. **Complete store listing in Play Console**
   - Use information from `PLAYSTORE_LISTING.md`
   - Upload app icons from `playstore-assets/`
   - Upload screenshots (replace placeholders with real app screenshots)
   - Upload feature graphic
4. **Complete content rating questionnaire**
   - Use information from `TARGET_AUDIENCE_DECLARATION.md`
5. **Fill out data safety section**
   - Use information from `DATA_SAFETY_DECLARATION.md`
6. **Declare target audience and content**
   - Use information from `TARGET_AUDIENCE_DECLARATION.md`
7. **Set up closed testing track**
   - Recruit at least 12 testers
   - Run for minimum 14 days (required for new developer accounts)
8. **Apply for production access** (after closed testing requirements met)
9. **Submit for review**

### Additional Notes
- **Real Screenshots**: Current screenshots are placeholders. Take actual screenshots of the running app for Play Store submission.
- **Privacy Policy URL**: Host the `PRIVACY_POLICY.md` content on your website and provide the URL in Play Console.
- **Contact Email**: Update placeholder emails in documentation with your actual support email.
- **Keystore Security**: The signing keystore (`android/app/pianio-release.keystore`) is critical - keep it backed up and secure.
