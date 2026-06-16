// HTTP client for the optional companion `composer-bridge` Go binary that
// users run locally to extract YouTube audio through their residential IP.
// See `experiments/composer-bridge/README.md` for what the binary is.
import { t } from "@/language/i18n";

const DEFAULT_BRIDGE_URL = "http://localhost:7777";
const HEALTH_QUERY_KEY = "composer-bridge-health";
const HEALTH_TIMEOUT_MS = 1500;
const AUDIO_TIMEOUT_MS = 5 * 60 * 1000;
const THUMB_TIMEOUT_MS = 15 * 1000;

// composeAbortSignals returns an AbortSignal that aborts when EITHER input
// aborts. Falls back to a manual listener pair when AbortSignal.any is missing
// so a caller-provided signal still propagates to the underlying fetch.
function composeAbortSignals(
  a: AbortSignal | undefined,
  b: AbortSignal,
): AbortSignal {
  if (!a) return b;
  const composed = AbortSignal.any?.([a, b]);
  if (composed) return composed;
  const local = new AbortController();
  const abortLocal = () => local.abort();
  if (a.aborted) local.abort();
  else a.addEventListener("abort", abortLocal, { once: true });
  if (b.aborted) local.abort();
  else b.addEventListener("abort", abortLocal, { once: true });
  return local.signal;
}

interface BridgeHealth {
  bridge: string;
  ytdlp: string;
  status: string;
}

interface BridgeAudio {
  buffer: ArrayBuffer;
  mimeType: string;
  title?: string;
  artist?: string;
  album?: string;
}

class BridgeError extends Error {
  readonly code: "unreachable" | "http" | "empty" | "timeout";
  readonly status?: number;

  constructor(code: BridgeError["code"], message: string, status?: number) {
    super(message);
    this.name = "BridgeError";
    this.code = code;
    this.status = status;
  }
}

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

// decodeHeader undoes the percent-encoding the bridge applies to UTF-8 header
// values so they survive the Latin-1 byte path of HTTP headers.
function decodeHeader(value: string | null): string | undefined {
  if (!value) return undefined;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

async function checkBridgeHealth(
  baseUrl: string,
  signal?: AbortSignal,
): Promise<BridgeHealth> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), HEALTH_TIMEOUT_MS);
  const composed = composeAbortSignals(signal, controller.signal);
  try {
    const res = await fetch(`${normalizeBaseUrl(baseUrl)}/health`, {
      signal: composed,
    });
    if (!res.ok)
      throw new BridgeError("http", `health: ${res.status}`, res.status);
    return (await res.json()) as BridgeHealth;
  } catch (err) {
    if (err instanceof BridgeError) throw err;
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new BridgeError("timeout", "bridge health timed out");
    }
    throw new BridgeError(
      "unreachable",
      err instanceof Error ? err.message : "unreachable",
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

async function getAudioFromBridge(
  baseUrl: string,
  videoId: string,
  signal?: AbortSignal,
): Promise<BridgeAudio> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), AUDIO_TIMEOUT_MS);
  const composed = composeAbortSignals(signal, controller.signal);
  try {
    const res = await fetch(
      `${normalizeBaseUrl(baseUrl)}/audio/${encodeURIComponent(videoId)}`,
      {
        signal: composed,
      },
    );
    if (!res.ok)
      throw new BridgeError("http", `bridge audio: ${res.status}`, res.status);
    const buffer = await res.arrayBuffer();
    if (buffer.byteLength === 0)
      throw new BridgeError("empty", "bridge returned empty audio");
    return {
      buffer,
      mimeType: res.headers.get("content-type") ?? "audio/mp4",
      title: decodeHeader(res.headers.get("x-track-title")),
      artist: decodeHeader(res.headers.get("x-track-artist")),
      album: decodeHeader(res.headers.get("x-track-album")),
    };
  } catch (err) {
    if (err instanceof BridgeError) throw err;
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new BridgeError("timeout", "bridge audio timed out");
    }
    throw new BridgeError(
      "unreachable",
      err instanceof Error ? err.message : "unreachable",
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

async function getThumbFromBridge(
  baseUrl: string,
  videoId: string,
  signal?: AbortSignal,
): Promise<string | undefined> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), THUMB_TIMEOUT_MS);
  const composed = composeAbortSignals(signal, controller.signal);
  try {
    const res = await fetch(
      `${normalizeBaseUrl(baseUrl)}/thumb/${encodeURIComponent(videoId)}`,
      { signal: composed },
    );
    if (!res.ok) return undefined;
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () =>
        resolve(typeof reader.result === "string" ? reader.result : "");
      reader.onerror = () =>
        reject(reader.error ?? new Error("FileReader failed"));
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError")
      return undefined;
    return undefined;
  } finally {
    clearTimeout(timeoutId);
  }
}

function extensionForBridgeMime(mimeType: string): string {
  const m = mimeType.toLowerCase();
  if (m.includes("opus")) return "opus";
  if (m.includes("webm")) return "webm";
  if (m.includes("ogg")) return "ogg";
  if (m.includes("mp4") || m.includes("m4a") || m.includes("aac")) return "m4a";
  if (m.includes("mpeg") || m.includes("mp3")) return "mp3";
  return "audio";
}

function buildBridgeAudioFile(
  buffer: ArrayBuffer,
  mimeType: string,
  videoId: string,
): File {
  return new File([buffer], `${videoId}.${extensionForBridgeMime(mimeType)}`, {
    type: mimeType,
  });
}

interface BridgeToastOptions {
  preferDesktopInstall?: boolean;
}

function formatBridgeErrorForToast(
  err: unknown,
  options: BridgeToastOptions = {},
): string {
  if (options.preferDesktopInstall) {
    return t(
      "パソコンでは Composer Bridge をインストールして起動してください。Settings → Advanced から設定できます。",
    );
  }
  if (err instanceof BridgeError) {
    switch (err.code) {
      case "unreachable":
        return t(
          "Couldn't fetch YouTube audio with yt-dlp. Start ComposerBridge from Settings → Advanced and try again.",
        );
      case "timeout":
        return t(
          "yt-dlp timed out while fetching YouTube audio. Check ComposerBridge, then try again.",
        );
      case "empty":
        return t(
          "yt-dlp returned no audio for this video. Start ComposerBridge from Settings → Advanced and try again.",
        );
      case "http":
        return t(
          "ComposerBridge failed to fetch YouTube audio (HTTP {{status}}). Check the bridge console, then try again.",
          { status: err.status ?? "unknown" },
        );
    }
  }
  return t(
    "Couldn't fetch YouTube audio with yt-dlp. Start ComposerBridge from Settings → Advanced and try again.",
  );
}

export {
  DEFAULT_BRIDGE_URL,
  HEALTH_QUERY_KEY,
  BridgeError,
  checkBridgeHealth,
  getAudioFromBridge,
  getThumbFromBridge,
  formatBridgeErrorForToast,
  composeAbortSignals,
  normalizeBaseUrl,
  decodeHeader,
  extensionForBridgeMime,
  buildBridgeAudioFile,
};
export type { BridgeHealth, BridgeAudio };
