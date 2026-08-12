/* =============================================
   站点内容配置 —— 以后添加/修改内容只需编辑本文件
   ============================================= */
window.SITE = {
  brand: 'Home',

  heroTitle: 'Welcome',
  heroSubtitle: '移动鼠标查看图片切换效果',

  /* ---------- 分类（首页「分类」卡片） ----------
     新增分类：复制一组 { icon, title, desc } 即可 */
  categories: [
    {
      title: '分类一',
      desc: '这里放分类的描述文字，说明该分类下的内容方向。',
      icon: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'
    },
    {
      title: '分类二',
      desc: '这里放分类的描述文字，说明该分类下的内容方向。',
      icon: '<path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>'
    },
    {
      title: '分类三',
      desc: '这里放分类的描述文字，说明该分类下的内容方向。',
      icon: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'
    },
    {
      title: '分类四',
      desc: '这里放分类的描述文字，说明该分类下的内容方向。',
      icon: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>'
    }
  ],

  /* ---------- 文章（「文章」列表） ----------
     title   : 标题（必填）
     date    : 日期
     tag     : 所属分类
     desc    : 摘要
     href    : 链接到文章页面（如 post.html 或 #） */
  articles: [
    {
      title: '示例文章标题',
      date: '2026-08-12',
      tag: '分类一',
      desc: '这里是文章摘要，一两句话介绍内容。',
      href: '#'
    },
    {
      title: '第二篇示例文章',
      date: '2026-08-11',
      tag: '分类二',
      desc: '这里是文章摘要，一两句话介绍内容。',
      href: '#'
    }
  ]
};
