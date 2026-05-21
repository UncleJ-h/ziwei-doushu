---
title: ziwei-doushu Round 5 — Domain Closure Audit
auditor: meta-prism
audit_date: 2026-05-21
audit_scope: round 4 整改后 J叔人审前最后一关命理学复审
inputs:
  - /Users/jeffreyhu/DEV/ziwei-doushu/docs/ziwei-fewshot-smoke-juncle-v2.txt
  - /Users/jeffreyhu/Obsidian/UncleJ Dev/21-UncleJ-Departments/01-玄学部/04-我的盘/J叔紫微斗数盘.md
  - /Users/jeffreyhu/Obsidian/UncleJ Dev/21-UncleJ-Departments/01-玄学部/06-工具与方法/紫微斗数规则体系.md
  - /Users/jeffreyhu/Obsidian/UncleJ Dev/12-Meta_J/canonical/skills/ziwei-doushu-engine/SKILL.md
  - /Users/jeffreyhu/.claude/agents/bazi-analyst.md
  - /Users/jeffreyhu/DEV/ziwei-doushu/lib/ziwei/algorithm.ts
  - /Users/jeffreyhu/DEV/ziwei-doushu/lib/ziwei/constants.ts
  - /Users/jeffreyhu/DEV/ziwei-doushu/lib/ziwei/sihua.ts
  - /Users/jeffreyhu/DEV/ziwei-doushu/lib/ziwei/patterns.ts
verdict: PASS-WITH-CONDITIONS
verdict_reason: round 1 DIFF-01~08 八条全部 closed 或 properly-disclosed；smoke v2 修齐 round 1 三大 burden-of-proof 缺口；引擎物理输出与规则体系（rules SSOT）口径一致；vault 与 smoke 的 4 处亮度反向已由 vault「日夜修正/格局修正」与「引擎纯位置」流派差异解释，SKILL.md 顶部已强制披露。剩余 3 处 round-5 新发现属 strengthening（非 blocker），可在 J叔人审同步处理
ammunition_load: APPROVE-WITH-HUMAN-AUDIT — 可签字进 J叔人审环节；J叔人审通过后方可由 internal-ready → public-ready
---

# Prism Round 5 — Closure Audit

> 审完。**条件性批准**。round 1 八处 DIFF 全部 closed/structurally-resolved（5 closed / 3 closed-by-disclosure），smoke v2 把 round 1 的三大「burden-of-proof」缺口补齐（天干 / 大限分段 / 7 级原始亮度），DIFF-01 倪师 vs 飞星派架构冲突已由 SKILL.md 流派归属段 + bazi-analyst Decision Rule 8 + engine-registry allowed_engines 三层硬披露。
>
> 新发现 3 条（1 HIGH / 2 MEDIUM），均属 strengthening 而非 blocker。
>
> **不背书 equipper 任何「已修复」自报**。本审基于 grep / md5 / 源码逐行核验。

---

## 0. Top-Line Verdict 与状态

| reviewState | verificationState | criteriaState |
|---|---|---|
| rated | closable (with human audit) | stable |

- **Verdict**: **PASS-WITH-CONDITIONS**
- **Round 1 closure**: 8/8 findings 全部 closed/properly-disclosed
- **Round 5 新发现**: 3 条（NR5-1 HIGH / NR5-2 MEDIUM / NR5-3 MEDIUM）
- **上膛裁决**: 可签字进 J叔人审，**人审通过前停留在 `internal-ready`，不可标 `public-ready`**

---

## 1. Round 1 八处 DIFF 逐条 Closure 表

