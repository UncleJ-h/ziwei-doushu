# Ziwei-Doushu 装备战役 — Round 6 Prism 终审

**审核 Agent**：meta-prism
**审核时间**：2026-05-21
**审核范围**：Round 5 J叔批 P0+P1 共 6 条整改的独立 closure 验证 + Round 6 新发现挖掘
**审核纪律**：禁止背书 equipper 任何"已修复"自报；每条修复必须独立 grep / md5 / run 验证

---

## 1. 顶层 verdict

**PASS-WITH-CONDITIONS（条件签）**

- 6/6 修复 closure 真核：**5 PASS + 1 PARTIAL**（NEW-2 detector 数 ≠ 42 修了 SKILL.md 但漏修 smoke-v2.ts 死字符串）
- Round 6 新发现：**4 条**（NF-1 ~ NF-4，含 1 HIGH / 2 MEDIUM / 1 HIGH）
- 上膛裁决：**SKILL ziwei-doushu-engine 可标 `internal-ready` → 进 J叔 Golden Chart 人审**；但 NF-1 (smoke-v2.ts 42 残留) 必须先修，NF-2 (12 agent 中 11 个裸奔) 必须开 round 7 立项（不阻塞本 SKILL）；NF-4 (vault 真盘污染) 必须在 J叔人审清单里硬列

---

## 2. 6 条修复 closure 真核表

| # | Task | Equipper 自报 | Prism 独立验证 | 真实证据 | 判定 |
|---|------|--------------|---------------|---------|------|
| 1 | vault-root md5 同步 | 3 方 = 95a3cf03... | `md5 canonical vault-root global` 三方一致 | 全 = `95a3cf03a145f43db4c766d11f8dbd2b` | **PASS** |
| 2 | verified gate 接入 bazi-analyst | Rule 8 加 "verified 三级状态" 段 | bazi-analyst.md 真有 `verified 三级状态` 段位（line 121-135），列出 verified / audit_pending / pending_validation / conditional / engine_unverified 五态枚举 + frontmatter banner 决策 | `grep -nE "verified\|audit_pending\|engine_unverified\|pending_validation"` 命中 line 119/121/123/124/125/129/131/134/135 | **PASS** |
| 3 | 42 → 34 detector | grep patterns.ts 实测 = 34 | `grep -cE "^\s*name:\s*['\"]" patterns.ts` = **34** 实证一致；SKILL.md `42` 仅余 1 处反向引用（round 5 prism 上下文说明）；algorithm.ts:18 + algorithm.ts:280 已正确改 34；**但 smoke-v2.ts:54 死字符串仍写 "格局识别 (42 detectors / patterns.ts 实接通)"** | `grep -n "42" scripts/smoke-v2.ts` → 仍输出"42 detectors" | **PARTIAL — 见 NF-1** |
| 4 | brightnessRaw 双字段 | types.ts + algorithm.ts | types.ts:29 真有 `brightnessRaw?: "庙"\|"旺"\|"得"\|"利"\|"平"\|"不"\|"陷"`；algorithm.ts:167 真在 `generateChart` 内填充；现场跑 smoke 验证 6 颗主星全部输出 brightnessRaw（武曲=得 / 天相=庙 / 太阳=庙 / 天梁=庙 / 七杀=庙 / 天机=平），全部命中 7 级中文枚举；`brightness` 3 级压缩函数 `mapBrightness` (line 49-55) 仍保留向后兼容 | smoke 实际产出 JSON 已验 | **PASS** |
| 5 | vault SSOT bug 拒认段 | SKILL.md 有此段 | SKILL.md line 46 真写 DIFF-04 贪狼亮度（子位应庙/旺，iztro 旺与 rules 一致，vault 错）；line 47 真写 DIFF-08 命主/身主查询键错（vault 文曲/火星错，规则表应贪狼/天同）；line 50 真写"反陷阱提示：本 SKILL 输出沉默 ≠ 默认 vault 对" | grep DIFF-04/DIFF-08/沉默 全命中 | **PASS（但留 NF-4 反向污染）** |
| 6 | SSOT hook (NEW-3) | check-ssot-mirror.mjs + meta:check:runtimes 接入 | (a) `scripts/check-ssot-mirror.mjs` 存在 (4322 bytes)；(b) `package.json:9` 真接入 `"meta:check:runtimes": "node scripts/sync-runtimes.mjs --check && node scripts/check-ssot-mirror.mjs"`；(c) **守门真测**：人工注入"# DRIFT_TEST_FROM_PRISM_ROUND6"到 vault-root → 跑 `node scripts/check-ssot-mirror.mjs` → exit 1，报 `[FAIL] bazi-analyst.md: canonical = 95a3cf03… drift @ ~/Obsidian/UncleJ Dev/.claude/agents/bazi-analyst.md → 6648a30d…`；还原后跑 `npm run meta:check:runtimes` → PASS。**真守门成立** | exit code + 报错文案全验 | **PASS（但守护范围太窄，见 NF-2）** |

