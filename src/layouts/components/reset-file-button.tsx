import type { ButtonProps } from '@mui/material/Button';

import Button from '@mui/material/Button';


// ----------------------------------------------------------------------

export function ResetFileButton({ sx, ...other }: ButtonProps) {
  return (
    <Button variant="soft" size="small" color="inherit"
        sx={{
            width: '130px', 
            height: '40px',
            fontSize: '16px', 
            ...sx 
        }}
        {...other}
    >
      Reset
    </Button>
  );
}