require('./styles/index.scss');

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import ForceGraph3D from '3d-force-graph';
import gsap from "gsap";
import { Howl } from 'howler';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const data = require("./assets/bddi2020.json")
const data2021 = require("./assets/bddi2021.json")
// const GirlGLTF = require("./assets/boy.glb")

const logo = require("./assets/logo.png")
document.getElementById("logo-home").src = logo;
document.getElementById("logo-content").src = logo;
const speakeron = require("./assets/speaker-on.png")
const speakeroff = require("./assets/speaker-off.png")
document.getElementById("speaker").src = speakeroff;
const next = require("./assets/next.png")
document.getElementById("next").src = next;
const favicon = require("./assets/favicon.png");
document.getElementById("favicon").href = favicon;
const people = require("./assets/people.png");
Array.from(document.getElementsByClassName("people")).forEach(element => {
    element.src = people
});

const canvas = document.getElementById("3d-graph");
const distance = 80;
let STEP = 0;
let DOT = 0;

let leftlight = document.getElementsByClassName("rectleftparent")[0]
let rightlight = document.getElementsByClassName("rectrightparent")[0]
document.body.addEventListener("mousemove", (e) => {
    let dx = -(e.clientX - window.innerWidth/2)/30;
    let dy = -(e.clientY - window.innerHeight/2)/30;
    leftlight.style.transform = "translate(" + dx + "px," + dy + "px)"
    rightlight.style.transform = "translate(" + dx + "px," + dy + "px)"
})

let tl = gsap.timeline()
tl.to(leftlight, { opacity: 1, duration: Math.random() * .2, delay: 2 })
.to(leftlight, { opacity: 0, duration: Math.random() * .2 })
.to(leftlight, { opacity: 1, duration: Math.random() * .2 })
.to(leftlight, { opacity: 0, duration: Math.random() * .2 })
.to(leftlight, { opacity: 1, duration: Math.random() * .2 })

tl = gsap.timeline()
tl.to(rightlight, { opacity: 0, duration: Math.random() * .2, delay: 2 })
.to(rightlight, { opacity: 1, duration: Math.random() * .2 })
.to(rightlight, { opacity: 0, duration: Math.random() * .2 })
.to(rightlight, { opacity: 1, duration: Math.random() * .2 })
.to(rightlight, { opacity: 0, duration: Math.random() * .2 })
.to(rightlight, { opacity: 1, duration: Math.random() * .2 })

let homeAnim = document.getElementsByClassName("home")[0].children
gsap.from(homeAnim, { translateY: -50, opacity: 0, duration: 1.5, stagger: { from: 'end', each: 0.2 }, ease: 'Power2.InOut' })

let Graph = ForceGraph3D()(canvas)
.graphData(data)
.nodeOpacity(0)
.nodeResolution(20)
.nodeAutoColorBy("group2020")
.linkWidth(.3)
.linkOpacity(0)
.backgroundColor("#0C0343")
.cameraPosition({ x: 0, y: 0, z: 0 })
.showNavInfo(false);

Graph.controls().noZoom = true

document.getElementById("start").addEventListener("click", _ => { start() });

