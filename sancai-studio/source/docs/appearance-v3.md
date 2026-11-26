# 唐彩图形第三版：结构重绘记录

本轮仅更换四款二维图形的外观及其模板版本，不改编辑器、釉面算法、烧成、布料预览和保存逻辑。

## 对照材料

2026-10-25 检索博物馆藏品资料，并查看藏品照片及用户提供的本地实物图片。照片仅作结构观察；网站使用代码绘制的独立分区图形，没有嵌入文物照片或商业插画。

- 马：[大都会博物馆《Horse》，21.175.37](https://www.metmuseum.org/art/collection/search/62847)。公开照片保留在 `artifacts/references/met-horse.jpg`；同时对照用户的 `SancaiHorseTang7-8thCentury.JPG`。参照弓形厚颈、下垂面部、胸肩体量、长而有承重关系的四肢。
- 驼：[大都会博物馆《Camel》，67.43.1](https://www.metmuseum.org/art/collection/search/49368)。公开照片保留在 `artifacts/references/met-camel.jpg`；同时对照用户的立驼照片。保留双峰、曲颈、紧凑口鼻、深腹和长腿，另加可独立施釉的鞍毯。
- 文官：[西雅图艺术博物馆《Tomb guardian as civil official》，46.153](https://art.seattleartmuseum.org/objects/15339/tomb-guardian-as-civil-official)。结合用户的 `Polychrome_glazed_pottery_figurine_of_civil_official_2.jpg`，采用双叶冠、交领、腹前拱手、下垂宽袖和肃立长袍。
- 守护俑：[大英博物馆天王俑，1936,1012.223](https://www.britishmuseum.org/collection/object/A_1936-1012-223)。该页直接访问受限，检索条目可读；具体轮廓主要对照用户的 `Polychrome_glazed_pottery_statue_of_heavenly_guardian.jpg`，采用举拳、叉腰、明光胸甲、肩胯错位及踏兽姿态。

这是适于二维施釉的艺术化重绘，不是文物测绘复原。人物与动物分别建立结构，没有统一套用同一头身比。

## 实现位置与兼容

- `src/templates/*-v3.ts`：新版路径、分区、外轮廓及细节；只给可见外缘与装饰描边，避免关节拼接圈。
- `src/domain/templates.ts`：新建作品默认使用 v3；v1/v2 继续注册。
- `src/domain/types.ts`、`validation.ts`：接受模板版本 3。
- 可编辑部位 ID 沿用原值，因此现有“用新造型再创作”仍可带入配色与纹样；旧作不会自动被改形。

## 外观核对

`artifacts/structure-v3-review.html` 是开发用外观对照页，由网站同一渲染器生成四款素坯和清晰分色的烧成效果；仅在开发服务器下访问，不进入生产入口。对照截图保留在 `artifacts/screenshots/structure-v3-overview.png`。

已放大检查选坯与施釉画布，并修正文官颈部连接、袍下鞋履的遮挡描边和马鬃末端折角。`npm run build` 检查 TypeScript 和生产打包；未新增其他功能。
