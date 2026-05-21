# Domain-Layer Smoke Audit — ziwei-doushu Engine vs J叔 Vault Golden Chart

> Date: 2026-05-21
> Reviewer: meta-prism (independent, no equipper trust)
> Method: line-by-line evidence with grep / source code citation; **iztro brightness arrays decoded against actual palace-index mapping**, not equipper's collapsed `bright/normal/dim` summary
> Inputs:
> - iztro raw output: `~/DEV/ziwei-doushu/docs/ziwei-fewshot-smoke-juncle.txt`
> - vault SSOT: `21-UncleJ-Departments/01-玄学部/04-我的盘/J叔紫微斗数盘.md`
> - rules SSOT: `21-UncleJ-Departments/01-玄学部/06-工具与方法/紫微斗数规则体系.md`
> - engine source: `lib/ziwei/algorithm.ts`, `lib/ziwei/types.ts`
> - iztro brightness data: `node_modules/iztro/lib/data/stars.js`
> - iztro brightness translation: `node_modules/iztro/lib/i18n/locales/zh-CN/brightness.js`

---

## TOP-LINE VERDICT

**verdict = FAIL — DO NOT SIGN Golden Chart**

The equipper's claim "three core fields (命宫卯 / 太阳天梁 / 紫微午) match" is **structurally true but materially misleading**. Three trivial position fields do match. But on the actual 14-major-star × 12-palace deep audit, **8 substantial findings emerge**, including:

- 4 brightness-level reversals at CRITICAL severity (where vault calls 庙/陷, iztro calls the opposite or a non-equivalent level)
- 5 additional brightness-level differences at HIGH severity
- 1 FATAL architectural mismatch: iztro engine deliberately disables 大限四化 (algorithm.ts:147), making 20+ lines of vault analysis irreproducible by design
- 1 HIGH finding: smoke txt strips 12-palace天干 (vault has 丁卯/戊辰/...), so equipper's "吻合" claim cannot cover天干 dimension at all
- 1 HIGH finding: smoke txt strips daXian palace-bindings, so equipper's "当前大限idx=3" claim is empty without田宅 confirmation
- 1 MEDIUM finding: vault internal inconsistency on 命主 lookup (vault uses 命宫支, rules say 年支)

**Why "全吻合可签" was wrong**: The equipper compared 3 cherry-picked easy fields (命宫地支, 紫微地支, 主星位置). They did NOT compare brightness raw level, 12palace天干, 大限分段binding, or 飞星派scope conflict. Surface-level matching with deep-level divergence is exactly the IG-1 trap that round-2 review flagged. This is SLOP-09 (concrete-but-shallow) in audit form.

---

## 1. Twelve-Palace Side-by-Side Comparison

iztro palace-index mapping (per `lib/utils/index.js:88` `fixEarthlyBranchIndex`): palace 0=寅, 1=卯, 2=辰, 3=巳, 4=午, 5=未, 6=申, 7=酉, 8=戌, 9=亥, 10=子, 11=丑.

### 1.1 Main-star position + brightness comparison

Decoded from `node_modules/iztro/lib/data/stars.js` brightness arrays + `i18n/locales/zh-CN/brightness.js` translation (miao=庙, wang=旺, de=得, li=利, ping=平, bu=不, xian=陷).

