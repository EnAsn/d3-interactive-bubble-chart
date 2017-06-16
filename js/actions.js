var svgWidth = 960, svgHeight = 650;

// SVG we will draw to
var svg = d3.select("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight)
            .append("g")
            .attr("transform", "translate(0, 0)");

var nodes = d3.range(50).map(
        function() {
            var tmpRadius = Math.random() * 10 + 20;
            return {
                        radius: tmpRadius,
                        hashtag: 'tag-' + tmpRadius,
                        tagCategory: Math.round(tmpRadius),
                        tagCount: tmpRadius,
                    }
        });

var radiusScale = d3.scaleSqrt().domain([1, 30]).range([1, 30]);

var simulation = d3.forceSimulation()
                    .force("x", d3.forceX(svgWidth/2).strength(0.05))
                    .force("y", d3.forceY(svgHeight/2).strength(0.05))
                    .force("anticolliding", d3.forceCollide(function(d){
                        return radiusScale(d.radius);
                    }));

var circles = svg.selectAll(".hashtags")
                .data(nodes)
                .enter().append("circle")
                    .attr("class", "hashtags")
                    .attr("r", function (d) {
                        return radiusScale(d.radius);
                    })
                    .attr("fill", function() { return "hsl(" + Math.round(Math.random() * 360, 1) + ", 100%, 75%)" })
                    .style("stroke", "black")
                    .style("stroke-width", 1)
                    .attr("opacity", .5)
                    .on("mousemove", function(d) {
                        d3.select("#tooltip").style("top", d3.event.pageY + 20 + "px")
                            .style("left", d3.event.pageX + 20 + "px")
                            .select("#tag-content")
                                .text(d.hashtag);

                        d3.select("#tooltip").select("#category-content")
                            .text(d.tagCategory);

                        d3.select("#tooltip").select("#count-content")
                            .text(d.tagCount);

                        d3.select("#tooltip").classed("hidden", !1);
                    })
                    .on("mouseout", function() {
                        d3.select("#tooltip").classed("hidden", !0);
                    })
                    .on("click", function(d){
                        selectTag(d.tagCategory);
                        simulation
                            .alpha(1)
                            .force("anticolliding", d3.forceCollide(function(d){
                                return radiusScale(d.radius + 10);
                            }))
                            .restart();
                    });

    simulation.nodes(nodes)
        .on('tick', ticked);

function selectTag(selectedCategory) {
    d3.selectAll("circle").each( function(d){
      if(d.tagCategory == selectedCategory){
          var modifiedRadius = d.radius + 5;
          d.radius = d.radius + 5;
          if (d.radius >= 40) {
              d.radius = 40;
              modifiedRadius = 40;
          }
      }
      else {
          var modifiedRadius = d.radius - 5;
          d.radius = d.radius - 5;
          if (d.radius <= 1) {
              d.radius = 1;
              modifiedRadius = 1;
          }
      }
      d3.select(this).attr("r", modifiedRadius);
    });
}

function ticked() {
    circles
        .attr("cx", function(d) {
            return d.x;
        })
        .attr("cy", function(d) {
            return d.y;
        })

}