**Closure 综合**：5 PASS + 1 PARTIAL（仅 NEW-2 残一行死字符串），无任何"已修复"自报造假。

---

## 3. Round 6 新发现

### NF-1（MEDIUM）— smoke-v2.ts 死字符串 42 detector 残留

**现象**：
```
$ npx tsx scripts/smoke-v2.ts
...
==== 格局识别 (42 detectors / patterns.ts 实接通) ====
总数: 1
  - 太阳化忌入命 [caution] ...
```

**Grep 证据**：`grep -n "42" scripts/smoke-v2.ts` → `54:console.log('==== 格局识别 (42 detectors / patterns.ts 实接通) ====');`

**根因**：equipper 改 SKILL.md (3 处)、algorithm.ts (2 处) 都对了，**但漏改 smoke-v2.ts 这一行 console.log 死字符串**。J叔/审核者跑 smoke 时眼睛看到的是 42（错），不是 34（对）—— 与 SKILL.md 描述自相矛盾。SLOP-09 等级（同字段 source 不一致）。

**Severity**：MEDIUM。**不致命但是修复完整性 closure 漏**：equipper 自报"42→34"声明，未含完整影响面扫描。修复一行字符串即可：
```ts
console.log('==== 格局识别 (34 detectors / patterns.ts 实接通) ====');
```

**预防**：把"detector 数"放配置常量 `DETECTOR_COUNT = 34`，让 SKILL.md、algorithm.ts、smoke-v2.ts 都从同一处读，消除 magic number 漂移（PRIN-02 Single Source 违反）。

---

### NF-2（HIGH）— SSOT hook 守护范围仅 1/12 = 系统性裸奔

**现象**：`check-ssot-mirror.mjs` MIRRORS 数组只列 `bazi-analyst.md` 一个。当前 canonical/agents/ 下有 **12 个 agent**（bazi-analyst, external-repo-equipper, j-campaign-writer, meta-artisan, meta-conductor, meta-genesis, meta-librarian, meta-prism, meta-scout, meta-sentinel, meta-warden, xuanxue-chart-validator），守护率 = **1/12 = 8.3%**。

**Grep 证据 — 现场全 12 agent 三方对照**：
```
[OK]   bazi-analyst                          ← 唯一一个守护中
[DIFF] external-repo-equipper  canonical=78b0ca19 vault=(missing)  global=78b0ca19
[DIFF] j-campaign-writer       canonical=a019ea34 vault=(missing)  global=05485c2b   ← 真漂移
[DIFF] meta-artisan            canonical=3cf33ad8 vault=(missing)  global=3cf33ad8
[DIFF] meta-conductor          canonical=82096456 vault=(missing)  global=beeeb3cc   ← 真漂移
[DIFF] meta-genesis            canonical=2f98831a vault=(missing)  global=c78ce5fb   ← 真漂移
[DIFF] meta-librarian          canonical=67f5e766 vault=(missing)  global=67f5e766
[DIFF] meta-prism              canonical=8057d7b8 vault=(missing)  global=8057d7b8
[DIFF] meta-scout              canonical=d499bb5c vault=(missing)  global=d499bb5c
[DIFF] meta-sentinel           canonical=9fedde84 vault=(missing)  global=040d61aa   ← 真漂移
[DIFF] meta-warden             canonical=67de51bb vault=(missing)  global=7512d60a   ← 真漂移
[DIFF] xuanxue-chart-validator canonical=e41a3615 vault=(missing)  global=f7f647c2   ← 真漂移（且 vault 缺）
```

