function dijkstraCalculation(graph, start, end, step) {

  const weight = {};
  const previous = {};
  const visited = new Set();
  const nodes = new Set(Object.keys(graph));

  // On regarde s'il y a des steps
  if (step && step.length > 0) {
    const fullPath = [];
    let totalWeight = 0;
    let currentStart = start;

    // On itère sur chaque step et le point d'arrivée
    for (const stop of [...step, end]) {
      // On calcule le chemin entre le point de départ et le step
      const segment = dijkstraCalculation(graph, currentStart, stop);

      if (!segment.path.length) return { path: [], weight: null };

      // On enlève le premier élément du segment qu'on vient de calculer pour éviter le doublon, seulement si le fullPath n'est pas vide
      if (fullPath.length > 0) segment.path.shift();
      fullPath.push(...segment.path);
      totalWeight += segment.weight;
      currentStart = stop;
    }

    return {
      path: fullPath,
      weight: Number(totalWeight.toFixed(2))
    };
  }

  //On définit toutes les poids à Infinity pour les écraser à la première itération sur le node.
  for (const node of nodes) {
    weight[node] = Infinity;
  }
  //On définit le poids du node de départ à 0.
  weight[start] = 0;

  //On itère sur tous les nœuds du graphe tant qu'il y en a.
  while (nodes.size > 0) {

    //On cherche le nœud avec le poids le plus faible, car c'est avec lui qu'on va avancer.
    const current = Array.from(nodes).reduce((a, b) =>
      weight[a] < weight[b] ? a : b
    );

    //On vérifie si le nœud actuel est le nœud de fin, auquel cas, on sort de la boucle.
    if (current === end) break;

    //On enlève le nœud actuel de la liste des nœuds et l'ajoute à ceux qui ont été visité.
    nodes.delete(current);
    visited.add(current);

    //On itère sur tous les voisins du nœud actuel.
    for (const neighbor of graph[current]) {
      //On vérifie si le voisin a déjà été visité, auquel cas, on l'ignore.
      //(Car s'il a déjà été visité alors cela veut dire qu'on a déjà trouvé un chemin plus court vers lui)
      if (visited.has(neighbor.node)) continue;

      //On calcule le poids du voisin en ajoutant le poids du nœud actuel et le poids du voisin.
      const alt = weight[current] + neighbor.weight;

      //Si le poids du voisin est inférieur au poids enregistré, on met à jour le poids et le nœud précédent.
      if (alt < weight[neighbor.node]) {
        weight[neighbor.node] = alt;
        previous[neighbor.node] = current;
      }
    }
  }

  //On crée le chemin en partant du nœud de fin et en remontant jusqu'au nœud de départ.
  const path = reconstructPath(previous, start, end);

  return {
    path,
    weight: (weight[end] !== undefined && weight[end] !== Infinity)
        ? Number(weight[end].toFixed(2))
        : null  };
}

function reconstructPath(previous, start, end) {
  const path = [];
  let current = end;

  while (current !== start) {
    if (!current) return [];
    path.push(current);
    current = previous[current];
  }

  path.push(start);
  return path.reverse();
}

export { dijkstraCalculation };
