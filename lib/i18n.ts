export type Language = "en" | "ja";

export interface Translations {
  common: {
    save: string;
    cancel: string;
    delete: string;
    back: string;
    settings: string;
    home: string;
    error: string;
    success: string;
    loading: string;
  };
  home: {
    title: string;
    subtitle: string;
    newTerminal: string;
    newTerminalDesc: string;
    guiViewer: string;
    guiViewerDesc: string;
    fileManager: string;
    fileManagerDesc: string;
    termuxIntegration: string;
    termuxIntegrationDesc: string;
    savedSessions: string;
    noSessions: string;
    noSessionsDesc: string;
  };
  terminal: {
    title: string;
    termuxMode: string;
    termuxModeDesc: string;
    termuxNotInstalled: string;
    simulationMode: string;
    welcome: string;
    welcomeDesc: string;
    termuxDetected: string;
    termuxNotDetected: string;
    enterCommand: string;
    history: string;
    sessionSaved: string;
    sessionSaveError: string;
  };
  fileManager: {
    title: string;
    newFolder: string;
    newFile: string;
    emptyDirectory: string;
    emptyDirectoryDesc: string;
    folder: string;
    file: string;
    view: string;
    rename: string;
    delete: string;
    deleteConfirm: string;
    renamePrompt: string;
    createFolderPrompt: string;
    createFilePrompt: string;
    fileExists: string;
    items: string;
    longPressOptions: string;
  };
  guiViewer: {
    title: string;
    vncSettings: string;
    host: string;
    port: string;
    password: string;
    connect: string;
    connectionSettings: string;
    enterHost: string;
    enterPort: string;
    enterPassword: string;
  };
  termuxSetup: {
    title: string;
    integrationStatus: string;
    checking: string;
    termuxInstalled: string;
    termuxAPI: string;
    urlScheme: string;
    commandExecution: string;
    openTermux: string;
    installTermux: string;
    setupInstructions: string;
    step1: string;
    step1Desc: string;
    step2: string;
    step2Desc: string;
    step3: string;
    step3Desc: string;
    step4: string;
    step4Desc: string;
    features: string;
    documentation: string;
    wiki: string;
    termuxNotDetected: string;
    termuxNotDetectedDesc: string;
  };
  settings: {
    title: string;
    general: string;
    theme: string;
    language: string;
    terminal: string;
    fontSize: string;
    colorScheme: string;
    about: string;
    version: string;
    description: string;
    features: string;
    note: string;
    noteDesc: string;
    light: string;
    dark: string;
    system: string;
    small: string;
    medium: string;
    large: string;
    extraLarge: string;
    default: string;
    blue: string;
    amber: string;
    japanese: string;
    english: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    common: {
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      back: "Back",
      settings: "Settings",
      home: "Home",
      error: "Error",
      success: "Success",
      loading: "Loading",
    },
    home: {
      title: "Lindroid",
      subtitle: "Linux Terminal Emulator with GUI Support",
      newTerminal: "New Terminal Session",
      newTerminalDesc: "Start a new Linux terminal",
      guiViewer: "GUI Viewer",
      guiViewerDesc: "Connect to VNC/X11 display",
      fileManager: "File Manager",
      fileManagerDesc: "Browse Linux filesystem",
      termuxIntegration: "Termux Integration",
      termuxIntegrationDesc: "Setup real Linux shell",
      savedSessions: "Saved Sessions",
      noSessions: "No saved sessions yet",
      noSessionsDesc: "Create a terminal session and save it to see it here",
    },
    terminal: {
      title: "Terminal",
      termuxMode: "Termux Mode",
      termuxModeDesc: "Execute commands in real Termux shell",
      termuxNotInstalled: "Termux not installed - tap to learn more",
      simulationMode: "Simulation mode: Type 'help' for available commands",
      welcome: "Welcome to Lindroid Terminal Emulator",
      welcomeDesc: "Termux mode: Commands will be sent to Termux app",
      termuxDetected: "✓ Termux detected - Toggle Termux mode above",
      termuxNotDetected: "⚠ Termux not installed - Using simulation mode",
      enterCommand: "Enter command...",
      history: "History",
      sessionSaved: "Session saved successfully",
      sessionSaveError: "Failed to save session",
    },
    fileManager: {
      title: "File Manager",
      newFolder: "New Folder",
      newFile: "New File",
      emptyDirectory: "Empty directory",
      emptyDirectoryDesc: "Create a new file or folder to get started",
      folder: "Folder",
      file: "File",
      view: "View",
      rename: "Rename",
      delete: "Delete",
      deleteConfirm: "Are you sure you want to delete",
      renamePrompt: "Enter new name for",
      createFolderPrompt: "Enter folder name",
      createFilePrompt: "Enter file name",
      fileExists: "A file or directory with that name already exists",
      items: "items",
      longPressOptions: "Long press for options",
    },
    guiViewer: {
      title: "GUI Viewer",
      vncSettings: "VNC Settings",
      host: "Host",
      port: "Port",
      password: "Password",
      connect: "Connect",
      connectionSettings: "Connection Settings",
      enterHost: "Enter VNC host address",
      enterPort: "Enter VNC port (default: 5900)",
      enterPassword: "Enter VNC password (optional)",
    },
    termuxSetup: {
      title: "Termux Setup",
      integrationStatus: "Integration Status",
      checking: "Checking Termux installation...",
      termuxInstalled: "Termux Installed",
      termuxAPI: "Termux:API",
      urlScheme: "URL Scheme",
      commandExecution: "Command Execution",
      openTermux: "Open Termux",
      installTermux: "Install Termux",
      setupInstructions: "Setup Instructions",
      step1: "1. Install Termux",
      step1Desc: "Download Termux from F-Droid (recommended) or Google Play Store.",
      step2: "2. Initial Setup",
      step2Desc: "Open Termux and run: pkg update && pkg upgrade",
      step3: "3. Storage Access (Optional)",
      step3Desc: "Grant storage permissions: termux-setup-storage",
      step4: "4. Install Termux:API (Optional)",
      step4Desc: "For advanced features, install Termux:API from F-Droid or Play Store",
      features: "What You Can Do with Termux",
      documentation: "Termux Documentation",
      wiki: "Termux Wiki",
      termuxNotDetected: "⚠ Termux not detected",
      termuxNotDetectedDesc: "Install Termux to use real Linux shell features.",
    },
    settings: {
      title: "Settings",
      general: "General",
      theme: "Theme",
      language: "Language",
      terminal: "Terminal",
      fontSize: "Font Size",
      colorScheme: "Color Scheme",
      about: "About",
      version: "Version",
      description: "A Linux terminal emulator with GUI support for mobile devices.",
      features: "Features:",
      note: "Note:",
      noteDesc: "This app provides a simulated Linux environment. For full native Linux support, consider using Termux or similar solutions.",
      light: "Light",
      dark: "Dark",
      system: "System",
      small: "Small (12)",
      medium: "Medium (14)",
      large: "Large (16)",
      extraLarge: "Extra Large (18)",
      default: "Default (Green)",
      blue: "Blue",
      amber: "Amber",
      japanese: "日本語",
      english: "English",
    },
  },
  ja: {
    common: {
      save: "保存",
      cancel: "キャンセル",
      delete: "削除",
      back: "戻る",
      settings: "設定",
      home: "ホーム",
      error: "エラー",
      success: "成功",
      loading: "読み込み中",
    },
    home: {
      title: "Lindroid",
      subtitle: "GUIサポート付きLinuxターミナルエミュレータ",
      newTerminal: "新しいターミナルセッション",
      newTerminalDesc: "新しいLinuxターミナルを開始",
      guiViewer: "GUIビューア",
      guiViewerDesc: "VNC/X11ディスプレイに接続",
      fileManager: "ファイルマネージャー",
      fileManagerDesc: "Linuxファイルシステムを参照",
      termuxIntegration: "Termux統合",
      termuxIntegrationDesc: "実際のLinuxシェルをセットアップ",
      savedSessions: "保存済みセッション",
      noSessions: "保存済みセッションはありません",
      noSessionsDesc: "ターミナルセッションを作成して保存すると、ここに表示されます",
    },
    terminal: {
      title: "ターミナル",
      termuxMode: "Termuxモード",
      termuxModeDesc: "実際のTermuxシェルでコマンドを実行",
      termuxNotInstalled: "Termuxがインストールされていません - タップして詳細を確認",
      simulationMode: "シミュレーションモード: 'help'を入力して利用可能なコマンドを表示",
      welcome: "Lindroidターミナルエミュレータへようこそ",
      welcomeDesc: "Termuxモード: コマンドはTermuxアプリに送信されます",
      termuxDetected: "✓ Termuxが検出されました - 上のTermuxモードを切り替え",
      termuxNotDetected: "⚠ Termuxがインストールされていません - シミュレーションモードを使用中",
      enterCommand: "コマンドを入力...",
      history: "履歴",
      sessionSaved: "セッションが正常に保存されました",
      sessionSaveError: "セッションの保存に失敗しました",
    },
    fileManager: {
      title: "ファイルマネージャー",
      newFolder: "新規フォルダ",
      newFile: "新規ファイル",
      emptyDirectory: "空のディレクトリ",
      emptyDirectoryDesc: "新しいファイルまたはフォルダを作成して開始します",
      folder: "フォルダ",
      file: "ファイル",
      view: "表示",
      rename: "名前変更",
      delete: "削除",
      deleteConfirm: "本当に削除しますか",
      renamePrompt: "新しい名前を入力してください",
      createFolderPrompt: "フォルダ名を入力してください",
      createFilePrompt: "ファイル名を入力してください",
      fileExists: "その名前のファイルまたはディレクトリは既に存在します",
      items: "個のアイテム",
      longPressOptions: "長押しでオプションを表示",
    },
    guiViewer: {
      title: "GUIビューア",
      vncSettings: "VNC設定",
      host: "ホスト",
      port: "ポート",
      password: "パスワード",
      connect: "接続",
      connectionSettings: "接続設定",
      enterHost: "VNCホストアドレスを入力",
      enterPort: "VNCポートを入力(デフォルト: 5900)",
      enterPassword: "VNCパスワードを入力(オプション)",
    },
    termuxSetup: {
      title: "Termuxセットアップ",
      integrationStatus: "統合ステータス",
      checking: "Termuxのインストールを確認中...",
      termuxInstalled: "Termuxがインストール済み",
      termuxAPI: "Termux:API",
      urlScheme: "URLスキーム",
      commandExecution: "コマンド実行",
      openTermux: "Termuxを開く",
      installTermux: "Termuxをインストール",
      setupInstructions: "セットアップ手順",
      step1: "1. Termuxをインストール",
      step1Desc: "F-Droid(推奨)またはGoogle Play Storeからダウンロード",
      step2: "2. 初期セットアップ",
      step2Desc: "Termuxを開いて実行: pkg update && pkg upgrade",
      step3: "3. ストレージアクセス(オプション)",
      step3Desc: "ストレージ権限を付与: termux-setup-storage",
      step4: "4. Termux:APIをインストール(オプション)",
      step4Desc: "高度な機能を使用するには、F-DroidまたはPlay StoreからTermux:APIをインストール",
      features: "Termuxでできること",
      documentation: "Termuxドキュメント",
      wiki: "Termux Wiki",
      termuxNotDetected: "⚠ Termuxが検出されません",
      termuxNotDetectedDesc: "実際のLinuxシェル機能を使用するにはTermuxをインストールしてください。",
    },
    settings: {
      title: "設定",
      general: "一般",
      theme: "テーマ",
      language: "言語",
      terminal: "ターミナル",
      fontSize: "フォントサイズ",
      colorScheme: "カラースキーム",
      about: "について",
      version: "バージョン",
      description: "モバイルデバイス向けのGUIサポート付きLinuxターミナルエミュレータ",
      features: "機能:",
      note: "注意:",
      noteDesc: "このアプリはシミュレートされたLinux環境を提供します。完全なネイティブLinuxサポートについては、Termuxなどのソリューションの使用を検討してください。",
      light: "ライト",
      dark: "ダーク",
      system: "システム",
      small: "小 (12)",
      medium: "中 (14)",
      large: "大 (16)",
      extraLarge: "特大 (18)",
      default: "デフォルト (緑)",
      blue: "青",
      amber: "琥珀色",
      japanese: "日本語",
      english: "English",
    },
  },
};

export function getTranslations(language: Language): Translations {
  return translations[language];
}
