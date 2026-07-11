import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation strings
const resources = {
  en: {
    translation: {
      home: {
        welcome: "Hello, {{name}}! 🎹",
        tagline: "Let's make some music!",
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
        settingsDesc: "Tweak your piano"
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
        settingsDesc: "调整你的钢琴"
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
        settingsDesc: "ピアノを調整する"
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
        settingsDesc: "Klavier anpassen"
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
        settingsDesc: "Ajusta tu piano"
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
