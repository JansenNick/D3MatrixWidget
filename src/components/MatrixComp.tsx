import React, { useRef, useEffect, useState, createElement, ReactElement } from "react";
import * as d3 from "d3";
import data from "./dataOriginal";
import { ListValue, EditableValue, ActionValue, ListAttributeValue } from "mendix";
import reorder from "reorder.js/dist/reorder";
import { Order } from "reorder.js";
// import orders from "./orders";

export interface MatrixContainerProps {
    nodes?: ListValue;
    nodeID?: ListAttributeValue<string>;
    links?: ListValue;
    linkSourceID?: ListAttributeValue<string>;
    linkTargetID?: ListAttributeValue<string>;
    sortAlgorithm: EditableValue<string>;
}

export default function MatrixComp(props: MatrixContainerProps): ReactElement {
    // const order: Order = reorder;
    const svgRef = useRef();
    const svgElement = document.getElementById("testID");
    useEffect(() => {
        if (props.nodes.status === "available" && props.links.status === "available") {
            const nodes = props.nodes.items.map(obj => {
                return {
                    name: props.nodeID.get(obj).value,
                    index: 0,
                    count: 0,
                    group: Math.floor(Math.random() * 10)
                };
            });
            const links = props.links.items.map(obj => {
                return {
                    source: parseInt(props.linkSourceID.get(obj).value, 10),
                    target: parseInt(props.linkTargetID.get(obj).value, 10),
                    value: 5
                };
            });
            const graph = {
                nodes,
                links
            };
            const permutations = orders(graph);

            const matrixReorder = [];
            const nodesReorder = graph.nodes;
            const nReorder = nodesReorder.length;

            nodesReorder.forEach((node, i) => {
                node.index = i;
                node.count = 0;
                matrixReorder[i] = d3.range(nReorder).map(j => {
                    return { x: j, y: i, z: 0 };
                });
            });

            const margin = { top: 80, right: 0, bottom: 10, left: 80 };
            const width = 720;
            const height = 720;
            const svg = d3.select(svgRef.current);

            svg.selectAll("*").remove();

            svg.attr("class", "test")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

            const nodeIds = d3.range(graph.nodes.length);

            const x = d3.scaleBand().domain(nodeIds).range([0, width]);
            const z = d3.scaleLinear().domain([0, 4]).clamp(true);
            const c = d3.scaleOrdinal(d3.range(10), d3.schemeCategory10);

            const g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            g.append("rect").style("fill", "#eee").attr("width", width).attr("height", height);

            const matrix = graph.links
                .flatMap(({ source, target, value }) => [
                    [source, target, value],
                    [target, source, value]
                ])
                .concat(nodeIds.map(i => [i, i]));

            const labels = g.append("g").style("font-size", "8px").style("font-family", "sans-serif");

            const columns = labels
                .append("g")
                .selectAll()
                .data(nodeIds)
                .join("g")
                .attr("transform", "rotate(-90)")
                .append("g");
            columns.append("line").attr("x2", -width).style("stroke", "white");
            columns
                .append("text")
                .attr("dx", 2)
                .attr("dy", x.bandwidth() / 2 + 2)
                .text(i => graph.nodes[i].name);

            const rows = labels.append("g").selectAll().data(nodeIds).join("g");
            rows.append("line").attr("x2", width).style("stroke", "white");
            rows.append("text")
                .attr("text-anchor", "end")
                .attr("dx", -2)
                .attr("dy", x.bandwidth() / 2 + 2)
                .text(i => graph.nodes[i].name);

            const rects = g
                .append("g")
                .attr("transform", "translate(1,1)")
                .selectAll()
                .data(matrix)
                .join("rect")
                .attr("width", x.bandwidth() - 2)
                .attr("height", x.bandwidth() - 2)
                .attr("fill", ([s, t]) =>
                    graph.nodes[s].group === graph.nodes[t].group ? c(graph.nodes[t].group) : "black"
                )
                .attr("fill-opacity", ([, , v]) => z(v));
            let prev;

            update(nodeIds);

            // eslint-disable-next-line no-inner-declarations
            function update(permutation) {
                x.domain(permutation);

                const delay = prev ? i => x(i) * 4 : 0;
                const delay2 = prev ? ([i]) => x(i) * 4 : 0;
                const duration = prev ? 1500 : 0;

                columns
                    .transition()
                    .delay(delay)
                    .duration(duration)
                    .attr("transform", i => `translate(0, ${x(i)})`);
                rows.transition()
                    .delay(delay)
                    .duration(duration)
                    .attr("transform", i => `translate(0, ${x(i)})`);
                rects
                    .transition()
                    .delay(delay2)
                    .duration(duration)
                    .attr("x", ([s]) => x(s))
                    .attr("y", ([, t]) => x(t));

                prev = permutation;
                return permutation;
            }
            switch (props.sortAlgorithm.value) {
                case "barycenter": {
                    update(permutations.barycenter());
                    break;
                }
                case "count": {
                    update(permutations.count());
                    break;
                }
                case "group": {
                    update(permutations.group());
                    break;
                }
                case "leafOrder": {
                    update(permutations.leafOrder());
                    break;
                }
                case "leafOrderDist": {
                    update(permutations.leafOrderDist());
                    break;
                }
                case "name": {
                    update(permutations.name());
                    break;
                }
                case "none": {
                    update(permutations.none());
                    break;
                }
                case "rcm": {
                    update(permutations.rcm());
                    break;
                }
                case "spectral": {
                    update(permutations.spectral());
                    break;
                }
            }
        }
    });
    return (
        <React.Fragment>
            <svg id="testID" ref={svgRef}></svg>
        </React.Fragment>
    );
}

