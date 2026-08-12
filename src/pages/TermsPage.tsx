import { ArrowLeft } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import Navigation from '../components/Navigation';

export default function TermsPage() {
  const { goBack } = useAppStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-4 md:p-8">
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
            Terms of Service
          </h1>

          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">1. Acceptance of Terms</h2>
              <p className="text-lg leading-relaxed">
                By accessing and using Pianio, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">2. Use License</h2>
              <p className="text-lg leading-relaxed">
                Permission is granted to temporarily download one copy of Pianio for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside mt-3 space-y-2 text-lg">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose</li>
                <li>attempt to reverse engineer any software contained on Pianio</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">3. User Accounts</h2>
              <p className="text-lg leading-relaxed">
                You are responsible for maintaining the confidentiality of your account and password and for restricting access to your account. You agree to accept responsibility for all activities that occur under your account or password.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">4. Children and Parental Consent</h2>
              <p className="text-lg leading-relaxed">
                Pianio is intended for use by learners of all ages, including children. If you are under the age of 18 (or the age of legal majority in your jurisdiction), you may only use Pianio with the involvement and consent of a parent or legal guardian, who agrees to these Terms on your behalf and is responsible for your use of the app.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">5. Content and Conduct</h2>
              <p className="text-lg leading-relaxed">
                Users are responsible for the content they upload. You agree not to upload content that is illegal, harmful, threatening, abusive, defamatory, or otherwise objectionable. Imported song files are processed and stored locally on your device for your own personal use only.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">6. Disclaimer</h2>
              <p className="text-lg leading-relaxed">
                The materials on Pianio are provided on an 'as is' basis. Pianio makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">7. Limitations</h2>
              <p className="text-lg leading-relaxed">
                In no event shall Pianio or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use Pianio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">8. Modifications</h2>
              <p className="text-lg leading-relaxed">
                Pianio may revise these terms of service at any time. Material changes will be reflected in the "Last updated" date below. By continuing to use Pianio after changes take effect, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">9. Export Compliance</h2>
              <p className="text-lg leading-relaxed">
                You acknowledge that Pianio may be subject to United States export laws and regulations, including the Export Administration Regulations (EAR). You agree to comply with all applicable export and re-export control laws and regulations. You represent and warrant that you are not located in a country that is subject to U.S. government sanctions, or that has been designated by the U.S. government as a "terrorist supporting" country, and that you are not listed on any U.S. government list of prohibited or restricted parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">10. Acceptable Use</h2>
              <p className="text-lg leading-relaxed">
                You agree to use Pianio only for its intended purpose of learning and practicing piano, and not to misuse the app, attempt to disrupt its operation, or use it to violate any applicable law or the rights of others.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">11. Governing Law</h2>
              <p className="text-lg leading-relaxed">
                These terms are governed by and construed in accordance with applicable law, without regard to conflict of law principles. Any disputes arising from these terms or your use of Pianio will be resolved in accordance with that law.
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