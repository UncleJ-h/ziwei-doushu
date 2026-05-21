---
title: ziwei-doushu 引入玄学部 — 能力 Gap 分析
author: meta-scout
date: 2026-05-21
status: draft（待 J叔 + meta-sentinel 评审）
candidate: Renhuai123/ziwei-doushu @ 1020⭐ MIT TypeScript
target_seat: 玄学部 / bazi-analyst（紫微斗数能力位）
scope: Discovery + Gap + Adoption Brief（不实施，不动 agent 文件）
---

# ziwei-doushu Gap Analysis

> Scout 只出报告。装备形态与上膛由 Warden + Sentinel + J叔三方拍板。

---

## 0. 顶层结论（TL;DR）

**判定：Pilot Test — 限定 backend 注入形态，不立独立 agent，不直接覆盖现有口径。**

1. **算法层不是"全新能力"**：ziwei-doushu 的排盘核心是 `iztro@2.5.8`（npm pkg） + `lunar-javascript`；mingli-mcp v1.0.16 的依赖是 `iztro-py@>=0.3.4`（同一家 SylarLong 的 Python port）。**两边共用同一个排盘引擎**，所以 ziwei-doushu 给玄学部带来的真正增量**不在"排盘"**，而在 ① 排盘算法 TS 源码可审计、② `patterns.ts` 42 个格局识别函数（1118 行）、③ `heming-knowledge.ts` 329 行倪海夏体系合盘断语、④ 三本古籍原文 TS 化（《骨髓赋》《全集》《全书》）、⑤ 51.8 万样本数据集（5.5GB，Releases 单独发布）。
   - 证据：`/Users/jeffreyhu/DEV/ziwei-doushu/lib/ziwei/algorithm.ts:6` `import { astro } from 'iztro'`；`/Users/jeffreyhu/DEV/ziwei-doushu/package.json:23` `"iztro": "^2.5.8"`；`/Users/jeffreyhu/.local/share/uv/tools/mingli-mcp/lib/python3.11/site-packages/mingli_mcp-1.0.16.dist-info/METADATA` `Requires-Dist: iztro-py>=0.3.4`。

2. **口径冲突是真的，而且很尖锐**：ziwei-doushu 在算法层**主动下线了飞星派宫干自化、大限四化、来因宫**，原话见 `lib/ziwei/algorithm.ts:10` 注释「倪师《天纪 03》：四化星永远固定不动」和 `lib/ziwei/patterns.ts:12` 「倪师立场：不使用宫干自化、大限四化、来因宫等飞星派工具」。J叔玄学部**正好相反**：现行 `紫微斗数规则体系.md:371-601` 第八章整章 (243 行) 是飞星派四化路径，2026-04-03 P1-1 升级专项加入；J叔本人盘已经按飞星派出了一份 `J叔双体系深度解读-飞星四化与盲派象法.md`（30 处「飞星」标注）和 `J叔一生全景-飞星修正版.md`（命宫位置已修正为 time_index=4 丁卯）。直接采用 ziwei-doushu 的 `detectPatterns()` 输出 = 会把 J叔已花重金验证过的飞星结论统统判为"非倪师正统"。

3. **建议装备形态 = 方案 (b) backend 注入 + (c) classics 库 SKILL 合体，不上 (a)**：把 ziwei-doushu 的 `lib/classics/`（668 行三本古籍）和 `lib/ziwei/heming-knowledge.ts`（329 行合盘断语）做成只读 SKILL `ziwei-classics`；`algorithm.ts` / `sihua.ts` / `patterns.ts` 作为 bazi-analyst 的**可切换 backend "倪师·三合派模式"**，与现有 mingli-mcp（默认 backend）并存而不替换。**不建独立 ziwei-analyst agent**——会违反 `bazi-analyst.md:79` 已声明的 "Own 紫微斗数解读"边界，撕裂八字×紫微交叉验证。

