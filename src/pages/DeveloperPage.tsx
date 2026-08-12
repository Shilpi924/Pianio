import { ArrowLeft, Mail, Code, Heart, Star, GitBranch } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import Navigation from '../components/Navigation';

export default function DeveloperPage() {
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
            Developer Information
          </h1>

          <div className="space-y-8 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4 flex items-center gap-2">
                <Code className="w-6 h-6" />
                About Pianio
              </h2>
              <p className="text-lg leading-relaxed">
                Pianio is an interactive piano learning application built with modern web technologies. It's designed to make piano education accessible, engaging, and fun for learners of all ages and skill levels.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4 flex items-center gap-2">
                <GitBranch className="w-6 h-6" />
                Technology Stack
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl">
                  <h3 className="font-bold text-orange-700 dark:text-orange-300 mb-2">Frontend</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• React + TypeScript</li>
                    <li>• Vite</li>
                    <li>• Tailwind CSS</li>
                    <li>• Framer Motion</li>
                  </ul>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl">
                  <h3 className="font-bold text-orange-700 dark:text-orange-300 mb-2">State & Data</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Zustand</li>
                    <li>• Firebase</li>
                    <li>• IndexedDB</li>
                    <li>• Web Audio API</li>
                  </ul>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl">
                  <h3 className="font-bold text-orange-700 dark:text-orange-300 mb-2">Audio & MIDI</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Web MIDI API</li>
                    <li>• Web Audio API</li>
                    <li>• Tone.js</li>
                    <li>• Microphone Input</li>
                  </ul>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl">
                  <h3 className="font-bold text-orange-700 dark:text-orange-300 mb-2">Platform</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• PWA Support</li>
                    <li>• Electron (Desktop)</li>
                    <li>• Capacitor (Mobile)</li>
                    <li>• Three.js (3D)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4 flex items-center gap-2">
                <Code className="w-6 h-6" />
                Open Source
              </h2>
              <p className="text-lg leading-relaxed mb-4">
                Pianio is open source and welcomes contributions from developers worldwide. We believe in the power of community-driven development to create better educational tools.
              </p>
              <a
                href="https://github.com/yourusername/pianio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-xl hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors font-bold"
              >
                <Code className="w-5 h-5" />
                View on GitHub
              </a>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4 flex items-center gap-2">
                <Star className="w-6 h-6" />
                Key Features
              </h2>
              <ul className="space-y-2 text-lg">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>Interactive piano keyboard with MIDI support</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>Real-time note detection via microphone</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>Comprehensive lesson library and curriculum</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>Progress tracking and achievement system</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>3D piano visualization with Three.js</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>AI-powered learning assistance</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4 flex items-center gap-2">
                <Mail className="w-6 h-6" />
                Contact & Support
              </h2>
              <p className="text-lg leading-relaxed mb-4">
                For developer inquiries, bug reports, or feature requests, please reach out through our GitHub repository or contact us directly.
              </p>
              <div className="space-y-2">
                <a
                  href="mailto:lumina.antigravity@gmail.com"
                  className="inline-flex items-center gap-2 text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-200 font-semibold transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  lumina.antigravity@gmail.com
                </a>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4 flex items-center gap-2">
                <Heart className="w-6 h-6" />
                Acknowledgments
              </h2>
              <p className="text-lg leading-relaxed">
                Pianio is built with love using open source libraries and frameworks. We're grateful to the amazing developers who contribute to these projects and make tools like this possible.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">Compliance & Certifications</h2>
              <div className="space-y-3 text-lg">
                <div className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">✓</span>
                  <span><strong>Google Play Developer Program Policies:</strong> Our app complies with all Google Play policies, including user data privacy, content guidelines, and deceptive behavior prevention.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">✓</span>
                  <span><strong>US Export Compliance:</strong> Pianio adheres to US export laws and regulations (EAR). The application uses standard encryption that does not require special export authorization.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">✓</span>
                  <span><strong>Data Protection:</strong> We implement industry-standard security measures including HTTPS/TLS encryption for data in transit and Firebase security for cloud-stored data.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">✓</span>
                  <span><strong>Children's Privacy:</strong> Our app is designed to be safe for users of all ages, with special considerations for children's privacy protection.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">✓</span>
                  <span><strong>Accessibility:</strong> We strive to make Pianio accessible to users with disabilities, following WCAG guidelines where applicable.</span>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t-2 border-orange-200 dark:border-orange-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Made with ❤️ for piano learners everywhere
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Last updated: August 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}