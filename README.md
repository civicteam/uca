# Civic User Collectable Attributes

## Summary

This Javascript Library provides functionality around User Collectable Attributes (UCA).

## Contents

- [Prerequisites](#prerequisites)
- [Installation ](#installation)
- [Features](#features)
  * [User Collectable Attributes](#user-collectable-attributes)
    + [Defining new UCA](#defining-new-uca)
    + [Exporting UCA to the UCA Registry Services](#exporting-uca-to-the-uca-registry-services)
    + [Using a UCA in javascript (with this library)](#using-a-uca-in-javascript--with-this-library-)
      - [creating UCA instances with the constructor](#creating-uca-instances-with-the-constructor)
- [Schema Generator](#schema-generator)
- [Conventions:](#conventions-)
- [Commands](#commands)
- [Integration with CCS Libraries](#integration-with-ccs-libraries)
- [ES5 and ES6 definitions](#es5-and-es6-definitions)
- [Node vs React usage of this library](#node-vs-react-usage-of-this-library)
- [Releases](#releases)

## Prerequisites

[![npm][npm]][npm-url]
      
- [Node.js](https://nodejs.org/en/)
- SJCL library with ECC binary. Please refer how to build with support after the `npm i` here: https://github.com/bitwiseshiftleft/sjcl/wiki/Getting-Started
- Decrypt the XPrv

```
git clone git@github.com:masonicGIT/sjcl-cli.git
cd sjcl-cli
npm install
node src/index.js decrypt
```

## Installation 
UCA is an open-source library that has its binary package published on NPM.
Projects that depend on UCA must install the dependency following this way:
`npm install --save @civic/uca`

All versions follow SemVer (https://semver.org/)

## Commands

- `npm run lint` - run an ESLint check
- `npm test` - run all tests
- `npm run test:watch` - run all tests in watch mode


## Features

### User Collectable Attributes

A "User Collectable Attribute" is **a unit of user-related data** (attribute or knowledge) with a specific identifier that can be captured from the user normally during the validation process by a mobile phone. A UCA once verified can be part of a Credential as Claim with the same identifier.

#### Defining new UCA

Just add a new definition entry with the [format](http://) on the definitions [file](http://)

#### Exporting UCA to the UCA Registry Services

UCA definitions are packed inside this library but also are available for public consumption at the [UCA Registry](http://) to export new defined UCAs just run:

```
npm run export-definitions 
```  

#### Using a UCA in javascript (with this library)

##### creating UCA instances with the constructor

`UCA(identifier, value, version)`

Example
```
const name = new UCA('cvc:Identity:address', {
    street: 'Alameda dos Anjos',
    unit: '102',
    city: 'Belo Horizonte',
    zipCode: '94103345',
    state: 'Minas Gerais',
    county: 'Sao Bento',
    country: 'Brazil',
}, '1');
```
Or use the shorthand
```
const name = new UCA.IdentityAddress({
    street: 'Alameda dos Anjos',
    unit: '102',
    city: 'Belo Horizonte',
    zipCode: '94103345',
    state: 'Minas Gerais',
    county: 'Sao Bento',
    country: 'Brazil',
});
```

**values** can be:
*  Plain JavaScript Objects:
```json
{
    "street": "Alameda dos Anjos",
    "unit": "102",
    "city": "Belo Horizonte",
    "zipCode": "94103345",
    "state": "Minas Gerais",
    "county": "Sao Bento",
    "country": "Brazil",
}
```
* Attestable Values: 
```json
{
  "attestableValue": "urn:city:508e6c84091b405587f755eb5e0d9dbd15f4f7f69642adc18d2d2d8fe9c93366:Belo Horizonte|urn:country:f53c0e02620611705f5dfab2abe8320679f183f7eaa01b50340b6f0f0579638f:Brazil|urn:county:a9d100b24769843e15d8fff52efc5d15f57150e1c252d99c0ea7f8d6ed740e4a:Sao Bento|urn:state:73d0477e24c5b3498addf6877c52ae5916b7cf9fbcaea2e2d440167e4745fab2:Minas Gerais|urn:street:71cb22a895ee6264ed2f0cc851a9e17c5326f70bfd94e945e319d03f361d47d9:Alameda dos Anjos|urn:unit:887eb71750da1837101eb64c821f0a0a58e7ab3254eeed1b6bf2cec72b7a4174:102|urn:zipCode:dc671959502dfa65de57a0a8176da15437493c37497670445268e286a035bea8:94103345|"
}
```

JSON String
 
```json
{
  "id": null,
  "issuer": "did:ethr:0x1ddcbae835c47c8d9159756c167994931a5f01e8",
  "issuanceDate": "2018-09-25T21:51:56.511Z",
  "identifier": "cvc:Credential:Address",
  "expirationDate": "+132017-07-11T05:51:56.512Z",
  "version": "1",
  "type": [
    "Credential",
    "cvc:Credential:Address"
  ],
  "claim": {
    "type": {
      "address": {
        "city": "Belo Horizonte",
        "country": "Brazil",
        "county": "Sao Bento",
        "state": "Minas Gerais",
        "street": "Alameda dos Anjos",
        "unit": "102",
        "zipCode": "94103345"
      }
    }
  },
  "proof": {
    "type": "CivicMerkleProof2018",
    "merkleRoot": "c81c5b22438916f2bd75e2966df989b9302ce65887813dd1661f9f24407c5dfe",
    "anchor": {
      "subject": {
        "pub": "xpub:dummy",
        "label": "cvc:Credential:Address",
        "data": "c81c5b22438916f2bd75e2966df989b9302ce65887813dd1661f9f24407c5dfe",
        "signature": "signed:dummy"
      },
      "walletId": "none",
      "cosigners": [
        {
          "pub": "xpub:dummy"
        },
        {
          "pub": "xpub:dummy"
        }
      ],
      "authority": {
        "pub": "xpub:dummy",
        "path": "/"
      },
      "coin": "dummycoin",
      "tx": {},
      "network": "dummynet",
      "type": "permanent",
      "civicAsPrimary": false,
      "schema": "dummy-20180201",
      "value": {}
    },
    "leaves": [
      {
        "identifier": "cvc:Identity:address",
        "value": "urn:city:508e6c84091b405587f755eb5e0d9dbd15f4f7f69642adc18d2d2d8fe9c93366:Belo Horizonte|urn:country:f53c0e02620611705f5dfab2abe8320679f183f7eaa01b50340b6f0f0579638f:Brazil|urn:county:a9d100b24769843e15d8fff52efc5d15f57150e1c252d99c0ea7f8d6ed740e4a:Sao Bento|urn:state:73d0477e24c5b3498addf6877c52ae5916b7cf9fbcaea2e2d440167e4745fab2:Minas Gerais|urn:street:71cb22a895ee6264ed2f0cc851a9e17c5326f70bfd94e945e319d03f361d47d9:Alameda dos Anjos|urn:unit:887eb71750da1837101eb64c821f0a0a58e7ab3254eeed1b6bf2cec72b7a4174:102|urn:zipCode:dc671959502dfa65de57a0a8176da15437493c37497670445268e286a035bea8:94103345|",
        "claimPath": "type.address",
        "targetHash": "c1b096d40d2ac94c095ebea67af8d2ffb6788a9d0367ffef0010e0c40dd5157d",
        "node": [
          {
            "right": "f97fe9f193a485120e2eef5ee57132b05d7b9c02c53fcf7617663d99b9b6d482"
          },
          {
            "right": "e0dbcf542838280f07d49c2b7c9a4bf9e681b43fc6a55ff7db1973d17b44c37c"
          },
          {
            "right": "207f569aa16908c29cd1bf590f5e3745d6a433119cf31f024e8c1cbb680d4e41"
          },
          {
            "right": "9a09e4b79ec54507896892ac23d8b5d707786b075ead58a69d51c4376805e9c1"
          }
        ]
      },
      {
        "identifier": "cvc:Meta:issuer",
        "value": "urn:issuer:a68ed1b5f92ee8ce1e142b232dcb4ca0e2733f51f9893383e6adc3c53887e2fd:did:ethr:0x1ddcbae835c47c8d9159756c167994931a5f01e8",
        "claimPath": "meta.issuer",
        "targetHash": "f97fe9f193a485120e2eef5ee57132b05d7b9c02c53fcf7617663d99b9b6d482",
        "node": [
          {
            "left": "c1b096d40d2ac94c095ebea67af8d2ffb6788a9d0367ffef0010e0c40dd5157d"
          },
          {
            "right": "e0dbcf542838280f07d49c2b7c9a4bf9e681b43fc6a55ff7db1973d17b44c37c"
          },
          {
            "right": "207f569aa16908c29cd1bf590f5e3745d6a433119cf31f024e8c1cbb680d4e41"
          },
          {
            "right": "9a09e4b79ec54507896892ac23d8b5d707786b075ead58a69d51c4376805e9c1"
          }
        ]
      },
      {
        "identifier": "cvc:Meta:issuanceDate",
        "value": "urn:issuanceDate:c3b9798fe98020b041b4bd20027eee5c2895ff47b3fb0c5a4e8d1d061ae2733d:2018-09-25T21:51:56.511Z",
        "claimPath": "meta.issuanceDate",
        "targetHash": "d3706f4891c1fbfcfa208e7b662858460a992bc547141ee69f7c778681eeab08",
        "node": [
          {
            "right": "5bb75bfee07b5ed5ead3d96ae21d420ce3f8419c8b2ca287eca358507f834312"
          },
          {
            "left": "9dbba3ce114413f76478581417768af3d2f2e6517513c5257b6c5313824f6e68"
          },
          {
            "right": "207f569aa16908c29cd1bf590f5e3745d6a433119cf31f024e8c1cbb680d4e41"
          },
          {
            "right": "9a09e4b79ec54507896892ac23d8b5d707786b075ead58a69d51c4376805e9c1"
          }
        ]
      },
      {
        "identifier": "cvc:Meta:expirationDate",
        "value": "urn:expirationDate:7388ed27d10476f47cd9c68a732a9b9eccfd44598cdcb2f785f5131c33991f5b:+132017-07-11T05:51:56.512Z",
        "claimPath": "meta.expirationDate",
        "targetHash": "5bb75bfee07b5ed5ead3d96ae21d420ce3f8419c8b2ca287eca358507f834312",
        "node": [
          {
            "left": "d3706f4891c1fbfcfa208e7b662858460a992bc547141ee69f7c778681eeab08"
          },
          {
            "left": "9dbba3ce114413f76478581417768af3d2f2e6517513c5257b6c5313824f6e68"
          },
          {
            "right": "207f569aa16908c29cd1bf590f5e3745d6a433119cf31f024e8c1cbb680d4e41"
          },
          {
            "right": "9a09e4b79ec54507896892ac23d8b5d707786b075ead58a69d51c4376805e9c1"
          }
        ]
      }
    ]
  }
}

```

##### Getting UCA properties template and generation values

```js
const ucaTemplate = UCA.getUCAProps('cvc:Contact:email', '1');
  //  ucaTemplate = {
  //     "name": "cvc:Contact:email",
  //     "version": "1",
  //     "basePropertyName": "contact.email",
  //     "properties": [
  //       {
  //         "name": "cvc:Email:username",
  //         "meta": {
  //           "required": false,
  //           "propertyName": "contact.email.username",
  //           "type": "String",
  //           "version": "1"
  //         }
  //       },
  //       {
  //         "name": "cvc:Domain:tld",
  //         "meta": {
  //           "required": true,
  //           "propertyName": "contact.email.domain.tld",
  //           "type": "String",
  //           "version": "1"
  //         }
  //       },
  //       {
  //         "name": "cvc:Domain:name",
  //         "meta": {
  //           "required": true,
  //           "propertyName": "contact.email.domain.name",
  //           "type": "String",
  //           "version": "1"
  //         }
  //       }
  //     ]
  //  }
```

So you can use the above `properties` array as a template for defining new UCA values. Given an array of properties and values, you can get a ucaValue ready for use on a new UCA:

```js
const propValues = [
  {
    name: 'cvc:Email:username',
    value: 'savio',
  },
  {
    name: 'cvc:Domain:name',
    value: 'civic',
  },
  {
    name: 'cvc:Domain:tld',
    value: 'com',
  },
];

const ucaValue = UCA.parseValueFromProps('cvc:Contact:email', propValues, '1');
// ucaValue = {
//   "username": "savio",
//   "domain": {
//     "name": "civic",
//     "tld": "com",
//   }
// }
const uca = new UCA('cvc:Contact:email', ucaValue, '1');

```

## Schema Generator

The json schema generator will get a previous definition and build a sample JSON (with random values).

On top of the sample data and combining the identifier properties it will infer an JSON Schema for validating the data.

A identifier like this:

Example
```javascript
const name = new UCA('cvc:Identity:name', {
  first: 'Joao', 
  middle: 'Barbosa', 
  last: 'Santos'
})
```

Will generate a JSON like this:


```
{
  first: 'Joao', 
  middle: 'Barbosa', 
  last: 'Santos'
}
```

The schema generator will generate an json schema like this:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "cvc:Identity:name.first",
  "type": "object",
  "properties": {
    "first": {
      "type": "string"
    }
  },
  "required": [
    "first"
  ],
  "additionalProperties": false
}
```

## Conventions:

-We use draft 7 for json schema generation

-Values that can have null, must have `type : ['null','string']` or else they fail validation if you only send null or if you send an value

-All simple objects String, Number are required as default

-Accepted json schema keywords on identifiers: pattern, maximum, minimum, exclusiveMinimum, exclusiveMaximum, required

-If an identifier has a pattern it must be an Javascript Regex, the generated value will generate the random value using this

-Additional properties are not enabled by default

## ES5 and ES6 definitions

The project structure is made like this:

```
|_ __tests__
|_ __integration__
|_ src
|_ dist
|__ cjs
|__ es
|__ browser
|_ reports
|__ coverage
```

* Tests and Integration folder contains jest tests
* src contains all ES6 non-transpiled source
* dist contains all transpiled code in CJS, ES, BROWSER presets of Babel
* also the package.json has the three fields main, module, browser, that allow packers to change the file of the entry point
* reports and coverage are all related to JEST tests

The released browser version is minified.

The main entry point targets CJS, all legacy code should work with this.

Sip-hosted-api is tested with this and it works right out of the box, without any other configuration.

Browser projects should bundle the dependencies, so we are not bundling it here.

The browser transpiled version only guarantees the profile we want to target and not leave this task to the user, since any other different transpilation, could result in bugs.

But as pointed out before, if the target project is ES6 compliant, the pkg.module will point out to the ES version.

## Node vs React usage of this library

Put this in your webpack config under plugins if you are running an Webpack Node App
```js
new webpack.DefinePlugin({
    'process.env': {
        NODE_ENV: 'production',
        APP_ENV: false
    }
})
```

If you are on a React app add this:

```js
new webpack.DefinePlugin({
    'process.env': {
        NODE_ENV: false,
        APP_ENV: 'browser'
    }
})
```

With that you can check if you're running in a browser or not this way:

```js

if (process.env.APP_ENV === 'browser') {
    const doSomething = require('./browser-only-js');
    doSomething();
} else {
    const somethingServer = require('./server-only-js');
    somethingServer();
}

if (process.env.APP_ENV !== 'browser') {
    const somethingServer = require('./server-only-js');
    somethingServer();
}
```

Because these environment variables get replaced during the build, Webpack will not include resources that are server-only. You should always do these kinds of things in an easy way, with a simple, direct compare. Uglify will remove all dead code.

Since you used a function before and the function is not evaluated during build, Webpack wasn't able to know what requires it could skip.

(The NODE_ENV-variable should always be set to production in production mode, since many libraries including React use it for optimisations.)

This is used on this library on src/services/config.js

Certainly! Here's a **README section** that explains to developers how to create new changelogs and release using Changesets, assuming the actual publishing and release process happens automatically via CI.

---

## 📦 Releasing and Versioning with Changesets

We use [Changesets](https://github.com/changesets/changesets) to manage versioning, changelogs, and releases.
This allows us to generate version updates and changelogs locally, and the release process is automated through our CI pipeline.

### Creating a New Changeset

Whenever you make changes that require a version bump (e.g., a new feature, bug fix, or breaking change), you'll need to create a changeset.

Changesets will automatically handle versioning and updating the changelog.

1. **Run the Changeset Command**:

   In your feature branch, run the following command to create a new changeset:

   ```bash
   yarn changeset
   ```

2. **Choose the Type of Change**:

   You'll be prompted to select the type of change:
  - **Patch**: Bug fixes or small updates.
  - **Minor**: New features that are backwards-compatible.
  - **Major**: Breaking changes.

3. **Write a Summary**:

   Add a short description of the changes. This will be added to the changelog for the new version.

4. **Commit the Changeset**:

   A new Markdown file will be created in the `.changeset` folder. Commit this file to your branch:

   ```bash
   git add .
   git commit -m "Add changeset for [your changes]"
   ```

6. **Push Your Branch and Create a Pull Request**:

   Push your feature branch and create a PR. Once this PR is merged, the version bump and release process will automatically be triggered by CI.

   ```bash
   git push origin your-branch
   ```

### Releasing a New Version

Once your PR is merged into main, the CI pipeline takes care of the rest:

1.	Release Branch Creation:
After merging, a GitHub Action will trigger, creating a pull request that contains updated version numbers and changelogs.

This is handled by the Changesets GitHub Action.
2. Versioning and Changelog:
The pull request will include a summary of the changes from all pending changesets.
Once this is merged, the action automatically updates the versions of the packages and edits the changelogs.
3.	Publishing to npm:
After the version pull request is merged, the CI workflow will automatically:
•	Publish the package to npm using yarn changeset publish.
•	Create a GitHub release with the updated changelogs.

### Important Notes

- **Releasing is automated**: As a developer, you don't need to run `yarn publish` or create the GitHub release manually. CI will handle this after your changes are merged into the `main` branch.

- **Keep Changesets in mind**: Always make sure to add a changeset for any meaningful change that should be reflected in the next release (bug fixes, new features, or breaking changes).

