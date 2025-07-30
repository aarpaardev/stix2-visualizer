/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
import ArtifactRound from '../assets/stix2Icons/stix2-artifact-icon-tiny-round-v1.png';
import AttackPatternRound from '../assets/stix2Icons/stix2-attack-pattern-icon-tiny-round-v1.png';
import AutonomousSystemRound from '../assets/stix2Icons/stix2-autonomous-system-icon-tiny-round-v1.png';
import BundleRound from '../assets/stix2Icons/stix2-bundle-icon-tiny-round-v1.png';
import CampaignRound from '../assets/stix2Icons/stix2-campaign-icon-tiny-round-v1.png';
import CoaRound from '../assets/stix2Icons/stix2-coa-icon-tiny-round-v1.png';
import CourseOfActionRound from '../assets/stix2Icons/stix2-course-of-action-icon-tiny-round-v1.png';
import CustomObjectRound from '../assets/stix2Icons/stix2-custom-object-icon-tiny-round-v1.png';
import DirectoryRound from '../assets/stix2Icons/stix2-directory-icon-tiny-round-v1.png';
import DomainNameRound from '../assets/stix2Icons/stix2-domain-name-icon-tiny-round-v1.png';
import EmailAddrRound from '../assets/stix2Icons/stix2-email-addr-icon-tiny-round-v1.png';
import EmailMessageRound from '../assets/stix2Icons/stix2-email-message-icon-tiny-round-v1.png';
import EventRound from '../assets/stix2Icons/stix2-event-icon-tiny-round-v1.png';
import FileRound from '../assets/stix2Icons/stix2-file-icon-tiny-round-v1.png';
import GroupingRound from '../assets/stix2Icons/stix2-grouping-icon-tiny-round-v1.png';
import HttpRound from '../assets/stix2Icons/stix2-http-icon-tiny-round-v1.png';
import IdentityRound from '../assets/stix2Icons/stix2-identity-icon-tiny-round-v1.png';
import ImpactRound from '../assets/stix2Icons/stix2-impact-icon-tiny-round-v1.png';
import IncidentRound from '../assets/stix2Icons/stix2-incident-icon-tiny-round-v1.png';
import IndicatorRound from '../assets/stix2Icons/stix2-indicator-icon-tiny-round-v1.png';
import InfrastructureRound from '../assets/stix2Icons/stix2-infrastructure-icon-tiny-round-v1.png';
import IntrusionSetRound from '../assets/stix2Icons/stix2-intrusion-set-icon-tiny-round-v1.png';
import Ipv4AddrRound from '../assets/stix2Icons/stix2-ipv4-addr-icon-tiny-round-v1.png';
import Ipv6AddrRound from '../assets/stix2Icons/stix2-ipv6-addr-icon-tiny-round-v1.png';
import LanguageRound from '../assets/stix2Icons/stix2-language-icon-tiny-round-v1.png';
import LocationRound from '../assets/stix2Icons/stix2-location-icon-tiny-round-v1.png';
import MacAddrRound from '../assets/stix2Icons/stix2-mac-addr-icon-tiny-round-v1.png';
import MalwareAnalysisRound from '../assets/stix2Icons/stix2-malware-analysis-icon-tiny-round-v1.png';
import MalwareRound from '../assets/stix2Icons/stix2-malware-icon-tiny-round-v1.png';
import MarkingDefinitionRound from '../assets/stix2Icons/stix2-marking-definition-icon-tiny-round-v1.png';
import MutexRound from '../assets/stix2Icons/stix2-mutex-icon-tiny-round-v1.png';
import NetworkTrafficRound from '../assets/stix2Icons/stix2-network-traffic-icon-tiny-round-v1.png';
import NoteRound from '../assets/stix2Icons/stix2-note-icon-tiny-round-v1.png';
import ObservedDataRound from '../assets/stix2Icons/stix2-observed-data-icon-tiny-round-v1.png';
import OpinionRound from '../assets/stix2Icons/stix2-opinion-icon-tiny-round-v1.png';
import ProcessRound from '../assets/stix2Icons/stix2-process-icon-tiny-round-v1.png';
import RelationshipRound from '../assets/stix2Icons/stix2-relationship-icon-tiny-round-v1.png';
import ReportRound from '../assets/stix2Icons/stix2-report-icon-tiny-round-v1.png';
import SightingRound from '../assets/stix2Icons/stix2-sighting-icon-tiny-round-v1.png';
import SoftwareRound from '../assets/stix2Icons/stix2-software-icon-tiny-round-v1.png';
import SourceRound from '../assets/stix2Icons/stix2-source-icon-tiny-round-v1.png';
import TaskRound from '../assets/stix2Icons/stix2-task-icon-tiny-round-v1.png';
import ThreatActorRound from '../assets/stix2Icons/stix2-threat-actor-icon-tiny-round-v1.png';
import TlpRound from '../assets/stix2Icons/stix2-tlp-icon-tiny-round-v1.png';
import ToolRound from '../assets/stix2Icons/stix2-tool-icon-tiny-round-v1.png';
import UrlRound from '../assets/stix2Icons/stix2-url-icon-tiny-round-v1.png';
import UserAccountRound from '../assets/stix2Icons/stix2-user-account-icon-tiny-round-v1.png';
import VictimRound from '../assets/stix2Icons/stix2-victim-icon-tiny-round-v1.png';
import VictimTargetRound from '../assets/stix2Icons/stix2-victim-target-icon-tiny-round-v1.png';
import VulnerabilityRound from '../assets/stix2Icons/stix2-vulnerability-icon-tiny-round-v1.png';
import WindowsRegistryKeyRound from '../assets/stix2Icons/stix2-windows-registry-key-icon-tiny-round-v1.png';
import X509CertificateRound from '../assets/stix2Icons/stix2-x509-certificate-icon-tiny-round-v1.png';

