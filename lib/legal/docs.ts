// lib/legal/docs.ts — the privacy policy, terms of service and refund policy, in English, French and Arabic.
// Generated from the previous pages' wording, with the sections about payments, the AI job agent and data handling
// rewritten to match how the site works. Edit here; app/privacy, app/terms and app/refund only render it.

import type { Lang } from "@/lib/site";

export interface LegalSection { id: string; title: string; body: string[] }
export interface LegalDoc { title: string; updated: string; intro: string; highlight?: string; sections: LegalSection[] }

export const PRIVACY: Record<Lang, LegalDoc> = {
  "en": {
    "title": "Privacy Policy",
    "updated": "Last updated: 23 October 2026",
    "intro": "This policy explains what Zenith Dubai CV (“Zenith”, “we”) collects when you use zenithdubaicv.com, our services and the Zenith AI job agent, why we collect it, who processes it for us, and how to have it corrected or deleted.",
    "sections": [
      {
        "id": "01",
        "title": "Information we collect",
        "body": [
          "Enquiries: when you use the contact form or write to us, we receive your email address, your message and any files you attach, such as a CV or a photo.",
          "Orders: when you pay through PayPal, PayPal tells us your name, email address, what you bought and whether the payment completed. When you pay through Gumroad, Gumroad tells us your email address and your order. We never receive or store your card details.",
          "Your brief: after a purchase, the brief form sends us your name, email address, optional WhatsApp number, target roles and places, CV languages, notes, your CV file and an optional photo, as an email to our mailbox.",
          "Server logs: our hosting provider keeps standard request logs, such as IP address, time and page requested, for security and operations."
        ]
      },
      {
        "id": "02",
        "title": "The Zenith AI job agent",
        "body": [
          "Your agent profile, CV text and the CV file you upload, saved jobs, drafts, applications and notes are stored in your own browser (IndexedDB), not on our servers. Your CV is read on your device: the details the agent finds in it (contacts, work history, education, languages) are shown to you to check and are only added to your profile when you choose. You can export or delete all of this at any time in the agent's “Your data” section.",
          "When you search, your browser sends our server only your target roles, countries and work type. Our server asks the job sources and returns the listings; it does not store your search.",
          "When you ask for an AI draft (Pro), your CV text with email addresses and phone numbers removed, your name, headline, target roles, languages, listed skills and the job listing are sent through our server to Anthropic, which writes the draft. Zenith does not store them. Anthropic deletes API inputs and outputs within 30 days, unless it must keep them longer to enforce its usage policy or to comply with the law, and does not use them to train its models.",
          "When you ask Zenith to email an application (Pro), the message and the CV file you attach pass through our mailbox's mail server to the employer, with a copy to you. Zenith does not keep a copy.",
          "If you enter a PayPal order number or a Gumroad license key, it is kept in your browser and checked with PayPal or Gumroad when you use Pro features. Our server keeps only a count of the AI drafts and emails used, stored against a one-way code derived from it, never the order number or key itself."
        ]
      },
      {
        "id": "03",
        "title": "How we use your information",
        "body": [
          "We use your information only to answer your enquiries, deliver and support the services you buy, confirm payments, send your documents, and run the agent features you choose to use.",
          "We do not use your personal information for marketing purposes without your explicit consent. We do not sell, rent, or share your information with third parties for commercial purposes under any circumstances."
        ]
      },
      {
        "id": "04",
        "title": "Who processes it for us",
        "body": [
          "We share personal data only with the services that run this site and your order: Vercel (hosting), GoDaddy (email), PayPal and Gumroad (payments; Gumroad sells digital products as merchant of record and handles their delivery), and Anthropic (AI drafting, only when you use it).",
          "Job sources (Workable, Himalayas, Jobicy, Remotive and Arbeitnow, and Jooble or Adzuna if we connect them) receive only search terms from our server, never your CV or contact details. To show prices in other currencies, your browser requests exchange rates from open.er-api.com.",
          "We may disclose your information if required by applicable law or a valid legal process. In such cases, we will notify you to the extent permitted by law."
        ]
      },
      {
        "id": "05",
        "title": "Data Security",
        "body": [
          "We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction. Access to your information is limited to team members directly involved in delivering your service.",
          "While we take every reasonable precaution to safeguard your data, no method of transmission over the internet is entirely secure. We encourage you to contact us via our secure form or WhatsApp for sensitive communications."
        ]
      },
      {
        "id": "06",
        "title": "Cookies and browser storage",
        "body": [
          "We use no advertising or analytics cookies and no third-party behavioural trackers.",
          "Your browser stores your theme, language and currency choices (localStorage) and, if you use the agent, your agent data (IndexedDB). This stays on your device and is not sent to us."
        ]
      },
      {
        "id": "07",
        "title": "Your Rights",
        "body": [
          "You have the right to access the personal information we hold about you, request correction of inaccurate data, request deletion of your data, withdraw consent for any processing based on consent, and lodge a complaint with a relevant data protection authority.",
          "To exercise any of these rights, please contact us at info@zenithdubaicv.com. We will respond to all legitimate requests within 30 days."
        ]
      },
      {
        "id": "08",
        "title": "Data retention",
        "body": [
          "We retain your information for the duration of your engagement with us and for a reasonable period thereafter for record-keeping, legal, and quality assurance purposes. Files and correspondence are not retained indefinitely.",
          "You may request deletion of your personal data at any time by contacting us at info@zenithdubaicv.com. We will process deletion requests promptly, subject to any legal obligations to retain certain records.",
          "Agent data stays in your browser until you delete it. PayPal and Gumroad also keep payment records under their own policies."
        ]
      },
      {
        "id": "09",
        "title": "International data transfers",
        "body": [
          "We serve clients globally, and the providers listed above may process your information in other countries, including the United States.",
          "By submitting your information through our website, you acknowledge and consent to this transfer. We ensure appropriate safeguards are in place for any international transfer of personal data."
        ]
      },
      {
        "id": "10",
        "title": "Changes to This Policy",
        "body": [
          "We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law. The date of the most recent revision is indicated at the top of this page.",
          "Continued use of our website or services following any update constitutes your acceptance of the revised policy. We encourage you to review this page periodically."
        ]
      },
      {
        "id": "11",
        "title": "Contact Information",
        "body": [
          "If you have any questions about this Privacy Policy or how we handle your personal data, please contact us at info@zenithdubaicv.com or via WhatsApp at +971 50 287 9462."
        ]
      }
    ]
  },
  "fr": {
    "title": "Politique de Confidentialité",
    "updated": "Dernière mise à jour : 23 octobre 2026",
    "intro": "Cette politique explique ce que Zenith Dubai CV (« Zenith », « nous ») collecte lorsque vous utilisez zenithdubaicv.com, nos services et l'agent emploi Zenith AI, pourquoi, qui le traite pour nous, et comment le faire corriger ou supprimer.",
    "sections": [
      {
        "id": "01",
        "title": "Informations que nous collectons",
        "body": [
          "Demandes : lorsque vous utilisez le formulaire de contact ou nous écrivez, nous recevons votre adresse e-mail, votre message et les fichiers joints, comme un CV ou une photo.",
          "Commandes : lorsque vous payez via PayPal, PayPal nous communique votre nom, votre adresse e-mail, ce que vous avez acheté et si le paiement a abouti. Lorsque vous payez via Gumroad, Gumroad nous communique votre adresse e-mail et votre commande. Nous ne recevons ni ne conservons jamais les données de votre carte.",
          "Votre brief : après un achat, le formulaire de brief nous transmet votre nom, votre adresse e-mail, votre numéro WhatsApp (facultatif), les postes et lieux visés, les langues du CV, vos notes, votre CV et une photo facultative, sous forme d'e-mail adressé à notre messagerie.",
          "Journaux du serveur : notre hébergeur conserve des journaux de requêtes standard (adresse IP, heure, page demandée) à des fins de sécurité et d'exploitation."
        ]
      },
      {
        "id": "02",
        "title": "L'agent emploi Zenith AI",
        "body": [
          "Votre profil, le texte et le fichier de votre CV, les offres enregistrées, vos brouillons, candidatures et notes sont stockés dans votre propre navigateur (IndexedDB), pas sur nos serveurs. Votre CV est lu sur votre appareil : les informations que l'agent y trouve (coordonnées, parcours, formation, langues) vous sont présentées pour vérification et ne sont ajoutées à votre profil que si vous le choisissez. Vous pouvez exporter ou supprimer tout cela à tout moment dans la section « Vos données » de l'agent.",
          "Lorsque vous lancez une recherche, votre navigateur n'envoie à notre serveur que vos postes visés, vos pays et le type de poste. Notre serveur interroge les sources d'offres et renvoie les annonces ; il ne conserve pas votre recherche.",
          "Lorsque vous demandez un brouillon IA (Pro), le texte de votre CV sans adresses e-mail ni numéros de téléphone, votre nom, votre accroche, vos postes visés, vos langues, vos compétences et l'offre sont transmis par notre serveur à Anthropic, qui rédige le brouillon. Zenith ne les conserve pas. Anthropic supprime les données envoyées à son API et les réponses sous 30 jours, sauf obligation de les conserver plus longtemps pour faire respecter sa politique d'utilisation ou pour se conformer à la loi, et ne s'en sert pas pour entraîner ses modèles.",
          "Lorsque vous demandez à Zenith d'envoyer une candidature par e-mail (Pro), le message et le CV joint transitent par le serveur de messagerie de notre boîte jusqu'à l'employeur, avec une copie pour vous. Zenith n'en conserve aucune copie.",
          "Si vous saisissez un numéro de commande PayPal ou une clé de licence Gumroad, il est conservé dans votre navigateur et vérifié auprès de PayPal ou de Gumroad lorsque vous utilisez les fonctions Pro. Notre serveur ne garde que le nombre de brouillons IA et d'e-mails utilisés, rattaché à un code irréversible dérivé de ce numéro, jamais le numéro ou la clé eux-mêmes."
        ]
      },
      {
        "id": "03",
        "title": "Utilisation de vos informations",
        "body": [
          "Nous utilisons vos informations uniquement pour répondre à vos demandes, fournir et suivre les services achetés, confirmer les paiements, vous envoyer vos documents et faire fonctionner les fonctions de l'agent que vous choisissez d'utiliser.",
          "Nous n'utilisons pas vos informations à des fins marketing sans votre consentement explicite. Nous ne vendons, ne louons ni ne partageons vos informations avec des tiers à des fins commerciales, en aucune circonstance."
        ]
      },
      {
        "id": "04",
        "title": "Qui les traite pour nous",
        "body": [
          "Nous ne partageons des données personnelles qu'avec les services qui font fonctionner ce site et votre commande : Vercel (hébergement), GoDaddy (messagerie), PayPal et Gumroad (paiements ; Gumroad vend les produits numériques en tant que vendeur officiel et en assure la livraison) et Anthropic (rédaction par IA, uniquement lorsque vous l'utilisez).",
          "Les sources d'offres (Workable, Himalayas, Jobicy, Remotive et Arbeitnow, ainsi que Jooble ou Adzuna si nous les connectons) ne reçoivent de notre serveur que des termes de recherche, jamais votre CV ni vos coordonnées. Pour afficher les prix dans d'autres devises, votre navigateur demande les taux de change à open.er-api.com.",
          "Nous pouvons divulguer vos informations si la loi applicable ou une procédure légale valide l'exige. Nous vous en informerons dans la mesure permise par la loi."
        ]
      },
      {
        "id": "05",
        "title": "Sécurité des données",
        "body": [
          "Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, modification, divulgation ou destruction. L'accès est limité aux membres de l'équipe directement impliqués dans la prestation de votre service.",
          "Bien que nous prenions toutes les précautions raisonnables, aucun mode de transmission sur Internet n'est entièrement sécurisé. Nous vous encourageons à nous contacter via notre formulaire sécurisé ou WhatsApp pour les communications sensibles."
        ]
      },
      {
        "id": "06",
        "title": "Cookies et stockage dans le navigateur",
        "body": [
          "Nous n'utilisons aucun cookie publicitaire ou de mesure d'audience, ni aucun outil de suivi comportemental tiers.",
          "Votre navigateur enregistre vos choix de thème, de langue et de devise (localStorage) et, si vous utilisez l'agent, vos données d'agent (IndexedDB). Elles restent sur votre appareil et ne nous sont pas envoyées."
        ]
      },
      {
        "id": "07",
        "title": "Vos droits",
        "body": [
          "Vous avez le droit d'accéder aux informations personnelles que nous détenons, de demander la correction de données inexactes, de demander leur suppression, de retirer votre consentement, et de déposer une plainte auprès d'une autorité de protection des données.",
          "Pour exercer l'un de ces droits, contactez-nous à info@zenithdubaicv.com. Nous répondrons à toutes les demandes légitimes dans un délai de 30 jours."
        ]
      },
      {
        "id": "08",
        "title": "Conservation des données",
        "body": [
          "Nous conservons vos informations pendant la durée de votre engagement et pour une période raisonnable par la suite, à des fins d'archivage, légales et d'assurance qualité. Les fichiers et la correspondance ne sont pas conservés indéfiniment.",
          "Vous pouvez demander la suppression de vos données à tout moment à info@zenithdubaicv.com. Nous traiterons les demandes rapidement, sous réserve d'obligations légales de conservation.",
          "Les données de l'agent restent dans votre navigateur jusqu'à ce que vous les supprimiez. PayPal et Gumroad conservent aussi les traces de paiement selon leurs propres politiques."
        ]
      },
      {
        "id": "09",
        "title": "Transferts internationaux de données",
        "body": [
          "Nous servons des clients du monde entier, et les prestataires cités plus haut peuvent traiter vos informations dans d'autres pays, notamment aux États-Unis.",
          "En soumettant vos informations via notre site, vous reconnaissez et consentez à ce transfert. Nous veillons à ce que des garanties appropriées soient en place pour tout transfert international."
        ]
      },
      {
        "id": "10",
        "title": "Modifications de cette politique",
        "body": [
          "Nous pouvons mettre à jour cette politique périodiquement pour refléter les évolutions de nos pratiques ou de la législation. La date de la dernière révision est indiquée en haut de cette page.",
          "L'utilisation continue de notre site ou de nos services après toute mise à jour vaut acceptation de la politique révisée. Nous vous encourageons à consulter cette page régulièrement."
        ]
      },
      {
        "id": "11",
        "title": "Coordonnées",
        "body": [
          "Pour toute question concernant cette politique ou la manière dont nous traitons vos données, contactez-nous à info@zenithdubaicv.com ou via WhatsApp au +971 50 287 9462."
        ]
      }
    ]
  },
  "ar": {
    "title": "سياسة الخصوصية",
    "updated": "آخر تحديث: 23 أكتوبر 2026",
    "intro": "توضح هذه السياسة ما تجمعه Zenith Dubai CV («Zenith» أو «نحن») عند استخدامك zenithdubaicv.com وخدماتنا ووكيل الوظائف Zenith AI، ولماذا، ومن يعالجه نيابةً عنا، وكيف تطلب تصحيحه أو حذفه.",
    "sections": [
      {
        "id": "01",
        "title": "المعلومات التي نجمعها",
        "body": [
          "الاستفسارات: عند استخدامك نموذج التواصل أو مراسلتنا، نستلم بريدك الإلكتروني ورسالتك وأي ملفات ترفقها، مثل سيرة ذاتية أو صورة.",
          "الطلبات: عند الدفع عبر PayPal، يزوّدنا PayPal باسمك وبريدك الإلكتروني وما اشتريته وما إذا اكتملت الدفعة. وعند الدفع عبر Gumroad، يزوّدنا Gumroad ببريدك الإلكتروني وتفاصيل طلبك. لا نستلم بيانات بطاقتك ولا نحتفظ بها أبداً.",
          "معلومات طلبك: بعد الشراء، يرسل إلينا نموذج المعلومات اسمك وبريدك الإلكتروني ورقم واتساب (اختياري) والوظائف والأماكن المستهدفة ولغات السيرة الذاتية وملاحظاتك وملف سيرتك وصورة اختيارية، في رسالة بريد إلكتروني إلى صندوق بريدنا.",
          "سجلات الخادم: يحتفظ مزوّد الاستضافة بسجلات طلبات قياسية، مثل عنوان IP والوقت والصفحة المطلوبة، لأغراض الأمان والتشغيل."
        ]
      },
      {
        "id": "02",
        "title": "وكيل الوظائف Zenith AI",
        "body": [
          "يُخزَّن ملفك في الوكيل ونص سيرتك الذاتية وملفها الذي ترفعه والوظائف المحفوظة والمسودات والطلبات والملاحظات في متصفحك أنت (IndexedDB)، لا على خوادمنا. تُقرأ سيرتك الذاتية على جهازك: تُعرض عليك البيانات التي يجدها الوكيل فيها (بيانات التواصل والخبرة والتعليم واللغات) لتراجعها، ولا تُضاف إلى ملفك إلا إذا اخترت ذلك. ويمكنك تصدير ذلك كله أو حذفه في أي وقت من قسم «بياناتك» في الوكيل.",
          "عند البحث، لا يرسل متصفحك إلى خادمنا إلا الوظائف والدول ونوع العمل الذي تستهدفه. يستعلم خادمنا من مصادر الوظائف ويعيد الإعلانات، ولا يحتفظ ببحثك.",
          "عند طلب مسودة بالذكاء الاصطناعي (Pro)، يُرسل عبر خادمنا إلى Anthropic، التي تكتب المسودة، نص سيرتك الذاتية بعد حذف عناوين البريد وأرقام الهاتف، واسمك وعنوانك التعريفي والوظائف المستهدفة ولغاتك ومهاراتك وإعلان الوظيفة. لا تحتفظ Zenith بها. وتحذف Anthropic مدخلات واجهتها البرمجية ومخرجاتها خلال 30 يوماً، ما لم تضطر إلى الاحتفاظ بها مدة أطول لتطبيق سياسة الاستخدام أو للامتثال للقانون، ولا تستخدمها لتدريب نماذجها.",
          "عندما تطلب من Zenith إرسال طلب توظيف بالبريد (Pro)، تمر الرسالة وملف السيرة المرفق عبر خادم بريدنا إلى صاحب العمل، مع نسخة إليك. ولا تحتفظ Zenith بأي نسخة.",
          "إذا أدخلت رقم طلب PayPal أو مفتاح ترخيص Gumroad، فإنه يُحفظ في متصفحك ويُتحقق منه لدى PayPal أو Gumroad عند استخدام ميزات Pro. ولا يحتفظ خادمنا إلا بعدد المسودات والرسائل المستخدمة، مرتبطاً برمز أحادي الاتجاه مشتق منه، لا برقم الطلب أو المفتاح نفسه."
        ]
      },
      {
        "id": "03",
        "title": "كيفية استخدام معلوماتك",
        "body": [
          "نستخدم معلوماتك فقط للرد على استفساراتك، وتقديم الخدمات التي تشتريها ومتابعتها، وتأكيد المدفوعات، وإرسال مستنداتك، وتشغيل ميزات الوكيل التي تختار استخدامها.",
          "لا نستخدم معلوماتك الشخصية لأغراض تسويقية دون موافقتك الصريحة. ولا نبيع معلوماتك أو نؤجّرها أو نشاركها مع أطراف ثالثة لأغراض تجارية تحت أي ظرف."
        ]
      },
      {
        "id": "04",
        "title": "من يعالجها نيابةً عنا",
        "body": [
          "لا نشارك البيانات الشخصية إلا مع الخدمات التي تشغّل هذا الموقع وطلبك: Vercel (الاستضافة)، وGoDaddy (البريد)، وPayPal وGumroad (المدفوعات؛ إذ يبيع Gumroad المنتجات الرقمية بصفته البائع الرسمي ويتولى تسليمها)، وAnthropic (الكتابة بالذكاء الاصطناعي، عند استخدامك لها فقط).",
          "لا تتلقى مصادر الوظائف (Workable وHimalayas وJobicy وRemotive وArbeitnow، وJooble أو Adzuna إن ربطناها) من خادمنا سوى كلمات البحث، ولا تتلقى أبداً سيرتك الذاتية أو بيانات تواصلك. ولعرض الأسعار بعملات أخرى، يطلب متصفحك أسعار الصرف من open.er-api.com.",
          "قد نُفصح عن معلوماتك إذا اقتضى القانون المعمول به أو إجراء قانوني صحيح ذلك. في مثل هذه الحالات، سنخطرك بالقدر المسموح به قانوناً."
        ]
      },
      {
        "id": "05",
        "title": "أمان البيانات",
        "body": [
          "نطبّق تدابير تقنية وتنظيمية مناسبة لحماية بياناتك الشخصية من الوصول غير المصرّح به أو التعديل أو الإفصاح أو الإتلاف. يقتصر الوصول إلى معلوماتك على أعضاء الفريق المعنيين مباشرةً بتقديم خدمتك.",
          "رغم اتخاذنا كل الاحتياطات المعقولة، لا توجد طريقة نقل عبر الإنترنت آمنة بالكامل. ننصحك بالتواصل معنا عبر نموذجنا الآمن أو واتساب للمراسلات الحساسة."
        ]
      },
      {
        "id": "06",
        "title": "ملفات تعريف الارتباط والتخزين في المتصفح",
        "body": [
          "لا نستخدم ملفات تعريف ارتباط إعلانية أو تحليلية، ولا أي أدوات تتبّع سلوكي تابعة لجهات خارجية.",
          "يحفظ متصفحك اختياراتك للمظهر واللغة والعملة (localStorage)، وبيانات الوكيل إن استخدمته (IndexedDB). وتبقى هذه البيانات على جهازك ولا تُرسل إلينا."
        ]
      },
      {
        "id": "07",
        "title": "حقوقك",
        "body": [
          "يحق لك الاطلاع على معلوماتك الشخصية التي نحتفظ بها، وطلب تصحيح البيانات غير الدقيقة، وطلب حذف بياناتك، وسحب موافقتك على أي معالجة، وتقديم شكوى إلى سلطة حماية البيانات المختصة.",
          "لممارسة أي من هذه الحقوق، يُرجى التواصل معنا على info@zenithdubaicv.com. سنردّ على جميع الطلبات المشروعة خلال 30 يوماً."
        ]
      },
      {
        "id": "08",
        "title": "الاحتفاظ بالبيانات",
        "body": [
          "نحتفظ بمعلوماتك طوال فترة تعاملك معنا، ولفترة معقولة بعد ذلك لأغراض حفظ السجلات والمتطلبات القانونية وضمان الجودة. لا تُحتفظ بالملفات والمراسلات إلى أجل غير مسمى.",
          "يمكنك طلب حذف بياناتك الشخصية في أي وقت بالتواصل معنا على info@zenithdubaicv.com. سنعالج طلبات الحذف بسرعة، مع مراعاة أي التزامات قانونية.",
          "تبقى بيانات الوكيل في متصفحك حتى تحذفها. كما يحتفظ PayPal وGumroad بسجلات الدفع وفق سياساتهما."
        ]
      },
      {
        "id": "09",
        "title": "نقل البيانات الدولي",
        "body": [
          "نخدم عملاء حول العالم، وقد يعالج مزوّدو الخدمات المذكورون أعلاه معلوماتك في دول أخرى، منها الولايات المتحدة.",
          "بإرسالك معلوماتك عبر موقعنا، فإنك تُقرّ بهذا النقل وتوافق عليه. نحرص على وضع ضمانات مناسبة لأي نقل دولي للبيانات الشخصية."
        ]
      },
      {
        "id": "10",
        "title": "التعديلات على هذه السياسة",
        "body": [
          "قد نُحدّث سياسة الخصوصية هذه من وقت لآخر لتعكس التغييرات في ممارساتنا أو القانون المعمول به. يُشار إلى تاريخ آخر مراجعة في أعلى هذه الصفحة.",
          "يُعدّ استمرارك في استخدام موقعنا أو خدماتنا بعد أي تحديث بمثابة قبول للسياسة المُعدَّلة. ننصحك بمراجعة هذه الصفحة بصفة دورية."
        ]
      },
      {
        "id": "11",
        "title": "معلومات التواصل",
        "body": [
          "إذا كانت لديك أي أسئلة حول سياسة الخصوصية هذه أو كيفية تعاملنا مع بياناتك الشخصية، يُرجى التواصل معنا على info@zenithdubaicv.com أو عبر واتساب على 9462 287 50 971+."
        ]
      }
    ]
  }
};