const start = () => {
    document.getElementById("start").style.pointerEvents = "none"
    Graph.controls().noRotate = true
    gsap.to(Graph.camera().position, { x: 0, y: 0, z: 500, duration: 5, onComplete: _ => { Graph.controls().noRotate = false }});
    setTimeout(() => {
        sub(0)
    }, 2000);
    setTimeout(() => {
        if (STEP === 0) {
            sub(1)
        }
    }, 7000);

    let opNode = { value: 0 }
    gsap.to(opNode, { value: .8, duration: 5, onUpdate: _ => {
        Graph.nodeOpacity(opNode.value)
        .nodeLabel("id")
        .nodeColor(node => captions.group2020[node.group2020 - 1])
    }, onComplete: _ => {
        Graph.onNodeClick((node) => {
          const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
        
          Graph.cameraPosition(
            {
              x: node.x * distRatio,
              y: node.y * distRatio,
              z: node.z * distRatio,
            },
            node,
            2000
          )
          .linkWidth(.1);

          card(node)
        })
    } });

    let opLink = { value: 0 }
    gsap.to(opLink, { value: .2, duration: 5, onUpdate: _ => {
        Graph.linkOpacity(opLink.value)
    }, onComplete: _ => {
        document.getElementById("nextBtn").style.pointerEvents = "all";
        document.getElementById("nextBtn").style.opacity = 1;
        // let angle = 0;
        // setInterval(() => {
        //   Graph.cameraPosition({
        //     x: 500 * Math.sin(angle),
        //     z: 500 * Math.cos(angle)
        //   });
        //   angle += Math.PI / 500;
        // }, 10);
    }});

    gsap.to(homeAnim, { translateY: -50, opacity: 0, duration: 1.5, stagger: .2, ease: 'Power2.InOut', onComplete: _ => {
        document.getElementsByClassName("home")[0].style.opacity = 0;
        document.getElementsByClassName("home")[0].style.pointerEvents = "none";
        document.getElementsByClassName("content")[0].style.opacity = 1;
        document.getElementsByClassName("timeline")[0].style.pointerEvents = "all";
    }})

    let tl = document.getElementsByClassName("timeline")[0]
    gsap.from(tl, { translateY: 200, opacity: 0, duration: 1.5, delay: 1.5, ease: 'Power2.InOut' })

    let tlcontent = [document.getElementById("logo-content"), document.getElementById("h1-content")]
    gsap.from(tlcontent, { translateY: -200, opacity: 0, duration: 1.5, delay: 1.5, ease: 'Power2.InOut' })

    if (!isPlaying) playAmbient()
}

const title = document.getElementsByTagName("h1")[0]

// document.getElementsByClassName("tl-1")[0].addEventListener("click", _ => {
//     timeline(0)
//     title.innerHTML = "Année <span>2020</span>"
//     STEP = 0
//     progress()
// })

const timeline = (number) => {
    let points = Array.from(document.getElementsByClassName("tl"))
    let triggeredPoint = points[number]
    triggeredPoint.classList.add("triggered")
    triggeredPoint.classList.remove("default")
    points.splice(number, 1)
    points.forEach(point => {
        point.classList.remove("triggered")
        point.classList.add("default")
    })

    let texts = Array.from(document.getElementsByClassName("tl-text"))
    texts.forEach(text => {
        text.classList.remove("triggered")
        text.classList.add("default")
    })

    let timeline = document.getElementsByClassName("timeline")[0]
    timeline.style.transform = "translateX(-" + DOT*57 + "px)"

    if (number === 0 | number === 6 | number === 12) {
        number = number === 0 ? 1 : number === 6 ? 2 : 3
        let triggeredText = document.getElementsByClassName("tx-" + number)[0]
        triggeredText.classList.add("triggered")
        triggeredText.classList.remove("default")
    }
}

document.getElementById("nextBtn").addEventListener("click", _ => {
    STEP++;
    progress();
})

