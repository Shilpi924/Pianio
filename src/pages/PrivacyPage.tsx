import { ArrowLeft } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import Navigation from '../components/Navigation';

export default function PrivacyPage() {
  const { goBack } = useAppStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-4 md:p-8 font-kid">
      <Navigation />
      <div className="max-w-4xl mx-auto mt-8">
        <button
          onClick={goBack}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-gray-800 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all text-orange-600 dark:text-orange-400 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 mb-8"
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="text-lg">Back</span>
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-black text-orange-700 dark:text-orange-300 mb-8">
            Privacy Policy
          </h1>

          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">1. Local Data Storage</h2>
              <p className="text-lg leading-relaxed">
                Pianio stores your user profiles, practice progress, statistics, completed lessons, achievements, and app settings locally on your device. This data stays on your device unless you sign in with Google to enable cloud sync.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">2. Optional Cloud Sync (Google Sign-In)</h2>
              <p className="text-lg leading-relaxed">
                If you choose to sign in with Google, we receive your Google account ID and basic profile information (name, email) for authentication via Firebase Authentication. Your profile and practice progress are then synced to Firebase Cloud Firestore so they can be restored across devices. This is entirely optional — the app is fully usable without signing in.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">3. Audio and MIDI Data</h2>
              <p className="text-lg leading-relaxed">
                With your permission, Pianio accesses your device microphone to detect notes played on an acoustic piano for pitch-detection purposes. This audio is processed locally on your device in real time and is never stored or transmitted. When you connect a MIDI keyboard (including via Bluetooth), MIDI note data is likewise processed locally and not stored.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">4. How We Use Your Information</h2>
              <p className="text-lg leading-relaxed">
                We use the information described above to provide and improve the piano learning experience, track your learning progress, enable multi-profile functionality for families, sync your progress across devices when you sign in, and troubleshoot issues.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">5. Data Storage and Security</h2>
              <p className="text-lg leading-relaxed">
                Most user data is stored locally on your device. When you sign in with Google, your profile and progress data is stored in Firebase, encrypted in transit (HTTPS/TLS) and at rest per Firebase's standard security measures. We retain cloud-synced data only as long as your account exists.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">6. Third-Party Services</h2>
              <p className="text-lg leading-relaxed">
                We use Firebase (Google LLC) for optional Google sign-in authentication and cloud sync. Firebase processes data according to Google's Privacy Policy. We do not use Google Analytics or any advertising/tracking SDKs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">7. Data Sharing</h2>
              <p className="text-lg leading-relaxed">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only with Firebase as our cloud infrastructure provider, when required by law, or with your explicit consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">8. Your Rights</h2>
              <p className="text-lg leading-relaxed">
                You have the right to access, correct, or delete your personal data, and to export your data. You can opt out of data collection entirely by not signing in with Google, since cloud sync is optional.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">9. Children's Privacy</h2>
              <p className="text-lg leading-relaxed">
                Pianio is designed to be safe for users of all ages, including children. We do not knowingly collect personal information from children under 13 without parental consent, do not target children with advertising, and comply with COPPA requirements. Parents can review, modify, or request deletion of their child's data by contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">10. Permissions</h2>
              <p className="text-lg leading-relaxed">
                Pianio may request Microphone access (for local pitch detection), Bluetooth (for MIDI keyboards), and Internet access (for optional sign-in and cloud sync). All permissions are optional and can be revoked in your device settings; the app remains usable without them, though dependent features will be limited.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">11. Changes to This Policy</h2>
              <p className="text-lg leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of material changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">12. Contact Us</h2>
              <p className="text-lg leading-relaxed">
                If you have any questions about this privacy policy or want to exercise your data rights, please contact us at lumina.antigravity@gmail.com.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t-2 border-orange-200 dark:border-orange-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Last updated: August 12, 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}