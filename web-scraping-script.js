const Nightmare = require('nightmare');
const nightmare = Nightmare( {show: true} );

nightmare
  .goto('https://www.apartmentlist.com/co/denver')
  .evaluate(() => {
    const appartmentCards = Array.from(document.querySelectorAll('.listing-details'));
    const appartmentData = appartmentCards.map((appartmentCard) => {
      let name = appartmentCard.querySelector('.listing-name').innerText;
      let address = appartmentCard.querySelector('.listing-contact-info').innerText;
      return {name, address};
    });
    return appartmentData;
  })
  .end()
  .then(result => {
    console.log(result)
  })
  .catch(error => {
    console.log('Somthing went wrong:', error)
  })
  