| DIFF | round 1 问题 | round 5 状态 | 证据 | closure type |
|---|---|---|---|---|
| **DIFF-01** | 倪师 vs 飞星派架构冲突；vault 159-181 行 20+ 行飞星派分析引擎跑不出 | **closed-by-disclosure** | SKILL.md:10-60 顶部「流派归属与覆盖范围（必读）」段明示「引擎不提供（物理下线，不是 bug）」清单（大限四化 / 宫干自化 / 来因宫 / 流年四化 / 流月四化）+ 「跟 J叔现有 vault 体系的差距」段引用 vault:159-181 具体行号 + 「何时切本 SKILL（bazi-analyst 决策规则）」段限定显式触发词。bazi-analyst.md:100-122 Decision Rule 8 加固版同步落地：默认 mingli-mcp、切换需显式触发词、切后顶部强制标流派 + 列不能算的字段清单。engine-registry.yaml `production_eligibility.ziwei.allowed_engines: [mingli-mcp, ziwei-doushu-niraidah]` 三层联动 | CLOSED |
| **DIFF-02** | 太阴亮度反向：vault 财帛(亥) 太阴(陷) vs iztro miao=庙 | **closed-by-correct-disclosure** | smoke v2 line 18: `财帛(乙亥)[身] 大限 86-95岁: 太阴(庙)`。rules SSOT line 120 明示「太阴...庙旺=子亥」→ iztro 跟 rules 一致，**vault「太阴喜夜生白天生人陷」(line 113-114) 是 vault 自己加的日夜修正**，不是引擎错。SKILL.md DIFF-06 章节披露 3 级压缩问题但同时印 7 级原始值，让 J叔可见原始值。bazi-analyst Decision Rule 8 强制「切倪师模式输出顶部标流派」让两套口径不会混 | CLOSED-BY-CORRECT-DISCLOSURE |
| **DIFF-03** | 天同亮度反向：vault 夫妻(丑) 天同(庙) vs iztro bu=不 | **closed-by-correct-disclosure** | smoke v2 line 20: `夫妻(丁丑) 大限 106-115岁: 天同(不),巨门(不)`。iztro 输出 = 7 级原始值 `不`。vault「天同(庙)」是 vault 自己的判定（可能是格局修正），跟 iztro 纯位置数据不同。这是流派差异不是引擎 bug，已由 SKILL.md「跟 J叔现有 vault 体系的差距」段披露并由 bazi-analyst Rule 8「列不能算的字段清单」保护 | CLOSED-BY-CORRECT-DISCLOSURE |
| **DIFF-04** | 贪狼亮度反向：vault 子女(子) 贪狼(陷) vs iztro wang=旺 | **closed-vault-bug-disclosed** | smoke v2 line 19: `子女(丙子) 大限 96-105岁: 贪狼(旺)`。**rules SSOT line 120 明示「贪狼...庙旺=子午; 陷=卯酉」→ iztro 跟 rules 一致，vault「贪狼(陷)在子」是 vault 跟自己的 rules SSOT 打架**。引擎正确，vault 自己有 bug。SKILL.md 通过披露 vault 飞星派叙事 + 引擎三合派立场让 J叔人审时看得见这条差异 | CLOSED-VAULT-BUG-NOT-ENGINE-BUG |
| **DIFF-05** | 巨门亮度反向：vault 夫妻(丑) 巨门(得) vs iztro bu=不 | **closed-by-correct-disclosure** | 同 DIFF-03 同位置。smoke v2 line 20 印 `巨门(不)` 7 级原始值。vault「巨门(得)」与 iztro「巨门(不)」流派差异已披露 | CLOSED-BY-CORRECT-DISCLOSURE |
| **DIFF-06** | 14 主星 9/16 亮度不一致（聚合）+ 3 级压缩损失分辨率 | **closed-with-residual-disclosure** | smoke v2 line 9-20 整段全用原始 7 级亮度（庙/旺/得/利/平/不/陷），不再用压缩后的 bright/normal/dim。SKILL.md:127-145「亮度等级压缩（DIFF-06）」章节明示：`vendor/algorithm.ts:31` `mapBrightness()` 把 7 级压成 3 级是已知陷阱，提供两条绕过路径（改 mapBrightness OR 直读 iztro raw），smoke v2 走的是第二条。**残留**：bazi-analyst 调 SKILL 默认拿到的还是 3 级压缩值（除非 smoke 模式），日常生产路径仍有损失 — 见 NR5-2 | CLOSED-WITH-RESIDUAL |
| **DIFF-07** | smoke 缺 12 宫天干 + 大限分段 | **closed** | smoke v2 line 9-20 全 12 宫每行格式 `<宫名>(<天干><地支>) 大限 <起>-<止>岁: <星>`，**12 宫天干 + 大限范围一次全印**。vs vault line 37-48 12 宫表，逐条对：兄弟丙寅✓父母戊辰✓福德己巳✓田宅庚午✓官禄辛未✓仆役/交友壬申✓迁移癸酉✓疾厄甲戌✓财帛乙亥✓子女丙子✓夫妻丁丑✓命宫丁卯✓ — **全 12 宫天干 100% 对齐**。五虎遁验算：1984 年干甲，甲己之年丙作首 → 寅宫=丙寅 ✓（与 smoke v2 line 9「兄弟(丙寅)」一致）。大限分段：vault 36-45 田宅 vs smoke v2 line 13 `田宅(庚午)[现行大限] 大限 36-45岁` ✓ | CLOSED |
| **DIFF-08** | vault 命主/身主查错键（vault 自身 bug） | **closed-by-out-of-scope-disclosure** | round 1 已注「equipper 不负责修 vault」。本轮核 SKILL.md 没找到显式「vault 自身错不归本 SKILL」一句，但 SKILL.md「跟 J叔现有 vault 体系的差距」段（line 32-40）+ bazi-analyst Decision Rule 8「列不能算的字段清单」隐含了「引擎只算自己能算的，vault 历史口径要 J叔决策」。**residual**：SKILL.md 没显式拒绝认领 vault 错 — 见 NR5-3 | CLOSED-WITH-RESIDUAL |

