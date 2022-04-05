function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      // Filtered Data Based on Desired Number....
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      // Use D3
      var PANEL = d3.select("#sample-metadata");
  
      // Use `.html("") 
      PANEL.html("");
  
      // Use `Object.entries` 
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  
      // Guage Chart
      buildGauge(result.wfreq);
    });
  }
  
  function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
      var samples = data.samples;
      var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
  
      var otu_ids = result.otu_ids;
      var otu_labels = result.otu_labels;
      var sample_values = result.sample_values;
  
      // Bubble Chart
      var bubbleLayout = {
        title: "Cultures of Bacteria (Per Sample Taken)",
        margin: { t: 0 },
        hovermode: "closest",
        xaxis: { title: "OTU ID" },
        margin: { t: 30}
      };
      var bubbleData = [
        {
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: "markers",
          marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "oranges"
          }
        }
      ];
  
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  
      var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
      var barData = [
        {
          x: yticks,
          y: sample_values.slice(0, 10).reverse(),
          text: otu_labels.slice(0, 10).reverse(),
          type: "bar",
          orientation: "v",
        }
      ];
  
      var barLayout = {
        title: "Bacteria Cultures (Top 10)",
        margin: { t: 30, l: 150 }
      };
  
      Plotly.newPlot("bar", barData, barLayout);
    });
  }
  
  function init() {
    // Dropdown Selection
    var selector = d3.select("#selDataset");
  
    // Sample Names for Selection
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Build Intial Plots
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  function optionChanged(newSample) {
    // New Sample Selected.....Fetch Data
    buildCharts(newSample);
    buildMetadata(newSample);
  }
  
  // Generate Webpage
  init();
