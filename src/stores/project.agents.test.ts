import { beforeEach, describe, expect, it } from "vitest";
import { INITIAL_STATE, useProjectStore } from "@/stores/project";

describe("setAgents", () => {
  beforeEach(() => useProjectStore.setState(INITIAL_STATE));

  it("replaces the agents list entirely", () => {
    useProjectStore.getState().setAgents([
      { id: "v1", type: "person", name: "Lead Vocals" },
      { id: "v2", type: "person", name: "Backing" },
    ]);
    const agents = useProjectStore.getState().agents;
    expect(agents).toEqual([
      { id: "v1", type: "person", name: "Lead Vocals" },
      { id: "v2", type: "person", name: "Backing" },
    ]);
  });

  it("overwrites the name of an agent that shared an id with the previous list", () => {
    useProjectStore.getState().setAgents([{ id: "v1", type: "person", name: "Lead Vocals" }]);
    expect(useProjectStore.getState().agents[0].name).toBe("Lead Vocals");
  });

  it("removes agents that are not in the new list", () => {
    useProjectStore.getState().addAgent({ id: "vNew", type: "person", name: "Custom" });
    useProjectStore.getState().setAgents([{ id: "v1", type: "person", name: "Singer" }]);
    expect(useProjectStore.getState().agents.find((a) => a.id === "vNew")).toBeUndefined();
  });
});