const progress = () => {
    const { nodes, links } = Graph.graphData();
    let newNodes = []
    let newLinks = []
    STEP < 8 ? sub(STEP + 1) : STEP === 8 ? null : sub(STEP)
    STEP < 14 ? caption(captionsOrder[STEP]) : caption("none")
    if (STEP < 4 || STEP > 16) {
        DOT--;
    }
    if (STEP < 6) {
        DOT++;
        timeline(STEP);
        nodes.forEach(node => { delete node.color; });
        for (let i = 0; i < data.nodes.length; i++) {
            newNodes.push(data.nodes[i])
        }
        for (let i = 0; i < data.links.length; i++) {
            newLinks.push(data.links[i])
        }
        if (STEP === 0) Graph.graphData({ nodes: [...newNodes], links: [...newLinks] }).nodeColor(node => captions.group2020[node.group2020 - 1][1]);
        else if (STEP === 1) Graph.graphData({ nodes: [...newNodes], links: [...newLinks] }).nodeColor(node => captions.gender[node.gender - 1][1]);
        else if (STEP === 2) Graph.graphData({ nodes: [...newNodes], links: [...newLinks] }).nodeColor(node => captions.spe[node.spe - 1][1]);
        else if (STEP === 3) Graph.graphData({ nodes: [...newNodes], links: [...newLinks] }).nodeColor(node => captions.situation[node.situation - 1][1]);
        else if (STEP === 4) Graph.graphData({ nodes: [...newNodes], links: [...newLinks] }).nodeColor(node => captions.origin[node.origin - 1][1]);
        else if (STEP === 5) Graph.graphData({ nodes: [...newNodes], links: [...newLinks] }).nodeColor(node => captions.location[node.location - 1][1]);
    } else if (STEP === 6) {
        nodes.forEach(node => { delete node.color; });
        for (let i = 0; i < data2021.nodes.length; i++) {
            newNodes.push(data2021.nodes[i])
        }
        Graph.graphData({ nodes: [...nodes, ...newNodes], links: [...links] }).nodeColor(node => captions.year[node.year - 1][1]);
    } else if (STEP === 7) {
        nodes.forEach(node => { delete node.color; });
        for (let i = 0; i < data2021.links.length; i++) {
            newLinks.push(data2021.links[i])
        }
        Graph.graphData({ nodes: [...nodes], links: [...newLinks] }).nodeColor(node => captions.year[node.year - 1][1]);
        setTimeout(() => {
            if (STEP === 7) {
                STEP++;
                progress()
            }
        }, 4000);
    } else if (STEP === 8) {
        nodes.forEach(node => { delete node.color; });
        if (nodes.length === 30) {
            for (let i = 0; i < data2021.nodes.length; i++) {
                newNodes.push(data2021.nodes[i])
            }
            for (let i = 0; i < data2021.links.length; i++) {
                newLinks.push(data2021.links[i])
            }
            Graph.graphData({ nodes: [...nodes, ...newNodes], links: [...links, ...newLinks] }).nodeColor(node => captions.group2021[node.group2021 - 1][1]);
        } else {
            Graph.graphData({ nodes: [...nodes], links: [...links] }).nodeColor(node => captions.group2021[node.group2021 - 1]);
        }
        title.innerHTML = "Année <span>2021</span>"
        DOT++;
        timeline(6)
    } else if (STEP >= 9 && STEP < 14) {
        DOT++;
        timeline(STEP-2)
        nodes.forEach(node => { delete node.color; });
        if (STEP === 9) Graph.graphData({ nodes: [...nodes], links: [...links] }).nodeColor(node => captions.gender[node.gender - 1][1]);
        else if (STEP === 10) Graph.graphData({ nodes: [...nodes], links: [...links] }).nodeColor(node => captions.spe[node.spe - 1][1]);
        else if (STEP === 11) Graph.graphData({ nodes: [...nodes], links: [...links] }).nodeColor(node => captions.situation[node.situation - 1][1]);
        else if (STEP === 12) Graph.graphData({ nodes: [...nodes], links: [...links] }).nodeColor(node => captions.origin[node.origin - 1][1]);
        else if (STEP === 13) Graph.graphData({ nodes: [...nodes], links: [...links] }).nodeColor(node => captions.location[node.location - 1][1]);
    } else if (STEP === 14) {
        nodes.forEach(node => { delete node.color; });
        Graph.graphData({ nodes: [...nodes], links: [...links] }).nodeAutoColorBy("group2021");
        title.innerHTML = "Bilan"
        DOT++;
        timeline(12)
    } else if (STEP === 15) {
        Graph.cameraPosition({ x: 0, y: 0, z: 500 }, { x: 1000, y: 0, z: 0 }, 2000)
        frames.forEach(frame => { frame.style.opacity = 0 })
        frames[0].style.opacity = 1
        Graph.enableNavigationControls(false)
        let counter = document.getElementById("counter1")
        gsap.from(counter, { innerHTML: Math.floor(0), duration: 2, onUpdate: _ => {
            counter.innerHTML = Math.floor(parseInt(counter.innerHTML))
        }})
        DOT++;
        timeline(13)
    } else if (STEP === 16) {
        frames.forEach(frame => { frame.style.opacity = 0 })
        frames[1].style.opacity = 1
        Graph.enableNavigationControls(false)
        let counter = document.getElementById("counter2")
        gsap.from(counter, { innerHTML: Math.floor(0), duration: 2, onUpdate: _ => {
            counter.innerHTML = Math.floor(parseInt(counter.innerHTML))
        }})
        DOT++;
        timeline(14)
    } else if (STEP === 17) {
        frames.forEach(frame => { frame.style.opacity = 0 })
        frames[2].style.opacity = 1
        Graph.enableNavigationControls(false)
        setProgress(document.querySelector('#circle1'), 38);
        setProgress(document.querySelector('#circle2'), 58);
        setProgress(document.querySelector('#circle3'), 4);
        DOT++;
        timeline(15)
    } else if (STEP === 18) {
        frames.forEach(frame => { frame.style.opacity = 0 })
        frames[3].style.opacity = 1
        let frame4anim = document.getElementById("frame4params").children
        gsap.from(frame4anim, { translateY: -50, opacity: 0, duration: 1.5, stagger: { from: 'end', each: .1 }, ease: 'Power2.InOut' })
        Graph.enableNavigationControls(false)
        DOT++;
        timeline(16)
    } else if (STEP === 19) {
        frames.forEach(frame => { frame.style.opacity = 0 })
        frames[4].style.opacity = 1
        document.getElementById("nextBtn").style.pointerEvents = "none";
        document.getElementById("nextBtn").style.opacity = 0;
        Graph.enableNavigationControls(false)
        let bars = Array.from(document.getElementsByClassName("bar"))
        let barsOffset = [{h: 172}, {h: 228}, {h: 164}, {h: 236}]
        for (let i = 0; i < bars.length; i++) {
            gsap.from(barsOffset[i], { h: 0, duration: 2, delay: .2 * i, onUpdate: _ => {
                bars[i].style.height = barsOffset[i].h + 'px'
            }})
        }
        let counters = Array.from(document.getElementsByClassName("bar-stat"))
        for (let i = 0; i < counters.length; i++) {
            gsap.from(counters[i], { innerHTML: Math.floor(0), duration: 2, onUpdate: _ => {
                counters[i].innerHTML = Math.floor(parseInt(counters[i].innerHTML)) + "%"
            }})
        }
        DOT++;
        timeline(17)
    }
}

