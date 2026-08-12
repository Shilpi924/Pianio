# Pianio Privacy Policy

**Last Updated:** August 12, 2026

## Introduction

Pianio ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use the Pianio mobile application.

## Information We Collect

### 1. Local Data Storage
Pianio stores the following information locally on your device:
- User profiles (name, age group, skill level, learning preferences)
- Practice progress, statistics, completed lessons, and achievements
- App settings and preferences

This data stays on your device unless you sign in with Google to enable cloud sync (see below).

### 2. Optional Cloud Sync (Google Sign-In)
If you choose to sign in with Google:
- We receive your Google account ID and basic profile information (name, email) for authentication, via Firebase Authentication.
- Your user profile and practice progress are synced to Firebase Cloud Firestore so they can be restored across devices.
- This is optional — the app is fully usable without signing in, and all data stays local until you do.

### 3. Audio and MIDI Data
- **Microphone Access**: With your permission, the app accesses your device microphone to detect notes played on an acoustic piano for pitch-detection purposes. This audio is processed locally on your device in real time and is not stored or transmitted anywhere.
- **MIDI Data**: When you connect a MIDI keyboard (including via Bluetooth), we receive MIDI note messages for real-time note detection. This data is processed locally and not stored or transmitted.

## How We Use Your Information

We use the information described above to:

- Provide and improve the piano learning experience
- Track your learning progress and personalize content
- Enable multi-profile functionality for families
- Sync your progress across devices when you sign in with Google
- Troubleshoot issues and ensure the app functions properly

## Data Storage and Security

- **Local Storage**: Most user data — practice progress, settings, and profiles — is stored locally on your device.
- **Cloud Storage**: When you sign in with Google, your profile and progress data is stored in Firebase (Google LLC), encrypted in transit (HTTPS/TLS) and at rest per Firebase's standard security measures.
- **Access Control**: Firestore security rules restrict cloud data so only your own signed-in account can read or write it.
- **Data Retention**: We retain cloud-synced data only as long as your account exists. You can request deletion at any time (see Contact Us).

## Third-Party Services

We use the following third-party service:

- **Firebase** (Google LLC): For optional Google sign-in authentication and cloud sync of profile/progress data. Firebase processes data according to [Google's Privacy Policy](https://policies.google.com/privacy).

We do not use Google Analytics or any advertising/tracking SDKs.

## Children's Privacy

Pianio is designed to be safe for users of all ages, including children. We:

- Do not knowingly collect personal information from children under 13 without parental consent
- Provide age-appropriate content and features
- Allow parents to manage their children's profiles
- Do not target children with advertising
- Comply with COPPA (Children's Online Privacy Protection Act) requirements

Parents can review, modify, or delete their child's data by contacting us at the email below.

## Data Sharing

We do not sell, trade, or rent your personal information to third parties. We may share your information only:

- With Firebase, as our cloud infrastructure provider (see above)
- When required by law or to protect our rights
- With your explicit consent

## Your Rights

You have the right to:

- Access your personal data
- Correct inaccurate data
- Delete your account and associated cloud data
- Opt out of data collection by not signing in with Google (cloud sync is entirely optional)
- Export your data

## Permissions

Pianio may request the following device permissions:

- **Microphone**: For acoustic piano pitch detection. Processed locally, never stored or transmitted.
- **Bluetooth**: For connecting to Bluetooth MIDI keyboards.
- **Internet**: For optional Google sign-in and cloud sync.

All permissions are optional and can be revoked in your device settings; the app remains usable without them (features that depend on them will be limited).

## Changes to This Privacy Policy

We may update this Privacy Policy from time to time. We will notify you of material changes by posting the new policy on this page and updating the "Last Updated" date, and by updating the in-app Privacy page.

## Contact Us

If you have any questions about this Privacy Policy or want to exercise your data rights, contact us at:

**Email**: lumina.antigravity@gmail.com

## Effective Date

This Privacy Policy is effective as of August 12, 2026 and remains in effect until replaced by a new version.
