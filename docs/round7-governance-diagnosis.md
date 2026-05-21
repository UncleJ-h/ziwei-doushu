# Round 7 治理线诊断报告 — NF-2 / NF-3 / NF-4

**审核员**：meta-prism（独立 forensic diagnosis，不采信 Round 6 任何自报数字）
**审核日期**：2026-05-21
**方法学**：filesystem ls + md5 cross-mirror diff + targeted grep + Read
**Round 6 关联**：本报告对 Round 6 NF-2 / NF-3 / NF-4 三条做独立复核 + 精细化定位

---

## 0. Executive Findings

| 维度 | Round 6 自报 | 本轮独立实证 | 校准 |
|------|-------------|------------|------|
| 12 canonical agents 中 SSOT hook 守护覆盖度 | 1/12（仅 bazi-analyst） | **1/12**（确认） | 一致 |
| 12 agent 中实际漂移到 global mirror 的数量 | "11 个裸奔"（守护 vs 实际漂移混说） | **6 个真漂移**, 5 个意外巧合一致, 1 个被守 | Round 6 措辞不精确 |
| NF-3 status 枚举对位漏几条 | "rejected / superseded 漏对位" | **确认漏 2 条**（rejected + superseded） | 一致 |
| NF-4 vault 真盘 bug 处数 | 3 处（line 28-29 命主/身主 + line 46 贪狼亮度） | **3 处**（line 28 文曲 / line 29 火星 / line 46 贪狼陷）+ **0 处警告** | 一致，污染面 286 行全裸 |

**关键洞察**：Round 6 NF-2 用"11 个裸奔"是从"守护范围"角度说，本轮发现"11 个裸奔中实际已漂移的有 6 个" — 既证明守护必须扩张（11/12 没人看），又证明这种裸奔确实会变成真漂移（55% 命中率）。两个数字都对，但治理叙事必须精确：**守护缺口 = 11，真漂移 = 6**。

---

## 1. Task 1 — 12 canonical agents 漂移诊断表

### 1.1 对照表（独立 md5 实测，2026-05-21 16:38 CST）

| # | Agent | canonical | global (~/.claude) | vault (.claude) | 12-Meta_J/.claude | 漂移判定 |
|---|-------|-----------|-------------------|----------------|------------------|----------|
| 1 | **bazi-analyst** | `95a3cf03…` | `95a3cf03…` | `95a3cf03…` | `95a3cf03…` | PASS 全 4-way 一致（唯一被 SSOT hook 守护的） |
| 2 | external-repo-equipper | `78b0ca19…` | `78b0ca19…` | MISSING | `78b0ca19…` | PASS 3-way 一致（vault 未投影） |
| 3 | **j-campaign-writer** | `a019ea34…` | `05485c2b…` | MISSING | `a019ea34…` | FAIL canonical != global（102 diff lines） |
| 4 | meta-artisan | `3cf33ad8…` | `3cf33ad8…` | MISSING | `3cf33ad8…` | PASS 3-way 一致 |
| 5 | **meta-conductor** | `82096456…` | `beeeb3cc…` | MISSING | `82096456…` | FAIL canonical != global（27 diff lines） |
| 6 | **meta-genesis** | `2f98831a…` | `c78ce5fb…` | MISSING | `2f98831a…` | FAIL canonical != global（46 diff lines） |
| 7 | meta-librarian | `67f5e766…` | `67f5e766…` | MISSING | `67f5e766…` | PASS 3-way 一致 |
| 8 | meta-prism | `8057d7b8…` | `8057d7b8…` | MISSING | `8057d7b8…` | PASS 3-way 一致 |
| 9 | meta-scout | `d499bb5c…` | `d499bb5c…` | MISSING | `d499bb5c…` | PASS 3-way 一致 |
| 10 | **meta-sentinel** | `9fedde84…` | `040d61aa…` | MISSING | `9fedde84…` | FAIL canonical != global（29 diff lines） |
| 11 | **meta-warden** | `67de51bb…` | `7512d60a…` | MISSING | `67de51bb…` | FAIL canonical != global（14 diff lines） |
| 12 | **xuanxue-chart-validator** | `e41a3615…` | `f7f647c2…` | MISSING | `e41a3615…` | FAIL canonical != global（2 diff lines） |

