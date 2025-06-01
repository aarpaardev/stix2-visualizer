import { ForceGraphInstance } from 'force-graph';
import { LinkObject, NodeObject } from '../stix2-visualizer';

// eslint-disable-next-line no-shadow
enum Stix2ObjectTypes {
  Artifact = 'artifact',
  AttackPattern = 'attack-pattern',
  Autonomous_system = 'autonomous-system',
  Bundle = 'bundle',
  Campaign = 'campaign',
  Coa = 'coa',
  CourseOfAction = 'course-of-action',
  CustomObject = 'custom-object',
  Directory = 'directory',
  DomainName = 'domain-name',
  EmailAddr = 'email-addr',
  EmailMessage = 'email-message',
  Event = 'event',
  File = 'file',
  Grouping = 'grouping',
  Http = 'http',
  Identity = 'identity',
  Impact = 'impact',
  Incident = 'incident',
  Indicator = 'indicator',
  Infrastructure = 'infrastructure',
  IntrusionSet = 'intrusion-set',
  Ipv4Addr = 'ipv4-addr',
  Ipv6Addr = 'ipv6-addr',
  Language = 'language',
  Location = 'location',
  MacAddr = 'mac-addr',
  MalwareAnalysis = 'malware-analysis',
  Malware = 'malware',
  MarkingDefinition = 'marking-definition',
  Mutex = 'mutex',
  NetworkTraffic = 'network-traffic',
  Note = 'note',
  Observed_data = 'observed-data',
  Opinion = 'opinion',
  Process = 'process',
  Relationship = 'relationship',
  Report = 'report',
  Sighting = 'sighting',
  Software = 'software',
  Source = 'source',
  Task = 'task',
  Threat_actor = 'threat-actor',
  Tlp = 'tlp',
  Tool = 'tool',
  Url = 'url',
  UserAccount = 'user-account',
  Victim = 'victim',
  VictimTarget = 'victim-target',
  Vulnerability = 'vulnerability',
  WindowsRegistryKey = 'windows-registry-key',
  X509Certificate = 'x509-certificate',
}

interface KillChainPhase {
  kill_chain_name: string;
  phase_name: string;
}

interface ExternalReference {
  source_name: string;
  url?: string;
  hashes?: Record<string, string>;
}

interface StixObject {
  type: Stix2ObjectTypes;
  id: string;
  created: string;
  modified?: string;
  definition_type?: string;
  definition?: {
    statement?: string;
  };
  name?: string;
  labels?: string[];
  description?: string;
  published?: string;
  object_refs?: string[];
  object_marking_refs?: string[];
  external_references?: ExternalReference[];
  kill_chain_phases?: KillChainPhase[];
  valid_from?: string;
  pattern?: string;
  first_seen?: string;
  resource_level?: string;
  primary_motivation?: string;
  aliases?: Array<string>;
  threat_actor_types?: Array<string>;
  roles?: Array<string>;
  spec_version?: string;
  relationship_type?: string;
  source_ref?: string;
  target_ref?: string;
}

type StixBundle = {
  type: Stix2ObjectTypes.Bundle;
  id: string;
  spec_version: string;
  objects: StixObject[];
};

type Coordinates = { x: number; y: number };
type ZoomTransformation = { k: number; x: number; y: number };

interface ForceFn<NodeType = object> {
  (alpha: number): void;
  initialize?: (nodes: NodeObject<NodeType>[], ...args: unknown[]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface ForceGraphMethods<NodeType = object, LinkType = object> {
  // Link styling
  emitParticle(link: LinkObject<NodeType, LinkType>): ForceGraphInstance;

  // Force engine (d3-force) configuration
  d3Force(
    forceName: 'link' | 'charge' | 'center' | string
  ): ForceFn<NodeObject<NodeType>> | undefined;
  d3Force(
    forceName: 'link' | 'charge' | 'center' | string,
    forceFn: ForceFn<NodeObject<NodeType>> | null
  ): ForceGraphInstance;
  d3ReheatSimulation(): ForceGraphInstance;

  // Render control
  pauseAnimation(): ForceGraphInstance;
  resumeAnimation(): ForceGraphInstance;
  centerAt(): { x: number; y: number };
  centerAt(x?: number, y?: number, durationMs?: number): ForceGraphInstance;
  zoom(): number;
  zoom(scale: number, durationMs?: number): ForceGraphInstance;
  zoomToFit(
    durationMs?: number,
    padding?: number,
    nodeFilter?: (node: NodeObject<NodeType>) => boolean
  ): ForceGraphInstance;

  // Utility
  getGraphBbox(nodeFilter?: (node: NodeObject<NodeType>) => boolean): {
    x: [number, number];
    y: [number, number];
  };
  screen2GraphCoords(x: number, y: number): { x: number; y: number };
  graph2ScreenCoords(x: number, y: number): { x: number; y: number };

  cameraPosition: (
    position: { x: number; y: number; z: number },
    lookAt?: NodeObject,
    durationMs?: number
  ) => { x: number; y: number; z: number };
}

type ReactForceRef = ForceGraphMethods<NodeObject<object>, LinkObject<object, object> | undefined>;

export {
  StixBundle,
  StixObject,
  Stix2ObjectTypes,
  Coordinates,
  ForceGraphMethods,
  ReactForceRef,
  ZoomTransformation,
};
