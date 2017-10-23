const request = require('request');
const cheerio = require('cheerio');

const MATCH_IES_FILE = /ies$/i;
const ROOT_URL = 'http://focalpointlights.com';
const URL = 'http://focalpointlights.com/products/linear';
let $;
request(URL, (error, response, html) => {
  if (error || response.statusCode !== 200) return;
  $ = cheerio.load(html);
  $('.search-result').each((index, element) => {
    const lightUrl = $(element).find('.product-title a').attr('href');
    request(`${ROOT_URL}${lightUrl}`, (lightError, lightResponse, lightHtml) => {
      if (lightError || lightResponse.statusCode !== 200) return;
      $ = cheerio.load(lightHtml);
      const series = $('.page-title').text();
      console.log(series);
      $('#product-documents .download-wrapper').each((downloadIndex, downloadElement) => {
        const downloadEl = $(downloadElement);
        const downloadUrl = downloadEl.attr('nodepath');
        if (!MATCH_IES_FILE.test(downloadUrl)) return;
        const iesName = downloadEl.find('.display-name').text();
        // TODO: ACTUALLY DOWNLOAD FILE
        console.log(iesName); // TEMP
        console.log(downloadUrl); // TEMP
      });
    });
  });
});
