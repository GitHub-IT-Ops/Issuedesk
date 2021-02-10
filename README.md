### What this does

1. If an issue is labeled on GitHub with a specific "activation label", a ticket will be created on Zendesk, granted it doesn't already exist. 
2. If an issue has the activation label, all comment updates to the issue will be reflected in Zendesk ticket, granted the ticket remains open.

### How To Install On Repo

Create `issuedesk.yml` in `.github/workflows` directory (if `.github/workflows` doesn't exist, feel free to create it)
then paste the below workflow config into `issuedesk.yml`

```
on:
    issues:
        types: [labeled]
    issue_comment:
        types: [created]
jobs:
    issuedesk:
        runs-on: ubuntu-latest
        name: Create ticket if needed
        steps:
            - uses: actions/checkout@v2
              env:
                  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
                  ZENDESK_USERNAME: ${{ secrets.ZENDESK_USERNAME}}
                  ZENDESK_TOKEN: ${{ secrets.ZENDESK_TOKEN }}
                  ZENDESK_URI: ${{ secrets.ZENDESK_URI }}
                  ACTIVATION_LABEL: ${{ secrets.ACTIVATION_LABEL }}
            - uses: GitHub-IT-Ops/Issuedesk@1.2
              with:
                  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
                  ZENDESK_USERNAME: ${{ secrets.ZENDESK_USERNAME}}
                  ZENDESK_TOKEN: ${{ secrets.ZENDESK_TOKEN }}
                  ZENDESK_URI: ${{ secrets.ZENDESK_URI }}
                  ACTIVATION_LABEL: ${{ secrets.ACTIVATION_LABEL }}
```
Then navigate to `https://github.com/<owner or org>/<repo name>/settings/secrets` and define 

    ZENDESK_USERNAME
    ZENDESK_TOKEN
    ZENDESK_URI
    ACTIVATION_LABEL


After all secrets are defined, action should automatically kick off when issue is labeled 

### Local Devlopment
1. In terminal run $`git clone git@github.com:GitHub-IT-Ops/Issuedesk.git` in the directory you wish to store in.
2. $`cd Issuedesk`
3. $`npm install`
4. It's very hard to test an action locally, but running $`npm run test` should give you an idea if you've made any breaking changes

### Contribution
All contributions are welcome. Please open a pull request.


