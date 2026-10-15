// components/ui/payment-badges.tsx
// "Secure checkout" row with the payment methods clients can use today.
//
// Checkout is PayPal: clients pay with a PayPal account, or with a Visa or
// Mastercard card as a guest. Only list methods that really work — Apple Pay
// and Google Pay may only be shown once a checkout that takes them is live
// (Apple's and Google's brand rules require it).
//
// Logo paths: Simple Icons v16.35.0 (CC0-1.0), traced from each brand's official
// artwork (Visa merchant signage, Mastercard Brand Center, PayPal). Shown in one
// colour so they sit quietly in the site palette in dark and light mode.

import { Lock } from "lucide-react";

type Lang = "en" | "ar" | "fr";

const G = "#C8A96E";

const TX: Record<"label" | "list", Record<Lang, string>> = {
  label: { en: "Secure checkout", fr: "Paiement sécurisé", ar: "دفع آمن" },
  list: { en: "Accepted payment methods", fr: "Moyens de paiement acceptés", ar: "طرق الدفع المقبولة" },
};

interface Method {
  name: string;
  viewBox: string; // cropped to the logo's own bounds
  ratio: number;   // width / height of the viewBox
  height: number;  // rendered height in px
  d: string;
  word?: string;   // shown next to monograms that are hard to read alone
}

const METHODS: Method[] = [
  {
    name: "Visa",
    viewBox: "0 8.124 24 7.751",
    ratio: 24 / 7.751,
    height: 9,
    d: "M9.112 8.262L5.97 15.758H3.92L2.374 9.775c-.094-.368-.175-.503-.461-.658C1.447 8.864.677 8.627 0 8.479l.046-.217h3.3a.904.904 0 01.894.764l.817 4.338 2.018-5.102zm8.033 5.049c.008-1.979-2.736-2.088-2.717-2.972.006-.269.262-.555.822-.628a3.66 3.66 0 011.913.336l.34-1.59a5.207 5.207 0 00-1.814-.333c-1.917 0-3.266 1.02-3.278 2.479-.012 1.079.963 1.68 1.698 2.04.756.367 1.01.603 1.006.931-.005.504-.602.725-1.16.734-.975.015-1.54-.263-1.992-.473l-.351 1.642c.453.208 1.289.39 2.156.398 2.037 0 3.37-1.006 3.377-2.564m5.061 2.447H24l-1.565-7.496h-1.656a.883.883 0 00-.826.55l-2.909 6.946h2.036l.405-1.12h2.488zm-2.163-2.656l1.02-2.815.588 2.815zm-8.16-4.84l-1.603 7.496H8.34l1.605-7.496z",
  },
  {
    name: "Mastercard",
    viewBox: "0 4.584 24 14.831",
    ratio: 24 / 14.831,
    height: 13,
    d: "M11.343 18.031c.058.049.12.098.181.146-1.177.783-2.59 1.238-4.107 1.238C3.32 19.416 0 16.096 0 12c0-4.095 3.32-7.416 7.416-7.416 1.518 0 2.931.456 4.105 1.238-.06.051-.12.098-.165.15C9.6 7.489 8.595 9.688 8.595 12c0 2.311 1.001 4.51 2.748 6.031zm5.241-13.447c-1.52 0-2.931.456-4.105 1.238.06.051.12.098.165.15C14.4 7.489 15.405 9.688 15.405 12c0 2.31-1.001 4.507-2.748 6.031-.058.049-.12.098-.181.146 1.177.783 2.588 1.238 4.107 1.238C20.68 19.416 24 16.096 24 12c0-4.094-3.32-7.416-7.416-7.416zM12 6.174c-.096.075-.189.15-.28.231C10.156 7.764 9.169 9.765 9.169 12c0 2.236.987 4.236 2.551 5.595.09.08.185.158.28.232.096-.074.189-.152.28-.232 1.563-1.359 2.551-3.359 2.551-5.595 0-2.235-.987-4.236-2.551-5.595-.09-.08-.184-.156-.28-.231z",
  },
  {
    name: "PayPal",
    viewBox: "1.82 0 20.358 24",
    ratio: 20.358 / 24,
    height: 12,
    d: "M15.607 4.653H8.941L6.645 19.251H1.82L4.862 0h7.995c3.754 0 6.375 2.294 6.473 5.513-.648-.478-2.105-.86-3.722-.86m6.57 5.546c0 3.41-3.01 6.853-6.958 6.853h-2.493L11.595 24H6.74l1.845-11.538h3.592c4.208 0 7.346-3.634 7.153-6.949a5.24 5.24 0 0 1 2.848 4.686M9.653 5.546h6.408c.907 0 1.942.222 2.363.541-.195 2.741-2.655 5.483-6.441 5.483H8.714Z",
    word: "PayPal",
  },
];

export default function PaymentBadges({
  dark,
  lang,
  compact = false,
  className = "",
}: {
  dark: boolean;
  lang: Lang;
  compact?: boolean;
  className?: string;
}) {
  const isAr = lang === "ar";
  const ink = dark ? "#B8A89C" : "#6A5A50";
  const label = dark ? "#7A6E66" : "#8A7E74";
  const chipBorder = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const chipBg = dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.92)";
  const scale = compact ? 0.9 : 1;

  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-x-3 gap-y-2 ${className}`}
      dir={isAr ? "rtl" : "ltr"}
    >
      <span
        className="flex items-center gap-1.5 text-[9px] font-medium uppercase"
        style={{ color: label, fontFamily: "sans-serif", letterSpacing: isAr ? "0.05em" : "0.22em" }}
      >
        <Lock size={10} strokeWidth={1.75} color={G} aria-hidden="true" />
        {TX.label[lang]}
      </span>
      <ul
        aria-label={TX.list[lang]}
        className="flex items-center gap-1.5"
        dir="ltr"
        style={{ listStyle: "none", padding: 0, margin: 0 }}
      >
        {METHODS.map(m => {
          const h = Math.round(m.height * scale * 10) / 10;
          return (
            <li
              key={m.name}
              className="flex items-center justify-center gap-1 rounded-[5px] px-2"
              style={{ height: compact ? 22 : 26, minWidth: compact ? 38 : 44, border: `1px solid ${chipBorder}`, background: chipBg, color: ink }}
            >
              <svg
                role="img"
                aria-label={m.name}
                viewBox={m.viewBox}
                width={Math.round(h * m.ratio * 10) / 10}
                height={h}
                fill="currentColor"
                focusable="false"
              >
                <path d={m.d} />
              </svg>
              {m.word && (
                <span aria-hidden="true" className="font-semibold" style={{ fontSize: compact ? "9px" : "10px", fontFamily: "sans-serif", letterSpacing: "0.01em" }}>
                  {m.word}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
