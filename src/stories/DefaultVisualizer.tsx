import React from 'react';
import { Stix2Visualizer } from '../components';

interface DefaultStixVisualizerProps {
  data: object;
}

/**
 *
 * @param {DefaultStixVisualizerProps} props Default story props
 * @returns {React.FC} Stix Visualizer Component
 */
export const DefaultStixVisualizer: React.FC<DefaultStixVisualizerProps> = (
  props: DefaultStixVisualizerProps
) => {
  return (
    <div>
      <Stix2Visualizer data={props.data}></Stix2Visualizer>
    </div>
  );
};