### 1.2 漂移分布

**真漂移（canonical != global）**：6 个 — j-campaign-writer / meta-conductor / meta-genesis / meta-sentinel / meta-warden / xuanxue-chart-validator
**意外一致（未守护但仍 byte-identical）**：5 个 — external-repo-equipper / meta-artisan / meta-librarian / meta-prism / meta-scout
**已守护**：1 个 — bazi-analyst（check-ssot-mirror.mjs 唯一保护对象）

### 1.3 漂移性质抽样

**meta-warden（14 diff lines）— 真治理漂移，HIGH 严重度**

| 类型 | canonical | global | 含义 |
|------|-----------|--------|------|
| 命令名 | `npm run meta:validate:run` | `npm run validate:run` | npm script rename 未跟进 |
| 路径 | `.meta-kim/state/{profile}/capability-index/global-capabilities.json` | `.claude/capability-index/global-capabilities.json` | SSOT 路径迁移未跟进 |
| 路径 | `npm run meta:sync:global` | `npm run sync:global:meta-theory` | 命令重命名未跟进 |
| 维护方式 | `canonical/agents/{agent}.md` / `canonical/skills/` | 旧 memory 子目录 | evolution writeback 模式已变 |

global mirror 落后于 canonical 至少 1-2 个 Meta_Kim 升级 batch（推断 v2.0.16~v2.0.28 之间未跑过 `meta:sync:global`）。

**xuanxue-chart-validator（2 diff lines）— 轻微漂移，LOW 严重度**
唯一一处实质 diff：M-5 修订（2026-05-21 当天）在 canonical 加了"原稿…破了 Decision Rule 3"的注释段，global 还停在不带注释的旧版。说明本日同步还没跑过。

**j-campaign-writer（102 diff lines）— 重漂移，HIGH 严重度**
diff_lines 占文件总长 ~10%。需进一步抽样确认漂移性质（推断是某次大重构的产物）。

### 1.4 治理含义

1. **守护范围 = 1/12 是结构性 bug**：即使今天 5 个意外一致，明天任何一次 canonical 改动就会变成新的漂移
2. **6/11 漂移命中率 ~55%**：实证证明"裸奔会漂移"不是抽象风险
3. **vault `.claude/agents/` 不投影 meta 治理 agent**：只 bazi-analyst.md（业务 agent）有 vault 端 mirror。这是设计还是疏漏需要 J叔决策（推测：vault 是业务 agent 库，治理 agent 不放 vault 是有意为之）

---

## 2. Task 2 — check-ssot-mirror.mjs 现状与扩展方案

### 2.1 当前实现解读（129 行 mjs，2026-05-21 实测）

| 维度 | 现状 |
|------|------|
| 守护方式 | **硬编码 MIRRORS 数组**（lines 29-38），只列 bazi-analyst.md 一条 |
| --fix 模式 | 已实现（lines 86-89，--fix 时用 canonical 覆盖 mirror） |
| 接入位置 | `npm run meta:check:runtimes` 末尾（package.json 中已确认 — Round 6 实证） |
| md5 算法 | Node 原生 `node:crypto` createHash('md5') |
| missing 处理 | 区分 `missing` vs `drift` 两种 reason |
| 维护门槛 | 注释 line 16 明确说"要监管新 agent 时，把它加进下方 MIRRORS 数组即可"— **手动维护**，没有 glob 或自动发现 |
| vault 端守护 | MIRRORS[0].mirrors 包含 `VAULT_ROOT/.claude/agents/...`（vault-root 漂移正是 Round 3/4 暴露的 bug） |

### 2.2 扩展到守 12 个 agent 的最小改动方案

**Option A — 静态扩展（最小变更，门禁清晰）**

伪代码：当前 MIRRORS 数组从 1 条扩到 12 条，每条形如 `{ id, canonical, mirrors: [global path, (仅 bazi 加) vault path] }`。新增 11 个对象，每个 ~6 行 → **~70 行新增**。

**Option B — 半自动 glob（中等复杂度）**

