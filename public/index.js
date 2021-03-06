'use strict';

//list of bats
//useful for ALL 5 steps
//could be an array of objects that you fetched from api or database
const bars = [{
  'id': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'name': 'freemousse-bar',
  'pricePerHour': 50,
  'pricePerPerson': 20
}, {
  'id': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'name': 'solera',
  'pricePerHour': 100,
  'pricePerPerson': 40
}, {
  'id': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'name': 'la-poudriere',
  'pricePerHour': 250,
  'pricePerPerson': 80
}];

//list of current booking events
//useful for ALL steps
//the time is hour
//The `price` is updated from step 1 and 2
//The `commission` is updated from step 3
//The `options` is useful from step 4
const events = [{
  'id': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'booker': 'esilv-bde',
  'barId': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'time': 4,
  'persons': 8,
  'options': {
    'deductibleReduction': false
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}, {
  'id': '65203b0a-a864-4dea-81e2-e389515752a8',
  'booker': 'societe-generale',
  'barId': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'time': 8,
  'persons': 30,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}, {
  'id': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'booker': 'otacos',
  'barId': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'time': 5,
  'persons': 80,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}];

//list of actors for payment
//useful from step 5
const actors = [{
  'eventId': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'eventId': '65203b0a-a864-4dea-81e2-e389515752a8',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'eventId': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}];

function computePrice(bar, event) {
    var time_component;
    var people_component;
    var event_price;
    time_component = event.time * bar.pricePerHour;
    people_component = event.persons * bar.pricePerPerson;
    event_price = time_component + people_component;
    if (event.persons >= 60)
        event_price *= 0.5;
    else if (event.persons >= 20)
        event_price *= 0.7;
    else if (event.persons >= 10)
        event_price *= 0.9;
    event.price = event_price;
}

function computeCommission(event) {
    var event_commission;
    var insurance;
    var treasury;
    event_commission = 0.3 * event.price;
    insurance = 0.5 * event_commission;
    event.commission.insurance = insurance;
    treasury = event.persons;
    event.commission.treasury = treasury;
    event.commission.privateaser = event_commission - (insurance + treasury);
}

function computeDeductibleReductionPrice(event) {
    if (event.options.deductibleReduction)
        event.price += event.persons;
}

function computeTransactions(event_actors, event) {
    event_actors.payment.forEach(function(actor) {
        var deductible_reduction = event.options.deductibleReduction ? event.persons : 0;
        switch (actor.who) {
            case 'booker':
                actor.amount = event.price;
                break;
            case 'bar':
                actor.amount = event.price - deductible_reduction - (event.commission.insurance
                  + event.commission.treasury + event.commission.privateaser);
                break;
            case 'insurance':
                actor.amount = event.commission.insurance;
                break;
            case 'treasury':
                actor.amount = event.commission.treasury;
                break;
            case 'privateaser':
                actor.amount = event.commission.privateaser + deductible_reduction;
                break;
        }
    });
}

(function() {
    events.forEach(function(event) {
        var bar = bars.find(bar => bar.id === event.barId);
        computePrice(bar, event);
        computeCommission(event);
        computeDeductibleReductionPrice(event);
    });
    actors.forEach(function(event_actors) {
        var event = events.find(event => event.id === event_actors.eventId);
        computeTransactions(event_actors, event);
    });
})();

console.log(bars);
console.log(events);
console.log(actors);
