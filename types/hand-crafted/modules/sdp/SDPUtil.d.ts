import SDP from './SDP';
import { MLineWrap } from './SdpTransformUtil';

export type SDPUtil = {
  filterSpecialChars: ( text: string ) => string;
  iceparams: ( mediadesc: unknown, sessiondesc: unknown ) => unknown; // TODO:
  parseICEUfrag: ( line: string ) => string;
  buildICEUfrag: ( frag: unknown ) => string; // TODO:
  parseICEPwd: ( line: string ) => string;
  buildICEPwd: ( pwd: unknown ) => string; // TODO:
  parseMID: ( line: string ) => string;
  /**
   * Finds the MSID attribute in the given array of SSRC attribute lines and returns the value.
   */
  parseMSIDAttribute: (ssrcLines: string[]) => string | undefined;
  parseMLine: ( line: string ) => unknown; // TODO:
  buildMLine: ( mline: unknown ) => string; // TODO:
  parseRTPMap: ( line: string ) => unknown; // TODO:
  parseSCTPMap: ( line: string ) => unknown[]; // TODO:
  parseSCTPPort: (line: string) => string; // TODO:
  buildRTPMap: ( el: unknown ) => string; // TODO:
  parseCrypto: ( line: string ) => unknown; // TODO:
  parseFingerprint: ( line: string ) => unknown; // TODO:
  parseFmtp: ( line: string ) => unknown; // TODO:
  parseICECandidate: ( line: string ) => unknown; // TODO:
  buildICECandidate: ( cand: unknown ) => unknown; // TODO:
  parseSSRC: ( desc: unknown ) => unknown; // TODO:
  /**
   * Gets the source name out of the name attribute 'a=ssrc:254321 name:name1'.
   */
  parseSourceNameLine: (ssrcLines: string[]) => string;
  parseRTCPFB: ( cand: unknown ) => unknown; // TODO:
  parseExtmap: ( cand: unknown ) => unknown; // TODO:
  findLine: ( haystack: string, needle: string, sessionpart?: string ) => boolean;
  findLines: ( haystack: string, needle: string, sessionpart?: string ) => string[];
  candidateToJingle: ( line: string ) => unknown; // TODO:
  candidateFromJingle: ( cand: unknown ) => unknown; // TODO:
  parsePrimaryVideoSsrc: ( videoMLine: MLineWrap ) => number;
  generateSsrc: () => number;
  getSsrcAttribute: ( mLine: unknown, ssrc: number, attributeName: string ) => string;
  parseGroupSsrcs: ( ssrcGroup: unknown ) => number[]; // TODO:
  getMedia: ( sdp: SDP, type: unknown ) => unknown; // TODO:
  getUfrag: ( sdp: SDP ) => string;
  preferCodec: ( mline: unknown, codecName: string ) => void; // TODO:
  stripCodec: ( mLine: unknown, codecName: string, highProfile?: boolean ) => void; // TODO:
}
