import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  BridgeError,
  buildBridgeAudioFile,
  composeAbortSignals,
  decodeHeader,
  extensionForBridgeMime,
  formatBridgeErrorForToast,
  normalizeBaseUrl,
} from "@/utils/composer-bridge-api";

// -- normalizeBaseUrl ---------------------------------------------------------

describe("normalizeBaseUrl", () => {
  it("preserves an already-clean URL", () => {
    expect(normalizeBaseUrl("http://localhost:7777")).toBe(
      "http://localhost:7777",
    );
  });

  it("strips a single trailing slash", () => {
    expect(normalizeBaseUrl("http://localhost:7777/")).toBe(
      "http://localhost:7777",
    );
  });

  it("strips repeated trailing slashes", () => {
    expect(normalizeBaseUrl("http://localhost:7777////")).toBe(
      "http://localhost:7777",
    );
  });

  it("leaves an empty string empty", () => {
    expect(normalizeBaseUrl("")).toBe("");
  });

  it("does not touch internal slashes", () => {
    expect(normalizeBaseUrl("http://example.com/path/to/")).toBe(
      "http://example.com/path/to",
    );
  });
});

// -- decodeHeader -------------------------------------------------------------

describe("decodeHeader", () => {
  it("returns undefined for null", () => {
    expect(decodeHeader(null)).toBeUndefined();
  });

  it("returns undefined for empty string (treated as missing header)", () => {
    expect(decodeHeader("")).toBeUndefined();
  });

  it("decodes percent-encoded ASCII", () => {
    expect(decodeHeader("hello%20world")).toBe("hello world");
  });

  it("decodes percent-encoded UTF-8 (the fullwidth comma the bridge had to escape)", () => {
    expect(decodeHeader("Tyler%EF%BC%8C%20The%20Creator")).toBe(
      "Tyler， The Creator",
    );
  });

  it("returns the raw string when decoding throws (malformed percent sequence)", () => {
    expect(decodeHeader("bad%ZZencoding")).toBe("bad%ZZencoding");
  });

  it("returns the raw string for an unencoded value with no percent signs", () => {
    expect(decodeHeader("plain text")).toBe("plain text");
  });
});

// -- extensionForBridgeMime ---------------------------------------------------

describe("extensionForBridgeMime", () => {
  it("maps audio/opus to opus", () => {
    expect(extensionForBridgeMime("audio/opus")).toBe("opus");
  });

  it("maps webm with an opus codec hint to opus (regression for the most common bridge default)", () => {
    expect(extensionForBridgeMime("audio/webm; codecs=opus")).toBe("opus");
  });

  it("maps plain audio/webm to webm", () => {
    expect(extensionForBridgeMime("audio/webm")).toBe("webm");
  });

  it("maps audio/ogg to ogg", () => {
    expect(extensionForBridgeMime("audio/ogg")).toBe("ogg");
  });

  it("maps audio/mp4 to m4a", () => {
    expect(extensionForBridgeMime("audio/mp4")).toBe("m4a");
  });

  it("maps audio/m4a to m4a", () => {
    expect(extensionForBridgeMime("audio/m4a")).toBe("m4a");
  });

  it("maps audio/aac to m4a (AAC bitstream gets the m4a container conventionally)", () => {
    expect(extensionForBridgeMime("audio/aac")).toBe("m4a");
  });

  it("maps audio/mpeg to mp3", () => {
    expect(extensionForBridgeMime("audio/mpeg")).toBe("mp3");
  });

  it("maps audio/mp3 to mp3", () => {
    expect(extensionForBridgeMime("audio/mp3")).toBe("mp3");
  });

  it("falls back to 'audio' for unknown mime", () => {
    expect(extensionForBridgeMime("application/octet-stream")).toBe("audio");
  });

  it("falls back to 'audio' for empty mime", () => {
    expect(extensionForBridgeMime("")).toBe("audio");
  });

  it("matches case-insensitively (regression: server may report uppercase)", () => {
    expect(extensionForBridgeMime("AUDIO/OPUS")).toBe("opus");
    expect(extensionForBridgeMime("Audio/WebM")).toBe("webm");
  });

  it("prefers opus over webm when both substrings are present (regression for the .m4a-mislabel bug)", () => {
    expect(extensionForBridgeMime("audio/webm; codecs=opus")).toBe("opus");
  });
});

