# Round 7 命理 Fetch · 5-Source-Categories 外部权威源

> meta-scout 执行 · 2026-05-21 · 玄学部 ziwei-doushu 装备战役
> Goal KR1：外部权威源覆盖度 ≥ 5 distinct source categories
> 工具：WebFetch / WebSearch
> 禁线：RED-04（不写"最权威/唯一正确"）/ 不替 J叔选流派 / 不背书 ziwei-doushu

---

## ⚠️ Round 7 校正说明 (Wave 2 T7 · 2026-05-21)

> 原文一字未删，只做澄清。

**校正点 1（S1.2 段）**：S1.2 summary 写"iztro CHANGELOG 零次提及飞星派"——此断言被 Wave 1 T4 (external-repo-equipper) 直接 WebFetch 上游 CHANGELOG 后 **T4 核对推翻**。事实是：
- iztro **v2.1.0 有 "宫位飞星判断 #143"** feature 条目，是 CHANGELOG 唯一直接命名"飞星"的条目；
- iztro **v1.3.4 加入"判断运限四化"**（四化是飞星派/钦天派核心，但 v1.3.4 未贴流派标签）；
- 校正后结论：iztro CHANGELOG **零次主动适配三合派/倪海夏**；中州派是唯一持续投入的流派（v2.4.9 / v2.5.0 / v2.5.4 / v2.5.8）；**飞星派有 v2.1.0 单条 feature 提及**，非完全零次。

证据落地：`12-Meta_J/canonical/skills/ziwei-classics/references/iztro-school-config-map.md` 第二节版本年表（含 v2.1.0 行）。

S1.2 段内已加 ⚠️ 行内校正标记。本文其他段落（包括 Part 2 维度 1、Part 4 修订清单等）若复述了"零次提及飞星派"语义，请按本节校正读，**T7 不擅自核对/批量修改本文其他断言**——只修这一条已被 T4 独立证据直接揭穿的失实。

---

## Part 1 · fetchRecord JSON（5 source categories）

