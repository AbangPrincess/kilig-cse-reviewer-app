import type { Lesson } from '../numerical/lessons';

const LOVE = 'Think of It like Love';

export const VERBAL_LESSONS: Record<string, Lesson> = {
  vocab: {
    topic: 'vocab',
    minutes: 4,
    cards: [
      { kind: 'love', kicker: LOVE, title: 'Getting to Know Someone New', body: ["You meet someone at a party. You don't know their name yet, but you can tell a lot from how they talk and who they came with.", 'A hard word is the same. The **words around it** tell you who it is.'] },
      { kind: 'idea', kicker: 'The Secret', title: 'Let the Sentence Introduce the Word', body: ['Cover the word in CAPITALS and ask: what word would **I** put here?', 'Then pick the choice closest to your own word.'], example: { q: 'The clerk was DILIGENT, finishing every file before going home.', steps: ['Cover it: "The clerk was ___, finishing every file before going home."', 'Your own word: "hardworking".', 'Pick the choice closest to "hardworking".'], answer: 'hardworking' } },
      { kind: 'rule', kicker: 'The Rule', title: 'Same Meaning, Same Feeling', formula: 'Closest meaning, not just related', formulaNote: 'Check the feeling of the word too. "Thrifty" is praise and "stingy" is an insult, even though both are about saving money.', shortcut: { title: 'Word Parts Help', lines: ['bene- = good (benefit, benevolent)', 'mal- = bad (malfunction, malicious)', 'omni- = all (omnipresent)', '-less = without (careless, hopeless)'] } },
      { kind: 'trap', kicker: 'Heartbreak Trap', title: "Don't Fall for a Lookalike", wrong: 'FRAGILE → glass', body: ['Glass is often fragile, but "fragile" means **easily broken**. Glass is just one thing that can be fragile.', 'A word that usually hangs around the meaning is not the meaning. Pick the true match.'] },
    ],
  },
  'vocab-fil': {
    topic: 'vocab-fil',
    minutes: 4,
    cards: [
      { kind: 'love', kicker: LOVE, title: 'Learning Their Language', body: ['When you date someone from Cebu, you start to understand "ambot" just from how they say it.', 'Deep Filipino words work the same way. You learn them from **how they are used**, not from a list alone.'] },
      { kind: 'idea', kicker: 'The Secret', title: 'Find the Feeling of the Sentence', body: ['Read the whole sentence and ask: is the mood **happy, sad, angry or calm**?', 'Many deep Filipino words carry strong feelings. The mood narrows the choices fast.'], example: { q: 'Labis ang PIGHATI ng balo sa burol ng kaniyang asawa.', steps: ["Mood: a widow at her husband's wake → very sad.", 'Look for the saddest choice.', 'Pighati means matinding lungkot.'], answer: 'matinding lungkot' } },
      { kind: 'rule', kicker: 'The Rule', title: 'Find the Root Word', formula: 'ma- + root = describing word', formulaNote: 'Masipag is ma + sipag (hardworking). Mapagkumbaba is mapag + kumbaba (humble). Find the root, then add the meaning of the prefix.', shortcut: { title: 'Pairs to Remember', lines: ['marikit = maganda', 'dukha = mahirap (sa buhay)', 'masigasig = masipag', 'salat ↔ sagana (kulang ↔ marami)'] } },
      { kind: 'trap', kicker: 'Heartbreak Trap', title: 'Watch for the Opposite', wrong: 'MARALITA → mayaman', body: ['Maralita means **mahirap** (poor). Mayaman is its opposite, placed there to trick a rushed reader.', 'The opposite feels familiar because it is about the same topic. Ask: same meaning, or opposite?'] },
    ],
  },
  antonym: {
    topic: 'antonym',
    minutes: 3,
    cards: [
      { kind: 'love', kicker: LOVE, title: 'Opposites Attract', body: ['One of you is an early bird, the other is a night owl. One is loud, the other is quiet.', 'In this test, you are looking for the word\'s **opposite partner**, not its twin.'] },
      { kind: 'idea', kicker: 'The Secret', title: 'Find the Twin, Then Flip It', body: ['First think of a word that means the **same** thing.', 'Then flip it to its opposite and look for that.'], example: { q: 'Opposite of GENEROUS', steps: ['Twin: giving, kind with money.', 'Flip it: not giving, keeps everything.', 'Look for: stingy.'], answer: 'stingy' } },
      { kind: 'rule', kicker: 'The Rule', title: 'Same Topic, Opposite Direction', formula: 'Opposite = same topic, reversed', formulaNote: 'The opposite of "hot" is "cold", not "wet". Both words must be about the same thing.', shortcut: { title: 'Prefixes That Flip', lines: ['un- (happy → unhappy)', 'im- / in- (possible → impossible)', 'dis- (honest → dishonest)', 'mis- (understand → misunderstand)'] } },
      { kind: 'trap', kicker: 'Heartbreak Trap', title: 'The Twin Is a Trap', wrong: 'Opposite of DIFFICULT → hard', body: ['"Hard" means almost the **same** as difficult. It is the twin, not the opposite. The opposite is **easy**.', 'Under time pressure, many examinees pick the twin. Always ask: same, or opposite?'] },
    ],
  },
  spelling: {
    topic: 'spelling',
    minutes: 3,
    cards: [
      { kind: 'love', kicker: LOVE, title: 'Spelling Their Name Right', body: ["Nothing kills the mood like misspelling your date's name on a gift. One wrong letter, and it looks like you don't care.", 'Spelling items test those small letters: doubled or not, e or a, ie or ei.'] },
      { kind: 'idea', kicker: 'The Secret', title: 'Say It in Syllables', body: ['Break the word into small sounds and spell each part: **gov-ern-ment**, **sep-a-rate**.', "The hard part is often a letter you don't hear clearly. Saying it slowly makes it show up."], example: { q: 'Which is correct: enviroment or environment?', steps: ['Break it: en-vi-ron-ment.', 'People often drop the "n" in "environ" when speaking.', 'Keep it: environment.'], answer: 'environment' } },
      { kind: 'rule', kicker: 'The Rule', title: 'One Collar, Two Sleeves', formula: 'necessary = 1 c, 2 s', formulaNote: 'Like a shirt with one collar and two sleeves. Little pictures like this make tricky spellings stick.', shortcut: { title: 'Commonly Missed Words', lines: ['accommodate (cc, mm)', 'occurrence (cc, rr, -ence)', 'separate (a in the middle)', 'receive (i before e, except after c)'] } },
      { kind: 'trap', kicker: 'Heartbreak Trap', title: "Don't Spell It the Way You Say It", wrong: 'goverment', body: ['Many people drop the "n" when they say "government" out loud. The spelling keeps it: **govern + ment**.', 'When a word is built from a smaller word, keep the smaller word whole.'] },
    ],
  },
  grammar: {
    topic: 'grammar',
    minutes: 4,
    cards: [
      { kind: 'love', kicker: LOVE, title: 'Every Couple Must Agree', body: ['A couple that agrees on small things, like where to eat, has fewer fights.', 'In a sentence, the **subject** and the **verb** must agree too. One person takes a singular verb; a group takes a plural verb.'] },
      { kind: 'idea', kicker: 'The Secret', title: 'Find the Real Subject', body: ['Cross out phrases that start with **of, with, along with** or **as well as**. The real subject is what is left.', 'Then match the verb: singular subject → **is, was, has**. Plural subject → **are, were, have**.'], example: { q: 'The box of files ___ on the table. (is / are)', steps: ['Cross out "of files".', 'The real subject is "box": singular.', 'Use "is".'], answer: 'The box of files is on the table.' } },
      { kind: 'rule', kicker: 'The Rule', title: 'Words That Are Always Singular', formula: 'each · every · everyone · neither → is', formulaNote: 'With "either … or" and "neither … nor", the verb agrees with the subject nearer to it.', shortcut: { title: 'Quick Pairs', lines: ['since 2019 (a point) · for 5 years (a length)', 'submit by Friday (a deadline)', 'between you and me (not "I")', 'interested in · because of + noun'] } },
      { kind: 'trap', kicker: 'Heartbreak Trap', title: "Don't Trust the Nearest Noun", wrong: 'The cost of the repairs were too high.', body: ['"Repairs" sits right before the verb, so it feels like the subject. It is not.', 'The real subject is **cost**, so the sentence needs **was**. Always look past the "of" phrase.'] },
    ],
  },
  'grammar-fil': {
    topic: 'grammar-fil',
    minutes: 4,
    cards: [
      { kind: 'love', kicker: LOVE, title: 'Small Words, Big Difference', body: ['"Mahal kita" and "Mahal ko siya" use tiny words that change who loves whom.', 'Filipino usage items test tiny words like **ng** and **nang**, **din** and **rin**, **daw** and **raw**.'] },
      { kind: 'idea', kicker: 'The Secret', title: 'Ng or Nang?', body: ['Use **ng** before a noun: bumili **ng** gatas, bahay **ng** guro.', 'Use **nang** to show how an action is done (tumakbo **nang** mabilis), to mean "when" (**Nang** dumating siya…), and between repeated verbs (tawa **nang** tawa).'], example: { q: 'Kumain siya ___ mabilis. (ng / nang)', steps: ['"Mabilis" describes HOW he ate.', 'A word that tells how needs "nang".'], answer: 'Kumain siya nang mabilis.' } },
      { kind: 'rule', kicker: 'The Rule', title: 'Din or Rin, Daw or Raw?', formula: 'vowel, w, y → rin / raw', formulaNote: 'After a consonant, use din / daw: "Aalis din siya." "Malakas daw ang ulan." After a vowel, w or y: "Ikaw rin." "Masaya raw siya."', shortcut: { title: 'Other Pairs', lines: ['may + noun or verb: may pera, may darating', 'mayroon + particle or pronoun: mayroon bang, mayroon siyang', 'kung = if · kong = ko + ng (ang aklat kong binili)'] } },
      { kind: 'trap', kicker: 'Heartbreak Trap', title: "Don't Go by Sound Alone", wrong: 'Pumunta ka din sa opisina.', body: ['"Ka" ends in a vowel, so it should be **rin**: "Pumunta ka rin sa opisina."', 'Check the **last letter** of the word right before din/rin or daw/raw, every time.'] },
    ],
  },
  analogy: {
    topic: 'analogy',
    minutes: 4,
    cards: [
      { kind: 'love', kicker: LOVE, title: 'Every Couple Has a Story', body: ['Romeo and Juliet. Malakas and Maganda. Each pair is linked by a story.', 'In an analogy, the first pair has a link. Your job is to find a second pair with the **same** link.'] },
      { kind: 'idea', kicker: 'The Secret', title: 'Say the Link as a Sentence', body: ['Turn the first pair into a short sentence: "A **pen** is a tool a **writer** uses."', 'Then put each choice into the same sentence. Only one will make sense.'], example: { q: 'GLOVE : HAND :: SOCK : ___', steps: ['Link: "A glove covers a hand."', 'Test: "A sock covers a ___."', 'Only "foot" fits.'], answer: 'foot' } },
      { kind: 'rule', kicker: 'The Rule', title: 'Know the Common Links', formula: 'A : B :: C : D', formulaNote: 'Read it as "A is to B as C is to D". The link must be the same, and in the same direction.', shortcut: { title: 'Links That Show Up Often', lines: ['Tool → worker (scalpel : surgeon)', 'Part → whole (page : book)', 'Member → group (bird : flock)', 'Opposites (timid : bold)', 'Cause → effect (spark : fire)'] } },
      { kind: 'trap', kicker: 'Heartbreak Trap', title: 'Keep the Same Direction', wrong: 'SEED : TREE :: BIRD : egg', body: ['A seed **grows into** a tree. A bird does not grow into an egg. The direction got flipped.', 'The right pair is EGG : BIRD. Keep the order of the first pair.'] },
    ],
  },
  paragraph: {
    topic: 'paragraph',
    minutes: 4,
    cards: [
      { kind: 'love', kicker: LOVE, title: 'How Your Love Story Is Told', body: ['A love story has an order: you meet, you date, you fight, you make up. Tell it out of order and nobody follows.', 'Paragraph items give you scrambled sentences. Your job is to put the story back in order.'] },
      { kind: 'idea', kicker: 'The Secret', title: 'Find the Opening Line', body: ['The first sentence **introduces** the topic. It makes sense on its own.', 'Sentences that start with **This, They, As a result, However** or **Next** cannot come first. They point back to something.'], example: { q: '1. As a result, the room stays cool. 2. Our office has big windows on the north side. 3. They let in light but not direct sun.', steps: ['"As a result" and "They" point back, so 1 and 3 cannot be first.', 'Sentence 2 introduces the windows: it goes first.', '"They" means the windows (3), and the result comes last (1).'], answer: '2, 3, 1' } },
      { kind: 'rule', kicker: 'The Rule', title: 'Follow the Signal Words', formula: 'First → Next → Then → Finally', formulaNote: 'Pronouns like it, they and this point back to a noun in an earlier sentence. Put the noun first.', shortcut: { title: 'Signal Words', lines: ['Order: first, next, then, finally', 'Result: as a result, so, because of this', 'Contrast: however, but, on the other hand', 'Example: for example, for instance'] } },
      { kind: 'trap', kicker: 'Heartbreak Trap', title: "Don't Start with a Pointer", wrong: 'Starting with "Because of this, …"', body: ['"Because of this" needs a "this" before it. It can never be the opening line.', 'Check the choices: cross out every order that starts with a pointing sentence.'] },
    ],
  },
  reading: {
    topic: 'reading',
    minutes: 4,
    cards: [
      { kind: 'love', kicker: LOVE, title: 'Listen to What They Actually Said', body: ['In an argument, the worst move is answering what you **think** your partner meant instead of what they said.', 'Reading items are the same. Answer from **the passage**, not from what you already believe.'] },
      { kind: 'idea', kicker: 'The Secret', title: 'Read the Question First', body: ['Read the question before the passage, so you know what to look for.', 'Main idea questions → look at the **first and last** sentences. Detail questions → find the exact line.'], example: { q: '"According to the passage…"', steps: ['These words mean the answer is written in the text.', 'Find the line that says it.', 'Pick the choice that matches that line, not your own opinion.'], answer: 'A choice you can point to in the passage' } },
      { kind: 'rule', kicker: 'The Rule', title: 'The Main Idea Covers Everything', formula: 'Main idea = what every sentence supports', formulaNote: 'A choice that is true but covers only one detail is too narrow. A choice that goes beyond the passage is too broad.', shortcut: { title: 'Question Types', lines: ['Main idea: what is it mostly about?', 'Detail: what does it say about X?', 'Inference: what must be true, based on it?', 'Vocabulary: what does the word mean here?'] } },
      { kind: 'trap', kicker: 'Heartbreak Trap', title: 'True in Life Is Not Enough', wrong: '"Reading is important." (true, but not in the passage)', body: ['A choice can be true in real life and still be wrong, because the passage never says it.', 'Ask: **can I point to it in the text?** If not, break up with that choice.'] },
    ],
  },
};
