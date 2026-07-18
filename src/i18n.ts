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