4. **必须先解 J叔历史验证锚点**：MEMORY `xuanxue-strengthening-2026-05-12.md:42-52` 的 "Golden Chart 3 盘 fixture 待 J叔人审"还挂着，且 P1-1 报告 (xuanxue-p1-upgrade-2026-04-03.md:55-58) 留着 "紫微命宫 丙寅 vs 丁卯" 复核。先把 J叔本人盘在 ziwei-doushu 跑一次拿到 raw 输出，与 mingli-mcp 输出 + 已存 `J叔紫微斗数盘.md` 三方对照，**确认排盘元素一致**后再谈格局/合盘断语吸收。

---

## 1. 假设核对

| 假设 | 对/错 | 证据 |
|---|---|---|
| **A**：bazi-analyst 紫微全靠外部 MCP（mingli-mcp），自己不掌控算法 | **对** | `bazi-analyst.md:303-313` MCP 清单显式列 `mingli-mcp`；`bazi-analyst.md:39` "本 Agent 无法直接调用 MCP"；mingli-mcp 是 Python 包（`/Users/jeffreyhu/.local/share/uv/tools/mingli-mcp/`），J叔可以审，但算法核 `iztro-py` 是第三方上游。**算法可审性 = 中等**（包源码在本机，但 J叔此前没单独跑过算法 review）。 |
| **B**：Golden Chart 3 盘 fixture 还挂着，排盘准确性未锚定 | **对** | `xuanxue-strengthening-2026-05-12.md:42-52` 「J叔需逐行对比"排盘元素"vs"已知验证锚点"——全 [verified] 后 liuren/taiyi 可从 draft 升 stable」；`xuanxue-p1-upgrade-2026-04-03.md:55-58` 留「紫微命宫位置丙寅(武曲天相) vs 旧版丁卯(太阳天梁)差一宫，待复核」。J叔本人盘的命宫问题虽然 `J叔紫微斗数盘.md:26 命宫=丁卯` + `J叔一生全景-飞星修正版.md:9 命宫=丁卯 time_index=4` 看起来已经锁定丁卯，但跨文件未统一标注"已验证"。 |
| **C**：bazi-analyst 是编排外壳 + yuan 插件双层结构，引入新引擎应走"插件注入" | **部分对** | MEMORY 写的 「bazi-analyst 升级 = 双层结构（编排外壳 + yuan 插件）」，但实读 `/Users/jeffreyhu/.claude/agents/bazi-analyst.md` 没看到显式的 yuan 插件挂载点，agent 内 `skills: []` 是空的。MEMORY 描述与 agent 实际文件不一致——可能 yuan-six-methods SKILL 是按需 ad-hoc 调用而不是声明式装配。**结论**：插件注入模式概念上成立，但还没在 agent frontmatter 里落地，引入 ziwei-doushu 时需要同步把 SKILL 装配机制补上，不能两边都靠"按需调用"打游击。 |
| **D**：倪海夏《天纪》流派可能跟 J叔已验证锚点冲突 | **对，且比预想更严重** | 三处硬冲突：① ziwei-doushu **算法层注释明文反飞星**（`algorithm.ts:10` + `patterns.ts:12`），J叔规则体系第八章整章 (243 行) **专门加飞星**；② ziwei-doushu `algorithm.ts:147` 「大限只看宫位移动」，J叔 `J叔双体系深度解读:114-204` 用了大限宫干飞化推 2026 流年；③ ziwei-doushu `patterns.ts` 的 42 个格局识别**不输出飞星结论**，J叔 `J叔一生全景-飞星修正版.md` 整篇基于飞星因果链。 |

---

## 2. 六个必答问题

### Q1 当前依赖透明度

