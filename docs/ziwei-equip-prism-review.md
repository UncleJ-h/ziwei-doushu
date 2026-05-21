---
title: ziwei-doushu 装备战役 — 独立审核报告
auditor: meta-prism
audit_date: 2026-05-21
audit_scope: 主 session 5 路 sub-agent 产出（2 调研 + 3 Agent + 2 fixture）
verdict: FAIL
verdict_reason: P0 级矛盾未解 + 关键 Few-Shot 代码无法运行 + 内部 gate 与 sub-agent 上层结论方向相反
---

# Prism Independent Review — ziwei-doushu Equipment Campaign

> 审完。**不背书**。一共找出 13 条问题：**3 CRITICAL / 5 HIGH / 5 MEDIUM**。Verdict: **FAIL（不允许进 Verification Gate）**。
>
> 主 session 自驱执行 5 路 sub-agent 完成产出，质量及格但 P0 层有"装好的 Few-Shot 跑一行就崩"+"上游分析报告 PILOT 建议被下游 Agent 直接顶死立独立 agent"两条骨级矛盾，必须 J叔回路打回修复后再审。
>
> 必杀建议（如 J叔只能动一处）→ 见文末 §4。

---

## 0. Top-Line Verdict 与状态

| 层级 | reviewState | verificationState | criteriaState |
|------|-------------|-------------------|---------------|
| 本次 | rated       | incomplete (FAIL) | stable        |

- **Verdict**：FAIL
- **关键根因**：3 个 CRITICAL 问题中，C-1（gap-analysis 推荐 "(b)+(c)" 反对独立 agent，warden 却造了独立 ziwei-analyst）属于 RED-03 前向陷阱；C-2（Few-Shot 调用的函数和参数全部对不上 lib 真实导出）属于 SLOP-07 fabricated data；C-3（fixture chart1/chart3 写了 `pending_user_confirmation: false` 但缺 audit_metadata 签字证据）违反 validator agent 自己定义的 Constraint C-1。
- **修复前禁止进入**：Verification Gate / 公开宣布"装备完成" / 接 bazi-analyst 生产链路 / 在 J叔笔记里产出任何带"ziwei-analyst 已上膛"标签的文件。

---

## 1. CRITICAL（必须修，3 条）

### C-1【RED-03 前向陷阱 / 跨产出矛盾】Gap-analysis 推荐"不立独立 agent"，warden 却建了独立 ziwei-analyst

**文件:行**：
- `docs/ziwei-doushu-gap-analysis.md:19`：「**判定：Pilot Test — 限定 backend 注入形态，不立独立 agent，不直接覆盖现有口径**。」
- `docs/ziwei-doushu-gap-analysis.md:26`：「**不建独立 ziwei-analyst agent**——会违反 `bazi-analyst.md:79` 已声明的 "Own 紫微斗数解读"边界，撕裂八字×紫微交叉验证。」
- `docs/ziwei-doushu-gap-analysis.md:120`：方案(a) 独立 ziwei-analyst agent ❌ **不推荐**
- `~/.claude/agents/ziwei-analyst.md:1-17`：**已落地独立 agent** `name: ziwei-analyst, type: execution, status: draft`
- `~/.claude/agents/ziwei-analyst.md:212` + `380`：用"降级路径"段试图自圆，但是仅设计上"可塌缩"，没有任何机械约束保证今后会塌缩

**证据链**：本次 5 份产出全部由同一次主 session 派出，gap-analysis 是侦察判官、ziwei-analyst 是执行 Agent 落地。同一次产出里，**Scout 在 §0 顶层结论里明确反对**的方案被 Warden 直接执行。Warden 既没有给出"覆盖 Scout 推荐"的理由，也没有在 ziwei-analyst 顶部标注"本 agent 与 Scout 建议(b)+(c)冲突，待 J叔决策"。

**伤害模式**：
- J叔后续 dispatch 时，主 session 看到独立 ziwei-analyst 直接调用 → 默认接受了"独立 agent"路径
- gap-analysis 报告变成"做过了但没采纳"的死文档，未来回看不知道哪个是 J叔真实意图
- 触 RED-03（前向陷阱）：同一战役内同样问题前后给出方向相反结论

