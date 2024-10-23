import React, { useRef, useEffect, useState } from 'react';

const Canvas = () => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastX, setLastX] = useState(0);
    const [lastY, setLastY] = useState(0);
    const [strokes, setStrokes] = useState([]);

    const handleMouseDown = (e) => {
        setIsDrawing(true);
        const rect = canvasRef.current.getBoundingClientRect();
        setLastX(e.clientX - rect.left);
        setLastY(e.clientY - rect.top);
    };

    const handleMouseMove = (e) => {
        if (!isDrawing) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newStroke = { x1: lastX, y1: lastY, x2: x, y2: y };
        setStrokes((prevStrokes) => [...prevStrokes, newStroke]);

        const ctx = canvasRef.current.getContext('2d');
        ctx.strokeStyle = 'black'; // Ensure stroke color is set
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.closePath();

        setLastX(x);
        setLastY(y);
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
        sendStrokes();
    };

    const sendStrokes = async () => {
        // Your sending logic...
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.lineWidth = 2; // Set the line width
        ctx.lineCap = 'round'; // Set line cap
    }, []);

    return (
        <canvas
            ref={canvasRef}
            width={800}
            height={600}
            style={{ border: '1px solid black' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        />
    );
};

export default Canvas;
