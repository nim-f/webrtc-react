import { IPeer } from "../types/peer";
import {
    ADD_PEER_STREAM,
    REMOVE_PEER_STREAM,
    ADD_PEER_NAME,
    ADD_ALL_PEERS,
} from "./peerActions";

export type PeerState = Record<
    string,
    { stream?: MediaStream; userName?: string; peerId: string }
>;
type PeerAction =
    | {
          type: typeof ADD_PEER_STREAM;
          payload: { peerId: string; stream: MediaStream };
      }
    | {
          type: typeof REMOVE_PEER_STREAM;
          payload: { peerId: string };
      }
    | {
          type: typeof ADD_PEER_NAME;
          payload: { peerId: string; userName: string };
      }
    | {
          type: typeof ADD_ALL_PEERS;
          payload: {
              peers: Record<string, IPeer>;
          };
      };

export const peersReducer = (state: PeerState, action: PeerAction) => {
    switch (action.type) {
        case ADD_PEER_STREAM:
            return {
                ...state,
                [action.payload.peerId]: {
                    ...state[action.payload.peerId],
                    stream: action.payload.stream,
                },
            };
        case ADD_PEER_NAME:
            return {
                ...state,
                [action.payload.peerId]: {
                    ...state[action.payload.peerId],
                    userName: action.payload.userName,
                },
            };
        case REMOVE_PEER_STREAM:
            return {
                ...state,
                [action.payload.peerId]: {
                    ...state[action.payload.peerId],
                    stream: undefined,
                },
            };
        case ADD_ALL_PEERS:
            return { ...state, ...action.payload.peers };
        default:
            return { ...state };
    }
};