**修复（必选一项）**：
- 选项 A（推荐）：删除 `~/.claude/agents/ziwei-analyst.md` + `~/.codex/agents/ziwei-analyst.toml`（如有），改走 gap-analysis Q5 推荐的 **(b)+(c)** = "bazi-analyst backend 注入 + ziwei-classics SKILL"路径
- 选项 B：保留 ziwei-analyst.md 但在文件顶部加 H1 级 admonition：「⚠️ 本 Agent 与 `docs/ziwei-doushu-gap-analysis.md:19` 的 Scout 建议冲突，J叔尚未拍板独立 vs 注入路径。在 J叔签字确认走独立 agent 前，本 Agent **禁止被主 session 自动 dispatch**」，并在 description 触发词改成 `紫微-pending-J叔决策` 之类的 negative trigger
- 不允许：保留现状，让两份文档自相矛盾继续走下去

---

### C-2【SLOP-07 Fabricated Data / 模式 N 内生性自恋】ziwei-analyst.md Few-Shot 调用的函数和参数 schema 跟 lib 真实导出**完全对不上**

**文件:行**：
- `~/.claude/agents/ziwei-analyst.md:387-399`：
  ```ts
  import { calculateZiweiChart } from './lib/ziwei/algorithm';
  const chart = calculateZiweiChart({
    solarDate: 'YYYY-MM-DD',
    birthTime: 'HH:mm',
    gender: 'male' | 'female',
    city: '北京'
  });
  ```
- lib 实际真相（`/Users/jeffreyhu/DEV/ziwei-doushu/lib/ziwei/algorithm.ts:6` + `lib/ziwei/types.ts:25-35`）:
  - 导出名是 `generateChart`，**不是 `calculateZiweiChart`**
  - `BirthInfo` schema 是 `{year: number, month: number, day: number, hour: number /* 0-11 branch index */, gender, name?, province?, city?, longitude?}`
  - **没有** `solarDate: string`、**没有** `birthTime: 'HH:mm'`
  - `hour` 是地支序号 0-11（子=0, 丑=1...），**不是** 'HH:mm' 时间字符串

**伤害模式**：
- 主 session 跟着 ziwei-analyst Few-Shot 走 `npx tsx -e "..."` 一行下去：`SyntaxError: calculateZiweiChart is not a function` 当场崩
- 哪怕修复 import 名，第二行 `solarDate` / `birthTime` 字段不存在，TypeScript 报 type error 或 runtime undefined
- ziwei-analyst Decision Rule 5 强调"调 lib 必经 Bash + Node script，禁止脑补"，但 agent 自己的 Few-Shot 就是脑补的——agent 把自己声称要禁止的 AI Slop 做进了自己的脚本范本
- 这是 SLOP-07（fabricated data）+ 模式 N（内生性自恋，菜谱≠热菜）双重违规

**修复**：
- 在 `~/.claude/agents/ziwei-analyst.md:386-399` 把 Few-Shot 改成可执行版本：
  ```ts
  import { generateChart } from './lib/ziwei/algorithm';
  const chart = generateChart({
    year: 1984, month: 6, day: 30, hour: 2,  // 时辰序号 2=寅时
    gender: 'male',
    city: '舒兰'
  });
  console.log(JSON.stringify(chart, null, 2));
  ```
- 修完必须实际跑一次（在 J叔本人 1984-06-30 08:15 命造上），把 stdout 截到本 review 同目录 `ziwei-fewshot-smoke.txt` 留证据
- 跑不通则该方案不可用，必须 escalate external-repo-equipper 走"长期方案 = 剥皮成 npm 包"路径

---

### C-3【Constraint C-1 自违反】fixture 在 chart1/chart3 上写了 `pending_user_confirmation: false` 但无 J叔签字证据

**文件:行**：
- `12-Meta_J/tests/xuanxue/known-charts.yaml:13`：chart1_jshu_self `pending_user_confirmation: false`
- `12-Meta_J/tests/xuanxue/known-charts.yaml:246`：chart3_yihai_dayun_qiyun `pending_user_confirmation: false`
- `12-Meta_J/tests/xuanxue/known-charts.yaml:131`：chart2 `pending_user_confirmation: true`（这条是对的）
- `12-Meta_J/tests/xuanxue/known-charts.yaml:390-394`：`audit_metadata_schema` **只是 schema 示例，没有任何一盘真实填充** `fixture_signed_by`/`fixture_signed_date`/`fixture_signature_evidence`
- `~/.claude/agents/xuanxue-chart-validator.md:217-219` Constraint C-1：「engine-registry.yaml 中任何引擎打 `verified: true` 时，必须同时填 `verified_by: "J叔"` + `verified_date: YYYY-MM-DD` + `audit_package_ref: <人审包文件路径>`」
- `~/.claude/agents/xuanxue-chart-validator.md:222-224` Constraint C-2：「`known_validations` 字段被改但无 J叔签字记录 = FATAL」
- MEMORY `xuanxue-strengthening-2026-05-12.md`：「**Golden Chart 3 盘 fixture 待 J叔人审**」——这条挂账明明还在，fixture 却已经在 chart1/chart3 标 `pending_user_confirmation: false`

