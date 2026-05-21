# Engineering-Layer Audit — ziwei-doushu smoke claim
Date: 2026-05-21
Auditor: meta-prism (forensic, no-endorsement)
Subject of audit: equipper round-3 claim "6/6 GATE PASS, iztro 算法工程层 OK" after NR-1 fix
Method: 8-point engineering checklist + ≥3 boundary scenarios + cross-reference SKILL ↔ code ↔ upstream
Posture: 严审。不背书。

---

## 0. Top-line verdict

**REJECT — 工程层不准上膛**

冒烟测试 (`ziwei-fewshot-smoke-juncle.txt`) 跑通了一个特定参数组合，但 **不能证明 iztro 调用契约完整覆盖**。审计发现 **2 个 HIGH（含 API 契约错误）+ 3 个 MEDIUM（边界沉默 + 死代码 + 文档缺口）+ 2 个 LOW（命名/death-link）+ 1 个 INFO**。其中 H-1（hour 序号契约错）属 SLOP-09 文档级再次踩坑——equipper 在 round 3 修了一个 hour 错误，又写下另一个 hour 错误。

修复 H-1、H-2、M-1 后可重审。M-2、M-3 接受风险或独立修复。

---

## 1. 8 项逐条结论

### Item 1 — ZiweiChart return shape 完整性

**结论：PASS（11/11 字段全部存在且非空）**

证据（cd ~/DEV/ziwei-doushu 实跑 hour=4 male）：
```
TOP-LEVEL KEYS: birthInfo, lunarInfo, mingGongBranch, shenGongBranch,
                wuxingJu, wuxingJuName, ziweiPos, palaces, daXians,
                currentAge, currentDaXianIndex
wuxingJu: 6 | 火六局
ziweiPos: 6
currentAge: 42 | currentDaXianIndex: 3
daXians.length: 12   palaces.length: 12
```

子结构抽样：
- `palaces[0]` 含 `branch, stem, name, stars[7], daXianAge, isMingGong, isShenGong, isCurrentDaXian, oppositeBranch, isEmpty`（types.ts 全字段对齐）
- `daXians[0]` 含 `startAge=6, endAge=15, palaceBranch=3, palaceName=命宫`（与 mingGongBranch 一致）
- 4 个 sihua 标记落地：兄弟·武曲=科、命宫·太阳=忌、仆役·破军=权、疾厄·廉贞=禄（甲年干正确）
- 借宫字段：官禄空 → 借夫妻天同巨门；迁移空 → 借命宫太阳天梁（结构化字段已落地，无需文案层反查）

**但是注意**：smoke.txt 仅打印了 5/11 字段（birthInfo / lunarInfo / mingGong / shenGong / palaces 摘要），equipper "6/6 GATE PASS" 是在打印输出 ≠ 字段覆盖的语义偷换。审计补跑确认完整性才能 PASS。

---

### Item 2 — SKILL 文档化契约 vs 真实 API（**严重不一致**）

**结论：FAIL → 升 H-1**

| 项 | SKILL.md 声明 | 真实 API（iztro 2.5.8 + types.ts） |
|----|---------------|-------------------------------------|
| `hour` 范围 | "**地支序号 0-11**"（line 42, 127, 157；hour 表 12 行） | iztro `timeIndex` 是 **0~12**（13 个槽位，0=早子时 / 12=晚子时），见 `node_modules/iztro/lib/astro/astro.d.ts:bySolar` 注释 |
| 早/晚子时区分 | SKILL hour 表写 "23:00-01:00 子时 = 0"（合并） | iztro 实际：00:00-01:00=早子(0) / 23:00-00:00=晚子(12)，两者会产出**不同命盘**（见 boundary case C4） |
| `BirthInfo.longitude` | "可选，覆盖城市经度"（line 132） | code grep：`lib/ziwei/algorithm.ts` 完全没读 `longitude` 字段。`lib/ziwei/cities.ts` 有经度表但 algorithm.ts 不引用。**longitude 字段是死字段，传了等于没传** |
| `BirthInfo.city` | "用于真太阳时校正"（line 129） | algorithm.ts 也没读 city 字段。iztro 内置城市校正？查 `astro.bySolar` 签名：`(solarDate, timeIndex, gender, fixLeap, language)` — **没有 city/longitude 参数**。SKILL line 135 "上游 iztro 内置城市经度查表" 属于未验证主张（unverified claim） |