**6 个 canonical vs global 真 hash 漂移**（meta-conductor / meta-genesis / meta-sentinel / meta-warden / j-campaign-writer / xuanxue-chart-validator）—— 即用户在 vault-root cd 下开 session 时，全局 ~/.claude/ 读到的内容跟 canonical SSOT 已经不一致，但**没有任何守门**。

**Severity**：HIGH。这是 round 5 NEW-3 修复的**结构性副作用**：把守护机制建起来了，但只塞了 1 个进保护伞。equipper 的 closure 是"修了 NEW-3"，但没意识到 NEW-3 暴露的根本问题（vault-root projection 漂移）对所有 canonical agent 都成立。

**矛盾点**：本 Round 6 我自己运行 `npm run meta:check:runtimes` → 输出 `[PASS] bazi-analyst.md: 2-way md5 一致`，**但 11 个其他 agent 全部漂移它一无所知，仍报 OK**。这是"门禁报 PASS = 实际安全"的典型治理盲区（模式 D 信号 — 做一半交差）。

**修复方向**（不阻塞本 SKILL 上膛，但必须开 round 7 立项）：
1. 把 MIRRORS 数组扩到 12 全列
2. 把 vault-root .claude/agents/ 缺失的 10 个文件补齐（或显式声明"vault-root 不投影 X agent"）
3. 跑一次 `--fix` 把当前真漂移的 6 个 agent 拉齐（需先确认哪边是真 SSOT）

**与 J叔判 ziwei 上膛的关联**：bazi-analyst 已守护 → ziwei-doushu 装备无影响。但治理层 SSOT 系统性裸奔属另一战役。

---

### NF-3（MEDIUM）— engine-registry status 枚举与 bazi-analyst Rule 8 三级状态对位不完全等同

**现象**：
- **bazi-analyst.md line 121-125** 列出五态：`verified` / `audit_pending` / `pending_validation` / `conditional` / `engine_unverified`
- **engine-registry.yaml line 11-17** 注释里列出六态：`pending_validation` / `audit_pending` / `verified` / `conditional` / `rejected` / `superseded`

**对位检查**：

| Registry status | bazi-analyst 处理路径 | 一致？ |
|----------------|---------------------|-------|
| pending_validation | 显式列入"audit_pending / pending_validation / conditional" 路径（加 banner + frontmatter） | ✅ |
| audit_pending | 同上 | ✅ |
| verified | 直接生产输出 | ✅ |
| conditional | 同 pending_validation 路径 | ✅ |
| **rejected** | **未列入路径** | ❌ **缺位** |
| **superseded** | **未列入路径** | ❌ **缺位** |
| engine_unverified | bazi-analyst 自定义（不在 registry 枚举），是"不在 allowed_engines 清单"的路径标记 | ⚠️ 语义错位 |

**Severity**：MEDIUM。Registry 引入了 `rejected` / `superseded` 两态但 bazi-analyst 不知道怎么处理：
- 如果有引擎被 J叔签 `rejected`，bazi-analyst 不应有 fallback 路径让它仍被调用（应直接 BLOCKED）
- 如果某引擎被 `superseded`，bazi-analyst 应明示用户切到新版本

**矛盾点**：equipper 自报"verified 三级状态"，但 registry 是六态。"三级"是不严谨的简化（三大类生产决策 — 直接出 / 加 banner / 拒绝），不是 status 枚举。**叙事简化造成 status 覆盖度漏 2 态**。

**修复方向**：bazi-analyst Rule 8 加 `rejected → BLOCKED` 与 `superseded → suggest_migration` 两路径；或在 registry 注释明示这两态不进生产链路。

---

### NF-4（HIGH）— vault 真盘文件污染源未触达，J叔人审会被错误数据引导

**现象**：
- SKILL.md 漂亮地拒认了 vault DIFF-04（贪狼亮度）+ DIFF-08（命主/身主键错）+ 反陷阱提示。
- **但 vault 真盘文件本身 `/Users/jeffreyhu/Obsidian/UncleJ Dev/21-UncleJ-Departments/01-玄学部/04-我的盘/J叔紫微斗数盘.md` 仍然挂着错误数据零警告**：
  - line 28: `| **命主** | 文曲 |` （错，应为贪狼）
  - line 29: `| **身主** | 火星 |` （错，应为天同）
  - line 46: `| **子女宫** | 丙子 | 贪狼(陷) | ...` （错，应为庙/旺）