**调用链**（自下而上）：
```
J叔笔记里的紫微解读 .md
  ←  bazi-analyst Agent（深度解读 / 不调 MCP）
       ←  主 session（执行 mcp__mingli-mcp__get_ziwei_chart）
            ←  mingli-mcp 1.0.16（spyfree/mingli-mcp, MIT, Python）
                 ←  iztro-py >= 0.3.4（SylarLong, MIT, Python port）
                      ←  iztro 原始 npm 包（SylarLong, 同人，Sample 2.1MB, 上次发布约 2 个月前）
```

**审计透明度**：
- mingli-mcp METADATA + 源码：**在本机** `/Users/jeffreyhu/.local/share/uv/tools/mingli-mcp/`，但 J叔此前没跑过源码 review。
- iztro-py 排盘核：**第三方上游**，更新由 **spyfree**（iztro-py 维护者，同时也是 mingli-mcp 作者；两个包共上游 SylarLong/iztro npm 包的算法定义）一人维护。**端到端单点风险**：spyfree 一人既写 MCP 又写 Python port，比"npm 单点"更严重。**M-1 修订 2026-05-21**：原稿写"SylarLong"是把 npm 维护者和 Python port 维护者搅在一起的错误归因。
- **J叔目前不掌握**：① 安星诀实现是否与古籍一致；② 五行局推导边界情况；③ 闰月 / 真太阳时校正策略；④ 子时归属 (早子时 vs 夜子时)。
- ziwei-doushu 引入后**多一份独立实现可审**（TypeScript，可读性比 Python 高），但**不会消除上游依赖**——同样落在 iztro 上。这是**审计性增量**，不是**冗余备份**。

### Q2 当前能力 gap（逐项核对）

| 能力维度 | J叔现状 | 证据 |
|---|---|---|
| 命宫安宫 | ✅ 有 | `J叔紫微斗数盘.md:26` 命宫=丁卯，已锁定 |
| 十二宫主辅星 | ✅ 有 | `J叔紫微斗数盘.md:36-49` 完整列出 |
| 三方四正 | ✅ 有 | `紫微斗数规则体系.md:207` 定义清晰 |
| 三合派四化（年干） | ✅ 有 | `紫微斗数规则体系.md:250-371` 第七章 |
| 飞星派四化（宫干） | ✅ **有且深耕** | `紫微斗数规则体系.md:371-601` 第八章 243 行专章 + J叔本人盘飞星报告 2 份 |
| 大限 | ✅ 有 | `J叔紫微斗数盘.md:36-49` 每宫标大限年龄 |
| 流年 | ✅ 有 | `J叔双体系深度解读.md` 2026 流年专章 |
| 经典格局识别（程序化） | ⚠️ **弱** — 靠 LLM 推 + 手查规则体系 .md，没有可执行的格局识别器 | bazi-analyst 没声明 `skills:` 装配格局识别 SKILL |
| 古籍原文检索 | ⚠️ **几乎没有** — 规则体系 .md 引用片段，但无原文全本 | `紫微斗数规则体系.md:11` 仅列书名，无内联原文 |
| 合盘断语库（紫微侧） | ⚠️ **薄** | `bazi-analyst.md:65-73` 合盘有流程，但断语来源依赖 LLM 训练知识 |
| 真太阳时校正 | ❓ 不确定 | mingli-mcp 依赖 iztro-py，是否做真太阳时未查证 |
| 借宫识别（空宫借对宫） | ❓ 不确定 | `J叔紫微斗数盘.md:41,44` 标了"空宫"但没标借宫 |

