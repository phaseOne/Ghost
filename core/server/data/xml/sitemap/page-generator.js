var _      = require('lodash'),
    api    = require('../../../api'),
    config = require('../../../config'),
    BaseMapGenerator = require('./base-generator');

// A class responsible for generating a sitemap from posts and keeping it updated
function PageMapGenerator(opts) {
    _.extend(this, opts);

    BaseMapGenerator.apply(this, arguments);
}

// Inherit from the base generator class
_.extend(PageMapGenerator.prototype, BaseMapGenerator.prototype);

_.extend(PageMapGenerator.prototype, {
    bindEvents: function () {
        var self = this;
        this.dataEvents.on('page.published', self.addOrUpdateUrl.bind(self));
        this.dataEvents.on('page.published.edited', self.addOrUpdateUrl.bind(self));
        this.dataEvents.on('page.unpublished', self.removeUrl.bind(self));
    },

    getData: function () {
        return api.posts.browse({
            context: {
                internal: true
            },
            status: 'published',
            staticPages: true,
            limit: 'all'
        }).then(function (resp) {
            var homePage = {
                    id: 0,
                    name: 'home'
                };
            var result = _.concat(resp.posts, homePage, _.values(config.channels));
            return result;
        });
    },

    getUrlForDatum: function (post) {
        if (post.id === 0 && !_.isEmpty(post.name)) {
            return config.urlFor(post.name, true);
        } else if (!_.isEmpty(post.route)) {
          return config.getBaseUrl() + post.route;
        }

        return config.urlFor('post', {post: post}, true);
    },

    getPriorityForDatum: function (post) {
        // TODO: We could influence this with priority or meta information
        return post && post.name === 'home' ? 1.0 : 0.8;
    }
});

module.exports = PageMapGenerator;
