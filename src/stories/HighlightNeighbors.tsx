import React from 'react';
import { Stix2Visualizer } from '../components';
import { Stix2VisualizerProps } from '../stix2-visualizer';

/**
 *
 * @param {Stix2VisualizerProps} props Default story props
 * @returns {React.FC} Stix Visualizer Component
 */
export const Stix2HighlightNeighbors: React.FC<Stix2VisualizerProps> = (
  props: Stix2VisualizerProps
) => {
  return (
    <div>
      <Stix2Visualizer data={props.data}></Stix2Visualizer>
    </div>
  );
};