**伤害模式**：
- Validator Agent 启动时（其 Memory 协议要求自查"3 盘签字证据"），发现 chart1/chart3 标"已确认"但无证据 → 根据 Constraint C-1 应"立即降级 + 告警"
- 但因为 chart1/chart3 是 fixture 的 V0 原始字段（不是本次新加的），就形成了**先发后审**的既成事实：validator agent 验任何新引擎，对照 chart1/chart3 时把"未审锚点"当"已审锚点"用
- Few-Shot 示例 1（`xuanxue-chart-validator.md:331-380`）直接拿 chart1 V1-V3 做了人审包草案，但这些锚点的 `verified_date: null` 或缺 audit_package_ref。Validator agent 自己造了证据真空

**修复**（两选一）：
- 选项 A（推荐）：在 fixture 中把 chart1/chart3 的 `pending_user_confirmation` 改成 `true`，明确"待 J叔签 fixture 本身"，同时为 `known_validations` 中 verified_date=null 的条目（V2/V3/V7/V8/V9）补"待 J叔审"标记
- 选项 B：J叔本人在 known-charts.yaml 每盘下显式补 `audit_metadata: {fixture_signed_by: J叔, fixture_signed_date: 2026-XX-XX, fixture_signature_evidence: <vault path>}`，然后才能保留 `pending_user_confirmation: false`

---

## 2. HIGH（强烈建议修，5 条）

### H-1【Trigger 重叠 / 模式 G】ziwei-analyst 与 bazi-analyst 在"紫微斗数"能力位上正面冲突

**文件:行**：
- `~/.claude/agents/bazi-analyst.md:3`：description 显式 OWN "**八字命理+紫微斗数分析师**" + 触发词"**紫微斗数**、命理验证"
- `~/.claude/agents/bazi-analyst.md:32`："**紫微斗数解读（十二宫星曜+三方四正+四化飞星+大限流年）**" 列在 Own 段
- `~/.claude/agents/ziwei-analyst.md:3`：description "**紫微、紫微斗数、ziwei、紫微排盘**...十二宫、四化、大限"
- `~/.claude/agents/ziwei-analyst.md:368`："本 agent 上膛后 bazi-analyst 紫微部分降级为指针"——但**没有同步修改 bazi-analyst.md description**，bazi-analyst 仍然在生产链路声称拥有紫微能力

**伤害模式**：主 session 收到"帮我看 J叔紫微盘"请求时，**两个 agent 同时被 capability-index 匹配**到，触发非确定性 dispatch。J叔之前选 bazi-analyst 做的紫微解读和 ziwei-analyst 之后做的可能口径不同（bazi-analyst 走 mingli-mcp 黑盒、ziwei-analyst 走 ziwei-doushu lib），却没有任何机制告诉主 session 该走哪个。

**修复**：
- 修 C-1 选 A（删 ziwei-analyst）：bazi-analyst 保持原状 → 冲突消失
- 修 C-1 选 B（保留 ziwei-analyst）：同步在 `bazi-analyst.md:3` description 删除"紫微斗数"+触发词；在 `bazi-analyst.md:32` Own 段把紫微解读降级为指针 "→ ziwei-analyst"；在 `bazi-analyst.md:75-80` 的紫微能力段加 admonition "本节已迁出，见 ziwei-analyst.md"

---

### H-2【engine-registry production_eligibility 是 paper-only gate】bazi-analyst / qimen-analyst body 内没有任何代码读它

**文件:行**：
- `12-Meta_J/tests/xuanxue/engine-registry.yaml:171-177`：`production_eligibility.bazi-analyst.allowed_engines: []` + fallback 规则"如 allowed_engines 为空，bazi-analyst 应在解读文件 frontmatter 标注 engine_unverified: true"
- `~/.claude/agents/xuanxue-chart-validator.md:77` Decision Rule 4：「未通过本 Agent 验证的引擎，**禁止**被 bazi-analyst / qimen-analyst 调用。准入登记表位置...bazi-analyst / qimen-analyst **调用引擎前应先查这张表**（这是它们的纪律，本 Agent 只负责维护表）」
- `~/.claude/agents/bazi-analyst.md` 全文：grep 结果 = **零** 引用 `engine-registry` / `production_eligibility` / `allowed_engines`
- `~/.claude/agents/qimen-analyst.md` 全文：同上 = **零** 引用

