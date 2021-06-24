import { useRouter } from 'next/router';
import React, { Component } from 'react'
import Select from 'react-select'

export default function player({ player }) {
    const router = useRouter();
    const { playerName } = router.query;

    // console.log(player);

    let options = Array()
    for (const key in player.profiles) {
        options.push( {value: key, label: player.profiles[key].cute_name})
    }
    console.log(options);


    return (<>
    <h1>Hello {playerName}</h1>
    <Select options={options} />
    </>)
}

export async function getServerSideProps({ params }){
    const API_mojang = 'https://api.mojang.com/users/profiles/minecraft/';
    const API_hypixel = 'https://api.hypixel.net';
    const API_key = 'badde73b-850a-4027-bda9-8a753c50e245';

    let querry = `${API_mojang}${params.playerName}`;
    let player = { success: false};
    await fetch(querry)
    .then(result => result.json())
    .then((response) => {
        // console.log(response);
        player.name = response.name;
        player.uuid = response.id;
        player.success = true;
    })

    querry = `${API_hypixel}/player?key=${API_key}&uuid=${player.uuid}`;
    await fetch(querry)
    .then(result => result.json())
    .then((response) => {
        if (!response.success){
            console.log("error"); // error
        }
        player.profiles = response.player.stats.SkyBlock.profiles;
        // console.log(player.profiles);
    })

    return {
        props: { player: player}
    }
}

// export async function getStaticProps({ params }){
    
//     // console.log(points);
//     return {
//         props: { name : params.name}
//     }
// }

// https://api.mojang.com/users/profiles/minecraft/Kdandikk

