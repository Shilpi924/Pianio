# Data Safety Declaration for Play Store

## Overview
Pianio collects and processes the following types of data to provide piano learning services.

## Data Collection and Sharing

### 1. Personal Information
**Collected**: Yes, only if you sign in with Google
**Shared**: No
**Purpose**: Account creation and cloud sync of profile/progress

- **Email address** (from Google Sign-In)
- **Name** (from Google Sign-In, for profile personalization)
- **Age group** (optional, self-reported, for age-appropriate content — not verified)

### 2. App Activity
**Collected**: Yes
**Shared**: No — stored locally, and in Firebase only if you sign in
**Purpose**: Learning progress tracking and personalization

- Lessons completed
- Practice time and frequency
- Achievements and XP earned
- Skill level progression
- Performance statistics

### 3. Audio and MIDI Data
**Collected**: Yes (processed locally only)
**Shared**: No
**Purpose**: Real-time note detection and pitch correction

- Microphone audio input (processed locally, never stored or transmitted)
- MIDI note data (processed locally, never stored or transmitted)

## Data Security Practices

### Encryption
- Data in transit: Encrypted using HTTPS/TLS
- Data at rest: Encrypted when stored in Firebase

### Data Retention
- Local data: Stored until user deletes app or clears app data
- Cloud data: Stored until user deletes account or requests deletion

### Data Access
- User data is accessible only to the user (when signed in)
- Firestore security rules restrict cloud data so only the owning signed-in account can read or write it — enforced server-side, not just in the app's UI
- No third-party access to user data except as required by law

## Third-Party Data Sharing

We do not sell, rent, or share user data with third parties for advertising or marketing purposes. We do not use Google Analytics or any advertising/tracking SDK.

**Service Providers:**
- **Firebase** (Google LLC): Used for optional Google Sign-In authentication and cloud sync of profile/progress data. Firebase processes data according to Google's privacy policy.

## User Control

Users can:
- Use the app fully without signing in (cloud sync is optional)
- Delete their account and all associated cloud data by contacting us
- Revoke microphone/Bluetooth permissions at any time in device settings

## Children's Data

Pianio is designed for users of all ages. For children under 13:
- We do not knowingly collect personal information without parental consent
- We do not collect location data
- We do not use data for advertising purposes
- We comply with COPPA requirements

## Permissions and Data Access

### Microphone Permission
- **Purpose**: Acoustic piano pitch detection
- **Data Processing**: All audio is processed locally on the device
- **Storage**: Audio data is not stored or transmitted
- **User Control**: Permission can be revoked in device settings; the app remains usable without it (dependent features are limited)

### Bluetooth Permission
- **Purpose**: Connect to Bluetooth MIDI keyboards
- **Data Processing**: MIDI data is processed locally
- **Storage**: MIDI data is not stored
- **User Control**: Permission can be revoked in device settings

## Compliance

This app is designed to align with:
- Google Play Developer Data Safety Policy
- Children's Online Privacy Protection Act (COPPA)

## Contact

For data-related inquiries or to exercise your data rights, contact:
**Email**: lumina.antigravity@gmail.com

## Last Updated
August 12, 2026
