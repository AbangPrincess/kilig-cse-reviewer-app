import { maker } from './make';

/*
 * Exam-style Analytical items: three-statement logic, assumptions, conclusions,
 * coding and the letter series used in CSE inductive-reasoning sets.
 */

const q = maker('analytical', 'a2', {
  syllogism: 'Read the statements, then answer the question.',
  ordering: 'Read the information, then answer the question.',
  assumption: 'Read the statement, then choose the best answer.',
  coding: 'Study the code, then answer the question.',
  'letter-series': 'Discover the rule behind the series. What comes next?',
});

const THIRD = 'If the first two statements are true, the third statement is:';
const TFU = ['true', 'false', 'uncertain'];

export const EXAM_ANALYTICAL = [
  // Order and position
  q('ordering', 'Some children chase a goat whose rope has snapped. Ana runs directly behind the goat, Ben behind Ana, and Carlo behind Ben. Dina, walking toward them, turns around and joins the chase directly behind Ben. Then Ana speeds up and runs beside the goat on its left, and Ben runs beside it on its right. Who is now directly behind the goat?', ['Dina', 'Ana', 'Ben', 'Carlo'], 0, 'The line was goat, Ana, Ben, Dina, Carlo. Once Ana and Ben move up beside the goat, Dina is the first one behind it.', {
    steps: ['Start: goat, Ana, Ben, Carlo.', 'Dina joins directly behind Ben: goat, Ana, Ben, Dina, Carlo.', 'Ana and Ben move beside the goat, so Dina is next behind it.'],
  }),

  // Three-statement logic
  q('syllogism', `Ramon logs in before he checks his email.\nHe checks his email before he attends the meeting.\nRamon attends the meeting before he logs in.\n\n${THIRD}`, TFU, 1, 'From the first two: logs in → email → meeting. So the meeting comes after logging in, and the third statement is false.', { fixed: true }),
  q('syllogism', `Jen is older than Kim.\nLou is older than Jen.\nLou is older than Kim.\n\n${THIRD}`, TFU, 0, 'Lou > Jen > Kim, so Lou is older than Kim. The third statement must be true.', { fixed: true }),
  q('syllogism', `All the mangoes in the basket are ripe.\nAll the bananas in the basket are green.\nAll the fruits in the basket are either mangoes or bananas.\n\n${THIRD}`, TFU, 2, 'The first two statements describe the mangoes and bananas, but say nothing about whether other fruits are in the basket. So the third is uncertain.', {
    fixed: true,
    why: { 0: 'Nothing says the basket holds only mangoes and bananas. There could be an apple in there too.' },
  }),
  q('syllogism', `Two notebooks cost the same as three pens.\nSix pens cost the same as one folder.\nA notebook costs more than a folder.\n\n${THIRD}`, TFU, 1, 'A notebook costs 1.5 pens, while a folder costs 6 pens. So a notebook costs less than a folder, and the statement is false.', {
    fixed: true,
    steps: ['2 notebooks = 3 pens, so 1 notebook = 1.5 pens.', '1 folder = 6 pens.', '1.5 pens < 6 pens, so a notebook costs less.'],
  }),
  q('syllogism', 'Buying a new phone every year is a luxury. All luxuries are optional expenses. Paying rent is not a luxury. Taking a taxi to work every day is an optional expense.\n\nWhich conclusion follows?', ['Buying a new phone every year is an optional expense.', 'Paying rent is not an optional expense.', 'Taking a taxi to work every day is a luxury.', 'Taking a taxi to work every day is not an optional expense.'], 0, 'A new phone every year is a luxury, and every luxury is optional, so it is an optional expense.', {
    why: {
      1: 'Rent is not a luxury, but some optional expenses may not be luxuries either. Nothing says rent is required.',
      2: 'All luxuries are optional, but not every optional expense has to be a luxury.',
    },
  }),
  q('syllogism', 'An employee in the office speaks four languages. No one else in the office speaks four languages.\n\nWhich conclusion follows?', ['Only one employee in the office speaks four languages.', 'All the employees speak four languages.', 'Everyone in the office speaks at least two languages.', 'Some employees speak more than four languages.'], 0, 'One employee speaks four languages and no one else does, so exactly one person does.'),
  q('syllogism', 'Social media shows users stories of online scams every day. At the same time, it makes them feel that nothing they do can stop the scammers.\n\nWhich conclusion follows best?', ['Social media may leave users feeling helpless against scams.', 'Social media causes scams.', 'People should stop using social media.', 'Social media users are scammed more often than others.'], 0, 'The two sentences together describe users who are made afraid and made to feel powerless: helpless.'),

  // Assumptions
  q('assumption', 'Statement: The city’s free coding workshop drew three times as many participants as the organizers had prepared for.\n\nAssumptions:\nI. The organizers expected less interest.\nII. Coding is the most popular skill in the city.\nIII. The workshop was advertised on television.\n\nWhich assumption is implicit in the statement?', ['II only', 'I only', 'I and III', 'I, II and III'], 1, 'Preparing for fewer people means they expected less interest (I). Nothing supports II or III.', { fixed: true }),
  q('assumption', 'Statement: The government plans to let private companies run some train lines, but only under strict rules.\n\nWhich is assumed?', ['Some private companies are able to run train lines.', 'Train rides will become free.', 'The government already runs every business.', 'Strict rules are never followed.'], 0, 'The plan only makes sense if some private companies can actually run train lines.'),

  // Coding
  q('coding', 'If HOUSE is written as GNTRD, how is TABLE written in the same code?', ['SZAKD', 'SZBKD', 'UBCMF', 'SAAKD'], 0, 'Each letter moves one step back: T→S, A→Z, B→A, L→K, E→D.', {
    why: { 2: 'UBCMF moves each letter forward. In this code, H became G, so letters move back.' },
  }),
  q('coding', 'In a code, MANGO is written as OCPIQ. How is APPLE written in that code?', ['CRRNG', 'CQQNG', 'BQQMF', 'CRRMG'], 0, 'Each letter moves two steps forward: A→C, P→R, P→R, L→N, E→G.'),
  q('coding', 'If PEARL is written as LRAEP, how is STONE written in the same code?', ['ENOTS', 'ETONS', 'SNOTE', 'ENOST'], 0, 'The code writes the word backward. STONE backward is ENOTS.'),

  // Letter series
  q('letter-series', 'D, G, J, M, P, ___', ['S', 'R', 'T', 'Q'], 0, 'Move forward 3 letters each time: P + 3 = S.', { fixed: true }),
  q('letter-series', 'BC, FG, JK, NO, ___', ['RS', 'QR', 'ST', 'PQ'], 0, 'Each pair starts 4 letters after the last: B, F, J, N, R. So the next pair is RS.'),
  q('letter-series', 'XW, UT, RQ, ON, ___', ['LK', 'ML', 'KJ', 'NM'], 0, 'Each pair goes backward, and each pair starts 3 letters before the last: X, U, R, O, L. So LK.'),
  q('letter-series', 'B, D, G, K, P, ___', ['V', 'U', 'W', 'T'], 0, 'The jumps grow by one: +2, +3, +4, +5, then +6. P + 6 = V.'),
  q('letter-series', 'NY, LW, JU, HS, ___', ['FQ', 'GR', 'EP', 'FR'], 0, 'Both letters move back 2 each time: N, L, J, H, F and Y, W, U, S, Q.'),
  q('letter-series', 'KN, JO, IP, HQ, ___', ['GR', 'FS', 'GS', 'HR'], 0, 'The first letter moves back one (K, J, I, H, G); the second moves forward one (N, O, P, Q, R).'),
  q('letter-series', 'C, C, G, G, K, K, O, O, ___', ['S', 'R', 'P', 'T'], 0, 'Each letter appears twice, and the letters jump by 4: C, G, K, O, S.', { fixed: true }),
  q('letter-series', 'B, D, D, G, G, G, ___', ['K', 'J', 'H', 'L'], 0, 'One B, two D’s, three G’s: the letters jump +2, +3, so next is +4 from G, which is K (shown four times).'),
  q('letter-series', 'C D, F E, G H, J I, ___', ['K L', 'L K', 'K M', 'M L'], 0, 'Pairs of neighboring letters alternate between forward and backward order: CD, FE, GH, JI, then KL forward.'),
  q('letter-series', 'A, BC, DEF, ___', ['GHIJ', 'GHIK', 'FGHI', 'HIJK'], 0, 'Each group has one more letter and picks up where the last stopped: A | BC | DEF | GHIJ.'),
];
