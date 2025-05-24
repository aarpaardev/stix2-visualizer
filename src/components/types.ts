enum Stix2Objects {
 artifact = 'artifact',
 attack_pattern = 'attack_pattern',
 autonomous_system = 'autonomous_system',
 bundle = 'bundle',
 campaign = 'campaign',
 coa = 'coa',
 course_of_action = 'course_of_action',
 custom_object = 'custom_object',
 directory = 'directory',
 domain_name = 'domain_name',
 email_addr = 'email_addr',
 email_message = 'email_message',
 event = 'event',
 file = 'file',
 grouping = 'grouping',
 http = 'http',
 identity = 'identity',
 impact = 'impact',
 incident = 'incident',
 indicator = 'indicator',
 infrastructure = 'infrastructure',
 intrusion_set = 'intrusion_set',
 ipv4_addr = 'ipv4_addr',
 ipv6_addr = 'ipv6_addr',
 language = 'language',
 location = 'location',
 mac_addr = 'mac_addr',
 malware_analysis = 'malware_analysis',
 malware = 'malware',
 marking_definition = 'marking_definition',
 mutex = 'mutex',
 network_traffic = 'network_traffic',
 note = 'note',
 observed_data = 'observed_data',
 opinion = 'opinion',
 process = 'process',
 relationship = 'relationship',
 report = 'report',
 sighting = 'sighting',
 software = 'software',
 source = 'source',
 task = 'task',
 threat_actor = 'threat_actor',
 tlp = 'tlp',
 tool = 'tool',
 url = 'url',
 user_account = 'user_account',
 victim = 'victim',
 victim_target = 'victim_target',
 vulnerability = 'vulnerability',
 windows_registry_key = 'windows_registry_key',
 x509_certificate = 'x509_certificate',
}

interface IRelationLabelOptions {
    label: string;
    fontSize: number;
    font?: string;
    backgroundColor?: string;
    color?: string;
}

export { Stix2Objects, IRelationLabelOptions}