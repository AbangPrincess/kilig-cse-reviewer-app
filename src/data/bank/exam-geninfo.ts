import { maker } from './make';

/* Exam-style General Information items on facts that keep coming up in recent CSE reviewers. */

const q = maker('geninfo', 'g2', {
  constitution: 'Choose the best answer.',
  environment: 'Choose the best answer.',
});

const C = (s: string) => ({ source: `1987 Constitution, ${s}` });

export const EXAM_GENINFO = [
  q('constitution', 'Under the 1987 Constitution, the Philippines is a ___ State.', ['democratic and republican', 'federal and parliamentary', 'unitary and monarchical', 'socialist and democratic'], 0, '"The Philippines is a democratic and republican State. Sovereignty resides in the people and all government authority emanates from them."', C('Article II, Section 1')),
  q('constitution', 'Under the Bill of Rights, a search warrant or a warrant of arrest may be issued only by a:', ['judge', 'police chief', 'mayor', 'senator'], 0, 'Probable cause must be "determined personally by the judge" after examining the complainant and witnesses.', C('Article III, Section 2')),
  q('constitution', 'A foreign national may become a Filipino citizen through:', ['naturalization', 'extradition', 'deportation', 'a tourist visa'], 0, 'Article IV lists "those who are naturalized in accordance with law" among the citizens of the Philippines.', C('Article IV, Section 1')),
  q('constitution', 'Which does the State affirm as "a primary social economic force"?', ['labor', 'trade', 'education', 'commerce'], 0, '"The State affirms labor as a primary social economic force. It shall protect the rights of workers and promote their welfare."', C('Article II, Section 18')),
  q('constitution', 'Congress has two chambers. Which is the lower chamber?', ['the House of Representatives', 'the Senate', 'the National Assembly', 'the Batasang Pambansa'], 0, 'Legislative power is vested in a Congress "which shall consist of a Senate and a House of Representatives". The House is the lower chamber.', C('Article VI, Section 1')),
  q('constitution', 'To expel one of its Members, a house of Congress needs the concurrence of:', ['two-thirds of all its Members', 'a simple majority of those present', 'three-fourths of all its Members', 'all of its Members'], 0, 'Each house may suspend or expel a Member "with the concurrence of two-thirds of all its Members".', C('Article VI, Section 16(3)')),
  q('constitution', 'When a house of Congress suspends one of its Members, the suspension cannot be longer than:', ['60 days', '30 days', '90 days', '1 year'], 0, '"A penalty of suspension, when imposed, shall not exceed sixty days."', C('Article VI, Section 16(3)')),
  q('constitution', 'Which of these is NOT a ground for impeachment?', ['low public approval ratings', 'treason', 'bribery', 'betrayal of public trust'], 0, 'The grounds are culpable violation of the Constitution, treason, bribery, graft and corruption, other high crimes, and betrayal of public trust. Popularity is not one of them.', C('Article XI, Section 2')),
  q('constitution', 'Which official can NOT be removed through impeachment?', ['a Senator', 'the Ombudsman', 'the Chief Justice', 'the Vice President'], 0, 'Impeachable officials are the President, the Vice President, Members of the Supreme Court, Members of the Constitutional Commissions and the Ombudsman. Senators are disciplined by the Senate itself.', C('Article XI, Section 2')),
  q('environment', 'Which substances are mainly responsible for thinning the ozone layer?', ['chlorofluorocarbons (CFCs)', 'carbon dioxide', 'methane', 'nitrogen'], 0, 'CFCs, once common in aerosol sprays and old refrigerators, break down ozone high in the atmosphere. Carbon dioxide drives global warming but does not destroy ozone.', { source: 'Montreal Protocol on Substances that Deplete the Ozone Layer (1987)' }),
];
