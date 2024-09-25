import { useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#a161eef3',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

const examples = [
  {
    title: 'Groups, Fields, and Rings',
    content: 'What I understood from groups, fields, rings is that a Group is a set in which you can perform only one operation either addition or multiplication. A Ring is a set equipped with two operations addition and multiplication. Also a ring is a GROUP under addition but not a group for multiplication. Whereas a Field is a group under both addition and multiplication.',
  },
  {
    title: 'Subgroups',
    content: 'The meaning of subgroup that i understood is that a subgroup is a subset of a group. H is a subgroup of a group G if it is a subset of G, and follows all conditions that are required to form a group',
  },
  {
    title: 'Sets',
    content: 'What i learnt is that Sets in mathematics, are simply a collection of distinct objects forming a group. A set can have any group of items, be it a collection of numbers, days of a week, types of vehicles etc.',
  },
];

const SummaryExamples = () => {
    const navigate = useNavigate();
    const handleBackClick = () => {
		navigate('/course');
	  };
  return (
    <ThemeProvider  theme={darkTheme}>
      <CssBaseline />
      <Container  sx={{ py: 4,justifyContent:"center",textAlign:"center",border:"2px solid black" ,my:"5px" ,backgroundColor:"#121212",borderRadius: "5px",maxWidth:"800px"}}>
        <Typography variant="h3" component="h1"  sx={{ color: 'primary.main' }}>
          Summary Examples
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 ,color:'secondary.main',fontWeight:'700'}}>
          Here are some examples of well-written summaries to guide you in submitting your own.
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {examples.map((example, index) => (
            <Paper key={index} elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h5" component="h2"  sx={{ color: 'secondary.main' }}>
                Example {index}:
              </Typography>
              
              <Typography variant="h5" component="h2"  sx={{ color: 'secondary.main' }}>  
              <span style={{color: '#f48fb1',fontSize:"1.5rem",textDecoration:'underline'}}>Title</span>
              <span style={{color: '#f48fb1',fontSize:"1.5rem"}}> - </span>
                {example.title}
              </Typography>
              
              <Typography variant="body1">
                <span style={{color: '#f48fb1',fontSize:"20px",textDecoration:'underline'}}>Summary</span>
                <span style={{color: '#f48fb1',fontSize:"20px"}}> : </span>
                {example.content}</Typography>
            </Paper>
          ))}
        </Box>
        <Button sx={{mt:2}} onClick={handleBackClick} variant="contained">Go Back</Button>
      </Container>
      
    </ThemeProvider>
  );
};

export default SummaryExamples;