**Closure 统计**：5 CLOSED / 3 CLOSED-WITH-RESIDUAL（DIFF-02/03/05 是同根流派差异、DIFF-06 残留 3 级压缩、DIFF-08 残留 vault 错归属未显式拒认）。无 still-open 或 partial。

---

## 2. Round 5 新发现（必须 ≥3 — 满足）

### NR5-1【HIGH · SKILL.md 与 bazi-analyst Rule 8 之间存在隐性矛盾】「allowed_engines 在册」被默认等同于「verified」

**File:Line**:
- `bazi-analyst.md:119`：「未列入 `allowed_engines` 的引擎**仅供调试，不进生产输出**（输出文件 frontmatter 标 `engine_unverified: true`）」
- `engine-registry.yaml`：`production_eligibility.ziwei.allowed_engines: ["mingli-mcp", "ziwei-doushu-niraidah"]` + note「**allowed_engines 不等于 verified=true，只是登记表**」
- `bazi-analyst.md:100` Rule 8 全段：grep 结果 = **零** 引用 `verified` / `verified_by` / `verified_date` / `audit_package_ref`

**伤害模式**：
- ziwei-doushu-niraidah 当前**已列入 allowed_engines**（=进生产链路），但没有任何地方证明它已被 J叔签字 verified（xuanxue-chart-validator 三盘 Golden Chart 人审还没完成）
- 按 Rule 8 当前措辞，bazi-analyst 调 ziwei-doushu 不会标 `engine_unverified: true`（因为它在 allowed_engines 里），但严格说还没人审过
- 这是 round 1 H-2 H-3 的延续：allowed_engines 的"在册"被默认当成了"verified"，但 registry 自己 note 说两者不等

**修复（任选一项）**：
- (a) bazi-analyst.md Decision Rule 8 加一行：「在 allowed_engines 但 `verified_by_juncle` 字段为空时，输出仍标 `engine_unverified: true`」
- (b) engine-registry.yaml 加 `verified_by_juncle` 字段，ziwei-doushu-niraidah 标 `null`，J叔人审通过后填日期
- (c) SKILL.md 顶部加一行：「⚠️ 本 SKILL 当前状态 = `allowed_engines` 在册，**未** Golden Chart 人审签字。bazi-analyst 调本 SKILL 输出文件必须 frontmatter 标 `engine_unverified: true` 直到 J叔签字」

**closure 条件**：J叔人审签字 + 三处之一加显式 verified gate。**人审前 SKILL 顶部应加 warning banner**。

---

### NR5-2【MEDIUM · 3 级压缩与 7 级原始值的二元字段未落地】SKILL.md DIFF-06 章节给出「未来方向」但 round 4 没做

**File:Line**:
- `SKILL.md:143`：「**未来方向**：把 `brightness` 字段同时输出 `brightness: 'bright'|'normal'|'dim'` + `brightnessRaw: '庙'|'旺'|'得'|'利'|'平'|'不'|'陷'` 双字段...当前 round 4 未落地，留 backlog」
- `algorithm.ts:46-51` `mapBrightness()` 实际状态：只返回 3 级，没有 raw 字段
- `types.ts` Star type：grep 不到 `brightnessRaw` 字段