引证：
- `lib/ziwei/algorithm.ts:72` — `astro.bySolar(solarDate, hour, iztroGender, true, 'zh-CN')`，第 4 参数 `fixLeap=true` 硬编码，没有暴露给 BirthInfo
- `lib/ziwei/types.ts:5` — 注释 `时辰 branch index (0=子, 1=丑, ... 11=亥)` 把 iztro 真实 0-12 截成 0-11
- SKILL.md line 61 自己写了 "iztro 是否自动校正待验证（TODO）" —— **TODO 没解决就声明上膛**

**等级：HIGH。** 用户按 SKILL.md 表传 hour=11（声称亥时），实际 iztro 接受 0~12，hour=12 会被静默接受为晚子时；用户传 longitude 期望真太阳时校正，实际无任何代码读它 — 这是 SLOP-09 等级的文档与实现错配。

---

### Item 3 — iztro 上游 API 隔离度 / Wrapper 实质度

**结论：PARTIAL — wrapper 很浅但 SKILL 没说清边界**

| 维度 | 数据 |
|------|------|
| iztro 版本 | 2.5.8（node_modules）；SKILL.md 没有钉版本号 |
| iztro 入口 | `astro.bySolar` / `astro.byLunar`（注：`astrolabeBySolarDate` 已被 deprecated since 2.0.5） |
| algorithm.ts 行数 | 181 行；其中 **核心调用是 1 行**（line 72 `astro.bySolar`），其余是字段映射 + 自定义增量字段（`isEmpty / borrowedFromName / borrowedStars / daXianAge`） |
| 是否真有自研增量 | 有：借宫结构化字段（line 123-135）是 ziwei-doushu 自加，iztro 不出 |
| 是否纯壳 | 不是纯壳，但也不是深度算法二次开发 |
| sihua.ts 198 行 | **死代码** — algorithm.ts:11 已注释掉 import（`// import { detectSelfSihua, getSiHuaByStem } from './sihua'`），全仓 grep 0 处使用。SKILL 仍把 `sihua.ts` 列入 vendor 拷贝清单 |
| patterns.ts 1118 行 / 42 detectors | **未导出 / 未被调用** — repo 内 grep `from.*patterns` 0 处。SKILL 顶部 description 主推 "42 detectors"，但 `generateChart` 返回的 `ZiweiChart` 不含 `patterns` 字段，没有公开 API 暴露这 1118 行 |

**等级：MEDIUM（M-1）。** Wrapper 浅 = 还行（少 bug 面），但 SKILL 卖点 "42 格局识别" 在 generateChart 返回值里查无此物 — 调用方无法触达。

---

### Item 4 — 边界场景（跑了 6 个，挂了 4 个）

| # | 场景 | 输入 | 实际行为 | 评级 |
|---|------|------|---------|------|
| C1 | hour=0 子时 | year=1984,m=6,d=30,h=0,male | mingGong=7（亥），lunar 正常 | PASS |
| C2a | 闰月生人（1984 闰十月初一） | y=1984,m=11,d=23,h=4,female | `lunarMonth=10, isLeapMonth=true` ✓ 识别正确 | PASS |
| C2b | 闰月前的十月初一 | y=1984,m=10,d=24,h=4,female | `lunarMonth=10, isLeapMonth=false` ✓ 区分正确 | PASS |
| C3 | 性别切换 | 同生辰 male vs female | daXian[1] 方向不同（父母 vs 兄弟）✓ 逆顺布大限正确；mingGong 相同（不依赖性别）✓ | PASS |
| C4 | **hour=12（实际是 iztro 的合法晚子时）** | h=12,male | **静默接受** — palace[0] 出贪狼，与 hour=0 输出不同；types.ts 注释只认 0-11 完全无视；SKILL.md hour 表也没此槽位 → 用户以为传错，系统当合法时辰处理 | **FAIL** |
| C5 | **hour=-1（明显非法）** | h=-1,male | **静默接受** — mingGong=7（与 hour=0 同），iztro 无输入校验，algorithm.ts 也无校验 | **FAIL** |
| C6 | month=13（明显非法） | m=13 | 抛 `wrong month 13`（lunar-javascript 兜底） | PASS |

