// components/site/Faq.tsx — questions buyers ask before paying. Native <details>, so it works
// without JavaScript and with every assistive technology.
import React from "react";
import { MessageCircle } from "lucide-react";
import { PACKAGES } from "@/lib/packages";
import { pick, waLink, type L10n, type Lang } from "@/lib/site";

const gumroadLive = PACKAGES.some(p => p.gumroadUrl);

interface Item { id: string; q: L10n; a: L10n; link?: { href: string; label: L10n } }

const QA: Item[] = [
  {
    id: "after-pay",
    q: { en: "What happens after I pay?", fr: "Que se passe-t-il après le paiement ?", ar: "ماذا يحدث بعد الدفع؟" },
    a: {
      en: gumroadLive
        ? "Your payment is confirmed with the payment provider before anything is marked as paid. With PayPal, you then see your order reference and a link to a short form where you upload your CV and tell us your target roles. With Gumroad, your receipt has your order number and the same link. We start as soon as we have your brief."
        : "Your payment is confirmed with the payment provider before anything is marked as paid. You then see your order reference and a link to a short form where you upload your CV and tell us your target roles. We start as soon as we have your brief.",
      fr: gumroadLive
        ? "Votre paiement est confirmé auprès du prestataire avant d'être enregistré comme payé. Avec PayPal, vous voyez ensuite votre référence de commande et un lien vers un court formulaire pour envoyer votre CV et vos postes cibles. Avec Gumroad, votre reçu contient votre numéro de commande et le même lien. Nous commençons dès réception de votre brief."
        : "Votre paiement est confirmé auprès du prestataire avant d'être enregistré comme payé. Vous voyez ensuite votre référence de commande et un lien vers un court formulaire pour envoyer votre CV et vos postes cibles. Nous commençons dès réception de votre brief.",
      ar: gumroadLive
        ? "نتحقق من الدفع لدى مزوّد الدفع قبل اعتباره مدفوعاً. عند الدفع عبر PayPal ترى بعد ذلك رقم طلبك ورابطاً إلى نموذج قصير لرفع سيرتك وتحديد الوظائف المستهدفة، وعند الدفع عبر Gumroad يتضمن إيصالك رقم الطلب والرابط نفسه. نبدأ فور استلام معلوماتك."
        : "نتحقق من الدفع لدى مزوّد الدفع قبل اعتباره مدفوعاً. بعد ذلك ترى رقم طلبك ورابطاً إلى نموذج قصير لرفع سيرتك وتحديد الوظائف المستهدفة. نبدأ فور استلام معلوماتك.",
    },
  },
  {
    id: "speed",
    q: { en: "How quickly will I receive my CV?", fr: "Sous quel délai vais-je recevoir mon CV ?", ar: "متى أستلم سيرتي الذاتية؟" },
    a: {
      en: "The first draft arrives within 48 hours of receiving your complete brief. Language versions, LinkedIn work, applications and coaching follow on a schedule we agree with you.",
      fr: "Le premier jet arrive sous 48 heures après réception de votre brief complet. Les versions linguistiques, LinkedIn, les candidatures et le coaching suivent selon un calendrier convenu avec vous.",
      ar: "تصلك المسودة الأولى خلال 48 ساعة من استلام معلوماتك كاملة، ثم تتبعها النسخ اللغوية وملف لينكدإن وطلبات التوظيف والتدريب وفق جدول نتفق عليه معك.",
    },
  },
  {
    id: "revisions",
    q: { en: "How many revisions are included?", fr: "Combien de révisions sont incluses ?", ar: "كم عدد التعديلات المشمولة؟" },
    a: {
      en: "Unlimited revisions for 30 days after delivery, within the scope of your original brief. A change of direction, such as a completely different industry, may be quoted as new work.",
      fr: "Révisions illimitées pendant 30 jours après la livraison, dans le cadre de votre brief initial. Un changement d'orientation, par exemple un tout autre secteur, peut faire l'objet d'un nouveau devis.",
      ar: "تعديلات غير محدودة لمدة 30 يوماً بعد التسليم ضمن نطاق معلوماتك الأصلية. أما تغيير الاتجاه، كالانتقال إلى مجال مختلف تماماً، فقد يُسعَّر كعمل جديد.",
    },
  },
  {
    id: "guarantee",
    q: { en: "Do you guarantee interviews or a job?", fr: "Garantissez-vous des entretiens ou un emploi ?", ar: "هل تضمنون المقابلات أو الحصول على وظيفة؟" },
    a: {
      en: "No. We write to give you the strongest possible case, but interviews, offers and salaries are decided by employers, so no honest service can guarantee them.",
      fr: "Non. Nous écrivons pour défendre au mieux votre candidature, mais les entretiens, les offres et les salaires sont décidés par les employeurs : aucun service honnête ne peut les garantir.",
      ar: "لا. نكتب لنقدّم أقوى صورة ممكنة لك، لكن المقابلات والعروض والرواتب يقررها أصحاب العمل، ولا يمكن لأي خدمة نزيهة أن تضمنها.",
    },
  },
  {
    id: "ats",
    q: { en: "Will my CV work with applicant tracking systems (ATS)?", fr: "Mon CV passera-t-il les logiciels de recrutement (ATS) ?", ar: "هل ستعمل سيرتي مع أنظمة تتبّع المتقدمين؟" },
    a: {
      en: "We write and format for them: real text, standard headings, and keywords from the roles you target, with a single-column version for online portals. Every system is configured differently, so we don't promise how a particular one will score you.",
      fr: "Nous rédigeons et mettons en forme pour eux : vrai texte, titres standard, mots-clés des postes visés, et une version en une colonne pour les portails. Chaque système étant paramétré différemment, nous ne promettons pas la note qu'il vous attribuera.",
      ar: "نكتب وننسّق مع مراعاتها: نص حقيقي وعناوين قياسية وكلمات مفتاحية من الوظائف المستهدفة، مع نسخة بعمود واحد لبوابات التوظيف. ولأن كل نظام مُعدّ بطريقة مختلفة، لا نعد بتقييم معيّن من أي نظام.",
    },
  },
  {
    id: "applications",
    q: { en: "How are the job applications handled?", fr: "Comment les candidatures sont-elles gérées ?", ar: "كيف تتم إدارة طلبات التوظيف؟" },
    a: {
      en: "We agree the target roles with you from your brief, tailor each application, and submit it for you where the employer accepts applications that way. Anything that needs your own login, an assessment or a security check comes back to you.",
      fr: "Nous définissons avec vous les postes cibles à partir de votre brief, adaptons chaque candidature et l'envoyons pour vous lorsque l'employeur accepte ce mode de candidature. Tout ce qui exige votre propre compte, un test ou une vérification de sécurité vous est renvoyé.",
      ar: "نتفق معك على الوظائف المستهدفة من معلوماتك، ونخصّص كل طلب ونقدّمه نيابةً عنك حيث يقبل صاحب العمل ذلك. وأي خطوة تتطلب حسابك الخاص أو اختباراً أو تحققاً أمنياً نعيدها إليك.",
    },
  },
  {
    id: "pay",
    q: { en: "How can I pay?", fr: "Comment puis-je payer ?", ar: "كيف يمكنني الدفع؟" },
    a: gumroadLive
      ? {
          en: "With PayPal, using your PayPal balance or a card where PayPal offers card checkout, charged in US dollars at the official AED rate. Or use the Gumroad checkout under each package, at the same US dollar price: Gumroad takes major cards, and shows Apple Pay or Google Pay on devices and browsers that support them. Gumroad may add sales tax or VAT where it applies.",
          fr: "Avec PayPal, par solde PayPal ou carte lorsque PayPal le propose, débité en dollars US au taux officiel du dirham. Ou utilisez le paiement Gumroad sous chaque formule, au même prix en dollars US : Gumroad accepte les principales cartes et affiche Apple Pay ou Google Pay sur les appareils et navigateurs compatibles. Gumroad peut ajouter la TVA lorsqu'elle s'applique.",
          ar: "عبر PayPal برصيدك أو ببطاقة حيث يتيح PayPal ذلك، ويُخصم المبلغ بالدولار الأمريكي وفق السعر الرسمي للدرهم. أو استخدم الدفع عبر Gumroad أسفل كل باقة بالسعر نفسه بالدولار الأمريكي: يقبل Gumroad البطاقات الرئيسية ويعرض Apple Pay أو Google Pay على الأجهزة والمتصفحات التي تدعمهما. وقد يضيف Gumroad ضريبة المبيعات أو القيمة المضافة حيث تنطبق.",
        }
      : {
          en: "With PayPal, using your PayPal balance or a card where PayPal offers card checkout. Amounts are charged in US dollars at the official AED rate. Apple Pay and Google Pay aren't available on this site yet.",
          fr: "Avec PayPal, par solde PayPal ou carte lorsque PayPal le propose. Les montants sont débités en dollars US au taux officiel du dirham. Apple Pay et Google Pay ne sont pas encore disponibles sur ce site.",
          ar: "عبر PayPal برصيدك أو ببطاقة حيث يتيح PayPal ذلك. تُخصم المبالغ بالدولار الأمريكي وفق السعر الرسمي للدرهم. خدمتا Apple Pay وGoogle Pay غير متاحتين على الموقع بعد.",
        },
  },
  {
    id: "refund",
    q: { en: "What is your refund policy?", fr: "Quelle est votre politique de remboursement ?", ar: "ما هي سياسة الاسترداد؟" },
    a: {
      en: "You can ask for a full refund within 7 days of purchase. Refunds go back to the original payment method.",
      fr: "Vous pouvez demander un remboursement intégral dans les 7 jours suivant l'achat. Il est versé sur le moyen de paiement d'origine.",
      ar: "يمكنك طلب استرداد كامل خلال 7 أيام من الشراء، ويُعاد المبلغ إلى وسيلة الدفع الأصلية.",
    },
    link: { href: "/refund/", label: { en: "Read the refund policy", fr: "Lire la politique de remboursement", ar: "اقرأ سياسة الاسترداد" } },
  },
  {
    id: "ebook",
    q: { en: "How do I receive The Global Horizon ebook?", fr: "Comment recevoir l'ebook The Global Horizon ?", ar: "كيف أستلم كتاب The Global Horizon؟" },
    a: {
      en: "It is included with Career Advantage, Career Automation and Executive Career Suite. Paid through Gumroad, you can download it straight after payment; paid through PayPal, we email you the PDF once your payment is confirmed.",
      fr: "Il est inclus dans Avantage Carrière, Carrière Automatisée et Suite Carrière Exécutive. Via Gumroad, vous le téléchargez dès le paiement ; via PayPal, nous vous envoyons le PDF par e-mail une fois le paiement confirmé.",
      ar: "الكتاب مشمول في الميزة المهنية وأتمتة المسار المهني والباقة التنفيذية المتكاملة. عند الدفع عبر Gumroad تنزّله فور الدفع، وعند الدفع عبر PayPal نرسل إليك ملف PDF بالبريد بعد تأكيد الدفع.",
    },
  },
  {
    id: "agent",
    q: { en: "What is the Zenith AI job agent, and what does it do?", fr: "Qu'est-ce que l'agent emploi Zenith AI, et que fait-il ?", ar: "ما هو وكيل الوظائف Zenith AI، وماذا يفعل؟" },
    a: {
      en: "It is a working tool at zenithdubaicv.com/agent. Anyone can use it free to search public job sources, rank listings against their CV, build template drafts and track applications with follow-up reminders; your CV stays in your browser. Career Automation and Executive Career Suite add Pro access: Zenith emails the applications you approve, with replies going to you. The agent never applies on job boards or employer portals for you, and nothing is sent without your approval.",
      fr: "C'est un outil en service sur zenithdubaicv.com/agent. Chacun peut l'utiliser gratuitement pour interroger des sources d'offres publiques, classer les annonces selon son CV, créer des brouillons modèles et suivre ses candidatures avec des rappels de relance ; votre CV reste dans votre navigateur. Carrière Automatisée et Suite Carrière Exécutive ajoutent l'accès Pro : Zenith envoie par e-mail les candidatures que vous validez, les réponses vous parvenant directement. L'agent ne postule jamais pour vous sur les sites d'emploi ou les portails employeurs, et rien n'est envoyé sans votre accord.",
      ar: "أداة تعمل فعلاً على zenithdubaicv.com/agent. يمكن لأي شخص استخدامها مجاناً للبحث في مصادر وظائف عامة، وترتيب الإعلانات حسب سيرته الذاتية، وإنشاء مسودات جاهزة، ومتابعة الطلبات مع تذكيرات؛ وتبقى سيرتك في متصفحك. وتضيف باقتا أتمتة المسار المهني والباقة التنفيذية المتكاملة وصول Pro: ترسل Zenith بالبريد الطلبات التي توافق عليها، مع وصول الردود إليك. لا يقدّم الوكيل أبداً نيابةً عنك في مواقع التوظيف أو بوابات أصحاب العمل، ولا يُرسل شيء دون موافقتك.",
    },
  },
  {
    id: "ai-drafts",
    q: { en: "Does the agent use AI to write my applications?", fr: "L'agent utilise-t-il l'IA pour rédiger mes candidatures ?", ar: "هل يستخدم الوكيل الذكاء الاصطناعي لكتابة طلباتي؟" },
    a: {
      en: "Pro includes AI-tailored drafts once they are switched on; the agent shows whether they are on. Each AI highlight must quote the CV line it comes from, and figures or skills your CV doesn't show are flagged for you to remove. To write a draft, your CV text (without your email or phone number) and the listing are sent to Anthropic, the AI provider, which deletes them within 30 days. Free drafts are built from your own CV lines without AI.",
      fr: "Pro inclut des brouillons adaptés par IA dès qu'ils sont activés ; l'agent indique s'ils le sont. Chaque point fort rédigé par l'IA doit citer la ligne du CV dont il vient, et les chiffres ou compétences absents de votre CV vous sont signalés pour que vous les retiriez. Pour rédiger un brouillon, le texte de votre CV (sans votre e-mail ni votre téléphone) et l'offre sont envoyés à Anthropic, le fournisseur d'IA, qui les supprime sous 30 jours. Les brouillons gratuits sont bâtis sur vos propres lignes de CV, sans IA.",
      ar: "يشمل Pro مسودات مكيّفة بالذكاء الاصطناعي عند تفعيلها، ويوضح الوكيل إن كانت مفعّلة. يجب أن تقتبس كل نقطة يكتبها الذكاء الاصطناعي السطر الذي جاءت منه في سيرتك، ويُنبَّه إلى أي رقم أو مهارة لا تُظهرها سيرتك لتحذفها. ولكتابة المسودة يُرسل نص سيرتك (دون بريدك أو هاتفك) والإعلان إلى Anthropic، مزوّد الذكاء الاصطناعي، التي تحذفهما خلال 30 يوماً. أما المسودات المجانية فتُبنى من أسطر سيرتك دون ذكاء اصطناعي.",
    },
  },
  {
    id: "privacy",
    q: { en: "Is my information kept confidential?", fr: "Mes informations restent-elles confidentielles ?", ar: "هل تبقى معلوماتي سرية؟" },
    a: {
      en: "Yes. Your CV and details are used only to deliver your order, and are shared only with the services that run it, such as our email provider and the payment provider. We never publish client documents, and you can ask us to delete your data at any time.",
      fr: "Oui. Votre CV et vos informations servent uniquement à exécuter votre commande et ne sont partagés qu'avec les services nécessaires, comme notre messagerie et le prestataire de paiement. Nous ne publions jamais de documents clients et vous pouvez demander la suppression de vos données à tout moment.",
      ar: "نعم. نستخدم سيرتك ومعلوماتك فقط لتنفيذ طلبك، ولا نشاركها إلا مع الخدمات اللازمة لذلك مثل مزوّد البريد ومزوّد الدفع. لا ننشر وثائق العملاء أبداً، ويمكنك طلب حذف بياناتك في أي وقت.",
    },
    link: { href: "/privacy/", label: { en: "Read the privacy policy", fr: "Lire la politique de confidentialité", ar: "اقرأ سياسة الخصوصية" } },
  },
  {
    id: "languages",
    q: { en: "Which languages do you work in?", fr: "Dans quelles langues travaillez-vous ?", ar: "ما اللغات التي تعملون بها؟" },
    a: {
      en: "English, French and Arabic. Career Automation and Executive Career Suite also include versions of your CV in other languages (EN, FR, DE, AR, ES).",
      fr: "Français, anglais et arabe. Carrière Automatisée et Suite Carrière Exécutive incluent aussi des versions de votre CV dans d'autres langues (EN, FR, DE, AR, ES).",
      ar: "العربية والإنجليزية والفرنسية. وتشمل باقتا أتمتة المسار المهني والباقة التنفيذية المتكاملة نسخاً من سيرتك بلغات أخرى (EN، FR، DE، AR، ES).",
    },
  },
];