**伤害模式**：validator agent 维护了一张"准入表"+"门禁纪律"，但下游消费者根本不读这张表。等于在交通路口插了块"红灯禁止通行"的牌，但没有红绿灯也没有警察。bazi-analyst 继续调 mingli-mcp（其在 registry 里是 `status: pending_validation`），无人拦截。这是 SLOP-06 替换性问题：换名为"任何 gate 表"都说得通，没有真正的执行机制。

**附加副作用**：`allowed_engines: []` 当前**字面意思 = 一个引擎都不许用**。如果 bazi-analyst/qimen-analyst 真严格读这张表，今天就会断生产链路（mingli-mcp/bazi-mcp/lunar-mcp/kinqimen 都没在 allowed 名单）。所幸 H-2 漏洞救了它一命——但漏洞本身是缺陷。

**修复（按修复 PRIN-03 Layering）**：
- 短期：在 `bazi-analyst.md` Decision Rules 段加一条"调引擎前 grep `engine-registry.yaml` 的 `production_eligibility.bazi-analyst.allowed_engines`，不在列内的引擎在输出 frontmatter 标 `engine_unverified: true`"
- 中期：把 `engine-registry.yaml` 转成 JSON + 写一个 PreToolUse hook，bazi-analyst 调用 mcp_mingli / mcp_bazi / mcp_lunar 时硬比对，未列入即 BLOCK
- 别留 `allowed_engines: []` 字面"全断"状态在 production；要么改成 `null` + 文档说明"过渡期"，要么明确列出当前默认 allow 清单

---

### H-3【ziwei-analyst Card 3 "四化飞星专项" 是 paper feature】lib 物理上不输出飞星派 daXian.siHua

**文件:行**：
- `~/.claude/agents/ziwei-analyst.md:328-330` Card 3：「**四化飞星专项**...年干/命干/大限干/流年干 四化对照 → 飞入宫位结构解读」
- `~/.claude/agents/ziwei-analyst.md:97` Decision Rule 8：「四化必须标到天干 — 化禄/化权/化科/化忌 必须标注由哪个天干引出（**年干、命宫干、大限干、流年干**）」
- lib 真相（`/Users/jeffreyhu/DEV/ziwei-doushu/lib/ziwei/algorithm.ts:148-156`）：「**不再生成 daXians[].siHua / stemIndex / stemName**（飞星派字段已下线）」
- lib 真相（同上 `:159`）：「**宫干自化已下线**（倪师不主张飞星派宫干自化论）」
- gap-analysis 报告 `docs/ziwei-doushu-gap-analysis.md:24`：「algorithm.ts 主动下线了飞星派宫干自化、大限四化、来因宫」
- J叔笔记 `紫微斗数规则体系.md:371-601` 第八章 243 行：**专章讲飞星派** = J叔本人立场是两派联用

**伤害模式**：用户触发 Card 3 → ziwei-analyst 用 lib 排盘 → lib 数据里**根本没有 daXians[].siHua 字段** → agent 要么编（FATAL），要么交白卷。"标到大限干"在 lib 上做不到，因为 lib 把它去掉了。这是 paper feature——卡片承诺的能力，引擎物理拒绝提供。

**修复**：
- 选项 A：删除 Card 3、删除 Decision Rule 8 中"大限干、流年干"两项；明确"本 agent 受 lib 限制，只能输出年干四化，飞星派分析需另派"
- 选项 B：在 ziwei-analyst 接入"sihua.ts dead-code 抢救"管线——把 ziwei-doushu `sihua.ts` 里完整实现的 detectSelfSihua/getDaXianSiHua/findIncomingPalaces 在 agent 这一层重新串起来调用（gap-analysis Q2 已确认这些函数存在但 algorithm.ts 不调用它们）
- 选项 C：放弃 ziwei-analyst.md 走独立 agent 路径，直接让 J叔的飞星派分析继续走人脑+vault（短期保护战果），等 sihua.ts 集成方案设计好再说

---