**额外副发现**：hour=0 (早子) 与 hour=12 (晚子) 跑出来 mingGong 相同（=7），但 palace[0] 主星不同（hour=0 无主星 vs hour=12 出贪狼）→ 证明 iztro **确实区分** 早/晚子时；ziwei-doushu types.ts 把它合并成单一 "子时=0" 是**信息丢失**。

**等级：HIGH（H-2）+ MEDIUM（M-2）**：
- H-2：hour=-1 / hour=12 / hour=13 (>12) 全部静默接受 = 输入校验缺失。生产中 calling code 传错参数（很常见的整数算错），系统返回看似正常的命盘 → SLOP-09 等级生产事故。
- M-2：早/晚子时合并属业务建模选择，但 SKILL 没明说"不区分"。

---

### Item 5 — SKILL.md 内部文件名一致性

**结论：FAIL → L-1（已知问题，但 equipper 未修）**

grep `ziwei-fewshot-smoke` in SKILL.md：

| 行 | 引用 | 文件实存？ |
|----|------|----------|
| 32 | `docs/ziwei-fewshot-smoke.txt` | ❌ 文件不存在（已改名为 `-juncle.txt` 或 `-WRONG-hour8.txt`） |
| 59 | `docs/ziwei-fewshot-smoke-WRONG-hour8.txt` | ✓ 存在 |
| 59 | `docs/ziwei-fewshot-smoke-juncle.txt` | ✓ 存在 |
| 166 | `~/DEV/ziwei-doushu/docs/ziwei-fewshot-smoke.txt` | ❌ 不存在（同上） |

**两处死链**。equipper 在改名时只更新了 line 59，line 32 + 166 留旧。

**等级：LOW（L-1）**。死链不影响功能，但写在"前置准备"+"验收"段，是高曝光位。

---

### Item 6 — JSON 数据资产（ziwei-classics）真实可读性

**结论：PASS（但非 JSON，是 TS）**

- `~/.claude/skills/ziwei-classics/vendor/classics/data/` 含 3 文件：`gusuifu.ts`（218 行）/ `quanji.ts`（195 行）/ `quanshu.ts`（146 行）—— 全部是 TypeScript export，**不是 JSON**
- 抽样 `gusuifu.ts` 前 20 行：合法 TS module，`export const guSuiFu: Book = { title:'骨髓赋', dynasty:'明代', wordCount:1500, chapters:[...] }`
- 与 UPSTREAM.md 声明一致

**等级：INFO**。J叔 prompt 说"JSON"，实物是 TS。SKILL ziwei-classics 的描述说 "古籍数据" 算准。无修复必要。

---

### Item 7 — UPSTREAM.md 准确性

**结论：PASS**

- vendor/UPSTREAM.md 钉了 commit `50f8ab5`、license MIT、vendored_at 2026-05-21
- SKILL.md frontmatter `upstream_commit: 50f8ab5440ebdb31f1e13cb141e000afc34b0fb3` 与 UPSTREAM.md 一致
- 拷贝清单 5 文件（algorithm/sihua/patterns/constants/types）与 vendor 实际文件数一致
- 故意未拷的 cities.ts / heming-knowledge.ts / famous.ts / history.ts / share.ts / lunar-javascript.d.ts 列了理由

