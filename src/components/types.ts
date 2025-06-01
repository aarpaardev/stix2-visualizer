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

export { StixBundle, StixObject, Stix2ObjectTypes, Coordinates };
