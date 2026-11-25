import { useEffect, useRef, type ReactNode } from 'react';
import { Icon } from './Icons';

export type LegalDoc = 'privacy' | 'terms';

const PORTFOLIO = 'https://princessabang.netlify.app';
const UPDATED = 'November 25, 2026';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="legal-section">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

function Privacy() {
  return (
    <>
      <p className="legal-lead">
        Kilig CSE Reviewer is a free study app. It has no accounts and never asks for your email, phone number or password.
      </p>
      <Section title="What Stays on Your Device">
        <p>
          Your progress is saved in this browser's local storage, on this device only: lesson levels, your answers and scores, your daily streak, your
          mistakes pile and its review dates, mock exam results, your exam date, your daily goal, and whether you have already rated the app so it does not keep asking. It is not uploaded anywhere.
        </p>
        <p>A backup you save is a file on your own device. Only you decide where it goes.</p>
      </Section>
      <Section title="Group Study Dates">
        <p>
          If you create or join a group study date, the name you type, your answers and how long each one took, and the study date's questions and
          settings are sent to our host, Netlify, so everyone in the study date can see the results. Anyone with the code can join (up to 10 people)
          and see names and scores.
        </p>
        <p>
          A study date closes after 12 hours. Its record may stay in storage until it is cleaned up, but it is not used for anything else. Your seat in
          the study date is a random ID saved on your device so you can rejoin after a refresh.
        </p>
      </Section>
      <Section title="Feedback">
        <p>
          If you choose to rate the app, your heart rating, your message (if you write one) and the screen you sent it from are sent to our host,
          Netlify, so the creator can read them. Feedback is not linked to your name or your progress, so please leave out personal details.
        </p>
      </Section>
      <Section title="Services We Use">
        <p>
          The app is hosted by Netlify, which, like any web host, handles basic technical data such as your IP address to deliver the pages. Fonts
          load from Google Fonts, which receives similar technical data.
        </p>
        <p>The app has no ads, analytics or tracking, and sets no cookies of its own.</p>
      </Section>
      <Section title="No Selling or Sharing">
        <p>Your data is never sold, rented or shared with anyone.</p>
      </Section>
      <Section title="Your Choices">
        <p>
          Erase everything at any time with Erase All Progress on the Me tab, or by clearing this site's data in your browser. Leaving a group study
          date before it starts removes you from it.
        </p>
      </Section>
      <Section title="Changes and Contact">
        <p>
          If this policy changes, the date below will change too. For questions, reach the creator through{' '}
          <a href={PORTFOLIO} target="_blank" rel="noopener noreferrer">
            the portfolio site
          </a>
          .
        </p>
      </Section>
    </>
  );
}

function Terms() {
  return (
    <>
      <p className="legal-lead">By using Kilig CSE Reviewer, you agree to these simple terms.</p>
      <Section title="For Study Only">
        <p>
          This is a free, independent reviewer for the Philippine Civil Service Exam, for personal study only. It is not affiliated with or endorsed
          by the Civil Service Commission (CSC).
        </p>
      </Section>
      <Section title="Practice Content">
        <p>
          Questions, lessons and mock exams are original practice material, not actual exam items. Scores are estimates and do not guarantee a result
          on the real exam. Laws and rules can change, so check official sources such as the CSC for the latest.
        </p>
      </Section>
      <Section title="Fair Use">
        <p>Keep group study date names respectful, and do not try to misuse or disrupt the app.</p>
      </Section>
      <Section title="No Warranty">
        <p>
          The app is provided as is, without any guarantee of accuracy or availability. To the extent the law allows, the creator is not liable for
          any loss from using it.
        </p>
      </Section>
      <Section title="Ownership">
        <p>© 2026 Princess Abang. The app's design, lessons and questions may not be copied or republished without permission.</p>
      </Section>
    </>
  );
}

/** Privacy Policy / Terms of Use, as a dismissible bottom sheet. */
export function LegalSheet({ doc, onClose }: { doc: LegalDoc; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const title = doc === 'privacy' ? 'Privacy Policy' : 'Terms of Use';

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('hashchange', onClose);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('hashchange', onClose);
    };
  }, [onClose]);

  return (
    <>
      <div className="scrim" onClick={onClose} />
      <section className="sheet legal-sheet" role="dialog" aria-modal="true" aria-labelledby="legal-title">
        <div className="between legal-head">
          <h2 id="legal-title" className="h2" style={{ fontSize: 24 }}>
            {title}
          </h2>
          <button ref={closeRef} type="button" className="icon-btn" style={{ background: '#fff' }} aria-label={`Close ${title}`} onClick={onClose}>
            <Icon name="x" size={20} />
          </button>
        </div>
        <div className="legal-body">
          {doc === 'privacy' ? <Privacy /> : <Terms />}
          <p className="legal-updated">Last updated {UPDATED}</p>
        </div>
        <button type="button" className="btn btn-ink block" onClick={onClose}>
          Got It
        </button>
      </section>
    </>
  );
}
