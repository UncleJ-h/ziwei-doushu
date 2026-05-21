# ziwei-doushu 技术解剖报告

> 侦察方：meta-scout（J叔玄学部加固任务）
> 侦察对象：`https://github.com/Renhuai123/ziwei-doushu`（J叔 fork at `UncleJ-h/ziwei-doushu`）
> 侦察范围：`lib/` 全部 22 个文件 + 关键 `app/` 引用点 + `package.json` + `README.md` + git history
> 侦察日期：2026-05-21
> 仓库 HEAD：`50f8ab5`（共 5 个 commit）

---

## ⚠️ Round 7 修订说明 (2026-05-21)

> 本说明由 Round 7 Wave 2 T7 加入，原文一字未删，只做澄清。

本报告先前在叙事层把 Renhuai123/ziwei-doushu 当成"独立紫微排盘引擎"的描述需要校正。Round 7 后续 fetch + Wave 1 T4 对上游 CHANGELOG 直接核对后，事实校准如下：

- **排盘真上游 = `iztro` (SylarLong, 3.7k⭐, MIT) + `lunar-javascript`**，**不是** Renhuai123/ziwei-doushu 自研。这一点本报告第 1 节顶层结论第 1 句、第 2 节 H1 行、第 3 节 Q1 已经在证据层指出（`algorithm.ts:6,7,72`），但本报告标题/摘要叙事可能让读者误以为 ziwei-doushu 是"独立紫微引擎"——这层叙事需要修订。
- **ziwei-doushu (Renhuai123) 的独有价值 = 格局知识库 + 倪师象征解读 + 古籍数字化**，**不是算法层**。具体包括：
  - `lib/ziwei/patterns.ts` 1118 行 / 41 格局 detector（本报告同时使用 "41" 与 "34" 两个口径——T7 不替本报告作者拍板哪个准，留待后续 wave 复核；按 patterns.ts 实际计数为准）
  - `lib/ziwei/heming-knowledge.ts` 倪师象征解读（合盘断语）
  - `lib/classics/data/*.ts` 三本古籍（《骨髓赋》《全集》《全书》）
  - `lib/nihai/*.ts` 倪师三纪课程数据
- **参见**：`12-Meta_J/canonical/skills/ziwei-classics/references/iztro-school-config-map.md`（Wave 1 T4 产出），含 iztro CHANGELOG 流派配置对照表的事实切片 + 与本报告的关系说明。

修订动作：
1. 本顶部说明 = 全局口径校准；
2. 第 1 节顶层结论已有正确证据（`algorithm.ts:6,7,72`），下方加 ⚠️ 行内标记复述；
3. 第 5 节"上膛路径"叙事保留，不动。

---

## 1. 顶层结论（3 句话）

> ⚠️ **Round 7 校正**：以下第 1 句"不是自研排盘引擎"为本报告事实层结论，正确无须修订；真上游 = `iztro` (SylarLong) + `lunar-javascript`，ziwei-doushu 是 iztro 下游消费者 + 倪师壳。若本报告其他段落出现"独立紫微引擎"叙事，以本顶部修订说明为准。

1. **不是"自研排盘引擎"**，是 `iztro` + `lunar-javascript` 的薄壳：所有排盘计算（`generateChart`）调用 `iztro.astro.bySolar()` 一行完成（`lib/ziwei/algorithm.ts:6-7,72`），repo 自己没有写一行紫微星位推演代码。README 第 7 行宣称的"自研完整排盘算法"与第 141 行"排盘：基于 iztro + lunar-javascript"自相矛盾，第 141 行才是真相。
2. **真正有价值的资产是中文领域知识，不是算法**：1118 行格局识别器（`patterns.ts`，41 个 detector 全部手写带古籍出处）+ 559 行公版古籍 JSON（《骨髓赋》/《全集》/《全书》）+ 329 行合盘断语（`heming-knowledge.ts`）+ 1538 行倪海夏三纪课程数据（`nihai/`）。这才是 J叔可装备的核心。
3. **开源版本残缺无法 build**：`lib/seo/knowledge.ts:8-10`、`app/knowledge/[star]/[topic]/page.tsx:17`、`app/knowledge/page.tsx:8` 共 4 处 import `@/lib/ziwei/db-analysis`，该文件**整个 git history 中从未存在**；另外 `app/chart/page.tsx:59` 与 `app/heming/page.tsx` 都 fetch `/api/generate`，但 `app/api/` 目录不存在（README:100-110 主动承认这是"未包含的部分"）。整库 fork 不可行，必须剥皮。

