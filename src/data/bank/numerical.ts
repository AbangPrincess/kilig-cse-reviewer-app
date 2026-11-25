import type { Chart, DataTable } from '../../lib/types';
import { maker } from './make';

/*
 * Exam-style Numerical items: chart sets and the kinds of problems that keep showing up
 * in recent CSE Professional reviewers. Generators still supply fresh numbers around these.
 */

const DATA = 'Study the chart, then answer the question.';
const q = maker('numerical', 'n', {
  data: DATA,
  series: 'What comes next?',
});

/* ---------- Chart sets ---------- */

const TOURISTS: Chart = {
  kind: 'bar',
  title: 'Tourist Arrivals in a Province, 2019–2024',
  unit: 'In thousands',
  labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
  series: [{ name: 'Arrivals', values: [48.5, 12.2, 15.6, 30.4, 52.8, 61.6] }],
  max: 70,
  step: 10,
};

const BILL: Chart = {
  kind: 'line',
  title: 'Monthly Electric Bill of the Santos Household',
  unit: 'In pesos',
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  series: [{ name: 'Bill', values: [1800, 1700, 2150, 2450, 2700, 2400] }],
  min: 1500,
  max: 2900,
  step: 200,
};

const STAFF: Chart = {
  kind: 'bar',
  title: 'Employees of an Agency by Office',
  unit: 'Number of employees',
  labels: ['Admin', 'Finance', 'HR', 'IT', 'Legal'],
  series: [
    { name: 'Men', values: [18, 24, 8, 30, 10] },
    { name: 'Women', values: [32, 26, 22, 12, 18] },
  ],
  max: 35,
  step: 5,
};

const SCHOOLING: Chart = {
  kind: 'pie',
  title: "Highest Educational Attainment of the Agency's 200 Employees",
  labels: ["Bachelor's degree", "Master's degree", 'Doctorate', 'Vocational', 'High school'],
  series: [{ name: 'Share', values: [55, 20, 5, 12, 8] }],
  suffix: '%',
};

const BUDGET: Chart = {
  kind: 'pie',
  title: 'How the Reyes Family Spends Its ₱40,000 Monthly Income',
  labels: ['Food', 'Rent', 'Education', 'Savings', 'Transport', 'Utilities'],
  series: [{ name: 'Share', values: [35, 20, 15, 12, 10, 8] }],
  suffix: '%',
};

const CLIENTS: DataTable = {
  caption: 'Walk-in Clients Served at a Municipal Office',
  headers: ['Day', 'Clients Served'],
  rows: [
    ['Monday', '?'],
    ['Tuesday', 22],
    ['Wednesday', 31],
    ['Thursday', 18],
    ['Friday', 27],
    ['Mean (average)', 24],
  ],
};

const T = { chart: TOURISTS, group: 'n-tourists' };
const B = { chart: BILL, group: 'n-bill' };
const S = { chart: STAFF, group: 'n-agency' };
const P = { chart: SCHOOLING, group: 'n-agency' };
const F = { chart: BUDGET, group: 'n-budget' };
const C = { table: CLIENTS, group: 'n-clients', directions: 'Study the table, then answer the question.' };

