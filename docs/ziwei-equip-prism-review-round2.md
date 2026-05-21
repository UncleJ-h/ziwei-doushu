---
title: ziwei-doushu 装备战役 — Prism 二次审核报告
auditor: meta-prism
audit_date: 2026-05-21
audit_round: 2
audit_scope: external-repo-equipper 自报 13/13 closed 的整改包独立验证
first_pass_report: docs/ziwei-equip-prism-review.md
verdict: PASS-WITH-CONDITIONS
verdict_reason: 13 finding 中 11 真闭环 + 2 partial；整改副作用引入 8 条新问题（2 HIGH/6 MEDIUM）；上膛可行但需补 3 条停车线
---

# Prism Round-2 Review — ziwei-doushu Equipment Campaign

> 重审完。**不背书 closed 但接受方向**。13 finding 真闭环 11 条 (84.6%) + 2 partial；整改自身引入 8 条新问题（**2 HIGH + 6 MEDIUM**）。
>
> 一句话：**整改的"心"对，"手"差最后一公里**。可以上膛但 J叔必须先签 3 条停车线，否则 SKILL 跑第一行就会绊倒。

---

## 0. Top-Line Verdict 与状态

| 层级 | reviewState | verificationState | criteriaState |
|------|-------------|-------------------|---------------|
| Round 2 | rated       | closable (条件性)   | stable        |

- **Verdict**：**PASS-WITH-CONDITIONS**
- **闭环统计**：13/13 finding 自报 closed → Prism 独立核验 = **11 closed + 2 partial + 0 still-open**
- **新发现**：**N-1 HIGH** (bazi-analyst SSOT 缺失 + 双副本漂移) + **IG-1 HIGH** (SKILL 路径 A 未跑通) + 6 MEDIUM
- **上膛条件**：
  1. SKILL.md 路径 A 的 `npx tsx -e` 代码必须先跑通一次（`cd ~/DEV/ziwei-doushu && npm install && npx tsx -e ...`），截图存档 → 否则等同 C-2 复活
  2. bazi-analyst.md 必须**有一个明确 SSOT**（推荐：移到 `12-Meta_J/canonical/agents/`，让 vault-root + 全局都成投影） → 否则 N-1 持续放血
  3. engine-registry `production_eligibility.ziwei.allowed_engines` 包含的 `ziwei-doushu-niraidah` **必须先过一轮 fixture 走查**才能进 allowed → 否则就是 H-2 的"准入表给未审准入"

---

## 1. Part 1 — 13 Finding 逐条独立验证

> 我**没有**采信 MEMORY/equipper 的"closed"自报，每条都用 grep/ls/diff 独立验证。