const frames = [
    document.getElementsByClassName("frame-1")[0],
    document.getElementsByClassName("frame-2")[0],
    document.getElementsByClassName("frame-3")[0],
    document.getElementsByClassName("frame-4")[0],
    document.getElementsByClassName("frame-5")[0]
]

const captions = {
    gender: [
        ["Femme", "#4A87FF"],
        ["Homme", "#7058E5"],
        ["Non-genré", "#FFFFFF"]
    ],
    spe: [
        ["Designer", "#F5B350"],
        ["Développeur", "#4120E6"]
    ],
    situation: [
        ["En couple", "#FD9F99"],
        ["Célibataire", "#FEFFD2"],
        ["C'est compliqué", "#FC766D"]
    ],
    origin: [
        ["Paris intra-muros", "#ED6872"],
        ["Banlieue", "#EDC068"],
        ["Province", "#FAA7A4"],
        ["Autre pays", "#FEFFD2"]
    ],
    location: [
        ["Paris intra-muros", "#244B79"],
        ["Banlieue", "#A7C4D7"],
    ],
    year: [
        ["Anciens", "#4A87FF"],
        ["Nouveaux", "#4120E6"],
    ],
    group2020: ["#ED6872", "#244B79", "#FAA7A4", "#FEFFD2"],
    group2021: ["#ED6872", "#244B79", "#FAA7A4", "#FEFFD2"]
}