// Added in phase 2: the questions buyers asked most that the list above didn't answer. Each one
// restates what the packages, the X-Ray and the agent already do; no new promises or numbers.
const MORE: Item[] = [
  {
    id: "who-writes",
    q: { en: "Who writes my CV?", fr: "Qui rédige mon CV ?", ar: "من يكتب سيرتي الذاتية؟" },
    a: {
      en: "A career specialist writes it from your real experience, using the brief you fill in after payment: your current CV, the roles you're aiming for and anything else we should know. Executive Career Suite adds a dedicated consultant through your search.",
      fr: "Un spécialiste carrière le rédige à partir de votre parcours réel, grâce au brief que vous remplissez après le paiement : votre CV actuel, les postes visés et tout ce que nous devons savoir. La Suite Carrière Exécutive ajoute un consultant dédié pendant votre recherche.",
      ar: "يكتبها مختص في المسارات المهنية من خبرتك الحقيقية، اعتماداً على المعلومات التي تملؤها بعد الدفع: سيرتك الحالية، والوظائف التي تستهدفها، وأي شيء آخر ينبغي أن نعرفه. وتضيف الباقة التنفيذية المتكاملة مستشاراً مخصّصاً طوال فترة بحثك.",
    },
  },
  {
    id: "real-experience",
    q: { en: "Will you add experience or results I don't have?", fr: "Allez-vous ajouter des expériences ou des résultats que je n'ai pas ?", ar: "هل ستضيفون خبرات أو نتائج لا أملكها؟" },
    a: {
      en: "No. Everything in your CV comes from your real experience. We help you put your results into words, and any figure in it comes from you. An invented detail can cost you the job at interview or in a background check.",
      fr: "Non. Tout ce qui figure dans votre CV vient de votre parcours réel. Nous vous aidons à formuler vos résultats, et chaque chiffre vient de vous. Un détail inventé peut vous coûter le poste en entretien ou lors d'une vérification d'antécédents.",
      ar: "لا. كل ما في سيرتك يأتي من خبرتك الحقيقية. نساعدك على صياغة نتائجك، وكل رقم فيها مصدره أنت. فالتفصيل المختلَق قد يكلّفك الوظيفة في المقابلة أو عند التحقق من خلفيتك.",
    },
  },
  {
    id: "unhappy",
    q: { en: "What if I'm not happy with my CV?", fr: "Et si mon CV ne me convient pas ?", ar: "ماذا لو لم تعجبني سيرتي الذاتية؟" },
    a: {
      en: "Tell us what isn't right and we revise it: revisions are unlimited for 30 days after delivery, within your original brief. You can also ask for a full refund within 7 days of purchase.",
      fr: "Dites-nous ce qui ne va pas et nous le révisons : les révisions sont illimitées pendant 30 jours après la livraison, dans le cadre de votre brief initial. Vous pouvez aussi demander un remboursement intégral dans les 7 jours suivant l'achat.",
      ar: "أخبرنا بما لا يناسبك وسنعدّله: التعديلات غير محدودة لمدة 30 يوماً بعد التسليم ضمن نطاق معلوماتك الأصلية. ويمكنك أيضاً طلب استرداد كامل خلال 7 أيام من الشراء.",
    },
    link: { href: "/refund/", label: { en: "Read the refund policy", fr: "Lire la politique de remboursement", ar: "اقرأ سياسة الاسترداد" } },
  },
  {
    id: "xray",
    q: { en: "How does the free CV X-Ray work?", fr: "Comment fonctionne la radiographie de CV gratuite ?", ar: "كيف يعمل فحص السيرة المجاني؟" },
    a: {
      en: "Add your CV as a PDF or Word file (up to 5 MB) and, if you like, your target role and a job ad. It is read in your browser, never uploaded or stored, and checked in seven areas: readability for tracking systems, structure, keywords, positioning, formatting, achievements and fit with the role. It is an automated check with fixed rules, not an official ATS score.",
      fr: "Ajoutez votre CV en PDF ou Word (5 Mo maximum) et, si vous le souhaitez, le poste visé et une offre d'emploi. Il est lu dans votre navigateur, jamais envoyé ni conservé, et vérifié sur sept points : lisibilité par les logiciels de recrutement, structure, mots-clés, positionnement, mise en forme, réalisations et adéquation au poste. C'est une vérification automatique à règles fixes, pas un score ATS officiel.",
      ar: "أضف سيرتك بصيغة PDF أو Word (حتى 5 ميغابايت)، ويمكنك إضافة الوظيفة المستهدفة وإعلان وظيفة. تُقرأ داخل متصفحك، ولا تُرفع أو تُحفظ أبداً، وتُفحص في سبعة جوانب: قابلية القراءة لأنظمة التتبّع، والبنية، والكلمات المفتاحية، والتموضع، والتنسيق، والإنجازات، والتوافق مع الوظيفة. إنه فحص آلي بقواعد ثابتة، وليس تقييماً رسمياً من أي نظام.",
    },
    link: { href: "/x-ray/", label: { en: "Run the free X-Ray", fr: "Lancer la radiographie gratuite", ar: "ابدأ الفحص المجاني" } },
  },
  {
    id: "sources",
    q: { en: "Where does the agent find jobs?", fr: "Où l'agent trouve-t-il les offres ?", ar: "من أين يجد الوكيل الوظائف؟" },
    a: {
      en: "In public job sources that allow it: Workable's job board (on-site and remote jobs worldwide, including the Gulf), Himalayas, Jobicy, Remotive and Arbeitnow, each linked to the original listing. LinkedIn, Indeed, Bayt and GulfTalent have no open API, so the agent opens the same search there, and you can add any listing by hand.",
      fr: "Dans des sources d'offres publiques qui l'autorisent : le site d'emploi de Workable (offres sur site et à distance dans le monde entier, Golfe compris), Himalayas, Jobicy, Remotive et Arbeitnow, chaque offre renvoyant à l'annonce d'origine. LinkedIn, Indeed, Bayt et GulfTalent n'ont pas d'API ouverte : l'agent y ouvre la même recherche, et vous pouvez ajouter n'importe quelle offre à la main.",
      ar: "في مصادر وظائف عامة تسمح بذلك: لوحة وظائف Workable (وظائف حضورية وعن بُعد حول العالم، بما فيها الخليج)، وHimalayas وJobicy وRemotive وArbeitnow، مع رابط إلى الإعلان الأصلي لكل وظيفة. أما LinkedIn وIndeed وBayt وGulfTalent فليست لديها واجهة برمجة مفتوحة، لذا يفتح الوكيل البحث نفسه هناك، ويمكنك إضافة أي إعلان يدوياً.",
    },
  },
  {
    id: "assessments",
    q: { en: "Will you complete online assessments or interviews for me?", fr: "Passerez-vous des tests en ligne ou des entretiens à ma place ?", ar: "هل ستجرون الاختبارات الإلكترونية أو المقابلات بدلاً مني؟" },
    a: {
      en: "No. Assessments, tests, video interviews and sign-ups on employer portals have to be done by you: doing them in your place would misrepresent you to the employer. The interview coach helps you prepare for interviews.",
      fr: "Non. Les tests, évaluations, entretiens vidéo et inscriptions sur les portails employeurs doivent être faits par vous : les faire à votre place tromperait l'employeur sur votre candidature. Le coach d'entretien vous aide à vous préparer aux entretiens.",
      ar: "لا. الاختبارات والتقييمات ومقابلات الفيديو والتسجيل في بوابات أصحاب العمل يجب أن تقوم بها بنفسك، فأداؤها نيابةً عنك تضليل لصاحب العمل. ويساعدك مدرّب المقابلات على الاستعداد للمقابلات.",
    },
  },
  {
    id: "coach",
    q: { en: "How does the interview coach work? Is the interviewer a real person?", fr: "Comment fonctionne le coach d'entretien ? Le recruteur est-il une vraie personne ?", ar: "كيف يعمل مدرّب المقابلات؟ وهل المحاور شخص حقيقي؟" },
    a: {
      en: "The interviewer is animated, not a real person. It asks questions for your role in English, French or Arabic, and you answer by voice or by typing. It follows up when an answer is missing an example, a result or your own part, then scores your answers on eight criteria and gives you an action plan. Scoring uses fixed rules on the words of your answers: it doesn't judge your voice, accent or face, and it can't predict an employer's decision. Included with Career Advantage, Career Automation and Executive Career Suite.",
      fr: "Le recruteur est animé, ce n'est pas une vraie personne. Il pose des questions adaptées à votre poste en anglais, français ou arabe, et vous répondez à voix haute ou par écrit. Il relance quand une réponse manque d'exemple, de résultat ou de votre rôle personnel, puis note vos réponses sur huit critères et vous donne un plan d'action. La note suit des règles fixes appliquées aux mots de vos réponses : elle ne juge ni votre voix, ni votre accent, ni votre visage, et ne peut pas prédire la décision d'un employeur. Inclus avec Avantage Carrière, Carrière Automatisée et Suite Carrière Exécutive.",
      ar: "المحاور شخصية متحرّكة وليس شخصاً حقيقياً. يطرح أسئلة تخص وظيفتك بالعربية أو الإنجليزية أو الفرنسية، وتجيب بصوتك أو بالكتابة. ويتابع حين تفتقر الإجابة إلى مثال أو نتيجة أو دورك الشخصي، ثم يقيّم إجاباتك وفق ثمانية معايير ويقدّم لك خطة عمل. يعتمد التقييم على قواعد ثابتة تُطبَّق على كلمات إجاباتك: لا يحكم على صوتك أو لهجتك أو وجهك، ولا يمكنه توقّع قرار صاحب العمل. مشمول مع الميزة المهنية وأتمتة المسار المهني والباقة التنفيذية المتكاملة.",
    },
    link: { href: "/agent/#interview", label: { en: "See the interview coach", fr: "Voir le coach d'entretien", ar: "اطّلع على مدرّب المقابلات" } },
  },
  {
    id: "websites",
    q: { en: "Do you also build websites?", fr: "Créez-vous aussi des sites web ?", ar: "هل تصممون مواقع إلكترونية أيضاً؟" },
    a: {
      en: "Yes: personal portfolio websites for professionals, and complete websites for businesses and brands. Choose your field in the websites section, send us the details, and we reply with a quote and a timeline.",
      fr: "Oui : des sites portfolio personnels pour les professionnels, et des sites complets pour les entreprises et les marques. Choisissez votre secteur dans la section sites web, envoyez-nous les détails : nous répondons avec un devis et un délai.",
      ar: "نعم: مواقع تعريفية شخصية للمهنيين، ومواقع متكاملة للشركات والعلامات التجارية. اختر مجالك في قسم المواقع، وأرسل لنا التفاصيل، وسنرد بعرض سعر وجدول زمني.",
    },
    link: { href: "#websites", label: { en: "See the websites", fr: "Voir les sites", ar: "اطّلع على المواقع" } },
  },
];