| # | severity | equipper 自报 | Prism 独立判定 | 证据 (file:line) |
|---|----------|--------------|---------------|------------------|
| C-1 | CRITICAL | closed | **closed** | `ls /Users/jeffreyhu/.claude/agents/ziwei-analyst.md` → No such file；`ls /Users/jeffreyhu/.codex/agents/ziwei-analyst.toml` → No such file；grep "ziwei-analyst" 全 5 端只剩 2 处合规历史引用（`external-repo-equipper.md:465-483` = 历史 pipeline 注释；`xuanxue-chart-validator.md:12,57,456` = "未来若 J叔决定独立出紫微元" 前瞻表述，非孤儿调用）。删除彻底。 |
| C-2 | CRITICAL | closed | **partial** | ziwei-analyst.md 已删 = Few-Shot 移出 agent；但 fabricated 代码风险**搬家了**：现在`ziwei-doushu-engine/SKILL.md:36-48` 给的 `npx tsx -e "..."` 是改良版（用 `generateChart` 而非 `calculateZiweiChart`，schema 与 lib 真实导出 `{year, month, day, hour, ...}` 一致），但 **`ls /Users/jeffreyhu/DEV/ziwei-doushu/docs/ziwei-fewshot-smoke.txt` → No such file** + **`ls /Users/jeffreyhu/DEV/ziwei-doushu/node_modules/iztro` → No such file**。第一次 review 明确要求"修完必须实际跑一次，把 stdout 截到 ziwei-fewshot-smoke.txt"，**没跑**。schema 正确性是纸面推导，未实证。 |
| C-3 | CRITICAL | closed | **closed** | `known-charts.yaml:13` chart1 `pending_user_confirmation: true` + 注释"还原回 true（prism C-3 修订 2026-05-21）"；`:252` chart3 同样 true + 同样注释；`:14-19` + `:253-257` 加了 `audit_metadata` 段含 fixture_signed_by/date/evidence 三字段 + null + TODO 注释"J叔签字证据待补"。MEMORY xuanxue-strengthening 挂账可对照。 |
| H-1 | HIGH | closed | **closed** | ziwei-analyst.md 删除 → trigger 冲突源消失；bazi-analyst.md description 仍 OWN "紫微斗数"（`:3`），但因无独立 ziwei-analyst → 无非确定性 dispatch。Decision Rule 8 (`:100`) 给了明确 backend 切换路径（默认 mingli-mcp / 倪师模式走 ziwei-doushu-engine SKILL），口径清晰。 |
| H-2 | HIGH | closed | **partial** | engine-registry.yaml `:171-186` 已从空 `[]` 改为实际在用清单（bazi: `[bazi-mcp, mingli-mcp, lunar-mcp]` / qimen: `[kinqimen]` / ziwei: `[mingli-mcp, ziwei-doushu-niraidah]`）+ 注释解释"prism H-2 修订"。bazi-analyst Decision Rule 8 加了准入门禁条款。**但**：(a) **没有 PreToolUse hook** 物理拦截，规则仍是"agent 自查"（PRIN-03 layering 仍偏弱）；(b) **新问题 N-2 见下**：`allowed_engines` 内的引擎自身都还是 `status: pending_validation`（grep `verified_by` 全 null），等于"未经验证准入"，与 validator Constraint C-1 表面合规、本质打架。 |
| H-3 | HIGH | closed | **closed** | ziwei-analyst.md 删除 → Card 3 paper feature 不存在；新 SKILL `ziwei-doushu-engine/SKILL.md:14, 99` 显式标注"不含飞星派宫干自化/大限四化/来因宫"，把限制写在 SKILL 头部"明确不含"段，反向消除了 paper feature 风险。 |
| H-4 | HIGH | closed | **closed** | ziwei-analyst.md 删除 → 插件假象传染源消失。**Caveat**：vault-root `bazi-analyst.md:289-322` 反而**新增了一段 "Extended Capabilities (via yuan plugin)"** 描述了双层结构，但全局副本 (~/.claude/agents/) **没有这段** → 见 N-1，是 H-4 治标但治本失败的痕迹。 |
| H-5 | HIGH | closed | **closed (审计存在) / partial (§1 假阴性)** | `docs/supply-chain-audit.md` 77 行存在，6 项检测齐 + 评估表 + 接受风险段。**但 §1 grep 命中自己**（"`./docs/supply-chain-audit.md:5:### 1. 管道执行检测 (curl\|sh / wget\|sh)`" — 这是审计文件自身的标题被自己 grep 到了），audit 体里写"无（grep 命中 = 本审计文件自己）"算自查到了。MEMORY ziwei-doushu-equip-2026-05-21.md:32-43 落档 OK。**轻微问题**：§3 husky 风险标 "黄"但表内最终 "无 / vendor 隔离" 处置；上游审计未跨 5 个 vendor .ts 单独跑 npm audit（这部分仅 vendor 文件级别看了下，没跑依赖图）。 |
| M-1 | MEDIUM | closed | **partial** | gap-analysis `:54, :59, :139` 已改写为 "spyfree（iztro-py 维护者，同时也是 mingli-mcp 作者）"（修订标注 `M-1 修订 2026-05-21`），单点风险升级为"端到端单点"。`docs/supply-chain-audit.md:63-71` 同步升级。**但**：`:167` (H1 条目) 还在写 "iztro / iztro-py 单 maintainer (SylarLong)" — 旧错误归因未交叉更新。M-1 改了一半。 |
| M-2 | MEDIUM | closed | **closed** | gap-analysis `:234` `[unverified]` 已升级为 `[verified by meta-prism 2026-05-21, path: /Users/jeffreyhu/.local/share/uv/tools/mingli-mcp/lib/python3.11/site-packages/iztro_py-0.3.4.dist-info]`，路径与 prism first-pass 实测路径完全一致 (Round 1 已自核)。 |
| M-3 | MEDIUM | closed | **closed** | ziwei-analyst.md 删除 → draft generic trigger 误调风险消失。SKILL.md 触发词均为限定语义（"紫微排盘"/"十二宫"/"四化"等），不冲突。 |
| M-4 | MEDIUM | closed | **closed** | gap-analysis `:169` H3 加了 "**与 B3 互锁**：若执行 B3（不下载数据集，仅做远程评测 fixture 引用），H3 不需审；若未来要下载，必须先 Sentinel 审 + J叔授权。M-4 修订 2026-05-21"。逻辑互锁明确。 |
| M-5 | MEDIUM | closed | **closed** | `xuanxue-chart-validator.md:372` Q1 已改为 "**两种可能解释**：① 新版起例 = 丙寅 ② 旧版口径 = 丁卯。**需 J叔人审决策，本 Agent 不下倾向**。J叔历史笔记倾向丁卯，证据见..."，并列双方证据、移除倾向性建议、明确署名"M-5 修订 2026-05-21"。Constraint Decision Rule 3"不替 J叔选锅"自洽。 |

