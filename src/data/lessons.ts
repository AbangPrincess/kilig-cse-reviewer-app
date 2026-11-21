import { LESSONS as NUMERICAL_LESSONS, type Lesson } from './numerical/lessons';
import { VERBAL_LESSONS } from './verbal/lessons';
import { ANALYTICAL_LESSONS } from './analytical/lessons';
import { GENINFO_LESSONS } from './geninfo/lessons';

export type { Lesson, LessonCard } from './numerical/lessons';

/** Every topic's lesson, across all four sections. */
export const LESSONS: Record<string, Lesson> = {
  ...NUMERICAL_LESSONS,
  ...VERBAL_LESSONS,
  ...ANALYTICAL_LESSONS,
  ...GENINFO_LESSONS,
};
