"use client";
import { createContext, useCallback, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { LANG_COOKIE, getT, type Dict, type Lang } from "@/lib/i18n";

const Ctx = createContext<{ lang: Lang; t: Dict; setLang: (l: Lang) => void }>({ lang: "de", t: getT("de"), setLang: () => {} });

export function LangProvider({ initial, children }: { initial: Lang; children: React.ReactNode }) {
  const [lang, setL] = useState<Lang>(initial);
  const router = useRouter();
  const setLang = useCallback((l: Lang) => {
    document.cookie = `${LANG_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = l;
    setL(l);
    router.refresh();
  }, [router]);
  return <Ctx.Provider value={{ lang, t: getT(lang), setLang }}>{children}</Ctx.Provider>;
}
export const useLang = () => useContext(Ctx);
