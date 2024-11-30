import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { paths } from 'src/routes/paths';
import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';
import { DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import request from 'src/utils/request';

// ----------------------------------------------------------------------

// 定义 ButtonData 接口
interface ButtonData {
  id: number;
  name: string;
  createTime: string;
  updateTime: string;
  fileNum: number;
}

type Props = {
  title?: string;
};

export function DatabaseChoiceView({ title = 'Blank' }: Props) {
  const [open, setOpen] = useState(false);
  const [databaseName, setDatabaseName] = useState('');
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  // useState<ButtonData[]> 表示 buttons 是 ButtonData 对象的数组
  const [buttons, setButtons] = useState<ButtonData[]>([]);

  // 规范时间显示形式YYYY-MM-DD HH:mm:ss
  dayjs.extend(utc);
  dayjs.extend(timezone);


  // 打开对话框
  const handleClickOpen = () => {
    setOpen(true);
  };

  // 关闭对话框
  const handleClose = () => {
    setOpen(false);
  };

  // create按钮
  const handleCreate = async () => {
    try {
      console.log('database', databaseName);
      // 发送请求到后端
      const response = await request.post('/ragApplications/kdb/add', null, { params: { dbname: databaseName } });
      console.log('Response:', response.data);
      if (response.status === 200) {
        console.log('Database created successfully');
        // 可以在这里处理成功后的逻辑，比如关闭对话框
        handleClose();
      } else {
        console.error('Failed to create database');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Search按钮
  const handleSearch = async () => {
    try {
      const response = await request.get<ButtonData[]>('/ragApplications/kdb/search', { params: { dbname: searchText } });
      const buttonData = response.data; // 假设后端返回的数据是一个字符串数组
      setButtons(buttonData);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // 向后端传递要查询的数据库的id
  const handleButtonClick = (id : number) => {
    navigate(paths.navigation.files_list, { state: { id } }); // 只传递 id
  };


  // 页面加载时从后端获取按钮数据
  useEffect(() => {
    const fetchButtons = async () => {
      try {
        const response = await request.get<ButtonData[]>('/ragApplications/kdb/list');
        setButtons(response.data); // 假设后端返回的数据直接是按钮数组
      } catch (error) {
        console.error('Failed to fetch button data:', error);
      }
    };

    fetchButtons();
  }, []);

  return (

    <DashboardContent maxWidth="xl">
      <Typography variant="h4"> {title} </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between', // 搜索框靠左，按钮靠右
          alignItems: 'center',
          my: 2, // 上下的外边距，给标题和Box元素一些间距
        }}
      >
        {/* 搜索框和搜索按钮 */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            placeholder="Search"
            variant="outlined"
            size="small"
            sx={{ mr: 1 }} // 右侧边距用于按钮间隔
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button variant="contained" onClick={handleSearch}>Search</Button>
        </Box>

        {/* 右侧按钮 */}
        <Button variant="outlined" onClick={handleClickOpen} sx={{backgroundColor: 'blue',color: 'white'}}>Create New database</Button>
        {/* 对话框 */}
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
          <DialogTitle>Create Knowledge Database:</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Database Name:
            </DialogContentText>
            {/* 文本输入框 */}
            <TextField
              autoFocus
              margin="dense"
              label="Database Name"
              fullWidth
              variant="outlined"
              value={databaseName}
              onChange={(e) => setDatabaseName(e.target.value)}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleCreate} color="primary">
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </Box>


      <Box
        sx={{
          maxHeight: '400px', // 设置最大高度
          overflowY: 'auto', // 启用垂直滚动
          display: 'flex',
          flexWrap: 'wrap', // 允许换行
          gap: 2, // 按钮之间的间距
        }}
      >
        {buttons.map((button) => (
          <Button
            key={button.id}
            sx={{
              width: '200px', // 固定宽度
              height: '200px', // 固定高度
              borderRadius: 2,
              bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.04),
              border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              padding: 2, // 添加内边距
              boxSizing: 'border-box', // 确保内边距和边框计算在总宽度和高度内
            }}
            onClick={() => handleButtonClick(button.id)}
            // onClick={() => navigate(paths.navigation.files_list)}
          >
            <Typography variant="h6" sx={{ marginBottom: 1 }}>
              {button.name}
            </Typography>
            <Typography variant="body2">{button.fileNum} Docs</Typography>
            <Typography variant="body2">{dayjs(button.updateTime).tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss')}</Typography>
          </Button>
        ))}
      </Box>
    </DashboardContent>
  );
}
