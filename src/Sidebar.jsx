import { useState } from 'react'
// import { assets } from  '../../../Images/assets'
// import { Button } from '@/components/ui/button'
import Delete from '../../components/Delete'

const tools = [
  { name: 'pen', url: 'assets.image40' },
  { name: 'brush', url: 'assets.image10' },
  { name: 'eraser', url: 'assets.image19' },
  { name: 'color', url: 'assets.image8' },
  { name: 'text', url: 'assets.text' },
]


const Sidebar = ({ selectTool, selectedTool}) => {
  const [loading, setLoading] = useState(false);

    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const showPopup = () => {
      setIsPopupVisible(true);
    };

    const hidePopup = () => {
      setIsPopupVisible(false);
    };
  return (
    <div style={{borderTop: "5px solid white"}} className="pl-[1rem] flex h-[6rem] absolute bottom-0 flex-row w-full justify-center items-center bg-[#096566]">
      {tools.map((tool) => (
        <button
          key={tool.name}
          style={{ height: "3rem", width: "3rem", borderRadius: "15px" , backgroundColor: selectedTool === tool.name ? '#b9b9b9' : '#ffffff' }}
          className={`mr-[1rem] flex items-center  ${selectedTool === tool.name ? '' : ''
            }`}
          onClick={() => selectTool(tool.name)}
        >
          <img className='w-[2rem] h-[2rem]' src={tool.url} alt={tool.name} id={tool.name} />
        </button>
      ))}
        <button
        style={{ height: "3rem", width: "3rem", borderRadius: "15px"}}
        className='mr-[1rem] flex items-center bg-[white]'
        onClick={showPopup}
      >
        <img className='w-[2rem] h-[2rem]' src='assets.trashCan' />
      </button>
      {/* <Delete isVisible={isPopupVisible} onClose={hidePopup}/> */}
    </div>
  )
}

export default Sidebar
