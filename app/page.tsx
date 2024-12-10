"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [inputValue, setInputValue] = useState<string>(""); // User input
  const canvasRef = useRef<HTMLCanvasElement>(null); // Reference to the canvas

  const handleGenerate = async (): Promise<void> => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Set canvas dimensions
    const digitWidth = 100; // Width of each digit image
    const digitHeight = 100; // Height of each digit image
    const totalWidth = digitWidth * inputValue.length; // Total canvas width
    canvas.width = totalWidth;
    canvas.height = digitHeight;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Load images for each digit and draw them on the canvas
    for (let i = 0; i < inputValue.length; i++) {
      const digit = inputValue[i];

      if (isNaN(Number(digit))) continue; // Skip non-numeric characters

      const img = new Image();
      img.src = `/images/${digit}.png`; // Path to the image
      await new Promise<void>((resolve) => {
        img.onload = () => {
          ctx.drawImage(img, i * digitWidth, 0, digitWidth, digitHeight); // Draw each image side by side
          resolve();
        };
      });
    }
  };

  const handleDownload = (): void => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const image = canvas.toDataURL("image/png");

    // Create a temporary link to download the image
    const link = document.createElement("a");
    link.href = image;
    link.download = "number-image.png";
    link.click();
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
     <div style={{ textAlign: "center", padding: "30px" }}>

    
      <h1>Number to Image Generator</h1>
      <h2> Developed by helloasir</h2>
      </div>
      <input
        type="text"
        placeholder="Enter numbers"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        style={{
          padding: "10px",
          fontSize: "16px",
          width: "200px",
          marginBottom: "10px",
        }}
      />
      <br />
      <button
        onClick={handleGenerate}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          cursor: "pointer",
          marginRight: "10px",
        }}
      >
        Generate Image
      </button>
      <button
        onClick={handleDownload}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Download Image
      </button>

      <div style={{ marginTop: "20px" }}>
        <canvas ref={canvasRef} style={{ border: "1px solid #ccc" }}></canvas>
      </div>
    </div>
  );
}
