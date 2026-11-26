export const KNOWLEDGE = [
  { id: 'many-colors', title: '三彩，不止三种颜色', body: '唐三彩是低温彩色铅釉陶。名字中的“三彩”指向多彩，并非每件作品都必须用足三种颜色。你可以只选一色，也可以保留大片素胎。', source: 'https://www.chnmuseum.cn/zp/zpml/kgfjp/202111/t20211116_252219.shtml', sourceTitle: '中国国家博物馆 · 三彩方柜' },
  { id: 'bisque', title: '先定形，再施釉', body: '这里参考洛阳相关非遗传承资料的二次烧成路径：成型、阴干、素烧后，在已经定形的素坯上施釉，再次入窑釉烧。这不是所有历史唐三彩唯一的工艺路径。', source: 'https://www.ihchina.cn/ccr_detail/14450/', sourceTitle: '中国非物质文化遗产网 · 唐三彩烧制技艺' },
  { id: 'flow', title: '窑火里的柔和交融', body: '釉在受热熔融时可以自然垂流、相互浸润。网页把这一变化转化为可控的数字视觉效果，保留你的色块与图案，不用于预测真实烧窑。', source: 'https://www.ihchina.cn/ccr_detail/14450/', sourceTitle: '中国非物质文化遗产网 · 唐三彩烧制技艺' },
  { id: 'controlled', title: '清晰分色，也很唐彩', body: '并非每件唐三彩都要大幅流淌。河南博物院介绍的一件三彩马有施釉均匀、无釉流痕的特点。你可以选择清晰分色，也可以让点彩轻轻交融。', source: 'https://www.chnmus.net/ch/collection/appraise/details.html?id=512156296641873343', sourceTitle: '河南博物院 · 三彩马及牵马胡俑' },
  { id: 'henan', title: '从河南的泥土与窑火出发', body: '巩义黄冶保存了重要生产窑址，洛阳是重要出土地，也有相关现代非遗传承。窑址、出土地和传承地分别讲述着不同的故事。', source: 'https://wwj.zhengzhou.gov.cn/country/3176735.jhtml', sourceTitle: '郑州市文物局 · 黄冶唐三彩窑址' },
  { id: 'today', title: '让一件唐彩来到生活里', body: '这里的卡通化和布料印花是当代数字创作：把同一个完整形象带到帆布袋、T 恤或手帕上，而不是把陶釉烧在织物上。', source: 'https://www.metmuseum.org/art/collection/search/44805', sourceTitle: 'The Met · Horse and rider（题材参考）' },
].map(card=>({...card,summary:({
  'many-colors':'一色、多色，或大片留白，都可以成为你的唐彩。',
  bisque:'先把泥坯烧制定形，再施釉入窑，是本工坊采用的体验路径。',
  flow:'受热的釉可以垂流交融；网页用可控的数字效果表现变化。',
  controlled:'也有分色清晰的唐三彩，不需要让每一处颜色都流淌。',
  henan:'生产窑址、文物出土地与今天的传承地，需要分别认识。',
  today:'把唐彩形象印到布上，是今天的设计转化。',
} as Record<string,string>)[card.id]}));

export const CLAY_NOTE={title:'泥、胎、釉有什么不同？',body:'泥经过成型和干燥成为坯体；本工坊先用素烧让它定形。施釉是在坯体表面铺上釉层，釉烧后形成不同于无釉素胎的表面效果。奶白釉与留白素胎颜色接近，但一处有釉、一处露胎。人物的面部等细节还可能另加彩绘。',source:'https://www.chinamuseum.org.cn/detail.html?contentId=829&id=14',sourceTitle:'中国博物馆协会 · 泥火幻彩展览说明'};

export const HERITAGE_PLACES=[
  {id:'kiln',kind:'生产窑址',name:'巩义 · 黄冶',x:68,y:39,body:'黄冶保存了唐三彩生产窑址，窑炉、作坊与模具等考古发现，为认识制作与生产提供线索。这里指生产地，不把所有洛阳出土文物都归为黄冶制造。',source:'https://wwj.zhengzhou.gov.cn/country/3176735.jhtml',sourceTitle:'郑州市文物局 · 黄冶唐三彩窑址'},
  {id:'find',kind:'出土与收藏',name:'洛阳 · 文物线索',x:28,y:59,body:'河南博物院介绍的“三彩马及牵马胡俑”出土于洛阳。具体文物的出土地、收藏地与生产地是不同的信息，不能互相替代。',source:'https://www.chnmus.net/ch/collection/appraise/details.html?id=512156296641873343',sourceTitle:'河南博物院 · 三彩马及牵马胡俑'},
  {id:'craft',kind:'现代传承',name:'洛阳 · 烧制技艺',x:28,y:59,body:'洛阳相关唐三彩烧制技艺于 2008 年列入第二批国家级非物质文化遗产名录。今天的传承工艺为本工坊的成型、素烧、施釉与釉烧体验提供参考。',source:'https://www.ihchina.cn/ccr_detail/14450/',sourceTitle:'中国非物质文化遗产网 · 唐三彩烧制技艺'},
];
export const PROCESS_STEPS = [
  { title: '练泥与成型', body: '陶土经过处理，以模制、捏塑等方法成为器形。这里已经为你准备好卡通素坯。' },
  { title: '阴干与素烧', body: '参考二次烧成路径：坯体干燥后先素烧定形，冷却后才进入施釉。' },
  { title: '亲手施釉', body: '选择部位，铺上一层底釉；再添几处点彩、菱格或自己的笔触。' },
  { title: '釉烧与冷却', body: '看釉色在数字窑火中柔和交融。冷却开窑后，收下你自己的唐彩。' },
];
