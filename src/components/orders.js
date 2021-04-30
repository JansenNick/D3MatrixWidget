import reorder from "reorder.js/dist/reorder";

export default orders = ({ nodes, links }) => {
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
};
