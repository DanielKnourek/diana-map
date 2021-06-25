import { useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import hub_map from '../../public/hub_map.jpeg'
import styles from '../../styles/Home.module.css'
import stylesMap from '../../styles/Map.module.css'


export default function Map({points}){
    const [playerName, setPlayerName] =  useState("Kdandikk")
    return (

    <div className={styles.container}>
        <h1>Map of Kdandikk burrows</h1>
        <div className={stylesMap.container}>
            <Image src={hub_map} alt="Map of hub" width={500} height={500} layout="responsive"/>
            {drawCircles(points)}
        </div>
        <div>
            <p>Go to your profile:</p>
            <input type="text" onChange={(e) => (setPlayerName(e.target.value))} placeholder="Your nickname"></input>
            <Link href={`map/${playerName}`}>
                <button>GO!</button>
            </Link>
        </div>
        <p> Created by Daniel Kňourek | 2021 </p>
    </div>
    )
}

async function getCords(){
    const api_link = "https://api.hypixel.net" 
    const api_mc_link = "https://api.mojang.com/users/profiles/minecraft" 
    const params_ = {
        key : 'badde73b-850a-4027-bda9-8a753c50e245',
        uuid: '2cac5693716a404dae32e3f4107c6c1a'
    }

    let querry = `${api_link}/player${strinfyParams(params_)}`;

    await fetch(querry)
        .then(result => result.json())
        .then(({ player }) => {
            // Log the player's username
            // console.log(player.displayname)

            for (const key in player.stats.SkyBlock.profiles) {
                if(player.stats.SkyBlock.profiles[key].cute_name == "Grapes"){
                    params_.profile = player.stats.SkyBlock.profiles[key].profile_id
                    break;
                }
            }
        })
    
    let account = undefined
     
    querry = `${api_link}/skyblock/profile${strinfyParams(params_)}`;
    // console.log( await getBurrows(querry, params_.uuid) );
    let burrows = await getBurrows(querry, params_.uuid);
    return burrows;
}

async function getBurrows(querry, uuid){
    let account = {}
    await fetch(querry)
    .then(result => result.json())
    .then(({ profile }) => {
        account = profile.members[uuid]        
    })

    return account.griffin;
}

function strinfyParams(params_) {
    let stringified = new Array()
    for (const key in params_) {        
        stringified.push(`${key}=${params_[key]}`);
    }
    return `?${stringified.join("&")}`
}

function calculateCoords(point, size){
    let data = {
        OriginalSize : {
            x : 2842,
            z : 2554
        },
        CenterPositon : {
            x : 1689,
            z : 967
        },
        CenterCoords : {
            x : -3,
            y : 70,
            z : -66
        },
        MapPosition : {
            x : 1689,
            z : 794
        },
        MapCoords : {
            x : -3,
            y : 69,
            z : -96
        }
    }

    data.pixelDistance = (data.CenterPositon.z - data.MapPosition.z) / (data.CenterCoords.z - data.MapCoords.z)
    // console.log(data.pixelDistance);
    // let point = {x : -3, y : 70, z : -66}; //center
    // let point = {x : -8, y : 86, z : -15}; // flower
    // let point = {x : -76, y : 93, z : 88}; // museum
    // let point = {x : 93, y : 83, z : 188}; // dark auction

    let position = getPosition(data, point);
    // console.log("positon")
    // console.log(position)

    position.x *= size.x/data.OriginalSize.x;
    position.z *= size.z/data.OriginalSize.z;
    // console.log("ratio")
    // console.log(size.x/data.OriginalSize.x)
    // console.log(size.z/data.OriginalSize.z)
    return position
}
function drawCircles(points){
        console.log(points);

    let elements = new Array();
    for (const pointIndex in points.burrows) {
        elements.push( drawCircle(pointIndex, points.burrows[pointIndex]) );
        // console.log(elements);
    }
    return elements
}
function drawCircle(id, point){
    // console.log(point)

    // let point = {x : -3, y : 70, z : -66}; //center
    // let point = {x : -8, y : 86, z : -15}; // flower
    // let point = {x : -76, y : 93, z : 88}; // museum
    // let point = {x : 93, y : 83, z : 188}; // dark auction
    let position = calculateCoords(point, {x: 1000, z: 1000});
    // console.log(position)
    return (
        <div key={id} className={stylesMap.point} style={{top: position.z-5+"px", left: position.x-5+"px"}}></div>
    )
}

function getPosition(data, coords){
    let relativeCoords = {
        x: (coords.x - data.CenterCoords.x),
        z: (coords.z - data.CenterCoords.z)
    }
    // console.log("data rel");
    // console.log(relativeCoords);
    let finalPosition = {
        x: (data.CenterPositon.x + relativeCoords.x * data.pixelDistance),
        z: (data.CenterPositon.z + relativeCoords.z * data.pixelDistance)
    }
    // console.log("data");
    // console.log(finalPosition);
    return finalPosition;
}

// size 2842 2554
// /img 1687 968
// /-3 70 -66
// / img 1689 794 MAP
// / -3 69 -96 MAP

// /-8 86 -15 FLOWER

// top: 380.3px; left: 590.622px; wanted

export async function getStaticProps({ params }){
    
    let points = await getCords();
    // console.log(points);
    return {
        props: {points: points}
    }
}