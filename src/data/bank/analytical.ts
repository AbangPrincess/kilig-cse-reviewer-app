import { maker } from './make';

const q = maker('analytical', 'a', {
  syllogism: 'Based only on the statements, choose the conclusion that MUST be true.',
  ordering: 'Read the information, then answer the question.',
  calendar: 'Choose the best answer.',
  'odd-one': 'Which one does NOT belong with the others?',
  association: 'Choose the word that best goes with the group.',
  assumption: 'Read the statement, then choose the best answer.',
  'letter-series': 'What comes next in the series?',
  relations: 'Read the information, then answer the question.',
  coding: 'Study the code, then answer the question.',
});

export const ANALYTICAL = [
  // Logic and conclusions
  q('syllogism', 'All clerks are employees. Some employees are cashiers.', ['All clerks are cashiers.', 'Some clerks are cashiers.', 'No clerk is a cashier.', 'None of these must be true.'], 3, 'The cashiers could all be employees who are not clerks. Nothing about clerks and cashiers is certain.', { fixed: true }),
  q('syllogism', 'All roses are flowers. Some flowers fade quickly.', ['All roses fade quickly.', 'Some roses fade quickly.', 'No rose fades quickly.', 'It cannot be determined whether any rose fades quickly.'], 3, 'The flowers that fade quickly might not be roses at all, so we cannot tell.', { fixed: true }),
  q('syllogism', 'All supervisors are licensed. All licensed people passed the board exam.', ['All supervisors passed the board exam.', 'Everyone who passed the board exam is a supervisor.', 'Some supervisors did not pass the board exam.', 'No licensed person is a supervisor.'], 0, 'Supervisors are inside the licensed group, and the licensed group is inside the passed group. So every supervisor passed.'),
  q('syllogism', 'No reptiles are mammals. All snakes are reptiles.', ['Some snakes are mammals.', 'No snakes are mammals.', 'All mammals are snakes.', 'All reptiles are snakes.'], 1, 'Snakes are inside the reptile group, and no reptile is a mammal, so no snake is a mammal.'),
  q('syllogism', 'Some teachers are singers. All singers are artists.', ['All teachers are artists.', 'All artists are teachers.', 'Some teachers are artists.', 'No teacher is an artist.'], 2, 'The teachers who are singers must also be artists, so at least some teachers are artists.'),
  q('syllogism', 'If it rains, the road gets wet. The road is not wet.', ['It rained.', 'It did not rain.', 'The road is dry because of the sun.', 'It will rain later.'], 1, 'If rain always makes the road wet, a dry road means it did not rain.'),
  q('syllogism', 'If it rains, the road gets wet. The road is wet.', ['It rained.', 'It did not rain.', 'The road is always wet.', 'It cannot be determined whether it rained.'], 3, 'Something else, like a water truck, could have wet the road. A wet road does not prove it rained.', { fixed: true, why: { 0: 'This is a common trap. Rain makes the road wet, but a wet road does not prove it rained.' } }),
  q('syllogism', 'Every employee who passed the exam was promoted. Liza, an employee, was not promoted.', ['Liza passed the exam.', 'Liza did not pass the exam.', 'Liza will be promoted next year.', 'Liza did not take the exam.'], 1, 'Everyone who passed was promoted. Liza was not promoted, so she did not pass. (She may have taken it and failed, so we cannot say she did not take it.)'),

  // Ordering and calendars
  q('ordering', 'Ana is taller than Ben. Carl is shorter than Ben. Who is the tallest?', ['Ana', 'Ben', 'Carl', 'Cannot be determined'], 0, 'Ana > Ben > Carl, so Ana is the tallest.', { fixed: true }),
  q('ordering', 'Four people sit in a row of desks. Dina sits to the left of Eli. Fe sits to the right of Eli. Gab sits to the left of Dina. Who sits at the far right?', ['Dina', 'Eli', 'Fe', 'Gab'], 2, 'From left to right: Gab, Dina, Eli, Fe. Fe is at the far right.'),
  q('ordering', 'Pedro finished the exam before Maria. Maria finished before Jose. Ana finished last. Who finished first?', ['Maria', 'Jose', 'Pedro', 'Ana'], 2, 'Order: Pedro, Maria, Jose, Ana. Pedro finished first.'),
  q('ordering', 'Lea, Nico, Tess, Rico and Joy are in a line. Nico is first. Rico is third. Tess is directly in front of Rico. Joy is directly behind Rico. Who is last?', ['Joy', 'Lea', 'Tess', 'Nico'], 1, 'Nico 1st, Tess 2nd, Rico 3rd, Joy 4th. The only one left, Lea, is 5th.'),
  q('calendar', 'If today is Wednesday, what day will it be 100 days from today?', ['Thursday', 'Friday', 'Saturday', 'Wednesday'], 1, '100 days = 14 weeks and 2 days. Two days after Wednesday is Friday.'),
  q('calendar', 'The 3rd day of a month is a Monday. What day is the 24th of the same month?', ['Sunday', 'Monday', 'Tuesday', 'Wednesday'], 1, 'The 24th is 21 days after the 3rd. 21 days is exactly 3 weeks, so it is also a Monday.'),

  // Odd one out and word association
  q('odd-one', 'apple, mango, carrot, banana', ['apple', 'mango', 'carrot', 'banana'], 2, 'Carrot is a vegetable; the others are fruits.', { fixed: true }),
  q('odd-one', 'square, triangle, circle, cube', ['square', 'triangle', 'circle', 'cube'], 3, 'A cube is a solid (3D) shape; the others are flat shapes.', { fixed: true }),
  q('odd-one', 'mayor, governor, senator, barangay captain', ['mayor', 'governor', 'senator', 'barangay captain'], 2, 'A senator is a national official; the others are local officials.', { fixed: true }),
  q('odd-one', '2, 3, 5, 9, 11', ['3', '5', '9', '11'], 2, '9 is not a prime number (9 = 3 × 3). The others are prime.', { fixed: true }),
  q('association', 'gavel, verdict, witness', ['courtroom', 'classroom', 'market', 'clinic'], 0, 'A gavel, a verdict and a witness are all found in a courtroom.'),

  // Assumptions and conclusions
  q('assumption', 'Notice: "The office will now accept applications online to shorten the long lines." What does the office assume?', ['Online applications will reduce the number of people lining up.', 'All applicants own a computer.', 'The office will close all its counters.', 'Long lines are caused by slow employees.'], 0, 'The plan only makes sense if moving applications online reduces the lines.'),
  q('assumption', 'Sign: "In case of fire, use the stairs." What is assumed?', ['Elevators may be unsafe during a fire.', 'Stairs are always faster than elevators.', 'Fires happen often in this building.', 'The building has no elevators.'], 0, 'The sign tells people to avoid the elevator, which assumes elevators may be unsafe in a fire.'),
  q('assumption', 'Memo: "All employees must attend the training on Monday." Which conclusion follows?', ['Employees are expected to be at the training on Monday.', 'The training is optional.', 'Only new employees will attend.', 'The training will last one week.'], 0, '"Must attend" means employees are expected to be there. Nothing is said about length or who is new.'),
  q('assumption', 'Rice prices rose after a typhoon damaged many farms. Which is the most likely explanation?', ['The typhoon reduced the supply of rice.', 'Farmers raised prices to earn more.', 'People suddenly started eating more rice.', 'The government ordered higher prices.'], 0, 'Damaged farms mean less rice in the market. Less supply usually pushes prices up.'),
  q('assumption', 'Notice: "Water service will be interrupted from 9 AM to 3 PM tomorrow." What is the most reasonable action?', ['Store enough water before 9 AM tomorrow.', 'Ask the water company to cancel the interruption.', 'Stop using water for a week.', 'Ignore the notice.'], 0, 'The notice gives a time window, so the sensible step is to store water before it starts.'),
  q('assumption', 'Only registered voters may vote. Rico voted. Which must be true?', ['Rico is a candidate.', 'Rico voted for the winner.', 'Rico is a registered voter.', 'Rico is not a registered voter.'], 2, 'Since only registered voters can vote, and Rico voted, Rico must be registered.'),

  // Letter series
  q('letter-series', 'A, C, E, G, ___', ['H', 'I', 'J', 'K'], 1, 'Skip one letter each time: A (b) C (d) E (f) G (h) I.', { fixed: true }),
  q('letter-series', 'B, E, H, K, ___', ['L', 'M', 'N', 'O'], 2, 'Move forward 3 letters each time: K + 3 = N.', { fixed: true }),
  q('letter-series', 'AZ, BY, CX, ___', ['DV', 'EW', 'DW', 'CW'], 2, 'The first letter moves forward (A, B, C, D); the second moves backward (Z, Y, X, W).'),

  // Family relations
  q('relations', 'A is the brother of B. B is the sister of C. How is C related to A?', ['Brother', 'Sister', 'Cousin', 'Cannot be determined from the information'], 3, 'C is a sibling of A, but we are not told if C is male or female.', { fixed: true }),
  q('relations', "Pointing to a man, Ana says, \"He is the son of my mother's only son.\" How is the man related to Ana?", ['Brother', 'Son', 'Cousin', 'Nephew'], 3, "Ana's mother's only son is Ana's brother (Ana is a woman). The man is her brother's son: her nephew."),

  // ---- Added set 2 ----

  // Logic and conclusions
  q('syllogism', 'All accountants are good with numbers. Maria is an accountant.', ['Maria is good with numbers.', 'Everyone good with numbers is an accountant.', 'Maria is not good with numbers.', 'None of these must be true.'], 0, 'Maria belongs to the group "accountants", and every accountant is good with numbers.', { fixed: true }),
  q('syllogism', 'Some employees work part-time. All part-time workers are paid by the hour.', ['All employees are paid by the hour.', 'Some employees are paid by the hour.', 'No employee is paid by the hour.', 'All hourly workers are employees.'], 1, 'The employees who work part-time are paid by the hour, so at least some employees are.'),
  q('syllogism', 'No careless person passes the board exam. Jun passed the board exam.', ['Jun is careless.', 'Jun is not careless.', 'Jun took the exam twice.', 'It cannot be determined whether Jun is careless.'], 1, 'Every careless person fails, so anyone who passed cannot be careless.', { fixed: true }),
  q('syllogism', 'All cats are animals. Some animals are pets.', ['All cats are pets.', 'Some cats are pets.', 'No cat is a pet.', 'None of these must be true.'], 3, 'The animals that are pets might not include any cats. Nothing about cats and pets is certain from these statements.', { fixed: true, why: { 1: 'It may be true in real life, but these statements alone do not prove it.' } }),
  q('syllogism', 'If the generator fails, the lights go out. The lights did not go out.', ['The generator failed.', 'The generator did not fail.', 'The lights are broken.', 'The generator is new.'], 1, 'If failure always causes a blackout, no blackout means no failure.'),
  q('syllogism', 'If you review every day, you will pass. Mara did not review every day.', ['Mara will pass.', 'Mara will fail.', 'Mara did not take the exam.', 'It cannot be determined whether Mara will pass.'], 3, 'The statement says reviewing leads to passing, not that it is the only way to pass. Mara might still pass.', { fixed: true, why: { 1: 'This is a common trap. Not reviewing does not prove she will fail.' } }),
  q('syllogism', 'Every manager attended the meeting. Rico did not attend the meeting.', ['Rico is a manager.', 'Rico is not a manager.', 'Rico was sick.', 'The meeting was cancelled.'], 1, 'If Rico were a manager he would have attended. He did not, so he is not a manager.'),
  q('syllogism', 'Some books in the library are expensive. All expensive items are insured.', ['All books are insured.', 'Some books are insured.', 'No book is insured.', 'All insured items are books.'], 1, 'The expensive books are insured, so at least some books are insured.'),
  q('syllogism', 'No fish can fly. Some animals that can fly are birds.', ['No bird is a fish.', 'Some birds are not fish.', 'All birds can fly.', 'Some fish are birds.'], 1, 'The birds that can fly cannot be fish, so some birds are definitely not fish. The statements say nothing about birds that cannot fly.'),
  q('syllogism', 'All squares are rectangles. All rectangles have four sides.', ['All squares have four sides.', 'All four-sided shapes are squares.', 'Some rectangles are not squares.', 'No square is a rectangle.'], 0, 'Squares are inside rectangles, and all rectangles have four sides.'),
  q('syllogism', 'Only registered members can vote in the cooperative. Ana voted in the cooperative.', ['Ana is a registered member.', 'Ana is an officer.', 'Ana is not a member.', 'Every member voted.'], 0, '"Only members can vote" means anyone who voted must be a member.'),
  q('syllogism', 'Either the office is closed or the clerk is late. The office is not closed.', ['The clerk is late.', 'The clerk is absent.', 'The office will close soon.', 'Both are true.'], 0, 'One of the two must be true. If the office is not closed, the clerk must be late.'),

  // Ordering and calendars
  q('ordering', 'In a race, A finished before B. B finished before D. C finished after D. E finished last. Who finished first?', ['A', 'B', 'C', 'D'], 0, 'Order: A, B, D, C, E. A finished first.', { fixed: true }),
  q('ordering', 'Lito is older than Mia. Mia is older than Nora. Olga is older than Lito. Who is the youngest?', ['Lito', 'Mia', 'Nora', 'Olga'], 2, 'From oldest: Olga, Lito, Mia, Nora. Nora is the youngest.', { fixed: true }),
  q('ordering', 'Four books stand on a shelf. History is left of Science. Math is right of Science. English is left of History. Which book is second from the left?', ['English', 'History', 'Science', 'Math'], 1, 'From left: English, History, Science, Math. History is second.', { fixed: true }),
  q('ordering', 'In a queue, P is ahead of Q. Q is ahead of S. R is behind S. Who is last?', ['P', 'Q', 'R', 'S'], 2, 'Order from the front: P, Q, S, R. R is last.', { fixed: true }),
  q('ordering', 'In a building, the canteen is above the library and the library is above the gym. The clinic is directly above the canteen. Which of the four is on the highest floor?', ['canteen', 'library', 'gym', 'clinic'], 3, 'From top: clinic, canteen, library, gym.', { fixed: true }),
  q('ordering', 'Ben earns more than Carl but less than Dan. Ed earns more than Dan. Who earns the least?', ['Ben', 'Carl', 'Dan', 'Ed'], 1, 'From highest: Ed, Dan, Ben, Carl. Carl earns the least.', { fixed: true }),
  q('calendar', 'The seminar is two days after Monday. The workshop is the day before the seminar. On what day is the workshop?', ['Monday', 'Tuesday', 'Wednesday', 'Thursday'], 1, 'The seminar is on Wednesday, so the workshop is on Tuesday.', { fixed: true }),
  q('calendar', 'If yesterday was Saturday, what day will it be 3 days from today?', ['Tuesday', 'Wednesday', 'Thursday', 'Monday'], 1, 'Today is Sunday. Three days later is Wednesday.'),
  q('calendar', 'What day is 45 days after a Tuesday?', ['Thursday', 'Friday', 'Saturday', 'Wednesday'], 1, '45 days = 6 weeks and 3 days. Three days after Tuesday is Friday.'),
  q('calendar', 'If June 1 is a Monday, what day is June 30 of the same year?', ['Monday', 'Tuesday', 'Wednesday', 'Sunday'], 1, 'June 30 is 29 days after June 1. That is 4 weeks and 1 day, so it is a Tuesday.'),

  // Odd one out and word association
  q('odd-one', 'kilometer, meter, liter, centimeter', ['kilometer', 'meter', 'liter', 'centimeter'], 2, 'A liter measures volume; the others measure length.', { fixed: true }),
  q('odd-one', 'Mercury, Venus, Earth, Moon', ['Mercury', 'Venus', 'Earth', 'Moon'], 3, 'The Moon is a natural satellite, not a planet.', { fixed: true }),
  q('odd-one', '4, 9, 16, 20, 25', ['9', '16', '20', '25'], 2, '20 is not a perfect square. The others are 2², 3², 4² and 5².', { fixed: true }),
  q('odd-one', 'violin, guitar, flute, cello', ['violin', 'guitar', 'flute', 'cello'], 2, 'A flute is a wind instrument; the others have strings.', { fixed: true }),
  q('odd-one', 'Manila, Cebu City, Davao City, Luzon', ['Manila', 'Cebu City', 'Davao City', 'Luzon'], 3, 'Luzon is an island group, not a city.', { fixed: true }),
  q('odd-one', 'rose, tulip, narra, orchid', ['rose', 'tulip', 'narra', 'orchid'], 2, 'Narra is a tree; the others are flowers.', { fixed: true }),
  q('odd-one', '3, 7, 11, 14, 19', ['7', '11', '14', '19'], 2, '14 is even; the others are odd numbers.', { fixed: true }),
  q('association', 'stethoscope, prescription, ward', ['hospital', 'school', 'bank', 'court'], 0, 'All three are found in a hospital.'),
  q('association', 'ballot, precinct, candidate', ['election', 'wedding', 'graduation', 'auction'], 0, 'All three are part of an election.'),
  q('association', 'deposit, withdrawal, passbook', ['bank', 'post office', 'library', 'market'], 0, 'All three are associated with a bank account.'),

  // Assumptions and conclusions
  q('assumption', 'Sign: "Bring your own water bottle to reduce plastic waste." What is assumed?', ['Reusable bottles create less plastic waste than disposable ones.', 'Water is expensive.', 'Plastic bottles are banned.', 'Everyone already owns a water bottle.'], 0, 'The advice only makes sense if reusable bottles reduce plastic waste.'),
  q('assumption', 'Notice: "The library will extend its hours during exam week." What is assumed?', ['More students will use the library during exam week.', 'The library is usually empty.', 'Exams will be held in the library.', 'Librarians want overtime pay.'], 0, 'Extending hours assumes there will be more demand during that week.'),
  q('assumption', 'Ad: "Buy one, get one free — this weekend only!" Which conclusion follows?', ['The offer ends after the weekend.', 'The items are low quality.', 'The store is closing.', 'Prices will rise next week.'], 0, '"This weekend only" means the offer is limited to the weekend.'),
  q('assumption', 'Memo: "All applicants must submit a medical certificate." Which conclusion follows?', ['An application without a medical certificate is incomplete.', 'All applicants are sick.', 'The office has a clinic.', 'Only doctors may apply.'], 0, 'If the certificate is required, an application without it is incomplete.'),
  q('assumption', 'Traffic on the main road was heavier than usual because a bus stalled in the middle lane. Which is most likely true?', ['The stalled bus blocked part of the road.', 'All buses are old.', 'It was a holiday.', 'The road is always closed.'], 0, 'A stalled bus in a lane reduces the space for traffic.'),
  q('assumption', 'A company hired more staff after its sales doubled. What is the most likely reason?', ['It needed more people to handle the higher sales.', 'Its old staff all resigned.', 'The government ordered it to hire.', 'Its sales were falling.'], 0, 'More sales usually means more work, which needs more people.'),
  q('assumption', 'Sign: "Please switch off the lights when leaving the room." What is assumed?', ['Lights left on waste electricity.', 'The room is always dark.', 'People never leave the room.', 'The lights are broken.'], 0, 'The request assumes leaving lights on wastes power.'),
  q('assumption', 'Only people with a valid ID may enter the building. Liza entered the building. Which must be true?', ['Liza had a valid ID.', 'Liza works in the building.', 'Liza is a visitor.', 'Liza lost her ID.'], 0, 'Since only ID holders may enter, Liza must have had a valid ID.'),
  q('assumption', 'Dengue cases rose after the rainy season began. Which is the most reasonable conclusion?', ['Rainy weather may create more places for mosquitoes to breed.', 'Rain itself causes dengue.', 'Dengue only happens in the city.', 'Hospitals caused the rise.'], 0, 'Rain leaves standing water where mosquitoes breed, which can raise dengue cases.'),
  q('assumption', 'The deadline for reports was moved from Wednesday to Friday. On Wednesday, Joy is not yet done. What should she do?', ['Finish and submit by Friday.', 'Submit an unfinished report on Wednesday.', 'Ask for another week.', 'Stop working on it.'], 0, 'The new deadline gives her until Friday to finish.'),

  // Letter series
  q('letter-series', 'C, F, I, L, ___', ['M', 'N', 'O', 'P'], 2, 'Move forward 3 letters each time: L + 3 = O.', { fixed: true }),
  q('letter-series', 'A, B, D, G, ___', ['J', 'K', 'L', 'I'], 1, 'The gaps grow: +1, +2, +3, then +4. G + 4 = K.'),
  q('letter-series', 'Z, Y, W, T, ___', ['Q', 'P', 'O', 'R'], 1, 'Move back 1, 2, 3, then 4 letters. T − 4 = P.'),
  q('letter-series', 'AB, CD, EF, ___', ['FG', 'GH', 'HI', 'GI'], 1, 'Each pair continues the alphabet: GH comes next.'),
  q('letter-series', 'A1, C3, E5, ___', ['F6', 'G7', 'G6', 'H8'], 1, 'Letters skip one (A, C, E, G) and numbers match their positions (1, 3, 5, 7).'),
  q('letter-series', 'BD, FH, JL, ___', ['MO', 'NP', 'NO', 'OQ'], 1, 'Each letter moves forward 2: B, D, F, H, J, L, N, P.'),
  q('letter-series', 'M, N, L, O, K, ___', ['J', 'P', 'Q', 'I'], 1, 'Two patterns take turns: M, L, K (going back) and N, O, P (going forward). Next is P.'),
  q('letter-series', 'Which letter is 5th to the right of the 10th letter of the alphabet?', ['N', 'O', 'P', 'M'], 1, 'The 10th letter is J. Five letters to its right: K, L, M, N, O.'),

  // Family relations
  q('relations', "Rico's father is the only son of Mario. How is Mario related to Rico?", ['Uncle', 'Grandfather', 'Father', 'Brother'], 1, "Mario's only son is Rico's father, so Mario is Rico's grandfather."),
  q('relations', 'Ana is the daughter of Ben. Ben is the brother of Carla. How is Carla related to Ana?', ['Mother', 'Sister', 'Aunt', 'Cousin'], 2, "Carla is the sister of Ana's father, so she is Ana's aunt."),
  q('relations', "Pedro is the brother of Liza's mother. How is Pedro related to Liza?", ['Father', 'Uncle', 'Cousin', 'Grandfather'], 1, "Your mother's brother is your uncle."),
  q('relations', 'A is the sister of B. B is the mother of C. How is A related to C?', ['Mother', 'Sister', 'Aunt', 'Grandmother'], 2, "A is the sister of C's mother, so A is C's aunt."),
  q('relations', 'Paolo is the husband of Tess. Tess is the sister of Dan. How is Paolo related to Dan?', ['Brother', 'Brother-in-law', 'Cousin', 'Uncle'], 1, "Paolo is married to Dan's sister, so he is Dan's brother-in-law."),
  q('relations', "Jun is the son of Rosa. Rosa's mother is Linda. How is Linda related to Jun?", ['Aunt', 'Mother', 'Grandmother', 'Sister'], 2, "Linda is the mother of Jun's mother, so she is Jun's grandmother."),

  // Coding and decoding
  q('coding', 'If CAT is written as DBU, how is DOG written in the same code?', ['EPH', 'EPG', 'DPH', 'FQI'], 0, 'Each letter moves forward by one: D→E, O→P, G→H.'),
  q('coding', 'If LOVE is written as OLEV, how is MATH written in the same code?', ['AMHT', 'HTAM', 'MTAH', 'AMTH'], 0, 'The code swaps each pair of letters: LO→OL, VE→EV. So MA→AM and TH→HT: AMHT.'),
  q('coding', 'If A = 1, B = 2, C = 3 and so on, what is the sum of the letters in BED?', ['10', '11', '12', '9'], 1, 'B = 2, E = 5, D = 4. 2 + 5 + 4 = 11.'),
  q('coding', 'In a code, "pen" is "xo" and "red pen" is "xo ki". What is the code for "red"?', ['xo', 'ki', 'ox', 'Cannot be determined'], 1, 'Both codes share "xo" for "pen", so "red" must be "ki".', { fixed: true }),

  // ---- Added set 3: every topic has at least 10 items ----

  // Family relations
  q('relations', 'Pointing to a woman, Leo says, "Her father is my father\'s only son." How is the woman related to Leo?', ['Sister', 'Daughter', 'Niece', 'Mother'], 1, "Leo is a man, so his father's only son is Leo himself. The woman's father is Leo, so she is his daughter."),
  q('relations', "Gina's husband is the only son of Carmen. How is Carmen related to Gina?", ['Mother', 'Aunt', 'Mother-in-law', 'Sister-in-law'], 2, "Carmen is the mother of Gina's husband, so she is Gina's mother-in-law."),

  // Days and calendars
  q('calendar', 'If today is Friday, what day was it 10 days ago?', ['Monday', 'Tuesday', 'Wednesday', 'Thursday'], 1, '10 days = 1 week and 3 days. Three days before Friday is Tuesday.'),
  q('calendar', 'Which of these years is a leap year?', ['1900', '2023', '2024', '2026'], 2, '2024 is divisible by 4. 1900 is a century year not divisible by 400, so it was not a leap year.', { fixed: true }),
  q('calendar', 'If March 1 is a Sunday, what day is March 31 of the same year?', ['Monday', 'Tuesday', 'Wednesday', 'Sunday'], 1, 'March 31 is 30 days after March 1. That is 4 weeks and 2 days, so it is a Tuesday.'),
  q('calendar', 'How many days are there in April, May and June combined?', ['90', '91', '92', '93'], 1, 'April has 30 days, May has 31 and June has 30: 30 + 31 + 30 = 91.', { fixed: true }),

  // Coding and decoding
  q('coding', 'If GOOD is written as HPPE, how is BAD written in the same code?', ['CBE', 'CBD', 'ABC', 'DCF'], 0, 'Each letter moves forward by one: B→C, A→B, D→E.'),
  q('coding', 'If WORK is written as KROW, how is DESK written in the same code?', ['KSED', 'SKED', 'EDKS', 'KDES'], 0, 'The code writes the word backward. DESK backward is KSED.'),
  q('coding', 'If each letter is replaced by its position in the alphabet (A = 1, B = 2 and so on), how is ACE written?', ['1-3-5', '1-3-4', '2-3-5', '1-2-3'], 0, 'A = 1, C = 3 and E = 5.'),
  q('coding', 'If FISH is written as EHRG, how is BIRD written in the same code?', ['AHQC', 'CJSE', 'AHRC', 'BHQC'], 0, 'Each letter moves back by one: B→A, I→H, R→Q, D→C.'),
  q('coding', 'In a code, "big house" is "tam lo" and "big car" is "tam ri". What is the code for "house"?', ['tam', 'lo', 'ri', 'Cannot be determined'], 1, '"Big" is in both phrases, and so is "tam". So "big" = tam, which leaves "house" = lo.', { fixed: true }),
  q('coding', 'If 2 = B and 5 = E, what word is written as 3-1-2?', ['CAB', 'BAC', 'CBA', 'DAB'], 0, 'Each number is a letter position: 3 = C, 1 = A, 2 = B.'),

  // Word association
  q('association', 'anchor, sail, deck', ['ship', 'airplane', 'train', 'bus'], 0, 'An anchor, a sail and a deck are all parts of a ship.'),
  q('association', 'seed, harvest, irrigation', ['farm', 'factory', 'office', 'school'], 0, 'Seeds, harvests and irrigation are all part of farming.'),
  q('association', 'runway, boarding pass, pilot', ['airport', 'pier', 'bus terminal', 'mall'], 0, 'All three are found at an airport. A pier may have boarding passes, but it has no runway.'),
  q('association', 'lechon, banderitas, procession', ['fiesta', 'funeral', 'graduation', 'job interview'], 0, 'Lechon, colorful banderitas and a religious procession are all part of a town fiesta.'),
  q('association', 'rice cooker, ladle, stove', ['kitchen', 'bedroom', 'garage', 'garden'], 0, 'All three are used in a kitchen.'),
  q('association', 'diploma, toga, march', ['graduation', 'wedding', 'election', 'fiesta'], 0, 'At graduation, students wear a toga, march and receive a diploma.'),
];
