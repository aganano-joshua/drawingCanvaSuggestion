import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

const CanvasComponent = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: true,
    });

    canvas.on('path:created', (event) => {
      const path = event.path;
      const strokeData = path.getPoints().map(point => [point.x, point.y]);
      sendStrokeData(strokeData);
    });

    return () => {
      canvas.dispose();
    };
  }, []);

  const sendStrokeData = async (strokeData) => {
    try {
      const response = await fetch('http://your-backend-api.com/suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stroke: strokeData }),
      });

      const data = await response.json();
      handleResponse(data);  // Handle the response from the backend
    } catch (error) {
      console.error('Error sending stroke data:', error);
    }
  };

  const handleResponse = (data) => {
    // Display the response on the canvas
    data.forEach(stroke => {
      const path = new fabric.Path(stroke.map(point => `L ${point[0]} ${point[1]}`).join(' '), {
        stroke: 'red',  // Customize stroke color
        fill: 'transparent',
      });
      canvasRef.current.add(path);
    });
  };

  return (
    <canvas ref={canvasRef} width={800} height={600} />
  );
};

export default CanvasComponent;
