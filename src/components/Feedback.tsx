import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from './Icons';
import { useStore } from '../lib/store';
import { MESSAGE_MAX, sendFeedback, shouldAskForFeedback, snoozeFeedback } from '../lib/feedback';

const LABELS = ['', 'Not Feeling It', "It's Okay", 'Getting There', 'Crushing on It', 'Totally in Love'];

/** Rate-and-comment sheet. Opens only when someone taps to give feedback. */
export function FeedbackSheet({ where, onClose }: { where: string; onClose: (sent: boolean) => void }) {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'failed' | 'sent'>('idle');
  const firstRef = useRef<HTMLButtonElement>(null);
  const sentRef = useRef(false);
  const close = useCallback(() => onClose(sentRef.current), [onClose]);

  useEffect(() => {
    firstRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('hashchange', close);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('hashchange', close);
    };
  }, [close]);

  async function send() {
    if (!rating || status === 'sending') return;
    setStatus('sending');
    const ok = await sendFeedback({ rating, message, where });
    sentRef.current = ok;
    setStatus(ok ? 'sent' : 'failed');
  }

  return (
    <>
      <div className="scrim" onClick={close} />
      <section className="sheet feedback-sheet" role="dialog" aria-modal="true" aria-labelledby="feedback-title">
        {status === 'sent' ? (
          <div className="stack feedback-done" role="status">
            <Icon name="heart" filled size={48} color="var(--rose)" />
            <h2 id="feedback-title" className="h2">
              Thank You! Yieee!
            </h2>
            <p className="p">Your feedback goes straight to the creator and helps make Kismet better for every examinee.</p>
            <button type="button" className="btn btn-ink block" onClick={close}>
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="between">
              <h2 id="feedback-title" className="h2" style={{ fontSize: 24 }}>
                Rate Kismet CSE Reviewer
              </h2>
              <button type="button" className="icon-btn" style={{ background: 'var(--blush)' }} aria-label="Close feedback" onClick={close}>
                <Icon name="x" size={20} />
              </button>
            </div>
            <p className="lead" style={{ fontSize: 15, margin: 0 }}>
              How is studying here so far?
            </p>
            <div className="feedback-hearts" role="radiogroup" aria-label="Your rating">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  ref={n === 1 ? firstRef : undefined}
                  type="button"
                  role="radio"
                  aria-checked={rating === n}
                  aria-label={`${n} of 5 hearts: ${LABELS[n]}`}
                  className={n <= rating ? 'on' : ''}
                  onClick={() => setRating(n)}
                >
                  <Icon name="heart" filled={n <= rating} size={36} />
                </button>
              ))}
            </div>
            <span className="feedback-caption" aria-live="polite">
              {rating ? LABELS[rating] : 'Tap a heart'}
            </span>
            <label className="field" style={{ gap: 6 }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>
                What should we fix or add? <span className="muted" style={{ fontWeight: 500 }}>(optional)</span>
              </span>
              <textarea className="input feedback-text" value={message} maxLength={MESSAGE_MAX} rows={4} onChange={(e) => setMessage(e.target.value)} />
            </label>
            <span className="small muted">Please leave out personal details like your name, email or phone number.</span>
            {status === 'failed' && (
              <div className="notice" role="status">
                That didn't go through. Check your connection and try again.
              </div>
            )}
            <button type="button" className="btn btn-rose block" aria-disabled={!rating || status === 'sending'} onClick={send}>
              {status === 'sending' ? 'Sending…' : rating ? 'Send Feedback' : 'Pick a Rating First'}
            </button>
          </>
        )}
      </section>
    </>
  );
}

/**
 * A small card on finish screens, after a few completed sessions, asking for a rating.
 * It never appears while someone is answering, and "Not Now" quiets it for two weeks.
 */
export function FeedbackNudge({ where }: { where: string }) {
  const { state } = useStore();
  const [show, setShow] = useState(() => shouldAskForFeedback(state.mocks.length));
  const [open, setOpen] = useState(false);
  const onClose = useCallback((sent: boolean) => {
    setOpen(false);
    if (sent) setShow(false);
  }, []);
  if (!show) return null;
  return (
    <>
      <section className="feedback-nudge" aria-label="Rate the app">
        <span className="feedback-nudge-icon">
          <Icon name="heart" filled size={22} color="var(--rose)" />
        </span>
        <span className="stack grow" style={{ gap: 2 }}>
          <strong style={{ fontSize: 15 }}>Enjoying Kismet So Far?</strong>
          <span className="small muted">A quick rating helps make it better for every examinee.</span>
        </span>
        <span className="feedback-nudge-actions">
          <button type="button" className="btn btn-ink" onClick={() => setOpen(true)}>
            Rate It
          </button>
          <button
            type="button"
            className="btn btn-text"
            onClick={() => {
              snoozeFeedback();
              setShow(false);
            }}
          >
            Not Now
          </button>
        </span>
      </section>
      {open && <FeedbackSheet where={where} onClose={onClose} />}
    </>
  );
}