const BY_ID = new Map([...QA, ...MORE].map(x => [x.id, x]));
const GROUPS: { key: string; title: L10n; ids: string[] }[] = [
  {
    key: "cv",
    title: { en: "Your CV", fr: "Votre CV", ar: "سيرتك الذاتية" },
    ids: ["who-writes", "real-experience", "speed", "revisions", "unhappy", "ats", "languages", "guarantee"],
  },
  {
    key: "tools",
    title: { en: "The free X-Ray and the AI job agent", fr: "La radiographie gratuite et l'agent IA", ar: "الفحص المجاني ووكيل الوظائف" },
    ids: ["xray", "agent", "sources", "ai-drafts", "applications", "assessments", "coach"],
  },
  {
    key: "order",
    title: { en: "Ordering, privacy and more", fr: "Commande, confidentialité et plus", ar: "الطلب والخصوصية والمزيد" },
    ids: ["after-pay", "pay", "refund", "ebook", "privacy", "websites"],
  },
];

const H2: L10n = { en: "Questions before you buy", fr: "Vos questions avant l'achat", ar: "أسئلة قبل الشراء" };
const LEDE: L10n = {
  en: "Straight answers about the service, the free tools and paying. Still unsure? Ask us directly.",
  fr: "Des réponses claires sur le service, les outils gratuits et le paiement. Un doute ? Posez-nous la question.",
  ar: "إجابات واضحة عن الخدمة والأدوات المجانية والدفع. ما زلت متردداً؟ اسألنا مباشرة.",
};
const ASK: L10n = { en: "Ask us on WhatsApp", fr: "Nous écrire sur WhatsApp", ar: "اسألنا عبر واتساب" };
const ASK_TEXT: L10n = {
  en: "Hello Zenith Dubai CV, I have a question before I buy:",
  fr: "Bonjour Zenith Dubai CV, j'ai une question avant d'acheter :",
  ar: "مرحباً Zenith Dubai CV، لدي سؤال قبل الشراء:",
};