### H-4【MEMORY 假象传染 / scout 已识别但 warden 未阻止】ziwei-analyst.md `skills: []` 仍然假设了"插件机制"

**文件:行**：
- `docs/ziwei-doushu-gap-analysis.md:38` 假设 C 判定：「MEMORY 写的「bazi-analyst 升级 = 双层结构（编排外壳 + yuan 插件）」，但实读 `/Users/jeffreyhu/.claude/agents/bazi-analyst.md` **没看到显式的 yuan 插件挂载点，agent 内 `skills: []` 是空的**。**MEMORY 描述与 agent 实际文件不一致**」
- `~/.claude/agents/ziwei-analyst.md:7`：`skills: []` ← 同样的空
- `~/.claude/agents/ziwei-analyst.md:380` 降级路径段：「Decision Rules 1/2/5/8、Anti-AI-Slop 1/5/7、Assertion 1/2/3/5 **全部可无损平移**」——这个"平移"假设依赖一个不存在的 plugin 装配机制

**伤害模式**：scout 已经在 H-4 这条上戳穿了"插件机制是 MEMORY 假象"，但 warden 造 ziwei-analyst 时**没有把这条警告内化**，依旧用了`skills: []`并写了"插件可塌缩"叙事。结果是新 agent 继承了同一个假象。下次J叔说"把 ziwei-analyst 塌缩成 bazi-analyst 的插件"，会发现根本没有 plugin 机制可塌。

**修复**：
- 在 `ziwei-analyst.md:380` 降级路径段加一句："塌缩前必须先派 meta-genesis + meta-artisan 设计 plugin 装配协议（当前 bazi-analyst.md skills: [] = 没有 plugin 接口），无 plugin 接口时本节是设想，不是路径"
- 或者：删除"降级路径"叙事，老实写"未来路径未定，待 J叔决策"

---

### H-5【ziwei-doushu 装备过程缺真正的 supply chain 审计】external-repo-equipper 自己造的 Decision Rule 2 没被本次执行遵守

**文件:行**：
- `~/.claude/agents/external-repo-equipper.md:115-121` Decision Rule 2：Supply Chain 审计四件套 + 「有问题必须 J叔确认接受风险，写入 MEMORY "已知风险" 段」
- `~/.claude/agents/external-repo-equipper.md:51` Never 段：「跳过 Supply Chain 审计直接 fork + symlink（**FATAL**，模式 N 内生性自恋）」
- ziwei-doushu **真实状态**（`/Users/jeffreyhu/DEV/ziwei-doushu/package.json`）：含 `"prepare": "husky"` lifecycle script（这是 husky 自动安装 git hooks，install 时会跑），含 17 个 runtime deps（@anthropic-ai/sdk / pg / ioredis / next 15 等）
- MEMORY 状态：当前 `MEMORY/` 目录下**没有** `ziwei-doushu-fork-2026-05-21.md` 或同类入档；没有 supply chain 审计记录
- gap-analysis Q5 推荐"phase1_dryrun"，但本次直接跳到了"造 agent"——跳过了 phase1

**伤害模式**：external-repo-equipper 这个 agent 是本次新造的，它自己的 Decision Rule 2 没在 ziwei-doushu 装备上跑——等于上岗第一单就违反自己写的纪律。`"prepare": "husky"` 不审 = 模式 K（内部冒充外部，开发环境≠交付环境）。

**修复（按 equipper 自己的 SOP 倒查）**：
- 立即跑 Decision Rule 2 四件套，把结果落到 MEMORY `/Users/jeffreyhu/.claude/projects/-Users-jeffreyhu-Obsidian-UncleJ-Dev/memory/ziwei-doushu-fork-2026-05-21.md`
- 明确说明 `prepare: husky` 的接受风险（J叔授权 or 在 fork 中删除该 lifecycle）
- 在 MEMORY 标注此次"先造 agent 后审"违规，作为模式 N 的本地证据沉淀

---

## 3. MEDIUM（建议修，5 条）

### M-1【scout 报告 SylarLong 维护混淆】实测 iztro-py 上游是 spyfree 不是 SylarLong

**文件:行**：
- `docs/ziwei-doushu-gap-analysis.md:54`：「iztro-py 排盘核：第三方上游，更新由 SylarLong 一人维护（npm 单一 maintainer）」
- `docs/ziwei-doushu-gap-analysis.md:139` Step 0：「iztro 单一 maintainer」
- **实测**：`/Users/jeffreyhu/.local/share/uv/tools/mingli-mcp/lib/python3.11/site-packages/iztro_py-0.3.4.dist-info/METADATA`：
  ```
  Project-URL: Homepage, https://github.com/spyfree/iztro-py
  Author: iztro-py Contributors
  ```
