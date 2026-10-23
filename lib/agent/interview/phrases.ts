// lib/agent/interview/phrases.ts — server only. What the interviewer says around the questions:
// introductions, neutral acknowledgements, follow-ups and the closing, in English, French and
// Arabic. Acknowledgements stay neutral: the interviewer never praises or criticises an answer
// during the interview (the report does that). The interviewer's own lines avoid gendered
// self-references, because the candidate chooses the animated interviewer's look.

import type { FollowReason, IvDifficulty, IvLang, IvType } from "./types";

type Intro = (role: string, company: string | null, n: number) => string;

const at = (company: string | null, word: string) => (company ? ` ${word} ${company}` : "");

export const INTRO: Record<IvLang, Record<IvType, Intro>> = {
  en: {
    screening: (r, c, n) => `Hello, and thanks for making the time. I'm handling recruitment for the ${r} position${at(c, "at")}. This is a first conversation of about ${n} questions about your background and what you're looking for.`,
    professional: (r, c, n) => `Hello, and thanks for coming in. I'm the hiring manager for the ${r} role${at(c, "at")}. I'll ask you about ${n} questions on how you do the job. Answer as you would in a real interview.`,
    competency: (r, c, n) => `Hello. I'll be running this competency-based interview for the ${r} position${at(c, "at")}. I'll ask about ${n} questions about real situations you have handled, so please answer with specific examples.`,
    management: (r, c, n) => `Hello, and thanks for joining. I run operations${at(c, "at")}, and this interview is for the ${r} position. I'll ask about ${n} questions on how you lead people and run the operation.`,
    executive: (r, c, n) => `Hello, and thank you for your time. I'll be interviewing you for the ${r} position${at(c, "at")}. I'll ask about ${n} questions on strategy, results and leadership.`,
  },
  fr: {
    screening: (r, c, n) => `Bonjour, et merci d'avoir pris le temps. Je m'occupe du recrutement pour le poste de ${r}${at(c, "chez")}. C'est un premier échange d'environ ${n} questions sur votre parcours et ce que vous recherchez.`,
    professional: (r, c, n) => `Bonjour, et merci d'être là. Je suis responsable du recrutement pour le poste de ${r}${at(c, "chez")}. Je vais vous poser environ ${n} questions sur votre façon de faire ce métier. Répondez comme lors d'un vrai entretien.`,
    competency: (r, c, n) => `Bonjour. Je vais mener cet entretien par compétences pour le poste de ${r}${at(c, "chez")}. Je vais vous poser environ ${n} questions sur des situations réelles que vous avez vécues : répondez avec des exemples précis.`,
    management: (r, c, n) => `Bonjour, et merci d'être là. Je dirige les opérations${at(c, "chez")}, et cet entretien concerne le poste de ${r}. Je vais vous poser environ ${n} questions sur votre façon de diriger une équipe et de piloter l'activité.`,
    executive: (r, c, n) => `Bonjour, et merci pour votre temps. Je vais mener votre entretien pour le poste de ${r}${at(c, "chez")}. Je vais vous poser environ ${n} questions sur la stratégie, les résultats et le leadership.`,
  },
  ar: {
    screening: (r, c, n) => `مرحباً، وشكراً على وقتك. أتولّى التوظيف لوظيفة ${r}${at(c, "في")}. هذه محادثة أولى من نحو ${n} أسئلة حول خلفيتك وما تبحث عنه.`,
    professional: (r, c, n) => `مرحباً، وشكراً لحضورك. أتولّى التوظيف لوظيفة ${r}${at(c, "في")}. سأطرح عليك نحو ${n} أسئلة حول طريقة أدائك لهذا العمل. أجب كما لو كنت في مقابلة حقيقية.`,
    competency: (r, c, n) => `مرحباً. سأجري معك هذه المقابلة القائمة على الكفاءات لوظيفة ${r}${at(c, "في")}. سأطرح نحو ${n} أسئلة عن مواقف حقيقية مررت بها، فأجب بأمثلة محددة.`,
    management: (r, c, n) => `مرحباً، وشكراً لانضمامك. أتولّى إدارة العمليات${at(c, "في")}، وهذه المقابلة لوظيفة ${r}. سأطرح نحو ${n} أسئلة عن طريقتك في قيادة الفريق وإدارة العمل.`,
    executive: (r, c, n) => `مرحباً، وشكراً على وقتك. سأجري معك المقابلة لمنصب ${r}${at(c, "في")}. سأطرح نحو ${n} أسئلة عن الاستراتيجية والنتائج والقيادة.`,
  },
};

