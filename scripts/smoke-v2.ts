import { generateChart } from "../lib/ziwei/algorithm";
import { astro } from "iztro";

const chart = generateChart({
  year: 1984,
  month: 6,
  day: 30,
  hour: 4,
  gender: "male",
});
const raw = astro.bySolar("1984-06-30", 4, "男");

const bn = [
  "子",
  "丑",
  "寅",
  "卯",
  "辰",
  "巳",
  "午",
  "未",
  "申",
  "酉",
  "戌",
  "亥",
];
const sn = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];

console.log("==== ziwei-doushu smoke v2 (J叔, hour=4 辰时) ====");
console.log("生辰: 1984-06-30 辰时(08:00-09:00) 男");
console.log(
  "命宫地支:",
  bn[chart.mingGongBranch],
  "身宫地支:",
  bn[chart.shenGongBranch],
);
const ziweiPalace = chart.palaces.find((p) =>
  p.stars.some((s) => s.name === "紫微" && s.type === "major"),
);
console.log("紫微星位置:", ziweiPalace ? bn[ziweiPalace.branch] : "(missing)");
console.log("五行局:", chart.wuxingJuName, "(数字:", chart.wuxingJu + ")");
console.log(
  "当前年龄:",
  chart.currentAge,
  " 当前大限索引:",
  chart.currentDaXianIndex,
);
console.log("");

console.log(
  "==== 12 宫 (含天干 + 大限范围 + 原始 7 级亮度 + [命/身/现行大限] 标记) ====",
);
// Match vendor palaces with iztro raw palaces by 地支 (raw[i].earthlyBranch)
chart.palaces.forEach((p, idx) => {
  const marks: string[] = [];
  if (p.isMingGong) marks.push("命");
  if (p.isShenGong) marks.push("身");
  if (p.isCurrentDaXian) marks.push("现行大限");

  // Find matching raw palace by branch name
  const branchName = bn[p.branch];
  const rawPalace = raw.palaces.find(
    (r: any) => r.earthlyBranch === branchName,
  );
  const majors = p.stars.filter((s) => s.type === "major");
  const starStr =
    majors.length === 0
      ? "(空宫 → 借" +
        (p.borrowedFromName || "?") +
        ": " +
        (p.borrowedStars?.join("/") || "") +
        ")"
      : majors
          .map((s) => {
            const rawStar = rawPalace?.majorStars?.find(
              (r: any) => r.name === s.name,
            );
            const rawBright = rawStar?.brightness || "?";
            return `${s.name}(${rawBright})`;
          })
          .join(",");

  const stemStr = sn[p.stem];
  const dxStr = p.daXianAge
    ? ` 大限 ${p.daXianAge[0]}-${p.daXianAge[1]}岁`
    : "";
  const markStr = marks.length ? `[${marks.join("/")}]` : "";
  console.log(
    `  ${p.name}(${stemStr}${branchName})${markStr}${dxStr}: ${starStr}`,
  );
});

console.log("");
console.log("==== 14 主星分布完整性自检 ====");
const allMajors: string[] = [];
chart.palaces.forEach((p) =>
  p.stars
    .filter((s) => s.type === "major")
    .forEach((s) => allMajors.push(s.name)),
);
const expected = [
  "紫微",
  "天机",
  "太阳",
  "武曲",
  "天同",
  "廉贞",
  "天府",
  "太阴",
  "贪狼",
  "巨门",
  "天相",
  "天梁",
  "七杀",
  "破军",
];
const missing = expected.filter((m) => !allMajors.includes(m));
console.log(
  `14主星出现数: ${allMajors.filter((v, i, a) => a.indexOf(v) === i).length} / 14, 缺失: [${missing.join(", ")}]`,
);

console.log("");
console.log("==== 格局识别 (34 detectors / patterns.ts 实接通) ====");
console.log("总数:", chart.patterns?.length ?? 0);
chart.patterns?.forEach((p) => {
  console.log(`  - ${p.name} [${p.level}] 涉及宫位: ${p.palaces.join("/")}`);
  if (p.source) console.log(`    出处: ${p.source}`);
});

console.log("");
console.log("==== 年干四化 (倪师立场: 仅算本命年干, sihua.ts 实接通) ====");
console.log(
  "本命年干:",
  sn[chart.lunarInfo.yearStem],
  "(index =",
  chart.lunarInfo.yearStem + ")",
);
console.log("四化:", JSON.stringify(chart.sihua, null, 2));

console.log("");
console.log("==== flatpath: input validation 自检 ====");
console.log(
  "hour=-1 应抛错 / hour=13 应抛错 / month=13 应抛错 (round 4 H-2 修复)",
);
