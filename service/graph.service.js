// based on the structure of this article : https://www.datacamp.com/fr/tutorial/dijkstra-algorithm-in-python?dc_referrer=https%3A%2F%2Fwww.google.com%2F
function buildGraph(geojson) {
    const graph = {};

    geojson.features.forEach((feature) => {
        if (feature.geometry.type === 'LineString') {

            const source = feature.properties.source;
            const target = feature.properties.target;
            const weight = feature.properties.weight;

            if (!graph[source]) graph[source] = [];
            if (!graph[target]) graph[target] = [];

            graph[source].push({ node: target, weight });
            graph[target].push({ node: source, weight });
        }
    });

    return graph;
}

module.exports = { buildGraph };