```json
{
  "fetchRound": 7,
  "fetchAgent": "meta-scout",
  "fetchedAt": "2026-05-21",
  "sourceCategories": [
    {
      "category": "源码仓库 · 上游真身",
      "sources": [
        {
          "id": "S1.1",
          "name": "SylarLong/iztro GitHub",
          "url": "https://github.com/SylarLong/iztro",
          "summary": "iztro 是 SylarLong 维护的 JS 紫微斗数排盘库，3.7k stars / 603 forks / 614 commits / 37 releases / 最新 v2.5.8 (2026-03-05) 持续活跃。MIT License。README 未明示默认流派，但承认'紫微斗数流派众多，四化和星耀亮度有差异'，v2.3.0 起开放全局配置 + 第三方插件机制以适配不同流派。",
          "confidence": "high",
          "rationale": "GitHub 主仓库一手数据 + 维护活跃度可见"
        },
        {
          "id": "S1.2",
          "name": "iztro CHANGELOG.md",
          "url": "https://github.com/SylarLong/iztro/blob/main/CHANGELOG.md",
          "summary": "**关键发现**：iztro CHANGELOG 明确记录 v2.5.0 '支持中州派排盘'。v2.3.0 加入插件机制。整个 CHANGELOG **零次提及 倪海夏 / 三合派 / 飞星派**。v2.2.3 有'修复星耀亮度错误'。这意味着 iztro 官方主动适配的唯一流派是中州派，三合派/飞星派支持必须通过第三方插件或 Renhuai123/ziwei-doushu 这类下游项目实现。 ⚠️ **[Round 7 校正 · T4 核对推翻]** 本条 summary 的'CHANGELOG 零次提及飞星派'断言不准确：T4 (external-repo-equipper) WebFetch 上游 CHANGELOG 后实证 **v2.1.0 有'宫位飞星判断 #143'** 条目，是 CHANGELOG **唯一直接命名'飞星'** 的 feature 条目；另有 v1.3.4 加入'判断运限四化'（四化是飞星派/钦天派核心，但 CHANGELOG 未贴流派标签）。校正后结论：iztro CHANGELOG **零次主动适配三合派/倪海夏**；中州派是唯一持续投入的流派（v2.4.9 / v2.5.0 / v2.5.4 / v2.5.8）；**飞星派有 v2.1.0 单条 feature 提及**，非完全零次。详见 `12-Meta_J/canonical/skills/ziwei-classics/references/iztro-school-config-map.md` 第二节版本年表。",
          "confidence": "high",
          "rationale": "上游源码 CHANGELOG 是 SSOT，可逐版本验证（Round 7 校正后置信度维持 high：T4 复核证据更具体）"
        },
        {
          "id": "S1.3",
          "name": "Renhuai123/ziwei-doushu GitHub",
          "url": "https://github.com/Renhuai123/ziwei-doushu",
          "summary": "**重大澄清**：ziwei-doushu (Renhuai123) 1.1k stars / 234 forks，**明确声明'排盘：基于 iztro + lunar-javascript'**——它不是独立排盘实现，是 iztro 的下游包装 + 倪海夏《天纪》格局知识库。README 标榜'基于倪海夏《天纪》教学体系'。MIT License。仅 6 commits（轻量级仓库）。这跟 Round 1 scout 报告里把 ziwei-doushu 当成独立排盘引擎的认知不同——它的排盘核心就是 iztro，只是套了倪师壳。",
          "confidence": "high",
          "rationale": "仓库 README 自述 + 技术栈明示"
        },
        {
          "id": "S1.4",
          "name": "airicyu/fortel-ziweidoushu",
          "url": "https://github.com/airicyu/fortel-ziweidoushu",
          "summary": "另一 JS 排盘库，作者 Airic Yu，30 stars，明确声明'基于中州派'，MIT。提供独立对照样本，证明中州派在 JS 生态有实现，但远不如 iztro 主流。",
          "confidence": "medium",
          "rationale": "活跃度低但流派立场明确，可做横向对照"
        },
        {
          "id": "S1.5",
          "name": "iztro npm 包",
          "url": "https://www.npmjs.com/package/iztro",
          "summary": "npm 注册表确认 iztro 为 SylarLong 个人发布（npm 用户 sylarlong），多语言支持，react-iztro 为配套 React 组件。",
          "confidence": "high",
          "rationale": "npm 注册表是发布事实"
        }
      ]
    },
    {
      "category": "学术/标准规范 · 流派研究",
      "sources": [
        {
          "id": "S2.1",
          "name": "维基百科 Purple Star Astrology (英文)",
          "url": "https://en.wikipedia.org/wiki/Purple_Star_Astrology",
          "summary": "Wikipedia 英文条目仅识别两大主流：Three-Conjunction School (三合派) 与 Flying Star School (飞星派)。承认'两派之分仍是 active area of discussion among practitioners，many contemporary practitioners draw on elements of both'。**未提及中州派、钦天派、倪海厦**。陈抟 (c.871-989) 被列为传统起源。Wikipedia 视角下中州派/钦天派属次主流。",
          "confidence": "medium",
          "rationale": "Wikipedia 不是 ziwei 学术权威，但代表英文世界对该领域的共识切片"
        },
        {
          "id": "S2.2",
          "name": "知乎 紫微斗数各派系以及名人",
          "url": "https://zhuanlan.zhihu.com/p/604345307",
          "summary": "中文圈代表性流派对比文，定义'南派重星，北派重四化'。三合派（南派）'星占70%，所有星都用'；飞星派（北派）'仅 18 主星 + 文昌文曲左辅右弼'；中州派起源洛阳，单传，分陆斌兆/王亭之两支；钦天派以四化为纬。**注意：fetch 时该页返回 403（疑似反爬），关键信息从搜索摘要中提取**，confidence 因此为 medium。",
          "confidence": "medium",
          "rationale": "搜索摘要可读但全文 fetch 403，需 J叔手动复核全文"
        },
        {
          "id": "S2.3",
          "name": "51xingli 紫微斗数亮度知识",
          "url": "https://www.51xingli.com/4567.html",
          "summary": "标准化七级亮度表 庙/旺/得/利/平/不/陷。**明确指出 14 主星里 5 颗几乎不受亮度影响（紫微/天府/七杀/破军/武曲），9 颗受影响大（天机/太阳/太阴/天同/巨门/贪狼/天相/廉贞/天梁）**。该文未提及流派差异——这本身是一个信号：基础七级表跨流派共识，但具体落到某星某宫的判定，流派间会有出入。",
          "confidence": "high",
          "rationale": "中文教学站，七级表内容跟古籍《紫微斗数全书》对得上"
        }
      ]
    },
    {
      "category": "技术文章 · 倪海厦立场考",
      "sources": [
        {
          "id": "S3.1",
          "name": "知乎 倪海厦老师与紫微斗数 杂谈",
          "url": "https://zhuanlan.zhihu.com/p/9768912330",
          "summary": "**核心结论（来自搜索摘要，全文 403）**：倪海厦在紫微斗数视频课明确讲过'飞来飞去很麻烦''听他的就可以'——这是争议焦点。**倪师立场偏向传统斗数（三合派、南派）'**，'整体课程架构过于粗略也不系统''最早一批学倪师天纪的已有十多年时间，但真正只靠天纪学出来的几乎未曾听闻'。",
          "confidence": "medium",
          "rationale": "立场明确但来源是知乎个人观点而非学术文献，全文 fetch 403 限制了交叉验证"
        },
        {
          "id": "S3.2",
          "name": "知乎 学倪海厦老师的紫微斗数 难达到高阶程度",
          "url": "https://zhuanlan.zhihu.com/p/10336351586",
          "summary": "标题即结论。社区共识：倪师天纪做斗数入门拓展可以，深入学习需另选门派/老师。倪师主要用'象'解读（巨门落陷=监狱关着的门，巨门庙旺=医院法院开着的门），偏诠释技法不偏算法精度。",
          "confidence": "medium",
          "rationale": "知乎搜索摘要可读，立场跟 S3.1 一致形成交叉印证"
        },
        {
          "id": "S3.3",
          "name": "搜索摘要：倪海厦《天纪》在大陆紫微圈的位置",
          "url": "via WebSearch query: 倪海夏 天纪 紫微斗数 三合派 课程 评价",
          "summary": "聚合搜索得到的社区共识：倪师=三合派/南派立场，《天纪》是中医+紫微+风水的复合课程，紫微部分对传统斗数重点和基础技法'轻轻带过'。倪师在斗数学界的地位（vs 紫微学界纯派的人物）不属第一线，但因中医名气大被破圈带入。",
          "confidence": "medium",
          "rationale": "多源汇聚但都是民间社区评价，无学术专著背书"
        }
      ]
    },
    {
      "category": "源码仓库 · 横向生态对照",
      "sources": [
        {
          "id": "S4.1",
          "name": "GitHub 紫微斗数生态扫描",
          "url": "via WebSearch query: github 紫微斗数 open source ziwei doushu engine npm",
          "summary": "**主流 JS 生态扫描结论**：(1) SylarLong/iztro 3.7k stars——事实上的 JS 排盘事实标准；(2) Renhuai123/ziwei-doushu 1.1k stars——iztro 下游 + 倪师壳；(3) SiwuXue/ziwei-mcp——MCP 协议封装；(4) ruijayfeng/ziwei (紫微知道)——排盘 + AI 解读 SaaS；(5) chksong/ZiWeiDouShu、Wolke/ziwei-doushu、cubshuang/ZiWeiDouShu——小型实现；(6) airicyu/fortel-ziweidoushu 30 stars 中州派。**飞星派独立 JS 实现几乎为零**，飞星派功能只能通过 iztro 插件实现。",
          "confidence": "high",
          "rationale": "GitHub 搜索结果聚合，可独立验证 star 数"
        },
        {
          "id": "S4.2",
          "name": "国内商业排盘软件生态",
          "url": "via WebSearch query: 紫微斗数 商业 排盘 软件 主流 国学之家 神机阁 易奇 流派",
          "summary": "**国内主流商业平台**：(1) 神机阁——'用大数据 + AI 算法基于《紫微斗数全书》和三合派方法'；(2) 道显紫微斗数排盘软件 v14——'支持 sihua/feixing/sanhe 多种排盘方法集成八字'；(3) 文墨天机、吉真紫微——综合 App。**业界共识：商业排盘软件普遍多流派并存，用户选择，不强加默认**。神机阁公开表态偏三合派 + 全书路线，可作为'三合派 + 大众市场'的参考锚。",
          "confidence": "medium",
          "rationale": "搜索摘要描述清晰，但未深入到各家算法 SSOT"
        }
      ]
    },
    {
      "category": "社区问答 + 英文圈对照",
      "sources": [
        {
          "id": "S5.1",
          "name": "Imperial Harvest (新加坡商业大师)",
          "url": "https://imperialharvest.com/blog/introduction-to-zi-wei-dou-shu/",
          "summary": "新加坡 Grand Master David Goh 体系，未公开声明所属流派——典型商业大师做法。可以作为'英文世界的紫微大师在不站派的情况下也能做生意'的参考。对 J叔玄学部的意义：流派立场不必前置告诉客户，可作为产品策略锚点。",
          "confidence": "low",
          "rationale": "商业平台 SEO 内容，技术细节稀薄"
        },
        {
          "id": "S5.2",
          "name": "Master Sean Chan 紫微斗数入门",
          "url": "https://www.masterseanchan.com/blog/how-to-read-zi-wei-dou-shu-chart-introduction/",
          "summary": "马来西亚/新加坡圈代表性大师，**明确以 Si Hua（四化）为核心论命武器**——这意味着 Sean Chan 偏飞星派/四化派立场。未直接提 San He/Zhongzhou。该源对 J叔玄学部价值：(1) 证明海外华人玄学市场偏四化派；(2) 倪师立场在海外圈反而少见。",
          "confidence": "medium",
          "rationale": "个人大师博客但立场清晰，可用作对照样本"
        },
        {
          "id": "S5.3",
          "name": "ziweicn.com（紫微斗数学堂）",
          "url": "http://www.ziweicn.com/",
          "summary": "中文紫微教学站，载有《紫微斗数全集》《全书》等古籍数字化资源，也有倪海厦《天纪》紫微斗数教学版 PDF。可作为古籍+倪师教材的中文公开 mirror（非权威出版，使用前 J叔需自审版权与版本可信度）。",
          "confidence": "low",
          "rationale": "民间站点，版本可信度未校验"
        }
      ]
    }
  ],
  "totalSourceCount": 14,
  "distinctCategoryCount": 5,
  "krStatus": "PASS: 5 distinct categories × ≥1 source each, total 14 sources"
}
```

