import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation strings
const resources = {
  en: {
    translation: {
      home: {
        welcome: "Hello, {{name}}! 🎹",
        tagline: "Let's make some music!",
        path: "Path",
        pathDesc: "Follow the guided learning roadmap.",
        freePlay: "Free Play",
        freePlayDesc: "Just jam! No rules, just you and the piano.",
        library: "Song Library",
        libraryDesc: "Learn your favorite songs step-by-step.",
        rhythm: "Rhythm",
        rhythmDesc: "Practice timing",
        tutorials: "Tutorials",
        tutorialsDesc: "Learn the basics",
        progress: "My Progress",
        progressDesc: "See your achievements",
        settings: "Settings",
        settingsDesc: "Tweak your piano",
        arcade: "Arcade",
        arcadeDesc: "Play fun mini-games",
        rewards: "Rewards Shop",
        rewardsDesc: "Spend your XP!",
        webxr: "WebXR Piano",
        webxrDesc: "Virtual reality mode",
        duet: "Duet Mode",
        duetDesc: "Real-time multiplayer"
      },
      onboarding: {
        welcome: "Welcome to Pianio! 🎹",
        subtitle: "Let's personalize your musical journey.",
        whatsYourName: "What's your name?",
        next: "Next",
        letsGo: "Let's Go!",
        ageGroup: "How old are you?",
        kids: "Kid (4-8)",
        teens: "Teen (9-15)",
        adult: "Adult (16+)",
        goal: "What's your main goal?",
        fun: "Just for fun",
        learn: "Learn seriously",
        songs: "Play favorite songs",
      },
      settings: {
        language: "Language"
      },
      settingsPage: {
        back: "Back",
        title: "Settings",
        subtitle: "Customize your learning experience",
        tabs: {
          account: "Account Profile",
          preferences: "App Preferences",
        },
        profile: {
          level: "Level",
          xp: "XP",
          streak: "Streak",
          minutesPerDay: "Min/day",
        },
        personalization: {
          title: "Personalization",
          subtitle: "Tune recommendations whenever you want.",
          ageGroup: "What is your age group?",
          skillLevel: "What is your skill level?",
          learningGoal: "What is your main learning goal?",
          practiceFrequency: "How often do you plan to practice?",
          favoriteGenres: "Favorite genres",
        },
        groups: {
          display: "Display",
          audio: "Audio",
          animation: "Animation",
          localization: "Localization",
        },
        settings: {
          showKeyboardLabels: "Show Keyboard Labels",
          showNoteNames: "Show Note Names",
          useSharps: "Use Sharps (instead of Flats)",
          darkMode: "Dark Mode",
          backgroundMusic: "Background Music",
          audioVolume: "Audio Volume",
          inputMode: "Lesson Input",
          animationSpeed: "Animation Speed",
          language: "Language",
        },
        inputMode: {
          midi: "MIDI Keyboard",
          microphone: "Microphone",
          auto: "Auto",
        },
        languageOptions: {
          en: "English",
          zh: "中文 (Mandarin)",
          ja: "日本語 (Japanese)",
          de: "Deutsch",
          es: "Español",
        },
        reset: "Reset to Defaults"
      }
    }
  },
  zh: {
    translation: {
      home: {
        welcome: "你好，{{name}}！🎹",
        tagline: "让我们创作一些音乐吧！",
        path: "学习路径",
        pathDesc: "跟随引导式学习路线图。",
        freePlay: "自由演奏",
        freePlayDesc: "随心所欲，没有规则，只有你和钢琴。",
        library: "曲库",
        libraryDesc: "一步步学习你最喜欢的歌曲。",
        rhythm: "节奏",
        rhythmDesc: "练习节拍",
        tutorials: "教程",
        tutorialsDesc: "学习基础知识",
        progress: "我的进度",
        progressDesc: "查看你的成就",
        settings: "设置",
        settingsDesc: "调整你的钢琴",
        arcade: "街机",
        arcadeDesc: "玩有趣的小游戏",
        rewards: "奖励商店",
        rewardsDesc: "花掉你的经验值！",
        webxr: "WebXR 钢琴",
        webxrDesc: "虚拟现实模式",
        duet: "二重奏模式",
        duetDesc: "实时多人互动"
      },
      onboarding: {
        welcome: "欢迎来到 Pianio！🎹",
        subtitle: "让我们个性化你的音乐之旅。",
        whatsYourName: "你叫什么名字？",
        next: "下一步",
        letsGo: "开始吧！",
        ageGroup: "你多大了？",
        kids: "儿童 (4-8)",
        teens: "青少年 (9-15)",
        adult: "成人 (16+)",
        goal: "你的主要目标是什么？",
        fun: "只是为了好玩",
        learn: "认真学习",
        songs: "弹奏喜欢的歌曲",
      },
      settings: {
        language: "语言 (Language)"
      },
      settingsPage: {
        back: "返回",
        title: "设置",
        subtitle: "自定义你的学习体验",
        tabs: {
          account: "账户资料",
          preferences: "应用偏好",
        },
        profile: {
          level: "等级",
          xp: "经验值",
          streak: "连续天数",
          minutesPerDay: "分钟/天",
        },
        personalization: {
          title: "个性化",
          subtitle: "随时调整推荐内容。",
          ageGroup: "你的年龄段是？",
          skillLevel: "你的水平是？",
          learningGoal: "你的主要学习目标是什么？",
          practiceFrequency: "你打算多久练习一次？",
          favoriteGenres: "喜欢的风格",
        },
        groups: {
          display: "显示",
          audio: "音频",
          animation: "动画",
          localization: "语言",
        },
        settings: {
          showKeyboardLabels: "显示键盘标签",
          showNoteNames: "显示音符名称",
          useSharps: "使用升号（而不是降号）",
          darkMode: "深色模式",
          backgroundMusic: "背景音乐",
          audioVolume: "音量",
          inputMode: "课程输入",
          animationSpeed: "动画速度",
          language: "语言",
        },
        inputMode: {
          midi: "MIDI 键盘",
          microphone: "麦克风",
          auto: "自动",
        },
        languageOptions: {
          en: "English",
          zh: "中文（普通话）",
          ja: "日本語（Japanese）",
          de: "Deutsch",
          es: "Español",
        },
        reset: "恢复默认"
      }
    }
  },
  ja: {
    translation: {
      home: {
        welcome: "こんにちは、{{name}}さん！🎹",
        tagline: "音楽を作りましょう！",
        path: "学習パス",
        pathDesc: "ガイド付きの学習ロードマップに従いましょう。",
        freePlay: "フリープレイ",
        freePlayDesc: "ルールなしで、あなたとピアノだけ。",
        library: "曲のライブラリ",
        libraryDesc: "好きな曲をステップバイステップで学ぶ。",
        rhythm: "リズム",
        rhythmDesc: "タイミングの練習",
        tutorials: "チュートリアル",
        tutorialsDesc: "基本を学ぶ",
        progress: "マイプログレス",
        progressDesc: "達成を確認する",
        settings: "設定",
        settingsDesc: "ピアノを調整する",
        arcade: "アーケード",
        arcadeDesc: "楽しいミニゲームを遊ぶ",
        rewards: "報酬ショップ",
        rewardsDesc: "XP を使おう！",
        webxr: "WebXR ピアノ",
        webxrDesc: "バーチャルリアリティモード",
        duet: "デュエットモード",
        duetDesc: "リアルタイム対戦"
      },
      onboarding: {
        welcome: "Pianioへようこそ！🎹",
        subtitle: "あなたの音楽の旅をパーソナライズしましょう。",
        whatsYourName: "お名前は何ですか？",
        next: "次へ",
        letsGo: "出発！",
        ageGroup: "おいくつですか？",
        kids: "子供 (4-8)",
        teens: "10代 (9-15)",
        adult: "大人 (16+)",
        goal: "主な目標は何ですか？",
        fun: "ただ楽しむため",
        learn: "真剣に学ぶ",
        songs: "好きな曲を弾く",
      },
      settings: {
        language: "言語 (Language)"
      },
      settingsPage: {
        back: "戻る",
        title: "設定",
        subtitle: "学習体験をカスタマイズしましょう",
        tabs: {
          account: "アカウント",
          preferences: "アプリ設定",
        },
        profile: {
          level: "レベル",
          xp: "XP",
          streak: "連続",
          minutesPerDay: "分/日",
        },
        personalization: {
          title: "パーソナライズ",
          subtitle: "おすすめはいつでも調整できます。",
          ageGroup: "年齢層は？",
          skillLevel: "スキルレベルは？",
          learningGoal: "主な学習目標は？",
          practiceFrequency: "どのくらいの頻度で練習しますか？",
          favoriteGenres: "好きなジャンル",
        },
        groups: {
          display: "表示",
          audio: "音声",
          animation: "アニメーション",
          localization: "言語",
        },
        settings: {
          showKeyboardLabels: "鍵盤ラベルを表示",
          showNoteNames: "音名を表示",
          useSharps: "シャープを使う（フラットの代わりに）",
          darkMode: "ダークモード",
          backgroundMusic: "BGM",
          audioVolume: "音量",
          inputMode: "レッスン入力",
          animationSpeed: "アニメーション速度",
          language: "言語",
        },
        inputMode: {
          midi: "MIDI キーボード",
          microphone: "マイク",
          auto: "自動",
        },
        languageOptions: {
          en: "English",
          zh: "中文 (Mandarin)",
          ja: "日本語",
          de: "Deutsch",
          es: "Español",
        },
        reset: "デフォルトに戻す"
      }
    }
  },
  de: {
    translation: {
      home: {
        welcome: "Hallo, {{name}}! 🎹",
        tagline: "Lass uns Musik machen!",
        path: "Pfad",
        pathDesc: "Folge der geführten Lern-Roadmap.",
        freePlay: "Freies Spiel",
        freePlayDesc: "Einfach jammen! Keine Regeln.",
        library: "Musikbibliothek",
        libraryDesc: "Lerne deine Lieblingslieder Schritt für Schritt.",
        rhythm: "Rhythmus",
        rhythmDesc: "Timing üben",
        tutorials: "Anleitungen",
        tutorialsDesc: "Lerne die Grundlagen",
        progress: "Mein Fortschritt",
        progressDesc: "Sieh dir deine Erfolge an",
        settings: "Einstellungen",
        settingsDesc: "Klavier anpassen",
        arcade: "Arcade",
        arcadeDesc: "Spiele lustige Mini-Spiele",
        rewards: "Belohnungs-Shop",
        rewardsDesc: "Gib deine XP aus!",
        webxr: "WebXR Piano",
        webxrDesc: "Virtueller Realitätmodus",
        duet: "Duett-Modus",
        duetDesc: "Echtzeit-Multiplayer"
      },
      onboarding: {
        welcome: "Willkommen bei Pianio! 🎹",
        subtitle: "Lass uns deine musikalische Reise personalisieren.",
        whatsYourName: "Wie heißt du?",
        next: "Weiter",
        letsGo: "Los geht's!",
        ageGroup: "Wie alt bist du?",
        kids: "Kind (4-8)",
        teens: "Teenager (9-15)",
        adult: "Erwachsener (16+)",
        goal: "Was ist dein Hauptziel?",
        fun: "Nur zum Spaß",
        learn: "Ernsthaft lernen",
        songs: "Lieblingslieder spielen",
      },
      settings: {
        language: "Sprache (Language)"
      },
      settingsPage: {
        back: "Zurück",
        title: "Einstellungen",
        subtitle: "Passe dein Lernerlebnis an",
        tabs: {
          account: "Profil",
          preferences: "App-Einstellungen",
        },
        profile: {
          level: "Level",
          xp: "XP",
          streak: "Serie",
          minutesPerDay: "Min./Tag",
        },
        personalization: {
          title: "Personalisierung",
          subtitle: "Empfehlungen kannst du jederzeit anpassen.",
          ageGroup: "Wie alt bist du?",
          skillLevel: "Wie ist dein Können?",
          learningGoal: "Was ist dein Hauptziel?",
          practiceFrequency: "Wie oft möchtest du üben?",
          favoriteGenres: "Lieblingsgenres",
        },
        groups: {
          display: "Anzeige",
          audio: "Audio",
          animation: "Animation",
          localization: "Sprache",
        },
        settings: {
          showKeyboardLabels: "Tastaturlabels anzeigen",
          showNoteNames: "Notennamen anzeigen",
          useSharps: "Vorzeichen als Kreuze statt Bs",
          darkMode: "Dunkelmodus",
          backgroundMusic: "Hintergrundmusik",
          audioVolume: "Lautstärke",
          inputMode: "Lerneingabe",
          animationSpeed: "Animationsgeschwindigkeit",
          language: "Sprache",
        },
        inputMode: {
          midi: "MIDI-Tastatur",
          microphone: "Mikrofon",
          auto: "Auto",
        },
        languageOptions: {
          en: "English",
          zh: "中文 (Mandarin)",
          ja: "日本語",
          de: "Deutsch",
          es: "Español",
        },
        reset: "Auf Standard zurücksetzen"
      }
    }
  },
  es: {
    translation: {
      home: {
        welcome: "¡Hola, {{name}}! 🎹",
        tagline: "¡Hagamos algo de música!",
        path: "Ruta",
        pathDesc: "Sigue la ruta guiada de aprendizaje.",
        freePlay: "Juego Libre",
        freePlayDesc: "¡Solo toca! Sin reglas, solo tú y el piano.",
        library: "Biblioteca",
        libraryDesc: "Aprende tus canciones favoritas.",
        rhythm: "Ritmo",
        rhythmDesc: "Practicar el tiempo",
        tutorials: "Tutoriales",
        tutorialsDesc: "Aprende lo básico",
        progress: "Mi Progreso",
        progressDesc: "Mira tus logros",
        settings: "Configuración",
        settingsDesc: "Ajusta tu piano",
        arcade: "Arcade",
        arcadeDesc: "Juega minijuegos divertidos",
        rewards: "Tienda de recompensas",
        rewardsDesc: "¡Gasta tus XP!",
        webxr: "Piano WebXR",
        webxrDesc: "Modo de realidad virtual",
        duet: "Modo dúo",
        duetDesc: "Multijugador en tiempo real"
      },
      onboarding: {
        welcome: "¡Bienvenido a Pianio! 🎹",
        subtitle: "Vamos a personalizar tu viaje musical.",
        whatsYourName: "¿Cuál es tu nombre?",
        next: "Siguiente",
        letsGo: "¡Vamos!",
        ageGroup: "¿Cuántos años tienes?",
        kids: "Niño (4-8)",
        teens: "Adolescente (9-15)",
        adult: "Adulto (16+)",
        goal: "¿Cuál es tu objetivo principal?",
        fun: "Solo por diversión",
        learn: "Aprender en serio",
        songs: "Tocar canciones favoritas",
      },
      settings: {
        language: "Idioma (Language)"
      },
      settingsPage: {
        back: "Volver",
        title: "Ajustes",
        subtitle: "Personaliza tu experiencia de aprendizaje",
        tabs: {
          account: "Perfil",
          preferences: "Preferencias",
        },
        profile: {
          level: "Nivel",
          xp: "XP",
          streak: "Racha",
          minutesPerDay: "Min/día",
        },
        personalization: {
          title: "Personalización",
          subtitle: "Ajusta las recomendaciones cuando quieras.",
          ageGroup: "¿Cuál es tu grupo de edad?",
          skillLevel: "¿Cuál es tu nivel?",
          learningGoal: "¿Cuál es tu objetivo principal?",
          practiceFrequency: "¿Con qué frecuencia practicarás?",
          favoriteGenres: "Géneros favoritos",
        },
        groups: {
          display: "Pantalla",
          audio: "Audio",
          animation: "Animación",
          localization: "Idioma",
        },
        settings: {
          showKeyboardLabels: "Mostrar etiquetas del teclado",
          showNoteNames: "Mostrar nombres de notas",
          useSharps: "Usar sostenidos (en lugar de bemoles)",
          darkMode: "Modo oscuro",
          backgroundMusic: "Música de fondo",
          audioVolume: "Volumen",
          inputMode: "Entrada de lección",
          animationSpeed: "Velocidad de animación",
          language: "Idioma",
        },
        inputMode: {
          midi: "Teclado MIDI",
          microphone: "Micrófono",
          auto: "Auto",
        },
        languageOptions: {
          en: "English",
          zh: "中文 (Mandarin)",
          ja: "日本語 (Japanese)",
          de: "Deutsch",
          es: "Español",
        },
        reset: "Restablecer valores"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