// -- buildBridgeAudioFile -----------------------------------------------------

describe("buildBridgeAudioFile", () => {
  const buffer = new TextEncoder().encode("hello bridge").buffer;

  it("builds a File named <videoId>.<ext> with the bridge mime as File.type", () => {
    const file = buildBridgeAudioFile(buffer, "audio/opus", "dQw4w9WgXcQ");
    expect(file.name).toBe("dQw4w9WgXcQ.opus");
    expect(file.type).toBe("audio/opus");
  });

  it("preserves the byte payload byte-for-byte", async () => {
    const file = buildBridgeAudioFile(buffer, "audio/opus", "x");
    const bytes = new Uint8Array(await file.arrayBuffer());
    expect(new TextDecoder().decode(bytes)).toBe("hello bridge");
  });

  it("falls back to .audio when mime is unknown", () => {
    const file = buildBridgeAudioFile(buffer, "application/octet-stream", "id");
    expect(file.name).toBe("id.audio");
    expect(file.type).toBe("application/octet-stream");
  });

  it("yields .m4a for audio/mp4 (this is the only case where m4a is correct)", () => {
    const file = buildBridgeAudioFile(buffer, "audio/mp4", "id");
    expect(file.name).toBe("id.m4a");
    expect(file.type).toBe("audio/mp4");
  });

  it("yields .webm not .m4a for plain webm (regression for the file-label bug)", () => {
    const file = buildBridgeAudioFile(buffer, "audio/webm", "id");
    expect(file.name).toBe("id.webm");
    expect(file.type).toBe("audio/webm");
  });

  it("yields .opus for opus, not .m4a (regression for the file-label bug)", () => {
    const file = buildBridgeAudioFile(buffer, "audio/opus", "id");
    expect(file.name).toBe("id.opus");
    expect(file.type).toBe("audio/opus");
  });
});

// -- composeAbortSignals ------------------------------------------------------

