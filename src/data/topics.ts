import type { SectionId } from '../lib/types';

export interface Topic {
  id: string;
  name: string;
  section: SectionId;
  chapter: 1 | 2 | 3;
}

/** @deprecated kept for older imports; use Topic. */
export type NumTopic = Topic;

const t = (section: SectionId) => (id: string, name: string, chapter: 1 | 2 | 3): Topic => ({ id, name, section, chapter });
const num = t('numerical');
const ver = t('verbal');
const ana = t('analytical');
const gen = t('geninfo');

export const NUM_TOPICS: Topic[] = [
  num('order', 'Order of Operations', 1),
  num('fractions', 'Fractions and Decimals', 1),
  num('percent', 'Percent', 1),
  num('ratio', 'Ratio and Proportion', 1),
  num('series', 'Number Series', 1),
  num('equations', 'Turning Words into Equations', 2),
  num('discount', 'Discount, Markup and Profit', 2),
  num('interest', 'Simple Interest', 2),
  num('age', 'Age Problems', 2),
  num('work', 'Work Problems', 2),
  num('motion', 'Distance, Speed and Time', 2),
  num('mixture', 'Mixtures, Coins and Averages', 2),
  num('geometry', 'Measurement and Geometry', 3),
  num('data', 'Reading Tables and Charts', 3),
  num('tricks', 'Exam Tricks: Estimate, Plug In, Eliminate', 3),
];

export const VERBAL_TOPICS: Topic[] = [
  ver('vocab', 'Vocabulary (English)', 1),
  ver('vocab-fil', 'Vocabulary (Filipino)', 1),
  ver('antonym', 'Opposite Meanings', 1),
  ver('idioms', 'Idioms and Expressions', 1),
  ver('spelling', 'Spelling', 1),
  ver('grammar', 'Grammar and Correct Usage', 2),
  ver('grammar-fil', 'Wastong Gamit (Filipino)', 2),
  ver('analogy', 'Word Analogy', 3),
  ver('paragraph', 'Paragraph Organization', 3),
  ver('reading', 'Reading Comprehension', 3),
];

export const ANALYTICAL_TOPICS: Topic[] = [
  ana('syllogism', 'Logic and Conclusions', 1),
  ana('assumption', 'Assumptions and Conclusions', 1),
  ana('ordering', 'Ordering and Arrangement', 1),
  ana('letter-series', 'Letter Series', 2),
  ana('figures', 'Figure Patterns', 2),
  ana('odd-one', 'Odd One Out', 2),
  ana('association', 'Word Association', 2),
  ana('coding', 'Coding and Decoding', 2),
  ana('relations', 'Family Relations', 3),
  ana('calendar', 'Days and Calendars', 3),
];

export const GENINFO_TOPICS: Topic[] = [
  gen('constitution', '1987 Constitution', 1),
  gen('civil-service', 'Civil Service and Good Governance', 2),
  gen('ra6713', 'RA 6713 Code of Conduct', 2),
  gen('human-rights', 'Peace and Human Rights', 3),
  gen('environment', 'Environment', 3),
];

export const TOPICS_BY_SECTION: Record<SectionId, Topic[]> = {
  numerical: NUM_TOPICS,
  verbal: VERBAL_TOPICS,
  analytical: ANALYTICAL_TOPICS,
  geninfo: GENINFO_TOPICS,
};

export const TOPICS: Topic[] = [...NUM_TOPICS, ...VERBAL_TOPICS, ...ANALYTICAL_TOPICS, ...GENINFO_TOPICS];

export const CHAPTERS: Record<SectionId, Record<1 | 2 | 3, string>> = {
  numerical: { 1: 'Foundations', 2: 'Word Problems', 3: 'Data and Exam Skills' },
  verbal: { 1: 'Word Power', 2: 'Grammar and Usage', 3: 'Reading and Reasoning' },
  analytical: { 1: 'Logic', 2: 'Patterns', 3: 'Everyday Puzzles' },
  geninfo: { 1: 'The 1987 Constitution', 2: 'Public Service', 3: 'People and Planet' },
};

export const SECTIONS: { id: SectionId; name: string; short: string; color: string; shade: string; ink: string }[] = [
  { id: 'numerical', name: 'Numerical Ability', short: 'Numerical', color: '#D6224F', shade: '#A8183D', ink: '#FFFFFF' },
  { id: 'verbal', name: 'Verbal Ability', short: 'Verbal', color: '#6B3FD4', shade: '#4C2A9E', ink: '#FFFFFF' },
  { id: 'analytical', name: 'Analytical Ability', short: 'Analytical', color: '#0B7A8A', shade: '#075761', ink: '#FFFFFF' },
  { id: 'geninfo', name: 'General Information', short: 'General Info', color: '#FFC23D', shade: '#C98F12', ink: '#2A1225' },
];

export const sectionName = (id: SectionId) => SECTIONS.find((s) => s.id === id)?.short ?? id;

export const topicById = (id: string): Topic | undefined => TOPICS.find((x) => x.id === id);

export function topicName(id: string): string {
  return topicById(id)?.name ?? id;
}
