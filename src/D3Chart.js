import * as d3 from 'd3';

const urlMen = 'https://udemy-react-d3.firebaseio.com/tallest_men.json';
const urlWomen = 'https://udemy-react-d3.firebaseio.com/tallest_women.json';
const MARGIN = {TOP: 10, BOTTOM: 50, LEFT: 70, RIGHT: 10};
const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM;

export default class D3Chart {
    constructor(element) {
        const vis = this;
        // Returns reference to the last thing appended, the group in the svg
        // Centers the bar chart in the svg with the margin around it, so we can see the scales
        vis.svg = d3.select(element)
            .append("svg")
                .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
                .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
            .append("g")
                .attr("transform",  `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

        // Labels
        vis.svg.append("text")
            .attr("x", WIDTH / 2)
            .attr("y", HEIGHT + MARGIN.BOTTOM)
            .attr("text-anchor", "middle")
            .text("The world's tallest men")
        vis.svg.append("text")
            .attr("x", -(HEIGHT / 2))
            .attr("y", -40)
            .attr("text-anchor", "middle")
            .text("Height in cm")
            .attr("transform", "rotate(-90)")

        // Axis groups
        vis.xAxisGroup = vis.svg.append("g")
            .attr("transform", `translate(0, ${HEIGHT})`)
        vis.yAxisGroup = vis.svg.append("g")
        
        const menPromise = d3.json(urlMen)
        const womenPromise = d3.json(urlWomen)

        // Fetch data
        Promise.all([menPromise, womenPromise]).then((dataSet) => {
            const [men, women] = dataSet
            let flag = true;

            vis.data = men
            vis.update();

            d3.interval(() => {
                vis.data = flag ? men : women
                vis.update();
                flag = !flag
            }, 1000);
        });
    }

    update() {
        var vis = this;
        // Scales
        const y = d3.scaleLinear()
            .domain([
                d3.min(vis.data, d => d.height) * 0.95,
                d3.max(vis.data, d => d.height)
            ])
            .range([HEIGHT, 0])
        const x = d3.scaleBand()
            .domain(vis.data.map(d => d.name))
            .range([0, WIDTH])
            .padding(0.4)

        // Axis updates
        const xAxisCall = d3.axisBottom(x);
        vis.xAxisGroup.transition().duration(500).call(xAxisCall);

        const yAxisCall = d3.axisLeft(y);
        vis.yAxisGroup.transition().duration(500).call(yAxisCall);

        // DATA JOIN (associates any rects on screen with our data, or creates new rects if needed)
        const rects = vis.svg.selectAll("rect")
            .data(vis.data)

        // EXIT (removes any elements that dont exist in the new array of data)
        rects.exit()
            .transition().duration(500)
                .attr("height", 0)
                .attr("y", HEIGHT)
                .remove()

        // UPDATE (updates the attributes of the rects that exist in our data AND are already on screen)
        rects.transition().duration(500)
            .attr("x", d => x(d.name))
            .attr("y", d => y(d.height))
            .attr("width", x.bandwidth)
            .attr("height", d => HEIGHT - y(d.height))

        // ENTER (appending rects and updating attrs for anything in our data array but ISNT on screen yet)
        rects.enter().append("rect")
            .attr("x", d => x(d.name))
            .attr("width", x.bandwidth)
            .attr("fill", "grey")
            .attr("y", HEIGHT) // Added so the transition starts at the bottom of the chart
            .transition().duration(500)
                .attr("height", d => HEIGHT - y(d.height))
                .attr("y", d => y(d.height))
    }
}