describe("composeAbortSignals", () => {
  it("returns the second signal verbatim when no first signal is provided", () => {
    const ctrl = new AbortController();
    expect(composeAbortSignals(undefined, ctrl.signal)).toBe(ctrl.signal);
  });

  describe("with AbortSignal.any available (modern browsers)", () => {
    it("aborts when the caller signal aborts", () => {
      const caller = new AbortController();
      const timeout = new AbortController();
      const composed = composeAbortSignals(caller.signal, timeout.signal);
      expect(composed.aborted).toBe(false);
      caller.abort();
      expect(composed.aborted).toBe(true);
    });

    it("aborts when the timeout signal aborts", () => {
      const caller = new AbortController();
      const timeout = new AbortController();
      const composed = composeAbortSignals(caller.signal, timeout.signal);
      timeout.abort();
      expect(composed.aborted).toBe(true);
    });

    it("starts already aborted if the caller signal is already aborted", () => {
      const caller = new AbortController();
      caller.abort();
      const timeout = new AbortController();
      const composed = composeAbortSignals(caller.signal, timeout.signal);
      expect(composed.aborted).toBe(true);
    });
  });

  describe("with AbortSignal.any unavailable (older Safari fallback)", () => {
    let originalAny: typeof AbortSignal.any;

    beforeEach(() => {
      originalAny = AbortSignal.any;
      (AbortSignal as unknown as { any: unknown }).any = undefined;
    });

    afterEach(() => {
      (AbortSignal as unknown as { any: typeof AbortSignal.any }).any =
        originalAny;
    });

    it("aborts when the caller signal aborts (regression for the dropped-caller-signal bug)", () => {
      const caller = new AbortController();
      const timeout = new AbortController();
      const composed = composeAbortSignals(caller.signal, timeout.signal);
      expect(composed.aborted).toBe(false);
      caller.abort();
      expect(composed.aborted).toBe(true);
    });

    it("aborts when the timeout signal aborts", () => {
      const caller = new AbortController();
      const timeout = new AbortController();
      const composed = composeAbortSignals(caller.signal, timeout.signal);
      timeout.abort();
      expect(composed.aborted).toBe(true);
    });

    it("starts already aborted if the caller signal is already aborted at call time", () => {
      const caller = new AbortController();
      caller.abort();
      const timeout = new AbortController();
      const composed = composeAbortSignals(caller.signal, timeout.signal);
      expect(composed.aborted).toBe(true);
    });

    it("starts already aborted if the timeout signal is already aborted at call time", () => {
      const caller = new AbortController();
      const timeout = new AbortController();
      timeout.abort();
      const composed = composeAbortSignals(caller.signal, timeout.signal);
      expect(composed.aborted).toBe(true);
    });

    it("starts already aborted if both signals were aborted before composition", () => {
      const caller = new AbortController();
      caller.abort();
      const timeout = new AbortController();
      timeout.abort();
      const composed = composeAbortSignals(caller.signal, timeout.signal);
      expect(composed.aborted).toBe(true);
    });

    it("only aborts the returned signal once per source (does not blow up if both fire)", () => {
      const caller = new AbortController();
      const timeout = new AbortController();
      const composed = composeAbortSignals(caller.signal, timeout.signal);
      const handler = vi.fn();
      composed.addEventListener("abort", handler);
      caller.abort();
      timeout.abort();
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });
});

// -- BridgeError --------------------------------------------------------------

describe("BridgeError", () => {
  it("stores code, message, and optional status", () => {
    const err = new BridgeError("http", "bridge audio: 502", 502);
    expect(err.code).toBe("http");
    expect(err.message).toBe("bridge audio: 502");
    expect(err.status).toBe(502);
    expect(err.name).toBe("BridgeError");
  });

  it("works without a status", () => {
    const err = new BridgeError("unreachable", "connection refused");
    expect(err.code).toBe("unreachable");
    expect(err.status).toBeUndefined();
  });

  it("is throwable and instanceof Error", () => {
    expect(() => {
      throw new BridgeError("empty", "no audio");
    }).toThrow(BridgeError);
    try {
      throw new BridgeError("empty", "no audio");
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e).toBeInstanceOf(BridgeError);
    }
  });
});

// -- formatBridgeErrorForToast ------------------------------------------------

describe("formatBridgeErrorForToast", () => {
  it("returns a start-the-bridge message for 'unreachable'", () => {
    const msg = formatBridgeErrorForToast(
      new BridgeError("unreachable", "ECONNREFUSED"),
    );
    expect(msg).toMatch(/Start ComposerBridge/);
  });

  it("returns a timeout message for 'timeout'", () => {
    const msg = formatBridgeErrorForToast(
      new BridgeError("timeout", "deadline exceeded"),
    );
    expect(msg).toMatch(/yt-dlp timed out/);
  });

  it("returns a bridge-start message for 'empty'", () => {
    const msg = formatBridgeErrorForToast(new BridgeError("empty", "no bytes"));
    expect(msg).toMatch(/Start ComposerBridge/);
  });

  it("includes the HTTP status for 'http' errors", () => {
    const msg = formatBridgeErrorForToast(
      new BridgeError("http", "bad gateway", 502),
    );
    expect(msg).toMatch(/HTTP 502/);
  });

  it("returns a bridge-start hint for non-BridgeError exceptions", () => {
    expect(formatBridgeErrorForToast(new Error("boom"))).toMatch(
      /Start ComposerBridge/,
    );
    expect(formatBridgeErrorForToast("string error")).toMatch(
      /Start ComposerBridge/,
    );
    expect(formatBridgeErrorForToast(null)).toMatch(/Start ComposerBridge/);
  });

  it("returns a desktop install hint when requested", () => {
    const msg = formatBridgeErrorForToast(
      new BridgeError("unreachable", "ECONNREFUSED"),
      { preferDesktopInstall: true },
    );
    expect(msg).toMatch(/Composer Bridge/);
    expect(msg).toMatch(/インストール/);
  });
});
