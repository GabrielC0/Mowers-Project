import React, { useState } from "react";
import Mower from "./Assets/Icons/Mower.png";

function AlgoMowers() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [instructions, setInstructions] = useState("");
  const [gardenSize, setGardenSize] = useState({ x: 0, y: 0 });
  const [mower1Position, setMower1Position] = useState({ x: 0, y: 0 });
  const [mower1Orientation, setMower1Orientation] = useState("N");
  const [mower2Position, setMower2Position] = useState({ x: 0, y: 0 });
  const [mower2Orientation, setMower2Orientation] = useState("N");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      const content = reader.result;
      setFileContent(content);

      const lines = content.trim().split("\n");
      setInstructions(lines[2].trim());

      const [sizeX, sizeY] = lines[0].trim().split(" ");
      setGardenSize({ x: parseInt(sizeX, 10), y: parseInt(sizeY, 10) });

      const [x1, y1, orientation1] = lines[1].trim().split(" ");
      setMower1Position({ x: parseInt(x1, 10), y: parseInt(y1, 10) });
      setMower1Orientation(orientation1);

      const [x2, y2, orientation2] = lines[3].trim().split(" ");
      setMower2Position({ x: parseInt(x2, 10), y: parseInt(y2, 10) });
      setMower2Orientation(orientation2);
    };
    reader.readAsText(file);
  };

  const orientationChanges = {
    N: { L: "W", R: "E" },
    E: { L: "N", R: "S" },
    S: { L: "E", R: "W" },
    W: { L: "S", R: "N" },
  };

  const handleMower1Instructions = () => {
    let newX1 = mower1Position.x;
    let newY1 = mower1Position.y;
    let newOrientation1 = mower1Orientation;

    for (let i = 0; i < instructions.length; i++) {
      const instruction = instructions[i];

      if (instruction === "R" || instruction === "L") {
        newOrientation1 = orientationChanges[newOrientation1][instruction];
      } else if (instruction === "F") {
        let tempX = newX1;
        let tempY = newY1;

        switch (newOrientation1) {
          case "N":
            tempY = Math.ceil(Math.min(newY1 + 1, gardenSize.y - 1));
            break;
          case "E":
            tempX = Math.ceil(Math.min(newX1 + 1, gardenSize.x - 1));
            break;
          case "S":
            tempY = Math.floor(Math.max(newY1 - 1, 0));
            break;
          case "W":
            tempX = Math.floor(Math.max(newX1 - 1, 0));
            break;
          default:
            break;
        }

        const newPositionValid =
          tempX >= 0 &&
          tempX < gardenSize.x &&
          tempY >= 0 &&
          tempY < gardenSize.y;

        if (newPositionValid) {
          newX1 = tempX;
          newY1 = tempY;
        }
      }
    }

    setMower1Position({ x: newX1, y: newY1 });
    setMower1Orientation(newOrientation1);

    setTimeout(handleMower2Instructions, 2000);
  };

  const handleMower2Instructions = () => {
    let newX2 = mower2Position.x;
    let newY2 = mower2Position.y;
    let newOrientation2 = mower2Orientation;

    for (let i = 0; i < instructions.length; i++) {
      const instruction = instructions[i];

      if (instruction === "R" || instruction === "L") {
        newOrientation2 = orientationChanges[newOrientation2][instruction];
      } else if (instruction === "F") {
        let tempX = newX2;
        let tempY = newY2;

        switch (newOrientation2) {
          case "N":
            tempY = Math.ceil(Math.min(newY2 + 1, gardenSize.y - 1));
            break;
          case "E":
            tempX = Math.ceil(Math.min(newX2 + 1, gardenSize.x - 1));
            break;
          case "S":
            tempY = Math.floor(Math.max(newY2 - 1, 0));
            break;
          case "W":
            tempX = Math.floor(Math.max(newX2 - 1, 0));
            break;
          default:
            break;
        }

        const newPositionValid =
          tempX >= 0 &&
          tempX < gardenSize.x &&
          tempY >= 0 &&
          tempY < gardenSize.y;

        if (newPositionValid) {
          newX2 = tempX;
          newY2 = tempY;
        }
      }
    }

    setMower2Position({ x: newX2, y: newY2 });
    setMower2Orientation(newOrientation2);
  };

  const handleGoButtonClick = () => {
    handleMower1Instructions();
  };

  const orientationAngle1 =
    mower1Orientation === "N"
      ? 0
      : mower1Orientation === "E"
      ? 90
      : mower1Orientation === "S"
      ? 180
      : 270;

  const orientationAngle2 =
    mower2Orientation === "N"
      ? 0
      : mower2Orientation === "E"
      ? 90
      : mower2Orientation === "S"
      ? 180
      : 270;

  return (
    <div>
      <h2>AlgoMowers</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleGoButtonClick}>GO</button>
      {fileContent && (
        <div>
          <h3>Contenu du fichier :</h3>
          <pre>{fileContent}</pre>
          <div
            id="Jardin"
            style={{
              width: `${gardenSize.x * 100}px`,
              height: `${gardenSize.y * 100}px`,
              border: "1px solid black",
              position: "relative",
              backgroundColor: "green",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: `${(mower1Position.y * 100) / gardenSize.y}%`,
                left: `${(mower1Position.x * 100) / gardenSize.x}%`,
                transform: `rotate(${orientationAngle1}deg)`,
                transformOrigin: "bottom",
                zIndex: 1,
              }}
            >
              <img
                id="MowerImage1"
                className="Mower"
                src={Mower}
                alt="Mower"
                style={{ width: "100px", height: "100px" }}
              />
            </div>

            <div
              style={{
                position: "absolute",
                bottom: `${(mower2Position.y * 100) / gardenSize.y}%`,
                left: `${(mower2Position.x * 100) / gardenSize.x}%`,
                transform: `rotate(${orientationAngle2}deg)`,
                transformOrigin: "bottom",
                zIndex: 1,
              }}
            >
              <img
                id="MowerImage2"
                className="Mower"
                src={Mower}
                alt="Mower"
                style={{ width: "100px", height: "100px" }}
              />
            </div>
          </div>
          <p>
            Position [{" "}
            {mower1Position.x +
              ";" +
              mower1Position.y +
              ";" +
              mower1Orientation}{" "}
            ]
          </p>
          <p>
            Position [{" "}
            {mower2Position.x +
              ";" +
              mower2Position.y +
              ";" +
              mower2Orientation}{" "}
            ]
          </p>
        </div>
      )}
    </div>
  );
}

export default AlgoMowers;
