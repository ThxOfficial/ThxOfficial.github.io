import type { TemplateId } from '../domain/types';

export interface CultureEntry {
  title: string;
  summary: string;
  body: string;
  source: string;
  sourceTitle: string;
  photoCredit?: string;
}

export const INTRO: CultureEntry = {
  title: '什么是唐三彩？',
  summary: '唐三彩是唐代的一类低温彩釉陶，常见黄、绿、白，也有褐、蓝等颜色。',
  body: '唐代陶工在早期铅釉陶的基础上发展出多彩釉陶。今天到博物馆，能看到唐三彩做成的马、骆驼、人物和各种器皿。河南、陕西出土的作品中，许多原本是放进墓葬里的器物和陶俑。',
  source: 'https://www.dpm.org.cn/lemmas/239403.html',
  sourceTitle: '故宫博物院《唐三彩》词条',
};

export const OBJECTS = {
  horse: {
    title: '三彩马',
    summary: '看马身之外的小细节，比如马鞍、胸前的流苏和杏叶形饰片。',
    body: '河南博物院收藏的一组三彩马及牵马胡俑出土于洛阳。马身以红棕为主，白色马鬃和绿色饰片分得很清楚。做自己的小马时，可以先给马身选主色，再单独调整鞍毯和饰带。',
    source: 'https://www.chnmus.net/ch/collection/appraise/details.html?id=512156296641873343',
    sourceTitle: '河南博物院《三彩马及牵马胡俑》',
  },
  camel: {
    title: '三彩双峰骆驼',
    summary: '双峰、抬起的头和弯曲的颈部，是辨认骆驼俑的线索。',
    body: '大都会艺术博物馆收藏了一件八世纪三彩骆驼俑。它仰起头，双峰之间留出空间。工坊在骆驼身上加了可以独立上色的毯子，适合试试菱格和多色点彩。',
    source: 'https://www.metmuseum.org/art/collection/search/49368',
    sourceTitle: '大都会艺术博物馆《Camel》',
  },
  official: {
    title: '文官俑',
    summary: '文官俑通常可以从冠帽、长袍和拱手的姿态认出来。',
    body: '西雅图艺术博物馆藏有一件以文官姿态塑造的唐代三彩俑。人物戴冠，双手收在袍前，衣袍上有纹饰，可以留意衣领、袖口和釉色如何把各层衣服分开。',
    source: 'https://art.seattleartmuseum.org/objects/15339/tomb-guardian-as-civil-official',
    sourceTitle: '西雅图艺术博物馆藏品页',
  },
  guardian: {
    title: '天王俑',
    summary: '天王俑的肩甲、胸甲和举臂姿势常常一眼就能认出来。',
    body: '大英博物馆收藏的一件唐代天王俑脚下踏着一头牛，身披施有绿釉和褐釉的甲胄。工坊保留了盔甲和踏兽的造型线索，胸甲、护肩与裙甲都可以分别上色。',
    source: 'https://www.britishmuseum.org/collection/object/A_1936-1012-223',
    sourceTitle: '大英博物馆天王俑藏品页',
  },
  vessel: {
    title: '三彩器皿',
    summary: '唐三彩也有壶、罐和盘等器皿。可以从口沿看到器腹，再看到足部。',
    body: '故宫博物院的词条介绍了唐三彩不同器类。器皿的轮廓比较完整，适合观察釉色从上往下的变化。给工坊里的壶上色时，可以先给器腹选底色，再让壶颈和把手分别用色。',
    source: 'https://www.dpm.org.cn/lemmas/239403.html',
    sourceTitle: '故宫博物院《唐三彩》词条',
  },
  musicians: {
    title: '三彩骆驼载乐俑',
    summary: '驼背上坐着乐人，人物、乐器和骆驼组成了同一件作品。',
    body: '中国国家博物馆的馆藏专题展出了三彩骆驼载乐俑。观察时可以先看骆驼和人物的大小，再看乐器与人物的动作。工坊里的版本保留载乐构图，可以分别给乐人的衣服和驼毯上色。',
    source: 'https://www.chnmuseum.cn/portals/0/web/zt/nmcinthesky/wwlist.html',
    sourceTitle: '中国国家博物馆馆藏专题',
  },
} satisfies Record<TemplateId | 'vessel' | 'musicians', CultureEntry>;

export type PhotoSlot = keyof typeof OBJECTS | 'overview' | 'kiln';
