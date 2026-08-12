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
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">1. Information We Collect</h2>
              <p className="text-lg leading-relaxed">
                Pianio collects information you provide directly to us, such as when you create an account, use our services, or communicate with us. This may include your name, email address, and practice progress data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">2. How We Use Your Information</h2>
              <p className="text-lg leading-relaxed">
                We use the information we collect to provide, maintain, and improve our services, to track your learning progress, to personalize your experience, and to communicate with you about our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">3. Data Storage and Security</h2>
              <p className="text-lg leading-relaxed">
                Your data is stored locally on your device and optionally synced to cloud storage when you enable cloud sync features. We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">4. Cookies and Local Storage</h2>
              <p className="text-lg leading-relaxed">
                Pianio uses local storage to save your preferences, settings, and practice progress. This data remains on your device and is not shared with third parties unless you explicitly enable cloud sync features.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">5. Third-Party Services</h2>
              <p className="text-lg leading-relaxed">
                We may use third-party services such as Firebase for cloud storage and authentication. These services have their own privacy policies and we encourage you to review them.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">6. Data Retention</h2>
              <p className="text-lg leading-relaxed">
                We retain your personal data for as long as necessary to provide our services and fulfill the purposes outlined in this privacy policy. You can request deletion of your account and associated data at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">7. Your Rights</h2>
              <p className="text-lg leading-relaxed">
                You have the right to access, correct, or delete your personal data. You can also opt out of data collection by disabling cloud sync features in your settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">8. Children's Privacy</h2>
              <p className="text-lg leading-relaxed">
                Pianio is designed to be used by users of all ages, including children. We do not knowingly collect personal information from children under 13 without parental consent. Parents can review and request deletion of their child's data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">9. Changes to This Policy</h2>
              <p className="text-lg leading-relaxed">
                We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">10. International Data Transfers</h2>
              <p className="text-lg leading-relaxed">
                Your information may be transferred to and maintained on computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ. When you enable cloud sync features, your data is processed by Firebase (Google LLC) and may be stored in servers located in the United States or other countries. By using our cloud sync features, you consent to such transfers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">11. Export Compliance</h2>
              <p className="text-lg leading-relaxed">
                Pianio complies with United States export laws and regulations. The software may be subject to export controls, including the Export Administration Regulations (EAR). By using Pianio, you agree to comply with all applicable export and re-export control laws and regulations. You may not use, export, re-export, or transfer the software in violation of any applicable laws or regulations, including without limitation U.S. export laws and regulations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">12. Encryption</h2>
              <p className="text-lg leading-relaxed">
                Pianio uses industry-standard encryption (HTTPS/TLS) to protect data in transit between your device and our servers. Cloud-stored data is encrypted using Firebase's security measures. The application uses standard encryption functions that are compliant with U.S. export regulations and does not include any encryption functionality that requires special export authorization.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">13. Contact Us</h2>
              <p className="text-lg leading-relaxed">
                If you have any questions about this privacy policy, our data practices, export compliance, or to exercise your data rights, please contact us through our developer page or by email.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t-2 border-orange-200 dark:border-orange-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Last updated: August 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}