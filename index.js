const fetch = require('node-fetch');
const cheerio = require('cheerio');

const URL = 'http://focalpointlights.com/products/linear';
const MATCH_IES = /ies$/i;
const MATCH_BIM = /zip$/i;
const COLUMNS = [
  'Manufacturer',
  'Series',
  'Main Photo',
  'Cutsheet',
  'BIM',
  'Photometry',
];
console.log(COLUMNS.join(', '));
let $;
fetch(URL)
  .then(res => res.text())
  .then((body) => {
    const fetches = [];
    $ = cheerio.load(body);
    $('.search-result').each((index, element) => {
      const resultUrl = $(element).find('.product-title a').attr('href');
      fetches.push(
        fetch(`http://focalpointlights.com${resultUrl}`)
          .then(res => res.text())
      );
    });
    Promise.all(fetches)
      .then((results) => {
         for (let i = 0; i < results.length; i += 1) {
           const columns = [];
           const ies = [];
           let hasBim = false;
           columns.push('Focal Point'); // Manufacturer
           $ = cheerio.load(results[i]);
           columns.push($('.page-title').text()); // Series
           columns.push($('#product-image img').attr('src')); // Main Photo
           $('#product-documents .download-wrapper').each((index, element) => {
             const download$ = $(element);
             const downloadUrl = download$.attr('nodepath');
             if (index === 0) {
               columns.push(downloadUrl);
               return;
             } // Cutsheet
             if (MATCH_BIM.test(downloadUrl)) {
               hasBim = true;
               columns.push(downloadUrl);
               return;
             } // BIM
             if (!MATCH_IES.test(downloadUrl)) return;
             ies.push(downloadUrl);
           });
           for (let j = 0; j < ies.length; j += 1) {
             if (hasBim) {
               console.log([...columns, ies[j]].join(', '));
             } else {
               console.log([...columns, '', ies[j]].join(', '));
             }
           }
         }
      })
  });
