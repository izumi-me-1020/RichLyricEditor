import { describe, expect, it } from "vitest";
import { SyncPanel } from "@/views/sync/sync-panel";
import { useAudioStore } from "@/stores/audio";
import { useProjectStore } from "@/stores/project";
import { createLine } from "@/test/factories";
import { render } from "@/test/render";

describe("SyncPanel", () => {
  it("shows the 'No audio loaded' empty state when no source is set", async () => {
    useAudioStore.setState({ source: null });
    useProjectStore.setState({ lines: [] });
    const screen = await render(<SyncPanel />);
    await expect.element(screen.getByText("No audio loaded")).toBeInTheDocument();
  });

  it("renders tappable sync controls while playing", async () => {
    useAudioStore.setState({
      source: { type: "file", file: new File(["audio"], "test.mp3") },
      isPlaying: true,
    });
    useProjectStore.setState({
      lines: [createLine({ text: "hello world" })],
      activeTab: "sync",
      granularity: "word",
    });
    const screen = await render(<SyncPanel />);
    await expect.element(
      screen.getByRole("button", { name: "Hold sync" }),
    ).toBeInTheDocument();
    await expect.element(
      screen.getByRole("button", { name: "Tap sync" }),
    ).toBeInTheDocument();
  });

  it("starts sync when the tap control is pressed", async () => {
    useAudioStore.setState({
      source: { type: "file", file: new File(["audio"], "test.mp3") },
      isPlaying: true,
      currentTime: 1,
    });
    useProjectStore.setState({
      lines: [createLine({ text: "hello world" })],
      activeTab: "sync",
      granularity: "word",
    });
    const screen = await render(<SyncPanel />);
    await screen.getByRole("button", { name: "Tap sync" }).click();
    await expect.element(
      screen.getByRole("button", { name: "Reset" }),
    ).toBeInTheDocument();
  });
});