**净 gap**（ziwei-doushu 能补的）：
1. **42 个程序化格局识别** （`patterns.ts:1018` `detectPatterns()` 含「君臣庆会 / 紫府同宫 / 杀破狼 / 火贪铃贪 / 三奇加会 / 阳梁昌禄 / 马头带剑」等），每个带 `required / bonus / breaking` 三层条件 + 古籍 source 标注；
2. **329 行倪师体系合盘断语**（十四主星在夫妻宫，每星带 `summary/good/bad/spouse_traits/timing/ni_quote`）；
3. **三本古籍原文 TS 化**（《骨髓赋》218 行 + 《全集》195 行 + 《全书》146 行 = 559 行，可全文检索）；
4. **算法层 TypeScript 可审版本**（181 行 algorithm.ts + 198 行 sihua.ts），mingli-mcp 的 Python 版本之外多一份对照实现；
5. **51.8 万样本数据集**（5.5GB，Releases 分卷下载）—— 不是排盘能力，是**评测语料**，可做 BaziQA-style 基准；
6. **借宫结构化字段**（`algorithm.ts:122-135` 显式输出 `borrowedFromBranch/borrowedFromName/borrowedStars`），mingli-mcp 是否输出未核。

**完整度量化**：
- 现状：约 **6/10**（排盘 + 飞星 + 三合 + 大限 + 流年到位，格局/合盘/古籍/真太阳时弱）
- 引入后：约 **8/10**（补齐格局识别 + 合盘断语 + 古籍原文）
- 留 2 分缺口：① 倪师体系与 J叔飞星派需双轨；② 真太阳时校正策略仍是上游 iztro 决定。

### Q3 引入 ziwei-doushu 的增量

| 增量类型 | 内容 | 体积 | 注入路径建议 |
|---|---|---|---|
| 算法层 backend | `algorithm.ts / sihua.ts / constants.ts / types.ts / cities.ts` | ~1100 行 | 作为 bazi-analyst 第二 backend "倪师·三合派模式"，**默认仍走 mingli-mcp**，需要倪师对照时切 |
| 格局识别器 | `patterns.ts` 42 个 detect 函数 | 1118 行 | 抽成 SKILL `ziwei-patterns-niraidah`，调用方传 chart 拿 patterns[] |
| 合盘断语 | `heming-knowledge.ts` 14 主星 × 夫妻宫断语 | 329 行 | 抽成 SKILL `ziwei-heming-niraidah` |
| 古籍原文 | `lib/classics/*` 三本古籍 + index | 668 行 | 抽成 SKILL `ziwei-classics`（可独立使用，与排盘解耦）|
| 评测语料 | 51.8 万样本数据集 | 5.5GB Release | **不下载到 vault**，做远程评测 fixture 引用即可 |
| SEO 知识图谱 | `lib/seo/` | 未查 | **跳过**——不在玄学部需求范围 |
| 前端 Next.js | `app/ + components/` | 全栈 Web | **跳过**——玄学部不要 Web UI，全部走 markdown |

### Q4 口径冲突风险（与 J叔历史验证锚点）

