// script.js

// Parse the stations.json file and create a graph data structure
const graph = {};
fetch('stations.json')
  .then(response => response.json())
  .then(data => {
    const mainline = data.Mainline;
    mainline.forEach(section => {
      const stations = section.Stations;
      stations.forEach(station => {
        const from = station.from;
        const to = station.to;
        if (!graph[from]) graph[from] = {};
        if (!graph[to]) graph[to] = {};
        graph[from][to] = true;
      });
    });
  })
  .catch(error => console.error('Error fetching data:', error));

// Function to generate a list of journeys
function generateJourneys(from, to, timeframe) {
  const journeys = [];
  // Use the graph data structure to find all possible journeys between from and to
  // within the given timeframe
  // ...
  return journeys;
}

// Function to render a journey
function renderJourney(journey) {
  const html = document.getElementById('journey-template').innerHTML;
  const renderedHtml = Mustache.render(html, journey);
  const journeyElement = document.createElement('div');
  journeyElement.innerHTML = renderedHtml;
  document.getElementById('journey-list').appendChild(journeyElement);
  // Attach a click event handler to the journey element
  journeyElement.addEventListener('click', () => {
    // Extend the journey to show all calling points
    // ...
  });
}

// Get the search query from the journey.html file
const searchInput = document.getElementById('search-input');
const searchQuery = searchInput.value;

// Use the search query to generate a list of journeys
const journeys = generateJourneys(searchQuery.from, searchQuery.to, searchQuery.timeframe);

// Render the list of journeys on the page
journeys.forEach(renderJourney);

// Add an event listener to the search input field
searchInput.addEventListener('input', () => {
  const searchQuery = searchInput.value;
  const journeys = generateJourneys(searchQuery.from, searchQuery.to, searchQuery.timeframe);
  document.getElementById('journey-list').innerHTML = '';
  journeys.forEach(renderJourney);
});