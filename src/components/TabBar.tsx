import { Icon, type IconName } from './Icons';
import { href } from '../lib/router';

const TABS: { id: string; label: string; to: string; icon: IconName }[] = [
  { id: 'home', label: 'Home', to: '/', icon: 'home' },
  { id: 'learn', label: 'Learn', to: '/learn', icon: 'book' },
  { id: 'exam', label: 'Exam', to: '/exam', icon: 'exam' },
  { id: 'me', label: 'Me', to: '/me', icon: 'user' },
];

export function TabBar({ active }: { active: string }) {
  return (
    <nav className="tabbar" aria-label="Main">
      <div className="tabbar-inner">
        {TABS.map((t) => (
          <a key={t.id} href={href(t.to)} className={t.id === active ? 'tab active' : 'tab'} aria-current={t.id === active ? 'page' : undefined}>
            <Icon name={t.icon} size={22} stroke={t.id === active ? 2.2 : 1.9} />
            <span>{t.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
