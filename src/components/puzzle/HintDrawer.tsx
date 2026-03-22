import { Drawer } from 'vaul';

interface HintDrawerProps {
  open: boolean;
  onClose: () => void;
  hint: string;
  hintLabelText: string;
}

export function HintDrawer({ open, onClose, hint, hintLabelText }: HintDrawerProps) {
  return (
    <Drawer.Root open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
        <Drawer.Content
          className="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-3xl bg-brand-white px-6 pb-10 pt-4 focus:outline-none"
          aria-describedby="hint-drawer-text"
        >
          {/* Drag handle */}
          <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-brand-light-steel" />
          <Drawer.Title className="font-sans text-base font-semibold text-brand-dark">
            {hintLabelText}
          </Drawer.Title>
          <p
            id="hint-drawer-text"
            className="mt-3 font-body text-sm leading-relaxed text-brand-dark-gray"
          >
            {hint}
          </p>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
