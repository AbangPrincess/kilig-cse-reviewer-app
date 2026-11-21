import type { Lesson } from '../numerical/lessons';

const LOVE = 'Think of It like Love';

export const ANALYTICAL_LESSONS: Record<string, Lesson> = {
  syllogism: {
    topic: 'syllogism',
    minutes: 4,
    cards: [
      { kind: 'love', kicker: LOVE, title: 'All, Some and None', body: ['"All my exes are from Manila. Some people from Manila are rich." Does that mean some of your exes are rich? **Not necessarily.**', 'Logic items test what MUST be true, not what might be true.'] },
      { kind: 'idea', kicker: 'The Secret', title: 'Draw the Circles', body: ['Draw each group as a circle. "All A are B" → circle A sits **inside** circle B.', '"Some A are B" → the circles **overlap**. "No A are B" → the circles **do not touch**.'], example: { q: 'All nurses are health workers. All health workers got vaccinated.', steps: ['The nurses circle sits inside the health workers circle.', 'The health workers circle sits inside the vaccinated circle.', 'So the nurses circle is inside the vaccinated circle.'], answer: 'All nurses got vaccinated.' } },
      { kind: 'rule', kicker: 'The Rule', title: 'If-Then Only Works One Way', formula: 'If A, then B. Not B → not A.', formulaNote: '"If it rains, the road gets wet." A dry road proves it did not rain. A wet road does NOT prove it rained.', shortcut: { title: 'Must-Be-True Checklist', lines: ['Use only the statements given', 'Ignore what is true in real life', '"Some" means at least one', 'If you can imagine it failing, it is not a MUST'] } },
      { kind: 'trap', kicker: 'Heartbreak Trap', title: 'Some Does Not Pass Along', wrong: 'All A are B. Some B are C. → Some A are C.', body: ["The B's that are C could be B's that are **not** A. Nothing links A to C for sure.", 'When the middle group only has "some", the answer is usually **cannot be determined**.'] },
    ],
  },
  assumption: {
    topic: 'assumption',
    minutes: 4,
    cards: [
      { kind: 'love', kicker: LOVE, title: 'Reading between the Lines', body: ['When your date says "Let\'s eat somewhere near your place," they assume you would rather stay close to home.', 'An **assumption** is the unspoken belief behind a statement. A **conclusion** is what logically follows from it.'] },
      { kind: 'idea', kicker: 'The Secret', title: 'Ask: Why Would They Say This?', body: ['For assumptions, ask what the speaker must believe for the statement to make sense.', 'For conclusions, ask what must follow, using only the statement.'], example: { q: 'Notice: "Bring an umbrella; rain is expected this afternoon."', steps: ['Why say it? Because an umbrella helps in the rain.', 'Assumed: an umbrella keeps you dry.', 'Not assumed: it rains every day, or umbrellas are cheap.'], answer: 'An umbrella will help in the rain.' } },
      { kind: 'rule', kicker: 'The Rule', title: 'Stay Close to the Statement', formula: 'Assumption = needed for it to make sense', formulaNote: 'The best answer is usually the simplest, most direct one. Extreme words like always, never, all and only are red flags.', shortcut: { title: 'Red Flags in Choices', lines: ['always, never, all, only', 'blames someone not mentioned', 'adds new facts or numbers', 'goes far beyond the notice'] } },
      { kind: 'trap', kicker: 'Heartbreak Trap', title: "Don't Add Your Own Story", wrong: '"The lines are long." → "The employees are lazy."', body: ['The statement never said why the lines are long. Blaming the employees adds your own story.', 'Pick the choice the statement **needs**, not the one you would personally guess.'] },
    ],
  },
  ordering: {
    topic: 'ordering',
    minutes: 3,
    cards: [
      { kind: 'love', kicker: LOVE, title: 'Who Liked the Post First?', body: ['Your crush liked your post before your bestie did. Your bestie liked it before your mom. Who liked it first?', 'Ordering items are about putting people or things in a line using clues.'] },
      { kind: 'idea', kicker: 'The Secret', title: 'Draw a Line, Then Place Each Clue', body: ['Draw a line: left to right, tallest to shortest, or first to last.', 'Place the **surest** clue first, then fit the others around it.'], example: { q: 'Ana is older than Bea. Cris is younger than Bea. Who is the youngest?', steps: ['Ana > Bea.', 'Bea > Cris.', 'Line: Ana > Bea > Cris.'], answer: 'Cris' } },
      { kind: 'rule', kicker: 'The Rule', title: 'Write It with Symbols', formula: 'A is taller than B → A > B', formulaNote: '"Directly" means right next to. "Left of" alone means anywhere to the left, not always next to.', shortcut: { title: 'Common Clue Words', lines: ['before / ahead of → earlier in line', 'after / behind → later in line', 'directly → next to, nothing between', 'between → one on each side'] } },
      { kind: 'trap', kicker: 'Heartbreak Trap', title: "Don't Assume They're Neighbors", wrong: '"Dan is left of Eli" → Dan sits right next to Eli', body: ['"Left of" does not mean "directly left of". Someone could sit between them.', 'Only place two people side by side when the clue says **directly** or **next to**.'] },
    ],
  },
  'letter-series': {
    topic: 'letter-series',
    minutes: 4,
    cards: [
      { kind: 'love', kicker: LOVE, title: 'Counting the Days between Dates', body: ['You go out every 3 days: day 1, day 4, day 7. You already know your next date is day 10.', 'Letter series work the same way, once you turn letters into numbers.'] },
      { kind: 'idea', kicker: 'The Secret', title: 'Turn Letters into Numbers', body: ["Write each letter's position: A = 1, B = 2, C = 3 … Z = 26.", 'Find the gaps between the numbers, then continue the pattern.'], example: { q: 'D, G, J, M, ___', steps: ['D = 4, G = 7, J = 10, M = 13.', 'The gap is +3 every time.', '13 + 3 = 16, which is P.'], answer: 'P' } },
      { kind: 'rule', kicker: 'The Rule', title: 'Remember the Landmarks', formula: 'E J O T Y = 5, 10, 15, 20, 25', formulaNote: 'Count from the nearest landmark instead of from A. M is 13 because it is 2 letters before O (15).', shortcut: { title: 'Patterns to Check', lines: ['Same gap: A, C, E, G', 'Growing gap: A, B, D, G', 'Going backward: Z, X, V', 'Two series taking turns: M, N, L, O, K'] } },
      { kind: 'trap', kicker: 'Heartbreak Trap', title: 'Check the Whole Pattern', wrong: 'B, C, E, H, ___ → I', body: ['The gaps are +1, +2, +3, so the next gap is **+4**: H (8) + 4 = **L** (12).', 'Look at every gap, not only the last one.'] },
    ],
  },
  'odd-one': {
    topic: 'odd-one',
    minutes: 3,
    cards: [
      { kind: 'love', kicker: LOVE, title: "Who Doesn't Belong in the Barkada?", body: ['Four friends: three love karaoke, one hates it. You can already tell who will skip videoke night.', 'Find what **most** of the items share. The odd one is the one that does not.'] },
      { kind: 'idea', kicker: 'The Secret', title: 'Name the Group', body: ['Look for a group name that fits three of the four: fruits, planets, prime numbers, local officials.', 'If two group names work, pick the one that leaves **exactly one** item out.'], example: { q: 'tuna, salmon, shark, dolphin', steps: ['Tuna, salmon and shark are fish.', 'A dolphin is a mammal.', 'The odd one is the dolphin.'], answer: 'dolphin' } },
      { kind: 'rule', kicker: 'The Rule', title: 'Try Many Kinds of Groups', formula: 'Type · Use · Place · Number rule', formulaNote: 'If your first idea does not leave one item out, try another: what it is, what it is used for, where it is found, or a number rule.', shortcut: { title: 'Number Groups', lines: ['Even or odd', 'Prime: 2, 3, 5, 7, 11, 13', 'Squares: 1, 4, 9, 16, 25', 'Multiples: 3, 6, 9, 12'] } },
      { kind: 'trap', kicker: 'Heartbreak Trap', title: 'Go Deeper Than Size', wrong: 'gram, kilogram, meter, milligram → kilogram', body: ['Kilogram is the biggest, but size is not the group. Gram, kilogram and milligram measure **weight**; meter measures **length**.', 'Look at what the items **are**, not how big they are or how they look.'] },
    ],
  },
  association: {
    topic: 'association',
    minutes: 3,
    cards: [
      { kind: 'love', kicker: LOVE, title: 'Things That Remind You of Them', body: ['A certain song, a certain jacket, a certain milk tea flavor: they all remind you of one person.', 'Word association items give you a few clues. Find the one thing they all point to.'] },
      { kind: 'idea', kicker: 'The Secret', title: "Picture Where You'd Find Them", body: ['Imagine a place, event or job where all the clue words show up together.', 'The answer is usually that place, event or job.'], example: { q: 'chalk, roll call, recess', steps: ['Where do you find all three?', 'A teacher uses chalk, calls the roll and gives recess.', 'Answer: school.'], answer: 'school' } },
      { kind: 'rule', kicker: 'The Rule', title: 'Every Clue Must Fit', formula: 'The answer fits every clue', formulaNote: 'A choice that matches only one or two clues is a trap. Test your answer against each word.', shortcut: { title: 'Common Groups', lines: ['Places: hospital, court, bank, market', 'Events: election, wedding, fiesta', 'Jobs: farmer, pilot, chef', 'Weather: typhoon, drought, monsoon'] } },
      { kind: 'trap', kicker: 'Heartbreak Trap', title: "Don't Stop at the First Clue", wrong: 'needle, thread, fabric → hospital', body: ['A needle can be found in a hospital, but thread and fabric point to **sewing**.', 'Check that your answer fits **every** clue, not just the first one.'] },
    ],
  },
  coding: {
    topic: 'coding',
    minutes: 4,
    cards: [
      { kind: 'love', kicker: LOVE, title: 'Your Secret Couple Code', body: ['Some couples text "143" for "I love you": 1 letter, 4 letters, 3 letters.', 'Coding items hide words with a rule. Crack the rule from the example, then use it.'] },
      { kind: 'idea', kicker: 'The Secret', title: 'Line Up the Letters', body: ['Write the word and its code one letter on top of the other.', 'Compare each pair: did the letter move forward, move back, or swap places?'], example: { q: 'If BOOK is CPPL, what is DESK?', steps: ['B→C, O→P, O→P, K→L: every letter moves +1.', 'D→E, E→F, S→T, K→L.', 'DESK becomes EFTL.'], answer: 'EFTL' } },
      { kind: 'rule', kicker: 'The Rule', title: 'The Usual Rules', formula: 'Shift · Reverse · Swap · Number', formulaNote: 'Most codes move every letter by the same step, write the word backward, swap letters in pairs, or turn letters into numbers (A = 1, B = 2…).', shortcut: { title: 'Word Codes', lines: ['Two phrases that share a word share a code word', '"pen" = xo and "red pen" = xo ki → red = ki', 'Match the shared words first'] } },
      { kind: 'trap', kicker: 'Heartbreak Trap', title: 'Check Every Letter', wrong: 'SUN → TVO, so MOON → NPPN', body: ['The last letter N must also move +1, to O. MOON becomes **NPPO**.', 'Apply the rule to every letter, then check your answer letter by letter.'] },
    ],
  },
  relations: {
    topic: 'relations',
    minutes: 4,
    cards: [
      { kind: 'love', kicker: LOVE, title: 'Meeting the Whole Family', body: ['Your partner takes you home for Noche Buena. Titas, titos, lolas and cousins everywhere. Who is who?', 'Family relation items test the same thing. Draw it and it gets easy.'] },
      { kind: 'idea', kicker: 'The Secret', title: 'Draw the Family Tree', body: ['Put older generations on top and children below. Draw a line for marriage and lines down to children.', 'Mark each person as **male** or **female** when you know it.'], example: { q: "Lito is the father of Mara. Mara's brother is Ben. How is Lito related to Ben?", steps: ['Lito on top; Mara and Ben below as siblings.', "Mara's brother has the same father.", "Lito is Ben's father."], answer: 'Father' } },
      { kind: 'rule', kicker: 'The Rule', title: 'Know the Key Words', formula: "Parent's sibling = uncle or aunt", formulaNote: "Sibling's child = nephew or niece. Parent's parent = grandparent. Spouse's sibling = brother- or sister-in-law.", shortcut: { title: 'Only-Child Clues', lines: ['"my mother\'s only son", said by a woman = her brother', '"my father\'s only son", said by a man = himself', '"my mother\'s husband" = my father'] } },
      { kind: 'trap', kicker: 'Heartbreak Trap', title: 'Gender Is Not Always Given', wrong: '"A is the brother of B" → B is a boy', body: ['"A is the brother of B" tells you A is male. It says **nothing** about whether B is male or female.', 'If a gender is never given, the answer may be **cannot be determined**.'] },
    ],
  },
  calendar: {
    topic: 'calendar',
    minutes: 3,
    cards: [
      { kind: 'love', kicker: LOVE, title: 'Counting Down to Your Monthsary', body: ['Your first date was on a Friday. Your monthsary is 30 days later. What day will it be?', 'Every 7 days, the day of the week repeats. Only the **leftover days** matter.'] },
      { kind: 'idea', kicker: 'The Secret', title: 'Divide by 7, Keep the Remainder', body: ['Divide the number of days by 7. Ignore the full weeks.', 'Count the remainder forward from the starting day.'], example: { q: '30 days after a Friday', steps: ['30 ÷ 7 = 4 weeks, remainder 2.', 'Count 2 days forward from Friday: Saturday, Sunday.'], answer: 'Sunday' } },
      { kind: 'rule', kicker: 'The Rule', title: 'Days in Each Month', formula: '30 days: April, June, September, November', formulaNote: 'February has 28 days, or 29 in a leap year. All the other months have 31.', shortcut: { title: 'Leap Year Rule', lines: ['Divisible by 4 → leap year (2024, 2028)', 'Century years must be divisible by 400', '2000 was a leap year; 1900 was not'] } },
      { kind: 'trap', kicker: 'Heartbreak Trap', title: 'Start Counting the Next Day', wrong: '2 days after Monday → Tuesday', body: ['Tuesday is 1 day after Monday. Wednesday is 2 days after.', 'Do not count the starting day itself. Start from the **next** day.'] },
    ],
  },
};
