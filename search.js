var stations = [
  "Abbey Road",
  "Arkley",
  "Ashby-in-Kirkside",
  "Ashdean",
  "Ashdean Bridge",
  "Astley",
  "Avonhill",
  "Bawtry Road",
  "Belmond Green",
  "Broomfield",
  "Cuffley",
  "Elmtree House",
  "Fayre",
  "Fleetwood",
  "Forestdale",
  "Fortis Green",
  "freston Junction",
  "Henley Park",
  "Hulme Heath",
  "Ive",
  "Leaton",
  "Longbow",
  "Longbow Beach",
  "Meryon",
  "Mill Bridge",
  "Newhurst",
  "Norrington",
  "Northcote",
  "Osidge Hill",
  "Rosebury Park",
  "Rowton",
  "Russel Lane",
  "St James Park",
  "Stirling Street",
  "Syde-On-Sea",
  "Thornfield",
  "Union Street",
  "Victoria Docks",
  "Victoria Harbour",
  "Wallsend",
  "Whetstone",
  "Woodham"
];

$("#from-station").autocomplete({
  source: stations,
  select: function(event, ui) {
    fromStation = ui.item.value;
  }
});
$("#to-station").autocomplete({
  source: stations,
  select: function(event, ui) {
    toStation = ui.item.value;
  }
});