---

## 2. 假设核对

| 假设 | 判定 | 证据 |
|------|------|------|
| **H1** `lib/ziwei/` 是排盘核心，能独立剥离不依赖 Next.js | **部分对** | 算法本体不在 `lib/ziwei/algorithm.ts`，在 `iztro` 包里（algorithm.ts:72 `astro.bySolar(...)`）。`lib/ziwei/` 其余文件中，`patterns.ts`、`constants.ts`、`sihua.ts` 零 Next.js 依赖、纯逻辑可剥离；`history.ts:1-2` 依赖 React + `@/components/BirthForm`、`share.ts:1` 依赖 `@/components/BirthForm`，需要小幅改造 |
| **H2** `lib/nihai/` 锁定倪海夏体系口径 | **错** | `lib/nihai/` 整个目录是**倪海夏个人传记 + 三纪课程目录数据**（生平、师承、著作清单、24 集天纪课程章节），不是流派口径锁定。真正锁口径的是 `algorithm.ts:10` 注释和 `patterns.ts:5-7` 设计原则（"不使用宫干自化、大限四化、来因宫等飞星派工具"），但这些口径**只是注释，没有强制机制**：sihua.ts 完整实现了飞星派（含 detectSelfSihua/findIncomingPalaces），只是没有被任何文件调用 |
| **H3** `lib/classics/` 是古籍原文数据 | **对** | `classics/types.ts:8-44` 定义 Book/Chapter/Paragraph schema，`classics/data/*.ts` 三个古籍各以 TS 静态对象内嵌（gusuifu 218 行/quanji 195 行/quanshu 146 行），公版无版权，可整体搬走 |
| **H4** 纯本地计算，不依赖外部 API | **部分错** | 排盘本身（iztro + lunar-javascript）确实纯本地。但：(a) `package.json:14,17,18,21` 含 `@anthropic-ai/sdk`、`@types/pg`、`ioredis`、`pg`——LLM/PG/Redis 客户端在生产路径上；(b) `.env.example` 强制要求 `DEEPSEEK_API_KEY` 或等价 LLM key；(c) `app/chart/page.tsx:59` 起盘是 POST `/api/generate`，这个路由不开源；(d) 如果你只用 `patterns.ts` + iztro，确实纯本地，但那是剥皮后的结果，不是开箱状态 |

---

## 3. 6 个问题逐条回答

### Q1. 7 步排盘算法的可独立性

**结论**：可以剥离，但剥的是 iztro 不是"它的算法"。

证据链：
- `lib/ziwei/algorithm.ts:6` `import { astro } from 'iztro';`
- `lib/ziwei/algorithm.ts:7` `import { Solar } from 'lunar-javascript';`
- `lib/ziwei/algorithm.ts:72` `const astrolabe = astro.bySolar(solarDate, hour, iztroGender, true, 'zh-CN');` — 整个十二宫、十四主星、辅星、大限、亮度、四化全部由这一行 iztro 调用产出
- `lib/ziwei/algorithm.ts:75-110` 是把 iztro 的 palace 对象转成本仓库 schema（`Palace` interface），属于数据 reshape，不是排盘
- `lib/ziwei/algorithm.ts:123-135` `palaces.forEach` 计算对宫、空宫借星——这段是 iztro 之外的**结构化增强**（README 没提，commit log 标注是 codex P0 改动），是少数原创计算

Next.js 特有 API 依赖搜索结果（`grep -rn "next/server\|next/headers\|cookies\|headers" lib/`）：lib/ 内**零**调用，没有 Server Action、没有 Route Handler 依赖。

剥离路径：
- 拷 `algorithm.ts` + `types.ts` + `constants.ts` + `patterns.ts` + `sihua.ts`（共约 1730 行）
- npm install iztro@^2.5.8 lunar-javascript@^1.7.3
- `history.ts`（React hook）和 `share.ts`（form 类型耦合）丢弃或改写
- 出来就是一个纯 Node/Bun 可调用的 ziwei lib

### Q2. 倪海夏《天纪》体系——规则编码还是数据驱动？

**结论**：注释级规则，数据驱动是假象，强制机制为零。

