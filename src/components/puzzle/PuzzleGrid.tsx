export interface PuzzleGridProps {
  grid: number[][];
  missingCell: { row: number; col: number };
  userAnswer: string;
  onAnswerChange: (value: string) => void;
}

export function PuzzleGrid({
  grid,
  missingCell,
  userAnswer,
  onAnswerChange,
}: PuzzleGridProps) {
  const columnCount = grid[0]?.length ?? 1;

  return (
    <div className="space-y-3">
      <p className="font-body text-sm text-brand-dark-gray">
        Follow the pattern and fill the missing value.
      </p>

      <div
        className="grid gap-2 rounded-2xl border border-brand-light-steel bg-brand-light-blue/20 p-3"
        style={{
          gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((value, colIndex) => {
            const isMissing =
              rowIndex === missingCell.row && colIndex === missingCell.col;
            const isHighlighted =
              rowIndex === missingCell.row || colIndex === missingCell.col;

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={[
                  'flex h-14 items-center justify-center rounded-lg border text-lg font-semibold',
                  isHighlighted
                    ? 'border-brand-accent/60 bg-brand-light-lavender text-brand-dark'
                    : 'border-brand-light-steel bg-brand-white text-brand-dark-gray',
                ].join(' ')}
              >
                {isMissing ? (
                  <input
                    aria-label="Missing cell value"
                    type="text"
                    inputMode="numeric"
                    value={userAnswer}
                    onChange={(event) => onAnswerChange(event.target.value)}
                    className="h-10 w-20 rounded-md border border-brand-blue/40 bg-brand-white px-2 text-center font-mono text-lg text-brand-dark outline-none transition-colors focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30"
                    placeholder="?"
                  />
                ) : (
                  <span className="font-mono">{value}</span>
                )}
              </div>
            );
          }),
        )}
      </div>

      <p className="font-body text-xs text-brand-dark-gray">
        Highlighted row and column pass through the missing cell.
      </p>
    </div>
  );
}
