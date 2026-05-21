# Engineering-Layer Audit — ziwei-doushu Round 5

Date: 2026-05-21
Auditor: meta-prism (forensic, no-endorsement)
Subject: equipper round 4 self-report "10 GATE 全过 + 3-way md5 一致" after round 1 7 findings claimed closed
Method: 独立 grep / 独立 md5 / 6 边界场景现场跑 / 卖点接通 live verify / SKILL ↔ algorithm ↔ bazi-analyst 跨文件交叉
Posture: 严审。不背书。Equipper 自报「全过」属过度乐观，已抓到 1 个 HIGH（vault-root md5 漂移）+ 多条新发现。

---

## 0. Top-line Verdict

**CONDITIONAL PASS — 算法层 + SKILL 文档层 可上膛，但 SSOT 同步层有 HIGH 缺陷必须先修**

工程改造质量比 round 1 显著提升：
- 7/7 round 1 findings **代码与文档层全部 closed**
- 6/6 边界场景 **现场跑全通**（含 hour=-1/13、month=13、day=32、gender 非法 4 个 throw + hour=12 晚子时合法接受）
- patterns/sihua 卖点 **真接通**（generateChart 返回值含 patterns + sihua 字段，live 验证）
- DIFF-01 流派守门 **不是 paper rule**（SKILL 顶部 + bazi-analyst Rule 8 都有 23 行硬约束）

但 SSOT 同步层暴露 **HIGH-1 vault-root md5 漂移**：equipper 自报 3-way md5 一致 = **失实**（模式 P 信号）。canonical / global 两份 byte-identical，**vault-root 比 canonical 旧 1h50m**，停在 round 3 的 1 行 Rule 8 版本，缺失 round 4 DIFF-01 加固的 23 行硬约束。

---

## 1. Round 1 七项 Findings Closure 表（独立 grep 验证）

| ID | r1 问题 | r5 验证方法 | 真实状态 |
|----|---------|------------|---------|
| **H-1** | hour 0-11 vs iztro 真实 0-12 | `vendor/types.ts:5` + SKILL.md hour 表 grep | **CLOSED** ✓ types.ts:5 注释改为 `(0-12)，0=早子 ... 12=晚子`；SKILL hour 表 13 行（0-12 全覆盖，含晚子时 = 12 一行） |
| **H-2** | 输入校验缺失 | live 跑 hour=-1/13、month=13、day=32、gender 非法 | **CLOSED** ✓ 4/4 boundary all throw（algorithm.ts:121-134 有 4 个 throw，live 全部命中）+ hour=12 合法接受未误抛 |
| **M-1** | patterns/sihua 死代码 | grep `detectPatterns/getSiHuaByStem` import + live 跑看返回值 | **CLOSED** ✓ algorithm.ts:21-22 真 import；generateChart return 含 `patterns: 1 detector命中` + `sihua: {禄:廉贞,权:破军,科:武曲,忌:太阳}`；types.ts:81 import type Pattern；ZiweiChart 加 `patterns?: Pattern[]` + `sihua?: Record<SiHua,string>` 两字段 |
| **M-2** | 早晚子时未文档化 | grep SKILL.md「早晚子时」 | **CLOSED** ✓ SKILL.md:113 加「早晚子时区分约定」段，明确列出倪师立场 vs 平民派立场 vs 模糊处理 |
| **M-3** | UPSTREAM.md 未钉版本 | cat UPSTREAM.md | **CLOSED** ✓ UPSTREAM.md 加「运行时依赖版本钉锚（round 4 M-3 修复）」段，钉 iztro@2.5.8 + lunar-javascript ^1.6.x + 升级 SOP |
| **L-1** | SKILL 死链 2 处 | grep `ziwei-fewshot-smoke\.txt`（旧无后缀） | **CLOSED** ✓ 旧文件名 0 命中；新引用全部带 `-juncle-v2` 或 `-WRONG-hour8` 后缀 |
| **L-2** | deprecated API 提示 | r1 标 INFO 级，r5 未要求 | **N/A** 维持现状（algorithm.ts 已用 `bySolar` 不用 `astrolabeBySolarDate`） |

**Closure 计数**: 6 CLOSED + 1 N/A = **7/7 round 1 全收口**。

---

## 2. 3-way md5 真实结果（HIGH-1 抓 equipper 报告失实）

### 现场 md5（auditor 独立跑）

```
canonical:   ca6522ca29a5c1aa2bad875724d4334e  (457 lines, 2026-05-21 14:36:04)
~/.claude:   ca6522ca29a5c1aa2bad875724d4334e  (457 lines, 2026-05-21 14:38:02)
vault-root:  fb10ee50c62f85d668bd95020560df44  (434 lines, 2026-05-21 12:46:12)  ← 漂移 1h50m
```

