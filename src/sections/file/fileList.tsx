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
import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';
import { useLocation } from 'react-router-dom';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import request from 'src/utils/request';
import {Button, Checkbox, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
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
  const [downloadConfirmOpen, setDownloadConfirmOpen] = useState(false);
  const [fileToDownload, setFileToDownload] = useState<FileData | null>(null);
  // 批量删除状态
  const [isBatchDeleting, setIsBatchDeleting] = useState(false); // 是否处于批量删除模式
  const [selectedDeleteFiles, setSelectedDeleteFiles] = useState<number[]>([]);

  // 批量上传状态
  const [multiUploadOpen, setMultiUploadOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

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

  const handleOpen = () => { setOpen(true);};

  const handleClose = () => {
    setOpen(false);
    setSelectedFile(null);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage - 1);
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
          params: { dbId: id, fileId: fileToDelete.id, filename: fileToDelete.filename }
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

  // 处理文件下载点击事件
  const handleDownloadClick = (file: FileData) => {
    setFileToDownload(file); // 设置要下载的文件
    setDownloadConfirmOpen(true); // 打开下载确认对话框
  };

  // 处理确认下载
  const handleConfirmDownload = async () => {
    if (fileToDownload) {
      try {
        const response = await request.get(`/ragApplications/file/download`, {
          params: { objectName: fileToDownload.filename },
          responseType: 'blob', // 设置为下载文件
        });
        // 创建 Blob 对象并触发下载
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const url = window.URL.createObjectURL(blob); // 创建一个临时 URL 对象
        const link = document.createElement('a');
        link.href = url;
        link.download = fileToDownload.filename; // 设置文件名
        link.click(); // 模拟点击触发下载
        window.URL.revokeObjectURL(url); // 释放内存中的 URL 对象
      } catch (error) {
        console.error('Error downloading file:', error);
      }
    }
    setDownloadConfirmOpen(false); // 关闭确认对话框
    setFileToDownload(null); // 清除选中的文件
  };

  // 处理取消下载
  const handleCancelDownload = () => {
    setDownloadConfirmOpen(false);
    setFileToDownload(null); // 清除选中的文件
  };

  // --------------------------------打开批量上传对话框-------------------------------------
  const handleMultiUploadOpen = () => {
    setMultiUploadOpen(true);
  };

  // 关闭批量上传对话框
  const handleMultiUploadClose = () => {
    setMultiUploadOpen(false);
    setSelectedFiles([]); // 清空文件列表
  };

  // 处理文件选择（限制最多 5 个）
  const handleMultiFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);

      // 合并新旧文件，并去重
      let updatedFiles = Array.from(new Set([...selectedFiles, ...filesArray]));

      // 限制最多 5 个文件
      if (updatedFiles.length > 5) {
        alert("You can select up to 5 files !!");
        updatedFiles = updatedFiles.slice(0, 5);
      }
      console.log("Updated selected files:", updatedFiles);

      setSelectedFiles(updatedFiles);
    }
  };

  // 确认上传多个文件
  const handleMultiUploadConfirm = async () => {
    console.log("Selected Files:", selectedFiles);
    console.log("ID:", id);
    if (selectedFiles.length > 0 && id) {
      const formData = new FormData();

      // 关键：必须每个文件都有独立的 key
      selectedFiles.forEach((file, index) => {
        formData.append(`files`, file); // 这里 key 不能是 files[]
      });

      formData.append("dbId", id.toString());

      try {
        const response = await request.post('/ragApplications/file/uploadMultiple', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
          console.log('Files uploaded successfully');
          fetchData(page); // 刷新数据
        } else {
          console.error('Failed to upload files');
        }
      } catch (error) {
        console.error('Error uploading files:', error);
      }
    }
    handleMultiUploadClose();
  };
  // -----------------------------------批量删除文件-----------------------------------------
  const handleSelectDeleteFiles = (fileId: number) => {
    setSelectedDeleteFiles((prev) =>
      prev.includes(fileId) ? prev.filter((fileID) => fileID !== fileId) : [...prev, fileId]
    );
  };

  const handleBatchDelete = async () => {
    try {
      // 过滤出被选中的文件
      const selectedFileData = data.filter((file) => selectedDeleteFiles.includes(file.id));
      const ids = selectedFileData.map((file) => file.id);
      const dbId = id;
      const filenames = selectedFileData.map((file) => file.filename);

      await request.post('/ragApplications/file/deleteBatch', {
        ids,
        dbId,
        filenames,
      });
      // 更新前端数据
      setData((prev) => prev.filter((file) => !selectedDeleteFiles.includes(file.id)));
      setSelectedDeleteFiles([]);
      setIsBatchDeleting(false);
    } catch (error) {
      console.error('Batch delete failed:', error);
    }
  };

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4"> {title} </Typography>
      {/* 文件上传按钮 */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        {/* 文件批量删除按钮 */}
        {isBatchDeleting ? (
          <>
            <Button variant="contained" color="error" onClick={handleBatchDelete} sx={{ ml: 2 }} disabled={selectedDeleteFiles.length === 0}>
              Confirm Delete
            </Button>
            <Button variant="outlined" color="secondary"
              onClick={() => {
                setIsBatchDeleting(false);
                setSelectedDeleteFiles([]);
              }}
              sx={{ ml: 2, mr: 2 }}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button variant="contained" color="error" onClick={() => setIsBatchDeleting(true)} sx={{ ml: 2, mr: 2 }}>
            Batch Delete
          </Button>
        )}
        {/* 单个文件上传按钮 */}
        {/* <Button variant="contained" color="primary" onClick={handleOpen}>
          Upload File
        </Button> */}
        {/* 批量上传按钮 */}
        <Button variant="contained" color="primary" onClick={handleMultiUploadOpen} sx={{ ml: 2 }}>
          Upload Multiple Files
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

      {/* 批量上传对话框 */}
      <Dialog open={multiUploadOpen} onClose={handleMultiUploadClose}>
        <DialogTitle>Upload Multiple Files</DialogTitle>
        <DialogContent>
          <DialogContentText>Please select the files to upload (up to five).</DialogContentText>
          <input type="file" multiple onChange={handleMultiFileChange} />
          <ul>
            {selectedFiles.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleMultiUploadClose}>Cancel</Button>
          <Button onClick={handleMultiUploadConfirm} color="primary" disabled={selectedFiles.length === 0}>
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
                {isBatchDeleting && (
                  <TableCell>
                    {/* 当点击批量删除按钮时才会出现 */}
                  </TableCell>
                )}
                <TableCell>filename</TableCell>
                <TableCell>upload time</TableCell>
                <TableCell>operation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(data) && data.length > 0 ? (
                data.map((file, index) => (
                  <TableRow key={index}>
                    {isBatchDeleting && (
                      <TableCell>
                        {/* 当点击批量删除按钮时才会出现 */}
                        <Checkbox
                          checked={selectedDeleteFiles.includes(file.id)}
                          onChange={() => handleSelectDeleteFiles(file.id)}
                        />
                      </TableCell>
                    )}
                    <TableCell>{file.filename}</TableCell>
                    <TableCell>{dayjs(file.uploadTime).tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss')}</TableCell>
                    <TableCell>
                      {/* 在此添加操作按钮，目前为：单个文件下载以及删除 */}
                      <button type="button" onClick={() => handleDownloadClick(file)}>Download</button>
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
          page={page + 1}
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

      {/* 下载确认对话框 */}
      <Dialog open={downloadConfirmOpen} onClose={handleCancelDownload}>
        <DialogTitle>Confirm Download</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to download this file?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDownload}>Cancel</Button>
          <Button onClick={handleConfirmDownload} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

    </DashboardContent>
  );
}