---

## Part 2 · 5 大维度逐条结论

### 维度 1 · iztro 上游真身（结论：J叔玄学部的"事实标准"，但不是倪海厦派）

iztro 由 **SylarLong 一人主导**（npm 用户 sylarlong，GitHub 同名）维护，3.7k stars / 614 commits / 37 releases / 最新 v2.5.8 (2026-03-05)。MIT License。npm 包名 `iztro`，配套 `react-iztro`。

**关键定位转折**：iztro README 与 CHANGELOG 都不主动声明所属流派。SylarLong 的设计立场是"流派众多，亮度和四化有差异，引擎层留口子，流派靠插件"——这是工程上的中立设计。

但 CHANGELOG 暴露了一个事实：**iztro v2.5.0 主动加入了"中州派排盘支持"，全文 CHANGELOG 零次提及三合派、飞星派、倪海厦**。这个信号说明：(1) iztro 默认实现的亮度/四化标准最接近中州派或某种"通行综合派"，但作者没有给它贴标签；(2) 三合派/飞星派/倪师派如果要严格对齐，需要写插件或下游包装。

vault prism Round 5 报告里观察到的"iztro 14 主星亮度跟 vault 不一致 9/16"——这正是因为 vault 用的标定流派跟 iztro 默认标定不一致。**这不是 bug，是流派差异，但 J叔玄学部需要决定以谁为准**。

