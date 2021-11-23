require('./styles/index.scss');
const data = require("./assets/bddi2020.json")
const data2021 = require("./assets/bddi2021.json")
const GirlGLTF = require("./assets/Girl3.glb")

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import ForceGraph3D from '3d-force-graph';

const elem = document.getElementById("3d-graph");
const distance = 80;
let STEP = 0;

let Graph = ForceGraph3D()(elem)
  .graphData(data)
  .nodeLabel("id")
  .nodeOpacity(0.8)
  .nodeResolution(20)
  .nodeAutoColorBy("group2020")
  .linkWidth(.3)
  .backgroundColor("#0C0343")
  .onNodeClick((node) => {
    const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

    Graph.cameraPosition(
      {
        x: node.x * distRatio,
        y: node.y * distRatio,
        z: node.z * distRatio,
      },
      node,
      2000
    );
  });

const title = document.getElementsByTagName("h1")[0]

document.getElementsByClassName("tl-1")[0].addEventListener("click", _ => {
    timeline(0)
    title.innerHTML = "Année <span>2020</span>"
    STEP = 0
    progress()
})
document.getElementsByClassName("tl-1")[1].addEventListener("click", _ => {
    timeline(0)
    title.innerHTML = "Année <span>2020</span>"
    STEP = 0
    progress()
})
document.getElementsByClassName("tl-2")[0].addEventListener("click", _ => {
    timeline(1)
    title.innerHTML = "Année <span>2021</span>"
    STEP = 8
    progress()
})
document.getElementsByClassName("tl-2")[1].addEventListener("click", _ => {
    timeline(1)
    title.innerHTML = "Année <span>2021</span>"
    STEP = 8
    progress()
})
document.getElementsByClassName("tl-3")[0].addEventListener("click", _ => {
    timeline(2)
    title.innerHTML = "Bilan"
    STEP = 14
    progress()
})
document.getElementsByClassName("tl-3")[1].addEventListener("click", _ => {
    timeline(2)
    title.innerHTML = "Bilan"
    STEP = 14
    progress()
})

const timeline = (number) => {
    let points = Array.from(document.getElementsByClassName("tl"))
    let triggeredPoint = points[number]
    triggeredPoint.classList.add("tl-triggered")
    triggeredPoint.classList.remove("tl-default")
    points.splice(number, 1)
    points.forEach(point => {
        point.classList.remove("tl-triggered")
        point.classList.add("tl-default")
    })
    let texts = Array.from(document.getElementsByClassName("tl-text"))
    let triggeredText = texts[number]
    triggeredText.classList.add("tl-text-triggered")
    triggeredText.classList.remove("tl-text-default")
    texts.splice(number, 1)
    texts.forEach(text => {
        text.classList.remove("tl-text-triggered")
        text.classList.add("tl-text-default")
    })
}

document.getElementById("next").addEventListener("click", _ => {
    STEP++;
    progress();
})