证据：
- `lib/ziwei/algorithm.ts:10-11` `// 飞星派工具仅供导出，不再在排盘时调用（倪师《天纪 03》：四化星永远固定不动）// import { detectSelfSihua, getSiHuaByStem } from './sihua';` — 用注释和"注释掉 import"来表达流派立场，没有机制隔离
- `lib/ziwei/patterns.ts:5-8` `// 2. 倪师立场：不使用宫干自化、大限四化、来因宫等飞星派工具` — 设计原则只在文件头注释里
- `lib/ziwei/sihua.ts` 仍然完整实现了 detectSelfSihua（121-132）、getDaXianSiHua（49-63）、findIncomingPalaces（145-158）——飞星派核心工具一个不少，并 `export`，只是**全仓库没有任何 import 调用它们**（`grep -rln "detectSelfSihua\|getDaXianSiHua\|getLiuNianSiHua\|findIncomingPalaces" .` 只返回 sihua.ts 自身和 algorithm.ts 的注释行）
- `lib/ziwei/algorithm.ts:147-157` 大限只填了 startAge/endAge/palaceBranch/palaceName，没填 stemIndex/siHua 字段（types.ts:73-75 仍然定义了这两个 optional 字段——schema 留口，数据不填，等于"飞星派字段下线"是运行时手段不是 schema 手段）

口径差异要点（基于 algorithm/patterns/sihua 三个文件的注释 + 实际逻辑）：
- 主流飞星派核心 = 大限四化 + 流年四化 + 自化 + 来因宫；本仓库注释口径是"全部下线"，但代码层面是"提供函数但不调用"
- 主流三合派 = 三方四正、格局判定；本仓库 patterns.ts:66-83 实现了 sanFang、jia、duiGong 一套三合派工具，41 个格局检测全部走三合派路径
- 倪海夏自己的特色（如"命宫为本三方为用"）在 patterns.ts 中作为优先级体现，但没有跟主流三合派做差异化编码

数据驱动度：constants.ts 的 SI_HUA_TABLE、TIANKUI_TABLE、LUCUN_TABLE、TIANMA_TABLE、STAR_BRIGHTNESS（47-126 行）是真正的数据驱动表，可被其他流派替换；但 patterns.ts 1118 行 41 个 detector 是 hard-coded if-else，换流派需要重写。

### Q3. 数据结构

| 资产 | Schema 位置 | 形态 |
|------|-------------|------|
| **排盘结果** | `lib/ziwei/types.ts:78-90` `ZiweiChart` | TypeScript interface，含 birthInfo/lunarInfo/mingGongBranch/shenGongBranch/wuxingJu/ziweiPos/palaces/daXians/currentAge/currentDaXianIndex |
| **宫位** | `lib/ziwei/types.ts:36-57` `Palace` | branch/stem/name/stars + 倪师增量字段（selfSihua/oppositeBranch/isEmpty/borrowedFromBranch/borrowedFromName/borrowedStars） |
| **星** | `lib/ziwei/types.ts:24-29` `Star` | name/type (major/minor/lucky/sha)/siHua/brightness |
| **四化表** | `lib/ziwei/constants.ts:47-58` `SI_HUA_TABLE` | `Record<number, [string, string, string, string]>` 静态对象，10 天干 × [禄,权,科,忌] |
| **辅星表** | `constants.ts:61-103` TIANKUI/LUCUN/TIANMA | 三张静态映射表 |
| **亮度表** | `constants.ts:107-126` `STAR_BRIGHTNESS` | 只覆盖 6 颗主星（紫微/天机/太阳/武曲/天同/廉贞），其余 8 颗主星没有静态亮度表，亮度全靠 iztro 返回 |
| **格局** | `lib/ziwei/patterns.ts:21-34` `Pattern` + `PatternCondition` | name/level/description/palaces + required/bonus/breaking + source（古籍出处字段） |
| **古籍** | `lib/classics/types.ts:8-44` Book/Chapter/Paragraph | id/idx/text/translation?/niNote? — 每段都有锚点 id，搜索器 `classics/index.ts:60-98` 是子字符串匹配（不分词、不繁简转换、不模糊） |
| **倪海夏三纪** | `lib/nihai/types.ts` + `nihai/{tianji,renji,diji}.ts` | NiModule 数组，每个 module 含 chapters 数组，用于内容页渲染 |
| **合盘断语** | `lib/ziwei/heming-knowledge.ts:9-15` `STAR_IN_FUQI_GU` | `Record<starName, { summary, good, bad, spouse_traits, timing, ni_quote? }>` — 14 主星在夫妻宫的标准化断语 |
| **名人盘** | `lib/ziwei/famous.ts:6-17` `FamousPerson` | id/name/category/year/month/day/hour/gender/notable — 标注时辰是估算值 |
| **城市经度** | `lib/ziwei/cities.ts:1-9` `CityInfo`/`ProvinceInfo` | 用于 share.ts:5-11 的真太阳时校正 |

