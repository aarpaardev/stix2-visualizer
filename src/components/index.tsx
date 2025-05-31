import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ForceGraph3D, ForceGraph2D } from 'react-force-graph';
import { createLabel, drawCurvedLine, formatData, loadIcons } from './utils';
import { GraphData, ILabelOptions, IStix2Visualizer, LinkObject, NodeObject } from '../stix2-visualizer';
// import { IRelationLabelOptions } from './types';

// const defaultValues = {
//   curvature: 0.25,
//   particlesColor: 'rgb(0, 0, 0)',
//   linkWidth: 1,
//   linkLabelFontSize: 5,
// }
// const icons = loadIcons('round');
// const dataSample: GraphData = {
//   "nodes": [ 
//       { 
//         "id": "id1",
//         "img":  icons.artifact, //"stix2.png", //"C:\\Users\\mmali\\Downloads\\stix2_artifact_icon_tiny_round_v1.png",
//         "name": "name1",
//         "val": 0.1,
//         neighbors:[],
//         links: [] 
//       },
//       { 
//         "id": "id2",
//         "img":  icons.attack_pattern,
//         "name": "name2",
//         "val": 0.2,
//         neighbors:[],
//         links: [] 
//       },
//       { 
//         "id": "id3",
//         "name": "name3",
//         "img":  icons.autonomous_system,
//         "val": 0.1,
//         neighbors:[],
//         links: [] 
//       },
//       { 
//         "id": "id4",
//         "name": "name4",
//         "img":  icons.bundle,
//         "val": 0.1,
//         neighbors:[],
//         links: [] 
//       },
//       { 
//         "id": "id5",
//         "name": "name5",
//         "img":  icons.course_of_action,
//         "val": 0.2,
//         neighbors:[],
//         links: [] 
//       },
//       { 
//         "id": "id6",
//         "name": "name6",
//         "img":  icons.domain_name,
//         "val": 0.1,
//         neighbors:[],
//         links: [] 
//       },
//       { 
//         "id": "id7",
//         "name": "name7",
//         "img":  icons.email_message,
//         "val": 0.1,
//         neighbors:[],
//         links: [] 
//       },
//       { 
//         "id": "id8",
//         "name": "name8",
//         "img":  icons.http,
//         "val": 0.1,
//         neighbors:[],
//         links: [] 
//       },
//       { 
//         "id": "id9",
//         "name": "name9",
//         "img":  icons.incident,
//         "val": 0.1,
//         neighbors:[],
//         links: [] 
//       },
//       { 
//         "id": "id10",
//         "name": "name10",
//         "img":  icons.ipv4_addr,
//         "val": 0.1,
//         neighbors:[],
//         links: [] 
//       },
//       { 
//         "id": "id11",
//         "name": "name11",
//         "img":  icons.intrusion_set,
//         "val": 0.1,
//         neighbors:[],
//         links: [] 
//       },
//       { 
//         "id": "id14",
//         "name": "id14",
//         "img":  icons.impact,
//         "val": 0.1,
//         neighbors:[],
//         links: [] 
//       },
//       { 
//         "id": "id15",
//         "name": "id15",
//         "img":  icons.ipv6_addr,
//         "val": 0.1,
//         neighbors:[],
//         links: [] 
//       },
//   ],
//   "links": [
//       {
//           "source": "id1",
//           "target": "id2",
//           "label": "Me"
//       },
//       {
//           "source": "id1",
//           "target": "id3",
//           "label": "Kancha"
//       },
//       {
//           "source": "id1",
//           "target": "id4"
//       },
//       {
//           "source": "id2",
//           "target": "id5"
//       },
//       {
//           "source": "id2",
//           "target": "id6"
//       },
//       {
//           "source": "id3",
//           "target": "id7"
//       },
//       {
//           "source": "id3",
//           "target": "id8"
//       },
//       {
//           "source": "id4",
//           "target": "id9"
//       },
//       {
//           "source": "id4",
//           "target": "id10"
//       },
//       {
//           "source": "id5",
//           "target": "id11"
//       },
//       {
//           "source": "id14",
//           "target": "id15"
//       },
//   ]
// }
const sampleJsonData = {
  "type": "bundle",
  "id": "bundle--cf20f99b-3ed2-4a9f-b4f1-d660a7fc8241",
  "objects": [
    {
      "type": "intrusion-set",
      "spec_version": "2.1",
      "id": "intrusion-set--da1065ce-972c-4605-8755-9cd1074e3b5a",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "APT1",
      "description": "APT1 is a single organization of operators that has conducted a cyber espionage campaign against a broad range of victims since at least 2006.",
      "first_seen": "2006-06-01T18:13:15.684Z",
      "resource_level": "government",
      "primary_motivation": "organizational-gain",
      "aliases": [
        "Comment Crew",
        "Comment Group",
        "Shady Rat"
      ]
    },
    {
      "type": "threat-actor",
      "spec_version": "2.1",
      "id": "threat-actor--6d179234-61fc-40c4-ae86-3d53308d8e65",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "Ugly Gorilla",
      "threat_actor_types": [
        "nation-state",
        "spy"
      ],
      "roles": [
        "malware-author",
        "agent",
        "infrastructure-operator"
      ],
      "resource_level": "government",
      "aliases": [
        "Greenfield",
        "JackWang",
        "Wang Dong"
      ],
      "primary_motivation": "organizational-gain"
    },
    {
      "type": "threat-actor",
      "spec_version": "2.1",
      "id": "threat-actor--d84cf283-93be-4ca7-890d-76c63eff3636",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "DOTA",
      "threat_actor_types": [
        "nation-state",
        "spy"
      ],
      "aliases": [
        "dota",
        "Rodney",
        "Raith"
      ],
      "resource_level": "government",
      "roles": [
        "agent",
        "infrastructure-operator"
      ],
      "primary_motivation": "organizational-gain"
    },
    {
      "type": "threat-actor",
      "spec_version": "2.1",
      "id": "threat-actor--02e7c48f-0301-4c23-b3e4-02e5a0114c21",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "SuperHard",
      "threat_actor_types": [
        "nation-state"
      ],
      "sophistication": "expert",
      "aliases": [
        "dota",
        "Rodney",
        "Raith"
      ],
      "resource_level": "government",
      "roles": [
        "malware-author"
      ],
      "primary_motivation": "organizational-gain"
    },
    {
      "type": "threat-actor",
      "spec_version": "2.1",
      "id": "threat-actor--d5b62b58-df7c-46b1-a435-4d01945fe21d",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "Communist Party of China",
      "description": " The CPC is the ultimate authority in Mainland China and tasks the PLA to commit cyber espionage and data theft against organizations around the world.",
      "threat_actor_types": [
        "nation-state"
      ],
      "resource_level": "government",
      "roles": [
        "sponsor",
        "director"
      ],
      "aliases": [
        "CPC"
      ],
      "primary_motivation": "organizational-gain"
    },
    {
      "type": "threat-actor",
      "spec_version": "2.1",
      "id": "threat-actor--94624865-2709-443f-9b4c-2891985fd69b",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "Unit 61398",
      "description": "Unit 61398 functions as the Third Department's premier entity targeting the United States and Canada, most likely focusing on political, economic, and military-related intelligence.",
      "threat_actor_types": [
        "nation-state"
      ],
      "resource_level": "government",
      "roles": [
        "agent"
      ],
      "aliases": [
        "PLA GSD's 3rd Department, 2nd Bureau",
        "Military Unit Cover Designator (MUCD) 61398"
      ],
      "primary_motivation": "organizational-gain"
    },
    {
      "type": "identity",
      "spec_version": "2.1",
      "id": "identity--a9119a87-6576-46af-bfd7-4fbe55926671",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "JackWang",
      "identity_class": "individual",
      "sectors": [
        "government-national"
      ],
      "contact_information": "uglygorilla@163.com"
    },
    {
      "type": "identity",
      "spec_version": "2.1",
      "id": "identity--e88ab115-7768-4630-baa3-3d49a7d946ea",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "Wang Dong",
      "identity_class": "individual",
      "sectors": [
        "government-national"
      ],
      "contact_information": "uglygorilla@163.com"
    },
    {
      "type": "identity",
      "spec_version": "2.1",
      "id": "identity--0e9d20d9-fb11-42e3-94bc-b89fb5b007ca",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "dota",
      "identity_class": "individual",
      "sectors": [
        "government-national"
      ],
      "contact_information": "dota.d013@gmail.com"
    },
    {
      "type": "identity",
      "spec_version": "2.1",
      "id": "identity--ecf1c7de-d96c-41c6-a510-b9c65cdc9e3b",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "Mei Qiang",
      "identity_class": "individual",
      "sectors": [
        "government-national"
      ],
      "contact_information": "mei_qiang_82@sohu.com"
    },
    {
      "type": "indicator",
      "spec_version": "2.1",
      "pattern_type": "stix",
      "id": "indicator--031778a4-057f-48e6-9db9-c8d72b81ccd5",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "HTRAN Hop Point Accessor",
      "description": "Test description.",
      "pattern": "[ipv4-addr:value = '223.166.0.0/15']",
      "indicator_types": [
        "malicious-activity"
      ],
      "valid_from": "2015-05-15T09:12:16.432678Z",
      "kill_chain_phases": [
        {
          "kill_chain_name": "mandiant-attack-lifecycle-model",
          "phase_name": "establish-foothold"
        }
      ]
    },
    {
      "type": "indicator",
      "spec_version": "2.1",
      "pattern_type": "stix",
      "id": "indicator--da1d061b-2bc9-467a-b16f-8d14f468e1f0",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "HTRAN Hop Point Accessor",
      "description": "Test description.",
      "pattern": "[ipv4-addr:value = '58.246.0.0/15']",
      "indicator_types": [
        "malicious-activity"
      ],
      "valid_from": "2015-05-15T09:12:16.432678Z",
      "kill_chain_phases": [
        {
          "kill_chain_name": "mandiant-attack-lifecycle-model",
          "phase_name": "establish-foothold"
        }
      ]
    },
    {
      "type": "indicator",
      "spec_version": "2.1",
      "pattern_type": "stix",
      "id": "indicator--2173d108-5714-42fd-8213-4f3790259fda",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "HTRAN Hop Point Accessor",
      "description": "Test description.",
      "pattern": "[ipv4-addr:value = '112.64.0.0/15']",
      "indicator_types": [
        "malicious-activity"
      ],
      "valid_from": "2015-05-15T09:12:16.432678Z",
      "kill_chain_phases": [
        {
          "kill_chain_name": "mandiant-attack-lifecycle-model",
          "phase_name": "establish-foothold"
        }
      ]
    },
    {
      "type": "indicator",
      "spec_version": "2.1",
      "pattern_type": "stix",
      "id": "indicator--8ce03314-dfea-4498-ac9b-136e41ab00e4",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "HTRAN Hop Point Accessor",
      "description": "Test description.",
      "pattern": "[ipv4-addr:value = '139.226.0.0/15']",
      "indicator_types": [
        "malicious-activity"
      ],
      "valid_from": "2015-05-15T09:12:16.432678Z",
      "kill_chain_phases": [
        {
          "kill_chain_name": "mandiant-attack-lifecycle-model",
          "phase_name": "establish-foothold"
        }
      ]
    },
    {
      "type": "indicator",
      "spec_version": "2.1",
      "pattern_type": "stix",
      "id": "indicator--3f3ff9f1-bb4e-4392-89e5-1991179042ba",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "FQDN hugesoft.org",
      "description": "Test description.",
      "pattern": "[domain-name:value = 'hugesoft.org']",
      "indicator_types": [
        "malicious-activity"
      ],
      "valid_from": "2015-05-15T09:12:16.432678Z"
    },
    {
      "type": "indicator",
      "spec_version": "2.1",
      "pattern_type": "stix",
      "id": "indicator--8390fd29-24ed-45d4-84d7-c5e5feaf195d",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "FQDN arrowservice.net",
      "description": "Test description.",
      "pattern": "[domain-name:value = 'arrowservice.net']",
      "indicator_types": [
        "malicious-activity"
      ],
      "valid_from": "2015-05-15T09:12:16.432678Z"
    },
    {
      "type": "indicator",
      "spec_version": "2.1",
      "pattern_type": "stix",
      "id": "indicator--1002c58e-cbde-4930-b5ee-490037fd4f7e",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "FQDN msnhome.org",
      "description": "Test description.",
      "pattern": "[domain-name:value = 'msnhome.org']",
      "indicator_types": [
        "malicious-activity"
      ],
      "valid_from": "2015-05-15T09:12:16.432678Z"
    },
    {
      "type": "indicator",
      "spec_version": "2.1",
      "pattern_type": "stix",
      "id": "indicator--8d12f44f-8ac0-4b12-8b4a-3699ca8c9691",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "Appendix E MD5 hash '001dd76872d80801692ff942308c64e6'",
      "description": "Test description.",
      "pattern": "[file:hashes.md5 = '001dd76872d80801692ff942308c64e6']",
      "indicator_types": [
        "malicious-activity"
      ],
      "valid_from": "2015-05-15T09:12:16.432678Z"
    },
    {
      "type": "indicator",
      "spec_version": "2.1",
      "pattern_type": "stix",
      "id": "indicator--745e1537-b4f3-49da-9f64-df6b1b5df190",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "Appendix E MD5 hash '002325a0a67fded0381b5648d7fe9b8e'",
      "description": "Test description.",
      "pattern": "[file:hashes.md5 = '002325a0a67fded0381b5648d7fe9b8e']",
      "indicator_types": [
        "malicious-activity"
      ],
      "valid_from": "2015-05-15T09:12:16.432678Z"
    },
    {
      "type": "indicator",
      "spec_version": "2.1",
      "pattern_type": "stix",
      "id": "indicator--1dbe6ed0-c305-458f-9cce-f83c678f5afd",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "Appendix E MD5 hash '00dbb9e1c09dbdafb360f3163ba5a3de'",
      "description": "Test description.",
      "pattern": "[file:hashes.md5 = '00dbb9e1c09dbdafb360f3163ba5a3de']",
      "indicator_types": [
        "malicious-activity"
      ],
      "valid_from": "2015-05-15T09:12:16.432678Z"
    },
    {
      "type": "indicator",
      "spec_version": "2.1",
      "pattern_type": "stix",
      "id": "indicator--b3b6b540-d838-41e2-853b-005056c00008",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "Appendix F SSL Certificate for serial number '(Negative)4c:0b:1d:19:74:86:a7:66:b4:1a:bf:40:27:21:76:28'",
      "description": "Test description.",
      "pattern": "[x509-certificate:issuer = 'CN=WEBMAIL' AND x509-certificate:serial_number = '4c:0b:1d:19:74:86:a7:66:b4:1a:bf:40:27:21:76:28']",
      "indicator_types": [
        "malicious-activity"
      ],
      "valid_from": "2015-05-15T09:12:16.432678Z"
    },
    {
      "type": "indicator",
      "spec_version": "2.1",
      "pattern_type": "stix",
      "id": "indicator--b3b7035e-d838-41e2-8d38-005056c00008",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "Appendix F SSL Certificate for serial number '0e:97:88:1c:6c:a1:37:96:42:03:bc:45:42:24:75:6c'",
      "description": "Test description.",
      "pattern": "[x509-certificate:issuer = 'CN=LM-68AB71FBD8F5' AND x509-certificate:serial_number = '0e:97:88:1c:6c:a1:37:96:42:03:bc:45:42:24:75:6c']",
      "indicator_types": [
        "malicious-activity"
      ],
      "valid_from": "2015-05-15T09:12:16.432678Z"
    },
    {
      "type": "malware",
      "spec_version": "2.1",
      "is_family": false,
      "id": "malware--2485b844-4efe-4343-84c8-eb33312dd56f",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "MANITSME",
      "malware_types": [
        "backdoor",
        "dropper",
        "remote-access-trojan"
      ],
      "description": "This malware will beacon out at random intervals to the remote attacker. The attacker can run programs, execute arbitrary commands, and easily upload and download files."
    },
    {
      "type": "malware",
      "spec_version": "2.1",
      "is_family": false,
      "id": "malware--c0217091-9d3d-42a1-8952-ccc12d4ad8d0",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "WEBC2-UGX",
      "malware_types": [
        "backdoor",
        "remote-access-trojan"
      ],
      "description": "A WEBC2 backdoor is designed to retrieve a Web page from a C2 server. It expects the page to contain special HTML tags; the backdoor will attempt to interpret the data between the tags as commands."
    },
    {
      "type": "malware",
      "spec_version": "2.1",
      "is_family": false,
      "id": "malware--0f01c5a3-f516-4450-9381-4dd9f2279411",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "WEBC2 Backdoor",
      "malware_types": [
        "backdoor",
        "remote-access-trojan"
      ],
      "description": "A WEBC2 backdoor is designed to retrieve a Web page from a C2 server. It expects the page to contain special HTML tags; the backdoor will attempt to interpret the data between the tags as commands.",
      "kill_chain_phases": [
        {
          "kill_chain_name": "mandiant-attack-lifecycle-model",
          "phase_name": "establish-foothold"
        }
      ]
    },
    {
      "type": "malware",
      "spec_version": "2.1",
      "is_family": false,
      "id": "malware--33159b98-3264-4e10-a968-d67975b6272f",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "HUC Packet Transmit Tool (HTRAN)",
      "malware_types": [
        "backdoor",
        "remote-access-trojan"
      ],
      "description": "When APT1 attackers are not using WEBC2, they require a “command and control” (C2) user interface so they can issue commands to the backdoor. This interface sometimes runs on their personal attack system, which is typically in Shanghai. In these instances, when a victim backdoor makes contact with a hop, the communications need to be forwarded from the hop to the intruder’s Shanghai system so the backdoor can talk to the C2 server software. We have observed 767 separate instances in which APT1 intruders used the publicly available “HUC Packet Transmit Tool” or HTRAN on a hopThe HTRAN utility is merely a middle-man, facilitating connections between the victim and the attacker who is using the hop point.",
      "kill_chain_phases": [
        {
          "kill_chain_name": "mandiant-attack-lifecycle-model",
          "phase_name": "establish-foothold"
        }
      ]
    },
    {
      "type": "malware",
      "spec_version": "2.1",
      "is_family": true,
      "id": "malware--fb490cdb-6760-41eb-a79b-0b930a50c017",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "AURIGA",
      "malware_types": [
        "backdoor",
        "keylogger"
      ],
      "description": "Malware family that contains functionality for keystroke logging, creating and killing processes, performing file system and registry modifications, etc."
    },
    {
      "type": "malware",
      "spec_version": "2.1",
      "is_family": false,
      "id": "malware--ea50ecb7-2cd4-4895-bd08-31cd591ed0ca",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "BANGAT",
      "malware_types": [
        "backdoor",
        "keylogger"
      ],
      "description": "Malware family that contains functionality for keylogging, creating and killing processes, performing filesystem and registry modifications, etc."
    },
    {
      "type": "tool",
      "spec_version": "2.1",
      "id": "tool--ce45f721-af14-4fc0-938c-000c16186418",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "cachedump",
      "tool_types": [
        "credential-exploitation"
      ],
      "description": "This program extracts cached password hashes from a system’s registry.",
      "kill_chain_phases": [
        {
          "kill_chain_name": "mandiant-attack-lifecycle-model",
          "phase_name": "escalate-privileges"
        }
      ]
    },
    {
      "type": "tool",
      "spec_version": "2.1",
      "id": "tool--e9778c42-bc2f-4eda-9fb4-6a931834f68c",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "fgdump",
      "tool_types": [
        "credential-exploitation"
      ],
      "description": "Windows password hash dumper",
      "kill_chain_phases": [
        {
          "kill_chain_name": "mandiant-attack-lifecycle-model",
          "phase_name": "escalate-privileges"
        }
      ],
      "external_references": [
        {
          "source_name": "fgdump",
          "url": "http://www.foofus.net/fizzgig/fgdump/"
        }
      ]
    },
    {
      "type": "tool",
      "spec_version": "2.1",
      "id": "tool--1cf6a3b8-be43-4c1a-b042-546a890c31b2",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "gsecdump",
      "tool_types": [
        "credential-exploitation"
      ],
      "description": "Obtains password hashes from the Windows registry, including the SAM file, cached domain credentials, and LSA secrets",
      "kill_chain_phases": [
        {
          "kill_chain_name": "mandiant-attack-lifecycle-model",
          "phase_name": "escalate-privileges"
        }
      ],
      "external_references": [
        {
          "source_name": "gsecdump",
          "url": "http://www.truesec.se"
        }
      ]
    },
    {
      "type": "tool",
      "spec_version": "2.1",
      "id": "tool--4d82bd3e-24a3-4f9d-b8f3-b57267fe06a9",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "lslsass",
      "tool_types": [
        "credential-exploitation"
      ],
      "description": "Dump active logon session password hashes from the lsass process",
      "kill_chain_phases": [
        {
          "kill_chain_name": "mandiant-attack-lifecycle-model",
          "phase_name": "escalate-privileges"
        }
      ],
      "external_references": [
        {
          "source_name": "lslsass",
          "url": "http://www.truesec.se"
        }
      ]
    },
    {
      "type": "tool",
      "spec_version": "2.1",
      "id": "tool--7de5dfcc-6809-4772-9f11-cf26c2be53aa",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "mimikatz",
      "tool_types": [
        "credential-exploitation"
      ],
      "description": "A utility primarily used for dumping password hashes",
      "kill_chain_phases": [
        {
          "kill_chain_name": "mandiant-attack-lifecycle-model",
          "phase_name": "escalate-privileges"
        }
      ],
      "external_references": [
        {
          "source_name": "mimikatz",
          "url": "http://blog.gentilkiwi.com/mimikatz"
        }
      ]
    },
    {
      "type": "tool",
      "spec_version": "2.1",
      "id": "tool--266b12f2-aa16-4607-809e-f2d33eebb52e",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "pass-the-hash toolkit",
      "tool_types": [
        "credential-exploitation"
      ],
      "description": "Allows an intruder to “pass” a password hash (without knowing the original password) to log in to systems",
      "kill_chain_phases": [
        {
          "kill_chain_name": "mandiant-attack-lifecycle-model",
          "phase_name": "escalate-privileges"
        }
      ],
      "external_references": [
        {
          "source_name": "pass-the-hash toolkit",
          "url": "http://oss.coresecurity.com/projects/pshtoolkit.htm"
        }
      ]
    },
    {
      "type": "tool",
      "spec_version": "2.1",
      "id": "tool--98fd8dc1-6cc7-4908-899f-07473f55149a",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "pwdump7",
      "tool_types": [
        "credential-exploitation"
      ],
      "description": "Dumps password hashes from the Windows registry",
      "kill_chain_phases": [
        {
          "kill_chain_name": "mandiant-attack-lifecycle-model",
          "phase_name": "escalate-privileges"
        }
      ],
      "external_references": [
        {
          "source_name": "pwdump7",
          "url": "http://www.tarasco.org/security/pwdump_7/"
        }
      ]
    },
    {
      "type": "tool",
      "spec_version": "2.1",
      "id": "tool--4215b0e5-928e-4b2a-9b5f-64819f287f48",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "pwdumpX",
      "tool_types": [
        "credential-exploitation"
      ],
      "description": "Dumps password hashes from the Windows registry",
      "kill_chain_phases": [
        {
          "kill_chain_name": "mandiant-attack-lifecycle-model",
          "phase_name": "escalate-privileges"
        }
      ]
    },
    {
      "type": "tool",
      "spec_version": "2.1",
      "id": "tool--a6dd62d0-9683-48bf-a9cd-61e7eceae57e",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "GETMAIL",
      "tool_types": [
        "information-gathering"
      ],
      "description": "GETMAIL was designed specifically to extract email messages, attachments, and folders from within Microsoft Outlook archive (“PST”) files.",
      "kill_chain_phases": [
        {
          "kill_chain_name": "mandiant-attack-lifecycle-model",
          "phase_name": "complete-mission"
        }
      ]
    },
    {
      "type": "tool",
      "spec_version": "2.1",
      "id": "tool--806a8f83-4913-4216-bb19-02b48ae25da5",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "MAPIGET",
      "tool_types": [
        "information-gathering"
      ],
      "description": "MAPIGET was designed specifically to steal email that has not yet been archived and still resides on a Microsoft Exchange Server.",
      "kill_chain_phases": [
        {
          "kill_chain_name": "mandiant-attack-lifecycle-model",
          "phase_name": "complete-mission"
        }
      ]
    },
    {
      "type": "attack-pattern",
      "spec_version": "2.1",
      "id": "attack-pattern--3098c57b-d623-4c11-92f4-5905da66658b",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "Initial Compromise",
      "description": "As with most other APT groups, spear phishing is APT1’s most commonly used technique. The spear phishing emails contain either a malicious attachment or a hyperlink to a malicious file. The subject line and the text in the email body are usually relevant to the recipient. APT1 also creates webmail accounts using real peoples’ names — names that are familiar to the recipient, such as a colleague, a company executive, an IT department employee, or company counsel. The files they use contain malicious executables that install a custom APT1 backdoor that we call WEBC2-TABLE.",
      "external_references": [
        {
          "source_name": "capec",
          "description": "spear phishing",
          "external_id": "CAPEC-163"
        }
      ],
      "kill_chain_phases": [
        {
          "kill_chain_name": "mandiant-attack-lifecycle-model",
          "phase_name": "initial-compromise"
        }
      ]
    },
    {
      "type": "attack-pattern",
      "spec_version": "2.1",
      "id": "attack-pattern--1e2c4237-d469-4144-9c0b-9e5c0c513c49",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "Establishing a Foothold",
      "description": "APT1 establishes a foothold once email recipients open a malicious file and a backdoor is subsequently installed.  In almost every case, APT backdoors initiate outbound connections to the intruder’s 'command and control' (C2) server. While APT1 intruders occasionally use publicly available backdoors such as Poison Ivy and Gh0st RAT, the vast majority of the time they use what appear to be their own custom backdoors. APT1’s backdoors are in two categories: 'Beachhead Backdoors' and 'Standard Backdoors.' Beachhead Backdoors offer the attacker a toe-hold to perform simple tasks like retrieve files, gather basic system information and trigger the execution of other more significant capabilities such as a standard backdoor. APT1’s beachhead backdoors are usually what we call WEBC2 backdoors. WEBC2 backdoors are probably the most well-known kind of APT1 backdoor, and are the reason why some security companies refer to APT1 as the Comment Crew. A WEBC2 backdoor is designed to retrieve a webpage from a C2 server. It expects the webpage to contain special HTML tags; the backdoor will attempt to interpret the data between the tags as commands. WEBC2 backdoors are often packaged with spear phishing emails. Once installed, APT1 intruders have the option to tell victim systems to download and execute additional malicious software of their choice. The standard, non-WEBC2 APT1 backdoor typically communicates using the HTTP protocol (to blend in with legitimate web traffic) or a custom protocol that the malware authors designed themselves. The BISCUIT backdoor (so named for the command “bdkzt”) is an illustrative example of the range of commands that APT1 has built into its “standard” backdoors. APT1 has used and steadily modified BISCUIT since as early as 2007 and continues to use it presently. Some APT backdoors attempt to mimic legitimate Internet traffic other than the HTTP protocol. When network defenders see the communications between these backdoors and their C2 servers, they might easily dismiss them as legitimate network traffic. Additionally, many of APT1’s backdoors use SSL encryption so that communications are hidden in an encrypted SSL tunnel.",
      "kill_chain_phases": [
        {
          "kill_chain_name": "mandiant-attack-lifecycle-model",
          "phase_name": "establish-foothold"
        }
      ]
    },
    {
      "type": "attack-pattern",
      "spec_version": "2.1",
      "id": "attack-pattern--e13f3e6d-4f9c-4265-b1cf-f997a1bf7827",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "Privilege Escalation",
      "description": "Escalating privileges involves acquiring items (most often usernames and passwords) that will allow access to more resources within the network. APT1 predominantly uses publicly available tools to dump password hashes from victim systems in order to obtain legitimate user credentials.",
      "kill_chain_phases": [
        {
          "kill_chain_name": "mandiant-attack-lifecycle-model",
          "phase_name": "escalate-privileges"
        }
      ]
    },
    {
      "type": "attack-pattern",
      "spec_version": "2.1",
      "id": "attack-pattern--5728f45b-2eca-4942-a7f6-bc4267c1ab8d",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "Internal Reconnaisance",
      "description": "In the Internal Reconnaissance stage, the intruder collects information about the victim environment. Like most APT (and non-APT) intruders, APT1 primarily uses built-in operating system commands to explore a compromised system and its networked environment. Although they usually simply type these commands into a command shell, sometimes intruders may use batch scripts to speed up the process.",
      "kill_chain_phases": [
        {
          "kill_chain_name": "mandiant-attack-lifecycle-model",
          "phase_name": "internal-recon"
        }
      ]
    },
    {
      "type": "attack-pattern",
      "spec_version": "2.1",
      "id": "attack-pattern--0bea2358-c244-4905-a664-a5cdce7bb767",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "Lateral Movement",
      "description": "Once an APT intruder has a foothold inside the network and a set of legitimate credentials, it is simple for the intruder to move around the network undetected. They can connect to shared resources on other systems. They can execute commands on other systems using the publicly available 'psexec' tool from Microsoft Sysinternals or the built-in Windows Task Scheduler ('at.exe').",
      "kill_chain_phases": [
        {
          "kill_chain_name": "mandiant-attack-lifecycle-model",
          "phase_name": "move-laterally"
        }
      ]
    },
    {
      "type": "attack-pattern",
      "spec_version": "2.1",
      "id": "attack-pattern--7151c6d0-7e97-47ce-9290-087315ea3db7",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "Maintain Presence",
      "description": "In this stage, the intruder takes actions to ensure continued, long-term control over key systems in the network environment from outside of the network. APT1 does this in three ways: Install new backdoors on multiple systems, use legitimate VPN credentials, and log in to web portals.",
      "kill_chain_phases": [
        {
          "kill_chain_name": "mandiant-attack-lifecycle-model",
          "phase_name": "maintain-presence"
        }
      ]
    },
    {
      "type": "attack-pattern",
      "spec_version": "2.1",
      "id": "attack-pattern--0781fe70-4c94-4300-8865-4b08b98611b4",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "Completing the Mission",
      "description": "Similar to other APT groups we track, once APT1 finds files of interest they pack them into archive files before stealing them. APT intruders most commonly use the RAR archiving utility for this task and ensure that the archives are password protected. Sometimes APT1 intruders use batch scripts to assist them in the process. After creating files compressed via RAR, the APT1 attackers will transfer files out of the network in ways that are consistent with other APT groups, including using the File Transfer Protocol (FTP) or their existing backdoors. Many times their RAR files are so large that the attacker splits them into chunks before transferring them. Unlike most other APT groups we track, APT1 uses two email-stealing utilities that we believe are unique to APT1. The first, GETMAIL, was designed specifically to extract email messages, attachments, and folders from within Microsoft Outlook archive ('PST') files. The GETMAIL utility allows APT1 intruders the flexibility to take only the emails between dates of their choice. In one case, we observed an APT1 intruder return to a compromised system once a week for four weeks in a row to steal only the past week’s emails. Whereas GETMAIL steals email in Outlook archive files, the second utility, MAPIGET, was designed specifically to steal email that has not yet been archived and still resides on a Microsoft Exchange Server. In order to operate successfully, MAPIGET requires username/password combinations that the Exchange server will accept. MAPIGET extracts email from specified accounts into text files (for the email body) and separate attachments, if there are any.",
      "kill_chain_phases": [
        {
          "kill_chain_name": "mandiant-attack-lifecycle-model",
          "phase_name": "complete-mission"
        }
      ]
    },
    {
      "type": "report",
      "spec_version": "2.1",
      "id": "report--e33ffe07-2f4c-48d8-b0af-ee2619d765cf",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "name": "APT1: Exposing One of China's Cyber Espionage Units",
      "report_types": [
        "threat-report",
        "threat-actor"
      ],
      "published": "2013-02-19T00:00:00.000000Z",
      "description": "Since 2004, Mandiant has investigated computer security breaches at hundreds of organizations around the world. The majority of these security breaches are attributed to advanced threat actors referred to as the 'Advanced Persistent Threat' (APT). We first published details about the APT in our January 2010 M-Trends report. As we stated in the report, our position was that 'The Chinese government may authorize this activity, but theres no way to determine the\textent of its involvement.' Now, three years later, we have the evidence required to change our assessment. The details\twe have analyzed during hundreds of investigations convince us that the groups conducting these activities are based primarily in China and that the Chinese Government is aware of them. Mandiant continues to track dozens of APT groups around the world; however, this report is focused on the most prolific of these groups. We refer to this group as 'APT1' and it is one of more than 20 APT groups with origins in China. APT1 is a single organization of operators that has conducted a cyber espionage campaign against a broad range of victims since at least 2006. From our observations, it is one of the most prolific cyber espionage groups in terms of the sheer quantity of information stolen. The scale and impact of APT1's operations compelled us to write this report. The activity we have directly observed likely represents only a small fraction of the cyber espionage that APT1 has conducted. Though our visibility of APT1's activities is incomplete, we have analyzed the group's intrusions against nearly 150 victims over seven years. From our unique vantage point responding to victims, we tracked APT1 back to four large networks in Shanghai, two of which are allocated directly to the Pudong New Area. We uncovered a substantial amount of APT1's attack infrastructure, command and control, and modus operandi (tools, tactics, and procedures). In an effort to underscore there are actual individuals behind the keyboard, Mandiant is revealing three personas we have attributed to APT1. These operators, like soldiers, may merely be following orders given to them by others. Our analysis has led us to conclude that APT1 is likely government-sponsored and one of the most persistent of China's cyber threat actors. We believe that APT1 is able to wage such a long-running and extensive cyber espionage campaign in large part because it receives direct government support. In seeking to identify the organization behind this activity, our research found that People's Liberation Army (PLA's) Unit 61398 is similar to APT1 in its mission, capabilities, and resources. PLA Unit 61398 is also located in precisely the same area from which APT1 activity appears to originate.",
      "object_refs": [
        "attack-pattern--3098c57b-d623-4c11-92f4-5905da66658b",
        "attack-pattern--1e2c4237-d469-4144-9c0b-9e5c0c513c49",
        "attack-pattern--e13f3e6d-4f9c-4265-b1cf-f997a1bf7827",
        "attack-pattern--5728f45b-2eca-4942-a7f6-bc4267c1ab8d",
        "attack-pattern--0bea2358-c244-4905-a664-a5cdce7bb767",
        "attack-pattern--7151c6d0-7e97-47ce-9290-087315ea3db7",
        "attack-pattern--0781fe70-4c94-4300-8865-4b08b98611b4",
        "identity--a9119a87-6576-46af-bfd7-4fbe55926671",
        "identity--e88ab115-7768-4630-baa3-3d49a7d946ea",
        "identity--0e9d20d9-fb11-42e3-94bc-b89fb5b007ca",
        "identity--ecf1c7de-d96c-41c6-a510-b9c65cdc9e3b",
        "indicator--031778a4-057f-48e6-9db9-c8d72b81ccd5",
        "indicator--da1d061b-2bc9-467a-b16f-8d14f468e1f0",
        "indicator--2173d108-5714-42fd-8213-4f3790259fda",
        "indicator--8ce03314-dfea-4498-ac9b-136e41ab00e4",
        "indicator--3f3ff9f1-bb4e-4392-89e5-1991179042ba",
        "indicator--8390fd29-24ed-45d4-84d7-c5e5feaf195d",
        "indicator--1002c58e-cbde-4930-b5ee-490037fd4f7e",
        "indicator--8d12f44f-8ac0-4b12-8b4a-3699ca8c9691",
        "indicator--745e1537-b4f3-49da-9f64-df6b1b5df190",
        "indicator--1dbe6ed0-c305-458f-9cce-f83c678f5afd",
        "indicator--b3b6b540-d838-41e2-853b-005056c00008",
        "indicator--b3b7035e-d838-41e2-8d38-005056c00008",
        "intrusion-set--da1065ce-972c-4605-8755-9cd1074e3b5a",
        "malware--2485b844-4efe-4343-84c8-eb33312dd56f",
        "malware--c0217091-9d3d-42a1-8952-ccc12d4ad8d0",
        "malware--0f01c5a3-f516-4450-9381-4dd9f2279411",
        "malware--33159b98-3264-4e10-a968-d67975b6272f",
        "malware--fb490cdb-6760-41eb-a79b-0b930a50c017",
        "malware--ea50ecb7-2cd4-4895-bd08-31cd591ed0ca",
        "threat-actor--6d179234-61fc-40c4-ae86-3d53308d8e65",
        "threat-actor--d84cf283-93be-4ca7-890d-76c63eff3636",
        "threat-actor--02e7c48f-0301-4c23-b3e4-02e5a0114c21",
        "threat-actor--d5b62b58-df7c-46b1-a435-4d01945fe21d",
        "threat-actor--94624865-2709-443f-9b4c-2891985fd69b",
        "tool--ce45f721-af14-4fc0-938c-000c16186418",
        "tool--e9778c42-bc2f-4eda-9fb4-6a931834f68c",
        "tool--1cf6a3b8-be43-4c1a-b042-546a890c31b2",
        "tool--4d82bd3e-24a3-4f9d-b8f3-b57267fe06a9",
        "tool--7de5dfcc-6809-4772-9f11-cf26c2be53aa",
        "tool--266b12f2-aa16-4607-809e-f2d33eebb52e",
        "tool--4215b0e5-928e-4b2a-9b5f-64819f287f48",
        "tool--a6dd62d0-9683-48bf-a9cd-61e7eceae57e",
        "tool--806a8f83-4913-4216-bb19-02b48ae25da5",
        "tool--98fd8dc1-6cc7-4908-899f-07473f55149a",
        "relationship--6598bf44-1c10-4218-af9f-75b5b71c23a7",
        "relationship--35f7a2bb-e4e2-4e56-8693-665bbb64162c",
        "relationship--fd5cda8b-f45f-43bd-a9da-e521ddd7126e",
        "relationship--a20b8626-a15e-41f0-bcb1-c05321e126f0",
        "relationship--d84cf283-93be-4ca7-890d-76c63eff3636",
        "relationship--71e6832f-17ee-42fd-938d-c7f881be2028",
        "relationship--9dd881a7-6e9b-4c35-bef5-7a777bca65d3",
        "relationship--306ce398-f708-47f9-88a1-38aa5b9985fc",
        "relationship--8668d82a-1c97-4bea-a367-e391b025e00e",
        "relationship--e0ca2caa-7fa0-4f36-ad19-96f107eb6023",
        "relationship--765815fb-d993-4a1d-959f-7f7bcc4a5eb3",
        "relationship--85b2a834-e4b5-4299-9a6b-bf2ac26dde7b",
        "relationship--61f4fd3b-f581-4497-9149-e624c317287b",
        "relationship--7cede760-b866-490e-ad5b-1df34bc14f8d",
        "relationship--b2806dec-6f20-4a0d-ae9a-d4b1f7be71e3",
        "relationship--3921b161-5872-4c21-8ab0-b5b84233f3dc",
        "relationship--81827b05-8c20-4247-b5d8-674295a1c611",
        "relationship--066593e1-49a4-4a3d-a5bb-2e0b4ce1a63c",
        "relationship--b385d984-ba8a-4180-8e0e-af7b9987bcb8",
        "relationship--6ffbec81-fa01-4b98-8726-c9d9fb2ef6b6",
        "relationship--25586f60-bc27-47d6-9a8e-d1c6456c2f28",
        "relationship--d080c1ea-1dd7-4da9-b64b-e68bb1c5887e",
        "relationship--c9c66478-c9cf-49cd-bca2-66ce34a9c56d",
        "relationship--44686fda-311c-4cdb-abef-80e922e7a3fb",
        "relationship--340cb676-79ff-49e9-b6ba-cd27e06772c4",
        "relationship--9908520f-b25d-44a8-900b-d4e0825dcd0d",
        "relationship--1fbd9a8d-4c14-431c-9520-3ccc50b748c1",
        "relationship--389a8dcd-8663-4f18-8584-d69a77bd71aa",
        "relationship--b345f1d0-09c5-4a71-bfc6-a52bd5923a01",
        "relationship--912b31d0-09c5-4a71-bfc6-a52bd5989a1b"
      ]
    },
    {
      "type": "relationship",
      "spec_version": "2.1",
      "id": "relationship--6598bf44-1c10-4218-af9f-75b5b71c23a7",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "relationship_type": "uses",
      "source_ref": "threat-actor--6d179234-61fc-40c4-ae86-3d53308d8e65",
      "target_ref": "malware--2485b844-4efe-4343-84c8-eb33312dd56f"
    },
    {
      "type": "relationship",
      "spec_version": "2.1",
      "id": "relationship--35f7a2bb-e4e2-4e56-8693-665bbb64162c",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "relationship_type": "uses",
      "source_ref": "threat-actor--6d179234-61fc-40c4-ae86-3d53308d8e65",
      "target_ref": "malware--c0217091-9d3d-42a1-8952-ccc12d4ad8d0"
    },
    {
      "type": "relationship",
      "spec_version": "2.1",
      "id": "relationship--fd5cda8b-f45f-43bd-a9da-e521ddd7126e",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "relationship_type": "attributed-to",
      "source_ref": "threat-actor--6d179234-61fc-40c4-ae86-3d53308d8e65",
      "target_ref": "identity--a9119a87-6576-46af-bfd7-4fbe55926671"
    },
    {
      "type": "relationship",
      "spec_version": "2.1",
      "id": "relationship--a20b8626-a15e-41f0-bcb1-c05321e126f0",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "relationship_type": "attributed-to",
      "source_ref": "threat-actor--6d179234-61fc-40c4-ae86-3d53308d8e65",
      "target_ref": "identity--e88ab115-7768-4630-baa3-3d49a7d946ea"
    },
    {
      "type": "relationship",
      "spec_version": "2.1",
      "id": "relationship--d84cf283-93be-4ca7-890d-76c63eff3636",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "relationship_type": "attributed-to",
      "source_ref": "threat-actor--d84cf283-93be-4ca7-890d-76c63eff3636",
      "target_ref": "identity--0e9d20d9-fb11-42e3-94bc-b89fb5b007ca"
    },
    {
      "type": "relationship",
      "spec_version": "2.1",
      "id": "relationship--71e6832f-17ee-42fd-938d-c7f881be2028",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "relationship_type": "attributed-to",
      "source_ref": "threat-actor--02e7c48f-0301-4c23-b3e4-02e5a0114c21",
      "target_ref": "identity--ecf1c7de-d96c-41c6-a510-b9c65cdc9e3b"
    },
    {
      "type": "relationship",
      "spec_version": "2.1",
      "id": "relationship--9dd881a7-6e9b-4c35-bef5-7a777bca65d3",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "relationship_type": "uses",
      "source_ref": "threat-actor--02e7c48f-0301-4c23-b3e4-02e5a0114c21",
      "target_ref": "malware--fb490cdb-6760-41eb-a79b-0b930a50c017"
    },
    {
      "type": "relationship",
      "spec_version": "2.1",
      "id": "relationship--306ce398-f708-47f9-88a1-38aa5b9985fc",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "relationship_type": "uses",
      "source_ref": "threat-actor--02e7c48f-0301-4c23-b3e4-02e5a0114c21",
      "target_ref": "malware--ea50ecb7-2cd4-4895-bd08-31cd591ed0ca"
    },
    {
      "type": "relationship",
      "spec_version": "2.1",
      "id": "relationship--8668d82a-1c97-4bea-a367-e391b025e00e",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "relationship_type": "attributed-to",
      "source_ref": "intrusion-set--da1065ce-972c-4605-8755-9cd1074e3b5a",
      "target_ref": "threat-actor--94624865-2709-443f-9b4c-2891985fd69b"
    },
    {
      "type": "relationship",
      "spec_version": "2.1",
      "id": "relationship--e0ca2caa-7fa0-4f36-ad19-96f107eb6023",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "relationship_type": "attributed-to",
      "source_ref": "intrusion-set--da1065ce-972c-4605-8755-9cd1074e3b5a",
      "target_ref": "threat-actor--d5b62b58-df7c-46b1-a435-4d01945fe21d"
    },
    {
      "type": "relationship",
      "spec_version": "2.1",
      "id": "relationship--765815fb-d993-4a1d-959f-7f7bcc4a5eb3",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "relationship_type": "attributed-to",
      "source_ref": "intrusion-set--da1065ce-972c-4605-8755-9cd1074e3b5a",
      "target_ref": "threat-actor--6d179234-61fc-40c4-ae86-3d53308d8e65"
    },
    {
      "type": "relationship",
      "spec_version": "2.1",
      "id": "relationship--85b2a834-e4b5-4299-9a6b-bf2ac26dde7b",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "relationship_type": "uses",
      "source_ref": "attack-pattern--1e2c4237-d469-4144-9c0b-9e5c0c513c49",
      "target_ref": "malware--0f01c5a3-f516-4450-9381-4dd9f2279411"
    },
    {
      "type": "relationship",
      "spec_version": "2.1",
      "id": "relationship--61f4fd3b-f581-4497-9149-e624c317287b",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "relationship_type": "uses",
      "source_ref": "attack-pattern--1e2c4237-d469-4144-9c0b-9e5c0c513c49",
      "target_ref": "malware--33159b98-3264-4e10-a968-d67975b6272f"
    },
    {
      "type": "relationship",
      "spec_version": "2.1",
      "id": "relationship--7cede760-b866-490e-ad5b-1df34bc14f8d",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "relationship_type": "indicates",
      "source_ref": "indicator--031778a4-057f-48e6-9db9-c8d72b81ccd5",
      "target_ref": "malware--33159b98-3264-4e10-a968-d67975b6272f"
    },
    {
      "type": "relationship",
      "spec_version": "2.1",
      "id": "relationship--b2806dec-6f20-4a0d-ae9a-d4b1f7be71e3",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "relationship_type": "indicates",
      "source_ref": "indicator--da1d061b-2bc9-467a-b16f-8d14f468e1f0",
      "target_ref": "malware--33159b98-3264-4e10-a968-d67975b6272f"
    },
    {
      "type": "relationship",
      "spec_version": "2.1",
      "id": "relationship--3921b161-5872-4c21-8ab0-b5b84233f3dc",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "relationship_type": "indicates",
      "source_ref": "indicator--2173d108-5714-42fd-8213-4f3790259fda",
      "target_ref": "malware--33159b98-3264-4e10-a968-d67975b6272f"
    },
    {
      "type": "relationship",
      "spec_version": "2.1",
      "id": "relationship--81827b05-8c20-4247-b5d8-674295a1c611",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "relationship_type": "indicates",
      "source_ref": "indicator--8ce03314-dfea-4498-ac9b-136e41ab00e4",
      "target_ref": "malware--33159b98-3264-4e10-a968-d67975b6272f"
    },
    {
      "type": "relationship",
      "spec_version": "2.1",
      "id": "relationship--066593e1-49a4-4a3d-a5bb-2e0b4ce1a63c",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "relationship_type": "uses",
      "source_ref": "attack-pattern--e13f3e6d-4f9c-4265-b1cf-f997a1bf7827",
      "target_ref": "tool--ce45f721-af14-4fc0-938c-000c16186418"
    },
    {
      "type": "relationship",
      "spec_version": "2.1",
      "id": "relationship--b385d984-ba8a-4180-8e0e-af7b9987bcb8",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "relationship_type": "uses",
      "source_ref": "attack-pattern--e13f3e6d-4f9c-4265-b1cf-f997a1bf7827",
      "target_ref": "tool--e9778c42-bc2f-4eda-9fb4-6a931834f68c"
    },
    {
      "type": "relationship",
      "spec_version": "2.1",
      "id": "relationship--6ffbec81-fa01-4b98-8726-c9d9fb2ef6b6",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "relationship_type": "uses",
      "source_ref": "attack-pattern--e13f3e6d-4f9c-4265-b1cf-f997a1bf7827",
      "target_ref": "tool--1cf6a3b8-be43-4c1a-b042-546a890c31b2"
    },
    {
      "type": "relationship",
      "spec_version": "2.1",
      "id": "relationship--25586f60-bc27-47d6-9a8e-d1c6456c2f28",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "relationship_type": "uses",
      "source_ref": "attack-pattern--e13f3e6d-4f9c-4265-b1cf-f997a1bf7827",
      "target_ref": "tool--4d82bd3e-24a3-4f9d-b8f3-b57267fe06a9"
    },
    {
      "type": "relationship",
      "spec_version": "2.1",
      "id": "relationship--d080c1ea-1dd7-4da9-b64b-e68bb1c5887e",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "relationship_type": "uses",
      "source_ref": "attack-pattern--e13f3e6d-4f9c-4265-b1cf-f997a1bf7827",
      "target_ref": "tool--7de5dfcc-6809-4772-9f11-cf26c2be53aa"
    },
    {
      "type": "relationship",
      "spec_version": "2.1",
      "id": "relationship--c9c66478-c9cf-49cd-bca2-66ce34a9c56d",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "relationship_type": "uses",
      "source_ref": "attack-pattern--e13f3e6d-4f9c-4265-b1cf-f997a1bf7827",
      "target_ref": "tool--266b12f2-aa16-4607-809e-f2d33eebb52e"
    },
    {
      "type": "relationship",
      "spec_version": "2.1",
      "id": "relationship--44686fda-311c-4cdb-abef-80e922e7a3fb",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "relationship_type": "uses",
      "source_ref": "attack-pattern--e13f3e6d-4f9c-4265-b1cf-f997a1bf7827",
      "target_ref": "tool--98fd8dc1-6cc7-4908-899f-07473f55149a"
    },
    {
      "type": "relationship",
      "spec_version": "2.1",
      "id": "relationship--340cb676-79ff-49e9-b6ba-cd27e06772c4",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "relationship_type": "uses",
      "source_ref": "attack-pattern--e13f3e6d-4f9c-4265-b1cf-f997a1bf7827",
      "target_ref": "tool--4215b0e5-928e-4b2a-9b5f-64819f287f48"
    },
    {
      "type": "relationship",
      "spec_version": "2.1",
      "id": "relationship--9908520f-b25d-44a8-900b-d4e0825dcd0d",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "relationship_type": "uses",
      "source_ref": "attack-pattern--0781fe70-4c94-4300-8865-4b08b98611b4",
      "target_ref": "tool--a6dd62d0-9683-48bf-a9cd-61e7eceae57e"
    },
    {
      "type": "relationship",
      "spec_version": "2.1",
      "id": "relationship--1fbd9a8d-4c14-431c-9520-3ccc50b748c1",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "relationship_type": "uses",
      "source_ref": "attack-pattern--0781fe70-4c94-4300-8865-4b08b98611b4",
      "target_ref": "tool--806a8f83-4913-4216-bb19-02b48ae25da5"
    },
    {
      "type": "relationship",
      "spec_version": "2.1",
      "id": "relationship--389a8dcd-8663-4f18-8584-d69a77bd71aa",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "relationship_type": "indicates",
      "source_ref": "indicator--3f3ff9f1-bb4e-4392-89e5-1991179042ba",
      "target_ref": "threat-actor--6d179234-61fc-40c4-ae86-3d53308d8e65"
    },
    {
      "type": "relationship",
      "spec_version": "2.1",
      "id": "relationship--b345f1d0-09c5-4a71-bfc6-a52bd5923a01",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "relationship_type": "indicates",
      "source_ref": "indicator--8390fd29-24ed-45d4-84d7-c5e5feaf195d",
      "target_ref": "threat-actor--6d179234-61fc-40c4-ae86-3d53308d8e65"
    },
    {
      "type": "relationship",
      "spec_version": "2.1",
      "id": "relationship--912b31d0-09c5-4a71-bfc6-a52bd5989a1b",
      "created": "2015-05-15T09:12:16.432Z",
      "modified": "2015-05-15T09:12:16.432Z",
      "relationship_type": "indicates",
      "source_ref": "indicator--1002c58e-cbde-4930-b5ee-490037fd4f7e",
      "target_ref": "threat-actor--6d179234-61fc-40c4-ae86-3d53308d8e65"
    }
  ]
};

