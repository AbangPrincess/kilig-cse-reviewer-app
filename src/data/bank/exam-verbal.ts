import { maker } from './make';

/*
 * Exam-style Verbal items, in the formats recent CSE Professional reviewers use:
 * words in context, "If you are ___, you…", idioms, fill-in spelling, pair analogies,
 * "best supports" paragraphs, longer passages and sentence ordering.
 */

const q = maker('verbal', 'v2', {
  vocab: 'Choose the word or phrase closest in meaning to the word in CAPITAL letters.',
  idioms: 'Choose the meaning of the expression in CAPITAL letters.',
  'vocab-fil': 'Piliin ang kahulugan ng sawikaing nakasulat sa malalaking titik.',
  spelling: 'Choose the correct spelling of the missing word.',
  analogy: 'Choose the pair that shows the same relationship as the pair in CAPITAL letters.',
  paragraph: 'The sentences below are out of order. Choose the order that makes the clearest paragraph.',
  reading: 'Read the passage, then answer the question.',
});

const BEST = 'Choose the best answer.';
const SUPPORTS = 'This paragraph best supports the statement that:';

const PASSAGE_EAGLE = `When a new bird species is spotted in a Philippine forest, the news rarely spreads beyond a few scientists. The Philippine Eagle is different. Few birds draw as much attention, and few are in as much danger. It is one of the largest eagles in the world, with wings that stretch about two meters, and it is found nowhere else on Earth.

Raising a family is slow work for these birds. A pair lays only one egg about every two years, and both parents spend months feeding and guarding the single chick. Because THEY breed so slowly, every bird lost to hunting is hard to replace.

The greatest threat, however, is the loss of forests. The eagles need large areas of old forest to hunt, and much of that forest has been cleared for farms, logging and roads. To raise awareness, the Philippine Eagle was declared the national bird in 1995. Today, conservation groups breed eagles in captivity, protect nesting sites and work with the communities that live near the forests.`;

const PASSAGE_JEEPNEY = `After World War II, the American military left thousands of jeeps behind in the Philippines. Filipino mechanics stretched the bodies of these vehicles, added two long benches in the back and a roof overhead, and turned them into passenger vehicles. The jeepney was born. Owners soon painted their jeepneys in bright colors and decorated them with chrome horses, mirrors and the names of loved ones, so that no two looked alike. For decades, jeepneys carried millions of commuters every day and earned the title "King of the Road." Today, older units are being replaced by newer models under a government modernization program, but many Filipinos still see the jeepney as a symbol of their creativity.`;

const order = (lines: string[]) => lines.map((l, i) => `${i + 1}. ${l}`).join('\n');

