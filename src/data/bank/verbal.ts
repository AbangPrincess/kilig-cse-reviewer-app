import { maker } from './make';

const q = maker('verbal', 'v', {
  vocab: 'Choose the word closest in meaning to the word in CAPITAL letters.',
  'vocab-fil': 'Piliin ang salitang pinakamalapit ang kahulugan sa salitang nakasulat sa malalaking titik.',
  antonym: 'Choose the word OPPOSITE in meaning to the word in CAPITAL letters.',
  grammar: 'Choose the word or phrase that best completes the sentence.',
  spelling: 'Choose the correctly spelled word.',
  'grammar-fil': 'Piliin ang angkop na salita upang mabuo ang pangungusap.',
  analogy: 'Choose the word that best completes the analogy.',
  paragraph: 'The sentences below are out of order. Choose the order that makes the clearest paragraph.',
  reading: 'Read the passage, then answer the question.',
});

const PASSAGE_CIVIL = `The Philippine civil service is built on the idea that government jobs should go to the most qualified people, not to the friends or relatives of those in power. This is why many positions require passing a competitive examination. The exam measures skills that every public servant needs, such as reading carefully, reasoning clearly and working with numbers. Passing, however, is only the first step. Public servants are also expected to serve with honesty, courtesy and a commitment to the public interest throughout their careers.`;

const PASSAGE_MANGROVE = `Mangrove forests grow along many Philippine coastlines. Their thick roots slow down waves and help protect coastal communities from storm surges. Mangroves also serve as nurseries where young fish and crabs can grow safely before moving to the open sea. In the past, large areas of mangroves were cleared to make room for fishponds. Today, many local governments and communities are replanting mangroves because they have seen how much these forests protect both lives and livelihoods.`;

const PASSAGE_BAYANIHAN = `Bayanihan is a Filipino tradition in which neighbors help one another without expecting payment. In the past, it was often seen when a family moved to a new place: neighbors would literally carry the family's house on their shoulders to its new location. Today, few houses are carried, but the spirit of bayanihan lives on. It can be seen when communities pack relief goods after a typhoon, when volunteers clean up a flooded street, or when strangers donate to a sick person they have never met.`;

const PASSAGE_TIME = `Many examinees lose points not because they lack knowledge but because they run out of time. In a timed test, spending five minutes on one difficult item can cost you several easy ones later. A better strategy is to answer the questions you are sure of first, mark the hard ones, and return to them at the end. This approach makes sure you collect all the points you can easily earn before you tackle the more demanding items.`;

const PASSAGE_REEF = `The Philippines lies within the Coral Triangle, an area known for one of the richest varieties of marine life in the world. Coral reefs provide food and income for millions of Filipinos who depend on fishing. However, reefs are threatened by destructive fishing methods, pollution and rising sea temperatures. When corals are stressed by warm water, they lose their color in a process called bleaching. Protecting reefs therefore protects both nature and the livelihoods of coastal families.`;

