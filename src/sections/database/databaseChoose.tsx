import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Pagination from '@mui/material/Pagination';
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
  const [currentPage, setCurrentPage] = useState(1); // 当前页
  const [itemsPerPage] = useState(8); // 每页显示 6 个按钮
  const [hoveredButtonId, setHoveredButtonId] = useState<number | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // 删除对话框开关
  const [deletingId, setDeletingId] = useState<number | null>(null); // 当前正在删除的数据库 ID
  const [error, setError] = useState(''); // 添加错误状态来存储错误信息

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
    setError(''); // 关闭对话框时清除错误信息
  };

  // create按钮
  const handleCreate = async () => {
    // 格式验证：检查数据库名称是否合法
    const regex = /^[\u4e00-\u9fa5a-zA-Z0-9_ ]{1,20}$/;
    if (!regex.test(databaseName)) {
      setError('The name format is incorrect (1-20 characters: Chinese, letters, numbers, underscores, or Spaces)');
      return; // 阻止继续执行
    }

    try {
      console.log('database', databaseName);
      // 发送请求到后端
      const response = await request.post('/ragApplications/kdb/add', null, { params: { dbname: databaseName } });
      console.log('Response:', response.data);
      if (response.status === 200) {
        console.log('Database created successfully');
        // 成功后更新页面按钮数据
        const updatedButtons = await fetchButtons();
        setButtons(updatedButtons); // 更新按钮列表
        // 关闭对话框
        handleClose();
      } else {
        console.error('Failed to create database');
        // 显示后端返回的错误信息
        setError(response.data);
      }
    } catch (e) {
      console.error('Error:', e);
      // 处理不同的错误情况
      if (e.response) {
        // 这里是正常的后端错误
        setError(e.response.data);
      } else if (e.request) {
        // 请求已经发出，但没有收到响应
        setError('The server is not responding, please try again later');
      } else {
        // 其他错误
        setError('An error occurred while creating the database. Please try again later');
      }
    }
  };

  // Search按钮
  const handleSearch = async () => {
    try {
      const response = await request.get<ButtonData[]>('/ragApplications/kdb/search', { params: { dbname: searchText } });
      const buttonData = response.data; // 假设后端返回的数据是一个字符串数组
      setButtons(buttonData);
    } catch (e) {
      console.error('Error:', e);
    }
  };

  // 向后端传递要查询的数据库的id
  const handleView = (id : number) => {
    navigate(paths.navigation.files_list, { state: { id } }); // 只传递 id
  };

  // 获取按钮数据（从后端）
  const fetchButtons = async () => {
    try {
      const response = await request.get<ButtonData[]>('/ragApplications/kdb/list');
      return response.data; // 返回按钮数据
    } catch (e) {
      console.error('Failed to fetch button data:', e);
      return [];
    }
  };

  // 页面加载时从后端获取按钮数据
  useEffect(() => {
    const fetchData = async () => {
      const buttonData = await fetchButtons();
      setButtons(buttonData); // 更新按钮列表
    };

    fetchData();
  }, []);

  // 计算分页
  const totalPages = Math.ceil(buttons.length / itemsPerPage); // 总页数
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page); // 设置当前页
  };

  // 获取当前页需要显示的按钮
  const currentButtons = buttons.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDelete = async (id: number) => {
    try {
      const response = await request.post(`/ragApplications/kdb/delete`, null, { params: { dbId: id } });
      if (response.status === 200) {
        // 删除成功，重新获取按钮列表
        const updatedButtons = await fetchButtons();
        setButtons(updatedButtons);
      }
    } catch (e) {
      console.error('删除数据库时出错', e);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeletingId(id);  // 设置待删除的数据库 ID
    setOpenDeleteDialog(true);  // 显示删除确认对话框
  };


  const handleMouseEnter = (id: number) => {
    setHoveredButtonId(id); // 鼠标悬停时记录按钮ID
  };

  const handleMouseLeave = () => {
    setHoveredButtonId(null); // 鼠标移开时清除按钮ID
  };


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
              error={!!error} // 如果有错误，显示错误样式
              helperText={error} // 显示错误信息
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

      {/* 按钮展示 */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        {currentButtons.map((button) => (
          <Box
            key={button.id}
            sx={{
              position: 'relative', // 让删除按钮和查看按钮能够绝对定位
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
              '&:hover': {
                bgcolor: 'grey.200',
              },
            }}
            onMouseEnter={() => handleMouseEnter(button.id)}
            onMouseLeave={handleMouseLeave}
            // onClick={() => handleButtonClick(button.id)}

          >
            <Typography variant="h6" sx={{ marginBottom: 1 }}>
              {button.name}
            </Typography>
            <Typography variant="body2">{button.fileNum} Docs</Typography>
            <Typography variant="body2">{dayjs(button.updateTime).tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss')}</Typography>

            {/* 鼠标悬停时显示的查看和删除按钮 */}
            {hoveredButtonId === button.id && (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    padding: '5px 10px',
                    fontSize: '12px',
                    zIndex: 10, // 确保按钮浮现出来时处于最上层
                  }}
                  onClick={(e) => {
                    e.stopPropagation(); // 防止触发父级按钮点击事件
                    handleView(button.id); // 触发查看操作
                  }}
                >
                  View
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    padding: '5px 10px',
                    fontSize: '12px',
                    zIndex: 10,
                  }}
                  onClick={(e) => {
                    e.stopPropagation(); // 防止触发父级按钮点击事件
                    handleDeleteClick(button.id); // 显示确认对话框
                  }}
                >
                  Delete
                </Button>
              </>
            )}

          </Box>
        ))}
      </Box>
      {/* 分页组件 */}
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
      />

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this knowledge base?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={async () => {
              if (deletingId !== null) {
                await handleDelete(deletingId); // 删除数据库
              }
              setOpenDeleteDialog(false); // 关闭对话框
            }}
            color="error"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

    </DashboardContent>
  );
}
