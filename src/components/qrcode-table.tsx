"use client";

import { getTableLink } from "@/lib/utils";
import QRCode from "qrcode";
import { useEffect, useRef } from "react";

export default function QRCodeTable({
  token,
  tableNumber,
  width = 250,
}: {
  token: string;
  tableNumber: number;
  width?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;
    canvas.height = width + 70;
    canvas.width = width;
    const canvasContext = canvas.getContext("2d")!;
    canvasContext.fillStyle = "#fff";
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    canvasContext.font = "20px Arial";
    canvasContext.textAlign = "center";
    canvasContext.fillStyle = "#000";
    canvasContext.fillText(
      `Bàn số ${tableNumber}`,
      canvas.width / 2,
      canvas.height - 50
    );
    canvasContext.fillText(
      `Quét mã QR để gọi món`,
      canvas.width / 2,
      canvas.height - 20
    );

    const virtalCanvas = document.createElement("canvas");
    QRCode.toCanvas(
      virtalCanvas,
      getTableLink({
        token,
        tableNumber,
      }),
      function (error) {
        if (error) console.error(error);
        canvasContext.drawImage(virtalCanvas, 0, 0, width, width);
      }
    );
  }, [token, tableNumber, width]);
  return <canvas ref={canvasRef} />;
}
