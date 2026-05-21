## Supply Chain Audit — ziwei-doushu @ 50f8ab5
Date: 2026-05-21
Auditor: external-repo-equipper (post-prism H-5 remediation)

### 1. 管道执行检测 (curl|sh / wget|sh)
./docs/supply-chain-audit.md:5:### 1. 管道执行检测 (curl|sh / wget|sh)

### 2. 动态执行检测 (eval/exec/Function/child_process)
lib/seo/knowledge.ts:96:  while ((m = re.exec(content)) !== null) {

### 3. package.json lifecycle scripts (install/prepare/postinstall)
{
  "key": "prepare",
  "value": "husky"
}

### 4. Husky 配置
(no .husky/ dir)

### 5. 依赖单点风险 (runtime deps)
"@anthropic-ai/sdk"
"@types/pg"
"@vercel/analytics"
"@vercel/speed-insights"
"clsx"
"framer-motion"
"html2canvas"
"ioredis"
"iztro"
"lunar-javascript"
"next"
"pg"
"react"
"react-dom"
"vercel"

### 6. License
MIT License

Copyright (c) 2026 紫微研究

---

## 评估

| 检测项 | 结果 | 风险等级 | 处置 |
|--------|------|---------|------|
| §1 管道执行 (curl/wget \| sh) | 无（grep 命中 = 本审计文件自己） | ✅ 绿 | 无 |
| §2 动态执行 (eval/Function/child_process) | 仅 `lib/seo/knowledge.ts:96 re.exec(content)` = JS RegExp.exec()，不是 `eval()` | ✅ 绿 | 无 |
| §3 lifecycle scripts | `prepare: husky` —— `npm install` 时跑 husky 初始化 | ⚠️ 黄 | 见下 |
| §4 husky 配置 | `.husky/` 目录不存在 → husky 安装会自动 init 一个空目录，无 pre-commit hook 内容 | ✅ 绿 | 无 |
| §5 依赖单点 | 17 runtime deps 含 next/pg/ioredis/vercel/@anthropic-ai/sdk 等运营层依赖；玄学部仅取 lib/ziwei + lib/classics，**不在 vault 装这些依赖** | ✅ 绿 | vendor 隔离 |
| §6 License | MIT | ✅ 绿 | 无 |

## 接受风险记录

**`prepare: husky` lifecycle script**：J叔体系采纳路径 = **不直接在 vault 或 ~/.claude/skills/ 跑 npm install**，本 SKILL 的 vendor 只是文件拷贝（5 个 .ts），不触发 husky。

调用路径绑定到 `~/DEV/ziwei-doushu/` 子项目（user 已 npm install 一次，husky 已 init 完成，无残留风险）。

如果未来要把本 SKILL 升级到「独立 npm 包」路径，需要先把 `prepare: husky` 从 fork 中删除或改为 no-op。

## 单点风险升级（来自 prism M-1）

**iztro-py + mingli-mcp 同一人维护**：spyfree（srlixin@gmail.com）
- spyfree 维护 mingli-mcp（J叔默认紫微 MCP）
- spyfree 同时维护 iztro-py（python port）
- 上游算法蓝本来自 SylarLong/iztro (npm)

**端到端单点风险**：spyfree 一人写 MCP 包 + Python port，比 prism scout 原报告写的「npm 单点」更严重。
**缓解**：本 SKILL 通过 vendor 一份固定 commit 50f8ab5 的代码，spyfree 上游被替换或下架时仍可独立运行（路径 A 依赖 SylarLong/iztro npm，路径 B 完全独立）。

## 结论

**通过**（无阻塞性风险）。J叔授权状态：本 SKILL 通过 vendor 隔离 + 调用路径绑定 `~/DEV/` 子项目，规避了 husky 等 lifecycle script 在 vault 内触发的风险。允许装备。

回看节点：2026-06-21（30 天）+ 2026-08-21（90 天）。