export const TONE: Record<IvLang, Record<IvDifficulty, string>> = {
  en: { friendly: " Take your time.", realistic: "", demanding: " I'll push for detail where I need it." },
  fr: { friendly: " Prenez votre temps.", realistic: "", demanding: " Je vous demanderai des précisions quand ce sera nécessaire." },
  ar: { friendly: " خذ وقتك.", realistic: "", demanding: " سأطلب منك تفاصيل أكثر حين يلزم." },
};

export const START: Record<IvLang, string> = { en: "Let's start.", fr: "Commençons.", ar: "لنبدأ." };

export const ACK: Record<IvLang, string[]> = {
  en: ["Thank you.", "Okay, thanks.", "Understood.", "Thanks for that.", "All right."],
  fr: ["Merci.", "D'accord, merci.", "Entendu.", "Merci pour cette réponse.", "Bien noté."],
  ar: ["شكراً لك.", "حسناً، شكراً.", "مفهوم.", "شكراً على إجابتك.", "حسناً."],
};

export const NEXT: Record<IvLang, string[]> = {
  en: ["Next question.", "Let's move on.", "Let's turn to something else.", ""],
  fr: ["Question suivante.", "Passons à autre chose.", "Changeons de sujet.", ""],
  ar: ["السؤال التالي.", "لننتقل إلى موضوع آخر.", "لننتقل.", ""],
};

/** Before a question that picks up a role term the candidate used earlier. */
export const CALLBACK: Record<IvLang, (term: string) => string> = {
  en: t => `You mentioned ${t} earlier.`,
  fr: t => `Vous avez parlé de ${t} tout à l'heure.`,
  ar: t => `جاء ذكر ${t} في إجابة سابقة.`,
};

/** Before a question asked again on purpose because it scored low in an earlier session. */
export const REPEAT: Record<IvLang, string> = {
  en: "This one came up in an earlier practice session, so let's try it again.",
  fr: "Cette question est déjà venue lors d'une séance précédente : réessayons.",
  ar: "طُرح هذا السؤال في جلسة تدريب سابقة، فلنجرّبه مجدداً.",
};

export const CLOSING: Record<IvLang, string[]> = {
  en: ["That's all my questions. Do you have any questions for me?", "We're nearly done. What would you like to ask me?"],
  fr: ["C'est tout pour mes questions. Avez-vous des questions à me poser ?", "Nous avons presque terminé. Qu'aimeriez-vous me demander ?"],
  ar: ["هذه كل أسئلتي. هل لديك أي أسئلة تودّ طرحها؟", "اقتربنا من النهاية. ما الذي تودّ أن تسألني عنه؟"],
};

export const CLOSING_COVERS: Record<IvLang, string[]> = {
  en: ["One or two genuine questions about the role, the team or what success looks like", "Questions that show you have researched the employer", "A short closing line about your interest in the role"],
  fr: ["Une ou deux vraies questions sur le poste, l'équipe ou ce qu'on attend de vous", "Des questions qui montrent que vous vous êtes renseigné sur l'employeur", "Une courte phrase de conclusion sur votre intérêt pour le poste"],
  ar: ["سؤال أو سؤالان حقيقيان عن الوظيفة أو الفريق أو معايير النجاح", "أسئلة تُظهر أنك بحثت عن جهة العمل", "جملة ختامية قصيرة عن اهتمامك بالوظيفة"],
};

export const END: Record<IvLang, { asked: string; plain: string }> = {
  en: {
    asked: "Thank you. Those are the kinds of questions to ask in the real interview; I can't answer them for the employer here. That's the end of the interview. Your report is being prepared.",
    plain: "Thank you for your time today. That's the end of the interview. Your report is being prepared.",
  },
  fr: {
    asked: "Merci. C'est le genre de questions à poser lors du vrai entretien ; je ne peux pas y répondre ici à la place de l'employeur. L'entretien est terminé. Votre rapport est en cours de préparation.",
    plain: "Merci pour votre temps. L'entretien est terminé. Votre rapport est en cours de préparation.",
  },
  ar: {
    asked: "شكراً لك. هذا النوع من الأسئلة مناسب لطرحه في المقابلة الحقيقية؛ لا يمكنني الإجابة عنه هنا نيابةً عن جهة العمل. انتهت المقابلة، ويجري الآن إعداد تقريرك.",
    plain: "شكراً لوقتك اليوم. انتهت المقابلة، ويجري الآن إعداد تقريرك.",
  },
};