- **实测**：`mingli_mcp-1.0.16.dist-info/METADATA`：
  ```
  Author-email: spyfree <srlixin@gmail.com>
  Project-URL: Repository, https://github.com/spyfree/mingli-mcp
  Requires-Dist: iztro-py>=0.3.4
  ```
- 真相：npm 的 `iztro` 是 SylarLong 维护；Python 的 `iztro-py` 是 **spyfree 单独维护**的 port，作者跟 mingli-mcp 同一人，**不是 SylarLong**。

**伤害模式**：scout 把两个上游搅在一起了。**结论本身（同人共上游路径）大方向对**（两边都用 SylarLong 的算法蓝本，输出应一致），但维护者署名 attribution 错了——对 supply chain 单点风险判断有影响：**真正的单点风险源是 spyfree**（mingli-mcp 作者 + iztro-py 作者**同一人**），不是 SylarLong（只维护 npm 包）。

**修复**：
- 在 `docs/ziwei-doushu-gap-analysis.md:54, 139` 把"SylarLong"改成"spyfree（iztro-py 维护者，同时也是 mingli-mcp 作者；两个包共上游 SylarLong/iztro npm 包的算法定义）"
- 单点风险定性应升级：spyfree 一人既写 MCP 又写 Python port = 端到端单点风险，比 scout 报告写的"npm 单点"更严重

---

### M-2【主 session 应自核 scout 的 [unverified] 但未做】

**文件:行**：
- 任务派单原文（你给我的）P0 #3：「scout 2 说 mingli-mcp 也调 iztro-py（同人 Python port），但主 session 用 find 命令本地核实失败标了 [unverified]。**你必须重新核实**」
- 本 review 已核实：iztro-py-0.3.4.dist-info **真实存在**于 mingli-mcp 安装包内（path: `/Users/jeffreyhu/.local/share/uv/tools/mingli-mcp/lib/python3.11/site-packages/iztro_py-0.3.4.dist-info`），scout 的"装它不补排盘"推断**成立**。
- 主 session 当时 find 失败的可能原因：命令工作目录在 mingli-mcp 源码 repo 而不是 uv tool 安装位置，没找到是因为找错地方

**伤害模式**：scout 推断 + warden 决策都依赖"mingli-mcp 共用 iztro 上游"这条事实，warden 在没复核成功的情况下就推进到 Agent 落地。如果今天 prism 核实失败，整个推断链就崩了——所幸事实是对的，但流程漏洞依然存在（模式 F 信任上游 / 模式 C 偷懒）。

**修复**：
- 在 `docs/ziwei-doushu-gap-analysis.md:22, 234` 把 `[unverified]` 升级为 `[verified by meta-prism 2026-05-21, path: /Users/jeffreyhu/.local/share/uv/tools/mingli-mcp/lib/python3.11/site-packages/iztro_py-0.3.4.dist-info]`
- 主 session 下次遇到 [unverified] 必须自核或派 prism，不允许标注后继续推进

---

### M-3【ziwei-analyst status=draft 防误调机制不足】description 触发词是 generic 紫微关键词

**文件:行**：
- `~/.claude/agents/ziwei-analyst.md:3`：description 包含通用触发词 `紫微、紫微斗数、ziwei、紫微排盘、紫微解读、十二宫、四化、大限`
- `~/.claude/agents/ziwei-analyst.md:10`：`status: draft`
- `~/.claude/agents/ziwei-analyst.md:54` Never 段：「不未验证擅自上线 — 引擎未过 xuanxue-chart-validator，本 agent 永远 status=draft，**不接入生产对外服务链路**」
- 但 capability-index 匹配是按 description 关键词的，**status=draft 字段对 dispatcher 不可见**

**伤害模式**：J叔随口说"看下我儿子的紫微盘"→ 主 session 走 capability-first 检索 → 命中 ziwei-analyst.md description → dispatch → ziwei-analyst 一路走完七步流程吐出 draft 警告但还是产了出。J叔以为"draft 警告 = 仅供调试"，但内容已经写进 `14-玄学/04-我的盘/<人名>-紫微.md` 落地为生产资产。**status=draft 是 frontmatter 字段，不是 dispatch gate**。

