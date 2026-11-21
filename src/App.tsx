import { useEffect, useState } from 'react';
import { StoreProvider, useStore } from './lib/store';
import { Splash } from './components/Splash';
import { useRoute } from './lib/router';
import type { SectionId } from './lib/types';
import type { SessionKind } from './lib/sessions';
import { TOPICS } from './data/topics';
import { Home } from './screens/Home';
import { Learn } from './screens/Learn';
import { Lesson } from './screens/Lesson';
import { Practice } from './screens/Practice';
import { Speed } from './screens/Speed';
import { ExamRunScreen, ExamStart } from './screens/Exam';
import { MockReview, Results } from './screens/Results';
import { Me } from './screens/Me';
import { Group } from './screens/Group';
import { Welcome } from './screens/Welcome';

const SECTION_IDS: SectionId[] = ['numerical', 'verbal', 'analytical', 'geninfo'];
const KINDS: SessionKind[] = ['topic', 'section', 'quick', 'review', 'mastery', 'diagnostic'];

function Screens() {
  const { state } = useStore();
  const { path, query } = useRoute();
  const key = `${path}?${query.toString()}`;

  useEffect(() => {
    document.title = 'Kilig CSE Reviewer';
  }, []);

  const topic = query.get('topic') ?? undefined;
  const validTopic = topic && TOPICS.some((t) => t.id === topic) ? topic : undefined;
  const sectionParam = query.get('section') as SectionId | null;
  const section = sectionParam && SECTION_IDS.includes(sectionParam) ? sectionParam : undefined;

  if (!state.profile.onboarded && path !== '/practice') return <Welcome />;

  switch (path) {
    case '/learn':
      return <Learn key={key} section={section ?? 'numerical'} />;
    case '/lesson':
      return validTopic ? <Lesson key={key} topic={validTopic} /> : <Learn section="numerical" />;
    case '/practice': {
      const kind = query.get('kind') as SessionKind | null;
      if (!kind || !KINDS.includes(kind) || ((kind === 'topic' || kind === 'mastery') && !validTopic)) return <Home />;
      return <Practice key={key} kind={kind} topic={validTopic} section={section} />;
    }
    case '/speed':
      return <Speed key={key} />;
    case '/exam':
      return <ExamStart key={key} />;
    case '/exam/run':
      return <ExamRunScreen key={key} />;
    case '/results':
      return <Results key={key} id={query.get('id')} />;
    case '/mock-review':
      return <MockReview key={key} id={query.get('id')} />;
    case '/me':
      return <Me key={key} />;
    case '/group':
      return <Group />;
    default:
      return <Home key={key} />;
  }
}

export default function App() {
  const [splash, setSplash] = useState(true);
  return (
    <StoreProvider>
      <div className="app">
        <Screens />
      </div>
      {splash && <Splash onDone={() => setSplash(false)} />}
    </StoreProvider>
  );
}
