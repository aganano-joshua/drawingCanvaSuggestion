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
        try {
            const response = await fetch('http://localhost:5000/api/strokes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(strokes),
            });
            const data = await response.json();
            console.log('Response from backend:', data);
            // Optionally render the response strokes on the canvas
            drawSuggestedStrokes(data);
        } catch (error) {
            console.error('Error sending strokes:', error);
        }
    };

    const drawSuggestedStrokes = (suggestedStrokes) => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.strokeStyle = 'red'; // Color for suggested strokes
        suggestedStrokes.forEach(({ x1, y1, x2, y2 }) => {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.closePath();
        });
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