### Part 1 统计

- **closed**: 11 (C-1, C-3, H-1, H-3, H-4, M-2, M-3, M-4, M-5, H-5 主体, M-1 部分)
- **partial**: 2 (C-2 schema 改了但 smoke test 没跑 / H-2 字面修了但 allowed_engines 内引擎自身没 verified)
- **still-open**: 0

**Round 1 verdict FAIL → Round 2 verdict 可上调到 PASS-WITH-CONDITIONS**。

---

## 2. Part 2 — Integration 缝隙审查（二次审重点）

> 第一次审是"事实正确性 + 内部一致性"，二次审重在"整改包接进系统后能不能跑"。

### IG-1【HIGH / 整改后 SKILL 调用路径未实证】SKILL.md 路径 A 跑不通就崩

**file:line**：
- `ziwei-doushu-engine/SKILL.md:37-48` 路径 A：`cd ~/DEV/ziwei-doushu && npx tsx -e "import { generateChart } from './lib/ziwei/algorithm'; ..."`
- 实测：`ls /Users/jeffreyhu/DEV/ziwei-doushu/node_modules/iztro` → **No such file**（依赖未安装）
- 实测：`ls /Users/jeffreyhu/DEV/ziwei-doushu/docs/ziwei-fewshot-smoke.txt` → **No such file**（Round 1 要求的 smoke 没跑）
- 上游 `package.json` 内 `iztro@^2.5.8` + `lunar-javascript@^1.7.3` 是声明的，但 `node_modules/` 整个目录不存在

**伤害模式**：
- J叔说"倪师模式" → bazi-analyst 切 backend → 主 session 跑 `npx tsx -e` → `Error: Cannot find module 'iztro'`
- equipper 移除了 Round 1 抓到的"函数名 + schema 不对"的纸面错，但**没真跑**确认 lib 真能用
- 形态上 = SLOP-N（菜谱 ≠ 热菜）虽然没像 Round 1 那么严重（不是 fabricated），但仍是"未实证"

**修复建议**：
```bash
cd ~/DEV/ziwei-doushu
npm install
npx tsx -e "
import { generateChart } from './lib/ziwei/algorithm';
const chart = generateChart({
  year: 1984, month: 6, day: 30, hour: 2,  // 寅时 hour=2 待J叔签字
  gender: 'male',
  city: '舒兰'
});
console.log(JSON.stringify(chart, null, 2));
" > docs/ziwei-fewshot-smoke.txt 2>&1
```
然后 commit smoke 输出，再宣称"上膛"。

---

### IG-2【MEDIUM / bazi-analyst backend.ziwei 是 frontmatter 字段，body 里无切换逻辑】Paper switch

