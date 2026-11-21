import type { Lesson } from '../numerical/lessons';

const LOVE = 'Think of It like Love';

export const GENINFO_LESSONS: Record<string, Lesson> = {
  constitution: {
    topic: 'constitution',
    minutes: 4,
    cards: [
      { kind: 'love', kicker: LOVE, title: 'The Vows of a Nation', body: ["Couples make vows that guide their whole marriage. The 1987 Constitution is the nation's set of vows.", 'Filipinos ratified it on **February 2, 1987**, and every law must follow it.'] },
      { kind: 'idea', kicker: 'The Secret', title: 'Know the Three Branches', body: ['**Legislative** (Congress) makes laws. **Executive** (the President) carries them out. **Judicial** (the courts) settles disputes.', 'Each branch checks the others, like partners who keep each other honest.'], example: { q: 'Who starts an impeachment case?', steps: ['The House of Representatives initiates it.', 'The Senate tries and decides it.', 'Conviction needs two-thirds of all the senators.'], answer: 'The House of Representatives' } },
      { kind: 'rule', kicker: 'The Rule', title: 'Numbers to Remember', formula: 'President: 6 years, no re-election', formulaNote: 'Senators: 24, with 6-year terms, at most 2 in a row. House members: 3-year terms, at most 3 in a row. Supreme Court: 15 justices, who serve until age 70.', shortcut: { title: 'Minimum Ages', lines: ['President and Vice-President: 40', 'Senator: 35', 'House member: 25', 'Voter: 18'] } },
      { kind: 'trap', kicker: 'Heartbreak Trap', title: 'The Senate Does Not Start Impeachment', wrong: 'The Senate initiates impeachment.', body: ['The **House** initiates. The **Senate** tries and decides.', 'Think of it like a breakup: one side files the complaint, the other side makes the final call.'] },
    ],
  },
  'civil-service': {
    topic: 'civil-service',
    minutes: 3,
    cards: [
      { kind: 'love', kicker: LOVE, title: 'Chosen for Who You Are', body: ['A good partner picks you for your character, not for who your parents know.', 'The civil service works the same way: jobs go by **merit and fitness**, tested as far as practicable by a competitive exam.'] },
      { kind: 'idea', kicker: 'The Secret', title: 'What the Constitution Promises Workers', body: ['No civil servant may be removed or suspended **except for cause provided by law**.', 'Government workers have the right to **self-organization**, but they may **not** do electioneering or partisan political campaigns.'] },
      { kind: 'rule', kicker: 'The Rule', title: 'The Central Personnel Agency', formula: 'CSC = Chairman + 2 Commissioners', formulaNote: 'The Civil Service Commission (Article IX-B) is the central personnel agency of the Government. Its members serve 7 years, without reappointment.', shortcut: { title: 'Laws by Number', lines: ['RA 6713: Code of Conduct and Ethical Standards', 'RA 3019: Anti-Graft and Corrupt Practices Act', 'RA 9485: Anti-Red Tape Act (2007)', 'RA 11032: Ease of Doing Business Act (2018)'] } },
      { kind: 'trap', kicker: 'Heartbreak Trap', title: 'Voting Is Not Campaigning', wrong: 'Government employees cannot vote.', body: ['Civil servants **can** vote like any citizen. What they cannot do is campaign or electioneer.', 'Read the choice carefully: the ban is on partisan political activity, not on voting.'] },
    ],
  },
  ra6713: {
    topic: 'ra6713',
    minutes: 4,
    cards: [
      { kind: 'love', kicker: LOVE, title: 'Eight Promises of a Good Partner', body: ['A good partner keeps promises: be faithful, be fair, live within your means.', 'RA 6713 (1989) lists **eight norms of conduct** that every public servant promises to live by.'] },
      { kind: 'idea', kicker: 'The Secret', title: 'The Eight Norms', body: ['1. Commitment to public interest', '2. Professionalism', '3. Justness and sincerity', '4. Political neutrality', '5. Responsiveness to the public', '6. Nationalism and patriotism', '7. Commitment to democracy', '8. Simple living'] },
      { kind: 'rule', kicker: 'The Rule', title: 'Deadlines and Duties', formula: 'Act on requests within 15 working days', formulaNote: 'File your SALN within 30 days of taking office, then on or before April 30 every year. Never ask for or accept gifts tied to your work.', shortcut: { title: 'Match the Norm', lines: ['Modest life → simple living', 'Serve all parties equally → political neutrality', 'Prompt, courteous service → responsiveness to the public', 'Excellence and skill → professionalism'] } },
      { kind: 'trap', kicker: 'Heartbreak Trap', title: 'RA 6713 Is Not the Anti-Graft Law', wrong: 'RA 6713 = Anti-Graft and Corrupt Practices Act', body: ['That is **RA 3019** (1960). RA 6713 is the **Code of Conduct and Ethical Standards** for Public Officials and Employees.', 'Mixing up law numbers is a classic heartbreak. Link each number to its name.'] },
    ],
  },
  'human-rights': {
    topic: 'human-rights',
    minutes: 4,
    cards: [
      { kind: 'love', kicker: LOVE, title: 'Love Respects Boundaries', body: ['In a healthy relationship, both people are safe, free and respected. Nobody owns the other.', 'Human rights are those same promises, made to **every** person.'] },
      { kind: 'idea', kicker: 'The Secret', title: 'Where Rights Come From', body: ['The UN General Assembly adopted the **Universal Declaration of Human Rights** on **December 10, 1948**, now Human Rights Day.', 'At home, the **Bill of Rights** is Article III of the 1987 Constitution, and the **Commission on Human Rights** is created under Article XIII.'] },
      { kind: 'rule', kicker: 'The Rule', title: 'Laws That Protect People', formula: 'RA 9262 = Anti-VAWC Act (2004)', formulaNote: 'It protects women and their children from violence.', shortcut: { title: 'More Laws by Number', lines: ['RA 7610: protection of children (1992)', 'RA 9710: Magna Carta of Women (2009)', 'RA 9745: Anti-Torture Act (2009)', 'RA 11313: Safe Spaces Act (2019)'] } },
      { kind: 'trap', kicker: 'Heartbreak Trap', title: 'The CHR Is Not in Article IX', wrong: 'The CHR is a Constitutional Commission under Article IX.', body: ['Article IX has only three Constitutional Commissions: **CSC, COMELEC and COA**.', 'The CHR is created under **Article XIII**, Social Justice and Human Rights.'] },
    ],
  },
  environment: {
    topic: 'environment',
    minutes: 3,
    cards: [
      { kind: 'love', kicker: LOVE, title: 'Caring for Your Shared Home', body: ["When you move in together, you both keep the house clean. You don't wait for the other to do it.", 'The Constitution protects the right of the people to a **balanced and healthful ecology** (Art. II, Sec. 16). We all share this home.'] },
      { kind: 'idea', kicker: 'The Secret', title: 'Waste Starts at Home', body: ['RA 9003 asks everyone to **separate** waste at the source, such as biodegradable and recyclable waste, before it is collected.', 'Reduce, reuse, recycle. Open burning of garbage is prohibited, and every barangay or cluster of barangays should have a Materials Recovery Facility.'] },
      { kind: 'rule', kicker: 'The Rule', title: 'Laws by Number', formula: 'RA 9003 = Solid Waste Act (2000)', formulaNote: 'The DENR is the lead agency for the environment and natural resources.', shortcut: { title: 'Match the Law', lines: ['RA 8749: Clean Air Act (1999)', 'RA 9275: Clean Water Act (2004)', 'RA 9729: Climate Change Act (2009)', 'RA 10121: Disaster Risk Reduction Act (2010)'] } },
      { kind: 'trap', kicker: 'Heartbreak Trap', title: 'Clean Air and Clean Water Swap Places', wrong: 'RA 9275 = Clean Air Act', body: ['Clean **Air** is RA 8749 (1999), the older one. Clean **Water** is RA 9275 (2004).', 'Memory trick: air comes first, like the first breath you take together.'] },
    ],
  },
};