const captionsOrder = ["none", captions.gender, captions.spe, captions.situation, captions.origin, captions.location, "none", "none", "none", captions.gender, captions.spe, captions.situation, captions.origin, captions.location]

const caption = (theme) => {
    let captionDOM = document.getElementsByClassName("caption")[0]
    if (theme === "none") {
        captionDOM.style.opacity = 0;
    } else {
        captionDOM.style.opacity = 1;
        let child = captionDOM.lastElementChild; 
        while (child) {
            captionDOM.removeChild(child);
            child = captionDOM.lastElementChild;
        }
        theme.forEach(el => {
            let attribute = document.createElement('div')
            let attrColor = document.createElement('div')
            let attrText = document.createElement('p')
            attribute.classList.add("attribute")
            attrColor.style.backgroundColor = el[1]
            attrText.innerHTML = el[0]
            attribute.append(attrColor, attrText)
            captionDOM.appendChild(attribute)
        })
    }
}

let cardImgs = [
    require("./assets/situation.png"),
    require("./assets/spe.png"),
    require("./assets/location.png"),
    require("./assets/origin.png"),
    require("./assets/year.png")
]

const card = (node) => {
    let cardDOM = document.getElementsByClassName("card")[0]
    if (node === "none") {
        cardDOM.style.opacity = 0;
        Graph.cameraPosition({ x: 0, y: 0, z: 500, }, { x: 0, y: 0, z: 0 }, 2000).linkWidth(.3);
        setTimeout(() => {
            Graph.enableNavigationControls(true)
        }, 2000);
    } else {
        cardDOM.style.opacity = 1;
        let child = Array.from(cardDOM.children);
        for (let i = 0; i < child.length; i++) {
            if (child[i].id !== "cardClose") {
                cardDOM.removeChild(child[i]);
            }
        }
        let attributes = []
        const { id, gender, situation, spe, location, origin, year } = node;
        attributes.push(
            gender === 1 ? id + " (♂)" : gender === 2 ? id + " (♀)" : id + " (⚥/⚲)",
            situation === 1 ? "Célibataire" : situation === 2 ? "En couple" : "C'est compliqué",
            spe === 1 ? "Designer" : "Développeur",
            origin === 1 ? "Paris intra-muros" : origin === 2 ? "Banlieue" : origin === 3 ? "Province" : "Autre pays",
            location === 1 ? "Paris intra-muros" : "Banlieue",
            year === 1 ? "Arrivé en 2019 ou 2020" : "Arrivé en 2021",
        )
        for (let i = 0; i < attributes.length; i++) {
            let nodeDiv = document.createElement('div')
            if (i > 0) {
                let nodeImg = document.createElement('img')
                nodeImg.src = cardImgs[i - 1]
                nodeDiv.append(nodeImg)
            }
            let nodeText = document.createElement('p')
            nodeText.innerHTML = attributes[i]
            nodeDiv.append(nodeText)
            cardDOM.append(nodeDiv)
        }
    }
}

document.getElementById("cardClose").addEventListener("click", _ => { card("none") })

const setProgress = (circle, percent) => {
    let radius = circle.r.baseVal.value;
    let circumference = radius * 2 * Math.PI;

    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = `${circumference}`;

    const offset =  circumference + percent / 100 * circumference;
    circle.style.strokeDashoffset = offset;
}

const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['Autre pays', 'Paris intra-muros', 'Banlieue', 'Province'],
        datasets: [{
            label: '# of Votes',
            data: [4, 18, 24, 53],
            backgroundColor: [
                '#2D99FF',
                '#1463FF',
                '#0B4FD2',
                '#3C23BC'
            ],
            borderWidth: 0
        }]
    },
    options: {
        plugins: {
            legend: {
                display: false,
            },
            tooltips: {
                    enabled: false
            }
        }
    } 
});

