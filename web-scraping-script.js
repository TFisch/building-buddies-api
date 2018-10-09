const Nightmare = require('nightmare');
const fs = require('fs');
const urls = [];

for (let i = 1; i < 11; i++) {
  urls.push(`https://www.apartmentlist.com/co/denver/page-${i}`);
}

const getApartmentData = async (url) => {
  try {
    const nightmare = Nightmare({ show: true });
    const result = await nightmare
      .goto(url)
      .evaluate(() => {
        const apartmentCards = Array.from(document.querySelectorAll('.listing-details'));
        const apartmentData = apartmentCards.map((apartmentCard) => {
          const name = apartmentCard.querySelector('.listing-name').innerText;
          const address = apartmentCard.querySelector('.listing-contact-info').innerText;
          return { name, address };
        });
        return apartmentData;
      })
      .end();

    return result;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

const finalData = urls.reduce(async (queue, url) => {
  let dataArray = await queue;
  const newData = await getApartmentData(url);
  dataArray = [...dataArray, ...newData];
  return dataArray;
}, Promise.resolve([]));

finalData.then((data) => {
  fs.writeFile('apartmentData.json', JSON.stringify(data, null, '\t'), (error) => {
    if (error) {
      console.log('Somthing went wrong:', error);
    }
  });
  console.log('The file has been saved!');
});