const icons: Record<string, Record<string, string>> = {
  round: {
    "artifact": ArtifactRound,
    'attack-pattern': AttackPatternRound,
    'autonomous-system': AutonomousSystemRound,
    "bundle": BundleRound,
    "campaign": CampaignRound,
    "coa": CoaRound,
    'course-of-action': CourseOfActionRound,
    'custom-object': CustomObjectRound,
    "directory": DirectoryRound,
    'domain-name': DomainNameRound,
    'email-addr': EmailAddrRound,
    'email-message': EmailMessageRound,
    "event": EventRound,
    "file": FileRound,
    "grouping": GroupingRound,
    "http": HttpRound,
    "identity": IdentityRound,
    "impact": ImpactRound,
    "incident": IncidentRound,
    "indicator": IndicatorRound,
    "infrastructure": InfrastructureRound,
    'intrusion-set': IntrusionSetRound,
    'ipv4-addr': Ipv4AddrRound,
    'ipv6-addr': Ipv6AddrRound,
    "language": LanguageRound,
    "location": LocationRound,
    'mac-addr': MacAddrRound,
    'malware-analysis': MalwareAnalysisRound,
    "malware": MalwareRound,
    'marking-definition': MarkingDefinitionRound,
    "mutex": MutexRound,
    'network-traffic': NetworkTrafficRound,
    "note": NoteRound,
    'observed-data': ObservedDataRound,
    "opinion": OpinionRound,
    "process": ProcessRound,
    "relationship": RelationshipRound,
    "report": ReportRound,
    "sighting": SightingRound,
    "software": SoftwareRound,
    "source": SourceRound,
    "task": TaskRound,
    'threat-actor': ThreatActorRound,
    "tlp": TlpRound,
    "tool": ToolRound,
    "url": UrlRound,
    'user-account': UserAccountRound,
    "victim": VictimRound,
    'victim-target': VictimTargetRound,
    "vulnerability": VulnerabilityRound,
    'windows-registry-key': WindowsRegistryKeyRound,
    'x509-certificate': X509CertificateRound,
  },
};

export default icons;
