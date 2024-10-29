// import ButtonGroup from '@mui/material/ButtonGroup';
// import Button from '@mui/material/Button';
// import type { ButtonProps } from '@mui/material/Button';
// import React, { useState } from 'react';
// import { buttonGroup } from 'src/theme/core/components/button-group';


// export function FunctionButtonGroup({ sx, ...other }: ButtonProps) {
//     const [selectedButton, setSelectedButton] = useState('Chat'); // 初始选中的按钮

//     const handleButtonClick = (buttonName: string) => {
//       setSelectedButton(buttonName);
//     };

//   return (
//     <ButtonGroup      
//     variant="contained"
//     aria-label="Button group"
//     sx={{
//         backgroundColor: 'white',
//         '& .MuiButtonBase-root': {
//             borderRight: '1px solid #C0C0C0', 
//         },
//         border: '1px solid #C0C0C0'
//     }}
        
//     >
//       <Button onClick={() => handleButtonClick('Database')} sx={{ color: selectedButton === 'Database' ? 'inherit' : '#C0C0C0',  backgroundColor: 'white'}}>Database</Button>
//       <Button onClick={() => handleButtonClick('Chat')} sx={{ color: selectedButton === 'Chat' ? 'inherit' : '#C0C0C0', backgroundColor: 'white'}}>Chat</Button>
//       <Button onClick={() => handleButtonClick('File Management')} sx={{ color: selectedButton === 'File Management' ? 'inherit' : '#C0C0C0', backgroundColor: 'white' }}>File Management</Button>
//     </ButtonGroup>
//   );
// }

import { ButtonGroup, Button, ButtonProps } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 导入 useNavigate 替代 useHistory
import { paths } from 'src/routes/paths'; 

export function FunctionButtonGroup({ sx, ...other }: ButtonProps) {
  const [selectedButton, setSelectedButton] = useState('Chat'); // 初始选中的按钮
  const navigate = useNavigate(); // 使用 useNavigate 获取导航函数

  const handleButtonClick = (buttonName : string) => {
    setSelectedButton(buttonName);

    // 根据按钮名称导航到不同页面
    switch (buttonName) {
      case 'Database':
        navigate(paths.navigation.database); // 设定数据库页面的路径
        break;
      case 'Chat':
        navigate(paths.navigation.root); // 设定聊天页面的路径
        break;
      case 'File Management':
        navigate(paths.navigation.file_management); // 设定文件管理页面的路径
        break;
      default:
        break;
    }
  };

  return (
    <ButtonGroup
      variant="contained"
      aria-label="Button group"
      sx={{
        backgroundColor: 'white',
        '& .MuiButtonBase-root': {
          borderRight: '1px solid #C0C0C0',
        },
        border: '1px solid #C0C0C0'
      }}
    >
      <Button onClick={() => handleButtonClick('Database')} sx={{ color: selectedButton === 'Database' ? 'inherit' : '#C0C0C0', backgroundColor: 'white' }}>Database</Button>
      <Button onClick={() => handleButtonClick('Chat')} sx={{ color: selectedButton === 'Chat' ? 'inherit' : '#C0C0C0', backgroundColor: 'white' }}>Chat</Button>
      <Button onClick={() => handleButtonClick('File Management')} sx={{ color: selectedButton === 'File Management' ? 'inherit' : '#C0C0C0', backgroundColor: 'white' }}>File Management</Button>
    </ButtonGroup>
  );
}