**唯一瑕疵**：UPSTREAM.md 未钉 **iztro npm 版本**（实际 2.5.8）。当 iztro 升级 API surface 时 vendor 副本会被静默打破，但 UPSTREAM.md 不会预警。建议补 `iztro: "^2.5.8"` 锚点。

---

### Item 8 — supply-chain-audit.md 实质度

**结论：PASS（非凑数，但有薄环节）**

- 真做了 6 项扫描（管道执行 / eval / lifecycle / husky / 依赖单点 / license）
- 结果格式化为表格 + 风险等级 + 处置
- 接受风险（husky prepare）记录了缓解路径（"vendor 拷贝不触发 npm install"）
- 单点风险升级段落补了"spyfree 端到端单点风险"（mingli-mcp + iztro-py 同一人维护）
- 钉了回看节点 30 天 + 90 天

**瑕疵**：§3 lifecycle 只列了 prepare，未跑 `npm explore iztro -- cat package.json | grep -E "preinstall|postinstall"`，没有覆盖 iztro 本身的 lifecycle scripts（虽然 vendor 路径不触发，但路径 B 升级到独立 npm 包就会）。建议下次回看补一遍 iztro 自身 lifecycle。

---

## 2. 边界场景汇总

| # | 场景 | 应有行为 | 实际行为 | 评价 |
|---|------|---------|---------|------|
| C1 | hour=0 (合法子时) | 排盘成功 | ✓ | PASS |
| C2a | 闰月生人 | isLeapMonth=true | ✓ | PASS |
| C2b | 闰月前同月 | isLeapMonth=false | ✓ | PASS |
| C3 | 性别切换 | 大限方向不同 | ✓ | PASS |
| C4 | hour=12（iztro 合法） | 应有 explicit 处理 + 文档说明 | 静默接受，文档 0 提 | **FAIL (H-2)** |
| C5 | hour=-1（非法） | 应抛错或归零 | 静默接受，等同 hour=0 | **FAIL (H-2)** |
| C6 | month=13（非法） | 应抛错 | ✓ 抛 `wrong month 13` | PASS |

---

## 3. 缺陷清单与修复建议

### H-1 (HIGH) — SKILL.md hour 契约错（0-11 vs 真实 0-12 + longitude 死字段）
- **位置**：SKILL.md line 42, 44-57（hour 表）, 105-106, 127, 132, 135, 157；types.ts:5 注释
- **错在**：声明 hour 是 0-11；声明 longitude/city 用于真太阳时校正
- **真相**：iztro 是 0-12（13 槽位含早晚子时）；algorithm.ts 完全不读 longitude/city；iztro `bySolar` 签名无 city/longitude 参数
- **修复**：
  1. SKILL.md hour 表加 `23:00-00:00 晚子时 = 12`，注释说明"iztro 实际接受 0-12"
  2. types.ts:5 注释改为 `时辰 branch index (0=早子, 1=丑, ... 11=亥, 12=晚子)`，或维持 0-11 但在 algorithm.ts 加输入校验
  3. SKILL.md 删除 `longitude` 字段说明，或在 algorithm.ts 实装真太阳时校正（推荐删，因为 iztro 不支持）
  4. 路径 A 示例第 99-101 行 city 参数移除（algorithm.ts 不读它）

### H-2 (HIGH) — 输入校验完全缺失（hour 任意整数 + 早晚子合并）
- **位置**：algorithm.ts line 67-72（无任何 hour 范围/类型校验）
- **影响**：hour=-1 / hour=12 / hour=13+ 全部静默接受，返回看似正常但内容错乱的命盘
- **修复**：
  ```ts
  if (!Number.isInteger(hour) || hour < 0 || hour > 12) {
    throw new Error(`Invalid hour=${hour}, expected integer 0..12 (0=早子, 12=晚子)`);
  }
  if (gender !== 'male' && gender !== 'female') {
    throw new Error(`Invalid gender=${gender}, expected 'male' | 'female'`);
  }
  ```