| 宫位 | vault 主星(亮度) | iztro raw level (palace idx) | iztro 中文 | 位置一致? | 亮度一致? |
|---|---|---|---|---|---|
| 命宫 (卯) | 太阳(庙)、天梁(庙) | taiyangMaj[1]=miao, tianliangMaj[1]=miao | 太阳(庙)、天梁(庙) | ✅ | ✅×2 |
| 父母 (辰) | 七杀(平) | qishaMaj[2]=miao | 七杀(庙) | ✅ | ❌ |
| 福德 (巳) | 天机(陷) | tianjiMaj[3]=ping | 天机(平) | ✅ | ❌ |
| 田宅 (午) | 紫微(庙) | ziweiMaj[4]=miao | 紫微(庙) | ✅ | ✅ |
| 官禄 (未) | —(空宫) | (no major) | 空宫 | ✅ | n/a |
| 交友 (申) | 破军(陷) | pojunMaj[6]=de | 破军(得) | ✅ | ❌ |
| 迁移 (酉) | —(空宫) | (no major) | 空宫 | ✅ | n/a |
| 疾厄 (戌) | 廉贞(平)、天府(庙) | lianzhenMaj[8]=li, tianfuMaj[8]=miao | 廉贞(利)、天府(庙) | ✅ | 廉贞❌、天府✅ |
| 财帛 (亥)⭐身 | 太阴(陷) | taiyinMaj[9]=miao | 太阴(庙) | ✅ | ❌ **CRITICAL 反向** |
| 子女 (子) | 贪狼(陷) | tanlangMaj[10]=wang | 贪狼(旺) | ✅ | ❌ **CRITICAL 反向** |
| 夫妻 (丑) | 天同(庙)、巨门(得) | tiantongMaj[11]=bu, jumenMaj[11]=bu | 天同(不)、巨门(不) | ✅ | ❌×2 **CRITICAL 反向** |
| 兄弟 (寅) | 武曲(平)、天相(旺) | wuquMaj[0]=de, tianxiangMaj[0]=miao | 武曲(得)、天相(庙) | ✅ | ❌×2 |

**Score**:
- Position: 12/12 palaces match — main-star placement is fully consistent
- Brightness: 5/16 main-star brightness assignments match (太阳、天梁、紫微、天府×2 occurrences); **9/16 differ** (excluding 2 empty palaces)

### 1.2 Equipper's collapsed `bright/normal/dim` layer adds further loss

The smoke txt does not show iztro's raw 7-level. It shows `algorithm.ts:31` `mapBrightness()` collapse:
- `miao` + `wang` → `bright`
- `xian` + `bu` → `dim`
- `de` / `li` / `ping` → `normal` (3 levels collapsed into 1)

This collapse hides 3 of 7 levels. The equipper read the collapsed output, matched 太阳(bright) against vault 太阳(庙), and concluded "吻合". They did NOT decode the underlying iztro raw level. Decoding it (this audit) reveals iztro disagrees with vault on 9/16 brightness assignments — most hidden behind the `normal` collapse.

---

## 2. Dimension-by-Dimension Audit (A–H)

### A. 14主星分布

- Position: 12/12 ✅
- Brightness: 5/16 ✅, 9/16 ❌ → **FAIL on brightness dimension**

### B. 主星亮度等级体系映射

| Level | Vault (per rules §1.1) | iztro (per i18n/zh-CN/brightness.js) | algorithm.ts collapse |
|---|---|---|---|
| 庙 | ✅ | ✅ miao | bright |
| 旺 | ✅ | ✅ wang | bright |
| 得 | ✅ (e.g. 巨门得) | ✅ de | normal ⚠️ |
| 利 | ✅ | ✅ li | normal ⚠️ |
| 平 | ✅ | ✅ ping | normal ⚠️ |
| 不 | (vault often uses 陷一类) | ✅ bu | dim |
| 陷 | ✅ | ✅ xian | dim |
| 闲 | (vault uses 闲 in some interpretations) | ❌ no '闲' | n/a |

**Verdict**: Lossy mapping in both directions. The 3-level collapse used in smoke output is the worst — destroys all `得/利/平` resolution.

### C. 命宫天干 ("丁卯宫")

- vault: 命宫 = 丁卯; full 12-palace stem sequence given (丙寅/丁卯/戊辰/己巳/庚午/辛未/壬申/癸酉/甲戌/乙亥/丙子/丁丑) — consistent with 五虎遁 起 寅宫=丙 (year stem 甲)
- iztro engine: algorithm.ts:77 `stem = STEMS.indexOf(p.heavenlyStem as string)` — engine DOES compute palace stems and store in `Palace.stem`
- smoke txt artifact: does NOT display 天干 — only branch
- **Verdict**: cannot be verified from smoke artifact; equipper's "吻合" claim **cannot substantiate天干** because the artifact doesn't show 天干. FAIL on burden-of-proof.