伪代码：读 canonical/agents/*.md 全集，自动构造 MIRRORS。vault 投影白名单单独维护（只 bazi-analyst 进 vault）。**glob + filter + map，~30 行新增；同时支持新 agent 自动纳入守护**。

**Option C — 配置驱动（最低维护成本，最高初始改造量）**

伪代码：新增 config/ssot-mirror-policy.json 显式映射 agent -> mirror-targets，check-ssot-mirror.mjs 改为读取该 JSON。

### 2.3 推荐：Option B（半自动 glob）

**理由**：
1. canonical/agents/*.md 是 single source — 现有 12 个或未来 N 个，自动覆盖
2. vault 投影规则（"业务 agent 才进 vault"）是低频例外，写成 explicit allowList = 5-10 行就够
3. PRIN-02（Single Source）友好：避免 Option A 的"新 agent 时记得改两处"陷阱
4. 比 Option C 节省一次"再造一个 JSON SSOT"的工程量

**风险**：glob 没法守 vault 端"业务 agent 才投影"的细粒度规则，要在 mjs 里维护一个小白名单。

---

## 3. Task 3 — NF-3 engine-registry 六态 vs bazi-analyst 三级状态对位漏洞

### 3.1 双方枚举集（独立 grep 实测）

**engine-registry.yaml 状态枚举（line 11-15 注释 + lines 45/68/88/112/129/146 实际使用）**：

| # | status 值 | 注释含义 |
|---|----------|---------|
| 1 | `pending_validation` | 已登记，未跑 fixture |
| 2 | `audit_pending` | fixture 已跑，人审包已出，等 J叔签字 |
| 3 | `verified` | J叔签字 PASS，可进生产链路 |
| 4 | `conditional` | J叔签字 PASS 但有限定条件 |
| 5 | `rejected` | J叔签字 FAIL 或本 Agent 检出 SUSPECTED_BUG |
| 6 | `superseded` | 被新版本替代，旧版本归档 |

**总计：6 态**

**bazi-analyst.md "verified 三级状态"（lines 121-125）**：

| # | 状态 bucket | 含义 | 处理 |
|---|-------------|------|------|
| 1 | `verified` | engine-registry status=verified + verified_by=J叔 已填 | 直接生产输出，无 banner |
| 2 | `audit_pending` / `pending_validation` / `conditional`（三态合并为"未签字"一桶） | engine-registry status 不是 verified | frontmatter 加 engine_unverified:true + 顶部 banner |
| 3 | `engine_unverified` | 引擎不在 `allowed_engines` 清单 | 仅供调试，frontmatter + debug_only:true |

**总计：3 个 bucket（覆盖 4 个 engine-registry 状态：verified / audit_pending / pending_validation / conditional）**

### 3.2 对位漏洞清单

| engine-registry status | bazi-analyst 三级状态命中 | 漏洞 |
|------------------------|--------------------------|------|
| `verified` | bucket 1 | 完整对位 |
| `audit_pending` | bucket 2 | 完整对位 |
| `pending_validation` | bucket 2 | 完整对位 |
| `conditional` | bucket 2 | 完整对位 |
| **`rejected`** | **未对位** | **NF-3-1 (HIGH)**：J叔签字 FAIL 或检出 SUSPECTED_BUG 的引擎，bazi-analyst 当前会落入哪个 bucket？逻辑上应当**完全拒绝调用**，但 Rule 8 没有此分支 |
| **`superseded`** | **未对位** | **NF-3-2 (MEDIUM)**：旧版本归档的引擎，bazi-analyst 没有"自动 fallback 到新版"或"拒绝调用旧版"的处理 |

### 3.3 漏洞影响推演

**rejected**：如果 J叔在 decision_log 把某引擎签字 FAIL（如 mingli-mcp 后续发现 ziwei 起例 bug），engine-registry status 改为 rejected。bazi-analyst Rule 8 没读"rejected"分支：
- (a) 如果该引擎仍在 `allowed_engines`：会走 bucket 2 路径（加 banner 调用），但 banner 文案是"未签字"而非"已被签字 FAIL"，**严重误导 J叔** — 后者风险等级远高于前者
- (b) 如果该引擎被从 `allowed_engines` 移除：会走 bucket 3 路径（仅供调试）— 这是治理上正确的，但依赖 J叔同步去改 production_eligibility 段

**superseded**：旧版本归档后，bazi-analyst 若仍持有旧引擎 id 调用，没有 fallback 机制 → 旧版 fixture 与新版生产不一致时无告警

### 3.4 建议补丁方向（不替 equipper 写代码，仅给路径）

bazi-analyst Rule 8 增加 2 个 bucket：

| 新增 bucket | 触发 | 处理 |
|------------|------|------|
| `rejected` | engine-registry status=rejected | **硬拒调用** + 输出文件 frontmatter 标 engine_rejected:true + banner 文案"引擎已被 J叔签字 FAIL 或检出严重 bug，本输出仅供溯源调试" |
| `superseded` | engine-registry status=superseded | **建议自动 fallback 到 latest 同 engine_id 的非 superseded 版本**；若无 fallback 可选则降级为 engine_unverified 处理 |

NF-3 严重度：**HIGH for rejected, MEDIUM for superseded**。Round 6 标 MEDIUM 偏低，理由：rejected 路径未对位时是"用已知错的引擎还以为只是没签字"，比"未签字"严重一档。

---

## 4. Task 4 — NF-4 vault J叔紫微斗数盘.md 真盘 bug 现状

### 4.1 三处错数据实证（独立 grep + Read）

| 位置 | 字段 | vault 实际写 | SKILL ziwei-doushu-engine 校验结果 | DIFF 编号 |
|------|------|-------------|-------------------------------|----------|
| **line 28** | `命主` 表格行 | `文曲` | 规则表查询键应为 `贪狼`（基于命宫地支 卯 + 紫微斗数命主表） | **DIFF-08** |
| **line 29** | `身主` 表格行 | `火星` | 规则表查询键应为 `天同`（基于身宫地支 亥 + 紫微斗数身主表） | **DIFF-08** |
| **line 46** | `子女宫` 贪狼亮度 | `贪狼(陷)` | iztro 引擎实测 + 规则表 = `庙` 或 `旺`（子位贪狼应庙旺，非陷） | **DIFF-04** |

**注**：任务规格初稿描述"第 9-10 行（命主/身主）"，实测后 frontmatter 9-10 行是 `命宫主星: 太阳+天梁` / `身宫位置: 财帛宫`（不是命主/身主）。命主/身主在表格 line 28-29。已校正为实际行号。

### 4.2 vault 端警告/标记现状

`grep -nE "DIFF-04|DIFF-08|DIFF-02|DIFF-03|DIFF-05|engine_unverified|警告" J叔紫微斗数盘.md` → **0 命中**

vault 文件 286 行，**完整 raw，无任何引擎拒认 / DIFF 标注 / 警告 banner / engine_unverified frontmatter**。

### 4.3 污染推演

**J叔人审 Golden Chart 流程**（推测）：
1. 装备 SKILL ziwei-doushu-engine 通过 internal-ready 后，J叔到 vault 端做 Golden Chart 对照
2. 拿出 21-玄学部/04-我的盘/J叔紫微斗数盘.md 作为人审基线
3. 对照 SKILL 引擎输出 vs vault 基线，如有差异 J叔判定
4. 但 vault 基线本身在 line 28-29 / line 46 三处已与 rules SSOT 打架

**污染后果**：
- (a) J叔若把 vault 当对的：会判 SKILL "贪狼(庙)"是错的（其实 SKILL 才对）→ 误打回 SKILL，浪费整轮装备工程
- (b) J叔若知道 vault 错但记错哪几行：可能误判其他正确条目为错（信号噪声混乱）
- (c) J叔若每次都现场记忆"line 28/29/46 跳过"：人脑负担大，未来某次必忘 → 黑天鹅事故

SKILL 在 12-Meta_J 端漂亮地 DIFF-04/08 拒认 != J叔在 vault 端拿到正确基线。**这是中游止血，未到源头修正。**

### 4.4 修订路径三选（独立分析，不替 J叔做选择）

| 路径 | 操作 | 优点 | 缺点 | 推荐场景 |
|------|------|------|------|---------|
| **(a) 直接改 vault** | 把 line 28/29/46 三处错数据按 rules SSOT 重写 | 一劳永逸；J叔后续人审 zero cognitive cost | **不可逆破坏 J叔历史人审痕迹**；若 J叔实际签字立场是流派差异（不是 bug），改了等于擅自选边 | 仅当 J叔已显式说"我承认 vault 这三处确实是 bug 不是流派差异"时 |
| **(b) vault 加 warning 段** | 在 vault 文件头部加 banner + line 28/29/46 加 inline `<!-- DIFF-04: 与 rules SSOT 打架，详见 SKILL ziwei-doushu-engine -->` | 保留 J叔历史立场；同时给 J叔人审看到污染点；可逆 | 视觉污染 vault；J叔每次打开都看到 warning | **首推**：保留 J叔决策权 + 显式标污染源 + 人审时看得见 |
| **(c) SKILL 端拒认 + 引导** | 不改 vault，SKILL 输出顶部加"人审时请跳过 vault line 28/29/46，理由：DIFF-04/DIFF-08" | vault 完全无 trace；可逆 | 依赖 J叔每次记得读 SKILL 输出的提示段；脱钩风险高（若 J叔 vault 直接打开不走 SKILL，看不到提示） | 仅当 J叔说"vault 不能动一个字符" |

### 4.5 我的推荐：(b) 路径

**理由**：
1. **不替 J叔选边**：J叔过去填的"文曲/火星/贪狼(陷)"是有历史的（可能来源于早期 MCP 排盘 / 老一本紫微书的不同流派），直接改 = 治理替业务下场
2. **显式 > 隐式**：vault inline 警告 + 头部 banner，J叔每次打开都看见，认知一致性最强
3. **可逆**：J叔后来签字"vault 这三处是对的 SKILL 错的"，删警告即可恢复
4. **PRIN-07（Explicitness）合规**：把"污染点是哪 3 行 + 为什么 + 引向哪里查"全部 inline 显式声明

**反过来支持 (c) 的弱信号**：vault 是 J叔的"贴身笔记"，加技术警告会破坏阅读流。但本文件是命盘文件不是日记，技术警告反而是正确分类。

**反过来反对 (a) 的硬信号**：Round 6 NF-4 已经标了 vault DIFF-02/03/05（太阴/天同/巨门亮度反向）是"流派差异不是 bug"。如果 (a) 路径一刀切，连流派差异的 DIFF-02/03/05 也会被误改。

---

## 5. Stage 4 Execution 派发建议

### 5.1 任务并行/串行依赖矩阵

| 任务 | 负责 agent 类型 | 依赖前置 | 可并行组 |
|------|----------------|---------|---------|
| **T1** check-ssot-mirror.mjs 扩展到 12 agent（Option B glob） | 工程类 sub-agent（如 backend-architect / external-repo-equipper） | 无 | 组 A |
| **T2** 跑 `--fix` 把 6 个真漂移 agent 拉回 canonical 一致 | 同 T1 | T1 完成 | 组 A（串行） |
| **T3** bazi-analyst Rule 8 增加 rejected / superseded 两个 bucket | bazi-analyst 自己 owner / meta-genesis | 无 | 组 B |
| **T4** vault J叔紫微斗数盘.md 加 (b) 路径 warning 段 | obsidian-agent / 命理类 owner | **必须先得 J叔人审确认走 (b) 路径** | 组 C（人审 gate 后） |
| **T5** Round 7 closure 报告（验证 T1-T4 全闭环 + 写 evolution writeback） | meta-prism + meta-warden | T1-T4 全完成 | 组 D（串行） |

### 5.2 推荐派发顺序

```
Stage 4 Execution
+-- Wave 1（并行）
|   +-- T1 + T2 派 backend-architect 类 sub-agent — 治理工程线（守护扩张）
|   +-- T3 派 meta-genesis 修 bazi-analyst Rule 8 — 治理规则线（状态对位补齐）
|
+-- Wave 2（人审 gate）
|   +-- J叔决策 NF-4 走 (a)/(b)/(c) → 锁定后才派 T4
|
+-- Wave 3
    +-- T4 obsidian-agent / vault-writer 类执行 NF-4 修订

Stage 5 Review
+-- T5 meta-prism 独立复审 + meta-warden 综合
```

### 5.3 并行风险点

- **T1 与 T3 文件不重叠**（T1 改 scripts/check-ssot-mirror.mjs，T3 改 canonical/agents/bazi-analyst.md），可放心并行
- **T2 跑 --fix 后会同步覆盖 global mirror**：如果 T3 同时在改 canonical/agents/bazi-analyst.md，T2 必须在 T3 之后跑（实际**无冲突**，因为 T2 同步的是改完后的 canonical 状态 = 期望行为）
- **T4 唯一硬依赖人审**：不能"我猜 J叔会选 (b) 就先派"，模式 G（替别人下决策）红线

### 5.4 给 meta-warden / meta-conductor 的建议

- **派 T1+T2 的 sub-agent 时必须授权**：`若 glob 方案有更好的工程改动模式，直接采纳，本预判可推翻`（RED-01）
- **T3 派 meta-genesis 时**：必须明示"rejected/superseded 是新增 bucket，不是改三级原文" — 防止 over-engineering 把整段重写
- **T4 锁人审 gate 前**：把本报告 Task 4 的三选表打印给 J叔，附本报告的推荐 (b) + 理由，J叔可选 (a)/(b)/(c) 任一
- **T5 二次审核必跑**（RED-02）：T1-T4 完成后必须重新派独立 meta-prism 复审，**不允许 T1-T4 执行者自证已修复**

---

## 6. 评估自审（Eval Critique）

| 自我检查 | 结果 |
|---------|------|
| 12 agent 真漂移数有没有可能漏算？ | 用 `for a in <12 个>; do md5; done` 全枚举，无遗漏 |
| 这次 PASS 的 5 个意外一致 agent 会不会其实有 LF/CRLF 微差？ | md5 byte-level，LF/CRLF 差异会改 md5。当前 md5 完全一致 = byte-level 一致 |
| NF-3 漏洞是否还有第 3 条没发现？ | engine-registry 注释明确 6 态，bazi-analyst 三级覆盖 4 态，差集精确 = {rejected, superseded}，无漏 |
| NF-4 vault 是不是其实还有 line 28/29/46 之外的污染？ | 本轮没逐行审 286 行，只 grep 关键字。**这是本次审核的漏洞** — 建议 T5 复审时全文件审 |
| 推荐 (b) 路径会不会其实 (c) 更好？ | (b)/(c) 取舍核心是"J叔默认从哪入口"。若 J叔 vault 直接打开 -> (b)；若 J叔每次都从 SKILL 起手 -> (c)。**未独立确认 J叔工作流默认入口** — 推荐 T4 派发前先问 J叔 |

### 弱断言自评

- **断言"6/11 漂移命中率 ~55%"**：样本太小（n=11），统计意义弱。仅描述当前状态，不能外推。
- **断言"vault 端只投影 bazi-analyst 是设计"**：纯推测，未读取设计文档原始陈述。**应升级为"未确认是设计还是疏漏，建议 J叔确认"**。

---

## 7. Closure Packet

| 字段 | 值 |
|------|---|
| `reviewState` | rated |
| `verificationState` | open（待 T1-T4 完成后转 closable） |
| `criteriaState` | stable（本轮新 assertion 模式与 Round 6 一致：枚举对位 / 守门范围 / 拒认 != 修复） |
| `fixEvidence` | 空（Prism 只诊断，不实施。修复证据由 T1-T4 执行 agent 提供） |
| `closeFindings` | 待 T5 复审填 |

## 8. Anti-AI-Slop 自检

- SLOP-06（Replaceability）：本报告替换 "12 canonical agents" 为"任意 12 个 md 文件"则 Task 1 对照表不再适用 — **PASS**
- SLOP-07（Fabricated data）：所有 md5 / 行号 / diff 数字均现场实测，附 grep 命令路径 — **PASS**
- SLOP-08（Missing reasoning）：每个 NF 的影响推演 + 修订路径权衡均写出 — **PASS**
- SLOP-09（Concrete tasks vs domain abstraction）：本报告是诊断任务而非 agent 设计，N/A

---

**报告完成时间**：2026-05-21 16:42 CST
**审核范围**：12 canonical agents / check-ssot-mirror.mjs 129 行 / engine-registry.yaml 192 行 / bazi-analyst.md 部分段 / vault chart 286 行 sample
**未审核范围**：vault chart 286 行全文（仅 grep 关键字）/ j-campaign-writer 102 diff 行的具体性质 / global mirror 其他 5 个"意外一致"agent 是否有 LF 差异之外的 hidden 漂移
