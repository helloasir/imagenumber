"use client";

import { useState, useRef } from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TelegramShareButton,
} from "react-share";
import {
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  TelegramIcon,
} from "react-share";

export default function Home() {
  const [inputValue, setInputValue] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [colorMode, setColorMode] = useState<string>("single");

  const getRandomColor = (): string => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const handleGenerate = async (): Promise<void> => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const digitWidth = 100;
    const digitHeight = 100;
    const totalWidth = digitWidth * inputValue.length;

    canvas.width = totalWidth;
    canvas.height = digitHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < inputValue.length; i++) {
      const digit = inputValue[i];

      if (isNaN(Number(digit))) continue;

      let color: string | CanvasGradient | null = null; // default to null

      switch (colorMode) {
        case "single":
          color = "#3498db"; // Example single color
          break;
        case "multi":
          color = getRandomColor();
          break;
        case "gradient":
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
          gradient.addColorStop(0, getRandomColor());
          gradient.addColorStop(1, getRandomColor());
          color = gradient;
          break;
        case "none":
          color = null; // No color, use predefined image
          break;
        default:
          color = "#000";
      }

      if (color) {
        // Draw shape with color
        ctx.fillStyle = color;
        const centerX = i * digitWidth + digitWidth / 2;
        const centerY = digitHeight / 2;
        const radius = digitHeight / 2;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
        ctx.fill();

        // Draw the digit
        ctx.fillStyle = '#ffffff';
        ctx.font = '50px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(digit, centerX, centerY);
      } else {
        // Use predefined image
        const img = new Image();
        img.src = `/images/${digit}.png`;
        await new Promise<void>((resolve) => {
          img.onload = () => {
            ctx.drawImage(img, i * digitWidth, 0, digitWidth, digitHeight);
            resolve();
          };
        });
      }
    }

    const url = canvas.toDataURL("image/png");
    setImageUrl(url);
  };

  const handleDownload = (): void => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = image;
    link.download = `${inputValue || "number-image"}.png`;

    link.click();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        // height: "812px", // iPhone X height
        // maxWidth: "375px", // iPhone X width
        margin: "0 auto",
        // border: "1px solid #ccc",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Header */}
      <header
        style={{
          width: "100%",
          padding: "15px",
          backgroundColor: "#0070f3",
          color: "white",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "18px",
        }}
      >
        Image Generator App
      </header>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "10px", // Reduced padding
        }}
      >
        <h1
          style={{
            fontSize: "18px",
            marginBottom: "10px",
            marginTop: "0px", // Removed top margin to reduce spacing
          }}
        >
          Number to Single Image Generator
        </h1>
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
        <div style={{ marginBottom: "10px" }}>
          <label>
            <input
              type="radio"
              value="single"
              checked={colorMode === "single"}
              onChange={() => setColorMode("single")}
            />
            Single Color
          </label>
          <label style={{ marginLeft: "10px" }}>
            <input
              type="radio"
              value="multi"
              checked={colorMode === "multi"}
              onChange={() => setColorMode("multi")}
            />
            Multi Color
          </label>
          {/* <label style={{ marginLeft: "10px" }}>
            <input
              type="radio"
              value="gradient"
              checked={colorMode === "gradient"}
              onChange={() => setColorMode("gradient")}
            />
            Gradient
          </label> */}
          <label style={{ marginLeft: "10px" }}>
            <input
              type="radio"
              value="none"
              checked={colorMode === "none"}
              onChange={() => setColorMode("none")}
            />
            Without Color
          </label>
        </div>
        <button
          onClick={handleGenerate}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            cursor: "pointer",
            marginBottom: "10px",
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

        {imageUrl && (
          <div style={{ marginTop: "20px" }}>
            <h3>Share this image:</h3>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              <FacebookShareButton
                url={imageUrl}
                title="Check out this cool generated image!"
              >
                <FacebookIcon size={40} round />
              </FacebookShareButton>
              <TwitterShareButton
                url={imageUrl}
                title="Check out this cool generated image!"
              >
                <TwitterIcon size={40} round />
              </TwitterShareButton>
              <WhatsappShareButton
                url={imageUrl}
                title="Check out this cool generated image!"
              >
                <WhatsappIcon size={40} round />
              </WhatsappShareButton>
              <TelegramShareButton
                url={imageUrl}
                title="Check out this cool generated image!"
              >
                <TelegramIcon size={40} round />
              </TelegramShareButton>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#f8f8f8",
          textAlign: "center",
          borderTop: "1px solid #ddd",
          fontSize: "14px",
        }}
      >
        © 2024 Image Generator App
      </footer>
    </div>
  );
}
