import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


import { useBoolean } from 'src/hooks/use-boolean';
import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';
import { InterfaceButton } from 'src/layouts/components/interface-button'
import { OutputButton } from 'src/layouts/components/output-button';
import { SelectDatabaseButton } from 'src/layouts/components/select-database-button';
import { Select, MenuItem, TextField } from '@mui/material';
import React, { useState, ChangeEvent } from 'react';

// ----------------------------------------------------------------------

type Props = {
  title?: string;
};

export function BlankView({ title = 'Blank' }: Props) {

  const mobileNavOpen = useBoolean();

  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" color= 'Inherit' > {title} </Typography>


      <Box sx={{ mt: 2 }}>
        <InterfaceButton onClick={mobileNavOpen.onTrue} />
        <OutputButton onClick={mobileNavOpen.onTrue} />
      </Box>

      <Box 
        sx={{
          mt: 0,
          width: 1,
          height: 580,
          borderRadius: 0,
          bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.04),
          border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
          display: 'flex'
        }}>
          <Box         
            sx={{
              mt: 2,
              width: 0.3,
              marginLeft: 2, 
              height: 400,
              borderRadius: 1,
              bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.04),
              border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
            }}>
            <Box
              sx={{
                mt: 2,
                width: 0.9,
                marginLeft: 2, 
                height: 220,
                borderRadius: 1,
                bgcolor: 'white',
                border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
              }}>
                <Box
                  sx={{
                    mt: 1,
                    width: 0.22,
                    marginLeft: 1, 
                    height: 25,
                    borderRadius: 1,
                    bgcolor: '#f2f2f2',
                    border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
                  }}>
                  <Typography variant="body2" textAlign="center">Status:</Typography>
                </Box>
                <Box
                  sx={{
                    mt: 1,
                    width: 0.95,
                    marginLeft: 1, 
                    height: 35,
                    borderRadius: 1,
                    bgcolor: 'white',
                    border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
                  }}>
                  <Typography variant="body2" textAlign="left"
                    sx={{
                      marginTop: 0.5, 
                      marginLeft: 1,
                    }}>Completed!</Typography>
                </Box>
                <Box
                  sx={{
                    mt: 3,
                    width: 0.43,
                    marginLeft: 1, 
                    height: 25,
                    borderRadius: 1,
                    bgcolor: '#f2f2f2',
                    border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
                  }}>
                  <Typography variant="body2" textAlign="center">Choose Model:</Typography>
                </Box>
                <Box
                  sx={{
                    mt: 1,
                    width: 0.95,
                    marginLeft: 1, 
                    height: 35,
                    borderRadius: 1,
                    bgcolor: 'white',
                    border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
                  }}>
                 <Select
                    variant="standard"
                    displayEmpty
                    renderValue={() => "Select a llm"}
                    sx={{ 
                      width: '90%', 
                      marginLeft: 1
                    }}
                >
                    <MenuItem value="" disabled>Select a llm</MenuItem>
                    <MenuItem value="llm1">llm 1</MenuItem>
                    <MenuItem value="llm2">llm 2</MenuItem>
                    <MenuItem value="llm3">llm 3</MenuItem>
                </Select>
                </Box>
            </Box>

            <Box
              sx={{
                mt: 2,
                width: 0.9,
                marginLeft: 2, 
                marginTop: 2, 
                height: 90,
                borderRadius: 1,
                bgcolor: 'white',
                border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
              }}>
                <Box
                  sx={{
                    mt: 1,
                    width: 0.32,
                    marginLeft: 1, 
                    height: 25,
                    borderRadius: 1,
                    bgcolor: '#f2f2f2',
                    border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
                  }}>
                  <Typography variant="body2" textAlign="center">Database:</Typography>
                </Box>
                <Box
                  sx={{
                    mt: 1,
                    width: 0.95,
                    marginLeft: 1, 
                    height: 35,
                    borderRadius: 1,
                    bgcolor: 'white',
                    border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
                  }}>
                  <Typography variant="body2" textAlign="left"
                    sx={{
                      marginTop: 0.5, 
                      marginLeft: 1,
                    }}>Course 1</Typography>
                </Box>
            </Box>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <SelectDatabaseButton onClick={mobileNavOpen.onTrue} 
                sx={{ 
                  mt: 2,
                  marginTop: 1,
                  marginLeft: 2,
                  width: 0.9
                  }}/>
            </div>
          </Box>
          <Box
              sx={{
                mt: 2,
                width: 0.9,
                marginRight: 2, 
                marginLeft: 2, 
                height: 550,
                borderRadius: 1,
                bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.04),
                border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
              }}>
              <Box
                sx={{
                  mt: 2,
                  width: 0.96,
                  marginLeft: 2, 
                  height: 450,
                  borderRadius: 1,
                  bgcolor: "white",
                  border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
                }}>
                  <Box
                  sx={{
                    mt: 1,
                    width: 0.09,
                    marginTop: 1, 
                    marginLeft: 2, 
                    height: 25,
                    borderRadius: 1,
                    bgcolor: '#f2f2f2',
                    border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
                    display: 'flex'
                  }}>
                    <img src="../assets/icons/navbar/ic-chat.svg" alt = ""/>
                    <Typography variant="body2" textAlign="center" >Chatbot</Typography>
                </Box>
              </Box>
              <TextField
                    label="Enter your message:"
                    variant="outlined"
                    value={inputValue}
                    onChange={handleInputChange}
                    sx={{ 
                      width: '96%', 
                      mt: 2,
                      marginLeft: 3,
                      marginBottom: 2,
                      bgcolor: 'white'
                    }}
                />
            </Box>
        </Box>
    </DashboardContent>
  );
}