| 锚点 | J叔现状 | ziwei-doushu 立场 | 冲突等级 |
|---|---|---|---|
| **飞星派 vs 三合派** | 第八章 243 行明确"两派联用，先三合定框架，飞星填细节"（`紫微斗数规则体系.md:579-601`） | algorithm.ts:10 "四化星永远固定不动" + patterns.ts:12 "倪师立场：不使用宫干自化、大限四化、来因宫" | **🔴 HIGH** — 算法层硬反飞星 |
| **乙亥大运 2024-2034 最有利** | `J叔乙亥大运流年验证报告.md:26` "乙亥大运是J叔这辈子最有利的十年——没有之一"。**这是八字侧结论，不依赖紫微体系。** | 不影响（紫微大限是另一套，乙亥 43-52 在乙亥宫=身宫=财帛宫） | ✅ 不冲突 |
| **丁未流年 2027** | 八字侧预立验证（MEMORY 「丁未流年(2027)预立验证」），紫微侧未单独锁定 | 紫微流年走丁未年干 = 太阴禄/天同权/天机科/巨门忌，与 J叔现有飞星推 2026 流年逻辑同源（年干四化属三合派也共用） | ⚪ 中性 |
| **夫妻合盘 6.5 分** | `J叔夫妻合盘分析.md` 7.6/10·财运互补 10/10（实际是 7.6 不是 6.5，MEMORY 这条数字偏差） | heming-knowledge.ts 给十四主星在夫妻宫的倪师断语 = **新数据源**，可能让评分模型换口径 | ⚠️ MED — 如果用 ziwei-doushu 重打分，分数可能漂移，需要 J叔先决定"重打 or 仅参考" |
| **紫微命宫位置丙寅 vs 丁卯** | `J叔紫微斗数盘.md:26 命宫=丁卯` + `J叔一生全景-飞星修正版.md:9 命宫=丁卯 time_index=4`，看起来定丁卯；但 P1 报告 `xuanxue-p1-upgrade-2026-04-03.md:58` 仍标"待复核" | ziwei-doushu/iztro 排出来是什么 = **必须先跑**，如果排出丙寅就重燃旧争议 | 🔴 BLOCKER —— 必须先跑一次比对再决定下一步 |
| **太阳化忌 = 一生核心课题** | `J叔双体系深度解读.md:29,99` 飞星结论"命宫太阳化忌 = 名声迟来 / 觉得没被看见" | ziwei-doushu 三合派也认太阳化忌（甲年生人，年干甲 → 廉/破/武/阳，所以阳忌），但**不会推出"宫干飞化的因果链"** | ⚠️ MED — 三合派认这个结论但解释链不一样，可能让 J叔感觉"被简化了" |

### Q5 装备形态建议（三选一对照）

| 方案 | 描述 | Pros | Cons | 推荐度 |
|---|---|---|---|---|
| **(a) 独立 `ziwei-analyst` agent** | 跟 bazi-analyst 平级，专门跑倪师·三合派紫微 | 边界清晰，倪师体系独立验证；不污染 bazi-analyst | **撕裂 bazi-analyst 八字×紫微交叉验证**（`bazi-analyst.md:79` 已声明 "Own"）；新增 agent 增加调度成本；与现有 liuren-analyst/taiyi-analyst 同质化 | ❌ 不推荐 |
| **(b) backend 注入 bazi-analyst（可切换）** | bazi-analyst 增加 `backend: ["mingli-mcp", "ziwei-doushu-niraidah"]` 选择项，默认 mingli-mcp，需要倪师对照时切 | 不破坏现有 agent 边界；八字×紫微交叉验证保留；J叔可双盘对比；飞星 vs 三合可显式标 backend 来源 | 工程上需要新增 SKILL `ziwei-doushu-engine` 包装 npm 启动 + 输出归一化；需要补 backend 切换 contract | ⭐⭐⭐ **推荐主线** |
| **(c) 仅做只读 SKILL `ziwei-doushu`** | 不动 backend，把 patterns/heming/classics 三块知识做成 SKILL，按需 ad-hoc 调用 | 最轻；不引入算法依赖；不打架 | 排盘核仍是 mingli-mcp 黑盒；51.8 万样本数据集用不上；合盘断语作为单独 SKILL 会脱离上下文 | ⭐⭐ **补充方案**（与 (b) 合体最佳） |

**最佳组合 = (b) + (c) 的混合**：
- `ziwei-doushu-engine` SKILL：算法层 backend，含 algorithm/sihua/patterns，注入 bazi-analyst 作为 "倪师模式" backend；
- `ziwei-classics` SKILL：古籍原文检索，独立可用（不仅紫微，写文章引用也用得上）；
- `ziwei-heming-niraidah` SKILL：合盘断语库，只在合盘管线 (`bazi-analyst.md:71-73`) 调用，与现有合盘流程合流不替换。

### Q6 与 J叔历史验证流程的衔接