export const TERMS: Record<Lang, LegalDoc> = {
  "en": {
    "title": "Terms of Service",
    "updated": "Last updated: 19 October 2026",
    "intro": "These Terms of Service govern your use of the Zenith Dubai CV website and the professional career services we provide. By engaging our services or submitting an enquiry, you agree to be bound by these terms. Please read them carefully before proceeding.",
    "sections": [
      {
        "id": "01",
        "title": "Introduction & Agreement",
        "body": [
          "By accessing this website or engaging Zenith Dubai CV for any service, you confirm that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or services.",
          "These terms constitute a legally binding agreement between you (“the client”) and Zenith Dubai CV (“we”, “us”, “our”)."
        ]
      },
      {
        "id": "02",
        "title": "Services",
        "body": [
          "Zenith Dubai CV provides professional career services: four CV packages, individual services such as cover letters and LinkedIn optimisation, portfolio websites, and the Zenith AI job agent. What each package includes is listed on the website at the time of purchase; custom work is agreed in writing before it starts.",
          "All services are delivered digitally. Documents are delivered by email in the formats agreed. The Global Horizon ebook included with some packages is a PDF. No physical materials are produced or shipped."
        ]
      },
      {
        "id": "03",
        "title": "User Responsibilities",
        "body": [
          "You are responsible for providing accurate, complete, and truthful information about your career history, qualifications, and objectives. Zenith Dubai CV relies entirely on the information you provide to create your documents. We are not responsible for inaccuracies in final documents that result from inaccurate or incomplete information supplied by you.",
          "You confirm that all information you provide is your own and does not infringe the intellectual property or confidentiality obligations of any third party. You agree not to use our services for any unlawful purpose."
        ]
      },
      {
        "id": "04",
        "title": "Payments and refunds",
        "body": [
          "All prices are stated in UAE Dirhams (AED). PayPal payments are charged in US dollars (USD) at the official rate of 1 USD = 3.6725 AED. Where a Gumroad checkout is offered, Gumroad processes the payment in US dollars as merchant of record and may add sales tax or VAT where it applies.",
          "An order is confirmed only when the payment provider confirms the payment. Payment is due in full before work starts. We may change prices at any time; changes do not affect orders already paid.",
          "Refunds are governed by our Refund Policy: a full refund on any purchase when you ask within 7 days of the purchase date. Where anything on this site differs, the Refund Policy applies."
        ]
      },
      {
        "id": "05",
        "title": "Delivery",
        "body": [
          "Standard delivery for all packages is 48 hours from the completion of the client intake process. This timeline begins once we have received all necessary information from you, including your career background, target markets, and objectives.",
          "Delivery timelines are estimates and may be extended in exceptional circumstances. We will notify you promptly if a delay is anticipated. Delays attributable to late submission of client intake information do not affect our delivery obligation timeline."
        ]
      },
      {
        "id": "06",
        "title": "Revisions",
        "body": [
          "All packages include unlimited revision rounds until the client is fully satisfied with the deliverables. Revisions must be requested within 30 days of the initial delivery. Revision requests submitted after this period may be subject to additional charges.",
          "Revisions are scoped to the content and structure of the original deliverables. Requests that constitute a fundamental change in direction — such as targeting an entirely new industry or career level — may be treated as a new engagement at our sole discretion."
        ]
      },
      {
        "id": "07",
        "title": "Job applications and the Zenith AI job agent",
        "body": [
          "Where a package includes job applications submitted for you, we agree the target roles with you and submit applications only where the employer accepts them that way. Anything that requires your own account, an assessment or a security check is returned to you.",
          "The Zenith AI job agent is a self-service tool. Listings come from third-party job sources, and we do not guarantee that a listing is accurate, current or still open. Drafts, whether built from templates or written with AI, may contain mistakes: you are responsible for reviewing and approving everything before you use or send it.",
          "Pro features (emailing applications for you, and AI drafting when it is switched on) require a qualifying purchase, are subject to the usage allowances shown in the agent, and may be suspended if they are used for spam or for anything other than applying to listings that invite applications.",
          "The agent never submits applications on job boards or employer portals for you, and never bypasses CAPTCHAs, sign-ins or other access controls."
        ]
      },
      {
        "id": "08",
        "title": "Intellectual Property",
        "body": [
          "Upon full payment and delivery, you are granted full ownership of all documents created for you by Zenith Dubai CV. You may use, modify, and distribute these documents freely for your personal career purposes.",
          "Zenith Dubai CV retains the right to use anonymised or aggregated insights derived from client engagements for internal quality improvement and training purposes only. We will never publish, attribute, or share identifiable client content without explicit written consent."
        ]
      },
      {
        "id": "09",
        "title": "Confidentiality",
        "body": [
          "All information shared with us in the course of an engagement is treated as strictly confidential. We do not share your personal career information, documents, or correspondence with any third party without your explicit consent, except as required by applicable law.",
          "We expect clients to treat any proprietary methodologies, templates, or strategic frameworks shared during an engagement as confidential and not to reproduce or distribute them."
        ]
      },
      {
        "id": "10",
        "title": "Limitation of Liability",
        "body": [
          "Zenith Dubai CV provides career document services and professional guidance. We do not guarantee any specific outcome, including but not limited to employment, interview invitations, salary increases, or career advancement. The effectiveness of career documents depends on many factors outside our control.",
          "Our total liability to any client in connection with any engagement shall not exceed the total amount paid by the client for that engagement. We are not liable for any indirect, consequential, or incidental damages arising from the use of our services."
        ]
      },
      {
        "id": "11",
        "title": "Disclaimer",
        "body": [
          "Our services are provided 'as is' and 'as available'. To the fullest extent permitted by law, we disclaim all warranties, express or implied, regarding our services, including warranties of merchantability, fitness for a particular purpose, and non-infringement.",
          "We reserve the right to modify, suspend, or discontinue any aspect of our services at any time. We do not warrant that our website will be uninterrupted or error-free."
        ]
      },
      {
        "id": "12",
        "title": "Termination",
        "body": [
          "We reserve the right to refuse service to, or terminate an engagement with, any client who provides false information, engages in abusive or inappropriate conduct, or violates any of these Terms of Service.",
          "In the event of termination for cause attributable to the client, no refund will be issued for work already commenced. In the event of termination at our discretion without cause, a proportionate refund will be provided."
        ]
      },
      {
        "id": "13",
        "title": "Governing Law",
        "body": [
          "These Terms of Service are governed by and construed in accordance with the laws of the United Arab Emirates. Any disputes arising from or related to these terms or our services shall be subject to the exclusive jurisdiction of the courts of Dubai, UAE.",
          "If any provision of these terms is found to be unenforceable, the remaining provisions shall continue in full force and effect. These terms constitute the entire agreement between you and Zenith Dubai CV regarding your use of our services."
        ]
      },
      {
        "id": "14",
        "title": "Contact Information",
        "body": [
          "If you have any questions about these Terms of Service, or wish to clarify anything before engaging our services, please contact us at info@zenithdubaicv.com or via WhatsApp at +971 50 287 9462."
        ]
      }
    ]
  },
  "fr": {
    "title": "Conditions d'utilisation",
    "updated": "Dernière mise à jour : 19 octobre 2026",
    "intro": "Ces Conditions d'utilisation régissent votre utilisation du site Zenith Dubai CV et des services professionnels que nous proposons. En faisant appel à nos services ou en soumettant une demande, vous acceptez d'être lié par ces conditions.",
    "sections": [
      {
        "id": "01",
        "title": "Introduction et accord",
        "body": [
          "En accédant à ce site ou en faisant appel à Zenith Dubai CV pour tout service, vous confirmez avoir lu, compris et accepté d'être lié par ces Conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre site ou nos services.",
          "Ces conditions constituent un accord juridiquement contraignant entre vous (« le client ») et Zenith Dubai CV (« nous »)."
        ]
      },
      {
        "id": "02",
        "title": "Services",
        "body": [
          "Zenith Dubai CV fournit des services de carrière professionnels : quatre formules de CV, des services à l'unité comme la lettre de motivation et l'optimisation LinkedIn, des sites portfolio et l'agent emploi Zenith AI. Le contenu de chaque formule est indiqué sur le site au moment de l'achat ; tout travail sur mesure est convenu par écrit avant de commencer.",
          "Tous les services sont fournis sous forme numérique. Les documents sont livrés par e-mail dans les formats convenus. L'ebook The Global Horizon inclus dans certaines formules est un PDF. Aucun support physique n'est produit ni expédié."
        ]
      },
      {
        "id": "03",
        "title": "Responsabilités de l'utilisateur",
        "body": [
          "Vous êtes responsable de fournir des informations exactes, complètes et véridiques sur votre parcours professionnel, vos qualifications et vos objectifs. Zenith Dubai CV se base entièrement sur les informations que vous fournissez pour créer vos documents. Nous ne sommes pas responsables des inexactitudes dans les documents finaux résultant d'informations incorrectes ou incomplètes.",
          "Vous confirmez que toutes les informations fournies vous appartiennent et ne portent pas atteinte aux droits de propriété intellectuelle ou aux obligations de confidentialité de tiers. Vous vous engagez à ne pas utiliser nos services à des fins illégales."
        ]
      },
      {
        "id": "04",
        "title": "Paiements et remboursements",
        "body": [
          "Tous les prix sont indiqués en dirhams des Émirats (AED). Les paiements PayPal sont débités en dollars US (USD) au taux officiel de 1 USD = 3,6725 AED. Lorsqu'un paiement Gumroad est proposé, Gumroad traite le paiement en dollars US en tant que vendeur officiel et peut ajouter la TVA ou la taxe de vente lorsqu'elle s'applique.",
          "Une commande n'est confirmée que lorsque le prestataire de paiement confirme le paiement. Le paiement intégral est dû avant le début du travail. Nous pouvons modifier nos prix à tout moment ; les modifications ne s'appliquent pas aux commandes déjà payées.",
          "Les remboursements relèvent de notre Politique de remboursement : remboursement intégral de tout achat sur demande dans les 7 jours suivant la date d'achat. En cas de différence avec une autre mention du site, la Politique de remboursement s'applique."
        ]
      },
      {
        "id": "05",
        "title": "Livraison",
        "body": [
          "Le délai de livraison standard pour tous les forfaits est de 48 heures à compter de la finalisation du processus d'intégration. Ce délai commence dès réception de toutes les informations nécessaires de votre part.",
          "Les délais de livraison sont indicatifs et peuvent être prolongés dans des circonstances exceptionnelles. Nous vous notifierons promptement en cas de retard anticipé. Les retards imputables au client n'affectent pas notre obligation de livraison."
        ]
      },
      {
        "id": "06",
        "title": "Révisions",
        "body": [
          "Tous les forfaits incluent des révisions illimitées jusqu'à la pleine satisfaction du client. Les révisions doivent être demandées dans les 30 jours suivant la livraison initiale. Les demandes soumises après ce délai peuvent entraîner des frais supplémentaires.",
          "Les révisions sont limitées au contenu et à la structure des livrables originaux. Les demandes constituant un changement fondamental de direction peuvent être traitées comme un nouvel engagement à notre seule discrétion."
        ]
      },
      {
        "id": "07",
        "title": "Candidatures et agent emploi Zenith AI",
        "body": [
          "Lorsqu'une formule inclut des candidatures envoyées pour vous, nous convenons avec vous des postes visés et n'envoyons de candidatures que lorsque l'employeur les accepte sous cette forme. Tout ce qui exige votre propre compte, un test ou une vérification de sécurité vous est renvoyé.",
          "L'agent emploi Zenith AI est un outil en libre-service. Les offres proviennent de sources tierces, et nous ne garantissons pas qu'une offre soit exacte, à jour ou encore ouverte. Les brouillons, qu'ils soient bâtis sur des modèles ou rédigés avec l'IA, peuvent contenir des erreurs : il vous appartient de tout relire et valider avant de l'utiliser ou de l'envoyer.",
          "Les fonctions Pro (envoi de candidatures pour vous par e-mail, et rédaction par IA lorsqu'elle est activée) nécessitent un achat éligible, sont soumises aux quotas affichés dans l'agent et peuvent être suspendues en cas d'usage pour du spam ou pour autre chose que répondre à des offres qui invitent à postuler.",
          "L'agent ne dépose jamais de candidature pour vous sur les sites d'emploi ou les portails employeurs, et ne contourne jamais les CAPTCHA, les connexions ou d'autres contrôles d'accès."
        ]
      },
      {
        "id": "08",
        "title": "Propriété intellectuelle",
        "body": [
          "Dès le paiement intégral et la livraison, vous obtenez la pleine propriété de tous les documents créés pour vous par Zenith Dubai CV. Vous pouvez les utiliser, les modifier et les distribuer librement à des fins personnelles de carrière.",
          "Zenith Dubai CV se réserve le droit d'utiliser des informations anonymisées tirées des engagements clients uniquement à des fins d'amélioration interne et de formation. Nous ne publierons jamais de contenu client identifiable sans consentement écrit explicite."
        ]
      },
      {
        "id": "09",
        "title": "Confidentialité",
        "body": [
          "Toutes les informations partagées avec nous lors d'un engagement sont traitées comme strictement confidentielles. Nous ne partageons pas vos informations de carrière, documents ou correspondances avec des tiers sans votre consentement explicite, sauf si la loi l'exige.",
          "Nous attendons des clients qu'ils traitent toute méthodologie propriétaire, modèle ou cadre stratégique partagé lors d'un engagement comme confidentiel et qu'ils ne les reproduisent ni ne les distribuent."
        ]
      },
      {
        "id": "10",
        "title": "Limitation de responsabilité",
        "body": [
          "Zenith Dubai CV fournit des services de documents de carrière et des conseils professionnels. Nous ne garantissons aucun résultat spécifique, notamment l'emploi, les invitations à des entretiens, les augmentations de salaire ou l'avancement de carrière.",
          "Notre responsabilité totale envers tout client ne saurait dépasser le montant total payé pour l'engagement concerné. Nous ne sommes pas responsables des dommages indirects, consécutifs ou accessoires découlant de l'utilisation de nos services."
        ]
      },
      {
        "id": "11",
        "title": "Avis de non-responsabilité",
        "body": [
          "Nos services sont fournis 'en l'état' et 'selon disponibilité'. Dans toute la mesure permise par la loi, nous déclinons toute garantie, expresse ou implicite, concernant nos services.",
          "Nous nous réservons le droit de modifier, suspendre ou interrompre tout aspect de nos services à tout moment. Nous ne garantissons pas que notre site fonctionnera sans interruption ni erreur."
        ]
      },
      {
        "id": "12",
        "title": "Résiliation",
        "body": [
          "Nous nous réservons le droit de refuser nos services ou de mettre fin à un engagement avec tout client qui fournit de fausses informations, adopte un comportement abusif ou enfreint ces Conditions.",
          "En cas de résiliation pour cause imputable au client, aucun remboursement ne sera accordé pour les travaux déjà commencés. En cas de résiliation sans cause à notre discrétion, un remboursement proportionnel sera fourni."
        ]
      },
      {
        "id": "13",
        "title": "Droit applicable",
        "body": [
          "Ces Conditions d'utilisation sont régies et interprétées conformément aux lois des Émirats arabes unis. Tout litige sera soumis à la juridiction exclusive des tribunaux de Dubaï, EAU.",
          "Si une disposition est jugée inapplicable, les dispositions restantes continueront à s'appliquer pleinement. Ces conditions constituent l'accord complet entre vous et Zenith Dubai CV."
        ]
      },
      {
        "id": "14",
        "title": "Coordonnées",
        "body": [
          "Pour toute question concernant ces Conditions, contactez-nous à info@zenithdubaicv.com ou via WhatsApp au +971 50 287 9462."
        ]
      }
    ]
  },
  "ar": {
    "title": "شروط الخدمة",
    "updated": "آخر تحديث: 19 أكتوبر 2026",
    "intro": "تحكم شروط الخدمة هذه استخدامك لموقع Zenith Dubai CV والخدمات المهنية التي نقدّمها. بتعاملك مع خدماتنا أو تقديم استفسار، فإنك توافق على الالتزام بهذه الشروط. يُرجى قراءتها بعناية قبل المتابعة.",
    "sections": [
      {
        "id": "01",
        "title": "المقدمة والاتفاقية",
        "body": [
          "بوصولك إلى هذا الموقع أو تعاملك مع Zenith Dubai CV للحصول على أي خدمة، فإنك تُقرّ بأنك قرأت شروط الخدمة هذه وفهمتها وتوافق على الالتزام بها. إذا كنت لا توافق على هذه الشروط، يُرجى عدم استخدام موقعنا أو خدماتنا.",
          "تشكّل هذه الشروط اتفاقية ملزمة قانوناً بينك («العميل») وبين Zenith Dubai CV («نحن»)."
        ]
      },
      {
        "id": "02",
        "title": "الخدمات",
        "body": [
          "تقدّم Zenith Dubai CV خدمات مهنية للمسار الوظيفي: أربع باقات للسيرة الذاتية، وخدمات منفردة مثل خطاب التغطية وتحسين لينكدإن، ومواقع تعريفية، ووكيل الوظائف Zenith AI. ويُذكر ما تشمله كل باقة على الموقع وقت الشراء، ويُتفق كتابياً على أي عمل مخصّص قبل بدئه.",
          "تُقدَّم جميع الخدمات رقمياً، وتُسلَّم المستندات بالبريد الإلكتروني بالصيغ المتفق عليها. وكتاب The Global Horizon المشمول في بعض الباقات ملف PDF. ولا تُنتج أي مواد مادية ولا تُشحن."
        ]
      },
      {
        "id": "03",
        "title": "مسؤوليات العميل",
        "body": [
          "أنت مسؤول عن تقديم معلومات دقيقة وكاملة وصادقة حول تاريخك المهني ومؤهلاتك وأهدافك. تعتمد Zenith Dubai CV كلياً على المعلومات التي تقدّمها لإعداد مستنداتك. لسنا مسؤولين عن أي عدم دقة في المستندات النهائية ناتج عن معلومات غير دقيقة أو ناقصة قدّمتها.",
          "تُقرّ بأن جميع المعلومات التي تقدّمها خاصة بك ولا تنتهك الملكية الفكرية أو التزامات السرية لأي طرف ثالث. كما توافق على عدم استخدام خدماتنا لأي غرض غير مشروع."
        ]
      },
      {
        "id": "04",
        "title": "المدفوعات والاسترداد",
        "body": [
          "تُذكر جميع الأسعار بالدرهم الإماراتي. وتُخصم مدفوعات PayPal بالدولار الأمريكي وفق السعر الرسمي 1 دولار = 3.6725 درهم. وحين يُتاح الدفع عبر Gumroad، يعالج Gumroad الدفعة بالدولار الأمريكي بصفته البائع الرسمي، وقد يضيف ضريبة المبيعات أو القيمة المضافة حيث تنطبق.",
          "لا يُؤكَّد الطلب إلا عندما يؤكد مزوّد الدفع الدفعة. ويُستحق المبلغ كاملاً قبل بدء العمل. ويجوز لنا تغيير الأسعار في أي وقت، ولا تسري التغييرات على الطلبات المدفوعة.",
          "تخضع المبالغ المستردة لسياسة الاسترداد لدينا: استرداد كامل لأي عملية شراء عند طلبه خلال 7 أيام من تاريخ الشراء. وإن اختلف أي شيء في هذا الموقع عنها، تُطبَّق سياسة الاسترداد."
        ]
      },
      {
        "id": "05",
        "title": "التسليم",
        "body": [
          "يبلغ وقت التسليم القياسي لجميع الباقات 48 ساعة من اكتمال عملية الاستقبال. يبدأ هذا الإطار الزمني فور استلامنا جميع المعلومات الضرورية منك، بما تشمل خلفيتك المهنية وأسواقك المستهدفة وأهدافك.",
          "أوقات التسليم تقديرية وقد تمتد في ظروف استثنائية. سنخطرك فوراً في حال توقع أي تأخير. لا تؤثر التأخيرات الناجمة عن تأخر العميل في تقديم معلومات الاستقبال على التزامنا بموعد التسليم."
        ]
      },
      {
        "id": "06",
        "title": "المراجعات",
        "body": [
          "تشمل جميع الباقات جولات مراجعة غير محدودة حتى يكون العميل راضياً تماماً عن المخرجات. يجب تقديم طلبات المراجعة في غضون 30 يوماً من التسليم الأولي. قد تخضع طلبات المراجعة المقدَّمة بعد هذه الفترة لرسوم إضافية.",
          "تقتصر المراجعات على محتوى وهيكل المخرجات الأصلية. قد تُعامَل الطلبات التي تشكّل تغييراً جوهرياً في الاتجاه باعتبارها تعاقداً جديداً وفق تقديرنا المنفرد."
        ]
      },
      {
        "id": "07",
        "title": "طلبات التوظيف ووكيل الوظائف Zenith AI",
        "body": [
          "حين تشمل الباقة طلبات توظيف نقدّمها نيابةً عنك، نتفق معك على الوظائف المستهدفة، ولا نقدّم الطلبات إلا حيث يقبلها صاحب العمل بهذه الطريقة. وأي خطوة تتطلب حسابك الخاص أو اختباراً أو تحققاً أمنياً نعيدها إليك.",
          "وكيل الوظائف Zenith AI أداة خدمة ذاتية. تأتي الإعلانات من مصادر وظائف خارجية، ولا نضمن دقة أي إعلان أو حداثته أو استمراره. وقد تحتوي المسودات، سواء بُنيت من قوالب أو كُتبت بالذكاء الاصطناعي، على أخطاء: أنت المسؤول عن مراجعة كل شيء والموافقة عليه قبل استخدامه أو إرساله.",
          "تتطلب ميزات Pro (إرسال الطلبات نيابةً عنك بالبريد، والكتابة بالذكاء الاصطناعي عند تفعيلها) عملية شراء مؤهلة، وتخضع لحدود الاستخدام المعروضة في الوكيل، ويجوز إيقافها إذا استُخدمت لإرسال رسائل مزعجة أو لأي غرض غير التقدّم لإعلانات تدعو إلى التقديم.",
          "لا يقدّم الوكيل أبداً طلبات نيابةً عنك في مواقع التوظيف أو بوابات أصحاب العمل، ولا يتجاوز أبداً اختبارات CAPTCHA أو تسجيل الدخول أو غيرها من ضوابط الوصول."
        ]
      },
      {
        "id": "08",
        "title": "الملكية الفكرية",
        "body": [
          "عند اكتمال الدفع والتسليم، تُمنح ملكية كاملة لجميع المستندات التي أعدّتها Zenith Dubai CV خصيصاً لك. يحق لك استخدام هذه المستندات وتعديلها وتوزيعها بحرية لأغراض مسارك المهني الشخصي.",
          "تحتفظ Zenith Dubai CV بحق استخدام الرؤى المجهولة الهوية أو الموحّدة المستخلصة من تعاقدات العملاء لأغراض تحسين الجودة الداخلية والتدريب فقط. لن نقوم أبداً بنشر محتوى عملاء قابل للتعريف دون موافقة خطية صريحة."
        ]
      },
      {
        "id": "09",
        "title": "السرية",
        "body": [
          "تُعامَل جميع المعلومات التي تشاركها معنا في سياق التعاقد بسرية تامة. لا نشارك معلوماتك المهنية الشخصية أو مستنداتك أو مراسلاتك مع أي طرف ثالث دون موافقتك الصريحة، إلا إذا اقتضى القانون المعمول به ذلك.",
          "نتوقع من العملاء معاملة أي منهجيات خاصة أو قوالب أو أطر استراتيجية تُشارك خلال التعاقد بسرية وعدم إعادة إنتاجها أو توزيعها."
        ]
      },
      {
        "id": "10",
        "title": "تحديد المسؤولية",
        "body": [
          "تقدّم Zenith Dubai CV خدمات وثائق المسار المهني والإرشاد المهني. لا نضمن أي نتيجة محددة، بما في ذلك على سبيل المثال: الحصول على وظيفة أو دعوات للمقابلات أو زيادات في الراتب أو التقدم الوظيفي. تعتمد فعالية وثائق المسار المهني على عوامل كثيرة خارجة عن سيطرتنا.",
          "لا تتجاوز مسؤوليتنا الإجمالية تجاه أي عميل المبلغ الإجمالي المدفوع من قِبَل العميل لذلك التعاقد. لسنا مسؤولين عن أي أضرار غير مباشرة أو تبعية أو عرضية ناجمة عن استخدام خدماتنا."
        ]
      },
      {
        "id": "11",
        "title": "إخلاء المسؤولية",
        "body": [
          "تُقدَّم خدماتنا 'كما هي' و'حسب التوفر'. بالقدر الأقصى المسموح به قانوناً، نُخلي مسؤوليتنا من جميع الضمانات الصريحة أو الضمنية المتعلقة بخدماتنا، بما في ذلك ضمانات القابلية للتسويق والملاءمة لغرض معين وعدم الانتهاك.",
          "نحتفظ بحق تعديل أي جانب من جوانب خدماتنا أو تعليقها أو إيقافها في أي وقت. لا نضمن أن موقعنا سيعمل دون انقطاع أو أخطاء."
        ]
      },
      {
        "id": "12",
        "title": "الإنهاء",
        "body": [
          "نحتفظ بحق رفض الخدمة لأي عميل أو إنهاء التعاقد معه إذا قدّم معلومات كاذبة أو انخرط في سلوك مسيء أو غير لائق أو انتهك أياً من شروط الخدمة هذه.",
          "في حال إنهاء التعاقد لأسباب تُعزى إلى العميل، لن يُقدَّم أي استرداد للعمل الذي تم الشروع فيه. في حال إنهاء التعاقد بموجب تقديرنا دون مبرر، سيُقدَّم استرداد متناسب."
        ]
      },
      {
        "id": "13",
        "title": "القانون الحاكم",
        "body": [
          "تخضع شروط الخدمة هذه وتُفسَّر وفقاً لقوانين الإمارات العربية المتحدة. تخضع أي نزاعات ناشئة عن هذه الشروط أو خدماتنا للاختصاص الحصري لمحاكم دبي بالإمارات.",
          "إذا وجدت محكمة مختصة أن أي بند من هذه الشروط غير قابل للتنفيذ، يظل سريان الأحكام المتبقية بكامل قوته. تُشكّل هذه الشروط الاتفاقية الكاملة بينك وبين Zenith Dubai CV."
        ]
      },
      {
        "id": "14",
        "title": "معلومات التواصل",
        "body": [
          "إذا كانت لديك أي أسئلة حول شروط الخدمة هذه، أو ترغب في توضيح أي شيء قبل التعامل مع خدماتنا، يُرجى التواصل معنا على info@zenithdubaicv.com أو عبر واتساب على 9462 287 50 971+."
        ]
      }
    ]
  }
};