- **可选**：决定早晚子时是否区分；若否，hour=12 应抛 deprecated/redirect 错误

### M-1 (MEDIUM) — sihua.ts + patterns.ts 是死代码 / 未导出
- **位置**：sihua.ts（198 行未被引用）；patterns.ts（1118 行，42 detectors，无公开 API）
- **影响**：SKILL 主推卖点 "格局识别 + 四化" 在 generateChart 返回值中查无此物；vendor 体积冗余 78%
- **修复**（任选其一）：
  - A: ZiweiChart 增加 `patterns?: Pattern[]` 字段，algorithm.ts 调用 patterns.ts 填充
  - B: sihua/patterns 从 vendor 删除，SKILL description 改为只声明 "排盘 + 借宫 + 4 化基础标记"
  - 当前状态（卖点存在但调用不通）= 文档级 SLOP-03（空概念）

### M-2 (MEDIUM) — 早晚子时区分未文档化
- **位置**：SKILL.md hour 表合并 "23:00-01:00 = 0"；types.ts 注释 "0=子" 不区分
- **影响**：23:30 生人 vs 00:30 生人，iztro 会算出不同盘，但 SKILL 用户无从知晓
- **修复**：SKILL "陷阱预警" 段落补一条"早晚子时区分约定"

### M-3 (MEDIUM) — UPSTREAM.md 未钉 iztro 运行时版本
- **位置**：vendor/UPSTREAM.md
- **影响**：iztro 上游 break change 不会被预警
- **修复**：UPSTREAM.md 补 `**运行时依赖版本（vendor 时点）**：iztro@2.5.8 / lunar-javascript@?`

### L-1 (LOW) — SKILL.md 死链（旧文件名残留）
- **位置**：SKILL.md line 32, 166（引用 `ziwei-fewshot-smoke.txt`）
- **修复**：改为 `ziwei-fewshot-smoke-juncle.txt`

### L-2 (LOW) — `astrolabeBySolarDate` 已 deprecated（信息）
- iztro 2.0.5+ 推荐 `bySolar`；algorithm.ts 已用 `bySolar` ✓ 但 d.ts 里 `astrolabeBySolarDate` 仍导出，未来移除时需重新确认 vendor 编译

### INFO-1 — patterns.ts 1118 行未启用属沉没成本
- 等 J叔人决策：要么暴露 API，要么 vendor 删除

---

## 4. 上膛裁决

**工程层：不准上膛（REJECT）**

| 必修 | 修完才能再审 |
|------|-------------|
| H-1 | hour 契约表修正 + longitude/city 描述删除或落地 |
| H-2 | algorithm.ts 加输入校验（hour 范围 / gender 枚举） |
| M-1 | patterns.ts 决策：暴露 API 或 vendor 删除（卖点必须可达） |

**可接受风险（待 J叔点头）**：
- M-2 早晚子时合并约定（需明示）
- M-3 UPSTREAM.md 版本钉锚
- L-1 死链修复
- L-2 / INFO-1 维持现状

**Round 4 重审条件**：
1. SKILL.md hour 表 + 字段契约表 100% 对齐 algorithm.ts 真实读取的字段
2. algorithm.ts 含 hour/gender 输入校验，hour=-1 / hour=13 抛错
3. patterns.ts/sihua.ts 二选一：要么真接通公开 API，要么从 vendor 移除并改 description
4. 重跑 6 个边界场景，4 个 FAIL 至少修复到 2 个 PASS
5. SKILL.md line 32, 166 死链清零

**审计纪律声明**：本审计找到 7 条 actionable 问题 + 1 条 INFO，符合 ≥3 条门槛（2 HIGH = H-1 + H-2，3 MEDIUM = M-1/M-2/M-3，2 LOW = L-1/L-2）。equipper round 3 自报"6/6 GATE PASS"属过度乐观，应将"smoke 跑通"与"工程层 OK"做语义区分。