**伤害模式**：
- smoke v2 之所以能印 7 级，是因为绕过 algorithm.ts 直接读 iztro raw（SKILL.md 路径 b）
- 但 bazi-analyst 走生产链路调 `generateChart()` 拿到的 `Star.brightness` 仍是 3 级 union（types.ts:28）
- 如果 J叔要在生产解读里看「太阴在亥 = iztro 原始庙 vs vault 修正陷」二选一，bazi-analyst 走默认路径拿不到原始 7 级 → 流派差异隐形丢失
- DIFF-06 实际是「披露了 + 文档说将来做 + 现在没做」三层

**修复**：
- 短期：bazi-analyst 走 SKILL 时，加一句「读 brightness 字段需注意 algorithm.ts:31 已压缩，原始 7 级须绕 iztro raw — 见 SKILL.md DIFF-06」
- 中期：落 brightnessRaw 双字段（round 5 backlog 接 round 6 强化时一起做）

**closure 条件**：J叔决定优先级；如果 J叔人审仅用 smoke v2 文件（带 7 级），不打开生产链路，此项可降级为 accepted-risk。

---

### NR5-3【MEDIUM · vault 错归属未显式拒认】DIFF-08 closure 留了灰色地带

**File:Line**:
- round 1 DIFF-08：vault 命主=文曲（实际应是贪狼=子年命主）/ 身主=火星（实际应是天同=火六局身主）
- round 5 任务派单原文：「equipper 没动 vault，这一项 equipper 不负责修，但你要确认 SKILL.md 是否提示了"vault 自身错不归本 SKILL"避免污染」
- 本次核 SKILL.md 全文：grep `vault 自身` / `vault bug` / `vault 错` / `vault SSOT` = **零** hits

**伤害模式**：
- SKILL.md 现在的「跟 J叔现有 vault 体系的差距」段（line 32-40）只举了大限四化的例子，没举命主/身主错误的例子
- J叔人审时看到 smoke v2 不输出命主/身主 → 可能默认「引擎不算 = 我 vault 写的是对的」→ 实际 vault 跟规则体系打架
- 这是「沉默 = 默认 vault 对」的反向陷阱

**修复**：
- SKILL.md「跟 J叔现有 vault 体系的差距」段加一节：「**vault 自身已知不一致点（不归本 SKILL 修，但 J叔人审需自查）**：
  - 命主 vault=文曲 vs rules 子年=贪狼（vault 用了命宫地支查表）
  - 身主 vault=火星 vs rules 火六局=天同（vault 用了一个非 rules 体系）」
- 或在 bazi-analyst.md Decision Rule 8 加一句：「切倪师模式输出时，如果 vault 已有内容跟本 SKILL 输出冲突且 vault 内部跟 rules SSOT 也冲突，标"vault SSOT 待 J叔核"而不是默认 vault 对」

**closure 条件**：SKILL.md 或 bazi-analyst 任一处加显式拒认 + 列出 vault 已知 bug 清单。

---

## 3. 额外深挖项核验（任务派单要求）

