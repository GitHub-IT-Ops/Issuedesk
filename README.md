### What this does

If an issue is labeled on GitHub with a specific "activation label", a ticket will be created on Zendesk, if it doesn't already exist. 

### How To Install On Repo

Create `issuedesk.yml`
```
on:
    issues:
        types: [labeled]
jobs:
    bot:
        runs-on: ubuntu-latest
        name: Create ticket if needed
        steps:
            - uses: actions/checkout@v2
            - uses: github/issuedesk@master
              with:
                  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
                  ZENDESK_USERNAME: ${{ secrets.ZENDESK_USERNAME}}
                  ZENDESK_TOKEN: ${{ secrets.ZENDESK_TOKEN }}
                  ZENDESK_URI: ${{ secrets.ZENDESK_URI }}
                  ACTIVATION_LABEL: ${{ secrets.ACTIVATION_LABEL }}
```

### Local Devlopment
1. In terminal run $`git clone git@github.com:teakopp/Issuedesk.git` in the directory you wish to store in.
2. $`cd Issuedesk`
3. $`npm install`
4. It's very hard to test an action locally, but running $`npm run test` should give you an idea you an idea if you've made any breaking changes

### Contribution
All contributions are welcome. Please open a pull request.


