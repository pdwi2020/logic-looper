export function generateShareText(params: {
  wrongCount: number;
  solved: boolean;
  hintLevel: number;
  score: number;
  timeTaken: number;
  difficulty: number;
  puzzleType: string;
  colorblind?: boolean;
}): string {
  const dayNumber = (Math.floor(Date.now() / 86_400_000) % 365) + 1;

  const typeLabel =
    params.puzzleType === 'number-matrix'
      ? 'Number Matrix'
      : params.puzzleType === 'sequence-solver'
        ? 'Sequence Solver'
        : 'Equation Puzzle';

  const wrongTile = params.colorblind ? '🟧' : '🟥';
  const finalTile = params.solved ? (params.colorblind ? '🟦' : '🟩') : '⬛';
  const wrongTiles = wrongTile.repeat(params.wrongCount);
  const emojiGrid = wrongTiles + finalTile;

  const mins = Math.floor(params.timeTaken / 60);
  const secs = params.timeTaken % 60;
  const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  const hintStr = params.hintLevel > 0 ? ` · 💡×${params.hintLevel}` : '';

  return [
    `Logic Looper ⚡ Day ${dayNumber}`,
    `${typeLabel} · Level ${params.difficulty}`,
    emojiGrid,
    `⏱️ ${timeStr}${hintStr} · ${params.score} pts`,
    'logic-looper-ruby.vercel.app',
  ].join('\n');
}

export function generateTweetUrl(shareText: string): string {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
}
