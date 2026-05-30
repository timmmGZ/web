const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function (app) {
     app.use('/api/', createProxyMiddleware({
        target: 'http://host.docker.internal:8081',
        changeOrigin: true,
    }));
};
