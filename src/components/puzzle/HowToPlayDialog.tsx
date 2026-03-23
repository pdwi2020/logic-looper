import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from '@/components/ui/Dialog';

const rules = [
  {
    title: 'Equation Puzzle',
    icon: '🔢',
    text: 'Find the value of ? that makes the equation true. Enter a whole number and press Submit.',
  },
  {
    title: 'Number Matrix',
    icon: '🔲',
    text: 'Find the missing number that follows the pattern in the grid row or column. Up to 3 hints available.',
  },
  {
    title: 'Sequence Solver',
    icon: '🔗',
    text: 'Identify the rule and find the next number in the sequence. The rule clue gives you a nudge.',
  },
];

interface HowToPlayDialogProps {
  open: boolean;
  onClose: () => void;
}

export function HowToPlayDialog({ open, onClose }: HowToPlayDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <div className="mb-4 flex items-center justify-between">
            <DialogTitle>How to Play</DialogTitle>
            <DialogClose
              className="rounded-lg p-1 text-brand-dark-gray transition-colors hover:bg-brand-light-gray hover:text-brand-dark focus:outline-none"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </DialogClose>
          </div>

          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.title} className="rounded-xl border border-brand-light-steel bg-brand-light-gray p-4">
                <p className="mb-1 font-sans text-sm font-semibold text-brand-dark">
                  {rule.icon} {rule.title}
                </p>
                <p className="font-body text-sm text-brand-dark-gray">{rule.text}</p>
              </div>
            ))}

            <div className="rounded-xl border border-brand-purple/20 bg-brand-purple/5 p-4">
              <p className="mb-1 font-sans text-sm font-semibold text-brand-purple">
                💡 Scoring
              </p>
              <p className="font-body text-sm text-brand-dark-gray">
                Faster solves earn more points. Each hint costs <span className="font-semibold">−10 pts</span>. Wrong answers don't penalise you — but they slow you down!
              </p>
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <DialogClose
              onClick={onClose}
              className="rounded-xl bg-brand-blue px-5 py-2 font-sans text-sm font-semibold text-white transition-opacity hover:opacity-90 focus:outline-none"
            >
              Got it!
            </DialogClose>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