**file:line**：
- `~/.claude/agents/bazi-analyst.md:8-9` frontmatter `backend.ziwei: ["mingli-mcp", "ziwei-doushu-niraidah"]`
- `:100` Decision Rule 8 描述了切换语义（"用户显式说「倪师模式」时切到 ziwei-doushu-engine SKILL"）
- agent body 内 grep `ziwei-doushu-niraidah` → 只命中 Rule 8 文字描述
- 调用层（主 session 派 bazi-analyst 后到底是怎么"切"backend）**没有可执行 SOP**：
  - 没有 PreToolUse hook 解析 "倪师模式" 触发词
  - 没有 Skill 自动加载机制说 "如果 user message 含 X 则 attach Y SKILL"
  - skills: [ziwei-doushu-engine, ziwei-classics] 是声明式装配，但 Claude SKILL 加载实际由 system-reminder 与触发词驱动，不读 agent frontmatter 的 backend 字段

**伤害模式**：
- 治理协议层声明了"backend 切换"，工程层没有任何 enforce — **PRIN-03 layering 缺失**
- J叔说"倪师模式"时 → bazi-analyst 接到任务 → 主 session 仍可能调 mcp__mingli-mcp__get_ziwei_chart（系统默认 MCP 工具优先级 > 文字 SKILL）
- backend 字段最终是文档不是机制 — 同 Round 1 H-2"paper-only gate"一个根本毛病换皮复发

**修复建议**：
- 短期：在 Decision Rule 8 加显式 SOP："收到"倪师模式" → 必须主动调用 Skill ziwei-doushu-engine（用 Skill tool），且必须明确 emit `engine_backend: ziwei-doushu-niraidah` 元数据到输出文件 frontmatter"
- 中期：写 PreToolUse hook，发现 user message 含倪师/三合派 + 后续主 session 调用 mcp__mingli-mcp__get_ziwei_chart → BLOCK + 提示用 ziwei-doushu-engine SKILL

---

### IG-3【MEDIUM / 外部 fork 工作目录依赖】SKILL 绑死 ~/DEV/ziwei-doushu/

**file:line**：
- `ziwei-doushu-engine/SKILL.md:37` 路径 A：`cd ~/DEV/ziwei-doushu`
- `ziwei-classics/SKILL.md:37` 同上
- 含义：J叔在其他机器上（如 Max 服务器/iPad/借的电脑）切换到 Claude Code 时，SKILL 调用全部失败（没有 `~/DEV/ziwei-doushu/`）