### D. 大限分段 (age ranges)

- vault: 命宫 6-15 / 父母 16-25 / 福德 26-35 / **田宅 36-45** (J叔 age 42 here) / 官禄 46-55 / 交友 56-65 / 迁移 66-75 / 疾厄 76-85 / 财帛 86-95 / 子女 96-105 / 夫妻 106-115 / 兄弟 116-125
- Order: 命→父→福→田→官→交→迁→疾→财→子→夫→兄 (顺行 per rules `紫微斗数规则体系.md:46`)
- 五行局=火六局 → 起运 6岁 ✅
- iztro smoke txt: "当前大限 idx=3 年龄=42" — equipper says J叔 in daXianAge[3]
- algorithm.ts:151 sorts daXians by start age; idx 3 = 4th item = 36-45岁 ✅ by position
- algorithm.ts:153 binds `palaceName` per daXian ✅ in engine
- smoke artifact: does NOT show palace-name for idx=3
- **Verdict**: cannot verify "iztro's daXian[3].palaceName === '田宅'" from artifact. FAIL on burden-of-proof.

### E. 身宫 (vault: 乙亥宫·财帛宫; iztro: 亥)

- vault: 身宫 = 乙亥, 在财帛宫
- iztro smoke line 5: `身宫地支: 亥`
- iztro smoke line 17: `财帛(亥)[身]: 太阴(bright)` — `[身]` marker confirms 财帛=身宫
- **Verdict**: ✅ PASS on地支 + 身宫属财帛宫 binding

### F. 五行局

- vault: 火六局
- iztro engine (algorithm.ts:175): returns `wuxingJuName`
- smoke artifact: not displayed in this specific txt file
- (round-2 audit confirms `五行局: 火六局` in earlier full smoke runs)
- **Verdict**: ✅ PASS provisional (cross-referenced)

### G. 命主/身主

- vault line 28-29: 命主=文曲, 身主=火星
- Per rules `紫微斗数规则体系.md:71-84`: 子年→命主**贪狼**; 火六局→身主**天同**
- vault 命主=文曲 is **卯年** 命主 per rules line 74 — vault has used 命宫地支(卯) as lookup, not 年支(子)
- vault 身主=火星 is **水二局** 身主 per rules line 89 — vault appears to have used a non-rules system entirely
- iztro smoke: does not output 命主/身主 at all
- **Verdict**: vault internal inconsistency (DIFF-08 below). Cannot judge engine on this dimension because artifact lacks the field.

### H. 倪师立场 / 飞星派 conflict

- algorithm.ts:10 comment: "飞星派工具仅供导出，不再在排盘时调用（倪师《天纪 03》：四化星永远固定不动）"
- algorithm.ts:147 comment: "（倪师《天纪》正统：四化永远固定，大限只看宫位移动）—— 不再生成 daXians[].siHua / stemIndex / stemName（飞星派字段已下线）"
- vault lines 159-181 contain explicit 大限四化(line 165) + 流年四化(line 173) + 流月四化(line 181), all with 4-star tuples following宫干飞化 logic per rules §4.2 (十天干四化表)
- vault line 165: "大限四化：太阳化禄、武曲化权、太阴化科、天同化忌" — derived from 大限宫干 庚 (田宅宫=庚午) → 庚干四化 per rules line 243 (庚→太阳/武曲/太阴/天同) ✅ vault internally consistent under飞星派/三合派+四化体系
- iztro engine deliberately refuses to produce these → 20+ lines of vault analysis (current 大限 / 流年 / 流月 narrative) **cannot be reproduced by this engine**
- **Verdict**: **FATAL ARCHITECTURAL MISMATCH**. If this engine becomes J叔 production tool, vault's primary analytical content categories become irrecoverable. Must be explicitly disclosed on SKILL.md.

---

## 3. Findings Inventory (8 findings, severity-ranked)