export default function Faq({ lang }: { lang: Lang }) {
  return (
    <section id="faq" className="z-section" aria-labelledby="faq-title">
      <style href="zenith-faq" precedence="medium">{CSS}</style>
      <div className="z-wrap faq-grid">
        <div className="faq-side">
          <h2 id="faq-title" className="z-h2">{pick(H2, lang)}</h2>
          <p className="z-body faq-lede">{pick(LEDE, lang)}</p>
          <a className="z-btn z-btn-quiet z-btn-small" href={waLink(pick(ASK_TEXT, lang))} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={16} aria-hidden /> {pick(ASK, lang)}
          </a>
        </div>
        <div className="faq-groups">
          {GROUPS.map(g => (
            <div key={g.key} className="faq-group">
              <h3 className="faq-group-title" id={`faq-${g.key}`}>{pick(g.title, lang)}</h3>
              <div className="faq-list">
                {g.ids.map(id => BY_ID.get(id)).filter((x): x is Item => !!x).map(item => (
                  <details key={item.id} id={`faq-q-${item.id}`} className="faq-item z-details">
                    <summary>
                      <span>{pick(item.q, lang)}</span>
                      <span className="faq-mark" aria-hidden="true" />
                    </summary>
                    <div className="faq-a">
                      <p>{pick(item.a, lang)}</p>
                      {item.link && <p style={{ marginTop: 10 }}><a className="z-link" href={item.link.href}>{pick(item.link.label, lang)}</a></p>}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const CSS = `
.faq-grid{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.4fr);gap:clamp(28px,5vw,80px);align-items:start}
.faq-side{position:sticky;top:110px;display:grid;justify-items:start;gap:18px}
.faq-lede{max-width:36ch}
@media (max-width:900px){.faq-grid{grid-template-columns:1fr}.faq-side{position:static}}
.faq-groups{display:grid;gap:clamp(36px,5vw,56px)}
.faq-group-title{font-size:13px;letter-spacing:.14em;text-transform:uppercase;font-weight:500;color:var(--z-gold-text);margin-bottom:6px}
[dir="rtl"] .faq-group-title{letter-spacing:0;text-transform:none;font-size:15px}
.faq-list{border-top:1px solid var(--z-rule)}
.faq-item{border-bottom:1px solid var(--z-rule)}
.faq-item summary{display:flex;justify-content:space-between;align-items:center;gap:20px;padding:20px 0;font-size:17px;font-weight:500;line-height:1.45;color:var(--z-fg)}
.faq-mark{position:relative;flex:none;width:14px;height:14px}
.faq-mark::before,.faq-mark::after{content:"";position:absolute;inset:6px 0 auto;height:2px;background:var(--z-gold-text);transition:transform .25s}
.faq-mark::after{transform:rotate(90deg)}
.faq-item[open] .faq-mark::after{transform:rotate(0)}
.faq-a{padding:0 0 22px;max-width:64ch;color:var(--z-fg-2);font-size:16px;line-height:1.7}
@media (prefers-reduced-motion:reduce){.faq-mark::before,.faq-mark::after{transition:none}}
`;