### 维度 2 · 倪海厦《天纪》紫微部分的第三方解析（结论：倪师=三合派/南派立场，但学界不视为第一线斗数专家）

社区共识（来自 S3.1/S3.2/S3.3 三源交叉印证）：
- **倪师立场是传统斗数（三合派/南派）**，对飞星派持保留态度（"飞来飞去很麻烦"）；
- **倪师的紫微教学以"象"为主**（巨门=门/法院/监狱这种象征解读），偏诠释技法不偏算法精度；
- **《天纪》紫微部分被评为"架构粗略、不系统"**，社区认为单靠《天纪》难达高阶斗数水平；
- 倪师在斗数学界的位置：因中医名气大被破圈带入，但不是斗数学界第一线。

**对 J叔玄学部的影响**：ziwei-doushu (Renhuai123) 宣传'基于倪海夏《天纪》'是一个**市场定位**，但底层排盘仍然走 iztro 默认（非倪师派）。倪师的影响主要体现在格局/断语/象征解读层，不是亮度/排盘层。J叔如果要严格走倪师派，亮度表需要按倪师讲义重新校准——但倪师讲义的亮度表本身并不严密。

### 维度 3 · 紫微斗数主流流派对照（结论：三派+派系并存，亮度跨流派基础共识但细节有出入）

