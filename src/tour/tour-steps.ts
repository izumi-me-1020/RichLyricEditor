import type { DriveStep } from "driver.js";
import { useAudioStore } from "@/stores/audio";
import { useProjectStore } from "@/stores/project";
import { MOD_KEY } from "@/utils/platform";

// -- Types --------------------------------------------------------------------

interface GatedStep {
  stepIndex: number;
  task: string;
  gateCheck: () => boolean;
  tabId: string;
}

// -- Helpers ------------------------------------------------------------------

function switchTab(tabId: string) {
  useProjectStore
    .getState()
    .setActiveTab(
      tabId as "import" | "edit" | "sync" | "timeline" | "preview" | "export",
    );
}

const YOUTUBE_EMBED_HTML = `<div class="composer-tour-video-embed"><iframe src="https://www.youtube.com/embed/to138zXZ0nc?rel=0" title="RichLyricEditor デモ" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" sandbox="allow-scripts allow-same-origin allow-presentation allow-popups" allowfullscreen></iframe></div>`;

// -- Gate checks --------------------------------------------------------------

const gateAudioLoaded = () => useAudioStore.getState().source !== null;
const gateLyricsExist = () => useProjectStore.getState().lines.length > 0;
const gateFirstLineSynced = () => {
  const lines = useProjectStore.getState().lines;
  return lines.length > 0 && lines[0]?.begin !== undefined;
};

// -- Tour Steps ---------------------------------------------------------------

function createTourSteps(): DriveStep[] {
  return [
    // 0: Welcome
    {
      popover: {
        title: "RichLyricEditor へようこそ",
        description:
          "TTML 形式の同期歌詞を作成するためのツールです。基本の流れを一緒に見ていきましょう。",
        popoverClass: "composer-tour composer-tour-modal",
        showButtons: ["next", "close"],
        showProgress: false,
      },
    },
    // 1: Import tab
    {
      element: () =>
        document.querySelector('[data-tour="import-dropzone"]') as Element,
      popover: {
        title: "音声を読み込む",
        description:
          "このエリアに音声ファイル（MP3, WAV, M4A, OGG, FLAC）をドロップするか、下に YouTube URL を貼り付けて動画から音声を取り込めます。",
        side: "bottom",
        align: "center",
      },
      onHighlightStarted: () => switchTab("import"),
    },
    // 2: GATED - wait for audio
    {
      element: () =>
        document.querySelector('[data-tour="import-dropzone"]') as Element,
      popover: {
        title: "音声を読み込んでください",
        description: "続けるには音声ファイルをドロップするか、YouTube URL を貼り付けてください。",
        showButtons: [],
      },
      onHighlightStarted: () => switchTab("import"),
    },
    // 3: Edit tab
    {
      element: () =>
        document.querySelector('[data-tour="edit-panel"]') as Element,
      popover: {
        title: "歌詞を入力または貼り付け",
        description:
          "左側のテキストエリアに歌詞を入力してください。各行が同期対象になります。",
        side: "right",
        align: "start",
      },
      onHighlightStarted: () => switchTab("edit"),
    },
    // 4: GATED - wait for lyrics
    {
      element: () =>
        document.querySelector('[data-tour="edit-panel"]') as Element,
      popover: {
        title: "歌詞を追加してください",
        description: "続けるには 1 行以上の歌詞を入力または貼り付けてください。",
        showButtons: [],
      },
      onHighlightStarted: () => switchTab("edit"),
    },
    // 5: Sync tab
    {
      element: () =>
        document.querySelector('[data-tour="sync-panel"]') as Element,
      popover: {
        title: "歌詞を同期する",
        description:
          "Start を押して、各行または単語のタイミングに合わせて Space を押します。粒度の切り替えで行単位と単語単位を選べます。",
        side: "left",
        align: "start",
      },
      onHighlightStarted: () => switchTab("sync"),
    },
    // 6: GATED - wait for first line synced
    {
      element: () =>
        document.querySelector('[data-tour="sync-panel"]') as Element,
      popover: {
        title: "少なくとも 1 行同期する",
        description:
          "Start を押して音声を再生し、Space を押してタイミングを設定してください。",
        showButtons: [],
      },
      onHighlightStarted: () => switchTab("sync"),
    },
    // 7: Timeline tab
    {
      element: () =>
        document.querySelector('[data-tour="timeline-panel"]') as Element,
      popover: {
        title: "Timeline で微調整",
        description: `単語をドラッグしてタイミングを調整したり、選択して矢印キーで少しずつ移動できます。${MOD_KEY} + スクロールでズーム、F で再生ヘッド追従を切り替えます。繰り返し部分は ${MOD_KEY}+G でグループ化し、${MOD_KEY}+D でリンク付きインスタンスとして複製すると、編集をまとめて反映できます。`,
        side: "top",
        align: "center",
      },
      onHighlightStarted: () => switchTab("timeline"),
    },
    // 8: Preview tab
    {
      element: () =>
        document.querySelector('[data-tour="preview-panel"]') as Element,
      popover: {
        title: "プレビューで確認",
        description:
          "歌詞が音声に合わせて再生される様子を確認できます。任意の行をクリックするとその位置へ移動します。",
        side: "left",
        align: "start",
      },
      onHighlightStarted: () => switchTab("preview"),
    },
    // 9: Export tab
    {
      element: () =>
        document.querySelector('[data-tour="export-panel"]') as Element,
      popover: {
        title: "TTML を書き出す",
        description:
          "完成した TTML ファイルをコピーまたはダウンロードできます。プロジェクト全体を JSON として書き出すこともできます。",
        side: "left",
        align: "start",
      },
      onHighlightStarted: () => switchTab("export"),
    },
    // 10: Outro with video
    {
      popover: {
        title: "全体の流れを見る",
        description: `これで準備完了です。作業の流れ全体を動画で確認できます。${YOUTUBE_EMBED_HTML}`,
        popoverClass: "composer-tour composer-tour-video",
        showButtons: ["previous", "close"],
        doneBtnText: "完了",
        showProgress: false,
      },
    },
  ];
}

// -- Gated Steps Config -------------------------------------------------------

const TOUR_GATED_STEPS: GatedStep[] = [
  {
    stepIndex: 2,
    task: "音声ファイルをドロップ",
    gateCheck: gateAudioLoaded,
    tabId: "import",
  },
  {
    stepIndex: 4,
    task: "歌詞を入力または貼り付け",
    gateCheck: gateLyricsExist,
    tabId: "edit",
  },
  {
    stepIndex: 6,
    task: "少なくとも 1 行同期する",
    gateCheck: gateFirstLineSynced,
    tabId: "sync",
  },
];

// -- Exports ------------------------------------------------------------------

export { createTourSteps, TOUR_GATED_STEPS };
export type { GatedStep };
