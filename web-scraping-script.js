const Nightmare = require('nightmare');
const nightmare = Nightmare( {show: true} );
const fs = require('fs');

nightmare
  .goto('https://www.apartmentlist.com/co/denver')
  .evaluate(() => {
    const apartmentCards = Array.from(document.querySelectorAll('.listing-details'));
    const apartmentData = apartmentCards.map((apartmentCard) => {
      let name = apartmentCard.querySelector('.listing-name').innerText;
      let address = apartmentCard.querySelector('.listing-contact-info').innerText;
      return {name, address};
    });
    return apartmentData;
  })
  .end()
  .then(result => {
    fs.writeFile('apartmentData.json', JSON.stringify(result, null, "\t"), (error) => {
      if (error) {
        console.log('Somthing went wrong:', error)
      }
    });
    console.log('The file has been saved!')
  })
  .catch(error => {
    console.log('Somthing went wrong:', error)
  })
  