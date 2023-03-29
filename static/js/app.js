const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// load drop down menu from loadDropDown function 
loadDropDown()

// load all the functions (bar, bubble, demographic info)
function optionChanged(sample_id) {
    buildChart(sample_id)
    buildBubble(sample_id)
    collectMeta(sample_id);
}

// Drop Down function
function loadDropDown() {
    // promise then fetch the JSON data
    d3.json(url).then(function(data) {
        // var for name in data
        var sample_names = data.names
            // var for selected id=selDataset (DOM)
        var dropDown = d3.select('#selDataset')
            // for loop
        for (var i = 0; i < sample_names.length; i++) {
            // append to selected dropDown to the option tag
            dropDown.append('option')
                // appends the name
                .text(sample_names[i])
                // appends the value
                .property("value", sample_names[i])
        }
        // displays the charts and data right at the loading
        buildChart(sample_names[0]),
            buildBubble(sample_names[0]),
            collectMeta(sample_names[0])
    })
}

// function show the demographic info
function collectMeta(sample_id) {
    // promise then fetch the JSON data
    d3.json(url).then(function(data) {
        // var for metadata form JSON
        var metadata = data.metadata;
        // ilter the data for the object with the desired sample number (== to sample_id)
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample_id);
        // extract the first (and only) object that satisfied the condition
        var result = resultArray[0];
        // Use d3 to select the id of `#sample-metadata`
        var demogInfo = d3.select("#sample-metadata");
        // Use `.html(“”) to clear any existing metadata
        demogInfo.html("");
        // Use `Object.entries` to add each key and value pair to the panel
        Object.entries(result).forEach(([key, value]) => {
            // append new tags for each key-value in the metadata
            demogInfo.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    });
}

function buildChart(sample_id) {

    // Fetch then JSON data and console log it
    d3.json(url).then(function(data) {
        console.log(data);

        // assigning the samples array from the data object to a new var samples.
        var samples = data.samples
            // filtering the samples array based on the id property of each sample object,
            // keeps the sample objects that match the sample_id provided as an argument
        var sample_array = samples.filter(sample => sample.id == sample_id)
            // assigns the first (and only) object in the sample_array to a new variable,
            // ensures we are working with a single object
        var sample_result = sample_array[0]
            // log it to the console 
        console.log(sample_result)

        // Fetch otu_ids as the labels for the bar chart.
        var bar_otu_ids = sample_result.otu_ids.slice(0, 10).map(otu_id => "OTU " + otu_id).reverse()
            // log it to the console
        console.log(bar_otu_ids)

        // Fetch otu_labels as the hovertext for the chart.
        var bar_otu_lables = sample_result.otu_labels.slice(0, 10).reverse()
        console.log(bar_otu_lables)
            // Fetch sample_values as the values for the bar chart.
        var bar_sample_values = sample_result.sample_values.slice(0, 10).reverse()
            // log it to the console
        console.log(bar_sample_values)

        // plotting the bar chart
        var plotBar = [{
            x: bar_sample_values,
            y: bar_otu_ids,
            type: 'bar',
            text: bar_otu_lables,
            orientation: 'h'
        }];

        // plotting the layout
        var barLayaout = {
            title: "Top 10 OTUs Found in this Individual",
            xaxis: { title: "Sample Values" },
            yaxis: { title: "OTU IDs" }
        }

        // shows the bar chart, the layout at the 'bar' id in the index.html (DOM)
        Plotly.newPlot('bar', plotBar, barLayaout);
    });
}

function buildBubble(sample_id) {
    // Promise then fetch the JSON data
    d3.json(url).then(function(data) {
        // assigning the samples array from the data object to a new var samples.
        var samples = data.samples
            // filtering the samples array based on the id property of each sample object,
            // keeps the sample objects that match the sample_id provided as an argument
        var sample_array = samples.filter(sample => sample.id == sample_id)
            // assigns the first (and only) object in the sample_array to a new variable,
            // ensures we are working with a single object
        var sample_result = sample_array[0]
        console.log(sample_result)

        // Fetch otu_ids for the x values.
        // Fetch otu_ids for the marker colors.
        var bubble_otu_ids = sample_result.otu_ids
            // log it to the console
        console.log(bubble_otu_ids)

        // Fetch sample_values for the y values.
        // Fetch sample_values for the marker size.
        var bubble_sample_values = sample_result.sample_values
            // log it to the console
        console.log(bubble_sample_values)
            // Fetch otu_labels for the text values.
        var bubble_otu_labels = sample_result.otu_labels

        // create a bubble chart 
        var plotBubble = [{
            x: bubble_otu_ids,
            y: bubble_sample_values,
            mode: 'markers',
            marker: {
                size: bubble_sample_values,
                color: bubble_sample_values,
                colorscale: 'Earth',
            },
            text: bubble_otu_labels
        }];

        // plotting the layout
        var bubbleLayout = {
            xaxis: { title: 'OTU ID' },
            // automatic magin for the y axis
            automargin: true,
            // yaxis: { title: 'Sample Values' },
            hovermode: 'closest',
        };

        // shows the bubble chart, the layout at the 'bubble' id in the index.html (DOM)
        Plotly.newPlot('bubble', plotBubble, bubbleLayout);

    })

}