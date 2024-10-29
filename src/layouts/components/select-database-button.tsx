import type { ButtonProps } from '@mui/material/Button';

import Button from '@mui/material/Button';


// ----------------------------------------------------------------------

export function SelectDatabaseButton({ sx, ...other }: ButtonProps) {
  return (
    <Button variant="soft" size="small" color="inherit"
        sx={{
            width: '270px', 
            height: '40px',
            fontSize: '16px', 
            ...sx 
        }}
        {...other}
    >
      Select Database
    </Button>
  );
}