**修复**：
- 在 ziwei-analyst description 前面加显式前缀，例如："**[DRAFT - 未上膛，主 session 不要自动 dispatch，需 J叔显式 @ziwei-analyst 才调用]** 紫微斗数专职..."
- 或者：把 capability-index 加一个 `dispatchable: false` 字段（如果该字段不存在则要造），由 capabilityState 层硬拦截
- 或者：在 ziwei-analyst.md 顶部加 Hook 指令，让 PreToolUse 检查 status=draft 时 BLOCK 写文件操作

---

### M-4【Scout 数据集判断过于保守 / 漏分析授权状态】H3 "数据集协议未明示" 没给 J叔实际操作指引

**文件:行**：
- `docs/ziwei-doushu-gap-analysis.md:170` H3：「License = MIT (algorithm) + 数据集协议未明示 → Sentinel 单独审 Releases v3.0-samples 是否带 LICENSE」
- 但 gap-analysis 同时说 `B3 不下载`，那么"下载前审"和"决定不下载"逻辑上不必同时存在
- gap-analysis 没说清"如果决定不下载，H3 是否还成立"

**伤害模式**：J叔回看时不知道是要"先审协议再下载"还是"决定不下载就不用审了"。两条互相冲突的指引同时存在。

**修复**：
- 在 H3 后面加补丁：「**与 B3 互锁**：若执行 B3（不下载），H3 不需审；若未来要下载，必须先 Sentinel 审 + J叔授权」

---

### M-5【Validator Agent Card 1 Few-Shot 引用 GAP-2 时仍是 pending 状态】"建议接受新版输出"暗示了实际上未审过的决策

**文件:行**：
- `~/.claude/agents/xuanxue-chart-validator.md:372` Few-Shot Q1：「Q1：命宫丁卯 vs 丙寅，本系统取哪个？（**建议 J叔倾向引擎输出 = 丙寅**，理由：引擎采新版起例，但需 J叔确认旧版来源是否可靠）」
- `12-Meta_J/tests/xuanxue/known-charts.yaml:355-360` GAP-2：「紫微命宫存疑（旧版丁卯 vs 新版丙寅）...not_blocking」
- MEMORY `xuanxue-p1-upgrade-2026-04-03.md:55-58` + `job-hunt-5lines-launch-2026-05-18.md` 等多处：J叔已倾向丁卯（自己排过两份飞星报告都用了丁卯）

**伤害模式**：Validator agent 的 Few-Shot "建议倾向丙寅"，但 J叔之前的笔记倾向丁卯。Few-Shot 的"推荐方向"不只是技术指引，会变成 J叔回看时的认知锚定。Validator agent 自己的 Decision Rule 3 是"差异即升级，不替 J叔选锅"——但 Few-Shot 自己破了这条规矩，给了倾向性建议。

**修复**：
- 在 `xuanxue-chart-validator.md:372` 把"建议 J叔倾向引擎输出 = 丙寅"改成"**两种可能解释**：新版起例 vs 旧版口径，需 J叔人审决策。J叔历史笔记倾向丁卯（见 `J叔紫微斗数盘.md:26` + `J叔一生全景-飞星修正版.md:9`）"——展示双方证据，**不下倾向**

---

## 4. 必杀建议（如果 J叔只能动一处）

**动 C-1：撤掉独立 ziwei-analyst.md，走 gap-analysis Q5 推荐的 (b)+(c) 混合方案**。

理由：
1. C-1 解了之后，**H-1 自动消失**（无独立 agent → 无 trigger 重叠）
2. C-2 风险降级：Few-Shot 错误的 lib 调用代码不会再被人无意中跑
3. C-3 不直接解但暴露程度变小（fixture 是 J叔的工程资产，validator 是质检员，没有 ziwei-analyst 之后 validator 还能管别的引擎）
4. H-3 自动消失（无独立 ziwei-analyst → 无 Card 3 paper feature）
5. H-4 自动消失（无 ziwei-analyst → 无插件假象传染）
6. M-3 自动消失（无 draft agent → 无 generic trigger 误调风险）

