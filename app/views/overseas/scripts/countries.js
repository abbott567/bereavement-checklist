const countries = {
  type: country => {
    const countryType = {resident: false, insurance: false};
    const resident = countries.resident();
    const insurance = countries.insurance();

    if (resident.indexOf(country) > -1) {
      countryType.resident = true;
    } else if (insurance.indexOf(country) > -1) {
      countryType.insurance = true;
    }

    return countryType;
  },

  resident: () => {
    const resident = [
      'australia',
      'canada',
      'new zealand'
    ];
    return resident;
  },

  insurance: () => {
    const insurance = [
      'barbados',
      'bermuda',
      'guernsey',
      'israel',
      'jamaica',
      'jersey',
      'mauritius',
      'philippines',
      'turkey',
      'united states of america',
      'austria',
      'belgium',
      'bosnia and herzegovina',
      'croatia',
      'cyprus',
      'czech republic',
      'denmark',
      'estonia',
      'finland',
      'france',
      'germany',
      'gibraltar',
      'greece',
      'hungary',
      'iceland',
      'ireland',
      'isle of man',
      'italy',
      'latvia',
      'liechtenstein',
      'lithuania',
      'luxembourg',
      'macedonia',
      'malta',
      'montenegro',
      'netherlands',
      'norway',
      'poland',
      'portugal',
      'serbia',
      'slovakia',
      'slovenia',
      'spain',
      'sweden',
      'switzerland'
    ];

    return insurance;
  }
};
module.exports = countries;