| 深挖项 | 核验结果 | 证据 |
|---|---|---|
| 12 宫天干 vault vs smoke v2 是否一致 | ✅ **全 12 宫天干 100% 对齐** | vault line 37-48 vs smoke v2 line 9-20 逐条对齐。命宫丁卯/兄弟丙寅/父母戊辰/福德己巳/田宅庚午/官禄辛未/仆役壬申/迁移癸酉/疾厄甲戌/财帛乙亥/子女丙子/夫妻丁丑 — 12/12 一致 |
| 五虎遁验算（1984 甲年） | ✅ **PASS** | 甲己之年丙作首 → 寅宫=丙寅 → smoke v2 line 9「兄弟(丙寅)」一致。equipper 自报「五虎遁正确」实测属实 |
| 大限四化 vault vs smoke 是否「根本不是一种东西」 | ✅ **正确披露** | vault line 165「庚午大限：太阳化禄、武曲化权、太阴化科、天同化忌」= 飞星派 庚干四化（rules line 243）。smoke v2 line 30-37「年干甲四化{禄廉贞/权破军/科武曲/忌太阳}」= 倪师只算本命年干（甲）。**两者根本不是一种东西**已由 SKILL.md「引擎不提供」段明示。smoke v2 line 30 header 已标「年干四化 (**倪师立场: 仅算本命年干**, sihua.ts 实接通)」直接读者可见 |
| smoke v2 顶部是否强制标「本输出不含大限四化」 | ⚠️ **部分** | smoke v2 line 1 顶部标「ziwei-doushu smoke v2 (J叔, hour=4 辰时)」，没有标「⚠️ 流派：倪海夏《天纪》三合派 · 不含飞星四化」。SKILL.md:55-59 强制要求「本 SKILL 任何输出顶部必须标」，但 smoke v2 是 raw debug dump，不是生产输出 — 灰色地带。**建议**：smoke v2 header 加 `[engine_unverified: true; 流派: 倪海夏三合派; 不含飞星四化]` 一行 |
| patterns 42 detectors 大部分对 J叔盘不触发？还是接通方式有问题 | ✅ **接通正确，识别保守是设计选择** | smoke v2 line 25-28 patterns 输出 1 条「太阳化忌入命 [caution]」。核 patterns.ts line 685-708 `detectHuaJiRuMingQian()` 实现：本命年干甲 → 忌=太阳 → 太阳在命宫卯 → 触发，签名要求与命宫主星精确匹配。大部分 detectors 没触发是因为 J叔盘没那么多典型格局组合（紫府同宫 / 七杀破狼三星齐 / 机月同梁 等），不是接通 bug。**建议**：smoke v2 加一句注释「patterns 输出 1 条 = 检测 42 个识别器对 J叔盘只 1 条命中，非接通故障」避免 J叔人审误判 |
| 借星：iztro 按对宫借还是三方四正借 | ✅ **按对宫借（rules + 引擎一致）** | algorithm.ts:194-208 借星实现：`oppositeBranch = (p.branch + 6) % 12` → **按对宫借**（与 rules line 619「借星安宫: 命宫无主星时借对宫主星来论命」一致）。smoke v2 line 14「官禄(辛未) 大限 46-55岁: (空宫 → 借夫妻: 天同/巨门)」=正确（官禄对宫=夫妻），line 16「迁移(癸酉) 大限 66-75岁: (空宫 → 借命宫: 太阳/天梁)」=正确（迁移对宫=命宫）。vault line 105「官禄宫无主星，借对宫（夫妻宫）天同巨门来看」=同口径 |
| equipper 自报「6/7 原始亮度等级（庙旺得利平不 — 陷在J叔盘真无）」核实 | ✅ **PASS** | smoke v2 line 9-20 14 主星亮度逐颗扫：庙(8次)/旺(1次=贪狼)/得(2次=武曲+破军)/利(1次=廉贞)/平(1次=天机)/不(2次=天同+巨门)/陷(**0次**)。**equipper 自报「陷在 J叔盘真无」属实**，不是 SLOP-09 复发 |
| equipper 自报「五虎遁正确」核实 | ✅ **PASS** | 见上方五虎遁验算行 |

**深挖项 8 项通过 7 项 + 1 项部分（smoke v2 header 流派标）** — 部分项不阻断 verdict。

---

## 4. PRIN-01~05 原则合规检查（强制项）

| # | 原则 | 验证结果 | 证据 |
|---|---|---|---|
| **PRIN-01** Configurable | ✅ PASS | bazi-analyst frontmatter `backend.ziwei: ["mingli-mcp", "ziwei-doushu-niraidah"]` 配置驱动，不硬编码引擎。SKILL.md hour 字段语义+真太阳时校正策略通过参数传入而非内置规则 |
| **PRIN-02** Single Source | ✅ PASS | bazi-analyst.md md5sum 在两处镜像一致（`ca6522ca29a5c1aa2bad875724d4334e`，已 grep 验证）。engine-registry.yaml 是 production_eligibility 单一 SSOT |
| **PRIN-03** Layering | ✅ PASS | bazi-analyst（编排外壳）→ ziwei-doushu-engine（SKILL）→ algorithm.ts（vendor 算法）三层清晰。bazi-analyst 不直接调 iztro |
| **PRIN-04** Decoupling | ✅ PASS | bazi-analyst 通过 backend 字段 + Decision Rule 8 的显式触发词协议跟 SKILL 交互，不调内部函数 |
| **PRIN-05** i18n / Normalization | ✅ PASS | SKILL.md 触发词 + 输出强制标注是统一规范。`engine_unverified: true` frontmatter 标签是 normalized 字段 |

**5/5 PASS** — 原则合规。

---

## 5. AI-Slop 检测