/** Follow-ups by reason. "{quote}" is replaced by the candidate's own words. */
export const FOLLOW: Record<IvLang, Record<FollowReason | "scenario-example" | "no-figures-again", string[]>> = {
  en: {
    short: ["Could you tell me a bit more about that?", "Can you expand on that a little? Walk me through it.", "That's quite brief. Talk me through it in more detail."],
    example: ["Can you give me a specific example: one particular time this happened?", "Take me to a real situation. When did this last happen, and what did you do?", "What's a concrete example of that from your last job?"],
    "scenario-example": ["Have you dealt with this in real life? What happened?", "Has this happened to you before? Tell me about it."],
    result: ["How did it end? What was the result?", "What was the outcome of what you did?", "And what happened as a result?"],
    resolution: ["How was it resolved in the end?", "What did you do to put it right, and how did it end?"],
    figures: ["Can you put a number on that: a percentage, an amount, or how many?", "How did you measure it? Any figures you can share?", "What did that mean in numbers?"],
    ownership: ["You said {quote}. What did you personally do?", "What was your own part in that, as opposed to the team's?", "If I asked your manager what you did yourself, what would they say?"],
    vague: ["You described yourself as {quote}. Can you show me that with an example?", "{quote}: what does that look like in practice? Give me an example."],
    why: ["Why that approach rather than another?", "What would you weigh up before deciding?", "Walk me through your reasoning."],
    progress: ["What have you done about it since?", "How do you know you are improving? What has changed?"],
    probe: [],
    challenge: ["What would you do differently if it happened again?", "What did you learn from it that you still use today?", "Some would say that was a risk. Why was it the right call?", "What would your manager at the time say about how you handled it?"],
    "no-figures-again": ["Without a figure, how would your manager know it worked?"],
  },
  fr: {
    short: ["Pouvez-vous m'en dire un peu plus ?", "Pouvez-vous développer un peu ? Racontez-moi comment ça s'est passé.", "C'est assez bref : expliquez-moi plus en détail."],
    example: ["Pouvez-vous me donner un exemple précis, une fois où c'est arrivé ?", "Prenons une situation réelle : quand est-ce arrivé la dernière fois, et qu'avez-vous fait ?", "Quel est un exemple concret de cela dans votre dernier poste ?"],
    "scenario-example": ["Avez-vous déjà vécu cette situation ? Que s'est-il passé ?", "Est-ce déjà arrivé dans votre travail ? Racontez-moi."],
    result: ["Comment cela s'est-il terminé ? Quel a été le résultat ?", "Quel a été le résultat de votre action ?", "Et qu'est-ce que cela a donné ?"],
    resolution: ["Comment cela s'est-il réglé finalement ?", "Qu'avez-vous fait pour arranger la situation, et comment cela s'est-il terminé ?"],
    figures: ["Pouvez-vous chiffrer cela : un pourcentage, un montant, un nombre ?", "Comment l'avez-vous mesuré ? Avez-vous des chiffres ?", "Qu'est-ce que cela représentait en chiffres ?"],
    ownership: ["Vous avez dit {quote}. Qu'avez-vous fait, vous, personnellement ?", "Quelle a été votre part à vous, par rapport à celle de l'équipe ?", "Si je demandais à votre responsable ce que vous avez fait vous-même, que dirait-il ?"],
    vague: ["Vous avez utilisé ces mots pour vous décrire : {quote}. Pouvez-vous me le montrer avec un exemple ?", "{quote} : qu'est-ce que cela donne concrètement ? Donnez-moi un exemple."],
    why: ["Pourquoi cette approche plutôt qu'une autre ?", "Que prendriez-vous en compte avant de décider ?", "Expliquez-moi votre raisonnement."],
    progress: ["Qu'avez-vous fait depuis pour progresser ?", "Comment savez-vous que vous progressez ? Qu'est-ce qui a changé ?"],
    probe: [],
    challenge: ["Que feriez-vous différemment si cela se reproduisait ?", "Qu'en avez-vous appris que vous utilisez encore aujourd'hui ?", "Certains diraient que c'était risqué. Pourquoi était-ce la bonne décision ?", "Qu'aurait dit votre responsable de l'époque de la façon dont vous avez géré cela ?"],
    "no-figures-again": ["Sans chiffre, comment votre responsable saurait-il que cela a fonctionné ?"],
  },
  ar: {
    short: ["هل يمكنك أن تخبرني بالمزيد عن ذلك؟", "هل يمكنك التوسع قليلاً؟ اشرح لي كيف جرى الأمر.", "هذه إجابة مختصرة جداً، اشرح لي بتفصيل أكثر."],
    example: ["هل يمكنك أن تعطيني مثالاً محدداً، مرة بعينها حدث فيها ذلك؟", "لنأخذ موقفاً حقيقياً: متى حدث ذلك آخر مرة، وماذا فعلت؟", "ما مثال ملموس على ذلك من وظيفتك الأخيرة؟"],
    "scenario-example": ["هل واجهت هذا الموقف في الواقع؟ ماذا حدث؟", "هل حدث هذا معك من قبل؟ حدثني عنه."],
    result: ["كيف انتهى الأمر؟ ما النتيجة؟", "ما الذي نتج عمّا فعلته؟", "وماذا كانت النتيجة؟"],
    resolution: ["كيف حُلّت المسألة في النهاية؟", "ماذا فعلت لتصحيح الوضع، وكيف انتهى الأمر؟"],
    figures: ["هل يمكنك أن تعبّر عن ذلك برقم: نسبة مئوية أو مبلغ أو عدد؟", "كيف قِستَ ذلك؟ هل لديك أرقام؟", "ماذا يعني ذلك بالأرقام؟"],
    ownership: ["قلت: {quote}. ماذا فعلت أنت شخصياً؟", "ما دورك أنت تحديداً، مقارنةً بدور الفريق؟", "لو سألتُ مديرك عمّا فعلته بنفسك، ماذا سيقول؟"],
    vague: ["وصفت نفسك بهذه الكلمات: {quote}. هل يمكنك أن تبيّن ذلك بمثال؟", "{quote}: كيف يظهر ذلك عملياً؟ أعطني مثالاً."],
    why: ["لماذا هذا النهج دون غيره؟", "ما الذي ستأخذه في الحسبان قبل أن تقرر؟", "اشرح لي طريقة تفكيرك."],
    progress: ["ماذا فعلت حيال ذلك منذ ذلك الحين؟", "كيف تعرف أنك تتحسن؟ ما الذي تغيّر؟"],
    probe: [],
    challenge: ["ماذا كنت ستفعل بشكل مختلف لو تكرر ذلك؟", "ما الذي تعلمته من ذلك وما زلت تطبقه اليوم؟", "قد يقول البعض إن ذلك كان مخاطرة. لماذا كان القرار الصحيح؟", "ماذا كان سيقول مديرك آنذاك عن طريقة تعاملك مع الأمر؟"],
    "no-figures-again": ["من دون رقم، كيف سيعرف مديرك أن ذلك نجح؟"],
  },
};