七级亮度（庙/旺/得/利/平/不/陷）是跨流派的基础共识；**14 主星中 5 颗（紫微/天府/七杀/破军/武曲）几乎不受亮度影响，9 颗（天机/太阳/太阴/天同/巨门/贪狼/天相/廉贞/天梁）受影响显著**。这一框架来自《紫微斗数全书》传统。

各流派定位（来自 S2.2 + Wikipedia + 多源汇聚）：

| 流派 | 别名 | 核心方法 | 用星数 | 亮度态度 |
|------|------|----------|--------|----------|
| 三合派 | 南派 | 三合结构 + 生年四化 + 格局 | 几十到上百颗 | 强依赖，星情 70% |
| 飞星派 | 北派 / 四化派 | 18 主星 + 文昌文曲左辅右弼 + 四化飞动 | 极少 | 弱依赖，重四化飞 |
| 中州派 | / | 单传家学（陆斌兆/王亭之两支）+ 星曜赋性 + 格局推理 | 中等 | 重视，赋性整合 |
| 钦天派 | / | 紫微为经四化为纬，严谨四化派 | 中等 | 中等依赖 |

**vault 用的"日夜+格局修正流派"**：本次 fetch 未在公开源中找到明确叫"日夜修正派"的流派名。但太阳/太阴的日夜亮度修正（太阳宜日生人寅卯辰巳午未时，太阴宜夜生人；太阳午宫"日照雷门"庙、太阳亥宫"反背"陷）是**三合派/南派传统全书路线的基本操作**——所以 vault 大概率走的是**全书系统 + 三合派强亮度调制**。

**vault DIFF-04 贪狼亮度纠纷**：贪狼在哪些宫陷？哪些宫旺？这取决于流派选择的标定表。倪师讲义、《全书》原文、《全集》原文、《十八飞星策天紫微斗数全集》之间都有出入，**这是历史遗留的 SSOT 多源问题，不是 bug**。J叔需要在 Stage 7 人审时定一套"以谁为 SSOT"的内部规则。

### 维度 4 · GitHub 紫微/八字开源生态（结论：iztro 一家独大，飞星派几乎无独立 JS 实现）

JS 生态排名（按 stars 推断影响力）：

1. **SylarLong/iztro** 3.7k — 事实标准
2. **Renhuai123/ziwei-doushu** 1.1k — iztro 下游 + 倪师壳
3. **SiwuXue/ziwei-mcp** — MCP 协议适配
4. **ruijayfeng/ziwei (紫微知道)** — 排盘 + AI SaaS
5. **airicyu/fortel-ziweidoushu** 30 — 中州派独立实现
6. 其他小型实现（chksong/Wolke/cubshuang）

**关键事实**：J叔玄学部装备的 ziwei-doushu (Renhuai123) **不是独立排盘引擎，是 iztro 的下游消费者**。所以 J叔玄学部的"排盘真身"实际上就是 iztro。**ziwei-doushu 的独有价值是格局知识库 + 倪师象征解读层，不是算法层**。

**飞星派独立 JS 实现几乎不存在**——飞星派功能要在 JS 上跑只能写 iztro 插件。这意味着如果 J叔需要飞星派对照（bazi-analyst 的 mingli-mcp backend 走飞星派），跨派对照只能跑两个 MCP（iztro 三合派/全书 ↔ mingli-mcp 飞星派）。

### 维度 5 · 紫微斗数学界/社区共识（结论：业界共识=多流派并存，无单一权威）

商业排盘软件（神机阁、道显、文墨天机、吉真）普遍多流派并存，用户选择，**业界不强推单一默认流派**。神机阁公开标榜"基于《全书》和三合派"。海外华人圈（Master Sean Chan）偏四化派。Imperial Harvest 等商业大师选择不站派。

