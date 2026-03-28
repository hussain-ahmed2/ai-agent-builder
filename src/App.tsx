import { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  rectIntersection,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useDataStore, useBuilderStore } from "@/store";
import { Header } from "./components/layout/Header";
import { InventoryPanel } from "./components/inventory/InventoryPanel";
import { BuilderCanvas } from "./components/builder/BuilderCanvas";
import { SavedAgentsRoster } from "./components/roster/SavedAgentsRoster";
import { Toaster } from "@/components/ui/sonner";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Zap, Layers } from "lucide-react";

import type { Skill, Layer } from "@/types";

export default function App() {
  const fetchData = useDataStore((s) => s.fetchData);
  const data = useDataStore((s) => s.data);
  const [activeDrag, setActiveDrag] = useState<{
    type: "skill" | "layer";
    item: Skill | Layer;
  } | null>(null);
  /**
   * LAYOUT ARCHITECTURE:
   * We use a nested ResizablePanelGroup structure to achieve the '1+1, 1 content' layout.
   * Outer Group (Vertical): Splits the primary workspace from the bottom cabinet.
   * Inner Group (Horizontal): Splits the inventory from the canvas.
   *
   * RESPONSIVENESS:
   * The 'isDesktop' state triggers a complete layout pivot. On screens < 640px, we
   * revert to a standard vertical flex stack to ensure content accessibility.
   */
  const [isDesktop, setIsDesktop] = useState(false);

  // One-time data initialization
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Window Resize Listener for dynamic layout adaptation
  useEffect(() => {
    const checkSize = () => setIsDesktop(window.innerWidth >= 640);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  /**
   * DND SENSORS:
   * PointerSensor: standard mouse/trackpad drag (has distance constraint to allow clicking buttons).
   * TouchSensor: mobile-friendly drag triggers on long-press (delay: 250ms).
   */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
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
    const { over, active } = event;
    setActiveDrag(null);

    if (!over) return;

    const dragData = active.data.current as
      | { type: "skill" | "layer"; skillId?: string; layerId?: string }
      | undefined;
    const store = useBuilderStore.getState();

    // ID normalization to string
    const overId = over.id.toString();
    const activeId = active.id.toString();

    // 1. Handle REORDERING (Sorting)
    // Both active and over must be existing items in the canvas
    const isActiveSkill = store.selectedSkills.includes(activeId);
    const isOverSkill = store.selectedSkills.includes(overId);
    const isActiveLayer = store.selectedLayers.includes(activeId);
    const isOverLayer = store.selectedLayers.includes(overId);

    if (activeId !== overId && (isOverSkill || isOverLayer)) {
      if (isActiveSkill && isOverSkill) {
        const oldIndex = store.selectedSkills.indexOf(activeId);
        const newIndex = store.selectedSkills.indexOf(overId);
        store.reorderSkills(
          arrayMove(store.selectedSkills, oldIndex, newIndex),
        );
        return;
      } else if (isActiveLayer && isOverLayer) {
        const oldIndex = store.selectedLayers.indexOf(activeId);
        const newIndex = store.selectedLayers.indexOf(overId);
        store.reorderLayers(
          arrayMove(store.selectedLayers, oldIndex, newIndex),
        );
        return;
      }
    }

    // 2. Handle ADDING from inventory
    // We confirm we have dragData from the inventory side
    if (!dragData) return;

    // Check if we dropped on the zone ITSELF or an item WITHIN that zone
    const targetIsSkillsZone = overId === "skills-dropzone" || isOverSkill;
    const targetIsLayersZone = overId === "layers-dropzone" || isOverLayer;

    if (targetIsSkillsZone && dragData.type === "skill" && dragData.skillId) {
      store.addSkill(dragData.skillId);
    } else if (
      targetIsLayersZone &&
      dragData.type === "layer" &&
      dragData.layerId
    ) {
      store.addLayer(dragData.layerId);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-svh bg-background text-foreground font-sans overflow-hidden">
        <Header />

        {isDesktop ? (
          /* IDE IDE-style Desktop Layout: Row 1 (Inventory + Builder), Row 2 (Roster) */
          <main className="flex-1 min-h-0 h-full relative overflow-hidden bg-background">
            <ResizablePanelGroup orientation="vertical" className="h-full">
              {/* Row 1: Split 1+1 (Inventory | Canvas) */}
              <ResizablePanel defaultSize={70} className="min-h-0">
                <ResizablePanelGroup
                  orientation="horizontal"
                  className="h-full"
                >
                  <ResizablePanel defaultSize={20} className="min-w-0">
                    <InventoryPanel />
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={80} className="min-w-0">
                    <BuilderCanvas />
                  </ResizablePanel>
                </ResizablePanelGroup>
              </ResizablePanel>

              <ResizableHandle withHandle />

              {/* Row 2: Content (Saved Agents Cabinet) */}
              <ResizablePanel defaultSize={30} className="min-h-0">
                <div className="h-full bg-muted/5 flex flex-col overflow-hidden border-t border-border">
                  <div className="px-4 py-2 bg-muted/20 flex items-center justify-between pointer-events-none shrink-0 border-b">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">
                      Saved Agents Cabinet
                    </span>
                  </div>
                  <div className="flex-1 overflow-y-auto thin-scrollbar">
                    <SavedAgentsRoster />
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </main>
        ) : (
          /* Standard Mobile Flow */
          <main className="flex-1 overflow-y-auto flex flex-col pt-2">
            <InventoryPanel />
            <div className="border-t border-border shrink-0">
              <BuilderCanvas />
            </div>
            <div className="border-t border-border bg-muted/5 shrink-0">
              <div className="px-4 py-3 border-b border-border">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  Saved Agents
                </h3>
              </div>
              <div className="p-4">
                <SavedAgentsRoster />
              </div>
            </div>
          </main>
        )}

        <Toaster richColors closeButton position="bottom-right" />
      </div>

      <DragOverlay dropAnimation={null}>
        {activeDrag && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg border bg-card shadow-2xl ring-2 ring-primary scale-[1.02] select-none pointer-events-none w-[280px]">
            <GripVertical className="size-4 text-muted-foreground" />
            {activeDrag.type === "skill" ? (
              <Zap className="size-3.5 text-muted-foreground shrink-0" />
            ) : (
              <Layers className="size-3.5 text-muted-foreground shrink-0" />
            )}
            <span className="text-sm flex-1 truncate">{activeDrag.item.name}</span>
            <Badge variant="outline" className="text-[10px] h-4 px-1">
              {activeDrag.type === "skill" ? (activeDrag.item as Skill).category : (activeDrag.item as Layer).type}
            </Badge>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
