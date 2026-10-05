'use client';

interface CropBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface EdgePattern {
  top: 'flat' | 'tab' | 'blank';
  right: 'flat' | 'tab' | 'blank';
  bottom: 'flat' | 'tab' | 'blank';
  left: 'flat' | 'tab' | 'blank';
}

interface ImagePiecesPreviewProps {
  imageUrl: string;
  gridRows: number;
  gridCols: number;
}

// Helper: generate matching edge patterns (same as backend)
function generateEdgePatterns(gridRows: number, gridCols: number) {
  const edgePatterns: (('tab' | 'blank')[][]) = Array(gridRows)
    .fill(null)
    .map(() =>
      Array(gridCols - 1)
        .fill(null)
        .map(() => (Math.random() > 0.5 ? 'tab' : 'blank')),
    );

  const vEdgePatterns: (('tab' | 'blank')[][]) = Array(gridRows - 1)
    .fill(null)
    .map(() =>
      Array(gridCols)
        .fill(null)
        .map(() => (Math.random() > 0.5 ? 'tab' : 'blank')),
    );

  return { edgePatterns, vEdgePatterns };
}

// Helper: generate SVG path for jigsaw piece with tabs/blanks
function generateJigsawPath(
  x: number,
  y: number,
  width: number,
  height: number,
  edges: EdgePattern,
  scale: number = 50,
) {
  const tabSize = 8;
  const points: [number, number][] = [];
  let px = x;
  let py = y;

  // Top edge
  if (edges.top === 'flat') {
    points.push([x, y]);
    px = x + width;
  } else if (edges.top === 'tab') {
    points.push([x, y]);
    points.push([x + width / 2 - tabSize, y]);
    points.push([x + width / 2 - tabSize, y - tabSize]);
    points.push([x + width / 2 + tabSize, y - tabSize]);
    points.push([x + width / 2 + tabSize, y]);
    px = x + width;
  } else {
    points.push([x, y]);
    points.push([x + width / 2 - tabSize, y]);
    points.push([x + width / 2 - tabSize, y + tabSize]);
    points.push([x + width / 2 + tabSize, y + tabSize]);
    points.push([x + width / 2 + tabSize, y]);
    px = x + width;
  }

  // Right edge
  if (edges.right === 'flat') {
    points.push([x + width, y + height]);
  } else if (edges.right === 'tab') {
    points.push([x + width + tabSize, y + height / 2 - tabSize]);
    points.push([x + width + tabSize, y + height / 2 + tabSize]);
  } else {
    points.push([x + width - tabSize, y + height / 2 - tabSize]);
    points.push([x + width + tabSize, y + height / 2]);
    points.push([x + width - tabSize, y + height / 2 + tabSize]);
  }

  // Bottom edge
  if (edges.bottom === 'flat') {
    points.push([x, y + height]);
  } else if (edges.bottom === 'tab') {
    points.push([x + width / 2 + tabSize, y + height]);
    points.push([x + width / 2 + tabSize, y + height + tabSize]);
    points.push([x + width / 2 - tabSize, y + height + tabSize]);
    points.push([x + width / 2 - tabSize, y + height]);
  } else {
    points.push([x + width / 2 + tabSize, y + height]);
    points.push([x + width / 2 + tabSize, y + height - tabSize]);
    points.push([x + width / 2 - tabSize, y + height - tabSize]);
    points.push([x + width / 2 - tabSize, y + height]);
  }

  // Left edge
  if (edges.left === 'flat') {
    points.push([x, y]);
  } else if (edges.left === 'tab') {
    points.push([x - tabSize, y + height / 2 + tabSize]);
    points.push([x - tabSize, y + height / 2 - tabSize]);
  } else {
    points.push([x + tabSize, y + height / 2 + tabSize]);
    points.push([x - tabSize, y + height / 2]);
    points.push([x + tabSize, y + height / 2 - tabSize]);
  }

  return `M ${points.map((p) => p.join(',')).join(' L ')} Z`;
}

