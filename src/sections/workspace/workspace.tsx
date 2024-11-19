import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';
import { DialogActions, DialogContent, DialogTitle, DialogContentText, Select, MenuItem } from '@mui/material';
import { AddWorkspaceButton } from 'src/layouts/components/add-workspace-button';
import request from 'src/utils/request';

type Props = {
    title?: string;
  };

// 定义 WorkspaceData 接口
interface WorkspaceData {
  id: number;
  name: string;
  createTime: string;
  updateTime: string;
  selectedDatabase : string;
}

// 定义 DatabaseData 接口
interface DatabaseData {
  id: number;
  name: string;
  createTime: string;
  updateTime: string;
  fileNum: number;
}


export function WorkspaceView({ title = 'Blank' }: Props) {
    const [open, setOpen] = useState(false);
  
  // 打开对话框
    const handleClickOpen = () => {
      setWorkspaceName(''); // 重置 workspaceName 状态为空字符串
      setSelectedDatabase(''); // 重置 selectedDatabase 状态为默认值
      setOpen(true);
    };
  
  // 关闭对话框
    const handleClose = () => {
      setOpen(false);
    };
  
    const navigate = useNavigate();
  
    const handleButton1Click = () => {
      // 跳转到 PageTest 页面 预备为test页面
      navigate('/workspace');
    };

    const [workspaceName, setWorkspaceName] = useState('');
    const [selectedDatabase, setSelectedDatabase] = React.useState('');

    const handleDatabaseChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
      setSelectedDatabase(event.target.value);
    };

    const handleWorkspaceNameChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
      setWorkspaceName(event.target.value);
     };

    const handleSelectOpen = () => {
        setSelectedDatabase('');
      };

    const [buttons, setButtons] = useState<WorkspaceData[]>([]);

    const fetchWorkspaces = async () => {
      try {
        const response = await request.get<WorkspaceData[]>('/ragApplications/workspace/list');
        setButtons(response.data); // 假设后端返回的数据直接是按钮数组
      } catch (error) {
        console.error('Failed to fetch workspace data:', error);
      }
    };
    
    useEffect(() => {
      fetchWorkspaces();
    }, []);


    const handleCreate = async () => {
          const addworkspaceresponse= await request.post('/ragApplications/workspace/add', {
              name: workspaceName,
              selectedDatabase
            }).then(response => {
              // 请求成功处理逻辑
              handleClose(); // 关闭对话框
              window.location.reload();
              // fetchWorkspaces();
          })
          .catch(error => {
            // 请求失败处理逻辑
            console.error('Error creating workspace:', error);
        });
    };


  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);



  const handleDeleteButtonClick = (id: number) => {
    setSelectedItemId(id !== selectedItemId ? id : null); // 设置要删除的项目ID
    setOpenDeleteDialog(true); // 打开确认删除对话框
  };

    // 处理用户点击删除按钮，设置要删除的项目ID并打开确认删除对话框
    const handleEditButtonClick = (id: number) => {
      // setSelectedItemId(id !== selectedItemId ? id : null); // 设置要删除的项目ID
      // setOpenEditDialog(true); // 打开确认删除对话框
      const workspace = buttons.find(button => button.id === id);
      if (workspace) {
        setSelectedItemId(id);
        setWorkspaceName(workspace.name); // 设置工作区名称
        setSelectedDatabase(workspace.selectedDatabase); // 设置数据库
        setOpenEditDialog(true);
      }
    };

  const handleConfirmDelete = async () => {
    // 执行删除操作
    if (selectedItemId) {
        try {
            const deleteResponse = await request.delete(`/ragApplications/workspace/delete/${selectedItemId}`);
            // 处理删除成功的逻辑
            console.log(`Workspace with ID ${selectedItemId} deleted successfully`);
            // fetchWorkspaces(); 
            window.location.reload();
        } catch (error) {
            console.error('Error deleting workspace:', error);
        }
        setSelectedItemId(null); // 重置要删除的项目ID
        setOpenDeleteDialog(false); // 关闭确认删除对话框
    }
  };

  const handleCancelDelete = () => {
    setSelectedItemId(null); // 重置要删除的项目ID
    setOpenDeleteDialog(false); // 关闭确认删除对话框
  };


  const handleConfirmEdit = async () => {
    if (selectedItemId) {
        try {
            const EditResponse = await request.post(`/ragApplications/workspace/update`,{
              id: selectedItemId,
              name: workspaceName,
              selectedDatabase
            });
            console.log(`Workspace with ID ${selectedItemId} edited successfully`);
            // fetchWorkspaces(); 
            window.location.reload()
        } catch (error) {
            console.error('Error editing workspace:', error);
        }
        setSelectedItemId(null); // 重置要删除的项目ID
        setOpenEditDialog(false); // 关闭确认删除对话框
    }
  };

  const handleCancelEdit = () => {
    setSelectedItemId(null); // 重置要删除的项目ID
    setOpenEditDialog(false); // 关闭确认删除对话框
  };

  const [databases, setdatabases] = useState<DatabaseData[]>([]);

    // 页面加载时从后端获取按钮数据
    useEffect(() => {
      const fetchDatabases = async () => {
        try {
          const response = await request.get<DatabaseData[]>('/ragApplications/kdb/list');
          setdatabases(response.data); // 假设后端返回的数据直接是按钮数组
        } catch (error) {
          console.error('Failed to fetch button data:', error);
        }
      };
  
      fetchDatabases();
    }, []);

    
  
    return (
      <DashboardContent maxWidth="xl">
        <Typography variant="h4"> {title} </Typography>

        <AddWorkspaceButton
            onClick={handleClickOpen}
            sx={{
                marginTop:2,
                mr: 1,
                ml: -1,
                backgroundColor: 'white',
            }}
        />

        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogTitle>Add a new workspace:</DialogTitle>
            <DialogContent>
                <DialogContentText>
                Workspace Name:
                </DialogContentText>
                {/* 文本输入框 */}
                <TextField
                autoFocus
                margin="dense"
                value={workspaceName}
                onChange={handleWorkspaceNameChange} 
                fullWidth
                variant="outlined"
                />
                <DialogContentText>
                Database:
                </DialogContentText>

                <Select
                value={selectedDatabase}
                onChange={handleDatabaseChange}
                onOpen={handleSelectOpen}
                fullWidth
                variant="outlined"
                >
                {databases.map((database) => (
                  <MenuItem key={database.id} value={database.name}>
                    {database.name}
                  </MenuItem>
                 ))}
                </Select>
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
          <Box
            key={button.id}
            sx={{
              position: 'relative',
              width: '200px', // 固定宽度
              height: '200px', // 固定高度
              marginTop: 2,
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
          >
            <Typography variant="h6" sx={{ marginBottom: 1 }}>
              {button.name}
            </Typography>
            <Typography variant="body2"> </Typography>
            <Typography variant="body2">Database: {button.selectedDatabase}</Typography>

            <Box key={button.id}
              sx={{
                marginTop: 7, 
              }}
            >
              <button
                type="button"
                onClick={() => handleEditButtonClick(button.id)}
                style={{
                  cursor: 'pointer',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'primary.main',
                }}
              >
                <Typography variant="body2">Edit</Typography>
              </button>

            <Dialog open={openEditDialog} onClose={handleCancelEdit} maxWidth="xs" fullWidth>
            <DialogTitle>Edit this workspace:</DialogTitle>
            <DialogContent>
                <DialogContentText>
                Workspace Name:
                </DialogContentText>
                {/* 文本输入框 */}
                <TextField
                autoFocus
                margin="dense"
                value={workspaceName}
                onChange={handleWorkspaceNameChange} 
                fullWidth
                variant="outlined"
                />
                <DialogContentText>
                Database:
                </DialogContentText>

                <Select
                value={selectedDatabase}
                onChange={handleDatabaseChange}
                onOpen={handleSelectOpen}
                fullWidth
                variant="outlined"
                >
                {databases.map((database) => (
                  <MenuItem key={database.id} value={database.name}>
                    {database.name}
                  </MenuItem>
               ))}
                </Select>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleCancelEdit} color="primary">
                Cancel
                </Button>
                <Button onClick={handleConfirmEdit} color="primary">
                Confirm
                </Button>
            </DialogActions>
        </Dialog>



              <button
                type="button"
                onClick={() => handleDeleteButtonClick(button.id)}
                style={{
                  cursor: 'pointer',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'primary.main',
                }}
              >
                <Typography variant="body2">Delete</Typography>
              </button>
            </Box>

            <Dialog open={openDeleteDialog} onClose={handleCancelDelete}>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogContent>
                  <DialogContentText>Are you sure you want to delete this workspace?</DialogContentText>
              </DialogContent>
              <DialogActions>
                  <Button onClick={handleCancelDelete} color="primary">
                      Cancel
                  </Button>
                  <Button onClick={handleConfirmDelete} color="primary">
                      Confirm
                  </Button>
              </DialogActions>
          </Dialog>



          </Box>
        ))}
      </Box>
      </DashboardContent>
    );
  }
  