// function genRandomTree(N = 300, reverse = false): GraphData {
//     return {
//         nodes: [...Array(N).keys()].map(i => ({ id: i })),
//         links: [...Array(N).keys()]
//             .filter(id => id)
//             .map(id => ({
//                 [reverse ? 'target' : 'source']: id,
//                 [reverse ? 'source' : 'target']: Math.round(Math.random() * (id - 1))
//             }))
//     };
// }



export const Stix2Visualizer: React.FC<IStix2Visualizer> = (props) => {
    const properties: IStix2Visualizer = {
      relationOptions: {
        disableDefaultHoverBehavior: false,
        color: 'rgba(126,126,126, 0.6)',
        distance: 60,
        curvature: 0.25,
        ...props.relationOptions
      },
      directionOptions: {
        arrowLength: 3.5,
        arrowRelativePositions: 0.95,
        directionalParticles: 10,
        directionalParticleWidth: 1,
        directionalParticleSpeed: 0.005,
        directionalParticlesAndArrowColor: 'rgba(0, 0, 0, 0, 0)',
        displayDirections: true,
        ...props.directionOptions
      },
      relationLabelOptions: {
        fontSize: 3 ,
        color: 'rgba(126,126,126, 0.9)',
        display: false,
        onZoomOutDisplay: false,
        ...props.relationLabelOptions,
      },
      nodeLabelOptions:{
        fontSize: 4,
        color: 'rgba(39, 37, 37, 0.9)',
        display: true,
        onZoomOutDisplay: false,
        ...props.nodeLabelOptions,
      },
      nodeOptions: {
        size: 12,
        disableDefaultHoverBehavior: false,
        ...props.nodeOptions,
      }

    }
    const fgRef = useRef<any>();
  const initialZoomRef  = useRef<number | null>(null); 
  const ZOOM_OUT_THRESHOLD = 0.80; // Only trigger if zoom-out is more than 20%

    const handleClick = useCallback((node: NodeObject) => {
        // Aim at node from outside it
        if(node.x && node.y && node.z){
            
        const distance = 40;
        const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
            // alert(`${node.x}, ${node.y}, ${node.z}`);
            fgRef.current.cameraPosition(
                { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
                node, // lookAt ({ x, y, z })
                3000  // ms transition duration
            );
    }
    }, [fgRef]);

    const handleZoom = ({ k }: { k: number; x: number; y: number }) => {
    if (initialZoomRef.current === null) {
      initialZoomRef.current = k; // store initial zoom on first call
      return;
    }
    const initialZoom = initialZoomRef.current;
    console.log(initialZoom, k)
    if (k < initialZoom * ZOOM_OUT_THRESHOLD) {
      if(properties.nodeLabelOptions?.onZoomOutDisplay === false){
        properties.nodeLabelOptions.display = false;
      }
      if(properties.relationLabelOptions?.onZoomOutDisplay === false){
        properties.relationLabelOptions.display = false;
      }
      // Call your custom function here
    }
    else {
      if(properties.nodeLabelOptions?.onZoomOutDisplay === false && properties.nodeLabelOptions?.display === false){
        properties.nodeLabelOptions.display = true;
      }
      if(properties.relationLabelOptions?.onZoomOutDisplay === false && properties.relationLabelOptions?.display === false){
        properties.relationLabelOptions.display = true;
      }
    }
    // const prevZoom = prevZoomRef.current;

    // Detect significant zoom-out
    // if (k < prevZoom && (prevZoom - k) >= ZOOM_OUT_THRESHOLD) {
    //   if(properties.nodeLabelOptions?.onZoomOutDisplay === false){
    //     properties.nodeLabelOptions.display = false;
    //   }
    //   if(properties.relationLabelOptions?.onZoomOutDisplay === false){
    //     properties.relationLabelOptions.display = false;
    //   }
      
    //   console.log('📉 Significant Zoom Out!');
    //   // 🔁 Trigger your zoom-out function here
    // }
    // else{

    // }

    // Update previous zoom scale
    // prevZoomRef.current = k;
  };
const transformedGraph = useMemo(() => {
  return formatData(sampleJsonData, 0.1);
}, [sampleJsonData]);
    // const gData = graphData; //dataSample; // genRandomTree(40); //dataSample; //
    // console.log(gData);
    const NODE_R = 8;
    useEffect(() => {
      const fg = fgRef.current;
      /**
       * By default distance is automatically
       * adjusted between two two links.
       */
      if (
        properties.relationOptions?.distance &&
        typeof properties.relationOptions?.distance === 'number' &&
        fg
      ) {
          fg.d3Force('link').distance(properties.relationOptions?.distance); // same as linkDistance
      }
    }, [properties.relationOptions?.distance])
    // const data = useMemo(() => {

    //     // cross-link node objects
    //     gData?.links?.forEach(link => {
    //         if(link.source && link.target){
    //       const a = gData.nodes[link.source as unknown as number];
    //       const b = gData.nodes[link.target as unknown as number];
    //       a && !a.neighbors && (a.neighbors = []);
    //       b && !b.neighbors && (b.neighbors = []);
    //       a && a.neighbors.push(b);
    //       b && b.neighbors.push(a);

    //       a && !a.links && (a.links = []);
    //       b && !b.links && (b.links = []);
    //       a && a.links.push(link);
    //       b && b.links.push(link);
    //     }
    //     });

    //     return gData;
    //   }, []);

      const [highlightNodes, setHighlightNodes] = useState(new Set());
      const [highlightLinks, setHighlightLinks] = useState(new Set());
      const [hoverNode, setHoverNode] = useState<NodeObject | null>(null);

      const updateHighlight = () => {
        setHighlightNodes(highlightNodes);
        setHighlightLinks(highlightLinks);
      };

      // const handleNodeHover = (node: NodeObject | null) => {
      //   highlightNodes.clear();
      //   highlightLinks.clear();
      //   if (node) {
      //     highlightNodes.add(node);
      //     node?.neighbors?.forEach((neighbor: unknown) => highlightNodes.add(neighbor));
      //     node?.links?.forEach((link: unknown) => highlightLinks.add(link));
      //   }

      //   setHoverNode(node || null);
      //   updateHighlight();
      // };

      const handleLinkHover = (link: LinkObject | null) => {
        highlightNodes.clear();
        highlightLinks.clear();

        if (link) {
          highlightLinks.add(link);
          highlightNodes.add(link.source);
          highlightNodes.add(link.target);
        }

        updateHighlight();
      };
const drawNode = useCallback((node: NodeObject, ctx: CanvasRenderingContext2D) => {
        const size = properties.nodeOptions?.size || 0;
        console.log('node');
        if(node.x && node.y && node.img){
          // console.log(node.img);
          ctx.drawImage(node.img, node.x - size / 2, node.y - size / 2, size, size);
       
        
        if(node.name && properties.nodeLabelOptions?.display){
          
        const labelOptions: ILabelOptions = {
            fontSize: properties.nodeLabelOptions?.fontSize,
            backgroundColor: properties.nodeLabelOptions?.backgroundColor,
            color: properties.nodeLabelOptions?.color,
            font: properties.nodeLabelOptions?.font,
            display: properties.nodeLabelOptions?.display
          } 
        // const t = 0.5;
        // const x = (1 - t) ** 2 * node.x + 2 * (1 - t) * t * node.fx + t ** 2 * to.x;
        // const y = (1 - t) ** 2 * node.y + 2 * (1 - t) * t * node.cy + t ** 2 * to.y;
        createLabel(node.name, ctx, labelOptions, node.x, node.y+(size / 2) + 5);
     }
    }
        
        // const label = node.name;
        //     const fontSize = 5;
        //     ctx.font = `${fontSize}px Sans-Serif`;
        //     const textWidth = ctx.measureText(node.label).width;
        //     // const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

        //     // ctx.fillStyle = 'rgba(14, 13, 13, 0.8)';
        //     // ctx.fillRect((node.x) || 0 - bckgDimensions[0] / 2, node.y || 0  - bckgDimensions[1] / 2, bckgDimensions[0],
        //     // bckgDimensions[1]);

        //     ctx.textAlign = 'center';
        //     ctx.textBaseline = 'middle';
        //     ctx.fillStyle = node.color;
        //     ctx.fillText(label?.toString() || 'Label Not Found!', node.x || 0, (node.y || 0)+10);
      }, []);

      const drawLink = useCallback((link: LinkObject, ctx: CanvasRenderingContext2D) => {
        // console.log('bhauo')
        let labelOptions: ILabelOptions | undefined = undefined;
        if(link.label){
          labelOptions = {
            fontSize: properties.relationLabelOptions?.fontSize,
            backgroundColor: properties.relationLabelOptions?.backgroundColor,
            color: properties.relationLabelOptions?.color,
            font: properties.relationLabelOptions?.font,
            display: properties.relationLabelOptions?.display
          } 
        }
        const color:string = link.color || properties.relationOptions?.color || '#0000';
        const width = link.width || typeof properties.relationOptions?.width || 0;
        drawCurvedLine(ctx, {
          x: (link.source as NodeObject)?.x || 0,
          y: (link.source as NodeObject)?.y || 0,
        },
        {
          x: (link.target as NodeObject)?.x || 0,
          y: (link.target as NodeObject)?.y || 0,
        },
        properties.relationOptions?.curvature || 0,
        color,
        width as number,
        link.label,
        labelOptions
      );
            // const fontSize = 12/link.globalScale;
            // ctx.font = `${fontSize}px Sans-Serif`;
            // const textWidth = ctx.measureText(link.label).width;
            // const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

            // ctx.fillStyle = 'rgba(14, 13, 13, 0.8)';
            // ctx.fillRect((link.x) || 0 - bckgDimensions[0] / 2, link.y || 0  - bckgDimensions[1] / 2, bckgDimensions[0],
            // bckgDimensions[1]);

            // ctx.textAlign = 'center';
            // ctx.textBaseline = 'middle';
            // ctx.fillStyle = link.color;
            // ctx.fillText(label?.toString() || 'Label Not Found!', link.x || 0, link.y || 0);
      
      }, []);

      const particleWidth = useCallback((link: LinkObject) => {
        // console.log('aaaaaa');
        if(highlightLinks.has(link)) {
          return 4;
        }
        else if(typeof properties.directionOptions?.directionalParticleWidth === 'number'){
          return properties.directionOptions?.directionalParticleWidth;
        }
        else if(properties.directionOptions?.directionalParticleWidth){
          properties.directionOptions?.directionalParticleWidth(link);
        }
        return 0;
      }, []);

      const linkWidth = useCallback((link: LinkObject) => {
        if(
          !properties.relationOptions?.disableDefaultHoverBehavior &&
          highlightLinks.has(link)
        ) {
          return 5;
        }
        else if(typeof properties.relationOptions?.width === 'number'){
          return properties.relationOptions?.width;
        }
        else if(properties.relationOptions?.width){
          properties.relationOptions?.width(link);
        }
        return 0;
      }, []);

      const paintRing = useCallback((node: NodeObject, ctx: CanvasRenderingContext2D) => {
        // add ring just for highlighted nodes
        ctx.beginPath();
        if(node.x && node.y){
            ctx.arc(node.x, node.y, NODE_R * 1.4, 0, 2 * Math.PI, false);
        }
        ctx.fillStyle = node === hoverNode ? 'red' : 'orange';
        ctx.fill();
      }, [hoverNode]);
      console.log('AGAAAAAAAAAAIn')
      return <ForceGraph2D
      nodeLabel="id"
      ref={fgRef}
      graphData={transformedGraph}
      linkDirectionalArrowLength={properties.directionOptions?.arrowLength}
      linkDirectionalArrowRelPos={properties.directionOptions?.arrowRelativePositions}
      linkCurvature={properties.relationOptions?.curvature}
      nodeCanvasObject={drawNode}
      // nodePointerAreaPaint={(node, color, ctx) => {
      //   if(node.x && node.y){
      //     const size = 12;
      //     ctx.fillStyle = color;
      //     ctx.fillRect(node.x - size / 2, node.y - size / 2, size, size); // draw square as pointer trap
      // }
      // }}
      /**
       * Focus on Node
       */
      onNodeClick={handleClick}
      /**
       * Show Direction Particles
       */
      linkDirectionalParticles={properties.directionOptions?.directionalParticles}
      linkDirectionalParticleSpeed={properties.directionOptions?.directionalParticleSpeed}
      /**
       * Fit to Canvas when interacted with nodes
       */
      cooldownTicks={50}
      onEngineStop={() => fgRef.current.zoomToFit(400)}
      onZoom={handleZoom}
      /**
       * Highlight Nodes and Edges
       */
      nodeRelSize={NODE_R}
      linkWidth={linkWidth}
      linkDirectionalParticleWidth={particleWidth} // by default we are keeping 0.5 size for direction particles 
      // linkLabel={properties.relationLabelOptions?.l} //not needed
      linkColor={properties.directionOptions?.directionalParticlesAndArrowColor &&
        typeof properties.directionOptions.directionalParticlesAndArrowColor === 'string'? 
        /**
         * Its a bug in this library, so if a string is provided
         * pass it to the function to make it work.  
         */
        _ => properties.directionOptions?.directionalParticlesAndArrowColor as string :
        properties.relationOptions?.color}
      linkCanvasObject={drawLink}
      /**
       * Follwoing Highlighting features works only with 2D
       * ----------------------------------------------
       * autoPauseRedraw={false}
       * nodeCanvasObjectMode={(node: NodeObject) => highlightNodes.has(node) ? 'before' : undefined}
       * nodeCanvasObject={paintRing}
       */
      // onNodeHover={handleNodeHover}
      onLinkHover={handleLinkHover}
      // nodeThreeObject={}
      
  />;
    // return <ForceGraph3D
    //     nodeLabel="id"
    //     ref={fgRef}
    //     graphData={gData}
    //     linkDirectionalArrowLength={3.5}
    //     linkDirectionalArrowRelPos={1}
    //     linkCurvature={0.25}
    //     /**
    //      * Focus on Node
    //      */
    //     onNodeClick={handleClick}
    //     /**
    //      * Show Direction Particles
    //      */
    //     linkDirectionalParticles={10}
    //     linkDirectionalParticleSpeed={0.005}
    //     /**
    //      * Fit to Canvas when interacted with nodes
    //      */
    //     cooldownTicks={50}
    //     onEngineStop={() => fgRef.current.zoomToFit(400)}
    //     /**
    //      * Highlight Nodes and Edges
    //      */
    //     nodeRelSize={NODE_R}
    //     linkWidth={link => highlightLinks.has(link) ? 5 : 1}
    //     linkDirectionalParticleWidth={link => highlightLinks.has(link) ? 4 : 0.5} // by default we are keeping 0.5 size for direction particles 
    //     /**
    //      * Follwoing Highlighting features works only with 2D
    //      * ----------------------------------------------
    //      * autoPauseRedraw={false}
    //      * nodeCanvasObjectMode={(node: NodeObject) => highlightNodes.has(node) ? 'before' : undefined}
    //      * nodeCanvasObject={paintRing}
    //      */
    //     onNodeHover={handleNodeHover}
    //     onLinkHover={handleLinkHover}
    //     // nodeThreeObject={({ img }: Record<string, string>) => {
    //     //     console.log(img);
    //     //     const imgTexture = new THREE.TextureLoader().load(`../assets/stixIcons/stix2.png`);
    //     //     imgTexture.colorSpace = THREE.SRGBColorSpace;
    //     //     const material = new THREE.SpriteMaterial({ map: imgTexture });
    //     //     const sprite = new THREE.Sprite(material);
    //     //     sprite.scale.set(12, 12, 1);
  
    //     //     return sprite;
    //     //   }}
    //     // nodeThreeObject={}
        
    // />;
} 