export const EXAM_VERBAL = [
  // Words in context
  q('vocab', 'The new online system will STREAMLINE the hiring process.', ['simplify', 'complicate', 'delay', 'announce'], 0, 'To streamline is to make a process simpler and more efficient.'),
  q('vocab', 'The mayor tried to MOLLIFY the angry vendors with a new market schedule.', ['calm', 'provoke', 'ignore', 'fine'], 0, 'To mollify is to calm someone down or ease their anger.'),
  q('vocab', 'Her explanation was CREDIBLE, so the auditor accepted it.', ['believable', 'doubtful', 'rude', 'lengthy'], 0, 'Credible means believable. The auditor accepted it, which fits.'),
  q('vocab', 'He DEDUCED the answer from the clues instead of waiting to be told.', ['concluded', 'guessed', 'borrowed', 'doubted'], 0, 'To deduce is to reach a conclusion by reasoning from evidence.', {
    why: { 1: 'A guess has no reasoning behind it. Deducing works step by step from clues.' },
  }),
  q('vocab', "The supervisor's reply was TERSE, so we knew she was busy.", ['brief', 'warm', 'angry', 'loud'], 0, 'Terse means brief and to the point, sometimes to the point of sounding curt.'),
  q('vocab', 'The interviewer asked open questions to ELICIT honest answers.', ['draw out', 'hide', 'judge', 'repeat'], 0, 'To elicit is to draw out a response or information.'),
  q('vocab', 'The new law aims to CURB illegal logging in the province.', ['limit', 'encourage', 'report', 'measure'], 0, 'To curb is to hold back or limit something.'),
  q('vocab', 'A TEDIOUS task would', ['be long and boring.', 'be quick and easy.', 'be dangerous.', 'be well paid.'], 0, 'Tedious means long, slow and dull.', { directions: BEST }),
  q('vocab', 'A CONCILIATORY remark would', ['help make peace.', 'start an argument.', 'reveal a secret.', 'sound like a joke.'], 0, 'Conciliatory means meant to calm anger and bring people back together.', { directions: BEST }),
  q('vocab', 'An IMPARTIAL judge would', ['favor neither side.', 'favor the richer side.', 'refuse to decide.', 'decide very quickly.'], 0, 'Impartial means fair and not taking sides.', { directions: BEST }),
  q('vocab', 'If you are GREGARIOUS, you', ['enjoy being with other people.', 'prefer to work alone.', 'are easily angered.', 'give away money freely.'], 0, 'Gregarious means sociable, fond of company.', { directions: BEST }),
  q('vocab', 'If you PROCRASTINATE, you', ['put off tasks until later.', 'finish tasks early.', 'do many tasks at once.', 'ask others to do your work.'], 0, 'To procrastinate is to keep delaying what you should do now.', { directions: BEST }),
  q('vocab', 'If you are MAGNANIMOUS, you', ['are generous in forgiving others.', 'are very proud of yourself.', 'hold grudges for a long time.', 'are easily fooled.'], 0, 'Magnanimous means big-hearted, generous especially toward a rival or someone who wronged you.', { directions: BEST }),
  q('vocab', 'If you CORROBORATE a story, you', ['confirm it.', 'deny it.', 'make it up.', 'spread it.'], 0, 'To corroborate is to support or confirm with more evidence.', { directions: BEST }),
  q('vocab', 'If a situation is PRECARIOUS, it is', ['unstable and risky.', 'calm and safe.', 'funny.', 'already over.'], 0, 'Precarious means not secure; it could easily get worse.', { directions: BEST }),
  q('vocab', 'If a remark is DEROGATORY, it', ['belittles someone.', 'praises someone.', 'explains something.', 'asks a question.'], 0, 'Derogatory means insulting or showing low regard.', { directions: BEST }),
  q('vocab', 'If you are an ADVOCATE of a cause, you', ['support it publicly.', 'oppose it.', 'only study it.', 'ignore it.'], 0, 'An advocate speaks up for and supports a cause.', { directions: BEST }),
  q('vocab', 'Which word is NOT a palindrome (a word that reads the same backward and forward)?', ['record', 'civic', 'radar', 'refer'], 0, 'Record backward is "drocer". Civic, radar and refer read the same both ways.', { directions: BEST }),

  // Idioms and proverbs
  q('idioms', "Please don't LET THE CAT OUT OF THE BAG about the surprise party.", ['reveal the secret', 'free the pet', 'ruin the gift', 'arrive early'], 0, 'To let the cat out of the bag is to reveal a secret, often by accident.'),
  q('idioms', 'The clerk went ON A WILD GOOSE CHASE looking for a file that was never received.', ['searched for something hopeless', 'went bird hunting', 'worked overtime', 'followed orders'], 0, 'A wild goose chase is a search for something you will never find.'),
  q('idioms', 'Be careful with the new partner; he may be A WOLF IN SHEEP’S CLOTHING.', ['someone harmful who looks harmless', 'a strict but fair boss', 'a very shy person', 'a lazy worker'], 0, 'A wolf in sheep’s clothing hides bad intentions behind a gentle look.'),
  q('idioms', 'Buying the new laptop BROKE THE BANK, so we skipped the vacation.', ['cost too much money', 'was robbed', 'fell and broke', 'was a gift'], 0, 'If something breaks the bank, it costs more than you can afford.'),
  q('idioms', 'The youngest daughter is THE APPLE OF HER FATHER’S EYE.', ["her father's favorite", "her father's helper", 'always eating fruit', 'just like her father in looks'], 0, 'The apple of someone’s eye is the person they love most.'),
  q('idioms', 'After the scandal, the official tried to SAVE FACE by apologizing first.', ['protect their reputation', 'hide from reporters', 'wash up', 'resign quietly'], 0, 'To save face is to avoid embarrassment and keep people’s respect.'),
  q('idioms', "Let's BURY THE HATCHET and work on the project together.", ['make peace', 'hide the evidence', 'start a new job', 'plan in secret'], 0, 'To bury the hatchet is to stop fighting and become friendly again.'),
  q('idioms', 'Relax, but not too much: the deadline is AROUND THE CORNER.', ['very near', 'already past', 'in the next office', 'still uncertain'], 0, 'Around the corner means coming very soon.'),
  q('idioms', '"DON\'T COUNT YOUR CHICKENS BEFORE THEY HATCH."', ["Don't plan on results before they happen.", 'Save your money for the future.', 'Take good care of your animals.', 'Avoid gambling with friends.'], 0, 'The proverb warns against relying on something good that has not happened yet.'),
  q('idioms', 'Her answer HIT THE NAIL ON THE HEAD.', ['was exactly right', 'was very loud', 'hurt someone', 'was too long'], 0, 'To hit the nail on the head is to say exactly the right thing.'),
  q('idioms', '"DON\'T PUT ALL YOUR EGGS IN ONE BASKET."', ["Don't risk everything on a single plan.", "Don't carry too much at once.", 'Plan your meals ahead.', 'Share what you have with others.'], 0, 'Spread your chances so that one failure does not cost you everything.'),
  q('idioms', "Karaoke nights are just NOT MY CUP OF TEA.", ['not something I enjoy', 'too hot for me', 'too expensive', 'not on the menu'], 0, 'Not my cup of tea means not something I like.'),
  q('idioms', 'The host told a funny story to BREAK THE ICE at the first meeting.', ['ease the awkwardness', 'cool the room', 'end the meeting', 'start an argument'], 0, 'To break the ice is to make people feel relaxed when they first meet.'),

  // Filipino expressions
  q('vocab-fil', 'Mula nang magsara ang pabrika, si Ben ay NAGBIBILANG NG POSTE.', ['walang trabaho', 'nagtatrabaho sa kuryente', 'naglalakad tuwing gabi', 'nag-iipon ng pera'], 0, 'Ang "nagbibilang ng poste" ay nangangahulugang walang trabaho.'),
  q('vocab-fil', 'Huwag mong biruin si Liza; BALAT-SIBUYAS siya.', ['madaling masaktan ang damdamin', 'mahilig magluto', 'makapal ang mukha', 'laging masaya'], 0, 'Ang balat-sibuyas ay taong maramdamin o madaling masaktan.'),
  q('vocab-fil', 'Matagal nang MAGKADUGTONG ANG BITUKA sina Rosa at Elena.', ['matalik na magkaibigan', 'magkapatid sa ama', 'laging nag-aaway', 'magkasosyo sa negosyo'], 0, 'Ang magkadugtong ang bituka ay matalik na magkaibigan.'),

  // Spelling in context
  q('spelling', 'The committee finally reached a ________ after a long debate.', ['consensus', 'concensus', 'consencus', 'consensous'], 0, 'Consensus: con-SEN-sus, with an s in both places.'),
  q('spelling', 'Please ________ receipt of this memo by signing below.', ['acknowledge', 'acknowlege', 'aknowledge', 'acknoledge'], 0, 'Acknowledge keeps the c-k and the whole word "knowledge".'),
  q('spelling', 'She serves as the ________ between the two departments.', ['liaison', 'liason', 'liaision', 'laison'], 0, 'Liaison has two i’s: li-ai-son.'),
  q('spelling', 'Voting is both a right and a ________.', ['privilege', 'priviledge', 'privelege', 'privilage'], 0, 'Privilege: priv-i-lege, with no d.'),
  q('spelling', 'The box holds ________ office supplies such as clips and tape.', ['miscellaneous', 'miscelaneous', 'miscellanious', 'misellaneous'], 0, 'Miscellaneous: misc + ell + aneous.'),
  q('spelling', 'Too much ________ slows down government transactions.', ['bureaucracy', 'beaurocracy', 'bureacracy', 'burocracy'], 0, 'Bureaucracy starts with "bureau", like the office.'),
  q('spelling', 'The young ________ opened her own bakery in Quezon City.', ['entrepreneur', 'entreprenuer', 'enterpreneur', 'entrepeneur'], 0, 'Entrepreneur ends in -eur, from the French.'),
  q('spelling', 'The store gives a one-year ________ on all appliances.', ['guarantee', 'garantee', 'guarrantee', 'guarentee'], 0, 'Guarantee: gu-a-r-a-n-t-e-e, one r.'),
  q('spelling', 'Can you ________ a good canteen near the office?', ['recommend', 'reccomend', 'recomend', 'reccommend'], 0, 'Recommend has one c and two m’s.'),
  q('spelling', 'Her ________ paid off when she finally passed the exam.', ['perseverance', 'perserverance', 'perseverence', 'persevereance'], 0, 'Perseverance: per-se-ver-ance, with no extra r.'),
  q('spelling', "Don't ________ the problem; it is smaller than you think.", ['exaggerate', 'exagerate', 'exaggarate', 'exxagerate'], 0, 'Exaggerate has a double g.'),

  // Analogies
  q('analogy', 'CANDID : FRANK :: FEEBLE : ___', ['weak', 'strong', 'honest', 'brief'], 0, 'Candid and frank are synonyms. A synonym of feeble is weak.', { directions: 'Choose the word that best completes the analogy.' }),
  q('analogy', 'COURAGE : HERO', ['wisdom : sage', 'wealth : thief', 'fear : soldier', 'silence : speaker'], 0, 'A hero is known for courage; a sage is known for wisdom.'),
  q('analogy', 'MISER : STINGINESS', ['optimist : hopefulness', 'judge : prison', 'doctor : disease', 'critic : praise'], 0, 'A miser is defined by stinginess; an optimist is defined by hopefulness.'),
  q('analogy', 'TIMID : SHY', ['ordinary : common', 'huge : tiny', 'rapid : slow', 'bright : dark'], 0, 'Timid and shy mean nearly the same, as do ordinary and common. The other pairs are opposites.'),
  q('analogy', 'ARROGANT : HUMBLE', ['anxious : calm', 'tired : sleepy', 'angry : furious', 'rich : wealthy'], 0, 'Arrogant and humble are opposites, like anxious and calm.'),
  q('analogy', 'COVER : BOOK', ['wrapper : candy', 'shelf : library', 'ink : pen', 'page : chapter'], 0, 'A cover wraps the outside of a book, as a wrapper wraps candy.'),
  q('analogy', 'STUDY : LEARN', ['practice : improve', 'read : write', 'cook : eat', 'walk : run'], 0, 'You study in order to learn, and practice in order to improve.'),
  q('analogy', 'ARSENAL : WEAPONS', ['archive : records', 'soldier : guns', 'museum : visitors', 'bank : tellers'], 0, 'An arsenal is where weapons are stored; an archive is where records are stored.'),
  q('analogy', 'PORTION : SHARE', ['piece : fragment', 'whole : part', 'page : book', 'slice : bread'], 0, 'Portion and share mean about the same; so do piece and fragment.'),
  q('analogy', 'THERMOMETER : TEMPERATURE', ['scale : weight', 'ruler : pencil', 'clock : alarm', 'barometer : rain'], 0, 'A thermometer measures temperature; a scale measures weight. A barometer measures air pressure, not rain.'),

  // Paragraphs that support a statement
  q('reading', SUPPORTS, ['air pollution can affect places far from where it starts.', 'forest fires happen in only one country.', 'neighboring countries cause their own haze.', 'haze is harmless to health.'], 0, 'The paragraph says smoke from one country causes haze hundreds of kilometers away.', {
    passage: 'Pollution does not stop at borders. Smoke from forest fires in one country often causes haze in neighboring countries hundreds of kilometers away.',
  }),
  q('reading', SUPPORTS, ['programs work better when they are designed around local needs.', 'richer countries should run these programs.', 'developing areas do not need outside help.', 'local needs never change.'], 0, 'The programs fail because they copy outside methods "without first studying local needs".', {
    passage: 'Many programs in developing areas copy the methods of richer countries without first studying local needs, so they often fail to solve the problems they were meant to address.',
  }),
  q('reading', SUPPORTS, ['good listening takes deliberate attention.', 'only teachers need to listen actively.', 'asking questions is impolite.', 'distractions make listening easier.'], 0, 'Setting aside distractions, focusing and asking questions all take conscious effort.', {
    passage: 'Active listening takes effort. The listener must set aside distractions, focus on the speaker and ask questions to check understanding.',
  }),
  q('reading', SUPPORTS, ['people can see the same situation in different ways.', 'glasses should always be full.', 'one of the two people is lying.', 'both people are thirsty.'], 0, 'The same glass is described two ways because the two people see it differently.', {
    passage: 'Two people look at the same glass of water. One calls it half empty; the other calls it half full.',
  }),
  q('reading', SUPPORTS, ['learning shows us how much is left to learn.', 'older people know less than younger ones.', 'learning should stop at some point.', 'ignorance can never be reduced.'], 0, 'Each new thing learned reveals more that is still unknown.', {
    passage: 'The more we learn, the more we discover how much we do not yet know.',
  }),
  q('reading', SUPPORTS, ['reliable census data supports good national planning.', 'population growth is easy to predict.', 'the census should be held every year.', 'planning is not needed for development.'], 0, 'Planning depends on population forecasts, so reliable census data is essential.', {
    passage: 'Long-term government planning depends on accurate forecasts of population growth. That is why collecting reliable census data is essential to national development.',
  }),
  q('reading', 'Ayon sa talata:', ['Nagdulot ang bagyo ng mas mataas na presyo ng gulay at mas mababang kita ng mga magsasaka.', 'Bumaba ang presyo ng gulay dahil sa bagyo.', 'Tumaas ang kita ng mga magsasaka pagkatapos ng bagyo.', 'Walang epekto ang bagyo sa mga palengke.'], 0, 'Sinasabi ng talata na nasira ang pananim, tumaas ang presyo ng gulay at nabawasan ang kita ng mga magsasaka.', {
    directions: 'Basahin ang talata, pagkatapos ay sagutin ang tanong.',
    passage: 'Dahil sa malakas na bagyo, nasira ang maraming pananim. Tumaas tuloy ang presyo ng gulay sa mga palengke, at nabawasan ang kita ng mga magsasaka.',
  }),

  // Longer passage: the Philippine Eagle
  q('reading', 'Which title best fits the passage?', ['A Rare Bird in Danger', 'The Birds of the World', 'How to Raise an Eagle at Home', 'Logging and Road Building'], 0, 'The passage is about the Philippine Eagle: how rare it is, why it is threatened and how people protect it.', { passage: PASSAGE_EAGLE }),
  q('reading', 'As used in the first paragraph, "draw" most nearly means:', ['attract', 'sketch', 'pull out', 'tie'], 0, '"Few birds draw as much attention" means few birds attract as much attention.', { passage: PASSAGE_EAGLE }),
  q('reading', 'Based on the passage, what is probably true of most new bird species found in the Philippines?', ['They get little public attention.', 'They are larger than the eagle.', 'They are in more danger than the eagle.', 'They are found all over the world.'], 0, 'The passage says news of a new species "rarely spreads beyond a few scientists".', { passage: PASSAGE_EAGLE }),
  q('reading', 'How often does a pair of Philippine Eagles lay an egg?', ['About once every two years', 'Twice a year', 'Every month', 'Once in a lifetime'], 0, 'The second paragraph says a pair lays "only one egg about every two years".', { passage: PASSAGE_EAGLE }),
  q('reading', 'In the second paragraph, the word THEY refers to:', ['the eagles', 'the hunters', 'the chicks', 'the scientists'], 0, 'It is the eagles that "breed so slowly".', { passage: PASSAGE_EAGLE }),
  q('reading', "According to the passage, the eagles' forests have been cleared for all of the following EXCEPT:", ['mining', 'farms', 'logging', 'roads'], 0, 'The passage lists farms, logging and roads. Mining is not mentioned.', { passage: PASSAGE_EAGLE }),
  q('reading', 'Why is every eagle lost to hunting hard to replace?', ['The birds breed very slowly.', 'Hunters are hard to catch.', 'The eggs are too large.', 'The chicks leave their parents early.'], 0, '"Because they breed so slowly, every bird lost to hunting is hard to replace."', { passage: PASSAGE_EAGLE }),
  q('reading', 'According to the passage, what happened in 1995?', ['The Philippine Eagle was declared the national bird.', 'The first eagle was bred in captivity.', 'The last old forests were cleared.', 'A new bird species was discovered.'], 0, 'The third paragraph says the eagle was declared the national bird in 1995.', { passage: PASSAGE_EAGLE }),

  // Longer passage: the jeepney
  q('reading', 'Where did the first jeepneys come from?', ['Military jeeps left after World War II', 'Buses imported from Japan', 'Horse-drawn carriages', 'Trucks built in Manila factories'], 0, 'The passage opens with the jeeps the American military left behind after World War II.', { passage: PASSAGE_JEEPNEY }),
  q('reading', 'Why did no two jeepneys look alike?', ['Owners decorated them in their own way.', 'They came from different countries.', 'The government required it.', 'Each was built from a different car model.'], 0, 'Owners painted and decorated them "so that no two looked alike".', { passage: PASSAGE_JEEPNEY }),
  q('reading', 'As used in the passage, "units" refers to:', ['vehicles', 'apartments', 'measurements', 'soldiers'], 0, '"Older units are being replaced by newer models" — the units are the jeepneys themselves.', { passage: PASSAGE_JEEPNEY }),
  q('reading', 'Which statement best expresses the main idea of the passage?', ['The jeepney grew from war-surplus vehicles into a lasting symbol of Filipino creativity.', 'Jeepneys should be banned from city roads.', 'American soldiers designed the first jeepneys.', 'The modernization program has ended jeepney use.'], 0, 'The passage traces the jeepney from leftover jeeps to "a symbol of their creativity".', { passage: PASSAGE_JEEPNEY }),

  // Sentence ordering
  q('paragraph', 'Which is the best order?', ['2, 4, 1, 3', '4, 2, 1, 3', '2, 1, 4, 3', '2, 4, 3, 1'], 0, 'Introduce the problem (2), say what scams try to do (4), give an example (1), then the advice (3).', {
    passage: order(['For example, scammers may pose as bank employees and ask for your one-time PIN.', 'Online scams have become more common as more Filipinos shop and bank on their phones.', 'Never share such codes with anyone, even if the caller sounds official.', 'Most of these scams try to trick people into giving away private information.']),
  }),
  q('paragraph', 'Which is the best order?', ['2, 3, 1, 4', '3, 1, 2, 4', '2, 1, 3, 4', '2, 3, 4, 1'], 0, 'Define composting (2), then follow the steps: First (3), Then (1), After a few weeks (4).', {
    passage: order(['Then mix in dry leaves or shredded paper to balance the moisture.', 'Composting turns kitchen and garden waste into rich soil.', 'First, collect fruit peels, vegetable scraps and coffee grounds in a bin.', 'After a few weeks, the mixture breaks down into compost you can use on plants.']),
  }),
  q('paragraph', 'Which is the best order?', ['2, 1, 3, 4', '1, 2, 3, 4', '2, 3, 1, 4', '2, 1, 4, 3'], 0, 'State the purpose (2), then go in time order: before (1), during (3), afterward (4).', {
    passage: order(['Before the interview, research the agency and its mandate.', 'A job interview is your chance to show why you fit the position.', 'During the interview, answer clearly and give examples from your experience.', 'Afterward, send a short thank-you message to the interviewer.']),
  }),
  q('paragraph', 'Which is the best order?', ['2, 4, 3, 1', '2, 3, 4, 1', '4, 2, 3, 1', '2, 4, 1, 3'], 0, 'Filing (2), readings and hearings (4), approval by both chambers (3), then the President signs (1).', {
    passage: order(['If the President signs it, the bill becomes a law.', 'A bill is first filed in either the Senate or the House of Representatives.', 'Once both chambers approve the same version, it is sent to the President.', 'It then goes through three readings and committee hearings.']),
  }),
  q('paragraph', 'Which is the best order?', ['3, 1, 2, 4', '3, 2, 1, 4', '1, 3, 2, 4', '3, 1, 4, 2'], 0, 'The situation (3), what happens to the plastic (1), the result (2), then the solution (4).', {
    passage: order(['Much of it is not recycled or properly thrown away.', 'As a result, plastic waste often ends up clogging canals and drainage.', 'The Philippines uses huge amounts of single-use plastic every day.', 'Bringing reusable bags and containers is a simple way to help.']),
  }),
  q('paragraph', 'Which is the best order?', ['3, 1, 4, 2', '3, 4, 1, 2', '1, 4, 3, 2', '3, 1, 2, 4'], 0, 'The problem (3), one way to cope (1), another way, signaled by "also" (4), then the conclusion (2).', {
    passage: order(['One way to calm down is to prepare your talk well.', 'With enough preparation and practice, the fear usually fades.', 'Many people feel nervous about speaking in front of a crowd.', 'Practicing in front of a friend can also help you feel more at ease.']),
  }),
  q('paragraph', 'Which is the best order?', ['2, 1, 4, 3', '2, 4, 1, 3', '1, 2, 4, 3', '2, 1, 3, 4'], 0, 'Start with income (2), list expenses (1), subtract them (4), then split what is left (3).', {
    passage: order(['Next, list your fixed expenses such as rent and bills.', 'Making a monthly budget starts with knowing how much you earn.', 'Whatever is left can be split between savings and other needs.', 'Subtract these expenses from your income.']),
  }),
  q('paragraph', 'Which is the best order?', ['3, 4, 1, 2', '4, 3, 1, 2', '3, 1, 4, 2', '3, 4, 2, 1'], 0, 'The benefit (3), the contrast "However" (4), why sitting is a problem (1), then the simple fix (2).', {
    passage: order(['Long hours of sitting have been linked to health problems.', 'Even a 30-minute walk each day can make a difference.', 'Regular exercise keeps the heart and muscles strong.', 'However, many adults spend most of the day sitting.']),
  }),
  q('paragraph', 'Which is the best order?', ['4, 1, 2, 3', '1, 4, 2, 3', '4, 2, 1, 3', '4, 1, 3, 2'], 0, 'Name the terraces (4), how they were made (1), how they were kept (2), then today’s problem (3).', {
    passage: order(['They were carved into the mountains of the Cordillera by hand.', 'For centuries, farmers have kept them in good repair.', 'Today, some terraces are being abandoned as young people move to the cities.', 'The Ifugao Rice Terraces are among the most famous sights in the Philippines.']),
  }),
  q('paragraph', 'Which is the best order?', ['2, 3, 1, 4', '3, 2, 1, 4', '2, 1, 3, 4', '2, 3, 4, 1'], 0, 'The purpose of drills (2), what happens during the shaking (3), after it stops (1), then the final head count (4).', {
    passage: order(['When the shaking stops, walk calmly to the open evacuation area.', 'Earthquake drills teach people what to do when the ground starts to shake.', 'During the drill, participants "duck, cover and hold" under sturdy tables.', 'Finally, teachers or floor marshals count everyone to make sure no one is missing.']),
  }),
  q('paragraph', 'Which is the best order?', ['2, 1, 4, 3', '1, 2, 4, 3', '2, 4, 3, 1', '4, 2, 1, 3'], 0, 'What the ID is (2), then the steps in order: online form (1), center visit (4), delivery weeks later (3).', {
    passage: order(['First, the applicant fills out a form online and picks a schedule.', 'The national ID gives every Filipino a single proof of identity.', "Weeks later, the ID card is delivered to the applicant's address.", "On the scheduled day, staff at the registration center take the applicant's photo and fingerprints."]),
  }),
  q('paragraph', 'Which is the best order?', ['4, 1, 3, 2', '1, 4, 3, 2', '4, 3, 1, 2', '4, 1, 2, 3'], 0, 'Who the workers are (4), what they send (1), what the money does for families (3), then the big picture (2).', {
    passage: order(['Many of them send part of their earnings home every month.', 'Together, these remittances are an important part of the national economy.', 'This money helps families pay for food, schooling and housing.', 'Millions of Filipinos work abroad as overseas Filipino workers.']),
  }),
  q('paragraph', 'Which is the best order?', ['2, 3, 4, 1', '3, 2, 4, 1', '2, 4, 3, 1', '2, 3, 1, 4'], 0, 'The benefit (2), the problem "Yet" (3), the key idea (4), then the specific tip (1).', {
    passage: order(['Even 15 minutes a day is enough to build the habit.', 'Reading regularly improves vocabulary and focus.', 'Yet many people say they have no time to read.', 'The key is to start small.']),
  }),
  q('paragraph', 'Which is the best order?', ['2, 4, 1, 3', '4, 1, 3, 2', '2, 1, 4, 3', '2, 4, 3, 1'], 0, 'The main idea (2), then the habits in order: First (4), Second (1), Lastly (3).', {
    passage: order(['Second, never leave cooking unattended.', 'Most house fires can be prevented with a few simple habits.', 'Lastly, keep a fire extinguisher where everyone can reach it.', 'First, unplug appliances that are not in use.']),
  }),
];
