allData();

        function dropdown() {
            var e = document.getElementById("dropD");
            var strUser = e.options[e.selectedIndex].text;

            document.getElementById("viz").innerHTML = "";

            var visualization = d3plus.viz()
                .container("#viz")
                .data("data/summer_data.csv")
                .type("tree_map")
                .id(["region", "subregion", "key"])
                .tooltip({"value": ["value", "gold", "silver", "bronze"], "children": false, "share": false})
                .size("value")
                .depth(2).id({
                    "solo": strUser
                }).draw()
        }

        function allData() {
            document.getElementById("viz").innerHTML = "";

            var visualization = d3plus.viz()
                .container("#viz")
                .data("data/summer_data.csv")
                .type("tree_map")
                .id(["region", "subregion", "key"])
                .size("value")
                .tooltip({"value": ["value", "gold", "silver", "bronze"], "children": false, "share": false})
                .draw()
        }

        function goldOnly() {
            document.getElementById("viz").innerHTML = "";

            var visualization = d3plus.viz()
                .container("#viz")
                .data("data/summer_data.csv")
                .type("tree_map")
                .id(["region", "subregion", "key"])
                .size("gold")
                .tooltip({"value": ["value", "gold"]})
                .draw();
        }

        function silverOnly() {
            document.getElementById("viz").innerHTML = "";

            var visualization = d3plus.viz()
                .container("#viz")
                .data("data/summer_data.csv")
                .type("tree_map")
                .id(["region", "subregion", "key"])
                .size("silver")
                .tooltip({"value": ["value", "silver"]})
                .draw();
        }

        function bronzeOnly() {
            document.getElementById("viz").innerHTML = "";

            var visualization = d3plus.viz()
                .container("#viz")
                .data("data/summer_data.csv")
                .type("tree_map")
                .id(["region", "subregion", "key"])
                .tooltip({"value": ["value", "bronze"]})
                .size("bronze")
                .draw();
        }