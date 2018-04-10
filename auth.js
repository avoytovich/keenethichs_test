const fs = require('fs');
const Twitter = require('twitter-node-client').Twitter;

String.prototype.parseURL = function() {
    return this.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+.[A-Za-z0-9-_:%&~?/.=]+/g, function(url) {
        console.log('url');
        return url.link(url);
    });
};

String.prototype.parseUsername = function() {
    return this.replace(/[@]+[A-Za-z0-9-_]+/g, function(u) {
        var username = u.replace("@","");
        return u.link("http://twitter.com/"+username);
    });
};

String.prototype.parseHashtag = function() {
    return this.replace(/[#]+[A-Za-z0-9-_]+/g, function(t) {
        var tag = t.replace("#","%23");
        return t.link("http://search.twitter.com/search?q="+tag);
    });
};

const parseDate = (str) => {
    var v=str.split(' ');
    return new Date(Date.parse(v[1]+" "+v[2]+", "+v[5]+" "+v[3]+" UTC"));
};

const config = JSON.parse(fs.readFileSync('./config.json', encoding="ascii"));

twitter = new Twitter(config);

const error = (err, response, body) => console.log('ERROR [%s]', err);
const success = data => {
  const parse = JSON.parse(data);
  const created = parseDate(parse[0].created_at);
  const createdDate = `${created.getDate()}-${created.getMonth()+1}-${
    created.getFullYear()}-${created.getHours()}-${created.getMinutes()}`;
  const tweet = `Created at:${createdDate}; info:${parse[0].text.parseURL().parseUsername().parseHashtag()}`;
  console.log('DATA [%s]', tweet);
}


const result = (screen_name, count) => {
  return new Promise((resolve, reject) => {
    if (screen_name && count) {
      resolve(twitter.getUserTimeline({ screen_name, count }, error, success));
    }
    reject('you didn\'t input data value');
  });
};

module.exports = result('js_tut', 1);
