import Stats from 'stats.js';

function createStats(){
    let stats = new Stats();
    stats.setMode(0);

    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left='0';
    stats.domElement.style.right = '0';

    return stats
}

export {createStats};