export const NUMERICAL = [
  // Tourist arrivals (bar chart)
  q('data', 'What was the ratio of arrivals in 2024 to arrivals in 2021?', ['3.95', '3.59', '4.12', '3.75'], 0, '61.6 ÷ 15.6 ≈ 3.95.', {
    ...T,
    steps: ['2024: 61.6 thousand. 2021: 15.6 thousand.', '61.6 ÷ 15.6 = 3.948…, which rounds to 3.95.'],
  }),
  q('data', 'By how much did arrivals increase from 2023 to 2024?', ['8.8 thousand', '9.2 thousand', '8.2 thousand', '13.1 thousand'], 0, '61.6 − 52.8 = 8.8 thousand.', {
    ...T,
    why: { 3: '13.1 thousand is the change from 2019 to 2024, not from 2023 to 2024.' },
  }),
  q('data', 'Foreign tourists made up the same share of arrivals in 2021 and in 2024. If there were 3.9 thousand foreign tourists in 2021, how many were there in 2024?', ['15.4 thousand', '14.8 thousand', '16.2 thousand', '12.3 thousand'], 0, 'The share in 2021 was 3.9 ÷ 15.6 = 25%. The same 25% of 61.6 thousand is 15.4 thousand.', {
    ...T,
    steps: ['Share in 2021: 3.9 ÷ 15.6 = 0.25 = 25%.', 'Same share in 2024: 0.25 × 61.6 = 15.4 thousand.'],
  }),
  q('data', 'In which year did arrivals grow by the largest percentage over the year before?', ['2022', '2023', '2024', '2021'], 0, '2022 grew 94.9% (15.6 → 30.4). 2023 grew only 73.7%, even though it added more tourists.', {
    ...T,
    steps: ['2021: 15.6 ÷ 12.2 → +27.9%.', '2022: 30.4 ÷ 15.6 → +94.9%.', '2023: 52.8 ÷ 30.4 → +73.7%.', '2024: 61.6 ÷ 52.8 → +16.7%.'],
    why: { 1: '2023 had the biggest jump in number (+22.4 thousand), but percentage growth compares the jump to the year before. 2022 nearly doubled.' },
  }),
  q('data', 'What were the total arrivals from 2019 to 2024?', ['221.1 thousand', '212.1 thousand', '220.9 thousand', '172.6 thousand'], 0, '48.5 + 12.2 + 15.6 + 30.4 + 52.8 + 61.6 = 221.1 thousand.', {
    ...T,
    why: { 3: '172.6 thousand leaves out 2019. The question asks for 2019 to 2024.' },
  }),

  // Electric bill (line chart)
  q('data', 'What was the average monthly bill from January to June?', ['₱2,200', '₱2,150', '₱2,250', '₱2,300'], 0, 'The six bills add up to ₱13,200, and 13,200 ÷ 6 = ₱2,200.', {
    ...B,
    steps: ['1,800 + 1,700 + 2,150 + 2,450 + 2,700 + 2,400 = 13,200.', '13,200 ÷ 6 = 2,200.'],
  }),
  q('data', 'In which months was the bill lower than in the month before?', ['February and June', 'February only', 'June only', 'March and June'], 0, 'February (1,800 → 1,700) and June (2,700 → 2,400) both went down.', B),
  q('data', 'The May bill is what percent of the January bill?', ['150%', '66.7%', '135%', '160%'], 0, '2,700 ÷ 1,800 = 1.5 = 150%.', {
    ...B,
    why: { 1: '66.7% is January as a percent of May. The question starts with May.' },
  }),
  q('data', 'Between which two months did the bill rise the most?', ['February to March', 'March to April', 'April to May', 'May to June'], 0, 'February to March rose ₱450, more than any other month (₱300, then ₱250).', B),

  // Agency staff (grouped bar chart and pie chart)
  q('data', 'How many more women than men work in the agency?', ['20', '10', '30', '22'], 0, 'Women: 32 + 26 + 22 + 12 + 18 = 110. Men: 18 + 24 + 8 + 30 + 10 = 90. The difference is 20.', S),
  q('data', 'In which office do men make up the largest share of the staff?', ['IT', 'Finance', 'Admin', 'Legal'], 0, 'IT: 30 of 42 are men, about 71%. Finance is only 48%, Admin 36% and Legal about 36%.', {
    ...S,
    why: { 1: 'Finance has many men (24), but they are less than half of its 50 staff. IT is 30 out of 42.' },
  }),
  q('data', 'What percent of the HR staff are women?', ['73.3%', '26.7%', '68.8%', '36.7%'], 0, 'HR has 8 + 22 = 30 staff. 22 ÷ 30 = 73.3%.', S),
  q('data', 'How many of the 200 employees hold a master’s degree or a doctorate?', ['50', '40', '25', '10'], 0, "Master's 20% + doctorate 5% = 25%, and 25% of 200 = 50.", P),
  q('data', 'All the doctorate holders work in the Admin office, which has 50 employees. What percent of the Admin staff hold a doctorate?', ['20%', '5%', '10%', '25%'], 0, 'Doctorate holders: 5% of 200 = 10. In Admin: 10 ÷ 50 = 20%.', {
    ...P,
    why: { 1: '5% is their share of the whole agency. The question asks about Admin only.' },
  }),

  // Family budget (pie chart)
  q('data', 'How much does the family spend on education each month?', ['₱6,000', '₱4,000', '₱5,000', '₱15,000'], 0, '15% of ₱40,000 = ₱6,000.', F),
  q('data', 'How much more does the family spend on food than on transport each month?', ['₱10,000', '₱6,000', '₱14,000', '₱25,000'], 0, 'Food 35% minus transport 10% = 25%, and 25% of ₱40,000 = ₱10,000.', F),
  q('data', 'If the income rises to ₱45,000 and the shares stay the same, how much will the family save each month?', ['₱5,400', '₱4,800', '₱5,000', '₱6,000'], 0, 'Savings are 12%: 0.12 × 45,000 = ₱5,400.', {
    ...F,
    why: { 1: '₱4,800 is 12% of the old income, ₱40,000.' },
  }),
  q('data', 'In the pie chart, how many degrees does the Transport slice cover?', ['36°', '10°', '40°', '72°'], 0, 'A full circle is 360°. 10% of 360° = 36°.', F),
  q('data', 'Rent and utilities together take what fraction of the income?', ['7/25', '1/4', '2/7', '3/10'], 0, '20% + 8% = 28% = 28/100 = 7/25.', F),

  // Clients served (table)
  q('data', 'How many clients were served on Monday?', ['22', '24', '26', '20'], 0, 'A mean of 24 over 5 days means 120 clients in all. Tuesday to Friday add up to 98, so Monday had 120 − 98 = 22.', {
    ...C,
    steps: ['Total = mean × number of days = 24 × 5 = 120.', 'Known days: 22 + 31 + 18 + 27 = 98.', 'Monday = 120 − 98 = 22.'],
  }),
  q('data', 'On how many days was the number of clients served higher than the mean?', ['1', '2', '3', '4'], 1, 'Only Wednesday (31) and Friday (27) are above 24. Monday and Tuesday had 22 and Thursday 18.', { ...C, fixed: true }),

  // Series and patterns
  q('series', '(2 × 3 ÷ 2), (4 ÷ 2 × 3), (6 × 3 ÷ 2), ___', ['12', '15', '16', '24'], 0, 'Work out each group: 3, 6, 9. They go up by 3, so the next term is 12.', {
    steps: ['2 × 3 ÷ 2 = 3; 4 ÷ 2 × 3 = 6; 6 × 3 ÷ 2 = 9.', 'The pattern is +3, so 9 + 3 = 12.'],
  }),
  q('series', '(18 − 9 + 3), 10, (2 × 12 ÷ 3), ___', ['6', '4', '8', '2'], 0, 'The terms are 12, 10, 8. They go down by 2, so the next is 6.'),
  q('series', '25%, 0.5, 3/4, 1, ___', ['1¼', '1½', '1⅓', '2'], 0, 'Change everything to decimals: 0.25, 0.5, 0.75, 1. Each step adds 0.25, so next is 1.25 = 1¼.'),
  q('series', '1/8, 1/4, 3/8, 1/2, ___', ['5/8', '3/4', '5/16', '1'], 0, 'In eighths: 1/8, 2/8, 3/8, 4/8. The next is 5/8.'),
  q('series', '300%, 60%, 120%, 24%, 48%, ___', ['9.6%', '12%', '96%', '4.8%'], 0, 'The steps alternate: ÷5, ×2, ÷5, ×2. Next is 48% ÷ 5 = 9.6%.'),
  q('series', '0.15, 30%, 9/20, 0.6, ___', ['75%', '0.65', '4/5', '0.9'], 0, 'As decimals: 0.15, 0.30, 0.45, 0.60. Each adds 0.15, so next is 0.75 = 75%.'),
  q('series', '4, 5, 8, 14, ___, 39', ['24', '22', '26', '20'], 0, 'The differences grow: +1, +3, +6, +10, +15. So 14 + 10 = 24, and 24 + 15 = 39 checks out.'),
  q('series', '3, 14, 47, 102, ___', ['179', '168', '157', '190'], 0, 'The differences are 11, 33, 55: they go up by 22. The next difference is 77, so 102 + 77 = 179.'),
  q('series', '124, 235, 346, ___, 568, 679', ['457', '447', '458', '467'], 0, 'Each digit goes up by 1: 1-2-4, 2-3-5, 3-4-6, so the next is 4-5-7 = 457.'),
  q('series', '452, 536, 368, 704, ___', ['32', '48', '368', '1,376'], 0, 'The steps are +84, −168, +336: each doubles and flips sign. Next is −672, so 704 − 672 = 32.'),
  q('series', '2, 8, 18, 32, 50, 72, ___', ['98', '96', '94', '100'], 0, 'Each term is 2 × n²: 2×1, 2×4, 2×9 … 2×36 = 72. Next is 2 × 49 = 98.'),
  q('series', '0.3, 0.35, 0.45, 0.6, ___', ['0.8', '0.75', '0.7', '0.85'], 0, 'The steps grow by 0.05: +0.05, +0.10, +0.15. Next is +0.20, so 0.6 + 0.2 = 0.8.'),
  q('series', '1/10, 1/5, 3/10, 2/5, ___', ['1/2', '3/5', '7/10', '1/3'], 0, 'In tenths: 1/10, 2/10, 3/10, 4/10. Next is 5/10 = 1/2.'),
  q('series', '5, 11, 6, 13, 7, 15, 8, ___', ['17', '9', '16', '19'], 0, 'Two series take turns: 5, 6, 7, 8 and 11, 13, 15. The next term continues the second one: 17.'),
  q('series', '2, 4, 12, 24, 72, ___', ['144', '216', '96', '288'], 0, 'The steps alternate ×2 and ×3: 2→4 (×2), 4→12 (×3), 12→24 (×2), 24→72 (×3). Next is ×2: 144.'),
  q('series', '3, 9, 4, 16, 5, 25, 6, ___', ['36', '7', '30', '49'], 0, 'Each number is followed by its square: 3 and 9, 4 and 16, 5 and 25. So 6 is followed by 36.'),
  q('series', '6, 13, 27, 55, ___', ['111', '110', '83', '109'], 0, 'Each term is double the one before, plus 1: 55 × 2 + 1 = 111.'),
  q('series', '1, 3, 7, 15, 31, ___', ['63', '62', '47', '64'], 0, 'Double and add 1 each time (the differences 2, 4, 8, 16 also double). 31 × 2 + 1 = 63.'),
  q('series', '57 : 35 :: 86 : ___', ['48', '14', '68', '42'], 0, '35 is the product of the digits of 57 (5 × 7). For 86: 8 × 6 = 48.'),
  q('series', '84 : 21 :: 64 : ___', ['16', '21', '32', '12'], 0, '84 ÷ 4 = 21, so 64 ÷ 4 = 16.'),
  q('series', '3 : 36 :: 5 : ___', ['150', '125', '175', '225'], 0, '36 = 3³ + 3² = 27 + 9. So 5³ + 5² = 125 + 25 = 150.'),
  q('series', '11 : 132 :: 7 : ___', ['56', '77', '49', '63'], 0, '132 = 11 × 12, a number times the next number. So 7 × 8 = 56.'),
  q('series', 'What is the sum of all the even numbers from 50 to 100, including both?', ['1,950', '1,900', '2,000', '3,825'], 0, 'There are 26 even numbers from 50 to 100. Their average is (50 + 100) ÷ 2 = 75, so the sum is 26 × 75 = 1,950.', {
    steps: ['Count: (100 − 50) ÷ 2 + 1 = 26 numbers.', 'Average of first and last: (50 + 100) ÷ 2 = 75.', 'Sum = 26 × 75 = 1,950.'],
    why: { 3: '3,825 adds every whole number from 50 to 100, odd ones included.' },
  }),

  // Percent
  q('percent', 'Simplify: 33⅓% of 60 + 12½% of 64 − 66⅔% of 27', ['10', '12', '14', '8'], 0, '33⅓% = 1/3, 12½% = 1/8 and 66⅔% = 2/3. So 20 + 8 − 18 = 10.', {
    steps: ['1/3 of 60 = 20.', '1/8 of 64 = 8.', '2/3 of 27 = 18.', '20 + 8 − 18 = 10.'],
    shortcut: 'Know the fraction twins: 33⅓% = 1/3, 12½% = 1/8, 66⅔% = 2/3.',
  }),
  q('percent', '18 is 120% of what number?', ['15', '21.6', '14.4', '16'], 0, '18 ÷ 1.2 = 15.', {
    why: { 1: '21.6 is 120% OF 18. Here 18 is the part, so divide by 1.2.' },
  }),
  q('percent', 'What percent of 25 is 60?', ['240%', '41.7%', '24%', '2.4%'], 0, '60 ÷ 25 = 2.4 = 240%. The answer is above 100% because 60 is bigger than 25.', {
    why: { 1: '41.7% is 25 as a percent of 60, which is the reverse.' },
  }),
  q('percent', 'One-half percent of a number is 40. What is the number?', ['8,000', '800', '80', '80,000'], 0, 'One-half percent = 0.5% = 0.005. So 40 ÷ 0.005 = 8,000.', {
    why: { 2: '80 treats "one-half percent" as one-half (50%). It is half of ONE percent.' },
  }),
  q('percent', '80 increased by what percent of itself gives 200?', ['150%', '120%', '250%', '60%'], 0, 'The increase is 120, and 120 ÷ 80 = 1.5 = 150%.', {
    why: { 2: '250% is 200 as a percent of 80. The question asks only for the increase.' },
  }),
  q('percent', 'If 360, or 30% of a graduating class, are boys, how many students are graduating?', ['1,200', '1,080', '468', '840'], 0, '360 ÷ 0.30 = 1,200.', {
    why: { 3: '840 is the number of girls (70%). The question asks for the whole class.' },
  }),
  q('percent', 'Of 12,500 applicants for an exam, 2,000 did not show up. What percent of the applicants took the exam?', ['84%', '16%', '80%', '86%'], 0, '12,500 − 2,000 = 10,500 took it. 10,500 ÷ 12,500 = 84%.', {
    why: { 1: '16% is the share who did NOT show up.' },
  }),
  q('percent', 'What is the percent decrease from 120 to 90?', ['25%', '33⅓%', '30%', '75%'], 0, 'The drop is 30. Compare it to the starting value: 30 ÷ 120 = 25%.', {
    why: { 1: '33⅓% divides by 90, the new value. Always divide by where you started.' },
  }),
  q('percent', 'What is the percent increase from 90 to 120?', ['33⅓%', '25%', '30%', '133⅓%'], 0, 'The rise is 30. Compare it to the starting value: 30 ÷ 90 = 33⅓%.', {
    why: { 1: '25% divides by 120, the new value. Always divide by where you started.' },
  }),
  q('percent', 'A vendor sold 65% of her mangoes and still has 42 left. How many mangoes did she have at first?', ['120', '107', '140', '64'], 0, 'The 42 left are 35% of the total. 42 ÷ 0.35 = 120.', {
    steps: ['Left over: 100% − 65% = 35%.', '35% of the total = 42.', 'Total = 42 ÷ 0.35 = 120.'],
  }),
  q('percent', '37½% of 240 is what number?', ['90', '80', '96', '60'], 0, '37½% = 3/8, and 3/8 of 240 = 90.', { shortcut: '37½% = 3/8.' }),

  // Fractions, ratio and order of operations
  q('fractions', 'What do you get when 1⅓ is subtracted from its reciprocal?', ['−7/12', '7/12', '−1/3', '1/12'], 0, '1⅓ = 4/3, and its reciprocal is 3/4. 3/4 − 4/3 = 9/12 − 16/12 = −7/12.', {
    why: { 1: '7/12 subtracts the other way. The question takes 1⅓ away FROM the reciprocal.' },
  }),
  q('fractions', '2/5 ÷ 4/5 is:', ['Less than 1', 'More than 1', 'Equal to 1', 'Undefined'], 0, '2/5 × 5/4 = 1/2, which is less than 1. Dividing a smaller positive number by a bigger one always gives less than 1.'),
  q('fractions', 'A recipe needs 3/4 cup of sugar, but Ana only has a 1/8-cup scoop. How many scoops does she need?', ['6 scoops', '3/32 scoop', '8 scoops', '4 scoops'], 0, '3/4 ÷ 1/8 = 3/4 × 8 = 6 scoops.', {
    why: { 1: '3/32 multiplies the fractions. To find how many scoops fit, divide.' },
  }),
  q('ratio', 'What is the ratio of 2/3 to 4/9?', ['3 : 2', '2 : 3', '8 : 27', '4 : 3'], 0, '(2/3) ÷ (4/9) = 2/3 × 9/4 = 18/12 = 3/2, so the ratio is 3 : 2.'),
  q('ratio', 'Delegates from Luzon, Visayas and Mindanao are in the ratio 5 : 3 : 4. If 90 delegates are from the Visayas, how many delegates are there in all?', ['360', '150', '270', '300'], 0, '3 parts = 90, so 1 part = 30. All 12 parts = 360.', {
    steps: ['Visayas = 3 parts = 90, so 1 part = 30.', 'Total parts: 5 + 3 + 4 = 12.', '12 × 30 = 360.'],
  }),
  q('order', '√98 − √32 = ?', ['3√2', '√66', '11√2', '2√3'], 0, '√98 = 7√2 and √32 = 4√2, so 7√2 − 4√2 = 3√2.', {
    why: { 1: 'Square roots cannot be subtracted inside the root: √98 − √32 is not √66.' },
  }),
  q('order', '50⁰ − (−3)² + (−2²) − (−1)² = ?', ['−13', '−5', '5', '−11'], 0, '50⁰ = 1, (−3)² = 9, −2² = −4 and (−1)² = 1. So 1 − 9 − 4 − 1 = −13.', {
    steps: ['Any nonzero number to the power 0 is 1.', '(−3)² = 9, but −2² = −(2²) = −4.', '1 − 9 + (−4) − 1 = −13.'],
    why: { 1: '−5 treats −2² as +4. Without parentheses around −2, only the 2 is squared.' },
  }),
  q('order', '25⁰ + (−3²) − 2³ = ?', ['−16', '2', '−17', '10'], 0, '25⁰ = 1, −3² = −9 and 2³ = 8. So 1 − 9 − 8 = −16.', {
    why: { 1: '2 treats −3² as +9. Only the 3 is squared, so −3² = −9.', 2: '−17 treats 25⁰ as 0. Any nonzero number to the power 0 is 1.' },
  }),
  q('order', '18 ÷ 3 × 2 − (20 ÷ 4 × 2) + 3 = ?', ['5', '0', '15', '−5'], 0, 'Parentheses first: 20 ÷ 4 × 2 = 10. Then left to right: 18 ÷ 3 × 2 = 12. So 12 − 10 + 3 = 5.'),
  q('order', '√0.0016 = ?', ['0.04', '0.4', '0.004', '0.0004'], 0, '0.04 × 0.04 = 0.0016, so √0.0016 = 0.04.', { shortcut: 'The root has half as many decimal places: 4 places → 2 places.' }),

  // Word problems
  q('motion', 'A bus travels for 3⅓ hours at an average speed of 72⅗ km per hour. How far does it go?', ['242 km', '240 km', '217⅘ km', '245⅔ km'], 0, 'Distance = speed × time = 72⅗ × 3⅓ = 363/5 × 10/3 = 242 km.', {
    steps: ['72⅗ = 363/5 and 3⅓ = 10/3.', '363/5 × 10/3 = 3,630/15 = 242.'],
  }),
  q('motion', 'Lea jogs at 3 meters per second for 4 minutes, then sprints at 5 meters per second for 2 minutes to reach the gate. How far did she go?', ['1,320 m', '1,200 m', '22 m', '1,560 m'], 0, 'Change minutes to seconds: 3 × 240 = 720 m, plus 5 × 120 = 600 m, for 1,320 m.', {
    why: { 2: '22 m forgets to change minutes to seconds: 3 × 4 + 5 × 2 = 22.' },
  }),
  q('mixture', 'A sari-sari store earned ₱7,250, ₱6,840, ₱7,410, ₱6,980 and ₱7,120 in five weeks. How much must it earn in the sixth week to average ₱7,000 a week?', ['₱6,400', '₱6,600', '₱7,000', '₱5,600'], 0, 'Six weeks at ₱7,000 is ₱42,000. The five weeks add up to ₱35,600, so the sixth week needs ₱6,400.', {
    steps: ['Needed total: 6 × 7,000 = 42,000.', 'Earned so far: 7,250 + 6,840 + 7,410 + 6,980 + 7,120 = 35,600.', '42,000 − 35,600 = 6,400.'],
  }),
  q('mixture', 'The mean, median and mode of 7 numbers are all equal. Six of the numbers are 14, 8, 12, 17, 10 and 11. What is the seventh number?', ['12', '11', '14', '10'], 0, 'If the missing number is x, then (72 + x) ÷ 7 = x, so x = 12. Check: 8, 10, 11, 12, 12, 14, 17 has median 12 and mode 12.', {
    steps: ['The six numbers add up to 72.', 'Mean = x means 72 + x = 7x, so 6x = 72 and x = 12.', 'In order: 8, 10, 11, 12, 12, 14, 17. Median 12, mode 12.'],
  }),
  q('mixture', 'The mean, median and mode of 5 numbers are all equal. Four of the numbers are 23, 16, 20 and 21. What is the fifth number?', ['20', '21', '16', '23'], 0, '(80 + x) ÷ 5 = x gives x = 20. Check: 16, 20, 20, 21, 23 has median 20 and mode 20.'),
  q('mixture', 'A pharmacist has 300 mL of a 10% alcohol solution. How much pure alcohol must be added to make it a 25% solution?', ['60 mL', '45 mL', '75 mL', '50 mL'], 0, 'The mix has 30 mL of alcohol. (30 + x) ÷ (300 + x) = 0.25 gives x = 60 mL.', {
    steps: ['Alcohol now: 10% of 300 = 30 mL.', '30 + x = 0.25(300 + x) = 75 + 0.25x.', '0.75x = 45, so x = 60.'],
    why: { 1: '45 mL forgets that adding alcohol also makes the whole mixture bigger.' },
  }),
  q('mixture', 'A 45-liter mix of juice and water is in the ratio 2 : 1. How much water must be added to make the ratio 1 : 2?', ['45 L', '30 L', '15 L', '60 L'], 0, 'There are 30 L of juice and 15 L of water. For 1 : 2, water must be 60 L, so add 45 L.', {
    why: { 3: '60 L is how much water there should be in the end. 15 L is already in the mix.' },
  }),
  q('equations', 'If three times a number is decreased by 7, the result is 29. What is the number?', ['12', '7⅓', '36', '10'], 0, '3x − 7 = 29, so 3x = 36 and x = 12.'),
  q('age', "Mia's father was 32 when she was born. Her mother was 29 when Mia's sister, who is 3 years younger than Mia, was born. How far apart in age are the parents?", ['6 years', '3 years', '9 years', '1 year'], 0, 'When Mia was born, her mother was 29 − 3 = 26. The father was 32, so they are 6 years apart.', {
    why: { 1: '3 years compares the ages at two different births. Bring both parents to the same moment first.' },
  }),
  q('tricks', 'If 1 × 7 = 6, 2 × 7 = 12 and 3 × 7 = 18, then 9 × 7 = ?', ['54', '63', '56', '49'], 0, 'In this pattern, "× 7" really works like × 6: 1 → 6, 2 → 12, 3 → 18. So 9 → 54.'),
  q('discount', 'A price is first increased by 30% and then decreased by 20%. What is the net change?', ['4% increase', '10% increase', '4% decrease', 'No change'], 0, '1.30 × 0.80 = 1.04, a 4% increase.', {
    why: { 1: '10% just subtracts 20 from 30. The 20% is taken from a bigger, already-raised price.' },
  }),
];
