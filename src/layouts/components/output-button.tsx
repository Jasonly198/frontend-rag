import type { ButtonProps } from '@mui/material/Button';

import Button from '@mui/material/Button';


// ----------------------------------------------------------------------

export function OutputButton({ sx, ...other }: ButtonProps) {
  return (
    <Button variant="soft" size="small" color="inherit"
        sx={{
            width: '100px', 
            height: '40px',
            fontSize: '14px', 
        }}
        {...other}
    >
      Output
    </Button>
  );
}