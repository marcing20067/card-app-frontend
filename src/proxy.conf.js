let refreshToken;

const PROXY_CONFIG = {
  "/api": {
    target: "http://localhost:3000",
    secure: false,
    pathRewrite: {
      "^/api": ""
    },
    onProxyReq: function (pr) {
      if (refreshToken) {
        pr.setHeader("Cookie", `refreshToken=${refreshToken}`);
      }
    },
    onProxyRes: function (pr, req, res) {
      const cookies = pr.headers['set-cookie'];
      if (cookies) {
        refreshToken = cookies[0].split('refreshToken=')[1].split(';')[0]
      }
    },
  },
};

module.exports = PROXY_CONFIG