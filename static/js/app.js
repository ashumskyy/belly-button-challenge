const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

loadDropDown()


function optionChanged(sample_id) {
    buildChart(sample_id)
}

function loadDropDown() {
    d3.json(url).then(function(data) {
        var sample_names = data.names
        var dropDown = d3.select('#selDataset')
        for (var i = 0; i < sample_names.length; i++) {
            dropDown.append('option')
                .text(sample_names[i])
                .property("value", sample_names[i])
        }
        buildChart(sample_names[0])
    })
}


function buildChart(sample_id) {



    // Fetch the JSON data and console log it
    d3.json(url).then(function(data) {
        console.log(data);

        var samples = data.samples
        var sample_array = samples.filter(sample => sample.id == sample_id)
        var sample_result = sample_array[0]
        console.log(sample_result)

        var bar_otu_ids = sample_result.otu_ids.slice(0, 10).map(otu_id => "OTU " + otu_id).reverse()
        var bar_otu_lables = sample_result.otu_labels.slice(0, 10).reverse()
        var bar_sample_values = sample_result.sample_values.slice(0, 10).reverse()


        var plotBar = [{
            x: bar_sample_values,
            y: bar_otu_ids,
            type: 'bar',
            text: bar_otu_lables,
            orientation: 'h'
        }];

        var barLayaout = {
            title: "Top 10 OTUs Found in this Individual",
            xaxis: { title: "Sample Values" },
            yaxis: { title: "OTU IDs" }
        }


        Plotly.newPlot('bar', plotBar, barLayaout);
    });
}

// // Extracting the data form json
// var sampleData = data.samples[0]

// // Defining the trace for tha bar chart
// var trace1 = {

// }