执行步骤：
```bash
# 1. 删除独立 agent 投影
rm /Users/jeffreyhu/.claude/agents/ziwei-analyst.md
# 检查 codex 端有没有同步落地（应该没有，但保险起见）
ls /Users/jeffreyhu/.codex/agents/ziwei-analyst.toml 2>/dev/null && rm /Users/jeffreyhu/.codex/agents/ziwei-analyst.toml

# 2. 在 gap-analysis 上加一条 J叔决策记录
# （在 docs/ziwei-doushu-gap-analysis.md 末尾追加"决策记录"段，标明 J叔采纳 (b)+(c)）

# 3. 单独处理剩余的 H/M 项（C-3 fixture / H-2 production_eligibility / H-5 supply chain audit）
# 这三条不依赖 ziwei-analyst 存在与否，独立修复
```

如果 J叔决定**保留**独立 ziwei-analyst（覆盖 scout 建议），那必须在 ziwei-analyst.md 顶部加 admonition 明示与 scout 建议冲突的理由，并同步修改 bazi-analyst.md description 删除"紫微斗数"OWN——但这条路径增加 H-1 解决工作量，不推荐。

---

## 5. Verification Closure Packet

| Finding | severity | fixEvidence required | closeFindings status |
|---------|----------|----------------------|---------------------|
| C-1 | CRITICAL | 删除 ziwei-analyst.md 的 ls 验证 + gap-analysis 决策记录 grep | **open** |
| C-2 | CRITICAL | Few-Shot 修正后的实跑 stdout 截图 OR ziwei-analyst.md 已删除 | **open** |
| C-3 | CRITICAL | known-charts.yaml chart1/chart3 `pending_user_confirmation` 改 true OR audit_metadata 真实填充 J叔签字 | **open** |
| H-1 | HIGH | bazi-analyst.md description 与 ziwei-analyst.md description 触发词无重叠 grep | **open** |
| H-2 | HIGH | bazi-analyst.md Decision Rules 加 engine-registry 比对 OR PreToolUse hook 上线 | **open** |
| H-3 | HIGH | ziwei-analyst.md Card 3 删除/重写，Decision Rule 8 中"大限干/流年干"移除 OR ziwei-analyst.md 已删除 | **open** |
| H-4 | HIGH | ziwei-analyst.md `:380` 降级路径段加 plugin 机制缺失警告 OR ziwei-analyst.md 已删除 | **open** |
| H-5 | HIGH | MEMORY/ziwei-doushu-fork-2026-05-21.md 落档，含 supply chain 四件套结果 | **open** |
| M-1 | MEDIUM | gap-analysis SylarLong→spyfree 改写 | **open** |
| M-2 | MEDIUM | gap-analysis [unverified] 升级为 [verified] | **open** |
| M-3 | MEDIUM | ziwei-analyst description 前缀加 DRAFT OR ziwei-analyst.md 已删除 | **open** |
| M-4 | MEDIUM | gap-analysis H3 与 B3 互锁注释 | **open** |
| M-5 | MEDIUM | xuanxue-chart-validator.md Few-Shot Q1 倾向性去除 | **open** |

**verificationState = incomplete**：13/13 findings 全部 open，无 fixEvidence。

---

## 6. Eval Critique（评估自反思）

按 Prism 协议自检本次评估标准本身：

1. **是否有 PASS 的 weak assertion?**
   - 本次没有标 PASS 的 assertion；FAIL 信度高（每条都有 file:line）
2. **是否有 coverage gap?**
   - 漏审：ziwei-analyst.md 的 SOUL 八模块完整性（按 meta-genesis 标准）—— 本次审核重在"事实正确性"+"内部一致性"，没审"agent 是否结构合规"。如果 J叔需要 SOUL 体检请追派
   - 漏审：external-repo-equipper.md 自己的 SOUL 八模块（同上）
   - 漏审：xuanxue-chart-validator.md 的 Module 9/10 设计是否过度（10 项 self-audit 是否冗余）
3. **是否有 unverifiable assertion?**
   - 无。所有 P0/P1 都给了 file:line + grep/cat 证据可重现
4. **本次审核可能产生的 False Confidence?**
   - C-1 if J叔决定走"保留独立 agent"路径，本 review 的"删除"建议会让 J叔以为我反对独立 agent 本身——其实我反对的是"内部矛盾未声明"。J叔决定要独立 agent 完全合法，只要明示覆盖 scout 建议即可

---

**Prism Verdict 最终一句**：5 路 sub-agent 产出在中下层（fixture / equipper SOP / validator 框架）质量合格，**上层综合判断（独立 agent vs 注入）出了系统性矛盾**，下游执行细节（Few-Shot 代码）出了 SLOP-07 fabricated data。13 条问题修完才能进 Verification Gate。建议必杀 C-1。