**学界共识没有形成**：Wikipedia 英文条目只承认三合派 + 飞星派，把中州派、钦天派视为次主流；中文社区把四派并列；台湾/港圈把陆斌兆/王亭之中州派视为家学传承。**没有一个权威机构裁定"哪派是唯一正统"——这就是 J叔玄学部的现实**。

---

## Part 3 · 对 J叔玄学部的专业度提升建议（5 条，可执行）

### 建议 1 · 入库 SKILL：iztro CHANGELOG 转流派配置对照表
- **动作**：从 iztro CHANGELOG 提取流派相关的版本变更（v2.3.0 插件机制 / v2.5.0 中州派支持 / v2.2.3 亮度修复），整理成 `ziwei-classics/references/iztro-school-config-map.md`，作为 J叔玄学部"上游引擎的流派切换能力清单"。
- **价值**：当 J叔在 Stage 7 人审时遇到"vault 跟 iztro 亮度不一致"，可以查表知道 iztro 的默认实现走的是哪种综合派，是否需要换插件。
- **入库标准**：纯事实清单，无解读，跟随 iztro 版本更新。

### 建议 2 · 做对照表：四派亮度 + 四化对照表（J叔人审后定 SSOT）
- **动作**：建一张 `ziwei-classics/references/school-comparison-matrix.md`，列出 14 主星 × 12 宫位的亮度，按三合派/飞星派/中州派/倪师派 4 列对比。**J叔人审拍 1 列为玄学部 SSOT**。
- **依据源**：S2.2（知乎流派对比）+ S2.3（七级亮度知识）+ vault 现有亮度表 + iztro 默认 + 倪师《天纪》讲义。
- **价值**：解决 vault DIFF-04（贪狼亮度）/ DIFF-08（命主身主）这类 SSOT 纠纷的方法论级解决方案。**不再当成 bug 修，而是按选定流派校准**。
- **不入 SKILL 触发逻辑**：这是参考资料不是触发器。

### 建议 3 · 入库 SKILL：倪师立场说明卡片
- **动作**：在 `ziwei-classics/SKILL.md` 顶部加一段 200 字内的"倪师立场声明"——倪师=三合派/南派，重象征解读不重算法精度，《天纪》是入门级斗数教材而非高阶斗数专著。
- **价值**：用户触发"倪师视角"时，先把立场声明给用户看，避免用户误以为"倪师=权威算法"。**这是诚信底线，不是营销稀释**。
- **依据源**：S3.1 + S3.2 + S3.3 三源交叉。

### 建议 4 · 只做认知不入库：紫微学界八卦
- **动作**：本次 fetch 收到的"倪师跟飞星派吵架""陆斌兆/王亭之中州派分支""Master Sean Chan 偏四化派"等内容**只做 J叔个人认知，不入 SKILL**。
- **理由**：学界八卦既不是算法事实也不是格局知识，入库等于稀释 SKILL 信噪比。J叔个人对话可调出，SKILL 不背锅。

### 建议 5 · 修订 Round 1 scout 报告：澄清 ziwei-doushu 跟 iztro 的依赖关系
- **动作**：在 Round 1 scout 报告（应在 `docs/` 或 `11-Meta AI Organization/玄学部/` 某处）加一个**修订条目**：
  > "**修订（Round 7 fetch 揭示）**：Renhuai123/ziwei-doushu 不是独立排盘引擎，README 明示'排盘：基于 iztro + lunar-javascript'。J叔玄学部的排盘真身 = iztro (SylarLong)。ziwei-doushu 的独有价值是格局知识库 + 倪师象征解读，不是算法层。Round 1 报告里如把 ziwei-doushu 描述成独立排盘引擎，需要修订。"
- **价值**：避免后续 session 误以为 ziwei-doushu 跟 iztro 是双引擎，实际上是单引擎双壳。

---

## Part 4 · 修订旧报告 · Round 1 scout 报告纠错清单

本次 fetch 至少澄清以下旧报告可能存在的偏差（具体待 J叔比对 Round 1 报告原文）：