function orders({ nodes, links }) {
    const n = nodes.length;
    const matrix = Array.from(nodes, (_, i) => d3.range(n).map(j => ({ x: j, y: i, z: 0 })));
    const index = nodes.map((d, i) => ("id" in d ? d.id : i));
    const l = [];
    // eslint-disable-next-line guard-for-in
    for (const node in nodes) {
        nodes.count = 0;
    }
    links.forEach(link => {
        const i = index.indexOf(link.source);
        const j = index.indexOf(link.target);
        if (!("value" in link)) {
            link.value = 1;
        }
        matrix[i][j].z += link.value;
        matrix[j][i].z += link.value;
        matrix[i][j].z += link.value;
        matrix[j][i].z += link.value;
        nodes[i].count += link.value;
        nodes[j].count += link.value;
        l.push({ source: i, target: j, value: link.value });
    });

    const adjacency = matrix.map(row => row.map(c => c.z));

    const graph = reorder.graph().nodes(nodes).links(l).init();

    let dist_adjacency;

    const leafOrder = reorder.optimal_leaf_order();
    // .distance(science.stats.distance.manhattan);

    function computeLeaforder() {
        const order = leafOrder(adjacency);
        order.forEach((lo, i) => (nodes[i].leafOrder = lo));
        return nodes.map(n => n.leafOrder);
    }

    function computeLeaforderDist() {
        if (!dist_adjacency) {
            dist_adjacency = reorder.graph2valuemats(graph);
        }
        const order = reorder.valuemats_reorder(dist_adjacency, leafOrder);
        order.forEach((lo, i) => (nodes[i].leafOrderDist = lo));
        return nodes.map(n => n.leafOrderDist);
    }

    function computeBarycenter() {
        const barycenter = reorder.barycenter_order(graph);
        const improved = reorder.adjacent_exchange(graph, ...barycenter);
        improved[0].forEach((lo, i) => (nodes[i].barycenter = lo));
        return nodes.map(n => n.barycenter);
    }

    function computeRCM() {
        const rcm = reorder.reverse_cuthill_mckee_order(graph);
        rcm.forEach((lo, i) => (nodes[i].rcm = lo));
        return nodes.map(n => n.rcm);
    }

    function computeSpectral() {
        const spectral = reorder.spectral_order(graph);
        spectral.forEach((lo, i) => (nodes[i].spectral = lo));
        return nodes.map(n => n.spectral);
    }

    const orders = {
        none: () => d3.range(n),
        name: () => d3.range(n).sort((a, b) => d3.ascending(nodes[a].name, nodes[b].name)),
        count: () => d3.range(n).sort((a, b) => nodes[b].count - nodes[a].count),
        group: () =>
            d3
                .range(n)
                .sort(
                    (a, b) => d3.ascending(nodes[a].group, nodes[b].group) || d3.ascending(nodes[a].name, nodes[b].name)
                ),
        leafOrder: computeLeaforder,
        leafOrderDist: computeLeaforderDist,
        barycenter: computeBarycenter,
        rcm: computeRCM,
        spectral: computeSpectral
    };

    return orders;
}