**Golden Chart 3 盘 fixture（MEMORY 待办）必须先解决**，原因：
1. 如果 ziwei-doushu 排出来的 J叔本人盘命宫 ≠ 丁卯，整个 J叔已经积累的飞星报告全部失效；要先用 ziwei-doushu 跑一遍 J叔本人盘 raw 输出，与 mingli-mcp 输出 + `J叔紫微斗数盘.md` 三方对照。
2. 如果排盘元素一致（命宫/身宫/五行局/十四主星位置全等），ziwei-doushu 的增量价值（格局/合盘/古籍）才可信地叠加上去。
3. 如果排盘元素不一致，需要先查清差异来源（真太阳时？时辰边界？早晚子时？），**这是先于"采纳 ziwei-doushu"的前置门禁**。

**建议门禁顺序**：
```
Step 0  Sentinel 审 supply chain（spyfree 端到端单点 = mingli-mcp + iztro-py 同人、ziwei-doushu 是 1020⭐ 但 issue/PR 活跃度需查）  # M-1 修订 2026-05-21
Step 1  跑 J叔本人盘 raw 输出（ziwei-doushu localhost + 现有 mingli-mcp 输出）
Step 2  对照 J叔紫微斗数盘.md 三方比对，签收"排盘元素一致"
Step 3  跑 Golden Chart 另 2 盘（彭一杰 / 乙亥大运起运）
Step 4  确认三盘全 [verified] → 升 backend 注入资格
Step 5  跑 J叔本人盘 patterns + heming，与既有飞星报告对照，标 "倪师·三合派一致项 / 飞星派补充项 / 分歧项"
Step 6  Genesis + Artisan 设计 backend 切换 contract（bazi-analyst frontmatter 加 backend 选项 + SKILL 装配）
Step 7  Pilot 一周（J叔每日用一次），观察口径 drift
Step 8  Warden 综合签收，决定是否 GA
```

**特别提醒**：J叔已花重金的飞星派分析（包括 `J叔一生全景-飞星修正版.md`、`J叔双体系深度解读.md`），**不允许被倪师体系覆盖**。ziwei-doushu 落 backend 后，bazi-analyst 输出必须显式标 "飞星侧 / 三合·倪师侧" 来源（已在 `bazi-analyst.md:140` "禁止八字紫微混淆论证" 的 anti-AI-slop 规则里有同源约束，扩展即可）。

---

## 3. 风险与门禁建议

### 🔴 BLOCKER 类（必须先解决，否则不上膛）

| # | 风险 | 缓解 |
|---|---|---|
| B1 | ziwei-doushu 排出的 J叔本人盘命宫与既有 mingli-mcp 输出不一致 | Step 1-2 强制三方对照；如果不一致，先查上游 iztro-py vs iztro npm 是否同步 |
| B2 | algorithm.ts:10 / patterns.ts:12 反飞星立场会污染 J叔飞星派结论 | backend 切换必须强制标 "倪师模式" 标签；输出归一化层不允许把倪师 patterns 写入"飞星派"字段 |
| B3 | 51.8GB 数据集分卷 zip，下载/校验/解压风险 | **不下载**，仅引用 Release URL 作为远程评测 fixture |

### ⚠️ HIGH 类（采纳前 Sentinel 必查）

| # | 风险 | 缓解 |
|---|---|---|
| H1 | iztro / iztro-py 单 maintainer (SylarLong)，供应链单点 | Sentinel 查 npm advisory + GitHub issue 活跃度；vendor 一份固定版本到 `12-Meta_J/skills/ziwei-doushu-engine/vendor/` |
| H2 | ziwei-doushu 含 Next.js / Vercel / pg / ioredis 等运营层依赖（package.json:14-30），但玄学部只要算法 | 抽离时**只取 lib/ziwei + lib/classics**，丢弃 app/ components/ scripts/，缩减 supply chain 表面 |
| H3 | License = MIT (algorithm) + 数据集协议未明示 | **与 B3 互锁**：若执行 B3（不下载数据集，仅做远程评测 fixture 引用），H3 不需审；若未来要下载，必须先 Sentinel 审 + J叔授权。M-4 修订 2026-05-21 |
| H4 | 「ICP 备案审核中」+ 「主域名 wdyziweidoushu666.com」+「小红书：王多鱼AI」= 商业运营痕迹 | 仅取代码不接入 ai 解读 API（README:100-110 已明示开源不含 prompt） |