**Grep 证据**：
```
$ grep -nE "命主|身主|贪狼" J叔紫微斗数盘.md
28:| **命主** | 文曲 |          ← rules SSOT 应 = 贪狼（甲子年）
29:| **身主** | 火星 |          ← rules SSOT 应 = 天同（火六局）
46:| ... 子女宫 ... 贪狼(陷) ...  ← rules SSOT 应 = 庙/旺（子位）

$ grep -nE "DIFF-04|DIFF-08|engine_unverified|本 SKILL|警告" J叔紫微斗数盘.md
(零命中)
```

**Severity**：HIGH。**J叔接 internal-ready 后第一件事就是人审 Golden Chart，必看的就是这个 vault 文件**。SKILL.md 在 12-Meta_J/ 拒认得再清楚，J叔到 vault 端做 Golden Chart 对照时拿的就是这份错数据 → vault DIFF-04 / DIFF-08 → 反陷阱被破，人审基线被污染源拖坏。

**修复方向（在 J叔人审 checklist 里硬列）**：
1. **vault 真盘文件顶部加 warning frontmatter**：
   ```yaml
   ---
   data_quality_warning:
     - "命主/身主 line 28-29：与 rules SSOT 不一致，详见 SKILL ziwei-doushu-engine DIFF-08"
     - "子女宫 贪狼亮度 line 46：与 rules SSOT 不一致，详见 DIFF-04"
   pending_human_audit: true
   ---
   ```
2. **或者**：vault owner 当场修正 3 处错数据 → 这才是治本（但属 vault 修订战役，不归本 SKILL）

**与 SKILL 上膛裁决的关联**：SKILL 本体 PASS；J叔人审基线污染是 vault-side 责任，但**必须在人审 checklist 里前置警告**，否则 J叔签字也是无效签字。

---

## 4. 上膛裁决

### 4.1 SKILL ziwei-doushu-engine 上膛裁决

**可签 `internal-ready` → 进 J叔人审**（条件如下）。

**已通过**：
- ✅ 6/6 修复 closure 真核（5 PASS + 1 PARTIAL，PARTIAL 不影响 SKILL 内容正确性）
- ✅ vault-root SSOT 三方 md5 实证一致（bazi-analyst 单条已守门）
- ✅ verified gate 真接入 bazi-analyst Rule 8 而非纸面声明
- ✅ brightnessRaw 真在 chart 输出（smoke 实证 6 主星全命中 7 级中文）
- ✅ vault DIFF 拒认段三处 (DIFF-04/DIFF-08/反陷阱) 真落地
- ✅ check-ssot-mirror 真守门（人工注入漂移 → exit 1 → 还原 → PASS 闭环）
- ✅ input validation throw 仍在 (algorithm.ts:136-148)

**前置条件（上膛前必须修）**：
- 🔧 **NF-1**：smoke-v2.ts:54 "42 detectors" → "34 detectors"（一行字，equipper 自查漏；不修则后续任何 smoke 跑出来与 SKILL 描述自相矛盾）

**条件移出（与本 SKILL 上膛不耦合，但必须开新战役）**：
- 🆕 **NF-2**：12 canonical agent 中 11 个 SSOT 守护裸奔 → 开 **round 7 治理层战役**，非 ziwei 战役（J叔自决是否串到这个 round 5/6 整改链）
- 🆕 **NF-3**：engine-registry 六态 vs bazi-analyst 五态对位漏 rejected / superseded → 可 SKILL 上膛后修（不影响 ziwei 上膛本身，因为 ziwei-doushu-niraidah 在 engine-registry 的 status 是被映射到 `mingli-mcp` 与 `ziwei-doushu-niraidah` 的 `allowed_engines` 路径上，不会走 rejected / superseded 路径）

### 4.2 不需要 round 7（针对本 SKILL）

- Round 7 不必要的理由：NF-1 是一行字；NF-2 / NF-3 / NF-4 不阻塞本 SKILL 上膛，是治理层独立战役。
- 当前 SKILL 内容、行为、守门 6 项关键修复都真闭环。equipper 无报告造假。

