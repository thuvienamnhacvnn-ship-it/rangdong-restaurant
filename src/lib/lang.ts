import { cookies } from "next/headers";
import { LANG_COOKIE, type Lang, getT } from "./i18n";

export async function getLang(): Promise<Lang> {
  const c = (await cookies()).get(LANG_COOKIE)?.value;
  return c === "de" ? "de" : "vi";
}
export async function getServerT() {
  const lang = await getLang();
  return { lang, t: getT(lang) };
}
