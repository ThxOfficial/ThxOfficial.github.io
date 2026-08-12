'use strict';

/* Generate category pages for categories that have no posts yet,
   so every category in _data/categories.json has a clickable detail page. */
hexo.extend.generator.register('all-categories', function (locals) {
  var data = (locals.data && locals.data.categories) || [];
  var existing = [];
  locals.categories.each(function (c) {
    existing.push(c.name);
  });

  return data
    .filter(function (c) {
      return existing.indexOf(c.title) === -1;
    })
    .map(function (c) {
      return {
        path: 'categories/' + c.title + '/index.html',
        layout: ['category', 'index'],
        data: {
          name: c.title,
          posts: []
        }
      };
    });
});
