import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Grid, Typography, Paper } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import MapIcon from '@mui/icons-material/Map';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: 'center',
          py: 6,
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Connect With Your Local Community
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Discover and join events happening near you, or host your own and meet new people.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/events')}
            sx={{ mx: 1, px: 4 }}
          >
            Browse Events
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/events/create')}
            sx={{ mx: 1, px: 4 }}
          >
            Host an Event
          </Button>
        </Box>
      </Box>

      {/* Feature Section */}
      <Box sx={{ py: 6 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={2}
              sx={{
                p: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <EventIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Discover Local Events
              </Typography>
              <Typography color="text.secondary">
                Find events happening around you, from hobby meetups to community gatherings.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={2}
              sx={{
                p: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <PeopleIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Connect with People
              </Typography>
              <Typography color="text.secondary">
                Meet others in your community who share your interests and passions.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={2}
              sx={{
                p: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <MapIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Location-Based Discovery
              </Typography>
              <Typography color="text.secondary">
                Find events near you with our location-based filtering system.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Call to Action */}
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Ready to get started?
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Join our community today and start discovering local events.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate('/register')}
          sx={{ mt: 2 }}
        >
          Sign Up Now
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;