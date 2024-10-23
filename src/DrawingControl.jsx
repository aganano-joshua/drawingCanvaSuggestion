/* eslint-disable react/prop-types */
import { useState } from 'react';

const DrawingControls = ({ onColorChange, onBrushSizeChange }) => {
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);

  // Handle color change
  const handleColorChange = (value) => {
    setColor(value.toHexString());
    onColorChange(value.toHexString());
  };

  // Handle brush size change
  const handleBrushSizeChange = (value) => {
    setBrushSize(value);
    onBrushSizeChange(value);
  };

  return (
    <div className='z-[50] flex pl-[25px] pt-[20px] left-0 flex-col absolute h-[80%] left-[8rem] top-[3rem] w-[20rem] bg-[white]' style={{borderRight: "1px solid rgba(0, 0, 0, 0.165)"}}>
          <h4 className='font-bold'>Brush Color:</h4>
          {/* <ColorPicker value={color} className='w-[10px]' onChange={handleColorChange} />
          <h4 className='font-bold'>Brush Size:</h4>
          <Slider
            min={1}
            max={30}
            value={brushSize}
            onChange={handleBrushSizeChange}
          /> */}
    </div>
  );
};

export default DrawingControls;