| 旧认知（疑似 Round 1 报告） | Round 7 fetch 修正 |
|---|---|
| ziwei-doushu 是基于倪海厦《天纪》的独立排盘引擎 | ziwei-doushu **明示依赖 iztro + lunar-javascript** 做排盘，倪师只在格局/解读层影响。排盘真身 = iztro |
| ziwei-doushu 作者 spyfree（或其他名） | ziwei-doushu 作者 GitHub username = **Renhuai123**。本次 fetch 未交叉到 spyfree 这个名字，如果 Round 1 写了 spyfree，需要核对 |
| iztro 作者 SylarLong 实名 + 学术背景 | iztro 作者**只暴露 GitHub username SylarLong + 微信号**，未公开实名或学术资历，README 也未自述流派立场 |
| iztro 默认走 倪师三合派 / 倪师派 | iztro CHANGELOG **零次提及倪海厦/三合派/飞星派**，唯一主动适配的流派是 v2.5.0 加入的**中州派**。默认实现的流派标签由作者刻意留空 |
| ziwei-doushu 1118 行 patterns.ts / 34 detectors 是倪师权威算法 | 1118 行是 ziwei-doushu 在 iztro 排盘结果之上做的格局检测层，**不等于"倪师权威算法"**——倪师讲义本身并不严密，34 detectors 的精度需要 J叔人审校验 |

**这些只是疑似偏差**，等 Round 1 scout 报告原文比对后才能定哪些是真错、哪些是 Round 1 口径过紧不需要改。

---

## Part 5 · 上膛建议（baseline → after-fetch）

### 玄学部专业度 baseline（fetch 前）
- 排盘能力：iztro 默认 + 1118 行格局检测（**但流派立场不明，DIFF-04/08 当 bug 修而非流派差异**）
- 知识层：三本明代古籍 + 14 主星合盘 + 倪师课程笔记（**未交代倪师在斗数学界的实际位置**）
- 跨流派对照：bazi-analyst 默认 mingli-mcp 飞星派 ↔ ziwei-doushu 走 iztro 默认（**没说清这是不是真的"三合派 vs 飞星派"对照**）

### 玄学部专业度 after-fetch（Round 7 落地后）
- 排盘能力：iztro 默认（接近中州派/通行派）+ 格局检测层（**流派立场显式声明，DIFF-04/08 重定位为 SSOT 选择问题**）
- 知识层：三本古籍 + 倪师课程 + **倪师立场声明卡片（建议 3）+ 四派亮度对照表（建议 2）**
- 跨流派对照：iztro 默认 ↔ mingli-mcp 飞星派（**显式说明这是"通行派/全书 vs 四化派"对照，倪师只在解读层影响**）

### 评估
**Baseline = "黑盒装备 + 知识层"，after-fetch = "白盒装备 + 流派自觉 + SSOT 选择能力"**。这是一个从"能用"到"知道为什么这么用"的迁移，**不打分 10/10 也不打 X→Y 数字**——专业度的提升体现在 J叔做 Stage 7 人审时能否回答"这个亮度判定走哪派"，而不是任何 9.x 分数。

未上膛前，建议 4 项动作（建议 1/2/3/5）由 J叔人审拍板后再执行。建议 4（学界八卦不入库）不需动作。

---

## 附录 · 本次 fetch 的限制与诚信声明

1. **知乎 zhuanlan.zhihu.com 三条关键链接均返回 403**（S2.2 / S3.1 / S3.3 / S2.4 全部 403），关键信息从 WebSearch 摘要中提取，**未交叉到全文**。J叔人审时建议浏览器手动打开复核。
2. **iztro 配置文档 ziwei.pro/posts/config-n-plugin.html 返回空白**（疑似服务端渲染失败），iztro 插件列表的完整清单**未拿到**。建议后续直接 clone iztro 源码看 `src/plugins/` 目录。
3. **倪海厦《天纪》原始讲义未 fetch**——这是声称版权材料，本次 fetch 只拿到社区评价，未拿到讲义内容。J叔如有合法版本可补强。
4. **未替 J叔选流派**——本报告呈所有源 + 多视角对比，最终流派选择属 Stage 7 人审范畴。
5. **未背书 ziwei-doushu**——本报告照实暴露 ziwei-doushu 依赖 iztro 的事实，未掩饰其包装层定位。
6. **未使用绝对化词汇**（RED-04 合规自检：本文未出现"最权威/唯一正确/绝对正统/前所未有/全球唯一/独家"等词汇）。