### DIFF-01【FATAL · 倪师立场 vs 飞星派根本冲突】
- Location: `lib/ziwei/algorithm.ts:10`, `lib/ziwei/algorithm.ts:147`
- vault content blocked: lines 159-181 (大限四化、流年四化、流月四化)
- Evidence: engine comment "飞星派字段已下线"; vault "大限四化：太阳化禄、武曲化权、太阴化科、天同化忌" cannot be reproduced because engine doesn't generate daXians[].siHua
- Impact: ≥20 lines of vault 当前运势 content irreproducible by design
- Fix: (a) re-enable 大限四化 as opt-in with警告, or (b) explicitly document scope-of-engine on SKILL.md with concrete vault-vs-engine gap example

### DIFF-02【CRITICAL · 太阴亮度反向】
- Position: 财帛宫(亥) — J叔身宫所在
- vault: 太阴(陷) (line 45)
- iztro raw: taiyinMaj brightness[9=亥 palace idx] = 'miao' = 庙
- vault rationale (line 113-114): "太阴喜夜生，白天生人太阴力量弱" → vault applies 日夜 modifier; iztro pure position
- Equipper smoke: "太阴(bright)" — directly contradicts vault "陷"
- Impact: All vault太阴-based财运 narrative (line 113-118) contradicted by engine
- Fix: J叔 must choose authority — iztro raw vs vault 日夜-modified vs hybrid

### DIFF-03【CRITICAL · 天同亮度反向】
- Position: 夫妻宫(丑)
- vault: 天同(庙) (line 47)
- iztro raw: tiantongMaj[11=丑 palace idx] = 'bu' = 不
- 庙↔不 is near-maximum reversal in 7-level system
- vault narrative line 130: "天同庙旺——配偶温和、随和、有福气" — entirely contradicted by engine
- Fix: same root as DIFF-02

### DIFF-04【CRITICAL · 贪狼亮度反向】
- Position: 子女宫(子)
- vault: 贪狼(陷)
- iztro raw: tanlangMaj[10=子 palace idx] = 'wang' = 旺
- Rules `紫微斗数规则体系.md:120`: "贪狼 ... 庙旺=子午; 陷=卯酉" — rules align with iztro (子=庙旺)
- vault 贪狼(陷) is **internally inconsistent with vault's own rules**
- **This is a vault SSOT bug**, not engine bug

### DIFF-05【CRITICAL · 巨门亮度反向】
- Position: 夫妻宫(丑)
- vault: 巨门(得) (line 47)
- iztro raw: jumenMaj[11=丑 palace idx] = 'bu' = 不
- 得↔不 is large gap
- Combined with DIFF-03, the entire 夫妻宫 narrative diverges between vault and engine

### DIFF-06【HIGH · 7星亮度差异聚合】
- Per §1.1 table: 七杀、天机、破军、廉贞、武曲、天相、太阴(if not counted in DIFF-02) have brightness mismatches
- Some are mild (one level off), some are major
- Root cause: vault uses一套传统reference (possibly with日夜/年支/格局修正), iztro uses pure position-only data per author's interpretation
- Fix: requires命理师 review + system choice

### DIFF-07【HIGH · smoke txt strips palace stems and daXian bindings】
- algorithm.ts:77 computes stems ✅
- algorithm.ts:153 binds palaceName per daXian ✅
- smoke txt display: omits both
- Equipper's "吻合" cannot cover 天干 or 大限-palace binding because **the artifact doesn't show them**
- Fix: extend smoke output to include 12 palace stems + daXian palace names; re-run; THEN compare with vault

### DIFF-08【MEDIUM · vault internal: 命主/身主 lookup uses wrong key】
- Rules §0.4 line 71: 命主 by 年支 → 子年=贪狼; 卯年=文曲
- Rules §0.4 line 89: 身主 by 五行局 → 火六局=天同; 水二局=火星
- vault: 命主=文曲 (=卯年 命主); 身主=火星 (=水二局 身主)
- vault appears to have used 命宫支(卯) for 命主 lookup, and unknown source for 身主
- **This is vault SSOT bug**, not engine bug
- Fix: J叔/vault owner decision — correct vault to 命主贪狼/身主天同 per rules, OR document non-standard lookup with rationale

