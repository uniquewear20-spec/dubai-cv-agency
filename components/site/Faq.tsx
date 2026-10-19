// components/site/Faq.tsx — questions buyers ask before paying. Native <details>, so it works
// without JavaScript and with every assistive technology.
import React from "react";
import { PACKAGES } from "@/lib/packages";
import { pick, type L10n, type Lang } from "@/lib/site";

const gumroadLive = PACKAGES.some(p => p.gumroadUrl);

const QA: { q: L10n; a: L10n; link?: { href: string; label: L10n } }[] = [
  {
    q: { en: "What happens after I pay?", fr: "Que se passe-t-il après le paiement ?", ar: "ماذا يحدث بعد الدفع؟" },
    a: {
      en: "Your payment is confirmed with the payment provider before anything is marked as paid. You then see your order reference and a link to a short form where you upload your CV and tell us your target roles. We start as soon as we have your brief.",
      fr: "Votre paiement est confirmé auprès du prestataire avant d'être enregistré comme payé. Vous voyez ensuite votre référence de commande et un lien vers un court formulaire pour envoyer votre CV et vos postes cibles. Nous commençons dès réception de votre brief.",
      ar: "نتحقق من الدفع لدى مزوّد الدفع قبل اعتباره مدفوعاً. بعد ذلك ترى رقم طلبك ورابطاً إلى نموذج قصير لرفع سيرتك وتحديد الوظائف المستهدفة. نبدأ فور استلام معلوماتك.",
    },
  },
  {
    q: { en: "How quickly will I receive my CV?", fr: "Sous quel délai vais-je recevoir mon CV ?", ar: "متى أستلم سيرتي الذاتية؟" },
    a: {
      en: "The first draft arrives within 48 hours of receiving your complete brief. Language versions, LinkedIn work, applications and coaching follow on a schedule we agree with you.",
      fr: "Le premier jet arrive sous 48 heures après réception de votre brief complet. Les versions linguistiques, LinkedIn, les candidatures et le coaching suivent selon un calendrier convenu avec vous.",
      ar: "تصلك المسودة الأولى خلال 48 ساعة من استلام معلوماتك كاملة، ثم تتبعها النسخ اللغوية وملف لينكدإن وطلبات التوظيف والتدريب وفق جدول نتفق عليه معك.",
    },
  },
  {
    q: { en: "How many revisions are included?", fr: "Combien de révisions sont incluses ?", ar: "كم عدد التعديلات المشمولة؟" },
    a: {
      en: "Unlimited revisions for 30 days after delivery, within the scope of your original brief. A change of direction, such as a completely different industry, may be quoted as new work.",
      fr: "Révisions illimitées pendant 30 jours après la livraison, dans le cadre de votre brief initial. Un changement d'orientation, par exemple un tout autre secteur, peut faire l'objet d'un nouveau devis.",
      ar: "تعديلات غير محدودة لمدة 30 يوماً بعد التسليم ضمن نطاق معلوماتك الأصلية. أما تغيير الاتجاه، كالانتقال إلى مجال مختلف تماماً، فقد يُسعَّر كعمل جديد.",
    },
  },
  {
    q: { en: "Do you guarantee interviews or a job?", fr: "Garantissez-vous des entretiens ou un emploi ?", ar: "هل تضمنون المقابلات أو الحصول على وظيفة؟" },
    a: {
      en: "No. We write to give you the strongest possible case, but interviews, offers and salaries are decided by employers, so no honest service can guarantee them.",
      fr: "Non. Nous écrivons pour défendre au mieux votre candidature, mais les entretiens, les offres et les salaires sont décidés par les employeurs : aucun service honnête ne peut les garantir.",
      ar: "لا. نكتب لنقدّم أقوى صورة ممكنة لك، لكن المقابلات والعروض والرواتب يقررها أصحاب العمل، ولا يمكن لأي خدمة نزيهة أن تضمنها.",
    },
  },
  {
    q: { en: "Will my CV work with applicant tracking systems (ATS)?", fr: "Mon CV passera-t-il les logiciels de recrutement (ATS) ?", ar: "هل ستعمل سيرتي مع أنظمة تتبّع المتقدمين؟" },
    a: {
      en: "We write and format for them: real text, standard headings, and keywords from the roles you target, with a single-column version for online portals. Every system is configured differently, so we don't promise how a particular one will score you.",
      fr: "Nous rédigeons et mettons en forme pour eux : vrai texte, titres standard, mots-clés des postes visés, et une version en une colonne pour les portails. Chaque système étant paramétré différemment, nous ne promettons pas la note qu'il vous attribuera.",
      ar: "نكتب وننسّق مع مراعاتها: نص حقيقي وعناوين قياسية وكلمات مفتاحية من الوظائف المستهدفة، مع نسخة بعمود واحد لبوابات التوظيف. ولأن كل نظام مُعدّ بطريقة مختلفة، لا نعد بتقييم معيّن من أي نظام.",
    },
  },
  {
    q: { en: "How are the job applications handled?", fr: "Comment les candidatures sont-elles gérées ?", ar: "كيف تتم إدارة طلبات التوظيف؟" },
    a: {
      en: "We agree the target roles with you from your brief, tailor each application, and submit it for you where the employer accepts applications that way. Anything that needs your own login, an assessment or a security check comes back to you.",
      fr: "Nous définissons avec vous les postes cibles à partir de votre brief, adaptons chaque candidature et l'envoyons pour vous lorsque l'employeur accepte ce mode de candidature. Tout ce qui exige votre propre compte, un test ou une vérification de sécurité vous est renvoyé.",
      ar: "نتفق معك على الوظائف المستهدفة من معلوماتك، ونخصّص كل طلب ونقدّمه نيابةً عنك حيث يقبل صاحب العمل ذلك. وأي خطوة تتطلب حسابك الخاص أو اختباراً أو تحققاً أمنياً نعيدها إليك.",
    },
  },
  {
    q: { en: "How can I pay?", fr: "Comment puis-je payer ?", ar: "كيف يمكنني الدفع؟" },
    a: gumroadLive
      ? {
          en: "With PayPal, using your PayPal balance or a card where PayPal offers card checkout, charged in US dollars at the official AED rate. You can also pay through Gumroad by card, and with Apple Pay or Google Pay when your device and browser support them.",
          fr: "Avec PayPal, par solde PayPal ou carte lorsque PayPal le propose, débité en dollars US au taux officiel du dirham. Vous pouvez aussi payer via Gumroad par carte, et avec Apple Pay ou Google Pay si votre appareil et votre navigateur les prennent en charge.",
          ar: "عبر PayPal برصيدك أو ببطاقة حيث يتيح PayPal ذلك، ويُخصم المبلغ بالدولار الأمريكي وفق السعر الرسمي للدرهم. ويمكنك أيضاً الدفع عبر Gumroad بالبطاقة، وبـ Apple Pay أو Google Pay إذا دعمها جهازك ومتصفحك.",
        }
      : {
          en: "With PayPal, using your PayPal balance or a card where PayPal offers card checkout. Amounts are charged in US dollars at the official AED rate. Apple Pay and Google Pay aren't available on this site yet.",
          fr: "Avec PayPal, par solde PayPal ou carte lorsque PayPal le propose. Les montants sont débités en dollars US au taux officiel du dirham. Apple Pay et Google Pay ne sont pas encore disponibles sur ce site.",
          ar: "عبر PayPal برصيدك أو ببطاقة حيث يتيح PayPal ذلك. تُخصم المبالغ بالدولار الأمريكي وفق السعر الرسمي للدرهم. خدمتا Apple Pay وGoogle Pay غير متاحتين على الموقع بعد.",
        },
  },
  {
    q: { en: "What is your refund policy?", fr: "Quelle est votre politique de remboursement ?", ar: "ما هي سياسة الاسترداد؟" },
    a: {
      en: "You can ask for a full refund within 7 days of purchase. Refunds go back to the original payment method.",
      fr: "Vous pouvez demander un remboursement intégral dans les 7 jours suivant l'achat. Il est versé sur le moyen de paiement d'origine.",
      ar: "يمكنك طلب استرداد كامل خلال 7 أيام من الشراء، ويُعاد المبلغ إلى وسيلة الدفع الأصلية.",
    },
    link: { href: "/refund/", label: { en: "Read the refund policy", fr: "Lire la politique de remboursement", ar: "اقرأ سياسة الاسترداد" } },
  },
  {
    q: { en: "How do I receive The Global Horizon ebook?", fr: "Comment recevoir l'ebook The Global Horizon ?", ar: "كيف أستلم كتاب The Global Horizon؟" },
    a: {
      en: "It is included with Career Advantage, Career Automation and Executive Career Suite. Paid through Gumroad, you can download it straight after payment; paid through PayPal, we email you the PDF once your payment is confirmed.",
      fr: "Il est inclus dans Avantage Carrière, Carrière Automatisée et Suite Carrière Exécutive. Via Gumroad, vous le téléchargez dès le paiement ; via PayPal, nous vous envoyons le PDF par e-mail une fois le paiement confirmé.",
      ar: "الكتاب مشمول في الميزة المهنية وأتمتة المسار المهني والباقة التنفيذية المتكاملة. عند الدفع عبر Gumroad تنزّله فور الدفع، وعند الدفع عبر PayPal نرسل إليك ملف PDF بالبريد بعد تأكيد الدفع.",
    },
  },
  {
    q: { en: "What is the Zenith AI job agent, and what does it do?", fr: "Qu'est-ce que l'agent emploi Zenith AI, et que fait-il ?", ar: "ما هو وكيل الوظائف Zenith AI، وماذا يفعل؟" },
    a: {
      en: "It is a working tool at zenithdubaicv.com/agent. Anyone can use it free to search public job sources, rank listings against their CV, build template drafts and track applications with follow-up reminders; your CV stays in your browser. Career Automation and Executive Career Suite add Pro access: Zenith emails the applications you approve, with replies going to you. The agent never applies on job boards or employer portals for you, and nothing is sent without your approval.",
      fr: "C'est un outil en service sur zenithdubaicv.com/agent. Chacun peut l'utiliser gratuitement pour interroger des sources d'offres publiques, classer les annonces selon son CV, créer des brouillons modèles et suivre ses candidatures avec des rappels de relance ; votre CV reste dans votre navigateur. Carrière Automatisée et Suite Carrière Exécutive ajoutent l'accès Pro : Zenith envoie par e-mail les candidatures que vous validez, les réponses vous parvenant directement. L'agent ne postule jamais pour vous sur les sites d'emploi ou les portails employeurs, et rien n'est envoyé sans votre accord.",
      ar: "أداة تعمل فعلاً على zenithdubaicv.com/agent. يمكن لأي شخص استخدامها مجاناً للبحث في مصادر وظائف عامة، وترتيب الإعلانات حسب سيرته الذاتية، وإنشاء مسودات جاهزة، ومتابعة الطلبات مع تذكيرات؛ وتبقى سيرتك في متصفحك. وتضيف باقتا أتمتة المسار المهني والباقة التنفيذية المتكاملة وصول Pro: ترسل Zenith بالبريد الطلبات التي توافق عليها، مع وصول الردود إليك. لا يقدّم الوكيل أبداً نيابةً عنك في مواقع التوظيف أو بوابات أصحاب العمل، ولا يُرسل شيء دون موافقتك.",
    },
  },
  {
    q: { en: "Does the agent use AI to write my applications?", fr: "L'agent utilise-t-il l'IA pour rédiger mes candidatures ?", ar: "هل يستخدم الوكيل الذكاء الاصطناعي لكتابة طلباتي؟" },
    a: {
      en: "Pro includes AI-tailored drafts once they are switched on; the agent shows whether they are on. Each AI highlight must quote the CV line it comes from, and figures or skills your CV doesn't show are flagged for you to remove. To write a draft, your CV text (without your email or phone number) and the listing are sent to Anthropic, the AI provider, which deletes them within 30 days. Free drafts are built from your own CV lines without AI.",
      fr: "Pro inclut des brouillons adaptés par IA dès qu'ils sont activés ; l'agent indique s'ils le sont. Chaque point fort rédigé par l'IA doit citer la ligne du CV dont il vient, et les chiffres ou compétences absents de votre CV vous sont signalés pour que vous les retiriez. Pour rédiger un brouillon, le texte de votre CV (sans votre e-mail ni votre téléphone) et l'offre sont envoyés à Anthropic, le fournisseur d'IA, qui les supprime sous 30 jours. Les brouillons gratuits sont bâtis sur vos propres lignes de CV, sans IA.",
      ar: "يشمل Pro مسودات مكيّفة بالذكاء الاصطناعي عند تفعيلها، ويوضح الوكيل إن كانت مفعّلة. يجب أن تقتبس كل نقطة يكتبها الذكاء الاصطناعي السطر الذي جاءت منه في سيرتك، ويُنبَّه إلى أي رقم أو مهارة لا تُظهرها سيرتك لتحذفها. ولكتابة المسودة يُرسل نص سيرتك (دون بريدك أو هاتفك) والإعلان إلى Anthropic، مزوّد الذكاء الاصطناعي، التي تحذفهما خلال 30 يوماً. أما المسودات المجانية فتُبنى من أسطر سيرتك دون ذكاء اصطناعي.",
    },
  },
  {
    q: { en: "Is my information kept confidential?", fr: "Mes informations restent-elles confidentielles ?", ar: "هل تبقى معلوماتي سرية؟" },
    a: {
      en: "Yes. Your CV and details are used only to deliver your order, and are shared only with the services that run it, such as our email provider and the payment provider. We never publish client documents, and you can ask us to delete your data at any time.",
      fr: "Oui. Votre CV et vos informations servent uniquement à exécuter votre commande et ne sont partagés qu'avec les services nécessaires, comme notre messagerie et le prestataire de paiement. Nous ne publions jamais de documents clients et vous pouvez demander la suppression de vos données à tout moment.",
      ar: "نعم. نستخدم سيرتك ومعلوماتك فقط لتنفيذ طلبك، ولا نشاركها إلا مع الخدمات اللازمة لذلك مثل مزوّد البريد ومزوّد الدفع. لا ننشر وثائق العملاء أبداً، ويمكنك طلب حذف بياناتك في أي وقت.",
    },
    link: { href: "/privacy/", label: { en: "Read the privacy policy", fr: "Lire la politique de confidentialité", ar: "اقرأ سياسة الخصوصية" } },
  },
  {
    q: { en: "Which languages do you work in?", fr: "Dans quelles langues travaillez-vous ?", ar: "ما اللغات التي تعملون بها؟" },
    a: {
      en: "English, French and Arabic. Career Automation and Executive Career Suite also include versions of your CV in other languages (EN, FR, DE, AR, ES).",
      fr: "Français, anglais et arabe. Carrière Automatisée et Suite Carrière Exécutive incluent aussi des versions de votre CV dans d'autres langues (EN, FR, DE, AR, ES).",
      ar: "العربية والإنجليزية والفرنسية. وتشمل باقتا أتمتة المسار المهني والباقة التنفيذية المتكاملة نسخاً من سيرتك بلغات أخرى (EN، FR، DE، AR، ES).",
    },
  },
];

const H2: L10n = { en: "Questions before you buy", fr: "Vos questions avant l'achat", ar: "أسئلة قبل الشراء" };

export default function Faq({ lang }: { lang: Lang }) {
  return (
    <section id="faq" className="z-section" aria-labelledby="faq-title">
      <style href="zenith-faq" precedence="medium">{CSS}</style>
      <div className="z-wrap faq-grid">
        <h2 id="faq-title" className="z-h2">{pick(H2, lang)}</h2>
        <div className="faq-list">
          {QA.map(item => (
            <details key={item.q.en} className="faq-item z-details">
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
    </section>
  );
}

const CSS = `
.faq-grid{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.4fr);gap:clamp(28px,5vw,80px);align-items:start}
@media (max-width:900px){.faq-grid{grid-template-columns:1fr}}
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
