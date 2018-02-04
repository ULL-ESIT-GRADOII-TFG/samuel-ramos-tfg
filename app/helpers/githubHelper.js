const octokit = require('@octokit/rest')()

console.log(octokit.authenticate({
  type: 'oauth',
  key: '',
  secret: ''
}));