export const VERBAL = [
  // Vocabulary (English)
  q('vocab', 'The supervisor gave a CANDID assessment of the project.', ['frank', 'secret', 'careless', 'lengthy'], 0, 'Candid means honest and direct, so "frank" is closest.'),
  q('vocab', 'She is METICULOUS in checking every voucher.', ['hurried', 'careful', 'nervous', 'generous'], 1, 'Meticulous means paying great attention to detail: careful.'),
  q('vocab', 'After the long meeting, the staff felt LETHARGIC.', ['excited', 'sluggish', 'angry', 'hungry'], 1, 'Lethargic means tired and slow: sluggish.'),
  q('vocab', 'The BENEVOLENT donor funded a new library for the town.', ['wealthy', 'kind', 'famous', 'strict'], 1, 'Benevolent means kind and wanting to do good. Being wealthy is not part of the meaning.'),
  q('vocab', 'Mobile phones have become UBIQUITOUS in government offices.', ['expensive', 'found everywhere', 'prohibited', 'outdated'], 1, 'Ubiquitous means present everywhere.'),
  q('vocab', 'A FRUGAL employee sets aside part of every paycheck.', ['thrifty', 'lazy', 'wasteful', 'careless'], 0, 'Frugal means careful with money: thrifty. "Wasteful" is its opposite.'),
  q('vocab', 'The mayor took a PRAGMATIC approach to the flooding problem.', ['emotional', 'practical', 'slow', 'secret'], 1, 'Pragmatic means dealing with things in a practical, realistic way.'),
  q('vocab', 'The old manual filing system is now OBSOLETE.', ['outdated', 'efficient', 'popular', 'expensive'], 0, 'Obsolete means no longer in use: outdated.'),
  q('vocab', 'The memo was AMBIGUOUS, so nobody knew what to do.', ['brief', 'unclear', 'rude', 'late'], 1, 'Ambiguous means open to more than one meaning: unclear.'),
  q('vocab', 'Please make your report CONCISE.', ['colorful', 'brief', 'detailed', 'formal'], 1, 'Concise means short but complete: brief. "Detailed" is closer to the opposite.'),

  // Vocabulary (Filipino)
  q('vocab-fil', 'Ang MARILAG na tanawin ng Bulkang Mayon ay dinarayo ng mga turista.', ['maganda', 'mapanganib', 'malayo', 'maingay'], 0, 'Ang marilag ay nangangahulugang maganda o kahanga-hanga.'),
  q('vocab-fil', 'Si Liza ay DALUBHASA sa pagsasalin ng mga dokumento.', ['baguhan', 'eksperto', 'tamad', 'mabagal'], 1, 'Ang dalubhasa ay eksperto. Ang "baguhan" ay kabaligtaran nito.'),
  q('vocab-fil', 'Kahit mataas ang kaniyang posisyon, nanatili siyang MAPAGKUMBABA.', ['hindi mayabang', 'masungit', 'mayaman', 'maingay'], 0, 'Ang mapagkumbaba ay hindi mayabang o hindi nagmamataas.'),
  q('vocab-fil', 'Naging MATIWASAY ang halalan sa kanilang bayan.', ['magulo', 'payapa', 'mabilis', 'maingay'], 1, 'Ang matiwasay ay payapa o tahimik.'),
  q('vocab-fil', 'SALAT sa kagamitan ang paaralan sa bundok.', ['sagana', 'kulang', 'bago', 'malinis'], 1, 'Ang salat ay kulang o kapos. Ang "sagana" ay kabaligtaran nito.'),
  q('vocab-fil', 'Ramdam ang HINAGPIS ng pamilyang nasalanta ng bagyo.', ['matinding galit', 'matinding lungkot', 'labis na tuwa', 'pagkagulat'], 1, 'Ang hinagpis ay matinding lungkot o pighati.'),

  // Opposite meanings
  q('antonym', 'Clean water is SCARCE in some coastal villages.', ['abundant', 'dirty', 'expensive', 'rare'], 0, 'Scarce means not enough. Its opposite is abundant. "Rare" means almost the same as scarce.'),
  q('antonym', 'The crowd became HOSTILE when the event was cancelled.', ['angry', 'friendly', 'loud', 'large'], 1, 'Hostile means unfriendly or aggressive, so the opposite is friendly.'),
  q('antonym', 'The agency promised a TRANSPARENT bidding process.', ['open', 'secretive', 'quick', 'legal'], 1, 'A transparent process is open to the public. The opposite is secretive.'),
  q('antonym', 'This is only a TEMPORARY office.', ['small', 'permanent', 'new', 'rented'], 1, 'Temporary means for a short time; the opposite is permanent.'),
  q('antonym', 'He was RELUCTANT to sign the contract.', ['unwilling', 'willing', 'afraid', 'slow'], 1, 'Reluctant means unwilling, so the opposite is willing.'),

  // Grammar and correct usage
  q('grammar', 'Neither the manager nor the clerks ___ present at the meeting.', ['was', 'were', 'is', 'has been'], 1, 'With "neither … nor", the verb agrees with the nearer subject. "Clerks" is plural, so use "were".', { why: { 0: '"Was" would agree with "manager", but the verb follows the nearer subject, "clerks".' } }),
  q('grammar', 'Each of the applicants ___ required to submit a résumé.', ['are', 'is', 'were', 'have been'], 1, '"Each" is singular, even when followed by "of the applicants". Use "is".', { why: { 0: '"Applicants" is plural, but the subject is "each", which is singular.' } }),
  q('grammar', 'The committee ___ its decision yesterday.', ['announce', 'announces', 'announced', 'will announce'], 2, '"Yesterday" calls for the past tense: announced.'),
  q('grammar', 'She has been working in the agency ___ 2019.', ['for', 'since', 'from', 'at'], 1, 'Use "since" with a starting point in time (since 2019). Use "for" with a length of time (for five years).', { why: { 0: '"For" goes with a length of time, like "for five years".' } }),
  q('grammar', 'Between you and ___, the report is already late.', ['I', 'me', 'myself', 'mine'], 1, '"Between" is a preposition, so it takes the object form: me.', { why: { 0: '"I" is a subject form. After a preposition like "between", use "me".' } }),
  q('grammar', 'If I ___ the mayor, I would repair all the roads.', ['am', 'was', 'were', 'will be'], 2, 'For wishes and situations that are not real, formal English uses "were": "If I were the mayor…"'),
  q('grammar', 'Please submit your application ___ Friday.', ['until', 'by', 'at', 'in'], 1, 'For a deadline, use "by". "Until" means an action keeps going up to that time.', { why: { 0: '"Submit until Friday" is a common mistake. "Until" is for actions that continue, like "The office is open until Friday".' } }),
  q('grammar', 'The number of applicants ___ increased this year.', ['have', 'has', 'are', 'were'], 1, '"The number of …" is singular, so use "has". ("A number of applicants have…" would be plural.)'),
  q('grammar', 'He is one of the employees who ___ always on time.', ['is', 'are', 'was', 'has'], 1, '"Who" refers to "employees" (plural), so the verb is "are".'),
  q('grammar', 'The documents were ___ to the wrong office.', ['send', 'sent', 'sending', 'sends'], 1, 'After "were" in the passive voice, use the past participle: sent.'),

  // Spelling
  q('spelling', 'Which word is spelled correctly?', ['acommodate', 'accomodate', 'accommodate', 'acomodate'], 2, 'Accommodate has a double c and a double m.'),
  q('spelling', 'Which word is spelled correctly?', ['neccessary', 'necessary', 'necesary', 'neccesary'], 1, 'Necessary has one c and a double s.'),

  // Wastong gamit (Filipino)
  q('grammar-fil', 'Tumakbo siya ___ mabilis upang umabot sa pulong.', ['ng', 'nang', 'na', 'ang'], 1, 'Ginagamit ang "nang" bilang pang-abay na nagsasaad ng paraan: tumakbo nang mabilis.'),
  q('grammar-fil', 'Ikaw ___ ang napiling kinatawan ng opisina.', ['din', 'rin', 'daw', 'man'], 1, 'Ginagamit ang "rin" kapag ang sinusundang salita ay nagtatapos sa patinig o sa w at y. Ang "ikaw" ay nagtatapos sa w.'),

  // Word analogy
  q('analogy', 'PEN : WRITER :: SCALPEL : ___', ['hospital', 'surgeon', 'patient', 'blade'], 1, 'A writer uses a pen as a tool; a surgeon uses a scalpel.'),
  q('analogy', 'BOOK : LIBRARY :: PAINTING : ___', ['artist', 'museum', 'frame', 'color'], 1, 'Books are kept and shown in a library; paintings in a museum.'),
  q('analogy', 'HUNGRY : EAT :: TIRED : ___', ['work', 'rest', 'run', 'yawn'], 1, 'When you are hungry you eat; when you are tired you rest. (Yawning is a sign of being tired, not the fix.)'),
  q('analogy', 'FISH : SCHOOL :: BIRD : ___', ['nest', 'flock', 'feather', 'sky'], 1, 'A group of fish is a school; a group of birds is a flock.'),
  q('analogy', 'ARCHIPELAGO : ISLAND :: CONSTELLATION : ___', ['planet', 'star', 'moon', 'galaxy'], 1, 'An archipelago is a group of islands; a constellation is a group of stars.'),
  q('analogy', 'DROUGHT : WATER :: FAMINE : ___', ['rain', 'food', 'money', 'hunger'], 1, 'A drought is a lack of water; a famine is a lack of food. Hunger is a result, not what is lacking.'),
  q('analogy', 'TEACHER : SCHOOL :: NURSE : ___', ['doctor', 'medicine', 'hospital', 'patient'], 2, 'A teacher works in a school; a nurse works in a hospital.'),
  q('analogy', 'CAUTIOUS : RECKLESS :: GENEROUS : ___', ['kind', 'stingy', 'rich', 'giving'], 1, 'Cautious and reckless are opposites; generous and stingy are opposites.'),

  // Paragraph organization
  q('paragraph', 'Which is the best order?', ['2, 4, 1, 3', '4, 2, 3, 1', '2, 1, 4, 3', '3, 2, 4, 1'], 0, 'Start with the general fact (2), explain the cause (4), give the result (1), then the solution (3).', {
    passage: '1. As a result, many households experience water interruptions in summer.\n2. Metro Manila depends heavily on a few dams for its water supply.\n3. Saving water at home can help ease this problem.\n4. When rainfall is low, the water level in these dams drops.',
  }),
  q('paragraph', 'Which is the best order?', ['1, 2, 3, 4', '2, 1, 3, 4', '2, 3, 1, 4', '4, 2, 1, 3'], 1, 'Introduce the exam (2), say what passing gives (1), explain why that matters (3), then conclude (4).', {
    passage: '1. Passing it gives a person civil service eligibility.\n2. The Civil Service Exam is taken by people who want to work in government.\n3. This eligibility is needed for many permanent government positions.\n4. That is why thousands of Filipinos take the exam every year.',
  }),
  q('paragraph', 'Which is the best order?', ['1, 4, 3, 2', '2, 4, 1, 3', '2, 1, 4, 3', '2, 3, 1, 4'], 2, 'Open with the situation (2), then follow the signal words: First (1), Next (4), Finally (3).', {
    passage: '1. First, prepare an emergency bag with water, food and a flashlight.\n2. Many typhoons hit the Philippines every year, so families should be ready.\n3. Finally, follow official advisories and evacuate when told to.\n4. Next, secure loose objects around the house.',
  }),

  // Reading comprehension
  q('reading', 'What is the main idea of the passage?', ['Passing the exam guarantees a government job.', 'Government jobs should go to qualified people who also serve with integrity.', 'Friends of officials are often hired in government.', 'Reading is the most important skill in government.'], 1, 'The passage says jobs should go to the most qualified, and that public servants must also serve with honesty. It says passing is only the first step, so it does not guarantee a job.', { passage: PASSAGE_CIVIL }),
  q('reading', 'According to the passage, why do many government positions require an exam?', ['To fill positions based on qualifications rather than connections.', 'To reduce the number of government employees.', 'To test applicants on the law.', 'To give jobs to relatives of officials.'], 0, 'The first two sentences say jobs should go to the most qualified, "not to friends or relatives", which is why an exam is required.', { passage: PASSAGE_CIVIL }),
  q('reading', 'As used in the passage, "competitive" most nearly means:', ['based on comparing how applicants perform', 'unfriendly', 'expensive', 'optional'], 0, 'A competitive examination compares applicants so the best qualified are chosen.', { passage: PASSAGE_CIVIL }),
  q('reading', 'Which of the following is NOT mentioned as a benefit of mangroves?', ['They slow down waves.', 'They protect communities from storm surges.', 'They are nurseries for young fish and crabs.', 'They provide timber for building houses.'], 3, 'The passage mentions slowing waves, protection from storm surges and serving as nurseries. It never mentions timber.', { passage: PASSAGE_MANGROVE, fixed: true }),
  q('reading', 'Why were many mangrove areas cleared in the past?', ['To build roads', 'To make room for fishponds', 'To stop storm surges', 'To plant rice'], 1, 'The passage says mangroves "were cleared to make room for fishponds."', { passage: PASSAGE_MANGROVE }),
  q('reading', 'What can be inferred about the communities that are replanting mangroves?', ['They want to build more fishponds.', 'They value mangroves for protecting both people and income.', 'They no longer fish for a living.', 'They were never affected by storms.'], 1, 'They replant because they "have seen how much these forests protect both lives and livelihoods."', { passage: PASSAGE_MANGROVE }),

  // ---- Added set 2 ----

  // Vocabulary (English)
  q('vocab', 'The new policy will ALLEVIATE traffic in the city center.', ['ease', 'worsen', 'measure', 'ignore'], 0, 'Alleviate means to make something less severe: ease.'),
  q('vocab', 'The witness gave a VIVID description of the accident.', ['clear and detailed', 'vague', 'false', 'short'], 0, 'Vivid means producing clear, strong pictures in the mind.'),
  q('vocab', 'The team stayed RESILIENT after the project failed.', ['quick to recover', 'angry', 'careless', 'confused'], 0, 'Resilient means able to bounce back after a setback.'),
  q('vocab', 'Her explanation was too VERBOSE for a short memo.', ['wordy', 'brief', 'polite', 'simple'], 0, 'Verbose means using more words than needed: wordy.'),
  q('vocab', 'The office adopted a more LENIENT dress code.', ['relaxed', 'strict', 'formal', 'expensive'], 0, 'Lenient means not strict: relaxed. "Strict" is the opposite.'),
  q('vocab', 'The flood caused EXTENSIVE damage to the crops.', ['widespread', 'minor', 'sudden', 'hidden'], 0, 'Extensive means covering a large area: widespread.'),
  q('vocab', 'The clerk tried to PLACATE the angry customer.', ['calm down', 'ignore', 'blame', 'question'], 0, 'To placate is to calm someone and make them less angry.'),
  q('vocab', 'Employees must be PUNCTUAL for the morning assembly.', ['on time', 'prepared', 'quiet', 'polite'], 0, 'Punctual means arriving at the right time.'),
  q('vocab', 'The committee will SCRUTINIZE every receipt.', ['examine closely', 'approve', 'collect', 'throw away'], 0, 'To scrutinize is to examine something very carefully.'),
  q('vocab', 'The hospital faced a severe SHORTAGE of nurses.', ['lack', 'surplus', 'strike', 'training'], 0, 'A shortage is a lack of something needed. A surplus is the opposite.'),
  q('vocab', 'The documents were kept CONFIDENTIAL.', ['private', 'public', 'organized', 'damaged'], 0, 'Confidential means meant to be kept secret or private.'),
  q('vocab', 'The evidence was INCONCLUSIVE.', ['not decisive', 'false', 'complete', 'hidden'], 0, 'Inconclusive means it does not lead to a firm conclusion.'),
  q('vocab', 'The two offices COLLABORATED on the report.', ['worked together', 'competed', 'argued', 'waited'], 0, 'To collaborate is to work together.'),
  q('vocab', 'The speaker greeted the guests in a CORDIAL tone.', ['friendly', 'harsh', 'loud', 'boring'], 0, 'Cordial means warm and friendly.'),
  q('vocab', 'The city launched an AMBITIOUS road project.', ['large and challenging', 'small', 'cheap', 'unpopular'], 0, 'An ambitious project aims high and is hard to achieve.'),
  q('vocab', 'The supply of rice remained ADEQUATE during the storm.', ['enough', 'scarce', 'spoiled', 'expensive'], 0, 'Adequate means enough for the need.'),
  q('vocab', 'His remarks were IRRELEVANT to the discussion.', ['unrelated', 'important', 'rude', 'funny'], 0, 'Irrelevant means not connected to the topic.'),
  q('vocab', 'The team prepared a TENTATIVE schedule.', ['not yet final', 'fixed', 'long', 'secret'], 0, 'Tentative means not yet certain or final.'),
  q('vocab', 'The heavy rain was a HINDRANCE to the rescue team.', ['obstacle', 'help', 'signal', 'warning'], 0, 'A hindrance is something that gets in the way: an obstacle.'),
  q('vocab', 'The volunteers showed great FORTITUDE during the disaster.', ['courage', 'wealth', 'skill', 'speed'], 0, 'Fortitude is courage and strength in facing difficulty.'),
  q('vocab', 'The outdated ordinance was finally REPEALED.', ['cancelled', 'passed', 'printed', 'explained'], 0, 'To repeal a law is to cancel it officially.'),
  q('vocab', 'The guard remained VIGILANT all night.', ['watchful', 'sleepy', 'angry', 'silent'], 0, 'Vigilant means carefully watching for danger.'),
  q('vocab', 'The professor gave a LUCID explanation of the law.', ['clear', 'long', 'confusing', 'funny'], 0, 'Lucid means easy to understand: clear.'),
  q('vocab', 'The audit revealed several DISCREPANCIES in the records.', ['inconsistencies', 'copies', 'signatures', 'pages'], 0, 'A discrepancy is a difference between things that should match.'),
  q('vocab', 'The applicant gave a CONCISE answer to every question.', ['short but complete', 'rude', 'confusing', 'late'], 0, 'Concise means expressed in few words but still complete.'),

  // Vocabulary (Filipino)
  q('vocab-fil', 'Pinasimple ng ahensya ang MASALIMUOT na proseso.', ['kumplikado', 'madali', 'mabilis', 'bago'], 0, 'Ang masalimuot ay magulo o kumplikado.'),
  q('vocab-fil', 'Dapat MAKATARUNGAN ang hatol ng hukuman.', ['patas', 'mabagsik', 'mabilis', 'lihim'], 0, 'Ang makatarungan ay patas o naaayon sa katarungan.'),
  q('vocab-fil', 'Ang kanyang PAGSISIKAP ay nagbunga ng tagumpay.', ['pagpupunyagi', 'pagkabigo', 'pag-aalinlangan', 'pagpapabaya'], 0, 'Ang pagsisikap ay pagpupunyagi o masigasig na paggawa.'),
  q('vocab-fil', 'MAPANGLAW ang bahay matapos umalis ang pamilya.', ['malungkot', 'masaya', 'maingay', 'maliwanag'], 0, 'Ang mapanglaw ay malungkot at tahimik.'),
  q('vocab-fil', 'Kilala siya bilang MASIGASIG na kawani.', ['masipag', 'tamad', 'mayabang', 'mahiyain'], 0, 'Ang masigasig ay masipag at determinado.'),
  q('vocab-fil', 'Mabilis na LUMAGANAP ang balita sa buong bayan.', ['kumalat', 'nawala', 'natapos', 'tumahimik'], 0, 'Ang lumaganap ay kumalat o umabot sa maraming lugar.'),
  q('vocab-fil', 'Ramdam ng lahat ang PAGDURUSA ng mga nasalanta.', ['paghihirap', 'pagyaman', 'pagtatanim', 'pagdiriwang'], 0, 'Ang pagdurusa ay paghihirap o pagtitiis ng sakit.'),
  q('vocab-fil', 'MAHINAHON siyang sumagot sa galit na mamamayan.', ['kalmado', 'pasigaw', 'mabilis', 'pabiro'], 0, 'Ang mahinahon ay kalmado at hindi padalos-dalos.'),
  q('vocab-fil', 'Tumagal ng isang linggo ang PAGSUSURI sa mga dokumento.', ['maingat na pag-aaral', 'pagpirma', 'pagsunog', 'pagkopya'], 0, 'Ang pagsusuri ay maingat na pag-aaral o pagsisiyasat.'),
  q('vocab-fil', 'Ang kanilang PAGKAKAISA ang nagpatagumpay sa proyekto.', ['pagtutulungan', 'pag-aaway', 'pagmamadali', 'pagkakamali'], 0, 'Ang pagkakaisa ay pagsasama-sama at pagtutulungan.'),
  q('vocab-fil', 'DI-MALIRIP ang lungkot ng mga nawalan ng tahanan.', ['hindi maisip', 'madaling makita', 'panandalian', 'maliit'], 0, 'Ang di-malirip ay hindi maisip o hindi mawari sa tindi.'),
  q('vocab-fil', 'NAGPUPUYOS sa galit ang mamamayan dahil sa katiwalian.', ['nagngingitngit', 'natutuwa', 'natatakot', 'nahihiya'], 0, 'Ang nagpupuyos sa galit ay labis na nagagalit o nagngingitngit.'),

  // Opposite meanings
  q('antonym', 'The manager is known for being FRUGAL with office supplies.', ['thrifty', 'wasteful', 'careful', 'honest'], 1, 'Frugal means careful with resources. The opposite is wasteful. "Thrifty" means the same as frugal.'),
  q('antonym', 'The rules were made more RIGID.', ['strict', 'flexible', 'clear', 'old'], 1, 'Rigid means stiff and unbending; the opposite is flexible.'),
  q('antonym', 'The report contained ACCURATE figures.', ['exact', 'wrong', 'recent', 'large'], 1, 'Accurate means correct; the opposite is wrong.'),
  q('antonym', 'The health center serves a REMOTE village.', ['isolated', 'nearby', 'quiet', 'poor'], 1, 'Remote means far away; the opposite is nearby.'),
  q('antonym', 'The new director sounded HUMBLE in her speech.', ['modest', 'arrogant', 'quiet', 'tired'], 1, 'Humble means modest; the opposite is arrogant.'),
  q('antonym', 'Attendance at the training is MANDATORY.', ['required', 'optional', 'difficult', 'urgent'], 1, 'Mandatory means required; the opposite is optional.'),
  q('antonym', 'Prices of vegetables are expected to DECLINE.', ['fall', 'rise', 'stay', 'change'], 1, 'Decline means go down; the opposite is rise.'),
  q('antonym', 'The employee was COMMENDED for her work.', ['praised', 'criticized', 'paid', 'promoted'], 1, 'Commended means praised; the opposite is criticized.'),
  q('antonym', 'Fresh water is ABUNDANT in the province.', ['plentiful', 'scarce', 'clean', 'expensive'], 1, 'Abundant means plentiful; the opposite is scarce.'),
  q('antonym', 'The night guard stayed ALERT.', ['watchful', 'drowsy', 'brave', 'strict'], 1, 'Alert means wide awake and watchful; the opposite is drowsy.'),
  q('antonym', 'The new filing system is EFFICIENT.', ['fast', 'wasteful', 'modern', 'simple'], 1, 'Efficient means doing a job without waste; the opposite is wasteful.'),
  q('antonym', 'He gave a VAGUE answer to the question.', ['unclear', 'precise', 'short', 'polite'], 1, 'Vague means unclear; the opposite is precise.'),

  // Grammar and correct usage
  q('grammar', 'The list of requirements ___ posted on the bulletin board.', ['were', 'was', 'are', 'have been'], 1, 'The subject is "list" (singular), not "requirements". Use "was".', { why: { 0: '"Requirements" is plural, but it is part of the phrase "of requirements". The real subject is "list".' } }),
  q('grammar', 'Everyone in the office ___ invited to the seminar.', ['are', 'is', 'were', 'have'], 1, '"Everyone" is singular, so use "is".'),
  q('grammar', 'Mathematics ___ my favorite subject in school.', ['were', 'was', 'are', 'have been'], 1, 'Subjects like mathematics, physics and economics are singular even though they end in -s.'),
  q('grammar', 'The new employees, along with their supervisor, ___ attending the orientation.', ['is', 'are', 'was', 'has'], 1, 'A phrase like "along with their supervisor" does not change the subject. "Employees" is plural, so use "are".'),
  q('grammar', 'Of the two candidates, she is the ___.', ['taller', 'tallest', 'most tall', 'more taller'], 0, 'When comparing two, use the comparative form: taller.'),
  q('grammar', 'He ___ in the office since 8 o\'clock this morning.', ['is', 'was', 'has been', 'will be'], 2, '"Since 8 o\'clock" shows an action that started in the past and continues now: has been.'),
  q('grammar', 'By the time we arrived, the meeting ___.', ['already starts', 'had already started', 'has already start', 'will start'], 1, 'The meeting started before another past action (we arrived), so use the past perfect: had already started.'),
  q('grammar', 'Neither of the reports ___ complete.', ['are', 'is', 'were', 'have been'], 1, '"Neither" by itself is singular, so use "is".'),
  q('grammar', 'The clerk asked me where ___.', ['did I live', 'I lived', 'do I live', 'I am live'], 1, 'In a reported question, use normal statement order: "where I lived".'),
  q('grammar', 'Please give the forms to Mr. Cruz and ___.', ['I', 'me', 'myself', 'mine'], 1, 'After "to", use the object form: me. (Test it: "give the forms to me".)'),
  q('grammar', 'The applicant ___ résumé was chosen will be called tomorrow.', ["who's", 'whose', 'who', 'whom'], 1, '"Whose" shows possession (the applicant\'s résumé). "Who\'s" means "who is".'),
  q('grammar', '___ going to submit the report?', ['Whose', "Who's", 'Whom', 'Who'], 1, '"Who\'s" is short for "who is": "Who is going to submit the report?"'),
  q('grammar', 'The supervisor wants the report ___ by Friday.', ['finish', 'finished', 'finishing', 'to finishing'], 1, '"Wants the report finished" uses the past participle to show the report must be done.'),
  q('grammar', 'If it ___ tomorrow, the event will be moved indoors.', ['rain', 'rains', 'will rain', 'rained'], 1, 'In a real future condition, the "if" part uses the simple present: "If it rains…"'),
  q('grammar', 'There ___ many applicants for the job last year.', ['was', 'were', 'is', 'has been'], 1, '"Applicants" is plural and "last year" is past, so use "were".'),
  q('grammar', 'She speaks English very ___.', ['good', 'well', 'nice', 'best'], 1, '"Well" is the adverb that describes how she speaks. "Good" is an adjective.'),
  q('grammar', 'I look forward to ___ from you.', ['hear', 'hearing', 'heard', 'be hearing'], 1, 'In "look forward to", "to" is a preposition, so it is followed by the -ing form: hearing.'),
  q('grammar', 'The documents ___ by the clerk yesterday.', ['signed', 'were signed', 'are signing', 'have sign'], 1, 'The documents received the action in the past, so use the past passive: were signed.'),
  q('grammar', 'He is interested ___ joining the civil service.', ['on', 'in', 'at', 'for'], 1, 'The correct pairing is "interested in".'),
  q('grammar', 'The meeting was cancelled ___ the typhoon.', ['because', 'because of', 'due', 'since'], 1, 'Before a noun phrase like "the typhoon", use "because of". "Because" needs a full clause.'),

  // Spelling
  q('spelling', 'Which word is spelled correctly?', ['seperate', 'separete', 'separate', 'saparate'], 2, 'Separate has "a" in the middle: sep-A-rate.'),
  q('spelling', 'Which word is spelled correctly?', ['occurence', 'occurrence', 'ocurrence', 'occurrance'], 1, 'Occurrence has a double c, a double r, and ends in -ence.'),
  q('spelling', 'Which word is spelled correctly?', ['goverment', 'governmant', 'government', 'govenment'], 2, 'Government keeps the "n" from "govern".'),
  q('spelling', 'Which word is spelled correctly?', ['maintainance', 'maintenance', 'maintenence', 'mantenance'], 1, 'Maintenance is spelled main-te-nance, not "maintain-ance".'),
  q('spelling', 'Which word is spelled correctly?', ['recieve', 'receive', 'receeve', 'reiceve'], 1, 'Remember: "i before e, except after c" — receive.'),

  // Wastong gamit (Filipino)
  q('grammar-fil', '___ dumating ang bisita, nagsimula na ang programa.', ['Ng', 'Nang', 'Na', 'Ang'], 1, 'Ginagamit ang "nang" bilang pangatnig na nangangahulugang "noong" o "nang dumating".'),
  q('grammar-fil', 'Bumili siya ___ bagong sapatos para sa trabaho.', ['ng', 'nang', 'na', 'sa'], 0, 'Ginagamit ang "ng" bago ang pangngalan na tumatanggap ng kilos: bumili ng sapatos.'),
  q('grammar-fil', 'Masaya ___ ang mga empleyado sa bagong patakaran.', ['daw', 'raw', 'din', 'man'], 1, 'Ginagamit ang "raw" kapag ang naunang salita ay nagtatapos sa patinig. Ang "masaya" ay nagtatapos sa "a".'),
  q('grammar-fil', 'Malakas ___ ang ulan kahapon sa probinsya.', ['raw', 'daw', 'rin', 'pa'], 1, 'Ginagamit ang "daw" kapag ang naunang salita ay nagtatapos sa katinig. Ang "malakas" ay nagtatapos sa "s".'),
  q('grammar-fil', 'Pinagbuti niya ang trabaho ___ siya ay ma-promote.', ['upang', 'dahil', 'kaya', 'ngunit'], 0, 'Ang "upang" ay nagpapakita ng layunin: ginawa niya ito para ma-promote.'),
  q('grammar-fil', 'Ang mga dokumento ay ___ mesa ng kalihim.', ['nasa', 'nang', 'kina', 'ni'], 0, 'Ang "nasa" ay nagsasaad ng lugar o kinaroroonan: nasa mesa.'),

  // Word analogy
  q('analogy', 'PAGE : BOOK :: KEY : ___', ['lock', 'keyboard', 'door', 'typing'], 1, 'A page is part of a book; a key is part of a keyboard.'),
  q('analogy', 'SEED : TREE :: EGG : ___', ['nest', 'bird', 'shell', 'yolk'], 1, 'A seed grows into a tree; an egg grows into a bird.'),
  q('analogy', 'CARPENTER : HAMMER :: PAINTER : ___', ['canvas', 'brush', 'color', 'wall'], 1, 'A carpenter works with a hammer; a painter works with a brush.'),
  q('analogy', 'SECOND : MINUTE :: MINUTE : ___', ['day', 'hour', 'week', 'second'], 1, 'Sixty seconds make a minute; sixty minutes make an hour.'),
  q('analogy', 'AUTHOR : NOVEL :: COMPOSER : ___', ['orchestra', 'symphony', 'piano', 'singer'], 1, 'An author creates a novel; a composer creates a symphony.'),
  q('analogy', 'BEE : HIVE :: BIRD : ___', ['tree', 'nest', 'sky', 'egg'], 1, 'A bee lives in a hive; a bird lives in a nest.'),
  q('analogy', 'DOCTOR : DIAGNOSIS :: JUDGE : ___', ['court', 'verdict', 'lawyer', 'law'], 1, 'A doctor gives a diagnosis; a judge gives a verdict.'),
  q('analogy', 'INCH : FOOT :: CENTIMETER : ___', ['kilometer', 'meter', 'millimeter', 'gram'], 1, 'An inch is a smaller unit within a foot; a centimeter is a smaller unit within a meter.'),
  q('analogy', 'TIMID : BOLD :: ANCIENT : ___', ['old', 'modern', 'historic', 'ruined'], 1, 'Timid and bold are opposites; ancient and modern are opposites.'),
  q('analogy', 'WATER : THIRST :: FOOD : ___', ['plate', 'hunger', 'cook', 'taste'], 1, 'Water relieves thirst; food relieves hunger.'),
  q('analogy', 'LIBRARIAN : BOOKS :: CASHIER : ___', ['store', 'money', 'customer', 'receipt'], 1, 'A librarian handles books; a cashier handles money.'),
  q('analogy', 'RAIN : FLOOD :: SPARK : ___', ['light', 'fire', 'electricity', 'smoke'], 1, 'Too much rain can cause a flood; a spark can cause a fire.'),

  // Paragraph organization
  q('paragraph', 'Which is the best order?', ['4, 2, 1, 3', '2, 4, 1, 3', '2, 1, 4, 3', '1, 4, 2, 3'], 1, 'Introduce the topic (2), then follow the signal words: First (4), Next (1), Finally (3).', {
    passage: '1. Next, pay the fee at the cashier.\n2. Applying for a passport takes a few simple steps.\n3. Finally, claim your passport or wait for it to be delivered.\n4. First, book an appointment online.',
  }),
  q('paragraph', 'Which is the best order?', ['2, 1, 3, 4', '3, 2, 1, 4', '2, 3, 1, 4', '1, 2, 4, 3'], 0, 'Start with the problem (2), give its effect (1), the response (3), then the result (4).', {
    passage: '1. Because of this, mosquitoes began to multiply.\n2. Last month, garbage piled up along the creek.\n3. The barangay then organized a clean-up drive.\n4. Within weeks, dengue cases in the area went down.',
  }),
  q('paragraph', 'Which is the best order?', ['2, 1, 3, 4', '2, 3, 1, 4', '3, 2, 4, 1', '4, 2, 3, 1'], 1, 'Main idea (2), an example (3), what happens over time (1), then why it matters (4).', {
    passage: '1. Over time, these small amounts grow into a real emergency fund.\n2. Saving money does not have to start big.\n3. Even setting aside ₱50 a day adds up to about ₱1,500 a month.\n4. That fund can protect you when unexpected expenses come.',
  }),

  // Reading comprehension
  q('reading', 'The passage is mainly about:', ['how the tradition of bayanihan continues in new forms', 'how to move a house', 'why families moved often in the past', 'how relief goods are packed'], 0, 'The passage explains the old practice and then shows how the same spirit appears today.', { passage: PASSAGE_BAYANIHAN }),
  q('reading', 'According to the passage, in the past bayanihan was often seen when:', ['a family moved to a new place', 'a typhoon hit the town', 'a street was flooded', 'someone got sick'], 0, 'The passage says it "was often seen when a family moved to a new place."', { passage: PASSAGE_BAYANIHAN }),
  q('reading', 'The word "literally" in the passage suggests that the neighbors:', ['actually carried the house', 'only pretended to carry the house', 'talked about carrying the house', 'paid others to carry the house'], 0, '"Literally" means in the real, physical sense: they really carried the house.', { passage: PASSAGE_BAYANIHAN }),
  q('reading', "The author's main point is that examinees should:", ['answer easy items first and return to hard ones later', 'spend more time on difficult items', 'study harder before the exam', 'skip all difficult questions'], 0, 'The passage recommends answering sure items first, marking hard ones, and returning to them.', { passage: PASSAGE_TIME }),
  q('reading', 'According to the passage, many examinees lose points because they:', ['run out of time', 'lack knowledge', 'skip easy items', 'mark too many items'], 0, 'The first sentence says they lose points "because they run out of time," not because they lack knowledge.', { passage: PASSAGE_TIME }),
  q('reading', 'Which word best describes the tone of the passage?', ['advising', 'angry', 'humorous', 'sad'], 0, 'The author gives practical advice in a calm, helpful way.', { passage: PASSAGE_TIME }),
  q('reading', 'According to the passage, what happens to corals during bleaching?', ['They lose their color when stressed by warm water.', 'They grow faster than usual.', 'They are removed by fishermen.', 'They turn into sand right away.'], 0, 'The passage says stressed corals "lose their color in a process called bleaching."', { passage: PASSAGE_REEF }),
  q('reading', 'Which of the following is NOT mentioned as a threat to coral reefs?', ['destructive fishing methods', 'pollution', 'rising sea temperatures', 'tourism'], 3, 'The passage names destructive fishing, pollution and rising sea temperatures. Tourism is not mentioned.', { passage: PASSAGE_REEF, fixed: true }),
  q('reading', 'Why does the author say that protecting reefs also protects livelihoods?', ['Many families depend on fishing for food and income.', 'Reefs are used to build houses.', 'Tourists pay to see bleached corals.', 'Reefs stop sea temperatures from rising.'], 0, 'The passage says reefs "provide food and income for millions of Filipinos who depend on fishing."', { passage: PASSAGE_REEF }),

  // ---- Added set 3: every topic has at least 10 items ----

  // Spelling
  q('spelling', 'Which word is spelled correctly?', ['embarrass', 'embarass', 'embaras', 'emberrass'], 0, 'Embarrass has a double r and a double s.'),
  q('spelling', 'Which word is spelled correctly?', ['definately', 'definitely', 'definitly', 'defenitely'], 1, 'Definitely comes from "finite": de-FINITE-ly.'),
  q('spelling', 'Which word is spelled correctly?', ['questionnaire', 'questionaire', 'questionnare', 'qestionnaire'], 0, 'Questionnaire has a double n and ends in -aire.'),

  // Wastong gamit (Filipino)
  q('grammar-fil', 'Tawa ___ tawa ang mga bata sa palabas.', ['ng', 'nang', 'na', 'at'], 1, 'Ginagamit ang "nang" sa pagitan ng inuulit na pandiwa: tawa nang tawa.'),
  q('grammar-fil', '___ bang bakanteng posisyon sa inyong opisina?', ['May', 'Mayroon', 'Mayron', 'Meron'], 1, 'Ginagamit ang "mayroon" kapag sinusundan ng kataga gaya ng "ba": Mayroon bang…'),

  // Paragraph organization
  q('paragraph', 'Which is the best order?', ['2, 3, 1, 4', '3, 1, 2, 4', '2, 1, 3, 4', '3, 2, 1, 4'], 0, 'Introduce the topic (2), then follow the signal words: First (3), Then (1), Finally (4).', {
    passage: '1. Then, the clerk checks the documents and gives you a claim stub.\n2. Getting a barangay clearance is simple.\n3. First, fill out the request form at the barangay hall.\n4. Finally, return on the date on the stub to claim the clearance.',
  }),
  q('paragraph', 'Which is the best order?', ['2, 4, 1, 3', '4, 2, 1, 3', '2, 1, 4, 3', '3, 2, 4, 1'], 0, 'Start with the habit (2), explain the cause (4), give its effect (1), then the advice (3).', {
    passage: '1. This makes it harder to fall asleep.\n2. Many people use their phones right before sleeping.\n3. Experts suggest putting the phone away an hour before bed.\n4. Phone screens give off bright light that keeps the brain alert.',
  }),
  q('paragraph', 'Which is the best order?', ['2, 4, 1, 3', '2, 1, 3, 4', '4, 2, 1, 3', '1, 2, 4, 3'], 0, 'Main idea (2), why it matters (4, where "It" means courtesy), an example (1), then the conclusion (3).', {
    passage: '1. For example, a clerk who greets every visitor makes the office feel welcoming.\n2. Courtesy is one of the most important traits of a public servant.\n3. In short, small acts of respect build public trust.\n4. It shows the public that they are valued.',
  }),
  q('paragraph', 'Which is the best order?', ['2, 4, 3, 1', '2, 3, 4, 1', '4, 2, 1, 3', '3, 2, 4, 1'], 0, 'The problem (2), its effect (4), the action taken (3), then the result (1).', {
    passage: "1. As a result, the town now floods less during heavy rain.\n2. For years, the town's canals were blocked by garbage.\n3. Last year, volunteers cleared the canals and set up trash bins.\n4. Every heavy rain caused knee-deep floods.",
  }),
];