---

## 5. 给 J叔的最终人审 checklist（Golden Chart 人审专用）

**前提**：本 checklist 假定 NF-1 已修（smoke-v2.ts 改 42→34）。

### 5.1 准备工作（J叔人审开始前）

- [ ] **vault 真盘污染警告**（NF-4 必看）：打开 `/Users/jeffreyhu/Obsidian/UncleJ Dev/21-UncleJ-Departments/01-玄学部/04-我的盘/J叔紫微斗数盘.md`，**直接跳过 line 28-29（命主/身主）+ line 46（子女宫贪狼亮度）三处**，因为 SKILL ziwei-doushu-engine 已实证 vault 这三处与 rules SSOT 打架。**人审基线以 rules SSOT + iztro 引擎实测为准，不以 vault 这份为准**。
- [ ] 跑一次 smoke 拿基线：`cd /Users/jeffreyhu/DEV/ziwei-doushu && npx tsx scripts/smoke-v2.ts > /tmp/golden-baseline.txt`
- [ ] 确认 detector 数为 34（NF-1 修后）：`grep "格局识别" /tmp/golden-baseline.txt` 应输出 `(34 detectors / ...)`
- [ ] 确认 brightnessRaw 在 chart 内：smoke 输出每个主星后面括号是 7 级中文（庙旺得利平不陷），不是英文 bright/normal/dim

### 5.2 J叔签字必看 5 项

| # | 必看项 | 通过标准 | 不通过怎么办 |
|---|------|---------|------------|
| 1 | 命宫地支 | smoke 输出 = `卯` | 校对生辰 / 立场（用真太阳时与否） |
| 2 | 紫微星位置 | smoke 输出 = `午` | 同上 |
| 3 | 五行局 | smoke 输出 = `火六局` | 同上 |
| 4 | 当前大限 | smoke 输出 = `田宅(庚午)[现行大限] 36-45 岁` | 校对 currentAge |
| 5 | 14 主星完整性 | smoke 输出 = `14主星出现数: 14 / 14, 缺失: []` | FAIL → 立刻不签 |

### 5.3 流派对照（J叔人审决策必决）

vault DIFF-02 / DIFF-03 / DIFF-05（太阴 / 天同 / 巨门亮度反向）**不是 bug 而是流派差异**。J叔签字时必须**显式选**：
- (a) iztro 纯位置数据（本 SKILL 当前口径）
- (b) vault 日夜+格局修正口径
- (c) 双口径并列

选择写入 `engine-registry.yaml` decision_log，作为 `school_lock.ziwei` 的 sub-field 锁定。

### 5.4 签字流程

签字 PASS 后：
1. **engine-registry.yaml**：
   - `ziwei-doushu-niraidah` versions[0]: status = `verified`（或 `conditional` 加 conditions）
   - 填 `verified_by: J叔` / `verified_date: 2026-05-XX` / `audit_package_ref: <vault path>`
2. **bazi-analyst** verified 三级状态自动检索到 verified → 直接生产输出（不加 banner）
3. **决策日志**：写入 `engine-registry.yaml` 末尾 decision_log

### 5.5 不签字的硬触发条件

- 命宫地支 ≠ 卯 → 不签（立场/算法层错）
- 14 主星完整性 FAIL → 不签
- brightnessRaw 任意一颗不在 7 级枚举内 → 不签
- smoke 输出 "42 detectors"（NF-1 未修就来人审）→ 不签，打回

---

## 6. 评价标准自反思（Eval Critique）

### 6.1 本轮 6 条 closure 是否过弱？

- ✅ Closure 1（md5 三方）：现场跑 md5 = 真硬证据，无替代手段，强标准
- ✅ Closure 2（verified gate）：grep + 段位 + 内容核对，能区分纸面声明 vs 真接入
- ⚠️ Closure 3（42 → 34）：标准只查了 SKILL.md / patterns.ts，**没有横向扫描 repo 全部 ref** → 漏 smoke-v2.ts 一行 → **本审核标准本应加 "全 repo grep 42" 而不是只盯 patterns.ts**。**修订**：未来 detector 数 / magic number 类修复，标准 = `grep -rn "<旧值>" . --include="*.ts" --include="*.md" | grep -v node_modules`
- ✅ Closure 4（brightnessRaw）：现场跑 smoke 拿实际输出 = 强标准
- ✅ Closure 5（vault DIFF 拒认）：grep 段位内容 = 强标准
- ⚠️ Closure 6（SSOT hook）：现场注入漂移测试 = 真守门验证（强），**但未质疑守护范围**（弱）→ 标准只验"是否能抓"，没验"抓的范围对不对" → 直到挖到 NF-2 才暴露。**修订**：守门类修复，标准必须包含 "保护对象列表是否完备"（不只是"机制是否生效"）