// const loader = new GLTFLoader();

// loader.load(GirlGLTF, function ( gltf ) {
//     gltf.scene.position.set(0, 0, 100)
//     gltf.scene.scale.set(15, 15, 15)
//     console.log(gltf.scene);
// 		Graph.scene().add(gltf.scene);
// 		gltf.animations; // Array<THREE.AnimationClip>
// 		gltf.scene; // THREE.Group
// 		gltf.scenes; // Array<THREE.Group>
// 		gltf.cameras; // Array<THREE.Camera>
// 		gltf.asset; // Object
// 	}, ( xhr ) => {
// 		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
// 	}, ( error ) => {
// 		console.log( 'An error happened :', error );
// 	}
// );



// Sound management

const ambient = require("./assets/ambient.mp3")

let sound = new Howl({
    src: [ambient],
    loop: true,
    volume: .2
});
let isPlaying = false;

document.getElementById("speakerBtn").addEventListener("click", _ => {
    playAmbient()
})

const playAmbient = () => {
    if (isPlaying) {
        sound.fade(.2, 0, 500)
        document.getElementById("speaker").src = speakeroff;
        isPlaying = false
        setTimeout(() => {
            if (!isPlaying) {
                sound.mute(true)
            }
        }, 500);
    } else {
        sound.play()
        sound.mute(false)
        isPlaying = true
        sound.fade(0, .2, 500)
        document.getElementById("speaker").src = speakeron;
    }
}

const subAudios = []
for (let i = 1; i < 21; i++) {
    subAudios.push(require("./assets/sounds/Bartho_" + i + ".mp3"))
}

const subtitles = [
    "C’est l’histoire de 25 personnes qui forment la promo 2020 des BDDI.",
    "Les groupes d’amis les plus proches sont représentés par différentes couleurs.",
    "Mais quelle est la proportion de filles, de garçons et non-genrés en BDDI ?",
    "Et combien avons-nous de designers et de développeurs ?",
    "Quelle est leur situation amoureuse ?",
    "D’où viennent-ils ?",
    "Et où habitent-ils aujourd’hui ?",
    "Passons maintenant à 2021 avec l’arrivée des nouveaux développeurs.",
    "En 2021, 19 nouvelles personnes se sont liées d’amitié avec la promo 2020...",
    "...et se sont intégrées aux groupes d’amis proches déjà formés.",
    "En 2021, quelle est la nouvelle proportion de filles, de garçons et de non-genrés en BDDI ?",
    "Et combien avons-nous de designers et de développeurs ?",
    "Quelle est leur situation amoureuse ?",
    "D’où viennent-ils ?",
    "Et où habitent-ils aujourd’hui ?",
    "C’est ce dont nous allons vous parler aujourd’hui.",
    "De 2020 à 2021, il y a eu beaucoup de changements en BDDI.",
    "Tout d’abord, au niveau de la mixité...",
    "...avec des situations amoureuses en tout genre...",
    "...venant d’horizons diffférents...",
    "...et habitant un peu partout en Île-de-France."
]

let subHowls = []

for (let i = 0; i < subAudios.length; i++) {
    let tempHowl = new Howl({
        src: [subAudios[i]],
        volume: 1
    })
    subHowls.push(tempHowl)
}

let subtitleDOM = document.getElementsByClassName("subtitles")[0]

const sub = (number) => {
    Object.keys(subHowls).forEach(function(key) {
        subHowls[key].stop();
    });
    if (number < 20) {
        isPlaying && subHowls[number].play()
        if (number === 8) {
            subtitleDOM.innerHTML = subtitles[number]
            setTimeout(() => {
                if (number === 8) {
                    subtitleDOM.innerHTML = subtitles[number + 1]
                }
            }, 4000);
        } else if (number > 8) {
            subtitleDOM.innerHTML = subtitles[number + 1]
        } else {
            isPlaying && subHowls[number].play()
            subtitleDOM.innerHTML = subtitles[number]
        }
    }
}