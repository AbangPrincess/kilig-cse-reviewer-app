export interface LessonBar {
  label: string;
  value: string;
  /** One entry per filled cell: 1 = light rose, 2 = rose. */
  cells: (1 | 2)[];
  total: number;
  strong?: boolean;
}

export interface LessonCard {
  kind: 'love' | 'idea' | 'rule' | 'trap';
  kicker: string;
  title: string;
  /** Paragraphs. Wrap words in **double stars** to bold them. */
  body?: string[];
  bars?: LessonBar[];
  barsNote?: string;
  example?: { q: string; steps: string[]; answer: string };
  formula?: string;
  formulaNote?: string;
  shortcut?: { title: string; lines: string[] };
  wrong?: string;
}

export interface Lesson {
  topic: string;
  minutes: number;
  cards: LessonCard[];
}

const LOVE = 'Think of It like Love';

export const LESSONS: Record<string, Lesson> = {
  order: {
    topic: 'order',
    minutes: 3,
    cards: [
      { kind: 'love', kicker: LOVE, title: 'First Things First on a Date', body: ["You don't order dessert before you even pick up your date. A good date has an order: pick them up, have dinner, then dessert.", 'Math has an order too. Do it in the wrong order and the whole night falls apart.'] },
      { kind: 'idea', kicker: 'The Secret', title: 'P, E, Then MD, Then AS', body: ['**P**arentheses first.', '**E**xponents next (like 3² = 9).', '**M**ultiply and **D**ivide, from left to right.', '**A**dd and **S**ubtract, from left to right.'], example: { q: '8 + 4 × 3 − 6 ÷ 2', steps: ['4 × 3 = 12', '6 ÷ 2 = 3', '8 + 12 − 3 = 17'], answer: '17' } },
      { kind: 'rule', kicker: 'The Rule', title: 'Know Who Goes First', formula: 'P → E → MD → AS', formulaNote: 'Multiply and divide are equal partners: do whichever comes first from the left. Same with add and subtract.' },
      { kind: 'trap', kicker: 'Heartbreak Trap', title: "Don't Just Read Left to Right", wrong: '8 + 4 = 12 → × 3 = 36 → − 6 = 30 → ÷ 2 = 15', body: ['Reading straight across gives 15. The right answer is **17**.', 'Multiplication and division always cut in line before addition and subtraction.'] },
    ],
  },
  fractions: {
    topic: 'fractions',
    minutes: 4,
    cards: [
      { kind: 'love', kicker: LOVE, title: 'Sharing a Cake Fairly', body: ['You and your partner share a cake. You eat **1/2**, they eat **1/3**. How much is gone?', "You can't just add the tops and the bottoms. First, cut the cake into slices of the same size."] },
      { kind: 'idea', kicker: 'The Secret', title: 'Make the Bottoms Match', body: ['1/2 is the same as **3/6**. 1/3 is the same as **2/6**.', 'Now the slices match, so add the tops: 3/6 + 2/6 = **5/6** of the cake.'], bars: [
        { label: 'You: 1/2', value: '3/6', cells: [2, 2, 2], total: 6 },
        { label: 'Partner: 1/3', value: '2/6', cells: [1, 1], total: 6 },
        { label: 'Together', value: '5/6', cells: [2, 2, 2, 1, 1], total: 6, strong: true },
      ] },
      { kind: 'rule', kicker: 'The Rule', title: 'Same Bottom, Then Add the Tops', formula: 'a/b + c/d = (a×d + c×b) ÷ (b×d)', formulaNote: 'Simplify at the end. To turn a fraction into a decimal, divide top ÷ bottom.', shortcut: { title: 'Make It out of 100', lines: ['3/4 = 75/100 = 0.75', '2/5 = 40/100 = 0.4', '3/8 = 375/1000 = 0.375'] } },
      { kind: 'trap', kicker: 'Heartbreak Trap', title: 'Never Add the Bottoms', wrong: '1/2 + 1/3 = 2/5', body: ['2/5 is SMALLER than your half alone. That cannot be right.', 'If an answer is smaller than one of the parts you added, break up with it.'] },
    ],
  },
  percent: {
    topic: 'percent',
    minutes: 4,
    cards: [
      { kind: 'love', kicker: LOVE, title: '100 Pieces of Your Heart', body: ['Imagine your heart is cut into 100 pieces. If your crush takes 25 pieces, they took **25%** of your heart.', 'Percent simply means "out of 100".'] },
      { kind: 'idea', kicker: 'The Secret', title: 'Turn % into a Decimal, Then Multiply', example: { q: 'What is 15% of 240?', steps: ['15% = 15 ÷ 100 = 0.15', '0.15 × 240 = 36'], answer: '36' } },
      { kind: 'rule', kicker: 'The Rule', title: 'Part = Percent × Whole', formula: 'Part = % × Whole', formulaNote: 'Percent change = (new − old) ÷ OLD × 100', shortcut: { title: 'The 10% Trick', lines: ['10% of 240 = 24 (move the decimal once)', '5% = half of that = 12', '15% = 24 + 12 = 36'] } },
      { kind: 'trap', kicker: 'Heartbreak Trap', title: 'Compare to Where You Started', wrong: '(100 − 80) ÷ 100 = 20%', body: ['Your love score went from 80 to 100. That is a **25%** increase (20 ÷ 80), not 20%.', 'Always divide by the ORIGINAL value, not the new one.'] },
    ],
  },
  ratio: {
    topic: 'ratio',
    minutes: 4,
    cards: [
      { kind: 'love', kicker: LOVE, title: 'Keeping the Balance', body: ['In a sweet relationship, for every **3** "I love you" texts, your partner sends **2** "ingat ka" texts. That is a ratio of 3 : 2.', 'If the texts grow, the balance stays the same.'] },
      { kind: 'idea', kicker: 'The Secret', title: 'Find One Share First', example: { q: 'Boys to girls is 3 : 2. There are 40 students. How many girls?', steps: ['Total shares: 3 + 2 = 5', 'One share: 40 ÷ 5 = 8', 'Girls: 2 × 8 = 16'], answer: '16 girls' } },
      { kind: 'rule', kicker: 'The Rule', title: 'Proportions Cross-Multiply', formula: 'a/b = c/d → a × d = b × c', formulaNote: '"If 4 cost ₱96, how much do 7 cost?" Find the price of 1 (₱24), then multiply by 7 (₱168).' },
      { kind: 'trap', kicker: 'Heartbreak Trap', title: 'Divide by ALL the Shares', wrong: '40 ÷ 2 = 20 girls', body: ['Dividing by the girls\' number alone forgets the boys.', 'Add up every share in the ratio first.'] },
    ],
  },
  series: {
    topic: 'series',
    minutes: 4,
    cards: [
      { kind: 'love', kicker: LOVE, title: 'Reading Their Texting Pattern', body: ['Your crush replies after 1 minute, then 3, then 5, then 7…', 'You notice the pattern and can guess the next one: **9 minutes**. A number series works the same way.'] },
      { kind: 'idea', kicker: 'The Secret', title: 'Look at the Gaps', body: ['Write the gap between each pair of numbers. Then ask: are the gaps the same? Growing? Is it multiplying?'], example: { q: '3, 6, 11, 18, 27, ?', steps: ['Gaps: +3, +5, +7, +9', 'The gaps grow by 2, so the next gap is +11', '27 + 11 = 38'], answer: '38' } },
      { kind: 'rule', kicker: 'The Rule', title: 'Check These 4 Patterns', shortcut: { title: 'Common Patterns', lines: ['Same gap: 5, 9, 13, 17 (+4 each)', 'Growing gap: 2, 3, 5, 8, 12', 'Multiplying: 3, 6, 12, 24 (×2 each)', 'Taking turns: 2, 20, 4, 18, 6, 16'] } },
      { kind: 'trap', kicker: 'Heartbreak Trap', title: "Don't Stop at the First Gap", wrong: '27 + 9 = 36', body: ['Repeating the last gap is the most common mistake.', 'Check whether the gaps themselves are changing.'] },
    ],
  },
  equations: {
    topic: 'equations',
    minutes: 4,
    cards: [
      { kind: 'love', kicker: LOVE, title: 'Decoding Their Message', body: ['When your partner says "okay lang ako", you translate it carefully.', 'Word problems are the same: translate each phrase into math, one piece at a time.'] },
      { kind: 'idea', kicker: 'The Secret', title: 'Translate Word by Word', body: ['"a number" → **x**', '"twice a number" → **2x**', '"increased by 7" → **+ 7**', '"is" → **='], example: { q: 'Twice a number increased by 7 is 31.', steps: ['2x + 7 = 31', '2x = 24', 'x = 12'], answer: 'The number is 12' } },
      { kind: 'rule', kicker: 'The Rule', title: 'Same Thing to Both Sides', formula: 'Undo + and − first, then × and ÷', shortcut: { title: 'Numbers in a Row', lines: ['Two consecutive numbers: x and x + 1', 'Consecutive even or odd: x, x + 2, x + 4'] } },
      { kind: 'trap', kicker: 'Heartbreak Trap', title: 'Undo in Reverse Order', wrong: '31 ÷ 2 = 15.5, then − 7', body: ['The + 7 happened last, so remove it first. Then divide by 2.', 'Like making up after a fight: fix the most recent hurt first.'] },
    ],
  },
  discount: {
    topic: 'discount',
    minutes: 4,
    cards: [
      { kind: 'love', kicker: LOVE, title: 'Two Breakups in a Row', body: ['A 20% discount is like a breakup: the price loses a part of itself.', 'A second 10% discount is another breakup, but a smaller heart breaks this time, because the price already got smaller.'] },
      { kind: 'idea', kicker: 'The Secret', title: 'Pay What Is Left', example: { q: '₱1,000 with 20% off, then another 10% off. Final price?', steps: ['After 20% off: 80% of ₱1,000 = ₱800', 'After 10% off: 90% of ₱800 = ₱720'], answer: '₱720' } },
      { kind: 'rule', kicker: 'The Rule', title: 'Price × What Remains', formula: 'Sale price = price × (100% − discount)', formulaNote: 'Profit % = profit ÷ COST × 100' },
      { kind: 'trap', kicker: 'Heartbreak Trap', title: "Don't Add the Discounts", wrong: '20% + 10% = 30% off → ₱700', body: ['Adding them treats the second breakup as if it hit the full price. It did not.', 'Do one discount at a time.'] },
    ],
  },
  interest: {
    topic: 'interest',
    minutes: 3,
    cards: [
      { kind: 'love', kicker: LOVE, title: 'A Love That Grows Steadily', body: ['Your partner promises: "Every year, my love grows by 5% of what I felt on day one."', 'The same amount is added every year. That is **simple interest**.'] },
      { kind: 'idea', kicker: 'The Secret', title: 'Principal × Rate × Time', example: { q: '₱20,000 at 6% per year for 3 years', steps: ['₱20,000 × 0.06 = ₱1,200 per year', '₱1,200 × 3 years = ₱3,600'], answer: '₱3,600 interest' } },
      { kind: 'rule', kicker: 'The Rule', title: 'I = P × r × t', formula: 'I = P × r × t', formulaNote: 't must be in YEARS: 6 months = 6 ÷ 12 = 0.5 year. Amount = principal + interest.' },
      { kind: 'trap', kicker: 'Heartbreak Trap', title: 'Months Are Not Years', wrong: '₱20,000 × 0.06 × 6 = ₱7,200 for 6 months', body: ['Six months is half a year, so the interest is **₱600**.', 'Change months to years before you multiply.'] },
    ],
  },
  age: {
    topic: 'age',
    minutes: 4,
    cards: [
      { kind: 'love', kicker: LOVE, title: 'Your Age Gap Is Forever', body: ['If your partner is 3 years older than you, they will still be 3 years older on your 50th anniversary.', 'You both age the same number of years. That is the key to every age problem.'] },
      { kind: 'idea', kicker: 'The Secret', title: 'Let the Younger Age Be x', example: { q: 'Ana is 3 times as old as Ben. In 10 years, she will be twice his age. How old is Ben?', steps: ['Ben = x, Ana = 3x', 'In 10 years: 3x + 10 = 2(x + 10)', '3x + 10 = 2x + 20 → x = 10'], answer: 'Ben is 10' } },
      { kind: 'rule', kicker: 'The Rule', title: 'Same Years for Everyone', formula: 'Add the SAME number of years to each person', shortcut: { title: 'Sum and Difference', lines: ['Older = (sum + difference) ÷ 2', 'Younger = (sum − difference) ÷ 2'] } },
      { kind: 'trap', kicker: 'Heartbreak Trap', title: 'Both of You Get Older', wrong: '3x + 10 = 2x', body: ['Forgetting to add 10 years to Ben is like celebrating your anniversary alone.', 'Whatever years pass, they pass for everyone.'] },
    ],
  },
  work: {
    topic: 'work',
    minutes: 4,
    cards: [
      { kind: 'love', kicker: LOVE, title: 'The Anniversary Dinner', body: ['You and your partner are cooking your anniversary dinner. Alone, you need **6 hours**. Your partner is faster and needs only **3 hours**.', 'If you cook together, how long will it take?'] },
      { kind: 'idea', kicker: 'The Secret', title: 'Count What Each of You Finishes in 1 Hour', bars: [
        { label: 'You', value: '1/6 per hour', cells: [1], total: 6 },
        { label: 'Your Partner', value: '1/3 = 2/6 per hour', cells: [2, 2], total: 6 },
        { label: 'Together', value: '3/6 = half per hour', cells: [1, 2, 2], total: 6, strong: true },
      ], barsNote: 'Half the dinner every hour, so the whole dinner takes **2 hours**.' },
      { kind: 'rule', kicker: 'The Rule', title: 'Add Up the Hourly Parts', formula: '1/A + 1/B = 1/T', formulaNote: "A and B = each person's time alone. T = time together.", shortcut: { title: '10-Second Shortcut (2 People)', lines: ['(A × B) ÷ (A + B)', '(6 × 3) ÷ (6 + 3) = 18 ÷ 9 = 2 hours'] } },
      { kind: 'trap', kicker: 'Heartbreak Trap', title: "Don't Average the Times", wrong: '(6 + 3) ÷ 2 = 4.5 hours', body: ['Being together should make it **faster**, not slower.', "If a choice is bigger than the faster partner's time, **break up with that choice.**"] },
    ],
  },
  motion: {
    topic: 'motion',
    minutes: 4,
    cards: [
      { kind: 'love', kicker: LOVE, title: 'Long-Distance Love', body: ['You live 300 km apart. You both ride buses toward each other: you at 60 km/h, they at 40 km/h.', 'Together you close the gap at **100 km/h**, so you meet in **3 hours**. Love is faster when both of you move.'] },
      { kind: 'idea', kicker: 'The Secret', title: 'Distance = Speed × Time', body: ['Toward each other, or away from each other: **add** the speeds.', 'Same direction (one chasing the other): **subtract** the speeds.'] },
      { kind: 'rule', kicker: 'The Rule', title: 'One Formula, Three Ways', formula: 'D = S × T', formulaNote: 'T = D ÷ S, and S = D ÷ T. Round-trip average speed = 2ab ÷ (a + b).' },
      { kind: 'trap', kicker: 'Heartbreak Trap', title: "Don't Average the Speeds", wrong: '(40 + 60) ÷ 2 = 50 km/h', body: ['Going at 40 and returning at 60 averages **48 km/h**, not 50.', 'You spend more time at the slower speed, like a long goodbye.'] },
    ],
  },
  mixture: {
    topic: 'mixture',
    minutes: 4,
    cards: [
      { kind: 'love', kicker: LOVE, title: 'Splitting the Bill on a Group Date', body: ['Five friends spend ₱2,500 on a group date. Each pays ₱500: that is the **average**.', 'If one leaves early, you redo it: new total ÷ new number of people.'] },
      { kind: 'idea', kicker: 'The Secret', title: 'Work with Totals, Not Averages', example: { q: 'The average of 5 numbers is 20. Remove 12. New average?', steps: ['Total: 5 × 20 = 100', 'New total: 100 − 12 = 88', 'New average: 88 ÷ 4 = 22'], answer: '22' } },
      { kind: 'rule', kicker: 'The Rule', title: 'Total = Average × Count', formula: 'Total = Average × Count', shortcut: { title: 'Coins and Mixtures', lines: ['Coins: pretend every coin is the smaller one, then count the extra money.', 'Mixtures: the salt or sugar stays the same when you add water.'] } },
      { kind: 'trap', kicker: 'Heartbreak Trap', title: 'Divide by the NEW Count', wrong: '88 ÷ 5 = 17.6', body: ['One person left, so there are only 4 now.', 'Using the old count is like still setting a plate for your ex.'] },
    ],
  },
  geometry: {
    topic: 'geometry',
    minutes: 4,
    cards: [
      { kind: 'love', kicker: LOVE, title: 'Your Future Home Together', body: ['The **perimeter** is the fence around your dream house: you walk all the way around it.', 'The **area** is the space inside where you both live. Know which one the question wants.'] },
      { kind: 'idea', kicker: 'The Secret', title: 'Around vs. Inside', body: ['Rectangle perimeter = 2 × (length + width)', 'Rectangle area = length × width', 'Circle area = π × r × r. Distance around a circle = 2 × π × r.'] },
      { kind: 'rule', kicker: 'The Rule', title: 'Same Units First', formula: '1 km = 1,000 m · 1 m = 100 cm', formulaNote: 'Change everything to the same unit before you compute.' },
      { kind: 'trap', kicker: 'Heartbreak Trap', title: 'Fencing Is Not Area', wrong: '20 m × 15 m = 300 m of fence', body: ['300 is the area (square meters).', 'A fence goes around: 2 × (20 + 15) = **70 m**.'] },
    ],
  },
  data: {
    topic: 'data',
    minutes: 3,
    cards: [
      { kind: 'love', kicker: LOVE, title: 'Reading the Signs', body: ["Before you decide if they like you, you read ALL the signs, not just one message.", 'Tables and charts are the same: read the title, the labels and the units first, then answer.'] },
      { kind: 'idea', kicker: 'The Secret', title: 'Pull Out Only What You Need', body: ['Read the question first, then find just the rows it needs.', 'Check the units: "in thousands" means 45 is ₱45,000.'] },
      { kind: 'rule', kicker: 'The Rule', title: 'Two Formulas You Will Use', formula: '% change = (new − old) ÷ old × 100', formulaNote: 'Average = total ÷ number of items.' },
      { kind: 'trap', kicker: 'Heartbreak Trap', title: 'Highest Is Not the Biggest Jump', body: ['The month with the highest sales is not always the month with the biggest increase.', 'An increase compares a month with the one right before it.'] },
    ],
  },
  tricks: {
    topic: 'tricks',
    minutes: 3,
    cards: [
      { kind: 'love', kicker: LOVE, title: 'Spot the Red Flags Early', body: ["You don't need a full year of dating to know someone isn't right for you. A few red flags are enough.", 'In the exam you often do not need to fully solve. You can spot the wrong choices fast.'] },
      { kind: 'idea', kicker: 'The Secret', title: 'Three Quick Checks', body: ['**Estimate**: 498 × 21 is about 500 × 20 = 10,000.', '**Last digit**: 8 × 1 ends in 8, so the answer ends in 8.', '**Plug in**: try each choice in the equation.'] },
      { kind: 'rule', kicker: 'The Rule', title: 'Estimate, Check, Eliminate', formula: 'Estimate → last digit → plug in', formulaNote: 'You have about 1 minute per item. Stuck? Eliminate, pick the best choice, flag it, and move on.' },
      { kind: 'trap', kicker: 'Heartbreak Trap', title: "Don't Fall for the First Pretty Answer", body: ['A choice that looks right at first glance is often built from a common mistake.', 'Double-check it with a quick estimate before you commit.'] },
    ],
  },
};