### ⚪ MED 类（可在 Pilot 期观察）

| # | 风险 | 缓解 |
|---|---|---|
| M1 | bazi-analyst.md `skills: []` 当前为空，backend 注入需要先打通 SKILL 装配机制 | Artisan 配合，先用一个最小 SKILL 跑通 (例如 ziwei-classics)，再上 backend |
| M2 | heming-knowledge.ts 的"倪师原话" `ni_quote` 字段未核（如 "太阳化忌，女命那十年丈夫必有重大灾祸"），引用前 J叔过目 | Pilot 期 J叔逐条审 ni_quote，不通过的字段标 `disputed: true` |
| M3 | iztro 真太阳时校正策略 / 早晚子时归属 / 闰月处理未审 | Step 1-2 用 J叔本人盘（辰时边界明确）+ 1989-02-17 23:30 / 00:30 测试用例核 |

### 加分门禁（启用即赚）

- 加入 ziwei-doushu 后，将 J叔本人盘 raw 输出（ziwei-doushu / mingli-mcp 两路）写到 `12-Meta_J/tests/xuanxue/golden-chart-ziwei.yaml`，**升级 Golden Chart fixture 从 3 盘到 4 盘**（八字-奇门-紫微-紫微·倪师），把"待 J叔人审"从 9 行扩到 12 行——一次解决两个挂账。

---

## 4. Scout → Sentinel 结构化 Handoff

```json
{
  "handoffType": "security-approval-request",
  "source": "meta-scout",
  "target": "meta-sentinel",
  "candidate": {
    "name": "ziwei-doushu",
    "repo": "Renhuai123/ziwei-doushu",
    "version": "main @ 2026-05-21 fork",
    "license": "MIT",
    "stars": 1020,
    "upstream_deps": ["iztro@^2.5.8 (SylarLong, npm, 单 maintainer)", "lunar-javascript@^1.7.3"]
  },
  "scoutAssessment": {
    "roiScore": "3.2/5（算法是 iztro 复用 + 增量在 patterns/heming/classics 三块独立知识 + 评测样本集）",
    "capabilityGap": "格局识别程序化（弱）+ 合盘断语库（薄）+ 古籍原文检索（几乎没有）",
    "preliminaryRiskNotes": "B1 命宫排盘需对照, B2 反飞星立场需 backend 标签隔离, B3 不下载样本集, H1 iztro 单 maintainer, H2 抽离时只取 lib/, H3 数据集协议需 Sentinel 单审, H4 商业运营痕迹剥离"
  },
  "adoptionBrief": {
    "phase1_dryrun": "在 /Users/jeffreyhu/DEV/ziwei-doushu 本地 npm install 后跑 J叔本人盘 → 输出 chart.json，与 mingli-mcp 输出三方对照（不接入 agent）",
    "phase2_skill": "lib/classics/* + lib/ziwei/heming-knowledge.ts 抽成 SKILL ziwei-classics + ziwei-heming-niraidah（SSOT 落 12-Meta_J/skills/）",
    "phase3_backend": "lib/ziwei/{algorithm,sihua,constants,patterns}.ts 包装为 SKILL ziwei-doushu-engine，作为 bazi-analyst backend 选项注入（不替换 mingli-mcp）",
    "integrationScope": "bazi-analyst 单点扩展 backend，不创建新 agent；输出必须显式标 backend 来源（倪师 / 飞星）",
    "rollbackPlan": "rm -rf 12-Meta_J/skills/ziwei-doushu-engine && 撤销 bazi-analyst frontmatter 中 backend 字段；mingli-mcp 默认路径无变化；J叔已有的飞星报告不会被影响"
  },
  "blockers": [
    "B1 J叔本人盘排盘一致性未验证",
    "B2 反飞星立场未做 backend 标签隔离",
    "M1 bazi-analyst SKILL 装配机制未打通（skills: [] 是空的）"
  ],
  "pendingSentinelApproval": true,
  "pendingJUncleApproval": [
    "Golden Chart 3 盘人审（既存挂账，MEMORY xuanxue-strengthening-2026-05-12.md:42-52）",
    "紫微命宫丙寅 vs 丁卯复核（既存挂账，MEMORY xuanxue-p1-upgrade-2026-04-03.md:58）",
    "ziwei-doushu 是否作为 bazi-analyst backend 注入（本报告 Q5 推荐 (b)+(c)）"
  ]
}
```