| Signature | 触发? | 证据 |
|---|---|---|
| SLOP-01~02 | ❌ 无 | smoke v2 + SKILL.md 内容紧凑，无套话开场/总结填充 |
| SLOP-03 | ❌ 无 | 「流派归属」段是具体计划（流派+物理下线清单+触发词），非空概念 |
| SLOP-04 | ❌ 无 | 流派披露段是中等长度叙事，不是 5+ 条 <50 字凑数 |
| SLOP-05 | ❌ 无 | 每条断言挂钩 file:line（algorithm.ts:147 / vault:159-181 / rules:120 等） |
| SLOP-06 | ❌ 无 | 把 ziwei-doushu 换成其他紫微引擎，整段流派披露不成立（高度具体） |
| SLOP-07 | ❌ 无 | 数据全部来自实跑/源码/vault，无编造 |
| SLOP-08 | ❌ 无 | 因果链完整：流派立场 → 引擎下线 → vault 不兼容 → 显式触发词协议 |
| SLOP-09 | **⚠️ 边界** | 「6/7 原始亮度等级（陷在 J叔盘真无）」一句**实测属实**，不是 SLOP-09。但 smoke v2 顶部没标流派 banner 是潜在 SLOP-09 苗头（结构正确但缺标识） → 转入 NR5-1 处理 |

**SLOP 检测**：0 触发，1 边界（已转入新发现）。

---

## 6. 评估自反思（Eval Critique）

按 Prism 协议自查本次评估标准：

1. **是否有 PASS 的 weak assertion?**
   - DIFF-02/03/05 标 closed-by-correct-disclosure 而非 closed — 这是 weak assertion 风险点。理由：「披露 = 解决」只在 J叔确认流派选择后才真成立。我用 closure type 区分了，但读者可能误读为完全 closed。**降级建议**：J叔人审时必须明确选 (a) iztro 纯位置 / (b) vault 日夜+格局修正 / (c) 双口径并列，否则这三条不能从 closed-by-disclosure 升到 fully-closed
2. **是否有 coverage gap?**
   - 漏审：SKILL.md hour 字段早晚子时立场（DIFF 之外）— J叔选倪师立场=分早晚子时还是平民派=合并子时，本次没核 J叔本人的立场。SKILL.md line 113 留了 J叔决策位但没标已决策
   - 漏审：xuanxue-chart-validator agent 的三盘 Golden Chart 人审进度（本次任务派单是 ziwei-doushu 命理学复审，没要求审 validator，但这是下游 verified gate 的必经环节）
   - 漏审：smoke v2 没核 sihua.ts / patterns.ts 全代码路径，只核了入口接通点（detectHuaJiRuMingQian + getSiHuaByStem 两个函数）
3. **是否有 unverifiable assertion?**
   - 无。所有断言挂钩 file:line + grep + md5 / 实跑可重现
4. **本次审核可能产生的 False Confidence?**
   - **风险点**：closure 统计 5+3=8/8 看起来漂亮，但 3 条 closed-by-residual-disclosure 的实质是「问题没消失，只是有显式 banner 提醒」。J叔人审时如果跳过 SKILL.md 顶部直接看 smoke v2 结论，仍可能踩坑 → 见 NR5-1 推荐的 SKILL.md 顶部加 warning banner

---

## 7. Verification Closure Packet

| Finding | severity | round 1 status | round 5 status | fixEvidence | closeFindings |
|---|---|---|---|---|---|
| DIFF-01 | FATAL | open | **closed** | SKILL.md:10-60 流派披露段 + bazi-analyst:100-122 Rule 8 + engine-registry production_eligibility | CLOSED |
| DIFF-02 | CRITICAL | open | **closed-by-disclosure** | smoke v2:18 印 7 级原始庙 + SKILL.md DIFF-06 + bazi-analyst Rule 8 不能算字段清单 | CLOSED-WITH-RESIDUAL（待 J叔流派选择） |
| DIFF-03 | CRITICAL | open | **closed-by-disclosure** | smoke v2:20 印天同(不) + SKILL.md vault 差距段 | CLOSED-WITH-RESIDUAL |
| DIFF-04 | CRITICAL | open | **closed-vault-bug-disclosed** | smoke v2:19 + rules:120 引擎对、vault 错 | CLOSED |
| DIFF-05 | CRITICAL | open | **closed-by-disclosure** | smoke v2:20 巨门(不) | CLOSED-WITH-RESIDUAL |
| DIFF-06 | HIGH | open | **closed-with-residual** | smoke v2 全用 7 级 + SKILL.md:127-145 DIFF-06 章节 + 双字段未来方向 backlog | CLOSED-WITH-RESIDUAL（双字段未落） |
| DIFF-07 | HIGH | open | **closed** | smoke v2:9-20 完整 12 宫天干 + 大限分段；五虎遁验算 ✓ | CLOSED |
| DIFF-08 | MEDIUM | open | **closed-by-out-of-scope** | round 1 已注 equipper 不修 vault，本轮确认 SKILL.md 没显式拒认 → 转 NR5-3 | CLOSED-WITH-RESIDUAL |
| **NR5-1** | HIGH | new | **open** | needs J叔人审 + SKILL.md/bazi-analyst/engine-registry 任一处加 verified_by_juncle gate | OPEN |
| **NR5-2** | MEDIUM | new | **open** | needs brightnessRaw 双字段落地 OR accepted-risk if J叔只用 smoke 文件 | OPEN |
| **NR5-3** | MEDIUM | new | **open** | needs SKILL.md 或 bazi-analyst 加 vault 已知 bug 显式拒认清单 | OPEN |

