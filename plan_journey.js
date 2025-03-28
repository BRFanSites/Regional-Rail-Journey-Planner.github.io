import { planJourney } from './plan_journey.js';

// Add event listener to plan journey button
const planJourneyButton = document.querySelector('.button');

if (planJourneyButton) {
  planJourneyButton.addEventListener('click', () => {
    const startStationInput = document.querySelector('#from-station');
    const endStationInput = document.querySelector('#to-station');

    let fromStation;
    let toStation;

    startStationInput.addEventListener('change', () => {
      fromStation = startStationInput.value;
      console.log('Start station:', fromStation);
    });

    endStationInput.addEventListener('change', () => {
      toStation = endStationInput.value;
      console.log('End station:', toStation);
    });

    console.log('From station:', fromStation || 'empty');
    console.log('To station:', toStation || 'empty');

    if (fromStation && toStation) {
      planJourney(fromStation, toStation);
    } else {
      console.error('Please enter both start and end stations');
    }
  });
} else {
  console.error('Plan journey button not found');
}