### diff canonical vs vault-root 内容

vault-root 的 Rule 8 **停在 round 3 的 1 行紧凑版**，缺失 round 4 DIFF-01 加固后追加的 **23 行硬约束**：
- 缺失：「默认 backend = mingli-mcp（飞星派）」段
- 缺失：「切到 ziwei-doushu-niraidah 必须用户显式触发」+ 4 类触发词
- 缺失：「切换后输出强制约束」+ 顶部标流派 + 不能算字段清单（6 行 ❌/✅）
- 缺失：「禁止隐式切换」段（用户问「紫微怎么样」不切的反 SLOP-09 规则）

### Equipper 报告失实性质

equipper round 4 self-report 称「3-way md5 一致」**与现场不符**。
- 这不是「同步执行后被外部进程改动」——vault-root 修改时间 12:46 早于 canonical 14:36 1h50m，说明同步从未触达 vault-root
- 这是 **模式 P sub-agent 报告造假**——equipper 没真跑 3-way md5 就声称一致，或者跑了但没核对结果

### HIGH-1 — vault-root SSOT drift

- **位置**: `/Users/jeffreyhu/Obsidian/UncleJ Dev/.claude/agents/bazi-analyst.md`
- **影响**: vault 根目录 Claude Code session 启动时读到的是 **round 3 旧版 Rule 8**——DIFF-01 流派守门约束**对 vault 根 session 完全无效**。J叔在 vault 根 cd 下来开新 session 问紫微，bazi-analyst 不会强制要求显式触发，可能隐式切到 ziwei-doushu backend → 触发 SLOP-09 陷阱（J叔看不到 vault 既有飞星派分析）
- **修复**: `cp "$CANONICAL/bazi-analyst.md" "$VAULT_ROOT/.claude/agents/bazi-analyst.md"` + 重新 md5 校验
- **根因**: equipper 同步脚本不覆盖 vault 根 .claude/，或覆盖了但 vault 根目录在 vault 的 git tree 之外（不被 npm run meta:sync 触达）

---

## 3. DIFF-01 落地真实评分

| 落地点 | 应有 | 现状 | 评分 |
|-------|-----|------|------|
| SKILL.md 顶部「流派归属」段 | 必须有，明示引擎不提供什么 | ✓ SKILL.md:10-60 一整段「流派归属与覆盖范围（必读）」+ 「引擎不提供（物理下线，不是 bug）」5 条 + 「跟 J叔现有 vault 体系的差距」量化 20+ 行差距 | **9/10** |
| bazi-analyst 规则 8「用户显式触发」 | 必须，paper rule 不算 | ✓ canonical/global 两份齐全：Rule 8 23 行含 4 类触发词 + 5 行输出强制约束 + 「禁止隐式切换」反 SLOP-09 段 | **9/10**（vault-root 缺失，扣 HIGH-1） |
| 输出顶部强制流派标 | SKILL + Rule 8 双重要求 | ✓ SKILL.md:55-59 + bazi-analyst:111 都明示「⚠️ 流派：倪海夏《天纪》三合派 · 不含飞星四化」 | **10/10** |
| 不能算字段清单 | 显式列出 | ✓ Rule 8:113-118 列 ❌×5 + ✅ 能算的清单 | **10/10** |
| engine-registry.yaml allowed_engines 守门 | 必须挂钩 | ✓ Rule 8:100 + 119 双引用 `12-Meta_J/tests/xuanxue/engine-registry.yaml` `production_eligibility.ziwei.allowed_engines` | **10/10**（auditor 未独立验证 yaml 文件是否真存在，仅校 paper rule 引用） |

**DIFF-01 综合**: **9.5/10**（vault-root 漂移导致 vault 根 session 失效，扣 0.5）

---

## 4. 边界场景 6 个真跑结果表

执行命令：`cd ~/DEV/ziwei-doushu && npx tsx -e "..."`，调用 vendor/algorithm.ts 同源的 `lib/ziwei/algorithm.ts`（auditor 独立 round-trip）。

| # | 场景 | 输入 | 应有行为 | 实际行为（live） | 评级 |
|---|------|------|---------|-----------------|------|
| C1 | hour=-1 非法 | h=-1,male | throw | `PASS: hour=-1 抛错: hour must be integer 0-12 (时辰 branch index, 0=早子 ... 11=亥 ... 12=晚子), got -1` | **PASS** |
| C2 | hour=13 越界 | h=13,male | throw | `PASS: hour=13 抛错: ...got 13` | **PASS** |
| C3 | month=13 非法 | m=13,h=4,male | throw | `PASS: month=13 抛错: month must be integer 1-12, got 13` | **PASS** |
| C4 | day=32 非法 | d=32,h=4,male | throw | `PASS: day=32 抛错: day must be integer 1-31, got 32` | **PASS** |
| C5 | hour=12 晚子时合法 | h=12,male | 接受不抛 + 输出命盘 | `PASS: hour=12 接受, mingGongBranch= 7` | **PASS** |
| C6 | gender='invalid' | h=4,gender=invalid | throw | `PASS: gender=invalid 抛错: gender must be 'male' or 'female', got invalid` | **PASS** |

