import SolJunk from './rarityData/soljunks.json'
import SMB from './rarityData/smb.json'
import Faces from './rarityData/faces.json'
import Rektiez from './rarityData/rektiez.json'
import HarrddyJunks from './rarityData/harrddyjunks.json'

//ABFRAGE DER JSON FILES MUSS ÜBER EXPRESS SERVER PASSIEREN, DRINGEND UMBAUEN
export const LoadRarityFile = (id: number) => {
    if (id == 0)
        return SolJunk
    else if (id == 1)
        return SMB
    else if (id == 2)
        return Faces
    else if (id == 3)
        return Rektiez
    else if (id == 4)
        return HarrddyJunks
};