export const QUOTE: Record<IvLang, (s: string) => string> = {
  en: s => `“${s}”`,
  fr: s => `« ${s} »`,
  ar: s => `«${s}»`,
};

// ── Questions built from the CV and the job listing ──────────────────────────

export const CV_Q: Record<IvLang, {
  achievement: (title: string, employer: string) => string;
  move: (from: string, to: string) => string;
  cert: (cert: string) => string;
  skill: (skill: string) => string;
  years: (n: number) => string;
  achievementCovers: string[];
  moveCovers: string[];
  certCovers: string[];
  skillCovers: string[];
  yearsCovers: string[];
}> = {
  en: {
    achievement: (t, e) => `In your role as ${t}${e ? ` at ${e}` : ""}, what was the achievement you are proudest of, and how did you measure it?`,
    move: (a, b) => `You moved from ${a} to ${b}. What made you make that move?`,
    cert: c => `Your CV mentions ${c}. How has it changed the way you work? Give me an example.`,
    skill: s => `Your CV mentions ${s}, and this role needs it. Tell me about the last time you used it under pressure.`,
    years: n => `You have about ${n} years of experience. What has changed most in the way you do the job since you started?`,
    achievementCovers: ["One specific achievement, not a list of duties", "What you did yourself", "How you measured it: a figure, feedback or a result"],
    moveCovers: ["A positive reason for the move", "What you gained from it", "How it leads to this role"],
    certCovers: ["What you learned", "A real situation where you applied it", "The difference it made"],
    skillCovers: ["A specific, recent example", "What made it a pressured situation", "The result"],
    yearsCovers: ["What you do differently now", "What taught you", "How it helps you in this role"],
  },
  fr: {
    achievement: (t, e) => `Dans votre poste de ${t}${e ? ` chez ${e}` : ""}, quelle a été votre plus belle réussite, et comment l'avez-vous mesurée ?`,
    move: (a, b) => `Pourquoi avoir quitté ${a} pour rejoindre ${b} ?`,
    cert: c => `Votre CV mentionne ${c}. Qu'est-ce que cela a changé dans votre façon de travailler ? Donnez-moi un exemple.`,
    skill: s => `Votre CV mentionne ${s}, et ce poste l'exige. Parlez-moi de la dernière fois que cette compétence vous a servi sous pression.`,
    years: n => `Vous avez environ ${n} ans d'expérience. Qu'est-ce qui a le plus changé dans votre façon de travailler depuis vos débuts ?`,
    achievementCovers: ["Une réussite précise, pas une liste de missions", "Ce que vous avez fait vous-même", "Comment vous l'avez mesurée : un chiffre, un retour, un résultat"],
    moveCovers: ["Une raison positive au changement", "Ce que vous y avez gagné", "En quoi cela mène à ce poste"],
    certCovers: ["Ce que vous avez appris", "Une situation réelle où vous l'avez appliqué", "La différence que cela a faite"],
    skillCovers: ["Un exemple précis et récent", "Ce qui rendait la situation tendue", "Le résultat"],
    yearsCovers: ["Ce que vous faites différemment aujourd'hui", "Ce qui vous l'a appris", "En quoi cela vous aide dans ce poste"],
  },
  ar: {
    achievement: (t, e) => `في عملك بوظيفة ${t}${e ? ` لدى ${e}` : ""}، ما الإنجاز الذي تفخر به أكثر، وكيف قِستَه؟`,
    move: (a, b) => `انتقلت من ${a} إلى ${b}. ما الذي دفعك إلى هذا الانتقال؟`,
    cert: c => `تذكر سيرتك الذاتية ${c}. كيف غيّر ذلك طريقة عملك؟ أعطني مثالاً.`,
    skill: s => `تذكر سيرتك الذاتية ${s}، وهذه الوظيفة تتطلبها. حدثني عن آخر مرة استخدمتها تحت الضغط.`,
    years: n => `لديك نحو ${n} سنوات من الخبرة. ما الذي تغيّر أكثر في طريقة أدائك لعملك منذ بدايتك؟`,
    achievementCovers: ["إنجاز محدد، لا قائمة بالمهام", "ما فعلته أنت بنفسك", "كيف قسته: رقم أو ملاحظات أو نتيجة"],
    moveCovers: ["سبب إيجابي للانتقال", "ما اكتسبته منه", "كيف يقود إلى هذه الوظيفة"],
    certCovers: ["ما تعلمته", "موقف حقيقي طبّقته فيه", "الفرق الذي أحدثه"],
    skillCovers: ["مثال محدد وحديث", "ما الذي جعل الموقف ضاغطاً", "النتيجة"],
    yearsCovers: ["ما تفعله بشكل مختلف الآن", "ما الذي علّمك ذلك", "كيف يساعدك ذلك في هذه الوظيفة"],
  },
};