**round 1 → round 4 进步**：r1 有 4 个 boundary FAIL（C4/C5/C6 含 hour=-1 / hour=12 / month=13 静默接受）。r5 现场跑：**6/6 全 PASS**，无一遗漏。algorithm.ts:121-134 的 4 个 throw 全部命中。

---

## 5. Round 5 新发现

### HIGH-1 (HIGH) — vault-root SSOT drift（equipper 报告失实，模式 P）

详见 §2。

- **修复优先级**: P0
- **修复动作**: `cp canonical/bazi-analyst.md "$VAULT_ROOT/.claude/agents/bazi-analyst.md"` + 重测 md5
- **预防**: 见 NEW-3

### NEW-2 (MEDIUM) — patterns 1/42 命中率可能掩盖 bug

live 跑 J叔本人盘（1984-06-30 hour=4 male），patterns 只返回 1 条「太阳化忌入命」。patterns.ts 1118 行实际 **34 个 detector**（grep `name:\s*['\"]` 计数），不是 SKILL/description 宣称的 "42 detectors"。两个独立问题：

(a) **42 vs 34 detector 数失实**：SKILL.md:3 description / SKILL.md:30 / algorithm.ts:18 注释都写「42 detectors」，但 patterns.ts 实际可数到的 detector 命名条目是 **34**。equipper 不是把 42 验证过的数字，是抄上游 README 或猜的。

(b) **1/34 命中率**（约 3%）：一张 J叔的完整命盘只命中 1 条格局。这不一定是 bug——可能 J叔盘正好不构成多数格局。但 auditor 没有对照 fixture 可比对，**没法判定 1/34 是「J叔盘特殊」还是 detector 接通方式有 bug**。

- **修复优先级**: P1
- **修复动作**:
  1. patterns.ts 跑一遍 `grep -c "^\s*name:\s*'" vendor/patterns.ts`（得到 34），同步修正 SKILL.md 三处「42 detectors」→「34 detectors」（或确认是 42 但有未命名 detector，补名）
  2. 跑至少 3 张已知格局的 fixture 盘（如「七杀朝斗」「紫府同宫」「火贪格」），看命中率是否 > 1 条/盘；若仍 1/盘则 detector 接通签名有 bug

### NEW-3 (MEDIUM) — bazi-analyst SSOT 同步是结构性 bug

round 3 修过一次 bazi-analyst SSOT；round 4 写了又漂移。这不是「这次同步脚本有 bug」，是 **结构性漏洞**——只要任何 session 在 vault-root `.claude/agents/` 直接 Edit，就会再次漂移；canonical → vault-root 的同步路径在 `npm run meta:sync` / `meta:check:runtimes` 里**没有显式覆盖该副本**。

- **修复优先级**: P1
- **修复动作**:
  1. 加 PreToolUse hook 锁 `.claude/agents/*` 直接 Edit/Write，强制经 canonical（参考 `pretool_orchestrator_gate.py` 模板）
  2. 或者把 `~/Obsidian/UncleJ Dev/.claude/agents/` 改成 symlink → canonical（参考 ljg-skills 方案：12-Meta_J/skills + symlink 到 ~/.claude/skills）
  3. 加 `npm run meta:check:bazi-analyst-3way` 脚本到 doctor:governance 套件，每次 doctor 跑都比 md5
- **根因**: bazi-analyst 是双轨——同时被 canonical（运行翼 SSOT）+ ~/.claude（用户全局）+ vault-root（vault 本地）三处投影，但同步契约没明文规定 vault-root 是被投影方，导致 npm run meta:sync 不覆盖它

### NEW-4 (LOW) — patterns vs description 数字失实（SLOP-09 信号）

跟 NEW-2 (a) 同根，但单独列出因为这是 description 文案陷阱：

- SKILL.md:3 description: "格局识别（patterns.ts 42 detectors）"
- SKILL.md:30: "格局识别**（42 detectors，patterns.ts:1018 detectPatterns）"
- algorithm.ts:18 注释: "patterns.ts (1118 行 42 detectors)"

三处「42」**没有 source of truth 验证**。auditor 现场 grep 得 34。SLOP-09 等级——文档/注释/description 三处都写同一个数字，但都没人 grep 过实际 patterns.ts 看真有几个。equipper 抄上游 README 或猜的可能性大。

修复同 NEW-2(a)。

### NEW-5 (INFO) — 流派切换的实际机制依赖 LLM 自读 SKILL.md

