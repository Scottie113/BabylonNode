const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

let box;
let boxMaterial;

const createScene = async () => {
  const scene = new BABYLON.Scene(engine);

  const camera = new BABYLON.ArcRotateCamera(
    "camera",
    Math.PI / 2,
    Math.PI / 3,
    10,
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  camera.attachControl(canvas, true);

  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );

  const ground = BABYLON.MeshBuilder.CreateGround(
    "ground",
    { width: 12, height: 12 },
    scene
  );

  // Fetch initial backend data
  const sceneData = await fetchSceneData();

  // Create material
  boxMaterial = new BABYLON.StandardMaterial("boxMaterial", scene);
  boxMaterial.diffuseColor = new BABYLON.Color3(
    sceneData.color.r,
    sceneData.color.g,
    sceneData.color.b
  );

  // Create box using backend data
  box = BABYLON.MeshBuilder.CreateBox(
    "box",
    {
      width: sceneData.width,
      height: sceneData.height,
      depth: sceneData.depth
    },
    scene
  );

  box.position = new BABYLON.Vector3(
    sceneData.x,
    sceneData.y,
    sceneData.z
  );

  box.material = boxMaterial;

  wireButtonsToBackend();

  return scene;
};

async function fetchSceneData() {
  const response = await fetch("/api/scene-data");
  if (!response.ok) {
    throw new Error("Failed to load scene data from backend");
  }
  return response.json();
}

async function refreshBoxFromBackend() {
  const sceneData = await fetchSceneData();

  box.position.x = sceneData.x;
  box.position.y = sceneData.y;
  box.position.z = sceneData.z;

  boxMaterial.diffuseColor = new BABYLON.Color3(
    sceneData.color.r,
    sceneData.color.g,
    sceneData.color.b
  );
}

function wireButtonsToBackend() {
  document.getElementById("moveBtn").addEventListener("click", async () => {
    const randomX = Math.floor(Math.random() * 7) - 3;
    const randomZ = Math.floor(Math.random() * 7) - 3;

    await fetch("/api/move-box", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        x: randomX,
        y: 1,
        z: randomZ
      })
    });

    await refreshBoxFromBackend();
  });

  document.getElementById("colorBtn").addEventListener("click", async () => {
    await fetch("/api/change-color", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        r: Math.random(),
        g: Math.random(),
        b: Math.random()
      })
    });

    await refreshBoxFromBackend();
  });
}

createScene().then((scene) => {
  engine.runRenderLoop(() => {
    scene.render();
  });
});

window.addEventListener("resize", () => {
  engine.resize();
});