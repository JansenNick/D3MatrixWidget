import React, { useRef, useEffect, useState, createElement, ReactElement } from "react";
import * as d3 from "d3";
import data from "./dataExperiment";
import { ListValue, EditableValue, ActionValue, ListAttributeValue } from "mendix";
import * as reorder from "reorder.js"

export interface MatrixContainerProps {
    nodes?: ListValue;
    nodeID?: ListAttributeValue<string>;
    links?: ListValue;
    linkSourceID?: ListAttributeValue<string>;
    linkTargetID?: ListAttributeValue<string>;
}

export default function MatrixComp(props: MatrixContainerProps): ReactElement {
    const svgRef = useRef();
    useEffect(() => {
        if (props.nodes.status === 'available' && props.links.status === 'available') {
            const nodes = props.nodes.items.map(obj => {
                return { "name": props.nodeID.get(obj).value }
            })
            const links = props.links.items.map(obj => {
                return {
                    "source": props.linkSourceID.get(obj).value,
                    "target": props.linkTargetID.get(obj).value,
                    "value": 5
                }
            })
            const graph = {
                "nodes": nodes,
                "links": links,
            }

            const margin = { top: 80, right: 0, bottom: 10, left: 80 },
                width = 720,
                height = 720;
            const svg = d3.select(svgRef.current);

            svg.attr("class", "test")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

            const nodeIds = d3.range(graph.nodes.length);

            const x = d3
                .scaleBand()
                .domain(nodeIds)
                .range([0, width]),
                z = d3
                    .scaleLinear()
                    .domain([0, 4])
                    .clamp(true),
                c = d3.scaleOrdinal(d3.range(10), d3.schemeCategory10);

            const g = svg
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            g.append("rect")
                .style("fill", "#eee")
                .attr("width", width)
                .attr("height", height);

            const matrix = graph.links
                .flatMap(({ source, target, value }) => [
                    [source, target, value],
                    [target, source, value]
                ])
                .concat(nodeIds.map(i => [i, i]));

            const labels = g
                .append("g")
                .style("font-size", "8px")
                .style("font-family", "sans-serif");

            const columns = labels
                .append("g")
                .selectAll()
                .data(nodeIds)
                .join("g")
                .attr("transform", "rotate(-90)")
                .append("g");
            columns
                .append("line")
                .attr("x2", -width)
                .style("stroke", "white");
            columns
                .append("text")
                .attr("dx", 2)
                .attr("dy", x.bandwidth() / 2 + 2)
                .text(i => graph.nodes[i].name);

            const rows = labels
                .append("g")
                .selectAll()
                .data(nodeIds)
                .join("g");
            rows
                .append("line")
                .attr("x2", width)
                .style("stroke", "white");
            rows
                .append("text")
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
                // .attr("fill", ([s, t]) =>
                //     graph.nodes[s].group === graph.nodes[t].group
                //         ? c(graph.nodes[t].group)
                //         : "black"
                // )
                .attr("fill-opacity", ([, , v]) => z(v));
            let prev;

            update(nodeIds);

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
                rows
                    .transition()
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
        }
    });
    return (
        <React.Fragment>
            <svg ref={svgRef}>
            </svg>
        </React.Fragment>
    );
}