export const REFUND: Record<Lang, LegalDoc> = {
  "en": {
    "title": "Refund Policy",
    "updated": "Last updated: 19 October 2026",
    "intro": "We believe in complete transparency and your total confidence when investing in your career. Our refund policy is simple, unconditional, and designed to give you peace of mind.",
    "highlight": "Full refund within 7 days of purchase — no conditions, no exceptions.",
    "sections": [
      {
        "id": "01",
        "title": "7-Day Refund Window",
        "body": [
          "We offer a full, unconditional refund on all purchases made within 7 days. If for any reason you are not satisfied, simply contact us within 7 days of your purchase date and we will process a complete refund — no questions asked."
        ]
      },
      {
        "id": "02",
        "title": "How to Request a Refund",
        "body": [
          "To request a refund, please contact us at info@zenithdubaicv.com with your purchase details. We will acknowledge your request promptly and begin processing immediately."
        ]
      },
      {
        "id": "03",
        "title": "Where your refund is made",
        "body": [
          "Bought through PayPal on this site: email us your order reference and we refund it through PayPal. Bought through Gumroad: email us or reply to your Gumroad receipt, and we refund it through Gumroad.",
          "Either way, the money goes back to your original payment method."
        ]
      },
      {
        "id": "04",
        "title": "Processing Time",
        "body": [
          "All approved refunds are processed within 5–10 business days. The refund will be returned to your original payment method. Processing times may vary slightly depending on your bank or card issuer."
        ]
      },
      {
        "id": "05",
        "title": "Contact",
        "body": [
          "For any refund requests or questions regarding this policy, please reach us at info@zenithdubaicv.com. We are committed to resolving all matters promptly and professionally."
        ]
      }
    ]
  },
  "fr": {
    "title": "Politique de remboursement",
    "updated": "Dernière mise à jour : 19 octobre 2026",
    "intro": "Nous croyons en une transparence totale et en votre pleine confiance lorsque vous investissez dans votre carrière. Notre politique de remboursement est simple, inconditionnelle et conçue pour vous offrir une tranquillité d'esprit absolue.",
    "highlight": "Remboursement intégral dans les 7 jours suivant l'achat — sans conditions, sans exceptions.",
    "sections": [
      {
        "id": "01",
        "title": "Délai de remboursement de 7 jours",
        "body": [
          "Nous offrons un remboursement complet et inconditionnel sur tous les achats effectués dans les 7 jours. Si pour quelque raison que ce soit vous n'êtes pas satisfait, contactez-nous simplement dans les 7 jours suivant votre achat et nous traiterons un remboursement intégral — sans aucune question."
        ]
      },
      {
        "id": "02",
        "title": "Comment demander un remboursement",
        "body": [
          "Pour demander un remboursement, veuillez nous contacter à info@zenithdubaicv.com en indiquant les détails de votre achat. Nous accuserons réception de votre demande rapidement et commencerons le traitement immédiatement."
        ]
      },
      {
        "id": "03",
        "title": "Où se fait votre remboursement",
        "body": [
          "Achat via PayPal sur ce site : envoyez-nous votre référence de commande par e-mail et nous vous remboursons via PayPal. Achat via Gumroad : écrivez-nous ou répondez à votre reçu Gumroad, et nous vous remboursons via Gumroad.",
          "Dans les deux cas, l'argent revient sur votre moyen de paiement d'origine."
        ]
      },
      {
        "id": "04",
        "title": "Délai de traitement",
        "body": [
          "Tous les remboursements approuvés sont traités dans un délai de 5 à 10 jours ouvrables. Le remboursement sera restitué sur votre moyen de paiement d'origine. Les délais de traitement peuvent légèrement varier selon votre banque ou l'émetteur de votre carte."
        ]
      },
      {
        "id": "05",
        "title": "Contact",
        "body": [
          "Pour toute demande de remboursement ou question concernant cette politique, contactez-nous à info@zenithdubaicv.com. Nous nous engageons à résoudre toutes les questions rapidement et professionnellement."
        ]
      }
    ]
  },
  "ar": {
    "title": "سياسة الاسترداد",
    "updated": "آخر تحديث: 19 أكتوبر 2026",
    "intro": "نؤمن بالشفافية الكاملة وثقتك التامة عند الاستثمار في مسيرتك المهنية. سياسة الاسترداد لدينا بسيطة وغير مشروطة، وصُمِّمت لمنحك راحة البال الكاملة.",
    "highlight": "استرداد كامل خلال 7 أيام من الشراء — بلا شروط ولا استثناءات.",
    "sections": [
      {
        "id": "01",
        "title": "نافذة استرداد 7 أيام",
        "body": [
          "نقدّم استرداداً كاملاً وغير مشروط على جميع المشتريات خلال 7 أيام. إذا لم تكن راضياً لأي سبب كان، ما عليك سوى التواصل معنا خلال 7 أيام من تاريخ الشراء وسنُعالج استردادك الكامل فوراً — دون أي أسئلة."
        ]
      },
      {
        "id": "02",
        "title": "كيفية طلب الاسترداد",
        "body": [
          "لطلب الاسترداد، يُرجى التواصل معنا على info@zenithdubaicv.com مع تفاصيل مشترياتك. سنُقرّ بطلبك فوراً ونبدأ المعالجة على الفور."
        ]
      },
      {
        "id": "03",
        "title": "أين يتم استرداد المبلغ",
        "body": [
          "إن اشتريت عبر PayPal في هذا الموقع: أرسل إلينا رقم طلبك بالبريد وسنرد المبلغ عبر PayPal. وإن اشتريت عبر Gumroad: راسلنا أو أجب على إيصال Gumroad، وسنرد المبلغ عبر Gumroad.",
          "وفي الحالتين، يعود المبلغ إلى وسيلة الدفع الأصلية."
        ]
      },
      {
        "id": "04",
        "title": "مدة المعالجة",
        "body": [
          "تُعالَج جميع المبالغ المستردة المعتمدة خلال 5 إلى 10 أيام عمل. ستُعاد إلى طريقة الدفع الأصلية. قد تختلف أوقات المعالجة قليلاً بحسب بنكك أو جهة إصدار بطاقتك."
        ]
      },
      {
        "id": "05",
        "title": "التواصل",
        "body": [
          "لأي طلبات استرداد أو أسئلة حول هذه السياسة، يُرجى التواصل معنا على info@zenithdubaicv.com. نلتزم بحل جميع المسائل بسرعة واحترافية."
        ]
      }
    ]
  }
};
