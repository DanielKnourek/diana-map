import player from '../../map/[playerName]';
import { getPlayer } from '/pages/api/map/player.js';

export async function getBurrows(query) {
    const API = {
        hypixel: 'https://api.hypixel.net',
        hypixel_key: 'badde73b-850a-4027-bda9-8a753c50e245'
    }

    player = await getPlayer(query);
    let selectedProfile = selectProfile(player, query.profile)
    // console.log(player);
    // console.log(selectedProfile);

    return await fetch(`${API.hypixel}/skyblock/profile${strinfyParams({key: API.hypixel_key, uuid: player.uuid, profile: selectedProfile})}`)
        .then(result => result.json())
        .then(({ profile }) => {
            return profile.members[player.uuid].griffin;
        })
    

    function strinfyParams(params_) {
        let stringified = new Array()
        for (const key in params_) {
            stringified.push(`${key}=${params_[key]}`);
        }
        return `?${stringified.join("&")}`
    }

    function selectProfile(player, profile_name){
        for (const profile in player.profiles) {
            if (player.profiles[profile].cute_name.toLocaleLowerCase() == profile_name.toLocaleLowerCase()) {
                return profile;                
            }
        }
        return Object.keys(player.profiles)[0]
    }
}

export default async function handler(req, res) {
    
    const player = await getBurrows(req.query);
    if(!player.success){
        res.status(404);
    }
    res.status(200).json(player);
  }
  