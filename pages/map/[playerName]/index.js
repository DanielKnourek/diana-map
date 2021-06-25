import { useRouter } from 'next/router';
import Link from 'next/link'
import React, { Component, useState } from 'react'
import Select from 'react-select'

import { getPlayer } from '/pages/api/map/player.js';

function Player({ player }) {
    const router = useRouter();
    const { playerName } = router.query;

    const [selected, setSelected] = useState("nonono");

    // console.log(player);

    let options = Array()
    for (const key in player.profiles) {
        options.push( {value: player.profiles[key].cute_name, label: player.profiles[key].cute_name})
    }
    console.log(options);

    const MyLink = () => (
        <Link href={`${playerName}/${selected}`}>
            <button>Go to Map {selected}</button>
        </Link>
      )
    const MyComponent_onchange = (e) => (setSelected(e.value))
    // const MyComponent_onchange = (e) => (MyLink.href=`${playerName}/${e.value}`)
    // const MyComponent_onchange = (e) => (console.log(e.value))
    const MyComponent = () => (
        <Select options={options} onChange={MyComponent_onchange} />
      )    
    

    return (<>
    <h1>Hello {playerName}</h1>
    {/* <Select name="profile_select" options={options} /> */}
    <MyComponent/>
    <MyLink/>
    
    </>)
}

export async function getServerSideProps({ params }){

    // player = await fetch(`http://localhost:3000/api/map/player?name=${params.playerName}`).then(r => r.json())
    let player = await getPlayer({name: params.playerName})


    return {
        props: { player: player}
    }
}

export default Player;

// export async function getStaticProps({ params }){
    
//     // console.log(points);
//     return {
//         props: { name : params.name}
//     }
// }

// https://api.mojang.com/users/profiles/minecraft/Kdandikk

