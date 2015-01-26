var stdio = require('stdio');
var crypto = require('crypto');

var ops = stdio.getopt({
    'username': { key: 'n', args: 1, description: 'username' },
    'url': { key: 'u', args: 1, description: 'url', mandatory: true},
    'secret': { key: 's', args: 1, description: 'app secret' },
    'expiry': { key: 'e', args: 1, description: 'expiry' }
});

var hmac = crypto.createHmac('sha1', ops.secret || 'logen');

var username = Math.floor(new Date().getTime() / 1000) + // current time
                (parseInt(ops.expiry) || 86400) + // plus expiry
                (ops.username ? ':' + ops.username : ''); // optional username

hmac.update(username);

var url = ops.url.indexOf('turn') === 0 ? ops.url : 'turn:' + ops.url;
var credential = hmac.digest('base64');

credentials = [
    {
        username: username,
        credential: credential,
        url: url + '?transport=tcp'
    },
    {
        username: username,
        credential: credential,
        url: url + '?transport=udp'
    }
];

console.log(credentials);