### 6.2 是否有重要发现没有 assertion 覆盖？

- **NF-4 (vault 真盘污染源)** 不在 6 条修复 closure 任何一条 — 是 prism 主动挖掘出来的（SKILL.md 拒认完整 ≠ 数据源头修正完整）。**修订**：今后凡 SKILL 形式的"拒认下游错"，必须配套审"上游/源头错数据有没有警告或修正"

### 6.3 弱 assertion 风险

- Closure 2 verified gate：本审核只要求"段位存在 + 内容含 status 枚举"。如果未来 equipper 偷工，把 verified gate 写得很漂亮但**实际引擎调用路径根本不读 engine-registry**，本标准看不出来。**修订**：未来 verified gate 类修复，标准必须加 "现场跑一次：手工把 engine-registry status 改成 rejected → 跑 bazi-analyst → 看是否真触发 BLOCKED 路径"。
- **本审核未做这个测试**，因为 bazi-analyst 是 prompt 而非可执行代码，没有 mechanic test path。这是 verified gate 类机制的根本性弱点 → **应记入 evolution 反思：prompt-only governance 无法用代码测试验证，靠 prompt 自洽这条 chain 本身就脆弱**。

---

## 7. Evolution Writeback

### 7.1 给 meta-prism 自身记忆

- **新 assertion 模式：magic number 全 repo 扫描**：每次修 detector 数 / 版本号 / 常量类 magic number，必须 `grep -rn` 全 repo 而非只盯 source-of-truth 一处。本轮 NF-1 暴露此盲区。
- **新 assertion 模式：守门机制保护范围审计**：每次新增 hook / gate / validator，必须独立列出"应保护对象全集"vs"当前保护对象列表"，差集即 NF。本轮 NF-2 暴露此盲区。
- **新 assertion 模式：拒认 ≠ 修复**：SKILL 形式的拒认下游错只是中游止血，必须配套审"上游错数据本身是否有警告或修正"。本轮 NF-4 暴露此盲区。
- **新 assertion 模式：枚举对位完整性**：跨文件枚举集（status 枚举 / 类型枚举 / 状态机）必须做完整对位表，列出双方哪些覆盖哪些缺位。本轮 NF-3 暴露此盲区。

### 7.2 给整个治理层的呼吁

NF-2（12 agent 中 11 个 SSOT 守护裸奔）是治理结构性问题：
- check-ssot-mirror.mjs 立项时锁定为"NEW-3 修 bazi-analyst 一个"，但暴露了 vault-root projection 漂移这个**通用问题**
- 应触发独立战役：把所有 canonical agent 纳入守护或显式声明不投影策略
- 是 meta-warden / meta-conductor 的事，不是 ziwei 战役的事

---

## 终审总结

**6 条修复 closure 真核：5 PASS + 1 PARTIAL（NEW-2 漏修 smoke-v2.ts 死字符串）**

**Round 6 新发现：4 条（NF-1 MED / NF-2 HIGH / NF-3 MED / NF-4 HIGH）**

**Verdict：PASS-WITH-CONDITIONS**

**上膛裁决**：
- ✅ SKILL ziwei-doushu-engine 可标 `internal-ready`
- 🔧 上膛前必修：NF-1（smoke-v2.ts 一行字）
- ✅ J叔人审 Golden Chart 启动 — 按本报告 § 5 checklist 走
- 🆕 Round 7 立项：NF-2（12 agent SSOT 守护扩张）— 独立战役
- 🆕 NF-3 / NF-4 列入 J叔决策清单 — 不阻塞本 SKILL，但需 J叔知情

**禁止背书 equipper 自报 — 全部 closure 已独立 grep/md5/run/smoke 验证。**
