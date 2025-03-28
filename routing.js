let routes;

fetch('https://www.regionalrail.co.uk/api/routes', {
  mode: 'no-cors',
})
  .then(response => response.json())
  .then(data => {
    // Process the data
  })
  .catch(error => {
    console.error(error);
  });

  const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: 'https://www.regionalrail.co.uk',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Add event listener to plan journey button
const planJourneyButton = document.querySelector('.button');

if (planJourneyButton) {
  planJourneyButton.addEventListener('click', () => {
    const startStationInput = document.querySelector('#from-station');
    const endStationInput = document.querySelector('#to-station');

    const fromStation = startStationInput.value;
    const toStation = endStationInput.value;

    console.log('From station:', fromStation);
    console.log('To station:', toStation);

    if (fromStation && toStation) {
      planJourney(fromStation, toStation);
    } else {
      console.error('Please enter both start and end stations');
    }
  });
} else {
  console.error('Plan journey button not found');
}

function planJourney(fromStation, toStation) {
  if (!routes) {
    console.error('No routes data available');
    return;
  }

  function findRoute(from, to) {
    for (const route of routes) {
      const callingPoints = route.callingPoints;
      const fromIndex = callingPoints.indexOf(from);
      const toIndex = callingPoints.indexOf(to);
  
      if (fromIndex === 0 && toIndex !== -1) {
        const routeCallingPoints = callingPoints.slice(1, toIndex + 1);
  
        const routeData = {
          from: from,
          to: to,
          callingPoints: routeCallingPoints,
        };
  
        // Put the JavaScript code block here
        showJourneyInfo(routeData);
  
        return routeData;
      } else if (fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex) {
        const routeCallingPoints = callingPoints.slice(fromIndex, toIndex + 1);
  
        const routeData = {
          from: from,
          to: to,
          callingPoints: routeCallingPoints,
        };
  
        // Put the JavaScript code block here
        showJourneyInfo(routeData);
  
        return routeData;
      }
    }
  
    return null;
  }
  
  // Define the showJourneyInfo function here
  function showJourneyInfo(route) {
    const searchForm = document.querySelector('.search-form');
    const journeyInfo = document.querySelector('.journey-info');
  
    searchForm.style.display = 'none';
    journeyInfo.style.display = 'block';
  
    const fromStation = document.querySelector('.from-station');
    const toStation = document.querySelector('.to-station');
    const journeyStations = document.querySelector('.journey-stations');
  
    fromStation.textContent = route.from;
    toStation.textContent = route.to;
    journeyStations.innerHTML = route.callingPoints.map(station => `<li>${station}</li>`).join('');
  }

  const route = findRoute(fromStation, toStation);

  if (route) {
    console.log(`Route from ${route.from} to ${route.to}:`);
    console.log(route.callingPoints);
  } else {
    console.log(`No route found from ${fromStation} to ${toStation}`);
  }
}