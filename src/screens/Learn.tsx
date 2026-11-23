import { useState } from 'react';
import { useStore } from '../lib/store';
import { LOVE_LABELS, recommendedTopic, topicOf } from '../lib/progress';
import { CHAPTERS, SECTIONS, TOPICS_BY_SECTION, topicById } from '../data/topics';
import { LESSONS } from '../data/lessons';
import type { SectionId } from '../lib/types';
import { DecoHeart, Icon, LoveHearts } from '../components/Icons';
import { TabBar } from '../components/TabBar';
import { ScrollRow } from '../components/Common';
import { go, href } from '../lib/router';

const ZIGZAG = [8, 72, 136, 72];
/** Order of the section buttons on the Learn tab. The tab opens on the first one. */
export const LEARN_ORDER: SectionId[] = ['verbal', 'analytical', 'numerical', 'geninfo'];

export function Learn({ section: initial }: { section: SectionId }) {
  const { state } = useStore();
  const [section, setSection] = useState<SectionId>(initial);
  const [open, setOpen] = useState<number | null>(null);
  const [sheet, setSheet] = useState<string | null>(null);

  const topics = TOPICS_BY_SECTION[section];
  const sec = SECTIONS.find((s) => s.id === section)!;
  const rec = recommendedTopic(state, section);
  const recTopic = topicById(rec)!;
  const recLevel = topicOf(state, rec).level;
  const missed = state.diagnostic?.byTopic[rec];

  const pickSection = (id: SectionId) => {
    setSection(id);
    setOpen(null);
    window.history.replaceState(null, '', `#/learn?section=${id}`);
  };

  return (
    <>
      <main className="screen">
        <h1 className="h1">Learn</h1>
        <ScrollRow role="tablist" aria-label="Sections">
          {LEARN_ORDER.map((id) => SECTIONS.find((s) => s.id === id)!).map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={s.id === section}
              className="chip-btn"
              onClick={(e) => {
                pickSection(s.id);
                e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
              }}
            >
              {s.short}
            </button>
          ))}
        </ScrollRow>

        <a href={href(recLevel === 0 ? `/lesson?topic=${rec}` : `/practice?kind=topic&topic=${rec}`)} className="hero stack" style={{ textDecoration: 'none', gap: 10, borderRadius: 28, padding: 20 }}>
          <DecoHeart size={170} color="var(--rose)" opacity={0.45} rotate={-12} style={{ right: -44, bottom: -58 }} />
          <span className="kicker row" style={{ color: 'var(--sun)', gap: 6 }}>
            <Icon name="broken" size={16} stroke={2.2} />
            Needs Some Love
          </span>
          <span className="display" style={{ fontSize: 28, color: '#fff', lineHeight: 1.05 }}>{recTopic.name}</span>
          <span style={{ fontSize: 15, color: 'var(--plum-ink)' }}>
            {missed && missed.c < missed.t
              ? "You missed this in your diagnostic. Let's fix this relationship."
              : `Status: ${LOVE_LABELS[recLevel]}. Let's take it to the next level.`}
          </span>
          <span className="btn btn-sun" style={{ alignSelf: 'flex-start', minHeight: 46, fontSize: 15, padding: '0 18px' }}>
            {recLevel === 0 ? `Start Lesson · ${LESSONS[rec].minutes} Min` : 'Practice 10 Questions'}
          </span>
        </a>

        {section === 'numerical' ? (
          <a href={href('/speed')} className="row card" style={{ textDecoration: 'none', color: 'var(--ink)', padding: '14px 16px', background: 'var(--sun-soft)', borderColor: 'var(--sun-soft)' }}>
            <span style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--sun)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="bolt" size={20} />
            </span>
            <span className="grow stack" style={{ gap: 0 }}>
              <span style={{ fontWeight: 800 }}>2-Minute Speed Round</span>
              <span className="small muted">Mental math that saves time on exam day</span>
            </span>
            <Icon name="chevron" size={18} color="var(--muted)" />
          </a>
        ) : (
          <a href={href(`/practice?kind=section&section=${section}`)} className="row card" style={{ textDecoration: 'none', color: 'var(--ink)', padding: '14px 16px', background: 'var(--sun-soft)', borderColor: 'var(--sun-soft)' }}>
            <span style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--sun)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="grid" size={20} />
            </span>
            <span className="grow stack" style={{ gap: 0 }}>
              <span style={{ fontWeight: 800 }}>Mixed Practice Set</span>
              <span className="small muted">10 items from all {sec.short} topics</span>
            </span>
            <Icon name="chevron" size={18} color="var(--muted)" />
          </a>
        )}

        <div className="card stack" style={{ padding: 14, gap: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>Every Topic Is a Relationship</span>
          <div className="legend">
            {[0, 1, 2, 3].map((l) => (
              <div key={l}>
                <LoveHearts level={l} size={12} />
                <span style={l === 3 ? { color: 'var(--rose)', fontWeight: 700 } : undefined}>{LOVE_LABELS[l as 0]}</span>
              </div>
            ))}
          </div>
          <span className="small muted">Read the lesson → Crush. Pass a practice set → Dating. Pass the timed mastery check → Committed.</span>
        </div>

        {([1, 2, 3] as const).map((ch) => {
          const list = topics.filter((t) => t.chapter === ch);
          if (!list.length) return null;
          const committed = list.filter((t) => topicOf(state, t.id).level === 3).length;
          const title = `Chapter ${ch} · ${CHAPTERS[section][ch]}`;
          if (open !== ch) {
            return (
              <button key={ch} type="button" className="chapter-btn" aria-expanded={false} onClick={() => setOpen(ch)}>
                <span className="stack" style={{ gap: 2 }}>
                  <span style={{ fontSize: 16, fontWeight: 700 }}>{title}</span>
                  <span className="small muted">
                    {list.length} topic{list.length === 1 ? '' : 's'} · {committed} committed{list.some((t) => t.id === rec) ? ` · ${recTopic.name} is here` : ''}
                  </span>
                </span>
                <Icon name="chevron" size={20} color="var(--muted)" />
              </button>
            );
          }
          return (
            <section key={ch} className="stack" style={{ gap: 14 }}>
              <h2 className="h2">
                <button type="button" className="chapter-head" aria-expanded onClick={() => setOpen(null)}>
                  <span>{title}</span>
                  <span className="row" style={{ gap: 6, flexShrink: 0, fontFamily: 'var(--sans)' }}>
                    <span className="small muted" style={{ fontWeight: 600 }}>{committed} of {list.length}</span>
                    <Icon name="chevron" size={18} color="var(--muted)" style={{ transform: 'rotate(-90deg)' }} />
                  </span>
                </button>
              </h2>
              <div className="path">
                {list.map((t, i) => {
                  const lv = topicOf(state, t.id).level;
                  return (
                    <button key={t.id} type="button" className="node" style={{ paddingLeft: ZIGZAG[i % ZIGZAG.length] }} onClick={() => setSheet(t.id)}>
                      <span className={`node-dot l${lv}${t.id === rec ? ' rec' : ''}`}>
                        {lv === 3 ? <Icon name="heart" filled size={28} color="#fff" /> : lv > 0 ? <Icon name="heart" size={26} stroke={2.4} /> : topics.indexOf(t) + 1}
                      </span>
                      <span className="stack" style={{ gap: 3 }}>
                        <span className="node-name">{t.name}</span>
                        <span className="row" style={{ gap: 6 }}>
                          <LoveHearts level={lv} />
                          <span className="small" style={{ fontWeight: 700, color: lv === 3 ? 'var(--rose)' : 'var(--muted)' }}>{LOVE_LABELS[lv]}</span>
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>

      {sheet && <TopicSheet topic={sheet} onClose={() => setSheet(null)} />}
      <TabBar active="learn" />
    </>
  );
}

function TopicSheet({ topic, onClose }: { topic: string; onClose: () => void }) {
  const { state } = useStore();
  const t = topicById(topic)!;
  const tp = topicOf(state, topic);
  const acc = tp.answered ? Math.round((tp.correct / tp.answered) * 100) : null;
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <section className="sheet" role="dialog" aria-modal="true" aria-label={t.name}>
        <div className="between">
          <span className="h2" style={{ fontSize: 24 }}>{t.name}</span>
          <button type="button" className="icon-btn" style={{ background: 'var(--blush)' }} aria-label="Close" onClick={onClose}>
            <Icon name="x" size={20} />
          </button>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <LoveHearts level={tp.level} size={16} />
          <strong style={{ color: 'var(--rose)' }}>{LOVE_LABELS[tp.level]}</strong>
          {acc !== null && <span className="small muted">· {acc}% correct of {tp.answered} answered</span>}
        </div>
        <button type="button" className="btn btn-ghost block" onClick={() => go(`/lesson?topic=${topic}`)}>
          <Icon name="book" size={20} /> Read the Lesson · {LESSONS[topic].minutes} Min
        </button>
        <button type="button" className="btn btn-rose block" onClick={() => go(`/practice?kind=topic&topic=${topic}`)}>
          Practice 10 Questions
        </button>
        <button type="button" className="btn btn-ink block" onClick={() => go(`/practice?kind=mastery&topic=${topic}`)}>
          <Icon name="clock" size={20} /> Mastery Check · 10 Timed
        </button>
        <span className="small muted center">Get 8 of 10 right at under 1 minute each to become Committed.</span>
      </section>
    </>
  );
}
