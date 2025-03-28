const routesFolder = 'https://raw.githubusercontent.com/RionPlaysTV/Regional-Rail-Journey-Planner.github.io/main/Routes/';

export function fetchRouteData(routeName) {
  return fetch(`${routesFolder}${routeName}.json`)
    .then(response => response.json())
    .then(routeData => routeData);
}

fetch(`${routesFolder}/Fayre-Leaton.json`)
  .then(response => response.json())
  .then(routeData => {
    console.log(`Route: ${routeData.route}`);
    console.log(`Forward: ${routeData.forward.join(', ')}`);
    console.log(`Reverse: ${routeData.reverse.join(', ')}`);
    console.log('---');
  });


function planJourney(startStation, endStation) {
  const routes = getRoutes(); // assume this function returns an array of route objects

  const bestRoute = routes.find((route) => {
    return route.forward.includes(startStation) && route.forward.includes(endStation);
  });

  if (bestRoute) {
    const startIndex = bestRoute.forward.indexOf(startStation);
    const endIndex = bestRoute.forward.indexOf(endStation);

    const journey = bestRoute.forward.slice(startIndex, endIndex + 1);

    console.log(`Journey from ${startStation} to ${endStation}:`);
    console.log(journey.join(', '));
  } else {
    console.log(`No route found from ${startStation} to ${endStation}`);
  }
}

function getRoutes() {
  fetch('routes.json')
    .then(response => response.json())
    .then(data => {
      // process the data here
    })
    .catch(error => console.error(error));
    return routes;
}