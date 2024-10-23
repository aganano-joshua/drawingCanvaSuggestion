/* eslint-disable react/display-name */
import {
    useRef,
    useEffect,
    useState,
    forwardRef,
    useImperativeHandle,
    useCallback,
  } from 'react';
  import './DrawingBoard.css';
  // import { Button } from '@chakra-ui/react';
  import DrawingControl from './DrawingControl'
  
  const DrawingBoard = forwardRef(({ selectedTool, selectTool }, ref) => {
    const canvasRef = useRef(null);
    const colorPaletteRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const lastDrawTimeRef = useRef(0);
    const [showPopup, setShowPopup] = useState(false);
    const [textInput, setTextInput] = useState(''); // Text input state
    const [textPosition, setTextPosition] = useState(null); // Track text position
    const [isTyping, setIsTyping] = useState(false); // Manage typing state
  
    // State for brush size and color
    const [selectedColor, setSelectedColor] = useState('#000000');
    const [brushSize, setBrushSize] = useState(5);
  
    useImperativeHandle(ref, () => ({
      printCanvas: () => {
        const canvas = canvasRef.current;
        const dataUrl = canvas.toDataURL();
        const windowContent = `
          <html>
          <head><title>Print canvas</title></head>
          <body><img src="${dataUrl}" onload="window.print();window.close()"></body>
          </html>`;
        const printWin = window.open('', '', 'width=800,height=600');
        printWin.document.open();
        printWin.document.write(windowContent);
        printWin.document.close();
      },
      clearCanvas: () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
      },
      shareCanvas: () => {
        const canvas = canvasRef.current;
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'drawing.png';
        link.click();
      },
    }));
  
    useEffect(() => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      context.lineCap = 'round';
      context.lineWidth = brushSize;
      context.strokeStyle = selectedColor;
  
      const startDrawing = (event) => {
        event.preventDefault();
        setIsDrawing(true);
        setShowPopup(true);
        const { x, y } = getPos(canvas, event);
        context.beginPath();
        context.moveTo(x, y);
      };
  
      const draw = (event) => {
        if (!isDrawing) return;
        const currentTime = new Date().getTime();
        if (currentTime - lastDrawTimeRef.current > 16) {
          const { x, y } = getPos(canvas, event);
          context.lineTo(x, y);
          context.stroke();
          lastDrawTimeRef.current = currentTime;
        }
      };
  
      const stopDrawing = () => {
        setIsDrawing(false);
        context.closePath();
      };
  
      const getPos = (canvas, event) => {
        const rect = canvas.getBoundingClientRect();
        const touch = event.touches ? event.touches[0] : event;
        return {
          x: (touch.clientX - rect.left) * (canvas.width / rect.width),
          y: (touch.clientY - rect.top) * (canvas.height / rect.height),
        };
      };
  
      canvas.addEventListener('mousedown', startDrawing);
      canvas.addEventListener('mousemove', draw);
      canvas.addEventListener('mouseup', stopDrawing);
      canvas.addEventListener('mouseleave', stopDrawing);
      canvas.addEventListener('touchstart', startDrawing);
      canvas.addEventListener('touchmove', draw);
      canvas.addEventListener('touchend', stopDrawing);
  
      return () => {
        canvas.removeEventListener('mousedown', startDrawing);
        canvas.removeEventListener('mousemove', draw);
        canvas.removeEventListener('mouseup', stopDrawing);
        canvas.removeEventListener('mouseleave', stopDrawing);
        canvas.removeEventListener('touchstart', startDrawing);
        canvas.removeEventListener('touchmove', draw);
        canvas.removeEventListener('touchend', stopDrawing);
      };
    }, [isDrawing]);
  
    useEffect(() => {
      if (textPosition && !isTyping && selectedTool === 'text') {
        drawTextOnCanvas();
      }
    }, [textPosition, isTyping, textInput, selectedTool]);
  
    const drawTextOnCanvas = () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Clear any existing drawing where the text was placed before drawing new text
      context.clearRect(0, 0, canvas.width, canvas.height);
  
      context.font = '20px Arial'; // Set font size and style
      context.fillStyle = selectedColor; // Set the text color
      context.fillText(textInput, textPosition.x, textPosition.y); // Draw the text at the position
    };
  
    const handleCanvasClick = (event) => {
      if (selectedTool === 'text') {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) * (canvas.width / rect.width);
        const y = (event.clientY - rect.top) * (canvas.height / rect.height);
  
        // Place the text input at the clicked position
        setTextPosition({ x, y });
        setIsTyping(true); // Enable text input mode
      }
    };
  
    const handleTextInputChange = (event) => {
      setTextInput(event.target.value);
    };
  
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        setIsTyping(false); // Exit typing mode after pressing 'Enter'
        drawTextOnCanvas(); // Draw the text after editing is complete
      }
    };
  
  
  
    useEffect(() => {
      const handleClickOutside = (event) => {
        // If the click is outside the color palette, switch to 'pen'
        if (colorPaletteRef.current && !colorPaletteRef.current.contains(event.target)) {
          selectTool('pen');
        }
      };
  
      // Add event listener when the component mounts
      document.addEventListener('mousedown', handleClickOutside);
  
      // Cleanup event listener when the component unmounts
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [selectTool]);
  
    useEffect(() => {
      const context = canvasRef.current.getContext('2d');
      switch (selectedTool) {
        case 'pen':
          context.globalCompositeOperation = 'source-over';
          context.strokeStyle = 'black';
          context.lineWidth = 1;
          break;
        case 'brush':
          context.globalCompositeOperation = 'source-over';
          context.strokeStyle = 'blue';
          context.lineWidth = 5;
          break;
        case 'eraser':
          context.globalCompositeOperation = 'destination-out';
          context.lineWidth = 10;
          break;
        case 'text':
          break;
        case 'trash':
          break;
        default:
          break;
      }
    }, [selectedTool]);
  
  
    return (
      <>
  
  {isTyping && selectedTool === 'text' && (
          <input
            type="text"
            value={textInput}
            onChange={handleTextInputChange}
            onKeyPress={handleKeyPress}
            className="absolute"
            style={{
              position: 'absolute',
              zIndex: 1000,
              top: `${textPosition?.y}px`,
              left: `${textPosition?.x}px`,
              color: selectedColor, // Matches text color with the chosen color
            }}
          />
        )}
  
        {selectedTool === 'color' && (
          <DrawingControl
            ref={colorPaletteRef}
            onColorChange={handleColorChange}
            onBrushSizeChange={handleBrushSizeChange}
          />
        )}
        <div className="canvas-container flex h-full w-full justify-center items-center" style={{ border: "2px solid black", borderRadius: "1px solid blac" }}>
          <canvas onClick={handleCanvasClick} ref={canvasRef} width={1650} height={750} id="drawingCanvas" />
        </div>
      </>
    );
  })
  
  export default DrawingBoard;
  