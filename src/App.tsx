import { useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useState } from "react";

import { useDataStore, useBuilderStore } from "@/store";
import { Header } from "@/components/Header";
import { InventoryPanel } from "@/components/InventoryPanel";
import { BuilderCanvas } from "@/components/BuilderCanvas";
import { SavedAgentsRoster } from "@/components/SavedAgentsRoster";
import { Toaster } from "@/components/ui/sonner";

import type { Skill, Layer } from "@/types";

export default function App() {
  const fetchData = useDataStore((s) => s.fetchData);
  const data = useDataStore((s) => s.data);

  const {
    selectedSkills,
    selectedLayers,
    addSkill,
    addLayer,
    reorderSkills,
    reorderLayers,
  } = useBuilderStore();

  // Fetch once on mount — the guard inside fetchData prevents re-fetches
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Track the active draggable for the DragOverlay
  const [activeDrag, setActiveDrag] = useState<{
    type: "skill" | "layer";
    item: Skill | Layer;
  } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 }, // prevent accidental drags on clicks
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const dragData = active.data.current as
      | { type: "skill" | "layer"; skillId?: string; layerId?: string }
      | undefined;

    if (!dragData || !data) return;

    if (dragData.type === "skill" && dragData.skillId) {
      const skill = data.skills.find((s) => s.id === dragData.skillId);
      if (skill) setActiveDrag({ type: "skill", item: skill });
    } else if (dragData.type === "layer" && dragData.layerId) {
      const layer = data.layers.find((l) => l.id === dragData.layerId);
      if (layer) setActiveDrag({ type: "layer", item: layer });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDrag(null);
    const { active, over } = event;
    if (!over) return;

    const dragData = active.data.current as
      | { type: "skill" | "layer"; skillId?: string; layerId?: string }
      | undefined;
    if (!dragData) return;

    const overId = String(over.id);

    // ── Drop from Inventory into a dropzone ──────────────────────────────────
    if (dragData.type === "skill" && dragData.skillId) {
      if (overId === "skills-dropzone" || selectedSkills.includes(overId)) {
        addSkill(dragData.skillId);
      }
    }

    if (dragData.type === "layer" && dragData.layerId) {
      if (overId === "layers-dropzone" || selectedLayers.includes(overId)) {
        addLayer(dragData.layerId);
      }
    }

    // ── Reorder within the canvas ────────────────────────────────────────────
    const activeId = String(active.id);

    if (selectedSkills.includes(activeId) && selectedSkills.includes(overId)) {
      const oldIndex = selectedSkills.indexOf(activeId);
      const newIndex = selectedSkills.indexOf(overId);
      reorderSkills(arrayMove(selectedSkills, oldIndex, newIndex));
    }

    if (selectedLayers.includes(activeId) && selectedLayers.includes(overId)) {
      const oldIndex = selectedLayers.indexOf(activeId);
      const newIndex = selectedLayers.indexOf(overId);
      reorderLayers(arrayMove(selectedLayers, oldIndex, newIndex));
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      <Header />

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Two-panel main area */}
        <main className="flex flex-1 overflow-hidden">
          <InventoryPanel />
          <BuilderCanvas />
        </main>

        {/* Floating drag preview */}
        <DragOverlay>
          {activeDrag && (
            <div className="px-3 py-2 rounded-lg border bg-card shadow-2xl text-sm font-medium opacity-90 max-w-48 truncate">
              {activeDrag.item.name}
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Saved agents roster below the two-panel area */}
      <SavedAgentsRoster />

      <Toaster richColors closeButton position="bottom-right" />
    </div>
  );
}
