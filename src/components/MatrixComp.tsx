/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { CSSProperties, useRef, useEffect, createElement, ReactElement } from "react";
import * as d3 from "d3";
import { ListValue, EditableValue, ListAttributeValue } from "mendix";
import reorder from "reorder.js/dist/reorder";

export interface MatrixContainerProps {
    nodes?: ListValue;
    nodeID?: ListAttributeValue<string>;
    nodeLabel?: ListAttributeValue<string>;
    nodeGroup?: ListAttributeValue<string>;
    links?: ListValue;
    linkSourceID?: ListAttributeValue<string>;
    linkTargetID?: ListAttributeValue<string>;
    sortAlgorithm: EditableValue<string>;
    className?: string;
    style?: CSSProperties;
    width?: number;
    height?: number;
    marginLeft?: number;
    marginRight?: number;
    marginTop?: number;
    marginBottom?: number;
    animation: boolean;
}

export default function MatrixComp(props: MatrixContainerProps): ReactElement {
    const svgRef = useRef();

    useEffect(() => {
        if (props.nodes.status === "available" && props.links.status === "available") {
            const nodes = props.nodes.items.map(obj => {
                return {
                    name: props.nodeLabel.get(obj).value,
                    id: props.nodeID.get(obj).value,
                    index: 0,
                    count: 0,
                    group: props.nodeGroup.get(obj).value
                };
            });
            const idNodes = nodes.flatMap(x => x.id);
            const filteredLinks = props.links.items.filter(obj => {
                if (
                    idNodes.includes(props.linkSourceID.get(obj).value) &&
                    idNodes.includes(props.linkTargetID.get(obj).value)
                ) {
                    return true;
                } else {
                    console.warn("Source or target id of link not found for object " + JSON.stringify(obj));
                }
                return false;
            });
            const links = filteredLinks.map(obj => {
                return {
                    source: props.linkSourceID.get(obj).value,
                    target: props.linkTargetID.get(obj).value,
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

            const margin = {
                top: props.marginTop,
                right: props.marginRight,
                bottom: props.marginBottom,
                left: props.marginLeft
            };
            const width = props.width;
            const height = props.height;
            const svg = d3.select(svgRef.current);

            svg.selectAll("*").remove();

            svg.attr("class", props.className)
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

            const nodeIds = d3.range(graph.nodes.length);

            const x = d3.scaleBand().domain(nodeIds).range([0, width]);
            const z = d3.scaleLinear().domain([0, 4]).clamp(true);
            const c = d3.scaleOrdinal(d3.range(10), d3.schemeCategory10);

            const g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            g.append("rect").style("fill", "#eee").attr("width", width).attr("height", height);
            const index = nodes.map((d, i) => ("id" in d ? d.id : i));

            const matrix = graph.links
                .flatMap(({ source, target, value }) => [
                    [index.indexOf(source.toString()), index.indexOf(target.toString()), value],
                    [index.indexOf(target.toString()), index.indexOf(source.toString()), value]
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
                .attr("id", i => "v_id_" + graph.nodes[i].name)
                .text(i => graph.nodes[i].name);

            const rows = labels.append("g").selectAll().data(nodeIds).join("g");
            rows.append("line").attr("x2", width).style("stroke", "white");
            rows.append("text")
                .attr("text-anchor", "end")
                .attr("dx", -2)
                .attr("dy", x.bandwidth() / 2 + 2)
                .attr("id", i => "h_id_" + graph.nodes[i].name)
                .text(i => graph.nodes[i].name);

            const rects = g
                .append("g")
                .attr("transform", "translate(1,1)")
                .selectAll()
                .data(matrix)
                .join("rect")
                .on("click", function (MouseEvent, d) {
                    d3.selectAll("text").style("fill", "black").attr("class", "");
                    d3.selectAll("rect").style("stroke", "").style("stroke-width", "").attr("class", "");
                    d3.select("#h_id_node" + d[1].toString())
                        .style("fill", "orange")
                        .attr("class", props.className + "-selected");
                    d3.select("#v_id_node" + d[0].toString())
                        .style("fill", "orange")
                        .attr("class", props.className + "-selected");
                    d3.select(this)
                        .style("stroke", "orange")
                        .style("stroke-width", 2)
                        .attr("class", props.className + "-selected");
                })
                .attr("width", x.bandwidth() - 2)
                .attr("height", x.bandwidth() - 2)
                .attr("fill", ([s, t]) => {
                    return graph.nodes.find(el => el.index === s).group === graph.nodes.find(el => el.index === t).group
                        ? c(graph.nodes.find(el => el.index === t).group)
                        : "black";
                })
                .attr("fill-opacity", ([, , v]) => z(v));
            let prev;

            update(nodeIds);

            // eslint-disable-next-line no-inner-declarations
            function update(permutation) {
                x.domain(permutation);
                const delay = prev && props.animation ? i => x(i) * 4 : 0;
                const delay2 = prev && props.animation ? ([i]) => x(i) * 4 : 0;
                const duration = prev && props.animation ? 1500 : 0;

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
                case "group": {
                    update(permutations.group());
                    break;
                }
                case "leafOrder": {
                    update(permutations.leafOrder());
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
            <svg id="testID" className={props.className} style={props.style} ref={svgRef}></svg>
        </React.Fragment>
    );
}

function orders({ nodes, links }) {
    const n = nodes.length;
    const matrix = Array.from(nodes, (_, i) => d3.range(n).map(j => ({ x: j, y: i, z: 0 })));
    const index = nodes.map((d, i) => ("id" in d ? d.id : i));
    const l = [];
    links.forEach(link => {
        const i = index.indexOf(link.source.toString());
        const j = index.indexOf(link.target.toString());
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

    const leafOrder = reorder.optimal_leaf_order();

    function computeLeaforder() {
        const order = leafOrder(adjacency);
        order.forEach((lo, i) => (nodes[i].leafOrder = lo));
        return nodes.map(n => n.leafOrder);
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
        group: () =>
            d3
                .range(n)
                .sort(
                    (a, b) => d3.ascending(nodes[a].group, nodes[b].group) || d3.ascending(nodes[a].name, nodes[b].name)
                ),
        leafOrder: computeLeaforder,
        rcm: computeRCM,
        spectral: computeSpectral
    };

    return orders;
}
