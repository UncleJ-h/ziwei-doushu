# Prism Review — Round 3 (Three Parking Lines + New Findings)

> Date: 2026-05-21
> Reviewer: meta-prism (independent)
> Trigger: J叔 approved closing 3 parking-line items (N-1 / IG-1 / IG-3) + 5 MEDIUM items deferred to backlog
> Method: independent grep/ls/diff/md5; equipper self-report not trusted
> Predecessor: round 1 verdict=FAIL (13 findings) → round 2 verdict=PASS-WITH-CONDITIONS (11 closed / 2 partial / 8 new) → **round 3 verdict below**

---

## Top-line Verdict

**verdict = PASS-WITH-CONDITIONS** (stricter than round 2 — see §4)

- 3 parking lines: **N-1 closed / IG-1 closed-structural-only / IG-3 closed-doc-only**
- 5 backlog items: all confirmed still-open and recorded
- 3 new round-3 findings (1 HIGH / 2 MEDIUM)
- **Ammunition load-up ruling**: NOT yet `verified` for production; downgrade to `internal-ready` until Golden Chart human audit closes new finding NR-1

---

## 1. Three Parking Lines

| ID | Status | Evidence | Verdict |
|----|--------|----------|---------|
| **N-1 SSOT 收口** | **closed** | (a) `12-Meta_J/canonical/agents/bazi-analyst.md` exists (17814 bytes, 13:15). (b) `diff -q` returns empty across 3 locations: canonical / vault `.claude/agents/` / global `~/.claude/agents/`. (c) `md5` all = `fb10ee50c62f85d668bd95020560df44` — byte-identical. (d) Round-2 deliverables present: `backend.ziwei` frontmatter line 9, Decision Rule 8 line 100. (e) `npm run meta:check:runtimes` → "Runtime assets are up to date." | CLOSED |
| **IG-1 smoke test 实跑** | **closed (structural only)** | (a) `~/DEV/ziwei-doushu/node_modules/iztro/package.json` exists, version `2.5.8`. (b) `docs/ziwei-fewshot-smoke.txt` 26 lines, real iztro output format matching `ZiweiChart` shape (12 palaces with `[现行大限]/[身]/[命]` markers + brightness annotations `(庙旺)/(陷)`). (c) 14 主星齐全 verified: output line 25 `14主星出现数: 14 / 14, 缺失: []`. (d) Not脑补 — `命宫(亥): 太阴(庙旺)`, `紫微星: 午`, `五行局: 火六局` are coherent iztro outputs, internally consistent with `命宫地支:亥 + 火六局 → 紫微午` algorithm. | CLOSED-STRUCTURAL-ONLY (see NR-1 below — chart is right shape but wrong 时辰) |
| **IG-3 跨机器前置** | **closed (doc-only)** | (a) `ziwei-doushu-engine/SKILL.md:10` `## 前置准备（跨机器必看）` with executable steps lines 18-25 (gh repo clone + npm install + export). (b) `ziwei-classics/SKILL.md:10` same section header + lines 20-21 actionable. (c) Contents are not空话 — concrete commands. | CLOSED-DOC-ONLY (see NR-2 below — env var never consumed by any code) |

---

## 2. Backlog 5 Items Confirmation (accepted-risk)

| ID | Round 2 Status | Round 3 Re-check | Recorded? |
|----|----------------|-------------------|-----------|
| **N-2** allowed_engines collects pending engines w/o transitional cutoff | open | **still open** — `grep transitional_deadline\|过渡期\|sunset` in `engine-registry.yaml` returns 0 hits. Cutoff field absent. | YES in round-2 report §"open backlog" + J叔 verbal accept |
| **N-3** MEMORY uses "必杀方案" narrative | open | **still open** — `grep -c 必杀` returns 1 hit in `MEMORY.md:76` + 1 hit in `ziwei-doushu-equip-2026-05-21.md:3`. Wording untouched. | YES |
| **N-4** SKILL triggers overlap with bazi-analyst | open | **still open** — `ziwei-doushu-engine/SKILL.md:3` description still contains `紫微排盘、十二宫、四化、命宫、格局识别、倪师紫微、三合派紫微` (overlaps with `bazi-analyst.md:3` triggers `紫微斗数、命盘解读`). No `仅由 bazi-analyst 调用` / `internal SKILL` guard found. | YES |
| **IG-2** bazi-analyst `backend.ziwei` is paper switch (no hook) | open | **still open** — Decision Rule 8 is textual ("调用紫微排盘前必须查..."); no PreToolUse hook intercepts. Pure self-discipline. | YES |
| **IG-4** supply-chain-audit §1 self-witness pattern | open | **still open** — `docs/supply-chain-audit.md:5-6` STILL shows `./docs/supply-chain-audit.md:5: ### 1. 管道执行检测` as the only grep hit, then `§1 评估` row reads "命中 = 本审计文件自己 ✅ 绿". Pattern reproduced verbatim from round 2. Recommended `--exclude=docs/` not applied. | YES |