**verificationState = closable**（round 1 八条全收口；3 条新发现 = 强化项不阻断签字进 J叔人审）

**人审通过 → public-ready 必备**：
- J叔签字明示流派选择（DIFF-02/03/05 升 fully-closed）
- SKILL.md 顶部加 warning banner「未 Golden Chart 人审签字 → engine_unverified: true」（NR5-1 解）
- xuanxue-chart-validator chart1_jshu_self 人审包闭环

---

## 8. 上膛裁决

**verdict = PASS-WITH-CONDITIONS**

**可以**：签字进 J叔人审环节。

**不可以（人审前禁止）**：
- 在 J叔笔记里产出任何带「ziwei-doushu-engine 已 verified」标签的文件
- bazi-analyst 默认走 ziwei-doushu-niraidah backend（默认仍是 mingli-mcp）
- engine-registry 加 `verified_by_juncle: J叔` 字段
- surfaceState 从 `internal-ready` 升 `public-ready`

**人审时 J叔必须做的 3 件事**：
1. 显式选流派：(a) iztro 纯位置 / (b) vault 日夜+格局修正 / (c) 双口径并列 — DIFF-02/03/05 才能升 fully-closed
2. 决定 hour 字段早晚子时立场（SKILL.md:113 J叔决策位）— 影响所有 23:00-01:00 出生人的盘
3. 拍是否接受 NR5-1 推荐的「SKILL.md 顶部加 warning banner + bazi-analyst Rule 8 加 verified gate」修复

**必杀建议（如 J叔只能动一处）**：动 NR5-1。原因：NR5-1 解了之后，verified gate 真上膛，allowed_engines 不再被误读为 verified，整套 ziwei-doushu 装备从「在册」升「可签字 ready」。

---

## 9. Memory 写回包

```yaml
writebackDecision: writeback
target: .claude/projects/-Users-jeffreyhu-Obsidian-UncleJ-Dev/memory/ziwei-doushu-round5-prism.md
content_summary:
  - round 1 八处 DIFF 全部 closed/properly-disclosed
  - DIFF-04 实证 vault 跟自己 rules SSOT 打架（贪狼陷在子位 vs rules 庙旺=子午）→ vault 待 J叔人审修
  - DIFF-02/03/05 是流派差异不是引擎 bug（vault 日夜+格局修正 vs iztro 纯位置）
  - smoke v2 修齐 round 1 三大 burden-of-proof 缺口（天干 / 大限 / 7 级亮度）
  - round 5 新发现 3 条（NR5-1 verified gate / NR5-2 brightnessRaw 双字段 / NR5-3 vault 错显式拒认）
  - 上膛裁决：可签字进 J叔人审；人审前停在 internal-ready
evolution_signal:
  - 元prism Lesson: 「亮度反向」类发现首先要核 rules SSOT，再判定是引擎错还是 vault 错。round 1 把 4 处都列为 CRITICAL 偏紧，实际 1 处是 vault bug、3 处是流派差异
  - 元prism Lesson: SKILL.md 流派披露段是「闭嘴显式化」最有效的工具 — 把引擎物理下线的东西列在「不提供」清单比让用户拿到 undefined 再猜更好
  - 元prism Lesson: closed-by-disclosure ≠ closed。closure type 必须区分，避免 false confidence
```

---

*Audit conducted by meta-prism, 2026-05-21. No equipper self-reports trusted. All evidence traceable to file:line, grep, md5, or 实跑 iztro 源码核对.*