const progress = () => {
    if (STEP === 0) {
        const { nodes, links } = Graph.graphData();
        nodes.forEach(node => { delete node.color; });
        let newNodes = []
        for (let i = 0; i < data.nodes.length; i++) {
            newNodes.push(data.nodes[i])
        }
        let newLinks = []
        for (let i = 0; i < data.links.length; i++) {
            newLinks.push(data.links[i])
        }
        Graph.graphData({ nodes: [...newNodes], links: [...newLinks] }).nodeAutoColorBy("group2020");
    } else if (STEP === 1) {
        const { nodes, links } = Graph.graphData();
        nodes.forEach(node => { delete node.color; });
        Graph.graphData({ nodes: [...nodes], links: [...links] }).nodeAutoColorBy("gender");
    } else if (STEP === 2) {
        const { nodes, links } = Graph.graphData();
        nodes.forEach(node => { delete node.color; });
        Graph.graphData({ nodes: [...nodes], links: [...links] }).nodeAutoColorBy("spe");
    } else if (STEP === 3) {
        const { nodes, links } = Graph.graphData();
        nodes.forEach(node => { delete node.color; });
        Graph.graphData({ nodes: [...nodes], links: [...links] }).nodeAutoColorBy("situation");
    } else if (STEP === 4) {
        const { nodes, links } = Graph.graphData();
        nodes.forEach(node => { delete node.color; });
        Graph.graphData({ nodes: [...nodes], links: [...links] }).nodeAutoColorBy("origin");
    } else if (STEP === 5) {
        const { nodes, links } = Graph.graphData();
        nodes.forEach(node => { delete node.color; });
        Graph.graphData({ nodes: [...nodes], links: [...links] }).nodeAutoColorBy("location");
    } else if (STEP === 6) {
        const { nodes, links } = Graph.graphData();
        let newNodes = []
        nodes.forEach(node => { delete node.color; });
        for (let i = 0; i < data2021.nodes.length; i++) {
            newNodes.push(data2021.nodes[i])
        }
        Graph.graphData({ nodes: [...nodes, ...newNodes], links: [...links] }).nodeAutoColorBy("year");
    } else if (STEP === 7) {
        const { nodes } = Graph.graphData();
        let newLinks = []
        for (let i = 0; i < data2021.links.length; i++) {
            newLinks.push(data2021.links[i])
        }
        Graph.graphData({ nodes: [...nodes], links: [...newLinks] });
    } else if (STEP === 8) {
        const { nodes, links } = Graph.graphData();
        nodes.forEach(node => { delete node.color; });
        if (nodes.length === 30) {
            let newNodes = []
            for (let i = 0; i < data2021.nodes.length; i++) {
                newNodes.push(data2021.nodes[i])
            }
            let newLinks = []
            for (let i = 0; i < data2021.links.length; i++) {
                newLinks.push(data2021.links[i])
            }
            Graph.graphData({ nodes: [...nodes, ...newNodes], links: [...links, ...newLinks] }).nodeAutoColorBy("group2021");
        } else {
            Graph.graphData({ nodes: [...nodes], links: [...links] }).nodeAutoColorBy("group2021");
        }
        timeline(1)
    } else if (STEP === 9) {
        const { nodes, links } = Graph.graphData();
        nodes.forEach(node => { delete node.color; });
        Graph.graphData({ nodes: [...nodes], links: [...links] }).nodeAutoColorBy("gender");
    } else if (STEP === 10) {
        const { nodes, links } = Graph.graphData();
        nodes.forEach(node => { delete node.color; });
        Graph.graphData({ nodes: [...nodes], links: [...links] }).nodeAutoColorBy("spe");
    } else if (STEP === 11) {
        const { nodes, links } = Graph.graphData();
        nodes.forEach(node => { delete node.color; });
        Graph.graphData({ nodes: [...nodes], links: [...links] }).nodeAutoColorBy("situation");
    } else if (STEP === 12) {
        const { nodes, links } = Graph.graphData();
        nodes.forEach(node => { delete node.color; });
        Graph.graphData({ nodes: [...nodes], links: [...links] }).nodeAutoColorBy("origin");
    } else if (STEP === 13) {
        const { nodes, links } = Graph.graphData();
        nodes.forEach(node => { delete node.color; });
        Graph.graphData({ nodes: [...nodes], links: [...links] }).nodeAutoColorBy("location");
    } else if (STEP === 14) {
        const { nodes, links } = Graph.graphData();
        nodes.forEach(node => { delete node.color; });
        Graph.graphData({ nodes: [...nodes], links: [...links] }).nodeAutoColorBy("group2021");
        timeline(2)
    }
}

const loader = new GLTFLoader();

loader.load(GirlGLTF, function ( gltf ) {
    gltf.scene.position.set(0, 0, 100)
    gltf.scene.scale.set(15, 15, 15)
		Graph.scene().add(gltf.scene);
		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object
	}, ( xhr ) => {
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	}, ( error ) => {
		console.log( 'An error happened :', error );
	}
);