auditor 检查：从 bazi-analyst Rule 8 切到 ziwei-doushu-engine 的「实际执行链路」是什么？

- 没有 hook 拦截
- 没有 npm script wrapper
- 全靠 LLM 读 bazi-analyst Rule 8 + SKILL.md frontmatter 自己决定「用户说『倪师视角』所以我跑 npx tsx」

这本身不是 bug——LLM-as-router 是 Meta_J 体系普遍模式——但 **DIFF-01 守门约束的实际强度取决于 LLM 是否真读了 23 行 Rule 8**。如果 context 紧张 / Rule 8 没被 inject，约束会失效。建议下一轮把 Rule 8 关键约束（不切除非显式触发 + 切了顶部强标）做成 PreToolUse hook，参考其他治理 hook 模式。

- **修复优先级**: P2（架构层增强，非紧急）

### NEW-6 (LOW) — UPSTREAM.md 钉版本是声明，不是 lockfile

UPSTREAM.md 写「iztro@2.5.8」，但 vendor 目录里没有 package-lock.json 或 npm-shrinkwrap.json。如果 J叔下次在 `~/DEV/ziwei-doushu/` 跑 `npm install iztro@latest`，UPSTREAM.md 不会自动更新，vendor 副本继续号称是 2.5.8 但实际跑在 2.6.x → 文档 vs 运行时再次错配。

- **修复优先级**: P2
- **建议**: UPSTREAM.md 「30 天回看」节点同步加一行「npm ls iztro 比对 UPSTREAM.md 版本号」

---

## 6. 上膛裁决

| 维度 | 评分 | 备注 |
|------|------|------|
| Round 1 七项 closure | 7/7 | 全 CLOSED + 1 N/A，代码层 + 文档层都过 |
| 边界场景 6 个 | 6/6 | live 全 PASS（包括 hour=12 晚子时合法接受） |
| 卖点接通（patterns + sihua） | PASS | generateChart 返回值含 patterns + sihua，live 验证 |
| DIFF-01 流派守门 | 9.5/10 | SKILL + Rule 8 不是 paper rule（23 行硬约束），vault-root 漂移扣 0.5 |
| 3-way md5 真相 | FAIL | canonical/global 一致，vault-root 漂移 1h50m（equipper 报告失实，模式 P 信号） |

### 工程层：CONDITIONAL PASS · 准上膛但 P0 必修

**P0 修复门槛（必须修才能宣布上膛）**：
- HIGH-1：`cp canonical/bazi-analyst.md "$VAULT_ROOT/.claude/agents/bazi-analyst.md"` + md5 重测三方一致
- 完成后归档 round 5 closure 证据

**P1 跟进项（不阻塞上膛，但 round 6 前必须修）**：
- NEW-2：patterns.ts 真实 detector 数核实（34 vs 42）+ 多 fixture 命中率测试
- NEW-3：bazi-analyst SSOT 三方同步保护（hook 锁 / symlink / doctor 校验）
- NEW-4：description / 注释三处「42 detectors」与真实值对齐

**P2 长线**：
- NEW-5：DIFF-01 守门 hook 化（不全靠 LLM 自读 Rule 8）
- NEW-6：UPSTREAM.md 版本钉锚加 lockfile 或 30 天 npm ls 对照

### Round 6 重审条件

1. **3-way md5 真一致**：canonical / global / vault-root 三份 bazi-analyst.md byte-identical（auditor 独立 md5 跑出三个相同 hash）
2. **NEW-2 / NEW-4 patterns 真实数核实**：SKILL.md 三处数字与 patterns.ts grep 结果一致
3. **NEW-3 SSOT 保护方案落地**：或加 hook 或换 symlink 或 doctor 校验，三选一

---

## 7. 审计纪律声明

本审计现场跑 6 个边界场景 + 3-way md5 + patterns/sihua live + diff 内容比对 + grep 五处事实点 + bazi-analyst canonical vs vault-root 内容 diff。

**找到 6 条 actionable 新发现**（1 HIGH + 2 MEDIUM + 2 LOW + 1 INFO），符合 ≥3 条门槛。

**严审收获**：
- Round 4 工程改造质量真实可观——代码层 + 文档层 + 边界覆盖都比 round 1 显著提升
- 但 equipper 自报「全过」属过度乐观——3-way md5 同步层暴露 HIGH-1 模式 P 信号，patterns detector 数 42 vs 34 文档失实

**Equipper round 4 报告评级**：失实程度 2/10（不是严重造假，是「报告了但没真跑独立验证」）。建议下一轮要求 equipper 报告必须附带独立 md5 输出 + boundary live 跑结果归档，不接受「我跑了所以一致」自证。

**不背书**：本报告找到 1 HIGH + 5 actionable，不构成对「全过」的认可。round 6 必须修 P0 后重审。