All 5 confirmed still-existing and tracked in round-2 report tables (lines 270-280 of round-2 doc). Backlog ledger status = **carry-forward**.

---

## 3. Round-3 New Findings (RED-02 application)

### NR-1【HIGH / IG-1 副作用：smoke chart 跑的是错时辰】

**Location**: `~/DEV/ziwei-doushu/docs/ziwei-fewshot-smoke.txt:2`

**Evidence**:
- Smoke file passes `birthInfo: {"year":1984,"month":6,"day":30,"hour":8,"gender":"male"}`
- `lib/ziwei/types.ts:5` defines `hour: number; // 时辰 branch index (0=子, 1=丑, ... 11=亥)`
- `iztro/lib/calendar/heavenlyStemAndEarthlyBranch.js:73` confirms `timeIndex 时辰序号（0~11），子时为0，亥时为11`
- J叔 known chart (`12-Meta_J/tests/xuanxue/known-charts.yaml:8`): `solar_datetime: "1984-06-30 08:15"`, `hour_pillar: 庚辰` → **辰时 = branch index 4**
- Smoke passed `hour=8` = **申时 (15-17pm)** — NOT J叔's 辰时
- Result: smoke output `命宫:亥 / 身宫:卯 / 火六局 / 紫微:午 / 命宫太阴(庙旺)` is a valid iztro chart for a **fictional 8月30日申时男命**, not J叔
- SKILL.md:141 itself flagged "hour 序号待 J叔签字" — equipper committed smoke anyway, contradicting own warning

**Why HIGH not CRITICAL**:
- Smoke serves as "iztro 算法可跑 + 输出形状参考" — that goal IS achieved
- But the file headline `birthInfo` looks like a real run of J叔's chart; downstream readers (or future Meta_J runs) will assume this IS J叔's chart since J叔 birth date 1984-06-30 matches
- Pattern matches "structurally green but生产用错" — exactly the trap round 1 IG flagged

**Recommended fix**:
- (a) Add a header line: `# 注意：本文件 hour=8 (申时) 占位，非 J叔真实辰时；仅证 iztro 算法可跑，不可作为 J叔真盘参考`
- (b) Or rerun with `hour=4` (辰时) and overwrite — small effort, removes the trap
- (c) Or move file to `docs/ziwei-fewshot-fictional-male.txt` and add a separate `docs/jshu-ziwei-pending.md` placeholder waiting for J叔签字

**Closure condition for `verified`**: NR-1 must be resolved (a/b/c chosen) before this skill can be marked production-ready. Otherwise Golden Chart human audit (chart1_jshu_self) cannot use this smoke as reference.

---

### NR-2【MEDIUM / IG-3 副作用：ZIWEI_DOUSHU_PATH 是 readme 装饰品，无消费者】

**Location**: both `ziwei-doushu-engine/SKILL.md:25` and `ziwei-classics/SKILL.md:21`

**Evidence**:
- Both SKILL.md preflight sections instruct `export ZIWEI_DOUSHU_PATH=~/DEV/ziwei-doushu`
- `grep -rn ZIWEI_DOUSHU_PATH` across `lib/`, `app/`, vault `.claude/hooks/`, global `~/.claude/hooks/`, `12-Meta_J/.claude/hooks/` → **0 consumers**. The env var is set but nobody reads it.
- The actual invocation pattern (SKILL.md:65-70) is "cd ~/DEV/ziwei-doushu && npx tsx ..." — uses cwd, not the env var.

**Why MEDIUM**:
- Functionally harmless today (cd works)
- But IG-3 was sold as "跨机器前置加固"; in reality the env var creates an illusion of configurability — if J叔 sets `ZIWEI_DOUSHU_PATH=/some/other/path`, the SKILL will still cd to hardcoded `~/DEV/ziwei-doushu` and silently use the wrong location
- PRIN-01 (Configurable) violation: env var declared but not honored

