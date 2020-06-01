//Parse data.
function init() {var selector = d3.select("#selDataset");
   d3.json("samples.json").then((data) => {console.log(data);
      var samplenames = data.names;
      samplenames.forEach((sample) => {selector
        .append("option")
        .text(sample)
        .property("value", sample);
      });

      //Set defaults for charts.
      buildMetadata(940);
      buildCharts(940);
  })}
  

  function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
  }

  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultarray = metadata.filter(sampleObj => sampleObj.id == sample);
      console.log("resultarray",resultarray);
      var result = resultarray[0];
      console.log("result",result)
      var PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
      PANEL.append("h6").text(result.location);
      Object.entries(result).forEach(function([key,value]){
        PANEL.append("h6").text(key +":"+ value);
      
    });
  })};

  
  
  
  function buildCharts(sample){
    
    //Parse and read in JSON file.
    d3.json("samples.json").then((data) => {

    var sampledata = data.samples;
    var sampleresults = sampledata.filter(sampleObj => sampleObj.id == sample);
    var Result = sampleresults[0];
    var toptenvalues = (Result.sample_values).slice(0,10).reverse();
    var toptenbacteria = (Result.otu_ids).slice(0,10);
    var stringtoptenbacteria = toptenbacteria.map(id => "OTU"+id);
    var bacterialabels = (Result.otu_labels).slice(0,10);
    var metadata = data.metadata;
    var metadataarray = metadata.filter(sampleObj => sampleObj.id ==sample)
    var metadataresult = metadataarray[0];
    var wfreq = metadataresult.wfreq

    //Create bar chart.
    var trace1 = {x:toptenvalues, y:stringtoptenbacteria, type:"bar", 
    orientation:'h', hovertemplate: '<b>%{text}</b>', text:bacterialabels};
    var data1 = [trace1];
    var layout1 = {hoverlabel: { bgcolor: "#fff" }}
    Plotly.newPlot("bar", data1, layout1);

    //Create bubble chart.
    var otuIds= Result.otu_ids;
    var samplevalues = Result.sample_values;
    var trace2 = {x:otuIds,y:samplevalues, text:bacterialabels, mode:"markers", 
    marker:{size:samplevalues, color: otuIds, colorscale:"electric"}};
    var data2 = [trace2];
    var layout2 ={xaxis:{title:"OTU ID"}}
    Plotly.newPlot("bubble", data2, layout2)

    //Create gauge chart.
    var trace3 = {
    title: { text: "Frequency of Washing Belly Button" },
    type: "indicator",
    value: wfreq,
    mode: "gauge", 
    gauge:{axis:{visible:true,range:[0,10]}}
    // Add markers: [{type:"area",range:[0,1],"backgroundcolor":"white"}]
    };

    var data3 = [trace3]
    var layout3 = { width: 600, height: 400, margin: { t: 0, b: 0 }};
    Plotly.newPlot("gauge", data3, layout3);

  });
}





init();
