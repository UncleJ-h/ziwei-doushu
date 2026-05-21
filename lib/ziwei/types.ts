export interface BirthInfo {
  year: number; // Gregorian year
  month: number; // Gregorian month (1-12)
  day: number; // Gregorian day
  hour: number; // 时辰 branch index (0-12)。0=早子(00:00-00:59 当日子时), 1=丑, 2=寅, 3=卯, 4=辰, 5=巳, 6=午, 7=未, 8=申, 9=酉, 10=戌, 11=亥, 12=晚子(23:00-23:59 跨日子时)。iztro 实际接受 0-12（13 槽位），早晚子时分开计是部分流派立场；传统平民派把 23:00-01:00 统一计 hour=0。
  gender: "male" | "female";
  name?: string;
  province?: string; // 出生省份
  city?: string; // 出生城市
  longitude?: number; // 出生地经度（用于真太阳时校正）
}

export interface LunarInfo {
  lunarYear: number;
  lunarMonth: number; // positive = normal, negative = leap month
  lunarDay: number;
  yearStem: number; // 0-9 (甲乙丙丁戊己庚辛壬癸)
  yearBranch: number; // 0-11 (子丑寅卯辰巳午未申酉戌亥)
  isLeapMonth: boolean;
}

export type SiHua = "禄" | "权" | "科" | "忌";

export interface Star {
  name: string;
  type: "major" | "minor" | "lucky" | "sha";
  siHua?: SiHua;
  brightness?: "bright" | "normal" | "dim"; // 庙旺利陷 (3 级压缩，向后兼容)
  brightnessRaw?: "庙" | "旺" | "得" | "利" | "平" | "不" | "陷"; // round 5 NR5-2: iztro 原始 7 级亮度，供严格命理对照
}

export interface SelfSihuaMark {
  siHua: SiHua; // 禄/权/科/忌
  starName: string; // 自化的星
}

export interface Palace {
  branch: number; // 0-11 (地支索引)
  stem: number; // 0-9 (天干索引)
  name: string; // 宫名
  stars: Star[];
  daXianAge?: [number, number]; // 大限年龄段
  isCurrentDaXian?: boolean;
  isMingGong?: boolean;
  isShenGong?: boolean;
  /** 宫干自化（倪师体系核心） */
  selfSihua?: SelfSihuaMark[];
  /** 对宫地支索引（永远 = (branch + 6) % 12） */
  oppositeBranch?: number;
  /** 是否空宫（无主星） */
  isEmpty?: boolean;
  /** 若为空宫，借自哪个宫的地支索引 = oppositeBranch */
  borrowedFromBranch?: number;
  /** 若为空宫，借自哪个宫名 */
  borrowedFromName?: string;
  /** 若为空宫，借到的对宫主星名列表（结构化数据，文案层不再需要从文本反查） */
  borrowedStars?: string[];
}

export interface DaXianSiHua {
  stemIndex: number;
  stemName: string;
  lu: string; // 化禄星名
  quan: string; // 化权星名
  ke: string; // 化科星名
  ji: string; // 化忌星名
}

export interface DaXian {
  startAge: number;
  endAge: number;
  palaceBranch: number;
  palaceName: string;
  stemIndex?: number; // 大限宫的天干索引（用于大限四化）
  stemName?: string;
  siHua?: DaXianSiHua; // 该大限四化（基于宫干）
}

// round 4 M-1 卖点接通：把死代码 patterns.ts / sihua.ts 接进返回值
// 用 import type 避免运行时循环；patterns.ts 也 import type ZiweiChart，
// TS 的 type-only cycle 编译期会被消除。
import type { Pattern } from "./patterns";

export interface ZiweiChart {
  birthInfo: BirthInfo;
  lunarInfo: LunarInfo;
  mingGongBranch: number; // 命宫地支
  shenGongBranch: number; // 身宫地支
  wuxingJu: number; // 五行局 (2,3,4,5,6)
  wuxingJuName: string; // e.g. '水二局'
  ziweiPos: number; // 紫微星位置
  palaces: Palace[]; // 12宫，按地支0-11排序
  daXians: DaXian[];
  currentAge: number;
  currentDaXianIndex: number;
  /** round 4 M-1：格局识别结果（patterns.ts:1018 detectPatterns 输出）。倪师立场只算 42 detectors（不含飞星派四化格局）。 */
  patterns?: Pattern[];
  /** round 4 M-1：年干四化（sihua.ts:18 getSiHuaByStem 输出）。倪师只算本命年干四化，大限/流年/宫干自化已物理下线。 */
  sihua?: Record<SiHua, string>;
}
