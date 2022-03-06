export const ADD_PEER = "ADD_PEER" as const;
export const REMOVE_PEER = "REMOVE_PEER" as const;

export const addPeerAction = (peerId: string, stream: MediaStream) => ({
    type: ADD_PEER,
    payload: { peerId, stream },
});

export const removePeerAction = (peerId: string) => ({
    type: REMOVE_PEER,
    payload: { peerId },
});
