import type { Question, SectionId } from '../../lib/types';

export type Extra = Partial<
  Pick<Question, 'why' | 'passage' | 'source' | 'fixed' | 'directions' | 'chart' | 'group' | 'table' | 'figure' | 'figChoices' | 'steps' | 'shortcut'>
>;

export function maker(section: SectionId, prefix: string, directions: Record<string, string>) {
  let n = 0;
  return (topic: string, stem: string, choices: string[], answer: number, explain: string, extra: Extra = {}): Question => {
    n += 1;
    return {
      id: `${prefix}-${String(n).padStart(3, '0')}`,
      section,
      topic,
      directions: directions[topic],
      stem,
      choices,
      answer,
      explain,
      ...extra,
    };
  };
}
