const octokit = require('@octokit/rest')()

octokit.authenticate({
  type: 'oauth',
  key: '',
  secret: ''
})
