// lib/portfolios.ts
// Every portfolio website shown in the "Portfolio websites" exhibition.
//
// Two kinds, always labelled as such on the site:
// - "live":    a real website of a real professional, shown as published (iframed from its own URL).
// - "concept": a concept design by Zenith Dubai CV for a fictional person. Each one lives at
//              /samples/<slug>.html and says on the page that the person, employers, clients and
//              figures are illustrative and that the portrait was generated with AI.
//
// Every number shown in the exhibition (headline, filter counts, "07 / <total>") is derived from
// this list, so adding or removing an entry keeps the counts honest.

export type Lang = "en" | "ar" | "fr";
export type Kind = "live" | "concept";
export type Category = "hospitality" | "health" | "business" | "built" | "creative" | "music" | "science";
export type Device = "desktop" | "tablet" | "mobile";

type T = Record<Lang, string>;

export interface Portfolio {
  slug: string;
  name: string;
  /** Shown first, in the order of the list, and grouped as "Featured" in the index. */
  featured?: boolean;
  kind: Kind;
  category: Category;
  role: T;
  /** The one idea the site is built around (concepts), or "Published portfolio" (live sites). */
  idea: T;
  /** One sentence on what the site actually does. */
  line: T;
  /** Where the website itself lives. */
  url: string;
  /** The site's own background colour, shown behind its preview while it loads. */
  tone: string;
  /** Captures that exist in /public/samples/previews (live sites cannot be recaptured from here). */
  stills: Device[];
  /** A short recording of the opening (desktop), /public/samples/previews/<slug>-loop.webm and .mp4. */
  loop: boolean;
}

const ALL: Device[] = ["desktop", "tablet", "mobile"];

const PUBLISHED: T = { en: "Published portfolio", fr: "Portfolio publié", ar: "ملف مهني منشور" };

