import React, { useEffect, useRef } from "react";
import * as BABYLON from "babylonjs";

const Cuboid3D = ({ capturedImage }) => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const boxRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      if (!sceneRef.current) {
        const engine = new BABYLON.Engine(canvas, true);
        const scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
        sceneRef.current = scene;

        const camera = new BABYLON.ArcRotateCamera(
          "camera",
          Math.PI / 2,
          Math.PI / 3,
          7,
          new BABYLON.Vector3(0, 0, 0),
          scene
        );
        camera.attachControl(canvas, true);
        camera.lowerRadiusLimit = 2;
        camera.upperRadiusLimit = 10;

        const light = new BABYLON.HemisphericLight(
          "light",
          new BABYLON.Vector3(0, 1, 0),
          scene
        );

        const box = BABYLON.MeshBuilder.CreateBox("box", { size: 2 }, scene);
        box.position.y = 1;
        boxRef.current = box;

        engine.runRenderLoop(() => {
          scene.render();
        });

        engineRef.current = engine;

        window.addEventListener("resize", () => {
          engine.resize();
        });
      }
    }
  }, []);

  useEffect(() => {
    if (boxRef.current && capturedImage) {
      const boxMaterial = new BABYLON.StandardMaterial(
        "boxMaterial",
        sceneRef.current
      );
      boxMaterial.diffuseTexture = new BABYLON.Texture(
        capturedImage,
        sceneRef.current
      );
      boxRef.current.material = boxMaterial;
    }
  }, [capturedImage]);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
};

export default Cuboid3D;
