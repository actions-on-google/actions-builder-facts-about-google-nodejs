/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const {
  conversation,
  Simple,
  Canvas,
  Card,
  Link,
  Suggestion,
  Image,
} = require('@assistant/conversation');
const functions = require('firebase-functions');
const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);

const app = conversation({debug: true});

const categories = {
  history: {
    facts: [
      'Google has more than 70 offices in more than 40 countries.',
      'Google went public in 2004.',
      'Google was founded by Larry Page and Sergey Brin.',
      'Google was founded in 1998.',
    ],
    image: {
      name: `google.png`,
      altText: 'Google app logo',
    },
  },
  headquarters: {
    facts: [
      'Google has over 30 cafeterias in its main campus.',
      'Google\'s headquarters is in Mountain View, California.',
      'Google has over 10 fitness facilities in its main campus.',
    ],
    image: {
      name: `googleplex.png`,
      altText: 'Googleplex',
    },
  },
  cats: {
    facts: [
      'Cats are animals.',
      'Cats descend from other cats.',
      'Cats have nine lives.',
    ],
    image: {
      name: `cat.png`,
      altText: 'Gray cat',
    },
  },
};

app.handle('get_fact', (conv) => {
  const category = conv.scene.slots.fact_category.value;
  const prefix = `Sure, here\'s a ${category} fact.`;
  const facts = categories[category].facts;
  const fact = facts[Math.floor(Math.random() * facts.length)];
  const image = categories[category].image;
  const webAppUrl = `https://${firebaseConfig.projectId}.web.app`;
  const supportsInteractiveCanvas = conv.device.capabilities.includes("INTERACTIVE_CANVAS");
  const supportsRichResponse = conv.device.capabilities.includes("RICH_RESPONSE");
  if (supportsInteractiveCanvas) {
    conv.add(new Canvas({
      url: webAppUrl,
      data: {
        text: fact,
        image: image.name,
        altText: image.altText,
      }
    }));
  } else if (supportsRichResponse) {
    conv.add(new Card({
      title: fact,
      image: new Image({
        url: `${webAppUrl}/assets/images/${image.name}`,
        alt: image.altText,
      }),
      button: new Link({
        name: 'Learn more',
        open: {
          url: 'https://www.google.com/about/',
        },
      }),
    }));
  }
  conv.add(new Simple({
    speech: `${prefix} ${fact}`,
    text: prefix,
  }));
  conv.add(new Suggestion({title: 'Yes'}));
  conv.add(new Suggestion({title: 'No'}));
  conv.add(new Suggestion({title: 'Headquarters'}));
  conv.add(new Suggestion({title: 'History'}));
  conv.add(new Suggestion({title: 'Quit'}));
});

exports.ActionsOnGoogleFulfillment = functions.https.onRequest(app);