### Q4. 外部依赖

`package.json`（共 17 个 runtime dependencies）按风险分级：

**计算核心（必须）**：
- `iztro@^2.5.8` — MIT，紫微排盘核心，本 repo 的算法本体
- `lunar-javascript@^1.7.3` — MIT，公历→农历换算

**AI/平台（开源版形同摆设但 package 里还在）**：
- `@anthropic-ai/sdk@^0.27.0` — Anthropic LLM SDK，开源版 `/api/generate` 缺失，包没用但占空间
- `pg@^8.20.0` + `@types/pg@^8.20.0` — Postgres 客户端，开源版无 schema
- `ioredis@^5.10.1` — Redis 客户端，开源版无配置

**Next.js + 部署**：next 15、react 19、framer-motion、html2canvas、clsx、@vercel/analytics、@vercel/speed-insights、vercel

**.env.example 强制项**：`DEEPSEEK_API_KEY`（或 OpenAI 兼容协议任选一家）+ `NEXT_PUBLIC_SITE_URL`。如果只用排盘+格局识别，**无需任何 API key**，但开箱跑前端会调 `/api/generate` 失败。

外部 API 依赖判定：**排盘本身零依赖**，AI 解读那部分是闭源（README:100-110 明示），开源版只是骨架。

### Q5. 代码质量诚实度——是不是真排盘？

> ⚠️ **Round 7 校正**：本节"原创增量"的定位需要按 Round 7 修订说明读——"真原创资产"指的是**格局知识库 + 倪师象征解读 + 古籍数字化**，**不指排盘算法**。排盘算法 = iztro。下表中的 patterns.ts / heming-knowledge / classics / nihai 是 J叔玄学部的核心装备目标，但它们是**知识/规则层**，不是**算法层**。

**结论**：核心排盘是套别人的，但有真正的原创增量。

排盘 = 套 iztro（已证）。

但以下是 J叔需要看清楚的**真原创资产**：

| 模块 | 行数 | 性质 | 是否被调用 |
|------|------|------|----------|
| `patterns.ts` | 1118 | 41 个格局 detector，每个 detector 带古籍出处（PatternCondition.source），用 `getSanFangPalaces`/`getJiaPalaces`/`shaCountInPalace` 等辅助函数判定 | **是**，被 components 调用（参 `grep -rln detectPatterns`）|
| `sihua.ts` | 198 | 五虎遁公式（84-96 行）+ 自化检测 + 来因宫追溯 + 多层四化叠加 overlay | **否**，dead code，全仓库无 caller |
| `share.ts:5-11` `calcTrueSolarBranch` | 7 | 真太阳时换算公式 `offset = (longitude - 120) * 4` | **是**，components 用 |
| `algorithm.ts:122-135` | 13 | 空宫借对宫主星的结构化字段（commit codex P0）——iztro 不直接提供这个，本仓库手工补 | **是**，文案层用 |
| `algorithm.ts:31-53` | 22 | 把 iztro 的星类型重映射到本仓库的 major/minor/lucky/sha 四分类 | **是**，algorithm 内部用 |
| `algorithm.ts:56-63` `parseWuxingJu` | 7 | 从五行局中文名"水二局"解析数字 2 | **是** |

净原创代码行数（非数据、非 iztro reshape、被实际调用）≈ **1150 行**，主要价值集中在 `patterns.ts`。`sihua.ts` 是承诺过但下线的飞星派工具集，写得不错但闲置。

诚实度评价：**README 略有粉饰但不致命**——line 7 "自研完整排盘算法" 和 line 70 描述 sihua.ts "四化飞星系统" 与 algorithm.ts:147 注释、sihua.ts 实际调用方为零相矛盾。但 README line 141 主动承认 iztro 依赖，line 100-110 主动承认后端 API 不开源，整体诚实度 6.5/10。