export const PORTFOLIOS: Portfolio[] = [
  // ── Featured, in this order (chosen by Zenith Dubai CV) ──────────────────────────────────────
  {
    slug: "wasim-akram", name: "Wasim Akram", featured: true, kind: "live", category: "built", url: "https://wasim-akram-portfolio.netlify.app/",
    tone: "#1E1914", stills: ["desktop", "mobile"], loop: false,
    role: { en: "3D Visualizer & Interior Designer", fr: "Visualiseur 3D et architecte d'intérieur", ar: "مصمم مرئيات ثلاثية الأبعاد ومصمم داخلي" },
    idea: PUBLISHED,
    line: { en: "His own website, shown live exactly as he published it.", fr: "Son propre site, présenté en direct tel qu'il l'a publié.", ar: "موقعه الخاص، معروض مباشرةً كما نشره تماماً." },
  },
  {
    slug: "awa-ndiaye", name: "Awa Ndiaye", featured: true, kind: "concept", category: "creative", url: "/samples/awa-ndiaye.html",
    tone: "#E7E2DA", stills: ALL, loop: true,
    role: { en: "Model & Brand Ambassador", fr: "Mannequin et ambassadrice de marque", ar: "عارضة أزياء وسفيرة علامات" },
    idea: { en: "The campaign", fr: "La campagne", ar: "الحملة" },
    line: { en: "A flash, a masthead and the model in front of it; then looks, a comp card and covers.", fr: "Un flash, un titre de magazine et le mannequin devant ; puis les looks, la composite et les couvertures.", ar: "ومضة فلاش وعنوان مجلة والعارضة أمامه، ثم الإطلالات وبطاقة التعريف والأغلفة." },
  },
  {
    slug: "ananya-rao", name: "Ananya Rao", featured: true, kind: "concept", category: "music", url: "/samples/ananya-rao.html",
    tone: "#0E0C0B", stills: ALL, loop: true,
    role: { en: "Dancer & Choreographer", fr: "Danseuse et chorégraphe", ar: "راقصة ومصمّمة رقصات" },
    idea: { en: "Chronophotography", fr: "Chronophotographie", ar: "التصوير المتتابع" },
    line: { en: "A figure made of liquid particles, nine exposures of one turn, and floor patterns walked by a dot.", fr: "Une silhouette en particules liquides, neuf poses d'un même tour, et des tracés au sol parcourus par un point.", ar: "هيئة من جزيئات سائلة، وتسع لقطات لدورة واحدة، ومسارات على الأرض تقطعها نقطة." },
  },
  {
    slug: "kofi-mensah", name: "Kofi Mensah", featured: true, kind: "concept", category: "music", url: "/samples/kofi-mensah.html",
    tone: "#08070A", stills: ALL, loop: true,
    role: { en: "DJ & Producer", fr: "DJ et producteur", ar: "دي جي ومنتج موسيقي" },
    idea: { en: "The crate", fr: "Le bac à disques", ar: "صندوق الأسطوانات" },
    line: { en: "A record floats above his fingertips, then flies into a crate of releases you can flip through.", fr: "Un disque flotte au-dessus de ses doigts puis s'envole vers un bac de sorties que l'on feuillette.", ar: "أسطوانة تطفو فوق أطراف أصابعه ثم تطير إلى صندوق إصدارات يمكنك تقليبها." },
  },
  {
    slug: "mei-lin-zhou", name: "Mei Lin Zhou", featured: true, kind: "concept", category: "music", url: "/samples/mei-lin-zhou.html",
    tone: "#F3EEE6", stills: ALL, loop: true,
    role: { en: "Concert Pianist & Composer", fr: "Pianiste concertiste et compositrice", ar: "عازفة بيانو ومؤلفة موسيقية" },
    idea: { en: "Resonance", fr: "Résonance", ar: "الرنين" },
    line: { en: "Strings you can play stand behind her; the season is set on a staff and the recordings as Chladni figures.", fr: "Des cordes à jouer se tiennent derrière elle ; la saison est écrite sur une portée, les disques en figures de Chladni.", ar: "أوتار يمكنك العزف عليها خلفها، والموسم مدوَّن على مدرج موسيقي، والتسجيلات بأشكال كلادني." },
  },
  {
    slug: "kenji-watanabe", name: "Kenji Watanabe", featured: true, kind: "concept", category: "creative", url: "/samples/kenji-watanabe.html",
    tone: "#0C0C0D", stills: ALL, loop: true,
    role: { en: "Portrait Photographer", fr: "Photographe portraitiste", ar: "مصوّر بورتريه" },
    idea: { en: "Focus", fr: "La mise au point", ar: "ضبط التركيز" },
    line: { en: "A curved strip of frames pulls focus on the centre one, then a contact sheet with loupe and grease pencil.", fr: "Une bande d'images incurvée fait le point sur celle du centre, puis une planche-contact avec loupe et crayon gras.", ar: "شريط صور منحنٍ يتّضح فيه الإطار الأوسط، ثم ورقة تلامس مع عدسة مكبّرة وقلم تأشير." },
  },

  // ── Hospitality & travel ──────────────────────────────────────────────────────────────────────
  {
    slug: "layla-haddad", name: "Layla Haddad", kind: "concept", category: "hospitality", url: "/samples/layla-haddad.html",
    tone: "#1C1915", stills: ALL, loop: true,
    role: { en: "Hotel General Manager", fr: "Directrice générale d'hôtel", ar: "مديرة عامة لفندق فاخر" },
    idea: { en: "The arrival", fr: "L'arrivée", ar: "الوصول" },
    line: { en: "Bronze doors open onto a lit arch, and a lift's floor indicator guides you through the hotel.", fr: "Des portes de bronze s'ouvrent sur une arche de lumière, et l'indicateur d'étage d'un ascenseur guide la visite.", ar: "أبواب برونزية تنفتح على قوس مضيء، ومؤشّر طوابق المصعد يرشدك في أرجاء الفندق." },
  },
  {
    slug: "julien-arnaud", name: "Julien Arnaud", kind: "concept", category: "hospitality", url: "/samples/julien-arnaud.html",
    tone: "#0F0E0D", stills: ALL, loop: true,
    role: { en: "Chef de cuisine", fr: "Chef de cuisine", ar: "رئيس الطهاة" },
    idea: { en: "Steam", fr: "La vapeur", ar: "البخار" },
    line: { en: "Steam rises over the pass as you scroll, and his career is plated as a tasting menu.", fr: "La vapeur monte au-dessus du passe au fil du défilement, et sa carrière est dressée comme un menu dégustation.", ar: "يتصاعد البخار فوق منصة التقديم مع التمرير، وتُقدَّم مسيرته المهنية كقائمة تذوّق." },
  },
  {
    slug: "ji-woo-han", name: "Ji-woo Han", kind: "concept", category: "hospitality", url: "/samples/ji-woo-han.html",
    tone: "#F3ECE1", stills: ALL, loop: true,
    role: { en: "Restaurant General Manager", fr: "Directrice générale de restaurant", ar: "مديرة عامة لمطعم" },
    idea: { en: "One night of service", fr: "Une nuit de service", ar: "ليلة خدمة واحدة" },
    line: { en: "Rolling clock digits run one night from 16:00 to 01:00, and every section is an hour of service.", fr: "Des chiffres d'horloge roulants racontent une nuit, de 16 h à 1 h, et chaque section est une heure de service.", ar: "أرقام ساعة متدحرجة تروي ليلة كاملة من 16:00 إلى 01:00، وكل قسم ساعة من الخدمة." },
  },
  {
    slug: "lucas-ferreira", name: "Lucas Ferreira", kind: "concept", category: "hospitality", url: "/samples/lucas-ferreira.html",
    tone: "#F5EEE4", stills: ALL, loop: true,
    role: { en: "Head Sommelier", fr: "Chef sommelier", ar: "رئيس قسم المشروبات" },
    idea: { en: "The pour", fr: "Le service", ar: "السكب" },
    line: { en: "Wine rises up the page as you scroll, then an aroma dial and a cellar of vintages.", fr: "Le vin monte dans la page au fil du défilement, puis une roue des arômes et une cave de millésimes.", ar: "يرتفع النبيذ في الصفحة مع التمرير، ثم عجلة للروائح وقبو للمعتّقات." },
  },
  {
    slug: "zofia-nowak", name: "Zofia Nowak", kind: "concept", category: "hospitality", url: "/samples/zofia-nowak.html",
    tone: "#F4F0E8", stills: ALL, loop: true,
    role: { en: "Head of Floor", fr: "Responsable de salle", ar: "مسؤولة صالة المطعم" },
    idea: { en: "The floor", fr: "La salle", ar: "الصالة" },
    line: { en: "A fine-line plan of the dining room, where one loop of her service draws itself between the tables.", fr: "Le plan au trait de la salle, où une boucle de son service se dessine entre les tables.", ar: "مخطط دقيق لصالة المطعم، يرسم فيه مسار خدمتها نفسه بين الطاولات." },
  },
  {
    slug: "mateo-herrera", name: "Mateo Herrera", kind: "concept", category: "hospitality", url: "/samples/mateo-herrera.html",
    tone: "#EE9E9D", stills: ALL, loop: true,
    role: { en: "Bar Director & Mixologist", fr: "Directeur de bar et mixologue", ar: "مدير بار وخبير مزج مشروبات" },
    idea: { en: "Light and shade", fr: "Ombre et lumière", ar: "الضوء والظل" },
    line: { en: "A pink wall, a window and a sun you move through the bar day: the light, the shadows and the drink change with the hour.", fr: "Un mur rose, une fenêtre et un soleil que l'on déplace au fil de la journée du bar : la lumière, les ombres et le cocktail changent avec l'heure.", ar: "جدار وردي ونافذة وشمس تحرّكها عبر يوم البار، فيتغيّر الضوء والظلال والمشروب مع الساعة." },
  },
  {
    slug: "marco-bellini", name: "Marco Bellini", kind: "concept", category: "hospitality", url: "/samples/marco-bellini.html",
    tone: "#0F3B2E", stills: ALL, loop: true,
    role: { en: "Chief Concierge", fr: "Chef concierge", ar: "رئيس الكونسيرج" },
    idea: { en: "Consider it done", fr: "C'est comme si c'était fait", ar: "اعتبره منجزاً" },
    line: { en: "A 3D rolodex of fulfilled requests that turns as you scroll or drag.", fr: "Un rolodex en 3D de demandes exaucées, qui tourne au défilement ou au glisser.", ar: "دوّار بطاقات ثلاثي الأبعاد لطلبات تمّ تنفيذها، يدور مع التمرير أو السحب." },
  },
  {
    slug: "maria-dela-cruz", name: "Maria Dela Cruz", kind: "concept", category: "hospitality", url: "/samples/maria-dela-cruz.html",
    tone: "#F2CDB8", stills: ALL, loop: true,
    role: { en: "Cabin Services Manager", fr: "Responsable du service cabine", ar: "مديرة خدمات المقصورة" },
    idea: { en: "Above the clouds", fr: "Au-dessus des nuages", ar: "فوق الغيوم" },
    line: { en: "The page is the climb: a live sky moves from dawn to night while the clouds part around her.", fr: "La page est une ascension : le ciel passe de l'aube à la nuit et les nuages s'écartent autour d'elle.", ar: "الصفحة رحلة صعود: سماء حيّة تنتقل من الفجر إلى الليل والغيوم تنفرج من حولها." },
  },
  {
    slug: "rashid-al-hammadi", name: "Rashid Al Hammadi", kind: "concept", category: "hospitality", url: "/samples/rashid-al-hammadi.html",
    tone: "#070B18", stills: ALL, loop: true,
    role: { en: "Long-haul Airline Captain", fr: "Commandant de bord long-courrier", ar: "قائد طائرة للرحلات الطويلة" },
    idea: { en: "One night flight", fr: "Un vol de nuit", ar: "رحلة ليلية" },
    line: { en: "A night cabin and a row of aircraft windows tell one Dubai to Los Angeles flight, ending on final approach.", fr: "Une cabine de nuit et une rangée de hublots racontent un Dubaï–Los Angeles, jusqu'à l'approche finale.", ar: "مقصورة ليلية وصفّ من نوافذ الطائرة يرويان رحلة من دبي إلى لوس أنجلوس، حتى الاقتراب النهائي." },
  },

  // ── Healthcare ────────────────────────────────────────────────────────────────────────────────
  {
    slug: "amira-soliman", name: "Dr Amira Soliman", kind: "concept", category: "health", url: "/samples/amira-soliman.html",
    tone: "#F6F9FA", stills: ALL, loop: true,
    role: { en: "Interventional Cardiologist", fr: "Cardiologue interventionnelle", ar: "استشارية القلب التداخلية" },
    idea: { en: "Rhythm", fr: "Le rythme", ar: "النبض" },
    line: { en: "Pulsing rings slow from 110 to 60 beats a minute as you scroll: calm as a clinical outcome.", fr: "Des anneaux pulsent et ralentissent de 110 à 60 battements par minute : le calme comme résultat clinique.", ar: "حلقات نابضة تتباطأ من 110 إلى 60 نبضة في الدقيقة مع التمرير: الهدوء نتيجةً سريرية." },
  },
  {
    slug: "grace-wanjiku", name: "Dr Grace Wanjiku", kind: "concept", category: "health", url: "/samples/grace-wanjiku.html",
    tone: "#FBF6EE", stills: ALL, loop: true,
    role: { en: "Paediatric Surgeon", fr: "Chirurgienne pédiatrique", ar: "جرّاحة أطفال" },
    idea: { en: "The stitch", fr: "Le surjet", ar: "الغرزة" },
    line: { en: "A running suture sews the page together, section by section, and ties off at the contact form.", fr: "Un surjet coud la page, section après section, et se noue au formulaire de contact.", ar: "خيط جراحي متصل يخيط الصفحة قسماً بعد قسم، ويُعقد عند نموذج التواصل." },
  },

  // ── Business, finance & law ───────────────────────────────────────────────────────────────────
  {
    slug: "hannah-becker", name: "Hannah Becker", kind: "concept", category: "business", url: "/samples/hannah-becker.html",
    tone: "#F3F0E8", stills: ALL, loop: true,
    role: { en: "Group Chief Executive", fr: "Directrice générale de groupe", ar: "الرئيسة التنفيذية للمجموعة" },
    idea: { en: "The long view", fr: "La vision longue", ar: "النظرة البعيدة" },
    line: { en: "A chief executive's letter, with a chart that starts on one bad quarter and steps back to the decade.", fr: "Une lettre de dirigeante, avec un graphique qui part d'un mauvais trimestre et recule jusqu'à la décennie.", ar: "رسالة من الرئيسة التنفيذية، ومخطط يبدأ من ربع سنة سيئ ثم يتراجع ليُظهر العقد كاملاً." },
  },
  {
    slug: "arjun-nair", name: "Arjun Nair", kind: "concept", category: "business", url: "/samples/arjun-nair.html",
    tone: "#060606", stills: ALL, loop: true,
    role: { en: "Managing Director, M&A", fr: "Directeur général, fusions et acquisitions", ar: "مدير عام، الاندماج والاستحواذ" },
    idea: { en: "Merge", fr: "La fusion", ar: "الاندماج" },
    line: { en: "Liquid-metal shapes meet and merge as you scroll, and the two names in each deal slide into one.", fr: "Des formes de métal liquide se rejoignent au défilement, et les deux noms de chaque opération n'en font plus qu'un.", ar: "أشكال من المعدن السائل تلتقي وتندمج مع التمرير، واسما كل صفقة ينزلقان ليصبحا اسماً واحداً." },
  },
  {
    slug: "noura-al-mazrouei", name: "Noura Al Mazrouei", kind: "concept", category: "business", url: "/samples/noura-al-mazrouei.html",
    tone: "#ECE4D4", stills: ALL, loop: true,
    role: { en: "Founder & CEO, real-estate developer", fr: "Fondatrice et PDG, promotion immobilière", ar: "المؤسِّسة والرئيسة التنفيذية لشركة تطوير عقاري" },
    idea: { en: "Rising", fr: "L'élévation", ar: "الارتفاع" },
    line: { en: "Her buildings rise year by year as a to-scale skyline, and the whole site mirrors into Arabic.", fr: "Ses immeubles s'élèvent année après année, à l'échelle, et tout le site bascule en arabe, en miroir.", ar: "مبانيها ترتفع عاماً بعد عام في أفق مرسوم بالمقياس، والموقع كله ينعكس إلى العربية." },
  },
  {
    slug: "alexei-morozov", name: "Alexei Morozov", kind: "concept", category: "business", url: "/samples/alexei-morozov.html",
    tone: "#0A1A2B", stills: ALL, loop: true,
    role: { en: "Founder & CEO, logistics software", fr: "Fondateur et PDG, logiciel logistique", ar: "المؤسس والرئيس التنفيذي لشركة برمجيات لوجستية" },
    idea: { en: "Flow", fr: "Le flux", ar: "التدفّق" },
    line: { en: "Containers flow along sea lanes on a dotted world map; close Suez and they reroute round the Cape.", fr: "Des conteneurs suivent les routes maritimes d'une carte en points ; fermez Suez et ils contournent le Cap.", ar: "حاويات تتدفّق على خطوط الملاحة فوق خريطة منقّطة للعالم؛ أغلق قناة السويس فتلتفّ حول رأس الرجاء الصالح." },
  },
  {
    slug: "ines-ben-salah", name: "Inès Ben Salah", kind: "concept", category: "business", url: "/samples/ines-ben-salah.html",
    tone: "#F5F2EC", stills: ALL, loop: true,
    role: { en: "Strategy Partner", fr: "Associée en stratégie", ar: "شريكة في الاستراتيجية" },
    idea: { en: "Terrain", fr: "Le terrain", ar: "التضاريس" },
    line: { en: "A generated topographic map with no-go zones; the route re-plans around them as you add constraints.", fr: "Une carte topographique générée avec des zones interdites ; l'itinéraire se recalcule quand on ajoute des contraintes.", ar: "خريطة طبوغرافية مولَّدة بمناطق محظورة، والمسار يعيد التخطيط حولها كلما أضفت قيوداً." },
  },
  {
    slug: "faisal-al-qahtani", name: "Faisal Al Qahtani", kind: "concept", category: "business", url: "/samples/faisal-al-qahtani.html",
    tone: "#0E3A2C", stills: ALL, loop: true,
    role: { en: "Partner, corporate law", fr: "Associé, droit des affaires", ar: "شريك، قانون الشركات" },
    idea: { en: "The word", fr: "Le mot", ar: "الكلمة" },
    line: { en: "العدل is written stroke by stroke, and the site reads like a contract, in English and Arabic.", fr: "العدل s'écrit trait après trait, et le site se lit comme un contrat, en anglais et en arabe.", ar: "كلمة «العدل» تُكتب حرفاً حرفاً، والموقع يُقرأ كعقد بالإنجليزية والعربية." },
  },

  // ── Architecture, engineering & tech ──────────────────────────────────────────────────────────
  {
    slug: "thomas-whitaker", name: "Thomas Whitaker", kind: "concept", category: "built", url: "/samples/thomas-whitaker.html",
    tone: "#ECE9E2", stills: ALL, loop: true,
    role: { en: "Architect", fr: "Architecte", ar: "مهندس معماري" },
    idea: { en: "Every building is a sundial", fr: "Chaque bâtiment est un cadran solaire", ar: "كل مبنى مزولة شمسية" },
    line: { en: "His name stands as a model in the sun; the light moves as you scroll and shadows sweep a drawing set.", fr: "Son nom devient une maquette au soleil ; la lumière tourne au défilement et les ombres balaient les plans.", ar: "اسمه مجسّم تحت الشمس؛ يتحرّك الضوء مع التمرير وتعبر الظلال لوحات الرسومات." },
  },
  {
    slug: "youssef-haddadin", name: "Youssef Haddadin", kind: "concept", category: "built", url: "/samples/youssef-haddadin.html",
    tone: "#BDBAB3", stills: ALL, loop: true,
    role: { en: "Project Director, civil & structural", fr: "Directeur de projets, génie civil et structures", ar: "مدير مشاريع، الهندسة المدنية والإنشائية" },
    idea: { en: "Load path", fr: "Le cheminement des charges", ar: "مسار الأحمال" },
    line: { en: "A truss draws itself and you can load it: the forces are solved live and flow down to the footings.", fr: "Un treillis se dessine et l'on peut le charger : les efforts sont calculés en direct jusqu'aux fondations.", ar: "جملون يرسم نفسه ويمكنك تحميله: تُحسب القوى مباشرةً وتتدفّق حتى الأساسات." },
  },
  {
    slug: "daniel-okafor", name: "Daniel Okafor", kind: "concept", category: "built", url: "/samples/daniel-okafor.html",
    tone: "#EDECE7", stills: ALL, loop: true,
    role: { en: "Principal AI Engineer", fr: "Ingénieur principal en IA", ar: "مهندس ذكاء اصطناعي رئيسي" },
    idea: { en: "Noise to signal", fr: "Du bruit au signal", ar: "من الضجيج إلى الإشارة" },
    line: { en: "His portrait is sampled out of pure noise on a real diffusion schedule as you scroll.", fr: "Son portrait émerge du bruit pur, selon un vrai calendrier de diffusion, au fil du défilement.", ar: "صورته تتشكّل من ضجيج خالص وفق جدول انتشار حقيقي مع التمرير." },
  },

  // ── Creative & media ──────────────────────────────────────────────────────────────────────────
  {
    slug: "karim-benjelloun", name: "Karim Benjelloun", kind: "concept", category: "creative", url: "/samples/karim-benjelloun.html",
    tone: "#EFEAE0", stills: ALL, loop: true,
    role: { en: "Film Director", fr: "Réalisateur", ar: "مخرج سينمائي" },
    idea: { en: "The storyboard", fr: "Le storyboard", ar: "اللوحات المصوّرة" },
    line: { en: "His close-up develops out of a pencil drawing, and five films play as animatics cut from his storyboard panels.", fr: "Son gros plan naît d'un dessin au crayon, et cinq films défilent en animatiques montés à partir de ses planches.", ar: "لقطته القريبة تنبثق من رسم بالقلم، وخمسة أفلام تُعرض كمشاهد متحركة مركّبة من لوحاته المرسومة." },
  },
  {
    slug: "freja-lindqvist", name: "Freja Lindqvist", kind: "concept", category: "creative", url: "/samples/freja-lindqvist.html",
    tone: "#E6E0D4", stills: ALL, loop: true,
    role: { en: "Creative Director", fr: "Directrice de création", ar: "مديرة إبداعية" },
    idea: { en: "Moodboard", fr: "Le moodboard", ar: "لوحة الإلهام" },
    line: { en: "A moodboard you can rearrange turns into the finished campaign poster.", fr: "Un moodboard que l'on peut réarranger devient l'affiche de campagne finale.", ar: "لوحة إلهام يمكنك إعادة ترتيبها تتحوّل إلى ملصق الحملة النهائي." },
  },
  {
    slug: "sofia-bianchi", name: "Sofia Bianchi", kind: "concept", category: "creative", url: "/samples/sofia-bianchi.html",
    tone: "#F26B4F", stills: ALL, loop: true,
    role: { en: "Food & Travel Creator", fr: "Créatrice de contenu cuisine et voyage", ar: "صانعة محتوى في الطعام والسفر" },
    idea: { en: "Stickers", fr: "Les autocollants", ar: "الملصقات" },
    line: { en: "A die-cut sticker of her slaps onto the page, with stickers you can move and a pizza-chart media kit.", fr: "Un autocollant découpé à son effigie se colle sur la page, avec des stickers à déplacer et un kit média en pizza.", ar: "ملصق مقصوص لها يُلصق على الصفحة، مع ملصقات يمكن تحريكها وملف إعلامي بمخطط على شكل بيتزا." },
  },

  // ── Music & performance ───────────────────────────────────────────────────────────────────────
  {
    slug: "valentina-rios", name: "Valentina Ríos", kind: "concept", category: "music", url: "/samples/valentina-rios.html",
    tone: "#060405", stills: ALL, loop: true,
    role: { en: "Singer", fr: "Chanteuse", ar: "مغنّية" },
    idea: { en: "Spotlight", fr: "La poursuite", ar: "بقعة الضوء" },
    line: { en: "The house lights go down and a follow spot finds her; the lyrics light up word by word as you scroll.", fr: "La salle s'éteint et une poursuite la trouve ; les paroles s'allument mot à mot au défilement.", ar: "تنطفئ أضواء القاعة ويجدها ضوء المتابعة، وتضيء كلمات الأغنية كلمةً كلمة مع التمرير." },
  },

  // ── Science & research ────────────────────────────────────────────────────────────────────────
  {
    slug: "imogen-hale", name: "Dr Imogen Hale", kind: "concept", category: "science", url: "/samples/imogen-hale.html",
    tone: "#1D2B44", stills: ALL, loop: true,
    role: { en: "Ornithologist & Behavioural Ecologist", fr: "Ornithologue et écologue du comportement", ar: "عالمة طيور وبيئة سلوكية" },
    idea: { en: "The murmuration", fr: "La murmuration", ar: "سرب الزرازير" },
    line: { en: "Thousands of starlings form her name over the reeds; then a small model shows why each bird watches about seven neighbours.", fr: "Des milliers d'étourneaux forment son nom au-dessus des roseaux ; puis un petit modèle montre pourquoi chaque oiseau observe environ sept voisins.", ar: "آلاف الزرازير تشكّل اسمها فوق القصب، ثم نموذج صغير يبيّن لماذا يراقب كل طائر نحو سبعة من جيرانه." },
  },
];

export const CATEGORIES: Category[] = ["hospitality", "health", "business", "built", "creative", "music", "science"];

const P = "/samples/previews/";
/** Captures of each website's first screen, taken from the real pages. */
export const preview = {
  desktop: (slug: string) => `${P}${slug}-d.webp`,   // 1440 × 900 viewport
  tablet: (slug: string) => `${P}${slug}-tab.webp`,  // 820 × 1180 viewport
  mobile: (slug: string) => `${P}${slug}-m.webp`,    // 390 × 844 viewport
  thumb: (slug: string) => `${P}${slug}-t.webp`,     // 288 × 180, the desktop capture for the wheel's gondolas
  loop: (slug: string, ext: "webm" | "mp4") => `${P}${slug}-loop.${ext}`, // 960 × 600, the opening seconds (VP9 and H.264)
};

/** Address shown in the stage and viewer address bars. */
export function displayUrl(site: Portfolio): string {
  return site.kind === "live"
    ? site.url.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : `zenithdubaicv.com/samples/${site.slug}`;
}