export const JOB_Q: Record<IvLang, { ask: (req: string) => string; covers: string[] }> = {
  en: {
    ask: r => `This role asks for: ${QUOTE.en(r)}. Tell me about your experience with that.`,
    covers: ["A specific example that shows you meet it", "How much and how recently you have done it", "If you don't fully meet it, how you would close the gap"],
  },
  fr: {
    ask: r => `Ce poste demande : ${QUOTE.fr(r)}. Parlez-moi de votre expérience dans ce domaine.`,
    covers: ["Un exemple précis qui montre que vous y répondez", "Depuis combien de temps et à quelle fréquence vous le faites", "Si vous n'y répondez pas entièrement, comment vous combleriez l'écart"],
  },
  ar: {
    ask: r => `تتطلب هذه الوظيفة: ${QUOTE.ar(r)}. حدثني عن خبرتك في ذلك.`,
    covers: ["مثال محدد يُظهر أنك تستوفي ذلك", "كم من الوقت ومتى مارسته آخر مرة", "إن لم تستوفه بالكامل، كيف ستسد الفجوة"],
  },
};

/** Generic ideas a CV or job question should touch, for the relevance score. */
export const GENERIC_KEYS: Record<IvLang, string[]> = {
  en: ["achiev|result|improv|increas|reduc|award|proud|deliver", "measur|%|figure|number|feedback|target|score"],
  fr: ["reussi|resultat|amelior|augment|redui|recompense|fier|obtenu", "mesur|%|chiffre|nombre|retour|objectif|note"],
  ar: ["انجاز|نتيج|تحسين|زياد|خفض|جائز|فخور|حقق", "قياس|%|رقم|عدد|ملاحظ|هدف|تقييم"],
};
