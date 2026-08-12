# Data Safety Declaration for Play Store

## Overview
Pianio collects and processes the following types of data to provide piano learning services.

## Data Collection and Sharing

### 1. Personal Information
**Collected**: Yes
**Shared**: No
**Purpose**: Account creation and profile management

- **Email address** (when using Google Sign-In)
- **Name** (optional, for profile personalization)
- **Age** (optional, for age-appropriate content)

### 2. App Activity
**Collected**: Yes
**Shared**: No
**Purpose**: Learning progress tracking and personalization

- Lessons completed
- Practice time and frequency
- Achievements and XP earned
- Skill level progression
- Performance statistics

### 3. Device or Other Identifiers
**Collected**: Yes
**Shared**: No
**Purpose**: Analytics and app improvement

- Device type and model
- Operating system version
- Unique device identifiers (for analytics)
- App version and crash reports

### 4. Audio and MIDI Data
**Collected**: Yes (processed locally)
**Shared**: No
**Purpose**: Real-time note detection and pitch correction

- Microphone audio input (processed locally, not stored)
- MIDI note data (processed locally, not stored)

## Data Security Practices

### Encryption
- Data in transit: Encrypted using HTTPS/TLS
- Data at rest: Encrypted when stored in Firebase

### Data Retention
- Local data: Stored until user deletes app or clears app data
- Cloud data: Stored until user deletes account or requests deletion
- Analytics data: Retained for 26 months per Google Analytics policy

### Data Access
- User data is accessible only to the user (when signed in)
- Firebase data is protected by Firebase security rules
- No third-party access to user data except as required by law

## Third-Party Data Sharing

We do not sell, rent, or share user data with third parties for advertising or marketing purposes.

**Service Providers:**
- **Firebase**: Used for authentication, cloud storage, and analytics. Firebase processes data according to Google's privacy policy.
- **Google Analytics**: Used for anonymous usage analytics. Data is aggregated and anonymized.

## User Control

Users can:
- View their data through the app settings
- Export their data upon request
- Delete their account and all associated data
- Opt out of analytics collection
- Revoke app permissions at any time

## Children's Data

Pianio is designed for users of all ages. For children under 13:
- We collect minimal personal information
- We do not collect location data
- We do not use data for advertising purposes
- Parents can manage their children's accounts
- We comply with COPPA requirements

## Permissions and Data Access

### Microphone Permission
- **Purpose**: Acoustic piano pitch detection
- **Data Processing**: All audio is processed locally on the device
- **Storage**: Audio data is not stored or transmitted
- **User Control**: Permission can be revoked in device settings

### Bluetooth Permission
- **Purpose**: Connect to Bluetooth MIDI keyboards
- **Data Processing**: MIDI data is processed locally
- **Storage**: MIDI data is not stored
- **User Control**: Permission can be revoked in device settings

### Storage Permission
- **Purpose**: Save lessons and user data locally
- **Data Processing**: Data is stored locally on device
- **Storage**: User can clear app data in device settings
- **User Control**: Permission can be revoked in device settings

## Compliance

This app complies with:
- Google Play Developer Data Safety Policy
- Children's Online Privacy Protection Act (COPPA)
- General Data Protection Regulation (GDPR) for EU users
- California Consumer Privacy Act (CCPA) for California residents

## Contact

For data-related inquiries or to exercise your data rights, contact:
**Email**: [Your support email]

## Last Updated
August 2026
