fetch('https://https://rionplaystv.github.io/Regional-Rail-Journey-Planner.github.io/routes.json')
  .then(response => response.json())
  .then(data => {
    const routes = data.routes;
    // Do something with the routes data
  });