---

## 5. 证据索引（防 fabrication 自查）

| 断言 | file:line |
|---|---|
| ziwei-doushu 算法核 = iztro | `/Users/jeffreyhu/DEV/ziwei-doushu/lib/ziwei/algorithm.ts:6`，`package.json:23` |
| mingli-mcp 算法核 = iztro-py [verified by meta-prism 2026-05-21] | `/Users/jeffreyhu/.local/share/uv/tools/mingli-mcp/lib/python3.11/site-packages/iztro_py-0.3.4.dist-info`（**实证 iztro-py 存在于 mingli-mcp 安装包内**）+ `mingli_mcp-1.0.16.dist-info/METADATA` `Requires-Dist: iztro-py>=0.3.4`。M-2 修订：原 [unverified] 升级为 [verified]，scout 推断"同人共上游路径"成立 |
| ziwei-doushu 反飞星立场 | `algorithm.ts:10` 注释 + `algorithm.ts:147` 「不再生成 daXians[].siHua / stemIndex / stemName」+ `algorithm.ts:159` 「宫干自化已下线」+ `patterns.ts:12` |
| J叔规则体系含飞星专章 | `紫微斗数规则体系.md:371-601` 第八章 243 行（从 P1-1 升级 2026-04-03 加入）|
| J叔本人盘飞星派报告 | `J叔双体系深度解读-飞星四化与盲派象法.md`（30 次"飞星"匹配）+ `J叔一生全景-飞星修正版.md` |
| J叔紫微命宫 = 丁卯 | `J叔紫微斗数盘.md:26`、`J叔一生全景-飞星修正版.md:9` |
| 命宫位置仍标"待复核" | `xuanxue-p1-upgrade-2026-04-03.md:58` |
| Golden Chart 3 盘待人审 | `xuanxue-strengthening-2026-05-12.md:42-52` |
| ziwei-doushu 含 42 个格局识别 | `patterns.ts:1018` `detectPatterns()` + `grep -c "function detect" patterns.ts` = 42 |
| ziwei-doushu 含 329 行倪师合盘断语 | `lib/ziwei/heming-knowledge.ts` (wc -l = 329) |
| 三本古籍原文 = 559 行 | `lib/classics/data/gusuifu.ts:218` + `quanji.ts:195` + `quanshu.ts:146` |
| bazi-analyst skills 当前为空 | `/Users/jeffreyhu/.claude/agents/bazi-analyst.md:7` `skills: []` |
| 51.8 万样本数据集 | README.md:13-58（Releases v3.0-samples 分 3 卷 5.5GB） |

---

## 6. 给 Warden 的一句话

**ziwei-doushu 不是"补排盘"，是"补格局识别 + 合盘断语库 + 古籍原文 + 倪师对照视角"。算法层与 mingli-mcp 共用 iztro 上游，所以引入它不能改变排盘准确性，只能扩 J叔在紫微解读侧的工具集——前提是 backend 必须做"倪师 vs 飞星"标签隔离，不允许覆盖既有飞星派结论。先解 J叔本人盘三方对照 + Golden Chart 挂账，再谈 backend 注入。**