---

## 4. Found-Differences Count

**Total: 8 findings, 9/16 brightness mismatches (incl. 4 reversals), 2 vault internal inconsistencies, 1 architectural conflict.**

The equipper claimed "三个核心字段吻合" (命宫卯/太阳天梁/紫微午). Those 3 ARE true. But:
- They don't cover 亮度 (where 9/16 differ)
- They don't cover 12-palace systematic comparison (which the equipper never did)
- They don't cover 天干 (smoke artifact doesn't show)
- They don't cover 大限分段binding (smoke artifact doesn't show)
- They don't cover 飞星派/倪师 立场冲突 (architectural)
- They don't cover vault internal consistency

**Position-fields-only match ≠ Golden Chart fitness.**

---

## 5. Signing Recommendation

**verdict = DO NOT SIGN (FAIL)**

Conditions to be considered for future PASS-WITH-CONDITIONS:

1. **DIFF-01 architectural** — SKILL.md must contain explicit "engine vs vault scope" disclosure with ≥3 concrete examples of vault content the engine cannot reproduce
2. **DIFF-02 / DIFF-03 / DIFF-04 / DIFF-05 brightness reversals** — J叔 must consciously choose authoritative system: (a) iztro raw position-only, (b) vault traditional with 日夜/年支/格局修正, (c) hybrid with documented modifier rules. The other becomes secondary reference with explicit warning
3. **DIFF-07** — smoke harness extended to display 12 palace stems and daXian palace bindings; re-run; re-audit
4. **DIFF-08** — vault SSOT corrected (命主→贪狼, 身主→天同 per rules) OR vault documents non-standard lookup with rationale
5. **DIFF-06** — once system chosen in #2, full 14-星 brightness vector regenerated and re-validated

**Estimated effort to PASS-WITH-CONDITIONS**: 1-2 sessions of human命理师 review + 1 engine smoke harness extension + 1 vault SSOT cleanup.

**Estimated effort to PASS (verified, production-ready)**: 1 full Golden Chart re-audit by J叔 personally — non-negotiable, cannot be delegated.

---

## 6. Equipper Self-Report Critique

The equipper's NR-1 fix message claimed "hour=4 重跑，三个核心字段吻合". Decoded:
- 三个核心字段 = 命宫地支 + 主星位置 + 紫微地支
- These 3 are trivial position fields, not analytic fields
- Equipper did NOT compare brightness raw level (where 9/16 differ)
- Equipper did NOT compare 天干 (artifact strips them)
- Equipper did NOT compare 大限-palace binding (artifact strips it)
- Equipper did NOT flag 倪师/飞星派 architectural conflict visible at algorithm.ts:10/147

**The "吻合" framing is the exact SLOP-09 pattern**: surface-level structural match used to imply deep validity. Future Prism reviews of similar smoke audits should require:
1. Full 12-palace systematic table (not 3-field cherry-pick)
2. Raw 7-level brightness comparison (not collapsed bright/normal/dim)
3. Explicit scope-of-engine disclosure check

---

## 7. Closure Conditions for Warden Gate

- `fixEvidence` required for 5 fix items (DIFF-01 docs / DIFF-02-05 system choice / DIFF-06 re-validated brightness / DIFF-07 extended smoke / DIFF-08 vault cleanup)
- `closeFindings`: all 8 findings currently `open`; none auto-closable
- `criteriaState`: **drifting** — equipper's "3-field 吻合" criterion is too loose; recommended replacement = full 12-palace systematic table + raw brightness + scope disclosure check
- Recommend escalation to Warden for Meta-Review of equipper review standards (RED-02 application)

---

*Audit conducted by meta-prism, 2026-05-21. No equipper self-reports trusted. All evidence traceable to file:line or iztro source code.*
