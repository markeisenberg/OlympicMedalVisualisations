var margin = {
                t: 30,
                r: 20,
                b: 20,
                l: 40
            },
            w = 1000 - margin.l - margin.r,
            h = 600 - margin.t - margin.b,
            x = d3.scale.linear().range([0, w]),
            y = d3.scale.linear().range([h - 60, 0]),
            //colors that will reflect geographical regions
            color = d3.scale.category10();

        var formatxAxis = d3.format('.0f');

        var svg = d3.select("#chart").append("svg")
            .attr("width", w + margin.l + margin.r + 200)
            .attr("height", h + margin.t + margin.b);

        // set axes, as well as details on their ticks
        var xAxis = d3.svg.axis()
            .scale(x)
            .ticks(20)
            .tickSubdivide(true)
            .tickSize(6, 3, 0)
            .tickFormat(formatxAxis)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .ticks(20)
            .tickSubdivide(true)
            .tickSize(6, 3, 0)
            .orient("left");

        //loading text timeout
        setTimeout(fade_out, 5000);

        function fade_out() {
            $("#loading").fadeOut().empty();
        }

        // group that will contain all of the plots
        var groups = svg.append("g").attr("transform", "translate(" + margin.l + "," + margin.t + ")");

        // array of the regions, used for the legend
        var regions = ["Aquatics", "Archery", "Athletics", "Badminton",
                    "Baseball", "Basketball", "Boxing", "Canoe / Kayak"
                   , "Cycling", "Equestrian", "Fencing", "Football"
                  , "Gymnastics", "Handball", "Hockey"
                  , "Judo", "Lacrosse", "Modern Pentathlon"
                  , "Polo", "Rackets", "Roque", "Rowing", "Sailing", "Shooting", "Softball", "Table Tennis", "Taekwondo", "Tennis"
                  , "Triathlon", "Tug of War", "Volleyball", "Water Motorsports", "Weightlifting"
                  , "Wrestling"];


        var dropDown = d3.select("#filter").append("select")
            .attr("name", "country-list");

        var options = dropDown.selectAll("option")
            .data(["All"].concat(regions))
            .enter()
            .append("option");

        options.text(function (d) {
                return d;
            })
            .attr("value", function (d) {
                return d;
            });

        // bring in the data, and do everything that is data-driven
        d3.csv("data/olympicSingle.csv", function (data) {

            // sort data alphabetically by region, so that the colors match with legend
            data.sort(function (a, b) {
                return d3.ascending(a.sport, b.sport);
            })
            console.log(data)

            var x0 = Math.max(-d3.min(data, function (d) {
                return d.edition;
            }), d3.max(data, function (d) {
                return d.edition;
            }));
            x.domain([1896, 2008]);
            y.domain([0, 140])

            // style the circles, set their locations based on data
            var circles =
                groups.selectAll("circle")
                .data(data)
                .enter().append("circle")
                .attr("class", "circles")
                .attr({
                    cx: function (d) {
                        return x(+d.edition);
                    },
                    cy: function (d) {
                        return y(+d.id);
                    },
                    r: 3,
                    id: function (d) {
                        return d.athlete;
                    }
                })
                .style("fill", function (d) {
                    return color(d.sport);
                });

            // what to do when we mouse over a bubble
            var mouseOn = function () {
                var circle = d3.select(this);

                //redrawText();

                // transition to increase size/opacity of bubble
                circle.transition()
                    .duration(800).style("opacity", 1)
                    .attr("r", 6).ease("elastic");

                // append lines to bubbles that will be used to show the precise data points.
                // translate their location based on margins
                svg.append("g")
                    .attr("class", "guide")
                    .append("line")
                    .attr("x1", circle.attr("cx"))
                    .attr("x2", circle.attr("cx"))
                    .attr("y1", +circle.attr("cy") + 16) //here
                    .attr("y2", h - margin.t - margin.b)
                    .attr("transform", "translate(40,20)")
                    .style("stroke", circle.style("fill"))
                    .transition().delay(200).duration(400).styleTween("opacity",
                        function () {
                            return d3.interpolate(0, .5);
                        })

                svg.append("g")
                    .attr("class", "guide")
                    .append("line")
                    .attr("x1", +circle.attr("cx") - 6) //here
                    .attr("x2", 0)
                    .attr("y1", circle.attr("cy"))
                    .attr("y2", circle.attr("cy"))
                    .attr("transform", "translate(40,30)")
                    .style("stroke", circle.style("fill"))
                    .transition().delay(200).duration(400).styleTween("opacity",
                        function () {
                            return d3.interpolate(0, .5);
                        });

                // function to move mouseover item to front of SVG stage, in case
                // another bubble overlaps it
                d3.selection.prototype.moveToFront = function () {
                    return this.each(function () {
                        this.parentNode.appendChild(this);
                    });
                };

                // skip this functionality for IE9, which doesn't like it
                if (!$.browser.msie) {
                    circle.moveToFront();
                }
            };
            // what happens when we leave a bubble?
            var mouseOff = function () {
                var circle = d3.select(this);

                // go back to original size and opacity
                circle.transition()
                    .duration(800).style("opacity", .5)
                    .attr("r", 3).ease("elastic");

                // fade out guide lines, then remove them
                d3.selectAll(".guide").transition().duration(100).styleTween("opacity",
                        function () {
                            return d3.interpolate(.5, 0);
                        })
                    .remove()
            };

            // run the mouseon/out functions
            circles.on("mouseover", mouseOn);
            circles.on("mouseout", mouseOff);

            // tooltips (using jQuery plugin tipsy)
            circles.append("title")
                .text(function (d) {
                    return d.NOC + ", " + d.athlete + ", " + d.edition + ", " + d.medal;
                })

            $(".circles").tipsy({
                gravity: 's',
            });

            //***** Add legend ***** //

            /* // the legend color guide
            var legend = svg.selectAll("rect")
            		.data(regions)
            	.enter().append("rect")
            	.attr({
            	  x: function(d, i) { return (40 + i*80); },
            	  y: h,
            	  width: 25,
            	  height: 12
            	})
            	.style("fill", function(d) { return color(d); });


            // legend labels	
            	svg.selectAll("text")
            		.data(regions)
            	.enter().append("text")
            	.attr({
            	x: function(d, i) { return (40 + i*80); },
            	y: h + 24,
            	})
            	.text(function(d) { return d; }); */

           // var dataChoose = "data/olympicSingle.csv";

            // draw axes and axis labels
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(" + margin.l + "," + (h - 60 + margin.t) + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + margin.l + "," + margin.t + ")")
                .call(yAxis);

            svg.append("text")
                .attr("class", "x label")
                .attr("text-anchor", "end")
                .attr("x", w + 50)
                .attr("y", h - margin.t - 5)
                .text("Year");

            svg.append("text")
                .attr("class", "y label")
                .attr("text-anchor", "end")
                .attr("x", -20)
                .attr("y", 45)
                .attr("dy", ".75em")
                .attr("transform", "rotate(-90)")
                .text("Country ID");

            /* **** Attempt at differentiating overlapping scatterplot data points *****
            
            function redrawText() {
                
                myText
                    .data(dataChoose)
                    .style("opacity", 0)
                    .style("opacity", 1)
                    .text(function (d) {
                        return d.edition;
                    })
            }

            var myText = svg.append('text')
                .data(dataChoose)
                .attr('x', 1050)
                .attr('y', 150)
                .attr('fill', '#000')
                .classed('dataChoose', true)
                .text(function (d) {
                    return "not hovered"
                }); */

            dropDown.on("change", function () {
                var selected = this.value;
                displayOthers = this.checked ? "inline" : "none";
                display = this.checked ? "none" : "inline";

                if (selected == 'All') {
                    svg.selectAll(".circles")
                        .attr("display", display);
                } else {
                    svg.selectAll(".circles")
                        .filter(function (d) {
                            return selected != d.sport;
                        })
                        .attr("display", displayOthers);

                    svg.selectAll(".circles")
                        .filter(function (d) {
                            return selected == d.sport;
                        })
                        .attr("display", display);
                }
            });
            
            //displaying the NOC code table
            
            d3.text("data/olympicsCode.csv", function (data) {
            var parsedCSV = d3.csv.parseRows(data);

            var container = d3.select("body")
                .append("table")

            .selectAll("tr")
                .data(parsedCSV).enter()
                .append("tr")

            .selectAll("td")
                .data(function (d) {
                    return d;
                }).enter()
                .append("td")
                .text(function (d) {
                    return d;
                });
        });
        });