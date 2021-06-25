import { useRouter } from 'next/router';

import Image from 'next/image'
import hub_map from '/public/hub_map.jpeg'
import styles from '/styles/Home.module.css'
import stylesMap from '/styles/Map.module.css'
import Head from 'next/head'

import { getBurrows } from '/pages/api/map/burrows.js';

function Profile({ points }) {
// export default function player({ player }) {
    // const router = useRouter();
    // const result = router.query;
    // const { playerName, uuid } = router.query;

    // console.log(result)

    // return (<>
    // <h1>Hello {playerName}</h1>
    // <h1>Hey {uuid}</h1>   
    // </>)

return (
    <>
    <Head>
        <title>Diana map</title>
        <meta http-equiv="refresh" content="10" key="refresher"/>
    </Head>
    <div className={styles.container}>
        <h1>Map of my burrows</h1>
        <div className={stylesMap.container}>
            <Image src={hub_map} alt="Map of hub" width={500} height={500} layout="responsive"/>
            {drawCircles(points)}
        </div>
        <p> Created by Daniel Kňourek | 2021 </p>
    </div>
    </>
    )
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
        // console.log(points);

    let elements = new Array();
    for (const pointIndex in points.burrows) {
        elements.push( drawCircle(pointIndex, points.burrows[pointIndex]) );
        // console.log(elements);
    }
    return elements
}
function drawCircle(id, point){
    // console.log(point)
    let colors = [stylesMap.level1, stylesMap.level2, stylesMap.level3, stylesMap.level4];

    // let point = {x : -3, y : 70, z : -66}; //center
    // let point = {x : -8, y : 86, z : -15}; // flower
    // let point = {x : -76, y : 93, z : 88}; // museum
    // let point = {x : 93, y : 83, z : 188}; // dark auction
    let position = calculateCoords(point, {x: 1000, z: 1000});
    // console.log(position)
    return (
        <div key={id} className={[stylesMap.point, colors[point.chain]].join(" ")} style={{top: position.z-5+"px", left: position.x-5+"px"}}></div>
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

export async function getServerSideProps({ params }){
    
    // const [modsData, priceData] = await Promise.all([
    //     fetch(`http://localhost:1337/mods/${id}`).then(r => r.json()),
    //     fetch(`http://localhost:1337/prices/${id}`).then(r => r.json())
    //   ]);

    let points = await getBurrows({name: params.playerName, profile: params.profile});
    // console.log(points);
    return {
        props: {points: points}
    }
}

export default Profile;