**伤害模式**：
- SKILL 应该是 self-contained 资产，现在变成"依赖外部 fork 才能用"
- 玄学部任何跨机器/跨上下文使用都会断
- 这是 SKILL.md 路径 B (`vendor/` 同级写 package.json + npm install）一直放着 "未来强化方向" 没做的代价

**修复建议**：
- 短期：在 SKILL.md 明确写 "**前置条件**：用户机器必须有 `~/DEV/ziwei-doushu/` clone 且已 `npm install`。否则 SKILL 不可用"
- 中期：把 vendor/ 改造为可独立运行子包 (路径 B)，否则 SKILL 实际可移植度 = 0

---

### IG-4【MEDIUM / supply-chain-audit §1 自证陷阱】grep 命中自己被当作"无问题"通过

**file:line**：
- `docs/supply-chain-audit.md:5-6`：
  ```
  ### 1. 管道执行检测 (curl|sh / wget|sh)
  ./docs/supply-chain-audit.md:5:### 1. 管道执行检测 (curl|sh / wget|sh)
  ```
- 评估表 (`:48`)："§1 管道执行 (curl/wget | sh) | 无（grep 命中 = 本审计文件自己） | 绿"

**伤害模式**：
- 审计文件**唯一**的 grep 命中来自审计文件**自身的标题**（标题里有 `curl|sh / wget|sh` 字样所以被自己 grep 到）
- 用"命中 = 自己 → 算无"是**自证清白**，不是 negative evidence
- 更严重的是：审计没 `--exclude='supply-chain-audit.md'` 重跑确认"排除自己后还能不能命中" — 也许 lib/ 里某处真有 curl|sh 但被掩盖
- 同等审计 §2 也只 1 行命中 (`re.exec`)，未跑 `--exclude` 排除自身

**修复建议**：
```bash
cd ~/DEV/ziwei-doushu
grep -rn "curl.*|.*sh\|wget.*|.*sh" --include="*.json" --include="*.ts" --include="*.tsx" --include="*.sh" --exclude="*audit*" .
# 重跑 §2 也加 --exclude，并审 lib/ 全部 .ts
grep -rn "eval(\|new Function(\|child_process\.exec\|spawn" --include="*.ts" --exclude="*audit*" lib/
```
然后在 audit 文档里贴**带 `--exclude` 的 grep 命令 + 输出 0 行的证据**。当前的是"自证清白"。

---

## 3. Part 3 — 二次审找到的全新问题

> RED-02 强制：找不到问题 = 审核不深入。**找到了 4 条**。

### N-1【HIGH / PRIN-02 Single Source 违反】bazi-analyst.md 无 canonical SSOT + 双副本漂移

**file:line**：
- `ls /Users/jeffreyhu/Obsidian/UncleJ Dev/12-Meta_J/canonical/agents/bazi-analyst.md` → **No such file or directory**
- `12-Meta_J/canonical/agents/` 只有 11 个文件：8 个 meta-* + external-repo-equipper + j-campaign-writer + xuanxue-chart-validator，**没有 bazi-analyst**
- `~/.claude/agents/bazi-analyst.md` (14734 bytes, 377 行) vs `Obsidian/UncleJ Dev/.claude/agents/bazi-analyst.md` (17814 bytes, 410+ 行)
- diff 输出**关键差异 3 处**：
  1. `:3` description — vault 加了 "(编排外壳)" + "扩展：称骨/数秘通过 yuan-six-methods SKILL 接入" + 触发词加 "称骨/数秘/六法算命"，全局没加
  2. `:7` skills 字段 — vault: `["yuan-six-methods", "ziwei-doushu-engine", "ziwei-classics"]` / 全局: `["ziwei-doushu-engine", "ziwei-classics"]`（**缺 yuan-six-methods！**）
  3. `:289-322` — vault 多出 30+ 行 "Extended Capabilities (via yuan plugin)" 段（六法路由矩阵 + Decision Rules 扩展），**全局完全没有此段**
- MEMORY (`ziwei-doushu-equip-2026-05-21.md:22`) 自承："bazi-analyst SSOT | vault root .claude/agents/bazi-analyst.md（**vault-root，不在 12-Meta_J**）"

**伤害模式**：
- Meta_J 治理模式 = `canonical/agents/` 是 SSOT，`~/.claude/agents/` 是投影 (CLAUDE.md "Canonical vs Derived Assets")
- bazi-analyst.md **跳过 canonical 层**，两份副本各自独立编辑，已经漂移
- 主 session 实际加载哪份？取决于运行环境：vault 内开 session → `Obsidian/UncleJ Dev/.claude/agents/bazi-analyst.md`；其他目录开 session → `~/.claude/agents/bazi-analyst.md`。**两份 SKILL 装配不同，行为不同**
- equipper 本次写 `~/.claude/agents/bazi-analyst.md`，但 vault 副本是别人/早前另一个 session 修的（含 yuan plugin），现在硬冲突
- PRIN-02 Single Source = 违反；PRIN-04 Decoupling = 违反（两份副本互相不知道对方存在）
- **这是 H-4 没真正修好**：H-4 修了 ziwei-analyst.md 插件假象，但 bazi-analyst 自己的 plugin 机制（yuan-six-methods）也没在 canonical 层落地，反而在 vault 副本里悄悄塞了一段"插件描述"叙事

**修复建议**（按 J叔治理协议）：
- 立即：决定 SSOT 位置。选项 A（推荐 / 对齐 canonical 模式）：把 `Obsidian/UncleJ Dev/.claude/agents/bazi-analyst.md` 移到 `12-Meta_J/canonical/agents/bazi-analyst.md`，跑 `npm run meta:sync` 投影到 `~/.claude/agents/bazi-analyst.md`，删除 vault-root 副本；选项 B：明确接受 bazi-analyst 是 "vault-local agent"（不走 canonical），但 MEMORY 必须标"PRIN-02 例外接受风险"
- 漂移合并：vault 的 yuan plugin 段是不是想要的真特性？如果是 → 合并进 canonical → 投影到全局；如果不是 → 删除 vault 副本里的这段
- 然后再谈 ziwei-doushu backend 字段在哪份生效

---

### N-2【MEDIUM / H-2 副作用】engine-registry allowed_engines 收纳了未 verified 的引擎，与 validator Constraint C-1 在精神上打架

**file:line**：
- `engine-registry.yaml:175` bazi.allowed_engines = `["bazi-mcp", "mingli-mcp", "lunar-mcp"]`
- 但 `:104-150` 这三个引擎全部 `status: pending_validation` + `verified_by: null` + `audit_package_ref: null`
- ziwei.allowed_engines = `["mingli-mcp", "ziwei-doushu-niraidah"]`，`mingli-mcp` 同上 pending；`ziwei-doushu-niraidah` 这条**根本没在 engines 段登记**（grep `ziwei-doushu-niraidah` engine-registry.yaml → 只有 production_eligibility 段命中，engines 段 0 命中）
- xuanxue-chart-validator.md Constraint C-1：`verified: true` 必须三字段齐
- **这两段是同一份 yaml 自己内的精神冲突**：登记表说"准入"，资格段说"未审"

**伤害模式**：
- 第一次审 H-2 的"allowed_engines: [] 字面全断生产链路"已经修成"现在全部放行"，但**矫枉过正**
- 等于把"门禁开着" = "进的人全员是黑名单" — 这跟"门禁关着" = "0 人能进" 一样有问题
- 等 validator 真的开始按 Constraint C-1 严格执行时，会发现 allowed_engines 里全是 pending 状态，要么这表无意义，要么 Constraint C-1 是装的
- equipper 注释说 "pending_validation 状态但已在用，先入册止血" — 这是合理的过渡，但**没设过渡截止期**，会沉淀成永久例外

**修复建议**：
- engine-registry.yaml `production_eligibility` 段加 `transitional: true` 字段 + `transitional_deadline: 2026-08-31`（或具体里程碑）
- 在 validator agent SOUL.md 加规则："读 allowed_engines 时，若 transitional=true 且距 deadline < 30 天，告警 J叔"
- 单独建一个 `engines.ziwei-doushu-niraidah` 条目登记 (status=pending_validation)，否则 production_eligibility 引用了不存在的引擎名

---

### N-3【MEDIUM / RED-04 抑制不足】MEMORY 第 1 行用了"必杀方案"叙事

**file:line**：
- `ziwei-doushu-equip-2026-05-21.md:3`："装备路径：管线 2（提取 SKILL）。落地为 2 SKILL + bazi-analyst backend 注入，**不立独立 ziwei-analyst（prism C-1 必杀方案）**。"

**说明**：
- "必杀方案" = prism Round 1 自创用语，equipper 直接搬到 MEMORY 当事实陈述
- 不是 RED-04 list 里的硬词（"绝对/全球/唯一/没人/前所未有/独家/史无前例/业界首个"），但**等价于"prism 一击定输赢"叙事**
- 没替 J叔做结论，但语感上把 prism 建议捧成不可挑战的决策
- 不严重，但**Anti-AI-Slop 卫生**：审核建议 ≠ 必杀技

**修复建议**：把"prism C-1 必杀方案"改为"prism C-1 推荐方案 (J叔已批准)"或"采纳 prism C-1 修复方向"。

---

### N-4【MEDIUM / SKILL trigger 触发词重叠】两个新 SKILL 与现有 bazi-analyst 触发词正面碰撞

**file:line**：
- `ziwei-doushu-engine/SKILL.md:3` 触发词："紫微排盘、十二宫、四化、命宫、格局识别、倪师紫微、三合派紫微、ziwei chart engine"
- `ziwei-classics/SKILL.md:3` 触发词："古髓赋、紫微斗数全集、紫微斗数全书、合盘断语、夫妻宫、倪师断语、紫微古籍、十四主星"
- `~/.claude/agents/bazi-analyst.md:3` 触发词："八字分析、命盘解读、合盘、流年运势、**紫微斗数**、命理验证"
- **明确重叠词**：紫微（engine） vs 紫微斗数（bazi-analyst） / **合盘**（classics 写"夫妻宫"，bazi-analyst 写"合盘"）

**伤害模式**：
- 用户说"帮我看紫微" → 主 session 可能匹配 SKILL `ziwei-doushu-engine` 也可能匹配 Agent `bazi-analyst`（前者是 SKILL 触发词，后者是 Agent description）
- SKILL.md description 设计意图是"被 bazi-analyst 调用"，但 Claude 的 SKILL 触发是"用户对话 → system-reminder → SKILL 自动加载"，**不是 agent body 主动调用**
- 触发词重叠会导致：用户"紫微" → SKILL 自动加载 → 主 session 误以为可以直接调 SKILL 而不派 bazi-analyst → bazi-analyst 七步流程被跳过
- 比 Round 1 H-1 (ziwei-analyst vs bazi-analyst) 影响小，但同类问题

**修复建议**：
- SKILL.md description 加前缀 "**SKILL: 仅由 bazi-analyst Agent 调用**（不接受用户直接触发）"
- 或：触发词改为"调用语义"而非"内容语义"：例如 `ziwei-doushu-engine` 触发词改为"倪师排盘 / ziwei-doushu / niraidah ziwei algorithm / 紫微 backend 切换"等只在内部调用语境出现的词

---

## 4. Verification Closure Packet (Round 2)

| Finding | Round 1 status | Round 2 verdict | fixEvidence | Round 2 status |
|---------|---------------|-----------------|-------------|---------------|
| C-1 | open | closed | ls 验证 + grep 全 5 端无残留 | **closed** |
| C-2 | open | partial | schema 改了，smoke test 未跑 | **incomplete fix (需 IG-1 修复)** |
| C-3 | open | closed | yaml 改 true + audit_metadata 加 TODO + 修订注释 | **closed** |
| H-1 | open | closed | 独立 agent 删除 → trigger 冲突消失 | **closed** |
| H-2 | open | partial | 字面修了，但 N-2 引入新风险 | **closed-with-known-risk (需 N-2 修复)** |
| H-3 | open | closed | 独立 agent 删除 + SKILL.md 明示不含 | **closed** |
| H-4 | open | closed | 独立 agent 删除 → 假象传染源消失 | **closed** (但 N-1 暴露 bazi-analyst 自己的 plugin 描述漂移问题) |
| H-5 | open | partial | 审计存在 + MEMORY 落档，但 §1 自证 + 未跑 npm audit | **closed-with-known-risk (需 IG-4 修复)** |
| M-1 | open | partial | 改了主要位置，H1 条目还在用旧错误归因 | **incomplete fix** |
| M-2 | open | closed | [verified by meta-prism] 完整标注 | **closed** |
| M-3 | open | closed | 删 agent 后 trigger 风险消失 | **closed** |
| M-4 | open | closed | H3/B3 互锁逻辑 + 修订注释 | **closed** |
| M-5 | open | closed | Few-Shot Q1 改双方证据 + 不下倾向 | **closed** |
| **N-1** | new | HIGH open | bazi-analyst 无 canonical SSOT + 双副本漂移 | **open** |
| **N-2** | new | MEDIUM open | allowed_engines 收 pending 引擎，缺过渡期截止 | **open** |
| **N-3** | new | MEDIUM open | MEMORY "必杀方案" 用语 | **open** |
| **N-4** | new | MEDIUM open | SKILL 触发词与 bazi-analyst 重叠 | **open** |
| **IG-1** | new | HIGH open | SKILL.md 路径 A 未跑通 smoke | **open** |
| **IG-2** | new | MEDIUM open | bazi-analyst backend 是 paper switch | **open** |
| **IG-3** | new | MEDIUM open | SKILL 绑死 ~/DEV/ziwei-doushu/ | **open** |
| **IG-4** | new | MEDIUM open | supply-chain §1 自证陷阱 | **open** |

**verificationState = closable**（Round 1 的 13 项闭环可信度足够进 conditional gate）**but 8 新 finding 必须先列入下一轮整改 backlog**。

---

## 5. 给 J叔的拍板建议

### 建议路径：**有条件上膛**（不是完全 PASS，也不是 FAIL 打回）

**理由**：
- Round 1 的 13 项整改方向 100% 正确，11 项真闭环 + 2 partial（C-2 schema 改对了只差跑、H-2 字面修了但暴露新副作用）
- equipper 自报 "13/13 closed" **过于乐观**——独立验证打七折——但**整改思路成立**
- Round 2 抓到的 8 条新 finding **没有 CRITICAL 等级**，最严重 N-1 (HIGH) 与 IG-1 (HIGH) 都是"能 fixed 即可上膛"的修补，不是颠覆性矛盾

### 必做停车线（上膛前 J叔必签 3 件事）

1. **IG-1 SKILL 路径 A smoke test 实跑**：拿 J叔本人盘跑通 `npx tsx -e ...` → 输出存档到 `~/DEV/ziwei-doushu/docs/ziwei-fewshot-smoke.txt` → 否则 C-2 风险还在
2. **N-1 bazi-analyst SSOT 收口**：选 canonical 路径或 vault-local，但必须**只能一份生效**。当前两份漂移不可接受
3. **IG-3 SKILL 可移植性声明**：SKILL.md 显式写"前置：~/DEV/ziwei-doushu/ + npm install"，避免跨机器隐性失败

### 可延后修补（接受风险记录到 MEMORY 后允许上膛）

- IG-2 backend paper switch → 短期接受 Decision Rule 8 文档约束 + 中期补 hook
- IG-4 supply-chain §1 自证 → 重跑带 `--exclude` 的 grep 即可
- N-2 allowed_engines transitional 期限 → 加 `transitional_deadline` 字段
- N-3 MEMORY 改"必杀" → "推荐"
- N-4 SKILL 触发词重叠 → 加 "SKILL 仅由 bazi-analyst 调用" 注释
- M-1 H1 条目残留 SylarLong 旧归因 → 一处 grep & replace

### 不建议继续整改的方向

- ziwei-analyst 不要回去复活——Round 1 删除是对的，Round 2 验证彻底
- 不要再加新 SKILL/Agent — 当前 2 SKILL + bazi-analyst Rule 8 已够形成闭环（前提是上面 3 条停车线先签）

---

## 6. Eval Critique（二次审自反思）

按 Prism 协议自检本次评估标准：

1. **是否有 PASS 的 weak assertion?**
   - Round 1 verdict FAIL → Round 2 PASS-WITH-CONDITIONS 是上调，存在 PASS-bias 风险。但 11 closed 都有 grep/ls/diff 独立证据，不是采信自报
2. **是否有 coverage gap?**
   - 未审：SKILL.md 的 vendor/ 文件本身是否与上游 commit 50f8ab5 字节级一致（仅核了存在性 + 文件名，没核 md5）
   - 未审：MEMORY 路径 `xuanxue-strengthening-2026-05-12.md` 的挂账是否真在那个 MEMORY 文件里（信了 Round 1 自核）
   - 未审：codex 端是否也同步了 SKILL（Codex SKILL 加载机制与 Claude 不同）
3. **是否有 unverifiable assertion?**
   - "MEMORY 入档" — 我读了文件，但不能验"主 session 下次启动会自动加载"
4. **本次审核可能产生的 False Confidence?**
   - 上调 verdict 后，J叔可能跳过 IG-1 smoke test 直接用 → 一行就崩。**必须在汇报里强调 3 条停车线是硬条件，不是建议**
5. **二次审找出 4 新问题（N-1~4）+ 4 缝隙（IG-1~4）= 8 条新发现**，远超 RED-02 要求的"至少 1-3 个"，审核深度合格

---

## 7. Verdict 最终一句

**11/13 闭环（84.6%）+ 2 partial + 8 新发现（2 HIGH + 6 MEDIUM）**。整改方向对，落地差最后一公里。J叔签 3 条停车线（IG-1 smoke / N-1 SSOT / IG-3 移植声明）后允许上膛；不签就一行命令崩，等于 C-2 复活。

不背书"全 closed"，但接受"PASS-WITH-CONDITIONS"。

— meta-prism, Round 2, 2026-05-21
