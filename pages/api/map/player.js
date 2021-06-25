
export async function getPlayer(query) {
    const API = {
        mojang: 'https://api.mojang.com/users/profiles/minecraft/',
        hypixel: 'https://api.hypixel.net',
        hypixel_key: 'badde73b-850a-4027-bda9-8a753c50e245'
    }

    let player = { success: false };

    await fetch(`${API.mojang}${query.name}`)
    .then(result => result.json())
    .then((response) => {
        // console.log(response);
        player.name = response.name;
        player.uuid = response.id;
        player.success = true;
    })
    if(!player.success){
        return player
    }

    await fetch(`${API.hypixel}/player?key=${API.hypixel_key}&uuid=${player.uuid}`)
    .then(result => result.json())
    .then((response) => {
        if (!response.success){
            player.success = false;
            return player;
        }
        player.profiles = response.player.stats.SkyBlock.profiles;
    })

    return player;
}

export default async function handler(req, res) {
    
    const player = await getPlayer(req.query);
    if(!player.success){
        res.status(404);
    }
    res.status(200).json(player);
  }
  