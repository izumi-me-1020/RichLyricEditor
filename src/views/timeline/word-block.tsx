import { cn } from "@/utils/cn";
import type { SyllablePosition } from "@/domain/word/syllable-groups";
import { selfKey } from "@/views/timeline/snap";
import { useTimelineStore } from "@/views/timeline/timeline-store";
import { useDraggable } from "@dnd-kit/core";

// -- Types ---------------------------------------------------------------------

interface WordBlockProps {
  id: string;
  lineId: string;
  lineIndex: number;
  wordIndex: number;
  trackType: "word" | "bg";
  text: string;
  begin: number;
  end: number;
  color: string;
  zoom: number;
  isDimmed: boolean;
  isSelected: boolean;
  isExplicit?: boolean;
  syllablePosition?: SyllablePosition;
  gapBefore?: boolean;
  leftHighlighted?: boolean;
  rightHighlighted?: boolean;
  leftConjoined?: boolean;
  rightConjoined?: boolean;
  onClick: (e: React.MouseEvent) => void;
  onResizeStart: (edge: "left" | "right", startX: number) => void;
  onEdgeHover?: (edge: "left" | "right", hovering: boolean) => void;
  onDoubleClick?: (e: React.MouseEvent) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  isMobileGestureMode?: boolean;
}

// -- Component -----------------------------------------------------------------

const SYLLABLE_RADIUS: Record<SyllablePosition, string> = {
  none: "rounded-xl",
  first: "rounded-l-xl rounded-r-none",
  middle: "rounded-none",
  last: "rounded-r-xl rounded-l-none",
};

const WordBlock: React.FC<WordBlockProps> = ({
  id,
  lineId,
  lineIndex,
  wordIndex,
  trackType,
  text,
  begin,
  end,
  color,
  zoom,
  isDimmed,
  isSelected,
  isExplicit,
  syllablePosition = "none",
  gapBefore,
  leftHighlighted,
  rightHighlighted,
  leftConjoined,
  rightConjoined,
  onClick,
  onResizeStart,
  onEdgeHover,
  onDoubleClick,
  onContextMenu,
  isMobileGestureMode = false,
}) => {
  const left = begin * zoom;
  const naturalWidth = (end - begin) * zoom;
  const width = Math.max(naturalWidth, 4);
  const showText = naturalWidth >= 20;
  const minCenterDragWidth = isMobileGestureMode ? 18 : 0;
  const maxEdgeWidth = Math.max(0, (width - minCenterDragWidth) / 2);
  const edgeHandleWidth = isMobileGestureMode
    ? Math.max(4, Math.min(12, Math.floor(Math.min(width / 4, maxEdgeWidth))))
    : 8;

  const myKey = selfKey(lineId, wordIndex, trackType);
  const isSnapped = useTimelineStore((s) => s.snappedBlockId === myKey);

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data: {
      lineId,
      lineIndex,
      wordIndex,
      trackType,
      text,
      begin,
      end,
      snap: { edgesAtStart: [begin, end] },
    },
  });

  const startResize = (
    target: EventTarget | null,
    clientX: number,
    stopPropagation: () => void,
    preventDefault: () => void,
  ) => {
    const edgeTarget = target as HTMLDivElement | null;
    const edge = edgeTarget?.dataset.edge as "left" | "right" | undefined;
    if (!edge) return;
    stopPropagation();
    preventDefault();
    onResizeStart(edge, clientX);
  };

  const handleResizePointerStart = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    startResize(
      e.currentTarget,
      e.clientX,
      () => e.stopPropagation(),
      () => e.preventDefault(),
    );
  };

  const handleResizeTouchStartCapture = (
    e: React.TouchEvent<HTMLDivElement>,
  ) => {
    const touch = e.touches[0];
    if (!touch) return;
    startResize(
      e.currentTarget,
      touch.clientX,
      () => e.stopPropagation(),
      () => e.preventDefault(),
    );
  };

  const handleResizeMouseDownCapture = (
    e: React.MouseEvent<HTMLDivElement>,
  ) => {
    if (e.button !== 0) return;
    startResize(
      e.currentTarget,
      e.clientX,
      () => e.stopPropagation(),
      () => e.preventDefault(),
    );
  };

  const syllableBorder: React.CSSProperties = {};
  if (!isSelected && (syllablePosition === "first" || syllablePosition === "middle")) {
    syllableBorder.borderRightStyle = "dashed";
  }
  if (!isSelected && (syllablePosition === "middle" || syllablePosition === "last")) {
    if (gapBefore) {
      syllableBorder.borderLeftStyle = "dashed";
    } else {
      syllableBorder.borderLeftWidth = 0;
    }
  }

  return (
    <div
      ref={setNodeRef}
      id={id}
      data-word-block
      data-syllable-position={syllablePosition}
      className={cn(
        "absolute top-1 bottom-1 flex items-center justify-center",
        "text-xs text-white truncate select-none cursor-grab",
        isMobileGestureMode ? "touch-none" : "touch-manipulation",
        "border transition-opacity duration-100",
        SYLLABLE_RADIUS[syllablePosition],
        isDimmed && "opacity-30",
        isDragging && "opacity-50 cursor-grabbing z-50",
        isExplicit && "is-explicit-word",
        isSnapped && !isDragging && "is-snapped",
      )}
      style={{
        left,
        width,
        backgroundColor: isSelected ? `${color}60` : `${color}40`,
        borderColor: isSelected ? `${color}B0` : `${color}70`,
        WebkitTouchCallout: isMobileGestureMode ? "none" : undefined,
        ...syllableBorder,
      }}
      onContextMenuCapture={(e) => {
        if (!isMobileGestureMode) return;
        e.preventDefault();
        e.stopPropagation();
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onDoubleClick?.(e);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onContextMenu?.(e);
      }}
      {...attributes}
      {...listeners}
      role="button"
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick(e as unknown as React.MouseEvent);
      }}
    >
      <div
        data-edge="left"
        role="separator"
        aria-orientation="vertical"
        aria-hidden="true"
        className={cn(
          "absolute left-0 top-0 bottom-0 z-10 hover:bg-white/10 touch-none",
          syllablePosition === "middle" || syllablePosition === "last" || leftConjoined
            ? "cursor-col-resize"
            : "cursor-ew-resize",
          leftHighlighted && "bg-white/10",
        )}
        style={{ width: edgeHandleWidth }}
        onPointerDown={handleResizePointerStart}
        onTouchStartCapture={handleResizeTouchStartCapture}
        onMouseDownCapture={handleResizeMouseDownCapture}
        onMouseEnter={() => onEdgeHover?.("left", true)}
        onMouseLeave={() => onEdgeHover?.("left", false)}
      />

      {showText && <span className="px-1 pointer-events-none truncate">{text}</span>}

      <div
        data-edge="right"
        role="separator"
        aria-orientation="vertical"
        aria-hidden="true"
        className={cn(
          "absolute right-0 top-0 bottom-0 z-10 hover:bg-white/10 touch-none",
          syllablePosition === "first" || syllablePosition === "middle" || rightConjoined
            ? "cursor-col-resize"
            : "cursor-ew-resize",
          rightHighlighted && "bg-white/10",
        )}
        style={{ width: edgeHandleWidth }}
        onPointerDown={handleResizePointerStart}
        onTouchStartCapture={handleResizeTouchStartCapture}
        onMouseDownCapture={handleResizeMouseDownCapture}
        onMouseEnter={() => onEdgeHover?.("right", true)}
        onMouseLeave={() => onEdgeHover?.("right", false)}
      />
    </div>
  );
};

// -- Exports -------------------------------------------------------------------

export { WordBlock };