export default function ImagePiecesPreview({
  imageUrl,
  gridRows,
  gridCols,
}: ImagePiecesPreviewProps) {
  const { edgePatterns, vEdgePatterns } = generateEdgePatterns(gridRows, gridCols);

  // Generate piece metadata with edges
  const pieces: Array<{ position: number; cropBox: CropBox; edges: EdgePattern }> = [];
  for (let row = 0; row < gridRows; row++) {
    for (let col = 0; col < gridCols; col++) {
      const top: 'flat' | 'tab' | 'blank' =
        row === 0 ? 'flat' : vEdgePatterns[row - 1][col] === 'tab' ? 'blank' : 'tab';
      const bottom: 'flat' | 'tab' | 'blank' =
        row === gridRows - 1 ? 'flat' : vEdgePatterns[row][col];
      const left: 'flat' | 'tab' | 'blank' =
        col === 0 ? 'flat' : edgePatterns[row][col - 1] === 'tab' ? 'blank' : 'tab';
      const right: 'flat' | 'tab' | 'blank' =
        col === gridCols - 1 ? 'flat' : edgePatterns[row][col];

      pieces.push({
        position: row * gridCols + col,
        cropBox: {
          x: col / gridCols,
          y: row / gridRows,
          width: 1 / gridCols,
          height: 1 / gridRows,
        },
        edges: { top, right, bottom, left },
      });
    }
  }

  return (
    <div className="mt-6 bg-white rounded-lg shadow p-4">
      <h4 className="text-sm font-bold text-gray-900 mb-3">
        🔪 Chia thành {pieces.length} mảnh ({gridRows}x{gridCols})
      </h4>

      {/* Full image with grid overlay */}
      <div className="mb-6">
        <p className="text-xs text-gray-600 mb-2">Ảnh gốc với lưới chia:</p>
        <div
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%',
            aspectRatio: '16/9',
            position: 'relative',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          {/* Grid lines */}
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          >
            {/* Vertical lines */}
            {Array.from({ length: gridCols - 1 }).map((_, i) => {
              const x = ((i + 1) / gridCols) * 100;
              return (
                <line
                  key={`v-${i}`}
                  x1={`${x}%`}
                  y1="0%"
                  x2={`${x}%`}
                  y2="100%"
                  stroke="#ef4444"
                  strokeWidth="2"
                  opacity="0.7"
                />
              );
            })}
            {/* Horizontal lines */}
            {Array.from({ length: gridRows - 1 }).map((_, i) => {
              const y = ((i + 1) / gridRows) * 100;
              return (
                <line
                  key={`h-${i}`}
                  x1="0%"
                  y1={`${y}%`}
                  x2="100%"
                  y2={`${y}%`}
                  stroke="#ef4444"
                  strokeWidth="2"
                  opacity="0.7"
                />
              );
            })}
          </svg>
        </div>
      </div>

      {/* Individual jigsaw pieces */}
      <p className="text-xs text-gray-600 mb-2">🧩 Jigsaw pieces với edge patterns:</p>
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${Math.min(4, gridCols)}, 1fr)`,
        }}
      >
        {pieces.map((piece) => {
          const svgPath = generateJigsawPath(0, 0, 100, 100, piece.edges, 50);
          return (
            <div
              key={piece.position}
              className="flex flex-col items-center gap-2"
            >
              <svg width="120" height="120" viewBox="-20 -20 140 140">
                <defs>
                  <mask id={`mask-${piece.position}`}>
                    <rect width="140" height="140" fill="white" />
                    <path d={svgPath} fill="black" />
                  </mask>
                </defs>
                {/* Jigsaw piece with image inside */}
                <image
                  href={imageUrl}
                  x={`${(piece.cropBox.x - 0.1) * 100}%`}
                  y={`${(piece.cropBox.y - 0.1) * 100}%`}
                  width="140"
                  height="140"
                  mask={`url(#mask-${piece.position})`}
                />
                {/* Edge outline */}
                <path
                  d={svgPath}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                />
              </svg>
              <div className="text-xs font-bold text-gray-700">
                #{piece.position + 1}
              </div>
              <div className="text-xs text-gray-600 text-center">
                <span>↑{piece.edges.top}</span> <span>→{piece.edges.right}</span>
                <br />
                <span>↓{piece.edges.bottom}</span> <span>←{piece.edges.left}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
