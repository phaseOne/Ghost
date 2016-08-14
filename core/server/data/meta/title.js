var _ = require('lodash'),
    config = require('../../config');

function getTitle(data, root) {
    var title = '',
        context = root ? root.context : null,
        blog = config.theme,
        pagination = root ? root.pagination : null,
        pageString = '';

    if (pagination && pagination.total > 1) {
        pageString = ' - Page ' + pagination.page;
    }
    if (data.meta_title) {
        title = data.meta_title;
    } else if (_.includes(context, 'home')) {
        title = config.channels.index.title || blog.title;
    } else if (_.includes(context, 'blog')) {
        title = 'Blog';
        if (pagination.page > 1) title += pageString;
        title += ' · ' + blog.title;
    } else if (_.includes(context, 'author') && data.author) {
        title = data.author.name + pageString + ' - ' + blog.title;
    } else if (_.includes(context, 'tag') && data.tag) {
        title = data.tag.meta_title || data.tag.name + pageString + ' - ' + blog.title;
    } else if (_.includes(context, 'post') && data.post) {
        title = data.post.meta_title || data.post.title;
    } else if (_.includes(context, 'page') && data.post) {
        title = (data.post.meta_title || data.post.title) + ' · ' + blog.title;
    } else {
        title = blog.title + pageString;
    }

    return (title || '').trim();
}

module.exports = getTitle;
