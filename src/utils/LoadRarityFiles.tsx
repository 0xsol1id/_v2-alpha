import SolJunk from './rarityData/soljunks.json';
import SMB from './rarityData/smb.json';
import Faces from './rarityData/faces.json';
import Rektiez from './rarityData/rektiez.json';
import HarrddyJunks from './rarityData/harrddyjunks.json';

const rarityFiles = [SolJunk, SMB, Faces, Rektiez, HarrddyJunks];

export const LoadRarityFile = (id: number) => {
    return rarityFiles[id];
};