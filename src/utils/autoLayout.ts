import type { CanvasNode, Connection } from '../types';

// Simple layered auto-layout: assigns nodes to layers based on connections,
// then spaces them evenly within each layer.
export function autoLayout(nodes: CanvasNode[], connections: Connection[]): CanvasNode[] {
  if (nodes.length === 0) return [];

  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const incoming = new Map<string, string[]>();
  const outgoing = new Map<string, string[]>();

  for (const c of connections) {
    outgoing.set(c.from, [...(outgoing.get(c.from) || []), c.to]);
    incoming.set(c.to, [...(incoming.get(c.to) || []), c.from]);
  }

  // Topological layering via Kahn's algorithm
  const inDegree = new Map<string, number>();
  for (const n of nodes) {
    inDegree.set(n.id, (incoming.get(n.id) || []).length);
  }

  const layers: string[][] = [];
  const assigned = new Set<string>();

  while (assigned.size < nodes.length) {
    const layer: string[] = [];
    // Find all nodes with no unassigned incoming edges
    for (const n of nodes) {
      if (assigned.has(n.id)) continue;
      const deps = (incoming.get(n.id) || []).filter(d => !assigned.has(d));
      if (deps.length === 0) {
        layer.push(n.id);
      }
    }

    // If nothing found (cycles), just pick remaining unassigned
    if (layer.length === 0) {
      for (const n of nodes) {
        if (!assigned.has(n.id)) {
          layer.push(n.id);
          break;
        }
      }
    }

    layers.push(layer);
    for (const id of layer) assigned.add(id);
  }

  // Layout parameters
  const startX = 150;
  const layerSpacingY = 140;
  const nodeSpacingX = 180;
  const startY = 80;

  const result: CanvasNode[] = [];

  for (let layerIdx = 0; layerIdx < layers.length; layerIdx++) {
    const layer = layers[layerIdx];
    const totalWidth = (layer.length - 1) * nodeSpacingX;
    const offsetX = startX + (nodes.length > 5 ? 100 : 0) - totalWidth / 2 + 150;

    for (let nodeIdx = 0; nodeIdx < layer.length; nodeIdx++) {
      const nodeId = layer[nodeIdx];
      const original = nodeMap.get(nodeId)!;
      result.push({
        ...original,
        position: {
          x: offsetX + nodeIdx * nodeSpacingX,
          y: startY + layerIdx * layerSpacingY,
        },
      });
    }
  }

  return result;
}
