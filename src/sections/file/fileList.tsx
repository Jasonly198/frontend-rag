import {useCallback, useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Pagination from '@mui/material/Pagination';
import axios from 'axios';
import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';
import { useLocation } from 'react-router-dom';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import request from 'src/utils/request';
import {Button, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import Dialog from "@mui/material/Dialog";
// ----------------------------------------------------------------------

type FileData = {
  id: number;
  filename: string;
  dbId: number | null;
  uploadTime: string;
};

type Props = {
  title?: string;
};

export function FileListView({ title = 'Blank' }: Props) {
  const location = useLocation();
  const id = location.state?.id; // 从传递的 state 中获取 id
  const [data, setData] = useState<FileData[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<FileData | null>(null);

  // 规范时间显示形式YYYY-MM-DD HH:mm:ss
  dayjs.extend(utc);
  dayjs.extend(timezone);

  // 获取数据
  const fetchData = useCallback(async (pageNumber: number) => {
    try {
      const response = await request.get('/ragApplications/file/list', {
        params: { id, page: pageNumber},
      });

      // 设置文件列表和分页信息
      setData(response.data.content || []); // 确保 content 为数组
      setTotalPages(response.data.totalPages || 1);
      console.log('Response Data:', response.data); // 检查数据结构
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchData(page);
    } else {
      console.error("ID is missing, unable to fetch data.");
    }
  }, [id, page, fetchData]);// 将 fetchData 添加到依赖中

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFile(null);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleConfirm = async () => {
    if (selectedFile && id) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('dbId', id.toString());

      try {
        const response = await request.post('/ragApplications/file/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
          console.log('File uploaded successfully');
          fetchData(page); // 刷新数据
        } else {
          console.error('Failed to upload file');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }

    handleClose();
  };

  const handleDeleteClick = (file: FileData) => {
    // Open the confirmation dialog and set the selected file to delete
    setFileToDelete(file);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (fileToDelete) {
      try {
        // Send a Post request to the backend with the file id
        const response = await request.post(`/ragApplications/file/delete`,null,{
          params: { dbId: id, fileId: fileToDelete.id }
        });

        if (response.status === 200) {
          console.log('File deleted successfully');
          // Refresh the file list after deletion
          fetchData(page);
        } else {
          console.error('Failed to delete file');
        }
      } catch (error) {
        console.error('Error deleting file:', error);
      } finally {
        // Close the confirmation dialog and clear the selected file
        setConfirmOpen(false);
        setFileToDelete(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setFileToDelete(null);
  };


  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4"> {title} </Typography>

      {/* 文件上传按钮 */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Upload File
        </Button>
      </Box>

      {/* 文件上传对话框 */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Upload File</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please select a file to upload.
          </DialogContentText>
          <input
            type="file"
            onChange={handleFileChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Box
        sx={{
          mt: 5,
          width: 1,
          borderRadius: 2,
          bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.04),
          border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>filename</TableCell>
                <TableCell>upload time</TableCell>
                <TableCell>operation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(data) && data.length > 0 ? (
                data.map((file, index) => (
                  <TableRow key={index}>
                    <TableCell>{file.filename}</TableCell>
                    <TableCell>{dayjs(file.uploadTime).tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss')}</TableCell>
                    <TableCell>
                      {/* 在此添加操作按钮，例如下载或删除 */}
                      <button type="button">Download</button>
                      <button type="button" onClick={() => handleDeleteClick(file)}>Delete</button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    no file data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
        />
      </Box>
      {/* 文件删除确认对话框 */}
      <Dialog open={confirmOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this file?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

    </DashboardContent>
  );
}