### Q6. 可装备性总评

**6 分 / 10 分**（部分装备价值高，整库装备价值低）

| 装备形态 | 评分 | 理由 |
|---------|------|------|
| **整库 fork** | 3/10 | 4 处 broken import（db-analysis）必须自己补；`/api/generate` 必须自己写；DEEPSEEK_API_KEY 必填；前端是 Next.js 15 + React 19，跟玄学部 Agent 流程毫无关系 |
| **剥皮 patterns.ts** | 8/10 | 41 个格局检测、带古籍出处、零 Next.js 依赖、零 React 依赖，可作为 ziwei-analyst 的"格局识别能力包"，给 LLM 喂"已识别格局列表 + 出处"比让 LLM 自己背格局靠谱 |
| **剥皮 constants.ts + sihua.ts + share.ts:5-11** | 7/10 | 四化表、辅星表、五虎遁、真太阳时换算——这些是流派无关的基础工具，跟 iztro/mingli-mcp 输出可兼容，本地校验有用 |
| **整碗端走 classics/ + heming-knowledge.ts + nihai/** | 7/10 | 公版古籍 + 倪海夏断语 + 三纪课程数据，作为 J叔 vault 中的 ziwei 知识源，比当下 mingli-mcp 黑盒强很多；可直接用 RAG / mdc 向 ziwei-analyst 喂 |
| **拆 npm package 自己维护** | 5/10 | 上游只有 5 个 commit，作者活跃度不明；MIT 协议允许；但本质是 iztro 的领域知识增量，不如直接给 iztro 做格局识别 PR |

上膛成本：
- 剥皮 + 重新 wire 到 bazi-analyst 的 sub-agent 接口：约 0.5-1 个工时（不含格局识别的 prompt 工程）
- 整库 fork 跑通：要补 db-analysis.ts + 写 /api/generate + 配 DEEPSEEK key，3-5 工时起步，而且补出来的还是别人的 UI

---

## 4. 风险清单

| # | 风险 | 严重度 | 证据 |
|---|------|-------|------|
| R1 | **README 与代码不符**——"自研排盘"实为 iztro 壳；"四化飞星系统"实为 dead code | 高 | algorithm.ts:6,72; sihua.ts caller search; README:7,70 vs README:141 |
| R2 | **开源版残缺无法 build**——4 处 import `db-analysis`，1 处 fetch `/api/generate`，文件都不在 | 高 | grep db-analysis 4 hits; ls app/api/ 不存在；git log --all 显示 db-analysis 从未提交过 |
| R3 | **流派口径靠注释维护**——sihua.ts 飞星派工具完整保留只是没调用，未来贡献者很容易开倒车 | 中 | algorithm.ts:11 注释 // 注释掉 import; sihua.ts:1-11 仍然描述自己是核心 |
| R4 | **STAR_BRIGHTNESS 表只覆盖 6/14 主星**——其余主星亮度全靠 iztro 自己算，本仓库无 fallback、无校验 | 中 | constants.ts:107-126 只列了紫微/天机/太阳/武曲/天同/廉贞 |
| R5 | **agency leakage**——`history.ts`/`share.ts` 跟 `@/components/BirthForm` 双向耦合，剥皮时必须先打破耦合 | 中 | history.ts:2 + share.ts:1 |
| R6 | **iztro 升级风险**——本仓库锁 `iztro@^2.5.8`，未来 iztro major bump 会冲掉 algorithm.ts 整段 reshape；本仓库没有任何针对 iztro 的回归测试 | 中 | package.json:14; find . -name "*.test.*" 零结果 |
| R7 | **作者活跃度未知**——upstream 仅 5 个 commit，最新 commit 都是 fork-时段；issue/PR 响应未观察 | 低 | git log --oneline 5 commits |
| R8 | **patterns.ts source 字段是字符串不是结构化引用**——古籍出处只是文本说明，无法机器追溯到 classics/ 中的具体 paragraphId | 低 | patterns.ts:33 source?: string 注释为"古籍出处"但没有 schema 约束 |

---

## 5. 建议的上膛路径

**推荐路径：选择性剥皮 + 知识资产直采**

### 5.1 装备 ziwei-pattern-detector（剥皮 patterns.ts）

- 抽取文件：`lib/ziwei/types.ts` + `lib/ziwei/constants.ts` + `lib/ziwei/patterns.ts` + `lib/ziwei/share.ts:5-11`（calcTrueSolarBranch）
- 入参：现有 ziwei chart 数据（来自 iztro 或 mingli-mcp 的 chart，需要 reshape 到 `ZiweiChart` schema）
- 出参：`Pattern[]` 含格局名、level、conditions、古籍出处
- 用途：作为 ziwei-analyst sub-agent 的本地能力包，输出"已识别 N 个格局"喂给 LLM，避免 LLM 自由发挥编格局
- 装备成本：低（约 0.5 工时改造）

### 5.2 直采知识资产（不装备代码，只装备数据）

- `lib/classics/data/*.ts` 三本古籍 → 转 markdown 入 vault `06-经典文献/紫微斗数/`
- `lib/ziwei/heming-knowledge.ts` → 转 markdown 入 vault 作为 ziwei-analyst 的合盘 RAG 源
- `lib/nihai/tianji.ts` 第 17-44 行的 TIANJI_MODULES（紫微斗数部分）→ vault 倪海夏三纪知识页
- 装备成本：低（约 1 工时转格式 + 入库）

### 5.3 不装备的部分

- `algorithm.ts`（套 iztro 壳，不如直接装 iztro 自己用）
- `sihua.ts`（dead code 且与本仓库声称的流派立场冲突，要装就要先决定 J叔玄学部是否启用飞星派——这是元命题，不是工具选择）
- `nihai/{renji,diji}.ts`（中医针灸 + 地理志，与玄学部紫微无关；renji 可单独评估是否给 J叔做"倪海夏中医知识"的另一条线）
- 整个 Next.js app/ + components/（UI 层，跟玄学部 Agent 体系不兼容）

### 5.4 长期可选

如果 J叔玄学部决定全栈自研紫微排盘（不依赖 iztro 也不依赖 mingli-mcp），需要的工作量与本仓库无关——本仓库**不能帮你跳过**这一步，它自己也跳了，套了 iztro。要做就要从《全集》《全书》安星法逐条编码，或 fork iztro 做 PR 把流派开关做进去。

### 5.5 Sentinel 移交清单（如果决定剥皮）

- 待装备模块：`lib/ziwei/{types,constants,patterns,share}.ts`（仅 5-11 行）+ `lib/classics/` 全部 + `lib/ziwei/heming-knowledge.ts`
- 依赖：iztro@^2.5.8（MIT）+ lunar-javascript@^1.7.3（MIT），无服务端依赖、无网络调用、无密钥
- 协议：MIT（仓库 `LICENSE` 已确认）
- 已知缺陷：见风险清单 R3/R4
- 回滚路径：直接删除新装的玄学部 sub-agent skill 包，回到当前 mingli-mcp 黑盒方案

---

## 6. 关键 file:line 索引（便于复核）

- iztro 依赖：`lib/ziwei/algorithm.ts:6,7,72`
- 流派口径注释（非机制）：`lib/ziwei/algorithm.ts:10-11,147`；`lib/ziwei/patterns.ts:5-8`
- 飞星派 dead code：`lib/ziwei/sihua.ts:121-132,145-158`；caller 搜索结果只在 algorithm.ts:11 注释行
- 空宫借对宫主星（原创）：`lib/ziwei/algorithm.ts:122-135`
- 41 格局 detector 入口：`lib/ziwei/patterns.ts:1018-1075`
- 真太阳时换算（原创）：`lib/ziwei/share.ts:5-11`
- 五虎遁公式（原创但未被调用）：`lib/ziwei/sihua.ts:84-96`
- 古籍 JSON schema：`lib/classics/types.ts:8-44`
- 古籍数据：`lib/classics/data/gusuifu.ts:1-218`（骨髓赋）等
- 合盘断语：`lib/ziwei/heming-knowledge.ts:9-15`
- broken import 证据：`lib/seo/knowledge.ts:8-10`；`app/knowledge/[star]/[topic]/page.tsx:17`；`app/knowledge/page.tsx:8`
- /api/generate 缺失证据：`app/chart/page.tsx:59`；`app/heming/page.tsx`（generateChart 内 fetch '/api/generate'）；`ls app/api/` 不存在
- README 自承诚实点：`README.md:100-110,141`
- README 粉饰点：`README.md:7,70`
- 名人盘时辰估算声明：`lib/ziwei/famous.ts:3`
