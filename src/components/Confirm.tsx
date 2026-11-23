import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

export interface ConfirmOptions {
  title: string;
  message?: string;
  confirmLabel: string;
  cancelLabel?: string;
  /** Red confirm button, for actions that erase something. */
  danger?: boolean;
}

type Ask = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmCtx = createContext<Ask | null>(null);

/**
 * "Are you sure?" as an in-app sheet. The browser's own confirm() pop-up is blocked in
 * Messenger/Facebook in-app browsers and some webviews, where it silently answers "no".
 */
export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<ConfirmOptions | null>(null);
  const pending = useRef<((answer: boolean) => void) | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const finish = useCallback((answer: boolean) => {
    const resolve = pending.current;
    pending.current = null;
    setOpen(null);
    resolve?.(answer);
  }, []);

  const ask = useCallback<Ask>(
    (options) =>
      new Promise<boolean>((resolve) => {
        pending.current?.(false);
        pending.current = resolve;
        setOpen(options);
      }),
    [],
  );

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') finish(false);
    };
    // If the screen changes underneath (e.g. the exam auto-submits), the question no longer applies.
    const onRoute = () => finish(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('hashchange', onRoute);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('hashchange', onRoute);
    };
  }, [open, finish]);

  return (
    <ConfirmCtx.Provider value={ask}>
      {children}
      {open && (
        <>
          <div className="scrim confirm-scrim" onClick={() => finish(false)} />
          <section className="sheet confirm-sheet" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby={open.message ? 'confirm-message' : undefined}>
            <span id="confirm-title" className="h2" style={{ fontSize: 22 }}>
              {open.title}
            </span>
            {open.message && (
              <p id="confirm-message" className="p" style={{ fontSize: 15, color: 'var(--body)' }}>
                {open.message}
              </p>
            )}
            <div className="two">
              <button ref={cancelRef} type="button" className="btn btn-ghost" style={{ fontSize: 16 }} onClick={() => finish(false)}>
                {open.cancelLabel ?? 'Cancel'}
              </button>
              <button type="button" className={`btn ${open.danger ? 'btn-danger' : 'btn-rose'}`} style={{ fontSize: 16 }} onClick={() => finish(true)}>
                {open.confirmLabel}
              </button>
            </div>
          </section>
        </>
      )}
    </ConfirmCtx.Provider>
  );
}

export function useConfirm(): Ask {
  const ask = useContext(ConfirmCtx);
  if (!ask) throw new Error('useConfirm needs ConfirmProvider');
  return ask;
}