**Recommended fix**:
- (a) Remove the `export ZIWEI_DOUSHU_PATH=...` line from both SKILL.md preflights (downgrade to "本 SKILL 假设兄弟仓库在 `~/DEV/ziwei-doushu/`，跨机器请软链或修改 SKILL.md 路径")
- (b) OR add a real `${ZIWEI_DOUSHU_PATH:-~/DEV/ziwei-doushu}` shell variable to the invocation commands in SKILL.md:67-70

---

### NR-3【MEDIUM / N-1 副作用：SSOT 单写 + 双投影，但同步监控弱】

**Location**: `12-Meta_J/canonical/agents/bazi-analyst.md` + `vault/.claude/agents/bazi-analyst.md` + `~/.claude/agents/bazi-analyst.md`

**Evidence**:
- Round-3 verification confirms three files **byte-identical right now** (md5 match)
- But: canonical timestamp is `13:15`, vault `.claude` is `12:46` (29-min older), global `~/.claude` is `13:15`
- This means the vault `.claude/agents/bazi-analyst.md` was NOT refreshed by the latest sync — it has the new content (because round 2's earlier sync caught it) but the mtime is stale
- `npm run meta:check:runtimes` returns "up to date" because content matches; but if a future round-2-style direct edit happens on vault `.claude/agents/`, no diff alarm will fire until next `meta:sync` run
- The "SSOT 收口" claim relies on convention ("only edit canonical"), not enforcement

**Why MEDIUM not LOW**:
- Round 1 found this same class of issue (mirror-vs-canonical drift); N-1 fix relies on humans remembering to edit canonical only
- No PreToolUse hook blocks edits to `.claude/agents/*.md` directly
- One careless edit to vault projection → silent SSOT divergence until next check

**Recommended fix**:
- (a) Add `.claude/agents/bazi-analyst.md` to a "do not edit directly" marker file or pre-commit hook
- (b) Or schedule `meta:check:runtimes` in pre-commit (currently manual)

---

## 4. Why round-3 verdict is PASS-WITH-CONDITIONS (not PASS)

Round 2 closed 11/13 originals → round 3 closes 3/3 parking lines structurally, but:

1. **NR-1 is structural-pass-only**: smoke artifact exists and is real iztro output, but the chart corresponds to a fictional person, not J叔. This is **exactly the SLOP-09 trap** Prism is designed to catch — "looks like J叔 chart smoke test, actually isn't".
2. **NR-2 documents a config knob nobody reads** — PRIN-01 violation introduced by the IG-3 fix itself.
3. **NR-3 shows N-1 relies on convention**, not enforcement.

Net trajectory: round 1 (13 open) → round 2 (8 new) → round 3 (3 new). Velocity of new findings is decreasing (13 → 8 → 3) but not zero. Cannot declare `closed-clean`.

`reviewState = rated`, `verificationState = closable-with-conditions`, `criteriaState = stable`.

---

## 5. Load-up ruling: can it go to `verified` production?

**Ruling: NOT YET. Hold at `internal-ready`.**

| Production gate | Status | Blocker |
|-----------------|--------|---------|
| Code path executable (iztro installed, algorithm runs) | green | none |
| Three-end SSOT byte-identical | green | none |
| Round 1 + round 2 findings tracked | green | 5 in backlog |
| **J叔 Golden Chart human audit (chart1_jshu_self)** | red | `known-charts.yaml:11` still `pending_user_confirmation: true`; `fixture_signed_by: null` |
| **Smoke test matches J叔 real chart** | red (NR-1) | smoke is wrong 时辰 |
| `engine_unverified: true` frontmatter discipline tested | unknown | no real downstream consumer has run yet |

**Path to `verified`**:
1. Fix NR-1 (smoke header note OR rerun with 辰时 hour=4) — 5 min
2. Run smoke against `chart1_jshu_self` with `hour=4`, compare output to vault `J叔紫微斗数盘.md` historical record
3. J叔人审签字到 `known-charts.yaml` `fixture_signed_by/date/evidence` 三字段
4. Fix NR-2 (remove or honor env var) — 2 min
5. Re-run round-4 sanity check

**Until then**: SKILL stays `internal-ready` — J叔 can手动调用 ziwei-doushu-engine for exploration, but bazi-analyst frontmatter `backend.ziwei` must remain default `mingli-mcp` for J叔生产解读, with `ziwei-doushu-niraidah` only switched when J叔 explicitly says "倪师模式" AND with `engine_unverified: true` frontmatter marker.

---

## 6. Evaluation Criteria Self-Reflection (Eval Critique)

- IG-1 assertion "smoke test 是真实 iztro 输出" passed structurally — but a stricter assertion "smoke chart matches J叔's actual 时辰" would have caught NR-1 earlier. **Round 2 assertion was too weak**. Promoting it for round 4.
- IG-3 assertion "前置准备段有可执行步骤" passed — but didn't check whether the documented env var is actually read. **Assertion lacked PRIN-01 verification**. Tightening for round 4.
- N-1 byte-identical check is strong (md5 match) — but doesn't catch "drift between sync runs" risk (NR-3). Could add mtime parity check.

A pass on a weak assertion is more dangerous than a fail. Three round-3 findings all came from tightening previously-passed assertions, not from new categories. The forensic lens worked as designed.

---

## 7. Verification Closure Packet

```yaml
fixEvidence:
  N-1:
    fix: SSOT 迁至 12-Meta_J/canonical/agents/bazi-analyst.md，双投影 byte-identical
    evidence: |
      md5: fb10ee50c62f85d668bd95020560df44 (3 locations)
      diff -q: empty
      npm run meta:check:runtimes: PASS
  IG-1:
    fix: iztro 2.5.8 installed + smoke executed + 14 主星齐全
    evidence: |
      ls node_modules/iztro/package.json: present (2255 bytes)
      docs/ziwei-fewshot-smoke.txt: 26 lines, real iztro output
      14主星 verified: line 25 "14 / 14, 缺失: []"
    caveat: NR-1 — smoke uses hour=8 (申时), not J叔's 辰时
  IG-3:
    fix: 两个 SKILL.md 顶部加 ## 前置准备（跨机器必看）段
    evidence: |
      ziwei-doushu-engine/SKILL.md:10 + 18-25 (gh clone + npm install + export)
      ziwei-classics/SKILL.md:10 + 20-21
    caveat: NR-2 — ZIWEI_DOUSHU_PATH 无消费者

closeFindings:
  N-1: closed
  IG-1: closed-structural-only  # NR-1 carry-forward
  IG-3: closed-doc-only  # NR-2 carry-forward
  N-2: accepted-risk (backlog)
  N-3: accepted-risk (backlog)
  N-4: accepted-risk (backlog)
  IG-2: accepted-risk (backlog)
  IG-4: accepted-risk (backlog)
  NR-1: open  # HIGH — blocks `verified` ruling
  NR-2: open  # MEDIUM
  NR-3: open  # MEDIUM

next_round_required: yes (round 4 after NR-1 fix + Golden Chart 签字)
```

---

## 8. Independent Audit Trail (round 3)

| Command | Outcome | Used for |
|---------|---------|----------|
| `ls -la <3 bazi-analyst paths>` | all present, 17814 bytes | N-1 |
| `diff -q` × 2 pairs | empty (byte-identical) | N-1 |
| `md5` × 3 | all `fb10ee50...` | N-1 |
| `grep backend.ziwei\|规则 8` canonical | line 9 + line 100 hit | N-1 round-2 carry-over |
| `cd 12-Meta_J && npm run meta:check:runtimes` | "Runtime assets are up to date" | N-1 |
| `ls iztro/package.json` | 2255 bytes, v2.5.8 | IG-1 |
| `wc -l ziwei-fewshot-smoke.txt` | 26 lines | IG-1 |
| `cat ziwei-fewshot-smoke.txt` | real iztro output | IG-1 |
| `grep timeIndex iztro/lib/calendar/heavenlyStemAndEarthlyBranch.js` | "0~11，子时为0，亥时为11" | NR-1 |
| `grep hour lib/ziwei/types.ts` | "时辰 branch index (0=子, 1=丑, ... 11=亥)" | NR-1 |
| `cat known-charts.yaml chart1` | `solar_datetime: 1984-06-30 08:15`, `hour_pillar: 庚辰` | NR-1 |
| `grep 前置 ziwei-doushu-engine/SKILL.md` | line 10 + 18-25 | IG-3 |
| `grep 前置 ziwei-classics/SKILL.md` | line 10 + 20-21 | IG-3 |
| `grep -r ZIWEI_DOUSHU_PATH lib/ app/ hooks/` | 0 consumers | NR-2 |
| `grep transitional_deadline engine-registry.yaml` | 0 hits | N-2 confirm |
| `grep -c 必杀 MEMORY.md ziwei-doushu-equip-*.md` | 1 + 1 | N-3 confirm |
| `head supply-chain-audit.md` | §1 still self-witness | IG-4 confirm |
| `grep 仅由 bazi-analyst SKILL.md` | 0 hits | N-4 confirm |
| `stat -f %Sm vault/.claude vs canonical` | 12:46 vs 13:15 mtime drift | NR-3 |

End of round 3.
