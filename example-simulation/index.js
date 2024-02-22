const canvas = document.getElementById('canvas')

const width = canvas.width
const height = canvas.height

// Colors
const black = new THREE.Color('black')
const white = new THREE.Color('white')

function loadFile (filename) {
  return new Promise((resolve, reject) => {
    const loader = new THREE.FileLoader()

    loader.load(filename, data => {
      resolve(data)
    })
  })
}

// Shader chunks
loadFile('shaders/utils.glsl').then(utils => {
  THREE.ShaderChunk['utils'] = utils

  // Create Renderer
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.01, 1000)
  camera.position.set(0.426, 0.677, -2.095)
  camera.rotation.set(2.828, 0.191, 3.108)

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
  })
  renderer.setSize(width, height)
  renderer.autoClear = false

  // Light direction
  const light = [0.7559289460184544, 0.7559289460184544, -0.3779644730092272]

  // Create mouse Controls
  const controls = new THREE.OrbitControls(camera, canvas)

  // console.log(controls)

  // controls.screen.width = width
  // controls.screen.height = height

  controls.rotateSpeed = 2.5
  controls.zoomSpeed = 1.2
  controls.panSpeed = 0.9
  controls.dynamicDampingFactor = 0.9

  // Ray caster
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()

  var scene = new THREE.Scene()

  var loader = new THREE.GLTFLoader()
  loader.load('wtp1.glb', handle_load)

  var mesh
  var target = new THREE.Vector3()

  function handle_load (gltf) {
    console.log(gltf.scene)
    mesh = gltf.scene.children[0]
    mesh.traverse(function (node) {
      if (node.material) {
        node.material.opacity = 0.5
        node.material.transparent = true
      }
    })

    scene.add(mesh)

    // const geometry = new THREE.PlaneGeometry( 200, 200 );
    // geometry.rotateY(3.14)
    // const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    // const plane = new THREE.Mesh( geometry, material );
    // scene.add( plane );

    function animate () {
      renderer.clear()
      renderer.render(scene, camera)
      controls.update()

      window.requestAnimationFrame(animate)
    }
    animate()
  }
})
