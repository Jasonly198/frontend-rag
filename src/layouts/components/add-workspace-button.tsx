import type { ButtonProps } from '@mui/material/Button';
import React, { useState } from 'react';

import Button from '@mui/material/Button';
import { DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';


// ----------------------------------------------------------------------

export function AddWorkspaceButton({ sx, ...other }: ButtonProps) {


  return (
    <Button variant="soft" size="small" color="inherit"
        sx={{
            // width: '170px', 
            height: '38px',
            fontSize: '14px', 
            border: '1px solid #C0C0C0',
            ...sx 
        }}
        {...other}
    >
      Add Workspace
    </Button>
    
  );
}